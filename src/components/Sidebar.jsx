import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon gradient-vibrant"></div>
                    <span className="logo-text">N Company CRM</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <Link
                        to="/invoice"
                        className={`nav-item ${isActive('/invoice') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📄</span>
                        <span className="nav-text">Invoice Generator</span>
                    </Link>
                </div>

                <div className="nav-section">
                    <div className="nav-section-title">Dashboards</div>

                    <Link
                        to="/dashboard/executive"
                        className={`nav-item ${isActive('/dashboard/executive') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">👔</span>
                        <span className="nav-text">Executive</span>
                    </Link>

                    <Link
                        to="/dashboard/sales"
                        className={`nav-item ${isActive('/dashboard/sales') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📈</span>
                        <span className="nav-text">Sales</span>
                    </Link>

                    <Link
                        to="/dashboard/operations"
                        className={`nav-item ${isActive('/dashboard/operations') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">⚙️</span>
                        <span className="nav-text">Operations</span>
                    </Link>

                    <Link
                        to="/dashboard/financial"
                        className={`nav-item ${isActive('/dashboard/financial') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">💰</span>
                        <span className="nav-text">Financial</span>
                    </Link>

                    <Link
                        to="/dashboard/support"
                        className={`nav-item ${isActive('/dashboard/support') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">🎧</span>
                        <span className="nav-text">Support</span>
                    </Link>
                </div>

                <div className="nav-section">
                    <div className="nav-section-title">Management</div>

                    <Link
                        to="/clients"
                        className={`nav-item ${isActive('/clients') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">👥</span>
                        <span className="nav-text">Clients</span>
                    </Link>

                    <Link
                        to="/legal"
                        className={`nav-item ${isActive('/legal') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">⚖️</span>
                        <span className="nav-text">Legal & Compliance</span>
                    </Link>
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar gradient-primary">
                        <span>OP</span>
                    </div>
                    <div className="user-info">
                        <div className="user-name">Operations Manager</div>
                        <div className="user-role">Admin</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
