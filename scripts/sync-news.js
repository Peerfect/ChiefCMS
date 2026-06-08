/**
 * 鉅亨網新闻同步脚本
 * 每小时从鉅亨網抓取头条新闻，同步到 CMS 数据库
 * 
 * 栏目对应关系：
 * 鉅亨網美股 → 美股
 * 鉅亨網港股 → 港股
 * 鉅亨網台股 → 台股
 * 鉅亨網科技 → 科技
 * 鉅亨網头条 → 实时
 * 
 * 使用方式：node scripts/sync-news.js
 * 定时任务：每小时执行一次
 */

import knex from 'knex';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as OpenCC from 'opencc-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 繁体转简体转换器
const t2s = OpenCC.Converter({ from: 'tw', to: 'cn' });

// 加载环境变量
dotenv.config({ path: resolve(__dirname, '../.env.prd') });

// 数据库连接
const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_DATABASE || 'init',
  },
  pool: { min: 0, max: 2 },
});

// 鉅亨網 API 分类映射
// cnyes API 的分类 ID
const CNYES_CATEGORIES = {
  us_stock: { cnyesId: 'us_stock', name: '美股' },
  hk_stock: { cnyesId: 'hk_stock', name: '港股' },
  tw_stock: { cnyesId: 'tw_stock', name: '台股' },
  tech: { cnyesId: 'tech', name: '科技' },
  headline: { cnyesId: 'headline', name: '实时' },
};

// 获取本地栏目 ID 映射
async function getCategoryMap() {
  const categories = await db('cms_category')
    .select('id', 'name', 'pinyin')
    .whereIn('name', ['美股', '港股', '台股', '科技', '实时']);

  const map = {};
  categories.forEach(cat => {
    map[cat.name] = cat.id;
  });

  console.log('栏目映射:', map);
  return map;
}

// 从鉅亨網 API 获取新闻列表
async function fetchCnyesNews(category, page = 1, limit = 20) {
  try {
    const url = `https://api.cnyes.com/media/api/v1/newslist/category/${category}?page=${page}&limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://www.cnyes.com',
        'Referer': 'https://www.cnyes.com/',
      },
    });

    if (!response.ok) {
      console.error(`请求失败: ${category}, 状态码: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (data?.statusCode === 200 && data?.items?.data) {
      return data.items.data;
    }

    return [];
  } catch (error) {
    console.error(`抓取 ${category} 失败:`, error.message);
    return [];
  }
}

// 将鉅亨網文章转换为 CMS 格式
function transformArticle(article, cid) {
  const now = new Date();
  const publishAt = article.publishAt 
    ? new Date(article.publishAt * 1000) 
    : now;

  // 提取封面图片 URL（取 l 尺寸）
  let img = '';
  if (article.coverSrc) {
    try {
      if (typeof article.coverSrc === 'string') {
        const coverData = JSON.parse(article.coverSrc);
        img = coverData?.l?.src || coverData?.m?.src || '';
      } else if (typeof article.coverSrc === 'object') {
        img = article.coverSrc?.l?.src || article.coverSrc?.m?.src || '';
      }
    } catch {
      // 如果不是 JSON，可能直接是 URL
      if (article.coverSrc.startsWith('http')) {
        img = article.coverSrc;
      }
    }
  }

  return {
    title: t2s(article.title || ''),
    shortTitle: t2s((article.title || '').substring(0, 30)),
    description: t2s((article.summary || '').substring(0, 250)),
    content: t2s(article.content || article.summary || ''),
    img: img.substring(0, 250),
    cid: cid,
    status: 0, // 0=已发布
    pv: 0,
    author: '钜亨网',
    link: `https://news.cnyes.com/news/id/${article.newsId}`,
    attr: '',
    tagId: '',
    createdAt: publishAt,
    updatedAt: now,
  };
}

// 检查文章是否已存在（通过 link 去重）
async function articleExists(link) {
  const existing = await db('cms_article')
    .where('link', link)
    .first();
  return !!existing;
}

// 清理旧数据，只保留最新的 N 条
async function cleanOldArticles(cid, categoryName, keepCount = 20) {
  try {
    const total = await db('cms_article').where('cid', cid).count('id as count').first();
    const count = total?.count || 0;

    if (count <= keepCount) return 0;

    // 获取需要保留的文章 ID
    const keepIds = await db('cms_article')
      .select('id')
      .where('cid', cid)
      .orderBy('createdAt', 'desc')
      .limit(keepCount);

    const idsToKeep = keepIds.map(r => r.id);

    // 删除旧数据
    const deleted = await db('cms_article')
      .where('cid', cid)
      .whereNotIn('id', idsToKeep)
      .del();

    if (deleted > 0) {
      console.log(`  ${categoryName}: 清理旧数据 ${deleted} 条，保留最新 ${keepCount} 条`);
    }
    return deleted;
  } catch (error) {
    console.error(`  ${categoryName} 清理旧数据失败:`, error.message);
    return 0;
  }
}

// 同步单个分类的新闻
async function syncCategory(cnyesCategory, cid, categoryName) {
  console.log(`\n开始同步: ${categoryName} (cnyes: ${cnyesCategory})`);

  const articles = await fetchCnyesNews(cnyesCategory, 1, 20);
  
  if (articles.length === 0) {
    console.log(`  ${categoryName}: 没有获取到文章`);
    return 0;
  }

  let insertCount = 0;

  for (const article of articles) {
    const link = `https://news.cnyes.com/news/id/${article.newsId}`;
    
    // 去重检查
    const exists = await articleExists(link);
    if (exists) {
      continue;
    }

    const articleData = transformArticle(article, cid);

    try {
      await db('cms_article').insert(articleData);
      insertCount++;
    } catch (error) {
      console.error(`  插入失败: ${article.title}`, error.message);
    }
  }

  // 实时栏目：插入新数据后只保留最新 20 条
  if (categoryName === '实时') {
    await cleanOldArticles(cid, categoryName, 20);
  }

  console.log(`  ${categoryName}: 获取 ${articles.length} 篇, 新增 ${insertCount} 篇`);
  return insertCount;
}

// 主同步函数
async function syncAll() {
  console.log('========================================');
  console.log(`开始同步 - ${new Date().toLocaleString()}`);
  console.log('========================================');

  try {
    const categoryMap = await getCategoryMap();

    if (Object.keys(categoryMap).length === 0) {
      console.error('错误: 未找到对应栏目，请确认数据库中存在 美股/港股/台股/科技/实时 栏目');
      return;
    }

    let totalInserted = 0;

    for (const [key, config] of Object.entries(CNYES_CATEGORIES)) {
      const cid = categoryMap[config.name];
      if (!cid) {
        console.log(`  跳过 ${config.name}: 未找到对应栏目`);
        continue;
      }
      const count = await syncCategory(config.cnyesId, cid, config.name);
      totalInserted += count;
    }

    console.log(`\n同步完成! 共新增 ${totalInserted} 篇文章`);
  } catch (error) {
    console.error('同步出错:', error);
  }
}

// 执行
async function main() {
  const args = process.argv.slice(2);
  const isDaemon = args.includes('--daemon');

  await syncAll();

  if (isDaemon) {
    // 守护模式：每小时执行一次
    console.log('\n守护模式启动，每小时同步一次...');
    setInterval(syncAll, 60 * 60 * 1000);
  } else {
    await db.destroy();
    process.exit(0);
  }
}

main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
