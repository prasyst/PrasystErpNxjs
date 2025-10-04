
'use client';
import React, { useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { TbListSearch } from "react-icons/tb";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon,
} from "@mui/icons-material";
import { useRouter } from 'next/navigation';
import CrudButton from "@/GlobalFunction/CrudButton";
import Stepper1 from "./stepper1";
import Stepper2 from "./stepper2";
import Stepper3 from "./stepper3";

const packagingBarcode = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [mode, setMode] = useState("view");
  const [formData, setFormData] = useState({
    ORDER_NO: "",
    ORDER_DATE: "",
    PARTY_ORD_NO: "",
    SEASON: "",
    ORD_REF_DT: "",
    ENQ_NO: "",
    PARTY_BRANCH: "",
    QUOTE_NO: "",
    SHIPPING_PARTY: "",
    DIV_PLACE: "",
    AR_SALES: "",
    SHIPPING_PLACE: "",
    PRICE_LIST: "",
    BROKER_TRANSPORTER: "",
    B_EAST_II: "",
    NEW_ADDR: "",
    CONSIGNEE: "",
    E_ASM1: "",
    BROKER1: "",
    SALESPERSON_2: "",
    NEW: "",
    EMAIL: "",
    REMARK_STATUS: "",
    MAIN_DETAILS: "G",
    GST_APPL: "Y",
    RACK_MIN: "0",
    REGISTERED_DEALER: "0",
    SHORT_CLOSE: "0",
    READY_SI: "0"
  });
    const Buttonsx = {
    backgroundColor: '#39ace2',
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 30 },
  };

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
      backgroundColor: '#e0f7fa',
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

  const handlePrint = () => { }
  const handleExit = () => {
    router.push('/dashboard');
  };

  const handleAdd = () => {
    setMode('add');
    setIsFormDisabled(false);
  };

  const handleSubmit = () => {
    // Submit logic here
    setMode('view');
    setIsFormDisabled(true);
  };

  const handleCancel = () => {
    setMode('view');
    setIsFormDisabled(true);
  };
  const handlePrevClick = async () => {
    await fetchPartyData(currentPARTY_KEY, "P");
    setFormData((prev) => ({
      ...prev,
      SearchByCd: ''
    }));
  };

  const handleNextClick = async () => {
    if (currentPARTY_KEY) {
      await fetchPartyData(currentPARTY_KEY, "N");
      setFormData((prev) => ({
        ...prev,
        SearchByCd: ''
      }));
    }
  };

  const handleEdit = () => {
    setMode('edit');
    setIsFormDisabled(false);
  };

  const handleDelete = () => {
    // Delete logic here
    setMode('view');
  };

  // const handleTable = () => {
  //   router.push('/sales/orders');
  // };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" sx={{ ml: '4.9%', mr: '5%' }}
        spacing={2}
      >
        <Grid>
          <Button
            variant="contained"
            size="small"
            sx={{ background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4) !important' }}
            disabled={mode !== 'view'}
            onClick={handlePrevClick}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important', ml: 1 }}
            disabled={mode !== 'view'}
            onClick={handleNextClick}
          >
            <NavigateNextIcon />
          </Button>
        </Grid>
        <Grid>
          <Typography align="center" variant="h6">
            {tabIndex === 0 ? "Packing Slip from Barcode" : tabIndex === 1 ? "Branch Details" : "Terms Details"}
          </Typography>

        </Grid>

        <Grid sx={{ width: { xs: '100%', sm: '48%', md: '16%', display: 'flex' } }}>
          <TextField
            label="Search By Package No"
            variant="filled"
            fullWidth
            value={formData.SearchByCd}
            onChange={(e) => setFormData({ ...formData, SearchByCd: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                fetchPartyData(e.target.value, 'R', true);
              }
            }}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '4px 8px',
                fontSize: '12px',
              },
            }}
          />
           {/* <TbListSearch onClick={handleTable}  */}
            {/* style={{ color: 'rgb(99, 91, 255)', width: '40%' , height: '62%' }} /> */}
        </Grid>

        <Grid sx={{ display: "flex", justifyContent: "end" }}>
          <CrudButton
            moduleName=""
            mode={mode}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExit={handleExit}
            readOnlyMode={mode === "view"}
            onPrevious={handlePrevClick}
            onNext={handleNextClick}
          />
        </Grid>
      </Grid>

      <Grid xs={12} sx={{ ml: '5%', mb: '0.5%', mt: '1%' }}>
        <Box sx={{ display: 'flex' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Main Branch Tabs"
            sx={{
              minHeight: '36px',
              '.MuiTabs-indicator': {
                height: '3px',
                backgroundColor: '#635BFF',
              },
            }}
          >
            <Tab
              label="Main"
              sx={{
                minHeight: '36px',
                padding: '6px 16px',
                textTransform: 'none',
                lineHeight: 1,
                backgroundColor: tabIndex === 0 ? '#e0e0ff' : 'transparent',
                '&.Mui-selected': {
                  color: '#000',
                  fontWeight: 'bold',
                },
              }}
            />
            <Tab
              label="Details"
              sx={{
                minHeight: '36px',
                padding: '6px 16px',
                textTransform: 'none',
                lineHeight: 1,
                backgroundColor: tabIndex === 1 ? '#e0e0ff' : 'transparent',
                '&.Mui-selected': {
                  color: '#000',
                  fontWeight: 'bold',
                },
              }}
            />
            <Tab
              label="Barcode Details"
              sx={{
                minHeight: '36px',
                padding: '6px 16px',
                textTransform: 'none',
                lineHeight: 1,
                backgroundColor: tabIndex === 2 ? '#e0e0ff' : 'transparent',
                '&.Mui-selected': {
                  color: '#000',
                  fontWeight: 'bold',
                },
              }}
            />
            <Tab
              label="Tax/Terms"
              sx={{
                minHeight: '36px',
                padding: '6px 16px',
                textTransform: 'none',
                lineHeight: 1,
                backgroundColor: tabIndex === 2 ? '#e0e0ff' : 'transparent',
                '&.Mui-selected': {
                  color: '#000',
                  fontWeight: 'bold',
                },
              }}
            />
          </Tabs>
        </Box>
      </Grid>
      
      <Grid xs={12}>
  {tabIndex === 0 ? (
    <Stepper1 
      formData={formData} 
      setFormData={setFormData} 
      isFormDisabled={isFormDisabled}
      mode={mode}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  ) : tabIndex === 1 ? (
    <Stepper2 
      formData={formData} 
      setFormData={setFormData} 
      isFormDisabled={isFormDisabled}
      mode={mode}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  ) : (
    <Stepper3 
      formData={formData} 
      setFormData={setFormData} 
      isFormDisabled={isFormDisabled}
      mode={mode}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )}

  
</Grid>

{tabIndex === 0 && (
  <Grid xs={12} sx={{ display: "flex", justifyContent: "end", mr: '4.5%' }}>
    {mode === 'view' && (
      <>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(290deg, #4e8cff, #1e3c72)', // blue gradient
            color: '#fff', // white text
            margin: { xs: '0 4px', sm: '0 6px' },
            minWidth: { xs: 40, sm: 46, md: 60 },
            height: { xs: 40, sm: 46, md: 30 },
          }}
          onClick={handleAdd}
          disabled
        >
          Confirm
        </Button>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(290deg, #4e8cff, #1e3c72)',
            color: '#fff', // white text
            margin: { xs: '0 4px', sm: '0 6px' },
            minWidth: { xs: 40, sm: 46, md: 60 },
            height: { xs: 40, sm: 46, md: 30 },
          }}
          onClick={handleEdit}
          disabled
        >
          Cancel
        </Button>
      </>
    )}
    {(mode === 'edit' || mode === 'add') && (
      <>
        <Button
          variant="contained"
          sx={{
            margin: { xs: '0 4px', sm: '0 6px' },
            background: 'linear-gradient(290deg, #4e8cff, #1e3c72)',
            color: '#fff', // white text
            minWidth: { xs: 40, sm: 46, md: 60 },
            height: { xs: 40, sm: 46, md: 30 },
          }}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
        <Button
          variant="contained"
          sx={{
            margin: { xs: '0 4px', sm: '0 6px' },
            background: 'linear-gradient(290deg, #4e8cff, #1e3c72)',
            color: '#fff', // white text
            minWidth: { xs: 40, sm: 46, md: 60 },
            height: { xs: 40, sm: 46, md: 30 },
          }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </>
    )}
  </Grid>
)}


    </Box>
  );
};

export default packagingBarcode;