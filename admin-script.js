// ===== Admin Password =====
const ADMIN_PASSWORD = "soledad123";

// ===== Login System =====
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginScreen = document.getElementById("loginScreen");
    const adminPanel = document.getElementById("adminPanel");

    const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
    if (isLoggedIn === "true") {
        showAdminPanel();
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const password = document.getElementById("admin-password").value;

            if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem("adminLoggedIn", "true");
                showAdminPanel();
            } else {
                alert("Contraseña incorrecta");
                document.getElementById("admin-password").value = "";
            }
        });
    }

    function showAdminPanel() {
        if (loginScreen) loginScreen.style.display = "none";
        if (adminPanel) adminPanel.style.display = "flex";
        loadProducts();
        setTimeout(initializeColorPicker, 100);
    }
});

function logout() {
    sessionStorage.removeItem("adminLoggedIn");
    location.reload();
}

let products = [];

function loadProducts() {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    updateDashboard();
    renderProductsTable();
    renderInventory();
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function showSection(sectionName) {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });
    if (event && event.target) {
        event.target.closest(".nav-item").classList.add("active");
    }

    document.querySelectorAll(".content-section").forEach(section => {
        section.classList.remove("active");
    });
    const targetSection = document.getElementById(sectionName + "-section");
    if (targetSection) {
        targetSection.classList.add("active");
    }

    const titles = {
        "dashboard": "Dashboard",
        "products": "Gestión de Productos",
        "inventory": "Control de Inventario"
    };
    const titleElement = document.getElementById("section-title");
    if (titleElement) {
        titleElement.textContent = titles[sectionName] || sectionName;
    }
}

function updateDashboard() {
    const totalProducts = products.length;
    const womenProducts = products.filter(p => p.category === "mujer").length;
    const menProducts = products.filter(p => p.category === "hombre").length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    const totalEl = document.getElementById("total-products");
    const womenEl = document.getElementById("women-products");
    const menEl = document.getElementById("men-products");
    const stockEl = document.getElementById("total-stock");

    if (totalEl) totalEl.textContent = totalProducts;
    if (womenEl) womenEl.textContent = womenProducts;
    if (menEl) menEl.textContent = menProducts;
    if (stockEl) stockEl.textContent = totalStock;

    updateCategoryChart(womenProducts, menProducts);
    updateLowStockList();
}

function updateCategoryChart(women, men) {
    const total = women + men;
    const chart = document.getElementById("category-chart");
    if (!chart) return;

    chart.innerHTML = "<div class=\"chart-bar\"><span class=\"chart-label\">Mujer</span><div class=\"chart-bar-container\"><div class=\"chart-bar-fill\" style=\"width: " + (total > 0 ? (women / total * 100) : 0) + "%\">" + women + "</div></div></div><div class=\"chart-bar\"><span class=\"chart-label\">Hombre</span><div class=\"chart-bar-container\"><div class=\"chart-bar-fill\" style=\"width: " + (total > 0 ? (men / total * 100) : 0) + "%\">" + men + "</div></div></div>";
}

function updateLowStockList() {
    const lowStockProducts = products.filter(p => (p.stock || 0) < 15).sort((a, b) => (a.stock || 0) - (b.stock || 0)).slice(0, 5);
    const list = document.getElementById("low-stock-list");
    if (!list) return;

    if (lowStockProducts.length === 0) {
        list.innerHTML = "<p style=\"color: var(--text-secondary); text-align: center;\">No hay productos con stock bajo</p>";
        return;
    }

    list.innerHTML = lowStockProducts.map(product => "<div class=\"low-stock-item " + ((product.stock || 0) < 5 ? "critical" : "") + "\"><span class=\"low-stock-name\">" + product.name + "</span><span class=\"low-stock-stock\">" + (product.stock || 0) + " unidades</span></div>").join("");
}

function renderProductsTable() {
    const tbody = document.getElementById("products-table-body");
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"8\" style=\"text-align: center; padding: 2rem; color: var(--text-secondary);\">No hay productos registrados.</td></tr>";
        return;
    }

    tbody.innerHTML = products.map(product => "<tr><td><div class=\"product-image-cell\"><img src=\"" + (product.images ? product.images[0] : product.image) + "\" alt=\"" + product.name + "\" onerror=\"this.src='assets/placeholder.jpg'\"></div></td><td><strong>" + product.name + "</strong></td><td><span class=\"category-badge " + product.category + "\">" + (product.category === "mujer" ? "Mujer" : "Hombre") + "</span></td><td><div class=\"colors-cell\">" + (product.colors ? product.colors.map(color => "<span class=\"color-badge\">" + color + "</span>").join("") : "-") + "</div></td><td><strong>S/ " + (product.price || 0).toFixed(2) + "</strong></td><td><div class=\"sizes-cell\">" + (product.sizes ? product.sizes.map(size => "<span class=\"size-tag\">" + size + "</span>").join("") : "-") + "</div></td><td><span class=\"stock-cell " + ((product.stock || 0) < 5 ? "stock-critical" : (product.stock || 0) < 10 ? "stock-low" : "") + "\">" + (product.stock || 0) + "</span></td><td><div class=\"actions-cell\"><button class=\"btn-icon btn-edit\" onclick=\"editProduct(" + product.id + ")\" title=\"Editar\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7\"></path><path d=\"M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z\"></path></svg></button><button class=\"btn-icon btn-delete\" onclick=\"deleteProduct(" + product.id + ")\" title=\"Eliminar\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2\"></path></svg></button></div></td></tr>").join("");
}

