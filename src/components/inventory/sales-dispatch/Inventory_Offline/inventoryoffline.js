'use client';
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { TbListSearch } from "react-icons/tb";
import { useSearchParams } from "next/navigation";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon,
} from "@mui/icons-material";
import { useRouter } from 'next/navigation';
import CrudButton from "@/GlobalFunction/CrudButton";
import Stepper1 from "./stepper1";
import Stepper2 from "./stepper2";
import Stepper3 from "./stepper3";
import axiosInstance from "@/lib/axios";

const SalesOrderOffline = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [mode, setMode] = useState("view");
  const [loading, setLoading] = useState(false);
  const [currentPARTY_KEY, setCurrentPARTY_KEY] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // State for dropdown mappings
  const [partyMapping, setPartyMapping] = useState({});
  const [branchMapping, setBranchMapping] = useState({});
  const [brokerMapping, setBrokerMapping] = useState({});
  const [broker1Mapping, setBroker1Mapping] = useState({});
  const [salesperson1Mapping, setSalesperson1Mapping] = useState({});
  const [salesperson2Mapping, setSalesperson2Mapping] = useState({});
  const [consigneeMapping, setConsigneeMapping] = useState({});
  const [seasonMapping, setSeasonMapping] = useState({});
  const [transporterMapping, setTransporterMapping] = useState({});
  
  const [formData, setFormData] = useState({
    ORDER_NO: "",
    ORDER_DATE: "",
    PARTY_ORD_NO: "",
    SEASON: "",
    ORD_REF_DT: "",
    ENQ_NO: "",
    PARTY_BRANCH: "",
    QUOTE_NO: "",
    SHIPPING_PARTY: "",
    DIV_PLACE: "",
    AR_SALES: "",
    SHIPPING_PLACE: "",
    PRICE_LIST: "",
    BROKER_TRANSPORTER: "",
    B_EAST_II: "",
    NEW_ADDR: "",
    CONSIGNEE: "",
    E_ASM1: "",
    BROKER1: "",
    SALESPERSON_2: "",
    NEW: "",
    EMAIL: "",
    REMARK_STATUS: "",
    MAIN_DETAILS: "G",
    GST_APPL: "Y",
    RACK_MIN: "0",
    REGISTERED_DEALER: "0",
    SHORT_CLOSE: "0",
    READY_SI: "0",
    SearchByCd: "",
    LAST_ORD_NO: "",
    SERIES: "",
    // Additional fields for API
    ORDBK_KEY: "",
    ORD_EVENT_KEY: "",
  ORG_DLV_DT: "",
  PLANNING: "0",
    PARTY_KEY: "",
    ORDBK_AMT: "",
    ORDBK_ITM_AMT: "",
    ORDBK_GST_AMT: "",
    ORDBK_DISC_AMT: "",
    CURRN_KEY: "",
    EX_RATE: "",
    DLV_DT: "",
    TOTAL_QTY: 0,
    TOTAL_AMOUNT: 0,
    NET_AMOUNT: 0,
    DISCOUNT: 0,
    // Dropdown display values
    Party: "",
    Branch: "",
    Broker: "",
    Transporter: "",
    SALESPERSON_1: "",
    ord_event: "",
    // New fields from API response
    CURR_SEASON_KEY: "",
    PRICELIST_KEY: "",
    BROKER1_KEY: "",
    SHP_PARTY_KEY: "",
    DESP_PORT: "",
    SALEPERSON1_KEY: "",
    SALEPERSON2_KEY: "",
    DISTBTR_KEY: "",
    TRSP_KEY: "",
    apiResponseData: null
  });

  const Buttonsx = {
    backgroundColor: '#39ace2',
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 30 },
  };

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
      backgroundColor: '#e0f7fa',
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

  const searchParams = useSearchParams();
  const ordbkKey = searchParams.get("ordbkKey");

  useEffect(() => {
    if (ordbkKey) {
      console.log("Got ORDBK_KEY from URL:", ordbkKey);
      fetchOrderDetails(ordbkKey);
    }
  }, [ordbkKey]);

  // Function to fetch order details from API
  const fetchOrderDetails = async (ordbkKey) => {
    try {
      setLoading(true);
      const payload = {
        ORDBK_KEY: ordbkKey,
        FLAG: ""
      };

      console.log('Fetching order details with payload:', payload);

      const response = await axiosInstance.post('/ORDBK/RetriveOrder', payload);
      console.log('API Response:', response.data);

      if (response.data.RESPONSESTATUSCODE === 1 && response.data.DATA.ORDBKList.length > 0) {
        const orderData = response.data.DATA.ORDBKList[0];
        await populateFormData(orderData);
        setCurrentPARTY_KEY(orderData.PARTY_KEY);
      } else {
        console.error('No data found in response');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to populate form data from API response
  // Function to populate form data from API response - UPDATED VERSION
const populateFormData = async (orderData) => {
  try {
    // First fetch all dropdown data to get proper mappings
    await fetchAllDropdownData();
    
    console.log('Order Data received:', orderData);
    
    // Get display names from mappings using the actual API response keys
    const partyName = partyMapping[orderData.PARTY_KEY] || await getPartyNameByKey(orderData.PARTY_KEY);
    const branchName = branchMapping[orderData.PARTYDTL_ID] || await getBranchNameById(orderData.PARTYDTL_ID);
    const brokerName = brokerMapping[orderData.BROKER_KEY] || await getBrokerNameByKey(orderData.BROKER_KEY);
    const broker1Name = broker1Mapping[orderData.BROKER1_KEY] || await getBrokerNameByKey(orderData.BROKER1_KEY);
    const salesperson1Name = salesperson1Mapping[orderData.SALEPERSON1_KEY] || await getSalespersonNameByKey(orderData.SALEPERSON1_KEY);
    const salesperson2Name = salesperson2Mapping[orderData.SALEPERSON2_KEY] || await getSalespersonNameByKey(orderData.SALEPERSON2_KEY);
    const consigneeName = consigneeMapping[orderData.DISTBTR_KEY] || await getConsigneeNameByKey(orderData.DISTBTR_KEY);
    const seasonName = seasonMapping[orderData.CURR_SEASON_KEY] || await getSeasonNameByKey(orderData.CURR_SEASON_KEY);    const transporterName = transporterMapping[orderData.TRSP_KEY] || await getTransporterNameByKey(orderData.TRSP_KEY);
    const shippingPartyName = partyMapping[orderData.SHP_PARTY_KEY] || await getPartyNameByKey(orderData.SHP_PARTY_KEY) || partyName;

    console.log('Mapped names:', {
      partyName,
      branchName,
      brokerName,
      broker1Name,
      salesperson1Name,
      salesperson2Name,
      consigneeName,
      seasonName,
      transporterName,
      shippingPartyName
    });

    const formattedData = {
      apiResponseData: orderData,
      ORDER_NO: orderData.ORDBK_NO || "",
      ORDER_DATE: orderData.ORDBK_DT ? formatDateForDisplay(orderData.ORDBK_DT) : "",
      PARTY_ORD_NO: orderData.PORD_REF || "",
      SEASON: seasonName || "",
      ORD_REF_DT: orderData.PORD_DT ? formatDateForDisplay(orderData.PORD_DT) : "",
      ENQ_NO: orderData.Enq_Key || "",
      PARTY_BRANCH: orderData.OrdBk_CoBr_Id || "",
      QUOTE_NO: orderData.QUOTE_NO || "",
      SHIPPING_PARTY: shippingPartyName || partyName, // Auto-populate with party if empty
      DIV_PLACE: orderData.DESP_PORT || "",
      AR_SALES: orderData.SALEPERSON1_KEY || "",
      SHIPPING_PLACE: orderData.DESP_PORT  || branchName, // Auto-populate with branch
      PRICE_LIST: orderData.PRICELIST_KEY || "",
      BROKER_TRANSPORTER: brokerName || "",
      B_EAST_II: "",
      NEW_ADDR: "",
      CONSIGNEE: consigneeName || "",
      E_ASM1: "",
      BROKER1: broker1Name || "",
      SALESPERSON_2: salesperson2Name || "",
      SALESPERSON_1: salesperson1Name || "",
      Transporter: transporterName || "",
      NEW: "",
      EMAIL: "",
      REMARK_STATUS: orderData.REMK || "",
      MAIN_DETAILS: orderData.LotWise === "Y" ? "L" : "G",
      GST_APPL: orderData.GST_APP || "Y",
      RACK_MIN: orderData.STK_FLG || "0",
      REGISTERED_DEALER: "0",
      SHORT_CLOSE: "0",
      READY_SI: orderData.READY_SI || "0",
      LAST_ORD_NO: orderData.LAST_ORD_NO || "",
      SERIES: orderData.SERIES || "",
      // Additional fields that might be useful
       ORD_EVENT_KEY: orderData.ORD_EVENT_KEY || "",
      ORG_DLV_DT: orderData.ORG_DLV_DT ? formatDateForDisplay(orderData.ORG_DLV_DT) : "",
      PLANNING: orderData.PLANNING || "0",
      ORDBK_KEY: orderData.ORDBK_KEY || "",
      PARTY_KEY: orderData.PARTY_KEY || "",
      ORDBK_AMT: orderData.ORDBK_AMT || "",
      ORDBK_ITM_AMT: orderData.ORDBK_ITM_AMT || "",
      ORDBK_GST_AMT: orderData.ORDBK_GST_AMT || "",
      ORDBK_DISC_AMT: orderData.ORDBK_DISC_AMT || "",
      CURRN_KEY: orderData.CURRN_KEY || "",
      EX_RATE: orderData.EX_RATE || "",
      DLV_DT: orderData.DLV_DT ? formatDateForDisplay(orderData.DLV_DT) : "",
      // Dropdown display values
      Party: partyName || "",
      Branch: branchName || "",
      Broker: brokerName || "",
      // API specific fields
      CURR_SEASON_KEY: orderData.CURR_SEASON_KEY || "",
      PRICELIST_KEY: orderData.PRICELIST_KEY || "",
      BROKER1_KEY: orderData.BROKER1_KEY || "",
      SHP_PARTY_KEY: orderData.SHP_PARTY_KEY || orderData.PARTY_KEY, // Auto-populate
      DESP_PORT: orderData.DESP_PORT || "",
      SALEPERSON1_KEY: orderData.SALEPERSON1_KEY || "",
      SALEPERSON2_KEY: orderData.SALEPERSON2_KEY || "",
      DISTBTR_KEY: orderData.DISTBTR_KEY || "",
      TRSP_KEY: orderData.TRSP_KEY || "",
      // Calculate totals from ORDBKSTYLIST
      PARTYDTL_ID: orderData.PARTYDTL_ID || 0, 
       SHP_PARTYDTL_ID: orderData.SHP_PARTYDTL_ID || orderData.PARTYDTL_ID || 0,
      TOTAL_QTY: calculateTotalQty(orderData.ORDBKSTYLIST),
      TOTAL_AMOUNT: orderData.ORDBK_AMT || 0,
      NET_AMOUNT: (orderData.ORDBK_AMT || 0) - (orderData.ORDBK_DISC_AMT || 0),
      DISCOUNT: orderData.ORDBK_DISC_AMT || 0
    };

    console.log('Populating form with data:', formattedData);
    setFormData(formattedData);
    
    // Set current party key for navigation
    setCurrentPARTY_KEY(orderData.PARTY_KEY);
  } catch (error) {
    console.error('Error populating form data:', error);
  }
};

  // Calculate total quantity from ORDBKSTYLIST
  const calculateTotalQty = (ordbkStyleList) => {
    if (!ordbkStyleList || !Array.isArray(ordbkStyleList)) return 0;
    
    return ordbkStyleList.reduce((total, item) => {
      return total + (parseFloat(item.ITMQTY) || 0);
    }, 0);
  };

  // Helper functions to get names from keys - IMPROVED VERSION
 // Enhanced helper functions to get names from keys
const getPartyNameByKey = async (partyKey) => {
  if (!partyKey) return "";
  try {
    const response = await axiosInstance.post("Party/GetParty_By_Name", {
      PARTY_KEY: partyKey
    });
    if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
      const party = response.data.DATA.find(item => item.PARTY_KEY === partyKey);
      return party ? party.PARTY_NAME : "";
    }
    return "";
  } catch (error) {
    console.error("Error fetching party name:", error);
    return "";
  }
};

const getBranchNameById = async (branchId) => {
  if (!branchId || branchId === 0) return "";
  try {
    const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
      PARTYDTL_ID: branchId
    });
    if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
      const branch = response.data.DATA.find(item => item.PARTYDTL_ID === branchId);
      return branch ? branch.PLACE : "";
    }
    return "";
  } catch (error) {
    console.error("Error fetching branch name:", error);
    return "";
  }
};

