import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = async (email, password) => {
    try {
      // Bypass API and generate pseudo-token
      const pseudoToken = Math.random().toString(36).substring(2);
      const pseudoUser = { email, name: email.split('@')[0] }; // Use email prefix as name
      setUser(pseudoUser);
      setToken(pseudoToken);
      localStorage.setItem('token', pseudoToken);
      return true;
    } catch (error) {
      console.error('Login failed:', error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);