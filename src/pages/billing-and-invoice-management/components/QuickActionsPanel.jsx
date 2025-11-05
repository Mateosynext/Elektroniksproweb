import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickActionsPanel = ({ onQuickInvoice, onPaymentRecord, onReminderSend }) => {
  const [quickInvoiceData, setQuickInvoiceData] = useState({
    clientId: '',
    workOrderId: '',
    amount: '',
    dueDate: ''
  });
  
  const [paymentData, setPaymentData] = useState({
    invoiceId: '',
    amount: '',
    method: '',
    reference: ''
  });

  const clientOptions = [
    { value: 'client1', label: 'Transportes García S.A. de C.V.' },
    { value: 'client2', label: 'Logística del Norte' },
    { value: 'client3', label: 'Fletes Monterrey' },
    { value: 'client4', label: 'Autotransportes Juárez' },
    { value: 'client5', label: 'Carga Pesada México' }
  ];

  const workOrderOptions = [
    { value: 'wo1', label: 'OT-2024-001 - Reparación ECU Volvo' },
    { value: 'wo2', label: 'OT-2024-002 - Instalación GPS Kenworth' },
    { value: 'wo3', label: 'OT-2024-003 - Diagnóstico Freightliner' },
    { value: 'wo4', label: 'OT-2024-004 - Reparación Tablero Peterbilt' },
    { value: 'wo5', label: 'OT-2024-005 - Mantenimiento Sistema Mack' }
  ];

  const invoiceOptions = [
    { value: 'inv1', label: 'FAC-2024-001 - $15,500.00' },
    { value: 'inv2', label: 'FAC-2024-002 - $22,300.00' },
    { value: 'inv3', label: 'FAC-2024-003 - $8,750.00' },
    { value: 'inv4', label: 'FAC-2024-004 - $31,200.00' },
    { value: 'inv5', label: 'FAC-2024-005 - $19,800.00' }
  ];

  const paymentMethodOptions = [
    { value: 'transfer', label: 'Transferencia Bancaria' },
    { value: 'cash', label: 'Efectivo' },
    { value: 'check', label: 'Cheque' },
    { value: 'card', label: 'Tarjeta de Crédito' },
    { value: 'deposit', label: 'Depósito Bancario' }
  ];

  const handleQuickInvoice = () => {
    if (quickInvoiceData?.clientId && quickInvoiceData?.workOrderId) {
      onQuickInvoice(quickInvoiceData);
      setQuickInvoiceData({ clientId: '', workOrderId: '', amount: '', dueDate: '' });
    }
  };

  const handlePaymentRecord = () => {
    if (paymentData?.invoiceId && paymentData?.amount && paymentData?.method) {
      onPaymentRecord(paymentData);
      setPaymentData({ invoiceId: '', amount: '', method: '', reference: '' });
    }
  };

  const quickActions = [
    {
      title: 'Generar Reporte',
      description: 'Crear reporte financiero',
      icon: 'BarChart3',
      color: 'bg-primary',
      action: () => console.log('Generate report')
    },
    {
      title: 'Exportar Datos',
      description: 'Descargar en Excel/PDF',
      icon: 'Download',
      color: 'bg-accent',
      action: () => console.log('Export data')
    },
    {
      title: 'Configurar Recordatorios',
      description: 'Automatizar notificaciones',
      icon: 'Bell',
      color: 'bg-secondary',
      action: () => console.log('Configure reminders')
    },
    {
      title: 'Sincronizar CONTPAQi',
      description: 'Actualizar datos contables',
      icon: 'Sync',
      color: 'bg-success',
      action: () => console.log('Sync CONTPAQi')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Invoice Generation */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Factura Rápida</h3>
            <p className="text-sm text-muted-foreground">Generar desde orden completada</p>
          </div>
        </div>

        <div className="space-y-4">
          <Select
            label="Cliente"
            placeholder="Seleccionar cliente"
            options={clientOptions}
            value={quickInvoiceData?.clientId}
            onChange={(value) => setQuickInvoiceData(prev => ({ ...prev, clientId: value }))}
          />

          <Select
            label="Orden de Trabajo"
            placeholder="Seleccionar orden completada"
            options={workOrderOptions}
            value={quickInvoiceData?.workOrderId}
            onChange={(value) => setQuickInvoiceData(prev => ({ ...prev, workOrderId: value }))}
          />

          <Input
            label="Monto Total"
            type="number"
            placeholder="0.00"
            value={quickInvoiceData?.amount}
            onChange={(e) => setQuickInvoiceData(prev => ({ ...prev, amount: e?.target?.value }))}
          />

          <Input
            label="Fecha de Vencimiento"
            type="date"
            value={quickInvoiceData?.dueDate}
            onChange={(e) => setQuickInvoiceData(prev => ({ ...prev, dueDate: e?.target?.value }))}
          />

          <Button
            variant="default"
            fullWidth
            iconName="Plus"
            onClick={handleQuickInvoice}
            disabled={!quickInvoiceData?.clientId || !quickInvoiceData?.workOrderId}
          >
            Generar Factura
          </Button>
        </div>
      </div>
      {/* Quick Payment Recording */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="CreditCard" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Registrar Pago</h3>
            <p className="text-sm text-muted-foreground">Actualizar estado de factura</p>
          </div>
        </div>

        <div className="space-y-4">
          <Select
            label="Factura"
            placeholder="Seleccionar factura pendiente"
            options={invoiceOptions}
            value={paymentData?.invoiceId}
            onChange={(value) => setPaymentData(prev => ({ ...prev, invoiceId: value }))}
          />

          <Input
            label="Monto Pagado"
            type="number"
            placeholder="0.00"
            value={paymentData?.amount}
            onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e?.target?.value }))}
          />

          <Select
            label="Método de Pago"
            placeholder="Seleccionar método"
            options={paymentMethodOptions}
            value={paymentData?.method}
            onChange={(value) => setPaymentData(prev => ({ ...prev, method: value }))}
          />

          <Input
            label="Referencia/Folio"
            type="text"
            placeholder="Número de referencia"
            value={paymentData?.reference}
            onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e?.target?.value }))}
          />

          <Button
            variant="success"
            fullWidth
            iconName="Check"
            onClick={handlePaymentRecord}
            disabled={!paymentData?.invoiceId || !paymentData?.amount || !paymentData?.method}
          >
            Registrar Pago
          </Button>
        </div>
      </div>
      {/* Quick Actions Grid */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 gap-3">
          {quickActions?.map((action, index) => (
            <button
              key={index}
              onClick={action?.action}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors text-left"
            >
              <div className={`w-10 h-10 ${action?.color}/10 rounded-lg flex items-center justify-center`}>
                <Icon name={action?.icon} size={20} className={`${action?.color?.replace('bg-', 'text-')}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{action?.title}</p>
                <p className="text-xs text-muted-foreground">{action?.description}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
      {/* Keyboard Shortcuts */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Atajos de Teclado</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Nueva Factura</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + N</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Buscar</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + F</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Exportar</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + E</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Imprimir</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + P</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;