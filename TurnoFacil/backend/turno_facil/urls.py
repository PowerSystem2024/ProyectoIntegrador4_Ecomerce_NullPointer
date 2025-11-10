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
    frontend_path = os.path.join(settings.BASE_DIR, 'static', 'index.html')
    # Fallback a la ubicación original
    if not os.path.exists(frontend_path):
        frontend_path = os.path.join(settings.BASE_DIR, '../fronted/index.html')
        
    try:
        with open(frontend_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Obtener base URL del request
        base_url = request.build_absolute_uri('/').rstrip('/')
        
        # Reemplazar URLs de desarrollo con URLs de producción
        content = content.replace('http://localhost:8000/api', f'{base_url}/api')
        content = content.replace('http://localhost:8000', base_url)
        content = content.replace('http://localhost/api', f'{base_url}/api')
        content = content.replace('http://localhost', base_url)
        
        # Usar URLs de archivos estáticos de Django
        content = content.replace('href="css/', f'href="{base_url}/static/css/')
        content = content.replace('src="js/', f'src="{base_url}/static/js/')
        content = content.replace('src="assets/', f'src="{base_url}/static/assets/')
        content = content.replace('<script src="https://sdk.mercadopago.com', '<script src="https://sdk.mercadopago.com')
        
        from django.http import HttpResponse
        return HttpResponse(content, content_type='text/html')
        
    except FileNotFoundError:
        return JsonResponse({
            "message": "Turno Fácil API - Frontend not found",
            "version": "1.0.0", 
            "status": "running",
            "frontend_path_tried": [frontend_path],
            "note": "Frontend files not found. API endpoints available below.",
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
    path('admin/', admin.site.urls),  
    path('api/auth/', include('apps.pacientes.urls')),  
    path('api/turnos/', include('apps.turnos.urls')),
    path('api/pagos/', include('apps.pagos.urls')),
    path('api/historiales/', include('apps.historiales.urls')),
    path('api/', api_root, name='api_root'),
    path('api/auth/csrf/', set_csrf),
    path('', frontend_view, name='frontend'),  
]

# Servir archivos estáticos siempre (desarrollo y producción)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# También servir desde STATICFILES_DIRS
if hasattr(settings, 'STATICFILES_DIRS'):
    for static_dir in settings.STATICFILES_DIRS:
        urlpatterns += static(settings.STATIC_URL, document_root=static_dir)

if settings.DEBUG:
    # En desarrollo también servir desde STATICFILES_DIRS
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()