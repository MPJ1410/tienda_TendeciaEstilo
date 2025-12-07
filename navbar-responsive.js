// ===== BARRA DE NAVEGACIÓN RESPONSIVE =====

(function () {
    'use strict';

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('🍔 Inicializando navegación responsive...');

        // Crear elementos necesarios
        createMobileElements();

        // Configurar event listeners
        setupEventListeners();

        // Configurar scroll header
        setupScrollHeader();

        console.log('✅ Navegación responsive lista');
    }

    // Crear elementos del menú móvil
    function createMobileElements() {
        const header = document.querySelector('.header-container');
        const nav = document.querySelector('.nav');

        if (!header || !nav) {
            console.error('❌ No se encontró header o nav');
            return;
        }

        // Crear botón hamburguesa si no existe
        let hamburger = document.querySelector('.hamburger-menu');

        if (!hamburger) {
            hamburger = document.createElement('button');
            hamburger.className = 'hamburger-menu';
            hamburger.setAttribute('aria-label', 'Menú de navegación');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;

            // Insertar después del logo
            const logo = header.querySelector('.logo');
            if (logo && logo.nextSibling) {
                header.insertBefore(hamburger, logo.nextSibling);
            } else {
                header.appendChild(hamburger);
            }

            console.log('✅ Botón hamburguesa creado');
        }

        // Crear overlay si no existe
        if (!document.querySelector('.nav-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            overlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(overlay);

            console.log('✅ Overlay creado');
        }
    }

    // Configurar event listeners
    function setupEventListeners() {
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('.nav');
        const overlay = document.querySelector('.nav-overlay');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!hamburger || !nav || !overlay) {
            console.error('❌ Elementos no encontrados');
            return;
        }

        // Toggle menú
        hamburger.addEventListener('click', function (e) {
            e.preventDefault();
            toggleMenu();
        });

        // Cerrar con overlay
        overlay.addEventListener('click', closeMenu);

        // Cerrar con links
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    setTimeout(closeMenu, 300);
                }
            });
        });

        // Cerrar con ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeMenu();
            }
        });

        // Cerrar al redimensionar
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (window.innerWidth > 768 && nav.classList.contains('active')) {
                    closeMenu();
                }
            }, 250);
        });

        console.log('✅ Event listeners configurados');
    }

    // Toggle menú
    function toggleMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('.nav');
        const overlay = document.querySelector('.nav-overlay');

        if (!hamburger || !nav || !overlay) return;

        const isActive = nav.classList.contains('active');

        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Abrir menú
    function openMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('.nav');
        const overlay = document.querySelector('.nav-overlay');

        if (!hamburger || !nav || !overlay) return;

        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');

        nav.classList.add('active');
        overlay.classList.add('active');

        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';

        console.log('📱 Menú abierto');
    }

    // Cerrar menú
    function closeMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const nav = document.querySelector('.nav');
        const overlay = document.querySelector('.nav-overlay');

        if (!hamburger || !nav || !overlay) return;

        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');

        nav.classList.remove('active');
        overlay.classList.remove('active');

        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';

        console.log('📱 Menú cerrado');
    }

    // Configurar header con scroll
    function setupScrollHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // Hacer funciones globales
    window.toggleMenu = toggleMenu;
    window.openMenu = openMenu;
    window.closeMenu = closeMenu;

})();
