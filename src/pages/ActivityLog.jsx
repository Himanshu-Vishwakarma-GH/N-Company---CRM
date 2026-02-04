import { useState, useEffect } from 'react';
import Badge from '../components/Badge';
import { activityAPI } from '../services/api';
import './ActivityLog.css';

const ActivityLog = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await activityAPI.listActivities(100);
            if (response && response.data) {
                setActivities(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch activity log:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        if (type.includes('start_session')) return '🚀';
        if (type.includes('invoice')) return '📄';
        if (type.includes('client')) return '👥';
        if (type.includes('ticket')) return '🎫';
        if (type.includes('task')) return '✅';
        return '🔔';
    };

    const getBadgeVariant = (type) => {
        if (type.includes('start_session')) return 'primary';
        if (type.includes('invoice')) return 'success';
        if (type.includes('client')) return 'warning';
        if (type.includes('ticket')) return 'danger';
        return 'secondary';
    };

    const formatTimestamp = (isoString) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredActivities = activities.filter(activity => {
        if (filter === 'all') return true;
        return activity.type.includes(filter);
    });

    return (
        <div className="activity-page">
            <div className="activity-header">
                <div>
                    <h2 className="page-title">Activity Log</h2>
                    <p className="page-subtitle">Track system events and user actions</p>
                </div>
                <button className="refresh-btn" onClick={fetchActivities}>
                    🔄 Refresh
                </button>
            </div>

            <div className="activity-filters">
                <button
                    className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-chip ${filter === 'client' ? 'active' : ''}`}
                    onClick={() => setFilter('client')}
                >
                    Clients
                </button>
                <button
                    className={`filter-chip ${filter === 'invoice' ? 'active' : ''}`}
                    onClick={() => setFilter('invoice')}
                >
                    Invoices
                </button>
                <button
                    className={`filter-chip ${filter === 'ticket' ? 'active' : ''}`}
                    onClick={() => setFilter('ticket')}
                >
                    Tickets
                </button>
            </div>

            <div className="activity-container">
                {loading ? (
                    <div className="loading-state">Loading activities...</div>
                ) : filteredActivities.length === 0 ? (
                    <div className="empty-state">No activities found</div>
                ) : (
                    <div className="activity-table-wrapper">
                        <table className="activity-table">
                            <thead>
                                <tr>
                                    <th width="50"></th>
                                    <th>Activity</th>
                                    <th>Description</th>
                                    <th>User</th>
                                    <th>Time</th>
                                    <th>Entity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredActivities.map((log) => (
                                    <tr key={log.log_id}>
                                        <td className="icon-cell">
                                            <div className="log-icon">{getIcon(log.type)}</div>
                                        </td>
                                        <td>
                                            <span className="log-title">{log.title}</span>
                                            <Badge variant={getBadgeVariant(log.type)} className="ml-2">
                                                {log.type.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td>{log.description}</td>
                                        <td>{log.user}</td>
                                        <td className="timestamp-cell">{formatTimestamp(log.timestamp)}</td>
                                        <td>
                                            {log.entity_id && (
                                                <code className="entity-badge">{log.entity_id}</code>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLog;