// Enhanced broker function to handle both BROKER_KEY and BROKER1_KEY
const getBrokerNameByKey = async (brokerKey) => {
  if (!brokerKey) return "";
  try {
    const payload = {
      "PARTY_KEY": "",
      "FLAG": "Drp",
      "BROKER_KEY": brokerKey,
      "PageNumber": 1,
      "PageSize": 10,
      "SearchText": ""
    };
    const response = await axiosInstance.post('/BROKER/GetBrokerDrp', payload);
    if (response.data.DATA && Array.isArray(response.data.DATA)) {
      const broker = response.data.DATA.find(item => item.BROKER_KEY === brokerKey);
      return broker ? broker.BROKER_NAME : "";
    }
    return "";
  } catch (error) {
    console.error('Error fetching broker name:', error);
    return "";
  }
};

  const getSalespersonNameByKey = async (salespersonKey) => {
    if (!salespersonKey) return "";
    try {
      const payload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "SALEPERSON_KEY": salespersonKey,
        "PageNumber": 1,
        "PageSize": 10,
        "SearchText": ""
      };
      const response = await axiosInstance.post('/SALEPERSON/GetSALEPERSONDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const salesperson = response.data.DATA.find(item => item.SALEPERSON_KEY === salespersonKey);
        return salesperson ? salesperson.SALEPERSON_NAME : "";
      }
      return "";
    } catch (error) {
      console.error('Error fetching salesperson name:', error);
      return "";
    }
  };

  const getConsigneeNameByKey = async (consigneeKey) => {
    if (!consigneeKey) return "";
    try {
      const payload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "DISTBTR_KEY": consigneeKey,
        "PageNumber": 1,
        "PageSize": 10,
        "SearchText": ""
      };
      const response = await axiosInstance.post('/DISTBTR/GetDISTBTRDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const consignee = response.data.DATA.find(item => item.DISTBTR_KEY === consigneeKey);
        return consignee ? consignee.DISTBTR_NAME : "";
      }
      return "";
    } catch (error) {
      console.error('Error fetching consignee name:', error);
      return "";
    }
  };

