'use client';
import React, { useState } from "react";

import {
  Box,
  Grid,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  StepConnector,
  TextField,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon,
} from "@mui/icons-material";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";

import { useSearchParams, useRouter } from 'next/navigation';
import CrudButtons from "@/GlobalFunction/CrudButtons";
import PaginationButtons from '@/GlobalFunction/PaginationButtons';

import Stepper1 from "@/components/masters/Customers/party/Stepper1";
import Stepper2 from "@/components/masters/Customers/party/Stepper2";
import Stepper3 from "@/components/masters/Customers/party/Stepper3";
import { getFormMode } from "../../../../lib/helpers";

const steps = ["Company Details", "Branch Details", "Terms Details"];

const FORM_MODE = getFormMode();

const PartyMst = () => {
  const router = useRouter();

  const [tabIndex, setTabIndex] = useState(0);

  const [openDialog, setopenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [mode, setMode] = useState("view");
  const [Index, setIndex] = useState(0);
  const [stepper1Data, setStepper1Data] = useState({});
  const [stepper2Data, setStepper2Data] = useState({});
  const [stepper3Data, setStepper3Data] = useState({});


  const handlePrint = () => { }
  const handleExit = () => {
    router.push('/dashboard');
  };

  const handleAdd = () => {
    // Your existing logic
  };

  const handlePrevClick = () => {
    // Your existing logic
  };

  const handleNextClick = () => {
    // Your existing logic
  };

  const handleSubmit = async () => {
    // Your existing logic
  };

  const handleCancel = async () => {
    // Your existing logic
  };

  const handleEdit = async () => {
    // Your existing logic
  };

  const handleDelete = async () => {
    setopenDialog(true);
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

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

  const handleTable = () => {
    router.push('/masters/customers/partyTable');
  };

  return (
    <Box>
      <ToastContainer />

      <Grid container alignItems="center"
        justifyContent="center" spacing={2}
      >

        <Grid>
          <Typography align="center" variant="h6">
            {tabIndex === 0 ? "Debtors/Customer Master" : tabIndex === 1 ? "Branch Details" : "Terms Details"}
          </Typography>

        </Grid>

        <Grid sx={{ position: 'relative', right: -192 }}>
          <TextField
            label="Search By Code"
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
        </Grid>
      </Grid>


      <Grid xs={12} sx={{ ml: '5%', mb: '0.5%' }}>
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
              label="Branches"
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
              label="Terms"
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
            index={Index}
            formData={stepper1Data} setFormData={setStepper1Data}
          />
        ) : tabIndex === 1 ? (
          <Stepper2
            formData={stepper2Data} setFormData={setStepper2Data}
          />
        ) : (
          <Stepper3
            formData={stepper3Data} setFormData={setStepper3Data}
          />
        )}
      </Grid>

      {tabIndex === 0 && (
        <Grid container alignItems="center"
          justifyContent="center" spacing={1} sx={{ marginTop: "20px", marginInline: '20px' }}>
          <Grid sx={{
            width: { xs: '100%', sm: 'auto' },
          }}>
            <Stack direction="row" spacing={1}>
              <PaginationButtons
                mode={mode}
                FORM_MODE={FORM_MODE}
                currentKey={''}
                onFirst={(e) => console.log(e.target.value)}
                onPrevious={(e) => console.log(e.target.value)}
                onNext={(e) => console.log(e.target.value)}
                onLast={(e) => console.log(e.target.value)}
                sx={{ mt: 2 }}
                buttonSx={Buttonsx}
              />
            </Stack>
          </Grid>
          <Grid>
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
              <CrudButtons
                mode={mode}
                onAdd={mode === "view" ? handleAdd : handleSubmit}
                onEdit={mode === "view" ? handleEdit : handleCancel}
                onView={handlePrint}
                onDelete={handleDelete}
                onSearch={handleTable}
                onExit={handleExit}
                readOnlyMode={mode === "view"}
              />
            </Stack>
          </Grid>
        </Grid>
      )}

    </Box>
  );
};

export default PartyMst;
