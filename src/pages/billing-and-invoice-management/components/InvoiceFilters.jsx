import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvoiceFilters = ({ onFiltersChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    paymentStatus: '',
    clientSegment: '',
    amountRange: { min: '', max: '' },
    invoiceNumber: '',
    clientName: ''
  });

  const paymentStatusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'Pagada', label: 'Pagada' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Vencida', label: 'Vencida' },
    { value: 'Parcial', label: 'Pago Parcial' }
  ];

  const clientSegmentOptions = [
    { value: '', label: 'Todos los clientes' },
    { value: 'premium', label: 'Clientes Premium' },
    { value: 'regular', label: 'Clientes Regulares' },
    { value: 'new', label: 'Clientes Nuevos' },
    { value: 'corporate', label: 'Corporativos' }
  ];

  const savedFilters = [
    { name: 'Facturas Vencidas', icon: 'AlertCircle', color: 'text-error' },
    { name: 'Este Mes', icon: 'Calendar', color: 'text-primary' },
    { name: 'Montos Altos', icon: 'TrendingUp', color: 'text-success' },
    { name: 'Clientes Premium', icon: 'Star', color: 'text-warning' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const newDateRange = { ...filters?.dateRange, [type]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmountRangeChange = (type, value) => {
    const newAmountRange = { ...filters?.amountRange, [type]: value };
    const newFilters = { ...filters, amountRange: newAmountRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      dateRange: { start: '', end: '' },
      paymentStatus: '',
      clientSegment: '',
      amountRange: { min: '', max: '' },
      invoiceNumber: '',
      clientName: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const applyQuickFilter = (filterName) => {
    let quickFilters = { ...filters };
    
    switch (filterName) {
      case 'Facturas Vencidas':
        quickFilters.paymentStatus = 'Vencida';
        break;
      case 'Este Mes':
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        quickFilters.dateRange = {
          start: firstDay?.toISOString()?.split('T')?.[0],
          end: lastDay?.toISOString()?.split('T')?.[0]
        };
        break;
      case 'Montos Altos':
        quickFilters.amountRange = { min: '50000', max: '' };
        break;
      case 'Clientes Premium':
        quickFilters.clientSegment = 'premium';
        break;
      default:
        break;
    }
    
    setFilters(quickFilters);
    onFiltersChange(quickFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.dateRange?.start || filters?.dateRange?.end) count++;
    if (filters?.paymentStatus) count++;
    if (filters?.clientSegment) count++;
    if (filters?.amountRange?.min || filters?.amountRange?.max) count++;
    if (filters?.invoiceNumber) count++;
    if (filters?.clientName) count++;
    return count;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
          {getActiveFilterCount() > 0 && (
            <div className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={clearAllFilters}
            disabled={getActiveFilterCount() === 0}
          >
            Limpiar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Contraer' : 'Expandir'}
          </Button>
        </div>
      </div>
      {/* Quick Filters */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {savedFilters?.map((filter, index) => (
            <button
              key={index}
              onClick={() => applyQuickFilter(filter?.name)}
              className="flex items-center space-x-2 px-3 py-2 bg-muted hover:bg-accent rounded-lg text-sm font-medium transition-colors"
            >
              <Icon name={filter?.icon} size={16} className={filter?.color} />
              <span className="text-foreground">{filter?.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Basic Filters */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Buscar por No. Factura"
            type="text"
            placeholder="FAC-2024-001"
            value={filters?.invoiceNumber}
            onChange={(e) => handleFilterChange('invoiceNumber', e?.target?.value)}
          />
          
          <Input
            label="Buscar por Cliente"
            type="text"
            placeholder="Nombre del cliente"
            value={filters?.clientName}
            onChange={(e) => handleFilterChange('clientName', e?.target?.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Estado de Pago"
            options={paymentStatusOptions}
            value={filters?.paymentStatus}
            onChange={(value) => handleFilterChange('paymentStatus', value)}
          />
          
          <Select
            label="Segmento de Cliente"
            options={clientSegmentOptions}
            value={filters?.clientSegment}
            onChange={(value) => handleFilterChange('clientSegment', value)}
          />
        </div>
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-4 border-t border-border space-y-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Filtros Avanzados</h4>
          
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Rango de Fechas
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha Inicio"
                type="date"
                value={filters?.dateRange?.start}
                onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
              />
              <Input
                label="Fecha Fin"
                type="date"
                value={filters?.dateRange?.end}
                onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
              />
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Rango de Montos (MXN)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Monto Mínimo"
                type="number"
                placeholder="0.00"
                value={filters?.amountRange?.min}
                onChange={(e) => handleAmountRangeChange('min', e?.target?.value)}
              />
              <Input
                label="Monto Máximo"
                type="number"
                placeholder="999999.99"
                value={filters?.amountRange?.max}
                onChange={(e) => handleAmountRangeChange('max', e?.target?.value)}
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {getActiveFilterCount() > 0 
                ? `${getActiveFilterCount()} filtro(s) activo(s)`
                : 'Sin filtros aplicados'
              }
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Save"
                onClick={() => console.log('Save filter configuration')}
              >
                Guardar Filtros
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Search"
                onClick={() => console.log('Apply filters')}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;