/**
 * AlugaVale - Property Management System
 * Updated to use a real backend (api.php) for cross-device synchronization.
 */

const API_URL = 'api.php';

// Helper for fetching from API
async function fetchProperties() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        // Sync to localStorage as backup/cache
        localStorage.setItem('alugavale_properties', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('API Error, falling back to localStorage:', error);
        return JSON.parse(localStorage.getItem('alugavale_properties') || '[]');
    }
}

async function registerProperty(propertyData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyData)
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to register via API:', error);
        // Fallback for demo if API fails
        const localData = JSON.parse(localStorage.getItem('alugavale_properties') || '[]');
        const newP = { ...propertyData, id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString() };
        localData.push(newP);
        localStorage.setItem('alugavale_properties', JSON.stringify(localData));
        return newP;
    }
}

async function updatePropertyStatus(id, status) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_status', id, status })
        });
        return true;
    } catch (error) {
        console.error('Failed to update status via API:', error);
        return false;
    }
}

// Simulated Credit Analysis Logic
function analyzeCredit(name, cpf, income, rentValue) {
    // Clean currency string to number if needed
    const numericRentValue = typeof rentValue === 'string' ? parseFloat(rentValue.replace(/\D/g, '')) / 100 : rentValue;
    const ratio = income / (numericRentValue || 1);
    const lastDigit = parseInt(cpf.slice(-1)) || 0;
    
    if (ratio >= 3 && lastDigit > 3) {
        return {
            status: 'approved',
            title: 'Parabéns! Você pode alugar este imóvel',
            message: 'Seu perfil foi pré-aprovado automaticamente por nosso sistema.'
        };
    } else if (ratio >= 2.5) {
        return {
            status: 'analysis',
            title: 'Seu perfil está em análise',
            message: 'Temos quase tudo o que precisamos, mas nossa equipe fará uma revisão manual.'
        };
    } else {
        return {
            status: 'denied',
            title: 'Não foi possível aprovação automática',
            message: 'Infelizmente os critérios iniciais não foram atingidos para aprovação direta.'
        };
    }
}

// Export functions to window for global access
window.AlugaVale = {
    getProperties: fetchProperties,
    getApprovedProperties: async () => {
        const all = await fetchProperties();
        return all.filter(p => p.status === 'approved');
    },
    getPropertyById: async (id) => {
        const all = await fetchProperties();
        return all.find(p => p.id === id);
    },
    registerProperty,
    updatePropertyStatus,
    analyzeCredit
};
