/**
 * AlugaVale - Property Management System
 * Handles property registration, moderation, and listing using localStorage.
 */

const STORAGE_KEY = 'alugavale_properties';

// Initial Mock Data if storage is empty
const INITIAL_PROPERTIES = [
    {
        id: '1',
        ownerName: 'Ricardo Silva',
        ownerPhone: '5512992400019',
        type: 'Apartamento',
        neighborhood: 'Jardim das Nações',
        rentValue: '2500',
        description: 'Lindo apartamento com 2 quartos, suíte e varanda gourmet. Localização privilegiada.',
        photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
        status: 'approved',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        ownerName: 'Maria Oliveira',
        ownerPhone: '5512992400019',
        type: 'Casa',
        neighborhood: 'Independência',
        rentValue: '3800',
        description: 'Casa espaçosa com 3 quartos, quintal amplo e churrasqueira.',
        photos: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800'],
        status: 'approved',
        createdAt: new Date().toISOString()
    }
];

function getProperties() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
        return INITIAL_PROPERTIES;
    }
    
    let properties = JSON.parse(data);
    
    // Migration: Fix duplicate R$ in existing data
    let modified = false;
    properties = properties.map(p => {
        if (typeof p.rentValue === 'string' && (p.rentValue.includes('R$\xa0') || p.rentValue.includes('R$ '))) {
            p.rentValue = p.rentValue.replace('R$\xa0', '').replace('R$ ', '');
            modified = true;
        }
        return p;
    });
    
    if (modified) {
        saveProperties(properties);
    }

    return properties;
}

function saveProperties(properties) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

function registerProperty(propertyData) {
    const properties = getProperties();
    const newProperty = {
        ...propertyData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    properties.push(newProperty);
    saveProperties(properties);
    return newProperty;
}

function updatePropertyStatus(id, status) {
    const properties = getProperties();
    const index = properties.findIndex(p => p.id === id);
    if (index !== -1) {
        properties[index].status = status;
        
        // If rejected, clear heavy data to save space (localStorage)
        if (status === 'rejected') {
            properties[index].photos = [];
            properties[index].description = '--- REGISTRO REJEITADO ---';
            properties[index].neighborhood = '---';
            properties[index].rentValue = '0,00';
            // Keep basic owner/type info for history reference
        }
        
        saveProperties(properties);
        return true;
    }
    return false;
}

function getApprovedProperties() {
    return getProperties().filter(p => p.status === 'approved');
}

function getPropertyById(id) {
    return getProperties().find(p => p.id === id);
}

// Simulated Credit Analysis Logic
function analyzeCredit(name, cpf, income, rentValue) {
    // Basic mock logic: if income is 3x the rent, it's mostly good
    const ratio = income / rentValue;
    
    // Using CPF last digit for randomness in mock
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
    getProperties,
    getApprovedProperties,
    getPropertyById,
    registerProperty,
    updatePropertyStatus,
    analyzeCredit
};
