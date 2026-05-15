/**
 * 财经快讯同步脚本
 * 从金十数据获取实时快讯，存入数据库
 * 
 * 使用方式：node scripts/sync-flash-news.js
 * 守护模式：node scripts/sync-flash-news.js --daemon
 */

import knex from 'knex';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as OpenCC from 'opencc-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const t2s = OpenCC.Converter({ from: 'tw', to: 'cn' });

dotenv.config({ path: resolve(__dirname, '../.env.prd') });

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

// 确保快讯表存在
async function ensureTable() {
  const exists = await db.schema.hasTable('cms_flash_news');
  if (!exists) {
    await db.schema.createTable('cms_flash_news', (table) => {
      table.increments('id').primary();
      table.text('content').notNullable();
      table.boolean('important').defaultTo(false);
      table.timestamp('publishAt').defaultTo(db.fn.now());
      table.timestamp('createdAt').defaultTo(db.fn.now());
    });
    console.log('创建 cms_flash_news 表成功');
  }
}

// 从金十数据 API 获取快讯
async function fetchFlashNews() {
  try {
    const url = 'https://flash-api.jin10.com/get_flash_list';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.jin10.com/',
        'Origin': 'https://www.jin10.com',
        'x-app-id': 'bVBF4FyRTn5NJF5n',
        'x-version': '1.0.0',
      },
    });

    if (!response.ok) {
      console.error(`金十数据请求失败: ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (data?.errno === 0 && data?.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('获取快讯失败:', error.message);
    return [];
  }
}

// 从鉅亨網获取快讯作为备选
async function fetchCnyesFlash() {
  try {
    const url = 'https://api.cnyes.com/media/api/v1/newslist/category/headline?page=1&limit=30';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (data?.statusCode === 200 && data?.items?.data) {
      return data.items.data.map(item => ({
        content: t2s(item.title || ''),
        important: false,
        publishAt: item.publishAt ? new Date(item.publishAt * 1000) : new Date(),
      }));
    }
    return [];
  } catch (error) {
    console.error('获取鉅亨快讯失败:', error.message);
    return [];
  }
}

// 解析金十数据的快讯内容
function parseJin10Content(item) {
  let content = '';
  
  if (item.data && item.data.content) {
    content = item.data.content;
  } else if (item.data && item.data.title) {
    content = item.data.title;
  }

  // 去除 HTML 标签
  content = content.replace(/<[^>]+>/g, '').trim();
  
  if (!content) return null;

  const important = item.important === 1 || item.type === 1;
  const publishAt = item.time ? new Date(item.time) : new Date();

  return { content, important, publishAt };
}

// 同步快讯数据
async function syncFlashNews() {
  console.log(`[${new Date().toLocaleString()}] 开始同步快讯...`);

  // 优先尝试金十数据
  let items = await fetchFlashNews();
  let source = '金十数据';
  
  if (items.length === 0) {
    // 备选：鉅亨網
    const cnyesItems = await fetchCnyesFlash();
    if (cnyesItems.length > 0) {
      source = '鉅亨網';
      let insertCount = 0;
      for (const item of cnyesItems) {
        // 去重
        const exists = await db('cms_flash_news')
          .where('content', item.content)
          .first();
        if (!exists) {
          await db('cms_flash_news').insert(item);
          insertCount++;
        }
      }
      console.log(`  来源: ${source}, 获取 ${cnyesItems.length} 条, 新增 ${insertCount} 条`);
      return;
    }
    console.log('  所有数据源均无数据');
    return;
  }

  // 解析金十数据
  let insertCount = 0;
  for (const item of items) {
    const parsed = parseJin10Content(item);
    if (!parsed || !parsed.content) continue;

    // 去重
    const exists = await db('cms_flash_news')
      .where('content', parsed.content)
      .first();
    if (exists) continue;

    await db('cms_flash_news').insert({
      content: parsed.content,
      important: parsed.important,
      publishAt: parsed.publishAt,
    });
    insertCount++;
  }

  console.log(`  来源: ${source}, 获取 ${items.length} 条, 新增 ${insertCount} 条`);
}

// 主函数
async function main() {
  await ensureTable();

  const args = process.argv.slice(2);
  const isDaemon = args.includes('--daemon');

  await syncFlashNews();

  if (isDaemon) {
    console.log('\n守护模式启动，每5分钟同步一次...');
    setInterval(syncFlashNews, 5 * 60 * 1000);
  } else {
    await db.destroy();
    process.exit(0);
  }
}

main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
