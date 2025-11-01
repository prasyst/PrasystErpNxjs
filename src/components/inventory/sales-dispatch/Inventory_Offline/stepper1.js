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
  setPartyMapping,
  setBranchMapping,
  setBrokerMapping,
  setBroker1Mapping,
  setSalesperson1Mapping,
  setSalesperson2Mapping,
  setConsigneeMapping,
  setSeasonMapping,
  setTransporterMapping
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
        
        // Create mapping for TRSP_NAME to TRSP_KEY
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

  // Fetch Party Data (Updated to also set shipping party options)
  const fetchPartiesByName = async (name = "") => {
    try {
      const response = await axiosInstance.post("Party/GetParty_By_Name", {
        PARTY_NAME: name
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const parties = response.data.DATA.map(item => item.PARTY_NAME || '');
        setPartyOptions(parties);
        setShippingPartyOptions(parties); // Set shipping party options same as parties
        
        // Create mapping for PARTY_NAME to PARTY_KEY
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

  // Fetch Party Branches (Updated to also set shipping place options)
  const fetchPartyDetails = async (partyKey) => {
    if (!partyKey) return;
    
    try {
      const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
        PARTY_KEY: partyKey
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const branches = response.data.DATA.map(item => item.PLACE || '');
        setBranchOptions(branches);
        setShippingPlaceOptions(branches); // Set shipping place options same as branches
        
        // Create mapping for PLACE to PARTYDTL_ID
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.PLACE && item.PARTYDTL_ID) {
            mapping[item.PLACE] = item.PARTYDTL_ID;
          }
        });
        setBranchMapping(mapping);
      } else {
        setBranchOptions([]);
        setShippingPlaceOptions([]);
      }
    } catch (error) {
      console.error("Error fetching party details:", error);
      setBranchOptions([]);
      setShippingPlaceOptions([]);
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

  // Fetch Season Data - IMPROVED VERSION
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

  // Initialize all dropdown data
  useEffect(() => {
    fetchPartiesByName();
    fetchBrokerData();
    fetchSalespersonData();
    fetchConsigneeData();
    fetchSeasonData();
    fetchTransporterData();
  }, []);

  // Load data when formData changes (for edit mode) - IMPROVED VERSION
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
      setFormData(prev => ({ ...prev, Broker1: broker1Name }));
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

  }, [
    formData.PARTY_KEY, formData.BROKER_KEY, formData.BROKER1_KEY, 
    formData.SALEPERSON1_KEY, formData.SALEPERSON2_KEY, formData.DISTBTR_KEY,
    formData.CURR_SEASON_KEY, formData.TRSP_KEY, formData.SHP_PARTY_KEY,
    partyMapping, brokerMapping, broker1Mapping, salesperson1Mapping, 
    salesperson2Mapping, consigneeMapping, seasonMapping, transporterMapping
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



// Add these auto-population effects in Stepper1.js
useEffect(() => {
  // Auto-populate shipping party when party is selected
  if (formData.Party && !formData.SHIPPING_PARTY) {
    setFormData(prev => ({
      ...prev,
      SHIPPING_PARTY: formData.Party,
      SHP_PARTY_KEY: formData.PARTY_KEY // Also set the key
    }));
  }
}, [formData.Party]);

useEffect(() => {
  // Auto-populate shipping place when branch is selected  
  if (formData.Branch && !formData.SHIPPING_PLACE) {
    setFormData(prev => ({
      ...prev,
      SHIPPING_PLACE: formData.Branch
    }));
  }
}, [formData.Branch]);

// Enhanced handleAutoCompleteChange function
const handleAutoCompleteChange = (name, value) => {
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  // If party is selected, fetch branches and auto-select shipping party
  if (name === "Party" && value && partyMapping[value]) {
    const partyKey = partyMapping[value];
    fetchPartyDetails(partyKey);
    setFormData(prev => ({
      ...prev,
      PARTY_KEY: partyKey,
      Party: value,
      SHIPPING_PARTY: value, // Auto-populate shipping party
      SHP_PARTY_KEY: partyKey, // Set shipping party key same as party key
      SHP_PARTYDTL_ID: prev.PARTYDTL_ID // Set shipping party detail ID same as branch ID
    }));
  }

  // If branch is selected, auto-select shipping place
  if (name === "Branch" && value) {
    const branchId = branchMapping[value];
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
    "Broker1": ["BROKER1_KEY", broker1Mapping], 
    "SALESPERSON_1": ["SALEPERSON1_KEY", salesperson1Mapping],
    "SALESPERSON_2": ["SALEPERSON2_KEY", salesperson2Mapping],
    "CONSIGNEE": ["DISTBTR_KEY", consigneeMapping],
    "SEASON": ["CURR_SEASON_KEY", seasonMapping],
    "Transporter": ["TRSP_KEY", transporterMapping]
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
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Main Details</FormLabel>
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

          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '25%' } }}>
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
            </RadioGroup>
          </Box>
        </Box>

        {/* Series, Last Ord No, Order No, Date Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
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

          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
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
                        height: "32px",
                      },
                    },
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
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
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
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
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
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
                        height: "32px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {/* Party Branch, Rack_Min, Quote No, Shipping Party Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '21.5%' }}}>
            <AutoVibe
              id="Party"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={partyOptions}
              label="Party"
              name="Party"
              value={formData.Party || ""}
              onChange={(event, value) => handleAutoCompleteChange("Party", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' }}}>
            <AutoVibe
              id="Branch"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={branchOptions}
              label="Branch"
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
            />
          </Box>

          
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "22.5%" } }}>
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
         <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <FormControlLabel
              control={<Checkbox name="RACK_MIN" size="small" checked={formData.RACK_MIN === "1"}
              onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Rack_Min"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <FormControlLabel
              control={<Checkbox name="REGISTERED_DEALER" size="small" checked={formData.REGISTERED_DEALER === "1"}
              onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Registered Dealer"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="A.R.Sales"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AR_SALES || ""}
              disabled={isFormDisabled}
              name="AR_SALES"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
         <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="May-2025"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.MAY_2025 || ""}
              disabled={isFormDisabled}
              name="MAY_2025"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <AutoVibe
              id="Broker"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={brokerOptions}
              label="Broker"
              name="Broker"
              value={formData.Broker || ""}
              onChange={(event, value) => handleAutoCompleteChange("Broker", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="B-East-II"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.B_EAST_II || ""}
              disabled={isFormDisabled}
              name="B_EAST_II"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <TextField
              label="New Addr"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.NEW_ADDR || ""}
              disabled={isFormDisabled}
              name="NEW_ADDR"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
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
        </Box>

        {/* Gross Amt, All New, New Comm, 0.00 Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Gross Amt"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.GROSS_AMT || ""}
              disabled={isFormDisabled}
              name="GROSS_AMT"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="All New"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.ALL_NEW || ""}
              disabled={isFormDisabled}
              name="ALL_NEW"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <TextField
              label="New Comm"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.NEW_COMM || ""}
              disabled={isFormDisabled}
              name="NEW_COMM"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="0.00"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AMOUNT_2 || ""}
              disabled={isFormDisabled}
              name="AMOUNT_2"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Net Amt"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.NET_AMT || ""}
              disabled={isFormDisabled}
              name="NET_AMT"
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

        {/* Consignee, E-ASM1[Brijnandan Kumar], Broker1, 35486.00 Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
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
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="E-ASM1"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.E_ASM1 || ""}
              disabled={isFormDisabled}
              name="E_ASM1"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <AutoVibe
              id="Broker1"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={broker1Options}
              label="Broker1"
              name="Broker1"
              value={formData.Broker1 || ""}
              onChange={(event, value) => handleAutoCompleteChange("Broker1", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Net Amount"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AMOUNT_3 || ""}
              disabled={isFormDisabled}
              name="AMOUNT_3"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Currency"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.CURRENCY || ""}
              disabled={isFormDisabled}
              name="CURRENCY"
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

        {/* Salesperson 2, New, ... Email, Rupees Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <AutoVibe
              id="SALESPERSON_1"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={salesperson1Options}
              label="Salesperson 1"
              name="SALESPERSON_1"
              value={formData.SALESPERSON_1 || ""}
              onChange={(event, value) => handleAutoCompleteChange("SALESPERSON_1", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <AutoVibe
              id="SALESPERSON_2"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={salesperson2Options}
              label="Salesperson 2"
              name="SALESPERSON_2"
              value={formData.SALESPERSON_2 || ""}
              onChange={(event, value) => handleAutoCompleteChange("SALESPERSON_2", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <TextField
              label="... Email"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Remark Status"
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
         
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Ex Rate"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.EX_RATE_VALUE || ""}
              disabled={isFormDisabled}
              name="EX_RATE_VALUE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
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
           <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <FormControlLabel
              control={<Checkbox name="SHORT_CLOSE" size="small" checked={formData.SHORT_CLOSE === "1"}
              onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Short Close"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <FormControlLabel
              control={<Checkbox name="READY_SI" size="small" checked={formData.READY_SI === "1"}
              onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Ready_Si"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Stepper1;