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
  Link,
  RadioGroup,
  Checkbox,
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
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import z from 'zod';

const FORM_MODE = getFormMode();

const Stepper1 = ({ formData, setFormData, isFormDisabled }) => {
  console.log("Stepper1 full formData:", formData?.PrintName);

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
      [name]: value,
      ...(name === "PARTY_NAME" && { PRINTNAME: value }),
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      readFileAsBase64(file)
        .then(base64String => {
          setFormData(prevData => ({
            ...prevData,
            PARTY_IMG: base64String
          }));
        })
        .catch(err => {
          console.error('Error reading file:', err);
          toast.error('Error reading file. Please try again.');
        });
    }
  };

  return (
    <>
      <Grid container spacing={0.5}>

        <Grid container size={{ xs: 12, sm: 6, md: 12 }} sx={{ display: 'flex' }}>
          <Grid container size={{ xs: 12, sm: 6, md: 10 }}>
            <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
              <TextField
                label="CO_ID"
                variant="filled"
                fullWidth
                onChange={handleInputChange}
                value={formData?.PRINTNAME || ""}
                name="PRINTNAME"
                disabled={isFormDisabled}
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 9 }}>
              <TextField
                label="Company"
                variant="filled"
                fullWidth
                onChange={handleInputChange}
                value={formData?.PRINTNAME || ""}
                name="PRINTNAME"
                disabled={isFormDisabled}
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
              <TextField
                label="Abbrv"
                variant="filled"
                fullWidth
                onChange={handleInputChange}
                value={formData?.PRINTNAME || ""}
                name="PRINTNAME"
                disabled={isFormDisabled}
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                label="GSTIN_NO"
                variant="filled"
                fullWidth
                onChange={handleInputChange}
                value={formData?.PRINTNAME || ""}
                name="PRINTNAME"
                disabled={isFormDisabled}
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <AutoVibe
                id="TRSP_KEY"
                disabled={isFormDisabled}
                getOptionLabel={(option) => option || ''}
                options={[]}
                label="Transporter"
                name="TRSP_KEY"
                value={formData?.TRSP_KEY || 0}
                onChange={handleInputChange}
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                label="Print Name"
                variant="filled"
                fullWidth
                onChange={handleInputChange}
                value={formData?.PRINTNAME || ""}
                name="PRINTNAME"
                disabled={isFormDisabled}
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container size={{ xs: 12, sm: 6, md: 2 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
              border="1px solid #ccc"
              borderRadius={1}
              width={146}
              height={76}
              overflow="hidden"
              position="relative"
            >
              {formData.PARTY_IMG ? (
                <img
                  src={formData.PARTY_IMG}
                  alt="Uploaded Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    marginTop: "4px"
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  color="#39ace2"
                  style={{ textAlign: 'center' }}
                >
                  <PhotoCameraIcon />
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Address"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={doubleInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Work Addr"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={doubleInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Regd Addr"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={doubleInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Place"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
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
            id="TRSP_KEY"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Pincode"
            name="TRSP_KEY"
            value={formData?.TRSP_KEY || 0}
            onChange={handleInputChange}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer', color: '#8B0000' }}>
            TDS Details
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="CIN No"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="IE Code"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="PAN"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
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
            label="Tel"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
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
            label="Designation"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="TAN"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="E_mail"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="TDS Circle"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Website"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="TDS Person"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Owner MobNo"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="C.S.T"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
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
            label="Excise Cd"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
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
            label="Excise Div"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="VAT(Reg.Off.)"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
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
            label="Excise Rng"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
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
            label="Excise Comm"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="MSME No"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PRINTNAME || ""}
            name="PRINTNAME"
            disabled={isFormDisabled}
            sx={textInputSx}
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
            id="TRSP_KEY"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Co-Division"
            name="TRSP_KEY"
            value={formData?.TRSP_KEY || 0}
            onChange={handleInputChange}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControlLabel
            control={<Checkbox name="DEFAULT_BRANCH" size="small" checked={formData?.DEFAULT_BRANCH === "1"}
            onChange={handleChangeStatus} />}
            disabled={isFormDisabled}
            label="Active"
            sx={{
              margin: 0,
              '& .MuiFormControlLabel-label': { fontSize: '12px' }
            }}
          />
        </Grid>

      </Grid >

    </>
  )
}

export default Stepper1;
