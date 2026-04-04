import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Since we'll use Bearer tokens (or if you wanted cookies, you'd add withCredentials: true)
// Let's configure it to automatically attach the token if it exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('antarestar_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if it's unauthorized
      localStorage.removeItem('antarestar_token');
      localStorage.removeItem('antarestar_user');
      // Potential redirect or emit an event to context here
    }
    return Promise.reject(error);
  }
);

export default api;
