import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SaleModal = ({ 
  isOpen, 
  onClose, 
  onConfirmSale, 
  inventoryData = [],
  userRole = 'admin'
}) => {
  const [saleData, setSaleData] = useState({
    customer: '',
    customerType: 'retail',
    paymentMethod: 'cash',
    items: [],
    notes: '',
    discount: 0,
    tax: 16
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [quantityInputs, setQuantityInputs] = useState({});

  // Filtrar productos disponibles
  const availableProducts = useMemo(() => {
    return inventoryData.filter(item => 
      (item.currentStock || 0) > 0 && 
      (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.code?.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 10);
  }, [inventoryData, searchQuery]);

  // Calcular totales
  const totals = useMemo(() => {
    const subtotal = saleData.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    const discountAmount = (subtotal * saleData.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * saleData.tax) / 100;
    const total = subtotal - discountAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  }, [saleData.items, saleData.discount, saleData.tax]);

  // Agregar producto a la venta
  const handleAddProduct = useCallback((product) => {
    const existingItem = saleData.items.find(item => item.id === product.id);
    
    if (existingItem) {
      // Incrementar cantidad si ya existe
      setSaleData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      // Agregar nuevo item
      setSaleData(prev => ({
        ...prev,
        items: [...prev.items, {
          id: product.id,
          code: product.code,
          name: product.name,
          price: product.price,
          cost: product.cost,
          quantity: 1,
          currentStock: product.currentStock,
          maxQuantity: product.currentStock
        }]
      }));
    }
    
    setSearchQuery('');
  }, [saleData.items]);

  // Actualizar cantidad de un producto
  const handleUpdateQuantity = useCallback((productId, quantity) => {
    const product = saleData.items.find(item => item.id === productId);
    if (!product) return;

    const newQuantity = Math.max(0, Math.min(quantity, product.maxQuantity));
    
    if (newQuantity === 0) {
      // Eliminar producto si cantidad es 0
      setSaleData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== productId)
      }));
    } else {
      // Actualizar cantidad
      setSaleData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }));
    }
  }, [saleData.items]);

  // Eliminar producto de la venta
  const handleRemoveProduct = useCallback((productId) => {
    setSaleData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== productId)
    }));
  }, []);

  // Confirmar venta
  const handleConfirmSale = useCallback(() => {
    if (saleData.items.length === 0) return;

    const saleRecord = {
      ...saleData,
      id: `SALE-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'completed',
      totals
    };

    onConfirmSale(saleRecord);
    
    // Resetear formulario
    setSaleData({
      customer: '',
      customerType: 'retail',
      paymentMethod: 'cash',
      items: [],
      notes: '',
      discount: 0,
      tax: 16
    });
    
    onClose();
  }, [saleData, totals, onConfirmSale, onClose]);

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
          className="relative w-full max-w-6xl max-h-[95vh] bg-gray-900 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-800/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Icon name="ShoppingCart" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Registrar Venta</h2>
                <p className="text-gray-400">Complete los detalles de la venta</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
              iconSize={20}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto max-h-[calc(95vh-120px)]">
            <div className="p-6 space-y-6">
              {/* Información del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Cliente"
                  value={saleData.customer}
                  onChange={(e) => setSaleData(prev => ({ ...prev, customer: e.target.value }))}
                  placeholder="Nombre del cliente"
                />
                <Select
                  label="Tipo de Cliente"
                  options={[
                    { value: 'retail', label: 'Venta al Público' },
                    { value: 'wholesale', label: 'Mayorista' },
                    { value: 'regular', label: 'Cliente Regular' }
                  ]}
                  value={saleData.customerType}
                  onChange={(value) => setSaleData(prev => ({ ...prev, customerType: value }))}
                />
                <Select
                  label="Método de Pago"
                  options={[
                    { value: 'cash', label: 'Efectivo' },
                    { value: 'card', label: 'Tarjeta' },
                    { value: 'transfer', label: 'Transferencia' },
                    { value: 'credit', label: 'Crédito' }
                  ]}
                  value={saleData.paymentMethod}
                  onChange={(value) => setSaleData(prev => ({ ...prev, paymentMethod: value }))}
                />
              </div>

              {/* Búsqueda de productos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Agregar Productos</h3>
                <Input
                  placeholder="Buscar productos por nombre o código..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  iconName="Search"
                />
                
                {searchQuery && availableProducts.length > 0 && (
                  <motion.div 
                    className="border border-gray-700/50 rounded-lg bg-gray-800/50 max-h-60 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {availableProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        className="flex items-center justify-between p-3 border-b border-gray-700/30 last:border-b-0 hover:bg-gray-700/50 cursor-pointer"
                        onClick={() => handleAddProduct(product)}
                        whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium">{product.name}</div>
                          <div className="text-gray-400 text-sm">
                            Código: {product.code} | Stock: {product.currentStock} | Precio: ${product.price}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddProduct(product);
                          }}
                          className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                          Agregar
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Productos en la venta */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Productos en Venta ({saleData.items.length})
                </h3>
                
                {saleData.items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-700/50 rounded-lg">
                    <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No hay productos en la venta</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {saleData.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30"
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-gray-400 text-sm">
                            Código: {item.code} | Precio: ${item.price} | Stock: {item.currentStock}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 p-0"
                              iconName="Minus"
                              iconSize={12}
                            />
                            <span className="text-white font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxQuantity}
                              className="w-8 h-8 p-0"
                              iconName="Plus"
                              iconSize={12}
                            />
                          </div>
                          
                          <div className="text-right min-w-20">
                            <div className="text-white font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            iconName="Trash2"
                            iconSize={16}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totales y descuentos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    label="Descuento (%)"
                    type="number"
                    value={saleData.discount}
                    onChange={(e) => setSaleData(prev => ({ 
                      ...prev, 
                      discount: Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                    }))}
                    min="0"
                    max="100"
                  />
                  
                  <Input
                    label="Notas"
                    type="textarea"
                    rows={3}
                    value={saleData.notes}
                    onChange={(e) => setSaleData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notas adicionales de la venta..."
                  />
                </div>
                
                {/* Resumen de totales */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/30">
                  <h4 className="text-lg font-semibold text-white mb-4">Resumen de Venta</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-amber-400">
                      <span>Descuento ({saleData.discount}%):</span>
                      <span>-${totals.discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-blue-400">
                      <span>IVA ({saleData.tax}%):</span>
                      <span>${totals.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-700/50 pt-3 flex justify-between text-lg font-bold text-emerald-400">
                      <span>Total:</span>
                      <span>${totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-700/50 bg-gray-800/50">
            <div className="text-gray-400">
              {saleData.items.length} productos • {saleData.items.reduce((sum, item) => sum + item.quantity, 0)} unidades
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleConfirmSale}
                disabled={saleData.items.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                iconName="Check"
                iconSize={16}
              >
                Confirmar Venta
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SaleModal;