# WebSockets - Guía de Implementación

## 📡 Resumen

Sistema de comunicación en tiempo real implementado con **WebSockets** (librería `ws`) que permite notificaciones instantáneas de nuevas alertas y actualizaciones de vehículos sin necesidad de recargar la página.

---

## 🎯 Características Implementadas

✅ Conexión bidireccional persistente  
✅ Broadcast a todos los clientes conectados  
✅ Auto-reconexión automática (máx 5 intentos)  
✅ Gestión de clientes con IDs únicos  
✅ Eventos tipados (NEW_ALERT, VEHICLE_UPDATE, etc.)  
✅ Actualización reactiva de UI  
✅ Cleanup apropiado al desmontar componentes  

---

## 📂 Archivos Involucrados

### Backend
- `backend/utils/websocket.js` - Clase WebSocketServer
- `backend/server.js` - Integración con Express
- `backend/routes/alerts.js` - Broadcast de nuevas alertas

### Frontend
- `src/services/websocketSimple.js` - Cliente WebSocket
- `src/App.jsx` - Conexión y listeners
- `src/main.jsx` - **IMPORTANTE:** Sin React.StrictMode

---

## 🔧 Instalación

### Dependencias

**Backend:**
```bash
cd backend
npm install ws
```

**Frontend:**
```bash
# No requiere dependencias adicionales
# WebSocket API es nativa del navegador
```

---

## 🚀 Uso

### Iniciar Servidores

**Backend (puerto 3001):**
```bash
cd backend
npm run dev
```

Deberías ver:
```
╔════════════════════════════════════════╗
║  🚛 Simon Fleet Monitor API           ║
║  Server running on port 3001          ║
║  http://localhost:3001/api            ║
║  WebSocket: ws://localhost:3001       ║
╚════════════════════════════════════════╝
✅ WebSocket server initialized
```

**Frontend (puerto 5173):**
```bash
npm run dev
```

---

## 🧪 Probar WebSockets

### 1. Verificar Conexión

Abre http://localhost:5173 y en la consola del navegador (F12) deberías ver:

```
✅ WebSocket CONECTADO
📨 Mensaje recibido: {"type":"CONNECTION_ACK","clientId":"client_...","timestamp":"..."}
✅ Conexión confirmada. ID: client_1234567890_abc123
```

### 2. Crear Alerta para Probar

**Con Thunder Client / Postman:**

**Paso 1 - Login:**
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@simon.com",
  "password": "admin123"
}
```

Copia el `token` de la respuesta.

**Paso 2 - Crear Alerta:**
```http
POST http://localhost:3001/api/alerts
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "vehicleId": "DEV-12345-XC54",
  "type": "temperature",
  "severity": "critical",
  "message": "🔥 PRUEBA WEBSOCKET EN TIEMPO REAL 🔥"
}
```

### 3. Verificar Recepción

**En la consola del navegador verás:**
```
📨 Mensaje recibido: {"type":"NEW_ALERT","payload":{...},"timestamp":"..."}
🔔 NUEVA ALERTA: {...}
```

**En el dashboard:**
La nueva alerta aparecerá **AUTOMÁTICAMENTE** sin recargar la página ✨

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────┐
│    CLIENTE (Navegador)              │
│                                     │
│  1. connectWebSocket()              │
│  2. ws.onmessage → CustomEvent      │
│  3. window.dispatchEvent()          │
│  4. App.jsx escucha evento          │
│  5. fetchAlerts() actualiza UI      │
│                                     │
└──────────────┬──────────────────────┘
               │ ws://localhost:3001
┌──────────────▼──────────────────────┐
│    SERVIDOR (Node.js)               │
│                                     │
│  1. POST /api/alerts                │
│  2. Guardar en BD                   │
│  3. wsServer.broadcastNewAlert()    │
│  4. Enviar a TODOS los clientes     │
│                                     │
└─────────────────────────────────────┘
```

---

## 📊 Tipos de Eventos

### Del Servidor al Cliente

| Tipo | Payload | Descripción |
|------|---------|-------------|
| `CONNECTION_ACK` | `{ clientId, timestamp }` | Confirmación de conexión exitosa |
| `NEW_ALERT` | `{ alerta completa }` | Nueva alerta creada |
| `VEHICLE_UPDATE` | `{ vehículo actualizado }` | Datos de vehículo actualizados |
| `STATS_UPDATE` | `{ estadísticas }` | Estadísticas globales actualizadas |

