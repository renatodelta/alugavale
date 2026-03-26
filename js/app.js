// Configure the agent's WhatsApp number here (include country code 55 + DDD + number)
const WHATSAPP_NUMBER = "5512992400019";

const app = {
    // Data objects to store user input
    tenantData: {
        cidade: '',
        tipo: '',
        valor: 1500,
        renda: '',
        restricao: ''
    },
    ownerData: {
        nome: '',
        tipo: 'Casa',
        bairro: ''
    },

    // UI State Management
    showHero() {
        document.getElementById('hero-section').classList.remove('hidden');
        document.getElementById('flow-inquilino').classList.add('hidden');
        document.getElementById('flow-proprietario').classList.add('hidden');
        window.scrollTo(0, 0);
    },

    showTenantFlow() {
        document.getElementById('hero-section').classList.add('hidden');
        document.getElementById('flow-inquilino').classList.remove('hidden');
        document.getElementById('flow-proprietario').classList.add('hidden');
        this.resetTenantForm();
        window.scrollTo(0, 0);
    },

    showOwnerFlow() {
        document.getElementById('hero-section').classList.add('hidden');
        document.getElementById('flow-inquilino').classList.add('hidden');
        document.getElementById('flow-proprietario').classList.remove('hidden');
        window.scrollTo(0, 0);
    },

    // --- Tenant Flow (Wizard) Logic ---
    selectOption(element, field, value) {
        // Deselect siblings
        const siblings = element.parentElement.children;
        for (let el of siblings) {
            el.classList.remove('selected');
        }
        // Select current
        element.classList.add('selected');

        // Save state
        this.tenantData[field] = value;
    },

    updateRentValue(val) {
        this.tenantData.valor = val;
        // Format as currency loosely
        const formatted = parseInt(val).toLocaleString('pt-BR');
        document.getElementById('rent-value-display').innerText = formatted;
    },

    nextStep(flowType, stepNumber) {
        // Simple validation for step 1
        if (stepNumber === 2 && (!this.tenantData.cidade || !this.tenantData.tipo)) {
            alert("Por favor, selecione cidade e tipo de imóvel para continuar.");
            return;
        }

        this.goToStep(flowType, stepNumber);
    },

    prevStep(flowType, stepNumber) {
        this.goToStep(flowType, stepNumber);
    },

    goToStep(flowType, stepNumber) {
        // Hide all steps
        const steps = document.querySelectorAll(`#${flowType}-wizard .step`);
        steps.forEach(s => s.classList.remove('active'));

        // Show target step
        document.querySelector(`#${flowType}-wizard .step[data-step="${stepNumber}"]`).classList.add('active');

        // Update progress bar
        const progressVal = (stepNumber / steps.length) * 100;
        document.getElementById('tenant-progress').style.width = `${progressVal}%`;
    },

    finishTenantFlow() {
        // Get step 3 explicit values
        const rendaSelect = document.getElementById('renda-familiar');
        this.tenantData.renda = rendaSelect.value;

        if (!this.tenantData.restricao) {
            alert("Por favor, informe se possui restrição no nome.");
            return;
        }

        // Show result step (step 4)
        this.goToStep('tenant', 4);
    },

    resetTenantForm() {
        this.tenantData = { cidade: '', tipo: '', valor: 1500, renda: '', restricao: '' };
        document.getElementById('rent-value').value = 1500;
        document.getElementById('rent-value-display').innerText = "1.500";
        document.querySelectorAll('.option-box').forEach(el => el.classList.remove('selected'));
        this.goToStep('tenant', 1);
    },

    // --- WhatsApp Generation ---
    sendTenantWhatsApp() {
        const text = "Olá! Tenho interesse em alugar um imóvel. Fiz a pré-análise no site:\n\n" +
            "- *Busco:* " + this.tenantData.tipo + " em " + this.tenantData.cidade + "\n" +
            "- *Valor Máximo:* R$ " + this.tenantData.valor + "\n" +
            "- *Renda Familiar:* " + this.tenantData.renda + "\n" +
            "- *Restrição (SPC):* " + this.tenantData.restricao + "\n\n" +
            "Podemos ver algumas opções?";

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    },

    sendOwnerWhatsApp() {
        const nome = document.getElementById('owner-name').value;
        const tipo = document.getElementById('owner-type').value;
        const bairro = document.getElementById('owner-bairro').value;

        if (!nome || !bairro) {
            alert("Por favor, preencha nome e bairro para solicitar a avaliação.");
            return;
        }

        const text = "Olá, meu nome é " + nome + ". Gostaria de solicitar uma *Avaliação Gratuita* para locação do meu imóvel.\n\n" +
            "- *Imóvel:* " + tipo + "\n" +
            "- *Bairro:* " + bairro + "\n\n" +
            "Como podemos seguir?";

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
};

// Event Listeners initialization
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-inquilino').addEventListener('click', () => app.showTenantFlow());
    document.getElementById('btn-proprietario').addEventListener('click', () => app.showOwnerFlow());
});
