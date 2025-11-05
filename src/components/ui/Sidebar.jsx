import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../appIcon';

const Sidebar = ({ isCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const navigationItems = [
    {
      label: 'Panel de Control',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      roles: ['admin', 'director', 'technician'],
      statusIndicator: false
    },
    {
      label: 'Gestión de Clientes',
      path: '/clients',
      icon: 'Users',
      roles: ['admin', 'director', 'technician'],
      statusIndicator: false
    },
    {
      label: 'Órdenes de Trabajo',
      path: '/work-orders',
      icon: 'ClipboardList',
      roles: ['admin', 'director', 'technician'],
      statusIndicator: true
    },
    {
      label: 'Inventario',
      path: '/inventory',
      icon: 'Package',
      roles: ['admin', 'director', 'technician'],
      statusIndicator: true
    },
    {
      label: 'Facturación',
      path: '/billing',
      icon: 'Receipt',
      roles: ['admin', 'director'],
      statusIndicator: true
    },
    {
      label: 'Reportes Financieros',
      path: '/financial',
      icon: 'BarChart3',
      roles: ['admin', 'director'],
      statusIndicator: true
    },
    {
      label: 'Administración',
      path: '/admin',
      icon: 'Settings',
      roles: ['admin'],
      statusIndicator: false
    }
  ];

  const handleNavigation = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  const userRole = 'admin'; // This would come from context/props in real implementation
  const systemStatus = {
    contpaqi: 'connected',
    inventory: 'synced',
    workOrders: 'active'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': case 'synced': case 'active':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <aside className={`fixed left-0 top-16 bottom-0 z-100 bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-60'
    }`}>
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`relative flex items-center w-full px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                activeItem === item.path
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Icon 
                  name={item.icon} 
                  size={20} 
                  className={`flex-shrink-0 ${
                    activeItem === item.path ? 'text-primary-foreground' : ''
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </div>

              {/* Status Indicator */}
              {item.statusIndicator && !isCollapsed && (
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  getStatusColor(systemStatus.contpaqi)
                } animate-pulse-subtle`}></div>
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-elevation-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-300">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover rotate-45"></div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* System Status Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Estado del Sistema
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-card-foreground">CONTPAQi</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.contpaqi)}`}></div>
                    <span className="text-xs text-muted-foreground font-mono">Conectado</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-card-foreground">Inventario</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.inventory)}`}></div>
                    <span className="text-xs text-muted-foreground font-mono">Sincronizado</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-card-foreground">Órdenes</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.workOrders)}`}></div>
                    <span className="text-xs text-muted-foreground font-mono">Activo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={20} color="white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-card-foreground truncate">
                  Administrador
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Sistema ElektronikPro
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;