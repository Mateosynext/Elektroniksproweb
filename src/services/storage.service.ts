// src/services/storage.service.ts
export interface UploadResponse {
  fileId: string;
  fileName: string;
  downloadUrl: string;
}

export class StorageService {
  private apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('📤 Enviando archivo al backend:', file.name, 'tamaño:', file.size);

    const response = await fetch(`${this.apiBase}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error en upload:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Archivo subido exitosamente:', result);
    return result;
  }

  async deleteFile(fileId: string, fileName: string): Promise<void> {
    console.log('🗑️ Solicitando eliminación de archivo:', fileName);

    const response = await fetch(`${this.apiBase}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }

    console.log('✅ Archivo eliminado exitosamente');
  }

  async getFileUrl(fileName: string): Promise<string> {
    console.log('🔗 Solicitando URL para:', fileName);

    const response = await fetch(`${this.apiBase}/files/${fileName}/url`);
    
    if (!response.ok) {
      throw new Error(`Get URL failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ URL obtenida:', data.url);
    return data.url;
  }
}

export default new StorageService();