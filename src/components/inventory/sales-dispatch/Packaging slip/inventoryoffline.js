'use client';
import React, { useEffect, useState, useCallback, Suspense } from "react";
import {
  Box, TextField, Grid, Typography, Tabs, Tab, Button, Snackbar, Alert, CircularProgress,
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
import Stepper4 from "./stepper4";
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
const [detailMode, setDetailMode] = useState('style');
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
    PACK_KEY: "",
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

  // In SalesOrderOffline.js - Add this to handle URL parameters
useEffect(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const packKey = searchParams.get('packKey');
  const packNo = searchParams.get('packNo');
  
  if (packKey) {
    console.log("Got PACK_KEY from URL:", packKey);
    fetchOrderDetails(packKey);
  } else if (ordbkKey) {
    console.log("Got ORDBK_KEY from URL:", ordbkKey);
    fetchOrderDetails(ordbkKey);
  }
}, [ordbkKey]);

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


// Update the fetchOrderDetails function
const fetchOrderDetails = async (packKey) => {
  try {
    setLoading(true);
    setIsDataLoading(true);

    const payload = {
      PACK_KEY: packKey,
      FLAG: "R"
    };

    const response = await axiosInstance.post('/PACK/RetrivePACK', payload);

    if (response.data.RESPONSESTATUSCODE === 1 && response.data.DATA.PACKList.length > 0) {
      const orderData = response.data.DATA.PACKList[0];
      
      // Set detailMode based on BARCD_FLG
      if (orderData.BARCD_FLG === "1") {
        setDetailMode('barcode');
      } else {
        setDetailMode('style');
      }
      
      await populateFormData(orderData);
      setCurrentPARTY_KEY(orderData.PARTY_KEY);
    }
  } catch (error) {
    console.error('Error fetching PACK details:', error);
    showSnackbar('Error fetching order details', 'error');
  } finally {
    setLoading(false);
    setIsDataLoading(false);
  }
};

useEffect(() => {
  fetchAllDropdownData();
}, []);

