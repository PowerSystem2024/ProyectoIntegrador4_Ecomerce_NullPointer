from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Usuario, Medico, Turno

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Usuario
        fields = UserCreationForm.Meta.fields + ('dni', 'telefono', 'fecha_nacimiento', 'direccion')

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = Usuario
        fields = UserChangeForm.Meta.fields

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    # Campos que se muestran en la lista de usuarios
    list_display = ('username', 'dni', 'email', 'first_name', 'last_name', 'telefono', 'fecha_nacimiento', 'is_active', 'is_staff')
    
    # Campos por los que se puede filtrar en la lista
    list_filter = ('is_active', 'is_staff', 'groups', 'fecha_nacimiento')
    
    # Campos por los que se puede buscar
    search_fields = ('username', 'first_name', 'last_name', 'email', 'dni', 'telefono', 'direccion')
    
    # Ordenamiento por defecto
    ordering = ('username',)
    
    # Agregar acciones personalizadas
    actions = ['activar_usuarios', 'desactivar_usuarios']
    
    def activar_usuarios(self, request, queryset):
        queryset.update(is_active=True)
    activar_usuarios.short_description = "Activar usuarios seleccionados"
    
    def desactivar_usuarios(self, request, queryset):
        queryset.update(is_active=False)
    desactivar_usuarios.short_description = "Desactivar usuarios seleccionados"
    
    # Campos para editar usuario existente
    fieldsets = (
        ('Credenciales', {
            'fields': ('username', 'password')
        }),
        ('Información Personal', {
            'fields': ('first_name', 'last_name', 'email', 'dni', 'telefono', 'fecha_nacimiento', 'direccion'),
            'description': 'Información básica del usuario'
        }),
        ('Permisos', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            ),
            'description': 'Permisos y roles del usuario',
            'classes': ('collapse',)
        }),
        ('Fechas Importantes', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    # Campos para crear nuevo usuario
    add_fieldsets = (
        ('Credenciales', {
            'classes': ('wide',),
            'fields': (
                'username',
                'password1',
                'password2',
            ),
        }),
        ('Información Personal', {
            'fields': (
                'dni',
                'email',
                'first_name',
                'last_name',
                'telefono',
                'fecha_nacimiento',
                'direccion',
            ),
        }),
        ('Permisos', {
            'fields': (
                'is_active',
                'is_staff',
                'groups'
            ),
            'classes': ('collapse',)
        }),
    )

@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ('get_nombre_completo', 'especialidad', 'matricula', 'telefono_consultorio')
    list_filter = ('especialidad',)
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name', 'especialidad', 'matricula')
    
    def get_nombre_completo(self, obj):
        return f"{obj.usuario.first_name} {obj.usuario.last_name}"
    get_nombre_completo.short_description = 'Nombre Completo'
    
    fieldsets = (
        ('Usuario', {
            'fields': ('usuario',)
        }),
        ('Información Profesional', {
            'fields': ('especialidad', 'matricula', 'direccion_consultorio', 'telefono_consultorio', 'horario_atencion')
        }),
    )

@admin.register(Turno)
class TurnoAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'medico', 'fecha', 'hora', 'estado', 'monto')
    list_filter = ('estado', 'fecha', 'medico__especialidad')
    search_fields = ('paciente__username', 'medico__usuario__username', 'motivo')
    ordering = ('-fecha', '-hora')
    
    fieldsets = (
        ('Información del Turno', {
            'fields': ('paciente', 'medico', 'fecha', 'hora', 'estado')
        }),
        ('Detalles', {
            'fields': ('motivo', 'monto')
        }),
    )