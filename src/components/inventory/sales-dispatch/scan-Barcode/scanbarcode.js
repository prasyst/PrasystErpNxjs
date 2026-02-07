
// 'use client';
// import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
// import {
//   Box,
//   Grid,
//   TextField,
//   Typography,
//   Button,
//   Stack,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   Alert,
//   Snackbar,
//   Card,
//   CardContent,
//   FormControlLabel,
//   Checkbox,
//   FormGroup,
//   Divider,
//   Paper,
//   Modal,
//   Fade,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Chip,
//   OutlinedInput
// } from '@mui/material';
// import { 
//   CameraAlt as CameraIcon, 
//   Close as CloseIcon, 
//   QrCodeScanner as QrCodeIcon,
//   Search as SearchIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon,
//   VisibilityOff as VisibilityOffIcon,
//   ShoppingCart as CartIcon
// } from '@mui/icons-material';
// import dynamic from 'next/dynamic';
// import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
// import axiosInstance from '../../../../lib/axios';
// import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { format, parse } from "date-fns";
// import { useRouter } from 'next/navigation';
// import { TbListSearch } from "react-icons/tb";

// const ScanBarcode = () => {
  
//   const [showAdvancedFields, setShowAdvancedFields] = useState(false);
//   const [useStyleCodeMode, setUseStyleCodeMode] = useState(false);
//   const [fillByRatioMode, setFillByRatioMode] = useState(true); 
//   const [fillByShadeMode, setFillByShadeMode] = useState(true); 
//   const [showOrderModal, setShowOrderModal] = useState(false);
  
  
//   const [availableShades, setAvailableShades] = useState([]);
//   const [selectedShades, setSelectedShades] = useState([]);
//   const [shadeViewMode, setShadeViewMode] = useState('allocated');
  
 
//   const [currentProductInfo, setCurrentProductInfo] = useState({
//     barcode: '',
//     style: '',
//     product: ''
//   });
  
//   // Store ratio data in localStorage with product key
//   const [ratioData, setRatioData] = useState({
//     totalQty: '',
//     ratios: {}
//   });
  
//   const router = useRouter();
  
//   const [formData, setFormData] = useState({
//     Party: '',
//     PARTY_KEY: '',
//     SHIPPING_PARTY: '',
//     SHP_PARTY_KEY: '',
//     Branch: '',
//     PARTYDTL_ID: '',
//     SHIPPING_PLACE: '',
//     SHP_PARTYDTL_ID: '',
//     Order_Type: 'Sales And Work-Order',
//     ORDBK_TYPE: '2',
//     Status: 'O',
    
//     // New fields
//     ORDER_NO: '',
//     ORDER_DATE: new Date().toLocaleDateString('en-GB'),
//     LAST_ORD_NO: '',
//     SERIES: '',
//     PARTY_ORD_NO: '',
//     SEASON: '',
//     ORD_REF_DT: '',
//     QUOTE_NO: '',
//     Broker: '',
//     BROKER_KEY: '',
//     SALESPERSON_1: '',
//     SALEPERSON1_KEY: '',
//     SALESPERSON_2: '',
//     SALEPERSON2_KEY: '',
//     MERCHANDISER_NAME: '',
//     MERCHANDISER_ID: '',
//     REMARK_STATUS: '',
//     GST_APPL: 'N',
//     GST_TYPE: 'STATE',
//     DLV_DT: '',
//     ORG_DLV_DT: '',
//     MAIN_DETAILS: 'G',
//     RACK_MIN: '0',
//     REGISTERED_DEALER: '0',
//     SHORT_CLOSE: '0',
//     READY_SI: '0',
//     PLANNING: '0'
//   });

//   const [newItemData, setNewItemData] = useState({
//     barcode: '',
//     product: '',
//     style: '',
//     type: '',
//     shade: '',
//     mrp: '',
//     rate: '',
//     qty: '',
//     discount: '',
//     sets: '',
//     convFact: '1',
//     remark: '',
//     varPer: '0',
//     stdQty: '',
//     setNo: '',
//     percent: '0',
//     rQty: '',
//     divDt: ''
//   });


//   const [styleCodeInput, setStyleCodeInput] = useState('');
//   const [isLoadingStyleCode, setIsLoadingStyleCode] = useState(false);
//   const styleCodeTimeoutRef = useRef(null);

//   const [sizeDetailsData, setSizeDetailsData] = useState([]);
//   const [tableData, setTableData] = useState([]);
  

//   const [availableSizes, setAvailableSizes] = useState([]);

  
//   const [partyOptions, setPartyOptions] = useState([]);
//   const [branchOptions, setBranchOptions] = useState([]);
//   const [shippingPartyOptions, setShippingPartyOptions] = useState([]);
//   const [shippingPlaceOptions, setShippingPlaceOptions] = useState([]);
//   const [brokerOptions, setBrokerOptions] = useState([]);
//   const [salesperson1Options, setSalesperson1Options] = useState([]);
//   const [salesperson2Options, setSalesperson2Options] = useState([]);
//   const [merchandiserOptions, setMerchandiserOptions] = useState([]);
//   const [seasonOptions, setSeasonOptions] = useState([]);
//   const [orderTypeOptions, setOrderTypeOptions] = useState(['Sales And Work-Order', 'Sales Order', 'Work Order']);
//   const [statusOptions] = useState(['O', 'C', 'S']);
// const [selectedShadeKey, setSelectedShadeKey] = useState('');
// const [shadeMapping, setShadeMapping] = useState({});
//   // State for mappings
//   const [partyMapping, setPartyMapping] = useState({});
//   const [branchMapping, setBranchMapping] = useState({});
//   const [shippingBranchMapping, setShippingBranchMapping] = useState({});
//   const [brokerMapping, setBrokerMapping] = useState({});
//   const [salesperson1Mapping, setSalesperson1Mapping] = useState({});
//   const [salesperson2Mapping, setSalesperson2Mapping] = useState({});
//   const [merchandiserMapping, setMerchandiserMapping] = useState({});
//   const [seasonMapping, setSeasonMapping] = useState({});

//   // Scanner state
//   const [showScanner, setShowScanner] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);
//   const [scannerError, setScannerError] = useState('');
//   const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
//   const [isLoadingData, setIsLoadingData] = useState(false);
//   const [isClient, setIsClient] = useState(false);
  
//   // Snackbar
//   const [snackbar, setSnackbar] = useState({ 
//     open: false, 
//     message: '', 
//     severity: 'success' 
//   });

  
//   const [currentStyleData, setCurrentStyleData] = useState(null);

//   const [companyConfig, setCompanyConfig] = useState({
//     CO_ID: '',
//     COBR_ID: ''
//   });

//   useEffect(() => {
//     setIsClient(true);
    
//     if (typeof window !== 'undefined') {
//       const storedCO_ID = localStorage.getItem('CO_ID') || '';
//       const storedCOBR_ID = localStorage.getItem('COBR_ID') || '';
      
//       setCompanyConfig({
//         CO_ID: storedCO_ID,
//         COBR_ID: storedCOBR_ID
//       });
      
//       console.log('Loaded company config from localStorage:', {
//         CO_ID: storedCO_ID,
//         COBR_ID: storedCOBR_ID
//       });
//     }
//   }, []);

//   const scannerRef = useRef(null);
//   const qrCodeScannerRef = useRef(null);
//   const barcodeInputRef = useRef(null);
//   const styleCodeInputRef = useRef(null);

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   // Text field styles
//   const textInputSx = {
//     '& .MuiInputBase-root': {
//       height: 40,
//       fontSize: '14px',
//     },
//     '& .MuiInputLabel-root': {
//       fontSize: '14px',
//       top: '-4px',
//     },
//     '& .MuiFilledInput-root': {
//       backgroundColor: '#fafafa',
//       border: '1px solid #e0e0e0',
//       borderRadius: '6px',
//       overflow: 'hidden',
//       height: 40,
//       fontSize: '14px',
//     },
//     '& .MuiFilledInput-root:before': {
//       display: 'none',
//     },
//     '& .MuiFilledInput-root:after': {
//       display: 'none',
//     },
//     '& .MuiInputBase-input': {
//       padding: '10px 12px !important',
//       fontSize: '14px !important',
//       lineHeight: '1.4',
//     },
//   };

//   const DropInputSx = {
//     ...textInputSx,
//     '& .MuiAutocomplete-endAdornment': {
//       top: '50%',
//       transform: 'translateY(-50%)',
//       right: '10px',
//     },
//   };

//   const datePickerSx = {
//     "& .MuiInputBase-root": {
//       height: "40px", 
//     },
//     "& .MuiInputBase-input": {
//       padding: "10px 12px", 
//       fontSize: "14px",
//     },
//     "& .MuiInputLabel-root": {
//       top: "-4px", 
//       fontSize: "14px",
//     },
//   };

//   // Get ratio data from localStorage for current product
//   const getRatioDataFromStorage = (productKey) => {
//     if (!isClient || !productKey) return { totalQty: '', ratios: {} };
    
//     try {
//       const storedData = localStorage.getItem(`ratioData_${productKey}`);
//       if (storedData) {
//         return JSON.parse(storedData);
//       }
//     } catch (error) {
//       console.error('Error reading ratio data from storage:', error);
//     }
//     return { totalQty: '', ratios: {} };
//   };

//   // Save ratio data to localStorage for current product
//   const saveRatioDataToStorage = (productKey, data) => {
//     if (!isClient || !productKey) return;
    
//     try {
//       localStorage.setItem(`ratioData_${productKey}`, JSON.stringify(data));
//     } catch (error) {
//       console.error('Error saving ratio data to storage:', error);
//     }
//   };

//   // Generate unique product key for localStorage
//   const generateProductKey = (barcode, style, product) => {
//     return `${barcode || ''}_${style || ''}_${product || ''}`.trim();
//   };

//   // Function to generate FGITM_KEY dynamically - UPDATED FOR BARCODE
//   const generateFgItemKey = (item) => {
//     const fgprdKey = item.FGPRD_KEY || item.fgprdKey || "";
//     const fgstyleId = item.FGSTYLE_ID || item.fgstyleId || "";
//     const fgtypeKey = item.FGTYPE_KEY || item.fgtypeKey || "";
//     const fgshadeKey = item.FGSHADE_KEY || item.fgshadeKey || "";
//     const fgptnKey = item.FGPTN_KEY || item.fgptnKey || "";
    
//     // Clean keys
//     const cleanFgprdKey = fgprdKey.trim();
//     const cleanFgstyleId = fgstyleId.toString().trim();
//     const cleanFgtypeKey = fgtypeKey.trim();
//     const cleanFgshadeKey = fgshadeKey.trim();
//     const cleanFgptnKey = fgptnKey.trim();
    
//     // Build FGITM_KEY based on available components
//     let fgItemKey = cleanFgprdKey;
    
//     if (cleanFgstyleId) {
//       fgItemKey += cleanFgstyleId;
//     }
    
//     if (cleanFgtypeKey) {
//       fgItemKey += cleanFgtypeKey;
//     }
    
//     if (cleanFgshadeKey) {
//       fgItemKey += cleanFgshadeKey;
//     }
    
//     if (cleanFgptnKey) {
//       fgItemKey += cleanFgptnKey;
//     }
    
//     console.log('Generated FGITM_KEY for barcode:', fgItemKey);
    
//     return fgItemKey || "";
//   };

// const fetchShadesForStyle = async (fgstyleId, mode = 'allocated') => {
//   try {
//     const payload = {
//       "FGSTYLE_ID": mode === 'allocated' ? fgstyleId.toString() : "",
//       "FLAG": ""
//     };

//     const response = await axiosInstance.post('/Fgshade/GetFgshadedrp', payload);
//     console.log('Shades API Response:', response.data);
    
//     if (response.data.DATA && Array.isArray(response.data.DATA)) {
//       const shades = response.data.DATA.map(item => ({
//         FGSHADE_NAME: item.FGSHADE_NAME || '',
//         FGSHADE_KEY: item.FGSHADE_KEY || '',
//         FGSTYLE_ID: item.FGSTYLE_ID || fgstyleId
//       }));
      
//       // Build shade mapping for later use
//       const newShadeMap = {};
//       response.data.DATA.forEach(item => {
//         if (item.FGSHADE_NAME && item.FGSHADE_KEY) {
//           newShadeMap[item.FGSHADE_NAME] = item.FGSHADE_KEY;
//         }
//       });
      
//       // Update shade mapping state
//       setShadeMapping(newShadeMap);
      
//       setAvailableShades(shades);
      
//       // If in allocated mode, auto-select the first shade
//       if (mode === 'allocated' && shades.length > 0) {
//         const firstShade = shades[0].FGSHADE_NAME;
//         const firstShadeKey = shades[0].FGSHADE_KEY;
        
//         setSelectedShades([firstShade]);
//         setSelectedShadeKey(firstShadeKey);
        
//         // Also update the newItemData shade field
//         setNewItemData(prev => ({
//           ...prev,
//           shade: firstShade,
//           fgshadeKey: firstShadeKey
//         }));
//       } else if (mode === 'all') {
//         // For all mode, don't auto-select any shade
//         setSelectedShades([]);
//         setSelectedShadeKey('');
//       }
      
//       return shades;
//     } else {
//       console.warn('No shades data received');
//       setAvailableShades([]);
//       setSelectedShades([]);
//       setSelectedShadeKey('');
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching shades:', error);
//     showSnackbar('Error fetching shades', 'error');
//     setAvailableShades([]);
//     setSelectedShades([]);
//     setSelectedShadeKey('');
//     return [];
//   }
// };

// // Handle shade selection change
// const handleShadeSelectionChange = (event) => {
//   const {
//     target: { value },
//   } = event;
  
//   const selectedValues = typeof value === 'string' ? value.split(',') : value;
//   setSelectedShades(selectedValues);
  
//   // Find and set the shade key for the first selected shade
//   if (selectedValues.length > 0) {
//     const firstSelectedShade = selectedValues[0];
//     const shadeKey = shadeMapping[firstSelectedShade] || '';
    
//     setSelectedShadeKey(shadeKey);
    
//     // Update newItemData with first selected shade
//     setNewItemData(prev => ({
//       ...prev,
//       shade: firstSelectedShade,
//       fgshadeKey: shadeKey
//     }));
    
//     // If size details already loaded, refetch with new shade key
//     if (currentStyleData && shadeKey) {
//       fetchSizeDetailsForStyle(currentStyleData, firstSelectedShade);
//     }
//   } else {
//     setSelectedShadeKey('');
//     setNewItemData(prev => ({
//       ...prev,
//       shade: '',
//       fgshadeKey: ''
//     }));
//   }
// };

//   // NEW: Handle All button click
//   const handleAllShadesClick = async () => {
//     setShadeViewMode('all');
//     await fetchShadesForStyle(currentStyleData?.FGSTYLE_ID || 0, 'all');
//   };

//   // NEW: Handle Allocated button click
//   const handleAllocatedShadesClick = async () => {
//     setShadeViewMode('allocated');
//     await fetchShadesForStyle(currentStyleData?.FGSTYLE_ID || 0, 'allocated');
//   };

//   // Check if window is available
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Initialize data on component mount
//   useEffect(() => {
//     if (isClient) {
//       fetchInitialData();
//       generateOrderNumber();
//     }
//   }, [isClient]);

//   // Cleanup timeout on component unmount
//   useEffect(() => {
//     return () => {
//       if (styleCodeTimeoutRef.current) {
//         clearTimeout(styleCodeTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Generate order number
//   const generateOrderNumber = async () => {
//     try {
//       setIsLoadingData(true);
      
//       const seriesPayload = {
//         "MODULENAME": "Ordbk",
//         "TBLNAME": "Ordbk",
//         "FLDNAME": "Ordbk_KEY",
//         "NCOLLEN": 0,
//         "CPREFIX": "",
//         "COBR_ID": companyConfig.COBR_ID,
//         "FCYR_KEY": "25",
//         "TRNSTYPE": "M",
//         "SERIESID": 66,
//         "FLAG": "Series"
//       };

//       const seriesResponse = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', seriesPayload);
      
//       if (seriesResponse.data.DATA && seriesResponse.data.DATA.length > 0) {
//         const prefix = seriesResponse.data.DATA[0].CPREFIX;
        
//         const orderPayload = {
//           "MODULENAME": "Ordbk",
//           "TBLNAME": "Ordbk",
//           "FLDNAME": "Ordbk_No",
//           "NCOLLEN": 6,
//           "CPREFIX": prefix,
//           "COBR_ID": companyConfig.COBR_ID,
//           "FCYR_KEY": "25",
//           "TRNSTYPE": "T",
//           "SERIESID": 0,
//           "FLAG": ""
//         };

//         const orderResponse = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', orderPayload);
        
//         if (orderResponse.data.DATA && orderResponse.data.DATA.length > 0) {
//           const orderData = orderResponse.data.DATA[0];
//           const correctOrdbkKey = `25${companyConfig.COBR_ID}${orderData.ID}`;
          
//           setFormData(prev => ({
//             ...prev,
//             ORDER_NO: orderData.ID,
//             LAST_ORD_NO: orderData.LASTID,
//             SERIES: prefix,
//             ORDBK_KEY: correctOrdbkKey
//           }));
//         }
//       }
//     } catch (error) {
//       console.error('Error generating order number:', error);
//       showSnackbar('Error generating order number', 'error');
//     } finally {
//       setIsLoadingData(false);
//     }
//   };

//   // Fetch initial dropdown data
//   const fetchInitialData = async () => {
//     try {
//       setIsLoadingData(true);
      
//       await Promise.all([
//         fetchPartiesByName(),
//         fetchBrokerData(),
//         fetchSalespersonData(),
//         fetchMerchandiserData(),
//         fetchSeasonData()
//       ]);
      
//     } catch (error) {
//       console.error('Error fetching initial data:', error);
//       showSnackbar('Error loading initial data', 'error');
//     } finally {
//       setIsLoadingData(false);
//     }
//   };

//   // Fetch party data
//   const fetchPartiesByName = async (name = "") => {
//     try {
//       const response = await axiosInstance.post("Party/GetParty_By_Name", {
//         PARTY_NAME: name
//       });
//       if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
//         const parties = response.data.DATA.map(item => item.PARTY_NAME || '');
//         setPartyOptions(parties);
//         setShippingPartyOptions(parties);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.PARTY_NAME && item.PARTY_KEY) {
//             mapping[item.PARTY_NAME] = item.PARTY_KEY;
//           }
//         });
//         setPartyMapping(mapping);
        
//         if (parties.length > 0 && !formData.Party) {
//           const firstParty = parties[0];
//           const firstPartyKey = mapping[firstParty];
          
//           setFormData(prev => ({
//             ...prev,
//             Party: firstParty,
//             PARTY_KEY: firstPartyKey,
//             SHIPPING_PARTY: firstParty,
//             SHP_PARTY_KEY: firstPartyKey
//           }));
          
//           fetchPartyDetails(firstPartyKey);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching parties:", error);
//       showSnackbar('Error fetching parties', 'error');
//     }
//   };

//   // Fetch party branches
//   const fetchPartyDetails = async (partyKey, isShippingParty = false) => {
//     if (!partyKey) return;
    
//     try {
//       const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
//         PARTY_KEY: partyKey
//       });
      
