# 🚂 RAILWAY DEPLOYMENT GUIDE - TurnoFácil

## Variables de Entorno para Railway:

Copia y pega estas variables en Railway (Variables tab):

```
DEBUG=False
SECRET_KEY=django-super-secret-production-turnofacil-2024-railway
RAILWAY_ENVIRONMENT_NAME=production
MERCADOPAGO_ACCESS_TOKEN=APP_USR-4443132160940317-110913-d124666811020fa637f8889cdc59e5ca-2705622945
MERCADOPAGO_PUBLIC_KEY=APP_USR-aaf87840-bb69-4343-8b1e-f8a49c92a770
ALLOWED_HOSTS=*.railway.app
CORS_ALLOW_ALL_ORIGINS=True
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

## Pasos en Railway:

1. ✅ Deploy from GitHub repo
2. ✅ Agregar PostgreSQL Database
3. ✅ Configurar variables de entorno
4. ✅ Esperar deployment

## URLs importantes:
- Tu app: https://[nombre-proyecto].up.railway.app
- API: https://[nombre-proyecto].up.railway.app/api/
- Admin: https://[nombre-proyecto].up.railway.app/admin/

## Verificaciones post-deploy:
- [ ] Frontend carga correctamente
- [ ] API responde en /api/
- [ ] Admin panel accesible
- [ ] Base de datos conectada