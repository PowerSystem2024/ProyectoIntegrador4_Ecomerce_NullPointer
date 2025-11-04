from django.db import models
from apps.turnos.models import Turno

class Pago(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('cancelado', 'Cancelado'),
    )

    turno = models.OneToOneField(Turno, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    id_mercadopago = models.CharField(max_length=100, blank=True)
    url_pago = models.URLField(blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pagos'

    def _str_(self):
        return f"Pago {self.id} - Turno {self.turno.id} - ${self.monto}"