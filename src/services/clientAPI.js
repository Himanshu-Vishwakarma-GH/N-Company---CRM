/**
 * Client API Service
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';
const API_KEY = 'dev-api-key-12345';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
});

export const clientAPI = {
    /**
     * Get all clients
     * @returns {Promise<Array>} List of clients
     */
    listClients: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clients`, {
                method: 'GET',
                headers: getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch clients');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            // Return empty array if endpoint not implemented yet
            return [];
        }
    },

    /**
     * Create a new client
     * @param {Object} clientData - Client data
     * @returns {Promise<Object>} Created client
     */
    createClient: async (clientData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/clients`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(clientData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to create client');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    },
};

/**
 * Invoice API Service - Extended
 */
export const invoiceAPI = {
    /**
     * Check if invoice ID exists
     * @param {string} invoiceId - Invoice ID to check
     * @returns {Promise<boolean>} True if exists
     */
    checkInvoiceExists: async (invoiceId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
                method: 'GET',
                headers: getHeaders(),
            });

            return response.ok;
        } catch (error) {
            return false;
        }
    },

    // ... existing invoice methods from api.js
};
