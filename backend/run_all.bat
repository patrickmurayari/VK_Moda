@echo off
cd /d d:\Escritorio\ProyectosDesarrolloWeb\VyATaylorShop\backend
echo === Re-seeding ===
node scripts\reseed.js
echo === Uploading ===
node scripts\upload_images.js
echo === Verifying ===
node scripts\verify_db.js
