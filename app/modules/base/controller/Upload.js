import { isPathSafe, getSafePublicPath, isFilenameSafe } from "../../../helper/path.js";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { common } from "chanjs";

const { success, fail } = common;
const { config } = Chan;

const handleResponse = (req, files) => {
  const isArray = Array.isArray(files);
  const result = (isArray ? files : [files]).map((file) => {
    let filePath = file.path.replace(/\\/g, "/");
    
    if (filePath.startsWith(Chan.paths.rootPath)) {
      filePath = filePath.replace(Chan.paths.rootPath, "");
    }
    
    if (!filePath.startsWith("/")) {
      filePath = "/" + filePath;
    }
    
    return {
      originalname: file.originalname,
      filename: file.filename,
      path: filePath,
      url: `${req.protocol}://${req.get("host")}${filePath}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  });

  return isArray ? result : result[0];
};

const getFileSizeLimit = (mimetype) => {
  const uploadConfig = config.upload;
  
  if (mimetype.startsWith("video/")) {
    return uploadConfig.videoSize || 20 * 1024 * 1024;
  }
  
  if (mimetype === "application/pdf") {
    return uploadConfig.pdfSize || 10 * 1024 * 1024;
  }
  
  if (mimetype.startsWith("audio/")) {
    return uploadConfig.musicSize || 5 * 1024 * 1024;
  }
  
  if (mimetype === "text/css") {
    return uploadConfig.cssSize || 2 * 1024 * 1024;
  }
  
  if (mimetype.includes("javascript")) {
    return uploadConfig.jsSize || 2 * 1024 * 1024;
  }
  
  if (mimetype.includes("font") || mimetype.includes("woff") || mimetype.includes("ttf") || mimetype.includes("otf")) {
    return uploadConfig.fontSize || 2 * 1024 * 1024;
  }
  
  if (["application/zip", "application/x-zip-compressed", "application/x-rar-compressed", 
       "application/x-7z-compressed", "application/x-tar", "application/gzip"].includes(mimetype)) {
    return uploadConfig.archiveSize || 50 * 1024 * 1024;
  }
  
  if (mimetype === "text/html") {
    return uploadConfig.htmlSize || 5 * 1024 * 1024;
  }
  
  if (mimetype === "text/plain") {
    return uploadConfig.txtSize || 1 * 1024 * 1024;
  }
  
  if (mimetype.startsWith("image/")) {
    return uploadConfig.imgSize || 1048 * 1024;
  }
  
  return uploadConfig.fileSize || 10 * 1024 * 1024;
};

const validateFile = (file) => {
  const { mimetype, size, originalname } = file;
  
  // 验证文件名是否安全
  if (!isFilenameSafe(originalname)) {
    throw new Error(`文件名不安全: ${originalname}`);
  }
  
  const ext = originalname.split(".").pop().toLowerCase();
  
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "application/pdf",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/x-m4a",
    "text/css",
    "text/javascript",
    "application/javascript",
    "application/x-javascript",
    "font/ttf",
    "font/otf",
    "font/woff",
    "font/woff2",
    "application/x-font-ttf",
    "application/x-font-otf",
    "application/font-woff",
    "application/font-woff2",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "application/x-tar",
    "application/gzip",
    "text/html",
    "text/plain"
  ];
  
  const allowedExtensions = [
    "jpg", "jpeg", "png", "gif", "webp", "svg",
    "mp4", "mov", "avi", "mkv",
    "pdf",
    "mp3", "wav", "ogg", "m4a",
    "css",
    "js",
    "ttf", "otf", "woff", "woff2", "eot",
    "zip", "rar", "7z", "tar", "gz",
    "html", "htm",
    "txt"
  ];
  
  if (!allowedTypes.includes(mimetype) && !allowedExtensions.includes(ext)) {
    throw new Error(`不支持的文件类型: ${mimetype || ext}`);
  }
  
  const maxSize = getFileSizeLimit(mimetype);
  if (size > maxSize) {
    const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
    const sizeMB = (size / 1024 / 1024).toFixed(2);
    throw new Error(`文件大小超出限制: 当前 ${sizeMB}MB，最大 ${maxSizeMB}MB`);
  }
  
  return true;
};

import { Controller } from "chanjs";

class UploadController extends Controller {
  async uploadFiles(req, res, next) {
    try {
      const files = req.file ? [req.file] : req.files;
      if (!files?.length) throw new Error("未收到文件");
      
      for (const file of files) {
        validateFile(file);
      }
      
      res.json(this.success({
        data: handleResponse(req, files),
      }));
    } catch (err) {
      if (err.message.includes("文件大小超出限制") || err.message.includes("不支持的文件类型")) {
        return res.json(this.fail({ msg: err.message }));
      }
      next(err);
    }
  }

  // 单图上传
  async uploadImg(req, res, next) {
    try {
      if (!req.file) throw new Error("未收到图片文件");
      const result = handleResponse(req, req.file);
      res.json(this.success({
        data: {
          ...result,
          thumbnail: `${result.url}?width=200`, // 可扩展缩略图
        },
      }));
    } catch (err) {
      if (err.message.includes("文件大小超出限制") || err.message.includes("不支持的文件类型")) {
        return res.json(this.fail({ msg: err.message }));
      }
      next(err);
    }
  }

  // 多图上传
  async uploadImgs(req, res, next) {
    try {
      const files = req.file ? [req.file] : req.files;
      if (!files?.length) throw new Error("未收到图片文件");
      const data = handleResponse(req, files).map((item) => ({
        ...item,
        thumbnail: `${item.url}?width=200`,
      }));
      res.json(this.success({ data }));
    } catch (err) {
      if (err.message.includes("文件大小超出限制") || err.message.includes("不支持的文件类型")) {
        return res.json(this.fail({ msg: err.message }));
      }
      next(err);
    }
  }

  // 删除文件
  async deleteFile(req, res, next) {
    try {
      const { url, dir } = req.query;
      if (!url) {
        return res.json(this.fail({ msg: "文件路径不能为空" }));
      }

      if (dir && (dir.includes('..') || dir.includes('\\'))) {
        return res.json(this.fail({ msg: "目录参数包含非法字符" }));
      }

      // 检查目录是否在允许的列表中
      const allowedDirs = Chan.config.upload?.allowedDirs || [];
      let requestedDir;
      
      if (dir === 'view') {
        requestedDir = 'view';
      } else {
        requestedDir = 'public/view';
      }
      
      const isAllowed = allowedDirs.some(allowedDir => requestedDir.startsWith(allowedDir));
      
      if (!isAllowed) {
        return res.json(this.fail({ msg: `不允许在 ${requestedDir} 目录下删除文件` }));
      }

      // 定义允许的基础路径
      let basePath;
      if (dir === 'view') {
        basePath = path.join(Chan.paths.rootPath, "view");
      } else {
        basePath = path.join(Chan.paths.rootPath, "public");
      }

      try {
        let filePath;
        if (dir === 'view') {
          const relativePath = url.replace(/^\/+/, '');
          filePath = isPathSafe(relativePath, basePath);
        } else {
          filePath = getSafePublicPath(url, basePath);
        }
        
        if (!fs.existsSync(filePath)) {
          return res.json(this.fail({ msg: "文件不存在: " + url }));
        }
        
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
        
        res.json(this.success({ msg: "删除成功" }));
      } catch (pathError) {
        console.error("Path security error:", pathError.message);
        return res.json(this.fail({ msg: pathError.message || "路径不安全" }));
      }
    } catch (error) {
      console.error("Delete file error:", error);
      res.json(this.fail({ msg: error.message || "删除失败" }));
    }
  }

  // 解压压缩包
  async extractArchive(req, res, next) {
    try {
      const { url } = req.query;
      if (!url) {
        return res.json(this.fail({ msg: "文件路径不能为空" }));
      }

      // 定义允许的基础路径（限制在 public 目录下）
      const publicPath = path.join(Chan.paths.rootPath, "public");

      try {
        // 使用安全的路径验证函数
        const filePath = getSafePublicPath(url, publicPath);
        
        if (!fs.existsSync(filePath)) {
          return res.json(this.fail({ msg: "文件不存在" }));
        }
        
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          return res.json(this.fail({ msg: "不是压缩包文件" }));
        }
        
        const ext = path.extname(filePath).toLowerCase();
        const allowedExtensions = [".zip", ".rar", ".7z", ".tar", ".gz"];
        
        if (!allowedExtensions.includes(ext)) {
          return res.json(this.fail({ msg: "不支持的压缩包格式" }));
        }
        
        if (ext !== ".zip") {
          return res.json(this.fail({ msg: "当前仅支持 ZIP 格式解压" }));
        }
        
        // 解压到同一目录下的同名文件夹
        const extractDirName = path.basename(filePath, ext);
        const extractPath = path.join(path.dirname(filePath), extractDirName);
        
        // 验证解压路径是否安全
        const safeExtractPath = isPathSafe(
          path.relative(publicPath, extractPath),
          publicPath
        );
        
        // 如果解压目录已存在，先删除
        if (fs.existsSync(safeExtractPath)) {
          fs.rmSync(safeExtractPath, { recursive: true, force: true });
        }
        
        fs.mkdirSync(safeExtractPath, { recursive: true });
        
        // 解压压缩包
        const zip = new AdmZip(filePath);
        zip.extractAllTo(safeExtractPath, true);
        
        // 获取解压后的文件列表
        const extractRelativePath = path.relative(Chan.paths.rootPath, safeExtractPath).replace(/\\/g, "/");
        const extractedFiles = [];
        
        const walkDir = (dir, relativePath = "") => {
          const files = fs.readdirSync(dir);
          
          files.forEach(file => {
            const fullPath = path.join(dir, file);
            const relativeFilePath = path.join(relativePath, file);
            const fileStats = fs.statSync(fullPath);
            
            if (fileStats.isDirectory()) {
              // 递归遍历子目录
              walkDir(fullPath, relativeFilePath);
            } else {
              extractedFiles.push({
                filename: file,
                path: `/${extractRelativePath}/${relativeFilePath}`.replace(/\\/g, "/"),
                size: fileStats.size,
              });
            }
          });
        };
        
        walkDir(safeExtractPath);
        
        res.json(this.success({
          msg: "解压成功",
          data: {
            extractPath: `/${extractRelativePath}`,
            fileCount: extractedFiles.length,
            files: extractedFiles,
          },
        }));
      } catch (pathError) {
        // 路径安全错误
        console.error("Path security error:", pathError.message);
        return res.json(this.fail({ msg: pathError.message || "路径不安全" }));
      }
    } catch (error) {
      console.error("Extract archive error:", error);
      res.json(this.fail({ msg: error.message || "解压失败" }));
    }
  }
}
export default new UploadController();