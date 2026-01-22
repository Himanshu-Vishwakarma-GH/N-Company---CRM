import './Badge.css';

const Badge = ({ children, variant = 'default', size = 'md', icon }) => {
    return (
        <span className={`badge badge-${variant} badge-${size}`}>
            {icon && <span className="badge-icon">{icon}</span>}
            {children}
        </span>
    );
};

export default Badge;
