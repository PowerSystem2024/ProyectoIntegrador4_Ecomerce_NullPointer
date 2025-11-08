from django.contrib import admin
from .models import HistorialMedico

@admin.register(HistorialMedico)
class HistorialMedicoAdmin(admin.ModelAdmin):
    list_display = ('id', 'paciente', 'medico', 'fecha_consulta', 'get_diagnostico_resumen')
    list_filter = ('medico', 'fecha_consulta')
    search_fields = ('paciente__first_name', 'paciente__last_name', 'medico__usuario__first_name', 'diagnostico')
    date_hierarchy = 'fecha_consulta'
    readonly_fields = ('created_at', 'updated_at')

    def get_diagnostico_resumen(self, obj):
        return obj.diagnostico[:100] + '...' if len(obj.diagnostico) > 100 else obj.diagnostico
    get_diagnostico_resumen.short_description = 'Diagnóstico'