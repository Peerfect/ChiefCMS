/**
 * 批量从 chiefrich.com 采集文章到本地数据库
 * 支持：证券(54)、区块链(55)、基金(62)
 * 
 * 使用方式: node --env-file=.env.dev scripts/import-categories.js
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

// 采集配置：本地cid -> 源站URL
const TASKS = [
  { cid: 54, name: "证券", url: "https://www.chiefrich.com/zhengquan/" },
  { cid: 55, name: "区块链", url: "https://www.chiefrich.com/qukuailian/" },
  { cid: 62, name: "基金", url: "https://www.chiefrich.com/jijin/" },
];

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept-Language": "zh-CN,zh;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

// 从列表页提取文章链接、标题、图片
async function getArticleList(listUrl) {
  const html = await fetchPage(listUrl);
  const $ = cheerio.load(html, { decodeEntities: false });
  const articles = [];

  // 提取带缩略图的文章
  $("a.thumbnail-link").each(function () {
    const title = $(this).attr("title") || "";
    const href = $(this).attr("href") || "";
    const img = $(this).find("img").attr("src") || "";
    if (title && href) {
      const fullUrl = href.startsWith("http") ? href : `https://www.chiefrich.com${href}`;
      const fullImg = img ? (img.startsWith("http") ? img : `https://www.chiefrich.com${img}`) : "";
      articles.push({ title: title.trim(), url: fullUrl, img: fullImg });
    }
  });

  // 如果没有 thumbnail-link，尝试从 li > a 提取
  if (articles.length === 0) {
    $("li font a, li a").each(function () {
      const title = $(this).attr("title") || $(this).text().trim();
      const href = $(this).attr("href") || "";
      if (title && href && href.includes("/edu/")) {
        const fullUrl = href.startsWith("http") ? href : `https://www.chiefrich.com${href}`;
        articles.push({ title: title.trim(), url: fullUrl, img: "" });
      }
    });
  }

  return articles;
}

// 抓取文章详情
async function fetchArticleContent(url) {
  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html, { decodeEntities: false });

    let content = $(".entry-content").html() || $(".newstext").html() || $("#contenttxt").html() || $(".content").html() || "";

    // 清理无用内容
    if (content) {
      const $c = cheerio.load(content, { decodeEntities: false });
      $c("script, style").remove();

      // 移除广告和无关文本
      $c("p, div, a").each(function () {
        const text = $c(this).text();
        if (
          text.includes("怕被外汇黑平台骗") ||
          text.includes("正规外汇平台排名") ||
          text.includes("上一篇") ||
          text.includes("下一篇") ||
          text.includes("返回列表") ||
          text.includes("收录于致富财经") ||
          text.includes("本文禁止任何商业性转载") ||
          text.includes("如需转载需联系小编") ||
          text.includes("如有侵权请联系删除") ||
          text.includes("标题：") ||
          text.includes("标签:")
        ) {
          $c(this).remove();
        }
      });

      // 修复图片相对路径
      content = $c.html().replace(
        /src=["'](\/(d\/file|skin|uploads|e\/data)[^"']*)/g,
        `src="https://www.chiefrich.com$1`
      );
    }

    const description = $('meta[name="description"]').attr("content") || "";
    return { content: content.trim(), description };
  } catch (err) {
    console.error(`    抓取详情失败: ${err.message}`);
    return { content: "", description: "" };
  }
}

// 从列表页获取图片（如果文章列表有缩略图）
async function getImagesFromList(listUrl) {
  const html = await fetchPage(listUrl);
  const $ = cheerio.load(html, { decodeEntities: false });
  const imgMap = {};

  $("a.thumbnail-link").each(function () {
    const title = $(this).attr("title") || "";
    const img = $(this).find("img").attr("src") || "";
    if (title && img) {
      imgMap[title.trim()] = img.startsWith("http") ? img : `https://www.chiefrich.com${img}`;
    }
  });

  return imgMap;
}

async function importCategory(task) {
  console.log(`\n========================================`);
  console.log(`开始采集: ${task.name} (cid=${task.cid})`);
  console.log(`来源: ${task.url}`);
  console.log(`========================================\n`);

  // 获取文章列表
  const articles = await getArticleList(task.url);
  console.log(`找到 ${articles.length} 篇文章\n`);

  if (articles.length === 0) {
    console.log("未找到文章，跳过\n");
    return 0;
  }

  // 尝试获取子分类页面的文章（如果有子分类链接）
  let successCount = 0;

  for (const article of articles.slice(0, 10)) {
    // 检查是否已存在
    const exists = await db("cms_article").where("title", article.title).first();
    if (exists) {
      console.log(`  已存在: ${article.title}`);
      continue;
    }

    // 抓取文章内容
    const { content, description } = await fetchArticleContent(article.url);

    if (!content) {
      console.log(`  跳过(无内容): ${article.title}`);
      continue;
    }

    // 插入数据库
    await db("cms_article").insert({
      title: article.title,
      shortTitle: "",
      content: content,
      description: (description || article.title).slice(0, 200),
      img: article.img,
      cid: task.cid,
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
    console.log(`  ✓ 已导入: ${article.title}`);

    // 控制请求频率
    await new Promise((r) => setTimeout(r, 1500));
  }

  return successCount;
}

async function main() {
  console.log(`数据库: ${process.env.DB_DATABASE || "init"}\n`);

  try {
    await db.raw("SELECT 1");
    console.log("数据库连接成功");
  } catch (err) {
    console.error("数据库连接失败:", err.message);
    process.exit(1);
  }

  let totalSuccess = 0;

  for (const task of TASKS) {
    const count = await importCategory(task);
    totalSuccess += count;
  }

  console.log(`\n========================================`);
  console.log(`全部完成！共导入 ${totalSuccess} 篇文章`);
  console.log(`========================================`);

  await db.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("出错:", err);
  process.exit(1);
});
