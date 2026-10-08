[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "NEXUS Mobile App — Запуск проекта"

$projectDir = Join-Path $PSScriptRoot "react-native-nexus"
if (-not (Test-Path (Join-Path $projectDir "package.json"))) {
    $projectDir = $PSScriptRoot
}
Set-Location $projectDir

function Show-Menu {
    Clear-Host
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host "               NEXUS — React Native Mobile Application" -ForegroundColor White
    Write-Host "                  (Expo SDK 57 / React 19 / Metro)" -ForegroundColor DarkGray
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Выберите вариант запуска:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [1] Телефон: Expo Go через облачный туннель (Рекомендуется)" -ForegroundColor Green
    Write-Host "      - Работает на любом телефоне (Android / iPhone)" -ForegroundColor Gray
    Write-Host "      - Не зависит от Wi-Fi роутера, Radmin VPN и брандмауэра Windows" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  [2] Телефон: Expo Go по локальной сети Wi-Fi" -ForegroundColor White
    Write-Host "      - Телефон и компьютер должны быть в одной сети Wi-Fi" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  [3] Компьютер: Мгновенный запуск в браузере (React Native Web)" -ForegroundColor White
    Write-Host "      - Открывается на ПК в браузере с симулятором рамки смартфона" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  [4] Проверка зависимостей и сборки (Expo Doctor)" -ForegroundColor White
    Write-Host ""
    Write-Host "  [0] Выход" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "======================================================================" -ForegroundColor Cyan
}

while ($true) {
    Show-Menu
    $choice = Read-Host "Введите номер действия [1, 2, 3, 4, 0] и нажмите Enter"
    switch ($choice.Trim()) {
        "1" {
            Clear-Host
            Write-Host "[Запуск] Запуск Expo с туннелем и очисткой кэша..." -ForegroundColor Green
            Write-Host "Отсканируйте появившийся QR-код в приложении Expo Go на телефоне.`n" -ForegroundColor Yellow
            npx expo start --tunnel -c
            Write-Host "`nНажмите любую клавишу для возврата в меню..." -ForegroundColor DarkGray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "2" {
            Clear-Host
            Write-Host "[Запуск] Запуск Expo по локальной сети..." -ForegroundColor Cyan
            Write-Host "Отсканируйте QR-код в приложении Expo Go (телефон и ПК должны быть в одном Wi-Fi).`n" -ForegroundColor Yellow
            npx expo start -c
            Write-Host "`nНажмите любую клавишу для возврата в меню..." -ForegroundColor DarkGray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "3" {
            Clear-Host
            Write-Host "[Запуск] Запуск локального dev-сервера React Native Web..." -ForegroundColor Cyan
            Write-Host "Открываем браузер: http://localhost:3000`n" -ForegroundColor Green
            Start-Process "http://localhost:3000"
            npm run dev
            Write-Host "`nНажмите любую клавишу для возврата в меню..." -ForegroundColor DarkGray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "4" {
            Clear-Host
            Write-Host "[Проверка] Проверка совместимости зависимостей Expo SDK 57...`n" -ForegroundColor Yellow
            npx expo install --check
            Write-Host "`nНажмите любую клавишу для возврата в меню..." -ForegroundColor DarkGray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "0" {
            exit 0
        }
        default {
            Write-Host "Неверный ввод! Попробуйте снова." -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
}
