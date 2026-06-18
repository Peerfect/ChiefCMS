/**
 * 清理保险文章正文中的无用内容（推荐链接、上下篇、版权声明等）
 * 使用方式: node --env-file=.env.dev scripts/clean-insurance-content.js
 */
import * as cheerio from "cheerio";
import knex from "knex";

const TARGET_CID = 48;

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "123456",
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_DATABASE || "init",
  },
});

function cleanContent(html) {
  const $ = cheerio.load(html, { decodeEntities: false });

  // 移除包含特定文本的元素
  const removeTexts = [
    "怕被外汇黑平台骗",
    "推荐正规外汇平台",
    "正规外汇平台排名",
    "上一篇",
    "下一篇",
    "返回列表",
    "收录于致富财经",
    "本文禁止任何商业性转载",
    "如需转载需联系小编",
    "部分内容整理自网络",
    "如有侵权请联系删除",
    "收录于牛犇财经",
    "收录于天天财经",
    "标题：",
    "标签:",
    "标签：",
    "投稿",
  ];

  // 遍历所有段落和div，移除包含无用文本的
  $("p, div, span, a").each(function () {
    const text = $(this).text().trim();
    for (const keyword of removeTexts) {
      if (text.includes(keyword)) {
        // 如果是链接在段落内，只移除链接不影响段落其他内容
        // 但如果整个段落都是无用的，移除整个段落
        const parent = $(this).parent();
        if ($(this).is("a") && parent.is("p, div")) {
          const parentText = parent.text().trim();
          if (removeTexts.some((k) => parentText.includes(k))) {
            parent.remove();
          } else {
            $(this).remove();
          }
        } else {
          $(this).remove();
        }
        break;
      }
    }
  });

  // 移除"赞"按钮相关
  $("a[href*='digg']").closest("p, div").remove();
  $("[onclick*='digg']").closest("p, div").remove();

  // 移除空段落
  $("p").each(function () {
    if (!$(this).text().trim() && !$(this).find("img").length) {
      $(this).remove();
    }
  });

  return $.html().trim();
}

async function main() {
  console.log(`数据库: ${process.env.DB_DATABASE || "init"}\n`);

  const articles = await db("cms_article")
    .where("cid", TARGET_CID)
    .select("id", "title", "content");

  console.log(`找到 ${articles.length} 篇文章\n`);

  let updateCount = 0;

  for (const article of articles) {
    if (!article.content) continue;

    const cleaned = cleanContent(article.content);

    if (cleaned.length < article.content.length) {
      const removed = article.content.length - cleaned.length;
      await db("cms_article")
        .where("id", article.id)
        .update({ content: cleaned });
      updateCount++;
      console.log(`✓ [${article.id}] ${article.title} (清理了 ${removed} 字符)`);
    } else {
      console.log(`- [${article.id}] ${article.title} (无需清理)`);
    }
  }

  console.log(`\n---\n完成！清理了 ${updateCount} 篇文章`);
  await db.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("出错:", err);
  process.exit(1);
});
