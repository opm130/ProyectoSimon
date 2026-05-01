# Guía de Instalación y Configuración

## Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación](#instalación)
3. [Configuración](#configuración)
4. [Ejecución](#ejecución)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Despliegue](#despliegue)

---

## Requisitos del Sistema

### Software Obligatorio

- **Node.js:** >= 18.0.0 (LTS recomendado)
- **npm:** >= 9.0.0 (incluido con Node.js)
- **Git:** >= 2.30.0 (para clonar repositorio)

### Software Opcional

- **Postman/Thunder Client:** Para probar API manualmente
- **SQLite Browser:** Para inspeccionar base de datos

### Navegadores Soportados

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14

### Sistema Operativo

- Windows 10/11
- macOS 11+
- Linux (Ubuntu 20.04+, Debian 11+)

---

## Instalación

### 1. Clonar Repositorio

```bash
git clone <repository-url>
cd SimonProject
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

**Dependencias instaladas:**
- express: Framework web
- better-sqlite3: Driver SQLite
- cors: Cross-Origin Resource Sharing
- dotenv: Variables de entorno

**Dependencias de desarrollo:**
- nodemon: Auto-reload en desarrollo
- jest: Framework de testing
- supertest: HTTP assertions

### 3. Instalar Dependencias del Frontend

```bash
cd ..
npm install
```

**Dependencias principales:**
- react: Librería UI
- react-router-dom: Routing
- zustand: State management
- axios: HTTP client
- leaflet: Mapas
- recharts: Gráficos

**Dependencias de desarrollo:**
- vite: Build tool
- vitest: Testing framework
- @testing-library/react: Testing utilities
- eslint: Linter

---

## Configuración

### Backend

#### 1. Variables de Entorno

Crear archivo `backend/.env`:

```env
PORT=3001
JWT_SECRET=simon_fleet_secret_key_2024
NODE_ENV=development
```

**Descripción de variables:**

- `PORT`: Puerto del servidor (default: 3001)
- `JWT_SECRET`: Clave secreta para firmar JWT (CAMBIAR en producción)
- `NODE_ENV`: Entorno de ejecución (development/production)

**IMPORTANTE:** Nunca commitear `.env` con secretos reales.

#### 2. Base de Datos

La base de datos SQLite se inicializa automáticamente al arrancar el servidor.

**Ubicación:** `backend/database/fleet.db`

**Inicialización manual (opcional):**

```bash
cd backend
node database/init.js
```

Esto crea:
- 5 tablas (users, vehicles, alerts, sensor_data, fuel_history)
- 2 usuarios (admin, user regular)
- 5 vehículos
- 4 alertas
- Datos históricos de combustible

**Resetear base de datos:**

```bash
rm database/fleet.db
node database/init.js
```

### Frontend

#### 1. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001/api
```

**Descripción:**

- `VITE_API_URL`: URL base del backend

**Nota:** Variables en Vite deben tener prefijo `VITE_`.

#### 2. Configuración de Mapas

El proyecto usa OpenStreetMap (gratuito). No requiere API key.

Para cambiar el proveedor de tiles, editar `src/features/map/pages/MapPage.jsx`:

```javascript
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // Cambiar URL para otro proveedor
/>
```

---

## Ejecución

### Modo Desarrollo

#### 1. Iniciar Backend

```bash
cd backend
npm run dev
```

**Salida esperada:**
```
✅ SQLite database connected: ...
✅ Database schema initialized
✅ Database ready

╔════════════════════════════════════════╗
║  Simon Fleet Monitor API               ║
║  Server running on port 3001           ║
║  http://localhost:3001/api             ║
╚════════════════════════════════════════╝
```

**El servidor está listo cuando ves el cuadro ASCII.**

#### 2. Iniciar Frontend (en otra terminal)

```bash
cd SimonProject
npm run dev
```

**Salida esperada:**
```
  VITE v5.4.2  ready in 324 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### 3. Acceder a la Aplicación

Abrir navegador en: **http://localhost:5173**

**Credenciales de prueba:**

Admin:
- Email: `admin@simon.com`
- Password: `admin123`

Usuario:
- Email: `user@simon.com`
- Password: `user123`

### Modo Producción

#### Build del Frontend

```bash
npm run build
```

Genera carpeta `dist/` con archivos estáticos optimizados.

#### Servir Build

```bash
npm run preview
```

O usar servidor web (nginx, Apache):

```nginx
# nginx.conf
server {
  listen 80;
  root /path/to/SimonProject/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://localhost:3001;
  }
}
```

#### Backend en Producción

```bash
cd backend
npm start
```

Recomendación: Usar PM2 para gestión de procesos:

```bash
npm install -g pm2
pm2 start server.js --name simon-fleet-api
pm2 save
pm2 startup
```

---

## Testing

### Backend

#### Ejecutar Todos los Tests

```bash
cd backend
npm test
```

#### Tests en Modo Watch

```bash
npm run test:watch
```

Útil durante desarrollo. Re-ejecuta tests al guardar cambios.

#### Tests con Cobertura

```bash
npm run test:coverage
```

Genera reporte HTML en `coverage/`.

**Archivos de test:**
- `tests/fuel.test.js`: Cálculo de autonomía
- `tests/jwt.test.js`: JWT manual
- `tests/api.integration.test.js`: Endpoints completos

### Frontend

#### Ejecutar Tests

```bash
npm test
```

#### Modo Watch

```bash
npm run test:watch
```

**Archivos de test:**
- `src/tests/maskDeviceId.test.js`: Enmascaramiento IDs
- Componentes adicionales detectados automáticamente

---

## Troubleshooting

### Problemas Comunes

#### 1. "Cannot find module 'better-sqlite3'"

**Causa:** Dependencias no instaladas.

**Solución:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

#### 2. "Port 3001 already in use"

**Causa:** Otro proceso usa el puerto.

**Solución en Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Solución en macOS/Linux:**
```bash
lsof -ti:3001 | xargs kill
```

O cambiar puerto en `backend/.env`:
```env
PORT=3002
```

#### 3. "CORS error" en el frontend

**Causa:** Backend no configurado para CORS.

**Verificar en `backend/server.js`:**
```javascript
app.use(cors()); // Debe estar presente
```

#### 4. Base de datos bloqueada

**Causa:** SQLite no puede escribir (múltiples procesos).

**Solución:**
```bash
cd backend
rm database/fleet.db
npm run dev  # Se recrea automáticamente
```

#### 5. "Vite: Cannot find module leaflet"

**Causa:** CSS de Leaflet no importado correctamente.

**Verificar en `src/main.jsx`:**
```javascript
import 'leaflet/dist/leaflet.css';
```

#### 6. Mapa no renderiza

**Causa:** Contenedor sin altura definida.

**Verificar en CSS:**
```css
.map-container {
  height: 600px; /* Debe tener altura explícita */
}
```

### Logs y Debugging

#### Backend

Logs en consola muestran:
- Todas las queries SQL ejecutadas
- Requests HTTP con timestamp
- Errores con stack trace

**Nivel de log:** Modificar en `database/connection.js`:
```javascript
const db = new Database(DB_PATH, { 
  verbose: console.log // Remover para silenciar queries
});
```

#### Frontend

**React DevTools:** Chrome extension para inspeccionar componentes.

**Console logs:** 
- Errores de red en tab Network
- State changes en Zustand DevTools

### Verificar Instalación

#### Health Check del Backend

```bash
curl http://localhost:3001/api/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-04-30T12:00:00.000Z",
  "message": "Simon Fleet Monitor API - Running"
}
```

#### Verificar Base de Datos

```bash
cd backend
sqlite3 database/fleet.db "SELECT COUNT(*) FROM users;"
```

**Resultado esperado:** `2` (admin + user)

---

## Despliegue

### Opciones de Hosting

#### Frontend

**Recomendaciones:**
- Vercel (gratis, zero-config)
- Netlify (gratis, CI/CD integrado)
- AWS S3 + CloudFront
- GitHub Pages

**Ejemplo Vercel:**
```bash
npm install -g vercel
vercel --prod
```

#### Backend

**Recomendaciones:**
- Railway.app (gratis, soporta SQLite)
- Render.com (gratis con limitaciones)
- Heroku (gratis tier deprecado)
- VPS (DigitalOcean, Linode)

**Ejemplo Railway:**
```bash
npm install -g railway
railway login
railway init
railway up
```

### Consideraciones de Producción

#### Seguridad

1. **Cambiar JWT_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

2. **Habilitar HTTPS:**
   - Usar certificado SSL (Let's Encrypt gratis)
   - Forzar HTTPS en nginx/Apache

3. **Variables de entorno seguras:**
   - Usar secrets manager del proveedor
   - Nunca hardcodear secrets

#### Performance

1. **Comprimir assets:**
   ```javascript
   // Vite lo hace automáticamente en build
   npm run build
   ```

2. **Cacheo:**
   ```nginx
   location /static {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

3. **CDN:** Usar CloudFlare para assets estáticos.

#### Monitoreo

1. **Logs:** Centralizar con Papertrail/Loggly
2. **Uptime:** UptimeRobot (gratis)
3. **Errors:** Sentry para tracking de excepciones

---

## Comandos Útiles

### Desarrollo

```bash
# Backend
cd backend
npm run dev        # Iniciar con auto-reload
npm run seed       # Resetear base de datos
npm test           # Ejecutar tests

# Frontend
npm run dev        # Desarrollo
npm run build      # Build producción
npm run preview    # Preview del build
npm test           # Tests
npm run lint       # Verificar código
```

### Producción

```bash
# Iniciar ambos servicios
npm start          # Frontend (dist/)
cd backend && npm start  # Backend

# Con PM2
pm2 start ecosystem.config.js
```

### Mantenimiento

```bash
# Actualizar dependencias
npm outdated       # Ver paquetes desactualizados
npm update         # Actualizar minor/patch versions

# Limpiar
rm -rf node_modules dist coverage
npm install
```

---

## Soporte

Para problemas no cubiertos en esta guía:

1. Verificar logs de consola
2. Revisar GitHub Issues del proyecto
3. Consultar documentación de dependencias:
   - React: https://react.dev
   - Express: https://expressjs.com
   - SQLite: https://sqlite.org/docs.html

---

**Última actualización:** 30 de abril de 2026