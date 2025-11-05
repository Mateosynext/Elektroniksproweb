// exportUtils.js - Versión Corregida y Funcional
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Configuración centralizada simplificada
const EXPORT_CONFIG = {
  dateFormat: 'es-MX',
  currency: 'MXN',
  company: {
    name: 'ElektronikPro',
    system: 'Sistema de Gestión de Inventario'
  }
};

// Diccionarios simplificados
const DICTIONARIES = {
  units: {
    'piece': 'Pieza',
    'box': 'Caja', 
    'liter': 'Litro',
    'kg': 'Kilogramo',
    'meter': 'Metro'
  },
  locations: {
    'warehouse-a': 'Almacén A',
    'warehouse-b': 'Almacén B',
    'workshop-1': 'Taller 1',
    'workshop-2': 'Taller 2'
  },
  suppliers: {
    'bosch': 'Bosch',
    'continental': 'Continental',
    'local-supplier': 'Proveedor Local'
  },
  categories: {
    'sensors': 'Sensores',
    'cables': 'Cables',
    'control-modules': 'Módulos',
    'diagnostic-tools': 'Diagnóstico',
    'perishable': 'Perecederos'
  },
  status: {
    'active': 'Activo',
    'inactive': 'Inactivo'
  }
};

// Helper functions simplificadas
const getTranslation = (dictionary, key) => {
  return DICTIONARIES[dictionary]?.[key] || key || '-';
};

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('es-MX').format(date);
};

// Preparación de datos simplificada
const prepareExportData = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => {
    const margin = item?.cost && item?.price ? ((item.price - item.cost) / item.cost * 100) : 0;
    
    // Determinar estado de stock
    let stockStatus = 'Adecuado';
    if (item?.currentStock === 0) stockStatus = 'Sin Stock';
    else if (item?.currentStock <= item?.minimumStock) stockStatus = 'Stock Bajo';
    else if (item?.currentStock > item?.minimumStock * 2) stockStatus = 'Sobre Stock';

    return {
      'Código': item?.code || '-',
      'Nombre': item?.name || '-',
      'Descripción': item?.description || '-',
      'Categoría': getTranslation('categories', item?.category),
      'Unidad': getTranslation('units', item?.unit),
      'Stock Actual': item?.currentStock ?? 0,
      'Stock Mínimo': item?.minimumStock ?? 0,
      'Stock Máximo': item?.maximumStock ?? 0,
      'Costo': item?.cost ? formatCurrency(item.cost) : '$0.00',
      'Precio': item?.price ? formatCurrency(item.price) : '$0.00',
      'Margen': `${margin.toFixed(1)}%`,
      'Valor Inventario': formatCurrency((item?.currentStock || 0) * (item?.cost || 0)),
      'Ubicación': getTranslation('locations', item?.location),
      'Proveedor': getTranslation('suppliers', item?.supplier),
      'Código Barras': item?.barcode || '-',
      'Lote': item?.batch || '-',
      'Vencimiento': formatDate(item?.expiryDate),
      'Estado': getTranslation('status', item?.status),
      'Estado Stock': stockStatus,
      'Última Actualización': formatDate(item?.lastUpdated)
    };
  });
};

