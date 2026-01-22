import './ChartCard.css';

const ChartCard = ({ title, description, children, actions }) => {
    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <div className="chart-card-info">
                    <h3 className="chart-card-title">{title}</h3>
                    {description && <p className="chart-card-description">{description}</p>}
                </div>
                {actions && <div className="chart-card-actions">{actions}</div>}
            </div>
            <div className="chart-card-body">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
