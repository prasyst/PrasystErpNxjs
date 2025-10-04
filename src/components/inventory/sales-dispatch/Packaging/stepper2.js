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
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FORM_MODE = getFormMode();


const Stepper2 = ({ formData, setFormData, isFormDisabled }) => {
  console.log("Stepper1 received abc:", formData?.LASTID);

  const [tableData, setTableData] = useState([
    {
      id: 1,
      BarCode: "Br201",
      product: "BS Boys-T-Shirts",
      style: "TS-002",
      type: "Premium",
      shade: "100/White",
      lotNo: "May-2025",
      qty: 250.00,
      rate: 177.43,
      amount: 35486
    },
    {
      id: 1,
      BarCode: "Br200",
      product: "BS Girls-T-Shirts",
      style: "TS-390",
      type: "Premium",
      shade: "100/Pink",
      lotNo: "May-2025",
      qty: 300.00,
      rate: 245,
      amount: 35486
    },
    {
      id: 1,
      BarCode: "Br301",
      product: "BS Kids-T-Shirts",
      style: "TS-302",
      type: "Premium",
      shade: "100/Green",
      lotNo: "May-2025",
      qty: 217,
      rate: 480,
      amount: 35486
    },
    {
      id: 1,
      BarCode: "Br209",
      product: "BS lifestyle-T-Shirts",
      style: "TS-789",
      type: "Premium",
      shade: "100/blue",
      lotNo: "May-2025",
      qty: 450,
      rate: 477.43,
      amount: 35486
    }
  ]);

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

  const handleChangeStatus = (event) => {
    const { name, checked } = event.target;
    const updatedStatus = checked ? "1" : "0";

    setFormData(prev => ({
      ...prev,
      [name]: updatedStatus
    }));
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
    
    { id: 'amount', label: 'Var Per', minWidth: 80, align: 'right' },
    { id: 'amount', label: 'Var Qty', minWidth: 80, align: 'right' },
    { id: 'amount', label: 'Var Amt', minWidth: 80, align: 'right' },
    { id: 'amount', label: 'Disk Amt', minWidth: 80, align: 'right' },
    { id: 'amount', label: 'Net Amt', minWidth: 80, align: 'right' },
    { id: 'amount', label: 'Div Dt', minWidth: 80, align: 'right' },
    { id: 'amount', label: 'Distributer', minWidth: 80, align: 'right' },
    { id: 'amount', label: 'set', minWidth: 80, align: 'right' },
  ];

  const sizeDetails = [
    { size: 'Xl', qty: 50.00, amount: 8871.5, barcode: 'BC001' },
    { size: 'L', qty: 50.00, amount: 8871.5, barcode: 'BC002' },
    { size: 'M', qty: 50.00, amount: 8871.5, barcode: 'BC003' },
    { size: 'BARDOL', qty: 50.00, amount: 8871.5, barcode: 'BC001' },
    { size: 'xxL', qty: 50.00, amount: 8871.5, barcode: 'BC002' },
   
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
              options={["BS Boys-T-Shirts"]}
              label="Product"
              name="product"
              value={formData.product || ""}
              onChange={handleInputChange}
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
              id="type"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={["Premium"]}
              label="Type"
              name="type"
              value={formData.type || ""}
              onChange={handleInputChange}
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
                  {tableData.map((row, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                        "&:hover": { backgroundColor: "#e3f2fd" },
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

        {/* CRUD Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
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
            sx={{
              background: 'linear-gradient(45deg, #ffa726, #ffcc80)',
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
            startIcon={<DeleteIcon />}
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
            <TextField label="Tot Qty" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Tot Amt" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Disc" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />

      {/* Second Row */}
      <TextField label="Net" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
        </Stack>

        
        
       {/* Totals Section */}
<Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'flex-start' }}>
  
  {/* LEFT: Text Fields Section */}
  <Box sx={{ flex: '0 0 60%' }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
      
      
      <TextField label="BarCode" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Style Cd" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />

      {/* Third Row */}
      <TextField label="Type" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Shade" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <AutoVibe
        id="filterall"
        disabled={isFormDisabled}
        getOptionLabel={(option) => option || ''}
        options={["BS Boys-T-Shirts"]}
        label="Filter All"
        name="filterall"
        value={formData.product || ""}
        onChange={handleInputChange}
        sx={DropInputSx}
      />

      {/* Extra Fields */}
      <TextField label="Qty" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="MRP" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Set No" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />

      <TextField label="Qty(+/-)%" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Std Qty" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Conv Fact" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />

      <TextField label="Lot No" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Percent" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Remark" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />

<LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Div Dt"
    value={
      formData.DIV_DT
        ? new Date(formData.DIV_DT.split("/").reverse().join("-"))
        : null
    }
    onChange={(date) => handleDateChange(date, "DIV_DT")}
    format="dd/MM/yyyy"
    disabled={isFormDisabled}
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
      <TextField label="RQty" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />
      <TextField label="Sets" variant="filled" disabled={isFormDisabled} sx={textInputSx} inputProps={{ style: { padding: '6px 8px', fontSize: '12px' } }} />


      {/* <Box sx={{ gridColumn: 'span 3' }}>
        <FormLabel component="legend" sx={{ fontSize: '12px', fontWeight: 'bold' }}> RM </FormLabel>
        <RadioGroup row name="rm" sx={{ mt: 0.5 }}>
          <FormControlLabel value="fm1" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '12px' }}>FM1</Typography>} />
          <FormControlLabel value="fm2" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '12px' }}>FM2</Typography>} />
          <FormControlLabel value="fm3" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '12px' }}>FM3</Typography>} />
        </RadioGroup>
      </Box> */}

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
        Size Details
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
            {sizeDetails.map((size, index) => (
              <TableRow key={index} sx={{
                backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                "&:hover": { backgroundColor: "#e3f2fd" }
              }}>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.size}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.qty}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.amount}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.barcode}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{size.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Box>

</Box>






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
    </Box>
  )
}

export default Stepper2;