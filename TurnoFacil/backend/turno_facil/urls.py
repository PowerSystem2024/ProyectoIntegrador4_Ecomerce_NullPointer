from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def set_csrf(request):
    """Simple endpoint that sets the CSRF cookie for the browser.
    Call this from the frontend (with credentials) before POSTing forms.
    """
    return JsonResponse({"csrf": "set"})


def api_root(request):
    """API Root endpoint that provides information about available endpoints."""
    return JsonResponse({
        "message": "Turno Fácil API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "admin": "/admin/",
            "auth": "/api/auth/",
            "turnos": "/api/turnos/",
            "pagos": "/api/pagos/",
            "historiales": "/api/historiales/",
            "csrf": "/api/auth/csrf/"
        },
        "frontend_url": "http://localhost:80"
    })

urlpatterns = [
    path('admin/', admin.site.urls),  # Mantener admin/ como primera URL
    path('api/auth/', include('apps.pacientes.urls')),  # Mover autenticación a app pacientes
    path('api/turnos/', include('apps.turnos.urls')),
    path('api/pagos/', include('apps.pagos.urls')),
    path('api/historiales/', include('apps.historiales.urls')),
    path('', api_root, name='api_root'),
    path('api/auth/csrf/', set_csrf),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)