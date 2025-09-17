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
  Link
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import { toast, ToastContainer } from 'react-toastify';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CrudButton from '../../../../GlobalFunction/CrudButton';
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import { getFormMode } from '../../../../lib/helpers';
import EditableTable from '@/atoms/EditTable';
import CrudButtons from "@/GlobalFunction/CrudButtons";
import PaginationButtons from '@/GlobalFunction/PaginationButtons';
import z from 'zod';

const FORM_MODE = getFormMode();

const Stepper3 = ({ formData, setFormData, isFormDisabled }) => {
  console.log("Stepper3 full formData:", formData?.PARTY_NAME || "");

  const clientData = formData?.CLIENTTERMSEntities?.[0];

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

  const doubleInputSx = {
    '& .MuiInputBase-root': {
      height: 76,
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
      height: 76,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      CLIENTTERMSEntities: [{ ...prev?.CLIENTTERMSEntities?.[0], [name]: value }]
    }));
  };

  const handleChangeStatus = (event) => {
    const { name, checked } = event.target;
    const updatedStatus = checked ? "1" : "0";

    setFormData(prev => ({
      ...prev,
      CLIENTTERMSEntities: [{ ...prev?.CLIENTTERMSEntities?.[0], [name]: updatedStatus }]
    }));
  };

  return (
    <Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, sm: 1.5, md: 0.7 },
          marginInline: { xs: '5%', sm: '5%', md: '5%' },
          marginTop: { xs: '5%', sm: '5%', md: '2%' }
        }}

      >

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            gap: { xs: 1, sm: 1, md: 2 },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
            <Typography variant="h6" component="h2">
              {formData?.PARTY_NAME || ""}
            </Typography>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <AutoVibe
              id="CLIENTGRP_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Group"
              name="CLIENTGRP_KEY"
              value={clientData?.CLIENTGRP_KEY || 0}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <AutoVibe
              id="CLIENTCAT_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Category"
              name="CLIENTCAT_KEY"
              value={clientData?.CLIENTCAT_KEY || 0}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <AutoVibe
              id="SaleType_Id"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Sale Type"
              name="SaleType_Id"
              value={clientData?.SaleType_Id || ""}
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

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.1%' } }}>
            <AutoVibe
              id="SALEPERSON1_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Salesperson 1"
              name="SALEPERSON1_KEY"
              value={clientData?.SALEPERSON1_KEY || 0}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.1%' } }}>
            <AutoVibe
              id="SALEPERSON2_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Salesperson 2"
              name="SALEPERSON2_KEY"
              value={clientData?.SALEPERSON2_KEY || 0}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <AutoVibe
              id="BROKER_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Broker"
              name="BROKER_KEY"
              value={clientData?.BROKER_KEY || 0}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <AutoVibe
              id="BROKER1_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Broker1"
              name="BROKER1_KEY"
              value={clientData?.BROKER1_KEY || 0}
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
              id="TRSP_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Transporter"
              name="TRSP_KEY"
              value={clientData?.TRSP_KEY || ""}
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

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.1%' } }}>
            <AutoVibe
              id="TRADE_DISC"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Trade Disc"
              name="TRADE_DISC"
              value={clientData?.TRADE_DISC || 0}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.1%' } }}>
            <TextField
              label="Spl Mark Down"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={""}
              disabled={isFormDisabled}
              name=""
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '10.3%' } }}>
            <TextField
              label="Comm Rate"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.COMM_RATE || ""}
              disabled={isFormDisabled}
              name="COMM_RATE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.5%' } }}>
            <FormControlLabel
              control={<Checkbox name="COMM_ONGROSS" size="small" checked={clientData?.COMM_ONGROSS === "1"}
                onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Commission On Gross Amt"
              sx={{
                margin: 0,
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>

          <Box sx={{
            width: { xs: '100%', sm: '20%', md: '18%' }, display: 'flex',
            alignItems: 'center'
          }}>
            <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}>
              Update Broker in All Transactions
            </Link>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.5%' } }}>
            <AutoVibe
              id="CFORM_FLG"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Form Type"
              name="CFORM_FLG"
              value={clientData?.CFORM_FLG || 0}
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

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
            <AutoVibe
              id="DISC_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Cash Desc"
              name="DISC_KEY"
              value={clientData?.DISC_KEY || ""}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.4%' } }}>
            <TextField
              label="Cr Limit"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.CR_LIMIT || ""}
              disabled={isFormDisabled}
              name="CR_LIMIT"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '9.5%' } }}>
            <TextField
              label="Cr Period Days"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.CR_PERIOD || ""}
              disabled={isFormDisabled}
              name="CR_PERIOD"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center',
            width: { xs: '100%', sm: '48%', md: '28%' },
            gap: '10px'
          }}>
            <FormLabel
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'black',
                whiteSpace: 'nowrap',
                lineHeight: '1.5',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                margin: 0,
              }}
              component="legend">Round Off</FormLabel>
            <RadioGroup
              row
              name="RDOFF"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={clientData?.RDOFF || ""}
              sx={{ margin: 0, padding: 0 }}
            >
              <FormControlLabel disabled={isFormDisabled}
                value="N" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>None</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="NR" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Nearest Re</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="R" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Rs.5</Typography>} />
            </RadioGroup>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '7.5%' } }}>
            <TextField
              label="Interest Rate %"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.INT_PERC || ""}
              disabled={isFormDisabled}
              name="INT_PERC"
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

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.1%' } }}>
            <FormControlLabel
              control={<Checkbox name="STOP_DESP" size="small" checked={clientData?.STOP_DESP === "1"}
                onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Stop Dispatch"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.1%' } }}>
            <TextField
              type="date"
              label="Date"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={clientData?.STOP_DESC_DT || 0}
              name="STOP_DESC_DT"
              sx={textInputSx}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '48%', md: '42.4%' } }}>
            <TextField
              label="Reason"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={""}
              disabled={isFormDisabled}
              name=""
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <TextField
              label="Dlv Place"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.DLV_PLACE || ""}
              disabled={isFormDisabled}
              name="DLV_PLACE"
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

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.1%' } }}>
            <TextField
              label="Rating"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.RATING || ""}
              disabled={isFormDisabled}
              name="RATING"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.1%' } }}>
            <TextField
              label="Insurance"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.INSURANCE || ""}
              disabled={isFormDisabled}
              name="INSURANCE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '48%', md: '42.4%' } }}>
            <TextField
              label="Usage Remark"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.UsageRemk || ""}
              disabled={isFormDisabled}
              name="UsageRemk"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <AutoVibe
              id="TAX_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Tax Appbl"
              name="TAX_KEY"
              value={clientData?.TAX_KEY || ""}
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

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
            <TextField
              label="Area"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.Area || ""}
              disabled={isFormDisabled}
              name="Area"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '48%', md: '42.4%' } }}>
            <TextField
              label="Product"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.Product || ""}
              disabled={isFormDisabled}
              name="Product"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <TextField
              label="Party Target"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.TARGET_PERC || ""}
              disabled={isFormDisabled}
              name="TARGET_PERC"
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

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
            <TextField
              label="Spl Instruction"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.SPL_INSTR || ""}
              disabled={isFormDisabled}
              name="SPL_INSTR"
              sx={doubleInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'column' },
            gap: { xs: 1, sm: 1, md: 0.5 },
            width: { xs: '100%', sm: '20%', md: '42.4%' }
          }}>
            <TextField
              label="Settlement Remark"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.SETTELEMENT_REMK || ""}
              disabled={isFormDisabled}
              name="SETTELEMENT_REMK"
              sx={doubleInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'column' },
            gap: { xs: 1, sm: 1, md: 0.5 },
            width: { xs: '100%', sm: '20%', md: '20.5%' }
          }}>
            <TextField
              type="date"
              label="Date"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={clientData?.SETTELEMENT_DT || 0}
              name="SETTELEMENT_DT"
              sx={textInputSx}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Amount"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={clientData?.SETTELEMENT_AMT || ""}
              disabled={isFormDisabled}
              name="SETTELEMENT_AMT"
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

export default Stepper3;
