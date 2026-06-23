/**
 * 清理 cid=66 文章正文里的失效外链图片
 * 正常图片都已下载为本地 /public/upload/xm/，残留的 http(s) 外链 img 均为源站失效外链（404），删除避免裂图。
 * 使用：node scripts/xm-clean-broken-img.js
 */
import knex from "knex";
import dotenv from "dotenv";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!process.env.DB_DATABASE) dotenv.config({ path: resolve(__dirname, "../.env.dev") });

const CID = 66;
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
  console.log(`[Clean] 目标库: ${process.env.DB_DATABASE}  cid=${CID}`);
  const rows = await db("cms_article").where("cid", CID).select("id", "content");
  let changed = 0, removedImgs = 0;
  for (const r of rows) {
    const $ = cheerio.load(r.content || "", null, false);
    let removed = 0;
    $("img").each((i, el) => {
      const src = $(el).attr("src") || "";
      // 本地图片(/public/...)保留；外链 http(s) 图为失效图，删除
      if (/^https?:\/\//i.test(src)) {
        const $p = $(el).closest("p");
        $(el).remove();
        removed++;
        if ($p.length && $p.text().trim() === "" && $p.find("img,iframe,video,a").length === 0) {
          $p.remove();
        }
      }
    });
    if (removed > 0) {
      await db("cms_article").where("id", r.id).update({ content: $.html() });
      changed++;
      removedImgs += removed;
    }
  }
  console.log(`[Clean] 完成：处理 ${changed} 篇，删除失效图 ${removedImgs} 张`);
  await db.destroy();
}

main().catch((e) => { console.error("[Clean] 异常:", e); db.destroy().finally(() => process.exit(1)); });
