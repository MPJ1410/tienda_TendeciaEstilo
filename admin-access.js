// ===== ACCESO SECRETO AL PANEL ADMIN =====
// Presiona Ctrl + Shift + A para mostrar el botón de admin

let adminAccessEnabled = false;
let keySequence = [];
const secretKeys = ['Control', 'Shift', 'A'];

// Detectar combinación de teclas
document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + A
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAdminAccess();
    }
});

function toggleAdminAccess() {
    adminAccessEnabled = !adminAccessEnabled;

    const adminBtn = document.getElementById('admin-access-btn');

    if (adminAccessEnabled) {
        if (!adminBtn) {
            createAdminButton();
        } else {
            adminBtn.style.display = 'block';
        }
        console.log('🔓 Acceso admin activado');
    } else {
        if (adminBtn) {
            adminBtn.style.display = 'none';
        }
        console.log('🔒 Acceso admin desactivado');
    }
}

function createAdminButton() {
    // Crear botón flotante de admin
    const adminBtn = document.createElement('a');
    adminBtn.id = 'admin-access-btn';
    adminBtn.href = 'admin.html';
    adminBtn.className = 'admin-floating-btn';
    adminBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
        </svg>
        <span>Admin</span>
    `;
    adminBtn.title = 'Panel de Administración';

    document.body.appendChild(adminBtn);

    // Agregar estilos
    if (!document.getElementById('admin-btn-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-btn-styles';
        style.textContent = `
            .admin-floating-btn {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                text-decoration: none;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
                animation: slideInRight 0.5s ease;
            }
            
            .admin-floating-btn:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
            }
            
            .admin-floating-btn svg {
                width: 24px;
                height: 24px;
                margin-bottom: 2px;
            }
            
            .admin-floating-btn span {
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .admin-floating-btn {
                    bottom: 1rem;
                    right: 1rem;
                    width: 56px;
                    height: 56px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Mensaje de ayuda en consola
console.log('%c🔐 Acceso Admin', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cPresiona Ctrl + Shift + A para mostrar/ocultar el botón de admin', 'color: #666; font-size: 12px;');

// Exportar para uso global
window.toggleAdminAccess = toggleAdminAccess;
