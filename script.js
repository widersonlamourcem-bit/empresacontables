// --- Global Variables ---
let windowLoaded = false;
window.addEventListener('load', () => { windowLoaded = true; });

// --- Preloader & Curtain Logic (Immediate Execution) ---
const initLoader = () => {
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loader-progress');
    const loaderPercentage = document.getElementById('loader-percentage');
    const loaderLogo = document.querySelector('.loader-logo');
    const curtain = document.getElementById('curtain');
    const mainWrapper = document.getElementById('main-wrapper');

    function finishLoading() {
        if (!loader || loader.getAttribute('data-finished') === "true") return;
        loader.setAttribute('data-finished', 'true');

        setTimeout(() => {
            loader.classList.add('hidden');
            if (curtain) {
                curtain.classList.add('active');
                setTimeout(() => {
                    curtain.classList.add('open');
                    if (mainWrapper) {
                        mainWrapper.classList.remove('content-hidden');
                        mainWrapper.classList.add('content-visible');
                    }
                    document.body.classList.remove('content-loading');
                    document.body.classList.add('content-ready');
                    
                    // Inicializar sistemas pesados
                    if (typeof window.initAllSystems === 'function') window.initAllSystems();

                    setTimeout(() => {
                        curtain.style.display = 'none';
                        window.scrollTo(0, 0);
                        if (window.refreshReveal) window.refreshReveal();
                    }, 1200);
                }, 800); 
            } else {
                if (mainWrapper) {
                    mainWrapper.classList.remove('content-hidden');
                    mainWrapper.classList.add('content-visible');
                }
                document.body.classList.remove('content-loading');
                document.body.classList.add('content-ready');
                if (typeof window.initAllSystems === 'function') window.initAllSystems();
            }
        }, 200);
    }

    if (loader) {
        let progress = 0;
        const startTime = Date.now();
        const duration = 1200; // 1.2 segundos (Carga rápida)

        const updateLoader = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            
            // Progreso acelerado
            let timeProgress = (elapsed / duration) * 100;
            
            // Si el window ya cargó, forzamos el final
            if (windowLoaded) timeProgress = Math.max(timeProgress, 100);

            progress = timeProgress;
            if (progress > 100) progress = 100;

            if (loaderProgress) loaderProgress.style.width = `${progress}%`;
            if (loaderPercentage) loaderPercentage.innerText = `${Math.floor(progress)}%`;

            if (progress < 100) {
                requestAnimationFrame(updateLoader);
            } else {
                finishLoading();
            }
        };

        if (loaderLogo) loaderLogo.classList.add('pulse');
        requestAnimationFrame(updateLoader);
        setTimeout(finishLoading, 3000); // Seguridad 3s
    }
};

