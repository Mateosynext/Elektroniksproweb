import React, { useState, useEffect } from 'react';
import Icon from '../../components/appIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import WorkOrderCard from './components/WorkOrderCard';
import KanbanColumn from './components/KanbanColumn';
import FilterSidebar from './components/FilterSidebar';
import BulkOperationsToolbar from './components/BulkOperationsToolbar';
import WorkOrderDetailModal from './components/WorkOrderDetailModal';
import QuickStatsBar from './components/QuickStatsBar';

const WorkOrderManagementSystem = () => {
  const [viewMode, setViewMode] = useState('kanban'); // kanban, list, grid
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock user role - would come from auth context
  const userRole = 'admin'; // admin, director, technician

  // Mock filters state
  const [filters, setFilters] = useState({
    search: '',
    client: '',
    technician: '',
    priority: '',
    vehicleType: '',
    dateFrom: '',
    dateTo: '',
    statuses: ['Pendiente', 'En Progreso', 'Completado', 'Entregado'],
    showOverdue: false,
    showUnassigned: false
  });

  // Mock saved presets
  const [savedPresets] = useState([
  {
    name: 'Órdenes Urgentes',
    filters: { ...filters, priority: 'Alta', statuses: ['Pendiente', 'En Progreso'] }
  },
  {
    name: 'Sin Asignar',
    filters: { ...filters, showUnassigned: true }
  }]
  );

  // Mock work orders data
  const [workOrders] = useState([
  {
    id: 'WO-2024-001',
    clientName: 'Transportes Mendoza SA',
    vehicleType: 'Tractocamión',
    vehicleYear: '2022',
    vin: '1HGBH41JXMN109186',
    problemDescription: `El sistema de control electrónico del motor presenta fallas intermitentes.\nSe detectan códigos de error P0201 y P0202 relacionados con inyectores.\nEl vehículo pierde potencia durante la aceleración y presenta consumo elevado de combustible.`,
    status: 'Pendiente',
    priority: 'Alta',
    createdDate: new Date('2024-10-13'),
    estimatedCompletion: new Date('2024-10-17'),
    estimatedCost: 25000,
    assignedTechnician: null,
    progress: 0,
    hasPhotos: false,
    hasNotes: true,
    partsOrdered: false
  },
  {
    id: 'WO-2024-002',
    clientName: 'Logística Norte SRL',
    vehicleType: 'Camión',
    vehicleYear: '2021',
    vin: '2HGBH41JXMN109187',
    problemDescription: `Falla en el sistema de frenos ABS.\nLa luz de advertencia permanece encendida y se escuchan ruidos extraños al frenar.\nSe requiere diagnóstico completo del sistema electrónico de frenos.`,
    status: 'En Progreso',
    priority: 'Alta',
    createdDate: new Date('2024-10-12'),
    estimatedCompletion: new Date('2024-10-16'),
    estimatedCost: 18500,
    assignedTechnician: {
      id: 'flaco-mendoza',
      name: 'Flaco Mendoza',
      avatar: "https://images.unsplash.com/photo-1687819411272-34c61017cf8e",
      avatarAlt: 'Professional headshot of Hispanic technician with short dark hair wearing blue work shirt'
    },
    progress: 65,
    hasPhotos: true,
    hasNotes: true,
    partsOrdered: true
  },
  {
    id: 'WO-2024-003',
    clientName: 'Fletes Express SA',
    vehicleType: 'Semirremolque',
    vehicleYear: '2020',
    vin: '3HGBH41JXMN109188',
    problemDescription: `Sistema de iluminación LED defectuoso.\nVarias luces traseras no funcionan correctamente.\nProblemas con el cableado del sistema de luces de freno y direccionales.`,
    status: 'Completado',
    priority: 'Media',
    createdDate: new Date('2024-10-10'),
    estimatedCompletion: new Date('2024-10-14'),
    estimatedCost: 8500,
    assignedTechnician: {
      id: 'borrego-mendoza',
      name: 'Borrego Mendoza',
      avatar: "https://images.unsplash.com/photo-1669642550301-bbba2d5f09c8",
      avatarAlt: 'Professional headshot of middle-aged Hispanic technician with mustache wearing navy work uniform'
    },
    progress: 100,
    hasPhotos: true,
    hasNotes: false,
    partsOrdered: true
  },
  {
    id: 'WO-2024-004',
    clientName: 'Carga Pesada Ltda',
    vehicleType: 'Tractocamión',
    vehicleYear: '2023',
    vin: '4HGBH41JXMN109189',
    problemDescription: `Actualización de software del sistema de gestión del motor.\nInstalación de nuevos módulos de control para mejorar eficiencia.\nCalibración de sensores después de la actualización.`,
    status: 'Entregado',
    priority: 'Baja',
    createdDate: new Date('2024-10-08'),
    estimatedCompletion: new Date('2024-10-12'),
    estimatedCost: 12000,
    assignedTechnician: {
      id: 'carlos-rodriguez',
      name: 'Carlos Rodríguez',
      avatar: "https://images.unsplash.com/photo-1622612017516-54223966d2cd",
      avatarAlt: 'Professional headshot of young Hispanic technician with short black hair wearing orange safety vest'
    },
    progress: 100,
    hasPhotos: false,
    hasNotes: true,
    partsOrdered: false
  },
  {
    id: 'WO-2024-005',
    clientName: 'Transportes Mendoza SA',
    vehicleType: 'Remolque',
    vehicleYear: '2019',
    vin: '5HGBH41JXMN109190',
    problemDescription: `Reparación del sistema de suspensión neumática electrónica.\nFallas en los sensores de altura y válvulas de control.\nEl sistema no mantiene la altura correcta durante la carga.`,
    status: 'En Progreso',
    priority: 'Media',
    createdDate: new Date('2024-10-11'),
    estimatedCompletion: new Date('2024-10-18'),
    estimatedCost: 22000,
    assignedTechnician: {
      id: 'miguel-santos',
      name: 'Miguel Santos',
      avatar: "https://images.unsplash.com/photo-1690902903056-84281187030f",
      avatarAlt: 'Professional headshot of experienced Hispanic technician with gray hair wearing blue work shirt'
    },
    progress: 30,
    hasPhotos: true,
    hasNotes: true,
    partsOrdered: true
  },
  {
    id: 'WO-2024-006',
    clientName: 'Logística Norte SRL',
    vehicleType: 'Camión',
    vehicleYear: '2022',
    vin: '6HGBH41JXMN109191',
    problemDescription: `Instalación de sistema de monitoreo GPS avanzado.\nConfiguración de alertas de mantenimiento preventivo.\nIntegración con sistema de gestión de flotas del cliente.`,
    status: 'Pendiente',
    priority: 'Baja',
    createdDate: new Date('2024-10-14'),
    estimatedCompletion: new Date('2024-10-20'),
    estimatedCost: 15000,
    assignedTechnician: null,
    progress: 0,
    hasPhotos: false,
    hasNotes: false,
    partsOrdered: false
  }]
  );

  // Calculate stats
  const stats = {
    pending: workOrders?.filter((wo) => wo?.status === 'Pendiente')?.length,
    inProgress: workOrders?.filter((wo) => wo?.status === 'En Progreso')?.length,
    completed: workOrders?.filter((wo) => wo?.status === 'Completado')?.length,
    delivered: workOrders?.filter((wo) => wo?.status === 'Entregado')?.length,
    overdue: workOrders?.filter((wo) =>
    wo?.estimatedCompletion &&
    new Date(wo.estimatedCompletion) < new Date() &&
    wo?.status !== 'Completado' &&
    wo?.status !== 'Entregado'
    )?.length,
    unassigned: workOrders?.filter((wo) => !wo?.assignedTechnician)?.length,
    avgCompletionTime: 48 // Mock average completion time in hours
  };

  // Filter and sort work orders
  const getFilteredWorkOrders = () => {
    let filtered = workOrders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter((wo) =>
      wo?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      wo?.clientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      wo?.vin?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      wo?.problemDescription?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply other filters
    if (filters?.client) {
      filtered = filtered?.filter((wo) => wo?.clientName?.includes(filters?.client));
    }

    if (filters?.technician) {
      filtered = filtered?.filter((wo) =>
      wo?.assignedTechnician?.id === filters?.technician
      );
    }

    if (filters?.priority) {
      filtered = filtered?.filter((wo) => wo?.priority === filters?.priority);
    }

    if (filters?.vehicleType) {
      filtered = filtered?.filter((wo) => wo?.vehicleType === filters?.vehicleType);
    }

    if (filters?.statuses?.length > 0) {
      filtered = filtered?.filter((wo) => filters?.statuses?.includes(wo?.status));
    }

    if (filters?.showOverdue) {
      filtered = filtered?.filter((wo) =>
      wo?.estimatedCompletion &&
      new Date(wo.estimatedCompletion) < new Date() &&
      wo?.status !== 'Completado' &&
      wo?.status !== 'Entregado'
      );
    }

    if (filters?.showUnassigned) {
      filtered = filtered?.filter((wo) => !wo?.assignedTechnician);
    }

    // Apply date filters
    if (filters?.dateFrom) {
      filtered = filtered?.filter((wo) =>
      new Date(wo.createdDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter((wo) =>
      new Date(wo.createdDate) <= new Date(filters.dateTo)
      );
    }

    // Sort
    filtered?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === 'createdDate' || sortBy === 'estimatedCompletion') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredWorkOrders = getFilteredWorkOrders();

  // Group work orders by status for kanban view
  const groupedWorkOrders = {
    'Pendiente': filteredWorkOrders?.filter((wo) => wo?.status === 'Pendiente'),
    'En Progreso': filteredWorkOrders?.filter((wo) => wo?.status === 'En Progreso'),
    'Completado': filteredWorkOrders?.filter((wo) => wo?.status === 'Completado'),
    'Entregado': filteredWorkOrders?.filter((wo) => wo?.status === 'Entregado')
  };

  // View mode options
  const viewModeOptions = [
  { value: 'kanban', label: 'Kanban' },
  { value: 'list', label: 'Lista' },
  { value: 'grid', label: 'Cuadrícula' }];


  // Sort options
  const sortOptions = [
  { value: 'createdDate', label: 'Fecha de Creación' },
  { value: 'estimatedCompletion', label: 'Fecha Estimada' },
  { value: 'priority', label: 'Prioridad' },
  { value: 'clientName', label: 'Cliente' }];


  // Event handlers
  const handleStatusChange = (workOrderId, newStatus) => {
    console.log(`Changing status of ${workOrderId} to ${newStatus}`);
    // Update work order status logic here
  };

  const handleAssignTechnician = (workOrder) => {
    console.log('Assigning technician to:', workOrder?.id);
    // Open technician assignment modal
  };

  const handleViewDetails = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setIsDetailModalOpen(true);
  };

  const handleBulkStatusUpdate = (orderIds, newStatus) => {
    console.log('Bulk status update:', orderIds, newStatus);
    setSelectedOrders([]);
  };

  const handleBulkTechnicianAssign = (orderIds, technicianId) => {
    console.log('Bulk technician assign:', orderIds, technicianId);
    setSelectedOrders([]);
  };

  const handleBulkPriorityUpdate = (orderIds, newPriority) => {
    console.log('Bulk priority update:', orderIds, newPriority);
    setSelectedOrders([]);
  };

  const handleBulkExport = (orderIds) => {
    console.log('Bulk export:', orderIds);
    setSelectedOrders([]);
  };

  const handleSavePreset = (name, filterData) => {
    console.log('Saving preset:', name, filterData);
    // Save preset logic here
  };

  const handleDragDrop = (workOrderId, newStatus) => {
    console.log(`Moving work order ${workOrderId} to ${newStatus}`);
    handleStatusChange(workOrderId, newStatus);
  };

  const handleOrderSelection = (orderId, isSelected) => {
    if (isSelected) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders?.filter((id) => id !== orderId));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 'f':
            e?.preventDefault();
            setIsFilterSidebarOpen(!isFilterSidebarOpen);
            break;
          case 'n':
            e?.preventDefault();
            console.log('New work order shortcut');
            break;
          default:
            break;
        }
      }

      // Number keys for status changes (when work order is selected)
      if (selectedWorkOrder && !isDetailModalOpen) {
        switch (e?.key) {
          case '1':handleStatusChange(selectedWorkOrder?.id, 'Pendiente');
            break;
          case '2':handleStatusChange(selectedWorkOrder?.id, 'En Progreso');
            break;
          case '3':handleStatusChange(selectedWorkOrder?.id, 'Completado');
            break;
          case '4':handleStatusChange(selectedWorkOrder?.id, 'Entregado');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFilterSidebarOpen, selectedWorkOrder, isDetailModalOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="ClipboardList" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Sistema de Gestión de Órdenes de Trabajo
                </h1>
                <p className="text-muted-foreground">
                  Centraliza el seguimiento de reparaciones con asignación de técnicos y monitoreo de progreso
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                iconName="Filter">

                Filtros
              </Button>
              <Button
                variant="default"
                iconName="Plus">

                Nueva Orden
              </Button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Input
                  type="search"
                  placeholder="Buscar por ID, cliente, VIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)} />

              </div>
              
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="w-48" />

              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 hover:bg-accent rounded-lg transition-colors duration-150"
                title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}>

                <Icon
                  name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                  size={18} />

              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Select
                options={viewModeOptions}
                value={viewMode}
                onChange={setViewMode}
                className="w-32" />

              
              <div className="flex items-center bg-muted rounded-lg p-1">
                {viewModeOptions?.map((mode) =>
                <button
                  key={mode?.value}
                  onClick={() => setViewMode(mode?.value)}
                  className={`p-2 rounded transition-colors duration-150 ${
                  viewMode === mode?.value ?
                  'bg-primary text-primary-foreground' :
                  'text-muted-foreground hover:text-foreground'}`
                  }>

                    <Icon
                    name={
                    mode?.value === 'kanban' ? 'Columns' :
                    mode?.value === 'list' ? 'List' : 'Grid3x3'
                    }
                    size={16} />

                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex">
        {/* Content Area */}
        <div className={`flex-1 transition-all duration-300 ${isFilterSidebarOpen ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Quick Stats */}
            <QuickStatsBar stats={stats} userRole={userRole} />

            {/* Work Orders Display */}
            {viewMode === 'kanban' &&
            <div className="flex space-x-6 overflow-x-auto pb-6">
                {Object.entries(groupedWorkOrders)?.map(([status, orders]) =>
              <KanbanColumn
                key={status}
                title={status}
                status={status}
                workOrders={orders}
                onStatusChange={handleStatusChange}
                onAssignTechnician={handleAssignTechnician}
                onViewDetails={handleViewDetails}
                userRole={userRole}
                onDrop={handleDragDrop}
                onDragOver={() => {}} />

              )}
              </div>
            }

            {viewMode === 'list' &&
            <div className="space-y-4">
                {filteredWorkOrders?.map((workOrder) =>
              <div key={workOrder?.id} className="flex items-center space-x-4">
                    <input
                  type="checkbox"
                  checked={selectedOrders?.includes(workOrder?.id)}
                  onChange={(e) => handleOrderSelection(workOrder?.id, e?.target?.checked)}
                  className="w-4 h-4" />

                    <div className="flex-1">
                      <WorkOrderCard
                    workOrder={workOrder}
                    onStatusChange={handleStatusChange}
                    onAssignTechnician={handleAssignTechnician}
                    onViewDetails={handleViewDetails}
                    userRole={userRole} />

                    </div>
                  </div>
              )}
              </div>
            }

            {viewMode === 'grid' &&
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWorkOrders?.map((workOrder) =>
              <div key={workOrder?.id} className="relative">
                    <input
                  type="checkbox"
                  checked={selectedOrders?.includes(workOrder?.id)}
                  onChange={(e) => handleOrderSelection(workOrder?.id, e?.target?.checked)}
                  className="absolute top-2 left-2 w-4 h-4 z-10" />

                    <WorkOrderCard
                  workOrder={workOrder}
                  onStatusChange={handleStatusChange}
                  onAssignTechnician={handleAssignTechnician}
                  onViewDetails={handleViewDetails}
                  userRole={userRole} />

                  </div>
              )}
              </div>
            }

            {/* Empty State */}
            {filteredWorkOrders?.length === 0 &&
            <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="ClipboardList" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No se encontraron órdenes de trabajo
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ajusta los filtros o crea una nueva orden de trabajo
                </p>
                <Button variant="default" iconName="Plus">
                  Nueva Orden de Trabajo
                </Button>
              </div>
            }
          </div>
        </div>

        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
          onSavePreset={handleSavePreset}
          savedPresets={savedPresets} />

      </div>
      {/* Bulk Operations Toolbar */}
      <BulkOperationsToolbar
        selectedOrders={selectedOrders}
        onClearSelection={() => setSelectedOrders([])}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkTechnicianAssign={handleBulkTechnicianAssign}
        onBulkPriorityUpdate={handleBulkPriorityUpdate}
        onBulkExport={handleBulkExport} />

      {/* Work Order Detail Modal */}
      <WorkOrderDetailModal
        workOrder={selectedWorkOrder}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedWorkOrder(null);
        }}
        onUpdate={(id, updates) => {
          console.log('Updating work order:', id, updates);
          setIsDetailModalOpen(false);
          setSelectedWorkOrder(null);
        }}
        userRole={userRole} />

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 left-4 text-xs text-muted-foreground bg-card border border-border rounded-lg p-2">
        <div className="space-y-1">
          <div>Ctrl+F: Filtros</div>
          <div>Ctrl+N: Nueva orden</div>
          <div>1-4: Cambiar estado</div>
        </div>
      </div>
    </div>);

};

export default WorkOrderManagementSystem;