import multer from "multer";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";

function isAlphaNumeric(str) {
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const isUpperCase = charCode >= 65 && charCode <= 90;
    const isLowerCase = charCode >= 97 && charCode <= 122;
    const isDigit = charCode >= 48 && charCode <= 57;
    
    if (!isUpperCase && !isLowerCase && !isDigit) {
      return false;
    }
  }
  return str.length > 0;
}

const getFileTypeDir = (filename, mimetype) => {
  const ext = filename.split(".").pop().toLowerCase();
  
  if (ext === "pdf" || mimetype === "application/pdf") return "pdf";
  if (["mp4", "mov", "avi", "mkv"].includes(ext) || mimetype?.startsWith("video/")) return "video";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext) || mimetype?.startsWith("image/")) return "image";
  if (["mp3", "wav", "ogg", "m4a"].includes(ext) || mimetype?.startsWith("audio/")) return "audio";
  if (ext === "css" || mimetype === "text/css") return "css";
  if (ext === "js" || mimetype?.includes("javascript")) return "js";
  if (["ttf", "otf", "woff", "woff2"].includes(ext) || mimetype?.includes("font")) return "font";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["html", "htm"].includes(ext) || mimetype === "text/html") return "html";
  if (ext === "txt" || mimetype === "text/plain") return "txt";
  
  return "other";
};

function createStorage(dir = "uploads", changeDir = true, customDir = null) {
  return multer.diskStorage({
    destination: async function (req, file, cb) {
      const template = Chan.config.template;
      let destinationDir = "";
      
      if (customDir) {
        if (customDir.startsWith('view')) {
          destinationDir = path.join(Chan.paths.rootPath, customDir);
        } else {
          destinationDir = path.join("public", customDir);
        }
      } else if (changeDir) {
        const fileType = getFileTypeDir(file.originalname, file.mimetype);
        const date = dayjs(Date.now()).format("YYYY/MM/DD");
        destinationDir = path.join(`public/`, dir, template, fileType, date);
      } else {
        destinationDir = path.join(`public/`, dir, template);
      }
      
      fs.mkdirSync(destinationDir, { recursive: true });
      cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
      let originalName = file.originalname;
      originalName = Buffer.from(originalName, 'binary').toString('utf8');
      
      const ext = originalName.split('.').pop();
      const filename = `${Date.now()}.${ext}`;
      
      cb(null, filename);
    },
  });
}

// logo
export const logo = () => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const upload = multer({
    storage: createStorage("uploads", false), // 使用自定义的存储引擎
    limits: { fileSize: Chan.config.upload.logoSize }, // 限制文件大小为5MB
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // 允许上传
      } else {
        cb(new Error("不支持的文件类型")); // 拒绝上传
      }
    },
  });

  return upload.single("file");
};

// 单图上传
export const singleUpload = () => {
  const upload = multer({
    storage: createStorage("uploads"),
    limits: { fileSize: 50 * 1024 * 1024 },
  });
  return upload.single("file");
};

// 多图上传
export const multiUpload = () => {
  const upload = multer({
    storage: createStorage("uploads"),
    limits: { fileSize: 50 * 1024 * 1024, files: 20 },
    fileFilter: (req, file, cb) => {
      const config = Chan.config.upload;
      const ext = file.originalname.split(".").pop().toLowerCase();
      
      let maxSize = config.fileSize;
      
      if (["mp4", "mov", "avi", "mkv"].includes(ext) || file.mimetype?.startsWith("video/")) {
        maxSize = config.videoSize;
      } else if (ext === "pdf" || file.mimetype === "application/pdf") {
        maxSize = config.pdfSize;
      } else if (["mp3", "wav", "ogg", "m4a"].includes(ext) || file.mimetype?.startsWith("audio/")) {
        maxSize = config.musicSize;
      } else if (ext === "css" || file.mimetype === "text/css") {
        maxSize = config.cssSize;
      } else if (ext === "js" || file.mimetype?.includes("javascript")) {
        maxSize = config.jsSize;
      } else if (["ttf", "otf", "woff", "woff2"].includes(ext) || file.mimetype?.includes("font")) {
        maxSize = config.fontSize;
      } else if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
        maxSize = config.archiveSize;
      } else if (["html", "htm"].includes(ext) || file.mimetype === "text/html") {
        maxSize = config.htmlSize;
      } else if (ext === "txt" || file.mimetype === "text/plain") {
        maxSize = config.txtSize;
      } else if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext) || file.mimetype?.startsWith("image/")) {
        maxSize = config.imgSize;
      }
      
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        return cb(new Error(`文件大小超出限制: 当前 ${sizeMB}MB，最大 ${maxSizeMB}MB`), false);
      }
      
      cb(null, true);
    },
  });
  return upload.array("file", 20);
};