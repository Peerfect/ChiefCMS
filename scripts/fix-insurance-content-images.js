/**
 * 修复保险文章正文中的图片路径：将相对路径转为 chiefrich.com 完整URL
 * 使用方式: node --env-file=.env.dev scripts/fix-insurance-content-images.js
 */
import knex from "knex";

const TARGET_CID = 48;
const BASE_URL = "https://www.chiefrich.com";

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

async function main() {
  console.log(`数据库: ${process.env.DB_DATABASE || "init"}\n`);

  const articles = await db("cms_article")
    .where("cid", TARGET_CID)
    .select("id", "title", "content");

  console.log(`找到 ${articles.length} 篇文章\n`);

  let updateCount = 0;

  for (const article of articles) {
    if (!article.content) continue;

    // 替换 src="/d/file/..." 为完整URL
    // 替换 src="/skin/..." 为完整URL  
    // 匹配所有以 / 开头的相对路径图片
    let newContent = article.content.replace(
      /src=["'](\/(d\/file|skin|uploads|e\/data)[^"']*)/g,
      `src="${BASE_URL}$1`
    );

    // 也处理没有引号的情况
    newContent = newContent.replace(
      /src=(\/(d\/file|skin|uploads|e\/data)[^\s>"']*)/g,
      `src="${BASE_URL}$1"`
    );

    if (newContent !== article.content) {
      await db("cms_article")
        .where("id", article.id)
        .update({ content: newContent });
      updateCount++;
      console.log(`✓ 已修复: [${article.id}] ${article.title}`);
    } else {
      console.log(`- 无需修复: [${article.id}] ${article.title}`);
    }
  }

  console.log(`\n---\n完成！修复了 ${updateCount} 篇文章的正文图片路径`);
  await db.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("出错:", err);
  process.exit(1);
});
