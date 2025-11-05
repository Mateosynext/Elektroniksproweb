import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import Button from '../../../components/ui/Button';

const ClientProfitability = ({ data }) => {
  const [sortBy, setSortBy] = useState('revenue');
  const [viewType, setViewType] = useState('chart');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const sortedData = [...data]?.sort((a, b) => {
    if (sortBy === 'revenue') return b?.revenue - a?.revenue;
    if (sortBy === 'profit') return b?.profit - a?.profit;
    if (sortBy === 'margin') return b?.profitMargin - a?.profitMargin;
    return a?.name?.localeCompare(b?.name);
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-elevation-2">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-popover-foreground">
              Ingresos: {formatCurrency(data?.revenue)}
            </p>
            <p className="text-sm text-popover-foreground">
              Ganancia: {formatCurrency(data?.profit)}
            </p>
            <p className="text-sm text-popover-foreground">
              Margen: {data?.profitMargin?.toFixed(1)}%
            </p>
            <p className="text-sm text-popover-foreground">
              Órdenes: {data?.orders}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getProfitabilityColor = (margin) => {
    if (margin >= 30) return 'text-success';
    if (margin >= 20) return 'text-warning';
    return 'text-error';
  };

  const getProfitabilityBadge = (margin) => {
    if (margin >= 30) return { label: 'Excelente', color: 'bg-success/10 text-success' };
    if (margin >= 20) return { label: 'Bueno', color: 'bg-warning/10 text-warning' };
    return { label: 'Bajo', color: 'bg-error/10 text-error' };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Rentabilidad por Cliente
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
            <Button
              variant={viewType === 'chart' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('chart')}
              iconName="BarChart3"
              iconSize={16}
            >
              Gráfico
            </Button>
            <Button
              variant={viewType === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('table')}
              iconName="Table"
              iconSize={16}
            >
              Tabla
            </Button>
          </div>
        </div>
      </div>
      {/* Sort Controls */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm text-muted-foreground">Ordenar por:</span>
        <div className="flex items-center space-x-1">
          {[
            { key: 'revenue', label: 'Ingresos', icon: 'TrendingUp' },
            { key: 'profit', label: 'Ganancia', icon: 'DollarSign' },
            { key: 'margin', label: 'Margen', icon: 'Percent' }
          ]?.map((option) => (
            <Button
              key={option?.key}
              variant={sortBy === option?.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy(option?.key)}
              iconName={option?.icon}
              iconSize={14}
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      {viewType === 'chart' ? (
        <div className="w-full h-80" aria-label="Client Profitability Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData?.slice(0, 10)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                name="Ingresos"
              />
              <Bar 
                dataKey="profit" 
                fill="var(--color-success)"
                radius={[4, 4, 0, 0]}
                name="Ganancia"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Cliente
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Ingresos
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Ganancia
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Margen
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Órdenes
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData?.map((client, index) => {
                const badge = getProfitabilityBadge(client?.profitMargin);
                return (
                  <tr key={client?.id} className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{client?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">
                      {formatCurrency(client?.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-success">
                      {formatCurrency(client?.profit)}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${getProfitabilityColor(client?.profitMargin)}`}>
                      {client?.profitMargin?.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center text-muted-foreground">
                      {client?.orders}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}>
                        {badge?.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientProfitability;