import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ClientDetailsTab = ({ client, onSave, canEdit }) => {
  const [formData, setFormData] = useState({
    companyName: client?.companyName || '',
    rfc: client?.rfc || '',
    contactPerson: client?.contactPerson || '',
    position: client?.position || '',
    phone: client?.phone || '',
    email: client?.email || '',
    website: client?.website || '',
    address: client?.address || '',
    city: client?.city || '',
    state: client?.state || '',
    postalCode: client?.postalCode || '',
    country: client?.country || 'México',
    billingAddress: client?.billingAddress || '',
    billingCity: client?.billingCity || '',
    billingState: client?.billingState || '',
    billingPostalCode: client?.billingPostalCode || '',
    paymentTerms: client?.paymentTerms || '30',
    creditLimit: client?.creditLimit || '',
    preferredContact: client?.preferredContact || 'email',
    notes: client?.notes || ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const stateOptions = [
    { value: 'aguascalientes', label: 'Aguascalientes' },
    { value: 'baja-california', label: 'Baja California' },
    { value: 'baja-california-sur', label: 'Baja California Sur' },
    { value: 'campeche', label: 'Campeche' },
    { value: 'chiapas', label: 'Chiapas' },
    { value: 'chihuahua', label: 'Chihuahua' },
    { value: 'coahuila', label: 'Coahuila' },
    { value: 'colima', label: 'Colima' },
    { value: 'durango', label: 'Durango' },
    { value: 'guanajuato', label: 'Guanajuato' },
    { value: 'guerrero', label: 'Guerrero' },
    { value: 'hidalgo', label: 'Hidalgo' },
    { value: 'jalisco', label: 'Jalisco' },
    { value: 'mexico', label: 'Estado de México' },
    { value: 'michoacan', label: 'Michoacán' },
    { value: 'morelos', label: 'Morelos' },
    { value: 'nayarit', label: 'Nayarit' },
    { value: 'nuevo-leon', label: 'Nuevo León' },
    { value: 'oaxaca', label: 'Oaxaca' },
    { value: 'puebla', label: 'Puebla' },
    { value: 'queretaro', label: 'Querétaro' },
    { value: 'quintana-roo', label: 'Quintana Roo' },
    { value: 'san-luis-potosi', label: 'San Luis Potosí' },
    { value: 'sinaloa', label: 'Sinaloa' },
    { value: 'sonora', label: 'Sonora' },
    { value: 'tabasco', label: 'Tabasco' },
    { value: 'tamaulipas', label: 'Tamaulipas' },
    { value: 'tlaxcala', label: 'Tlaxcala' },
    { value: 'veracruz', label: 'Veracruz' },
    { value: 'yucatan', label: 'Yucatán' },
    { value: 'zacatecas', label: 'Zacatecas' }
  ];

  const paymentTermsOptions = [
    { value: '15', label: '15 días' },
    { value: '30', label: '30 días' },
    { value: '45', label: '45 días' },
    { value: '60', label: '60 días' },
    { value: '90', label: '90 días' },
    { value: 'immediate', label: 'Inmediato' }
  ];

  const contactPreferenceOptions = [
    { value: 'email', label: 'Correo electrónico' },
    { value: 'phone', label: 'Teléfono' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      companyName: client?.companyName || '',
      rfc: client?.rfc || '',
      contactPerson: client?.contactPerson || '',
      position: client?.position || '',
      phone: client?.phone || '',
      email: client?.email || '',
      website: client?.website || '',
      address: client?.address || '',
      city: client?.city || '',
      state: client?.state || '',
      postalCode: client?.postalCode || '',
      country: client?.country || 'México',
      billingAddress: client?.billingAddress || '',
      billingCity: client?.billingCity || '',
      billingState: client?.billingState || '',
      billingPostalCode: client?.billingPostalCode || '',
      paymentTerms: client?.paymentTerms || '30',
      creditLimit: client?.creditLimit || '',
      preferredContact: client?.preferredContact || 'email',
      notes: client?.notes || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      {canEdit && (
        <div className="flex justify-end space-x-2">
          {!isEditing ? (
            <Button
              variant="default"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
            >
              Editar Información
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                iconName="X"
                iconPosition="left"
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                iconName="Save"
                iconPosition="left"
              >
                Guardar Cambios
              </Button>
            </>
          )}
        </div>
      )}
      {/* Company Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Building2" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Información de la Empresa</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre de la Empresa"
            type="text"
            value={formData?.companyName}
            onChange={(e) => handleInputChange('companyName', e?.target?.value)}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="RFC"
            type="text"
            value={formData?.rfc}
            onChange={(e) => handleInputChange('rfc', e?.target?.value)}
            disabled={!isEditing}
            placeholder="XAXX010101000"
          />
          
          <Input
            label="Sitio Web"
            type="url"
            value={formData?.website}
            onChange={(e) => handleInputChange('website', e?.target?.value)}
            disabled={!isEditing}
            placeholder="https://www.empresa.com"
          />
          
          <Select
            label="Términos de Pago"
            options={paymentTermsOptions}
            value={formData?.paymentTerms}
            onChange={(value) => handleInputChange('paymentTerms', value)}
            disabled={!isEditing}
          />
          
          <Input
            label="Límite de Crédito (MXN)"
            type="number"
            value={formData?.creditLimit}
            onChange={(e) => handleInputChange('creditLimit', e?.target?.value)}
            disabled={!isEditing}
            placeholder="50000.00"
          />
        </div>
      </div>
      {/* Contact Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="User" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Información de Contacto</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Persona de Contacto"
            type="text"
            value={formData?.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="Cargo/Posición"
            type="text"
            value={formData?.position}
            onChange={(e) => handleInputChange('position', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Gerente de Mantenimiento"
          />
          
          <Input
            label="Teléfono"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            disabled={!isEditing}
            required
            placeholder="+52 81 1234 5678"
          />
          
          <Input
            label="Correo Electrónico"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            disabled={!isEditing}
            required
          />
          
          <Select
            label="Método de Contacto Preferido"
            options={contactPreferenceOptions}
            value={formData?.preferredContact}
            onChange={(value) => handleInputChange('preferredContact', value)}
            disabled={!isEditing}
          />
        </div>
      </div>
      {/* Address Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="MapPin" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Dirección Fiscal</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Dirección"
            type="text"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Calle, Número, Colonia"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Ciudad"
              type="text"
              value={formData?.city}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              disabled={!isEditing}
            />
            
            <Select
              label="Estado"
              options={stateOptions}
              value={formData?.state}
              onChange={(value) => handleInputChange('state', value)}
              disabled={!isEditing}
              searchable
            />
            
            <Input
              label="Código Postal"
              type="text"
              value={formData?.postalCode}
              onChange={(e) => handleInputChange('postalCode', e?.target?.value)}
              disabled={!isEditing}
              placeholder="64000"
            />
          </div>
        </div>
      </div>
      {/* Billing Address */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Receipt" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Dirección de Facturación</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Dirección de Facturación"
            type="text"
            value={formData?.billingAddress}
            onChange={(e) => handleInputChange('billingAddress', e?.target?.value)}
            disabled={!isEditing}
            placeholder="Si es diferente a la dirección fiscal"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Ciudad"
              type="text"
              value={formData?.billingCity}
              onChange={(e) => handleInputChange('billingCity', e?.target?.value)}
              disabled={!isEditing}
            />
            
            <Select
              label="Estado"
              options={stateOptions}
              value={formData?.billingState}
              onChange={(value) => handleInputChange('billingState', value)}
              disabled={!isEditing}
              searchable
            />
            
            <Input
              label="Código Postal"
              type="text"
              value={formData?.billingPostalCode}
              onChange={(e) => handleInputChange('billingPostalCode', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
      {/* Additional Notes */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notas Adicionales</h3>
        </div>
        
        <textarea
          className="w-full h-32 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          value={formData?.notes}
          onChange={(e) => handleInputChange('notes', e?.target?.value)}
          disabled={!isEditing}
          placeholder="Información adicional sobre el cliente, preferencias especiales, etc."
        />
      </div>
    </div>
  );
};

export default ClientDetailsTab;