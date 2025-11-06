'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
} from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import { getFormMode } from '../../../../lib/helpers';

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
  // Receive mappings as props
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
  showSnackbar
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
  
  // State to track loading for branch API
  const [loadingBranches, setLoadingBranches] = useState(false);

  const textInputSx = {
    '& .MuiInputBase-root': {
      height: 36,
      fontSize: '14px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '14px',
      top: '-8px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      overflow: 'hidden',
      height: 36,
      fontSize: '14px',
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '10px 12px !important',
      fontSize: '14px !important',
      lineHeight: '1.4',
    },
  };

  const DropInputSx = {
    '& .MuiInputBase-root': {
      height: 36,
      fontSize: '14px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '14px',
      top: '-4px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      overflow: 'hidden',
      height: 36,
      fontSize: '14px',
      paddingRight: '36px',
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '10px 12px',
      fontSize: '14px',
      lineHeight: '1.4',
    },
    '& .MuiAutocomplete-endAdornment': {
      top: '50%',
      transform: 'translateY(-50%)',
      right: '10px',
    },
  };

  const datePickerSx = {
    "& .MuiInputBase-root": {
      height: "32px", 
    },
    "& .MuiInputBase-input": {
      padding: "4px 8px", 
      fontSize: "12px",
    },
    "& .MuiInputLabel-root": {
      top: "-6px", 
      fontSize: "12px",
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

  // Fetch Party Branches - IMPROVED VERSION
  const fetchPartyDetails = async (partyKey) => {
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
        
        // Auto-select the first branch if available
        if (branches.length > 0) {
          const firstBranch = branches[0];
          const firstBranchId = mapping[firstBranch];
          
          setFormData(prev => ({
            ...prev,
            Branch: firstBranch,
            PARTYDTL_ID: firstBranchId,
            SHIPPING_PLACE: firstBranch,
            SHP_PARTYDTL_ID: firstBranchId
          }));
          
          console.log('Auto-selected branch:', firstBranch, 'with ID:', firstBranchId);
        }
      } else {
        setBranchOptions([]);
        setShippingPlaceOptions([]);
        // Clear branch related fields if no branches found
        setFormData(prev => ({
          ...prev,
          Branch: "",
          PARTYDTL_ID: 0,
          SHIPPING_PLACE: "",
          SHP_PARTYDTL_ID: 0
        }));
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

  // Fetch Order Type Data
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
        "PARTY_KEY": formData.PARTY_KEY || "",
        "PARTYDTL_ID": formData.PARTYDTL_ID || 0
      };

      const response = await axiosInstance.post('/ORDBK/GetOrdbkDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const orderTypes = response.data.DATA.map(item => item.ORDBK_NO || '');
        setOrderTypeOptions(orderTypes);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.ORDBK_NO && item.ORDBK_KEY) {
            mapping[item.ORDBK_NO] = item.ORDBK_KEY;
          }
        });
        setOrderTypeMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching order type data:', error);
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
    fetchOrderTypeData();
    fetchMerchandiserData();
  }, []);

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

  // Refresh order type data when party or branch changes
  useEffect(() => {
    if (formData.PARTY_KEY || formData.PARTYDTL_ID) {
      fetchOrderTypeData();
    }
  }, [formData.PARTY_KEY, formData.PARTYDTL_ID]);

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

    if (formData.ORDBK_KEY && orderTypeMapping[formData.ORDBK_KEY]) {
      const orderTypeName = orderTypeMapping[formData.ORDBK_KEY];
      setFormData(prev => ({ ...prev, Order_Type: orderTypeName }));
    }

    if (formData.MERCHANDISER_ID && merchandiserMapping[formData.MERCHANDISER_ID]) {
      const merchandiserName = merchandiserMapping[formData.MERCHANDISER_ID];
      setFormData(prev => ({ ...prev, MERCHANDISER_NAME: merchandiserName }));
    }

  }, [
    formData.PARTY_KEY, formData.BROKER_KEY, formData.BROKER1_KEY, 
    formData.SALEPERSON1_KEY, formData.SALEPERSON2_KEY, formData.DISTBTR_KEY,
    formData.CURR_SEASON_KEY, formData.TRSP_KEY, formData.SHP_PARTY_KEY, formData.SHP_PARTYDTL_ID,
    formData.ORDBK_KEY, formData.MERCHANDISER_ID,
    partyMapping, brokerMapping, broker1Mapping, salesperson1Mapping, 
    salesperson2Mapping, consigneeMapping, seasonMapping, transporterMapping, branchMapping,
    orderTypeMapping, merchandiserMapping
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enhanced handleAutoCompleteChange function - FIXED BRANCH ISSUE
  const handleAutoCompleteChange = (name, value) => {
    console.log(`AutoComplete Change - Field: ${name}, Value: ${value}`);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If party is selected, fetch branches and auto-select shipping party
    if (name === "Party" && value && partyMapping[value]) {
      const partyKey = partyMapping[value];
      console.log(`Party selected: ${value}, Party Key: ${partyKey}`);
      
      // Fetch branches for the selected party
      fetchPartyDetails(partyKey);
      
      setFormData(prev => ({
        ...prev,
        PARTY_KEY: partyKey,
        Party: value,
        SHIPPING_PARTY: value, // Auto-populate shipping party
        SHP_PARTY_KEY: partyKey, // Set shipping party key same as party key
        // Branch will be auto-selected in fetchPartyDetails
      }));
    }

    // If branch is selected, auto-select shipping place
    if (name === "Branch" && value) {
      const branchId = branchMapping[value];
      console.log(`Branch selected: ${value}, Branch ID: ${branchId}`);
      
      setFormData(prev => ({
        ...prev,
        PARTYDTL_ID: branchId,
        Branch: value,
        SHIPPING_PLACE: value,
        SHP_PARTYDTL_ID: branchId 
      }));
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
      "Order_Type": ["ORDBK_KEY", orderTypeMapping],
      "MERCHANDISER_NAME": ["MERCHANDISER_ID", merchandiserMapping]
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
  };

  const handleShippingPartyChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If shipping party is selected, fetch its branches for shipping place
    if (name === "SHIPPING_PARTY" && value && partyMapping[value]) {
      const partyKey = partyMapping[value];
      setFormData(prev => ({
        ...prev,
        SHP_PARTY_KEY: partyKey
      }));
      // Fetch branches for the selected shipping party
      fetchShippingPartyDetails(partyKey);
    }
  };

  // Fetch branches for shipping party
  const fetchShippingPartyDetails = async (partyKey) => {
    if (!partyKey) return;
    
    try {
      const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
        PARTY_KEY: partyKey
      });
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
        setBranchMapping(prev => ({ ...prev, ...mapping }));
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

 const getFieldError = (fieldName) => {
    if (!showValidationErrors) return '';
    
    const requiredFields = {
      'Party': 'Party',
      'SEASON': 'Season',
      'CONSIGNEE': 'Consignee',
      'Broker': 'Broker',
      'BROKER1': 'Broker1',
      'SALESPERSON_1': 'Salesperson 1',
      'SALESPERSON_2': 'Salesperson 2',
    };

    if (requiredFields[fieldName] && !formData[fieldName]) {
      return `${requiredFields[fieldName]} is required`;
    }
    return '';
  };

  return (
    <Box>
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
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">GST Appl.</FormLabel>
            <RadioGroup
              row
              name="GST_APPL"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData.GST_APPL || "Y"}
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
                disabled={isFormDisabled}
                value="Y" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>State(CGST & SGST)</Typography>} 
              />
              <FormControlLabel 
                disabled={isFormDisabled}
                value="N" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>IGST</Typography>} 
              />
            </RadioGroup>
          </Box>
          
        </Box>

        {/* Series, Last Ord No, Order No, Date Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '5%' } }}>
            <TextField
              label="Series"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.SERIES || ""}
              name="SERIES"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
           <Box sx={{ width: { xs: '100%', sm: '20%', md: '14%' } }}>
            <AutoVibe
              id="Order Type"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={orderTypeOptions}
              label="Order_Type"
              name="Order_Type"
              value={formData.Order_Type || ""}
              onChange={(event, value) => handleAutoCompleteChange("Order_Type", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <TextField
              label="Last Ord No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.LAST_ORD_NO || ""}
              name="LAST_ORD_NO"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <TextField
              label="Order No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.ORDER_NO || ""}
              name="ORDER_NO"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", sm: "20%", md: "15%" } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Order Date"
                value={parseDateFromString(formData.ORDER_DATE)}
                onChange={(date) => handleDateChange(date, "ORDER_DATE")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    sx: datePickerSx,
                    InputProps: {
                      sx: {
                        ...datePickerSx,
          '& .MuiFilledInput-root': {
            border: getFieldError('ORDER_DATE') ? '1px solid #f44336' : '1px solid #e0e0e0',
          },
                        height: "32px",
                      },
                    },
                    error: !!getFieldError('ORDER_DATE'),
                    helperText: getFieldError('ORDER_DATE')
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {/* Party Ord No, Season, Order Ref Date, Enq No, Manual WSP Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <AutoVibe
              id="SEASON"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={seasonOptions}
              label="Season"
              name="SEASON"
              value={formData.SEASON || ""}
              onChange={(event, value) => handleAutoCompleteChange("SEASON", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              error={!!getFieldError('SEASON')}
              helperText={getFieldError('SEASON')}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20%" } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ord Ref Dt"
                value={parseDateFromString(formData.ORD_REF_DT)}
                onChange={(date) => handleDateChange(date, "ORD_REF_DT")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    sx: datePickerSx,
                    InputProps: {
                      sx: {
                        height: "32px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20%" } }}>
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
                    variant: "filled",
                    sx: datePickerSx,
                    InputProps: {
                      sx: {
                                     ...datePickerSx,
          '& .MuiFilledInput-root': {
            border: getFieldError('DLV_DT') ? '1px solid #f44336' : '1px solid #e0e0e0',
          },
                        height: "32px",
                      },
                    },
                    error: !!getFieldError('DLV_DT'),
                    helperText: getFieldError('DLV_DT')
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "15%" } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>

        {/* Party Branch, Rack_Min, Quote No, Shipping Party Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' }}}>
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
    }
  }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              error={!!getFieldError('Party')}
              helperText={getFieldError('Party')}
            />
          </Box>

         <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <AutoVibe
              id="SHIPPING_PARTY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={shippingPartyOptions}
              label="Shipping Party"
              name="SHIPPING_PARTY"
              value={formData.SHIPPING_PARTY || ""}
              onChange={(event, value) => handleShippingPartyChange("SHIPPING_PARTY", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
        <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '36%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>

        {/* Div Place, A.R.Sales, Shipping Place, PriceList Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' }}}>
            <AutoVibe
              id="Branch"
              disabled={isFormDisabled || loadingBranches}
              getOptionLabel={(option) => option || ''}
              options={branchOptions}
              label={loadingBranches ? "Loading branches..." : "Branch"}
              name="Branch"
              value={formData.Branch || ""}
              onChange={(event, value) => handleAutoCompleteChange("Branch", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              loading={loadingBranches}
            />
          </Box>
          
          
         <Box sx={{ width: { xs: "100%", sm: "20%", md: "20%" } }}>
            <AutoVibe
              id="SHIPPING_PLACE"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={shippingPlaceOptions}
              label="Shipping Place"
              name="SHIPPING_PLACE"
              value={formData.SHIPPING_PLACE || ""}
              onChange={(event, value) => handleAutoCompleteChange("SHIPPING_PLACE", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <TextField
              label="PriceList"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.PRICE_LIST || ""}
              disabled={isFormDisabled}
              name="PRICE_LIST"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          
        </Box>

        {/* Broker Transporter, B-East-II, New Addr, Amount Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
      border: getFieldError('Broker') ? '1px solid #f44336' : '1px solid #e0e0e0',
    }
  }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              error={!!getFieldError('Broker')}
              helperText={getFieldError('Broker')}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <AutoVibe
              id="Transporter"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={transporterOptions}
              label="Transporter"
              name="Transporter"
              value={formData.Transporter || ""}
              onChange={(event, value) => handleAutoCompleteChange("Transporter", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
           <Box sx={{ width: { xs: "100%", sm: "20%", md: "15%" } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>

        {/* Gross Amt, All New, New Comm, 0.00 Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>

          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20%" } }}>
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
      border: getFieldError('Broker1') ? '1px solid #f44336' : '1px solid #e0e0e0',
    }
  }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              error={!!getFieldError('BROKER1')}
              helperText={getFieldError('BROKER1')}
            />
          </Box>
        
        <Box sx={{ width: { xs: "100%", sm: "20%", md: "20%" } }}>
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
                    variant: "filled",
                    sx: datePickerSx,
                    InputProps: {
                      sx: {
                        height: "32px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
         <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <AutoVibe
              id="Consignee"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={consigneeOptions}
              label="Consignee"
              name="CONSIGNEE"
              value={formData.CONSIGNEE || ""}
              onChange={(event, value) => handleAutoCompleteChange("CONSIGNEE", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              error={!!getFieldError('CONSIGNEE')}
              helperText={getFieldError('CONSIGNEE')}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20%" } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Org Delivery Date"
                value={parseDateFromString(formData.ORG_DIL_DT)}
                onChange={(date) => handleDateChange(date, "ORG_DIL_DT")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    sx: datePickerSx,
                    InputProps: {
                      sx: {
                        height: "32px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

           <Box sx={{ width: { xs: '100%', sm: '20%', md: '15%' } }}>
            <AutoVibe
              id="ord_event"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Order Event"
              name="ord_event"
              value={formData.ord_event || ""}
              onChange={(event, value) => handleAutoCompleteChange("ord_event", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          
        </Box>

        {/* Salesperson 2, New, ... Email, Rupees Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
      border: getFieldError('SALESPERSON_1') ? '1px solid #f44336' : '1px solid #e0e0e0',
    }
  }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              error={!!getFieldError('SALESPERSON_1')}
              helperText={getFieldError('SALESPERSON_1')}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
      border: getFieldError('SALESPERSON_2') ? '1px solid #f44336' : '1px solid #e0e0e0',
    }
  }}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
              error={!!getFieldError('SALESPERSON_2')}
              helperText={getFieldError('SALESPERSON_2')}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20%" } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>

        {/* Remark Status, Short Close, 1.00 Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <AutoVibe
              id="MERCHANDISER_NAME"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={merchandiserOptions}
              label="MERCHANDISER"
              name="MERCHANDISER_NAME"
              value={formData.MERCHANDISER_NAME || ""}
              onChange={(event, value) => handleAutoCompleteChange("MERCHANDISER_NAME", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
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
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '21%' } }}>
            <FormLabel sx={{ margin: '7px 7px 0px 0px', fontSize: '14px', fontWeight: 'bold', color: 'black' }} component="legend">Delivery Shedule</FormLabel>
            <RadioGroup
              row
              name="Delivery_Shedule"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData.Delivery_Shedule || "Y"}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel 
                disabled={isFormDisabled}
                value="comman" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Comman</Typography>} 
              />
              <FormControlLabel 
                disabled={isFormDisabled}
                value="style" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Style Wise</Typography>} 
              />
            </RadioGroup>
          </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '21%' } }}>
            <FormLabel sx={{ margin: '7px 7px 0px 0px', fontSize: '14px', fontWeight: 'bold', color: 'black' }} component="legend">Order TNA</FormLabel>
            <RadioGroup
              row
              name="Order_TNA"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData.Delivery_Shedule || "Y"}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel 
                disabled={isFormDisabled}
                value="ItemWise" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>ItemWise</Typography>} 
              />
              <FormControlLabel 
                disabled={isFormDisabled}
                value="SizeWise" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>SizeWise</Typography>} 
              />
            </RadioGroup>
          </Box>
        </Box>

         <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
         
         <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '25%' } }}>
            <FormLabel sx={{ margin: '7px 14px 0px 0px', fontSize: '14px', fontWeight: 'bold', color: 'black' }} component="legend">Status</FormLabel>
            <RadioGroup
              row
              name="Status"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData.Status || "Y"}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel 
                disabled={isFormDisabled}
                value="O" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Open</Typography>} 
              />
              <FormControlLabel 
                disabled={isFormDisabled}
                value="C" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Cancel</Typography>} 
              />
              <FormControlLabel 
                disabled={isFormDisabled}
                value="S" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Short</Typography>} 
              />
            </RadioGroup>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Stepper1;