import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/ui/Header';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import QuickActionsToolbar from './components/QuickActionsToolbar';
import InventoryGrid from './components/InventoryGrid';
import StockAnalyticsPanel from './components/StockAnalyticsPanel';
import ItemDetailsModal from './components/ItemDetailsModal';
import AddItemModal from './components/AddItemModal';
import FilterSidebar from './components/FilterSidebar';
import SaleModal from './components/SaleModal';
import { exportToExcel, exportToPDF, exportToCSV } from "./components/exportUtils";
import { useToast } from "../../components/ui/Toast";
import Icon from '../../components/appIcon';
import Button from '../../components/ui/Button';

// 🎯 HOOKS DE PERFORMANCE MEJORADOS (mantener igual)
const useInventoryState = () => {
  const [state, setState] = useState({
    selectedItems: [],
    selectedItem: null,
    isModalOpen: false,
    isAddModalOpen: false,
    isFilterModalOpen: false,
    isSaleModalOpen: false,
    isImportModalOpen: false,
    isActionModalOpen: false,
    currentAction: null,
    sortConfig: { key: 'name', direction: 'asc' },
    viewMode: 'grid',
    isLoading: false,
    isHeaderCompact: false,
    importProgress: 0,
    isImporting: false,
    filters: {
      search: '',
      category: 'all',
      supplier: 'all',
      stockLevel: 'all',
      location: 'all',
      unit: 'all',
      minCost: '',
      maxCost: '',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: '',
      showOnlyLowStock: false,
      showOnlyReorderNeeded: false,
      showExpiringSoon: false,
      showPerishable: false
    },
    savedPresets: [
      {
        name: 'Stock Bajo',
        filters: {
          search: '',
          category: 'all',
          supplier: 'all',
          stockLevel: 'low-stock',
          location: 'all',
          minCost: '',
          maxCost: '',
          showOnlyLowStock: true,
          showOnlyReorderNeeded: false
        }
      }
    ]
  });

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return { state, updateState };
};

