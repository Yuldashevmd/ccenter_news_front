import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    try {
      // Accept any email/password combination
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      const pseudoUser = { email, name: email.split('@')[0] };
      setUser(pseudoUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);