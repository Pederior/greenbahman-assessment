import { create } from 'zustand';
import { authService } from '../../services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: authService.isAuthenticated(),
  user: (() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined') return null;
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  })(),

  login: (token, user) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  
  logout: () => {
    authService.logout();
    set({ isAuthenticated: false, user: null });
  },
  
  checkAuth: () => authService.isAuthenticated(),
}));