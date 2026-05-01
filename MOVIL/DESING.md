# Decisiones de Diseño - Simon Fleet Monitor Mobile

Este documento explica las decisiones arquitectónicas y tecnológicas tomadas durante el desarrollo de la aplicación móvil.

## 📱 Stack Tecnológico

### React Native + Expo vs React Native CLI

**Decisión**: Usar Expo Managed Workflow

**Razones**:
- ✅ **Desarrollo más rápido**: No requiere Xcode/Android Studio
- ✅ **OTA Updates**: Actualizaciones sin app stores
- ✅ **Ecosistema integrado**: Camera, Notifications, Maps preconfigurados
- ✅ **Testing simplificado**: Expo Go para probar en dispositivo real
- ✅ **EAS Build**: Compilación en la nube

**Trade-offs**:
- ❌ Tamaño de app mayor (~50MB vs ~20MB nativo)
- ❌ Limitaciones con módulos nativos custom
- ❌ Dependencia del ecosistema Expo

**Mitigación**: Para funcionalidades nativas avanzadas, migrar a Expo Bare Workflow mantiene compatibilidad.

---

## 🧭 Navegación

### Expo Router vs React Navigation

**Decisión**: Expo Router (file-based routing)

**Razones**:
- ✅ **File-based routing**: Estructura clara `/app/(tabs)/dashboard.jsx`
- ✅ **Type-safe**: Rutas tipadas automáticamente
- ✅ **Deep linking**: Configuración automática
- ✅ **Layouts compartidos**: `_layout.jsx` para grupos
- ✅ **Menor boilerplate**: No configurar navegadores manualmente

**Ejemplo**:
```javascript
// Estructura de carpetas = Rutas
app/
  (auth)/login.jsx     → /(auth)/login
  (tabs)/dashboard.jsx → /(tabs)/dashboard
```

**Trade-offs**:
- ❌ Menos flexible para navegación compleja
- ❌ Beta (estable desde v3)

---

## 💾 State Management

### Zustand vs Redux

**Decisión**: Zustand

**Razones**:
- ✅ **Simplicidad**: 10 líneas vs 50+ de Redux
- ✅ **Sin boilerplate**: No actions/reducers/types
- ✅ **Performance**: Re-renders optimizados automáticamente
- ✅ **DevTools**: Integración con React DevTools
- ✅ **Tamaño**: 2KB vs 12KB (Redux Toolkit)

**Comparación de código**:

```javascript
// Zustand
const useStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
}));

// Redux equivalente
const slice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    login: (state, action) => { state.user = action.payload },
  },
});
```

**Trade-offs**:
- ❌ Menos estructura impuesta (puede causar inconsistencias)
- ❌ Ecosistema más pequeño

**Decisión de persistencia**: AsyncStorage vs Redux Persist
- ✅ Integración nativa con Zustand
- ✅ Más ligero

---

## 🗺️ Mapas

### React Native Maps vs Mapbox

**Decisión**: React Native Maps

**Razones**:
- ✅ **Nativo**: Usa Google Maps (Android) / Apple Maps (iOS)
- ✅ **Sin costos**: No requiere API key en desarrollo
- ✅ **Comunidad**: 13K+ stars en GitHub
- ✅ **Expo compatible**: `expo install react-native-maps`

**Trade-offs**:
- ❌ Requiere configuración nativa para producción
- ❌ Menos features que Mapbox (3D, rutas optimizadas)

**Solución temporal**: Vista de lista con coordenadas GPS para Expo Go.

---

## 🔌 Comunicación en Tiempo Real

### WebSockets vs Polling

**Decisión**: WebSockets

**Razones**:
- ✅ **Eficiencia**: 1 conexión persistente vs múltiples requests
- ✅ **Latencia baja**: ~10ms vs ~500ms (HTTP)
- ✅ **Batería**: Menos consumo que polling cada 5s
- ✅ **Bidireccional**: Server puede pushear datos

**Implementación**:
```javascript
// Auto-reconnect con backoff exponencial
const connectWebSocket = () => {
  ws = new WebSocket(WS_URL);
  ws.onclose = () => {
    if (reconnectAttempts < MAX_RECONNECT) {
      setTimeout(connectWebSocket, 3000);
    }
  };
};
```

**Trade-offs**:
- ❌ Más complejo que REST
- ❌ Problemas con proxies/firewalls

**Mitigación**: Fallback a polling si WebSocket falla.

---

## 🎨 UI/UX

### Component Library vs Custom

**Decisión**: Componentes custom con tokens de diseño

**Razones**:
- ✅ **Control total**: Diseño específico de la app
- ✅ **Performance**: Sin dependencias pesadas
- ✅ **Consistencia**: Design tokens compartidos

