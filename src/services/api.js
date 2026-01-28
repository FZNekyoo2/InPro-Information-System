import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// Pegawai endpoints
export const getAllPegawai = async () => {
  const response = await api.get('/pegawai');
  return response.data;
};

export const getPegawaiById = async (id) => {
  const response = await api.get(`/pegawai/${id}`);
  return response.data;
};

export const createPegawai = async (data) => {
  const response = await api.post('/pegawai', data);
  return response.data;
};

export const updatePegawai = async (id, data) => {
  const response = await api.put(`/pegawai/${id}`, data);
  return response.data;
};

export const deletePegawai = async (id) => {
  const response = await api.delete(`/pegawai/${id}`);
  return response.data;
};

export default api;
