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
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
  const [termGrpMapping, setTermGrpMapping] = useState({}); // Store TERMGRP_NAME to TERMGRP_KEY mapping
  const [termOptions, setTermOptions] = useState([]);
  const [termMapping, setTermMapping] = useState({}); // Store TERM_VAL_YN to TERM_PERCENT mapping
  const [discPtnOptions, setDiscPtnOptions] = useState([]);
  const [selectedDiscPtn, setSelectedDiscPtn] = useState('');

  // Sample data for the grid
  const [tableData, setTableData] = useState([
    {
      id: 1,
      type: "GST",
      taxType: "SGST",
      tax: "State GST",
      rate: 9.00,
      taxable: 35486.00,
      taxAmount: 3193.74,
      aot1A: 0.00,
      aot2A: 0.00,
      aot1: 0.00,
      aot1R: 0.00,
      aot2: 0.00,
      aot2R: 0.00,
      termGroup: "Tax",
      term: "SGST",
      termPercent: 9.00,
      termR: 3193.74
    }
  ]);

  // Form state
  const [termFormData, setTermFormData] = useState({
    type: '',
    taxType: '',
    tax: '',
    rate: '',
    taxable: '',
    taxAmount: '',
    aot1A: '',
    aot2A: '',
    aot1: '',
    aot1R: '',
    aot2: '',
    aot2R: '',
    termGroup: '',
    term: '',
    termPercent: '',
    termR: ''
  });

  // Style definitions - UPDATED WIDTHS
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

  // UPDATED: Increased width for dropdowns
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
      minWidth: '200px', // NEW: Increased minimum width
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

  // UPDATED: Smaller width for number/text fields
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
      maxWidth: '150px', // NEW: Smaller width for number fields
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

  const buttonSx = {
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 30 },
  };

  // Determine if form fields should be disabled - FIXED LOGIC
  const shouldDisableFields = () => {
    // Form fields should be ENABLED when in Add/Edit mode
    return !(isAddingNew || isEditing);
  };

  // Fetch Term Group Data - FIXED VERSION
  const fetchTermGrpData = async () => {
    try {
      const payload = {
        "Flag": "" 
      };

      console.log('Fetching term groups with payload:', payload);
      const response = await axiosInstance.post('/TermGrp/GetTermGrpDrp', payload);
      console.log('Term Group API Response:', response.data);

      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const termGrps = response.data.DATA.map(item => item.TERMGRP_NAME || '');
        setTermGrpOptions(termGrps);
        
        // Create mapping for TERMGRP_NAME to TERMGRP_KEY
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.TERMGRP_NAME && item.TERMGRP_KEY) {
            mapping[item.TERMGRP_NAME] = item.TERMGRP_KEY;
          }
        });
        setTermGrpMapping(mapping);
        console.log('Term Group Mapping:', mapping);
      }
    } catch (error) {
      console.error('Error fetching term group data:', error);
      showSnackbar('Error loading term groups', 'error');
    }
  };

  // Fetch Term Data based on selected Term Group - FIXED VERSION
  const fetchTermData = async (termGrpKey) => {
    if (!termGrpKey) {
      setTermOptions([]);
      setTermMapping({});
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
        // Use TERM_VAL_YN for dropdown options
        const terms = response.data.DATA.map(item => item.TERM_VAL_YN || '');
        setTermOptions(terms);
        
        // Create mapping for TERM_VAL_YN to TERM_PERCENT
        const termPercentMapping = {};
        response.data.DATA.forEach(item => {
          if (item.TERM_VAL_YN && item.TERM_PERCENT !== undefined) {
            termPercentMapping[item.TERM_VAL_YN] = item.TERM_PERCENT;
          }
        });
        setTermMapping(termPercentMapping);
        console.log('Loaded TERM_VAL_YN options:', terms);
        console.log('Term Percent Mapping:', termPercentMapping);
      } else {
        setTermOptions([]);
        setTermMapping({});
      }
    } catch (error) {
      console.error('Error fetching term data:', error);
      showSnackbar('Error loading terms', 'error');
      setTermOptions([]);
      setTermMapping({});
    }
  };

  // Fetch Disc Ptn Data
  const fetchDiscPtnData = async () => {
    try {
      // You can replace this with actual API call if needed
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
  };

  // Handle Term Group change - FIXED VERSION
  const handleTermGrpChange = (name, value) => {
    console.log('Term Group changed:', value);
    
    setTermFormData(prev => ({
      ...prev,
      [name]: value,
      term: '', // Clear term when term group changes
      termPercent: '' // Clear term percent when term group changes
    }));

    // When term group changes, fetch corresponding terms
    if (name === "termGroup" && value) {
      // Get the term group key from the mapping
      const termGrpKey = termGrpMapping[value];
      console.log('Found Term Group Key:', termGrpKey, 'for Term Group:', value);
      
      if (termGrpKey) {
        fetchTermData(termGrpKey);
      } else {
        setTermOptions([]);
        setTermMapping({});
        console.log('No term group key found for:', value);
      }
    } else {
      setTermOptions([]);
      setTermMapping({});
    }
  };

  // Handle Term change - FIXED VERSION
  const handleTermChange = (name, value) => {
    console.log('Term changed:', value);
    
    setTermFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill termPercent when term is selected
    if (name === "term" && value && termMapping[value] !== undefined) {
      const termPercent = termMapping[value];
      console.log('Auto-filling term percent:', termPercent, 'for term:', value);
      
      setTermFormData(prev => ({
        ...prev,
        termPercent: termPercent.toString()
      }));
      
      showSnackbar(`Term percent auto-filled: ${termPercent}%`);
    } else if (name === "term" && value) {
      // Clear termPercent if no mapping found
      setTermFormData(prev => ({
        ...prev,
        termPercent: ''
      }));
    }
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
      type: '',
      taxType: '',
      tax: '',
      rate: '',
      taxable: '',
      taxAmount: '',
      aot1A: '',
      aot2A: '',
      aot1: '',
      aot1R: '',
      aot2: '',
      aot2R: '',
      termGroup: '',
      term: '',
      termPercent: '',
      termR: ''
    });
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
    setTermFormData({ ...selectedRow });
    showSnackbar('Edit mode enabled for selected item');
  };

  // Delete selected item
  const handleDelete = () => {
    if (mode !== 'add' && mode !== 'edit') return;
    
    if (!selectedRow) {
      showSnackbar("Please select an item to delete", 'error');
      return;
    }
    
    setTableData(prev => prev.filter(item => item.id !== selectedRow.id));
    setSelectedRow(null);
    showSnackbar("Item deleted successfully!");
  };

  // Save form data (add or edit)
  const handleSave = () => {
    if (isAddingNew) {
      // Add new item
      const newItem = {
        id: Math.max(...tableData.map(item => item.id), 0) + 1,
        ...termFormData
      };
      setTableData(prev => [...prev, newItem]);
      showSnackbar("Term added successfully!");
    } else if (isEditing) {
      // Update existing item
      setTableData(prev => 
        prev.map(item => 
          item.id === selectedRow.id ? { ...termFormData, id: selectedRow.id } : item
        )
      );
      showSnackbar("Term updated successfully!");
    }
    
    setIsAddingNew(false);
    setIsEditing(false);
    setSelectedRow(null);
    setTermFormData({
      type: '',
      taxType: '',
      tax: '',
      rate: '',
      taxable: '',
      taxAmount: '',
      aot1A: '',
      aot2A: '',
      aot1: '',
      aot1R: '',
      aot2: '',
      aot2R: '',
      termGroup: '',
      term: '',
      termPercent: '',
      termR: ''
    });
  };

  // Close form without saving
  const handleCancel = () => {
    setIsAddingNew(false);
    setIsEditing(false);
    setSelectedRow(null);
    setTermFormData({
      type: '',
      taxType: '',
      tax: '',
      rate: '',
      taxable: '',
      taxAmount: '',
      aot1A: '',
      aot2A: '',
      aot1: '',
      aot1R: '',
      aot2: '',
      aot2R: '',
      termGroup: '',
      term: '',
      termPercent: '',
      termR: ''
    });
    showSnackbar('Operation cancelled');
  };

  // Select a row in the table
  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  // Handle Party Tax button click
  const handlePartyTax = () => {
    if (mode !== 'add' && mode !== 'edit') return;
    showSnackbar('Party Tax functionality');
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
    { id: 'aot1A', label: 'AOT1 A', minWidth: 70, align: 'right' },
    { id: 'aot2A', label: 'AOT2 A', minWidth: 70, align: 'right' },
    { id: 'aot1', label: 'AOT1', minWidth: 80, align: 'right' },
    { id: 'aot1R', label: 'AOT1 R', minWidth: 80, align: 'right' },
    { id: 'aot2', label: 'AOT2', minWidth: 80, align: 'right' },
    { id: 'aot2R', label: 'AOT2 R', minWidth: 80, align: 'right' },
    { id: 'termGroup', label: 'Term Group', minWidth: 80, align: 'right' },
    { id: 'term', label: 'Term', minWidth: 80, align: 'right' },
    { id: 'termPercent', label: 'Tm(%)', minWidth: 80, align: 'right' },
    { id: 'termR', label: 'Tm R', minWidth: 80, align: 'right' },
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
                  {tableData.map((row, index) => (
                    <TableRow
                      key={index}
                      hover
                      onClick={() => handleRowSelect(row)}
                      sx={{
                        backgroundColor: selectedRow?.id === row.id ? "#e3f2fd" : (index % 2 === 0 ? "#fafafa" : "#fff"),
                        "&:hover": { backgroundColor: "#e3f2fd" },
                        cursor: 'pointer',
                        border: selectedRow?.id === row.id ? '2px solid #2196f3' : 'none',
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* CRUD Buttons */}
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
            Edit
          </Button>

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
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
            Delete
          </Button>
          
          <Button
            variant="contained"
            onClick={handlePartyTax}
            disabled={isFormDisabled || isAddingNew || isEditing}
            sx={{
              backgroundColor: '#39ace2',
              color: 'white',
              minWidth: { xs: 80, sm: 100, md: 120 },
              height: { xs: 40, sm: 46, md: 30 },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            Party Tax
          </Button>
          
          <Box sx={{ minWidth: 200, maxWidth: 250 }}> {/* UPDATED: Increased width */}
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
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={termGrpOptions}
                label="Term Grp"
                name="termGroup"
                value={termFormData.termGroup}
                onChange={(event, value) => handleTermGrpChange("termGroup", value)}
                sx={DropInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <AutoVibe
                id="Term"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={termOptions}
                label="Term"
                name="term"
                value={termFormData.term}
                onChange={(event, value) => handleTermChange("term", value)}
                sx={DropInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={2}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Percent"
                name="termPercent"
                type="number"
                value={termFormData.termPercent}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={2}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Rate On Qty"
                name="rate"
                type="number"
                value={termFormData.rate}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Term Desc"
                name="tax"
                value={termFormData.tax}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                multiline
                rows={2}
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={3}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Fix Amount"
                name="taxAmount"
                type="number"
                value={termFormData.taxAmount}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={3}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Per Qty"
                name="taxable"
                type="number"
                value={termFormData.taxable}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
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
              <AutoVibe
                id="TermGrpTax"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={termGrpOptions}
                label="Tax Grp"
                name="termGroup"
                value={termFormData.termGroup}
                onChange={(event, value) => handleTermGrpChange("termGroup", value)}
                sx={DropInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={3}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Tax Type"
                name="taxType"
                value={termFormData.taxType}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={3}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Tax"
                name="tax"
                value={termFormData.tax}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={2}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Tax Rate %"
                name="rate"
                type="number"
                value={termFormData.rate}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={4}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Taxable Amount"
                name="taxable"
                value={termFormData.taxable}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={2}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="AOT 1"
                name="aot1"
                type="number"
                value={termFormData.aot1}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={2}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="AOT 2"
                name="aot2"
                type="number"
                value={termFormData.aot2}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
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
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={termGrpOptions}
                label="Term Grp"
                name="termGroup"
                value={termFormData.termGroup}
                onChange={(event, value) => handleTermGrpChange("termGroup", value)}
                sx={DropInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <AutoVibe
                id="TermNonCalc"
                disabled={shouldDisableFields()}
                getOptionLabel={(option) => option || ''}
                options={termOptions}
                label="Term"
                name="term"
                value={termFormData.term}
                onChange={(event, value) => handleTermChange("term", value)}
                sx={DropInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={2}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Percent"
                name="termPercent"
                type="number"
                value={termFormData.termPercent}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={2}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Rate On Qty"
                name="rate"
                type="number"
                value={termFormData.rate}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Term Desc"
                name="tax"
                value={termFormData.tax}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                multiline
                rows={2}
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={3}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Fix Amount"
                name="taxAmount"
                type="number"
                value={termFormData.taxAmount}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={3}> {/* UPDATED: Smaller width */}
              <TextField
                fullWidth
                label="Per Qty"
                name="taxable"
                type="number"
                value={termFormData.taxable}
                onChange={handleInputChange}
                variant="filled"
                sx={smallInputSx}  
                disabled={shouldDisableFields()}
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