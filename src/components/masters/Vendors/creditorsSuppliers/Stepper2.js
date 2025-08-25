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
const FORM_MODE = getFormMode();

const StepperMst2 = () => {
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const textInputSx = {
    '& .MuiInputBase-root': {
      height: 30,
      fontSize: '12px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '12px',
      top: '-6px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      overflow: 'hidden',
      height: 30,
      fontSize: '12px',
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '15px 12px 1px!important'
    }
  };

  const DropInputSx = {
    '& .MuiInputBase-root': {
      height: 30,
      fontSize: '12px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '12px',
      top: '-6px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      overflow: 'hidden',
      height: 30,
      fontSize: '12px',
      paddingRight: '32px', // Space for the icon
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '6px 12px',
      fontSize: '12px',
      lineHeight: '1.2',
    },
    '& .MuiAutocomplete-endAdornment': {
      top: '50%',
      transform: 'translateY(-50%)',
      right: '8px', // spacing from the right
    },
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.5, sm: 1.5, md: 0.7 },
          marginInline: { xs: '5%', sm: '5%', md: '15%' },
          marginTop: { xs: '15px', sm: '20px', md: '10px' },
        }}

      >
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          justifyContent: 'space-between',
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <TextField
              label="Code"
              disabled={isFormDisabled}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <TextField
              label="Alt Cd"
              disabled={isFormDisabled}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '20%' } }}>
            <TextField
              label="Abbr"
              disabled={isFormDisabled}
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
          <Box sx={{ width: { xs: '100%', sm: '60%', md: '40%' }, display: 'flex', alignItems: 'center' }}>
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">RD/URD</FormLabel>
            <RadioGroup
              row
              name="RDOFF"
              onChange={(e) => console.log(e.target.value)}
              disabled={isFormDisabled}
              value={""}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel disabled={isFormDisabled}
                value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>RD</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>URD</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="option3" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Composition</Typography>} />
            </RadioGroup>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="Name"
              disabled={isFormDisabled}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="Print Name"
              disabled={isFormDisabled}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <TextField
              label="Pincode"
              disabled={isFormDisabled}
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
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="Address"
              disabled={isFormDisabled}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="Place"
              disabled={isFormDisabled}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <TextField
              label="Tel"
              disabled={isFormDisabled}
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
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Country"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="State"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="City/District"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
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
          justifyContent: 'space-between',
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '40%' } }}>
            <TextField
              label="Email"
              disabled={isFormDisabled}
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
          <Box sx={{ width: { xs: '100%', sm: '60%', md: '40%' }, display: 'flex', alignItems: 'center' }}>
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">MSME Reg</FormLabel>
            <RadioGroup
              row
              name="RDOFF"
              onChange={(e) => console.log(e.target.value)}
              disabled={isFormDisabled}
              value={""}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel disabled={isFormDisabled}
                value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
            </RadioGroup>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '40%' } }}>
            <TextField
              label="MSME No"
              disabled={isFormDisabled}
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
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="Contact Person"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="Degn"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="MSME Trade"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="MSME Act"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
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
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="Mobile"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="MSME Class"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="Website"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <FormControlLabel
              control={<Checkbox name="ISSERVICE" size="small" checked={"1"}
                onChange={(e) => console.log(e.target.value)} />}
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
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="Excise No"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="CST"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Regd Off"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="VAT"
              disabled={isFormDisabled}
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
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 },
        }}>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="GL-Control A/c"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="PAN"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="IE Code"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <TextField
              label="UserName/Email"
              disabled={isFormDisabled}
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
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          gap: { xs: 1, sm: 1, md: 2 },
        }}>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <TextField
              label="TAN"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Company"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <TextField
              label="UserName/Password"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <TextField
              label="SMS Mobile No"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <FormControlLabel
              control={<Checkbox name="ISSERVICE" size="small" checked={"1"}
                onChange={(e) => console.log(e.target.value)} />}
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
          gap: { xs: 1, sm: 1, md: 2 },
        }}>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '24.7%' } }}>
            <TextField
              label="Party Class"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <FormControlLabel
              control={<Checkbox name="ISSERVICE" size="small" checked={"1"}
                onChange={(e) => console.log(e.target.value)} />}
              disabled={isFormDisabled}
              label="Default Branch"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />

          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <TextField
              label="GSTIN No"
              disabled={isFormDisabled}
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="TCS"
              name=""
              value={''}
              onChange={(e) => console.log(e.target.value)}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '60%', md: '40%' }, display: 'flex', alignItems: 'center' }}>
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Entity under SEZ</FormLabel>
            <RadioGroup
              row
              name="RDOFF"
              onChange={(e) => console.log(e.target.value)}
              disabled={isFormDisabled}
              value={""}
              sx={{ margin: '5px 0px 0px 0px' }}
            >
              <FormControlLabel disabled={isFormDisabled}
                value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
            </RadioGroup>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StepperMst2;