//       if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
//         const branches = response.data.DATA.map(item => item.PLACE || '');
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.PLACE && item.PARTYDTL_ID) {
//             mapping[item.PLACE] = item.PARTYDTL_ID;
//           }
//         });
        
//         if (isShippingParty) {
//           setShippingPlaceOptions(branches);
//           setShippingBranchMapping(mapping);
          
//           if (branches.length > 0 && !formData.SHIPPING_PLACE) {
//             const firstBranch = branches[0];
//             const firstBranchId = mapping[firstBranch];
            
//             setFormData(prev => ({
//               ...prev,
//               SHIPPING_PLACE: firstBranch,
//               SHP_PARTYDTL_ID: firstBranchId
//             }));
//           }
//         } else {
//           setBranchOptions(branches);
//           setBranchMapping(mapping);
          
//           if (branches.length > 0 && !formData.Branch) {
//             const firstBranch = branches[0];
//             const firstBranchId = mapping[firstBranch];
            
//             setFormData(prev => ({
//               ...prev,
//               Branch: firstBranch,
//               PARTYDTL_ID: firstBranchId,
//               ...(!prev.SHIPPING_PLACE && {
//                 SHIPPING_PLACE: firstBranch,
//                 SHP_PARTYDTL_ID: firstBranchId
//               })
//             }));
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching party details:", error);
//       showSnackbar('Error fetching branch details', 'error');
//     }
//   };

//   // Fetch broker data
//   const fetchBrokerData = async () => {
//     try {
//       const payload = {
//         "PARTY_KEY": "",
//         "FLAG": "Drp",
//         "BROKER_KEY": "",
//         "PageNumber": 1,
//         "PageSize": 100,
//         "SearchText": ""
//       };

//       const response = await axiosInstance.post('/BROKER/GetBrokerDrp', payload);
//       if (response.data.DATA && Array.isArray(response.data.DATA)) {
//         const brokers = response.data.DATA.map(item => item.BROKER_NAME || '');
//         setBrokerOptions(brokers);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.BROKER_NAME && item.BROKER_KEY) {
//             mapping[item.BROKER_NAME] = item.BROKER_KEY;
//           }
//         });
//         setBrokerMapping(mapping);
//       }
//     } catch (error) {
//       console.error('Error fetching broker data:', error);
//     }
//   };

//   // Fetch salesperson data
//   const fetchSalespersonData = async () => {
//     try {
//       const payload = {
//         "PARTY_KEY": "",
//         "FLAG": "Drp",
//         "SALEPERSON_KEY": "",
//         "PageNumber": 1,
//         "PageSize": 100,
//         "SearchText": ""
//       };

//       const response = await axiosInstance.post('/SALEPERSON/GetSALEPERSONDrp', payload);
//       if (response.data.DATA && Array.isArray(response.data.DATA)) {
//         const salespersons = response.data.DATA.map(item => item.SALEPERSON_NAME || '');
//         setSalesperson1Options(salespersons);
//         setSalesperson2Options(salespersons);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.SALEPERSON_NAME && item.SALEPERSON_KEY) {
//             mapping[item.SALEPERSON_NAME] = item.SALEPERSON_KEY;
//           }
//         });
//         setSalesperson1Mapping(mapping);
//         setSalesperson2Mapping(mapping);
//       }
//     } catch (error) {
//       console.error('Error fetching salesperson data:', error);
//     }
//   };

//   // Fetch merchandiser data
//   const fetchMerchandiserData = async () => {
//     try {
//       const payload = {
//         "FLAG": "MECH"
//       };

//       const response = await axiosInstance.post('/USERS/GetUserLoginDrp', payload);
//       if (response.data.DATA && Array.isArray(response.data.DATA)) {
//         const merchandisers = response.data.DATA.map(item => item.USER_NAME || '');
//         setMerchandiserOptions(merchandisers);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.USER_NAME && item.USER_ID) {
//             mapping[item.USER_NAME] = item.USER_ID;
//           }
//         });
//         setMerchandiserMapping(mapping);
//       }
//     } catch (error) {
//       console.error('Error fetching merchandiser data:', error);
//     }
//   };

//   // Fetch season data
//   const fetchSeasonData = async () => {
//     try {
//       const payload = {
//         "FLAG": "P",
//         "TBLNAME": "SEASON",
//         "FLDNAME": "SEASON_KEY",
//         "ID": "",
//         "ORDERBYFLD": "",
//         "CWHAER": "",
//         "CO_ID": ""
//       };

//       const response = await axiosInstance.post('/SEASON/GetSEASONDrp', payload);
//       if (response.data.DATA && Array.isArray(response.data.DATA)) {
//         const seasons = response.data.DATA.map(item => item.SEASON_NAME || '');
//         setSeasonOptions(seasons);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.SEASON_NAME && item.SEASON_KEY) {
//             mapping[item.SEASON_NAME] = item.SEASON_KEY;
//           }
//         });
//         setSeasonMapping(mapping);
//       }
//     } catch (error) {
//       console.error('Error fetching season data:', error);
//     }
//   };

//   // Fetch style data by barcode
//   const fetchStyleDataByBarcode = async (barcode) => {
//     if (!barcode || barcode.trim() === '') {
//       setScannerError('Please enter a barcode');
//       return;
//     }
    
//     try {
//       setIsLoadingBarcode(true);
//       setScannerError('');
      
//       console.log('Fetching data for barcode:', barcode);
      
//       const payload = {
//         "FGSTYLE_ID": "",
//         "FGPRD_KEY": "",
//         "FGSTYLE_CODE": "",
//         "ALT_BARCODE": barcode.trim(),
//         "FLAG": ""
//       };

//       const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);
//       console.log('API Response:', response.data);

//       if (response.data.DATA && response.data.DATA.length > 0) {
//         const exactMatch = response.data.DATA.find(item => 
//           item.ALT_BARCODE && item.ALT_BARCODE.toString() === barcode.trim()
//         );
        
//         const styleData = exactMatch || response.data.DATA[0];
        
//         console.log('Selected Style Data:', styleData);
        
//         const productKey = styleData.FGPRD_KEY || "";
        
//         const isSameProduct = (
//           currentProductInfo.productKey === productKey &&
//           currentProductInfo.style === (styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '')
//         );
        
//         const newProductInfo = {
//           barcode: styleData.ALT_BARCODE || styleData.STYSTKDTL_KEY || barcode,
//           style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
//           product: styleData.FGPRD_NAME || '',
//           productKey: productKey
//         };
        
//         setCurrentProductInfo(newProductInfo);
        
//         if (currentProductInfo.productKey && !isSameProduct) {
//           if (Object.keys(ratioData.ratios).length > 0) {
//             showSnackbar('Product has changed. Please enter new ratios for this product.', 'warning');
//           }
//           setRatioData({
//             totalQty: '',
//             ratios: {}
//           });
//         } else {
//           const savedRatioData = getRatioDataFromStorage(productKey);
//           if (savedRatioData.ratios && Object.keys(savedRatioData.ratios).length > 0) {
//             setRatioData(savedRatioData);
//             showSnackbar('Previous ratios loaded for this product', 'info');
//           }
//         }
        
//         setCurrentStyleData(styleData);
        
//         const shadeValue = styleData.FGSHADE_NAME || '';
//         const sizeValue = styleData.STYSIZE_NAME || '';
        
//         setNewItemData({
//           ...newItemData,
//           barcode: newProductInfo.barcode,
//           product: newProductInfo.product,
//           style: newProductInfo.style,
//           type: styleData.FGTYPE_NAME || '',
//           shade: shadeValue,
//           size: sizeValue,
//           mrp: styleData.MRP ? styleData.MRP.toString() : '0',
//           rate: styleData.SSP ? styleData.SSP.toString() : '0',
//           qty: '',
//           discount: '0',
//           sets: '1',
//           convFact: '1',
//           remark: ''
//         });
        
//         // Fetch size details with STYCATRT_ID
//         await fetchSizeDetailsForStyle(styleData, newItemData.shade);
        
//         // Fetch shades for this style
//         if (styleData.FGSTYLE_ID) {
//           await fetchShadesForStyle(styleData.FGSTYLE_ID, shadeViewMode);
//         }
        
//         // Keep fillByRatioMode enabled
//         setFillByRatioMode(true);
        
//       } else {
//         setScannerError('No product found for this barcode. Please check the barcode and try again.');
//         showSnackbar('Product not found', 'warning');
//       }
//     } catch (error) {
//       console.error('Error fetching style data:', error);
//       setScannerError('Error fetching product details. Please try again.');
//       showSnackbar('Error fetching product', 'error');
//     } finally {
//       setIsLoadingBarcode(false);
//     }
//   };

//   // Fetch style data by style code
//   const fetchStyleDataByCode = async (styleCode) => {
//     if (!styleCode) return;

//     try {
//       setIsLoadingStyleCode(true);
//       setScannerError('');
      
//       console.log('Fetching data for style code:', styleCode);
      
//       const payload = {
//         "FGSTYLE_ID": "",
//         "FGPRD_KEY": "",
//         "FGSTYLE_CODE": styleCode.trim(),
//         "FLAG": ""
//       };

//       const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);
//       console.log('API Response:', response.data);

//       if (response.data.DATA && response.data.DATA.length > 0) {
//         const styleData = response.data.DATA[0];
        
//         let selectedStyleData = styleData;
//         if (styleCodeInput && styleCodeInput.trim() !== '') {
//           const exactMatch = response.data.DATA.find(item => 
//             item.ALT_BARCODE && item.ALT_BARCODE.toString() === styleCodeInput.trim()
//           );
//           if (exactMatch) {
//             selectedStyleData = exactMatch;
//           }
//         }
        
//         console.log('Selected Style Data:', selectedStyleData);
        
//         const productKey = selectedStyleData.FGPRD_KEY || "";
        
//         const isSameProduct = (
//           currentProductInfo.productKey === productKey &&
//           currentProductInfo.style === (selectedStyleData.FGSTYLE_CODE || selectedStyleData.FGSTYLE_NAME || '')
//         );
        
//         const newProductInfo = {
//           barcode: selectedStyleData.ALT_BARCODE || selectedStyleData.STYSTKDTL_KEY || '',
//           style: selectedStyleData.FGSTYLE_CODE || selectedStyleData.FGSTYLE_NAME || '',
//           product: selectedStyleData.FGPRD_NAME || '',
//           productKey: productKey
//         };
        
//         setCurrentProductInfo(newProductInfo);
        
//         if (currentProductInfo.productKey && !isSameProduct) {
//           if (Object.keys(ratioData.ratios).length > 0) {
//             showSnackbar('Product has changed. Please enter new ratios for this product.', 'warning');
//           }
//           setRatioData({
//             totalQty: '',
//             ratios: {}
//           });
//         } else {
//           const savedRatioData = getRatioDataFromStorage(productKey);
//           if (savedRatioData.ratios && Object.keys(savedRatioData.ratios).length > 0) {
//             setRatioData(savedRatioData);
//             showSnackbar('Previous ratios loaded for this product', 'info');
//           }
//         }
        
//         setCurrentStyleData(selectedStyleData);
        
//         const shadeValue = selectedStyleData.FGSHADE_NAME || '';
//         const sizeValue = selectedStyleData.STYSIZE_NAME || '';
        
//         setNewItemData({
//           ...newItemData,
//           barcode: newProductInfo.barcode,
//           product: newProductInfo.product,
//           style: newProductInfo.style,
//           type: selectedStyleData.FGTYPE_NAME || '',
//           shade: shadeValue,
//           size: sizeValue,
//           mrp: selectedStyleData.MRP ? selectedStyleData.MRP.toString() : '0',
//           rate: selectedStyleData.SSP ? selectedStyleData.SSP.toString() : '0',
//           qty: '',
//           discount: '0',
//           sets: '1',
//           convFact: '1',
//           remark: ''
//         });
        
//         showSnackbar('Product found successfully by style code!');
        
//         // Fetch size details with STYCATRT_ID
//         await fetchSizeDetailsForStyle(styleData, newItemData.shade);
        
//         // Fetch shades for this style
//         if (selectedStyleData.FGSTYLE_ID) {
//           await fetchShadesForStyle(selectedStyleData.FGSTYLE_ID, shadeViewMode);
//         }
        
//         // Keep fillByRatioMode enabled
//         setFillByRatioMode(true);
        
//       } else {
//         setScannerError('No product found for this style code. Please check the style code and try again.');
//         showSnackbar('Product not found', 'warning');
//       }
//     } catch (error) {
//       console.error('Error fetching style data by code:', error);
//       setScannerError('Error fetching product details. Please try again.');
//       showSnackbar('Error fetching product', 'error');
//     } finally {
//       setIsLoadingStyleCode(false);
//     }
//   };

//   // Handle style code input change with debounce
//   const handleStyleCodeInputChange = (e) => {
//     const value = e.target.value;
//     setStyleCodeInput(value);
    
//     if (styleCodeTimeoutRef.current) {
//       clearTimeout(styleCodeTimeoutRef.current);
//     }
    
//     if (value && value.trim() !== '') {
//       styleCodeTimeoutRef.current = setTimeout(() => {
//         fetchStyleDataByCode(value.trim());
//       }, 500);
//     }
//   };

//   // Handle style code Enter key press
//   const handleStyleCodeKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       if (styleCodeTimeoutRef.current) {
//         clearTimeout(styleCodeTimeoutRef.current);
//       }
//       fetchStyleDataByCode(styleCodeInput.trim());
//     }
//   };

// const fetchSizeDetailsForStyle = async (styleData, selectedShadeName = '') => {
//   try {
//     const fgprdKey = styleData.FGPRD_KEY;
//     const fgstyleId = styleData.FGSTYLE_ID;
//     const fgtypeKey = styleData.FGTYPE_KEY || "";
    
//     // Get FGSHADE_KEY from selected shade or from styleData
//     let fgshadeKey = "";
//     if (selectedShadeName && shadeMapping[selectedShadeName]) {
//       fgshadeKey = shadeMapping[selectedShadeName];
//     } else if (styleData.FGSHADE_KEY) {
//       fgshadeKey = styleData.FGSHADE_KEY;
//     } else if (newItemData.shade && shadeMapping[newItemData.shade]) {
//       fgshadeKey = shadeMapping[newItemData.shade];
//     } else if (selectedShadeKey) {
//       fgshadeKey = selectedShadeKey;
//     }
    
//     const fgptnKey = styleData.FGPTN_KEY || "";

//     if (!fgprdKey || !fgstyleId) {
//       console.warn('Missing required data for size details');
//       return;
//     }

//     // FIRST: Get STYCATRT_ID from API with FLAG: "GETSTYCATRTID"
//     const stycatrtPayload = {
//       "FGSTYLE_ID": fgstyleId,
//       "FGPRD_KEY": fgprdKey,
//       "FGTYPE_KEY": fgtypeKey,
//       "FGSHADE_KEY": fgshadeKey,
//       "FGPTN_KEY": fgptnKey,
//       "FLAG": "GETSTYCATRTID",
//       "MRP": parseFloat(styleData.MRP) || 0,
//       "PARTY_KEY": formData.PARTY_KEY || "",
//       "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
//       "COBR_ID": companyConfig.COBR_ID || "02",
//       "FCYR_KEY": "25"
//     };

//     console.log('Fetching STYCATRT_ID with dynamic FGSHADE_KEY:', fgshadeKey, stycatrtPayload);

//     const stycatrtResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', stycatrtPayload);
//     console.log('STYCATRT_ID Response:', stycatrtResponse.data);

//     let stycatrtId = 0;
//     if (stycatrtResponse.data.DATA && stycatrtResponse.data.DATA.length > 0) {
//       stycatrtId = stycatrtResponse.data.DATA[0].STYCATRT_ID || 0;
//     }

//     // SECOND: Get size details with regular payload
//     const sizeDetailsPayload = {
//       "FGSTYLE_ID": fgstyleId,
//       "FGPRD_KEY": fgprdKey,
//       "FGTYPE_KEY": fgtypeKey,
//       "FGSHADE_KEY": fgshadeKey,
//       "FGPTN_KEY": fgptnKey,
//       "MRP": parseFloat(styleData.MRP) || 0,
//       "SSP": parseFloat(styleData.SSP) || 0,
//       "PARTY_KEY": formData.PARTY_KEY || "",
//       "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
//       "COBR_ID": companyConfig.COBR_ID || "02",
//       "FLAG": "S",
//       "FCYR_KEY": "25"
//     };

//     console.log('Fetching size details with dynamic FGSHADE_KEY:', fgshadeKey, sizeDetailsPayload);

//     const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', sizeDetailsPayload);

//     if (response.data.DATA && response.data.DATA.length > 0) {
//       const transformedSizeDetails = response.data.DATA.map((size, index) => ({
//         STYSIZE_ID: size.STYSIZE_ID || index + 1,
//         STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
//         FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
//         QTY: 0,
//         ITM_AMT: 0,
//         ORDER_QTY: 0,
//         MRP: parseFloat(styleData.MRP) || 0,
//         RATE: parseFloat(styleData.SSP) || 0,
//         ALT_BARCODE: styleData.ALT_BARCODE || "",
//         STYCATRT_ID: stycatrtId,
//         FGSHADE_KEY: fgshadeKey,
//         FG_QTY: parseFloat(size.FG_QTY) || 0,
//     PORD_QTY: parseFloat(size.PORD_QTY) || 0,
//     ISU_QTY: parseFloat(size.ISU_QTY) || 0,
//     BAL_QTY: parseFloat(size.BAL_QTY) || 0,
//       }));

//       setSizeDetailsData(transformedSizeDetails);
      
//       // Store STYCATRT_ID and FGSHADE_KEY in currentStyleData for later use
//       setCurrentStyleData(prev => ({
//         ...prev,
//         STYCATRT_ID: stycatrtId,
//         FGSHADE_KEY: fgshadeKey
//       }));
      
//       const availableSizesForRatio = response.data.DATA.map(size => ({
//         STYSIZE_ID: size.STYSIZE_ID,
//         STYSIZE_NAME: size.STYSIZE_NAME,
//         MRP: size.MRP,
//         WSP: size.WSP || size.RATE,
//         STYCATRT_ID: stycatrtId,
//         FGSHADE_KEY: fgshadeKey
//       }));
      
//       setAvailableSizes(availableSizesForRatio);
//       showSnackbar(`Size details loaded! STYCATRT_ID: ${stycatrtId}, FGSHADE_KEY: ${fgshadeKey}`);
      
//     } else {
//       const stysizeName = styleData.STYSIZE_NAME || 'Default';
//       const stysizeId = styleData.STYSIZE_ID || 1;
      
//       const defaultSizes = [
//         { 
//           STYSIZE_NAME: stysizeName,
//           STYSIZE_ID: stysizeId, 
//           QTY: 0, 
//           MRP: parseFloat(styleData.MRP) || 0, 
//           RATE: parseFloat(styleData.SSP) || 0,
//           WSP: parseFloat(styleData.SSP) || 0,
//           STYCATRT_ID: stycatrtId,
//           FGSHADE_KEY: fgshadeKey
//         }
//       ];
      
//       setAvailableSizes(defaultSizes);
//       setSizeDetailsData(defaultSizes);
//       showSnackbar(`Using size: ${stysizeName}. STYCATRT_ID: ${stycatrtId}, FGSHADE_KEY: ${fgshadeKey}`, 'warning');
//     }
//   } catch (error) {
//     console.error('Error fetching size details:', error);
    
//     const stysizeName = styleData.STYSIZE_NAME || 'Default';
//     const stysizeId = styleData.STYSIZE_ID || 1;
    
//     const defaultSizes = [
//       { 
//         STYSIZE_NAME: stysizeName,
//         STYSIZE_ID: stysizeId, 
//         QTY: 0, 
//         MRP: parseFloat(newItemData.mrp) || 0, 
//         RATE: parseFloat(newItemData.rate) || 0,
//         WSP: parseFloat(newItemData.rate) || 0,
//         STYCATRT_ID: 0,
//         FGSHADE_KEY: selectedShadeKey || ''
//       }
//     ];
    
//     setAvailableSizes(defaultSizes);
//     setSizeDetailsData(defaultSizes);
//     showSnackbar(`Using size: ${stysizeName}`, 'warning');
//   }
// };

//   const handleRatioChange = (sizeName, value) => {
//     const newRatioData = {
//       ...ratioData,
//       ratios: {
//         ...ratioData.ratios,
//         [sizeName]: value
//       }
//     };
    
//     setRatioData(newRatioData);
    
//     if (currentProductInfo.productKey) {
//       saveRatioDataToStorage(currentProductInfo.productKey, newRatioData);
//     }
//   };

//   // Handle total quantity change for ratio calculation
//   const handleTotalQtyChange = (value) => {
//     const newRatioData = {
//       ...ratioData,
//       totalQty: value
//     };
    
//     setRatioData(newRatioData);
    
//     if (currentProductInfo.productKey) {
//       saveRatioDataToStorage(currentProductInfo.productKey, newRatioData);
//     }
//   };

//   const fillQuantitiesByRatio = () => {
//   const totalQty = parseFloat(ratioData.totalQty);
//   if (!totalQty || totalQty <= 0) {
//     showSnackbar('Please enter a valid total quantity', 'error');
//     return;
//   }

//   const ratios = ratioData.ratios;
//   const sizeNames = Object.keys(ratios);
  
//   if (sizeNames.length === 0) {
//     showSnackbar('Please enter ratios for at least one size', 'error');
//     return;
//   }

//   const totalRatio = sizeNames.reduce((sum, sizeName) => {
//     const ratio = parseFloat(ratios[sizeName]) || 0;
//     return sum + ratio;
//   }, 0);

//   if (totalRatio === 0) {
//     showSnackbar('Total ratio cannot be zero', 'error');
//     return;
//   }

//   const updatedSizeDetails = [...sizeDetailsData];
//   let allocatedQty = 0;

//   // Calculate quantities for each size
//   sizeNames.forEach((sizeName) => {
//     const ratio = parseFloat(ratios[sizeName]) || 0;
//     const exactQty = (ratio / totalRatio) * totalQty;
//     const roundedQty = Math.round(exactQty);
    
//     const sizeIndex = updatedSizeDetails.findIndex(size => size.STYSIZE_NAME === sizeName);
//     if (sizeIndex !== -1) {
//       const wsp = updatedSizeDetails[sizeIndex].WSP || updatedSizeDetails[sizeIndex].RATE || 0;
//       const amount = roundedQty * wsp;
      
//       updatedSizeDetails[sizeIndex] = {
//         ...updatedSizeDetails[sizeIndex],
//         QTY: roundedQty,
//         ITM_AMT: amount
//       };
//       allocatedQty += roundedQty;
//     }
//   });

//   // Adjust for rounding differences
//   const difference = totalQty - allocatedQty;
//   if (difference !== 0 && sizeNames.length > 0) {
//     const firstSizeName = sizeNames[0];
//     const firstSizeIndex = updatedSizeDetails.findIndex(size => size.STYSIZE_NAME === firstSizeName);
//     if (firstSizeIndex !== -1) {
//       const wsp = updatedSizeDetails[firstSizeIndex].WSP || updatedSizeDetails[firstSizeIndex].RATE || 0;
//       const newQty = updatedSizeDetails[firstSizeIndex].QTY + difference;
//       const newAmount = newQty * wsp;
      
//       updatedSizeDetails[firstSizeIndex] = {
//         ...updatedSizeDetails[firstSizeIndex],
//         QTY: newQty,
//         ITM_AMT: newAmount
//       };
//     }
//   }

//   setSizeDetailsData(updatedSizeDetails);
  
//   const newTotalQty = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
//   const totalAmount = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.ITM_AMT) || 0), 0);
  
//   setNewItemData(prev => ({ 
//     ...prev, 
//     qty: newTotalQty.toString(),
//     rate: newTotalQty > 0 ? (totalAmount / newTotalQty).toFixed(2) : prev.rate
//   }));
  
//   // Update message to show per-shade quantity
//   if (fillByShadeMode && selectedShades.length > 0) {
//     const perShadeQty = newTotalQty; // Full quantity for each shade
//     showSnackbar(`Quantities filled successfully! Each shade will get: ${perShadeQty}`, 'success');
//   } else {
//     showSnackbar(`Quantities filled successfully! Total: ${newTotalQty}`, 'success');
//   }
// };

//   // Handle confirm button for adding item to order - MODIFIED for multi-shade
//   const handleConfirmItem = () => {
//     if (!newItemData.product || !newItemData.style) {
//       showSnackbar("Please scan a valid barcode or enter style code first", 'error');
//       return;
//     }

//     const totalQty = calculateTotalQty();
//     if (totalQty === 0) {
//       showSnackbar("Please enter quantity in size details", 'error');
//       return;
//     }

//     const { amount, netAmount } = calculateAmount();

//     if (fillByShadeMode && selectedShades.length > 0) {
//     // Create one item for EACH selected shade with FULL quantity
//     const newItems = selectedShades.map(shade => {
//       // EACH shade gets FULL quantity (not divided)
//       const shadeAmount = amount; // Full amount for each shade
//       const shadeQty = totalQty; 
        
//         return {
//         id: Date.now() + Math.random(),
//         barcode: newItemData.barcode,
//         product: newItemData.product,
//         style: newItemData.style,
//         type: newItemData.type,
//         shade: shade,
//         qty: shadeQty,
//         mrp: parseFloat(newItemData.mrp) || 0,
//         rate: parseFloat(newItemData.rate) || 0,
//         amount: shadeAmount,
//         discAmt: parseFloat(newItemData.discount) || 0,
//         netAmt: netAmount, // Full net amount for each shade
//         sets: parseFloat(newItemData.sets) || 0,
//         varPer: parseFloat(newItemData.varPer) || 0,
//         remark: newItemData.remark,
//         sizeDetails: [...sizeDetailsData], // Same size details for all shades
//         convFact: newItemData.convFact,
//         styleData: currentStyleData,
//         STYCATRT_ID: currentStyleData?.STYCATRT_ID || 0 // Include STYCATRT_ID
//       };
//     });

//       // Add all items to table
//       setTableData(prev => [...prev, ...newItems]);

//     } else {
//       // Original single item logic
//       const newItem = {
//       id: Date.now(),
//       barcode: newItemData.barcode,
//       product: newItemData.product,
//       style: newItemData.style,
//       type: newItemData.type,
//       shade: newItemData.shade,
//       qty: totalQty,
//       mrp: parseFloat(newItemData.mrp) || 0,
//       rate: parseFloat(newItemData.rate) || 0,
//       amount: amount,
//       discAmt: parseFloat(newItemData.discount) || 0,
//       netAmt: netAmount,
//       sets: parseFloat(newItemData.sets) || 0,
//       varPer: parseFloat(newItemData.varPer) || 0,
//       remark: newItemData.remark,
//       sizeDetails: [...sizeDetailsData],
//       convFact: newItemData.convFact,
//       styleData: currentStyleData,
//       STYCATRT_ID: currentStyleData?.STYCATRT_ID || 0 // Include STYCATRT_ID
//     };

//       // Add to table
//       setTableData(prev => [...prev, newItem]);
//     }

//     // Reset form
//     setNewItemData({
//       barcode: '',
//       product: '',
//       style: '',
//       type: '',
//       shade: '',
//       mrp: '',
//       rate: '',
//       qty: '',
//       discount: '0',
//       sets: '1',
//       convFact: '1',
//       remark: '',
//       varPer: '0',
//       stdQty: '',
//       setNo: '',
//       percent: '0',
//       rQty: '',
//       divDt: ''
//     });
    
//     if (useStyleCodeMode) {
//       setStyleCodeInput('');
//     }
    
//     setCurrentProductInfo({
//       barcode: '',
//       style: '',
//       product: '',
//       productKey: ''
//     });
//     setCurrentStyleData(null);
//     setSizeDetailsData([]);
//     setAvailableSizes([]);
//     setAvailableShades([]);
//     setSelectedShades([]);
//     setFillByRatioMode(true); // Keep enabled
//     setFillByShadeMode(true); // Keep enabled
//     setRatioData({
//       totalQty: '',
//       ratios: {}
//     });
//     setScannerError('');

//     if (fillByShadeMode && selectedShades.length > 1) {
//     showSnackbar(`${selectedShades.length} items added to order (${totalQty} each)! Go To Cart`, 'success');
//   } else {
//     showSnackbar('Item added to order! Go To Cart', 'success');
//   }
// };

//   // Handle form field changes
//   const handleFormChange = (field, value) => {
//     const updatedFormData = {
//       ...formData,
//       [field]: value
//     };
    
//     if (field === 'Party' && partyMapping[value]) {
//       updatedFormData.PARTY_KEY = partyMapping[value];
//       updatedFormData.SHIPPING_PARTY = value;
//       updatedFormData.SHP_PARTY_KEY = partyMapping[value];
      
//       updatedFormData.SHIPPING_PLACE = '';
//       updatedFormData.SHP_PARTYDTL_ID = '';
      
//       fetchPartyDetails(partyMapping[value]);
//     }
    
//     if (field === 'SHIPPING_PARTY' && partyMapping[value]) {
//       updatedFormData.SHP_PARTY_KEY = partyMapping[value];
//       updatedFormData.SHIPPING_PLACE = '';
//       fetchPartyDetails(partyMapping[value], true);
//     }
    
//     if (field === 'Branch' && branchMapping[value]) {
//       updatedFormData.PARTYDTL_ID = branchMapping[value];
//       if (!updatedFormData.SHIPPING_PLACE) {
//         updatedFormData.SHIPPING_PLACE = value;
//         updatedFormData.SHP_PARTYDTL_ID = branchMapping[value];
//       }
//     }
    
//     if (field === 'SHIPPING_PLACE' && shippingBranchMapping[value]) {
//       updatedFormData.SHP_PARTYDTL_ID = shippingBranchMapping[value];
//     }
    
//     if (field === 'Broker' && brokerMapping[value]) {
//       updatedFormData.BROKER_KEY = brokerMapping[value];
//     }
    
//     if (field === 'SALESPERSON_1' && salesperson1Mapping[value]) {
//       updatedFormData.SALEPERSON1_KEY = salesperson1Mapping[value];
//     }
    
//     if (field === 'SALESPERSON_2' && salesperson2Mapping[value]) {
//       updatedFormData.SALEPERSON2_KEY = salesperson2Mapping[value];
//     }
    
//     if (field === 'MERCHANDISER_NAME' && merchandiserMapping[value]) {
//       updatedFormData.MERCHANDISER_ID = merchandiserMapping[value];
//     }
    
//     if (field === 'SEASON' && seasonMapping[value]) {
//       updatedFormData.CURR_SEASON_KEY = seasonMapping[value];
//     }
    
//     setFormData(updatedFormData);
//   };

//   // Handle new item data changes
//   const handleNewItemChange = (field, value) => {
//     setNewItemData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Handle barcode search (manual entry)
//   const handleManualBarcodeSubmit = () => {
//     if (!newItemData.barcode || newItemData.barcode.trim() === '') {
//       setScannerError('Please enter a barcode');
//       return;
//     }
    
//     fetchStyleDataByBarcode(newItemData.barcode);
//   };

//   const handleTable = () => {
//     router.push('/inverntory/stock-enquiry-table');
//   };

//   // Handle cart icon click to open modal
//   const handleCartIconClick = () => {
//     if (tableData.length === 0) {
//       showSnackbar('No items in the order yet', 'info');
//       return;
//     }
//     setShowOrderModal(true);
//   };

//   // Handle Enter key press in barcode field
//   const handleBarcodeKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleManualBarcodeSubmit();
//     }
//   };

//   // Handle size quantity change
//   const handleSizeQtyChange = (index, newQty) => {
//     const updatedSizeDetails = [...sizeDetailsData];
//     const qty = parseFloat(newQty) || 0;
//     const rate = parseFloat(newItemData.rate) || 0;
//     const amount = qty * rate;
    
//     updatedSizeDetails[index] = {
//       ...updatedSizeDetails[index],
//       QTY: qty,
//       ITM_AMT: amount,
//       ORDER_QTY: qty
//     };

//     setSizeDetailsData(updatedSizeDetails);
    
//     const totalQty = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
//     setNewItemData(prev => ({ ...prev, qty: totalQty.toString() }));
//   };

//   // Calculate total quantity from size details
//   const calculateTotalQty = () => {
//     return sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
//   };

//   // Calculate amount
//   const calculateAmount = () => {
//     const totalQty = calculateTotalQty();
//     const rate = parseFloat(newItemData.rate) || 0;
//     const discount = parseFloat(newItemData.discount) || 0;
//     const amount = totalQty * rate;
//     return {
//       amount: amount,
//       netAmount: amount - discount
//     };
//   };

//   // Handle delete item from table
//   const handleDeleteItem = (id) => {
//     setTableData(prev => prev.filter(item => item.id !== id));
//     showSnackbar('Item removed from order', 'info');
//   };

//   // Initialize scanner (client-side only)
//   const initScanner = () => {
//     if (typeof window === 'undefined') {
//       console.error('Scanner not available on server');
//       return;
//     }

//     if (qrCodeScannerRef.current) {
//       qrCodeScannerRef.current.clear().catch(err => {
//         console.error("Failed to clear existing scanner", err);
//       });
//       qrCodeScannerRef.current = null;
//     }

//     const qrReaderElement = document.getElementById('qr-reader');
//     if (!qrReaderElement) {
//       console.error('qr-reader element not found');
//       setScannerError('Scanner element not found. Please try again.');
//       return;
//     }

//     try {
//       const scanner = new Html5QrcodeScanner(
//         "qr-reader",
//         {
//           fps: 10,
//           qrbox: { width: 250, height: 250 },
//           rememberLastUsedCamera: true,
//           supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
//           showTorchButtonIfSupported: true,
//           showZoomSliderIfSupported: true
//         },
//         false
//       );

//       const onScanSuccess = (decodedText, decodedResult) => {
//         console.log(`Scan result: ${decodedText}`, decodedResult);
        
//         scanner.clear().then(() => {
//           qrCodeScannerRef.current = null;
//           setIsScanning(false);
//           setShowScanner(false);
          
//           setNewItemData(prev => ({ ...prev, barcode: decodedText }));
          
//           fetchStyleDataByBarcode(decodedText);
          
//           showSnackbar('Barcode scanned successfully!', 'success');
//         }).catch(err => {
//           console.error("Failed to clear scanner", err);
//         });
//       };

//       const onScanFailure = (error) => {
//         if (!error.includes('NotFoundException')) {
//           console.warn(`Scan error: ${error}`);
//         }
//       };

//       scanner.render(onScanSuccess, onScanFailure);
//       qrCodeScannerRef.current = scanner;
//       setIsScanning(true);
//       setScannerError('');
      
//     } catch (error) {
//       console.error("Scanner initialization error:", error);
//       setScannerError(`Failed to initialize scanner: ${error.message}`);
//       showSnackbar('Scanner initialization failed. Please check camera permissions.', 'error');
//       setShowScanner(false);
//     }
//   };

//   // Start scanner
//   const startScanner = () => {
//     if (typeof window === 'undefined') {
//       showSnackbar('Scanner not available on server', 'error');
//       return;
//     }
//     setShowScanner(true);
//     setScannerError('');
//   };

//   // Stop scanner
//   const stopScanner = () => {
//     if (qrCodeScannerRef.current) {
//       qrCodeScannerRef.current.clear().catch(error => {
//         console.error("Failed to clear scanner", error);
//       });
//       qrCodeScannerRef.current = null;
//     }
//     setIsScanning(false);
//     setShowScanner(false);
//   };

//   // Prepare submit payload with FIXED FGSTYLE_ID and FGITM_KEY - UPDATED
//   const prepareSubmitPayload = () => {
//     const dbFlag = 'I';
//     const currentDate = new Date().toISOString().replace('T', ' ').split('.')[0];
    
//     const userId = localStorage.getItem('USER_ID') || '1';
//     const userName = localStorage.getItem('USER_NAME') || 'Admin';
    
//     console.log('Company Config:', companyConfig);
//     console.log('User Info:', { userId, userName });

//     const getStatusValue = (status) => {
//       const statusMapping = {
//         'O': '1',
//         'C': '0',
//         'S': '5'
//       };
//       return statusMapping[status] || "1";
//     };

//     const correctOrdbkKey = `25${companyConfig.COBR_ID}${formData.ORDER_NO}`;
    
//     console.log('Using ORDBK_KEY:', correctOrdbkKey);

//     const transformedOrdbkStyleList = tableData.map((item, index) => {
//       const tempId = Date.now() + index;
      
//       const fgstyleId = item.styleData?.FGSTYLE_ID || 0;
//       const fgprdKey = item.styleData?.FGPRD_KEY || '';
//       const fgtypeKey = item.styleData?.FGTYPE_KEY || '';
// let fgshadeKey = item.styleData?.FGSHADE_KEY || '';
//   if (!fgshadeKey && item.shade && shadeMapping[item.shade]) {
//     fgshadeKey = shadeMapping[item.shade];
//   }      const fgptnKey = item.styleData?.FGPTN_KEY || '';
//       const stycatrtId = item.STYCATRT_ID || item.styleData?.STYCATRT_ID || 0;
      
//       // Generate FGITM_KEY dynamically
//       const fgItemKey = generateFgItemKey({
//         FGPRD_KEY: fgprdKey,
//         FGSTYLE_ID: fgstyleId,
//         FGTYPE_KEY: fgtypeKey,
//         FGSHADE_KEY: fgshadeKey,
//         FGPTN_KEY: fgptnKey
//       });
      
//       console.log(`Item ${index} - FGSTYLE_ID: ${fgstyleId}, FGPRD_KEY: ${fgprdKey}, Shade: ${item.shade}, FGSHADE_KEY: ${fgshadeKey}, FGITM_KEY: ${fgItemKey}, STYCATRT_ID: ${stycatrtId}`);

//       return {
//         DBFLAG: 'I',
//         ORDBKSTY_ID: tempId,
//         ORDBK_KEY: correctOrdbkKey,
//         FGPRD_KEY: fgprdKey,
//         FGSTYLE_ID: fgstyleId,
//         FGSTYLE_CODE: item.style || '',
//         FGTYPE_KEY: fgtypeKey,
//         FGSHADE_KEY: fgshadeKey,
//         FGPTN_KEY: fgptnKey,
//         FGITEM_KEY: item.barcode || "",
//         FGITM_KEY: fgItemKey, // Include dynamically generated FGITM_KEY
//         ALT_BARCODE: item.barcode || "", // Important for barcode orders
//         QTY: parseFloat(item.qty) || 0,
//         STYCATRT_ID: stycatrtId, // Include STYCATRT_ID
//         RATE: parseFloat(item.rate) || 0,
//         AMT: parseFloat(item.amount) || 0,
//         DLV_VAR_PERCENT: parseFloat(item.varPer) || 0,
//         DLV_VAR_QTY: 0,
//         OPEN_RATE: "",
//         TERM_KEY: "",
//         TERM_NAME: "",
//         TERM_PERCENT: 0,
//         TERM_FIX_AMT: 0,
//         TERM_RATE: 0,
//         TERM_PERQTY: 0,
//         DISC_AMT: parseFloat(item.discAmt) || 0,
//         NET_AMT: parseFloat(item.netAmt) || 0,
//         INIT_DT: "1900-01-01 00:00:00.000",
//         INIT_REMK: "",
//         INIT_QTY: 0,
//         DLV_DT: "1900-01-01 00:00:00.000",
//         BAL_QTY: parseFloat(item.qty) || 0,
//         STATUS: "1",
//         STYLE_PRN: "",
//         TYPE_PRN: "",
//         MRP_PRN: parseFloat(item.mrp) || 0,
//         REMK: item.remark || "",
//         QUOTEDTL_ID: 0,
//         SETQTY: parseFloat(item.sets) || 0,
//         RQTY: 0,
//         DISTBTR_KEY: "",
//         LOTNO: formData.CURR_SEASON_KEY || "",
//         WOBALQTY: parseFloat(item.qty) || 0,
//         REFORDBKSTY_ID: 0,
//         BOMSTY_ID: 0,
//         ISRMREQ: "N",
//         OP_QTY: 0,
//         ORDBKSTYSZLIST: (item.sizeDetails || []).map((sizeItem, sizeIndex) => ({
//           DBFLAG: 'I',
//           ORDBKSTYSZ_ID: sizeItem.STYSIZE_ID || (tempId * 100 + sizeIndex),
//           ORDBK_KEY: correctOrdbkKey,
//           ORDBKSTY_ID: tempId,
//           STYSIZE_ID: sizeItem.STYSIZE_ID || 0,
//           STYSIZE_NAME: sizeItem.STYSIZE_NAME || "",
//           QTY: parseFloat(sizeItem.QTY) || 0,
//           INIT_DT: "1900-01-01 00:00:00.000",
//           INIT_REMK: "",
//           INIT_QTY: 0,
//           BAL_QTY: parseFloat(sizeItem.QTY) || 0,
//           MRP: parseFloat(item.mrp) || 0,
//           WSP: parseFloat(item.rate) || 0,
//           RQTY: 0,
//           WOBALQTY: parseFloat(sizeItem.QTY) || 0,
//           REFORDBKSTYSZ_ID: 0,
//           OP_QTY: 0,
//           HSNCODE_KEY: "IG001",
//           GST_RATE_SLAB_ID: 39,
//           ITM_AMT: parseFloat(sizeItem.ITM_AMT) || 0,
//           DISC_AMT: 0,
//           NET_AMT: parseFloat(sizeItem.ITM_AMT) || 0,
//           SGST_AMT: 0,
//           CGST_AMT: 0,
//           IGST_AMT: 0,
//           NET_SALE_RATE: 0,
//           OTHER_AMT: 0,
//           ADD_CESS_RATE: 0,
//           ADD_CESS_AMT: 0
//         }))
//       };
//     });

//     // Calculate totals
//     const totalQty = tableData.reduce((sum, item) => sum + (item.qty || 0), 0);
//     const totalAmount = tableData.reduce((sum, item) => sum + (item.amount || 0), 0);
//     const totalDiscount = tableData.reduce((sum, item) => sum + (item.discAmt || 0), 0);
//     const netAmount = totalAmount - totalDiscount;

//     // Base payload with dynamic company IDs
//     const basePayload = {
//       DBFLAG: dbFlag,
//       FCYR_KEY: "25",
//       CO_ID: companyConfig.CO_ID,
//       COBR_ID: companyConfig.COBR_ID, 
//       ORDBK_NO: formData.ORDER_NO || "",
//       CURR_SEASON_KEY: formData.CURR_SEASON_KEY || "",
//       ORDBK_X: "",
//       ORDBK_TNA_TYPE: "I",
//       MERCHANDISER_ID: parseInt(formData.MERCHANDISER_ID) || 1,
//       ORD_EVENT_KEY: "",
//       ORG_DLV_DT: formatDateForAPI(formData.ORG_DLV_DT) || "1900-01-01T00:00:00",
//       PLANNING: "0",
//       STATUS: getStatusValue(formData.Status),
//       ORDBK_KEY: correctOrdbkKey,
//       ORDBK_DT: formatDateForAPI(formData.ORDER_DATE) || currentDate,
//       PORD_REF: formData.PARTY_ORD_NO || "",
//       PORD_DT: formatDateForAPI(formData.ORD_REF_DT) || "1900-01-01T00:00:00",
//       QUOTE_NO: formData.QUOTE_NO || "",
//       QUOTE_DT: formatDateForAPI(formData.ORDER_DATE) || currentDate,
//       PARTY_KEY: formData.PARTY_KEY || "",
//       PARTYDTL_ID: parseInt(formData.PARTYDTL_ID) || 0,
//       BROKER_KEY: formData.BROKER_KEY || "",
//       BROKER1_KEY: "",
//       BROKER_COMM: 0.00,
//       COMMON_DLV_DT_FLG: "0",
//       STK_FLG: formData.RACK_MIN || "0",
//       DLV_DT: formatDateForAPI(formData.DLV_DT) || "1900-01-01T00:00:00",
//       DLV_PLACE: formData.SHIPPING_PLACE || "",
//       TRSP_KEY: "",
//       ORDBK_AMT: parseFloat(totalAmount) || 0,
//       REMK: formData.REMARK_STATUS || "",
//       CURRN_KEY: "",
//       EX_RATE: 0,
//       IMP_ORDBK_KEY: "",
//       ORDBK_TYPE: formData.ORDBK_TYPE || "2",
//       ROUND_OFF_DESC: "",
//       ROUND_OFF: 0.00,
//       BOMSTY_ID: 0,
//       LOTWISE: formData.MAIN_DETAILS === "L" ? "Y" : "N",
//       IsWO: "0",
//       SuplKey: "",
//       KNIT_DT: "1900-01-01 00:00:00.000",
//       OrdBk_CoBr_Id: companyConfig.COBR_ID,
//       GR_AMT: parseFloat(totalAmount) || 0,
//       GST_APP: formData.GST_APPL || "N",
//       GST_TYPE: formData.GST_TYPE === "STATE" ? "S" : "I",
//       SHP_PARTY_KEY: formData.SHP_PARTY_KEY || formData.PARTY_KEY,
//       SHP_PARTYDTL_ID: parseInt(formData.SHP_PARTYDTL_ID) || parseInt(formData.PARTYDTL_ID) || 0,
//       STATE_CODE: "",
//       ORDBK_ITM_AMT: parseFloat(totalAmount) || 0,
//       ORDBK_SGST_AMT: 0,
//       ORDBK_CGST_AMT: 0,
//       ORDBK_IGST_AMT: 0,
//       ORDBK_ADD_CESS_AMT: 0,
//       ORDBK_GST_AMT: 0,
//       ORDBK_EXTRA_AMT: 0,
//       ORDBKSTYLIST: transformedOrdbkStyleList,
//       ORDBKTERMLIST: [],
//       ORDBKGSTLIST: [],
//       DISTBTR_KEY: "",
//       SALEPERSON1_KEY: formData.SALEPERSON1_KEY || "",
//       SALEPERSON2_KEY: formData.SALEPERSON2_KEY || "",
//       TRSP_KEY: "",
//       PRICELIST_KEY: "",
//       DESP_PORT: "",
//       CREATED_BY: parseInt(userId) || 1,
//       CREATED_DT: currentDate
//     };

//     console.log('Submit Payload:', JSON.stringify(basePayload, null, 2));
//     return basePayload;
//   };

//   // Helper function to format date for API
//   const formatDateForAPI = (dateString) => {
//     if (!dateString) return "1900-01-01T00:00:00";
    
//     try {
//       if (dateString.includes('/')) {
//         const [day, month, year] = dateString.split('/');
//         return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;
//       }
      
//       const date = new Date(dateString);
//       return date.toISOString().split('T')[0] + 'T00:00:00';
//     } catch (error) {
//       console.error('Error formatting date for API:', error);
//       return "1900-01-01T00:00:00";
//     }
//   };

//   // Submit complete order
//   const handleSubmitOrder = async () => {
//     if (tableData.length === 0) {
//       showSnackbar('Please add at least one item to the order', 'error');
//       return;
//     }

//     if (!formData.Party || !formData.PARTY_KEY) {
//       showSnackbar('Please select a party first', 'error');
//       return;
//     }

//     try {
//       setIsLoadingData(true);
      
//       const payload = prepareSubmitPayload();
//       const userName = localStorage.getItem('USER_NAME') || 'Admin';
//       const strCobrid = companyConfig.COBR_ID;
      
//       console.log('Submitting order with payload:', payload);
//       console.log('strCobrid:', strCobrid);
      
//       const response = await axiosInstance.post(
//         `/ORDBK/ApiMangeOrdbk?UserName=${userName}&strCobrid=${strCobrid}`, 
//         payload
//       );
      
//       console.log('Submit API Response:', response.data);
      
//       if (response.data.RESPONSESTATUSCODE === 1) {
//         showSnackbar(`Order submitted successfully! Order No: ${formData.ORDER_NO}`, 'success');
        
//         // Reset form
//         setTableData([]);
//         setFormData({
//           Party: '',
//           PARTY_KEY: '',
//           SHIPPING_PARTY: '',
//           SHP_PARTY_KEY: '',
//           Branch: '',
//           PARTYDTL_ID: '',
//           SHIPPING_PLACE: '',
//           SHP_PARTYDTL_ID: '',
//           Order_Type: 'Sales And Work-Order',
//           ORDBK_TYPE: '2',
//           Status: 'O',
//           ORDER_NO: '',
//           ORDER_DATE: new Date().toLocaleDateString('en-GB'),
//           LAST_ORD_NO: '',
//           SERIES: '',
//           PARTY_ORD_NO: '',
//           SEASON: '',
//           ORD_REF_DT: '',
//           QUOTE_NO: '',
//           Broker: '',
//           BROKER_KEY: '',
//           SALESPERSON_1: '',
//           SALEPERSON1_KEY: '',
//           SALESPERSON_2: '',
//           SALEPERSON2_KEY: '',
//           MERCHANDISER_NAME: '',
//           MERCHANDISER_ID: '',
//           REMARK_STATUS: '',
//           GST_APPL: 'N',
//           GST_TYPE: 'STATE',
//           DLV_DT: '',
//           ORG_DLV_DT: '',
//           MAIN_DETAILS: 'G',
//           RACK_MIN: '0',
//           REGISTERED_DEALER: '0',
//           SHORT_CLOSE: '0',
//           READY_SI: '0',
//           PLANNING: '0'
//         });
        
//         setNewItemData({
//           barcode: '',
//           product: '',
//           style: '',
//           type: '',
//           shade: '',
//           mrp: '',
//           rate: '',
//           qty: '',
//           discount: '',
//           sets: '',
//           convFact: '1',
//           remark: '',
//           varPer: '0',
//           stdQty: '',
//           setNo: '',
//           percent: '0',
//           rQty: '',
//           divDt: ''
//         });
        
//         setStyleCodeInput('');
//         setCurrentStyleData(null);
//         setSizeDetailsData([]);
//         setAvailableSizes([]);
//         setAvailableShades([]);
//         setSelectedShades([]);
//         setFillByRatioMode(true); // Keep enabled
//         setFillByShadeMode(true); // Keep enabled
//         setRatioData({
//           totalQty: '',
//           ratios: {}
//         });
        
//         await generateOrderNumber();
        
//       } else {
//         showSnackbar('Error submitting order: ' + (response.data.RESPONSEMESSAGE || 'Unknown error'), 'error');
//       }
//     } catch (error) {
//       console.error('Error submitting order:', error);
//       showSnackbar('Error submitting order. Please try again.', 'error');
//     } finally {
//       setIsLoadingData(false);
//     }
//   };

//   // Focus on input field based on mode
//   useEffect(() => {
//     if (isClient) {
//       if (useStyleCodeMode && styleCodeInputRef.current) {
//         styleCodeInputRef.current.focus();
//       } else if (!useStyleCodeMode && barcodeInputRef.current) {
//         barcodeInputRef.current.focus();
//       }
//     }
//   }, [isClient, useStyleCodeMode]);

//   // Initialize scanner
//   useEffect(() => {
//     if (showScanner && isClient) {
//       const timer = setTimeout(() => {
//         initScanner();
//       }, 500);
      
//       return () => {
//         clearTimeout(timer);
//         if (qrCodeScannerRef.current) {
//           qrCodeScannerRef.current.clear().catch(err => {
//             console.error("Cleanup error", err);
//           });
//           qrCodeScannerRef.current = null;
//         }
//       };
//     }
//   }, [showScanner, isClient]);

//   // Get window width safely
//   const getWindowWidth = () => {
//     return isClient ? window.innerWidth : 1024;
//   };

//   if (!isClient) {
//     return (
//       <Box sx={{ 
//         p: { xs: 1, sm: 2 }, 
//         maxWidth: '100%', 
//         margin: '0 auto',
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center'
//       }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ 
//       p: { xs: 1, sm: 2 }, 
//       maxWidth: '100%', 
//       margin: '0 auto',
//       minHeight: '100vh'
//     }}>
//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert 
//           onClose={() => setSnackbar({ ...snackbar, open: false })} 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       {/* Header */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           gap: 1.2,
//           mb: 1,
//           flexWrap: 'wrap',
//         }}
//       >
//         <Typography
//           variant="h5"
//           sx={{
//             fontWeight: 'bold',
//             fontSize: { xs: '1.2rem', sm: '1.5rem' },
//             textAlign: 'center',
//             lineHeight: 1.2,
//           }}
//         >
//           Barcode Scan
//         </Typography>

//         <TbListSearch
//           onClick={handleTable}
//           style={{
//             color: 'rgb(99, 91, 255)',
//             width: '30px',
//             height: '30px',
//             cursor: 'pointer',
//           }}
//         />
        
//         {/* Cart Icon */}
//         <CartIcon
//           onClick={handleCartIconClick}
//           sx={{
//             color: 'rgb(99, 91, 255)',
//             width: '30px',
//             height: '30px',
//             cursor: 'pointer',
//           }}
//         />
//       </Box>

//       {/* Advanced Fields Toggle */}
//       <Card elevation={2} sx={{ mb: 0.5 }}>
//         <CardContent
//           sx={{
//             padding: '6px 12px',
//             '&:last-child': {
//               paddingBottom: '6px',
//             },
//           }}
//         >
//           <FormGroup>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={showAdvancedFields}
//                   onChange={(e) => setShowAdvancedFields(e.target.checked)}
//                   size="small"
//                   sx={{
//                     padding: '4px',
//                     color: '#1976d2',
//                     '&.Mui-checked': {
//                       color: '#1976d2',
//                     },
//                   }}
//                 />
//               }
//               label={
//                 <Typography
//                   sx={{
//                     fontSize: '1.07rem',
//                     fontWeight: 600,
//                     color: '#1976d2',
//                   }}
//                 >
//                   {showAdvancedFields ? 'Hide Order Fields' : 'Show Order Fields'}
//                 </Typography>
//               }
//               sx={{
//                 margin: 0,
//                 gap: '6px',
//               }}
//             />
//           </FormGroup>
//         </CardContent>
//       </Card>

//       {showAdvancedFields && (
//         <Card elevation={2} sx={{ mb: 1 }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//               <span style={{ fontSize: '1.1rem' }}>📋 Advanced Order Details</span>
//             </Typography>
            
//             <Grid container spacing={1}>
//               <Grid item xs={12} container spacing={1}>
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <TextField
//                     label="Series"
//                     variant="filled"
//                     fullWidth
//                     value={formData.SERIES}
//                     onChange={(e) => handleFormChange('SERIES', e.target.value)}
//                     sx={textInputSx}
//                     size="small"
//                     InputProps={{
//                       sx: { 
//                         fontSize: { xs: '12px', sm: '14px' },
//                         '& input': { padding: { xs: '8px 6px', sm: '10px 12px' } }
//                       }
//                     }}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <TextField
//                     label="Last Order No"
//                     variant="filled"
//                     fullWidth
//                     value={formData.LAST_ORD_NO}
//                     onChange={(e) => handleFormChange('LAST_ORD_NO', e.target.value)}
//                     sx={textInputSx}
//                     size="small"
//                     InputProps={{
//                       sx: { 
//                         fontSize: { xs: '12px', sm: '14px' },
//                         '& input': { padding: { xs: '8px 6px', sm: '10px 12px' } }
//                       }
//                     }}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <TextField
//                     label="Order No"
//                     variant="filled"
//                     fullWidth
//                     value={formData.ORDER_NO}
//                     onChange={(e) => handleFormChange('ORDER_NO', e.target.value)}
//                     sx={textInputSx}
//                     size="small"
//                     required
//                     InputProps={{
//                       sx: { 
//                         fontSize: { xs: '12px', sm: '14px' },
//                         '& input': { padding: { xs: '8px 6px', sm: '10px 12px' } }
//                       }
//                     }}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <LocalizationProvider dateAdapter={AdapterDateFns}>
//                     <DatePicker
//                       label="Order Date"
//                       value={formData.ORDER_DATE ? parse(formData.ORDER_DATE, 'dd/MM/yyyy', new Date()) : null}
//                       onChange={(date) => handleFormChange('ORDER_DATE', date ? format(date, 'dd/MM/yyyy') : '')}
//                       format="dd/MM/yyyy"
//                       slotProps={{
//                         textField: {
//                           fullWidth: true,
//                           variant: "filled",
//                           sx: {
//                             ...datePickerSx,
//                             "& .MuiInputBase-root": {
//                               height: { xs: "36px", sm: "40px" },
//                             },
//                             "& .MuiInputBase-input": {
//                               padding: { xs: "8px 10px", sm: "10px 12px" },
//                               fontSize: { xs: "12px", sm: "14px" },
//                             },
//                           },
//                           InputProps: {
//                             sx: {
//                               height: { xs: "36px", sm: "40px" },
//                             },
//                           },
//                         },
//                       }}
//                     />
//                   </LocalizationProvider>
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="Party"
//                     getOptionLabel={(option) => option || ''}
//                     options={partyOptions}
//                     label="Party *"
//                     name="Party"
//                     value={formData.Party}
//                     onChange={(e, value) => handleFormChange('Party', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="Branch"
//                     getOptionLabel={(option) => option || ''}
//                     options={branchOptions}
//                     label="Branch"
//                     name="Branch"
//                     value={formData.Branch}
//                     onChange={(e, value) => handleFormChange('Branch', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>

//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="SHIPPING_PARTY"
//                     getOptionLabel={(option) => option || ''}
//                     options={shippingPartyOptions}
//                     label="Shipping Party"
//                     name="SHIPPING_PARTY"
//                     value={formData.SHIPPING_PARTY}
//                     onChange={(e, value) => handleFormChange('SHIPPING_PARTY', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="SHIPPING_PLACE"
//                     getOptionLabel={(option) => option || ''}
//                     options={shippingPlaceOptions}
//                     label="Shipping Place"
//                     name="SHIPPING_PLACE"
//                     value={formData.SHIPPING_PLACE}
//                     onChange={(e, value) => handleFormChange('SHIPPING_PLACE', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>

//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="Broker"
//                     getOptionLabel={(option) => option || ''}
//                     options={brokerOptions}
//                     label="Broker"
//                     name="Broker"
//                     value={formData.Broker}
//                     onChange={(e, value) => handleFormChange('Broker', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="SALESPERSON_1"
//                     getOptionLabel={(option) => option || ''}
//                     options={salesperson1Options}
//                     label="Salesperson 1"
//                     name="SALESPERSON_1"
//                     value={formData.SALESPERSON_1}
//                     onChange={(e, value) => handleFormChange('SALESPERSON_1', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="SALESPERSON_2"
//                     getOptionLabel={(option) => option || ''}
//                     options={salesperson2Options}
//                     label="Salesperson 2"
//                     name="SALESPERSON_2"
//                     value={formData.SALESPERSON_2}
//                     onChange={(e, value) => handleFormChange('SALESPERSON_2', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="MERCHANDISER_NAME"
//                     getOptionLabel={(option) => option || ''}
//                     options={merchandiserOptions}
//                     label="Merchandiser"
//                     name="MERCHANDISER_NAME"
//                     value={formData.MERCHANDISER_NAME}
//                     onChange={(e, value) => handleFormChange('MERCHANDISER_NAME', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="SEASON"
//                     getOptionLabel={(option) => option || ''}
//                     options={seasonOptions}
//                     label="Season"
//                     name="SEASON"
//                     value={formData.SEASON}
//                     onChange={(e, value) => handleFormChange('SEASON', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 6, md: 2 }}>
//                   <AutoVibe
//                     id="Order_Type"
//                     getOptionLabel={(option) => option || ''}
//                     options={orderTypeOptions}
//                     label="Order Type"
//                     name="Order_Type"
//                     value={formData.Order_Type}
//                     onChange={(e, value) => handleFormChange('Order_Type', value)}
//                     sx={{
//                       ...DropInputSx,
//                       '& .MuiInputBase-root': {
//                         height: { xs: '36px', sm: '40px' },
//                       },
//                       '& .MuiInputBase-input': {
//                         padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
//                         fontSize: { xs: '12px', sm: '14px' } + ' !important',
//                       },
//                     }}
//                     size="small"
//                     onAddClick={null}
//                     onRefreshClick={null}
//                   />
//                 </Grid>
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>
//       )}

//       {/* Barcode Scanner Section with Style Code Toggle */}
//       <Card elevation={2} sx={{ mb: 1 }}>
//         <CardContent>
//           <Box sx={{ 
//             mb: 1, 
//             display: 'flex', 
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             gap: 2
//           }}>
//             <Typography variant="h6" sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               gap: 1,
//               fontSize: '1.1rem'
//             }}>
//               <QrCodeIcon /> Product Scanning
//             </Typography>
            
//             <FormGroup>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={useStyleCodeMode}
//                     onChange={(e) => setUseStyleCodeMode(e.target.checked)}
//                     size="small"
//                   />
//                 }
//                 label={
//                   <Typography variant="body2" sx={{ fontWeight: '500' }}>
//                     Use Style Code
//                   </Typography>
//                 }
//               />
//             </FormGroup>
//           </Box>
          
//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
//             <Box sx={{ flex: 1, width: '100%' }}>
//               {useStyleCodeMode ? (
//                 <TextField
//                   label="Type Style Code"
//                   variant="filled"
//                   fullWidth
//                   value={styleCodeInput}
//                   onChange={handleStyleCodeInputChange}
//                   onKeyPress={handleStyleCodeKeyPress}
//                   placeholder="Type style code and press Enter"
//                   sx={textInputSx}
//                   inputRef={styleCodeInputRef}
//                   InputProps={{
//                     endAdornment: (
//                       <IconButton 
//                         onClick={() => fetchStyleDataByCode(styleCodeInput.trim())}
//                         disabled={!styleCodeInput || isLoadingStyleCode}
//                         sx={{ mr: -1 }}
//                       >
//                         {isLoadingStyleCode ? <CircularProgress size={20} /> : <SearchIcon />}
//                       </IconButton>
//                     )
//                   }}
//                 />
//               ) : (
//                 <TextField
//                   label="Enter Barcode Number"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.barcode}
//                   onChange={(e) => handleNewItemChange('barcode', e.target.value)}
//                   onKeyPress={handleBarcodeKeyPress}
//                   placeholder="Type barcode and press Enter"
//                   sx={textInputSx}
//                   inputRef={barcodeInputRef}
//                   InputProps={{
//                     endAdornment: (
//                       <IconButton 
//                         onClick={handleManualBarcodeSubmit}
//                         disabled={!newItemData.barcode || isLoadingBarcode}
//                         sx={{ mr: -1 }}
//                       >
//                         {isLoadingBarcode ? <CircularProgress size={20} /> : <SearchIcon />}
//                       </IconButton>
//                     )
//                   }}
//                 />
//               )}
//             </Box>
            
//             <Typography variant="body2" sx={{ 
//               color: 'text.secondary',
//               display: { xs: 'none', sm: 'block' }
//             }}>
//               OR
//             </Typography>
            
//             {!useStyleCodeMode && (
//               <Button
//                 variant="contained"
//                 startIcon={<CameraIcon />}
//                 onClick={startScanner}
//                 sx={{ 
//                   backgroundColor: '#1976d2',
//                   color: 'white',
//                   minWidth: { xs: '100%', sm: 150 },
//                   height: 40,
//                   '&:hover': {
//                     backgroundColor: '#1565c0'
//                   }
//                 }}
//               >
//                 Scan Barcode
//               </Button>
//             )}
//           </Stack>

//           {scannerError && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {scannerError}
//             </Alert>
//           )}

//           {(isLoadingBarcode || isLoadingStyleCode) && (
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
//               <CircularProgress size={20} />
//               <Typography variant="body2">
//                 {useStyleCodeMode ? 'Fetching product details by style code...' : 'Fetching product details...'}
//               </Typography>
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* Product Details (Auto-filled after scan/style code) */}
//       {(newItemData.product || isLoadingBarcode || isLoadingStyleCode) && (
//         <Card elevation={2} sx={{ mb: 1 }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>
//               Product Details {(isLoadingBarcode || isLoadingStyleCode) && '(Loading...)'}
//             </Typography>
            
