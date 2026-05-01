import { FUEL_THRESHOLDS } from '../../config/constants';

export const calculateAutonomyHours = (currentFuel, avgConsumption) => {
  if (!currentFuel || !avgConsumption || avgConsumption === 0) {
    return 0;
  }
  
  return currentFuel / avgConsumption;
};

export const shouldAlertFuel = (currentFuel, avgConsumption) => {
  const autonomyHours = calculateAutonomyHours(currentFuel, avgConsumption);
  
  if (autonomyHours <= FUEL_THRESHOLDS.CRITICAL_HOURS) {
    return {
      shouldAlert: true,
      severity: 'critical',
      message: `Combustible crítico. Autonomía: ${autonomyHours.toFixed(1)} horas`,
      autonomyHours,
    };
  }
  
  if (autonomyHours <= FUEL_THRESHOLDS.WARNING_HOURS) {
    return {
      shouldAlert: true,
      severity: 'warning',
      message: `Combustible bajo. Autonomía: ${autonomyHours.toFixed(1)} horas`,
      autonomyHours,
    };
  }
  
  return {
    shouldAlert: false,
    severity: 'normal',
    message: 'Nivel de combustible normal',
    autonomyHours,
  };
};

export const calculateFuelPercentage = (currentFuel, capacity) => {
  if (!currentFuel || !capacity) return 0;
  return (currentFuel / capacity) * 100;
};

export const calculateRemainingDistance = (currentFuel, fuelEfficiency) => {
  if (!currentFuel || !fuelEfficiency) return 0;
  return currentFuel * fuelEfficiency;
};

export const calculateAverageConsumption = (fuelHistory) => {
  if (!fuelHistory || fuelHistory.length < 2) {
    return FUEL_THRESHOLDS.AVERAGE_CONSUMPTION_LITER_PER_HOUR;
  }
  
  const consumptions = [];
  
  for (let i = 1; i < fuelHistory.length; i++) {
    const current = fuelHistory[i];
    const previous = fuelHistory[i - 1];
    
    const fuelDiff = previous.level - current.level;
    const timeDiff = (new Date(current.timestamp) - new Date(previous.timestamp)) / 3600000; // horas
    
    if (timeDiff > 0 && fuelDiff > 0) {
      consumptions.push(fuelDiff / timeDiff);
    }
  }
  
  if (consumptions.length === 0) {
    return FUEL_THRESHOLDS.AVERAGE_CONSUMPTION_LITER_PER_HOUR;
  }
  
  const sum = consumptions.reduce((acc, val) => acc + val, 0);
  return sum / consumptions.length;
};

export const predictMaintenanceNeed = (vehicle) => {
  const { mileage, lastMaintenance, maintenanceInterval } = vehicle;
  
  if (!mileage || !lastMaintenance || !maintenanceInterval) {
    return { needsMaintenance: false, urgency: 'none' };
  }
  
  const mileageSinceMaintenance = mileage - lastMaintenance;
  const percentage = (mileageSinceMaintenance / maintenanceInterval) * 100;
  
  if (percentage >= 100) {
    return {
      needsMaintenance: true,
      urgency: 'critical',
      message: 'Mantenimiento vencido',
      percentage,
    };
  }
  
  if (percentage >= 90) {
    return {
      needsMaintenance: true,
      urgency: 'high',
      message: 'Mantenimiento próximo',
      percentage,
    };
  }
  
  if (percentage >= 75) {
    return {
      needsMaintenance: true,
      urgency: 'medium',
      message: 'Programar mantenimiento',
      percentage,
    };
  }
  
  return {
    needsMaintenance: false,
    urgency: 'none',
    message: 'Sin mantenimiento pendiente',
    percentage,
  };
};

export const calculateFleetStats = (vehicles) => {
  if (!vehicles || vehicles.length === 0) {
    return {
      total: 0,
      active: 0,
      idle: 0,
      maintenance: 0,
      avgFuel: 0,
      avgSpeed: 0,
    };
  }
  
  const stats = vehicles.reduce((acc, vehicle) => {
    acc.total++;
    
    if (vehicle.status === 'active') acc.active++;
    if (vehicle.status === 'idle') acc.idle++;
    if (vehicle.status === 'maintenance') acc.maintenance++;
    
    acc.totalFuel += vehicle.fuelLevel || 0;
    acc.totalSpeed += vehicle.speed || 0;
    
    return acc;
  }, {
    total: 0,
    active: 0,
    idle: 0,
    maintenance: 0,
    totalFuel: 0,
    totalSpeed: 0,
  });
  
  stats.avgFuel = stats.totalFuel / stats.total;
  stats.avgSpeed = stats.totalSpeed / stats.active || 0;
  
  return stats;
};