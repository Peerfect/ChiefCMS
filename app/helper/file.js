import fs from "fs";
import path from "path";

const hiddenFilePatterns = [
  /^\./,
  /^Thumbs\.db$/,
  /^desktop\.ini$/,
  /\.DS_Store$/,
];

function isHiddenFile(filename) {
  return hiddenFilePatterns.some(pattern => pattern.test(filename));
}

export function getFileTree(dirPath, recursive = true, basePath = null) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const stats = fs.statSync(dirPath);
  if (!stats.isDirectory()) {
    return [];
  }

  const items = [];
  const files = fs.readdirSync(dirPath);
  
  const base = basePath || process.cwd();

  for (const file of files) {
    if (isHiddenFile(file)) {
      continue;
    }

    const fullPath = path.join(dirPath, file);
    const fileStats = fs.statSync(fullPath);

    if (fileStats.isDirectory() && recursive) {
      const children = getFileTree(fullPath, recursive, basePath);
      items.push({
        name: file,
        path: fullPath,
        type: 'directory',
        children: children
      });
    } else if (fileStats.isFile()) {
      const relativePath = path.relative(base, fullPath).replace(/\\/g, '/');
      items.push({
        name: file,
        path: fullPath,
        relativePath: relativePath.startsWith('public') ? '/' + relativePath.replace(/^\//, '') : fullPath,
        type: 'file',
        size: fileStats.size
      });
    }
  }

  return items;
}
