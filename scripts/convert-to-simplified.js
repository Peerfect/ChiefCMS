/**
 * 批量将已有繁体文章转换为简体中文
 * 使用方式：node scripts/convert-to-simplified.js
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

async function main() {
  // 查找所有钜亨网来源的文章
  const articles = await db('cms_article')
    .where('author', '鉅亨網')
    .orWhere('author', '钜亨网')
    .select('id', 'title', 'shortTitle', 'description', 'content', 'author');

  console.log(`找到 ${articles.length} 篇需要转换的文章`);

  let count = 0;
  for (const article of articles) {
    await db('cms_article').where('id', article.id).update({
      title: t2s(article.title || ''),
      shortTitle: t2s(article.shortTitle || ''),
      description: t2s(article.description || ''),
      content: t2s(article.content || ''),
      author: '钜亨网',
    });
    count++;
    if (count % 10 === 0) {
      console.log(`已转换 ${count}/${articles.length} 篇`);
    }
  }

  console.log(`转换完成！共处理 ${count} 篇文章`);
  await db.destroy();
}

main().catch(err => {
  console.error('执行失败:', err);
  process.exit(1);
});
