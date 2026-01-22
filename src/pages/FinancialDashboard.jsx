import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getProfitMargin, getRevenueVsCost, getPaidRevenue, getPendingRevenue, formatCurrency } from '../utils/dataCalculations';
import './FinancialDashboard.css';

const FinancialDashboard = () => {
    const { revenue, cost, profit, margin } = getProfitMargin();
    const revenueVsCost = getRevenueVsCost();
    const paidRevenue = getPaidRevenue();
    const pendingRevenue = getPendingRevenue();

    const budgetData = [
        { category: 'Marketing', budget: 50000, spent: 42000 },
        { category: 'R&D', budget: 80000, spent: 75000 },
        { category: 'Operations', budget: 60000, spent: 58000 },
        { category: 'HR', budget: 40000, spent: 35000 },
    ];

    return (
        <div className="financial-dashboard">
            <div className="kpi-grid">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(revenue)}
                    trend="From Invoices"
                    trendValue={15.2}
                    icon="💵"
                    color="success"
                />
                <StatCard
                    title="Total Costs"
                    value={formatCurrency(cost)}
                    trend="Operating costs"
                    trendValue={-3.2}
                    icon="📊"
                    color="danger"
                />
                <StatCard
                    title="Net Profit"
                    value={formatCurrency(profit)}
                    trend="Profit calculated"
                    trendValue={10.5}
                    icon="💎"
                    color="primary"
                />
                <StatCard
                    title="Profit Margin"
                    value={`${margin}%`}
                    trend="vs target 30%"
                    trendValue={parseFloat(margin) - 30}
                    icon="📈"
                    color="info"
                />
            </div>

            <ChartCard title="Revenue vs Cost Analysis" description="Monthly comparison (Real Data)">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={revenueVsCost}>
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
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue" />
                        <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={3} name="Cost" />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Budget Utilization" description="Department-wise spending">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="category" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{
                                background: '#1a1a24',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="budget" fill="#6366f1" radius={[8, 8, 0, 0]} name="Budget" />
                        <Bar dataKey="spent" fill="#10b981" radius={[8, 8, 0, 0]} name="Spent" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="forecast-section">
                <h3 className="section-title">Cash Flow Status (Real Invoice Data)</h3>
                <div className="forecast-table">
                    <div className="forecast-header">
                        <div>Metric</div>
                        <div>Amount</div>
                        <div>Percentage</div>
                        <div>Status</div>
                    </div>
                    <div className="forecast-row">
                        <div>Paid Invoices</div>
                        <div className="actual-positive">{formatCurrency(paidRevenue)}</div>
                        <div>{((paidRevenue / revenue) * 100).toFixed(1)}%</div>
                        <div className="variance-positive">Collected</div>
                    </div>
                    <div className="forecast-row">
                        <div>Pending Invoices</div>
                        <div className="actual-negative">{formatCurrency(pendingRevenue)}</div>
                        <div>{((pendingRevenue / revenue) * 100).toFixed(1)}%</div>
                        <div className="variance-negative">Outstanding</div>
                    </div>
                    <div className="forecast-row">
                        <div>Total Revenue</div>
                        <div className="actual-positive">{formatCurrency(revenue)}</div>
                        <div>100%</div>
                        <div className="variance-positive">Total</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboard;
