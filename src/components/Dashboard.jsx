import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Leaf, 
  Shield, 
  Package, 
  Settings, 
  Users, 
  Map,
  FileText,
  Bell,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

// Dashboard Components
import Overview from './dashboard/Overview';
import CollectionEvents from './dashboard/CollectionEvents';
import ProcessingSteps from './dashboard/ProcessingSteps';
import QualityTests from './dashboard/QualityTests';
import BatchManagement from './dashboard/BatchManagement';
import RulesAdmin from './dashboard/RulesAdmin';
import Reports from './dashboard/Reports';
import MapView from './dashboard/MapView';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    role: 'MANUFACTURER',
    organization: 'Vedic Wellness Pharmaceuticals'
  });
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: BarChart3, current: location.pathname === '/dashboard' },
    { name: 'Collection Events', href: '/dashboard/collection', icon: Leaf, current: location.pathname === '/dashboard/collection' },
    { name: 'Processing Steps', href: '/dashboard/processing', icon: Settings, current: location.pathname === '/dashboard/processing' },
    { name: 'Quality Tests', href: '/dashboard/quality', icon: Shield, current: location.pathname === '/dashboard/quality' },
    { name: 'Batch Management', href: '/dashboard/batches', icon: Package, current: location.pathname === '/dashboard/batches' },
    { name: 'Map View', href: '/dashboard/map', icon: Map, current: location.pathname === '/dashboard/map' },
    { name: 'Rules Admin', href: '/dashboard/rules', icon: Users, current: location.pathname === '/dashboard/rules' },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText, current: location.pathname === '/dashboard/reports' },
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Leaf className="logo-icon" />
            <span>NeoCrypt</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-item ${item.current ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
          <button className="logout-btn">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/collection" element={<CollectionEvents />} />
          <Route path="/processing" element={<ProcessingSteps />} />
          <Route path="/quality" element={<QualityTests />} />
          <Route path="/batches" element={<BatchManagement />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/rules" element={<RulesAdmin />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style jsx>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--bg-primary);
        }

        .sidebar {
          width: 280px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 1000;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .logo-icon {
          color: var(--primary-emerald);
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .sidebar-toggle:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .nav-item:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: linear-gradient(135deg, var(--primary-emerald), var(--primary-teal));
          color: white;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-emerald);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
        }

        .user-role {
          font-size: 12px;
          color: var(--text-muted);
        }

        .logout-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: var(--glass-bg);
          color: var(--text-primary);
        }

        .main-content {
          flex: 1;
          margin-left: 0;
          transition: margin-left 0.3s ease;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        @media (min-width: 1024px) {
          .sidebar {
            position: static;
            transform: translateX(0);
          }

          .sidebar-toggle {
            display: none;
          }

          .main-content {
            margin-left: 0;
          }

          .mobile-overlay {
            display: none;
          }
        }

        @media (max-width: 1023px) {
          .main-content {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;