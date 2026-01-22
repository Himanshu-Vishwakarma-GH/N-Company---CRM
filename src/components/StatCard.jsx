import './StatCard.css';

const StatCard = ({ title, value, trend, trendValue, icon, color = 'primary' }) => {
    const isPositive = trendValue >= 0;

    return (
        <div className={`stat-card stat-card-${color}`}>
            <div className="stat-card-header">
                <div className="stat-card-title">{title}</div>
                {icon && <span className="stat-card-icon">{icon}</span>}
            </div>

            <div className="stat-card-value">{value}</div>

            {trend && (
                <div className="stat-card-trend">
                    <span className={`trend-indicator ${isPositive ? 'trend-up' : 'trend-down'}`}>
                        {isPositive ? '↑' : '↓'} {Math.abs(trendValue)}%
                    </span>
                    <span className="trend-text">{trend}</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