const getSeasonNameByKey = async (seasonKey) => {
  if (!seasonKey) return "";
  try {
    const payload = {
      "FLAG": "P",
      "TBLNAME": "SEASON", 
      "FLDNAME": "SEASON_KEY",
      "ID": seasonKey,
      "ORDERBYFLD": "",
      "CWHAER": "",
      "CO_ID": ""
    };
    const response = await axiosInstance.post('/SEASON/GetSEASONDrp', payload);
    if (response.data.DATA && Array.isArray(response.data.DATA)) {
      const season = response.data.DATA.find(item => item.SEASON_KEY === seasonKey);
      return season ? season.SEASON_NAME : "";
    }
    return "";
  } catch (error) {
    console.error('Error fetching season name:', error);
    return "";
  }
};

  const getTransporterNameByKey = async (transporterKey) => {
    if (!transporterKey) return "";
    try {
      const payload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "TRSP_KEY": transporterKey,
        "PageNumber": 1,
        "PageSize": 10,
        "SearchText": ""
      };
      const response = await axiosInstance.post('/TRSP/GetTRSPDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const transporter = response.data.DATA.find(item => item.TRSP_KEY === transporterKey);
        return transporter ? transporter.TRSP_NAME : "";
      }
      return "";
    } catch (error) {
      console.error('Error fetching transporter name:', error);
      return "";
    }
  };

  // Fetch all dropdown data for proper mappings - IMPROVED VERSION
  const fetchAllDropdownData = async () => {
    try {
      // Fetch parties
      const partyResponse = await axiosInstance.post("Party/GetParty_By_Name", { PARTY_NAME: "" });
      if (partyResponse.data.STATUS === 0 && Array.isArray(partyResponse.data.DATA)) {
        const partyMap = {};
        partyResponse.data.DATA.forEach(item => {
          if (item.PARTY_NAME && item.PARTY_KEY) {
            partyMap[item.PARTY_KEY] = item.PARTY_NAME; // Reverse mapping for lookup
          }
        });
        setPartyMapping(partyMap);
      }

      // Fetch brokers
      const brokerPayload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "BROKER_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };
      const brokerResponse = await axiosInstance.post('/BROKER/GetBrokerDrp', brokerPayload);
      if (brokerResponse.data.DATA && Array.isArray(brokerResponse.data.DATA)) {
        const brokerMap = {};
        brokerResponse.data.DATA.forEach(item => {
          if (item.BROKER_NAME && item.BROKER_KEY) {
            brokerMap[item.BROKER_KEY] = item.BROKER_NAME;
          }
        });
        setBrokerMapping(brokerMap);
        setBroker1Mapping(brokerMap);
      }

      // Fetch salespersons
      const salespersonPayload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "SALEPERSON_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };
      const salespersonResponse = await axiosInstance.post('/SALEPERSON/GetSALEPERSONDrp', salespersonPayload);
      if (salespersonResponse.data.DATA && Array.isArray(salespersonResponse.data.DATA)) {
        const salespersonMap = {};
        salespersonResponse.data.DATA.forEach(item => {
          if (item.SALEPERSON_NAME && item.SALEPERSON_KEY) {
            salespersonMap[item.SALEPERSON_KEY] = item.SALEPERSON_NAME;
          }
        });
        setSalesperson1Mapping(salespersonMap);
        setSalesperson2Mapping(salespersonMap);
      }

      // Fetch consignees
      const consigneePayload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "DISTBTR_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };
      const consigneeResponse = await axiosInstance.post('/DISTBTR/GetDISTBTRDrp', consigneePayload);
      if (consigneeResponse.data.DATA && Array.isArray(consigneeResponse.data.DATA)) {
        const consigneeMap = {};
        consigneeResponse.data.DATA.forEach(item => {
          if (item.DISTBTR_NAME && item.DISTBTR_KEY) {
            consigneeMap[item.DISTBTR_KEY] = item.DISTBTR_NAME;
          }
        });
        setConsigneeMapping(consigneeMap);
      }

      // Fetch seasons
      const seasonPayload = {
        "FLAG": "P",
        "TBLNAME": "SEASON",
        "FLDNAME": "SEASON_KEY",
        "ID": "",
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": ""
      };
      const seasonResponse = await axiosInstance.post('/SEASON/GetSEASONDrp', seasonPayload);
      if (seasonResponse.data.DATA && Array.isArray(seasonResponse.data.DATA)) {
        const seasonMap = {};
        seasonResponse.data.DATA.forEach(item => {
          if (item.SEASON_NAME && item.SEASON_KEY) {
            seasonMap[item.SEASON_KEY] = item.SEASON_NAME;
          }
        });
        setSeasonMapping(seasonMap);
      }

      // Fetch transporters
      const transporterPayload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "TRSP_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };
      const transporterResponse = await axiosInstance.post('/TRSP/GetTRSPDrp', transporterPayload);
      if (transporterResponse.data.DATA && Array.isArray(transporterResponse.data.DATA)) {
        const transporterMap = {};
        transporterResponse.data.DATA.forEach(item => {
          if (item.TRSP_NAME && item.TRSP_KEY) {
            transporterMap[item.TRSP_KEY] = item.TRSP_NAME;
          }
        });
        setTransporterMapping(transporterMap);
      }

    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === "1900-01-01T00:00:00") return "";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch (error) {
      console.error('Error formatting date:', error);
      return "";
    }
  };

  // Helper function to format date for API (YYYY-MM-DD)
