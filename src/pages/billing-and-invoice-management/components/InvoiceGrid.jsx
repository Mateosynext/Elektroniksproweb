import React, { useState, useMemo } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';

const InvoiceGrid = ({ invoices, onInvoiceSelect, selectedInvoices, onSelectionChange, onBulkAction }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'issueDate', direction: 'desc' });
  const [selectAll, setSelectAll] = useState(false);

  const sortedInvoices = useMemo(() => {
    const sorted = [...invoices]?.sort((a, b) => {
      if (sortConfig?.key === 'amount' || sortConfig?.key === 'outstandingBalance') {
        const aValue = parseFloat(a?.[sortConfig?.key]) || 0;
        const bValue = parseFloat(b?.[sortConfig?.key]) || 0;
        return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (sortConfig?.key === 'issueDate' || sortConfig?.key === 'dueDate') {
        const aDate = new Date(a[sortConfig.key]);
        const bDate = new Date(b[sortConfig.key]);
        return sortConfig?.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      const aValue = a?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
      const bValue = b?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
      return sortConfig?.direction === 'asc' 
        ? aValue?.localeCompare(bValue) 
        : bValue?.localeCompare(aValue);
    });
    return sorted;
  }, [invoices, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      const allIds = sortedInvoices?.map(invoice => invoice?.id);
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleInvoiceSelect = (invoiceId) => {
    const newSelection = selectedInvoices?.includes(invoiceId)
      ? selectedInvoices?.filter(id => id !== invoiceId)
      : [...selectedInvoices, invoiceId];
    
    onSelectionChange(newSelection);
    setSelectAll(newSelection?.length === sortedInvoices?.length);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pagada': { bg: 'bg-success', text: 'text-success-foreground', icon: 'CheckCircle' },
      'Pendiente': { bg: 'bg-warning', text: 'text-warning-foreground', icon: 'Clock' },
      'Vencida': { bg: 'bg-error', text: 'text-error-foreground', icon: 'AlertCircle' },
      'Parcial': { bg: 'bg-accent', text: 'text-accent-foreground', icon: 'MinusCircle' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.['Pendiente'];
    
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={12} />
        <span>{status}</span>
      </div>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header with bulk actions */}
      {selectedInvoices?.length > 0 && (
        <div className="bg-accent px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-accent-foreground">
              {selectedInvoices?.length} facturas seleccionadas
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Send"
                onClick={() => onBulkAction('sendReminders')}
              >
                Enviar Recordatorios
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="CreditCard"
                onClick={() => onBulkAction('recordPayment')}
              >
                Registrar Pago
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => onBulkAction('export')}
              >
                Exportar
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('invoiceNumber')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>No. Factura</span>
                  {getSortIcon('invoiceNumber')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('clientName')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Cliente</span>
                  {getSortIcon('clientName')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('issueDate')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Fecha Emisión</span>
                  {getSortIcon('issueDate')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Fecha Vencimiento</span>
                  {getSortIcon('dueDate')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Monto</span>
                  {getSortIcon('amount')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('paymentStatus')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Estado</span>
                  {getSortIcon('paymentStatus')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('outstandingBalance')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Saldo Pendiente</span>
                  {getSortIcon('outstandingBalance')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedInvoices?.map((invoice) => (
              <tr
                key={invoice?.id}
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onInvoiceSelect(invoice)}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedInvoices?.includes(invoice?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      handleInvoiceSelect(invoice?.id);
                    }}
                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {invoice?.invoiceNumber}
                </td>
                <td className="px-4 py-4 text-sm text-foreground">
                  {invoice?.clientName}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {formatDate(invoice?.issueDate)}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {formatDate(invoice?.dueDate)}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {formatCurrency(invoice?.amount)}
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(invoice?.paymentStatus)}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {formatCurrency(invoice?.outstandingBalance)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onInvoiceSelect(invoice);
                      }}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      onClick={(e) => {
                        e?.stopPropagation();
                        console.log('Download invoice:', invoice?.id);
                      }}
                    >
                      PDF
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedInvoices?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay facturas</h3>
          <p className="text-muted-foreground">No se encontraron facturas con los filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceGrid;