/**
 * 手动触发 SEO 主动推送（百度 / Bing IndexNow / 360）
 *
 * 用途：不用等每天 15:35 的定时任务，立即推送一次并查看各搜索引擎的真实返回。
 * 逻辑与 app/modules/web/service/sitemapPush.js 保持一致，但独立运行、自带数据库连接。
 *
 * 使用方式：
 *   node scripts/push-seo.js                # 使用默认域名 www.chiefbao.com
 *   node scripts/push-seo.js example.com    # 指定域名
 */

import knex from "knex";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载生产环境变量
dotenv.config({ path: resolve(__dirname, "../.env.prd") });

// 域名：命令行参数优先，其次默认
const DOMAIN = (process.argv[2] || "www.chiefbao.com").trim();
const INDEXNOW_KEY = "chancms2026indexnow";

// 数据库连接
const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_DATABASE || "init",
  },
  pool: { min: 0, max: 2 },
});

// 取最近 24 小时新增、已发布的文章 URL
async function getRecentArticleUrls(limit) {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const articles = await db("cms_article as a")
    .select(["a.id", "c.path"])
    .leftJoin("cms_category as c", "a.cid", "c.id")
    .where("a.status", 0)
    .where("a.createdAt", ">", yesterday)
    .orderBy("a.createdAt", "desc")
    .limit(limit);
  return articles.map((a) => `https://${DOMAIN}${a.path}/article-${a.id}.html`);
}

// 确保百度推送进度表存在
async function ensurePushTable() {
  const exists = await db.schema.hasTable("cms_seo_push");
  if (!exists) {
    await db.schema.createTable("cms_seo_push", (t) => {
      t.increments("id").primary();
      t.integer("articleId").notNullable();
      t.string("engine", 20).notNullable().defaultTo("baidu");
      t.string("url", 500);
      t.dateTime("pushedAt");
      t.index(["engine", "articleId"], "idx_engine_article");
    });
  }
}

// 百度主动推送：从最老的、尚未推送的文章开始，每天 N 条，推过的不再重复
async function pingBaidu() {
  const token = (process.env.BAIDU_PUSH_TOKEN || "").trim();
  if (!token) return "跳过（未配置 BAIDU_PUSH_TOKEN）";

  const baiduLimit = parseInt(process.env.BAIDU_PUSH_LIMIT) || 10;
  await ensurePushTable();

  const pushedIds = await db("cms_seo_push").where("engine", "baidu").pluck("articleId");

  const articles = await db("cms_article as a")
    .select(["a.id", "c.path"])
    .leftJoin("cms_category as c", "a.cid", "c.id")
    .where("a.status", 0)
    .whereNotIn("a.id", pushedIds.length ? pushedIds : [0])
    .orderBy("a.createdAt", "asc")
    .limit(baiduLimit);

  if (articles.length === 0) return "跳过（全部已推送完毕）";

  let batch = articles.map((a) => ({
    id: a.id,
    url: `https://${DOMAIN}${a.path}/article-${a.id}.html`,
  }));
  const apiUrl = `http://data.zz.baidu.com/urls?site=https://${DOMAIN}&token=${token}`;

  while (batch.length > 0) {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: batch.map((b) => b.url).join("\n"),
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    if (data.success !== undefined) {
      const now = new Date();
      await db("cms_seo_push").insert(
        batch.map((b) => ({ articleId: b.id, engine: "baidu", url: b.url, pushedAt: now }))
      );
      return `成功推送 ${data.success} 条（最老优先 id:${batch[0].id}~${batch[batch.length - 1].id}），今日剩余配额 ${data.remain ?? "未知"}`;
    }
    if (data.message === "over quota" && batch.length > 1) {
      // 每次减 1 重试，精确推到剩余配额上限，不浪费配额
      batch = batch.slice(0, batch.length - 1);
      continue;
    }
    return `响应: ${JSON.stringify(data)}`;
  }
  return "跳过（配额不足，无法推送）";
}

// Bing IndexNow 推送
async function pingBing() {
  const urls = await getRecentArticleUrls(100);
  if (urls.length === 0) return "跳过（无新文章）";

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: DOMAIN,
      key: INDEXNOW_KEY,
      keyLocation: `https://${DOMAIN}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (res.ok || res.status === 202) return `IndexNow 推送成功 ${urls.length} 条URL`;
  return `IndexNow HTTP ${res.status}`;
}

// 360 收录提交
async function ping360() {
  const urls = await getRecentArticleUrls(50);
  if (urls.length === 0) return "跳过（无新文章）";

  let successCount = 0;
  for (const articleUrl of urls) {
    try {
      const submitUrl = `https://info.so.360.cn/site_submit.html?url=${encodeURIComponent(articleUrl)}`;
      const res = await fetch(submitUrl, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) successCount++;
    } catch (e) {
      // 单条失败忽略
    }
  }
  return `提交 ${successCount}/${urls.length} 条URL`;
}

async function main() {
  console.log(`[手动推送] 域名: ${DOMAIN}`);
  console.log(`[手动推送] 开始推送 sitemap: https://${DOMAIN}/sitemap.xml`);

  const tasks = [
    ["Bing", pingBing],
    ["百度", pingBaidu],
    ["360", ping360],
  ];

  for (const [name, fn] of tasks) {
    try {
      const result = await fn();
      console.log(`[手动推送] ${name}: ${result}`);
    } catch (err) {
      console.log(`[手动推送] ${name}: 失败 - ${err.message}`);
    }
  }

  console.log(`[手动推送] 完成 ${new Date().toISOString()}`);
  await db.destroy();
}

main().catch((err) => {
  console.error("[手动推送] 异常:", err);
  db.destroy().finally(() => process.exit(1));
});