**Estructura de tokens**:
```javascript
// constants/colors.js
export const Colors = {
  primary: '#2563eb',
  statusActive: '#22c55e',
  statusIdle: '#f59e0b',
  statusMaintenance: '#ef4444',
};
```

**Trade-offs**:
- ❌ Más tiempo de desarrollo inicial
- ❌ Mantenimiento manual

**Considerado**: React Native Paper, NativeBase (descartados por peso)

---

## 🔐 Autenticación

### AsyncStorage vs Secure Storage

**Decisión**: AsyncStorage para MVP

**Razones**:
- ✅ **Simplicidad**: API nativa de React Native
- ✅ **Expo compatible**: Sin configuración adicional
- ✅ **Suficiente para desarrollo**: Tokens no sensibles

**Implementación**:
```javascript
persist(
  (set, get) => ({ /* state */ }),
  { name: 'auth-storage', storage: createJSONStorage(() => AsyncStorage) }
);
```

**Producción**: Migrar a expo-secure-store:
```javascript
import * as SecureStore from 'expo-secure-store';
// Tokens encriptados a nivel OS
```

---

## 📡 Networking

### Axios vs Fetch

**Decisión**: Axios

**Razones**:
- ✅ **Interceptors**: Agregar tokens automáticamente
- ✅ **Timeout**: Control de timeouts
- ✅ **Cancel requests**: AbortController integrado
- ✅ **Error handling**: Mejor manejo de errores HTTP

**Configuración**:
```javascript
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Trade-offs**:
- ❌ Dependencia adicional (12KB)

---

## 🏗️ Arquitectura

### Monorepo vs Repositorios Separados

**Decisión**: Monorepo con backend compartido

**Razones**:
- ✅ **Código compartido**: `utils/` reutilizado entre web y mobile
- ✅ **Sincronización**: Cambios de API actualizan web + mobile
- ✅ **Deployment simple**: Un solo repositorio

**Estructura**:
proyecto/
├── backend/          # Node.js (compartido)
├── frontend-web/     # React
└── SimonFleetNew/    # React Native

**Trade-offs**:
- ❌ Repositorio más grande
- ❌ CI/CD más complejo

---

## 🗄️ Base de Datos

### SQLite vs PostgreSQL

**Decisión**: SQLite (heredado del backend web)

**Razones**:
- ✅ **Sin servidor**: Archivo local
- ✅ **Desarrollo rápido**: `npm install better-sqlite3`
- ✅ **Portabilidad**: Copiar archivo .db

**Producción**: Migrar a PostgreSQL:
- Mejor concurrencia
- Tipos de datos avanzados
- Escalabilidad

---

## 🧪 Testing

### Jest vs React Native Testing Library

**Decisión**: Pendiente implementación

**Plan**:
- Unit tests: Jest para lógica (utils, stores)
- Component tests: React Native Testing Library
- E2E: Detox (opcional)

---

## 📊 Performance

### Optimizaciones Implementadas

1. **Memoización**:
```javascript
const filteredVehicles = useMemo(
  () => vehicles.filter(v => v.status === 'active'),
  [vehicles]
);
```

2. **FlatList optimizado**:
```javascript
<FlatList
  data={vehicles}
  keyExtractor={(item) => item.id}
  windowSize={5}
  maxToRenderPerBatch={10}
/>
```

3. **Estado granular**: Zustand evita re-renders innecesarios

---

## 🔮 Decisiones Futuras

### Offline-First

**Opción 1**: WatermelonDB
- Sync automático
- SQLite bajo el capó

**Opción 2**: Custom queue
- Más control
- Menos overhead

**Decisión**: Evaluar según escalabilidad.

---

### Push Notifications

**Expo Notifications** vs **Firebase Cloud Messaging**
- Expo: Más simple, sin config nativa
- FCM: Más control, reportes detallados

**Decisión**: Expo Notifications para MVP.

---

## 📏 Principios de Diseño

1. **Mobile-First**: Diseñar para pantallas pequeñas primero
2. **Offline-Capable**: Funcionar sin conexión
3. **Battery-Conscious**: Optimizar para consumo de batería
4. **Thumb-Friendly**: Botones accesibles con una mano
5. **Fast by Default**: < 3s tiempo de carga

---

## 🎯 Métricas de Éxito

- **Tiempo de carga**: < 2s
- **FPS**: 60 fps consistente
- **Tamaño de app**: < 50MB
- **Crash rate**: < 1%
- **Battery drain**: < 5% por hora de uso

---

## 📚 Referencias

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Zustand Best Practices](https://github.com/pmndrs/zustand)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

---

**Última actualización**: Mayo 2026