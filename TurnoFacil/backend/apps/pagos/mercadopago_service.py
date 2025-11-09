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
                "success": f"{settings.FRONTEND_URL}/pago-exitoso",
                "failure": f"{settings.FRONTEND_URL}/pago-fallido",
                "pending": f"{settings.FRONTEND_URL}/pago-pendiente"
            },
            "auto_return": "approved",
            "external_reference": str(turno_id),
            "notification_url": f"{settings.BACKEND_URL}/api/pagos/webhook_mercadopago/",
        }

        preference_response = self.sdk.preference().create(preference_data)
        return preference_response

    def verificar_pago(self, payment_id):
        payment_response = self.sdk.payment().get(payment_id)
        return payment_response