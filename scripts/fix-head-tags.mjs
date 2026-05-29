import fs from 'fs';
import path from 'path';

const viewDir = 'view/default';
const files = fs.readdirSync(viewDir)
  .filter(f => f.endsWith('.html') && !['404.html', '500.html'].includes(f));

for (const file of files) {
  const filePath = path.join(viewDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 如果没有 </head>，在 <body 之前加上
  if (!content.includes('</head>')) {
    content = content.replace(/(<body[^>]*>)/, '</head>\n$1');
    fs.writeFileSync(filePath, content);
    console.log(`✓ 修复 ${file}`);
  }
}

console.log('done');
