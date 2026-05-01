import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      if (token) {
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }

      return { success: true, user, token };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al iniciar sesión',
      };
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  async getStoredToken() {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },

  async getStoredUser() {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  async verifyToken() {
    try {
      const response = await authAPI.verify();
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Verify token error:', error);
      return { success: false };
    }
  },
};
