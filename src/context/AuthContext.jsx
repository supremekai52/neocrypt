import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);

      // Mock API call
      const response = await mockLogin(credentials);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('walletConnected');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Mock login function
  const mockLogin = async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const demoUsers = [
      { 
        id: 'user_farmer',
        email: 'farmer@demo.com', 
        role: 'FARMER', 
        name: 'Ramesh Sharma', 
        organization: 'Jodhpur Farmers Cooperative',
        permissions: ['create_collection', 'transfer_custody']
      },
      { 
        id: 'user_processor',
        email: 'processor@demo.com', 
        role: 'PROCESSOR', 
        name: 'Priya Patel', 
        organization: 'Rajasthan Herbal Processing Ltd',
        permissions: ['create_processing', 'manage_facility']
      },
      { 
        id: 'user_lab',
        email: 'lab@demo.com', 
        role: 'LAB', 
        name: 'Dr. Suresh Kumar', 
        organization: 'Central Ayurveda Research Laboratory',
        permissions: ['create_quality_test', 'issue_certificate']
      },
      { 
        id: 'user_manufacturer',
        email: 'manufacturer@demo.com', 
        role: 'MANUFACTURER', 
        name: 'Anjali Singh', 
        organization: 'Vedic Wellness Pharmaceuticals',
        permissions: ['create_batch', 'mint_qr', 'manage_products']
      },
      { 
        id: 'user_regulator',
        email: 'regulator@demo.com', 
        role: 'REGULATOR', 
        name: 'Vikash Chandra', 
        organization: 'Ministry of AYUSH, Rajasthan',
        permissions: ['manage_rules', 'view_all', 'recall_batch']
      }
    ];

    const user = demoUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'demo') {
      return {
        success: true,
        user: {
          ...user,
          token: 'mock-jwt-token-' + Date.now(),
          loginTime: new Date().toISOString()
        }
      };
    } else {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
  };

  // Permission checking
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};