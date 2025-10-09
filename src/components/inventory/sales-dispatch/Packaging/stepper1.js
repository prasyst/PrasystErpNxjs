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
import { format } from "date-fns";
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import { getFormMode } from '../../../../lib/helpers';

const FORM_MODE = getFormMode();

const Stepper1 = ({ formData, setFormData, isFormDisabled }) => {
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
              {/* <FormControlLabel 
                disabled={isFormDisabled}
                value="P" 
                control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Planning Knitting</Typography>} 
              /> */}
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
              label="Last Package No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.LAST_PKG_NO || ""}
              name="LAST_PKG_NO"
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
              label="Package No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.Package_No || ""}
              name="Package_No"
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

          <Box sx={{ width: { xs: "100%", sm: "20%", md: "22%" } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formData.ORG_DIV_DT ? new Date(formData.ORG_DIV_DT.split("/").reverse().join("-")) : null}
                onChange={(date) => handleDateChange(date, "ORG_DIV_DT")}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '25%' } }}>
            <AutoVibe
              id="Party"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Party"
              name="Party"
              value={formData.SEASON || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '25%' } }}>
            <AutoVibe
              id="ShippingParty"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Shipping Party"
              name="ShippingParty"
              value={formData.ShippingParty || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "20%", md: "25%" } }}>
           <AutoVibe
              id="branch"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Branch"
              name="Branch"
              value={formData.Branch || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '25%' } }}>
           
            <AutoVibe
              id="Shipping_PLC"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Shipping Place"
              name="Shipping_PLC"
              value={formData.Shipping_PLC || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          
        </Box>

        {/* Party Branch, Rack_Min, Quote No, Shipping Party Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <AutoVibe
              id="Broker"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Broker"
              name="Broker"
              value={formData.Broker || 0}
              onChange={handleInputChange}
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
            <TextField
              label="Address"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.Address || ""}
              disabled={isFormDisabled}
              name="Address"
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
              label="Ref No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.ref_no || ""}
              disabled={isFormDisabled}
              name="ref_no"
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
            <AutoVibe
              id="Broker1"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Broker1"
              name="Broker1"
              value={formData.Broker1 || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
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
            <AutoVibe
              id="Transporter"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Transporter"
              name="Transporter"
              value={formData.Transporter || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="Brokrage %"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.Brokrage || ""}
              disabled={isFormDisabled}
              name="Brokrage"
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
              label="Packing Amt"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.PackingAmt || ""}
              disabled={isFormDisabled}
              name="PackingAmt"
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
              label="Commble Amt"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.CommbleAmt || ""}
              disabled={isFormDisabled}
              name="CommbleAmt"
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
              label="Round Off"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.RoundOff || ""}
              disabled={isFormDisabled}
              name="RoundOff"
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
              label="L R No"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.lrno || ""}
              disabled={isFormDisabled}
              name="lrno"
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
                label="Date"
                value={formData.ORG_DIV_DT ? new Date(formData.ORG_DIV_DT.split("/").reverse().join("-")) : null}
                onChange={(date) => handleDateChange(date, "ORG_DIV_DT")}
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
              label="Net Amount"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.netAMOUNT || ""}
              disabled={isFormDisabled}
              name="netAMOUNT"
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
              label="PYT Terms"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.PYTTerms || ""}
              disabled={isFormDisabled}
              name="PYTTerms"
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={formData.ORG_DIV_DT ? new Date(formData.ORG_DIV_DT.split("/").reverse().join("-")) : null}
                onChange={(date) => handleDateChange(date, "ORG_DIV_DT")}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
             <AutoVibe
              id="DiscTerm"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Disc Term"
              name="DiscTerm"
              value={formData.DiscTerm || 0}
              onChange={handleInputChange}
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
           <AutoVibe
              id="Consignee"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Consignee"
              name="Consignee"
              value={formData.Consignee || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <AutoVibe
              id="Currency"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Currency"
              name="Currency"
              value={formData.Currency || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="EX Rate"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.EXRate || ""}
              disabled={isFormDisabled}
              name="EXRate"
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
              label="Packets"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.Packets || ""}
              disabled={isFormDisabled}
              name="Packets"
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

             <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <AutoVibe
              id="SALESPERSON_2"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Salesperson 2"
              name="SALESPERSON_2"
              value={formData.SALESPERSON_2 || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <AutoVibe
              id="SALESPERSON_1"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Salesperson 1"
              name="SALESPERSON_1"
              value={formData.SALESPERSON_1 || 0}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          
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
          
        </Box>

        {/* Remark Status, Short Close, 1.00 Row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
         
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
         
        </Box>
      </Box>
    </Box>
  )
}

export default Stepper1;