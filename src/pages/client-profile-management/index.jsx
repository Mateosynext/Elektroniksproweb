import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import Icon from '../../components/appIcon';


// Import all components
import ClientHeader from './components/ClientHeader';
import ClientDetailsTab from './components/ClientDetailsTab';
import VehicleFleetTab from './components/VehicleFleetTab';
import ServiceHistoryTab from './components/ServiceHistoryTab';
import IntegrationPanel from './components/IntegrationPanel';
import DocumentManagement from './components/DocumentManagement';
import QuickActionSidebar from './components/QuickActionSidebar';

const ClientProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [userRole, setUserRole] = useState('admin');
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Mock client data
  const [client, setClient] = useState({
    id: 1,
    companyName: "Transportes Mendoza S.A. de C.V.",
    rfc: "TME240115ABC",
    contactPerson: "Carlos Mendoza García",
    position: "Gerente de Mantenimiento",
    phone: "+52 81 1234 5678",
    email: "carlos.mendoza@transportesmendoza.com.mx",
    website: "https://www.transportesmendoza.com.mx",
    address: "Av. Constitución 1234, Col. Centro",
    city: "Monterrey",
    state: "nuevo-leon",
    postalCode: "64000",
    country: "México",
    billingAddress: "Av. Constitución 1234, Col. Centro",
    billingCity: "Monterrey",
    billingState: "nuevo-leon",
    billingPostalCode: "64000",
    paymentTerms: "30",
    creditLimit: "150000",
    preferredContact: "email",
    status: "active",
    createdAt: "2024-01-15T10:00:00",
    vehicleCount: 8,
    notes: "Cliente preferencial con más de 5 años de relación comercial. Especializado en transporte de carga pesada con flota de tractocamiones Kenworth y Freightliner."
  });

  // Check for saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference when changed
  useEffect(() => {
    localStorage.setItem('selectedLanguage', currentLanguage);
  }, [currentLanguage]);

  // Auto-save functionality
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event?.ctrlKey && event?.key === 's') {
        event?.preventDefault();
        handleSaveClient(client);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [client]);

  const tabs = [
    { id: 'details', label: 'Detalles del Cliente', icon: 'User' },
    { id: 'vehicles', label: 'Flota de Vehículos', icon: 'Truck' },
    { id: 'history', label: 'Historial de Servicios', icon: 'History' },
    { id: 'integration', label: 'Integración', icon: 'Link' },
    { id: 'documents', label: 'Documentos', icon: 'FileText' }
  ];

  const breadcrumbItems = [
    { label: 'Inicio', path: '/', icon: 'Home' },
    { label: 'Gestión de Clientes', path: '/client-profile-management', icon: 'Users', current: true }
  ];

  const canEdit = userRole === 'admin' || userRole === 'director';
  const canViewFinancials = userRole === 'admin' || userRole === 'director';

  const handleSaveClient = (updatedClient) => {
    setClient(updatedClient);
    // Simulate API call
    console.log('Guardando cliente:', updatedClient);
    
    // Show success notification (would be replaced with actual notification system)
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-6 bg-success text-success-foreground px-4 py-2 rounded-lg shadow-elevation-2 z-300';
    notification.textContent = 'Cliente actualizado exitosamente';
    document.body?.appendChild(notification);
    
    setTimeout(() => {
      document.body?.removeChild(notification);
    }, 3000);
  };

  const handleEditClient = () => {
    setActiveTab('details');
  };

  const handleDeleteClient = () => {
    if (window.confirm('¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.')) {
      console.log('Eliminando cliente:', client?.id);
      // Redirect to client list
      window.location.href = '/client-profile-management';
    }
  };

  const handleQuickAction = (actionId, clientData) => {
    switch (actionId) {
      case 'schedule-service':
        window.location.href = `/work-order-management-system?client=${clientData?.id}`;
        break;
      case 'generate-invoice':
        window.location.href = `/billing-and-invoice-management?client=${clientData?.id}`;
        break;
      case 'send-communication':
        window.open(`mailto:${clientData?.email}?subject=Comunicación ElektronikPro`);
        break;
      case 'export-records':
        // Simulate export
        const exportData = {
          client: clientData,
          exportDate: new Date()?.toISOString(),
          exportedBy: 'Usuario Actual'
        };
        console.log('Exportando datos:', exportData);
        break;
      case 'add-vehicle': setActiveTab('vehicles');
        break;
      case 'view-analytics':
        window.location.href = `/financial-reporting-dashboard?client=${clientData?.id}`;
        break;
      default:
        console.log('Acción no implementada:', actionId);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <ClientDetailsTab
            client={client}
            onSave={handleSaveClient}
            canEdit={canEdit}
          />
        );
      case 'vehicles':
        return (
          <VehicleFleetTab
            clientId={client?.id}
            canEdit={canEdit}
          />
        );
      case 'history':
        return (
          <ServiceHistoryTab
            clientId={client?.id}
            canEdit={canEdit}
          />
        );
      case 'integration':
        return (
          <IntegrationPanel
            clientId={client?.id}
            canEdit={canEdit}
          />
        );
      case 'documents':
        return (
          <DocumentManagement
            clientId={client?.id}
            canEdit={canEdit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className={`pt-16 ${showQuickActions ? 'pr-16' : ''} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Client Header */}
          <ClientHeader
            client={client}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            canEdit={canEdit}
          />

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
                <span className="text-sm text-foreground">CONTPAQi Sincronizado</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Última actualización: {new Date()?.toLocaleTimeString('es-MX')}
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
                <span className="text-sm text-foreground">Respaldo Automático</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Próximo respaldo: 02:00 AM
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-primary" />
                <span className="text-sm text-foreground">Usuario: {userRole === 'admin' ? 'Administrador' : 'Técnico'}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Sesión activa desde: {new Date()?.toLocaleTimeString('es-MX')}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Action Sidebar */}
      <QuickActionSidebar
        client={client}
        onAction={handleQuickAction}
      />
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              © {new Date()?.getFullYear()} ElektronikPro - Sistema de Gestión de Reparaciones Electrónicas
            </div>
            <div className="flex items-center space-x-4">
              <span>Versión 2.1.0</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Sistema Operativo</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientProfileManagement;
