@echo off
chcp 65001 > nul
setlocal

:: Proje dizinine git
cd /d "c:\Users\fatih\Desktop\apps\discilaw\Deneme-test"

:MENU
cls
echo =========================================================
echo   Dişçi Hukuk Bürosu - İçerik Yönetim Paneli
echo =========================================================
echo.
echo   [1] Admin Panelini Başlat (Düzenleme Modu)
echo   [2] Değişiklikleri Canlıya Gönder (Yayınla)
echo   [3] Çıkış
echo.
echo =========================================================
set /p SECIM="Bir işlem seçin (1-3): "

if "%SECIM%"=="1" goto START_SERVER
if "%SECIM%"=="2" goto DEPLOY
if "%SECIM%"=="3" goto END
goto MENU

:START_SERVER
cls
echo Sunucu ayrı pencerede başlatılıyor...
echo Admin paneli tarayıcınızda açılacak.
echo.

:: Sunucuyu AYRI BİR PENCEREDE başlat (bu pencere kapanmaz)
start "Disci Hukuk Dev Server" cmd /k "cd /d c:\Users\fatih\Desktop\apps\discilaw\Deneme-test && npm run dev"

:: Biraz bekle, sunucunun başlaması için
timeout /t 5 > nul

:: Tarayıcıyı aç
start "" "http://localhost:4321/keystatic"

echo.
echo =========================================================
echo   Sunucu arka planda çalışıyor.
echo   Düzenlemelerinizi yapıp kaydedin.
echo   İşiniz bitince buraya dönüp [2] ile yayınlayın.
echo =========================================================
echo.
pause
goto MENU

:DEPLOY
cls
echo.
echo =========================================================
echo   DEĞİŞİKLİKLER HAZIRLANIYOR...
echo =========================================================
echo.

:: Önce dosyaları ekle
git add .

:: Git durumunu göster
echo.
echo Aşağıdaki değişiklikler yayınlanacak:
echo -----------------------------------------
git status --short
echo -----------------------------------------
echo.

set /p ONAY="Onaylıyor musunuz? (E/H): "
if /I "%ONAY%" NEQ "E" goto MENU

echo.
echo Versiyon oluşturuluyor...
set /p MSG="Değişiklik açıklaması (boş geçmek için Enter): "
if "%MSG%"=="" set MSG=Yeni içerik güncellemesi

git commit -m "%MSG%"

echo.
echo GitHub'a gönderiliyor...
git push origin main

echo.
echo =========================================================
echo   ✅ BAŞARIYLA YAYINLANDI!
echo   Değişiklikler 1-2 dakika içinde discilaw.com'da görünür.
echo =========================================================
echo.
pause
goto MENU

:END
echo.
echo Güle güle!
timeout /t 2 > nul
exit
