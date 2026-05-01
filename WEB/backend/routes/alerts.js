const express = require('express');
const { authMiddleware } = require('../utils/jwt');
const { alertQueries, vehicleQueries } = require('../database/queries');

const router = express.Router();


router.use(authMiddleware);


const AVERAGE_CONSUMPTION = 5; 
const CRITICAL_HOURS = 1;
const WARNING_HOURS = 2;

/**
 * Función para calcular alerta predictiva de combustible
 */
function calculateFuelAlert(fuelLevel) {
  const autonomyHours = fuelLevel / AVERAGE_CONSUMPTION;
  
  if (autonomyHours < CRITICAL_HOURS) {
    return {
      shouldAlert: true,
      severity: 'critical',
      message: `Combustible crítico. Autonomía: ${autonomyHours.toFixed(1)} horas`,
      autonomyHours
    };
  }
  
  if (autonomyHours < WARNING_HOURS) {
    return {
      shouldAlert: true,
      severity: 'warning',
      message: `Combustible bajo. Autonomía: ${autonomyHours.toFixed(1)} horas`,
      autonomyHours
    };
  }
  
  return { shouldAlert: false };
}

/**
 * Obtener todas las alertas
 */
router.get('/', (req, res) => {
  try {
    const { severity, read, vehicleId } = req.query;

    let alerts;

    if (vehicleId) {
      alerts = alertQueries.getByVehicle(vehicleId);
    } else if (severity) {
      alerts = alertQueries.getBySeverity(severity);
    } else if (read === 'false' || read === '0') {
      alerts = alertQueries.getUnread();
    } else {
      alerts = alertQueries.getAll();
    }

    // Formatear
    const formattedAlerts = alerts.map(a => ({
      id: a.id,
      vehicleId: a.vehicle_id,
      vehicleName: a.vehicle_name,
      type: a.type,
      severity: a.severity,
      message: a.message,
      timestamp: a.timestamp,
      read: Boolean(a.read)
    }));

    res.json(formattedAlerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Crear una nueva alerta
 */
router.post('/', (req, res) => {
  try {
    const { vehicleId, type, severity, message } = req.body;

    if (!vehicleId || !type || !severity || !message) {
      return res.status(400).json({ 
        error: 'vehicleId, type, severity, and message are required' 
      });
    }

    // Verificar que el vehículo existe
    const vehicle = vehicleQueries.getById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const alertId = `alert_${Date.now()}`;

    alertQueries.create(
      alertId,
      vehicleId,
      vehicle.name,
      type,
      severity,
      message,
      new Date().toISOString()
    );

    const newAlert = {
      id: alertId,
      vehicleId,
      vehicleName: vehicle.name,
      type,
      severity,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    console.log(`🚨 Alert created: ${type} - ${severity} for vehicle ${vehicleId}`);

    // Broadcast WebSocket 
    const wsServer = req.app.get('wsServer');
    if (wsServer) {
      wsServer.broadcastNewAlert(newAlert);
      console.log('📡 Alert broadcasted via WebSocket');
    }

    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Verificar y crear alertas predictivas de combustible
 */
router.post('/check-predictive', (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Admin role required.' 
      });
    }

    const vehicles = vehicleQueries.getAll();
    const newAlerts = [];

    for (const vehicle of vehicles) {
      const fuelAlert = calculateFuelAlert(vehicle.fuel_level);
      
      if (fuelAlert.shouldAlert) {
        const alertId = `alert_pred_${Date.now()}_${vehicle.id}`;
        
        alertQueries.create(
          alertId,
          vehicle.id,
          vehicle.name,
          'predictive',
          fuelAlert.severity,
          fuelAlert.message,
          new Date().toISOString()
        );

        newAlerts.push({
          id: alertId,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'predictive',
          severity: fuelAlert.severity,
          message: fuelAlert.message
        });
      }
    }

    console.log(`🔮 Predictive check completed. ${newAlerts.length} new alerts created.`);

    res.json({
      checked: vehicles.length,
      alertsCreated: newAlerts.length,
      alerts: newAlerts
    });
  } catch (error) {
    console.error('Predictive check error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Marcar alerta como leída
 */
router.patch('/:id/read', (req, res) => {
  try {
    const { id } = req.params;

    const result = alertQueries.markAsRead(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    console.log(`✅ Alert marked as read: ${id}`);

    res.json({
      success: true,
      message: 'Alert marked as read',
      alertId: id
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Marcar todas las alertas como leídas
 */
router.patch('/read-all', (req, res) => {
  try {
    const result = alertQueries.markAllAsRead();

    console.log(`✅ All alerts marked as read (${result.changes} alerts)`);

    res.json({
      success: true,
      message: 'All alerts marked as read',
      count: result.changes
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Eliminar una alerta
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const result = alertQueries.delete(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    console.log(`🗑️  Alert deleted: ${id}`);

    res.json({
      success: true,
      message: 'Alert deleted',
      alertId: id
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;