//             <Grid container spacing={1}>
//               <Grid size={{ xs: 6, md: 2 }}>
//                 <TextField
//                   label="Barcode"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.barcode}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid size={{ xs: 6, md: 2 }}>
//                 <TextField
//                   label="Product"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.product}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid size={{ xs: 6, md: 2 }}>
//                 <TextField
//                   label="Style"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.style}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid size={{ xs: 6, md: 2 }}>
//                 <TextField
//                   label="Type"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.type}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid size={{ xs: 6, md: 2 }}>
//                 <TextField
//                   label="Shade"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.shade}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid size={{ xs: 6, md: 2 }}>
//                 <TextField
//                   label="MRP"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.mrp}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid size={{ xs: 6, md: 2 }}>
//                 <TextField
//                   label="Rate"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.rate}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
  
//               <Grid size={{ xs: 6, md: 2 }}>
//                 <TextField
//                   label="Remark"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.remark}
//                   onChange={(e) => handleNewItemChange('remark', e.target.value)}
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>
//       )}

//       {/* Fill by Ratio Section - MODIFIED for shade selection */}
//       {availableSizes.length > 0 && (
//         <Card elevation={0.5} sx={{ mb: 0 }}>
//           <CardContent>
//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'space-between',
//               mb: 0.1,
//               flexWrap: 'wrap'
//             }}>
//               <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
//                 Fill By Ratio
//               </Typography>
              
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <FormGroup>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={fillByRatioMode}
//                         onChange={(e) => setFillByRatioMode(e.target.checked)}
//                         size="small"
//                         defaultChecked
//                       />
//                     }
//                     label="Ratio Fill"
//                   />
//                 </FormGroup>
                
