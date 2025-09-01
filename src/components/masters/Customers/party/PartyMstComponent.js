'use client';
import React, { useState, useEffect } from "react";

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
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from '../../../../lib/axios';
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
  const [seriesData, setSeriesData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [mode, setMode] = useState("view");
  const [Index, setIndex] = useState(0);
  const [stepper1Data, setStepper1Data] = useState({ LASTID: "" });
  const [stepper2Data, setStepper2Data] = useState({});
  const [stepper3Data, setStepper3Data] = useState({});
  const FCYR_KEY = localStorage.getItem('FCYR_KEY');
  const COBR_ID = localStorage.getItem('COBR_ID');
  const UserName = localStorage.getItem('USER_NAME');
  const CO_ID = localStorage.getItem('CO_ID');

  const [formData, setFormData] = useState({
    LASTID: ""
  });

  const handlePrint = () => { }
  const handleExit = () => {
    router.push('/dashboard');
  };

  const handleAdd = async () => {

    setMode('add');
    setIsFormDisabled(false);
    setFormData({

      LASTID: ""

    });
    // setCurrentFGPRD_KEY(null);

    try {
      const responseSecond = await axiosInstance.post(`GetSeriesSettings/GetSeriesLastNewKey`, {

        MODULENAME: "Party",
        TBLNAME: "Party",
        FLDNAME: "Party_KEY",
        NCOLLEN: 5,
        CPREFIX: "PC",
        COBR_ID: COBR_ID,
        FCYR_KEY: FCYR_KEY,
        TRNSTYPE: "M",
        SERIESID: 0,
        FLAG: ""

      });
      if (
        responseSecond.data.STATUS === 0 &&
        responseSecond.data.RESPONSESTATUSCODE === 1
      ) {
        setSeriesData(responseSecond.data.DATA);

        // setFormData((prev) => ({
        //   ...prev,
        //   LASTID: responseSecond.data.DATA[0]?.LASTID || ""
        // })

        const abcValue = responseSecond.data.DATA[0]?.LASTID || "";

        // setFormData((prev) => {
        //   const updated = { ...prev, LASTID: responseSecond.data.DATA[0]?.LASTID || "" };
        //   console.log("Updated formData:", updated);
        //   return updated;
        // });

        setFormData((prev) => ({
          ...prev,
          LASTID: abcValue
        }));

        setStepper1Data((prev) => ({
          ...prev,
          LASTID: abcValue
        }));

      } else {
        toast.error("Failed to fetch Series");
      }
    } catch (error) {
      console.error("Error fetching Series", error);
      toast.error("Error fetching Series. Please try again.");
    }

  };

  const handlePrevClick = () => {

  };

  const handleNextClick = () => {

  };

  const handleSubmit = async () => {

    const payload = [{
      DBFLAG: stepper1Data.DBFLAG || "I",
      PARTY_KEY: stepper1Data.PARTY_KEY || "",
      PARTY_ALT_CODE: stepper1Data.PARTY_ALT_CODE || "",
      PARTY_CAT: stepper1Data.PARTY_CAT || "",
      PARTY_NAME: stepper1Data.PARTY_NAME || "",
      PARTY_ABRV: stepper1Data.PARTY_ABRV || "",
      ADDR: stepper1Data.ADDR || "",
      REG_ADD: stepper1Data.REG_ADD || "",
      WORK_ADD: stepper1Data.WORK_ADD || "",
      CONT_KEY: stepper1Data.CONT_KEY || "",
      CITY_KEY: stepper1Data.CITY_KEY || "",
      TEL_NO: stepper1Data.TEL_NO || "",
      FAX_NO: stepper1Data.FAX_NO || "",
      E_MAIL: stepper1Data.E_MAIL || "",
      WEBSITE: stepper1Data.WEBSITE || "",
      CONTACT_PERSON: stepper1Data.CONTACT_PERSON || "",
      MOBILE_NO: stepper1Data.MOBILE_NO || "",
      SST: stepper1Data.SST || "",
      CST: stepper1Data.CST || "",
      IE_CODE: stepper1Data.IE_CODE || "",
      EXCISE_CODE: stepper1Data.EXCISE_CODE || "",
      PAN_NO: stepper1Data.PAN_NO || "",
      TAN_NO: stepper1Data.TAN_NO || "",
      STATUS: stepper1Data.STATUS || "",
      CREATED_BY: stepper1Data.CREATED_BY || "",
      CREATED_DT: stepper1Data.CREATED_DT || "2025-07-30T10:30:00",
      PLACE: stepper1Data.PLACE || "",
      VAT: stepper1Data.VAT || "",
      PARTY_IMG: stepper1Data.PARTY_IMG || "",
      PYTTYPE_KEY: stepper1Data.PYTTYPE_KEY || "",
      DEDTYPE_KEY: stepper1Data.DEDTYPE_KEY || "",
      PYTTYPEDTL_ID: stepper1Data.PYTTYPEDTL_ID || "",
      NET_TDS: stepper1Data.NET_TDS || "",
      ROFF: stepper1Data.ROFF || "",
      SMS_MOBILENO: stepper1Data.SMS_MOBILENO || "",
      ACCLED_ID: stepper1Data.ACCLED_ID || "",
      CONTDESG: stepper1Data.CONTDESG || "",
      PRINTNAME: stepper1Data.PRINTNAME || "",
      GSTTIN_NO: stepper1Data.GSTTIN_NO || "",
      PARTY_TYPE: stepper1Data.PARTY_TYPE || "",
      RD_URD: stepper1Data.RD_URD || "",
      PINCODE: stepper1Data.PINCODE || "",
      CO_ID: stepper1Data.CO_ID || "",
      WebUserName: stepper1Data.WebUserName || "",
      WebPassword: stepper1Data.WebPassword || "",
      SEZ: stepper1Data.SEZ || "",
      WSTKLOC_KEY: stepper1Data.WSTKLOC_KEY || "",
      PARTY_CLASS_KEY: stepper1Data.PARTY_CLASS_KEY || "",
      INTERNAL_PROCESS: stepper1Data.INTERNAL_PROCESS || "",
      MANUAL_WSP: stepper1Data.MANUAL_WSP || "",
      MSME_FLAG: stepper1Data.MSME_FLAG || "",
      MSME_NO: stepper1Data.MSME_NO || "",
      MSME_TR: stepper1Data.MSME_TR || "",
      MSME_CLASS: stepper1Data.MSME_CLASS || "",
      MSME_ACT: stepper1Data.MSME_ACT || "",
      DEFAULT_BRANCH: stepper1Data.DEFAULT_BRANCH || "",
      PartyDtlEntities: stepper2Data.map((data) => ({
        DBFLAG: data.DBFLAG || "I",
        PARTYDTL_ID: data.PARTYDTL_ID || "",
        PARTY_KEY: data.PARTY_KEY || "",
        ADDR: data.ADDR || "",
        CONT_KEY: data.CONT_KEY || "",
        CITY_KEY: data.CITY_KEY || "",
        TEL_NO: data.TEL_NO || "",
        FAX_NO: data.FAX_NO || "",
        E_MAIL: data.E_MAIL || "",
        WEBSITE: data.WEBSITE || "",
        CONTACT_PERSON: data.CONTACT_PERSON || "",
        MOBILE_NO: data.MOBILE_NO || "",
        SST: data.SST || "",
        CST: data.CST || "",
        EXCISE_CODE: data.EXCISE_CODE || "",
        REMK: data.REMK || "",
        STATUS: data.STATUS || "",
        PLACE: data.PLACE || "",
        VAT: data.VAT || "",
        MAIN_BRANCH: data.MAIN_BRANCH || "",
        RD_URD: data.RD_URD || "",
        PINCODE: data.PINCODE || "",
        GSTTIN_NO: data.GSTTIN_NO || "",
        TAX_KEY: data.TAX_KEY || "",
        TERM_KEY: data.TERM_KEY || "",
        TRSP_KEY: data.TRSP_KEY || "",
        TRADE_DISC: data.TRADE_DISC || "",
        RDOFF: data.RDOFF || "",
        CFORM_FLG: data.CFORM_FLG || "",
        PARTY_ALT_CODE: data.PARTY_ALT_CODE || "",
        ORD_SYNCSTATUS: data.ORD_SYNCSTATUS || "",
        SEZ: data.SEZ || "",
        DEFAULT_BRANCH: data.DEFAULT_BRANCH || "",
      })),
      CLIENTTERMSEntities: stepper3Data.map((item) => ({
        DBFLAG: item.DBFLAG || "I",
        CLIENTTERMS_ID: item.CLIENTTERMS_ID || "",
        CLIENTTERMS_ALT_CODE: item.CLIENTTERMS_ALT_CODE || "",
        PARTY_KEY: item.PARTY_KEY || "",
        CLIENTGRP_KEY: item.CLIENTGRP_KEY || "",
        CLIENTCAT_KEY: item.CLIENTCAT_KEY || "",
        BROKER_KEY: item.BROKER_KEY || "",
        BANK_NAME: item.BANK_NAME || "",
        BRANCH_NAME: item.BRANCH_NAME || "",
        ACCOUNT_NO: item.ACCOUNT_NO || "",
        DLV_PLACE: item.DLV_PLACE || "",
        TRSP_KEY: item.TRSP_KEY || "",
        DISC_KEY: item.DISC_KEY || "",
        CR_LIMIT: item.CR_LIMIT || "",
        CR_PERIOD: item.CR_PERIOD || "",
        INT_PERC: item.INT_PERC || "",
        TRADE_DISC: item.TRADE_DISC || "",
        INSURANCE: item.INSURANCE || "",
        RATING: item.RATING || "",
        STOP_DESP: item.STOP_DESP || "",
        STOP_DESC_DT: item.STOP_DESC_DT || "1900-01-01T00:00:00",
        STOP_DESP_REASON: item.STOP_DESP_REASON || "",
        CFORM_FLG: item.CFORM_FLG || "",
        RDOFF: item.RDOFF || "",
        TAX_KEY: item.TAX_KEY || "",
        TERM_KEY: item.TERM_KEY || "",
        DISTBTR_KEY: item.DISTBTR_KEY || "",
        SALEPERSON1_KEY: item.SALEPERSON1_KEY || "",
        SALEPERSON2_KEY: item.SALEPERSON2_KEY || "",
        SPL_INSTR: item.SPL_INSTR || "",
        COMM_RATE: item.COMM_RATE || "",
        COMM_ONGROSS: item.COMM_ONGROSS || "",
        Op_Date: "1900-01-01T00:00:00",
        Cl_Date: "2021-09-17T00:00:00",
        Franch_Status: "0",
        Master_Franch: "",
        ShowRoom_Area: 0,
        Settelment_Period: "",
        Comm_Sale: 0.0,
        Franch_Comm_Rate: 0.0,
        CommAppl_Amt: 0.0,
        Deposit_Amt: 0.0,
        Deposit_Accled_Id: 0,
        FranchAccPm1_Key: "",
        Amount1: 0.0,
        SaleType_Id: 14,
        UsageRemk: "",
        Area: "",
        Product: "",
        SETTELEMENT_REMK: "",
        SETTELEMENT_DT: "1900-01-01T00:00:00",
        SETTELEMENT_AMT: 0.0,
        IFSC_CODE: "",
        TARGET_PERC: 30,
        TCS_TERM_KEY: "",
        BROKER1_KEY: ""
      }))
    }];

    let response;
    if (mode === 'edit') {
      // payload.FGPRD_KEY = currentFGPRD_KEY;
      // payload.UPDATED_BY = 2;
      // response = await axiosInstance.patch(`Product/ManageFgPrdSize?UserName=${(UserName)}&strCobrid=${COBR_ID}`, payload);

      // console.log("payload", payload);
    } else {
      payload.CREATED_BY = 2;
      response = await axiosInstance.post(`Party/ManagePartyBranch?UserName=${UserName}&strCobrid=${COBR_ID}`, payload);
    }

    if (response.data.STATUS === 0 && response.data.RESPONSESTATUSCODE === 1) {
      toast.success(response.data.MESSAGE);
      setIsFormDisabled(true);

    } else {
      toast.error(response.data.MESSAGE || 'Operation failed');
    }

  };

  const handleCancel = async () => {

  };

  const handleEdit = async () => {

  };

  const handleDelete = async () => {
    setopenDialog(true);
  };

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

  console.log("MainForm formData:", formData);

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
            isFormDisabled={isFormDisabled}
          />
        ) : tabIndex === 1 ? (
          <Stepper2
            formData={stepper2Data} setFormData={setStepper2Data}
            isFormDisabled={isFormDisabled}
          />
        ) : (
          <Stepper3
            formData={stepper3Data} setFormData={setStepper3Data}
            isFormDisabled={isFormDisabled}
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
