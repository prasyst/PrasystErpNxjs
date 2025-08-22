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

import CrudButtons from "@/GlobalFunction/CrudButtons";
import PaginationButtons from '@/GlobalFunction/PaginationButtons';

import StepperMst1 from "./Stepper1";
import StepperMst2 from "./Stepper2";
import StepperMst3 from "./Stepper3";
import { getFormMode } from "../../../../lib/helpers";

const steps = ["Company Details", "Branch Details", "Terms Details"];

const FORM_MODE = getFormMode();

const CreditorsSuppliersMst = () => {

  const [tabIndex, setTabIndex] = useState(0);

  const [openDialog, setopenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState("view");
  const [Index, setIndex] = useState(0);


  const handlePrint = () => { }
  const handleExit = () => { }

  const handleAdd = () => {
    // Your existing logic
  };

  const handlePrevClick = () => {
    // Your existing logic
  };

  const handleNextClick = () => {
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
    height: { xs: 40, sm: 46, md: 27 },
  };

  return (
    <Box>
      <ToastContainer />
      <Box>

        <Grid container alignItems="center"
          justifyContent="space-between" spacing={2} sx={{
            marginTop: { xs: '10px', sm: '10px', md: '10px', lg: '10px', xl: '10px' },
            marginInline: { xs: '20px', sm: '20px', md: '20px', lg: '20px', xl: '20px' }
          }}>

          <Grid sx={{ flexGrow: 1 }}>
            <Typography align="center" variant="h6">
              {tabIndex === 0 ? "Creditors/Suppliers Master" : tabIndex === 1 ? "Branch Details" : "Terms Details"}
            </Typography>

          </Grid>
        </Grid>


        <Grid xs={12} sx={{ ml: '20%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'left' }}>
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
        <Grid xs={12} sx={{ mt: '0.2%' }}>

          {tabIndex === 0 ? (
            <StepperMst1
              index={Index}
            />
          ) : tabIndex === 1 ? (
            <StepperMst2
            />
          ) : (
            <StepperMst3
            />
          )}
        </Grid>

        <Grid container alignItems="center"
          justifyContent="center" spacing={1} sx={{ marginTop: "30px", marginInline: '20px' }}>
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
                onAdd={mode === FORM_MODE.read ? handleAdd : ''}
                onEdit={mode === FORM_MODE.read ? handleEdit : ''}
                onView={handlePrint}
                onDelete={handleDelete}
                onExit={handleExit}
                readOnlyMode={mode === FORM_MODE.read}
              />
            </Stack>
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default CreditorsSuppliersMst;
