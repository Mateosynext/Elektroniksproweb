import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange, onSavePreset, savedPresets }) => {
  const [presetName, setPresetName] = useState('');

  const clientOptions = [
    { value: '', label: 'Todos los clientes' },
    { value: 'transportes-mendoza', label: 'Transportes Mendoza SA' },
    { value: 'logistica-norte', label: 'Logística Norte SRL' },
    { value: 'fletes-express', label: 'Fletes Express SA' },
    { value: 'carga-pesada', label: 'Carga Pesada Ltda' }
  ];

  const technicianOptions = [
    { value: '', label: 'Todos los técnicos' },
    { value: 'flaco-mendoza', label: 'Flaco Mendoza' },
    { value: 'borrego-mendoza', label: 'Borrego Mendoza' },
    { value: 'carlos-rodriguez', label: 'Carlos Rodríguez' },
    { value: 'miguel-santos', label: 'Miguel Santos' }
  ];

  const priorityOptions = [
    { value: '', label: 'Todas las prioridades' },
    { value: 'Alta', label: 'Alta' },
    { value: 'Media', label: 'Media' },
    { value: 'Baja', label: 'Baja' }
  ];

  const vehicleTypeOptions = [
    { value: '', label: 'Todos los vehículos' },
    { value: 'Tractocamión', label: 'Tractocamión' },
    { value: 'Camión', label: 'Camión' },
    { value: 'Remolque', label: 'Remolque' },
    { value: 'Semirremolque', label: 'Semirremolque' }
  ];

  const statusOptions = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'En Progreso', label: 'En Progreso' },
    { value: 'Completado', label: 'Completado' },
    { value: 'Entregado', label: 'Entregado' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleStatusChange = (status, checked) => {
    const newStatuses = checked
      ? [...filters?.statuses, status]
      : filters?.statuses?.filter(s => s !== status);
    
    handleFilterChange('statuses', newStatuses);
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      client: '',
      technician: '',
      priority: '',
      vehicleType: '',
      dateFrom: '',
      dateTo: '',
      statuses: ['Pendiente', 'En Progreso', 'Completado', 'Entregado'],
      showOverdue: false,
      showUnassigned: false
    });
  };

  const handleSavePreset = () => {
    if (presetName?.trim()) {
      onSavePreset(presetName?.trim(), filters);
      setPresetName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 lg:relative lg:inset-auto">
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
        onClick={onClose}
      ></div>
      {/* Sidebar Content */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border lg:relative lg:w-full lg:border-l-0 lg:border border-border lg:rounded-lg overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-primary" />
            <h3 className="font-semibold text-card-foreground">Filtros</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors duration-150 lg:hidden"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <Input
              label="Buscar"
              type="search"
              placeholder="ID, cliente, VIN..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
            />
          </div>

          {/* Client Filter */}
          <div>
            <Select
              label="Cliente"
              options={clientOptions}
              value={filters?.client}
              onChange={(value) => handleFilterChange('client', value)}
            />
          </div>

          {/* Technician Filter */}
          <div>
            <Select
              label="Técnico Asignado"
              options={technicianOptions}
              value={filters?.technician}
              onChange={(value) => handleFilterChange('technician', value)}
            />
          </div>

          {/* Priority Filter */}
          <div>
            <Select
              label="Prioridad"
              options={priorityOptions}
              value={filters?.priority}
              onChange={(value) => handleFilterChange('priority', value)}
            />
          </div>

          {/* Vehicle Type Filter */}
          <div>
            <Select
              label="Tipo de Vehículo"
              options={vehicleTypeOptions}
              value={filters?.vehicleType}
              onChange={(value) => handleFilterChange('vehicleType', value)}
            />
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <h4 className="font-medium text-card-foreground text-sm">Rango de Fechas</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Desde"
                type="date"
                value={filters?.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              />
              <Input
                label="Hasta"
                type="date"
                value={filters?.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
              />
            </div>
          </div>

          {/* Status Checkboxes */}
          <div>
            <h4 className="font-medium text-card-foreground text-sm mb-3">Estados</h4>
            <div className="space-y-2">
              {statusOptions?.map((status) => (
                <Checkbox
                  key={status?.value}
                  label={status?.label}
                  checked={filters?.statuses?.includes(status?.value)}
                  onChange={(e) => handleStatusChange(status?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="space-y-2">
            <Checkbox
              label="Solo órdenes vencidas"
              checked={filters?.showOverdue}
              onChange={(e) => handleFilterChange('showOverdue', e?.target?.checked)}
            />
            <Checkbox
              label="Solo órdenes sin asignar"
              checked={filters?.showUnassigned}
              onChange={(e) => handleFilterChange('showUnassigned', e?.target?.checked)}
            />
          </div>

          {/* Saved Presets */}
          {savedPresets?.length > 0 && (
            <div>
              <h4 className="font-medium text-card-foreground text-sm mb-3">Vistas Guardadas</h4>
              <div className="space-y-2">
                {savedPresets?.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => onFiltersChange(preset?.filters)}
                    className="w-full text-left p-2 rounded-lg hover:bg-accent transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-card-foreground">
                        {preset?.name}
                      </span>
                      <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save Preset */}
          <div className="space-y-3">
            <h4 className="font-medium text-card-foreground text-sm">Guardar Vista</h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Nombre de la vista"
                value={presetName}
                onChange={(e) => setPresetName(e?.target?.value)}
              />
              <Button
                variant="outline"
                onClick={handleSavePreset}
                disabled={!presetName?.trim()}
                iconName="Save"
              >
                Guardar
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              fullWidth
              iconName="RotateCcw"
            >
              Limpiar
            </Button>
            <Button
              variant="default"
              onClick={onClose}
              fullWidth
              iconName="Check"
            >
              Aplicar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;