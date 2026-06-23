/**
 * 爬取 chiefrich.com/dealer/xm/ 列表全部文章到 cms_article（cid=66）
 * - 遍历列表分页，收集详情链接
 * - 抓取每篇详情：标题、正文、来源、时间、描述
 * - 下载正文图片到 public/upload/xm/ 并改写 <img> 路径为本地
 * - 以原文链接(link)去重，可重复运行
 *
 * 使用：node scripts/spider-xm.js
 * 环境变量：默认读 .env.dev（本地库）。指定库：node --env-file=.env.prd scripts/spider-xm.js
 */

import knex from "knex";
import dotenv from "dotenv";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 若未通过 --env-file 注入，则默认加载 .env.dev
if (!process.env.DB_DATABASE) {
  dotenv.config({ path: resolve(__dirname, "../.env.dev") });
}

const SITE = "https://www.chiefrich.com";
const LIST_PATH = "/dealer/xm/";
const CID = 66;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

// 图片本地保存目录与对应 URL 前缀
const IMG_DIR = resolve(__dirname, "../public/upload/xm");
const IMG_URL_PREFIX = "/public/upload/xm";

// 统一的列表封面图（XM）：源站 XM 列表缩略图，保存为 xm.jpg，所有文章封面都用它
const COVER_SOURCE = "https://www.chiefrich.com/d/file/p/7e54dd06b5b2dd39ba7d22de9eb71faa.jpg";
const COVER_URL = `${IMG_URL_PREFIX}/xm.jpg`;

// XM 开户引导框（顶部红框，样式同源站 gwj_class_wjc，按钮跳转 XM 推广链接）
const AFF = "https://affs.click/7lMw6";
const BOX_MARKER = "<!--xm-broker-box-->";
const BROKER_BOX = `${BOX_MARKER}
<section style="display:flex;clear:both;overflow:hidden;border-radius:5px;padding:0.5em;align-items:center;border:1px solid #ffd9a8;margin-top:10px;margin-bottom:14px;">
<div style="flex:0 0 auto;"><a href="${AFF}" target="_blank" rel="nofollow"><img src="${IMG_URL_PREFIX}/xm-logo.jpg" alt="XM外汇" width="150" height="90" style="display:block;"></a></div>
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

function absUrl(u) {
  if (!u) return "";
  u = u.trim();
  if (u.startsWith("http")) return u;
  if (u.startsWith("//")) return "https:" + u;
  return SITE + (u.startsWith("/") ? "" : "/") + u;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
  return await res.text();
}

// 下载图片到本地，返回本地 URL；失败返回原绝对地址
const imgCache = new Map();
async function downloadImg(srcAbs) {
  if (imgCache.has(srcAbs)) return imgCache.get(srcAbs);
  try {
    const res = await fetch(srcAbs, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`img HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    let name = path.basename(new URL(srcAbs).pathname) || `img_${Date.now()}.jpg`;
    name = name.replace(/[^\w.\-]/g, "_");
    const dest = path.join(IMG_DIR, name);
    fs.writeFileSync(dest, buf);
    const localUrl = `${IMG_URL_PREFIX}/${name}`;
    imgCache.set(srcAbs, localUrl);
    return localUrl;
  } catch (e) {
    console.log(`  [图片失败] ${srcAbs} - ${e.message}`);
    imgCache.set(srcAbs, null);
    return null; // 失败返回 null，调用方删除该 img 标签
  }
}

// 收集所有列表页的详情链接
async function collectLinks() {
  const links = new Set();
  let page = 1;
  const maxPage = 50; // 安全上限
  while (page <= maxPage) {
    const url = page === 1 ? `${SITE}${LIST_PATH}` : `${SITE}${LIST_PATH}index_${page}.html`;
    let html;
    try {
      html = await fetchHtml(url);
    } catch (e) {
      console.log(`列表页 ${page} 取不到，停止：${e.message}`);
      break;
    }
    const $ = cheerio.load(html);
    let found = 0;
    $("a.thumbnail-link, h2.entry-title a").each((i, el) => {
      const href = $(el).attr("href") || "";
      const m = href.match(/\/dealer\/xm\/(\d+)\.html/);
      if (m) {
        const full = absUrl(href);
        if (!links.has(full)) {
          links.add(full);
          found++;
        }
      }
    });
    console.log(`列表页 ${page}: 新增 ${found} 条（累计 ${links.size}）`);
    if (found === 0 && page > 1) break;
    page++;
  }
  return [...links];
}

