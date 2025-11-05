import React, { useState, useEffect } from 'react';
import Icon from '../../../components/appIcon';

const SystemStatus = () => {
  const [systemHealth, setSystemHealth] = useState({
    database: 'connected',
    contpaqi: 'connected',
    api: 'connected',
    backup: 'synced'
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate system health check
    const checkSystemHealth = () => {
      // Mock system status - in real app this would be API calls
      const statuses = ['connected', 'warning', 'error'];
      const randomStatus = () => statuses?.[Math.floor(Math.random() * statuses?.length)];
      
      // Most of the time systems should be healthy
      setSystemHealth({
        database: Math.random() > 0.1 ? 'connected' : randomStatus(),
        contpaqi: Math.random() > 0.15 ? 'connected' : randomStatus(),
        api: Math.random() > 0.05 ? 'connected' : randomStatus(),
        backup: Math.random() > 0.2 ? 'synced' : 'warning'
      });
      
      setLastUpdate(new Date());
    };

    // Initial check
    checkSystemHealth();

    // Check every 30 seconds
    const interval = setInterval(checkSystemHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': case'synced':
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
      case 'connected': case'synced':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusText = (service, status) => {
    const statusMap = {
      database: {
        connected: 'Base de Datos Conectada',
        warning: 'Base de Datos Lenta',
        error: 'Base de Datos Desconectada'
      },
      contpaqi: {
        connected: 'CONTPAQi Sincronizado',
        warning: 'CONTPAQi Parcial',
        error: 'CONTPAQi Desconectado'
      },
      api: {
        connected: 'API Operativa',
        warning: 'API Limitada',
        error: 'API Inaccesible'
      },
      backup: {
        synced: 'Respaldo Actualizado',
        warning: 'Respaldo Pendiente',
        error: 'Respaldo Fallido'
      }
    };

    return statusMap?.[service]?.[status] || 'Estado Desconocido';
  };

  const overallHealth = Object.values(systemHealth)?.every(status => 
    status === 'connected' || status === 'synced' ) ?'healthy' : Object.values(systemHealth)?.some(status => status === 'error') ? 'critical' : 'warning';

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">Estado del Sistema</h3>
        <div className={`flex items-center space-x-2 ${
          overallHealth === 'healthy' ? 'text-success' : 
          overallHealth === 'critical' ? 'text-error' : 'text-warning'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            overallHealth === 'healthy' ? 'bg-success' : 
            overallHealth === 'critical' ? 'bg-error' : 'bg-warning'
          } animate-pulse-subtle`}></div>
          <span className="text-xs font-mono">
            {overallHealth === 'healthy' ? 'Operativo' : 
             overallHealth === 'critical' ? 'Crítico' : 'Advertencia'}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {Object.entries(systemHealth)?.map(([service, status]) => (
          <div key={service} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(status)} 
                size={16} 
                className={getStatusColor(status)} 
              />
              <span className="text-xs text-card-foreground">
                {getStatusText(service, status)}
              </span>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              status === 'connected' || status === 'synced' ? 'bg-success' :
              status === 'warning' ? 'bg-warning' : 'bg-error'
            }`}></div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Última verificación:</span>
          <span className="font-mono">
            {lastUpdate?.toLocaleTimeString('es-MX', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;