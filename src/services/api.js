/**
 * API Service for N Company CRM Backend
 * Handles all HTTP requests to the FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';
const API_KEY = 'dev-api-key-12345';

// Default headers for all requests
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
});

/**
 * Invoice API Service
 */
export const invoiceAPI = {
    /**
     * Create a new invoice
     * @param {Object} invoiceData - Invoice data with client_id, items, etc.
     * @returns {Promise<Object>} Created invoice response
     */
    createInvoice: async (invoiceData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/invoices`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(invoiceData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to create invoice');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    },

    /**
     * Get all invoices
     * @param {Object} params - Query parameters (status, client_id, limit, offset)
     * @returns {Promise<Object>} List of invoices with pagination
     */
    listInvoices: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.status) queryParams.append('status_filter', params.status);
        if (params.client_id) queryParams.append('client_id', params.client_id);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.offset) queryParams.append('offset', params.offset);

        try {
            const response = await fetch(
                `${API_BASE_URL}/invoices?${queryParams.toString()}`,
                {
                    method: 'GET',
                    headers: getHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch invoices');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw error;
        }
    },

    /**
     * Get invoice by ID
     * @param {string} invoiceId - Invoice ID
     * @returns {Promise<Object>} Invoice details
     */
    getInvoice: async (invoiceId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
                method: 'GET',
                headers: getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Invoice not found');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching invoice:', error);
            throw error;
        }
    },

    /**
     * Update invoice status
     * @param {string} invoiceId - Invoice ID
     * @param {string} status - New status (draft, pending, paid, overdue)
     * @returns {Promise<Object>} Updated invoice
     */
    updateStatus: async (invoiceId, status) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/invoices/${invoiceId}/status`,
                {
                    method: 'PATCH',
                    headers: getHeaders(),
                    body: JSON.stringify({ status }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update invoice status');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error updating invoice status:', error);
            throw error;
        }
    },
};

/**
 * Client API Service (for future use)
 */
export const clientAPI = {
    /**
     * Get all clients
     * @returns {Promise<Array>} List of clients
     */
    listClients: async () => {
        // Placeholder for future implementation
        // Will call GET /api/v1/clients when endpoint is built
        throw new Error('Client API not yet implemented');
    },
};

/**
 * Dashboard API Service
 */
export const dashboardAPI = {
    /**
     * Get executive dashboard metrics
     * @param {Object} params - Query parameters (start_date, end_date)
     * @returns {Promise<Object>} Executive metrics
     */
    getExecutiveMetrics: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);

        try {
            const response = await fetch(
                `${API_BASE_URL}/dashboard/executive?${queryParams.toString()}`,
                {
                    method: 'GET',
                    headers: getHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch executive metrics');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching executive metrics:', error);
            throw error;
        }
    },

    /**
     * Get sales dashboard metrics
     * @param {Object} params - Query parameters (start_date, end_date)
     * @returns {Promise<Object>} Sales metrics
     */
    getSalesMetrics: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);

        try {
            const response = await fetch(
                `${API_BASE_URL}/dashboard/sales?${queryParams.toString()}`,
                {
                    method: 'GET',
                    headers: getHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch sales metrics');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching sales metrics:', error);
            throw error;
        }
    },

    /**
     * Get financial dashboard metrics
     * @param {Object} params - Query parameters (start_date, end_date)
     * @returns {Promise<Object>} Financial metrics
     */
    getFinancialMetrics: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);

        try {
            const response = await fetch(
                `${API_BASE_URL}/dashboard/financial?${queryParams.toString()}`,
                {
                    method: 'GET',
                    headers: getHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch financial metrics');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching financial metrics:', error);
            throw error;
        }
    },
};

/**
 * Task API Service
 */
export const taskAPI = {
    /**
     * List all tasks
     * @param {Object} params - Query parameters (status_filter)
     * @returns {Promise<Array>} List of tasks
     */
    listTasks: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status_filter) queryParams.append('status_filter', params.status_filter);

        try {
            const response = await fetch(
                `${API_BASE_URL}/tasks?${queryParams.toString()}`,
                {
                    method: 'GET',
                    headers: getHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    /**
     * Create a new task
     * @param {Object} taskData - Task data
     * @returns {Promise<Object>} Created task
     */
    createTask: async (taskData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    /**
     * Update task status (for drag-drop)
     * @param {string} taskId - Task ID
     * @param {string} status - New status
     * @returns {Promise<Object>} Updated task
     */
    updateTaskStatus: async (taskId, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task status');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating task status:', error);
            throw error;
        }
    },

    /**
     * Update task
     * @param {string} taskId - Task ID
     * @param {Object} taskData - Updated task data
     * @returns {Promise<Object>} Updated task
     */
    updateTask: async (taskId, taskData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },

    /**
     * Delete task
     * @param {string} taskId - Task ID
     * @returns {Promise<void>}
     */
    deleteTask: async (taskId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },
};

export default {
    invoice: invoiceAPI,
    client: clientAPI,
    dashboard: dashboardAPI,
    task: taskAPI,
};
