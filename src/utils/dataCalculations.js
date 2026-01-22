// Data Calculation Utilities
// These functions derive metrics from the central data

import { clients, invoices, transactions } from '../data/centralData';

// ==================== CLIENT CALCULATIONS ====================

export const getClientLifetimeValue = (clientId) => {
    const clientInvoices = invoices.filter(inv => inv.clientId === clientId);
    return clientInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
};

export const getClientInvoices = (clientId) => {
    return invoices.filter(inv => inv.clientId === clientId);
};

export const getClientByStage = (stage) => {
    return clients.filter(client => client.stage === stage);
};

export const getClientById = (clientId) => {
    return clients.find(client => client.id === clientId);
};

// ==================== INVOICE CALCULATIONS ====================

export const getTotalRevenue = (startDate = null, endDate = null) => {
    let filteredInvoices = invoices;

    if (startDate || endDate) {
        filteredInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.date);
            if (startDate && invDate < new Date(startDate)) return false;
            if (endDate && invDate > new Date(endDate)) return false;
            return true;
        });
    }

    return filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
};

export const getPaidRevenue = () => {
    return invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.grandTotal, 0);
};

export const getPendingRevenue = () => {
    return invoices
        .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.grandTotal, 0);
};

export const getInvoicesByStatus = (status) => {
    return invoices.filter(inv => inv.status === status);
};

export const getInvoiceById = (invoiceNumber) => {
    return invoices.find(inv => inv.invoiceNumber === invoiceNumber);
};

export const getRecentInvoices = (count = 10) => {
    return [...invoices]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, count);
};

// ==================== SALES CALCULATIONS ====================

export const getSalesLeaderboard = () => {
    const salesByPerson = {};

    invoices.forEach(inv => {
        if (!salesByPerson[inv.salesPerson]) {
            salesByPerson[inv.salesPerson] = {
                name: inv.salesPerson,
                sales: 0,
                deals: 0,
                revenue: 0
            };
        }
        salesByPerson[inv.salesPerson].revenue += inv.grandTotal;
        salesByPerson[inv.salesPerson].deals += 1;
        if (inv.status === 'paid') {
            salesByPerson[inv.salesPerson].sales += 1;
        }
    });

    return Object.values(salesByPerson)
        .sort((a, b) => b.revenue - a.revenue);
};

export const getProductRevenue = () => {
    const productRevenue = {};

    invoices.forEach(inv => {
        inv.items.forEach(item => {
            if (!productRevenue[item.service]) {
                productRevenue[item.service] = {
                    name: item.service,
                    value: 0,
                    count: 0
                };
            }
            const itemTotal = (item.quantity * item.unitPrice) * (1 + item.tax / 100) * (1 - item.discount / 100);
            productRevenue[item.service].value += itemTotal;
            productRevenue[item.service].count += 1;
        });
    });

    return Object.values(productRevenue)
        .sort((a, b) => b.value - a.value);
};

export const getMonthlyRevenue = (months = 6) => {
    const monthlyData = {};
    const now = new Date();

    // Initialize last N months
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[key] = 0;
    }

    // Aggregate invoice data
    invoices.forEach(inv => {
        const invDate = new Date(inv.date);
        const monthKey = invDate.toLocaleDateString('en-US', { month: 'short' });
        if (monthlyData.hasOwnProperty(monthKey)) {
            monthlyData[monthKey] += inv.grandTotal;
        }
    });

    return Object.entries(monthlyData).map(([month, revenue]) => ({
        month,
        revenue: Math.round(revenue)
    }));
};

// ==================== FINANCIAL CALCULATIONS ====================

export const getCashFlow = () => {
    const paid = getPaidRevenue();
    const pending = getPendingRevenue();

    return {
        received: paid,
        pending: pending,
        total: paid + pending
    };
};

export const getRevenueVsCost = () => {
    // For demo purposes, cost is estimated as 65% of revenue
    const monthlyRev = getMonthlyRevenue(6);

    return monthlyRev.map(data => ({
        month: data.month,
        revenue: data.revenue,
        cost: Math.round(data.revenue * 0.65)
    }));
};

export const getProfitMargin = () => {
    const revenue = getTotalRevenue();
    const cost = revenue * 0.65; // Estimated
    const profit = revenue - cost;

    return {
        revenue,
        cost,
        profit,
        margin: ((profit / revenue) * 100).toFixed(1)
    };
};

// ==================== OPERATIONS CALCULATIONS ====================

export const getOrdersByStatus = () => {
    const statusMapping = {
        'paid': 'delivered',
        'pending': 'inProgress',
        'overdue': 'pending'
    };

    const orders = {
        pending: [],
        inProgress: [],
        shipped: [],
        delivered: []
    };

    invoices.forEach(inv => {
        const client = getClientById(inv.clientId);
        const order = {
            id: inv.invoiceNumber,
            client: client?.name || 'Unknown',
            item: inv.items[0]?.service || 'Service',
            dueDate: inv.dueDate,
            status: inv.status
        };

        const mappedStatus = statusMapping[inv.status] || 'inProgress';

        // Distribute based on status
        if (inv.status === 'overdue') {
            orders.pending.push(order);
        } else if (inv.status === 'pending') {
            orders.inProgress.push(order);
        } else if (inv.status === 'paid') {
            // Split paid invoices between shipped and delivered
            const paidDate = new Date(inv.paidDate);
            const daysSincePaid = (new Date() - paidDate) / (1000 * 60 * 60 * 24);

            if (daysSincePaid > 5) {
                orders.delivered.push({ ...order, deliveredDate: inv.paidDate });
            } else {
                orders.shipped.push({ ...order, shippedDate: inv.paidDate });
            }
        }
    });

    return orders;
};

// ==================== DASHBOARD KPIs ====================

export const getExecutiveKPIs = () => {
    const totalRevenue = getTotalRevenue();
    const { margin } = getProfitMargin();
    const activeCustomers = clients.filter(c =>
        c.stage === 'converted' || c.stage === 'repeat' || c.stage === 'completed'
    ).length;

    // Calculate growth (comparing current month to previous)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthRevenue = invoices
        .filter(inv => {
            const invDate = new Date(inv.date);
            return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
        })
        .reduce((sum, inv) => sum + inv.grandTotal, 0);

    const lastMonthRevenue = invoices
        .filter(inv => {
            const invDate = new Date(inv.date);
            return invDate.getMonth() === currentMonth - 1 && invDate.getFullYear() === currentYear;
        })
        .reduce((sum, inv) => sum + inv.grandTotal, 0);

    const growthRate = lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
        : 0;

    return {
        totalRevenue: Math.round(totalRevenue),
        growthRate: parseFloat(growthRate),
        profitMargin: parseFloat(margin),
        activeCustomers
    };
};

// ==================== FILTER UTILITIES ====================

export const filterInvoicesByDateRange = (startDate, endDate) => {
    return invoices.filter(inv => {
        const invDate = new Date(inv.date);
        return invDate >= new Date(startDate) && invDate <= new Date(endDate);
    });
};

export const filterInvoicesByClient = (clientId) => {
    return invoices.filter(inv => inv.clientId === clientId);
};

export const filterInvoicesBySalesPerson = (salesPerson) => {
    return invoices.filter(inv => inv.salesPerson === salesPerson);
};

// ==================== FORMATTING UTILITIES ====================

export const formatCurrency = (amount) => {
    return `₹${(amount / 1000).toFixed(amount >= 100000 ? 1 : 0)}${amount >= 100000 ? 'K' : ''}`;
};

export const formatCurrencyFull = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
