const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ruta 
const DB_PATH = path.join(__dirname, 'fleet.db');

// Crear conexión
const db = new Database(DB_PATH, { 
  verbose: console.log // Log de queries en desarrollo
});


db.pragma('foreign_keys = ON');

console.log(`✅ SQLite database connected: ${DB_PATH}`);

// Inicializar esquema 
function initializeSchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  

  db.exec(schema);
  
  console.log('✅ Database schema initialized');
}

// Cerrar base de datos al terminar proceso
process.on('exit', () => {
  db.close();
  console.log('🔒 Database connection closed');
});

process.on('SIGINT', () => {
  db.close();
  console.log('\n🔒 Database connection closed');
  process.exit(0);
});

module.exports = { db, initializeSchema };