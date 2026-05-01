// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV 
    ? 'http://localhost:8080/api' 
    : 'https://api.simonfleet.com/api',
  WEBSOCKET_URL: import.meta.env.DEV
    ? 'ws://localhost:8080'
    : 'wss://api.simonfleet.com',
  TIMEOUT: 10000,
};

// Endpoints
export const ENDPOINTS = {

  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  VEHICLES: '/vehicles',
  VEHICLE_DETAIL: (id) => `/vehicles/${id}`,
  SENSOR_DATA: '/sensors/data',
  
  ALERTS: '/alerts',
  PREDICTIVE_ALERTS: '/alerts/predictive',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const ALERT_TYPES = {
  FUEL_LOW: 'fuel_low',
  TEMPERATURE_HIGH: 'temperature_high',
  MAINTENANCE: 'maintenance',
  PREDICTIVE: 'predictive',
};

export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  IDLE: 'idle',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline',
};

export const FUEL_THRESHOLDS = {
  CRITICAL_HOURS: 1,
  WARNING_HOURS: 2,
  AVERAGE_CONSUMPTION_LITER_PER_HOUR: 5,
};

export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 4.7110, // Bogotá
  DEFAULT_LONGITUDE: -74.0721,
  DEFAULT_ZOOM: 12,
  MARKER_UPDATE_INTERVAL: 5000,
};

export const OFFLINE_CONFIG = {
  SYNC_INTERVAL: 30000,
  MAX_QUEUE_SIZE: 100,
  RETRY_ATTEMPTS: 3,
};

export const MASK_CONFIG = {
  PREFIX_LENGTH: 4,
  SUFFIX_LENGTH: 4,
  MASK_CHAR: '*',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'fleet:auth_token',
  USER_DATA: 'fleet:user_data',
  OFFLINE_QUEUE: 'fleet:offline_queue',
  CACHED_VEHICLES: 'fleet:cached_vehicles',
};

export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  VEHICLE_UPDATE: 'vehicle:update',
  ALERT_NEW: 'alert:new',
  SENSOR_DATA: 'sensor:data',
};