import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Image from '../../../components/appImage';

// 🔧 UTILIDADES ACTUALIZADAS
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
};

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return new Intl.DateTimeFormat('es-MX', options).format(date);
  } catch {
    return '-';
  }
};

// ✅ CORREGIDA: Usar stock y minStock de la API
const getStockStatus = (item) => {
  const current = item.stock ?? 0;  // Cambiado: item.stock en lugar de item.currentStock
  const minimum = item.minStock ?? 0; // Cambiado: item.minStock en lugar de item.minimumStock

  if (current === 0 || current === null || current === undefined) return { 
    status: 'out-of-stock', 
    color: 'text-red-400', 
    background: 'bg-red-500/20', 
    border: 'border-red-500/30',
    label: 'Sin Stock',
    priority: 0,
    icon: 'XCircle'
  };
  
  if (current <= minimum) return { 
    status: 'low-stock', 
    color: 'text-amber-400', 
    background: 'bg-amber-500/20', 
    border: 'border-amber-500/30',
    label: 'Stock Bajo',
    priority: 1,
    icon: 'AlertTriangle'
  };
  if (current <= minimum * 2) return { 
    status: 'adequate', 
    color: 'text-emerald-400', 
    background: 'bg-emerald-500/20', 
    border: 'border-emerald-500/30',
    label: 'Adecuado',
    priority: 2,
    icon: 'CheckCircle'
  };
  return { 
    status: 'overstock', 
    color: 'text-blue-400', 
    background: 'bg-blue-500/20', 
    border: 'border-blue-500/30',
    label: 'Sobrestock',
    priority: 3,
    icon: 'Package'
  };
};

const getExpirationStatus = (expiryDate) => {
  if (!expiryDate) return { 
    status: 'no-expiration', 
    color: 'text-gray-400', 
    label: 'Sin Vencimiento',
    priority: 4,
    icon: 'Infinity'
  };
  
  try {
    const today = new Date();
    const expiration = new Date(expiryDate);
    if (isNaN(expiration.getTime())) return {
      status: 'invalid-date',
      color: 'text-gray-400',
      label: 'Fecha Inválida',
      priority: 4,
      icon: 'HelpCircle'
    };
    
    const timeDifference = expiration - today;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 0) return { 
      status: 'expired', 
      color: 'text-red-400', 
      label: 'Vencido',
      priority: 0,
      icon: 'XCircle'
    };
    if (daysDifference <= 7) return { 
      status: 'critical', 
      color: 'text-red-400', 
      label: 'Crítico',
      priority: 1,
      icon: 'AlertTriangle'
    };
    if (daysDifference <= 30) return { 
      status: 'warning', 
      color: 'text-amber-400', 
      label: 'Próximo',
      priority: 2,
      icon: 'Clock'
    };
    return { 
      status: 'safe', 
      color: 'text-emerald-400', 
      label: 'Vigente',
      priority: 3,
      icon: 'CheckCircle'
    };
  } catch {
    return {
      status: 'invalid-date',
      color: 'text-gray-400',
      label: 'Fecha Inválida',
      priority: 4,
      icon: 'HelpCircle'
    };
  }
};

const calculateMargin = (cost, price) => {
  if (!cost || !price || cost <= 0) return 0;
  return ((price - cost) / cost) * 100;
};

const getMarginColor = (margin) => {
  if (margin >= 50) return 'text-emerald-400';
  if (margin >= 25) return 'text-green-400';
  if (margin >= 10) return 'text-amber-400';
  return 'text-red-400';
};

// ✅ UTILIDAD PARA IDs - COMPATIBLE CON TU HOOK
const getItemId = (item) => {
  if (!item) return null;
  const itemId = item._id || item.id;
  return itemId && itemId !== 'undefined' && itemId !== 'null' ? itemId : null;
};

