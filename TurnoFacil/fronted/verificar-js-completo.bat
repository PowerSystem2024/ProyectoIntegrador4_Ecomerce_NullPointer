@echo off
echo ========================================
echo    VERIFICACION COMPLETA DE ARCHIVOS JS
echo ========================================

echo 1. Archivos en carpeta js:
dir js\*.js

echo.
echo 2. Archivos JavaScript requeridos:
echo    ✅ app.js - (Aplicacion principal)
echo    ✅ auth.js - (Autenticacion y usuarios)
echo    ✅ turnos.js - (Gestion de turnos)
echo    ✅ pagos.js - (Mercado Pago y comprobantes)
echo    ✅ admin.js - (Panel administrador)
echo    ✅ pdf-generator.js - (Generacion de PDF)
echo    ✅ dashboard.js - (Dashboard con graficos)

echo.
echo 3. Si algun archivo falta, copia el contenido de los mensajes anteriores.
echo.
echo 4. Para probar la aplicacion:
echo npx http-server -p 3000
echo ========================================
pause