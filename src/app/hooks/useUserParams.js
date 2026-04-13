// hooks/useUserParams.js
import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';

const useUserParams = () => {
  const [paramsMap, setParamsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUserParams = useCallback(async () => {
    try {
      // Pehle localStorage check karo
      const storedParamsMap = localStorage.getItem('USER_PARAMS_MAP');
      if (storedParamsMap) {
        setParamsMap(JSON.parse(storedParamsMap));
        setLoading(false);
        return;
      }
      
      // Agar localStorage me nahi hai to API call karo
      const response = await axiosInstance.post('USERPARAM/RetriveUserParam', {
        USERPM_ID: 0,
        USERPM_NAME: "",
        REMARK: "",
        FLAG: ""
      });
      
      if (response.data.STATUS === 0 && response.data.DATA) {
        const map = {};
        response.data.DATA.forEach(param => {
          map[param.USERPM_NAME] = {
            USERPM_ID: param.USERPM_ID,
            REMARK: param.REMARK
          };
        });
        
        localStorage.setItem('USER_PARAMS_MAP', JSON.stringify(map));
        setParamsMap(map);
      }
    } catch (error) {
      console.error('Error fetching user params:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if duplicate style is allowed
  const isDuplicateStyleAllowed = useCallback(() => {
    const allowDuplicate = paramsMap['Allow Duplicate Style In Order']?.REMARK;
    return allowDuplicate === '1';
  }, [paramsMap]);

  // 🆕 ADD THIS FUNCTION - Check if shade allocation is enabled
  const isShadeAllocationEnabled = useCallback(() => {
    const shadeAllocation = paramsMap['Shade Allocation']?.REMARK;
    return shadeAllocation === '1'; // '1' means enabled, '0' means disabled
  }, [paramsMap]);

  return {
    fetchUserParams,
    isDuplicateStyleAllowed,
    isShadeAllocationEnabled, // 🆕 Export this function
    loading
  };
};

export default useUserParams;