// src/app/hooks/usePin.js
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { pinModule, unpinModule } from '../redux/store/pinSlice';

export const usePin = () => {
  const dispatch = useDispatch();
  const pinnedModules = useSelector((state) => state.pin.pinnedModules);

  const pin = (module) => {
    dispatch(pinModule(module));
  };

  const unpin = (module) => {
    dispatch(unpinModule(module));
  };

  const isPinned = (path) => {
    return pinnedModules.some(module => module.path === path);
  };

  return {
    pinnedModules,
    pinModule: pin,
    unpinModule: unpin,
    isPinned,
  };
};