'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Autocomplete,
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
import PrintTaxDt from './PrintTaxDt';
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
    const [mode, setMode] = useState(
        currentTAX_KEY ? FORM_MODE.read : FORM_MODE.add);
    const [Status, setStatus] = useState("1");
    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const CO_ID = localStorage.getItem('CO_ID');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('USER_NAME');
    const PARTY_KEY = localStorage.getItem('PARTY_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');
    const isReadOnly = mode === FORM_MODE.read;
    const [taxDrp, setTaxDrp] = useState([]);
    const { hasSpecificPermission, loading: isPermissionLoading } = useUserPermissions();
    const moduleName = 'Tax Master';

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setForm((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }));
    };

    useEffect(() => {
        fetchTaxDrp();
    }, [])

    const fetchTaxDrp = async () => {
        try {
            const response = await axiosInstance.post('TaxGrp/GetTaxGrpDrp', {
                Flag: ""
            });
            if (response.data.STATUS === 0) {
                setTaxDrp(response.data.DATA);
            } else {
                setTaxDrp([]);
            }
        } catch (error) {
            toast.error("Error while fetching tax");
        }
    };

    const fetchRetriveData = useCallback(async (currentTAX_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('Tax/RetriveTax', {
                FLAG: flag,
                TBLNAME: "Tax",
                FLDNAME: "Tax_KEY",
                ID: currentTAX_KEY,
                ORDERBYFLD: "",
                CWHAER: "",
                CO_ID: CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const taxData = DATA[0];
                setForm(prevForm => ({
                    ...prevForm,
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
                }));
                setStatus(taxData.STATUS);
                setCurrentTAX_KEY(taxData.TAX_KEY);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentTAX_KEY}`);
                    resetForm();
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID]);

    const resetForm = () => {
        setForm({
            SearchByCd: '',
            TAX_KEY: '',
            TAX_NAME: '',
            TAX_LST_CODE: '',
            SERIES: '',
            TAX_ABRV: '',
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
                TAX_KEY: form.TAX_KEY,
                TAX_NAME: form.TAX_NAME,
                TAX_ABRV: "",
                TAXGRP_KEY: form.TAXGRP_KEY || "",
                TAX_FORM: form.TAX_FORM || 1,
                TAX_RATE: form.TAX_RATE,
                AOT1_D: form.AOT1_D,
                AOT1_R: form.AOT1_R,
                AOT1_F: "",
                AOT2_D: form.AOT2_D,
                AOT2_R: form.AOT2_R,
                AOT2_F: 1,
                AOT3_D: 1,
                AOT3_R: 1,
                AOT3_F: 1,
                REMK: form.REMK,
                ACCLED_ID: form.ACCLED_ID || 1,
                CHG_TAXABLE: form.CHG_TAXABLE,
                ROFF: form.ROFF,
                AOT1_ACCLED_ID: form.AOT1_ACCLED_ID || 1,
                AOT2_ACCLED_ID: form.AOT2_ACCLED_ID || 1,
                NOSETOFF: form.NOSETOFF,
                ACCLED_ID_17_5: form.ACCLED_ID_17_5 || 1,
                ACCLED_ID_NO_CLAIM: form.ACCLED_ID_NO_CLAIM || 1,
                STATUS: form.Status ? "1" : "0",
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
                MODULENAME: "Tax",
                TBLNAME: "Tax",
                FLDNAME: "Tax_KEY",
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
    };

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentTAX_KEY(null);
        resetForm();

        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                MODULENAME: "Tax",
                TBLNAME: "Tax",
                FLDNAME: "Tax_KEY",
                NCOLLEN: 0,
                CPREFIX: "",
                COBR_ID: COBR_ID,
                FCYR_KEY: FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 18,
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
                MODULENAME: "Tax",
                TBLNAME: "Tax",
                FLDNAME: "Tax_KEY",
                NCOLLEN: 5,
                CPREFIX: cprefix,
                COBR_ID: COBR_ID,
                FCYR_KEY: FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 0,
                FLAG: ""
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

    const handleFirst = () => { };

    const handleLast = async () => {
        await fetchRetriveData(1, "L");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

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
    };

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
                SearchText: ""
            });
            const { data: { STATUS, DATA } } = response;
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

    const handleInputChange = () => { };

    const handleExit = () => { router.push("/masterpage/?activeTab=27") };

    const handleTable = () => {
        router.push('/masters/taxterms/taxmaster/taxtable');
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
                        Tax Master
                    </Typography>
                </Grid>

                <Grid container justifyContent="space-between"
                    sx={{ marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '0%', xl: '0%' } }}
                    spacing={2}
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
                            onChange={handleInputChange}
                            value={form.TAX_LST_CODE}
                            name="TAX_LST_CODE"
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
                            inputRef={TAX_KEYRef}
                            variant="filled"
                            fullWidth
                            onChange={(e) => setForm({ ...form, TAX_KEY: e.target.value })}
                            value={form.TAX_KEY}
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
                            inputRef={TAX_KEYRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.TAX_KEY}
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
                            label={<span>Name<span style={{ color: "red" }}>*</span></span>}
                            inputRef={TAX_NAMERef}
                            variant="filled"
                            fullWidth
                            onChange={(e) => setForm({ ...form, TAX_NAME: e.target.value })}
                            value={form.TAX_NAME}
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
                            id="TAXGRP_KEY"
                            disabled={mode === FORM_MODE.read}
                            getOptionLabel={(option) => option.TAXGRP_NAME || ''}
                            options={taxDrp}
                            label="Tax Group"
                            name="TAXGRP_KEY"
                            value={taxDrp.find(option => option.TAXGRP_KEY === form.TAXGRP_KEY) || null}
                            onChange={(e, newValue) => {
                                setForm((prevForm) => ({
                                    ...prevForm,
                                    TAXGRP_KEY: newValue ? newValue.TAXGRP_KEY : '',
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
                            options={taxDrp}
                            label="Tax Type"
                            name="TAXGRP_KEY"
                            value={taxDrp.find(option => option.TAXGRP_KEY === form.TAXGRP_NAME) || null}
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
                            options={taxDrp}
                            label="Ledger"
                            name="TAXGRP_KEY"
                            value={taxDrp.find(option => option.TAXGRP_KEY === form.TAXGRP_NAME) || null}
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
                            id="ledger-17-5-autocomplete"
                            disabled={true}
                            getOptionLabel={(option) => option.TAXGRP_NAME || ''}
                            options={taxDrp}
                            label="Ledger-No ITC-17(5)"
                            name="ACCLED_ID_17_5"
                            value={form.ACCLED_ID_17_5}
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
                            id="ledger-no-claim-autocomplete"
                            disabled={true}
                            getOptionLabel={(option) => option.TAXGRP_NAME || ''}
                            options={taxDrp}
                            label="Ledger-No- ITC(No clain)"
                            name="ACCLED_ID_NO_CLAIM"
                            value={form.ACCLED_ID_NO_CLAIM}
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
                        <TextField
                            label="Tax Rate %"
                            inputRef={TAX_RATERef}
                            variant="filled"
                            fullWidth
                            onChange={(e) => setForm({ ...form, TAX_RATE: e.target.value })}
                            value={form.TAX_RATE}
                            name="TAX_RATE"
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
                            id="TAXGRP_KEY"
                            disabled={mode === FORM_MODE.read}
                            getOptionLabel={(option) => option.TAXGRP_NAME || ''}
                            options={taxDrp}
                            label="Form"
                            name="TAXGRP_KEY"
                            value={taxDrp.find(option => option.TAXGRP_KEY === form.TAXGRP_NAME) || null}
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

                    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                margin: 0,
                                padding: 0,
                                boxShadow: 'none',
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
                                            <Typography variant="h6" sx={{ fontSize: '0.76rem', padding: 0, paddingLeft: '2px', margin: 0, fontWeight: 'bold', color: '#8A3324' }}>
                                                Add On Taxes
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: '45%', padding: '4px', border: '1px solid #e0e0e0' }}
                                        >
                                            <Typography variant="h6" sx={{ fontSize: '0.76rem', padding: 0, margin: 0, fontWeight: 'bold', }}>
                                                Description
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: '10%', padding: '4px', border: '1px solid #e0e0e0' }}
                                        >
                                            <Typography variant="h6" sx={{ fontSize: '0.76rem', padding: 0, margin: 0, fontWeight: 'bold' }}>
                                                Rate%
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: '25%', padding: '4px', border: '1px solid #e0e0e0' }}
                                        >
                                            <Typography variant="h6" sx={{ fontSize: '0.76rem', padding: 0, margin: 0, fontWeight: 'bold' }}>
                                                Ledger
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ width: '14%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <Typography sx={{ fontSize: '0.76rem', padding: 0, margin: 0, paddingLeft: '4px', fontWeight: 'bold' }}>
                                                AOT1
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: '45%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <TextField
                                                value={form.AOT1_D || ''}
                                                onChange={(e) => setForm({ ...form, AOT1_D: e.target.value })}
                                                variant="standard"
                                                fullWidth
                                                disabled={isReadOnly}
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
                                        <TableCell sx={{ width: '10%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <TextField
                                                value={form.AOT1_R || ''}
                                                onChange={(e) => setForm({ ...form, AOT1_R: e.target.value })}
                                                variant="standard"
                                                fullWidth
                                                disabled={isReadOnly}
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
                                            <Autocomplete
                                                disabled={true}
                                                value={form.AOT1_ACCLED_ID || null}
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
                                            <Typography sx={{ fontSize: '0.76rem', paddingLeft: '4px', fontWeight: 'bold' }}>
                                                AOT2
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: '45%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <TextField
                                                value={form.AOT2_D || ''}
                                                onChange={(e) => setForm({ ...form, AOT2_D: e.target.value })}
                                                variant="standard"
                                                fullWidth
                                                disabled={isReadOnly}
                                                InputProps={{ disableUnderline: true, sx: { fontSize: '0.9rem', height: '28px' } }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '10%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <TextField
                                                value={form.AOT2_R || ''}
                                                onChange={(e) => setForm({ ...form, AOT2_R: e.target.value })}
                                                variant="standard"
                                                fullWidth
                                                disabled={isReadOnly}
                                                InputProps={{ disableUnderline: true, sx: { fontSize: '0.9rem', height: '28px' } }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: '25%', padding: '4px', border: '1px solid #e0e0e0' }}>
                                            <TextField
                                                value={form.AOT2_ACCLED_ID || ''}
                                                variant="standard"
                                                fullWidth
                                                disabled={true}
                                                InputProps={{
                                                    disableUnderline: true,
                                                    sx: { fontSize: '0.9rem', padding: 0, height: '28px' }
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextField
                            label="Abbreviation"
                            inputRef={TAX_ABRVRef}
                            variant="filled"
                            fullWidth
                            onChange={(e) => setForm({ ...form, TAX_ABRV: e.target.value })}
                            value={form.TAX_ABRV || ''}
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

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextField
                            label="Remark"
                            inputRef={REMKRef}
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox size='small'
                                    disabled={mode === FORM_MODE.read}
                                    checked={form.CHG_TAXABLE === "1"}
                                    onChange={(e) => {
                                        setForm((prevForm) => ({
                                            ...prevForm,
                                            CHG_TAXABLE: e.target.checked ? "1" : "0",
                                        }));
                                    }}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#635bff',
                                        }
                                    }}
                                />
                            }
                            label="Allow to Change Taxable"
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox size='small'
                                    disabled={mode === FORM_MODE.read}
                                    checked={form.NOSETOFF === "1"}
                                    onChange={(e) => {
                                        setForm((prevForm) => ({
                                            ...prevForm,
                                            NOSETOFF: e.target.checked ? "1" : "0",
                                        }));
                                    }}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#635bff',
                                        }
                                    }}
                                />
                            }
                            label="No Set Off Part Of Purchase"
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

export default TaxMst;