const { generateToken, verifyToken } = require('../utils/jwt');

describe('JWT Manual Implementation', () => {
  const testPayload = {
    sub: 'user_001',
    userId: 'user_001',
    email: 'admin@simon.com',
    role: 'admin',
    name: 'Admin User'
  };

  test('debería generar un token JWT válido', () => {
    const token = generateToken(testPayload);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // Header.Payload.Signature
  });

  test('debería verificar un token válido correctamente', () => {
    const token = generateToken(testPayload);
    const result = verifyToken(token);
    
    expect(result.valid).toBe(true);
    expect(result.payload.userId).toBe(testPayload.userId);
    expect(result.payload.email).toBe(testPayload.email);
    expect(result.payload.role).toBe(testPayload.role);
  });

  test('debería rechazar un token con firma incorrecta', () => {
    const token = generateToken(testPayload);
    const tamperedToken = token.slice(0, -10) + 'XXXXXXXXXX';
    
    const result = verifyToken(tamperedToken);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid signature');
  });

  test('debería rechazar un token malformado', () => {
    const invalidToken = 'not.a.valid.jwt.token';
    
    const result = verifyToken(invalidToken);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('debería rechazar un token expirado', () => {
    // Crear token que ya está expirado
    const expiredPayload = {
      ...testPayload,
      iat: Math.floor(Date.now() / 1000) - 7200, // Emitido hace 2 horas
      exp: Math.floor(Date.now() / 1000) - 3600  // Expirado hace 1 hora
    };
    
    // Generar token manualmente con payload expirado
    const { generateToken: generateTokenRaw } = require('../utils/jwt');
    
    const crypto = require('crypto');
    const JWT_SECRET = process.env.JWT_SECRET || 'simon_fleet_secret_key_2024';
    
    function base64UrlEncode(str) {
      return Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }
    
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(expiredPayload));
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    const expiredToken = `${headerEncoded}.${payloadEncoded}.${signature}`;
    
    const result = verifyToken(expiredToken);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('expired');
  });

  test('debería incluir timestamp de emisión (iat)', () => {
    const token = generateToken(testPayload);
    const result = verifyToken(token);
    
    expect(result.payload.iat).toBeDefined();
    expect(typeof result.payload.iat).toBe('number');
  });

  test('debería incluir timestamp de expiración (exp)', () => {
    const token = generateToken(testPayload);
    const result = verifyToken(token);
    
    expect(result.payload.exp).toBeDefined();
    expect(typeof result.payload.exp).toBe('number');
    expect(result.payload.exp).toBeGreaterThan(result.payload.iat);
  });

  test('debería preservar todos los campos del payload', () => {
    const token = generateToken(testPayload);
    const result = verifyToken(token);
    
    expect(result.payload.sub).toBe(testPayload.sub);
    expect(result.payload.userId).toBe(testPayload.userId);
    expect(result.payload.email).toBe(testPayload.email);
    expect(result.payload.role).toBe(testPayload.role);
    expect(result.payload.name).toBe(testPayload.name);
  });
});