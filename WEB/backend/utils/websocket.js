const WebSocket = require('ws');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      // Aceptar conexiones de cualquier origen en desarrollo
      verifyClient: (info) => {
        // En producción, verificar origen aquí
        return true;
      }
    });
    this.clients = new Map(); // Map de clientId -> ws connection
    
    this.wss.on('connection', (ws, req) => {
      console.log('🔌 New WebSocket connection from:', req.headers.origin || 'unknown');
      
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      ws.send(JSON.stringify({
        type: 'CONNECTION_ACK',
        clientId,
        timestamp: new Date().toISOString()
      }));

      console.log(`✅ Client ${clientId} connected. Total clients: ${this.clients.size}`);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(clientId, data);
        } catch (error) {
          console.error('Invalid WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log(`🔌 Client ${clientId} disconnected`);
        this.clients.delete(clientId);
        console.log(`   Total clients remaining: ${this.clients.size}`);
      });

      ws.on('error', (error) => {
        console.error(`❌ WebSocket error for ${clientId}:`, error.message);
        console.error('   Error details:', {
          code: error.code,
          errno: error.errno,
          syscall: error.syscall
        });
      });
    });

    console.log('✅ WebSocket server initialized');
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  handleClientMessage(clientId, data) {
    console.log(`📨 Message from ${clientId}:`, data.type);

    switch (data.type) {
      case 'PING':
        this.sendToClient(clientId, { type: 'PONG', timestamp: new Date().toISOString() });
        break;
      
      case 'SUBSCRIBE':
        console.log(`✅ Client ${clientId} subscribed to ${data.channel}`);
        break;
      
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  sendToClient(clientId, data) {
    const ws = this.clients.get(clientId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    let sentCount = 0;

    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        sentCount++;
      }
    });

    console.log(`📡 Broadcast sent to ${sentCount} clients`);
  }

  broadcastVehicleUpdate(vehicle) {
    this.broadcast({
      type: 'VEHICLE_UPDATE',
      payload: vehicle,
      timestamp: new Date().toISOString()
    });
  }

  broadcastNewAlert(alert) {
    this.broadcast({
      type: 'NEW_ALERT',
      payload: alert,
      timestamp: new Date().toISOString()
    });
  }

  broadcastStatsUpdate(stats) {
    this.broadcast({
      type: 'STATS_UPDATE',
      payload: stats,
      timestamp: new Date().toISOString()
    });
  }
  getConnectedClients() {
    return this.clients.size;
  }
}

module.exports = WebSocketServer;