import React from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';

const ClientHeader = ({ client, onEdit, onDelete, canEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'suspended':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Building2" size={32} color="white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{client?.companyName}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client?.status)}`}>
                {client?.status === 'active' ? 'Activo' : 
                 client?.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="User" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{client?.contactPerson}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{client?.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{client?.email}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{client?.city}, {client?.state}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                <span className="text-foreground">Cliente desde: {formatDate(client?.createdAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Truck" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{client?.vehicleCount} vehículos</span>
              </div>
            </div>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              iconName="Edit"
              iconPosition="left"
            >
              Editar
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              iconName="Trash2"
              iconPosition="left"
            >
              Eliminar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientHeader;