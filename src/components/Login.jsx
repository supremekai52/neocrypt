import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Shield, User } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'FARMER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const demoUsers = [
    { email: 'farmer@demo.com', role: 'FARMER', name: 'Ramesh Sharma', org: 'Jodhpur Farmers Cooperative' },
    { email: 'processor@demo.com', role: 'PROCESSOR', name: 'Priya Patel', org: 'Rajasthan Herbal Processing Ltd' },
    { email: 'lab@demo.com', role: 'LAB', name: 'Dr. Suresh Kumar', org: 'Central Ayurveda Research Laboratory' },
    { email: 'manufacturer@demo.com', role: 'MANUFACTURER', name: 'Anjali Singh', org: 'Vedic Wellness Pharmaceuticals' },
    { email: 'regulator@demo.com', role: 'REGULATOR', name: 'Vikash Chandra', org: 'Ministry of AYUSH, Rajasthan' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = demoUsers.find(u => u.email === formData.email);
      if (user && formData.password === 'demo') {
        // Store user data
        localStorage.setItem('user', JSON.stringify(user));
        
        // Navigate based on role
        if (user.role === 'FARMER') {
          navigate('/collector');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Invalid credentials. Use demo@demo.com with password "demo"');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (user) => {
    setFormData({
      email: user.email,
      password: 'demo',
      role: user.role
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <Link to="/" className="logo-link">
            <Leaf size={32} />
            <span>NeoCrypt</span>
          </Link>
          <h1>Sign In</h1>
          <p>Access your botanical traceability dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form glass-card">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="FARMER">Farmer</option>
              <option value="PROCESSOR">Processor</option>
              <option value="LAB">Laboratory</option>
              <option value="MANUFACTURER">Manufacturer</option>
              <option value="REGULATOR">Regulator</option>
            </select>
          </div>

          <button
            type="submit"
            className="login-button glass-button primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner small"></div>
                Signing In...
              </>
            ) : (
              <>
                <Shield size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo Users */}
        <div className="demo-users glass-card">
          <h3>Demo Users</h3>
          <p>Click any user below to auto-fill credentials (password: demo)</p>
          <div className="demo-users-grid">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                className="demo-user-card"
                onClick={() => handleDemoLogin(user)}
              >
                <div className="user-avatar">
                  <User size={20} />
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-role">{user.role}</div>
                  <div className="user-org">{user.org}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          <p>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-container {
          max-width: 500px;
          width: 100%;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          margin-bottom: 24px;
        }

        .logo-link svg {
          color: var(--primary-emerald);
        }

        .login-header h1 {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .login-header p {
          color: var(--text-secondary);
          margin: 0;
        }

        .login-form {
          padding: 32px;
          margin-bottom: 24px;
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: var(--text-primary);
        }

        .login-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          margin-top: 8px;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner.small {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }

        .demo-users {
          padding: 24px;
          margin-bottom: 24px;
        }

        .demo-users h3 {
          margin-bottom: 8px;
          text-align: center;
        }

        .demo-users p {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 20px;
          font-size: 14px;
        }

        .demo-users-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .demo-user-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .demo-user-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
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
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .user-role {
          font-size: 12px;
          color: var(--primary-emerald);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .user-org {
          font-size: 12px;
          color: var(--text-muted);
        }

        .login-footer {
          text-align: center;
        }

        .login-footer p {
          margin-bottom: 8px;
          color: var(--text-secondary);
        }

        .login-footer a {
          color: var(--primary-emerald);
          text-decoration: none;
          font-weight: 600;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-form,
          .demo-users {
            padding: 20px;
          }

          .demo-user-card {
            padding: 12px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;