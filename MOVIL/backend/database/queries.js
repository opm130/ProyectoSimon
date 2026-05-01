const { db } = require('./connection');

// Vehicles
const vehicleQueries = {
  getAll: () => {
    return db.prepare(`
      SELECT 
        id,
        name,
        status,
        speed,
        fuel_level as fuelLevel,
        temperature,
        mileage,
        latitude,
        longitude,
        address,
        last_update as lastUpdate
      FROM vehicles
    `).all();
  },

  getById: (id) => {
    return db.prepare(`
      SELECT 
        id,
        name,
        status,
        speed,
        fuel_level as fuelLevel,
        temperature,
        mileage,
        latitude,
        longitude,
        address,
        last_update as lastUpdate
      FROM vehicles 
      WHERE id = ?
    `).get(id);
  },

  updateSensorData: (id, data) => {
    return db.prepare(`
      UPDATE vehicles 
      SET speed = ?,
          fuel_level = ?,
          temperature = ?,
          latitude = ?,
          longitude = ?,
          last_update = ?
      WHERE id = ?
    `).run(
      data.speed,
      data.fuelLevel,
      data.temperature,
      data.latitude,
      data.longitude,
      new Date().toISOString(),
      id
    );
  }
};

// Alerts
const alertQueries = {
  getAll: () => {
    return db.prepare(`
      SELECT 
        id,
        vehicle_id as vehicleId,
        vehicle_name as vehicleName,
        type,
        severity,
        message,
        timestamp,
        read
      FROM alerts 
      ORDER BY timestamp DESC
    `).all();
  },

  create: (alert) => {
    return db.prepare(`
      INSERT INTO alerts (id, vehicle_id, vehicle_name, type, severity, message, timestamp, read)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      alert.id,
      alert.vehicleId,
      alert.vehicleName,
      alert.type,
      alert.severity,
      alert.message,
      alert.timestamp,
      0
    );
  },

  markAsRead: (id) => {
    return db.prepare(`
      UPDATE alerts 
      SET read = 1 
      WHERE id = ?
    `).run(id);
  }
};

// Users
const userQueries = {
  findByEmail: (email) => {
    return db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).get(email);
  },

  findById: (id) => {
    return db.prepare(`
      SELECT * FROM users WHERE id = ?
    `).get(id);
  }
};

// Stats
const statsQueries = {
  getFleetStats: () => {
    const total = db.prepare('SELECT COUNT(*) as count FROM vehicles').get();
    const active = db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'active'").get();
    const idle = db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'idle'").get();
    const maintenance = db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'maintenance'").get();
    const avgSpeed = db.prepare('SELECT AVG(speed) as avg FROM vehicles').get();
    const avgFuel = db.prepare('SELECT AVG(fuel_level) as avg FROM vehicles').get();

    return {
      total: total.count,
      active: active.count,
      idle: idle.count,
      maintenance: maintenance.count,
      avgSpeed: avgSpeed.avg || 0,
      avgFuel: avgFuel.avg || 0
    };
  },

  getFuelHistory: () => {
    return db.prepare(`
      SELECT level, timestamp 
      FROM fuel_history 
      ORDER BY timestamp ASC
    `).all();
  }
};

module.exports = {
  vehicleQueries,
  alertQueries,
  userQueries,
  statsQueries
};