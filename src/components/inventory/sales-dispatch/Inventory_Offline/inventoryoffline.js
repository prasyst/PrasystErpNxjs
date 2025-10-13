'use client';
import React, { useEffect, useState, useCallback } from "react";
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
import { useSearchParams } from "next/navigation";
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
import axiosInstance from "@/lib/axios";

const SalesOrderOffline = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [mode, setMode] = useState("view");
  const [loading, setLoading] = useState(false);
  const [currentPARTY_KEY, setCurrentPARTY_KEY] = useState("");
  
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
    READY_SI: "0",
    SearchByCd: ""
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

  const searchParams = useSearchParams();
 const ordbkKey = searchParams.get("ordbkKey");

useEffect(() => {
  if (ordbkKey) {
    console.log("Got ORDBK_KEY from URL:", ordbkKey);
    fetchOrderDetails(ordbkKey);
  }
}, [ordbkKey]);


  // Function to fetch order details from API
  const fetchOrderDetails = async (ordbkKey) => {
    try {
      const payload = {
        ORDBK_KEY: ordbkKey,
        FLAG: ""
      };

      console.log('Fetching order details with payload:', payload);

      const response = await axiosInstance.post('/ORDBK/RetriveOrder', payload);
      console.log('API Response:', response.data);

      if (response.data.RESPONSESTATUSCODE === 1 && response.data.DATA.ORDBKList.length > 0) {
        const orderData = response.data.DATA.ORDBKList[0];
        populateFormData(orderData);
        setCurrentPARTY_KEY(orderData.PARTY_KEY);
      } else {
        console.error('No data found in response');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to populate form data from API response
  const populateFormData = (orderData) => {
    const formattedData = {
      apiResponseData: orderData ,
      ORDER_NO: orderData.ORDBK_NO || "",
      ORDER_DATE: orderData.ORDBK_DT ? formatDateForDisplay(orderData.ORDBK_DT) : "",
      PARTY_ORD_NO: orderData.PORD_REF || "",
      SEASON: orderData.CURR_SEASON_KEY || "",
      ORD_REF_DT: orderData.PORD_DT ? formatDateForDisplay(orderData.PORD_DT) : "",
      ENQ_NO: orderData.Enq_Key || "",
      PARTY_BRANCH: orderData.OrdBk_CoBr_Id || "",
      QUOTE_NO: orderData.QUOTE_NO || "",
      SHIPPING_PARTY: orderData.SHP_PARTY_KEY || "",
      DIV_PLACE: orderData.DESP_PORT || "",
      AR_SALES: orderData.SALEPERSON1_KEY || "",
      SHIPPING_PLACE: orderData.DESP_PORT || "",
      PRICE_LIST: orderData.PRICELIST_KEY || "",
      BROKER_TRANSPORTER: orderData.BROKER_KEY || "",
      B_EAST_II: "",
      NEW_ADDR: "",
      CONSIGNEE: orderData.SHP_PARTY_KEY || "",
      E_ASM1: "",
      BROKER1: orderData.BROKER1_KEY || "",
      SALESPERSON_2: orderData.SALEPERSON2_KEY || "",
      SALESPERSON_1: orderData.SALEPERSON1_KEY || "",
      NEW: "",
      EMAIL: "",
      REMARK_STATUS: orderData.REMK || "",
      MAIN_DETAILS: "G",
      GST_APPL: orderData.GST_APP || "Y",
      RACK_MIN: orderData.STK_FLG || "0",
      REGISTERED_DEALER: "0",
      SHORT_CLOSE: "0",
      READY_SI: orderData.READY_SI || "0",
      // Additional fields that might be useful
      ORDBK_KEY: orderData.ORDBK_KEY || "",
      PARTY_KEY: orderData.PARTY_KEY || "",
      ORDBK_AMT: orderData.ORDBK_AMT || "",
      ORDBK_ITM_AMT: orderData.ORDBK_ITM_AMT || "",
      ORDBK_GST_AMT: orderData.ORDBK_GST_AMT || "",
      ORDBK_DISC_AMT: orderData.ORDBK_DISC_AMT || "",
      CURRN_KEY: orderData.CURRN_KEY || "",
      EX_RATE: orderData.EX_RATE || "",
      DLV_DT: orderData.DLV_DT ? formatDateForDisplay(orderData.DLV_DT) : "",
      
    };

    console.log('Populating form with data:', formattedData);
    setFormData(formattedData);
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === "1900-01-01T00:00:00") return "";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch (error) {
      console.error('Error formatting date:', error);
      return "";
    }
  };

  const handlePrint = () => { }
  
  const handleExit = () => {
    router.push('/inverntory/stock-enquiry-table');
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
    // await fetchPartyData(currentPARTY_KEY, "P");
    setFormData((prev) => ({
      ...prev,
      SearchByCd: ''
    }));
  };

  const handleNextClick = async () => {
    if (currentPARTY_KEY) {
      // await fetchPartyData(currentPARTY_KEY, "N");
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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Function to fetch party data (you'll need to implement this based on your API)
  const fetchPartyData = async (searchValue, flag, isEnter = false) => {
    // Implement your party search logic here
    console.log('Fetching party data:', searchValue, flag, isEnter);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Typography>Loading order data...</Typography>
      </Box>
    );
  }

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
            {tabIndex === 0 ? "Sales Order(Offline)" : tabIndex === 1 ? "Branch Details" : "Terms Details"}
          </Typography>
        </Grid>

        <Grid sx={{ width: { xs: '100%', sm: '48%', md: '16%', display: 'flex' } }}>
          <TextField
            label="Search By Code"
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
                  background: 'linear-gradient(290deg, #4e8cff, #1e3c72)',
                  color: '#fff',
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
                  color: '#fff',
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
                  color: '#fff',
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
                  color: '#fff',
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

export default SalesOrderOffline;