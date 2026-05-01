import { create } from 'zustand';
import { vehiclesAPI } from '../services/api';

const useFleetStore = create((set, get) => ({
  vehicles: [],
  loading: false,
  error: null,
  stats: null,

  fetchVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await vehiclesAPI.getAll();
      set({ vehicles: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      set({ 
        error: error.message || 'Error al cargar vehículos',
        loading: false 
      });
      return [];
    }
  },

  fetchStats: async () => {
    try {
      const response = await vehiclesAPI.getStats();
      set({ stats: response.data });
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  },

  getVehicleById: (id) => {
    const { vehicles } = get();
    return vehicles.find(v => v.id === id);
  },

  getActiveVehicles: () => {
    const { vehicles } = get();
    return vehicles.filter(v => v.status === 'active');
  },

  updateVehicle: (id, updates) => {
    const { vehicles } = get();
    set({
      vehicles: vehicles.map(v => 
        v.id === id ? { ...v, ...updates } : v
      ),
    });
  },

  clearError: () => set({ error: null }),
}));

export default useFleetStore;
