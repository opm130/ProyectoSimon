# Tests - Simon Fleet Monitor

## 📦 Instalación de dependencias

### Backend
```bash
cd backend
npm install --save-dev jest supertest
```

### Frontend
```bash
cd ../
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## 🧪 Ejecutar Tests

### Backend (Jest)

**Ejecutar todos los tests:**
```bash
cd backend
npm test
```

**Ejecutar tests en modo watch:**
```bash
npm run test:watch
```

**Ejecutar con coverage:**
```bash
npm run test:coverage
```

### Frontend (Vitest)

**Ejecutar todos los tests:**
```bash
npm run test
```

**Ejecutar en modo watch:**
```bash
npm run test:watch
```

---

## 📝 Tests Implementados

### Backend

#### 1. **Fuel Autonomy Calculation** (`tests/fuel.test.js`)
- ✅ Alerta crítica cuando autonomía < 1 hora
- ✅ Alerta warning cuando autonomía entre 1-2 horas
- ✅ No alerta cuando autonomía > 2 horas
- ✅ Manejo de valores límite
- ✅ Manejo de combustible vacío

#### 2. **JWT Manual Implementation** (`tests/jwt.test.js`)
- ✅ Generación de token válido
- ✅ Verificación de token válido
- ✅ Rechazo de token con firma incorrecta
- ✅ Rechazo de token malformado
- ✅ Rechazo de token expirado
- ✅ Inclusión de timestamps (iat, exp)
- ✅ Preservación de campos del payload

#### 3. **API Integration Tests** (`tests/api.integration.test.js`)
- ✅ Login exitoso con credenciales válidas
- ✅ Rechazo de credenciales inválidas
- ✅ Obtención de vehículos con autenticación
- ✅ Rechazo de peticiones sin token
- ✅ Obtención de alertas
- ✅ Filtrado de alertas por severidad
- ✅ Obtención de estadísticas
- ✅ Health check
- ✅ **Flujo completo end-to-end:** Login → Vehículos → Alertas → Stats

### Frontend

#### 4. **maskDeviceId Function** (`src/tests/maskDeviceId.test.js`)
- ✅ Enmascaramiento de ID con formato XXX-XXXXX-XXXX
- ✅ Muestra ID completo para admin
- ✅ Enmascaramiento de ID sin guiones
- ✅ Manejo de IDs cortos (<8 caracteres)
- ✅ Manejo de valores nulos/vacíos
- ✅ Diferentes formatos de ID
- ✅ Preservación de longitud total
- ✅ No enmascaramiento para admin

---

## 📊 Cobertura Esperada

### Backend
- **Fuel calculation:** 100%
- **JWT utils:** ~90%
- **API endpoints:** ~80%

### Frontend
- **maskDeviceId:** 100%

---

## ⚙️ Configuración

### Jest (Backend)
- Archivo: `backend/jest.config.js`
- Entorno: Node.js
- Archivos test: `**/*.test.js`

### Vitest (Frontend)
- Archivo: `vitest.config.js`
- Entorno: jsdom (para React)
- Archivos test: `**/*.test.js`

---

## 🚀 Ejecución Rápida

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd .. && npm run test
```

---

## 📋 Resultados Esperados

Todos los tests deberían pasar ✅

```
Backend (Jest):
  ✓ Fuel Autonomy Calculation (5 tests)
  ✓ JWT Manual Implementation (8 tests)
  ✓ API Integration Tests (12 tests)

Frontend (Vitest):
  ✓ maskDeviceId Function (8 tests)

Total: 33 tests passing
```