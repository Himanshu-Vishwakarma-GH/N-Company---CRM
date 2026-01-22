import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    loading = false,
    disabled = false,
    onClick,
    type = 'button'
}) => {
    return (
        <button
            className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''}`}
            onClick={onClick}
            disabled={disabled || loading}
            type={type}
        >
            {loading && <span className="btn-spinner spin">⟳</span>}
            {icon && !loading && <span className="btn-icon">{icon}</span>}
            <span className="btn-text">{children}</span>
        </button>
    );
};

export default Button;
