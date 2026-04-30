// 'use client';
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { Tooltip } from '@mui/material';
// import {
//   Box,
//   Grid,
//   TextField,
//   Typography,
//   Button,
//   Stack,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   InputAdornment,
//   Divider,
//   Snackbar,
//   FormControlLabel,
//   Checkbox,
//   Alert, FormControl,
//   Select,
//   MenuItem,
//   InputLabel,
//   OutlinedInput,
//   Chip,
// } from '@mui/material';
// import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
// import axiosInstance from '../../../../lib/axios';
// import { getFormMode } from '../../../../lib/helpers';
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { format, parse } from "date-fns";
// import SearchIcon from "@mui/icons-material/Search";
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// const FORM_MODE = getFormMode();

// const Stepper3 = ({ formData,pickOrderItems , setFormData, isFormDisabled, mode, onSubmit,companyConfig, onCancel, onNext,onPrev, showSnackbar, showValidationErrors }) => {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedStyle, setSelectedStyle] = useState(null);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [sizeDetailsData, setSizeDetailsData] = useState([]);
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [isEditingSize, setIsEditingSize] = useState(false);
//   const [editingRowData, setEditingRowData] = useState(null);
//   const [hasRecords, setHasRecords] = useState(false);
  
//   // State for dropdown options
//   const [productOptions, setProductOptions] = useState([]);
//   const [styleOptions, setStyleOptions] = useState([]);
//   const [typeOptions, setTypeOptions] = useState([]);
//   const [shadeOptions, setShadeOptions] = useState([]);
//   const [lotNoOptions, setLotNoOptions] = useState([]);
//  const [itemsConfirmed, setItemsConfirmed] = useState(false);
//   const [availableShades, setAvailableShades] = useState([]);
// const [selectedShades, setSelectedShades] = useState([]);
// const [shadeViewMode, setShadeViewMode] = useState('allocated');
  
//   // State for storing mappings
//   const [productMapping, setProductMapping] = useState({});
//   const [styleMapping, setStyleMapping] = useState({});
//   const [typeMapping, setTypeMapping] = useState({});
//   const [shadeMapping, setShadeMapping] = useState({});
//   const [lotNoMapping, setLotNoMapping] = useState({});
  
//   // NEW: State for style code and barcode text input
//   const [styleCodeInput, setStyleCodeInput] = useState('');
//   const [isLoadingStyleCode, setIsLoadingStyleCode] = useState(false);
//   const styleCodeTimeoutRef = useRef(null);
  
//   const [barcodeInput, setBarcodeInput] = useState('');
//   const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
//   const barcodeTimeoutRef = useRef(null);

//   // NEW: Track source of data loading
//   const [dataSource, setDataSource] = useState(null);
  
//   // NEW: State for size details loading
//   const [isSizeDetailsLoaded, setIsSizeDetailsLoaded] = useState(false);
// const [checkboxes, setCheckboxes] = useState({
//   changeQty: formData.CHANGE_QTY || false,
//   multiShade: formData.MULTI_SHADE || false,
//   selectSet: formData.SELECT_SET || false
// });


// const hasProcessedPickOrder = useRef(false);

// useEffect(() => {

//   if (pickOrderItems && pickOrderItems.length > 0 && !hasProcessedPickOrder.current && !isEditingSize && !isAddingNew) {
//     hasProcessedPickOrder.current = true;
    
//     const newItems = pickOrderItems.map((item, index) => {
//       const tempId = Date.now() + index;
      
//       return {
//         id: tempId,
//         BarCode: item.barcode || item.BarCode || "-",
//         orderNo: item.orderNo || '',       
//         balQty: item.balQty || item.qty || 0,
//         orderDate: item.orderDate || '', 
//         product: item.product,
//         style: item.style,
//         type: item.type || "-",
//         shade: item.shade || "-",
//         lotNo: item.lotNo || "-",
//         qty: item.qty || 0,
//         mrp: item.mrp || 0,
//         rate: item.rate || 0,
//         amount: item.amount || 0,
//         varPer: item.varPer || 0,
//         varQty: 0,
//         varAmt: 0,
//         discAmt: item.discAmt || 0,
//         netAmt: item.netAmt || item.amount || 0,
//         distributer: "-",
//         set: item.set || 0,
//         originalData: {
//           ORDBKSTY_ID: tempId,
//           FGITEM_KEY: item.barcode || item.BarCode || "-",
//           ALT_BARCODE: item.barcode || item.BarCode || "-",
//           PRODUCT: item.product,
//           STYLE: item.style,
//           TYPE: item.type || "-",
//           SHADE: item.shade || "-",
//           PATTERN: item.lotNo || "-",
//           ITMQTY: item.qty || 0,
//           MRP: item.mrp || 0,
//           ITMRATE: item.rate || 0,
//           ITMAMT: item.amount || 0,
//           DLV_VAR_PERC: 0,
//           DLV_VAR_QTY: 0,
//           DISC_AMT: item.discAmt || 0,
//           NET_AMT: item.netAmt || 0,
//           DISTBTR: "-",
//           SETQTY: item.set || 0,
//           ORDBKSTYSZLIST: item.sizeDetails || [],
//           FGPRD_KEY: item.FGPRD_KEY || "",
//           FGSTYLE_ID: item.FGSTYLE_ID || 0,
//           FGTYPE_KEY: "",
//           FGSHADE_KEY: item.FGSHADE_KEY || "",
//           FGPTN_KEY: "",
//           DBFLAG: 'I'
//         },
//         FGSTYLE_ID: item.FGSTYLE_ID || 0,
//         FGPRD_KEY: item.FGPRD_KEY || "",
//         FGTYPE_KEY: "",
//         FGSHADE_KEY: item.FGSHADE_KEY || "",
//         FGPTN_KEY: "",
//         ALT_BARCODE: item.barcode || item.BarCode || "-"
//       };
//     });
    
//     // Add to existing table data
//     setUpdatedTableData(prev => {
//       const existingIds = new Set(prev.map(item => item.id));
//       const itemsToAdd = newItems.filter(item => !existingIds.has(item.id));
//       return [...prev, ...itemsToAdd];
//     });
    
//     showSnackbar(`${newItems.length} items added from Pick Order!`, 'success');
//   }
  
//   // Reset the ref when pickOrderItems becomes empty
//   if (!pickOrderItems || pickOrderItems.length === 0) {
//     hasProcessedPickOrder.current = false;
//   }
// }, [pickOrderItems]);

//   // State for table filters
//   const [tableFilters, setTableFilters] = useState({
//     BarCode: '',
//     product: '',
//     style: '',
//     type: '',
//     shade: '',
//     lotNo: '',
//     qty: '',
//     mrp: '',
//     rate: '',
//     amount: '',
//     varPer: '',
//     varQty: '',
//     varAmt: '',
//     discAmt: '',
//     netAmt: '',
//     divDt: '',
//     distributer: '',
//     set: ''
//   });
  
//   const [newItemData, setNewItemData] = useState({
//     product: '',
//     barcode: '',
//     style: '',
//     type: '',
//     shade: '',
//     qty: '',
//     mrp: '',
//     rate: '',
//     setNo: '',
//     varPer: '',
//     stdQty: '',
//     convFact: '',
//     lotNo: '',
//     discount: '',
//     percent: '',
//     remark: '',
//     divDt: '',
//     rQty: '',
//     sets: ''
//   });

//   // State for updated table data
//   const [updatedTableData, setUpdatedTableData] = useState([]);

//   // Updated textInputSx with white background for disabled state
//   const textInputSx = {
//     '& .MuiInputBase-root': {
//       height: 36,
//       fontSize: '14px',
//     },
//     '& .MuiInputLabel-root': {
//       fontSize: '14px',
//       top: '-8px',
//     },
//     '& .MuiFilledInput-root': {
//       backgroundColor: '#fafafa',
//       border: '1px solid #e0e0e0',
//       borderRadius: '6px',
//       overflow: 'hidden',
//       height: 36,
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
//     '& .MuiFilledInput-root.Mui-disabled': {
//       backgroundColor: '#ffffff'
//     }
//   };

//   // Updated DropInputSx with white background for disabled state
//   const DropInputSx = {
//     '& .MuiInputBase-root': {
//       height: 36,
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
//       height: 36,
//       fontSize: '14px',
//       paddingRight: '36px',
//     },
//     '& .MuiFilledInput-root:before': {
//       display: 'none',
//     },
//     '& .MuiFilledInput-root:after': {
//       display: 'none',
//     },
//     '& .MuiInputBase-input': {
//       padding: '10px 12px',
//       fontSize: '14px',
//       lineHeight: '1.4',
//     },
//     '& .MuiAutocomplete-endAdornment': {
//       top: '50%',
//       transform: 'translateY(-50%)',
//       right: '10px',
//     },
//     '& .MuiFilledInput-root.Mui-disabled': {
//       backgroundColor: '#ffffff'
//     }
//   };

//   const datePickerSx = {
//     "& .MuiInputBase-root": {
//       height: "32px",
//     },
//     "& .MuiInputBase-input": {
//       padding: "4px 8px",
//       fontSize: "12px",
//     },
//     "& .MuiInputLabel-root": {
//       top: "-6px",
//       fontSize: "12px",
//     },
//     "& .MuiInputBase-root.Mui-disabled": {
//       backgroundColor: '#ffffff',
//       '& .MuiFilledInput-root': {
//         backgroundColor: '#ffffff',
//       }
//     },
//     "& .MuiFilledInput-root.Mui-disabled": {
//       backgroundColor: '#ffffff',
//     }
//   };

//   // Parse ORDBKSTYLIST data for table - FIXED for Type, Shade, Pattern
//   const initialTableData = formData.apiResponseData?.ORDBKSTYLIST ? formData.apiResponseData.ORDBKSTYLIST.map((item, index) => ({
//     id: item.ORDBKSTY_ID || index + 1,
//    BarCode: item.ALT_BARCODE || item.FGITEM_KEY || "-",
//     product: item.PRODUCT || "-",
//     style: item.STYLE || "-",
//     // FIXED: Use TYPE, SHADE, PATTERN from API response
//     type: item.TYPE || "-",
//     shade: item.SHADE || "-",
//     lotNo: item.PATTERN || formData.SEASON || "-", // PATTERN is Lot No
//     qty: parseFloat(item.ITMQTY) || 0,
//     mrp: parseFloat(item.MRP) || 0,
//     rate: parseFloat(item.ITMRATE) || 0,
//     amount: parseFloat(item.ITMAMT) || 0,
//     varPer: parseFloat(item.DLV_VAR_PERC) || 0,
//     varQty: parseFloat(item.DLV_VAR_QTY) || 0,
//     varAmt: 0,
//     discAmt: parseFloat(item.DISC_AMT) || 0,
//     netAmt: parseFloat(item.NET_AMT) || 0,
//     distributer: item.DISTBTR || "-",
//     set: parseFloat(item.SETQTY) || 0,
//     originalData: item,
//     FGSTYLE_ID: item.FGSTYLE_ID,
//     FGPRD_KEY: item.FGPRD_KEY,
//     FGTYPE_KEY: item.FGTYPE_KEY || "",
//     FGSHADE_KEY: item.FGSHADE_KEY || "",
//     FGPTN_KEY: item.FGPTN_KEY || "",
//     ALT_BARCODE: item.ALT_BARCODE || item.FGITEM_KEY || "" 
//   })) : [];

//   // Use updatedTableData if available, otherwise use initial data
//   const tableData = updatedTableData.length > 0 ? updatedTableData : initialTableData;

//   // Filter table data based on filters
//   const filteredTableData = tableData.filter(row => {
//     return Object.keys(tableFilters).every(key => {
//       if (!tableFilters[key]) return true;
      
//       const filterValue = tableFilters[key].toString().toLowerCase();
//       const rowValue = row[key]?.toString().toLowerCase() || '';
      
//       return rowValue.includes(filterValue);
//     });
//   });

//   // Update hasRecords when tableData changes
//   useEffect(() => {
//     setHasRecords(tableData.length > 0);
//   }, [tableData]);

//   // Calculate totals from table data
//   const calculateTotals = () => {
//     const totalQty = tableData.reduce((sum, row) => sum + (row.qty || 0), 0);
//     const totalAmount = tableData.reduce((sum, row) => sum + (row.amount || 0), 0);
//     const totalNetAmt = tableData.reduce((sum, row) => sum + (row.netAmt || 0), 0);
//     const totalDiscount = tableData.reduce((sum, row) => sum + (row.discAmt || 0), 0);

//     setFormData(prev => ({
//       ...prev,
//       TOTAL_QTY: totalQty,
//       TOTAL_AMOUNT: totalAmount,
//       NET_AMOUNT: totalNetAmt,
//       DISCOUNT: totalDiscount,
//       AMOUNT: totalAmount.toString(),
//       AMOUNT_1: totalAmount.toString()
//     }));
//   };

//   // Calculate totals whenever tableData changes
//   useEffect(() => {
//     calculateTotals();
//   }, [tableData]);

//   // Cleanup timeout on component unmount
//   useEffect(() => {
//     return () => {
//       if (styleCodeTimeoutRef.current) {
//         clearTimeout(styleCodeTimeoutRef.current);
//       }
//       if (barcodeTimeoutRef.current) {
//         clearTimeout(barcodeTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Initialize with first row's size details when component loads
//   useEffect(() => {
//     if (tableData.length > 0 && !selectedRow) {
//       const firstRow = tableData[0];
//       setSelectedRow(firstRow.id);
//       const sizeDetails = firstRow.originalData?.ORDBKSTYSZLIST || [];
//       setSizeDetailsData(sizeDetails);
//     }
//   }, [tableData, selectedRow]);

//   // Load product and other dropdown data when component mounts or formData changes
//   useEffect(() => {
//     fetchProductData();
//   }, []);

//   // Populate product and other fields when formData has data
//   useEffect(() => {
//     if (formData.apiResponseData?.ORDBKSTYLIST && formData.apiResponseData.ORDBKSTYLIST.length > 0) {
//       const firstItem = formData.apiResponseData.ORDBKSTYLIST[0];
      
//       if (firstItem.PRODUCT) {
//         setSelectedProduct(firstItem.PRODUCT);
//       }
//       if (firstItem.STYLE) {
//         setSelectedStyle(firstItem.STYLE);
//       }
//     }
//   }, [formData.apiResponseData]);

//   // Handle table filter change
//   const handleTableFilterChange = (columnId, value) => {
//     setTableFilters(prev => ({
//       ...prev,
//       [columnId]: value
//     }));
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     setTableFilters({
//       BarCode: '',
//       product: '',
//       style: '',
//       type: '',
//       shade: '',
//       lotNo: '',
//       qty: '',
//       mrp: '',
//       rate: '',
//       amount: '',
//       varPer: '',
//       varQty: '',
//       varAmt: '',
//       discAmt: '',
//       netAmt: '',
//       divDt: '',
//       distributer: '',
//       set: ''
//     });
//   };

//   // Fetch Product dropdown data from API
//   const fetchProductData = async () => {
//     try {
//       const payload = {
//         "FLAG": ""
//       };

//       const response = await axiosInstance.post('/Product/GetFgPrdDrp', payload);

//       if (response.data.DATA && response.data.DATA.length > 0) {
//         const products = response.data.DATA.map(item => item.FGPRD_NAME || '');
//         setProductOptions(products);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.FGPRD_NAME && item.FGPRD_KEY) {
//             mapping[item.FGPRD_NAME] = item.FGPRD_KEY;
//           }
//         });
//         setProductMapping(mapping);
//       }
//     } catch (error) {
//       console.error('Error fetching product data:', error);
//     }
//   };

//   // Fetch Style dropdown data
//   const fetchStyleData = async (fgprdKey) => {
//     if (!fgprdKey) return;

//     try {
//       const payload = {
//         "FGSTYLE_ID": 0,
//         "FGPRD_KEY": fgprdKey,
//         "FGSTYLE_CODE": "",
//         "FLAG": ""
//       };

//       const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

//       if (response.data.DATA) {
//         const styles = response.data.DATA.map(item => item.FGSTYLE_CODE || '');
//         setStyleOptions(styles);
        
//         const styleIdMapping = {};
//         const productKeyMapping = {};
        
//         response.data.DATA.forEach(item => {
//           if (item.FGSTYLE_CODE && item.FGSTYLE_ID) {
//             styleIdMapping[item.FGSTYLE_CODE] = item.FGSTYLE_ID;
//           }
//           if (item.FGSTYLE_CODE && item.FGPRD_KEY) {
//             productKeyMapping[item.FGSTYLE_CODE] = item.FGPRD_KEY;
//           }
//         });
        
//         setStyleMapping(styleIdMapping);
//         setProductMapping(prev => ({
//           ...prev,
//           ...productKeyMapping
//         }));
//       } else {
//         setStyleOptions([]);
//         setStyleMapping({});
//       }
//     } catch (error) {
//       console.error('Error fetching style data:', error);
//       setStyleOptions([]);
//       setStyleMapping({});
//     }
//   };

//  // Fetch style data by style code
// const fetchStyleDataByCode = async (styleCode) => {
//   if (!styleCode) return;

//   try {
//     setIsLoadingStyleCode(true);
//     setDataSource('styleCode');
    
//     const payload = {
//       "FGSTYLE_ID": "",
//       "FGPRD_KEY": "",
//       "FGSTYLE_CODE": styleCode,
//       "FLAG": ""
//     };

//     const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

//     if (response.data.DATA && response.data.DATA.length > 0) {
//       const styleData = response.data.DATA[0];
      
//       // Fetch shades for this style
//       if (styleData.FGSTYLE_ID) {
//         await fetchShadesForStyle(styleData.FGSTYLE_ID, shadeViewMode);
//       }
      
//       if (isAddingNew || isEditingSize) {
//         setNewItemData(prev => ({
//           ...prev,
//           product: styleData.FGPRD_NAME || '',
//           style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
//           type: styleData.FGTYPE_NAME || '',
//           mrp: styleData.MRP ? styleData.MRP.toString() : '',
//           rate: styleData.SSP ? styleData.SSP.toString() : '',
//           // Set shade to first selected shade
//           shade: selectedShades.length > 0 ? selectedShades[0] : ''
//         }));
        
//         if (styleData.FGPRD_NAME && styleData.FGPRD_KEY) {
//           setProductMapping(prev => ({
//             ...prev,
//             [styleData.FGPRD_NAME]: styleData.FGPRD_KEY
//           }));
//         }
        
//         if ((styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME) && styleData.FGSTYLE_ID) {
//           setStyleMapping(prev => ({
//             ...prev,
//             [styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME]: styleData.FGSTYLE_ID
//           }));
//         }
        
//         if (styleData.FGSTYLE_ID) {
//           await fetchTypeData(styleData.FGSTYLE_ID);
//           await fetchLotNoData(styleData.FGSTYLE_ID);
//         }
        
//         // Fetch size details automatically
//         await fetchSizeDetailsForStyle(styleData);
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching style data by code:', error);
//   } finally {
//     setIsLoadingStyleCode(false);
//   }
// };

// const fetchShadesForStyle = async (fgstyleId, mode = 'allocated') => {
//   try {
//     const payload = {
//       "FGSTYLE_ID": mode === 'allocated' ? fgstyleId.toString() : "",
//       "FLAG": ""
//     };

//     const response = await axiosInstance.post('/Fgshade/GetFgshadedrp', payload);
   
    
//     if (response.data.DATA && Array.isArray(response.data.DATA)) {
//       const shades = response.data.DATA.map(item => ({
//         FGSHADE_NAME: item.FGSHADE_NAME || '',
//         FGSHADE_KEY: item.FGSHADE_KEY || '',
//         FGSTYLE_ID: item.FGSTYLE_ID || fgstyleId
//       }));
      
//       // Build shade mapping
//       const shadeMap = {};
//       response.data.DATA.forEach(item => {
//         if (item.FGSHADE_NAME && item.FGSHADE_KEY) {
//           shadeMap[item.FGSHADE_NAME] = item.FGSHADE_KEY;
//         }
//       });
//       setShadeMapping(shadeMap);
      
//       setAvailableShades(shades);
      
//       // If in allocated mode, auto-select the first shade
//       if (mode === 'allocated' && shades.length > 0) {
//         const firstShade = shades[0].FGSHADE_NAME;
//         setSelectedShades([firstShade]);
        
//         // Also update the newItemData shade field
//         setNewItemData(prev => ({
//           ...prev,
//           shade: firstShade
//         }));
//       } else if (mode === 'all') {
//         // For all mode, don't auto-select any shade
//         setSelectedShades([]);
//       }
      
//       return shades;
//     } else {
//       console.warn('No shades data received');
//       setAvailableShades([]);
//       setSelectedShades([]);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching shades:', error);
//     showSnackbar('Error fetching shades', 'error');
//     setAvailableShades([]);
//     setSelectedShades([]);
//     return [];
//   }
// };

// // NEW: Handle shade selection change
// const handleShadeSelectionChange = (event) => {
//   const {
//     target: { value },
//   } = event;
  
//   setSelectedShades(
//     typeof value === 'string' ? value.split(',') : value,
//   );
  
//   // Update newItemData shade field with first selected shade
//   if (value && value.length > 0) {
//     const firstShade = typeof value === 'string' ? value.split(',')[0] : value[0];
//     setNewItemData(prev => ({
//       ...prev,
//       shade: firstShade
//     }));
//   }
// };

// // NEW: Handle All button click
// const handleAllShadesClick = async () => {
//   const currentStyleId = styleMapping[newItemData.style] || styleMapping[selectedStyle];
//   if (!currentStyleId) {
//       showSnackbar('Please select a style first', 'warning');
//     return;
//   }
//   setShadeViewMode('all');
//   await fetchShadesForStyle(currentStyleId, 'all');
// };

// // NEW: Handle Allocated button click
// const handleAllocatedShadesClick = async () => {
//   const currentStyleId = styleMapping[newItemData.style] || styleMapping[selectedStyle];
//   if (!currentStyleId) {
//       showSnackbar('Please select a style first', 'warning');
//     return;
//   }
//   setShadeViewMode('allocated');
//   await fetchShadesForStyle(currentStyleId, 'allocated');
// };

// const fetchStyleDataByBarcode = async (barcode) => {
//   if (!barcode) return;

//   try {
//     setIsLoadingBarcode(true);
//     setDataSource('barcode');
    
//     const payload = {
//       "FGSTYLE_ID": "",
//       "FGPRD_KEY": "",
//       "FGSTYLE_CODE": "",
//       "ALT_BARCODE": barcode,  // Search by ALT_BARCODE
//       "FLAG": ""
//     };

//     const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

//     if (response.data.DATA && response.data.DATA.length > 0) {
//       const styleData = response.data.DATA[0];
      
//       // IMPORTANT: Store the ORIGINAL barcode that user typed
//       const originalBarcode = barcode;  // This is "013457"
      
//       if (isAddingNew || isEditingSize) {
//         setNewItemData(prev => ({
//           ...prev,
//           product: styleData.FGPRD_NAME || '',
//           style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
//           type: styleData.FGTYPE_NAME || '',
//           mrp: styleData.MRP ? styleData.MRP.toString() : '',
//           rate: styleData.SSP ? styleData.SSP.toString() : '',
//           barcode: originalBarcode,  // Store the actual barcode
//           shade: selectedShades.length > 0 ? selectedShades[0] : ''
//         }));
        
//         // Also set barcodeInput to show the actual barcode
//         setBarcodeInput(originalBarcode);
        
//         if (styleData.FGPRD_NAME && styleData.FGPRD_KEY) {
//           setProductMapping(prev => ({
//             ...prev,
//             [styleData.FGPRD_NAME]: styleData.FGPRD_KEY
//           }));
//         }
        
//         if ((styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME) && styleData.FGSTYLE_ID) {
//           setStyleMapping(prev => ({
//             ...prev,
//             [styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME]: styleData.FGSTYLE_ID
//           }));
//         }
        
//         if (styleData.FGSTYLE_ID) {
//           await fetchTypeData(styleData.FGSTYLE_ID);
//           await fetchLotNoData(styleData.FGSTYLE_ID);
//         }
        
//         // Fetch size details - pass the actual barcode and style data
//         await fetchSizeDetailsForStyle(styleData, originalBarcode);
//       }
//     } else {
//       showSnackbar("No style found for this barcode", 'warning');
//     }
//   } catch (error) {
//     console.error('Error fetching style data by barcode:', error);
//     showSnackbar('Error loading barcode data', 'error');
//   } finally {
//     setIsLoadingBarcode(false);
//   }
// };

// const fetchSizeDetailsForStyle = async (styleData, barcodeValue = null) => {
//   try {
//     const fgprdKey = styleData.FGPRD_KEY;
//     const fgstyleId = styleData.FGSTYLE_ID;
//     const fgtypeKey = styleData.FGTYPE_KEY || "";
//     const fgshadeKey = styleData.FGSHADE_KEY || "";
//     const fgptnKey = styleData.FGPTN_KEY || "";
    
//     // Use the barcodeValue passed from fetchStyleDataByBarcode
//     // If not provided, use from newItemData or empty string
//     const actualBarcode = barcodeValue || newItemData.barcode || barcodeInput || "";

//     if (!fgprdKey || !fgstyleId) {
//       return;
//     }

//     // Get values from localStorage
//     const cobrId = companyConfig.COBR_ID || localStorage.getItem('COBR_ID') || '02';
//     const fcyrKey = localStorage.getItem('FCYR_KEY') || '25';
//     const coId = localStorage.getItem('CO_ID') || '02';
//     const clientId = localStorage.getItem('CLIENT_ID') || '5102';

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
//       "COBR_ID": cobrId,
//       "FCYR_KEY": fcyrKey,
//       "CLIENT_ID": clientId,
//       "CO_ID": coId
//     };

//     const stycatrtResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', stycatrtPayload);

//     let stycatrtId = 0;
//     if (stycatrtResponse.data.DATA && stycatrtResponse.data.DATA.length > 0) {
//       stycatrtId = stycatrtResponse.data.DATA[0].STYCATRT_ID || 0;
//     }

//     // SECOND: Get size details with FLAG: "B" for Barcode mode
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
//       "COBR_ID": cobrId,
//       "FCYR_KEY": fcyrKey,
//       "STYSTKDTL_ID": 0,
//       "BARCODE": actualBarcode,  
//       "FGITM_KEY": "",
//       "STYSTK_KEY": "",
//       "ORDBKSTY_ID": 0,
//       "CLIENT_ID": clientId,
//       "CO_ID": coId,
//       "FLAG": "GETPACKbARC2"  
//     };

//     console.log('Barcode API Payload:', sizeDetailsPayload);

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
//         FG_QTY: parseFloat(size.FG_QTY) || 0,
//         PORD_QTY: parseFloat(size.PORD_QTY) || 0,
//         BAL_QTY: parseFloat(size.BAL_QTY) || 0,
//         ISU_QTY: parseFloat(size.ISU_QTY) || 0,
//         STYSTKDTL_ID: size.STYSTKDTL_ID || 0,  // Store this for reference
//         BARCODE: actualBarcode  // Store the barcode
//       }));

//       setSizeDetailsData(transformedSizeDetails);

//       setNewItemData(prev => ({
//         ...prev,
//         stycatrtId: stycatrtId,
//         barcode: actualBarcode  // Keep the actual barcode
//       }));

//       setIsSizeDetailsLoaded(true);
//       showSnackbar(`Size details loaded for barcode: ${actualBarcode}`, 'success');
//     } else {
//       setSizeDetailsData([]);
//       setIsSizeDetailsLoaded(false);
//       showSnackbar("No size details found for this barcode", 'warning');
//     }
//   } catch (error) {
//     console.error('Error auto-fetching size details:', error);
//     setIsSizeDetailsLoaded(false);
//     showSnackbar('Error loading size details', 'error');
//   }
// };

//   // Fetch Type dropdown data
//   const fetchTypeData = async (fgstyleId) => {
//     if (!fgstyleId) return;

//     try {
//       const payload = {
//         "FGSTYLE_ID": fgstyleId,
//         "FLAG": ""
//       };

//       const response = await axiosInstance.post('/FgType/GetFgTypeDrp', payload);

//       if (response.data.DATA) {
//         const types = response.data.DATA.map(item => item.FGTYPE_NAME || '');
//         setTypeOptions(types);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.FGTYPE_NAME && item.FGTYPE_KEY) {
//             mapping[item.FGTYPE_NAME] = item.FGTYPE_KEY;
//           }
//         });
//         setTypeMapping(mapping);
//       } else {
//         setTypeOptions([]);
//         setTypeMapping({});
//       }
//     } catch (error) {
//       console.error('Error fetching type data:', error);
//       setTypeOptions([]);
//       setTypeMapping({});
//     }
//   };

//   // Fetch Shade dropdown data
//   const fetchShadeData = async (fgstyleId) => {
//     if (!fgstyleId) return;

//     try {
//       const payload = {
//         "FGSTYLE_ID": fgstyleId,
//         "FLAG": ""
//       };

//       const response = await axiosInstance.post('/Fgshade/GetFgshadedrp', payload);

//       if (response.data.DATA) {
//         const shades = response.data.DATA.map(item => item.FGSHADE_NAME || '');
//         setShadeOptions(shades);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.FGSHADE_NAME && item.FGSHADE_KEY) {
//             mapping[item.FGSHADE_NAME] = item.FGSHADE_KEY;
//           }
//         });
//         setShadeMapping(mapping);
//       } else {
//         setShadeOptions([]);
//         setShadeMapping({});
//       }
//     } catch (error) {
//       console.error('Error fetching shade data:', error);
//       setShadeOptions([]);
//       setShadeMapping({});
//     }
//   };

//   // Fetch Lot No dropdown data
//   const fetchLotNoData = async (fgstyleId) => {
//     if (!fgstyleId) return;

//     try {
//       const payload = {
//         "FGSTYLE_ID": fgstyleId,
//         "FLAG": ""
//       };

//       const response = await axiosInstance.post('/Fgptn/GetFgptnDrp', payload);

//       if (response.data.DATA) {
//         const lotNos = response.data.DATA.map(item => item.FGPTN_NAME || '');
//         setLotNoOptions(lotNos);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.FGPTN_NAME && item.FGPTN_KEY) {
//             mapping[item.FGPTN_NAME] = item.FGPTN_KEY;
//           }
//         });
//         setLotNoMapping(mapping);
//       } else {
//         setLotNoOptions([]);
//         setLotNoMapping({});
//       }
//     } catch (error) {
//       console.error('Error fetching lot no data:', error);
//       setLotNoOptions([]);
//       setLotNoMapping({});
//     }
//   };

//   const consolidateItemsByStyle = (items) => {
//   const styleMap = new Map();
  
//   items.forEach(item => {
//     const key = `${item.product}-${item.style}-${item.type || ''}-${item.lotNo || ''}`;
    
//     if (styleMap.has(key)) {
//       // Consolidate quantities and amounts
//       const existing = styleMap.get(key);
//       existing.qty = (parseFloat(existing.qty) || 0) + (parseFloat(item.qty) || 0);
//       existing.amount = (parseFloat(existing.amount) || 0) + (parseFloat(item.amount) || 0);
//       existing.netAmt = (parseFloat(existing.netAmt) || 0) + (parseFloat(item.netAmt) || 0);
      
//       // Merge size details
//       if (item.originalData?.ORDBKSTYSZLIST) {
//         existing.originalData.ORDBKSTYSZLIST = [
//           ...(existing.originalData.ORDBKSTYSZLIST || []),
//           ...item.originalData.ORDBKSTYSZLIST
//         ];
//       }
//     } else {
//       styleMap.set(key, { ...item });
//     }
//   });
  
//   return Array.from(styleMap.values());
// };

// const fetchSizeDetails = async () => {
//   if (!newItemData.product || !newItemData.style) {
//     showSnackbar("Please select Product and Style first", 'error');
//     return;
//   }

//   try {
//     const fgprdKey = productMapping[newItemData.product];
//     const fgstyleId = styleMapping[newItemData.style];
//     const fgtypeKey = typeMapping[newItemData.type] || "";
//     const fgshadeKey = shadeMapping[newItemData.shade] || "";
//     const fgptnKey = lotNoMapping[newItemData.lotNo] || "";

//     if (!fgprdKey || !fgstyleId) {
//       return;
//     }

//     // Get values from localStorage
//     const cobrId = companyConfig.COBR_ID || localStorage.getItem('COBR_ID') || '02';
//     const fcyrKey = localStorage.getItem('FCYR_KEY') || '25';
//     const coId = localStorage.getItem('CO_ID') || '02';
//     const clientId = localStorage.getItem('CLIENT_ID') || '5102';

//     // FIRST: Get STYCATRT_ID from API with FLAG: "GETSTYCATRTID"
//     const stycatrtPayload = {
//       "FGSTYLE_ID": fgstyleId,
//       "FGPRD_KEY": fgprdKey,
//       "FGTYPE_KEY": fgtypeKey,
//       "FGSHADE_KEY": fgshadeKey,
//       "FGPTN_KEY": fgptnKey,
//       "FLAG": "GETSTYCATRTID",
//       "MRP": parseFloat(newItemData.mrp) || 0,
//       "PARTY_KEY": formData.PARTY_KEY || "",
//       "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
//       "COBR_ID": cobrId,
//       "FCYR_KEY": fcyrKey,
//       "CLIENT_ID": clientId,
//       "CO_ID": coId
//     };

//     const stycatrtResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', stycatrtPayload);

//     let stycatrtId = 0;
//     if (stycatrtResponse.data.DATA && stycatrtResponse.data.DATA.length > 0) {
//       stycatrtId = stycatrtResponse.data.DATA[0].STYCATRT_ID || 0;
//     }

//     // SECOND: Get size details with enhanced payload
//     const sizeDetailsPayload = {
//       "FGSTYLE_ID": fgstyleId,
//       "FGPRD_KEY": fgprdKey,
//       "FGTYPE_KEY": fgtypeKey,
//       "FGSHADE_KEY": fgshadeKey,
//       "FGPTN_KEY": fgptnKey,
//       "MRP": parseFloat(newItemData.mrp) || 0,
//       "SSP": parseFloat(newItemData.rate) || 0,
//       "PARTY_KEY": formData.PARTY_KEY || "",
//       "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
//       "COBR_ID": cobrId,
//       "FCYR_KEY": fcyrKey,
//       "STYSTKDTL_ID": 0,
//       "BARCODE": "",
//       "FGITM_KEY": "",
//       "STYSTK_KEY": "",
//       "ORDBKSTY_ID": 0,
//       "CLIENT_ID": clientId,
//       "CO_ID": coId,
//       "FLAG": ""
//     };

//     const sizeDetailsResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', sizeDetailsPayload);

//     if (sizeDetailsResponse.data.DATA && sizeDetailsResponse.data.DATA.length > 0) {
//       const transformedSizeDetails = sizeDetailsResponse.data.DATA.map((size, index) => ({
//         STYSIZE_ID: size.STYSIZE_ID || index + 1,
//         STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
//         FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
//         QTY: 0,
//         ITM_AMT: 0,
//         ORDER_QTY: 0,
//         MRP: parseFloat(newItemData.mrp) || 0,
//         RATE: parseFloat(newItemData.rate) || 0,
//         FG_QTY: parseFloat(size.FG_QTY) || 0,  // Add FG_QTY
//         PORD_QTY: parseFloat(size.PORD_QTY) || 0 // Add PORD_QTY
//       }));

//       setSizeDetailsData(transformedSizeDetails);

//       // Update newItemData with STYCATRT_ID for use in payload
//       setNewItemData(prev => ({
//         ...prev,
//         stycatrtId: stycatrtId
//       }));

//       setIsSizeDetailsLoaded(true);

//       // Show success message with STYCATRT_ID
//       showSnackbar(`Size details loaded successfully. STYCATRT_ID: ${stycatrtId}`, 'success');
//     } else {
//       showSnackbar("No size details found for the selected combination.", 'warning');
//       setSizeDetailsData([]);
//       setIsSizeDetailsLoaded(false);
//     }
//   } catch (error) {
//     console.error('Error fetching size details:', error);
//     showSnackbar("Error loading size details. Please try again.", 'error');
//     setIsSizeDetailsLoaded(false);
//   }
// };

//   // Handle style code text input change with debounce
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

//  const handleBarcodeInputChange = (e) => {
//   const value = e.target.value;
//   setBarcodeInput(value);  
  
  
//   if (isAddingNew || isEditingSize) {
//     setNewItemData(prev => ({
//       ...prev,
//       barcode: value
//     }));
//   }
  
//   if (barcodeTimeoutRef.current) {
//     clearTimeout(barcodeTimeoutRef.current);
//   }
  
//   if (value && value.trim() !== '') {
//     barcodeTimeoutRef.current = setTimeout(() => {
//       fetchStyleDataByBarcode(value.trim());
//     }, 500);
//   }
// };

//   // Handle product selection change
//   const handleProductChange = async (event, value) => {
//     setSelectedProduct(value);
//     setDataSource('dropdown');
    
//     if (isAddingNew || isEditingSize) {
//       setNewItemData(prev => ({ ...prev, product: value }));
      
//       if (value && productMapping[value]) {
//         const fgprdKey = productMapping[value];
//         await fetchStyleData(fgprdKey);
        
//         setNewItemData(prev => ({ 
//           ...prev, 
//           style: '',
//           type: '',
//           shade: '',
//           lotNo: ''
//         }));
//         setTypeOptions([]);
//         setShadeOptions([]);
//         setLotNoOptions([]);
//         setSizeDetailsData([]);
//         setIsSizeDetailsLoaded(false);
//       } else {
//         setStyleOptions([]);
//         setTypeOptions([]);
//         setShadeOptions([]);
//         setLotNoOptions([]);
//         setSizeDetailsData([]);
//         setIsSizeDetailsLoaded(false);
//       }
//     }
//   };

//   // Handle style selection change
//   const handleStyleChange = async (event, value) => {
//     setSelectedStyle(value);
//     setDataSource('dropdown');
    
//     if (isAddingNew || isEditingSize) {
//       setNewItemData(prev => ({ ...prev, style: value }));
      
//       setNewItemData(prev => ({ 
//         ...prev, 
//         type: '',
//         shade: '',
//         lotNo: ''
//       }));
//       setTypeOptions([]);
//       setShadeOptions([]);
//       setLotNoOptions([]);
//       setSizeDetailsData([]);
//       setIsSizeDetailsLoaded(false);
      
//       if (value && styleMapping[value]) {
//         const fgstyleId = styleMapping[value];
        
//         const payload = {
//           "FGSTYLE_ID": fgstyleId,
//           "FGPRD_KEY": "",
//           "FGSTYLE_CODE": value,
//           "FLAG": ""
//         };

//         try {
//           const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

//           if (response.data.DATA && response.data.DATA.length > 0) {
//             const styleData = response.data.DATA[0];
            
//             setNewItemData(prev => ({
//               ...prev,
//               mrp: styleData.MRP ? styleData.MRP.toString() : '',
//               rate: styleData.SSP ? styleData.SSP.toString() : '',
//               type: styleData.FGTYPE_NAME || ''
//             }));
//           }
//         } catch (error) {
//           console.error('Error fetching style details:', error);
//         }
        
//         await fetchTypeData(fgstyleId);
//         await fetchShadeData(fgstyleId);
//         await fetchLotNoData(fgstyleId);
//       }
//     }
//   };

//   // Handle type selection change
//   const handleTypeChange = (event, value) => {
//     if (isAddingNew || isEditingSize) {
//       setNewItemData(prev => ({ ...prev, type: value }));
//       setSizeDetailsData([]);
//       setIsSizeDetailsLoaded(false);
//     }
//   };

//   // Handle shade selection change
//   const handleShadeChange = (event, value) => {
//     if (isAddingNew || isEditingSize) {
//       setNewItemData(prev => ({ ...prev, shade: value }));
//       setSizeDetailsData([]);
//       setIsSizeDetailsLoaded(false);
//     }
//   };

//   // Handle lot no selection change
//   const handleLotNoChange = (event, value) => {
//     if (isAddingNew || isEditingSize) {
//       setNewItemData(prev => ({ ...prev, lotNo: value }));
//       setSizeDetailsData([]);
//       setIsSizeDetailsLoaded(false);
//     }
//   };

//   // Handle row click
//   const handleRowClick = (row) => {
//     setSelectedRow(row.id);
    
//     const sizeDetails = row.originalData?.ORDBKSTYSZLIST || [];
//     setSizeDetailsData(sizeDetails);

//     if (isEditingSize) {
//       populateFormFields(row);
//     }
//   };

//   const populateFormFields = (row) => {
//   setEditingRowData(row);
  
//   const totalSizeQty = row.originalData?.ORDBKSTYSZLIST?.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0) || row.qty;
//   const convFact = totalSizeQty / (parseFloat(row.qty) || 1);
  
//   setNewItemData({
//     product: row.product || '',
//     barcode: row.BarCode || '',
//     style: row.style || '',
//     type: row.type || '',
//     shade: row.shade || '',
//     qty: row.qty?.toString() || '',
//     mrp: row.mrp?.toString() || '',
//     rate: row.rate?.toString() || '',
//     setNo: '',
//     varPer: row.varPer?.toString() || '',
//     stdQty: '',
//     convFact: convFact.toString() || '1',
//     lotNo: row.lotNo || '',
//     discount: row.discAmt?.toString() || '',
//     percent: '',
//     remark: '',
//     divDt: '',
//     rQty: '',
//     sets: row.set?.toString() || ''
//   });
  
//   // Also update style code and barcode input fields
//   setStyleCodeInput(row.style || '');
//   setBarcodeInput(row.BarCode || '');
// };

//   const handleNewItemChange = (e) => {
//     const { name, value } = e.target;
//     setNewItemData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const isPartySelected = () => {
//     return !!formData.Party && !!formData.PARTY_KEY;
//   };

//   // Handle Add Item
//   const handleAddItem = async () => {
//     if (!isPartySelected()) {
//       showSnackbar("Please select a Party first before adding items", 'error');
//       return;
//     }

//     setIsAddingNew(true);
//     setSizeDetailsData([]);
//     setIsSizeDetailsLoaded(false);
//     setDataSource(null);
    
//     await fetchProductData();
    
//     setNewItemData({
//       product: '',
//       barcode: '',
//       style: '',
//       type: '',
//       shade: '',
//       qty: '',
//       mrp: '',
//       rate: '',
//       setNo: '',
//       varPer: '',
//       stdQty: '',
//       convFact: '',
//       lotNo: '',
//       discount: '',
//       percent: '',
//       remark: '',
//       divDt: '',
//       rQty: '',
//       sets: ''
//     });
    
//     setStyleCodeInput('');
//     setBarcodeInput('');
//     setStyleOptions([]);
//     setTypeOptions([]);
//     setShadeOptions([]);
//     setLotNoOptions([]);
//   };

//   // Add this useEffect in Stepper2.js to sync table data to formData
// useEffect(() => {
//   if (updatedTableData.length > 0 && !isAddingNew && !isEditingSize) {
//     // Sync updatedTableData to formData.apiResponseData.ORDBKSTYLIST
//     const syncedItems = updatedTableData.map(item => ({
//       ORDBKSTY_ID: item.id,
//       FGITEM_KEY: item.BarCode,
//       ALT_BARCODE: item.ALT_BARCODE || item.BarCode,
//       PRODUCT: item.product,
//       STYLE: item.style,
//       TYPE: item.type,
//       SHADE: item.shade,
//       PATTERN: item.lotNo,
//       ITMQTY: item.qty,
//       MRP: item.mrp,
//       ITMRATE: item.rate,
//       ITMAMT: item.amount,
//       DLV_VAR_PERC: item.varPer || 0,
//       DLV_VAR_QTY: item.varQty || 0,
//       DISC_AMT: item.discAmt || 0,
//       NET_AMT: item.netAmt || item.amount,
//       DISTBTR: item.distributer || "-",
//       SETQTY: item.set || 0,
//       ORDBKSTYSZLIST: item.originalData?.ORDBKSTYSZLIST || [],
//       FGSTYLE_ID: item.FGSTYLE_ID,
//       FGPRD_KEY: item.FGPRD_KEY,
//       FGTYPE_KEY: item.FGTYPE_KEY,
//       FGSHADE_KEY: item.FGSHADE_KEY,
//       FGPTN_KEY: item.FGPTN_KEY,
//       DBFLAG: item.originalData?.DBFLAG || (mode === 'add' ? 'I' : 'U')
//     }));
    
//     setFormData(prev => ({
//       ...prev,
//       apiResponseData: {
//         ...prev.apiResponseData,
//         ORDBKSTYLIST: syncedItems
//       }
//     }));
//   }
// }, [updatedTableData, isAddingNew, isEditingSize, mode, setFormData]);

// const handleConfirmAdd = () => {
//   // Validation
//   if (!newItemData.product || !newItemData.style) {
//     showSnackbar("Please fill required fields: Product and Style", 'error');
//     return;
//   }

//   if (sizeDetailsData.length === 0) {
//     showSnackbar("Please load size details first", 'error');
//     return;
//   }

//   // At least one size should have quantity > 0
//   const sizesWithQty = sizeDetailsData.filter(size => size.QTY && size.QTY > 0);
//   if (sizesWithQty.length === 0) {
//     showSnackbar("Please enter quantity for at least one size before confirming", 'error');
//     return;
//   }

//   const fgprdKey = productMapping[newItemData.product] || productMapping[newItemData.style] || "";
//   const fgstyleId = styleMapping[newItemData.style] || "";
//   const stycatrtId = newItemData.stycatrtId || 0; // Get STYCATRT_ID from newItemData
//   const barcodeValue = newItemData.barcode || ""; // Get barcode value
    
//   const totalQty = sizesWithQty.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
//   const mrp = parseFloat(newItemData.mrp) || 0;
//   const rate = parseFloat(newItemData.rate) || 0;
//   const totalAmount = sizesWithQty.reduce((sum, size) => {
//     const sizeQty = parseFloat(size.QTY) || 0;
//     return sum + (sizeQty * rate);
//   }, 0);
//   const discount = parseFloat(newItemData.discount) || 0;
//   const netAmount = totalAmount - discount;

//   const tempId = Date.now();

//   const updatedSizeDetails = sizeDetailsData.map(size => ({
//     ...size,
//     QTY: parseFloat(size.QTY) || 0,
//     ITM_AMT: (parseFloat(size.QTY) || 0) * rate,
//     ALT_BARCODE: size.ALT_BARCODE || barcodeValue // Include barcode in size details
//   }));

//   // Create items for EACH selected shade with FULL quantity
//   const newItems = selectedShades.map((shade, shadeIndex) => {
//     // Each shade gets full quantity (not divided)
//     const shadeAmount = totalAmount;
//     const shadeQty = totalQty;
    
//     const fgshadeKey = shadeMapping[shade] || "";
//     const fgtypeKey = typeMapping[newItemData.type] || "";
//     const fgptnKey = lotNoMapping[newItemData.lotNo] || "";

//     return {
//       id: tempId + shadeIndex,
//       BarCode: barcodeValue || "-",
//       product: newItemData.product,
//       style: newItemData.style || "-",
//       type: newItemData.type || "-",
//       shade: shade || "-",
//       lotNo: newItemData.lotNo || "-",
//       qty: shadeQty,
//       mrp: mrp,
//       rate: rate,
//       amount: shadeAmount,
//       varPer: parseFloat(newItemData.varPer) || 0,
//       varQty: 0,
//       varAmt: 0,
//       discAmt: discount,
//       netAmt: netAmount,
//       distributer: "-",
//       set: parseFloat(newItemData.sets) || 0,
//       originalData: {
//         ORDBKSTY_ID: tempId + shadeIndex,
//         FGITEM_KEY: barcodeValue || "-",
//         ALT_BARCODE: barcodeValue || "-", // Important for barcode
//         PRODUCT: newItemData.product,
//         STYLE: newItemData.style,
//         TYPE: newItemData.type || "-",
//         SHADE: shade || "-",
//         PATTERN: newItemData.lotNo || "-",
//         ITMQTY: shadeQty,
//         MRP: mrp,
//         ITMRATE: rate,
//         ITMAMT: shadeAmount,
//         DLV_VAR_PERC: parseFloat(newItemData.varPer) || 0,
//         DLV_VAR_QTY: 0,
//         DISC_AMT: discount,
//         NET_AMT: netAmount,
//         DISTBTR: "-",
//         SETQTY: parseFloat(newItemData.sets) || 0,
//         ORDBKSTYSZLIST: updatedSizeDetails.map(size => ({
//           ...size,
//           ORDBKSTYSZ_ID: 0
//         })),
//         FGPRD_KEY: fgprdKey,
//         FGSTYLE_ID: fgstyleId,
//         FGTYPE_KEY: fgtypeKey,
//         FGSHADE_KEY: fgshadeKey,
//         FGPTN_KEY: fgptnKey,
//         STYCATRT_ID: stycatrtId, // Include STYCATRT_ID
//         DBFLAG: mode === 'add' ? 'I' : 'I'
//       },
//       FGSTYLE_ID: fgstyleId,
//       FGPRD_KEY: fgprdKey,
//       FGTYPE_KEY: fgtypeKey,
//       FGSHADE_KEY: fgshadeKey,
//       FGPTN_KEY: fgptnKey,
//       STYCATRT_ID: stycatrtId, // Store STYCATRT_ID
//       ALT_BARCODE: barcodeValue // Store barcode
//     };
//   });

//   // If no shades selected, create single item with current shade
//   const finalNewItems = selectedShades.length > 0 ? newItems : [{
//     id: tempId,
//     BarCode: barcodeValue || "-",
//     product: newItemData.product,
//     style: newItemData.style || "-",
//     type: newItemData.type || "-",
//     shade: newItemData.shade || "-",
//     lotNo: newItemData.lotNo || "-",
//     qty: totalQty,
//     mrp: mrp,
//     rate: rate,
//     amount: totalAmount,
//     varPer: parseFloat(newItemData.varPer) || 0,
//     varQty: 0,
//     varAmt: 0,
//     discAmt: discount,
//     netAmt: netAmount,
//     distributer: "-",
//     set: parseFloat(newItemData.sets) || 0,
//     originalData: {
//       ORDBKSTY_ID: tempId,
//       FGITEM_KEY: barcodeValue || "-",
//       ALT_BARCODE: barcodeValue || "-", // Important for barcode
//       PRODUCT: newItemData.product,
//       STYLE: newItemData.style,
//       TYPE: newItemData.type || "-",
//       SHADE: newItemData.shade || "-",
//       PATTERN: newItemData.lotNo || "-",
//       ITMQTY: totalQty,
//       MRP: mrp,
//       ITMRATE: rate,
//       ITMAMT: totalAmount,
//       DLV_VAR_PERC: parseFloat(newItemData.varPer) || 0,
//       DLV_VAR_QTY: 0,
//       DISC_AMT: discount,
//       NET_AMT: netAmount,
//       DISTBTR: "-",
//       SETQTY: parseFloat(newItemData.sets) || 0,
//       ORDBKSTYSZLIST: updatedSizeDetails.map(size => ({
//         ...size,
//         ORDBKSTYSZ_ID: 0
//       })),
//       FGPRD_KEY: fgprdKey,
//       FGSTYLE_ID: fgstyleId,
//       FGTYPE_KEY: typeMapping[newItemData.type] || "",
//       FGSHADE_KEY: shadeMapping[newItemData.shade] || "",
//       FGPTN_KEY: lotNoMapping[newItemData.lotNo] || "",
//       STYCATRT_ID: stycatrtId, // Include STYCATRT_ID
//       DBFLAG: mode === 'add' ? 'I' : 'I'
//     },
//     FGSTYLE_ID: fgstyleId,
//     FGPRD_KEY: fgprdKey,
//     FGTYPE_KEY: typeMapping[newItemData.type] || "",
//     FGSHADE_KEY: shadeMapping[newItemData.shade] || "",
//     FGPTN_KEY: lotNoMapping[newItemData.lotNo] || "",
//     STYCATRT_ID: stycatrtId, // Store STYCATRT_ID
//     ALT_BARCODE: barcodeValue // Store barcode
//   }];

//   const newTableData = [...tableData, ...finalNewItems];
//   setUpdatedTableData(newTableData);

//   // Update formData with all items
//   const newOrdbkStyleItems = finalNewItems.map(item => ({
//     ORDBKSTY_ID: item.id,
//     FGITEM_KEY: item.BarCode,
//     ALT_BARCODE: item.ALT_BARCODE || item.BarCode, // Include ALT_BARCODE
//     PRODUCT: item.product,
//     STYLE: item.style,
//     TYPE: item.type,
//     SHADE: item.shade,
//     PATTERN: item.lotNo,
//     ITMQTY: item.qty,
//     MRP: item.mrp,
//     ITMRATE: item.rate,
//     ITMAMT: item.amount,
//     DLV_VAR_PERC: item.varPer,
//     DLV_VAR_QTY: item.varQty,
//     DISC_AMT: item.discAmt,
//     NET_AMT: item.netAmt,
//     DISTBTR: item.distributer,
//     SETQTY: item.set,
//     ORDBKSTYSZLIST: updatedSizeDetails.map(size => ({
//       ...size,
//       ORDBKSTYSZ_ID: 0
//     })),
//     FGSTYLE_ID: item.FGSTYLE_ID,
//     FGPRD_KEY: item.FGPRD_KEY,
//     FGTYPE_KEY: item.FGTYPE_KEY,
//     FGSHADE_KEY: item.FGSHADE_KEY,
//     FGPTN_KEY: item.FGPTN_KEY,
//     STYCATRT_ID: item.STYCATRT_ID, // Include STYCATRT_ID
//     DBFLAG: mode === 'add' ? 'I' : 'I'
//   }));

//   setFormData(prev => ({
//     ...prev,
//     apiResponseData: {
//       ...prev.apiResponseData,
//       ORDBKSTYLIST: [...(prev.apiResponseData?.ORDBKSTYLIST || []), ...newOrdbkStyleItems]
//     }
//   }));

//   setIsAddingNew(false);
//   setIsSizeDetailsLoaded(false);
//   setNewItemData({
//     product: '',
//     barcode: '',
//     style: '',
//     type: '',
//     shade: '',
//     qty: '',
//     mrp: '',
//     rate: '',
//     setNo: '',
//     varPer: '',
//     stdQty: '',
//     convFact: '',
//     lotNo: '',
//     discount: '',
//     percent: '',
//     remark: '',
//     divDt: '',
//     rQty: '',
//     sets: '',
//     stycatrtId: 0 // Reset STYCATRT_ID
//   });
//   setStyleCodeInput('');
//   setBarcodeInput('');
//   setSizeDetailsData([]);
//   setDataSource(null);
//   setSelectedShades([]);
//   setAvailableShades([]);
//   setItemsConfirmed(true);

//   showSnackbar(selectedShades.length > 1 ? 
//     `${selectedShades.length} barcode items added to order (${totalQty} each)!` : 
//     "Barcode item added successfully!");
// };

//   const handleEditItem = () => {
//   if (!selectedRow) {
//     showSnackbar("Please select an item to edit", 'error');
//     return;
//   }
  
//   if (isEditingSize) {
//     // SAVE CHANGES LOGIC
//     const updatedTable = tableData.map(row => {
//       if (row.id === selectedRow) {
//         const totalSizeQty = sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
//         const rate = parseFloat(newItemData.rate) || 0;
//         const amount = sizeDetailsData.reduce((sum, size) => {
//           const sizeQty = parseFloat(size.QTY) || 0;
//           return sum + (sizeQty * rate);
//         }, 0);
//         const discount = parseFloat(newItemData.discount) || 0;
//         const netAmount = amount - discount;

//         const originalDbFlag = row.originalData?.DBFLAG || 'U';

//         return {
//           ...row,
//           qty: totalSizeQty,
//           mrp: parseFloat(newItemData.mrp) || 0,
//           rate: rate,
//           amount: amount,
//           discAmt: discount,
//           netAmt: netAmount,
//           originalData: {
//             ...row.originalData,
//             ORDBKSTYSZLIST: sizeDetailsData,
//             ITMQTY: totalSizeQty,
//             MRP: parseFloat(newItemData.mrp) || 0,
//             ITMRATE: rate,
//             ITMAMT: amount,
//             DISC_AMT: discount,
//             NET_AMT: netAmount,
//             DBFLAG: originalDbFlag
//           }
//         };
//       }
//       return row;
//     });
    
//     setUpdatedTableData(updatedTable);
    
//     setFormData(prev => ({
//       ...prev,
//       apiResponseData: {
//         ...prev.apiResponseData,
//         ORDBKSTYLIST: prev.apiResponseData?.ORDBKSTYLIST?.map(item => {
//           if (item.ORDBKSTY_ID === selectedRow) {
//             const totalSizeQty = sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
//             const rate = parseFloat(newItemData.rate) || 0;
//             const amount = sizeDetailsData.reduce((sum, size) => {
//               const sizeQty = parseFloat(size.QTY) || 0;
//               return sum + (sizeQty * rate);
//             }, 0);
//             const discount = parseFloat(newItemData.discount) || 0;
//             const netAmount = amount - discount;

//             const originalDbFlag = item.DBFLAG || 'U';

//             return {
//               ...item,
//               ITMQTY: totalSizeQty,
//               MRP: parseFloat(newItemData.mrp) || 0,
//               ITMRATE: rate,
//               ITMAMT: amount,
//               DISC_AMT: discount,
//               NET_AMT: netAmount,
//               ORDBKSTYSZLIST: sizeDetailsData,
//               DBFLAG: originalDbFlag
//             };
//           }
//           return item;
//         }) || []
//       }
//     }));
    
//     setIsEditingSize(false);
//     setIsSizeDetailsLoaded(false);
//     showSnackbar("Changes saved successfully!");
//   } else {
//     // ENTERING EDIT MODE: Populate form fields with selected row data
//     const selectedRowData = tableData.find(row => row.id === selectedRow);
//     if (selectedRowData) {
//       // First populate form fields
//       populateFormFields(selectedRowData);
      
//       // Then fetch size details for the selected item
//       const sizeDetails = selectedRowData.originalData?.ORDBKSTYSZLIST || [];
//       setSizeDetailsData(sizeDetails);
//       setIsSizeDetailsLoaded(true); // Mark size details as loaded
      
//       // Set editing mode to true
//       setIsEditingSize(true);
      
//       // Set data source to indicate we're loading existing data
//       setDataSource('edit');
      
//       // Fetch product and style data for dropdowns if needed
//       if (selectedRowData.FGPRD_KEY && !productOptions.includes(selectedRowData.product)) {
//         // If product not in dropdown, fetch it
//         fetchProductData();
//       }
      
//       if (selectedRowData.FGSTYLE_ID && !styleOptions.includes(selectedRowData.style)) {
//         // If style not in dropdown, fetch styles for this product
//         if (selectedRowData.FGPRD_KEY) {
//           fetchStyleData(selectedRowData.FGPRD_KEY);
//         }
//       }
      
//       // Fetch type, shade, lotNo data for this style
//       if (selectedRowData.FGSTYLE_ID) {
//         fetchTypeData(selectedRowData.FGSTYLE_ID);
//         fetchShadeData(selectedRowData.FGSTYLE_ID);
//         fetchLotNoData(selectedRowData.FGSTYLE_ID);
//       }
      
//       showSnackbar('Edit mode enabled for selected item. Make changes and click Confirm.');
//     }
//   }
// };

//   // FIXED: Handle Delete Item (Row immediately removed from table)
//   const handleDeleteItem = () => {
//     if (!selectedRow) {
//       showSnackbar("Please select an item to delete", 'error');
//       return;
//     }
    
//     // Immediately remove from display table
//     const updatedTableData = tableData.filter(row => row.id !== selectedRow);
//     setUpdatedTableData(updatedTableData);
    
//     // Mark as deleted in formData for API
//     setFormData(prev => {
//       const updatedOrdbkStyleList = (prev.apiResponseData?.ORDBKSTYLIST || []).map(item => {
//         if (item.ORDBKSTY_ID === selectedRow) {
//           return {
//             ...item,
//             DBFLAG: 'D',
//             ORDBKSTYSZLIST: (item.ORDBKSTYSZLIST || []).map(sizeItem => ({
//               ...sizeItem,
//               DBFLAG: 'D'
//             }))
//           };
//         }
//         return item;
//       });
      
//       return {
//         ...prev,
//         apiResponseData: {
//           ...prev.apiResponseData,
//           ORDBKSTYLIST: updatedOrdbkStyleList
//         }
//       };
//     });

//     // Update selected row
//     if (updatedTableData.length > 0) {
//       const firstRow = updatedTableData[0];
//       setSelectedRow(firstRow.id);
//       setSizeDetailsData(firstRow.originalData?.ORDBKSTYSZLIST || []);
//     } else {
//       setSelectedRow(null);
//       setSizeDetailsData([]);
//       setStyleOptions([]);
//       setTypeOptions([]);
//       setShadeOptions([]);
//       setLotNoOptions([]);
//     }

//     showSnackbar("Item deleted successfully!");
//   };

//   const handleCancelAdd = () => {
//     setIsAddingNew(false);
//     setIsSizeDetailsLoaded(false);
//     setNewItemData({
//       product: '',
//       barcode: '',
//       style: '',
//       type: '',
//       shade: '',
//       qty: '',
//       mrp: '',
//       rate: '',
//       setNo: '',
//       varPer: '',
//       stdQty: '',
//       convFact: '',
//       lotNo: '',
//       discount: '',
//       percent: '',
//       remark: '',
//       divDt: '',
//       rQty: '',
//       sets: ''
//     });
//     setStyleCodeInput('');
//     setBarcodeInput('');
//     setSizeDetailsData([]);
//     setDataSource(null);
//   };

//   const handleEditCancel = () => {
//     setShowValidationErrors(false);
//     setIsEditingSize(false);
//     setIsSizeDetailsLoaded(false);
//     setNewItemData({
//       product: '',
//       barcode: '',
//       style: '',
//       type: '',
//       shade: '',
//       qty: '',
//       mrp: '',
//       rate: '',
//       setNo: '',
//       varPer: '',
//       stdQty: '',
//       convFact: '',
//       lotNo: '',
//       discount: '',
//       percent: '',
//       remark: '',
//       divDt: '',
//       rQty: '',
//       sets: ''
//     });
//     setStyleCodeInput('');
//     setBarcodeInput('');
//     setDataSource(null);
//   };

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
//   };

//   const handleDateChange = (date, fieldName) => {
//     if (date) {
//       const formattedDate = format(date, "dd/MM/yyyy");
//       setFormData(prev => ({
//         ...prev,
//         [fieldName]: formattedDate
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [fieldName]: null
//       }));
//     }
//   };

//   const shouldDisableFields = () => {
//     return !(isAddingNew || isEditingSize);
//   };

//   const getFieldError = (fieldName) => {
//     if (!showValidationErrors) return '';
    
//     const requiredFields = {};

//     if (requiredFields[fieldName] && !newItemData[fieldName]) {
//       return `${requiredFields[fieldName]} is required`;
//     }
    
//     if (fieldName === 'qty' && newItemData.qty && parseFloat(newItemData.qty) <= 0) {
//       return 'Quantity must be greater than 0';
//     }

//     return '';
//   };

//  const columns = [
//   { id: 'orderNo', label: 'Order No', minWidth: 100 },
//   { id: 'orderDate', label: 'Order Date', minWidth: 80 },
//   { id: 'product', label: 'Product', minWidth: 150 },
//   { id: 'style', label: 'Style', minWidth: 120 },
//   { id: 'type', label: 'Type', minWidth: 80 },
//   { id: 'shade', label: 'Shade', minWidth: 80 },
//   { id: 'lotNo', label: 'Lot No', minWidth: 80 },
//   { id: 'qty', label: 'Qty', minWidth: 70, align: 'right' },
//   { id: 'balQty', label: 'Bal Qty', minWidth: 70, align: 'right' },
//   { id: 'rate', label: 'Rate', minWidth: 70, align: 'right' },
//   { id: 'amount', label: 'Amount', minWidth: 80, align: 'right' },
//   { id: 'netAmt', label: 'Net Amt', minWidth: 80, align: 'right' },
//   { id: 'set', label: 'Set', minWidth: 60, align: 'right' },
// ];

//   return (
//     <Box>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: { xs: 1.5, sm: 1.5, md: 0.7 },
//           marginInline: { xs: '5%', sm: '5%', md: '5%' }
//         }}
//       >
//         {/* Table Section */}
//         <Box sx={{ mt: 2 }}>
//           <Paper
//             elevation={1}
//             sx={{
//               width: "100%",
//               borderRadius: 2,
//               overflow: "hidden",
//               backgroundColor: "#fff",
//               border: "1px solid #e0e0e0",
//             }}
//           >
//             <TableContainer sx={{ maxHeight: 400 }}>
//               <Table stickyHeader size="small">
//                 <TableHead>
//                   {/* Header Row */}
//                   <TableRow>
//                     {columns.map((column) => (
//                       <TableCell
//                         key={column.id}
//                         align={column.align || 'left'}
//                         sx={{
//                           backgroundColor: "#f5f5f5",
//                           fontWeight: "bold",
//                           fontSize: "0.8rem",
//                           padding: "6px 8px",
//                           borderBottom: "1px solid #ddd",
//                           minWidth: column.minWidth
//                         }}
//                       >
//                         {column.label}
//                       </TableCell>
//                     ))}
//                   </TableRow>

//                   {/* Filter Row */}
//                   <TableRow>
//                     {columns.map((column) => (
//                       <TableCell
//                         key={`filter-${column.id}`}
//                         align={column.align || 'left'}
//                         sx={{
//                           backgroundColor: "#f4f8faff",
//                           padding: "2px 4px",
//                           borderBottom: "1px solid #ddd",
//                           minWidth: column.minWidth
//                         }}
//                       >
//                         <TextField
//                           size="small"
//                           placeholder={`Search ${column.label}`}
//                           value={tableFilters[column.id] || ''}
//                           onChange={(e) => handleTableFilterChange(column.id, e.target.value)}
//                           variant="outlined"
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               backgroundColor: 'white',
//                               '& fieldset': {
//                                 border: 'none',
//                               },
//                               '&:hover fieldset': {
//                                 border: 'none',
//                               },
//                               '&.Mui-focused fieldset': {
//                                 border: 'none',
//                               },
//                               height: '28px',
//                               fontSize: '0.7rem',
//                               borderRadius: '4px',
//                             },
//                             '& .MuiInputBase-input': {
//                               padding: '4px 6px',
//                               fontSize: '0.7rem',
//                             },
//                           }}
//                         />
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {filteredTableData.length > 0 ? (
//                     filteredTableData.map((row, index) => (
//                       <TableRow
//                         key={row.id}
//                         hover
//                         onClick={() => handleRowClick(row)}
//                         sx={{
//                           backgroundColor: selectedRow === row.id ? "#e3f2fd" : (index % 2 === 0 ? "#fafafa" : "#fff"),
//                           "&:hover": { backgroundColor: "#e3f2fd", cursor: 'pointer' },
//                           border: selectedRow === row.id ? '2px solid #2196f3' : 'none',
//                         }}
//                       >
//                         {columns.map((column) => (
//                           <TableCell
//                             key={column.id}
//                             align={column.align || 'left'}
//                             sx={{
//                               fontSize: "0.75rem",
//                               padding: "6px 8px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {column.format && typeof row[column.id] === 'number' 
//                               ? column.format(row[column.id])
//                               : row[column.id] || "—"
//                             }
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={columns.length} align="center" sx={{ py: 2 }}>
//                         <Typography variant="body2" color="textSecondary">
//                           {tableData.length === 0 ? 'No items found' : 'No items match your filters'}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
            
//             {/* Filter Controls */}
//             <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
//               <Typography variant="body2" color="textSecondary">
//                 Showing {filteredTableData.length} of {tableData.length} items
//               </Typography>
//               <Button 
//                 size="small" 
//                 onClick={clearAllFilters}
//                 disabled={Object.values(tableFilters).every(filter => !filter)}
//               >
//                 Clear Filters
//               </Button>
//             </Box>
//           </Paper>
//         </Box>

//         {/* CRUD Buttons and Totals */}
//         <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
//           <Tooltip 
//             title={!isPartySelected() ? "Please select a Party first" : "Add new item"}
//             placement="top"
//           >
//             <span>
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleAddItem}
//                 disabled={isFormDisabled || isEditingSize || isAddingNew}
//                 sx={{
//                    backgroundColor: '#635bff',
//                   color: 'white',
//                   margin: { xs: '0 4px', sm: '0 6px' },
//                   minWidth: { xs: 40, sm: 46, md: 60 },
//                   height: { xs: 40, sm: 46, md: 30 },
//                   '&:disabled': {
//                     backgroundColor: '#cccccc',
//                     color: '#666666'
//                   }
//                 }}
//               >
//                 Add
//               </Button>
//             </span>
//           </Tooltip>

//           <Button
//             variant="contained"
//             startIcon={<EditIcon />}
//             onClick={handleEditItem}
//              disabled={isFormDisabled || isEditingSize || isAddingNew}
//             sx={{
//                backgroundColor: '#635bff',
//               color: 'white',
//               margin: { xs: '0 4px', sm: '0 6px' },
//               minWidth: { xs: 40, sm: 46, md: 60 },
//               height: { xs: 40, sm: 46, md: 30 },
//               '&:disabled': {
//                 backgroundColor: '#cccccc',
//                 color: '#666666'
//               }
//             }}
//           >
//             {isEditingSize ? 'Edit' : 'Edit'}
//           </Button>

//           <Button
//             variant="contained"
//             startIcon={<DeleteIcon />}
//             onClick={handleDeleteItem}
//             disabled={isFormDisabled || isEditingSize || isAddingNew}
//             sx={{
//               backgroundColor: '#635bff',
//               color: 'white',
//               margin: { xs: '0 4px', sm: '0 6px' },
//               minWidth: { xs: 40, sm: 46, md: 60 },
//               height: { xs: 40, sm: 46, md: 30 },
//               '&:disabled': {
//                 backgroundColor: '#cccccc',
//                 color: '#666666'
//               }
//             }}
//           >
//             Delete
//           </Button>

//           {/* Totals */}
//           <TextField 
//             label="Tot Qty" 
//             variant="filled" 
//             value={formData.TOTAL_QTY || 0} 
//             disabled 
//             sx={textInputSx} 
//             inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//           />
//           <TextField 
//             label="Tot Amt" 
//             variant="filled" 
//             value={formData.TOTAL_AMOUNT || 0} 
//             disabled 
//             sx={textInputSx} 
//             inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//           />
//           <TextField 
//             label="Disc" 
//             variant="filled" 
//             value={formData.DISCOUNT || 0} 
//             disabled 
//             sx={textInputSx} 
//             inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//           />
//           <TextField 
//             label="Net" 
//             variant="filled" 
//             value={formData.NET_AMOUNT || 0} 
//             disabled 
//             sx={textInputSx} 
//             inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//           />
//         </Stack>

//         {/* Product Details and Size Details */}
//         <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'flex-start' }}>
//           {/* LEFT: Text Fields Section */}
//           <Box sx={{ flex: '0 0 60%' }}>
//             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              

//                <TextField 
//                 label="Type barcode Here" 
//                 variant="filled" 
//                 disabled={shouldDisableFields()}
//                 name="barcode"
//                 value={barcodeInput}
//                 onChange={handleBarcodeInputChange}
//                 placeholder="Type barcode"
//                 sx={textInputSx} 
//                 inputProps={{ 
//                   style: { padding: '6px 8px', fontSize: '12px' }
//                 }}
//                 // helperText={isLoadingBarcode ? "Loading..." : "Type barcode"}
//               />
              
              
             
             
//               <TextField 
//                 label="Type style code Here" 
//                 variant="filled" 
//                 disabled={shouldDisableFields()}
//                 name="styleCode"
//                 value={styleCodeInput}
//                 onChange={handleStyleCodeInputChange}
//                 placeholder="Type style code"
//                 sx={textInputSx} 
//                 inputProps={{ 
//                   style: { padding: '6px 8px', fontSize: '12px' }
//                 }}
//                 // helperText={isLoadingStyleCode ? "Loading..." : "Type style code"}
//               />

//               <AutoVibe
//                 id="Type"
//                 disabled={shouldDisableFields()}
//                 getOptionLabel={(option) => option || ''}
//                 options={typeOptions}
//                 label="Type"
//                 name="type"
//                 value={isAddingNew || isEditingSize ? newItemData.type : ''}
//                 onChange={handleTypeChange}
//                 sx={DropInputSx}
//               />
             

// {/* Shade Selection Section */}
// <Box sx={{ 
//   display: 'flex', 
//   gap: 1,
//   alignItems: 'center'
// }}>
//   <Button
//     variant={shadeViewMode === 'all' ? 'contained' : 'outlined'}
//     onClick={handleAllShadesClick}
//     size="small"
//     disabled={shouldDisableFields()}
//     sx={{ 
//       minWidth: '60px',
//       backgroundColor: shadeViewMode === 'all' ? '#1976d2' : 'transparent',
//       color: shadeViewMode === 'all' ? 'white' : '#1976d2',
//       borderColor: '#1976d2',
//       '&:hover': {
//         backgroundColor: shadeViewMode === 'all' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
//       },
//       '&.Mui-disabled': {
//         borderColor: '#cccccc',
//         color: '#666666',
//         backgroundColor: 'transparent'
//       }
//     }}
//   >
//     All
//   </Button>
//   <Button
//     variant={shadeViewMode === 'allocated' ? 'contained' : 'outlined'}
//     onClick={handleAllocatedShadesClick}
//     size="small"
//     disabled={shouldDisableFields()}
//     sx={{ 
//       minWidth: '80px',
//       backgroundColor: shadeViewMode === 'allocated' ? '#635bff' : 'transparent',
//       color: shadeViewMode === 'allocated' ? 'white' : '#1976d2',
//       borderColor: '#1976d2',
//       '&:hover': {
//         backgroundColor: shadeViewMode === 'allocated' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
//       },
//       '&.Mui-disabled': {
//         borderColor: '#cccccc',
//         color: '#666666',
//         backgroundColor: 'transparent'
//       }
//     }}
//   >
//     Allocated
//   </Button>
// </Box>

// {/* Shade Multi-Select Dropdown */}
// <FormControl sx={{ width: '100%' }}>
//   <Select
//     labelId="shade-select-label"
//     id="shade-select"
//     multiple
//     value={selectedShades}
//     onChange={handleShadeSelectionChange}
//     disabled={shouldDisableFields()}
//     input={<OutlinedInput />}
//     renderValue={(selected) => (
//       <Box
//         sx={{
//           display: 'flex',
//           flexWrap: 'nowrap',
//           gap: 0.5,
//           overflowX: 'auto',
//           overflowY: 'hidden',
//           maxWidth: '100%',
//           alignItems: 'center',
//           '&::-webkit-scrollbar': {
//             height: '3px',
//           },
//         }}
//       >
//         {selected.map((value) => (
//           <Chip
//             key={value}
//             label={value}
//             size="small"
//             sx={{
//               height: '24px',
//               fontSize: '0.75rem'
//             }}
//           />
//         ))}
//       </Box>
//     )}
//     size="small"
//     sx={{
//       '& .MuiOutlinedInput-root': {
//         minHeight: '36px',
//         padding: '0px',
//       },
//       '& .MuiSelect-select': {
//         padding: '4px 8px',
//         display: 'flex',
//         alignItems: 'center',
//         overflow: 'hidden',
//       },
//     }}
//   >
//     {availableShades.map((shade) => (
//       <MenuItem key={shade.FGSHADE_NAME} value={shade.FGSHADE_NAME}>
//         {shade.FGSHADE_NAME}
//       </MenuItem>
//     ))}
//   </Select>
// </FormControl>

  


//               <TextField 
//                 label="Qty" 
//                 variant="filled" 
//                 disabled={true}
//                 name="qty"
//                 value={isAddingNew || isEditingSize ? newItemData.qty : ''}
//                 onChange={handleNewItemChange}
//                 sx={textInputSx} 
//                 inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//               />
              
//               <TextField 
//                 label="MRP" 
//                 variant="filled" 
//                 disabled={shouldDisableFields()}
//                 name="mrp"
//                 value={isAddingNew || isEditingSize ? newItemData.mrp : ''}
//                 onChange={handleNewItemChange}
//                 sx={textInputSx} 
//                 inputProps={{ 
//                   style: { padding: '6px 8px', fontSize: '12px' },
//                   type: 'number',
//                   step: '0.01',
//                   min: '0'
//                 }} 
//               />

//               {/* Rate Field (SSP) */}
//               <TextField 
//                 label="Rate" 
//                 variant="filled" 
//                 disabled={shouldDisableFields()}
//                 name="rate"
//                 value={isAddingNew || isEditingSize ? newItemData.rate : ''}
//                 onChange={handleNewItemChange}
//                 sx={textInputSx} 
//                 inputProps={{ 
//                   style: { padding: '6px 8px', fontSize: '12px' },
//                   type: 'number',
//                   step: '0.01',
//                   min: '0'
//                 }} 
//               />
//               <TextField 
//                 label="Set No" 
//                 variant="filled" 
//                 disabled={shouldDisableFields()}
//                 name="setNo"
//                 value={isAddingNew || isEditingSize ? newItemData.setNo : ''}
//                 onChange={handleNewItemChange}
//                 sx={textInputSx} 
//                 inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//               />
              
//               <TextField 
//                 label="Std Qty" 
//                 variant="filled" 
//                 disabled={shouldDisableFields()}
//                 name="stdQty"
//                 value={isAddingNew || isEditingSize ? newItemData.stdQty : ''}
//                 onChange={handleNewItemChange}
//                 sx={textInputSx} 
//                 inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//               />
//               <TextField 
//                 label="Conv Fact" 
//                 variant="filled" 
//                 disabled={true}
//                 name="convFact"
//                 value={isAddingNew || isEditingSize ? newItemData.convFact : ''}
//                 onChange={handleNewItemChange}
//                 sx={textInputSx} 
//                 inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//               />
//               <AutoVibe
//                 id="LotNo"
//                 disabled={shouldDisableFields()}
//                 getOptionLabel={(option) => option || ''}
//                 options={lotNoOptions}
//                 label="Lot No"
//                 name="lotNo"
//                 value={isAddingNew || isEditingSize ? newItemData.lotNo : ''}
//                 onChange={handleLotNoChange}
//                 sx={DropInputSx}
//               />
//               <AutoVibe
//                 id="Discount"
//                 disabled={shouldDisableFields()}
//                 getOptionLabel={(option) => option || ''}
//                 options={[]}
//                 label="Discount"
//                 name="discount"
//                 value={isAddingNew || isEditingSize ? newItemData.discount : ''}
//                 onChange={(event, value) => {
//                   if (isAddingNew || isEditingSize) {
//                     setNewItemData(prev => ({ ...prev, discount: value }));
//                   }
//                 }}
//                 sx={DropInputSx}
//               />
//               <TextField 
//                 label="Percent" 
//                 variant="filled" 
//                 disabled={shouldDisableFields()}
//                 name="percent"
//                 value={isAddingNew || isEditingSize ? newItemData.percent : ''}
//                 onChange={handleNewItemChange}
//                 sx={textInputSx} 
//                 inputProps={{ 
//                   style: { padding: '6px 8px', fontSize: '12px' },
//                   type: 'number',
//                   step: '0.01',
//                   min: '0',
//                   max: '100'
//                 }} 
//               />
//               <TextField 
//                 label="Remark" 
//                 variant="filled" 
//                 disabled={shouldDisableFields()}
//                 name="remark"
//                 value={isAddingNew || isEditingSize ? newItemData.remark : ''}
//                 onChange={handleNewItemChange}
//                 sx={textInputSx} 
//                 inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//               />
              
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DatePicker
//                   label="Div Dt"
//                   value={isAddingNew || isEditingSize ? (newItemData.divDt ? parse(newItemData.divDt, "dd/MM/yyyy", new Date()) : null) : (formData.DIV_DT ? parse(formData.DIV_DT, "dd/MM/yyyy", new Date()) : null)}
//                   format="dd/MM/yyyy"
//                   disabled={shouldDisableFields()}
//                   onChange={(date) => {
//                     if (isAddingNew || isEditingSize) {
//                       const formattedDate = date ? format(date, "dd/MM/yyyy") : '';
//                       setNewItemData(prev => ({ ...prev, divDt: formattedDate }));
//                     }
//                   }}
//                   slotProps={{
//                     textField: {
//                       fullWidth: true,
//                       variant: "filled",
//                       sx: textInputSx,
//                       InputProps: {
//                         sx: {
//                           height: "32px",
//                           padding: "0px",
//                           fontSize: "12px",
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </LocalizationProvider>
//               <TextField 
//                 label="RQty" 
//                 variant="filled" 
//                 disabled={shouldDisableFields()}
//                 name="rQty"
//                 value={isAddingNew || isEditingSize ? newItemData.rQty : ''}
//                 onChange={handleNewItemChange}
//                 sx={textInputSx} 
//                 inputProps={{ 
//                   style: { padding: '6px 8px', fontSize: '12px' },
//                   type: 'number',
//                   step: '1',
//                   min: '0'
//                 }} 
//               />
//              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//   <TextField 
//     label="Sets" 
//     variant="filled" 
//     disabled={shouldDisableFields()}
//     name="sets"
//     value={isAddingNew || isEditingSize ? newItemData.sets : ''}
//     onChange={handleNewItemChange}
//     sx={{ ...textInputSx, flex: 1 }} 
//     inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
//   />
//   {(isAddingNew || isEditingSize) && (
//     <>
//       {/* FIXED: Show "Add Qty" only when size details are not loaded AND we're in add mode */}
//       {!isSizeDetailsLoaded && isAddingNew && (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={fetchSizeDetails}
//           disabled={!newItemData.product || !newItemData.style || dataSource === 'barcode'}
//           sx={{ minWidth: '80px', height: '36px' }}
//         >
//           Add Qty
//         </Button>
//       )}
      
      
//       {(isSizeDetailsLoaded || isEditingSize) && (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={isAddingNew ? handleConfirmAdd : handleEditItem}
//           disabled={isAddingNew && sizeDetailsData.length === 0}
//           sx={{ minWidth: '80px', height: '36px' }}
//         >
//           {isAddingNew ? 'Confirm' : 'Confirm'}
//         </Button>
//       )}
      
//       <Button
//         variant="outlined"
//         color="secondary"
//         onClick={isAddingNew ? handleCancelAdd : () => {
//           setIsEditingSize(false);
//           setIsSizeDetailsLoaded(false);
//           setNewItemData({
//             product: '',
//             barcode: '',
//             style: '',
//             type: '',
//             shade: '',
//             qty: '',
//             mrp: '',
//             rate: '',
//             setNo: '',
//             varPer: '',
//             stdQty: '',
//             convFact: '',
//             lotNo: '',
//             discount: '',
//             percent: '',
//             remark: '',
//             divDt: '',
//             rQty: '',
//             sets: ''
//           });
//           setStyleCodeInput('');
//           setBarcodeInput('');
//           setDataSource(null);
          
//           // Reset size details to original row's data
//           const selectedRowData = tableData.find(row => row.id === selectedRow);
//           if (selectedRowData) {
//             const sizeDetails = selectedRowData.originalData?.ORDBKSTYSZLIST || [];
//             setSizeDetailsData(sizeDetails);
//           }
//         }}
//         sx={{ minWidth: '60px', height: '36px' }}
//       >
//         Cancel
//       </Button>
//     </>
//   )}
// </Box>
//             </Box>
//           </Box>

//           {/* RIGHT: Size Details Table */}
//          <Box sx={{ flex: 1 }}>
//             <Box sx={{
//               border: '1px solid #e0e0e0',
//               borderRadius: 2,
//               backgroundColor: '#fff',
//               p: 1,
//               width: '100%',
//               display: 'flex',
//               flexDirection: 'column'
//             }}>
//               <Typography variant="subtitle2" sx={{ display: '', fontWeight: 'bold', mb: 1 }}>
//                 Size Details {selectedRow && `(for ${tableData.find(row => row.id === selectedRow)?.product || 'Selected Item'})`}
//                 {isEditingSize && <span style={{ color: 'red', marginLeft: '10px' }}> - Editing Mode</span>}
//               </Typography>
//               <TableContainer sx={{ width: '100%', height: 270, overflowY: 'auto' }}>
//                 <Table size="small" stickyHeader>
//                   <TableHead>
//   <TableRow>
//     <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Size</TableCell>
//     <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Qty</TableCell>
    
//     {/* नए columns add करें */}
//     <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Ready Qty</TableCell>
//     <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Process</TableCell>
//     <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Order</TableCell>
//     <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Bal Qty</TableCell>
    
//     {/* <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>MRP</TableCell>
//     <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Rate</TableCell>
//     <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Amount</TableCell> */}
//     <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Barcode</TableCell>
//   </TableRow>
// </TableHead>
                  
//                   <TableBody>
//   {sizeDetailsData.length > 0 ? (
//     sizeDetailsData.map((size, index) => {
//       // API response से values calculate करें
//       const readyQty = parseFloat(size.FG_QTY) || 0;
//       const orderQty = parseFloat(size.PORD_QTY) || 0;
//       const issueQty = parseFloat(size.ISU_QTY) || 0;
//       const processQty = orderQty + issueQty;
//       const balQty = parseFloat(size.BAL_QTY) || 0;
      
//       return (
//         <TableRow key={index} sx={{
//           backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
//           "&:hover": { backgroundColor: "#e3f2fd" }
//         }}>
//           <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             {size.STYSIZE_NAME}
//           </TableCell>
          
//           <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             <TextField
//               type="number"
//               value={size.QTY}
//               onChange={(e) => handleSizeQtyChange(index, e.target.value)}
//               size="small"
//               sx={{ width: '80px' }}
//               inputProps={{ 
//                 style: { fontSize: '0.75rem', padding: '4px' },
//                 min: 0 
//               }}
//               disabled={!isAddingNew && !isEditingSize}
//             />
//           </TableCell>
          
//           {/* नए columns के data display करें */}
//           <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             {readyQty.toFixed(3)}
//           </TableCell>
          
//           <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             {processQty.toFixed(3)}
//           </TableCell>
          
//           <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             {orderQty.toFixed(3)}
//           </TableCell>
          
//           <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             {balQty.toFixed(3)}
//           </TableCell>
          
//           {/* <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             {size.MRP || newItemData.mrp || 0}
//           </TableCell>
          
//           <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             {size.RATE || newItemData.rate || 0}
//           </TableCell>
          
//           <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             {size.ITM_AMT || 0}
//           </TableCell> */}
          
//           <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
//             {size.FGSTYLE_ID || "-"}
//           </TableCell>
//         </TableRow>
//       );
//     })
//   ) : (
//     <TableRow>
//       <TableCell colSpan={11} align="center" sx={{ py: 1 }}> {/* colSpan को 11 करें क्योंकि अब 11 columns हैं */}
//         <Typography variant="body2" color="textSecondary">
//           {isAddingNew ? 
//             (dataSource === 'barcode' ? 
//               "Size details auto-loaded! Enter quantities." : 
//               "Click 'Add Qty' to load size details") 
//             : "No size details available"}
//         </Typography>
//       </TableCell>
//     </TableRow>
//   )}
// </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>
//           </Box>
//         </Box>

//         {/* Final Action Buttons */}
//         <Stack direction="row" spacing={2} sx={{ m: 3, justifyContent: 'flex-end' }}>
//           {/* <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={isAddingNew ? handleConfirmAdd : (isEditingSize ? handleEditItem : null)}
//             disabled={!(isAddingNew || isEditingSize)}
//             sx={{ 
//               minWidth: '60px', 
//               height: '36px',
//               backgroundColor: '#39ace2',
//               '&:disabled': {
//                 backgroundColor: '#cccccc',
//                 color: '#666666'
//               }
//             }}
//           >
//             {isAddingNew ? 'Confirm' : (isEditingSize ? 'Save' : 'Confirm')}
//           </Button>
//           <Button 
//             variant="outlined" 
//             color="secondary" 
//             onClick={isAddingNew ? handleCancelAdd : (isEditingSize ? handleEditCancel : onCancel)}
//             disabled={!(isAddingNew || isEditingSize)}
//             sx={{ 
//               minWidth: '60px', 
//               height: '36px',
//               '&:disabled': {
//                 borderColor: '#cccccc',
//                 color: '#666666'
//               }
//             }}
//           >
//             Cancel
//           </Button> */}
//           <Button 
//             variant="outlined" 
//             color="primary" 
//             onClick={onPrev}
           
//             sx={{ 
//               minWidth: '60px', 
//               height: '36px',
//              backgroundColor: '#635bff',
//               color: 'white',
//               '&:disabled': {
//                 borderColor: '#cccccc',
//                 color: '#666666'
//               }
//             }}
//           >
//             Previous
//           </Button>

//          <Button
//                      variant="contained"
//                      color="primary"
//                      onClick={onNext}
//                      sx={{
//                        minWidth: '60px',
//                        height: '36px',
//                        textTransform: 'none',
//                        backgroundColor: '#635bff',
//                        '&:disabled': {
//                          backgroundColor: '#cccccc',
//                          color: '#666666'
//                        },
//                        '&:hover': {
//                          backgroundColor: '#4e44e0',
//                        },
//                      }}
//                    >
//                      Next
//                    </Button>
//         </Stack>
        
//       </Box>
//     </Box>
//   )
// }

// export default Stepper3;
















'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tooltip } from '@mui/material';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Divider,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Alert, FormControl,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Chip,
} from '@mui/material';
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import { getFormMode } from '../../../../lib/helpers';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FORM_MODE = getFormMode();

const Stepper3 = ({ formData,pickOrderItems , setFormData, isFormDisabled, mode, onSubmit,companyConfig, onCancel, onNext,onPrev, showSnackbar, showValidationErrors }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sizeDetailsData, setSizeDetailsData] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditingSize, setIsEditingSize] = useState(false);
  const [editingRowData, setEditingRowData] = useState(null);
  const [hasRecords, setHasRecords] = useState(false);
  
  // State for dropdown options
  const [productOptions, setProductOptions] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [shadeOptions, setShadeOptions] = useState([]);
  const [lotNoOptions, setLotNoOptions] = useState([]);
 const [itemsConfirmed, setItemsConfirmed] = useState(false);
  const [availableShades, setAvailableShades] = useState([]);
const [selectedShades, setSelectedShades] = useState([]);
const [shadeViewMode, setShadeViewMode] = useState('allocated');
  const [isContinuousAddMode, setIsContinuousAddMode] = useState(false);
const [lastAddedBarcode, setLastAddedBarcode] = useState(null);
  // State for storing mappings
  const [productMapping, setProductMapping] = useState({});
  const [styleMapping, setStyleMapping] = useState({});
  const [typeMapping, setTypeMapping] = useState({});
  const [shadeMapping, setShadeMapping] = useState({});
  const [lotNoMapping, setLotNoMapping] = useState({});
  
  // NEW: State for style code and barcode text input
  const [styleCodeInput, setStyleCodeInput] = useState('');
  const [isLoadingStyleCode, setIsLoadingStyleCode] = useState(false);
  const styleCodeTimeoutRef = useRef(null);
  
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
  const barcodeTimeoutRef = useRef(null);


  const [dataSource, setDataSource] = useState(null);
  
  
  const [isSizeDetailsLoaded, setIsSizeDetailsLoaded] = useState(false);
const [checkboxes, setCheckboxes] = useState({
  changeQty: formData.CHANGE_QTY || false,
  multiShade: formData.MULTI_SHADE || false,
  selectSet: formData.SELECT_SET || false
});
const [barcodeCache, setBarcodeCache] = useState(() => {
  
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('barcodeQuantityCache');
    return saved ? JSON.parse(saved) : {};
  }
  return {};
});
const lastProcessedBarcodeRef = useRef(null);
const isProcessingBarcodeRef = useRef(false);

