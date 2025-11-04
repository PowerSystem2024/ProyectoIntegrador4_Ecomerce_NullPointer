@echo off
echo Creando archivo dashboard.js...

echo class DashboardManager { > js\dashboard.js
echo     constructor() { >> js\dashboard.js
echo         this.charts = {}; >> js\dashboard.js
echo         this.init(); >> js\dashboard.js
echo     } >> js\dashboard.js
echo >> js\dashboard.js
echo     init() { >> js\dashboard.js
echo         this.setupEventListeners(); >> js\dashboard.js
echo         this.loadDashboardData(); >> js\dashboard.js
echo     } >> js\dashboard.js
echo >> js\dashboard.js
echo     setupEventListeners() { >> js\dashboard.js
echo         // Los event listeners principales estan en app.js >> js\dashboard.js
echo         // Aqui listeners especificos del dashboard >> js\dashboard.js
echo     } >> js\dashboard.js
echo >> js\dashboard.js
echo     async loadDashboardData() { >> js\dashboard.js
echo         if (app.currentUser) { >> js\dashboard.js
echo             await this.loadUserDashboard(); >> js\dashboard.js
echo             >> js\dashboard.js
echo             if (app.currentUser.is_staff) { >> js\dashboard.js
echo                 await this.loadAdminDashboard(); >> js\dashboard.js
echo             } >> js\dashboard.js
echo         } else { >> js\dashboard.js
echo             this.showPublicDashboard(); >> js\dashboard.js
echo         } >> js\dashboard.js
echo     } >> js\dashboard.js
echo >> js\dashboard.js
echo     async loadUserDashboard() { >> js\dashboard.js
echo         try { >> js\dashboard.js
echo             // Mostrar seccion de proximos turnos >> js\dashboard.js
echo             document.getElementById('proximos-turnos').style.display = 'block'; >> js\dashboard.js
echo             document.getElementById('notifications-section').style.display = 'block'; >> js\dashboard.js
echo             >> js\dashboard.js
echo             // Actualizar welcome section para usuario logueado >> js\dashboard.js
echo             document.getElementById('welcome-title').textContent = 'Hola, ' + app.currentUser.first_name + '!'; >> js\dashboard.js
echo             document.getElementById('welcome-description').textContent = 'Gestiona tus turnos medicos de forma rapida y sencilla.'; >> js\dashboard.js
echo             document.getElementById('welcome-register-btn').style.display = 'none'; >> js\dashboard.js
echo             document.getElementById('quick-appointment-btn').style.display = 'inline-block'; >> js\dashboard.js
echo             document.getElementById('welcome-login-btn').style.display = 'none'; >> js\dashboard.js
echo >> js\dashboard.js
echo             // Cargar proximos turnos >> js\dashboard.js
echo             await this.loadProximosTurnos(); >> js\dashboard.js
echo >> js\dashboard.js
echo         } catch (error) { >> js\dashboard.js
echo             console.error('Error cargando dashboard usuario:', error); >> js\dashboard.js
echo         } >> js\dashboard.js
echo     } >> js\dashboard.js
echo >> js\dashboard.js
echo     showPublicDashboard() { >> js\dashboard.js
echo         // Configurar dashboard para usuarios no logueados >> js\dashboard.js
echo         document.getElementById('welcome-title').textContent = 'Bienvenido a Turno Facil'; >> js\dashboard.js
echo         document.getElementById('welcome-description').textContent = 'Tu sistema de gestion medica sencillo y agil. Gestiona tus turnos, historial medico y mas en un solo lugar.'; >> js\dashboard.js
echo         document.getElementById('welcome-register-btn').style.display = 'inline-block'; >> js\dashboard.js
echo         document.getElementById('quick-appointment-btn').style.display = 'none'; >> js\dashboard.js
echo         document.getElementById('welcome-login-btn').style.display = 'inline-block'; >> js\dashboard.js
echo         >> js\dashboard.js
echo         // Ocultar secciones que requieren login >> js\dashboard.js
echo         document.getElementById('proximos-turnos').style.display = 'none'; >> js\dashboard.js
echo         document.getElementById('notifications-section').style.display = 'none'; >> js\dashboard.js
echo         document.getElementById('admin-stats').style.display = 'none'; >> js\dashboard.js
echo     } >> js\dashboard.js
echo >> js\dashboard.js
echo     async loadProximosTurnos() { >> js\dashboard.js
echo         try { >> js\dashboard.js
echo             const turnos = await turnosManager.getUserTurnos(); >> js\dashboard.js
echo             const turnosProximos = turnos.slice(0, 3); // Mostrar solo 3 proximos turnos >> js\dashboard.js
echo             >> js\dashboard.js
echo             const appointmentList = document.getElementById('appointment-list'); >> js\dashboard.js
echo             >> js\dashboard.js
echo             if (turnosProximos.length > 0) { >> js\dashboard.js
echo                 appointmentList.innerHTML = turnosProximos.map(turno => ' >> js\dashboard.js
echo                     <div class="appointment-item"> >> js\dashboard.js
echo                         <div class="appointment-info"> >> js\dashboard.js
echo                             <h4>' + turno.medico_nombre + ' - ' + turno.especialidad + '</h4> >> js\dashboard.js
echo                             <p>📅 ' + turno.fecha + ' - ⏰ ' + turno.hora + '</p> >> js\dashboard.js
echo                             <p>📍 ' + turno.direccion + '</p> >> js\dashboard.js
echo                             <span class="status-badge status-' + turno.estado + '">' + turno.estado + '</span> >> js\dashboard.js
echo                         </div> >> js\dashboard.js
echo                         <div class="appointment-actions"> >> js\dashboard.js
echo                             ' + (turno.estado === 'pendiente' ?  >> js\dashboard.js
echo                                 '<button class="btn btn-small btn-success" data-id="' + turno.id + '" data-action="pay">Pagar</button>' :  >> js\dashboard.js
echo                                 '<button class="btn btn-small btn-primary" data-id="' + turno.id + '" data-action="comprobante">Comprobante</button>' >> js\dashboard.js
echo                             ) + ' >> js\dashboard.js
echo                             <button class="btn btn-small btn-outline" data-id="' + turno.id + '" data-action="details">Detalles</button> >> js\dashboard.js
echo                         </div> >> js\dashboard.js
echo                     </div> >> js\dashboard.js
echo                 ').join(''); >> js\dashboard.js
echo             } else { >> js\dashboard.js
echo                 appointmentList.innerHTML = ' >> js\dashboard.js
echo                     <div style="text-align: center; padding: 40px;"> >> js\dashboard.js
echo                         <p style="color: #666; margin-bottom: 20px;">No tienes turnos programados.</p> >> js\dashboard.js
echo                         <button class="btn btn-primary" data-section="turnos">Solicitar mi primer turno</button> >> js\dashboard.js
echo                     </div> >> js\dashboard.js
echo                 '; >> js\dashboard.js
echo             } >> js\dashboard.js
echo >> js\dashboard.js
echo             // Agregar event listeners a los botones >> js\dashboard.js
echo             this.initializeAppointmentActions(); >> js\dashboard.js
echo >> js\dashboard.js
echo         } catch (error) { >> js\dashboard.js
echo             console.error('Error cargando proximos turnos:', error); >> js\dashboard.js
echo         } >> js\dashboard.js
echo     } >> js\dashboard.js
echo } >> js\dashboard.js
echo >> js\dashboard.js
echo // Inicializar el dashboard manager >> js\dashboard.js
echo const dashboardManager = new DashboardManager(); >> js\dashboard.js
echo >> js\dashboard.js
echo // Hacer disponible globalmente para app.js >> js\dashboard.js
echo window.dashboardManager = dashboardManager; >> js\dashboard.js

echo ✅ dashboard.js creado exitosamente!
echo.
echo Ahora reinicia el servidor y prueba la aplicacion:
echo npx http-server -p 3000
pause