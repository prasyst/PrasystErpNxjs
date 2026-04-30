'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tooltip } from '@mui/material';
import {
  Box, Grid, TextField, Typography, Button, Stack, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  InputAdornment, Divider, Snackbar, Alert, FormControl, Select, MenuItem, InputLabel, OutlinedInput, Chip,
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
import useUserParams from '../../../../app/hooks/useUserParams';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserParams, selectUserParamByName, selectUserParamsLoading } from '../../../../app/redux/store/userParamsSlice';

const FORM_MODE = getFormMode();

const Stepper2 = ({ formData, pickOrderItems = [] , setFormData, isFormDisabled, mode, onSubmit, companyConfig, onCancel, onNext, onPrev, showSnackbar, showValidationErrors }) => {
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const dispatch = useDispatch();
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sizeDetailsData, setSizeDetailsData] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditingSize, setIsEditingSize] = useState(false);
  const [editingRowData, setEditingRowData] = useState(null);
  const [hasRecords, setHasRecords] = useState(false);
const [pickOrderItemsProcessed, setPickOrderItemsProcessed] = useState(false);
    // const { fetchUserParams, isDuplicateStyleAllowed,isShadeAllocationEnabled} = useUserParams();
  const [productOptions, setProductOptions] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [shadeOptions, setShadeOptions] = useState([]);
  const [lotNoOptions, setLotNoOptions] = useState([]);
  const [availableShades, setAvailableShades] = useState([]);
  const [selectedShades, setSelectedShades] = useState([]);
  const [shadeViewMode, setShadeViewMode] = useState('allocated');
const [showShadeAllocation, setShowShadeAllocation] = useState(true);
  // State for storing mappings
  const [productMapping, setProductMapping] = useState({});
  const [styleMapping, setStyleMapping] = useState({});
  const [typeMapping, setTypeMapping] = useState({});
  const [shadeMapping, setShadeMapping] = useState({});
  const [lotNoMapping, setLotNoMapping] = useState({});

  // State for style code and barcode text input
  const [styleCodeInput, setStyleCodeInput] = useState('');
  const [isLoadingStyleCode, setIsLoadingStyleCode] = useState(false);
  const styleCodeTimeoutRef = useRef(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
  const barcodeTimeoutRef = useRef(null);

  
  const [dataSource, setDataSource] = useState(null);

 
  const [isSizeDetailsLoaded, setIsSizeDetailsLoaded] = useState(false);

const hasProcessedPickOrder = useRef(false);

  const isDuplicateStyleAllowedParam = useSelector(state => selectUserParamByName(state, 'Allow Duplicate Style In Order'));
  const isShadeAllocationEnabledParam = useSelector(state => selectUserParamByName(state, 'Shade Allocation'));
  const paramsLoading = useSelector(selectUserParamsLoading);
  
  // Get values from Redux
  const isDuplicateStyleAllowed = () => {
    return isDuplicateStyleAllowedParam?.REMARK === '1';
  };
  
  const isShadeAllocationEnabled = () => {
    return isShadeAllocationEnabledParam?.REMARK === '1';
  };

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
        STYCATRT_ID: 0
      };
    });
    
    
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

  // Parse ORDBKSTYLIST data for table
  const initialTableData = formData.apiResponseData?.ORDBKSTYLIST ? formData.apiResponseData.ORDBKSTYLIST.map((item, index) => ({
    id: item.ORDBKSTY_ID || index + 1,
    BarCode: item.FGITEM_KEY || "-",
    product: item.PRODUCT || "-",
    style: item.STYLE || "-",
    type: item.TYPE || "-",
    shade: item.SHADE || "-",
    lotNo: item.PATTERN || formData.SEASON || "-",
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

  const tableData = updatedTableData.length > 0 ? updatedTableData : initialTableData;

  const filteredTableData = tableData.filter(row => {
    return Object.keys(tableFilters).every(key => {
      if (!tableFilters[key]) return true;
      const filterValue = tableFilters[key].toString().toLowerCase();
      const rowValue = row[key]?.toString().toLowerCase() || '';
      return rowValue.includes(filterValue);
    });
  });

  useEffect(() => {
    setHasRecords(tableData.length > 0);
  }, [tableData]);

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

  useEffect(() => {
  if (hasRecords && formData) {
    setFormData(prev => ({
      ...prev,
      BARCD_FLG: "0" // Style mode
    }));
  }
}, [hasRecords, formData, setFormData]);

  useEffect(() => {
    calculateTotals();
  }, [tableData]);

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

  useEffect(() => {
    if (tableData.length > 0 && !selectedRow) {
      const firstRow = tableData[0];
      setSelectedRow(firstRow.id);
      const sizeDetails = firstRow.originalData?.ORDBKSTYSZLIST || [];
      setSizeDetailsData(sizeDetails);
    }
  }, [tableData, selectedRow]);

  useEffect(() => {
    fetchProductData();
  }, []);

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

      // Build shade mapping properly
      const newShadeMapping = {};
      response.data.DATA.forEach(item => {
        if (item.FGSHADE_NAME && item.FGSHADE_KEY) {
          newShadeMapping[item.FGSHADE_NAME] = item.FGSHADE_KEY;
        }
      });
      
      // Update both state and local variable for immediate use
      setShadeMapping(prev => ({
        ...prev,
        ...newShadeMapping
      }));

      // 🔥 CRITICAL: Also update a ref or store in a variable that can be accessed immediately
      // For now, we'll store in a temporary variable that can be used in subsequent calls
      window._tempShadeMapping = { ...newShadeMapping };

      setAvailableShades(shades);

      if (mode === 'allocated' && shades.length > 0) {
        const firstShade = shades[0].FGSHADE_NAME;
        const firstShadeKey = shades[0].FGSHADE_KEY;
        setSelectedShades([firstShade]);
        
        setNewItemData(prev => ({
          ...prev,
          shade: firstShade
        }));
        
        // 🔥 Store the selected shade key for immediate use
        window._tempSelectedShadeKey = firstShadeKey;
      }
      
      return shades;
    } else {
      console.warn('No shades data received');
      setAvailableShades([]);
      setSelectedShades([]);
      return [];
    }
  } catch (error) {
    showSnackbar('Error fetching shades', 'error');
    setAvailableShades([]);
    setSelectedShades([]);
    return [];
  }
};

  // Handle shade selection change
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

  // Handle All button click
  const handleAllShadesClick = async () => {
    const currentStyleId = styleMapping[newItemData.style] || styleMapping[selectedStyle];
    if (!currentStyleId) {
      showSnackbar('Please select a style first', 'warning');
      return;
    }
    setShadeViewMode('all');
    await fetchShadesForStyle(currentStyleId, 'all');
  };

  // Handle Allocated button click
  const handleAllocatedShadesClick = async () => {
    const currentStyleId = styleMapping[newItemData.style] || styleMapping[selectedStyle];
    if (!currentStyleId) {
      showSnackbar('Please select a style first', 'warning');
      return;
    }
    setShadeViewMode('allocated');
    await fetchShadesForStyle(currentStyleId, 'allocated');
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
            barcode: barcodeValue,
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

          await fetchSizeDetailsForStyle(styleData);
        }
      }
    } catch (error) {
      console.error('Error fetching style data by barcode:', error);
    } finally {
      setIsLoadingBarcode(false);
    }
  };

