import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import Badge from '../components/Badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { dashboardAPI } from '../services/api';
import { formatCurrency } from '../utils/dataCalculations';
import './SalesDashboard.css';

const SalesDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashboardAPI.getSalesMetrics();
                setDashboardData(data);
            } catch (error) {
                console.error('Failed to fetch sales data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="sales-dashboard"><div style={{ padding: '40px', textAlign: 'center' }}><h2>Loading...</h2></div></div>;
    }

    const topSalespeople = dashboardData?.top_salespeople || [];

    return (
        <div className="sales-dashboard">
            <div className="kpi-grid">
                <StatCard
                    title="Total Sales"
                    value={formatCurrency(dashboardData?.total_sales || 0)}
                    trend="From invoices"
                    trendValue={0}
                    icon="💵"
                    color="success"
                />
                <StatCard
                    title="Avg Invoice Value"
                    value={formatCurrency(dashboardData?.avg_invoice_value || 0)}
                    trend="Per invoice"
                    trendValue={0}
                    icon="📊"
                    color="primary"
                />
                <StatCard
                    title="Total Invoices"
                    value={dashboardData?.invoices_count || 0}
                    trend="Created"
                    trendValue={0}
                    icon="🎯"
                    color="info"
                />
                <StatCard
                    title="Conversion Rate"
                    value={`${(dashboardData?.conversion_rate || 0).toFixed(1)}%`}
                    trend="Lead to sale"
                    trendValue={0}
                    icon="🏆"
                    color="warning"
                />
            </div>

            <div className="charts-row">
                <ChartCard title="Sales Trend" description="Daily sales (Real Data)">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardData?.sales_trend || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1a24',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Bar dataKey="sales" fill="url(#salesGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="leaderboard-section">
                <h3 className="section-title">Sales Leaderboard (Real Data)</h3>
                <div className="leaderboard-table">
                    <div className="leaderboard-header">
                        <div className="col-rank">Rank</div>
                        <div className="col-name">Salesperson</div>
                        <div className="col-sales">Invoices</div>
                        <div className="col-revenue">Revenue</div>
                        <div className="col-badge">Achievement</div>
                    </div>
                    {topSalespeople.map((person, index) => (
                        <div key={index} className="leaderboard-row">
                            <div className="col-rank">
                                <span className={`rank-badge rank-${Math.min(index + 1, 4)}`}>
                                    {index + 1}
                                </span>
                            </div>
                            <div className="col-name">{person.name}</div>
                            <div className="col-sales">{person.invoices}</div>
                            <div className="col-revenue revenue-value">{formatCurrency(person.sales)}</div>
                            <div className="col-badge">
                                {index === 0 && <Badge variant="warning" icon="🥇">Top Performer</Badge>}
                                {index === 1 && <Badge variant="info" icon="🥈">Rising Star</Badge>}
                                {index > 1 && <Badge variant="success" icon="✨">Achiever</Badge>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;
