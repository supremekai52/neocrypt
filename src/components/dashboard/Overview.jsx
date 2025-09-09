import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Users, 
  Leaf,
  Shield,
  Clock,
  MapPin,
  CheckCircle
} from 'lucide-react';

const Overview = () => {
  const [metrics, setMetrics] = useState({
    eventsToday: 24,
    batchesMinted: 156,
    recalls: 2,
    totalWeight: 2847.5,
    activeUsers: 89,
    pendingTests: 12
  });

  const [recentEvents, setRecentEvents] = useState([
    {
      id: 1,
      type: 'Collection',
      timestamp: '2024-01-15T10:30:00Z',
      details: 'Ashwagandha Root - 50kg collected',
      status: 'completed',
      location: 'Jodhpur, Rajasthan'
    },
    {
      id: 2,
      type: 'Processing',
      timestamp: '2024-01-15T09:15:00Z',
      details: 'Drying process completed - 12.5kg output',
      status: 'completed',
      location: 'Processing Facility A'
    },
    {
      id: 3,
      type: 'Quality Test',
      timestamp: '2024-01-15T08:45:00Z',
      details: 'Moisture content test - PASSED',
      status: 'passed',
      location: 'Central Lab'
    },
    {
      id: 4,
      type: 'Batch',
      timestamp: '2024-01-15T08:00:00Z',
      details: 'Batch ASW-2024-001 minted successfully',
      status: 'minted',
      location: 'Manufacturing Unit'
    }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Seasonal quota for Ashwagandha approaching limit (85% used)',
      timestamp: '2024-01-15T11:00:00Z'
    },
    {
      id: 2,
      type: 'info',
      message: 'New quality test results available for review',
      timestamp: '2024-01-15T10:45:00Z'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'passed':
      case 'minted':
        return <CheckCircle size={16} className="status-icon success" />;
      case 'pending':
        return <Clock size={16} className="status-icon warning" />;
      case 'failed':
        return <AlertTriangle size={16} className="status-icon error" />;
      default:
        return <Clock size={16} className="status-icon info" />;
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'Collection':
        return <Leaf size={20} />;
      case 'Processing':
        return <BarChart3 size={20} />;
      case 'Quality Test':
        return <Shield size={20} />;
      case 'Batch':
        return <Package size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  return (
    <div className="overview">
      <div className="overview-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Real-time insights into your botanical traceability operations</p>
        </div>
        <div className="header-actions">
          <button className="glass-button">
            <TrendingUp size={16} />
            View Analytics
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card glass-card">
          <div className="metric-header">
            <div className="metric-icon events">
              <Leaf size={24} />
            </div>
            <div className="metric-trend positive">
              <TrendingUp size={16} />
              +12%
            </div>
          </div>
          <div className="metric-value">{metrics.eventsToday}</div>
          <div className="metric-label">Events Today</div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-header">
            <div className="metric-icon batches">
              <Package size={24} />
            </div>
            <div className="metric-trend positive">
              <TrendingUp size={16} />
              +8%
            </div>
          </div>
          <div className="metric-value">{metrics.batchesMinted}</div>
          <div className="metric-label">Batches Minted</div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-header">
            <div className="metric-icon weight">
              <BarChart3 size={24} />
            </div>
            <div className="metric-trend positive">
              <TrendingUp size={16} />
              +15%
            </div>
          </div>
          <div className="metric-value">{metrics.totalWeight.toLocaleString()}kg</div>
          <div className="metric-label">Total Weight Processed</div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-header">
            <div className="metric-icon recalls">
              <AlertTriangle size={24} />
            </div>
            <div className="metric-trend negative">
              <TrendingUp size={16} />
              +1
            </div>
          </div>
          <div className="metric-value">{metrics.recalls}</div>
          <div className="metric-label">Active Recalls</div>
        </div>
      </div>

      <div className="content-grid">
        {/* Recent Events */}
        <div className="recent-events glass-card">
          <div className="card-header">
            <h3>Recent Events</h3>
            <button className="glass-button small">View All</button>
          </div>
          <div className="events-list">
            {recentEvents.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-icon">
                  {getEventIcon(event.type)}
                </div>
                <div className="event-content">
                  <div className="event-header">
                    <span className="event-type">{event.type}</span>
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="event-details">{event.details}</div>
                  <div className="event-meta">
                    <span className="event-time">
                      <Clock size={12} />
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="event-location">
                      <MapPin size={12} />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="alerts-panel glass-card">
          <div className="card-header">
            <h3>Alerts & Notifications</h3>
            <button className="glass-button small">Mark All Read</button>
          </div>
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert-item ${alert.type}`}>
                <div className="alert-icon">
                  {alert.type === 'warning' ? (
                    <AlertTriangle size={20} />
                  ) : (
                    <Shield size={20} />
                  )}
                </div>
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions glass-card">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-button">
            <Leaf size={24} />
            <span>New Collection Event</span>
          </button>
          <button className="action-button">
            <BarChart3 size={24} />
            <span>Add Processing Step</span>
          </button>
          <button className="action-button">
            <Shield size={24} />
            <span>Record Quality Test</span>
          </button>
          <button className="action-button">
            <Package size={24} />
            <span>Create Batch</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .overview {
          padding: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .overview-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .overview-header h1 {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .overview-header p {
          color: var(--text-secondary);
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 16px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .metric-card {
          padding: 24px;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .metric-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .metric-icon.events {
          background: linear-gradient(135deg, var(--primary-emerald), var(--primary-teal));
        }

        .metric-icon.batches {
          background: linear-gradient(135deg, var(--secondary-blue), var(--accent-purple));
        }

        .metric-icon.weight {
          background: linear-gradient(135deg, var(--accent-amber), #f97316);
        }

        .metric-icon.recalls {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .metric-trend.positive {
          color: var(--primary-emerald);
          background: rgba(16, 185, 129, 0.1);
        }

        .metric-trend.negative {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .metric-label {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--glass-border);
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .glass-button.small {
          padding: 8px 16px;
          font-size: 14px;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .event-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
        }

        .event-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--primary-emerald);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .event-content {
          flex: 1;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .event-type {
          font-weight: 600;
          color: var(--text-primary);
        }

        .status-icon.success {
          color: var(--primary-emerald);
        }

        .status-icon.warning {
          color: var(--accent-amber);
        }

        .status-icon.error {
          color: #ef4444;
        }

        .status-icon.info {
          color: var(--secondary-blue);
        }

        .event-details {
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .event-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .event-time,
        .event-location {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .alert-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          border-left: 4px solid;
        }

        .alert-item.warning {
          background: rgba(245, 158, 11, 0.1);
          border-left-color: var(--accent-amber);
        }

        .alert-item.info {
          background: rgba(59, 130, 246, 0.1);
          border-left-color: var(--secondary-blue);
        }

        .alert-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .alert-item.warning .alert-icon {
          color: var(--accent-amber);
        }

        .alert-item.info .alert-icon {
          color: var(--secondary-blue);
        }

        .alert-message {
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .alert-time {
          font-size: 12px;
          color: var(--text-muted);
        }

        .quick-actions {
          padding: 24px;
        }

        .quick-actions h3 {
          margin-bottom: 24px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .action-button span {
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .overview {
            padding: 16px;
          }

          .overview-header {
            flex-direction: column;
            gap: 16px;
          }

          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .actions-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;