import Input from "./Input";
import { useSearch } from "../context/SearchContext";
import { useLocation } from 'react-router-dom';
import './TopBar.css';

const TopBar = () => {
    const { query, setQuery } = useSearch();
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/invoice')) return 'Invoice Generator';
        if (path.includes('/executive')) return 'Executive Dashboard';
        if (path.includes('/sales')) return 'Sales Dashboard';
        if (path.includes('/operations')) return 'Operations Dashboard';
        if (path.includes('/financial')) return 'Financial Dashboard';
        if (path.includes('/support')) return 'Customer Support Dashboard';
        if (path.includes('/clients')) return 'Client Management';
        if (path.includes('/legal')) return 'Legal & Compliance';
        return 'Dashboard';
    };

    const getBreadcrumbs = () => {
        const path = location.pathname;
        const parts = path.split('/').filter(Boolean);

        if (parts.length === 0) return ['Dashboard'];
        if (parts[0] === 'dashboard') return ['Dashboards', parts[1]?.charAt(0).toUpperCase() + parts[1]?.slice(1)];
        return [parts[0].charAt(0).toUpperCase() + parts[0].slice(1)];
    };

    return (
        <header className="topbar">
            <div className="topbar-content">
                <div className="topbar-left">
                    <h1 className="page-title">{getPageTitle()}</h1>
                    <div className="breadcrumbs">
                        {getBreadcrumbs().map((crumb, index) => (
                            <span key={index} className="breadcrumb">
                                {index > 0 && <span className="breadcrumb-separator">/</span>}
                                {crumb}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="topbar-right">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                     <Input
  placeholder="Search by Invoice ID or Client ID"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  className="search-input"/>


                    </div>

                    <button className="icon-button">
                        <span>🔔</span>
                        <span className="notification-badge">3</span>
                    </button>

                    <button className="icon-button">
                        <span>⚙️</span>
                    </button>

                    <div className="user-menu gradient-primary">
                        <span>OP</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
