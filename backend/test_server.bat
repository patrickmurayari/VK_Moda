@echo off
cd /d "Escritorio\ProyectosDesarrolloWeb\VyATaylorShop\backend"
echo === Iniciando servidor backend ===
start /B node index.js
timeout /t 3 >nul
echo === Testeando endpoints ===
node scripts\test_endpoints.js
pause
