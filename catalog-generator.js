// ===== GENERADOR DE CATÁLOGO PDF PARA CLIENTES CON IMÁGENES =====

function generateCustomerCatalog() {
    // Verificar que jsPDF esté disponible
    if (typeof window.jspdf === 'undefined') {
        alert('Error: Librería jsPDF no cargada. Por favor recarga la página.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // ===== PORTADA =====
    doc.setFillColor(212, 165, 116); // Color primario
    doc.rect(0, 0, pageWidth, 60, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('TENDENCIA & ESTILO', pageWidth / 2, 35, { align: 'center' });

    doc.setTextColor(44, 44, 44);
    doc.setFontSize(20);
    doc.text('Catálogo de Productos', pageWidth / 2, 80, { align: 'center' });

    doc.setFontSize(14);
    doc.text('2025', pageWidth / 2, 95, { align: 'center' });

    // Información de contacto en portada
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('WhatsApp: +51 906 174 278', pageWidth / 2, 250, { align: 'center' });
    doc.text('Moda y Estilo para Toda la Familia', pageWidth / 2, 265, { align: 'center' });

    // ===== FUNCIÓN PARA CARGAR IMAGEN =====
    function loadImageAsBase64(imagePath) {
        return new Promise((resolve, reject) => {
            // Si la imagen ya está en Base64, usarla directamente
            if (imagePath.startsWith('data:image')) {
                resolve(imagePath);
                return;
            }

            // Intentar cargar la imagen
            const img = new Image();
            img.crossOrigin = 'Anonymous';

            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                try {
                    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(dataURL);
                } catch (e) {
                    console.warn('No se pudo convertir la imagen:', imagePath);
                    resolve(null);
                }
            };

            img.onerror = function () {
                console.warn('No se pudo cargar la imagen:', imagePath);
                resolve(null);
            };

            img.src = imagePath;
        });
    }

    // ===== PROCESAR PRODUCTOS =====
    async function generatePages() {
        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            doc.addPage();

            let yPos = margin;

            // ===== INTENTAR CARGAR IMAGEN =====
            const imagePath = product.images && product.images.length > 0
                ? product.images[0]
                : product.image;

            if (imagePath) {
                try {
                    const imageData = await loadImageAsBase64(imagePath);

                    if (imageData) {
                        // Agregar imagen al PDF
                        const imgWidth = 80;
                        const imgHeight = 100;
                        const imgX = (pageWidth - imgWidth) / 2;

                        doc.addImage(imageData, 'JPEG', imgX, yPos, imgWidth, imgHeight);
                        yPos += imgHeight + 10;
                    } else {
                        // Si no se pudo cargar, mostrar placeholder
                        doc.setFillColor(240, 240, 240);
                        doc.rect((pageWidth - 80) / 2, yPos, 80, 100, 'F');
                        doc.setFontSize(10);
                        doc.setTextColor(150, 150, 150);
                        doc.text('Imagen no disponible', pageWidth / 2, yPos + 50, { align: 'center' });
                        doc.setTextColor(44, 44, 44);
                        yPos += 110;
                    }
                } catch (error) {
                    console.error('Error al procesar imagen:', error);
                    yPos += 10;
                }
            }

            // Nombre del producto
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(44, 44, 44);
            doc.text(product.name, margin, yPos);
            yPos += 10;

            // Línea decorativa
            doc.setDrawColor(212, 165, 116);
            doc.setLineWidth(0.5);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 15;

            // Precio
            doc.setFontSize(20);
            doc.setTextColor(212, 165, 116);
            doc.setFont(undefined, 'bold');
            doc.text(`S/ ${product.price.toFixed(2)}`, margin, yPos);
            yPos += 15;

            // Tallas
            doc.setFontSize(12);
            doc.setTextColor(44, 44, 44);
            doc.setFont(undefined, 'bold');
            doc.text('Tallas Disponibles:', margin, yPos);
            doc.setFont(undefined, 'normal');
            doc.text(product.sizes.join(' • '), margin + 45, yPos);
            yPos += 10;

            // Colores
            if (product.colors && product.colors.length > 0) {
                doc.setFont(undefined, 'bold');
                doc.text('Colores:', margin, yPos);
                doc.setFont(undefined, 'normal');
                doc.text(product.colors.join(' • '), margin + 25, yPos);
                yPos += 10;
            }

            yPos += 5;

            // Descripción
            doc.setFont(undefined, 'bold');
            doc.text('Descripción:', margin, yPos);
            yPos += 7;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            const descLines = doc.splitTextToSize(product.description, pageWidth - (margin * 2));
            doc.text(descLines, margin, yPos);
            yPos += descLines.length * 5 + 10;

            // Categoría
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Categoría: ${product.category === 'mujer' ? 'Mujer' : 'Hombre'}`, margin, yPos);

            // Número de página
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Página ${index + 2} de ${products.length + 2}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

            // Pie de página con contacto
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            // doc.text('WhatsApp: +51 906 174 278', pageWidth / 2, pageHeight - 5, { align: 'center' });
        }

        // ===== CONTRAPORTADA =====
        doc.addPage();

        // Fondo decorativo
        doc.setFillColor(212, 165, 116);
        doc.rect(0, pageHeight - 80, pageWidth, 80, 'F');

        // Mensaje de agradecimiento
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(44, 44, 44);
        doc.text('¡Gracias por tu Preferencia!', pageWidth / 2, 100, { align: 'center' });

        // Información de contacto
        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.text('Contáctanos:', pageWidth / 2, 130, { align: 'center' });

        doc.setFontSize(12);
        doc.text('WhatsApp: +51 906 174 278', pageWidth / 2, 145, { align: 'center' });

        // Mensaje en el pie
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('Tendencia & Estilo - Moda para Toda la Familia', pageWidth / 2, pageHeight - 45, { align: 'center' });
        doc.text('Síguenos en nuestras redes sociales', pageWidth / 2, pageHeight - 35, { align: 'center' });

        // Descargar PDF
        const fecha = new Date().toLocaleDateString('es-PE').replace(/\//g, '-');
        doc.save(`Catalogo-Tendencia-y-Estilo-${fecha}.pdf`);

        // Mensaje de éxito
        alert('✅ Catálogo descargado exitosamente con imágenes!');
    }

    // Mostrar mensaje de carga
    const loadingMsg = document.createElement('div');
    loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px 40px;border-radius:10px;z-index:10000;font-size:16px;';
    loadingMsg.textContent = '⏳ Generando catálogo con imágenes...';
    document.body.appendChild(loadingMsg);

    // Generar el PDF
    generatePages().then(() => {
        document.body.removeChild(loadingMsg);
    }).catch(error => {
        console.error('Error al generar catálogo:', error);
        document.body.removeChild(loadingMsg);
        alert('❌ Error al generar el catálogo. Intenta de nuevo.');
    });
}

// Hacer la función global
window.generateCustomerCatalog = generateCustomerCatalog;
