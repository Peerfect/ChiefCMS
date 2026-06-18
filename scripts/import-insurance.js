/**
 * 从 chiefrich.com 采集保险入门文章到本地数据库 cid=48
 * 
 * 使用方式: 
 *   开发环境: node --env-file=.env.dev scripts/import-insurance.js
 *   生产环境: node --env-file=.env.prd scripts/import-insurance.js
 */
import * as cheerio from "cheerio";
import knex from "knex";

const TARGET_CID = 48; // 保险入门分类ID

// 从环境变量读取数据库配置
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

// 从 chiefrich.com/baoxian/ 页面提取的文章列表
const ARTICLE_URLS = [
  "https://www.chiefrich.com/edu/17277.html",
  "https://www.chiefrich.com/edu/17276.html",
  "https://www.chiefrich.com/edu/17275.html",
  "https://www.chiefrich.com/edu/17274.html",
  "https://www.chiefrich.com/edu/17273.html",
  "https://www.chiefrich.com/edu/235.html",
  "https://www.chiefrich.com/edu/234.html",
  "https://www.chiefrich.com/edu/233.html",
  "https://www.chiefrich.com/edu/232.html",
  "https://www.chiefrich.com/edu/176.html",
];

async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "zh-CN,zh;q=0.9",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function parseArticle(url) {
  try {
    console.log(`正在抓取: ${url}`);
    const html = await fetchPage(url);
    const $ = cheerio.load(html, { decodeEntities: false });

    // chiefrich.com 使用帝国CMS，结构：h1是标题，.newstext是正文
    const title =
      $("h1").first().text().trim() ||
      $(".newstitle").text().trim() ||
      $("title").text().split("-")[0].trim();

    // 正文内容 - 帝国CMS常用选择器
    let content =
      $(".newstext").html() ||
      $("#contenttxt").html() ||
      $(".content").html() ||
      $("article").html() || "";

    // 清理内容中的广告和无关信息
    if (content) {
      const $content = cheerio.load(content, { decodeEntities: false });
      $content("script").remove();
      $content("style").remove();
      $content(".ad").remove();
      $content("[class*='recommend']").remove();
      content = $content.html() || "";
    }

    // 提取描述
    const description =
      $('meta[name="description"]').attr("content") ||
      content.replace(/<[^>]+>/g, "").slice(0, 200).trim();

    // 获取文章中第一张图片
    const img =
      $(".newstext img").first().attr("src") ||
      $("#contenttxt img").first().attr("src") ||
      "";

    if (!title) {
      console.log(`  警告: 未能提取标题`);
      return null;
    }

    console.log(`  标题: ${title}`);
    console.log(`  内容长度: ${content.length} 字符`);
    return { title, content: content.trim(), description, img };
  } catch (error) {
    console.error(`  抓取失败: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log(`数据库: ${process.env.DB_DATABASE || "init"}`);
  console.log(`目标分类ID: ${TARGET_CID}`);
  console.log("---\n");

  // 测试数据库连接
  try {
    await db.raw("SELECT 1");
    console.log("数据库连接成功\n");
  } catch (err) {
    console.error("数据库连接失败:", err.message);
    process.exit(1);
  }

  let successCount = 0;
  let skipCount = 0;

  for (const url of ARTICLE_URLS) {
    const article = await parseArticle(url);
    if (!article || !article.title) {
      console.log(`  跳过 (无法解析)\n`);
      continue;
    }

    // 检查是否已存在（通过标题去重）
    const exists = await db("cms_article")
      .where("title", article.title)
      .first();

    if (exists) {
      console.log(`  已存在，跳过\n`);
      skipCount++;
      continue;
    }

    // 插入文章
    try {
      await db("cms_article").insert({
        title: article.title,
        shortTitle: "",
        content: article.content,
        description: article.description,
        img: article.img,
        cid: TARGET_CID,
        status: 0,
        attr: "",
        tagId: "",
        author: "",
        link: "",
        pv: Math.floor(Math.random() * 100) + 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      successCount++;
      console.log(`  ✓ 已导入\n`);
    } catch (err) {
      console.error(`  ✗ 插入失败: ${err.message}\n`);
    }

    // 控制请求频率，避免被封
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  console.log("---");
  console.log(`采集完成！成功: ${successCount}, 跳过: ${skipCount}, 总计: ${ARTICLE_URLS.length}`);
  await db.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("采集出错:", err);
  process.exit(1);
});
