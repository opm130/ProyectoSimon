import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar base URL - cambiar según entorno
const API_URL = __DEV__ 
  ? 'http://192.168.0.101:3001/api'  // Desarrollo
  : 'https://api.simonfleet.com/api';  // Producción

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      await AsyncStorage.removeItem('auth_token');
      // Aquí podrías redirigir al login
    }
    return Promise.reject(error);
  }
);

export default api;

// Endpoints específicos
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  verify: () => api.post('/auth/verify'),
};

export const vehiclesAPI = {
  getAll: () => api.get('/vehicles'),
  getById: (id) => api.get(`/vehicles/${id}`),
  getStats: () => api.get('/vehicles/stats'),
  updateSensorData: (id, data) => api.put(`/vehicles/${id}/sensor-data`, data),
};

export const alertsAPI = {
  getAll: () => api.get('/alerts'),
  markAsRead: (id) => api.patch(`/alerts/${id}/read`),
  create: (alertData) => api.post('/alerts', alertData),
};
