# Debug para Railway - Verificar archivos estáticos
# Este archivo te ayudará a verificar qué está pasando

# URLs para probar:
# 1. Frontend: https://proyectointegrador4ecomercenullpointer-production.up.railway.app/
# 2. CSS: https://proyectointegrador4ecomercenullpointer-production.up.railway.app/static/css/style.css
# 3. JS: https://proyectointegrador4ecomercenullpointer-production.up.railway.app/static/js/app.js
# 4. Debug: https://proyectointegrador4ecomercenullpointer-production.up.railway.app/api/debug-static/

# Si el CSS da error 404, el problema es que los archivos no se copiaron correctamente
# Si el CSS carga pero no se aplica, el problema es en el HTML

# Pasos de verificación:
# 1. Abrir Developer Tools (F12)
# 2. Ver pestaña Console - buscar errores
# 3. Ver pestaña Network - verificar que CSS/JS no den 404
# 4. Ver Build Logs en Railway - buscar "ls -la /app/static/"