import React from 'react';
import Icon from '../../../components/appIcon';

const QuickStatsBar = ({ stats, userRole }) => {
  const statItems = [
    {
      key: 'pending',
      label: 'Pendientes',
      value: stats?.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      key: 'inProgress',
      label: 'En Progreso',
      value: stats?.inProgress,
      icon: 'Wrench',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      key: 'completed',
      label: 'Completadas',
      value: stats?.completed,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      key: 'delivered',
      label: 'Entregadas',
      value: stats?.delivered,
      icon: 'Truck',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10'
    }
  ];

  const additionalStats = [
    {
      key: 'overdue',
      label: 'Vencidas',
      value: stats?.overdue,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      roles: ['admin', 'director']
    },
    {
      key: 'unassigned',
      label: 'Sin Asignar',
      value: stats?.unassigned,
      icon: 'UserX',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      roles: ['admin', 'director']
    },
    {
      key: 'avgCompletionTime',
      label: 'Tiempo Promedio',
      value: `${stats?.avgCompletionTime}h`,
      icon: 'Timer',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      roles: ['director']
    }
  ];

  const visibleAdditionalStats = additionalStats?.filter(stat => 
    !stat?.roles || stat?.roles?.includes(userRole)
  );

  const allStats = [...statItems, ...visibleAdditionalStats];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-foreground">Resumen de Órdenes</h3>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="RefreshCw" size={14} />
          <span>Actualizado hace 2 min</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {allStats?.map((stat) => (
          <div
            key={stat?.key}
            className={`${stat?.bgColor} rounded-lg p-4 transition-all duration-200 hover:scale-105 cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={stat?.icon} size={18} className={stat?.color} />
              </div>
              {stat?.key === 'overdue' && stat?.value > 0 && (
                <div className="w-2 h-2 bg-error rounded-full animate-pulse-subtle"></div>
              )}
            </div>
            
            <div>
              <p className="text-2xl font-bold text-card-foreground mb-1">
                {stat?.value}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {stat?.label}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Progress Indicators */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Completion Rate */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Tasa de Completado</span>
              <span className="font-medium text-card-foreground">
                {Math.round((stats?.completed / (stats?.completed + stats?.inProgress + stats?.pending)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round((stats?.completed / (stats?.completed + stats?.inProgress + stats?.pending)) * 100)}%`
                }}
              ></div>
            </div>
          </div>

          {/* Workload Distribution */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Distribución de Carga</span>
              <span className="font-medium text-card-foreground">
                {stats?.inProgress + stats?.pending} activas
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(((stats?.inProgress + stats?.pending) / 50) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsBar;