// src/app/store/permissionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userPermissions: {},
  currentUser: null,
  isLoading: false,
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload.permissions;
      state.currentUser = action.payload.userName;
    },
    clearPermissions: (state) => {
      state.userPermissions = {};
      state.currentUser = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // Update permission for a specific module
    updatePermission: (state, action) => {
      const { moduleName, permissionType, value } = action.payload;
      if (state.userPermissions[moduleName]) {
        state.userPermissions[moduleName][permissionType] = value;
      }
    },
  },
});

export const { setUserPermissions, clearPermissions, setLoading, updatePermission } = permissionSlice.actions;

// Helper selector to check if user has any permission for a module
export const hasAnyPermission = (state, moduleName) => {
  const permissions = state.permission.userPermissions[moduleName];
  if (!permissions) return false;
  
  return permissions.ADD_PRIV === "1" || 
         permissions.EDIT_PRIV === "1" || 
         permissions.DELETE_PRIV === "1" || 
         permissions.SELECT_PRIV === "1";
};

// Helper selector to check specific permission
export const hasPermission = (state, moduleName, permissionType) => {
  const permissions = state.permission.userPermissions[moduleName];
  if (!permissions) return false;
  
  return permissions[permissionType] === "1";
};

export default permissionSlice.reducer;