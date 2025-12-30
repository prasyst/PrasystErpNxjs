// src/app/store/store.js
'use client';

import { configureStore } from '@reduxjs/toolkit';
import pinReducer from './pinSlice';
import permissionReducer from './permissionSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      pin: pinReducer,
      permission: permissionReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          
          ignoredActionPaths: ['payload.icon'],
          
          ignoredPaths: ['pin.pinnedModules.*.icon'],
        },
      }),
  });
};