/**
 * 修复证券、区块链、基金文章的缩略图
 * 从 chiefrich.com 各分类列表页及子分类页提取图片
 * 
 * 使用方式: node --env-file=.env.dev scripts/fix-category-images.js
 */
import * as cheerio from "cheerio";
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

const PAGES = [
  // 证券相关页面
  "https://www.chiefrich.com/zhengquan/",
  "https://www.chiefrich.com/zhengquan/zqrm/",
  // 区块链相关页面
  "https://www.chiefrich.com/qukuailian/",
  "https://www.chiefrich.com/qukuailian/qklrm/",
  // 基金相关页面
  "https://www.chiefrich.com/jijin/",
  "https://www.chiefrich.com/jijin/jjrm/",
];

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
  });
  if (!res.ok) return "";
  return await res.text();
}

async function main() {
  console.log(`数据库: ${process.env.DB_DATABASE || "init"}\n`);

  const imgMap = {}; // title -> img url

  for (const pageUrl of PAGES) {
    console.log(`扫描: ${pageUrl}`);
    const html = await fetchPage(pageUrl);
    if (!html) { console.log("  获取失败\n"); continue; }

    const $ = cheerio.load(html, { decodeEntities: false });

    // 方式1: thumbnail-wrap 内的图片（配合标题）
    $(".thumbnail-wrap img").each(function () {
      const img = $(this).attr("src") || "";
      const title = $(this).attr("alt") || $(this).attr("title") || "";
      if (img && title) {
        const fullImg = img.startsWith("http") ? img : `https://www.chiefrich.com${img}`;
        imgMap[title.trim()] = fullImg;
      }
    });

    // 方式2: a 标签带 title 且内含 img
    $("a[title]").each(function () {
      const title = $(this).attr("title") || "";
      const img = $(this).find("img").attr("src") || "";
      if (img && title) {
        const fullImg = img.startsWith("http") ? img : `https://www.chiefrich.com${img}`;
        imgMap[title.trim()] = fullImg;
      }
    });

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n共找到 ${Object.keys(imgMap).length} 个标题-图片映射\n`);

  // 更新数据库
  let updateCount = 0;
  const articles = await db("cms_article")
    .whereIn("cid", [54, 55, 62])
    .where(function() {
      this.where("img", "").orWhereNull("img");
    })
    .select("id", "title");

  console.log(`需要修复的文章: ${articles.length} 篇\n`);

  for (const article of articles) {
    const img = imgMap[article.title];
    if (img) {
      await db("cms_article").where("id", article.id).update({ img });
      updateCount++;
      console.log(`✓ [${article.id}] ${article.title}`);
    }
  }

  console.log(`\n完成！更新了 ${updateCount} 篇文章的图片`);
  await db.destroy();
  process.exit(0);
}

main().catch(err => { console.error("出错:", err); process.exit(1); });