const fetchSizeDetailsForStyle = async (styleData) => {
  try {
    const fgprdKey = styleData.FGPRD_KEY;
    const fgstyleId = styleData.FGSTYLE_ID;
    const fgtypeKey = styleData.FGTYPE_KEY || "";
    
    // 🔥 FIX: Get shade key from selected shades with multiple fallback methods
    let fgshadeKey = "";
    
    // Method 1: Check if we have selectedShades and shadeMapping
    if (selectedShades.length > 0) {
      const selectedShade = selectedShades[0];
      fgshadeKey = shadeMapping[selectedShade] || "";
      
      // If still empty, try to find from availableShades
      if (!fgshadeKey && availableShades.length > 0) {
        const foundShade = availableShades.find(s => s.FGSHADE_NAME === selectedShade);
        if (foundShade) {
          fgshadeKey = foundShade.FGSHADE_KEY;
        }
      }
    }
    
    // Method 2: If still empty, check from newItemData.shade
    if (!fgshadeKey && newItemData.shade) {
      fgshadeKey = shadeMapping[newItemData.shade] || "";
    }
    
    // Method 3: If still empty, check from temporary storage
    if (!fgshadeKey && window._tempSelectedShadeKey) {
      fgshadeKey = window._tempSelectedShadeKey;
    }
    
    // Method 4: If still empty, get from the first available shade
    if (!fgshadeKey && availableShades.length > 0) {
      fgshadeKey = availableShades[0].FGSHADE_KEY || "";
    }
    
    const fgptnKey = styleData.FGPTN_KEY || "";

    if (!fgprdKey || !fgstyleId) {
      return;
    }

    // Get values from localStorage
    const cobrId = companyConfig.COBR_ID || localStorage.getItem('COBR_ID') || '02';
    const fcyrKey = localStorage.getItem('FCYR_KEY') || '25';
    const coId = localStorage.getItem('CO_ID') || '02';
    const clientId = localStorage.getItem('CLIENT_ID') || '5102';

    // FIRST: Get STYCATRT_ID from API with FLAG: "GETSTYCATRTID"
    const stycatrtPayload = {
      "FGSTYLE_ID": fgstyleId,
      "FGPRD_KEY": fgprdKey,
      "FGTYPE_KEY": fgtypeKey,
      "FGSHADE_KEY": fgshadeKey, // 🔥 Now this will have the correct shade key
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

    console.log('STYCATRT Payload with shade key:', stycatrtPayload); // Debug log

    const stycatrtResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', stycatrtPayload);

    let stycatrtId = 0;
    if (stycatrtResponse.data.DATA && stycatrtResponse.data.DATA.length > 0) {
      stycatrtId = stycatrtResponse.data.DATA[0].STYCATRT_ID || 0;
    }

    // SECOND: Get size details with FLAG: "GETPACKTY2"
    const sizeDetailsPayload = {
      "FGSTYLE_ID": fgstyleId,
      "FGPRD_KEY": fgprdKey,
      "FGTYPE_KEY": fgtypeKey,
      "FGSHADE_KEY": fgshadeKey, // 🔥 Also add here
      "FGPTN_KEY": fgptnKey,
      "MRP": parseFloat(styleData.MRP) || 0,
      "SSP": parseFloat(styleData.SSP) || 0,
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
      "FLAG": "GETPACKTY2"  
    };

    console.log('Size Details Payload with shade key:', sizeDetailsPayload); // Debug log

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
        CL_QTY: parseFloat(size.CL_QTY) || 0, 
        PORD_QTY: parseFloat(size.PORD_QTY) || 0,
        BAL_QTY: parseFloat(size.BAL_QTY) || 0,
        ISU_QTY: parseFloat(size.ISU_QTY) || 0
      }));

      setSizeDetailsData(transformedSizeDetails);

      setNewItemData(prev => ({
        ...prev,
        stycatrtId: stycatrtId
      }));

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


