/* ==========================================================================
   INTERACTIVIDAD Y LÓGICA - PRESENTACIÓN OWASP A06:2025
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLiveClock();
    initScrollObserver();
    initSidebarNavigation();
    initAgendaNavigation();
    initDesignDifferenceSlider();
    initCausesFlipping();
    initScenarioSimulator();
    initMatrixSelector();
    initThemeToggle();
});

/* ==========================================================================
   1. RELOJ DE TERMINAL EN VIVO
   ========================================================================== */
function initLiveClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}:${secs}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. OBSERVADOR DE SCROLL & CONTROL DE NAVEGACIÓN ACTIVA (SCROLL SPY)
   ========================================================================== */
let activeSlideIndex = 0;
const slides = document.querySelectorAll('.slide-section');
const dots = document.querySelectorAll('.nav-dot-container');
const currentSlideNumEl = document.getElementById('current-slide-num');

function initScrollObserver() {
    const observerOptions = {
        root: document.querySelector('.presentation-container'),
        threshold: 0.5 // Se activa cuando al menos el 50% de la diapositiva es visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                
                // Remover clase activa de todas las diapositivas y agregarla a la actual
                slides.forEach(s => s.classList.remove('active-slide'));
                entry.target.classList.add('active-slide');

                // Actualizar barra de estado y dots
                dots.forEach((dot, index) => {
                    if (dot.getAttribute('data-section') === targetId) {
                        dot.classList.add('active');
                        activeSlideIndex = index;
                        // Actualizar número de diapositiva en el pie de página
                        if (currentSlideNumEl) {
                            currentSlideNumEl.textContent = String(index + 1).padStart(2, '0');
                        }
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    slides.forEach(slide => observer.observe(slide));
}

/* ==========================================================================
   3. NAVEGACIÓN POR PUNTOS LATERALES (DOTS)
   ========================================================================== */
function initSidebarNavigation() {
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ==========================================================================
   4. NAVEGACIÓN DESDE EL MAPA DE NODOS (AGENDA)
   ========================================================================== */
function initAgendaNavigation() {
    const agendaNodes = document.querySelectorAll('.agenda-node');
    agendaNodes.forEach(node => {
        node.addEventListener('click', () => {
            const targetId = node.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ==========================================================================
   5. INTERACTIVE SLIDER: DISEÑO VS IMPLEMENTACIÓN (DIAPOSITIVA 3)
   ========================================================================== */
function initDesignDifferenceSlider() {
    const btnFlaw = document.getElementById('btn-flaw');
    const btnBug = document.getElementById('btn-bug');
    const displayTitle = document.getElementById('display-title');
    const displayDesc = document.getElementById('display-desc');
    const displayVisual = document.getElementById('display-visual');
    const displayIcon = document.querySelector('.display-icon');

    if (!btnFlaw || !btnBug) return;

    btnFlaw.addEventListener('click', () => {
        btnFlaw.classList.add('active');
        btnBug.classList.remove('active');
        
        displayIcon.className = 'display-icon red-glow';
        displayIcon.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a1 1 0 0 0-1-1h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2z"></path><path d="M3 9h4M3 15h4M9 21v-4M15 21v-4"></path></svg>';
        displayTitle.textContent = 'Diseño Inseguro (Falla de Diseño)';
        displayDesc.textContent = 'Diseñar una caja fuerte de alta gama pero con la pared trasera hecha de cartón. Aunque la cerradura esté instalada perfectamente sin errores de código, el sistema es vulnerable por su propia concepción estructural.';
        displayVisual.innerHTML = `
            <div class="box-safe design-flaw-view">
                <div class="safe-door">PUERTA DE ACERO (OK)</div>
                <div class="safe-wall-back flawed" style="background:#f43f5e; color:#000;">PARED DE CARTÓN (FALLA)</div>
            </div>
        `;
    });

    btnBug.addEventListener('click', () => {
        btnBug.classList.add('active');
        btnFlaw.classList.remove('active');

        displayIcon.className = 'display-icon yellow-glow';
        displayIcon.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
        displayTitle.textContent = 'Error de Codificación (Bug de Implementación)';
        displayDesc.textContent = 'Diseñar una caja fuerte blindada impenetrable de acero en todos sus lados, pero el fabricante olvida soldar la cerradura o deja la clave por defecto de fábrica. El diseño era robusto, pero falló la implementación.';
        displayVisual.innerHTML = `
            <div class="box-safe implementation-bug-view">
                <div class="safe-door" style="background:#e2e8f0; color:#0f172a; border: 2px dashed #f59e0b;">CERRADURA SUELTA (BUG)</div>
                <div class="safe-wall-back secure" style="background:#10b981; color:#fff;">PARED DE ACERO (OK)</div>
            </div>
        `;
    });
}

/* ==========================================================================
   6. GIRO DE TARJETAS DE CAUSAS PRINCIPALES (DIAPOSITIVA 6)
   ========================================================================== */
function initCausesFlipping() {
    const cards = document.querySelectorAll('.causa-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Alternar la clase flipped al hacer clic
            card.classList.toggle('flipped');
        });
    });
}

/* ==========================================================================
   7. SIMULADOR DE ESCENARIOS VULNERABLES (DIAPOSITIVA 7)
   ========================================================================== */

// Base de Datos de los Escenarios del Simulador
const scenariosData = {
    recovery: {
        title: "Recuperación de Contraseña",
        user: "admin@safebank.com",
        initialHtml: `
            <div class="mockup-title">Recuperar Acceso</div>
            <p style="font-size: 0.72rem; text-align: center; color: var(--color-text-muted); margin-bottom:10px;">Usuario: admin@safebank.com</p>
            <div class="mockup-group">
                <label>Pregunta de Seguridad:</label>
                <div style="font-size:0.8rem; color:#fff; font-weight:500; background:#1e293b; padding:8px; border-radius:4px; border: 1px solid rgba(255,255,255,0.05);">¿Cuál es tu color favorito?</div>
            </div>
            <div class="mockup-group">
                <label>Tu Respuesta:</label>
                <input type="text" class="mockup-input" id="sim-input-val" placeholder="Color..." readonly>
            </div>
            <button class="mockup-btn" style="background:#64748b; cursor:not-allowed;">Continuar</button>
        `,
        initialLogs: [
            "[SYSTEM] Cargado flujo de recuperación de contraseña heredado.",
            "[INFO] El sistema utiliza preguntas de seguridad de respuesta única e ignorando MFA."
        ],
        attackLogs: [
            "[ATTACK] Iniciando ataque de fuerza bruta / diccionario en respuestas.",
            "[ATTACK] Probando respuesta: 'azul' -> FAILED (Incorrecto)",
            "[ATTACK] Probando respuesta: 'verde' -> FAILED (Incorrecto)",
            "[ATTACK] Probando respuesta: 'rojo' -> SUCCESS (Coincidencia encontrada)",
            "[COMPROMISED] Respuesta validada. Sesión otorgada.",
            "[ACCESS] Login exitoso para el rol ADMINISTRADOR. Base de datos expuesta."
        ],
        attackHtml: `
            <div class="mockup-title" style="color:var(--color-accent-red)">ACCESO OTORGADO</div>
            <div style="background:rgba(255,51,102,0.1); border:1px solid var(--color-accent-red); border-radius:6px; padding:15px; text-align:center;">
                <p style="font-size:0.8rem; color:#fff; font-weight:bold; margin-bottom:5px;">SESIÓN INICIADA</p>
                <p style="font-size:0.75rem; color:var(--color-text-muted);">Bienvenido: Administrator</p>
                <div style="margin-top:8px;"><svg class="svg-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-accent-red)" stroke-width="2" style="display:inline-block;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg></div>
            </div>
            <p style="font-size:0.68rem; color:var(--color-accent-red); text-align:center;">Vulnerabilidad: Las preguntas estáticas son fáciles de adivinar.</p>
        `,
        fixLogs: [
            "[SECURE] Aplicando diseño seguro: Eliminación completa de preguntas de recuperación estáticas.",
            "[SECURE] Reemplazando mecanismo por autenticación de múltiples factores (MFA).",
            "[SECURE] Un token numérico temporal (OTP) de 6 dígitos se genera dinámicamente y se envía a la app móvil verificada.",
            "[SAFE] Ataque de adivinación bloqueado. El atacante carece del dispositivo físico registrado."
        ],
        fixHtml: `
            <div class="mockup-title" style="color:var(--color-accent-green)">SEGURIDAD ACTIVA</div>
            <div style="background:rgba(0,255,136,0.05); border:1px solid var(--color-accent-green); border-radius:6px; padding:15px; display:flex; flex-direction:column; gap:10px;">
                <p style="font-size:0.75rem; color:#fff; text-align:center;">Se requiere Token MFA de 6 dígitos</p>
                <input type="text" class="mockup-input" style="text-align:center; font-family:var(--font-code); font-size:1.1rem; letter-spacing:4px;" value="------" readonly>
                <button class="mockup-btn" style="background:var(--color-accent-green); color:var(--color-bg-dark);">Verificar OTP</button>
            </div>
        `
    },
    bypass: {
        title: "Bypass de Proceso",
        user: "Cliente #3391",
        initialHtml: `
            <div class="mockup-title">Proceso de Compra</div>
            <div style="display:flex; justify-content:space-around; font-size:0.65rem; color:var(--color-text-muted); border-bottom:1px solid #1e293b; padding-bottom:8px; margin-bottom:10px;">
                <span>1. Carrito</span>
                <span style="color:#ffd000; font-weight:bold;">2. Pago</span>
                <span>3. Despacho</span>
            </div>
            <div style="background:#1e293b; padding:10px; border-radius:4px; font-size:0.75rem;">
                <p>Artículo: Laptop Pro 15"</p>
                <p style="font-weight:bold; color:var(--color-accent-red); margin-top:4px;">Total a pagar: $1,250.00</p>
            </div>
            <button class="mockup-btn" style="background:#ffd000; color:#000;">Proceder a Pasarela de Pago</button>
        `,
        initialLogs: [
            "[SYSTEM] Cargada orden de compra #9914 en estado: PENDIENTE_DE_PAGO.",
            "[INFO] El flujo de navegación web redirige al usuario a la pasarela de pagos externa."
        ],
        attackLogs: [
            "[ATTACK] El atacante omite pagar e intenta forzar la finalización.",
            "[ATTACK] Modificando el flujo de navegación del cliente directamente.",
            "[ATTACK] Cambiando ruta de '/checkout/pago' a '/checkout/despacho?order=9914&paid=true'.",
            "[ATTACK] Enviando petición final de orden procesada al servidor.",
            "[COMPROMISED] ¡El servidor aceptó la orden! Falta de validación del estado de pago en backend. Orden enviada a despacho sin abonar $1,250.00."
        ],
        attackHtml: `
            <div class="mockup-title" style="color:var(--color-accent-red)">PROCESO INFECTADO</div>
            <div style="background:rgba(255,51,102,0.1); border:1px solid var(--color-accent-red); border-radius:6px; padding:12px; text-align:center;">
                <p style="font-size:0.8rem; color:#fff; font-weight:bold;">ORDEN PROCESADA</p>
                <p style="font-size:0.7rem; color:var(--color-accent-green); margin-top:5px;">Estado: Despachando sin pago recibido</p>
                <div style="margin-top:8px;"><svg class="svg-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-accent-red)" stroke-width="2" style="display:inline-block;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
            </div>
            <p style="font-size:0.68rem; color:var(--color-accent-red); text-align:center;">Vulnerabilidad: Confiar en parámetros de flujo manipulables en cliente.</p>
        `,
        fixLogs: [
            "[SECURE] Aplicando diseño seguro: Validación de flujos de negocio en el backend.",
            "[SECURE] Cada estado del pedido se verifica en la base de datos centralizada usando tokens criptográficos de un solo uso.",
            "[SECURE] El servidor rechaza la redirección a Despacho porque no existe ningún comprobante digital firmado por el procesador de pagos.",
            "[SAFE] Intento de bypass bloqueado. Redirigiendo a página de error 403."
        ],
        fixHtml: `
            <div class="mockup-title" style="color:var(--color-accent-green)">SEGURIDAD ACTIVA</div>
            <div style="background:rgba(0,255,136,0.05); border:1px solid var(--color-accent-green); border-radius:6px; padding:15px; text-align:center;">
                <p style="font-size:0.8rem; color:#f43f5e; font-weight:bold; margin-bottom:5px;">ERROR 403: ACCESO DENEGADO</p>
                <p style="font-size:0.72rem; color:var(--color-text-muted);">La orden #9914 no ha completado el pago de manera segura. Acción bloqueada en el servidor.</p>
                <div style="margin-top:8px;"><svg class="svg-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-accent-green)" stroke-width="2" style="display:inline-block;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
            </div>
        `
    },
    limits: {
        title: "Transacciones Ilimitadas",
        user: "Usuario Banco #9081",
        initialHtml: `
            <div class="mockup-title">Transferencia</div>
            <div class="mockup-group">
                <label>Cuenta Destino:</label>
                <input type="text" class="mockup-input" value="ES45 9012 3341..." readonly>
            </div>
            <div class="mockup-group">
                <label>Monto a transferir:</label>
                <input type="text" class="mockup-input" value="$5,000.00" readonly>
            </div>
            <button class="mockup-btn" style="background:#00e5ff; color:#000;">Ejecutar Pago</button>
        `,
        initialLogs: [
            "[SYSTEM] Interfaz de banca cargada.",
            "[INFO] Los endpoints de la API aceptan transacciones de manera directa y sin límites de frecuencia o volumen."
        ],
        attackLogs: [
            "[ATTACK] El atacante levanta un script para automatizar transferencias repetitivas.",
            "[ATTACK] Enviando 50 transacciones por segundo en paralelo de $5,000.00.",
            "[ATTACK] Transacción 1: OK -> Enviado",
            "[ATTACK] Transacción 15: OK -> Enviado",
            "[ATTACK] Transacción 40: OK -> Enviado",
            "[COMPROMISED] Cuenta bancaria vaciada. Retirados $200,000.00 en 4 segundos sin alertas de velocidad de API ni controles anti-fraude corporativos."
        ],
        attackHtml: `
            <div class="mockup-title" style="color:var(--color-accent-red)">RETIRO MASIVO EXITOSO</div>
            <div style="background:rgba(255,51,102,0.1); border:1px solid var(--color-accent-red); border-radius:6px; padding:15px; text-align:center;">
                <p style="font-size:0.8rem; color:#fff; font-weight:bold;">CUENTA DEBÍTADA</p>
                <p style="font-size:1.1rem; color:var(--color-accent-red); font-weight:bold; margin-top:5px;">Total Retirado: -$200,000.00</p>
            </div>
            <p style="font-size:0.68rem; color:var(--color-accent-red); text-align:center;">Vulnerabilidad: Ausencia de límites de transacciones y controles de abuso lógica.</p>
        `,
        fixLogs: [
            "[SECURE] Aplicando diseño seguro: Reglas de negocio restrictivas y control de tasa (Rate Limiting).",
            "[SECURE] Configurando límite de frecuencia de transacciones (máximo 2 por minuto por cuenta).",
            "[SECURE] Estableciendo monto máximo diario acumulado de transferencia ($10,000.00).",
            "[SECURE] El motor de seguridad del backend intercepta el script en el tercer intento y congela la cuenta por fraude.",
            "[SAFE] Cuenta bancaria protegida contra automatización."
        ],
        fixHtml: `
            <div class="mockup-title" style="color:var(--color-accent-green)">SEGURIDAD ACTIVA</div>
            <div style="background:rgba(0,255,136,0.05); border:1px solid var(--color-accent-green); border-radius:6px; padding:15px; text-align:center;">
                <p style="font-size:0.8rem; color:#ffd000; font-weight:bold; margin-bottom:5px;">TRANSACCIÓN SUSPENDIDA</p>
                <p style="font-size:0.7rem; color:var(--color-text-muted);">Bloqueo preventivo de seguridad: Se ha superado el límite permitido de transacciones por minuto.</p>
                <div style="margin-top:8px;"><svg class="svg-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-accent-yellow)" stroke-width="2" style="display:inline-block;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"></path></svg></div>
            </div>
        `
    },
    access: {
        title: "Control de Acceso URL",
        user: "Usuario Estándar",
        initialHtml: `
            <div class="mockup-title">Mi Cuenta</div>
            <div style="background:#1e293b; border-radius:6px; padding:12px; font-size:0.75rem; display:flex; flex-direction:column; gap:6px;">
                <p>Usuario: <strong>Juan Pérez</strong></p>
                <p>Nivel de Rol: <strong>USER</strong></p>
                <p>Visualización de Botón Admin: <span style="color:var(--color-accent-red);">OCULTO (CSS)</span></p>
            </div>
            <p style="font-size:0.65rem; color:var(--color-text-muted); text-align:center; margin-top:5px;">El menú no expone opciones avanzadas.</p>
        `,
        initialLogs: [
            "[SYSTEM] Inicializada sesión estándar para usuario 'Juan Pérez'.",
            "[INFO] El botón 'Administración' no es visible en el menú principal del lado del cliente."
        ],
        attackLogs: [
            "[ATTACK] Analizando estructura HTML e inspeccionando código Javascript público.",
            "[ATTACK] Identificando endpoint administrativo no listado en la interfaz.",
            "[ATTACK] Forzando cambio de ruta directo en la URL del navegador a '/admin/dashboard'.",
            "[ATTACK] Petición HTTP GET enviada al servidor.",
            "[COMPROMISED] ¡Acceso Total! El servidor devolvió el panel de administración completo porque la validación de acceso solo se hacía ocultando el botón en el frontend."
        ],
        attackHtml: `
            <div class="mockup-title" style="color:var(--color-accent-red)">CONSOLA ADMIN ABIERTA</div>
            <div style="background:rgba(255,51,102,0.1); border:1px solid var(--color-accent-red); border-radius:6px; padding:10px; font-family:var(--font-code); font-size:0.7rem; display:flex; flex-direction:column; gap:4px;">
                <p style="color:#fff; font-weight:bold; text-align:center; margin-bottom:5px;">ADMIN CONTROL PANEL</p>
                <p>▶ [Borrar Base Datos]</p>
                <p>▶ [Editar Cuentas Globales]</p>
                <p>▶ [Descargar Logs Clientes]</p>
            </div>
        `,
        fixLogs: [
            "[SECURE] Aplicando diseño seguro: Control de accesos granular en el backend basado en roles (RBAC).",
            "[SECURE] Cada petición que ingresa a rutas '/admin/*' se intercepta en el backend mediante un middleware de control de accesos.",
            "[SECURE] El servidor verifica la sesión JWT descifrada y confirma que el rol no posee el permiso 'ACCESS_ADMIN'.",
            "[SECURE] El servidor bloquea la respuesta devolviendo un código de estado HTTP 403 Forbidden nativo.",
            "[SAFE] Panel administrativo inaccesible para usuarios comunes."
        ],
        fixHtml: `
            <div class="mockup-title" style="color:var(--color-accent-green)">SEGURIDAD ACTIVA</div>
            <div style="background:rgba(0,255,136,0.05); border:1px solid var(--color-accent-green); border-radius:6px; padding:15px; text-align:center;">
                <p style="font-size:0.8rem; color:#ef4444; font-weight:bold; margin-bottom:5px;">HTTP ERROR 403 FORBIDDEN</p>
                <p style="font-size:0.7rem; color:var(--color-text-muted);">No posee privilegios para visualizar el recurso solicitado. Evento reportado al log de auditoría.</p>
                <div style="margin-top:8px;"><svg class="svg-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-accent-red)" stroke-width="2" style="display:inline-block;"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg></div>
            </div>
        `
    }
};

let currentScenario = 'recovery';

function initScenarioSimulator() {
    const options = document.querySelectorAll('.scenario-option');
    const mockupScreen = document.getElementById('mockup-screen');
    const userDisplay = document.getElementById('mockup-user-display');
    const terminalOutput = document.getElementById('terminal-output');
    
    const btnAttack = document.getElementById('btn-simulate-attack');
    const btnFix = document.getElementById('btn-apply-fix');

    if (!mockupScreen || !terminalOutput) return;

    // Cargar primer escenario al iniciar
    loadScenario(currentScenario);

    options.forEach(opt => {
        opt.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            currentScenario = opt.getAttribute('data-scenario');
            loadScenario(currentScenario);
        });
    });

    // Acción de Clic en "Simular Ataque"
    btnAttack.addEventListener('click', () => {
        simulateAttack();
    });

    // Acción de Clic en "Aplicar Diseño Seguro"
    btnFix.addEventListener('click', () => {
        simulateFix();
    });
}

function loadScenario(scenKey) {
    const data = scenariosData[scenKey];
    const mockupScreen = document.getElementById('mockup-screen');
    const userDisplay = document.getElementById('mockup-user-display');
    const terminalOutput = document.getElementById('terminal-output');

    if (!data) return;

    // Limpiar clases de estado
    document.querySelector('.app-mockup').className = 'app-mockup';
    document.querySelector('.panel-status').textContent = 'STATUS: READY';
    document.querySelector('.panel-status').className = 'panel-status';

    // Renderizar
    userDisplay.textContent = data.user;
    mockupScreen.innerHTML = data.initialHtml;

    // Renderizar logs iniciales en la consola
    terminalOutput.innerHTML = '';
    data.initialLogs.forEach(log => {
        const p = document.createElement('p');
        p.className = 'log-info';
        p.textContent = log;
        terminalOutput.appendChild(p);
    });
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Simular el ataque secuencialmente en el CLI simulado
function simulateAttack() {
    const data = scenariosData[currentScenario];
    const mockupScreen = document.getElementById('mockup-screen');
    const terminalOutput = document.getElementById('terminal-output');
    const statusLabel = document.querySelector('.panel-status');
    const mockupContainer = document.querySelector('.app-mockup');

    if (!data) return;

    // Resetear salida de consola
    terminalOutput.innerHTML = '';
    
    // Cambiar estado a alerta
    statusLabel.textContent = 'STATUS: INTRUSION ATTEMPT';
    statusLabel.className = 'panel-status badge-alert';
    mockupContainer.className = 'app-mockup';

    let logIndex = 0;
    
    function printNextLog() {
        if (logIndex < data.attackLogs.length) {
            const logText = data.attackLogs[logIndex];
            const p = document.createElement('p');
            
            if (logText.includes('[ATTACK]')) p.className = 'log-warn';
            else if (logText.includes('[COMPROMISED]') || logText.includes('[ACCESS]')) p.className = 'log-error';
            else p.className = 'log-info';
            
            p.textContent = logText;
            terminalOutput.appendChild(p);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            
            // Si el escenario es contraseña, hacer un pequeño efecto de escritura en el input mockup
            if (currentScenario === 'recovery' && logIndex > 0 && logIndex < 4) {
                const inputVal = document.getElementById('sim-input-val');
                if (inputVal) {
                    const colors = ["azul", "verde", "rojo"];
                    inputVal.value = colors[logIndex - 1];
                }
            }

            logIndex++;
            setTimeout(printNextLog, 650); // Delay entre mensajes para efecto cinemático
        } else {
            // Completado el ataque: actualizar interfaz a comprometida
            mockupScreen.innerHTML = data.attackHtml;
            mockupContainer.classList.add('compromised-state');
            statusLabel.textContent = 'STATUS: COMPROMISED';
            
            // Agregar estilo temporal de vibración de alarma en CSS
            mockupContainer.style.animation = 'glitch-shake 0.3s ease-out';
            setTimeout(() => mockupContainer.style.animation = '', 300);
        }
    }

    printNextLog();
}

// Simular la aplicación de la contramedida arquitectónica
function simulateFix() {
    const data = scenariosData[currentScenario];
    const mockupScreen = document.getElementById('mockup-screen');
    const terminalOutput = document.getElementById('terminal-output');
    const statusLabel = document.querySelector('.panel-status');
    const mockupContainer = document.querySelector('.app-mockup');

    if (!data) return;

    // Resetear salida de consola
    terminalOutput.innerHTML = '';
    
    // Cambiar estado a asegurar
    statusLabel.textContent = 'STATUS: DEPLOYING PATTERN';
    statusLabel.className = 'panel-status badge-tech';
    mockupContainer.className = 'app-mockup';

    let logIndex = 0;
    
    function printNextLog() {
        if (logIndex < data.fixLogs.length) {
            const logText = data.fixLogs[logIndex];
            const p = document.createElement('p');
            
            if (logText.includes('[SECURE]')) p.className = 'log-info';
            else if (logText.includes('[SAFE]')) p.className = 'log-success';
            else p.className = 'log-info';
            
            p.textContent = logText;
            terminalOutput.appendChild(p);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            
            logIndex++;
            setTimeout(printNextLog, 650);
        } else {
            // Completado el arreglo: actualizar interfaz a segura
            mockupScreen.innerHTML = data.fixHtml;
            mockupContainer.classList.add('secure-state');
            statusLabel.textContent = 'STATUS: SECURE';
            statusLabel.className = 'panel-status badge-pulse';
        }
    }

    printNextLog();
}

/* ==========================================================================
   8. MATRIZ DE DETECCIÓN E IDENTIFICACIÓN (DIAPOSITIVA 9)
   ========================================================================== */

const tacticsData = {
    threat: {
        title: "Modelado de Amenazas",
        objective: "Identificar posibles ataques y fallas arquitectónicas antes de escribir código.",
        eval: "Activos del sistema, límites de confianza, flujos de datos y amenazas potenciales (STRIDE).",
        result: "Conocer los riesgos potenciales del software y diseñar mitigaciones efectivas antes del desarrollo."
    },
    architecture: {
        title: "Revisión de Arquitectura",
        objective: "Analizar la estructura física y lógica del sistema contra patrones de seguridad conocidos.",
        eval: "Componentes, canales de comunicación, almacenamiento de datos, políticas de aislamiento e integraciones de terceros.",
        result: "Detectar inconsistencias estructurales, APIs expuestas innecesariamente y fallas de zonificación de red."
    },
    risk: {
        title: "Análisis de Riesgos",
        objective: "Evaluar la probabilidad de explotación y el impacto en el negocio de un fallo detectado.",
        eval: "Recursos críticos del negocio, vectores de amenazas externos/internos y controles compensatorios existentes.",
        result: "Una matriz priorizada de vulnerabilidades y un plan de remediación basado en el impacto real."
    },
    flow: {
        title: "Revisión de Procesos de Negocio",
        objective: "Comprobar que las reglas y límites comerciales no puedan ser evadidos o abusados.",
        eval: "Lógica de autenticación, flujos de transacciones financieras, control de flujos de registro y pasarelas de pago.",
        result: "Garantizar que el sistema rechace transacciones paralelas anómalas, bypass de compra o fraudes lógicos."
    }
};

function initMatrixSelector() {
    const buttons = document.querySelectorAll('.matrix-btn');
    const displayTitle = document.getElementById('tactic-title');
    const displayObjective = document.getElementById('tactic-objective');
    const displayEval = document.getElementById('tactic-eval');
    const displayResult = document.getElementById('tactic-result');

    if (!buttons || !displayTitle) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botones activos
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Cargar datos
            const tacticKey = btn.getAttribute('data-tactic');
            const data = tacticsData[tacticKey];

            if (data) {
                displayTitle.textContent = data.title;
                displayObjective.textContent = data.objective;
                displayEval.textContent = data.eval;
                displayResult.textContent = data.result;

                // Animación flash sutil en el panel
                const panel = document.getElementById('matrix-display-panel');
                panel.style.opacity = '0.3';
                panel.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    panel.style.opacity = '1';
                    panel.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
}

/* ==========================================================================
   9. CONTROLADOR DE CAMBIO DE TEMA (CLARO / OSCURO)
   ========================================================================== */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');
    
    if (!toggleBtn) return;
    
    // Buscar configuración previa
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'inline-block';
    }
    
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'inline-block';
        } else {
            localStorage.setItem('theme', 'dark');
            if (sunIcon) sunIcon.style.display = 'inline-block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
    });
}
