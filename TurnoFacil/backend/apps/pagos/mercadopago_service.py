import mercadopago
from django.conf import settings

class MercadoPagoService:
    def __init__(self):
        self.sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    def crear_preferencia_pago(self, turno_id, monto, descripcion):
        preference_data = {
            "items": [
                {
                    "title": f"Turno Médico - {descripcion}",
                    "quantity": 1,
                    "currency_id": "ARS",
                    "unit_price": float(monto)
                }
            ],
            "back_urls": {
                "success": "http://localhost/pago-exitoso.html",
                "failure": "http://localhost/pago-fallido.html", 
                "pending": "http://localhost/pago-pendiente.html"
            },
            "external_reference": str(turno_id),
            "statement_descriptor": "TurnoFacil"
        }

        print(f"🔍 Enviando preferencia a MercadoPago: {preference_data}")
        preference_response = self.sdk.preference().create(preference_data)
        print(f"🔍 Respuesta completa de MercadoPago: {preference_response}")
        return preference_response

    def verificar_pago(self, payment_id):
        payment_response = self.sdk.payment().get(payment_id)
        return payment_response