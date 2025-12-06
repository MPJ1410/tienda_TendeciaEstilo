// ===== Sistema de Carga de Imágenes con Optimización Automática =====

// Configuración de optimización
const IMAGE_CONFIG = {
    maxWidth: 800,           // Ancho máximo en píxeles
    maxHeight: 800,          // Alto máximo en píxeles
    quality: 0.85,           // Calidad JPEG (0.85 = 85%)
    format: 'image/jpeg',    // Formato de salida
    maxSizeKB: 500          // Tamaño máximo objetivo en KB
};

// Manejar la carga de imágenes
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 3; i++) {
        const fileInput = document.getElementById(`image-file-${i}`);
        if (fileInput) {
            fileInput.addEventListener('change', (e) => handleImageUpload(e, i));
        }
    }
});

function handleImageUpload(event, imageNumber) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
        alert('❌ Por favor selecciona un archivo de imagen válido');
        return;
    }

    // Mostrar mensaje de procesamiento
    showProcessingMessage(imageNumber, 'Procesando imagen...');

    // Leer y optimizar la imagen
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            // Optimizar la imagen
            const optimizedBase64 = optimizeImage(img);

            // Guardar en el input oculto
            document.getElementById(`product-image-${imageNumber}`).value = optimizedBase64;

            // Mostrar vista previa
            const preview = document.getElementById(`preview-${imageNumber}`);
            const previewImg = document.getElementById(`preview-img-${imageNumber}`);

            previewImg.src = optimizedBase64;
            preview.style.display = 'block';

            // Ocultar el botón de subir
            const uploadBtn = event.target.parentElement.querySelector('.btn-upload-image');
            if (uploadBtn) uploadBtn.style.display = 'none';

            // Ocultar mensaje de procesamiento
            hideProcessingMessage(imageNumber);

            // Mostrar información de la imagen
            showImageInfo(imageNumber, optimizedBase64);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

function optimizeImage(img) {
    // Crear canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calcular nuevas dimensiones manteniendo proporción
    let width = img.width;
    let height = img.height;

    // Redimensionar si es necesario
    if (width > IMAGE_CONFIG.maxWidth || height > IMAGE_CONFIG.maxHeight) {
        const ratio = Math.min(
            IMAGE_CONFIG.maxWidth / width,
            IMAGE_CONFIG.maxHeight / height
        );
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }

    // Establecer tamaño del canvas
    canvas.width = width;
    canvas.height = height;

    // Dibujar imagen redimensionada
    ctx.drawImage(img, 0, 0, width, height);

    // Convertir a Base64 con compresión
    let quality = IMAGE_CONFIG.quality;
    let base64 = canvas.toDataURL(IMAGE_CONFIG.format, quality);

    // Si la imagen sigue siendo muy grande, reducir calidad
    let iterations = 0;
    while (getBase64SizeKB(base64) > IMAGE_CONFIG.maxSizeKB && quality > 0.5 && iterations < 5) {
        quality -= 0.1;
        base64 = canvas.toDataURL(IMAGE_CONFIG.format, quality);
        iterations++;
    }

    return base64;
}

function getBase64SizeKB(base64) {
    // Calcular tamaño aproximado en KB
    const stringLength = base64.length - 'data:image/jpeg;base64,'.length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    return sizeInBytes / 1024;
}

function showProcessingMessage(imageNumber, message) {
    const container = document.getElementById(`image-file-${imageNumber}`).parentElement;
    let processingDiv = container.querySelector('.processing-message');

    if (!processingDiv) {
        processingDiv = document.createElement('div');
        processingDiv.className = 'processing-message';
        container.appendChild(processingDiv);
    }

    processingDiv.innerHTML = `
        <div style="text-align: center; padding: 1rem; color: var(--primary);">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    processingDiv.style.display = 'block';
}

function hideProcessingMessage(imageNumber) {
    const container = document.getElementById(`image-file-${imageNumber}`).parentElement;
    const processingDiv = container.querySelector('.processing-message');
    if (processingDiv) {
        processingDiv.style.display = 'none';
    }
}

function showImageInfo(imageNumber, base64) {
    const sizeKB = Math.round(getBase64SizeKB(base64));
    const container = document.getElementById(`image-file-${imageNumber}`).parentElement;

    let infoDiv = container.querySelector('.image-info');
    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.className = 'image-info';
        container.appendChild(infoDiv);
    }

    infoDiv.innerHTML = `
        <small style="color: var(--success); display: block; margin-top: 0.5rem;">
            ✅ Optimizada: ${sizeKB} KB
        </small>
    `;
}

function removeImage(imageNumber) {
    // Limpiar el input de archivo
    const fileInput = document.getElementById(`image-file-${imageNumber}`);
    if (fileInput) fileInput.value = '';

    // Limpiar el input oculto
    const textInput = document.getElementById(`product-image-${imageNumber}`);
    if (textInput) textInput.value = '';

    // Ocultar vista previa
    const preview = document.getElementById(`preview-${imageNumber}`);
    if (preview) preview.style.display = 'none';

    // Limpiar info de imagen
    const container = fileInput.parentElement;
    const infoDiv = container.querySelector('.image-info');
    if (infoDiv) infoDiv.remove();

    // Mostrar el botón de subir
    const uploadBtn = fileInput.parentElement.querySelector('.btn-upload-image');
    if (uploadBtn) uploadBtn.style.display = 'inline-block';
}

// Hacer la función global
window.removeImage = removeImage;

// Agregar estilos para el spinner
const style = document.createElement('style');
style.textContent = `
    .spinner {
        border: 3px solid rgba(212, 165, 116, 0.3);
        border-top: 3px solid var(--primary);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .processing-message {
        margin-top: 1rem;
    }
    
    .image-info {
        text-align: center;
    }
`;
document.head.appendChild(style);
