#!/bin/bash

echo "🚂 Verificando configuración para Railway deployment..."

# Verificar archivos necesarios
echo "✅ Verificando archivos necesarios:"
[ -f "Dockerfile.railway" ] && echo "  ✓ Dockerfile.railway" || echo "  ✗ Dockerfile.railway"
[ -f "Procfile" ] && echo "  ✓ Procfile" || echo "  ✗ Procfile"
[ -f "railway.json" ] && echo "  ✓ railway.json" || echo "  ✗ railway.json"
[ -f "backend/requirements.txt" ] && echo "  ✓ requirements.txt" || echo "  ✗ requirements.txt"
[ -f "backend/manage.py" ] && echo "  ✓ manage.py" || echo "  ✗ manage.py"

echo ""
echo "📋 Checklist pre-deployment:"
echo "  1. Crear repositorio en GitHub"
echo "  2. Hacer git init, add, commit"
echo "  3. Push a GitHub"
echo "  4. Conectar Railway con GitHub"
echo "  5. Configurar variables de entorno en Railway"

echo ""
echo "🔐 Variables de entorno para Railway:"
echo "  DEBUG=False"
echo "  SECRET_KEY=tu-clave-secreta-production"
echo "  MERCADOPAGO_ACCESS_TOKEN=tu-token-real"
echo "  MERCADOPAGO_PUBLIC_KEY=tu-public-key-real"
echo "  ALLOWED_HOSTS=*.railway.app"
echo "  RAILWAY_ENVIRONMENT_NAME=production"

echo ""
echo "🎯 Tu proyecto estará disponible en: https://tu-proyecto.railway.app"