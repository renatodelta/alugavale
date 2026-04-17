/**
 * AlugaVale - Property Management System
 * Final production version for Cloudflare Pages + KV.
 * Removed localStorage syncing to avoid QuotaExceededError with photos.
 */

const API_URL = '/api';

// Helper for fetching from API
async function fetchProperties() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('API Error:', error);
        return [];
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
        return null;
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
    // Clean currency string to number
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

// Clear legacy data once to fix QuotaExceededError
try {
    localStorage.removeItem('alugavale_properties');
} catch(e) {}

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
    deleteProperty: async (id) => {
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id })
            });
            return true;
        } catch (error) {
            console.error('Failed to delete via API:', error);
            return false;
        }
    },
    analyzeCredit
};
