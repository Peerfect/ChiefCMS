import fs from 'fs';

const filePath = 'view/default/article.html';
let content = fs.readFileSync(filePath, 'utf8');

// 修复 '已收?' -> '已收藏'
content = content.replace(/已收\?/g, "已收藏'");
// 修复 '已取消收?)' -> '已取消收藏'
content = content.replace(/已取消收\?\)/g, "已取消收藏')");
// 修复 '状态失?' -> '状态失败'
content = content.replace(/状态失\?/g, "状态失败',");

fs.writeFileSync(filePath, content, 'utf8');
console.log('fixed article.html');

// 同样修复其他文章模板
const files = ['article-book.html', 'article-down.html', 'article-img.html', 
               'article-pdf.html', 'article-pdf-new.html', 'article-video.html'];

for (const file of files) {
  const fp = `view/default/${file}`;
  try {
    let c = fs.readFileSync(fp, 'utf8');
    const orig = c;
    c = c.replace(/已收\?/g, "已收藏'");
    c = c.replace(/已取消收\?\)/g, "已取消收藏')");
    c = c.replace(/状态失\?/g, "状态失败',");
    if (c !== orig) {
      fs.writeFileSync(fp, c, 'utf8');
      console.log(`fixed ${file}`);
    }
  } catch(e) {}
}
