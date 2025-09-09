import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './App.css';

// Components
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CollectorPWA from './components/CollectorPWA';
import ConsumerPortal from './components/ConsumerPortal';
import Login from './components/Login';

// Context
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app
    const initApp = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
          console.log('MetaMask is installed!');
        }
        
        // Add any other initialization logic here
        setTimeout(() => setIsLoading(false), 1000);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="glass-card loading-card">
          <div className="loading-spinner"></div>
          <h2>Loading NeoCrypt Platform...</h2>
          <p>Initializing blockchain connection</p>
        </div>
      </div>
    );
  }

  return (
    <Web3Provider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/collector/*" element={<CollectorPWA />} />
              <Route path="/consumer/:slug" element={<ConsumerPortal />} />
              <Route path="/consumer" element={<ConsumerPortal />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Web3Provider>
  );
}

export default App;