/**
 * 从文章正文中提取第一张图作为缩略图（针对没有缩略图的文章）
 * node --env-file=.env.dev scripts/fix-missing-images.js
 */
import knex from "knex";

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
  const articles = await db("cms_article")
    .whereIn("cid", [54, 55, 62])
    .where(function () {
      this.where("img", "").orWhereNull("img");
    })
    .select("id", "title", "content");

  console.log(`需要修复: ${articles.length} 篇\n`);

  let count = 0;
  for (const a of articles) {
    if (!a.content) continue;
    const match = a.content.match(/src=["']([^"']+\.(jpg|jpeg|png|gif|webp))[^"']*/i);
    if (match) {
      let img = match[1];
      // 确保是完整URL
      if (!img.startsWith("http")) {
        img = "https://www.chiefrich.com" + img;
      }
      await db("cms_article").where("id", a.id).update({ img });
      count++;
      console.log(`✓ [${a.id}] ${a.title.substring(0, 30)}`);
    } else {
      console.log(`✗ [${a.id}] ${a.title.substring(0, 30)} (正文无图)`);
    }
  }

  console.log(`\n完成！修复了 ${count} 篇`);
  await db.destroy();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
