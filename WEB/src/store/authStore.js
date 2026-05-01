import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        const result = await authService.login(email, password);
        
        if (result.success) {
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } else {
          set({
            error: result.error,
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      getUserRole: () => {
        const { user } = get();
        return user?.role || null;
      },

      getUserName: () => {
        const { user } = get();
        return user?.name || 'User';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;