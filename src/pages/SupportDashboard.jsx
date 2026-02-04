import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { ticketAPI, clientAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './SupportDashboard.css';

const SupportDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [clients, setClients] = useState([]);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        client_id: '',
        client_name: '',
        priority: 'medium',
        category: 'general',
        assigned_to: ''
    });

    useEffect(() => {
        fetchTickets();
        fetchClients();
    }, [statusFilter]);

    const fetchClients = async () => {
        try {
            const response = await clientAPI.listClients();
            const clientsData = response?.data || [];
            setClients(clientsData);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        }
    };

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const filters = statusFilter !== 'all' ? { status: statusFilter } : {};
            const response = await ticketAPI.listTickets(filters);

            const ticketsData = response?.data?.tickets || [];
            setTickets(ticketsData);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // If client is selected, update both client_id and client_name
        if (name === 'client_id') {
            const selectedClient = clients.find(c => c.client_id === value);
            setFormData({
                ...formData,
                client_id: value,
                client_name: selectedClient ? selectedClient.name : ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleCreateTicket = async () => {
        // Validation
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return;
        }
        if (!formData.client_id) {
            setError('Please select a client');
            return;
        }

        try {
            setCreating(true);
            setError('');

            await ticketAPI.createTicket(formData);

            // Reset form
            setFormData({
                title: '',
                description: '',
                client_id: '',
                client_name: '',
                priority: 'medium',
                category: 'general',
                assigned_to: ''
            });

            // Close modal and refresh tickets
            setShowCreateModal(false);
            fetchTickets();

        } catch (error) {
            console.error('Failed to create ticket:', error);
            setError('Failed to create ticket. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    // Calculate statistics from real data
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;

    const resolvedWithDates = tickets.filter(t => t.status === 'resolved' && t.resolved_date && t.created_date);
    const avgResolutionTime = resolvedWithDates.length > 0
        ? (resolvedWithDates.reduce((sum, ticket) => {
            const created = new Date(ticket.created_date);
            const resolved = new Date(ticket.resolved_date);
            const diffHours = (resolved - created) / (1000 * 60 * 60);
            return sum + diffHours;
        }, 0) / resolvedWithDates.length).toFixed(1)
        : 'N/A';

    const statusData = [
        { name: 'Open', value: openTickets, color: '#f59e0b' },
        { name: 'In Progress', value: inProgressTickets, color: '#3b82f6' },
        { name: 'Resolved', value: resolvedTickets, color: '#10b981' },
        { name: 'Closed', value: closedTickets, color: '#64748b' },
    ].filter(item => item.value > 0);

    const priorityCounts = {
        low: tickets.filter(t => t.priority === 'low').length,
        medium: tickets.filter(t => t.priority === 'medium').length,
        high: tickets.filter(t => t.priority === 'high').length,
        critical: tickets.filter(t => t.priority === 'critical').length,
    };

    const priorityData = [
        { priority: 'Low', count: priorityCounts.low },
        { priority: 'Medium', count: priorityCounts.medium },
        { priority: 'High', count: priorityCounts.high },
        { priority: 'Critical', count: priorityCounts.critical },
    ];

    const categoryMap = {};
    tickets.forEach(ticket => {
        const category = ticket.category || 'general';
        categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const categoryColors = {
        technical: '#ef4444',
        billing: '#f59e0b',
        general: '#10b981',
        feature_request: '#3b82f6',
    };

    const issueCategories = Object.entries(categoryMap).map(([name, value]) => ({
        name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value,
        color: categoryColors[name] || '#a855f7'
    }));

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return '#ef4444';
            case 'high': return '#f59e0b';
            case 'medium': return '#3b82f6';
            case 'low': return '#10b981';
            default: return '#64748b';
        }
    };

    const getStatusBadge = (status) => {
        const badgeMap = {
            'open': { variant: 'warning', text: 'Open' },
            'in_progress': { variant: 'primary', text: 'In Progress' },
            'resolved': { variant: 'success', text: 'Resolved' },
            'closed': { variant: 'secondary', text: 'Closed' },
        };
        const badge = badgeMap[status] || { variant: 'secondary', text: status };
        return <Badge variant={badge.variant}>{badge.text}</Badge>;
    };

    if (loading) {
        return (
            <div className="support-dashboard">
                <div className="loading-state">
                    <h2>Loading tickets...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="support-dashboard">
            {/* Header with Create Button */}
            <div className="dashboard-header">
                <div>
                    <h2 className="dashboard-title">Customer Support Dashboard</h2>
                    <p className="dashboard-subtitle">Manage and track support tickets</p>
                </div>
                <Button
                    variant="primary"
                    icon="+"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create Ticket
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <StatCard
                    title="Total Tickets"
                    value={totalTickets.toString()}
                    trend="All statuses"
                    icon="🎫"
                    color="primary"
                />
                <StatCard
                    title="Open Tickets"
                    value={openTickets.toString()}
                    trend="Needs attention"
                    icon="🔔"
                    color="warning"
                />
                <StatCard
                    title="Avg Resolution Time"
                    value={avgResolutionTime !== 'N/A' ? `${avgResolutionTime} hrs` : 'N/A'}
                    trend={`${resolvedTickets} resolved`}
                    icon="✓"
                    color="success"
                />
                <StatCard
                    title="In Progress"
                    value={inProgressTickets.toString()}
                    trend="Being worked on"
                    icon="⚡"
                    color="info"
                />
            </div>

            {/* Status Filter */}
            <div className="filter-section">
                <div className="filter-buttons">
                    <button
                        className={statusFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({totalTickets})
                    </button>
                    <button
                        className={statusFilter === 'open' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setStatusFilter('open')}
                    >
                        Open ({openTickets})
                    </button>
                    <button
                        className={statusFilter === 'in_progress' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setStatusFilter('in_progress')}
                    >
                        In Progress ({inProgressTickets})
                    </button>
                    <button
                        className={statusFilter === 'resolved' ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setStatusFilter('resolved')}
                    >
                        Resolved ({resolvedTickets})
                    </button>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-row">
                <ChartCard title="Tickets by Priority" description="Priority distribution">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={priorityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="priority" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1a24',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Tickets" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {issueCategories.length > 0 && (
                    <ChartCard title="Tickets by Category" description="Category distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={issueCategories}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label
                                >
                                    {issueCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a24',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                )}
            </div>

            {/* Tickets List */}
            <div className="tickets-section">
                <h3 className="section-title">Recent Tickets</h3>
                {tickets.length === 0 ? (
                    <div className="empty-state">
                        <p>No tickets found. Create your first ticket to get started!</p>
                    </div>
                ) : (
                    <div className="tickets-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Client</th>
                                    <th>Priority</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.ticket_id}>
                                        <td className="ticket-id">{ticket.ticket_id}</td>
                                        <td className="ticket-title">{ticket.title}</td>
                                        <td>{ticket.client_name}</td>
                                        <td>
                                            <span
                                                className="priority-badge"
                                                style={{
                                                    backgroundColor: getPriorityColor(ticket.priority),
                                                    color: '#fff',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {ticket.priority?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{ticket.category.replace('_', ' ')}</td>
                                        <td>{getStatusBadge(ticket.status)}</td>
                                        <td>{ticket.assigned_to || 'Unassigned'}</td>
                                        <td>{ticket.created_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New Ticket</h3>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="client_id">Client *</label>
                                <select
                                    id="client_id"
                                    name="client_id"
                                    value={formData.client_id}
                                    onChange={handleInputChange}
                                    className="form-input"
                                >
                                    <option value="">Select a client</option>
                                    {clients.map(client => (
                                        <option key={client.client_id} value={client.client_id}>
                                            {client.name} - {client.company}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of the issue"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Detailed description of the issue or request"
                                    rows={4}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="priority">Priority</label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    >
                                        <option value="general">General</option>
                                        <option value="technical">Technical</option>
                                        <option value="billing">Billing</option>
                                        <option value="feature_request">Feature Request</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="assigned_to">Assign To</label>
                                <input
                                    type="text"
                                    id="assigned_to"
                                    name="assigned_to"
                                    value={formData.assigned_to}
                                    onChange={handleInputChange}
                                    placeholder="Support agent name (optional)"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Button
                                variant="secondary"
                                onClick={() => setShowCreateModal(false)}
                                disabled={creating}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCreateTicket}
                                disabled={creating}
                            >
                                {creating ? 'Creating...' : 'Create Ticket'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportDashboard;
