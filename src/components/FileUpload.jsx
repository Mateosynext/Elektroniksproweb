import React, { useState, useCallback } from 'react';
import Icon from './appIcon';
import Button from './ui/Button';

const FileUpload = ({ productId, onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Use PDF, imágenes, Word o Excel.');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);
      if (productId) {
        formData.append('productId', productId);
      }

      // Enviar archivo al servidor
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      const result = await response.json();
      
      if (result.success && onUpload) {
        onUpload(result.file);
      }

      // Resetear después de éxito
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        event.target.value = ''; // Limpiar input
      }, 1000);

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir el archivo: ' + error.message);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [productId, onUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-500/10');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-500/10');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-500/10');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const input = document.getElementById('file-upload-input');
      if (input) {
        input.files = files;
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  }, []);

  return (
    <div className="w-full">
      <input
        id="file-upload-input"
        type="file"
        onChange={handleFileUpload}
        accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
        className="hidden"
        disabled={isUploading}
      />
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-all duration-200 hover:border-blue-500 hover:bg-blue-500/5 cursor-pointer"
        onClick={() => !isUploading && document.getElementById('file-upload-input')?.click()}
      >
        {isUploading ? (
          <div className="space-y-3">
            <div className="flex justify-center">
              <Icon name="Loader" size={32} className="text-blue-400 animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">Subiendo archivo...</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <Icon name="Upload" size={32} className="text-gray-400" />
            </div>
            <div>
              <p className="text-white font-medium">Haz clic o arrastra archivos aquí</p>
              <p className="text-sm text-gray-400 mt-1">
                PDF, imágenes, Word, Excel (máx. 10MB)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              iconName="Plus"
              iconSize={14}
            >
              Seleccionar Archivo
            </Button>
          </div>
        )}
      </div>

      {/* Información de tipos de archivo permitidos */}
      <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <p className="text-xs text-gray-400 text-center">
          <strong>Formatos permitidos:</strong> PDF, JPG, PNG, GIF, DOC, DOCX, XLS, XLSX
          <br />
          <strong>Tamaño máximo:</strong> 10MB por archivo
        </p>
      </div>
    </div>
  );
};

export { FileUpload };