// app.js - Versión completa con configuración integrada
console.log('🔧 Verificando configuración...');

// Verificar que CONFIG esté definido
if (typeof CONFIG === 'undefined') {
    console.error('❌ CONFIG no está definido');
    // Definir CONFIG por defecto
    window.CONFIG = {
        API_BASE_URL: window.location.hostname === 'localhost' 
            ? 'http://localhost:8000/api' 
            : '/api',
        MERCADOPAGO_PUBLIC_KEY: 'APP_USR-aaf87840-bb69-4343-8b1e-f8a49c92a770'
    };
    console.log('✅ CONFIG definido por defecto:', window.CONFIG);
} else {
    console.log('✅ CONFIG encontrado:', CONFIG);
}

console.log('🚀 TurnoFacilApp iniciando...');

class TurnoFacilApp {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        
        // Inicializar después de que todos los scripts carguen
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.safeInit());
        } else {
            setTimeout(() => this.safeInit(), 100);
        }
    }

    safeInit() {
        try {
            console.log('🔄 Inicialización segura...');
            this.setupEventListeners();
            this.loadSection('dashboard');
            // Ensure CSRF cookie is set for subsequent POST requests from the frontend
            try {
                fetch(`${window.CONFIG.API_BASE_URL}/auth/csrf/`, { credentials: 'include' })
                    .then(() => this.checkAuth())
                    .catch((err) => {
                        console.warn('No se pudo obtener CSRF cookie (frontend).', err);
                        this.checkAuth();
                    });
            } catch (err) {
                console.warn('Error solicitando CSRF:', err);
                this.checkAuth();
            }
        } catch (error) {
            console.error('❌ Error en inicialización:', error);
            this.showErrorUI();
        }
    }

    setupEventListeners() {
        console.log('🔗 Configurando eventos...');
        
        // Navegación principal
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-section]');
            if (target) {
                e.preventDefault();
                const section = target.getAttribute('data-section');
                this.loadSection(section);
            }
        });

        // Botones de auth con protección
        this.setupSafeAuthEvents();
    }

    setupSafeAuthEvents() {
        const safeAddEvent = (id, handler) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    try {
                        handler();
                    } catch (error) {
                        console.error('Error en ${id}:', error);
                        alert('Funcionalidad en desarrollo');
                    }
                });
            }
        };

        safeAddEvent('login-btn', () => this.showLoginModal());
        safeAddEvent('register-btn', () => this.showRegisterModal());
        safeAddEvent('logout-btn', () => window.authManager.logout());
    }

    async checkAuth() {
        try {
            console.log('🔐 Verificando autenticación...');
            const response = await fetch(`${window.CONFIG.API_BASE_URL}/auth/user/`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const userData = await response.json();
                this.setCurrentUser(userData);
            } else {
                this.setCurrentUser(null);
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            this.setCurrentUser(null);
        }
    }

    setCurrentUser(user) {
        this.currentUser = user;
        console.log('Usuario actual:', user);
        this.updateUI();
    }

    updateUI() {
        try {
            const elements = {
                'user-welcome': this.currentUser,
                'login-btn': !this.currentUser,
                'register-btn': !this.currentUser,
                'logout-btn': !!this.currentUser,
                'admin-link': this.currentUser && this.currentUser.is_staff
            };

            Object.entries(elements).forEach(([id, shouldShow]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.display = shouldShow ? 'inline-block' : 'none';
                }
            });

            // Actualizar texto de bienvenida
            const welcome = document.getElementById('user-welcome');
            if (welcome && this.currentUser) {
                welcome.textContent = '';
            }
        } catch (error) {
            console.error('Error actualizando UI:', error);
        }
    }

    async loadSection(section) {
        console.log('📂 Cargando sección:', section);
        this.currentSection = section;
        
        try {
            const content = document.getElementById('content-section');
            if (!content) throw new Error('No se encontró content-section');

            let html = '';
            
            switch(section) {
                case 'dashboard':
                    html = await this.loadDashboard();
                    break;
                case 'turnos':
                    html = await turnosManager.loadTurnosSection();
                    break;
                case 'historial':
                    html = this.loadHistorialSection();
                    break;
                case 'estudios':
                    html = this.loadEstudiosSection();
                    break;
                case 'facturas':
                    html = this.loadFacturasSection();
                    break;
                case 'admin':
                    html = await adminManager.loadAdminSection();
                    break;
                default:
                    html = await this.loadDashboard();
            }
            
            content.innerHTML = html;
            this.initializeSectionEvents(section);
            
        } catch (error) {
            console.error('Error cargando sección:', error);
            this.showSectionError();
        }
    }

    async loadDashboard() {
        if (!this.currentUser) {
            return `
                <section class="welcome-section">
                    <h2>Bienvenido a Turno Fácil</h2>
                    <p>Tu sistema de gestión médica sencillo y ágil. Gestiona tus turnos, historial médico y más en un solo lugar.</p>
                    <button class="btn btn-primary" id="welcome-register">Comenzar Ahora</button>
                </section>
                <section class="dashboard">
                    ${this.getDashboardCards()}
                </section>
            `;
        }

        // Para usuarios logueados, mostrar información personalizada
        let proximosTurnosHTML = '<p>No tienes turnos programados.</p>';
        
        try {
            if (window.turnosManager) {
                const turnos = await turnosManager.getUserTurnos();
                const turnosProximos = turnos.slice(0, 3);
                
                if (turnosProximos.length > 0) {
                    proximosTurnosHTML = turnosProximos.map(turno => `
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
                            </div>
                        </div>
                    `).join('');
                }
            }
        } catch (error) {
            console.error('Error cargando turnos para dashboard:', error);
        }

        return `
            <section class="welcome-section">
                <h2>Bienvenido!</h2>
                <p>Gestiona tus turnos médicos de forma rápida y sencilla.</p>
                <button class="btn btn-primary" id="quick-turno">Solicitar Turno</button>
            </section>

            <div class="dashboard">
                ${this.getDashboardCards()}
            </div>

            <section class="appointments">
                <h2 class="section-title">Próximos Turnos</h2>
                ${proximosTurnosHTML}
            </section>
        `;
    }

    getDashboardCards() {
        const cards = [
            {
                icon: '📅',
                title: 'Turnos',
                description: 'Solicita y gestiona tus turnos médicos de forma rápida y sencilla.',
                section: 'turnos'
            },
            {
                icon: '📋',
                title: 'Historial Médico',
                description: 'Accede a tu historial médico completo y consultas anteriores.',
                section: 'historial'
            },
            {
                icon: '🩺',
                title: 'Historial Clínico',
                description: 'Consulta tu historial clínico, diagnósticos y tratamientos.',
                section: 'historial'
            },
            {
                icon: '🔬',
                title: 'Estudios',
                description: 'Visualiza y descarga tus estudios médicos y resultados.',
                section: 'estudios'
            },
            {
                icon: '💰',
                title: 'Facturas',
                description: 'Consulta y descarga tus facturas y comprobantes de pago.',
                section: 'facturas'
            }
        ];

        return cards.map(card => `
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">${card.icon}</span>
                    <h3>${card.title}</h3>
                </div>
                <p>${card.description}</p>
                <div class="card-footer">
                    <button class="btn btn-primary" data-section="${card.section}">Ver ${card.title}</button>
                </div>
            </div>
        `).join('');
    }

    initializeSectionEvents(section) {
        // Botones de sección
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadSection(btn.getAttribute('data-section'));
            });
        });

        // Botones específicos del dashboard
        const quickTurnoBtn = document.getElementById('quick-turno');
        if (quickTurnoBtn) {
            quickTurnoBtn.addEventListener('click', () => this.loadSection('turnos'));
        }

        const welcomeRegisterBtn = document.getElementById('welcome-register');
        if (welcomeRegisterBtn) {
            welcomeRegisterBtn.addEventListener('click', () => this.showRegisterModal());
        }

        // Botones de turnos en el dashboard
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

        // Inicializar sección específica
        switch(section) {
            case 'turnos':
                if (window.turnosManager) {
                    turnosManager.initializeTurnosEvents();
                }
                break;
            case 'admin':
                if (window.adminManager) {
                    adminManager.initializeAdminEvents();
                }
                break;
        }
    }

    // Métodos de autenticación que usan authManager
    showLoginModal() {
        if (window.authManager) {
            authManager.showLoginModal();
        } else {
            alert('Modal de login - En desarrollo');
        }
    }

    showRegisterModal() {
        if (window.authManager) {
            authManager.showRegisterModal();
        } else {
            alert('Modal de registro - En desarrollo');
        }
    }

    logout() {
        if (window.authManager) {
            authManager.logout();
        } else {
            alert('Cerrar sesión - En desarrollo');
        }
    }

    loadHistorialSection() {
        return `
            <div class="appointments">
                <h2 class="section-title">Historial Médico</h2>
                <div class="content-placeholder">
                    <p>Tu historial médico completo estará disponible aquí.</p>
                    <p><em>Funcionalidad en desarrollo - Próximamente</em></p>
                </div>
            </div>
        `;
    }

    loadEstudiosSection() {
        return `
            <div class="appointments">
                <h2 class="section-title">Estudios Médicos</h2>
                <div class="content-placeholder">
                    <p>Tus estudios y resultados estarán disponibles aquí.</p>
                    <p><em>Funcionalidad en desarrollo - Próximamente</em></p>
                </div>
            </div>
        `;
    }

    loadFacturasSection() {
        return `
            <div class="appointments">
                <h2 class="section-title">Facturas y Comprobantes</h2>
                <div class="content-placeholder">
                    <p>Tus facturas y comprobantes estarán disponibles aquí.</p>
                    <p><em>Funcionalidad en desarrollo - Próximamente</em></p>
                </div>
            </div>
        `;
    }

    showErrorUI() {
        const content = document.getElementById('content-section');
        if (content) {
            content.innerHTML = `
                <div class="error-message">
                    <h2>⚠ Error en la aplicación</h2>
                    <p>La aplicación encontró un error. Recarga la página.</p>
                    <button class="btn btn-primary" onclick="location.reload()">Recargar</button>
                </div>
            `;
        }
    }

    showSectionError() {
        const content = document.getElementById('content-section');
        if (content) {
            content.innerHTML = `
                <div class="error-message">
                    <h2>Error cargando sección</h2>
                    <p>Intenta navegar a otra sección.</p>
                </div>
            `;
        }
    }
}

// Inicializar con protección total
console.log('🎯 Creando aplicación...');
try {
    window.app = new TurnoFacilApp();
    
    // Inicializar PaymentManager
    if (typeof PaymentManager !== 'undefined') {
        window.paymentManager = new PaymentManager();
        console.log('✅ PaymentManager inicializado');
    } else {
        console.warn('⚠ PaymentManager no disponible');
    }
    
    console.log('✅ Aplicación creada correctamente');
} catch (error) {
    console.error('💥 Error crítico:', error);
}