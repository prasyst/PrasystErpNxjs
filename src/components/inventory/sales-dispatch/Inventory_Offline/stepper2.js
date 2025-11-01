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

const Stepper2 = ({ formData, setFormData, isFormDisabled, mode, onSubmit, onCancel, showSnackbar,showValidationErrors }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sizeDetailsData, setSizeDetailsData] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditingSize, setIsEditingSize] = useState(false);
  const [editingRowData, setEditingRowData] = useState(null);
  
  // State for dropdown options
  const [productOptions, setProductOptions] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [shadeOptions, setShadeOptions] = useState([]);
  const [lotNoOptions, setLotNoOptions] = useState([]);
  
  
  // State for storing product mapping (FGPRD_NAME to FGPRD_KEY)
  const [productMapping, setProductMapping] = useState({});
  // State for storing style mapping (FGSTYLE_CODE to FGSTYLE_ID)
  const [styleMapping, setStyleMapping] = useState({});
  // State for storing type mapping (FGTYPE_NAME to FGTYPE_KEY)
  const [typeMapping, setTypeMapping] = useState({});
  // State for storing shade mapping (FGSHADE_NAME to FGSHADE_KEY)
  const [shadeMapping, setShadeMapping] = useState({});
  // State for storing lot no mapping (FGPTN_NAME to FGPTN_KEY)
  const [lotNoMapping, setLotNoMapping] = useState({});
  
  const [newItemData, setNewItemData] = useState({
    product: '',
    barcode: '',
    style: '',
    type: '',
    shade: '',
    qty: '',
    mrp: '',
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

  // Parse ORDBKSTYLIST data for table - initial data
  const initialTableData = formData.apiResponseData?.ORDBKSTYLIST ? formData.apiResponseData.ORDBKSTYLIST.map((item, index) => ({
    id: item.ORDBKSTY_ID || index + 1,
    BarCode: item.FGITEM_KEY || "-",
    product: item.PRODUCT || "-",
    style: item.STYLE || "-",
    type: item.TYPE || "-",
    shade: item.SHADE || "-",
    lotNo: formData.SEASON || "-",
    qty: parseFloat(item.ITMQTY) || 0,
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
    FGSTYLE_ID: item.FGSTYLE_ID
  })) : [];

  // Use updatedTableData if available, otherwise use initial data
  const tableData = updatedTableData.length > 0 ? updatedTableData : initialTableData;

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
      DISCOUNT: totalDiscount
    }));
  };

  // Calculate totals whenever tableData changes
  useEffect(() => {
    calculateTotals();
  }, [tableData]);

  // Fetch Product dropdown data from API
  const fetchProductData = async () => {
    try {
      const payload = {
        "FLAG": ""
      };

      console.log('Fetching product data with payload:', payload);

      const response = await axiosInstance.post('/Product/GetFgPrdDrp', payload);
      console.log('Product API Response:', response.data);

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
        
        console.log('Product mapping:', mapping);
      } else {
        console.error('No product data found in response');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  // Enhanced fetchStyleData function to get FGPRD_KEY
  const fetchStyleData = async (fgprdKey) => {
    if (!fgprdKey) return;

    try {
      const payload = {
        "FGSTYLE_ID": 0,
        "FGPRD_KEY": fgprdKey,
        "FGSTYLE_CODE": "",
        "FLAG": ""
      };

      console.log('Fetching style data with payload:', payload);

      const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);
      console.log('Style API Response:', response.data);

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
        
        console.log('Style mapping:', styleIdMapping);
        console.log('Product key mapping:', productKeyMapping);
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

  // Fetch Type dropdown data based on FGSTYLE_ID
  const fetchTypeData = async (fgstyleId) => {
    if (!fgstyleId) return;

    try {
      const payload = {
        "FGSTYLE_ID": fgstyleId,
        "FLAG": ""
      };

      console.log('Fetching type data with payload:', payload);

      const response = await axiosInstance.post('/FgType/GetFgTypeDrp', payload);
      console.log('Type API Response:', response.data);

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
        console.log('Type mapping:', mapping);
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

  // Fetch Shade dropdown data based on FGSTYLE_ID
  const fetchShadeData = async (fgstyleId) => {
    if (!fgstyleId) return;

    try {
      const payload = {
        "FGSTYLE_ID": fgstyleId,
        "FLAG": ""
      };

      console.log('Fetching shade data with payload:', payload);

      const response = await axiosInstance.post('/Fgshade/GetFgshadedrp', payload);
      console.log('Shade API Response:', response.data);

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
        console.log('Shade mapping:', mapping);
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

  // Enhanced fetchLotNoData function
  const fetchLotNoData = async (fgstyleId) => {
    if (!fgstyleId) return;

    try {
      const payload = {
        "FGSTYLE_ID": fgstyleId,
        "FLAG": ""
      };

      console.log('Fetching lot no data with payload:', payload);

      const response = await axiosInstance.post('/Fgptn/GetFgptnDrp', payload);
      console.log('Lot No API Response:', response.data);

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
        console.log('Lot No mapping:', mapping);
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

  // Fetch Size Details from API when Add Qty button is clicked
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
        showSnackbar("Required data not available. Please check Product and Style selection.", 'error');
        return;
      }

      const payload = {
        "FGSTYLE_ID": fgstyleId,
        "FGPRD_KEY": fgprdKey,
        "FGTYPE_KEY": fgtypeKey,
        "FGSHADE_KEY": fgshadeKey,
        "FGPTN_KEY": fgptnKey,
        "FLAG": ""
      };

      console.log('Fetching size details with payload:', payload);

      const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', payload);
      console.log('Size Details API Response:', response.data);

      if (response.data.DATA && response.data.DATA.length > 0) {
        const transformedSizeDetails = response.data.DATA.map((size, index) => ({
          STYSIZE_ID: size.STYSIZE_ID || index + 1,
          STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
          FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
          QTY: 0,
          ITM_AMT: 0,
          ORDER_QTY: 0
        }));

        setSizeDetailsData(transformedSizeDetails);
        console.log('Transformed size details:', transformedSizeDetails);
        
        showSnackbar("Size details loaded successfully! Please enter quantities for each size.");
      } else {
        showSnackbar("No size details found for the selected combination.", 'warning');
        setSizeDetailsData([]);
      }
    } catch (error) {
      console.error('Error fetching size details:', error);
      showSnackbar("Error loading size details. Please try again.", 'error');
    }
  };

  // Handle product selection change
  const handleProductChange = async (event, value) => {
    setSelectedProduct(value);
    
    if (isAddingNew || isEditingSize) {
      setNewItemData(prev => ({ ...prev, product: value }));
      
      if (value && productMapping[value]) {
        const fgprdKey = productMapping[value];
        console.log('Selected product FGPRD_KEY:', fgprdKey);
        
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
      } else {
        setStyleOptions([]);
        setTypeOptions([]);
        setShadeOptions([]);
        setLotNoOptions([]);
        setSizeDetailsData([]);
      }
    }
  };

  // Handle style selection change
  const handleStyleChange = async (event, value) => {
    setSelectedStyle(value);
    
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
      
      if (value && styleMapping[value]) {
        const fgstyleId = styleMapping[value];
        console.log('Selected style FGSTYLE_ID:', fgstyleId);
        
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
    }
  };

  // Handle shade selection change
  const handleShadeChange = (event, value) => {
    if (isAddingNew || isEditingSize) {
      setNewItemData(prev => ({ ...prev, shade: value }));
      setSizeDetailsData([]);
    }
  };

  // Handle lot no selection change
  const handleLotNoChange = (event, value) => {
    if (isAddingNew || isEditingSize) {
      setNewItemData(prev => ({ ...prev, lotNo: value }));
      setSizeDetailsData([]);
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
    
    console.log("Selected row:", row);
    console.log("Size details:", sizeDetails);
  };

  // Populate form fields with row data for editing
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
      mrp: row.rate?.toString() || '',
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
  };

  // Initialize with first row's size details when component loads
  React.useEffect(() => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItemData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Add Item button click
  const handleAddItem = async () => {
    setIsAddingNew(true);
    setSizeDetailsData([]);
    
    await fetchProductData();
    
    setNewItemData({
      product: '',
      barcode: '',
      style: '',
      type: '',
      shade: '',
      qty: '',
      mrp: '',
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
    
    setStyleOptions([]);
    setTypeOptions([]);
    setShadeOptions([]);
    setLotNoOptions([]);
    
    showSnackbar('Add new item mode enabled');
  };

  // Enhanced handleConfirmAdd function with validation
  const handleConfirmAdd = () => {
    
    // Validation
    if (!newItemData.product || !newItemData.style) {
      showSnackbar("Please fill required fields: Product and Style", 'error');
      return;
    }

    

    if (sizeDetailsData.length === 0) {
      showSnackbar("Please load size details first by clicking 'Add Qty' button", 'error');
      return;
    }

    const sizesWithZeroQty = sizeDetailsData.filter(size => !size.QTY || size.QTY === 0);
    if (sizesWithZeroQty.length > 0) {
      showSnackbar("Please enter quantity for all sizes before confirming", 'error');
      return;
    }

    const fgprdKey = productMapping[newItemData.product] || productMapping[newItemData.style] || "";
    const fgptnKey = lotNoMapping[newItemData.lotNo] || "";

    console.log('Product and Lot No Keys:', {
      product: newItemData.product,
      fgprdKey,
      lotNo: newItemData.lotNo,
      fgptnKey
    });

    const totalQty = sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
    const mrp = parseFloat(newItemData.mrp) || 0;
    const totalAmount = sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.ITM_AMT) || 0), 0);
    const discount = parseFloat(newItemData.discount) || 0;
    const netAmount = totalAmount - discount;

    const newItem = {
      id: Date.now(),
      BarCode: newItemData.barcode || "-",
      product: newItemData.product,
      style: newItemData.style || "-",
      type: newItemData.type || "-",
      shade: newItemData.shade || "-",
      lotNo: newItemData.lotNo || "-",
      qty: totalQty,
      rate: mrp,
      amount: totalAmount,
      varPer: parseFloat(newItemData.varPer) || 0,
      varQty: 0,
      varAmt: 0,
      discAmt: discount,
      netAmt: netAmount,
      distributer: "-",
      set: parseFloat(newItemData.sets) || 0,
      originalData: {
        ORDBKSTYSZLIST: sizeDetailsData,
        FGPRD_KEY: fgprdKey,
        FGPTN_KEY: fgptnKey
      },
      FGSTYLE_ID: styleMapping[newItemData.style] || null,
      FGPRD_KEY: fgprdKey,
      FGPTN_KEY: fgptnKey
    };

    const newTableData = [...tableData, newItem];
    setUpdatedTableData(newTableData);

    setFormData(prev => ({
      ...prev,
      apiResponseData: {
        ...prev.apiResponseData,
        ORDBKSTYLIST: [...(prev.apiResponseData?.ORDBKSTYLIST || []), {
          ORDBKSTY_ID: newItem.id,
          FGITEM_KEY: newItem.BarCode,
          PRODUCT: newItem.product,
          STYLE: newItem.style,
          TYPE: newItem.type,
          SHADE: newItem.shade,
          ITMQTY: newItem.qty,
          ITMRATE: newItem.rate,
          ITMAMT: newItem.amount,
          DLV_VAR_PERC: newItem.varPer,
          DLV_VAR_QTY: newItem.varQty,
          DISC_AMT: newItem.discAmt,
          NET_AMT: newItem.netAmt,
          DISTBTR: newItem.distributer,
          SETQTY: newItem.set,
          ORDBKSTYSZLIST: sizeDetailsData,
          FGSTYLE_ID: newItem.FGSTYLE_ID,
          FGPRD_KEY: fgprdKey,
          FGPTN_KEY: fgptnKey
        }]
      }
    }));

    setIsAddingNew(false);
    setNewItemData({
      product: '',
      barcode: '',
      style: '',
      type: '',
      shade: '',
      qty: '',
      mrp: '',
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
    setSizeDetailsData([]);

    showSnackbar("Item added successfully!");
  };

  const handleCancelAdd = () => {
   
    setIsAddingNew(false);
    setNewItemData({
      product: '',
      barcode: '',
      style: '',
      type: '',
      shade: '',
      qty: '',
      mrp: '',
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
    setSizeDetailsData([]);
    showSnackbar('Add item cancelled');
  };

  const handleEditCancel = () => {
  setShowValidationErrors(false);
  setIsEditingSize(false);
  setNewItemData({
    product: '',
    barcode: '',
    style: '',
    type: '',
    shade: '',
    qty: '',
    mrp: '',
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
};

  const handleEditItem = () => {
    if (!selectedRow) {
      showSnackbar("Please select an item to edit", 'error');
      return;
    }
    
    if (isEditingSize) {
      const updatedTable = tableData.map(row => {
        if (row.id === selectedRow) {
          const totalSizeQty = sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
          const rate = row.rate || 0;
          const amount = totalSizeQty * rate;
          const discount = row.discAmt || 0;
          const netAmount = amount - discount;

          return {
            ...row,
            qty: totalSizeQty,
            amount: amount,
            netAmt: netAmount,
            originalData: {
              ...row.originalData,
              ORDBKSTYSZLIST: sizeDetailsData
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
              const rate = item.ITMRATE || 0;
              const amount = totalSizeQty * rate;
              const discount = item.DISC_AMT || 0;
              const netAmount = amount - discount;

              return {
                ...item,
                ITMQTY: totalSizeQty,
                ITMAMT: amount,
                NET_AMT: netAmount,
                ORDBKSTYSZLIST: sizeDetailsData
              };
            }
            return item;
          }) || []
        }
      }));
      
      showSnackbar("Changes saved successfully!");
    } else {
      if (selectedRow) {
        const selectedRowData = tableData.find(row => row.id === selectedRow);
        if (selectedRowData) {
          populateFormFields(selectedRowData);
        }
      }
      showSnackbar('Edit mode enabled for selected item');
    }
    
    setIsEditingSize(!isEditingSize);
  };

  const handleDeleteItem = () => {
    if (!selectedRow) {
      showSnackbar("Please select an item to delete", 'error');
      return;
    }
    
    const newTableData = tableData.filter(row => row.id !== selectedRow);
    setUpdatedTableData(newTableData);
    
    setFormData(prev => ({
      ...prev,
      apiResponseData: {
        ...prev.apiResponseData,
        ORDBKSTYLIST: (prev.apiResponseData?.ORDBKSTYLIST || []).filter(item => 
          item.ORDBKSTY_ID !== selectedRow
        )
      }
    }));

    if (newTableData.length > 0) {
      const firstRow = newTableData[0];
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

  const handleSizeQtyChange = (index, newQty) => {
    const updatedSizeDetails = [...sizeDetailsData];
    const qty = parseFloat(newQty) || 0;
    const mrp = parseFloat(newItemData.mrp) || 0;
    const amount = qty * mrp;
    
    updatedSizeDetails[index] = {
      ...updatedSizeDetails[index],
      QTY: qty,
      ITM_AMT: amount,
      ORDER_QTY: qty
    };

    setSizeDetailsData(updatedSizeDetails);
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

  // Determine if form fields should be disabled
  const shouldDisableFields = () => {
    return !(isAddingNew || isEditingSize);
  };

const getFieldError = (fieldName) => {
    if (!showValidationErrors) return '';
    
    const requiredFields = {
      'product': 'Product',
      'style': 'Style',
      // 'qty': 'Quantity'
    };

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
            <TableContainer sx={{ maxHeight: 200 }}>
              <Table stickyHeader size="small">
                <TableHead>
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
                </TableHead>

                <TableBody>
                  {tableData.length > 0 ? (
                    tableData.map((row, index) => (
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
                          No items found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* CRUD Buttons and Totals */}
        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
                
                color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            disabled={isFormDisabled || isEditingSize}
            sx={{
              
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
            }}
          >
            Add
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditItem}
            disabled={isFormDisabled}
            sx={{
              
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
            }}
          >
            {isEditingSize ? 'Save' : 'Edit'}
          </Button>

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteItem}
            disabled={isFormDisabled || isEditingSize}
            sx={{
              
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
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
              <AutoVibe
                id="Product"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={productOptions}
                label="Product"
                name="product"
                value={isAddingNew || isEditingSize ? newItemData.product : selectedProduct}
                onChange={handleProductChange}
                  sx={{
    ...DropInputSx,
    '& .MuiFilledInput-root': {
      ...DropInputSx['& .MuiFilledInput-root'],
      border: getFieldError('product') ? '1px solid #f44336' : '1px solid #e0e0e0',
    }
  }}
                error={!!getFieldError('product')}
                helperText={getFieldError('product')}
              />
              <TextField 
                label="BarCode" 
                variant="filled" 
                disabled={shouldDisableFields()}
                name="barcode"
                value={isAddingNew || isEditingSize ? newItemData.barcode : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
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
      border: getFieldError('style') ? '1px solid #f44336' : '1px solid #e0e0e0', // ✅ 'style' use karo
    }
  }}
  error={!!getFieldError('style')}
  helperText={getFieldError('style')}
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
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
                error={!!getFieldError('mrp')}
                helperText={getFieldError('mrp')}
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
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
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
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={fetchSizeDetails}
                      disabled={!newItemData.product || !newItemData.style}
                      sx={{ minWidth: '80px', height: '36px' }}
                    >
                      Add Qty
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={isAddingNew ? handleCancelAdd : () => {
                        setIsEditingSize(false);
                        setNewItemData({
                          product: '',
                          barcode: '',
                          style: '',
                          type: '',
                          shade: '',
                          qty: '',
                          mrp: '',
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
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Barcode</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '6px 8px', backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>Order</TableCell>
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
                          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.ITM_AMT || 0}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.FGSTYLE_ID || "-"}</TableCell>
                          <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.QTY}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            {isAddingNew ? "Click 'Add Qty' to load size details" : "No size details available"}
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
    variant="contained" 
    color="primary" 
    onClick={isAddingNew ? handleConfirmAdd : (isEditingSize ? handleEditItem : null)}
    disabled={!(isAddingNew || isEditingSize)} // BY DEFAULT DISABLED
    sx={{ minWidth: '60px', height: '36px' }}
  >
    {isAddingNew ? 'Confirm' : (isEditingSize ? 'Save' : 'Confirm')}
  </Button>
  <Button 
    variant="outlined" 
    color="secondary" 
    onClick={isAddingNew ? handleCancelAdd : (isEditingSize ? handleEditCancel : onCancel)}
    disabled={!(isAddingNew || isEditingSize)} // BY DEFAULT DISABLED
  >
    Cancel
  </Button>
</Stack>
        
      </Box>
    </Box>
  )
}

export default Stepper2;