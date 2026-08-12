import axios from 'axios';
import { API } from '../constants';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API.DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function unwrap(response) {
  return response.data;
}

export const taskApi = {
  async list(params = {}) {
    const data = await unwrap(await apiClient.get('/tasks', { params }));
    return data.data;
  },

  async create(payload) {
    const data = await unwrap(await apiClient.post('/tasks', payload));
    return data.data;
  },

  async update(id, payload) {
    const data = await unwrap(await apiClient.put(`/tasks/${id}`, payload));
    return data.data;
  },

  async updateStatus(id, status) {
    const data = await unwrap(await apiClient.patch(`/tasks/${id}/status`, { status }));
    return data.data;
  },

  async remove(id) {
    const data = await unwrap(await apiClient.delete(`/tasks/${id}`));
    return data.data;
  },
};

export function getErrorMessage(error, fallback = 'Something went wrong') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.message ||
    error?.message ||
    fallback
  );
}
