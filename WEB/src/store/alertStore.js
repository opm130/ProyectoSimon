import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { alertsAPI } from '../services/api';
import { mockAlerts } from '../shared/utils/mockData';
import offlineService from '../services/offlineService';

const useAlertStore = create(
  persist(
    (set, get) => ({
      // State
      alerts: [],
      unreadCount: 0,
      isLoading: false,
      error: null,

      initializeAlerts: () => {
        const { alerts } = get();
        if (alerts.length === 0) {
          set({ 
            alerts: mockAlerts,
            unreadCount: mockAlerts.filter(a => !a.read).length,
          });
        }
      },

      fetchAlerts: async (filters = {}) => {
        set({ isLoading: true, error: null });
        
        try {
          const alerts = await alertsAPI.getAll(filters);
          const unreadCount = alerts.filter(a => !a.read).length;
          
          set({
            alerts,
            unreadCount,
            isLoading: false,
          });
          return alerts;
        } catch (error) {
          console.warn('Backend no disponible, usando alertas locales');
          const { alerts } = get();
          if (alerts.length === 0) {
            set({ 
              alerts: mockAlerts,
              unreadCount: mockAlerts.filter(a => !a.read).length,
            });
          }
          set({ isLoading: false });
          return get().alerts;
        }
      },

      setAlerts: (alerts) => {
        set({ 
          alerts,
          unreadCount: alerts.filter(a => !a.read).length,
        });
      }, 

      markAsRead: async (alertId) => {
        if (!offlineService.checkConnection()) {
          offlineService.addToQueue({
            type: 'MARK_ALERT_READ',
            payload: { alertId },
          });
        } else {
          try {
            await alertsAPI.markAsRead(alertId);
          } catch (error) {
            console.error('Mark as read error:', error);
          }
        }

        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId ? { ...alert, read: true } : alert
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: async () => {
        const { alerts } = get();
        const unreadIds = alerts.filter(a => !a.read).map(a => a.id);

        if (!offlineService.checkConnection()) {
          offlineService.addToQueue({
            type: 'MARK_ALL_ALERTS_READ',
            payload: { alertIds: unreadIds },
          });
        } else {
          try {
            await alertsAPI.markAllAsRead();
          } catch (error) {
            console.error('Mark all as read error:', error);
          }
        }

        set((state) => ({
          alerts: state.alerts.map((alert) => ({ ...alert, read: true })),
          unreadCount: 0,
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'alerts-storage',
      partialize: (state) => ({
        alerts: state.alerts,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

export default useAlertStore;