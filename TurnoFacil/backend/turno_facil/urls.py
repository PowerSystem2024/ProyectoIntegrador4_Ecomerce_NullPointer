from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from django.shortcuts import render
import os


@ensure_csrf_cookie
def set_csrf(request):
    """Simple endpoint that sets the CSRF cookie for the browser.
    Call this from the frontend (with credentials) before POSTing forms.
    """
    return JsonResponse({"csrf": "set"})


def frontend_view(request):
    """Serve the frontend HTML with corrected paths"""
    frontend_path = os.path.join(settings.BASE_DIR, '../fronted/index.html')
    try:
        with open(frontend_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Obtener base URL del request
        base_url = request.build_absolute_uri('/')
        
        # Reemplazar URLs de desarrollo con URLs de producción
        content = content.replace('http://localhost:8000/api', f'{base_url}api')
        content = content.replace('http://localhost:8000', base_url)
        content = content.replace('http://localhost/api', f'{base_url}api')
        content = content.replace('http://localhost', base_url)
        
        # Asegurar que las rutas de CSS y JS sean relativas/absolutas correctas
        content = content.replace('href="css/', f'href="{base_url}css/')
        content = content.replace('src="js/', f'src="{base_url}js/')
        content = content.replace('src="assets/', f'src="{base_url}assets/')
        
        from django.http import HttpResponse
        return HttpResponse(content, content_type='text/html')
        
    except FileNotFoundError:
        return JsonResponse({
            "message": "Turno Fácil API",
            "version": "1.0.0", 
            "status": "running",
            "note": "Frontend not found. API endpoints available below.",
            "endpoints": {
                "admin": "/admin/",
                "auth": "/api/auth/",
                "turnos": "/api/turnos/",
                "pagos": "/api/pagos/",
                "historiales": "/api/historiales/",
                "csrf": "/api/auth/csrf/"
            }
        })


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
        "frontend_url": request.build_absolute_uri('/')
    })

urlpatterns = [
    path('admin/', admin.site.urls),  # Mantener admin/ como primera URL
    path('api/auth/', include('apps.pacientes.urls')),  # Mover autenticación a app pacientes
    path('api/turnos/', include('apps.turnos.urls')),
    path('api/pagos/', include('apps.pagos.urls')),
    path('api/historiales/', include('apps.historiales.urls')),
    path('api/', api_root, name='api_root'),
    path('api/auth/csrf/', set_csrf),
    path('', frontend_view, name='frontend'),  # Servir frontend en la raíz
]

# Servir archivos estáticos y media en producción
if not settings.DEBUG or True:  # Siempre servir en producción
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static('/css/', document_root=os.path.join(settings.BASE_DIR, '../fronted/css'))
    urlpatterns += static('/js/', document_root=os.path.join(settings.BASE_DIR, '../fronted/js'))
    urlpatterns += static('/assets/', document_root=os.path.join(settings.BASE_DIR, '../fronted/assets'))