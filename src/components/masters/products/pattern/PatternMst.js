'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toast, ToastContainer } from 'react-toastify';
import { pdf } from '@react-pdf/renderer';
import PrintPtrnData from './PrintPtrnData';
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { TbListSearch } from "react-icons/tb";
import CrudButton from '@/GlobalFunction/CrudButton';
import ConfirmDelDialog from '@/GlobalFunction/ConfirmDelDialog';

const FORM_MODE = getFormMode();
const PatternMst = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const FGPTN_KEY = searchParams.get('FGPTN_KEY');

    const [currentFGPTN_KEY, setCurrentFGPTN_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        FGPTN_CODE: '',
        FGPTN_KEY: '',
        FGPTN_NAME: '',
        FGPTN_ABRV: '',
        FGPTN_LST_CODE: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const FGPTN_KEYRef = useRef(null);
    const FGPTN_NAMERef = useRef(null);
    const FGPTN_ABRVRef = useRef(null);
    const FGPTN_CODERef = useRef(null);
    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentFGPTN_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const CO_ID = localStorage.getItem('CO_ID');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('USER_NAME');
    const PARTY_KEY = localStorage.getItem('PARTY_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };

    // const fetchRetriveData = async (currentFGPTN_KEY, flag = "R", isManualSearch = false) => {
    //     try {
    //         const response = await axiosInstance.post('Fgptn/RetriveFgptn', {
    //             "FLAG": flag,
    //             "TBLNAME": "Fgptn",
    //             "FLDNAME": "Fgptn_KEY",
    //             "ID": currentFGPTN_KEY,
    //             "ORDERBYFLD": "",
    //             "CWHAER": "",
    //             "CO_ID": CO_ID
    //         });
    //         const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
    //         if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
    //             const categoryData = DATA[0];
    //             setForm({
    //                 FGPTN_KEY: categoryData.FGPTN_KEY,
    //                 FGPTN_NAME: categoryData.FGPTN_NAME,
    //                 FGPTN_ABRV: categoryData.FGPTN_ABRV || '',
    //                 FGPTN_CODE: categoryData.FGPTN_CODE || '',
    //                 SERIES: categoryData.SERIES || '',
    //                 FGPTN_LST_CODE: categoryData.FGPTN_LST_CODE || '',
    //                 Status: categoryData.STATUS,
    //             });
    //             setStatus(DATA[0].STATUS);
    //             setCurrentFGPTN_KEY(categoryData.FGPTN_KEY);

    //                // ✅ Update URL
    //         const newParams = new URLSearchParams();
    //         newParams.set("FGPTN_KEY", categoryData.FGPTN_KEY);
    //         router.replace(`/masters/products/pattern?${newParams.toString()}`);
    //         } else {
    //             if (isManualSearch) {
    //                 toast.error(`${MESSAGE} FOR ${currentFGPTN_KEY}`);
    //                 setForm({
    //                     FGPTN_KEY: '',
    //                     FGPTN_NAME: '',
    //                     FGPTN_ABRV: '',
    //                     FGPTN_CODE: '',
    //                     SERIES: '',
    //                     FGPTN_LST_CODE: '',
    //                     Status: 0,
    //                 });
    //             }
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const fetchRetriveData = useCallback(async (currentFGPTN_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('Fgptn/RetriveFgptn', {
                "FLAG": flag,
                "TBLNAME": "Fgptn",
                "FLDNAME": "Fgptn_KEY",
                "ID": currentFGPTN_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });

            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;

            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const categoryData = DATA[0];
                setForm({
                    FGPTN_KEY: categoryData.FGPTN_KEY,
                    FGPTN_NAME: categoryData.FGPTN_NAME,
                    FGPTN_ABRV: categoryData.FGPTN_ABRV || '',
                    FGPTN_CODE: categoryData.FGPTN_CODE || '',
                    SERIES: categoryData.SERIES || '',
                    FGPTN_LST_CODE: categoryData.FGPTN_LST_CODE || '',
                    Status: categoryData.STATUS,
                });
                setStatus(categoryData.STATUS);
                setCurrentFGPTN_KEY(categoryData.FGPTN_KEY);

                // ✅ Update URL
                const newParams = new URLSearchParams();
                newParams.set("FGPTN_KEY", categoryData.FGPTN_KEY);
                router.replace(`/masters/products/pattern?${newParams.toString()}`);
            } else if (isManualSearch) {
                toast.error(`${MESSAGE} FOR ${currentFGPTN_KEY}`);
                setForm({
                    FGPTN_KEY: '',
                    FGPTN_NAME: '',
                    FGPTN_ABRV: '',
                    FGPTN_CODE: '',
                    SERIES: '',
                    FGPTN_LST_CODE: '',
                    Status: 0,
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID, router]);

    useEffect(() => {
        if (FGPTN_KEY) {
            setCurrentFGPTN_KEY(FGPTN_KEY);
            fetchRetriveData(FGPTN_KEY);
            setMode(FORM_MODE.read);
        } else {
            setForm({
                SearchByCd: '',
                SERIES: '',
                FGPTN_CODE: '',
                FGPTN_KEY: '',
                FGPTN_NAME: '',
                FGPTN_ABRV: '',
                FGPTN_LST_CODE: '',
                Status: "1",
            })
            setMode(FORM_MODE.read);
        }
        setMode(FORM_MODE.read);
    }, [FGPTN_KEY, fetchRetriveData]);

    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            let url;
            if (mode === FORM_MODE.edit && currentFGPTN_KEY) {
                url = `Fgptn/UpdateFgptn?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `Fgptn/InsertFgptn?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                Fgptn_KEY: form.FGPTN_KEY,  //CODE
                Fgptn_CODE: form.FGPTN_CODE,
                Fgptn_NAME: form.FGPTN_NAME,
                Fgptn_ABRV: form.FGPTN_ABRV,
                Merchandiser_key: '',
                DISP_FLG: '0',
                FGStyle_Id: 0,
                STATUS: form.Status ? "1" : "0",

            };
            let response;
            if (mode == FORM_MODE.edit && currentFGPTN_KEY) {
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
                        FGPTN_KEY: '',
                        FGPTN_NAME: '',
                        FGPTN_ABRV: '',
                        FGPTN_CODE: '',
                        SERIES: '',
                        FGPTN_LST_CODE: '',
                        Status: 0,
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
            await fetchRetriveData(currentFGPTN_KEY, "R");
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
                "MODULENAME": "Fgptn",
                "TBLNAME": "Fgptn",
                "FLDNAME": "Fgptn_KEY",
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
                    FGPTN_KEY: id,
                    FGPTN_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    FGPTN_KEY: '',
                    FGPTN_LST_CODE: ''
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
                FGPTN_KEY: '',
                FGPTN_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    };

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentFGPTN_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            FGPTN_NAME: '',
            FGPTN_ABRV: '',
            SearchByCd: '',
            FGPTN_CODE: '',
            Status: '1',
        }));

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "Fgptn",
                "TBLNAME": "Fgptn",
                "FLDNAME": "Fgptn_KEY",
                "NCOLLEN": 0,
                "CPREFIX": "",
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 29,
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
                "MODULENAME": "Fgptn",
                "TBLNAME": "Fgptn",
                "FLDNAME": "Fgptn_KEY",
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
                    FGPTN_KEY: id,
                    FGPTN_LST_CODE: lastId
                }));
            }
        } catch (error) {
            toast.error("Error fetching ID and LASTID:", error);
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
        await fetchRetriveData(currentFGPTN_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleNext = async () => {
        if (currentFGPTN_KEY) {
            await fetchRetriveData(currentFGPTN_KEY, "N");
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
            const response = await axiosInstance.post(`Fgptn/DeleteFgptn?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                Fgptn_KEY: form.FGPTN_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE || 'Record Deleted.');
                await fetchRetriveData(currentFGPTN_KEY, 'P');
            } else {
                toast.error(MESSAGE);
            }
        } catch (error) {
            toast.error("Delete Error:", error);
        }
    };

    const handleEdit = () => {
        setMode(FORM_MODE.edit);
    };

    const handlePrint = async () => {
        try {
            const response = await axiosInstance.post(`Fgptn/GetFgptnDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response; // Extract DATA
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));

                // Generate the PDF blob
                const asPdf = pdf(<PrintPtrnData rows={formattedData} />);
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

    const handleTable = () => {
        router.push('/masters/products/pattern/patterntable');
    };

    const handleExit = () => {
        router.push("/masterpage?activeTab=products");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const textInputSx = {
        '& .MuiInputBase-root': {
            height: 40,
            fontSize: '14px',
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            top: '-8px',
        },
        '& .MuiFilledInput-root': {
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            overflow: 'hidden',
            height: 40,
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
        '& .MuiFilledInput-root.Mui-disabled': {
            backgroundColor: '#fff'
        }
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
                minHeight: '91vh',
                overflowX: 'hidden',
                overflowY: 'auto'
            }}
        >
            <ToastContainer />

            <Grid container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '15%', xl: '5%' },
                }}
                spacing={2}
            >
                <Grid>
                    <Typography align="center" variant="h6">
                        Pattern Master
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
                            moduleName=""
                            mode={mode}
                            onView={handlePrint}
                            onAdd={handleAdd}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onExit={handleExit}
                            readOnlyMode={mode === FORM_MODE.read}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
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
                                    fontSize: '12px',
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
                            value={form.FGPTN_LST_CODE}
                            name="FGPTN_LST_CODE"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Code"
                            inputRef={FGPTN_KEYRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.FGPTN_KEY}
                            name="FGPTN_KEY"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Alt Code"
                            inputRef={FGPTN_CODERef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.FGPTN_CODE}
                            name="FGPTN_CODE"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            inputRef={FGPTN_NAMERef}
                            label="Name"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.FGPTN_NAME}
                            name="FGPTN_NAME"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Abbreviation"
                            inputRef={FGPTN_ABRVRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.FGPTN_ABRV}
                            name="FGPTN_ABRV"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '10px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={mode === FORM_MODE.read}
                                    checked={Status == '1'}
                                    onChange={handleChangeStatus}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#39ace2',
                                        },
                                    }}
                                />
                            }
                            label="Active"
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

            <ConfirmDelDialog
                open={openConfirmDialog}
                title='Confirm Deletion'
                description="Are you sure you want to delete this item?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenConfirmDialog(false)}
            />

        </Grid >
    );
};
export default PatternMst;
