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
              Alicia Deane
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
              value={formData.CLIENTGRP_KEY || 0}
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
              value={formData.CLIENTCAT_KEY || 0}
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
              value={formData.SaleType_Id || ""}
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
              value={formData.SALEPERSON1_KEY || 0}
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
              value={formData.SALEPERSON2_KEY || 0}
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
              value={formData.BROKER_KEY || 0}
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
              value={formData.BROKER1_KEY || 0}
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
              value={formData.TRSP_KEY || ""}
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
              value={formData.TRADE_DISC || 0}
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
              disabled={""}
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
              value={formData.COMM_RATE || ""}
              disabled={""}
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
              control={<Checkbox name="COMM_ONGROSS" size="small" checked={formData.COMM_ONGROSS === "1"}
                onChange={handleChangeStatus} />}
              disabled={""}
              label="Commission On Gross Amt"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>

          <Box sx={{
            width: { xs: '100%', sm: '20%', md: '18%' }, display: 'flex',
            alignItems: 'center'
          }}>
            <Link sx={{ fontSize: '14px' }}>
              Update Broker in All Transactions
            </Link>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.4%' } }}>
            <AutoVibe
              id="CFORM_FLG"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Form Type"
              name="CFORM_FLG"
              value={formData.CFORM_FLG || 0}
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
              value={formData.DISC_KEY || ""}
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
              value={formData.CR_LIMIT || ""}
              disabled={""}
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
              value={formData.CR_PERIOD || ""}
              disabled={""}
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
          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '26%' } }}>
            <FormLabel sx={{ margin: '7px 14px 0px 8px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Round Off</FormLabel>
            <RadioGroup
              row
              name="RDOFF"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData.RDOFF || ""}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel disabled={''}
                value="N" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>None</Typography>} />
              <FormControlLabel disabled={''}
                value="NR" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Nearest Re</Typography>} />
              <FormControlLabel disabled={''}
                value="R" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Rs.5</Typography>} />
            </RadioGroup>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '9.5%' } }}>
            <TextField
              label="Interest Rate %"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData.INT_PERC || ""}
              disabled={""}
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
              control={<Checkbox name="STOP_DESP" size="small" checked={formData.STOP_DESP === "1"}
                onChange={handleChangeStatus} />}
              disabled={""}
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
              disabled={""}
              value={""}
              name=""
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
              disabled={""}
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
              value={formData.DLV_PLACE || ""}
              disabled={""}
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
              value={formData.RATING || ""}
              disabled={""}
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
              value={formData.INSURANCE || ""}
              disabled={""}
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
              value={formData.UsageRemk || ""}
              disabled={""}
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
              value={formData.TAX_KEY || ""}
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
              value={formData.Area || ""}
              disabled={""}
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
              value={formData.Product || ""}
              disabled={""}
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
              value={formData.TARGET_PERC || ""}
              disabled={""}
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
              value={formData.SPL_INSTR || ""}
              disabled={""}
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
              value={formData.SETTELEMENT_REMK || ""}
              disabled={""}
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
              value={formData.SETTELEMENT_DT || 0}
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
              value={formData.SETTELEMENT_AMT || ""}
              disabled={""}
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

// export default function Wrapper() {
//   const [formData, setFormData] = useState({});

//   return (
//     <Suspense fallback={<Box>Loading...</Box>}>
//       <Stepper3 formData={formData} setFormData={setFormData}/>
//     </Suspense>
//   );
// }







