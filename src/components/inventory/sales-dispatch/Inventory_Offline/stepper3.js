'use client';
import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab
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

const Stepper3 = ({ formData, setFormData, isFormDisabled, mode, onSubmit, onCancel, showSnackbar }) => {
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
      minWidth: '200px',
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

  // Load data from formData when component mounts or formData changes
  useEffect(() => {
    console.log('FormData changed in Stepper3:', formData.apiResponseData?.ORDBKTERMLIST);
    
    // Get Order Amount from Stepper2's TOTAL_AMOUNT
    const stepper2TotalAmount = formData.TOTAL_AMOUNT || 0;
    setOrderAmount(stepper2TotalAmount);
    console.log('Order Amount from Stepper2:', stepper2TotalAmount);
    
    if (formData.apiResponseData?.ORDBKTERMLIST && formData.apiResponseData.ORDBKTERMLIST.length > 0) {
      const transformedData = formData.apiResponseData.ORDBKTERMLIST.map((term, index) => ({
        id: term.ORDBKTERM_ID || index + 1,
        type: term.TAXGRP_NAME ? "Tax" : "Term",
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
        originalData: term
      }));
      console.log('Transformed table data:', transformedData);
      setTableData(transformedData);
    } else {
      console.log('No ORDBKTERMLIST data found, setting empty table');
      setTableData([]);
    }
  }, [formData.apiResponseData, formData.TOTAL_AMOUNT]);

  // Calculate current order amount based on all terms
  const calculateCurrentOrderAmount = () => {
    let currentAmount = orderAmount;
    
    tableData.forEach(item => {
      if (!item.originalData?.DBFLAG || item.originalData.DBFLAG !== 'D') {
        // Subtract tax amount from order amount for both Tax and Term items
        currentAmount -= parseFloat(item.taxAmount) || 0;
      }
    });
    
    return Math.max(0, currentAmount); // Ensure non-negative
  };

  // NEW: Calculate tax amount based on current term configuration
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

  // FIXED: Auto-update tax amount when term or values change
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
    
    // Include ALL terms including deleted ones (they need to be sent to API with DBFLAG='D')
    const updatedTermList = updatedTableData.map(item => {
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
        showSnackbar('Percentage mode: Tax amount will be calculated based on percentage');
      } else if (termValFix === '1') {
        showSnackbar('Fixed Amount mode: You can enter fixed tax amount');
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
    showSnackbar('Add new term mode enabled');
  };

  // Open form for editing existing item
  const handleEdit = () => {
    if (mode !== 'add' && mode !== 'edit') return;
    
    if (!selectedRow) {
      showSnackbar("Please select an item to edit", 'error');
      return;
    }
    
    setIsEditing(true);
    const selectedData = tableData.find(item => item.id === selectedRow);
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
    showSnackbar('Edit mode enabled for selected item');
  };

  // Delete selected item with proper DBFLAG handling
  const handleDelete = () => {
    if (mode !== 'add' && mode !== 'edit') return;
    
    if (!selectedRow) {
      showSnackbar("Please select an item to delete", 'error');
      return;
    }
    
    const updatedTableData = tableData.map(item => {
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

    console.log('After deletion, table data:', updatedTableData);
    
    setTableData(updatedTableData);
    updateFormDataWithTerms(updatedTableData);
    
    // Clear selection
    setSelectedRow(null);
    
    showSnackbar("Item marked for deletion! Click Submit to confirm deletion.");
  };

  // FIXED: Save form data (add or edit) with proper tax amount calculation
  const handleSave = () => {
    let updatedTableData;

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
      updatedTableData = [...tableData, newItem];
      setTableData(updatedTableData);
      showSnackbar("Term added successfully!");
    } else if (isEditing) {
      // Update existing item
      updatedTableData = tableData.map(item => {
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
      setTableData(updatedTableData);
      showSnackbar("Term updated successfully!");
    }

    // Update form data
    if (updatedTableData) {
      updateFormDataWithTerms(updatedTableData);
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
    showSnackbar('Operation cancelled');
  };

  // Select a row in the table
  const handleRowSelect = (row) => {
    setSelectedRow(row.id);
  };

  // Handle Apply button click
  const handleApply = () => {
    showSnackbar('Changes applied successfully!');
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
    { id: 'termR', label: 'Tm R', minWidth: 80, align: 'right' },
  ];

  // Filter table data to show only non-deleted items in UI
  const displayTableData = tableData.filter(item => 
    !item.originalData?.DBFLAG || item.originalData.DBFLAG !== 'D'
  );

  // Get current field states based on TERM_VAL_FIX
  const fieldStates = getFieldStates();

  // Calculate current order amount for display
  const currentOrderAmount = calculateCurrentOrderAmount();

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
                  {displayTableData.map((row, index) => (
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
                          {column.id === 'taxable' || column.id === 'taxAmount' || column.id === 'rate' || column.id === 'termPercent' || column.id === 'termR'
                            ? (row[column.id] || 0).toFixed(2)
                            : row[column.id] || "—"
                          }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {displayTableData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 2 }}>
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
        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={isFormDisabled || isAddingNew || isEditing}
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

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            disabled={isFormDisabled || isAddingNew || isEditing || !selectedRow}
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
            Edit
          </Button>

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={isFormDisabled || isAddingNew || isEditing || !selectedRow}
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

          {/* Party Tax and Apply GST Buttons */}
          <Button
            variant="contained"
            disabled={isFormDisabled || isAddingNew || isEditing}
            sx={{
              backgroundColor: '#39ace2',
              color: 'white',
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
            disabled={isFormDisabled || isAddingNew || isEditing}
            sx={{
              backgroundColor: '#39ace2',
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 80, sm: 90, md: 100 },
              height: { xs: 40, sm: 46, md: 30 },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            Apply GST
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
              sx={DropInputSx}
            />
          </Box>

          {/* Order Amount Text Field */}
          <TextField
            label="Order Amount"
            variant="filled"
            value={currentOrderAmount.toFixed(2)}
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
                padding: '6px 8px', 
                fontSize: '12px',
                textAlign: 'right'
              } 
            }}
          />
        </Stack>

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, mt: 2 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="sales order tabs">
            <Tab label="Calc Terms" />
            <Tab label="Tax" />
            <Tab label="Non-Calc Terms" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabIndex} index={0}>
          {/* Calc Terms Content */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <AutoVibe
                id="TermGrp"
                disabled={fieldStates.termGrpDisabled}
                getOptionLabel={(option) => option || ''}
                options={termGrpOptions}
                label="Term Grp"
                name="TERMGRP_NAME"
                value={termFormData.TERMGRP_NAME}
                onChange={(event, value) => handleTermGrpChange("TERMGRP_NAME", value)}
                sx={DropInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <AutoVibe
                id="Term"
                disabled={fieldStates.termDisabled}
                getOptionLabel={(option) => option || ''}
                options={termOptions}
                label="Term"
                name="TERM_NAME"
                value={termFormData.TERM_NAME}
                onChange={(event, value) => handleTermChange("TERM_NAME", value)}
                sx={DropInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
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
            </Grid>
            <Grid item xs={12} sm={2}>
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Term Desc"
                name="TERM_DESC"
                value={termFormData.TERM_DESC}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                multiline
                rows={2}
                disabled={fieldStates.termDescDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Taxable Amount"
                name="TAXABLE_AMT"
                type="number"
                value={termFormData.TAXABLE_AMT}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={fieldStates.taxableAmtDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Tax Amount"
                name="TAX_AMT"
                type="number"
                value={termFormData.TAX_AMT}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={fieldStates.taxAmtDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={handleApply}
                disabled={shouldDisableFields()}
                sx={{
                  backgroundColor: '#39ace2',
                  color: 'white',
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                    color: '#666666'
                  }
                }}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          {/* Tax Content */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tax Type"
                name="TAX_NAME"
                value={termFormData.TAX_NAME}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Tax Rate %"
                name="TAX_RATE"
                type="number"
                value={termFormData.TAX_RATE}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={fieldStates.taxRateDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Taxable Amount"
                name="TAXABLE_AMT"
                value={termFormData.TAXABLE_AMT}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={fieldStates.taxableAmtDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Tax Amount"
                name="TAX_AMT"
                type="number"
                value={termFormData.TAX_AMT}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={fieldStates.taxAmtDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={handleApply}
                disabled={shouldDisableFields()}
                sx={{
                  backgroundColor: '#39ace2',
                  color: 'white',
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                    color: '#666666'
                  }
                }}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          {/* Non-Calc Terms Content */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <AutoVibe
                id="TermGrpNonCalc"
                disabled={fieldStates.termGrpDisabled}
                getOptionLabel={(option) => option || ''}
                options={termGrpOptions}
                label="Term Grp"
                name="TERMGRP_NAME"
                value={termFormData.TERMGRP_NAME}
                onChange={(event, value) => handleTermGrpChange("TERMGRP_NAME", value)}
                sx={DropInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <AutoVibe
                id="TermNonCalc"
                disabled={fieldStates.termDisabled}
                getOptionLabel={(option) => option || ''}
                options={termOptions}
                label="Term"
                name="TERM_NAME"
                value={termFormData.TERM_NAME}
                onChange={(event, value) => handleTermChange("TERM_NAME", value)}
                sx={DropInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
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
            </Grid>
            <Grid item xs={12} sm={2}>
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Term Desc"
                name="TERM_DESC"
                value={termFormData.TERM_DESC}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                multiline
                rows={2}
                disabled={fieldStates.termDescDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={handleApply}
                disabled={shouldDisableFields()}
                sx={{
                  backgroundColor: '#39ace2',
                  color: 'white',
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                    color: '#666666'
                  }
                }}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Final Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            disabled={!(isAddingNew || isEditing)}
            sx={{
              backgroundColor: '#39ace2',
              color: 'white',
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            {isAddingNew ? 'Confirm' : (isEditing ? 'Save' : 'Confirm')}
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleCancel}
            disabled={!(isAddingNew || isEditing)}
            sx={{
              '&:disabled': {
                borderColor: '#cccccc',
                color: '#666666'
              }
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
              backgroundColor: '#39ace2',
              color: 'white',
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