const saveBarcodeQuantities = (barcode, sizeQuantities) => {
  if (!barcode) return;
  
  // ✅ Get FGSTYLE_ID from current state
  const fgstyleId = styleMapping[newItemData.style] || newItemData.fgstyleId;
  
  const savedData = {
    barcode: barcode,
    product: newItemData.product,
    style: newItemData.style,
    type: newItemData.type,
    shade: newItemData.shade,
    lotNo: newItemData.lotNo,
    mrp: newItemData.mrp,
    rate: newItemData.rate,
    discount: newItemData.discount,
    fgstyleId: fgstyleId,
    sizes: sizeDetailsData.map(size => ({
      STYSIZE_NAME: size.STYSIZE_NAME,
      QTY: size.QTY || 0,
      STYSIZE_ID: size.STYSIZE_ID
    })),
    timestamp: Date.now()
  };
  
  setBarcodeCache(prev => ({
    ...prev,
    [barcode]: savedData
  }));
};

const hasCachedQuantities = (barcode) => {
  return barcodeCache[barcode] && barcodeCache[barcode].sizes && 
         barcodeCache[barcode].sizes.some(size => size.QTY > 0);
};


const getCachedQuantities = (barcode) => {
  return barcodeCache[barcode];
};



useEffect(() => {
  if (typeof window !== 'undefined' && Object.keys(barcodeCache).length > 0) {
    localStorage.setItem('barcodeQuantityCache', JSON.stringify(barcodeCache));
  }
}, [barcodeCache]);

