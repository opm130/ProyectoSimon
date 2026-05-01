const express = require('express');
const { authMiddleware } = require('../utils/jwt');
const { vehicleQueries } = require('../database/queries');

const router = express.Router();

router.use(authMiddleware);

/**
 * Obtener todos los vehículos
 */
router.get('/', (req, res) => {
  try {
    const vehicles = vehicleQueries.getAll();

    // El query ya mapea fuel_level -> fuelLevel y last_update -> lastUpdate
    const formattedVehicles = vehicles.map(v => ({
      id: v.id,
      name: v.name,
      status: v.status,
      speed: v.speed,
      fuelLevel: v.fuelLevel,     // Ya viene mapeado
      temperature: v.temperature,
      mileage: v.mileage,
      latitude: v.latitude,        // Agregar directamente
      longitude: v.longitude,      // Agregar directamente
      location: {
        latitude: v.latitude,
        longitude: v.longitude,
        address: v.address
      },
      lastUpdate: v.lastUpdate    // Ya viene mapeado
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
    const stats = vehicleQueries.getFleetStats();
    res.json(stats);
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
      fuelLevel: vehicle.fuelLevel,
      temperature: vehicle.temperature,
      mileage: vehicle.mileage,
      latitude: vehicle.latitude,
      longitude: vehicle.longitude,
      location: {
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
        address: vehicle.address
      },
      lastUpdate: vehicle.lastUpdate
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
 * Actualizar datos de sensor
 */
router.put('/:id/sensor-data', (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = vehicleQueries.getById(id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    vehicleQueries.updateSensorData(id, req.body);

    res.json({
      success: true,
      message: 'Sensor data updated successfully'
    });
  } catch (error) {
    console.error('Update sensor data error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;