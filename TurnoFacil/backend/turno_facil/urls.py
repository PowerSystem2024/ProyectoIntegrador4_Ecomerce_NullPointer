from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),  # Mantener admin/ como primera URL
    path('api/auth/', include('apps.pacientes.urls')),  # Mover autenticación a app pacientes
    path('api/turnos/', include('apps.turnos.urls')),
    path('api/pagos/', include('apps.pagos.urls')),
    path('api/historiales/', include('apps.historiales.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)