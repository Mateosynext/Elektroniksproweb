import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Image from '../../../components/appImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const WorkOrderDetailModal = ({ workOrder, isOpen, onClose, onUpdate, userRole }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState(workOrder?.status || '');

  if (!isOpen || !workOrder) return null;

  const statusOptions = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'En Progreso', label: 'En Progreso' },
  { value: 'Completado', label: 'Completado' },
  { value: 'Entregado', label: 'Entregado' }];


  const technicianOptions = [
  { value: '', label: 'Sin asignar' },
  { value: 'flaco-mendoza', label: 'Flaco Mendoza' },
  { value: 'borrego-mendoza', label: 'Borrego Mendoza' },
  { value: 'carlos-rodriguez', label: 'Carlos Rodríguez' },
  { value: 'miguel-santos', label: 'Miguel Santos' }];


  const priorityOptions = [
  { value: 'Baja', label: 'Baja' },
  { value: 'Media', label: 'Media' },
  { value: 'Alta', label: 'Alta' }];


  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta':
        return 'bg-error text-error-foreground';
      case 'Media':
        return 'bg-warning text-warning-foreground';
      case 'Baja':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-warning text-warning-foreground';
      case 'En Progreso':
        return 'bg-primary text-primary-foreground';
      case 'Completado':
        return 'bg-success text-success-foreground';
      case 'Entregado':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const tabs = [
  { id: 'details', label: 'Detalles', icon: 'FileText' },
  { id: 'parts', label: 'Partes', icon: 'Package' },
  { id: 'photos', label: 'Fotos', icon: 'Camera' },
  { id: 'history', label: 'Historial', icon: 'Clock' }];


  const mockParts = [
  {
    id: 1,
    name: "Módulo de Control ECU",
    code: "ECU-001",
    quantity: 1,
    unitCost: 15000,
    status: "Instalado"
  },
  {
    id: 2,
    name: "Sensor de Temperatura",
    code: "TEMP-205",
    quantity: 2,
    unitCost: 850,
    status: "Pendiente"
  }];


  const mockPhotos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1682933370002-e1860d4fadb5",
    alt: "Damaged electronic control unit showing burnt circuits and melted components",
    description: "Daño inicial en ECU",
    timestamp: new Date(Date.now() - 86400000)
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1614898929027-04c0152069d1",
    alt: "Technician hands installing new electronic module in truck dashboard",
    description: "Instalación de nuevo módulo",
    timestamp: new Date(Date.now() - 43200000)
  }];


  const mockHistory = [
  {
    id: 1,
    action: "Orden creada",
    user: "Sistema",
    timestamp: new Date(Date.now() - 172800000),
    details: "Orden de trabajo creada automáticamente"
  },
  {
    id: 2,
    action: "Técnico asignado",
    user: "Admin",
    timestamp: new Date(Date.now() - 86400000),
    details: "Flaco Mendoza asignado a la orden"
  },
  {
    id: 3,
    action: "Estado actualizado",
    user: "Flaco Mendoza",
    timestamp: new Date(Date.now() - 43200000),
    details: "Estado cambiado a 'En Progreso'"
  }];


  const handleSaveNotes = () => {
    // Handle save notes logic
    console.log('Saving notes:', notes);
    setNotes('');
  };

  const handleStatusUpdate = () => {
    onUpdate(workOrder?.id, { status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}>
      </div>
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-2 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Wrench" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">
                Orden #{workOrder?.id}
              </h2>
              <p className="text-muted-foreground">
                {workOrder?.clientName} • {workOrder?.vehicleType} {workOrder?.vehicleYear}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(workOrder?.priority)}`}>
              {workOrder?.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workOrder?.status)}`}>
              {workOrder?.status}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors duration-150">

              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) =>
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors duration-150 ${
            activeTab === tab?.id ?
            'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-card-foreground'}`
            }>

              <Icon name={tab?.icon} size={18} />
              <span>{tab?.label}</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' &&
          <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">Información del Vehículo</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">VIN</label>
                      <p className="font-mono text-card-foreground">{workOrder?.vin}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Tipo</label>
                      <p className="text-card-foreground">{workOrder?.vehicleType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Año</label>
                      <p className="text-card-foreground">{workOrder?.vehicleYear}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-card-foreground">Detalles de la Orden</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Fecha de Creación</label>
                      <p className="text-card-foreground">{formatDate(workOrder?.createdDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Estimación de Completado</label>
                      <p className="text-card-foreground">
                        {workOrder?.estimatedCompletion ? formatDate(workOrder?.estimatedCompletion) : 'No definida'}
                      </p>
                    </div>
                    {userRole === 'director' &&
                  <div>
                        <label className="text-sm text-muted-foreground">Costo Estimado</label>
                        <p className="text-card-foreground font-semibold">
                          {formatCurrency(workOrder?.estimatedCost)}
                        </p>
                      </div>
                  }
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <h3 className="font-semibold text-card-foreground mb-3">Descripción del Problema</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-card-foreground">{workOrder?.problemDescription}</p>
                </div>
              </div>

              {/* Technician Assignment */}
              <div>
                <h3 className="font-semibold text-card-foreground mb-3">Técnico Asignado</h3>
                {workOrder?.assignedTechnician ?
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                    <Image
                  src={workOrder?.assignedTechnician?.avatar}
                  alt={workOrder?.assignedTechnician?.avatarAlt}
                  className="w-12 h-12 rounded-full object-cover" />

                    <div>
                      <p className="font-medium text-card-foreground">
                        {workOrder?.assignedTechnician?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Técnico Especializado
                      </p>
                    </div>
                  </div> :

              <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-muted-foreground">Sin técnico asignado</p>
                  </div>
              }
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Select
                label="Cambiar Estado"
                options={statusOptions}
                value={newStatus}
                onChange={setNewStatus} />

                <div className="flex items-end">
                  <Button
                  variant="default"
                  onClick={handleStatusUpdate}
                  disabled={newStatus === workOrder?.status}
                  fullWidth
                  iconName="Save">

                    Actualizar Estado
                  </Button>
                </div>
              </div>
            </div>
          }

          {activeTab === 'parts' &&
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground">Partes Utilizadas</h3>
                <Button variant="outline" iconName="Plus">
                  Agregar Parte
                </Button>
              </div>
              
              <div className="space-y-3">
                {mockParts?.map((part) =>
              <div key={part?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-card-foreground">{part?.name}</h4>
                      <p className="text-sm text-muted-foreground">Código: {part?.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-card-foreground">
                        {part?.quantity} x {formatCurrency(part?.unitCost)}
                      </p>
                      <p className="text-sm text-muted-foreground">{part?.status}</p>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {activeTab === 'photos' &&
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground">Evidencia Fotográfica</h3>
                <Button variant="outline" iconName="Camera">
                  Subir Foto
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPhotos?.map((photo) =>
              <div key={photo?.id} className="bg-muted rounded-lg overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <Image
                    src={photo?.url}
                    alt={photo?.alt}
                    className="w-full h-full object-cover" />

                    </div>
                    <div className="p-3">
                      <p className="font-medium text-card-foreground text-sm">{photo?.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(photo?.timestamp)}</p>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {activeTab === 'history' &&
          <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">Historial de Actividad</h3>
              
              <div className="space-y-3">
                {mockHistory?.map((entry) =>
              <div key={entry?.id} className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-card-foreground">{entry?.action}</h4>
                        <span className="text-xs text-muted-foreground">{formatDate(entry?.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry?.details}</p>
                      <p className="text-xs text-muted-foreground">Por: {entry?.user}</p>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Agregar nota..."
              value={notes}
              onChange={(e) => setNotes(e?.target?.value)}
              className="w-80" />

            <Button
              variant="outline"
              onClick={handleSaveNotes}
              disabled={!notes?.trim()}
              iconName="MessageSquare">

              Agregar Nota
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="default" iconName="Save">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>);

};

export default WorkOrderDetailModal;