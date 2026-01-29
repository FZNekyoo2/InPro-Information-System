import api from './api';

export const getAllSurat = async () => {
  const response = await api.get('/surat');
  return response.data;
};

export const getSuratById = async (id) => {
  const response = await api.get(`/surat/${id}`);
  return response.data;
};

export const createSurat = async (data) => {
  const response = await api.post('/surat', data);
  return response.data;
};

export const updateSurat = async (id, data) => {
  const response = await api.put(`/surat/${id}`, data);
  return response.data;
};

export const deleteSurat = async (id) => {
  const response = await api.delete(`/surat/${id}`);
  return response.data;
};

export const trackSurat = async (kodeUnikOrNomor) => {
  // Bisa track menggunakan kode unik atau nomor surat
  const response = await api.get(`/surat/track?search=${encodeURIComponent(kodeUnikOrNomor)}`);
  return response.data;
};

export const updateTracking = async (suratId, trackingData) => {
  const response = await api.post(`/surat/${suratId}/tracking`, trackingData);
  return response.data;
};
