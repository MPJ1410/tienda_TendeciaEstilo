// ===== ACCESO SECRETO AL PANEL ADMIN =====
// Desktop: Ctrl + Shift + A
// Móvil: Triple tap en esquina superior derecha O shake del dispositivo

let adminAccessEnabled = false;
let tapCount = 0;
let tapTimer = null;

// ===== DETECCIÓN DE TECLADO (DESKTOP) =====
document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + A
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAdminAccess();
    }
});

// ===== DETECCIÓN DE TRIPLE TAP (MÓVIL) =====
let lastTap = 0;
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;

    // Verificar si el tap es en la esquina superior derecha
    const isTopRight = touch.clientX > window.innerWidth - 100 && touch.clientY < 100;

    if (isTopRight && timeSinceLastTap < 500 && timeSinceLastTap > 0) {
        tapCount++;

        if (tapCount === 3) {
            // Triple tap detectado!
            toggleAdminAccess();
            tapCount = 0;

            // Mostrar feedback visual
            showTapFeedback(touch.clientX, touch.clientY);
        }

        // Reset después de 1 segundo
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => {
            tapCount = 0;
        }, 1000);
    } else if (isTopRight) {
        tapCount = 1;
    }

    lastTap = now;
});

// ===== DETECCIÓN DE SHAKE (MÓVIL) =====
let lastX = 0, lastY = 0, lastZ = 0;
let shakeThreshold = 15;
let lastShakeTime = 0;

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (e) => {
        const acceleration = e.accelerationIncludingGravity;

        if (!acceleration) return;

        const deltaX = Math.abs(acceleration.x - lastX);
        const deltaY = Math.abs(acceleration.y - lastY);
        const deltaZ = Math.abs(acceleration.z - lastZ);

        const now = Date.now();

        if ((deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) &&
            now - lastShakeTime > 1000) {
            // Shake detectado!
            if (!adminAccessEnabled) {
                toggleAdminAccess();
                showShakeFeedback();
                lastShakeTime = now;
            }
        }

        lastX = acceleration.x;
        lastY = acceleration.y;
        lastZ = acceleration.z;
    });
}

// ===== FEEDBACK VISUAL =====
function showTapFeedback(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'admin-tap-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1000);
}

function showShakeFeedback() {
    const message = document.createElement('div');
    message.className = 'admin-shake-message';
    message.textContent = '🔓 Acceso Admin Activado';
    document.body.appendChild(message);

    setTimeout(() => message.remove(), 2000);
}

// ===== TOGGLE ADMIN ACCESS =====
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

        // Vibración en móvil
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
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
            
            /* Feedback visual para tap */
            .admin-tap-ripple {
                position: fixed;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: rgba(102, 126, 234, 0.3);
                transform: translate(-50%, -50%) scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
                z-index: 9999;
            }
            
            /* Mensaje de shake */
            .admin-shake-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1.5rem 2rem;
                border-radius: 12px;
                font-size: 1.2rem;
                font-weight: 600;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.5);
                z-index: 9999;
                animation: fadeInOut 2s ease;
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
            
            @keyframes rippleEffect {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
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
console.log('%c📱 Móvil: Triple tap en esquina superior derecha O shake', 'color: #666; font-size: 12px;');
console.log('%c💻 Desktop: Ctrl + Shift + A', 'color: #666; font-size: 12px;');

// Exportar para uso global
window.toggleAdminAccess = toggleAdminAccess;
