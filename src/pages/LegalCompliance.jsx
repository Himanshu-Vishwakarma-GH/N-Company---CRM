import { useState } from 'react';
import './LegalCompliance.css';

const LegalCompliance = () => {
    const [selectedDoc, setSelectedDoc] = useState('terms');

    const documents = {
        terms: {
            title: 'Terms & Conditions',
            lastUpdated: '2026-01-15',
            version: '2.1',
            content: 'By accessing N Company CRM services, you accept these terms. We provide SaaS solutions for CRM and business operations. Users must maintain account confidentiality and ensure data accuracy. All data is encrypted and payments are non-refundable.'
        },
        privacy: {
            title: 'Privacy Policy',
            lastUpdated: '2026-01-10',
            version: '3.0',
            content: 'We collect name, email, business information, and usage data. This information is used to provide and improve our services, process transactions, and send support messages. We implement security measures to protect your data.'
        },
        sla: {
            title: 'Service Level Agreement',
            lastUpdated: '2026-01-08',
            version: '1.5',
            content: 'N Company CRM guarantees 99.9% uptime. Response times: Critical within 1hr, High within 4hrs, Medium within 24hrs, Low within 48hrs. Service credits available if uptime targets are not met.'
        }
    };

    return (
        <div className="legal-page">
            <div className="legal-header">
                <h2>Legal & Compliance</h2>
                <p className="subtitle">Company policies and legal documents</p>
            </div>

            <div className="legal-container">
                <div className="legal-sidebar">
                    <h3 className="sidebar-title">Documents</h3>
                    <div className="doc-list">
                        {Object.keys(documents).map(key => (
                            <button
                                key={key}
                                className={`doc-item ${selectedDoc === key ? 'active' : ''}`}
                                onClick={() => setSelectedDoc(key)}
                            >
                                <span className="doc-icon">📄</span>
                                <div className="doc-info">
                                    <div className="doc-name">{documents[key].title}</div>
                                    <div className="doc-meta">v{documents[key].version}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="legal-content">
                    <div className="document-header">
                        <div>
                            <h1 className="document-title">{documents[selectedDoc].title}</h1>
                            <div className="document-meta">
                                <span>Last Updated: {documents[selectedDoc].lastUpdated}</span>
                                <span>•</span>
                                <span>Version: {documents[selectedDoc].version}</span>
                            </div>
                        </div>
                        <div className="document-actions">
                            <button className="doc-action-btn">📥 Download</button>
                            <button className="doc-action-btn">🖨️ Print</button>
                        </div>
                    </div>

                    <div className="document-body">
                        <p className="content-paragraph">{documents[selectedDoc].content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalCompliance;