// 🎨 COMPONENTE DE ETIQUETA (sin cambios)
const Tag = React.memo(({ 
  children, 
  variant = 'default',
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border';
  
  const variants = {
    default: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    primary: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20'
  };
  
  return (
    <span 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

// 🎪 COMPONENTE PRINCIPAL - ADAPTADO AL HOOK useInventory
const InventoryGrid = ({ 
  items = [], 
  selectedItems = [], 
  onSelectionChange, 
  onItemClick, 
  onBulkAction,
  onQuickAction,
  onInventoryUpdate,
  isLoading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [quickFilter, setQuickFilter] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [sortColumn, setSortColumn] = useState({ key: 'name', direction: 'asc' });
  const [internalSelection, setInternalSelection] = useState(new Set());
  
  const gridRef = useRef(null);
  const searchInputRef = useRef(null);

  // ✅ SINCRONIZAR SELECTION CON PROPS
  useEffect(() => {
    setInternalSelection(new Set(selectedItems));
  }, [selectedItems]);

  // 🔍 FILTRADO Y ORDENAMIENTO - CORREGIDO
  const filteredAndSortedItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    
    let filtered = [...items];
    
    // Filtro rápido
    if (quickFilter.trim()) {
      const searchTerm = quickFilter.toLowerCase().trim();
      filtered = filtered.filter(item => 
        (item.code || '').toLowerCase().includes(searchTerm) ||
        (item.name || '').toLowerCase().includes(searchTerm) ||
        (item.category || '').toLowerCase().includes(searchTerm) ||
        (item.supplier || '').toLowerCase().includes(searchTerm)
      );
    }

    // Ordenamiento - CORREGIDO para stock
    if (sortColumn.key) {
      filtered.sort((a, b) => {
        let valueA = a[sortColumn.key];
        let valueB = b[sortColumn.key];

        // ✅ CORREGIDO: Cambiado de 'currentStock' a 'stock'
        if (sortColumn.key === 'stock') {
          const statusA = getStockStatus(a);
          const statusB = getStockStatus(b);
          valueA = statusA.priority;
          valueB = statusB.priority;
        }

        if (sortColumn.key === 'margin') {
          valueA = calculateMargin(a.cost, a.price);
          valueB = calculateMargin(b.cost, b.price);
        }

        if (valueA == null) valueA = '';
        if (valueB == null) valueB = '';

        if (typeof valueA === 'string') valueA = valueA.toLowerCase();
        if (typeof valueB === 'string') valueB = valueB.toLowerCase();

        if (valueA < valueB) return sortColumn.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortColumn.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [items, quickFilter, sortColumn]);

  // 📊 PAGINACIÓN (sin cambios)
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, endIndex);
  }, [filteredAndSortedItems, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedItems.length / itemsPerPage));

  // 📊 ESTADÍSTICAS EN TIEMPO REAL - CORREGIDO
  const stats = useMemo(() => {
    const statistics = {
      total: filteredAndSortedItems.length,
      outOfStock: 0,
      lowStock: 0,
      totalValue: 0
    };

    filteredAndSortedItems.forEach(item => {
      const stockStatus = getStockStatus(item);
      const margin = calculateMargin(item.cost, item.price);
      
      if (stockStatus.status === 'out-of-stock') statistics.outOfStock++;
      if (stockStatus.status === 'low-stock') statistics.lowStock++;
      
      // ✅ CORREGIDO: Usar stock de la API
      const currentStock = item.stock ?? 0;
      statistics.totalValue += (item.price || 0) * currentStock;
    });

    return statistics;
  }, [filteredAndSortedItems]);

  // 🎯 MANEJAR ORDENAMIENTO (sin cambios)
  const handleSort = useCallback((columnKey) => {
    setSortColumn(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // 🎯 SISTEMA DE SELECCIÓN (sin cambios)
  const toggleItem = useCallback((item) => {
    const itemId = getItemId(item);
    
    if (!itemId) {
      console.error('❌ No se puede seleccionar item sin ID válido:', item);
      return;
    }

    setInternalSelection(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      onSelectionChange?.(Array.from(newSet));
      return newSet;
    });
  }, [onSelectionChange]);

  const selectAll = useCallback(() => {
    setInternalSelection(prev => {
      const newSet = new Set(prev);
      const currentItems = paginatedItems;
      
      const allSelected = currentItems.every(item => {
        const itemId = getItemId(item);
        return newSet.has(itemId);
      });
      
      if (allSelected) {
        currentItems.forEach(item => {
          const itemId = getItemId(item);
          newSet.delete(itemId);
        });
      } else {
        currentItems.forEach(item => {
          const itemId = getItemId(item);
          newSet.add(itemId);
        });
      }
      
      onSelectionChange?.(Array.from(newSet));
      return newSet;
    });
  }, [paginatedItems, onSelectionChange]);

  const isSelected = useCallback((item) => {
    const itemId = getItemId(item);
    return internalSelection.has(itemId);
  }, [internalSelection]);

  // 🖥️ PANTALLA COMPLETA (sin cambios)
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!fullscreen && gridRef.current) {
        if (gridRef.current.requestFullscreen) {
          await gridRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      setFullscreen(!fullscreen);
    }
  }, [fullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 🎯 MANEJAR ACCIONES RÁPIDAS (sin cambios)
  const handleGridQuickAction = useCallback((action, itemId, item) => {
    console.log('🔄 InventoryGrid - Acción rápida:', action, itemId);
    onQuickAction?.(action, { itemId, item });
  }, [onQuickAction]);

  // 🎯 MANEJAR BULK ACTIONS (sin cambios)
  const handleGridBulkAction = useCallback((action, data) => {
    console.log('🔄 InventoryGrid - Bulk action:', action, data);
    onBulkAction?.(action, data);
  }, [onBulkAction]);

  // 🎨 COLUMNAS CONFIGURABLES - CORREGIDAS
  const columns = useMemo(() => [
    {
      key: 'selection',
      label: (
        <Checkbox
          checked={paginatedItems.length > 0 && paginatedItems.every(item => isSelected(item))}
          onChange={selectAll}
          indeterminate={
            paginatedItems.some(item => isSelected(item)) && 
            !paginatedItems.every(item => isSelected(item))
          }
        />
      ),
      width: 'w-16',
      sortable: false,
      render: (item) => (
        <Checkbox
          checked={isSelected(item)}
          onChange={() => toggleItem(item)}
        />
      )
    },
    {
      key: 'code',
      label: 'Código',
      width: 'w-32',
      sortable: true,
      render: (item) => (
        <div className="font-mono text-sm text-blue-400 font-medium">
          {item.code || 'N/A'}
        </div>
      )
    },
    {
      key: 'name',
      label: 'Producto',
      width: 'w-64',
      sortable: true,
      render: (item) => (
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg"
          onClick={() => onItemClick?.(item)}
        >
          {item.image ? (
            <Image 
              src={item.image} 
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
              <Icon name="Package" size={16} className="text-blue-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium truncate">{item.name}</div>
            {item.description && (
              <div className="text-gray-400 text-sm truncate">{item.description}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Categoría',
      width: 'w-40',
      sortable: true,
      render: (item) => (
        <Tag variant="primary">
          {item.category || 'Sin categoría'}
        </Tag>
      )
    },
    {
      // ✅ CORREGIDO: Cambiado de 'currentStock' a 'stock'
      key: 'stock',
      label: 'Stock',
      width: 'w-32',
      sortable: true,
      render: (item) => {
        const stockStatus = getStockStatus(item);
        // ✅ CORREGIDO: Mostrar stock de la API
        const currentStock = item.stock ?? 0;
        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${stockStatus.background}`} />
            <div className="text-white font-medium">{currentStock}</div>
            <Tag 
              variant={
                stockStatus.status === 'out-of-stock' ? 'danger' :
                stockStatus.status === 'low-stock' ? 'warning' : 'success'
              }
            >
              {stockStatus.label}
            </Tag>
          </div>
        );
      }
    },
    {
      key: 'price',
      label: 'Precio',
      width: 'w-32',
      sortable: true,
      render: (item) => (
        <div className="text-right">
          <div className="text-white font-medium">{formatCurrency(item.price)}</div>
          <div className="text-gray-400 text-sm">Costo: {formatCurrency(item.cost)}</div>
        </div>
      )
    },
    {
      key: 'margin',
      label: 'Margen',
      width: 'w-28',
      sortable: true,
      render: (item) => {
        const margin = calculateMargin(item.cost, item.price);
        const marginColor = getMarginColor(margin);
        return (
          <div className={`px-3 py-1 rounded-full text-center font-medium ${marginColor}`}>
            {margin.toFixed(1)}%
          </div>
        );
      }
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      width: 'w-40',
      sortable: true,
      render: (item) => (
        <div className="text-gray-300">{item.supplier || 'N/A'}</div>
      )
    },
    {
      key: 'expiryDate',
      label: 'Vencimiento',
      width: 'w-36',
      sortable: true,
      render: (item) => {
        const expirationStatus = getExpirationStatus(item.expiryDate);
        return (
          <div className="flex items-center space-x-2">
            <Icon name={expirationStatus.icon} size={14} className={expirationStatus.color} />
            <span className={expirationStatus.color}>
              {item.expiryDate ? formatDate(item.expiryDate) : expirationStatus.label}
            </span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: 'w-32',
      sortable: false,
      render: (item) => (
        <div className="flex justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleGridQuickAction('quick_sale', getItemId(item), item)}
            className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
            iconName="ShoppingCart"
            iconSize={16}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onItemClick?.(item)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
            iconName="Eye"
            iconSize={16}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleGridQuickAction('view_details', getItemId(item), item)}
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
            iconName="Edit"
            iconSize={16}
          />
        </div>
      )
    }
  ], [paginatedItems, isSelected, selectAll, toggleItem, handleGridQuickAction, onItemClick]);

  // 🎨 RENDERIZADO PRINCIPAL (sin cambios)
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-900/40 rounded-lg border border-gray-700/30">
        <div className="animate-pulse space-y-4 p-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex space-x-4 items-center">
              <div className="w-12 h-4 bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className="flex flex-col h-full bg-gradient-to-br from-gray-900/40 via-slate-900/40 to-gray-900/40 rounded-xl border border-gray-700/30 overflow-hidden backdrop-blur-sm shadow-2xl"
    >
      {/* Header con estadísticas en tiempo real */}
      <div className="p-6 border-b border-gray-700/30 bg-gradient-to-r from-gray-900/80 via-slate-900/80 to-gray-900/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center"
            >
              <Icon name="Package" className="text-blue-400" size={24} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Gestión de Inventario
              </h2>
              <p className="text-gray-400 text-sm">
                {stats.total} productos • {stats.outOfStock} sin stock • {stats.lowStock} stock bajo
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Botón de actualizar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGridBulkAction('refresh')}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-sm font-medium transition-all duration-200 backdrop-blur-sm hover:bg-green-500/20 disabled:opacity-50"
            >
              <Icon name="RefreshCw" size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </motion.button>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 backdrop-blur-sm"
            >
              {[10, 20, 50, 100].map(opt => (
                <option key={opt} value={opt}>{opt} por página</option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                fullscreen
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
              }`}
            >
              <Icon name={fullscreen ? "Minimize2" : "Maximize2"} size={16} />
              <span>{fullscreen ? 'Salir' : 'Pantalla Completa'}</span>
            </motion.button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="relative max-w-2xl">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar productos, códigos, categorías, proveedores..."
            value={quickFilter}
            onChange={(e) => {
              setQuickFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-10 py-3 bg-gray-800/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm backdrop-blur-sm"
          />
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          {quickFilter && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setQuickFilter('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Icon name="X" size={16} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50 sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-300 border-b border-gray-700/30 ${column.width} ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-700/50' : ''
                  }`}
                  onClick={() => {
                    if (column.sortable) {
                      handleSort(column.key);
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <Icon 
                        name={
                          sortColumn.key === column.key
                            ? sortColumn.direction === 'asc'
                              ? 'ChevronUp'
                              : 'ChevronDown'
                            : 'ChevronUpDown'
                        }
                        size={14}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedItems.map((item, index) => (
                <motion.tr
                  key={getItemId(item) || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-200 ${
                    isSelected(item) ? 'bg-blue-500/10' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 ${column.width} ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-600/20' : ''
                      }`}
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {paginatedItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Icon name="Package" size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No se encontraron productos</p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      <div className="p-4 border-t border-gray-700/30 bg-gray-800/50 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedItems.length)}-
          {Math.min(currentPage * itemsPerPage, filteredAndSortedItems.length)} de {filteredAndSortedItems.length} productos
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
            iconSize={16}
          >
            Anterior
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? 'bg-blue-500 text-white' : ''}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            iconName="ChevronRight"
            iconSize={16}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(InventoryGrid); 