//                 <FormGroup>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={fillByShadeMode}
//                         onChange={(e) => setFillByShadeMode(e.target.checked)}
//                         size="small"
//                         defaultChecked
//                       />
//                     }
//                     label="By Shade"
//                   />
//                 </FormGroup>
//               </Box>
//             </Box>
            
//             {fillByRatioMode && (
//               <Box>
//                 {/* Shade Selection for Fill by Shade Mode */}
//                 {fillByShadeMode && availableShades.length > 0 && (
//                   <Box sx={{ mb: 2 }}>
//                     <Box sx={{ 
//                       display: 'flex', 
//                       flexDirection: { xs: 'column', sm: 'row' },
//                       alignItems: { xs: 'stretch', sm: 'center' },
//                       gap: 1,
//                       mb: 1
//                     }}>
//                       <Box sx={{ 
//                         display: 'flex', 
//                         gap: 1,
//                         alignItems: 'center'
//                       }}>
//                         <Button
//                           variant={shadeViewMode === 'all' ? 'contained' : 'outlined'}
//                           onClick={handleAllShadesClick}
//                           size="small"
//                           sx={{ 
//                             minWidth: '60px',
//                             backgroundColor: shadeViewMode === 'all' ? '#1976d2' : 'transparent',
//                             color: shadeViewMode === 'all' ? 'white' : '#1976d2',
//                             borderColor: '#1976d2',
//                             '&:hover': {
//                               backgroundColor: shadeViewMode === 'all' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
//                             }
//                           }}
//                         >
//                           All
//                         </Button>
//                         <Button
//                           variant={shadeViewMode === 'allocated' ? 'contained' : 'outlined'}
//                           onClick={handleAllocatedShadesClick}
//                           size="small"
//                           sx={{ 
//                             minWidth: '80px',
//                             backgroundColor: shadeViewMode === 'allocated' ? '#1976d2' : 'transparent',
//                             color: shadeViewMode === 'allocated' ? 'white' : '#1976d2',
//                             borderColor: '#1976d2',
//                             '&:hover': {
//                               backgroundColor: shadeViewMode === 'allocated' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
//                             }
//                           }}
//                         >
//                           Allocated
//                         </Button>
//                       </Box>
                      
//                       <FormControl sx={{ 
//                         flex: 1,
//                         minWidth: { xs: '100%', sm: '200px' }
//                       }}>
//                         <InputLabel id="shade-select-label">Select Shades</InputLabel>
//                         <Select
//                           labelId="shade-select-label"
//                           id="shade-select"
//                           multiple
//                           value={selectedShades}
//                           onChange={handleShadeSelectionChange}
//                           input={<OutlinedInput label="Select Shades" />}
//                           renderValue={(selected) => (
//                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                               {selected.map((value) => (
//                                 <Chip key={value} label={value} size="small" />
//                               ))}
//                             </Box>
//                           )}
//                           size="small"
//                         >
//                           {availableShades.map((shade) => (
//                             <MenuItem key={shade.FGSHADE_NAME} value={shade.FGSHADE_NAME}>
//                               {shade.FGSHADE_NAME}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Box>
//                   </Box>
//                 )}
                
//                 {/* Total Quantity Input */}
//                 <Box sx={{ mb: 2 }}>
//                   <TextField
//                     label="Total Quantity"
//                     variant="outlined"
//                     fullWidth
//                     type="number"
//                     value={ratioData.totalQty}
//                     onChange={(e) => handleTotalQtyChange(e.target.value)}
//                     sx={{
//                       '& .MuiInputBase-root': {
//                         height: 40,
//                       },
//                     }}
//                     InputProps={{
//                       inputProps: { min: 0 }
//                     }}
//                   />
//                 </Box>
                
//                 {/* Horizontal Ratio Table */}
//                 <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: '600' }}>
//                   Enter Ratios for Each Size:
//                 </Typography>

//                 <Box sx={{ 
//                   overflowX: 'auto',
//                   backgroundColor: '#f8f9fa',
//                   borderRadius: 1,
//                   p: 1,
//                   mb: 0.7
//                 }}>
//                   <table style={{ 
//                     width: '100%', 
//                     borderCollapse: 'collapse',
//                     minWidth: `${availableSizes.length * 50}px`
//                   }}>
//                     <thead>
//                       <tr style={{ backgroundColor: '#e9ecef' }}>
//                         {availableSizes.map((size) => (
//                           <th key={`th-${size.STYSIZE_ID}`} style={{ 
//                             padding: '10px',
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'center',
//                             fontSize: '14px',
//                             fontWeight: '600',
//                             minWidth: '40px'
//                           }}>
//                             {size.STYSIZE_NAME}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         {availableSizes.map((size, index) => (
//                           <td key={`td-${size.STYSIZE_ID}`} style={{ 
//                             padding: '2px', 
//                             border: '1px solid #dee2e6',
//                             textAlign: 'center',
//                             backgroundColor: '#fff'
//                           }}>
//                             <TextField
//                               type="number"
//                               value={ratioData.ratios[size.STYSIZE_NAME] || ''}
//                               onChange={(e) => handleRatioChange(size.STYSIZE_NAME, e.target.value)}
//                               size="small"
//                               sx={{
//                                 width: '50px',
//                                 '& .MuiInputBase-root': {
//                                   height: '26px',
//                                   fontSize: '14px'
//                                 },
//                                 '& input': {
//                                   padding: '8px',
//                                   textAlign: 'center'
//                                 }
//                               }}
//                               inputProps={{ 
//                                 min: 0, 
//                                 step: 0.1,
//                                 style: { textAlign: 'center' }
//                               }}
//                             />
//                           </td>
//                         ))}
//                       </tr>
//                     </tbody>
//                   </table>
//                 </Box>
                
//                 {/* Fill Qty Button */}
//                 <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                   <Button
//                     variant="contained"
//                     onClick={fillQuantitiesByRatio}
//                     disabled={!ratioData.totalQty || parseFloat(ratioData.totalQty) <= 0}
//                     sx={{ 
//                       backgroundColor: '#4CAF50',
//                       color: 'white',
//                       '&:hover': { backgroundColor: '#45a049' },
//                       minWidth: '80px'
//                     }}
//                   >
//                     Fill Qty
//                   </Button>
//                 </Box>
//               </Box>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* Size Details Table */}
//       {sizeDetailsData.length > 0 && (
//         <Card elevation={1} sx={{ mb: 1 }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>
//               Size Details (Qty) :<strong style={{ color: '#1976d2' }}>{calculateTotalQty()}</strong>
//             </Typography>
            
//             <Box sx={{ 
//               overflowX: 'auto',
//               backgroundColor: '#f8f9fa',
//               borderRadius: 1,
//               p: 1
//             }}>
//               <table style={{ 
//                 width: '100%', 
//                 borderCollapse: 'collapse',
//                 minWidth: '500px'
//               }}>
//                 <thead>
//                   <tr style={{ backgroundColor: '#e9ecef' }}>
//                     <th style={{ 
//                       padding: '2px 8px',
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Size</th>
//                     <th style={{ 
//                       padding: '2px 8px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'center',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Quantity</th>
//                      <th style={{ 
//         padding: '2px 8px', 
//         border: '1px solid #dee2e6', 
//         textAlign: 'center',
//         fontSize: '14px',
//         fontWeight: '600'
//       }}>Ready Qty</th>
//       <th style={{ 
//         padding: '2px 8px', 
//         border: '1px solid #dee2e6', 
//         textAlign: 'center',
//         fontSize: '14px',
//         fontWeight: '600'
//       }}>Process</th>
//       <th style={{ 
//         padding: '2px 8px', 
//         border: '1px solid #dee2e6', 
//         textAlign: 'center',
//         fontSize: '14px',
//         fontWeight: '600'
//       }}>Order</th>
//       <th style={{ 
//         padding: '2px 8px', 
//         border: '1px solid #dee2e6', 
//         textAlign: 'center',
//         fontSize: '14px',
//         fontWeight: '600'
//       }}>Bal Qty</th>
//                     <th style={{ 
//                       padding: '2px 8px',
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'right',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>MRP</th>
//                     <th style={{ 
//                       padding: '2px 8px',
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'right',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Rate</th>
//                     <th style={{ 
//                       padding: '2px 8px',
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'right',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//   {sizeDetailsData.map((size, index) => {
//     // API response से values calculate करें
//     const readyQty = parseFloat(size.FG_QTY) || 0;
//     const orderQty = parseFloat(size.PORD_QTY) || 0;
//     const issueQty = parseFloat(size.ISU_QTY) || 0;
//     const processQty = orderQty + issueQty;
//     const balQty = parseFloat(size.BAL_QTY) || 0;
    
//     return (
//       <tr key={index} style={{ 
//         backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
//         borderBottom: '1px solid #dee2e6'
//       }}>
//         <td style={{
//           padding: '4px 8px',
//           border: '1px solid #dee2e6',
//           fontSize: '13px',
//           lineHeight: '1.2'
//         }}>{size.STYSIZE_NAME}</td>
        
//         <td style={{ 
//           padding: '5px', 
//           border: '1px solid #dee2e6',
//           textAlign: 'center'
//         }}>
//           <TextField
//             type="number"
//             value={size.QTY}
//             onChange={(e) => handleSizeQtyChange(index, e.target.value)}
//             size="small"
//             sx={{
//               width: '60px',
//               '& .MuiInputBase-root': {
//                 height: '20px',
//                 fontSize: '13px'
//               },
//               '& input': {
//                 padding: '1px',
//                 textAlign: 'center'
//               }
//             }}
//             inputProps={{ min: 0 }}
//           />
//         </td>
        
//         {/* नए columns के data display करें */}
//         <td style={{ 
//           padding: '4px 8px',
//           border: '1px solid #dee2e6',
//           textAlign: 'center',
//           fontSize: '13px'
//         }}>
//           {readyQty.toFixed(3)}
//         </td>
        
//         <td style={{ 
//           padding: '4px 8px',
//           border: '1px solid #dee2e6',
//           textAlign: 'center',
//           fontSize: '13px'
//         }}>
//           {processQty.toFixed(3)}
//         </td>
        
//         <td style={{ 
//           padding: '4px 8px',
//           border: '1px solid #dee2e6',
//           textAlign: 'center',
//           fontSize: '13px'
//         }}>
//           {orderQty.toFixed(3)}
//         </td>
        
//         <td style={{ 
//           padding: '4px 8px',
//           border: '1px solid #dee2e6',
//           textAlign: 'center',
//           fontSize: '13px'
//         }}>
//           {balQty.toFixed(3)}
//         </td>
        
//         <td style={{ 
//           padding: '10px', 
//           border: '1px solid #dee2e6',
//           textAlign: 'right',
//           fontSize: '14px'
//         }}>{size.MRP || 0}</td>
        
//         <td style={{ 
//           padding: '10px', 
//           border: '1px solid #dee2e6',
//           textAlign: 'right',
//           fontSize: '14px'
//         }}>{size.WSP  || 0}</td>
        
//         <td style={{ 
//           padding: '10px', 
//           border: '1px solid #dee2e6',
//           textAlign: 'right',
//           fontSize: '14px',
//           fontWeight: '500'
//         }}>
//           ₹{(size.QTY || 0) * (size.WSP  || 0)}
//         </td>
//       </tr>
//     );
//   })}
// </tbody>
//               </table>
//             </Box>
            
//             <Box sx={{ 
//               mt: 2, 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'center',
//               flexWrap: 'wrap',
//               gap: 2
//             }}>
//               <Box>
//                 <Typography variant="body1" sx={{ fontWeight: '500' }}>
//                   Total Quantity: <strong style={{ color: '#1976d2' }}>{calculateTotalQty()}</strong>
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                   Amount: ₹{calculateAmount().amount.toFixed(2)}
//                 </Typography>
//                 {fillByShadeMode && selectedShades.length > 1 && (
//                   <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                     Selected Shades: {selectedShades.length} (Total will be divided equally)
//                   </Typography>
//                 )}
//               </Box>
              
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleConfirmItem}
//                 disabled={calculateTotalQty() === 0}
//                 sx={{ 
//                   backgroundColor: '#4CAF50',
//                   color: 'white',
//                   '&:hover': { backgroundColor: '#45a049' },
//                   minWidth: '140px'
//                 }}
//               >
//                 Add to Order
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       )}

//       {/* Order Items Modal */}
//       <Modal
//         open={showOrderModal}
//         onClose={() => setShowOrderModal(false)}
//         aria-labelledby="order-items-modal"
//         aria-describedby="order-items-list"
//       >
//         <Fade in={showOrderModal}>
//           <Box sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' },
//             maxHeight: '90vh',
//             bgcolor: 'background.paper',
//             borderRadius: 2,
//             boxShadow: 24,
//             overflow: 'hidden',
//             display: 'flex',
//             flexDirection: 'column'
//           }}>
//             {/* Modal Header */}
//             <Box sx={{
//               p: 0.7,
//               backgroundColor: '#1976d2',
//               color: 'white',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}>
//               <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <CartIcon /> Order Items ({tableData.length})
//               </Typography>
//               <IconButton onClick={() => setShowOrderModal(false)} sx={{ color: 'white' }}>
//                 <CloseIcon />
//               </IconButton>
//             </Box>

//             {/* Modal Content - Scrollable */}
//             <Box sx={{ 
//               p: 2,
//               overflow: 'auto',
//               flexGrow: 1
//             }}>
//               {tableData.length === 0 ? (
//                 <Box sx={{ 
//                   display: 'flex', 
//                   flexDirection: 'column', 
//                   alignItems: 'center', 
//                   justifyContent: 'center',
//                   height: '200px',
//                   color: 'text.secondary'
//                 }}>
//                   <CartIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
//                   <Typography variant="h6">No items in order</Typography>
//                   <Typography variant="body2">Scan and add products to your order</Typography>
//                 </Box>
//               ) : (
//                 <>
//                   {/* Order Items Table */}
//                   <Box sx={{ 
//                     overflowX: 'auto',
//                     backgroundColor: '#f8f9fa',
//                     borderRadius: 1,
//                     mb: 1
//                   }}>
//                     <table style={{ 
//                       width: '100%', 
//                       borderCollapse: 'collapse',
//                       minWidth: '800px'
//                     }}>
//                       <thead>
//                         <tr style={{ backgroundColor: '#e9ecef' }}>
//                           <th style={{ 
//                             padding: '8px', 
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'left',
//                             fontSize: '14px',
//                             fontWeight: '600'
//                           }}>Barcode</th>
//                           <th style={{ 
//                             padding: '8px', 
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'left',
//                             fontSize: '14px',
//                             fontWeight: '600'
//                           }}>Product</th>
//                           <th style={{ 
//                             padding: '8px', 
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'left',
//                             fontSize: '14px',
//                             fontWeight: '600'
//                           }}>Style</th>
//                           <th style={{ 
//                             padding: '8px', 
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'left',
//                             fontSize: '14px',
//                             fontWeight: '600'
//                           }}>Type</th>
//                           <th style={{ 
//                             padding: '8px', 
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'left',
//                             fontSize: '14px',
//                             fontWeight: '600'
//                           }}>Shade</th>
//                           <th style={{ 
//                             padding: '8px', 
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'center',
//                             fontSize: '14px',
//                             fontWeight: '600'
//                           }}>Qty</th>
//                           <th style={{ 
//                             padding: '8px', 
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'right',
//                             fontSize: '14px',
//                             fontWeight: '600'
//                           }}>Rate</th>
//                           <th style={{ 
//                             padding: '8px', 
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'right',
//                             fontSize: '14px',
//                             fontWeight: '600'
//                           }}>Amount</th>
//                           <th style={{ 
//                             padding: '8px', 
//                             border: '1px solid #dee2e6', 
//                             textAlign: 'center',
//                             fontSize: '14px',
//                             fontWeight: '600'
//                           }}>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {tableData.map((item, index) => (
//                           <tr key={item.id} style={{ 
//                             backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
//                             borderBottom: '1px solid #dee2e6'
//                           }}>
//                             <td style={{ 
//                               padding: '8px',
//                               border: '1px solid #dee2e6',
//                               fontSize: '14px',
//                               fontFamily: 'monospace'
//                             }}>{item.barcode}</td>
//                             <td style={{ 
//                               padding: '8px', 
//                               border: '1px solid #dee2e6',
//                               fontSize: '14px'
//                             }}>{item.product}</td>
//                             <td style={{ 
//                               padding: '8px',
//                               border: '1px solid #dee2e6',
//                               fontSize: '14px'
//                             }}>{item.style}</td>
//                             <td style={{ 
//                               padding: '8px',  
//                               border: '1px solid #dee2e6',
//                               fontSize: '14px'
//                             }}>{item.type}</td>
//                             <td style={{ 
//                               padding: '8px',
//                               border: '1px solid #dee2e6',
//                               fontSize: '14px'
//                             }}>{item.shade}</td>
//                             <td style={{ 
//                               padding: '8px', 
//                               border: '1px solid #dee2e6',
//                               textAlign: 'center',
//                               fontSize: '14px'
//                             }}>{item.qty}</td>
//                             <td style={{ 
//                               padding: '8px',
//                               border: '1px solid #dee2e6',
//                               textAlign: 'right',
//                               fontSize: '14px'
//                             }}>₹{item.rate}</td>
//                             <td style={{ 
//                               padding: '8px',
//                               border: '1px solid #dee2e6',
//                               textAlign: 'right',
//                               fontSize: '14px',
//                               fontWeight: '500'
//                             }}>₹{item.amount.toFixed(2)}</td>
//                             <td style={{ 
//                               padding: '8px', 
//                               border: '1px solid #dee2e6',
//                               textAlign: 'center'
//                             }}>
//                               <IconButton 
//                                 onClick={() => {
//                                   handleDeleteItem(item.id);
//                                   if (tableData.length === 1) {
//                                     setShowOrderModal(false);
//                                   }
//                                 }}
//                                 size="small"
//                                 sx={{ color: '#f44336' }}
//                               >
//                                 <DeleteIcon fontSize="small" />
//                               </IconButton>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </Box>
                  
//                   {/* Order Summary */}
//                   <Box sx={{ 
//                     p: 1, 
//                     backgroundColor: '#e8f5e9', 
//                     borderRadius: 1 
//                   }}>
//                     <Typography variant="h6" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
//                       📊 Order Summary
//                     </Typography>
//                     <Grid container spacing={1} sx={{ mb: 1 }}>
//                       <Grid item xs={6} sm={3}>
//                         <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Items:</Typography>
//                         <Typography variant="h6" sx={{ color: '#1976d2' }}>{tableData.length}</Typography>
//                       </Grid>
//                       <Grid item xs={6} sm={3}>
//                         <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Quantity:</Typography>
//                         <Typography variant="h6" sx={{ color: '#1976d2' }}>
//                           {tableData.reduce((sum, item) => sum + item.qty, 0)}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6} sm={3}>
//                         <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Amount:</Typography>
//                         <Typography variant="h6" sx={{ color: '#1976d2' }}>
//                           ₹{tableData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={6} sm={3}>
//                         <Button
//                           variant="contained"
//                           fullWidth
//                           onClick={handleSubmitOrder}
//                           disabled={isLoadingData}
//                           sx={{ 
//                             backgroundColor: '#2196F3',
//                             '&:hover': { backgroundColor: '#1976d2' }
//                           }}
//                         >
//                           {isLoadingData ? <CircularProgress size={24} /> : 'Submit Order'}
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </Box>
//                 </>
//               )}
//             </Box>
//           </Box>
//         </Fade>
//       </Modal>

