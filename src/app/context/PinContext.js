// src/app/context/PinContext.js
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Action types
const PIN_MODULE = 'PIN_MODULE';
const UNPIN_MODULE = 'UNPIN_MODULE';
const LOAD_PINNED_MODULES = 'LOAD_PINNED_MODULES';

// Reducer function
const pinReducer = (state, action) => {
  switch (action.type) {
    case PIN_MODULE:
      // Check if module is already pinned
      if (state.some(module => module.path === action.payload.path)) {
        return state;
      }
      return [...state, action.payload];
    
    case UNPIN_MODULE:
      return state.filter(module => module.path !== action.payload.path);
    
    case LOAD_PINNED_MODULES:
      return action.payload;
    
    default:
      return state;
  }
};

// Create context
const PinContext = createContext(undefined);

// Provider component
export const PinProvider = ({ children }) => {
  const [pinnedModules, dispatch] = useReducer(pinReducer, []);

  // Load pinned modules from localStorage on initial render
  useEffect(() => {
    try {
      const savedPinnedModules = localStorage.getItem('pinnedModules');
      if (savedPinnedModules) {
        dispatch({
          type: LOAD_PINNED_MODULES,
          payload: JSON.parse(savedPinnedModules)
        });
      }
    } catch (error) {
      console.error('Error loading pinned modules from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever pinnedModules changes
  useEffect(() => {
    try {
      localStorage.setItem('pinnedModules', JSON.stringify(pinnedModules));
    } catch (error) {
      console.error('Error saving pinned modules to localStorage:', error);
    }
  }, [pinnedModules]);

  const pinModule = (module) => {
    dispatch({ type: PIN_MODULE, payload: module });
  };

  const unpinModule = (module) => {
    dispatch({ type: UNPIN_MODULE, payload: module });
  };

  const value = {
    pinnedModules,
    pinModule,
    unpinModule
  };

  return (
    <PinContext.Provider value={value}>
      {children}
    </PinContext.Provider>
  );
};

// Custom hook to use the pin context
export const usePin = () => {
  const context = useContext(PinContext);
  
  if (context === undefined) {
    throw new Error('usePin must be used within a PinProvider');
  }
  
  return context;
};