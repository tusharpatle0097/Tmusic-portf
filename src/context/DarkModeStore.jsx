import React, { createContext, useEffect, useState } from 'react';

export const DarkModeContext = createContext(null);

const DarkModeStore = (props) => {
    // Initialize the dark mode state using localStorage (if available)
    const [isDarkMode, setIsDarkMode] = useState(() => {
      const storedValue = localStorage.getItem('darkMode');
      return storedValue === 'true';
    });
  
    // Function to toggle dark mode
    const toggleDarkMode = () => {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      // Update localStorage to store the user's preference
      localStorage.setItem('darkMode', newMode);
    };
  
    // Listen for changes to the dark mode state and update the CSS class
    useEffect(() => {
      if (isDarkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }, [isDarkMode]);
  
    const valueData = {
      isDarkMode,
      toggleDarkMode,
    };
  
    return (
      <DarkModeContext.Provider value={valueData}>
        {props.children}
      </DarkModeContext.Provider>
    );
  };
  
  export default DarkModeStore;