// Update populateFormData to handle BARCD_FLG and item consolidation
const populateFormData = async (packData) => {
  try {
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
      
      return mappedItem;
    };

    // Helper function to safely get display name with retry
    const getDisplayNameWithRetry = async (getterFunction, key, maxRetries = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          const result = await getterFunction(key);
          if (result) return result;
          
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

    // Get display names from mappings
    const partyName = partyMapping[packData.PARTY_KEY] || await getDisplayNameWithRetry(getPartyNameByKey, packData.PARTY_KEY);
    const branchName = packData.DLV_PLACE || await getDisplayNameWithRetry(getBranchNameById, packData.PARTYDTL_ID);
    const brokerName = brokerMapping[packData.BROKER_KEY] || await getDisplayNameWithRetry(getBrokerNameByKey, packData.BROKER_KEY);
    const broker1Name = broker1Mapping[packData.BROKER1_KEY] || await getDisplayNameWithRetry(getBrokerNameByKey, packData.BROKER1_KEY);
    const salesperson1Name = salesperson1Mapping[packData.SALEPERSON1_KEY] || await getDisplayNameWithRetry(getSalespersonNameByKey, packData.SALEPERSON1_KEY);
    const salesperson2Name = salesperson2Mapping[packData.SALEPERSON2_KEY] || await getDisplayNameWithRetry(getSalespersonNameByKey, packData.SALEPERSON2_KEY);
    const consigneeName = consigneeMapping[packData.DISTBTR_KEY] || await getDisplayNameWithRetry(getConsigneeNameByKey, packData.DISTBTR_KEY);
    const seasonName = seasonMapping[packData.CURR_SEASON_KEY] || await getDisplayNameWithRetry(getSeasonNameByKey, packData.CURR_SEASON_KEY);
    const transporterName = transporterMapping[packData.TRSP_KEY] || await getDisplayNameWithRetry(getTransporterNameByKey, packData.TRSP_KEY);
    const merchandiserName = merchandiserMapping[packData.MERCHANDISER_ID] || await getDisplayNameWithRetry(getMerchandiserNameById, packData.MERCHANDISER_ID);

    // Process PACKITMLIST (items)
    let processedPackItemList = packData.PACKITMLIST ? packData.PACKITMLIST.map(item => {
      const mappedItem = mapCodesToKeys(item);
      
      return {
        ...mappedItem,
        ORDBKSTY_ID: item.PACKITM_ID,
        FGITEM_KEY: item.FGITM_KEY,
        PRODUCT: item.PRODUCT,
        STYLE: item.FGSTYLE_CODE,
        TYPE: item.TYPE,
        SHADE: item.SHADE,
        PATTERN: item.PATTERN,
        ITMQTY: item.PACK_QTY,
        ITMRATE: item.RATE,
        ITMAMT: item.AMT,
        ORDBKSTYSZLIST: item.PACKITMSZLIST ? item.PACKITMSZLIST.map(sizeItem => ({
          ...sizeItem,
          ORDBKSTYSZ_ID: sizeItem.PACKITMDTL_ID,
          QTY: sizeItem.PACKITMDTL_QTY
        })) : [],
        DBFLAG: item.DBFLAG || "R"
      };
    }) : [];

    // If BARCD_FLG is "1" (barcode mode), consolidate items by style
    if (packData.BARCD_FLG === "1" && processedPackItemList.length > 0) {
      processedPackItemList = consolidateItemsByStyle(processedPackItemList);
    }

    const formattedData = {
      apiResponseData: {
        ...packData,
        ORDBKSTYLIST: processedPackItemList,
        ORDBKTERMLIST: packData.PACKTERMLIST || [],
        ORDBKGSTLIST: packData.PACKGSTLIST || []
      },
      ORDER_NO: packData.PACK_NO || "",
      ORDER_DATE: packData.PACK_DT ? formatDateForDisplay(packData.PACK_DT) : "",
      PARTY_ORD_NO: packData.PACK_OTH_REF || "",
      SEASON: seasonName || "",
      ORD_REF_DT: packData.PACK_DT ? formatDateForDisplay(packData.PACK_DT) : "",
      ENQ_NO: packData.PACK_OTH_REF || "",
      PARTY_BRANCH: packData.Pack_CoBr_Id || "",
      QUOTE_NO: packData.PACK_OTH_REF || "",
      SHIPPING_PARTY: await getPartyNameByKey(packData.SHP_PARTY_KEY) || partyName,
      DIV_PLACE: packData.DLV_PLACE || "",
      AR_SALES: packData.SALEPERSON1_KEY || "",
      SHIPPING_PLACE: packData.DLV_PLACE || branchName,
      PRICE_LIST: packData.PRICELIST_KEY || "",
      BROKER_TRANSPORTER: brokerName || "",
      CONSIGNEE: consigneeName || "",
      BROKER1: broker1Name || "",
      SALESPERSON_2: salesperson2Name || "",
      SALESPERSON_1: salesperson1Name || "",
      Transporter: transporterName || "",
      REMARK_STATUS: packData.REMK || "",
      MAIN_DETAILS: packData.LotWise === "Y" ? "L" : "G",
      GST_APPL: packData.GST_APP || "N",
      GST_TYPE: packData.GST_TYPE === "S" ? "STATE" : packData.GST_TYPE === "I" ? "IGST" : "C",
      RACK_MIN: packData.STK_FLG || "0",
      READY_SI: packData.READY_SI || "0",
      LAST_ORD_NO: packData.LAST_ORD_NO || "",
      SERIES: packData.SERIES || "",
      ORD_EVENT_KEY: packData.ORD_EVENT_KEY || "",
      ORG_DLV_DT: packData.ORG_DLV_DT ? formatDateForDisplay(packData.ORG_DLV_DT) : "",
      PLANNING: packData.PLANNING || "0",
      ORDBK_KEY: packData.PACK_KEY || "",
      PARTY_KEY: packData.PARTY_KEY || "",
      ORDBK_AMT: packData.PACK_AMT || "",
      ORDBK_ITM_AMT: packData.PACK_ITM_AMT || "",
      ORDBK_GST_AMT: packData.PACK_GST_AMT || "",
      ORDBK_DISC_AMT: packData.PACK_DISC_AMT || "",
      CURRN_KEY: packData.CURRN_KEY || "",
      EX_RATE: packData.EX_RATE || "",
      DLV_DT: packData.DUE_DT ? formatDateForDisplay(packData.DUE_DT) : "",
      Party: partyName || "",
      Branch: branchName || "",
      Broker: brokerName || "",
      CURR_SEASON_KEY: packData.CURR_SEASON_KEY || "",
      PRICELIST_KEY: packData.PRICELIST_KEY || "",
      BROKER1_KEY: packData.BROKER1_KEY || "",
      SHP_PARTY_KEY: packData.SHP_PARTY_KEY || packData.PARTY_KEY,
      DESP_PORT: packData.DESP_PORT || "",
      SALEPERSON1_KEY: packData.SALEPERSON1_KEY || "",
      SALEPERSON2_KEY: packData.SALEPERSON2_KEY || "",
      DISTBTR_KEY: packData.DISTBTR_KEY || "",
      TRSP_KEY: packData.TRSP_KEY || "",
      PARTYDTL_ID: packData.PARTYDTL_ID || 0,
      SHP_PARTYDTL_ID: packData.SHP_PARTYDTL_ID || packData.PARTYDTL_ID || 0,
      Order_Type: "Sales And Work-Order",
      MERCHANDISER_ID: packData.MERCHANDISER_ID || "",
      MERCHANDISER_NAME: merchandiserName || "",
      Delivery_Shedule: "comman",
      Order_TNA: "ItemWise",
      Status: getDisplayStatus(packData.STATUS),
      ORDBK_TYPE: packData.ORDBK_TYPE || "0",
      TOTAL_QTY: calculateTotalQty(processedPackItemList),
      TOTAL_AMOUNT: packData.PACK_AMT || 0,
      NET_AMOUNT: packData.PACK_NET_AMT || 0,
      DISCOUNT: packData.PACK_DISC_AMT || 0,
      PKTS: packData.PKTS || "",
      BARCD_FLG: packData.BARCD_FLG || "0"
    };

    setFormData(formattedData);

    if (packData.PARTY_KEY && packData.PARTYDTL_ID) {
      await fetchPartyDetails(packData.PARTY_KEY, packData.PARTYDTL_ID);
    }

    setCurrentPARTY_KEY(packData.PARTY_KEY);

    setTimeout(() => {
      setFormData(prev => ({ ...prev, forceUpdate: Date.now() }));
    }, 100);

  } catch (error) {
    console.error('Error populating form data:', error);
  }
};