const hasProcessedPickOrder = useRef(false);

useEffect(() => {

  if (pickOrderItems && pickOrderItems.length > 0 && !hasProcessedPickOrder.current && !isEditingSize && !isAddingNew) {
    hasProcessedPickOrder.current = true;
    
    const newItems = pickOrderItems.map((item, index) => {
      const tempId = Date.now() + index;
      
      return {
        id: tempId,
        BarCode: item.barcode || item.BarCode || "-",
        orderNo: item.orderNo || '',       
        balQty: item.balQty || item.qty || 0,
        orderDate: item.orderDate || '', 
        product: item.product,
        style: item.style,
        type: item.type || "-",
        shade: item.shade || "-",
        lotNo: item.lotNo || "-",
        qty: item.qty || 0,
        mrp: item.mrp || 0,
        rate: item.rate || 0,
        amount: item.amount || 0,
        varPer: item.varPer || 0,
        varQty: 0,
        varAmt: 0,
        discAmt: item.discAmt || 0,
        netAmt: item.netAmt || item.amount || 0,
        distributer: "-",
        set: item.set || 0,
        originalData: {
          ORDBKSTY_ID: tempId,
          FGITEM_KEY: item.barcode || item.BarCode || "-",
          ALT_BARCODE: item.barcode || item.BarCode || "-",
          PRODUCT: item.product,
          STYLE: item.style,
          TYPE: item.type || "-",
          SHADE: item.shade || "-",
          PATTERN: item.lotNo || "-",
          ITMQTY: item.qty || 0,
          MRP: item.mrp || 0,
          ITMRATE: item.rate || 0,
          ITMAMT: item.amount || 0,
          DLV_VAR_PERC: 0,
          DLV_VAR_QTY: 0,
          DISC_AMT: item.discAmt || 0,
          NET_AMT: item.netAmt || 0,
          DISTBTR: "-",
          SETQTY: item.set || 0,
          ORDBKSTYSZLIST: item.sizeDetails || [],
          FGPRD_KEY: item.FGPRD_KEY || "",
          FGSTYLE_ID: item.FGSTYLE_ID || 0,
          FGTYPE_KEY: "",
          FGSHADE_KEY: item.FGSHADE_KEY || "",
          FGPTN_KEY: "",
          DBFLAG: 'I'
        },
        FGSTYLE_ID: item.FGSTYLE_ID || 0,
        FGPRD_KEY: item.FGPRD_KEY || "",
        FGTYPE_KEY: "",
        FGSHADE_KEY: item.FGSHADE_KEY || "",
        FGPTN_KEY: "",
        ALT_BARCODE: item.barcode || item.BarCode || "-"
      };
    });
    
    // Add to existing table data
    setUpdatedTableData(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const itemsToAdd = newItems.filter(item => !existingIds.has(item.id));
      return [...prev, ...itemsToAdd];
    });
    
    showSnackbar(`${newItems.length} items added from Pick Order!`, 'success');
  }
  
  // Reset the ref when pickOrderItems becomes empty
  if (!pickOrderItems || pickOrderItems.length === 0) {
    hasProcessedPickOrder.current = false;
  }
}, [pickOrderItems]);

  // State for table filters
  const [tableFilters, setTableFilters] = useState({
    BarCode: '',
    product: '',
    style: '',
    type: '',
    shade: '',
    lotNo: '',
    qty: '',
    mrp: '',
    rate: '',
    amount: '',
    varPer: '',
    varQty: '',
    varAmt: '',
    discAmt: '',
    netAmt: '',
    divDt: '',
    distributer: '',
    set: ''
  });
  
  const [newItemData, setNewItemData] = useState({
    product: '',
    barcode: '',
    style: '',
    type: '',
    shade: '',
    qty: '',
    mrp: '',
    rate: '',
    setNo: '',
    varPer: '',
    stdQty: '',
    convFact: '',
    lotNo: '',
    discount: '',
    percent: '',
    remark: '',
    divDt: '',
    rQty: '',
    sets: ''
  });

  // State for updated table data
  const [updatedTableData, setUpdatedTableData] = useState([]);

  // Updated textInputSx with white background for disabled state
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
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: '#ffffff'
    }
  };

  // Updated DropInputSx with white background for disabled state
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
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: '#ffffff'
    }
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
    "& .MuiInputBase-root.Mui-disabled": {
      backgroundColor: '#ffffff',
      '& .MuiFilledInput-root': {
        backgroundColor: '#ffffff',
      }
    },
    "& .MuiFilledInput-root.Mui-disabled": {
      backgroundColor: '#ffffff',
    }
  };

  // Parse ORDBKSTYLIST data for table - FIXED for Type, Shade, Pattern
  const initialTableData = formData.apiResponseData?.ORDBKSTYLIST ? formData.apiResponseData.ORDBKSTYLIST.map((item, index) => ({
    id: item.ORDBKSTY_ID || index + 1,
   BarCode: item.ALT_BARCODE || item.FGITEM_KEY || "-",
    product: item.PRODUCT || "-",
    style: item.STYLE || "-",
    // FIXED: Use TYPE, SHADE, PATTERN from API response
    type: item.TYPE || "-",
    shade: item.SHADE || "-",
    lotNo: item.PATTERN || formData.SEASON || "-", // PATTERN is Lot No
    qty: parseFloat(item.ITMQTY) || 0,
    mrp: parseFloat(item.MRP) || 0,
    rate: parseFloat(item.ITMRATE) || 0,
    amount: parseFloat(item.ITMAMT) || 0,
    varPer: parseFloat(item.DLV_VAR_PERC) || 0,
    varQty: parseFloat(item.DLV_VAR_QTY) || 0,
    varAmt: 0,
    discAmt: parseFloat(item.DISC_AMT) || 0,
    netAmt: parseFloat(item.NET_AMT) || 0,
    distributer: item.DISTBTR || "-",
    set: parseFloat(item.SETQTY) || 0,
    originalData: item,
    FGSTYLE_ID: item.FGSTYLE_ID,
    FGPRD_KEY: item.FGPRD_KEY,
    FGTYPE_KEY: item.FGTYPE_KEY || "",
    FGSHADE_KEY: item.FGSHADE_KEY || "",
    FGPTN_KEY: item.FGPTN_KEY || "",
    ALT_BARCODE: item.ALT_BARCODE || item.FGITEM_KEY || "" 
  })) : [];

  // Use updatedTableData if available, otherwise use initial data
  const tableData = updatedTableData.length > 0 ? updatedTableData : initialTableData;

  // Filter table data based on filters
  const filteredTableData = tableData.filter(row => {
    return Object.keys(tableFilters).every(key => {
      if (!tableFilters[key]) return true;
      
      const filterValue = tableFilters[key].toString().toLowerCase();
      const rowValue = row[key]?.toString().toLowerCase() || '';
      
      return rowValue.includes(filterValue);
    });
  });

  // Update hasRecords when tableData changes
  useEffect(() => {
    setHasRecords(tableData.length > 0);
  }, [tableData]);

  // Calculate totals from table data
  const calculateTotals = () => {
    const totalQty = tableData.reduce((sum, row) => sum + (row.qty || 0), 0);
    const totalAmount = tableData.reduce((sum, row) => sum + (row.amount || 0), 0);
    const totalNetAmt = tableData.reduce((sum, row) => sum + (row.netAmt || 0), 0);
    const totalDiscount = tableData.reduce((sum, row) => sum + (row.discAmt || 0), 0);

    setFormData(prev => ({
      ...prev,
      TOTAL_QTY: totalQty,
      TOTAL_AMOUNT: totalAmount,
      NET_AMOUNT: totalNetAmt,
      DISCOUNT: totalDiscount,
      AMOUNT: totalAmount.toString(),
      AMOUNT_1: totalAmount.toString()
    }));
  };

  // Calculate totals whenever tableData changes
  useEffect(() => {
    calculateTotals();
  }, [tableData]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (styleCodeTimeoutRef.current) {
        clearTimeout(styleCodeTimeoutRef.current);
      }
      if (barcodeTimeoutRef.current) {
        clearTimeout(barcodeTimeoutRef.current);
      }
    };
  }, []);

  // Initialize with first row's size details when component loads
  useEffect(() => {
    if (tableData.length > 0 && !selectedRow) {
      const firstRow = tableData[0];
      setSelectedRow(firstRow.id);
      const sizeDetails = firstRow.originalData?.ORDBKSTYSZLIST || [];
      setSizeDetailsData(sizeDetails);
    }
  }, [tableData, selectedRow]);

  // Load product and other dropdown data when component mounts or formData changes
  useEffect(() => {
    fetchProductData();
  }, []);

  // Populate product and other fields when formData has data
  useEffect(() => {
    if (formData.apiResponseData?.ORDBKSTYLIST && formData.apiResponseData.ORDBKSTYLIST.length > 0) {
      const firstItem = formData.apiResponseData.ORDBKSTYLIST[0];
      
      if (firstItem.PRODUCT) {
        setSelectedProduct(firstItem.PRODUCT);
      }
      if (firstItem.STYLE) {
        setSelectedStyle(firstItem.STYLE);
      }
    }
  }, [formData.apiResponseData]);

  // Handle table filter change
  const handleTableFilterChange = (columnId, value) => {
    setTableFilters(prev => ({
      ...prev,
      [columnId]: value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setTableFilters({
      BarCode: '',
      product: '',
      style: '',
      type: '',
      shade: '',
      lotNo: '',
      qty: '',
      mrp: '',
      rate: '',
      amount: '',
      varPer: '',
      varQty: '',
      varAmt: '',
      discAmt: '',
      netAmt: '',
      divDt: '',
      distributer: '',
      set: ''
    });
  };

  // Fetch Product dropdown data from API
  const fetchProductData = async () => {
    try {
      const payload = {
        "FLAG": ""
      };

      const response = await axiosInstance.post('/Product/GetFgPrdDrp', payload);

      if (response.data.DATA && response.data.DATA.length > 0) {
        const products = response.data.DATA.map(item => item.FGPRD_NAME || '');
        setProductOptions(products);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.FGPRD_NAME && item.FGPRD_KEY) {
            mapping[item.FGPRD_NAME] = item.FGPRD_KEY;
          }
        });
        setProductMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  // Fetch Style dropdown data
  const fetchStyleData = async (fgprdKey) => {
    if (!fgprdKey) return;

    try {
      const payload = {
        "FGSTYLE_ID": 0,
        "FGPRD_KEY": fgprdKey,
        "FGSTYLE_CODE": "",
        "FLAG": ""
      };

      const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

      if (response.data.DATA) {
        const styles = response.data.DATA.map(item => item.FGSTYLE_CODE || '');
        setStyleOptions(styles);
        
        const styleIdMapping = {};
        const productKeyMapping = {};
        
        response.data.DATA.forEach(item => {
          if (item.FGSTYLE_CODE && item.FGSTYLE_ID) {
            styleIdMapping[item.FGSTYLE_CODE] = item.FGSTYLE_ID;
          }
          if (item.FGSTYLE_CODE && item.FGPRD_KEY) {
            productKeyMapping[item.FGSTYLE_CODE] = item.FGPRD_KEY;
          }
        });
        
        setStyleMapping(styleIdMapping);
        setProductMapping(prev => ({
          ...prev,
          ...productKeyMapping
        }));
      } else {
        setStyleOptions([]);
        setStyleMapping({});
      }
    } catch (error) {
      console.error('Error fetching style data:', error);
      setStyleOptions([]);
      setStyleMapping({});
    }
  };

 // Fetch style data by style code
const fetchStyleDataByCode = async (styleCode) => {
  if (!styleCode) return;

  try {
    setIsLoadingStyleCode(true);
    setDataSource('styleCode');
    
    const payload = {
      "FGSTYLE_ID": "",
      "FGPRD_KEY": "",
      "FGSTYLE_CODE": styleCode,
      "FLAG": ""
    };

    const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

    if (response.data.DATA && response.data.DATA.length > 0) {
      const styleData = response.data.DATA[0];
      
      // Fetch shades for this style
      if (styleData.FGSTYLE_ID) {
        await fetchShadesForStyle(styleData.FGSTYLE_ID, shadeViewMode);
      }
      
      if (isAddingNew || isEditingSize) {
        setNewItemData(prev => ({
          ...prev,
          product: styleData.FGPRD_NAME || '',
          style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
          type: styleData.FGTYPE_NAME || '',
          mrp: styleData.MRP ? styleData.MRP.toString() : '',
          rate: styleData.SSP ? styleData.SSP.toString() : '',
          // Set shade to first selected shade
          shade: selectedShades.length > 0 ? selectedShades[0] : ''
        }));
        
        if (styleData.FGPRD_NAME && styleData.FGPRD_KEY) {
          setProductMapping(prev => ({
            ...prev,
            [styleData.FGPRD_NAME]: styleData.FGPRD_KEY
          }));
        }
        
        if ((styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME) && styleData.FGSTYLE_ID) {
          setStyleMapping(prev => ({
            ...prev,
            [styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME]: styleData.FGSTYLE_ID
          }));
        }
        
        if (styleData.FGSTYLE_ID) {
          await fetchTypeData(styleData.FGSTYLE_ID);
          await fetchLotNoData(styleData.FGSTYLE_ID);
        }
        
        // Fetch size details automatically
        await fetchSizeDetailsForStyle(styleData);
      }
    }
  } catch (error) {
    console.error('Error fetching style data by code:', error);
  } finally {
    setIsLoadingStyleCode(false);
  }
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
      
      // Build shade mapping
      const shadeMap = {};
      response.data.DATA.forEach(item => {
        if (item.FGSHADE_NAME && item.FGSHADE_KEY) {
          shadeMap[item.FGSHADE_NAME] = item.FGSHADE_KEY;
        }
      });
      setShadeMapping(shadeMap);
      
      setAvailableShades(shades);
      
      // If in allocated mode, auto-select the first shade
      if (mode === 'allocated' && shades.length > 0) {
        const firstShade = shades[0].FGSHADE_NAME;
        setSelectedShades([firstShade]);
        
        // Also update the newItemData shade field
        setNewItemData(prev => ({
          ...prev,
          shade: firstShade
        }));
      } else if (mode === 'all') {
        // For all mode, don't auto-select any shade
        setSelectedShades([]);
      }
      
      return shades;
    } else {
      console.warn('No shades data received');
      setAvailableShades([]);
      setSelectedShades([]);
      return [];
    }
  } catch (error) {
    console.error('Error fetching shades:', error);
    showSnackbar('Error fetching shades', 'error');
    setAvailableShades([]);
    setSelectedShades([]);
    return [];
  }
};

// NEW: Handle shade selection change
const handleShadeSelectionChange = (event) => {
  const {
    target: { value },
  } = event;
  
  setSelectedShades(
    typeof value === 'string' ? value.split(',') : value,
  );
  
  // Update newItemData shade field with first selected shade
  if (value && value.length > 0) {
    const firstShade = typeof value === 'string' ? value.split(',')[0] : value[0];
    setNewItemData(prev => ({
      ...prev,
      shade: firstShade
    }));
  }
};

// NEW: Handle All button click
const handleAllShadesClick = async () => {
  const currentStyleId = styleMapping[newItemData.style] || styleMapping[selectedStyle];
  if (!currentStyleId) {
      showSnackbar('Please select a style first', 'warning');
    return;
  }
  setShadeViewMode('all');
  await fetchShadesForStyle(currentStyleId, 'all');
};

// NEW: Handle Allocated button click
const handleAllocatedShadesClick = async () => {
  const currentStyleId = styleMapping[newItemData.style] || styleMapping[selectedStyle];
  if (!currentStyleId) {
      showSnackbar('Please select a style first', 'warning');
    return;
  }
  setShadeViewMode('allocated');
  await fetchShadesForStyle(currentStyleId, 'allocated');
};

const fetchStyleDataByBarcode = async (barcode) => {
  if (!barcode) return;

  try {
    setIsLoadingBarcode(true);
    setDataSource('barcode');
    
    const payload = {
      "FGSTYLE_ID": "",
      "FGPRD_KEY": "",
      "FGSTYLE_CODE": "",
      "ALT_BARCODE": barcode,
      "FLAG": ""
    };

    const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

    if (response.data.DATA && response.data.DATA.length > 0) {
      const styleData = response.data.DATA[0];
      const originalBarcode = barcode;
      
      // ✅ IMPORTANT: Store FGSTYLE_ID from API response
      const fgstyleId = styleData.FGSTYLE_ID;
      
      if (isAddingNew || isEditingSize) {
        setNewItemData(prev => ({
          ...prev,
          product: styleData.FGPRD_NAME || '',
          style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
          type: styleData.FGTYPE_NAME || '',
          mrp: styleData.MRP ? styleData.MRP.toString() : '',
          rate: styleData.SSP ? styleData.SSP.toString() : '',
          barcode: originalBarcode,
          shade: '',
          
          fgstyleId: fgstyleId
        }));
        
       
        if ((styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME) && fgstyleId) {
          setStyleMapping(prev => ({
            ...prev,
            [styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME]: fgstyleId
          }));
        }
        
        setBarcodeInput(originalBarcode);
        
        if (styleData.FGPRD_NAME && styleData.FGPRD_KEY) {
          setProductMapping(prev => ({
            ...prev,
            [styleData.FGPRD_NAME]: styleData.FGPRD_KEY
          }));
        }
        
        if (fgstyleId) {
          await fetchTypeData(fgstyleId);
          await fetchLotNoData(fgstyleId);
          await fetchShadesForStyle(fgstyleId, 'allocated');
        }
        
        // Fetch size details with FGSTYLE_ID
        await fetchSizeDetailsForStyle(styleData, originalBarcode);
      }
    } else {
      showSnackbar("No style found for this barcode", 'warning');
    }
  } catch (error) {
    console.error('Error fetching style data by barcode:', error);
    showSnackbar('Error loading barcode data', 'error');
  } finally {
    setIsLoadingBarcode(false);
  }
};

const isBarcodeAlreadyAdded = (barcode) => {
  return tableData.some(item => item.BarCode === barcode);
};

const fetchSizeDetailsForStyle = async (styleData, barcodeValue = null) => {
  try {
    const fgprdKey = styleData.FGPRD_KEY;
    const fgstyleId = styleData.FGSTYLE_ID;
    const fgtypeKey = styleData.FGTYPE_KEY || "";
    const fgshadeKey = styleData.FGSHADE_KEY || "";
    const fgptnKey = styleData.FGPTN_KEY || "";
    
    const actualBarcode = barcodeValue || newItemData.barcode || barcodeInput || "";

    if (!fgprdKey || !fgstyleId) {
      return;
    }

    // Get values from localStorage
    const cobrId = companyConfig.COBR_ID || localStorage.getItem('COBR_ID') || '02';
    const fcyrKey = localStorage.getItem('FCYR_KEY') || '25';
    const coId = localStorage.getItem('CO_ID') || '02';
    const clientId = localStorage.getItem('CLIENT_ID') || '5102';

    // Get STYCATRT_ID
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
      "COBR_ID": cobrId,
      "FCYR_KEY": fcyrKey,
      "CLIENT_ID": clientId,
      "CO_ID": coId
    };

    const stycatrtResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', stycatrtPayload);

    let stycatrtId = 0;
    if (stycatrtResponse.data.DATA && stycatrtResponse.data.DATA.length > 0) {
      stycatrtId = stycatrtResponse.data.DATA[0].STYCATRT_ID || 0;
    }

    // Get size details with FLAG: "GETPACKbARC2"
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
      "COBR_ID": cobrId,
      "FCYR_KEY": fcyrKey,
      "STYSTKDTL_ID": 0,
      "BARCODE": actualBarcode,  
      "FGITM_KEY": "",
      "STYSTK_KEY": "",
      "ORDBKSTY_ID": 0,
      "CLIENT_ID": clientId,
      "CO_ID": coId,
      "FLAG": "GETPACKbARC2"  
    };

    const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', sizeDetailsPayload);

    if (response.data.DATA && response.data.DATA.length > 0) {
      // 🔥 FIX: Auto-set QTY = 1 and validate against CL_QTY
      const transformedSizeDetails = response.data.DATA.map((size, index) => {
        const clQty = parseFloat(size.CL_QTY) || 0;
        let autoQty = 0;
        
        // Only set auto QTY = 1 if there's available stock
        if (clQty > 0) {
          autoQty = 1;
        }
        
        return {
          STYSIZE_ID: size.STYSIZE_ID || index + 1,
          STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
          FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
          QTY: autoQty,  // Auto-set to 1 if stock available
          ITM_AMT: autoQty * (parseFloat(styleData.SSP) || 0),
          ORDER_QTY: autoQty,
          MRP: parseFloat(styleData.MRP) || 0,
          RATE: parseFloat(styleData.SSP) || 0,
          CL_QTY: clQty,  // Available stock
          PORD_QTY: parseFloat(size.PORD_QTY) || 0,
          BAL_QTY: parseFloat(size.BAL_QTY) || 0,
          ISU_QTY: parseFloat(size.ISU_QTY) || 0,
          STYSTKDTL_ID: size.STYSTKDTL_ID || 0,
          BARCODE: actualBarcode
        };
      });

      setSizeDetailsData(transformedSizeDetails);

      setNewItemData(prev => ({
        ...prev,
        stycatrtId: stycatrtId,
        barcode: actualBarcode
      }));

      setIsSizeDetailsLoaded(true);
      
      // Show warning for sizes with zero stock
      const zeroStockSizes = transformedSizeDetails.filter(size => size.CL_QTY === 0);
      if (zeroStockSizes.length > 0) {
        showSnackbar(`⚠️ Warning: ${zeroStockSizes.length} size(s) have no stock!`, 'warning');
      } else {
        showSnackbar(`Size details loaded with default QTY=1 for each size!`, 'success');
      }
      
      // ✅ Automatically confirm add after auto-setting quantities
      // Small delay to ensure state is updated
      setTimeout(() => {
        // Check if any size has quantity > 0
        const sizesWithQty = transformedSizeDetails.filter(size => size.QTY > 0);
        if (sizesWithQty.length > 0) {
          handleConfirmAdd();
        } else {
          showSnackbar("No sizes available with stock! Cannot add item.", 'error');
        }
      }, 100);
      
    } else {
      setSizeDetailsData([]);
      setIsSizeDetailsLoaded(false);
      showSnackbar("No size details found for this barcode", 'warning');
    }
  } catch (error) {
    console.error('Error auto-fetching size details:', error);
    setIsSizeDetailsLoaded(false);
    showSnackbar('Error loading size details', 'error');
  }
};

  // Fetch Type dropdown data
  const fetchTypeData = async (fgstyleId) => {
    if (!fgstyleId) return;

    try {
      const payload = {
        "FGSTYLE_ID": fgstyleId,
        "FLAG": ""
      };

      const response = await axiosInstance.post('/FgType/GetFgTypeDrp', payload);

      if (response.data.DATA) {
        const types = response.data.DATA.map(item => item.FGTYPE_NAME || '');
        setTypeOptions(types);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.FGTYPE_NAME && item.FGTYPE_KEY) {
            mapping[item.FGTYPE_NAME] = item.FGTYPE_KEY;
          }
        });
        setTypeMapping(mapping);
      } else {
        setTypeOptions([]);
        setTypeMapping({});
      }
    } catch (error) {
      console.error('Error fetching type data:', error);
      setTypeOptions([]);
      setTypeMapping({});
    }
  };

  // Fetch Shade dropdown data
  const fetchShadeData = async (fgstyleId) => {
    if (!fgstyleId) return;

    try {
      const payload = {
        "FGSTYLE_ID": fgstyleId,
        "FLAG": ""
      };

      const response = await axiosInstance.post('/Fgshade/GetFgshadedrp', payload);

      if (response.data.DATA) {
        const shades = response.data.DATA.map(item => item.FGSHADE_NAME || '');
        setShadeOptions(shades);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.FGSHADE_NAME && item.FGSHADE_KEY) {
            mapping[item.FGSHADE_NAME] = item.FGSHADE_KEY;
          }
        });
        setShadeMapping(mapping);
      } else {
        setShadeOptions([]);
        setShadeMapping({});
      }
    } catch (error) {
      console.error('Error fetching shade data:', error);
      setShadeOptions([]);
      setShadeMapping({});
    }
  };

  // Fetch Lot No dropdown data
  const fetchLotNoData = async (fgstyleId) => {
    if (!fgstyleId) return;

    try {
      const payload = {
        "FGSTYLE_ID": fgstyleId,
        "FLAG": ""
      };

      const response = await axiosInstance.post('/Fgptn/GetFgptnDrp', payload);

      if (response.data.DATA) {
        const lotNos = response.data.DATA.map(item => item.FGPTN_NAME || '');
        setLotNoOptions(lotNos);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.FGPTN_NAME && item.FGPTN_KEY) {
            mapping[item.FGPTN_NAME] = item.FGPTN_KEY;
          }
        });
        setLotNoMapping(mapping);
      } else {
        setLotNoOptions([]);
        setLotNoMapping({});
      }
    } catch (error) {
      console.error('Error fetching lot no data:', error);
      setLotNoOptions([]);
      setLotNoMapping({});
    }
  };

  const consolidateItemsByStyle = (items) => {
  const styleMap = new Map();
  
  items.forEach(item => {
    const key = `${item.product}-${item.style}-${item.type || ''}-${item.lotNo || ''}`;
    
    if (styleMap.has(key)) {
      // Consolidate quantities and amounts
      const existing = styleMap.get(key);
      existing.qty = (parseFloat(existing.qty) || 0) + (parseFloat(item.qty) || 0);
      existing.amount = (parseFloat(existing.amount) || 0) + (parseFloat(item.amount) || 0);
      existing.netAmt = (parseFloat(existing.netAmt) || 0) + (parseFloat(item.netAmt) || 0);
      
      // Merge size details
      if (item.originalData?.ORDBKSTYSZLIST) {
        existing.originalData.ORDBKSTYSZLIST = [
          ...(existing.originalData.ORDBKSTYSZLIST || []),
          ...item.originalData.ORDBKSTYSZLIST
        ];
      }
    } else {
      styleMap.set(key, { ...item });
    }
  });
  
  return Array.from(styleMap.values());
};

