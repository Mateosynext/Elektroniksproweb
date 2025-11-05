import React, { useState, useEffect } from 'react';
import Icon from '../../components/appIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import QuickActionButton from '../../components/ui/QuickActionButton';
import InvoiceGrid from './components/InvoiceGrid';
import FinancialSummary from './components/FinancialSummary';
import QuickActionsPanel from './components/QuickActionsPanel';
import InvoiceFilters from './components/InvoiceFilters';

const BillingAndInvoiceManagement = () => {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock invoice data
  const mockInvoices = [
    {
      id: 'inv1',
      invoiceNumber: 'FAC-2024-001',
      clientName: 'Transportes García S.A. de C.V.',
      clientId: 'client1',
      issueDate: '2024-10-01',
      dueDate: '2024-10-31',
      amount: 15500.00,
      paymentStatus: 'Pagada',
      outstandingBalance: 0.00,
      workOrderId: 'WO-2024-001',
      paymentMethod: 'Transferencia',
      taxAmount: 2480.00,
      subtotal: 13020.00
    },
    {
      id: 'inv2',
      invoiceNumber: 'FAC-2024-002',
      clientName: 'Logística del Norte',
      clientId: 'client2',
      issueDate: '2024-10-05',
      dueDate: '2024-11-04',
      amount: 22300.00,
      paymentStatus: 'Pendiente',
      outstandingBalance: 22300.00,
      workOrderId: 'WO-2024-002',
      paymentMethod: '',
      taxAmount: 3568.00,
      subtotal: 18732.00
    },
    {
      id: 'inv3',
      invoiceNumber: 'FAC-2024-003',
      clientName: 'Fletes Monterrey',
      clientId: 'client3',
      issueDate: '2024-09-28',
      dueDate: '2024-10-28',
      amount: 8750.00,
      paymentStatus: 'Vencida',
      outstandingBalance: 8750.00,
      workOrderId: 'WO-2024-003',
      paymentMethod: '',
      taxAmount: 1400.00,
      subtotal: 7350.00
    },
    {
      id: 'inv4',
      invoiceNumber: 'FAC-2024-004',
      clientName: 'Autotransportes Juárez',
      clientId: 'client4',
      issueDate: '2024-10-10',
      dueDate: '2024-11-09',
      amount: 31200.00,
      paymentStatus: 'Parcial',
      outstandingBalance: 15600.00,
      workOrderId: 'WO-2024-004',
      paymentMethod: 'Efectivo',
      taxAmount: 4992.00,
      subtotal: 26208.00
    },
    {
      id: 'inv5',
      invoiceNumber: 'FAC-2024-005',
      clientName: 'Carga Pesada México',
      clientId: 'client5',
      issueDate: '2024-10-12',
      dueDate: '2024-11-11',
      amount: 19800.00,
      paymentStatus: 'Pendiente',
      outstandingBalance: 19800.00,
      workOrderId: 'WO-2024-005',
      paymentMethod: '',
      taxAmount: 3168.00,
      subtotal: 16632.00
    },
    {
      id: 'inv6',
      invoiceNumber: 'FAC-2024-006',
      clientName: 'Transportes García S.A. de C.V.',
      clientId: 'client1',
      issueDate: '2024-10-14',
      dueDate: '2024-11-13',
      amount: 27500.00,
      paymentStatus: 'Pagada',
      outstandingBalance: 0.00,
      workOrderId: 'WO-2024-006',
      paymentMethod: 'Transferencia',
      taxAmount: 4400.00,
      subtotal: 23100.00
    },
    {
      id: 'inv7',
      invoiceNumber: 'FAC-2024-007',
      clientName: 'Logística del Norte',
      clientId: 'client2',
      issueDate: '2024-10-15',
      dueDate: '2024-11-14',
      amount: 12400.00,
      paymentStatus: 'Pendiente',
      outstandingBalance: 12400.00,
      workOrderId: 'WO-2024-007',
      paymentMethod: '',
      taxAmount: 1984.00,
      subtotal: 10416.00
    }
  ];

  // Mock financial summary data
  const mockSummaryData = {
    monthlyRevenue: 175000,
    pendingInvoices: 15,
    outstandingBalance: 78850,
    averageInvoice: 18750,
    totalInvoices: 125,
    paidInvoices: 85,
    overdueInvoices: 8
  };

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleSelectionChange = (invoiceIds) => {
    setSelectedInvoices(invoiceIds);
  };

  const handleBulkAction = (action) => {
    setIsLoading(true);
    console.log(`Bulk action: ${action} for invoices:`, selectedInvoices);
    
    setTimeout(() => {
      setIsLoading(false);
      setSelectedInvoices([]);
    }, 2000);
  };

  const handleQuickInvoice = (invoiceData) => {
    console.log('Creating quick invoice:', invoiceData);
    // Simulate invoice creation
  };

  const handlePaymentRecord = (paymentData) => {
    console.log('Recording payment:', paymentData);
    // Simulate payment recording
  };

  const handleReminderSend = (reminderData) => {
    console.log('Sending reminder:', reminderData);
    // Simulate reminder sending
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event?.ctrlKey) {
        switch (event?.key) {
          case 'n':
            event?.preventDefault();
            console.log('New invoice shortcut');
            break;
          case 'f':
            event?.preventDefault();
            console.log('Search shortcut');
            break;
          case 'e':
            event?.preventDefault();
            console.log('Export shortcut');
            break;
          case 'p':
            event?.preventDefault();
            console.log('Print shortcut');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const breadcrumbItems = [
    { label: 'Inicio', path: '/', icon: 'Home' },
    { label: 'Facturación', path: '/billing-and-invoice-management', icon: 'Receipt', current: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="ml-60 pt-16">
        <div className="p-6">
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Receipt" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Facturación y Cobranza</h1>
                <p className="text-muted-foreground">
                  Gestión integral de facturas, pagos y reportes financieros
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                onClick={() => console.log('Export all data')}
              >
                Exportar
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                onClick={() => console.log('Create new invoice')}
              >
                Nueva Factura
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <InvoiceFilters 
              onFiltersChange={handleFiltersChange}
              activeFilters={filters}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Invoice Grid - 50% */}
            <div className="col-span-12 lg:col-span-6">
              <InvoiceGrid
                invoices={mockInvoices}
                onInvoiceSelect={handleInvoiceSelect}
                selectedInvoices={selectedInvoices}
                onSelectionChange={handleSelectionChange}
                onBulkAction={handleBulkAction}
              />
            </div>

            {/* Financial Summary - 30% */}
            <div className="col-span-12 lg:col-span-4">
              <FinancialSummary
                summaryData={mockSummaryData}
                chartData={mockInvoices}
              />
            </div>

            {/* Quick Actions Panel - 20% */}
            <div className="col-span-12 lg:col-span-2">
              <QuickActionsPanel
                onQuickInvoice={handleQuickInvoice}
                onPaymentRecord={handlePaymentRecord}
                onReminderSend={handleReminderSend}
              />
            </div>
          </div>

          {/* Selected Invoice Details Modal/Panel */}
          {selectedInvoice && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-300 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={24} className="text-primary" />
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {selectedInvoice?.invoiceNumber}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedInvoice?.clientName}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="X"
                    onClick={() => setSelectedInvoice(null)}
                  />
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Fecha de Emisión
                      </label>
                      <p className="text-foreground">
                        {new Date(selectedInvoice.issueDate)?.toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Fecha de Vencimiento
                      </label>
                      <p className="text-foreground">
                        {new Date(selectedInvoice.dueDate)?.toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Subtotal
                      </label>
                      <p className="text-foreground">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN'
                        })?.format(selectedInvoice?.subtotal)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        IVA
                      </label>
                      <p className="text-foreground">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN'
                        })?.format(selectedInvoice?.taxAmount)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Total
                      </label>
                      <p className="text-xl font-bold text-foreground">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN'
                        })?.format(selectedInvoice?.amount)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Saldo Pendiente
                      </label>
                      <p className="text-xl font-bold text-error">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN'
                        })?.format(selectedInvoice?.outstandingBalance)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-4 border-t border-border">
                    <Button
                      variant="default"
                      iconName="Download"
                      onClick={() => console.log('Download PDF')}
                    >
                      Descargar PDF
                    </Button>
                    <Button
                      variant="outline"
                      iconName="Send"
                      onClick={() => console.log('Send invoice')}
                    >
                      Enviar por Email
                    </Button>
                    <Button
                      variant="outline"
                      iconName="CreditCard"
                      onClick={() => console.log('Record payment')}
                    >
                      Registrar Pago
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <QuickActionButton />
    </div>
  );
};

export default BillingAndInvoiceManagement;