// Add this function to consolidate items by style for barcode mode
const consolidateItemsByStyle = (itemList) => {
  const styleMap = new Map();
  
  itemList.forEach(item => {
    const key = `${item.FGPRD_KEY}-${item.FGSTYLE_ID}-${item.FGTYPE_KEY || ''}-${item.PATTERN || ''}`;
    
    if (styleMap.has(key)) {
      // Consolidate quantities and amounts
      const existing = styleMap.get(key);
      existing.ITMQTY = (parseFloat(existing.ITMQTY) || 0) + (parseFloat(item.ITMQTY) || 0);
      existing.ITMAMT = (parseFloat(existing.ITMAMT) || 0) + (parseFloat(item.ITMAMT) || 0);
      existing.NET_AMT = (parseFloat(existing.NET_AMT) || 0) + (parseFloat(item.NET_AMT) || 0);
      
      // Merge size details
      if (item.ORDBKSTYSZLIST) {
        existing.ORDBKSTYSZLIST = existing.ORDBKSTYSZLIST || [];
        existing.ORDBKSTYSZLIST = [...existing.ORDBKSTYSZLIST, ...item.ORDBKSTYSZLIST];
      }
    } else {
      styleMap.set(key, { ...item });
    }
  });
  
  return Array.from(styleMap.values());
};

