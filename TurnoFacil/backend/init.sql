-- Initialize database with some basic settings
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'America/Argentina/Buenos_Aires';

-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_turnos_fecha_hora ON turnos(fecha, hora);
CREATE INDEX IF NOT EXISTS idx_turnos_paciente_estado ON turnos(paciente_id, estado);
CREATE INDEX IF NOT EXISTS idx_turnos_medico_fecha ON turnos(medico_id, fecha);
CREATE INDEX IF NOT EXISTS idx_pacientes_dni ON pacientes(dni);
CREATE INDEX IF NOT EXISTS idx_medicos_especialidad ON medicos(especialidad);