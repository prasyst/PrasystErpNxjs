'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, FormLabel, RadioGroup, Radio,
} from '@mui/material';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toast, ToastContainer } from 'react-toastify'
import z from 'zod';
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import CrudButton from '@/GlobalFunction/CrudButton';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import { TbListSearch } from "react-icons/tb";
import CustomAutocomplete from '@/GlobalFunction/CustomAutoComplete/CustomAutoComplete';
import PrintTermsDt from './PrintTermsDt';
import { useUserPermissions } from '@/app/hooks/useUserPermissions';
import { textInputSx } from '../../../../../public/styles/textInputSx';
import { DropInputSx } from '../../../../../public/styles/dropInputSx';
import AutoVibe from '@/GlobalFunction/CustomAutoComplete/AutoVibe';

const FORM_MODE = getFormMode();
const categoryFormSchema = z.object({
    FGCAT_NAME: z.string().min(1, "Category Name is required"),
});

const columns = [
    { id: "ROWNUM", label: "SrNo.", minWidth: 40 },
    { id: "FGCAT_KEY", label: "Code", minWidth: 40 },
    { id: "FGCAT_CODE", label: "AltCode", minWidth: 40 },
    { id: "FGCAT_NAME", label: "CatName", minWidth: 40 },
    { id: "SEGMENT_KEY", label: "Segment", minWidth: 40 },
    { id: "SR_CODE", label: "Cat_Series", minWidth: 40 },
];

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
    const [termDrp, setTermDrp] = useState([]);
    const { hasSpecificPermission, loading: isPermissionLoading } = useUserPermissions();
    const moduleName = 'Terms Master';

    useEffect(() => {
        if (!form.GST_APP) {
            setForm((prev) => ({ ...prev, GST_APP: 'N', TERM_OPR: '-' }));
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
            TERM_PERCENT: 0,
            TERM_VAL_FIX: '0',
            TERM_RATE: 0,
            TERM_PERQTY: 0,
            TERM_OPR: "-",
            REMK: '',
            ACCLED_ID: '',
            CHG_TAXABLE: '',
            ROFF: '0',
            GST_APP: 'N',
            TERMS_TYPE: '',
            Status: 1,
        });
    };

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };

    const handleInputChange = () => { };

    useEffect(() => {
        fetchTermGroup();
    }, [])

    const fetchTermGroup = async () => {
        try {
            const response = await axiosInstance.post('TermGrp/GetTermGrpDrp', {
                Flag: ""
            });
            if (response.data.STATUS === 0) {
                setTermDrp(response.data.DATA);
            } else {
                setTermDrp([]);
            }
        } catch (error) {
            toast.error('Error while fetching term group.');
        }
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

    const fetchRetriveData = useCallback(async (currentTERM_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('Terms/RetriveTerms', {
                FLAG: flag,
                TBLNAME: "Terms",
                FLDNAME: "Term_KEY",
                ID: currentTERM_KEY,
                ORDERBYFLD: "",
                CWHAER: "",
                CO_ID: CO_ID
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
    }, [CO_ID, form.ROFF]);

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
                Term_KEY: form.TERM_KEY,
                Term_ALT_CODE: form.TERM_ALT_CODE,
                Term_NAME: form.TERM_NAME,
                Term_ABRV: form.TERM_ABRV,
                TermGrp_KEY: form.TERMGRP_KEY || '',
                Term_Val_YN: form.TERM_VAL_YN,
                Term_Percent: form.TERM_PERCENT || 0.00,
                Term_Val_Fix: form.TERM_VAL_FIX || "0",
                Term_Rate: form.TERM_RATE || 0.00,
                Term_PerQty: form.TERM_PERQTY || 0,
                Term_Opr: form.TERM_OPR,
                REMK: form.REMK || "",
                ACCLED_ID: form.ACCLED_ID || 1,
                CHG_TAXABLE: form.CHG_TAXABLE || "N",
                ROFF: form.ROFF,
                GST_APP: form.GST_APP || "N",
                TERMS_TYPE: form.TERMS_TYPE || 1,
                STATUS: form.Status ? "1" : "0",
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
                MODULENAME: "Terms",
                TBLNAME: "Terms",
                FLDNAME: "Term_KEY",
                NCOLLEN: 5,
                CPREFIX: newSeries,
                COBR_ID: COBR_ID,
                FCYR_KEY: FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 0,
                FLAG: ""
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
    };

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentTERM_KEY(null);
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
            TERM_PERCENT: 0.00,
            TERM_VAL_FIX: '0',
            TERM_RATE: 0.00,
            TERM_PERQTY: 0,
            TERM_OPR: "-",
            REMK: '',
            ACCLED_ID: '',
            CHG_TAXABLE: '',
            ROFF: '0',
            GST_APP: 'N',
            TERMS_TYPE: '',
            Status: 1,
        });

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                MODULENAME: "Terms",
                TBLNAME: "Terms",
                FLDNAME: "Term_KEY",
                NCOLLEN: 0,
                CPREFIX: "",
                COBR_ID: COBR_ID,
                FCYR_KEY: FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 16,
                FLAG: "Series"
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

    const handleFirst = () => { }

    const handleLast = async () => {
        await fetchRetriveData(1, "L");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

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
    };

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
                SearchText: ""
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
            toast.error("Print Error:", error);
        }
    };

    const handleExit = () => { router.push("/masterpage/?activeTab=27") };

    const handleTable = () => {
        router.push('/masters/taxterms/termmaster/termstable');
    };

    return (
        <Grid
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
                minHeight: '90vh',
                overflowX: 'hidden',
                overflowY: 'auto'
            }}
        >
            <ToastContainer />
            <Grid container spacing={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '15%', xl: '5%' },
                }}
            >
                <Grid>
                    <Typography align="center" variant="h6">
                        Terms Master
                    </Typography>
                </Grid>

                <Grid container spacing={2} justifyContent="space-between"
                    sx={{ marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '0%', xl: '0%' } }}
                >
                    <Grid>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4) !important' }}
                            disabled={mode !== 'view'}
                            onClick={handlePrevious}
                        >
                            <KeyboardArrowLeftIcon />
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important', ml: 1 }}
                            disabled={mode !== 'view'}
                            onClick={handleNext}
                        >
                            <NavigateNextIcon />
                        </Button>
                    </Grid>

                    <Grid sx={{ display: 'flex' }}>
                        <TextField
                            placeholder="Search By Code"
                            variant="outlined"
                            sx={{
                                backgroundColor: '#e0f7fa',
                                '& .MuiInputBase-input': {
                                    paddingBlock: { xs: '8px', md: '4px' },
                                    paddingLeft: { xs: '8px', md: '8px' },
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
                    </Grid>

                    <Grid sx={{ display: 'flex' }}>
                        <TbListSearch onClick={handleTable} style={{ color: 'rgb(99, 91, 255)', width: '40px', height: '32px' }} />
                    </Grid>

                    <Grid sx={{ display: "flex", justifyContent: "end", marginRight: '-6px' }}>
                        <CrudButton
                            moduleName={moduleName}
                            mode={mode}
                            onAdd={handleAdd}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handlePrint}
                            onExit={handleExit}
                            readOnlyMode={mode === FORM_MODE.read}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            canAdd={hasSpecificPermission(moduleName, 'ADD')}
                            canEdit={hasSpecificPermission(moduleName, 'EDIT')}
                            canDelete={hasSpecificPermission(moduleName, 'DELETE')}
                            canView={hasSpecificPermission(moduleName, 'VIEW')}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Series"
                            inputRef={SERIESRef}
                            variant="filled"
                            fullWidth
                            onChange={(e) => handleManualSeriesChange(e.target.value)}
                            value={form.SERIES}
                            name="SERIES"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Last Cd"
                            variant="filled"
                            fullWidth
                            onChange={(e) => setForm({ ...form, TERM_LST_CODE: e.target.value })}
                            value={form.TERM_LST_CODE}
                            name="TERM_LST_CODE"
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Code"
                            inputRef={TERM_KEYRef}
                            variant="filled"
                            fullWidth
                            onChange={(e) => setForm({ ...form, TERM_KEY: e.target.value })}
                            value={form.TERM_KEY}
                            name="TAX_KEY"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Alt Code"
                            inputRef={TERM_KEYRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.TERM_KEY}
                            name="TERM_KEY"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label={<span>Name<span style={{ color: "red" }}>*</span></span>}
                            inputRef={TERM_NAMERef}
                            variant="filled"
                            fullWidth
                            onChange={(e) => setForm({ ...form, TERM_NAME: e.target.value })}
                            value={form.TERM_NAME}
                            name="TAX_NAME"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AutoVibe
                            id="TERMGRP_KEY"
                            disabled={mode === FORM_MODE.read}
                            getOptionLabel={(option) => option.TERMGRP_NAME || ''}
                            options={termDrp}
                            label="Term Group"
                            name="TERMGRP_KEY"
                            value={termDrp.find(option => option.TERMGRP_KEY === form.TERMGRP_NAME) || null}
                            onChange={(e, newValue) => {
                                setForm((prevForm) => ({
                                    ...prevForm,
                                    TERMGRP_KEY: newValue ? newValue.TERMGRP_KEY : '',
                                }));
                            }}
                            sx={{
                                ...DropInputSx,
                                '& .MuiFilledInput-root': {
                                    ...DropInputSx['& .MuiFilledInput-root'],
                                    paddingTop: '16px !important',
                                },
                            }}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AutoVibe
                            id="TAXGRP_KEY"
                            disabled={mode === FORM_MODE.read}
                            getOptionLabel={(option) => option.TAXGRP_NAME || ''}
                            options={termDrp}
                            label="Term Type"
                            name="TAXGRP_KEY"
                            value={termDrp.find(option => option.TAXGRP_KEY === form.TAXGRP_NAME) || null}
                            onChange={(e, newValue) => {
                                setForm((prevForm) => ({
                                    ...prevForm,
                                    TAXGRP_NAME: newValue ? newValue.TAXGRP_KEY : '',
                                }));
                            }}
                            sx={{
                                ...DropInputSx,
                                '& .MuiFilledInput-root': {
                                    ...DropInputSx['& .MuiFilledInput-root'],
                                    paddingTop: '16px !important',
                                },
                            }}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AutoVibe
                            id="TAXGRP_KEY"
                            disabled={true}
                            getOptionLabel={(option) => option.TAXGRP_NAME || ''}
                            options={termDrp}
                            label="Ledger"
                            name="TAXGRP_KEY"
                            value={termDrp.find(option => option.TAXGRP_KEY === form.TAXGRP_NAME) || null}
                            onChange={(e, newValue) => {
                                setForm((prevForm) => ({
                                    ...prevForm,
                                    TAXGRP_NAME: newValue ? newValue.TAXGRP_KEY : '',
                                }));
                            }}
                            sx={{
                                ...DropInputSx,
                                '& .MuiFilledInput-root': {
                                    ...DropInputSx['& .MuiFilledInput-root'],
                                    paddingTop: '16px !important',
                                },
                            }}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox size='small'
                                    disabled={mode === FORM_MODE.read}
                                    checked={form.ROFF === "1"}
                                    onChange={(e) => {
                                        setForm((prevForm) => ({
                                            ...prevForm,
                                            ROFF: e.target.checked ? "1" : "0",
                                        }));
                                    }}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#635bff',
                                        }
                                    }}
                                />
                            }
                            label="Calculation Flag"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                        <TextField
                            label="Abbreviation"
                            inputRef={TERM_ABRVRef}
                            variant="filled"
                            fullWidth
                            onChange={(e) => setForm({ ...form, TERM_ABRV: e.target.value })}
                            value={form.TERM_ABRV || ''}
                            name="TAX_ABRV"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0,
                            }}
                        >
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
                                    variant='filled'
                                    disabled={mode === FORM_MODE.read || form.TERM_VAL_FIX === "1"}
                                    value={form.TERM_PERCENT}
                                    onChange={(e) => setForm({ ...form, TERM_PERCENT: e.target.value })}
                                    sx={textInputSx}
                                    inputProps={{
                                        style: {
                                            padding: '6px 0px',
                                            marginTop: '10px',
                                            fontSize: '14px',
                                        },
                                    }}
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
                                                    color: mode === FORM_MODE.read ? 'rgba(0, 0, 0, 0.38)' : '#39ace2',
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
                                        variant='filled'
                                        fullWidth
                                        disabled={mode === FORM_MODE.read || form.TERM_VAL_FIX === "1"}
                                        value={form.TERM_RATE}
                                        onChange={(e) => setForm({ ...form, TERM_RATE: e.target.value })}
                                        sx={textInputSx}
                                        inputProps={{
                                            style: {
                                                padding: '6px 0px',
                                                marginTop: '10px',
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                    <TextField
                                        label="Per Qty"
                                        variant='filled'
                                        disabled={mode === FORM_MODE.read || form.TERM_VAL_FIX === "1"}
                                        value={form.TERM_PERQTY}
                                        onChange={(e) => setForm({ ...form, TERM_PERQTY: e.target.value })}
                                        sx={textInputSx}
                                        inputProps={{
                                            style: {
                                                padding: '6px 0px',
                                                marginTop: '10px',
                                                fontSize: '14px',
                                            },
                                        }}
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
                                            mt: '0px',
                                            whiteSpace: 'nowrap',
                                            fontSize: '16px',
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
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                        <TextField
                            label="Remark"
                            inputRef={TERM_ABRVRef}
                            variant="filled"
                            fullWidth
                            onChange={(e) => setForm({ ...form, REMK: e.target.value })}
                            value={form.REMK}
                            name="REMK"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox size='small'
                                    disabled={mode === FORM_MODE.read}
                                    checked={form.ROFF === "1"}
                                    onChange={(e) => {
                                        setForm((prevForm) => ({
                                            ...prevForm,
                                            ROFF: e.target.checked ? "1" : "0",
                                        }));
                                    }}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#635bff',
                                        }
                                    }}
                                />
                            }
                            label="Round Off"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }} display="flex" justifyContent="end">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={mode === FORM_MODE.read}
                                    checked={Status == "1"}
                                    onChange={handleChangeStatus}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#635bff',
                                        }
                                    }}
                                />
                            }
                            label="Active "
                        />
                    </Grid>
                </Grid>

                <Grid sx={{
                    display: "flex",
                    justifyContent: "end",
                    ml: '56.8%',
                    position: 'relative',
                    top: 10
                }}>
                    {mode === FORM_MODE.read && (
                        <>
                            <Button variant="contained"
                                sx={{
                                    background: 'linear-gradient(290deg, #d4d4d4, #ffffff)',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                onClick={handleAdd} disabled>
                                Submit
                            </Button>
                            <Button variant="contained"
                                sx={{
                                    background: 'linear-gradient(290deg, #a7c5e9, #ffffff)',
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
                    {(mode === FORM_MODE.edit || mode === FORM_MODE.add) && (
                        <>
                            <Button variant="contained"
                                sx={{
                                    backgroundColor: '#635bff',
                                    color: '#fff',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant="contained"
                                sx={{
                                    backgroundColor: '#635bff',
                                    color: '#fff',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                onClick={handleCancel}>
                                Cancel
                            </Button>
                        </>
                    )}
                </Grid>
            </Grid >

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this category?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{
                            backgroundColor: '#635bff',
                            color: 'white',
                            '&:hover': { backgroundColor: '#1565c0', color: 'white' },
                        }}
                        onClick={handleConfirmDelete}
                    >
                        Yes
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#635bff',
                            color: 'white',
                            '&:hover': { backgroundColor: '#1565c0', color: 'white' },
                        }}
                        onClick={handleCloseConfirmDialog}
                    >
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid >
    );
};

export default TermsMst;
