@echo off
echo ========================================
echo    INSTALANDO DEPENDENCIAS DE TURNO FACIL
echo ========================================

echo 1. Instalando Django REST Framework...
py -m pip install djangorestframework==3.14.0

echo 2. Instalando CORS Headers...
py -m pip install django-cors-headers==4.3.1

echo 3. Instalando Mercado Pago...
py -m pip install mercadopago

echo 4. Instalando ReportLab para PDF...
py -m pip install reportlab==4.0.4

echo 5. Instalando utilidades...
py -m pip install python-dateutil==2.8.2
py -m pip install python-dotenv==1.0.0

echo 6. Instalando herramientas de produccion...
py -m pip install gunicorn==21.2.0
py -m pip install whitenoise==6.6.0

echo ========================================
echo        ✅ DEPENDENCIAS INSTALADAS!
echo ========================================
echo Ahora ejecuta:
echo py manage.py migrate
echo py manage.py runserver
echo ========================================
pause