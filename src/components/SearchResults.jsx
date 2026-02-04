import { useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = ({ results, isLoading, query, onClose }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="search-results">
                <div className="search-loading">
                    <span className="spinner">🔍</span>
                    <span>Searching...</span>
                </div>
            </div>
        );
    }

    if (!results || (results.clients.length === 0 && results.invoices.length === 0)) {
        return (
            <div className="search-results">
                <div className="search-empty">
                    <span className="empty-icon">🔍</span>
                    <p>No results found for "{query}"</p>
                </div>
            </div>
        );
    }

    const handleClientClick = (clientId) => {
        navigate(`/clients/${clientId}`);
        onClose();
    };

    const handleInvoiceClick = (invoiceId) => {
        navigate(`/invoice/${invoiceId}`);
        onClose();
    };

    return (
        <div className="search-results">
            {/* Clients Section */}
            {results.clients.length > 0 && (
                <div className="search-section">
                    <div className="search-section-header">
                        <span className="section-icon">👥</span>
                        <h4>Clients ({results.clients.length})</h4>
                    </div>
                    {results.clients.map((client) => (
                        <div
                            key={client.id}
                            className="search-result-item"
                            onClick={() => handleClientClick(client.id)}
                        >
                            <div className="result-icon">👤</div>
                            <div className="result-content">
                                <div className="result-title">{client.name}</div>
                                <div className="result-subtitle">
                                    {client.id} • {client.email}
                                </div>
                                {client.company && (
                                    <div className="result-meta">{client.company}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Invoices Section */}
            {results.invoices.length > 0 && (
                <div className="search-section">
                    <div className="search-section-header">
                        <span className="section-icon">📄</span>
                        <h4>Invoices ({results.invoices.length})</h4>
                    </div>
                    {results.invoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="search-result-item"
                            onClick={() => handleInvoiceClick(invoice.id)}
                        >
                            <div className="result-icon">📋</div>
                            <div className="result-content">
                                <div className="result-title">{invoice.id}</div>
                                <div className="result-subtitle">
                                    {invoice.client_name} • ₹{invoice.grand_total.toLocaleString()}
                                </div>
                                <div className="result-meta">
                                    {invoice.status} • {invoice.invoice_date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
