/**
 * 修复封面图缺失的文章：当 img 指向的本地文件不存在时，
 * 用正文里的第一张「外链图片(http/https)」作为封面预览图。
 * 在哪台机器跑就用哪台的磁盘判断文件是否存在（生产上跑修生产）。
 *
 * 使用：node --env-file=.env.prd scripts/fix-missing-cover.js
 *   预览(不写库)：node --env-file=.env.prd scripts/fix-missing-cover.js --dry
 */
import knex from "knex";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
if (!process.env.DB_DATABASE) dotenv.config({ path: resolve(__dirname, "../.env.dev") });

const DRY = process.argv.includes("--dry");

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

// 本地封面文件是否存在
function coverExists(img) {
  if (!img) return false;
  if (/^https?:\/\//i.test(img)) return true; // 外链封面，视为可用
  const fp = path.join(ROOT, img.replace(/^\//, "")); // /public/xx -> ROOT/public/xx
  return fs.existsSync(fp);
}

// 从正文取第一张外链图
function firstRemoteImg(content) {
  const m = (content || "").match(/<img[^>]+src=["']?(https?:\/\/[^"' >]+)["']?/i);
  return m ? m[1] : null;
}

async function main() {
  console.log(`[FixCover] 库: ${process.env.DB_DATABASE}  ${DRY ? "(预览模式)" : ""}`);
  const rows = await db("cms_article").where("status", 0).select("id", "img", "content");
  let fixed = 0, skipNoImg = 0, ok = 0;
  for (const r of rows) {
    if (coverExists(r.img)) { ok++; continue; }
    const remote = firstRemoteImg(r.content);
    if (!remote) { skipNoImg++; continue; }
    if (!DRY) await db("cms_article").where("id", r.id).update({ img: remote });
    fixed++;
    if (fixed <= 10) console.log(`  修复 id=${r.id}: ${r.img || "(空)"} -> ${remote}`);
  }
  console.log(`[FixCover] 完成：封面正常 ${ok}，修复 ${fixed}，无可用正文图跳过 ${skipNoImg}`);
  await db.destroy();
}

main().catch((e) => { console.error("[FixCover] 异常:", e); db.destroy().finally(() => process.exit(1)); });