const fetchSizeDetails = async () => {
  if (!newItemData.product || !newItemData.style) {
    showSnackbar("Please select Product and Style first", 'error');
    return;
  }

  try {
    const fgprdKey = productMapping[newItemData.product];
    const fgstyleId = styleMapping[newItemData.style];
    const fgtypeKey = typeMapping[newItemData.type] || "";
    
    // 🔥 FIX: Get shade key with multiple fallback methods
    let fgshadeKey = "";
    
    // Method 1: Check if we have selectedShades and shadeMapping
    if (selectedShades.length > 0) {
      const selectedShade = selectedShades[0];
      fgshadeKey = shadeMapping[selectedShade] || "";
      
      // If still empty, try to find from availableShades
      if (!fgshadeKey && availableShades.length > 0) {
        const foundShade = availableShades.find(s => s.FGSHADE_NAME === selectedShade);
        if (foundShade) {
          fgshadeKey = foundShade.FGSHADE_KEY;
        }
      }
    }
    
    // Method 2: If still empty, check from newItemData.shade
    if (!fgshadeKey && newItemData.shade) {
      fgshadeKey = shadeMapping[newItemData.shade] || "";
    }
    
    // Method 3: If still empty, check from temporary storage
    if (!fgshadeKey && window._tempSelectedShadeKey) {
      fgshadeKey = window._tempSelectedShadeKey;
    }
    
    // Method 4: If still empty, get from the first available shade
    if (!fgshadeKey && availableShades.length > 0) {
      fgshadeKey = availableShades[0].FGSHADE_KEY || "";
    }
    
    const fgptnKey = lotNoMapping[newItemData.lotNo] || "";

    if (!fgprdKey || !fgstyleId) {
      return;
    }

    // Get values from localStorage
    const cobrId = companyConfig.COBR_ID || localStorage.getItem('COBR_ID') || '02';
    const fcyrKey = localStorage.getItem('FCYR_KEY') || '25';
    const coId = localStorage.getItem('CO_ID') || '02';
    const clientId = localStorage.getItem('CLIENT_ID') || '5102';

    // FIRST: Get STYCATRT_ID from API with FLAG: "GETSTYCATRTID"
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

    console.log('fetchSizeDetails STYCATRT Payload:', stycatrtPayload); // Debug log

    const stycatrtResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', stycatrtPayload);

    let stycatrtId = 0;
    if (stycatrtResponse.data.DATA && stycatrtResponse.data.DATA.length > 0) {
      stycatrtId = stycatrtResponse.data.DATA[0].STYCATRT_ID || 0;
    }

    // SECOND: Get size details
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

    console.log('fetchSizeDetails Size Payload:', sizeDetailsPayload); // Debug log

    const sizeDetailsResponse = await axiosInstance.post('/STYSIZE/AddSizeDetail', sizeDetailsPayload);

    if (sizeDetailsResponse.data.DATA && sizeDetailsResponse.data.DATA.length > 0) {
      const transformedSizeDetails = sizeDetailsResponse.data.DATA.map((size, index) => ({
        STYSIZE_ID: size.STYSIZE_ID || index + 1,
        STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
        FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
        QTY: 0,
        ITM_AMT: 0,
        ORDER_QTY: 0,
        MRP: parseFloat(newItemData.mrp) || 0,
        RATE: parseFloat(newItemData.rate) || 0,
        CL_QTY: parseFloat(size.CL_QTY) || 0,
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
        setLotNoOptions([]);
        setSizeDetailsData([]);
        setIsSizeDetailsLoaded(false);
        setAvailableShades([]);
        setSelectedShades([]);
      } else {
        setStyleOptions([]);
        setTypeOptions([]);
        setLotNoOptions([]);
        setSizeDetailsData([]);
        setIsSizeDetailsLoaded(false);
        setAvailableShades([]);
        setSelectedShades([]);
      }
    }
  };

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
    setLotNoOptions([]);
    setSizeDetailsData([]);
    setIsSizeDetailsLoaded(false);
    setAvailableShades([]);
    setSelectedShades([]);

    if (value && styleMapping[value]) {
      const fgstyleId = styleMapping[value];

      // 🔥 Fetch shades and wait for completion
      await fetchShadesForStyle(fgstyleId, shadeViewMode);

      // Small delay to ensure shade mapping is set
      await new Promise(resolve => setTimeout(resolve, 100));

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

// ADD THIS FUNCTION - Check if style already exists
const isStyleAlreadyExists = (styleName, shadeName = null) => {
  // If duplicate styles are allowed, return false (no restriction)
  if (isDuplicateStyleAllowed()) {
    return false;
  }

  // Check in existing table data
  const existingItem = tableData.find(item => {
    if (shadeName && shadeName !== '-') {
      // Check both style and shade combination
      return item.style === styleName && item.shade === shadeName;
    }
    // Check only style
    return item.style === styleName;
  });

  return !!existingItem;
};


const handleAddItem = async () => {
  if (!isPartySelected()) {
    showSnackbar("Please select a Party first before adding items", 'error');
    return;
  }

  try {
      await dispatch(fetchUserParams());
    } catch (error) {
      console.error('Error fetching user params:', error);
    }

  setIsAddingNew(true);
  setSizeDetailsData([]);
  setIsSizeDetailsLoaded(false);
  setDataSource(null);
  setAvailableShades([]);
  setSelectedShades([]);

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
  setLotNoOptions([]);
};


const handleConfirmAdd = () => {
    if (!newItemData.product || !newItemData.style) {
      showSnackbar("Please fill required fields: Product and Style", 'error');
      return;
    }
    
    // 🔥 VALIDATION 2: Check for duplicate style using Redux value
    if (!isDuplicateStyleAllowed()) {
      if (selectedShades.length > 0) {
        for (const shade of selectedShades) {
          if (isStyleAlreadyExists(newItemData.style, shade)) {
            showSnackbar(
              `❌ Duplicate style "${newItemData.style}" with shade "${shade}" already exists! Duplicate styles are NOT allowed.`,
              'error'
            );
            return;
          }
        }
      } else {
        const currentShade = newItemData.shade || '-';
        if (isStyleAlreadyExists(newItemData.style, currentShade)) {
          showSnackbar(
            `❌ Duplicate style "${newItemData.style}" already exists in the order! Duplicate styles are NOT allowed.`,
            'error'
          );
          return;
        }
      }
    }

  // Validation 3: Check size details
  if (sizeDetailsData.length === 0) {
    showSnackbar("Please load size details first", 'error');
    return;
  }

  // Validation 4: Check stock availability
  // In handleConfirmAdd function, update the stock validation:
const exceedingSizes = sizeDetailsData.filter(size => {
  const inputQty = parseFloat(size.QTY) || 0;
  const clQty = size.CL_QTY || 0;  // 🔥 Changed from FG_QTY to CL_QTY
  return inputQty > clQty;
});

if (exceedingSizes.length > 0) {
  const sizeMessages = exceedingSizes.map(s => 
    `${s.STYSIZE_NAME} (ordered: ${s.QTY}, available: ${s.CL_QTY})`  // 🔥 Updated to CL_QTY
  ).join(', ');
  showSnackbar(`Order quantity exceeds available stock for: ${sizeMessages}`, 'error');
  return;
}

  if (exceedingSizes.length > 0) {
    const sizeMessages = exceedingSizes.map(s => 
      `${s.STYSIZE_NAME} (ordered: ${s.QTY}, available: ${s.FG_QTY})`
    ).join(', ');
    showSnackbar(`Order quantity exceeds available stock for: ${sizeMessages}`, 'error');
    return;
  }

  // Validation 5: At least one size should have quantity
  const sizesWithQty = sizeDetailsData.filter(size => size.QTY && size.QTY > 0);
  if (sizesWithQty.length === 0) {
    showSnackbar("Please enter quantity for at least one size before confirming", 'error');
    return;
  }

  // Rest of your existing handleConfirmAdd code...
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
    FG_QTY: size.FG_QTY,
    PORD_QTY: size.PORD_QTY
  }));

  // Create items for each selected shade
  const newItems = selectedShades.map((shade, shadeIndex) => {
    const fgshadeKey = shadeMapping[shade] || "";
    const fgtypeKey = typeMapping[newItemData.type] || "";
    const fgptnKey = lotNoMapping[newItemData.lotNo] || "";

    return {
      id: tempId + shadeIndex,
      BarCode: newItemData.barcode || "-",
      product: newItemData.product,
      style: newItemData.style || "-",
      type: newItemData.type || "-",
      shade: shade || "-",
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
        ORDBKSTY_ID: tempId + shadeIndex,
        FGITEM_KEY: newItemData.barcode || "-",
        PRODUCT: newItemData.product,
        STYLE: newItemData.style,
        TYPE: newItemData.type || "-",
        SHADE: shade || "-",
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
        STYCATRT_ID: stycatrtId,
        DBFLAG: mode === 'add' ? 'I' : 'I'
      },
      FGSTYLE_ID: fgstyleId,
      FGPRD_KEY: fgprdKey,
      FGTYPE_KEY: fgtypeKey,
      FGSHADE_KEY: fgshadeKey,
      FGPTN_KEY: fgptnKey,
      STYCATRT_ID: stycatrtId
    };
  });

  // If no shades selected, create single item
  const finalNewItems = selectedShades.length > 0 ? newItems : [{
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
    STYCATRT_ID: stycatrtId
  }];

  const newTableData = [...tableData, ...finalNewItems];
  setUpdatedTableData(newTableData);

  // Update formData
  const newOrdbkStyleItems = finalNewItems.map(item => ({
    ORDBKSTY_ID: item.id,
    FGITEM_KEY: item.BarCode,
    PRODUCT: item.product,
    STYLE: item.style,
    TYPE: item.type,
    SHADE: item.shade,
    PATTERN: item.lotNo,
    ITMQTY: item.qty,
    MRP: item.mrp,
    ITMRATE: item.rate,
    ITMAMT: item.amount,
    DLV_VAR_PERC: item.varPer,
    DLV_VAR_QTY: item.varQty,
    DISC_AMT: item.discAmt,
    NET_AMT: item.netAmt,
    DISTBTR: item.distributer,
    SETQTY: item.set,
    ORDBKSTYSZLIST: updatedSizeDetails.map(size => ({
      ...size,
      ORDBKSTYSZ_ID: 0
    })),
    FGSTYLE_ID: item.FGSTYLE_ID,
    FGPRD_KEY: item.FGPRD_KEY,
    FGTYPE_KEY: item.FGTYPE_KEY,
    FGSHADE_KEY: item.FGSHADE_KEY,
    FGPTN_KEY: item.FGPTN_KEY,
    STYCATRT_ID: item.STYCATRT_ID,
    DBFLAG: mode === 'add' ? 'I' : 'I'
  }));

  setFormData(prev => ({
    ...prev,
    apiResponseData: {
      ...prev.apiResponseData,
      ORDBKSTYLIST: [...(prev.apiResponseData?.ORDBKSTYLIST || []), ...newOrdbkStyleItems]
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
    sets: '',
    stycatrtId: 0
  });
  setStyleCodeInput('');
  setBarcodeInput('');
  setSizeDetailsData([]);
  setDataSource(null);
  setSelectedShades([]);
  setAvailableShades([]);

  showSnackbar(selectedShades.length > 1 ?
    `${selectedShades.length} items added to order!` :
    "Item added successfully!");
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
          fetchShadesForStyle(selectedRowData.FGSTYLE_ID, shadeViewMode);
          fetchLotNoData(selectedRowData.FGSTYLE_ID);
        }

        showSnackbar('Edit mode enabled for selected item. Make changes and click Confirm.');
      }
    }
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

  // Handle Delete Item
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
    setSelectedShades([]);
    setAvailableShades([]);
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
    setSelectedShades([]);
    setAvailableShades([]);
  };

