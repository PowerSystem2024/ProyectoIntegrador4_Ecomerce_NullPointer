from django.contrib import admin
from .models import Pago

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('id', 'turno', 'monto', 'estado', 'fecha_creacion', 'fecha_actualizacion')
    list_filter = ('estado', 'fecha_creacion')
    search_fields = ('turno__paciente__first_name', 'turno__paciente__last_name', 'turno__medico__usuario__first_name')
    date_hierarchy = 'fecha_creacion'
    readonly_fields = ('id_mercadopago', 'url_pago', 'fecha_creacion', 'fecha_actualizacion')
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Si estamos editando un objeto existente
            return self.readonly_fields + ('turno', 'monto')  # No permitir cambiar el turno ni el monto una vez creado
        return self.readonly_fields