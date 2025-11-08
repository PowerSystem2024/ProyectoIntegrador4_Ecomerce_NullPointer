from django.db import models
from apps.turnos.models import Usuario, Medico

class HistorialMedico(models.Model):
    paciente = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    fecha_consulta = models.DateTimeField()
    diagnostico = models.TextField()
    tratamiento = models.TextField(blank=True)
    observaciones = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'historial_medico'
        ordering = ['-fecha_consulta']

    def _str_(self):
        return f"Historial {self.id} - {self.paciente}"