const { db } = require('./connection');
// Users
const userQueries = {
  findByEmail: (email) => {
    console.log('🔍 Query findByEmail with:', email);
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      const result = stmt.get(email);
      console.log('📊 Query result:', result);
      return result;
    } catch (error) {
      console.error('❌ Query error:', error);
      throw error;
    }
  },
  findById: (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id),
  create: (id, email, password, name, role) => 
    db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(id, email, password, name, role),
};

// VEHICLES

const vehicleQueries = {
  getAll: () => db.prepare('SELECT * FROM vehicles ORDER BY name').all(),
  
  getById: (id) => db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id),
  
  getByStatus: (status) => db.prepare('SELECT * FROM vehicles WHERE status = ? ORDER BY name').all(status),
  
  updateLocation: (latitude, longitude, address, id) => 
    db.prepare(`
      UPDATE vehicles 
      SET latitude = ?, longitude = ?, address = ?, last_update = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(latitude, longitude, address, id),
  
  updateSensorData: (speed, fuelLevel, temperature, id) => 
    db.prepare(`
      UPDATE vehicles 
      SET speed = ?, fuel_level = ?, temperature = ?, last_update = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(speed, fuelLevel, temperature, id),
  
  getStats: () => db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'idle' THEN 1 ELSE 0 END) as idle,
      SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
      AVG(speed) as avg_speed,
      AVG(fuel_level) as avg_fuel
    FROM vehicles
  `).get(),
};

//ALERTS
 
const alertQueries = {
  getAll: () => db.prepare('SELECT * FROM alerts ORDER BY timestamp DESC').all(),
  
  getUnread: () => db.prepare('SELECT * FROM alerts WHERE read = 0 ORDER BY timestamp DESC').all(),
  
  getBySeverity: (severity) => db.prepare('SELECT * FROM alerts WHERE severity = ? ORDER BY timestamp DESC').all(severity),
  
  getByVehicle: (vehicleId) => db.prepare('SELECT * FROM alerts WHERE vehicle_id = ? ORDER BY timestamp DESC').all(vehicleId),
  
  create: (id, vehicleId, vehicleName, type, severity, message, timestamp) => 
    db.prepare(`
      INSERT INTO alerts (id, vehicle_id, vehicle_name, type, severity, message, timestamp, read)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `).run(id, vehicleId, vehicleName, type, severity, message, timestamp),
  
  markAsRead: (id) => db.prepare('UPDATE alerts SET read = 1 WHERE id = ?').run(id),
  
  markAllAsRead: () => db.prepare('UPDATE alerts SET read = 1').run(),
  
  delete: (id) => db.prepare('DELETE FROM alerts WHERE id = ?').run(id),
};

//SENSOR DATA
 
const sensorQueries = {
  create: (vehicleId, speed, fuelLevel, temperature, latitude, longitude, timestamp) => 
    db.prepare(`
      INSERT INTO sensor_data (vehicle_id, speed, fuel_level, temperature, latitude, longitude, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(vehicleId, speed, fuelLevel, temperature, latitude, longitude, timestamp),
  
  getByVehicle: (vehicleId, limit) => 
    db.prepare(`
      SELECT * FROM sensor_data 
      WHERE vehicle_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(vehicleId, limit),
  
  getRecent: () => db.prepare(`
    SELECT * FROM sensor_data 
    WHERE timestamp > datetime('now', '-24 hours')
    ORDER BY timestamp DESC
  `).all(),
};

// FUEL HISTORY
const fuelQueries = {
  getHistory: (limit) => db.prepare(`
    SELECT * FROM fuel_history 
    ORDER BY timestamp DESC 
    LIMIT ?
  `).all(limit),
  
  create: (vehicleId, level, timestamp) => 
    db.prepare(`
      INSERT INTO fuel_history (vehicle_id, level, timestamp)
      VALUES (?, ?, ?)
    `).run(vehicleId, level, timestamp),
  
  getByVehicle: (vehicleId, limit) => 
    db.prepare(`
      SELECT * FROM fuel_history 
      WHERE vehicle_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(vehicleId, limit),
};

module.exports = {
  userQueries,
  vehicleQueries,
  alertQueries,
  sensorQueries,
  fuelQueries,
};