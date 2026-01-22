import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import Badge from '../components/Badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getSalesLeaderboard, getMonthlyRevenue, getProductRevenue, formatCurrency } from '../utils/dataCalculations';
import './SalesDashboard.css';

const SalesDashboard = () => {
    const monthlySales = getMonthlyRevenue(6);
    const allProducts = getProductRevenue();
    const productData = allProducts.slice(0, 4).map((product, index) => ({
        name: product.name.split(' ')[0],
        value: Math.round(product.value / 10000),
        color: ['#6366f1', '#a855f7', '#ec4899', '#06b6d4'][index]
    }));
    const leaderboard = getSalesLeaderboard();
    const currentMonth = monthlySales[monthlySales.length - 1];
    const quarterlyTotal = monthlySales.slice(-3).reduce((sum, m) => sum + m.revenue, 0);

    return (
        <div className="sales-dashboard">
            <div className="kpi-grid">
                <StatCard
                    title="Monthly Sales"
                    value={formatCurrency(currentMonth.revenue)}
                    trend="vs target ₹600K"
                    trendValue={((currentMonth.revenue - 600000) / 600000 * 100).toFixed(1)}
                    icon="💵"
                    color="success"
                />
                <StatCard
                    title="Quarterly Sales"
                    value={formatCurrency(quarterlyTotal)}
                    trend="Last 3 months"
                    trendValue={12}
                    icon="📊"
                    color="primary"
                />
                <StatCard
                    title="Conversion Rate"
                    value="24.8%"
                    trend="vs last month"
                    trendValue={2.4}
                    icon="🎯"
                    color="info"
                />
                <StatCard
                    title="Target Progress"
                    value="105%"
                    trend="Above target"
                    trendValue={5}
                    icon="🏆"
                    color="warning"
                />
            </div>

            <div className="charts-row">
                <ChartCard title="Monthly Sales Performance" description="Revenue by month (Real Invoice Data)">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlySales}>
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
                            <Bar dataKey="revenue" fill="url(#salesGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Product Mix" description="Top products by revenue">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={productData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {productData.map((entry, index) => (
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
            </div>

            <div className="leaderboard-section">
                <h3 className="section-title">Sales Leaderboard (Calculated from Actual Invoices)</h3>
                <div className="leaderboard-table">
                    <div className="leaderboard-header">
                        <div className="col-rank">Rank</div>
                        <div className="col-name">Salesperson</div>
                        <div className="col-sales">Sales Count</div>
                        <div className="col-deals">Deals Closed</div>
                        <div className="col-revenue">Revenue</div>
                        <div className="col-badge">Achievement</div>
                    </div>
                    {leaderboard.map((person, index) => (
                        <div key={index} className="leaderboard-row">
                            <div className="col-rank">
                                <span className={`rank-badge rank-${Math.min(index + 1, 4)}`}>
                                    {index + 1}
                                </span>
                            </div>
                            <div className="col-name">{person.name}</div>
                            <div className="col-sales">{person.sales}</div>
                            <div className="col-deals">{person.deals}</div>
                            <div className="col-revenue revenue-value">{formatCurrency(person.revenue)}</div>
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
