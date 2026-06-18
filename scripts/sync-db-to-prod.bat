@echo off
echo ========================================
echo   同步本地数据库到线上服务器
echo ========================================
echo.

:: 本地数据库配置
set LOCAL_HOST=localhost
set LOCAL_USER=root
set LOCAL_PASS=123456
set LOCAL_DB=init

:: 线上服务器配置（改成你的实际信息）
set REMOTE_HOST=140.143.87.188
set REMOTE_USER=chiefday
set REMOTE_PASS=123456
set REMOTE_DB=chiefday
set REMOTE_SSH_USER=root
set REMOTE_SSH_PORT=22

:: 临时文件
set DUMP_FILE=%TEMP%\chiefbao_sync.sql

echo [1/3] 导出本地数据库 %LOCAL_DB% ...
mysqldump -h %LOCAL_HOST% -u %LOCAL_USER% -p%LOCAL_PASS% %LOCAL_DB% > "%DUMP_FILE%"
if %errorlevel% neq 0 (
    echo 导出失败！请检查本地MySQL是否运行
    pause
    exit /b 1
)
echo 导出成功！文件大小：
for %%A in ("%DUMP_FILE%") do echo %%~zA bytes
echo.

echo [2/3] 上传到服务器并导入 ...
echo 请手动操作：
echo   1. 通过宝塔文件管理上传 %DUMP_FILE% 到服务器 /tmp/
echo   2. 在宝塔终端执行：
echo      mysql -u %REMOTE_USER% -p%REMOTE_PASS% %REMOTE_DB% ^< /tmp/chiefbao_sync.sql
echo   3. 重启应用：pm2 restart ChanCMS
echo.
echo 或者如果安装了 scp，可以一键执行：
echo   scp "%DUMP_FILE%" %REMOTE_SSH_USER%@%REMOTE_HOST%:/tmp/chiefbao_sync.sql
echo   ssh %REMOTE_SSH_USER%@%REMOTE_HOST% "mysql -u %REMOTE_USER% -p%REMOTE_PASS% %REMOTE_DB% < /tmp/chiefbao_sync.sql && pm2 restart ChanCMS"
echo.

echo [3/3] 完成！
echo 导出文件位置: %DUMP_FILE%
pause
