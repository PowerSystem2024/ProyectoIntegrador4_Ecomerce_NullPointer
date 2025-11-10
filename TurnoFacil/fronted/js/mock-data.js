// mock-data.js - Datos de prueba temporales
console.log('🎭 Cargando datos de prueba...');

window.MOCK_DATA = {
    // Datos de médicos
    medicos: [
        {
            id: 1,
            nombre: "Carlos",
            apellido: "Gómez",
            especialidad: "Cardiología",
            email: "c.gomez@clinica.com",
            telefono: "+54 11 1234-5678",
            direccion: "Av. Corrientes 1234, CABA",
            horarios: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"]
        },
        {
            id: 2,
            nombre: "Ana",
            apellido: "López",
            especialidad: "Dermatología",
            email: "a.lopez@clinica.com",
            telefono: "+54 11 2345-6789",
            direccion: "Av. Santa Fe 567, CABA",
            horarios: ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"]
        },
        {
            id: 3,
            nombre: "Roberto",
            apellido: "Martínez",
            especialidad: "Odontología",
            email: "r.martinez@clinica.com",
            telefono: "+54 11 3456-7890",
            direccion: "Av. Callao 789, CABA",
            horarios: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"]
        },
        {
            id: 4,
            nombre: "María",
            apellido: "Rodríguez",
            especialidad: "Pediatría",
            email: "m.rodriguez@clinica.com",
            telefono: "+54 11 4567-8901",
            direccion: "Av. Córdoba 456, CABA",
            horarios: ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]
        },
        {
            id: 5,
            nombre: "Diego",
            apellido: "Fernández",
            especialidad: "Clínica Médica",
            email: "d.fernandez@clinica.com",
            telefono: "+54 11 5678-9012",
            direccion: "Av. Rivadavia 2345, CABA",
            horarios: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"]
        },
        {
            id: 6,
            nombre: "Laura",
            apellido: "Gutiérrez",
            especialidad: "Ginecología",
            email: "l.gutierrez@clinica.com",
            telefono: "+54 11 6789-0123",
            direccion: "Av. Libertador 3456, CABA",
            horarios: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"]
        }
    ],

    // Turnos de ejemplo
    turnos: [
        {
            id: 1,
            paciente_first_name: "Cristian",
            paciente_last_name: "Pérez",
            paciente_dni: "30123456",
            medico_nombre: "Dr. Carlos Gómez",
            especialidad: "Cardiología",
            fecha: "2024-12-15",
            hora: "10:00",
            direccion: "Av. Corrientes 1234, CABA",
            motivo: "Control cardíaco anual",
            estado: "pendiente",
            monto: 100,
            fecha_pago: null,
            id_transaccion: null
        },
        {
            id: 2,
            paciente_first_name: "Cristian", 
            paciente_last_name: "Pérez",
            paciente_dni: "30123456",
            medico_nombre: "Dra. Ana López",
            especialidad: "Dermatología",
            fecha: "2024-12-20",
            hora: "15:30",
            direccion: "Av. Santa Fe 567, CABA",
            motivo: "Consulta por dermatitis",
            estado: "pendiente",
            monto: 100,
            fecha_pago: null,
            id_transaccion: null
        },
        {
            id: 3,
            paciente_first_name: "Cristian", 
            paciente_last_name: "Pérez",
            paciente_dni: "30123456",
            medico_nombre: "Dr. Roberto Martínez",
            especialidad: "Odontología",
            fecha: "2024-12-18",
            hora: "09:30",
            direccion: "Av. Callao 789, CABA",
            motivo: "Limpieza dental",
            estado: "pendiente",
            monto: 100,
            fecha_pago: null,
            id_transaccion: null
        },
        {
            id: 4,
            paciente_first_name: "Cristian", 
            paciente_last_name: "Pérez",
            paciente_dni: "30123456",
            medico_nombre: "Dra. María Rodríguez",
            especialidad: "Pediatría",
            fecha: "2024-12-22",
            hora: "11:00",
            direccion: "Av. Córdoba 456, CABA",
            motivo: "Control pediátrico",
            estado: "pendiente",
            monto: 100,
            fecha_pago: null,
            id_transaccion: null
        },
        {
            id: 5,
            paciente_first_name: "Cristian", 
            paciente_last_name: "Pérez",
            paciente_dni: "30123456",
            medico_nombre: "Dr. Diego Fernández",
            especialidad: "Clínica Médica",
            fecha: "2024-12-25",
            hora: "14:30",
            direccion: "Av. Rivadavia 2345, CABA",
            motivo: "Chequeo general",
            estado: "pendiente",
            monto: 100,
            fecha_pago: null,
            id_transaccion: null
        },
        {
            id: 3,
            paciente_first_name: "María",
            paciente_last_name: "García",
            paciente_dni: "28987654",
            medico_nombre: "Dr. Roberto Martínez",
            especialidad: "Odontología",
            fecha: "2024-01-18",
            hora: "11:00",
            direccion: "Av. Callao 789, CABA",
            motivo: "Limpieza dental",
            estado: "completado",
            monto: 1500,
            fecha_pago: "2024-01-12",
            id_transaccion: "MP-987654321"
        }
    ],

    // Pacientes de ejemplo (para admin)
    pacientes: [
        {
            id: 1,
            dni: "30123456",
            first_name: "Cristian",
            last_name: "Pérez",
            email: "cristian.perez@email.com",
            telefono: "+54 11 1234-5678",
            date_joined: "2024-01-01T10:00:00Z"
        },
        {
            id: 2,
            dni: "28987654",
            first_name: "María",
            last_name: "García",
            email: "maria.garcia@email.com",
            telefono: "+54 11 2345-6789",
            date_joined: "2024-01-02T11:30:00Z"
        },
        {
            id: 3,
            dni: "32567890",
            first_name: "Carlos",
            last_name: "López",
            email: "carlos.lopez@email.com",
            telefono: "+54 11 3456-7890",
            date_joined: "2024-01-03T09:15:00Z"
        }
    ],

    // Especialidades disponibles
    especialidades: [
        "Cardiología",
        "Dermatología", 
        "Odontología",
        "Pediatría",
        "Ginecología",
        "Clínica Médica",
        "Traumatología",
        "Oftalmología"
    ]
};

