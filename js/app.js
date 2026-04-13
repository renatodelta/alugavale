// Configure the agent's WhatsApp number
const WHATSAPP_NUMBER = "5512992400019";

const app = {
    init() {
        this.setupAnimations();
        this.setupEventListeners();
        this.setupNavigation();
    },

    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Elements to animate
        const animateElements = document.querySelectorAll(
            '.hero-text-content, .hero-visual, .search-bar, .decision-card, .comp-col, .article-card, .trust-image, .trust-content, .capture-card'
        );

        animateElements.forEach(el => {
            el.classList.add('fade-in-up');
            observer.observe(el);
        });

        // Add CSS for animations dynamically if not in style.css
        const style = document.createElement('style');
        style.textContent = `
            .fade-in-up {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .fade-in-up.visible {
                opacity: 1;
                transform: translateY(0);
            }
            .decision-card:nth-child(2) { transition-delay: 0.1s; }
            .decision-card:nth-child(3) { transition-delay: 0.2s; }
            .article-card:nth-child(2) { transition-delay: 0.1s; }
            .article-card:nth-child(3) { transition-delay: 0.2s; }
        `;
        document.head.appendChild(style);
    },

    setupEventListeners() {
        // Lead Capture Form
        const captureForm = document.getElementById('leadForm');
        if (captureForm) {
            captureForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('leadName').value;
                const whatsapp = document.getElementById('leadPhone').value;
                const intent = document.getElementById('leadIntent').value;
                
                let baseMessage = "Olá!";
                if (intent === 'quero_alugar') {
                    baseMessage = "Olá, quero ajuda para encontrar um imóvel para alugar em Taubaté.";
                } else if (intent === 'quero_anunciar') {
                    baseMessage = "Olá, quero saber quanto posso cobrar de aluguel no meu imóvel.";
                }

                const text = `${baseMessage}\n\nMeu nome é *${name}*\nMeu WhatsApp é *${whatsapp}*`;
                const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            });
        }

        // Category Filtering (Mock)
        const catButtons = document.querySelectorAll('.portal-categories button');
        catButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                catButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Real filtering would go here
                console.log(`Filtering by: ${btn.textContent}`);
            });
        });


    },

    setupNavigation() {
        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    // Init comparator if on home page
    if (document.getElementById('comp-list-1')) {
        updateComparator();
    }
});

// =============================================
// COMPARADOR DE BAIRROS — Banco de Dados
// =============================================
const bairrosDB = {
    independencia: {
        nome: 'Independência',
        preco: 'R$ 2.200 – R$ 3.000',
        perfil: 'Jovem / Familiar',
        infra: 'Excelente',
        valorizacao: 'Alta',
        seguranca: 'Média/Alta',
        destaque: 'Mais procurado'
    },
    jardim: {
        nome: 'Jardim das Nações',
        preco: 'R$ 3.000 – R$ 5.000+',
        perfil: 'Executivo / Alto Padrão',
        infra: 'Premium',
        valorizacao: 'Estável',
        seguranca: 'Altíssima',
        destaque: 'Âncora Premium'
    },
    centro: {
        nome: 'Centro',
        preco: 'R$ 1.500 – R$ 2.800',
        perfil: 'Urbano / Funcional',
        infra: 'Máxima',
        valorizacao: 'Moderada',
        seguranca: 'Média',
        destaque: 'Tudo a pé'
    },
    estiva: {
        nome: 'Estiva',
        preco: 'R$ 1.000 – R$ 2.000',
        perfil: 'Entrada / Econômico',
        infra: 'Básica',
        valorizacao: 'Crescente',
        seguranca: 'Média',
        destaque: 'Mais acessível'
    },
    quiririm: {
        nome: 'Quiririm',
        preco: 'R$ 1.200 – R$ 2.500',
        perfil: 'Interior / Tranquilo',
        infra: 'Boa',
        valorizacao: 'Gradual',
        seguranca: 'Alta',
        destaque: 'Qualidade de vida'
    },
    saogeraldo: {
        nome: 'Vila São Geraldo',
        preco: 'R$ 1.500 – R$ 2.800',
        perfil: 'Versátil / Equilibrado',
        infra: 'Boa',
        valorizacao: 'Moderada',
        seguranca: 'Alta',
        destaque: 'Custo-benefício'
    },
    tremembe: {
        nome: 'Tremembé',
        preco: 'R$ 1.300 – R$ 2.600',
        perfil: 'Familiar / Sossego',
        infra: 'Boa',
        valorizacao: 'Crescente',
        seguranca: 'Alta',
        destaque: 'Casas maiores'
    }
};

function updateComparator() {
    const keys = ['preco', 'perfil', 'infra', 'valorizacao', 'seguranca', 'destaque'];
    const labels = {
        preco: 'Preço Médio',
        perfil: 'Perfil',
        infra: 'Infraestrutura',
        valorizacao: 'Valorização',
        seguranca: 'Segurança',
        destaque: 'Destaque'
    };

    [1, 2].forEach(n => {
        const key = document.getElementById(`comp-select-${n}`).value;
        const data = bairrosDB[key];
        const list = document.getElementById(`comp-list-${n}`);

        list.style.opacity = '0';
        list.style.transform = 'translateY(10px)';
        list.style.transition = 'opacity 0.3s, transform 0.3s';

        setTimeout(() => {
            list.innerHTML = keys.map(k => `
                <li>
                    <span class="label">${labels[k]}:</span>
                    <span class="value">${data[k]}</span>
                </li>
            `).join('');
            list.style.opacity = '1';
            list.style.transform = 'translateY(0)';
        }, 150);
    });
}
