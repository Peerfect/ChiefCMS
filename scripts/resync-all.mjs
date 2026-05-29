/**
 * 完全重新同步：删除6个栏目的所有scraped文章，重新从chiefrich.com抓取并下载图片到本地
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

// CID与URL映射
const syncConfig = [
  { cid: 17, name: '外汇行情', urls: ['https://www.chiefrich.com/waihui/whgg/', 'https://www.chiefrich.com/waihui/whtz/'] },
  { cid: 18, name: '外汇平台', urls: ['https://www.chiefrich.com/waihui/whpt/'] },
  { cid: 19, name: '外汇开户', urls: ['https://www.chiefrich.com/waihui/whkh/'] },
  { cid: 20, name: '外汇策略', urls: ['https://www.chiefrich.com/waihui/whjycn/'] },
  { cid: 21, name: '外汇入门', urls: ['https://www.chiefrich.com/waihui/whrm/', 'https://www.chiefrich.com/waihui/xinshou/'] },
  { cid: 22, name: '外汇交易', urls: ['https://www.chiefrich.com/waihui/whjy/'] },
];

async function downloadImage(imgUrl) {
  if (!imgUrl || (!imgUrl.startsWith('http://') && !imgUrl.startsWith('https://'))) {
    return '';
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/*',
      },
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
    const fullDir = path.join(rootPath, dir);

    fs.mkdirSync(fullDir, { recursive: true });

    const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = path.join(fullDir, filename);

    fs.writeFileSync(filePath, buffer);

    return `/${dir.replace(/\\/g, '/')}/${filename}`;
  } catch (err) {
    return '';
  }
}

async function fetchArticleList(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!response.ok) return [];

    const content = await response.text();
    if (!content) return [];

    return parseArticleHTML(content);
  } catch (err) {
    console.error(`  抓取列表失败 ${url}:`, err.message);
    return [];
  }
}

function parseArticleHTML(html) {
  const $ = cheerio.load(html);
  const articles = [];

  $('.post').each((index, el) => {
    const $el = $(el);
    const $titleLink = $el.find('.entry-title a').first();
    const title = ($titleLink.attr('title') || $titleLink.text() || '').trim();

    if (!title || title.length < 5) return;
    if (articles.some(a => a.title === title)) return;

    const href = $titleLink.attr('href') || '';
    const url = href.startsWith('http') ? href : `https://www.chiefrich.com${href}`;

    // 缩略图
    let img = '';
    const imgSrc = $el.find('.thumbnail-link img').attr('src')
      || $el.find('.thumbnail-wrap img').attr('src')
      || $el.find('.post-thumbnail img').attr('src')
      || $el.find('img').first().attr('src')
      || '';
    if (imgSrc) {
      img = imgSrc.startsWith('http') ? imgSrc : `https://www.chiefrich.com${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
    }

    // 描述
    const description = $el.find('.entry-summary').text().trim().slice(0, 200);

    // 日期
    const date = $el.find('.entry-date').text().replace(/发布时间[：:]?\s*/, '').trim();

    articles.push({ title, description, img, url, date });
  });

  return articles;
}

async function fetchArticleContent(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!response.ok) return '';

    const html = await response.text();
    const $ = cheerio.load(html);
    const $content = $('.entry-content');

    // 外链域名替换
    $content.find('a').each((i, el) => {
      const $a = $(el);
      const href = $a.attr('href') || '';
      if (href.startsWith('http') || href.startsWith('//')) {
        try {
          const u = new URL(href.startsWith('//') ? 'https:' + href : href);
          u.hostname = 'www.chiefrich.com';
          u.protocol = 'https:';
          $a.attr('href', u.toString());
        } catch (e) {
          $a.attr('href', 'https://www.chiefrich.com');
        }
      }
    });

    // 图片相对路径补全
    $content.find('img').each((i, el) => {
      const $img = $(el);
      const src = $img.attr('src') || '';
      if (src && !src.startsWith('http') && !src.startsWith('data:')) {
        $img.attr('src', `https://www.chiefrich.com${src.startsWith('/') ? '' : '/'}${src}`);
      }
    });

    return $content.html() || '';
  } catch (err) {
    return '';
  }
}

async function main() {
  const cids = syncConfig.map(c => c.cid);

  // 第一步：删除所有 scraped 文章
  console.log('========================================');
  console.log('第一步：删除旧的 scraped 文章');
  console.log('========================================');

  const deleteCount = await db('cms_article')
    .whereIn('cid', cids)
    .where('source', 'scraped')
    .del();

  console.log(`已删除 ${deleteCount} 条 scraped 文章\n`);

  // 第二步：逐个栏目重新抓取
  console.log('========================================');
  console.log('第二步：重新抓取文章');
  console.log('========================================\n');

  let totalInserted = 0;

  for (const config of syncConfig) {
    console.log(`--- [${config.name}] cid=${config.cid} ---`);

    // 从所有URL抓取文章列表
    let allArticles = [];
    for (const url of config.urls) {
      console.log(`  抓取列表: ${url}`);
      const articles = await fetchArticleList(url);
      console.log(`  获取到 ${articles.length} 篇文章`);

      for (const a of articles) {
        if (!allArticles.some(x => x.title === a.title)) {
          allArticles.push(a);
        }
      }
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`  去重后共 ${allArticles.length} 篇文章`);

    // 逐篇处理：下载图片 + 获取正文 + 插入数据库
    let inserted = 0;
    for (let i = 0; i < allArticles.length; i++) {
      const a = allArticles[i];

      // 下载缩略图
      let localImg = '';
      if (a.img) {
        localImg = await downloadImage(a.img);
      }

      // 获取正文
      let content = '';
      if (a.url) {
        content = await fetchArticleContent(a.url);
        await new Promise(r => setTimeout(r, 300));
      }

      // 插入数据库
      await db('cms_article').insert({
        title: a.title,
        description: a.description || '',
        img: localImg,
        link: a.url,
        cid: config.cid,
        source: 'scraped',
        content: content || a.description || '',
        status: 0,
        pv: 0,
        createdAt: a.date ? new Date(a.date) : new Date(),
      });

      inserted++;
      const imgStatus = localImg ? '✓图片' : '✗无图';
      const contentStatus = content ? '✓正文' : '✗无正文';
      console.log(`  [${i + 1}/${allArticles.length}] ${imgStatus} ${contentStatus} ${a.title.slice(0, 35)}`);
    }

    // 插入扩展表
    try {
      const categoryInfo = await db('cms_category').select('mid').where('id', config.cid).first();
      if (categoryInfo?.mid && categoryInfo.mid !== '0') {
        const modelInfo = await db('cms_model').select('tableName').where('id', categoryInfo.mid).first();
        if (modelInfo?.tableName) {
          const newIds = await db('cms_article')
            .select('id', 'description')
            .where('cid', config.cid)
            .where('source', 'scraped')
            .orderBy('id', 'desc')
            .limit(inserted);
          for (const article of newIds) {
            const exists = await db(modelInfo.tableName).where('aid', article.id).first();
            if (!exists) {
              await db(modelInfo.tableName).insert({ aid: article.id, summary: article.description || '' }).catch(() => {});
            }
          }
        }
      }
    } catch (e) {
      // 扩展表插入失败不影响主流程
    }

    totalInserted += inserted;
    console.log(`  [${config.name}] 完成，插入 ${inserted} 条\n`);
  }

  console.log('========================================');
  console.log(`全部完成！共插入 ${totalInserted} 条文章`);
  console.log('========================================');

  await db.destroy();
}

main().catch(err => {
  console.error('脚本执行出错:', err);
  db.destroy();
});
