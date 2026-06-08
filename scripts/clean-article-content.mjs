/**
 * 清理已有文章内容中的免责声明、授权信息等非正文内容
 */
import knex from 'knex';
import * as cheerio from 'cheerio';

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123456',
    database: process.env.DB_DATABASE || 'init'
  }
});

// 需要移除的文本模式
const removePatterns = [
  /※\s*本文经.{0,50}授权转载/,
  /※\s*免责声明/,
  /免责声明[：:]/,
  /本文仅供参考.*投资建议/,
  /投资人应独立判断.*评估风险/,
  /原文出处/,
  /原文连结/,
  /原文链接/,
  /本文禁止任何商业性转载/,
  /如需转载需联系小编/,
  /部分内容整理自网络.*侵权请联系删除/,
  /标题：.*收录于/,
  /文中所提的个股.*并非投资建议/,
  /以上内容仅供参考/,
  /风险提示[：:].*自行承担/,
  /本网站所有刊登内容/,
  /本站概不负责.*不承担任何法律责任/,
];

function cleanContent(html) {
  if (!html) return html;

  const $ = cheerio.load(html, { decodeEntities: false });
  const $body = $.root();
  let changed = false;

  $body.find("p, div, span").each((i, el) => {
    const $el = $(el);
    const text = $el.text().trim();

    if (!text) return;

    for (const pattern of removePatterns) {
      if (pattern.test(text)) {
        $el.remove();
        changed = true;
        return;
      }
    }
  });

  // 移除包含"正规外汇平台排名"推荐链接的段落
  $body.find("a").each((i, el) => {
    const $a = $(el);
    const text = $a.text().trim();
    if (text.includes("正规外汇平台排名")) {
      const $parent = $a.parent();
      if ($parent.length && $parent[0].tagName && $parent[0].tagName.match(/^(p|div|span)$/i)) {
        $parent.remove();
        changed = true;
      }
    }
  });

  // 移除空段落
  $body.find("p").each((i, el) => {
    const $el = $(el);
    if (!$el.text().trim() && !$el.find("img").length) {
      $el.remove();
      changed = true;
    }
  });

  if (!changed) return null; // 返回null表示无变化
  return $body.html();
}

async function main() {
  // 获取所有scraped文章
  const articles = await db('cms_article')
    .where('source', 'scraped')
    .whereNotNull('content')
    .where('content', '!=', '')
    .select('id', 'title', 'content');

  console.log(`共 ${articles.length} 篇文章需要检查\n`);

  let cleaned = 0;
  let skipped = 0;

  for (const article of articles) {
    const result = cleanContent(article.content);

    if (result !== null) {
      await db('cms_article').where('id', article.id).update({ content: result });
      cleaned++;
      if (cleaned <= 20) {
        console.log(`✓ [${article.id}] ${article.title.slice(0, 40)}`);
      }
    } else {
      skipped++;
    }
  }

  if (cleaned > 20) {
    console.log(`... 还有 ${cleaned - 20} 篇已清理`);
  }

  console.log(`\n完成：清理 ${cleaned} 篇，无需处理 ${skipped} 篇`);
  await db.destroy();
}

main().catch(err => { console.error(err); db.destroy(); });
