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
        const captureForm = document.querySelector('.capture-form');
        if (captureForm) {
            captureForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = captureForm.querySelector('input[type="text"]').value;
                const whatsapp = captureForm.querySelector('input[type="tel"]').value;
                
                const text = `Olá Fabiana! Gostaria de uma *Avaliação de Aluguel* para meu imóvel. \n\n*Nome:* ${name}\n*WA:* ${whatsapp}`;
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

        // Search Button (Mock)
        const btnSearch = document.querySelector('.btn-search');
        if (btnSearch) {
            btnSearch.addEventListener('click', () => {
                alert('Iniciando busca inteligente... (Simulação)');
            });
        }
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
document.addEventListener('DOMContentLoaded', () => app.init());
