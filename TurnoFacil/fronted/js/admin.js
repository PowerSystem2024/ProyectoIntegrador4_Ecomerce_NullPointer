// admin.js - Versión corregida
class AdminManager {
    constructor() {
        this.pacientes = [];
        this.turnos = [];
    }

    async loadAdminSection() {
        if (!app.currentUser || !app.currentUser.is_staff) {
            return `
                <div class="appointments">
                    <h2 class="section-title">Panel de Administración</h2>
                    <div class="error">
                        <p>No tienes permisos de administrador para acceder a esta sección.</p>
                    </div>
                </div>
            `;
        }

        await this.loadPacientes();
        await this.loadTurnosAdmin();

        return `
            <div class="admin-panel">
                <div class="admin-header">
                    <h2 class="section-title">Panel de Administración</h2>
                    <div>
                        <button class="btn btn-primary" id="add-medico-btn">Agregar Médico</button>
                        <button class="btn btn-outline" id="refresh-data-btn">Actualizar</button>
                    </div>
                </div>
                
                <div class="admin-stats">
                    <div class="stat-card">
                        <div class="stat-number">${this.pacientes.length}</div>
                        <div class="stat-label">Pacientes Registrados</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.turnos.length}</div>
                        <div class="stat-label">Total de Turnos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.turnos.filter(t => t.estado === 'pendiente').length}</div>
                        <div class="stat-label">Turnos Pendientes</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.turnos.filter(t => t.estado === 'confirmado').length}</div>
                        <div class="stat-label">Turnos Confirmados</div>
                    </div>
                </div>

                <h3 style="margin: 30px 0 20px 0; color: var(--primary);">Gestión de Turnos</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Paciente</th>
                                <th>Médico</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.turnos.map(turno => `
                                <tr>
                                    <td>${turno.id}</td>
                                    <td>${turno.paciente_first_name} ${turno.paciente_last_name}</td>
                                    <td>${turno.medico_nombre}</td>
                                    <td>${turno.fecha}</td>
                                    <td>${turno.hora}</td>
                                    <td><span class="status-badge status-${turno.estado}">${turno.estado}</span></td>
                                    <td>
                                        <button class="btn btn-small btn-primary" data-id="${turno.id}" data-action="view">Ver</button>
                                        <button class="btn btn-small btn-warning" data-id="${turno.id}" data-action="edit">Editar</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <h3 style="margin: 40px 0 20px 0; color: var(--primary);">Pacientes Registrados</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>DNI</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.pacientes.map(paciente => `
                                <tr>
                                    <td>${paciente.dni}</td>
                                    <td>${paciente.first_name}</td>
                                    <td>${paciente.last_name}</td>
                                    <td>${paciente.email}</td>
                                    <td>${paciente.telefono || 'N/A'}</td>
                                    <td>${new Date(paciente.date_joined).toLocaleDateString('es-AR')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    async loadPacientes() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/auth/`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                this.pacientes = await response.json();
            }
        } catch (error) {
            console.error('Error cargando pacientes:', error);
        }
    }

    async loadTurnosAdmin() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/turnos/turnos/`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                this.turnos = await response.json();
            }
        } catch (error) {
            console.error('Error cargando turnos:', error);
        }
    }

    initializeAdminEvents() {
        // Botón actualizar
        const refreshBtn = document.getElementById('refresh-data-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                app.loadSection('admin');
            });
        }

        // Botón agregar médico
        const addMedicoBtn = document.getElementById('add-medico-btn');
        if (addMedicoBtn) {
            addMedicoBtn.addEventListener('click', () => {
                this.showAddMedicoModal();
            });
        }

        // Acciones de turnos
        document.querySelectorAll('[data-action="view"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const turnoId = btn.getAttribute('data-id');
                this.viewTurno(turnoId);
            });
        });

        document.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const turnoId = btn.getAttribute('data-id');
                this.editTurno(turnoId);
            });
        });
    }

    showAddMedicoModal() {
        // Usar alert temporal hasta implementar authManager
        alert('Funcionalidad de agregar médico en desarrollo');
    }

    viewTurno(turnoId) {
        const turno = this.turnos.find(t => t.id == turnoId);
        if (turno) {
            alert('Detalles del Turno:\n\nPaciente: '+ turno.paciente_first_name + ' ' + turno.paciente_last_name + '\nMédico: ' + turno.medico_nombre + '\nFecha: ' + turno.fecha + '\nHora: ' + turno.hora + '\nEstado: ' + turno.estado + '\nMotivo: ' + (turno.motivo || 'No especificado'));
        }
    }

    editTurno(turnoId) {
        // Método placeholder
        alert(`Editar turno ${turnoId} - Funcionalidad en desarrollo`);
    }
}

// Crear instancia global
window.adminManager = new AdminManager();