// Ejecutar loader de inmediato
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
} else {
    initLoader();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing systems...");

    const initParticles = () => {
        if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
            try {
                particlesJS('particles-js', {
                    "particles": {
                        "number": { "value": 8, "density": { "enable": true, "value_area": 1500 } },
                        "color": { "value": "#c5a059" },
                        "shape": { "type": "circle" },
                        "opacity": { "value": 0.1, "random": false },
                        "size": { "value": 1, "random": true },
                        "line_linked": { "enable": true, "distance": 120, "color": "#c5a059", "opacity": 0.02, "width": 1 },
                        "move": { "enable": true, "speed": 0.4, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": { "onhover": { "enable": false }, "onclick": { "enable": false }, "resize": true }
                    },
                    "retina_detect": false
                });
            } catch (e) {
                console.error("Particles.js optimization failed:", e);
            }
        }
    };

    const initNonCriticalSystems = () => {
        // --- Typed.js ---
        if (document.getElementById('typed-text') && typeof Typed !== 'undefined') {
            try {
                new Typed('#typed-text', {
                    strings: [
                        'Soluciones contables para empresas.',
                        'Asesoría fiscal estratégica.',
                        'Gestión financiera transparente.',
                        'Crecimiento para emprendedores.'
                    ],
                    typeSpeed: 50,
                    backSpeed: 30,
                    loop: true,
                    backDelay: 2000
                });
            } catch (e) {
                console.error("Typed.js initialization failed:", e);
            }
        }

        // --- Search Overlay Logic ---
        if (typeof initSearchOverlay === 'function') initSearchOverlay();

        // --- Enterprise & Cart Unified Logic ---
        if (typeof initEnterpriseAndCart === 'function') initEnterpriseAndCart();

        // --- Shopping Cart Logic ---
        if (typeof initShoppingCart === 'function') initShoppingCart();
    };

    window.initAllSystems = () => {
        initParticles();
        initNonCriticalSystems();
    };
    
    // --- Brochure Modal Logic ---
    const brochureModal = document.getElementById('brochure-modal');
    const closeBrochureBtn = document.getElementById('close-brochure');
    const downloadBrochureBtn = document.getElementById('download-brochure');

    const openBrochure = () => {
        if (brochureModal) {
            brochureModal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    };

    const closeBrochure = () => {
        if (brochureModal) {
            brochureModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    };

    if (closeBrochureBtn) {
        closeBrochureBtn.addEventListener('click', closeBrochure);
    }

    if (brochureModal) {
        brochureModal.addEventListener('click', (e) => {
            if (e.target === brochureModal) closeBrochure();
        });
    }

    // Abrir automáticamente si hay un hash #brochure en la URL o después de cargar
    window.addEventListener('load', () => {
        if (window.location.hash === '#brochure') {
            setTimeout(openBrochure, 1000);
        }
    });

    // --- Optimized Scroll Handler (Throttled for 120Hz) ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        if (!navbar.classList.contains('scrolled')) navbar.classList.add('scrolled');
                    } else {
                        if (navbar.classList.contains('scrolled')) navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Dropdown toggle for mobile
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');

    if (dropdownToggle && window.innerWidth <= 1024) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            if (dropdown) dropdown.classList.toggle('mobile-active');
        });
    }

    // Close mobile menu when clicking a link

    // --- Smooth Scrolling & Cinematic Section Transitions ---
    const performImmediateScroll = (targetId) => {
        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'auto'
            });
            history.pushState(null, null, targetId);
        }
    };

    document.querySelectorAll('.nav-links a[href^="#"], .dropdown-menu a[href^="#"], .search-suggestions a[href^="#"], .footer-links a[href^="#"], .btn-primary[href="#contact"], .hero-btns a[href^="#"], .pricing-card a[href^="#"], .bottom-nav-item[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;
            
            e.preventDefault();
            const targetId = href;
            
            performImmediateScroll(targetId);
            
            const navLinks = document.querySelector('.nav-links');
            const dropdown = document.querySelector('.dropdown-menu');
            if (navLinks) navLinks.classList.remove('active');
            if (dropdown) dropdown.classList.remove('mobile-active');
            const searchOverlay = document.getElementById('search-overlay');
            if (searchOverlay) searchOverlay.classList.remove('active');

            document.querySelectorAll('.nav-links a, .bottom-nav-item').forEach(link => link.classList.remove('active'));
            const mainNavLink = document.querySelector(`.nav-links a[href="${targetId}"]`);
            const bottomNavLink = document.querySelector(`.bottom-nav-item[href="${targetId}"]`);
            if (mainNavLink) mainNavLink.classList.add('active');
            if (bottomNavLink) bottomNavLink.classList.add('active');
        });
    });

    // --- Active Nav Item on Scroll ---
    const updateActiveNavOnScroll = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a, .bottom-nav-item');
        
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

    // Manejar el scroll correcto al cargar o actualizar la página con un hash en la URL
    window.addEventListener('load', () => {
        if (window.location.hash) {
            // Pequeño delay para asegurar que el contenido esté renderizado
            setTimeout(() => {
                performImmediateScroll(window.location.hash);
            }, 100);
        }
    });

    // --- Pricing More Info Toggle ---
    document.querySelectorAll('.btn-more-info').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.more-info-container');
            const content = container.querySelector('.info-content');
            
            // Toggle active class
            btn.classList.toggle('active');
            content.classList.toggle('active');
            
            // Cambiar texto según el estado
            if (btn.classList.contains('active')) {
                btn.innerHTML = `Menos Información <i class="fas fa-chevron-up"></i>`;
            } else {
                btn.innerHTML = `Más Informaciones <i class="fas fa-chevron-down"></i>`;
            }
        });
    });

    // --- Form Handling ---
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // --- Search Overlay Logic ---
    function initSearchOverlay() {
        const searchOverlay = document.getElementById('search-overlay');
        const openSearchBtns = [document.getElementById('open-search'), document.getElementById('open-search-mobile')];
        const closeSearchBtn = document.getElementById('close-search');
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');

        if (searchOverlay) {
            const searchableContent = [
                { title: 'Sobre Nosotros', text: 'Expertos Contables RD es una firma líder en servicios contables.', link: '#about' },
                { title: 'Asesoría Fiscal', text: 'Optimizamos tus impuestos y cumplimos con normativas.', link: '#services' },
                { title: 'Auditoría', text: 'Revisión exhaustiva de tus estados financieros.', link: '#services' },
                { title: 'Gestión de Nóminas', text: 'Administración profesional de empleados y salarios.', link: '#services' },
                { title: 'Planes Mensuales', text: 'Paquetes adaptados a emprendedores y grandes empresas.', link: '#pricing' },
                { title: 'Tienda Digital', text: 'Plantillas y herramientas contables listas para usar.', link: '#shop' },
                { title: 'Organigrama', text: 'Conoce nuestra estructura y equipo de liderazgo.', link: '#org-chart' },
                { title: 'Contacto', text: 'Solicita una consultoría gratis hoy mismo.', link: '#contact' }
            ];

            openSearchBtns.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', () => {
                        searchOverlay.classList.add('active');
                        document.body.classList.add('modal-open');
                        setTimeout(() => searchInput.focus(), 500);
                    });
                }
            });

            if (closeSearchBtn) {
                closeSearchBtn.addEventListener('click', () => {
                    searchOverlay.classList.remove('active');
                    document.body.classList.remove('modal-open');
                    if (searchInput) searchInput.value = '';
                    if (searchResults) searchResults.innerHTML = '';
                });
            }

            if (searchInput && searchResults) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase().trim();
                    searchResults.innerHTML = '';

                    if (query.length < 2) return;

                    const matches = searchableContent.filter(item => 
                        item.title.toLowerCase().includes(query) || 
                        item.text.toLowerCase().includes(query)
                    );

                    if (matches.length > 0) {
                        matches.forEach(match => {
                            const resultItem = document.createElement('div');
                            resultItem.className = 'search-result-item';
                            resultItem.innerHTML = `
                                <h4>${match.title}</h4>
                                <p>${match.text}</p>
                            `;
                            resultItem.addEventListener('click', () => {
                                window.location.href = match.link;
                                searchOverlay.classList.remove('active');
                            });
                            searchResults.appendChild(resultItem);
                        });
                    } else {
                        searchResults.innerHTML = `<p class="no-results">No se encontraron resultados para "${query}"</p>`;
                    }
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                    searchOverlay.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }
            });
        }
    }

    // --- Enterprise & Cart Unified Logic ---
    function initEnterpriseAndCart() {
        const enterprisePanelEl = document.getElementById('enterprise-panel');
        const openEnterpriseBtns = [document.getElementById('open-enterprise'), document.getElementById('open-enterprise-mobile')];
        const closeEnterpriseBtn = document.getElementById('close-enterprise');
        const enterpriseList = document.getElementById('enterprise-list');
        const enterpriseDetail = document.getElementById('enterprise-detail');
        const detailTitle = document.getElementById('detail-title');
        const detailBody = document.getElementById('detail-body');
        const backToListBtn = document.getElementById('back-to-list');

        const cartPanelEl = document.getElementById('cart-panel');
        const openCartBtn = document.getElementById('open-cart');
        const closeCartBtn = document.getElementById('close-cart');

        const enterpriseSections = {
            agenda: {
                title: 'Calendario Empresarial',
                content: `
                    <div class="calendar-container">
                        <div class="calendar-header"><span class="month-name">Mayo 2026</span></div>
                        <div class="calendar-grid">
                            <div class="day-label">D</div><div class="day-label">L</div><div class="day-label">M</div><div class="day-label">M</div><div class="day-label">J</div><div class="day-label">V</div><div class="day-label">S</div>
                            <div class="day empty"></div><div class="day empty"></div><div class="day empty"></div><div class="day empty"></div><div class="day empty"></div><div class="day">1</div><div class="day">2</div>
                            <div class="day">3</div><div class="day">4</div><div class="day">5</div><div class="day">6</div><div class="day">7</div><div class="day">8</div><div class="day">9</div>
                            <div class="day">10</div><div class="day">11</div><div class="day">12</div><div class="day">13</div><div class="day">14</div><div class="day event" title="Reunión Trimestral">15</div><div class="day">16</div>
                            <div class="day">17</div><div class="day">18</div><div class="day">19</div><div class="day">20</div><div class="day">21</div><div class="day event" title="Workshop Fiscal">22</div><div class="day">23</div>
                            <div class="day">24</div><div class="day">25</div><div class="day">26</div><div class="day">27</div><div class="day">28</div><div class="day">29</div><div class="day event" title="Cierre Mensual">30</div>
                            <div class="day">31</div>
                        </div>
                    </div>
                    <div class="detail-section-item" style="margin-top: 2rem;">
                        <h5>Próximos Eventos</h5>
                        <p><strong>15 May:</strong> Reunión Trimestral (10:00 AM)</p>
                        <p><strong>22 May:</strong> Workshop Fiscal (3:00 PM)</p>
                        <p><strong>30 May:</strong> Cierre Mensual Clientes Premium</p>
                    </div>`
            },
            horario: {
                title: 'Días y Horario Laboral',
                content: `
                    <div class="detail-section-item"><h5>Lunes a Viernes</h5><p><i class="fas fa-clock"></i> 8:00 AM - 6:00 PM</p></div>
                    <div class="detail-section-item"><h5>Sábados</h5><p><i class="fas fa-clock"></i> 9:00 AM - 1:00 PM</p></div>
                    <div class="detail-section-item"><h5>Domingos y Feriados</h5><p><i class="fas fa-calendar-times"></i> Cerrado</p></div>`
            },
            base_datos: {
                title: 'Base de Datos - Documentos Empleados',
                content: `
                    <div class="db-search-bar" style="margin-bottom: 1.5rem;"><input type="text" placeholder="Filtrar secciones..." style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid var(--accent-gold); background: rgba(0,0,0,0.2); color: white;"></div>
                    <div class="detail-section-item"><h5><i class="fas fa-file-pdf"></i> Contratos de Trabajo</h5><button class="btn-primary db-sub-btn" data-sub="db_contratos">Abrir Listado</button></div>
                    <div class="detail-section-item"><h5><i class="fas fa-file-excel"></i> Excel de Contabilidad</h5><button class="btn-primary db-sub-btn" data-sub="db_excel">Ver Flujo de Caja</button></div>
                    <div class="detail-section-item"><h5><i class="fas fa-folder-open"></i> Expedientes Personales</h5><button class="btn-primary db-sub-btn" data-sub="db_expedientes">Abrir Carpeta</button></div>
                    <div class="detail-section-item"><h5><i class="fas fa-shield-alt"></i> Seguros Médicos y Riesgos</h5><button class="btn-primary db-sub-btn" data-sub="db_seguros">Consultar Pólizas</button></div>`
            },
            db_contratos: {
                title: 'Listado de Contratos de Trabajo',
                content: `
                    <div class="db-table-wrapper">
                        <table class="db-table">
                            <thead><tr><th>Nombre Completo</th><th>Cédula</th><th>Teléfono</th><th>Email</th></tr></thead>
                            <tbody>
                                <tr><td>Juan Alberto Pérez</td><td>001-2345678-9</td><td>809-555-0101</td><td>juan.perez@email.com</td></tr>
                                <tr><td>María Rodríguez</td><td>002-8765432-1</td><td>829-555-0202</td><td>m.rodriguez@email.com</td></tr>
                                <tr><td>Carlos Manuel Matos</td><td>001-9988776-5</td><td>809-555-0303</td><td>c.matos@email.com</td></tr>
                                <tr><td>Ana Lucía García</td><td>402-1122334-4</td><td>849-555-0404</td><td>ana.garcia@email.com</td></tr>
                                <tr><td>Roberto Sánchez</td><td>001-5544332-2</td><td>809-555-0505</td><td>r.sanchez@email.com</td></tr>
                                <tr><td>Laura Martínez</td><td>001-6677889-0</td><td>829-555-0606</td><td>l.martinez@email.com</td></tr>
                                <tr><td>Ricardo Almonte</td><td>001-7788990-1</td><td>809-555-0707</td><td>r.almonte@email.com</td></tr>
                                <tr><td>Patricia Espinal</td><td>001-8899001-2</td><td>829-555-0808</td><td>p.espinal@email.com</td></tr>
                                <tr><td>Miguel Tejada</td><td>001-9900112-3</td><td>809-555-0909</td><td>m.tejada@email.com</td></tr>
                                <tr><td>Elena Vargas</td><td>001-1122334-5</td><td>849-555-1010</td><td>e.vargas@email.com</td></tr>
                                <tr><td>José Luis Peralta</td><td>001-2233445-6</td><td>809-555-1111</td><td>j.peralta@email.com</td></tr>
                                <tr><td>Carmen Rosario</td><td>001-3344556-7</td><td>829-555-1212</td><td>c.rosario@email.com</td></tr>
                                <tr><td>Andrés Tavárez</td><td>001-4455667-8</td><td>809-555-1313</td><td>a.tavarez@email.com</td></tr>
                                <tr><td>Sofía Méndez</td><td>001-5566778-9</td><td>849-555-1414</td><td>s.mendez@email.com</td></tr>
                            </tbody>
                        </table>
                    </div>`
            },
            db_excel: {
                title: 'Flujo de Caja - Contabilidad',
                content: `
                    <div class="db-table-wrapper">
                        <table class="db-table">
                            <thead><tr><th>Fecha</th><th>Concepto</th><th>Entrada (RD$)</th><th>Salida (RD$)</th></tr></thead>
                            <tbody>
                                <tr><td>01/05/2026</td><td>Cobro Honorarios Cliente A</td><td class="text-success">50,000</td><td>-</td></tr>
                                <tr><td>02/05/2026</td><td>Pago Alquiler Oficina</td><td>-</td><td class="text-danger">25,000</td></tr>
                                <tr><td>03/05/2026</td><td>Cobro Plan Emprendedor B</td><td class="text-success">15,000</td><td>-</td></tr>
                                <tr><td>04/05/2026</td><td>Compra Materiales Oficina</td><td>-</td><td class="text-danger">5,500</td></tr>
                                <tr><td>05/05/2026</td><td>Pago Servicios Energía/Internet</td><td>-</td><td class="text-danger">8,200</td></tr>
                                <tr><td>05/05/2026</td><td>Cobro Auditoría Anual C</td><td class="text-success">120,000</td><td>-</td></tr>
                            </tbody>
                        </table>
                    </div>`
            },
            db_expedientes: {
                title: 'Expedientes del Personal',
                content: `
                    <div class="enterprise-item"><i class="fas fa-user-circle"></i> <h4>Expediente_Juan_Perez_2026.doc</h4></div>
                    <div class="enterprise-item"><i class="fas fa-user-circle"></i> <h4>Expediente_Maria_Rod_2026.doc</h4></div>
                    <div class="enterprise-item"><i class="fas fa-user-circle"></i> <h4>Expediente_Carlos_Matos.doc</h4></div>
                    <div class="enterprise-item"><i class="fas fa-user-circle"></i> <h4>Expediente_Ana_Garcia.doc</h4></div>
                    <div class="enterprise-item"><i class="fas fa-user-circle"></i> <h4>Expediente_Roberto_S.doc</h4></div>
                    <div class="enterprise-item"><i class="fas fa-user-circle"></i> <h4>Expediente_Laura_M.doc</h4></div>`
            },
            db_seguros: {
                title: 'Pólizas de Seguros Médicos',
                content: `
                    <div class="db-table-wrapper">
                        <table class="db-table">
                            <thead><tr><th>Empleado</th><th>Aseguradora</th><th>Plan</th><th>Estado</th></tr></thead>
                            <tbody>
                                <tr><td>Juan Alberto Pérez</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>María Rodríguez</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Carlos Manuel Matos</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Ana Lucía García</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Roberto Sánchez</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Laura Martínez</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Ricardo Almonte</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Patricia Espinal</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Miguel Tejada</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Elena Vargas</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>José Luis Peralta</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Carmen Rosario</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Andrés Tavárez</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                                <tr><td>Sofía Méndez</td><td>ARS PREMIUM</td><td>Plan Plata</td><td class="text-success">Activo</td></tr>
                            </tbody>
                        </table>
                    </div>`
            },
            organigrama: {
                title: 'Organigrama Institucional',
                content: `
                    <div class="org-image-container" style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid var(--glass-border);">
                        <img src="organigrama.png" alt="Organigrama Institucional Expertos Contables RD" style="max-width: 100%; height: auto; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <div style="margin-top: 1.5rem;">
                            <a href="organigrama.png" download="Organigrama_Expertos_Contables_RD.png" class="btn-primary" style="display: inline-block; padding: 0.8rem 1.5rem; font-size: 0.9rem;">
                                <i class="fas fa-download"></i> Descargar Organigrama
                            </a>
                        </div>
                    </div>
                    <div class="detail-section-item" style="margin-top: 1.5rem;">
                        <h5>Estructura Oficial</h5>
                        <p>Esta es la estructura jerárquica oficial de Expertos Contables RD, diseñada para garantizar la máxima eficiencia en todos nuestros servicios financieros.</p>
                    </div>`
            },
            manuales: {
                title: 'Manuales y Políticas',
                content: `<div class="detail-section-item"><h5>Código de Ética Profesional</h5><p>Principios de integridad y confidencialidad.</p></div>`
            },
            directorio: {
                title: 'Directorio Interno del Equipo',
                content: `
                    <div id="dynamic-directory" class="directory-container" style="display: grid; gap: 1rem;">
                        <!-- Se llenará dinámicamente desde la DB -->
                        <div class="loading-db">Cargando directorio...</div>
                    </div>`
            }
        };

        function renderDynamicDirectory() {
            const container = document.getElementById('dynamic-directory');
            if (!container || !window.ExpertosDB) return;

            const users = window.ExpertosDB.users.getAll();
            container.innerHTML = users.map(user => `
                <div class="detail-section-item" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h5>${user.position}</h5>
                        <p><i class="fas fa-user"></i> ${user.name}</p>
                    </div>
                    <span class="status-badge status-${user.status}">${user.status === 'online' ? 'Disponible' : user.status === 'busy' ? 'En reunión' : 'Fuera de línea'}</span>
                </div>
            `).join('');
        }

        function setupDatabaseSubButtons() {
            document.querySelectorAll('.db-sub-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const subSection = btn.getAttribute('data-sub');
                    if (enterpriseSections[subSection]) {
                        detailTitle.innerText = enterpriseSections[subSection].title;
                        detailBody.innerHTML = enterpriseSections[subSection].content;
                    }
                });
            });
        }

        if (enterprisePanelEl) {
            openEnterpriseBtns.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', () => {
                        enterprisePanelEl.classList.add('active');
                        document.body.classList.add('modal-open');
                        if (enterpriseList) enterpriseList.style.display = 'block';
                        if (enterpriseDetail) enterpriseDetail.style.display = 'none';
                        if (cartPanelEl) cartPanelEl.classList.remove('active');
                    });
                }
            });

            if (closeEnterpriseBtn) {
                closeEnterpriseBtn.addEventListener('click', () => {
                    enterprisePanelEl.classList.remove('active');
                    document.body.classList.remove('modal-open');
                });
            }

            document.querySelectorAll('.enterprise-item').forEach(item => {
                item.addEventListener('click', () => {
                    const section = item.getAttribute('data-section');
                    if (enterpriseSections[section] && detailTitle && detailBody) {
                        detailTitle.innerText = enterpriseSections[section].title;
                        detailBody.innerHTML = enterpriseSections[section].content;
                        if (enterpriseList) enterpriseList.style.display = 'none';
                        if (enterpriseDetail) enterpriseDetail.style.display = 'block';
                        
                        // Llenar datos dinámicos si es necesario
                        if (section === 'base_datos') setupDatabaseSubButtons();
                        if (section === 'directorio') renderDynamicDirectory();
                    }
                });
            });

            if (backToListBtn) {
                backToListBtn.addEventListener('click', () => {
                    if (detailTitle.innerText.includes('Listado') || detailTitle.innerText.includes('Flujo') || 
                        detailTitle.innerText.includes('Expedientes') || detailTitle.innerText.includes('Pólizas')) {
                        const section = 'base_datos';
                        detailTitle.innerText = enterpriseSections[section].title;
                        detailBody.innerHTML = enterpriseSections[section].content;
                        setupDatabaseSubButtons();
                    } else {
                        enterpriseDetail.style.display = 'none';
                        enterpriseList.style.display = 'block';
                    }
                });
            }

            const employeeAccessBtn = document.getElementById('employee-access-btn');
            if (employeeAccessBtn) {
                employeeAccessBtn.addEventListener('click', () => {
                    window.location.href = 'empleados.html';
                });
            }
        }
    }

    // --- Shopping Cart Logic ---
    function initShoppingCart() {
        let cart = JSON.parse(localStorage.getItem('expertos_cart')) || [];
        const openCartBtn = document.getElementById('open-cart');
        const cartPanelEl = document.getElementById('cart-panel');
        const closeCartBtn = document.getElementById('close-cart');
        const enterprisePanelEl = document.getElementById('enterprise-panel');
        const cartCountElement = document.getElementById('cart-count');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');

        const saveCart = () => {
            localStorage.setItem('expertos_cart', JSON.stringify(cart));
        };

        if (openCartBtn && cartPanelEl) {
            openCartBtn.addEventListener('click', () => {
                cartPanelEl.classList.add('active');
                document.body.classList.add('modal-open');
                if (enterprisePanelEl) enterprisePanelEl.classList.remove('active');
            });

            if (closeCartBtn) {
                closeCartBtn.addEventListener('click', () => {
                    cartPanelEl.classList.remove('active');
                    document.body.classList.remove('modal-open');
                });
            }

            const updateCartUI = () => {
                if (cartCountElement) cartCountElement.innerText = cart.length;
                if (cartItemsContainer) {
                    if (cart.length === 0) {
                        cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>';
                        if (cartTotalElement) cartTotalElement.innerText = 'RD$0';
                    } else {
                        cartItemsContainer.innerHTML = '';
                        let total = 0;
                        cart.forEach((item, index) => {
                            total += item.price;
                            cartItemsContainer.innerHTML += `
                                <div class="cart-item">
                                    <div class="cart-item-info"><h4>${item.name}</h4><span>RD$${item.price.toLocaleString()}</span></div>
                                    <button class="remove-item" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
                                </div>`;
                        });
                        if (cartTotalElement) cartTotalElement.innerText = `RD$${total.toLocaleString()}`;
                    }
                }
                saveCart();
            };

            // Cargar UI inicial si hay datos en localStorage
            updateCartUI();

            window.removeFromCart = (index) => {
                cart.splice(index, 1);
                updateCartUI();
            };

            const addToCart = (name, price) => {
                const numericPrice = parseInt(price.replace('RD$', '').replace(',', ''));
                cart.push({ name, price: numericPrice });
                updateCartUI();
                cartPanelEl.classList.add('active');
                if (enterprisePanelEl) enterprisePanelEl.classList.remove('active');
                openCartBtn.classList.add('cart-bounce');
                setTimeout(() => openCartBtn.classList.remove('cart-bounce'), 500);
            };

            document.querySelectorAll('.btn-buy').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productCard = btn.closest('.product-card');
                    if (productCard) {
                        const productName = productCard.querySelector('h3').innerText;
                        const productPrice = productCard.querySelector('.product-price').innerText;
                        addToCart(productName, productPrice);
                    }
                });
            });

            // --- Checkout Modal Logic ---
            const checkoutModal = document.getElementById('checkout-modal');
            const checkoutBtn = document.getElementById('checkout-btn');
            const closeCheckoutBtn = document.getElementById('close-checkout');
            const payMethodBtns = document.querySelectorAll('.pay-method-btn');
            const cardFields = document.getElementById('card-fields');
            const paypalFields = document.getElementById('paypal-fields');
            const paymentForm = document.getElementById('payment-form');
            const modalTotal = document.getElementById('modal-total');
            const payNowBtn = document.getElementById('pay-now-btn');

            if (checkoutBtn && checkoutModal) {
                checkoutBtn.addEventListener('click', () => {
                    console.log("Abriendo pasarela de pago...");
                    if (cart.length === 0) {
                        alert('Tu carrito está vacío');
                        return;
                    }
                    
                    let total = 0;
                    cart.forEach(item => total += item.price);
                    if (modalTotal) modalTotal.innerText = `RD$${total.toLocaleString()}`;
                    
                    checkoutModal.classList.add('active');
                    document.body.classList.add('modal-open');
                    if (cartPanelEl) cartPanelEl.classList.remove('active');
                });
            }

            if (closeCheckoutBtn) {
                closeCheckoutBtn.addEventListener('click', () => {
                    checkoutModal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                });
            }

            payMethodBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    payMethodBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const method = btn.getAttribute('data-method');
                    if (method === 'card') {
                        cardFields.style.display = 'block';
                        paypalFields.style.display = 'none';
                    } else {
                        cardFields.style.display = 'none';
                        paypalFields.style.display = 'block';
                    }
                });
            });

            if (paymentForm) {
                paymentForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const originalText = payNowBtn ? payNowBtn.innerText : 'Pagar Ahora';
                    
                    if (payNowBtn) {
                        payNowBtn.innerText = 'Procesando...';
                        payNowBtn.disabled = true;
                    }

                    // Preparar datos del pedido
                    const orderData = {
                        items: [...cart],
                        total: cart.reduce((sum, item) => sum + item.price, 0),
                        method: document.querySelector('.pay-method-btn.active')?.getAttribute('data-method') || 'card'
                    };

                    // Guardar en la Base de Datos Local
                    if (window.ExpertosDB) {
                        window.ExpertosDB.orders.save(orderData);
                    }

                    setTimeout(() => {
                        paymentForm.style.display = 'none';
                        const successMsg = document.getElementById('payment-success');
                        if (successMsg) successMsg.style.display = 'block';
                        
                        // Limpiar carrito después del éxito
                        cart = [];
                        updateCartUI();
                    }, 2000);
                });
            }

            const finishBtn = document.getElementById('finish-btn');
            if (finishBtn) {
                finishBtn.addEventListener('click', () => {
                    checkoutModal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                    // Reset form for next time
                    setTimeout(() => {
                        if (paymentForm) paymentForm.style.display = 'block';
                        const successMsg = document.getElementById('payment-success');
                        if (successMsg) successMsg.style.display = 'none';
                        if (payNowBtn) {
                            payNowBtn.innerText = 'Pagar Ahora';
                            payNowBtn.disabled = false;
                        }
                    }, 500);
                });
            }
        }
    }

    // --- Keyboard Navigation (1-10) ---
    const sectionMapping = [
        '#home',          // 1: Inicio (Visual 01)
        '#about',         // 2: Sobre nosotros (Visual 02)
        '#history',       // 3: Historia (Visual 03)
        '#essence',       // 4: Nuestra Esencia (Visual 04)
        '#services',      // 5: Servicios (Visual 05)
        '#clients',       // 6: Clientes (Visual 06)
        '#institutional', // 7: Institucional (Visual 07)
        '#pricing',       // 8: Planes (Visual 08)
        '#org-chart',     // 9: Organigrama (Visual 09)
        '#contact'        // 10: Contacto (Visual 10)
    ];

    let keyBuffer = '';
    let bufferTimeout;

    // --- Navigation & Curtain Transition Logic (Optimized for Keyboard) ---
    const triggerPortalTransition = (callback) => {
        const curtain = document.getElementById('curtain');
        const curtainObjs = document.querySelectorAll('.curtain-obj');
        
        if (!curtain) {
            if (callback) callback();
            return;
        }

        // Reset curtain state for a new animation
        curtain.classList.remove('open');
        curtain.classList.remove('active');
        curtain.style.display = 'flex';
        
        // Reset objects opacity
        curtainObjs.forEach(obj => obj.style.opacity = '0');
        
        // Force reflow to ensure reset takes effect
        void curtain.offsetWidth;
        
        // Activate curtain (closes it)
        curtain.classList.add('active');

        // Step 1: Wait for curtain to close completely
        setTimeout(() => {
            // Show decorative objects
            curtainObjs.forEach((obj, i) => {
                setTimeout(() => obj.style.opacity = '0.6', i * 100);
            });

            // Step 2: Navigate while the screen is covered
            if (callback) callback();

            // Step 3: Open the curtain after a brief pause
            setTimeout(() => {
                curtain.classList.add('open');
                
                // Step 4: Hide curtain once the opening animation is done
                setTimeout(() => {
                    curtain.classList.remove('active');
                    curtain.style.display = 'none';
                }, 1000);
            }, 700); // Time screen stays covered
        }, 100); 
    };

    // --- Navigation Logic ---
    const navigateToSection = (id) => {
        if (!id) return;
        const target = document.querySelector(id);
        
        if (target) {
            // Restauramos la transición del telón para un efecto profesional
            triggerPortalTransition(() => {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'auto' // 'auto' porque la transición ya da la fluidez
                });
                
                // Actualizar URL y enlaces activos
                history.pushState(null, null, id);
                document.querySelectorAll('.nav-links a, .bottom-nav-item').forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="${id}"], .bottom-nav-item[href="${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            });
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        const isNumber = e.key >= '0' && e.key <= '9';
        const isArrow = e.key === 'ArrowDown' || e.key === 'ArrowUp';

        if (!isNumber && !isArrow) return;

        if (isNumber) {
            clearTimeout(bufferTimeout);
            keyBuffer += e.key;

            // Handle double digits (10)
            if (keyBuffer === '10') {
                navigateToSection(sectionMapping[9]);
                keyBuffer = '';
            } else {
                // Wait for a possible second digit
                bufferTimeout = setTimeout(() => {
                    if (keyBuffer.length === 1) {
                        const num = parseInt(keyBuffer);
                        // Map 1-9
                        if (num >= 1 && num <= 9) {
                            navigateToSection(sectionMapping[num - 1]);
                        } else if (num === 0) {
                            // Map 0 to 9 (Organigrama) as an alternative shortcut
                            navigateToSection(sectionMapping[8]);
                        }
                    }
                    keyBuffer = '';
                }, 400); 
            }
        }

        if (isArrow) {
            e.preventDefault();
            const currentY = window.pageYOffset + 150; 
            let currentSectionIndex = 0;
            
            sectionMapping.forEach((id, index) => {
                const el = document.querySelector(id);
                if (el && el.offsetTop <= currentY) {
                    currentSectionIndex = index;
                }
            });

            let nextIndex = currentSectionIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = Math.min(currentSectionIndex + 1, sectionMapping.length - 1);
            } else {
                nextIndex = Math.max(currentSectionIndex - 1, 0);
            }
            
            if (nextIndex !== currentSectionIndex) {
                navigateToSection(sectionMapping[nextIndex]);
            }
        }
    });

    // --- Cinematic Scroll Reveal Logic (Highly Optimized) ---
    const revealOptions = {
        threshold: 0.1, // Trigger slightly earlier
        rootMargin: "0px 0px -10% 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                // Optional: Unobserve to save resources if animation is one-way
                // revealObserver.unobserve(entry.target);
            } else {
                entry.target.classList.remove('reveal-active');
            }
        });
    }, revealOptions);

    const refreshReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-hidden');
        revealElements.forEach(el => {
            el.style.willChange = 'transform, opacity'; // Hint the browser
            revealObserver.observe(el);
        });
    };

    // --- Contact Form Submission Handler (AJAX / Fetch) ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            // UI Feedback
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;
            if (formStatus) {
                formStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando tu mensaje...';
                formStatus.style.color = 'var(--accent-gold)';
            }

            const formData = new FormData(contactForm);
            
            // 1. Guardar en Base de Datos Local (ExpertosDB)
            if (window.ExpertosDB) {
                const dataObj = {};
                formData.forEach((value, key) => {
                    // Evitar campos de configuración de Formspree (empiezan con _)
                    if (!key.startsWith('_')) {
                        dataObj[key] = value;
                    }
                });
                window.ExpertosDB.contacts.save(dataObj);
                console.log("Mensaje guardado en base de datos local.");
            }
            
            // 2. Enviar a Formspree para notificación por email
            const serviceUrl = "https://formspree.io/f/maqkdnva";
            
            try {
                const response = await fetch(serviceUrl, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    submitBtn.innerText = '¡Enviado!';
                    submitBtn.style.background = '#25D366';
                    if (formStatus) {
                        formStatus.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado con éxito! Te contactaremos pronto.';
                        formStatus.style.color = '#25D366';
                    }
                } else {
                    throw new Error("Servidor no disponible");
                }
            } catch (error) {
                console.log("Servidor de correos no responde (Caído)...");
                
                submitBtn.innerText = 'Servidor No Disponible';
                submitBtn.disabled = false;
                submitBtn.style.background = '#ff4d4d';

                if (formStatus) {
                    formStatus.innerHTML = `
                        <div style="background: rgba(255,77,77,0.1); padding: 15px; border-radius: 12px; border: 1px solid #ff4d4d; margin-top: 15px; text-align: center;">
                            <i class="fas fa-plug" style="color: #ff4d4d; font-size: 1.5rem; margin-bottom: 10px;"></i>
                            <p style="color: #fff; margin-bottom: 10px; font-size: 0.95rem; font-weight: 500;">
                                El servidor de correos (FormSubmit) está caído en este momento.
                            </p>
                            <p style="color: #ccc; font-size: 0.85rem; margin-bottom: 15px;">
                                Por favor, utiliza nuestra vía de atención directa por WhatsApp para que no tengas que esperar.
                            </p>
                            <a href="https://wa.me/18293565522" target="_blank" style="display: block; background: #25D366; color: white; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold; transition: transform 0.2s;">
                                <i class="fab fa-whatsapp"></i> Hablar por WhatsApp Ahora
                            </a>
                        </div>
                    `;
                }
            } finally {
                // Reset button after 5 seconds if there was an error
                if (submitBtn.disabled === false) {
                    setTimeout(() => {
                        submitBtn.innerText = originalBtnText;
                    }, 5000);
                }
            }
        });
    }

    // Initial call
    refreshReveal();
    window.refreshReveal = refreshReveal;
});
