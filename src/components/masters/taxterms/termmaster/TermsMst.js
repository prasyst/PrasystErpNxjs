import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    FormLabel,
    RadioGroup,
    Radio,
} from '@mui/material';

import { toast, ToastContainer } from 'react-toastify';
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import PaginationButtons from '@/GlobalFunction/PaginationButtons';
import CrudButtons from '@/GlobalFunction/CrudButtons';
import CustomAutocomplete from '@/GlobalFunction/CustomAutoComplete/CustomAutoComplete';
import PrintTermsDt from './PrintTermsDt';

const FORM_MODE = getFormMode();
const TermsMst = () => {
   const router = useRouter();
        const searchParams = useSearchParams();
        const TERM_KEY = searchParams.get('TERM_KEY');
    const [currentTERM_KEY, setCurrentTERM_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        TERM_KEY: '',
        TERM_NAME: '',
        TERM_ABRV: '',
        TERM_ALT_CODE: '',
        SERIES: '',
        TERM_LST_CODE: '',
        TERMGRP_KEY: '',
        TERM_VAL_YN: '1',
        TERM_PERCENT: '' || 0.00,
        TERM_VAL_FIX: '' || "N",
        TERM_RATE: '' || 0.00,
        TERM_PERQTY: '' || 0,
        TERM_OPR: "",
        REMK: '',
        ACCLED_ID: '',
        CHG_TAXABLE: '',
        ROFF: '',
        GST_APP: '',
        TERMS_TYPE: '',
        Status: 1,
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const TERM_KEYRef = useRef(null);
    const TERM_NAMERef = useRef(null);
    const TERM_ABRVRef = useRef(null);
    const TERM_ALT_CODERef = useRef(null);

    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentTERM_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const CO_ID = localStorage.getItem('CO_ID');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('USER_NAME');
    const PARTY_KEY = localStorage.getItem('PARTY_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');

    useEffect(() => {
  if (!form.GST_APP) {
    setForm((prev) => ({ ...prev, GST_APP: 'N' ,TERM_OPR: '-'}));
  }
}, [form]);

    const resetForm = () => {
        setForm({
            SearchByCd: '',
            TERM_KEY: '',
            TERM_NAME: '',
            TERM_ABRV: '',
            TERM_ALT_CODE: '',
            SERIES: '',
            TERM_LST_CODE: '',
            TERMGRP_KEY: '',
            TERM_VAL_YN: '1',
            TERM_PERCENT: '' || 0.00,
            TERM_VAL_FIX: '' || "N",
            TERM_RATE: '' || 0.00,
            TERM_PERQTY: '' || 0,
            TERM_OPR: "",
            REMK: '',
            ACCLED_ID: '',
            CHG_TAXABLE: '',
            ROFF: '',
            GST_APP: '',
            TERMS_TYPE: '',
            Status: 1,
        });
    }

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };
    const handleFixAmountChange = (e) => {
        const isChecked = e.target.checked;
        setForm((prevForm) => ({
            ...prevForm,
            TERM_VAL_FIX: isChecked ? "1" : "0",
            TERM_VAL_YN: isChecked ? "0" : "1",
            TERM_PERCENT: isChecked ? 0 : prevForm.TERM_PERCENT,
            TERM_RATE: isChecked ? 0 : prevForm.TERM_RATE,
            TERM_PERQTY: isChecked ? 0 : prevForm.TERM_PERQTY
        }));
    };
    const handleCalculationFlagChange = (e) => {
        const isChecked = e.target.checked;
        setForm(prevForm => ({
            ...prevForm,
            TERM_VAL_YN: isChecked ? "1" : "0",
            TERM_VAL_FIX: isChecked ? "0" : "1", // Ensure exactly one is checked
            // Reset values when switching
            TERM_PERCENT: isChecked ? prevForm.TERM_PERCENT : 0,
            TERM_RATE: isChecked ? 0 : prevForm.TERM_RATE,
            TERM_PERQTY: isChecked ? 0 : prevForm.TERM_PERQTY
        }));
    };

    const fetchRetriveData =useCallback( async (currentTERM_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('Terms/RetriveTerms', {
                "FLAG": flag,
                "TBLNAME": "Terms",
                "FLDNAME": "Term_KEY",
                "ID": currentTERM_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const categoryData = DATA[0];
                setForm({
                    TERM_KEY: categoryData.TERM_KEY,
                    TERM_NAME: categoryData.TERM_NAME,
                    TERM_ABRV: categoryData.TERM_ABRV || '',
                    TERM_ALT_CODE: categoryData.TERM_ALT_CODE || '',
                    SERIES: categoryData.SERIES || '',
                    TERM_LST_CODE: categoryData.TERM_LST_CODE || '',
                    TERMGRP_KEY: categoryData.TERMGRP_KEY || '',
                    TERM_VAL_YN: categoryData.TERM_VAL_YN || '',
                    TERM_PERCENT: categoryData.TERM_PERCENT || 0.00,
                    TERM_VAL_FIX: categoryData.TERM_VAL_FIX || "0",
                    TERM_RATE: categoryData.TERM_RATE || 0.00,
                    TERM_PERQTY: categoryData.TERM_PERQTY || 0,
                    TERM_OPR: categoryData.TERM_OPR,
                    REMK: categoryData.REMK || '',
                    ACCLED_ID: categoryData.ACCLED_ID || '',
                    CHG_TAXABLE: categoryData.CHG_TAXABLE || '',
                    ROFF: categoryData.ROFF || '',
                    GST_APP: categoryData.GST_APP || '',
                    TERMS_TYPE: categoryData.TERM_TYPE || '',
                    STATUS: categoryData.STATUS,
                });
                console.log("catedata", categoryData)
                console.log("Form state after setForm:", {
                    ROFF: categoryData.ROFF,
                    formROFF: form.ROFF // Note: This will show the previous state due to setState being async
                });
                setStatus(DATA[0].STATUS);
                setCurrentTERM_KEY(categoryData.TERM_KEY);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentTERM_KEY}`);
                    setForm({
                        TERM_KEY: '',
                        TERM_NAME: '',
                        TERM_ABRV: '',
                        TERM_ALT_CODE: '',
                        SERIES: '',
                        TERM_LST_CODE: '',
                        TERMGRP_KEY: '',
                        TERM_VAL_YN: '1',
                        TERM_PERCENT: '' || 0.00,
                        TERM_VAL_FIX: '' || "0",
                        TERM_RATE: '' || 0.00,
                        TERM_PERQTY: '' || 0,
                        TERM_OPR: "",
                        REMK: '',
                        ACCLED_ID: '',
                        CHG_TAXABLE: '',
                        ROFF: '',
                        GST_APP: '',
                        TERMS_TYPE: '',
                        Status: 1,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    },[CO_ID,form.ROFF]);
    
     useEffect(() => {
                if (TERM_KEY) {
                    setCurrentTERM_KEY(TERM_KEY);
                    fetchRetriveData(TERM_KEY);
                    setMode(FORM_MODE.read);
                } else {
                    resetForm();
                    setMode(FORM_MODE.read);
                }
                setMode(FORM_MODE.read);
            }, [TERM_KEY, fetchRetriveData]);
    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            let url;
            if (mode === FORM_MODE.edit && currentTERM_KEY) {
                url = `Terms/UpdateTerms?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `Terms/InsertTerms?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                "Term_KEY": form.TERM_KEY,
                "Term_ALT_CODE": form.TERM_ALT_CODE,
                "Term_NAME": form.TERM_NAME,
                "Term_ABRV": form.TERM_ABRV,
                "TermGrp_KEY": form.TERMGRP_KEY || '',  // Group  
                "Term_Val_YN": form.TERM_VAL_YN,
                "Term_Percent": form.TERM_PERCENT || 0.00,
                "Term_Val_Fix": form.TERM_VAL_FIX || "0",
                "Term_Rate": form.TERM_RATE || 0.00,
                "Term_PerQty": form.TERM_PERQTY || 0,
                "Term_Opr": form.TERM_OPR,
                "REMK": form.REMK || "",
                "ACCLED_ID": form.ACCLED_ID || 1,  //ledger
                "CHG_TAXABLE": form.CHG_TAXABLE || "N",
                "ROFF": form.ROFF,
                "GST_APP": form.GST_APP || "N",
                "TERMS_TYPE": form.TERMS_TYPE || 1,
                "STATUS": form.Status ? "1" : "0",
            };
            let response;
            if (mode == FORM_MODE.edit && currentTERM_KEY) {
                payload.UPDATED_BY = 1;
                payload.UPDATED_DT = new Date().toISOString();
                response = await axiosInstance.post(url, payload);

                const { STATUS, MESSAGE } = response.data;
                if (STATUS === 0) {
                    setMode(FORM_MODE.read);
                    toast.success(MESSAGE, { autoClose: 1000 });
                } else {
                    toast.error(MESSAGE, { autoClose: 1000 });
                }
            } else {
                payload.CREATED_BY = 1;
                payload.CREATED_DT = new Date().toISOString();
                response = await axiosInstance.post(url, payload);
                const { STATUS, MESSAGE } = response.data;
                if (STATUS === 0) {
                    setForm({
                        TERM_KEY: '',
                        TERM_NAME: '',
                        TERM_ABRV: '',
                        TERM_ALT_CODE: '',
                        SERIES: '',
                        TERM_LST_CODE: '',
                        TERMGRP_KEY: '',
                        TERM_VAL_YN: '1',
                        TERM_PERCENT: '' || 0.00,
                        TERM_VAL_FIX: '',
                        TERM_RATE: '' || 0.00,
                        TERM_PERQTY: '' || 0,
                        TERM_OPR: "",
                        REMK: '',
                        ACCLED_ID: '',
                        CHG_TAXABLE: '',
                        ROFF: '',
                        GST_APP: '',
                        TERMS_TYPE: '',
                        Status: 1,
                    });
                    setMode(FORM_MODE.read);
                    toast.success(MESSAGE, { autoClose: 1000 });
                } else {
                    toast.error(MESSAGE, { autoClose: 1000 });
                }
            }
        } catch (error) {
            console.error("Submit Error:", error);
        }
    };
    const handleCancel = async () => {
        if (mode === FORM_MODE.add) {
            await fetchRetriveData(1, "L");
        } else {
            await fetchRetriveData(currentTERM_KEY, "R");
        }
        setMode(FORM_MODE.read);
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const debouncedApiCall = debounce(async (newSeries) => {
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "Terms",
                "TBLNAME": "Terms",
                "FLDNAME": "Term_KEY",
                "NCOLLEN": 5,
                "CPREFIX": newSeries,
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 0,
                "FLAG": ""
            });
            const { STATUS, DATA, MESSAGE } = response.data;
            if (STATUS === 0 && DATA.length > 0) {
                const id = DATA[0].ID;
                const lastId = DATA[0].LASTID;
                setForm((prevForm) => ({
                    ...prevForm,
                    TERM_KEY: id,
                    TERM_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    TERM_KEY: '',
                    TERM_LST_CODE: ''
                }));
            }
        } catch (error) {
            console.error("Error fetching series data:", error);
        }
    }, 300);
    const handleManualSeriesChange = (newSeries) => {
        setForm((prevForm) => ({
            ...prevForm,
            SERIES: newSeries,
        }));
        if (newSeries.trim() === '') {
            setForm((prevForm) => ({
                ...prevForm,
                TERM_KEY: '',
                TERM_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    }
    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentTERM_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            SearchByCd: '',
            TERM_KEY: '',
            TERM_NAME: '',
            TERM_ABRV: '',
            TERM_ALT_CODE: '',
            SERIES: '',
            TERM_LST_CODE: '',
            TERMGRP_KEY: '',
            TERM_VAL_YN: '1',
            TERM_PERCENT: '' || 0.00,
            TERM_VAL_FIX: '' || "0",
            TERM_RATE: '' || 0.00,
            TERM_PERQTY: '' || 0,
            TERM_OPR: "",
            REMK: '',
            ACCLED_ID: '',
            CHG_TAXABLE: '',
            ROFF: '',
            GST_APP: '',
            TERMS_TYPE: '',
            Status: 1,
        }));

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "Terms",
                "TBLNAME": "Terms",
                "FLDNAME": "Term_KEY",
                "NCOLLEN": 0,
                "CPREFIX": "",
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 16,
                "FLAG": "Series"
            });

            const { STATUS, DATA } = response.data;
            if (STATUS === 0 && DATA.length > 0) {
                cprefix = DATA[0].CPREFIX;
                setForm((prevForm) => ({
                    ...prevForm,
                    SERIES: cprefix
                }));
            }
        } catch (error) {
            console.error("Error fetching CPREFIX:", error);
            return;
        }
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "Terms",
                "TBLNAME": "Terms",
                "FLDNAME": "Term_KEY",
                "NCOLLEN": 5,
                "CPREFIX": cprefix,
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 0,
                "FLAG": ""
            });
            const { STATUS, DATA } = response.data;
            if (STATUS === 0 && DATA.length > 0) {
                const id = DATA[0].ID;
                const lastId = DATA[0].LASTID;
                setForm((prevForm) => ({
                    ...prevForm,
                    TERM_KEY: id,
                    TERM_LST_CODE: lastId
                }));
            }
        } catch (error) {
            console.error("Error fetching ID and LASTID:", error);
        }
    };
    const handleFirst =()=>{}
    const handleLast=async()=>{
         await fetchRetriveData(1, "L");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));   
    }
    const handlePrevious = async () => {
        await fetchRetriveData(currentTERM_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleNext = async () => {
        if (currentTERM_KEY) {
            await fetchRetriveData(currentTERM_KEY, "N");
        }
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleDelete = () => {
        setOpenConfirmDialog(true);
    }
    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };
    const handleConfirmDelete = async () => {
        setOpenConfirmDialog(false);
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            const response = await axiosInstance.post(`Terms/DeleteTerms?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                Term_KEY: form.TERM_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentTERM_KEY, 'P');
            } else {
                toast.error(MESSAGE);
            }
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };
    const handleEdit = () => {
        setMode(FORM_MODE.edit);
    };
       const handlePrint = async () => {
        try {
            const response = await axiosInstance.post(`Terms/GetTermsDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response; // Extract DATA
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));
    
                // Generate the PDF blob
                const asPdf = pdf(<PrintTermsDt rows={formattedData} />);
                const blob = await asPdf.toBlob();
                const url = URL.createObjectURL(blob);
    
                // Open the PDF in a new tab
                const newTab = window.open(url, '_blank');
                if (newTab) {
                    newTab.focus();
                } 
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 100);
            }
        } catch (error) {
            console.error("Print Error:", error);
        }
    };
    const handleExit = () => { router.push("/masters/taxterms/termmaster/termstable") };
 const Buttonsx = {
        backgroundColor: '#39ace2',
        margin: { xs: '0 4px', sm: '0 6px' },
        minWidth: { xs: 40, sm: 46, md: 60 },
        height: { xs: 40, sm: 46, md: 27 },
    };
    return (
        <>
            <Box sx={{ width: '100%', justifyContent: 'center', alignItems: 'flex-start', padding: '24px', boxSizing: 'border-box', marginTop: { xs: "30px", sm: "0px", md: "40px" } ,
             overflowY: { xs: 'auto', sm: 'visible' }, // Enable scrolling on mobile
                    maxHeight: { xs: '80vh', sm: 'none' },  }}
                className="form-container">
                <ToastContainer />
                <Box sx={{ maxWidth: '1000px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }} className="form_grid" >
                    <Grid container alignItems="center"
                sx={{ marginTop: { xs: '30px', sm: '10px', md: '10px' }, marginInline: '20px',  overflowY: { xs: 'auto', sm: 'visible' },  }}>
                                           <Grid sx={{ flexGrow: 1 }}>
                            <Typography align="center" variant="h5">
                                Terms Master
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* Form Fields */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 1.5, sm: 1.5, md: 1 },
                            marginInline: { xs: '5%', sm: '5%', md: '15%' },
                            marginTop: { xs: '15px', sm: '20px', md: '10px' },
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <TextField
                                placeholder="Search By Code"
                                variant="filled"
                                sx={{
                                    width: { xs: '100%', sm: '50%', md: '30%' },
                                    backgroundColor: '#e0f7fa',
                                    '& .MuiInputBase-input': {
                                        paddingBlock: { xs: '8px', md: '4px' },
                                        paddingLeft: { xs: '10px', md: '8px' },
                                    },
                                    '& .MuiInputBase-root': {
                                        paddingTop: '2px',
                                    },
                                    '& .MuiInputLabel-root': {
                                        top: '-4px',
                                    },
                                }}
                                value={form.SearchByCd}
                                onChange={(e) => setForm({ ...form, SearchByCd: e.target.value })}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        fetchRetriveData(e.target.value, 'R', true);
                                    }
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1, md: 1 },
                            }}
                        >
                            <TextField
                                label="Series"
                                inputRef={SERIESRef}
                                sx={{
                                    width: { xs: '100%', sm: '48%', md: '32%' }
                                }}
                                disabled={mode === FORM_MODE.read}
                                fullWidth
                                className="custom-textfield"
                                value={form.SERIES}
                                onChange={(e) => handleManualSeriesChange(e.target.value)}
                            />
                            <TextField
                                label="Last Cd"
                                sx={{
                                    width: { xs: '100%', sm: '48%', md: '32%' }
                                }}
                                disabled={true}
                                fullWidth
                                className="custom-textfield"
                                value={form.TERM_LST_CODE}
                                onChange={(e) => setForm({ ...form, TERM_LST_CODE: e.target.value })}
                            />
                            <TextField
                                label="Code"
                                inputRef={TERM_KEYRef}
                                sx={{
                                    width: { xs: '100%', sm: '48%', md: '32%' }
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.TERM_KEY}
                                onChange={(e) => setForm({ ...form, TERM_KEY: e.target.value })}
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
                                inputRef={TERM_NAMERef}
                                label="Name"
                                sx={{
                                    width: '100%'
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.TERM_NAME}
                                onChange={(e) => setForm({ ...form, TERM_NAME: e.target.value })}
                            />
                            <CustomAutocomplete
                                label="Terms Group"
                                // options={termsGroupOptions}
                                 value={form.TERMS_GROUP}
                                 onChange={(value) => setForm({ ...form, TERMS_GROUP: value })}
                                disabled={true}
                                sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}
                            />
                        </Box>
                        {/* Terms Group and Terms Type in a single row */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1.5, md: 2 },
                            }}
                        >


                            <CustomAutocomplete
                                id="terms-key-autocomplete"
                                // inputRef={SEGMENT_KEYRef}
                                disabled={true}
                                label="Terms Type"
                                // name="TERMS_TYPE_KEY"
                                // options={termsTypeOptions}
                                 value={form.TERMS_TYPE}
                                 onChange={(value) => setForm({ ...form, TERMS_TYPE: value })}
                                sx={{ width: { xs: '100%', sm: '48%', md: '50%' } }}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 1,
                                    width: { xs: '100%', sm: '48%', md: '100%' },
                                }}
                            >
                                <CustomAutocomplete
                                    label="Gen. Ledger"
                                    // options={generalLedgerOptions}
                                     value={form.GEN_LEDGER}
                                     onChange={(value) => setForm({ ...form, GEN_LEDGER: value })}
                                    disabled={true}
                                    sx={{ width: { xs: '100%', sm: '100%', md: '30%' } }}
                                />
                                <TextField
                                    label="Abbr"
                                    inputRef={TERM_ABRVRef}
                                    sx={{
                                        width: { xs: '100%', sm: '40%', md: '30%' }
                                    }}
                                    disabled={mode === FORM_MODE.read}
                                    className="custom-textfield"
                                    value={form.TERM_ABRV}
                                    onChange={(e) => setForm({ ...form, TERM_ABRV: e.target.value })}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                gap: { xs: 1, sm: 1.5, md: 4 },
                                alignItems: {
                                    xs: 'stretch', sm:

                                        'center', md: 'center'
                                },
                            }}
                        >

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={mode === FORM_MODE.read}
                                        checked={form.TERM_VAL_YN === "1"}
                                        onChange={handleCalculationFlagChange}
                                        size="small"
                                        sx={{
                                            '&.Mui-checked': {
                                                color:mode === FORM_MODE.read ? 'rgba(0, 0, 0, 0.38)' : '#39ace2',
                                            },
                                            p: '4px',
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '20px',
                                            },
                                        }}
                                    />
                                }
                                label="Calculation Flag"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '15px',
                                    },
                                    m: 0,
                                }}
                            />

                            <Box sx={{ display: 'flex', gap: { xs: 2, sm: 1, md: 1 } }}>
                                <FormLabel sx={{ mt: '4px', fontSize: '15px' }} component="legend" disabled={mode === FORM_MODE.read}>
                                    GST Applicable
                                </FormLabel>

                                <RadioGroup
                                    row
                                    name="Gst Applicable"
                                    value={form.GST_APP}
                                    onChange={(e) =>
                                        setForm((prevForm) => ({
                                            ...prevForm,
                                            GST_APP: e.target.value,
                                        }))
                                    }
                                    sx={{
                                        border: '1px solid #ccc',
                                        borderRadius: 1,
                                        padding: '2px 8px',
                                        alignItems: 'center',
                                    }}
                                >
                                    {['Y', 'N'].map((val) => (
                                        <FormControlLabel
                                            key={val}
                                            value={val}
                                            label={val === 'Y' ? 'Yes' : 'No'}
                                               disabled={mode === FORM_MODE.read} 
                                            control={
                                                <Radio
                                                    size="small"
                                                    sx={{
                                                        p: '2px',
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: '16px', //Shrink the radio circle icon
                                                        },
                                                    }}
                                                />
                                            }
                                            sx={{
                                                m: 0,
                                                px: 1,
                                                '& .MuiFormControlLabel-label': {
                                                    fontSize: '15px', // smaller label
                                                },
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                            </Box>
                        </Box>

                        {/* B;OCKS */}

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0,
                            }}
                        >
                            {/* Block 1: Percentage or Fix Amount */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'row', sm: 'row' },
                                    gap: { xs: 1, sm: 1, md: 1 },
                                    alignItems: 'center',
                                }}
                            >
                                <TextField
                                    label="Percentage"

                                    sx={{
                                        width: { xs: '32%', sm: '40%', md: '30%' }
                                    }}
                                    disabled={mode === FORM_MODE.read || form.TERM_VAL_FIX === "1"}
                                    className="custom-textfield"
                                    value={form.TERM_PERCENT}
                                    onChange={(e) => setForm({ ...form, TERM_PERCENT: e.target.value })}
                                />

                                <Box
                                    sx={{
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    OR
                                </Box>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={mode === FORM_MODE.read}
                                            checked={form.TERM_VAL_FIX === "1"}
                                            onChange={handleFixAmountChange}
                                            size="small"
                                            sx={{
                                                '&.Mui-checked': {
                                                     color: mode === FORM_MODE.read ? 'rgba(0, 0, 0, 0.38)' :'#39ace2',
                                                },
                                                p: '4px',
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: '20px',
                                                },
                                            }}
                                        />
                                    }
                                    label="Fix Amount"
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '16px',
                                        },
                                        m: 0,
                                    }}
                                />

                            </Box>

                            {/* Middle OR Line */}
                            <Box
                                sx={{
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    color: 'text.secondary',
                                    marginLeft: { xs: '30px', sm: '40px', md: '80px' }
                                }}
                            >
                                OR
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 1.5, md: 1 },
                                    alignItems: 'center',
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'row', sm: 'row' },
                                    gap: { xs: 1, sm: 1.5, md: 1 },
                                    alignItems: 'center',
                                }}
                                >
                                    <TextField
                                        label="Amount"

                                        sx={{
                                            width: { xs: '35%', sm: '40%', md: '55%' }
                                        }}
                                        disabled={mode === FORM_MODE.read || form.TERM_VAL_FIX === "1"}
                                        className="custom-textfield"
                                        value={form.TERM_RATE}
                                        onChange={(e) => setForm({ ...form, TERM_RATE: e.target.value })}
                                    />
                                    <TextField
                                        label="Per Qty"

                                        sx={{
                                            width: { xs: '50%', sm: '40%', md: '40%' }
                                        }}
                                        disabled={mode === FORM_MODE.read || form.TERM_VAL_FIX === "1"}
                                        className="custom-textfield"
                                        value={form.TERM_PERQTY}
                                        onChange={(e) => setForm({ ...form, TERM_PERQTY: e.target.value })}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'row', sm: 'row' },
                                        gap: { xs: 1, sm: 1.5, md: 1 },
                                        alignItems: 'center',
                                        flexWrap: 'nowrap',
                                    }}
                                >
                                    <FormLabel
                                        sx={{
                                            mt: '9px',
                                            whiteSpace: 'nowrap',
                                            fontSize: '14px',
                                        }}
                                        component="legend"
                                    >
                                        Effect
                                    </FormLabel>

                                    <RadioGroup
                                        row
                                        name="Effect"
                                        value={form.TERM_OPR}
                                        onChange={(e) =>
                                            setForm((prevForm) => ({
                                                ...prevForm,
                                                TERM_OPR: e.target.value,
                                            }))
                                        }
                                        sx={{
                                            border: '1px solid #ccc',
                                            borderRadius: 1,
                                            px: 1,
                                            py: 0.5,
                                            alignItems: 'center',
                                            lineHeight: 1,
                                            flexWrap: 'nowrap',
                                        }}
                                    >
                                        {[
                                            { value: '+', label: 'Add' },
                                            { value: '-', label: 'Subtract' },
                                        ].map(({ value, label }) => (
                                            <FormControlLabel
                                                key={value}
                                                value={value}
                                                   disabled={mode === FORM_MODE.read}
                                                label={label}
                                                control={
                                                    <Radio
                                                        size="small"
                                                        sx={{
                                                            p: '2px',
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: '16px',
                                                            },
                                                        }}
                                                    />
                                                }
                                                sx={{
                                                    m: 0,
                                                    px: 1,
                                                    '& .MuiFormControlLabel-label': {
                                                        fontSize: '16px',
                                                    },
                                                }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </Box>

                            </Box>
                        </Box>

                        {/* BlOCKS */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1.5, md: 1 },
                            }}
                        >
                            <TextField
                                label="Remark"
                                sx={{
                                    width: { xs: '100%', sm: '40%', md: '90%' }

                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.REMK}
                                onChange={(e) => setForm({ ...form, REMK: e.target.value })}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'row', sm: 'row', md: 'row' },
                                gap: { xs: 1, sm: 1.5, md: 1 },
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={mode === FORM_MODE.read}
                                        checked={Status === '1'}
                                        onChange={handleChangeStatus}
                                        size="small"
                                        sx={{
                                            '&.Mui-checked': {
                                                color: mode === FORM_MODE.read ? 'rgba(0, 0, 0, 0.38)' :'#39ace2',
                                            },
                                            p: '4px',
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '20px',
                                            },
                                        }}
                                    />
                                }
                                label="Active"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '16px',
                                    },
                                    m: 0,
                                }}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={mode === FORM_MODE.read}
                                        checked={form.ROFF === "1"}
                                        onChange={(e) => {
                                            setForm((prevForm) => ({
                                                ...prevForm,
                                                ROFF: e.target.checked ? "1" : "0",
                                            }));
                                        }}
                                        size="small"
                                        sx={{
                                            '&.Mui-checked': {
                                                color: mode === FORM_MODE.read ? 'rgba(0, 0, 0, 0.38)' :'#39ace2',
                                            },
                                            p: '4px',
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '20px',
                                            },
                                        }}
                                    />
                                }
                                label="Round Off"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '16px',
                                    },
                                    m: 0,
                                }}
                            />
                        </Box>
                    </Box>
                <Grid container alignItems="center"
                        justifyContent="center" spacing={1} sx={{ marginTop: { xs: '40px', sm: '20px', md: '10px' }, marginInline: '20px',  overflowY: { xs: 'auto', sm: 'visible' },  }}>
                        <Grid sx={{
                            display: 'flex', justifyContent: {
                                xs: 'center',
                                sm: 'flex-start'
                            },
                            width: { xs: '100%', sm: 'auto' },
                        }}>
                            <Stack direction="row" spacing={1}>
                                  <PaginationButtons
                                    mode={mode}
                                    FORM_MODE={FORM_MODE}
                                    currentKey={currentTERM_KEY}
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
                </Box>
            </Box>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                maxWidth="xs"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                        Are you sure you want to delete this record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: { xs: 0.5, sm: 1 } }}>
                    <Button
                        sx={{
                            backgroundColor: "#39ace2",
                            color: "white",
                            "&:hover": { backgroundColor: "#2199d6", color: "white" },
                            minWidth: { xs: 80, sm: 100 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                        onClick={handleConfirmDelete}
                    >
                        Yes
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: "#39ace2",
                            color: "white",
                            "&:hover": { backgroundColor: "#2199d6", color: "white" },
                            minWidth: { xs: 80, sm: 100 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                        onClick={handleCloseConfirmDialog}
                    >
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default TermsMst;
