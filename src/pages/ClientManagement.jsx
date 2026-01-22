import { useState } from 'react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { clients } from '../data/centralData';
import { getClientLifetimeValue, formatCurrency } from '../utils/dataCalculations';
import './ClientManagement.css';

const ClientManagement = () => {
    const [viewMode, setViewMode] = useState('pipeline');

    // Organize clients by stage with calculated lifetime values
    const clientsByStage = {
        leads: clients.filter(c => c.stage === 'leads').map(c => ({
            ...c,
            lifetimeValue: getClientLifetimeValue(c.id)
        })),
        followUps: clients.filter(c => c.stage === 'followUps').map(c => ({
            ...c,
            lifetimeValue: getClientLifetimeValue(c.id)
        })),
        converted: clients.filter(c => c.stage === 'converted').map(c => ({
            ...c,
            lifetimeValue: getClientLifetimeValue(c.id)
        })),
        completed: clients.filter(c => c.stage === 'completed').map(c => ({
            ...c,
            lifetimeValue: getClientLifetimeValue(c.id)
        })),
        repeat: clients.filter(c => c.stage === 'repeat').map(c => ({
            ...c,
            lifetimeValue: getClientLifetimeValue(c.id)
        }))
    };

    return (
        <div className="client-management">
            <div className="clients-header">
                <div>
                    <h2>Client Pipeline</h2>
                    <p className="subtitle">Manage your complete client lifecycle (Real Client Data)</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'pipeline' ? 'active' : ''}`}
                            onClick={() => setViewMode('pipeline')}
                        >
                            📊 Pipeline
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            📋 List
                        </button>
                    </div>
                    <Button variant="primary" icon="➕">Add New Client</Button>
                </div>
            </div>

            {viewMode === 'pipeline' && (
                <div className="pipeline-board">
                    <div className="pipeline-column">
                        <div className="column-header leads-header">
                            <h3>Leads</h3>
                            <Badge variant="warning" size="sm">{clientsByStage.leads.length}</Badge>
                        </div>
                        <div className="client-cards">
                            {clientsByStage.leads.map(client => (
                                <div key={client.id} className="client-card">
                                    <div className="client-id">{client.id}</div>
                                    <div className="client-name">{client.name}</div>
                                    <div className="client-value">{formatCurrency(client.lifetimeValue || 250000)}</div>
                                    <div className="client-contact">👤 {client.contact}</div>
                                    <div className="client-date">📅 {client.joinedDate}</div>
                                    <div className="card-actions">
                                        <button className="action-btn">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pipeline-column">
                        <div className="column-header followup-header">
                            <h3>Follow-ups</h3>
                            <Badge variant="info" size="sm">{clientsByStage.followUps.length}</Badge>
                        </div>
                        <div className="client-cards">
                            {clientsByStage.followUps.map(client => (
                                <div key={client.id} className="client-card">
                                    <div className="client-id">{client.id}</div>
                                    <div className="client-name">{client.name}</div>
                                    <div className="client-value">{formatCurrency(client.lifetimeValue || 420000)}</div>
                                    <div className="client-contact">👤 {client.contact}</div>
                                    <div className="client-date">📅 {client.joinedDate}</div>
                                    <div className="card-actions">
                                        <button className="action-btn">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pipeline-column">
                        <div className="column-header converted-header">
                            <h3>Converted</h3>
                            <Badge variant="primary" size="sm">{clientsByStage.converted.length}</Badge>
                        </div>
                        <div className="client-cards">
                            {clientsByStage.converted.map(client => (
                                <div key={client.id} className="client-card">
                                    <div className="client-id">{client.id}</div>
                                    <div className="client-name">{client.name}</div>
                                    <div className="client-value">{formatCurrency(client.lifetimeValue)}</div>
                                    <div className="client-contact">👤 {client.contact}</div>
                                    <div className="client-date">📅 {client.joinedDate}</div>
                                    <div className="card-actions">
                                        <button className="action-btn">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pipeline-column">
                        <div className="column-header completed-header">
                            <h3>Completed</h3>
                            <Badge variant="success" size="sm">{clientsByStage.completed.length}</Badge>
                        </div>
                        <div className="client-cards">
                            {clientsByStage.completed.map(client => (
                                <div key={client.id} className="client-card">
                                    <div className="client-id">{client.id}</div>
                                    <div className="client-name">{client.name}</div>
                                    <div className="client-value">{formatCurrency(client.lifetimeValue)}</div>
                                    <div className="client-contact">👤 {client.contact}</div>
                                    <div className="client-date">📅 {client.joinedDate}</div>
                                    <div className="card-actions">
                                        <button className="action-btn">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pipeline-column">
                        <div className="column-header repeat-header">
                            <h3>Repeat Clients</h3>
                            <Badge variant="default" size="sm">{clientsByStage.repeat.length}</Badge>
                        </div>
                        <div className="client-cards">
                            {clientsByStage.repeat.map(client => (
                                <div key={client.id} className="client-card vip-card">
                                    <div className="vip-badge">⭐ VIP</div>
                                    <div className="client-id">{client.id}</div>
                                    <div className="client-name">{client.name}</div>
                                    <div className="client-value">{formatCurrency(client.lifetimeValue)}</div>
                                    <div className="client-contact">👤 {client.contact}</div>
                                    <div className="client-date">📅 {client.joinedDate}</div>
                                    <div className="card-actions">
                                        <button className="action-btn">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'list' && (
                <div className="list-view">
                    <div className="list-header">
                        <input type="text" placeholder="Search clients..." className="search-input-large" />
                    </div>
                    <div className="client-table">
                        <div className="table-header">
                            <div>ID</div>
                            <div>Client Name</div>
                            <div>Contact</div>
                            <div>Lifetime Value</div>
                            <div>Stage</div>
                            <div>Joined Date</div>
                            <div>Actions</div>
                        </div>
                        {Object.entries(clientsByStage).map(([stage, stageClients]) =>
                            stageClients.map(client => (
                                <div key={client.id} className="table-row">
                                    <div>{client.id}</div>
                                    <div className="client-name-cell">{client.name}</div>
                                    <div>{client.contact}</div>
                                    <div className="value-cell">{formatCurrency(client.lifetimeValue)}</div>
                                    <div>
                                        <Badge variant={
                                            stage === 'leads' ? 'warning' :
                                                stage === 'followUps' ? 'info' :
                                                    stage === 'converted' ? 'primary' :
                                                        stage === 'completed' ? 'success' : 'default'
                                        }>{stage}</Badge>
                                    </div>
                                    <div>{client.joinedDate}</div>
                                    <div className="actions-cell">
                                        <button className="action-btn-small">View</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManagement;