### Del Cliente al Servidor

| Tipo | Payload | Descripción |
|------|---------|-------------|
| `PING` | `{}` | Keep-alive |
| `SUBSCRIBE` | `{ channel }` | Suscribirse a canal específico |

---

## ⚠️ Troubleshooting

### Problema: WebSocket se desconecta inmediatamente

**Síntoma:**
```
🔌 New WebSocket connection
✅ Client connected. Total clients: 1
🔌 Client disconnected
   Total clients remaining: 0
```

**Causa:** React.StrictMode ejecuta useEffect dos veces en desarrollo.

**Solución:** En `src/main.jsx`, remover `<React.StrictMode>`:

```jsx
// ANTES
<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</React.StrictMode>

// DESPUÉS
<BrowserRouter>
  <App />
</BrowserRouter>
```

---

### Problema: No se reciben mensajes

**Síntoma:** Backend dice "broadcasted" pero frontend no recibe nada.

**Verificar:**
1. Que la consola del navegador muestre `✅ WebSocket CONECTADO`
2. Que `routes/alerts.js` llame a `wsServer.broadcastNewAlert()`
3. Que el backend muestre `📡 Broadcast sent to N clients`

---

### Problema: Múltiples conexiones del mismo cliente

**Síntoma:**
```
✅ Client_1 connected. Total clients: 1
✅ Client_2 connected. Total clients: 2
✅ Client_3 connected. Total clients: 3
```

**Causa:** useEffect sin array de dependencias o con dependencias que cambian.

**Solución:** En `App.jsx`, usar array vacío:

```javascript
useEffect(() => {
  connectWebSocket();
  // ...
}, []); // ← Array vacío = ejecutar solo al montar
```

---

## 📈 Monitoreo

### Ver Clientes Conectados

En la consola del backend verás:
```
✅ Client client_xxx connected. Total clients: 3
```

### Health Check

```http
GET http://localhost:3001/api/health
```

Respuesta incluye:
```json
{
  "status": "ok",
  "websocket": {
    "enabled": true,
    "clients": 3
  }
}
```

---

## 🔒 Consideraciones de Seguridad

### Producción

⚠️ **Cambiar a WSS (WebSocket Secure):**
```javascript
// Desarrollo
const url = 'ws://localhost:3001';

// Producción
const url = 'wss://api.tudominio.com';
```

⚠️ **Autenticar conexiones WebSocket:**
```javascript
// Enviar token al conectar
ws.send(JSON.stringify({ 
  type: 'AUTH', 
  token: localStorage.getItem('auth_token') 
}));
```

⚠️ **Validar origen (CORS para WebSockets):**
```javascript
this.wss = new WebSocket.Server({ 
  server,
  verifyClient: (info) => {
    const origin = info.origin;
    return allowedOrigins.includes(origin);
  }
});
```

---

## 🎯 Ventajas sobre Polling

| Aspecto | HTTP Polling | WebSockets |
|---------|--------------|------------|
| **Latencia** | 5-30 segundos | <100 milisegundos |
| **Overhead de red** | ~500 bytes/request | ~2 bytes/frame |
| **Requests/minuto** | 12-60 | 0 (1 conexión) |
| **Carga del servidor** | Alta | Baja |
| **Consumo de batería** | Alto | Bajo |
| **Escalabilidad** | Limitada | Excelente |

---

## 📚 Recursos Adicionales

- [Documentación oficial de ws](https://github.com/websockets/ws)
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [WebSocket Protocol RFC 6455](https://tools.ietf.org/html/rfc6455)

---

## ✅ Checklist de Implementación

- [x] Backend: Librería `ws` instalada
- [x] Backend: WebSocketServer creado en `utils/websocket.js`
- [x] Backend: Integrado con Express en `server.js`
- [x] Backend: Broadcast en `routes/alerts.js`
- [x] Frontend: Cliente en `services/websocketSimple.js`
- [x] Frontend: Conexión en `App.jsx`
- [x] Frontend: StrictMode removido de `main.jsx`
- [x] Tests: Conexión manual funciona
- [x] Tests: Broadcast de alertas funciona
- [x] Docs: README.md actualizado
- [x] Docs: DESIGN.md actualizado

---

**Estado:** ✅ **FUNCIONANDO COMPLETAMENTE**

**Fecha de implementación:** 30 de abril de 2026  
**Versión:** 1.0.0