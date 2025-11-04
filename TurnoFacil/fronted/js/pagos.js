// pagos.js - Versión completamente corregida
class PaymentManager {
    constructor() {
        // Verificar que MercadoPago esté disponible
        if (typeof MercadoPago !== 'undefined') {
            this.mp = new MercadoPago(CONFIG.MERCADOPAGO_PUBLIC_KEY, {
                locale: 'es-AR'
            });
        } else {
            console.warn('MercadoPago SDK no está cargado');
            this.mp = null;
        }
    }

    async initializePayment(turnoId) {
        try {
            const response = await fetch('${CONFIG.API_BASE_URL}/pagos/crear_pago_turno/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                credentials: 'include',
                body: JSON.stringify({ turno_id: turnoId })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showPaymentModal(data.url_pago, data.pago_id);
            } else {
                throw new Error(data.error || 'Error al crear el pago');
            }
        } catch (error) {
            console.error('Error:', error);
            if (window.authManager) {
                authManager.showMessage('error', 'Error al procesar el pago: ' + error.message);
            } else {
                alert('Error al procesar el pago: ' + error.message);
            }
        }
    }

    showPaymentModal(paymentUrl, pagoId) {
        const modalHTML = `
            <div class="modal" id="payment-modal">
                <div class="modal-content" style="max-width: 600px;">
                    <span class="close-modal" id="close-payment-modal">&times;</span>
                    <div class="modal-header">
                        <h2>Pagar Turno Médico</h2>
                    </div>
                    <div class="payment-section">
                        <div class="payment-info">
                            <h3>Total a pagar</h3>
                            <div class="payment-amount">$2,500.00</div>
                            <p>Consulta médica especializada - Turno Fácil</p>
                        </div>
                        
                        <div id="wallet_container"></div>
                        
                        <div style="text-align: center; margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                            <p style="margin-bottom: 15px; font-weight: 600;">O puedes pagar directamente en:</p>
                            <a href="${paymentUrl}" target="_blank" class="btn btn-primary" style="text-decoration: none;">
                                🔗 Pagar en Mercado Pago
                            </a>
                            <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                                Serás redirigido a la plataforma segura de Mercado Pago
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = modalHTML;
            const paymentModal = document.getElementById('payment-modal');
            if (paymentModal) {
                paymentModal.style.display = 'flex';
            }

            // Configurar cierre del modal
            const closeBtn = document.getElementById('close-payment-modal');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    const modal = document.getElementById('payment-modal');
                    if (modal) modal.style.display = 'none';
                });
            }

            // Inicializar botón de Mercado Pago
            this.initializeMercadoPagoButton(pagoId);
        }
    }

    initializeMercadoPagoButton(preferenceId) {
        if (!this.mp) {
            console.warn('MercadoPago no está disponible');
            return;
        }

        try {
            this.mp.bricks().create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId,
                },
                callbacks: {
                    onError: (error) => {
                        console.error('Error en Mercado Pago:', error);
                        if (window.authManager) {
                            authManager.showMessage('error', 'Error en el procesamiento de pago');
                        }
                    },
                    onReady: () => console.log('Wallet de Mercado Pago listo')
                }
            });
        } catch (error) {
            console.error('Error inicializando MercadoPago:', error);
        }
    }

    async generateComprobante(turnoId) {
        try {
            const response = await fetch('${CONFIG.API_BASE_URL}/turnos/turnos/${turnoId}/comprobante/', {
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                this.showComprobante(data);
            } else {
                throw new Error('Error al generar comprobante');
            }
        } catch (error) {
            console.error('Error:', error);
            if (window.authManager) {
                authManager.showMessage('error', 'Error al generar el comprobante');
            } else {
                alert('Error al generar el comprobante');
            }
        }
    }

    showComprobante(comprobanteData) {
        const modalHTML = `
            <div class="modal" id="comprobante-modal">
                <div class="modal-content" style="max-width: 800px;">
                    <span class="close-modal" id="close-comprobante-modal">&times;</span>
                    <div class="comprobante" id="comprobante-content">
                        <div class="comprobante-header">
                            <h2>Comprobante de Turno Médico</h2>
                            <p>N° ${comprobanteData.id}</p>
                        </div>
                        
                        <div class="comprobante-details">
                            <div class="detail-group">
                                <h4>Información del Paciente</h4>
                                <p><strong>Nombre:</strong> ${comprobanteData.paciente_nombre}</p>
                                <p><strong>DNI:</strong> ${comprobanteData.paciente_dni}</p>
                                <p><strong>Email:</strong> ${comprobanteData.paciente_email}</p>
                                <p><strong>Teléfono:</strong> ${comprobanteData.paciente_telefono || 'No especificado'}</p>
                            </div>
                            
                            <div class="detail-group">
                                <h4>Información del Turno</h4>
                                <p><strong>Médico:</strong> ${comprobanteData.medico_nombre}</p>
                                <p><strong>Especialidad:</strong> ${comprobanteData.especialidad}</p>
                                <p><strong>Fecha:</strong> ${comprobanteData.fecha}</p>
                                <p><strong>Hora:</strong> ${comprobanteData.hora}</p>
                            </div>
                            
                            <div class="detail-group">
                                <h4>Dirección del Consultorio</h4>
                                <p>${comprobanteData.direccion}</p>
                            </div>
                            
                            <div class="detail-group">
                                <h4>Información de Pago</h4>
                                <p><strong>Monto:</strong> $${comprobanteData.monto}</p>
                                <p><strong>Estado:</strong> <span style="color: green; font-weight: bold;">${comprobanteData.estado_pago}</span></p>
                                <p><strong>Fecha de pago:</strong> ${comprobanteData.fecha_pago}</p>
                                <p><strong>ID Transacción:</strong> ${comprobanteData.id_transaccion}</p>
                            </div>
                        </div>
                        
                        <div class="comprobante-footer">
                            <p><strong>Instrucciones importantes:</strong></p>
                            <ul style="margin: 15px 0; padding-left: 20px;">
                                <li>Presentarse 15 minutos antes del horario del turno</li>
                                <li>Traer DNI original y carnet de obra social (si corresponde)</li>
                                <li>En caso de cancelación, comunicarse con 48 horas de anticipación</li>
                                <li>Llevar estudios médicos previos relacionados con la consulta</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-outline" id="close-comprobante-btn">Cerrar</button>
                        <button class="btn btn-primary" id="download-pdf-btn">📄 Descargar PDF</button>
                    </div>
                </div>
            </div>
        `;

        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = modalHTML;
            const comprobanteModal = document.getElementById('comprobante-modal');
            if (comprobanteModal) {
                comprobanteModal.style.display = 'flex';
            }

            // Event listeners con verificación
            const closeModalBtn = document.getElementById('close-comprobante-modal');
            const closeBtn = document.getElementById('close-comprobante-btn');
            const downloadBtn = document.getElementById('download-pdf-btn');

            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => {
                    const modal = document.getElementById('comprobante-modal');
                    if (modal) modal.style.display = 'none';
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    const modal = document.getElementById('comprobante-modal');
                    if (modal) modal.style.display = 'none';
                });
            }

            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    this.downloadPDF(comprobanteData);
                });
            }
        }
    }

    downloadPDF(comprobanteData) {
        // Verificar que jsPDF esté disponible
        if (typeof window.jspdf === 'undefined') {
            alert('Error: No se puede generar PDF. jsPDF no está cargado.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Logo y título
        doc.setFontSize(20);
        doc.setTextColor(44, 127, 184);
        doc.text('🏥 Turno Fácil', 105, 20, null, null, 'center');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('COMPROBANTE DE TURNO MÉDICO', 105, 30, null, null, 'center');

        // Línea separadora
        doc.setDrawColor(44, 127, 184);
        doc.line(20, 35, 190, 35);

        // Información del comprobante
        doc.setFontSize(10);
        doc.text('N° de Comprobante: ' + comprobanteData.id, 20, 45);
        doc.text('Fecha de emisión: ' + new Date().toLocaleDateString('es-AR'), 150, 45, null, null, 'right');

        let yPosition = 60;

        // Información del paciente
        doc.setFontSize(12);
        doc.setTextColor(44, 127, 184);
        doc.text('INFORMACIÓN DEL PACIENTE', 20, yPosition);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
        doc.text('Nombre completo: ' + comprobanteData.paciente_nombre, 20, yPosition);
        yPosition += 6;
        doc.text('DNI: ' + comprobanteData.paciente_dni, 20, yPosition);
        yPosition += 6;
        doc.text('Email: ' + comprobanteData.paciente_email, 20, yPosition);
        yPosition += 6;
        doc.text('Teléfono: ' + (comprobanteData.paciente_telefono || 'No especificado'), 20, yPosition);
        yPosition += 15;

        // Información del turno
        doc.setFontSize(12);
        doc.setTextColor(44, 127, 184);
        doc.text('INFORMACIÓN DEL TURNO', 20, yPosition);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
        doc.text('Médico: ' + comprobanteData.medico_nombre, 20, yPosition);
        yPosition += 6;
        doc.text('Especialidad: ' + comprobanteData.especialidad, 20, yPosition);
        yPosition += 6;
        doc.text('Fecha: ' + comprobanteData.fecha, 20, yPosition);
        yPosition += 6;
        doc.text('Hora: ' + comprobanteData.hora, 20, yPosition);
        yPosition += 6;
        
        // Dirección con manejo de texto largo
        const addressLines = doc.splitTextToSize('Dirección: ' + comprobanteData.direccion, 170);
        doc.text(addressLines, 20, yPosition);
        yPosition += (addressLines.length * 6) + 10;

        // Información de pago
        doc.setFontSize(12);
        doc.setTextColor(44, 127, 184);
        doc.text('INFORMACIÓN DE PAGO', 20, yPosition);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
        doc.text('Monto: $' + comprobanteData.monto, 20, yPosition);
        yPosition += 6;
        doc.text('Estado: ' + comprobanteData.estado_pago, 20, yPosition);
        yPosition += 6;
        doc.text('Método de pago: Mercado Pago', 20, yPosition);
        yPosition += 6;
        doc.text('Fecha de pago: ' + comprobanteData.fecha_pago, 20, yPosition);
        yPosition += 6;
        doc.text('ID de transacción: ' + comprobanteData.id_transaccion, 20, yPosition);
        yPosition += 20;

        // Instrucciones
        doc.setFontSize(12);
        doc.setTextColor(44, 127, 184);
        doc.text('INSTRUCCIONES IMPORTANTES', 20, yPosition);
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
        
        const instructions = [
            '• Presentarse 15 minutos antes de la hora programada',
            '• Traer DNI original y tarjeta de obra social (si corresponde)',
            '• En caso de cancelación, notificar con 48 horas de anticipación',
            '• Llevar estudios médicos previos relacionados con la consulta',
            '• Usar barbijo en áreas comunes del establecimiento'
        ];
        
        instructions.forEach(instruction => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(instruction, 25, yPosition);
            yPosition += 5;
        });

        // Pie de página
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Turno Fácil - Sistema de Gestión Médica - www.turnofacil.com', 105, 285, null, null, 'center');

        // Guardar PDF
        doc.save('comprobante-turno-' + comprobanteData.id + '.pdf');
    }

    getCSRFToken() {
        if (window.authManager) {
            return authManager.getCSRFToken();
        }
        return '';
    }
}

// Crear instancia global
window.paymentManager = new PaymentManager();