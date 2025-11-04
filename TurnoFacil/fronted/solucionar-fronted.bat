@echo off
echo ========================================
echo    SOLUCIONANDO PROBLEMAS DEL FRONTEND
echo ========================================

echo 1. Verificando archivos...
dir index.html
if %errorlevel% neq 0 (
    echo ❌ ERROR: No se encuentra index.html
    echo Asegurate de estar en la carpeta frontend
    pause
    exit
)

echo 2. Probando servidor en puerto 3000...
echo ✅ Archivos encontrados correctamente
echo.
echo Iniciando servidor en http://localhost:3000
echo Si no funciona, prueba con http://127.0.0.1:3000
echo ========================================
py -m http.server 3000