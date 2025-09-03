'use client';
import React, { useCallback, useEffect, useState } from "react";
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
import { toast, ToastContainer } from "react-toastify";
import CrudButtons from "@/GlobalFunction/CrudButtons";
import PaginationButtons from "@/GlobalFunction/PaginationButtons";
import { getFormMode } from "@/lib/helpers";
import ConfirmDelDialog from "@/GlobalFunction/ConfirmDelDialog";
import StepperMst1 from "./Stepper1";
import StepperMst2 from "./Stepper2";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import axiosInstance from "@/lib/axios";

const FORM_MODE = getFormMode();
const initialStepper1Form = {
  CO_ID: "",
  CO_NAME: "",
  CO_ABRV: "",
  GSTTIN_NO: "",
  JURISDICTION: "",
  PRINT_NAME: "",
  OTH_ADD: "",
  REGD_ADD: "",
  CINNo: "",
  IE_CODE: "",
  RTEL_NO: "",
  RE_MAIL: "",
  WEBSITE: "",
  OWN_MOBNO: "",
  WORK_ADD: "",
  PLACE: "",
  PINCODE: "",
  PAN_NO: "",
  TAN_NO: "",
  TDS_CIRCLE: "",
  TDS_PERSON: "",
  TDS_P_DESIG: "",
  CST: "",
  EXCISE_CODE: "",
  EXCISE_DIV: "",
  RVAT: "",
  EXCISE_RANG: "",
  EXCISE_COMM: "",
  MSME_NO: "",
  CO_DIV_KEY: false,
};

const CompanyMst = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [form, setForm] = useState(initialStepper1Form);
  const router = useRouter();
  const searchParams = useSearchParams();
  const CO_ID = searchParams.get('CO_ID');
  const [openDialog, setopenDialog] = useState(false);
  const [currentCO_ID, setCurrentCO_ID] = useState(null);
  const [mode, setMode] = useState(() => (currentCO_ID ? FORM_MODE.read : FORM_MODE.add));
  const [tableData, setTableData] = useState([]);
  const [isButtonSubmit, setIsButtonSubmit] = useState(false);
  const [stepper1Form, setStepper1Form] = useState({});
  const [stepper2Branches, setStepper2Branches] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userRole = localStorage.getItem('userRole');
  const UserName = localStorage.getItem('USER_NAME');
  const PARTY_KEY = localStorage.getItem('PARTY_KEY');
  const COBR_ID = localStorage.getItem('COBR_ID');
  const CO_IDD = localStorage.getItem('CO_ID');

useEffect(() => {
  updateFirstBranchWithStepper1Data();
}, [stepper1Form, updateFirstBranchWithStepper1Data]);


// const updateFirstBranchWithStepper1Data = () => {
//   const defaultBranch = {
//     COBR_ID: stepper1Form.CO_ID || "",
//     CO_ID: stepper1Form.CO_ID || "",
//     COBR_NAME: stepper1Form.CO_NAME || "",
//     COBR_ABRV: stepper1Form.CO_ABRV || "",
//     COBR_ADD: stepper1Form.REGD_ADD || "",
//     TEL_NO: stepper1Form.RTEL_NO || "",
//     E_MAIL: stepper1Form.RE_MAIL || "",
//     PLACE: stepper1Form.PLACE || "",
//     BRANCH_OWN_MOBNO: stepper1Form.OWN_MOBNO || "",
//     GSTTIN_NO: stepper1Form.GSTTIN_NO || "",
//     EXCISE_CODE: stepper1Form.EXCISE_CODE || "",
//     EXCISE_RANG: stepper1Form.EXCISE_RANG || "",
//     EXCISE_DIV: stepper1Form.EXCISE_DIV || "",
//     bank_acc: stepper1Form.BANK_ACC || "",
//     PRINT_NAME: stepper1Form.PRINT_NAME || "",
//     WORK_ADD: stepper1Form.WORK_ADD || "",
//     PINCODE: stepper1Form.PINCODE || "",
//     Active: stepper1Form.Active || false,
//     STATUS: "1",
//     FAX_NO: "",
//     LST: "",
//     VAT: "",
//     COBRLOC_KEY: "",
//     OTH_ADD: "",
//     ORD_SYNCSTATUS: "",
//     CO_DIV_KEY: "",
//   };

//   const isEmpty = Object.values(defaultBranch).every(val => val === "" || val === false || val === "1");

//   let updatedBranches = [...stepper2Branches];

