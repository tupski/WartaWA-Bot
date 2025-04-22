import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8005/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (name, email, password) => apiClient.post('/auth/register', { name, email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
};

// WhatsApp API
export const whatsappAPI = {
  initialize: () => apiClient.post('/whatsapp/initialize'),
  sendMessage: (number, message) => apiClient.post('/whatsapp/send', { number, message }),
  getStatus: () => apiClient.get('/whatsapp/status'),
  getQR: () => apiClient.get('/whatsapp/qr'),
  getHistory: () => apiClient.get('/whatsapp/history'),
  reset: () => apiClient.post('/whatsapp/reset'),
};

export default apiClient;
