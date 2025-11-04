@echo off
echo ========================================
echo    VERIFICANDO ESTRUCTURA DE CARPETAS
echo ========================================

echo 1. Creando carpetas necesarias...
if not exist "css" mkdir css
if not exist "js" mkdir js
if not exist "assets" mkdir assets
if not exist "assets\images" mkdir assets\images
if not exist "assets\icons" mkdir assets\icons

echo 2. Verificando archivos esenciales...
echo Archivos HTML:
dir *.html

echo.
echo Archivos CSS:
if exist "css" dir css\*.css

echo.
echo Archivos JS:
if exist "js" dir js\*.js

echo.
echo 3. Estructura actual:
tree /F

echo ========================================
echo    INSTRUCCIONES:
echo 1. Si faltan archivos, copialos de los mensajes anteriores
echo 2. Los archivos deben estar en las carpetas correctas
echo 3. Ejecuta nuevamente para verificar
echo ========================================
pause