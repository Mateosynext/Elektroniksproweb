// src/hooks/useInventory.js - VERSIÓN CORREGIDA
import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';

export const useInventory = (showToast) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  // ✅ Cargar inventario desde backend
  const loadInventory = useCallback(async () => {
    console.log('🔄 useInventory: Cargando productos del backend...');
    setIsLoading(true);
    setError(null);

    try {
      const response = await inventoryService.getProducts();
      console.log('✅ useInventory: Productos cargados del backend:', response);

      const products = response.data || [];

      // 🧠 Normalizar siempre a stock, minStock y maxStock
      const normalizedProducts = products.map((p) => ({
        ...p,
        stock:
          typeof p.currentStock === 'number'
            ? p.currentStock
            : p.stock || 0,
        minStock:
          typeof p.minimumStock === 'number'
            ? p.minimumStock
            : p.minStock || 0,
        maxStock:
          typeof p.maximumStock === 'number'
            ? p.maximumStock
            : p.maxStock || 0,
      }));

      setInventoryData(normalizedProducts);
      return normalizedProducts;
    } catch (err) {
      console.error('❌ useInventory: Error cargando productos:', err);
      const message = err.message || 'Error al conectar con el servidor';
      setError(message);
      if (showToast) showToast(`❌ ${message}`, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // ✅ Cargar analytics desde backend
  const loadAnalytics = useCallback(async () => {
    console.log('🔄 useInventory: Cargando analytics...');
    try {
      const response = await inventoryService.getDashboardAnalytics();
      console.log('✅ useInventory: Analytics cargados:', response);
      setAnalytics(response.data || {});
      return response.data;
    } catch (err) {
      console.error('❌ useInventory: Error cargando analytics:', err);
      return null;
    }
  }, []);

  // ✅ CORREGIDO: Crear producto
  const addProduct = useCallback(
    async (productData) => {
      console.log('🔄 useInventory: Creando producto...', productData);
      setIsLoading(true);

      try {
        // 🧩 DEBUG: Ver qué datos llegan realmente
        console.log('🔍 useInventory - Datos recibidos en addProduct:', {
          currentStock: productData.currentStock,
          stock: productData.stock,
          allData: productData
        });

        // ✅ CORREGIDO: Mapear correctamente los nombres
        const backendProduct = {
          code: productData.code || productData.sku || `PROD-${Date.now()}`,
          name: productData.name,
          description: productData.description || '',
          category: productData.category || 'general',
          unit: productData.unit || 'piece',
          cost: Number(productData.cost) || 0,
          price: Number(productData.price) || 0,
          // ✅ ACEPTAR AMBOS FORMATOS
          currentStock: Number(productData.currentStock) || Number(productData.stock) || 0,
          minimumStock: Number(productData.minimumStock) || Number(productData.minStock) || 0,
          maximumStock: productData.maximumStock ? Number(productData.maximumStock) : 
                       (productData.maxStock ? Number(productData.maxStock) : null),
          location: productData.location || 'default',
          supplier: productData.supplier || 'Unknown',
          barcode: productData.barcode || '',
          status: 'active',
        };

        console.log('🚀 useInventory - Enviando al backend:', backendProduct);
        console.log('🔍 useInventory - currentStock enviado:', backendProduct.currentStock);

        const response = await inventoryService.createProduct(backendProduct);
        console.log('✅ useInventory: Producto creado:', response);

        if (response.success) {
          const p = response.data;
          const transformed = {
            ...p,
            stock: p.currentStock || 0,
            minStock: p.minimumStock || 0,
            maxStock: p.maximumStock || 0,
          };

          setInventoryData((prev) => [...prev, transformed]);
          if (showToast) showToast('✅ Producto agregado correctamente', 'success');
          return transformed;
        } else {
          throw new Error(response.error || 'Error al crear producto');
        }
      } catch (err) {
        console.error('❌ useInventory: Error creando producto:', err);
        setError(err.message || 'Error al crear producto');
        if (showToast) showToast(`❌ ${err.message}`, 'error');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  // ✅ Actualizar producto
  const updateProduct = useCallback(
    async (productId, updates) => {
      console.log('🔄 useInventory: Actualizando producto...', productId, updates);
      setIsLoading(true);

      try {
        // 🔧 Mapear correctamente los nombres
        const backendUpdates = {
          ...updates,
          currentStock:
            updates.stock !== undefined ? Number(updates.stock) : undefined,
          minimumStock:
            updates.minStock !== undefined ? Number(updates.minStock) : undefined,
          maximumStock:
            updates.maxStock !== undefined ? Number(updates.maxStock) : undefined,
        };

        Object.keys(backendUpdates).forEach((k) => {
          if (backendUpdates[k] === undefined) delete backendUpdates[k];
        });

        const response = await inventoryService.updateProduct(
          productId,
          backendUpdates
        );
        console.log('✅ useInventory: Producto actualizado:', response);

        if (response.success) {
          const p = response.data;
          const updated = {
            ...p,
            stock: p.currentStock || 0,
            minStock: p.minimumStock || 0,
            maxStock: p.maximumStock || 0,
          };

          setInventoryData((prev) =>
            prev.map((item) =>
              item._id === productId ? { ...item, ...updated } : item
            )
          );
          if (showToast) showToast('✅ Producto actualizado', 'success');
          return updated;
        } else {
          throw new Error(response.error || 'Error al actualizar producto');
        }
      } catch (err) {
        console.error('❌ useInventory: Error actualizando producto:', err);
        setError(err.message || 'Error al actualizar producto');
        if (showToast) showToast(`❌ ${err.message}`, 'error');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  // ✅ Eliminar producto
  const deleteProduct = useCallback(
    async (productId) => {
      console.log('🗑️ useInventory: Eliminando producto...', productId);
      const prevData = [...inventoryData];
      setInventoryData((prev) => prev.filter((i) => i._id !== productId));
      setIsLoading(true);

      try {
        const response = await inventoryService.deleteProduct(productId);
        console.log('✅ useInventory: Producto eliminado:', response);
        if (response.success) {
          if (showToast) showToast('✅ Producto eliminado', 'success');
        } else {
          throw new Error(response.error || 'Error al eliminar producto');
        }
      } catch (err) {
        console.error('❌ useInventory: Error al eliminar:', err);
        setInventoryData(prevData);
        setError(err.message || 'Error al eliminar producto');
        if (showToast) showToast(`❌ ${err.message}`, 'error');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [inventoryData, showToast]
  );

  // ✅ Obtener producto por ID
  const getProductById = useCallback(async (productId) => {
    try {
      const response = await inventoryService.getProductById(productId);
      if (response.success) {
        const p = response.data;
        return {
          ...p,
          stock: p.currentStock || 0,
          minStock: p.minimumStock || 0,
          maxStock: p.maximumStock || 0,
        };
      } else {
        throw new Error(response.error || 'Producto no encontrado');
      }
    } catch (err) {
      console.error('❌ useInventory: Error al obtener producto por ID:', err);
      throw err;
    }
  }, []);

  // 🔍 Buscar localmente
  const searchProducts = useCallback(
    (term) => {
      if (!term) return inventoryData;
      return inventoryData.filter(
        (i) =>
          i.name?.toLowerCase().includes(term.toLowerCase()) ||
          i.code?.toLowerCase().includes(term.toLowerCase()) ||
          i.category?.toLowerCase().includes(term.toLowerCase()) ||
          i.supplier?.toLowerCase().includes(term.toLowerCase())
      );
    },
    [inventoryData]
  );

  // 🔄 Refrescar datos
  const refreshData = useCallback(async () => {
    await Promise.all([loadInventory(), loadAnalytics()]);
  }, [loadInventory, loadAnalytics]);

  // 📥 Cargar al montar
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // 🧹 Limpiar error
  const clearError = useCallback(() => setError(null), []);

  // 📊 Métricas
  const metrics = useCallback(() => {
    const products = inventoryData;
    return {
      totalProducts: products.length,
      lowStockProducts: products.filter(
        (p) => (p.stock || 0) <= (p.minStock || 0)
      ).length,
      outOfStockProducts: products.filter((p) => (p.stock || 0) === 0).length,
      totalInventoryValue: products.reduce(
        (sum, p) => sum + (p.cost || 0) * (p.stock || 0),
        0
      ),
      categories: [...new Set(products.map((p) => p.category))],
      suppliers: [...new Set(products.map((p) => p.supplier))],
      locations: [...new Set(products.map((p) => p.location))],
    };
  }, [inventoryData]);

  return {
    inventoryData,
    analytics,
    isLoading,
    error,
    loadInventory,
    loadAnalytics,
    refreshData,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    searchProducts,
    clearError,
    metrics: metrics(),
    ...metrics(),
  };
};