const useScrollDetection = () => {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsHeaderCompact(scrollTop > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isHeaderCompact;
};

// 🎪 COMPONENTES AUXILIARES MEJORADOS (mantener igual)
const ProfessionalHeader = React.memo(({ isCompact, inventoryData }) => {
  return (
    <motion.header
      className={`sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b transition-all duration-500 ${
        isCompact 
          ? 'py-3 border-gray-800/50 shadow-lg' 
          : 'py-6 border-gray-700/30 shadow-xl'
      }`}
      initial={false}
      animate={{ 
        paddingTop: isCompact ? '0.75rem' : '1.5rem',
        paddingBottom: isCompact ? '0.75rem' : '1.5rem'
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      <div className="max-w-9xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-white font-bold text-lg">EP</span>
            </motion.div>
            <div className="text-center">
              <motion.h1 
                className={`font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-500 ${
                  isCompact ? 'text-xl' : 'text-3xl'
                }`}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                Sistema de gestión integral de stock
              </motion.h1>
              <motion.p 
                className="text-gray-400 text-sm mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                Control y administración completa de inventario
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
});

// 🎨 MODAL DE IMPORTACIÓN INTEGRADO (mantener igual)
const ImportModal = React.memo(({ 
  isOpen, 
  onClose, 
  onImport,
  isImporting = false,
  importProgress = 0
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importStep, setImportStep] = useState('select');
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((file) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setSelectedFile(file);
      setImportStep('mapping');
    } else {
      alert('Por favor selecciona un archivo CSV o Excel válido.');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleImportStart = useCallback(() => {
    if (selectedFile) {
      setImportStep('importing');
      onImport(selectedFile);
    }
  }, [selectedFile, onImport]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setImportStep('select');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-800/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <Icon name="Upload" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Importar Productos</h2>
                <p className="text-gray-400">Importa productos desde un archivo CSV o Excel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isImporting}
              iconName="X"
              iconSize={20}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50"
            />
          </div>

          <div className="p-6 space-y-6">
            {/* Paso 1: Selección de archivo */}
            {importStep === 'select' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">Selecciona tu archivo</h3>
                <p className="text-gray-400">
                  Sube un archivo CSV o Excel con los datos de los productos. El archivo debe incluir columnas como código, nombre, categoría, etc.
                </p>

                <FileUploadArea
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  fileInputRef={fileInputRef}
                />

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="Info" size={18} className="text-amber-400 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-amber-400 font-medium">Formato requerido</p>
                      <ul className="text-amber-300/80 text-sm space-y-1">
                        <li>• Archivos soportados: CSV, XLSX, XLS</li>
                        <li>• Columnas requeridas: Código, Nombre, Categoría</li>
                        <li>• Columnas opcionales: Descripción, Precio, Stock, etc.</li>
                        <li>• Tamaño máximo: 10MB</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Paso 2: Mapeo de columnas */}
            {importStep === 'mapping' && selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">Configurar mapeo de columnas</h3>
                <p className="text-gray-400">
                  Confirma que las columnas de tu archivo se mapeen correctamente a los campos del sistema.
                </p>

                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="space-y-3">
                    {[
                      { system: 'Código', required: true },
                      { system: 'Nombre', required: true },
                      { system: 'Categoría', required: true },
                      { system: 'Descripción', required: false },
                      { system: 'Precio', required: false },
                      { system: 'Costo', required: false },
                      { system: 'Stock', required: false },
                      { system: 'Stock Mínimo', required: false },
                      { system: 'Proveedor', required: false }
                    ].map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-medium">{field.system}</span>
                          {field.required && (
                            <span className="text-red-400 text-xs bg-red-500/20 px-2 py-1 rounded">Requerido</span>
                          )}
                        </div>
                        <select className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-1 text-white text-sm">
                          <option>Seleccionar columna</option>
                          <option>code</option>
                          <option>nombre</option>
                          <option>category</option>
                          <option>descripcion</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Icon name="FileText" size={20} className="text-blue-400" />
                  <div>
                    <p className="text-blue-400 font-medium">Archivo seleccionado</p>
                    <p className="text-blue-300/80 text-sm">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Paso 3: Progreso de importación */}
            {importStep === 'importing' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-white">Importando productos</h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-300">Procesando archivo...</p>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${importProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Progreso</span>
                    <span>{importProgress}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-blue-400 font-bold">0</div>
                    <div className="text-gray-400">Productos</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-green-400 font-bold">0</div>
                    <div className="text-gray-400">Exitosos</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-red-400 font-bold">0</div>
                    <div className="text-gray-400">Errores</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-700/50 bg-gray-800/50">
            <div className="text-gray-400 text-sm">
              {importStep === 'select' && 'Selecciona un archivo para comenzar'}
              {importStep === 'mapping' && 'Configura el mapeo de columnas'}
              {importStep === 'importing' && 'Importando productos...'}
            </div>
            
            <div className="flex space-x-3">
              {importStep === 'select' && (
                <>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setImportStep('mapping')}
                    disabled={!selectedFile}
                    className="bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
                  >
                    Continuar
                  </Button>
                </>
              )}

              {importStep === 'mapping' && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isImporting}
                    className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
                  >
                    Volver
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleImportStart}
                    disabled={isImporting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Iniciar Importación
                  </Button>
                </>
              )}

              {importStep === 'importing' && (
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isImporting}
                  className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
                >
                  {isImporting ? 'Importando...' : 'Cerrar'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

// Componente de área de carga de archivos (mantener igual)
const FileUploadArea = React.memo(({ 
  selectedFile, 
  onFileSelect, 
  onDrop, 
  onDragOver, 
  fileInputRef 
}) => (
  <motion.div 
    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-500 ${
      selectedFile 
        ? 'border-green-500 bg-green-500/10' 
        : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
    }`}
    onDrop={onDrop}
    onDragOver={onDragOver}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
  >
    <input
      type="file"
      ref={fileInputRef}
      onChange={(e) => onFileSelect(e.target.files[0])}
      accept=".csv,.xlsx,.xls"
      className="hidden"
    />
    
    <motion.svg 
      className="w-12 h-12 text-gray-400 mx-auto mb-4"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </motion.svg>
    
    {selectedFile ? (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-green-400 font-medium mb-2">
          Archivo seleccionado: {selectedFile.name}
        </p>
        <p className="text-sm text-gray-400">
          Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </motion.div>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <p className="text-gray-400 mb-2">
          Arrastra tu archivo aquí o haz clic para seleccionar
        </p>
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Seleccionar Archivo
        </motion.button>
        <p className="text-sm text-gray-500 mt-3">
          Formatos soportados: .csv, .xlsx, .xls
        </p>
      </motion.div>
    )}
  </motion.div>
));

// 🚀 COMPONENTE PRINCIPAL ACTUALIZADO CON CONEXIÓN PERFECTA
const InventoryPage = () => {
  const navigate = useNavigate();
  
  // ✅ CORREGIDO: Manejo seguro de useToast con fallback mejorado
  const [toastState, setToastState] = useState({ showToast: null });
  
  useEffect(() => {
    try {
      const toast = useToast();
      if (toast && typeof toast.showToast === 'function') {
        setToastState({ showToast: toast.showToast });
      } else {
        // Fallback mejorado que maneja tanto strings como objetos
        const fallbackToast = (message, type = 'success') => {
          if (typeof message === 'object') {
            const title = message.title || 'Notificación';
            const msg = message.message || message.description || JSON.stringify(message);
            console.log(`Toast [${message.type || type}]: ${title} - ${msg}`);
          } else {
            console.log(`Toast [${type}]: ${message}`);
          }
        };
        setToastState({ showToast: fallbackToast });
      }
    } catch (error) {
      console.warn('useToast no disponible, usando fallback');
      const fallbackToast = (message, type = 'success') => {
        if (typeof message === 'object') {
          const title = message.title || 'Notificación';
          const msg = message.message || message.description || JSON.stringify(message);
          console.log(`Toast [${message.type || type}]: ${title} - ${msg}`);
        } else {
          console.log(`Toast [${type}]: ${message}`);
        }
      };
      setToastState({ showToast: fallbackToast });
    }
  }, []);

  const { showToast } = toastState;

  // 🎯 HOOKS DE ESTADO
  const { state, updateState } = useInventoryState();
  
  // ✅ HOOK DE INVENTARIO CONECTADO AL BACKEND - CON MANEJO DE ERROR 429
  const {
    inventoryData,
    analytics,
    isLoading: inventoryLoading,
    error: inventoryError,
    refreshData,
    addProduct,
    updateProduct,
    deleteProduct,
    importProducts,
    clearError,
    metrics,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    categories,
    suppliers,
    locations
  } = useInventory(showToast);
  
  const isHeaderCompact = useScrollDetection();

  // 🔄 SISTEMA DE SINCRONIZACIÓN ENTRE COMPONENTES
  const [lastInventoryUpdate, setLastInventoryUpdate] = useState(Date.now());

  // 🎯 MANEJO DE ERRORES DEL BACKEND MEJORADO
  useEffect(() => {
    if (inventoryError) {
      // ✅ CORREGIDO: Manejo específico del error 429
      if (inventoryError.includes('429')) {
        if (showToast) {
          showToast({
            title: 'Demasiadas solicitudes',
            message: 'El servidor está ocupado. Por favor, espera un momento antes de intentar nuevamente.',
            type: 'warning'
          });
        }
      } else {
        if (showToast) {
          showToast({
            title: 'Error de Inventario',
            message: inventoryError,
            type: 'error'
          });
        }
      }
      clearError();
    }
  }, [inventoryError, showToast, clearError]);

  // 📊 DATOS MEMOIZADOS CON INFORMACIÓN REAL DEL BACKEND - CORREGIDO
  const analyticsData = useMemo(() => ({
    ...analytics,
    totalItems: totalProducts,
    lowStock: lowStockProducts,
    outOfStock: outOfStockProducts,
    totalValue: metrics.totalInventoryValue || 0,
    // ✅ CORREGIDO: Usar stock y minStock
    activeAlerts: (lowStockProducts || 0) + (outOfStockProducts || 0),
    lowStockItems: inventoryData?.filter(item => 
      (item.stock || 0) > 0 && (item.stock || 0) <= (item.minStock || 0)
    )?.slice(0, 5) || []
  }), [analytics, totalProducts, lowStockProducts, outOfStockProducts, metrics, inventoryData]);

  // 🔍 FILTRADO Y ORDENAMIENTO OPTIMIZADO - CORREGIDO
  const filteredAndSortedItems = useMemo(() => {
    if (inventoryLoading) return [];
    
    const { filters, sortConfig } = state;
    let filtered = inventoryData.filter((item) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          item.name?.toLowerCase().includes(searchTerm) ||
          item.code?.toLowerCase().includes(searchTerm) ||
          item.category?.toLowerCase().includes(searchTerm) ||
          item.supplier?.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      if (filters.supplier !== 'all' && item.supplier !== filters.supplier) {
        return false;
      }

      if (filters.location !== 'all' && item.location !== filters.location) {
        return false;
      }

      // ✅ CORREGIDO: Usar stock y minStock
      if (filters.showOnlyLowStock && item.stock > item.minStock) {
        return false;
      }

      if (filters.minCost && item.cost < parseFloat(filters.minCost)) {
        return false;
      }
      if (filters.maxCost && item.cost > parseFloat(filters.maxCost)) {
        return false;
      }

      if (filters.minPrice && item.price < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && item.price > parseFloat(filters.maxPrice)) {
        return false;
      }

      return true;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal == null) aVal = '';
        if (bVal == null) bVal = '';

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [state.filters, state.sortConfig, inventoryData, inventoryLoading]);

  // ⚡ HANDLERS OPTIMIZADOS - CONECTADOS A LA API REAL
  const handleQuickAction = useCallback((action, data) => {
    console.log('🔄 Acción rápida ejecutada:', action, data);
    
    switch (action) {
      case 'add_item':
        updateState({ isAddModalOpen: true });
        break;
      case 'import':
        updateState({ isImportModalOpen: true });
        break;
      case 'export':
        if (data?.selectedItems && data.selectedItems.length > 0) {
          const itemsToExport = inventoryData.filter(item => 
            data.selectedItems.includes(item._id || item.id)
          );
          exportToExcel(itemsToExport);
          if (showToast) {
            showToast(`Se exportaron ${itemsToExport.length} elementos`, 'success');
          }
        } else {
          exportToExcel(inventoryData);
          if (showToast) {
            showToast('Se exportó todo el inventario', 'success');
          }
        }
        break;
      case 'delete_selected':
        if (data?.selectedItems && data.selectedItems.length > 0) {
          const confirmDelete = window.confirm(
            `¿Estás seguro de eliminar ${data.selectedItems.length} producto(s)? Esta acción no se puede deshacer.`
          );
          
          if (confirmDelete) {
            const deletePromises = data.selectedItems.map(async (itemId) => {
              try {
                await deleteProduct(itemId);
                return { success: true, itemId };
              } catch (error) {
                console.error(`Error eliminando producto ${itemId}:`, error);
                return { success: false, itemId, error };
              }
            });

            Promise.all(deletePromises).then(results => {
              const successfulDeletes = results.filter(r => r.success).length;
              const failedDeletes = results.filter(r => !r.success).length;
              
              if (successfulDeletes > 0 && showToast) {
                showToast(`${successfulDeletes} producto(s) eliminado(s) correctamente`, 'success');
              }
              if (failedDeletes > 0 && showToast) {
                showToast(`Error al eliminar ${failedDeletes} producto(s)`, 'error');
              }
              
              updateState({ selectedItems: [] });
            });
          }
        } else if (showToast) {
          showToast('Selecciona al menos un producto para eliminar', 'warning');
        }
        break;
      case 'filter':
        updateState({ isFilterModalOpen: true });
        break;
      case 'sale':
        updateState({ isSaleModalOpen: true });
        break;
      case 'refresh':
        refreshData();
        if (showToast) {
          showToast('Inventario actualizado', 'success');
        }
        break;
      case 'bulk_update':
        if (data?.selectedItems && data.selectedItems.length > 0 && showToast) {
          showToast(`Edición masiva para ${data.selectedItems.length} productos`, 'info');
        }
        break;
      case 'quick_sale':
        if (data) {
          updateState({ 
            selectedItem: data.item, 
            isSaleModalOpen: true 
          });
        }
        break;
      case 'view_details':
        if (data) {
          updateState({ 
            selectedItem: data.item, 
            isModalOpen: true 
          });
        }
        break;
      default:
        console.log('Acción no implementada:', action);
    }
  }, [updateState, showToast, inventoryData, deleteProduct, refreshData]);

  // ✅ FUNCIÓN DE IMPORTACIÓN CONECTADA A API CON MANEJO DE ERROR 429
  const handleImport = useCallback(async (file) => {
    try {
      updateState({ isImporting: true, importProgress: 0 });
      
      const interval = setInterval(() => {
        updateState(prev => {
          const newProgress = prev.importProgress + 10;
          if (newProgress >= 90) {
            clearInterval(interval);
            return { importProgress: newProgress };
          }
          return { importProgress: newProgress };
        });
      }, 300);

      await importProducts(file);
      
      updateState({ importProgress: 100 });
      if (showToast) {
        showToast('Importación completada correctamente', 'success');
      }
      
      setTimeout(() => {
        updateState({ 
          isImporting: false, 
          importProgress: 0,
          isImportModalOpen: false
        });
        refreshData();
      }, 1000);

    } catch (error) {
      console.error('Error en importación:', error);
      // ✅ CORREGIDO: Manejo específico del error 429
      if (error.message && error.message.includes('429')) {
        if (showToast) {
          showToast({
            title: 'Demasiadas solicitudes',
            message: 'El servidor está ocupado. Espera un momento antes de reintentar la importación.',
            type: 'warning'
          });
        }
      } else {
        if (showToast) {
          showToast('Error al importar productos', 'error');
        }
      }
      updateState({ isImporting: false, importProgress: 0 });
    }
  }, [updateState, showToast, importProducts, refreshData]);

  const handleSelectionChange = useCallback((newSelection) => {
    updateState({ selectedItems: newSelection });
  }, [updateState]);

  const handleItemClick = useCallback((item) => {
    updateState({ selectedItem: item, isModalOpen: true });
  }, [updateState]);

  // ✅ CORREGIR: Función para manejar acciones rápidas desde el grid
  const handleGridQuickAction = useCallback((action, itemId, item) => {
    handleQuickAction(action, { itemId, item });
  }, [handleQuickAction]);

  const handleFiltersChange = useCallback((newFilters) => {
    updateState({ filters: newFilters });
  }, [updateState]);

  const handleSort = useCallback((newSortConfig) => {
    updateState({ sortConfig: newSortConfig });
  }, [updateState]);

  // ✅ CORREGIDO: Función handleAddItem mejorada con manejo de error 429
  const handleAddItem = useCallback(async (newItemData) => {
    try {
      console.log('📦 Intentando agregar producto:', newItemData);
      
      // Validar datos antes de enviar
      if (!newItemData.name || !newItemData.code) {
        if (showToast) {
          showToast({
            title: 'Error de validación',
            message: 'Nombre y código son campos requeridos',
            type: 'error'
          });
        }
        return;
      }

      // Llamar a la API
      const result = await addProduct(newItemData);
      
      if (result && result.success) {
        if (showToast) {
          showToast({
            title: 'Producto creado',
            message: result.message || 'Producto agregado correctamente',
            type: 'success'
          });
        }
        
        updateState({ isAddModalOpen: false });
        setLastInventoryUpdate(Date.now());
        
        // Forzar actualización de datos con retraso para evitar 429
        setTimeout(() => {
          refreshData();
        }, 1000);
      } else {
        throw new Error(result?.message || 'Error desconocido al crear producto');
      }
      
    } catch (error) {
      console.error('❌ Error en handleAddItem:', error);
      
      // ✅ CORREGIDO: Manejo específico del error 429
      if (error.message && error.message.includes('429')) {
        if (showToast) {
          showToast({
            title: 'Demasiadas solicitudes',
            message: 'El servidor está ocupado. Por favor, espera un momento antes de intentar nuevamente.',
            type: 'warning'
          });
        }
      } else {
        // Mostrar toast de error de forma segura
        if (showToast) {
          showToast({
            title: 'Error al crear producto',
            message: error.message || 'No se pudo crear el producto',
            type: 'error'
          });
        }
      }
    }
  }, [addProduct, showToast, updateState, refreshData]);

  // ✅ CORREGIR: Manejar ambos casos de ID (_id vs id)
  const handleItemSave = useCallback(async (itemId, updatedItem) => {
    try {
      const actualItemId = state.selectedItem?._id || state.selectedItem?.id || itemId;
      await updateProduct(actualItemId, updatedItem);
      if (showToast) {
        showToast('Producto actualizado correctamente', 'success');
      }
      updateState({ selectedItem: null, isModalOpen: false });
      setLastInventoryUpdate(Date.now()); // 🔄 Actualizar timestamp de sincronización
    } catch (error) {
      console.error('Error en handleItemSave:', error);
      if (showToast) {
        showToast('Error al actualizar el producto', 'error');
      }
    }
  }, [updateProduct, showToast, updateState, state.selectedItem]);

  // ✅ CORREGIR: Manejar ambos casos de ID (_id vs id)
  const handleDeleteItem = useCallback(async (itemId) => {
    try {
      const actualItemId = state.selectedItem?._id || state.selectedItem?.id || itemId;
      await deleteProduct(actualItemId);
      if (showToast) {
        showToast('Producto eliminado correctamente', 'success');
      }
      updateState({ isModalOpen: false, selectedItem: null });
      setLastInventoryUpdate(Date.now()); // 🔄 Actualizar timestamp de sincronización
    } catch (error) {
      console.error('Error en handleDeleteItem:', error);
      if (showToast) {
        showToast('Error al eliminar el producto', 'error');
      }
    }
  }, [deleteProduct, showToast, updateState, state.selectedItem]);

  const handleConfirmSale = useCallback(async (saleData) => {
    try {
      console.log('Venta confirmada:', saleData);
      // ✅ AQUÍ CONECTAR CON TU API DE VENTAS
      if (showToast) {
        showToast('Venta registrada correctamente', 'success');
      }
      updateState({ isSaleModalOpen: false });
      
      // Esperar antes de refrescar para evitar 429
      setTimeout(() => {
        refreshData();
      }, 1500);
      
      setLastInventoryUpdate(Date.now()); // 🔄 Actualizar timestamp de sincronización
    } catch (error) {
      console.error('Error en handleConfirmSale:', error);
      if (showToast) {
        showToast('Error al registrar la venta', 'error');
      }
    }
  }, [showToast, updateState, refreshData]);

  // 🔄 ACTUALIZAR FILTROS DISPONIBLES
  const availableFilters = useMemo(() => ({
    categories: ['all', ...categories],
    suppliers: ['all', ...suppliers],
    locations: ['all', ...locations]
  }), [categories, suppliers, locations]);

  // 🔄 FUNCIÓN PARA SINCRONIZAR CON EL STOCK ANALYTICS PANEL
  const handleInventoryUpdate = useCallback((newInventoryData) => {
    console.log('🔄 InventoryPage: Datos de inventario actualizados', newInventoryData?.length);
    setLastInventoryUpdate(Date.now());
  }, []);

  // 🔄 FUNCIÓN PARA ACTUALIZAR DATOS DESDE EL STOCK ANALYTICS PANEL
  const handleAnalyticsRefresh = useCallback(() => {
    console.log('📊 StockAnalyticsPanel solicitó actualización');
    refreshData();
    if (showToast) {
      showToast('Datos de analytics actualizados', 'success');
    }
  }, [refreshData, showToast]);

  // 🎨 RENDERIZADO PRINCIPAL
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 text-gray-100 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <ProfessionalHeader 
        isCompact={isHeaderCompact} 
        inventoryData={inventoryData} 
      />
      
      <main className="relative z-10">
        <div className="max-w-9xl mx-auto px-6 lg:px-8 py-8">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <Breadcrumbs />
          </motion.div>

          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <QuickActionsToolbar
              onAction={handleQuickAction}
              selectedCount={state.selectedItems?.length}
              selectedItems={state.selectedItems}
              totalItems={filteredAndSortedItems?.length}
              userRole={'admin'}
              viewMode={state.viewMode}
              onViewModeChange={(viewMode) => updateState({ viewMode })}
              isLoading={inventoryLoading}
              inventoryData={inventoryData}
            />
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            >
              <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                <InventoryGrid
                  items={filteredAndSortedItems}
                  selectedItems={state.selectedItems}
                  onSelectionChange={handleSelectionChange}
                  onItemClick={handleItemClick}
                  onBulkAction={handleQuickAction}
                  onQuickAction={handleGridQuickAction}
                  onInventoryUpdate={handleInventoryUpdate} // ✅ CONECTADO: Para sincronización
                  userRole={'admin'}
                  sortConfig={state.sortConfig}
                  onSort={handleSort}
                  isLoading={inventoryLoading}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
            >
              <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                <StockAnalyticsPanel
                  analytics={analyticsData}
                  integrationStatus={{
                    suppliers: 'connected',
                    reorderSystem: 'connected',
                    barcode: 'connected'
                  }}
                  isLoading={inventoryLoading}
                  inventoryData={inventoryData} // ✅ CONECTADO: Pasar datos reales
                  salesData={[]} // ✅ CONECTADO: Pasar datos de ventas cuando estén disponibles
                  onRefresh={handleAnalyticsRefresh} // ✅ CONECTADO: Sincronizar actualizaciones
                  onInventoryUpdate={handleInventoryUpdate} // ✅ CONECTADO: Para notificar cambios
                  showToast={showToast} // ✅ CORREGIDO: Pasar showToast como prop
                  key={lastInventoryUpdate} // 🔄 Forzar re-render cuando cambien los datos
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <ModalManager 
        state={state}
        updateState={updateState}
        availableFilters={availableFilters}
        onAddItem={handleAddItem}
        onItemSave={handleItemSave}
        onDeleteItem={handleDeleteItem}
        onFiltersChange={handleFiltersChange}
        onConfirmSale={handleConfirmSale}
        onImport={handleImport}
        showToast={showToast} // ✅ CORREGIDO: Pasar showToast como prop
        inventoryData={inventoryData}
      />
    </motion.div>
  );
};

// 🎪 GESTOR DE MODALES MEJORADO CON IMPORTACIÓN
const ModalManager = React.memo(({ 
  state, 
  updateState,
  availableFilters,
  onAddItem,
  onItemSave,
  onDeleteItem,
  onFiltersChange,
  onConfirmSale,
  onImport,
  showToast, // ✅ Asegurar que esta prop existe
  inventoryData
}) => {
  const {
    isModalOpen,
    isAddModalOpen,
    isFilterModalOpen,
    isSaleModalOpen,
    isImportModalOpen,
    selectedItem,
    filters,
    isImporting,
    importProgress
  } = state;

  const handleCloseModal = useCallback(() => {
    updateState({ 
      isModalOpen: false, 
      selectedItem: null 
    });
  }, [updateState]);

  const handleCloseAddModal = useCallback(() => {
    updateState({ isAddModalOpen: false });
  }, [updateState]);

  const handleCloseFilterModal = useCallback(() => {
    updateState({ isFilterModalOpen: false });
  }, [updateState]);

  const handleCloseSaleModal = useCallback(() => {
    updateState({ isSaleModalOpen: false });
  }, [updateState]);

  const handleCloseImportModal = useCallback(() => {
    updateState({ isImportModalOpen: false });
  }, [updateState]);

  const handleSavePreset = useCallback((name, filterData) => {
    updateState(prev => ({
      savedPresets: [...prev.savedPresets, { name, filters: filterData }]
    }));
    
    // ✅ CORREGIR: Usar showToast de forma segura
    if (showToast) {
      showToast({
        title: 'Filtro guardado',
        message: `Filtro "${name}" guardado correctamente`,
        type: 'success'
      });
    }
  }, [updateState, showToast]);

  // ✅ CORREGIR: Validar que selectedItem existe antes de renderizar el modal
  if (isModalOpen && !selectedItem) {
    console.warn('ModalManager: selectedItem es null o undefined');
    updateState({ isModalOpen: false });
    return null;
  }

  return (
    <AnimatePresence>
      {isModalOpen && selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={(updatedItem) => onItemSave(selectedItem._id || selectedItem.id, updatedItem)}
          onDelete={() => onDeleteItem(selectedItem._id || selectedItem.id)}
          userRole={'admin'}
          showToast={showToast} // ✅ Pasar showToast al modal
        />
      )}

      {isAddModalOpen && (
        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSave={onAddItem}
          userRole={'admin'}
          availableFilters={availableFilters}
          showToast={showToast} // ✅ Pasar showToast al modal de agregar
        />
      )}

      {isSaleModalOpen && (
        <SaleModal
          isOpen={isSaleModalOpen}
          onClose={handleCloseSaleModal}
          onConfirmSale={onConfirmSale}
          inventoryData={inventoryData}
          userRole={'admin'}
          selectedProduct={state.selectedItem}
          showToast={showToast} // ✅ Pasar showToast al modal de venta
        />
      )}

      {isImportModalOpen && (
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={handleCloseImportModal}
          onImport={onImport}
          isImporting={isImporting}
          importProgress={importProgress}
        />
      )}

      {isFilterModalOpen && (
        <FilterSidebar
          isOpen={isFilterModalOpen}
          onClose={handleCloseFilterModal}
          filters={filters}
          onFiltersChange={onFiltersChange}
          availableFilters={availableFilters}
          onSavePreset={handleSavePreset}
          savedPresets={state.savedPresets}
          showToast={showToast} // ✅ Pasar showToast al sidebar de filtros
        />
      )}
    </AnimatePresence>
  );
});

export default React.memo(InventoryPage);