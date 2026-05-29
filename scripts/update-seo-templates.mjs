/**
 * 批量更新模板文件的SEO标签，替换为统一的 seo.html include
 */
import fs from 'fs';
import path from 'path';

const viewDir = 'view/default';

// 需要处理的文件列表（排除404、500错误页面）
const files = fs.readdirSync(viewDir)
  .filter(f => f.endsWith('.html') && !['404.html', '500.html'].includes(f));

console.log(`找到 ${files.length} 个模板文件\n`);

for (const file of files) {
  const filePath = path.join(viewDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // 移除旧的 SEO meta 标签（在 {{include './common/meta.html'}} 之前的几行）
  // 模式：<meta name="description" ...>
  content = content.replace(/\s*<meta\s+name="description"[^>]*>\s*/g, '\n');
  // 模式：<meta name="keywords" ...>
  content = content.replace(/\s*<meta\s+name="keywords"[^>]*>\s*/g, '\n');
  // 模式：<meta property="og:title" ...>
  content = content.replace(/\s*<meta\s+property="og:title"[^>]*>\s*/g, '\n');
  // 模式：<meta property="og:description" ...>
  content = content.replace(/\s*<meta\s+property="og:description"[^>]*>\s*/g, '\n');
  // 模式（全角冒号版本）：<meta property="og：title" ...>
  content = content.replace(/\s*<meta\s+property="og：title"[^>]*>\s*/g, '\n');
  content = content.replace(/\s*<meta\s+property="og：description"[^>]*>\s*/g, '\n');

  // 替换 <title>...</title> 为 include seo.html
  // 保留缩进
  content = content.replace(/(\s*)<title>[^<]*<\/title>\s*\n?/, '$1{{include \'./common/seo.html\'}}\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ ${file}`);
  } else {
    console.log(`- ${file} (无变化)`);
  }
}

console.log('\n完成！');
