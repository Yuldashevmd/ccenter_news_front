import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    document.body.style.backgroundColor = checked ? '#1e2124' : '#ffffff';
    document.body.style.color = checked ? '#ffffff' : '#000000';
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, language, handleLanguageChange }}>
      {children}
    </ThemeContext.Provider>
  );
};