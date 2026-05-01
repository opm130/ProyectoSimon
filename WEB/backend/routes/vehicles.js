const express = require('express');
const { authMiddleware } = require('../utils/jwt');
const { vehicleQueries, sensorQueries } = require('../database/queries');

const router = express.Router();


router.use(authMiddleware);

/**
 * Obtener todos los vehículos
 */
router.get('/', (req, res) => {
  try {
    const { status } = req.query;

    let vehicles;
    if (status && ['active', 'idle', 'maintenance'].includes(status)) {
      vehicles = vehicleQueries.getByStatus(status);
    } else {
      vehicles = vehicleQueries.getAll();
    }

    // Formatear respuesta 
    const formattedVehicles = vehicles.map(v => ({
      id: v.id,
      name: v.name,
      status: v.status,
      speed: v.speed,
      fuelLevel: v.fuel_level,
      temperature: v.temperature,
      mileage: v.mileage,
      location: {
        latitude: v.latitude,
        longitude: v.longitude,
        address: v.address
      },
      lastUpdate: v.last_update
    }));

    res.json(formattedVehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Obtener estadísticas de la flota
 */
router.get('/stats', (req, res) => {
  try {
    const stats = vehicleQueries.getStats();

    res.json({
      total: stats.total,
      active: stats.active,
      idle: stats.idle,
      maintenance: stats.maintenance,
      avgSpeed: parseFloat(stats.avg_speed?.toFixed(1) || 0),
      avgFuel: parseFloat(stats.avg_fuel?.toFixed(1) || 0)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Obtener un vehículo por ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = vehicleQueries.getById(id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({
      id: vehicle.id,
      name: vehicle.name,
      status: vehicle.status,
      speed: vehicle.speed,
      fuelLevel: vehicle.fuel_level,
      temperature: vehicle.temperature,
      mileage: vehicle.mileage,
      location: {
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
        address: vehicle.address
      },
      lastUpdate: vehicle.last_update
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Ingesta de datos de sensores
 */
router.post('/:id/sensor-data', (req, res) => {
  try {
    const { id } = req.params;
    const { speed, fuelLevel, temperature, latitude, longitude } = req.body;

    // Verificar que el vehículo existe
    const vehicle = vehicleQueries.getById(id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Actualizar datos del vehículo
    vehicleQueries.updateSensorData(
      speed ?? vehicle.speed,
      fuelLevel ?? vehicle.fuel_level,
      temperature ?? vehicle.temperature,
      id
    );

    // Guardar en histórico
    sensorQueries.create(
      id,
      speed ?? vehicle.speed,
      fuelLevel ?? vehicle.fuel_level,
      temperature ?? vehicle.temperature,
      latitude ?? vehicle.latitude,
      longitude ?? vehicle.longitude,
      new Date().toISOString()
    );

    console.log(`📊 Sensor data received for vehicle ${id}`);

    res.json({
      success: true,
      message: 'Sensor data ingested successfully',
      vehicleId: id
    });
  } catch (error) {
    console.error('Sensor data error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Obtener histórico de sensores
 */
router.get('/:id/sensor-history', (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const history = sensorQueries.getByVehicle(id, limit);

    res.json(history);
  } catch (error) {
    console.error('Get sensor history error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;