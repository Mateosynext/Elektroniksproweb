import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Icon from '../../../components/appIcon';

const ExpenseBreakdown = ({ data, totalExpenses }) => {
  const colors = [
    'var(--color-primary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-error)',
    'var(--color-accent)',
    'var(--color-secondary)'
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(value);
  };

  const formatPercentage = (value, total) => {
    return ((value / total) * 100)?.toFixed(1) + '%';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-popover-foreground mb-1">
            {data?.payload?.name}
          </p>
          <p className="text-sm text-popover-foreground">
            {formatCurrency(data?.value)} ({formatPercentage(data?.value, totalExpenses)})
          </p>
        </div>
      );
    }
    return null;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Repuestos': 'Package',
      'Mano de Obra': 'Users',
      'Gastos Generales': 'Building',
      'Administrativos': 'FileText',
      'Herramientas': 'Wrench',
      'Otros': 'MoreHorizontal'
    };
    return iconMap?.[category] || 'Circle';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Desglose de Gastos
        </h3>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="w-full h-64" aria-label="Expense Breakdown Pie Chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors?.[index % colors?.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with Details */}
        <div className="space-y-3">
          {data?.map((item, index) => (
            <div key={item?.name} className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: colors?.[index % colors?.length] }}
                ></div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getCategoryIcon(item?.name)} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {item?.name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(item?.value)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(item?.value, totalExpenses)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseBreakdown;