import axios from 'axios';

const API_BASE = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  getToken: () => localStorage.getItem('auth_token'),
  
  isAuthenticated: () => !!localStorage.getItem('auth_token'),
};

export const userService = {
  getAll: async (limit = 10, skip = 0) => {
    const response = await api.get(`/users?limit=${limit}&skip=${skip}`);
    return response.data;
  },
};

export const productService = {
  getAll: async (limit = 10, skip = 0) => {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};