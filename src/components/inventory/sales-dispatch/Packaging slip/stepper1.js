'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import {
  Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, FormLabel, Radio, RadioGroup, Checkbox,
} from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import { getFormMode } from '../../../../lib/helpers';
import { toast, ToastContainer } from 'react-toastify';

const FORM_MODE = getFormMode();

const Stepper1 = ({
  formData,
  setFormData,
  isFormDisabled,
  mode,
  onSubmit,
  onCancel,
  onNext,
  showValidationErrors,
detailMode,
setDetailMode,
  partyMapping,
  branchMapping,
  brokerMapping,
  broker1Mapping,
  salesperson1Mapping,
  salesperson2Mapping,
  consigneeMapping,
  seasonMapping,
  transporterMapping,
  orderTypeMapping,
  merchandiserMapping,
  setPartyMapping,
  setBranchMapping,
  setBrokerMapping,
  setBroker1Mapping,
  setSalesperson1Mapping,
  setSalesperson2Mapping,
  setConsigneeMapping,
  setSeasonMapping,
  setTransporterMapping,
  setOrderTypeMapping,
  setMerchandiserMapping,
  showSnackbar,
  fetchPartyDetailsForAutoFill,
  isDataLoading,companyConfig,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // State for dropdown options
  const [partyOptions, setPartyOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [brokerOptions, setBrokerOptions] = useState([]);
  const [broker1Options, setBroker1Options] = useState([]);
  const [salesperson1Options, setSalesperson1Options] = useState([]);
  const [salesperson2Options, setSalesperson2Options] = useState([]);
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [transporterOptions, setTransporterOptions] = useState([]);
  const [shippingPartyOptions, setShippingPartyOptions] = useState([]);
  const [shippingPlaceOptions, setShippingPlaceOptions] = useState([]);
  const [orderTypeOptions, setOrderTypeOptions] = useState([]);
  const [merchandiserOptions, setMerchandiserOptions] = useState([]);
  const [priceListOptions, setPriceListOptions] = useState([]);
const [selectedDetailMode, setSelectedDetailMode] = useState('style');
const [isFetchingOrderNo, setIsFetchingOrderNo] = useState(false);
const [typingTimeout, setTypingTimeout] = useState(null);
  // State to track loading for branch API
  const [loadingBranches, setLoadingBranches] = useState(false);

  const [gstType, setGstType] = useState('state');

  const textInputSx = {
    '& .MuiInputBase-root': {
      height: 38,
      fontSize: '15px',
      borderRadius: '4px',
      backgroundColor: '#fafafa',
      border: '1px solid #e0e0e0',
      padding: '6px 12px',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      '&:hover': {
        borderColor: '#4caf50',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '15px',
      top: '-6px',
      color: '#666',
      transition: 'color 0.3s, font-size 0.3s, top 0.3s',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '8px 12px',
      fontSize: '15px',
      lineHeight: '1.5',
      color: '#333',
      '&::placeholder': {
        color: '#888',
      },
    },
    '& .MuiInputBase-root.Mui-focused': {
      borderColor: '#4caf50',
      boxShadow: '0 0 5px rgba(76, 175, 80, 0.2)',
    },
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: '#f1f1f1',
      border: '1px solid #ddd',
    },
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: '#fff'
    }
  };

  const DropInputSx = {
    '& .MuiInputBase-root': {
      height: 38,
      fontSize: '14px',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      padding: '6px 12px',
      paddingTop: '6px',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      '&:hover': {
        borderColor: '#4caf50',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '15px',
      top: '-6px',
      color: '#666',
      transition: 'color 0.3s, font-size 0.3s, top 0.3s',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      paddingRight: '36px',
      height: 38,
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '8px 12px',
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#333',
      '&::placeholder': {
        color: '#888',
      },
    },
    '& .MuiAutocomplete-endAdornment': {
      top: '50%',
      transform: 'translateY(-50%)',
      right: '12px',
    },
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: '#ffffff',
      border: '1px solid #ddd',
    },
    '& .MuiAutocomplete-popupIndicator': {
      color: '#4caf50',
    },
    '& .MuiAutocomplete-listbox': {
      borderRadius: '4px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
    },
  };

  const datePickerSx = {
    "& .MuiInputBase-root": {
      height: "38px",
      backgroundColor: "#ffffff",
    },
    "& .MuiInputBase-input": {
      padding: "4px 8px",
      fontSize: "12px",
    },
    "& .MuiInputLabel-root": {
      top: "-6px",
      fontSize: "12px",
    },
    "& .MuiInputBase-root.Mui-disabled": {
      backgroundColor: "#ffffff",
      '& .MuiFilledInput-root': {
        backgroundColor: "#ffffff",
      }
    },
    "& .MuiFilledInput-root": {
      backgroundColor: "#ffffff",
    },
    "& .MuiFilledInput-root.Mui-disabled": {
      backgroundColor: "#ffffff",
    },

    "& .MuiPickersInputBase-root.Mui-disabled": {
      backgroundColor: "#ffffff !important",
    },
    "& .MuiPickersFilledInput-root.Mui-disabled": {
      backgroundColor: "#ffffff !important",
    },
  };

  // Function to get today's date in DD/MM/YYYY format
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // In Stepper1.js - Add BARCD_FLG to formData when detailMode changes
useEffect(() => {
  if (detailMode) {
    setFormData(prev => ({
      ...prev,
      BARCD_FLG: detailMode === 'barcode' ? "1" : "0"
    }));
  }
}, [detailMode, setFormData]);

  // NEW: Function to fetch GST type based on party details
  const fetchGSTType = async (partyDtlId, shipPartyDtlId) => {
    try {
      const payload = {
        "COBR_ID": "02",
        "PARTYDTL_ID": partyDtlId,
        "SHIPPARTYDTL_ID": shipPartyDtlId
      };

      const response = await axiosInstance.post('/PARTY/GetGST_TYPE', payload);

      if (response.data.RESPONSESTATUSCODE === 1 && response.data.DATA && response.data.DATA.length > 0) {
        const gstData = response.data.DATA[0];

        if (gstData.IGST === "true") {
          setGstType('igst');
          // showSnackbar('IGST selected based on party details');
        } else if (gstData.SGST === "true") {
          setGstType('state');
          // showSnackbar('State GST (CGST & SGST) selected based on party details');
        }

        // Update formData with GST type
        setFormData(prev => ({
          ...prev,
          GST_TYPE: gstData.IGST === "true" ? "IGST" : "STATE"
        }));
      }
    } catch (error) {
      console.error('Error fetching GST type:', error);
      // showSnackbar('Error fetching GST type', 'error');
    }
  };

const handleSeriesChange = async (e) => {
  const { value } = e.target;
  
  // Update the series value immediately
  setFormData(prev => ({
    ...prev,
    SERIES: value
  }));

  // Clear previous timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  // Only fetch if value is not empty and we're in add/edit mode
  if (value && value.trim() !== '' && !isFormDisabled) {
    // Set a new timeout to fetch after user stops typing (500ms delay)
    const timeout = setTimeout(async () => {
      try {
        setIsFetchingOrderNo(true);
        
        const payload = {
          "MODULENAME": "PACK",
          "TBLNAME": "PACK",
          "FLDNAME": "PACK_No",
          "NCOLLEN": 6,
          "CPREFIX": value.trim(),
          "COBR_ID": companyConfig?.COBR_ID || "02",
          "FCYR_KEY": "25",
          "TRNSTYPE": "T",
          "SERIESID": 0,
          "FLAG": ""
        };

        const response = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', payload);
        
        if (response.data?.DATA && response.data.DATA.length > 0) {
          const orderData = response.data.DATA[0];
          
          // Generate ORDBK_KEY: FCYR_KEY + COBR_ID + orderNo
          const correctOrdbkKey = `25${companyConfig?.COBR_ID || "02"}${orderData.ID}`;
          
          setFormData(prev => ({
            ...prev,
            ORDER_NO: orderData.ID || "",
            LAST_ORD_NO: orderData.LASTID || "",
            SERIES: value.trim(), // Keep the series value user entered
            ORDBK_KEY: correctOrdbkKey
          }));

          // Show success message if needed
          if (showSnackbar) {
            showSnackbar(`Order number generated: ${orderData.ID}`, 'success');
          }
        }
      } catch (error) {
        console.error('Error fetching order number:', error);
        if (showSnackbar) {
          showSnackbar('Error generating order number', 'error');
        }
      } finally {
        setIsFetchingOrderNo(false);
      }
    }, 500); // 500ms delay after user stops typing

    setTypingTimeout(timeout);
  } else if (!value || value.trim() === '') {
    // If series is cleared, also clear order number and last order no
    setFormData(prev => ({
      ...prev,
      ORDER_NO: "",
      LAST_ORD_NO: "",
      ORDBK_KEY: ""
    }));
  }
};

  // Fetch Order Type Data from API
  const fetchOrderTypeData = async () => {
    try {
      const payload = {
        "ORDBK_KEY": "",
        "FLAG": "ORDTYPE",
        "FCYR_KEY": "25",
        "COBR_ID": "02",
        "PageNumber": 1,
        "PageSize": 25,
        "SearchText": "",
        "PARTY_KEY": "",
        "PARTYDTL_ID": 0
      };

      const response = await axiosInstance.post('/ORDBK/GetOrdbkDrp', payload);

      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const orderTypes = response.data.DATA.map(item => item.ORDBK_TYPE_NM || '');
        setOrderTypeOptions(orderTypes);

        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.ORDBK_TYPE_NM && item.ORDBK_TYPE) {
            mapping[item.ORDBK_TYPE_NM] = item.ORDBK_TYPE;
          }
        });

        setOrderTypeMapping(mapping);
        return orderTypes;
      }
      return [];
    } catch (error) {
      toast.error('Error fetching order type data:', error);
      return [];
    }
  };

  // Fetch Transporter Data
  const fetchTransporterData = async () => {
    try {
      const payload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "TRSP_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };

      const response = await axiosInstance.post('/TRSP/GetTRSPDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const transporters = response.data.DATA.map(item => item.TRSP_NAME || '');
        setTransporterOptions(transporters);

        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.TRSP_NAME && item.TRSP_KEY) {
            mapping[item.TRSP_NAME] = item.TRSP_KEY;
          }
        });
        setTransporterMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching transporter data:', error);
    }
  };

  // Fetch Party Data
  const fetchPartiesByName = async (name = "") => {
    try {
      const response = await axiosInstance.post("Party/GetParty_By_Name", {
        PARTY_NAME: name
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const parties = response.data.DATA.map(item => item.PARTY_NAME || '');
        setPartyOptions(parties);
        setShippingPartyOptions(parties);

        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.PARTY_NAME && item.PARTY_KEY) {
            mapping[item.PARTY_NAME] = item.PARTY_KEY;
          }
        });
        setPartyMapping(mapping);
      } else {
        setPartyOptions([]);
        setShippingPartyOptions([]);
      }
    } catch (error) {
      console.error("API error", error);
      setPartyOptions([]);
      setShippingPartyOptions([]);
    }
  };

  // Fetch Party Branches - FIXED: Proper branch selection based on API response
  const fetchPartyDetails = async (partyKey, forceBranchId = null) => {
    if (!partyKey) {
      setBranchOptions([]);
      return;
    }

    try {
      setLoadingBranches(true);
      const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
        PARTY_KEY: partyKey
      });

      console.log('Branch API Response:', response.data);

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const branches = response.data.DATA.map(item => item.PLACE || '');
        setBranchOptions(branches);
        setShippingPlaceOptions(branches);

        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.PLACE && item.PARTYDTL_ID) {
            mapping[item.PLACE] = item.PARTYDTL_ID;
          }
        });
        setBranchMapping(mapping);

        // FIXED: Don't auto-select first branch when loading existing data
        // Only auto-select when in add mode or when no specific branch is provided
        if (mode === 'add' && !forceBranchId && branches.length > 0) {
          const firstBranch = branches[0];
          const firstBranchId = mapping[firstBranch];

          setFormData(prev => ({
            ...prev,
            Branch: firstBranch,
            PARTYDTL_ID: firstBranchId,
            SHIPPING_PLACE: firstBranch,
            SHP_PARTYDTL_ID: firstBranchId
          }));

          console.log('Auto-selected branch for new order:', firstBranch, 'with ID:', firstBranchId);
        }

        // NEW: If we have a specific branch ID to select (from API response), find and select it
        if (forceBranchId) {
          const branchToSelect = response.data.DATA.find(item => item.PARTYDTL_ID === forceBranchId);
          if (branchToSelect && branchToSelect.PLACE) {
            const branchName = branchToSelect.PLACE;
            const branchId = mapping[branchName];

            setFormData(prev => ({
              ...prev,
              Branch: branchName,
              PARTYDTL_ID: branchId,
              SHIPPING_PLACE: branchName,
              SHP_PARTYDTL_ID: branchId
            }));

            console.log('Forced branch selection:', branchName, 'with ID:', branchId);
          }
        }
      } else {
        setBranchOptions([]);
        setShippingPlaceOptions([]);
      }
    } catch (error) {
      console.error("Error fetching party details:", error);
      setBranchOptions([]);
      setShippingPlaceOptions([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  // Fetch Broker Data
  const fetchBrokerData = async () => {
    try {
      const payload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "BROKER_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };

      const response = await axiosInstance.post('/BROKER/GetBrokerDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const brokers = response.data.DATA.map(item => item.BROKER_NAME || '');
        setBrokerOptions(brokers);
        setBroker1Options(brokers);

        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.BROKER_NAME && item.BROKER_KEY) {
            mapping[item.BROKER_NAME] = item.BROKER_KEY;
          }
        });
        setBrokerMapping(mapping);
        setBroker1Mapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching broker data:', error);
    }
  };

  // Fetch Salesperson Data
  const fetchSalespersonData = async () => {
    try {
      const payload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "SALEPERSON_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };

      const response = await axiosInstance.post('/SALEPERSON/GetSALEPERSONDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const salespersons = response.data.DATA.map(item => item.SALEPERSON_NAME || '');
        setSalesperson1Options(salespersons);
        setSalesperson2Options(salespersons);

        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.SALEPERSON_NAME && item.SALEPERSON_KEY) {
            mapping[item.SALEPERSON_NAME] = item.SALEPERSON_KEY;
          }
        });
        setSalesperson1Mapping(mapping);
        setSalesperson2Mapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching salesperson data:', error);
    }
  };

  // Fetch Consignee Data
  const fetchConsigneeData = async () => {
    try {
      const payload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "DISTBTR_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };

      const response = await axiosInstance.post('/DISTBTR/GetDISTBTRDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const consignees = response.data.DATA.map(item => item.DISTBTR_NAME || '');
        setConsigneeOptions(consignees);

        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.DISTBTR_NAME && item.DISTBTR_KEY) {
            mapping[item.DISTBTR_NAME] = item.DISTBTR_KEY;
          }
        });
        setConsigneeMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching consignee data:', error);
    }
  };

  // Fetch Season Data
  const fetchSeasonData = async () => {
    try {
      const payload = {
        "FLAG": "P",
        "TBLNAME": "SEASON",
        "FLDNAME": "SEASON_KEY",
        "ID": "",
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": ""
      };

      const response = await axiosInstance.post('/SEASON/GetSEASONDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const seasons = response.data.DATA.map(item => item.SEASON_NAME || '');
        setSeasonOptions(seasons);

        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.SEASON_NAME && item.SEASON_KEY) {
            mapping[item.SEASON_NAME] = item.SEASON_KEY;
          }
        });
        setSeasonMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching season data:', error);
    }
  };

  // Fetch Price List Data
  const fetchPriceListData = async () => {
    try {
      // Replace with actual API call if available
      const priceLists = ['Price List 1', 'Price List 2', 'Price List 3'];
      setPriceListOptions(priceLists);
    } catch (error) {
      console.error('Error fetching price list data:', error);
    }
  };

  // Fetch Merchandiser Data
  const fetchMerchandiserData = async () => {
    try {
      const payload = {
        "FLAG": "MECH"
      };

      const response = await axiosInstance.post('/USERS/GetUserLoginDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const merchandisers = response.data.DATA.map(item => item.USER_NAME || '');
        setMerchandiserOptions(merchandisers);

        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.USER_NAME && item.USER_ID) {
            mapping[item.USER_NAME] = item.USER_ID;
          }
        });
        setMerchandiserMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching merchandiser data:', error);
    }
  };

  // Initialize all dropdown data
  useEffect(() => {
    fetchPartiesByName();
    fetchBrokerData();
    fetchSalespersonData();
    fetchConsigneeData();
    fetchSeasonData();
    fetchTransporterData();
    fetchPriceListData();
    fetchMerchandiserData();
    fetchOrderTypeData();
  }, []);

  // Set default order type to "Sales And Work-Order" when component mounts
  useEffect(() => {
    if (!formData.Order_Type) {
      setFormData(prev => ({
        ...prev,
        Order_Type: "Sales And Work-Order",
        ORDBK_TYPE: "2"
      }));
    }
  }, []);

  useEffect(() => {
    // Handle GST Type when formData changes (for retrieved data)
    if (formData.GST_TYPE) {
      if (formData.GST_TYPE === "STATE" || formData.GST_TYPE === "S") {
        setGstType('state');
      } else if (formData.GST_TYPE === "IGST" || formData.GST_TYPE === "I") {
        setGstType('igst');
      }
    }
  }, [formData.GST_TYPE]);

  // Set today's date for all date fields when component mounts or mode changes to add
  useEffect(() => {
    if (mode === 'add') {
      const todayDate = getTodayDate();
      setFormData(prev => ({
        ...prev,
        ORDER_DATE: todayDate,
        ORD_REF_DT: todayDate,
        DLV_DT: todayDate,
        ORG_DLV_DT: todayDate
      }));
    }
  }, [mode]);

  // Auto-population effects
  useEffect(() => {
    // Auto-populate shipping party when party is selected
    if (formData.Party && !formData.SHIPPING_PARTY) {
      setFormData(prev => ({
        ...prev,
        SHIPPING_PARTY: formData.Party,
        SHP_PARTY_KEY: formData.PARTY_KEY
      }));
    }
  }, [formData.Party]);

  useEffect(() => {
    // Auto-populate shipping place when branch is selected  
    if (formData.Branch && !formData.SHIPPING_PLACE) {
      setFormData(prev => ({
        ...prev,
        SHIPPING_PLACE: formData.Branch,
        SHP_PARTYDTL_ID: formData.PARTYDTL_ID
      }));
    }
  }, [formData.Branch]);

  // Load data when formData changes (for edit mode)
  useEffect(() => {
    if (formData.PARTY_KEY && partyMapping[formData.PARTY_KEY]) {
      const partyName = partyMapping[formData.PARTY_KEY];
      setFormData(prev => ({ ...prev, Party: partyName }));
      fetchPartyDetails(formData.PARTY_KEY);
    }

    if (formData.BROKER_KEY && brokerMapping[formData.BROKER_KEY]) {
      const brokerName = brokerMapping[formData.BROKER_KEY];
      setFormData(prev => ({ ...prev, Broker: brokerName }));
    }

    if (formData.BROKER1_KEY && broker1Mapping[formData.BROKER1_KEY]) {
      const broker1Name = broker1Mapping[formData.BROKER1_KEY];
      setFormData(prev => ({ ...prev, BROKER1: broker1Name }));
    }

    if (formData.SALEPERSON1_KEY && salesperson1Mapping[formData.SALEPERSON1_KEY]) {
      const salesperson1Name = salesperson1Mapping[formData.SALEPERSON1_KEY];
      setFormData(prev => ({ ...prev, SALESPERSON_1: salesperson1Name }));
    }

    if (formData.SALEPERSON2_KEY && salesperson2Mapping[formData.SALEPERSON2_KEY]) {
      const salesperson2Name = salesperson2Mapping[formData.SALEPERSON2_KEY];
      setFormData(prev => ({ ...prev, SALESPERSON_2: salesperson2Name }));
    }

    if (formData.DISTBTR_KEY && consigneeMapping[formData.DISTBTR_KEY]) {
      const consigneeName = consigneeMapping[formData.DISTBTR_KEY];
      setFormData(prev => ({ ...prev, CONSIGNEE: consigneeName }));
    }

    if (formData.CURR_SEASON_KEY && seasonMapping[formData.CURR_SEASON_KEY]) {
      const seasonName = seasonMapping[formData.CURR_SEASON_KEY];
      setFormData(prev => ({ ...prev, SEASON: seasonName }));
    }

    if (formData.TRSP_KEY && transporterMapping[formData.TRSP_KEY]) {
      const transporterName = transporterMapping[formData.TRSP_KEY];
      setFormData(prev => ({ ...prev, Transporter: transporterName }));
    }

    if (formData.SHP_PARTY_KEY && partyMapping[formData.SHP_PARTY_KEY]) {
      const shippingPartyName = partyMapping[formData.SHP_PARTY_KEY];
      setFormData(prev => ({ ...prev, SHIPPING_PARTY: shippingPartyName }));
    }

    if (formData.SHP_PARTYDTL_ID && branchMapping[formData.SHP_PARTYDTL_ID]) {
      const shippingPlaceName = branchMapping[formData.SHP_PARTYDTL_ID];
      setFormData(prev => ({ ...prev, SHIPPING_PLACE: shippingPlaceName }));
    }

    if (formData.MERCHANDISER_ID && merchandiserMapping[formData.MERCHANDISER_ID]) {
      const merchandiserName = merchandiserMapping[formData.MERCHANDISER_ID];
      setFormData(prev => ({ ...prev, MERCHANDISER_NAME: merchandiserName }));
    }

  }, [
    formData.PARTY_KEY, formData.BROKER_KEY, formData.BROKER1_KEY,
    formData.SALEPERSON1_KEY, formData.SALEPERSON2_KEY, formData.DISTBTR_KEY,
    formData.CURR_SEASON_KEY, formData.TRSP_KEY, formData.SHP_PARTY_KEY, formData.SHP_PARTYDTL_ID,
    formData.MERCHANDISER_ID,
    partyMapping, brokerMapping, broker1Mapping, salesperson1Mapping,
    salesperson2Mapping, consigneeMapping, seasonMapping, transporterMapping, branchMapping,
    merchandiserMapping
  ]);

  // Helper function to parse date from string
  const parseDateFromString = (dateString) => {
    if (!dateString) return null;
    try {
      if (dateString.includes('/')) {
        return parse(dateString, 'dd/MM/yyyy', new Date());
      }
      return new Date(dateString);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "GST_APPL") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // If GST is enabled and party details are available, fetch GST type
      if (value === "Y" && formData.PARTYDTL_ID && formData.SHP_PARTYDTL_ID) {
        fetchGSTType(formData.PARTYDTL_ID, formData.SHP_PARTYDTL_ID);
      } else if (value === "N") {
        // Reset GST type when GST is disabled
        setGstType('state');
        setFormData(prev => ({
          ...prev,
          GST_TYPE: ""
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAutoCompleteChange = (name, value) => {
    console.log(`AutoComplete Change - Field: ${name}, Value: ${value}`);

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If party is selected, fetch branches, auto-select shipping party, and fetch party details
    if (name === "Party" && value && partyMapping[value]) {
      const partyKey = partyMapping[value];
      console.log(`Party selected: ${value}, Party Key: ${partyKey}`);



      // Fetch branches for the selected party
      fetchPartyDetails(partyKey);

      // Fetch party details for auto-population
      fetchPartyDetailsForAutoFill(partyKey);

      setFormData(prev => ({
        ...prev,
        PARTY_KEY: partyKey,
        Party: value,
        // Only auto-populate shipping party if it's empty or same as current party
        SHIPPING_PARTY: prev.SHIPPING_PARTY === prev.Party ? value : prev.SHIPPING_PARTY,
        // Don't auto-set shipping party key if shipping party is different
        SHP_PARTY_KEY: prev.SHIPPING_PARTY === prev.Party ? partyKey : prev.SHP_PARTY_KEY,
        // Branch will be auto-selected in fetchPartyDetails
      }));
    }

    // If branch is selected, only auto-select shipping place if it's currently empty or same as branch
    // If branch is selected, auto-update shipping place
    if (name === "Branch" && value) {
      const branchId = branchMapping[value];
      console.log(`Branch selected: ${value}, Branch ID: ${branchId}`);

      setFormData(prev => ({
        ...prev,
        PARTYDTL_ID: branchId,
        Branch: value,
        // AUTO-UPDATE: Always update shipping place when branch changes
        SHIPPING_PLACE: value,
        SHP_PARTYDTL_ID: branchId
      }));

      // NEW: Fetch GST type when branch is selected and GST is enabled
      if (formData.GST_APPL === "Y" && branchId) {
        const shipPartyDtlId = formData.SHP_PARTYDTL_ID || branchId;
        fetchGSTType(branchId, shipPartyDtlId);
      }
    }

    // Handle shipping party selection separately
    if (name === "SHIPPING_PARTY" && value) {
      const shippingPartyKey = partyMapping[value];
      console.log(`Shipping Party selected: ${value}, Key: ${shippingPartyKey}`);

      if (shippingPartyKey) {
        setFormData(prev => ({
          ...prev,
          SHP_PARTY_KEY: shippingPartyKey,
          SHIPPING_PARTY: value,
          // Clear shipping place when shipping party changes
          SHIPPING_PLACE: "",
          SHP_PARTYDTL_ID: 0
        }));

        // Fetch branches for the selected shipping party
        fetchShippingPartyDetails(shippingPartyKey);
      }
    }

    // Handle shipping place selection
    if (name === "SHIPPING_PLACE" && value) {
      const shippingPlaceId = branchMapping[value];
      console.log(`Shipping Place selected: ${value}, ID: ${shippingPlaceId}`);

      if (shippingPlaceId) {
        setFormData(prev => ({
          ...prev,
          SHP_PARTYDTL_ID: shippingPlaceId,
          SHIPPING_PLACE: value
        }));

        // NEW: Fetch GST type when shipping place is selected and GST is enabled
        if (formData.GST_APPL === "Y" && formData.PARTYDTL_ID) {
          fetchGSTType(formData.PARTYDTL_ID, shippingPlaceId);
        }
      }
    }

    // Update corresponding key fields for other dropdowns
    const keyMappings = {
      "Broker": ["BROKER_KEY", brokerMapping],
      "BROKER1": ["BROKER1_KEY", broker1Mapping],
      "SALESPERSON_1": ["SALEPERSON1_KEY", salesperson1Mapping],
      "SALESPERSON_2": ["SALEPERSON2_KEY", salesperson2Mapping],
      "CONSIGNEE": ["DISTBTR_KEY", consigneeMapping],
      "SEASON": ["CURR_SEASON_KEY", seasonMapping],
      "Transporter": ["TRSP_KEY", transporterMapping],
      "Order_Type": ["ORDBK_TYPE", orderTypeMapping],
      "MERCHANDISER_NAME": ["MERCHANDISER_ID", merchandiserMapping],
      "PRICE_LIST": ["PRICELIST_KEY", {}]
    };

    if (keyMappings[name] && value) {
      const [keyField, mapping] = keyMappings[name];
      if (mapping[value]) {
        setFormData(prev => ({
          ...prev,
          [keyField]: mapping[value]
        }));
      }
    }

    // Handle Order Type selection
    if (name === "Order_Type" && value) {
      const orderTypeKey = orderTypeMapping[value] || "0";
      setFormData(prev => ({
        ...prev,
        ORDBK_TYPE: orderTypeKey
      }));
    }
  };

  // In Stepper1 component
  const handleShippingPartyChange = async (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If shipping party is selected, fetch its branches for shipping place
    if (name === "SHIPPING_PARTY" && value && partyMapping[value]) {
      const partyKey = partyMapping[value];
      setFormData(prev => ({
        ...prev,
        SHP_PARTY_KEY: partyKey,
        SHIPPING_PLACE: "" // Clear previous shipping place
      }));

      // Fetch branches for the selected shipping party
      await fetchShippingPartyDetails(partyKey);
    }
  };

  // Fetch branches for shipping party
  const fetchShippingPartyDetails = async (partyKey) => {
    if (!partyKey) return;

    try {
      const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
        PARTY_KEY: partyKey
      });

      console.log('Shipping Party Branches API Response:', response.data);

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const branches = response.data.DATA.map(item => item.PLACE || '');
        setShippingPlaceOptions(branches);

        // Update branch mapping for shipping party
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.PLACE && item.PARTYDTL_ID) {
            mapping[item.PLACE] = item.PARTYDTL_ID;
          }
        });

        // Auto-select the first branch if available
        if (branches.length > 0) {
          const firstBranch = branches[0];
          const firstBranchId = mapping[firstBranch];

          setFormData(prev => ({
            ...prev,
            SHIPPING_PLACE: firstBranch,
            SHP_PARTYDTL_ID: firstBranchId
          }));

          // NEW: Fetch GST type when shipping party branch is selected and GST is enabled
          if (formData.GST_APPL === "Y" && formData.PARTYDTL_ID) {
            fetchGSTType(formData.PARTYDTL_ID, firstBranchId);
          }
        }
      } else {
        setShippingPlaceOptions([]);
      }
    } catch (error) {
      console.error("Error fetching shipping party details:", error);
      setShippingPlaceOptions([]);
    }
  };

  const handleChangeStatus = (event) => {
    const { name, checked } = event.target;
    const updatedStatus = checked ? "1" : "0";

    setFormData(prev => ({
      ...prev,
      [name]: updatedStatus
    }));
  };

  const handleDateChange = (date, fieldName) => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      setFormData(prev => ({
        ...prev,
        [fieldName]: formattedDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  // SIMPLIFIED VALIDATION - Only Party, Order No, and Order Date
  const getFieldError = (fieldName) => {
    if (!showValidationErrors) return '';

    const requiredFields = {
      'Party': 'Party',
      'ORDER_NO': 'Order No',
      'ORDER_DATE': 'Order Date'
    };

    if (requiredFields[fieldName] && !formData[fieldName]) {
      return `${requiredFields[fieldName]} is required`;
    }
    return '';
  };

  return (
    <Box>
      <ToastContainer />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, sm: 1.5, md: 0.7 },
          marginInline: { xs: '5%', sm: '5%', md: '5%' }
        }}
      >
        {/* Main Details Radio Group */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            gap: { xs: 1, sm: 1, md: 2 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '25%' } }}>

            <RadioGroup
              row
              name="MAIN_DETAILS"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData.MAIN_DETAILS || "G"}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel
                disabled={isFormDisabled}
                value="G"
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>General</Typography>}
              />
              <FormControlLabel
                disabled={isFormDisabled}
                value="L"
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Lot Wise</Typography>}
              />
            </RadioGroup>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '50%' } }}>
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">GST Apply</FormLabel>
            <RadioGroup
              row
              name="GST_APPL"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData.GST_APPL || "N"}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel
                disabled={isFormDisabled}
                value="Y"
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>}
              />
              <FormControlLabel
                disabled={isFormDisabled}
                value="N"
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>No</Typography>}
              />
              <FormControlLabel
                disabled={formData.GST_APPL !== "Y"}
                value="state"
                control={<Radio
                  sx={{ transform: 'scale(0.6)', padding: '2px' }}
                  checked={gstType === 'state' && formData.GST_APPL === "Y"}
                  onChange={() => {
                    setGstType('state');
                    setFormData(prev => ({ ...prev, GST_TYPE: "STATE" }));
                  }}
                />}
                label={<Typography sx={{ fontSize: '12px' }}>State(CGST & SGST)</Typography>}
              />
              <FormControlLabel
                disabled={formData.GST_APPL !== "Y"}
                value="igst"
                control={<Radio
                  sx={{ transform: 'scale(0.6)', padding: '2px' }}
                  checked={gstType === 'igst' && formData.GST_APPL === "Y"}
                  onChange={() => {
                    setGstType('igst');
                    setFormData(prev => ({ ...prev, GST_TYPE: "IGST" }));
                  }}
                />}
                label={<Typography sx={{ fontSize: '12px' }}>IGST</Typography>}
              />
            </RadioGroup>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '25%' } }}>
  <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Select Details</FormLabel>
 <RadioGroup
  row
  name="detailMode"
  onChange={(e) => setDetailMode(e.target.value)}
  disabled={isFormDisabled}
  value={detailMode}
  sx={{ margin: '5px 0px 0px 0px' }}
