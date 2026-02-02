import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { dashboardAPI } from '../services/api';
import { formatCurrency } from '../utils/dataCalculations';
import './ExecutiveDashboard.css';

const ExecutiveDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard data on mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await dashboardAPI.getExecutiveMetrics();
                setDashboardData(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="dashboard-page">
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Loading dashboard...</h2>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="dashboard-page">
                <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
                    <h2>{error}</h2>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    // Prepare chart data
    const revenueData = (dashboardData?.monthly_revenue || []).map(data => ({
        month: data.month,
        revenue: data.revenue
    }));
    const topClients = dashboardData?.top_clients || [];
    const departmentData = [
        { department: 'Sales', performance: 85 },
        { department: 'Operations', performance: 92 },
        { department: 'Finance', performance: 78 },
        { department: 'Support', performance: 88 },
    ];

    return (
        <div className="dashboard-page">
            <div className="kpi-grid">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(dashboardData?.total_revenue || 0)}
                    trend="vs last month"
                    trendValue={dashboardData?.revenue_growth || 0}
                    icon="💰"
                    color="success"
                />
                <StatCard
                    title="Revenue Growth"
                    value={`${(dashboardData?.revenue_growth || 0).toFixed(1)}%`}
                    trend="Month over Month"
                    trendValue={dashboardData?.revenue_growth || 0}
                    icon="📈"
                    color="primary"
                />
                <StatCard
                    title="Total Invoices"
                    value={(dashboardData?.total_invoices || 0).toString()}
                    trend="Total created"
                    trendValue={dashboardData?.invoice_growth || 0}
                    icon="📄"
                    color="info"
                />
                <StatCard
                    title="Active Clients"
                    value={(dashboardData?.active_clients || 0).toString()}
                    trend="With invoices"
                    trendValue={dashboardData?.client_growth || 0}
                    icon="👥"
                    color="warning"
                />
            </div>

            <div className="charts-grid">
                <ChartCard title="Revenue Trend" description="Monthly revenue vs target (Last 6 months)">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1a24',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Actual" />
                            <Line type="monotone" dataKey="target" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Department Performance" description="Overall team efficiency">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="department" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1a24',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="performance" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="summary-section">
                <div className="summary-card">
                    <h3 className="summary-title">Top Clients by Revenue (Real Data)</h3>
                    <div className="summary-list">
                        {topClients.map((client, index) => (
                            <div key={index} className="summary-item">
                                <span className="summary-rank">{index + 1}</span>
                                <div className="summary-info">
                                    <h4 className="summary-name">{client.name}</h4>
                                    <p className="summary-detail">{formatCurrency(client.revenue)}</p>
                                </div>
                            </div>
                        ))}</div>
                </div>

                <div className="summary-card">
                    <h3 className="summary-title">Strategic Initiatives</h3>
                    <div className="initiative-list">
                        <div className="initiative-item">
                            <div className="initiative-header">
                                <span className="initiative-name">Market Expansion</span>
                                <span className="initiative-status on-track">On Track</span>
                            </div>
                            <div className="initiative-progress">
                                <div className="progress-bar" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                        <div className="initiative-item">
                            <div className="initiative-header">
                                <span className="initiative-name">Product Launch</span>
                                <span className="initiative-status at-risk">At Risk</span>
                            </div>
                            <div className="initiative-progress">
                                <div className="progress-bar warning" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveDashboard;