const fetchSizeDetails = async () => {
  if (!newItemData.product || !newItemData.style) {
    showSnackbar("Please select Product and Style first", 'error');
    return;
  }

  try {
    const fgprdKey = productMapping[newItemData.product];
    const fgstyleId = styleMapping[newItemData.style];
    const fgtypeKey = typeMapping[newItemData.type] || "";
    const fgshadeKey = shadeMapping[newItemData.shade] || "";
    const fgptnKey = lotNoMapping[newItemData.lotNo] || "";

    if (!fgprdKey || !fgstyleId) {
      return;
    }

    const cobrId = companyConfig.COBR_ID || localStorage.getItem('COBR_ID') || '02';
    const fcyrKey = localStorage.getItem('FCYR_KEY') || '25';
    const coId = localStorage.getItem('CO_ID') || '02';
    const clientId = localStorage.getItem('CLIENT_ID') || '5102';

    // Get STYCATRT_ID
    const stycatrtPayload = {
      "FGSTYLE_ID": fgstyleId,
      "FGPRD_KEY": fgprdKey,
      "FGTYPE_KEY": fgtypeKey,
      "FGSHADE_KEY": fgshadeKey,
      "FGPTN_KEY": fgptnKey,
      "FLAG": "GETSTYCATRTID",
      "MRP": parseFloat(newItemData.mrp) || 0,
      "PARTY_KEY": formData.PARTY_KEY || "",
      "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
      "COBR_ID": cobrId,
      "FCYR_KEY": fcyrKey,
      "CLIENT_ID": clientId,
      "CO_ID": coId
    };

    const stycatrtResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', stycatrtPayload);

    let stycatrtId = 0;
    if (stycatrtResponse.data.DATA && stycatrtResponse.data.DATA.length > 0) {
      stycatrtId = stycatrtResponse.data.DATA[0].STYCATRT_ID || 0;
    }

    // Get size details
    const sizeDetailsPayload = {
      "FGSTYLE_ID": fgstyleId,
      "FGPRD_KEY": fgprdKey,
      "FGTYPE_KEY": fgtypeKey,
      "FGSHADE_KEY": fgshadeKey,
      "FGPTN_KEY": fgptnKey,
      "MRP": parseFloat(newItemData.mrp) || 0,
      "SSP": parseFloat(newItemData.rate) || 0,
      "PARTY_KEY": formData.PARTY_KEY || "",
      "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
      "COBR_ID": cobrId,
      "FCYR_KEY": fcyrKey,
      "STYSTKDTL_ID": 0,
      "BARCODE": "",
      "FGITM_KEY": "",
      "STYSTK_KEY": "",
      "ORDBKSTY_ID": 0,
      "CLIENT_ID": clientId,
      "CO_ID": coId,
      "FLAG": ""
    };

    const sizeDetailsResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', sizeDetailsPayload);

    if (sizeDetailsResponse.data.DATA && sizeDetailsResponse.data.DATA.length > 0) {
      // 🔥 FIX: Use CL_QTY from API response
      const transformedSizeDetails = sizeDetailsResponse.data.DATA.map((size, index) => ({
        STYSIZE_ID: size.STYSIZE_ID || index + 1,
        STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
        FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
        QTY: 0,
        ITM_AMT: 0,
        ORDER_QTY: 0,
        MRP: parseFloat(newItemData.mrp) || 0,
        RATE: parseFloat(newItemData.rate) || 0,
        CL_QTY: parseFloat(size.CL_QTY) || 0,  // ✅ Use CL_QTY
        PORD_QTY: parseFloat(size.PORD_QTY) || 0
      }));

      setSizeDetailsData(transformedSizeDetails);

      setNewItemData(prev => ({
        ...prev,
        stycatrtId: stycatrtId
      }));

      setIsSizeDetailsLoaded(true);
      showSnackbar(`Size details loaded successfully. STYCATRT_ID: ${stycatrtId}`, 'success');
    } else {
      showSnackbar("No size details found for the selected combination.", 'warning');
      setSizeDetailsData([]);
      setIsSizeDetailsLoaded(false);
    }
  } catch (error) {
    console.error('Error fetching size details:', error);
    showSnackbar("Error loading size details. Please try again.", 'error');
    setIsSizeDetailsLoaded(false);
  }
};
  // Handle style code text input change with debounce
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

