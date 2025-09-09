import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Shield, 
  Smartphone, 
  BarChart3, 
  QrCode, 
  MessageSquare,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Globe,
  Users,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const apps = [
    {
      id: 'collector',
      title: 'Collector PWA',
      description: 'Offline-first mobile app for farmers and collectors',
      icon: Smartphone,
      features: ['GPS Tracking', 'Offline Sync', 'Photo Capture', 'Quality Logging'],
      route: '/collector',
      gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
      color: '#10b981'
    },
    {
      id: 'dashboard',
      title: 'Stakeholder Dashboard',
      description: 'Comprehensive management console for processors and labs',
      icon: BarChart3,
      features: ['Batch Management', 'Quality Tests', 'Analytics', 'Reports'],
      route: '/dashboard',
      gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: '#3b82f6'
    },
    {
      id: 'consumer',
      title: 'Consumer Portal',
      description: 'Public QR code scanning and traceability information',
      icon: QrCode,
      features: ['QR Scanning', 'Provenance Timeline', 'Certificates', 'Recall Notices'],
      route: '/consumer',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      color: '#f59e0b'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Explorer',
      description: 'View smart contract interactions and transaction history',
      icon: Shield,
      features: ['Contract Events', 'Transaction History', 'Role Management', 'Validation Rules'],
      route: '/blockchain',
      gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
      color: '#14b8a6'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable traceability with smart contract validation and role-based access control'
    },
    {
      icon: Leaf,
      title: 'Botanical Focus',
      description: 'Specialized for Ayurvedic herbs with geofencing, seasonal controls, and quality gates'
    },
    {
      icon: MessageSquare,
      title: 'SMS Integration',
      description: 'Works in low-connectivity environments via SMS with CBOR/COSE verification'
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description: 'FHIR-compliant resources with OpenAPI specification and typed client libraries'
    },
    {
      icon: Users,
      title: 'Multi-Stakeholder',
      description: 'Supports farmers, processors, labs, manufacturers, and regulators with RBAC'
    },
    {
      icon: Zap,
      title: 'Real-time Analytics',
      description: 'Live dashboards with metrics, alerts, and comprehensive reporting capabilities'
    }
  ];

  const demoFlow = [
    { step: '1', title: 'Collect', desc: 'Farmer collects herbs with GPS tracking', icon: Leaf, color: '#10b981' },
    { step: '2', title: 'Process', desc: 'Processing steps are recorded', icon: BarChart3, color: '#3b82f6' },
    { step: '3', title: 'Test', desc: 'Quality tests by certified labs', icon: Shield, color: '#8b5cf6' },
    { step: '4', title: 'Batch', desc: 'Create and mint final batch', icon: QrCode, color: '#f59e0b' },
    { step: '5', title: 'Trace', desc: 'Consumer scans QR code', icon: Smartphone, color: '#ef4444' }
  ];

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>
      </div>

      <div className="container">
        {/* Header */}
        <header className="header animate-fade-in">
          <div className="logo-section">
            <Leaf className="logo-icon" />
            <h1>NeoCrypt</h1>
          </div>
          <p className="tagline">
            Advanced botanical traceability platform for Ayurvedic herbs using blockchain technology
          </p>
          <div className="badges">
            <div className="badge">
              <CheckCircle size={16} />
              Production Ready
            </div>
            <div className="badge">
              <CheckCircle size={16} />
              Solidity Smart Contracts
            </div>
            <div className="badge">
              <CheckCircle size={16} />
              FHIR Compliant
            </div>
          </div>
        </header>

        {/* Key Features */}
        <section className="features-section">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card glass-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="feature-icon" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Applications Grid */}
        <section className="apps-section">
          <h2 className="section-title">Platform Applications</h2>
          <div className="apps-grid">
            {apps.map((app, index) => (
              <div 
                key={app.id} 
                className={`app-card glass-card ${selectedApp === app.id ? 'expanded' : ''}`}
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
              >
                <div className="app-header">
                  <div className="app-icon" style={{ background: app.gradient }}>
                    <app.icon size={32} />
                  </div>
                  <div className="app-info">
                    <h3>{app.title}</h3>
                    <p>{app.description}</p>
                  </div>
                  <ChevronRight 
                    className={`expand-icon ${selectedApp === app.id ? 'rotated' : ''}`}
                  />
                </div>
                
                <div className={`app-details ${selectedApp === app.id ? 'visible' : ''}`}>
                  <div className="features-list">
                    <h4>Key Features:</h4>
                    <div className="features-grid-small">
                      {app.features.map((feature, idx) => (
                        <div key={idx} className="feature-item">
                          <CheckCircle size={14} style={{ color: app.color }} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link to={app.route} className="glass-button primary">
                    Enter Application
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Flow */}
        <section className="demo-section">
          <div className="glass-card">
            <h2 className="section-title">End-to-End Demo Flow</h2>
            <div className="demo-flow">
              {demoFlow.map((item, index) => (
                <div key={index} className="demo-step">
                  <div className="step-icon" style={{ backgroundColor: item.color }}>
                    <item.icon size={24} />
                  </div>
                  <div className="step-content">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  {index < demoFlow.length - 1 && (
                    <div className="step-connector"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Smart Contract Info */}
        <section className="contract-section">
          <div className="glass-card">
            <h2 className="section-title">Smart Contract Layer</h2>
            <div className="contract-info">
              <div className="contract-details">
                <h3>NeoCryptTraceability.sol</h3>
                <p>
                  Comprehensive Solidity smart contract implementing role-based access control, 
                  geofencing validation, seasonal controls, and quality gate enforcement for 
                  botanical traceability.
                </p>
                <div className="contract-features">
                  <div className="contract-feature">
                    <Shield size={20} />
                    <span>Role-based Access Control (RBAC)</span>
                  </div>
                  <div className="contract-feature">
                    <Globe size={20} />
                    <span>Geofencing & Seasonal Validation</span>
                  </div>
                  <div className="contract-feature">
                    <CheckCircle size={20} />
                    <span>Quality Gate Enforcement</span>
                  </div>
                  <div className="contract-feature">
                    <BarChart3 size={20} />
                    <span>Quota Management System</span>
                  </div>
                </div>
              </div>
              <div className="contract-actions">
                <button className="glass-button secondary">
                  View Contract Code
                  <ArrowRight size={16} />
                </button>
                <button className="glass-button">
                  Deploy to Testnet
                  <Zap size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>Built with React, Solidity, Ethers.js, and Glass Morphism Design</p>
            <p className="footer-subtitle">Ready for production deployment and enterprise integration</p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .background-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          top: -150px;
          right: -150px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          bottom: -100px;
          left: -100px;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 4s;
        }

        .orb-4 {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #14b8a6, #06b6d4);
          top: 20%;
          left: 10%;
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 80px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          color: var(--primary-emerald);
        }

        .tagline {
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto 32px;
          color: var(--text-secondary);
        }

        .badges {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          font-size: 14px;
          color: var(--primary-emerald);
        }

        .section-title {
          text-align: center;
          margin-bottom: 48px;
          font-size: 2.5rem;
        }

        .features-section {
          margin-bottom: 80px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .feature-card {
          text-align: center;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          color: var(--primary-emerald);
          margin: 0 auto 16px;
        }

        .apps-section {
          margin-bottom: 80px;
        }

        .apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .app-card {
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .app-card:hover {
          transform: translateY(-4px);
        }

        .app-card.expanded {
          transform: scale(1.02);
        }

        .app-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .app-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .app-info {
          flex: 1;
        }

        .app-info h3 {
          margin-bottom: 8px;
          font-size: 1.25rem;
        }

        .app-info p {
          margin: 0;
          font-size: 14px;
          color: var(--text-muted);
        }

        .expand-icon {
          transition: transform 0.3s ease;
          color: var(--text-muted);
        }

        .expand-icon.rotated {
          transform: rotate(90deg);
        }

        .app-details {
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
          opacity: 0;
        }

        .app-details.visible {
          max-height: 300px;
          opacity: 1;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--glass-border);
        }

        .features-list h4 {
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .features-grid-small {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .demo-section {
          margin-bottom: 80px;
        }

        .demo-flow {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .demo-step {
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
        }

        .step-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .step-content h4 {
          margin-bottom: 8px;
          font-size: 1.25rem;
        }

        .step-content p {
          margin: 0;
          color: var(--text-secondary);
        }

        .step-connector {
          position: absolute;
          left: 31px;
          top: 64px;
          width: 2px;
          height: 24px;
          background: linear-gradient(to bottom, var(--primary-emerald), transparent);
        }

        .contract-section {
          margin-bottom: 80px;
        }

        .contract-info {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
          align-items: center;
        }

        .contract-details h3 {
          color: var(--primary-emerald);
          margin-bottom: 16px;
        }

        .contract-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }

        .contract-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
        }

        .contract-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer {
          text-align: center;
          padding: 40px 0;
          border-top: 1px solid var(--glass-border);
        }

        .footer-content p {
          margin-bottom: 8px;
        }

        .footer-subtitle {
          font-size: 14px;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .container {
            padding: 20px 16px;
          }

          .section-title {
            font-size: 2rem;
          }

          .features-grid,
          .apps-grid {
            grid-template-columns: 1fr;
          }

          .contract-info {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .demo-step {
            flex-direction: column;
            text-align: center;
          }

          .step-connector {
            display: none;
          }

          .badges {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;