// 解析并保存一篇文章
async function processArticle(url) {
  // 去重：link 已存在则跳过
  const exists = await db("cms_article").where("link", url).first();
  if (exists) return "已存在，跳过";

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const title = $("h1.entry-title").first().text().trim();
  if (!title) return "无标题，跳过";

  const source = ($(".entry-author").first().text() || "").replace(/^.*?：/, "").trim() || "网络";
  const dateText = ($(".entry-date").first().text() || "").replace(/^.*?：/, "").trim();
  let createdAt = new Date();
  if (/\d{4}-\d{2}-\d{2}/.test(dateText)) createdAt = new Date(dateText.match(/\d{4}-\d{2}-\d{2}/)[0]);

  const $content = $("article .entry-content").first();
  if (!$content.length) return "无正文容器，跳过";

  // 下载并改写正文图片（封面统一用 xm.jpg，不再取正文首图）
  const imgEls = $content.find("img").toArray();
  for (const el of imgEls) {
    const src = $(el).attr("src");
    if (!src) continue;
    const localUrl = await downloadImg(absUrl(src));
    if (localUrl) {
      $(el).attr("src", localUrl);
    } else {
      // 下载失败（失效图），删除该 img 及残留空段落
      const $p = $(el).closest("p");
      $(el).remove();
      if ($p.length && $p.text().trim() === "" && $p.find("img,iframe,video,a").length === 0) $p.remove();
    }
  }
  const cover = COVER_URL;

  let content = $content.html() || "";
  content = content.trim();
  // 把源站镜像域名 niutoucj.com 统一替换为 chiefrich.com（路径不变）
  content = content
    .replace(/https?:\/\/(www\.)?niutoucj\.com/g, "https://www.chiefrich.com");
  // 正文顶部加 XM 开户引导框
  content = BROKER_BOX + "\n" + content;

  // 描述：摘要 p 或正文首段，截断 250
  let description = ($(".entry-summary").first().text() || "").trim();
  if (!description) description = $content.find("p").first().text().trim();
  description = description.replace(/\s+/g, " ").slice(0, 250);

  await db("cms_article").insert({
    cid: CID,
    title: title.slice(0, 250),
    description,
    img: cover,
    content,
    source: source.slice(0, 250),
    author: "",
    status: 0,
    pv: 0,
    link: url,
    createdAt,
    updatedAt: createdAt,
  });
    return `已入库（图片 ${imgEls.length} 张，封面 xm.jpg）`;
}

async function main() {
  fs.mkdirSync(IMG_DIR, { recursive: true });

  // 准备统一封面 xm.jpg 和引导框 logo xm-logo.jpg（不存在则下载）
  const assets = [
    { file: "xm.jpg", url: "https://www.chiefrich.com/d/file/p/7e54dd06b5b2dd39ba7d22de9eb71faa.jpg" },
    { file: "xm-logo.jpg", url: "https://www.chiefrich.com/d/file/p/3aebb97230978ea02ae9d1d2765eb23d.jpg" },
  ];
  for (const a of assets) {
    const fp = path.join(IMG_DIR, a.file);
    if (fs.existsSync(fp)) continue;
    try {
      const res = await fetch(a.url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
      if (res.ok) {
        fs.writeFileSync(fp, Buffer.from(await res.arrayBuffer()));
        console.log(`[Spider-XM] 已下载 ${a.file}`);
      }
    } catch (e) {
      console.log(`[Spider-XM] ${a.file} 下载失败（忽略）: ${e.message}`);
    }
  }

  console.log(`[Spider-XM] 目标库: ${process.env.DB_DATABASE}  cid=${CID}`);

  const links = await collectLinks();
  console.log(`共收集到 ${links.length} 篇文章，开始抓取...\n`);

  let ok = 0, skip = 0, fail = 0;
  for (let i = 0; i < links.length; i++) {
    const url = links[i];
    try {
      const r = await processArticle(url);
      if (r.startsWith("已入库")) ok++;
      else skip++;
      console.log(`[${i + 1}/${links.length}] ${url} -> ${r}`);
    } catch (e) {
      fail++;
      console.log(`[${i + 1}/${links.length}] ${url} -> 失败: ${e.message}`);
    }
  }

  console.log(`\n[Spider-XM] 完成：入库 ${ok}，跳过 ${skip}，失败 ${fail}`);
  await db.destroy();
}

main().catch((e) => {
  console.error("[Spider-XM] 异常:", e);
  db.destroy().finally(() => process.exit(1));
});
