// QuickActionsToolbar.jsx - VERSIÓN COMPLETA CORREGIDA
import React, { useState, useRef, useEffect, useCallback, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/appIcon';
import { createPortal } from 'react-dom';

// 🚀 SYSTEM HOOKS
const useToolbarStateMachine = (selectedCount, isLoading) => {
  return useMemo(() => {
    if (selectedCount > 0) return 'selection-active';
    if (isLoading) return 'loading';
    return 'idle';
  }, [selectedCount, isLoading]);
};

const usePerformanceOptimizer = (selectedCount, totalItems) => {
  const deferredSelectedCount = useDeferredValue(selectedCount);
  const deferredTotalItems = useDeferredValue(totalItems);
  
  return useMemo(() => ({
    selectedCount: deferredSelectedCount,
    totalItems: deferredTotalItems,
    isStale: deferredSelectedCount !== selectedCount || deferredTotalItems !== totalItems
  }), [deferredSelectedCount, deferredTotalItems, selectedCount, totalItems]);
};

// 🎨 DESIGN SYSTEM
const createAtomicDesignSystem = () => ({
  colors: {
    primary: {
      bg: 'bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95',
      border: 'border border-gray-700/50 backdrop-blur-2xl',
      glow: 'shadow-2xl shadow-blue-500/15 hover:shadow-blue-500/25'
    },
    states: {
      idle: 'from-slate-900/95 via-gray-900/95 to-slate-900/95',
      loading: 'from-blue-900/30 via-cyan-900/30 to-blue-900/30 animate-pulse-glow',
      'selection-active': 'from-emerald-900/40 via-green-900/40 to-emerald-900/40 animate-success-glow'
    }
  },
  animations: {
    entrance: {
      initial: { opacity: 0, y: -30, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -20, scale: 0.95 },
      transition: { type: "spring", damping: 25, stiffness: 400 }
    },
    micro: {
      hover: { scale: 1.02, y: -2 },
      tap: { scale: 0.98 },
      transition: { type: "spring", damping: 15, stiffness: 400 }
    }
  }
});

// 🧩 COMPONENTES ATÓMICOS
const QuantumButton = React.memo(({ 
  children, 
  onClick, 
  variant = 'primary',
  icon,
  badge,
  loading = false,
  disabled = false,
  ...props 
}) => {
  const designSystem = createAtomicDesignSystem();
  
  const variants = {
    // Exportar - Verde
    export: 'bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg shadow-emerald-500/30 border-emerald-400/30 hover:from-emerald-500 hover:to-green-500',
    // Importar - Amarillo
    import: 'bg-gradient-to-r from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/30 border-amber-400/30 hover:from-amber-400 hover:to-yellow-500',
    // Eliminar - Rojo
    delete: 'bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-500/30 border-red-400/30 hover:from-red-500 hover:to-rose-500',
    // Agregar - Azul
    add: 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30 border-blue-400/30 hover:from-blue-500 hover:to-cyan-500',
    // Filtrar - Morado
    filter: 'bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg shadow-purple-500/30 border-purple-400/30 hover:from-purple-500 hover:to-violet-500',
    // Vender - Verde brillante
    sale: 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 border-green-400/30 hover:from-green-400 hover:to-emerald-500',
    // Refresh - Azul
    refresh: 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30 border-blue-400/30 hover:from-blue-500 hover:to-cyan-500',
    // Ghost para otros
    ghost: 'bg-gray-800/40 border-gray-600/30 backdrop-blur-sm hover:bg-gray-700/50'
  };

  return (
    <motion.button
      {...designSystem.animations.micro}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        relative flex items-center justify-center space-x-2 px-4 py-3 
        rounded-2xl border text-white font-semibold
        transition-all duration-300 overflow-hidden group
        ${variants[variant]}
        ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
      `}
      {...props}
    >
      {/* Efecto de brillo dinámico */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
      
      {/* Badge inteligente */}
      {badge && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-gray-900"
        >
          {badge}
        </motion.span>
      )}

      {/* Icono con estado de carga */}
      {icon && (
        <motion.div
          animate={loading ? { rotate: 360 } : {}}
          transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        >
          <Icon 
            name={loading ? "Loader" : icon} 
            size={18} 
            className="relative z-10 group-hover:scale-110 transition-transform duration-300" 
          />
        </motion.div>
      )}

      {/* Contenido */}
      <span className="relative z-10 whitespace-nowrap">
        {children}
      </span>
    </motion.button>
  );
});

// 🎯 COMPONENTE PRINCIPAL ACTUALIZADO CON TODAS LAS ACCIONES
const QuickActionsToolbar = React.memo(({
  onAction,
  selectedCount = 0,
  totalItems = 0,
  userRole = 'admin',
  viewMode = 'grid',
  onViewModeChange,
  isLoading = false,
  inventoryData = [],
  selectedItems = [],
  className = '',
}) => {
  // 🧠 HOOKS DE ESTADO AVANZADOS
  const toolbarState = useToolbarStateMachine(selectedCount, isLoading);
  const { selectedCount: deferredSelectedCount, totalItems: deferredTotalItems, isStale } = 
    usePerformanceOptimizer(selectedCount, totalItems);
  
  const toolbarRef = useRef(null);

  // 🎨 SISTEMA DE DISEÑO
  const designSystem = useMemo(() => createAtomicDesignSystem(), []);

  // 🚀 MANEJADORES DE ACCIONES COMPLETOS
  const handleExport = useCallback(() => {
    onAction('export', { 
      selectedItems: selectedCount > 0 ? selectedItems : null,
      timestamp: Date.now()
    });
  }, [onAction, selectedCount, selectedItems]);

  const handleImport = useCallback(() => {
    onAction('import', { 
      type: 'inventory',
      userRole 
    });
  }, [onAction, userRole]);

  const handleDelete = useCallback(() => {
    if (selectedCount > 0) {
      onAction('delete_selected', { 
        selectedItems,
        confirmation: true 
      });
    }
  }, [onAction, selectedCount, selectedItems]);

  const handleAdd = useCallback(() => {
    onAction('add_item', { 
      userRole,
      context: 'inventory'
    });
  }, [onAction, userRole]);

  const handleFilter = useCallback(() => {
    onAction('filter', { 
      type: 'open_modal',
      currentFilters: {}
    });
  }, [onAction]);

  const handleSale = useCallback(() => {
    onAction('sale', { 
      userRole,
      context: 'inventory',
      hasSelection: selectedCount > 0,
      selectedItems: selectedCount > 0 ? selectedItems : null
    });
  }, [onAction, userRole, selectedCount, selectedItems]);

  const handleRefresh = useCallback(() => {
    onAction('refresh', {
      timestamp: Date.now(),
      userRole
    });
  }, [onAction, userRole]);

  const handleBulkUpdate = useCallback(() => {
    if (selectedCount > 0) {
      onAction('bulk_update', {
        selectedItems,
        userRole
      });
    }
  }, [onAction, selectedCount, selectedItems, userRole]);

  // 🎛️ COMPONENTE DE ESTADO MEJORADO
  const StateIndicator = React.memo(() => {
    if (toolbarState === 'loading') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-4 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-400/30 rounded-2xl px-5 py-4 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"
            />
            <div>
              <div className="text-blue-400 font-semibold text-sm">Sincronizando datos...</div>
              <div className="text-blue-300/70 text-xs">Actualización en tiempo real</div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (toolbarState === 'selection-active') {
      return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4 bg-gradient-to-r from-emerald-500/15 to-green-500/15 border border-emerald-400/30 rounded-2xl px-5 py-4 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-emerald-400 rounded-full"
            />
            <div>
              <div className="text-emerald-400 font-bold text-sm">
                {deferredSelectedCount} {deferredSelectedCount === 1 ? 'elemento' : 'elementos'} seleccionados
              </div>
              <div className="text-emerald-300/70 text-xs">Acciones disponibles</div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-4 text-gray-300 bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-2xl px-5 py-4"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-gray-600/50 to-gray-700/50 rounded-2xl border border-gray-500/30">
            <Icon name="Database" size={20} className="text-gray-400" />
          </div>
          <div>
            <div className="text-3xl font-black text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {deferredTotalItems.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 -mt-1 font-medium">registros activos</div>
          </div>
        </div>
      </motion.div>
    );
  });

  return (
    <>
      {/* 🎨 TOOLBAR PRINCIPAL - Diseño Actualizado con TODAS las acciones */}
      <motion.div
        ref={toolbarRef}
        {...designSystem.animations.entrance}
        className={`
          ${designSystem.colors.primary.bg} 
          ${designSystem.colors.primary.border} 
          rounded-3xl shadow-2xl shadow-blue-500/10
          p-6 backdrop-blur-2xl
          hover:shadow-blue-500/20 transition-shadow duration-500
          ${className}
        `}
      >
        {/* Layout de rendimiento optimizado */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          
          {/* Panel de Estado */}
          <StateIndicator />

          {/* 🎯 TODOS LOS BOTONES PRINCIPALES */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
            
            {/* 1. EXPORTAR - VERDE */}
            <QuantumButton
              onClick={handleExport}
              variant="export"
              icon="Download"
              loading={isLoading}
            >
              <span className="hidden sm:inline">Exportar</span>
              <span className="sm:hidden">Export</span>
            </QuantumButton>

            {/* 2. IMPORTAR - AMARILLO */}
            <QuantumButton
              onClick={handleImport}
              variant="import"
              icon="Upload"
              loading={isLoading}
            >
              <span className="hidden sm:inline">Importar</span>
              <span className="sm:hidden">Import</span>
            </QuantumButton>

            {/* 3. ELIMINAR - ROJO (solo visible cuando hay selección) */}
            {deferredSelectedCount > 0 && (
              <QuantumButton
                onClick={handleDelete}
                variant="delete"
                icon="Trash2"
                badge={deferredSelectedCount}
              >
                <span className="hidden sm:inline">Eliminar</span>
                <span className="sm:hidden">Del</span>
              </QuantumButton>
            )}

            {/* 4. AGREGAR - AZUL */}
            <QuantumButton
              onClick={handleAdd}
              variant="add"
              icon="Plus"
            >
              <span className="hidden sm:inline">Agregar</span>
              <span className="sm:hidden">Add</span>
            </QuantumButton>

            {/* 5. FILTRAR - MORADO */}
            <QuantumButton
              onClick={handleFilter}
              variant="filter"
              icon="Filter"
            >
              <span className="hidden sm:inline">Filtrar</span>
              <span className="sm:hidden">Filter</span>
            </QuantumButton>

            {/* 6. VENDER - VERDE BRILLANTE */}
            <QuantumButton
              onClick={handleSale}
              variant="sale"
              icon="ShoppingCart"
              disabled={isLoading}
            >
              <span className="hidden sm:inline">Vender</span>
              <span className="sm:hidden">Sale</span>
            </QuantumButton>

            {/* 7. ACTUALIZAR - AZUL */}
            <QuantumButton
              onClick={handleRefresh}
              variant="refresh"
              icon="RefreshCw"
              loading={isLoading}
            >
              <span className="hidden sm:inline">Actualizar</span>
              <span className="sm:hidden">Refresh</span>
            </QuantumButton>

            {/* 8. EDICIÓN MASIVA - NARANJA (solo con selección) */}
            {deferredSelectedCount > 0 && (
              <QuantumButton
                onClick={handleBulkUpdate}
                variant="import" // Reutilizamos el estilo de import
                icon="Edit3"
                badge={deferredSelectedCount}
              >
                <span className="hidden sm:inline">Editar</span>
                <span className="sm:hidden">Edit</span>
              </QuantumButton>
            )}

          </div>
        </div>
      </motion.div>

      {/* 🎨 ESTILOS GLOBALES */}
      <style>
{`
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
  }
  @keyframes success-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
    50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
  }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .animate-success-glow { animation: success-glow 2s ease-in-out infinite; }
`}
</style>
    </>
  );
});

// 🏷️ Display name para mejor debugging
QuickActionsToolbar.displayName = 'QuickActionsToolbar';

export default QuickActionsToolbar;