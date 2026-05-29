/**
 * 修复所有外汇栏目文章的缩略图
 * 处理两种情况:
 * 1. img 为空（之前被清空的）
 * 2. img 仍然包含 chiefrich.com 外部链接
 * 从来源页面重新获取缩略图并下载到本地
 */
import knex from 'knex';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootPath = path.resolve(__dirname, '..');

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123456',
    database: process.env.DB_DATABASE || 'init'
  }
});

const template = 'default';

async function downloadImage(imgUrl) {
  if (!imgUrl || (!imgUrl.startsWith("http://") && !imgUrl.startsWith("https://"))) {
    return "";
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(imgUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/*",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!response.ok) return "";

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return "";

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 100) return "";

    const extMap = { "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp" };
    const ext = extMap[contentType.split(";")[0]] || "jpg";

    const now = new Date();
    const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const dir = path.join("public", "uploads", template, "image", date);
    const fullDir = path.join(rootPath, dir);

    fs.mkdirSync(fullDir, { recursive: true });

    const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = path.join(fullDir, filename);

    fs.writeFileSync(filePath, buffer);

    return `/${dir.replace(/\\/g, "/")}/${filename}`;
  } catch (err) {
    return "";
  }
}

async function fetchThumbnailFromPage(pageUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(pageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!response.ok) return "";

    const html = await response.text();
    const $ = cheerio.load(html);

    // 尝试多种方式获取缩略图
    const imgSrc = $('meta[property="og:image"]').attr("content")
      || $(".entry-content img").first().attr("src")
      || $(".thumbnail img").first().attr("src")
      || $(".post-thumbnail img").first().attr("src")
      || $(".wp-post-image").first().attr("src")
      || "";

    if (!imgSrc) return "";

    return imgSrc.startsWith("http") ? imgSrc : `https://www.chiefrich.com${imgSrc.startsWith("/") ? "" : "/"}${imgSrc}`;
  } catch (err) {
    return "";
  }
}

async function main() {
  try {
    // 先查看这些栏目的 ID
    const categories = await db('cms_category')
      .whereIn('name', ['外汇行情', '外汇平台', '外汇开户', '外汇策略', '外汇入门', '外汇交易'])
      .select('id', 'name');

    console.log('目标栏目:');
    categories.forEach(c => console.log(`  ${c.name} (cid=${c.id})`));

    const cids = categories.map(c => c.id);

    if (cids.length === 0) {
      console.log('未找到对应栏目，退出');
      await db.destroy();
      return;
    }

    // 获取需要修复的文章：img为空或包含chiefrich.com，且有link
    const articles = await db('cms_article')
      .whereIn('cid', cids)
      .where(function () {
        this.where('img', '')
          .orWhereNull('img')
          .orWhere('img', 'like', '%chiefrich.com%');
      })
      .where('link', '!=', '')
      .whereNotNull('link')
      .select('id', 'title', 'link', 'img');

    console.log(`\n找到 ${articles.length} 条需要修复缩略图的文章\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];

      // 如果 img 是 chiefrich.com 的链接，直接下载这个图片
      let localPath = "";
      if (article.img && article.img.includes("chiefrich.com")) {
        localPath = await downloadImage(article.img);
      }

      // 如果直接下载失败或 img 为空，从详情页抓取
      if (!localPath) {
        const imgUrl = await fetchThumbnailFromPage(article.link);
        if (imgUrl) {
          localPath = await downloadImage(imgUrl);
        }
      }

      if (localPath) {
        await db('cms_article').where('id', article.id).update({ img: localPath });
        success++;
        console.log(`[${i + 1}/${articles.length}] ✓ ${article.title.slice(0, 40)}`);
      } else {
        failed++;
        console.log(`[${i + 1}/${articles.length}] ✗ ${article.title.slice(0, 40)}`);
      }

      // 避免请求过快
      if (i < articles.length - 1) {
        await new Promise(r => setTimeout(r, 600));
      }
    }

    console.log(`\n===== 修复完成 =====`);
    console.log(`成功: ${success} 条`);
    console.log(`失败: ${failed} 条`);
  } catch (err) {
    console.error('执行出错:', err.message);
  } finally {
    await db.destroy();
  }
}

main();
