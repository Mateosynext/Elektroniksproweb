import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';

const QuickActionSidebar = ({ client, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      id: 'schedule-service',
      label: 'Programar Servicio',
      icon: 'Calendar',
      color: 'bg-primary',
      description: 'Crear nueva orden de trabajo',
      shortcut: 'Ctrl+N'
    },
    {
      id: 'generate-invoice',
      label: 'Generar Factura',
      icon: 'Receipt',
      color: 'bg-secondary',
      description: 'Crear factura para servicios',
      shortcut: 'Ctrl+I'
    },
    {
      id: 'send-communication',
      label: 'Enviar Comunicación',
      icon: 'Mail',
      color: 'bg-accent',
      description: 'Enviar email o mensaje',
      shortcut: 'Ctrl+M'
    },
    {
      id: 'export-records',
      label: 'Exportar Registros',
      icon: 'Download',
      color: 'bg-muted',
      description: 'Descargar datos del cliente',
      shortcut: 'Ctrl+E'
    },
    {
      id: 'add-vehicle',
      label: 'Agregar Vehículo',
      icon: 'Truck',
      color: 'bg-success',
      description: 'Registrar nuevo vehículo',
      shortcut: 'Ctrl+V'
    },
    {
      id: 'view-analytics',
      label: 'Ver Analíticas',
      icon: 'BarChart3',
      color: 'bg-warning',
      description: 'Estadísticas del cliente',
      shortcut: 'Ctrl+A'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Servicio completado',
      description: 'WO-2024-001234 - Reparación LED',
      timestamp: '2024-10-12T14:30:00',
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 2,
      action: 'Factura generada',
      description: 'FAC-2024-0892 - $4,980.00 MXN',
      timestamp: '2024-10-12T15:45:00',
      icon: 'Receipt',
      color: 'text-primary'
    },
    {
      id: 3,
      action: 'Comunicación enviada',
      description: 'Email de confirmación de servicio',
      timestamp: '2024-10-10T09:15:00',
      icon: 'Mail',
      color: 'text-secondary'
    }
  ];

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId, client);
    }
    
    // Simulate action execution
    switch (actionId) {
      case 'schedule-service': console.log('Programando servicio para:', client?.companyName);
        break;
      case 'generate-invoice': console.log('Generando factura para:', client?.companyName);
        break;
      case 'send-communication': console.log('Enviando comunicación a:', client?.email);
        break;
      case 'export-records':
        console.log('Exportando registros de:', client?.companyName);
        break;
      case 'add-vehicle': console.log('Agregando vehículo para:', client?.companyName);
        break;
      case 'view-analytics': console.log('Viendo analíticas de:', client?.companyName);
        break;
      default:
        console.log('Acción no reconocida:', actionId);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  return (
    <div className={`fixed right-0 top-16 bottom-0 bg-card border-l border-border transition-all duration-300 z-200 ${
      isExpanded ? 'w-80' : 'w-16'
    }`}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronRight" : "ChevronLeft"}
          className="w-full"
        />
      </div>
      {/* Quick Actions */}
      <div className="p-4">
        <div className={`${isExpanded ? 'block' : 'hidden'} mb-4`}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Acciones Rápidas</h3>
        </div>
        
        <div className="space-y-2">
          {quickActions?.map((action) => (
            <div key={action?.id} className="relative group">
              <Button
                variant="ghost"
                onClick={() => handleAction(action?.id)}
                className={`w-full ${isExpanded ? 'justify-start' : 'justify-center'} p-3 h-auto`}
              >
                <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center ${isExpanded ? 'mr-3' : ''}`}>
                  <Icon name={action?.icon} size={20} color="white" />
                </div>
                
                {isExpanded && (
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-foreground">{action?.label}</div>
                    <div className="text-xs text-muted-foreground">{action?.description}</div>
                  </div>
                )}
              </Button>
              
              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-elevation-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-300">
                  <div className="font-medium">{action?.label}</div>
                  <div className="text-xs text-muted-foreground">{action?.shortcut}</div>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-popover rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activities */}
      {isExpanded && (
        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Actividad Reciente</h3>
          
          <div className="space-y-3">
            {recentActivities?.map((activity) => (
              <div key={activity?.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name={activity?.icon} size={14} className={activity?.color} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{activity?.action}</div>
                  <div className="text-xs text-muted-foreground truncate">{activity?.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity?.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            iconName="History"
            iconPosition="left"
          >
            Ver Todo el Historial
          </Button>
        </div>
      )}
      {/* Client Summary */}
      {isExpanded && (
        <div className="p-4 border-t border-border mt-auto">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-sm font-medium text-foreground mb-2">Resumen del Cliente</div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Servicios Totales:</span>
                <span className="text-foreground font-medium">24</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Total:</span>
                <span className="text-foreground font-medium">$89,450.00</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Último Servicio:</span>
                <span className="text-foreground font-medium">12/10/2024</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className="text-success font-medium">Activo</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Keyboard Shortcuts Info */}
      {isExpanded && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-2">Atajos de Teclado:</div>
            <div className="space-y-1">
              <div>Ctrl+S - Guardar cambios</div>
              <div>Ctrl+N - Nueva orden</div>
              <div>Ctrl+E - Exportar datos</div>
              <div>Esc - Cerrar formularios</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionSidebar;