'use client';
import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import StepperMst1 from "./Stepper1";
import StepperMst2 from "./Stepper2";
import CrudButtons from "@/GlobalFunction/CrudButtons";
import PaginationButtons from "@/GlobalFunction/PaginationButtons";
import { getFormMode } from "@/lib/helpers";

const steps = ["Company Details", "Branch Details"];
const FORM_MODE = getFormMode();

const CompanyMst = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [openDialog, setopenDialog] = useState(false);
    const [mode, setMode] = useState(
          //  currentCOMPANY_KEY ? FORM_MODE.read : FORM_MODE.add);
          FORM_MODE.add);

  const handlePrint = () => { };
  const handleExit = () => { };

  const handleCancel = async () => {
    setopenDialog(false);
  };

  const handleAdd = () => {
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

  const handleFirst = () => { };
  const handleLast = () => { };
  const handleNext = () => { };
  const handlePrevious = () => { };

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
      <Box sx={{ marginTop: "30px" }}>
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

          {/* Header Section */}
          {/* Tabs + Heading in same row */}
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              marginTop: "2px",
              marginInline: '10%',
              width: 'auto',
              flexWrap: 'wrap',
              mb: 0,
            }}
          >
            {/* Tabs */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  label="Branch"
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
              </Tabs>
            </Box>

            {/* Heading */}
            <Typography variant="h5" sx={{ fontWeight: 500, ml: 2 }}>
              {tabIndex === 0 ? "Company Master" : "Branch Details"}
            </Typography>
          </Grid>

          {/* Stepper Section */}
          <Grid item xs={12} sx={{ ml: '10%' }}>


            {/* Stepper components */}
            {tabIndex === 0 ? (
              <StepperMst1
               
              />
            ) : (
              <StepperMst2
               
              />
            )}
          </Grid>

          {/* Pagination and CRUD buttons only show for Main tab */}
          {tabIndex === 0 && (
            <Grid container alignItems="center"
              justifyContent="center" spacing={1} sx={{ marginTop: "0px", marginInline: '15%', width: '100%' }}>
              <Grid sx={{
                display: 'flex', justifyContent: {
                  xs: 'center',
                  sm: 'flex-start',
                },
                width: { xs: '100%', sm: 'auto' },
              }}>
                <Stack direction="row" spacing={1}>
                  <PaginationButtons
                    mode={mode}
                    FORM_MODE={FORM_MODE}
                    onFirst={handleFirst}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onLast={handleLast}
                    sx={{ mt: 2 }}
                    buttonSx={Buttonsx}
                  />
                </Stack>
              </Grid>
              <Grid>
                <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}  >
                  <CrudButtons
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
          )}
        </Grid>
      </Box>
    </Grid>
  );
};

export default CompanyMst;
