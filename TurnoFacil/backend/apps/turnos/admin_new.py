from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import Usuario, Medico, Turno

# Desregistrar cualquier registro previo del modelo Usuario
admin.site.unregister(Usuario)

class CustomUserAdmin(UserAdmin):
    model = Usuario
    list_display = ('username', 'email', 'first_name', 'last_name', 'dni', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'email', 'dni', 'telefono', 'fecha_nacimiento', 'direccion')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'dni', 'telefono', 'fecha_nacimiento', 'direccion', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('username', 'first_name', 'last_name', 'email', 'dni')
    ordering = ('username',)

admin.site.register(Usuario, CustomUserAdmin)

@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'especialidad', 'matricula')
    search_fields = ('usuario__username', 'especialidad', 'matricula')
    list_filter = ('especialidad',)

@admin.register(Turno)
class TurnoAdmin(admin.ModelAdmin):
    list_display = ('id', 'paciente', 'medico', 'fecha', 'hora', 'estado')
    list_filter = ('estado', 'fecha')
    search_fields = ('paciente__username', 'medico__especialidad')