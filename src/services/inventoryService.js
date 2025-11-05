// src/services/inventoryService.js
import api from './api';

export const inventoryService = {
  getProducts: async () => {
    try {
      const response = await api.get('/inventory');
      console.log('✅ inventoryService - Productos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ inventoryService - Error obteniendo productos:', error);
      throw new Error(error.message || 'Error al cargar productos');
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ inventoryService - Error obteniendo producto por ID:', error);
      throw new Error(error.message || 'Error al cargar el producto');
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/inventory', productData);
      console.log('✅ inventoryService - Producto creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ inventoryService - Error creando producto:', error);
      throw new Error(error.message || 'Error al crear producto');
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const response = await api.put(`/inventory/${id}`, updates);
      console.log('✅ inventoryService - Producto actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ inventoryService - Error actualizando producto:', error);
      throw new Error(error.message || 'Error al actualizar producto');
    }
  },

  deleteProduct: async (id) => {
    try {
      console.log('🔄 inventoryService: Enviando DELETE para producto ID:', id);
      console.log('📋 URL completa:', `/inventory/${id}`);
      
      const response = await api.delete(`/inventory/${id}`);
      console.log('✅ inventoryService: Respuesta DELETE exitosa:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ inventoryService: Error en deleteProduct:', {
        id: id,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.error 
        || error.message 
        || 'Error desconocido al eliminar producto';
      
      throw new Error(errorMessage);
    }
  },

  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/inventory/analytics/dashboard');
      console.log('✅ inventoryService - Analytics obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ inventoryService - Error obteniendo analytics:', error);
      throw new Error(error.message || 'Error al cargar analytics');
    }
  }
};