'use client';
import React, { useState } from 'react';
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

  // State for dropdown options
  const [discPtnOptions, setDiscPtnOptions] = useState(['Pattern 1', 'Pattern 2', 'Pattern 3']);
  const [selectedDiscPtn, setSelectedDiscPtn] = useState('');

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

  const buttonSx = {
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 30 },
  };

  // Determine if form fields should be disabled
  const shouldDisableFields = () => {
    return !(isAddingNew || isEditing);
  };

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

  // Handle Disc Ptn dropdown change
  const handleDiscPtnChange = (event) => {
    setSelectedDiscPtn(event.target.value);
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
            disabled={isFormDisabled}
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
            disabled={isFormDisabled}
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
            disabled={isFormDisabled}
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
            disabled={isFormDisabled}
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
            Party Tax
          </Button>
          
          {/* Disc Ptn Dropdown */}
          <FormControl 
            variant="filled" 
            sx={{ 
              minWidth: 120,
              '& .MuiInputBase-root': {
                height: 36,
              }
            }}
          >
            <InputLabel>Disc Ptn</InputLabel>
            <Select
              value={selectedDiscPtn}
              onChange={handleDiscPtnChange}
              disabled={isFormDisabled}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {discPtnOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Term Grp"
                name="termGroup"
                value={termFormData.termGroup}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Term"
                name="term"
                value={termFormData.term}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percent"
                name="termPercent"
                type="number"
                value={termFormData.termPercent}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rate On Qty"
                name="rate"
                type="number"
                value={termFormData.rate}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
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
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fix Amount"
                name="taxAmount"
                type="number"
                value={termFormData.taxAmount}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Per Qty"
                name="taxable"
                type="number"
                value={termFormData.taxable}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={handleApply}
                disabled={!shouldDisableFields()}
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax Grp"
                name="termGroup"
                value={termFormData.termGroup}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax Type"
                name="taxType"
                value={termFormData.taxType}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax"
                name="tax"
                value={termFormData.tax}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax Rate %"
                name="rate"
                type="number"
                value={termFormData.rate}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Taxable Amount"
                name="taxable"
                value={termFormData.taxable}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="AOT 1"
                name="aot1"
                type="number"
                value={termFormData.aot1}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="AOT 2"
                name="aot2"
                type="number"
                value={termFormData.aot2}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={handleApply}
                disabled={!shouldDisableFields()}
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Term Grp"
                name="termGroup"
                value={termFormData.termGroup}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Term"
                name="term"
                value={termFormData.term}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percent"
                name="termPercent"
                type="number"
                value={termFormData.termPercent}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rate On Qty"
                name="rate"
                type="number"
                value={termFormData.rate}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
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
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fix Amount"
                name="taxAmount"
                type="number"
                value={termFormData.taxAmount}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Per Qty"
                name="taxable"
                type="number"
                value={termFormData.taxable}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                disabled={!shouldDisableFields()}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={handleApply}
                disabled={!shouldDisableFields()}
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

        {/* Final Action Buttons - Initially Disabled */}
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
        </Stack>
      </Box>
    </Box>
  );
};

export default Stepper3;