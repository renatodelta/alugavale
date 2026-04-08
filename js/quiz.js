const quizData = [
    {
        question: "Qual o seu orçamento mensal pretendido para o aluguel?",
        options: [
            { text: "Até R$ 2.500", value: "economico", icon: "fa-wallet" },
            { text: "Entre R$ 2.500 e R$ 4.500", value: "intermediario", icon: "fa-piggy-bank" },
            { text: "Acima de R$ 4.500", value: "premium", icon: "fa-gem" }
        ]
    },
    {
        question: "O que é prioridade máxima para você agora?",
        options: [
            { text: "Praticidade (fazer tudo a pé)", value: "praticidade", icon: "fa-walking" },
            { text: "Tranquilidade (estilo interior/silêncio)", value: "tranquilidade", icon: "fa-leaf" },
            { text: "Status e Infraestrutura de alto padrão", value: "status", icon: "fa-crown" },
            { text: "Economia e Preço baixo", value: "preco", icon: "fa-tag" }
        ]
    },
    {
        question: "Qual o seu perfil de moradia?",
        options: [
            { text: "Jovem / Casal buscando conveniência", value: "jovem", icon: "fa-user" },
            { text: "Família grande buscando espaço/casas", value: "familia", icon: "fa-users" },
            { text: "Executivo buscando valorização e localização", value: "executivo", icon: "fa-briefcase" }
        ]
    }
];

const neighborhoods = {
    "Jardim das Nações": "O âncora premium. Ideal para famílias e executivos que buscam alto padrão, segurança e estar perto de tudo o que há de melhor em Taubaté.",
    "Independência": "Volume e dinamismo. Perfeito para o público jovem que busca uma localização estratégica com excelente custo-benefício e muitos serviços.",
    "Centro": "Praticidade total. A escolha funcional para quem quer resolver a vida sem precisar de carro, com tudo ao alcance de uma curta caminhada.",
    "Estiva": "A opção econômica. Ideal para quem busca um aluguel de entrada acessível em uma região com crescimento gradual e foco em preço baixo.",
    "Quiririm": "Qualidade de vida emocional. Para quem busca o clima de interior com tranquilidade, casas charmosas e um ritmo mais calmo.",
    "Vila São Geraldo": "O equilíbrio perfeito. Uma decisão fácil para quem busca uma região versátil, com boa infraestrutura e valores intermediários.",
    "Tremembé (Região Central)": "A alternativa inteligente. Muito procurada por famílias que buscam casas maiores e sossego, mantendo a proximidade com Taubaté."
};

const quiz = {
    currentStep: 0,
    answers: [],

    start() {
        document.querySelector('.bairros-hero').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');
        this.renderStep();
    },

    renderStep() {
        const step = quizData[this.currentStep];
        const container = document.getElementById('quiz-steps');
        
        container.innerHTML = `
            <h3>${step.question}</h3>
            <div class="options-grid">
                ${step.options.map((opt, index) => `
                    <button class="option-btn" onclick="quiz.next('${opt.value}')">
                        <i class="fa-solid ${opt.icon}"></i>
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        `;
    },

    next(value) {
        this.answers.push(value);
        this.currentStep++;

        if (this.currentStep < quizData.length) {
            this.renderStep();
        } else {
            this.showResult();
        }
    },

    showResult() {
        document.getElementById('quiz-steps').classList.add('hidden');
        const resultSection = document.getElementById('quiz-result');
        const nameEl = document.getElementById('neighborhood-result');
        const descEl = document.getElementById('result-explanation');

        const budget = this.answers[0];
        const priority = this.answers[1];
        const profile = this.answers[2];

        let result = "";

        // Lógica de recomendação baseada nos seus perfis
        if (priority === 'status' || budget === 'premium') {
            result = "Jardim das Nações";
        } else if (priority === 'praticidade' && budget !== 'economico') {
            result = "Centro";
        } else if (priority === 'preco' || budget === 'economico') {
            result = "Estiva";
        } else if (priority === 'tranquilidade' && profile === 'familia') {
            result = "Tremembé (Região Central)";
        } else if (priority === 'tranquilidade') {
            result = "Quiririm";
        } else if (profile === 'jovem' || budget === 'intermediario') {
            result = "Independência";
        } else {
            result = "Vila São Geraldo";
        }

        nameEl.innerText = result;
        descEl.innerText = neighborhoods[result];
        resultSection.classList.remove('hidden');
    },

    restart() {
        this.currentStep = 0;
        this.answers = [];
        document.getElementById('quiz-steps').classList.remove('hidden');
        document.getElementById('quiz-result').classList.add('hidden');
        document.querySelector('.bairros-hero').classList.remove('hidden');
        document.getElementById('quiz-container').classList.add('hidden');
    }
};