// Exportación a Excel - Versión Simplificada y Funcional
export const exportToExcel = (data, filename = 'inventario') => {
  return new Promise((resolve) => {
    try {
      console.log('📊 Iniciando exportación Excel...', data?.length);
      
      const exportData = prepareExportData(data);
      
      if (!exportData || exportData.length === 0) {
        resolve({
          success: false,
          error: 'No hay datos para exportar',
          format: 'excel'
        });
        return;
      }

      // Crear workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Ajustar anchos de columnas básicos
      const colWidths = [
        { wch: 12 }, // Código
        { wch: 25 }, // Nombre
        { wch: 30 }, // Descripción
        { wch: 15 }, // Categoría
        { wch: 10 }, // Unidad
        { wch: 12 }, // Stock Actual
        { wch: 12 }, // Stock Mínimo
        { wch: 12 }, // Stock Máximo
        { wch: 12 }, // Costo
        { wch: 12 }, // Precio
        { wch: 10 }, // Margen
        { wch: 15 }, // Valor Inventario
        { wch: 15 }, // Ubicación
        { wch: 15 }, // Proveedor
        { wch: 15 }, // Código Barras
        { wch: 12 }, // Lote
        { wch: 12 }, // Vencimiento
        { wch: 10 }, // Estado
        { wch: 12 }, // Estado Stock
        { wch: 15 }  // Última Actualización
      ];
      
      worksheet['!cols'] = colWidths;

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');

      // Generar nombre de archivo
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}_${timestamp}.xlsx`;

      // Escribir archivo
      XLSX.writeFile(workbook, fullFilename);

      console.log('✅ Exportación Excel completada');
      
      resolve({
        success: true,
        format: 'excel',
        records: exportData.length,
        filename: fullFilename,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error en exportación Excel:', error);
      resolve({
        success: false,
        error: error.message,
        format: 'excel'
      });
    }
  });
};

// Exportación a PDF - Versión Simplificada y Funcional
export const exportToPDF = (data, filename = 'inventario') => {
  return new Promise((resolve) => {
    try {
      console.log('📊 Iniciando exportación PDF...', data?.length);
      
      const exportData = prepareExportData(data);
      
      if (!exportData || exportData.length === 0) {
        resolve({
          success: false,
          error: 'No hay datos para exportar',
          format: 'pdf'
        });
        return;
      }

      // Crear documento PDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Configurar página
      const pageWidth = doc.internal.pageSize.width;
      const margin = 14;

      // Header
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246); // Azul
      doc.text(EXPORT_CONFIG.company.name, margin, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Reporte de Inventario', margin, 27);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, pageWidth - margin, 27, { align: 'right' });
      
      doc.text(`Total productos: ${data.length}`, margin, 34);

      // Preparar datos para la tabla
      const tableColumns = [
        'Código',
        'Nombre', 
        'Stock',
        'Costo',
        'Precio',
        'Ubicación',
        'Estado Stock'
      ];

      const tableData = exportData.map(item => [
        item.Código,
        item.Nombre.length > 20 ? item.Nombre.substring(0, 20) + '...' : item.Nombre,
        item['Stock Actual'],
        item.Costo,
        item.Precio,
        item.Ubicación,
        item['Estado Stock']
      ]);

      // Generar tabla
      doc.autoTable({
        head: [tableColumns],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        margin: { top: 40, right: margin, left: margin, bottom: 20 },
        theme: 'grid'
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Página ${i} de ${pageCount} - ${EXPORT_CONFIG.company.system}`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Guardar archivo
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}_${timestamp}.pdf`;
      doc.save(fullFilename);

      console.log('✅ Exportación PDF completada');
      
      resolve({
        success: true,
        format: 'pdf',
        records: exportData.length,
        filename: fullFilename,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error en exportación PDF:', error);
      resolve({
        success: false,
        error: error.message,
        format: 'pdf'
      });
    }
  });
};

// Exportación a CSV - Versión Simplificada y Funcional
export const exportToCSV = (data, filename = 'inventario') => {
  return new Promise((resolve) => {
    try {
      console.log('📊 Iniciando exportación CSV...', data?.length);
      
      const exportData = prepareExportData(data);
      
      if (!exportData || exportData.length === 0) {
        resolve({
          success: false,
          error: 'No hay datos para exportar',
          format: 'csv'
        });
        return;
      }

      // Preparar headers
      const headers = Object.keys(exportData[0]);
      
      // Crear contenido CSV
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escapar comillas y manejar valores con comas
            const stringValue = String(value).replace(/"/g, '""');
            return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
          }).join(',')
        )
      ].join('\n');

      // Crear blob y descargar
      const blob = new Blob(['\uFEFF' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}_${timestamp}.csv`;
      
      link.href = url;
      link.download = fullFilename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      console.log('✅ Exportación CSV completada');
      
      resolve({
        success: true,
        format: 'csv',
        records: exportData.length,
        filename: fullFilename,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error en exportación CSV:', error);
      resolve({
        success: false,
        error: error.message,
        format: 'csv'
      });
    }
  });
};

// Función principal unificada
export const exportInventory = async (data, format = 'excel', filename = 'inventario') => {
  try {
    console.log(`🚀 Exportando ${data?.length} registros en formato ${format}`);
    
    if (!data || data.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    let result;
    switch (format.toLowerCase()) {
      case 'excel':
        result = await exportToExcel(data, filename);
        break;
      case 'pdf':
        result = await exportToPDF(data, filename);
        break;
      case 'csv':
        result = await exportToCSV(data, filename);
        break;
      default:
        result = await exportToExcel(data, filename);
    }

    return result;
  } catch (error) {
    console.error('❌ Error en exportación:', error);
    return {
      success: false,
      error: error.message,
      format: format
    };
  }
};

// Utilidad para verificar datos antes de exportar
export const previewExportData = (data) => {
  const exportData = prepareExportData(data);
  
  return {
    totalRecords: exportData.length,
    columns: Object.keys(exportData[0] || {}),
    sampleData: exportData.slice(0, 3),
    totalValue: exportData.reduce((sum, item) => {
      const value = parseFloat(item.ValorInventario?.replace(/[^0-9.-]+/g,"")) || 0;
      return sum + value;
    }, 0)
  };
};

// Exportación múltiple
export const exportMultipleFormats = async (data, formats = ['excel'], filename = 'inventario') => {
  const results = [];
  
  for (const format of formats) {
    try {
      const result = await exportInventory(data, format, filename);
      results.push(result);
    } catch (error) {
      results.push({
        success: false,
        format: format,
        error: error.message
      });
    }
  }
  
  return results;
};

export default {
  exportToExcel,
  exportToPDF,
  exportToCSV,
  exportInventory,
  exportMultipleFormats,
  previewExportData
};