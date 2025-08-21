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

const StepperMst3 = () => {
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
          gap: { xs: 1, sm: 1, md: 2 },
        }}>
          <Box sx={{ width: { xs: '100%', sm: '20%', md: '39.7%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Sale Type"
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
              label="Group"
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
              label="Salesperson 1"
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
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Salesperson 2"
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
              label="Category"
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
              label="Broker 1"
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '16.7%' } }}>
            <TextField
              label="Comm Rate"
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '22%' } }}>
            <FormControlLabel
              control={<Checkbox name="ISSERVICE" size="small" checked={"1"}
                onChange={(e) => console.log(e.target.value)} />}
              disabled={isFormDisabled}
              label="Commission On Gross Amt"
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '12px' }
              }}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '23.8%' } }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Trade Disc"
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '32.2%' } }}>
            <TextField
              label="Dlv Place"
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
              label="Tax Appbl"
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
              label="Broker"
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
              label="Transporter"
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
              label="Cash Disc"
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

          <Box sx={{ width: { xs: '100%', sm: '20%', md: '19.7%' } }}>
            <TextField
              label="Spl Mark Down"
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
              label="Interest Rate"
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
              label="Cr Period"
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
            <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Round Off</FormLabel>
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
                label={<Typography sx={{ fontSize: '12px' }}>None</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Nearest Re</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Rs.5</Typography>} />
            </RadioGroup>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StepperMst3;
