import { authAPI } from './api';

const TOKEN_KEY = 'auth_token';


export const authService = {
 
  async login(email, password) {
    try {
      const data = await authAPI.login(email, password);
      
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      }
      
      return {
        success: false,
        error: 'No token received',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },


  isAuthenticated() {
    return !!this.getToken();
  },


  async verifyToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const data = await authAPI.verify(token);
      return data.valid;
    } catch (error) {
      console.error('Token verification error:', error);
      this.logout();
      return false;
    }
  },

  async getCurrentUser() {
    try {
      const user = await authAPI.getMe();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
};

export default authService;