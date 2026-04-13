// src/app/store/store.js
'use client';

import { configureStore } from '@reduxjs/toolkit';
import pinReducer from './pinSlice';
import permissionReducer from './permissionSlice';
import userParamsReducer from './userParamsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      pin: pinReducer,
      permission: permissionReducer,
      userParams: userParamsReducer,
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