@echo off
title Turno Facil - Configuracion Definitiva
echo ========================================
echo    CONFIGURACION DEFINITIVA
echo ========================================

echo PASO 1: Creando archivos de URLs corregidos...
echo Reparando pacientes/urls.py...
cd apps\pacientes
echo from django.urls import path, include > urls.py
echo from rest_framework.routers import DefaultRouter >> urls.py
echo from .views import PacienteViewSet >> urls.py
echo. >> urls.py
echo router = DefaultRouter() >> urls.py
echo router.register(r'', PacienteViewSet, basename='paciente') >> urls.py
echo. >> urls.py
echo urlpatterns = [ >> urls.py
echo     path('', include(router.urls)), >> urls.py
echo ] >> urls.py
cd ..\..

echo Reparando turnos/urls.py...
cd apps\turnos
echo from django.urls import path, include > urls.py
echo from rest_framework.routers import DefaultRouter >> urls.py
echo from .views import TurnoViewSet, MedicoViewSet >> urls.py
echo. >> urls.py
echo router = DefaultRouter() >> urls.py
echo router.register(r'turnos', TurnoViewSet, basename='turno') >> urls.py
echo router.register(r'medicos', MedicoViewSet, basename='medico') >> urls.py
echo. >> urls.py
echo urlpatterns = [ >> urls.py
echo     path('', include(router.urls)), >> urls.py
echo ] >> urls.py
cd ..\..

echo Reparando pagos/urls.py...
cd apps\pagos
echo from django.urls import path, include > urls.py
echo from rest_framework.routers import DefaultRouter >> urls.py
echo from .views import PagoViewSet >> urls.py
echo. >> urls.py
echo router = DefaultRouter() >> urls.py
echo router.register(r'', PagoViewSet, basename='pago') >> urls.py
echo. >> urls.py
echo urlpatterns = [ >> urls.py
echo     path('', include(router.urls)), >> urls.py
echo ] >> urls.py
cd ..\..

echo Reparando historiales/urls.py...
cd apps\historiales
echo from django.urls import path, include > urls.py
echo from rest_framework.routers import DefaultRouter >> urls.py
echo from .views import HistorialMedicoViewSet >> urls.py
echo. >> urls.py
echo router = DefaultRouter() >> urls.py
echo router.register(r'', HistorialMedicoViewSet, basename='historialmedico') >> urls.py
echo. >> urls.py
echo urlpatterns = [ >> urls.py
echo     path('', include(router.urls)), >> urls.py
echo ] >> urls.py
cd ..\..

echo Reparando historiales/views.py...
cd apps\historiales
echo from rest_framework import viewsets > views.py
echo from .models import HistorialMedico >> views.py
echo from .serializers import HistorialMedicoSerializer >> views.py
echo. >> views.py
echo class HistorialMedicoViewSet(viewsets.ModelViewSet): >> views.py
echo     serializer_class = HistorialMedicoSerializer >> views.py
echo     queryset = HistorialMedico.objects.all() >> views.py
echo. >> views.py
echo     def get_queryset(self): >> views.py
echo         if self.request.user.is_authenticated: >> views.py
echo             return HistorialMedico.objects.filter(paciente=self.request.user) >> views.py
echo         return HistorialMedico.objects.none() >> views.py
cd ..\..

echo PASO 2: Ejecutando migraciones...
py manage.py migrate

echo PASO 3: Creando datos de prueba...
echo from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@turnofacil.com', 'admin123', first_name='Admin', last_name='Sistema', dni='00000001') if not User.objects.filter(username='admin').exists() else print('✅ Usuario admin ya existe') | py manage.py shell

echo from apps.turnos.models import Medico; medicos = [{'nombre':'Maria','apellido':'Gonzalez','especialidad':'Cardiologia','matricula':'CARD001','direccion':'Av Corrientes 1234'},{'nombre':'Carlos','apellido':'Lopez','especialidad':'Dermatologia','matricula':'DERM001','direccion':'Av Santa Fe 567'},{'nombre':'Ana','apellido':'Martinez','especialidad':'Odontologia','matricula':'ODON001','direccion':'Av Cabildo 789'}]; [Medico.objects.get_or_create(matricula=med['matricula'], defaults=med) for med in medicos]; print('✅ Medicos creados') | py manage.py shell

echo ========================================
echo        ✅ CONFIGURACION COMPLETADA!
echo ========================================
echo Iniciando servidor backend...
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8000
echo 👑 Admin:    http://localhost:8000/admin
echo.
echo 💡 En otra terminal ejecuta:
echo cd ../frontend
echo py -m http.server 3000
echo ========================================
py manage.py runserver