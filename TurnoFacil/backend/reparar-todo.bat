@echo off
title Reparando Turno Facil - Todos los Errores
echo ========================================
echo    REPARANDO TODOS LOS ERRORES
echo ========================================

echo 1. Reparando historiales/urls.py...
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

echo 2. Reparando historiales/views.py...
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

echo 3. Reparando pacientes/urls.py...
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

echo 4. Reparando pagos/urls.py...
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

echo 5. Reparando turnos/urls.py...
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

echo ========================================
echo        ✅ TODOS LOS ARCHIVOS REPARADOS!
echo ========================================
echo Ahora ejecuta:
echo py manage.py migrate
pause