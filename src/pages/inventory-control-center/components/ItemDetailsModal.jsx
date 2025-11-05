import React, { useState, useEffect } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Image from '../../../components/appImage';
import { motion, AnimatePresence } from 'framer-motion';

const ItemDetailsModal = ({ item, isOpen, onClose, onSave, userRole = 'admin' }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(item || {});
  const [activeTab, setActiveTab] = useState('details');
  const [isClosing, setIsClosing] = useState(false);

  // Resetear estados cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen && item) {
      setFormData(item);
      setEditMode(false);
      setIsClosing(false);
    }
  }, [isOpen, item]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen || !item) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount || 0);
  };

  const formatDate = (dateString, includeTime = true) => {
    if (!dateString) return '-';
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return new Intl.DateTimeFormat('es-MX', options)?.format(new Date(dateString));
  };

  const getStockStatus = (current, minimum) => {
    if (current === 0) return { status: 'out-of-stock', color: 'text-red-400', label: 'Sin Stock' };
    if (current <= minimum) return { status: 'low-stock', color: 'text-amber-400', label: 'Stock Bajo' };
    if (current <= minimum * 2) return { status: 'adequate', color: 'text-emerald-400', label: 'Adecuado' };
    return { status: 'overstock', color: 'text-blue-400', label: 'Sobrestock' };
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'no-expiry', color: 'text-gray-400', label: 'Sin Vencimiento' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'text-red-400', label: 'Vencido' };
    if (diffDays <= 7) return { status: 'critical', color: 'text-red-400', label: 'Crítico' };
    if (diffDays <= 30) return { status: 'warning', color: 'text-amber-400', label: 'Próximo' };
    return { status: 'safe', color: 'text-emerald-400', label: 'Vigente' };
  };

  const calculateMargin = (cost, price) => {
    if (!cost || !price || cost <= 0) return 0;
    return ((price - cost) / cost) * 100;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(item);
    setEditMode(false);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'adjust_stock':
        // Lógica para ajustar stock
        break;
      case 'print_label':
        // Lógica para imprimir etiqueta
        break;
      case 'duplicate':
        // Lógica para duplicar producto
        break;
      default:
        break;
    }
  };

  // Opciones de selección
  const locationOptions = [
    { value: 'warehouse-a', label: 'Almacén A - Principal' },
    { value: 'warehouse-b', label: 'Almacén B - Secundario' },
    { value: 'workshop-1', label: 'Taller 1 - Diagnóstico' },
    { value: 'workshop-2', label: 'Taller 2 - Reparación' },
    { value: 'office', label: 'Oficina - Herramientas' },
    { value: 'branch-1', label: 'Sucursal Norte' },
    { value: 'branch-2', label: 'Sucursal Sur' }
  ];

  const supplierOptions = [
    { value: 'TSV', label: 'TRANSERVICIOS' },
    { value: 'J.A.M', label: 'Juan Antonio Martinez' },
    { value: 'J.L', label: 'Juan Loza' },
    { value: 'J.T', label: 'Julio Tacuacha' },
    { value: 'O.G', label: 'Oscar Gonzalez' },
  ];

  const unitOptions = [
    { value: 'piece', label: 'Pieza' },
    { value: 'box', label: 'Caja' },
    { value: 'liter', label: 'Litro' },
    { value: 'kg', label: 'Kilogramo' },
    { value: 'meter', label: 'Metro' },
    { value: 'unit', label: 'Unidad' },
    { value: 'pair', label: 'Par' },
    { value: 'set', label: 'Juego' }
  ];

  const categoryOptions = [
    { value: 'electronic-components', label: 'Componentes Electrónicos' },
    { value: 'sensors', label: 'Sensores' },
    { value: 'cables', label: 'Cables y Conectores' },
    { value: 'control-modules', label: 'Módulos de Control' },
    { value: 'diagnostic-tools', label: 'Herramientas de Diagnóstico' },
    { value: 'lighting', label: 'Iluminación' },
    { value: 'power-systems', label: 'Sistemas de Energía' },
    { value: 'perishable', label: 'Productos Perecederos' },
    { value: 'medications', label: 'Medicamentos' },
    { value: 'tools', label: 'Herramientas' },
    { value: 'consumables', label: 'Consumibles' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'discontinued', label: 'Descontinuado' },
    { value: 'out-of-stock', label: 'Sin Stock' }
  ];

  const tabs = [
    { id: 'details', label: 'Detalles', icon: 'Package' },
    { id: 'history', label: 'Historial', icon: 'History' },
    { id: 'movements', label: 'Movimientos', icon: 'Activity' },
    { id: 'analytics', label: 'Análisis', icon: 'BarChart3' },
    { id: 'photos', label: 'Multimedia', icon: 'Image' }
  ];

  // Datos de ejemplo para las pestañas
  const movementHistory = [
    { id: 1, type: 'in', description: 'Compra a proveedor', quantity: 50, user: 'Admin', date: new Date(Date.now() - 86400000), reference: 'COMP-001' },
    { id: 2, type: 'out', description: 'Venta a cliente', quantity: 5, user: 'Vendedor', date: new Date(Date.now() - 43200000), reference: 'VENT-456' },
    { id: 3, type: 'adjustment', description: 'Ajuste de inventario', quantity: 2, user: 'Admin', date: new Date(Date.now() - 21600000), reference: 'AJUST-789' }
  ];

  const recentMovements = [
    { id: 1, type: 'purchase', quantity: 50, user: 'Admin', date: new Date(Date.now() - 86400000), reference: 'COMP-001' },
    { id: 2, type: 'sale', quantity: 5, user: 'Vendedor', date: new Date(Date.now() - 43200000), reference: 'VENT-456' },
    { id: 3, type: 'transfer', quantity: 10, user: 'Almacenista', date: new Date(Date.now() - 21600000), reference: 'TRANS-123' }
  ];

  const analyticsData = {
    monthlySales: 45,
    turnoverRate: 2.3,
    profitMargin: calculateMargin(item?.cost, item?.price),
    stockValue: (item?.currentStock * item?.cost) || 0
  };

  const stockStatus = getStockStatus(item?.currentStock, item?.minimumStock);
  const expiryStatus = getExpiryStatus(item?.expiryDate);
  const margin = calculateMargin(item?.cost, item?.price);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl max-h-[95vh] bg-gray-900 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-800/50">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {item?.image ? (
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        className="w-14 h-14 rounded-lg object-cover border border-gray-600"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-800 border border-gray-600 flex items-center justify-center">
                        <Icon name="Package" size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      stockStatus.status === 'out-of-stock' ? 'bg-red-400' :
                      stockStatus.status === 'low-stock' ? 'bg-amber-400' :
                      stockStatus.status === 'adequate' ? 'bg-emerald-400' : 'bg-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {item?.name}
                    </h2>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded">
                        {item?.code}
                      </p>
                      {item?.barcode && (
                        <p className="text-sm text-gray-400 flex items-center space-x-1">
                          <Icon name="Barcode" size={14} />
                          <span>{item?.barcode}</span>
                        </p>
                      )}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item?.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        item?.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {item?.status === 'active' ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Quick Actions */}
                  {!editMode && userRole === 'admin' && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction('adjust_stock')}
                        iconName="Plus"
                        iconSize={14}
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                      >
                        Ajustar Stock
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction('print_label')}
                        iconName="Printer"
                        iconSize={14}
                        className="border-gray-600 text-gray-400 hover:bg-gray-500/20"
                      >
                        Etiqueta
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(true)}
                        iconName="Edit"
                        iconSize={16}
                        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    iconName="X"
                    iconSize={20}
                    className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-700/50 bg-gray-800/30">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                      activeTab === tab.id
                        ? 'text-blue-400 border-blue-400 bg-blue-500/10' 
                        : 'text-gray-400 border-transparent hover:text-gray-300 hover:bg-gray-700/30'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto max-h-[calc(95vh-200px)]">
                <div className="p-6">
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Stats Cards */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                          <div className="text-sm text-gray-400 mb-1">Stock Actual</div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${stockStatus.color}`} />
                            <div className="text-2xl font-bold text-white">
                              {item?.currentStock || 0}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Mín: {item?.minimumStock || 0}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                          <div className="text-sm text-gray-400 mb-1">Valor Total</div>
                          <div className="text-2xl font-bold text-white">
                            {formatCurrency((item?.currentStock || 0) * (item?.cost || 0))}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Costo unitario
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                          <div className="text-sm text-gray-400 mb-1">Margen</div>
                          <div className={`text-2xl font-bold ${
                            margin >= 50 ? 'text-emerald-400' :
                            margin >= 25 ? 'text-green-400' :
                            margin >= 10 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {margin.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatCurrency(item?.price - item?.cost)} por unidad
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                          <div className="text-sm text-gray-400 mb-1">Vencimiento</div>
                          <div className="text-lg font-semibold text-white">
                            {item?.expiryDate ? formatDate(item.expiryDate, false) : 'N/A'}
                          </div>
                          <div className={`text-xs font-medium mt-1 ${expiryStatus.color}`}>
                            {expiryStatus.label}
                          </div>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Input
                            label="Nombre del Producto"
                            value={editMode ? formData?.name : item?.name}
                            onChange={(e) => handleInputChange('name', e?.target?.value)}
                            disabled={!editMode}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Código/SKU"
                              value={editMode ? formData?.code : item?.code}
                              onChange={(e) => handleInputChange('code', e?.target?.value)}
                              disabled={!editMode}
                            />

                            <Input
                              label="Código de Barras"
                              value={editMode ? formData?.barcode : item?.barcode}
                              onChange={(e) => handleInputChange('barcode', e?.target?.value)}
                              disabled={!editMode}
                            />
                          </div>

                          <Select
                            label="Categoría"
                            options={categoryOptions}
                            value={editMode ? formData?.category : item?.category}
                            onChange={(value) => handleInputChange('category', value)}
                            disabled={!editMode}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Stock Actual"
                              type="number"
                              value={editMode ? formData?.currentStock : item?.currentStock}
                              onChange={(e) => handleInputChange('currentStock', parseInt(e?.target?.value) || 0)}
                              disabled={!editMode}
                            />

                            <Input
                              label="Stock Mínimo"
                              type="number"
                              value={editMode ? formData?.minimumStock : item?.minimumStock}
                              onChange={(e) => handleInputChange('minimumStock', parseInt(e?.target?.value) || 0)}
                              disabled={!editMode}
                            />
                          </div>

                          <Select
                            label="Ubicación"
                            options={locationOptions}
                            value={editMode ? formData?.location : item?.location}
                            onChange={(value) => handleInputChange('location', value)}
                            disabled={!editMode}
                          />
                        </div>

                        <div className="space-y-4">
                          <Select
                            label="Proveedor"
                            options={supplierOptions}
                            value={editMode ? formData?.supplier : item?.supplier}
                            onChange={(value) => handleInputChange('supplier', value)}
                            disabled={!editMode}
                          />

                          <Select
                            label="Unidad de Medida"
                            options={unitOptions}
                            value={editMode ? formData?.unit : item?.unit}
                            onChange={(value) => handleInputChange('unit', value)}
                            disabled={!editMode}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Precio de Costo"
                              type="number"
                              step="0.01"
                              value={editMode ? formData?.cost : item?.cost}
                              onChange={(e) => handleInputChange('cost', parseFloat(e?.target?.value) || 0)}
                              disabled={!editMode}
                              prefix="MXN"
                            />

                            <Input
                              label="Precio de Venta"
                              type="number"
                              step="0.01"
                              value={editMode ? formData?.price : item?.price}
                              onChange={(e) => handleInputChange('price', parseFloat(e?.target?.value) || 0)}
                              disabled={!editMode}
                              prefix="MXN"
                            />
                          </div>

                          <Input
                            label="Fecha de Vencimiento"
                            type="date"
                            value={editMode ? formData?.expiryDate : item?.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                            disabled={!editMode}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Lote"
                              value={editMode ? formData?.batch : item?.batch}
                              onChange={(e) => handleInputChange('batch', e?.target?.value)}
                              disabled={!editMode}
                            />

                            <Input
                              label="Número de Serie"
                              value={editMode ? formData?.serialNumber : item?.serialNumber}
                              onChange={(e) => handleInputChange('serialNumber', e?.target?.value)}
                              disabled={!editMode}
                            />
                          </div>
                        </div>
                      </div>

                      <Input
                        label="Descripción"
                        type="textarea"
                        rows={3}
                        value={editMode ? formData?.description : item?.description}
                        onChange={(e) => handleInputChange('description', e?.target?.value)}
                        disabled={!editMode}
                        placeholder="Descripción detallada del producto..."
                      />

                      {/* Edit Actions */}
                      {editMode && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-end space-x-3 pt-6 border-t border-gray-700/50"
                        >
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="default"
                            onClick={handleSave}
                            iconName="Save"
                            iconSize={16}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Guardar Cambios
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Historial de Movimientos</h3>
                      <div className="space-y-3">
                        {movementHistory.map((movement) => (
                          <motion.div
                            key={movement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 transition-colors duration-150"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                movement.type === 'in' ? 'bg-emerald-500/20 text-emerald-400' : 
                                movement.type === 'out' ? 'bg-red-500/20 text-red-400' : 
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                                <Icon 
                                  name={movement.type === 'in' ? 'ArrowDownLeft' : movement.type === 'out' ? 'ArrowUpRight' : 'RefreshCw'} 
                                  size={16} 
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {movement.description}
                                </div>
                                <div className="text-xs text-gray-400">
                                  <span className="font-medium">{movement.user}</span> • {formatDate(movement.date)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className={`text-sm font-semibold ${
                                movement.type === 'in' ? 'text-emerald-400' : 
                                movement.type === 'out' ? 'text-red-400' : 'text-amber-400'
                              }`}>
                                {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}{movement.quantity}
                              </div>
                              <div className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                                {movement.reference}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'movements' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Movimientos Recientes</h3>
                      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-700/50">
                              <th className="text-left p-4 text-sm font-medium text-gray-400">Fecha</th>
                              <th className="text-left p-4 text-sm font-medium text-gray-400">Tipo</th>
                              <th className="text-left p-4 text-sm font-medium text-gray-400">Cantidad</th>
                              <th className="text-left p-4 text-sm font-medium text-gray-400">Usuario</th>
                              <th className="text-left p-4 text-sm font-medium text-gray-400">Referencia</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentMovements.map((movement, index) => (
                              <tr key={movement.id} className="border-b border-gray-700/30 last:border-b-0 hover:bg-gray-700/30 transition-colors duration-150">
                                <td className="p-4 text-sm text-gray-300">{formatDate(movement.date)}</td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                    movement.type === 'purchase' ? 'bg-emerald-500/20 text-emerald-400' :
                                    movement.type === 'sale' ? 'bg-red-500/20 text-red-400' :
                                    movement.type === 'transfer' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    <Icon 
                                      name={
                                        movement.type === 'purchase' ? 'ShoppingCart' :
                                        movement.type === 'sale' ? 'DollarSign' :
                                        movement.type === 'transfer' ? 'Truck' : 'Settings'
                                      } 
                                      size={12} 
                                      className="mr-1" 
                                    />
                                    {movement.type === 'purchase' ? 'Compra' :
                                     movement.type === 'sale' ? 'Venta' :
                                     movement.type === 'transfer' ? 'Transferencia' : 'Ajuste'}
                                  </span>
                                </td>
                                <td className="p-4 text-sm text-white font-medium">{movement.quantity}</td>
                                <td className="p-4 text-sm text-gray-300">{movement.user}</td>
                                <td className="p-4 text-sm text-gray-400 font-mono">{movement.reference}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Análisis del Producto</h3>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                          <div className="text-sm text-gray-400 mb-2">Ventas del Mes</div>
                          <div className="text-3xl font-bold text-white mb-2">{analyticsData.monthlySales}</div>
                          <div className="text-xs text-emerald-400 flex items-center">
                            <Icon name="TrendingUp" size={12} className="mr-1" />
                            +12% vs mes anterior
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                          <div className="text-sm text-gray-400 mb-2">Rotación</div>
                          <div className="text-3xl font-bold text-white mb-2">{analyticsData.turnoverRate}x</div>
                          <div className="text-xs text-amber-400">
                            Veces por mes
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                          <div className="text-sm text-gray-400 mb-2">Valor en Inventario</div>
                          <div className="text-3xl font-bold text-white mb-2">
                            {formatCurrency(analyticsData.stockValue)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {item?.currentStock} unidades
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                          <div className="text-sm text-gray-400 mb-2">Margen de Ganancia</div>
                          <div className="text-3xl font-bold text-emerald-400 mb-2">
                            {analyticsData.profitMargin.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatCurrency(item?.price - item?.cost)} por unidad
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                        <h4 className="text-md font-semibold text-white mb-4">Tendencias de Stock</h4>
                        <div className="text-center py-8 text-gray-500">
                          <Icon name="BarChart3" size={48} className="mx-auto mb-2 opacity-50" />
                          <p>Gráfico de tendencias no disponible</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'photos' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Multimedia del Producto</h3>
                      
                      {item?.images?.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                          {item.images.map((image, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700/50"
                            >
                              <Image
                                src={image.url}
                                alt={image.alt || item.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  iconName="Maximize"
                                  iconSize={16}
                                  className="text-white hover:bg-white/20"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  iconName="Download"
                                  iconSize={16}
                                  className="text-white hover:bg-white/20"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  iconName="Trash2"
                                  iconSize={16}
                                  className="text-white hover:bg-red-500/20"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700/50 rounded-lg">
                          <Icon name="Image" size={48} className="mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">No hay imágenes</p>
                          <p className="text-sm mb-4">Agrega imágenes para mostrar el producto</p>
                          <Button
                            variant="outline"
                            iconName="Plus"
                            iconSize={16}
                            className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
                          >
                            Agregar Imágenes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailsModal;