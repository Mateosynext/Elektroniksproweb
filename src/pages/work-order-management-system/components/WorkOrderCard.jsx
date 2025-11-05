import React from 'react';
import Icon from '../../../components/appIcon';
import Image from '../../../components/appImage';

const WorkOrderCard = ({ workOrder, onStatusChange, onAssignTechnician, onViewDetails, userRole }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta':
        return 'bg-error text-error-foreground';
      case 'Media':
        return 'bg-warning text-warning-foreground';
      case 'Baja':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-warning text-warning-foreground';
      case 'En Progreso':
        return 'bg-primary text-primary-foreground';
      case 'Completado':
        return 'bg-success text-success-foreground';
      case 'Entregado':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200 cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Wrench" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm">
              #{workOrder?.id}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {workOrder?.clientName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(workOrder?.priority)}`}>
            {workOrder?.priority}
          </span>
          <button
            onClick={(e) => {
              e?.stopPropagation();
              onViewDetails(workOrder);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-accent rounded"
          >
            <Icon name="MoreVertical" size={16} />
          </button>
        </div>
      </div>
      {/* Vehicle Info */}
      <div className="mb-3 p-2 bg-muted rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          <Icon name="Truck" size={14} className="text-muted-foreground" />
          <span className="text-sm font-medium text-card-foreground">
            {workOrder?.vehicleType} {workOrder?.vehicleYear}
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          VIN: {workOrder?.vin}
        </p>
      </div>
      {/* Problem Description */}
      <div className="mb-3">
        <p className="text-sm text-card-foreground line-clamp-2">
          {workOrder?.problemDescription}
        </p>
      </div>
      {/* Technician Assignment */}
      <div className="flex items-center space-x-2 mb-3">
        {workOrder?.assignedTechnician ? (
          <>
            <Image
              src={workOrder?.assignedTechnician?.avatar}
              alt={workOrder?.assignedTechnician?.avatarAlt}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-card-foreground">
              {workOrder?.assignedTechnician?.name}
            </span>
          </>
        ) : (
          <button
            onClick={(e) => {
              e?.stopPropagation();
              onAssignTechnician(workOrder);
            }}
            className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            <Icon name="UserPlus" size={16} />
            <span>Asignar Técnico</span>
          </button>
        )}
      </div>
      {/* Dates and Status */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Creado:</span>
          <span className="text-card-foreground font-mono">
            {formatDate(workOrder?.createdDate)}
          </span>
        </div>
        {workOrder?.estimatedCompletion && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Est. Completado:</span>
            <span className="text-card-foreground font-mono">
              {formatDate(workOrder?.estimatedCompletion)}
            </span>
          </div>
        )}
      </div>
      {/* Cost Information (Directors only) */}
      {userRole === 'director' && (
        <div className="mb-3 p-2 bg-secondary rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-foreground">Costo Estimado:</span>
            <span className="font-semibold text-secondary-foreground">
              {formatCurrency(workOrder?.estimatedCost)}
            </span>
          </div>
        </div>
      )}
      {/* Status and Actions */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workOrder?.status)}`}>
          {workOrder?.status}
        </span>
        
        <div className="flex items-center space-x-1">
          {workOrder?.hasPhotos && (
            <div className="w-2 h-2 bg-primary rounded-full" title="Tiene fotos"></div>
          )}
          {workOrder?.hasNotes && (
            <div className="w-2 h-2 bg-accent rounded-full" title="Tiene notas"></div>
          )}
          {workOrder?.partsOrdered && (
            <div className="w-2 h-2 bg-success rounded-full" title="Partes ordenadas"></div>
          )}
        </div>
      </div>
      {/* Progress Bar */}
      {workOrder?.progress > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progreso</span>
            <span className="text-card-foreground font-medium">{workOrder?.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${workOrder?.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrderCard;