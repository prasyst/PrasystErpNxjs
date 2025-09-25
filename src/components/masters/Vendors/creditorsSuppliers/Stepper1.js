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

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Name"
            disabled={isFormDisabled}
            name="PARTY_NAME"
            variant="filled"
            fullWidth
            value={formData?.PARTY_NAME || ""}
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
        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <TextField
            label="Code"
            disabled={isFormDisabled}
            variant="filled"
            fullWidth
            name="ID"
            value={formData?.ID || ""}
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
        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <TextField
            label="Alt Cd"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            name="PARTY_ALT_CODE"
            value={formData?.PARTY_ALT_CODE || ""}
            disabled={true}
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
            label="Abbr"
            variant="filled"
            fullWidth
            name="PARTY_ABRV"
            value={formData?.PARTY_ABRV || ""}
            onChange={handleInputChange}
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
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{
          display: 'flex',
          alignItems: 'center',
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
            component="legend">RD/URD</FormLabel>
          <RadioGroup
            row
            name="RD_URD"
            onChange={handleInputChange}
            disabled={isFormDisabled}
            value={formData?.RD_URD || ""}
            sx={{ margin: 0, padding: 0 }}
          >
            <FormControlLabel disabled={isFormDisabled}
              value="R" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>RD</Typography>} />
            <FormControlLabel disabled={isFormDisabled}
              value="U" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>URD</Typography>} />
            <FormControlLabel disabled={isFormDisabled}
              value="C" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>Composition</Typography>} />
          </RadioGroup>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
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
          <TextField
            label="Address"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.ADDR || ""}
            disabled={isFormDisabled}
            name="ADDR"
            sx={doubleInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <AutoVibe
            id="CONT_KEY"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Country"
            name="CONT_KEY"
            value={formData?.CONT_KEY || ""}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
          <AutoVibe
            id="CITY_KEY"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="City/District"
            name="CITY_KEY"
            value={formData?.CITY_KEY || ""}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
          <Grid size={{ xs: 12, sm: 6, md: 12 }} sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TextField
              label="Pincode"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={formData?.PINCODE || ""}
              disabled={isFormDisabled}
              name="PINCODE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Pincode"
              name=""
              value={""}
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

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <AutoVibe
            id=""
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="State"
            name=""
            value={""}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
          <TextField
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PLACE || ""}
            disabled={isFormDisabled}
            name="PLACE"
            label={
              <span>
                PLACE <span style={{ color: 'red' }}>*</span>
              </span>
            }
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
          <TextField
            label="Tel"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.TEL_NO || ""}
            disabled={isFormDisabled}
            name="TEL_NO"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <Grid sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
              border="1px solid #ccc"
              borderRadius={1}
              width={100}
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
            <Grid sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px'
            }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-photo"
                type="file"
                onChange={handleImageChange}
                disabled={isFormDisabled}
              />
              <label htmlFor="upload-photo">
                <Box
                  sx={{
                    borderRadius: '8px',
                    display: 'inline-block',
                  }}
                >
                  <Button
                    component="span"
                    variant="contained"
                    startIcon={<UploadIcon />}
                    sx={{
                      minHeight: '10px',
                      padding: '1px 4px',
                      fontSize: '0.675rem',
                    }}
                  >
                    Upload
                  </Button>
                </Box>
              </label>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-photo"
                type="file"
                // onChange={handleImageChange}
                disabled={isFormDisabled}
              />
              <label htmlFor="upload-photo">
                <Box
                  sx={{
                    borderRadius: '8px',
                    display: 'inline-block',
                  }}
                >
                  <Button
                    component="span"
                    variant="contained"
                    startIcon={<DeleteForeverIcon />}
                    sx={{
                      minHeight: '10px',
                      padding: '1px 4px',
                      fontSize: '0.675rem',
                      backgroundColor: '#FF0000'
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </label>
            </Grid>
          </Grid>
          <TextField
            label="Email"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.E_MAIL || ""}
            disabled={isFormDisabled}
            name="E_MAIL"
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
        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          alignItems: 'center',
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
            component="legend">MSME Reg</FormLabel>
          <RadioGroup
            row
            name="MSME_FLAG"
            onChange={handleInputChange}
            disabled={isFormDisabled}
            value={formData?.MSME_FLAG || ""}
            sx={{
              padding: 0,
              margin: 0,
            }}
          >
            <FormControlLabel disabled={isFormDisabled}
              value="Y" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
            <FormControlLabel disabled={isFormDisabled}
              value="N" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
          </RadioGroup>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="MSME No"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.MSME_NO || ""}
            disabled={isFormDisabled}
            name="MSME_NO"
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
            id="MSME_TR"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="MSME Trade"
            name="MSME_TR"
            value={formData?.MSME_TR || 0}
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
            id="MSME_ACT"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="MSME Act"
            name="MSME_ACT"
            value={formData?.MSME_ACT || 0}
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
            id="MSME_CLASS"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="MSME Class"
            name="MSME_CLASS"
            value={formData?.MSME_CLASS || 0}
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
            label="Cont Person"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.CONTACT_PERSON || ""}
            disabled={isFormDisabled}
            name="CONTACT_PERSON"
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
            id="CONTDESG"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Degn"
            name="CONTDESG"
            value={formData?.CONTDESG || 0}
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
            label="Mobile"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.MOBILE_NO || ""}
            disabled={isFormDisabled}
            name="MOBILE_NO"
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
            label="Website"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.WEBSITE}
            disabled={isFormDisabled}
            name="WEBSITE"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControlLabel
            control={<Checkbox name="MANUAL_WSP" size="small" checked={formData?.MANUAL_WSP === "1"}
              onChange={handleChangeStatus} />}
            disabled={isFormDisabled}
            label="Manual WSP"
            sx={{
              '& .MuiFormControlLabel-label': { fontSize: '12px' }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Regd Off"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.REG_ADD || ""}
            disabled={isFormDisabled}
            name="REG_ADD"
            sx={doubleInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <TextField
            label="Excise No"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.EXCISE_CODE || ""}
            disabled={isFormDisabled}
            name="EXCISE_CODE"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
          <TextField
            label="CST"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.CST || ""}
            disabled={isFormDisabled}
            name="CST"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <TextField
            label="VAT"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.VAT || ""}
            disabled={isFormDisabled}
            name="VAT"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
          <AutoVibe
            id="ACCLED_ID"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="GL-Control A/c"
            name="ACCLED_ID"
            value={formData?.ACCLED_ID || 0}
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

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <TextField
            label="PAN"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.PAN_NO || ""}
            disabled={isFormDisabled}
            name="PAN_NO"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
          <TextField
            label="TAN"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.TAN_NO || ""}
            disabled={isFormDisabled}
            name="TAN_NO"
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
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="UserName/Email"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.WebUserName || ""}
            disabled={isFormDisabled}
            name="WebUserName"
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
            label="UserName/Password"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.WebPassword || ""}
            disabled={isFormDisabled}
            name="WebPassword"
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
            id="CO_ID"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Company"
            name="CO_ID"
            value={formData?.CO_ID || 0}
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
        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
          <TextField
            label="SMS Mobile No"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.SMS_MOBILENO || ""}
            disabled={isFormDisabled}
            name="SMS_MOBILENO"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
          <FormControlLabel
            control={<Checkbox name="STATUS" size="small" checked={formData?.STATUS === "1"}
              onChange={handleChangeStatus} />}
            disabled={isFormDisabled}
            label="Active"
            sx={{
              '& .MuiFormControlLabel-label': { fontSize: '12px' }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <AutoVibe
            id="PARTY_CLASS_KEY"
            disabled={isFormDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Party Class"
            name="PARTY_CLASS_KEY"
            value={formData?.PARTY_CLASS_KEY || 0}
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
          <FormControlLabel
            control={<Checkbox name="DEFAULT_BRANCH" size="small" checked={formData?.DEFAULT_BRANCH === "1"}
              onChange={handleChangeStatus} />}
            disabled={isFormDisabled}
            label="Default Branch"
            sx={{
              margin: 0,
              '& .MuiFormControlLabel-label': { fontSize: '12px' }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="GSTIN No"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={formData?.GSTTIN_NO || ""}
            disabled={isFormDisabled}
            name="GSTTIN_NO"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}>
            <Button
              component="span"
              variant="contained"
              sx={{
                minHeight: '10px',
                padding: '1px 4px',
                fontSize: '0.675rem',
              }}
            >
              Verify GSTIN
            </Button>
          </Link>
          <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer', ml: 4 }}>
            <Button
              component="span"
              variant="contained"
              sx={{
                minHeight: '10px',
                padding: '1px 4px',
                fontSize: '0.675rem',
              }}
            >
              Cust Card
            </Button>
          </Link>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer', ml: 1 }}>
            <Button
              component="span"
              variant="contained"
              sx={{
                minHeight: '10px',
                padding: '1px 4px',
                backgroundColor: '#6C757D',
                fontSize: '0.675rem',
              }}
            >
              Document
            </Button>
          </Link>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FormLabel sx={{ margin: '7px 14px 0px 2px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Entity under SEZ</FormLabel>
          <RadioGroup
            row
            name="SEZ"
            onChange={handleInputChange}
            disabled={isFormDisabled}
            value={formData?.SEZ || ""}
            sx={{ margin: '5px 0px 0px 0px' }}
          >
            <FormControlLabel disabled={isFormDisabled}
              value="Y" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
            <FormControlLabel disabled={isFormDisabled}
              value="N" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
          </RadioGroup>

          <FormLabel sx={{ margin: '7px 14px 0px 2px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Internal Process</FormLabel>
          <RadioGroup
            row
            name="SEZ"
            onChange={handleInputChange}
            disabled={isFormDisabled}
            value={formData?.SEZ || ""}
            sx={{ margin: '5px 0px 0px 0px' }}
          >
            <FormControlLabel disabled={isFormDisabled}
              value="Y" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
            <FormControlLabel disabled={isFormDisabled}
              value="N" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
          </RadioGroup>
        </Grid>

      </Grid >

    </>
  )
}

export default Stepper1;
