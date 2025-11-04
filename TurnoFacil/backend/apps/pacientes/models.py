from django.db import models
from django.contrib.auth.models import AbstractUser

class Paciente(AbstractUser):
    dni = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    direccion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pacientes'

    def _str_(self):
        return f"{self.first_name} {self.last_name} ({self.dni})"