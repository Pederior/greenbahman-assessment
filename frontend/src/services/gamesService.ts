import axios from 'axios';

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = import.meta.env.VITE_RAWG_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const gamesService = {
  getAll: async (params: Record<string, string>) => {
    // Filter out empty parameters
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([value]) => value !== '' && value !== undefined)
    );
    const response = await api.get('/games', { params: cleanParams });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  getGenres: async () => {
    const response = await api.get('/genres');
    return response.data.results;
  },
};