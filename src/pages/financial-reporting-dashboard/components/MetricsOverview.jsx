import React from 'react';
import Icon from '../../../components/appIcon';

const MetricsOverview = ({ metrics, dateRange }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value?.toFixed(1)}%`;
  };

  const getMetricIcon = (type) => {
    const iconMap = {
      revenue: 'TrendingUp',
      profit: 'DollarSign',
      receivables: 'Clock',
      expenses: 'TrendingDown'
    };
    return iconMap?.[type] || 'BarChart3';
  };

  const getMetricColor = (type, change) => {
    if (type === 'expenses') {
      return change > 0 ? 'text-warning' : 'text-success';
    }
    return change >= 0 ? 'text-success' : 'text-error';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              metric?.type === 'revenue' ? 'bg-primary/10' :
              metric?.type === 'profit' ? 'bg-success/10' :
              metric?.type === 'receivables'? 'bg-warning/10' : 'bg-error/10'
            }`}>
              <Icon 
                name={getMetricIcon(metric?.type)} 
                size={24} 
                className={
                  metric?.type === 'revenue' ? 'text-primary' :
                  metric?.type === 'profit' ? 'text-success' :
                  metric?.type === 'receivables'? 'text-warning' : 'text-error'
                }
              />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              getMetricColor(metric?.type, metric?.change)
            }`}>
              <Icon 
                name={metric?.change >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
              />
              <span>{formatPercentage(metric?.change)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {metric?.label}
            </h3>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(metric?.value)}
            </p>
            <p className="text-xs text-muted-foreground">
              vs. período anterior
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;