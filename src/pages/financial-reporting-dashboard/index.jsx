import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import QuickActionButton from '../../components/ui/QuickActionButton';
import MetricsOverview from './components/MetricsOverview';
import RevenueChart from './components/RevenueChart';
import ExpenseBreakdown from './components/ExpenseBreakdown';
import ClientProfitability from './components/ClientProfitability';
import ContpaqiIntegration from './components/ContpaqiIntegration';
import QuickActions from './components/QuickActions';
import DateRangeSelector from './components/DateRangeSelector';
import Icon from '../../components/appIcon';
import Button from '../../components/ui/Button';

const FinancialReportingDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentDateRange, setCurrentDateRange] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for financial metrics
  const metricsData = [
    {
      id: 1,
      type: 'revenue',
      label: 'Ingresos Totales',
      value: 2450000,
      change: 12.5
    },
    {
      id: 2,
      type: 'profit',
      label: 'Ganancia Neta',
      value: 735000,
      change: 8.3
    },
    {
      id: 3,
      type: 'receivables',
      label: 'Cuentas por Cobrar',
      value: 485000,
      change: -5.2
    },
    {
      id: 4,
      type: 'expenses',
      label: 'Gastos Totales',
      value: 1715000,
      change: 3.1
    }
  ];

  // Mock data for revenue chart
  const revenueData = [
    { month: 'Ene', revenue: 180000, target: 200000 },
    { month: 'Feb', revenue: 220000, target: 210000 },
    { month: 'Mar', revenue: 195000, target: 205000 },
    { month: 'Abr', revenue: 245000, target: 220000 },
    { month: 'May', revenue: 280000, target: 250000 },
    { month: 'Jun', revenue: 265000, target: 260000 },
    { month: 'Jul', revenue: 310000, target: 280000 },
    { month: 'Ago', revenue: 295000, target: 290000 },
    { month: 'Sep', revenue: 325000, target: 300000 },
    { month: 'Oct', revenue: 285000, target: 285000 }
  ];

  // Mock data for expense breakdown
  const expenseData = [
    { name: 'Repuestos', value: 685000 },
    { name: 'Mano de Obra', value: 420000 },
    { name: 'Gastos Generales', value: 285000 },
    { name: 'Administrativos', value: 185000 },
    { name: 'Herramientas', value: 95000 },
    { name: 'Otros', value: 45000 }
  ];

  const totalExpenses = expenseData?.reduce((sum, item) => sum + item?.value, 0);

  // Mock data for client profitability
  const clientProfitabilityData = [
    {
      id: 1,
      name: 'Transportes Mendoza SA',
      revenue: 485000,
      profit: 145500,
      profitMargin: 30.0,
      orders: 24
    },
    {
      id: 2,
      name: 'Logística del Norte',
      revenue: 365000,
      profit: 87600,
      profitMargin: 24.0,
      orders: 18
    },
    {
      id: 3,
      name: 'Fletes Industriales',
      revenue: 295000,
      profit: 82250,
      profitMargin: 27.9,
      orders: 15
    },
    {
      id: 4,
      name: 'Carga Pesada Express',
      revenue: 245000,
      profit: 49000,
      profitMargin: 20.0,
      orders: 12
    },
    {
      id: 5,
      name: 'Transportes Regionales',
      revenue: 185000,
      profit: 33300,
      profitMargin: 18.0,
      orders: 9
    },
    {
      id: 6,
      name: 'Mudanzas y Fletes',
      revenue: 125000,
      profit: 18750,
      profitMargin: 15.0,
      orders: 8
    },
    {
      id: 7,
      name: 'Distribuidora Central',
      revenue: 95000,
      profit: 11400,
      profitMargin: 12.0,
      orders: 6
    },
    {
      id: 8,
      name: 'Servicios Logísticos',
      revenue: 75000,
      profit: 7500,
      profitMargin: 10.0,
      orders: 5
    }
  ];

  useEffect(() => {
    // Initialize with current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setCurrentDateRange({
      start: firstDay?.toISOString()?.split('T')?.[0],
      end: lastDay?.toISOString()?.split('T')?.[0],
      label: 'Este Mes'
    });

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleDateRangeChange = (range) => {
    if (range?.action === 'export') {
      console.log('Exporting data for range:', range?.range);
      return;
    }
    setCurrentDateRange(range);
    console.log('Date range changed:', range);
  };

  const handleQuickAction = (action) => {
    console.log('Quick action triggered:', action);
    switch (action) {
      case 'tax': console.log('Generating tax report...');
        break;
      case 'financial': console.log('Generating financial statement...');
        break;
      case 'cashflow': console.log('Generating cash flow report...');
        break;
      case 'sync': console.log('Syncing with CONTPAQi...');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar isCollapsed={sidebarCollapsed} />
        <main className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        } mt-16 p-6`}>
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-3">
              <Icon name="BarChart3" size={32} className="text-primary animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-60'
      } mt-16 p-6`}>
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Breadcrumbs />
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Reportes Financieros
                </h1>
                <p className="text-muted-foreground">
                  Análisis integral de rendimiento financiero y rentabilidad empresarial
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              iconName={sidebarCollapsed ? 'PanelLeftOpen' : 'PanelLeftClose'}
              iconSize={18}
            >
              <span className="sr-only">
                {sidebarCollapsed ? 'Expandir' : 'Contraer'} barra lateral
              </span>
            </Button>
            
            <Button
              variant="default"
              iconName="Download"
              iconPosition="left"
              onClick={() => handleQuickAction('export-pdf')}
            >
              Exportar Reporte
            </Button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="mb-8">
          <DateRangeSelector 
            onDateRangeChange={handleDateRangeChange}
            currentRange={currentDateRange}
          />
        </div>

        {/* Metrics Overview */}
        <MetricsOverview 
          metrics={metricsData}
          dateRange={currentDateRange}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <RevenueChart 
            data={revenueData}
            chartType="line"
            title="Tendencia de Ingresos Mensuales"
          />
          <ExpenseBreakdown 
            data={expenseData}
            totalExpenses={totalExpenses}
          />
        </div>

        {/* Client Profitability */}
        <div className="mb-8">
          <ClientProfitability data={clientProfitabilityData} />
        </div>

        {/* Integration and Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <ContpaqiIntegration 
            syncStatus="connected"
            lastSync="2024-10-15T18:30:00"
            pendingTransactions={3}
          />
          <QuickActions onActionClick={handleQuickAction} />
        </div>

        {/* Performance Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Resumen de Rendimiento
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="TrendingUp" size={16} />
              <span>Período: {currentDateRange?.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Margen de Ganancia Promedio',
                value: '24.8%',
                icon: 'Percent',
                color: 'text-success'
              },
              {
                label: 'Valor Promedio por Orden',
                value: '$18,450',
                icon: 'DollarSign',
                color: 'text-primary'
              },
              {
                label: 'Clientes Activos',
                value: '47',
                icon: 'Users',
                color: 'text-warning'
              },
              {
                label: 'Días Promedio de Cobro',
                value: '28',
                icon: 'Clock',
                color: 'text-error'
              }
            ]?.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-background rounded-lg">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                  metric?.color === 'text-success' ? 'bg-success/10' :
                  metric?.color === 'text-primary' ? 'bg-primary/10' :
                  metric?.color === 'text-warning'? 'bg-warning/10' : 'bg-error/10'
                }`}>
                  <Icon name={metric?.icon} size={24} className={metric?.color} />
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {metric?.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {metric?.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <QuickActionButton />
    </div>
  );
};

export default FinancialReportingDashboard;