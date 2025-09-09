import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  QrCode, 
  Shield, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Leaf,
  Factory,
  FlaskConical,
  Package,
  ExternalLink,
  Download,
  Share2,
  Eye,
  Clock,
  Thermometer,
  Droplets
} from 'lucide-react';

const ConsumerPortal = () => {
  const { slug } = useParams();
  const [provenanceData, setProvenanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchProvenanceData(slug);
    } else {
      setLoading(false);
    }
  }, [slug]);

  const fetchProvenanceData = async (batchSlug) => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock provenance data
      const mockData = {
        bundleId: 'bundle_' + batchSlug,
        batchId: 'batch_001',
        summary: {
          species: 'Ashwagandha (Withania somnifera)',
          manufacturer: 'Vedic Wellness Pharmaceuticals',
          status: 'RELEASED',
          lot: 'ASW-2024-001'
        },
        map: {
          region: 'Jodhpur, Rajasthan, India',
          centroidGeohash: 'tsj2d'
        },
        timeline: [
          {
            t: '2024-01-15T08:30:00Z',
            type: 'Collection',
            detail: 'Ashwagandha roots collected from certified organic farm',
            region: 'Jodhpur, Rajasthan',
            operator: 'Ramesh Sharma (Farmer)',
            weight: '50kg',
            quality: { moisture: '11.5%', foreignMatter: '1.8%' }
          },
          {
            t: '2024-01-16T09:00:00Z',
            type: 'Processing',
            detail: 'Drying process at controlled temperature',
            facility: 'Rajasthan Herbal Processing Ltd',
            conditions: { temperature: '45°C', humidity: '15%', duration: '56 hours' },
            outputWeight: '12.5kg'
          },
          {
            t: '2024-01-20T14:30:00Z',
            type: 'Quality Test',
            detail: 'Moisture content analysis - PASSED',
            lab: 'Central Ayurveda Research Laboratory',
            testType: 'Moisture Content',
            result: '8.2%',
            standard: 'IS-4831:2013',
            status: 'PASSED'
          },
          {
            t: '2024-01-22T10:15:00Z',
            type: 'Quality Test',
            detail: 'Pesticide residue analysis - PASSED',
            lab: 'Central Ayurveda Research Laboratory',
            testType: 'Pesticide Residue',
            result: 'Below detection limit',
            standard: 'WHO Guidelines',
            status: 'PASSED'
          },
          {
            t: '2024-01-25T16:00:00Z',
            type: 'Batch Creation',
            detail: 'Final batch created and quality gates validated',
            manufacturer: 'Vedic Wellness Pharmaceuticals',
            batchSize: '12.5kg',
            qaGates: ['Moisture', 'Pesticide', 'Heavy Metals']
          },
          {
            t: '2024-01-26T11:30:00Z',
            type: 'Minting',
            detail: 'QR code generated and batch released for distribution',
            qrSerial: 'QR001ASW2024',
            publicSlug: batchSlug
          }
        ],
        compliance: {
          nmPbRules: '1.0',
          fairTrade: true,
          organic: true,
          certificates: [
            {
              name: 'Organic Certification',
              issuer: 'India Organic Certification Agency',
              sha256: 'abc123def456789...',
              url: '/certificates/organic-cert.pdf',
              validUntil: '2025-01-15'
            },
            {
              name: 'Quality Test Report',
              issuer: 'Central Ayurveda Research Laboratory',
              sha256: 'def456ghi789012...',
              url: '/certificates/quality-report.pdf',
              validUntil: '2024-07-15'
            }
          ]
        },
        recall: null // No active recall
      };

      setProvenanceData(mockData);
    } catch (err) {
      setError('Failed to load provenance data');
      console.error('Error fetching provenance:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'RELEASED': { icon: CheckCircle, color: 'success', text: 'Released' },
      'FLAGGED': { icon: AlertTriangle, color: 'warning', text: 'Under Review' },
      'RECALLED': { icon: XCircle, color: 'error', text: 'Recalled' }
    };

    const config = statusConfig[status] || statusConfig['RELEASED'];
    const Icon = config.icon;

    return (
      <div className={`status-badge ${config.color}`}>
        <Icon size={16} />
        {config.text}
      </div>
    );
  };

  const getTimelineIcon = (type) => {
    const icons = {
      'Collection': Leaf,
      'Processing': Factory,
      'Quality Test': FlaskConical,
      'Batch Creation': Package,
      'Minting': QrCode
    };
    return icons[type] || Clock;
  };

  if (!slug) {
    return <QRScanner onScan={fetchProvenanceData} />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading Provenance Data...</h2>
        <p>Fetching traceability information</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <XCircle size={64} />
        <h2>Product Not Found</h2>
        <p>The QR code you scanned doesn't match any product in our system.</p>
        <button className="glass-button primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="consumer-portal">
      {/* Header */}
      <div className="portal-header">
        <div className="header-content">
          <div className="product-info">
            <h1>{provenanceData.summary.species}</h1>
            <p className="lot-code">Lot: {provenanceData.summary.lot}</p>
            <p className="manufacturer">by {provenanceData.summary.manufacturer}</p>
          </div>
          {getStatusBadge(provenanceData.summary.status)}
        </div>
      </div>

      {/* Recall Banner */}
      {provenanceData.recall && (
        <div className="recall-banner">
          <AlertTriangle size={24} />
          <div className="recall-content">
            <h3>Product Recall Notice</h3>
            <p>{provenanceData.recall.reason}</p>
            <p className="recall-date">
              Issued: {new Date(provenanceData.recall.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <MapPin size={20} />
          <div>
            <div className="stat-label">Origin</div>
            <div className="stat-value">{provenanceData.map.region}</div>
          </div>
        </div>
        <div className="stat-item">
          <Calendar size={20} />
          <div>
            <div className="stat-label">Harvested</div>
            <div className="stat-value">
              {new Date(provenanceData.timeline[0].t).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="stat-item">
          <Shield size={20} />
          <div>
            <div className="stat-label">Tests Passed</div>
            <div className="stat-value">
              {provenanceData.timeline.filter(t => t.type === 'Quality Test' && t.status === 'PASSED').length}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline-section glass-card">
        <h2>Traceability Timeline</h2>
        <div className="timeline">
          {provenanceData.timeline.map((event, index) => {
            const Icon = getTimelineIcon(event.type);
            return (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <Icon size={20} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h4>{event.type}</h4>
                    <span className="timeline-date">
                      {new Date(event.t).toLocaleDateString()} at{' '}
                      {new Date(event.t).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="timeline-detail">{event.detail}</p>
                  
                  {/* Event-specific details */}
                  {event.type === 'Collection' && (
                    <div className="event-details">
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Operator:</span>
                          <span>{event.operator}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Weight:</span>
                          <span>{event.weight}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Moisture:</span>
                          <span>{event.quality.moisture}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Foreign Matter:</span>
                          <span>{event.quality.foreignMatter}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {event.type === 'Processing' && (
                    <div className="event-details">
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Facility:</span>
                          <span>{event.facility}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Temperature:</span>
                          <span>{event.conditions.temperature}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Humidity:</span>
                          <span>{event.conditions.humidity}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Duration:</span>
                          <span>{event.conditions.duration}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Output Weight:</span>
                          <span>{event.outputWeight}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {event.type === 'Quality Test' && (
                    <div className="event-details">
                      <div className="test-result">
                        <div className={`test-status ${event.status.toLowerCase()}`}>
                          {event.status === 'PASSED' ? (
                            <CheckCircle size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {event.status}
                        </div>
                        <div className="test-info">
                          <div className="detail-item">
                            <span className="detail-label">Lab:</span>
                            <span>{event.lab}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Test Type:</span>
                            <span>{event.testType}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Result:</span>
                            <span>{event.result}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Standard:</span>
                            <span>{event.standard}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {event.region && (
                    <div className="event-location">
                      <MapPin size={14} />
                      {event.region}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificates */}
      <div className="certificates-section glass-card">
        <h2>Certificates & Compliance</h2>
        
        <div className="compliance-badges">
          {provenanceData.compliance.organic && (
            <div className="compliance-badge organic">
              <Leaf size={16} />
              Certified Organic
            </div>
          )}
          {provenanceData.compliance.fairTrade && (
            <div className="compliance-badge fair-trade">
              <Shield size={16} />
              Fair Trade
            </div>
          )}
          <div className="compliance-badge rules">
            <CheckCircle size={16} />
            NMFB Rules v{provenanceData.compliance.nmPbRules}
          </div>
        </div>

        <div className="certificates-list">
          {provenanceData.compliance.certificates.map((cert, index) => (
            <div key={index} className="certificate-item">
              <div className="certificate-info">
                <h4>{cert.name}</h4>
                <p className="certificate-issuer">Issued by {cert.issuer}</p>
                <p className="certificate-validity">
                  Valid until {new Date(cert.validUntil).toLocaleDateString()}
                </p>
              </div>
              <div className="certificate-actions">
                <div className="verification-status">
                  <CheckCircle size={16} />
                  Verified
                </div>
                <button className="glass-button small">
                  <ExternalLink size={14} />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="actions-section">
        <button className="glass-button">
          <Share2 size={16} />
          Share Product Info
        </button>
        <button className="glass-button">
          <Download size={16} />
          Download Report
        </button>
        <button className="glass-button primary">
          <Eye size={16} />
          View on Map
        </button>
      </div>

      <style jsx>{`
        .consumer-portal {
          min-height: 100vh;
          background: var(--bg-primary);
          padding-bottom: 40px;
        }

        .portal-header {
          background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
          padding: 32px 20px;
          text-align: center;
          border-bottom: 1px solid var(--glass-border);
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .product-info h1 {
          font-size: 2rem;
          margin-bottom: 8px;
          text-align: left;
        }

        .lot-code {
          font-family: monospace;
          color: var(--text-secondary);
          margin: 0 0 4px 0;
          text-align: left;
        }

        .manufacturer {
          color: var(--text-muted);
          margin: 0;
          text-align: left;
        }

        .recall-banner {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 20px;
          margin: 20px;
          border-radius: 12px;
          display: flex;
          gap: 16px;
          color: #ef4444;
        }

        .recall-content h3 {
          margin: 0 0 8px 0;
          color: #ef4444;
        }

        .recall-content p {
          margin: 0 0 4px 0;
        }

        .recall-date {
          font-size: 14px;
          opacity: 0.8;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          backdrop-filter: var(--glass-backdrop);
        }

        .stat-item svg {
          color: var(--primary-emerald);
          flex-shrink: 0;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .timeline-section {
          margin: 20px;
          padding: 24px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .timeline-section h2 {
          margin-bottom: 24px;
          text-align: center;
        }

        .timeline {
          position: relative;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--primary-emerald), var(--primary-teal));
        }

        .timeline-item {
          position: relative;
          padding-left: 60px;
          margin-bottom: 32px;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-marker {
          position: absolute;
          left: 0;
          top: 0;
          width: 40px;
          height: 40px;
          background: var(--primary-emerald);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 3px solid var(--bg-primary);
        }

        .timeline-content {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 20px;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .timeline-header h4 {
          margin: 0;
          color: var(--text-primary);
        }

        .timeline-date {
          font-size: 14px;
          color: var(--text-muted);
        }

        .timeline-detail {
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .event-details {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--glass-border);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .test-result {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .test-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }

        .test-status.passed {
          background: rgba(16, 185, 129, 0.2);
          color: var(--primary-emerald);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .test-status.failed {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .test-info {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .event-location {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .certificates-section {
          margin: 20px;
          padding: 24px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .certificates-section h2 {
          margin-bottom: 24px;
          text-align: center;
        }

        .compliance-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
          justify-content: center;
        }

        .compliance-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .compliance-badge.organic {
          background: rgba(16, 185, 129, 0.2);
          color: var(--primary-emerald);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .compliance-badge.fair-trade {
          background: rgba(59, 130, 246, 0.2);
          color: var(--secondary-blue);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .compliance-badge.rules {
          background: rgba(139, 92, 246, 0.2);
          color: var(--accent-purple);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .certificates-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .certificate-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          gap: 16px;
        }

        .certificate-info h4 {
          margin: 0 0 4px 0;
          color: var(--text-primary);
        }

        .certificate-issuer {
          margin: 0 0 4px 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .certificate-validity {
          margin: 0;
          color: var(--text-muted);
          font-size: 12px;
        }

        .certificate-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .verification-status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--primary-emerald);
          font-size: 14px;
          font-weight: 600;
        }

        .glass-button.small {
          padding: 8px 16px;
          font-size: 14px;
        }

        .actions-section {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding: 20px;
          flex-wrap: wrap;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px 20px;
          text-align: center;
        }

        .loading-container svg,
        .error-container svg {
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .loading-container h2,
        .error-container h2 {
          margin-bottom: 16px;
        }

        .loading-container p,
        .error-container p {
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .product-info h1,
          .lot-code,
          .manufacturer {
            text-align: center;
          }

          .quick-stats {
            grid-template-columns: 1fr;
          }

          .timeline::before {
            left: 15px;
          }

          .timeline-item {
            padding-left: 50px;
          }

          .timeline-marker {
            width: 30px;
            height: 30px;
            left: 0;
          }

          .timeline-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .detail-grid,
          .test-info {
            grid-template-columns: 1fr;
          }

          .test-result {
            flex-direction: column;
            align-items: flex-start;
          }

          .certificate-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .certificate-actions {
            align-self: stretch;
            justify-content: space-between;
          }

          .actions-section {
            flex-direction: column;
            align-items: stretch;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

// QR Scanner Component
const QRScanner = ({ onScan }) => {
  const [manualSlug, setManualSlug] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualSlug.trim()) {
      onScan(manualSlug.trim());
    }
  };

  return (
    <div className="qr-scanner">
      <div className="scanner-container">
        <div className="scanner-header">
          <QrCode size={64} />
          <h1>Product Traceability</h1>
          <p>Scan QR code or enter product code to view traceability information</p>
        </div>

        <div className="scanner-section glass-card">
          <h3>Scan QR Code</h3>
          <div className="qr-placeholder">
            <QrCode size={120} />
            <p>Point your camera at the QR code</p>
            <button className="glass-button primary">
              Open Camera Scanner
            </button>
          </div>
        </div>

        <div className="manual-section glass-card">
          <h3>Enter Product Code Manually</h3>
          <form onSubmit={handleManualSubmit}>
            <div className="form-group">
              <input
                type="text"
                value={manualSlug}
                onChange={(e) => setManualSlug(e.target.value)}
                className="form-input"
                placeholder="Enter product code (e.g., ashwagandha-premium-001)"
              />
            </div>
            <button type="submit" className="glass-button primary">
              View Product Info
            </button>
          </form>
        </div>

        <div className="demo-section glass-card">
          <h3>Try Demo Product</h3>
          <p>Experience the traceability system with our sample product</p>
          <button 
            className="glass-button secondary"
            onClick={() => onScan('ashwagandha-premium-001')}
          >
            View Demo: Ashwagandha Premium
          </button>
        </div>
      </div>

      <style jsx>{`
        .qr-scanner {
          min-height: 100vh;
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .scanner-container {
          max-width: 500px;
          width: 100%;
        }

        .scanner-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .scanner-header svg {
          color: var(--primary-emerald);
          margin-bottom: 16px;
        }

        .scanner-header h1 {
          margin-bottom: 8px;
        }

        .scanner-header p {
          color: var(--text-secondary);
          margin: 0;
        }

        .scanner-section,
        .manual-section,
        .demo-section {
          margin-bottom: 24px;
          padding: 24px;
          text-align: center;
        }

        .scanner-section h3,
        .manual-section h3,
        .demo-section h3 {
          margin-bottom: 20px;
        }

        .qr-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 32px;
          border: 2px dashed var(--glass-border);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .qr-placeholder svg {
          color: var(--text-muted);
        }

        .qr-placeholder p {
          color: var(--text-secondary);
          margin: 0;
        }

        .manual-section form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .demo-section p {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default ConsumerPortal;