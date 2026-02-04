import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityAPI } from '../services/api';
import './NotificationsPanel.css';

const NotificationsPanel = ({ isOpen, onClose }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchActivities();
        }
    }, [isOpen]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await activityAPI.listActivities(10);
            if (response && response.data) {
                setActivities(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await activityAPI.markAllRead();
            // Refresh local state or just close
            fetchActivities();
        } catch (error) {
            console.error('Failed to mark read:', error);
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const getIcon = (type) => {
        if (type.includes('start_session')) return '🚀';
        if (type.includes('invoice')) return '📄';
        if (type.includes('client')) return '👥';
        if (type.includes('ticket')) return '🎫';
        if (type.includes('task')) return '✅';
        return '🔔';
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="notifications-backdrop" onClick={onClose} />
            <div className="notifications-panel">
                <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button className="mark-read-btn" onClick={handleMarkAllRead}>
                        Mark all as read
                    </button>
                </div>

                <div className="notifications-list">
                    {loading ? (
                        <div className="notifications-loading">Loading...</div>
                    ) : activities.length === 0 ? (
                        <div className="notifications-empty">
                            No recent notifications
                        </div>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.log_id} className={`notification-item ${activity.status}`}>
                                <div className="notification-icon">
                                    {getIcon(activity.type)}
                                </div>
                                <div className="notification-content">
                                    <p className="notification-title">{activity.title}</p>
                                    <p className="notification-desc">{activity.description}</p>
                                    <span className="notification-time">
                                        {formatTime(activity.timestamp)}
                                    </span>
                                </div>
                                {activity.status === 'unread' && (
                                    <div className="notification-dot" />
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="notifications-footer">
                    <button className="view-all-btn" onClick={() => {
                        navigate('/activity');
                        onClose();
                    }}>
                        View full log
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotificationsPanel;
