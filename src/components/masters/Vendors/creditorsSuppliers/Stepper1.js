'use client';
import React, { useState, useEffect } from "react";

import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  Radio,
  RadioGroup,
  FormLabel,
  StepLabel,
  FormControl,
  Checkbox,
  FormGroup,
  FormControlLabel,

} from "@mui/material";
import { toast } from "react-toastify";
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import "react-toastify/dist/ReactToastify.css";

import { getFormMode } from "../../../../lib/helpers";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const FORM_MODE = getFormMode();

const StepperMst1 = ({ formData, setFormData }) => {
  const [isFormDisabled, setIsFormDisabled] = useState(true);

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
      [name]: value,
      ...(name === "PARTY_NAME" && {PRINTNAME: value})
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
    <Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, sm: 1.5, md: 0.7 },
          marginInline: { xs: '5%', sm: '5%', md: '5%' }
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '48%', md: '10%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '48%', md: '9.3%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '48%', md: '10%' } }}>
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
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '48%', md: '25%' } }}>
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">RD/URD</FormLabel>
            <RadioGroup
              row
              name="RD_URD"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData?.RD_URD || ""}
              sx={{ margin: '5px 0px 0px 0px' }}
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
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'flex' },
            gap: { xs: 1, sm: 1, md: 2.1 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'column' },
              gap: { xs: 1, sm: 1, md: 0.5 },
              width: { xs: '100%', sm: '20%', md: '33.5%' }
            }}
          >
            <Box>
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
            </Box>
            <Box>
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
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'column' },
              gap: { xs: 1, sm: 1, md: 0.5 },
              width: { xs: '100%', sm: '20%', md: '20.4%' }
            }}
          >
            <Box>
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
            </Box>
            <Box>
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                gap: { xs: 1, sm: 1, md: 0.5 },
                width: { xs: '100%', sm: '20%', md: '100%' }
              }}
            >
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
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'column' },
              gap: { xs: 1, sm: 1, md: 0.5 },
              width: { xs: '100%', sm: '20%', md: '20.6%' }
            }}
          >
            <Box>
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
            </Box>
            <Box>
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
            </Box>
            <Box>
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
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'column' },
              gap: { xs: 1, sm: 1, md: 0.5 },
              width: { xs: '100%', sm: '20%', md: '20.6%' }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                gap: { xs: 1, sm: 1, md: 0.5 },
              }}
            >
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
                    color="textSecondary"
                    style={{ textAlign: 'center' }}
                  >
                    <PhotoCameraIcon />
                  </Typography>
                )}
              </Box>
              <Box sx={{ marginTop: '25px', display: 'flex' }}>
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
                      mr: 1,
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
              </Box>
            </Box>
            <Box>
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
            </Box>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: '20%', md: '17%' } }}>
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">MSME Reg</FormLabel>
            <RadioGroup
              row
              name="MSME_FLAG"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={formData?.MSME_FLAG || ""}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel disabled={isFormDisabled}
                value="Y" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="N" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
            </RadioGroup>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.3%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
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
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '17%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.3%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <FormControlLabel
              control={<Checkbox name="MANUAL_WSP" size="small" checked={formData?.MANUAL_WSP === "1"}
                onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Manual WSP"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
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
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'column' },
            gap: { xs: 1, sm: 1, md: 0.5 },
            width: { xs: '100%', sm: '20%', md: '20.5%' }
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
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'column' },
            gap: { xs: 1, sm: 1, md: 0.5 },
            width: { xs: '100%', sm: '20%', md: '20.5%' }
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
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'column' },
            gap: { xs: 1, sm: 1, md: 0.5 },
            width: { xs: '100%', sm: '20%', md: '20.8%' }
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
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '0%' } }}>
            <FormControlLabel
              control={<Checkbox name="STATUS" size="small" checked={formData?.STATUS === "1"}
                onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Active"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '11%' } }}>
            <FormControlLabel
              control={<Checkbox name="DEFAULT_BRANCH" size="small" checked={formData?.DEFAULT_BRANCH === "1"}
                onChange={handleChangeStatus} />}
              disabled={isFormDisabled}
              label="Default Branch"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%', marginLeft: '8.5px' } }}>
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
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <AutoVibe
              id="TCS_TERM_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="TCS"
              name="TCS_TERM_KEY"
              value={formData?.TCS_TERM_KEY || 0}
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: '20%', md: '20.5%' }
            }}>
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Entity under SEZ</FormLabel>
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
          </Box>
        </Box>

      </Box>

    </Box>
  );
};

export default StepperMst1;
