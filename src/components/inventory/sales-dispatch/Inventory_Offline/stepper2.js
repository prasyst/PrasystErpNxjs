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
  Divider
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

const Stepper2 = ({ formData, setFormData, isFormDisabled, mode, onSubmit, onCancel }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sizeDetailsData, setSizeDetailsData] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditingSize, setIsEditingSize] = useState(false);
  const [editingRowData, setEditingRowData] = useState(null);
  
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
    originalData: item
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

  // Handle row click
  const handleRowClick = (row) => {
    setSelectedRow(row.id);
    
    // Extract ORDBKSTYSZLIST from the clicked row
    const sizeDetails = row.originalData?.ORDBKSTYSZLIST || [];
    setSizeDetailsData(sizeDetails);

    // If in edit mode, populate form fields with row data (read-only)
    if (isEditingSize) {
      populateFormFields(row);
    }
    
    console.log("Selected row:", row);
    console.log("Size details:", sizeDetails);
  };

  // Populate form fields with row data for editing (read-only display)
  const populateFormFields = (row) => {
    setEditingRowData(row);
    
    // Calculate convFact from qty and size details
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

  const productOptions = formData.apiResponseData?.ORDBKSTYLIST ? 
    [...new Set(formData.apiResponseData.ORDBKSTYLIST.map(item => item.PRODUCT))].filter(Boolean) : [];

  const styleOptions = formData.apiResponseData?.ORDBKSTYLIST ? 
    [...new Set(formData.apiResponseData.ORDBKSTYLIST.map(item => item.STYLE))].filter(Boolean) : [];

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

  const handleProductChange = (event, value) => {
    setSelectedProduct(value);
  };

  const handleStyleChange = (event, value) => {
    setSelectedStyle(value);
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItemData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate size details when qty and convFact are entered (only in add mode)
    if (isAddingNew && (name === 'qty' || name === 'convFact') && newItemData.qty && newItemData.convFact) {
      calculateSizeDetails();
    }
  };

  const calculateSizeDetails = () => {
    const qty = parseFloat(newItemData.qty) || 0;
    const convFact = parseFloat(newItemData.convFact) || 1;
    const calculatedQty = qty * convFact;
    const mrp = parseFloat(newItemData.mrp) || 0;
    const calculatedAmount = calculatedQty * mrp;

    console.log("Calculating size details:", { qty, convFact, calculatedQty, mrp, calculatedAmount });

    // Create size details based on calculated quantity
    const newSizeDetails = [
      {
        STYSIZE_NAME: 'Standard',
        QTY: calculatedQty,
        ITM_AMT: calculatedAmount,
        FGSTYLE_ID: newItemData.barcode || '-',
        ORDER_QTY: calculatedQty
      }
    ];

    setSizeDetailsData(newSizeDetails);
    console.log("Updated size details:", newSizeDetails);
  };

  // Auto-calculate when qty or convFact changes (only in add mode)
  useEffect(() => {
    if (isAddingNew && newItemData.qty && newItemData.convFact) {
      calculateSizeDetails();
    }
  }, [newItemData.qty, newItemData.convFact, isAddingNew]);

  const handleAddItem = () => {
    setIsAddingNew(true);
    setSizeDetailsData([]); // Clear size details for new item
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

  const handleConfirmAdd = () => {
    if (!newItemData.product || !newItemData.qty) {
      alert("Please fill required fields: Product and Qty");
      return;
    }

    // Create new item from form data
    const calculatedQty = (parseFloat(newItemData.qty) || 0) * (parseFloat(newItemData.convFact) || 1);
    const mrp = parseFloat(newItemData.mrp) || 0;
    const amount = calculatedQty * mrp;
    const discount = parseFloat(newItemData.discount) || 0;
    const netAmount = amount - discount;

    const newItem = {
      id: Date.now(), // Temporary ID
      BarCode: newItemData.barcode || "-",
      product: newItemData.product,
      style: newItemData.style || "-",
      type: newItemData.type || "-",
      shade: newItemData.shade || "-",
      lotNo: newItemData.lotNo || "-",
      qty: calculatedQty,
      rate: mrp,
      amount: amount,
      varPer: parseFloat(newItemData.varPer) || 0,
      varQty: 0,
      varAmt: 0,
      discAmt: discount,
      netAmt: netAmount,
      distributer: "-",
      set: parseFloat(newItemData.sets) || 0,
      originalData: {
        ORDBKSTYSZLIST: sizeDetailsData
      }
    };

    // Update the table data with new item
    const newTableData = [...tableData, newItem];
    setUpdatedTableData(newTableData);

    // Also update formData for persistence
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
          ORDBKSTYSZLIST: sizeDetailsData
        }]
      }
    }));

    // Reset form
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

    alert("Item added successfully!");
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
  };

  const handleEditItem = () => {
    if (!selectedRow) {
      alert("Please select an item to edit");
      return;
    }
    
    if (isEditingSize) {
      // Save mode - update the main table with edited size details
      const updatedTable = tableData.map(row => {
        if (row.id === selectedRow) {
          // Calculate total qty from size details
          const totalSizeQty = sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
          
          // Calculate amount based on size details total and rate
          const rate = row.rate || 0;
          const amount = totalSizeQty * rate;
          const discount = row.discAmt || 0;
          const netAmount = amount - discount;

          return {
            ...row,
            qty: totalSizeQty, // Update main table qty with size details total
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
      
      // Also update formData
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
                ITMQTY: totalSizeQty, // Update main table qty
                ITMAMT: amount,
                NET_AMT: netAmount,
                ORDBKSTYSZLIST: sizeDetailsData
              };
            }
            return item;
          }) || []
        }
      }));
      
      alert("Changes saved successfully!");
    } else {
      // Enter edit mode - populate form with selected row data if available
      if (selectedRow) {
        const selectedRowData = tableData.find(row => row.id === selectedRow);
        if (selectedRowData) {
          populateFormFields(selectedRowData);
        }
      }
    }
    
    setIsEditingSize(!isEditingSize);
  };

  const handleDeleteItem = () => {
    if (!selectedRow) {
      alert("Please select an item to delete");
      return;
    }
    
    // Remove selected item from table data
    const newTableData = tableData.filter(row => row.id !== selectedRow);
    setUpdatedTableData(newTableData);
    
    // Also update formData
    setFormData(prev => ({
      ...prev,
      apiResponseData: {
        ...prev.apiResponseData,
        ORDBKSTYLIST: (prev.apiResponseData?.ORDBKSTYLIST || []).filter(item => 
          item.ORDBKSTY_ID !== selectedRow
        )
      }
    }));

    // Reset selection
    if (newTableData.length > 0) {
      setSelectedRow(newTableData[0].id);
      setSizeDetailsData(newTableData[0].originalData?.ORDBKSTYSZLIST || []);
    } else {
      setSelectedRow(null);
      setSizeDetailsData([]);
    }

    alert("Item deleted successfully!");
  };

  const handleSizeQtyChange = (index, newQty) => {
    if (!isEditingSize) return;

    const updatedSizeDetails = [...sizeDetailsData];
    const oldQty = updatedSizeDetails[index].QTY;
    const rate = updatedSizeDetails[index].ITM_AMT / (oldQty || 1);
    
    updatedSizeDetails[index] = {
      ...updatedSizeDetails[index],
      QTY: parseFloat(newQty) || 0,
      ITM_AMT: (parseFloat(newQty) || 0) * rate,
      ORDER_QTY: parseFloat(newQty) || 0
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
    // Fields should be enabled only when in add mode or edit mode
    return !(isAddingNew || isEditingSize);
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
        {/* Search Style Cd Section */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <AutoVibe
              id="product"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={productOptions}
              label="Product"
              name="product"
              value={selectedProduct}
              onChange={handleProductChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <AutoVibe
              id="style"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={styleOptions}
              label="Style"
              name="style"
              value={selectedStyle}
              onChange={handleStyleChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
        </Grid>

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
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            disabled={isFormDisabled || isEditingSize}
            sx={{
              background: 'linear-gradient(45deg, #2196f3, #64b5f6)',
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
              background: isEditingSize ? '#4caf50' : 'linear-gradient(45deg, #ffa726, #ffcc80)',
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
              background: 'linear-gradient(45deg, #e53935, #ef5350)',
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
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                getOptionLabel={(option) => option || ''}
                options={productOptions}
                label="Product"
                name="product"
                value={isAddingNew || isEditingSize ? newItemData.product : selectedProduct}
                onChange={(event, value) => {
                  if (isAddingNew || isEditingSize) {
                    setNewItemData(prev => ({ ...prev, product: value }));
                  }
                }}
                sx={DropInputSx}
              />
              <TextField 
                label="BarCode" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="barcode"
                value={isAddingNew || isEditingSize ? newItemData.barcode : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <AutoVibe
                id="Style_Cd"
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                getOptionLabel={(option) => option || ''}
                options={styleOptions}
                label="Style Cd"
                name="style"
                value={isAddingNew || isEditingSize ? newItemData.style : selectedStyle}
                onChange={(event, value) => {
                  if (isAddingNew || isEditingSize) {
                    setNewItemData(prev => ({ ...prev, style: value }));
                  }
                }}
                sx={DropInputSx}
              />
              <TextField 
                label="Type" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="type"
                value={isAddingNew || isEditingSize ? newItemData.type : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <AutoVibe
                id="Type"
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                getOptionLabel={(option) => option || ''}
                options={productOptions}
                label="Type"
                name="type"
                value={isAddingNew || isEditingSize ? newItemData.type : ''}
                onChange={(event, value) => {
                  if (isAddingNew || isEditingSize) {
                    setNewItemData(prev => ({ ...prev, type: value }));
                  }
                }}
                sx={DropInputSx}
              />
              <TextField 
                label="Shade" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="shade"
                value={isAddingNew || isEditingSize ? newItemData.shade : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <AutoVibe
                id="Shade"
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                getOptionLabel={(option) => option || ''}
                options={productOptions}
                label="Shade"
                name="shade"
                value={isAddingNew || isEditingSize ? newItemData.shade : ''}
                onChange={(event, value) => {
                  if (isAddingNew || isEditingSize) {
                    setNewItemData(prev => ({ ...prev, shade: value }));
                  }
                }}
                sx={DropInputSx}
              />
              <TextField 
                label="Qty" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="qty"
                value={isAddingNew || isEditingSize ? newItemData.qty : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              
              <TextField 
                label="MRP" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="mrp"
                value={isAddingNew || isEditingSize ? newItemData.mrp : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <TextField 
                label="Set No" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="setNo"
                value={isAddingNew || isEditingSize ? newItemData.setNo : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <TextField 
                label="Qty(+/-)%" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="varPer"
                value={isAddingNew || isEditingSize ? newItemData.varPer : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              
              <TextField 
                label="Std Qty" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="stdQty"
                value={isAddingNew || isEditingSize ? newItemData.stdQty : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <TextField 
                label="Conv Fact" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="convFact"
                value={isAddingNew || isEditingSize ? newItemData.convFact : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <TextField 
                label="Lot No" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="lotNo"
                value={isAddingNew || isEditingSize ? newItemData.lotNo : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <AutoVibe
                id="Discount"
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                getOptionLabel={(option) => option || ''}
                options={productOptions}
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
                disabled={shouldDisableFields()} // Enable only in add/edit mode
                name="percent"
                value={isAddingNew || isEditingSize ? newItemData.percent : ''}
                onChange={handleNewItemChange}
                sx={textInputSx} 
                inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} 
              />
              <TextField 
                label="Remark" 
                variant="filled" 
                disabled={shouldDisableFields()} // Enable only in add/edit mode
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
                  disabled={shouldDisableFields()} // Enable only in add/edit mode
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
                disabled={shouldDisableFields()} // Enable only in add/edit mode
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
                  disabled={shouldDisableFields()} // Enable only in add/edit mode
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
                      onClick={isAddingNew ? handleConfirmAdd : handleEditItem}
                      sx={{ minWidth: '60px', height: '36px' }}
                    >
                      {isAddingNew ? 'Add Qty' : 'Save'}
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
                            {isEditingSize ? (
                              <TextField
                                type="number"
                                value={size.QTY}
                                onChange={(e) => handleSizeQtyChange(index, e.target.value)}
                                size="small"
                                sx={{ width: '80px' }}
                                inputProps={{ style: { fontSize: '0.75rem', padding: '4px' } }}
                              />
                            ) : (
                              size.QTY
                            )}
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
                            No size details available
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
        <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Confirm
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default Stepper2;