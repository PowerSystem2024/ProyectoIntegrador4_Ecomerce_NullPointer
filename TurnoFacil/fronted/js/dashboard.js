// dashboard.js - Versión corregida
class DashboardManager {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
    }

    setupEventListeners() {
        // Los event listeners principales están en app.js
        // Aquí listeners específicos del dashboard
    }

    async loadDashboardData() {
        if (app.currentUser) {
            await this.loadUserDashboard();
            
            if (app.currentUser.is_staff) {
                await this.loadAdminDashboard();
            }
        } else {
            this.showPublicDashboard();
        }
    }

    async loadUserDashboard() {
        try {
            // Mostrar sección de próximos turnos
            const proximosTurnos = document.getElementById('proximos-turnos');
            const notificationsSection = document.getElementById('notifications-section');
            
            if (proximosTurnos) proximosTurnos.style.display = 'block';
            if (notificationsSection) notificationsSection.style.display = 'block';
            
            // Actualizar welcome section para usuario logueado
            const welcomeTitle = document.getElementById('welcome-title');
            const welcomeDescription = document.getElementById('welcome-description');
            const welcomeRegisterBtn = document.getElementById('welcome-register-btn');
            const quickAppointmentBtn = document.getElementById('quick-appointment-btn');
            const welcomeLoginBtn = document.getElementById('welcome-login-btn');

            if (welcomeTitle) welcomeTitle.textContent = 'Hola, ${app.currentUser.first_name}!';
            if (welcomeDescription) welcomeDescription.textContent = 'Gestiona tus turnos médicos de forma rápida y sencilla.';
            if (welcomeRegisterBtn) welcomeRegisterBtn.style.display = 'none';
            if (quickAppointmentBtn) quickAppointmentBtn.style.display = 'inline-block';
            if (welcomeLoginBtn) welcomeLoginBtn.style.display = 'none';

            // Cargar próximos turnos
            await this.loadProximosTurnos();

        } catch (error) {
            console.error('Error cargando dashboard usuario:', error);
        }
    }

    async loadAdminDashboard() {
        try {
            // Mostrar estadísticas de admin
            const adminStats = document.getElementById('admin-stats');
            if (adminStats) adminStats.style.display = 'block';
            
            // Cargar datos de admin
            await this.loadAdminStats();
            await this.loadCharts();

        } catch (error) {
            console.error('Error cargando dashboard admin:', error);
        }
    }

    showPublicDashboard() {
        // Configurar dashboard para usuarios no logueados
        const welcomeTitle = document.getElementById('welcome-title');
        const welcomeDescription = document.getElementById('welcome-description');
        const welcomeRegisterBtn = document.getElementById('welcome-register-btn');
        const quickAppointmentBtn = document.getElementById('quick-appointment-btn');
        const welcomeLoginBtn = document.getElementById('welcome-login-btn');
        
        if (welcomeTitle) welcomeTitle.textContent = 'Bienvenido a Turno Fácil';
        if (welcomeDescription) welcomeDescription.textContent = 'Tu sistema de gestión médica sencillo y ágil. Gestiona tus turnos, historial médico y más en un solo lugar.';
        if (welcomeRegisterBtn) welcomeRegisterBtn.style.display = 'inline-block';
        if (quickAppointmentBtn) quickAppointmentBtn.style.display = 'none';
        if (welcomeLoginBtn) welcomeLoginBtn.style.display = 'inline-block';
        
        // Ocultar secciones que requieren login
        const proximosTurnos = document.getElementById('proximos-turnos');
        const notificationsSection = document.getElementById('notifications-section');
        const adminStats = document.getElementById('admin-stats');
        
        if (proximosTurnos) proximosTurnos.style.display = 'none';
        if (notificationsSection) notificationsSection.style.display = 'none';
        if (adminStats) adminStats.style.display = 'none';
    }

    async loadProximosTurnos() {
        try {
            // Simular datos de turnos hasta que tengamos turnosManager
            const turnosProximos = []; // Array vacío por ahora
            
            const appointmentList = document.getElementById('appointment-list');
            if (!appointmentList) return;
            
            if (turnosProximos.length > 0) {
                appointmentList.innerHTML = turnosProximos.map(turno => `
                    <div class="appointment-item">
                        <div class="appointment-info">
                            <h4>${turno.medico_nombre} - ${turno.especialidad}</h4>
                            <p>📅 ${turno.fecha} - ⏰ ${turno.hora}</p>
                            <p>📍 ${turno.direccion}</p>
                            <span class="status-badge status-${turno.estado}">${turno.estado}</span>
                        </div>
                        <div class="appointment-actions">
                            ${turno.estado === 'pendiente' ? 
                                '<button class="btn btn-small btn-success" data-id="${turno.id}" data-action="pay">Pagar</button>' : 
                                '<button class="btn btn-small btn-primary" data-id="${turno.id}" data-action="comprobante">Comprobante</button>'
                            }
                            <button class="btn btn-small btn-outline" data-id="${turno.id}" data-action="details">Detalles</button>
                        </div>
                    </div>
                `).join('');
            } else {
                appointmentList.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <p style="color: #666; margin-bottom: 20px;">No tienes turnos programados.</p>
                        <button class="btn btn-primary" data-section="turnos">Solicitar mi primer turno</button>
                    </div>
                `;
            }

            // Agregar event listeners a los botones
            this.initializeAppointmentActions();

        } catch (error) {
            console.error('Error cargando próximos turnos:', error);
        }
    }

    async loadAdminStats() {
        try {
            // Simular datos de estadísticas (en una app real vendrían del backend)
            const stats = {
                totalPacientes: 154,
                totalTurnos: 287,
                turnosPendientes: 23,
                ingresosHoy: 57500
            };

            const totalPacientes = document.getElementById('total-pacientes');
            const totalTurnos = document.getElementById('total-turnos');
            const turnosPendientes = document.getElementById('turnos-pendientes');
            const ingresosHoy = document.getElementById('ingresos-hoy');

            if (totalPacientes) totalPacientes.textContent = stats.totalPacientes;
            if (totalTurnos) totalTurnos.textContent = stats.totalTurnos;
            if (turnosPendientes) turnosPendientes.textContent = stats.turnosPendientes;
            if (ingresosHoy) ingresosHoy.textContent = '$${stats.ingresosHoy.toLocaleString()}';

        } catch (error) {
            console.error('Error cargando estadísticas admin:', error);
        }
    }

    async loadCharts() {
        try {
            // Datos de ejemplo para los gráficos
            const turnosData = {
                pendientes: 23,
                confirmados: 45,
                completados: 189,
                cancelados: 30
            };

            const especialidadesData = {
                'Cardiología': 45,
                'Dermatología': 32,
                'Odontología': 67,
                'Pediatría': 54,
                'Clínica Médica': 89
            };

            this.renderTurnosChart(turnosData);
            this.renderEspecialidadesChart(especialidadesData);

        } catch (error) {
            console.error('Error cargando gráficos:', error);
        }
    }

    renderTurnosChart(data) {
        const canvas = document.getElementById('turnosChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.turnos) {
            this.charts.turnos.destroy();
        }

        // Verificar si Chart está disponible
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js no está cargado');
            return;
        }

        this.charts.turnos = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pendientes', 'Confirmados', 'Completados', 'Cancelados'],
                datasets: [{
                    data: [data.pendientes, data.confirmados, data.completados, data.cancelados],
                    backgroundColor: [
                        '#fec44f', // warning
                        '#41ab5d', // success
                        '#2c7fb8', // primary
                        '#e74c3c'  // danger
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    renderEspecialidadesChart(data) {
        const canvas = document.getElementById('especialidadesChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.especialidades) {
            this.charts.especialidades.destroy();
        }

        // Verificar si Chart está disponible
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js no está cargado');
            return;
        }

        this.charts.especialidades = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Cantidad de Turnos',
                    data: Object.values(data),
                    backgroundColor: '#2c7fb8',
                    borderColor: '#236192',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        });
    }

    initializeAppointmentActions() {
        // Botones de pago
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

        // Botones de comprobante
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

        // Botones de detalles
        document.querySelectorAll('[data-action="details"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const turnoId = btn.getAttribute('data-id');
                this.showTurnoDetails(turnoId);
            });
        });

        // Botón solicitar turno desde el empty state
        const solicitarTurnoBtn = document.querySelector('[data-section="turnos"]');
        if (solicitarTurnoBtn) {
            solicitarTurnoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                app.loadSection('turnos');
            });
        }
    }

    showTurnoDetails(turnoId) {
        // En una implementación real, esto cargaría los detalles completos del turno
        alert('Detalles del turno ' + turnoId + '\n\nEsta funcionalidad mostrará información detallada del turno seleccionado.');
    }

    // Método para actualizar el dashboard cuando cambia el usuario
    refresh() {
        this.loadDashboardData();
    }
}

// Inicializar el dashboard manager
const dashboardManager = new DashboardManager();

// Hacer disponible globalmente para app.js
window.dashboardManager = dashboardManager;