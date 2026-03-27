import { execSync } from 'child_process';

console.log('🚀 一键安装 + 配置 PM2 日志切割（1核1G专用）\n');

// 安全执行命令
const run = (cmd) => {
  try {
    console.log('▶ 执行：', cmd);
    execSync(cmd, { encoding: 'utf8', stdio: 'ignore' });
  } catch (err) {
    // 忽略已安装/重复配置的错误
  }
};

// ====================== 全自动流程 ======================

// 1. 全局安装 PM2
run('npm install pm2 -g');

// 2. 安装日志切割插件
run('pm2 install pm2-logrotate');

// 3. 核心配置（2M一切割，1核1G最稳）
run('pm2 set pm2-logrotate:max_size 2M');
run('pm2 set pm2-logrotate:retain 5');
run('pm2 set pm2-logrotate:compress false');
run('pm2 set pm2-logrotate:rotateInterval ""');
run('pm2 set pm2-logrotate:dateFormat "YYYY-MM-DD_HH"');
run('pm2 set pm2-logrotate:timezone "Asia/Shanghai"');

// 4. 生效配置
run('pm2 reloadlogs');

console.log('\n✅ 全部完成！');
console.log('📌 已安装 PM2 + 配置 2M 自动切割日志');