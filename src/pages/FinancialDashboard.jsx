import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { dashboardAPI } from '../services/api';
import { formatCurrency } from '../utils/dataCalculations';
import './FinancialDashboard.css';

const FinancialDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dashboardAPI.getFinancialMetrics();
                setDashboardData(data);
            } catch (error) {
                console.error('Failed to fetch financial data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="financial-dashboard"><div style={{ padding: '40px', textAlign: 'center' }}><h2>Loading...</h2></div></div>;
    }

    const paymentStatus = dashboardData?.payment_status || {};
    const revenueByMonth = dashboardData?.revenue_by_month || [];

    return (
        <div className="financial-dashboard">
            <div className="kpi-grid">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(dashboardData?.total_revenue || 0)}
                    trend="From Invoices"
                    trendValue={0}
                    icon="💵"
                    color="success"
                />
                <StatCard
                    title="Total Tax"
                    value={formatCurrency(dashboardData?.total_tax || 0)}
                    trend="Tax collected"
                    trendValue={0}
                    icon="📊"
                    color="info"
                />
                <StatCard
                    title="Total Discount"
                    value={formatCurrency(dashboardData?.total_discount || 0)}
                    trend="Discounts given"
                    trendValue={0}
                    icon="🎁"
                    color="warning"
                />
                <StatCard
                    title="Net Revenue"
                    value={formatCurrency(dashboardData?.net_revenue || 0)}
                    trend="After tax/discount"
                    trendValue={0}
                    icon="💎"
                    color="primary"
                />
            </div>

            <ChartCard title="Revenue by Month" description="Monthly trends (Real Data)">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={revenueByMonth}>
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
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="forecast-section">
                <h3 className="section-title">Payment Status (Real Invoice Data)</h3>
                <div className="forecast-table">
                    <div className="forecast-header">
                        <div>Status</div>
                        <div>Amount</div>
                        <div>Percentage</div>
                    </div>
                    <div className="forecast-row">
                        <div>Paid</div>
                        <div className="actual-positive">{formatCurrency(paymentStatus.paid || 0)}</div>
                        <div>{((paymentStatus.paid || 0) / (dashboardData?.total_revenue || 1) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="forecast-row">
                        <div>Pending</div>
                        <div className="actual-negative">{formatCurrency(paymentStatus.pending || 0)}</div>
                        <div>{((paymentStatus.pending || 0) / (dashboardData?.total_revenue || 1) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="forecast-row">
                        <div>Overdue</div>
                        <div className="actual-negative">{formatCurrency(paymentStatus.overdue || 0)}</div>
                        <div>{((paymentStatus.overdue || 0) / (dashboardData?.total_revenue || 1) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="forecast-row">
                        <div>Draft</div>
                        <div>{formatCurrency(paymentStatus.draft || 0)}</div>
                        <div>{((paymentStatus.draft || 0) / (dashboardData?.total_revenue || 1) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="forecast-row">
                        <div><strong>Total Revenue</strong></div>
                        <div className="actual-positive"><strong>{formatCurrency(dashboardData?.total_revenue || 0)}</strong></div>
                        <div><strong>100%</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboard;
