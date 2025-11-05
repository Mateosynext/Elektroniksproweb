import React, { useState, useEffect } from 'react';
import Icon from '../../../components/appIcon';

const SecurityFeatures = () => {
  const [securityMetrics, setSecurityMetrics] = useState({
    activeUsers: 0,
    todayLogins: 0,
    securityLevel: 'high',
    lastSecurityScan: new Date()
  });

  const [ipAddress, setIpAddress] = useState('192.168.1.100');
  const [deviceInfo, setDeviceInfo] = useState({
    browser: 'Chrome',
    os: 'Windows 11',
    location: 'AGS, MX'
  });

  useEffect(() => {
    // Simulate security metrics loading
    const loadSecurityMetrics = () => {
      setSecurityMetrics({
        activeUsers: Math.floor(Math.random() * 15) + 5,
        todayLogins: Math.floor(Math.random() * 50) + 20,
        securityLevel: 'high',
        lastSecurityScan: new Date(Date.now() - Math.random() * 3600000)
      });
    };

    // Simulate device detection
    const detectDevice = () => {
      const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
      const systems = ['Windows 11', 'macOS', 'Linux'];
      
      setDeviceInfo({
        browser: browsers?.[Math.floor(Math.random() * browsers?.length)],
        os: systems?.[Math.floor(Math.random() * systems?.length)],
        location: 'Mendoza, AR'
      });
    };

    loadSecurityMetrics();
    detectDevice();
  }, []);

  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Autenticación JWT',
      description: 'Tokens seguros con renovación automática',
      status: 'active'
    },
    {
      icon: 'Lock',
      title: 'Cifrado de Datos',
      description: 'Encriptación AES-256 en tránsito y reposo',
      status: 'active'
    },
    {
      icon: 'Eye',
      title: 'Auditoría Completa',
      description: 'Registro de todas las actividades del sistema',
      status: 'active'
    },
    {
      icon: 'UserCheck',
      title: 'Control de Roles',
      description: 'Permisos granulares por tipo de usuario',
      status: 'active'
    }
  ];

  const getSecurityLevelColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSecurityLevelText = (level) => {
    switch (level) {
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Medio';
      case 'low':
        return 'Bajo';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-card-foreground">Seguridad del Sistema</h3>
          <div className={`flex items-center space-x-2 ${getSecurityLevelColor(securityMetrics?.securityLevel)}`}>
            <Icon name="Shield" size={16} />
            <span className="text-xs font-mono">
              Nivel {getSecurityLevelText(securityMetrics?.securityLevel)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-card-foreground">
              {securityMetrics?.activeUsers}
            </div>
            <div className="text-xs text-muted-foreground">
              Usuarios Activos
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-card-foreground">
              {securityMetrics?.todayLogins}
            </div>
            <div className="text-xs text-muted-foreground">
              Accesos Hoy
            </div>
          </div>
        </div>
      </div>
      {/* Security Features */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">
          Características de Seguridad
        </h3>
        
        <div className="space-y-3">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg flex-shrink-0">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-card-foreground">
                    {feature?.title}
                  </h4>
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Device Information */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">
          Información del Dispositivo
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Monitor" size={16} className="text-muted-foreground" />
              <span className="text-sm text-card-foreground">Navegador</span>
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              {deviceInfo?.browser}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Laptop" size={16} className="text-muted-foreground" />
              <span className="text-sm text-card-foreground">Sistema</span>
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              {deviceInfo?.os}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} className="text-muted-foreground" />
              <span className="text-sm text-card-foreground">Ubicación</span>
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              {deviceInfo?.location}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Wifi" size={16} className="text-muted-foreground" />
              <span className="text-sm text-card-foreground">IP</span>
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              {ipAddress}
            </span>
          </div>
        </div>
      </div>
      {/* Last Security Scan */}
      <div className="text-center">
        <div className="text-xs text-muted-foreground">
          Último escaneo de seguridad:
        </div>
        <div className="text-xs text-muted-foreground font-mono mt-1">
          {securityMetrics?.lastSecurityScan?.toLocaleString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;