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
  Alert
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

const Stepper2 = ({ formData, setFormData, isFormDisabled, mode, onSubmit, onCancel, onNext,onPrev, showSnackbar, showValidationErrors }) => {
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

  // NEW: Track source of data loading
  const [dataSource, setDataSource] = useState(null);
  
  // NEW: State for size details loading
  const [isSizeDetailsLoaded, setIsSizeDetailsLoaded] = useState(false);

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
    BarCode: item.FGITEM_KEY || "-",
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
    FGPTN_KEY: item.FGPTN_KEY || ""
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
        
        if (isAddingNew || isEditingSize) {
          setNewItemData(prev => ({
            ...prev,
            product: styleData.FGPRD_NAME || '',
            style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
            type: styleData.FGTYPE_NAME || '',
            mrp: styleData.MRP ? styleData.MRP.toString() : '',
            rate: styleData.SSP ? styleData.SSP.toString() : ''
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
            await fetchShadeData(styleData.FGSTYLE_ID);
            await fetchLotNoData(styleData.FGSTYLE_ID);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching style data by code:', error);
    } finally {
      setIsLoadingStyleCode(false);
    }
  };

  // Fetch style data by barcode
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
        const barcodeValue = styleData.ALT_BARCODE || styleData.STYSTKDTL_KEY || '';
        
        if (isAddingNew || isEditingSize) {
          setNewItemData(prev => ({
            ...prev,
            product: styleData.FGPRD_NAME || '',
            style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
            type: styleData.FGTYPE_NAME || '',
            mrp: styleData.MRP ? styleData.MRP.toString() : '',
            rate: styleData.SSP ? styleData.SSP.toString() : '',
            barcode: barcodeValue
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
            await fetchShadeData(styleData.FGSTYLE_ID);
            await fetchLotNoData(styleData.FGSTYLE_ID);
          }
          
          await fetchSizeDetailsForStyle(styleData);
        }
      }
    } catch (error) {
      console.error('Error fetching style data by barcode:', error);
    } finally {
      setIsLoadingBarcode(false);
    }
  };

  // Auto-load size details for style data (used ONLY for barcode)
  const fetchSizeDetailsForStyle = async (styleData) => {
    try {
      const fgprdKey = styleData.FGPRD_KEY;
      const fgstyleId = styleData.FGSTYLE_ID;
      const fgtypeKey = styleData.FGTYPE_KEY || "";
      const fgshadeKey = styleData.FGSHADE_KEY || "";
      const fgptnKey = styleData.FGPTN_KEY || "";

      if (!fgprdKey || !fgstyleId) {
        return;
      }

      const payload = {
        "FGSTYLE_ID": fgstyleId,
        "FGPRD_KEY": fgprdKey,
        "FGTYPE_KEY": fgtypeKey,
        "FGSHADE_KEY": fgshadeKey,
        "FGPTN_KEY": fgptnKey,
        "MRP": parseFloat(styleData.MRP) || 0,
        "SSP": parseFloat(styleData.SSP) || 0,
        "PARTY_KEY": formData.PARTY_KEY || "",
        "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
        "FLAG": ""
      };

      const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', payload);

      if (response.data.DATA && response.data.DATA.length > 0) {
        const transformedSizeDetails = response.data.DATA.map((size, index) => ({
          STYSIZE_ID: size.STYSIZE_ID || index + 1,
          STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
          FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
          QTY: 0,
          ITM_AMT: 0,
          ORDER_QTY: 0,
          MRP: parseFloat(styleData.MRP) || 0,
          RATE: parseFloat(styleData.SSP) || 0
        }));

        setSizeDetailsData(transformedSizeDetails);
        setIsSizeDetailsLoaded(true);
      } else {
        setSizeDetailsData([]);
        setIsSizeDetailsLoaded(false);
      }
    } catch (error) {
      console.error('Error auto-fetching size details:', error);
      setIsSizeDetailsLoaded(false);
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

  // Fetch Size Details
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

      const payload = {
        "FGSTYLE_ID": fgstyleId,
        "FGPRD_KEY": fgprdKey,
        "FGTYPE_KEY": fgtypeKey,
        "FGSHADE_KEY": fgshadeKey,
        "FGPTN_KEY": fgptnKey,
        "MRP": parseFloat(newItemData.mrp) || 0,
        "SSP": parseFloat(newItemData.rate) || 0,
        "PARTY_KEY": formData.PARTY_KEY || "",
        "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
        "FLAG": ""
      };

      const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', payload);

      if (response.data.DATA && response.data.DATA.length > 0) {
        const transformedSizeDetails = response.data.DATA.map((size, index) => ({
          STYSIZE_ID: size.STYSIZE_ID || index + 1,
          STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
          FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
          QTY: 0,
          ITM_AMT: 0,
          ORDER_QTY: 0,
          MRP: parseFloat(newItemData.mrp) || 0,
          RATE: parseFloat(newItemData.rate) || 0
        }));

        setSizeDetailsData(transformedSizeDetails);
        setIsSizeDetailsLoaded(true);
        // showSnackbar("Size details loaded successfully! Please enter quantities for each size.");
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

  // Handle barcode text input change with debounce
  const handleBarcodeInputChange = (e) => {
    const value = e.target.value;
    setBarcodeInput(value);
    
    if (barcodeTimeoutRef.current) {
      clearTimeout(barcodeTimeoutRef.current);
    }
    
    if (value && value.trim() !== '') {
      barcodeTimeoutRef.current = setTimeout(() => {
        fetchStyleDataByBarcode(value.trim());
      }, 500);
    }
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

  // Handle Add Item
  const handleAddItem = async () => {
    if (!isPartySelected()) {
      showSnackbar("Please select a Party first before adding items", 'error');
      return;
    }

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
  };

  // Handle Confirm Add - FIXED with proper Type, Shade, Pattern handling
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

    const fgprdKey = productMapping[newItemData.product] || productMapping[newItemData.style] || "";
    const fgstyleId = styleMapping[newItemData.style] || "";
    const fgtypeKey = typeMapping[newItemData.type] || "";
    const fgshadeKey = shadeMapping[newItemData.shade] || "";
    const fgptnKey = lotNoMapping[newItemData.lotNo] || "";

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
      ITM_AMT: (parseFloat(size.QTY) || 0) * rate
    }));

    const newItem = {
      id: tempId,
      BarCode: newItemData.barcode || "-",
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
        FGITEM_KEY: newItemData.barcode || "-",
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
        FGTYPE_KEY: fgtypeKey,
        FGSHADE_KEY: fgshadeKey,
        FGPTN_KEY: fgptnKey,
        DBFLAG: mode === 'add' ? 'I' : 'I'
      },
      FGSTYLE_ID: fgstyleId,
      FGPRD_KEY: fgprdKey,
      FGTYPE_KEY: fgtypeKey,
      FGSHADE_KEY: fgshadeKey,
      FGPTN_KEY: fgptnKey
    };

    const newTableData = [...tableData, newItem];
    setUpdatedTableData(newTableData);

    // Update formData
    const newOrdbkStyleItem = {
      ORDBKSTY_ID: tempId,
      FGITEM_KEY: newItem.BarCode,
      PRODUCT: newItem.product,
      STYLE: newItem.style,
      TYPE: newItem.type,
      SHADE: newItem.shade,
      PATTERN: newItem.lotNo,
      ITMQTY: newItem.qty,
      MRP: newItem.mrp,
      ITMRATE: newItem.rate,
      ITMAMT: newItem.amount,
      DLV_VAR_PERC: newItem.varPer,
      DLV_VAR_QTY: newItem.varQty,
      DISC_AMT: newItem.discAmt,
      NET_AMT: newItem.netAmt,
      DISTBTR: newItem.distributer,
      SETQTY: newItem.set,
      ORDBKSTYSZLIST: updatedSizeDetails.map(size => ({
        ...size,
        ORDBKSTYSZ_ID: 0
      })),
      FGSTYLE_ID: newItem.FGSTYLE_ID,
      FGPRD_KEY: fgprdKey,
      FGTYPE_KEY: fgtypeKey,
      FGSHADE_KEY: fgshadeKey,
      FGPTN_KEY: fgptnKey,
      DBFLAG: mode === 'add' ? 'I' : 'I'
    };

    setFormData(prev => ({
      ...prev,
      apiResponseData: {
        ...prev.apiResponseData,
        ORDBKSTYLIST: [...(prev.apiResponseData?.ORDBKSTYLIST || []), newOrdbkStyleItem]
      }
    }));

    setIsAddingNew(false);
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

    showSnackbar("Item added successfully!");
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
    setIsAddingNew(false);
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
    { id: 'BarCode', label: 'BarCode', minWidth: 120 },
    { id: 'product', label: 'Product', minWidth: 120 },
    { id: 'style', label: 'Style', minWidth: 80 },
    { id: 'type', label: 'Type', minWidth: 80 },
    { id: 'shade', label: 'Shade', minWidth: 100 },
    { id: 'lotNo', label: 'Lot No', minWidth: 100 },
    { id: 'qty', label: 'Qty', minWidth: 70, align: 'right' },
    { id: 'mrp', label: 'MRP', minWidth: 70, align: 'right' },
    { id: 'rate', label: 'Rate', minWidth: 70, align: 'right' },
    { id: 'amount', label: 'Amount', minWidth: 80, align: 'right' },
    { id: 'varPer', label: 'Var Per', minWidth: 80, align: 'right' },
    { id: 'varQty', label: 'Var Qty', minWidth: 80, align: 'right' },
    { id: 'varAmt', label: 'Var Amt', minWidth: 80, align: 'right' },
    { id: 'discAmt', label: 'Disc Amt', minWidth: 80, align: 'right' },
    { id: 'netAmt', label: 'Net Amt', minWidth: 80, align: 'right' },
    { id: 'divDt', label: 'Div Dt', minWidth: 80, align: 'right' },
    { id: 'distributer', label: 'Distributer', minWidth: 80, align: 'right' },
    { id: 'set', label: 'Set', minWidth: 80, align: 'right' },
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
                  backgroundColor: '#39ace2',
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
              backgroundColor: '#39ace2',
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
              backgroundColor: '#39ace2',
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
                label="Style Code" 
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
                helperText={isLoadingStyleCode ? "Loading..." : "Type style code"}
              />
              
              <AutoVibe
                id="Product"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={productOptions}
                label="Product"
                name="product"
                value={isAddingNew || isEditingSize ? newItemData.product : selectedProduct}
                onChange={handleProductChange}
                sx={DropInputSx}
              />
              
              {/* Style Dropdown */}
              <AutoVibe
                id="Style_Cd"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={styleOptions}
                label="Style Cd"
                name="style"
                value={isAddingNew || isEditingSize ? newItemData.style : selectedStyle}
                onChange={handleStyleChange}
                sx={DropInputSx}
              />
              
              {/* Style Code Text Field */}
              

              {/* Barcode Text Field */}
              <TextField 
                label="BarCode" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="barcode"
                value={barcodeInput}
                onChange={handleBarcodeInputChange}
                placeholder="Type barcode"
                sx={textInputSx} 
                inputProps={{ 
                  style: { padding: '6px 8px', fontSize: '12px' }
                }}
                helperText={isLoadingBarcode ? "Loading..." : "Type barcode"}
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
              <AutoVibe
                id="Shade"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={shadeOptions}
                label="Shade"
                name="shade"
                value={isAddingNew || isEditingSize ? newItemData.shade : ''}
                onChange={handleShadeChange}
                sx={DropInputSx}
              />
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
        onClick={isAddingNew ? handleCancelAdd : () => {
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
          
          // Reset size details to original row's data
          const selectedRowData = tableData.find(row => row.id === selectedRow);
          if (selectedRowData) {
            const sizeDetails = selectedRowData.originalData?.ORDBKSTYSZLIST || [];
            setSizeDetailsData(sizeDetails);
          }
        }}
        sx={{ minWidth: '60px', height: '36px' }}
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
              <TableContainer sx={{ width: '100%' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Size</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>MRP</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Rate</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Barcode</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sizeDetailsData.length > 0 ? (
                      sizeDetailsData.map((size, index) => (
                        <TableRow key={index} sx={{
                          backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                          "&:hover": { backgroundColor: "#e3f2fd" }
                        }}>
                          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.STYSIZE_NAME}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
                            <TextField
                              type="number"
                              value={size.QTY}
                              onChange={(e) => handleSizeQtyChange(index, e.target.value)}
                              size="small"
                              sx={{ width: '80px' }}
                              inputProps={{ 
                                style: { fontSize: '0.75rem', padding: '4px' },
                                min: 0 
                              }}
                              disabled={!isAddingNew && !isEditingSize}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
                            {size.MRP || newItemData.mrp || 0}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
                            {size.RATE || newItemData.rate || 0}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.ITM_AMT || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.FGSTYLE_ID || "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 1 }}>
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
          {/* <Button 
            variant="contained" 
            color="primary" 
            onClick={isAddingNew ? handleConfirmAdd : (isEditingSize ? handleEditItem : null)}
            disabled={!(isAddingNew || isEditingSize)}
            sx={{ 
              minWidth: '60px', 
              height: '36px',
              backgroundColor: '#39ace2',
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            {isAddingNew ? 'Confirm' : (isEditingSize ? 'Save' : 'Confirm')}
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={isAddingNew ? handleCancelAdd : (isEditingSize ? handleEditCancel : onCancel)}
            disabled={!(isAddingNew || isEditingSize)}
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
          </Button> */}
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={onPrev}
            // disabled={isAddingNew || isEditingSize}
            sx={{ 
              minWidth: '60px', 
              height: '36px',
              backgroundColor: '#39ace2',
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
            // disabled={!hasRecords || isAddingNew || isEditingSize}
            sx={{ 
              minWidth: '60px', 
              height: '36px',
              backgroundColor: '#39ace2',
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            Next
          </Button>
        </Stack>
        
      </Box>
    </Box>
  )
}

export default Stepper2;