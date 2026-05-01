import { create } from 'zustand';
import { alertsAPI } from '../services/api';

const useAlertStore = create((set, get) => ({
  alerts: [],
  loading: false,
  error: null,

  fetchAlerts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await alertsAPI.getAll();
      set({ alerts: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      set({ 
        error: error.message || 'Error al cargar alertas',
        loading: false 
      });
      return [];
    }
  },

  markAsRead: async (alertId) => {
    try {
      await alertsAPI.markAsRead(alertId);
      const { alerts } = get();
      set({
        alerts: alerts.map(alert =>
          alert.id === alertId ? { ...alert, read: true } : alert
        ),
      });
      return true;
    } catch (error) {
      console.error('Error marking alert as read:', error);
      return false;
    }
  },

  getCriticalAlerts: () => {
    const { alerts } = get();
    return alerts.filter(a => a.severity === 'critical' && !a.read);
  },

  getUnreadAlerts: () => {
    const { alerts } = get();
    return alerts.filter(a => !a.read);
  },

  getAlertsBySeverity: (severity) => {
    const { alerts } = get();
    return alerts.filter(a => a.severity === severity);
  },

  addAlert: (alert) => {
    const { alerts } = get();
    set({ alerts: [alert, ...alerts] });
  },

  clearError: () => set({ error: null }),
}));

export default useAlertStore;
