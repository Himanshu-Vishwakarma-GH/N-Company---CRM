import { useState, useEffect } from 'react';
import './SettingsMenu.css';
import Button from './Button';

const SettingsMenu = ({ onClose, user = { name: 'Admin User', email: 'admin@company.com' } }) => {
    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <h3>Settings</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="settings-content">
                    <div className="settings-section">
                        <h4>Profile</h4>
                        <div className="profile-card">
                            <div className="profile-avatar">
                                {user.name.charAt(0)}
                            </div>
                            <div className="profile-info">
                                <p className="profile-name">{user.name}</p>
                                <p className="profile-role">Administrator</p>
                                <p className="profile-email">{user.email}</p>
                            </div>
                            <Button variant="secondary" size="sm">Edit</Button>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h4>Application</h4>
                        <div className="setting-item">
                            <div className="setting-label">
                                <span>Theme</span>
                                <span className="setting-desc">Toggle dark/light mode</span>
                            </div>
                            <select className="setting-select" disabled>
                                <option>Dark (Default)</option>
                                <option>Light</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <div className="setting-label">
                                <span>Timezone</span>
                            </div>
                            <select className="setting-select" defaultValue="Asia/Kolkata">
                                <option value="UTC">UTC</option>
                                <option value="Asia/Kolkata">IST (Kolkata)</option>
                                <option value="America/New_York">EST (New York)</option>
                            </select>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h4>System Status</h4>
                        <div className="status-item">
                            <span className="status-label">Backend API</span>
                            <span className="status-badge success">Online</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Google Sheets</span>
                            <span className="status-badge success">Connected</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Version</span>
                            <span className="status-text">v1.2.0</span>
                        </div>
                    </div>
                </div>

                <div className="settings-footer">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button variant="primary" onClick={onClose}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsMenu;