function renderInventory() {
    const grid = document.getElementById("inventory-grid");
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = "<div style=\"grid-column: 1/-1; text-align: center; padding: 2rem;\">No hay productos.</div>";
        return;
    }

    grid.innerHTML = products.map(product => {
        const stockPercentage = Math.min(((product.stock || 0) / 30) * 100, 100);
        const stockClass = (product.stock || 0) < 5 ? "critical" : (product.stock || 0) < 10 ? "low" : "";
        return "<div class=\"inventory-card\"><div class=\"inventory-image\"><img src=\"" + (product.images ? product.images[0] : product.image) + "\" alt=\"" + product.name + "\"></div><div class=\"inventory-info\"><div class=\"inventory-header\"><h3 class=\"inventory-name\">" + product.name + "</h3><span class=\"category-badge " + product.category + "\">" + (product.category === "mujer" ? "Mujer" : "Hombre") + "</span></div><div class=\"inventory-details\"><div class=\"inventory-detail\"><span class=\"inventory-detail-label\">Precio:</span><span class=\"inventory-detail-value\">S/ " + (product.price || 0).toFixed(2) + "</span></div><div class=\"inventory-detail\"><span class=\"inventory-detail-label\">Tallas:</span><span class=\"inventory-detail-value\">" + (product.sizes ? product.sizes.join(", ") : "-") + "</span></div><div class=\"inventory-detail\"><span class=\"inventory-detail-label\">Colores:</span><span class=\"inventory-detail-value\">" + (product.colors ? product.colors.join(", ") : "-") + "</span></div></div><div class=\"stock-bar\"><div class=\"stock-bar-label\"><span>Stock</span><span><strong>" + (product.stock || 0) + "</strong> unidades</span></div><div class=\"stock-bar-container\"><div class=\"stock-bar-fill " + stockClass + "\" style=\"width: " + stockPercentage + "%\"></div></div></div></div></div>";
    }).join("");
}

const availableColors = [
    { name: "Rojo", hex: "#E53935", light: false },
    { name: "Rojo Vino", hex: "#880E4F", light: false },
    { name: "Rosa", hex: "#EC407A", light: false },
    { name: "Rosa Claro", hex: "#F8BBD0", light: true },
    { name: "Fucsia", hex: "#E91E63", light: false },
    { name: "Azul", hex: "#1E88E5", light: false },
    { name: "Azul Marino", hex: "#0D47A1", light: false },
    { name: "Azul Claro", hex: "#81D4FA", light: true },
    { name: "Celeste", hex: "#4FC3F7", light: false },
    { name: "Turquesa", hex: "#00BCD4", light: false },
    { name: "Verde", hex: "#43A047", light: false },
    { name: "Verde Oscuro", hex: "#2E7D32", light: false },
    { name: "Verde Claro", hex: "#81C784", light: true },
    { name: "Menta", hex: "#80CBC4", light: true },
    { name: "Amarillo", hex: "#FDD835", light: true },
    { name: "Naranja", hex: "#FB8C00", light: false },
    { name: "Dorado", hex: "#FFB300", light: true },
    { name: "Blanco", hex: "#FFFFFF", light: true },
    { name: "Negro", hex: "#212121", light: false },
    { name: "Gris", hex: "#757575", light: false },
    { name: "Gris Claro", hex: "#BDBDBD", light: true },
    { name: "Beige", hex: "#D7CCC8", light: true },
    { name: "Crema", hex: "#FFF8E1", light: true },
    { name: "Café", hex: "#6D4C41", light: false },
    { name: "Marrón", hex: "#5D4037", light: false },
    { name: "Morado", hex: "#8E24AA", light: false },
    { name: "Lila", hex: "#BA68C8", light: false },
    { name: "Violeta", hex: "#7B1FA2", light: false },
    { name: "Coral", hex: "#FF7043", light: false },
    { name: "Salmón", hex: "#FFAB91", light: true }
];

let selectedColors = [];

