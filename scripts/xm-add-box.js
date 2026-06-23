/**
 * 给 cid=66（XM外汇）所有文章正文顶部添加「开户引导框」
 * - 样式与源站 gwj_class_wjc 一致（内联样式，不依赖模板CSS）
 * - 官网/开户按钮跳转到 XM 推广链接（与 /home/platrange/article-432 一致）
 * - 带去重标记，可重复运行不会重复添加
 *
 * 使用：node scripts/xm-add-box.js
 */

import knex from "knex";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!process.env.DB_DATABASE) dotenv.config({ path: resolve(__dirname, "../.env.dev") });

const CID = 66;
const AFF = "https://affs.click/7lMw6"; // XM 推广/开户链接（与 article-432 一致）
const LOGO = "/public/upload/xm/xm-logo.jpg";
const MARKER = "<!--xm-broker-box-->";

const BOX = `${MARKER}
<section style="display:flex;clear:both;overflow:hidden;border-radius:5px;padding:0.5em;align-items:center;border:1px solid #ffd9a8;margin-top:10px;margin-bottom:14px;">
<div style="flex:0 0 auto;"><a href="${AFF}" target="_blank" rel="nofollow"><img src="${LOGO}" alt="XM外汇" width="150" height="90" style="display:block;"></a></div>
<div style="flex:1 1 auto;width:330px;margin-left:15px;margin-right:30px;">
<strong style="font-size:1.25em;color:#f04949;"><a href="${AFF}" target="_blank" rel="nofollow" style="color:#f04949;text-decoration:none;">XM外汇</a></strong>
<p style="opacity:.6;line-height:1.4;overflow:hidden;font-size:14px;margin:0;">注意：以上链接是XM外汇永久开户链接，不要进入假冒黑平台了！</p>
</div>
<div style="flex:0 0 auto;margin-left:auto;white-space:nowrap;">
<a href="${AFF}" target="_blank" rel="nofollow" style="background-color:#43ab04;color:#fff;display:inline-flex;height:2.4em;align-items:center;justify-content:center;padding:0 1em;border-radius:4px;margin-right:5px;margin-bottom:3px;text-decoration:none;">XM外汇官网</a>
<a href="${AFF}" target="_blank" rel="nofollow" style="background-color:#ec3030;color:#fff;display:inline-flex;height:2.4em;align-items:center;justify-content:center;padding:0 1em;border-radius:4px;text-decoration:none;">XM外汇开户</a>
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

async function main() {
  console.log(`[XM-Box] 目标库: ${process.env.DB_DATABASE}  cid=${CID}`);
  const rows = await db("cms_article").where("cid", CID).select("id", "content");
  let updated = 0, skipped = 0;
  for (const r of rows) {
    if ((r.content || "").includes(MARKER)) { skipped++; continue; }
    await db("cms_article").where("id", r.id).update({ content: BOX + "\n" + (r.content || "") });
    updated++;
  }
  console.log(`[XM-Box] 完成：添加 ${updated} 篇，已存在跳过 ${skipped} 篇`);
  await db.destroy();
}

main().catch((e) => { console.error("[XM-Box] 异常:", e); db.destroy().finally(() => process.exit(1)); });
