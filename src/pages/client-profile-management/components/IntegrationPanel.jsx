import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';

const IntegrationPanel = ({ clientId, canEdit }) => {
  const [integrationStatus, setIntegrationStatus] = useState({
    contpaqi: {
      connected: true,
      accountNumber: "CLI-2024-0156",
      lastSync: "2024-10-15T14:30:00",
      syncStatus: "success",
      autoSync: true
    },
    mobile: {
      connected: true,
      lastAccess: "2024-10-15T09:15:00",
      deviceCount: 3,
      syncStatus: "success"
    },
    backup: {
      enabled: true,
      lastBackup: "2024-10-15T02:00:00",
      backupSize: "2.4 MB",
      status: "success"
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async (system) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIntegrationStatus(prev => ({
        ...prev,
        [system]: {
          ...prev?.[system],
          lastSync: new Date()?.toISOString(),
          syncStatus: "success"
        }
      }));
      setIsLoading(false);
    }, 2000);
  };

  const handleToggleAutoSync = (system) => {
    setIntegrationStatus(prev => ({
      ...prev,
      [system]: {
        ...prev?.[system],
        autoSync: !prev?.[system]?.autoSync
      }
    }));
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString)?.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Clock';
    }
  };

  return (
    <div className="space-y-6">
      {/* CONTPAQi Integration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Database" size={24} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">CONTPAQi Comercial</h3>
              <p className="text-sm text-muted-foreground">Sistema de facturación y contabilidad</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(integrationStatus?.contpaqi?.syncStatus)} 
              size={20} 
              className={getStatusColor(integrationStatus?.contpaqi?.syncStatus)} 
            />
            <span className={`text-sm font-medium ${getStatusColor(integrationStatus?.contpaqi?.syncStatus)}`}>
              {integrationStatus?.contpaqi?.connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Número de Cuenta</label>
              <div className="text-sm text-muted-foreground font-mono">
                {integrationStatus?.contpaqi?.accountNumber}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Última Sincronización</label>
              <div className="text-sm text-muted-foreground">
                {formatDateTime(integrationStatus?.contpaqi?.lastSync)}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Sincronización Automática</label>
              <button
                onClick={() => handleToggleAutoSync('contpaqi')}
                disabled={!canEdit}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 ${
                  integrationStatus?.contpaqi?.autoSync ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    integrationStatus?.contpaqi?.autoSync ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Estado de Sincronización</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Datos del cliente</span>
                  <Icon name="CheckCircle" size={16} className="text-success" />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Historial de servicios</span>
                  <Icon name="CheckCircle" size={16} className="text-success" />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Facturas pendientes</span>
                  <Icon name="CheckCircle" size={16} className="text-success" />
                </div>
              </div>
            </div>
            
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => handleSync('contpaqi')}
                loading={isLoading}
                iconName="RefreshCw"
                iconPosition="left"
                fullWidth
              >
                Sincronizar Ahora
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Mobile App Integration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="Smartphone" size={24} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Aplicación Móvil</h3>
              <p className="text-sm text-muted-foreground">Acceso desde dispositivos móviles</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(integrationStatus?.mobile?.syncStatus)} 
              size={20} 
              className={getStatusColor(integrationStatus?.mobile?.syncStatus)} 
            />
            <span className={`text-sm font-medium ${getStatusColor(integrationStatus?.mobile?.syncStatus)}`}>
              {integrationStatus?.mobile?.connected ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{integrationStatus?.mobile?.deviceCount}</div>
            <div className="text-sm text-muted-foreground">Dispositivos Conectados</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">Disponibilidad</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-foreground">Último Acceso</div>
            <div className="text-sm text-muted-foreground">
              {formatDateTime(integrationStatus?.mobile?.lastAccess)}
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-muted rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Funciones Disponibles</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-foreground">Consulta de información</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-foreground">Actualización de servicios</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-foreground">Captura de evidencias</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-foreground">Notificaciones push</span>
            </div>
          </div>
        </div>
      </div>
      {/* Backup and Security */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={24} color="black" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Respaldo y Seguridad</h3>
              <p className="text-sm text-muted-foreground">Protección de datos del cliente</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(integrationStatus?.backup?.status)} 
              size={20} 
              className={getStatusColor(integrationStatus?.backup?.status)} 
            />
            <span className={`text-sm font-medium ${getStatusColor(integrationStatus?.backup?.status)}`}>
              {integrationStatus?.backup?.enabled ? 'Habilitado' : 'Deshabilitado'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-foreground">Último Respaldo</label>
            <div className="text-sm text-muted-foreground">
              {formatDateTime(integrationStatus?.backup?.lastBackup)}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground">Tamaño del Respaldo</label>
            <div className="text-sm text-muted-foreground">
              {integrationStatus?.backup?.backupSize}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground">Frecuencia</label>
            <div className="text-sm text-muted-foreground">Diario - 02:00 AM</div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Datos Respaldados</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• Información del cliente</div>
              <div>• Historial de servicios</div>
              <div>• Documentos y contratos</div>
              <div>• Evidencias fotográficas</div>
            </div>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Medidas de Seguridad</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• Encriptación AES-256</div>
              <div>• Acceso basado en roles</div>
              <div>• Auditoría de cambios</div>
              <div>• Respaldo en la nube</div>
            </div>
          </div>
        </div>
      </div>
      {/* Integration Logs */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Registro de Actividad</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-3">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-foreground">Sincronización CONTPAQi completada</span>
            </div>
            <span className="text-sm text-muted-foreground">Hace 2 horas</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-3">
              <Icon name="Smartphone" size={16} className="text-primary" />
              <span className="text-sm text-foreground">Acceso desde aplicación móvil</span>
            </div>
            <span className="text-sm text-muted-foreground">Hace 5 horas</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm text-foreground">Respaldo automático realizado</span>
            </div>
            <span className="text-sm text-muted-foreground">Hace 12 horas</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Icon name="Edit" size={16} className="text-warning" />
              <span className="text-sm text-foreground">Información del cliente actualizada</span>
            </div>
            <span className="text-sm text-muted-foreground">Hace 1 día</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationPanel;