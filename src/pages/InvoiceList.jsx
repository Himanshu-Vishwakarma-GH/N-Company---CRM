import { useSearch } from "../context/SearchContext";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import { invoices } from '../data/centralData';
import { getClientById, getTotalRevenue, getPaidRevenue, getPendingRevenue, formatCurrencyFull, formatDate } from '../utils/dataCalculations';
import './InvoiceList.css';

const InvoiceList = () => {
    const { query } = useSearch();
    
    const [statusFilter, setStatusFilter] = useState('all');

    // Calculate statistics
    const totalRevenue = getTotalRevenue();
    const paidRevenue = getPaidRevenue();
    const pendingRevenue = getPendingRevenue();
    const totalInvoices = invoices.length;

    // Filter invoices
    const filteredInvoices = invoices
        .filter(inv => {
            const client = getClientById(inv.clientId);
            const matchesSearch = !query ||
inv.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
client?.name.toLowerCase().includes(query.toLowerCase());


            const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

    const getStatusBadge = (status) => {
        const variants = {
            paid: 'success',
            pending: 'warning',
            overdue: 'danger'
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <div className="invoice-list-page">
            <div className="invoice-list-header">
                <div>
                    <h2>All Invoices</h2>
                    <p className="subtitle">Complete invoice history across all clients</p>
                </div>
                <Link to="/invoice">
                    <Button variant="primary" icon="➕">Create New Invoice</Button>
                </Link>
            </div>

            {/* Summary KPIs */}
            <div className="invoice-stats">
                <StatCard
                    title="Total Invoices"
                    value={totalInvoices.toString()}
                    trend="All time"
                    trendValue={0}
                    icon="📄"
                    color="primary"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
                    trend="From all invoices"
                    trendValue={15.2}
                    icon="💰"
                    color="success"
                />
                <StatCard
                    title="Paid Amount"
                    value={`₹${(paidRevenue / 100000).toFixed(1)}L`}
                    trend="Collected"
                    trendValue={12}
                    icon="✓"
                    color="info"
                />
                <StatCard
                    title="Pending Amount"
                    value={`₹${(pendingRevenue / 100000).toFixed(1)}L`}
                    trend="Outstanding"
                    trendValue={-8}
                    icon="⏳"
                    color="warning"
                />
            </div>

            {/* Filters */}
            <div className="invoice-filters">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by invoice number or client name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({invoices.length})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'paid' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('paid')}
                    >
                        Paid ({invoices.filter(i => i.status === 'paid').length})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Pending ({invoices.filter(i => i.status === 'pending').length})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'overdue' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('overdue')}
                    >
                        Overdue ({invoices.filter(i => i.status === 'overdue').length})
                    </button>
                </div>

                <Button variant="ghost" size="sm" icon="📥">Export CSV</Button>
            </div>

            {/* Invoice Table */}
            <div className="invoice-table-container">
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Sales Person</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map(invoice => {
                            const client = getClientById(invoice.clientId);
                            return (
                                <tr key={invoice.invoiceNumber} className="invoice-row">
                                    <td className="invoice-number">{invoice.invoiceNumber}</td>
                                    <td className="client-name">{client?.name || 'Unknown'}</td>
                                    <td>{formatDate(invoice.date)}</td>
                                    <td>{formatDate(invoice.dueDate)}</td>
                                    <td className="amount-cell">{formatCurrencyFull(invoice.grandTotal)}</td>
                                    <td>{getStatusBadge(invoice.status)}</td>
                                    <td>{invoice.salesPerson}</td>
                                    <td className="actions-cell">
                                        <button className="action-btn-inline">View</button>
                                        <button className="action-btn-inline">Download</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredInvoices.length === 0 && (
                    <div className="no-results">
                        <p>No invoices found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceList;
