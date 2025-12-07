// ===== MENÚ HAMBURGUESA MÓVIL - VERSIÓN ACTUALIZADA =====

document.addEventListener('DOMContentLoaded', function () {

    // Obtener o crear elementos
    initializeMobileMenu();

    // Configurar event listeners
    setupMenuListeners();
});

// Inicializar menú móvil
function initializeMobileMenu() {
    const header = document.querySelector('.header-container');
    const nav = document.querySelector('.nav');

    if (!header || !nav) return;

    // Buscar botón existente o crear uno nuevo
    let hamburgerBtn = document.querySelector('.menu-toggle') || document.getElementById('hamburgerMenu');

    if (!hamburgerBtn) {
        // Crear botón si no existe
        hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-menu';
        hamburgerBtn.id = 'hamburgerMenu';
        hamburgerBtn.setAttribute('aria-label', 'Menú');
        hamburgerBtn.innerHTML = '<span></span><span></span><span></span>';

        const logo = header.querySelector('.logo');
        if (logo) {
            logo.after(hamburgerBtn);
        }
    } else {
        // Actualizar botón existente
        hamburgerBtn.id = 'hamburgerMenu';
        hamburgerBtn.className = 'hamburger-menu';
    }

    // Agregar ID al nav si no lo tiene
    if (!nav.id) {
        nav.id = 'mainNav';
    }

    // Crear overlay si no existe
    if (!document.getElementById('navOverlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.id = 'navOverlay';
        document.body.appendChild(overlay);
    }
}

// Configurar listeners
function setupMenuListeners() {
    const hamburgerBtn = document.getElementById('hamburgerMenu');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburgerBtn || !nav || !overlay) {
        console.error('Elementos del menú no encontrados');
        return;
    }

    // Toggle menú al hacer clic en hamburguesa
    hamburgerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Cerrar menú al hacer clic en overlay
    overlay.addEventListener('click', function () {
        closeMenu();
    });

    // Cerrar menú al hacer clic en un link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                setTimeout(closeMenu, 300);
            }
        });
    });

    // Cerrar menú al presionar ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Cerrar menú al redimensionar ventana
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });
}

// Abrir/Cerrar menú (toggle)
function toggleMenu() {
    const hamburgerBtn = document.getElementById('hamburgerMenu');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');

    if (!hamburgerBtn || !nav || !overlay) return;

    const isActive = nav.classList.contains('active');

    if (isActive) {
        closeMenu();
    } else {
        openMenu();
    }
}

// Abrir menú
function openMenu() {
    const hamburgerBtn = document.getElementById('hamburgerMenu');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');
    const body = document.body;

    if (!hamburgerBtn || !nav || !overlay) return;

    // Agregar clases activas
    hamburgerBtn.classList.add('active');
    nav.classList.add('active');
    overlay.classList.add('active');
    body.classList.add('menu-open');

    // Prevenir scroll
    body.style.overflow = 'hidden';

    console.log('Menú abierto');
}

// Cerrar menú
function closeMenu() {
    const hamburgerBtn = document.getElementById('hamburgerMenu');
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('navOverlay');
    const body = document.body;

    if (!hamburgerBtn || !nav || !overlay) return;

    // Quitar clases activas
    hamburgerBtn.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('menu-open');

    // Restaurar scroll
    body.style.overflow = '';

    console.log('Menú cerrado');
}

// Hacer funciones globales
window.toggleMenu = toggleMenu;
window.openMenu = openMenu;
window.closeMenu = closeMenu;

// Debug: Verificar que todo esté cargado
console.log('Hamburger menu script loaded');
console.log('Hamburger button:', document.getElementById('hamburgerMenu'));
console.log('Main nav:', document.getElementById('mainNav'));
console.log('Overlay:', document.getElementById('navOverlay'));