const handleSizeQtyChange = (index, newQty) => {
  const size = sizeDetailsData[index];
  const clQty = size.CL_QTY || 0;
  const inputQty = parseFloat(newQty) || 0;
  
  // Validation 1: Check if CL_QTY is zero
  if (clQty === 0) {
    showSnackbar(`Cannot order for size "${size.STYSIZE_NAME}" - CL QTY is 0 (No stock available)`, 'error');
    return;
  }
  
  // Validation 2: Check if input quantity exceeds CL_QTY
  if (inputQty > clQty) {
    showSnackbar(`Cannot order more than available stock (${clQty}) for size "${size.STYSIZE_NAME}"`, 'error');
    return;
  }
  
  // If validations pass, update the quantity
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

  const shouldDisableFields = () => {
    return !(isAddingNew || isEditingSize);
  };

 const columns = [
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
            <Box sx={{ px: 1, py: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
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
        <Stack direction="row" spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
          <Tooltip
            title={!isPartySelected() ? "Please select a Party first" : "Add new item"}
            placement="top"
            arrow
          >
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                disabled={isFormDisabled || isEditingSize || isAddingNew}
                sx={{
                  backgroundColor: '#635bff',
                  textTransform: 'none',
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
              textTransform: 'none',
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
              textTransform: 'none',
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
            Del
          </Button>

          {/* Totals */}
          <TextField
            label="Tot Qty"
            variant="filled"
            value={formData.TOTAL_QTY || 0}
            disabled
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '0px 0px',
                paddingTop: '8px',
                fontSize: '12px',
              },
            }}
          />
          <TextField
            label="Tot Amt"
            variant="filled"
            value={formData.TOTAL_AMOUNT || 0}
            disabled
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '0px 0px',
                paddingTop: '8px',
                fontSize: '12px',
              },
            }}
          />
          <TextField
            label="Disc"
            variant="filled"
            value={formData.DISCOUNT || 0}
            disabled
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '0px 0px',
                paddingTop: '8px',
                fontSize: '12px',
              },
            }}
          />
          <TextField
            label="Net"
            variant="filled"
            value={formData.NET_AMOUNT || 0}
            disabled
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '0px 0px',
                paddingTop: '8px',
                fontSize: '12px',
              },
            }}
          />
        </Stack>

        {/* Product Details and Size Details */}
        <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'flex-start' }}>
          <Box sx={{ flex: '0 0 50%' }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <AutoVibe
                  id="Product"
                  disabled={shouldDisableFields()}
                  getOptionLabel={(option) => option || ''}
                  options={productOptions}
                  label="Product"
                  name="product"
                  value={isAddingNew || isEditingSize ? newItemData.product : selectedProduct}
                  onChange={handleProductChange}
                  minWidth={350}
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
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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
                    style: {
                      padding: '6px 0px',
                      paddingTop: '12px',
                      fontSize: '12px',
                    },
                  }}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <AutoVibe
                  id="Style_Cd"
                  disabled={shouldDisableFields()}
                  getOptionLabel={(option) => option || ''}
                  options={styleOptions}
                  label="Style Cd"
                  name="style"
                  value={isAddingNew || isEditingSize ? newItemData.style : selectedStyle}
                  onChange={handleStyleChange}
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
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <AutoVibe
                  id="Type"
                  disabled={shouldDisableFields()}
                  getOptionLabel={(option) => option || ''}
                  options={typeOptions}
                  label="Type"
                  name="type"
                  value={isAddingNew || isEditingSize ? newItemData.type : ''}
                  onChange={handleTypeChange}
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
                  fullWidth
                />
              </Grid>

              {/* Qty + All/Aloc buttons */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', height: '100%' }}>
                  <FormControl fullWidth>
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
                            maxWidth: '100%',
                            alignItems: 'center',
                            '&::-webkit-scrollbar': { height: '3px' },
                          }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              size="small"
                              sx={{ height: '24px', fontSize: '0.75rem' }}
                            />
                          ))}
                        </Box>
                      )}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': { minHeight: '36px', padding: '0px' },
                        '& .MuiSelect-select': { padding: '4px 8px', display: 'flex', alignItems: 'center' },
                      }}
                    >
                      {availableShades.map((shade) => (
                        <MenuItem key={shade.FGSHADE_NAME} value={shade.FGSHADE_NAME}>
                          {shade.FGSHADE_NAME}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
                  {isShadeAllocationEnabled() && (
          <Button
            variant={shadeViewMode === 'allocated' ? 'contained' : 'outlined'}
            onClick={handleAllocatedShadesClick}
            size="small"
            disabled={shouldDisableFields()}
            sx={{
              minWidth: '35px',
              height: '20px',
              textTransform: 'none',
              fontSize: '10px',
              padding: '0px 0px',
              backgroundColor: shadeViewMode === 'allocated' ? '#1976d2' : 'transparent',
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
            Allc
          </Button>
        )}
                    <Button
                      variant={shadeViewMode === 'allocated' ? 'contained' : 'outlined'}
                      onClick={handleAllocatedShadesClick}
                      size="small"
                      disabled={shouldDisableFields()}
                      sx={{
                        minWidth: '35px',
                        height: '20px',
                        textTransform: 'none',
                        fontSize: '10px',
                        padding: '0px 0px',
                        backgroundColor: shadeViewMode === 'allocated' ? '#1976d2' : 'transparent',
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
                      Filter
                    </Button>
                    <Button
                      variant={shadeViewMode === 'all' ? 'contained' : 'outlined'}
                      onClick={handleAllShadesClick}
                      size="small"
                      disabled={shouldDisableFields()}
                      sx={{
                        minWidth: '35px',
                        height: '20px',
                        fontSize: '10px',
                        textTransform: 'none',
                        padding: '0px 0px',
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
                  </Box>
                </Box>
              </Grid>

              {/* Shade multi-select */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Qty"
                  variant="filled"
                  disabled={true}
                  name="qty"
                  value={isAddingNew || isEditingSize ? newItemData.qty : ''}
                  onChange={handleNewItemChange}
                  sx={{
                    ...textInputSx,
                    flex: 1,
                    '& .MuiInputBase-input': {
                      padding: '6px 8px !important',
                      fontSize: '12px !important'
                    }
                  }}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      paddingTop: '10px',
                      fontSize: '12px',
                    },
                  }}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Set No"
                  variant="filled"
                  disabled={shouldDisableFields()}
                  name="setNo"
                  value={isAddingNew || isEditingSize ? newItemData.setNo : ''}
                  onChange={handleNewItemChange}
                  sx={textInputSx}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      marginTop: '10px',
                      fontSize: '12px'
                    },
                  }}
                  fullWidth
                />
              </Grid>

              {/* MRP */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="MRP"
                  variant="filled"
                  disabled={shouldDisableFields()}
                  name="mrp"
                  value={isAddingNew || isEditingSize ? newItemData.mrp : ''}
                  onChange={handleNewItemChange}
                  sx={textInputSx}
                  inputProps={{
                    style: {
                      padding: '0px 0px',
                      paddingTop: '8px',
                      fontSize: '12px',
                    },
                    type: 'number',
                    step: '0.01',
                    min: '0'
                  }}
                  fullWidth
                />
              </Grid>

              {/* Rate */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Rate"
                  variant="filled"
                  disabled={shouldDisableFields()}
                  name="rate"
                  value={isAddingNew || isEditingSize ? newItemData.rate : ''}
                  onChange={handleNewItemChange}
                  sx={textInputSx}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      paddingTop: '10px',
                      fontSize: '12px',
                    },
                    type: 'number',
                    step: '0.01',
                    min: '0'
                  }}
                  fullWidth
                />
              </Grid>

              {/* Std Qty */}
              {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Std Qty"
                  variant="filled"
                  disabled={shouldDisableFields()}
                  name="stdQty"
                  value={isAddingNew || isEditingSize ? newItemData.stdQty : ''}
                  onChange={handleNewItemChange}
                  sx={textInputSx}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      marginTop: '10px',
                      fontSize: '12px'
                    },
                  }}
                  fullWidth
                />
              </Grid> */}

              {/* Conv Fact */}
              {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Conv Fact"
                  variant="filled"
                  disabled={true}
                  name="convFact"
                  value={isAddingNew || isEditingSize ? newItemData.convFact : ''}
                  onChange={handleNewItemChange}
                  sx={textInputSx}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      marginTop: '10px',
                      fontSize: '12px'
                    },
                  }}
                  fullWidth
                />
              </Grid> */}

              {/* Lot No */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AutoVibe
                  id="LotNo"
                  disabled={shouldDisableFields()}
                  getOptionLabel={(option) => option || ''}
                  options={lotNoOptions}
                  label="Lot No"
                  name="lotNo"
                  value={isAddingNew || isEditingSize ? newItemData.lotNo : ''}
                  onChange={handleLotNoChange}
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
                  fullWidth
                />
              </Grid>

              <Grid size={{ sx: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Qty(+/-)%"
                  variant="filled"
                  disabled={shouldDisableFields()}
                  name="setNo"
                  value={isAddingNew || isEditingSize ? newItemData.setNo : ''}
                  onChange={handleNewItemChange}
                  sx={textInputSx}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      marginTop: '10px',
                      fontSize: '12px'
                    },
                  }}
                  fullWidth
                />
              </Grid>

              {/* Discount */}
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Percent"
                  variant="filled"
                  disabled={shouldDisableFields()}
                  name="percent"
                  value={isAddingNew || isEditingSize ? newItemData.percent : ''}
                  onChange={handleNewItemChange}
                  sx={textInputSx}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      paddingTop: '10px',
                      fontSize: '12px',
                    },
                    type: 'number',
                    step: '0.01',
                    min: '0'
                  }}
                  fullWidth
                />
              </Grid>

              {/* Remark */}
              <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                <TextField
                  label="Remark"
                  variant="filled"
                  disabled={shouldDisableFields()}
                  name="remark"
                  value={isAddingNew || isEditingSize ? newItemData.remark : ''}
                  onChange={handleNewItemChange}
                  sx={textInputSx}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      paddingTop: '10px',
                      fontSize: '12px',
                    },
                  }}
                  fullWidth
                />
              </Grid>

              {/* Div Dt */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Div Dt"
                    value={
                      isAddingNew || isEditingSize
                        ? newItemData.divDt ? parse(newItemData.divDt, "dd/MM/yyyy", new Date()) : null
                        : formData.DIV_DT ? parse(formData.DIV_DT, "dd/MM/yyyy", new Date()) : null
                    }
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
                        sx: {
                          ...textInputSx,
                          '& .MuiPickersSectionList-root': {
                            paddingBottom: '6px !important',
                            paddingTop: '18px',
                          },
                          '& .MuiFilledInput-input': {
                            paddingBottom: '2px',
                          },
                        },
                        InputProps: {
                          sx: {
                            ...textInputSx,
                            '& .MuiFilledInput-root': {
                              backgroundColor: 'white',
                            },
                            height: "38px",
                          },
                          disableUnderline: true,
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <AutoVibe
                  id="Product"
                  disabled={shouldDisableFields()}
                  getOptionLabel={(option) => option || ''}
                  options={productOptions}
                  label="Consignee"
                  name="product"
                  value={isAddingNew || isEditingSize ? newItemData.product : selectedProduct}
                  onChange={handleProductChange}
                  minWidth={350}
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
                  fullWidth
                />
              </Grid>

              {/* RQty */}
              {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="RQty"
                  variant="filled"
                  disabled={shouldDisableFields()}
                  name="rQty"
                  value={isAddingNew || isEditingSize ? newItemData.rQty : ''}
                  onChange={handleNewItemChange}
                  sx={textInputSx}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      paddingTop: '12px',
                      fontSize: '12px',
                    },
                    type: 'number',
                    step: '1',
                    min: '0'
                  }}
                  fullWidth
                />
              </Grid> */}

              {/* Sets + action buttons - full row */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {/* <TextField
                    label="Sets"
                    variant="filled"
                    disabled={shouldDisableFields()}
                    name="sets"
                    value={isAddingNew || isEditingSize ? newItemData.sets : ''}
                    onChange={handleNewItemChange}
                    sx={{ ...textInputSx, flex: '1 1 180px' }}
                    inputProps={{
                      style: {
                        padding: '6px 0px',
                        paddingTop: '12px',
                        fontSize: '12px',
                      },
                    }}
                  /> */}

                  {(isAddingNew || isEditingSize) && (
                    <>
                      {!isSizeDetailsLoaded && isAddingNew && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={fetchSizeDetails}
                          disabled={!newItemData.product || !newItemData.style || dataSource === 'barcode'}
                          sx={{ minWidth: '80px', height: '36px', textTransform: 'none' }}
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
                          sx={{ minWidth: '80px', height: '36px', textTransform: 'none' }}
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

                          const selectedRowData = tableData.find(row => row.id === selectedRow);
                          if (selectedRowData) {
                            const sizeDetails = selectedRowData.originalData?.ORDBKSTYSZLIST || [];
                            setSizeDetailsData(sizeDetails);
                          }
                        }}
                        sx={{ minWidth: '60px', height: '36px', textTransform: 'none' }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
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
        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>FG Qty</TableCell>
        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>PORD Qty</TableCell>
        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>MRP</TableCell>
        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Rate</TableCell>
        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Amount</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
  {sizeDetailsData.length > 0 ? (
    sizeDetailsData.map((size, index) => {
      const clQty = size.CL_QTY || 0;
      const isZeroStock = clQty === 0;
      
      return (
        <TableRow 
          key={index} 
          sx={{
            backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
            "&:hover": { backgroundColor: "#e3f2fd" },
            ...(isZeroStock && { backgroundColor: "#ffebee" })
          }}
        >
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
                min: 0,
                max: clQty  // 🔥 Changed from fgQty to clQty
              }}
              error={isZeroStock}
              disabled={!isAddingNew && !isEditingSize || isZeroStock}
              title={isZeroStock ? "This size has no stock available" : ""}
            />
          </TableCell>
          <TableCell sx={{ 
            fontSize: '0.75rem', 
            padding: '6px 8px',
            color: isZeroStock ? 'red' : 'inherit',
            fontWeight: isZeroStock ? 'bold' : 'normal'
          }}>
            {clQty}
            {isZeroStock && <span style={{ marginLeft: '4px', fontSize: '0.7rem', color: 'red' }}>(No Stock)</span>}
          </TableCell>
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.PORD_QTY || 0}</TableCell>
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
            {size.MRP || newItemData.mrp || 0}
          </TableCell>
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
            {size.RATE || newItemData.rate || 0}
          </TableCell>
          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.ITM_AMT || 0}</TableCell>
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
        <Stack direction="row" spacing={2} sx={{ m: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onPrev}
            sx={{
              minWidth: '60px',
              height: '36px',
              textTransform: 'none',
              backgroundColor: '#635bff',
              color: 'white',
              '&:disabled': {
                borderColor: '#cccccc',
                color: '#666666'
              },
              '&:hover': {
                backgroundColor: '#4e44e0',
              },
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

export default Stepper2;