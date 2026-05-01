# Guía de Instalación - Simon Fleet Monitor Mobile

Guía paso a paso para instalar y ejecutar la aplicación móvil en tu dispositivo.

## 📋 Requisitos Previos

### Desarrollo
- **Node.js**: v18 o superior ([Descargar](https://nodejs.org/))
- **npm**: v9 o superior (incluido con Node.js)
- **Git**: Para clonar el repositorio
- **Expo Go**: App en tu dispositivo móvil
  - [iOS](https://apps.apple.com/app/expo-go/id982107779)
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Sistema Operativo
- **Windows**: 10/11
- **macOS**: 12+
- **Linux**: Ubuntu 20.04+ o equivalente

---

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/simon-fleet-monitor.git
cd simon-fleet-monitor/SimonFleetNew
```

---

### 2. Instalar Dependencias

```bash
npm install
```

**Si aparecen errores de peer dependencies**:
```bash
npm install --legacy-peer-deps
```

---

### 3. Configurar Backend

El proyecto mobile usa el mismo backend que la versión web.

#### Opción A: Backend ya está corriendo
Si ya tienes el backend ejecutándose desde el proyecto web, salta al paso 4.

#### Opción B: Iniciar backend nuevo

```bash
# Ir a la carpeta del backend
cd ../backend

# Instalar dependencias
npm install

# Borrar base de datos existente (opcional)
Remove-Item .\database\fleet_monitor.db -Force  # Windows
rm ./database/fleet_monitor.db                  # Mac/Linux

# Inicializar base de datos con datos de prueba
node database/init.js

# Iniciar servidor
npm run dev
```

**Deberías ver**:

🌱 Seeding database...
✅ Users inserted
✅ Vehicles inserted with GPS coordinates
✅ Alerts inserted
✅ Fuel history inserted
✅ Sensor data inserted
🎉 Database seeded successfully!
Server running on port 3001
✅ WebSocket server initialized

---

### 4. Configurar IP de Red

**IMPORTANTE**: Los dispositivos móviles NO pueden usar `localhost`.

#### Encontrar tu IP Local

**Windows**:
```bash
ipconfig
```
Busca "IPv4 Address" en la sección "Wireless LAN adapter Wi-Fi" o "Ethernet adapter"

**Mac/Linux**:
```bash
ifconfig
```
Busca "inet" (NO "inet6")

Ejemplo: `192.168.0.101`

#### Actualizar Configuración

Edita `services/api.js`:
```javascript
const API_URL = __DEV__
  ? 'http://TU_IP_AQUI:3001/api'  // ← Cambia esto
  : 'https://api.simonfleet.com/api';
```

Edita `services/websocketService.js`:
```javascript
const WS_URL = __DEV__
  ? 'ws://TU_IP_AQUI:3001'  // ← Cambia esto
  : 'wss://api.simonfleet.com';
```

**Ejemplo**:
```javascript
const API_URL = 'http://192.168.0.101:3001/api';
const WS_URL = 'ws://192.168.0.101:3001';
```

---

### 5. Iniciar la App

```bash
npx expo start --lan
```

**Opciones de inicio**:
```bash
# Con caché limpio
npx expo start --lan --clear

# Solo LAN (más estable)
npx expo start --lan

# Tunnel (si LAN no funciona)
npx expo start --tunnel
```

**Deberías ver**:

Metro waiting on exp://192.168.0.101:8081
› Press s │ switch to development build
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
› Press r │ reload app
› Press m │ toggle menu
Logs for your project will appear below.

---

### 6. Abrir en tu Dispositivo

#### Android
1. Abre **Expo Go**
2. Toca **Scan QR Code**
3. Escanea el código QR en la terminal

#### iOS
1. Abre la app **Camera**
2. Apunta al código QR en la terminal
3. Toca la notificación **"Open in Expo Go"**

---

## ✅ Verificación

Deberías ver:
1. **Pantalla de Login**
2. Ingresar credenciales (ver abajo)
3. **Dashboard** con 6 KPIs
4. **4 pestañas**: Dashboard, Mapa, Alertas, Flota

---

## 🔑 Credenciales de Prueba


Administrador:
Email: admin@simon.com
Password: admin123
Usuario Regular:
Email: user@simon.com
Password: user123

---

## 🛠️ Troubleshooting

### Problema 1: "Network request failed"

**Causa**: La app no puede conectarse al backend.

**Soluciones**:
1. Verifica que el backend esté corriendo (`npm run dev` en `/backend`)
2. Verifica que la IP en `services/api.js` sea correcta
3. Asegúrate de que celular y PC estén en la misma red WiFi
4. Desactiva VPN/firewall temporalmente

**Probar conexión**:
```bash
# En tu celular, abre el navegador y visita:
http://TU_IP:3001/api/health

# Deberías ver: {"status":"ok"}
```

---

### Problema 2: "Unable to resolve module"

**Causa**: Dependencias mal instaladas.

**Solución**:
```bash
# Borrar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules  # Windows
rm -rf node_modules                        # Mac/Linux

npm install --legacy-peer-deps
npx expo start --clear
```

---

### Problema 3: Error "ERESOLVE" al instalar

**Causa**: Conflictos de peer dependencies.

**Solución**:
```bash
npm install --legacy-peer-deps
```

---

### Problema 4: "0 vehículos con GPS"

**Causa**: Base de datos sin coordenadas.

**Solución**:
```bash
cd backend

# Recrear base de datos
Remove-Item .\database\fleet_monitor.db -Force
node database/init.js

# Reiniciar backend
npm run dev
```

En la app, **desliza hacia abajo** (pull to refresh) en el mapa.

---

### Problema 5: WebSocket no conecta

**Causa**: Firewall bloqueando puerto 3001.

**Solución Windows**:
```powershell
# Agregar regla de firewall
New-NetFirewallRule -DisplayName "Node 3001" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

**Solución Mac/Linux**:
```bash
# Verificar que no haya firewall activo
sudo ufw status
```

---

### Problema 6: "Expo SDK version mismatch"

**Causa**: Expo Go en el celular tiene SDK diferente al proyecto.

**Solución**:
```bash
# Ver SDK actual
cat app.json | grep sdkVersion

# Actualizar proyecto al SDK del celular (ej: 54)
npx expo install expo@~54.0.0
```

---

## 🔄 Actualizar Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar Expo
npx expo install expo@latest

# Actualizar todas las dependencias de Expo
npx expo install --fix
```

---

## 📱 Compilar para Producción

### Opción 1: EAS Build (Recomendado)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar proyecto
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

### Opción 2: Build Local

```bash
# Android APK
npx expo prebuild
npx expo run:android --variant release

# iOS (solo en Mac)
npx expo run:ios --configuration Release
```

---

## 🧹 Limpiar Proyecto

```bash
# Limpiar caché
npx expo start --clear

# Limpiar todo
Remove-Item -Recurse -Force .expo, node_modules
npm install --legacy-peer-deps
```

---

## 📊 Estructura de Datos

### Vehículos
```javascript
{
  id: "VEH001",
  name: "Camión 1",
  status: "active",  // active | idle | maintenance
  speed: 45,
  fuelLevel: 75,
  temperature: 22,
  mileage: 45230,
  latitude: 4.7110,
  longitude: -74.0721,
  lastUpdate: "2026-05-01T12:00:00Z"
}
```

### Alertas
```javascript
{
  id: "alert_001",
  vehicleId: "VEH001",
  vehicleName: "Camión 1",
  type: "fuel",  // fuel | maintenance | temperature | predictive
  severity: "critical",  // critical | warning | info
  message: "Combustible crítico (30%)",
  timestamp: "2026-05-01T12:00:00Z",
  read: false
}
```

---

## 🌐 Variables de Entorno

Crear `.env` en la raíz:
```bash
API_URL=http://192.168.0.101:3001/api
WS_URL=ws://192.168.0.101:3001
```

**Nota**: Expo no soporta `.env` nativamente. Usa `app.config.js` para variables:

```javascript
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL || 'http://localhost:3001/api',
    },
  },
};
```

Acceder en código:
```javascript
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.apiUrl;
```

---

## 📞 Soporte

### Logs de Errores

**En la app**:
- Shake device → "Debug Remote JS"
- Ver logs en Chrome DevTools

**En la terminal**:
```bash
# Ver todos los logs
npx expo start

# Solo errores
npx expo start --no-dev
```

### Reportar Issues

1. Ir a GitHub Issues
2. Incluir:
   - Versión de Expo (`npx expo --version`)
   - Sistema operativo del celular
   - Logs completos del error
   - Pasos para reproducir

---

## 🎯 Próximos Pasos

1. ✅ Explorar todas las pantallas
2. ✅ Probar filtros de alertas
3. ✅ Hacer pull to refresh
4. ✅ Buscar vehículos en Flota
5. ✅ Verificar WebSocket (alertas en tiempo real)

---

## 📚 Recursos Adicionales

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [Zustand Guide](https://github.com/pmndrs/zustand)

---

**¿Problemas no resueltos?** Abre un issue en GitHub con logs completos.

**Desarrollado con ❤️ para Simon Movilidad**