//       {/* Barcode Scanner Dialog */}
//       {isClient && !useStyleCodeMode && (
//         <Dialog
//           open={showScanner}
//           onClose={stopScanner}
//           maxWidth="md"
//           fullWidth
//           fullScreen={getWindowWidth() < 600}
//           PaperProps={{
//             sx: {
//               maxWidth: { xs: '100%', sm: '80%', md: '600px' },
//               height: { xs: '100vh', sm: '600px' },
//               margin: { xs: 0, sm: 'auto' },
//               borderRadius: { xs: 0, sm: 2 }
//             }
//           }}
//         >
//           <DialogTitle sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             backgroundColor: '#1976d2',
//             color: 'white'
//           }}>
//             <Typography variant="h6">📷 Scan Barcode</Typography>
//             <IconButton onClick={stopScanner} sx={{ color: 'white' }}>
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
          
//           <DialogContent sx={{ 
//             p: 2,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             <Typography variant="body2" sx={{ 
//               mb: 1, 
//               color: 'text.secondary',
//               textAlign: 'center'
//             }}>
//               Point your camera at the barcode
//             </Typography>
            
//             <Box
//               id="qr-reader"
//               sx={{
//                 width: '100%',
//                 height: { xs: '70vh', sm: '400px' },
//                 border: '2px dashed #ccc',
//                 borderRadius: 2,
//                 overflow: 'hidden',
//                 backgroundColor: '#000'
//               }}
//             />
            
//             <Typography variant="caption" sx={{ 
//               mt: 2, 
//               display: 'block', 
//               color: 'text.secondary',
//               textAlign: 'center'
//             }}>
//               The scanner will automatically detect barcodes
//             </Typography>
//           </DialogContent>
          
//           <DialogActions sx={{ 
//             p: 2,
//             backgroundColor: '#f5f5f5'
//           }}>
//             <Button 
//               onClick={stopScanner} 
//               variant="outlined"
//               sx={{ mr: 2 }}
//             >
//               Cancel
//             </Button>
//             <Typography variant="body2" sx={{ 
//               flexGrow: 1, 
//               textAlign: 'center', 
//               color: 'text.secondary',
//               fontSize: '12px'
//             }}>
//               Camera permission required • Works best in good light
//             </Typography>
//           </DialogActions>
//         </Dialog>
//       )}
//     </Box>
//   );
// };

// export default ScanBarcode;  












'use client';
import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  Paper,
  Modal,
  Fade,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  CardHeader,
  CardActions,
  InputAdornment,
  alpha,
  Collapse,
  ListItemButton
} from '@mui/material';
import { 
  CameraAlt as CameraIcon, 
  Close as CloseIcon, 
  QrCodeScanner as QrCodeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  LocalShipping as LocalShippingIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarTodayIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  ChevronRight as ChevronRightIcon,
  Done as DoneIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  TaskAlt as TaskAltIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";
import { useRouter } from 'next/navigation';
import { TbListSearch } from "react-icons/tb";
import { IoArrowBackCircleOutline } from "react-icons/io5";


const ScanBarcode = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  // State for all functionalities
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [useStyleCodeMode, setUseStyleCodeMode] = useState(false);
  const [fillByRatioMode, setFillByRatioMode] = useState(true); 
  const [fillByShadeMode, setFillByShadeMode] = useState(true); 
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [scanMode, setScanMode] = useState('barcode'); // 'barcode', 'style', 'manual'
  const [viewMode, setViewMode] = useState('scan'); // 'scan', 'details', 'ratios', 'cart'
  
  const [availableShades, setAvailableShades] = useState([]);
  const [selectedShades, setSelectedShades] = useState([]);
  const [shadeViewMode, setShadeViewMode] = useState('allocated');
  
  const [currentProductInfo, setCurrentProductInfo] = useState({
    barcode: '',
    style: '',
    product: ''
  });
  
  const [ratioData, setRatioData] = useState({
    totalQty: '',
    ratios: {}
  });
  
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    Party: '',
    PARTY_KEY: '',
    SHIPPING_PARTY: '',
    SHP_PARTY_KEY: '',
    Branch: '',
    PARTYDTL_ID: '',
    SHIPPING_PLACE: '',
    SHP_PARTYDTL_ID: '',
    Order_Type: 'Sales And Work-Order',
    ORDBK_TYPE: '2',
    Status: 'O',
    
    // New fields
    ORDER_NO: '',
    ORDER_DATE: new Date().toLocaleDateString('en-GB'),
    LAST_ORD_NO: '',
    SERIES: '',
    PARTY_ORD_NO: '',
    SEASON: '',
    ORD_REF_DT: '',
    QUOTE_NO: '',
    Broker: '',
    BROKER_KEY: '',
    SALESPERSON_1: '',
    SALEPERSON1_KEY: '',
    SALESPERSON_2: '',
    SALEPERSON2_KEY: '',
    MERCHANDISER_NAME: '',
    MERCHANDISER_ID: '',
    REMARK_STATUS: '',
    GST_APPL: 'N',
    GST_TYPE: 'STATE',
    DLV_DT: '',
    ORG_DLV_DT: '',
    MAIN_DETAILS: 'G',
    RACK_MIN: '0',
    REGISTERED_DEALER: '0',
    SHORT_CLOSE: '0',
    READY_SI: '0',
    PLANNING: '0'
  });

  const [newItemData, setNewItemData] = useState({
    barcode: '',
    product: '',
    style: '',
    type: '',
    shade: '',
    mrp: '',
    rate: '',
    qty: '',
    discount: '0',
    sets: '1',
    convFact: '1',
    remark: '',
    varPer: '0',
    stdQty: '',
    setNo: '',
    percent: '0',
    rQty: '',
    divDt: ''
  });

  const [styleCodeInput, setStyleCodeInput] = useState('');
  const [isLoadingStyleCode, setIsLoadingStyleCode] = useState(false);
  const styleCodeTimeoutRef = useRef(null);

  const [sizeDetailsData, setSizeDetailsData] = useState([]);
  const [tableData, setTableData] = useState([]);
  
  const [availableSizes, setAvailableSizes] = useState([]);
  
  const [partyOptions, setPartyOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [shippingPartyOptions, setShippingPartyOptions] = useState([]);
  const [shippingPlaceOptions, setShippingPlaceOptions] = useState([]);
  const [brokerOptions, setBrokerOptions] = useState([]);
  const [salesperson1Options, setSalesperson1Options] = useState([]);
  const [salesperson2Options, setSalesperson2Options] = useState([]);
  const [merchandiserOptions, setMerchandiserOptions] = useState([]);
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [orderTypeOptions, setOrderTypeOptions] = useState(['Sales And Work-Order', 'Sales Order', 'Work Order']);
  const [statusOptions] = useState(['O', 'C', 'S']);
  const [selectedShadeKey, setSelectedShadeKey] = useState('');
  const [shadeMapping, setShadeMapping] = useState({});
  
  const [partyMapping, setPartyMapping] = useState({});
  const [branchMapping, setBranchMapping] = useState({});
  const [shippingBranchMapping, setShippingBranchMapping] = useState({});
  const [brokerMapping, setBrokerMapping] = useState({});
  const [salesperson1Mapping, setSalesperson1Mapping] = useState({});
  const [salesperson2Mapping, setSalesperson2Mapping] = useState({});
  const [merchandiserMapping, setMerchandiserMapping] = useState({});
  const [seasonMapping, setSeasonMapping] = useState({});

  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const [currentStyleData, setCurrentStyleData] = useState(null);
  const [companyConfig, setCompanyConfig] = useState({
    CO_ID: '',
    COBR_ID: ''
  });

  // Initialize
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const storedCO_ID = localStorage.getItem('CO_ID') || '';
      const storedCOBR_ID = localStorage.getItem('COBR_ID') || '';
      
      setCompanyConfig({
        CO_ID: storedCO_ID,
        COBR_ID: storedCOBR_ID
      });
      
      fetchInitialData();
      generateOrderNumber();
    }
  }, []);

  const scannerRef = useRef(null);
  const qrCodeScannerRef = useRef(null);
  const barcodeInputRef = useRef(null);
  const styleCodeInputRef = useRef(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Styles
  const textInputSx = {
    '& .MuiInputBase-root': {
      height: isMobile ? 44 : 40,
      fontSize: isMobile ? '15px' : '14px',
      borderRadius: isMobile ? '12px' : '6px',
      width: '180px'
    },
    '& .MuiInputLabel-root': {
      fontSize: isMobile ? '15px' : '14px',
      top: isMobile ? '-8px' : '-4px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: isMobile ? '#ffffff' : '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: isMobile ? '12px' : '6px',
      overflow: 'hidden',
      height: isMobile ? 44 : 40,
      fontSize: isMobile ? '15px' : '14px',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: isMobile ? '#f8f9fa' : '#f5f5f5',
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused': {
        backgroundColor: '#ffffff',
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
      },
    },
    '& .MuiFilledInput-root:before': { display: 'none' },
    '& .MuiFilledInput-root:after': { display: 'none' },
    '& .MuiInputBase-input': {
      padding: isMobile ? '12px 14px !important' : '10px 12px !important',
      fontSize: isMobile ? '15px !important' : '14px !important',
      lineHeight: '1.4',
    },
  };

  const textInputSxtop = {
    '& .MuiInputBase-root': {
      height: isMobile ? 44 : 40,
      fontSize: isMobile ? '15px' : '14px',
      borderRadius: isMobile ? '12px' : '6px',
      width: '800px'
    },
    '& .MuiInputLabel-root': {
      fontSize: isMobile ? '15px' : '14px',
      top: isMobile ? '-8px' : '-4px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: isMobile ? '#ffffff' : '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: isMobile ? '12px' : '6px',
      overflow: 'hidden',
      height: isMobile ? 44 : 40,
      fontSize: isMobile ? '15px' : '14px',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: isMobile ? '#f8f9fa' : '#f5f5f5',
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused': {
        backgroundColor: '#ffffff',
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
      },
    },
    '& .MuiFilledInput-root:before': { display: 'none' },
    '& .MuiFilledInput-root:after': { display: 'none' },
    '& .MuiInputBase-input': {
      padding: isMobile ? '12px 14px !important' : '10px 12px !important',
      fontSize: isMobile ? '15px !important' : '14px !important',
      lineHeight: '1.4',
    },
  };

  const DropInputSx = {
    ...textInputSx,
    '& .MuiAutocomplete-endAdornment': {
      top: '50%',
      transform: 'translateY(-50%)',
      right: '10px',
    
     
    },
  };

