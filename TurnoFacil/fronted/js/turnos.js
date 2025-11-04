// turnos.js - Versión completamente corregida
class TurnosManager {
    constructor() {
        this.medicos = [];
        this.turnos = [];
    }

    async loadTurnosSection() {
        if (!app.currentUser) {
            return `
                <div class="appointments">
                    <h2 class="section-title">Turnos Médicos</h2>
                    <div class="error">
                        <p>Debes iniciar sesión para gestionar tus turnos.</p>
                        <button class="btn btn-primary" id="login-from-turnos">Iniciar Sesión</button>
                    </div>
                </div>
            `;
        }

        await this.loadUserTurnos();

        return `
            <div class="appointments">
                <div class="admin-header">
                    <h2 class="section-title">Mis Turnos</h2>
                    <button class="btn btn-primary" id="new-appointment-btn">Solicitar Nuevo Turno</button>
                </div>
                
                <div class="appointment-list">
                    ${this.turnos.length > 0 ? 
                        this.turnos.map(turno => this.renderTurnoItem(turno)).join('') :
                        '<p>No tienes turnos programados. ¡Solicita tu primer turno!</p>'
                    }
                </div>
            </div>
        `;
    }

    async getUserTurnos() {
        try {
            const response = await fetch('${CONFIG.API_BASE_URL}/turnos/turnos/', {
                credentials: 'include'
            });
            
            if (response.ok) {
                this.turnos = await response.json();
                return this.turnos;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error obteniendo turnos:', error);
            return [];
        }
    }

    async loadUserTurnos() {
        this.turnos = await this.getUserTurnos();
    }

    renderTurnoItem(turno) {
        return `
            <div class="appointment-item">
                <div class="appointment-info">
                    <h4>${turno.medico_nombre} - ${turno.especialidad}</h4>
                    <p>📅 ${turno.fecha} - ⏰ ${turno.hora}</p>
                    <p>📍 ${turno.direccion}</p>
                    <p>📝 ${turno.motivo || 'Consulta médica'}</p>
                    <span class="status-badge status-${turno.estado}">${turno.estado}</span>
                </div>
                <div class="appointment-actions">
                    ${turno.estado === 'pendiente' ? 
                        `<button class="btn btn-small btn-success" data-id="${turno.id}" data-action="pay">Pagar</button>
                         <button class="btn btn-small btn-warning" data-id="${turno.id}" data-action="reschedule">Reprogramar</button>
                         <button class="btn btn-small btn-danger" data-id="${turno.id}" data-action="cancel">Cancelar</button>` :
                        '<button class="btn btn-small btn-primary" data-id="${turno.id}" data-action="comprobante">Comprobante</button>'
                    }
                </div>
            </div>
        `;
    }

    initializeTurnosEvents() {
        // Botón nuevo turno
        const newAppointmentBtn = document.getElementById('new-appointment-btn');
        if (newAppointmentBtn) {
            newAppointmentBtn.addEventListener('click', () => this.showAppointmentModal());
        }

        // Botón login desde turnos
        const loginFromTurnosBtn = document.getElementById('login-from-turnos');
        if (loginFromTurnosBtn) {
            loginFromTurnosBtn.addEventListener('click', () => {
                if (window.authManager) {
                    authManager.showLoginModal();
                } else {
                    alert('Sistema de autenticación en desarrollo');
                }
            });
        }

        // Acciones de turnos
        document.querySelectorAll('[data-action="pay"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const turnoId = btn.getAttribute('data-id');
                if (window.paymentManager) {
                    paymentManager.initializePayment(turnoId);
                } else {
                    alert('Sistema de pagos en desarrollo');
                }
            });
        });

        document.querySelectorAll('[data-action="comprobante"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const turnoId = btn.getAttribute('data-id');
                if (window.paymentManager) {
                    paymentManager.generateComprobante(turnoId);
                } else {
                    alert('Generador de comprobantes en desarrollo');
                }
            });
        });

        document.querySelectorAll('[data-action="reschedule"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const turnoId = btn.getAttribute('data-id');
                this.reprogramarTurno(turnoId);
            });
        });

        document.querySelectorAll('[data-action="cancel"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const turnoId = btn.getAttribute('data-id');
                this.cancelarTurno(turnoId);
            });
        });
    }

    async showAppointmentModal() {
        await this.loadMedicos();

        const modalHTML = `
            <div class="modal" id="appointment-modal">
                <div class="modal-content">
                    <span class="close-modal" id="close-appointment-modal">&times;</span>
                    <div class="modal-header">
                        <h2>Solicitar Nuevo Turno</h2>
                    </div>
                    <form id="appointment-form">
                        <div class="form-group">
                            <label for="appointment-specialty">Especialidad</label>
                            <select id="appointment-specialty" class="form-control" required>
                                <option value="">Seleccione una especialidad</option>
                                <option value="Cardiología">Cardiología</option>
                                <option value="Dermatología">Dermatología</option>
                                <option value="Odontología">Odontología</option>
                                <option value="Pediatría">Pediatría</option>
                                <option value="Ginecología">Ginecología</option>
                                <option value="Clínica Médica">Clínica Médica</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="appointment-medico">Médico</label>
                            <select id="appointment-medico" class="form-control" required>
                                <option value="">Seleccione un médico</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="appointment-date">Fecha</label>
                            <input type="date" id="appointment-date" class="form-control" required min="${this.getTomorrowDate()}">
                        </div>
                        <div class="form-group">
                            <label for="appointment-time">Hora</label>
                            <select id="appointment-time" class="form-control" required>
                                <option value="">Seleccione una hora</option>
                                ${this.generateTimeSlots()}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="appointment-motivo">Motivo de la consulta</label>
                            <textarea id="appointment-motivo" class="form-control" rows="3" placeholder="Describa brevemente el motivo de su consulta"></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" id="cancel-appointment">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Solicitar Turno</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = modalHTML;
            const appointmentModal = document.getElementById('appointment-modal');
            if (appointmentModal) {
                appointmentModal.style.display = 'flex';
            }

            // Event listeners con verificación
            const closeBtn = document.getElementById('close-appointment-modal');
            const cancelBtn = document.getElementById('cancel-appointment');
            const specialtySelect = document.getElementById('appointment-specialty');
            const appointmentForm = document.getElementById('appointment-form');

            if (closeBtn) closeBtn.addEventListener('click', () => this.closeAppointmentModal());
            if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeAppointmentModal());
            if (specialtySelect) specialtySelect.addEventListener('change', (e) => this.filterMedicosBySpecialty(e.target.value));
            if (appointmentForm) appointmentForm.addEventListener('submit', (e) => this.handleAppointmentSubmit(e));

            // Cargar médicos iniciales
            this.populateMedicos();
        }
    }

    async loadMedicos() {
        try {
            const response = await fetch('${CONFIG.API_BASE_URL}/turnos/medicos/', {
                credentials: 'include'
            });
            
            if (response.ok) {
                this.medicos = await response.json();
            }
        } catch (error) {
            console.error('Error cargando médicos:', error);
        }
    }

    populateMedicos() {
        const medicoSelect = document.getElementById('appointment-medico');
        if (!medicoSelect) return;
        
        medicoSelect.innerHTML = '<option value="">Seleccione un médico</option>';
        
        this.medicos.forEach(medico => {
            const option = document.createElement('option');
            option.value = medico.id;
            option.textContent = 'Dr. ' + medico.nombre + ' ' + medico.apellido + ' - ' + medico.especialidad;
            option.setAttribute('data-especialidad', medico.especialidad);
            medicoSelect.appendChild(option);
        });
    }

    filterMedicosBySpecialty(especialidad) {
        const medicoSelect = document.getElementById('appointment-medico');
        if (!medicoSelect) return;
        
        const options = medicoSelect.querySelectorAll('option');
        
        options.forEach(option => {
            if (option.value === '') return;
            
            if (!especialidad || option.getAttribute('data-especialidad') === especialidad) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
        
        // Resetear selección
        medicoSelect.value = '';
    }

    generateTimeSlots() {
        const slots = [];
        for (let hour = 8; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0');
                slots.push('<option value="' + timeString + '">' + timeString + '</option>');
            }
        }
        return slots.join('');
    }

    getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    async handleAppointmentSubmit(e) {
        e.preventDefault();
        
        const medicoSelect = document.getElementById('appointment-medico');
        const dateInput = document.getElementById('appointment-date');
        const timeSelect = document.getElementById('appointment-time');
        const motivoTextarea = document.getElementById('appointment-motivo');
        
        if (!medicoSelect || !dateInput || !timeSelect) {
            this.showMessage('error', 'Error: Campos no encontrados');
            return;
        }

        const formData = {
            medico: medicoSelect.value,
            fecha: dateInput.value,
            hora: timeSelect.value,
            motivo: motivoTextarea ? motivoTextarea.value : ''
        };

        if (!formData.medico || !formData.fecha || !formData.hora) {
            this.showMessage('error', 'Por favor complete todos los campos obligatorios');
            return;
        }

        try {
            const response = await fetch('${CONFIG.API_BASE_URL}/turnos/turnos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const nuevoTurno = await response.json();
                this.closeAppointmentModal();
                app.loadSection('turnos');
                this.showMessage('success', 'Turno solicitado exitosamente. Proceda con el pago.');
                
                // Abrir modal de pago automáticamente
                setTimeout(() => {
                    if (window.paymentManager) {
                        paymentManager.initializePayment(nuevoTurno.id);
                    }
                }, 1000);
            } else {
                const error = await response.json();
                this.showMessage('error', error.detail || 'Error al solicitar el turno');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('error', 'Error de conexión');
        }
    }

    closeAppointmentModal() {
        const modal = document.getElementById('appointment-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async reprogramarTurno(turnoId) {
        if (confirm('¿Está seguro que desea reprogramar este turno?')) {
            // En una implementación real, aquí se abriría un modal de reprogramación
            this.showMessage('info', 'Funcionalidad de reprogramación en desarrollo');
        }
    }

    async cancelarTurno(turnoId) {
        if (confirm('¿Está seguro que desea cancelar este turno?')) {
            try {
                const response = await fetch('${CONFIG.API_BASE_URL}/turnos/turnos/${turnoId}/', {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': this.getCSRFToken()
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    app.loadSection('turnos');
                    this.showMessage('success', 'Turno cancelado exitosamente');
                } else {
                    this.showMessage('error', 'Error al cancelar el turno');
                }
            } catch (error) {
                console.error('Error:', error);
                this.showMessage('error', 'Error de conexión');
            }
        }
    }

    getCSRFToken() {
        if (window.authManager) {
            return authManager.getCSRFToken();
        }
        return '';
    }

    showMessage(type, message) {
        if (window.authManager) {
            authManager.showMessage(type, message);
        } else {
            alert(message);
        }
    }
}

// Crear instancia global
window.turnosManager = new TurnosManager();