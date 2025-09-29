// src/app/store/store.js
'use client';

import { configureStore } from '@reduxjs/toolkit';
import pinReducer from './pinSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      pin: pinReducer,
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