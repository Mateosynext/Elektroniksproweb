import React, { useState } from 'react';
import Icon from '../../../components/appIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DocumentManagement = ({ clientId, canEdit }) => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Contrato de Servicios 2024",
      type: "contract",
      fileType: "pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      expiryDate: "2024-12-31",
      status: "active",
      uploadedBy: "Admin Sistema",
      description: "Contrato anual de servicios de mantenimiento preventivo y correctivo"
    },
    {
      id: 2,
      name: "Certificado ISO 9001",
      type: "certificate",
      fileType: "pdf",
      size: "1.8 MB",
      uploadDate: "2024-03-20",
      expiryDate: "2025-03-20",
      status: "active",
      uploadedBy: "Jesús Mendoza",
      description: "Certificación de calidad en servicios de reparación electrónica"
    },
    {
      id: 3,
      name: "Póliza de Seguro Responsabilidad",
      type: "insurance",
      fileType: "pdf",
      size: "3.1 MB",
      uploadDate: "2024-02-10",
      expiryDate: "2025-02-10",
      status: "active",
      uploadedBy: "Admin Sistema",
      description: "Cobertura de responsabilidad civil para servicios técnicos"
    },
    {
      id: 4,
      name: "Garantía Extendida Kenworth",
      type: "warranty",
      fileType: "pdf",
      size: "1.2 MB",
      uploadDate: "2024-05-15",
      expiryDate: "2026-05-15",
      status: "active",
      uploadedBy: "Flaco Mendoza",
      description: "Garantía extendida para componentes electrónicos Kenworth T680"
    },
    {
      id: 5,
      name: "Acta Constitutiva",
      type: "legal",
      fileType: "pdf",
      size: "4.2 MB",
      uploadDate: "2023-12-01",
      expiryDate: null,
      status: "archived",
      uploadedBy: "Admin Sistema",
      description: "Documento legal de constitución de la empresa cliente"
    }
  ]);

  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    type: 'contract',
    description: '',
    expiryDate: ''
  });

  const documentTypeOptions = [
    { value: 'all', label: 'Todos los Tipos' },
    { value: 'contract', label: 'Contratos' },
    { value: 'certificate', label: 'Certificados' },
    { value: 'insurance', label: 'Seguros' },
    { value: 'warranty', label: 'Garantías' },
    { value: 'legal', label: 'Documentos Legales' },
    { value: 'compliance', label: 'Cumplimiento' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'active', label: 'Activo' },
    { value: 'expired', label: 'Vencido' },
    { value: 'archived', label: 'Archivado' }
  ];

  const uploadTypeOptions = [
    { value: 'contract', label: 'Contrato' },
    { value: 'certificate', label: 'Certificado' },
    { value: 'insurance', label: 'Seguro' },
    { value: 'warranty', label: 'Garantía' },
    { value: 'legal', label: 'Documento Legal' },
    { value: 'compliance', label: 'Cumplimiento' }
  ];

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'contract':
        return 'FileText';
      case 'certificate':
        return 'Award';
      case 'insurance':
        return 'Shield';
      case 'warranty':
        return 'ShieldCheck';
      case 'legal':
        return 'Scale';
      case 'compliance':
        return 'CheckCircle';
      default:
        return 'File';
    }
  };

  const getDocumentTypeLabel = (type) => {
    const option = uploadTypeOptions?.find(opt => opt?.value === type);
    return option ? option?.label : type;
  };

  const getStatusColor = (status, expiryDate) => {
    if (status === 'archived') return 'bg-muted text-muted-foreground';
    if (expiryDate && new Date(expiryDate) < new Date()) return 'bg-error text-error-foreground';
    if (expiryDate && new Date(expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
      return 'bg-warning text-warning-foreground';
    }
    return 'bg-success text-success-foreground';
  };

  const getStatusLabel = (status, expiryDate) => {
    if (status === 'archived') return 'Archivado';
    if (expiryDate && new Date(expiryDate) < new Date()) return 'Vencido';
    if (expiryDate && new Date(expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
      return 'Por Vencer';
    }
    return 'Activo';
  };

  const filteredDocuments = documents?.filter(doc => {
    const typeMatch = filterType === 'all' || doc?.type === filterType;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && doc?.status === 'active' && (!doc?.expiryDate || new Date(doc.expiryDate) >= new Date())) ||
      (filterStatus === 'expired' && doc?.expiryDate && new Date(doc.expiryDate) < new Date()) ||
      (filterStatus === 'archived' && doc?.status === 'archived');
    
    return typeMatch && statusMatch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleUpload = () => {
    const newDocument = {
      id: documents?.length + 1,
      ...uploadData,
      fileType: 'pdf',
      size: '1.5 MB',
      uploadDate: new Date()?.toISOString()?.split('T')?.[0],
      status: 'active',
      uploadedBy: 'Usuario Actual'
    };
    
    setDocuments([...documents, newDocument]);
    setUploadData({
      name: '',
      type: 'contract',
      description: '',
      expiryDate: ''
    });
    setShowUploadForm(false);
  };

  const handleDelete = (documentId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
      setDocuments(documents?.filter(doc => doc?.id !== documentId));
    }
  };

  const handleDownload = (document) => {
    // Simulate download
    console.log(`Descargando: ${document?.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-primary" />
            <div>
              <div className="text-2xl font-bold text-foreground">{documents?.length}</div>
              <div className="text-sm text-muted-foreground">Total Documentos</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <div className="text-2xl font-bold text-foreground">
                {documents?.filter(d => d?.status === 'active' && (!d?.expiryDate || new Date(d.expiryDate) >= new Date()))?.length}
              </div>
              <div className="text-sm text-muted-foreground">Activos</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <div>
              <div className="text-2xl font-bold text-foreground">
                {documents?.filter(d => d?.expiryDate && new Date(d.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && new Date(d.expiryDate) >= new Date())?.length}
              </div>
              <div className="text-sm text-muted-foreground">Por Vencer</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="XCircle" size={20} className="text-error" />
            <div>
              <div className="text-2xl font-bold text-foreground">
                {documents?.filter(d => d?.expiryDate && new Date(d.expiryDate) < new Date())?.length}
              </div>
              <div className="text-sm text-muted-foreground">Vencidos</div>
            </div>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Select
            options={documentTypeOptions}
            value={filterType}
            onChange={setFilterType}
            placeholder="Filtrar por tipo"
            className="w-48"
          />
          
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filtrar por estado"
            className="w-48"
          />
        </div>
        
        {canEdit && (
          <Button
            variant="default"
            onClick={() => setShowUploadForm(true)}
            iconName="Upload"
            iconPosition="left"
          >
            Subir Documento
          </Button>
        )}
      </div>
      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Subir Nuevo Documento</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUploadForm(false)}
              iconName="X"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre del Documento *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={uploadData?.name}
                onChange={(e) => setUploadData({...uploadData, name: e?.target?.value})}
                placeholder="Ej: Contrato de Servicios 2024"
                required
              />
            </div>
            
            <Select
              label="Tipo de Documento"
              options={uploadTypeOptions}
              value={uploadData?.type}
              onChange={(value) => setUploadData({...uploadData, type: value})}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={uploadData?.expiryDate}
                onChange={(e) => setUploadData({...uploadData, expiryDate: e?.target?.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Archivo *
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                <Icon name="Upload" size={24} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Arrastra un archivo aquí o <span className="text-primary cursor-pointer">selecciona uno</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF, máximo 10MB</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              value={uploadData?.description}
              onChange={(e) => setUploadData({...uploadData, description: e?.target?.value})}
              placeholder="Descripción del documento y su propósito"
            />
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowUploadForm(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleUpload}
              iconName="Upload"
              iconPosition="left"
            >
              Subir Documento
            </Button>
          </div>
        </div>
      )}
      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments?.map((document) => (
          <div key={document?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name={getDocumentIcon(document?.type)} size={24} color="white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{document?.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document?.status, document?.expiryDate)}`}>
                      {getStatusLabel(document?.status, document?.expiryDate)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div className="flex items-center space-x-2">
                      <Icon name="Tag" size={16} className="text-muted-foreground" />
                      <span className="text-foreground">{getDocumentTypeLabel(document?.type)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="HardDrive" size={16} className="text-muted-foreground" />
                      <span className="text-foreground">{document?.size}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="Calendar" size={16} className="text-muted-foreground" />
                      <span className="text-foreground">Subido: {formatDate(document?.uploadDate)}</span>
                    </div>
                    
                    {document?.expiryDate && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={16} className="text-muted-foreground" />
                        <span className="text-foreground">Vence: {formatDate(document?.expiryDate)}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{document?.description}</p>
                  
                  <div className="text-xs text-muted-foreground">
                    Subido por: {document?.uploadedBy}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(document)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Descargar
                </Button>
                
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document?.id)}
                    iconName="Trash2"
                    className="text-error hover:text-error"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredDocuments?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay documentos</h3>
          <p className="text-muted-foreground">
            {filterType === 'all' && filterStatus === 'all' ?'Este cliente no tiene documentos registrados.' :'No hay documentos que coincidan con los filtros seleccionados.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;