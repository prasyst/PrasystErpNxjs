// app/hooks/useUserPermissions.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';

export const useUserPermissions = () => {
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage or session
  const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
      // Try to get from localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        return storedUser;
      }
      
      // Try to get from sessionStorage
      const sessionUser = sessionStorage.getItem('currentUser');
      if (sessionUser) {
        return sessionUser;
      }
      
      // Try to get from your authentication state if available
      const authUser = localStorage.getItem('userName') || localStorage.getItem('userId');
      return authUser;
    }
    return null;
  };

  // Fetch user permissions from API
  const fetchUserPermissions = useCallback(async (userName) => {
    if (!userName) {
      console.warn('No user name provided for fetching permissions');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/MODULE/RetriveUSERPRIVS', {
        "FLAG": "R",
        "TBLNAME": "USERPRIVS",
        "FLDNAME": "User_Id",
        "ID": userName,
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": ""
      });

      console.log('Permissions API Response:', response.data);

      if (response.data && response.data.DATA) {
        // Create a map of MOD_NAME to permissions
        const permissionsMap = {};
        response.data.DATA.forEach(item => {
          if (item.MOD_NAME) {
            permissionsMap[item.MOD_NAME] = {
              ADD_PRIV: item.ADD_PRIV === "1",
              EDIT_PRIV: item.EDIT_PRIV === "1",
              DELETE_PRIV: item.DELETE_PRIV === "1",
              SELECT_PRIV: item.SELECT_PRIV === "1",
              MOD_DESC: item.MOD_DESC,
              MOD_ID: item.MOD_ID,
              USER_ID: item.USER_ID
            };
          }
        });
        setPermissions(permissionsMap);
        
        // Store in localStorage for persistence
        localStorage.setItem('userPermissions', JSON.stringify(permissionsMap));
        localStorage.setItem('permissionsLastFetched', Date.now().toString());
        
        console.log('Permissions loaded for user:', userName, permissionsMap);
      } else {
        console.warn('No permission data received from API');
        // Fallback to localStorage if available
        const storedPermissions = localStorage.getItem('userPermissions');
        if (storedPermissions) {
          setPermissions(JSON.parse(storedPermissions));
        }
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      
      // Fallback to localStorage if available
      const storedPermissions = localStorage.getItem('userPermissions');
      if (storedPermissions) {
        console.log('Using cached permissions due to API error');
        setPermissions(JSON.parse(storedPermissions));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user has at least one permission for a module
  const hasPermission = useCallback((modName) => {
    if (!modName) return true; // Default to visible if no MOD_NAME
    
    // If permissions are still loading, show everything temporarily
    if (loading) {
      return true;
    }
    
    // If no permissions data yet, show everything
    if (Object.keys(permissions).length === 0) {
      return true;
    }
    
    const modulePerms = permissions[modName];
    
    // If module not found in permissions, default to visible
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
    
    console.log(`Permission check for ${modName}:`, modulePerms, 'Result:', hasPerm);
    return hasPerm;
  }, [permissions, loading]);

  // Check specific permission
  const hasSpecificPermission = useCallback((modName, permissionType) => {
    if (!modName || !permissions[modName]) return false;
    
    const modulePerms = permissions[modName];
    switch (permissionType) {
      case 'ADD': return modulePerms.ADD_PRIV;
      case 'EDIT': return modulePerms.EDIT_PRIV;
      case 'DELETE': return modulePerms.DELETE_PRIV;
      case 'VIEW': return modulePerms.SELECT_PRIV;
      default: return false;
    }
  }, [permissions]);

  // Manually set current user (call this after login)
  const setUser = useCallback((userName) => {
    if (userName) {
      setCurrentUser(userName);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', userName);
      }
      fetchUserPermissions(userName);
    }
  }, [fetchUserPermissions]);

  // Clear permissions (call this on logout)
  const clearPermissions = useCallback(() => {
    setPermissions({});
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('permissionsLastFetched');
    }
  }, []);

  // Initialize permissions on component mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      
      // Check if we need to refresh permissions (older than 5 minutes)
      const lastFetched = localStorage.getItem('permissionsLastFetched');
      const shouldRefresh = !lastFetched || (Date.now() - parseInt(lastFetched)) > 5 * 60 * 1000;
      
      if (shouldRefresh) {
        fetchUserPermissions(user);
      } else {
        // Use cached permissions
        const storedPermissions = localStorage.getItem('userPermissions');
        if (storedPermissions) {
          setPermissions(JSON.parse(storedPermissions));
          setLoading(false);
        } else {
          fetchUserPermissions(user);
        }
      }
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
    setUser,
    clearPermissions,
    refetchPermissions: fetchUserPermissions
  };
};