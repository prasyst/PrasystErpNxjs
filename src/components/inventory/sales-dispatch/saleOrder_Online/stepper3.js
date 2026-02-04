'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, TextField, Typography, Button, Stack, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tabs, Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import AutoVibe from '@/GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '@/lib/axios';

// TabPanel component for rendering tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const Stepper3 = ({ formData, setFormData, isFormDisabled, mode, onSubmit, onPrev, onCancel, showSnackbar }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State for dropdown options
  const [termGrpOptions, setTermGrpOptions] = useState([]);
  const [termGrpMapping, setTermGrpMapping] = useState({});
  const [termGrpNameToKey, setTermGrpNameToKey] = useState({});
  const [termOptions, setTermOptions] = useState([]);
  const [termMapping, setTermMapping] = useState({});
  const [termNameToKey, setTermNameToKey] = useState({});
  const [termValFixMapping, setTermValFixMapping] = useState({});
  const [discPtnOptions, setDiscPtnOptions] = useState([]);
  const [selectedDiscPtn, setSelectedDiscPtn] = useState('');

  // Initialize table data from formData
  const [tableData, setTableData] = useState([]);

  // State for Order Amount (from Stepper2's TOTAL_AMOUNT)
  const [orderAmount, setOrderAmount] = useState(0);

  // State for GST Summary and GST Table Data
  const [gstSummary, setGstSummary] = useState({
    sgstRate: 0,
    cgstRate: 0,
    igstRate: 0,
    sgstAmount: 0,
    cgstAmount: 0,
    igstAmount: 0,
    taxableAmount: 0,
    totalGstAmount: 0
  });

  // State for GST Table Data - Will be used to populate ORDBKGSTLIST
  const [gstTableData, setGstTableData] = useState([]);

  // NEW: State for top table data with proper tax rows
  const [topTableData, setTopTableData] = useState([]);

  // NEW: State for final amount calculation
  const [finalAmount, setFinalAmount] = useState(0);

  // NEW: Track discount amount from terms
  const [totalDiscountFromTerms, setTotalDiscountFromTerms] = useState(0);

  // NEW: Track if GST calculation is in progress to prevent infinite loops
  const [isGstCalculating, setIsGstCalculating] = useState(false);

  // Form state
  const [termFormData, setTermFormData] = useState({
    TERMGRP_NAME: '',
    TERM_NAME: '',
    TERM_PERCENT: '',
    TERM_FIX_AMT: '',
    TERM_DESC: '',
    TAXABLE_AMT: '',
    TAX_AMT: '',
    TAX_RATE: '',
    TAX_NAME: '',
    TAXGRP_NAME: '0'
  });

  // State to track current term's TERM_VAL_FIX value
  const [currentTermValFix, setCurrentTermValFix] = useState('0');

  // Style definitions
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

  const smallInputSx = {
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
      maxWidth: '150px',
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

  // NEW: Function to calculate total discount from terms - FIXED to prevent infinite loop
  const calculateTotalDiscountFromTerms = useCallback((tableData) => {
    return tableData
      .filter(row => !row.originalData?.isGstRow &&
        (!row.originalData?.DBFLAG || row.originalData.DBFLAG !== 'D') &&
        row.type === "Term")
      .reduce((sum, row) => sum + (parseFloat(row.taxAmount) || 0), 0);
  }, []);

  // NEW: Function to transform GST data for top table with proper IGST support - FIXED
  const transformGSTDataForTopTable = useCallback((gstData) => {
    if (!gstData || gstData.length === 0) return [];

    const gstType = formData.GST_TYPE; // 'S' for State GST, 'I' for IGST
    const topTableRows = [];

    // Calculate totals across all HSN codes
    let totalNetAmount = 0;
    let totalSgstAmount = 0;
    let totalCgstAmount = 0;
    let totalIgstAmount = 0;

    gstData.forEach(item => {
      totalNetAmount += item.netAmount || 0;
      totalSgstAmount += item.sgstAmount || 0;
      totalCgstAmount += item.cgstAmount || 0;
      totalIgstAmount += item.igstAmount || 0;
    });

    console.log(`Transforming GST data for type: ${gstType}`, {
      totalNetAmount,
      totalSgstAmount,
      totalCgstAmount,
      totalIgstAmount
    });

    if (gstType === "I" || gstType === "IGST") {
      // IGST - Single row for all HSN codes
      const igstRate = gstData.length > 0 ? gstData[0].igstRate : 0;
      topTableRows.push({
        id: `igst_total_${Date.now()}`,
        type: "Tax",
        taxType: "GST",
        tax: "IGST",
        rate: igstRate,
        taxable: totalNetAmount,
        taxAmount: totalIgstAmount,
        termGroup: "",
        term: "",
        termPercent: 0,
        termR: 0,
        originalData: {
          isGstRow: true,
          gstType: "IGST"
        }
      });
      console.log(`Added IGST row: Rate=${igstRate}, Amount=${totalIgstAmount}`);
    } else {
      // CGST + SGST - Two rows for all HSN codes
      const cgstRate = gstData.length > 0 ? gstData[0].cgstRate : 0;
      const sgstRate = gstData.length > 0 ? gstData[0].sgstRate : 0;

      topTableRows.push({
        id: `cgst_total_${Date.now()}`,
        type: "Tax",
        taxType: "GST",
        tax: "CGST",
        rate: cgstRate,
        taxable: totalNetAmount,
        taxAmount: totalCgstAmount,
        termGroup: "",
        term: "",
        termPercent: 0,
        termR: 0,
        originalData: {
          isGstRow: true,
          gstType: "CGST"
        }
      });

      topTableRows.push({
        id: `sgst_total_${Date.now() + 1}`,
        type: "Tax",
        taxType: "GST",
        tax: "SGST",
        rate: sgstRate,
        taxable: totalNetAmount,
        taxAmount: totalSgstAmount,
        termGroup: "",
        term: "",
        termPercent: 0,
        termR: 0,
        originalData: {
          isGstRow: true,
          gstType: "SGST"
        }
      });
      console.log(`Added State GST rows: CGST Rate=${cgstRate}, SGST Rate=${sgstRate}`);
    }

    return topTableRows;
  }, [formData.GST_TYPE]);

  // NEW: Enhanced function to fetch GST rates and populate GST table with proper IGST support
  const fetchGSTRates = useCallback(async () => {
    if (!formData.apiResponseData?.ORDBKSTYLIST || formData.apiResponseData.ORDBKSTYLIST.length === 0) {
      showSnackbar('No items found to calculate GST', 'error');
      return;
    }

    if (isGstCalculating) {
      console.log('GST calculation already in progress, skipping...');
      return;
    }

    try {
      setIsGstCalculating(true);
      const currentDate = new Date().toISOString().replace('T', ' ').split('.')[0];
      const gstTableItems = [];
      const processedStyles = new Set(); // Track processed FGSTYLE_ID to avoid duplicates

      let totalTaxableAmount = 0;
      let totalSgstAmount = 0;
      let totalCgstAmount = 0;
      let totalIgstAmount = 0;
      let totalGstAmount = 0;
      let totalItemAmount = 0;
      let totalDiscAmount = 0;
      let totalNetAmount = 0;

      // Calculate total discount from terms
      const discountFromTerms = calculateTotalDiscountFromTerms(topTableData);
      setTotalDiscountFromTerms(discountFromTerms);

      console.log('Total discount from terms:', discountFromTerms);
      console.log('Current GST Type:', formData.GST_TYPE);

      // Group items by FGSTYLE_ID to avoid duplicate GST entries
      const itemsByStyle = {};
      formData.apiResponseData.ORDBKSTYLIST.forEach(item => {
        if (item.DBFLAG === 'D') return;

        const fgstyleId = item.FGSTYLE_ID || 0;
        if (!itemsByStyle[fgstyleId]) {
          itemsByStyle[fgstyleId] = {
            items: [],
            totalQty: 0,
            totalAmount: 0,
            hsnCode: item.HSNCODE_KEY || "IG001"
          };
        }

        itemsByStyle[fgstyleId].items.push(item);
        itemsByStyle[fgstyleId].totalQty += parseFloat(item.ITMQTY) || 0;
        itemsByStyle[fgstyleId].totalAmount += parseFloat(item.ITMAMT) || 0;
      });

      console.log('Items grouped by FGSTYLE_ID:', itemsByStyle);

      // Process each style group
      for (const [fgstyleId, styleData] of Object.entries(itemsByStyle)) {
        if (processedStyles.has(fgstyleId)) continue;

        processedStyles.add(fgstyleId);

        // Take first item from the group for GST rate calculation
        const firstItem = styleData.items[0];

        const payload = {
          "MRP": parseFloat(firstItem.MRP) || 0,
          "WSP": parseFloat(firstItem.ITMRATE) || 0,
          "intStyle_Id": firstItem.FGSTYLE_ID || 0,
          "Byhsncode_key": 0,
          "HSNCODE_KEY": firstItem.HSNCODE_KEY || "IG001",
          "intGST_P_ID": 1
        };

        console.log('Fetching GST rates for style group:', payload);

        const response = await axiosInstance.post('/Hsncode/GetGstRates', payload);
        console.log('GST Rates API Response for style:', fgstyleId, response.data);

        if (response.data.RESPONSESTATUSCODE === 1 && response.data.DATA && response.data.DATA.length > 0) {
          const gstData = response.data.DATA[0];

          // FIXED: Use GST type from formData (S for State, I for IGST)
          const gstType = formData.GST_TYPE; // 'S' for State GST, 'I' for IGST

          // Calculate total amount for this style group
          const styleTotalAmount = styleData.totalAmount;
          const totalOrderAmount = orderAmount || formData.TOTAL_AMOUNT || 0;

          // Apply discount proportionally to this style group
          const styleDiscount = totalOrderAmount > 0 ?
            (styleTotalAmount / totalOrderAmount) * discountFromTerms : 0;
          const discountedStyleAmount = Math.max(0, styleTotalAmount - styleDiscount);

          let sgstAmount = 0;
          let cgstAmount = 0;
          let igstAmount = 0;
          let styleGstAmount = 0;

          // FIXED: Proper GST calculation based on GST_TYPE
          if (gstType === "I" || gstType === "IGST") {
            // IGST calculation
            const igstRate = parseFloat(gstData.IGST_RATE) || 0;
            igstAmount = (discountedStyleAmount * igstRate) / 100;
            styleGstAmount = igstAmount;
            console.log(`IGST Calculation for style ${fgstyleId}: ${discountedStyleAmount} * ${igstRate}% = ${igstAmount}`);
          } else {
            // CGST + SGST calculation (State GST)
            const sgstRate = parseFloat(gstData.SGST_RATE) || 0;
            const cgstRate = parseFloat(gstData.CGST_RATE) || 0;
            sgstAmount = (discountedStyleAmount * sgstRate) / 100;
            cgstAmount = (discountedStyleAmount * cgstRate) / 100;
            styleGstAmount = sgstAmount + cgstAmount;
            console.log(`State GST Calculation for style ${fgstyleId}: ${discountedStyleAmount} * (${sgstRate}% + ${cgstRate}%) = ${styleGstAmount}`);
          }

          // Check if this GST item already exists to determine DBFLAG
          const existingGstItem = formData.apiResponseData?.ORDBKGSTLIST?.find(
            gst => gst.FGSTYLE_ID === parseInt(fgstyleId)
          );

          const dbFlag = existingGstItem ? 'U' : 'I';

          // Create GST item in ORDBKGSTLIST format
          const gstItem = {
            DBFLAG: dbFlag,
            ORDBK_GST_ID: existingGstItem?.ORDBK_GST_ID || 0,
            GSTTIN_NO: "URD",
            ORDBK_KEY: formData.ORDBK_KEY,
            ORDBK_DT: currentDate,
            GST_TYPE: gstType === "I" || gstType === "IGST" ? "I" : "S", // FIXED: Proper GST_TYPE
            HSNCODE_KEY: gstData.HSNCODE_KEY || "IG001",
            HSN_CODE: gstData.HSN_CODE || "64021010",
            QTY: styleData.totalQty,
            UNIT_KEY: "UN005",
            GST_RATE_SLAB_ID: parseInt(gstData.GST_RATE_SLAB_ID) || 39,
            ITM_AMT: styleTotalAmount,
            DISC_AMT: styleDiscount,
            NET_AMT: discountedStyleAmount,
            SGST_RATE: (gstType === "I" || gstType === "IGST") ? 0 : parseFloat(gstData.SGST_RATE) || 0,
            SGST_AMT: sgstAmount,
            CGST_RATE: (gstType === "I" || gstType === "IGST") ? 0 : parseFloat(gstData.CGST_RATE) || 0,
            CGST_AMT: cgstAmount,
            IGST_RATE: (gstType === "I" || gstType === "IGST") ? parseFloat(gstData.IGST_RATE) || 0 : 0,
            IGST_AMT: igstAmount,
            ROUND_OFF: 0,
            OTHER_AMT: 0,
            PARTYDTL_ID: formData.PARTYDTL_ID || 106634,
            ADD_CESS_RATE: 0,
            ADD_CESS_AMT: 0,
            FGSTYLE_ID: parseInt(fgstyleId) // Store FGSTYLE_ID to track unique items
          };

          // Add item to GST table for display
          gstTableItems.push({
            id: existingGstItem?.ORDBK_GST_ID || Date.now() + parseInt(fgstyleId),
            hsnCode: gstData.HSN_CODE || '64021010',
            qty: styleData.totalQty,
            itemAmount: styleTotalAmount,
            discAmount: styleDiscount,
            netAmount: discountedStyleAmount,
            sgstRate: (gstType === "I" || gstType === "IGST") ? 0 : parseFloat(gstData.SGST_RATE) || 0,
            sgstAmount: sgstAmount,
            cgstRate: (gstType === "I" || gstType === "IGST") ? 0 : parseFloat(gstData.CGST_RATE) || 0,
            cgstAmount: cgstAmount,
            igstRate: (gstType === "I" || gstType === "IGST") ? parseFloat(gstData.IGST_RATE) || 0 : 0,
            igstAmount: igstAmount,
            cessRate: 0.00,
            cessAmount: 0.00,
            dbFlag: dbFlag,
            fgstyleId: parseInt(fgstyleId),
            // Store the original GST item for ORDBKGSTLIST
            originalGstData: gstItem
          });

          // Accumulate totals
          totalItemAmount += styleTotalAmount;
          totalDiscAmount += styleDiscount;
          totalNetAmount += discountedStyleAmount;
          totalSgstAmount += sgstAmount;
          totalCgstAmount += cgstAmount;
          totalIgstAmount += igstAmount;
          totalGstAmount += styleGstAmount;
        }
      }

      console.log('Total GST items generated:', gstTableItems.length);
      console.log('Processed styles:', processedStyles);

      // Update GST table data
      setGstTableData(gstTableItems);

      // Transform GST data for top table - FIXED: Now properly handles IGST vs State GST
      const topTableGstRows = transformGSTDataForTopTable(gstTableItems);

      // Combine existing non-GST terms with GST rows - FIXED: Preserve existing terms
      const existingNonGstRows = topTableData.filter(row => row.originalData?.isTermRow);
      const updatedTopTableData = [...existingNonGstRows, ...topTableGstRows];
      setTopTableData(updatedTopTableData);

      // Update GST summary with proper total calculation
      setGstSummary({
        sgstRate: gstTableItems.length > 0 ? gstTableItems[0].sgstRate : 0,
        cgstRate: gstTableItems.length > 0 ? gstTableItems[0].cgstRate : 0,
        igstRate: gstTableItems.length > 0 ? gstTableItems[0].igstRate : 0,
        sgstAmount: totalSgstAmount,
        cgstAmount: totalCgstAmount,
        igstAmount: totalIgstAmount,
        taxableAmount: totalNetAmount, // Use net amount after discount
        totalGstAmount: totalGstAmount
      });

      // Calculate final amount (Net Amount + Total GST Amount)
      const calculatedFinalAmount = totalNetAmount + totalGstAmount;
      setFinalAmount(calculatedFinalAmount);

      // Update formData with GST amounts and ORDBKGSTLIST
      const ordbkGstList = gstTableItems.map(item => item.originalGstData);

      setFormData(prev => ({
        ...prev,
        ORDBK_GST_AMT: totalGstAmount,
        ORDBK_SGST_AMT: totalSgstAmount,
        ORDBK_CGST_AMT: totalCgstAmount,
        ORDBK_IGST_AMT: totalIgstAmount,
        FINAL_AMOUNT: calculatedFinalAmount,
        apiResponseData: {
          ...prev.apiResponseData,
          ORDBKGSTLIST: ordbkGstList
        }
      }));

      console.log('Generated unique ORDBKGSTLIST with proper GST_TYPE:', ordbkGstList);
      console.log('Updated top table data with GST rows:', updatedTopTableData);
      // showSnackbar('GST calculated successfully with discount applied!');
    } catch (error) {
      console.error('Error fetching GST rates:', error);
      showSnackbar('Error calculating GST', 'error');
    } finally {
      setIsGstCalculating(false);
    }
  }, [formData, orderAmount, topTableData, calculateTotalDiscountFromTerms, transformGSTDataForTopTable, showSnackbar, isGstCalculating]);

  // In Stepper3 component, update the useEffect that loads data
  useEffect(() => {
    console.log('FormData changed in Stepper3:', formData.apiResponseData);

    // Get Order Amount from Stepper2's TOTAL_AMOUNT
    const stepper2TotalAmount = formData.TOTAL_AMOUNT || 0;
    setOrderAmount(stepper2TotalAmount);
    console.log('Order Amount from Stepper2:', stepper2TotalAmount);

    // FIXED: Load ORDBKTERMLIST data properly
    let termListData = [];
    if (formData.apiResponseData?.ORDBKTERMLIST && formData.apiResponseData.ORDBKTERMLIST.length > 0) {
      termListData = formData.apiResponseData.ORDBKTERMLIST.map((term, index) => ({
        id: term.ORDBKTERM_ID || `term_${index + 1}`,
        type: term.TAXGRP_NAME === 1 ? "Tax" : "Term",
        taxType: term.TAX_NAME || "",
        tax: term.TERM_DESC || "",
        rate: term.TAX_RATE || term.TERM_PERCENT || 0,
        taxable: term.TAXABLE_AMT || 0,
        taxAmount: term.TAX_AMT || 0,
        aot1A: term.AOT1_AMT || 0,
        aot2A: term.AOT2_AMT || 0,
        aot1: term.T_AOT1_R || 0,
        aot1R: term.T_AOT1_R || 0,
        aot2: term.T_AOT2_R || 0,
        aot2R: term.T_AOT2_R || 0,
        termGroup: term.TERMGRP_NAME || "",
        term: term.TERM_NAME || "",
        termPercent: term.TERM_PERCENT || 0,
        termR: term.TERM_FIX_AMT || 0,
        originalData: {
          ...term,
          isTermRow: true // Mark as term row to distinguish from GST rows
        }
      }));
      console.log('Transformed ORDBKTERMLIST data:', termListData);
    }

    // FIXED: Load ORDBKGSTLIST data if available and transform for top table
    let gstRows = [];
    if (formData.apiResponseData?.ORDBKGSTLIST && formData.apiResponseData.ORDBKGSTLIST.length > 0) {
      const gstDisplayData = formData.apiResponseData.ORDBKGSTLIST.map((gstItem, index) => ({
        id: gstItem.ORDBK_GST_ID || `gst_${index + 1}`,
        hsnCode: gstItem.HSN_CODE || '64021010',
        qty: parseFloat(gstItem.QTY) || 0,
        itemAmount: parseFloat(gstItem.ITM_AMT) || 0,
        discAmount: parseFloat(gstItem.DISC_AMT) || 0,
        netAmount: parseFloat(gstItem.NET_AMT) || 0,
        sgstRate: parseFloat(gstItem.SGST_RATE) || 0,
        sgstAmount: parseFloat(gstItem.SGST_AMT) || 0,
        cgstRate: parseFloat(gstItem.CGST_RATE) || 0,
        cgstAmount: parseFloat(gstItem.CGST_AMT) || 0,
        igstRate: parseFloat(gstItem.IGST_RATE) || 0,
        igstAmount: parseFloat(gstItem.IGST_AMT) || 0,
        cessRate: parseFloat(gstItem.ADD_CESS_RATE) || 0,
        cessAmount: parseFloat(gstItem.ADD_CESS_AMT) || 0,
        dbFlag: gstItem.DBFLAG || 'U',
        originalGstData: gstItem
      }));
      setGstTableData(gstDisplayData);

      // Transform existing GST data for top table
      gstRows = transformGSTDataForTopTable(gstDisplayData);

      // Calculate final amount from GST data
      const totalNetAmount = gstDisplayData.reduce((sum, item) => sum + item.netAmount, 0);
      const totalGstAmount = gstDisplayData.reduce((sum, item) => sum + item.sgstAmount + item.cgstAmount + item.igstAmount, 0);
      setFinalAmount(totalNetAmount + totalGstAmount);

      console.log('Loaded existing ORDBKGSTLIST data:', gstDisplayData);
    }

    // FIXED: Combine terms and GST rows for top table
    const combinedTopTableData = [...termListData, ...gstRows];
    setTopTableData(combinedTopTableData);

    console.log('Final combined top table data:', combinedTopTableData);

    // Calculate and set initial discount from terms
    const initialDiscount = calculateTotalDiscountFromTerms(combinedTopTableData);
    setTotalDiscountFromTerms(initialDiscount);

  }, [formData.apiResponseData, formData.TOTAL_AMOUNT, calculateTotalDiscountFromTerms, transformGSTDataForTopTable]);



  // Calculate current order amount based on all terms
  const calculateCurrentOrderAmount = () => {
    let currentAmount = orderAmount;

    topTableData.forEach(item => {
      if (!item.originalData?.isGstRow &&
        (!item.originalData?.DBFLAG || item.originalData.DBFLAG !== 'D')) {
        // Subtract tax amount from order amount for non-GST terms
        currentAmount -= parseFloat(item.taxAmount) || 0;
      }
    });

    return Math.max(0, currentAmount); // Ensure non-negative
  };

  // Calculate tax amount based on current term configuration
  const calculateTaxAmountForCurrentTerm = () => {
    const currentOrderAmount = calculateCurrentOrderAmount();
    let taxableAmount = currentOrderAmount;
    let taxAmount = 0;

    if (currentTermValFix === '0') {
      // Percentage based calculation
      const percent = parseFloat(termFormData.TERM_PERCENT) || 0;
      taxAmount = (currentOrderAmount * percent) / 100;
    } else if (currentTermValFix === '1') {
      // Fix amount based calculation
      taxAmount = parseFloat(termFormData.TERM_FIX_AMT) || 0;
    }

    return { taxableAmount, taxAmount };
  };

  // Auto-update tax amount when term or values change
  const updateTaxAmountFields = () => {
    const { taxableAmount, taxAmount } = calculateTaxAmountForCurrentTerm();

    setTermFormData(prev => ({
      ...prev,
      TAXABLE_AMT: taxableAmount.toString(),
      TAX_AMT: taxAmount.toString()
    }));
  };

  // Update formData when tableData changes with proper DBFLAG handling
  const updateFormDataWithTerms = (updatedTableData) => {
    console.log('Updating formData with terms, raw table data:', updatedTableData);

    // Filter out GST rows from top table data for ORDBKTERMLIST
    const nonGstRows = updatedTableData.filter(row => !row.originalData?.isGstRow);

    // Include ALL terms including deleted ones (they need to be sent to API with DBFLAG='D')
    const updatedTermList = nonGstRows.map(item => {
      // Get TERMGRP_KEY from mapping
      const termGrpKey = termGrpNameToKey[item.termGroup] || item.originalData?.TERMGRP_KEY || "";

      // Get TERM_KEY from mapping
      const termKey = termNameToKey[item.term] || item.originalData?.TERM_KEY || "";

      // Determine DBFLAG: if originalData has DBFLAG='D', keep it as 'D', otherwise use appropriate flag
      let dbFlag = item.originalData?.DBFLAG;

      if (!dbFlag) {
        // If no DBFLAG exists, determine based on whether it's new or existing
        dbFlag = item.originalData?.ORDBKTERM_ID > 0 ? 'U' : 'I';
      }

      console.log(`Term ${item.id}: DBFLAG = ${dbFlag}, ORDBKTERM_ID = ${item.originalData?.ORDBKTERM_ID}`);

      return {
        DBFLAG: dbFlag, // Use the determined DBFLAG
        TAXGRP_NAME: item.type === "Tax" ? 1 : 0,
        TAX_NAME: item.taxType || "",
        TAX_RATE: parseFloat(item.rate) || 0,
        TAX_FORM: "",
        T_AOT1_D: "",
        T_AOT1_R: parseFloat(item.aot1R) || 0,
        TERMGRP_NAME: item.termGroup || "",
        TERM_NAME: item.term || "",
        TERM_PERCENT: parseFloat(item.termPercent) || 0,
        TERM_FIX_AMT: parseFloat(item.termR) || 0,
        TERM_RATE: 0,
        TERM_PERQTY: 0,
        TERM_DESC: item.tax || "",
        TERM_OPR: "+",
        TAXABLE_AMT: parseFloat(item.taxable) || 0,
        TAX_AMT: parseFloat(item.taxAmount) || 0,
        AOT1_AMT: parseFloat(item.aot1A) || 0,
        TAX_KEY: "",
        STATUS: "1",
        TERM_KEY: termKey,
        TAXGRP_KEY: "",
        TERMGRP_KEY: termGrpKey,
        TERM_VAL_YN: item.term || "1",
        TAXGRP_ABRV: "",
        ORDBKTERM_ID: item.originalData?.ORDBKTERM_ID || 0,
        CHG_TAXABLE: " ",
        TAX_ABRV: "",
        T_AOT2_D: "",
        T_AOT2_R: parseFloat(item.aot2R) || 0,
        AOT2_AMT: parseFloat(item.aot2A) || 0,
        GST_APP: "Y"
      };
    });

    console.log('Final ORDBKTERMLIST for API:', updatedTermList);

    setFormData(prev => ({
      ...prev,
      apiResponseData: {
        ...prev.apiResponseData,
        ORDBKTERMLIST: updatedTermList
      }
    }));
  };

  // Determine if form fields should be disabled
  const shouldDisableFields = () => {
    return !(isAddingNew || isEditing);
  };

  // Function to determine field states based on TERM_VAL_FIX
  const getFieldStates = () => {
    const baseDisabled = shouldDisableFields();

    if (currentTermValFix === '0') {
      // TERM_VAL_FIX = "0" - Only Term Group and Term dropdown enabled
      return {
        termGrpDisabled: baseDisabled,
        termDisabled: baseDisabled,
        percentDisabled: true, // Always disabled for TERM_VAL_FIX = "0"
        fixAmtDisabled: true,  // Always disabled for TERM_VAL_FIX = "0"
        termDescDisabled: baseDisabled,
        taxableAmtDisabled: true, // Auto-calculated
        taxAmtDisabled: true, // Auto-calculated
        taxRateDisabled: baseDisabled
      };
    } else if (currentTermValFix === '1') {
      // TERM_VAL_FIX = "1" - Term Group, Term dropdown, and Fix Amount enabled
      return {
        termGrpDisabled: baseDisabled,
        termDisabled: baseDisabled,
        percentDisabled: true, // Always disabled for TERM_VAL_FIX = "1"
        fixAmtDisabled: baseDisabled, // Enabled for TERM_VAL_FIX = "1"
        termDescDisabled: baseDisabled,
        taxableAmtDisabled: true, // Auto-calculated
        taxAmtDisabled: true, // Auto-calculated
        taxRateDisabled: baseDisabled
      };
    } else {
      // Default case - all fields follow base disabled state
      return {
        termGrpDisabled: baseDisabled,
        termDisabled: baseDisabled,
        percentDisabled: baseDisabled,
        fixAmtDisabled: baseDisabled,
        termDescDisabled: baseDisabled,
        taxableAmtDisabled: baseDisabled,
        taxAmtDisabled: baseDisabled,
        taxRateDisabled: baseDisabled
      };
    }
  };

  // Fetch Term Group Data
  const fetchTermGrpData = async () => {
    try {
      const payload = {
        "Flag": ""
      };

      const response = await axiosInstance.post('/TermGrp/GetTermGrpDrp', payload);
      console.log('Term Group API Response:', response.data);

      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const termGrps = response.data.DATA.map(item => item.TERMGRP_NAME || '');
        setTermGrpOptions(termGrps);

        const nameToKeyMapping = {};
        response.data.DATA.forEach(item => {
          if (item.TERMGRP_NAME && item.TERMGRP_KEY) {
            nameToKeyMapping[item.TERMGRP_NAME] = item.TERMGRP_KEY;
          }
        });
        setTermGrpNameToKey(nameToKeyMapping);
        console.log('Term Group Name to Key mapping:', nameToKeyMapping);
      }
    } catch (error) {
      console.error('Error fetching term group data:', error);
      showSnackbar('Error loading term groups', 'error');
    }
  };

  // Fetch Term Data based on selected Term Group
  const fetchTermData = async (termGrpKey) => {
    if (!termGrpKey) {
      setTermOptions([]);
      setTermMapping({});
      setTermNameToKey({});
      setTermValFixMapping({});
      return;
    }

    try {
      const payload = {
        "Flag": "",
        "TermGrp_KEY": termGrpKey
      };

      console.log('Fetching terms with payload:', payload);

      const response = await axiosInstance.post('/Terms/GetTermsDrp', payload);
      console.log('Terms API Response:', response.data);

      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const terms = response.data.DATA.map(item => item.TERM_VAL_YN || '');
        setTermOptions(terms);

        const termPercentMapping = {};
        const termKeyMapping = {};
        const termValFixMapping = {};

        response.data.DATA.forEach(item => {
          if (item.TERM_VAL_YN && item.TERM_PERCENT !== undefined) {
            termPercentMapping[item.TERM_VAL_YN] = item.TERM_PERCENT;
          }
          if (item.TERM_VAL_YN && item.TERM_KEY) {
            termKeyMapping[item.TERM_VAL_YN] = item.TERM_KEY;
          }
          // Store TERM_VAL_FIX value
          if (item.TERM_VAL_YN && item.TERM_VAL_FIX !== undefined) {
            termValFixMapping[item.TERM_VAL_YN] = item.TERM_VAL_FIX.toString();
          }
        });

        setTermMapping(termPercentMapping);
        setTermNameToKey(termKeyMapping);
        setTermValFixMapping(termValFixMapping);

        console.log('Term Percent mapping:', termPercentMapping);
        console.log('Term Key mapping:', termKeyMapping);
        console.log('TERM_VAL_FIX mapping:', termValFixMapping);
      } else {
        setTermOptions([]);
        setTermMapping({});
        setTermNameToKey({});
        setTermValFixMapping({});
      }
    } catch (error) {
      console.error('Error fetching term data:', error);
      showSnackbar('Error loading terms', 'error');
      setTermOptions([]);
      setTermMapping({});
      setTermNameToKey({});
      setTermValFixMapping({});
    }
  };

  // Fetch Disc Ptn Data
  const fetchDiscPtnData = async () => {
    try {
      const patterns = ['Pattern 1', 'Pattern 2', 'Pattern 3'];
      setDiscPtnOptions(patterns);
    } catch (error) {
      console.error('Error fetching disc pattern data:', error);
    }
  };

  // Initialize dropdown data
  useEffect(() => {
    fetchTermGrpData();
    fetchDiscPtnData();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handle input changes in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTermFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Recalculate tax amount when percentage or fix amount changes
    if (name === 'TERM_PERCENT' || name === 'TERM_FIX_AMT') {
      setTimeout(() => {
        updateTaxAmountFields();
      }, 100);
    }
  };

  // Handle Term Group change
  const handleTermGrpChange = (name, value) => {
    setTermFormData(prev => ({
      ...prev,
      [name]: value,
      TERM_NAME: '',
      TERM_PERCENT: '',
      TERM_FIX_AMT: '',
      TAXABLE_AMT: '',
      TAX_AMT: ''
    }));

    // Reset current TERM_VAL_FIX when term group changes
    setCurrentTermValFix('0');

    if (name === "TERMGRP_NAME" && value) {
      const termGrpKey = termGrpNameToKey[value];
      console.log(`Selected Term Group: ${value}, TERMGRP_KEY: ${termGrpKey}`);

      if (termGrpKey) {
        fetchTermData(termGrpKey);
      } else {
        setTermOptions([]);
        setTermMapping({});
        setTermNameToKey({});
        setTermValFixMapping({});
      }
    } else {
      setTermOptions([]);
      setTermMapping({});
      setTermNameToKey({});
      setTermValFixMapping({});
    }
  };

  // Handle Term change
  const handleTermChange = (name, value) => {
    setTermFormData(prev => ({
      ...prev,
      [name]: value,
      TERM_PERCENT: '',
      TERM_FIX_AMT: '',
      TAXABLE_AMT: '',
      TAX_AMT: ''
    }));

    if (name === "TERM_NAME" && value) {
      // Set TERM_PERCENT if available in mapping
      if (termMapping[value] !== undefined) {
        const termPercent = termMapping[value];
        setTermFormData(prev => ({
          ...prev,
          TERM_PERCENT: termPercent.toString()
        }));
      }

      // Set current TERM_VAL_FIX and handle field states
      const termValFix = termValFixMapping[value] || '0';
      setCurrentTermValFix(termValFix);

      console.log(`Selected Term: ${value}, TERM_VAL_FIX: ${termValFix}`);

      // Auto-calculate tax amount when term is selected
      setTimeout(() => {
        updateTaxAmountFields();
      }, 100);

      if (termValFix === '0') {
        // showSnackbar('Percentage mode: Tax amount will be calculated based on percentage');
      } else if (termValFix === '1') {
        // showSnackbar('Fixed Amount mode: You can enter fixed tax amount');
      }
    }
  };

  // Handle Fix Amount change
  const handleFixAmountChange = (e) => {
    const { name, value } = e.target;
    setTermFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Recalculate tax amount when fix amount changes
    setTimeout(() => {
      updateTaxAmountFields();
    }, 100);
  };

  // Handle Disc Ptn dropdown change
  const handleDiscPtnChange = (event, value) => {
    setSelectedDiscPtn(value);
  };

  // Open form for adding new item
  const handleAdd = () => {
    if (mode !== 'add' && mode !== 'edit') return;

    setIsAddingNew(true);
    setTermFormData({
      TERMGRP_NAME: '',
      TERM_NAME: '',
      TERM_PERCENT: '',
      TERM_FIX_AMT: '',
      TERM_DESC: '',
      TAXABLE_AMT: '',
      TAX_AMT: '',
      TAX_RATE: '',
      TAX_NAME: '',
      TAXGRP_NAME: '0'
    });
    // Reset TERM_VAL_FIX when adding new
    setCurrentTermValFix('0');
    // showSnackbar('Add new term mode enabled');
  };

  // Open form for editing existing item
  const handleEdit = () => {
    if (mode !== 'add' && mode !== 'edit') return;

    if (!selectedRow) {
      showSnackbar("Please select an item to edit", 'error');
      return;
    }

    setIsEditing(true);
    const selectedData = topTableData.find(item => item.id === selectedRow);
    if (selectedData) {
      setTermFormData({
        TERMGRP_NAME: selectedData.termGroup || '',
        TERM_NAME: selectedData.term || '',
        TERM_PERCENT: selectedData.termPercent?.toString() || '',
        TERM_FIX_AMT: selectedData.termR?.toString() || '',
        TERM_DESC: selectedData.tax || '',
        TAXABLE_AMT: selectedData.taxable?.toString() || '',
        TAX_AMT: selectedData.taxAmount?.toString() || '',
        TAX_RATE: selectedData.rate?.toString() || '',
        TAX_NAME: selectedData.taxType || '',
        TAXGRP_NAME: selectedData.type === "Tax" ? "1" : "0"
      });

      // Determine TERM_VAL_FIX for editing
      const termValFix = termValFixMapping[selectedData.term] || '0';
      setCurrentTermValFix(termValFix);
    }
    // showSnackbar('Edit mode enabled for selected item');
  };

  // Delete selected item with proper DBFLAG handling
  const handleDelete = () => {
    if (mode !== 'add' && mode !== 'edit') return;

    if (!selectedRow) {
      showSnackbar("Please select an item to delete", 'error');
      return;
    }

    const selectedData = topTableData.find(item => item.id === selectedRow);

    if (selectedData && selectedData.originalData?.isGstRow) {
      // GST rows cannot be deleted individually
      showSnackbar("GST rows cannot be deleted. Use 'Apply GST' to recalculate.", 'error');
      return;
    }

    const updatedTopTableData = topTableData.map(item => {
      if (item.id === selectedRow) {
        console.log(`Marking term ${item.id} for deletion, original ORDBKTERM_ID: ${item.originalData?.ORDBKTERM_ID}`);

        // If it's a new item (ORDBKTERM_ID = 0), we can remove it completely
        // If it's an existing item, mark it with DBFLAG='D'
        if (item.originalData?.ORDBKTERM_ID === 0) {
          return null; // Remove completely from array
        } else {
          return {
            ...item,
            originalData: {
              ...item.originalData,
              DBFLAG: 'D' // Set DBFLAG to 'D' for deletion
            }
          };
        }
      }
      return item;
    }).filter(Boolean); // Remove null entries

    console.log('After deletion, top table data:', updatedTopTableData);

    setTopTableData(updatedTopTableData);
    updateFormDataWithTerms(updatedTopTableData);

    // Clear selection
    setSelectedRow(null);

    // showSnackbar("Item marked for deletion! Click Submit to confirm deletion.");
  };

  // Save form data (add or edit) with proper tax amount calculation
  const handleSave = () => {
    let updatedTopTableData;

    // Get dynamic keys from mappings
    const termGrpKey = termGrpNameToKey[termFormData.TERMGRP_NAME] || "";
    const termKey = termNameToKey[termFormData.TERM_NAME] || "";

    console.log('Saving with dynamic keys:', {
      TERMGRP_NAME: termFormData.TERMGRP_NAME,
      TERMGRP_KEY: termGrpKey,
      TERM_NAME: termFormData.TERM_NAME,
      TERM_KEY: termKey,
      TERM_VAL_FIX: currentTermValFix
    });

    // Calculate final tax amount before saving
    const { taxableAmount, taxAmount } = calculateTaxAmountForCurrentTerm();

    if (isAddingNew) {
      // Add new item
      const newItem = {
        id: Date.now(),
        type: termFormData.TAXGRP_NAME === "1" ? "Tax" : "Term",
        taxType: termFormData.TAX_NAME,
        tax: termFormData.TERM_DESC,
        rate: parseFloat(termFormData.TAX_RATE) || parseFloat(termFormData.TERM_PERCENT) || 0,
        taxable: taxableAmount,
        taxAmount: taxAmount,
        aot1A: 0,
        aot2A: 0,
        aot1: 0,
        aot1R: 0,
        aot2: 0,
        aot2R: 0,
        termGroup: termFormData.TERMGRP_NAME,
        term: termFormData.TERM_NAME,
        termPercent: parseFloat(termFormData.TERM_PERCENT) || 0,
        termR: parseFloat(termFormData.TERM_FIX_AMT) || 0,
        originalData: {
          ORDBKTERM_ID: 0, // 0 for new items
          DBFLAG: 'I', // 'I' for insert
          TERMGRP_NAME: termFormData.TERMGRP_NAME,
          TERM_NAME: termFormData.TERM_NAME,
          TERM_PERCENT: parseFloat(termFormData.TERM_PERCENT) || 0,
          TERM_FIX_AMT: parseFloat(termFormData.TERM_FIX_AMT) || 0,
          TERM_DESC: termFormData.TERM_DESC,
          TAXABLE_AMT: taxableAmount,
          TAX_AMT: taxAmount,
          TAX_RATE: parseFloat(termFormData.TAX_RATE) || 0,
          TAX_NAME: termFormData.TAX_NAME,
          TAXGRP_NAME: termFormData.TAXGRP_NAME === "1" ? 1 : 0,
          TERM_VAL_YN: termFormData.TERM_NAME,
          TERMGRP_KEY: termGrpKey,
          TERM_KEY: termKey
        }
      };

      // Keep existing GST rows and add new term - FIXED: Properly preserve existing data
      const existingGstRows = topTableData.filter(row => row.originalData?.isGstRow);
      const existingNonGstRows = topTableData.filter(row => !row.originalData?.isGstRow);
      updatedTopTableData = [...existingNonGstRows, newItem, ...existingGstRows];
      setTopTableData(updatedTopTableData);
      // showSnackbar("Term added successfully!");
    } else if (isEditing) {
      // Update existing item
      updatedTopTableData = topTableData.map(item => {
        if (item.id === selectedRow) {
          // Preserve the original DBFLAG if it was 'D', otherwise set to 'U'
          const originalDbFlag = item.originalData?.DBFLAG;
          const newDbFlag = originalDbFlag === 'D' ? 'D' : 'U';

          console.log(`Editing term ${item.id}, DBFLAG: ${newDbFlag}`);

          return {
            ...item,
            type: termFormData.TAXGRP_NAME === "1" ? "Tax" : "Term",
            taxType: termFormData.TAX_NAME,
            tax: termFormData.TERM_DESC,
            rate: parseFloat(termFormData.TAX_RATE) || parseFloat(termFormData.TERM_PERCENT) || 0,
            taxable: taxableAmount,
            taxAmount: taxAmount,
            termGroup: termFormData.TERMGRP_NAME,
            term: termFormData.TERM_NAME,
            termPercent: parseFloat(termFormData.TERM_PERCENT) || 0,
            termR: parseFloat(termFormData.TERM_FIX_AMT) || 0,
            originalData: {
              ...item.originalData,
              DBFLAG: newDbFlag, // Preserve deletion status if it was marked for deletion
              TERMGRP_NAME: termFormData.TERMGRP_NAME,
              TERM_NAME: termFormData.TERM_NAME,
              TERM_PERCENT: parseFloat(termFormData.TERM_PERCENT) || 0,
              TERM_FIX_AMT: parseFloat(termFormData.TERM_FIX_AMT) || 0,
              TERM_DESC: termFormData.TERM_DESC,
              TAXABLE_AMT: taxableAmount,
              TAX_AMT: taxAmount,
              TAX_RATE: parseFloat(termFormData.TAX_RATE) || 0,
              TAX_NAME: termFormData.TAX_NAME,
              TAXGRP_NAME: termFormData.TAXGRP_NAME === "1" ? 1 : 0,
              TERM_VAL_YN: termFormData.TERM_NAME,
              TERMGRP_KEY: termGrpKey,
              TERM_KEY: termKey
            }
          };
        }
        return item;
      });
      setTopTableData(updatedTopTableData);
      // showSnackbar("Term updated successfully!");
    }

    // Update form data
    if (updatedTopTableData) {
      updateFormDataWithTerms(updatedTopTableData);
    }

    setIsAddingNew(false);
    setIsEditing(false);
    setSelectedRow(null);
    setTermFormData({
      TERMGRP_NAME: '',
      TERM_NAME: '',
      TERM_PERCENT: '',
      TERM_FIX_AMT: '',
      TERM_DESC: '',
      TAXABLE_AMT: '',
      TAX_AMT: '',
      TAX_RATE: '',
      TAX_NAME: '',
      TAXGRP_NAME: '0'
    });
    // Reset TERM_VAL_FIX after save
    setCurrentTermValFix('0');
  };

  // Close form without saving
  const handleCancel = () => {
    setIsAddingNew(false);
    setIsEditing(false);
    setSelectedRow(null);
    setTermFormData({
      TERMGRP_NAME: '',
      TERM_NAME: '',
      TERM_PERCENT: '',
      TERM_FIX_AMT: '',
      TERM_DESC: '',
      TAXABLE_AMT: '',
      TAX_AMT: '',
      TAX_RATE: '',
      TAX_NAME: '',
      TAXGRP_NAME: '0'
    });
    // Reset TERM_VAL_FIX after cancel
    setCurrentTermValFix('0');
    // showSnackbar('Operation cancelled');
  };

  // Select a row in the table
  const handleRowSelect = (row) => {
    setSelectedRow(row.id);
  };

  // Handle Apply button click
  const handleApply = () => {
    // showSnackbar('Changes applied successfully!');
  };

  // Table columns for the main grid
  const columns = [
    { id: 'type', label: 'Type', minWidth: 120 },
    { id: 'taxType', label: 'Tax Type', minWidth: 120 },
    { id: 'tax', label: 'Tax', minWidth: 80 },
    { id: 'rate', label: 'Rate', minWidth: 80, align: 'right' },
    { id: 'taxable', label: 'Taxable', minWidth: 100, align: 'right' },
    { id: 'taxAmount', label: 'Tax Amount', minWidth: 100, align: 'right' },
    { id: 'termGroup', label: 'Term Group', minWidth: 80, align: 'right' },
    { id: 'term', label: 'Term', minWidth: 80, align: 'right' },
    { id: 'termPercent', label: 'Tm(%)', minWidth: 80, align: 'right' },
    { id: 'termR', label: 'Term R', minWidth: 80, align: 'right' },
  ];

  // GST Summary Table columns
  const gstSummaryColumns = [
    { id: 'hsnCode', label: 'HSN Code', minWidth: 100, align: 'center' },
    { id: 'qty', label: 'Qty', minWidth: 80, align: 'right' },
    { id: 'itemAmount', label: 'Itm Amt', minWidth: 100, align: 'right' },
    { id: 'discAmount', label: 'Disc Amt', minWidth: 100, align: 'right' },
    { id: 'netAmount', label: 'Net Amt', minWidth: 100, align: 'right' },
    { id: 'sgstRate', label: 'SGST Rate', minWidth: 100, align: 'right' },
    { id: 'sgstAmount', label: 'SGST Amt', minWidth: 100, align: 'right' },
    { id: 'cgstRate', label: 'CGST Rate', minWidth: 100, align: 'right' },
    { id: 'cgstAmount', label: 'CGST Amt', minWidth: 100, align: 'right' },
    { id: 'igstRate', label: 'IGST Rate', minWidth: 100, align: 'right' },
    { id: 'igstAmount', label: 'IGST Amt', minWidth: 100, align: 'right' },
    { id: 'cessRate', label: 'Cess Rate', minWidth: 100, align: 'right' },
    { id: 'cessAmount', label: 'Cess Amt', minWidth: 100, align: 'right' },
  ];

  // Filter table data to show only non-deleted items in UI
  const displayTopTableData = topTableData.filter(item =>
    !item.originalData?.DBFLAG || item.originalData.DBFLAG !== 'D'
  );

  // Get current field states based on TERM_VAL_FIX
  const fieldStates = getFieldStates();

  // Calculate current order amount for display
  const currentOrderAmount = calculateCurrentOrderAmount();

  // Calculate totals for GST summary fields
  const totalItemAmount = gstTableData.reduce((sum, item) => sum + item.itemAmount, 0);
  const totalDiscAmount = gstTableData.reduce((sum, item) => sum + item.discAmount, 0);
  const totalNetAmount = gstTableData.reduce((sum, item) => sum + item.netAmount, 0);
  const totalSgstAmount = gstTableData.reduce((sum, item) => sum + item.sgstAmount, 0);
  const totalCgstAmount = gstTableData.reduce((sum, item) => sum + item.cgstAmount, 0);
  const totalIgstAmount = gstTableData.reduce((sum, item) => sum + item.igstAmount, 0);
  const totalCessAmount = gstTableData.reduce((sum, item) => sum + item.cessAmount, 0);

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
            <TableContainer sx={{ height: 160, overflowY: 'auto' }}>
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
                  {displayTopTableData.map((row, index) => (
                    <TableRow
                      key={row.id}
                      hover
                      onClick={() => handleRowSelect(row)}
                      sx={{
                        backgroundColor: selectedRow === row.id ? "#e3f2fd" : (index % 2 === 0 ? "#fafafa" : "#fff"),
                        "&:hover": { backgroundColor: "#e3f2fd" },
                        cursor: 'pointer',
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
                          {column.id === 'taxable' && row.originalData?.isGstRow
                            ? totalNetAmount.toFixed(2) // FIXED: Always show Net Amount from GST summary for GST rows
                            : (column.id === 'taxAmount' || column.id === 'rate' || column.id === 'termPercent' || column.id === 'termR' || column.id === 'taxable'
                              ? (row[column.id] || 0).toFixed(2)
                              : row[column.id] || "—"
                            )
                          }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {displayTopTableData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          No terms added
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* CRUD Buttons with NEW buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={isFormDisabled || isAddingNew || isEditing}
            sx={{
              backgroundColor: '#635bff',
              color: 'white',
              textTransform: 'none',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 50 },
              height: { xs: 40, sm: 46, md: 30 },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            Add
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            disabled={isFormDisabled || isAddingNew || isEditing || !selectedRow}
            sx={{
              backgroundColor: '#39ace2',
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
            Edit
          </Button>

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={isFormDisabled || isAddingNew || isEditing || !selectedRow}
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
            Del
          </Button>

          {/* Party Tax and Apply GST Buttons */}
          <Button
            variant="contained"
            disabled={isFormDisabled || isAddingNew || isEditing}
            sx={{
              backgroundColor: '#635bff',
              color: 'white',
              textTransform: 'none',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 80, sm: 90, md: 100 },
              height: { xs: 40, sm: 46, md: 30 },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            Party Tax
          </Button>

          <Button
            variant="contained"
            onClick={fetchGSTRates}
            disabled={isFormDisabled || isAddingNew || isEditing || isGstCalculating || formData.GST_APPL !== "Y"}
            sx={{
              backgroundColor: '#635bff',
              color: 'white',
              textTransform: 'none',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 80, sm: 90, md: 100 },
              height: { xs: 40, sm: 46, md: 30 },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            {isGstCalculating ? 'Calculating...' : 'Apply GST'}
          </Button>

          <Box sx={{ minWidth: 200, maxWidth: 250 }}>
            <AutoVibe
              id="DiscPtn"
              disabled={isFormDisabled || isAddingNew || isEditing}
              getOptionLabel={(option) => option || ''}
              options={discPtnOptions}
              label="Disc Ptn"
              name="discPtn"
              value={selectedDiscPtn}
              onChange={handleDiscPtnChange}
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
            />
          </Box>

          {/* Order Amount Text Field */}
          <TextField
            label="Order Amount"
            variant="filled"
            value={finalAmount.toFixed(2)}
            disabled
            sx={{
              ...textInputSx,
              minWidth: 150,
              '& .MuiInputBase-input': {
                fontWeight: 'bold',
                color: '#1976d2'
              }
            }}
            inputProps={{
              style: {
                padding: '0px 0px',
                paddingTop: '8px',
                fontSize: '12px',
              },
            }}
          />
        </Stack>

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 1 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="sales order tabs">
            <Tab label="Calc Terms" sx={{ textTransform: 'none' }} />
            <Tab label="GST Summary" sx={{ textTransform: 'none' }} />
            <Tab label="Non-Calc Terms" sx={{ textTransform: 'none' }} />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabIndex} index={0}>
          <Grid container spacing={1} alignItems="center" >
            <Grid size={{ xs: 12, sm: 6, md: 10 }}>
              <AutoVibe
                id="TermGrp"
                disabled={fieldStates.termGrpDisabled}
                getOptionLabel={(option) => option || ''}
                options={termGrpOptions}
                label="Term Grp"
                name="TERMGRP_NAME"
                value={termFormData.TERMGRP_NAME}
                onChange={(event, value) => handleTermGrpChange("TERMGRP_NAME", value)}
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
              />
            </Grid>

            {/* Term */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AutoVibe
                id="Term"
                disabled={fieldStates.termDisabled}
                getOptionLabel={(option) => option || ''}
                options={termOptions}
                label="Term"
                name="TERM_NAME"
                value={termFormData.TERM_NAME}
                onChange={(event, value) => handleTermChange("TERM_NAME", value)}
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
              />
            </Grid>

            {/* Percent */}
            <Grid size={{ xs: 12, sm: 1.5 }}>
              <TextField
                fullWidth
                label="Percent"
                name="TERM_PERCENT"
                type="number"
                value={termFormData.TERM_PERCENT}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}
                disabled={fieldStates.percentDisabled}
                inputProps={{
                  style: {
                    padding: '6px 0px',
                    marginTop: '10px',
                    fontSize: '12px'
                  },
                }}
              />
            </Grid>

            {/* Fix Amount */}
            <Grid size={{ xs: 12, sm: 1.5 }}>
              <TextField
                fullWidth
                label="Fix Amount"
                name="TERM_FIX_AMT"
                type="number"
                value={termFormData.TERM_FIX_AMT}
                onChange={handleFixAmountChange}
                variant="filled"
                sx={smallInputSx}
                disabled={fieldStates.fixAmtDisabled}
                inputProps={{
                  style: {
                    padding: '6px 0px',
                    paddingTop: '12px',
                    fontSize: '12px',
                  },
                  type: 'number',
                  step: '0.01',
                  min: '0'
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 1.5 }}>
              <TextField
                fullWidth
                label="Taxable Amt"
                name="TAXABLE_AMT"
                type="number"
                value={totalNetAmount.toFixed(2)}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}
                disabled={fieldStates.taxableAmtDisabled}
                inputProps={{
                  style: {
                    padding: '6px 0px',
                    // paddingTop: '20px',
                    marginTop: '10px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            {/* Tax Amount */}
            <Grid size={{ xs: 12, sm: 1.5 }}>
              <TextField
                fullWidth
                label="Tax Amt"
                name="TAX_AMT"
                type="number"
                value={termFormData.TAX_AMT}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}
                disabled={fieldStates.taxAmtDisabled}
                inputProps={{
                  style: {
                    padding: '0px 0px',
                    paddingTop: '8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            {/* Term Desc (Compact version) */}
            <Grid size={{ xs: 12, sm: 3, md: 12 }}>
              <TextField
                fullWidth
                label="Term Desc"
                name="TERM_DESC"
                value={termFormData.TERM_DESC}
                onChange={handleInputChange}
                variant="outlined"
                // sx={textInputSx}
                multiline
                rows={1}
                disabled={fieldStates.termDescDisabled}
                inputProps={{
                  style: {
                    padding: '6px 0px',
                    marginTop: '0px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            {/* Taxable Amount */}
            {/* Button */}
            {/* <Grid item xs={12} sm={0.8}>
                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    disabled={!(isAddingNew || isEditing)}
                    sx={{
                      backgroundColor: '#39ace2',
                      color: 'white',
                      '&:disabled': {
                        backgroundColor: '#cccccc',
                        color: '#666666'
                      },
                      minWidth: '80px'
                    }}
                    fullWidth
                  >
                    {isAddingNew ? 'Confirm' : (isEditing ? 'Save' : 'Apply')}
                  </Button>
                </Grid> */}
          </Grid>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <Box sx={{ mb: 2 }}>
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
                      {gstSummaryColumns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                          sx={{
                            backgroundColor: "#f5f5f5",
                            fontWeight: "bold",
                            fontSize: "0.7rem",
                            padding: "4px 6px",
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
                    {gstTableData.length > 0 ? (
                      gstTableData.map((row, index) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                          }}
                        >
                          {gstSummaryColumns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align || 'left'}
                              sx={{
                                fontSize: "0.7rem",
                                padding: "4px 6px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {['qty', 'itemAmount', 'discAmount', 'netAmount', 'sgstRate', 'sgstAmount', 'cgstRate', 'cgstAmount', 'igstRate', 'igstAmount', 'cessRate', 'cessAmount'].includes(column.id)
                                ? (row[column.id] || 0).toFixed(column.id === 'qty' ? 3 : 2)
                                : row[column.id] || "—"
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={gstSummaryColumns.length} align="center" sx={{ py: 2 }}>
                          <Typography variant="body2" color="textSecondary">
                            No GST data available. Click Apply GST to calculate.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>

          {/* Summary Fields below GST Table */}
          <Grid container spacing={1.5} alignItems="center">
            {[
              { label: "Itm", value: totalItemAmount.toFixed(2), bold: false },
              { label: "Disc", value: totalDiscAmount.toFixed(2), bold: false },
              { label: "NET", value: totalNetAmount.toFixed(2), bold: true },
              { label: "SGST", value: totalSgstAmount.toFixed(2), bold: false },
              { label: "CGST", value: totalCgstAmount.toFixed(2), bold: false },
              { label: "IGST", value: totalIgstAmount.toFixed(2), bold: false },
              { label: "Cess", value: totalCessAmount.toFixed(2), bold: false },
              { label: "GST", value: gstSummary.totalGstAmount.toFixed(2), bold: true, color: '#1976d2' },
              { label: "Final", value: finalAmount.toFixed(2), bold: true, color: '#2e7d32' }
            ].map((field, index) => (
              <Grid size={{ xs: 4, sm: 1.1 }} key={index}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={field.value}
                  variant="filled"
                  size="small"
                  sx={{
                    ...textInputSx,
                    '& .MuiInputBase-input': {
                      fontSize: '0.729rem',
                      padding: '6px 4px',
                      fontWeight: field.bold ? 'bold' : 'normal',
                      color: field.color || 'inherit'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.729rem'
                    }
                  }}
                  inputProps={{
                    style: {
                      padding: '6px 0px',
                      marginTop: '12px',
                      fontSize: '12px',
                    },
                    type: 'number',
                    step: '0.01',
                    min: '0'
                  }}
                  disabled
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <Grid container spacing={1} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 9 }} >
              <AutoVibe
                id="TermGrpNonCalc"
                disabled={fieldStates.termGrpDisabled}
                getOptionLabel={(option) => option || ''}
                options={termGrpOptions}
                label="Term Grp"
                name="TERMGRP_NAME"
                value={termFormData.TERMGRP_NAME}
                onChange={(event, value) => handleTermGrpChange("TERMGRP_NAME", value)}
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
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 5 }} >
              <AutoVibe
                id="TermNonCalc"
                disabled={fieldStates.termDisabled}
                getOptionLabel={(option) => option || ''}
                options={termOptions}
                label="Term"
                name="TERM_NAME"
                value={termFormData.TERM_NAME}
                onChange={(event, value) => handleTermChange("TERM_NAME", value)}
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
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3, md: 2 }}>
              <TextField
                fullWidth
                label="Percent"
                name="TERM_PERCENT"
                type="number"
                value={termFormData.TERM_PERCENT}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={fieldStates.termDescDisabled}
                inputProps={{
                  style: {
                    padding: '6px 0px',
                    marginTop: '8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            {/* <Grid size={{ xs: 12, sm: 6, md: 3 }} >
              <TextField
                fullWidth
                label="Percent"
                name="TERM_PERCENT"
                type="number"
                value={termFormData.TERM_PERCENT}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}
                disabled={fieldStates.percentDisabled}
              />
            </Grid> */}

            <Grid size={{ xs: 12, sm: 6, md: 2 }} >
              <TextField
                fullWidth
                label="Fix Amount"
                name="TERM_FIX_AMT"
                type="number"
                value={termFormData.TERM_FIX_AMT}
                onChange={handleFixAmountChange}
                variant="filled"
                sx={textInputSx}
                disabled={fieldStates.fixAmtDisabled}
                inputProps={{
                  style: {
                    padding: '6px 0px',
                    marginTop: '8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 1 }} >
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!(isAddingNew || isEditing)}
                sx={{
                  backgroundColor: '#635bff',
                  color: 'white',
                  textTransform: 'none',
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                    color: '#666666'
                  }
                }}
              >
                {isAddingNew ? 'Confirm' : (isEditing ? 'Save' : 'Apply')}
              </Button>
            </Grid>

            <Grid size={{ xs: 12, sm: 3, md: 12 }}>
              <TextField
                fullWidth
                label="Term Desc"
                name="TERM_DESC"
                value={termFormData.TERM_DESC}
                onChange={handleInputChange}
                variant="outlined"
                // sx={textInputSx}
                multiline
                rows={1}
                disabled={fieldStates.termDescDisabled}
                inputProps={{
                  style: {
                    padding: '6px 0px',
                    paddingTop: '0px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            {/* <Grid size={{ xs: 12 }} >
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!(isAddingNew || isEditing)}
                sx={{
                  backgroundColor: '#635bff',
                  color: 'white',
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                    color: '#666666'
                  }
                }}
              >
                {isAddingNew ? 'Confirm' : (isEditing ? 'Save' : 'Apply')}
              </Button>
            </Grid> */}
          </Grid>
        </TabPanel>

        {/* Final Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 0, mb: 0, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onPrev}
            // disabled={isAddingNew || isEditing}
            sx={{
              backgroundColor: '#635bff',
              color: 'white',
              textTransform: 'none',
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
            onClick={handleSave}
            disabled={!(isAddingNew || isEditing)}
            sx={{
              backgroundColor: '#635bff',
              color: 'white',
              textTransform: 'none',
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            {isAddingNew ? 'Confirm' : (isEditing ? 'Confirm' : 'Confirm')}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            // disabled={!(isAddingNew || isEditing)}
            sx={{
              '&:disabled': {
                borderColor: '#cccccc',
                color: '#666666'
              },
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={isAddingNew || isEditing}
            sx={{
              backgroundColor: '#635bff',
              color: 'white',
              textTransform: 'none',
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Stepper3;