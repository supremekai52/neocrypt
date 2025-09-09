import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  MapPin, 
  Camera, 
  Upload, 
  Wifi, 
  WifiOff, 
  Battery, 
  Signal,
  Plus,
  List,
  User,
  Settings,
  Sync,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const CollectorPWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [location, setLocation] = useState(null);
  const [battery, setBattery] = useState(null);
  const [pendingSync, setPendingSync] = useState(3);
  const location_route = useLocation();

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => console.error('Location error:', error)
      );
    }

    // Battery API (if supported)
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBattery({
          level: Math.round(battery.level * 100),
          charging: battery.charging
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigation = [
    { name: 'New Collection', href: '/collector', icon: Plus },
    { name: 'My Collections', href: '/collector/list', icon: List },
    { name: 'Profile', href: '/collector/profile', icon: User },
    { name: 'Settings', href: '/collector/settings', icon: Settings },
  ];

  return (
    <div className="collector-pwa">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <div className="app-title">
            <Leaf size={20} />
            NeoCrypt Collector
          </div>
        </div>
        <div className="status-right">
          {pendingSync > 0 && (
            <div className="sync-indicator">
              <Clock size={16} />
              {pendingSync}
            </div>
          )}
          {battery && (
            <div className={`battery-indicator ${battery.level < 20 ? 'low' : ''}`}>
              <Battery size={16} />
              {battery.level}%
            </div>
          )}
          <div className={`connection-indicator ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          </div>
        </div>
      </div>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="offline-banner">
          <WifiOff size={16} />
          <span>Working offline - Data will sync when connected</span>
        </div>
      )}

      {/* Main Content */}
      <div className="pwa-content">
        <Routes>
          <Route path="/" element={<NewCollection location={location} />} />
          <Route path="/list" element={<CollectionList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`nav-item ${location_route.pathname === item.href ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .collector-pwa {
          min-height: 100vh;
          background: var(--bg-primary);
          display: flex;
          flex-direction: column;
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .app-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .status-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sync-indicator,
        .battery-indicator,
        .connection-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .battery-indicator.low {
          color: #ef4444;
        }

        .connection-indicator.online {
          color: var(--primary-emerald);
        }

        .connection-indicator.offline {
          color: #ef4444;
        }

        .offline-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(245, 158, 11, 0.1);
          border-bottom: 1px solid rgba(245, 158, 11, 0.3);
          color: var(--accent-amber);
          font-size: 14px;
        }

        .pwa-content {
          flex: 1;
          overflow-y: auto;
        }

        .bottom-nav {
          display: flex;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--glass-border);
          padding: 8px 0;
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .nav-item.active {
          color: var(--primary-emerald);
        }

        .nav-item:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

// New Collection Component
const NewCollection = ({ location }) => {
  const [formData, setFormData] = useState({
    speciesCode: 'ASHW',
    speciesName: 'Withania somnifera',
    part: 'ROOT',
    harvestMethod: 'CULTIVATED',
    weightKg: '',
    moisturePct: '',
    foreignMatterPct: '',
    notes: ''
  });
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoCapture = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          data: event.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const collectionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        lat: location?.lat || 0,
        lon: location?.lon || 0,
        gpsAccuracy: location?.accuracy || 0,
        geohash: 'tsj2d', // Mock geohash
        photos: photos.map(p => p.data),
        rulesVersion: '1.0',
        regionId: 'jodhpur_rajasthan'
      };

      // Store in IndexedDB for offline support
      if ('indexedDB' in window) {
        // Mock offline storage
        localStorage.setItem(`collection_${Date.now()}`, JSON.stringify(collectionData));
      }

      alert('Collection event saved! Will sync when online.');
      
      // Reset form
      setFormData({
        speciesCode: 'ASHW',
        speciesName: 'Withania somnifera',
        part: 'ROOT',
        harvestMethod: 'CULTIVATED',
        weightKg: '',
        moisturePct: '',
        foreignMatterPct: '',
        notes: ''
      });
      setPhotos([]);
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Error saving collection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-collection">
      <div className="page-header">
        <h2>New Collection Event</h2>
        <p>Record botanical collection with GPS tracking</p>
      </div>

      {/* Location Status */}
      <div className="location-status glass-card">
        <div className="location-header">
          <MapPin size={20} />
          <span>GPS Location</span>
        </div>
        {location ? (
          <div className="location-details">
            <div className="coordinates">
              Lat: {location.lat.toFixed(6)}, Lon: {location.lon.toFixed(6)}
            </div>
            <div className={`accuracy ${location.accuracy < 10 ? 'good' : location.accuracy < 50 ? 'fair' : 'poor'}`}>
              Accuracy: ±{location.accuracy.toFixed(1)}m
            </div>
          </div>
        ) : (
          <div className="location-loading">
            <Clock size={16} />
            Getting location...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="collection-form">
        {/* Species Selection */}
        <div className="form-section glass-card">
          <h3>Species Information</h3>
          <div className="form-group">
            <label className="form-label">Species</label>
            <select 
              name="speciesCode" 
              value={formData.speciesCode}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="ASHW">Ashwagandha (Withania somnifera)</option>
              <option value="TULSI">Tulsi (Ocimum sanctum)</option>
              <option value="NEEM">Neem (Azadirachta indica)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Plant Part</label>
            <select 
              name="part" 
              value={formData.part}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="ROOT">Root</option>
              <option value="LEAF">Leaf</option>
              <option value="SEED">Seed</option>
              <option value="BARK">Bark</option>
              <option value="FLOWER">Flower</option>
              <option value="WHOLE_PLANT">Whole Plant</option>
            </select>
          </div>
        </div>

        {/* Harvest Details */}
        <div className="form-section glass-card">
          <h3>Harvest Details</h3>
          <div className="form-group">
            <label className="form-label">Harvest Method</label>
            <select 
              name="harvestMethod" 
              value={formData.harvestMethod}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="CULTIVATED">Cultivated</option>
              <option value="WILD">Wild Collection</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              name="weightKg"
              value={formData.weightKg}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter weight in kg"
              step="0.1"
              min="0"
              required
            />
          </div>
        </div>

        {/* Quality Measurements */}
        <div className="form-section glass-card">
          <h3>Initial Quality Assessment</h3>
          <div className="form-group">
            <label className="form-label">Moisture Content (%)</label>
            <input
              type="number"
              name="moisturePct"
              value={formData.moisturePct}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter moisture percentage"
              step="0.1"
              min="0"
              max="100"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Foreign Matter (%) - Optional</label>
            <input
              type="number"
              name="foreignMatterPct"
              value={formData.foreignMatterPct}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter foreign matter percentage"
              step="0.1"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Photo Capture */}
        <div className="form-section glass-card">
          <h3>Photo Documentation</h3>
          <div className="photo-capture">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handlePhotoCapture}
              className="photo-input"
              id="photo-input"
            />
            <label htmlFor="photo-input" className="photo-button glass-button">
              <Camera size={20} />
              Capture Photos
            </label>
          </div>
          {photos.length > 0 && (
            <div className="photo-preview">
              {photos.map((photo) => (
                <div key={photo.id} className="photo-item">
                  <img src={photo.data} alt="Collection" />
                  <button 
                    type="button"
                    onClick={() => setPhotos(prev => prev.filter(p => p.id !== photo.id))}
                    className="remove-photo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="form-section glass-card">
          <h3>Additional Notes</h3>
          <div className="form-group">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Any additional observations or notes..."
              rows="4"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-button glass-button primary"
          disabled={isSubmitting || !location}
        >
          {isSubmitting ? (
            <>
              <Clock size={20} />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Save Collection Event
            </>
          )}
        </button>
      </form>

      <style jsx>{`
        .new-collection {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .page-header h2 {
          font-size: 1.75rem;
          margin-bottom: 8px;
        }

        .page-header p {
          color: var(--text-secondary);
          margin: 0;
        }

        .location-status {
          margin-bottom: 24px;
          padding: 16px;
        }

        .location-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .location-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .coordinates {
          font-family: monospace;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .accuracy {
          font-size: 12px;
          font-weight: 600;
        }

        .accuracy.good {
          color: var(--primary-emerald);
        }

        .accuracy.fair {
          color: var(--accent-amber);
        }

        .accuracy.poor {
          color: #ef4444;
        }

        .location-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }

        .collection-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section {
          padding: 20px;
        }

        .form-section h3 {
          margin-bottom: 16px;
          font-size: 1.125rem;
          color: var(--text-primary);
        }

        .photo-capture {
          margin-bottom: 16px;
        }

        .photo-input {
          display: none;
        }

        .photo-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px;
          border: 2px dashed var(--glass-border);
          background: transparent;
          cursor: pointer;
        }

        .photo-preview {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
        }

        .photo-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
        }

        .photo-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-photo {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          margin-top: 8px;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

// Collection List Component
const CollectionList = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Load collections from localStorage (mock offline storage)
    const loadCollections = () => {
      const stored = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('collection_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            stored.push({ id: key, ...data });
          } catch (error) {
            console.error('Error parsing collection:', error);
          }
        }
      }
      setCollections(stored.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    };

    loadCollections();
  }, []);

  return (
    <div className="collection-list">
      <div className="page-header">
        <h2>My Collections</h2>
        <p>{collections.length} collection events recorded</p>
      </div>

      <div className="collections-grid">
        {collections.map((collection) => (
          <div key={collection.id} className="collection-card glass-card">
            <div className="collection-header">
              <div className="species-info">
                <h3>{collection.speciesName}</h3>
                <span className="part-badge">{collection.part}</span>
              </div>
              <div className="sync-status">
                <Clock size={16} />
                Pending
              </div>
            </div>
            <div className="collection-details">
              <div className="detail-item">
                <span className="label">Weight:</span>
                <span className="value">{collection.weightKg} kg</span>
              </div>
              <div className="detail-item">
                <span className="label">Moisture:</span>
                <span className="value">{collection.moisturePct}%</span>
              </div>
              <div className="detail-item">
                <span className="label">Method:</span>
                <span className="value">{collection.harvestMethod}</span>
              </div>
              <div className="detail-item">
                <span className="label">Date:</span>
                <span className="value">
                  {new Date(collection.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
            {collection.photos && collection.photos.length > 0 && (
              <div className="collection-photos">
                <span className="photo-count">
                  <Camera size={14} />
                  {collection.photos.length} photos
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="empty-state glass-card">
          <Leaf size={48} />
          <h3>No collections yet</h3>
          <p>Start by creating your first collection event</p>
          <Link to="/collector" className="glass-button primary">
            <Plus size={16} />
            New Collection
          </Link>
        </div>
      )}

      <style jsx>{`
        .collection-list {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .page-header h2 {
          font-size: 1.75rem;
          margin-bottom: 8px;
        }

        .page-header p {
          color: var(--text-secondary);
          margin: 0;
        }

        .collections-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .collection-card {
          padding: 20px;
        }

        .collection-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .species-info h3 {
          margin: 0 0 8px 0;
          font-size: 1.125rem;
        }

        .part-badge {
          display: inline-block;
          padding: 4px 8px;
          background: rgba(16, 185, 129, 0.2);
          color: var(--primary-emerald);
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .sync-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--accent-amber);
          background: rgba(245, 158, 11, 0.1);
          padding: 4px 8px;
          border-radius: 12px;
        }

        .collection-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .collection-photos {
          padding-top: 12px;
          border-top: 1px solid var(--glass-border);
        }

        .photo-count {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: var(--text-secondary);
        }

        .empty-state svg {
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .empty-state p {
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

// Profile Component
const Profile = () => {
  return (
    <div className="profile">
      <div className="page-header">
        <h2>Collector Profile</h2>
      </div>
      
      <div className="profile-card glass-card">
        <div className="profile-avatar">
          <User size={48} />
        </div>
        <h3>Ramesh Sharma</h3>
        <p>Farmer - Jodhpur Farmers Cooperative</p>
        
        <div className="profile-stats">
          <div className="stat">
            <div className="stat-value">47</div>
            <div className="stat-label">Collections</div>
          </div>
          <div className="stat">
            <div className="stat-value">1,247kg</div>
            <div className="stat-label">Total Weight</div>
          </div>
          <div className="stat">
            <div className="stat-value">3</div>
            <div className="stat-label">Species</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .profile-card {
          text-align: center;
          padding: 32px 24px;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary-emerald);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: white;
        }

        .profile-card h3 {
          margin-bottom: 8px;
          font-size: 1.5rem;
        }

        .profile-card p {
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

// Settings Component
const Settings = () => {
  return (
    <div className="settings">
      <div className="page-header">
        <h2>Settings</h2>
      </div>
      
      <div className="settings-section glass-card">
        <h3>Sync Settings</h3>
        <div className="setting-item">
          <span>Auto-sync when online</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="setting-item">
          <span>Sync photos</span>
          <input type="checkbox" defaultChecked />
        </div>
      </div>

      <div className="settings-section glass-card">
        <h3>Location Settings</h3>
        <div className="setting-item">
          <span>High accuracy GPS</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="setting-item">
          <span>Background location</span>
          <input type="checkbox" />
        </div>
      </div>

      <style jsx>{`
        .settings {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .settings-section {
          margin-bottom: 24px;
          padding: 20px;
        }

        .settings-section h3 {
          margin-bottom: 16px;
          font-size: 1.125rem;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--glass-border);
        }

        .setting-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default CollectorPWA;