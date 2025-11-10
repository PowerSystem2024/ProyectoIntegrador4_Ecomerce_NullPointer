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
            "csrf": "/api/auth/csrf/",
            "debug_static": "/api/debug-static/"
        },
        "frontend_url": request.build_absolute_uri('/')
    })


def debug_static_files(request):
    """Debug endpoint to check static files"""
    import os
    static_dir = os.path.join(settings.BASE_DIR, 'static')
    staticfiles_dir = os.path.join(settings.BASE_DIR, 'staticfiles')
    
    debug_info = {
        "static_url": settings.STATIC_URL,
        "static_root": str(settings.STATIC_ROOT),
        "staticfiles_dirs": [str(d) for d in settings.STATICFILES_DIRS],
        "base_dir": str(settings.BASE_DIR),
        "static_dir_exists": os.path.exists(static_dir),
        "staticfiles_dir_exists": os.path.exists(staticfiles_dir),
    }
    
    # Listar archivos en directorio static
    if os.path.exists(static_dir):
        try:
            debug_info["static_files"] = []
            for root, dirs, files in os.walk(static_dir):
                for file in files:
                    rel_path = os.path.relpath(os.path.join(root, file), static_dir)
                    debug_info["static_files"].append(rel_path)
        except Exception as e:
            debug_info["static_files_error"] = str(e)
    
    # Listar archivos en directorio staticfiles
    if os.path.exists(staticfiles_dir):
        try:
            debug_info["staticfiles_collected"] = []
            for root, dirs, files in os.walk(staticfiles_dir):
                for file in files:
                    rel_path = os.path.relpath(os.path.join(root, file), staticfiles_dir)
                    debug_info["staticfiles_collected"].append(rel_path)
        except Exception as e:
            debug_info["staticfiles_collected_error"] = str(e)
    
    return JsonResponse(debug_info, indent=2)

urlpatterns = [
    path('admin/', admin.site.urls),  
    path('api/auth/', include('apps.pacientes.urls')),  
    path('api/turnos/', include('apps.turnos.urls')),
    path('api/pagos/', include('apps.pagos.urls')),
    path('api/historiales/', include('apps.historiales.urls')),
    path('api/', api_root, name='api_root'),
    path('api/auth/csrf/', set_csrf),
    path('api/debug-static/', debug_static_files, name='debug_static'),
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