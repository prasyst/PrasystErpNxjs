// src/app/store/pinSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pinnedModules: [],
};

const pinSlice = createSlice({
  name: 'pin',
  initialState,
  reducers: {
    pinModule: (state, action) => {
      // Check if module is already pinned
      if (!state.pinnedModules.some(module => module.path === action.payload.path)) {
        state.pinnedModules.push(action.payload);
      }
    },
    unpinModule: (state, action) => {
      state.pinnedModules = state.pinnedModules.filter(
        module => module.path !== action.payload.path
      );
    },
    setPinnedModules: (state, action) => {
      state.pinnedModules = action.payload;
    },
  },
});

export const { pinModule, unpinModule, setPinnedModules } = pinSlice.actions;
export default pinSlice.reducer;