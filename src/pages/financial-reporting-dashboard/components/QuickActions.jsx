import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick }) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = async (reportType) => {
    setIsGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      onActionClick?.(reportType);
    }, 2000);
  };

  const quickActions = [
    {
      id: 'tax-report',
      label: 'Reporte Fiscal',
      description: 'Generar reporte para SAT',
      icon: 'FileText',
      color: 'bg-primary/10 text-primary',
      action: () => handleGenerateReport('tax')
    },
    {
      id: 'financial-statement',
      label: 'Estado Financiero',
      description: 'Balance general y P&L',
      icon: 'BarChart3',
      color: 'bg-success/10 text-success',
      action: () => handleGenerateReport('financial')
    },
    {
      id: 'cash-flow',
      label: 'Flujo de Efectivo',
      description: 'Análisis de liquidez',
      icon: 'TrendingUp',
      color: 'bg-warning/10 text-warning',
      action: () => handleGenerateReport('cashflow')
    },
    {
      id: 'sync-contpaqi',
      label: 'Sincronizar CONTPAQi',
      description: 'Actualizar datos contables',
      icon: 'RefreshCw',
      color: 'bg-accent/10 text-accent',
      action: () => onActionClick?.('sync')
    }
  ];

  const exportOptions = [
    {
      id: 'excel',
      label: 'Exportar Excel',
      icon: 'FileSpreadsheet',
      format: 'xlsx'
    },
    {
      id: 'pdf',
      label: 'Exportar PDF',
      icon: 'FileDown',
      format: 'pdf'
    },
    {
      id: 'csv',
      label: 'Exportar CSV',
      icon: 'Database',
      format: 'csv'
    }
  ];

  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format...`);
    onActionClick?.(`export-${format}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Acciones Rápidas
      </h3>
      {/* Main Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.action}
            disabled={isGeneratingReport}
            className="flex items-center space-x-4 p-4 bg-background rounded-lg hover:bg-accent/50 transition-colors duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action?.color}`}>
              <Icon 
                name={action?.icon} 
                size={24}
                className={isGeneratingReport && action?.id === 'sync-contpaqi' ? 'animate-spin' : ''}
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-1">
                {action?.label}
              </h4>
              <p className="text-xs text-muted-foreground">
                {action?.description}
              </p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
      {/* Export Options */}
      <div className="border-t border-border pt-6">
        <h4 className="text-sm font-medium text-foreground mb-4">
          Exportar Datos
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {exportOptions?.map((option) => (
            <Button
              key={option?.id}
              variant="outline"
              size="sm"
              onClick={() => handleExport(option?.format)}
              iconName={option?.icon}
              iconPosition="left"
              fullWidth
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Scheduled Reports */}
      <div className="border-t border-border pt-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-foreground">
            Reportes Programados
          </h4>
          <Button
            variant="ghost"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => onActionClick?.('schedule-report')}
          >
            Programar
          </Button>
        </div>
        
        <div className="space-y-3">
          {[
            {
              id: 1,
              name: 'Reporte Mensual de Ingresos',
              schedule: 'Cada 1er día del mes',
              nextRun: '01/11/2024',
              status: 'active'
            },
            {
              id: 2,
              name: 'Estado Financiero Trimestral',
              schedule: 'Cada trimestre',
              nextRun: '01/01/2025',
              status: 'active'
            },
            {
              id: 3,
              name: 'Análisis de Rentabilidad',
              schedule: 'Semanal',
              nextRun: '22/10/2024',
              status: 'paused'
            }
          ]?.map((report) => (
            <div key={report?.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  report?.status === 'active' ? 'bg-success animate-pulse-subtle' : 'bg-muted'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{report?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {report?.schedule} • Próximo: {report?.nextRun}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName={report?.status === 'active' ? 'Pause' : 'Play'}
                  iconSize={14}
                >
                  <span className="sr-only">
                    {report?.status === 'active' ? 'Pausar' : 'Activar'} reporte
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Settings"
                  iconSize={14}
                >
                  <span className="sr-only">Configurar reporte</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;