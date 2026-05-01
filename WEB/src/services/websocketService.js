class WebSocketService {
  constructor() {
    this.ws = null;
    this.clientId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000; // 3 segundos
    this.listeners = new Map(); // Tipo de evento -> array de callbacks
  }

  /**
   * Conectar al servidor WebSocket
   */
  connect() {
    
    const wsUrl = 'ws://localhost:3001';

    console.log('🔌 Connecting to WebSocket:', wsUrl);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('❌ WebSocket message parse error:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        console.error('Error details:', {
          readyState: this.ws?.readyState,
          url: wsUrl,
          timestamp: new Date().toISOString()
        });
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Manejar mensajes recibidos
   */
  handleMessage(data) {
    console.log('📨 WebSocket message:', data.type);

    switch (data.type) {
      case 'CONNECTION_ACK':
        this.clientId = data.clientId;
        console.log('✅ Connection acknowledged. Client ID:', this.clientId);
        break;

      case 'VEHICLE_UPDATE':
        this.emit('vehicle_update', data.payload);
        break;

      case 'NEW_ALERT':
        this.emit('new_alert', data.payload);
        break;

      case 'STATS_UPDATE':
        this.emit('stats_update', data.payload);
        break;

      case 'PONG':
        break;

      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  /**
   * Enviar mensaje al servidor
   */
  send(type, payload = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected');
    }
  }

  ping() {
    this.send('PING');
  }

  subscribe(channel) {
    this.send('SUBSCRIBE', { channel });
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const listeners = this.listeners.get(eventType);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Desconectar
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

const wsService = new WebSocketService();

export default wsService;