import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

export const getArtworks = () => api.get('/artworks').then((r) => r.data);
export const getArtwork = (id) => api.get(`/artworks/${encodeURIComponent(id)}`).then((r) => r.data);
export const likeArtwork = (id) => api.post(`/artworks/${id}/like`).then((r) => r.data);
export const unlikeArtwork = (id) => api.delete(`/artworks/${id}/like`).then((r) => r.data);
export const registerView = (id) => api.post(`/artworks/${id}/view`).then((r) => r.data);
export const sendCommission = (payload) => api.post('/commissions', payload).then((r) => r.data);
export const sendContact = (payload) => api.post('/contact', payload).then((r) => r.data);

export const errorMessage = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || (err?.code === 'ERR_NETWORK' ? 'Cannot reach the server. Check your connection.' : fallback);

export default api;
