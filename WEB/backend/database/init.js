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

  // Insertar vehículos
  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (id, name, status, speed, fuel_level, temperature, mileage, latitude, longitude, address, last_update)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const vehicles = [
    ['DEV-12345-XC54', 'Camión 1', 'active', 45, 38, 75, 45230, 4.7110, -74.0721, 'Carrera 7 #32-16, Bogotá', '2024-04-29T19:00:00Z'],
    ['DEV-67890-AB12', 'Van 2', 'idle', 0, 55, 68, 32100, 4.7095, -74.0760, 'Avenida Jiménez, Bogotá', '2024-04-29T19:00:00Z'],
    ['DEV-11223-YZ89', 'Camión 3', 'active', 60, 15, 82, 67890, 4.7489, -74.0628, 'Autopista Norte, Bogotá', '2024-04-29T19:00:00Z'],
    ['DEV-44556-QW34', 'Van 4', 'maintenance', 0, 70, 65, 28900, 4.7123, -74.0345, 'Calle 127, Bogotá', '2024-04-29T19:00:00Z'],
    ['DEV-77889-ER56', 'Camión 5', 'active', 35, 42, 71, 51200, 4.6678, -74.0567, 'Avenida Caracas, Bogotá', '2024-04-29T19:00:00Z']
  ];

  for (const vehicle of vehicles) {
    insertVehicle.run(...vehicle);
  }

  console.log('✅ Vehicles inserted');

  // Insertar alertas
  const insertAlert = db.prepare(`
    INSERT INTO alerts (id, vehicle_id, vehicle_name, type, severity, message, timestamp, read)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const alerts = [
    ['alert_001', 'DEV-11223-YZ89', 'Camión 3', 'fuel', 'critical', 'Combustible crítico. Autonomía: 0.8 horas', '2024-04-29T18:45:00Z', 0],
    ['alert_002', 'DEV-11223-YZ89', 'Camión 3', 'temperature', 'warning', 'Temperatura elevada: 82°C', '2024-04-29T18:30:00Z', 0],
    ['alert_003', 'DEV-44556-QW34', 'Van 4', 'maintenance', 'warning', 'Mantenimiento programado vence en 2 días', '2024-04-29T17:00:00Z', 0],
    ['alert_004', 'DEV-12345-XC54', 'Camión 1', 'predictive', 'info', 'Patrón de consumo detectado: reabastecimiento recomendado en 6 horas', '2024-04-29T16:00:00Z', 1]
  ];

  for (const alert of alerts) {
    insertAlert.run(...alert);
  }

  console.log('✅ Alerts inserted');

  // Insertar histórico de combustible
  const insertFuelHistory = db.prepare(`
    INSERT INTO fuel_history (level, timestamp)
    VALUES (?, ?)
  `);

  const fuelHistory = [
    [75, '2024-04-22T12:00:00Z'],
    [68, '2024-04-23T12:00:00Z'],
    [62, '2024-04-24T12:00:00Z'],
    [55, '2024-04-25T12:00:00Z'],
    [48, '2024-04-26T12:00:00Z'],
    [42, '2024-04-27T12:00:00Z'],
    [38, '2024-04-28T12:00:00Z']
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
    insertSensorData.run(id, speed, fuel, temp, lat, lon, '2024-04-29T19:00:00Z');
  }

  console.log('✅ Sensor data inserted');
  console.log('🎉 Database seeded successfully!');
}


if (require.main === module) {
  seedDatabase();
  process.exit(0);
}

module.exports = { seedDatabase };