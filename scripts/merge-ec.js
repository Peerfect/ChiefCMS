/**
 * 把数据库里已存在的 EC Markets 文章合并到 cid=72，并补齐开户框/封面/域名替换，
 * 使其与爬虫新抓的 EC 文章一致。
 * 使用：node scripts/merge-ec.js
 */
import knex from "knex";
import dotenv from "dotenv";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!process.env.DB_DATABASE) dotenv.config({ path: resolve(__dirname, "../.env.dev") });

const CID = 72;
const AFF = "https://i.ecmprime.org/api/client/pm/2/X6WR1";
const COVER = "/public/upload/ec/ec.jpg";
const LOGO = "/public/upload/ec/ec-logo.jpg";
const NAME = "EC外汇";
const BOX_MARKER = "<!--broker-box-->";

const BOX = `${BOX_MARKER}
<section style="display:flex;clear:both;overflow:hidden;border-radius:5px;padding:0.5em;align-items:center;border:1px solid #ffd9a8;margin-top:10px;margin-bottom:14px;">
<div style="flex:0 0 auto;"><a href="${AFF}" target="_blank" rel="nofollow"><img src="${LOGO}" alt="${NAME}" width="150" height="90" style="display:block;"></a></div>
<div style="flex:1 1 auto;width:330px;margin-left:15px;margin-right:30px;">
<strong style="font-size:1.25em;color:#f04949;"><a href="${AFF}" target="_blank" rel="nofollow" style="color:#f04949;text-decoration:none;">${NAME}</a></strong>
<p style="opacity:.6;line-height:1.4;overflow:hidden;font-size:14px;margin:0;">注意：以上链接是${NAME}永久开户链接，不要进入假冒黑平台了！</p>
</div>
<div style="flex:0 0 auto;margin-left:auto;white-space:nowrap;">
<a href="${AFF}" target="_blank" rel="nofollow" style="background-color:#43ab04;color:#fff;display:inline-flex;height:2.4em;align-items:center;justify-content:center;padding:0 1em;border-radius:4px;margin-right:5px;margin-bottom:3px;text-decoration:none;">${NAME}官网</a>
<a href="${AFF}" target="_blank" rel="nofollow" style="background-color:#ec3030;color:#fff;display:inline-flex;height:2.4em;align-items:center;justify-content:center;padding:0 1em;border-radius:4px;text-decoration:none;">${NAME}开户</a>
</div>
</section>`;

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
  $("section").first().remove();
  return ($.root().text() || "").replace(/\s+/g, " ").trim().slice(0, 120);
}

async function main() {
  // 找到所有标题含 EC Markets / Ec Markets、且尚未在 cid=72 的文章
  const rows = await db("cms_article")
    .where((b) => b.where("title", "like", "%EC Markets%").orWhere("title", "like", "%Ec Markets%"))
    .andWhereNot("cid", CID)
    .select("id", "cid", "title", "content", "img", "description");

  console.log(`找到 ${rows.length} 篇待合并到 cid=${CID}`);
  let done = 0;
  for (const r of rows) {
    let content = r.content || "";
    content = content.replace(/https?:\/\/(www\.)?niutoucj\.com/g, "https://www.chiefrich.com");
    if (!content.includes(BOX_MARKER)) content = BOX + "\n" + content;
    const update = { cid: CID, content, img: COVER };
    if (!r.description || r.description.trim() === "") update.description = descFromContent(r.content);
    await db("cms_article").where("id", r.id).update(update);
    console.log(`  移动 id=${r.id}（原 cid=${r.cid}）-> ${r.title.slice(0, 30)}`);
    done++;
  }
  console.log(`完成：合并 ${done} 篇到 cid=${CID}`);
  await db.destroy();
}

main().catch((e) => { console.error("异常:", e); db.destroy().finally(() => process.exit(1)); });
