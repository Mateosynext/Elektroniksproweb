import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ServiceHistoryTab = ({ clientId, canEdit }) => {
  const [serviceHistory, setServiceHistory] = useState([
  {
    id: 1,
    workOrderNumber: "WO-2024-001234",
    vehicleInfo: "Kenworth T680 - ABC-123-D",
    serviceDate: "2024-10-10",
    completedDate: "2024-10-12",
    technician: "Flaco Mendoza",
    serviceType: "Reparación Correctiva",
    description: "Reparación del sistema de luces LED delanteras y traseras. Reemplazo de módulo de control de iluminación.",
    partsUsed: [
    { name: "Módulo LED Control", quantity: 1, cost: 2500.00 },
    { name: "Arnés de Cables", quantity: 2, cost: 450.00 },
    { name: "Fusibles 15A", quantity: 4, cost: 80.00 }],

    laborHours: 6.5,
    laborCost: 1950.00,
    totalCost: 4980.00,
    status: "completed",
    photos: [
    { url: "https://images.unsplash.com/photo-1636465459719-56759d59a488", alt: "Damaged LED headlight module showing burnt circuitry and melted plastic housing" },
    { url: "https://images.unsplash.com/photo-1638734255280-8bae834f8297", alt: "New LED control module installed in truck dashboard with connected wiring harness" }],

    notes: "Cliente reportó intermitencia en luces. Se encontró módulo dañado por sobrecarga. Reparación exitosa, sistema funcionando correctamente."
  },
  {
    id: 2,
    workOrderNumber: "WO-2024-001189",
    vehicleInfo: "Freightliner Cascadia - XYZ-789-F",
    serviceDate: "2024-09-15",
    completedDate: "2024-09-16",
    technician: "Borrego Mendoza",
    serviceType: "Mantenimiento Preventivo",
    description: "Mantenimiento preventivo del sistema eléctrico. Revisión de alternador, batería y sistema de carga.",
    partsUsed: [
    { name: "Batería 12V 100Ah", quantity: 2, cost: 3200.00 },
    { name: "Filtro de Aire", quantity: 1, cost: 280.00 }],

    laborHours: 4.0,
    laborCost: 1200.00,
    totalCost: 4680.00,
    status: "completed",
    photos: [
    { url: "https://images.unsplash.com/photo-1722318416549-c94efbdca2ab", alt: "Truck battery compartment with two new 12V batteries properly installed and secured" }],

    notes: "Mantenimiento programado completado. Baterías reemplazadas preventivamente. Sistema de carga funcionando óptimamente."
  },
  {
    id: 3,
    workOrderNumber: "WO-2024-001156",
    vehicleInfo: "Peterbilt 579 - DEF-456-G",
    serviceDate: "2024-08-22",
    completedDate: "2024-08-25",
    technician: "Flaco Mendoza",
    serviceType: "Diagnóstico",
    description: "Diagnóstico completo del sistema de frenos ABS. Identificación de falla en sensor de velocidad de rueda.",
    partsUsed: [
    { name: "Sensor ABS Rueda Delantera", quantity: 1, cost: 850.00 },
    { name: "Cable Sensor ABS", quantity: 1, cost: 320.00 }],

    laborHours: 8.0,
    laborCost: 2400.00,
    totalCost: 3570.00,
    status: "completed",
    photos: [
    { url: "https://images.unsplash.com/photo-1601895828728-0567aefe962e", alt: "ABS sensor diagnostic equipment connected to truck wheel hub showing error codes on display" },
    { url: "https://images.unsplash.com/photo-1638734255280-8bae834f8297", alt: "New ABS wheel speed sensor installed on truck front axle with clean wiring connection" }],

    notes: "Diagnóstico reveló sensor ABS defectuoso. Reemplazo realizado exitosamente. Sistema ABS funcionando correctamente después de calibración."
  }]
  );

  const [expandedRecord, setExpandedRecord] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterServiceType, setFilterServiceType] = useState('all');
  const [sortField, setSortField] = useState('serviceDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const statusOptions = [
  { value: 'all', label: 'Todos los Estados' },
  { value: 'completed', label: 'Completado' },
  { value: 'in-progress', label: 'En Progreso' },
  { value: 'pending', label: 'Pendiente' }];


  const serviceTypeOptions = [
  { value: 'all', label: 'Todos los Tipos' },
  { value: 'Mantenimiento Preventivo', label: 'Mantenimiento Preventivo' },
  { value: 'Reparación Correctiva', label: 'Reparación Correctiva' },
  { value: 'Diagnóstico', label: 'Diagnóstico' },
  { value: 'Instalación', label: 'Instalación' }];


  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in-progress':
        return 'bg-warning text-warning-foreground';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  const getServiceTypeIcon = (type) => {
    switch (type) {
      case 'Mantenimiento Preventivo':
        return 'Calendar';
      case 'Reparación Correctiva':
        return 'Wrench';
      case 'Diagnóstico':
        return 'Search';
      case 'Instalación':
        return 'Plus';
      default:
        return 'Tool';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredHistory = serviceHistory?.filter((record) =>
  (filterStatus === 'all' || record?.status === filterStatus) && (
  filterServiceType === 'all' || record?.serviceType === filterServiceType)
  )?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const toggleExpanded = (recordId) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const totalServiceValue = sortedAndFilteredHistory?.reduce((sum, record) => sum + record?.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-primary" />
            <div>
              <div className="text-2xl font-bold text-foreground">{sortedAndFilteredHistory?.length}</div>
              <div className="text-sm text-muted-foreground">Servicios Totales</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <div className="text-2xl font-bold text-foreground">
                {sortedAndFilteredHistory?.filter((r) => r?.status === 'completed')?.length}
              </div>
              <div className="text-sm text-muted-foreground">Completados</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={20} className="text-primary" />
            <div>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(totalServiceValue)}</div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-warning" />
            <div>
              <div className="text-2xl font-bold text-foreground">
                {sortedAndFilteredHistory?.reduce((sum, r) => sum + r?.laborHours, 0)}h
              </div>
              <div className="text-sm text-muted-foreground">Horas Trabajo</div>
            </div>
          </div>
        </div>
      </div>
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filtrar por estado"
            className="w-48" />

          
          <Select
            options={serviceTypeOptions}
            value={filterServiceType}
            onChange={setFilterServiceType}
            placeholder="Filtrar por tipo"
            className="w-48" />

        </div>
        
        <div className="text-sm text-muted-foreground">
          {sortedAndFilteredHistory?.length} registro(s) encontrado(s)
        </div>
      </div>
      {/* Service History List */}
      <div className="space-y-4">
        {sortedAndFilteredHistory?.map((record) =>
        <div key={record?.id} className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name={getServiceTypeIcon(record?.serviceType)} size={24} color="white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{record?.workOrderNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record?.status)}`}>
                        {getStatusLabel(record?.status)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{record?.vehicleInfo}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{formatCurrency(record?.totalCost)}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(record?.serviceDate)}</div>
                  </div>
                  
                  <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleExpanded(record?.id)}
                  iconName={expandedRecord === record?.id ? "ChevronUp" : "ChevronDown"} />

                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{record?.technician}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="Tag" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{record?.serviceType}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{record?.laborHours}h trabajo</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="Package" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{record?.partsUsed?.length} parte(s)</span>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRecord === record?.id &&
          <div className="border-t border-border p-6 bg-muted/20">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Descripción del Servicio</h4>
                    <p className="text-sm text-muted-foreground">{record?.description}</p>
                  </div>

                  {/* Parts Used */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Partes Utilizadas</h4>
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Parte</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground">Cantidad</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Costo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {record?.partsUsed?.map((part, index) =>
                      <tr key={index}>
                              <td className="px-4 py-2 text-sm text-foreground">{part?.name}</td>
                              <td className="px-4 py-2 text-sm text-center text-foreground">{part?.quantity}</td>
                              <td className="px-4 py-2 text-sm text-right text-foreground">{formatCurrency(part?.cost)}</td>
                            </tr>
                      )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Desglose de Costos</h4>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Mano de obra ({record?.laborHours}h)</span>
                          <span className="text-foreground">{formatCurrency(record?.laborCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Partes y materiales</span>
                          <span className="text-foreground">
                            {formatCurrency(record?.partsUsed?.reduce((sum, part) => sum + part?.cost, 0))}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2">
                          <div className="flex justify-between text-sm font-semibold">
                            <span className="text-foreground">Total</span>
                            <span className="text-foreground">{formatCurrency(record?.totalCost)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photos */}
                  {record?.photos && record?.photos?.length > 0 &&
              <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Evidencia Fotográfica</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {record?.photos?.map((photo, index) =>
                  <div key={index} className="relative group">
                            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                              <img
                        src={photo?.url}
                        alt={photo?.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />

                            </div>
                          </div>
                  )}
                      </div>
                    </div>
              }

                  {/* Notes */}
                  {record?.notes &&
              <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Notas del Técnico</h4>
                      <div className="bg-card border border-border rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{record?.notes}</p>
                      </div>
                    </div>
              }
                </div>
              </div>
          }
          </div>
        )}
      </div>
      {sortedAndFilteredHistory?.length === 0 &&
      <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay registros de servicio</h3>
          <p className="text-muted-foreground">
            {filterStatus === 'all' && filterServiceType === 'all' ? 'Este cliente no tiene historial de servicios.' : 'No hay registros que coincidan con los filtros seleccionados.'}
          </p>
        </div>
      }
    </div>);

};

export default ServiceHistoryTab;