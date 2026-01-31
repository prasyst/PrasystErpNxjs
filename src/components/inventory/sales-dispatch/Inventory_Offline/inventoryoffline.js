'use client';
import React, { useEffect, useState, useCallback, Suspense } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Tabs,
  Tab,
  Button,
  Snackbar,
  Alert,
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isDataLoading, setIsDataLoading] = useState(false);
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
  const [orderTypeMapping, setOrderTypeMapping] = useState({});
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [merchandiserMapping, setMerchandiserMapping] = useState({});
  const [branchOptions, setBranchOptions] = useState([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
    const [companyConfig, setCompanyConfig] = useState({
    CO_ID: '',
    COBR_ID: ''
  });
  
  // Add this useEffect after other useEffect declarations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCO_ID = localStorage.getItem('CO_ID') || '02'; // Default fallback
      const storedCOBR_ID = localStorage.getItem('COBR_ID') || '02'; // Default fallback
      
      setCompanyConfig({
        CO_ID: storedCO_ID,
        COBR_ID: storedCOBR_ID
      });
      
      console.log('SalesOrderOffline - Loaded company config from localStorage:', {
        CO_ID: storedCO_ID,
        COBR_ID: storedCOBR_ID
      });
    }
  }, []);
  

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
    GST_APPL: "N",
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
    BROKER_KEY: "",
    BROKER1_KEY: "",
    SHP_PARTY_KEY: "",
    DESP_PORT: "",
    SALEPERSON1_KEY: "",
    SALEPERSON2_KEY: "",
    DISTBTR_KEY: "",
    TRSP_KEY: "",
    apiResponseData: null,
    // Branch and shipping details
    PARTYDTL_ID: 0,
    SHP_PARTYDTL_ID: 0,
    // New fields for Order Type and Merchandiser
    Order_Type: "",
    MERCHANDISER_ID: "",
    MERCHANDISER_NAME: "",
    // New fields for default selections
    Delivery_Shedule: "comman",
    Order_TNA: "ItemWise",
    Status: "O",
    ORDBK_TYPE: "0"
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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Function to get today's date in DD/MM/YYYY format
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
       setIsDataLoading(true); 

      const payload = {
        ORDBK_KEY: ordbkKey,
        FLAG: "R"
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
      showSnackbar('Error fetching order details', 'error');
    } finally {
      setLoading(false);
      setIsDataLoading(false);
    }
  };