const handleBarcodeInputChange = (e) => {
  const value = e.target.value;
  setBarcodeInput(value);
  
  if (isAddingNew || isEditingSize) {
    setNewItemData(prev => ({
      ...prev,
      barcode: value
    }));
  }
  
  if (barcodeTimeoutRef.current) {
    clearTimeout(barcodeTimeoutRef.current);
  }
  
  if (value && value.trim() !== '') {
    barcodeTimeoutRef.current = setTimeout(() => {
      // Check for duplicate (optional warning)
      if (isBarcodeAlreadyAdded(value.trim()) && isContinuousAddMode) {
        // showSnackbar(`Warning: Barcode ${value} already exists in order. Adding another entry.`, 'warning');
      }
      
      // Check if we're already processing this barcode
      if (lastProcessedBarcodeRef.current === value.trim() && isProcessingBarcodeRef.current) {
        console.log('Already processing this barcode:', value);
        return;
      }
      
      // Always try to auto-add if in continuous add mode
      if (isContinuousAddMode && hasCachedQuantities(value.trim())) {
        console.log('Found cached quantities for barcode:', value);
        loadFromCacheAndAddToTable(value.trim());
      } else if (hasCachedQuantities(value.trim())) {
        console.log('Found cached quantities for barcode:', value);
        loadFromCacheAndAddToTable(value.trim());
      } else {
        console.log('No cached quantities for barcode, fetching from API');
        fetchStyleDataByBarcode(value.trim());
      }
    }, 500);
  }
};

const loadFromCacheAndAddToTable = async (barcode) => {
  if (isProcessingBarcodeRef.current) return;
  
  isProcessingBarcodeRef.current = true;
  lastProcessedBarcodeRef.current = barcode;
  
  try {
    const cachedData = barcodeCache[barcode];
    if (!cachedData) {
      console.log('No cached data found');
      isProcessingBarcodeRef.current = false;
      return;
    }
    
    // ✅ Get FGSTYLE_ID from cached data or fetch from API
    let fgstyleId = cachedData.fgstyleId || styleMapping[cachedData.style];
    
    // If still no ID, fetch from API
    if (!fgstyleId && cachedData.style) {
      try {
        const payload = {
          "FGSTYLE_ID": "",
          "FGPRD_KEY": "",
          "FGSTYLE_CODE": cachedData.style,
          "FLAG": ""
        };
        const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);
        if (response.data.DATA && response.data.DATA.length > 0) {
          fgstyleId = response.data.DATA[0].FGSTYLE_ID;
        }
      } catch (error) {
        console.error('Error fetching FGSTYLE_ID:', error);
      }
    }
    
    // ✅ Fetch fresh size details from API to get updated CL_QTY
    let freshSizeDetails = null;
    if (fgstyleId) {
      freshSizeDetails = await fetchFreshSizeDetailsForBarcode(barcode, fgstyleId);
    }
    
    let finalSizeDetails = [];
    let remainingStockMap = {};
    
    if (freshSizeDetails && freshSizeDetails.length > 0) {
      // ✅ Calculate total previously ordered quantity for this barcode
      const totalOrderedForBarcode = getTotalOrderedQuantityForBarcode(barcode);
      
      // ✅ Calculate remaining stock after previous orders
      remainingStockMap = {};
      freshSizeDetails.forEach(size => {
        const originalClQty = size.CL_QTY || 0;
        const remainingQty = Math.max(0, originalClQty - totalOrderedForBarcode);
        remainingStockMap[size.STYSIZE_NAME] = remainingQty;
      });
      
      // ✅ Prepare size details with auto QTY = 1 (if stock available)
      finalSizeDetails = cachedData.sizes.map(size => {
        const remainingQty = remainingStockMap[size.STYSIZE_NAME] || 0;
        // Auto-set QTY = 1 if remaining stock >= 1, otherwise 0
        const autoQty = remainingQty >= 1 ? 1 : 0;
        
        return {
          STYSIZE_ID: size.STYSIZE_ID,
          STYSIZE_NAME: size.STYSIZE_NAME,
          QTY: autoQty,
          ITM_AMT: autoQty * (parseFloat(cachedData.rate) || 0),
          ORDER_QTY: autoQty,
          MRP: parseFloat(cachedData.mrp) || 0,
          RATE: parseFloat(cachedData.rate) || 0,
          CL_QTY: remainingQty,
          FG_QTY: remainingQty,
          PORD_QTY: 0,
          BAL_QTY: remainingQty,
          ISU_QTY: 0,
          BARCODE: barcode
        };
      });
      
      // Check if any size has auto quantity set
      const sizesWithQty = finalSizeDetails.filter(size => size.QTY > 0);
      if (sizesWithQty.length === 0) {
        showSnackbar(`❌ No remaining stock available for barcode: ${barcode}. Cannot add item.`, 'error');
        isProcessingBarcodeRef.current = false;
        return;
      }
      
      // Show warning if stock is low
      const lowStockSizes = finalSizeDetails.filter(size => size.CL_QTY < 10 && size.CL_QTY > 0);
      if (lowStockSizes.length > 0) {
        showSnackbar(`⚠️ Low stock warning for ${lowStockSizes.length} size(s)`, 'warning');
      }
      
    } else {
      // Fallback: Use cached data with auto QTY=1
      finalSizeDetails = cachedData.sizes.map(size => {
        const clQty = size.CL_QTY || 0;
        const autoQty = clQty >= 1 ? 1 : 0;
        
        return {
          STYSIZE_ID: size.STYSIZE_ID,
          STYSIZE_NAME: size.STYSIZE_NAME,
          QTY: autoQty,
          ITM_AMT: autoQty * (parseFloat(cachedData.rate) || 0),
          ORDER_QTY: autoQty,
          MRP: parseFloat(cachedData.mrp) || 0,
          RATE: parseFloat(cachedData.rate) || 0,
          CL_QTY: clQty,
          FG_QTY: clQty,
          PORD_QTY: 0,
          BAL_QTY: clQty,
          ISU_QTY: 0,
          BARCODE: barcode
        };
      });
    }
    
    // Calculate totals
    const totalQty = finalSizeDetails.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
    const rate = parseFloat(cachedData.rate) || 0;
    const totalAmount = finalSizeDetails.reduce((sum, size) => {
      const sizeQty = parseFloat(size.QTY) || 0;
      return sum + (sizeQty * rate);
    }, 0);
    const discount = parseFloat(cachedData.discount) || 0;
    const netAmount = totalAmount - discount;
    
    const tempId = Date.now();
    const barcodeValue = barcode;
    
    // Get mapping keys
    const fgprdKey = productMapping[cachedData.product] || "";
    const fgtypeKey = typeMapping[cachedData.type] || "";
    const fgshadeKey = shadeMapping[cachedData.shade] || "";
    const fgptnKey = lotNoMapping[cachedData.lotNo] || "";
    const stycatrtId = 0;
    
    // Create the item for the table
    const newItem = {
      id: tempId,
      BarCode: barcodeValue,
      orderNo: cachedData.orderNo || '',
      balQty: cachedData.balQty || totalQty,
      orderDate: cachedData.orderDate || '',
      product: cachedData.product,
      style: cachedData.style || "-",
      type: cachedData.type || "-",
      shade: cachedData.shade || "-",
      lotNo: cachedData.lotNo || "-",
      qty: totalQty,
      mrp: parseFloat(cachedData.mrp) || 0,
      rate: rate,
      amount: totalAmount,
      varPer: 0,
      varQty: 0,
      varAmt: 0,
      discAmt: discount,
      netAmt: netAmount,
      distributer: "-",
      set: 0,
      originalData: {
        ORDBKSTY_ID: tempId,
        FGITEM_KEY: barcodeValue,
        ALT_BARCODE: barcodeValue,
        PRODUCT: cachedData.product,
        STYLE: cachedData.style,
        TYPE: cachedData.type || "-",
        SHADE: cachedData.shade || "-",
        PATTERN: cachedData.lotNo || "-",
        ITMQTY: totalQty,
        MRP: parseFloat(cachedData.mrp) || 0,
        ITMRATE: rate,
        ITMAMT: totalAmount,
        DLV_VAR_PERC: 0,
        DLV_VAR_QTY: 0,
        DISC_AMT: discount,
        NET_AMT: netAmount,
        DISTBTR: "-",
        SETQTY: 0,
        ORDBKSTYSZLIST: finalSizeDetails.map(size => ({
          STYSIZE_ID: size.STYSIZE_ID,
          STYSIZE_NAME: size.STYSIZE_NAME,
          QTY: size.QTY,
          ITM_AMT: size.ITM_AMT,
          ORDER_QTY: size.QTY,
          MRP: size.MRP,
          RATE: size.RATE,
          CL_QTY: size.CL_QTY,
          FG_QTY: size.FG_QTY,
          PORD_QTY: size.PORD_QTY,
          BAL_QTY: size.BAL_QTY,
          ISU_QTY: size.ISU_QTY,
          ORDBKSTYSZ_ID: 0,
          DBFLAG: 'I'
        })),
        FGPRD_KEY: fgprdKey,
        FGSTYLE_ID: fgstyleId,
        FGTYPE_KEY: fgtypeKey,
        FGSHADE_KEY: fgshadeKey,
        FGPTN_KEY: fgptnKey,
        STYCATRT_ID: stycatrtId,
        DBFLAG: mode === 'add' ? 'I' : 'I'
      },
      FGSTYLE_ID: fgstyleId,
      FGPRD_KEY: fgprdKey,
      FGTYPE_KEY: fgtypeKey,
      FGSHADE_KEY: fgshadeKey,
      FGPTN_KEY: fgptnKey,
      STYCATRT_ID: stycatrtId,
      ALT_BARCODE: barcodeValue
    };
    
    // Update table data
    setUpdatedTableData(prev => [...prev, newItem]);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      apiResponseData: {
        ...prev.apiResponseData,
        ORDBKSTYLIST: [...(prev.apiResponseData?.ORDBKSTYLIST || []), newItem.originalData]
      }
    }));
    
    // Update cache with remaining stock for future scans
    if (freshSizeDetails && freshSizeDetails.length > 0) {
      const updatedCacheData = {
        ...cachedData,
        sizes: finalSizeDetails.map(size => ({
          STYSIZE_ID: size.STYSIZE_ID,
          STYSIZE_NAME: size.STYSIZE_NAME,
          QTY: size.QTY,
          CL_QTY: size.CL_QTY,
          RATE: size.RATE,
          MRP: size.MRP
        })),
        lastUsed: Date.now()
      };
      
      setBarcodeCache(prev => ({
        ...prev,
        [barcode]: updatedCacheData
      }));
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const updatedCache = {
          ...barcodeCache,
          [barcode]: updatedCacheData
        };
        localStorage.setItem('barcodeQuantityCache', JSON.stringify(updatedCache));
      }
    }
    
    setLastAddedBarcode(barcode);
    setBarcodeInput('');
    
    // Focus back on barcode input for continuous scanning
    setTimeout(() => {
      const barcodeInputElement = document.querySelector('input[name="barcode"]');
      if (barcodeInputElement) {
        barcodeInputElement.value = '';
        barcodeInputElement.focus();
      }
    }, 50);
    
    // showSnackbar(`Added ${cachedData.product} - ${cachedData.style} (Total Qty: ${totalQty})`, 'success');
    
    setTimeout(() => {
      isProcessingBarcodeRef.current = false;
    }, 500);
    
  } catch (error) {
    console.error('Error loading from cache:', error);
    showSnackbar('Error loading cached quantities', 'error');
    isProcessingBarcodeRef.current = false;
  }
};