// Helper function to format date for API (YYYY-MM-DD)
const formatDateForAPI = (dateString) => {
  if (!dateString || dateString === "1900-01-01T00:00:00") return "1900-01-01T00:00:00";
  
  try {
    // If date is in DD/MM/YYYY format
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;
    }
    
    // If date is already in proper format
    const date = new Date(dateString);
    return date.toISOString().split('T')[0] + 'T00:00:00';
  } catch (error) {
    console.error('Error formatting date for API:', error);
    return "1900-01-01T00:00:00";
  }
};

  // Function to get series prefix
  const getSeriesPrefix = async () => {
    try {
      const payload = {
        "MODULENAME": "Ordbk",
        "TBLNAME": "Ordbk",
        "FLDNAME": "Ordbk_KEY",
        "NCOLLEN": 0,
        "CPREFIX": "",
        "COBR_ID": "02",
        "FCYR_KEY": "25",
        "TRNSTYPE": "M",
        "SERIESID": 66,
        "FLAG": "Series"
      };

      const response = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', payload);
      console.log('Series Prefix Response:', response.data);

      if (response.data.DATA && response.data.DATA.length > 0) {
        return response.data.DATA[0].CPREFIX;
      }
      return null;
    } catch (error) {
      console.error('Error fetching series prefix:', error);
      return null;
    }
  };


  

  // Function to submit form data
  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      
      // Get username from localStorage
      const userName = localStorage.getItem('USER_NAME') || 'ankita';
      const strCobrid = "02"; // Fixed as per requirement
      
      // Prepare payload for API
      const payload = prepareSubmitPayload();
      
      console.log('Submitting order with payload:', payload);
      
      // Make API call
      const response = await axiosInstance.post(`/ORDBK/ApiMangeOrdbk?UserName=${userName}&strCobrid=${strCobrid}`, payload);
      console.log('Submit API Response:', response.data);
      
      if (response.data.RESPONSESTATUSCODE === 1) {
        alert("Order submitted successfully!");
        setMode('view');
        setIsFormDisabled(true);
        
        // Refresh the page or fetch updated data
        if (formData.ORDBK_KEY) {
          fetchOrderDetails(formData.ORDBK_KEY);
        }
      } else {
        alert("Error submitting order: " + (response.data.RESPONSEMESSAGE || "Unknown error"));
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert("Error submitting order. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Function to prepare payload for submission
// Function to prepare payload for submission - COMPLETE VERSION
const prepareSubmitPayload = () => {
  const dbFlag = mode === 'add' ? 'I' : 'U';
  const currentDate = new Date().toISOString().replace('T', ' ').split('.')[0];
  
  // Get user ID from localStorage (numeric value)
  const userId = localStorage.getItem('USER_ID') || '1';
  const userName = localStorage.getItem('USER_NAME') || 'Admin';
  
  console.log('User Info:', { userId, userName });

  // Get keys from mappings
  const partyKey = formData.PARTY_KEY;
  const branchId = formData.PARTYDTL_ID || 0;
  const brokerKey = formData.BROKER_KEY || "";
  const broker1Key = formData.BROKER1_KEY || "";
  const salesperson1Key = formData.SALEPERSON1_KEY || "";
  const salesperson2Key = formData.SALEPERSON2_KEY || "";
  const consigneeKey = formData.DISTBTR_KEY || "";
  const seasonKey = formData.CURR_SEASON_KEY || "";
  const transporterKey = formData.TRSP_KEY || "";
  const shippingPartyKey = formData.SHP_PARTY_KEY || "";
  const shippingPartyDtlId = formData.SHP_PARTYDTL_ID || branchId || 0;

  console.log('Keys for payload:', {
    partyKey,
    branchId,
    brokerKey,
    broker1Key,
    salesperson1Key,
    salesperson2Key,
    consigneeKey,
    seasonKey,
    transporterKey,
    shippingPartyKey
  });

  // Get ORDBKSTYLIST from formData
  const ordbkStyleList = formData.apiResponseData?.ORDBKSTYLIST || [];
  
  // CORRECT ORDBK_KEY generation: FCYR_KEY + COBR_ID + ORDBK_NO
  const correctOrdbkKey = formData.ORDBK_KEY || `2502${formData.ORDER_NO}`;
  
  console.log('Using ORDBK_KEY:', correctOrdbkKey);

  // Transform ORDBKSTYLIST for API
  const transformedOrdbkStyleList = ordbkStyleList.map(item => ({
    DBFLAG: dbFlag,
    ORDBKSTY_ID: item.ORDBKSTY_ID || 0,
    ORDBK_KEY: correctOrdbkKey,
    FGPRD_KEY: item.FGPRD_KEY || "",
    FGSTYLE_ID: item.FGSTYLE_ID || 0,
    FGSTYLE_CODE: item.STYLE || "",
    FGTYPE_KEY: item.FGTYPE_KEY || "",
    FGSHADE_KEY: item.FGSHADE_KEY || "",
    FGPTN_KEY: item.FGPTN_KEY || "",
    FGITM_KEY: item.FGITEM_KEY || "",
    QTY: parseFloat(item.ITMQTY) || 0,
    STYCATRT_ID: item.STYCATRT_ID || 0,
    RATE: parseFloat(item.ITMRATE) || 0,
    AMT: parseFloat(item.ITMAMT) || 0,
    DLV_VAR_PERCENT: parseFloat(item.DLV_VAR_PERC) || 0,
    DLV_VAR_QTY: parseFloat(item.DLV_VAR_QTY) || 0,
    OPEN_RATE: "",
    TERM_KEY: "",
    TERM_NAME: "",
    TERM_PERCENT: 0,
    TERM_FIX_AMT: 0,
    TERM_RATE: 0,
    TERM_PERQTY: 0,
    DISC_AMT: parseFloat(item.DISC_AMT) || 0,
    NET_AMT: parseFloat(item.NET_AMT) || 0,
    INIT_DT: "1900-01-01 00:00:00.000",
    INIT_REMK: "",
    INIT_QTY: 0,
    DLV_DT: "1900-01-01 00:00:00.000",
    BAL_QTY: parseFloat(item.ITMQTY) || 0,
    STATUS: "1",
    STYLE_PRN: "",
    TYPE_PRN: "",
    MRP_PRN: parseFloat(item.ITMRATE) || 0,
    REMK: item.REMARK || "",
    QUOTEDTL_ID: 0,
    SETQTY: parseFloat(item.SETQTY) || 0,
    RQTY: 0,
    DISTBTR_KEY: consigneeKey,
    LOTNO: seasonKey,
    WOBALQTY: parseFloat(item.ITMQTY) || 0,
    REFORDBKSTY_ID: 0,
    BOMSTY_ID: 0,
    ISRMREQ: "N",
    OP_QTY: 0,
    ORDBKSTYSZLIST: (item.ORDBKSTYSZLIST || []).map(sizeItem => ({
      DBFLAG: dbFlag,
      ORDBKSTYSZ_ID: sizeItem.ORDBKSTYSZ_ID || 0,
      ORDBK_KEY: correctOrdbkKey,
      ORDBKSTY_ID: item.ORDBKSTY_ID || 0,
      STYSIZE_ID: sizeItem.STYSIZE_ID || 0,
      STYSIZE_NAME: sizeItem.STYSIZE_NAME || "",
      QTY: parseFloat(sizeItem.QTY) || 0,
      INIT_DT: "1900-01-01 00:00:00.000",
      INIT_REMK: "",
      INIT_QTY: 0,
      BAL_QTY: parseFloat(sizeItem.QTY) || 0,
      MRP: parseFloat(item.ITMRATE) || 0,
      WSP: parseFloat(item.ITMRATE) || 0,
      RQTY: 0,
      WOBALQTY: parseFloat(sizeItem.QTY) || 0,
      REFORDBKSTYSZ_ID: 0,
      OP_QTY: 0,
      HSNCODE_KEY: "IG001",
      GST_RATE_SLAB_ID: 39,
      ITM_AMT: parseFloat(sizeItem.ITM_AMT) || 0,
      DISC_AMT: parseFloat(sizeItem.DISC_AMT) || 0,
      NET_AMT: parseFloat(sizeItem.NET_AMT) || 0,
      SGST_AMT: 0,
      CGST_AMT: 0,
      IGST_AMT: 0,
      NET_SALE_RATE: 0,
      OTHER_AMT: 0,
      ADD_CESS_RATE: 0,
      ADD_CESS_AMT: 0
    }))
  }));

  // Base payload for both insert and update
  const basePayload = {
    DBFLAG: dbFlag,
    FCYR_KEY: "25",
    CO_ID: "02",
    COBR_ID: "02",
    ORDBK_NO: formData.ORDER_NO || "",
    CURR_SEASON_KEY: seasonKey,
    ORDBK_X: "",
    // NEW FIELDS ADDED HERE - Exactly as required
    ORDBK_TNA_TYPE: "I",
    MERCHANDISER_ID: 1,
    ORD_EVENT_KEY: "",
    ORG_DLV_DT: "1900-01-01T00:00:00",
    PLANNING: "0",
    // END OF NEW FIELDS
    ORDBK_KEY: correctOrdbkKey,
    ORDBK_DT: formatDateForAPI(formData.ORDER_DATE),
    PORD_REF: formData.PARTY_ORD_NO || "",
    PORD_DT: formatDateForAPI(formData.ORD_REF_DT),
    QUOTE_NO: formData.QUOTE_NO || "",
    QUOTE_DT: formatDateForAPI(formData.ORDER_DATE),
    PARTY_KEY: partyKey,
    PARTYDTL_ID: parseInt(branchId) || 100006,
    BROKER_KEY: brokerKey,
    BROKER1_KEY: broker1Key,
    BROKER_COMM: 0.00,
    COMMON_DLV_DT_FLG: "0",
    STK_FLG: formData.RACK_MIN || "0",
    DLV_DT: formatDateForAPI(formData.DLV_DT),
    DLV_PLACE: formData.SHIPPING_PLACE || "",
    TRSP_KEY: transporterKey,
    ORDBK_AMT: parseFloat(formData.TOTAL_AMOUNT) || 0,
    REMK: formData.REMARK_STATUS || "",
    STATUS: "1",
    CURRN_KEY: formData.CURRN_KEY || "",
    EX_RATE: parseFloat(formData.EX_RATE) || 0,
    IMP_ORDBK_KEY: "",
    ORDBK_TYPE: "2",
    ROUND_OFF_DESC: "",
    ROUND_OFF: 0.00,
    BOMSTY_ID: 0,
    LOTWISE: formData.MAIN_DETAILS === "L" ? "Y" : "N",
    IsWO: "0",
    SuplKey: "",
    KNIT_DT: "1900-01-01 00:00:00.000",
    OrdBk_CoBr_Id: formData.PARTY_BRANCH || "02",
    GR_AMT: parseFloat(formData.TOTAL_AMOUNT) || 0,
    GST_APP: formData.GST_APPL || "Y",
    GST_TYPE: "C",
    SHP_PARTY_KEY: shippingPartyKey,
    SHP_PARTYDTL_ID: parseInt(shippingPartyDtlId) || 100006,
    STATE_CODE: "",
    ORDBK_ITM_AMT: parseFloat(formData.ORDBK_ITM_AMT) || 0,
    ORDBK_SGST_AMT: 0,
    ORDBK_CGST_AMT: 0,
    ORDBK_IGST_AMT: 0,
    ORDBK_ADD_CESS_AMT: 0,
    ORDBK_GST_AMT: parseFloat(formData.ORDBK_GST_AMT) || 0,
    ORDBK_EXTRA_AMT: 0,
    ORDBKSTYLIST: transformedOrdbkStyleList,
    ORDBKTERMLIST: [],
    ORDBKGSTLIST: [],
    DISTBTR_KEY: consigneeKey,
    SALEPERSON1_KEY: salesperson1Key,
    SALEPERSON2_KEY: salesperson2Key,
    TRSP_KEY: transporterKey,
    PRICELIST_KEY: formData.PRICELIST_KEY || "",
    DESP_PORT: formData.DESP_PORT || "",
  };

  // Add user fields based on operation type
  if (dbFlag === 'I') {
    basePayload.CREATED_BY = parseInt(userId) || 1;
    basePayload.CREATED_DT = currentDate;
  } else {
    basePayload.UPDATED_BY = parseInt(userId) || 1;
    basePayload.UPDATED_DT = currentDate;
  }

  console.log('Final Payload:', JSON.stringify(basePayload, null, 2));
  return basePayload;
};

  const handlePrint = () => { }
  
  const handleExit = () => {
    router.push('/inverntory/stock-enquiry-table');
  };

  // Function to get order number - UPDATED
const getOrderNumber = async (prefix) => {
  try {
    const payload = {
      "MODULENAME": "Ordbk",
      "TBLNAME": "Ordbk",
      "FLDNAME": "Ordbk_No",
      "NCOLLEN": 6,
      "CPREFIX": prefix,
      "COBR_ID": "02",
      "FCYR_KEY": "25",
      "TRNSTYPE": "T",
      "SERIESID": 0,
      "FLAG": ""
    };

    const response = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', payload);
    console.log('Order Number Response:', response.data);

    if (response.data.DATA && response.data.DATA.length > 0) {
      return {
        orderNo: response.data.DATA[0].ID,
        lastOrderNo: response.data.DATA[0].LASTID
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching order number:', error);
    return null;
  }
};

// Updated handleAdd function
const handleAdd = async () => {
  try {
    setLoading(true);
    
    // Get series prefix first
    const prefix = await getSeriesPrefix();
    
    if (prefix) {
      // Get order number using the prefix
      const orderData = await getOrderNumber(prefix);
      
      if (orderData) {
        // CORRECT ORDBK_KEY generation: FCYR_KEY + COBR_ID + ORDBK_NO
        const correctOrdbkKey = `2502${orderData.orderNo}`;
        
        // Update form data with new order numbers
        setFormData(prev => ({
          ...prev,
          ORDER_NO: orderData.orderNo,
          LAST_ORD_NO: orderData.lastOrderNo,
          SERIES: prefix,
          ORDBK_KEY: correctOrdbkKey // Fixed ORDBK_KEY format
        }));
        
        console.log('Generated ORDBK_KEY:', correctOrdbkKey);
      }
    }
    
    setMode('add');
    setIsFormDisabled(false);
  } catch (error) {
    console.error('Error in handleAdd:', error);
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setMode('view');
    setIsFormDisabled(true);
  };

  const handlePrevClick = async () => {
    setFormData((prev) => ({
      ...prev,
      SearchByCd: ''
    }));
  };

  const handleNextClick = async () => {
    if (currentPARTY_KEY) {
      setFormData((prev) => ({
        ...prev,
        SearchByCd: ''
      }));
    }
  };

  const handleEdit = () => {
    setMode('edit');
    setIsFormDisabled(false);
  };

  const handleDelete = () => {
    setMode('view');
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Typography>Loading order data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container justifyContent="space-between" sx={{ ml: '4.9%', mr: '5%' }}
        spacing={2}
      >
        <Grid>
          <Button
            variant="contained"
            size="small"
            sx={{ background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4) !important' }}
            disabled={mode !== 'view'}
            onClick={handlePrevClick}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important', ml: 1 }}
            disabled={mode !== 'view'}
            onClick={handleNextClick}
          >
            <NavigateNextIcon />
          </Button>
        </Grid>
        <Grid>
          <Typography align="center" variant="h6">
            {tabIndex === 0 ? "Sales Order(Offline)" : tabIndex === 1 ? "Branch Details" : "Terms Details"}
          </Typography>
        </Grid>

        <Grid sx={{ width: { xs: '100%', sm: '48%', md: '16%', display: 'flex' } }}>
          <TextField
            label="Search By Code"
            variant="filled"
            fullWidth
            value={formData.SearchByCd}
            onChange={(e) => setFormData({ ...formData, SearchByCd: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // fetchPartyData(e.target.value, 'R', true);
              }
            }}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '4px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid sx={{ display: "flex", justifyContent: "end" }}>
          <CrudButton
            moduleName=""
            mode={mode}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExit={handleExit}
            readOnlyMode={mode === "view"}
            onPrevious={handlePrevClick}
            onNext={handleNextClick}
          />
        </Grid>
      </Grid>

      <Grid xs={12} sx={{ ml: '5%', mb: '0.5%', mt: '1%' }}>
        <Box sx={{ display: 'flex' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Main Branch Tabs"
            sx={{
              minHeight: '36px',
              '.MuiTabs-indicator': {
                height: '3px',
                backgroundColor: '#635BFF',
              },
            }}
          >
            <Tab
              label="Main"
              sx={{
                minHeight: '36px',
                padding: '6px 16px',
                textTransform: 'none',
                lineHeight: 1,
                backgroundColor: tabIndex === 0 ? '#e0e0ff' : 'transparent',
                '&.Mui-selected': {
                  color: '#000',
                  fontWeight: 'bold',
                },
              }}
            />
            <Tab
              label="Details"
              sx={{
                minHeight: '36px',
                padding: '6px 16px',
                textTransform: 'none',
                lineHeight: 1,
                backgroundColor: tabIndex === 1 ? '#e0e0ff' : 'transparent',
                '&.Mui-selected': {
                  color: '#000',
                  fontWeight: 'bold',
                },
              }}
            />
            <Tab
              label="Tax/Terms"
              sx={{
                minHeight: '36px',
                padding: '6px 16px',
                textTransform: 'none',
                lineHeight: 1,
                backgroundColor: tabIndex === 2 ? '#e0e0ff' : 'transparent',
                '&.Mui-selected': {
                  color: '#000',
                  fontWeight: 'bold',
                },
              }}
            />
          </Tabs>
        </Box>
      </Grid>
      
      <Grid xs={12}>
        {tabIndex === 0 ? (
          <Stepper1 
            formData={formData} 
            setFormData={setFormData} 
            isFormDisabled={isFormDisabled}
            mode={mode}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            // Pass mappings and setter functions
            partyMapping={partyMapping}
            branchMapping={branchMapping}
            brokerMapping={brokerMapping}
            broker1Mapping={broker1Mapping}
            salesperson1Mapping={salesperson1Mapping}
            salesperson2Mapping={salesperson2Mapping}
            consigneeMapping={consigneeMapping}
            seasonMapping={seasonMapping}
            transporterMapping={transporterMapping}
            setPartyMapping={setPartyMapping}
            setBranchMapping={setBranchMapping}
            setBrokerMapping={setBrokerMapping}
            setBroker1Mapping={setBroker1Mapping}
            setSalesperson1Mapping={setSalesperson1Mapping}
            setSalesperson2Mapping={setSalesperson2Mapping}
            setConsigneeMapping={setConsigneeMapping}
            setSeasonMapping={setSeasonMapping}
            setTransporterMapping={setTransporterMapping}
          />
        ) : tabIndex === 1 ? (
          <Stepper2 
            formData={formData} 
            setFormData={setFormData} 
            isFormDisabled={isFormDisabled}
            mode={mode}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <Stepper3 
            formData={formData} 
            setFormData={setFormData} 
            isFormDisabled={isFormDisabled}
            mode={mode}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </Grid>

      {tabIndex === 0 && (
        <Grid xs={12} sx={{ display: "flex", justifyContent: "end", mr: '4.5%' }}>
          {mode === 'view' && (
            <>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(290deg, #4e8cff, #1e3c72)',
                  color: '#fff',
                  margin: { xs: '0 4px', sm: '0 6px' },
                  minWidth: { xs: 40, sm: 46, md: 60 },
                  height: { xs: 40, sm: 46, md: 30 },
                }}
                onClick={handleAdd}
                disabled
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(290deg, #4e8cff, #1e3c72)',
                  color: '#fff',
                  margin: { xs: '0 4px', sm: '0 6px' },
                  minWidth: { xs: 40, sm: 46, md: 60 },
                  height: { xs: 40, sm: 46, md: 30 },
                }}
                onClick={handleEdit}
                disabled
              >
                Cancel
              </Button>
            </>
          )}
          {(mode === 'edit' || mode === 'add') && (
            <>
              <Button
                variant="contained"
                sx={{
                  margin: { xs: '0 4px', sm: '0 6px' },
                  background: 'linear-gradient(290deg, #4e8cff, #1e3c72)',
                  color: '#fff',
                  minWidth: { xs: 40, sm: 46, md: 60 },
                  height: { xs: 40, sm: 46, md: 30 },
                }}
                onClick={handleSubmit}
                disabled={submitLoading}
              >
                {submitLoading ? 'Submitting...' : 'Submit'}
              </Button>
              <Button
                variant="contained"
                sx={{
                  margin: { xs: '0 4px', sm: '0 6px' },
                  background: 'linear-gradient(290deg, #4e8cff, #1e3c72)',
                  color: '#fff',
                  minWidth: { xs: 40, sm: 46, md: 60 },
                  height: { xs: 40, sm: 46, md: 30 },
                }}
                onClick={handleCancel}
                disabled={submitLoading}
              >
                Cancel
              </Button>
            </>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default SalesOrderOffline;