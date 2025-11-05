import React, { useState, useEffect } from 'react';

const ProductFiles = ({ productId, className = '' }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga - reemplaza con tu API real después
    setTimeout(() => {
      setFiles([]);
      setLoading(false);
    }, 1000);
  }, [productId]);

  if (loading) {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
            <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-4xl mb-4 opacity-50">📎</div>
        <p className="text-lg font-medium mb-2">No hay archivos adjuntos</p>
        <p className="text-sm">Los archivos que subas aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {files.map((file) => (
        <div
          key={file._id}
          className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200"
        >
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="text-2xl">
              {file.mimeType?.includes('pdf') ? '📄' : 
               file.mimeType?.includes('image') ? '🖼️' : '📎'}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {file.originalName}
              </p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span>
                  {new Date(file.createdAt).toLocaleDateString('es-MX')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/upload/url/${file._id}`);
                  const data = await res.json();
                  if (data.success) {
                    window.open(data.url, '_blank');
                  }
                } catch (error) {
                  alert('Error al abrir el archivo');
                }
              }}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
              title="Ver archivo"
            >
              👁️
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/upload/url/${file._id}`);
                  const data = await res.json();
                  if (data.success) {
                    const link = document.createElement('a');
                    link.href = data.url;
                    link.download = file.originalName;
                    link.click();
                  }
                } catch (error) {
                  alert('Error al descargar el archivo');
                }
              }}
              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 rounded-lg transition-colors"
              title="Descargar archivo"
            >
              ⬇️
            </button>

            <button
              onClick={async () => {
                if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return;
                try {
                  await fetch(`/api/upload/${file._id}`, { method: 'DELETE' });
                  setFiles(prev => prev.filter(f => f._id !== file._id));
                } catch (error) {
                  alert('Error al eliminar el archivo');
                }
              }}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Eliminar archivo"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductFiles;