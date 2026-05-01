const { db, initializeSchema } = require('./connection');

function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Inicializar esquema
  initializeSchema();

  // Verificar si ya hay datos
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count > 0) {
    console.log('⚠️  Database already seeded. Skipping...');
    return;
  }

  // Insertar usuarios
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password, name, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  const users = [
    ['user_001', 'admin@simon.com', 'admin123', 'Admin User', 'admin'],
    ['user_002', 'user@simon.com', 'user123', 'Regular User', 'user']
  ];

  for (const user of users) {
    insertUser.run(...user);
  }

  console.log('✅ Users inserted');

  // Insertar vehículos CON COORDENADAS
  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (id, name, status, speed, fuel_level, temperature, mileage, latitude, longitude, address, last_update)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const vehicles = [
    ['VEH001', 'Camión 1', 'active', 45, 75, 22, 45230, 4.7110, -74.0721, 'Carrera 7 #32-16, Bogotá', new Date().toISOString()],
    ['VEH002', 'Camión 2', 'active', 60, 85, 20, 32100, 4.6533, -74.0836, 'Avenida Jiménez, Bogotá', new Date().toISOString()],
    ['VEH003', 'Camión 3', 'idle', 0, 45, 25, 67890, 4.6097, -74.0817, 'Autopista Norte, Bogotá', new Date().toISOString()],
    ['VEH004', 'Camión 4', 'active', 55, 90, 21, 28900, 4.7481, -74.0317, 'Calle 127, Bogotá', new Date().toISOString()],
    ['VEH005', 'Camión 5', 'maintenance', 0, 30, 18, 89000, 4.6682, -74.0548, 'Avenida Caracas, Bogotá', new Date().toISOString()],
    ['DEV-12345-XC54', 'Camión Demo', 'active', 35, 65, 23, 52000, 4.7250, -74.0580, 'Calle 100, Bogotá', new Date().toISOString()]
  ];

  for (const vehicle of vehicles) {
    insertVehicle.run(...vehicle);
  }

  console.log('✅ Vehicles inserted with GPS coordinates');

  // Insertar alertas
  const insertAlert = db.prepare(`
    INSERT INTO alerts (id, vehicle_id, vehicle_name, type, severity, message, timestamp, read)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const alerts = [
    ['alert_001', 'VEH003', 'Camión 3', 'fuel', 'warning', 'Nivel de combustible bajo (45%)', new Date().toISOString(), 0],
    ['alert_002', 'VEH005', 'Camión 5', 'fuel', 'critical', 'Combustible crítico (30%) - menos de 1 hora de autonomía', new Date().toISOString(), 0],
    ['alert_003', 'VEH005', 'Camión 5', 'maintenance', 'warning', 'Mantenimiento programado requerido', new Date().toISOString(), 0],
    ['alert_004', 'VEH001', 'Camión 1', 'predictive', 'info', 'Patrón de consumo detectado: reabastecimiento recomendado en 6 horas', new Date().toISOString(), 1]
  ];

  for (const alert of alerts) {
    insertAlert.run(...alert);
  }

  console.log('✅ Alerts inserted');

  // Insertar histórico de combustible (últimos 7 días)
  const insertFuelHistory = db.prepare(`
    INSERT INTO fuel_history (level, timestamp)
    VALUES (?, ?)
  `);

  const now = new Date();
  const fuelHistory = [
    [75, new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString()],
    [68, new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()],
    [62, new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()],
    [55, new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()],
    [48, new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()],
    [42, new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()],
    [38, now.toISOString()]
  ];

  for (const entry of fuelHistory) {
    insertFuelHistory.run(...entry);
  }

  console.log('✅ Fuel history inserted');

  // Insertar datos de sensores
  const insertSensorData = db.prepare(`
    INSERT INTO sensor_data (vehicle_id, speed, fuel_level, temperature, latitude, longitude, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const vehicle of vehicles) {
    const [id, , , speed, fuel, temp, , lat, lon] = vehicle;
    insertSensorData.run(id, speed, fuel, temp, lat, lon, new Date().toISOString());
  }

  console.log('✅ Sensor data inserted');
  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('📧 Admin: admin@simon.com / admin123');
  console.log('📧 User: user@simon.com / user123');
  console.log('🚛 Vehicles: 6 vehicles with GPS coordinates (Bogotá)');
  console.log('🚨 Alerts: 4 sample alerts');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
  process.exit(0);
}

module.exports = { seedDatabase };