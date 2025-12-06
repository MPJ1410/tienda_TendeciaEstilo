// Color mapping system at the beginning of script.js
const colorMap = {
    // Rojos
    'rojo': '#E53935',
    'rojo vino': '#880E4F',
    'rosa': '#EC407A',
    'rosa claro': '#F8BBD0',
    'fucsia': '#E91E63',
    
    // Azules
    'azul': '#1E88E5',
    'azul marino': '#0D47A1',
    'azul claro': '#81D4FA',
    'celeste': '#4FC3F7',
    'turquesa': '#00BCD4',
    
    // Verdes
    'verde': '#43A047',
    'verde oscuro': '#2E7D32',
    'verde claro': '#81C784',
    'menta': '#80CBC4',
    'oliva': '#9E9D24',
    
    // Amarillos/Naranjas
    'amarillo': '#FDD835',
    'naranja': '#FB8C00',
    'dorado': '#FFB300',
    'mostaza': '#F9A825',
    
    // Neutros
    'blanco': '#FFFFFF',
    'negro': '#212121',
    'gris': '#757575',
    'gris claro': '#BDBDBD',
    'gris oscuro': '#424242',
    'beige': '#D7CCC8',
    'crema': '#FFF8E1',
    'café': '#6D4C41',
    'marrón': '#5D4037',
    
    // Morados
    'morado': '#8E24AA',
    'lila': '#BA68C8',
    'violeta': '#7B1FA2',
    
    // Otros
    'coral': '#FF7043',
    'salmón': '#FFAB91',
    'lavanda': '#E1BEE7',
    'durazno': '#FFCCBC'
};

function getColorHex(colorName) {
    const normalized = colorName.toLowerCase().trim();
    return colorMap[normalized] || '#D4A574'; // Default to primary color
}
