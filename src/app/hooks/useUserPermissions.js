'use client';

import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';

// In your useUserPermissions.js file, update these functions:

export const useUserPermissions = () => {
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    if (typeof window !== 'undefined') {
      const userIdFromStorage = localStorage.getItem('USER_ID');
      if (userIdFromStorage) {
        return userIdFromStorage;
      }
      
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          return parsedUser.USER_ID || parsedUser.userId || null;
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    return null;
  };

  // Fetch user permissions from API using userId - WITHOUT CACHE
  const fetchUserPermissions = useCallback(async (userId, forceRefresh = false) => {
    if (!userId) {
      console.warn('No user ID provided for fetching permissions');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching permissions for user ID:', userId);
      
      const response = await axiosInstance.post('/MODULE/RetriveWebUserprivs', {
        "FLAG": "UR",
        "TBLNAME": "WebUserprivs",
        "FLDNAME": "User_Id",
        "ID": userId.toString(),
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": ""
      });

      console.log('Permissions API Response:', response.data);

      if (response.data && response.data.DATA) {
        const permissionsMap = {};
        response.data.DATA.forEach(item => {
          if (item.MOD_NAME || item.MOD_DESC) {
            const moduleName = item.MOD_DESC || item.MOD_NAME;
            permissionsMap[moduleName] = {
              ADD_PRIV: item.ADD_PRIV === "1",
              EDIT_PRIV: item.EDIT_PRIV === "1",
              DELETE_PRIV: item.DELETE_PRIV === "1",
              SELECT_PRIV: item.SELECT_PRIV === "1",
              MOD_DESC: item.MOD_DESC,
              MOD_NAME: item.MOD_NAME,
              MOD_ID: item.MOD_ID,
              USER_ID: item.USER_ID
            };
          }
        });
        
        setPermissions(permissionsMap);
        const fetchTime = Date.now();
        setLastFetched(fetchTime);
        
        // Still store in localStorage but don't rely on it for immediate updates
        localStorage.setItem('userPermissions', JSON.stringify(permissionsMap));
        localStorage.setItem('permissionsLastFetched', fetchTime.toString());
        
        console.log('Permissions loaded for user ID:', userId, permissionsMap);
      } else {
        console.warn('No permission data received from API');
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

    // Check if user has at least one permission for a module
  const hasPermission = useCallback((modName) => {
    if (!modName) return true;
    
    if (loading) return true;
    
    if (Object.keys(permissions).length === 0) return true;
    
    const modulePerms = permissions[modName];
    
    if (!modulePerms) {
      console.log(`Module ${modName} not found in permissions, defaulting to visible`);
      return true;
    }
    
    const hasPerm = (
      modulePerms.ADD_PRIV ||
      modulePerms.EDIT_PRIV ||
      modulePerms.DELETE_PRIV ||
      modulePerms.SELECT_PRIV
    );
    
    return hasPerm;
  }, [permissions, loading]);

   const clearPermissions = useCallback(() => {
    setPermissions({});
    setCurrentUser(null);
    setUserId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('permissionsLastFetched');
    }
  }, []);

  // Check specific permission - with debug logs
  const hasSpecificPermission = useCallback((modName, permissionType) => {
    if (!modName) return false;
    
    // Try exact match first
    let modulePerms = permissions[modName];
    
    // If not found, try case-insensitive match
    if (!modulePerms) {
      const foundKey = Object.keys(permissions).find(
        key => key.toLowerCase() === modName.toLowerCase()
      );
      if (foundKey) {
        modulePerms = permissions[foundKey];
      }
    }
    
    // If still not found, try partial match
    if (!modulePerms) {
      const foundKey = Object.keys(permissions).find(
        key => key.toLowerCase().includes(modName.toLowerCase()) || 
               modName.toLowerCase().includes(key.toLowerCase())
      );
      if (foundKey) {
        modulePerms = permissions[foundKey];
        console.log(`Found fuzzy match for ${modName}: ${foundKey}`);
      }
    }
    
    if (!modulePerms) {
      console.log(`Module ${modName} not found in permissions`);
      return false;
    }
    
    let result = false;
    switch (permissionType.toUpperCase()) {
      case 'ADD': 
        result = modulePerms.ADD_PRIV === true;
        break;
      case 'EDIT': 
        result = modulePerms.EDIT_PRIV === true;
        break;
      case 'DELETE': 
        result = modulePerms.DELETE_PRIV === true;
        break;
      case 'VIEW': 
        result = modulePerms.SELECT_PRIV === true;
        break;
      default: 
        result = false;
    }
    
    console.log(`Permission check for ${modName} - ${permissionType}:`, result);
    return result;
  }, [permissions]);

  // Add a refresh function that components can call
  const refreshPermissions = useCallback(() => {
    const currentUserId = getCurrentUserId();
    if (currentUserId) {
      console.log('Manually refreshing permissions for user:', currentUserId);
      return fetchUserPermissions(currentUserId, true);
    }
    return Promise.resolve();
  }, [fetchUserPermissions]);

  // Initialize permissions on component mount - always fetch fresh
  useEffect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      setUserId(userId);
      setCurrentUser(userId.toString());
      
      // Always fetch fresh permissions when component mounts
      // This ensures latest data from server
      fetchUserPermissions(userId);
    } else {
      setLoading(false);
    }
  }, [fetchUserPermissions]);

  return {
    permissions,
    loading,
    hasPermission,
    hasSpecificPermission,
    currentUser,
    userId,
    setUser: (userId) => {
      setUserId(userId);
      setCurrentUser(userId.toString());
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUserId', userId.toString());
      }
      fetchUserPermissions(userId);
    },
    clearPermissions,
    refreshPermissions, // Export refresh function
    lastFetched
  };
};