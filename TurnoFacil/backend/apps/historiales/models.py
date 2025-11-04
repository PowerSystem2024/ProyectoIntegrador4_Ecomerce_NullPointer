from django.db import models
from apps.pacientes.models import Paciente
from apps.turnos.models import Medico

class HistorialMedico(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
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