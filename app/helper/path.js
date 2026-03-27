import path from "path";

/**
 * 验证路径是否安全，防止路径遍历攻击
 * @param {string} inputPath - 用户输入的路径
 * @param {string} allowedBasePath - 允许的基础路径（如 public 目录）
 * @returns {string} 返回规范化后的安全路径
 * @throws {Error} 如果路径不安全则抛出错误
 */
export const isPathSafe = (inputPath, allowedBasePath) => {
  if (!inputPath) {
    throw new Error("路径不能为空");
  }

  // 规范化路径，解析 . 和 ..
  const normalizedPath = path.normalize(inputPath);

  // 检查是否包含路径遍历字符
  if (normalizedPath.includes("..")) {
    throw new Error("路径包含非法字符，禁止路径遍历");
  }

  // 检查是否是绝对路径（黑客可能尝试使用绝对路径访问系统文件）
  if (path.isAbsolute(normalizedPath)) {
    throw new Error("禁止使用绝对路径");
  }

  // 规范化基础路径
  const normalizedBasePath = path.normalize(allowedBasePath);

  // 构建完整路径
  const fullPath = path.resolve(normalizedBasePath, normalizedPath);

  // 确保完整路径以基础路径开头（防止跳出允许的目录）
  if (!fullPath.startsWith(normalizedBasePath)) {
    throw new Error("访问路径超出允许范围");
  }

  return fullPath;
};

/**
 * 验证文件扩展名是否在允许列表中
 * @param {string} filePath - 文件路径
 * @param {string[]} allowedExtensions - 允许的扩展名列表（如 ['.jpg', '.png', '.zip']）
 * @returns {boolean} 是否允许
 */
export const isExtensionAllowed = (filePath, allowedExtensions = []) => {
  if (!filePath) {
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  
  // 如果没有指定允许的扩展名，则允许所有
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return true;
  }

  return allowedExtensions.includes(ext);
};

/**
 * 验证文件名是否安全
 * @param {string} filename - 文件名
 * @returns {boolean} 是否安全
 */
export const isFilenameSafe = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return false;
  }

  // 检查文件名长度
  if (filename.length > 255) {
    return false;
  }

  // 检查非法字符
  const invalidChars = /[<>:"|?*\x00-\x1f]/;
  if (invalidChars.test(filename)) {
    return false;
  }

  // 检查保留名称（Windows）
  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
  if (reservedNames.test(filename)) {
    return false;
  }

  // 检查以点开头（隐藏文件）
  if (filename.startsWith('.')) {
    return false;
  }

  return true;
};

/**
 * 获取相对于 public 目录的安全路径
 * @param {string} inputPath - 用户输入的路径
 * @param {string} publicPath - public 目录的完整路径
 * @returns {string} 返回安全的完整路径
 */
export const getSafePublicPath = (inputPath, publicPath) => {
  // 移除开头的 / 或 public 前缀
  let cleanPath = inputPath.replace(/^\/+/, '');
  cleanPath = cleanPath.replace(/^public\/+/, '');
  cleanPath = cleanPath.replace(/^uploads\/+/, '');

  // 默认在 uploads 目录下
  if (!cleanPath.startsWith('uploads/')) {
    cleanPath = path.join('uploads', cleanPath);
  }

  // 验证路径安全性
  return isPathSafe(cleanPath, publicPath);
};
