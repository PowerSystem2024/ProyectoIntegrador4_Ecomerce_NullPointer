from rest_framework import serializers
from .models import Pago

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '_all_'