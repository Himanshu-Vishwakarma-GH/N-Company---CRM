import './Input.css';

export const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    icon,
    disabled = false,
    required = false
}) => {
    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className={`input-wrapper ${error ? 'input-error' : ''}`}>
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    type={type}
                    className="input-field"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
            </div>
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
};

export const Select = ({
    label,
    options = [],
    value,
    onChange,
    error,
    placeholder = 'Select an option',
    disabled = false,
    required = false
}) => {
    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className={`input-wrapper ${error ? 'input-error' : ''}`}>
                <select
                    className="input-field select-field"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
};

export default Input;
