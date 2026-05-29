import fs from 'fs';
import path from 'path';

const dir = 'view/default';
const files = fs.readdirSync(dir).filter(f => f.startsWith('article') && f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('\ufffd')) {
    // 修复已知的乱码模式
    content = content.replace(/排\ufffd\?\/a>/g, '排名</a>');
    content = content.replace(/没有\ufffd\?/g, '没有了');
    content = content.replace(/\ufffd/g, '');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`fixed: ${file}`);
  } else {
    console.log(`ok: ${file}`);
  }
}
