@echo off
echo Mengaktifkan InPro System...

:: Start Backend
start "InPro Backend" cmd /k "cd backend && npm run dev"

:: Start Frontend
start "InPro Frontend" cmd /k "npm run dev"

echo.
echo Aplikasi sedang dijalankan!
echo 1. Backend berjalan di window baru (Port 3001)
echo 2. Frontend berjalan di window baru (Port 5173)
echo.
echo Silakan tunggu sebentar lalu buka browser di: http://localhost:5173
pause
