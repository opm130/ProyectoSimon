/**
 * WebSocket Service para React Native
 */

let ws = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectInterval = 3000;
let isConnecting = false;

const WS_URL = __DEV__
  ? 'ws://192.168.0.101:3001'
  : 'wss://api.simonfleet.com';

export function connectWebSocket() {
  if (isConnecting) {
    console.log('⚠️ WebSocket connection already in progress');
    return;
  }

  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    console.log('⚠️ WebSocket already connected');
    return;
  }

  isConnecting = true;
  console.log('🔌 Connecting to WebSocket:', WS_URL);

  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      reconnectAttempts = 0;
      isConnecting = false;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WebSocket message:', data.type);

        switch (data.type) {
          case 'CONNECTION_ACK':
            console.log('✅ Connection confirmed. ID:', data.clientId);
            break;

          case 'NEW_ALERT':
            console.log('🔔 New alert:', data.payload);
            // Disparar evento global
            if (global.eventEmitter) {
              global.eventEmitter.emit('new-alert', data.payload);
            }
            break;

          case 'VEHICLE_UPDATE':
            console.log('🚛 Vehicle update:', data.payload);
            if (global.eventEmitter) {
              global.eventEmitter.emit('vehicle-update', data.payload);
            }
            break;

          case 'STATS_UPDATE':
            if (global.eventEmitter) {
              global.eventEmitter.emit('stats-update', data.payload);
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error.message);
      isConnecting = false;
    };

    ws.onclose = (event) => {
      console.log('🔌 WebSocket closed. Code:', event.code);
      isConnecting = false;

      // Auto-reconexión
      if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`🔄 Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`);
        setTimeout(connectWebSocket, reconnectInterval);
      }
    };
  } catch (error) {
    console.error('❌ Error creating WebSocket:', error);
    isConnecting = false;
  }
}

export function disconnectWebSocket() {
  if (ws) {
    console.log('🔌 Disconnecting WebSocket');
    ws.close(1000); // Normal closure
    ws = null;
  }
  isConnecting = false;
}

export function getWebSocketState() {
  if (!ws) return 'NOT_INITIALIZED';

  switch (ws.readyState) {
    case WebSocket.CONNECTING:
      return 'CONNECTING';
    case WebSocket.OPEN:
      return 'OPEN';
    case WebSocket.CLOSING:
      return 'CLOSING';
    case WebSocket.CLOSED:
      return 'CLOSED';
    default:
      return 'UNKNOWN';
  }
}

export function isWebSocketConnected() {
  return ws && ws.readyState === WebSocket.OPEN;
}