>
    <FormControlLabel
      disabled={isFormDisabled}
      value="style"
      control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
      label={<Typography sx={{ fontSize: '12px' }}>Style</Typography>}
    />
    <FormControlLabel
      disabled={isFormDisabled}
      value="barcode"
      control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
      label={<Typography sx={{ fontSize: '12px' }}>Barcode</Typography>}
    />
  </RadioGroup>
</Box>
        </Box>

        {/* Series, Last Ord No, Order No, Date Row */}
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <TextField
              label="Series"
              variant="filled"
              fullWidth
              onChange={handleSeriesChange}
              value={formData.SERIES || ""}
              name="SERIES"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '0px 0px',
                  paddingTop: '8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <AutoVibe
              id="Order Type"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={orderTypeOptions}
              label="Order Type"
              name="Order_Type"
              value={formData.Order_Type || "Sales And Work-Order"}
              onChange={(event, value) => handleAutoCompleteChange("Order_Type", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              label="Last Pack No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.LAST_ORD_NO || ""}
              name="LAST_ORD_NO"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '0px 0px',
                  paddingTop: '8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              label="Packing No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.ORDER_NO || ""}
              name="ORDER_NO"
              disabled={isFormDisabled}
              sx={{
                ...textInputSx,
                '& .MuiFilledInput-root': {
                  ...textInputSx['& .MuiFilledInput-root'],
                  border: getFieldError('ORDER_NO') ? '1px solid #f44336' : '1px solid #e0e0e0',
                }
              }}
              inputProps={{
                style: {
                  padding: '0px 0px',
                  paddingTop: '8px',
                  fontSize: '12px',
                },
              }}
              error={!!getFieldError('ORDER_NO')}
              helperText={getFieldError('ORDER_NO')}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <AutoVibe
              id="SEASON"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={seasonOptions}
              label="Season"
              name="SEASON"
              value={formData.SEASON || ""}
              onChange={(event, value) => handleAutoCompleteChange("SEASON", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '0px 0px',
                  paddingTop: '8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Order Date"
                value={parseDateFromString(formData.ORDER_DATE)}
                onChange={(date) => handleDateChange(date, "ORDER_DATE")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    size: "small",
                    error: !!getFieldError('ORDER_DATE'),
                    helperText: getFieldError('ORDER_DATE'),
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: 38,
                        fontSize: '15px',
                        borderRadius: '4px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px 14px',
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '15px',
                        color: '#666',
                        transform: 'translate(14px, 9px) scale(1)',
                        '&.Mui-focused, &.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                        borderWidth: '1px',
                      },
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f44336',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        {/* Party Ord No, Season, Order Ref Date, Enq No, Manual WSP Row */}
        <Grid container spacing={1}
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }} >
            <TextField
              label="Party Ord No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.PARTY_ORD_NO || ""}
              disabled={isFormDisabled}
              name="PARTY_ORD_NO"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
              }}
            />
          </Grid>

          {/* Ord Ref Dt DatePicker */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ord Ref Dt"
                value={parseDateFromString(formData.ORD_REF_DT)}
                onChange={(date) => handleDateChange(date, "ORD_REF_DT")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    size: "small",
                    error: !!getFieldError('ORD_REF_DT'),
                    helperText: getFieldError('ORD_REF_DT'),
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: 38,
                        fontSize: '15px',
                        borderRadius: '4px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px 14px',
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '15px',
                        color: '#666',
                        transform: 'translate(14px, 9px) scale(1)',
                        '&.Mui-focused, &.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                        borderWidth: '1px',
                      },
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f44336',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Enq No TextField */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <TextField
              label="Enq No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.ENQ_NO || ""}
              disabled={isFormDisabled}
              name="ENQ_NO"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
              }}
            />
          </Grid>

          {/* Delivery Date DatePicker */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Delivery Date"
                value={parseDateFromString(formData.DLV_DT)}
                onChange={(date) => handleDateChange(date, "DLV_DT")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined", // Change to outlined variant
                    size: "small", // Match size
                    error: !!getFieldError('DLV_DT'),
                    helperText: getFieldError('DLV_DT'),
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: 38,
                        fontSize: '15px',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        paddingRight: '36px',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px 14px',
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '15px',
                        color: '#666',
                        transform: 'translate(14px, 9px) scale(1)',
                        '&.Mui-focused, &.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0', // Light grey border by default
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50', // Green border on hover
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50', // Green border when focused
                        borderWidth: '1px',
                      },
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f44336', // Red border on error
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Quote No TextField */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <TextField
              label="Quote No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.QUOTE_NO || ""}
              disabled={isFormDisabled}
              name="QUOTE_NO"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Party Branch, Rack_Min, Quote No, Shipping Party Row */}
        <Grid container spacing={1}
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
        >
          {/* Party AutoVibe */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }} >
            <AutoVibe
              id="Party"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={partyOptions}
              label="Party"
              name="Party"
              value={formData.Party || ""}
              onChange={(event, value) => handleAutoCompleteChange("Party", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  border: getFieldError('Party') ? '1px solid #f44336' : '1px solid #e0e0e0',
                  paddingTop: '16px !important',
                },
              }}
              minWidth={300}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              error={!!getFieldError('Party')}
              helperText={getFieldError('Party')}
            />
          </Grid>

          {/* Shipping Party AutoVibe */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <AutoVibe
              id="SHIPPING_PARTY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={shippingPartyOptions}
              label="Shipping Party"
              name="SHIPPING_PARTY"
              value={formData.SHIPPING_PARTY || ""}
              onChange={(event, value) => handleShippingPartyChange("SHIPPING_PARTY", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              minWidth={300}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          {/* Div Place TextField */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <TextField
              label="Div Place"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.DIV_PLACE || ""}
              disabled={isFormDisabled}
              name="DIV_PLACE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
              }}
            />
          </Grid>

          {/* Address TextField */}
          <Grid size={{ xs: 12, sm: 6, md: 5 }} >
            <TextField
              label="Address"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.Address || ""}
              disabled={isFormDisabled}
              name="Address"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Div Place, A.R.Sales, Shipping Place, PriceList Row */}
        <Grid container spacing={1}
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }} >
            <AutoVibe
              id="Branch"
              disabled={isFormDisabled || loadingBranches}
              getOptionLabel={(option) => option || ''}
              options={branchOptions}
              label={loadingBranches ? "Loading branches..." : "Branch"}
              name="Branch"
              value={formData.Branch || ""}
              onChange={(event, value) => handleAutoCompleteChange("Branch", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              loading={loadingBranches}
            />
          </Grid>

          {/* Shipping Place AutoVibe */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <AutoVibe
              id="SHIPPING_PLACE"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={shippingPlaceOptions}
              label="Shipping Place"
              name="SHIPPING_PLACE"
              value={formData.SHIPPING_PLACE || ""}
              onChange={(event, value) => handleAutoCompleteChange("SHIPPING_PLACE", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          {/* Price List AutoVibe */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <AutoVibe
              id="PRICE_LIST"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={priceListOptions}
              label="PriceList"
              name="PRICE_LIST"
              value={formData.PRICE_LIST || ""}
              onChange={(event, value) => handleAutoCompleteChange("PRICE_LIST", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          {/* Comm % TextField */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <TextField
              label="Comm %"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.Comm || ""}
              disabled={isFormDisabled}
              name="Comm"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
                type: 'number',
                step: '0.01',
                min: '0'
              }}
            />
          </Grid>

          {/* BOMNO TextField */}
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <TextField
              label="BOMNO"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.BOMNO || ""}
              disabled={isFormDisabled}
              name="BOMNO"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Broker Transporter, B-East-II, New Addr, Amount Row */}
        <Grid container spacing={1}
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }} >
            <AutoVibe
              id="Broker"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={brokerOptions}
              label="Broker"
              name="Broker"
              value={formData.Broker || ""}
              onChange={(event, value) => handleAutoCompleteChange("Broker", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <AutoVibe
              id="Transporter"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={transporterOptions}
              label="Transporter"
              name="Transporter"
              value={formData.Transporter || ""}
              onChange={(event, value) => handleAutoCompleteChange("Transporter", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              minWidth={300}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              label="Amount"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AMOUNT || ""}
              disabled={isFormDisabled}
              name="AMOUNT"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
                type: 'number',
                step: '0.01',
                min: '0'
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <TextField
              label="Gross Amount"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AMOUNT_1 || ""}
              disabled={isFormDisabled}
              name="AMOUNT_1"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
                type: 'number',
                step: '0.01',
                min: '0'
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <TextField
              label="Round Off(Net Amt)"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.Net_Amt || ""}
              disabled={isFormDisabled}
              name="Net_Amt"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
                type: 'number',
                step: '0.01',
                min: '0'
              }}
            />
          </Grid>
        </Grid>

        {/* Gross Amt, All New, New Comm, 0.00 Row */}
        <Grid container spacing={1}
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }} >
            <AutoVibe
              id="Broker1"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={broker1Options}
              label="Broker1"
              name="BROKER1"
              value={formData.BROKER1 || ""}
              onChange={(event, value) => handleAutoCompleteChange("BROKER1", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Production Dt"
                value={parseDateFromString(formData.ORD_REF_DT)}
                onChange={(date) => handleDateChange(date, "ORD_REF_DT")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    size: "small",
                    error: !!getFieldError('ORD_REF_DT'),
                    helperText: getFieldError('ORD_REF_DT'),
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: 38,
                        fontSize: '15px',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        paddingRight: '36px',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px 14px',
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '15px',
                        color: '#666',
                        transform: 'translate(14px, 9px) scale(1)',
                        '&.Mui-focused, &.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                        borderWidth: '1px',
                      },
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f44336',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>

          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Org Delivery Date"
                value={parseDateFromString(formData.ORG_DLV_DT)}
                onChange={(date) => handleDateChange(date, "ORG_DLV_DT")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    size: "small",
                    error: !!getFieldError('ORG_DLV_DT'),
                    helperText: getFieldError('ORG_DLV_DT'),
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: 38,
                        fontSize: '15px',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        paddingRight: '36px',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      },
                      '& .MuiInputBase-input': {
                        padding: '8px 14px',
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '15px',
                        color: '#666',
                        transform: 'translate(14px, 9px) scale(1)',
                        '&.Mui-focused, &.MuiFormLabel-filled': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                        borderWidth: '1px',
                      },
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f44336',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <AutoVibe
              id="Consignee"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={consigneeOptions}
              label="Consignee"
              name="CONSIGNEE"
              value={formData.CONSIGNEE || ""}
              onChange={(event, value) => handleAutoCompleteChange("CONSIGNEE", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <AutoVibe
              id="ord_event"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Order Event"
              name="ord_event"
              value={formData.ord_event || ""}
              onChange={(event, value) => handleAutoCompleteChange("ord_event", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Salesperson 2, New, ... Email, Rupees Row */}
        <Grid container spacing={1}
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }} >
            <AutoVibe
              id="SALESPERSON_1"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={salesperson1Options}
              label="Salesperson 1"
              name="SALESPERSON_1"
              value={formData.SALESPERSON_1 || ""}
              onChange={(event, value) => handleAutoCompleteChange("SALESPERSON_1", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              minWidth={300}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <AutoVibe
              id="SALESPERSON_2"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={salesperson2Options}
              label="Salesperson 2"
              name="SALESPERSON_2"
              value={formData.SALESPERSON_2 || ""}
              onChange={(event, value) => handleAutoCompleteChange("SALESPERSON_2", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              minWidth={300}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }} >
            <TextField
              label="Email"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.EMAIL || ""}
              disabled={isFormDisabled}
              name="EMAIL"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <TextField
              label="Currency"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.Currency || ""}
              disabled={isFormDisabled}
              name="Currency"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
                type: 'text'
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }} >
            <TextField
              label="Ex Rate"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.EX_RATE || ""}
              disabled={isFormDisabled}
              name="EX_RATE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
                type: 'number',
                step: '0.0001',
                min: '0'
              }}
            />
          </Grid>
        </Grid>

        {/* Remark Status, Short Close, 1.00 Row */}
        <Grid container spacing={1}
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }} >
            <AutoVibe
              id="MERCHANDISER_NAME"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={merchandiserOptions}
              label="MERCHANDISER"
              name="MERCHANDISER_NAME"
              value={formData.MERCHANDISER_NAME || ""}
              onChange={(event, value) => handleAutoCompleteChange("MERCHANDISER_NAME", value)}
              sx={{
                ...DropInputSx,
                '& .MuiFilledInput-root': {
                  ...DropInputSx['& .MuiFilledInput-root'],
                  paddingTop: '16px !important',
                },
              }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>

          {/* Remark TextField */}
          <Grid size={{ xs: 12, sm: 6, md: 9 }} >
            <TextField
              label="Remark"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.REMARK_STATUS || ""}
              disabled={isFormDisabled}
              name="REMARK_STATUS"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 0px',
                  marginTop: '10px',
                  fontSize: '12px'
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1} direction={{ xs: 'column', sm: 'row', md: 'row' }} flexWrap="wrap">
          {/* Delivery Schedule Radio Group */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormLabel
                sx={{
                  marginRight: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'black',
                  whiteSpace: 'nowrap',
                }}
                component="legend"
              >
                Delivery Schedule
              </FormLabel>
              <RadioGroup
                row
                name="Delivery_Shedule"
                onChange={handleInputChange}
                disabled={isFormDisabled}
                value={formData.Delivery_Shedule || 'comman'}
              >
                <FormControlLabel
                  disabled={isFormDisabled}
                  value="comman"
                  control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Comman</Typography>}
                />
                <FormControlLabel
                  disabled={isFormDisabled}
                  value="style"
                  control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Style Wise</Typography>}
                />
              </RadioGroup>
            </Box>
          </Grid>

          {/* Order TNA Radio Group */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormLabel
                sx={{
                  marginRight: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'black',
                  whiteSpace: 'nowrap',
                }}
                component="legend"
              >
                Order TNA
              </FormLabel>
              <RadioGroup
                row
                name="Order_TNA"
                onChange={handleInputChange}
                disabled={isFormDisabled}
                value={formData.Order_TNA || 'ItemWise'}
              >
                <FormControlLabel
                  disabled={isFormDisabled}
                  value="ItemWise"
                  control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>ItemWise</Typography>}
                />
                <FormControlLabel
                  disabled={isFormDisabled}
                  value="SizeWise"
                  control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>SizeWise</Typography>}
                />
              </RadioGroup>
            </Box>
          </Grid>

          {/* Status Radio Group */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormLabel
                sx={{
                  marginRight: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'black',
                  whiteSpace: 'nowrap',
                }}
                component="legend"
              >
                Status
              </FormLabel>
              <RadioGroup
                row
                name="Status"
                onChange={handleInputChange}
                disabled={isFormDisabled}
                value={formData.Status || 'O'}
              >
                <FormControlLabel
                  disabled={isFormDisabled}
                  value="O"
                  control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Open</Typography>}
                />
                <FormControlLabel
                  disabled={isFormDisabled}
                  value="C"
                  control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Cancel</Typography>}
                />
                <FormControlLabel
                  disabled={isFormDisabled}
                  value="S"
                  control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Short</Typography>}
                />
              </RadioGroup>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Stepper1;