//   if (updatedBranches.length === 0) {
//     if (!isEmpty) {
//       updatedBranches = [defaultBranch];
//     }
//   } else {
//     updatedBranches[0] = { ...updatedBranches[0], ...defaultBranch };
//     const isFirstEmpty = Object.values(updatedBranches[0]).every(val => val === "" || val === false || val === "1");
//     if (isFirstEmpty) {
//       updatedBranches = updatedBranches.slice(1);
//     }
//   }

//   setStepper2Branches(updatedBranches);
// };
const updateFirstBranchWithStepper1Data = useCallback(() => {
  const defaultBranch = {
    COBR_ID: stepper1Form.CO_ID || "",
    CO_ID: stepper1Form.CO_ID || "",
    COBR_NAME: stepper1Form.CO_NAME || "",
    COBR_ABRV: stepper1Form.CO_ABRV || "",
    COBR_ADD: stepper1Form.REGD_ADD || "",
    TEL_NO: stepper1Form.RTEL_NO || "",
    E_MAIL: stepper1Form.RE_MAIL || "",
    PLACE: stepper1Form.PLACE || "",
    BRANCH_OWN_MOBNO: stepper1Form.OWN_MOBNO || "",
    GSTTIN_NO: stepper1Form.GSTTIN_NO || "",
    EXCISE_CODE: stepper1Form.EXCISE_CODE || "",
    EXCISE_RANG: stepper1Form.EXCISE_RANG || "",
    EXCISE_DIV: stepper1Form.EXCISE_DIV || "",
    bank_acc: stepper1Form.BANK_ACC || "",
    PRINT_NAME: stepper1Form.PRINT_NAME || "",
    WORK_ADD: stepper1Form.WORK_ADD || "",
    PINCODE: stepper1Form.PINCODE || "",
    Active: stepper1Form.Active || false,
    STATUS: "1",
    FAX_NO: "",
    LST: "",
    VAT: "",
    COBRLOC_KEY: "",
    OTH_ADD: "",
    ORD_SYNCSTATUS: "",
    CO_DIV_KEY: "",
  };

  const isEmpty = Object.values(defaultBranch).every(val => val === "" || val === false || val === "1");

  let updatedBranches = [...stepper2Branches];

  if (updatedBranches.length === 0) {
    if (!isEmpty) {
      updatedBranches = [defaultBranch];
    }
  } else {
    updatedBranches[0] = { ...updatedBranches[0], ...defaultBranch };
    const isFirstEmpty = Object.values(updatedBranches[0]).every(val => val === "" || val === false || val === "1");
    if (isFirstEmpty) {
      updatedBranches = updatedBranches.slice(1);
    }
  }

  setStepper2Branches(updatedBranches);
}, [stepper1Form, stepper2Branches]);

  const handlePrint = () => { };
  const handleExit = () => { router.push("/masters/company/company/companytable") };

  const handleAdd = () => {
    setMode(FORM_MODE.add);
    setStepper1Form(initialStepper1Form);
    setStepper2Branches([]);
  };

  const handleEdit = () => {
    setMode(FORM_MODE.edit);
  };

  const handleDelete = async () => {
    setopenDialog(true);
  };

  const handleDelCancel = async () => {
    setopenDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.post(
        `Company/DeleteCOMPANY?UserName=${UserName}&strCobrid=${COBR_ID}`,
        { CO_ID: currentCO_ID },
      );
      const { data } = response;
      if (data?.RESPONSESTATUSCODE === 1) {
        toast.success(data.MESSAGE || "Deleted successfully");
        setopenDialog(false);
        await fetchRetriveData(1, "L");
      } else {
        toast.error(data.MESSAGE || "Deletion failed");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Error deleting company");
    } finally {
      setopenDialog(false);
    }
  };

  const fetchRetriveData = useCallback(async (currentCO_ID, flag = "R") => {
    try {
      const response = await axiosInstance.post('Company/RetriveCOMPANY', {
        "FLAG": flag,
        "TBLNAME": "Company",
        "FLDNAME": "CO_ID",
        "ID": currentCO_ID,
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": CO_IDD
      });

      const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;

      if (STATUS === 0 && Array.isArray(DATA.COList) && RESPONSESTATUSCODE === 1) {
        const companyData = DATA.COList[0];

        setStepper1Form({
          CO_ID: companyData.CO_ID || '',
          CO_NAME: companyData.CO_NAME || '',
          CO_ABRV: companyData.CO_ABRV || '',
          GSTTIN_NO: companyData.GSTTIN_NO || '',
          JURISDICTION: companyData.JURISDICTION || '',
          PRINT_NAME: companyData.PRINT_NAME || '',
          OTH_ADD: companyData.OTH_ADD || '',
          REGD_ADD: companyData.REGD_ADD || '',
          CINNo: companyData.CINNo || '',
          IE_CODE: companyData.IE_CODE || '',
          RTEL_NO: companyData.RTEL_NO || '',
          RE_MAIL: companyData.RE_MAIL || '',
          WEBSITE: companyData.WEBSITE || '',
          OWN_MOBNO: companyData.Own_MobNo || '',
          WORK_ADD: companyData.WORK_ADD || '',
          PLACE: companyData.PLACE || '',
          PINCODE: companyData.PINCODE || '',
          PAN_NO: companyData.PAN_NO || '',
          TAN_NO: companyData.TAN_NO || '',
          TDS_CIRCLE: companyData.TDS_CIRCLE || '',
          TDS_PERSON: companyData.TDS_PERSON || '',
          TDS_P_DESIG: companyData.TDS_P_DESIG || '',
          CST: companyData.CST || '',
          EXCISE_CODE: companyData.EXCISE_CODE || '',
          EXCISE_DIV: companyData.EXCISE_DIV || '',
          RVAT: companyData.RVAT || '',
          EXCISE_RANG: companyData.EXCISE_RANG || '',
          EXCISE_COMM: companyData.EXCISE_COMM || '',
          MSME_NO: companyData.MSME_NO || '',
          CO_DIV_KEY: companyData.CO_DIV_KEY || false,
        });

        if (Array.isArray(companyData.COBRENTITIES)) {
          const branches = companyData.COBRENTITIES.map(branch => ({
            COBR_ID: branch.COBR_ID || "",
            CO_ID: branch.CO_ID || "",
            COBR_NAME: branch.COBR_NAME || "",
            COBR_ABRV: branch.COBR_ABRV || "",
            COBR_ADD: branch.COBR_ADD || "",
            TEL_NO: branch.TEL_NO || "",
            FAX_NO: branch.FAX_NO || "",
            E_MAIL: branch.E_MAIL || "",
            OTH_ADD: branch.OTH_ADD || "",
            VAT: branch.VAT || "",
            EXCISE_CODE: branch.EXCISE_CODE || "",
            EXCISE_RANG: branch.EXCISE_RANG || "",
            EXCISE_DIV: branch.EXCISE_DIV || "",
            BRANCH_OWN_MOBNO: branch.BRANCH_OWN_MOBNO || "",
            bank_acc: branch.bank_acc || "",
            GSTTIN_NO: branch.GSTTIN_NO || "",
            PLACE: branch.PLACE || "",
            PINCODE: branch.PINCODE || "",
            PRINT_NAME: branch.PRINT_NAME || "",
            CO_DIV_KEY: branch.CO_DIV_KEY || "",
            STATUS: branch.STATUS || "1",
          }));
          setStepper2Branches(branches);
        } else {
          setStepper2Branches([]);
        }

        setCurrentCO_ID(companyData.CO_ID);
      } else {
        console.error(MESSAGE);
      }
    } catch (err) {
      console.error(err);
    }
  }, [CO_IDD]);

  useEffect(() => {
    if (CO_ID) {
      setCurrentCO_ID(CO_ID);
      fetchRetriveData(CO_ID);
      setMode(FORM_MODE.read);
    } else {
      setMode(FORM_MODE.add);
    }
    setMode(FORM_MODE.read);
  }, [CO_ID, fetchRetriveData]);

//   useEffect(() => {
//   if (CO_ID) {
//     setCurrentCO_ID(CO_ID);
//     fetchRetriveData(CO_ID);
//     setMode(FORM_MODE.read);
//   } else {
  
//     setMode(FORM_MODE.read);  
//   }
// }, [CO_ID, fetchRetriveData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const apiUrl = `Company/ManageCompanyBranch?UserName=${UserName}&strCobrid=${COBR_ID}`;

    const payload = [{
      DBFLAG: mode === FORM_MODE.add ? "I" : "U",
      CO_ID: stepper1Form.CO_ID || "",
      CO_NAME: stepper1Form.CO_NAME || "",
      CO_ABRV: stepper1Form.CO_ABRV || "",
      COBRLOC_KEY: stepper1Form.COBRLOC_KEY || "",
      CONDFORLOGO: "1",
      REG_ADD: stepper1Form.REGD_ADD || "",
      RTEL_NO: stepper1Form.RTEL_NO || "",
      RFAX_NO: stepper1Form.RFAX_NO || "",
      RE_MAIL: stepper1Form.RE_MAIL || "",
      RLST: stepper1Form.RLST || "",
      RVAT: stepper1Form.RVAT || "",
      WORK_ADD: stepper1Form.WORK_ADD || "",
      WTEL_NO: stepper1Form.WTEL_NO || "",
      WFAX_NO: stepper1Form.WFAX_NO || "",
      WE_MAIL: stepper1Form.RE_MAIL || "",
      WLST: stepper1Form.WLST || "",
      WVAT: stepper1Form.WVAT || "",
      OTH_ADD: stepper1Form.OTH_ADD || "",
      WEBSITE: stepper1Form.WEBSITE || "",
      CST: stepper1Form.CST || "",
      IE_CODE: stepper1Form.IE_CODE || "",
      EXCISE_CODE: stepper1Form.EXCISE_CODE || "",
      EXCISE_RANG: stepper1Form.EXCISE_RANG || "",
      EXCISE_DIV: stepper1Form.EXCISE_DIV || "",
      PAN_NO: stepper1Form.PAN_NO || "",
      TAN_NO: stepper1Form.TAN_NO || "",
      STATUS: "1",
      CREATED_BY: mode === FORM_MODE.add ? 1 : undefined,
      CREATED_DT: mode === FORM_MODE.add ? new Date().toISOString() : undefined,
      UPDATED_BY: mode === FORM_MODE.edit ? 1 : undefined,
      UPDATED_DT: mode === FORM_MODE.edit ? new Date().toISOString() : undefined,
      TDS_CIRCLE: stepper1Form.TDS_CIRCLE || "",
      TDS_PERSON: stepper1Form.TDS_PERSON || "",
      TDS_P_DESIG: stepper1Form.TDS_P_DESIG || "",
      CLIENT_KEY: stepper1Form.CLIENT_KEY || "CLNT001",
      CINNO: stepper1Form.CINNo || "",
      OWN_MOBNO: stepper1Form.OWN_MOBNO || "",
      BANK_ACC: stepper1Form.BANK_ACC || "",
      GSTTIN_NO: stepper1Form.GSTTIN_NO || "",
      PLACE: stepper1Form.PLACE || "",
      PINCODE: stepper1Form.PINCODE || "",
      PRINT_NAME: stepper1Form.PRINT_NAME || "",
      CO_DIV_KEY: stepper1Form.CO_DIV_KEY || "",
      COBRENTITIES: stepper2Branches.map((branch, index) => ({
        DBFLAG: branch.DBFLAG || (mode === FORM_MODE.add ? "I" : "U"),
        COBR_ID: branch.COBR_ID || "",
        CO_ID: stepper1Form.CO_ID || "",
        COBR_NAME: branch.COBR_NAME || "",
        COBR_ABRV: branch.COBR_ABRV || "",
        COBRLOC_KEY: branch.COBRLOC_KEY || "",
        COBR_ADD: branch.COBR_ADD || "",
        TEL_NO: branch.TEL_NO || "",
        FAX_NO: branch.FAX_NO || "",
        E_MAIL: branch.E_MAIL || "",
        OTH_ADD: branch.OTH_ADD || "",
        LST: branch.LST || "",
        VAT: branch.VAT || "",
        EXCISE_CODE: branch.EXCISE_CODE || "",
        EXCISE_RANG: branch.EXCISE_RANG || "",
        EXCISE_DIV: branch.EXCISE_DIV || "",
        MAIN_BRANCH: index === 0 ? "1" : "0",
        STATUS: "1",
        BRANCH_OWN_MOBNO: branch.BRANCH_OWN_MOBNO || 0,
        BANK_ACC: branch.BANK_ACC || "",
        GSTTIN_NO: branch.GSTTIN_NO || "",
        PLACE: branch.PLACE || "",
        PINCODE: branch.PINCODE || "",
        PRINT_NAME: branch.PRINT_NAME || "",
        CO_DIV_KEY: branch.CO_DIV_KEY || "",
        ORD_SYNCSTATUS: branch.ORD_SYNCSTATUS || ""
      }))
    }];

    try {
      const response = await axiosInstance.post(apiUrl, payload);
      const { data } = response;
      if (mode === FORM_MODE.add) {
        if (data?.RESPONSESTATUSCODE === 1) {
          toast.success(data?.MESSAGE);
          setMode(FORM_MODE.read);
        } else {
          toast.error(data?.MESSAGE);
        }
      } else if (mode === FORM_MODE.edit) {
        if (data?.STATUS === 0) {
          toast.success("Update successfully");
          setMode(FORM_MODE.read);
        } else {
          toast.error(data?.MESSAGE || "Update failed");
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error.response?.data || error.message);
      toast.error("Submission failed: " + (error.response?.data?.MESSAGE || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFirst = async () => { 
      await fetchRetriveData(0, "F");
  };
  const handleLast = async () => {
    await fetchRetriveData(1, "L");
  };
  const handlePrevious = async () => {
    await fetchRetriveData(currentCO_ID, "P");
  };
  const handleNext = async () => {
    if (currentCO_ID) {
      await fetchRetriveData(currentCO_ID, "N");
    }
  };
  const handleCancel = async () => {
    if (mode === FORM_MODE.add) {
      await fetchRetriveData(1, "L");
    } else {
      await fetchRetriveData(currentCO_ID, "R");
    }
    setMode(FORM_MODE.read);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const Buttonsx = {
    backgroundColor: '#39ace2',
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 27 },
  };

  const handleBranchAddAttempt = () => {
    if (tabIndex !== 0) {
      setTabIndex(0);
    }
    toast.error("Branch cannot be blank");
  };

  const handleAddBranchInReadMode = () => {
    setMode(FORM_MODE.edit);
  };

  const handleEditBranchInReadMode = () => {
    setMode(FORM_MODE.edit);
  };

  const handleDeleteBranchInReadMode = () => {
    setMode(FORM_MODE.edit);
  };

  return (
    <Grid>
      <ToastContainer />
      <Box sx={{ marginTop: "10px", display: 'flex', justifyContent: 'center', width: '100%' }}>
        <ConfirmDelDialog
          open={openDialog}
          title="Confirm Deletion"
          description="Are you sure you want to delete this record?"
          onConfirm={handleConfirmDelete}
          onCancel={handleDelCancel}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mx: '0%' }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                marginTop: "2px",
                mb: 0,
                flexWrap: 'wrap',
                marginInline: '15%'
              }}
            >
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
              <Typography variant="h5" sx={{ fontWeight: 500, ml: 2 }}>
                {tabIndex === 0 ? "Company Master" : "Branch Details"}
              </Typography>
            </Grid>

            <Box sx={{ mt: 1, width: '100%', maxWidth: { xs: '100%', md: '1600px' }, mx: 'auto' }}>
              {tabIndex === 0 ? (
                <StepperMst1 form={stepper1Form} setForm={setStepper1Form} mode={mode} />
              ) : (
                <StepperMst2
                  TableData={stepper2Branches}
                  setTableData={setStepper2Branches}
                  IsButtonSubmit={isButtonSubmit}
                  mode={mode}
                  defaultFormValues={{
                    TEL_NO: stepper1Form.RTEL_NO,
                    E_MAIL: stepper1Form.RE_MAIL,
                    COBR_ADD: stepper1Form.WORK_ADD,
                    PLACE: stepper1Form.PLACE,
                    BRANCH_OWN_MOBNO: stepper1Form.OWN_MOBNO,
                    GSTTIN_NO: stepper1Form.GSTTIN_NO,
                    EXCISE_CODE: stepper1Form.EXCISE_CODE,
                    EXCISE_RANG: stepper1Form.EXCISE_RANG,
                    EXCISE_DIV: stepper1Form.EXCISE_DIV,
                    BANK_ACC: stepper1Form.BANK_ACC,
                    PRINT_NAME: stepper1Form.PRINT_NAME,
                    COBR_ID: stepper1Form.CO_ID,
                    COBR_NAME: stepper1Form.CO_NAME,
                  }}
                  onAddBranchAttempt={handleBranchAddAttempt}
                  onAddInReadMode={handleAddBranchInReadMode}
                  onEditInReadMode={handleEditBranchInReadMode}
                  onDeleteInReadMode={handleDeleteBranchInReadMode}
                />
              )}
            </Box>
          </Grid>
          {tabIndex === 0 && (
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={0}
              sx={{
                marginTop: "-15px",
                marginInline: '15%',
                width: '100%',
                paddingTop: 0,
              }}
            >
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',      // Prevent wrapping
                  overflowX: 'auto',
                  justifyContent: {
                    xs: 'center',
                    sm: 'flex-start',
                    md:'flex-start'
                  },
                  width: { xs: '100%', sm: 'auto', md: 'auto' },
                }}
              >
                <Stack direction="row" spacing={1}>
                  <PaginationButtons
                    mode={mode}
                    FORM_MODE={FORM_MODE}
                    currentKey={currentCO_ID}
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
                <Stack direction="row" spacing={{ xs: 0.5, sm: 0 ,md:0}}  >
                  <CrudButtons
                    mode={mode}
                    onAdd={mode === FORM_MODE.read ? handleAdd : handleSubmit}
                    onEdit={mode === FORM_MODE.read ? handleEdit : handleCancel}
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