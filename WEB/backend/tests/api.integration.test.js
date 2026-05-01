const request = require('supertest');
const app = require('../server');


describe('API Integration Tests', () => {
  let authToken;
  let userId;

  // Test 1: Login exitoso
  describe('POST /api/auth/login', () => {
    test('debería hacer login con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@simon.com',
          password: 'admin123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('admin@simon.com');
      expect(response.body.user.role).toBe('admin');

      // Guardar token para siguientes tests
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    test('debería rechazar credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@simon.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid credentials');
    });

    test('debería rechazar email inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Test 2: Obtener vehículos (requiere autenticación)
  describe('GET /api/vehicles', () => {
    test('debería obtener lista de vehículos con token válido', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verificar estructura del vehículo
      const vehicle = response.body[0];
      expect(vehicle).toHaveProperty('id');
      expect(vehicle).toHaveProperty('name');
      expect(vehicle).toHaveProperty('status');
      expect(vehicle).toHaveProperty('fuelLevel');
      expect(vehicle).toHaveProperty('location');
    });

    test('debería rechazar petición sin token', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('No token provided');
    });

    test('debería rechazar token inválido', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Test 3: Obtener alertas
  describe('GET /api/alerts', () => {
    test('debería obtener lista de alertas', async () => {
      const response = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // Verificar estructura de alerta si hay alguna
      if (response.body.length > 0) {
        const alert = response.body[0];
        expect(alert).toHaveProperty('id');
        expect(alert).toHaveProperty('vehicleId');
        expect(alert).toHaveProperty('type');
        expect(alert).toHaveProperty('severity');
        expect(alert).toHaveProperty('message');
      }
    });

    test('debería filtrar alertas por severidad', async () => {
      const response = await request(app)
        .get('/api/alerts?severity=critical')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      response.body.forEach(alert => {
        expect(alert.severity).toBe('critical');
      });
    });
  });

  // Test 4: Estadísticas de vehículos
  describe('GET /api/vehicles/stats', () => {
    test('debería obtener estadísticas de la flota', async () => {
      const response = await request(app)
        .get('/api/vehicles/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('active');
      expect(response.body).toHaveProperty('idle');
      expect(response.body).toHaveProperty('maintenance');
      expect(response.body).toHaveProperty('avgSpeed');
      expect(response.body).toHaveProperty('avgFuel');


      expect(typeof response.body.total).toBe('number');
      expect(response.body.total).toBeGreaterThanOrEqual(0);
    });
  });

  // Test 5: Health check
  describe('GET /api/health', () => {
    test('debería responder con estado OK', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('message');
    });
  });

  // Test 6: Flujo completo integrado
  describe('Flujo completo: Login → Vehículos → Alertas', () => {
    test('debería completar el flujo end-to-end', async () => {
      // 1. Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@simon.com',
          password: 'user123'
        })
        .expect(200);

      const token = loginResponse.body.token;

      // 2. Obtener vehículos
      const vehiclesResponse = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(vehiclesResponse.body.length).toBeGreaterThan(0);

      // 3. Obtener alertas
      const alertsResponse = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(alertsResponse.body)).toBe(true);

      // 4. Obtener estadísticas
      const statsResponse = await request(app)
        .get('/api/vehicles/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(statsResponse.body.total).toBe(vehiclesResponse.body.length);
    });
  });
});