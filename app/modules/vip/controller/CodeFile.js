import { isPathSafe } from "../../../helper/path.js";
import { getFileTree } from "../../../helper/file.js";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { Controller, helper, common, Paths } from "chanjs";

const { readFileContent, saveFileContent } = helper;
const { success, fail } = common;

class CodeFileController extends Controller {
  allowedExtensions = [".html", ".js", ".css", ".json", ".md", ".txt", ".xml", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".ico"];

  validatePath(filePath, type = "view", template = "default") {
    if (!filePath) {
      throw new Error("文件路径不能为空");
    }
    
    let normalizedPath = path.normalize(filePath);
    
    if (path.isAbsolute(normalizedPath)) {
      if (normalizedPath.includes("..")) {
        throw new Error("路径包含非法字符");
      }
    } else {
      if (normalizedPath.includes("..")) {
        throw new Error("路径包含非法字符");
      }
      
      let basePath;
      if (type === "view") {
        basePath = path.join(Paths.rootPath, "view", template);
      } else {
        basePath = path.join(Paths.rootPath, "public", "template", template);
      }
      
      // 检查路径是否安全（传入相对路径，返回完整路径）
      normalizedPath = isPathSafe(normalizedPath, basePath);
    }
    
    const ext = path.extname(normalizedPath).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      throw new Error(`不允许的文件类型: ${ext}`);
    }
    
    return normalizedPath;
  }

  validateContent(content, filePath) {
    if (typeof content !== "string") {
      throw new Error("文件内容必须是字符串");
    }
    
    const ext = path.extname(filePath).toLowerCase();
    
    // HTML模板允许包含script标签，这是正常的模板功能
    // 只检查路径遍历等危险操作
    
    if (ext === ".js") {
      const dangerousPatterns = [
        /require\s*\(\s*['"`]\s*\.\.\./gi,
        /import\s*\(\s*['"`]\s*\.\.\./gi,
        /exec\s*\(/gi,
        /spawn\s*\(/gi,
        /child_process/gi,
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(content)) {
          throw new Error("文件内容包含危险的代码");
        }
      }
    }
  }

  async tree(req, res, next) {
    try {
      let type = req.query.type || "view";
      let template = req.query.template || "default";
      let fullPath = "";
      if (type == "html" || type == "view") {
        fullPath = path.join(
          Paths.rootPath,
          "/view",
          template
        );
      } else {
        fullPath = path.join(
          Paths.rootPath,
          "/public/view",
          template
        );
      }
      
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      
      const tree = await getFileTree(fullPath, true);
      res.json(this.success({data: tree}));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async oss(req, res, next) {
    try {
      let fullPath = "";
      let paths = req.query.path;
      
      let basePath = path.join(Paths.rootPath, "public", "uploads");
      
      if (paths) {
        try {
          let relativePath = paths.replace(/^\/+/, '');
          fullPath = isPathSafe(relativePath, basePath);
        } catch (pathError) {
          console.error('Path validation error:', pathError.message);
          return res.json(this.fail({ msg: pathError.message }));
        }
      } else {
        fullPath = basePath;
      }
      
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      
      const files = await getFileTree(fullPath, false);
      
      const dirs = [];
      const fileNames = fs.readdirSync(fullPath);
      const base = basePath;
      
      for (const name of fileNames) {
        const itemPath = path.join(fullPath, name);
        const stats = fs.statSync(itemPath);
        if (stats.isDirectory()) {
          const relativePath = path.relative(base, itemPath).replace(/\\/g, '/');
          dirs.push({
            name: name,
            path: itemPath,
            relativePath: relativePath.startsWith('public') 
              ? '/' + relativePath.replace(/^public\//, '') 
              : relativePath,
            type: 'directory'
          });
        }
      }
      
      const result = [...dirs, ...files];
      
      res.json(this.success({data: result}));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async content(req, res, next) {
    try {
      const filePath = req.query.path;
      let type = req.query.type || "view";
      let template = req.query.template || "default";
      
      const normalizedPath = this.validatePath(filePath, type, template);
      const content = await readFileContent(normalizedPath);
      res.json(this.success({data: content}));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async save(req, res, next) {
    try {
      const { path: filePath, content, type, template } = req.body;
      
      const normalizedPath = this.validatePath(filePath, type || "view", template || "default");
      this.validateContent(content, normalizedPath);
      
      const fullPath = path.isAbsolute(normalizedPath) 
        ? normalizedPath 
        : path.join(Paths.rootPath, normalizedPath);
      
      saveFileContent(fullPath, content);
     
      res.json(this.success({data: true  }));
    } catch (error) {
      console.error('[CodeFile.save] 错误:', error.message, error.stack);
      if (error.message.includes("不安全") || error.message.includes("非法") || error.message.includes("不允许") || error.message.includes("危险")) {
        return res.status(403).json(this.fail(error.message));
      }
      return res.status(500).json(this.fail({ msg: error.message || '保存失败' }));
    }
  }

  async upload(req, res, next) {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      if (!files?.length) throw new Error("未收到文件");

      const type = req.body.type || "view";
      const template = req.body.template || "default";
      
      // 检查目录是否在允许的列表中
      const allowedDirs = Chan.config.upload?.allowedDirs || [];
      let requestedDir;
      
      if (type === "html" || type === "view") {
        requestedDir = 'view';
      } else {
        requestedDir = 'public/view';
      }
      
      if (!allowedDirs.includes(requestedDir)) {
        return res.json(this.fail({ msg: `不允许在 ${requestedDir} 目录下上传文件` }));
      }
      
      let uploadPath;
      if (type === "html" || type === "view") {
        uploadPath = path.join(Paths.rootPath, "view", template);
      } else {
        uploadPath = path.join(Paths.rootPath, "public", "view", template);
      }

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const uploadedFiles = [];
      
      for (const file of files) {
        const filename = Buffer.from(file.originalname, 'binary').toString('utf8');
        const safeName = filename.replace(/[\\/*?:"<>|]/g, '_');
        const targetPath = path.join(uploadPath, safeName);
        
        fs.copyFileSync(file.path, targetPath);
        fs.unlinkSync(file.path);
        
        uploadedFiles.push({
          originalname: file.originalname,
          filename: safeName,
          path: targetPath,
          size: file.size,
          mimetype: file.mimetype
        });
      }

      res.json(this.success({
        msg: "上传成功",
        data: uploadedFiles
      }));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { path: filePath, type, template } = req.query;
      
      if (!filePath) {
        return res.json(this.fail({ msg: "文件路径不能为空" }));
      }

      let basePath;
      if (type === "html" || type === "view") {
        basePath = path.join(Paths.rootPath, "view", template || "default");
      } else {
        basePath = path.join(Paths.rootPath, "public", "template", template || "default");
      }

      const fullPath = isPathSafe(filePath, basePath);
      
      if (!fs.existsSync(fullPath)) {
        return res.json(this.fail({ msg: "文件不存在" }));
      }
      
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(fullPath);
      }

      res.json(this.success({ msg: "删除成功" }));
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

export default new CodeFileController();
