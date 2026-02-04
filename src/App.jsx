import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Pages
import InvoiceGenerator from './pages/InvoiceGenerator';
import InvoiceList from './pages/InvoiceList';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import SalesDashboard from './pages/SalesDashboard';
import OperationsDashboard from './pages/OperationsDashboard';
import FinancialDashboard from './pages/FinancialDashboard';
import SupportDashboard from './pages/SupportDashboard';
import ClientManagement from './pages/ClientManagement';
import LegalCompliance from './pages/LegalCompliance';
import ActivityLog from './pages/ActivityLog';

import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Sidebar />
                <div className="main-content">
                    <TopBar />
                    <div className="page-container">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard/executive" replace />} />
                            <Route path="/invoice" element={<InvoiceGenerator />} />
                            <Route path="/invoices" element={<InvoiceList />} />
                            <Route path="/dashboard/executive" element={<ExecutiveDashboard />} />
                            <Route path="/dashboard/sales" element={<SalesDashboard />} />
                            <Route path="/dashboard/operations" element={<OperationsDashboard />} />
                            <Route path="/dashboard/financial" element={<FinancialDashboard />} />
                            <Route path="/dashboard/support" element={<SupportDashboard />} />
                            <Route path="/clients" element={<ClientManagement />} />
                            <Route path="/legal" element={<LegalCompliance />} />
                            <Route path="/activity" element={<ActivityLog />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
