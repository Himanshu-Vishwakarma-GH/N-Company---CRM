import { useState, useEffect, useRef } from 'react';
import Input from "./Input";
import SearchResults from "./SearchResults";
import SettingsMenu from "./SettingsMenu";
import NotificationsPanel from "./NotificationsPanel";
import { searchAPI, activityAPI } from '../services/api';
import { useLocation } from 'react-router-dom';
import './TopBar.css';

const TopBar = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const location = useLocation();
    const searchRef = useRef(null);
    const notifRef = useRef(null);

    // Initial data fetch
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await activityAPI.getUnreadCount();
            if (response.success) {
                setUnreadCount(response.count);
            }
        } catch (error) {
            console.error('Failed to get unread count:', error);
        }
    };

    // Debounce search
    useEffect(() => {
        if (!query || query.length < 2) {
            setSearchResults(null);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        const timeoutId = setTimeout(async () => {
            try {
                const response = await searchAPI.search(query);
                if (response.success) {
                    setSearchResults(response.results);
                    setShowResults(true);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        if (path.includes('/activity')) return 'Activity Logs';
        return 'Dashboard';
    };

    const getBreadcrumbs = () => {
        const path = location.pathname;
        const parts = path.split('/').filter(Boolean);

        if (parts.length === 0) return ['Dashboard'];
        if (parts[0] === 'dashboard') return ['Dashboards', parts[1]?.charAt(0).toUpperCase() + parts[1]?.slice(1)];
        return [parts[0].charAt(0).toUpperCase() + parts[0].slice(1)];
    };

    const handleCloseResults = () => {
        setShowResults(false);
        setQuery('');
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unreadCount > 0) {
            // Optimistically clear count when opening
            // Ideally we clear it after explicit "Mark all read" or individual reads
            // But usually opening the panel is enough to clear "new" status for UX
            // setUnreadCount(0); 
        }
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
                    <div className="search-box" ref={searchRef}>
                        <span className="search-icon">🔍</span>
                        <Input
                            placeholder="Search by Invoice ID or Client ID"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="search-input"
                        />
                        {showResults && (
                            <SearchResults
                                results={searchResults}
                                isLoading={isSearching}
                                query={query}
                                onClose={handleCloseResults}
                            />
                        )}
                    </div>

                    <div ref={notifRef} style={{ position: 'relative' }}>
                        <button
                            className={`icon-button ${showNotifications ? 'active' : ''}`}
                            onClick={toggleNotifications}
                        >
                            <span>🔔</span>
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                        </button>
                        <NotificationsPanel
                            isOpen={showNotifications}
                            onClose={() => setShowNotifications(false)}
                        />
                    </div>

                    <button
                        className="icon-button"
                        onClick={() => setShowSettings(true)}
                    >
                        <span>⚙️</span>
                    </button>

                    <div className="user-menu gradient-primary">
                        <span>OP</span>
                    </div>
                </div>
            </div>

            {showSettings && (
                <SettingsMenu onClose={() => setShowSettings(false)} />
            )}
        </header>
    );
};

export default TopBar;
