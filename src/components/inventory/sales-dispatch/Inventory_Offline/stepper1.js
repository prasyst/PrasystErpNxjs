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
} from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import { getFormMode } from '../../../../lib/helpers';

const FORM_MODE = getFormMode();

const Stepper1 = ({ formData, setFormData, isFormDisabled, mode, onSubmit, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(null);

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

  // Helper function to parse date from string
  const parseDateFromString = (dateString) => {
    if (!dateString) return null;
    try {
      // Try to parse DD/MM/YYYY format
      if (dateString.includes('/')) {
        return parse(dateString, 'dd/MM/yyyy', new Date());
      }
      // Try to parse ISO format
      return new Date(dateString);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAutoCompleteChange = (name, value) => {
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
        {/* Main Details Radio Group */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            gap: { xs: 1, sm: 1, md: 2 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '25%' } }}>
            
            <RadioGroup
              row
              name="MAIN_DETAILS"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData.MAIN_DETAILS || "G"}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel 
                disabled={isFormDisabled}
                value="G" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>General</Typography>} 
              />
              <FormControlLabel 
                disabled={isFormDisabled}
                value="L" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Lot Wise</Typography>} 
              />
            </RadioGroup>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '25%' } }}>
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">GST Appl.</FormLabel>
            <RadioGroup
              row
              name="GST_APPL"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData.GST_APPL || "Y"}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel 
                disabled={isFormDisabled}
                value="Y" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} 
              />
              <FormControlLabel 
                disabled={isFormDisabled}
                value="N" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} 
              />
            </RadioGroup>
          </Box>
        </Box>

        {/* Series, Last Ord No, Order No, Date Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
            <TextField
              label="Series"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.SERIES || ""}
              name="SERIES"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <TextField
              label="Last Ord No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.LAST_ORD_NO || ""}
              name="LAST_ORD_NO"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <TextField
              label="Order No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.ORDER_NO || ""}
              name="ORDER_NO"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Order Date"
                value={parseDateFromString(formData.ORDER_DATE)}
                onChange={(date) => handleDateChange(date, "ORDER_DATE")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    sx: datePickerSx,
                    InputProps: {
                      sx: {
                        height: "32px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {/* Party Ord No, Season, Order Ref Date, Enq No, Manual WSP Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Party Ord No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.PARTY_ORD_NO || ""}
              disabled={isFormDisabled}
              name="PARTY_ORD_NO"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <AutoVibe
              id="SEASON"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Season"
              name="SEASON"
              value={formData.SEASON || ""}
              onChange={(event, value) => handleAutoCompleteChange("SEASON", value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ord Ref Dt"
                value={parseDateFromString(formData.ORD_REF_DT)}
                onChange={(date) => handleDateChange(date, "ORD_REF_DT")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    sx: datePickerSx,
                    InputProps: {
                      sx: {
                        height: "32px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Enq No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.ENQ_NO || ""}
              disabled={isFormDisabled}
              name="ENQ_NO"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Delivery Date"
                value={parseDateFromString(formData.DLV_DT)}
                onChange={(date) => handleDateChange(date, "DLV_DT")}
                format="dd/MM/yyyy"
                disabled={isFormDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                    sx: datePickerSx,
                    InputProps: {
                      sx: {
                        height: "32px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {/* Party Branch, Rack_Min, Quote No, Shipping Party Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Party Branch"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.PARTY_BRANCH || ""}
              disabled={isFormDisabled}
              name="PARTY_BRANCH"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <FormControlLabel
              control={<Checkbox name="RACK_MIN" size="small" checked={formData.RACK_MIN === "1"}
              onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Rack_Min"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <TextField
              label="Quote No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.QUOTE_NO || ""}
              disabled={isFormDisabled}
              name="QUOTE_NO"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Shipping Party"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.SHIPPING_PARTY || ""}
              disabled={isFormDisabled}
              name="SHIPPING_PARTY"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <FormControlLabel
              control={<Checkbox name="REGISTERED_DEALER" size="small" checked={formData.REGISTERED_DEALER === "1"}
              onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Registered Dealer"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
        </Box>

        {/* Div Place, A.R.Sales, Shipping Place, PriceList Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Div Place"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.DIV_PLACE || ""}
              disabled={isFormDisabled}
              name="DIV_PLACE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="A.R.Sales"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AR_SALES || ""}
              disabled={isFormDisabled}
              name="AR_SALES"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <TextField
              label="Shipping Place"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.SHIPPING_PLACE || ""}
              disabled={isFormDisabled}
              name="SHIPPING_PLACE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="PriceList"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.PRICE_LIST || ""}
              disabled={isFormDisabled}
              name="PRICE_LIST"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="May-2025"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.MAY_2025 || ""}
              disabled={isFormDisabled}
              name="MAY_2025"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>

        {/* Broker Transporter, B-East-II, New Addr, Amount Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Broker Transporter"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.BROKER_TRANSPORTER || ""}
              disabled={isFormDisabled}
              name="BROKER_TRANSPORTER"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="B-East-II"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.B_EAST_II || ""}
              disabled={isFormDisabled}
              name="B_EAST_II"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <TextField
              label="New Addr"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.NEW_ADDR || ""}
              disabled={isFormDisabled}
              name="NEW_ADDR"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Amount"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AMOUNT || ""}
              disabled={isFormDisabled}
              name="AMOUNT"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Gross Amount"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AMOUNT_1 || ""}
              disabled={isFormDisabled}
              name="AMOUNT_1"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>

        {/* Gross Amt, All New, New Comm, 0.00 Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Gross Amt"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.GROSS_AMT || ""}
              disabled={isFormDisabled}
              name="GROSS_AMT"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="All New"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.ALL_NEW || ""}
              disabled={isFormDisabled}
              name="ALL_NEW"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <TextField
              label="New Comm"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.NEW_COMM || ""}
              disabled={isFormDisabled}
              name="NEW_COMM"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="0.00"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AMOUNT_2 || ""}
              disabled={isFormDisabled}
              name="AMOUNT_2"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Net Amt"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.NET_AMT || ""}
              disabled={isFormDisabled}
              name="NET_AMT"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>

        {/* Consignee, E-ASM1[Brijnandan Kumar], Broker1, 35486.00 Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Consignee"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.CONSIGNEE || ""}
              disabled={isFormDisabled}
              name="CONSIGNEE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="E-ASM1[Brijnandan Kumar]"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.E_ASM1 || ""}
              disabled={isFormDisabled}
              name="E_ASM1"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <TextField
              label="Broker1"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.BROKER1 || ""}
              disabled={isFormDisabled}
              name="BROKER1"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Net Amount"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.AMOUNT_3 || ""}
              disabled={isFormDisabled}
              name="AMOUNT_3"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Currency"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.CURRENCY || ""}
              disabled={isFormDisabled}
              name="CURRENCY"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>

        {/* Salesperson 2, New, ... Email, Rupees Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Salesperson 1"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.SALESPERSON_1 || ""}
              disabled={isFormDisabled}
              name="SALESPERSON_1"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="Salesperson 2"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.SALESPERSON_2 || ""}
              disabled={isFormDisabled}
              name="SALESPERSON_2"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <TextField
              label="... Email"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.EMAIL || ""}
              disabled={isFormDisabled}
              name="EMAIL"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Currency"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.Currency || ""}
              disabled={isFormDisabled}
              name="Currency"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Ex Rate"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.EX_RATE || ""}
              disabled={isFormDisabled}
              name="EX_RATE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>

        {/* Remark Status, Short Close, 1.00 Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <TextField
              label="Remark Status"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.REMARK_STATUS || ""}
              disabled={isFormDisabled}
              name="REMARK_STATUS"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <FormControlLabel
              control={<Checkbox name="SHORT_CLOSE" size="small" checked={formData.SHORT_CLOSE === "1"}
              onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Short Close"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "20.5%" } }}>
            <FormControlLabel
              control={<Checkbox name="READY_SI" size="small" checked={formData.READY_SI === "1"}
              onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Ready_Si"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Ex Rate"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.EX_RATE_VALUE || ""}
              disabled={isFormDisabled}
              name="EX_RATE_VALUE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Stepper1;