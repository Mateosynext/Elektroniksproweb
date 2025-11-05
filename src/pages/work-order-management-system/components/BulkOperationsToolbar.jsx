import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkOperationsToolbar = ({ 
  selectedOrders, 
  onClearSelection, 
  onBulkStatusUpdate, 
  onBulkTechnicianAssign, 
  onBulkPriorityUpdate,
  onBulkExport 
}) => {
  const [bulkAction, setBulkAction] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const technicianOptions = [
    { value: '', label: 'Seleccionar técnico' },
    { value: 'flaco-mendoza', label: 'Flaco Mendoza' },
    { value: 'borrego-mendoza', label: 'Borrego Mendoza' },
    { value: 'carlos-rodriguez', label: 'Carlos Rodríguez' },
    { value: 'miguel-santos', label: 'Miguel Santos' }
  ];

  const statusOptions = [
    { value: '', label: 'Seleccionar estado' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'En Progreso', label: 'En Progreso' },
    { value: 'Completado', label: 'Completado' },
    { value: 'Entregado', label: 'Entregado' }
  ];

  const priorityOptions = [
    { value: '', label: 'Seleccionar prioridad' },
    { value: 'Alta', label: 'Alta' },
    { value: 'Media', label: 'Media' },
    { value: 'Baja', label: 'Baja' }
  ];

  const actionOptions = [
    { value: '', label: 'Seleccionar acción' },
    { value: 'assign-technician', label: 'Asignar Técnico' },
    { value: 'update-status', label: 'Cambiar Estado' },
    { value: 'update-priority', label: 'Cambiar Prioridad' },
    { value: 'export', label: 'Exportar Seleccionadas' }
  ];

  const handleExecuteAction = () => {
    switch (bulkAction) {
      case 'assign-technician':
        if (selectedTechnician) {
          onBulkTechnicianAssign(selectedOrders, selectedTechnician);
          setSelectedTechnician('');
        }
        break;
      case 'update-status':
        if (selectedStatus) {
          onBulkStatusUpdate(selectedOrders, selectedStatus);
          setSelectedStatus('');
        }
        break;
      case 'update-priority':
        if (selectedPriority) {
          onBulkPriorityUpdate(selectedOrders, selectedPriority);
          setSelectedPriority('');
        }
        break;
      case 'export':
        onBulkExport(selectedOrders);
        break;
      default:
        break;
    }
    setBulkAction('');
  };

  const canExecute = () => {
    switch (bulkAction) {
      case 'assign-technician':
        return selectedTechnician !== '';
      case 'update-status':
        return selectedStatus !== '';
      case 'update-priority':
        return selectedPriority !== '';
      case 'export':
        return true;
      default:
        return false;
    }
  };

  if (selectedOrders?.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-200 bg-card border border-border rounded-lg shadow-elevation-2 p-4 min-w-96 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="CheckSquare" size={18} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">
              {selectedOrders?.length} {selectedOrders?.length === 1 ? 'orden seleccionada' : 'órdenes seleccionadas'}
            </h3>
            <p className="text-xs text-muted-foreground">
              Operaciones en lote disponibles
            </p>
          </div>
        </div>
        
        <button
          onClick={onClearSelection}
          className="p-2 hover:bg-accent rounded-lg transition-colors duration-150"
          title="Limpiar selección"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Action Selection */}
        <div className="lg:col-span-1">
          <Select
            options={actionOptions}
            value={bulkAction}
            onChange={setBulkAction}
            placeholder="Seleccionar acción"
          />
        </div>

        {/* Dynamic Action Parameters */}
        <div className="lg:col-span-1">
          {bulkAction === 'assign-technician' && (
            <Select
              options={technicianOptions}
              value={selectedTechnician}
              onChange={setSelectedTechnician}
              placeholder="Seleccionar técnico"
            />
          )}
          
          {bulkAction === 'update-status' && (
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Seleccionar estado"
            />
          )}
          
          {bulkAction === 'update-priority' && (
            <Select
              options={priorityOptions}
              value={selectedPriority}
              onChange={setSelectedPriority}
              placeholder="Seleccionar prioridad"
            />
          )}
          
          {bulkAction === 'export' && (
            <div className="flex items-center justify-center h-10 text-sm text-muted-foreground">
              Exportar órdenes seleccionadas
            </div>
          )}
        </div>

        {/* Execute Button */}
        <div className="lg:col-span-1">
          <Button
            variant="default"
            onClick={handleExecuteAction}
            disabled={!canExecute()}
            fullWidth
            iconName="Play"
          >
            Ejecutar
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkStatusUpdate(selectedOrders, 'En Progreso')}
            iconName="Play"
          >
            Iniciar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkStatusUpdate(selectedOrders, 'Completado')}
            iconName="CheckCircle"
          >
            Completar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkExport(selectedOrders)}
            iconName="Download"
          >
            Exportar
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Máximo 200 órdenes por operación
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsToolbar;