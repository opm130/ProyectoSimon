# Simon Fleet Monitor

Sistema de monitoreo IoT para gestión de flotas vehiculares con arquitectura offline-first.

## Descripción

Simon Fleet Monitor es una aplicación web full-stack diseñada para el monitoreo en tiempo real de flotas vehiculares. El sistema permite visualizar la ubicación, estado y métricas de vehículos, gestionar alertas predictivas y mantener operatividad completa en modo offline.

## Características Principales

### Monitoreo en Tiempo Real
- Dashboard con KPIs de la flota (total vehículos, activos, alertas críticas, velocidad promedio)
- Visualización de métricas: consumo de combustible, temperatura, velocidad, millaje
- Mapa interactivo con ubicación en tiempo real de todos los vehículos
- Gráficos de tendencias: consumo de combustible (7 días) y distribución de estados

### Gestión de Alertas
- Sistema de alertas con tres niveles de severidad: crítica, warning, info
- Alertas predictivas basadas en cálculo de autonomía de combustible
- Filtrado por severidad y estado de lectura
- **Notificaciones en tiempo real vía WebSockets**
- Actualización automática sin recargar página

### Arquitectura Offline-First
- Funcionalidad completa sin conexión a internet
- Cola de sincronización automática al recuperar conectividad
- Persistencia local de datos con Zustand persist
- Indicador visual de estado de conexión

### Seguridad
- Autenticación JWT implementada manualmente (sin librerías externas)
- Control de acceso basado en roles (admin/user)
- Enmascaramiento de IDs de dispositivos para usuarios no administradores
- Validación de tokens con firma HMAC SHA-256

## Stack Tecnológico

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.2
- **Routing:** React Router DOM 6.26.1
- **State Management:** Zustand 5.0.0 con middleware persist
- **HTTP Client:** Axios 1.7.7
- **Maps:** Leaflet 1.9.4 + React Leaflet 4.2.1
- **Charts:** Recharts 2.12.7
- **Styling:** CSS Modules

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.21.2
- **Database:** SQLite (better-sqlite3 11.8.1)
- **Authentication:** JWT manual (sin bcrypt, implementación propia)
- **WebSockets:** ws 8+ (actualizaciones en tiempo real)
- **CORS:** cors 2.8.5

### Testing
- **Backend:** Jest 29+ con Supertest
- **Frontend:** Vitest con Testing Library

## Arquitectura del Sistema

### Estructura del Proyecto

```
SimonProject/
├── backend/
│   ├── database/
│   │   ├── connection.js      # Configuración de SQLite
│   │   ├── schema.sql         # Definición de tablas
│   │   ├── init.js            # Seeding de datos
│   │   └── queries.js         # Queries reutilizables
│   ├── routes/
│   │   ├── auth.js            # Endpoints de autenticación
│   │   ├── vehicles.js        # Endpoints de vehículos
│   │   └── alerts.js          # Endpoints de alertas
│   ├── utils/
│   │   └── jwt.js             # Generación y validación JWT manual
│   ├── tests/
│   │   ├── fuel.test.js       # Tests de cálculo predictivo
│   │   ├── jwt.test.js        # Tests de JWT
│   │   └── api.integration.test.js
│   └── server.js              # Punto de entrada
├── src/
│   ├── features/
│   │   ├── auth/              # Módulo de autenticación
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── map/               # Mapa interactivo
│   │   ├── alerts/            # Gestión de alertas
│   │   └── fleet/             # Gestión de flota
│   ├── shared/
│   │   ├── components/        # Componentes reutilizables
│   │   └── utils/             # Utilidades y helpers
│   ├── services/
│   │   ├── api.js             # Cliente HTTP configurado
│   │   ├── authService.js     # Lógica de autenticación
│   │   └── offlineService.js  # Gestión de modo offline
│   ├── store/
│   │   ├── authStore.js       # Estado de autenticación
│   │   ├── fleetStore.js      # Estado de vehículos
│   │   └── alertStore.js      # Estado de alertas
│   └── router/
│       └── AppRouter.jsx      # Configuración de rutas
└── docs/
    ├── README.md              # Este archivo
    ├── DESIGN.md              # Decisiones de diseño
    ├── SETUP.md               # Guía de instalación
    └── TESTING.md             # Documentación de tests
```

