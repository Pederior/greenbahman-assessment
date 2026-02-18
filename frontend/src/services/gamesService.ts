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
    const { genres, ...restParams } = params;
    
    const finalParams: Record<string, string> = { ...restParams };
    
    if (genres && genres.trim() !== '') {
      finalParams.genres = genres;
    }

    const response = await api.get('/games', { params: finalParams });
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