'use client'
import React, { useEffect, useState } from 'react';
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
import { toast, ToastContainer } from 'react-toastify';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CrudButton from '../../../../GlobalFunction/CrudButton';
import CustomAutocomplete from '../../../../GlobalFunction/CustomAutoComplete/CustomAutoComplete';
import EditableTable from '@/atoms/EditTable';

const columns = [
  { label: 'Size', field: 'FGSIZE_NAME', type: 'text' },
  { label: 'Abrv', field: 'FGSIZE_ABRV', type: 'text' },
  { label: 'SizePrint', field: '', type: 'text' },
  { label: 'MRPRD', field: 'MRPRD', type: 'text' },
  { label: 'SSPRD', field: 'SSPRD', type: 'text' },
  { label: 'Status', field: 'STATUS', type: 'checkbox' }
];

const ProductMst = () => {

  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(['Apple', 'Banana', 'Orange']);
  }, []);

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
      backgroundColor: 'transparent',
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

  // const DropInputSx = {
  //   '& .MuiInputBase-root': {
  //     height: 30,
  //     fontSize: '12px',
  //   },
  //   '& .MuiInputLabel-root': {
  //     fontSize: '12px',
  //     top: '-6px',
  //   },
  //   '& .MuiFilledInput-root': {
  //     backgroundColor: 'transparent',
  //     border: '1px solid #e0e0e0',
  //     borderRadius: '5px',
  //     overflow: 'hidden',
  //     height: 30,
  //     fontSize: '12px',
  //   },
  //   '& .MuiFilledInput-root:before': {
  //     display: 'none',
  //   },
  //   '& .MuiFilledInput-root:after': {
  //     display: 'none',
  //   },
  //   '& .MuiInputBase-input': {
  //     padding: '0px 12px 1px!important'
  //   }
  // };

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
      backgroundColor: 'transparent',
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

  const Buttonsx = {
    backgroundColor: '#39ace2',
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 27 },
    // "&:disabled": {
    //   backgroundColor: "rgba(0, 0, 0, 0.12)",
    //   color: "rgba(0, 0, 0, 0.26)",
    //   boxShadow: "none",
    // }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: value
      };

      return updatedForm;
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: { xs: '16px', sm: '20px', md: '4px' },
        boxSizing: 'border-box',
        bottom: 0,
        backgroundColor: 'rgb(236, 238, 240)',
        minHeight: '100vh',
        minWidth: '84vw',
        display: 'flex',
        overflow: 'hidden !important'
      }}

    >
      <ToastContainer />
      <Box
        sx={{
          width: { xs: '100%', sm: '100%', md: '100%', lg: '90%', xl: '90%' },
          maxWidth: { xs: '100%', sm: '90%', md: '1000px', lg: '1400px', xl: '1800px' },
          height: { xs: 'auto', sm: 'auto', md: '570px', lg: '570px', xl: '570px' },
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
          paddingBottom: '140px',
          // margin: 'auto !important',
          borderRadius: '8px',
          padding: '0px 20px 20px 20px',
          backgroundColor: '#fff'
        }}

      >
        <Grid container alignItems="center"
          justifyContent="space-between" spacing={2} sx={{
            marginTop: { xs: '10px', sm: '10px', md: '10px', lg: '10px', xl: '10px' },
            marginInline: { xs: '20px', sm: '20px', md: '20px', lg: '20px', xl: '20px' }
          }}>
          <Grid sx={{ display: 'flex' }}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" size="small"
                sx={Buttonsx}
                onClick={''}
                disabled={''}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              <Button variant="contained" size="small"
                sx={Buttonsx}
                onClick={''}
                disabled={''}
              >
                <NavigateNextIcon />
              </Button>
            </Stack>
          </Grid>
          <Grid sx={{ flexGrow: 1 }}>
            <Typography align="center" variant="h6">
              Product Master
            </Typography>
          </Grid>
          <Grid>
            <Stack direction="row" spacing={1}>
              <CrudButton
                mode={''}
                moduleName="Product Master"
                onAdd={''}
                onEdit={''}
                onView={''}
                onDelete={''}
                onExit={''}
                readOnlyMode={''}
              />
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, sm: 1.5, md: 0.7 },
            marginInline: { xs: '5%', sm: '5%', md: '15%' },
            marginTop: { xs: '15px', sm: '20px', md: '10px' },
          }}

        >
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <TextField
              placeholder="Search By Code"
              variant="filled"
              sx={{
                width: { xs: '100%', sm: '50%', md: '30%' }, marginBottom: '1px',
                backgroundColor: '#e0f7fa',
                '& .MuiInputBase-input': {
                  padding: { xs: '8px 0px', md: '2px 0px' },
                },
                '& .css-voecp4-MuiInputBase-input-MuiFilledInput-input': {
                  fontSize: '14px',
                },
              }}
              value={''}
              onChange={''}
              onKeyPress={''}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'row' },
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 1, md: 2 },
            }}
          >
            <TextField
              label="Series"
              disabled={''}
              variant="filled"
              fullWidth
              value={''}
              onChange={''}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <TextField
              label="Last Code"
              variant="filled"
              fullWidth
              onChange={''}
              name=""
              value={''}
              disabled={''}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <TextField
              label="Code"
              variant="filled"
              fullWidth
              name=""
              value={""}
              onChange={''}
              disabled={''}
              sx={textInputSx}
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
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 2 },
          }}>
            <CustomAutocomplete
              id=""
              // disabled={''}
              options={options || []}
              // getOptionLabel={''}
              label="Category"
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
            <CustomAutocomplete
              id=""
              // disabled={''}
              options={options || []}
              // getOptionLabel={''}
              label="ProductGroup"
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

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 2 },
            width: { xs: '100%', sm: '48%', md: '100%' },
          }}>
            <TextField
              label={
                <span>
                  Name <span style={{ color: 'red' }}>*</span>
                </span>
              }
              variant="filled"
              fullWidth
              name=""
              value={""}
              onChange={''}
              disabled={''}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '100%' },
              }}
            >
              <TextField
                label="PrdSeries"
                variant="filled"
                fullWidth
                name=""
                value={""}
                onChange={''}
                disabled={''}
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
              <CustomAutocomplete
                id=""
                // disabled={''}
                options={options || []}
                // getOptionLabel={''}
                label="Unit"
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

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1.5, md: 2 },
            width: { xs: '100%', sm: '48%', md: '100%' },
          }}>
            <TextField
              label="Description"
              variant="filled"
              fullWidth
              name=""
              value={""}
              onChange={''}
              disabled={''}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '100%' },
              }}
            >
              <TextField
                label="Mark UP Rt %"
                variant="filled"
                fullWidth
                name=""
                value={""}
                onChange={''}
                disabled={''}
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
              <TextField
                label="Mark.Dn Pur%"
                variant="filled"
                fullWidth
                name=""
                value={""}
                onChange={''}
                disabled={''}
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
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1.5, md: 2 },
            width: { xs: '100%', sm: '48%', md: '119.5%' }
          }}>
            <TextField
              label="Mark Down Rt %"
              variant="filled"
              fullWidth
              name=""
              value={""}
              onChange={''}
              disabled={''}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '140%' },
              }}
            >
              <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Round Off</FormLabel>
              <RadioGroup
                row
                name="RDOFF"
                onChange={handleInputChange}
                disabled={''}
                value={""}
              >
                <FormControlLabel disabled={''}
                  value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px' }}>None</Typography>} />
                <FormControlLabel disabled={''}
                  value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px' }}>Nearest Re</Typography>} />
                <FormControlLabel disabled={''}
                  value="option3" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px' }}>Rs. 5</Typography>} />
                <FormControlLabel disabled={''}
                  value="option4" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px' }}>Rs. 10</Typography>} />
              </RadioGroup>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 2 },
          }}>
            <CustomAutocomplete
              id=""
              // disabled={''}
              options={options || []}
              // getOptionLabel={''}
              label="Tax"
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
            <CustomAutocomplete
              id=""
              // disabled={''}
              options={options || []}
              // getOptionLabel={''}
              label="Brand"
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

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 2 },
            width: { xs: '100%', sm: '48%', md: '100%' },
          }}>
            <CustomAutocomplete
              id=""
              // disabled={''}
              options={options || []}
              // getOptionLabel={''}
              label="Excise Tariff"
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
            <CustomAutocomplete
              id=""
              // disabled={''}
              options={options || []}
              // getOptionLabel={''}
              label="Excise"
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '209%' },
              }}
            >
              <CustomAutocomplete
                id=""
                // disabled={''}
                options={options || []}
                // getOptionLabel={''}
                label="HSN Code"
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

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1.5, md: 2 },
            width: { xs: '100%', sm: '48%', md: '100%' }
          }}>
            <FormLabel sx={{ marginTop: '7px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Qc Req</FormLabel>
            <RadioGroup
              row
              name=""
              onChange={handleInputChange}
              disabled={''}
              value={""}
              sx={{ position: 'relative', right: 110 }}
            >
              <FormControlLabel disabled={''}
                value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
              <FormControlLabel disabled={''}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
            </RadioGroup>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '49%' },
              }}
            >
              <CustomAutocomplete
                id=""
                // disabled={''}
                options={options || []}
                // getOptionLabel={''}
                label="Qc SubGroup"
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
              flexDirection: { xs: 'column', sm: 'row', md: 'row' },
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 1, md: 1 },
              marginTop: '0px'
            }}
          >
            <EditableTable
              data={''}
              columns={columns}
              onCellChange={''}
              disabled={''}
              selectedRowIndex={''}
              onRowClick={handleInputChange}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', md: 'column' },
                justifyContent: 'flex-start',
                marginTop: '14px',
                gap: { xs: 1, sm: 1, md: 1 },
              }}
            >
              <TextField
                type="date"
                label={
                  <span>
                    Eff Date <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                variant="filled"
                fullWidth
                onChange={handleInputChange}
                disabled={''}
                value={""}
                name=""
                sx={textInputSx}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button variant="contained" color="primary" sx={{
                paddingBlock: '4px', paddingInline: '0px', fontSize: '10px', whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}>Mandatory Acc In Bom</Button>
              <Button variant="contained" color="primary" sx={{ paddingBlock: '4px', paddingInline: '0px', fontSize: '10px' }}>Allocate Type</Button>
              <Button variant="contained" color="primary"
                onClick={handleInputChange}
                disabled={''}
                sx={{
                  paddingBlock: '4px',
                  paddingInline: '0px',
                  fontSize: '10px'
                }}>
                Del Size
              </Button>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 1 },
            // paddingBottom: '60px',
          }}>
            <Box>
              <FormControlLabel
                control={<Checkbox name="ISSERVICE" size="small" checked={''}
                  onChange={handleInputChange} />}
                disabled={''}
                label="Is Service"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '12px' }
                }}
              />
              <FormControlLabel
                control={<Checkbox name="Excise_appl" size="small" checked={''}
                  onChange={handleInputChange} />}
                disabled={''}
                label="Excise Appl"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '12px' }
                }}
              />
              <FormControlLabel
                control={<Checkbox name="Is_Unique" size="small" checked={''}
                  onChange={handleInputChange} />}
                disabled={''}
                label="Is Unique"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '12px' }
                }}
              />
              <FormControlLabel
                control={<Checkbox name="STATUS" size="small" checked={''}
                  onChange={handleInputChange} />}
                disabled={''}
                label="Active"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '12px' }
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: '',
                gap: 1,
                marginTop: '16px',
                position: 'relative',
                left: 140
              }}>
              <>

                <Button variant="contained"
                  sx={{ background: "#A8E2C5", height: '30px', fontSize: '12px' }}
                  onClick={handleInputChange}
                >
                  Submit
                </Button>
                <Button variant="contained"
                  sx={{ background: "#BFBFBF", height: '30px', fontSize: '12px' }}
                  onClick={handleInputChange}
                >
                  Cancel
                </Button>
              </>
            </Box>
          </Box>

        </Box>

      </Box>
    </Box>
  )
}

export default ProductMst;