### Base de Datos

#### Modelo de Datos

**users**
- id (TEXT, PK)
- email (TEXT, UNIQUE)
- password (TEXT)
- name (TEXT)
- role (TEXT: admin/user)
- created_at (DATETIME)

**vehicles**
- id (TEXT, PK)
- name (TEXT)
- status (TEXT: active/idle/maintenance)
- speed, fuel_level, temperature (REAL)
- mileage (INTEGER)
- latitude, longitude (REAL)
- address (TEXT)
- last_update (DATETIME)

**alerts**
- id (TEXT, PK)
- vehicle_id (TEXT, FK)
- vehicle_name (TEXT)
- type (TEXT: fuel/temperature/maintenance/predictive)
- severity (TEXT: critical/warning/info)
- message (TEXT)
- timestamp (DATETIME)
- read (BOOLEAN)

**sensor_data** (histórico)
- id (INTEGER, PK)
- vehicle_id (TEXT, FK)
- speed, fuel_level, temperature (REAL)
- latitude, longitude (REAL)
- timestamp (DATETIME)

**fuel_history**
- id (INTEGER, PK)
- vehicle_id (TEXT)
- level (REAL)
- timestamp (DATETIME)

## API Endpoints

### Autenticación
```
POST   /api/auth/login       # Iniciar sesión
POST   /api/auth/verify      # Verificar token
GET    /api/auth/me          # Obtener usuario actual
```

### Vehículos
```
GET    /api/vehicles                    # Listar todos los vehículos
GET    /api/vehicles/:id                # Obtener vehículo específico
GET    /api/vehicles/stats              # Estadísticas de la flota
POST   /api/vehicles/:id/sensor-data    # Ingesta de datos de sensores
GET    /api/vehicles/:id/sensor-history # Histórico de sensores
```

### Alertas
```
GET    /api/alerts                  # Listar alertas
POST   /api/alerts                  # Crear alerta
POST   /api/alerts/check-predictive # Verificar alertas predictivas
PATCH  /api/alerts/:id/read         # Marcar como leída
PATCH  /api/alerts/read-all         # Marcar todas como leídas
DELETE /api/alerts/:id              # Eliminar alerta
```

### Health Check
```
GET    /api/health                  # Estado del servidor
```

## Testing

El proyecto incluye 56 tests automatizados:

### Backend (24 tests)
- Cálculo de autonomía de combustible (5 tests)
- Validación JWT manual (8 tests)
- Integración de API (11 tests)

### Frontend (32 tests)
- Enmascaramiento de device IDs (8 tests)
- Componentes React (24 tests)

**Ejecutar tests:**
```bash
# Backend
cd backend && npm test

# Frontend
npm test
```

**Cobertura:**
```bash
# Backend con coverage
cd backend && npm run test:coverage
```

## Credenciales de Prueba

### Administrador
- Email: admin@simon.com
- Password: admin123
- Permisos: Acceso completo, visualización de IDs completos

### Usuario Regular
- Email: user@simon.com
- Password: user123
- Permisos: Acceso de lectura, IDs enmascarados

## Requisitos del Sistema

- Node.js >= 18.0.0
- npm >= 9.0.0
- Navegador moderno con soporte ES6+ (Chrome 90+, Firefox 88+, Safari 14+)

## Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/opm130/Proyecto_Simon.git
cd Proyecto_Simon

# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd ..
npm install
npm run dev
```

Abrir http://localhost:5173 en el navegador.

## Repositorio

GitHub: https://github.com/opm130/Proyecto_Simon.git

## Licencia

Proyecto académico - Simon Movilidad Technical Assessment

## Autor

Desarrollado como prueba técnica para el cargo de Desarrollador II en Simon Movilidad.