// auth.js - Versión completamente corregida
class AuthManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Los event listeners se configuran en app.js
    }

    showLoginModal() {
        const modalHTML = `
            <div class="modal" id="login-modal">
                <div class="modal-content">
                    <span class="close-modal" id="close-login-modal">&times;</span>
                    <div class="modal-header">
                        <h2>Iniciar Sesión</h2>
                    </div>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-username">Usuario o Email</label>
                            <input type="text" id="login-username" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Contraseña</label>
                            <input type="password" id="login-password" class="form-control" required>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" id="cancel-login">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = modalHTML;
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.style.display = 'flex';
            }

            // Event listeners del modal con verificación
            const closeBtn = document.getElementById('close-login-modal');
            const cancelBtn = document.getElementById('cancel-login');
            const loginForm = document.getElementById('login-form');

            if (closeBtn) closeBtn.addEventListener('click', () => this.closeLoginModal());
            if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeLoginModal());
            if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    showRegisterModal() {
        const modalHTML = `
            <div class="modal" id="register-modal">
                <div class="modal-content">
                    <span class="close-modal" id="close-register-modal">&times;</span>
                    <div class="modal-header">
                        <h2>Registrarse</h2>
                    </div>
                    <form id="register-form">
                        <div class="form-group">
                            <label for="register-dni">DNI</label>
                            <input type="text" id="register-dni" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="register-first-name">Nombre</label>
                            <input type="text" id="register-first-name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="register-last-name">Apellido</label>
                            <input type="text" id="register-last-name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="register-email">Email</label>
                            <input type="email" id="register-email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="register-username">Usuario</label>
                            <input type="text" id="register-username" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="register-password">Contraseña</label>
                            <input type="password" id="register-password" class="form-control" required>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" id="cancel-register">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Registrarse</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = modalHTML;
            const registerModal = document.getElementById('register-modal');
            if (registerModal) {
                registerModal.style.display = 'flex';
            }

            // Event listeners del modal con verificación
            const closeBtn = document.getElementById('close-register-modal');
            const cancelBtn = document.getElementById('cancel-register');
            const registerForm = document.getElementById('register-form');

            if (closeBtn) closeBtn.addEventListener('click', () => this.closeRegisterModal());
            if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeRegisterModal());
            if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');
        
        if (!usernameInput || !passwordInput) {
            this.showMessage('error', 'Error: Campos no encontrados');
            return;
        }

        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('${CONFIG.API_BASE_URL}/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                app.setCurrentUser(data);
                this.closeLoginModal();
                app.loadSection('dashboard');
                this.showMessage('success', 'Inicio de sesión exitoso');
            } else {
                this.showMessage('error', data.error || 'Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('error', 'Error de conexión');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        // Obtener valores de los inputs con verificación
        const getInputValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value : '';
        };

        const formData = {
            dni: getInputValue('register-dni'),
            first_name: getInputValue('register-first-name'),
            last_name: getInputValue('register-last-name'),
            email: getInputValue('register-email'),
            username: getInputValue('register-username'),
            password: getInputValue('register-password')
        };

        try {
            const response = await fetch('${CONFIG.API_BASE_URL}/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                app.setCurrentUser(data);
                this.closeRegisterModal();
                app.loadSection('dashboard');
                this.showMessage('success', 'Registro exitoso');
            } else {
                this.showMessage('error', this.formatErrors(data));
            }
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('error', 'Error de conexión');
        }
    }

    async logout() {
        try {
            const response = await fetch('${CONFIG.API_BASE_URL}/auth/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                credentials: 'include'
            });

            if (response.ok) {
                app.setCurrentUser(null);
                app.loadSection('dashboard');
                this.showMessage('success', 'Sesión cerrada exitosamente');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    closeLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    closeRegisterModal() {
        const modal = document.getElementById('register-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    getCSRFToken() {
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    formatErrors(errorData) {
        if (typeof errorData === 'string') {
            return errorData;
        }
        
        let errors = [];
        for (const field in errorData) {
            if (Array.isArray(errorData[field])) {
                errors.push(field + ': ' + errorData[field].join(', '));
            } else {
                errors.push(field + ': ' + errorData[field]);
            }
        }
        return errors.join('; ');
    }

    showMessage(type, message) {
        // Crear elemento de mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + type;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 10px 15px;
            margin: 10px 0;
            border-radius: 4px;
            color: white;
            background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
        `;
        
        // Insertar al inicio del contenido principal
        const contentSection = document.getElementById('content-section');
        if (contentSection) {
            contentSection.insertBefore(messageDiv, contentSection.firstChild);
            
            // Auto-remover después de 5 segundos
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 5000);
        }
    }
}

// Crear instancia global
window.authManager = new AuthManager();