function initializeColorPicker() {
    const grid = document.getElementById("colorPickerGrid");
    if (!grid) return;

    grid.innerHTML = "";
    availableColors.forEach(color => {
        const colorDiv = document.createElement("div");
        colorDiv.className = "color-option";
        colorDiv.style.backgroundColor = color.hex;
        colorDiv.style.borderColor = color.light ? "#ddd" : color.hex;
        colorDiv.setAttribute("data-color-name", color.name);
        colorDiv.setAttribute("data-light", color.light);
        colorDiv.title = color.name;
        colorDiv.onclick = () => toggleColorSelection(color.name, colorDiv);
        grid.appendChild(colorDiv);
    });
}

function toggleColorSelection(colorName, element) {
    const index = selectedColors.indexOf(colorName);
    if (index > -1) {
        selectedColors.splice(index, 1);
        element.classList.remove("selected");
    } else {
        selectedColors.push(colorName);
        element.classList.add("selected");
    }
    updateSelectedColorsDisplay();
}

function updateSelectedColorsDisplay() {
    const textElement = document.getElementById("selected-colors-text");
    const hiddenInput = document.getElementById("product-colors-hidden");

    if (selectedColors.length === 0) {
        if (textElement) {
            textElement.textContent = "Ninguno";
            textElement.style.color = "#999";
        }
        if (hiddenInput) hiddenInput.value = "";
    } else {
        if (textElement) {
            textElement.textContent = selectedColors.join(", ");
            textElement.style.color = "var(--primary)";
        }
        if (hiddenInput) hiddenInput.value = selectedColors.join(", ");
    }
}

function loadColorsIntoPicker(colors) {
    selectedColors = colors || [];
    document.querySelectorAll(".color-option").forEach(opt => {
        opt.classList.remove("selected");
    });
    selectedColors.forEach(colorName => {
        const element = document.querySelector("[data-color-name=\"" + colorName + "\"]");
        if (element) {
            element.classList.add("selected");
        }
    });
    updateSelectedColorsDisplay();
}

function showAddProductModal() {
    const modalTitle = document.getElementById("modal-form-title");
    const form = document.getElementById("productForm");
    const productId = document.getElementById("product-id");

    if (modalTitle) modalTitle.textContent = "Agregar Producto";
    if (form) form.reset();
    if (productId) productId.value = "";

    const modal = document.getElementById("productFormModal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    setTimeout(() => {
        initializeColorPicker();
        selectedColors = [];
        updateSelectedColorsDisplay();
    }, 100);
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modalTitle = document.getElementById("modal-form-title");
    if (modalTitle) modalTitle.textContent = "Editar Producto";

    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-stock").value = product.stock;
    document.getElementById("product-sizes").value = product.sizes ? product.sizes.join(", ") : "";
    document.getElementById("product-description").value = product.description;

    if (product.images && product.images.length > 0) {
        document.getElementById("product-image-1").value = product.images[0] || "";
        document.getElementById("product-image-2").value = product.images[1] || "";
        document.getElementById("product-image-3").value = product.images[2] || "";
    } else if (product.image) {
        document.getElementById("product-image-1").value = product.image;
    }

    const modal = document.getElementById("productFormModal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    setTimeout(() => {
        initializeColorPicker();
        if (product.colors) {
            loadColorsIntoPicker(product.colors);
        }
    }, 100);
}

function closeProductFormModal() {
    const modal = document.getElementById("productFormModal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

function deleteProduct(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    products = products.filter(p => p.id !== id);
    saveProducts();
    updateDashboard();
    renderProductsTable();
    renderInventory();
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("productForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("product-id").value;
        const images = [];
        const img1 = document.getElementById("product-image-1").value.trim();
        const img2 = document.getElementById("product-image-2").value.trim();
        const img3 = document.getElementById("product-image-3").value.trim();

        if (img1) images.push(img1);
        if (img2) images.push(img2);
        if (img3) images.push(img3);

        const productData = {
            name: document.getElementById("product-name").value,
            category: document.getElementById("product-category").value,
            price: parseFloat(document.getElementById("product-price").value),
            stock: parseInt(document.getElementById("product-stock").value),
            sizes: document.getElementById("product-sizes").value.split(",").map(s => s.trim()),
            colors: selectedColors,
            description: document.getElementById("product-description").value,
            images: images,
            image: images[0] || ""
        };

        if (id) {
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };
            }
        } else {
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...productData });
        }

        saveProducts();
        updateDashboard();
        renderProductsTable();
        renderInventory();
        closeProductFormModal();
        alert(id ? "Producto actualizado" : "Producto agregado");
    });

    const modal = document.getElementById("productFormModal");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeProductFormModal();
            }
        });
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeProductFormModal();
    }
});
