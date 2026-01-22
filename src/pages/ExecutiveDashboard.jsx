import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getExecutiveKPIs, getMonthlyRevenue, getProductRevenue, formatCurrency } from '../utils/dataCalculations';
import './ExecutiveDashboard.css';

const ExecutiveDashboard = () => {
    const kpis = getExecutiveKPIs();
    const revenueData = getMonthlyRevenue(6).map(data => ({
        month: data.month,
        revenue: data.revenue,
        target: data.revenue * 0.95
    }));
    const topProducts = getProductRevenue().slice(0, 3);
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
                    value={formatCurrency(kpis.totalRevenue)}
                    trend="vs last month"
                    trendValue={kpis.growthRate}
                    icon="💰"
                    color="success"
                />
                <StatCard
                    title="Growth Rate"
                    value={`${kpis.growthRate}%`}
                    trend="Month over Month"
                    trendValue={kpis.growthRate > 0 ? 5.2 : -2.1}
                    icon="📈"
                    color="primary"
                />
                <StatCard
                    title="Profit Margin"
                    value={`${kpis.profitMargin}%`}
                    trend="Above target 30%"
                    trendValue={8.3}
                    icon="💎"
                    color="info"
                />
                <StatCard
                    title="Active Customers"
                    value={kpis.activeCustomers.toString()}
                    trend="Converted + Repeat"
                    trendValue={3.4}
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
                    <h3 className="summary-title">Top Performing Products (Real Data)</h3>
                    <div className="summary-list">
                        {topProducts.map((product, index) => (
                            <div key={index} className="summary-item">
                                <span className="summary-rank">{index + 1}</span>
                                <span className="summary-name">{product.name}</span>
                                <span className="summary-value">{formatCurrency(product.value)}</span>
                            </div>
                        ))}
                    </div>
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
