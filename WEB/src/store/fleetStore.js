import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { vehiclesAPI } from '../services/api';
import { mockVehicles } from '../shared/utils/mockData';

const useFleetStore = create(
  persist(
    (set, get) => ({
      // State
      vehicles: [],
      stats: null,
      isLoading: false,
      error: null,
      lastFetch: null,
      useBackend: true, 

   
      initializeVehicles: () => {
        const { vehicles } = get();
        
        if (vehicles.length === 0) {
          set({ vehicles: mockVehicles });
        }
      },

      fetchVehicles: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const vehicles = await vehiclesAPI.getAll();
          set({
            vehicles,
            isLoading: false,
            lastFetch: new Date().toISOString(),
            useBackend: true,
          });
          return vehicles;
        } catch (error) {
          console.warn('Backend no disponible, usando datos locales');
          const { vehicles } = get();
          if (vehicles.length === 0) {
            set({ vehicles: mockVehicles });
          }
          set({
            isLoading: false,
            useBackend: false,
          });
          return get().vehicles;
        }
      },

      fetchStats: async () => {
        try {
          const stats = await vehiclesAPI.getStats();
          set({ stats });
          return stats;
        } catch (error) {
          console.warn('Stats no disponibles del backend');
          // Calcular stats localmente
          const { vehicles } = get();
          const stats = {
            total: vehicles.length,
            active: vehicles.filter(v => v.status === 'active').length,
            idle: vehicles.filter(v => v.status === 'idle').length,
            maintenance: vehicles.filter(v => v.status === 'maintenance').length,
            avgSpeed: vehicles.reduce((acc, v) => acc + v.speed, 0) / vehicles.length || 0,
            avgFuel: vehicles.reduce((acc, v) => acc + v.fuelLevel, 0) / vehicles.length || 0,
          };
          set({ stats });
          return stats;
        }
      },

      setVehicles: (vehicles) => set({ vehicles }),

      getVehicleById: (id) => {
        const { vehicles } = get();
        return vehicles.find(v => v.id === id);
      },

      getVehiclesByStatus: (status) => {
        const { vehicles } = get();
        return vehicles.filter(v => v.status === status);
      },

      getActiveVehicles: () => {
        const { vehicles } = get();
        return vehicles.filter(v => v.status === 'active');
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'fleet-storage',
      partialize: (state) => ({
        vehicles: state.vehicles,
        stats: state.stats,
        lastFetch: state.lastFetch,
      }),
    }
  )
);

export default useFleetStore;