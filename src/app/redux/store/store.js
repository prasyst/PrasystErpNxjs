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
          // Ignore these field paths in all actions
          ignoredActionPaths: ['payload.icon'],
          // Ignore these paths in the state
          ignoredPaths: ['pin.pinnedModules.*.icon'],
        },
      }),
  });
};