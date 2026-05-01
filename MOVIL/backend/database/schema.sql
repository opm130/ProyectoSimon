-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'idle', 'maintenance')),
  speed REAL DEFAULT 0,
  fuel_level REAL DEFAULT 0,
  temperature REAL DEFAULT 0,
  mileage INTEGER DEFAULT 0,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT NOT NULL,
  last_update DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de alertas
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  vehicle_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('fuel', 'temperature', 'maintenance', 'predictive', 'speed')),
  severity TEXT NOT NULL CHECK(severity IN ('critical', 'warning', 'info')),
  message TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT 0,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- Tabla de datos de sensores (histórico)
CREATE TABLE IF NOT EXISTS sensor_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT NOT NULL,
  speed REAL,
  fuel_level REAL,
  temperature REAL,
  latitude REAL,
  longitude REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- Tabla de histórico de combustible
CREATE TABLE IF NOT EXISTS fuel_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id TEXT,
  level REAL NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_alerts_vehicle_id ON alerts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read);
CREATE INDEX IF NOT EXISTS idx_sensor_data_vehicle_id ON sensor_data(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_fuel_history_timestamp ON fuel_history(timestamp);