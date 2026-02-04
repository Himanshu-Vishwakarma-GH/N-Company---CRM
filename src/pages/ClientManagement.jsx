import { useState, useEffect } from 'react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { clientAPI, invoiceAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ClientManagement.css';

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [clientsResponse, invoicesResponse] = await Promise.all([
                clientAPI.listClients(),
                invoiceAPI.listInvoices()
            ]);

            // Backend returns different structures:
            // Clients: {success: true, data: [...]}
            // Invoices: {success: true, data: {invoices: [...], total: N}}
            const clientsData = clientsResponse?.data || [];
            const invoicesData = invoicesResponse?.data?.invoices || [];  // ← FIX: Access data.invoices

            setClients(clientsData);
            setInvoices(invoicesData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate revenue per client
    const clientsWithRevenue = clients.map(client => {
        const clientInvoices = invoices.filter(inv => inv.client_id === client.client_id);
        const totalRevenue = clientInvoices.reduce((sum, inv) => sum + parseFloat(inv.grand_total || 0), 0);
        const invoiceCount = clientInvoices.length;
        const lastInvoiceDate = clientInvoices.length > 0
            ? clientInvoices.sort((a, b) => new Date(b.invoice_date) - new Date(a.invoice_date))[0].invoice_date
            : 'N/A';

        return {
            ...client,
            totalRevenue,
            invoiceCount,
            lastInvoiceDate
        };
    });

    // Filter clients by search
    const filteredClients = clientsWithRevenue.filter(client => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            client.client_id.toLowerCase().includes(query) ||
            client.name.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query) ||
            client.company.toLowerCase().includes(query)
        );
    });

    // Sort clients by revenue (top clients)
    const topClients = [...filteredClients]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10);

    // Chart data - Top 5 clients by revenue
    const revenueChartData = topClients.slice(0, 5).map(client => ({
        name: client.name.length > 15 ? client.name.substring(0, 15) + '...' : client.name,
        revenue: client.totalRevenue,
        invoices: client.invoiceCount
    }));

    // Pie chart data - Client distribution by revenue brackets
    const revenueBrackets = {
        '< ₹1L': filteredClients.filter(c => c.totalRevenue < 100000).length,
        '₹1L - ₹5L': filteredClients.filter(c => c.totalRevenue >= 100000 && c.totalRevenue < 500000).length,
        '₹5L - ₹10L': filteredClients.filter(c => c.totalRevenue >= 500000 && c.totalRevenue < 1000000).length,
        '> ₹10L': filteredClients.filter(c => c.totalRevenue >= 1000000).length,
    };

    const pieData = Object.entries(revenueBrackets)
        .filter(([_, count]) => count > 0)
        .map(([bracket, count]) => ({ name: bracket, value: count }));

    const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

    // Statistics
    const totalRevenue = filteredClients.reduce((sum, c) => sum + c.totalRevenue, 0);
    const avgRevenuePerClient = filteredClients.length > 0 ? totalRevenue / filteredClients.length : 0;
    const totalInvoices = filteredClients.reduce((sum, c) => sum + c.invoiceCount, 0);

    console.log('=== STATISTICS DEBUG ===');
    console.log('Filtered Clients:', filteredClients.length);
    console.log('Sample client revenue:', filteredClients[0]?.totalRevenue, filteredClients[0]?.invoiceCount);
    console.log('Total Revenue:', totalRevenue);
    console.log('Total Invoices:', totalInvoices);
    console.log('Avg Revenue/Client:', avgRevenuePerClient);
    console.log('=======================');

    if (loading) {
        return (
            <div className="client-management">
                <div className="loading-state">
                    <h2>Loading client data...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="client-management">
            {/* Header */}
            <div className="clients-header">
                <div>
                    <h2>Client Management</h2>
                    <p className="subtitle">Real-time client data from Google Sheets</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'overview' ? 'active' : ''}`}
                            onClick={() => setViewMode('overview')}
                        >
                            📊 Overview
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            📋 List
                        </button>
                    </div>
                    <Button variant="primary" icon="➕">Add New Client</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon">👥</div>
                    <div className="kpi-content">
                        <div className="kpi-label">Total Clients</div>
                        <div className="kpi-value">{filteredClients.length}</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon">💰</div>
                    <div className="kpi-content">
                        <div className="kpi-label">Total Revenue</div>
                        <div className="kpi-value">₹{(totalRevenue / 1000).toFixed(0)}K</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon">📄</div>
                    <div className="kpi-content">
                        <div className="kpi-label">Total Invoices</div>
                        <div className="kpi-value">{totalInvoices}</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon">📈</div>
                    <div className="kpi-content">
                        <div className="kpi-label">Avg Revenue/Client</div>
                        <div className="kpi-value">₹{(avgRevenuePerClient / 1000).toFixed(0)}K</div>
                    </div>
                </div>
            </div>

            {/* Overview View */}
            {viewMode === 'overview' && (
                <div className="overview-view">
                    {/* Charts Row */}
                    <div className="charts-row">
                        {/* Revenue Chart */}
                        <div className="chart-card">
                            <h3>Top 5 Clients by Revenue</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(26, 26, 36, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue (₹)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}
                        <div className="chart-card">
                            <h3>Client Distribution by Revenue</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(26, 26, 36, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Clients Grid */}
                    <div className="section-header">
                        <h3>Top Clients</h3>
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="clients-grid">
                        {topClients.map(client => (
                            <div key={client.client_id} className="client-card-modern">
                                <div className="client-card-header">
                                    <div className="client-avatar">{client.name.charAt(0)}</div>
                                    <div className="client-info">
                                        <div className="client-name">{client.name}</div>
                                        <div className="client-id-badge">{client.client_id}</div>
                                    </div>
                                </div>
                                <div className="client-card-body">
                                    <div className="client-detail">
                                        <span className="detail-icon">🏢</span>
                                        <span>{client.company}</span>
                                    </div>
                                    <div className="client-detail">
                                        <span className="detail-icon">📧</span>
                                        <span>{client.email}</span>
                                    </div>
                                    <div className="client-detail">
                                        <span className="detail-icon">📞</span>
                                        <span>{client.phone}</span>
                                    </div>
                                </div>
                                <div className="client-card-footer">
                                    <div className="revenue-stat">
                                        <div className="stat-label">Total Revenue</div>
                                        <div className="stat-value">₹{client.totalRevenue.toLocaleString()}</div>
                                    </div>
                                    <div className="invoice-stat">
                                        <div className="stat-label">Invoices</div>
                                        <div className="stat-value">{client.invoiceCount}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="list-view">
                    <div className="list-header">
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input-large"
                        />
                    </div>
                    <div className="client-table">
                        <div className="table-header">
                            <div>ID</div>
                            <div>Client Name</div>
                            <div>Company</div>
                            <div>Contact</div>
                            <div>Revenue</div>
                            <div>Invoices</div>
                            <div>Last Invoice</div>
                        </div>
                        {filteredClients.map(client => (
                            <div key={client.client_id} className="table-row">
                                <div>{client.client_id}</div>
                                <div className="client-name-cell">{client.name}</div>
                                <div>{client.company}</div>
                                <div>{client.email}</div>
                                <div className="value-cell">₹{client.totalRevenue.toLocaleString()}</div>
                                <div>
                                    <Badge variant="primary">{client.invoiceCount}</Badge>
                                </div>
                                <div>{client.lastInvoiceDate}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManagement;
