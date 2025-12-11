// ===== Product Data Management =====
let products = [];
let currentProduct = null;
let currentImageIndex = 0;

// ===== Color Mapping System =====
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

// Load products from Supabase
async function loadProducts() {
    try {
        // Cargar productos desde Supabase
        products = await SupabaseService.getProducts();

        if (products.length === 0) {
            console.log('ℹ️ No hay productos en Supabase');
            // Intentar migrar desde localStorage si existe
            const localProducts = localStorage.getItem('products');
            if (localProducts) {
                console.log('🔄 Migrando productos desde localStorage...');
                await SupabaseService.migrateFromLocalStorage();
                // Recargar productos después de la migración
                products = await SupabaseService.getProducts();
            }
        }

        renderProducts();
        console.log(`✅ ${products.length} productos cargados desde Supabase`);
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        // Fallback a localStorage si Supabase falla
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            renderProducts();
            console.log('⚠️ Usando productos de localStorage (fallback)');
        }
    }
}


// ===== Product Rendering =====
function renderProducts(filter = 'todos') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filteredProducts = filter === 'todos'
        ? products
        : products.filter(p => p.category === filter);

    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });

    // Add stagger animation
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => openProductModal(product);

    // Get first image
    const productImage = product.images && product.images.length > 0
        ? product.images[0]
        : product.image;

    // Create colors HTML with real colors
    const colorsHTML = product.colors && product.colors.length > 0
        ? `<div class="product-colors">
            ${product.colors.map(color => {
            const hexColor = getColorHex(color);
            const borderColor = color.toLowerCase().includes('blanco') || color.toLowerCase().includes('crema') ? '#ddd' : hexColor;
            return `<span class="color-dot" style="background-color: ${hexColor}; border-color: ${borderColor};" title="${color}"></span>`;
        }).join('')}
           </div>`
        : '';

    card.innerHTML = `
        <div class="product-image">
            <img src="${productImage}" alt="${product.name}" onerror="this.src='assets/placeholder.jpg'">
            ${product.stock < 10 ? '<span class="product-badge">¡Últimas unidades!</span>' : ''}
        </div>
        <div class="product-info">
            <p class="product-category">${product.category === 'mujer' ? 'Mujer' : 'Hombre'}</p>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">S/ ${product.price.toFixed(2)}</p>
            <div class="product-sizes">
                ${product.sizes.map(size => `<span class="size-badge">${size}</span>`).join('')}
            </div>
            ${colorsHTML}
        </div>
    `;

    return card;
}

// ===== Product Modal with Image Gallery =====
function openProductModal(product) {
    currentProduct = product;
    currentImageIndex = 0;
    const modal = document.getElementById('productModal');

    // Get images array
    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    // Set initial image
    document.getElementById('modalImage').src = images[0];
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalCategory').textContent = product.category === 'mujer' ? 'Mujer' : 'Hombre';
    document.getElementById('modalPrice').textContent = `S/ ${product.price.toFixed(2)}`;
    document.getElementById('modalDescription').textContent = product.description;

    // Sizes
    document.getElementById('modalSizes').innerHTML = product.sizes.map(size =>
        `<span class="size-badge-large">${size}</span>`
    ).join('');

    // Colors with real colors
    const colorsContainer = document.getElementById('modalColors');
    if (product.colors && product.colors.length > 0) {
        colorsContainer.innerHTML = product.colors.map(color => {
            const hexColor = getColorHex(color);
            const borderColor = color.toLowerCase().includes('blanco') || color.toLowerCase().includes('crema') ? '#ddd' : hexColor;
            return `<span class="color-badge-large" style="background-color: ${hexColor}; border-color: ${borderColor}; color: ${color.toLowerCase().includes('blanco') || color.toLowerCase().includes('amarillo') || color.toLowerCase().includes('crema') ? '#333' : '#fff'};">${color}</span>`;
        }).join('');
        colorsContainer.parentElement.style.display = 'block';
    } else {
        colorsContainer.parentElement.style.display = 'none';
    }

    // Stock
    document.getElementById('modalStock').textContent = `Stock disponible: ${product.stock} unidades`;

    // Image gallery controls
    const galleryControls = document.getElementById('galleryControls');
    const imageIndicators = document.getElementById('imageIndicators');

    if (images.length > 1) {
        galleryControls.style.display = 'flex';
        imageIndicators.innerHTML = images.map((_, index) =>
            `<span class="indicator ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})"></span>`
        ).join('');
    } else {
        galleryControls.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function changeImage(index) {
    if (!currentProduct) return;

    const images = currentProduct.images && currentProduct.images.length > 0
        ? currentProduct.images
        : [currentProduct.image];

    if (index < 0 || index >= images.length) return;

    currentImageIndex = index;
    document.getElementById('modalImage').src = images[index];

    // Update indicators
    document.querySelectorAll('.indicator').forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
}

function previousImage() {
    if (!currentProduct) return;
    const images = currentProduct.images && currentProduct.images.length > 0
        ? currentProduct.images
        : [currentProduct.image];

    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    changeImage(newIndex);
}

function nextImage() {
    if (!currentProduct) return;
    const images = currentProduct.images && currentProduct.images.length > 0
        ? currentProduct.images
        : [currentProduct.image];

    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    changeImage(newIndex);
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProduct = null;
    currentImageIndex = 0;
}

// Close modal on outside click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

// ===== Filter Products =====
function filterProducts(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });

    // Render filtered products
    renderProducts(category);

    // Scroll to products section
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
}

// ===== WhatsApp Integration with Colors and Images =====
function contactWhatsApp() {
    if (!currentProduct) return;

    const phoneNumber = '51906174278'; // WhatsApp number

    // Get all images
    const images = currentProduct.images && currentProduct.images.length > 0
        ? currentProduct.images
        : [currentProduct.image];

    // Get the full URL of the product images
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
    const imageUrls = images.map(img => `${baseUrl}/${img}`);

    // Build colors text
    const colorsText = currentProduct.colors && currentProduct.colors.length > 0
        ? `\n🎨 Colores disponibles: ${currentProduct.colors.join(', ')}`
        : '';

    // Build images text
    const imagesText = imageUrls.length > 0
        ? `\n\n🖼️ Ver imágenes del producto:\n${imageUrls.map((url, i) => `Imagen ${i + 1}: ${url}`).join('\n')}`
        : '';

    const message = `Hola! Estoy interesado en el producto:\n\n` +
        `📦 ${currentProduct.name}\n` +
        `💰 Precio: S/ ${currentProduct.price.toFixed(2)}\n` +
        `📏 Tallas disponibles: ${currentProduct.sizes.join(', ')}` +
        colorsText +
        imagesText +
        `\n\n¿Podrías darme más información?`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ===== Contact Form =====
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            const phoneNumber = '51906174278';
            const whatsappMessage = `Hola! Soy ${name}\n\n` +
                `📱 Mi teléfono: ${phone}\n\n` +
                `Mensaje: ${message}`;

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');

            // Reset form
            contactForm.reset();
        });
    }
});

// ===== Navigation =====
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });

                    // Update active link
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }

        lastScroll = currentScroll;
    });
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        previousImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    console.log('🎨 Tienda cargada con colores reales y galería de imágenes');
});

// ===== Export functions for admin panel =====
window.productManager = {
    getProducts: () => products,
    addProduct: (product) => {
        product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(product);
        saveProducts();
        renderProducts();
    },
    updateProduct: (id, updatedProduct) => {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            saveProducts();
            renderProducts();
        }
    },
    deleteProduct: (id) => {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
    },
    saveProducts: saveProducts,
    loadProducts: loadProducts
};
