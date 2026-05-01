import axios from 'axios';

// In development, requests go through Vite proxy to localhost:5000
// In production, set VITE_API_URL in .env
const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('trainbook_user');
  if (savedUser) {
    const { token } = JSON.parse(savedUser);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
