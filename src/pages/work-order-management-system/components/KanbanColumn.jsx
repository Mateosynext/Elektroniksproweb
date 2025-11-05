import React from 'react';
import Icon from '../../../components/appIcon';
import WorkOrderCard from './WorkOrderCard';

const KanbanColumn = ({ 
  title, 
  status, 
  workOrders, 
  onStatusChange, 
  onAssignTechnician, 
  onViewDetails, 
  userRole,
  onDrop,
  onDragOver 
}) => {
  const getColumnIcon = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'Clock';
      case 'En Progreso':
        return 'Wrench';
      case 'Completado':
        return 'CheckCircle';
      case 'Entregado':
        return 'Truck';
      default:
        return 'Circle';
    }
  };

  const getColumnColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'border-warning';
      case 'En Progreso':
        return 'border-primary';
      case 'Completado':
        return 'border-success';
      case 'Entregado':
        return 'border-muted';
      default:
        return 'border-border';
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    onDragOver && onDragOver(e, status);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    const workOrderId = e?.dataTransfer?.getData('text/plain');
    onDrop && onDrop(workOrderId, status);
  };

  return (
    <div 
      className={`flex-1 min-w-80 bg-background border-2 ${getColumnColor(status)} rounded-lg`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center">
              <Icon name={getColumnIcon(status)} size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {workOrders?.length} {workOrders?.length === 1 ? 'orden' : 'órdenes'}
              </p>
            </div>
          </div>
          
          {/* Column Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors duration-150">
              <Icon name="Filter" size={16} className="text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-accent rounded-lg transition-colors duration-150">
              <Icon name="MoreHorizontal" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
      {/* Column Content */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
        {workOrders?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name={getColumnIcon(status)} size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              No hay órdenes en {title?.toLowerCase()}
            </p>
          </div>
        ) : (
          workOrders?.map((workOrder) => (
            <div
              key={workOrder?.id}
              draggable
              onDragStart={(e) => {
                e?.dataTransfer?.setData('text/plain', workOrder?.id);
              }}
              className="cursor-move"
            >
              <WorkOrderCard
                workOrder={workOrder}
                onStatusChange={onStatusChange}
                onAssignTechnician={onAssignTechnician}
                onViewDetails={onViewDetails}
                userRole={userRole}
              />
            </div>
          ))
        )}
      </div>
      {/* Add New Button */}
      {status === 'Pendiente' && (
        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200">
            <Icon name="Plus" size={18} />
            <span className="font-medium">Nueva Orden</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;