const fetchFreshSizeDetailsForBarcode = async (barcode, fgstyleId) => {
  try {
    const payload = {
      "FGSTYLE_ID": fgstyleId,
      "FGPRD_KEY": "",
      "FGTYPE_KEY": "",
      "FGSHADE_KEY": "",
      "FGPTN_KEY": "",
      "MRP": 0,
      "SSP": 0,
      "PARTY_KEY": formData.PARTY_KEY || "",
      "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
      "COBR_ID": companyConfig.COBR_ID || localStorage.getItem('COBR_ID') || '02',
      "FCYR_KEY": localStorage.getItem('FCYR_KEY') || '25',
      "STYSTKDTL_ID": 0,
      "BARCODE": barcode,
      "FGITM_KEY": "",
      "STYSTK_KEY": "",
      "ORDBKSTY_ID": 0,
      "CLIENT_ID": localStorage.getItem('CLIENT_ID') || '5102',
      "CO_ID": localStorage.getItem('CO_ID') || '02',
      "FLAG": "GETPACKbARC2"
    };

    const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', payload);
    
    if (response.data.DATA && response.data.DATA.length > 0) {
      return response.data.DATA.map(size => ({
        STYSIZE_ID: size.STYSIZE_ID,
        STYSIZE_NAME: size.STYSIZE_NAME,
        CL_QTY: parseFloat(size.CL_QTY) || 0,
        PORD_QTY: parseFloat(size.PORD_QTY) || 0,
        BAL_QTY: parseFloat(size.BAL_QTY) || 0,
        FG_QTY: parseFloat(size.FG_QTY) || 0,
        ISU_QTY: parseFloat(size.ISU_QTY) || 0,
        QTY: 0
      }));
    }
    return null;
  } catch (error) {
    console.error('Error fetching fresh size details:', error);
    return null;
  }
};


const getTotalOrderedQuantityForBarcode = (barcode) => {
  const orders = tableData.filter(item => item.BarCode === barcode);
  let totalQty = 0;
  orders.forEach(order => {
    const sizeDetails = order.originalData?.ORDBKSTYSZLIST || [];
    totalQty += sizeDetails.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
  });
  return totalQty;
};

  // Handle product selection change
  const handleProductChange = async (event, value) => {
    setSelectedProduct(value);
    setDataSource('dropdown');
    
    if (isAddingNew || isEditingSize) {
      setNewItemData(prev => ({ ...prev, product: value }));
      
      if (value && productMapping[value]) {
        const fgprdKey = productMapping[value];
        await fetchStyleData(fgprdKey);
        
        setNewItemData(prev => ({ 
          ...prev, 
          style: '',
          type: '',
          shade: '',
          lotNo: ''
        }));
        setTypeOptions([]);
        setShadeOptions([]);
        setLotNoOptions([]);
        setSizeDetailsData([]);
        setIsSizeDetailsLoaded(false);
      } else {
        setStyleOptions([]);
        setTypeOptions([]);
        setShadeOptions([]);
        setLotNoOptions([]);
        setSizeDetailsData([]);
        setIsSizeDetailsLoaded(false);
      }
    }
  };

  // Handle style selection change
  const handleStyleChange = async (event, value) => {
    setSelectedStyle(value);
    setDataSource('dropdown');
    
    if (isAddingNew || isEditingSize) {
      setNewItemData(prev => ({ ...prev, style: value }));
      
      setNewItemData(prev => ({ 
        ...prev, 
        type: '',
        shade: '',
        lotNo: ''
      }));
      setTypeOptions([]);
      setShadeOptions([]);
      setLotNoOptions([]);
      setSizeDetailsData([]);
      setIsSizeDetailsLoaded(false);
      
      if (value && styleMapping[value]) {
        const fgstyleId = styleMapping[value];
        
        const payload = {
          "FGSTYLE_ID": fgstyleId,
          "FGPRD_KEY": "",
          "FGSTYLE_CODE": value,
          "FLAG": ""
        };

        try {
          const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);

          if (response.data.DATA && response.data.DATA.length > 0) {
            const styleData = response.data.DATA[0];
            
            setNewItemData(prev => ({
              ...prev,
              mrp: styleData.MRP ? styleData.MRP.toString() : '',
              rate: styleData.SSP ? styleData.SSP.toString() : '',
              type: styleData.FGTYPE_NAME || ''
            }));
          }
        } catch (error) {
          console.error('Error fetching style details:', error);
        }
        
        await fetchTypeData(fgstyleId);
        await fetchShadeData(fgstyleId);
        await fetchLotNoData(fgstyleId);
      }
    }
  };

  // Handle type selection change
  const handleTypeChange = (event, value) => {
    if (isAddingNew || isEditingSize) {
      setNewItemData(prev => ({ ...prev, type: value }));
      setSizeDetailsData([]);
      setIsSizeDetailsLoaded(false);
    }
  };

  // Handle shade selection change
  const handleShadeChange = (event, value) => {
    if (isAddingNew || isEditingSize) {
      setNewItemData(prev => ({ ...prev, shade: value }));
      setSizeDetailsData([]);
      setIsSizeDetailsLoaded(false);
    }
  };

  // Handle lot no selection change
  const handleLotNoChange = (event, value) => {
    if (isAddingNew || isEditingSize) {
      setNewItemData(prev => ({ ...prev, lotNo: value }));
      setSizeDetailsData([]);
      setIsSizeDetailsLoaded(false);
    }
  };

  // Handle row click
  const handleRowClick = (row) => {
    setSelectedRow(row.id);
    
    const sizeDetails = row.originalData?.ORDBKSTYSZLIST || [];
    setSizeDetailsData(sizeDetails);

    if (isEditingSize) {
      populateFormFields(row);
    }
  };

  const populateFormFields = (row) => {
  setEditingRowData(row);
  
  const totalSizeQty = row.originalData?.ORDBKSTYSZLIST?.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0) || row.qty;
  const convFact = totalSizeQty / (parseFloat(row.qty) || 1);
  
  setNewItemData({
    product: row.product || '',
    barcode: row.BarCode || '',
    style: row.style || '',
    type: row.type || '',
    shade: row.shade || '',
    qty: row.qty?.toString() || '',
    mrp: row.mrp?.toString() || '',
    rate: row.rate?.toString() || '',
    setNo: '',
    varPer: row.varPer?.toString() || '',
    stdQty: '',
    convFact: convFact.toString() || '1',
    lotNo: row.lotNo || '',
    discount: row.discAmt?.toString() || '',
    percent: '',
    remark: '',
    divDt: '',
    rQty: '',
    sets: row.set?.toString() || ''
  });
  
  // Also update style code and barcode input fields
  setStyleCodeInput(row.style || '');
  setBarcodeInput(row.BarCode || '');
};

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItemData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isPartySelected = () => {
    return !!formData.Party && !!formData.PARTY_KEY;
  };

  const handleAddItem = async () => {
  if (!isPartySelected()) {
    showSnackbar("Please select a Party first before adding items", 'error');
    return;
  }

  // Enable continuous add mode
  setIsContinuousAddMode(true);
  setIsAddingNew(true);
  setSizeDetailsData([]);
  setIsSizeDetailsLoaded(false);
  setDataSource(null);
  
  await fetchProductData();
  
  setNewItemData({
    product: '',
    barcode: '',
    style: '',
    type: '',
    shade: '',
    qty: '',
    mrp: '',
    rate: '',
    setNo: '',
    varPer: '',
    stdQty: '',
    convFact: '',
    lotNo: '',
    discount: '',
    percent: '',
    remark: '',
    divDt: '',
    rQty: '',
    sets: ''
  });
  
  setStyleCodeInput('');
  setBarcodeInput('');
  setStyleOptions([]);
  setTypeOptions([]);
  setShadeOptions([]);
  setLotNoOptions([]);
  
  // Clear last added barcode
  setLastAddedBarcode(null);
  
  // Focus on barcode input
  setTimeout(() => {
    const barcodeInput = document.querySelector('input[name="barcode"]');
    if (barcodeInput) {
      barcodeInput.focus();
    }
  }, 100);
};

  // Add this useEffect in Stepper2.js to sync table data to formData
useEffect(() => {
  if (updatedTableData.length > 0 && !isAddingNew && !isEditingSize) {
    // Sync updatedTableData to formData.apiResponseData.ORDBKSTYLIST
    const syncedItems = updatedTableData.map(item => ({
      ORDBKSTY_ID: item.id,
      FGITEM_KEY: item.BarCode,
      ALT_BARCODE: item.ALT_BARCODE || item.BarCode,
      PRODUCT: item.product,
      STYLE: item.style,
      TYPE: item.type,
      SHADE: item.shade,
      PATTERN: item.lotNo,
      ITMQTY: item.qty,
      MRP: item.mrp,
      ITMRATE: item.rate,
      ITMAMT: item.amount,
      DLV_VAR_PERC: item.varPer || 0,
      DLV_VAR_QTY: item.varQty || 0,
      DISC_AMT: item.discAmt || 0,
      NET_AMT: item.netAmt || item.amount,
      DISTBTR: item.distributer || "-",
      SETQTY: item.set || 0,
      ORDBKSTYSZLIST: item.originalData?.ORDBKSTYSZLIST || [],
      FGSTYLE_ID: item.FGSTYLE_ID,
      FGPRD_KEY: item.FGPRD_KEY,
      FGTYPE_KEY: item.FGTYPE_KEY,
      FGSHADE_KEY: item.FGSHADE_KEY,
      FGPTN_KEY: item.FGPTN_KEY,
      DBFLAG: item.originalData?.DBFLAG || (mode === 'add' ? 'I' : 'U')
    }));
    
    setFormData(prev => ({
      ...prev,
      apiResponseData: {
        ...prev.apiResponseData,
        ORDBKSTYLIST: syncedItems
      }
    }));
  }
}, [updatedTableData, isAddingNew, isEditingSize, mode, setFormData]);

const handleConfirmAdd = () => {
  // Validation
  if (!newItemData.product || !newItemData.style) {
    showSnackbar("Please fill required fields: Product and Style", 'error');
    return;
  }

  if (sizeDetailsData.length === 0) {
    showSnackbar("Please load size details first", 'error');
    return;
  }

  // At least one size should have quantity > 0
  const sizesWithQty = sizeDetailsData.filter(size => size.QTY && size.QTY > 0);
  if (sizesWithQty.length === 0) {
    showSnackbar("Please enter quantity for at least one size before confirming", 'error');
    return;
  }

  // SAVE TO CACHE - Store quantities for this barcode
  const barcodeValue = newItemData.barcode || barcodeInput;
  if (barcodeValue && barcodeValue.trim() !== '') {
    saveBarcodeQuantities(barcodeValue.trim(), sizesWithQty);
    showSnackbar(`Quantities saved for barcode: ${barcodeValue}`, 'success');
  }

  const fgprdKey = productMapping[newItemData.product] || productMapping[newItemData.style] || "";
  const fgstyleId = styleMapping[newItemData.style] || "";
  const stycatrtId = newItemData.stycatrtId || 0;
    
  const totalQty = sizesWithQty.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
  const mrp = parseFloat(newItemData.mrp) || 0;
  const rate = parseFloat(newItemData.rate) || 0;
  const totalAmount = sizesWithQty.reduce((sum, size) => {
    const sizeQty = parseFloat(size.QTY) || 0;
    return sum + (sizeQty * rate);
  }, 0);
  const discount = parseFloat(newItemData.discount) || 0;
  const netAmount = totalAmount - discount;

  const tempId = Date.now();

  const updatedSizeDetails = sizeDetailsData.map(size => ({
    ...size,
    QTY: parseFloat(size.QTY) || 0,
    ITM_AMT: (parseFloat(size.QTY) || 0) * rate,
    ALT_BARCODE: barcodeValue
  }));

  // Create items for EACH selected shade with FULL quantity
  const newItems = selectedShades.map((shade, shadeIndex) => {
    const shadeAmount = totalAmount;
    const shadeQty = totalQty;
    
    const fgshadeKey = shadeMapping[shade] || "";
    const fgtypeKey = typeMapping[newItemData.type] || "";
    const fgptnKey = lotNoMapping[newItemData.lotNo] || "";

    return {
      id: tempId + shadeIndex,
      BarCode: barcodeValue || "-",
      product: newItemData.product,
      style: newItemData.style || "-",
      type: newItemData.type || "-",
      shade: shade || "-",
      lotNo: newItemData.lotNo || "-",
      qty: shadeQty,
      mrp: mrp,
      rate: rate,
      amount: shadeAmount,
      varPer: parseFloat(newItemData.varPer) || 0,
      varQty: 0,
      varAmt: 0,
      discAmt: discount,
      netAmt: netAmount,
      distributer: "-",
      set: parseFloat(newItemData.sets) || 0,
      originalData: {
        ORDBKSTY_ID: tempId + shadeIndex,
        FGITEM_KEY: barcodeValue || "-",
        ALT_BARCODE: barcodeValue || "-",
        PRODUCT: newItemData.product,
        STYLE: newItemData.style,
        TYPE: newItemData.type || "-",
        SHADE: shade || "-",
        PATTERN: newItemData.lotNo || "-",
        ITMQTY: shadeQty,
        MRP: mrp,
        ITMRATE: rate,
        ITMAMT: shadeAmount,
        DLV_VAR_PERC: parseFloat(newItemData.varPer) || 0,
        DLV_VAR_QTY: 0,
        DISC_AMT: discount,
        NET_AMT: netAmount,
        DISTBTR: "-",
        SETQTY: parseFloat(newItemData.sets) || 0,
        ORDBKSTYSZLIST: updatedSizeDetails.map(size => ({
          ...size,
          ORDBKSTYSZ_ID: 0
        })),
        FGPRD_KEY: fgprdKey,
        FGSTYLE_ID: fgstyleId,
        FGTYPE_KEY: fgtypeKey,
        FGSHADE_KEY: fgshadeKey,
        FGPTN_KEY: fgptnKey,
        STYCATRT_ID: stycatrtId,
        DBFLAG: mode === 'add' ? 'I' : 'I'
      },
      FGSTYLE_ID: fgstyleId,
      FGPRD_KEY: fgprdKey,
      FGTYPE_KEY: fgtypeKey,
      FGSHADE_KEY: fgshadeKey,
      FGPTN_KEY: fgptnKey,
      STYCATRT_ID: stycatrtId,
      ALT_BARCODE: barcodeValue
    };
  });

  const finalNewItems = selectedShades.length > 0 ? newItems : [{
    id: tempId,
    BarCode: barcodeValue || "-",
    product: newItemData.product,
    style: newItemData.style || "-",
    type: newItemData.type || "-",
    shade: newItemData.shade || "-",
    lotNo: newItemData.lotNo || "-",
    qty: totalQty,
    mrp: mrp,
    rate: rate,
    amount: totalAmount,
    varPer: parseFloat(newItemData.varPer) || 0,
    varQty: 0,
    varAmt: 0,
    discAmt: discount,
    netAmt: netAmount,
    distributer: "-",
    set: parseFloat(newItemData.sets) || 0,
    originalData: {
      ORDBKSTY_ID: tempId,
      FGITEM_KEY: barcodeValue || "-",
      ALT_BARCODE: barcodeValue || "-",
      PRODUCT: newItemData.product,
      STYLE: newItemData.style,
      TYPE: newItemData.type || "-",
      SHADE: newItemData.shade || "-",
      PATTERN: newItemData.lotNo || "-",
      ITMQTY: totalQty,
      MRP: mrp,
      ITMRATE: rate,
      ITMAMT: totalAmount,
      DLV_VAR_PERC: parseFloat(newItemData.varPer) || 0,
      DLV_VAR_QTY: 0,
      DISC_AMT: discount,
      NET_AMT: netAmount,
      DISTBTR: "-",
      SETQTY: parseFloat(newItemData.sets) || 0,
      ORDBKSTYSZLIST: updatedSizeDetails.map(size => ({
        ...size,
        ORDBKSTYSZ_ID: 0
      })),
      FGPRD_KEY: fgprdKey,
      FGSTYLE_ID: fgstyleId,
      FGTYPE_KEY: typeMapping[newItemData.type] || "",
      FGSHADE_KEY: shadeMapping[newItemData.shade] || "",
      FGPTN_KEY: lotNoMapping[newItemData.lotNo] || "",
      STYCATRT_ID: stycatrtId,
      DBFLAG: mode === 'add' ? 'I' : 'I'
    },
    FGSTYLE_ID: fgstyleId,
    FGPRD_KEY: fgprdKey,
    FGTYPE_KEY: typeMapping[newItemData.type] || "",
    FGSHADE_KEY: shadeMapping[newItemData.shade] || "",
    FGPTN_KEY: lotNoMapping[newItemData.lotNo] || "",
    STYCATRT_ID: stycatrtId,
    ALT_BARCODE: barcodeValue
  }];

  const newTableData = [...tableData, ...finalNewItems];
  setUpdatedTableData(newTableData);

  setFormData(prev => ({
    ...prev,
    apiResponseData: {
      ...prev.apiResponseData,
      ORDBKSTYLIST: [...(prev.apiResponseData?.ORDBKSTYLIST || []), ...finalNewItems.map(item => item.originalData)]
    }
  }));

  // ✅ DON'T close the add form - keep it open for continuous adding
  // Just reset the fields for next item, but keep isAddingNew = true
  setNewItemData({
    product: '',
    barcode: '',
    style: '',
    type: '',
    shade: '',
    qty: '',
    mrp: '',
    rate: '',
    setNo: '',
    varPer: '',
    stdQty: '',
    convFact: '',
    lotNo: '',
    discount: '',
    percent: '',
    remark: '',
    divDt: '',
    rQty: '',
    sets: '',
    stycatrtId: 0
  });
  
  // Clear barcode input
  setBarcodeInput('');
  
  // Clear size details
  setSizeDetailsData([]);
  setIsSizeDetailsLoaded(false);
  
  // Clear selected shades
  setSelectedShades([]);
  
  // Reset the data source
  setDataSource(null);
  
  // ✅ Keep isAddingNew as true for continuous adding
  // setIsAddingNew(false); // DON'T DO THIS - Remove this line
  
  // Reset items confirmed flag
  setItemsConfirmed(false);
  
  // Show success message
  showSnackbar(selectedShades.length > 1 ? 
    `${selectedShades.length} items added to order (${totalQty} each)! Ready for next scan` : 
    "Item added successfully! Ready for next barcode");
  
  // ✅ Focus back on barcode input for next scan
  setTimeout(() => {
    const barcodeInputElement = document.querySelector('input[name="barcode"]');
    if (barcodeInputElement) {
      barcodeInputElement.value = '';
      barcodeInputElement.focus();
    }
  }, 50);
};

  const handleEditItem = () => {
  if (!selectedRow) {
    showSnackbar("Please select an item to edit", 'error');
    return;
  }
  
  if (isEditingSize) {
    // SAVE CHANGES LOGIC
    const updatedTable = tableData.map(row => {
      if (row.id === selectedRow) {
        const totalSizeQty = sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
        const rate = parseFloat(newItemData.rate) || 0;
        const amount = sizeDetailsData.reduce((sum, size) => {
          const sizeQty = parseFloat(size.QTY) || 0;
          return sum + (sizeQty * rate);
        }, 0);
        const discount = parseFloat(newItemData.discount) || 0;
        const netAmount = amount - discount;

        const originalDbFlag = row.originalData?.DBFLAG || 'U';

        return {
          ...row,
          qty: totalSizeQty,
          mrp: parseFloat(newItemData.mrp) || 0,
          rate: rate,
          amount: amount,
          discAmt: discount,
          netAmt: netAmount,
          originalData: {
            ...row.originalData,
            ORDBKSTYSZLIST: sizeDetailsData,
            ITMQTY: totalSizeQty,
            MRP: parseFloat(newItemData.mrp) || 0,
            ITMRATE: rate,
            ITMAMT: amount,
            DISC_AMT: discount,
            NET_AMT: netAmount,
            DBFLAG: originalDbFlag
          }
        };
      }
      return row;
    });
    
    setUpdatedTableData(updatedTable);
    
    setFormData(prev => ({
      ...prev,
      apiResponseData: {
        ...prev.apiResponseData,
        ORDBKSTYLIST: prev.apiResponseData?.ORDBKSTYLIST?.map(item => {
          if (item.ORDBKSTY_ID === selectedRow) {
            const totalSizeQty = sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
            const rate = parseFloat(newItemData.rate) || 0;
            const amount = sizeDetailsData.reduce((sum, size) => {
              const sizeQty = parseFloat(size.QTY) || 0;
              return sum + (sizeQty * rate);
            }, 0);
            const discount = parseFloat(newItemData.discount) || 0;
            const netAmount = amount - discount;

            const originalDbFlag = item.DBFLAG || 'U';

            return {
              ...item,
              ITMQTY: totalSizeQty,
              MRP: parseFloat(newItemData.mrp) || 0,
              ITMRATE: rate,
              ITMAMT: amount,
              DISC_AMT: discount,
              NET_AMT: netAmount,
              ORDBKSTYSZLIST: sizeDetailsData,
              DBFLAG: originalDbFlag
            };
          }
          return item;
        }) || []
      }
    }));
    
    setIsEditingSize(false);
    setIsSizeDetailsLoaded(false);
    showSnackbar("Changes saved successfully!");
  } else {
    // ENTERING EDIT MODE: Populate form fields with selected row data
    const selectedRowData = tableData.find(row => row.id === selectedRow);
    if (selectedRowData) {
      // First populate form fields
      populateFormFields(selectedRowData);
      
      // Then fetch size details for the selected item
      const sizeDetails = selectedRowData.originalData?.ORDBKSTYSZLIST || [];
      setSizeDetailsData(sizeDetails);
      setIsSizeDetailsLoaded(true); // Mark size details as loaded
      
      // Set editing mode to true
      setIsEditingSize(true);
      
      // Set data source to indicate we're loading existing data
      setDataSource('edit');
      
      // Fetch product and style data for dropdowns if needed
      if (selectedRowData.FGPRD_KEY && !productOptions.includes(selectedRowData.product)) {
        // If product not in dropdown, fetch it
        fetchProductData();
      }
      
      if (selectedRowData.FGSTYLE_ID && !styleOptions.includes(selectedRowData.style)) {
        // If style not in dropdown, fetch styles for this product
        if (selectedRowData.FGPRD_KEY) {
          fetchStyleData(selectedRowData.FGPRD_KEY);
        }
      }
      
      // Fetch type, shade, lotNo data for this style
      if (selectedRowData.FGSTYLE_ID) {
        fetchTypeData(selectedRowData.FGSTYLE_ID);
        fetchShadeData(selectedRowData.FGSTYLE_ID);
        fetchLotNoData(selectedRowData.FGSTYLE_ID);
      }
      
      showSnackbar('Edit mode enabled for selected item. Make changes and click Confirm.');
    }
  }
};

  // FIXED: Handle Delete Item (Row immediately removed from table)
  const handleDeleteItem = () => {
    if (!selectedRow) {
      showSnackbar("Please select an item to delete", 'error');
      return;
    }
    
    // Immediately remove from display table
    const updatedTableData = tableData.filter(row => row.id !== selectedRow);
    setUpdatedTableData(updatedTableData);
    
    // Mark as deleted in formData for API
    setFormData(prev => {
      const updatedOrdbkStyleList = (prev.apiResponseData?.ORDBKSTYLIST || []).map(item => {
        if (item.ORDBKSTY_ID === selectedRow) {
          return {
            ...item,
            DBFLAG: 'D',
            ORDBKSTYSZLIST: (item.ORDBKSTYSZLIST || []).map(sizeItem => ({
              ...sizeItem,
              DBFLAG: 'D'
            }))
          };
        }
        return item;
      });
      
      return {
        ...prev,
        apiResponseData: {
          ...prev.apiResponseData,
          ORDBKSTYLIST: updatedOrdbkStyleList
        }
      };
    });

    // Update selected row
    if (updatedTableData.length > 0) {
      const firstRow = updatedTableData[0];
      setSelectedRow(firstRow.id);
      setSizeDetailsData(firstRow.originalData?.ORDBKSTYSZLIST || []);
    } else {
      setSelectedRow(null);
      setSizeDetailsData([]);
      setStyleOptions([]);
      setTypeOptions([]);
      setShadeOptions([]);
      setLotNoOptions([]);
    }

    showSnackbar("Item deleted successfully!");
  };

