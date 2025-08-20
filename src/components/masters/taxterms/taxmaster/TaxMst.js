import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    MenuItem,
    Autocomplete,
} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import CrudButtons from '@/GlobalFunction/CrudButtons';
import PrintTaxDt from './PrintTaxDt';
import PaginationButtons from '@/GlobalFunction/PaginationButtons';
import CustomAutocomplete from '@/GlobalFunction/CustomAutoComplete/CustomAutoComplete';

const FORM_MODE = getFormMode();
const TaxMst = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const TAX_KEY = searchParams.get('TAX_KEY');
    const [currentTAX_KEY, setCurrentTAX_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        TAX_KEY: '',
        TAX_NAME: '',
        TAX_LST_CODE: '',
        TAX_TYPE: '',
        TAXGRP_KEY: '',
        LEDGER: '',
        TAX_RATE: '',
        TAX_FORM: '',
        AOT1_D: '',
        AOT1_R: '',
        AOT2_D: '',
        AOT2_R: '',
        REMK: '',
        ACCLED_ID: '',
        CHG_TAXABLE: '0',
        ROFF: '0',
        NOSETOFF: '0',
        AOT1_ACCLED_ID: '',
        AOT2_ACCLED_ID: '',
        ACCLED_ID_17_5: '',
        ACCLED_ID_NO_CLAIM: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const TAX_KEYRef = useRef(null);
    const TAX_NAMERef = useRef(null);
    const TAX_ABRVRef = useRef(null);
    const TAX_RATERef = useRef(null);
    const REMKRef = useRef(null);

    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentTAX_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const CO_ID = localStorage.getItem('CO_ID');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('USER_NAME');
    const PARTY_KEY = localStorage.getItem('PARTY_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');
    const isReadOnly = mode === FORM_MODE.read;

    const ledgerOptions = [
        { id: '0', name: 'test' },
        { id: '2', name: 'test2' },
    ];


    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };
    const fetchRetriveData = useCallback(async (currentTAX_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('Tax/RetriveTax', {
                "FLAG": flag,
                "TBLNAME": "Tax",
                "FLDNAME": "Tax_KEY",
                "ID": currentTAX_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const taxData = DATA[0];
                setForm({
                    ...form,
                    TAX_KEY: taxData.TAX_KEY,
                    TAX_NAME: taxData.TAX_NAME,
                    TAX_ABRV: taxData.TAX_ABRV || '',

                    SERIES: taxData.SERIES || '',
                    TAX_LST_CODE: taxData.TAX_LST_CODE || '',
                    Status: taxData.STATUS,

                    TAXGRP_KEY: taxData.TAXGRP_KEY || '',

                    TAX_RATE: taxData.TAX_RATE || '',
                    TAX_FORM: taxData.TAX_FORM || '',
                    AOT1_D: taxData.AOT1_D || '',
                    AOT1_R: taxData.AOT1_R || '',
                    AOT2_D: taxData.AOT2_D || '',
                    AOT2_R: taxData.AOT2_R || '',
                    REMK: taxData.REMK || '',
                    ACCLED_ID: taxData.ACCLED_ID || '',
                    CHG_TAXABLE: taxData.CHG_TAXABLE || '0',
                    ROFF: taxData.ROFF || '0',
                    NOSETOFF: taxData.NOSETOFF || '0',
                    AOT1_ACCLED_ID: taxData.AOT1_ACCLED_ID || '',
                    AOT2_ACCLED_ID: taxData.AOT2_ACCLED_ID || '',
                    ACCLED_ID_17_5: taxData.ACCLED_ID_17_5 || '',
                    ACCLED_ID_NO_CLAIM: taxData.ACCLED_ID_NO_CLAIM || ''
                });
                setStatus(taxData.STATUS);
                setCurrentTAX_KEY(taxData.TAX_KEY);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentTAX_KEY}`);
                    resetForm()
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID, form])
    const resetForm = () => {
        setForm({
            SearchByCd: '',
            // SERIES: '',
            TAX_KEY: '',
            TAX_NAME: '',
            TAX_LST_CODE: '',
            Status: "1",
            TAXGRP_KEY: '',
            TAX_RATE: '',
            TAX_FORM: '',
            AOT1_D: '',
            AOT1_R: '',
            AOT2_D: '',
            AOT2_R: '',
            REMK: '',
            ACCLED_ID: '',
            CHG_TAXABLE: '0',
            ROFF: '0',
            NOSETOFF: '0',
            AOT1_ACCLED_ID: '',
            AOT2_ACCLED_ID: '',
            ACCLED_ID_17_5: '',
            ACCLED_ID_NO_CLAIM: ''
        });
    };
    useEffect(() => {
        if (TAX_KEY) {
            setCurrentTAX_KEY(TAX_KEY);
            fetchRetriveData(TAX_KEY);
            setMode(FORM_MODE.read);
        } else {
            resetForm();
            setMode(FORM_MODE.read);
        }
        setMode(FORM_MODE.read);
    }, [TAX_KEY, fetchRetriveData]);
    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            let url;
            if (mode === FORM_MODE.edit && currentTAX_KEY) {
                url = `Tax/UpdateTax?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `Tax/InsertTax?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                TAX_KEY: form.TAX_KEY,    //CODE
                TAX_NAME: form.TAX_NAME,  // NAME
                TAX_ABRV: "",   // NO INPUTBOX FOR THIS AND NO IS FOR TAX_TYPE  ALSO
                TAXGRP_KEY: form.TAXGRP_KEY || "", // Tax group
                TAX_FORM: form.TAX_FORM || 1,  //FORM
                TAX_RATE: form.TAX_RATE, //RATE
                AOT1_D: form.AOT1_D,  //DESC1
                AOT1_R: form.AOT1_R,  //RATE1
                AOT1_F: "",
                AOT2_D: form.AOT2_D,   //DESC2
                AOT2_R: form.AOT2_R,   //DESC2
                AOT2_F: 1,
                AOT3_D: 1,
                AOT3_R: 1,
                AOT3_F: 1,
                REMK: form.REMK,      //REMARK 
                ACCLED_ID: form.ACCLED_ID || 1, // LEDGER
                CHG_TAXABLE: form.CHG_TAXABLE,  //ALOOW TO CHNG TAXABLE
                ROFF: form.ROFF,                // ROUND OFF
                AOT1_ACCLED_ID: form.AOT1_ACCLED_ID || 1, // LEDGER AOT1
                AOT2_ACCLED_ID: form.AOT2_ACCLED_ID || 1, // LEDGER AOT2
                NOSETOFF: form.NOSETOFF,       // NO SET OFF PART OF PURCHASE
                ACCLED_ID_17_5: form.ACCLED_ID_17_5 || 1, //Ledger No. ITC 17(5)
                ACCLED_ID_NO_CLAIM: form.ACCLED_ID_NO_CLAIM || 1,//Ledger No. ITC 17(No Claim)
                STATUS: form.Status ? "1" : "0",
                // TAX_TYPE: form.TAX_TYPE || "",  //Tax Type

            };
            let response;
            if (mode == FORM_MODE.edit && currentTAX_KEY) {
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
                    resetForm();
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
            await fetchRetriveData(currentTAX_KEY, "R");
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
                "MODULENAME": "Tax",
                "TBLNAME": "Tax",
                "FLDNAME": "Tax_KEY",
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
                    TAX_KEY: id,
                    TAX_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    TAX_KEY: '',
                    TAX_LST_CODE: ''
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
                TAX_KEY: '',
                TAX_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    }
    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentTAX_KEY(null);
        // setForm((prevForm) => ({
        //     ...prevForm,
        //     TAX_NAME: '',
        //     TAX_ABRV: '',
        //     SearchByCd: '',

        //     Status: '1',
        // }));
        resetForm();

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "TBLNAME": "Tax",
                "FLDNAME": "Tax_KEY",
                "NCOLLEN": 0,
                "CPREFIX": "",
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 18,
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
                "MODULENAME": "Tax",
                "TBLNAME": "Tax",
                "FLDNAME": "Tax_KEY",
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
                    TAX_KEY: id,
                    TAX_LST_CODE: lastId
                }));
            }
        } catch (error) {
            console.error("Error fetching ID and LASTID:", error);
        }
    };
    const handleFirst = () => { }
    const handleLast = async () => {
        await fetchRetriveData(1, "L");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    }
    const handlePrevious = async () => {
        await fetchRetriveData(currentTAX_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleNext = async () => {
        if (currentTAX_KEY) {
            await fetchRetriveData(currentTAX_KEY, "N");
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
            const response = await axiosInstance.post(`Tax/DeleteTax?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                TAX_KEY: form.TAX_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentTAX_KEY, 'P');
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
            const response = await axiosInstance.post(`Tax/GetTaxDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response; // Extract DATA
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));

                const asPdf = pdf(<PrintTaxDt rows={formattedData} />);
                const blob = await asPdf.toBlob();
                const url = URL.createObjectURL(blob);

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
    const handleExit = () => { router.push("/masters/taxterms/taxmaster/taxtable") };
    const Buttonsx = {
        backgroundColor: '#39ace2',
        margin: { xs: '0 4px', sm: '0 6px' },
        minWidth: { xs: 40, sm: 46, md: 60 },
        height: { xs: 40, sm: 46, md: 27 },
    };
    return (
        <>
            <Box sx={{ width: '100%', justifyContent: 'center', alignItems: 'flex-start', padding: '24px', boxSizing: 'border-box', marginTop: { xs: "30px", sm: "0px", md: '0px' } }}
                className="form-container">
                <ToastContainer />
                <Box sx={{ maxWidth: '1000px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', marginBlock: '10px' }} className="form_grid" >
                    <Grid container alignItems="center"
                        sx={{ marginTop: "10px", marginInline: '20px' }}>
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography align="center" variant="h5">
                                Tax Master
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* Form Fields */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 1.5, sm: 1.5, md: 1 },
                            marginInline: { xs: '5%', sm: '10%', md: '20%' },
                            marginBlock: { xs: '15px', sm: '20px', md: '10px' },
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
                                        padding: { xs: '8px 0px', md: '4px 0px' },
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
                                gap: { xs: 1, sm: 1, md: 2 },
                                marginTop: '5px'
                            }}
                        >
                            <TextField
                                label="Series"
                                inputRef={SERIESRef}
                                sx={{ width: { xs: '100%', sm: '48%', md: '32%' } }}
                                disabled={mode === FORM_MODE.read}
                                fullWidth
                                className="custom-textfield"
                                value={form.SERIES}
                                onChange={(e) => handleManualSeriesChange(e.target.value)}
                            />
                            <TextField
                                label="Last Cd"
                                sx={{ width: { xs: '100%', sm: '48%', md: '32%' } }}
                                disabled={true}
                                fullWidth
                                className="custom-textfield"
                                value={form.TAX_LST_CODE}
                                onChange={(e) => setForm({ ...form, TAX_LST_CODE: e.target.value })}
                            />
                            <TextField
                                label="Code"
                                inputRef={TAX_KEYRef}
                                sx={{ width: { xs: '100%', sm: '48%', md: '32%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.TAX_KEY}
                                onChange={(e) => setForm({ ...form, TAX_KEY: e.target.value })}
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
                                inputRef={TAX_NAMERef}
                                label="Name"
                                sx={{ width: '100%' }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.TAX_NAME}
                                onChange={(e) => setForm({ ...form, TAX_NAME: e.target.value })}
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
                            <CustomAutocomplete
                                label="Tax Group"
                                // options={taxGroupOptions}
                                value={form.TAXGRP_KEY}
                                onChange={(value) => setForm({ ...form, TAXGRP_KEY: value })}
                                disabled={true}
                                sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}
                            />
                            <CustomAutocomplete
                                label="Tax Type"
                                // options={termsGroupOptions}
                                value={form.TAX_TYPE}
                                onChange={(value) => setForm({ ...form, TAX_TYPE: value })}
                                disabled={true}
                                sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}
                            />
                        </Box>
                        {/* <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1, md: 1 },
                            }}
                        >
                            <CustomAutocomplete
                                label="Tax Type"
                                // options={termsGroupOptions}
                                // value={form.TAX_TYPE}
                                // onChange={(value) => setForm({ ...form, TAX_TYPE: value })}
                                disabled={true}
                                sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}
                            />
                        </Box> */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1, md: 1 },
                            }}
                        >
                            <CustomAutocomplete
                                label="Ledger"
                                // options={termsGroupOptions}
                                value={form.ACCLED_ID}
                                onChange={(value) => setForm({ ...form, ACCLED_ID: value })}
                                disabled={true}
                                sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}
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
                            <CustomAutocomplete
                                label="Ledger No. ITC-17(5)"
                                // options={termsGroupOptions}
                                value={form.ACCLED_ID_17_5}
                                onChange={(value) => setForm({ ...form, ACCLED_ID_17_5: value })}
                                disabled={true}
                                sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}
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
                            <CustomAutocomplete
                                label="Ledger No. ITC-17(No Claim)"
                                // options={termsGroupOptions}
                                value={form.ACCLED_ID_NO_CLAIM}
                                onChange={(value) => setForm({ ...form, ACCLED_ID_NO_CLAIM: value })}
                                disabled={true}
                                sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                gap: { xs: 1, sm: 1.5, md: 2 },
                                alignItems: {
                                    xs: 'stretch', sm:
                                        'center', md: 'center'
                                },
                            }}
                        >
                            <TextField
                                label="Tax Rate %"
                                inputRef={TAX_RATERef}
                                sx={{ width: { xs: '100%', sm: '40%', md: '30%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.TAX_RATE}
                                onChange={(e) => setForm({ ...form, TAX_RATE: e.target.value })}
                            />
                            <CustomAutocomplete
                                label="Form"
                                // options={taxFormOptions}
                                // value={form.TAX_FORM}
                                // onChange={(value) => setForm({ ...form, TAX_FORM: value })}
                                disabled={true}
                                sx={{ width: { xs: '100%', sm: '48%', md: '48%' } }}
                            />
                        </Box>
                        {/* Add On Taxes Section */}
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                margin: 0,
                                padding: 0,
                                boxShadow: 'none',
                                ...(isReadOnly && {
                                    pointerEvents: 'none',
                                    opacity: 0.8,
                                }),
                            }}
                        >
                            <Table
                                size="small"
                                sx={{
                                    margin: 0,
                                    padding: 0,
                                    borderCollapse: 'collapse',
                                    tableLayout: 'fixed',
                                    width: '100%',
                                }}
                            >
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell
                                            sx={{ width: '14%', padding: '0px', border: '1px solid #e0e0e0' }}
                                        >
                                            <Typography variant="h6" sx={{ fontSize: '0.85rem', padding: 0, paddingLeft: '2px', margin: 0, fontWeight: 'bold', color: '#8A3324' }}>
                                                Add On Taxes
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: '45%', padding: '4px', border: '1px solid #e0e0e0' }}
                                        >
                                            <Typography variant="h6" sx={{ fontSize: '0.85rem', padding: 0, margin: 0, fontWeight: 'bold', }}>
                                                Description
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: '10%', padding: '4px', border: '1px solid #e0e0e0' }}
                                        >
                                            <Typography variant="h6" sx={{ fontSize: '0.85rem', padding: 0, margin: 0, fontWeight: 'bold' }}>
                                                Rate%
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: '25%', padding: '4px', border: '1px solid #e0e0e0' }}
                                        >
                                            <Typography variant="h6" sx={{ fontSize: '0.85rem', padding: 0, margin: 0, fontWeight: 'bold' }}>
                                                Ledger
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    <TableRow>
                                        <TableCell sx={{ width: '14%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <Typography sx={{ fontSize: '0.8rem', padding: 0, margin: 0, paddingLeft: '4px', fontWeight: 'bold' }}>
                                                AOT1
                                            </Typography>
                                        </TableCell>
                                        {/* <TableCell sx={{ width: '45%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <Typography sx={{ fontSize: '0.8rem', padding: 0, margin: 0 }}>
                                            \
                                                <TextField
                                                    value={form.AOT1_D || ''}
                                                    onChange={(e) => setForm({ ...form, AOT1_D: e.target.value })}
                                                    disabled={isReadOnly}
                                                    variant="standard"
                                                    fullWidth
                                                    InputProps={{ disableUnderline: true }}
                                                    sx={{
                                                        fontSize: '0.8rem',
                                                        padding: 0,
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                    }}
                                                />

                                            </Typography>
                                        </TableCell> */}

                                        <TableCell sx={{ width: '45%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <TextField
                                                value={form.AOT1_D || ''}
                                                onChange={(e) => setForm({ ...form, AOT1_D: e.target.value })}
                                                variant="standard"
                                                fullWidth
                                                disabled={isReadOnly} // Optional, use this if you're toggling read mode
                                                InputProps={{
                                                    disableUnderline: true,
                                                    sx: {
                                                        fontSize: '0.9rem',
                                                        padding: 0,
                                                        height: '28px',
                                                    },
                                                }}
                                                sx={{
                                                    fontSize: '0.9rem',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                }}
                                            />
                                        </TableCell>

                                        {/* <TableCell sx={{ width: '10%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <Typography sx={{ fontSize: '0.9rem', padding: 0, margin: 0 }}>
                                                {form.AOT1_R}
                                            </Typography>
                                        </TableCell> */}
                                        <TableCell sx={{ width: '10%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <TextField
                                                value={form.AOT1_R || ''}
                                                onChange={(e) => setForm({ ...form, AOT1_R: e.target.value })}
                                                variant="standard"
                                                fullWidth
                                                disabled={isReadOnly} // Optional, use if you have read-only mode
                                                InputProps={{
                                                    disableUnderline: true,
                                                    sx: {
                                                        fontSize: '0.9rem',
                                                        padding: 0,
                                                        height: '28px',
                                                    },
                                                }}
                                                sx={{
                                                    fontSize: '0.9rem',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell sx={{ width: '25%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            {/* <Typography sx={{ fontSize: '0.9rem', padding: 0, margin: 0 }}>
                                                {form.AOT1_F}
                                            </Typography> */}
                                            <Autocomplete
                                                // options={ledgerOptions}
                                                // getOptionLabel={(option) => option.name || ''}
                                                disabled={true}  // show name in dropdown
                                                value={form.AOT1_ACCLEDID || null}
                                                onChange={(e, newValue) =>
                                                    setForm({ ...form, AOT1_ACCLED_ID: newValue })
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            disableUnderline: true,
                                                        }}
                                                    />
                                                )}
                                            />

                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell sx={{ width: '14%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <Typography sx={{ fontSize: '0.8rem', padding: 0, paddingLeft: '4px', margin: 0, fontWeight: 'bold' }}>
                                                AOT2
                                            </Typography>
                                        </TableCell>
                                        {/* <TableCell sx={{ width: '45%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <Typography sx={{ fontSize: '0.9rem', padding: 0, margin: 0 }}>
                                                {form.AOT2_D}
                                            </Typography>
                                        </TableCell> */}

                                        <TableCell sx={{ width: '45%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <TextField
                                                value={form.AOT2_D || ''}
                                                onChange={(e) => setForm({ ...form, AOT2_D: e.target.value })}
                                                variant="standard"
                                                fullWidth
                                                disabled={isReadOnly} // Optional, use this if you're toggling read mode
                                                InputProps={{
                                                    disableUnderline: true,
                                                    sx: {
                                                        fontSize: '0.9rem',
                                                        padding: 0,
                                                        height: '28px',
                                                    },
                                                }}
                                                sx={{
                                                    fontSize: '0.9rem',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                }}
                                            />
                                        </TableCell>

                                        {/* <TableCell sx={{ width: '10%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <Typography sx={{ fontSize: '0.9rem', padding: 0, margin: 0 }}>
                                                {form.AOT2_R}
                                            </Typography>
                                        </TableCell> */}
                                        <TableCell sx={{ width: '10%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <TextField
                                                value={form.AOT2_R || ''}
                                                onChange={(e) => setForm({ ...form, AOT2_R: e.target.value })}
                                                variant="standard"
                                                fullWidth
                                                disabled={isReadOnly} // Optional read-only handling
                                                InputProps={{
                                                    disableUnderline: true,
                                                    sx: {
                                                        fontSize: '0.9rem',
                                                        padding: 0,
                                                        height: '28px',
                                                    },
                                                }}
                                                sx={{
                                                    fontSize: '0.9rem',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell sx={{ width: '25%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            {/* <Typography sx={{ fontSize: '0.9rem', padding: 0, margin: 0 }}>
                                                {form.AOT2_L}
                                            </Typography> */}
                                            <TextField
                                                select
                                                value={form.AOT2_ACCLED_ID}
                                                onChange={(e) => setForm({ ...form, AOT2_ACCLED_ID: e.target.value })}
                                                fullWidth
                                                disabled={true}
                                                size="small"
                                                variant="standard" // Removes outline
                                                InputProps={{
                                                    disableUnderline: true, // Removes the underline
                                                    sx: {
                                                        fontSize: '0.9rem',
                                                        padding: 0,
                                                        height: '28px',
                                                    },
                                                }}
                                                SelectProps={{
                                                    sx: { padding: 0 },
                                                }}
                                                sx={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {/* {ledgerOptions.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))} */}
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1, md: 1 },
                            }}
                        >
                            <TextField
                                inputRef={REMKRef}
                                label="Remark"
                                sx={{ width: '100%' }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.REMK}
                                onChange={(e) => setForm({ ...form, REMK: e.target.value })}
                            />
                        </Box>
                       
                    </Box>
                     <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                gap: { xs: 0.5, sm: 0.5, md: 1 },
                                 width: '100%',
    maxWidth: '100%',
                                flexWrap: 'nowrap',
                                overflowX: 'auto',

                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={mode === FORM_MODE.read}
                                        checked={form.CHG_TAXABLE === "1"}
                                        onChange={(e) => {
                                            setForm((prevForm) => ({
                                                ...prevForm,
                                                CHG_TAXABLE: e.target.checked ? "1" : "0",
                                            }));
                                        }}

                                        size="small"
                                        sx={{
                                            '&.Mui-checked': {
                                                color: mode === FORM_MODE.read ? 'rgba(0, 0, 0, 0.38)' : '#39ace2',
                                            },
                                            p: '4px',
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '20px',
                                            },
                                        }}
                                    />
                                }
                                label="Allow to Change Taxable"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '15px',
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
                                                color: mode === FORM_MODE.read ? 'rgba(0, 0, 0, 0.38)' : '#39ace2',
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
                                        fontSize: '15px',
                                    },
                                    m: 0,
                                }}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={mode === FORM_MODE.read}
                                        checked={form.NOSETOFF === "1"}
                                        onChange={(e) => {
                                            setForm((prevForm) => ({
                                                ...prevForm,
                                                NOSETOFF: e.target.checked ? "1" : "0",
                                            }));
                                        }}
                                        size="small"
                                        sx={{
                                            '&.Mui-checked': {
                                                color: mode === FORM_MODE.read ? 'rgba(0, 0, 0, 0.38)' : '#39ace2',
                                            },
                                            p: '4px',
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '20px',
                                            },
                                        }}
                                    />
                                }
                                label="No Set Off Part Of Purchase"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '15px',
                                    },
                                    m: 0,
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={mode === FORM_MODE.read}
                                        checked={Status === '1'}
                                        onChange={handleChangeStatus}
                                        size="small"
                                        sx={{
                                            '&.Mui-checked': {
                                                color: mode === FORM_MODE.read ? 'rgba(0, 0, 0, 0.38)' : '#39ace2',
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
                                        fontSize: '15px',
                                    },
                                    m: 0,
                                }}
                            />
                        </Box>
                    <Grid container alignItems="center"
                        justifyContent="center" spacing={1} sx={{ marginTop: "10px", marginInline: '20px' }}>
                        <Grid sx={{
                            width: { xs: '100%', sm: 'auto' },
                        }}>
                            <Stack direction="row" spacing={1}>
                                <PaginationButtons
                                    mode={mode}
                                    FORM_MODE={FORM_MODE}
                                    currentKey={currentTAX_KEY}
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
export default TaxMst;
