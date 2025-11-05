import React from 'react';
import Icon from '../../../components/appIcon';

const CompanyBranding = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="text-center space-y-6">
      {/* Company Logo */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-elevation-2">
            <Icon name="Zap" size={40} color="white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
            <Icon name="CheckCircle" size={14} color="white" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Company Name and Tagline */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          ElektronikPro
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Truck Electronics
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Shield" size={16} className="text-primary" />
          <span>Sistema de Gestión Empresarial</span>
        </div>
      </div>

      {/* Security Badge */}
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-full">
        <Icon name="Lock" size={16} className="text-success" />
        <span className="text-sm text-card-foreground font-medium">
          Acceso Seguro
        </span>
        <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
      </div>

      {/* Company Information */}
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={14} />
            <span>Mexico, Aguascalientes</span>
          </div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>24/7 Operativo</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Especialistas en Electrónica de Camiones
        </div>
      </div>

      {/* Version and Copyright */}
      <div className="pt-4 border-t border-border space-y-2">
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <span className="font-mono">v2.1.0</span>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <span>Build 2024.10.15</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {currentYear} ElektronikPro. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default CompanyBranding;