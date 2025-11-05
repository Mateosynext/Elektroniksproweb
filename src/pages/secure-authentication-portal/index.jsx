import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SystemStatus from './components/SystemStatus';
import CompanyBranding from './components/CompanyBranding';
import SecurityFeatures from './components/SecurityFeatures';

const SecureAuthenticationPortal = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Mock credentials for different user roles
  const mockCredentials = {
    administrator: { username: 'Mateo', password: '12345', role: 'administrator' },
    technician: { username: 'Isaac', password: '12345', role: 'technician' },
    director: { username: 'Jesus', password: '12345', role: 'director' }
  };

  // ✅ FUNCIÓN DE REDIRECCIÓN CORREGIDA - en el componente PADRE
  const redirectToDashboard = (role) => {
    switch (role) {
      case 'administrator': 
        navigate('/dashboard');
        break;
      case 'technician': 
        navigate('/work-orders');
        break;
      case 'director': 
        navigate('/financial');
        break;
      default:
        navigate('/dashboard');
    }
  };

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (token && tokenExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(tokenExpiry);
      
      if (now < expiry) {
        // Token is still valid, redirect to dashboard
        const userRole = localStorage.getItem('userRole');
        redirectToDashboard(userRole);
      } else {
        // Token expired, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userRole');
      }
    }

    // Set up session timeout warning
    const timeoutWarning = setTimeout(() => {
      setSessionTimeout('Su sesión expirará en 5 minutos. Por favor, guarde su trabajo.');
    }, 25 * 60 * 1000); // 25 minutes

    return () => clearTimeout(timeoutWarning);
  }, []);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate credentials
      const validCredential = Object.values(mockCredentials).find(
        cred => cred.username === formData.username && 
                cred.password === formData.password && 
                cred.role === formData.role
      );

      if (!validCredential) {
        throw new Error('Credenciales inválidas. Verifique su usuario, contraseña y rol.');
      }

      // Generate mock JWT token
      const token = `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiry = new Date().getTime() + (30 * 60 * 1000); // 30 minutes

      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('tokenExpiry', expiry.toString());
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('username', formData.username);

      if (formData.rememberDevice) {
        localStorage.setItem('rememberDevice', 'true');
      }

      // Log successful login
      console.log('Login successful:', {
        username: formData.username,
        role: formData.role,
        timestamp: new Date().toISOString()
      });

      // ✅ REDIRECCIÓN CORRECTA - usando la función del componente padre
      redirectToDashboard(formData.role);

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-background flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-6xl grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column - Company Branding */}
        <div className="hidden lg:block space-y-6">
          <CompanyBranding />
          
          {/* Additional Features */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Características del Sistema
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-card-foreground">
                  Gestión completa de clientes y vehículos
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-card-foreground">
                  Control de inventario en tiempo real
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-card-foreground">
                  Órdenes de trabajo digitalizadas
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-card-foreground">
                  Facturación integrada con CONTPAQi
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-card-foreground">
                  Reportes financieros avanzados
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Login Form */}
        <div className="bg-card border border-border rounded-xl shadow-elevation-2 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              Acceso al Sistema
            </h2>
            <p className="text-muted-foreground">
              Ingrese sus credenciales para continuar
            </p>
          </div>

          {/* Session Timeout Warning */}
          {sessionTimeout && (
            <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                <span className="text-sm text-warning">{sessionTimeout}</span>
              </div>
            </div>
          )}

          <LoginForm 
            onLogin={handleLogin}
            isLoading={isLoading}
            error={error}
          />

          {/* Demo Credentials Info */}
          <div className="mt-8 p-4 bg-muted/10 border border-muted/20 rounded-lg">
            <h4 className="text-sm font-semibold text-card-foreground mb-3">
          
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground font-mono">
              
            </div>
          </div>
        </div>

        {/* Right Column - System Status & Security */}
        <div className="hidden lg:block space-y-6">
          <SystemStatus />
          <SecurityFeatures />
        </div>
      </div>

      {/* Mobile Company Info */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="font-semibold text-card-foreground">ElektronikPro</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Sistema de Gestión Empresarial - Truck Electronics
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecureAuthenticationPortal;