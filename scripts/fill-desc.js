/**
 * 为 cid 文章补全空的列表摘要 description
 * 从正文（去掉顶部开户引导框）提取纯文本，取前 N 字
 * 使用：node scripts/fill-desc.js [cid1,cid2...]  默认 66,67
 */
import knex from "knex";
import dotenv from "dotenv";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!process.env.DB_DATABASE) dotenv.config({ path: resolve(__dirname, "../.env.dev") });

const CIDS = (process.argv[2] || "66,67").split(",").map((s) => parseInt(s.trim())).filter(Boolean);
const LEN = 120;

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_DATABASE || "chiefday",
  },
  pool: { min: 0, max: 2 },
});

function descFromContent(html) {
  const $ = cheerio.load(html || "", null, false);
  // 移除顶部开户引导框，避免摘要取到按钮文字
  $("section").first().remove();
  $("[style*='display:flex']").first().remove();
  let text = $.root().text() || "";
  text = text.replace(/\s+/g, " ").trim();
  return text.slice(0, LEN);
}

async function main() {
  console.log(`[FillDesc] 库: ${process.env.DB_DATABASE}  cid: ${CIDS.join(",")}`);
  const rows = await db("cms_article")
    .whereIn("cid", CIDS)
    .andWhere((b) => b.whereNull("description").orWhere("description", ""))
    .select("id", "content");
  let updated = 0;
  for (const r of rows) {
    const desc = descFromContent(r.content);
    if (desc) {
      await db("cms_article").where("id", r.id).update({ description: desc });
      updated++;
    }
  }
  console.log(`[FillDesc] 完成：补全 ${updated} 篇摘要`);
  await db.destroy();
}

main().catch((e) => { console.error("[FillDesc] 异常:", e); db.destroy().finally(() => process.exit(1)); });