// Función para simular delay de API
window.simulateAPIDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock de fetch para datos de prueba
window.mockFetch = async (url, options = {}) => {
    console.log('🎭 Mock fetch para:', url, 'method:', options.method);
    await simulateAPIDelay(300);
    
    // ⚡ MOCK PAGOS - PRIMERA PRIORIDAD
    // Mock para crear pago de turno (MercadoPago)
    if (url.includes('/pagos/crear_pago_turno/')) {
        console.log('💳 🚀 INTERCEPTADO - Mock crear pago MercadoPago');
        console.log('💳 URL:', url);
        console.log('💳 Method:', options.method);
        
        const body = options.body ? JSON.parse(options.body) : {};
        const turnoId = body.turno_id || '1';
        
        // Simular respuesta exitosa con URL de nuestro simulador local
        const mockPaymentUrl = `/pago-simulador.html?turno=${turnoId}&monto=100`;
        
        // Simular redirección después de un pequeño delay
        setTimeout(() => {
            console.log('🚀 Abriendo simulador de MercadoPago...');
            window.open(mockPaymentUrl, '_blank');
        }, 1000);
        
        return {
            ok: true,
            status: 200,
            json: async () => ({
                url_pago: mockPaymentUrl,
                pago_id: `MOCK-${turnoId}-${Date.now()}`,
                status: 'created'
            })
        };
    }
    
    // Pagos mock (listar)
    if (url.includes('/pagos/') && !url.includes('crear_pago_turno')) {
        console.log('💳 Mock listar pagos');
        return {
            ok: true,
            status: 200,
            json: async () => []
        };
    }
    
    // Login mock
    if (url.includes('/auth/login/') && options.method === 'POST') {
        const body = JSON.parse(options.body);
        console.log('🔐 Mock login:', body);
        
        if (body.username && body.password) {
            const mockUser = {
                id: 1,
                username: body.username,
                first_name: "Cristian",
                last_name: "Pérez", 
                email: "cristian@example.com",
                dni: "30123456",
                is_staff: body.username === 'admin'
            };
            
            return {
                ok: true,
                json: async () => mockUser
            };
        } else {
            return {
                ok: false,
                json: async () => ({ error: "Credenciales inválidas" })
            };
        }
    }
    
    // Register mock
    if (url.includes('/auth/register/') && options.method === 'POST') {
        const userData = JSON.parse(options.body);
        console.log('📝 Mock register:', userData);
        
        const mockUser = {
            id: Date.now(),
            username: userData.username,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            dni: userData.dni,
            is_staff: false
        };
        
        return {
            ok: true,
            json: async () => mockUser
        };
    }
    
    // Logout mock
    if (url.includes('/auth/logout/') && options.method === 'POST') {
        return {
            ok: true,
            json: async () => ({ message: "Sesión cerrada" })
        };
    }
    
    // User info mock
    if (url.includes('/auth/user/')) {
        // Por defecto, simular usuario no logueado
        return {
            ok: false,
            status: 401,
            json: async () => ({ error: "No autenticado" })
        };
    }
    
    // Médicos mock
    if (url.includes('/turnos/medicos/')) {
        return {
            ok: true,
            json: async () => MOCK_DATA.medicos
        };
    }
    
    // Turnos mock
    if (url.includes('/turnos/turnos/')) {
        if (options.method === 'POST') {
            // Crear nuevo turno
            const turnoData = JSON.parse(options.body);
            
            // Buscar el médico seleccionado por ID
            const medicoSeleccionado = MOCK_DATA.medicos.find(medico => medico.id == turnoData.medico);
            const nombreMedico = medicoSeleccionado 
                ? `Dr. ${medicoSeleccionado.nombre} ${medicoSeleccionado.apellido}`
                : "Médico No Encontrado";
            
            const nuevoTurno = {
                id: Date.now(),
                paciente_first_name: "Usuario",
                paciente_last_name: "Nuevo",
                medico_nombre: nombreMedico,
                especialidad: medicoSeleccionado ? medicoSeleccionado.especialidad : "General",
                fecha: turnoData.fecha,
                hora: turnoData.hora,
                direccion: medicoSeleccionado ? medicoSeleccionado.direccion : "Consultorio Principal",
                motivo: turnoData.motivo || "Consulta médica",
                estado: "pendiente",
                monto: 2000
            };
            MOCK_DATA.turnos.push(nuevoTurno);
            
            return {
                ok: true,
                json: async () => nuevoTurno
            };
        }
        
        return {
            ok: true,
            json: async () => MOCK_DATA.turnos
        };
    }
    
    // Pacientes mock (para admin)
    if (url.includes('/auth/') && !url.includes('/login/') && !url.includes('/register/') && !url.includes('/logout/') && !url.includes('/user/')) {
        return {
            ok: true,
            json: async () => MOCK_DATA.pacientes
        };
    }
    
    // Comprobante mock
    if (url.includes('/comprobante/')) {
        const turnoId = url.split('/').filter(Boolean).pop();
        const turno = MOCK_DATA.turnos.find(t => t.id == turnoId);
        
        if (turno) {
            return {
                ok: true,
                json: async () => ({
                    id: turno.id,
                    paciente_nombre: '${turno.paciente_first_name} ${turno.paciente_last_name}',
                    paciente_dni: turno.paciente_dni,
                    paciente_email: "paciente@example.com",
                    paciente_telefono: "+54 11 1234-5678",
                    medico_nombre: turno.medico_nombre,
                    especialidad: turno.especialidad,
                    fecha: turno.fecha,
                    hora: turno.hora,
                    direccion: turno.direccion,
                    monto: turno.monto,
                    estado_pago: turno.estado === 'pendiente' ? 'Pendiente' : 'Pagado',
                    fecha_pago: turno.fecha_pago || new Date().toISOString().split('T')[0],
                    id_transaccion: turno.id_transaccion || 'MP-${Date.now()}'
                })
            };
        }
    }
    
    // Para otras URLs, devolver error
    return {
        ok: false,
        status: 404,
        json: async () => ({ error: "Endpoint no mockeado: " + url })
    };
};

// Reemplazar fetch temporalmente para desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
        // EXCEPCIÓN: Usar API real para TODOS los endpoints de pagos
        if (typeof url === 'string' && (url.includes('/api/pagos/') || url.includes('pagos/') || url.includes('crear_pago_turno'))) {
            console.log('💳 Usando API REAL para pagos:', url);
            return originalFetch(url, options);
        }
        
        // EXCEPCIÓN: Usar API real para MercadoPago
        if (typeof url === 'string' && url.includes('mercadopago.com')) {
            console.log('💳 Usando API REAL para MercadoPago:', url);
            return originalFetch(url, options);
        }
        
        // Si es una API que queremos mockear, usar mockFetch
        if (typeof url === 'string' && url.includes('/api/')) {
            console.log('🔧 Usando mock para:', url);
            return mockFetch(url, options);
        }
        // Si no, usar fetch original
        return originalFetch(url, options);
    };
}

console.log('✅ Datos de prueba cargados - MOCK_DATA disponible (API REAL para pagos)');