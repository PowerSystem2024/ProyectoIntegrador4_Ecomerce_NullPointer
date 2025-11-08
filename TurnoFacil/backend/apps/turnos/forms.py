from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Usuario, Medico, Turno

class CustomUserCreationForm(UserCreationForm):
    dni = forms.CharField(max_length=20, required=True)
    telefono = forms.CharField(max_length=20, required=False)
    fecha_nacimiento = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))
    direccion = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}), required=False)

    class Meta(UserCreationForm.Meta):
        model = Usuario
        fields = UserCreationForm.Meta.fields + ('email', 'first_name', 'last_name', 'dni', 'telefono', 'fecha_nacimiento', 'direccion')

class CustomUserChangeForm(UserChangeForm):
    dni = forms.CharField(max_length=20, required=True)
    telefono = forms.CharField(max_length=20, required=False)
    fecha_nacimiento = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))
    direccion = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}), required=False)

    class Meta(UserChangeForm.Meta):
        model = Usuario
        fields = UserChangeForm.Meta.fields