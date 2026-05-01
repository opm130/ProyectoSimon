const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const { seedDatabase } = require('./database/init');
const WebSocketServer = require('./utils/websocket');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const alertRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 3001;

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar WebSocket Server
const wsServer = new WebSocketServer(server);

app.set('wsServer', wsServer);

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Simon Fleet Monitor API - Running',
    websocket: {
      enabled: true,
      clients: wsServer.getConnectedClients()
    }
  });
});

// Error
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

console.log('🔧 Initializing database...');
try {
  seedDatabase();
  console.log('✅ Database ready');
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚛 Simon Fleet Monitor API           ║
║  Server running on port ${PORT}         ║
║  http://localhost:${PORT}/api          ║
║  WebSocket: ws://localhost:${PORT}     ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;