// Function to populate form data from API response - UPDATED for shade keys
const populateFormData = async (orderData) => {
  try {
    console.log('Order Data received:', orderData);
    
    // FIRST: Wait for all dropdown data to be fetched
    await fetchAllDropdownData();
      const mapCodesToKeys = (item) => {
      const mappedItem = { ...item };
      
      // Map PROD_CODE to FGPRD_KEY
      if (item.PROD_CODE && !item.FGPRD_KEY) {
        mappedItem.FGPRD_KEY = item.PROD_CODE;
      }
      
      // Map SHADE_CODE to FGSHADE_KEY
      if (item.SHADE_CODE && !item.FGSHADE_KEY) {
        mappedItem.FGSHADE_KEY = item.SHADE_CODE;
      }
      
      // Map PTN_CODE to FGPTN_KEY
      if (item.PTN_CODE && !item.FGPTN_KEY) {
        mappedItem.FGPTN_KEY = item.PTN_CODE;
      }
      
      // Map TYPE_CODE to FGTYPE_KEY
      if (item.TYPE_CODE && !item.FGTYPE_KEY) {
        mappedItem.FGTYPE_KEY = item.TYPE_CODE;
      }
      
      // Map STYLE_CODE to FGSTYLE_CODE if needed
      if (item.STYLE_CODE && !item.FGSTYLE_CODE) {
        mappedItem.FGSTYLE_CODE = item.STYLE_CODE;
      }
      
      return mappedItem;
    };
    
    // Helper function to safely get display name with retry
    const getDisplayNameWithRetry = async (getterFunction, key, maxRetries = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          const result = await getterFunction(key);
          if (result) return result;
          
          // If no result, wait a bit and try again
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error in getDisplayNameWithRetry attempt ${i + 1}:`, error);
        }
      }
      return "";
    };

    const getDisplayStatus = (apiStatus) => {
      const statusMapping = {
        '1': 'O',  // 1 -> Open
        '0': 'C',  // 0 -> Cancel  
        '5': 'S'   // 5 -> Short
      };
      return statusMapping[apiStatus] || 'O';
    };
    
    // Get display names from mappings using the actual API response keys
    const partyName = partyMapping[orderData.PARTY_KEY] || await getDisplayNameWithRetry(getPartyNameByKey, orderData.PARTY_KEY);
    
    // Get branch name by actual ID from API response
    const branchName = orderData.PLACE || await getDisplayNameWithRetry(getBranchNameById, orderData.PARTYDTL_ID);
    
    const brokerName = brokerMapping[orderData.BROKER_KEY] || await getDisplayNameWithRetry(getBrokerNameByKey, orderData.BROKER_KEY);
    const broker1Name = broker1Mapping[orderData.BROKER1_KEY] || await getDisplayNameWithRetry(getBrokerNameByKey, orderData.BROKER1_KEY);
    const salesperson1Name = salesperson1Mapping[orderData.SALEPERSON1_KEY] || await getDisplayNameWithRetry(getSalespersonNameByKey, orderData.SALEPERSON1_KEY);
    const salesperson2Name = salesperson2Mapping[orderData.SALEPERSON2_KEY] || await getDisplayNameWithRetry(getSalespersonNameByKey, orderData.SALEPERSON2_KEY);
    const consigneeName = consigneeMapping[orderData.DISTBTR_KEY] || await getDisplayNameWithRetry(getConsigneeNameByKey, orderData.DISTBTR_KEY);
    const seasonName = seasonMapping[orderData.CURR_SEASON_KEY] || await getDisplayNameWithRetry(getSeasonNameByKey, orderData.CURR_SEASON_KEY);
    const transporterName = transporterMapping[orderData.TRSP_KEY] || await getDisplayNameWithRetry(getTransporterNameByKey, orderData.TRSP_KEY);
    
    // Use SHIPPARTY and SHIPPLACE from API response directly
    const shippingPartyName = orderData.SHIPPARTY || partyMapping[orderData.SHP_PARTY_KEY] || await getDisplayNameWithRetry(getPartyNameByKey, orderData.SHP_PARTY_KEY) || partyName;
    const shippingPlaceName = orderData.SHIPPLACE || orderData.DLV_PLACE || branchName;
    
    const orderTypeName = await getDisplayNameWithRetry(getOrderTypeNameByKey, orderData.ORDBK_TYPE);
    const merchandiserName = merchandiserMapping[orderData.MERCHANDISER_ID] || await getDisplayNameWithRetry(getMerchandiserNameById, orderData.MERCHANDISER_ID);

     const processedOrdbkStyleList = orderData.ORDBKSTYLIST ? orderData.ORDBKSTYLIST.map(item => {
      // First map codes to keys
      const mappedItem = mapCodesToKeys(item);
      
      return {
        ...mappedItem,
        // Ensure all required fields exist
        FGTYPE_KEY: mappedItem.FGTYPE_KEY || "",
        FGSHADE_KEY: mappedItem.FGSHADE_KEY || "",
        FGPTN_KEY: mappedItem.FGPTN_KEY || "",
        FGPRD_KEY: mappedItem.FGPRD_KEY || "",
        FGSTYLE_ID: mappedItem.FGSTYLE_ID || 0,
        FGSTYLE_CODE: mappedItem.FGSTYLE_CODE || "",
        // IMPORTANT: Preserve DBFLAG from API response
        DBFLAG: mappedItem.DBFLAG || "R" // Default to "R" for retrieved
      };
    }) : [];

    console.log('Processed ORDBKSTYLIST with shade keys:', processedOrdbkStyleList.length, 'items');
    console.log('Sample item shade key:', processedOrdbkStyleList[0]?.FGSHADE_KEY);

    const formattedData = {
      apiResponseData: {
        ...orderData,
        ORDBKSTYLIST: processedOrdbkStyleList // Contains FGSHADE_KEY
      },
      ORDER_NO: orderData.ORDBK_NO || "",
      ORDER_DATE: orderData.ORDBK_DT ? formatDateForDisplay(orderData.ORDBK_DT) : "",
      PARTY_ORD_NO: orderData.PORD_REF || "",
      SEASON: seasonName || "",
      ORD_REF_DT: orderData.PORD_DT ? formatDateForDisplay(orderData.PORD_DT) : "",
      ENQ_NO: orderData.Enq_Key || "",
      PARTY_BRANCH: orderData.OrdBk_CoBr_Id || "",
      QUOTE_NO: orderData.QUOTE_NO || "",
      SHIPPING_PARTY: shippingPartyName,
      DIV_PLACE: orderData.DESP_PORT || "",
      AR_SALES: orderData.SALEPERSON1_KEY || "",
      SHIPPING_PLACE: shippingPlaceName,
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
      GST_APPL: orderData.GST_APP || "N",
      GST_TYPE: orderData.GST_TYPE === "S" ? "STATE" : "IGST",
      RACK_MIN: orderData.STK_FLG || "0",
      REGISTERED_DEALER: "0",
      SHORT_CLOSE: "0",
      READY_SI: orderData.READY_SI || "0",
      LAST_ORD_NO: orderData.LAST_ORD_NO || "",
      SERIES: orderData.SERIES || "",
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
      Party: partyName || "",
      Branch: branchName || "",
      Broker: brokerName || "",
      CURR_SEASON_KEY: orderData.CURR_SEASON_KEY || "",
      PRICELIST_KEY: orderData.PRICELIST_KEY || "",
      BROKER1_KEY: orderData.BROKER1_KEY || "",
      SHP_PARTY_KEY: orderData.SHP_PARTY_KEY || orderData.PARTY_KEY,
      DESP_PORT: orderData.DESP_PORT || "",
      SALEPERSON1_KEY: orderData.SALEPERSON1_KEY || "",
      SALEPERSON2_KEY: orderData.SALEPERSON2_KEY || "",
      DISTBTR_KEY: orderData.DISTBTR_KEY || "",
      TRSP_KEY: orderData.TRSP_KEY || "",
      PARTYDTL_ID: orderData.PARTYDTL_ID || 0,
      SHP_PARTYDTL_ID: orderData.SHP_PARTYDTL_ID || orderData.PARTYDTL_ID || 0,
      Order_Type: orderTypeName || "",
      MERCHANDISER_ID: orderData.MERCHANDISER_ID || "",
      MERCHANDISER_NAME: merchandiserName || "",
      Delivery_Shedule: "comman",
      Order_TNA: "ItemWise", 
      Status: getDisplayStatus(orderData.STATUS),
      ORDBK_TYPE: orderData.ORDBK_TYPE || "0",
      TOTAL_QTY: calculateTotalQty(orderData.ORDBKSTYLIST),
      TOTAL_AMOUNT: orderData.ORDBK_AMT || 0,
      NET_AMOUNT: (orderData.ORDBK_AMT || 0) - (orderData.ORDBK_DISC_AMT || 0),
      DISCOUNT: orderData.ORDBK_DISC_AMT || 0
    };

    console.log('Populating form with data including shade keys');
    
    // Set form data
    setFormData(formattedData);
    
    // Fetch branches with the correct branch ID from API response
    if (orderData.PARTY_KEY && orderData.PARTYDTL_ID) {
      await fetchPartyDetails(orderData.PARTY_KEY, orderData.PARTYDTL_ID);
    }
    
    // Set current party key for navigation
    setCurrentPARTY_KEY(orderData.PARTY_KEY);

    // Force update dropdown options in Stepper1
    setTimeout(() => {
      setFormData(prev => ({ ...prev, forceUpdate: Date.now() }));
    }, 100);

  } catch (error) {
    console.error('Error populating form data:', error);
  }
};

// Function to prepare payload for submission - FIXED for empty keys issue
const prepareSubmitPayload = () => {
  const currentDate = new Date().toISOString().replace('T', ' ').split('.')[0];
  
  const userId = localStorage.getItem('USER_ID') || '1';
  const userName = localStorage.getItem('USER_NAME') || 'Admin';
  
  console.log('Mode:', mode);
  console.log('Form Data API Response:', formData.apiResponseData);

  const getStatusValue = (status) => {
    const statusMapping = {
      'O': '1',
      'C': '0',
      'S': '5'
    };
    return statusMapping[status] || "1";
  };
  
  const correctOrdbkKey = formData.ORDBK_KEY || `25${companyConfig.COBR_ID}${formData.ORDER_NO}`;
  const partyKey = formData.PARTY_KEY;
  const branchId = formData.PARTYDTL_ID || 0;
  const brokerKey = formData.BROKER_KEY || "";
  const broker1Key = formData.BROKER1_KEY || "";
  const salesperson1Key = formData.SALEPERSON1_KEY || "";
  const salesperson2Key = formData.SALEPERSON2_KEY || "";
  const consigneeKey = formData.DISTBTR_KEY || "";
  const seasonKey = formData.CURR_SEASON_KEY || "";
  const transporterKey = formData.TRSP_KEY || "";
  const shippingPartyKey = formData.SHP_PARTY_KEY || formData.PARTY_KEY;
  const shippingPartyDtlId = formData.SHP_PARTYDTL_ID || formData.PARTYDTL_ID || 1;
  const merchandiserId = formData.MERCHANDISER_ID || 1;

  // Get ORDBKSTYLIST from formData
  const ordbkStyleList = formData.apiResponseData?.ORDBKSTYLIST || [];
  
  console.log('ORDBKSTYLIST from formData:', ordbkStyleList);

  // Function to generate FGITM_KEY dynamically
  const generateFgItemKey = (item) => {
    const fgprdKey = item.FGPRD_KEY || "";
    const fgstyleId = item.FGSTYLE_ID || "";
    const fgtypeKey = item.FGTYPE_KEY || "";
    const fgshadeKey = item.FGSHADE_KEY || "";
    const fgptnKey = item.FGPTN_KEY || "";
    
    // Clean keys
    const cleanFgprdKey = fgprdKey.trim();
    const cleanFgstyleId = fgstyleId.toString().trim();
    const cleanFgtypeKey = fgtypeKey.trim();
    const cleanFgshadeKey = fgshadeKey.trim();
    const cleanFgptnKey = fgptnKey.trim();
    
    // Build FGITM_KEY based on available components
    let fgItemKey = cleanFgprdKey;
    
    if (cleanFgstyleId) {
      fgItemKey += cleanFgstyleId;
    }
    
    if (cleanFgtypeKey) {
      fgItemKey += cleanFgtypeKey;
    }
    
    if (cleanFgshadeKey) {
      fgItemKey += cleanFgshadeKey;
    }
    
    if (cleanFgptnKey) {
      fgItemKey += cleanFgptnKey;
    }
    
    console.log('Generated FGITM_KEY:', fgItemKey, 'from:', {
      FGPRD_KEY: cleanFgprdKey,
      FGSTYLE_ID: cleanFgstyleId,
      FGTYPE_KEY: cleanFgtypeKey,
      FGSHADE_KEY: cleanFgshadeKey,
      FGPTN_KEY: cleanFgptnKey
    });
    
    return fgItemKey || "";
  };

  // IMPORTANT: Map API response codes to keys
  const mapApiCodesToKeys = (item) => {
    console.log('Mapping API codes to keys for item:', item);
    
    // Initialize with existing keys
    const mappedItem = { ...item };
    
    // Map PROD_CODE to FGPRD_KEY if not already present
    if (!mappedItem.FGPRD_KEY && item.PROD_CODE) {
      console.log('Mapping PROD_CODE to FGPRD_KEY:', item.PROD_CODE);
      mappedItem.FGPRD_KEY = item.PROD_CODE;
    }
    
    // Map SHADE_CODE to FGSHADE_KEY if not already present
    if (!mappedItem.FGSHADE_KEY && item.SHADE_CODE) {
      console.log('Mapping SHADE_CODE to FGSHADE_KEY:', item.SHADE_CODE);
      mappedItem.FGSHADE_KEY = item.SHADE_CODE;
    }
    
    // Map PTN_CODE to FGPTN_KEY if not already present
    if (!mappedItem.FGPTN_KEY && item.PTN_CODE) {
      console.log('Mapping PTN_CODE to FGPTN_KEY:', item.PTN_CODE);
      mappedItem.FGPTN_KEY = item.PTN_CODE;
    }
    
    // Map TYPE_CODE to FGTYPE_KEY if not already present
    if (!mappedItem.FGTYPE_KEY && item.TYPE_CODE) {
      console.log('Mapping TYPE_CODE to FGTYPE_KEY:', item.TYPE_CODE);
      mappedItem.FGTYPE_KEY = item.TYPE_CODE;
    }
    
    console.log('Mapped item:', mappedItem);
    return mappedItem;
  };

  // Transform ORDBKSTYLIST for API with proper DBFLAG handling
  const transformedOrdbkStyleList = ordbkStyleList.map(item => {
    // First map API codes to keys
    const mappedItem = mapApiCodesToKeys(item);
    
    // Determine DBFLAG based on mode and item status
    let itemDbFlag = mappedItem.DBFLAG || (mode === 'add' ? 'I' : 'U');
    
    // If item is marked as deleted in formData, keep it as 'D'
    if (mappedItem.DBFLAG === 'D') {
      itemDbFlag = 'D';
    } 
    // For edit mode, determine if it's new or existing
    else if (mode === 'edit') {
      const isNewItem = mappedItem.ORDBKSTY_ID && mappedItem.ORDBKSTY_ID.toString().length > 9; // Check if temporary ID
      const hasOriginalId = mappedItem.ORDBKSTY_ID && mappedItem.ORDBKSTY_ID > 0 && !isNewItem;
      
      if (isNewItem) {
        itemDbFlag = 'I'; // New item in edit mode
      } else if (hasOriginalId) {
        itemDbFlag = 'U'; // Existing item to update
      } else {
        itemDbFlag = 'I'; // Default to insert for new items
      }
    }

    // Extract all keys from mapped item
    const fgprdKey = mappedItem.FGPRD_KEY || "";
    const fgstyleId = mappedItem.FGSTYLE_ID || "";
    const fgtypeKey = mappedItem.FGTYPE_KEY || "";
    const fgshadeKey = mappedItem.FGSHADE_KEY || "";
    const fgptnKey = mappedItem.FGPTN_KEY || "";
    
    console.log('Extracted keys for item:', {
      FGPRD_KEY: fgprdKey,
      FGSTYLE_ID: fgstyleId,
      FGTYPE_KEY: fgtypeKey,
      FGSHADE_KEY: fgshadeKey,
      FGPTN_KEY: fgptnKey,
      ORDBKSTY_ID: mappedItem.ORDBKSTY_ID
    });

    // Generate FGITM_KEY dynamically
    const fgItemKey = generateFgItemKey({
      FGPRD_KEY: fgprdKey,
      FGSTYLE_ID: fgstyleId,
      FGTYPE_KEY: fgtypeKey,
      FGSHADE_KEY: fgshadeKey,
      FGPTN_KEY: fgptnKey
    });

    // Transform ORDBKSTYSZLIST with correct DBFLAG
    const transformedSizeList = (mappedItem.ORDBKSTYSZLIST || []).map(sizeItem => ({
      DBFLAG: itemDbFlag, // Same DBFLAG as parent item
      ORDBKSTYSZ_ID: sizeItem.ORDBKSTYSZ_ID || 0,
      ORDBK_KEY: correctOrdbkKey,
      ORDBKSTY_ID: mappedItem.ORDBKSTY_ID || 0,
      STYSIZE_ID: sizeItem.STYSIZE_ID || 0,
      STYSIZE_NAME: sizeItem.STYSIZE_NAME || "",
      QTY: parseFloat(sizeItem.QTY) || 0,
      INIT_DT: "1900-01-01 00:00:00.000",
      INIT_REMK: "",
      INIT_QTY: 0,
      BAL_QTY: parseFloat(sizeItem.QTY) || 0,
      MRP: parseFloat(mappedItem.RATE || mappedItem.ITMRATE) || 0,
      WSP: parseFloat(mappedItem.RATE || mappedItem.ITMRATE) || 0,
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
    }));

    return {
      DBFLAG: itemDbFlag,
      ORDBKSTY_ID: mappedItem.ORDBKSTY_ID || 0,
      ORDBK_KEY: correctOrdbkKey,
      FGPRD_KEY: fgprdKey,
      FGSTYLE_ID: fgstyleId,
      FGSTYLE_CODE: mappedItem.FGSTYLE_CODE || mappedItem.STYLE_CODE || "",
      FGTYPE_KEY: fgtypeKey,
      FGSHADE_KEY: fgshadeKey,
      FGPTN_KEY: fgptnKey,
      FGITM_KEY: fgItemKey,
      QTY: parseFloat(mappedItem.QTY || mappedItem.ITMQTY) || 0,
      STYCATRT_ID: mappedItem.STYCATRT_ID || 0,
      RATE: parseFloat(mappedItem.RATE || mappedItem.ITMRATE) || 0,
      AMT: parseFloat(mappedItem.AMT || mappedItem.ITMAMT) || 0,
      DLV_VAR_PERCENT: parseFloat(mappedItem.DLV_VAR_PERCENT || mappedItem.DLV_VAR_PERC) || 0,
      DLV_VAR_QTY: parseFloat(mappedItem.DLV_VAR_QTY) || 0,
      OPEN_RATE: "",
      TERM_KEY: "",
      TERM_NAME: "",
      TERM_PERCENT: 0,
      TERM_FIX_AMT: 0,
      TERM_RATE: 0,
      TERM_PERQTY: 0,
      DISC_AMT: parseFloat(mappedItem.DISC_AMT) || 0,
      NET_AMT: parseFloat(mappedItem.NET_AMT) || 0,
      INIT_DT: "1900-01-01 00:00:00.000",
      INIT_REMK: "",
      INIT_QTY: 0,
      DLV_DT: "1900-01-01 00:00:00.000",
      BAL_QTY: parseFloat(mappedItem.QTY || mappedItem.ITMQTY) || 0,
      STATUS: "1",
      STYLE_PRN: "",
      TYPE_PRN: "",
      MRP_PRN: parseFloat(mappedItem.RATE || mappedItem.ITMRATE) || 0,
      REMK: mappedItem.REMARK || "",
      QUOTEDTL_ID: 0,
      SETQTY: parseFloat(mappedItem.SETQTY) || 0,
      RQTY: 0,
      DISTBTR_KEY: consigneeKey,
      LOTNO: seasonKey,
      WOBALQTY: parseFloat(mappedItem.QTY || mappedItem.ITMQTY) || 0,
      REFORDBKSTY_ID: 0,
      BOMSTY_ID: 0,
      ISRMREQ: "N",
      OP_QTY: 0,
      ORDBKSTYSZLIST: transformedSizeList
    };
  });

  console.log('Transformed ORDBKSTYLIST with keys:', transformedOrdbkStyleList.map(item => ({
    ORDBKSTY_ID: item.ORDBKSTY_ID,
    DBFLAG: item.DBFLAG,
    FGPRD_KEY: item.FGPRD_KEY,
    FGSHADE_KEY: item.FGSHADE_KEY,
    FGITM_KEY: item.FGITM_KEY
  })));

  // Rest of the function remains the same for ORDBKTERMLIST and ORDBKGSTLIST
  // Get ORDBKTERMLIST from formData with proper DBFLAG
  const ordbkTermList = (formData.apiResponseData?.ORDBKTERMLIST || []).map(termItem => {
    let termDbFlag = termItem.DBFLAG || (mode === 'add' ? 'I' : 'U');
    
    if (termItem.DBFLAG === 'D') {
      termDbFlag = 'D';
    } else if (mode === 'edit') {
      const hasOriginalId = termItem.ORDBKTERM_ID && termItem.ORDBKTERM_ID > 0;
      termDbFlag = hasOriginalId ? 'U' : 'I';
    }
    
    return {
      ...termItem,
      DBFLAG: termDbFlag,
      ORDBK_KEY: correctOrdbkKey
    };
  });
  
  // Generate ORDBKGSTLIST only if GST_APPL is "Y"
  let ordbkGstList = [];
  
  if (formData.GST_APPL === "Y") {
    if (formData.apiResponseData?.ORDBKGSTLIST && formData.apiResponseData.ORDBKGSTLIST.length > 0) {
      ordbkGstList = formData.apiResponseData.ORDBKGSTLIST.map(gstItem => {
        let gstDbFlag = gstItem.DBFLAG || (mode === 'add' ? 'I' : 'U');
        
        if (gstItem.DBFLAG === 'D') {
          gstDbFlag = 'D';
        } else if (mode === 'edit') {
          const hasOriginalId = gstItem.ORDBK_GST_ID && gstItem.ORDBK_GST_ID > 0;
          gstDbFlag = hasOriginalId ? 'U' : 'I';
        }

        return {
          DBFLAG: gstDbFlag,
          ORDBK_GST_ID: gstItem.ORDBK_GST_ID || 0,
          GSTTIN_NO: gstItem.GSTTIN_NO || "URD",
          ORDBK_KEY: correctOrdbkKey,
          ORDBK_DT: formatDateForAPI(formData.ORDER_DATE)?.replace('T', ' ') || currentDate,
          GST_TYPE: formData.GST_TYPE === "STATE" ? "S" : "I",
          HSNCODE_KEY: gstItem.HSNCODE_KEY || "IG001",
          HSN_CODE: gstItem.HSN_CODE || "64021010",
          QTY: parseFloat(gstItem.QTY) || 0,
          UNIT_KEY: gstItem.UNIT_KEY || "UN005",
          GST_RATE_SLAB_ID: parseInt(gstItem.GST_RATE_SLAB_ID) || 39,
          ITM_AMT: parseFloat(gstItem.ITM_AMT) || 0,
          DISC_AMT: parseFloat(gstItem.DISC_AMT) || 0,
          NET_AMT: parseFloat(gstItem.NET_AMT) || 0,
          SGST_RATE: parseFloat(gstItem.SGST_RATE) || 0,
          SGST_AMT: parseFloat(gstItem.SGST_AMT) || 0,
          CGST_RATE: parseFloat(gstItem.CGST_RATE) || 0,
          CGST_AMT: parseFloat(gstItem.CGST_AMT) || 0,
          IGST_RATE: parseFloat(gstItem.IGST_RATE) || 0,
          IGST_AMT: parseFloat(gstItem.IGST_AMT) || 0,
          ROUND_OFF: parseFloat(gstItem.ROUND_OFF) || 0,
          OTHER_AMT: parseFloat(gstItem.OTHER_AMT) || 0,
          PARTYDTL_ID: parseInt(branchId) || 106634,
          ADD_CESS_RATE: parseFloat(gstItem.ADD_CESS_RATE) || 0,
          ADD_CESS_AMT: parseFloat(gstItem.ADD_CESS_AMT) || 0
        };
      });
    }
  }

  // Set main DBFLAG based on mode
  const mainDbFlag = mode === 'add' ? 'I' : 'U';

  // Base payload
  const basePayload = {
    DBFLAG: mainDbFlag,
    FCYR_KEY: "25",
    CO_ID: companyConfig.CO_ID, 
    COBR_ID: companyConfig.COBR_ID, 
    ORDBK_NO: formData.ORDER_NO || "",
    CURR_SEASON_KEY: seasonKey,
    ORDBK_X: "",
    ORDBK_TNA_TYPE: "I",
    MERCHANDISER_ID: parseInt(merchandiserId) || 1,
    ORD_EVENT_KEY: "",
    ORG_DLV_DT: formatDateForAPI(formData.ORG_DLV_DT) || "1900-01-01T00:00:00",
    PLANNING: "0",
    STATUS: getStatusValue(formData.Status),
    ORDBK_KEY: correctOrdbkKey,
    ORDBK_DT: formatDateForAPI(formData.ORDER_DATE),
    PORD_REF: formData.PARTY_ORD_NO || "",
    PORD_DT: formatDateForAPI(formData.ORD_REF_DT),
    QUOTE_NO: formData.QUOTE_NO || "",
    QUOTE_DT: formatDateForAPI(formData.ORDER_DATE),
    PARTY_KEY: partyKey,
    PARTYDTL_ID: parseInt(branchId) || 100003,
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
    CURRN_KEY: formData.CURRN_KEY || "",
    EX_RATE: parseFloat(formData.EX_RATE) || 0,
    IMP_ORDBK_KEY: "",
    ORDBK_TYPE: formData.ORDBK_TYPE || "2",
    ROUND_OFF_DESC: "",
    ROUND_OFF: 0.00,
    BOMSTY_ID: 0,
    LOTWISE: formData.MAIN_DETAILS === "L" ? "Y" : "N",
    IsWO: "0",
    SuplKey: "",
    KNIT_DT: "1900-01-01 00:00:00.000",
    OrdBk_CoBr_Id: formData.PARTY_BRANCH || "02",
    GR_AMT: parseFloat(formData.TOTAL_AMOUNT) || 0,
    GST_APP: formData.GST_APPL || "N",
    GST_TYPE: formData.GST_TYPE === "STATE" ? "S" : "I",
    SHP_PARTY_KEY: shippingPartyKey,
    SHP_PARTYDTL_ID: parseInt(shippingPartyDtlId) || 100003,
    STATE_CODE: "",
    ORDBK_ITM_AMT: parseFloat(formData.ORDBK_ITM_AMT) || 0,
    ORDBK_SGST_AMT: parseFloat(formData.ORDBK_SGST_AMT) || 0,
    ORDBK_CGST_AMT: parseFloat(formData.ORDBK_CGST_AMT) || 0,
    ORDBK_IGST_AMT: parseFloat(formData.ORDBK_IGST_AMT) || 0,
    ORDBK_ADD_CESS_AMT: 0,
    ORDBK_GST_AMT: parseFloat(formData.ORDBK_GST_AMT) || 0,
    ORDBK_EXTRA_AMT: 0,
    ORDBKSTYLIST: transformedOrdbkStyleList,
    ORDBKTERMLIST: ordbkTermList,
    ORDBKGSTLIST: ordbkGstList,
    DISTBTR_KEY: consigneeKey,
    SALEPERSON1_KEY: salesperson1Key,
    SALEPERSON2_KEY: salesperson2Key,
    TRSP_KEY: transporterKey,
    PRICELIST_KEY: formData.PRICELIST_KEY || "",
    DESP_PORT: formData.DESP_PORT || "",
  };

  // Add user fields based on operation type
  if (mainDbFlag === 'I') {
    basePayload.CREATED_BY = parseInt(userId) || 1;
    basePayload.CREATED_DT = currentDate;
  } else {
    basePayload.UPDATED_BY = parseInt(userId) || 1;
    basePayload.UPDATED_DT = currentDate;
  }

  console.log('Final Payload for', mode === 'add' ? 'INSERT' : 'UPDATE');
  console.log('Main DBFLAG:', mainDbFlag);
  console.log('ORDBKSTYLIST items count:', transformedOrdbkStyleList.length);
  
  return basePayload;
};

  // Rest of your existing functions remain the same...
  const handleTable = () => {
    router.push('/inverntory/stock-enquiry-table');
  };

  const handlePrev = () => {
  if (tabIndex > 0) {
    setTabIndex(tabIndex - 1);
  }
}

const handlePrevClick = async () => {
  if (mode !== 'view') return;
  
  try {
    setLoading(true);
    const payload = {
      ORDBK_KEY: formData.ORDBK_KEY,
      FLAG: "N" 
    };

    console.log('Fetching previous order with payload:', payload);

    const response = await axiosInstance.post('/ORDBK/RetriveOrder', payload);
    console.log('Previous Order API Response:', response.data);

    if (response.data.RESPONSESTATUSCODE === 1 && response.data.DATA.ORDBKList.length > 0) {
      const orderData = response.data.DATA.ORDBKList[0];
      // Update the current ORDBK_KEY for next navigation
      setFormData(prev => ({
        ...prev,
        ORDBK_KEY: orderData.ORDBK_KEY
      }));
      await populateFormData(orderData);
      setCurrentPARTY_KEY(orderData.PARTY_KEY);
      // showSnackbar('Previous order loaded');
    } else {
      // showSnackbar('No previous order found', 'info');
    }
  } catch (error) {
    console.error('Error fetching previous order:', error);
    showSnackbar('Error loading previous order', 'error');
  } finally {
    setLoading(false);
  }
};

const handleNextClick = async () => {
  if (mode !== 'view') return;
  
  try {
    setLoading(true);
    const payload = {
      ORDBK_KEY: formData.ORDBK_KEY,
      FLAG: "P"
    };

    console.log('Fetching next order with payload:', payload);

    const response = await axiosInstance.post('/ORDBK/RetriveOrder', payload);
    console.log('Next Order API Response:', response.data);

    if (response.data.RESPONSESTATUSCODE === 1 && response.data.DATA.ORDBKList.length > 0) {
      const orderData = response.data.DATA.ORDBKList[0];
      // Update the current ORDBK_KEY for next navigation
      setFormData(prev => ({
        ...prev,
        ORDBK_KEY: orderData.ORDBK_KEY
      }));
      await populateFormData(orderData);
      setCurrentPARTY_KEY(orderData.PARTY_KEY);
      // showSnackbar('Next order loaded');
    } else {
      // showSnackbar('No next order found', 'info');
    }
  } catch (error) {
    console.error('Error fetching next order:', error);
    // showSnackbar('Error loading next order', 'error');
  } finally {
    setLoading(false);
  }
};

  // Calculate total quantity from ORDBKSTYLIST
  const calculateTotalQty = (ordbkStyleList) => {
    if (!ordbkStyleList || !Array.isArray(ordbkStyleList)) return 0;
    
    return ordbkStyleList.reduce((total, item) => {
      return total + (parseFloat(item.ITMQTY) || 0);
    }, 0);
  };

  // Helper functions to get names from keys
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
    console.log('Branch by ID response for ID:', branchId, response.data);
    
    if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
      const branch = response.data.DATA.find(item => item.PARTYDTL_ID === branchId);
      console.log('Found branch:', branch);
      return branch ? branch.PLACE : "";
    }
    return "";
  } catch (error) {
    console.error("Error fetching branch name:", error);
    return "";
  }
};

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

  const getMerchandiserNameById = async (merchandiserId) => {
    if (!merchandiserId) return "";
    try {
      const payload = {
        "FLAG": "MECH"
      };
      const response = await axiosInstance.post('/USERS/GetUserLoginDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const merchandiser = response.data.DATA.find(item => item.USER_ID === parseInt(merchandiserId));
        return merchandiser ? merchandiser.USER_NAME : "";
      }
      return "";
    } catch (error) {
      console.error('Error fetching merchandiser name:', error);
      return "";
    }
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === "1900-01-01T00:00:00") return "";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch (error) {
      console.error('Error formatting date:', error);
      return "";
    }
  };

  // Helper function to format date for API (YYYY-MM-DD)
  const formatDateForAPI = (dateString) => {
    if (!dateString || dateString === "1900-01-01T00:00:00") return "1900-01-01T00:00:00";
    
    try {
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;
      }
      
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
        "COBR_ID": companyConfig.COBR_ID,
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

  // Function to validate form data - SIMPLIFIED VALIDATION
  const validateForm = () => {
    const requiredFields = [
      { field: 'Party', name: 'Party' },
      { field: 'ORDER_NO', name: 'Order No' },
      { field: 'ORDER_DATE', name: 'Order Date' }
    ];

    const missingFields = requiredFields.filter(item => !formData[item.field]);

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(item => item.name).join(', ');
      showSnackbar(`Please fill required fields: ${fieldNames}`, 'error');
      return false;
    }

    // Validate Stepper2 data if we have items
    if (formData.apiResponseData?.ORDBKSTYLIST && formData.apiResponseData.ORDBKSTYLIST.length > 0) {
      const items = formData.apiResponseData.ORDBKSTYLIST;
      for (let item of items) {
        if (!item.PRODUCT || !item.STYLE || !item.ITMQTY || item.ITMQTY <= 0) {
          showSnackbar('Please ensure all items have Product, Style, and valid Quantity', 'error');
          return false;
        }
      }
    } else {
      showSnackbar('Please add at least one item in Details tab', 'error');
      return false;
    }

    return true;
  };

  // Function to submit form data
  const handleSubmit = async () => {
    setShowValidationErrors(true);
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      
      const userName = localStorage.getItem('USER_NAME') || 'ankita';
      const strCobrid = "02";
      
      const payload = prepareSubmitPayload();
      
      console.log('Submitting order with payload:', payload);
      
      const response = await axiosInstance.post(`/ORDBK/ApiMangeOrdbk?UserName=${userName}&strCobrid=${strCobrid}`, payload);
      console.log('Submit API Response:', response.data);
      
      if (response.data.RESPONSESTATUSCODE === 1) {
        showSnackbar("Order submitted successfully!");
        setMode('view');
        setIsFormDisabled(true);
        setTabIndex(0)
        if (formData.ORDBK_KEY) {
          fetchOrderDetails(formData.ORDBK_KEY);
        }
      } else {
        showSnackbar("Error submitting order: " + (response.data.RESPONSEMESSAGE || "Unknown error"), 'error');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      showSnackbar("Error submitting order. Please try again.", 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Function to get order number
  const getOrderNumber = async (prefix) => {
    try {
      const payload = {
        "MODULENAME": "Ordbk",
        "TBLNAME": "Ordbk",
        "FLDNAME": "Ordbk_No",
        "NCOLLEN": 6,
        "CPREFIX": prefix,
        "COBR_ID": companyConfig.COBR_ID,
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

// Function to fetch party branches - ADD THIS FUNCTION
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
      
      const mapping = {};
      response.data.DATA.forEach(item => {
        if (item.PLACE && item.PARTYDTL_ID) {
          mapping[item.PLACE] = item.PARTYDTL_ID;
        }
      });
      setBranchMapping(mapping);
      console.log('Branch mapping set with', Object.keys(mapping).length, 'branches');
    }
  } catch (error) {
    console.error("Error fetching party details:", error);
  } finally {
    setLoadingBranches(false);
  }
};



const handleAdd = async () => {
  try {
    setLoading(true);
    
    // Get today's date
    const todayDate = getTodayDate();
    
    // Clear all form data for new entry but set today's date for date fields and default values
    const emptyFormData = {
      ORDER_NO: "",
      ORDER_DATE: todayDate,
      PARTY_ORD_NO: "",
      SEASON: "",
      ORD_REF_DT: todayDate,
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
      GST_APPL: "N",
      RACK_MIN: "0",
      REGISTERED_DEALER: "0",
      SHORT_CLOSE: "0",
      READY_SI: "0",
      SearchByCd: "",
      LAST_ORD_NO: "",
      SERIES: "",
      ORDBK_KEY: "",
      ORD_EVENT_KEY: "",
      ORG_DLV_DT: todayDate,
      PLANNING: "0",
      PARTY_KEY: "",
      ORDBK_AMT: "",
      ORDBK_ITM_AMT: "",
      ORDBK_GST_AMT: "",
      ORDBK_DISC_AMT: "",
      CURRN_KEY: "",
      EX_RATE: "",
      DLV_DT: todayDate,
      TOTAL_QTY: 0,
      TOTAL_AMOUNT: 0,
      NET_AMOUNT: 0,
      DISCOUNT: 0,
      Party: "",
      Branch: "",
      Broker: "",
      Transporter: "",
      SALESPERSON_1: "",
      ord_event: "",
      CURR_SEASON_KEY: "",
      PRICELIST_KEY: "",
      BROKER1_KEY: "",
      SHP_PARTY_KEY: "",
      DESP_PORT: "",
      SALEPERSON1_KEY: "",
      SALEPERSON2_KEY: "",
      DISTBTR_KEY: "",
      TRSP_KEY: "",
      apiResponseData: null,
      PARTYDTL_ID: 0,
      SHP_PARTYDTL_ID: 0,
      Order_Type: "Sales And Work-Order",
      MERCHANDISER_ID: "",
      MERCHANDISER_NAME: "",
      Delivery_Shedule: "comman",
      Order_TNA: "ItemWise",
      Status: "O",
      ORDBK_TYPE: "2"
    };
    
    // Get series prefix first
    const prefix = await getSeriesPrefix();
    
    if (prefix) {
      // Get order number using the prefix
      const orderData = await getOrderNumber(prefix);
      
      if (orderData) {
        // CORRECT ORDBK_KEY generation: FCYR_KEY + COBR_ID + ORDBK_NO
        const correctOrdbkKey = `2502${orderData.orderNo}`;
        
        // Update form data with new order numbers
        const formDataWithOrderNo = {
          ...emptyFormData,
          ORDER_NO: orderData.orderNo,
          LAST_ORD_NO: orderData.lastOrderNo,
          SERIES: prefix,
          ORDBK_KEY: correctOrdbkKey
        };
        
        console.log('Generated ORDBK_KEY:', correctOrdbkKey);
        
        // Set the form data with order numbers
        setFormData(formDataWithOrderNo);
        
        // Set mode first to enable form
        setMode('add');
        setIsFormDisabled(false);
        
        // NEW: Wait for dropdown data to load
        await fetchAllDropdownData();
        
        // Get the first party from partyMapping
        if (Object.keys(partyMapping).length > 0) {
          const firstPartyName = Object.keys(partyMapping)[0];
          const firstPartyKey = partyMapping[firstPartyName];
          
          console.log('Auto-selecting first party:', firstPartyName, 'Key:', firstPartyKey);
          
          if (firstPartyName && firstPartyKey) {
            // Auto-populate party
            setFormData(prev => ({
              ...prev,
              Party: firstPartyName,
              PARTY_KEY: firstPartyKey,
              SHIPPING_PARTY: firstPartyName,
              SHP_PARTY_KEY: firstPartyKey
            }));
            
            // Fetch branches for the selected party
            await fetchPartyDetails(firstPartyKey);
            
            // Fetch party details for auto-population
            await fetchPartyDetailsForAutoFill(firstPartyKey);
            
            // Show success message
            // showSnackbar(`Party "${firstPartyName}" auto-selected successfully!`);
          }
        }
      }
    } else {
      setFormData(emptyFormData);
      setMode('add');
      setIsFormDisabled(false);
    }
    
    setShowValidationErrors(false); 
  } catch (error) {
    console.error('Error in handleAdd:', error);
    // showSnackbar('Error creating new order', 'error');
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setMode('view');
    setIsFormDisabled(true);
    // showSnackbar('Edit cancelled');
    setShowValidationErrors(false);
  };

  const handleEdit = () => {
    setMode('edit');
    setIsFormDisabled(false);
    // showSnackbar('Edit mode enabled');
  };

  // Function to handle delete with API call
const handleDelete = async () => {
  if (!formData.ORDBK_KEY) {
    showSnackbar('No order selected for deletion', 'error');
    return;
  }

  // Confirmation dialog
  if (!window.confirm('Are you sure you want to delete this order permanently?')) {
    return;
  }

  try {
    setLoading(true);
    
    const payload = {
      "ORDBK_KEY": formData.ORDBK_KEY
    };

    console.log('Deleting order with payload:', payload);

    const response = await axiosInstance.post('/ORDBK/DELETE_ORDBK', payload);
    console.log('Delete API Response:', response.data);

    if (response.data.RESPONSESTATUSCODE === 1) {
      showSnackbar('Order deleted successfully!', 'success');
      
      // Reset form after successful deletion
      const todayDate = getTodayDate();
      const emptyFormData = {
        ORDER_NO: "",
        ORDER_DATE: todayDate,
        PARTY_ORD_NO: "",
        SEASON: "",
        ORD_REF_DT: todayDate,
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
        GST_APPL: "N",
        RACK_MIN: "0",
        REGISTERED_DEALER: "0",
        SHORT_CLOSE: "0",
        READY_SI: "0",
        SearchByCd: "",
        LAST_ORD_NO: "",
        SERIES: "",
        ORDBK_KEY: "",
        ORD_EVENT_KEY: "",
        ORG_DLV_DT: todayDate,
        PLANNING: "0",
        PARTY_KEY: "",
        ORDBK_AMT: "",
        ORDBK_ITM_AMT: "",
        ORDBK_GST_AMT: "",
        ORDBK_DISC_AMT: "",
        CURRN_KEY: "",
        EX_RATE: "",
        DLV_DT: todayDate,
        TOTAL_QTY: 0,
        TOTAL_AMOUNT: 0,
        NET_AMOUNT: 0,
        DISCOUNT: 0,
        Party: "",
        Branch: "",
        Broker: "",
        Transporter: "",
        SALESPERSON_1: "",
        ord_event: "",
        CURR_SEASON_KEY: "",
        PRICELIST_KEY: "",
        BROKER1_KEY: "",
        SHP_PARTY_KEY: "",
        DESP_PORT: "",
        SALEPERSON1_KEY: "",
        SALEPERSON2_KEY: "",
        DISTBTR_KEY: "",
        TRSP_KEY: "",
        apiResponseData: null,
        PARTYDTL_ID: 0,
        SHP_PARTYDTL_ID: 0,
        Order_Type: "Sales And Work-Order",
        MERCHANDISER_ID: "",
        MERCHANDISER_NAME: "",
        Delivery_Shedule: "comman",
        Order_TNA: "ItemWise",
        Status: "O",
        ORDBK_TYPE: "2"
      };
      
      setFormData(emptyFormData);
      setMode('view');
      setIsFormDisabled(true);
      setCurrentPARTY_KEY("");
      
      // Get new order number for fresh start
      const prefix = await getSeriesPrefix();
      if (prefix) {
        const orderData = await getOrderNumber(prefix);
        if (orderData) {
          const correctOrdbkKey = `2502${orderData.orderNo}`;
          setFormData(prev => ({
            ...emptyFormData,
            ORDER_NO: orderData.orderNo,
            LAST_ORD_NO: orderData.lastOrderNo,
            SERIES: prefix,
            ORDBK_KEY: correctOrdbkKey
          }));
        }
      }
    } else {
      showSnackbar('Error deleting order: ' + (response.data.RESPONSEMESSAGE || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    showSnackbar('Error deleting order. Please try again.', 'error');
  } finally {
    setLoading(false);
  }
};

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handle Next button click
  const handleNext = () => {
    if (tabIndex < 2) {
      setTabIndex(tabIndex + 1);
    }
  };

  // Fetch Order Type Data from API
  const fetchOrderTypeData = async () => {
    try {
      const payload = {
        "ORDBK_KEY": "",
        "FLAG": "ORDTYPE",
        "FCYR_KEY": "25",
        "COBR_ID": companyConfig.COBR_ID,
        "PageNumber": 1,
        "PageSize": 25,
        "SearchText": "",
        "PARTY_KEY": "",
        "PARTYDTL_ID": 0
      };

      const response = await axiosInstance.post('/ORDBK/GetOrdbkDrp', payload);
      console.log('Order Type API Response:', response.data);

      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const orderTypes = response.data.DATA.map(item => item.ORDBK_TYPE_NM || '');
        
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
      console.error('Error fetching order type data:', error);
      return [];
    }
  };

  // Fetch Party Details for auto-population
  const fetchPartyDetailsForAutoFill = async (partyKey) => {
    if (!partyKey) return;
    
    try {
      const payload = {
        "PARTY_KEY": partyKey,
        "Flag": ""
      };

      const response = await axiosInstance.post('/Party/GetParty', payload);
      console.log('Party Details API Response:', response.data);

      if (response.data.DATA && Array.isArray(response.data.DATA) && response.data.DATA.length > 0) {
        const partyData = response.data.DATA[0];
        
        // Auto-populate fields from party data
        const updates = {};
        
        // Broker
        if (partyData.BROKER_NAME && partyData.BROKER_KEY) {
          updates.Broker = partyData.BROKER_NAME;
          updates.BROKER_KEY = partyData.BROKER_KEY;
          setBrokerMapping(prev => ({
            ...prev,
            [partyData.BROKER_NAME]: partyData.BROKER_KEY
          }));
        }
        
        // Broker1
        if (partyData.BROKER1_NAME && partyData.BROKER1_KEY) {
          updates.BROKER1 = partyData.BROKER1_NAME;
          updates.BROKER1_KEY = partyData.BROKER1_KEY;
          setBroker1Mapping(prev => ({
            ...prev,
            [partyData.BROKER1_NAME]: partyData.BROKER1_KEY
          }));
        }
        
        // Salesperson 1
        if (partyData.SALEPERSON_NAME && partyData.SALEPERSON1_KEY) {
          updates.SALESPERSON_1 = partyData.SALEPERSON_NAME;
          updates.SALEPERSON1_KEY = partyData.SALEPERSON1_KEY;
          setSalesperson1Mapping(prev => ({
            ...prev,
            [partyData.SALEPERSON_NAME]: partyData.SALEPERSON1_KEY
          }));
        }
        
        // Salesperson 2
        if (partyData.SALEPERSON2_NAME && partyData.SALEPERSON2_KEY) {
          updates.SALESPERSON_2 = partyData.SALEPERSON2_NAME;
          updates.SALEPERSON2_KEY = partyData.SALEPERSON2_KEY;
          setSalesperson2Mapping(prev => ({
            ...prev,
            [partyData.SALEPERSON2_NAME]: partyData.SALEPERSON2_KEY
          }));
        }
        
        // Consignee
        if (partyData.DISTBTR_NAME && partyData.DISTBTR_KEY) {
          updates.CONSIGNEE = partyData.DISTBTR_NAME;
          updates.DISTBTR_KEY = partyData.DISTBTR_KEY;
          setConsigneeMapping(prev => ({
            ...prev,
            [partyData.DISTBTR_NAME]: partyData.DISTBTR_KEY
          }));
        }
        
        // Transporter
        if (partyData.TRSP_NAME && partyData.TRSP_KEY) {
          updates.Transporter = partyData.TRSP_NAME;
          updates.TRSP_KEY = partyData.TRSP_KEY;
          setTransporterMapping(prev => ({
            ...prev,
            [partyData.TRSP_NAME]: partyData.TRSP_KEY
          }));
        }
        
        // Delivery Place
        if (partyData.DLV_PLACE) {
          updates.SHIPPING_PLACE = partyData.DLV_PLACE;
        }
        
        // Commission Rate
        if (partyData.COMM_RATE !== null && partyData.COMM_RATE !== undefined) {
          updates.Comm = partyData.COMM_RATE.toString();
        }
        
        // Apply updates to form data
        if (Object.keys(updates).length > 0) {
          setFormData(prev => ({
            ...prev,
            ...updates
          }));
          
          // showSnackbar('Party details auto-populated successfully!');
        }
      }
    } catch (error) {
      console.error('Error fetching party details for auto-fill:', error);
    }
  };

  // Update fetchAllDropdownData to return a promise and ensure proper sequencing
const fetchAllDropdownData = async () => {
  try {
    console.log('Starting to fetch all dropdown data...');
    const partyResponse = await axiosInstance.post("Party/GetParty_By_Name", { PARTY_NAME: "" });
    
    // Process party data
    if (partyResponse.data.STATUS === 0 && Array.isArray(partyResponse.data.DATA)) {
      const partyMap = {};
      const partyNames = [];
      
      partyResponse.data.DATA.forEach(item => {
        if (item.PARTY_NAME && item.PARTY_KEY) {
          partyMap[item.PARTY_KEY] = item.PARTY_NAME;
          partyNames.push(item.PARTY_NAME);
        }
      });
      
      setPartyMapping(partyMap);
      // Store party names in state or directly use from mapping
      // You might need to pass partyNames to Stepper1 or store in state
    }
    
    // Use Promise.all to fetch all data in parallel but wait for all to complete
    const [
      orderTypes,

      brokerResponse,
      salespersonResponse,
      consigneeResponse,
      seasonResponse,
      transporterResponse,
      merchandiserResponse
    ] = await Promise.all([
      fetchOrderTypeData(),
      axiosInstance.post("Party/GetParty_By_Name", { PARTY_NAME: "" }),
      axiosInstance.post('/BROKER/GetBrokerDrp', {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "BROKER_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      }),
      axiosInstance.post('/SALEPERSON/GetSALEPERSONDrp', {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "SALEPERSON_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      }),
      axiosInstance.post('/DISTBTR/GetDISTBTRDrp', {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "DISTBTR_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      }),
      axiosInstance.post('/SEASON/GetSEASONDrp', {
        "FLAG": "P",
        "TBLNAME": "SEASON",
        "FLDNAME": "SEASON_KEY",
        "ID": "",
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": ""
      }),
      axiosInstance.post('/TRSP/GetTRSPDrp', {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "TRSP_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      }),
      axiosInstance.post('/USERS/GetUserLoginDrp', {
        "FLAG": "MECH"
      })
    ]);

    // Process party data
    if (partyResponse.data.STATUS === 0 && Array.isArray(partyResponse.data.DATA)) {
      const partyMap = {};
      partyResponse.data.DATA.forEach(item => {
        if (item.PARTY_NAME && item.PARTY_KEY) {
          partyMap[item.PARTY_KEY] = item.PARTY_NAME;
        }
      });
      setPartyMapping(partyMap);
    }

    // Process broker data
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

    // Process salesperson data
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

    // Process consignee data
    if (consigneeResponse.data.DATA && Array.isArray(consigneeResponse.data.DATA)) {
      const consigneeMap = {};
      consigneeResponse.data.DATA.forEach(item => {
        if (item.DISTBTR_NAME && item.DISTBTR_KEY) {
          consigneeMap[item.DISTBTR_KEY] = item.DISTBTR_NAME;
        }
      });
      setConsigneeMapping(consigneeMap);
    }

    // Process season data
    if (seasonResponse.data.DATA && Array.isArray(seasonResponse.data.DATA)) {
      const seasonMap = {};
      seasonResponse.data.DATA.forEach(item => {
        if (item.SEASON_NAME && item.SEASON_KEY) {
          seasonMap[item.SEASON_KEY] = item.SEASON_NAME;
        }
      });
      setSeasonMapping(seasonMap);
    }

    // Process transporter data
    if (transporterResponse.data.DATA && Array.isArray(transporterResponse.data.DATA)) {
      const transporterMap = {};
      transporterResponse.data.DATA.forEach(item => {
        if (item.TRSP_NAME && item.TRSP_KEY) {
          transporterMap[item.TRSP_KEY] = item.TRSP_NAME;
        }
      });
      setTransporterMapping(transporterMap);
    }

    // Process merchandiser data
    if (merchandiserResponse.data.DATA && Array.isArray(merchandiserResponse.data.DATA)) {
      const merchandiserMap = {};
      merchandiserResponse.data.DATA.forEach(item => {
        if (item.USER_NAME && item.USER_ID) {
          merchandiserMap[item.USER_NAME] = item.USER_ID;
        }
      });
      setMerchandiserMapping(merchandiserMap);
    }

    console.log('All dropdown data fetched successfully');
    return true;

  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    return false;
  }
};

  // Update getOrderTypeNameByKey to use API data
  const getOrderTypeNameByKey = async (ordbkType) => {
    if (!ordbkType) return "";
    try {
      const orderTypes = await fetchOrderTypeData();
      const orderTypeEntry = Object.entries(orderTypeMapping).find(([key, value]) => value === ordbkType);
      return orderTypeEntry ? orderTypeEntry[0] : "";
    } catch (error) {
      console.error('Error fetching order type name:', error);
      return "";
    }
  };

  const handlePrint = () => { }
  
  const handleExit = () => {
    router.push('/inventorypage');
  };

if (loading || isDataLoading) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
      <Typography>Loading order data...</Typography>
    </Box>
  );
}

  return (
    <Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
            {tabIndex === 0 ? "Sales Order " : tabIndex === 1 ? "Item Details" : "Terms Details"}
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
          <TbListSearch onClick={handleTable} style={{ color: 'rgb(99, 91, 255)', width: '50%', height: '62%' }} />
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

      <Grid xs={12} sx={{ ml: '5%', mb: '0.5%', mt: '0%' }}>
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
            onNext={handleNext}
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
            orderTypeMapping={orderTypeMapping}
            merchandiserMapping={merchandiserMapping}
            setPartyMapping={setPartyMapping}
            setBranchMapping={setBranchMapping}
            setBrokerMapping={setBrokerMapping}
            setBroker1Mapping={setBroker1Mapping}
            setSalesperson1Mapping={setSalesperson1Mapping}
            setSalesperson2Mapping={setSalesperson2Mapping}
            setConsigneeMapping={setConsigneeMapping}
            setSeasonMapping={setSeasonMapping}
            setTransporterMapping={setTransporterMapping}
            setOrderTypeMapping={setOrderTypeMapping}
            setMerchandiserMapping={setMerchandiserMapping}
            showSnackbar={showSnackbar}
            showValidationErrors={showValidationErrors}
            fetchPartyDetailsForAutoFill={fetchPartyDetailsForAutoFill}
            isDataLoading={isDataLoading}
            branchOptions={[]} 
            setBranchOptions={setBranchOptions} 
          />
        ) : tabIndex === 1 ? (
          <Stepper2 
            formData={formData} 
            setFormData={setFormData} 
            isFormDisabled={isFormDisabled}
            mode={mode}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onNext={handleNext}
            onPrev={handlePrev} 
            showSnackbar={showSnackbar}
            showValidationErrors={showValidationErrors}
            companyConfig={companyConfig} 
          />
        ) : (
          <Stepper3 
            formData={formData} 
            setFormData={setFormData} 
            isFormDisabled={isFormDisabled}
            mode={mode}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onPrev={handlePrev} 
            showSnackbar={showSnackbar}
          />
        )}
      </Grid>

      {tabIndex === 0 && (
        <Grid xs={12} sx={{ display: "flex", justifyContent: "end", mr: '4.5%', gap: 1 }}>
          {mode === 'view' && (
            <>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#39ace2',
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
                  backgroundColor: '#39ace2',
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
                color="primary"
                sx={{
                  margin: { xs: '0 4px', sm: '0 6px' },
                  backgroundColor: '#39ace2',
                  color: '#fff',
                  minWidth: { xs: 40, sm: 46, md: 60 },
                  height: { xs: 40, sm: 46, md: 30 },
                }}
                onClick={handleNext}
              >
                Next
              </Button>
              <Button
                variant="outlined" 
                color="secondary" 
                sx={{
                  margin: { xs: '0 4px', sm: '0 6px' },
                  minWidth: { xs: 40, sm: 46, md: 60 },
                  height: { xs: 40, sm: 46, md: 30 },
                }}
                onClick={handleCancel}
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