const datePickerSx = {
  width: {
    xs: '100%',      // 📱 mobile
    md: '180px',     // 💻 desktop
  },

  "& .MuiInputBase-root": {
    height: {
      xs: '38px',    // 📱 mobile height
      md: '35px !important',    // 💻 desktop height
    },
    minHeight: {
      xs: '44px',
      md: '40px',
    },
    borderRadius: {
      xs: '12px',
      md: '6px',
    },
    display: 'flex',
    alignItems: 'center', // 👈 vertical center fix
  },

  "& .MuiInputBase-input": {
    padding: {
      xs: "12px 14px",
      md: "10px 12px",
    },
    fontSize: {
      xs: "15px",
      md: "14px",
    },
    boxSizing: 'border-box',
  },

  "& .MuiInputLabel-root": {
    top: {
      xs: '-8px',
      md: '-4px',
    },
    fontSize: {
      xs: '15px',
      md: '14px',
    },
  },
};



  // Key Functions (same as before, but optimized)
  const getRatioDataFromStorage = (productKey) => {
    if (!isClient || !productKey) return { totalQty: '', ratios: {} };
    try {
      const storedData = localStorage.getItem(`ratioData_${productKey}`);
      if (storedData) return JSON.parse(storedData);
    } catch (error) {
      console.error('Error reading ratio data:', error);
    }
    return { totalQty: '', ratios: {} };
  };

  const saveRatioDataToStorage = (productKey, data) => {
    if (!isClient || !productKey) return;
    try {
      localStorage.setItem(`ratioData_${productKey}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving ratio data:', error);
    }
  };

  const generateProductKey = (barcode, style, product) => {
    return `${barcode || ''}_${style || ''}_${product || ''}`.trim();
  };

  const generateFgItemKey = (item) => {
    const fgprdKey = item.FGPRD_KEY || item.fgprdKey || "";
    const fgstyleId = item.FGSTYLE_ID || item.fgstyleId || "";
    const fgtypeKey = item.FGTYPE_KEY || item.fgtypeKey || "";
    const fgshadeKey = item.FGSHADE_KEY || item.fgshadeKey || "";
    const fgptnKey = item.FGPTN_KEY || item.fgptnKey || "";
    
    const cleanFgprdKey = fgprdKey.trim();
    const cleanFgstyleId = fgstyleId.toString().trim();
    const cleanFgtypeKey = fgtypeKey.trim();
    const cleanFgshadeKey = fgshadeKey.trim();
    const cleanFgptnKey = fgptnKey.trim();
    
    let fgItemKey = cleanFgprdKey;
    if (cleanFgstyleId) fgItemKey += cleanFgstyleId;
    if (cleanFgtypeKey) fgItemKey += cleanFgtypeKey;
    if (cleanFgshadeKey) fgItemKey += cleanFgshadeKey;
    if (cleanFgptnKey) fgItemKey += cleanFgptnKey;
    
    return fgItemKey || "";
  };

  const fetchShadesForStyle = async (fgstyleId, mode = 'allocated') => {
    try {
      const payload = {
        "FGSTYLE_ID": mode === 'allocated' ? fgstyleId.toString() : "",
        "FLAG": ""
      };

      const response = await axiosInstance.post('/Fgshade/GetFgshadedrp', payload);
      
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const shades = response.data.DATA.map(item => ({
          FGSHADE_NAME: item.FGSHADE_NAME || '',
          FGSHADE_KEY: item.FGSHADE_KEY || '',
          FGSTYLE_ID: item.FGSTYLE_ID || fgstyleId
        }));
        
        const newShadeMap = {};
        response.data.DATA.forEach(item => {
          if (item.FGSHADE_NAME && item.FGSHADE_KEY) {
            newShadeMap[item.FGSHADE_NAME] = item.FGSHADE_KEY;
          }
        });
        
        setShadeMapping(newShadeMap);
        setAvailableShades(shades);
        
        if (mode === 'allocated' && shades.length > 0) {
          const firstShade = shades[0].FGSHADE_NAME;
          const firstShadeKey = shades[0].FGSHADE_KEY;
          
          setSelectedShades([firstShade]);
          setSelectedShadeKey(firstShadeKey);
          
          setNewItemData(prev => ({
            ...prev,
            shade: firstShade,
            fgshadeKey: firstShadeKey
          }));
        } else if (mode === 'all') {
          setSelectedShades([]);
          setSelectedShadeKey('');
        }
        
        return shades;
      } else {
        setAvailableShades([]);
        setSelectedShades([]);
        setSelectedShadeKey('');
        return [];
      }
    } catch (error) {
      console.error('Error fetching shades:', error);
      showSnackbar('Error fetching shades', 'error');
      setAvailableShades([]);
      setSelectedShades([]);
      setSelectedShadeKey('');
      return [];
    }
  };

  const handleShadeSelectionChange = (event) => {
    const { target: { value } } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setSelectedShades(selectedValues);
    
    if (selectedValues.length > 0) {
      const firstSelectedShade = selectedValues[0];
      const shadeKey = shadeMapping[firstSelectedShade] || '';
      
      setSelectedShadeKey(shadeKey);
      setNewItemData(prev => ({
        ...prev,
        shade: firstSelectedShade,
        fgshadeKey: shadeKey
      }));
      
      if (currentStyleData && shadeKey) {
        fetchSizeDetailsForStyle(currentStyleData, firstSelectedShade);
      }
    } else {
      setSelectedShadeKey('');
      setNewItemData(prev => ({
        ...prev,
        shade: '',
        fgshadeKey: ''
      }));
    }
  };

  const handleAllShadesClick = async () => {
    setShadeViewMode('all');
    await fetchShadesForStyle(currentStyleData?.FGSTYLE_ID || 0, 'all');
  };

  const handleAllocatedShadesClick = async () => {
    setShadeViewMode('allocated');
    await fetchShadesForStyle(currentStyleData?.FGSTYLE_ID || 0, 'allocated');
  };

  const generateOrderNumber = async () => {
    try {
      setIsLoadingData(true);
      
      const seriesPayload = {
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

      const seriesResponse = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', seriesPayload);
      
      if (seriesResponse.data.DATA && seriesResponse.data.DATA.length > 0) {
        const prefix = seriesResponse.data.DATA[0].CPREFIX;
        
        const orderPayload = {
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

        const orderResponse = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', orderPayload);
        
        if (orderResponse.data.DATA && orderResponse.data.DATA.length > 0) {
          const orderData = orderResponse.data.DATA[0];
          const correctOrdbkKey = `25${companyConfig.COBR_ID}${orderData.ID}`;
          
          setFormData(prev => ({
            ...prev,
            ORDER_NO: orderData.ID,
            LAST_ORD_NO: orderData.LASTID,
            SERIES: prefix,
            ORDBK_KEY: correctOrdbkKey
          }));
        }
      }
    } catch (error) {
      console.error('Error generating order number:', error);
      showSnackbar('Error generating order number', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      setIsLoadingData(true);
      await Promise.all([
        fetchPartiesByName(),
        fetchBrokerData(),
        fetchSalespersonData(),
        fetchMerchandiserData(),
        fetchSeasonData()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showSnackbar('Error loading initial data', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

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
        
        if (parties.length > 0 && !formData.Party) {
          const firstParty = parties[0];
          const firstPartyKey = mapping[firstParty];
          
          setFormData(prev => ({
            ...prev,
            Party: firstParty,
            PARTY_KEY: firstPartyKey,
            SHIPPING_PARTY: firstParty,
            SHP_PARTY_KEY: firstPartyKey
          }));
          
          fetchPartyDetails(firstPartyKey);
        }
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
      showSnackbar('Error fetching parties', 'error');
    }
  };

  const fetchPartyDetails = async (partyKey, isShippingParty = false) => {
    if (!partyKey) return;
    
    try {
      const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
        PARTY_KEY: partyKey
      });
      
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const branches = response.data.DATA.map(item => item.PLACE || '');
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.PLACE && item.PARTYDTL_ID) {
            mapping[item.PLACE] = item.PARTYDTL_ID;
          }
        });
        
        if (isShippingParty) {
          setShippingPlaceOptions(branches);
          setShippingBranchMapping(mapping);
          
          if (branches.length > 0 && !formData.SHIPPING_PLACE) {
            const firstBranch = branches[0];
            const firstBranchId = mapping[firstBranch];
            
            setFormData(prev => ({
              ...prev,
              SHIPPING_PLACE: firstBranch,
              SHP_PARTYDTL_ID: firstBranchId
            }));
          }
        } else {
          setBranchOptions(branches);
          setBranchMapping(mapping);
          
          if (branches.length > 0 && !formData.Branch) {
            const firstBranch = branches[0];
            const firstBranchId = mapping[firstBranch];
            
            setFormData(prev => ({
              ...prev,
              Branch: firstBranch,
              PARTYDTL_ID: firstBranchId,
              ...(!prev.SHIPPING_PLACE && {
                SHIPPING_PLACE: firstBranch,
                SHP_PARTYDTL_ID: firstBranchId
              })
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching party details:", error);
      showSnackbar('Error fetching branch details', 'error');
    }
  };

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
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.BROKER_NAME && item.BROKER_KEY) {
            mapping[item.BROKER_NAME] = item.BROKER_KEY;
          }
        });
        setBrokerMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching broker data:', error);
    }
  };

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

  const fetchStyleDataByBarcode = async (barcode) => {
    if (!barcode || barcode.trim() === '') {
      setScannerError('Please enter a barcode');
      return;
    }
    
    try {
      setIsLoadingBarcode(true);
      setScannerError('');
      
      const payload = {
        "FGSTYLE_ID": "",
        "FGPRD_KEY": "",
        "FGSTYLE_CODE": "",
        "ALT_BARCODE": barcode.trim(),
        "FLAG": ""
      };

      const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

      if (response.data.DATA && response.data.DATA.length > 0) {
        const exactMatch = response.data.DATA.find(item => 
          item.ALT_BARCODE && item.ALT_BARCODE.toString() === barcode.trim()
        );
        
        const styleData = exactMatch || response.data.DATA[0];
        
        const productKey = styleData.FGPRD_KEY || "";
        
        const isSameProduct = (
          currentProductInfo.productKey === productKey &&
          currentProductInfo.style === (styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '')
        );
        
        const newProductInfo = {
          barcode: styleData.ALT_BARCODE || styleData.STYSTKDTL_KEY || barcode,
          style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
          product: styleData.FGPRD_NAME || '',
          productKey: productKey
        };
        
        setCurrentProductInfo(newProductInfo);
        
        if (currentProductInfo.productKey && !isSameProduct) {
          if (Object.keys(ratioData.ratios).length > 0) {
            showSnackbar('Product has changed. Please enter new ratios for this product.', 'warning');
          }
          setRatioData({
            totalQty: '',
            ratios: {}
          });
        } else {
          const savedRatioData = getRatioDataFromStorage(productKey);
          if (savedRatioData.ratios && Object.keys(savedRatioData.ratios).length > 0) {
            setRatioData(savedRatioData);
            showSnackbar('Previous ratios loaded for this product', 'info');
          }
        }
        
        setCurrentStyleData(styleData);
        
        const shadeValue = styleData.FGSHADE_NAME || '';
        const sizeValue = styleData.STYSIZE_NAME || '';
        
        setNewItemData({
          ...newItemData,
          barcode: newProductInfo.barcode,
          product: newProductInfo.product,
          style: newProductInfo.style,
          type: styleData.FGTYPE_NAME || '',
          shade: shadeValue,
          size: sizeValue,
          mrp: styleData.MRP ? styleData.MRP.toString() : '0',
          rate: styleData.SSP ? styleData.SSP.toString() : '0',
          qty: '',
          discount: '0',
          sets: '1',
          convFact: '1',
          remark: ''
        });
        
        await fetchSizeDetailsForStyle(styleData, newItemData.shade);
        
        if (styleData.FGSTYLE_ID) {
          await fetchShadesForStyle(styleData.FGSTYLE_ID, shadeViewMode);
        }
        
        setFillByRatioMode(true);
        if (isMobile) {
      setActiveTab(2); 
      setViewMode('details');
    }
        
      } else {
        setScannerError('No product found for this barcode. Please check the barcode and try again.');
        showSnackbar('Product not found', 'warning');
      }
    } catch (error) {
      console.error('Error fetching style data:', error);
      setScannerError('Error fetching product details. Please try again.');
      showSnackbar('Error fetching product', 'error');
    } finally {
      setIsLoadingBarcode(false);
    }
  };

  const handleBackButton = () => {
 
  router.push('/inventorypage/?activeTab=sales-dispatch');
};

  const fetchStyleDataByCode = async (styleCode) => {
    if (!styleCode) return;

    try {
      setIsLoadingStyleCode(true);
      setScannerError('');
      
      const payload = {
        "FGSTYLE_ID": "",
        "FGPRD_KEY": "",
        "FGSTYLE_CODE": styleCode.trim(),
        "FLAG": ""
      };

      const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

      if (response.data.DATA && response.data.DATA.length > 0) {
        const styleData = response.data.DATA[0];
        
        let selectedStyleData = styleData;
        if (styleCodeInput && styleCodeInput.trim() !== '') {
          const exactMatch = response.data.DATA.find(item => 
            item.ALT_BARCODE && item.ALT_BARCODE.toString() === styleCodeInput.trim()
          );
          if (exactMatch) {
            selectedStyleData = exactMatch;
          }
        }
        
        const productKey = selectedStyleData.FGPRD_KEY || "";
        
        const isSameProduct = (
          currentProductInfo.productKey === productKey &&
          currentProductInfo.style === (selectedStyleData.FGSTYLE_CODE || selectedStyleData.FGSTYLE_NAME || '')
        );
        
        const newProductInfo = {
          barcode: selectedStyleData.ALT_BARCODE || selectedStyleData.STYSTKDTL_KEY || '',
          style: selectedStyleData.FGSTYLE_CODE || selectedStyleData.FGSTYLE_NAME || '',
          product: selectedStyleData.FGPRD_NAME || '',
          productKey: productKey
        };
        
        setCurrentProductInfo(newProductInfo);
        
        if (currentProductInfo.productKey && !isSameProduct) {
          if (Object.keys(ratioData.ratios).length > 0) {
            showSnackbar('Product has changed. Please enter new ratios for this product.', 'warning');
          }
          setRatioData({
            totalQty: '',
            ratios: {}
          });
        } else {
          const savedRatioData = getRatioDataFromStorage(productKey);
          if (savedRatioData.ratios && Object.keys(savedRatioData.ratios).length > 0) {
            setRatioData(savedRatioData);
            showSnackbar('Previous ratios loaded for this product', 'info');
          }
        }
        
        setCurrentStyleData(selectedStyleData);
        
        const shadeValue = selectedStyleData.FGSHADE_NAME || '';
        const sizeValue = selectedStyleData.STYSIZE_NAME || '';
        
        setNewItemData({
          ...newItemData,
          barcode: newProductInfo.barcode,
          product: newProductInfo.product,
          style: newProductInfo.style,
          type: selectedStyleData.FGTYPE_NAME || '',
          shade: shadeValue,
          size: sizeValue,
          mrp: selectedStyleData.MRP ? selectedStyleData.MRP.toString() : '0',
          rate: selectedStyleData.SSP ? selectedStyleData.SSP.toString() : '0',
          qty: '',
          discount: '0',
          sets: '1',
          convFact: '1',
          remark: ''
        });
        
        showSnackbar('Product found successfully by style code!');
        
        await fetchSizeDetailsForStyle(styleData, newItemData.shade);
        
        if (selectedStyleData.FGSTYLE_ID) {
          await fetchShadesForStyle(selectedStyleData.FGSTYLE_ID, shadeViewMode);
        }
        
        setFillByRatioMode(true);
      if (isMobile) {
      setActiveTab(2); // Items tab index
      setViewMode('details');
    }
        
      } else {
        setScannerError('No product found for this style code. Please check the style code and try again.');
        showSnackbar('Product not found', 'warning');
      }
    } catch (error) {
      console.error('Error fetching style data by code:', error);
      setScannerError('Error fetching product details. Please try again.');
      showSnackbar('Error fetching product', 'error');
    } finally {
      setIsLoadingStyleCode(false);
    }
  };

  const handleStyleCodeInputChange = (e) => {
    const value = e.target.value;
    setStyleCodeInput(value);
    
    if (styleCodeTimeoutRef.current) {
      clearTimeout(styleCodeTimeoutRef.current);
    }
    
    if (value && value.trim() !== '') {
      styleCodeTimeoutRef.current = setTimeout(() => {
        fetchStyleDataByCode(value.trim());
      }, 500);
    }
  };

  const handleStyleCodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (styleCodeTimeoutRef.current) {
        clearTimeout(styleCodeTimeoutRef.current);
      }
      fetchStyleDataByCode(styleCodeInput.trim());
    }
  };

  const fetchSizeDetailsForStyle = async (styleData, selectedShadeName = '') => {
    try {
      const fgprdKey = styleData.FGPRD_KEY;
      const fgstyleId = styleData.FGSTYLE_ID;
      const fgtypeKey = styleData.FGTYPE_KEY || "";
      
      let fgshadeKey = "";
      if (selectedShadeName && shadeMapping[selectedShadeName]) {
        fgshadeKey = shadeMapping[selectedShadeName];
      } else if (styleData.FGSHADE_KEY) {
        fgshadeKey = styleData.FGSHADE_KEY;
      } else if (newItemData.shade && shadeMapping[newItemData.shade]) {
        fgshadeKey = shadeMapping[newItemData.shade];
      } else if (selectedShadeKey) {
        fgshadeKey = selectedShadeKey;
      }
      
      const fgptnKey = styleData.FGPTN_KEY || "";

      if (!fgprdKey || !fgstyleId) {
        return;
      }

      const stycatrtPayload = {
        "FGSTYLE_ID": fgstyleId,
        "FGPRD_KEY": fgprdKey,
        "FGTYPE_KEY": fgtypeKey,
        "FGSHADE_KEY": fgshadeKey,
        "FGPTN_KEY": fgptnKey,
        "FLAG": "GETSTYCATRTID",
        "MRP": parseFloat(styleData.MRP) || 0,
        "PARTY_KEY": formData.PARTY_KEY || "",
        "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
        "COBR_ID": companyConfig.COBR_ID || "02",
        "FCYR_KEY": "25"
      };

      const stycatrtResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', stycatrtPayload);

      let stycatrtId = 0;
      if (stycatrtResponse.data.DATA && stycatrtResponse.data.DATA.length > 0) {
        stycatrtId = stycatrtResponse.data.DATA[0].STYCATRT_ID || 0;
      }

      const sizeDetailsPayload = {
        "FGSTYLE_ID": fgstyleId,
        "FGPRD_KEY": fgprdKey,
        "FGTYPE_KEY": fgtypeKey,
        "FGSHADE_KEY": fgshadeKey,
        "FGPTN_KEY": fgptnKey,
        "MRP": parseFloat(styleData.MRP) || 0,
        "SSP": parseFloat(styleData.SSP) || 0,
        "PARTY_KEY": formData.PARTY_KEY || "",
        "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
        "COBR_ID": companyConfig.COBR_ID || "02",
        "FLAG": "S",
        "FCYR_KEY": "25"
      };

      const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', sizeDetailsPayload);

      if (response.data.DATA && response.data.DATA.length > 0) {
        const transformedSizeDetails = response.data.DATA.map((size, index) => ({
          STYSIZE_ID: size.STYSIZE_ID || index + 1,
          STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
          FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
          QTY: 0,
          ITM_AMT: 0,
          ORDER_QTY: 0,
          MRP: parseFloat(styleData.MRP) || 0,
          RATE: parseFloat(styleData.SSP) || 0,
          ALT_BARCODE: styleData.ALT_BARCODE || "",
          STYCATRT_ID: stycatrtId,
          FGSHADE_KEY: fgshadeKey,
          FG_QTY: parseFloat(size.FG_QTY) || 0,
          PORD_QTY: parseFloat(size.PORD_QTY) || 0,
          ISU_QTY: parseFloat(size.ISU_QTY) || 0,
          BAL_QTY: parseFloat(size.BAL_QTY) || 0,
        }));

        setSizeDetailsData(transformedSizeDetails);
        
        setCurrentStyleData(prev => ({
          ...prev,
          STYCATRT_ID: stycatrtId,
          FGSHADE_KEY: fgshadeKey
        }));
        
        const availableSizesForRatio = response.data.DATA.map(size => ({
          STYSIZE_ID: size.STYSIZE_ID,
          STYSIZE_NAME: size.STYSIZE_NAME,
          MRP: size.MRP,
          WSP: size.WSP || size.RATE,
          STYCATRT_ID: stycatrtId,
          FGSHADE_KEY: fgshadeKey
        }));
        
        setAvailableSizes(availableSizesForRatio);
        
      } else {
        const stysizeName = styleData.STYSIZE_NAME || 'Default';
        const stysizeId = styleData.STYSIZE_ID || 1;
        
        const defaultSizes = [
          { 
            STYSIZE_NAME: stysizeName,
            STYSIZE_ID: stysizeId, 
            QTY: 0, 
            MRP: parseFloat(styleData.MRP) || 0, 
            RATE: parseFloat(styleData.SSP) || 0,
            WSP: parseFloat(styleData.SSP) || 0,
            STYCATRT_ID: stycatrtId,
            FGSHADE_KEY: fgshadeKey
          }
        ];
        
        setAvailableSizes(defaultSizes);
        setSizeDetailsData(defaultSizes);
      }
    } catch (error) {
      console.error('Error fetching size details:', error);
      
      const stysizeName = styleData.STYSIZE_NAME || 'Default';
      const stysizeId = styleData.STYSIZE_ID || 1;
      
      const defaultSizes = [
        { 
          STYSIZE_NAME: stysizeName,
          STYSIZE_ID: stysizeId, 
          QTY: 0, 
          MRP: parseFloat(newItemData.mrp) || 0, 
          RATE: parseFloat(newItemData.rate) || 0,
          WSP: parseFloat(newItemData.rate) || 0,
          STYCATRT_ID: 0,
          FGSHADE_KEY: selectedShadeKey || ''
        }
      ];
      
      setAvailableSizes(defaultSizes);
      setSizeDetailsData(defaultSizes);
    }
  };

  const handleRatioChange = (sizeName, value) => {
    const newRatioData = {
      ...ratioData,
      ratios: {
        ...ratioData.ratios,
        [sizeName]: value
      }
    };
    
    setRatioData(newRatioData);
    
    if (currentProductInfo.productKey) {
      saveRatioDataToStorage(currentProductInfo.productKey, newRatioData);
    }
  };

  const handleTotalQtyChange = (value) => {
    const newRatioData = {
      ...ratioData,
      totalQty: value
    };
    
    setRatioData(newRatioData);
    
    if (currentProductInfo.productKey) {
      saveRatioDataToStorage(currentProductInfo.productKey, newRatioData);
    }
  };

  const fillQuantitiesByRatio = () => {
    const totalQty = parseFloat(ratioData.totalQty);
    if (!totalQty || totalQty <= 0) {
      showSnackbar('Please enter a valid total quantity', 'error');
      return;
    }

    const ratios = ratioData.ratios;
    const sizeNames = Object.keys(ratios);
    
    if (sizeNames.length === 0) {
      showSnackbar('Please enter ratios for at least one size', 'error');
      return;
    }

    const totalRatio = sizeNames.reduce((sum, sizeName) => {
      const ratio = parseFloat(ratios[sizeName]) || 0;
      return sum + ratio;
    }, 0);

    if (totalRatio === 0) {
      showSnackbar('Total ratio cannot be zero', 'error');
      return;
    }

    const updatedSizeDetails = [...sizeDetailsData];
    let allocatedQty = 0;

    sizeNames.forEach((sizeName) => {
      const ratio = parseFloat(ratios[sizeName]) || 0;
      const exactQty = (ratio / totalRatio) * totalQty;
      const roundedQty = Math.round(exactQty);
      
      const sizeIndex = updatedSizeDetails.findIndex(size => size.STYSIZE_NAME === sizeName);
      if (sizeIndex !== -1) {
        const wsp = updatedSizeDetails[sizeIndex].WSP || updatedSizeDetails[sizeIndex].RATE || 0;
        const amount = roundedQty * wsp;
        
        updatedSizeDetails[sizeIndex] = {
          ...updatedSizeDetails[sizeIndex],
          QTY: roundedQty,
          ITM_AMT: amount
        };
        allocatedQty += roundedQty;
      }
    });

    const difference = totalQty - allocatedQty;
    if (difference !== 0 && sizeNames.length > 0) {
      const firstSizeName = sizeNames[0];
      const firstSizeIndex = updatedSizeDetails.findIndex(size => size.STYSIZE_NAME === firstSizeName);
      if (firstSizeIndex !== -1) {
        const wsp = updatedSizeDetails[firstSizeIndex].WSP || updatedSizeDetails[firstSizeIndex].RATE || 0;
        const newQty = updatedSizeDetails[firstSizeIndex].QTY + difference;
        const newAmount = newQty * wsp;
        
        updatedSizeDetails[firstSizeIndex] = {
          ...updatedSizeDetails[firstSizeIndex],
          QTY: newQty,
          ITM_AMT: newAmount
        };
      }
    }

    setSizeDetailsData(updatedSizeDetails);
    
    const newTotalQty = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
    const totalAmount = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.ITM_AMT) || 0), 0);
    
    setNewItemData(prev => ({ 
      ...prev, 
      qty: newTotalQty.toString(),
      rate: newTotalQty > 0 ? (totalAmount / newTotalQty).toFixed(2) : prev.rate
    }));
    
    if (fillByShadeMode && selectedShades.length > 0) {
      const perShadeQty = newTotalQty;
      showSnackbar(`Quantities filled successfully! Each shade will get: ${perShadeQty}`, 'success');
    } else {
      showSnackbar(`Quantities filled successfully! Total: ${newTotalQty}`, 'success');
    }
  };

  const handleConfirmItem = () => {
    if (!newItemData.product || !newItemData.style) {
      showSnackbar("Please scan a valid barcode or enter style code first", 'error');
      return;
    }

    const totalQty = calculateTotalQty();
    if (totalQty === 0) {
      showSnackbar("Please enter quantity in size details", 'error');
      return;
    }

    const { amount, netAmount } = calculateAmount();

    if (fillByShadeMode && selectedShades.length > 0) {
      const newItems = selectedShades.map(shade => {
        const shadeAmount = amount;
        const shadeQty = totalQty;
        
        return {
          id: Date.now() + Math.random(),
          barcode: newItemData.barcode,
          product: newItemData.product,
          style: newItemData.style,
          type: newItemData.type,
          shade: shade,
          qty: shadeQty,
          mrp: parseFloat(newItemData.mrp) || 0,
          rate: parseFloat(newItemData.rate) || 0,
          amount: shadeAmount,
          discAmt: parseFloat(newItemData.discount) || 0,
          netAmt: netAmount,
          sets: parseFloat(newItemData.sets) || 0,
          varPer: parseFloat(newItemData.varPer) || 0,
          remark: newItemData.remark,
          sizeDetails: [...sizeDetailsData],
          convFact: newItemData.convFact,
          styleData: currentStyleData,
          STYCATRT_ID: currentStyleData?.STYCATRT_ID || 0
        };
      });

      setTableData(prev => [...prev, ...newItems]);

    } else {
      const newItem = {
        id: Date.now(),
        barcode: newItemData.barcode,
        product: newItemData.product,
        style: newItemData.style,
        type: newItemData.type,
        shade: newItemData.shade,
        qty: totalQty,
        mrp: parseFloat(newItemData.mrp) || 0,
        rate: parseFloat(newItemData.rate) || 0,
        amount: amount,
        discAmt: parseFloat(newItemData.discount) || 0,
        netAmt: netAmount,
        sets: parseFloat(newItemData.sets) || 0,
        varPer: parseFloat(newItemData.varPer) || 0,
        remark: newItemData.remark,
        sizeDetails: [...sizeDetailsData],
        convFact: newItemData.convFact,
        styleData: currentStyleData,
        STYCATRT_ID: currentStyleData?.STYCATRT_ID || 0
      };

      setTableData(prev => [...prev, newItem]);
    }

    // Reset form
    setNewItemData({
      barcode: '',
      product: '',
      style: '',
      type: '',
      shade: '',
      mrp: '',
      rate: '',
      qty: '',
      discount: '0',
      sets: '1',
      convFact: '1',
      remark: '',
      varPer: '0',
      stdQty: '',
      setNo: '',
      percent: '0',
      rQty: '',
      divDt: ''
    });
    
    if (useStyleCodeMode) {
      setStyleCodeInput('');
    }
    
    setCurrentProductInfo({
      barcode: '',
      style: '',
      product: '',
      productKey: ''
    });
    setCurrentStyleData(null);
    setSizeDetailsData([]);
    setAvailableSizes([]);
    setAvailableShades([]);
    setSelectedShades([]);
    setFillByRatioMode(true);
    setFillByShadeMode(true);
    setRatioData({
      totalQty: '',
      ratios: {}
    });
    setScannerError('');
    if (isMobile) setViewMode('scan');

    if (fillByShadeMode && selectedShades.length > 1) {
      showSnackbar(`${selectedShades.length} items added to order (${totalQty} each)! Go To Cart`, 'success');
    } else {
      showSnackbar('Item added to order! Go To Cart', 'success');
    }
  };

  const handleFormChange = (field, value) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    
    if (field === 'Party' && partyMapping[value]) {
      updatedFormData.PARTY_KEY = partyMapping[value];
      updatedFormData.SHIPPING_PARTY = value;
      updatedFormData.SHP_PARTY_KEY = partyMapping[value];
      
      updatedFormData.SHIPPING_PLACE = '';
      updatedFormData.SHP_PARTYDTL_ID = '';
      
      fetchPartyDetails(partyMapping[value]);
    }
    
    if (field === 'SHIPPING_PARTY' && partyMapping[value]) {
      updatedFormData.SHP_PARTY_KEY = partyMapping[value];
      updatedFormData.SHIPPING_PLACE = '';
      fetchPartyDetails(partyMapping[value], true);
    }
    
    if (field === 'Branch' && branchMapping[value]) {
      updatedFormData.PARTYDTL_ID = branchMapping[value];
      if (!updatedFormData.SHIPPING_PLACE) {
        updatedFormData.SHIPPING_PLACE = value;
        updatedFormData.SHP_PARTYDTL_ID = branchMapping[value];
      }
    }
    
    if (field === 'SHIPPING_PLACE' && shippingBranchMapping[value]) {
      updatedFormData.SHP_PARTYDTL_ID = shippingBranchMapping[value];
    }
    
    if (field === 'Broker' && brokerMapping[value]) {
      updatedFormData.BROKER_KEY = brokerMapping[value];
    }
    
    if (field === 'SALESPERSON_1' && salesperson1Mapping[value]) {
      updatedFormData.SALEPERSON1_KEY = salesperson1Mapping[value];
    }
    
    if (field === 'SALESPERSON_2' && salesperson2Mapping[value]) {
      updatedFormData.SALEPERSON2_KEY = salesperson2Mapping[value];
    }
    
    if (field === 'MERCHANDISER_NAME' && merchandiserMapping[value]) {
      updatedFormData.MERCHANDISER_ID = merchandiserMapping[value];
    }
    
    if (field === 'SEASON' && seasonMapping[value]) {
      updatedFormData.CURR_SEASON_KEY = seasonMapping[value];
    }
    
    setFormData(updatedFormData);
  };

  const handleNewItemChange = (field, value) => {
    setNewItemData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManualBarcodeSubmit = () => {
    if (!newItemData.barcode || newItemData.barcode.trim() === '') {
      setScannerError('Please enter a barcode');
      return;
    }
    
    fetchStyleDataByBarcode(newItemData.barcode);
  };

  const handleTable = () => {
    router.push('/inverntory/stock-enquiry-table');
  };

  const handleCartIconClick = () => {
    if (tableData.length === 0) {
      showSnackbar('No items in the order yet', 'info');
      return;
    }
    setShowOrderModal(true);
    if (isMobile) setViewMode('cart');
  };

  const handleBarcodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualBarcodeSubmit();
    }
  };

  const handleSizeQtyChange = (index, newQty) => {
    const updatedSizeDetails = [...sizeDetailsData];
    const qty = parseFloat(newQty) || 0;
    const rate = parseFloat(newItemData.rate) || 0;
    const amount = qty * rate;
    
    updatedSizeDetails[index] = {
      ...updatedSizeDetails[index],
      QTY: qty,
      ITM_AMT: amount,
      ORDER_QTY: qty
    };

    setSizeDetailsData(updatedSizeDetails);
    
    const totalQty = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
    setNewItemData(prev => ({ ...prev, qty: totalQty.toString() }));
  };

  const calculateTotalQty = () => {
    return sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
  };

  const calculateAmount = () => {
    const totalQty = calculateTotalQty();
    const rate = parseFloat(newItemData.rate) || 0;
    const discount = parseFloat(newItemData.discount) || 0;
    const amount = totalQty * rate;
    return {
      amount: amount,
      netAmount: amount - discount
    };
  };

  const handleDeleteItem = (id) => {
    setTableData(prev => prev.filter(item => item.id !== id));
    showSnackbar('Item removed from order', 'info');
  };

  const initScanner = () => {
    if (typeof window === 'undefined') {
      console.error('Scanner not available on server');
      return;
    }

    if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current.clear().catch(err => {
        console.error("Failed to clear existing scanner", err);
      });
      qrCodeScannerRef.current = null;
    }

    const qrReaderElement = document.getElementById('qr-reader');
    if (!qrReaderElement) {
      console.error('qr-reader element not found');
      setScannerError('Scanner element not found. Please try again.');
      return;
    }

    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: isMobile ? 200 : 250, height: isMobile ? 200 : 250 },
          rememberLastUsedCamera: true,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true
        },
        false
      );

      const onScanSuccess = (decodedText, decodedResult) => {
        scanner.clear().then(() => {
          qrCodeScannerRef.current = null;
          setIsScanning(false);
          setShowScanner(false);
          
          setNewItemData(prev => ({ ...prev, barcode: decodedText }));
          fetchStyleDataByBarcode(decodedText);
          showSnackbar('Barcode scanned successfully!', 'success');
          if (isMobile) {
      setActiveTab(2); 
    }
        }).catch(err => {
          console.error("Failed to clear scanner", err);
        });
      };

      const onScanFailure = (error) => {
        if (!error.includes('NotFoundException')) {
          console.warn(`Scan error: ${error}`);
        }
      };

      scanner.render(onScanSuccess, onScanFailure);
      qrCodeScannerRef.current = scanner;
      setIsScanning(true);
      setScannerError('');
      
    } catch (error) {
      console.error("Scanner initialization error:", error);
      setScannerError(`Failed to initialize scanner: ${error.message}`);
      showSnackbar('Scanner initialization failed. Please check camera permissions.', 'error');
      setShowScanner(false);
    }
  };

  const startScanner = () => {
    if (typeof window === 'undefined') {
      showSnackbar('Scanner not available on server', 'error');
      return;
    }
    setShowScanner(true);
    setScannerError('');
  };

  const stopScanner = () => {
    if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
      qrCodeScannerRef.current = null;
    }
    setIsScanning(false);
    setShowScanner(false);
  };

  const prepareSubmitPayload = () => {
    const dbFlag = 'I';
    const currentDate = new Date().toISOString().replace('T', ' ').split('.')[0];
    
    const userId = localStorage.getItem('USER_ID') || '1';
    const userName = localStorage.getItem('USER_NAME') || 'Admin';

    const getStatusValue = (status) => {
      const statusMapping = {
        'O': '1',
        'C': '0',
        'S': '5'
      };
      return statusMapping[status] || "1";
    };

    const correctOrdbkKey = `25${companyConfig.COBR_ID}${formData.ORDER_NO}`;

    const transformedOrdbkStyleList = tableData.map((item, index) => {
      const tempId = Date.now() + index;
      
      const fgstyleId = item.styleData?.FGSTYLE_ID || 0;
      const fgprdKey = item.styleData?.FGPRD_KEY || '';
      const fgtypeKey = item.styleData?.FGTYPE_KEY || '';
      let fgshadeKey = item.styleData?.FGSHADE_KEY || '';
      if (!fgshadeKey && item.shade && shadeMapping[item.shade]) {
        fgshadeKey = shadeMapping[item.shade];
      }
      const fgptnKey = item.styleData?.FGPTN_KEY || '';
      const stycatrtId = item.STYCATRT_ID || item.styleData?.STYCATRT_ID || 0;
      
      const fgItemKey = generateFgItemKey({
        FGPRD_KEY: fgprdKey,
        FGSTYLE_ID: fgstyleId,
        FGTYPE_KEY: fgtypeKey,
        FGSHADE_KEY: fgshadeKey,
        FGPTN_KEY: fgptnKey
      });

      return {
        DBFLAG: 'I',
        ORDBKSTY_ID: tempId,
        ORDBK_KEY: correctOrdbkKey,
        FGPRD_KEY: fgprdKey,
        FGSTYLE_ID: fgstyleId,
        FGSTYLE_CODE: item.style || '',
        FGTYPE_KEY: fgtypeKey,
        FGSHADE_KEY: fgshadeKey,
        FGPTN_KEY: fgptnKey,
        FGITEM_KEY: item.barcode || "",
        FGITM_KEY: fgItemKey,
        ALT_BARCODE: item.barcode || "",
        QTY: parseFloat(item.qty) || 0,
        STYCATRT_ID: stycatrtId,
        RATE: parseFloat(item.rate) || 0,
        AMT: parseFloat(item.amount) || 0,
        DLV_VAR_PERCENT: parseFloat(item.varPer) || 0,
        DLV_VAR_QTY: 0,
        OPEN_RATE: "",
        TERM_KEY: "",
        TERM_NAME: "",
        TERM_PERCENT: 0,
        TERM_FIX_AMT: 0,
        TERM_RATE: 0,
        TERM_PERQTY: 0,
        DISC_AMT: parseFloat(item.discAmt) || 0,
        NET_AMT: parseFloat(item.netAmt) || 0,
        INIT_DT: "1900-01-01 00:00:00.000",
        INIT_REMK: "",
        INIT_QTY: 0,
        DLV_DT: "1900-01-01 00:00:00.000",
        BAL_QTY: parseFloat(item.qty) || 0,
        STATUS: "1",
        STYLE_PRN: "",
        TYPE_PRN: "",
        MRP_PRN: parseFloat(item.mrp) || 0,
        REMK: item.remark || "",
        QUOTEDTL_ID: 0,
        SETQTY: parseFloat(item.sets) || 0,
        RQTY: 0,
        DISTBTR_KEY: "",
        LOTNO: formData.CURR_SEASON_KEY || "",
        WOBALQTY: parseFloat(item.qty) || 0,
        REFORDBKSTY_ID: 0,
        BOMSTY_ID: 0,
        ISRMREQ: "N",
        OP_QTY: 0,
        ORDBKSTYSZLIST: (item.sizeDetails || []).map((sizeItem, sizeIndex) => ({
          DBFLAG: 'I',
          ORDBKSTYSZ_ID: sizeItem.STYSIZE_ID || (tempId * 100 + sizeIndex),
          ORDBK_KEY: correctOrdbkKey,
          ORDBKSTY_ID: tempId,
          STYSIZE_ID: sizeItem.STYSIZE_ID || 0,
          STYSIZE_NAME: sizeItem.STYSIZE_NAME || "",
          QTY: parseFloat(sizeItem.QTY) || 0,
          INIT_DT: "1900-01-01 00:00:00.000",
          INIT_REMK: "",
          INIT_QTY: 0,
          BAL_QTY: parseFloat(sizeItem.QTY) || 0,
          MRP: parseFloat(item.mrp) || 0,
          WSP: parseFloat(item.rate) || 0,
          RQTY: 0,
          WOBALQTY: parseFloat(sizeItem.QTY) || 0,
          REFORDBKSTYSZ_ID: 0,
          OP_QTY: 0,
          HSNCODE_KEY: "IG001",
          GST_RATE_SLAB_ID: 39,
          ITM_AMT: parseFloat(sizeItem.ITM_AMT) || 0,
          DISC_AMT: 0,
          NET_AMT: parseFloat(sizeItem.ITM_AMT) || 0,
          SGST_AMT: 0,
          CGST_AMT: 0,
          IGST_AMT: 0,
          NET_SALE_RATE: 0,
          OTHER_AMT: 0,
          ADD_CESS_RATE: 0,
          ADD_CESS_AMT: 0
        }))
      };
    });

    const totalQty = tableData.reduce((sum, item) => sum + (item.qty || 0), 0);
    const totalAmount = tableData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalDiscount = tableData.reduce((sum, item) => sum + (item.discAmt || 0), 0);
    const netAmount = totalAmount - totalDiscount;

    const basePayload = {
      DBFLAG: dbFlag,
      FCYR_KEY: "25",
      CO_ID: companyConfig.CO_ID,
      COBR_ID: companyConfig.COBR_ID, 
      ORDBK_NO: formData.ORDER_NO || "",
      CURR_SEASON_KEY: formData.CURR_SEASON_KEY || "",
      ORDBK_X: "",
      ORDBK_TNA_TYPE: "I",
      MERCHANDISER_ID: parseInt(formData.MERCHANDISER_ID) || 1,
      ORD_EVENT_KEY: "",
      ORG_DLV_DT: formatDateForAPI(formData.ORG_DLV_DT) || "1900-01-01T00:00:00",
      PLANNING: "0",
      STATUS: getStatusValue(formData.Status),
      ORDBK_KEY: correctOrdbkKey,
      ORDBK_DT: formatDateForAPI(formData.ORDER_DATE) || currentDate,
      PORD_REF: formData.PARTY_ORD_NO || "",
      PORD_DT: formatDateForAPI(formData.ORD_REF_DT) || "1900-01-01T00:00:00",
      QUOTE_NO: formData.QUOTE_NO || "",
      QUOTE_DT: formatDateForAPI(formData.ORDER_DATE) || currentDate,
      PARTY_KEY: formData.PARTY_KEY || "",
      PARTYDTL_ID: parseInt(formData.PARTYDTL_ID) || 0,
      BROKER_KEY: formData.BROKER_KEY || "",
      BROKER1_KEY: "",
      BROKER_COMM: 0.00,
      COMMON_DLV_DT_FLG: "0",
      STK_FLG: formData.RACK_MIN || "0",
      DLV_DT: formatDateForAPI(formData.DLV_DT) || "1900-01-01T00:00:00",
      DLV_PLACE: formData.SHIPPING_PLACE || "",
      TRSP_KEY: "",
      ORDBK_AMT: parseFloat(totalAmount) || 0,
      REMK: formData.REMARK_STATUS || "",
      CURRN_KEY: "",
      EX_RATE: 0,
      IMP_ORDBK_KEY: "",
      ORDBK_TYPE: formData.ORDBK_TYPE || "2",
      ROUND_OFF_DESC: "",
      ROUND_OFF: 0.00,
      BOMSTY_ID: 0,
      LOTWISE: formData.MAIN_DETAILS === "L" ? "Y" : "N",
      IsWO: "0",
      SuplKey: "",
      KNIT_DT: "1900-01-01 00:00:00.000",
      OrdBk_CoBr_Id: companyConfig.COBR_ID,
      GR_AMT: parseFloat(totalAmount) || 0,
      GST_APP: formData.GST_APPL || "N",
      GST_TYPE: formData.GST_TYPE === "STATE" ? "S" : "I",
      SHP_PARTY_KEY: formData.SHP_PARTY_KEY || formData.PARTY_KEY,
      SHP_PARTYDTL_ID: parseInt(formData.SHP_PARTYDTL_ID) || parseInt(formData.PARTYDTL_ID) || 0,
      STATE_CODE: "",
      ORDBK_ITM_AMT: parseFloat(totalAmount) || 0,
      ORDBK_SGST_AMT: 0,
      ORDBK_CGST_AMT: 0,
      ORDBK_IGST_AMT: 0,
      ORDBK_ADD_CESS_AMT: 0,
      ORDBK_GST_AMT: 0,
      ORDBK_EXTRA_AMT: 0,
      ORDBKSTYLIST: transformedOrdbkStyleList,
      ORDBKTERMLIST: [],
      ORDBKGSTLIST: [],
      DISTBTR_KEY: "",
      SALEPERSON1_KEY: formData.SALEPERSON1_KEY || "",
      SALEPERSON2_KEY: formData.SALEPERSON2_KEY || "",
      TRSP_KEY: "",
      PRICELIST_KEY: "",
      DESP_PORT: "",
      CREATED_BY: parseInt(userId) || 1,
      CREATED_DT: currentDate
    };

    return basePayload;
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "1900-01-01T00:00:00";
    
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

  const handleSubmitOrder = async () => {
    if (tableData.length === 0) {
      showSnackbar('Please add at least one item to the order', 'error');
      return;
    }

    if (!formData.Party || !formData.PARTY_KEY) {
      showSnackbar('Please select a party first', 'error');
      return;
    }

    try {
      setIsLoadingData(true);
      
      const payload = prepareSubmitPayload();
      const userName = localStorage.getItem('USER_NAME') || 'Admin';
      const strCobrid = companyConfig.COBR_ID;
      
      const response = await axiosInstance.post(
        `/ORDBK/ApiMangeOrdbk?UserName=${userName}&strCobrid=${strCobrid}`, 
        payload
      );
      
      if (response.data.RESPONSESTATUSCODE === 1) {
        showSnackbar(`Order submitted successfully! Order No: ${formData.ORDER_NO}`, 'success');
        
        setTableData([]);
        setFormData({
          Party: '',
          PARTY_KEY: '',
          SHIPPING_PARTY: '',
          SHP_PARTY_KEY: '',
          Branch: '',
          PARTYDTL_ID: '',
          SHIPPING_PLACE: '',
          SHP_PARTYDTL_ID: '',
          Order_Type: 'Sales And Work-Order',
          ORDBK_TYPE: '2',
          Status: 'O',
          ORDER_NO: '',
          ORDER_DATE: new Date().toLocaleDateString('en-GB'),
          LAST_ORD_NO: '',
          SERIES: '',
          PARTY_ORD_NO: '',
          SEASON: '',
          ORD_REF_DT: '',
          QUOTE_NO: '',
          Broker: '',
          BROKER_KEY: '',
          SALESPERSON_1: '',
          SALEPERSON1_KEY: '',
          SALESPERSON_2: '',
          SALEPERSON2_KEY: '',
          MERCHANDISER_NAME: '',
          MERCHANDISER_ID: '',
          REMARK_STATUS: '',
          GST_APPL: 'N',
          GST_TYPE: 'STATE',
          DLV_DT: '',
          ORG_DLV_DT: '',
          MAIN_DETAILS: 'G',
          RACK_MIN: '0',
          REGISTERED_DEALER: '0',
          SHORT_CLOSE: '0',
          READY_SI: '0',
          PLANNING: '0'
        });
        
        setNewItemData({
          barcode: '',
          product: '',
          style: '',
          type: '',
          shade: '',
          mrp: '',
          rate: '',
          qty: '',
          discount: '',
          sets: '',
          convFact: '1',
          remark: '',
          varPer: '0',
          stdQty: '',
          setNo: '',
          percent: '0',
          rQty: '',
          divDt: ''
        });
        
        setStyleCodeInput('');
        setCurrentStyleData(null);
        setSizeDetailsData([]);
        setAvailableSizes([]);
        setAvailableShades([]);
        setSelectedShades([]);
        setFillByRatioMode(true);
        setFillByShadeMode(true);
        setRatioData({
          totalQty: '',
          ratios: {}
        });
        if (isMobile) setViewMode('scan');
        
        await generateOrderNumber();
        
      } else {
        showSnackbar('Error submitting order: ' + (response.data.RESPONSEMESSAGE || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      showSnackbar('Error submitting order. Please try again.', 'error');
    } finally {
      setIsLoadingData(false);
      setShowOrderModal(false);
    }
  };

  // Cleanup effects
  useEffect(() => {
    return () => {
      if (styleCodeTimeoutRef.current) {
        clearTimeout(styleCodeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showScanner && isClient) {
      const timer = setTimeout(() => {
        initScanner();
      }, 500);
      
      return () => {
        clearTimeout(timer);
        if (qrCodeScannerRef.current) {
          qrCodeScannerRef.current.clear().catch(err => {
            console.error("Cleanup error", err);
          });
          qrCodeScannerRef.current = null;
        }
      };
    }
  }, [showScanner, isClient]);

  if (!isClient) {
    return (
      <Box sx={{ 
        p: { xs: 1, sm: 2 }, 
        maxWidth: '100%', 
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // ==================== MOBILE VIEW ====================
  const renderMobileView = () => (
    <Box sx={{ 
      p: 0,
      maxWidth: '100%', 
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Mobile App Bar */}
      <AppBar position="sticky" sx={{ 
        backgroundColor: '#1976d2',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <Toolbar sx={{ 
          minHeight: '56px',
          px: 2
        }}>
         
          
          <Typography variant="h6" sx={{ 
            flexGrow: 1,
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            📦 Barcode Scan
          </Typography>
          
          <Badge badgeContent={tableData.length} color="error">
            <IconButton color="inherit" onClick={handleCartIconClick}>
              <CartIcon />
            </IconButton>
          </Badge>
          
          <IconButton color="inherit" onClick={handleTable} sx={{ ml: 1 }}>
            <TbListSearch style={{ fontSize: '24px' }} />
          </IconButton>

           <IconButton color="inherit" onClick={handleBackButton} sx={{ ml: 0 }}>
  <IoArrowBackCircleOutline style={{ fontSize: '24px' }} />
</IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Tabs */}
      <Paper sx={{ 
        position: 'sticky', 
        top: 56, 
        zIndex: 1000, 
        borderRadius: 0,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            minHeight: '48px',
            '& .MuiTab-root': {
              minHeight: '48px',
              fontSize: '13px',
              fontWeight: '500'
            }
          }}
        >
           <Tab icon={<DescriptionIcon />} label="Order" />
          <Tab icon={<QrCodeIcon />} label="Scan" />
         
          <Tab icon={<InventoryIcon />} label="Items" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </Tabs>
      </Paper>

      <Box sx={{ p: 2 }}>
        {activeTab === 1 && (
          <Box>
            {/* Scan Mode Selector */}
            <Card sx={{ 
              mb: 2, 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ 
                  mb: 1.5, 
                  fontWeight: '600',
                  color: '#1976d2'
                }}>
                  Select Scan Mode
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant={scanMode === 'barcode' ? 'contained' : 'outlined'}
                      onClick={() => {
                        setScanMode('barcode');
                        setUseStyleCodeMode(false);
                      }}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: scanMode === 'barcode' ? '#1976d2' : 'transparent',
                        color: scanMode === 'barcode' ? 'white' : '#1976d2',
                        borderColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: scanMode === 'barcode' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <QrCodeIcon sx={{ fontSize: '24px', mb: 0.5 }} />
                        <Typography variant="caption">Barcode</Typography>
                      </Box>
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant={scanMode === 'style' ? 'contained' : 'outlined'}
                      onClick={() => {
                        setScanMode('style');
                        setUseStyleCodeMode(true);
                      }}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: scanMode === 'style' ? '#1976d2' : 'transparent',
                        color: scanMode === 'style' ? 'white' : '#1976d2',
                        borderColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: scanMode === 'style' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <SearchIcon sx={{ fontSize: '24px', mb: 0.5 }} />
                        <Typography variant="caption">Style Code</Typography>
                      </Box>
                    </Button>
                  </Grid>
                 
                </Grid>
              </CardContent>
            </Card>

            {/* Scan Input Section */}
            <Card sx={{ 
              mb: 2,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ p: 2 }}>
                {scanMode === 'barcode' && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ 
                      mb: 1.5, 
                      fontWeight: '600',
                      color: '#1976d2'
                    }}>
                      Scan Barcode
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        label="Enter Barcode"
                        variant="outlined"
                        fullWidth
                        value={newItemData.barcode}
                        onChange={(e) => handleNewItemChange('barcode', e.target.value)}
                        onKeyPress={handleBarcodeKeyPress}
                        placeholder="Type barcode and press Enter"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '16px',
                            height: '48px'
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton 
                                onClick={handleManualBarcodeSubmit}
                                disabled={!newItemData.barcode || isLoadingBarcode}
                              >
                                {isLoadingBarcode ? <CircularProgress size={20} /> : <SearchIcon />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CameraIcon />}
                      onClick={startScanner}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: '#1976d2',
                        fontSize: '16px',
                        fontWeight: '500',
                        '&:hover': {
                          backgroundColor: '#1565c0'
                        }
                      }}
                    >
                      Open Scanner
                    </Button>
                  </Box>
                )}

                {scanMode === 'style' && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ 
                      mb: 1.5, 
                      fontWeight: '600',
                      color: '#1976d2'
                    }}>
                      Enter Style Code
                    </Typography>
                    
                    <TextField
                      label="Style Code"
                      variant="outlined"
                      fullWidth
                      value={styleCodeInput}
                      onChange={handleStyleCodeInputChange}
                      onKeyPress={handleStyleCodeKeyPress}
                      placeholder="Type style code"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: '16px',
                          height: '48px'
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => fetchStyleDataByCode(styleCodeInput.trim())}
                              disabled={!styleCodeInput || isLoadingStyleCode}
                            >
                              {isLoadingStyleCode ? <CircularProgress size={20} /> : <SearchIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                     <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CameraIcon />}
                      onClick={startScanner}
                      sx={{
                        py: 1.5,
                        mt: 2,
                        borderRadius: 2,
                        backgroundColor: '#1976d2',
                        fontSize: '16px',
                        fontWeight: '500',
                        '&:hover': {
                          backgroundColor: '#1565c0'
                        }
                      }}
                    >
                      Open Scanner
                    </Button>
                  </Box>
                )}



                {scannerError && (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {scannerError}
                  </Alert>
                )}

                {(isLoadingBarcode || isLoadingStyleCode) && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mt: 2,
                    py: 2
                  }}>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Fetching product details...
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

           
          </Box>
        )}

        {activeTab === 0 && renderOrderTab()}
        {activeTab === 2 && renderItemsTab()}
        {activeTab === 3 && renderSettingsTab()}
      </Box>

      {/* Floating Action Button for Quick Scan */}
      <Fab
        color="primary"
        aria-label="scan"
        onClick={startScanner}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0'
          }
        }}
      >
        <CameraIcon />
      </Fab>

      {/* Bottom Navigation */}
      <Paper sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid #e0e0e0'
      }}>
        <BottomNavigation
          showLabels
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          sx={{
            height: '64px',
            '& .MuiBottomNavigationAction-root': {
              minWidth: '60px',
              padding: '6px 0',
              '&.Mui-selected': {
                color: '#1976d2'
              }
            }
          }}
        >
          <BottomNavigationAction label="Scan" icon={<QrCodeIcon />} />
          <BottomNavigationAction label="Order" icon={<ReceiptIcon />} />
          <BottomNavigationAction label="Items" icon={<InventoryIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );

  // ==================== DESKTOP VIEW ====================
  const renderDesktopView = () => (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      maxWidth: '100%', 
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Desktop Header with Show/Hide Order Fields */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        backgroundColor: 'white',
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              color: '#1976d2'
            }}
          >
            📦 Barcode Scanner
          </Typography>
          
          {/* Desktop Show/Hide Order Fields Checkbox */}
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAdvancedFields}
                  onChange={(e) => setShowAdvancedFields(e.target.checked)}
                  size="small"
                  sx={{
                    color: '#1976d2',
                    '&.Mui-checked': {
                      color: '#1976d2',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                  {showAdvancedFields ? 'Hide Order Fields' : 'Show Order Fields'}
                </Typography>
              }
            />
          </FormGroup>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleTable} sx={{ color: '#1976d2' }}>
            <TbListSearch style={{ width: '24px', height: '24px' }} />
          </IconButton>
          
          <Badge badgeContent={tableData.length} color="error">
            <IconButton onClick={handleCartIconClick} sx={{ color: '#1976d2' }}>
              <CartIcon />
            </IconButton>
          </Badge>
        </Box>
      </Box>

      {/* Desktop Layout Grid */}
      <Grid container spacing={2}>
        {/* Left Column - Scanning & Product Details */}
        <Grid item xs={12} md={6}>
          {/* Barcode Scanner Section */}
          <Card elevation={2} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ 
                mb: 1, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Typography variant="h6" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontSize: '1.1rem'
                }}>
                  <QrCodeIcon /> Product Scanning
                </Typography>
                
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={useStyleCodeMode}
                        onChange={(e) => setUseStyleCodeMode(e.target.checked)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>
                        Use Style Code
                      </Typography>
                    }
                  />
                </FormGroup>
              </Box>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Box sx={{ flex: 1, width: '100%' }}>
                  {useStyleCodeMode ? (
                    <TextField
                      label="Type Style Code"
                      variant="filled"
                      fullWidth
                      value={styleCodeInput}
                      onChange={handleStyleCodeInputChange}
                      onKeyPress={handleStyleCodeKeyPress}
                      placeholder="Type style code and press Enter"
                      sx={textInputSxtop}
                      InputProps={{
                        endAdornment: (
                          <IconButton 
                            onClick={() => fetchStyleDataByCode(styleCodeInput.trim())}
                            disabled={!styleCodeInput || isLoadingStyleCode}
                            sx={{ mr: -1 }}
                          >
                            {isLoadingStyleCode ? <CircularProgress size={20} /> : <SearchIcon />}
                          </IconButton>
                        )
                      }}
                    />
                  ) : (
                    <TextField
                      label="Enter Barcode Number"
                      variant="filled"
                      fullWidth
                      value={newItemData.barcode}
                      onChange={(e) => handleNewItemChange('barcode', e.target.value)}
                      onKeyPress={handleBarcodeKeyPress}
                      placeholder="Type barcode and press Enter"
                      sx={textInputSxtop}
                      InputProps={{
                        endAdornment: (
                          <IconButton 
                            onClick={handleManualBarcodeSubmit}
                            disabled={!newItemData.barcode || isLoadingBarcode}
                            sx={{ mr: -1 }}
                          >
                            {isLoadingBarcode ? <CircularProgress size={20} /> : <SearchIcon />}
                          </IconButton>
                        )
                      }}
                    />
                  )}
                </Box>
                
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'block' }
                }}>
                 
                </Typography>
                
                {!useStyleCodeMode && (
                  <Button
                    variant="contained"
                    startIcon={<CameraIcon />}
                    onClick={startScanner}
                    sx={{ 
                      backgroundColor: '#1976d2',
                      color: 'white',
                      minWidth: { xs: '100%', sm: 150 },
                      height: 40,
                      '&:hover': {
                        backgroundColor: '#1565c0'
                      }
                    }}
                  >
                    Scan Barcode
                  </Button>
                )}
              </Stack>

              {scannerError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {scannerError}
                </Alert>
              )}

              {(isLoadingBarcode || isLoadingStyleCode) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">
                    {useStyleCodeMode ? 'Fetching product details by style code...' : 'Fetching product details...'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          {(newItemData.product || isLoadingBarcode || isLoadingStyleCode) && (
            <Card elevation={2} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>
                  Product Details {(isLoadingBarcode || isLoadingStyleCode) && '(Loading...)'}
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Barcode"
                      variant="filled"
                      fullWidth
                      value={newItemData.barcode}
                      disabled
                      sx={textInputSx}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Product"
                      variant="filled"
                      fullWidth
                      value={newItemData.product}
                      disabled
                      sx={textInputSx}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Style"
                      variant="filled"
                      fullWidth
                      value={newItemData.style}
                      disabled
                      sx={textInputSx}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Type"
                      variant="filled"
                      fullWidth
                      value={newItemData.type}
                      disabled
                      sx={textInputSx}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Shade"
                      variant="filled"
                      fullWidth
                      value={newItemData.shade}
                      disabled
                      sx={textInputSx}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="MRP"
                      variant="filled"
                      fullWidth
                      value={newItemData.mrp}
                      disabled
                      sx={textInputSx}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Rate"
                      variant="filled"
                      fullWidth
                      value={newItemData.rate}
                      disabled
                      sx={textInputSx}
                      size="small"
                    />
                  </Grid>
  
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Remark"
                      variant="filled"
                      fullWidth
                      value={newItemData.remark}
                      onChange={(e) => handleNewItemChange('remark', e.target.value)}
                      sx={textInputSx}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Order Details */}
        <Grid item xs={12} md={6}>
          {/* Order Form Fields (Collapsible) */}
          {showAdvancedFields && (
            <Card elevation={2} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1,mt: 5, fontSize: '1.1rem' }}>
                  📋 Order Details
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={12} container spacing={1}>
                    <Grid item xs={6} md={3}>
                      <TextField
                        label="Series"
                        variant="filled"
                        fullWidth
                        value={formData.SERIES}
                        onChange={(e) => handleFormChange('SERIES', e.target.value)}
                        sx={textInputSx}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <TextField
                        label="Last Order No"
                        variant="filled"
                        fullWidth
                        value={formData.LAST_ORD_NO}
                        onChange={(e) => handleFormChange('LAST_ORD_NO', e.target.value)}
                        sx={textInputSx}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <TextField
                        label="Order No"
                        variant="filled"
                        fullWidth
                        value={formData.ORDER_NO}
                        onChange={(e) => handleFormChange('ORDER_NO', e.target.value)}
                        sx={textInputSx}
                        size="small"
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Order Date"
                          value={formData.ORDER_DATE ? parse(formData.ORDER_DATE, 'dd/MM/yyyy', new Date()) : null}
                          onChange={(date) => handleFormChange('ORDER_DATE', date ? format(date, 'dd/MM/yyyy') : '')}
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: "filled",
                              sx: datePickerSx,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <AutoVibe
                        id="Party"
                        getOptionLabel={(option) => option || ''}
                        options={partyOptions}
                        label="Party *"
                        name="Party"
                        value={formData.Party}
                        onChange={(e, value) => handleFormChange('Party', value)}
                        sx={DropInputSx}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <AutoVibe
                        id="Branch"
                        getOptionLabel={(option) => option || ''}
                        options={branchOptions}
                        label="Branch"
                        name="Branch"
                        value={formData.Branch}
                        onChange={(e, value) => handleFormChange('Branch', value)}
                        sx={DropInputSx}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <AutoVibe
                        id="SHIPPING_PARTY"
                        getOptionLabel={(option) => option || ''}
                        options={shippingPartyOptions}
                        label="Shipping Party"
                        name="SHIPPING_PARTY"
                        value={formData.SHIPPING_PARTY}
                        onChange={(e, value) => handleFormChange('SHIPPING_PARTY', value)}
                        sx={DropInputSx}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <AutoVibe
                        id="SHIPPING_PLACE"
                        getOptionLabel={(option) => option || ''}
                        options={shippingPlaceOptions}
                        label="Shipping Place"
                        name="SHIPPING_PLACE"
                        value={formData.SHIPPING_PLACE}
                        onChange={(e, value) => handleFormChange('SHIPPING_PLACE', value)}
                        sx={DropInputSx}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <AutoVibe
                        id="Broker"
                        getOptionLabel={(option) => option || ''}
                        options={brokerOptions}
                        label="Broker"
                        name="Broker"
                        value={formData.Broker}
                        onChange={(e, value) => handleFormChange('Broker', value)}
                        sx={DropInputSx}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <AutoVibe
                        id="SALESPERSON_1"
                        getOptionLabel={(option) => option || ''}
                        options={salesperson1Options}
                        label="Salesperson 1"
                        name="SALESPERSON_1"
                        value={formData.SALESPERSON_1}
                        onChange={(e, value) => handleFormChange('SALESPERSON_1', value)}
                        sx={DropInputSx}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <AutoVibe
                        id="SALESPERSON_2"
                        getOptionLabel={(option) => option || ''}
                        options={salesperson2Options}
                        label="Salesperson 2"
                        name="SALESPERSON_2"
                        value={formData.SALESPERSON_2}
                        onChange={(e, value) => handleFormChange('SALESPERSON_2', value)}
                        sx={DropInputSx}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <AutoVibe
                        id="MERCHANDISER_NAME"
                        getOptionLabel={(option) => option || ''}
                        options={merchandiserOptions}
                        label="Merchandiser"
                        name="MERCHANDISER_NAME"
                        value={formData.MERCHANDISER_NAME}
                        onChange={(e, value) => handleFormChange('MERCHANDISER_NAME', value)}
                        sx={DropInputSx}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <AutoVibe
                        id="SEASON"
                        getOptionLabel={(option) => option || ''}
                        options={seasonOptions}
                        label="Season"
                        name="SEASON"
                        value={formData.SEASON}
                        onChange={(e, value) => handleFormChange('SEASON', value)}
                        sx={DropInputSx}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Fill by Ratio Section */}
          {availableSizes.length > 0 && (
            <Card elevation={0.5} sx={{ mb: 1 }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 0.1,
                  flexWrap: 'wrap'
                }}>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                    Fill By Ratio
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fillByRatioMode}
                            onChange={(e) => setFillByRatioMode(e.target.checked)}
                            size="small"
                            defaultChecked
                          />
                        }
                        label="Ratio Fill"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={fillByShadeMode}
                            onChange={(e) => setFillByShadeMode(e.target.checked)}
                            size="small"
                            defaultChecked
                          />
                        }
                        label="By Shade"
                      />
                    </FormGroup>
                  </Box>
                </Box>
                
                {fillByRatioMode && (
                  <Box>
                    {/* Shade Selection for Fill by Shade Mode */}
                    {fillByShadeMode && availableShades.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'stretch', sm: 'center' },
                          gap: 1,
                          mb: 1
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 1,
                            alignItems: 'center'
                          }}>
                            <Button
                              variant={shadeViewMode === 'all' ? 'contained' : 'outlined'}
                              onClick={handleAllShadesClick}
                              size="small"
                              sx={{ 
                                minWidth: '60px',
                                backgroundColor: shadeViewMode === 'all' ? '#1976d2' : 'transparent',
                                color: shadeViewMode === 'all' ? 'white' : '#1976d2',
                                borderColor: '#1976d2',
                                '&:hover': {
                                  backgroundColor: shadeViewMode === 'all' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
                                }
                              }}
                            >
                              All
                            </Button>
                            <Button
                              variant={shadeViewMode === 'allocated' ? 'contained' : 'outlined'}
                              onClick={handleAllocatedShadesClick}
                              size="small"
                              sx={{ 
                                minWidth: '80px',
                                backgroundColor: shadeViewMode === 'allocated' ? '#1976d2' : 'transparent',
                                color: shadeViewMode === 'allocated' ? 'white' : '#1976d2',
                                borderColor: '#1976d2',
                                '&:hover': {
                                  backgroundColor: shadeViewMode === 'allocated' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
                                }
                              }}
                            >
                              Allocated
                            </Button>
                          </Box>
                          
                          <FormControl sx={{ 
                            flex: 1,
                            minWidth: { xs: '100%', sm: '200px' }
                          }}>
                            <InputLabel id="shade-select-label">Select Shades</InputLabel>
                            <Select
                              labelId="shade-select-label"
                              id="shade-select"
                              multiple
                              value={selectedShades}
                              onChange={handleShadeSelectionChange}
                              input={<OutlinedInput label="Select Shades" />}
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" />
                                  ))}
                                </Box>
                              )}
                              size="small"
                            >
                              {availableShades.map((shade) => (
                                <MenuItem key={shade.FGSHADE_NAME} value={shade.FGSHADE_NAME}>
                                  {shade.FGSHADE_NAME}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    )}
                    
                    {/* Total Quantity Input */}
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        label="Total Quantity"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={ratioData.totalQty}
                        onChange={(e) => handleTotalQtyChange(e.target.value)}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: 40,
                          },
                        }}
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                      />
                    </Box>
                    
                    {/* Horizontal Ratio Table */}
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: '600' }}>
                      Enter Ratios for Each Size:
                    </Typography>

                    <Box sx={{ 
                      overflowX: 'auto',
                      backgroundColor: '#f8f9fa',
                      borderRadius: 1,
                      p: 1,
                      mb: 0.7
                    }}>
                      <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        minWidth: `${availableSizes.length * 50}px`
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: '#e9ecef' }}>
                            {availableSizes.map((size) => (
                              <th key={`th-${size.STYSIZE_ID}`} style={{ 
                                padding: '10px',
                                border: '1px solid #dee2e6', 
                                textAlign: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                                minWidth: '40px'
                              }}>
                                {size.STYSIZE_NAME}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {availableSizes.map((size, index) => (
                              <td key={`td-${size.STYSIZE_ID}`} style={{ 
                                padding: '2px', 
                                border: '1px solid #dee2e6',
                                textAlign: 'center',
                                backgroundColor: '#fff'
                              }}>
                                <TextField
                                  type="number"
                                  value={ratioData.ratios[size.STYSIZE_NAME] || ''}
                                  onChange={(e) => handleRatioChange(size.STYSIZE_NAME, e.target.value)}
                                  size="small"
                                  sx={{
                                    width: '50px',
                                    '& .MuiInputBase-root': {
                                      height: '26px',
                                      fontSize: '14px'
                                    },
                                    '& input': {
                                      padding: '8px',
                                      textAlign: 'center'
                                    }
                                  }}
                                  inputProps={{ 
                                    min: 0, 
                                    step: 0.1,
                                    style: { textAlign: 'center' }
                                  }}
                                />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                    
                    {/* Fill Qty Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        onClick={fillQuantitiesByRatio}
                        disabled={!ratioData.totalQty || parseFloat(ratioData.totalQty) <= 0}
                        sx={{ 
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          '&:hover': { backgroundColor: '#45a049' },
                          minWidth: '80px'
                        }}
                      >
                        Fill Qty
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Size Details Table */}
          {sizeDetailsData.length > 0 && (
            <Card elevation={1} sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>
                  Size Details (Qty) :<strong style={{ color: '#1976d2' }}>{calculateTotalQty()}</strong>
                </Typography>
                
                <Box sx={{ 
                  overflowX: 'auto',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 1,
                  p: 1
                }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    minWidth: '500px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#e9ecef' }}>
                        <th style={{ 
                          padding: '2px 8px',
                          border: '1px solid #dee2e6', 
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>Size</th>
                        <th style={{ 
                          padding: '2px 8px', 
                          border: '1px solid #dee2e6', 
                          textAlign: 'center',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>Quantity</th>
                         <th style={{ 
        padding: '2px 8px', 
        border: '1px solid #dee2e6', 
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600'
      }}>Ready Qty</th>
      <th style={{ 
        padding: '2px 8px', 
        border: '1px solid #dee2e6', 
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600'
      }}>Process</th>
      <th style={{ 
        padding: '2px 8px', 
        border: '1px solid #dee2e6', 
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600'
      }}>Order</th>
      <th style={{ 
        padding: '2px 8px', 
        border: '1px solid #dee2e6', 
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600'
      }}>Bal Qty</th>
                        <th style={{ 
                          padding: '2px 8px',
                          border: '1px solid #dee2e6', 
                          textAlign: 'right',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>MRP</th>
                        <th style={{ 
                          padding: '2px 8px',
                          border: '1px solid #dee2e6', 
                          textAlign: 'right',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>Rate</th>
                        <th style={{ 
                          padding: '2px 8px',
                          border: '1px solid #dee2e6', 
                          textAlign: 'right',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
  {sizeDetailsData.map((size, index) => {
    const readyQty = parseFloat(size.FG_QTY) || 0;
    const orderQty = parseFloat(size.PORD_QTY) || 0;
    const issueQty = parseFloat(size.ISU_QTY) || 0;
    const processQty = orderQty + issueQty;
    const balQty = parseFloat(size.BAL_QTY) || 0;
    
    return (
      <tr key={index} style={{ 
        backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
        borderBottom: '1px solid #dee2e6'
      }}>
        <td style={{
          padding: '4px 8px',
          border: '1px solid #dee2e6',
          fontSize: '13px',
          lineHeight: '1.2'
        }}>{size.STYSIZE_NAME}</td>
        
        <td style={{ 
          padding: '5px', 
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <TextField
            type="number"
            value={size.QTY}
            onChange={(e) => handleSizeQtyChange(index, e.target.value)}
            size="small"
            sx={{
              width: '60px',
              '& .MuiInputBase-root': {
                height: '20px',
                fontSize: '13px'
              },
              '& input': {
                padding: '1px',
                textAlign: 'center'
              }
            }}
            inputProps={{ min: 0 }}
          />
        </td>
        
        <td style={{ 
          padding: '4px 8px',
          border: '1px solid #dee2e6',
          textAlign: 'center',
          fontSize: '13px'
        }}>
          {readyQty.toFixed(3)}
        </td>
        
        <td style={{ 
          padding: '4px 8px',
          border: '1px solid #dee2e6',
          textAlign: 'center',
          fontSize: '13px'
        }}>
          {processQty.toFixed(3)}
        </td>
        
        <td style={{ 
          padding: '4px 8px',
          border: '1px solid #dee2e6',
          textAlign: 'center',
          fontSize: '13px'
        }}>
          {orderQty.toFixed(3)}
        </td>
        
        <td style={{ 
          padding: '4px 8px',
          border: '1px solid #dee2e6',
          textAlign: 'center',
          fontSize: '13px'
        }}>
          {balQty.toFixed(3)}
        </td>
        
        <td style={{ 
          padding: '10px', 
          border: '1px solid #dee2e6',
          textAlign: 'right',
          fontSize: '14px'
        }}>{size.MRP || 0}</td>
        
        <td style={{ 
          padding: '10px', 
          border: '1px solid #dee2e6',
          textAlign: 'right',
          fontSize: '14px'
        }}>{size.WSP  || 0}</td>
        
        <td style={{ 
          padding: '10px', 
          border: '1px solid #dee2e6',
          textAlign: 'right',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ₹{(size.QTY || 0) * (size.WSP  || 0)}
        </td>
      </tr>
    );
  })}
</tbody>
                  </table>
                </Box>
                
                <Box sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: '500' }}>
                      Total Quantity: <strong style={{ color: '#1976d2' }}>{calculateTotalQty()}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Amount: ₹{calculateAmount().amount.toFixed(2)}
                    </Typography>
                    {fillByShadeMode && selectedShades.length > 1 && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Selected Shades: {selectedShades.length} (Total will be divided equally)
                      </Typography>
                    )}
                  </Box>
                  
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleConfirmItem}
                    disabled={calculateTotalQty() === 0}
                    sx={{ 
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      '&:hover': { backgroundColor: '#45a049' },
                      minWidth: '140px'
                    }}
                  >
                    Add to Order
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Submit Order Button */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmitOrder}
              disabled={isLoadingData || tableData.length === 0}
              sx={{ 
                backgroundColor: '#2196F3',
                color: 'white',
                py: 1.5,
                fontSize: '16px',
                fontWeight: '500',
                '&:hover': { backgroundColor: '#1976d2' }
              }}
            >
              {isLoadingData ? <CircularProgress size={24} /> : 'Submit Order'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // ==================== COMMON TABS ====================
  const renderOrderTab = () => (
    <Box>
      {/* Order Form */}
      <Card sx={{ 
        mb: 2,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: '600',
              color: '#1976d2'
            }}>
              Order Details
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAdvancedFields}
                  onChange={(e) => setShowAdvancedFields(e.target.checked)}
                  size="small"
                  sx={{
                    color: '#1976d2',
                    '&.Mui-checked': {
                      color: '#1976d2',
                    },
                  }}
                />
              }
              label={
                <Typography variant="caption" sx={{ fontSize: '12px' }}>
                  {showAdvancedFields ? 'Hide Advanced' : 'Show Advanced'}
                </Typography>
              }
            />
          </Box>

          {showAdvancedFields && (
            <Box>
             <Grid container spacing={1} sx={{ mt: 0.5 }}>
  <Grid size xs={12} sm={6}>
    <AutoVibe
      id="Party"
      getOptionLabel={(option) => option || ''}
      options={partyOptions}
      label="Party *"
      name="Party"
      value={formData.Party}
      onChange={(e, value) => handleFormChange('Party', value)}
      sx={{
        ...DropInputSx,
        '& .MuiInputBase-root': {
          height: '44px',
          width: '150px',
        },
      }}
    />
  </Grid>
  <Grid size xs={12} sm={6}>
    <AutoVibe
      id="Branch"
      getOptionLabel={(option) => option || ''}
      options={branchOptions}
      label="Branch"
      name="Branch"
      value={formData.Branch}
      onChange={(e, value) => handleFormChange('Branch', value)}
      sx={{
        ...DropInputSx,
        '& .MuiInputBase-root': {
          height: '44px',
          width: '138px',
        },
      }}
    />
  </Grid>
</Grid>

               <Grid container spacing={1} sx={{ mt: 0.5 }}>
                <Grid item xs={6}>
                  <AutoVibe
                    id="SHIPPING_PARTY"
                    getOptionLabel={(option) => option || ''}
                    options={shippingPartyOptions}
                    label="Shipping Party"
                    name="SHIPPING_PARTY"
                    value={formData.SHIPPING_PARTY}
                    onChange={(e, value) => handleFormChange('SHIPPING_PARTY', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: '44px',
                        width: '150px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AutoVibe
                    id="SHIPPING_PLACE"
                    getOptionLabel={(option) => option || ''}
                    options={shippingPlaceOptions}
                    label="Shipping Place"
                    name="SHIPPING_PLACE"
                    value={formData.SHIPPING_PLACE}
                    onChange={(e, value) => handleFormChange('SHIPPING_PLACE', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: '44px',
                        width: '138px',
                      },
                    }}
                  />
                </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                <Grid item xs={6}>
                  <AutoVibe
                    id="Broker"
                    getOptionLabel={(option) => option || ''}
                    options={brokerOptions}
                    label="Broker"
                    name="Broker"
                    value={formData.Broker}
                    onChange={(e, value) => handleFormChange('Broker', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: '44px',
                        width: '150px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AutoVibe
                    id="SEASON"
                    getOptionLabel={(option) => option || ''}
                    options={seasonOptions}
                    label="Season"
                    name="SEASON"
                    value={formData.SEASON}
                    onChange={(e, value) => handleFormChange('SEASON', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: '44px',
                        width: '138px',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

<Box sx={{ mt: 2 }}>
  <Typography variant="subtitle2" sx={{ 
    mb: 1, 
    fontWeight: '600',
    color: '#1976d2'
  }}>
    Order Summary
  </Typography>
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField
        label="Order No"
        variant="outlined"
        fullWidth
        value={formData.ORDER_NO}
        disabled
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            height: '44px',
          }
        }}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Order Date"
          value={formData.ORDER_DATE ? parse(formData.ORDER_DATE, 'dd/MM/yyyy', new Date()) : null}
          onChange={(date) => handleFormChange('ORDER_DATE', date ? format(date, 'dd/MM/yyyy') : '')}
          format="dd/MM/yyyy"
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
              sx: {
                "& .MuiInputBase-root": {
                  height: "44px",
                  borderRadius: 2,
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Grid>
  </Grid>
</Box>
        </CardContent>
      </Card>

      {/* Order Actions */}
      {/* <Card sx={{ 
        mb: 2,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ 
            mb: 1.5, 
            fontWeight: '600',
            color: '#1976d2'
          }}>
            Order Actions
          </Typography>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmitOrder}
                disabled={isLoadingData || tableData.length === 0}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#4caf50',
                  fontSize: '16px',
                  fontWeight: '500',
                  '&:hover': {
                    backgroundColor: '#388e3c'
                  }
                }}
              >
                {isLoadingData ? 'Submitting...' : 'Submit Order'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}
    </Box>
  );

  const renderItemsTab = () => (
    <Box>
      {/* Product Details */}
      {(newItemData.product || isLoadingBarcode || isLoadingStyleCode) && (
        <Card sx={{ 
          mb: 2,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ 
              mb: 1.5, 
              fontWeight: '600',
              color: '#1976d2'
            }}>
              Product Details
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 0.5, 
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  width: '150px',
                  height: '50px'
                }}>
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    color: '#666',
                    mb: 0.5
                  }}>
                    Product
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: '500' }}>
                    {newItemData.product}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 0.5, 
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  width: '130px',
                  height: '50px'
                }}>
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    color: '#666',
                    mb: 0.5
                  }}>
                    Style
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: '500' }}>
                    {newItemData.style}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 0.5, 
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                   width: '150px',
                  height: '50px'
                }}>
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    color: '#666',
                    mb: 0.5
                  }}>
                    Shade
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: '500' }}>
                    {newItemData.shade}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  p: 0.5, 
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                   width: '130px',
                  height: '50px'
                }}>
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    color: '#666',
                    mb: 0.5
                  }}>
                    MRP
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: '500' }}>
                    ₹{newItemData.mrp}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {/* Size Details */}
            {sizeDetailsData.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ 
                  mb: 1.5, 
                  fontWeight: '600',
                  color: '#1976d2'
                }}>
                  Size Details
                </Typography>
                
                <Box sx={{ 
                  maxHeight: '300px',
                  overflowY: 'auto',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  p: 1
                }}>
                  {sizeDetailsData.map((size, index) => {
                    const readyQty = parseFloat(size.FG_QTY) || 0;
                    const orderQty = parseFloat(size.PORD_QTY) || 0;
                    const issueQty = parseFloat(size.ISU_QTY) || 0;
                    const processQty = orderQty + issueQty;
                    const balQty = parseFloat(size.BAL_QTY) || 0;
                    
                    return (
                      <Box 
                        key={index}
                        sx={{ 
                          mb: 1.5,
                          p: 1.5,
                          backgroundColor: 'white',
                          borderRadius: 2,
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: '600' }}>
                            {size.STYSIZE_NAME}
                          </Typography>
                          <TextField
                            type="number"
                            value={size.QTY}
                            onChange={(e) => handleSizeQtyChange(index, e.target.value)}
                            size="small"
                            sx={{
                              width: '80px',
                              '& .MuiInputBase-root': {
                                height: '36px',
                                borderRadius: 1
                              }
                            }}
                            inputProps={{ min: 0 }}
                          />
                        </Box>
                        
                        <Grid container spacing={1}>
                          <Grid item xs={3}>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              Ready
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: '500' }}>
                              {readyQty.toFixed(0)}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              Process
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: '500' }}>
                              {processQty.toFixed(0)}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              Balance
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: '500' }}>
                              {balQty.toFixed(0)}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              Amount
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: '500', color: '#4caf50' }}>
                              ₹{((size.QTY || 0) * (size.WSP || 0)).toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
            
            {/* Total Summary */}
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              backgroundColor: '#e8f5e9',
              borderRadius: 2,
              border: '1px solid #c8e6c9'
            }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total Quantity:
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#1976d2' }}>
                    {calculateTotalQty()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#4caf50' }}>
                    ₹{calculateAmount().amount.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleConfirmItem}
                disabled={calculateTotalQty() === 0}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#4caf50',
                  '&:hover': {
                    backgroundColor: '#388e3c'
                  }
                }}
              >
                Add to Order
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Ratio Settings */}
      {availableSizes.length > 0 && (
        <Card sx={{ 
          mb: 2,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: '600',
                color: '#1976d2'
              }}>
                Ratio Settings
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fillByRatioMode}
                      onChange={(e) => setFillByRatioMode(e.target.checked)}
                      size="small"
                      sx={{
                        color: '#1976d2',
                        '&.Mui-checked': {
                          color: '#1976d2',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                      Ratio Fill
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fillByShadeMode}
                      onChange={(e) => setFillByShadeMode(e.target.checked)}
                      size="small"
                      sx={{
                        color: '#1976d2',
                        '&.Mui-checked': {
                          color: '#1976d2',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                      By Shade
                    </Typography>
                  }
                />
              </FormGroup>
            </Box>

            {fillByRatioMode && (
              <Box>
                {/* Shade Selection */}
                {fillByShadeMode && availableShades.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1,
                      mb: 2
                    }}>
                      <Button
                        variant={shadeViewMode === 'all' ? 'contained' : 'outlined'}
                        onClick={handleAllShadesClick}
                        size="small"
                        sx={{ 
                          flex: 1,
                          backgroundColor: shadeViewMode === 'all' ? '#1976d2' : 'transparent',
                          color: shadeViewMode === 'all' ? 'white' : '#1976d2',
                          borderColor: '#1976d2',
                          '&:hover': {
                            backgroundColor: shadeViewMode === 'all' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
                          }
                        }}
                      >
                        All Shades
                      </Button>
                      <Button
                        variant={shadeViewMode === 'allocated' ? 'contained' : 'outlined'}
                        onClick={handleAllocatedShadesClick}
                        size="small"
                        sx={{ 
                          flex: 1,
                          backgroundColor: shadeViewMode === 'allocated' ? '#1976d2' : 'transparent',
                          color: shadeViewMode === 'allocated' ? 'white' : '#1976d2',
                          borderColor: '#1976d2',
                          '&:hover': {
                            backgroundColor: shadeViewMode === 'allocated' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
                          }
                        }}
                      >
                        Allocated
                      </Button>
                    </Box>
                    
                    <FormControl fullWidth>
                      <InputLabel id="shade-select-label">Select Shades</InputLabel>
                      <Select
                        labelId="shade-select-label"
                        id="shade-select"
                        multiple
                        value={selectedShades}
                        onChange={handleShadeSelectionChange}
                        input={<OutlinedInput label="Select Shades" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                        size="small"
                      >
                        {availableShades.map((shade) => (
                          <MenuItem key={shade.FGSHADE_NAME} value={shade.FGSHADE_NAME}>
                            {shade.FGSHADE_NAME}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
                
                {/* Total Quantity */}
                <TextField
                  label="Total Quantity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={ratioData.totalQty}
                  onChange={(e) => handleTotalQtyChange(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      height: '44px'
                    }
                  }}
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
                
                {/* Ratio Inputs */}
                <Typography variant="subtitle2" sx={{ 
                  mb: 1, 
                  fontWeight: '600',
                  color: '#1976d2'
                }}>
                  Ratios for Each Size:
                </Typography>
                
                <Box sx={{ 
                  display: 'flex',
                  overflowX: 'auto',
                  gap: 1,
                  pb: 1
                }}>
                  {availableSizes.map((size) => (
                    <Box key={size.STYSIZE_ID} sx={{ 
                      minWidth: '100px',
                      p: 1.5,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      textAlign: 'center'
                    }}>
                      <Typography variant="caption" sx={{ 
                        display: 'block', 
                        color: '#666',
                        mb: 1
                      }}>
                        {size.STYSIZE_NAME}
                      </Typography>
                      <TextField
                        type="number"
                        value={ratioData.ratios[size.STYSIZE_NAME] || ''}
                        onChange={(e) => handleRatioChange(size.STYSIZE_NAME, e.target.value)}
                        size="small"
                        sx={{
                          width: '70px',
                          '& .MuiInputBase-root': {
                            height: '36px',
                            borderRadius: 1
                          },
                          '& input': {
                            textAlign: 'center'
                          }
                        }}
                        inputProps={{ 
                          min: 0, 
                          step: 0.1
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={fillQuantitiesByRatio}
                  disabled={!ratioData.totalQty || parseFloat(ratioData.totalQty) <= 0}
                  sx={{
                    mt: 2,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#388e3c'
                    }
                  }}
                >
                  Fill Quantities
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderSettingsTab = () => (
    <Box>
      {/* Settings */}
      <Card sx={{ 
        mb: 2,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ 
            mb: 1.5, 
            fontWeight: '600',
            color: '#1976d2'
          }}>
            Order Settings
          </Typography>
          
          <List sx={{ width: '100%' }}>
            
            
            <ListItem>
              <ListItemIcon>
                <PrintIcon sx={{ color: '#1976d2' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Print Settings" 
                secondary="Configure printer and label settings"
              />
              <ChevronRightIcon sx={{ color: '#666' }} />
            </ListItem>
            
          </List>
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchInitialData}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                borderColor: '#1565c0',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    </Box>
  );

  // ==================== MAIN RENDER ====================
  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Render mobile or desktop view based on screen size */}
      {isMobile ? renderMobileView() : renderDesktopView()}

     

      {/* Order Items Modal */}
      <Modal
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        aria-labelledby="order-items-modal"
        aria-describedby="order-items-list"
      >
        <Fade in={showOrderModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <Box sx={{
              p: 2,
              backgroundColor: '#1976d2',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CartIcon /> Order Items ({tableData.length})
              </Typography>
              <IconButton onClick={() => setShowOrderModal(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Modal Content - Scrollable */}
            <Box sx={{ 
              p: 2,
              overflow: 'auto',
              flexGrow: 1
            }}>
              {tableData.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  color: 'text.secondary'
                }}>
                  <CartIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6">No items in order</Typography>
                  <Typography variant="body2">Scan and add products to your order</Typography>
                </Box>
              ) : (
                <>
                  {/* Order Items Table */}
                  <Box sx={{ 
                    overflowX: 'auto',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    mb: 2
                  }}>
                    <table style={{ 
                      width: '100%', 
                      borderCollapse: 'collapse',
                      minWidth: '800px'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#e9ecef' }}>
                          <th style={{ 
                            padding: '12px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Product</th>
                          <th style={{ 
                            padding: '12px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Style</th>
                          <th style={{ 
                            padding: '12px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Qty</th>
                          <th style={{ 
                            padding: '12px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'right',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Rate</th>
                          <th style={{ 
                            padding: '12px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'right',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Amount</th>
                          <th style={{ 
                            padding: '12px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((item, index) => (
                          <tr key={item.id} style={{ 
                            backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                            borderBottom: '1px solid #dee2e6'
                          }}>
                            <td style={{ 
                              padding: '12px',
                              border: '1px solid #dee2e6',
                              fontSize: '14px'
                            }}>{item.product}</td>
                            <td style={{ 
                              padding: '12px', 
                              border: '1px solid #dee2e6',
                              fontSize: '14px'
                            }}>{item.style} - {item.shade}</td>
                            <td style={{ 
                              padding: '12px', 
                              border: '1px solid #dee2e6',
                              textAlign: 'center',
                              fontSize: '14px'
                            }}>{item.qty}</td>
                            <td style={{ 
                              padding: '12px',
                              border: '1px solid #dee2e6',
                              textAlign: 'right',
                              fontSize: '14px'
                            }}>₹{item.rate}</td>
                            <td style={{ 
                              padding: '12px',
                              border: '1px solid #dee2e6',
                              textAlign: 'right',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}>₹{item.amount.toFixed(2)}</td>
                            <td style={{ 
                              padding: '12px', 
                              border: '1px solid #dee2e6',
                              textAlign: 'center'
                            }}>
                              <IconButton 
                                onClick={() => handleDeleteItem(item.id)}
                                size="small"
                                sx={{ color: '#f44336' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                  
                  {/* Order Summary */}
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#e8f5e9', 
                    borderRadius: 2 
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      📊 Order Summary
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Items:</Typography>
                        <Typography variant="h6" sx={{ color: '#1976d2' }}>{tableData.length}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Quantity:</Typography>
                        <Typography variant="h6" sx={{ color: '#1976d2' }}>
                          {tableData.reduce((sum, item) => sum + item.qty, 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Amount:</Typography>
                        <Typography variant="h6" sx={{ color: '#1976d2' }}>
                          ₹{tableData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleSubmitOrder}
                          disabled={isLoadingData}
                          sx={{ 
                            backgroundColor: '#4caf50',
                            '&:hover': { backgroundColor: '#388e3c' }
                          }}
                        >
                          {isLoadingData ? <CircularProgress size={24} /> : 'Submit Order'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Barcode Scanner Dialog */}
      {isClient && (
        <Dialog
          open={showScanner}
          onClose={stopScanner}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              maxWidth: { xs: '100%', sm: '80%', md: '600px' },
              height: { xs: '100vh', sm: '600px' },
              margin: { xs: 0, sm: 'auto' },
              borderRadius: { xs: 0, sm: 3 }
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: '#1976d2',
            color: 'white'
          }}>
            <Typography variant="h6">📷 Scan Barcode</Typography>
            <IconButton onClick={stopScanner} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="body2" sx={{ 
              mb: 2, 
              color: 'text.secondary',
              textAlign: 'center'
            }}>
              Point your camera at the barcode
            </Typography>
            
            <Box
              id="qr-reader"
              sx={{
                width: '100%',
                height: { xs: '70vh', sm: '400px' },
                border: '2px dashed #ccc',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#000'
              }}
            />
            
            <Typography variant="caption" sx={{ 
              mt: 2, 
              display: 'block', 
              color: 'text.secondary',
              textAlign: 'center'
            }}>
              The scanner will automatically detect barcodes
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 2,
            backgroundColor: '#f5f5f5'
          }}>
            <Button 
              onClick={stopScanner} 
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Typography variant="body2" sx={{ 
              flexGrow: 1, 
              textAlign: 'center', 
              color: 'text.secondary',
              fontSize: '12px'
            }}>
              Camera permission required • Works best in good light
            </Typography>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ScanBarcode;