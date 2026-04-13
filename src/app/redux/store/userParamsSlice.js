// src/app/store/userParamsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

const initialState = {
  params: [], // Complete array of all parameters
  paramsMap: {}, // Name-wise mapping for quick access
  loading: false,
  error: null,
  lastUpdated: null,
};

const userParamsSlice = createSlice({
  name: 'userParams',
  initialState,
  reducers: {
    setUserParams: (state, action) => {
      state.params = action.payload.params;
      state.paramsMap = action.payload.paramsMap;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUserParams: (state) => {
      state.params = [];
      state.paramsMap = {};
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
    // For real-time update when API response changes
    updateSingleParam: (state, action) => {
      const { USERPM_NAME, REMARK } = action.payload;
      
      // Update params array
      const paramIndex = state.params.findIndex(p => p.USERPM_NAME === USERPM_NAME);
      if (paramIndex !== -1) {
        state.params[paramIndex].REMARK = REMARK;
      }
      
      // Update paramsMap
      if (state.paramsMap[USERPM_NAME]) {
        state.paramsMap[USERPM_NAME].REMARK = REMARK;
      }
      
      state.lastUpdated = Date.now();
    },
  },
});

export const { setUserParams, setLoading, setError, clearUserParams, updateSingleParam } = userParamsSlice.actions;

// Async thunk to fetch user params
export const fetchUserParams = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    
    // Pehle check karo ki kya recently fetch hua hai (last 5 minutes)
    const { lastUpdated } = getState().userParams;
    if (lastUpdated && (Date.now() - lastUpdated) < 5 * 60 * 1000) {
      dispatch(setLoading(false));
      return;
    }
    
    const response = await axiosInstance.post('USERPARAM/RetriveUserParam', {
      USERPM_ID: 0,
      USERPM_NAME: "",
      REMARK: "",
      FLAG: ""
    });
    
    if (response.data.STATUS === 0 && response.data.DATA) {
      // Create mapping
      const paramsMap = {};
      response.data.DATA.forEach(param => {
        paramsMap[param.USERPM_NAME] = {
          USERPM_ID: param.USERPM_ID,
          REMARK: param.REMARK,
          SECPM_ID: param.SECPM_ID,
          SECPM_NAME: param.SECPM_NAME,
          COBR_ID: param.COBR_ID,
          NAME: param.NAME
        };
      });
      
      // Save to Redux
      dispatch(setUserParams({
        params: response.data.DATA,
        paramsMap: paramsMap
      }));
      
      // Also save to localStorage for backup
      localStorage.setItem('USER_PARAMS', JSON.stringify(response.data.DATA));
      localStorage.setItem('USER_PARAMS_MAP', JSON.stringify(paramsMap));
      
    } else {
      dispatch(setError(response.data.MESSAGE || 'Failed to fetch user params'));
    }
  } catch (error) {
    dispatch(setError(error.message || 'Error fetching user params'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Selectors
export const selectUserParams = (state) => state.userParams.params;
export const selectUserParamsMap = (state) => state.userParams.paramsMap;
export const selectUserParamsLoading = (state) => state.userParams.loading;
export const selectUserParamByName = (state, paramName) => state.userParams.paramsMap[paramName] || null;

export default userParamsSlice.reducer;