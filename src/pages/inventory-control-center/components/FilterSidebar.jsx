import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/appIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onSavePreset, 
  savedPresets = [],
  availableFilters = {} 
}) => {
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // 🔄 Sincronizar filtros locales cuando cambian los props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // 🔄 Actualizar filtros padres con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [localFilters, onFiltersChange]);

  // 🎯 OPCIONES DINÁMICAS DESDE EL BACKEND
  const categoryOptions = [
    { value: 'all', label: 'Todas las Categorías' },
    ...(availableFilters.categories || []).filter(cat => cat !== 'all').map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')
    }))
  ];

  const supplierOptions = [
    { value: 'all', label: 'Todos los Proveedores' },
    ...(availableFilters.suppliers || []).filter(sup => sup !== 'all').map(sup => ({
      value: sup,
      label: sup.charAt(0).toUpperCase() + sup.slice(1).replace('-', ' ')
    }))
  ];

  const locationOptions = [
    { value: 'all', label: 'Todas las Ubicaciones' },
    ...(availableFilters.locations || []).filter(loc => loc !== 'all').map(loc => ({
      value: loc,
      label: loc.charAt(0).toUpperCase() + loc.slice(1).replace('-', ' ')
    }))
  ];

  const stockLevelOptions = [
    { value: 'all', label: 'Todos los Niveles' },
    { value: 'out-of-stock', label: 'Sin Stock' },
    { value: 'low-stock', label: 'Stock Bajo' },
    { value: 'adequate', label: 'Stock Adecuado' },
    { value: 'overstock', label: 'Sobrestock' }
  ];

  const unitOptions = [
    { value: 'all', label: 'Todas las Unidades' },
    { value: 'piece', label: 'Pieza' },
    { value: 'box', label: 'Caja' },
    { value: 'liter', label: 'Litro' },
    { value: 'kg', label: 'Kilogramo' },
    { value: 'meter', label: 'Metro' }
  ];

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
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
    };
    
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleSavePresetClick = () => {
    if (presetName?.trim()) {
      onSavePreset(presetName.trim(), localFilters);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose(); // ✅ Cerrar el sidebar después de aplicar
  };

  const hasActiveFilters = Object.values(localFilters)?.some(value => 
    value !== '' && value !== 'all' && value !== false
  );

  // 🚫 Si no está abierto, no renderizar
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex"
      >
        {/* Overlay de fondo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Sidebar */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative ml-auto w-full max-w-md h-full bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Filtros Avanzados</h2>
              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClearFilters}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-gray-700/50"
                  >
                    <Icon name="X" size={14} />
                    <span>Limpiar</span>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAdvancedSearch(!advancedSearch)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-blue-500/20"
                >
                  <Icon name="Filter" size={14} />
                  <span>{advancedSearch ? 'Básico' : 'Avanzado'}</span>
                </motion.button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  iconName="X"
                  iconSize={20}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                />
              </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos, códigos, SKU..."
                value={localFilters?.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Icon name="Search" size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Contenido */}
          <div className="p-6 space-y-6">
            {/* Búsqueda Avanzada */}
            <AnimatePresence>
              {advancedSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <h3 className="text-sm font-medium text-blue-400 flex items-center space-x-2">
                      <Icon name="Calendar" size={16} />
                      <span>Rango de Fechas</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-400 mb-1">Desde</label>
                        <input
                          type="date"
                          value={localFilters?.startDate || ''}
                          onChange={(e) => handleFilterChange('startDate', e.target.value)}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-400 mb-1">Hasta</label>
                        <input
                          type="date"
                          value={localFilters?.endDate || ''}
                          onChange={(e) => handleFilterChange('endDate', e.target.value)}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <label className="text-sm font-medium text-blue-400 mb-3 flex items-center space-x-2">
                      <Icon name="DollarSign" size={16} />
                      <span>Rango de Precio Venta (MXN)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-400 mb-1">Mínimo</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={localFilters?.minPrice || ''}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-400 mb-1">Máximo</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={localFilters?.maxPrice || ''}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                    <label className="text-sm font-medium text-blue-400 mb-2 flex items-center space-x-2">
                      <Icon name="Ruler" size={16} />
                      <span>Unidad de Medida</span>
                    </label>
                    <select
                      value={localFilters?.unit || 'all'}
                      onChange={(e) => handleFilterChange('unit', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                    >
                      {unitOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-gray-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filtros Principales */}
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <label className="text-sm font-medium text-blue-400 mb-2 flex items-center space-x-2">
                  <Icon name="Grid" size={16} />
                  <span>Categoría</span>
                </label>
                <select
                  value={localFilters?.category || 'all'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Supplier Filter */}
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <label className="text-sm font-medium text-blue-400 mb-2 flex items-center space-x-2">
                  <Icon name="Truck" size={16} />
                  <span>Proveedor</span>
                </label>
                <select
                  value={localFilters?.supplier || 'all'}
                  onChange={(e) => handleFilterChange('supplier', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                >
                  {supplierOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Level Filter */}
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <label className="text-sm font-medium text-blue-400 mb-2 flex items-center space-x-2">
                  <Icon name="BarChart3" size={16} />
                  <span>Nivel de Stock</span>
                </label>
                <select
                  value={localFilters?.stockLevel || 'all'}
                  onChange={(e) => handleFilterChange('stockLevel', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                >
                  {stockLevelOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <label className="text-sm font-medium text-blue-400 mb-2 flex items-center space-x-2">
                  <Icon name="MapPin" size={16} />
                  <span>Ubicación</span>
                </label>
                <select
                  value={localFilters?.location || 'all'}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                >
                  {locationOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cost Range */}
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <label className="text-sm font-medium text-blue-400 mb-3 flex items-center space-x-2">
                  <Icon name="CreditCard" size={16} />
                  <span>Rango de Costo (MXN)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1">Mínimo</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={localFilters?.minCost || ''}
                      onChange={(e) => handleFilterChange('minCost', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1">Máximo</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={localFilters?.maxCost || ''}
                      onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <h3 className="text-sm font-medium text-blue-400 mb-3 flex items-center space-x-2">
                <Icon name="Zap" size={16} />
                <span>Filtros Rápidos</span>
              </h3>
              <div className="space-y-3">
                {/* Checkbox 1 - Solo Stock Bajo */}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={localFilters?.showOnlyLowStock || false}
                      onChange={(e) => handleFilterChange('showOnlyLowStock', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                      localFilters?.showOnlyLowStock 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-gray-700 border-gray-600 group-hover:border-gray-500'
                    }`}>
                      {localFilters?.showOnlyLowStock && (
                        <Icon name="Check" size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                    Solo Stock Bajo
                  </span>
                </label>
                
                {/* Checkbox 2 - Requiere Reorden */}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={localFilters?.showOnlyReorderNeeded || false}
                      onChange={(e) => handleFilterChange('showOnlyReorderNeeded', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                      localFilters?.showOnlyReorderNeeded 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-gray-700 border-gray-600 group-hover:border-gray-500'
                    }`}>
                      {localFilters?.showOnlyReorderNeeded && (
                        <Icon name="Check" size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                    Requiere Reorden
                  </span>
                </label>

                {/* Checkbox 3 - Próximos a Vencer */}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={localFilters?.showExpiringSoon || false}
                      onChange={(e) => handleFilterChange('showExpiringSoon', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                      localFilters?.showExpiringSoon 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-gray-700 border-gray-600 group-hover:border-gray-500'
                    }`}>
                      {localFilters?.showExpiringSoon && (
                        <Icon name="Check" size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                    Próximos a Vencer
                  </span>
                </label>

                {/* Checkbox 4 - Solo Perecederos */}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={localFilters?.showPerishable || false}
                      onChange={(e) => handleFilterChange('showPerishable', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                      localFilters?.showPerishable 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-gray-700 border-gray-600 group-hover:border-gray-500'
                    }`}>
                      {localFilters?.showPerishable && (
                        <Icon name="Check" size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                    Solo Perecederos
                  </span>
                </label>
              </div>
            </div>

            {/* Botón Aplicar Filtros */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyFilters}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Aplicar Filtros
            </motion.button>

            {/* Saved Presets */}
            {savedPresets?.length > 0 && (
              <div className="border-t border-gray-700/50 pt-4">
                <h3 className="text-sm font-medium text-blue-400 mb-3 flex items-center space-x-2">
                  <Icon name="Bookmark" size={16} />
                  <span>Filtros Guardados</span>
                </h3>
                <div className="space-y-2">
                  {savedPresets?.map((preset, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setLocalFilters(preset.filters);
                        onFiltersChange(preset.filters);
                      }}
                      className="flex items-center justify-between w-full p-3 text-sm text-left bg-gray-800/30 hover:bg-blue-500/10 rounded-lg border border-gray-700/30 hover:border-blue-500/30 text-gray-300 hover:text-white transition-all duration-200"
                    >
                      <span>{preset?.name}</span>
                      <Icon name="ChevronRight" size={14} className="text-gray-400" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Preset */}
            <div className="border-t border-gray-700/50 pt-4">
              {!showSavePreset ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSavePreset(true)}
                  className="flex items-center justify-center space-x-2 w-full p-3 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-500/20 hover:border-blue-500/30 transition-all duration-200"
                >
                  <Icon name="Save" size={16} />
                  <span>Guardar Filtros Actuales</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30"
                >
                  <input
                    type="text"
                    placeholder="Nombre del filtro..."
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSavePresetClick}
                      disabled={!presetName?.trim()}
                      className={`flex-1 py-2 px-3 text-sm rounded-lg transition-all duration-200 ${
                        presetName?.trim() 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Guardar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowSavePreset(false);
                        setPresetName('');
                      }}
                      className="flex-1 py-2 px-3 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilterSidebar;