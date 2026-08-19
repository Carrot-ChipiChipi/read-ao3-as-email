# Outlook Reader - Edge 扩展加载器
# 双击运行即可打开带扩展的 Edge

$ErrorActionPreference = "SilentlyContinue"

# 扩展目录
$extDir = Join-Path $PSScriptRoot "outlook-reader-extension"

# 检查扩展目录是否存在
if (-not (Test-Path $extDir)) {
    Write-Host "错误：找不到扩展目录 $extDir" -ForegroundColor Red
    Read-Host "按回车退出"
    exit 1
}

# 检查开发者模式是否已开启
$regPath = "HKCU:\Software\Microsoft\Edge\Extensions"
$devMode = Get-ItemProperty -Path "HKCU:\Software\Policies\Microsoft\Edge" -Name "DeveloperToolsAvailability" -ErrorAction SilentlyContinue

if ($devMode -and $devMode.DeveloperToolsAvailability -eq 2) {
    Write-Host "警告：开发者模式被策略禁用" -ForegroundColor Yellow
    Write-Host "请联系管理员解除限制，或手动开启开发者模式" -ForegroundColor Yellow
}

# 启动 Edge 并加载扩展
Write-Host "正在启动 Edge + Outlook Reader 扩展..." -ForegroundColor Cyan

$edgePath = Get-Command "msedge.exe" -ErrorAction SilentlyContinue
if (-not $edgePath) {
    # 尝试默认路径
    $edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    if (-not (Test-Path $edgePath)) {
        $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    }
}

Start-Process $edgePath -ArgumentList "--load-extension=`"$extDir`"", "https://archiveofourown.org"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Outlook Reader 已启动！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "如果扩展未生效，请：" -ForegroundColor Yellow
Write-Host "1. 打开 edge://extensions/" -ForegroundColor Yellow
Write-Host "2. 打开右下角「开发者模式」开关" -ForegroundColor Yellow
Write-Host "3. 刷新页面后扩展会自动加载" -ForegroundColor Yellow
Write-Host ""
Start-Sleep -Seconds 3
