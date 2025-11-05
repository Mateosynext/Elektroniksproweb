// src/services/api.js (o el nombre de tu archivo)
import axios from 'axios';

// ✅ CORREGIDO: Usa el puerto correcto de tu backend (3001 según tus pruebas)
const API_BASE = 'http://localhost:3001/api';

// Configuración global de Axios
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    console.log('📤 Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Manejo específico de errores comunes
    if (error.response) {
      // El servidor respondió con un código de error
      switch (error.response.status) {
        case 400:
          error.message = error.response.data?.error || 'Solicitud incorrecta';
          break;
        case 401:
          error.message = 'No autorizado - Por favor inicia sesión';
          break;
        case 404:
          error.message = 'Recurso no encontrado';
          break;
        case 500:
          error.message = error.response.data?.error || 'Error interno del servidor';
          break;
        default:
          error.message = `Error ${error.response.status}: ${error.response.data?.error || 'Error desconocido'}`;
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      error.message = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
      // Algo pasó en la configuración de la solicitud
      error.message = error.message || 'Error de configuración de la solicitud';
    }
    
    return Promise.reject(error);
  }
);

export default api;