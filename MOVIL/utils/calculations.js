/**
 * Cálculos reutilizables para la aplicación
 */

export const calculateFleetStats = (vehicles) => {
  if (!vehicles || vehicles.length === 0) {
    return {
      total: 0,
      active: 0,
      idle: 0,
      maintenance: 0,
      avgSpeed: 0,
      avgFuel: 0,
    };
  }

  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'active').length,
    idle: vehicles.filter(v => v.status === 'idle').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    avgSpeed: vehicles.reduce((sum, v) => sum + (v.speed || 0), 0) / vehicles.length,
    avgFuel: vehicles.reduce((sum, v) => sum + (v.fuelLevel || 0), 0) / vehicles.length,
  };

  return stats;
};

export const calculateFuelAutonomy = (fuelLevel, consumption = 5) => {
  // consumption: litros por hora promedio
  return fuelLevel / consumption;
};

export const calculateFuelAlert = (fuelLevel) => {
  const AVERAGE_CONSUMPTION = 5; // litros/hora
  const CRITICAL_HOURS = 1;
  const WARNING_HOURS = 2;

  const autonomy = fuelLevel / AVERAGE_CONSUMPTION;

  if (autonomy < CRITICAL_HOURS) {
    return {
      shouldAlert: true,
      severity: 'critical',
      message: `Combustible crítico: ${autonomy.toFixed(1)} horas de autonomía`,
      autonomyHours: autonomy,
    };
  }

  if (autonomy < WARNING_HOURS) {
    return {
      shouldAlert: true,
      severity: 'warning',
      message: `Combustible bajo: ${autonomy.toFixed(1)} horas de autonomía`,
      autonomyHours: autonomy,
    };
  }

  return {
    shouldAlert: false,
    severity: 'info',
    message: `Combustible normal: ${autonomy.toFixed(1)} horas de autonomía`,
    autonomyHours: autonomy,
  };
};
