import fs from 'fs';
import path from 'path';

const dir = 'view/default';
const files = fs.readdirSync(dir).filter(f => f.startsWith('article') && f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 修复阅读数乱码
  content = content.replace(/阅读（\{\{article\.pv\}\}\?/g, '阅读（{{article.pv}}）');
  // 修复点赞注释乱码
  content = content.replace(/点赞\?5\?/g, '点赞（95）');
  // 修复其他可能的括号乱码 - 中文括号被替换为?
  content = content.replace(/（\{\{article\.pv\}\}\?/g, '（{{article.pv}}）');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`fixed: ${file}`);
  } else {
    console.log(`ok: ${file}`);
  }
}
