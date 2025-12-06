// ===== GENERADOR DE CATÁLOGO PDF PARA ADMIN =====

function generateAdminCatalog() {
    // Verificar que jsPDF esté disponible
    if (typeof window.jspdf === 'undefined') {
        alert('Error: Librería jsPDF no cargada. Por favor recarga la página.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración
    const pageWidth = doc.internal.pageSize.getWidth();

    // ===== ENCABEZADO =====
    doc.setFillColor(212, 165, 116);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('TENDENCIA & ESTILO', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Catálogo Completo - Administración', pageWidth / 2, 25, { align: 'center' });

    // Información del reporte
    doc.setTextColor(44, 44, 44);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const fecha = new Date().toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Fecha: ${fecha}`, 20, 50);
    doc.text(`Total de Productos: ${products.length}`, 20, 56);

    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    doc.text(`Stock Total: ${totalStock} unidades`, 20, 62);

    // ===== TABLA DE PRODUCTOS =====
    const tableData = products.map(p => [
        p.id.toString(),
        p.name,
        p.category === 'mujer' ? 'Mujer' : 'Hombre',
        `S/ ${p.price.toFixed(2)}`,
        (p.stock || 0).toString(),
        p.sizes ? p.sizes.join(', ') : '-',
        p.colors ? p.colors.join(', ') : '-'
    ]);

    doc.autoTable({
        head: [['ID', 'Producto', 'Categoría', 'Precio', 'Stock', 'Tallas', 'Colores']],
        body: tableData,
        startY: 70,
        styles: {
            fontSize: 8,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [212, 165, 116],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: { cellWidth: 10 },  // ID
            1: { cellWidth: 40 },  // Producto
            2: { cellWidth: 20 },  // Categoría
            3: { cellWidth: 20 },  // Precio
            4: { cellWidth: 15 },  // Stock
            5: { cellWidth: 35 },  // Tallas
            6: { cellWidth: 40 }   // Colores
        }
    });

    // ===== RESUMEN POR CATEGORÍA =====
    const finalY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Resumen por Categoría:', 20, finalY);

    const womenProducts = products.filter(p => p.category === 'mujer').length;
    const menProducts = products.filter(p => p.category === 'hombre').length;
    const womenStock = products.filter(p => p.category === 'mujer').reduce((sum, p) => sum + (p.stock || 0), 0);
    const menStock = products.filter(p => p.category === 'hombre').reduce((sum, p) => sum + (p.stock || 0), 0);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`• Productos de Mujer: ${womenProducts} (Stock: ${womenStock})`, 25, finalY + 8);
    doc.text(`• Productos de Hombre: ${menProducts} (Stock: ${menStock})`, 25, finalY + 14);

    // ===== PRODUCTOS CON STOCK BAJO =====
    const lowStockProducts = products.filter(p => (p.stock || 0) < 10);

    if (lowStockProducts.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.setTextColor(200, 50, 50);
        doc.text('⚠️ Productos con Stock Bajo (menos de 10):', 20, finalY + 24);

        doc.setFont(undefined, 'normal');
        doc.setTextColor(44, 44, 44);
        doc.setFontSize(9);

        lowStockProducts.forEach((p, index) => {
            doc.text(`• ${p.name}: ${p.stock || 0} unidades`, 25, finalY + 32 + (index * 6));
        });
    }

    // ===== PIE DE PÁGINA =====
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Página ${i} de ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
        doc.text(
            'Tendencia & Estilo - Documento Confidencial',
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 5,
            { align: 'center' }
        );
    }

    // Descargar PDF
    const fechaArchivo = new Date().toLocaleDateString('es-PE').replace(/\//g, '-');
    doc.save(`Catalogo-Admin-${fechaArchivo}.pdf`);

    // Mensaje de éxito
    alert('✅ Catálogo administrativo descargado exitosamente!');
}

// Hacer la función global
window.generateAdminCatalog = generateAdminCatalog;
