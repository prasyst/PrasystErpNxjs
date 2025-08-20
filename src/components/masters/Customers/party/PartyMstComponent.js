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

import CrudButton from "../../../../GlobalFunction/CrudButton";

import StepperMst1 from "./Stepper1";
import StepperMst2 from "./Stepper2";
import StepperMst3 from "./Stepper3";
import { getFormMode } from "../../../../lib/helpers";

const steps = ["Company Details", "Branch Details", "Terms Details"];
const FORM_MODE = getFormMode();
const PartyMst = () => {
  // Add a tabIndex state for your tabs inside content area
  const [tabIndex, setTabIndex] = useState(0);

  // Your existing state variables and handlers (assuming they are declared somewhere)
  // For example:
  const [openDialog, setopenDialog] = useState(false);
  const [AllButtonDisabled, setAllButtonDisabled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState("view");
  const [Index, setIndex] = useState(0);
  const [CompanyData, setCompanyData] = useState(null);
  const [Cities, setCities] = useState([]);
  const [AllTextDisabled, setAllTextDisabled] = useState(false);
  const [viewModeDis, setViewModeDis] = useState(false);
  const [addModeDis, setAddModeDis] = useState(false);
  const [stepToNext, setStepToNext] = useState(null);
  const [Status, setStatus] = useState(null);
  const [AllfieldStepperData, setAllfieldStepperData] = useState(null);
  const [Flag, setFlag] = useState(null);
  const [CompanyId, setCompanyId] = useState(null);
  const [UserLoginId, setUserLoginId] = useState(null);


  const handlePrint = () => { }
  const handleExit = () => { }
  // Placeholder handlers (you’ll replace with your own)
  const handleCancel = async () => {
    setopenDialog(false);
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

  const handleEdit = async () => {
    // Your existing logic
  };

  const handleDelete = async () => {
    setopenDialog(true);
  };

  const handleConfirmDelete = async () => {
    // Your existing logic for delete confirm
    setopenDialog(false);
  };

  const handleMoveBack = () => {
    // Your existing logic to exit or move back
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
    <Grid>
      <ToastContainer />
      <Box className="form-container" sx={{ marginTop: "30px" }}>
        <Dialog
          open={openDialog}
          onClose={handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this record?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                backgroundColor: "#635bff",
                color: "white",
                "&:hover": { backgroundColor: "#1565c0", color: "white" },
              }}
              onClick={handleConfirmDelete}
            >
              Yes
            </Button>
            <Button
              sx={{
                backgroundColor: "#635bff",
                color: "white",
                "&:hover": { backgroundColor: "#1565c0", color: "white" },
              }}
              onClick={handleCancel}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={2}>
          {/* Header Section: KEEP EXACTLY AS IT WAS */}
          <Grid container alignItems="center"
            justifyContent="space-between" spacing={2} sx={{ marginInline: '15%', width: '100%' }}>
            <Grid sx={{
              display: 'flex', justifyContent: {
                xs: 'center',
                sm: 'flex-start',

              },
              width: { xs: '100%', sm: 'auto' },
            }}>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" size="small"
                  sx={Buttonsx}
                  onClick={handlePrevClick}
                  disabled={
                    mode !== FORM_MODE.read || !currentQUALITY_KEY || currentQUALITY_KEY === 1
                  }
                >
                  <KeyboardArrowLeftIcon />
                </Button>
                <Button variant="contained" size="small"
                  sx={Buttonsx}
                  onClick={handleNextClick}
                  disabled={mode !== FORM_MODE.read || !currentQUALITY_KEY}
                >
                  <NavigateNextIcon />
                </Button>
              </Stack>
            </Grid>
            <Grid sx={{ flexGrow: 1 }}>
              <Typography align="center" variant="h5">
                {tabIndex === 0 ? "Party Master" : tabIndex === 1 ? "Branch Details" : "Terms Details"}
              </Typography>

            </Grid>
            <Grid>
              <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}  >
                <CrudButton
                  mode={mode}
                  onAdd={handleAdd}
                  onEdit={handleEdit}
                  onView={handlePrint}
                  onDelete={handleDelete}
                  onExit={handleExit}
                  readOnlyMode={mode === FORM_MODE.read}
                />
              </Stack>
            </Grid>
          </Grid>


          <Grid item xs={12} sx={{ ml: '20%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
          <Grid item xs={12} >

            {tabIndex === 0 ? (
              <StepperMst1
                index={Index}
                mode={mode}
                CompanyData={CompanyData}
                Cities={Cities}
                AllTextDisabled={AllTextDisabled}
                AllButtonDisabled={AllTextDisabled}
                viewModeDis={viewModeDis}
                addModeDis={addModeDis}
                stepToNext={stepToNext}
                Status={Status}
                setStatus={setStatus}
                setMode={setMode}
                AllfieldStepperData={AllfieldStepperData}
                Flag={Flag}
                fetchCompanyData={() => { }}
                CompanyId={CompanyId}
              />
            ) : tabIndex === 1 ? (
              <StepperMst2
                mode={mode}
                Cities={Cities}
                AllfieldStepperData={AllfieldStepperData}
                CompanyId={CompanyId}
                setActiveStep={setActiveStep}
                fetchCompanyData={() => { }}
                viewModeDis={viewModeDis}
                addModeDis={addModeDis}
                setFlag={setFlag}
                IsButtonSubmit={AllTextDisabled}
                UserLoginId={UserLoginId}
                TextDisabledFast={setAllTextDisabled}
              />
            ) : (
              <StepperMst3
                mode={mode}
                Cities={Cities}
                AllfieldStepperData={AllfieldStepperData}
                CompanyId={CompanyId}
                setActiveStep={setActiveStep}
                fetchCompanyData={() => { }}
                viewModeDis={viewModeDis}
                addModeDis={addModeDis}
                setFlag={setFlag}
                IsButtonSubmit={AllTextDisabled}
                UserLoginId={UserLoginId}
                TextDisabledFast={setAllTextDisabled}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default PartyMst;
