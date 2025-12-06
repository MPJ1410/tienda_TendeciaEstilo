// Add to admin-script.js - Color Picker System

// Available colors with hex codes
const availableColors = [
    { name: 'Rojo', hex: '#E53935', light: false },
    { name: 'Rojo Vino', hex: '#880E4F', light: false },
    { name: 'Rosa', hex: '#EC407A', light: false },
    { name: 'Rosa Claro', hex: '#F8BBD0', light: true },
    { name: 'Fucsia', hex: '#E91E63', light: false },
    { name: 'Azul', hex: '#1E88E5', light: false },
    { name: 'Azul Marino', hex: '#0D47A1', light: false },
    { name: 'Azul Claro', hex: '#81D4FA', light: true },
    { name: 'Celeste', hex: '#4FC3F7', light: false },
    { name: 'Turquesa', hex: '#00BCD4', light: false },
    { name: 'Verde', hex: '#43A047', light: false },
    { name: 'Verde Oscuro', hex: '#2E7D32', light: false },
    { name: 'Verde Claro', hex: '#81C784', light: true },
    { name: 'Menta', hex: '#80CBC4', light: true },
    { name: 'Amarillo', hex: '#FDD835', light: true },
    { name: 'Naranja', hex: '#FB8C00', light: false },
    { name: 'Dorado', hex: '#FFB300', light: true },
    { name: 'Blanco', hex: '#FFFFFF', light: true },
    { name: 'Negro', hex: '#212121', light: false },
    { name: 'Gris', hex: '#757575', light: false },
    { name: 'Gris Claro', hex: '#BDBDBD', light: true },
    { name: 'Beige', hex: '#D7CCC8', light: true },
    { name: 'Crema', hex: '#FFF8E1', light: true },
    { name: 'Café', hex: '#6D4C41', light: false },
    { name: 'Marrón', hex: '#5D4037', light: false },
    { name: 'Morado', hex: '#8E24AA', light: false },
    { name: 'Lila', hex: '#BA68C8', light: false },
    { name: 'Violeta', hex: '#7B1FA2', light: false },
    { name: 'Coral', hex: '#FF7043', light: false },
    { name: 'Salmón', hex: '#FFAB91', light: true }
];

let selectedColors = [];

function initializeColorPicker() {
    const grid = document.getElementById('colorPickerGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    availableColors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-option';
        colorDiv.style.backgroundColor = color.hex;
        colorDiv.style.borderColor = color.light ? '#ddd' : color.hex;
        colorDiv.setAttribute('data-color-name', color.name);
        colorDiv.setAttribute('data-light', color.light);
        colorDiv.title = color.name;
        
        colorDiv.onclick = () => toggleColor(color.name, colorDiv);
        
        grid.appendChild(colorDiv);
    });
}

function toggleColor(colorName, element) {
    const index = selectedColors.indexOf(colorName);
    
    if (index > -1) {
        // Deselect
        selectedColors.splice(index, 1);
        element.classList.remove('selected');
    } else {
        // Select
        selectedColors.push(colorName);
        element.classList.add('selected');
    }
    
    updateSelectedColorsDisplay();
}

function updateSelectedColorsDisplay() {
    const textElement = document.getElementById('selected-colors-text');
    const hiddenInput = document.getElementById('product-colors-hidden');
    
    if (selectedColors.length === 0) {
        textElement.textContent = 'Ninguno';
        textElement.style.color = '#999';
        hiddenInput.value = '';
    } else {
        textElement.textContent = selectedColors.join(', ');
        textElement.style.color = 'var(--primary)';
        hiddenInput.value = selectedColors.join(', ');
    }
}

function loadColorsIntoP icker(colors) {
    selectedColors = colors || [];
    
    // Clear all selections
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select the loaded colors
    selectedColors.forEach(colorName => {
        const element = document.querySelector([data-color-name=""]);
        if (element) {
            element.classList.add('selected');
        }
    });
    
    updateSelectedColorsDisplay();
}

// Initialize color picker when modal opens
const originalShowAddProductModal = showAddProductModal;
showAddProductModal = function() {
    originalShowAddProductModal();
    initializeColorPicker();
    selectedColors = [];
    updateSelectedColorsDisplay();
};

const originalEditProduct = editProduct;
editProduct = function(id) {
    originalEditProduct(id);
    initializeColorPicker();
    
    const product = products.find(p => p.id === id);
    if (product && product.colors) {
        loadColorsIntoP icker(product.colors);
    }
};