const handleCancelAdd = () => {
  setIsContinuousAddMode(false);
  setIsAddingNew(false);  // This will exit continuous add mode
  setIsSizeDetailsLoaded(false);
  setNewItemData({
    product: '',
    barcode: '',
    style: '',
    type: '',
    shade: '',
    qty: '',
    mrp: '',
    rate: '',
    setNo: '',
    varPer: '',
    stdQty: '',
    convFact: '',
    lotNo: '',
    discount: '',
    percent: '',
    remark: '',
    divDt: '',
    rQty: '',
    sets: ''
  });
  setStyleCodeInput('');
  setBarcodeInput('');
  setSizeDetailsData([]);
  setDataSource(null);
  setSelectedShades([]);
  setAvailableShades([]);
  setLastAddedBarcode(null);
};

  const handleEditCancel = () => {
    setShowValidationErrors(false);
    setIsEditingSize(false);
    setIsSizeDetailsLoaded(false);
    setNewItemData({
      product: '',
      barcode: '',
      style: '',
      type: '',
      shade: '',
      qty: '',
      mrp: '',
      rate: '',
      setNo: '',
      varPer: '',
      stdQty: '',
      convFact: '',
      lotNo: '',
      discount: '',
      percent: '',
      remark: '',
      divDt: '',
      rQty: '',
      sets: ''
    });
    setStyleCodeInput('');
    setBarcodeInput('');
    setDataSource(null);
  };

 const handleSizeQtyChange = (index, newQty) => {
  const size = sizeDetailsData[index];
  const clQty = size.CL_QTY || 0;  
  const inputQty = parseFloat(newQty) || 0;
  
  
  if (inputQty > clQty) {
    showSnackbar(`❌ Cannot order more than available stock! Maximum allowed: ${clQty} for size "${size.STYSIZE_NAME}"`, 'error');
    return;
  }
  
 
  const updatedSizeDetails = [...sizeDetailsData];
  const rate = parseFloat(newItemData.rate) || 0;
  const amount = inputQty * rate;

  updatedSizeDetails[index] = {
    ...updatedSizeDetails[index],
    QTY: inputQty,
    ITM_AMT: amount,
    ORDER_QTY: inputQty
  };

  setSizeDetailsData(updatedSizeDetails);
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

  const shouldDisableFields = () => {
    return !(isAddingNew || isEditingSize);
  };

  const getFieldError = (fieldName) => {
    if (!showValidationErrors) return '';
    
    const requiredFields = {};

    if (requiredFields[fieldName] && !newItemData[fieldName]) {
      return `${requiredFields[fieldName]} is required`;
    }
    
    if (fieldName === 'qty' && newItemData.qty && parseFloat(newItemData.qty) <= 0) {
      return 'Quantity must be greater than 0';
    }

    return '';
  };

 const columns = [
  { id: 'BarCode', label: 'Barcode', minWidth: 120 },
  { id: 'orderNo', label: 'Order No', minWidth: 100 },
  { id: 'orderDate', label: 'Order Date', minWidth: 80 },
  { id: 'product', label: 'Product', minWidth: 150 },
  { id: 'style', label: 'Style', minWidth: 120 },
  { id: 'type', label: 'Type', minWidth: 80 },
  { id: 'shade', label: 'Shade', minWidth: 80 },
  { id: 'lotNo', label: 'Lot No', minWidth: 80 },
  { id: 'qty', label: 'Qty', minWidth: 70, align: 'right' },
  { id: 'balQty', label: 'Bal Qty', minWidth: 70, align: 'right' },
  { id: 'rate', label: 'Rate', minWidth: 70, align: 'right' },
  { id: 'amount', label: 'Amount', minWidth: 80, align: 'right' },
  { id: 'netAmt', label: 'Net Amt', minWidth: 80, align: 'right' },
  { id: 'set', label: 'Set', minWidth: 60, align: 'right' },
];

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
        {/* Table Section */}
        <Box sx={{ mt: 2 }}>
          <Paper
            elevation={1}
            sx={{
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
            }}
          >
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  {/* Header Row */}
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          padding: "6px 8px",
                          borderBottom: "1px solid #ddd",
                          minWidth: column.minWidth
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Filter Row */}
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={`filter-${column.id}`}
                        align={column.align || 'left'}
                        sx={{
                          backgroundColor: "#f4f8faff",
                          padding: "2px 4px",
                          borderBottom: "1px solid #ddd",
                          minWidth: column.minWidth
                        }}
                      >
                        <TextField
                          size="small"
                          placeholder={`Search ${column.label}`}
                          value={tableFilters[column.id] || ''}
                          onChange={(e) => handleTableFilterChange(column.id, e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'white',
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: 'none',
                              },
                              height: '28px',
                              fontSize: '0.7rem',
                              borderRadius: '4px',
                            },
                            '& .MuiInputBase-input': {
                              padding: '4px 6px',
                              fontSize: '0.7rem',
                            },
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredTableData.length > 0 ? (
                    filteredTableData.map((row, index) => (
                      <TableRow
                        key={row.id}
                        hover
                        onClick={() => handleRowClick(row)}
                        sx={{
                          backgroundColor: selectedRow === row.id ? "#e3f2fd" : (index % 2 === 0 ? "#fafafa" : "#fff"),
                          "&:hover": { backgroundColor: "#e3f2fd", cursor: 'pointer' },
                          border: selectedRow === row.id ? '2px solid #2196f3' : 'none',
                        }}
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align || 'left'}
                            sx={{
                              fontSize: "0.75rem",
                              padding: "6px 8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {column.format && typeof row[column.id] === 'number' 
                              ? column.format(row[column.id])
                              : row[column.id] || "—"
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          {tableData.length === 0 ? 'No items found' : 'No items match your filters'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Filter Controls */}
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
              <Typography variant="body2" color="textSecondary">
                Showing {filteredTableData.length} of {tableData.length} items
              </Typography>
              <Button 
                size="small" 
                onClick={clearAllFilters}
                disabled={Object.values(tableFilters).every(filter => !filter)}
              >
                Clear Filters
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* CRUD Buttons and Totals */}
        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
          <Tooltip 
            title={!isPartySelected() ? "Please select a Party first" : "Add new item"}
            placement="top"
          >
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                disabled={isFormDisabled || isEditingSize || isAddingNew}
                sx={{
                   backgroundColor: '#635bff',
                  color: 'white',
                  margin: { xs: '0 4px', sm: '0 6px' },
                  minWidth: { xs: 40, sm: 46, md: 60 },
                  height: { xs: 40, sm: 46, md: 30 },
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                    color: '#666666'
                  }
                }}
              >
                Add
              </Button>
            </span>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditItem}
             disabled={isFormDisabled || isEditingSize || isAddingNew}
            sx={{
               backgroundColor: '#635bff',
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            {isEditingSize ? 'Edit' : 'Edit'}
          </Button>

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteItem}
            disabled={isFormDisabled || isEditingSize || isAddingNew}
            sx={{
              backgroundColor: '#635bff',
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            Delete
          </Button>

          {/* Totals */}
          <TextField 
            label="Tot Qty" 
            variant="filled" 
            value={formData.TOTAL_QTY || 0} 
            disabled 
            sx={textInputSx} 
            inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
          />
          <TextField 
            label="Tot Amt" 
            variant="filled" 
            value={formData.TOTAL_AMOUNT || 0} 
            disabled 
            sx={textInputSx} 
            inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
          />
          <TextField 
            label="Disc" 
            variant="filled" 
            value={formData.DISCOUNT || 0} 
            disabled 
            sx={textInputSx} 
            inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
          />
          <TextField 
            label="Net" 
            variant="filled" 
            value={formData.NET_AMOUNT || 0} 
            disabled 
            sx={textInputSx} 
            inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
          />
        </Stack>

        {/* Product Details and Size Details */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'flex-start' }}>
          {/* LEFT: Text Fields Section */}
          <Box sx={{ flex: '0 0 60%' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              

             <TextField 
  label="Type barcode Here" 
  variant="filled" 
  disabled={shouldDisableFields()}
  name="barcode"
  value={barcodeInput}
  onChange={handleBarcodeInputChange}
  onKeyPress={(e) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      e.preventDefault();
      if (hasCachedQuantities(barcodeInput.trim())) {
        loadFromCacheAndAddToTable(barcodeInput.trim());
      } else if (barcodeInput.trim()) {
        fetchStyleDataByBarcode(barcodeInput.trim());
      }
    }
  }}
  placeholder="Type or scan barcode"
  sx={textInputSx} 
  inputProps={{ 
    style: { padding: '6px 8px', fontSize: '12px' },
    autoFocus: true
  }}
/>
              
              
             
             
              <TextField 
                label="Type style code Here" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="styleCode"
                value={styleCodeInput}
                onChange={handleStyleCodeInputChange}
                placeholder="Type style code"
                sx={textInputSx} 
                inputProps={{ 
                  style: { padding: '6px 8px', fontSize: '12px' }
                }}
                // helperText={isLoadingStyleCode ? "Loading..." : "Type style code"}
              />

              <AutoVibe
                id="Type"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={typeOptions}
                label="Type"
                name="type"
                value={isAddingNew || isEditingSize ? newItemData.type : ''}
                onChange={handleTypeChange}
                sx={DropInputSx}
              />
             

{/* Shade Selection Section */}
<Box sx={{ 
  display: 'flex', 
  gap: 1,
  alignItems: 'center'
}}>
  <Button
    variant={shadeViewMode === 'all' ? 'contained' : 'outlined'}
    onClick={handleAllShadesClick}
    size="small"
    disabled={shouldDisableFields()}
    sx={{ 
      minWidth: '60px',
      backgroundColor: shadeViewMode === 'all' ? '#1976d2' : 'transparent',
      color: shadeViewMode === 'all' ? 'white' : '#1976d2',
      borderColor: '#1976d2',
      '&:hover': {
        backgroundColor: shadeViewMode === 'all' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
      },
      '&.Mui-disabled': {
        borderColor: '#cccccc',
        color: '#666666',
        backgroundColor: 'transparent'
      }
    }}
  >
    All
  </Button>
  <Button
    variant={shadeViewMode === 'allocated' ? 'contained' : 'outlined'}
    onClick={handleAllocatedShadesClick}
    size="small"
    disabled={shouldDisableFields()}
    sx={{ 
      minWidth: '80px',
      backgroundColor: shadeViewMode === 'allocated' ? '#635bff' : 'transparent',
      color: shadeViewMode === 'allocated' ? 'white' : '#1976d2',
      borderColor: '#1976d2',
      '&:hover': {
        backgroundColor: shadeViewMode === 'allocated' ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
      },
      '&.Mui-disabled': {
        borderColor: '#cccccc',
        color: '#666666',
        backgroundColor: 'transparent'
      }
    }}
  >
    Allocated
  </Button>
</Box>

{/* Shade Multi-Select Dropdown */}
<FormControl sx={{ width: '100%' }}>
  <Select
    labelId="shade-select-label"
    id="shade-select"
    multiple
    value={selectedShades}
    onChange={handleShadeSelectionChange}
    disabled={shouldDisableFields()}
    input={<OutlinedInput />}
    renderValue={(selected) => (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 0.5,
          overflowX: 'auto',
          overflowY: 'hidden',
          maxWidth: '100%',
          alignItems: 'center',
          '&::-webkit-scrollbar': {
            height: '3px',
          },
        }}
      >
        {selected.map((value) => (
          <Chip
            key={value}
            label={value}
            size="small"
            sx={{
              height: '24px',
              fontSize: '0.75rem'
            }}
          />
        ))}
      </Box>
    )}
    size="small"
    sx={{
      '& .MuiOutlinedInput-root': {
        minHeight: '36px',
        padding: '0px',
      },
      '& .MuiSelect-select': {
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      },
    }}
  >
    {availableShades.map((shade) => (
      <MenuItem key={shade.FGSHADE_NAME} value={shade.FGSHADE_NAME}>
        {shade.FGSHADE_NAME}
      </MenuItem>
    ))}
  </Select>
</FormControl>

  


              <TextField 
                label="Qty" 
                variant="filled" 
                disabled={true}
                name="qty"
                value={isAddingNew || isEditingSize ? newItemData.qty : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              
              <TextField 
                label="MRP" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="mrp"
                value={isAddingNew || isEditingSize ? newItemData.mrp : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ 
                  style: { padding: '6px 8px', fontSize: '12px' },
                  type: 'number',
                  step: '0.01',
                  min: '0'
                }} 
              />

              {/* Rate Field (SSP) */}
              <TextField 
                label="Rate" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="rate"
                value={isAddingNew || isEditingSize ? newItemData.rate : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ 
                  style: { padding: '6px 8px', fontSize: '12px' },
                  type: 'number',
                  step: '0.01',
                  min: '0'
                }} 
              />
              <TextField 
                label="Set No" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="setNo"
                value={isAddingNew || isEditingSize ? newItemData.setNo : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              
              <TextField 
                label="Std Qty" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="stdQty"
                value={isAddingNew || isEditingSize ? newItemData.stdQty : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <TextField 
                label="Conv Fact" 
                variant="filled" 
                disabled={true}
                name="convFact"
                value={isAddingNew || isEditingSize ? newItemData.convFact : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <AutoVibe
                id="LotNo"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={lotNoOptions}
                label="Lot No"
                name="lotNo"
                value={isAddingNew || isEditingSize ? newItemData.lotNo : ''}
                onChange={handleLotNoChange}
                sx={DropInputSx}
              />
              <AutoVibe
                id="Discount"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={[]}
                label="Discount"
                name="discount"
                value={isAddingNew || isEditingSize ? newItemData.discount : ''}
                onChange={(event, value) => {
                  if (isAddingNew || isEditingSize) {
                    setNewItemData(prev => ({ ...prev, discount: value }));
                  }
                }}
                sx={DropInputSx}
              />
              <TextField 
                label="Percent" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="percent"
                value={isAddingNew || isEditingSize ? newItemData.percent : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ 
                  style: { padding: '6px 8px', fontSize: '12px' },
                  type: 'number',
                  step: '0.01',
                  min: '0',
                  max: '100'
                }} 
              />
              <TextField 
                label="Remark" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="remark"
                value={isAddingNew || isEditingSize ? newItemData.remark : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Div Dt"
                  value={isAddingNew || isEditingSize ? (newItemData.divDt ? parse(newItemData.divDt, "dd/MM/yyyy", new Date()) : null) : (formData.DIV_DT ? parse(formData.DIV_DT, "dd/MM/yyyy", new Date()) : null)}
                  format="dd/MM/yyyy"
                  disabled={shouldDisableFields()}
                  onChange={(date) => {
                    if (isAddingNew || isEditingSize) {
                      const formattedDate = date ? format(date, "dd/MM/yyyy") : '';
                      setNewItemData(prev => ({ ...prev, divDt: formattedDate }));
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "filled",
                      sx: textInputSx,
                      InputProps: {
                        sx: {
                          height: "32px",
                          padding: "0px",
                          fontSize: "12px",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              <TextField 
                label="RQty" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="rQty"
                value={isAddingNew || isEditingSize ? newItemData.rQty : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ 
                  style: { padding: '6px 8px', fontSize: '12px' },
                  type: 'number',
                  step: '1',
                  min: '0'
                }} 
              />
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <TextField 
    label="Sets" 
    variant="filled" 
    disabled={shouldDisableFields()}
    name="sets"
    value={isAddingNew || isEditingSize ? newItemData.sets : ''}
    onChange={handleNewItemChange}
    sx={{ ...textInputSx, flex: 1 }} 
    inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
  />
  {(isAddingNew || isEditingSize) && (
    <>
      {/* FIXED: Show "Add Qty" only when size details are not loaded AND we're in add mode */}
      {!isSizeDetailsLoaded && isAddingNew && (
        <Button
          variant="contained"
          color="primary"
          onClick={fetchSizeDetails}
          disabled={!newItemData.product || !newItemData.style || dataSource === 'barcode'}
          sx={{ minWidth: '80px', height: '36px' }}
        >
          Add Qty
        </Button>
      )}
      
      
      {(isSizeDetailsLoaded || isEditingSize) && (
        <Button
          variant="contained"
          color="primary"
          onClick={isAddingNew ? handleConfirmAdd : handleEditItem}
          disabled={isAddingNew && sizeDetailsData.length === 0}
          sx={{ minWidth: '80px', height: '36px' }}
        >
          {isAddingNew ? 'Confirm' : 'Confirm'}
        </Button>
      )}
      
      <Button 
  variant="outlined" 
  color="secondary" 
  onClick={() => {
    if (isContinuousAddMode) {
      handleCancelAdd();
    } else if (isAddingNew) {
      handleCancelAdd();
    } else if (isEditingSize) {
      handleEditCancel();
    } else {
      onCancel();
    }
  }}
  // Remove disabled condition for cancel in continuous add mode
  sx={{ 
    minWidth: '60px', 
    height: '36px',
    '&:disabled': {
      borderColor: '#cccccc',
      color: '#666666'
    }
  }}
>
  Cancel
</Button>
    </>
  )}
</Box>
            </Box>
          </Box>

          {/* RIGHT: Size Details Table */}
         <Box sx={{ flex: 1 }}>
            <Box sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              backgroundColor: '#fff',
              p: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="subtitle2" sx={{ display: '', fontWeight: 'bold', mb: 1 }}>
                Size Details {selectedRow && `(for ${tableData.find(row => row.id === selectedRow)?.product || 'Selected Item'})`}
                {isEditingSize && <span style={{ color: 'red', marginLeft: '10px' }}> - Editing Mode</span>}
              </Typography>
              <TableContainer sx={{ width: '100%', height: 270, overflowY: 'auto' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
  <TableRow>
    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Size</TableCell>
    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Qty</TableCell>
    
    {/* नए columns add करें */}
    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Ready Qty</TableCell>
    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Process</TableCell>
    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Order</TableCell>
    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Bal Qty</TableCell>
    
    {/* <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>MRP</TableCell>
    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Rate</TableCell>
    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Amount</TableCell> */}
    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Barcode</TableCell>
  </TableRow>
</TableHead>
                  

<TableBody>
  {sizeDetailsData.length > 0 ? (
    sizeDetailsData.map((size, index) => {
      const clQty = size.CL_QTY || 0;
      const isZeroStock = clQty === 0;
      
      return (
        <TableRow key={index} sx={{
          backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
          "&:hover": { backgroundColor: "#e3f2fd" },
          ...(isZeroStock && { backgroundColor: "#ffebee" })
        }}>
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
            {size.STYSIZE_NAME}
          </TableCell>
          
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
            <TextField
              type="number"
              value={size.QTY}
              onChange={(e) => handleSizeQtyChange(index, e.target.value)}
              size="small"
              sx={{ width: '80px' }}
              inputProps={{ 
                style: { fontSize: '0.75rem', padding: '4px' },
                min: 0,
                max: clQty
              }}
              disabled={!isAddingNew && !isEditingSize || isZeroStock}
              error={isZeroStock}
              title={isZeroStock ? "No stock available for this size" : `Maximum available: ${clQty}`}
            />
          </TableCell>
          
          <TableCell sx={{ 
            fontSize: '0.75rem', 
            padding: '6px 8px',
            color: isZeroStock ? 'red' : clQty < 10 ? 'orange' : 'inherit',
            fontWeight: isZeroStock ? 'bold' : 'normal'
          }}>
            {clQty.toFixed(3)}
            {isZeroStock && <span style={{ marginLeft: '4px', fontSize: '0.7rem', color: 'red' }}>(Out of Stock)</span>}
            {!isZeroStock && clQty < 10 && <span style={{ marginLeft: '4px', fontSize: '0.7rem', color: 'orange' }}>(Low Stock)</span>}
          </TableCell>
          
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
            {((size.PORD_QTY || 0) + (size.ISU_QTY || 0)).toFixed(3)}
          </TableCell>
          
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
            {(size.PORD_QTY || 0).toFixed(3)}
          </TableCell>
          
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
            {(size.BAL_QTY || 0).toFixed(3)}
          </TableCell>
          
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
            {size.BARCODE || "-"}
          </TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={7} align="center" sx={{ py: 1 }}>
        <Typography variant="body2" color="textSecondary">
          {isAddingNew ? 
            (dataSource === 'barcode' ? 
              "Size details auto-loaded! Enter quantities." : 
              "Click 'Add Qty' to load size details") 
            : "No size details available"}
        </Typography>
      </TableCell>
    </TableRow>
  )}
</TableBody>

                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>

        {/* Final Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ m: 3, justifyContent: 'flex-end' }}>
         
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={onPrev}
           
            sx={{ 
              minWidth: '60px', 
              height: '36px',
             backgroundColor: '#635bff',
              color: 'white',
              '&:disabled': {
                borderColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            Previous
          </Button>

         <Button
                     variant="contained"
                     color="primary"
                     onClick={onNext}
                     sx={{
                       minWidth: '60px',
                       height: '36px',
                       textTransform: 'none',
                       backgroundColor: '#635bff',
                       '&:disabled': {
                         backgroundColor: '#cccccc',
                         color: '#666666'
                       },
                       '&:hover': {
                         backgroundColor: '#4e44e0',
                       },
                     }}
                   >
                     Next
                   </Button>
        </Stack>
        
      </Box>
    </Box>
  )
}

export default Stepper3;