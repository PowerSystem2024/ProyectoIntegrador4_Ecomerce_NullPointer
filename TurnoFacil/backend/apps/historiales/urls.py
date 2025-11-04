from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HistorialMedicoViewSet

router = DefaultRouter()
router.register(r'', HistorialMedicoViewSet, basename='historialmedico')

urlpatterns = [
    path('', include(router.urls)),
]