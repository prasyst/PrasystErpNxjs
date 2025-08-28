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

const Stepper1 = () => {

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
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
              disabled={""}
              variant="filled"
              fullWidth
              value={""}
              onChange={(e) => console.log(e.target.value)}
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
              disabled={""}
              variant="filled"
              fullWidth
              value={""}
              onChange={(e) => console.log(e.target.value)}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '48%', md: '9%' } }}>
            <TextField
              label="Alt Cd"
              variant="filled"
              fullWidth
              onChange={(e) => console.log(e.target.value)}
              name="LASTID"
              value={""}
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
              name="FGPRD_KEY"
              value={""}
              onChange={(e) => console.log(e.target.value)}
              disabled={""}
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
              name="RDOFF"
              onChange={(e) => console.log(e.target.value)}
              disabled={''}
              value={""}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel disabled={''}
                value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>RD</Typography>} />
              <FormControlLabel disabled={''}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>URD</Typography>} />
              <FormControlLabel disabled={''}
                value="option3" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Composition</Typography>} />
            </RadioGroup>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 }
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
            <TextField
              label="Print Name"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={""}
              name="FGPRD_ABRV"
              disabled={""}
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
            <AutoVibe
              id="UNIT_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Country"
              name="UNIT_KEY"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <AutoVibe
              id="UNIT_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="State"
              name="UNIT_KEY"
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
          {/* <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <AutoVibe
              id="UNIT_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="City/District"
              name="UNIT_KEY"
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
          </Box> */}
          {/* <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
            <TextField
              label="Place"
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
          </Box> */}
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '33.5%' } }}>
            <TextField
              label="Address"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={""}
              disabled={""}
              name=""
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
            {/* <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'row' },
              gap: { xs: 1, sm: 1, md: 0.5 },
            }}>
              <TextField
                label="Pincode"
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
              <AutoVibe
                id="UNIT_KEY"
                disabled={""}
                getOptionLabel={(option) => option || ''}
                options={[]}
                label="Pincode"
                name="UNIT_KEY"
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
            </Box> */}
            <AutoVibe
              id="UNIT_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="City/District"
              name="UNIT_KEY"
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
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'row' },
              gap: { xs: 1, sm: 1, md: 0.5 },
            }}>
              <TextField
                label="Pincode"
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
              <AutoVibe
                id="UNIT_KEY"
                disabled={""}
                getOptionLabel={(option) => option || ''}
                options={[]}
                label="Pincode"
                name="UNIT_KEY"
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

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'column' },
            gap: { xs: 1, sm: 1, md: 0.5 },
            width: { xs: '100%', sm: '20%', md: '20.5%' }
          }}>
            <TextField
              label="Place"
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
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'row' },
              gap: { xs: 1, sm: 1, md: 2 },
              width: { xs: '100%', sm: '20%', md: '207.7%' }
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                gap: { xs: 1, sm: 1, md: 2 },
                width: { xs: '100%', sm: '20%', md: '100%' }
              }}>

                <TextField
                  label="Tel"
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
              <TextField
                label="Email"
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
              name="RDOFF"
              onChange={(e) => console.log(e.target.value)}
              disabled={''}
              value={""}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel disabled={''}
                value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
              <FormControlLabel disabled={''}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
            </RadioGroup>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <TextField
              label="MSME No"
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
            <AutoVibe
              id="BRAND_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="MSME Trade"
              name="BRAND_KEY"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <AutoVibe
              id="BRAND_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="MSME Act"
              name="BRAND_KEY"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <AutoVibe
              id="BRAND_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="MSME Class"
              name="BRAND_KEY"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15.1%' } }}>
            <AutoVibe
              id="BRAND_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Degn"
              name="BRAND_KEY"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%' } }}>
            <TextField
              label="Mobile"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <TextField
              label="Website"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.6%' } }}>
            <FormControlLabel
              control={<Checkbox name="ISSERVICE" size="small" checked={"1"}
                onChange={handleInputChange} />}
              disabled={""}
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
              value={""}
              disabled={""}
              name=""
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
            <TextField
              label="CST"
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
            <AutoVibe
              id="UNIT_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="GL-Control A/c"
              name="UNIT_KEY"
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

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'column' },
            gap: { xs: 1, sm: 1, md: 0.5 },
            width: { xs: '100%', sm: '20%', md: '20.5%' }
          }}>
            <TextField
              label="PAN"
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
            <TextField
              label="TAN"
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
              label="UserName/Password"
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
            <AutoVibe
              id="BRAND_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Company"
              name="BRAND_KEY"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '15%' } }}>
            <TextField
              label="SMS Mobile No"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '0%' } }}>
            <FormControlLabel
              control={<Checkbox name="ISSERVICE" size="small" checked={"1"}
                onChange={handleInputChange} />}
              disabled={""}
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
              id="BRAND_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Party Class"
              name="BRAND_KEY"
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '11%' } }}>
            <FormControlLabel
              control={<Checkbox name="ISSERVICE" size="small" checked={"1"}
                onChange={handleInputChange} />}
              disabled={""}
              label="Default Branch"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20.5%', marginLeft: '7.5px' } }}>
            <TextField
              label="GSTIN No"
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
            <AutoVibe
              id="BRAND_KEY"
              disabled={""}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="TCS"
              name="BRAND_KEY"
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: '20%', md: '20.5%' }
            }}>
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Entity under SEZ</FormLabel>
            <RadioGroup
              row
              name="RDOFF"
              onChange={(e) => console.log(e.target.value)}
              disabled={''}
              value={""}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel disabled={''}
                value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
              <FormControlLabel disabled={''}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
            </RadioGroup>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1.5, md: 2 }
        }}>

        </Box>

      </Box>

    </Box>
  )
}

export default function Wrapper() {
  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <Stepper1 />
    </Suspense>
  );
}







