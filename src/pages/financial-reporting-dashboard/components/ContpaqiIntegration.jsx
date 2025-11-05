import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';

const ContpaqiIntegration = ({ syncStatus, lastSync, pendingTransactions }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    // Simulate sync process
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const handleExportData = () => {
    console.log('Exporting data to CONTPAQi...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'syncing':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'syncing':
        return 'RefreshCw';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'syncing':
        return 'Sincronizando';
      case 'error':
        return 'Error de Conexión';
      default:
        return 'Desconectado';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString)?.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Integración CONTPAQi
        </h3>
        <div className={`flex items-center space-x-2 ${getStatusColor(syncStatus)}`}>
          <Icon 
            name={getStatusIcon(syncStatus)} 
            size={20}
            className={syncStatus === 'syncing' ? 'animate-spin' : ''}
          />
          <span className="text-sm font-medium">
            {getStatusLabel(syncStatus)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Connection Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Database" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Base de Datos</p>
                <p className="text-xs text-muted-foreground">Empresa001_2024</p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              syncStatus === 'connected' ? 'bg-success animate-pulse-subtle' : 'bg-error'
            }`}></div>
          </div>

          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Última Sincronización</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(lastSync)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Transacciones Pendientes</p>
                <p className="text-xs text-muted-foreground">
                  {pendingTransactions} registros por sincronizar
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-warning">
              {pendingTransactions}
            </span>
          </div>
        </div>

        {/* Sync Actions */}
        <div className="space-y-4">
          <div className="p-4 bg-background rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Acciones de Sincronización
            </h4>
            <div className="space-y-3">
              <Button
                variant="default"
                fullWidth
                onClick={handleSync}
                loading={isLoading}
                iconName="RefreshCw"
                iconPosition="left"
                disabled={syncStatus === 'syncing'}
              >
                {isLoading ? 'Sincronizando...' : 'Sincronizar Ahora'}
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={handleExportData}
                iconName="Download"
                iconPosition="left"
              >
                Exportar a CONTPAQi
              </Button>

              <Button
                variant="ghost"
                fullWidth
                iconName="Settings"
                iconPosition="left"
              >
                Configurar Conexión
              </Button>
            </div>
          </div>

          <div className="p-4 bg-background rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Estado de Módulos
            </h4>
            <div className="space-y-2">
              {[
                { module: 'Facturación', status: 'active', icon: 'Receipt' },
                { module: 'Inventarios', status: 'active', icon: 'Package' },
                { module: 'Bancos', status: 'active', icon: 'CreditCard' },
                { module: 'Contabilidad', status: 'warning', icon: 'Calculator' }
              ]?.map((item) => (
                <div key={item?.module} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{item?.module}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    item?.status === 'active' ? 'bg-success' : 'bg-warning'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="border-t border-border pt-6">
        <h4 className="text-sm font-medium text-foreground mb-4">
          Actividad Reciente
        </h4>
        <div className="space-y-3">
          {[
            {
              id: 1,
              action: 'Factura #F-2024-1234 sincronizada',
              timestamp: '2024-10-15T18:30:00',
              status: 'success'
            },
            {
              id: 2,
              action: 'Actualización de inventario completada',
              timestamp: '2024-10-15T17:45:00',
              status: 'success'
            },
            {
              id: 3,
              action: 'Error en sincronización de póliza #P-456',
              timestamp: '2024-10-15T16:20:00',
              status: 'error'
            }
          ]?.map((activity) => (
            <div key={activity?.id} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
              <Icon 
                name={activity?.status === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                size={16} 
                className={activity?.status === 'success' ? 'text-success' : 'text-error'}
              />
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity?.action}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(activity?.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContpaqiIntegration;