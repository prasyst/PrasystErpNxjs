'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";

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
  const [currentPARTY_KEY, setCurrentPARTY_KEY] = useState(null);
  const [abcValue, setAbcValue] = useState("");
  const [rows, setRows] = useState([]);
  const [series, setSeries] = useState([]);
  const [dataState, setDataState] = useState(null);
  // const FCYR_KEY = localStorage.getItem('FCYR_KEY');
  // const COBR_ID = localStorage.getItem('COBR_ID');
  // const UserName = localStorage.getItem('USER_NAME');
  // const CO_ID = localStorage.getItem('CO_ID');
  const searchParams = useSearchParams();
  const FG = searchParams.get('PARTY_KEY');

  const [formData, setFormData] = useState({
    SearchByCd: "",
    ID: "",
    DBFLAG: '',
    PARTY_KEY: "",
    PARTY_ALT_CODE: "",
    PARTY_CAT: "",
    PARTY_NAME: "",
    PARTY_ABRV: "",
    ADDR: "",
    REG_ADD: "",
    WORK_ADD: "",
    CONT_KEY: "COUNTRY",
    CITY_KEY: "CITY",
    TEL_NO: "",
    FAX_NO: "",
    E_MAIL: "",
    WEBSITE: "",
    CONTACT_PERSON: "",
    MOBILE_NO: "",
    SST: "",
    CST: "",
    IE_CODE: "",
    EXCISE_CODE: "",
    PAN_NO: "",
    TAN_NO: "",
    STATUS: "",
    CREATED_BY: 0,
    CREATED_DT: "",
    UPDATED_BY: 0,
    UPDATED_DT: "",
    PLACE: "",
    VAT: "",
    PARTY_IMG: "",
    PYTTYPE_KEY: "",
    DEDTYPE_KEY: "",
    PYTTYPEDTL_ID: 0,
    NET_TDS: 0,
    ROFF: "",
    SMS_MOBILENO: "",
    ACCLED_ID: 0,
    CONTDESG: 0,
    PRINTNAME: "",
    GSTTIN_NO: "",
    PARTY_TYPE: "",
    RD_URD: "",
    PINCODE: "",
    CO_ID: 0,
    WebUserName: "",
    WebPassword: "",
    SEZ: "",
    WSTKLOC_KEY: "",
    PARTY_CLASS_KEY: 0,
    INTERNAL_PROCESS: "",
    MANUAL_WSP: "",
    MSME_FLAG: "",
    MSME_NO: "",
    MSME_TR: 0,
    MSME_CLASS: 0,
    MSME_ACT: 0,
    DEFAULT_BRANCH: "",
    PartyDtlEntities: [{
      DBFLAG: '',
      PARTYDTL_ID: "",
      PARTY_KEY: "",
      ADDR: "",
      CONT_KEY: "COUNTRY",
      CITY_KEY: "CITY",
      TEL_NO: "",
      FAX_NO: "",
      E_MAIL: "",
      WEBSITE: "",
      CONTACT_PERSON: "",
      MOBILE_NO: "",
      SST: "",
      CST: "",
      EXCISE_CODE: "",
      REMK: "",
      STATUS: "",
      PLACE: "",
      VAT: "",
      MAIN_BRANCH: "",
      RD_URD: "",
      PINCODE: "",
      GSTTIN_NO: "",
      TAX_KEY: 0,
      TERM_KEY: "",
      TRSP_KEY: 0,
      TRADE_DISC: 0,
      RDOFF: "",
      CFORM_FLG: 0,
      PARTY_ALT_CODE: "",
      ORD_SYNCSTATUS: "",
      SEZ: "",
      DEFAULT_BRANCH: "",
    }],
    CLIENTTERMSEntities: [{
      CLIENTTERMS_ID: "",
      CLIENTTERMS_ALT_CODE: "",
      PARTY_KEY: "",
      CLIENTGRP_KEY: 0,
      CLIENTCAT_KEY: 0,
      BROKER_KEY: 0,
      BANK_NAME: "",
      BRANCH_NAME: "",
      ACCOUNT_NO: "",
      DLV_PLACE: "",
      TRSP_KEY: 0,
      DISC_KEY: 0,
      CR_LIMIT: "",
      CR_PERIOD: "",
      INT_PERC: "",
      TRADE_DISC: 0,
      INSURANCE: "",
      RATING: "",
      STOP_DESP: "",
      STOP_DESC_DT: "",
      STOP_DESP_REASON: "",
      CFORM_FLG: 0,
      RDOFF: "",
      TAX_KEY: 0,
      TERM_KEY: "",
      DISTBTR_KEY: "",
      SALEPERSON1_KEY: 0,
      SALEPERSON2_KEY: 0,
      SPL_INSTR: "",
      COMM_RATE: "",
      COMM_ONGROSS: "",
      Op_Date: "",
      Cl_Date: "",
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
      FRANCHACCPM2_KEY: "",
      FRANCHACCPM3_KEY: "",
      FRANCHACCPM4_KEY: "",
      FRANCHACCPM5_KEY: "",
      FRANCHACCPM6_KEY: "",
      FRANCHACCPM7_KEY: "",
      FRANCHACCPM8_KEY: "",
      FRANCHACCPM9_KEY: "",
      FRANCHACCPM10_KEY: "",
      FRANCHACCPM11_KEY: "",
      FRANCHACCPM12_KEY: "",
      FRANCHACCPM13_KEY: "",
      FRANCHACCPM14_KEY: "",
      FRANCHACCPM15_KEY: "",
      Amount1: 0.0,
      AMOUNT2: 0.0,
      AMOUNT3: 0.0,
      AMOUNT4: 0.0,
      AMOUNT5: 0.0,
      AMOUNT6: 0.0,
      AMOUNT7: 0.0,
      AMOUNT8: 0.0,
      AMOUNT9: 0.0,
      AMOUNT10: 0.0,
      AMOUNT11: 0.0,
      AMOUNT12: 0.0,
      AMOUNT13: 0.0,
      AMOUNT14: 0.0,
      AMOUNT15: 0.0,
      SaleType_Id: 0,
      UsageRemk: "",
      Area: "",
      Product: "",
      SETTELEMENT_REMK: "",
      SETTELEMENT_DT: '',
      SETTELEMENT_AMT: 0.0,
      IFSC_CODE: "",
      TARGET_PERC: 0,
      TCS_TERM_KEY: 0,
      BROKER1_KEY: 0
    }]

  });

  const handlePrint = () => { };

  const handleExit = () => {
    router.push('/dashboard');
  };

  const fetchPartyData = useCallback(async (currentPARTY_KEY, flag = "R", isManualSearch = false) => {

    const CO_ID = localStorage.getItem('CO_ID');

    try {
      const response = await axiosInstance.post(`Party/RetriveParty`, {
        "FLAG": flag,
        "TBLNAME": "PARTY",
        "FLDNAME": "PARTY_KEY",
        "ID": currentPARTY_KEY,
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": CO_ID,
        "PARTY_CAT": "PC"
      });

      if (response.data.STATUS === 0 && response.data.RESPONSESTATUSCODE === 1) {
        const partyData = response?.data?.DATA?.PARTYList[0];

        setDataState(partyData);

        setFormData({
          DBFLAG: mode === 'retrieve' ? 'R' : mode === 'edit' ? 'U' : '',
          PARTY_KEY: partyData?.PARTY_KEY || "",
          PARTY_ALT_CODE: partyData?.PARTY_ALT_CODE || "",
          PARTY_CAT: partyData?.PARTY_CAT || "",
          PARTY_NAME: partyData?.PARTY_NAME || "",
          PARTY_ABRV: partyData?.PARTY_ABRV || "",
          ADDR: partyData?.ADDR || "",
          REG_ADD: partyData?.REG_ADD || "",
          WORK_ADD: partyData?.WORK_ADD || "",
          CONT_KEY: partyData?.CONT_KEY || 0,
          CITY_KEY: partyData?.CITY_KEY || 0,
          TEL_NO: partyData?.TEL_NO || "",
          FAX_NO: partyData?.FAX_NO || "",
          E_MAIL: partyData?.E_MAIL || "",
          WEBSITE: partyData?.WEBSITE || "",
          CONTACT_PERSON: partyData?.CONTACT_PERSON || "",
          MOBILE_NO: partyData?.MOBILE_NO || "",
          SST: partyData?.SST || "",
          CST: partyData?.CST || "",
          IE_CODE: partyData?.IE_CODE || "",
          EXCISE_CODE: partyData?.EXCISE_CODE || "",
          PAN_NO: partyData?.PAN_NO || "",
          TAN_NO: partyData?.TAN_NO || "",
          STATUS: partyData?.STATUS || "",
          UPDATED_BY: partyData?.UPDATED_BY || 0,
          UPDATED_DT: partyData?.UPDATED_DT || "2025-07-30T10:30:00",
          PLACE: partyData?.PLACE || "",
          VAT: partyData?.VAT || "",
          PARTY_IMG: partyData?.PARTY_IMG || "",
          PYTTYPE_KEY: partyData?.PYTTYPE_KEY || "",
          DEDTYPE_KEY: partyData?.DEDTYPE_KEY || "",
          PYTTYPEDTL_ID: partyData?.PYTTYPEDTL_ID || 0,
          NET_TDS: partyData?.NET_TDS || 0,
          ROFF: partyData?.ROFF || "",
          SMS_MOBILENO: partyData?.SMS_MOBILENO || "",
          ACCLED_ID: partyData?.ACCLED_ID || 0,
          CONTDESG: partyData?.CONTDESG || 0,
          PRINTNAME: partyData?.PRINTNAME || "",
          GSTTIN_NO: partyData?.GSTTIN_NO || "",
          PARTY_TYPE: partyData?.PARTY_TYPE || "",
          RD_URD: partyData?.RD_URD || "",
          PINCODE: partyData?.PINCODE || "",
          CO_ID: partyData?.CO_ID || 0,
          WebUserName: partyData?.WebUserName || "",
          WebPassword: partyData?.WebPassword || "",
          SEZ: partyData?.SEZ || "",
          WSTKLOC_KEY: partyData?.WSTKLOC_KEY || "",
          PARTY_CLASS_KEY: partyData?.PARTY_CLASS_KEY || 0,
          INTERNAL_PROCESS: partyData?.INTERNAL_PROCESS || "",
          MANUAL_WSP: partyData?.MANUAL_WSP || "",
          MSME_FLAG: partyData?.MSME_FLAG || "",
          MSME_NO: partyData?.MSME_NO || "",
          MSME_TR: partyData?.MSME_TR || 0,
          MSME_CLASS: partyData?.MSME_CLASS || 0,
          MSME_ACT: partyData?.MSME_ACT || 0,
          DEFAULT_BRANCH: partyData?.DEFAULT_BRANCH || "",
          PartyDtlEntities: partyData?.PartyDtlEntities?.map(item => ({
            DBFLAG: mode === 'retrieve' ? 'R' : mode === 'edit' ? 'U' : '',
            PARTYDTL_ID: item.PARTYDTL_ID || "",
            PARTY_KEY: item.PARTY_KEY || "",
            ADDR: item.ADDR || "",
            CONT_KEY: item.CONT_KEY || 0,
            CITY_KEY: item.CITY_KEY || 0,
            TEL_NO: item.TEL_NO || "",
            FAX_NO: item.FAX_NO || "",
            E_MAIL: item.E_MAIL || "",
            WEBSITE: item.WEBSITE || "",
            CONTACT_PERSON: item.CONTACT_PERSON || "",
            MOBILE_NO: item.MOBILE_NO || "",
            SST: item.SST || "",
            CST: item.CST || "",
            EXCISE_CODE: item.EXCISE_CODE || "",
            REMK: item.REMK || "",
            STATUS: item.STATUS || "",
            PLACE: item.PLACE || "",
            VAT: item.VAT || "",
            MAIN_BRANCH: item.MAIN_BRANCH || "",
            RD_URD: item.RD_URD || "",
            PINCODE: item.PINCODE || "",
            GSTTIN_NO: item.GSTTIN_NO || "",
            TAX_KEY: item.TAX_KEY || 0,
            TERM_KEY: item.TERM_KEY || "",
            TRSP_KEY: item.TRSP_KEY || 0,
            TRADE_DISC: item.TRADE_DISC || 0,
            RDOFF: item.RDOFF || "",
            CFORM_FLG: item.CFORM_FLG || 0,
            PARTY_ALT_CODE: item.PARTY_ALT_CODE || "",
            ORD_SYNCSTATUS: item.ORD_SYNCSTATUS || "",
            SEZ: item.SEZ || "",
            DEFAULT_BRANCH: item.DEFAULT_BRANCH || "",
          })),
          CLIENTTERMSEntities: partyData?.CLIENTTERMSEntities?.map(item => ({
            CLIENTTERMS_ID: item.CLIENTTERMS_ID || "",
            CLIENTTERMS_ALT_CODE: item.CLIENTTERMS_ALT_CODE || "",
            PARTY_KEY: item.PARTY_KEY || "",
            CLIENTGRP_KEY: item.CLIENTGRP_KEY || 0,
            CLIENTCAT_KEY: item.CLIENTCAT_KEY || 0,
            BROKER_KEY: item.BROKER_KEY || 0,
            BANK_NAME: item.BANK_NAME || "",
            BRANCH_NAME: item.BRANCH_NAME || "",
            ACCOUNT_NO: item.ACCOUNT_NO || "",
            DLV_PLACE: item.DLV_PLACE || "",
            TRSP_KEY: item.TRSP_KEY || 0,
            DISC_KEY: item.DISC_KEY || 0,
            CR_LIMIT: item.CR_LIMIT || 0,
            CR_PERIOD: item.CR_PERIOD || 0,
            INT_PERC: item.INT_PERC || 0,
            TRADE_DISC: item.TRADE_DISC || 0,
            INSURANCE: item.INSURANCE || 0,
            RATING: item.RATING || 0,
            STOP_DESP: item.STOP_DESP || "",
            STOP_DESC_DT: item.STOP_DESC_DT || "1900-01-01T00:00:00",
            STOP_DESP_REASON: item.STOP_DESP_REASON || "",
            CFORM_FLG: item.CFORM_FLG || 0,
            RDOFF: item.RDOFF || "",
            TAX_KEY: item.TAX_KEY || 0,
            TERM_KEY: item.TERM_KEY || "",
            DISTBTR_KEY: item.DISTBTR_KEY || "",
            SALEPERSON1_KEY: item.SALEPERSON1_KEY || 0,
            SALEPERSON2_KEY: item.SALEPERSON2_KEY || 0,
            SPL_INSTR: item.SPL_INSTR || "",
            COMM_RATE: item.COMM_RATE || 0,
            COMM_ONGROSS: item.COMM_ONGROSS || "",
            Op_Date: item.Op_Date || "1900-01-01T00:00:00",
            Cl_Date: item.Cl_Date || "2021-09-17T00:00:00",
            Franch_Status: item.Franch_Status || "0",
            Master_Franch: item.Master_Franch || "",
            ShowRoom_Area: item.ShowRoom_Area || 0,
            Settelment_Period: item.Settelment_Period || "",
            Comm_Sale: item.Comm_Sale || 0.0,
            Franch_Comm_Rate: item.Franch_Comm_Rate || 0.0,
            CommAppl_Amt: item.CommAppl_Amt || 0.0,
            Deposit_Amt: item.Deposit_Amt || 0.0,
            Deposit_Accled_Id: item.Deposit_Accled_Id || 0,
            FranchAccPm1_Key: item.FranchAccPm1_Key || 0,
            Amount1: item.Amount1 || 0.0,
            SaleType_Id: item.SaleType_Id || 0,
            UsageRemk: item.UsageRemk || "",
            Area: item.Area || "",
            Product: item.Product || "",
            SETTELEMENT_REMK: item.SETTELEMENT_REMK || "",
            SETTELEMENT_DT: item?.SETTELEMENT_DT ? item.SETTELEMENT_DT.split('T')[0] : '1900-01-01T00:00:00',
            SETTELEMENT_AMT: item.SETTELEMENT_AMT || 0.0,
            IFSC_CODE: item.IFSC_CODE || "",
            TARGET_PERC: item.TARGET_PERC || 0,
            TCS_TERM_KEY: item.TCS_TERM_KEY || 0,
            BROKER1_KEY: item.BROKER1_KEY || 0
          }))

        });

        setIsFormDisabled(true);
        setCurrentPARTY_KEY(partyData?.PARTY_KEY);
        const newParams = new URLSearchParams();
        newParams.set("PARTY_KEY", partyData?.PARTY_KEY);
        router.replace(`/masters/customers?${newParams.toString()}`);

        console.log("fetch", partyData);

      } else if (response.data.STATUS === 1 && response.data.RESPONSESTATUSCODE === 2) {
        toast.info(response.data.MESSAGE);
      } else {
        if (isManualSearch) {
          toast.error(`${MESSAGE} FOR ${currentPARTY_KEY}`);
          setFormData(
            {
              SearchByCd: "",
              ID: "",
              DBFLAG: '',
              PARTY_KEY: "",
              PARTY_ALT_CODE: "",
              PARTY_CAT: "",
              PARTY_NAME: "",
              PARTY_ABRV: "",
              ADDR: "",
              REG_ADD: "",
              WORK_ADD: "",
              CONT_KEY: "COUNTRY",
              CITY_KEY: "CITY",
              TEL_NO: "",
              FAX_NO: "",
              E_MAIL: "",
              WEBSITE: "",
              CONTACT_PERSON: "",
              MOBILE_NO: "",
              SST: "",
              CST: "",
              IE_CODE: "",
              EXCISE_CODE: "",
              PAN_NO: "",
              TAN_NO: "",
              STATUS: "",
              CREATED_BY: 0,
              CREATED_DT: "",
              UPDATED_BY: 0,
              UPDATED_DT: "",
              PLACE: "",
              VAT: "",
              PARTY_IMG: "",
              PYTTYPE_KEY: "",
              DEDTYPE_KEY: "",
              PYTTYPEDTL_ID: 0,
              NET_TDS: 0,
              ROFF: "",
              SMS_MOBILENO: "",
              ACCLED_ID: 0,
              CONTDESG: 0,
              PRINTNAME: "",
              GSTTIN_NO: "",
              PARTY_TYPE: "",
              RD_URD: "",
              PINCODE: "",
              CO_ID: 0,
              WebUserName: "",
              WebPassword: "",
              SEZ: "",
              WSTKLOC_KEY: "",
              PARTY_CLASS_KEY: 0,
              INTERNAL_PROCESS: "",
              MANUAL_WSP: "",
              MSME_FLAG: "",
              MSME_NO: "",
              MSME_TR: 0,
              MSME_CLASS: 0,
              MSME_ACT: 0,
              DEFAULT_BRANCH: "",
              PartyDtlEntities: [{
                DBFLAG: '',
                PARTYDTL_ID: "",
                PARTY_KEY: "",
                ADDR: "",
                CONT_KEY: "COUNTRY",
                CITY_KEY: "CITY",
                TEL_NO: "",
                FAX_NO: "",
                E_MAIL: "",
                WEBSITE: "",
                CONTACT_PERSON: "",
                MOBILE_NO: "",
                SST: "",
                CST: "",
                EXCISE_CODE: "",
                REMK: "",
                STATUS: "",
                PLACE: "",
                VAT: "",
                MAIN_BRANCH: "",
                RD_URD: "",
                PINCODE: "",
                GSTTIN_NO: "",
                TAX_KEY: 0,
                TERM_KEY: "",
                TRSP_KEY: 0,
                TRADE_DISC: 0,
                RDOFF: "",
                CFORM_FLG: 0,
                PARTY_ALT_CODE: "",
                ORD_SYNCSTATUS: "",
                SEZ: "",
                DEFAULT_BRANCH: "",
              }],
              CLIENTTERMSEntities: [{
                CLIENTTERMS_ID: "",
                CLIENTTERMS_ALT_CODE: "",
                PARTY_KEY: "",
                CLIENTGRP_KEY: 0,
                CLIENTCAT_KEY: 0,
                BROKER_KEY: 0,
                BANK_NAME: "",
                BRANCH_NAME: "",
                ACCOUNT_NO: "",
                DLV_PLACE: "",
                TRSP_KEY: 0,
                DISC_KEY: 0,
                CR_LIMIT: "",
                CR_PERIOD: "",
                INT_PERC: "",
                TRADE_DISC: 0,
                INSURANCE: "",
                RATING: "",
                STOP_DESP: "",
                STOP_DESC_DT: "",
                STOP_DESP_REASON: "",
                CFORM_FLG: 0,
                RDOFF: "",
                TAX_KEY: 0,
                TERM_KEY: "",
                DISTBTR_KEY: "",
                SALEPERSON1_KEY: 0,
                SALEPERSON2_KEY: 0,
                SPL_INSTR: "",
                COMM_RATE: "",
                COMM_ONGROSS: "",
                Op_Date: "",
                Cl_Date: "",
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
                FRANCHACCPM2_KEY: "",
                FRANCHACCPM3_KEY: "",
                FRANCHACCPM4_KEY: "",
                FRANCHACCPM5_KEY: "",
                FRANCHACCPM6_KEY: "",
                FRANCHACCPM7_KEY: "",
                FRANCHACCPM8_KEY: "",
                FRANCHACCPM9_KEY: "",
                FRANCHACCPM10_KEY: "",
                FRANCHACCPM11_KEY: "",
                FRANCHACCPM12_KEY: "",
                FRANCHACCPM13_KEY: "",
                FRANCHACCPM14_KEY: "",
                FRANCHACCPM15_KEY: "",
                Amount1: 0.0,
                AMOUNT2: 0.0,
                AMOUNT3: 0.0,
                AMOUNT4: 0.0,
                AMOUNT5: 0.0,
                AMOUNT6: 0.0,
                AMOUNT7: 0.0,
                AMOUNT8: 0.0,
                AMOUNT9: 0.0,
                AMOUNT10: 0.0,
                AMOUNT11: 0.0,
                AMOUNT12: 0.0,
                AMOUNT13: 0.0,
                AMOUNT14: 0.0,
                AMOUNT15: 0.0,
                SaleType_Id: 0,
                UsageRemk: "",
                Area: "",
                Product: "",
                SETTELEMENT_REMK: "",
                SETTELEMENT_DT: '',
                SETTELEMENT_AMT: 0.0,
                IFSC_CODE: "",
                TARGET_PERC: 0,
                TCS_TERM_KEY: 0,
                BROKER1_KEY: 0
              }]

            }
          );
        }
      }
    } catch (error) {
      console.error('Error fetching party data:', error);
      toast.error('Error fetching party data. Please try again.');
    }
  }, [router]);

  // useEffect(() => {
  //   if ((!Array.isArray(rows) || rows.length === 0) && Array.isArray(dataState?.PartyDtlEntities)) {
  //     setRows(dataState?.PartyDtlEntities);
  //   }
  // }, [dataState, rows]);

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!hasInitializedRef.current && Array.isArray(dataState?.PartyDtlEntities)) {
      setRows(dataState?.PartyDtlEntities);
      hasInitializedRef.current = true;
    }
  }, [dataState]);

  useEffect(() => {
    if (FG) {
      setCurrentPARTY_KEY(FG);
      fetchPartyData(FG);
      setMode('view');
    } else {
      setMode('view');
      setIsFormDisabled(true);
    }
    setMode('view');
  }, [FG, fetchPartyData]);

  const handleAdd = async () => {

    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');

    setMode('add');
    setIsFormDisabled(false);
    setFormData(
      {
        SearchByCd: "",
        ID: "",
        DBFLAG: 'I',
        PARTY_KEY: "",
        PARTY_ALT_CODE: "",
        PARTY_CAT: "",
        PARTY_NAME: "",
        PARTY_ABRV: "",
        ADDR: "",
        REG_ADD: "",
        WORK_ADD: "",
        CONT_KEY: "COUNTRY",
        CITY_KEY: "CITY",
        TEL_NO: "",
        FAX_NO: "",
        E_MAIL: "",
        WEBSITE: "",
        CONTACT_PERSON: "",
        MOBILE_NO: "",
        SST: "",
        CST: "",
        IE_CODE: "",
        EXCISE_CODE: "",
        PAN_NO: "",
        TAN_NO: "",
        STATUS: "",
        CREATED_BY: 0,
        CREATED_DT: "",
        // UPDATED_BY: 0,
        // UPDATED_DT: "",
        PLACE: "",
        VAT: "",
        PARTY_IMG: "",
        PYTTYPE_KEY: "",
        DEDTYPE_KEY: "",
        PYTTYPEDTL_ID: 0,
        NET_TDS: 0,
        ROFF: "",
        SMS_MOBILENO: "",
        ACCLED_ID: 0,
        CONTDESG: 0,
        PRINTNAME: "",
        GSTTIN_NO: "",
        PARTY_TYPE: "",
        RD_URD: "",
        PINCODE: "",
        CO_ID: 0,
        WebUserName: "",
        WebPassword: "",
        SEZ: "",
        WSTKLOC_KEY: "",
        PARTY_CLASS_KEY: 0,
        INTERNAL_PROCESS: "",
        MANUAL_WSP: "",
        MSME_FLAG: "",
        MSME_NO: "",
        MSME_TR: 0,
        MSME_CLASS: 0,
        MSME_ACT: 0,
        DEFAULT_BRANCH: "",
        PartyDtlEntities: [{
          DBFLAG: 'I',
          PARTYDTL_ID: "",
          PARTY_KEY: "",
          ADDR: "",
          CONT_KEY: "COUNTRY",
          CITY_KEY: "CITY",
          TEL_NO: "",
          FAX_NO: "",
          E_MAIL: "",
          WEBSITE: "",
          CONTACT_PERSON: "",
          MOBILE_NO: "",
          SST: "",
          CST: "",
          EXCISE_CODE: "",
          REMK: "",
          STATUS: "",
          PLACE: "",
          VAT: "",
          MAIN_BRANCH: "",
          RD_URD: "",
          PINCODE: "",
          GSTTIN_NO: "",
          TAX_KEY: 0,
          TERM_KEY: "",
          TRSP_KEY: 0,
          TRADE_DISC: 0,
          RDOFF: "",
          CFORM_FLG: 0,
          PARTY_ALT_CODE: "",
          ORD_SYNCSTATUS: "",
          SEZ: "",
          DEFAULT_BRANCH: "",
        }],
        CLIENTTERMSEntities: [{
          CLIENTTERMS_ID: "",
          CLIENTTERMS_ALT_CODE: "",
          PARTY_KEY: "",
          CLIENTGRP_KEY: 0,
          CLIENTCAT_KEY: 0,
          BROKER_KEY: 0,
          BANK_NAME: "",
          BRANCH_NAME: "",
          ACCOUNT_NO: "",
          DLV_PLACE: "",
          TRSP_KEY: 0,
          DISC_KEY: 0,
          CR_LIMIT: "",
          CR_PERIOD: "",
          INT_PERC: "",
          TRADE_DISC: 0,
          INSURANCE: "",
          RATING: "",
          STOP_DESP: "",
          STOP_DESC_DT: "",
          STOP_DESP_REASON: "",
          CFORM_FLG: 0,
          RDOFF: "",
          TAX_KEY: 0,
          TERM_KEY: "",
          DISTBTR_KEY: "",
          SALEPERSON1_KEY: 0,
          SALEPERSON2_KEY: 0,
          SPL_INSTR: "",
          COMM_RATE: "",
          COMM_ONGROSS: "",
          Op_Date: "",
          Cl_Date: "",
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
          FRANCHACCPM2_KEY: "",
          FRANCHACCPM3_KEY: "",
          FRANCHACCPM4_KEY: "",
          FRANCHACCPM5_KEY: "",
          FRANCHACCPM6_KEY: "",
          FRANCHACCPM7_KEY: "",
          FRANCHACCPM8_KEY: "",
          FRANCHACCPM9_KEY: "",
          FRANCHACCPM10_KEY: "",
          FRANCHACCPM11_KEY: "",
          FRANCHACCPM12_KEY: "",
          FRANCHACCPM13_KEY: "",
          FRANCHACCPM14_KEY: "",
          FRANCHACCPM15_KEY: "",
          Amount1: 0.0,
          AMOUNT2: 0.0,
          AMOUNT3: 0.0,
          AMOUNT4: 0.0,
          AMOUNT5: 0.0,
          AMOUNT6: 0.0,
          AMOUNT7: 0.0,
          AMOUNT8: 0.0,
          AMOUNT9: 0.0,
          AMOUNT10: 0.0,
          AMOUNT11: 0.0,
          AMOUNT12: 0.0,
          AMOUNT13: 0.0,
          AMOUNT14: 0.0,
          AMOUNT15: 0.0,
          SaleType_Id: 0,
          UsageRemk: "",
          Area: "",
          Product: "",
          SETTELEMENT_REMK: "",
          SETTELEMENT_DT: '',
          SETTELEMENT_AMT: 0.0,
          IFSC_CODE: "",
          TARGET_PERC: 0,
          TCS_TERM_KEY: 0,
          BROKER1_KEY: 0
        }]

      }
    );
    setRows([]);
    setCurrentPARTY_KEY(null);

    try {
      const responseSecond = await axiosInstance.post(`GetSeriesSettings/GetSeriesLastNewKey`, {

        MODULENAME: "Party",
        TBLNAME: "Party",
        FLDNAME: "Party_KEY",
        NCOLLEN: 6,
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
        setSeries(responseSecond.data.DATA);

        const abcValue = responseSecond.data.DATA[0]?.ID || "";
        setAbcValue(abcValue);

        setFormData((prev) => ({
          ...prev,
          ID: abcValue
        }));

      } else {
        toast.error("Failed to fetch Series");
      }
    } catch (error) {
      console.error("Error fetching Series", error);
      toast.error("Error fetching Series. Please try again.");
    }

  };

  const handleFirst = () => { };

  const handleLast = async () => {
    await fetchPartyData(1, "L");
    setFormData((prev) => ({
      ...prev,
      SearchByCd: ''
    }));
  }

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

  const handleSubmit = async () => {

    const payload = [{
      DBFLAG: mode === 'add' ? 'I' : mode === 'edit' ? 'U' : '',
      PARTY_KEY: abcValue,
      PARTY_ALT_CODE: abcValue,
      PARTY_CAT: formData.PARTY_CAT || "PC",
      PARTY_NAME: formData.PARTY_NAME || "",
      PARTY_ABRV: formData.PARTY_ABRV || "",
      ADDR: formData.ADDR || "",
      REG_ADD: formData.REG_ADD || "",
      WORK_ADD: formData.WORK_ADD || "",
      CONT_KEY: formData.CONT_KEY || "",
      CITY_KEY: formData.CITY_KEY || "",
      TEL_NO: formData.TEL_NO || "",
      FAX_NO: formData.FAX_NO || "",
      E_MAIL: formData.E_MAIL || "",
      WEBSITE: formData.WEBSITE || "",
      CONTACT_PERSON: formData.CONTACT_PERSON || "",
      MOBILE_NO: formData.MOBILE_NO || "",
      SST: formData.SST || "",
      CST: formData.CST || "",
      IE_CODE: formData.IE_CODE || "",
      EXCISE_CODE: formData.EXCISE_CODE || "",
      PAN_NO: formData.PAN_NO || "",
      TAN_NO: formData.TAN_NO || "",
      STATUS: formData.STATUS || "",
      PLACE: formData.PLACE || "PLACE",
      VAT: formData.VAT || "",
      PARTY_IMG: formData.PARTY_IMG || "",
      PYTTYPE_KEY: formData.PYTTYPE_KEY || "",
      DEDTYPE_KEY: formData.DEDTYPE_KEY || "",
      PYTTYPEDTL_ID: formData.PYTTYPEDTL_ID || 0,
      CREATED_BY: 2,
      CREATED_DT: formData.CREATED_DT || "2025-07-30T10:30:00",
      NET_TDS: formData.NET_TDS || 0,
      ROFF: formData.ROFF || "",
      SMS_MOBILENO: formData.SMS_MOBILENO || "",
      ACCLED_ID: formData.ACCLED_ID || 0,
      CONTDESG: formData.CONTDESG || "",
      PRINTNAME: formData.PRINTNAME || "",
      GSTTIN_NO: formData.GSTTIN_NO || "",
      PARTY_TYPE: formData.PARTY_TYPE || "",
      RD_URD: formData.RD_URD || "",
      PINCODE: formData.PINCODE || "",
      CO_ID: formData.CO_ID || 0,
      WebUserName: formData.WebUserName || "",
      WebPassword: formData.WebPassword || "",
      SEZ: formData.SEZ || "",
      WSTKLOC_KEY: formData.WSTKLOC_KEY || "",
      PARTY_CLASS_KEY: formData.PARTY_CLASS_KEY || 0,
      INTERNAL_PROCESS: formData.INTERNAL_PROCESS || "",
      MANUAL_WSP: formData.MANUAL_WSP || "",
      MSME_FLAG: formData.MSME_FLAG || "",
      MSME_NO: formData.MSME_NO || "",
      MSME_TR: formData.MSME_TR || 0,
      MSME_CLASS: formData.MSME_CLASS || 0,
      MSME_ACT: formData.MSME_ACT || 0,
      DEFAULT_BRANCH: formData.DEFAULT_BRANCH || "",
      PartyDtlEntities: Array.isArray(rows) && rows.length
        ? rows
        : Array.isArray(formData?.PartyDtlEntities) ? formData?.PartyDtlEntities?.map((data) => ({
          DBFLAG: mode === 'add' ? 'I' : mode === 'edit' ? 'U' : '',
          PARTYDTL_ID: data.PARTYDTL_ID || 0,
          PARTY_KEY: abcValue,
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
          REMK: data.REMK || "REMK",
          STATUS: data.STATUS || "",
          PLACE: data.PLACE || "PLACE",
          VAT: data.VAT || "",
          MAIN_BRANCH: data.MAIN_BRANCH || "",
          RD_URD: data.RD_URD || "",
          PINCODE: data.PINCODE || "",
          GSTTIN_NO: data.GSTTIN_NO || "",
          TAX_KEY: data.TAX_KEY || 0,
          TERM_KEY: data.TERM_KEY || "",
          TRSP_KEY: data.TRSP_KEY || 0,
          TRADE_DISC: data.TRADE_DISC || 0,
          RDOFF: data.RDOFF || "",
          CFORM_FLG: data.CFORM_FLG || 0,
          PARTY_ALT_CODE: data.PARTY_ALT_CODE || "",
          ORD_SYNCSTATUS: data.ORD_SYNCSTATUS || "",
          SEZ: data.SEZ || "",
          DEFAULT_BRANCH: data.DEFAULT_BRANCH || "",
        })) : [],
      CLIENTTERMSEntities: Array.isArray(formData?.CLIENTTERMSEntities) ? formData?.CLIENTTERMSEntities?.map((item) => ({
        DBFLAG: mode === 'add' ? 'I' : mode === 'edit' ? 'U' : '',
        CLIENTTERMS_ID: item.CLIENTTERMS_ID || 0,
        CLIENTTERMS_ALT_CODE: item.CLIENTTERMS_ALT_CODE || "",
        PARTY_KEY: abcValue,
        CLIENTGRP_KEY: item.CLIENTGRP_KEY || "",
        CLIENTCAT_KEY: item.CLIENTCAT_KEY || "",
        BROKER_KEY: item.BROKER_KEY || "",
        BANK_NAME: item.BANK_NAME || "",
        BRANCH_NAME: item.BRANCH_NAME || "",
        ACCOUNT_NO: item.ACCOUNT_NO || "",
        DLV_PLACE: item.DLV_PLACE || "",
        TRSP_KEY: item.TRSP_KEY || "",
        DISC_KEY: item.DISC_KEY || "",
        CR_LIMIT: item.CR_LIMIT || 0,
        CR_PERIOD: item.CR_PERIOD || 0,
        INT_PERC: item.INT_PERC || 0,
        TRADE_DISC: item.TRADE_DISC || 0,
        INSURANCE: item.INSURANCE || 0,
        RATING: item.RATING || 0,
        STOP_DESP: item.STOP_DESP || "",
        STOP_DESC_DT: item.STOP_DESC_DT || "1900-01-01T10:30:00",
        STOP_DESP_REASON: item.STOP_DESP_REASON || "",
        CFORM_FLG: item.CFORM_FLG || 0,
        RDOFF: item.RDOFF || "",
        TAX_KEY: item.TAX_KEY || "",
        TERM_KEY: item.TERM_KEY || "",
        DISTBTR_KEY: item.DISTBTR_KEY || "",
        SALEPERSON1_KEY: item.SALEPERSON1_KEY || "",
        SALEPERSON2_KEY: item.SALEPERSON2_KEY || "",
        SPL_INSTR: item.SPL_INSTR || "",
        COMM_RATE: item.COMM_RATE || 0,
        COMM_ONGROSS: item.COMM_ONGROSS || "",
        Op_Date: item.Op_Date || "1900-01-01T10:30:00",
        Cl_Date: item.Cl_Date || "2021-09-17T10:30:00",
        Franch_Status: item.Franch_Status || "0",
        Master_Franch: item.Master_Franch || "",
        ShowRoom_Area: item.ShowRoom_Area || 0,
        Settelment_Period: item.Settelment_Period || "",
        Comm_Sale: item.Comm_Sale || 0.0,
        Franch_Comm_Rate: item.Franch_Comm_Rate || 0.0,
        CommAppl_Amt: item.CommAppl_Amt || 0.0,
        Deposit_Amt: item.Deposit_Amt || 0.0,
        Deposit_Accled_Id: item.Deposit_Accled_Id || 0,
        FranchAccPm1_Key: item.FranchAccPm1_Key || "",
        FRANCHACCPM2_KEY: item.FRANCHACCPM2_KEY || 0,
        FRANCHACCPM3_KEY: item.FRANCHACCPM3_KEY || 0,
        FRANCHACCPM4_KEY: item.FRANCHACCPM4_KEY || 0,
        FRANCHACCPM5_KEY: item.FRANCHACCPM5_KEY || 0,
        FRANCHACCPM6_KEY: item.FRANCHACCPM6_KEY || 0,
        FRANCHACCPM7_KEY: item.FRANCHACCPM7_KEY || 0,
        FRANCHACCPM8_KEY: item.FRANCHACCPM8_KEY || 0,
        FRANCHACCPM9_KEY: item.FRANCHACCPM9_KEY || 0,
        FRANCHACCPM10_KEY: item.FRANCHACCPM10_KEY || 0,
        FRANCHACCPM11_KEY: item.FRANCHACCPM11_KEY || 0,
        FRANCHACCPM12_KEY: item.FRANCHACCPM12_KEY || 0,
        FRANCHACCPM13_KEY: item.FRANCHACCPM13_KEY || 0,
        FRANCHACCPM14_KEY: item.FRANCHACCPM14_KEY || 0,
        FRANCHACCPM15_KEY: item.FRANCHACCPM15_KEY || 0,
        Amount1: item.Amount1 || 0.0,
        AMOUNT2: item.AMOUNT2 || 0.0,
        AMOUNT3: item.AMOUNT3 || 0.0,
        AMOUNT4: item.AMOUNT4 || 0.0,
        AMOUNT5: item.AMOUNT5 || 0.0,
        AMOUNT6: item.AMOUNT6 || 0.0,
        AMOUNT7: item.AMOUNT7 || 0.0,
        AMOUNT8: item.AMOUNT8 || 0.0,
        AMOUNT9: item.AMOUNT9 || 0.0,
        AMOUNT10: item.AMOUNT10 || 0.0,
        AMOUNT11: item.AMOUNT11 || 0.0,
        AMOUNT12: item.AMOUNT12 || 0.0,
        AMOUNT13: item.AMOUNT13 || 0.0,
        AMOUNT14: item.AMOUNT14 || 0.0,
        AMOUNT15: item.AMOUNT15 || 0.0,
        SaleType_Id: item.SaleType_Id || 0,
        UsageRemk: item.UsageRemk || "",
        Area: item.Area || "",
        Product: item.Product || "",
        SETTELEMENT_REMK: item.SETTELEMENT_REMK || "",
        SETTELEMENT_DT: item.SETTELEMENT_DT || "1900-01-01T10:30:00",
        SETTELEMENT_AMT: item.SETTELEMENT_AMT || 0.0,
        IFSC_CODE: item.IFSC_CODE || "",
        TARGET_PERC: item.TARGET_PERC || 0,
        TCS_TERM_KEY: item.TCS_TERM_KEY || "",
        BROKER1_KEY: item.BROKER1_KEY || ""
      })) : []

    }];

    const payloadUpdate = [{
      DBFLAG: mode === 'add' ? 'I' : mode === 'edit' ? 'U' : '',
      PARTY_KEY: mode === 'add' ? abcValue : mode === 'edit' ? currentPARTY_KEY : '',
      PARTY_ALT_CODE: abcValue,
      PARTY_CAT: formData.PARTY_CAT || "PC",
      PARTY_NAME: formData.PARTY_NAME || "",
      PARTY_ABRV: formData.PARTY_ABRV || "",
      ADDR: formData.ADDR || "",
      REG_ADD: formData.REG_ADD || "",
      WORK_ADD: formData.WORK_ADD || "",
      CONT_KEY: formData.CONT_KEY || "",
      CITY_KEY: formData.CITY_KEY || "",
      TEL_NO: formData.TEL_NO || "",
      FAX_NO: formData.FAX_NO || "",
      E_MAIL: formData.E_MAIL || "",
      WEBSITE: formData.WEBSITE || "",
      CONTACT_PERSON: formData.CONTACT_PERSON || "",
      MOBILE_NO: formData.MOBILE_NO || "",
      SST: formData.SST || "",
      CST: formData.CST || "",
      IE_CODE: formData.IE_CODE || "",
      EXCISE_CODE: formData.EXCISE_CODE || "",
      PAN_NO: formData.PAN_NO || "",
      TAN_NO: formData.TAN_NO || "",
      STATUS: formData.STATUS || "",
      PLACE: formData.PLACE || "XYZ",
      VAT: formData.VAT || "",
      PARTY_IMG: formData.PARTY_IMG || "",
      PYTTYPE_KEY: formData.PYTTYPE_KEY || "",
      DEDTYPE_KEY: formData.DEDTYPE_KEY || "",
      PYTTYPEDTL_ID: formData.PYTTYPEDTL_ID || 0,
      UPDATED_BY: 2,
      UPDATED_DT: formData.UPDATED_DT || "2025-07-30",
      NET_TDS: formData.NET_TDS || 0,
      ROFF: formData.ROFF || "",
      SMS_MOBILENO: formData.SMS_MOBILENO || "",
      ACCLED_ID: formData.ACCLED_ID || 0,
      CONTDESG: formData.CONTDESG || "",
      PRINTNAME: formData.PRINTNAME || "",
      GSTTIN_NO: formData.GSTTIN_NO || "",
      PARTY_TYPE: formData.PARTY_TYPE || "",
      RD_URD: formData.RD_URD || "",
      PINCODE: formData.PINCODE || "",
      CO_ID: formData.CO_ID || 0,
      WebUserName: formData.WebUserName || "",
      WebPassword: formData.WebPassword || "",
      SEZ: formData.SEZ || "",
      WSTKLOC_KEY: formData.WSTKLOC_KEY || "",
      PARTY_CLASS_KEY: formData.PARTY_CLASS_KEY || 0,
      INTERNAL_PROCESS: formData.INTERNAL_PROCESS || "",
      MANUAL_WSP: formData.MANUAL_WSP || "",
      MSME_FLAG: formData.MSME_FLAG || "",
      MSME_NO: formData.MSME_NO || "",
      MSME_TR: formData.MSME_TR || 0,
      MSME_CLASS: formData.MSME_CLASS || 0,
      MSME_ACT: formData.MSME_ACT || 0,
      DEFAULT_BRANCH: formData.DEFAULT_BRANCH || "",
      PartyDtlEntities: Array.isArray(rows) && rows.length
        ? rows
        : Array.isArray(formData?.PartyDtlEntities) ? formData?.PartyDtlEntities?.map((data) => ({
          DBFLAG: mode === 'add' ? 'I' : mode === 'edit' ? 'U' : '',
          PARTYDTL_ID: data.PARTYDTL_ID || 0,
          PARTY_KEY: mode === 'add' ? abcValue : mode === 'edit' ? currentPARTY_KEY : '',
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
          REMK: data.REMK || "REMK",
          STATUS: data.STATUS || "",
          PLACE: data.PLACE || "PLACE",
          VAT: data.VAT || "",
          MAIN_BRANCH: data.MAIN_BRANCH || "",
          RD_URD: data.RD_URD || "",
          PINCODE: data.PINCODE || "",
          GSTTIN_NO: data.GSTTIN_NO || "",
          TAX_KEY: data.TAX_KEY || 0,
          TERM_KEY: data.TERM_KEY || "",
          TRSP_KEY: data.TRSP_KEY || 0,
          TRADE_DISC: data.TRADE_DISC || 0,
          RDOFF: data.RDOFF || "",
          CFORM_FLG: data.CFORM_FLG || 0,
          PARTY_ALT_CODE: data.PARTY_ALT_CODE || "",
          ORD_SYNCSTATUS: data.ORD_SYNCSTATUS || "",
          SEZ: data.SEZ || "",
          DEFAULT_BRANCH: data.DEFAULT_BRANCH || "",
        })) : [],
      CLIENTTERMSEntities: Array.isArray(formData?.CLIENTTERMSEntities) ? formData?.CLIENTTERMSEntities?.map((item) => ({
        DBFLAG: mode === 'add' ? 'I' : mode === 'edit' ? 'U' : '',
        CLIENTTERMS_ID: item.CLIENTTERMS_ID || 0,
        CLIENTTERMS_ALT_CODE: item.CLIENTTERMS_ALT_CODE || "",
        PARTY_KEY: mode === 'add' ? abcValue : mode === 'edit' ? currentPARTY_KEY : '',
        CLIENTGRP_KEY: item.CLIENTGRP_KEY || "",
        CLIENTCAT_KEY: item.CLIENTCAT_KEY || "",
        BROKER_KEY: item.BROKER_KEY || "",
        BANK_NAME: item.BANK_NAME || "",
        BRANCH_NAME: item.BRANCH_NAME || "",
        ACCOUNT_NO: item.ACCOUNT_NO || "",
        DLV_PLACE: item.DLV_PLACE || "",
        TRSP_KEY: item.TRSP_KEY || "",
        DISC_KEY: item.DISC_KEY || "",
        CR_LIMIT: item.CR_LIMIT || 0,
        CR_PERIOD: item.CR_PERIOD || 0,
        INT_PERC: item.INT_PERC || 0,
        TRADE_DISC: item.TRADE_DISC || 0,
        INSURANCE: item.INSURANCE || 0,
        RATING: item.RATING || 0,
        STOP_DESP: item.STOP_DESP || "",
        STOP_DESC_DT: item.STOP_DESC_DT || "1900-01-01T10:30:00",
        STOP_DESP_REASON: item.STOP_DESP_REASON || "",
        CFORM_FLG: item.CFORM_FLG || 0,
        RDOFF: item.RDOFF || "",
        TAX_KEY: item.TAX_KEY || "",
        TERM_KEY: item.TERM_KEY || "",
        DISTBTR_KEY: item.DISTBTR_KEY || "",
        SALEPERSON1_KEY: item.SALEPERSON1_KEY || "",
        SALEPERSON2_KEY: item.SALEPERSON2_KEY || "",
        SPL_INSTR: item.SPL_INSTR || "",
        COMM_RATE: item.COMM_RATE || 0,
        COMM_ONGROSS: item.COMM_ONGROSS || "",
        Op_Date: item.Op_Date || "1900-01-01T10:30:00",
        Cl_Date: item.Cl_Date || "2021-09-17T10:30:00",
        Franch_Status: item.Franch_Status || "0",
        Master_Franch: item.Master_Franch || "",
        ShowRoom_Area: item.ShowRoom_Area || 0,
        Settelment_Period: item.Settelment_Period || "",
        Comm_Sale: item.Comm_Sale || 0.0,
        Franch_Comm_Rate: item.Franch_Comm_Rate || 0.0,
        CommAppl_Amt: item.CommAppl_Amt || 0.0,
        Deposit_Amt: item.Deposit_Amt || 0.0,
        Deposit_Accled_Id: item.Deposit_Accled_Id || 0,
        FranchAccPm1_Key: item.FranchAccPm1_Key || "",
        FRANCHACCPM2_KEY: item.FRANCHACCPM2_KEY || 0,
        FRANCHACCPM3_KEY: item.FRANCHACCPM3_KEY || 0,
        FRANCHACCPM4_KEY: item.FRANCHACCPM4_KEY || 0,
        FRANCHACCPM5_KEY: item.FRANCHACCPM5_KEY || 0,
        FRANCHACCPM6_KEY: item.FRANCHACCPM6_KEY || 0,
        FRANCHACCPM7_KEY: item.FRANCHACCPM7_KEY || 0,
        FRANCHACCPM8_KEY: item.FRANCHACCPM8_KEY || 0,
        FRANCHACCPM9_KEY: item.FRANCHACCPM9_KEY || 0,
        FRANCHACCPM10_KEY: item.FRANCHACCPM10_KEY || 0,
        FRANCHACCPM11_KEY: item.FRANCHACCPM11_KEY || 0,
        FRANCHACCPM12_KEY: item.FRANCHACCPM12_KEY || 0,
        FRANCHACCPM13_KEY: item.FRANCHACCPM13_KEY || 0,
        FRANCHACCPM14_KEY: item.FRANCHACCPM14_KEY || 0,
        FRANCHACCPM15_KEY: item.FRANCHACCPM15_KEY || 0,
        Amount1: item.Amount1 || 0.0,
        AMOUNT2: item.AMOUNT2 || 0.0,
        AMOUNT3: item.AMOUNT3 || 0.0,
        AMOUNT4: item.AMOUNT4 || 0.0,
        AMOUNT5: item.AMOUNT5 || 0.0,
        AMOUNT6: item.AMOUNT6 || 0.0,
        AMOUNT7: item.AMOUNT7 || 0.0,
        AMOUNT8: item.AMOUNT8 || 0.0,
        AMOUNT9: item.AMOUNT9 || 0.0,
        AMOUNT10: item.AMOUNT10 || 0.0,
        AMOUNT11: item.AMOUNT11 || 0.0,
        AMOUNT12: item.AMOUNT12 || 0.0,
        AMOUNT13: item.AMOUNT13 || 0.0,
        AMOUNT14: item.AMOUNT14 || 0.0,
        AMOUNT15: item.AMOUNT15 || 0.0,
        SaleType_Id: item.SaleType_Id || 0,
        UsageRemk: item.UsageRemk || "",
        Area: item.Area || "",
        Product: item.Product || "",
        SETTELEMENT_REMK: item.SETTELEMENT_REMK || "",
        SETTELEMENT_DT: item.SETTELEMENT_DT || "1900-01-01T10:30:00",
        SETTELEMENT_AMT: item.SETTELEMENT_AMT || 0.0,
        IFSC_CODE: item.IFSC_CODE || "",
        TARGET_PERC: item.TARGET_PERC || 0,
        TCS_TERM_KEY: item.TCS_TERM_KEY || "",
        BROKER1_KEY: item.BROKER1_KEY || ""
      })) : []
    }];

    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('USER_NAME');
    const PARTY_KEY = localStorage.getItem('PARTY_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');

    const UserName = userRole === 'user' ? username : PARTY_KEY;

    let response;
    if (mode === 'edit') {

      response = await axiosInstance.patch(`Party/ManagePartyBranch?UserName=${(UserName)}&strCobrid=${COBR_ID}`, payloadUpdate);

      console.log("payload", payloadUpdate);
    } else {

      response = await axiosInstance.post(`Party/ManagePartyBranch?UserName=${UserName}&strCobrid=${COBR_ID}`, payload);

      console.log("payloadCreate", payload);
    }

    if (response.data.STATUS === 0 && response.data.RESPONSESTATUSCODE === 1) {
      toast.success(response.data.MESSAGE);
      setIsFormDisabled(true);

    } else {
      toast.error(response.data.MESSAGE || 'Operation failed');
    }

  };

  const handleCancel = async () => {
    if (mode === 'add') {
      await fetchPartyData(1, "L");
      setFormData((prev) => ({
        ...prev,
        SearchByCd: ''
      }));
    }
    else {
      await fetchPartyData(currentPARTY_KEY, "R");
    }
    setMode('view');
  };

  const handleEdit = () => {
    setMode('edit');
    setIsFormDisabled(false);
  };

  // const handleDelete = async () => {
  //   setopenDialog(true);
  // };

  const handleDelete = async () => {
    try {

      const response = await axiosInstance.post('Party/DeleteParty', {
        PARTY_KEY: currentPARTY_KEY
      });

      const { data: { STATUS, MESSAGE } } = response;
      if (STATUS === 0) {
        toast.success(MESSAGE, { autoClose: 500 });
        await fetchPartyData(currentPARTY_KEY, 'P');
      } else {
        toast.error(MESSAGE);
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
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

  useEffect(() => {

    const defaultValues = {
      PARTYDTL_ID: 0,
      CFORM_FLG: 0,
      MAIN_BRANCH: "",
      ORD_SYNCSTATUS: "",
      RDOFF: "",
      REMK: "",
      TAX_KEY: 0,
      TERM_KEY: "",
      TRSP_KEY: 0,
      TRADE_DISC: 0,
    };

    const baseFields = Object.keys(formData?.PartyDtlEntities?.[0] || {});

    const updatedFields = baseFields.filter((key) =>
      formData[key] !== formData.PartyDtlEntities?.[0][key]
    );

    if (updatedFields?.length > 0) {
      const updatedABC = updatedFields?.reduce((acc, key) => {
        acc[key] = formData[key] ?? defaultValues[key];
        return acc;
      }, {});

      setFormData((prev) => {

        const updatedParty = prev?.PartyDtlEntities?.map((item, index) => {
          if (index === 0) {
            return {
              ...item,
              ...updatedABC,

            };
          }
          return item;
        });

        console.log("Updated xyz array (setRows):", updatedParty);
        setRows(updatedParty);

        return {
          ...prev,
          PartyDtlEntities: updatedParty,
        };
      });
    }
  }, [
    formData?.DBFLAG,
    formData?.PARTY_KEY,
    formData?.PARTY_ALT_CODE,
    formData?.PARTY_CAT,
    formData?.PARTY_NAME,
    formData?.PARTY_ABRV,
    formData?.ADDR,
    formData?.REG_ADD,
    formData?.WORK_ADD,
    formData?.CONT_KEY,
    formData?.CITY_KEY,
    formData?.TEL_NO,
    formData?.FAX_NO,
    formData?.E_MAIL,
    formData?.WEBSITE,
    formData?.CONTACT_PERSON,
    formData?.MOBILE_NO,
    formData?.SST,
    formData?.CST,
    formData?.IE_CODE,
    formData?.EXCISE_CODE,
    formData?.PAN_NO,
    formData?.TAN_NO,
    formData?.STATUS,
    formData?.CREATED_BY,
    formData?.CREATED_DT,
    // formData?.UPDATED_BY,
    // formData?.UPDATED_DT,
    formData?.PLACE,
    formData?.VAT,
    formData?.PARTY_IMG,
    formData?.PYTTYPE_KEY,
    formData?.DEDTYPE_KEY,
    formData?.PYTTYPEDTL_ID,
    formData?.NET_TDS,
    formData?.ROFF,
    formData?.SMS_MOBILENO,
    formData?.ACCLED_ID,
    formData?.CONTDESG,
    formData?.PRINTNAME,
    formData?.GSTTIN_NO,
    formData?.PARTY_TYPE,
    formData?.RD_URD,
    formData?.PINCODE,
    formData?.CO_ID,
    formData?.WebUserName,
    formData?.WebPassword,
    formData?.SEZ,
    formData?.WSTKLOC_KEY,
    formData?.PARTY_CLASS_KEY,
    formData?.INTERNAL_PROCESS,
    formData?.MANUAL_WSP,
    formData?.MSME_FLAG,
    formData?.MSME_NO,
    formData?.MSME_TR,
    formData?.MSME_CLASS,
    formData?.MSME_ACT,
    formData?.DEFAULT_BRANCH,
  ]);

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
            formData={formData} setFormData={setFormData}
            isFormDisabled={isFormDisabled}
          />
        ) : tabIndex === 1 ? (
          <Stepper2
            formData={formData} setFormData={setFormData}
            rows={rows}
            setRows={setRows}
            currentPARTY_KEY={currentPARTY_KEY}
            isFormDisabled={isFormDisabled}
          />
        ) : (
          <Stepper3
            formData={formData} setFormData={setFormData}
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
                currentKey={currentPARTY_KEY}
                onFirst={handleFirst}
                onPrevious={handlePrevClick}
                onNext={handleNextClick}
                onLast={handleLast}
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