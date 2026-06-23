/**
 * 通用券商文章爬虫：把 chiefrich.com/dealer/<broker>/ 列表全部文章爬到 cms_article
 * 处理逻辑�?XM 一致：
 *  - 遍历列表分页收集详情链接
 *  - 抓标�?正文/来源/时间/描述
 *  - 下载正文图片到本地并改写 <img>，下载失败的图直接删除（避免裂图�?
 *  - niutoucj.com 域名统一替换�?chiefrich.com
 *  - 正文顶部加「开户引导框」（样式同源站，按钮跳转券商推广链接�?
 *  - 列表封面统一用该券商�?<key>.jpg
 *  - 以原�?link 去重，可重复运行
 *
 * 使用：node scripts/spider-broker.js <broker>
 *   例：node scripts/spider-broker.js exness
 *   指定生产库：node --env-file=.env.prd scripts/spider-broker.js exness
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
if (!process.env.DB_DATABASE) dotenv.config({ path: resolve(__dirname, "../.env.dev") });

const SITE = "https://www.chiefrich.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

// ===== 各券商配�?=====
const BROKERS = {
  xm: {
    name: "XM外汇",
    listPath: "/dealer/xm/",
    search: "XM外汇",
    cid: 66,
    aff: "https://affs.click/7lMw6",
    cover: "https://www.chiefrich.com/d/file/p/7e54dd06b5b2dd39ba7d22de9eb71faa.jpg",
    logo: "https://www.chiefrich.com/d/file/p/3aebb97230978ea02ae9d1d2765eb23d.jpg",
  },
  exness: {
    name: "Exness外汇",
    listPath: "/dealer/exness/",
    cid: 67,
    aff: "https://one.exnessonelink.com/a/9qelf970e3",
    cover: "https://www.chiefrich.com/d/file/p/fd8836e32ae744863d7ccc7ce13fc2d6.jpg",
    logo: "https://www.chiefrich.com/d/file/p/0a113100cb702609ccddc0de822e79db.jpg",
  },
  tmgm: {
    name: "TMGM外汇",
    listPath: "/dealer/tmgm/",
    search: "TMGM",
    cid: 68,
    aff: "https://portal.cnfxhero.com/register?node=MzE5NDYw&language=zh-Hans",
    cover: "https://www.chiefrich.com/d/file/p/d11b64a7326fce7ff3d5fd530766e5dc.jpg",
    logo: "https://www.chiefrich.com/d/file/p/b4ffa20ef53e2fb9a9159d3349ac13a9.png",
  },
  dooprime: {
    name: "Doo Prime德璞资本",
    listPath: "/dealer/dooprime/",
    cid: 69,
    aff: "https://user.dprimecenter.cc/signup/S1193555-a01",
    cover: "https://www.chiefrich.com/d/file/p/b40964ca1a5dfd6877849b302293f8aa.jpg",
    logo: "https://www.chiefrich.com/d/file/p/6b0d0f6ab5926223573f9fd168739cb7.png",
  },
  fxtm: {
    name: "FXTM富拓",
    listPath: "/dealer/fxtm/",
    cid: 70,
    aff: "https://trade.fxtm.com/signup?Referral=38927",
    cover: "https://www.chiefrich.com/d/file/p/18c1c06523ba613b69f52b7eb61fc96b.jpg",
    logo: "https://www.chiefrich.com/d/file/p/fxtm_logo9.png",
  },
  ec: {
    name: "EC外汇",
    // 站内�?EC 板块，改用站内搜索关键词收集 EC 文章
    search: "EC Markets",
    cid: 72,
    aff: "https://i.ecmprime.org/api/client/pm/2/X6WR1",
    cover: "https://www.chiefrich.com/d/file/p/2020/08-28/80b3cbca1eb97d9fcf793b59b2c3a51b.jpg",
    logo: "https://www.chiefrich.com/d/file/p/2020/08-28/80b3cbca1eb97d9fcf793b59b2c3a51b.jpg",
  },
};

const KEY = (process.argv[2] || "").toLowerCase();
const CFG = BROKERS[KEY];
if (!CFG) {
  console.error(`请指定券商，可选：${Object.keys(BROKERS).join(", ")}\n例：node scripts/spider-broker.js exness`);
  process.exit(1);
}

const IMG_DIR = resolve(__dirname, `../public/upload/${KEY}`);
const IMG_URL_PREFIX = `/public/upload/${KEY}`;
const coverExt = (path.extname(new URL(CFG.cover).pathname) || ".jpg").toLowerCase();
const logoExt = (path.extname(new URL(CFG.logo).pathname) || ".jpg").toLowerCase();
const COVER_FILE = `${KEY}${coverExt}`;
const LOGO_FILE = `${KEY}-logo${logoExt}`;
const COVER_URL = `${IMG_URL_PREFIX}/${COVER_FILE}`;
const BOX_MARKER = "<!--broker-box-->";

function buildBox() {
  const logo = `${IMG_URL_PREFIX}/${LOGO_FILE}`;
  return `${BOX_MARKER}
<section style="display:flex;clear:both;overflow:hidden;border-radius:5px;padding:0.5em;align-items:center;border:1px solid #ffd9a8;margin-top:10px;margin-bottom:14px;">
<div style="flex:0 0 auto;"><a href="${CFG.aff}" target="_blank" rel="nofollow"><img src="${logo}" alt="${CFG.name}" width="150" height="90" style="display:block;"></a></div>
<div style="flex:1 1 auto;width:330px;margin-left:15px;margin-right:30px;">
<strong style="font-size:1.25em;color:#f04949;"><a href="${CFG.aff}" target="_blank" rel="nofollow" style="color:#f04949;text-decoration:none;">${CFG.name}</a></strong>
<p style="opacity:.6;line-height:1.4;overflow:hidden;font-size:14px;margin:0;">注意：以上链接是${CFG.name}永久开户链接，不要进入假冒黑平台了�?/p>
</div>
<div style="flex:0 0 auto;margin-left:auto;white-space:nowrap;">
<a href="${CFG.aff}" target="_blank" rel="nofollow" style="background-color:#43ab04;color:#fff;display:inline-flex;height:2.4em;align-items:center;justify-content:center;padding:0 1em;border-radius:4px;margin-right:5px;margin-bottom:3px;text-decoration:none;">${CFG.name}官网</a>
<a href="${CFG.aff}" target="_blank" rel="nofollow" style="background-color:#ec3030;color:#fff;display:inline-flex;height:2.4em;align-items:center;justify-content:center;padding:0 1em;border-radius:4px;text-decoration:none;">${CFG.name}开�?/a>
</div>
</section>`;
}

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
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
  return await res.text();
}

const imgCache = new Map();
async function downloadImg(srcAbs) {
  if (imgCache.has(srcAbs)) return imgCache.get(srcAbs);
  try {
    const res = await fetch(srcAbs, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`img HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    let name = path.basename(new URL(srcAbs).pathname) || `img_${Date.now()}.jpg`;
    name = name.replace(/[^\w.\-]/g, "_");
    fs.writeFileSync(path.join(IMG_DIR, name), buf);
    const localUrl = `${IMG_URL_PREFIX}/${name}`;
    imgCache.set(srcAbs, localUrl);
    return localUrl;
  } catch (e) {
    console.log(`  [图片失败] ${srcAbs} - ${e.message}`);
    imgCache.set(srcAbs, null);
    return null;
  }
}

async function downloadAsset(url, file) {
  const fp = path.join(IMG_DIR, file);
  if (fs.existsSync(fp)) return;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
    if (res.ok) {
      fs.writeFileSync(fp, Buffer.from(await res.arrayBuffer()));
      console.log(`[Spider] 已下�?${file}`);
    }
  } catch (e) {
    console.log(`[Spider] ${file} 下载失败（忽略）: ${e.message}`);
  }
}

async function collectLinks() {
  const links = new Set();
  if (CFG.listPath) await collectFromList(links);
  if (CFG.search) await collectFromSearch(links);
  return [...links];
}

async function collectFromList(links) {
  const linkRe = new RegExp(`${CFG.listPath.replace(/\//g, "\\/")}(\\d+)\\.html`);
  let page = 1;
  while (page <= 100) {
    const url = page === 1 ? `${SITE}${CFG.listPath}` : `${SITE}${CFG.listPath}index_${page}.html`;
    let html;
    try { html = await fetchHtml(url); } catch (e) { console.log(`列表�?${page} 停止�?{e.message}`); break; }
    const $ = cheerio.load(html);
    let found = 0;
    $("a.thumbnail-link, h2.entry-title a").each((i, el) => {
      const href = $(el).attr("href") || "";
      if (linkRe.test(href)) {
        const full = absUrl(href);
        if (!links.has(full)) { links.add(full); found++; }
      }
    });
    console.log(`列表�?${page}: 新增 ${found}（累�?${links.size}）`);
    if (found === 0 && page > 1) break;
    page++;
  }
}

// 提取搜索结果页中的文章链接（路径不固定，�?/xxx/数字.html 均收�?
function collectThumbLinks(html, set) {
  const $ = cheerio.load(html);
  $("a.thumbnail-link, h2.entry-title a").each((i, el) => {
    const href = $(el).attr("href") || "";
    if (/\/\d+\.html$/.test(href) && !href.includes("/search/")) {
      set.add(absUrl(href));
    }
  });
}

// 搜索模式：POST 站内搜索�?searchid，再翻页收集文章链接
async function collectFromSearch(links) {
  const res = await fetch(`${SITE}/e/search/index.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA },
    body: new URLSearchParams({ keyboard: CFG.search, show: "title", tempid: "1", tbname: "news" }).toString(),
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
  const finalUrl = res.url || "";
  const m = finalUrl.match(/searchid=(\d+)/);
  if (!m) { console.log(`搜索未返�?searchid�?{finalUrl}）`); return; }
  const searchid = m[1];
  console.log(`搜索 "${CFG.search}" -> searchid=${searchid}`);

  collectThumbLinks(await res.text(), links);
  console.log(`结果�?1: 累计 ${links.size}`);

  let page = 1;
  while (page <= 50) {
    const url = `${SITE}/e/search/result/index.php?page=${page}&searchid=${searchid}`;
    let html;
    try { html = await fetchHtml(url); } catch (e) { break; }
    const before = links.size;
    collectThumbLinks(html, links);
    console.log(`结果�?${page + 1}: 累计 ${links.size}`);
    if (links.size === before) break;
    page++;
  }
}

async function processArticle(url) {
  const exists = await db("cms_article").where("link", url).first();
  if (exists) {
    if (exists.cid === CFG.cid) return "已存�?同栏�?，跳�?;
    // 已存在但在别的栏�?-> 合并到目标栏目，补齐开户框/封面/域名替换
    let content = (exists.content || "").replace(/https?:\/\/(www\.)?(niutoucj|niubencj|niuducj)\.com/g, "https://www.chiefrich.com");
    if (!content.includes(BOX_MARKER)) content = buildBox() + "\n" + content;
    const upd = { cid: CFG.cid, content, img: COVER_URL };
    if (!exists.description || exists.description.trim() === "") {
      const $tmp = cheerio.load(exists.content || "", null, false);
      $tmp("section").first().remove();
      upd.description = ($tmp.root().text() || "").replace(/\s+/g, " ").trim().slice(0, 120);
    }
    await db("cms_article").where("id", exists.id).update(upd);
    return `已合并（�?cid=${exists.cid}）`;
  }

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const title = $("h1.entry-title").first().text().trim();
  if (!title) return "无标题，跳过";

  const source = ($(".entry-author").first().text() || "").replace(/^.*?�?, "").trim() || "网络";
  const dateText = ($(".entry-date").first().text() || "").replace(/^.*?�?, "").trim();
  let createdAt = new Date();
  if (/\d{4}-\d{2}-\d{2}/.test(dateText)) createdAt = new Date(dateText.match(/\d{4}-\d{2}-\d{2}/)[0]);

  const $content = $("article .entry-content").first();
  if (!$content.length) return "无正文容器，跳过";

  const imgEls = $content.find("img").toArray();
  for (const el of imgEls) {
    const src = $(el).attr("src");
    if (!src) continue;
    const localUrl = await downloadImg(absUrl(src));
    if (localUrl) {
      $(el).attr("src", localUrl);
    } else {
      const $p = $(el).closest("p");
      $(el).remove();
      if ($p.length && $p.text().trim() === "" && $p.find("img,iframe,video,a").length === 0) $p.remove();
    }
  }

  let content = ($content.html() || "").trim();
  content = content.replace(/https?:\/\/(www\.)?(niutoucj|niubencj|niuducj)\.com/g, "https://www.chiefrich.com");
  content = buildBox() + "\n" + content;

  let description = ($(".entry-summary").first().text() || "").trim();
  if (!description) description = $content.find("p").first().text().trim();
  if (!description) description = $content.text().trim(); // 兜底：正文纯文本
  description = description.replace(/\s+/g, " ").slice(0, 200);

  await db("cms_article").insert({
    cid: CFG.cid,
    title: title.slice(0, 250),
    description,
    img: COVER_URL,
    content,
    source: source.slice(0, 250),
    author: "",
    status: 0,
    pv: 0,
    link: url,
    createdAt,
    updatedAt: createdAt,
  });
  return `已入库（图片 ${imgEls.length} 张）`;
}

async function main() {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  await downloadAsset(CFG.cover, COVER_FILE);
  await downloadAsset(CFG.logo, LOGO_FILE);

  console.log(`[Spider] 券商: ${CFG.name}  目标�? ${process.env.DB_DATABASE}  cid=${CFG.cid}`);
  const links = await collectLinks();
  console.log(`�?${links.length} 篇，开始抓�?..\n`);

  let ok = 0, skip = 0, fail = 0;
  for (let i = 0; i < links.length; i++) {
    try {
      const r = await processArticle(links[i]);
      r.startsWith("已入�?) ? ok++ : skip++;
      console.log(`[${i + 1}/${links.length}] ${links[i]} -> ${r}`);
    } catch (e) {
      fail++;
      console.log(`[${i + 1}/${links.length}] ${links[i]} -> 失败: ${e.message}`);
    }
  }
  console.log(`\n[Spider] ${CFG.name} 完成：入�?${ok}，跳�?${skip}，失�?${fail}`);
  await db.destroy();
}

main().catch((e) => { console.error("[Spider] 异常:", e); db.destroy().finally(() => process.exit(1)); });
