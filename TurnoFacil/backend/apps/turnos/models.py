# turnos/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Usuario(AbstractUser):
    dni = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    direccion = models.TextField(blank=True, null=True)
    
    def _str_(self):
        return f"{self.first_name} {self.last_name}"

class Medico(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    especialidad = models.CharField(max_length=100)
    matricula = models.CharField(max_length=50, unique=True)
    direccion_consultorio = models.TextField()
    telefono_consultorio = models.CharField(max_length=20)
    horario_atencion = models.CharField(max_length=100, default="Lunes a Viernes 8:00-17:00")
    
    def _str_(self):
        return f"Dr. {self.usuario.first_name} {self.usuario.last_name} - {self.especialidad}"

class Turno(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]
    
    paciente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='turnos_paciente')
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    monto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['fecha', 'hora']
    
    def _str_(self):
        return f"Turno {self.id} - {self.paciente} con {self.medico}"

class Pago(models.Model):
    ESTADOS_PAGO = [
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('cancelado', 'Cancelado'),
    ]
    
    turno = models.OneToOneField(Turno, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADOS_PAGO, default='pendiente')
    id_transaccion = models.CharField(max_length=100, blank=True)
    fecha_pago = models.DateTimeField(null=True, blank=True)
    metodo_pago = models.CharField(max_length=50, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    
    def _str_(self):
        return f"Pago {self.id} - Turno {self.turno.id}"