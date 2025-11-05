import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';

const DateRangeSelector = ({ onDateRangeChange, currentRange }) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const predefinedRanges = [
    {
      id: 'today',
      label: 'Hoy',
      icon: 'Calendar',
      getValue: () => {
        const today = new Date();
        return {
          start: today?.toISOString()?.split('T')?.[0],
          end: today?.toISOString()?.split('T')?.[0],
          label: 'Hoy'
        };
      }
    },
    {
      id: 'week',
      label: 'Esta Semana',
      icon: 'Calendar',
      getValue: () => {
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        return {
          start: firstDay?.toISOString()?.split('T')?.[0],
          end: lastDay?.toISOString()?.split('T')?.[0],
          label: 'Esta Semana'
        };
      }
    },
    {
      id: 'month',
      label: 'Este Mes',
      icon: 'Calendar',
      getValue: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return {
          start: firstDay?.toISOString()?.split('T')?.[0],
          end: lastDay?.toISOString()?.split('T')?.[0],
          label: 'Este Mes'
        };
      }
    },
    {
      id: 'quarter',
      label: 'Este Trimestre',
      icon: 'Calendar',
      getValue: () => {
        const today = new Date();
        const quarter = Math.floor(today?.getMonth() / 3);
        const firstDay = new Date(today.getFullYear(), quarter * 3, 1);
        const lastDay = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        return {
          start: firstDay?.toISOString()?.split('T')?.[0],
          end: lastDay?.toISOString()?.split('T')?.[0],
          label: 'Este Trimestre'
        };
      }
    },
    {
      id: 'year',
      label: 'Este Año',
      icon: 'Calendar',
      getValue: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), 0, 1);
        const lastDay = new Date(today.getFullYear(), 11, 31);
        return {
          start: firstDay?.toISOString()?.split('T')?.[0],
          end: lastDay?.toISOString()?.split('T')?.[0],
          label: 'Este Año'
        };
      }
    },
    {
      id: 'last30',
      label: 'Últimos 30 Días',
      icon: 'Calendar',
      getValue: () => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        return {
          start: thirtyDaysAgo?.toISOString()?.split('T')?.[0],
          end: new Date()?.toISOString()?.split('T')?.[0],
          label: 'Últimos 30 Días'
        };
      }
    }
  ];

  const handleRangeSelect = (range) => {
    const dateRange = range?.getValue();
    onDateRangeChange?.(dateRange);
  };

  const handleCustomRange = () => {
    if (customStartDate && customEndDate) {
      const dateRange = {
        start: customStartDate,
        end: customEndDate,
        label: `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`
      };
      onDateRangeChange?.(dateRange);
      setIsCustomOpen(false);
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isRangeActive = (rangeId) => {
    if (!currentRange) return false;
    const range = predefinedRanges?.find(r => r?.id === rangeId);
    if (!range) return false;
    const rangeValue = range?.getValue();
    return rangeValue?.start === currentRange?.start && rangeValue?.end === currentRange?.end;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">
          Período de Análisis
        </h3>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Calendar" size={14} />
          <span>{currentRange?.label || 'Seleccionar período'}</span>
        </div>
      </div>
      {/* Predefined Ranges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {predefinedRanges?.map((range) => (
          <Button
            key={range?.id}
            variant={isRangeActive(range?.id) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRangeSelect(range)}
            iconName={range?.icon}
            iconSize={14}
            className="text-xs"
          >
            {range?.label}
          </Button>
        ))}
      </div>
      {/* Custom Range */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">
            Rango Personalizado
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCustomOpen(!isCustomOpen)}
            iconName={isCustomOpen ? 'ChevronUp' : 'ChevronDown'}
            iconSize={14}
          >
            {isCustomOpen ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>

        {isCustomOpen && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e?.target?.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e?.target?.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleCustomRange}
              disabled={!customStartDate || !customEndDate}
              iconName="Check"
              iconPosition="left"
              fullWidth
            >
              Aplicar Rango Personalizado
            </Button>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Comparar con período anterior
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              iconSize={14}
              onClick={() => {
                const thisMonth = predefinedRanges?.find(r => r?.id === 'month');
                handleRangeSelect(thisMonth);
              }}
            >
              <span className="sr-only">Restablecer a este mes</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconSize={14}
              onClick={() => onDateRangeChange?.({ action: 'export', range: currentRange })}
            >
              <span className="sr-only">Exportar período actual</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;