let ws = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectInterval = 3000;
let isConnecting = false; // ← Flag para evitar múltiples conexiones

export function connectWebSocket() {
  if (isConnecting) {
    console.log('⚠️ Ya hay una conexión en progreso...');
    return;
  }

  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    console.log('⚠️ WebSocket ya está conectado o conectando');
    return;
  }

  isConnecting = true; 
  const url = 'ws://localhost:3001';
  console.log('🔌 Conectando a:', url);

  try {
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('✅ WebSocket CONECTADO');
      reconnectAttempts = 0;
      isConnecting = false; 
    };

    ws.onmessage = (event) => {
      console.log('📨 Mensaje recibido:', event.data);
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'CONNECTION_ACK') {
          console.log('✅ Conexión confirmada. ID:', data.clientId);
        }
        
        if (data.type === 'NEW_ALERT') {
          console.log('🔔 NUEVA ALERTA:', data.payload);
          window.dispatchEvent(new CustomEvent('new-alert', { detail: data.payload }));
        }

        if (data.type === 'VEHICLE_UPDATE') {
          console.log('🚛 Actualización de vehículo:', data.payload);
          window.dispatchEvent(new CustomEvent('vehicle-update', { detail: data.payload }));
        }
      } catch (error) {
        console.error('Error parseando mensaje:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ Error WebSocket:', error);
      isConnecting = false; 
    };

    ws.onclose = (event) => {
      console.log('🔌 WebSocket cerrado. Code:', event.code);
      isConnecting = false; 
      
      if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`🔄 Reintentando conexión (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(connectWebSocket, reconnectInterval);
      }
    };

  } catch (error) {
    console.error('❌ Error creando WebSocket:', error);
    isConnecting = false;
  }
}

export function disconnectWebSocket() {
  if (ws) {
    console.log('🔌 Desconectando WebSocket');
    ws.close();
    ws = null;
  }
}

export function getWebSocketState() {
  if (!ws) return 'NO_INITIALIZED';
  
  switch (ws.readyState) {
    case WebSocket.CONNECTING: return 'CONNECTING';
    case WebSocket.OPEN: return 'OPEN';
    case WebSocket.CLOSING: return 'CLOSING';
    case WebSocket.CLOSED: return 'CLOSED';
    default: return 'UNKNOWN';
  }
}