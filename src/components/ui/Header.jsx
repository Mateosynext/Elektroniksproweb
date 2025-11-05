import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../appIcon';
import Button from './Button';

const Header = () => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const primaryNavItems = [
    { label: 'Panel de Control', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Gestión de Clientes', path: '/clients', icon: 'Users' },
    { label: 'Órdenes de Trabajo', path: '/work-orders', icon: 'ClipboardList' },
    { label: 'Inventario', path: '/inventory', icon: 'Package' },
    { label: 'Facturación', path: '/billing', icon: 'Receipt' }
  ];

  const secondaryNavItems = [
    { label: 'Reportes Financieros', path: '/financial', icon: 'BarChart3' },
    { label: 'Administración', path: '/admin', icon: 'Settings' },
    { label: 'Ayuda', path: '/help', icon: 'HelpCircle' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMoreMenuOpen(false);
  };

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const currentPath = location.pathname;

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Zap" size={24} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground leading-none">
              ElektronikPro
            </h1>
            <span className="text-xs text-muted-foreground font-mono">
              Truck Electronics
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-card ${
                currentPath === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={toggleMoreMenu}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-card hover:text-primary transition-all duration-200"
            >
              <Icon name="MoreHorizontal" size={18} />
              <span>Más</span>
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevation-2 animate-slide-down">
                <div className="py-2">
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center space-x-3 w-full px-4 py-2 text-sm font-medium text-left transition-colors duration-150 hover:bg-accent hover:text-accent-foreground ${
                        currentPath === item.path
                          ? 'bg-primary text-primary-foreground'
                          : 'text-popover-foreground'
                      }`}
                    >
                      <Icon name={item.icon} size={16} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMoreMenu}
            iconName="Menu"
            iconSize={20}
          >
            <span className="sr-only">Abrir menú</span>
          </Button>
        </div>

        {/* User Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 bg-card rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
            <span className="text-xs text-muted-foreground font-mono">
              CONTPAQi Conectado
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            iconName="Bell"
            iconSize={18}
          >
            <span className="sr-only">Notificaciones</span>
          </Button>

          <div className="flex items-center space-x-2 px-3 py-2 bg-card rounded-lg cursor-pointer hover:bg-accent transition-colors duration-200">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Admin</span>
              <span className="text-xs text-muted-foreground">Sistema</span>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {isMoreMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background z-200">
          <nav className="p-6 space-y-2">
            {[...primaryNavItems, ...secondaryNavItems].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                  currentPath === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-card hover:text-primary'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;