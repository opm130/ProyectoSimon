require('dotenv').config();
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'simon_fleet_secret_key_2024';

console.log('🔑 JWT Secret loaded:', JWT_SECRET ? 'OK' : 'MISSING');

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str) {

  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

function createSignature(header, payload, secret) {
  const data = `${header}.${payload}`;
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateToken(payload) {
  // Header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const tokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));

  const signature = createSignature(encodedHeader, encodedPayload, JWT_SECRET);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  try {
    // Dividir el token
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const expectedSignature = createSignature(encodedHeader, encodedPayload, JWT_SECRET);
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    
    const payload = JSON.parse(base64UrlDecode(encodedPayload));


    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  const result = verifyToken(token);

  if (!result.valid) {
    return res.status(401).json({ error: 'Invalid token', message: result.error });
  }

  req.user = result.payload;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware
};