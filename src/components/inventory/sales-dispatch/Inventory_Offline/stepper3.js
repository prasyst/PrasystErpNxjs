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
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
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

const Stepper3 = ({ formData, setFormData, isFormDisabled }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedRow, setSelectedRow] = useState(null);
  
  // Sample data for the grid
  const [tableData, setTableData] = useState([
    {
      id: 1,
      BarCode: "Br200",
      product: "BS Boys-T-Shirts",
      style: "TS-002",
      type: "Premium",
      shade: "100/White",
      lotNo: "May-2025",
      qty: 200.00,
      rate: 177.43,
      amount: 35486
    }
  ]);
  
  // Form state for dialog
  const [termFormData, setTermFormData] = useState({
    termGrp: '',
    term: '',
    percent: '',
    rateOnQty: '',
    termDesc: '',
    fixAmount: '',
    perQty: ''
  });

  // Style definitions (same as Stepper2)
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

  const buttonSx = {
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 30 },
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handle input changes in dialog form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTermFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open dialog for adding new item
  const handleAdd = () => {
    setDialogMode('add');
    setTermFormData({
      termGrp: '',
      term: '',
      percent: '',
      rateOnQty: '',
      termDesc: '',
      fixAmount: '',
      perQty: ''
    });
    setOpenDialog(true);
  };

  // Open dialog for editing existing item
  const handleEdit = () => {
    if (!selectedRow) return;
    
    setDialogMode('edit');
    setTermFormData({ ...selectedRow });
    setOpenDialog(true);
  };

  // Delete selected item
  const handleDelete = () => {
    if (!selectedRow) return;
    
    setTableData(prev => prev.filter(item => item.id !== selectedRow.id));
    setSelectedRow(null);
  };

  // Save form data (add or edit)
  const handleSave = () => {
    if (dialogMode === 'add') {
      // Add new item
      const newItem = {
        id: Math.max(...tableData.map(item => item.id), 0) + 1,
        ...termFormData
      };
      setTableData(prev => [...prev, newItem]);
    } else {
      // Update existing item
      setTableData(prev => 
        prev.map(item => 
          item.id === selectedRow.id ? { ...termFormData, id: selectedRow.id } : item
        )
      );
    }
    setOpenDialog(false);
    setSelectedRow(null);
  };

  // Close dialog without saving
  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  // Select a row in the table
  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  // Table columns for the main grid (same as Stepper2)
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
        {/* Table Section (same as Stepper2) */}
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
                      selected={selectedRow?.id === row.id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                        "&:hover": { backgroundColor: "#e3f2fd" },
                        cursor: 'pointer'
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
                          {row[column.id] || "—"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* CRUD Buttons (same as Stepper2 but with additional buttons) */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
           variant="contained"

            startIcon={<AddIcon />}
            onClick={handleAdd}
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
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            // disabled={!selectedRow}
            sx={{
              
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
            }}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            // disabled={!selectedRow}
            sx={{
             
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
            }}
          >
            Delete
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            sx={{
             
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
            }}
          >
            Party Tax
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            sx={{
              
              color: 'white',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
            }}
          >
            Disc Ptn
          </Button>
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
                name="termGrp"
                value={termFormData.termGrp}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percent"
                name="percent"
                type="number"
                value={termFormData.percent}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rate On Qty"
                name="rateOnQty"
                type="number"
                value={termFormData.rateOnQty}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Term Desc"
                name="termDesc"
                value={termFormData.termDesc}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fix Amount"
                name="fixAmount"
                type="number"
                value={termFormData.fixAmount}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Per Qty"
                name="perQty"
                type="number"
                value={termFormData.perQty}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" sx={{ mr: 1 }}>
                New
              </Button>
              <Button variant="contained">
                Apply
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          {/* Tax Content */}
          <Typography>Tax content goes here</Typography>
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          {/* Non-Calc Terms Content */}
          <Typography>Non-Calc Terms content goes here</Typography>
        </TabPanel>

        {/* Final Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary">
            Confirm
          </Button>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
        </Stack>
      </Box>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Term' : 'Edit Term'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Term Grp"
                name="termGrp"
                value={termFormData.termGrp}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percent"
                name="percent"
                type="number"
                value={termFormData.percent}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rate On Qty"
                name="rateOnQty"
                type="number"
                value={termFormData.rateOnQty}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Term Desc"
                name="termDesc"
                value={termFormData.termDesc}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fix Amount"
                name="fixAmount"
                type="number"
                value={termFormData.fixAmount}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Per Qty"
                name="perQty"
                type="number"
                value={termFormData.perQty}
                onChange={handleInputChange}
                variant="filled"
                sx={textInputSx}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Stepper3;