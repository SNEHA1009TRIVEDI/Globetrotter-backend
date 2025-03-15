import axios from 'axios';
import { API_BASE_URL } from '../constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Attach Authorization Token Automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
