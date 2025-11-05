import React from 'react';
import Icon from '../../../components/appIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FinancialSummary = ({ summaryData, chartData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const monthlyRevenueData = [
    { month: 'Ene', revenue: 125000, expenses: 45000 },
    { month: 'Feb', revenue: 142000, expenses: 52000 },
    { month: 'Mar', revenue: 138000, expenses: 48000 },
    { month: 'Abr', revenue: 156000, expenses: 55000 },
    { month: 'May', revenue: 168000, expenses: 58000 },
    { month: 'Jun', revenue: 175000, expenses: 62000 }
  ];

  const paymentStatusData = [
    { name: 'Pagadas', value: 65, color: '#00C851' },
    { name: 'Pendientes', value: 25, color: '#FFB300' },
    { name: 'Vencidas', value: 10, color: '#FF4444' }
  ];

  const summaryCards = [
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(summaryData?.monthlyRevenue),
      change: '+12.5%',
      changeType: 'positive',
      icon: 'TrendingUp',
      description: 'vs mes anterior'
    },
    {
      title: 'Facturas Pendientes',
      value: summaryData?.pendingInvoices?.toString(),
      change: '-5.2%',
      changeType: 'positive',
      icon: 'Clock',
      description: 'facturas por cobrar'
    },
    {
      title: 'Saldo por Cobrar',
      value: formatCurrency(summaryData?.outstandingBalance),
      change: '+8.3%',
      changeType: 'negative',
      icon: 'CreditCard',
      description: 'total pendiente'
    },
    {
      title: 'Promedio por Factura',
      value: formatCurrency(summaryData?.averageInvoice),
      change: '+15.7%',
      changeType: 'positive',
      icon: 'Calculator',
      description: 'valor promedio'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {summaryCards?.map((card, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                card?.changeType === 'positive' ? 'bg-success/10' : 'bg-error/10'
              }`}>
                <Icon 
                  name={card?.icon} 
                  size={20} 
                  className={card?.changeType === 'positive' ? 'text-success' : 'text-error'} 
                />
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                card?.changeType === 'positive' ?'bg-success/10 text-success' :'bg-error/10 text-error'
              }`}>
                {card?.change}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">{card?.title}</h3>
              <p className="text-2xl font-bold text-foreground">{card?.value}</p>
              <p className="text-xs text-muted-foreground">{card?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Monthly Revenue Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Ingresos vs Gastos</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Ingresos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-muted-foreground">Gastos</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#B3B3B3', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#B3B3B3', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
                formatter={(value) => [formatCurrency(value), '']}
              />
              <Bar dataKey="revenue" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#FFB366" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Payment Status Distribution */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Estado de Pagos</h3>
        <div className="flex items-center space-x-6">
          <div className="h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentStatusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {paymentStatusData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item?.color }}
                  ></div>
                  <span className="text-sm text-foreground">{item?.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item?.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* CONTPAQi Integration Status */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Estado de Integración</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-success font-medium">Conectado</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Database" size={20} className="text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">CONTPAQi Comercial</p>
                <p className="text-xs text-muted-foreground">Última sincronización: hace 5 minutos</p>
              </div>
            </div>
            <Icon name="CheckCircle" size={20} className="text-success" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Receipt" size={20} className="text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">Facturación Electrónica</p>
                <p className="text-xs text-muted-foreground">Sistema SAT activo</p>
              </div>
            </div>
            <Icon name="CheckCircle" size={20} className="text-success" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Sync" size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Sincronización Automática</p>
                <p className="text-xs text-muted-foreground">Cada 15 minutos</p>
              </div>
            </div>
            <Icon name="Settings" size={20} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;