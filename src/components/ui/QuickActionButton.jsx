import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../appIcon';
import Button from './Button';

const QuickActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getContextualActions = () => {
    const currentPath = location.pathname;
    
    const actionMap = {
      '/clients': [
        { label: 'Nuevo Cliente', icon: 'UserPlus', action: () => navigate('/clients/new') },
        { label: 'Importar Clientes', icon: 'Upload', action: () => console.log('Import clients') }
      ],
      '/work-orders': [
        { label: 'Nueva Orden', icon: 'Plus', action: () => navigate('/work-orders/new') },
        { label: 'Orden Rápida', icon: 'Zap', action: () => console.log('Quick order') }
      ],
      '/inventory': [
        { label: 'Agregar Producto', icon: 'Package', action: () => navigate('/inventory/new') },
        { label: 'Actualizar Stock', icon: 'RefreshCw', action: () => console.log('Update stock') }
      ],
      '/billing': [
        { label: 'Nueva Factura', icon: 'FileText', action: () => navigate('/billing/new') },
        { label: 'Cobro Rápido', icon: 'CreditCard', action: () => console.log('Quick payment') }
      ],
      '/financial': [
        { label: 'Generar Reporte', icon: 'BarChart3', action: () => console.log('Generate report') },
        { label: 'Exportar Datos', icon: 'Download', action: () => console.log('Export data') }
      ]
    };

    return actionMap[currentPath] || [
      { label: 'Acción Rápida', icon: 'Zap', action: () => console.log('Quick action') }
    ];
  };

  const actions = getContextualActions();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (actionFn) => {
    actionFn();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-300">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-2 animate-slide-down">
          <div className="py-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action.action)}
                className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-left text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
              >
                <Icon name={action.icon} size={18} />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Main Action Button */}
      <Button
        variant="default"
        size="lg"
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-elevation-2 transition-all duration-200 ${
          isOpen ? 'rotate-45' : 'hover:scale-105'
        }`}
        iconName={isOpen ? 'X' : 'Plus'}
        iconSize={24}
      >
        <span className="sr-only">
          {isOpen ? 'Cerrar menú de acciones' : 'Abrir menú de acciones rápidas'}
        </span>
      </Button>
      {/* Mobile Enhancement */}
      <div className="md:hidden absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse-subtle"></div>
    </div>
  );
};

export default QuickActionButton;