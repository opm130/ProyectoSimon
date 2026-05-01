const express = require('express');
const { generateToken, verifyToken } = require('../utils/jwt');
const { userQueries } = require('../database/queries');

const router = express.Router();

/**
 * Autenticación JWT manual (sin bcrypt para simplicidad en la prueba)
 */
router.post('/login', (req, res) => {
  try {
    let { email, password } = req.body;

    // Si email es un objeto (autocompletado), extraer el email del objeto
    if (typeof email === 'object' && email !== null) {
      email = email.email || email.id;
    }

    console.log('📧 Login attempt:', { email, password: password ? '***' : 'missing' });

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Buscar usuario
    console.log('🔍 Searching for user with email:', email);
    const user = userQueries.findByEmail(email);
    console.log('👤 User found:', user ? `${user.email} (${user.role})` : 'null');

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Verificar contraseña 
    if (user.password !== password) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generar JWT manualmente
    const token = generateToken({
      sub: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    // Retornar token y datos de usuario
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    console.log(`✅ User logged in: ${user.email} (${user.role})`);
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Verificar token JWT
 */
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const result = verifyToken(token);

    if (!result.valid) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: result.error 
      });
    }

    res.json({
      valid: true,
      payload: result.payload
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Obtener información del usuario autenticado
 */
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const result = verifyToken(token);

    if (!result.valid) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: result.error 
      });
    }

    const user = userQueries.findById(result.payload.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;