// In SalesOrderOffline component, add this function
const preparePackSubmitPayload = () => {
  const currentDate = new Date().toISOString().replace('T', ' ').split('.')[0];
  const currentDateFormatted = formatDateForAPI(getTodayDate()).split('T')[0]; // YYYY-MM-DD format for PACK_DT
  
  const userId = localStorage.getItem('USER_ID') || '1';
  const userName = localStorage.getItem('USER_NAME') || 'Admin';

  const getStatusValue = (status) => {
    const statusMapping = {
      'O': '1',  // Open
      'C': '0',  // Cancel
      'S': '5'   // Short
    };
    return statusMapping[status] || "1";
  };

  // Main DBFLAG based on mode
  const mainDbFlag = mode === 'add' ? 'I' : 'U';

  // Get party and branch details
  const partyKey = formData.PARTY_KEY || "";
  const branchId = formData.PARTYDTL_ID || 0;
  const brokerKey = formData.BROKER_KEY || "";
  const broker1Key = formData.BROKER1_KEY || "";
  const salesperson1Key = formData.SALEPERSON1_KEY || "";
  const salesperson2Key = formData.SALEPERSON2_KEY || "";
  const consigneeKey = formData.DISTBTR_KEY || "";
  const transporterKey = formData.TRSP_KEY || "";
  const shippingPartyKey = formData.SHP_PARTY_KEY || formData.PARTY_KEY;
  const shippingPartyDtlId = formData.SHP_PARTYDTL_ID || formData.PARTYDTL_ID || 1;

  // Get PACKITMLIST from formData
  const packItemList = formData.apiResponseData?.ORDBKSTYLIST || [];

  // Transform ORDBKSTYLIST to PACKITMLIST format
  const transformedPackItemList = packItemList.map(item => {
    // Determine DBFLAG based on mode and item status
    let itemDbFlag = item.DBFLAG || mainDbFlag;
    
  
    if (item.DBFLAG === 'D') {
      itemDbFlag = 'D';
    }
    // For edit mode, determine if it's new or existing
    else if (mode === 'edit') {
      const isNewItem = item.ORDBKSTY_ID && item.ORDBKSTY_ID.toString().length > 9;
      const hasOriginalId = item.ORDBKSTY_ID && item.ORDBKSTY_ID > 0 && !isNewItem;

      if (isNewItem) {
        itemDbFlag = 'I'; // New item in edit mode
      } else if (hasOriginalId) {
        itemDbFlag = 'U'; // Existing item to update
      } else {
        itemDbFlag = 'I'; // Default to insert for new items
      }
    }

    // Transform ORDBKSTYSZLIST to PACKITMDTLLIST format
    const transformedSizeList = (item.ORDBKSTYSZLIST || []).map(sizeItem => ({
      DBFLAG: itemDbFlag,
      PACKITMDTL_ID: sizeItem.ORDBKSTYSZ_ID || 0,
      ORDBKSTYSZ_ID: sizeItem.ORDBKSTYSZ_ID || 0,
      PACK_KEY: formData.ORDBK_KEY || "",
      PACKITM_ID: item.ORDBKSTY_ID || 0,
      STYSIZE_ID: sizeItem.STYSIZE_ID || 0,
      STYSIZE_NAME: sizeItem.STYSIZE_NAME || "",
      PACKITMDTL_QTY: parseFloat(sizeItem.QTY) || 0,
      MRP: parseFloat(sizeItem.MRP || item.MRP) || 0,
      WSP: parseFloat(sizeItem.RATE || item.ITMRATE) || 0,
      BAL_QTY: parseFloat(sizeItem.QTY) || 0,
      ALLOW_RTS: 0,
      RTS_QTY: 0,
      HSNCODE_KEY: sizeItem.HSNCODE_KEY || item.HSNCODE_KEY || "",
      GST_RATE_SLAB_ID: sizeItem.GST_RATE_SLAB_ID || item.GST_RATE_SLAB_ID || 0,
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
      PACKITM_ID: item.ORDBKSTY_ID || 0,
      PACK_KEY: formData.ORDBK_KEY || "",
      // ORDBKSTY_ID: item.ORDBKSTY_ID || 0,
      ORDBKSTY_ID:  0,
      ORDBK_KEY: item.ORDBK_KEY || "",
      FGPRD_KEY: item.FGPRD_KEY || "",
      FGSTYLE_ID: item.FGSTYLE_ID || 0,
      FGSTYLE_CODE: item.FGSTYLE_CODE || item.STYLE || "",
      FGTYPE_KEY: item.FGTYPE_KEY || "",
      FGSHADE_KEY: item.FGSHADE_KEY || "",
      FGPTN_KEY: item.FGPTN_KEY || "",
      FGITM_KEY: item.FGITM_KEY || "",
      PACK_QTY: parseFloat(item.ITMQTY) || 0,
      STYCATRT_ID: item.STYCATRT_ID || 0,
      RATE: parseFloat(item.ITMRATE) || 0,
      AMT: parseFloat(item.ITMAMT) || 0,
      TERM_KEY: "",
      TERM_NAME: "",
      TERM_PERCENT: 0,
      TERM_FIX_AMT: 0,
      TERM_RATE: 0.50,
      TERM_PERQTY: 0,
      DISC_AMT: parseFloat(item.DISC_AMT) || 0,
      NET_AMT: parseFloat(item.NET_AMT) || 0,
      STATUS: "1",
      STYLE_PRN: "STYLE PRINT",
      TYPE_PRN: "TYPE PRINT",
      MRP_PRN: parseFloat(item.MRP) || 0,
      CARTON_REF: "1",
      REMK: item.REMARK || "",
      STDQTY: 0,
      SETQTY: parseFloat(item.SETQTY) || 0,
      CARTON_REF1: "CRT-REF-01",
      CARTON_MARKS: "UP",
      NET_WT: 0,
      GR_WT: 0,
      BOX_MRKN: "",
      PACKNO_REF: `PACK-REF-${formData.ORDER_NO || ''}`,
      MTRS: 0,
      ROLL: 0,
      SET_NAME: "",
      SET_ID: 0,
      STYSET_COUNT: 0,
      PACKITMDTLLIST: transformedSizeList
    };
  });

  // Transform PACKITMBARCODELIST if needed
  const packBarcodeList = formData.apiResponseData?.PACKITMBARCODELIST || [];

  // Transform PACKTERMLIST from ORDBKTERMLIST
  const packTermList = (formData.apiResponseData?.ORDBKTERMLIST || []).map(termItem => {
    let termDbFlag = termItem.DBFLAG || mainDbFlag;

    if (termItem.DBFLAG === 'D') {
      termDbFlag = 'D';
    } else if (mode === 'edit') {
      const hasOriginalId = termItem.ORDBKTERM_ID && termItem.ORDBKTERM_ID > 0;
      termDbFlag = hasOriginalId ? 'U' : 'I';
    }

    return {
      DBFLAG: termDbFlag,
      PACKTERM_ID: termItem.ORDBKTERM_ID || 0,
      PACK_KEY: formData.ORDBK_KEY || "",
      TERM_KEY: termItem.TERM_KEY || "",
      TERM_NAME: termItem.TERM_NAME || "",
      TERM_PERCENT: parseFloat(termItem.TERM_PERCENT) || 0,
      TERM_FIX_AMT: parseFloat(termItem.TERM_FIX_AMT) || 0,
      TERM_RATE: parseFloat(termItem.TERM_RATE) || 0,
      TERM_PERQTY: parseFloat(termItem.TERM_PERQTY) || 0,
      TERM_DESC: termItem.TERM_DESC || "",
      TERM_OPR: termItem.TERM_OPR || "+",
      TAX_KEY: termItem.TAX_KEY || "",
      TAX_FORM: termItem.TAX_FORM || "",
      TAX_RATE: parseFloat(termItem.TAX_RATE) || 0,
      T_AOT1_D: termItem.T_AOT1_D || "",
      T_AOT1_R: parseFloat(termItem.T_AOT1_R) || 0,
      TAXABLE_AMT: parseFloat(termItem.TAXABLE_AMT) || 0,
      TAX_AMT: parseFloat(termItem.TAX_AMT) || 0,
      AOT1_AMT: parseFloat(termItem.AOT1_AMT) || 0,
      STATUS: "1",
      T_AOT2_D: termItem.T_AOT2_D || "",
      T_AOT2_R: parseFloat(termItem.T_AOT2_R) || 0,
      AOT2_AMT: parseFloat(termItem.AOT2_AMT) || 0
    };
  });

  // Transform PACKGSTLIST from ORDBKGSTLIST
  const packGstList = (formData.apiResponseData?.ORDBKGSTLIST || []).map(gstItem => {
    let gstDbFlag = gstItem.DBFLAG || mainDbFlag;

    if (gstItem.DBFLAG === 'D') {
      gstDbFlag = 'D';
    } else if (mode === 'edit') {
      const hasOriginalId = gstItem.ORDBK_GST_ID && gstItem.ORDBK_GST_ID > 0;
      gstDbFlag = hasOriginalId ? 'U' : 'I';
    }

    return {
      DBFLAG: gstDbFlag,
      PACK_GST_ID: gstItem.ORDBK_GST_ID || 0,
      GSTTIN_NO: gstItem.GSTTIN_NO || "URD",
      PACK_KEY: formData.ORDBK_KEY || "",
      GST_TYPE: formData.GST_TYPE === "STATE" ? "S" : formData.GST_TYPE === "IGST" ? "I" : "C",
      HSNCODE_KEY: gstItem.HSNCODE_KEY || "IG001",
      HSN_CODE: gstItem.HSN_CODE || "61124100",
      QTY: parseFloat(gstItem.QTY) || 0,
      GST_RATE_SLAB_ID: parseInt(gstItem.GST_RATE_SLAB_ID) || 638,
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

  // Base payload
  const basePayload = {
    PACK_TYPE: "ITM",
    PACK_BARCODETYPE: "I",
    DBFLAG: mainDbFlag,
    FCYR_KEY: "25",
    CO_ID: companyConfig.CO_ID || "02",
    COBR_ID: companyConfig.COBR_ID || "02",
    PACK_NO: formData.ORDER_NO || "",
    PACK_X: "",
    PACK_KEY: formData.ORDBK_KEY || "",
    PACK_DT: formatDateForAPI(formData.ORDER_DATE)?.split('T')[0] || currentDateFormatted,
    PARTY_KEY: partyKey,
    PARTYDTL_ID: parseInt(branchId) || 0,
    PACK_Z: "0",
    PACK_OTH_REF: formData.PARTY_ORD_NO || "",
    BROKER_KEY: brokerKey,
    BROKER_RATE: parseFloat(formData.Comm) || 0,
    TRSP_KEY: transporterKey,
    LR_NO: "",
    LR_DT: "1900-01-01T00:00:00",
    PACK_AMT: parseFloat(formData.TOTAL_AMOUNT) || 0,
    ROUND_OFF_DESC: "ROUND OFF",
    ROUND_OFF: 0,
    PYT_DAYS: 0,
    DUE_DT: formatDateForAPI(formData.DLV_DT) || "1900-01-01T00:00:00",
    PACK_NET_AMT: parseFloat(formData.NET_AMOUNT) || 0,
    PACK_BAL_AMT: parseFloat(formData.NET_AMOUNT) || 0,
    CURRN_KEY: formData.CURRN_KEY || "CM001",
    EX_RATE: parseFloat(formData.EX_RATE) || 1,
    DISC_KEY: "",
    REMK: formData.REMARK_STATUS || "",
    STATUS: getStatusValue(formData.Status),
    COMMBL_AMT: parseFloat(formData.TOTAL_AMOUNT) || 0,
    SECSALE: "1",
    PKTS: formData.PKTS || "10",
    DLV_PLACE: formData.SHIPPING_PLACE || "",
    DISTBTR_KEY: consigneeKey,
    SALEPERSON1_KEY: salesperson1Key,
    SALEPERSON2_KEY: salesperson2Key,
    ON_MRP: "0",
     BARCD_FLG: detailMode === 'barcode' ? "1" : "0",
    BROKER1_KEY: broker1Key,
    PACK_COBR_ID: companyConfig.COBR_ID || "02",
    LOTWISE: formData.MAIN_DETAILS === "L" ? "Y" : "N",
    GST_APP: formData.GST_APPL || "N",
    GST_TYPE: formData.GST_TYPE === "STATE" ? "S" : formData.GST_TYPE === "IGST" ? "I" : "C",
    STATE_PARTYDTL_ID: 0,
    PACK_ITM_AMT: parseFloat(formData.ORDBK_ITM_AMT) || 0,
    PACK_SGST_AMT: parseFloat(formData.ORDBK_SGST_AMT) || 0,
    PACK_CGST_AMT: parseFloat(formData.ORDBK_CGST_AMT) || 0,
    PACK_IGST_AMT: parseFloat(formData.ORDBK_IGST_AMT) || 0,
    PACK_ADD_CESS_AMT: 0,
    PACK_GST_AMT: parseFloat(formData.ORDBK_GST_AMT) || 0,
    SHP_PARTY_KEY: shippingPartyKey,
    SHP_PARTYDTL_ID: parseInt(shippingPartyDtlId) || 0,
    IS_PACK: "0",
    PAYMENT_MODE: 0,
    PACKITMLIST: transformedPackItemList,
    PACKITMBARCODELIST: packBarcodeList,
    PACKTERMLIST: packTermList,
    PACKGSTLIST: packGstList
  };

  // Add user fields based on operation type
  if (mainDbFlag === 'I') {
    basePayload.CREATED_BY = parseInt(userId) || 1;
    basePayload.CREATED_DT = currentDate;
  } else {
    basePayload.UPDATED_BY = parseInt(userId) || 1;
    basePayload.UPDATED_DT = currentDate;
  }

  console.log('Final PACK Payload for', mode === 'add' ? 'INSERT' : 'UPDATE');
  console.log('Main DBFLAG:', mainDbFlag);
  console.log('PACKITMLIST count:', transformedPackItemList.length);

  return basePayload;
};

  // Rest of your existing functions remain the same...
  const handleTable = () => {
    router.push('/inverntory/pakingsliptable');
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

      const response = await axiosInstance.post('/ORDBK/RetriveOrder', payload);

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

      const response = await axiosInstance.post('/ORDBK/RetriveOrder', payload);

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

  useEffect(() => {
  // If user is on a disabled tab, switch to Main tab
  if ((detailMode === 'style' && tabIndex === 1) || 
      (detailMode === 'barcode' && tabIndex === 1)) {
    // This is fine - both modes have content at tabIndex 1
    return;
  }
  
  // If tabIndex is 1 and mode is neither style nor barcode (shouldn't happen)
  if (tabIndex === 1 && detailMode !== 'style' && detailMode !== 'barcode') {
    setTabIndex(0);
  }
}, [detailMode, tabIndex]);

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
         "MODULENAME":"PACK",
         "TBLNAME":"PACK",
         "FLDNAME":"PACK_KEY",
        "NCOLLEN": 0,
        "CPREFIX": "",
        "COBR_ID": companyConfig.COBR_ID,
        "FCYR_KEY": "25",
        "TRNSTYPE": "M",
        "SERIESID": 68,
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

// Replace the existing handleSubmit with this new version
const handleSubmit = async () => {
  setShowValidationErrors(true);
  if (!validateForm()) {
    return;
  }

  try {
    setSubmitLoading(true);

    const userName = localStorage.getItem('USER_NAME') || 'ankita';
    const strCobrid = companyConfig.COBR_ID || "02";

    const payload = preparePackSubmitPayload();

    console.log('Submitting PACK order with payload:', payload);

    const response = await axiosInstance.post(`/PACK/ApiMangePACK`, payload);
    console.log('Submit API Response:', response.data);

    if (response.data.RESPONSESTATUSCODE === 1) {
      showSnackbar(`Order ${mode === 'add' ? 'created' : 'updated'} successfully! PACK_KEY: ${response.data.DATA}`);
      
      // After successful submission, fetch the updated order if we have a PACK_KEY
      if (response.data.DATA) {
        // For update mode, ORDBK_KEY should already be set
        // For insert mode, update formData with the new PACK_KEY from response
        if (mode === 'add') {
          setFormData(prev => ({
            ...prev,
            ORDBK_KEY: response.data.DATA
          }));
        }
        
        // Refresh order details
        await fetchOrderDetails(response.data.DATA);
      }
      
      setMode('view');
      setIsFormDisabled(true);
      setTabIndex(0);
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
  "MODULENAME":"PACK",
"TBLNAME":"PACK",
"FLDNAME":"PACK_No",
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
      CONSIGNEE: "",
      BROKER1: "",
      SALESPERSON_2: "",
      SALESPERSON_1: "",
      Transporter: "",
      REMARK_STATUS: "",
      MAIN_DETAILS: "G",
      GST_APPL: "N",
      RACK_MIN: "0",
      READY_SI: "0",
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
      ORDBK_TYPE: "2",
      PKTS: "10"
    };

    // ✅ CHANGE 1: Series prefix + dropdown data PARALLEL fetch करो
    const [prefix] = await Promise.all([
      getSeriesPrefix(),
      Object.keys(partyMapping).length === 0 ? fetchAllDropdownData() : Promise.resolve(true)
    ]);

    if (prefix) {
      const orderData = await getOrderNumber(prefix);

      if (orderData) {
        const correctPackKey = `25${companyConfig.COBR_ID}${orderData.orderNo}`;

        const formDataWithOrderNo = {
          ...emptyFormData,
          ORDER_NO: orderData.orderNo,
          LAST_ORD_NO: orderData.lastOrderNo,
          SERIES: prefix,
          ORDBK_KEY: correctPackKey
        };

        console.log('Generated PACK_KEY:', correctPackKey);

        setFormData(formDataWithOrderNo);
        setMode('add');
        setIsFormDisabled(false);

        // ✅ CHANGE 2: await fetchAllDropdownData() हटाया - already loaded है mount पर
        // अब सिर्फ party check करो
        if (Object.keys(partyMapping).length > 0) {
          const firstPartyKey = Object.keys(partyMapping)[0];
          const firstPartyName = partyMapping[firstPartyKey];

          console.log('Auto-selecting first party:', firstPartyName, 'Key:', firstPartyKey);

          if (firstPartyName && firstPartyKey) {
            setFormData(prev => ({
              ...prev,
              Party: firstPartyName,
              PARTY_KEY: firstPartyKey,
              SHIPPING_PARTY: firstPartyName,
              SHP_PARTY_KEY: firstPartyKey
            }));

            // ✅ CHANGE 3: Branch fetch और party auto-fill PARALLEL करो
            await Promise.all([
              fetchPartyDetails(firstPartyKey),
              fetchPartyDetailsForAutoFill(firstPartyKey)
            ]);
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

// Replace the existing handleDelete function with this updated version
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

    // Prepare payload according to the DELETE API format
    const payload = {
      "PACK_KEY": formData.ORDBK_KEY,  // This should be the PACK_KEY value (e.g., "2502PL9392")
      "FCYR_KEY": "25",                 // Financial year key - can be made dynamic if needed
      "COBR_ID": companyConfig.COBR_ID || "02"  // Branch ID from company config
    };

    console.log('Deleting PACK with payload:', payload);
    console.log('Authorization token present');

    // Make DELETE API call
    const response = await axiosInstance.post('/PACK/DELETE_PACK', payload);
    console.log('Delete API Response:', response.data);

    // Check response based on the API response structure
    // The response should have STATUS: 1 for success as per your example
    if (response.data.STATUS === 1 || response.data.RESPONSESTATUSCODE === 1) {
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
        ORDBK_TYPE: "2",
        PKTS: "10"  // Add this field if needed
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
          const correctPackKey = `25${companyConfig.COBR_ID || "02"}${orderData.orderNo}`;
          setFormData(prev => ({
            ...emptyFormData,
            ORDER_NO: orderData.orderNo,
            LAST_ORD_NO: orderData.lastOrderNo,
            SERIES: prefix,
            ORDBK_KEY: correctPackKey
          }));
        }
      }
      
      // Show success message
      showSnackbar('Order deleted successfully!', 'success');
    } else {
      showSnackbar('Error deleting order: ' + (response.data.MESSAGE || response.data.RESPONSEMESSAGE || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    
    // Handle different error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      
      showSnackbar(
        `Error deleting order: ${error.response.data.MESSAGE || error.response.statusText || 'Server error'}`,
        'error'
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      showSnackbar('No response from server. Please check your connection.', 'error');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      showSnackbar(`Error: ${error.message}`, 'error');
    }
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


const fetchAllDropdownData = async () => {
  try {
    // ✅ सभी APIs एक साथ parallel call करो (party को दो बार नहीं)
    const [
      partyResponse,
      orderTypes,
      brokerResponse,
      salespersonResponse,
      consigneeResponse,
      seasonResponse,
      transporterResponse,
      merchandiserResponse
    ] = await Promise.all([
      axiosInstance.post("Party/GetParty_By_Name", { PARTY_NAME: "" }),
      fetchOrderTypeData(),
      axiosInstance.post('/BROKER/GetBrokerDrp', { "PARTY_KEY": "", "FLAG": "Drp", "BROKER_KEY": "", "PageNumber": 1, "PageSize": 100, "SearchText": "" }),
      axiosInstance.post('/SALEPERSON/GetSALEPERSONDrp', { "PARTY_KEY": "", "FLAG": "Drp", "SALEPERSON_KEY": "", "PageNumber": 1, "PageSize": 100, "SearchText": "" }),
      axiosInstance.post('/DISTBTR/GetDISTBTRDrp', { "PARTY_KEY": "", "FLAG": "Drp", "DISTBTR_KEY": "", "PageNumber": 1, "PageSize": 100, "SearchText": "" }),
      axiosInstance.post('/SEASON/GetSEASONDrp', { "FLAG": "P", "TBLNAME": "SEASON", "FLDNAME": "SEASON_KEY", "ID": "", "ORDERBYFLD": "", "CWHAER": "", "CO_ID": "" }),
      axiosInstance.post('/TRSP/GetTRSPDrp', { "PARTY_KEY": "", "FLAG": "Drp", "TRSP_KEY": "", "PageNumber": 1, "PageSize": 100, "SearchText": "" }),
      axiosInstance.post('/USERS/GetUserLoginDrp', { "FLAG": "MECH" })
    ]);

    // Party mapping
    if (partyResponse.data.STATUS === 0 && Array.isArray(partyResponse.data.DATA)) {
      const partyMap = {};
      partyResponse.data.DATA.forEach(item => {
        if (item.PARTY_NAME && item.PARTY_KEY) {
          partyMap[item.PARTY_KEY] = item.PARTY_NAME;
        }
      });
      setPartyMapping(partyMap);
    }

    // Broker mapping
    if (brokerResponse.data.DATA && Array.isArray(brokerResponse.data.DATA)) {
      const brokerMap = {};
      brokerResponse.data.DATA.forEach(item => {
        if (item.BROKER_NAME && item.BROKER_KEY) brokerMap[item.BROKER_KEY] = item.BROKER_NAME;
      });
      setBrokerMapping(brokerMap);
      setBroker1Mapping(brokerMap);
    }

    // Salesperson mapping
    if (salespersonResponse.data.DATA && Array.isArray(salespersonResponse.data.DATA)) {
      const salespersonMap = {};
      salespersonResponse.data.DATA.forEach(item => {
        if (item.SALEPERSON_NAME && item.SALEPERSON_KEY) salespersonMap[item.SALEPERSON_KEY] = item.SALEPERSON_NAME;
      });
      setSalesperson1Mapping(salespersonMap);
      setSalesperson2Mapping(salespersonMap);
    }

    // Consignee mapping
    if (consigneeResponse.data.DATA && Array.isArray(consigneeResponse.data.DATA)) {
      const consigneeMap = {};
      consigneeResponse.data.DATA.forEach(item => {
        if (item.DISTBTR_NAME && item.DISTBTR_KEY) consigneeMap[item.DISTBTR_KEY] = item.DISTBTR_NAME;
      });
      setConsigneeMapping(consigneeMap);
    }

    // Season mapping
    if (seasonResponse.data.DATA && Array.isArray(seasonResponse.data.DATA)) {
      const seasonMap = {};
      seasonResponse.data.DATA.forEach(item => {
        if (item.SEASON_NAME && item.SEASON_KEY) seasonMap[item.SEASON_KEY] = item.SEASON_NAME;
      });
      setSeasonMapping(seasonMap);
    }

    // Transporter mapping
    if (transporterResponse.data.DATA && Array.isArray(transporterResponse.data.DATA)) {
      const transporterMap = {};
      transporterResponse.data.DATA.forEach(item => {
        if (item.TRSP_NAME && item.TRSP_KEY) transporterMap[item.TRSP_KEY] = item.TRSP_NAME;
      });
      setTransporterMapping(transporterMap);
    }

    // Merchandiser mapping
    if (merchandiserResponse.data.DATA && Array.isArray(merchandiserResponse.data.DATA)) {
      const merchandiserMap = {};
      merchandiserResponse.data.DATA.forEach(item => {
        if (item.USER_NAME && item.USER_ID) merchandiserMap[item.USER_NAME] = item.USER_ID;
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        height="100vh"
        width="100vw"
        position="absolute"
        top="0"
        left="0"
      >
        <CircularProgress size="3rem" />
        <Typography sx={{ marginTop: 2 }}>Loading order data...</Typography>
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
            {tabIndex === 0 ? "Packing Slip " : tabIndex === 1 ? "Item Details" : tabIndex === 1 ? "BarCode Details" : "Terms Details"}
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
                padding: '6px 0px',
                marginTop: '10px',
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

      <Grid size={{ xs: 12 }} sx={{ ml: '5%', mb: '0%', mt: '0%' }}>
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
  
  {/* Details Tab - Always accessible but content will be disabled based on mode */}
  <Tab
    label="Details"
    // Not disabled - user can click and view
    sx={{
      minHeight: '36px',
      padding: '6px 16px',
      textTransform: 'none',
      lineHeight: 1,
      backgroundColor: tabIndex === 1 && detailMode === 'style' ? '#e0e0ff' : 'transparent',
      '&.Mui-selected': {
        color: '#000',
        fontWeight: 'bold',
      },
      // Visual indication that it's view-only in barcode mode
      ...(detailMode === 'barcode' && {
        opacity: 0.9,
        '& .MuiTab-root': {
          color: '#666',
        }
      })
    }}
  />
  
  {/* BarCode Details Tab - Active when barcode mode is selected */}
  <Tab
    label="BarCode Details"
    // Not disabled - active when detailMode is 'barcode'
    sx={{
      minHeight: '36px',
      padding: '6px 16px',
      textTransform: 'none',
      lineHeight: 1,
      backgroundColor: tabIndex === 1 && detailMode === 'barcode' ? '#e0e0ff' : 'transparent',
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
              detailMode={detailMode}
  setDetailMode={setDetailMode}
  companyConfig={companyConfig} 
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
             detailMode={detailMode}
          />
          ) : tabIndex === 2 ? (
                    <Stepper3
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
                       detailMode={detailMode}
                    />
                 
        ) : (
          <Stepper4
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
        <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "end", mr: '4.5%', gap: 1 }}>
          {mode === 'view' && (
            <>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#39ace2',
                  color: '#fff',
                  textTransform: 'none',
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
                  textTransform: 'none',
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
                  backgroundColor: '#635bff',
                  color: '#fff',
                  minWidth: { xs: 40, sm: 46, md: 60 },
                  height: { xs: 40, sm: 46, md: 30 },
                  textTransform: 'none'
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
                  textTransform: 'none'
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