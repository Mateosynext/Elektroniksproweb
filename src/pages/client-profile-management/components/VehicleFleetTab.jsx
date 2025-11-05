import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const VehicleFleetTab = ({ clientId, canEdit }) => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      vin: "3AKJHHDR5JSKG2847",
      brand: "Kenworth",
      model: "T680",
      year: 2023,
      plateNumber: "ABC-123-D",
      engineType: "PACCAR MX-13",
      mileage: 125000,
      lastService: "2024-09-15",
      nextService: "2024-12-15",
      status: "active",
      notes: "Vehículo en excelente estado, mantenimiento preventivo al día"
    },
    {
      id: 2,
      vin: "1FUJGHDV8DLBF4829",
      brand: "Freightliner",
      model: "Cascadia",
      year: 2022,
      plateNumber: "XYZ-789-F",
      engineType: "Detroit DD15",
      mileage: 89000,
      lastService: "2024-08-20",
      nextService: "2024-11-20",
      status: "maintenance",
      notes: "Requiere revisión del sistema eléctrico"
    },
    {
      id: 3,
      vin: "1XKAD49X0FJ123456",
      brand: "Peterbilt",
      model: "579",
      year: 2021,
      plateNumber: "DEF-456-G",
      engineType: "Cummins X15",
      mileage: 156000,
      lastService: "2024-07-10",
      nextService: "2024-10-10",
      status: "inactive",
      notes: "Fuera de servicio por reparación mayor"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [sortField, setSortField] = useState('brand');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newVehicle, setNewVehicle] = useState({
    vin: '',
    brand: '',
    model: '',
    year: new Date()?.getFullYear(),
    plateNumber: '',
    engineType: '',
    mileage: '',
    notes: ''
  });

  const brandOptions = [
    { value: 'kenworth', label: 'Kenworth' },
    { value: 'freightliner', label: 'Freightliner' },
    { value: 'peterbilt', label: 'Peterbilt' },
    { value: 'volvo', label: 'Volvo' },
    { value: 'mack', label: 'Mack' },
    { value: 'international', label: 'International' },
    { value: 'western-star', label: 'Western Star' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'active', label: 'Activo' },
    { value: 'maintenance', label: 'En Mantenimiento' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'maintenance':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'maintenance':
        return 'En Mantenimiento';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
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

  const sortedAndFilteredVehicles = vehicles?.filter(vehicle => filterStatus === 'all' || vehicle?.status === filterStatus)?.sort((a, b) => {
      const aValue = a?.[sortField];
      const bValue = b?.[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleAddVehicle = () => {
    const vehicle = {
      id: vehicles?.length + 1,
      ...newVehicle,
      status: 'active',
      lastService: new Date()?.toISOString()?.split('T')?.[0],
      nextService: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0]
    };
    
    setVehicles([...vehicles, vehicle]);
    setNewVehicle({
      vin: '',
      brand: '',
      model: '',
      year: new Date()?.getFullYear(),
      plateNumber: '',
      engineType: '',
      mileage: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle(vehicle);
    setShowAddForm(true);
  };

  const handleUpdateVehicle = () => {
    setVehicles(vehicles?.map(v => v?.id === editingVehicle?.id ? { ...newVehicle, id: editingVehicle?.id } : v));
    setEditingVehicle(null);
    setNewVehicle({
      vin: '',
      brand: '',
      model: '',
      year: new Date()?.getFullYear(),
      plateNumber: '',
      engineType: '',
      mileage: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteVehicle = (vehicleId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este vehículo?')) {
      setVehicles(vehicles?.filter(v => v?.id !== vehicleId));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filtrar por estado"
            className="w-48"
          />
          
          <div className="text-sm text-muted-foreground">
            {sortedAndFilteredVehicles?.length} vehículo(s) encontrado(s)
          </div>
        </div>
        
        {canEdit && (
          <Button
            variant="default"
            onClick={() => setShowAddForm(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Agregar Vehículo
          </Button>
        )}
      </div>
      {/* Add/Edit Vehicle Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {editingVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowAddForm(false);
                setEditingVehicle(null);
                setNewVehicle({
                  vin: '',
                  brand: '',
                  model: '',
                  year: new Date()?.getFullYear(),
                  plateNumber: '',
                  engineType: '',
                  mileage: '',
                  notes: ''
                });
              }}
              iconName="X"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="VIN"
              type="text"
              value={newVehicle?.vin}
              onChange={(e) => setNewVehicle({...newVehicle, vin: e?.target?.value})}
              placeholder="Número de identificación vehicular"
              required
            />
            
            <Select
              label="Marca"
              options={brandOptions}
              value={newVehicle?.brand}
              onChange={(value) => setNewVehicle({...newVehicle, brand: value})}
              searchable
              required
            />
            
            <Input
              label="Modelo"
              type="text"
              value={newVehicle?.model}
              onChange={(e) => setNewVehicle({...newVehicle, model: e?.target?.value})}
              placeholder="Modelo del vehículo"
              required
            />
            
            <Input
              label="Año"
              type="number"
              value={newVehicle?.year}
              onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e?.target?.value)})}
              min="1990"
              max={new Date()?.getFullYear() + 1}
              required
            />
            
            <Input
              label="Placas"
              type="text"
              value={newVehicle?.plateNumber}
              onChange={(e) => setNewVehicle({...newVehicle, plateNumber: e?.target?.value})}
              placeholder="ABC-123-D"
              required
            />
            
            <Input
              label="Tipo de Motor"
              type="text"
              value={newVehicle?.engineType}
              onChange={(e) => setNewVehicle({...newVehicle, engineType: e?.target?.value})}
              placeholder="PACCAR MX-13, Detroit DD15, etc."
            />
            
            <Input
              label="Kilometraje"
              type="number"
              value={newVehicle?.mileage}
              onChange={(e) => setNewVehicle({...newVehicle, mileage: parseInt(e?.target?.value)})}
              placeholder="125000"
            />
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Notas
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              value={newVehicle?.notes}
              onChange={(e) => setNewVehicle({...newVehicle, notes: e?.target?.value})}
              placeholder="Información adicional sobre el vehículo"
            />
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setEditingVehicle(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
              iconName="Save"
              iconPosition="left"
            >
              {editingVehicle ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </div>
      )}
      {/* Vehicles Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('brand')}
                    className="flex items-center space-x-1 hover:text-foreground"
                  >
                    <span>Vehículo</span>
                    <Icon name="ArrowUpDown" size={12} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('vin')}
                    className="flex items-center space-x-1 hover:text-foreground"
                  >
                    <span>VIN</span>
                    <Icon name="ArrowUpDown" size={12} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('plateNumber')}
                    className="flex items-center space-x-1 hover:text-foreground"
                  >
                    <span>Placas</span>
                    <Icon name="ArrowUpDown" size={12} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('mileage')}
                    className="flex items-center space-x-1 hover:text-foreground"
                  >
                    <span>Kilometraje</span>
                    <Icon name="ArrowUpDown" size={12} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-foreground"
                  >
                    <span>Estado</span>
                    <Icon name="ArrowUpDown" size={12} />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Próximo Servicio
                </th>
                {canEdit && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedAndFilteredVehicles?.map((vehicle) => (
                <tr key={vehicle?.id} className="hover:bg-accent">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                        <Icon name="Truck" size={20} color="white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {vehicle?.brand} {vehicle?.model}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {vehicle?.year} • {vehicle?.engineType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-foreground">{vehicle?.vin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{vehicle?.plateNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {vehicle?.mileage?.toLocaleString('es-MX')} km
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle?.status)}`}>
                      {getStatusLabel(vehicle?.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{formatDate(vehicle?.nextService)}</div>
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditVehicle(vehicle)}
                          iconName="Edit"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVehicle(vehicle?.id)}
                          iconName="Trash2"
                          className="text-error hover:text-error"
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedAndFilteredVehicles?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Truck" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No hay vehículos</h3>
            <p className="text-muted-foreground">
              {filterStatus === 'all' ?'Este cliente no tiene vehículos registrados.' 
                : `No hay vehículos con estado "${getStatusLabel(filterStatus)}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleFleetTab;