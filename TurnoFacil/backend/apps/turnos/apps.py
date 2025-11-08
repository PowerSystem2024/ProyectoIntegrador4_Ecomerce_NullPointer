from django.apps import AppConfig
from django.contrib import admin

class TurnosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.turnos'
    verbose_name = 'Gestión de Turnos'
    
    def ready(self):
        # Desregistrar todos los modelos antes de registrarlos nuevamente
        from .models import Usuario, Medico, Turno
        
        for model in [Usuario, Medico, Turno]:
            try:
                admin.site.unregister(model)
            except admin.sites.NotRegistered:
                pass