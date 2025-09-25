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
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: '#fff'
    }
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
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: '#fff'
    }
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
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: '#fff'
    }
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
    <>

      <Grid container spacing={0.5}>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6" component="h2">
            {formData?.PARTY_NAME || ""}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <AutoVibe
            id="CLIENTGRP_KEY"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Bank"
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <AutoVibe
            id="CLIENTGRP_KEY"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Broker1"
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Branch"
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="IFSC Code"
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Account No"
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Chq P.Name"
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <AutoVibe
            id="TRSP_KEY"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Trade Disc"
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <AutoVibe
            id="TRADE_DISC"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Tax Appbl"
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <AutoVibe
            id="TRADE_DISC"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Broker"
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <AutoVibe
            id="TRADE_DISC"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Transporter"
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Spl Mark Down"
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <TextField
            label="Cr Period"
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}>
            <Button
              component="span"
              variant="contained"
              sx={{
                minHeight: '10px',
                padding: '1px 4px',
                marginTop: '7.5px',
                fontSize: '0.675rem',
              }}
            >
              Verify GSTIN
            </Button>
          </Link>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <AutoVibe
            id="DISC_KEY"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Form Type"
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer', color: '#8B0000' }}>
            Enter &apos;Z&apos; to ignore FG Inward in Stock Aging
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <TextField
            label="Profile"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={clientData?.TARGET_PERC || ""}
            disabled={isFormDisabled}
            name="TARGET_PERC"
            sx={doubleInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 5 }}></Grid>

      </Grid >

    </>
  )
}

export default Stepper3;

