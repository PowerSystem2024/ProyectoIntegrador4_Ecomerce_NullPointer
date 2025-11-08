# turnos/urls.py
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('', views.AuthViewSet, basename='auth')
router.register('medicos', views.MedicoViewSet)
router.register('turnos', views.TurnoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]