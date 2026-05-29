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
  if (!imgUrl || (!imgUrl.startsWith('http://') && !imgUrl.startsWith('https://'))) return '';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(imgUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', Accept: 'image/*' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return '';
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) return '';
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 100) return '';
    const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' };
    const ext = extMap[contentType.split(';')[0]] || 'jpg';
    const now = new Date();
    const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const dir = path.join('public', 'uploads', template, 'image', date);
    fs.mkdirSync(path.join(rootPath, dir), { recursive: true });
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    fs.writeFileSync(path.join(rootPath, dir, filename), buffer);
    return `/${dir.replace(/\\/g, '/')}/${filename}`;
  } catch (err) { return ''; }
}

async function fetchArticleList(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', Accept: 'text/html', 'Accept-Language': 'zh-CN,zh;q=0.9' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return [];
    const html = await response.text();
    const $ = cheerio.load(html);
    const articles = [];
    $('.post').each((i, el) => {
      const $el = $(el);
      const $titleLink = $el.find('.entry-title a').first();
      const title = ($titleLink.attr('title') || $titleLink.text() || '').trim();
      if (!title || title.length < 5 || articles.some(a => a.title === title)) return;
      const href = $titleLink.attr('href') || '';
      const url = href.startsWith('http') ? href : `https://www.chiefrich.com${href}`;
      let img = '';
      const imgSrc = $el.find('.thumbnail-link img').attr('src') || $el.find('.thumbnail-wrap img').attr('src') || $el.find('.post-thumbnail img').attr('src') || $el.find('img').first().attr('src') || '';
      if (imgSrc) img = imgSrc.startsWith('http') ? imgSrc : `https://www.chiefrich.com${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
      const description = $el.find('.entry-summary').text().trim().slice(0, 200);
      const date = $el.find('.entry-date').text().replace(/发布时间[：:]?\s*/, '').trim();
      articles.push({ title, description, img, url, date });
    });
    return articles;
  } catch (err) { console.error('抓取失败:', err.message); return []; }
}

async function fetchArticleContent(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' }, signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return '';
    const html = await response.text();
    const $ = cheerio.load(html);
    const $content = $('.entry-content');
    $content.find('a').each((i, el) => {
      const $a = $(el);
      const href = $a.attr('href') || '';
      if (href.startsWith('http') || href.startsWith('//')) {
        try { const u = new URL(href.startsWith('//') ? 'https:' + href : href); u.hostname = 'www.chiefrich.com'; u.protocol = 'https:'; $a.attr('href', u.toString()); } catch (e) { $a.attr('href', '#'); }
      }
    });
    $content.find('img').each((i, el) => {
      const $img = $(el);
      const src = $img.attr('src') || '';
      if (src && !src.startsWith('http') && !src.startsWith('data:')) $img.attr('src', `https://www.chiefrich.com${src.startsWith('/') ? '' : '/'}${src}`);
    });
    return $content.html() || '';
  } catch (err) { return ''; }
}

async function main() {
  console.log('--- 曝光台 (cid=23) 重新同步 ---\n');

  // 删除旧数据
  const deleted = await db('cms_article').where('cid', 23).where('source', 'scraped').del();
  console.log(`已删除 ${deleted} 条旧数据\n`);

  // 抓取
  console.log('抓取列表: https://www.chiefrich.com/weiquan/');
  const articles = await fetchArticleList('https://www.chiefrich.com/weiquan/');
  console.log(`获取到 ${articles.length} 篇文章\n`);

  let inserted = 0;
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const localImg = a.img ? await downloadImage(a.img) : '';
    let content = '';
    if (a.url) { content = await fetchArticleContent(a.url); await new Promise(r => setTimeout(r, 300)); }

    await db('cms_article').insert({
      title: a.title, description: a.description || '', img: localImg,
      link: a.url, cid: 23, source: 'scraped', content: content || a.description || '',
      status: 0, pv: 0, createdAt: a.date ? new Date(a.date) : new Date(),
    });

    inserted++;
    const imgStatus = localImg ? '✓图片' : '✗无图';
    const contentStatus = content ? '✓正文' : '✗无正文';
    console.log(`[${i + 1}/${articles.length}] ${imgStatus} ${contentStatus} ${a.title.slice(0, 40)}`);
  }

  console.log(`\n完成！共插入 ${inserted} 条文章`);
  await db.destroy();
}

main().catch(err => { console.error(err); db.destroy(); });
