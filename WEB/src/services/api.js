import axios from 'axios';

// URL del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  verify: async (token) => {
    const response = await api.post('/auth/verify', { token });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const vehiclesAPI = {
  getAll: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/vehicles', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/vehicles/stats');
    return response.data;
  },
  
  sendSensorData: async (vehicleId, data) => {
    const response = await api.post(`/vehicles/${vehicleId}/sensor-data`, data);
    return response.data;
  },
  
  getSensorHistory: async (vehicleId, limit = 100) => {
    const response = await api.get(`/vehicles/${vehicleId}/sensor-history`, {
      params: { limit }
    });
    return response.data;
  },
};

export const alertsAPI = {
  getAll: async (filters = {}) => {
    const response = await api.get('/alerts', { params: filters });
    return response.data;
  },
  
  create: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },
  
  markAsRead: async (alertId) => {
    const response = await api.patch(`/alerts/${alertId}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.patch('/alerts/read-all');
    return response.data;
  },
  
  checkPredictive: async () => {
    const response = await api.post('/alerts/check-predictive');
    return response.data;
  },
  
  delete: async (alertId) => {
    const response = await api.delete(`/alerts/${alertId}`);
    return response.data;
  },
};

export default api;