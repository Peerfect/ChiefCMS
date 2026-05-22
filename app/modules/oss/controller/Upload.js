import { isPathSafe, getSafePublicPath, isFilenameSafe } from "../../../helper/path.js";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import AdmZip from "adm-zip";
import qiniu from "../../cms/service/qiniu.js";
import { common, Paths  } from "chanjs";
const { config } = Chan;
const { success, fail } = common;


const handleResponse = (req, files) => {
  const isArray = Array.isArray(files);
  const result = (isArray ? files : [files]).map((file) => {
    let filePath = file.path.replace(/\\/g, "/");
    
    if (filePath.startsWith(Paths.rootPath)) {
      filePath = filePath.replace(Paths.rootPath, "");
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

const arrToObj = (
  arr,
  keyField = "config_key",
  valueField = "config_value"
) => {
  if (!Array.isArray(arr)) {
    throw new Error("arrToObj 期望接收数组作为第一个参数");
  }

  return arr.reduce((result, item) => {
    if (item && typeof item === "object") {
      const key = item[keyField];
      const value = item[valueField];
      if (key !== undefined && value !== undefined) {
        result[key] = value;
      }
    }
    return result;
  }, {});
};

let qiniuConfig = {
  domain: "",
  bucket: "",
  secretKey: "",
  accessKey: "",
};

const initQiniuConfig = async () => {
  if (qiniuConfig.bucket && qiniuConfig.secretKey && qiniuConfig.accessKey && qiniuConfig.domain) {
    return true;
  }

  try {
    const res = await qiniu.getConfig();

    if (res.code !== 200 || !res?.data?.list || !res?.data?.list?.length) {
      throw new Error("获取七牛云配置失败，配置列表为空");
    }

    const configObj = arrToObj(res.data.list);

    const requiredConfigs = ["bucket", "secretKey", "accessKey", "domain"];

    const missingConfigs = requiredConfigs.filter((key) => !configObj[key]);
    if (missingConfigs.length) {
      throw new Error(`七牛云配置不完整，缺少: ${missingConfigs.join(", ")}`);
    }

    qiniuConfig = { ...configObj };
    return true;
  } catch (error) {
    console.error("七牛云配置初始化失败:", error.message);
    throw error;
  }
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

  async uploadImg(req, res, next) {
    try {
      if (!req.file) throw new Error("未收到图片文件");
      const result = handleResponse(req, req.file);
      res.json(this.success({
        data: {
          ...result,
          thumbnail: `${result.url}?width=200`,
        },
      }));
    } catch (err) {
      if (err.message.includes("文件大小超出限制") || err.message.includes("不支持的文件类型")) {
        return res.json(this.fail({ msg: err.message }));
      }
      next(err);
    }
  }

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

  async deleteFile(req, res, next) {
    try {
      const { url, dir } = req.query;
      if (!url) {
        return res.json(this.fail({ msg: "文件路径不能为空" }));
      }

      if (dir && (dir.includes('..') || dir.includes('\\'))) {
        return res.json(this.fail({ msg: "目录参数包含非法字符" }));
      }

      let basePath;
      if (dir === 'view') {
        basePath = path.join(Paths.rootPath, "view");
      } else {
        basePath = path.join(Paths.rootPath, "public");
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

  async extractArchive(req, res, next) {
    try {
      const { url } = req.query;
      if (!url) {
        return res.json(this.fail({ msg: "文件路径不能为空" }));
      }

      const publicPath = path.join(Paths.rootPath, "public");

      try {
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
        
        const extractDirName = path.basename(filePath, ext);
        const extractPath = path.join(path.dirname(filePath), extractDirName);
        
        const safeExtractPath = isPathSafe(
          path.relative(publicPath, extractPath),
          publicPath
        );
        
        if (fs.existsSync(safeExtractPath)) {
          fs.rmSync(safeExtractPath, { recursive: true, force: true });
        }
        
        fs.mkdirSync(safeExtractPath, { recursive: true });
        
        const zip = new AdmZip(filePath);
        zip.extractAllTo(safeExtractPath, true);
        
        const extractRelativePath = path.relative(Paths.rootPath, safeExtractPath).replace(/\\/g, "/");
        const extractedFiles = [];
        
        const walkDir = (dir, relativePath = "") => {
          const files = fs.readdirSync(dir);
          
          files.forEach(file => {
            const fullPath = path.join(dir, file);
            const relativeFilePath = path.join(relativePath, file);
            const fileStats = fs.statSync(fullPath);
            
            if (fileStats.isDirectory()) {
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
        console.error("Path security error:", pathError.message);
        return res.json(this.fail({ msg: pathError.message || "路径不安全" }));
      }
    } catch (error) {
      console.error("Extract archive error:", error);
      res.json(this.fail({ msg: error.message || "解压失败" }));
    }
  }

  async getQiniuUploadToken(req, res, next) {
    try {
      const data = await qiniu.getUploadToken();
      res.json(this.success(data));
    } catch (error) {
      next(error);
    }
  }

  async uploadToQiniu(req, res, next) {
    try {
      const file = req.file || (req.files && req.files[0]);
      if (!file) {
        return res.json(this.fail({ msg: "未找到上传的文件" }));
      }

      await initQiniuConfig();
      const { bucket, secretKey, accessKey, domain } = qiniuConfig;

      const { originalname, filename, path: filePath } = file;
      try {
        const uploadResult = await qiniu.upload(file, {
          bucket,
          secretKey,
          accessKey,
        });

        if (uploadResult.code === 200) {
          const { key = "" } = uploadResult.data;

          await fsPromises.unlink(filePath);

          return res.json({
            ...success,
            data: {
              path: `//${domain}/${key}`,
              domain,
              originalname,
              filename,
              link: key,
            },
          });
        } else {
          return res.json(this.fail({ data: uploadResult.data }));
        }
      } catch (uploadError) {
        try {
          await fsPromises.unlink(filePath);
        } catch (unlinkError) {
          console.warn("上传失败后删除本地文件出错:", unlinkError.message);
        }
        throw uploadError;
      }
    } catch (error) {
      next(error);
    }
  }

  async copyFile(req, res, next) {
    try {
      const { sourceUrl, targetUrl, dir } = req.body;
      if (!sourceUrl || !targetUrl) {
        return res.json(this.fail({ msg: "源路径和目标路径不能为空" }));
      }

      if ((dir && (dir.includes('..') || dir.includes('\\')))) {
        return res.json(this.fail({ msg: "目录参数包含非法字符" }));
      }

      let basePath;
      if (dir === 'view') {
        basePath = path.join(Paths.rootPath, "view");
      } else {
        basePath = path.join(Paths.rootPath, "public");
      }

      try {
        let sourcePath, targetPath;
        if (dir === 'view') {
          const sourceRelative = sourceUrl.replace(/^\/+/, '');
          const targetRelative = targetUrl.replace(/^\/+/, '');
          sourcePath = isPathSafe(sourceRelative, basePath);
          targetPath = isPathSafe(targetRelative, basePath);
        } else {
          sourcePath = getSafePublicPath(sourceUrl, basePath);
          targetPath = getSafePublicPath(targetUrl, basePath);
        }

        if (!fs.existsSync(sourcePath)) {
          return res.json(this.fail({ msg: "源文件不存在" }));
        }

        if (fs.existsSync(targetPath)) {
          return res.json(this.fail({ msg: "目标路径已存在" }));
        }

        const stats = fs.statSync(sourcePath);
        if (stats.isDirectory()) {
          fs.mkdirSync(targetPath, { recursive: true });
          const copyRecursive = (src, dest) => {
            const entries = fs.readdirSync(src, { withFileTypes: true });
            for (const entry of entries) {
              const srcPath = path.join(src, entry.name);
              const destPath = path.join(dest, entry.name);
              if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyRecursive(srcPath, destPath);
              } else {
                fs.copyFileSync(srcPath, destPath);
              }
            }
          };
          copyRecursive(sourcePath, targetPath);
        } else {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.copyFileSync(sourcePath, targetPath);
        }

        res.json(this.success({ msg: "复制成功" }));
      } catch (pathError) {
        console.error("Path security error:", pathError.message);
        return res.json(this.fail({ msg: pathError.message || "路径不安全" }));
      }
    } catch (error) {
      console.error("Copy file error:", error);
      res.json(this.fail({ msg: error.message || "复制失败" }));
    }
  }

  async moveFile(req, res, next) {
    try {
      const { sourceUrl, targetUrl, dir } = req.body;
      if (!sourceUrl || !targetUrl) {
        return res.json(this.fail({ msg: "源路径和目标路径不能为空" }));
      }

      if ((dir && (dir.includes('..') || dir.includes('\\')))) {
        return res.json(this.fail({ msg: "目录参数包含非法字符" }));
      }

      let basePath;
      if (dir === 'view') {
        basePath = path.join(Paths.rootPath, "view");
      } else {
        basePath = path.join(Paths.rootPath, "public");
      }

      try {
        let sourcePath, targetPath;
        if (dir === 'view') {
          const sourceRelative = sourceUrl.replace(/^\/+/, '');
          const targetRelative = targetUrl.replace(/^\/+/, '');
          sourcePath = isPathSafe(sourceRelative, basePath);
          targetPath = isPathSafe(targetRelative, basePath);
        } else {
          sourcePath = getSafePublicPath(sourceUrl, basePath);
          targetPath = getSafePublicPath(targetUrl, basePath);
        }

        if (!fs.existsSync(sourcePath)) {
          return res.json(this.fail({ msg: "源文件不存在" }));
        }

        if (fs.existsSync(targetPath)) {
          return res.json(this.fail({ msg: "目标路径已存在" }));
        }

        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.renameSync(sourcePath, targetPath);

        res.json(this.success({ msg: "移动成功" }));
      } catch (pathError) {
        console.error("Path security error:", pathError.message);
        return res.json(this.fail({ msg: pathError.message || "路径不安全" }));
      }
    } catch (error) {
      console.error("Move file error:", error);
      res.json(this.fail({ msg: error.message || "移动失败" }));
    }
  }

  async renameFile(req, res, next) {
    try {
      const { sourceUrl, newName, dir } = req.body;
      if (!sourceUrl || !newName) {
        return res.json(this.fail({ msg: "源路径和新名称不能为空" }));
      }

      if (!isFilenameSafe(newName)) {
        return res.json(this.fail({ msg: "新文件名不安全" }));
      }

      if ((dir && (dir.includes('..') || dir.includes('\\')))) {
        return res.json(this.fail({ msg: "目录参数包含非法字符" }));
      }

      let basePath;
      if (dir === 'view') {
        basePath = path.join(Paths.rootPath, "view");
      } else {
        basePath = path.join(Paths.rootPath, "public");
      }

      try {
        let sourcePath;
        if (dir === 'view') {
          const relativePath = sourceUrl.replace(/^\/+/, '');
          sourcePath = isPathSafe(relativePath, basePath);
        } else {
          sourcePath = getSafePublicPath(sourceUrl, basePath);
        }

        if (!fs.existsSync(sourcePath)) {
          return res.json(this.fail({ msg: "源文件不存在" }));
        }

        const targetPath = path.join(path.dirname(sourcePath), newName);
        
        const safeTargetPath = isPathSafe(
          path.relative(basePath, targetPath),
          basePath
        );

        if (fs.existsSync(safeTargetPath)) {
          return res.json(this.fail({ msg: "目标名称已存在" }));
        }

        fs.renameSync(sourcePath, safeTargetPath);

        res.json(this.success({ msg: "重命名成功" }));
      } catch (pathError) {
        console.error("Path security error:", pathError.message);
        return res.json(this.fail({ msg: pathError.message || "路径不安全" }));
      }
    } catch (error) {
      console.error("Rename file error:", error);
      res.json(this.fail({ msg: error.message || "重命名失败" }));
    }
  }

  async getRelativePath(req, res, next) {
    try {
      const { url, dir } = req.query;
      if (!url) {
        return res.json(this.fail({ msg: "文件路径不能为空" }));
      }

      if (dir && (dir.includes('..') || dir.includes('\\'))) {
        return res.json(this.fail({ msg: "目录参数包含非法字符" }));
      }

      let basePath;
      if (dir === 'view') {
        basePath = path.join(Paths.rootPath, "view");
      } else {
        basePath = path.join(Paths.rootPath, "public");
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
          return res.json(this.fail({ msg: "文件不存在" }));
        }

        const relativePath = path.relative(basePath, filePath).replace(/\\/g, "/");
        
        res.json(this.success({
          data: {
            relativePath: relativePath.startsWith("/") ? relativePath : "/" + relativePath,
            fullPath: filePath,
          },
        }));
      } catch (pathError) {
        console.error("Path security error:", pathError.message);
        return res.json(this.fail({ msg: pathError.message || "路径不安全" }));
      }
    } catch (error) {
      console.error("Get relative path error:", error);
      res.json(this.fail({ msg: error.message || "获取路径失败" }));
    }
  }

  async createFolder(req, res, next) {
    try {
      const { folderPath } = req.body;
      if (!folderPath) {
        return res.json(this.fail({ msg: "文件夹路径不能为空" }));
      }

      // 文件列表接口查询的是 public/uploads 目录
      const basePath = path.join(Paths.rootPath, "public", "uploads");
      
      try {
        const safePath = isPathSafe(folderPath, basePath);
        
        if (fs.existsSync(safePath)) {
          return res.json(this.fail({ msg: "文件夹已存在" }));
        }

        fs.mkdirSync(safePath, { recursive: true });
        
        res.json(this.success({ msg: "文件夹创建成功" }));
      } catch (pathError) {
        console.error("Path security error:", pathError.message);
        return res.json(this.fail({ msg: pathError.message || "路径不安全" }));
      }
    } catch (error) {
      console.error("Create folder error:", error);
      res.json(this.fail({ msg: error.message || "创建文件夹失败" }));
    }
  }

  async compressFiles(req, res, next) {
    try {
      const { files, folderPath, zipName } = req.body;
      if (!files || !Array.isArray(files) || files.length === 0) {
        return res.json(this.fail({ msg: "请选择要压缩的文件" }));
      }

      // 文件列表接口查询的是 public/uploads 目录
      const basePath = path.join(Paths.rootPath, "public", "uploads");
      const targetDir = folderPath || "";
      const finalZipName = zipName || `archive_${Date.now()}.zip`;
      
      try {
        const safeTargetDir = isPathSafe(targetDir, basePath);
        const zipFilePath = path.join(safeTargetDir, finalZipName);

        if (fs.existsSync(zipFilePath)) {
          return res.json(this.fail({ msg: "压缩文件已存在" }));
        }

        const zip = new AdmZip();

        for (const file of files) {
          const filePath = path.join(basePath, file.replace(/^\//, ""));
          const safeFilePath = isPathSafe(path.relative(basePath, filePath), basePath);
          
          if (fs.existsSync(safeFilePath)) {
            const stats = fs.statSync(safeFilePath);
            if (stats.isDirectory()) {
              zip.addLocalFolder(safeFilePath, path.basename(file));
            } else {
              zip.addLocalFile(safeFilePath, "", path.basename(file));
            }
          }
        }

        zip.writeZip(zipFilePath);
        
        res.json(this.success({ 
          msg: "压缩成功",
          data: {
            zipName: finalZipName,
            zipPath: path.join(targetDir, finalZipName).replace(/\\/g, "/")
          }
        }));
      } catch (pathError) {
        console.error("Path security error:", pathError.message);
        return res.json(this.fail({ msg: pathError.message || "路径不安全" }));
      }
    } catch (error) {
      console.error("Compress files error:", error);
      res.json(this.fail({ msg: error.message || "压缩失败" }));
    }
  }
}

export default new UploadController();
