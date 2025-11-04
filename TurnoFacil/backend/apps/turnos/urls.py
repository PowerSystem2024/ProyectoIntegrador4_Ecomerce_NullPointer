# turnos/urls.py
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('auth', views.AuthViewSet, basename='auth')
router.register('medicos', views.MedicoViewSet)
router.register('turnos', views.TurnoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]