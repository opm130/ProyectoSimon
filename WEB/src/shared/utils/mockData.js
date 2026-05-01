/**
 * Datos mock para desarrollo
 */

export const mockVehicles = [
  {
    id: 'DEV-12345-XC54',
    name: 'Camión 1',
    status: 'active',
    speed: 45,
    fuelLevel: 38,
    fuelCapacity: 80,
    temperature: 75,
    location: {
      latitude: 4.7110,
      longitude: -74.0721,
      address: 'Carrera 7 #32-16, Bogotá'
    },
    lastUpdate: new Date().toISOString(),
    mileage: 45000,
    lastMaintenance: 42000,
    maintenanceInterval: 5000,
  },
  {
    id: 'DEV-67890-AB12',
    name: 'Van 2',
    status: 'idle',
    speed: 0,
    fuelLevel: 55,
    fuelCapacity: 60,
    temperature: 68,
    location: {
      latitude: 4.6945,
      longitude: -74.0845,
      address: 'Avenida Jiménez, Bogotá'
    },
    lastUpdate: new Date(Date.now() - 300000).toISOString(), // 5 min ago
    mileage: 32000,
    lastMaintenance: 30000,
    maintenanceInterval: 5000,
  },
  {
    id: 'DEV-11223-ZY88',
    name: 'Camión 3',
    status: 'active',
    speed: 60,
    fuelLevel: 15,
    fuelCapacity: 80,
    temperature: 82,
    location: {
      latitude: 4.6533,
      longitude: -74.0836,
      address: 'Autopista Norte, Bogotá'
    },
    lastUpdate: new Date(Date.now() - 60000).toISOString(), // 1 min ago
    mileage: 78000,
    lastMaintenance: 75000,
    maintenanceInterval: 5000,
  },
  {
    id: 'DEV-99887-QW45',
    name: 'Van 4',
    status: 'maintenance',
    speed: 0,
    fuelLevel: 70,
    fuelCapacity: 60,
    temperature: 65,
    location: {
      latitude: 4.7285,
      longitude: -74.0702,
      address: 'Calle 127, Bogotá'
    },
    lastUpdate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    mileage: 51000,
    lastMaintenance: 47000,
    maintenanceInterval: 5000,
  },
  {
    id: 'DEV-55443-ER67',
    name: 'Camión 5',
    status: 'active',
    speed: 35,
    fuelLevel: 42,
    fuelCapacity: 80,
    temperature: 73,
    location: {
      latitude: 4.6782,
      longitude: -74.0519,
      address: 'Avenida Caracas, Bogotá'
    },
    lastUpdate: new Date().toISOString(),
    mileage: 62000,
    lastMaintenance: 60000,
    maintenanceInterval: 5000,
  },
];

export const mockAlerts = [
  {
    id: '1',
    type: 'fuel_low',
    severity: 'critical',
    vehicleId: 'DEV-11223-ZY88',
    vehicleName: 'Camión 3',
    message: 'Combustible crítico. Autonomía: 0.8 horas',
    timestamp: new Date(Date.now() - 180000).toISOString(), // 3 min ago
    read: false,
  },
  {
    id: '2',
    type: 'temperature_high',
    severity: 'warning',
    vehicleId: 'DEV-11223-ZY88',
    vehicleName: 'Camión 3',
    message: 'Temperatura alta detectada: 82°C',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
    read: false,
  },
  {
    id: '3',
    type: 'maintenance',
    severity: 'warning',
    vehicleId: 'DEV-12345-XC54',
    vehicleName: 'Camión 1',
    message: 'Mantenimiento próximo en 2,000 km',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: false,
  },
  {
    id: '4',
    type: 'predictive',
    severity: 'info',
    vehicleId: 'DEV-67890-AB12',
    vehicleName: 'Van 2',
    message: 'Patrón de uso irregular detectado',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    read: true,
  },
];

export const mockFuelHistory = [
  { timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), level: 75 },
  { timestamp: new Date(Date.now() - 86400000 * 6).toISOString(), level: 68 },
  { timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), level: 62 },
  { timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), level: 55 },
  { timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), level: 48 },
  { timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), level: 42 },
  { timestamp: new Date(Date.now() - 86400000).toISOString(), level: 38 },
];

export const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@simon.com',
  role: 'admin'
};

export const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjk5OTk5OTk5OTl9.demo';