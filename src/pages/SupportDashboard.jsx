import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import Badge from '../components/Badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './SupportDashboard.css';

const SupportDashboard = () => {
    const ticketVolume = [
        { day: 'Mon', open: 12, resolved: 18 },
        { day: 'Tue', open: 15, resolved: 14 },
        { day: 'Wed', open: 10, resolved: 16 },
        { day: 'Thu', open: 18, resolved: 15 },
        { day: 'Fri', open: 14, resolved: 20 },
    ];

    const issueCategories = [
        { name: 'Technical', value: 35, color: '#ef4444' },
        { name: 'Billing', value: 25, color: '#f59e0b' },
        { name: 'Feature Request', value: 20, color: '#3b82f6' },
        { name: 'General', value: 15, color: '#10b981' },
        { name: 'Bug Report', value: 5, color: '#a855f7' },
    ];

    return (
        <div className="support-dashboard">
            <div className="kpi-grid">
                <StatCard
                    title="Total Tickets"
                    value="247"
                    trend="This month"
                    trendValue={-8.2}
                    icon="🎫"
                    color="primary"
                />
                <StatCard
                    title="Avg Response Time"
                    value="2.4 hrs"
                    trend="vs target 3 hrs"
                    trendValue={-20}
                    icon="⚡"
                    color="success"
                />
                <StatCard
                    title="Avg Resolution Time"
                    value="8.5 hrs"
                    trend="vs last month"
                    trendValue={-12.5}
                    icon="✓"
                    color="info"
                />
                <StatCard
                    title="CSAT Score"
                    value="4.7/5"
                    trend="94% positive"
                    trendValue={5.2}
                    icon="⭐"
                    color="warning"
                />
            </div>

            <div className="charts-row">
                <ChartCard title="Ticket Volume Trend" description="Daily open vs resolved tickets">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ticketVolume}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="day" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1a24',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="open" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Open" />
                            <Bar dataKey="resolved" fill="#10b981" radius={[8, 8, 0, 0]} name="Resolved" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Common Issues" description="Issue distribution">
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
            </div>

            <div className="team-performance">
                <h3 className="section-title">Team Performance</h3>
                <div className="performance-grid">
                    <div className="agent-card">
                        <div className="agent-name">Ravi Kumar</div>
                        <div className="agent-stats">
                            <div className="stat-item">
                                <span className="stat-label">Resolved</span>
                                <span className="stat-value">45</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Avg Time</span>
                                <span className="stat-value">6.2 hrs</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">CSAT</span>
                                <span className="stat-value">4.8</span>
                            </div>
                        </div>
                        <Badge variant="success" icon="🏆">Top Performer</Badge>
                    </div>

                    <div className="agent-card">
                        <div className="agent-name">Sneha Gupta</div>
                        <div className="agent-stats">
                            <div className="stat-item">
                                <span className="stat-label">Resolved</span>
                                <span className="stat-value">42</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Avg Time</span>
                                <span className="stat-value">7.1 hrs</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">CSAT</span>
                                <span className="stat-value">4.6</span>
                            </div>
                        </div>
                        <Badge variant="primary" icon="⭐">High Quality</Badge>
                    </div>

                    <div className="agent-card">
                        <div className="agent-name">Arjun Singh</div>
                        <div className="agent-stats">
                            <div className="stat-item">
                                <span className="stat-label">Resolved</span>
                                <span className="stat-value">38</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Avg Time</span>
                                <span className="stat-value">8.5 hrs</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">CSAT</span>
                                <span className="stat-value">4.5</span>
                            </div>
                        </div>
                        <Badge variant="info" icon="✓">Consistent</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportDashboard;
