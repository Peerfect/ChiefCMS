#!/usr/bin/env node
/**
 * MySQL SQL 转 SQLite 转换器
 * 用于将 ChanCMS 的 MySQL init.sql 转换为 SQLite 数据库
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 检查是否安装了 better-sqlite3
let Database;
try {
  const betterSqlite3 = await import('better-sqlite3');
  Database = betterSqlite3.default;
} catch (e) {
  console.error('请先安装 better-sqlite3: npm install better-sqlite3');
  process.exit(1);
}

const inputFile = path.join(__dirname, 'init.sql');
const outputFile = path.join(__dirname, 'init.sqlite');

// 读取 SQL 文件
console.log('📖 读取 MySQL SQL 文件...');
const sqlContent = fs.readFileSync(inputFile, 'utf-8');

// 删除已存在的 SQLite 文件
if (fs.existsSync(outputFile)) {
  console.log('🗑️  删除已存在的 SQLite 文件...');
  fs.unlinkSync(outputFile);
}

// 创建新的 SQLite 数据库
console.log('📦 创建 SQLite 数据库...');
const db = new Database(outputFile);

// 启用外键支持
db.exec('PRAGMA foreign_keys = ON;');

// 转换 MySQL 数据类型为 SQLite 类型
function convertDataType(mysqlType) {
  const type = mysqlType.toLowerCase().trim();

  // 整数类型
  if (/^(tinyint|smallint|mediumint|int|bigint|integer)/.test(type)) {
    return 'INTEGER';
  }
  // 浮点类型
  if (/^(float|double|decimal|numeric|real)/.test(type)) {
    return 'REAL';
  }
  // 字符串类型
  if (/^(char|varchar|text|tinytext|mediumtext|longtext)/.test(type)) {
    return 'TEXT';
  }
  // 二进制类型
  if (/^(blob|tinyblob|mediumblob|longblob|binary|varbinary)/.test(type)) {
    return 'BLOB';
  }
  // 日期时间类型
  if (/^(date|datetime|timestamp|time)/.test(type)) {
    return 'TEXT';
  }
  // 年份类型
  if (/^year/.test(type)) {
    return 'INTEGER';
  }
  // 枚举类型
  if (/^enum/.test(type)) {
    return 'TEXT';
  }

  return 'TEXT';
}

// 转换 CREATE TABLE 语句
function convertCreateTable(sql) {
  // 提取表名
  const tableNameMatch = sql.match(/CREATE\s+TABLE\s+[`"']?(\w+)[`"']?/i);
  if (!tableNameMatch) {
    throw new Error('无法解析表名');
  }
  const tableName = tableNameMatch[1];

  // 提取括号内的内容（处理嵌套括号）
  const startIdx = sql.indexOf('(');
  if (startIdx === -1) {
    throw new Error('无法找到字段定义开始位置');
  }

  let depth = 1;
  let endIdx = startIdx + 1;
  while (endIdx < sql.length && depth > 0) {
    if (sql[endIdx] === '(') depth++;
    if (sql[endIdx] === ')') depth--;
    endIdx++;
  }

  if (depth !== 0) {
    throw new Error('括号不匹配');
  }

  const columnsDef = sql.substring(startIdx + 1, endIdx - 1);

  // 分割字段定义
  const columns = [];
  let current = '';
  let parenDepth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < columnsDef.length; i++) {
    const char = columnsDef[i];
    const nextChar = columnsDef[i + 1];

    // 处理字符串
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
      current += char;
    } else if (inString && char === stringChar) {
      if (nextChar === stringChar) {
        current += char;
        i++;
      } else {
        inString = false;
        stringChar = '';
        current += char;
      }
    } else if (!inString) {
      if (char === '(') {
        parenDepth++;
        current += char;
      } else if (char === ')') {
        parenDepth--;
        current += char;
      } else if (char === ',' && parenDepth === 0) {
        columns.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    columns.push(current.trim());
  }

  // 转换每个字段定义
  const convertedColumns = [];
  const primaryKeys = [];
  const uniqueKeys = [];
  let hasAutoIncrement = false;

  for (const col of columns) {
    const trimmed = col.trim();
    if (!trimmed) continue;

    // 跳过 KEY 索引定义
    if (/^KEY\s+/i.test(trimmed)) {
      continue;
    }

    // 处理 PRIMARY KEY 约束（表级约束）
    if (/^PRIMARY\s+KEY/i.test(trimmed)) {
      const pkMatch = trimmed.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i);
      if (pkMatch) {
        const keys = pkMatch[1].split(',').map(k => k.trim().replace(/[`"]/g, ''));
        primaryKeys.push(...keys);
      }
      continue;
    }

    // 处理 UNIQUE KEY 约束
    if (/^UNIQUE\s+KEY/i.test(trimmed)) {
      const ukMatch = trimmed.match(/UNIQUE\s+KEY\s+[`"]?\w+[`"]?\s*\(([^)]+)\)/i);
      if (ukMatch) {
        const keys = ukMatch[1].split(',').map(k => k.trim().replace(/[`"]/g, ''));
        uniqueKeys.push(keys);
      }
      continue;
    }

    // 跳过 FOREIGN KEY 和 CONSTRAINT
    if (/^(FOREIGN\s+KEY|CONSTRAINT)/i.test(trimmed)) {
      continue;
    }

    // 转换字段定义
    const converted = convertColumn(trimmed);
    if (converted) {
      convertedColumns.push(converted.columnDef);
      if (converted.isAutoIncrement) {
        hasAutoIncrement = true;
      }
    }
  }

  // 构建最终的 CREATE TABLE 语句
  let sqliteSql = `CREATE TABLE "${tableName}" (\n  `;
  sqliteSql += convertedColumns.join(',\n  ');

  // 添加主键约束（只有在没有 AUTOINCREMENT 的情况下才添加）
  if (!hasAutoIncrement && primaryKeys.length > 0) {
    sqliteSql += `,\n  PRIMARY KEY (${primaryKeys.map(k => `"${k}"`).join(', ')})`;
  }

  // 添加唯一约束
  for (const uk of uniqueKeys) {
    sqliteSql += `,\n  UNIQUE (${uk.map(k => `"${k}"`).join(', ')})`;
  }

  sqliteSql += '\n);';

  return sqliteSql;
}

// 转换单个字段定义
function convertColumn(colDef) {
  // 移除 COMMENT
  colDef = colDef.replace(/COMMENT\s+'[^']*'/gi, '');

  // 匹配字段名和类型
  const match = colDef.match(/^[`"']?(\w+)[`"']?\s+(\S+)(.*)$/is);
  if (!match) return null;

  let [, colName, dataType, rest] = match;
  dataType = dataType.toLowerCase();

  // 检查是否有 AUTO_INCREMENT
  const isAutoIncrement = /AUTO_INCREMENT/i.test(rest);

  // 转换数据类型
  const sqliteType = convertDataType(dataType);

  // 构建字段定义
  let result = `"${colName}" ${sqliteType}`;

  // 处理 NOT NULL
  if (/NOT\s+NULL/i.test(rest)) {
    result += ' NOT NULL';
  }

  // 处理 DEFAULT
  const defaultMatch = rest.match(/DEFAULT\s+([^\s,]+)/i);
  if (defaultMatch) {
    let defaultVal = defaultMatch[1];
    if (/CURRENT_TIMESTAMP/i.test(defaultVal)) {
      result += ' DEFAULT CURRENT_TIMESTAMP';
    } else if (defaultVal.toUpperCase() === 'NULL') {
      result += ' DEFAULT NULL';
    } else {
      result += ` DEFAULT ${defaultVal}`;
    }
  }

  // 处理 AUTO_INCREMENT - 在 SQLite 中，AUTOINCREMENT 需要 PRIMARY KEY
  if (isAutoIncrement) {
    result += ' PRIMARY KEY AUTOINCREMENT';
  }

  return {
    columnDef: result,
    isAutoIncrement: isAutoIncrement
  };
}

// 转换 INSERT 语句
function convertInsert(sql) {
  // 将 MySQL 的反引号转换为双引号
  return sql.replace(/`/g, '"');
}

// 提取所有 CREATE TABLE 语句
function extractCreateTables(sql) {
  const tables = [];
  const regex = /CREATE\s+TABLE\s+[`"']?(\w+)[`"']?\s*\(/gi;
  let match;

  while ((match = regex.exec(sql)) !== null) {
    const start = match.index;
    // 找到匹配的右括号
    let depth = 1;
    let i = match.index + match[0].length;
    while (i < sql.length && depth > 0) {
      if (sql[i] === '(') depth++;
      if (sql[i] === ')') depth--;
      i++;
    }
    // 包含 ENGINE 等后续内容直到分号
    while (i < sql.length && sql[i] !== ';') {
      i++;
    }
    const end = i;
    tables.push(sql.substring(start, end));
  }

  return tables;
}

// 提取所有 INSERT 语句
function extractInserts(sql) {
  const inserts = [];
  const regex = /INSERT\s+INTO\s+[`"']?\w+[`"']?/gi;
  let match;

  while ((match = regex.exec(sql)) !== null) {
    const start = match.index;
    let i = start;
    while (i < sql.length && sql[i] !== ';') {
      i++;
    }
    inserts.push(sql.substring(start, i));
  }

  return inserts;
}

// 执行转换
console.log('🔄 开始转换 SQL 语句...');

// 提取 CREATE TABLE 语句
const createTables = extractCreateTables(sqlContent);
console.log(`📊 找到 ${createTables.length} 个 CREATE TABLE 语句`);

// 提取 INSERT 语句
const inserts = extractInserts(sqlContent);
console.log(`📊 找到 ${inserts.length} 个 INSERT 语句`);

let successCount = 0;
let errorCount = 0;
let createTableCount = 0;
let insertCount = 0;
const errors = [];

// 开始事务
db.exec('BEGIN TRANSACTION;');

try {
  // 处理 CREATE TABLE
  console.log('\n🏗️  创建表...');
  for (const tableSql of createTables) {
    try {
      const sqliteSql = convertCreateTable(tableSql);
      db.exec(sqliteSql);
      createTableCount++;
      successCount++;
      const tableMatch = tableSql.match(/CREATE\s+TABLE\s+[`"']?(\w+)[`"']?/i);
      console.log(`   ✅ ${tableMatch ? tableMatch[1] : 'unknown'}`);
    } catch (err) {
      errorCount++;
      const tableMatch = tableSql.match(/CREATE\s+TABLE\s+[`"']?(\w+)[`"']?/i);
      const tableName = tableMatch ? tableMatch[1] : 'unknown';
      errors.push({ type: 'CREATE TABLE', table: tableName, error: err.message });
      console.error(`   ❌ ${tableName}: ${err.message}`);
    }
  }

  // 处理 INSERT
  console.log('\n📝 插入数据...');
  let lastTableName = '';
  let tableInsertCount = 0;

  for (const insertSql of inserts) {
    try {
      const sqliteSql = convertInsert(insertSql);
      db.exec(sqliteSql);
      insertCount++;
      successCount++;

      const tableMatch = insertSql.match(/INSERT\s+INTO\s+[`"']?(\w+)[`"']?/i);
      const tableName = tableMatch ? tableMatch[1] : 'unknown';

      if (tableName !== lastTableName) {
        if (lastTableName) {
          console.log(`   ✅ ${lastTableName}: ${tableInsertCount} 条`);
        }
        lastTableName = tableName;
        tableInsertCount = 1;
      } else {
        tableInsertCount++;
      }
    } catch (err) {
      errorCount++;
      const tableMatch = insertSql.match(/INSERT\s+INTO\s+[`"']?(\w+)[`"']?/i);
      const tableName = tableMatch ? tableMatch[1] : 'unknown';
      if (errors.filter(e => e.type === 'INSERT' && e.table === tableName).length < 3) {
        errors.push({ type: 'INSERT', table: tableName, error: err.message });
      }
    }
  }

  // 输出最后一个表的统计
  if (lastTableName) {
    console.log(`   ✅ ${lastTableName}: ${tableInsertCount} 条`);
  }

  // 提交事务
  db.exec('COMMIT;');

  console.log('\n✅ 转换完成！');
  console.log(`📊 统计信息:`);
  console.log(`   - 成功: ${successCount} 条语句`);
  console.log(`   - 失败: ${errorCount} 条语句`);
  console.log(`   - 创建表: ${createTableCount} 个`);
  console.log(`   - 插入数据: ${insertCount} 条`);
  console.log(`\n📁 输出文件: ${outputFile}`);

  // 显示错误摘要
  if (errors.length > 0) {
    console.log('\n⚠️  错误摘要 (前 20 个):');
    errors.slice(0, 20).forEach((err, i) => {
      console.log(`   ${i + 1}. [${err.type}] ${err.table}: ${err.error}`);
    });
  }

  // 验证数据库
  console.log('\n🔍 验证数据库...');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
  console.log(`   共 ${tables.length} 个表:`);
  tables.forEach(table => {
    const count = db.prepare(`SELECT COUNT(*) as count FROM "${table.name}"`).get();
    console.log(`   - ${table.name}: ${count.count} 条记录`);
  });

} catch (err) {
  db.exec('ROLLBACK;');
  console.error('\n❌ 转换失败:', err.message);
  console.error(err.stack);
  process.exit(1);
} finally {
  db.close();
}

console.log('\n🎉 全部完成！');
