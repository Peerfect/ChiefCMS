/**
 * 修复保险文章的缩略图：从 chiefrich.com 列表页提取图片URL
 * 使用方式: node --env-file=.env.dev scripts/fix-insurance-images.js
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

async function main() {
  console.log(`数据库: ${process.env.DB_DATABASE || "init"}\n`);

  // 从列表页获取文章链接和对应的图片
  const res = await fetch("https://www.chiefrich.com/baoxian/bxrm/", {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
  });
  const html = await res.text();
  const $ = cheerio.load(html, { decodeEntities: false });

  // 提取文章标题和图片的对应关系
  const articleImages = [];
  $("a.thumbnail-link").each(function () {
    const title = $(this).attr("title") || "";
    const img = $(this).find("img").attr("src") || "";
    if (title && img) {
      // 转为完整URL
      const fullImg = img.startsWith("http") ? img : `https://www.chiefrich.com${img}`;
      articleImages.push({ title: title.trim(), img: fullImg });
    }
  });

  console.log(`从列表页提取到 ${articleImages.length} 篇文章的图片\n`);

  // 更新数据库中的文章图片
  let updateCount = 0;
  for (const item of articleImages) {
    const result = await db("cms_article")
      .where("cid", TARGET_CID)
      .where("title", item.title)
      .update({ img: item.img });

    if (result > 0) {
      updateCount++;
      console.log(`✓ 已更新: ${item.title}`);
      console.log(`  图片: ${item.img}\n`);
    } else {
      console.log(`✗ 未找到: ${item.title}\n`);
    }
  }

  console.log(`---\n完成！更新了 ${updateCount} 篇文章的图片`);
  await db.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("出错:", err);
  process.exit(1);
});
