@echo off
chcp 65001 >nul
echo ========================================
echo   一键部署到线上（代码 + 数据库）
echo ========================================
echo.

:: ========== 配置区 ==========
set SERVER_IP=140.143.87.188
set SERVER_USER=root
set SERVER_PATH=/www/wwwroot/www.chiefbao.com/ChanCMS
set LOCAL_PROJECT=D:\develop\CMS\ChanCMS

set DB_LOCAL_USER=root
set DB_LOCAL_PASS=123456
set DB_LOCAL_NAME=init

set DB_REMOTE_USER=chiefday
set DB_REMOTE_PASS=123456
set DB_REMOTE_NAME=chiefday
:: ============================

echo [1/4] 导出本地数据库...
mysqldump -u %DB_LOCAL_USER% -p%DB_LOCAL_PASS% --set-gtid-purged=OFF %DB_LOCAL_NAME% > "%TEMP%\chiefbao_temp.sql"
if %errorlevel% neq 0 (
    echo 数据库导出失败！
    pause
    exit /b 1
)

echo [2/4] 处理兼容性（utf8mb4_0900 -> general）...
node -e "const fs=require('fs');let s=fs.readFileSync('%TEMP%\\chiefbao_temp.sql','utf8');s=s.replace(/utf8mb4_0900_ai_ci/g,'utf8mb4_general_ci');fs.writeFileSync('%TEMP%\\chiefbao_sync.sql',s,'utf8');"
if %errorlevel% neq 0 (
    echo 编码转换失败！
    pause
    exit /b 1
)

echo [3/4] 上传代码和数据库到服务器...
echo.
echo --- 请手动操作以下步骤 ---
echo.
echo 1. 代码同步：
echo    打开宝塔文件管理，把以下文件夹/文件上传覆盖到 %SERVER_PATH%/
echo    - app/          （后端代码）
echo    - view/         （模板）
echo    - config/       （配置）
echo    - scripts/      （脚本）
echo    - pm2.json      （PM2配置）
echo    - .env.prd      （环境变量）
echo.
echo    注意：不需要上传 node_modules、.git、public/uploads（用户上传的文件）
echo.
echo 2. 数据库同步：
echo    上传 %TEMP%\chiefbao_sync.sql 到服务器项目目录
echo    然后在宝塔终端执行：
echo.
echo    cd %SERVER_PATH%
echo    mysql -u %DB_REMOTE_USER% -p%DB_REMOTE_PASS% %DB_REMOTE_NAME% -N -e "SHOW TABLES;" ^| while read t; do mysql -u %DB_REMOTE_USER% -p%DB_REMOTE_PASS% %DB_REMOTE_NAME% -e "DROP TABLE \`$t\`;"; done
echo    mysql -u %DB_REMOTE_USER% -p%DB_REMOTE_PASS% %DB_REMOTE_NAME% ^< chiefbao_sync.sql
echo    pm2 restart ChanCMS
echo.
echo [4/4] SQL文件已生成：%TEMP%\chiefbao_sync.sql
echo.

echo ========================================
echo 部署文件准备完成！按照上面步骤操作即可。
echo ========================================
pause
