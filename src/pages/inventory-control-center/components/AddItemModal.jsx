import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Image from '../../../components/appImage';
import { FileUpload } from '../../../components/FileUpload';
import ProductFiles from '../../../components/ProductFiles';

const AddItemModal = ({ isOpen, onClose, onSave, userRole = 'admin' }) => {
  // Estado
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    unit: 'piece',
    cost: '',
    price: '',
    currentStock: 0,
    minimumStock: 0,
    maximumStock: '',
    location: '',
    supplier: '',
    barcode: '',
    batch: '',
    serialNumber: '',
    expiryDate: '',
    isPerishable: false,
    requiresBatchControl: false,
    images: [],
    notes: '',
    files: []
  });

  const [activeStep, setActiveStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProductId, setNewProductId] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Animaciones simplificadas
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.15
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Opciones memoizadas
  const categoryOptions = useMemo(() => [
    { value: 'electronic-components', label: '🔌 Componentes Electrónicos' },
    { value: 'sensors', label: '📡 Sensores' },
    { value: 'cables', label: '🔗 Cables y Conectores' },
    { value: 'control-modules', label: '💻 Módulos de Control' },
    { value: 'diagnostic-tools', label: '🛠️ Herramientas de Diagnóstico' },
    { value: 'lighting', label: '💡 Iluminación' },
    { value: 'power-systems', label: '⚡ Sistemas de Energía' },
    { value: 'perishable', label: '⏰ Productos Perecederos' },
  ], []);

  const supplierOptions = useMemo(() => [
    { value: 'bosch', label: '🏭 Bosch México' },
    { value: 'continental', label: '🚗 Continental Automotive' },
    { value: 'delphi', label: '🔧 Delphi Technologies' },
    { value: 'denso', label: '🇯🇵 DENSO México' },
    { value: 'valeo', label: '⚙️ Valeo México' },
    { value: 'hella', label: '💡 HELLA México' },
    { value: 'local-supplier', label: '🏪 Proveedor Local' }
  ], []);

  const locationOptions = useMemo(() => [
    { value: 'warehouse-a', label: '🏢 Almacén A - Principal' },
    { value: 'warehouse-b', label: '🏬 Almacén B - Secundario' },
    { value: 'workshop-1', label: '🔧 Taller 1 - Diagnóstico' },
    { value: 'workshop-2', label: '⚡ Taller 2 - Reparación' },
    { value: 'office', label: '💼 Oficina - Herramientas' },
    { value: 'branch-1', label: '📍 Sucursal Norte' },
    { value: 'branch-2', label: '📍 Sucursal Sur' }
  ], []);

  const unitOptions = useMemo(() => [
    { value: 'piece', label: '📦 Pieza' },
    { value: 'box', label: '📦 Caja' },
    { value: 'liter', label: '💧 Litro' },
    { value: 'kg', label: '⚖️ Kilogramo' },
    { value: 'meter', label: '📏 Metro' }
  ], []);

  const steps = useMemo(() => [
    { 
      number: 1, 
      title: 'Información Básica', 
      description: 'Datos principales'
    },
    { 
      number: 2, 
      title: 'Stock y Precios', 
      description: 'Gestión de inventario'
    },
    { 
      number: 3, 
      title: 'Ubicación y Control', 
      description: 'Logística y controles'
    },
    { 
      number: 4, 
      title: 'Multimedia y Archivos',
      description: 'Imágenes y documentos'
    }
  ], []);

  // Validación de pasos
  const isStepValid = useCallback(() => {
    switch (activeStep) {
      case 1:
        return formData.code?.trim() && formData.name?.trim() && formData.category;
      case 2:
        return formData.cost !== '' && formData.price !== '' && formData.currentStock >= 0;
      case 3:
        return formData.location && formData.supplier;
      case 4:
        return true;
      default:
        return false;
    }
  }, [activeStep, formData]);

  // Reset cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData({
          code: '',
          name: '',
          description: '',
          category: '',
          unit: 'piece',
          cost: '',
          price: '',
          currentStock: 0,
          minimumStock: 0,
          maximumStock: '',
          location: '',
          supplier: '',
          barcode: '',
          batch: '',
          serialNumber: '',
          expiryDate: '',
          isPerishable: false,
          requiresBatchControl: false,
          images: [],
          notes: '',
          files: []
        });
        setActiveStep(1);
        setImagePreview(null);
        setIsSubmitting(false);
        setNewProductId(null);
        setSaveError(null);
        setSaveSuccess(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (saveError) {
      setSaveError(null);
    }
  }, [saveError]);

  const handleNumberChange = useCallback((field, value) => {
    if (value === '' || value === null || value === undefined) {
      setFormData(prev => ({
        ...prev,
        [field]: ''
      }));
      return;
    }
    
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      const finalValue = numValue < 0 ? 0 : numValue;
      setFormData(prev => ({
        ...prev,
        [field]: finalValue
      }));
    }
  }, []);

  const handleImageUpload = useCallback((event) => {
    const file = event?.target?.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveError('Solo se permiten archivos de imagen');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setSaveError('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e?.target?.result);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { 
            url: e?.target?.result, 
            alt: 'Product image',
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
          }]
        }));
      };
      reader.onerror = () => {
        setSaveError('Error al cargar la imagen');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    if (formData.images.length === 1) {
      setImagePreview(null);
    }
  }, [formData.images.length]);

  const handleFileUploaded = useCallback((fileData) => {
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, fileData._id]
    }));
  }, []);

  // ✅ CORREGIDO: Función de guardado simplificada y robusta
  const handleSubmit = useCallback(async () => {
    if (!isStepValid()) {
      setSaveError('Por favor complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      if (!formData.code?.trim()) {
        throw new Error('El código del producto es requerido');
      }
      
      if (!formData.name?.trim()) {
        throw new Error('El nombre del producto es requerido');
      }
      
      if (!formData.category) {
        throw new Error('La categoría es requerida');
      }

      const cost = parseFloat(formData.cost) || 0;
      const price = parseFloat(formData.price) || 0;
      
      if (price < cost) {
        throw new Error('El precio de venta no puede ser menor al costo');
      }

      const currentStockValue = Number(formData.currentStock) || 0;
      const minimumStockValue = Number(formData.minimumStock) || 0;

      const finalData = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        category: formData.category,
        unit: formData.unit,
        cost: cost,
        price: price,
        currentStock: currentStockValue,
        minimumStock: minimumStockValue,
        maximumStock: formData.maximumStock ? parseInt(formData.maximumStock) : null,
        location: formData.location,
        supplier: formData.supplier,
        barcode: formData.barcode?.trim() || '',
        batch: formData.batch?.trim() || '',
        serialNumber: formData.serialNumber?.trim() || '',
        expiryDate: formData.expiryDate || null,
        isPerishable: formData.isPerishable,
        requiresBatchControl: formData.requiresBatchControl,
        notes: formData.notes?.trim() || '',
        files: formData.files,
        images: formData.images,
        status: 'active',
        createdBy: userRole,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      console.log('📤 Enviando datos al servidor:', finalData);
      
      // ✅ CORREGIDO: Llamada simplificada a onSave
      await onSave(finalData);
      
      // ✅ Si llegamos aquí, significa que onSave se ejecutó sin lanzar excepción
      // No dependemos de la respuesta, solo del hecho de que no hubo error
      setSaveSuccess(true);
      console.log('✅ Producto guardado exitosamente');
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error al guardar producto:', error);
      setSaveError(error.message || 'Error desconocido al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, userRole, onSave, onClose, isStepValid]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [onClose, isSubmitting]);

  const nextStep = useCallback(() => {
    setActiveStep(prev => Math.min(prev + 1, steps.length));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  }, []);

  const generateBarcode = useCallback(() => {
    const randomBarcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    handleInputChange('barcode', randomBarcode);
  }, [handleInputChange]);

  const generateSKU = useCallback(() => {
    const category = categoryOptions.find(cat => cat.value === formData.category);
    const categoryPrefix = category ? category.value.substring(0, 3).toUpperCase() : 'GEN';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const sku = `${categoryPrefix}-${randomNum}`;
    handleInputChange('code', sku);
  }, [formData.category, categoryOptions, handleInputChange]);

  const calculateMargin = useCallback(() => {
    if (!formData.cost || !formData.price) return 0;
    const cost = parseFloat(formData.cost);
    const price = parseFloat(formData.price);
    if (cost === 0) return 0;
    return ((price - cost) / cost * 100);
  }, [formData.cost, formData.price]);

  // Componente StockStatusIndicator
  const StockStatusIndicator = useCallback(() => {
    const getStockStatus = () => {
      const currentStock = parseInt(formData.currentStock) || 0;
      const minimumStock = parseInt(formData.minimumStock) || 0;
      
      if (currentStock === 0) return { status: 'out-of-stock', color: 'red', label: 'Sin Stock' };
      if (currentStock <= minimumStock) return { status: 'low-stock', color: 'amber', label: 'Stock Bajo' };
      if (currentStock > minimumStock * 2) return { status: 'overstock', color: 'emerald', label: 'Stock Alto' };
      return { status: 'adequate', color: 'blue', label: 'Stock Adecuado' };
    };

    const status = getStockStatus();
    
    const colorClasses = {
      red: 'bg-red-500/10 border-red-500/20 text-red-400',
      amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400', 
      emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    };

    return (
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${colorClasses[status.color]}`}>
        <div className={`w-2 h-2 rounded-full ${
          status.color === 'red' ? 'bg-red-500' :
          status.color === 'amber' ? 'bg-amber-500' :
          status.color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
        }`}></div>
        <span className="text-sm font-medium">{status.label}</span>
      </div>
    );
  }, [formData.currentStock, formData.minimumStock]);

  // Componente StepIndicator
  const StepIndicator = useCallback(({ step, isActive, isCompleted }) => {
    const getStepColor = (stepNumber) => {
      switch (stepNumber) {
        case 1: return 'blue';
        case 2: return 'emerald'; 
        case 3: return 'purple';
        case 4: return 'amber';
        default: return 'blue';
      }
    };

    const color = getStepColor(step.number);
    const colorClasses = {
      blue: 'bg-blue-500 border-blue-500 shadow-blue-500/25',
      emerald: 'bg-emerald-500 border-emerald-500 shadow-emerald-500/25',
      purple: 'bg-purple-500 border-purple-500 shadow-purple-500/25', 
      amber: 'bg-amber-500 border-amber-500 shadow-amber-500/25'
    };

    return (
      <div className={`relative flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl border-2 transition-all duration-300 ${
        isActive || isCompleted ? colorClasses[color] : 'bg-gray-700/50 border-gray-600 text-gray-400'
      }`}>
        {isCompleted ? (
          <span className="text-white font-bold text-sm">✓</span>
        ) : (
          <span className={`font-bold text-sm ${isActive ? "text-white" : "text-gray-400"}`}>
            {step.number}
          </span>
        )}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded border border-gray-700">
          <span className="text-xs font-semibold text-gray-300">{step.number}</span>
        </div>
      </div>
    );
  }, []);

  // Render condicional
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <motion.div
        key="modal-backdrop"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Principal */}
      <motion.div
        key="modal-content"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 p-4 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-blue-500/20 rounded-xl sm:rounded-2xl border border-blue-500/30">
                <span className="text-blue-400 text-lg">+</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {saveSuccess ? '✅ Producto Guardado' : 'Nuevo Producto'}
                </h2>
                <p className="text-gray-400 mt-1 text-sm sm:text-base">
                  {saveSuccess ? 'El producto se ha guardado exitosamente' : 'Complete la información del producto paso a paso'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="hover:bg-gray-700/50 rounded-lg sm:rounded-xl disabled:opacity-50"
            >
              <span className="text-lg">×</span>
            </Button>
          </div>
        </div>

        {/* Mensajes de Error */}
        {saveError && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">⚠</span>
              <span className="text-red-400 text-sm">{saveError}</span>
            </div>
          </div>
        )}

        {/* Mensajes de Éxito */}
        {saveSuccess && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400">✓</span>
              <span className="text-emerald-400 text-sm">
                Producto guardado exitosamente. Cerrando automáticamente...
              </span>
            </div>
          </div>
        )}

        {/* Progress Steps - Ocultar cuando hay éxito */}
        {!saveSuccess && (
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-700/30 bg-gray-800/20">
            <div className="flex items-center justify-between overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1 min-w-0">
                  <div className="flex items-center">
                    <StepIndicator 
                      step={step}
                      isActive={activeStep === step.number}
                      isCompleted={activeStep > step.number}
                    />
                    <div className="ml-2 sm:ml-4 hidden sm:block">
                      <div className={`text-sm font-semibold ${
                        activeStep >= step.number ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 sm:mx-6 ${
                      activeStep > step.number ? 'bg-emerald-500' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contenido del Formulario - Ocultar cuando hay éxito */}
        {!saveSuccess && (
          <div className="flex-1 overflow-hidden">
            <div className="h-[400px] sm:h-[500px] overflow-y-auto">
              <div className="p-4 sm:p-8">
                {/* Paso 1: Información Básica */}
                {activeStep === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Columna Izquierda */}
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2 sm:mb-3">
                            Identificación del Producto
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                              <Input
                                label="Código/SKU *"
                                value={formData.code}
                                onChange={(e) => handleInputChange('code', e.target.value)}
                                placeholder="SENS-1234"
                                className="bg-gray-800/50 border-gray-600"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={generateSKU}
                                className="w-full"
                              >
                                Generar SKU
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <Input
                                label="Código de Barras"
                                value={formData.barcode}
                                onChange={(e) => handleInputChange('barcode', e.target.value)}
                                placeholder="13 dígitos"
                                className="bg-gray-800/50 border-gray-600"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={generateBarcode}
                                className="w-full"
                              >
                                Generar Código
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Input
                          label="Nombre del Producto *"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Nombre descriptivo y comercial del producto"
                          className="bg-gray-800/50 border-gray-600"
                        />

                        <Input
                          label="Descripción"
                          type="textarea"
                          rows={3}
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Descripción detallada, características técnicas, especificaciones..."
                          className="bg-gray-800/50 border-gray-600"
                        />
                      </div>

                      {/* Columna Derecha */}
                      <div className="space-y-4 sm:space-y-6">
                        <Select
                          label="Categoría *"
                          options={categoryOptions}
                          value={formData.category}
                          onChange={(value) => handleInputChange('category', value)}
                          placeholder="Seleccione una categoría"
                          className="bg-gray-800/50 border-gray-600"
                        />

                        <Select
                          label="Unidad de Medida"
                          options={unitOptions}
                          value={formData.unit}
                          onChange={(value) => handleInputChange('unit', value)}
                          className="bg-gray-800/50 border-gray-600"
                        />

                        {/* Preview Card */}
                        <div className="bg-gray-800/30 rounded-lg sm:rounded-xl border border-gray-700/50 p-3 sm:p-4">
                          <h4 className="text-sm font-semibold text-white mb-2 sm:mb-3">Vista Previa</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">SKU:</span>
                              <span className="text-white font-mono">{formData.code || '---'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Nombre:</span>
                              <span className="text-white truncate">{formData.name || '---'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Categoría:</span>
                              <span className="text-blue-400">
                                {formData.category ? 
                                  categoryOptions.find(c => c.value === formData.category)?.label.split(' ').slice(1).join(' ') 
                                  : '---'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 2: Stock y Precios */}
                {activeStep === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                      {/* Precios */}
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-3 sm:mb-4">Información de Precios</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Input
                              label="Costo de Adquisición *"
                              type="number"
                              step="0.01"
                              value={formData.cost}
                              onChange={(e) => handleNumberChange('cost', e.target.value)}
                              placeholder="0.00"
                              prefix="MXN"
                              className="bg-gray-800/50 border-gray-600"
                            />

                            <Input
                              label="Precio de Venta *"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => handleNumberChange('price', e.target.value)}
                              placeholder="0.00"
                              prefix="MXN"
                              className="bg-gray-800/50 border-gray-600"
                            />
                          </div>
                          
                          {/* Calculadora de Margen */}
                          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/5 rounded-lg sm:rounded-xl border border-emerald-500/20">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                              <div>
                                <div className="text-sm text-emerald-400 font-semibold">Margen de Ganancia</div>
                                <div className="text-xl sm:text-2xl font-bold text-white">
                                  {calculateMargin().toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-400">Ganancia por unidad</div>
                                <div className="text-lg font-semibold text-white">
                                  MXN {formData.cost && formData.price ? (formData.price - formData.cost).toFixed(2) : '0.00'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stock */}
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-3 sm:mb-4">Gestión de Stock</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <Input
                              label="Stock Inicial"
                              type="number"
                              value={formData.currentStock}
                              onChange={(e) => handleNumberChange('currentStock', e.target.value)}
                              placeholder="0"
                              className="bg-gray-800/50 border-gray-600"
                            />

                            <Input
                              label="Stock Mínimo"
                              type="number"
                              value={formData.minimumStock}
                              onChange={(e) => handleNumberChange('minimumStock', e.target.value)}
                              placeholder="0"
                              className="bg-gray-800/50 border-gray-600"
                            />

                            <Input
                              label="Stock Máximo"
                              type="number"
                              value={formData.maximumStock}
                              onChange={(e) => handleNumberChange('maximumStock', e.target.value)}
                              placeholder="Opcional"
                              className="bg-gray-800/50 border-gray-600"
                            />
                          </div>
                          
                          {/* Indicador de Estado de Stock */}
                          <div className="mt-3 sm:mt-4">
                            <StockStatusIndicator />
                          </div>
                        </div>

                        {/* Alerta de Stock */}
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className="text-amber-400">⚠</span>
                            <div>
                              <div className="text-sm font-semibold text-amber-400">Sistema de Alertas</div>
                              <div className="text-xs text-amber-300 mt-1">
                                Notificaciones automáticas cuando el stock alcance el nivel mínimo configurado.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 3: Ubicación y Control */}
                {activeStep === 3 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                      {/* Ubicación y Proveedor */}
                      <div className="space-y-4 sm:space-y-6">
                        <Select
                          label="Ubicación en Almacén *"
                          options={locationOptions}
                          value={formData.location}
                          onChange={(value) => handleInputChange('location', value)}
                          placeholder="Seleccione ubicación"
                          className="bg-gray-800/50 border-gray-600"
                        />

                        <Select
                          label="Proveedor Principal *"
                          options={supplierOptions}
                          value={formData.supplier}
                          onChange={(value) => handleInputChange('supplier', value)}
                          placeholder="Seleccione proveedor"
                          className="bg-gray-800/50 border-gray-600"
                        />
                      </div>

                      {/* Control de Lotes y Series */}
                      <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <Input
                            label="Número de Lote"
                            value={formData.batch}
                            onChange={(e) => handleInputChange('batch', e.target.value)}
                            placeholder="LOTE-2024-001"
                            className="bg-gray-800/50 border-gray-600"
                          />

                          <Input
                            label="Número de Serie"
                            value={formData.serialNumber}
                            onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                            placeholder="SN-UNICO-001"
                            className="bg-gray-800/50 border-gray-600"
                          />
                        </div>

                        <Input
                          label="Fecha de Vencimiento"
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          className="bg-gray-800/50 border-gray-600"
                        />

                        <div className="space-y-3 sm:space-y-4">
                          <Checkbox
                            label="📅 Producto Perecedero"
                            checked={formData.isPerishable}
                            onChange={(e) => handleInputChange('isPerishable', e.target.checked)}
                            description="Activa alertas de caducidad automáticas"
                          />
                          
                          <Checkbox
                            label="🔢 Control por Lotes"
                            checked={formData.requiresBatchControl}
                            onChange={(e) => handleInputChange('requiresBatchControl', e.target.checked)}
                            description="Requiere seguimiento individual por lote"
                          />
                        </div>

                        {formData.isPerishable && (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <span className="text-blue-400">📅</span>
                              <div>
                                <div className="text-sm font-semibold text-blue-400">Control de Caducidad Activado</div>
                                <div className="text-xs text-blue-300 mt-1">
                                  Alertas automáticas 30, 15 y 7 días antes del vencimiento.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 4: Multimedia y Archivos */}
                {activeStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Columna Izquierda: Imágenes y Archivos */}
                      <div className="space-y-6">
                        
                        {/* Sección de Archivos */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/20 rounded-xl p-6 border border-blue-500/30">
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-blue-400">📎</span>
                            Documentos Adjuntos
                          </h4>
                          <p className="text-sm text-gray-400 mb-4">
                            Agrega manuales, especificaciones técnicas, certificados u otros documentos relacionados con el producto.
                          </p>
                          
                          {/* FileUpload Component */}
                          <div className="mb-4 p-4 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-600/50 hover:border-blue-500/50 transition-colors">
                            <FileUpload 
                              productId={newProductId}
                              onUpload={handleFileUploaded}
                            />
                          </div>
                          
                          {/* Lista de archivos */}
                          <div className="mt-4">
                            <ProductFiles productId={newProductId} />
                          </div>
                        </div>

                        {/* Sección de Imágenes */}
                        <div className="bg-gradient-to-br from-gray-800/50 to-purple-900/20 rounded-xl p-6 border border-purple-500/30">
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-purple-400">🖼️</span>
                            Galería de Imágenes
                          </h4>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={image.url}
                                  alt={image.alt}
                                  className="w-full h-20 sm:h-24 rounded-lg sm:rounded-xl object-cover border-2 border-gray-600"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-lg sm:rounded-xl transition-opacity duration-200 flex items-center justify-center space-x-1 sm:space-x-2">
                                  <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="p-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                                  >
                                    <span className="text-xs">🗑️</span>
                                  </button>
                                  <button className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                    <span className="text-xs">🔍</span>
                                  </button>
                                </div>
                                <div className="absolute bottom-1 left-1 right-1">
                                  <div className="text-xs text-white bg-black/50 rounded px-1 truncate">
                                    {image.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {formData.images.length < 6 && (
                              <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-600 rounded-lg sm:rounded-xl flex flex-col items-center justify-center p-4 sm:p-6 cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-200 group"
                              >
                                <span className="text-gray-400 group-hover:text-purple-400 mb-2 text-xl">📤</span>
                                <span className="text-sm text-gray-400 group-hover:text-purple-400 text-center">
                                  Agregar Imagen
                                </span>
                                <span className="text-xs text-gray-500 mt-1">Máx. 6 imágenes</span>
                              </div>
                            )}
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>

                        {/* Notas Internas */}
                        <Input
                          label="Notas Internas"
                          type="textarea"
                          rows={3}
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Notas adicionales, observaciones, instrucciones especiales..."
                          className="bg-gray-800/50 border-gray-600"
                        />
                      </div>

                      {/* Columna Derecha: Resumen Final */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 p-6">
                          <h4 className="text-lg font-semibold text-white mb-4">Resumen del Producto</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                              <span className="text-gray-400">SKU:</span>
                              <span className="text-white font-mono font-semibold">{formData.code || '---'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                              <span className="text-gray-400">Producto:</span>
                              <span className="text-white font-semibold text-right">{formData.name || '---'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                              <span className="text-gray-400">Categoría:</span>
                              <span className="text-blue-400">
                                {formData.category ? 
                                  categoryOptions.find(c => c.value === formData.category)?.label.split(' ').slice(1).join(' ') 
                                  : '---'
                                }
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                              <span className="text-gray-400">Stock Inicial:</span>
                              <span className="text-white font-semibold">{formData.currentStock}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                              <span className="text-gray-400">Precio Venta:</span>
                              <span className="text-emerald-400 font-semibold">MXN {formData.price || '0.00'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                              <span className="text-gray-400">Archivos:</span>
                              <span className="text-blue-400 font-semibold">{formData.files.length} adjuntos</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-gray-400">Margen:</span>
                              <span className="text-emerald-400 font-semibold">{calculateMargin().toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Estado del Sistema */}
                        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <div>
                              <div className="text-sm font-semibold text-white">Listo para guardar</div>
                              <div className="text-xs text-gray-400">Todos los campos requeridos están completos</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-8 border-t border-gray-700/30 bg-gray-800/20 space-y-3 sm:space-y-0">
          {saveSuccess ? (
            // Footer cuando el guardado fue exitoso
            <div className="w-full text-center">
              <Button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600"
              >
                Cerrar
              </Button>
            </div>
          ) : (
            // Footer normal durante el proceso
            <>
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={activeStep === 1 || isSubmitting}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border-gray-600 hover:border-gray-500 disabled:opacity-50"
              >
                Anterior
              </Button>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-gray-400 hover:text-white disabled:opacity-50"
                >
                  Cancelar
                </Button>

                {activeStep < steps.length ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid() || isSubmitting}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isSubmitting}
                    loading={isSubmitting}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(AddItemModal);