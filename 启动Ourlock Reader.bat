@echo off
chcp 65001 >nul
title Ourlock Reader

:: 获取扩展目录的绝对路径
set "EXT_DIR=%~dp0outlook-reader-extension"

:: 关闭已有 Edge（可选，取消注释下面这行）
:: taskkill /f /im msedge.exe >nul 2>&1

:: 用 Edge 打开 AO3 并自动加载扩展
:: 注意：首次运行需要手动开启一次开发者模式，之后会记住
start "" "msedge.exe" --load-extension="%EXT_DIR%" "https://archiveofourown.org"

echo 已启动 Edge + Ourlock Reader 扩展
echo 如果扩展未生效，请先手动打开一次 edge://extensions/ 并开启「开发者模式」
timeout /t 5
