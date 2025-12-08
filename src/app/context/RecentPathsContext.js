'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentPathsContext = createContext();

export const useRecentPaths = () => {
  const context = useContext(RecentPathsContext);
  if (!context) {
    throw new Error('useRecentPaths must be used within a RecentPathsProvider');
  }
  return context;
};

export const RecentPathsProvider = ({ children }) => {
  const [recentPaths, setRecentPaths] = useState([]);

  // Load recent paths from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('recentPaths');
    if (stored) {
      try {
        setRecentPaths(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recent paths:', error);
        setRecentPaths([]);
      }
    }
  }, []);

  // Save to localStorage whenever recentPaths changes
  useEffect(() => {
    localStorage.setItem('recentPaths', JSON.stringify(recentPaths));
    console.log("888888", recentPaths)
  }, [recentPaths]);

  const addRecentPath = (path, name) => {
    if (!path || path === '#' || path === '/' || !name) return;

    const newPath = {
      path,
      name,
      timestamp: new Date().toISOString(),
      id: `${path}-${Date.now()}`
    };

    setRecentPaths(prev => {
      // Remove duplicates and keep only latest 10
      const filtered = prev.filter(item => item.path !== path);
      return [newPath, ...filtered].slice(0, 10);
    });
  };

  const clearRecentPaths = () => {
    setRecentPaths([]);
  };

  const removeRecentPath = (pathId) => {
    setRecentPaths(prev => prev.filter(item => item.id !== pathId));
  };

  return (
    <RecentPathsContext.Provider value={{
      recentPaths,
      addRecentPath,
      clearRecentPaths,
      removeRecentPath
    }}>
      {children}
    </RecentPathsContext.Provider>
  );
};