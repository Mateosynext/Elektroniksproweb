import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../appIcon';
import { AlignVerticalJustifyCenterIcon, JapaneseYenIcon, JoystickIcon, Navigation2 } from 'lucide-react';
import { easeCubicInOut } from 'd3';
import { yearsToMonths } from 'date-fns';
import { AxiosHeaders } from 'axios';

const Breadcrumbs = ({ items = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  // Default breadcrumb structure based on current path
  const getDefaultBreadcrumbs = () => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    const breadcrumbMap = {
      '': { label: 'Panel de Control', icon: 'LayoutDashboard' },
      'dashboard': { label: 'Panel de Control', icon: 'LayoutDashboard' },
      'financial': { label: 'Reportes Financieros', icon: 'BarChart3' },
      'clients': { label: 'Gestión de Clientes', icon: 'Users' },
      'client-profiles': { label: 'Gestión de Clientes', icon: 'Users' },
      'work-orders': { label: 'Órdenes de Trabajo', icon: 'ClipboardList' },
      'orders': { label: 'Órdenes de Trabajo', icon: 'ClipboardList' },
      'inventory': { label: 'Inventario', icon: 'Package' },
      'stock': { label: 'Inventario', icon: 'Package' },
      'billing': { label: 'Facturación', icon: 'Receipt' },
      'invoices': { label: 'Facturación', icon: 'Receipt' },
      'admin': { label: 'Administración', icon: 'Settings' }
    };

    const breadcrumbs = [
      { label: 'Inicio', path: '/dashboard', icon: 'Home' }
    ];

    if (pathSegments.length > 0) {
      const segment = pathSegments[0];
      const breadcrumbInfo = breadcrumbMap[segment];
      
      if (breadcrumbInfo) {
        breadcrumbs.push({
          label: breadcrumbInfo.label,
          path: currentPath,
          icon: breadcrumbInfo.icon,
          current: true
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : getDefaultBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground mx-2" 
              />
            )}
            
            <div className="flex items-center space-x-2">
              {item.icon && (
                <Icon 
                  name={item.icon} 
                  size={16} 
                  className={item.current ? 'text-primary' : 'text-muted-foreground'} 
                />
              )}
              
              {item.current ? (
                <span 
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => handleNavigation(item.path)}
                  className="text-muted-foreground hover:text-primary transition-colors duration-150 font-medium"
                >
                  {item.label}
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;