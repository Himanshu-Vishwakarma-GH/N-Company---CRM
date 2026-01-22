import Badge from '../components/Badge';
import { getOrdersByStatus } from '../utils/dataCalculations';
import './OperationsDashboard.css';

const OperationsDashboard = () => {
    // Get orders from actual invoices
    const orders = getOrdersByStatus();

    const tasks = [
        { id: 1, title: 'Complete client onboarding - Acme Corp', priority: 'high', assignee: 'Rajesh', dueDate: '2026-01-23' },
        { id: 2, title: 'Update inventory records', priority: 'medium', assignee: 'Priya', dueDate: '2026-01-24' },
        { id: 3, title: 'Process pending invoices', priority: 'high', assignee: 'Amit', dueDate: '2026-01-22' },
        { id: 4, title: 'Quality check batch #45', priority: 'low', assignee: 'Neha', dueDate: '2026-01-25' },
    ];

    return (
        <div className="operations-dashboard">
            <div className="status-board">
                <div className="board-column">
                    <div className="column-header pending-header">
                        <h3>Pending</h3>
                        <Badge variant="warning" size="sm">{orders.pending.length}</Badge>
                    </div>
                    <div className="order-cards">
                        {orders.pending.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-id">{order.id}</div>
                                <div className="order-client">{order.client}</div>
                                <div className="order-item">{order.item}</div>
                                <div className="order-due">Due: {order.dueDate}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="board-column">
                    <div className="column-header progress-header">
                        <h3>In Progress</h3>
                        <Badge variant="info" size="sm">{orders.inProgress.length}</Badge>
                    </div>
                    <div className="order-cards">
                        {orders.inProgress.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-id">{order.id}</div>
                                <div className="order-client">{order.client}</div>
                                <div className="order-item">{order.item}</div>
                                <div className="order-assignee">📦 Processing</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="board-column">
                    <div className="column-header shipped-header">
                        <h3>Shipped</h3>
                        <Badge variant="primary" size="sm">{orders.shipped.length}</Badge>
                    </div>
                    <div className="order-cards">
                        {orders.shipped.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-id">{order.id}</div>
                                <div className="order-client">{order.client}</div>
                                <div className="order-item">{order.item}</div>
                                <div className="order-shipped">📦 {order.shippedDate}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="board-column">
                    <div className="column-header delivered-header">
                        <h3>Delivered</h3>
                        <Badge variant="success" size="sm">{orders.delivered.length}</Badge>
                    </div>
                    <div className="order-cards">
                        {orders.delivered.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-id">{order.id}</div>
                                <div className="order-client">{order.client}</div>
                                <div className="order-item">{order.item}</div>
                                <div className="order-delivered">✓ {order.deliveredDate}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="tasks-section">
                <h3 className="section-title">Pending Tasks</h3>
                <div className="tasks-list">
                    {tasks.map(task => (
                        <div key={task.id} className="task-item">
                            <input type="checkbox" className="task-checkbox" />
                            <div className="task-info">
                                <div className="task-title">{task.title}</div>
                                <div className="task-meta">
                                    <span>👤 {task.assignee}</span>
                                    <span>📅 {task.dueDate}</span>
                                </div>
                            </div>
                            <Badge
                                variant={
                                    task.priority === 'high' ? 'danger' :
                                        task.priority === 'medium' ? 'warning' : 'default'
                                }
                            >
                                {task.priority}
                            </Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OperationsDashboard;
