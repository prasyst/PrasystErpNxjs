import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toast, ToastContainer } from 'react-toastify';
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import CrudButton from '@/GlobalFunction/CrudButton';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import PrintQtDt from './PrintQtDt';
import CustomAutocomplete from '@/GlobalFunction/CustomAutoComplete/CustomAutoComplete';

const FORM_MODE = getFormMode();
const QualityMst = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const QLTY_KEY = searchParams.get('QLTY_KEY');

    const [currentQUALITY_KEY, setCurrentQUALITY_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        QLTY_KEY: '',
        QLTY_NAME: '',
        QLTY_ABRV: '',
        QLTYGRP_KEY: '',
        TARGET_SALE: '',
        QLTY_LST_CODE: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const QLTY_KEYRef = useRef(null);
    const QLTY_NAMERef = useRef(null);
    const QLTY_ABRVRef = useRef(null);
    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentQUALITY_KEY ? FORM_MODE.read : FORM_MODE.add
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
    const fetchRetriveData = useCallback(async (currentQUALITY_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('QUALITY/RetriveQUALITY', {
                "FLAG": flag,
                "TBLNAME": "QUALITY",
                "FLDNAME": "QLTY_KEY",
                "ID": currentQUALITY_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const qualityData = DATA[0];
                setForm({
                    QLTY_KEY: qualityData.QLTY_KEY,
                    QLTY_NAME: qualityData.QLTY_NAME,
                    QLTY_ABRV: qualityData.QLTY_ABRV || '',
                    QLTYGRP_KEY: qualityData.QLTYGRP_KEY || '',
                    TARGET_SALE: qualityData.TARGET_SALE || '',
                    SERIES: qualityData.SERIES || '',
                    QLTY_LST_CODE: qualityData.QLTY_LST_CODE || '',
                    Status: qualityData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentQUALITY_KEY(qualityData.QLTY_KEY);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentQUALITY_KEY}`);
                    setForm({
                        QLTY_KEY: '',
                        QLTY_NAME: '',
                        QLTY_ABRV: '',
                        QLTYGRP_KEY: '',
                        TARGET_SALE: '',
                        SERIES: '',
                        QLTY_LST_CODE: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID])

    useEffect(() => {
        if (QLTY_KEY) {
            setCurrentQUALITY_KEY(QLTY_KEY);
            fetchRetriveData(QLTY_KEY);
            setMode(FORM_MODE.read);
        } else {
            setForm({
                SearchByCd: '',
                SERIES: '',
                QLTY_KEY: '',
                QLTY_NAME: '',
                QLTY_ABRV: '',
                QLTYGRP_KEY: '',
                TARGET_SALE: '',
                QLTY_LST_CODE: '',
                Status: "1",
            })
            setMode(FORM_MODE.read);
        }
        setMode(FORM_MODE.read);
    }, [QLTY_KEY, fetchRetriveData]);
    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            let url;
            if (mode === FORM_MODE.edit && currentQUALITY_KEY) {
                url = `QUALITY/UpdateQUALITY?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `QUALITY/InsertQUALITY?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                "QLTY_KEY": form.QLTY_KEY,
                "QLTY_NAME": form.QLTY_NAME,
                "QLTY_ABRV": form.QLTY_ABRV,
                QLTYGRP_KEY: form.QLTYGRP_KEY,
                TARGET_SALE: form.TARGET_SALE,
                "QLTYGRP_KEY": form.QLTYGRP_KEY || "",
                "TARGET_SALE": form.TARGET_SALE,
                STATUS: form.Status ? "1" : "0",
            };
            let response;
            if (mode == FORM_MODE.edit && currentQUALITY_KEY) {
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
                        QLTY_KEY: '',
                        QLTY_NAME: '',
                        QLTY_ABRV: '',
                        QLTYGRP_KEY: '',
                        TARGET_SALE: '',
                        SERIES: '',
                        QLTY_LST_CODE: '',
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
            await fetchRetriveData(currentQUALITY_KEY, "R");
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
                "MODULENAME": "QUALITY",
                "TBLNAME": "QUALITY",
                "FLDNAME": "QLTY_KEY",
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
                    QLTY_KEY: id,
                    QLTY_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    QLTY_KEY: '',
                    QLTY_LST_CODE: ''
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
                QLTY_KEY: '',
                QLTY_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    }
    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentQUALITY_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            QLTY_NAME: '',
            QLTY_ABRV: '',
            QLTYGRP_KEY: '',
            TARGET_SALE: '',
            SearchByCd: '',
            Status: '1',
        }));

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "QUALITY",
                "TBLNAME": "QUALITY",
                "FLDNAME": "QLTY_KEY",
                "NCOLLEN": 0,
                "CPREFIX": "",
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 43,
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
                "MODULENAME": "QUALITY",
                "TBLNAME": "QUALITY",
                "FLDNAME": "QLTY_KEY",
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
                    QLTY_KEY: id,
                    QLTY_LST_CODE: lastId
                }));
            }
        } catch (error) {
            console.error("Error fetching ID and LASTID:", error);
        }
    };
    const handlePrevious = async () => {
        await fetchRetriveData(currentQUALITY_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleNext = async () => {
        if (currentQUALITY_KEY) {
            await fetchRetriveData(currentQUALITY_KEY, "N");
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
            const response = await axiosInstance.post(`QUALITY/DeleteQUALITY?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                QLTY_KEY: form.QLTY_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentQUALITY_KEY, 'P');
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
;
    const handlePrint = async () => {
        try {
            const response = await axiosInstance.post(`QUALITY/GetQUALITYDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response; // Extract DATA
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));

                // Generate the PDF blob
                const asPdf = pdf(<PrintQtDt rows={formattedData} />);
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


    const handleExit = () => { router.push("/masters/products/quality/qualitytable") };
  const Buttonsx = {
    backgroundColor: '#39ace2',
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 27 },
    // "&:disabled": {
    //   backgroundColor: "rgba(0, 0, 0, 0.12)",
    //   color: "rgba(0, 0, 0, 0.26)",
    //   boxShadow: "none",
    // }
  };
    return (
        <>
            <Box sx={{ width: '100%', justifyContent: 'center', alignItems: 'flex-start', padding: '24px', boxSizing: 'border-box', marginTop: { xs: "30px", sm: "0px" } }}
                className="form-container">
                <ToastContainer />
                <Box sx={{ maxWidth: '1000px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }} className="form_grid" >
                    <Grid container alignItems="center"
                        justifyContent="space-between" spacing={2} sx={{ marginTop: "30px", marginInline: '20px' }}>
                        <Grid sx={{
                            display: 'flex', justifyContent: {
                                xs: 'center',
                                sm: 'flex-start'
                            },
                            width: { xs: '100%', sm: 'auto' },
                        }}>
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" size="small" className="three-d-button-previous"
                                    sx={Buttonsx}
                                    onClick={handlePrevious}
                                    disabled={
                                        mode !== FORM_MODE.read || !currentQUALITY_KEY || currentQUALITY_KEY === 1
                                    }
                                >
                                    <KeyboardArrowLeftIcon />
                                </Button>
                                <Button variant="contained" size="small" className="three-d-button-next"
                                          sx={Buttonsx}
                                    onClick={handleNext}
                                    disabled={mode !== FORM_MODE.read || !currentQUALITY_KEY}
                                >
                                    <NavigateNextIcon />
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography align="center" variant="h5">
                                Base/Quality Master
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
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 1.5, sm: 1.5, md: 2 },
                            marginInline: { xs: '5%', sm: '10%', md: '25%' },
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
                                value={form.QLTY_LST_CODE}
                                onChange={(e) => setForm({ ...form, QLTY_LST_CODE: e.target.value })}
                            />
                            <TextField
                                label="Code"
                                inputRef={QLTY_KEYRef}
                                sx={{
                                    width: { xs: '100%', sm: '48%', md: '32%' }
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.QLTY_KEY}
                                onChange={(e) => setForm({ ...form, QLTY_KEY: e.target.value })}
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
                                inputRef={QLTY_NAMERef}
                                label="Name"
                                sx={{
                                    width: '100%'
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.QLTY_NAME}
                                onChange={(e) => setForm({ ...form, QLTY_NAME: e.target.value })}
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
                                label="Abbreviation"
                                inputRef={QLTY_ABRVRef}
                                sx={{
                                    width: { xs: '100%', sm: '40%', md: '30%' }
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.QLTY_ABRV}
                                onChange={(e) => setForm({ ...form, QLTY_ABRV: e.target.value })}
                            />
                            <TextField
                                label="Target Sale"
                                sx={{
                                    width: { xs: '100%', sm: '40%', md: '30%' }
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.TARGET_SALE}
                                onChange={(e) => setForm({ ...form, TARGET_SALE: e.target.value })}
                            />


                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1.5, md: 2 },
                            }}
                        >
                            <CustomAutocomplete
                                id="quallity-grp-autocomplete"
                                disabled={true}
                                label="Quality Group"
                                name="QLTYGRP_KEY "
                                // options={termsTypeOptions}
                                value={form.QLTYGRP_KEY}
                                onChange={(value) => setForm({ ...form, QLTYGRP_KEY: value })}
                                sx={{ width: { xs: '100%', sm: '48%', md: '100%' } }}
                            />
                        </Box>
                        <Box><FormControlLabel
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
                        /></Box>
                    </Box>

                    <Grid
                        item
                        xs={12}
                        className="form_button"
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', sm: 'flex-end' },
                            gap: { xs: 1, sm: 1.5 },
                            padding: { xs: 1, sm: 2, md: 3 },
                        }}
                    >
                        {mode === FORM_MODE.read && (
                            <>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: { xs: 0, sm: 1 },
                                        mb: { xs: 1, sm: 0 },
                                        background: "linear-gradient(290deg, #d4d4d4, #ffffff)",
                                        minWidth: { xs: 100, sm: 100 },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    }}
                                    onClick={handleAdd}
                                    disabled
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: { xs: 0, sm: 1 },
                                        mb: { xs: 1, sm: 0 },
                                        background: "linear-gradient(290deg, #a7c5e9, #ffffff)",
                                        minWidth: { xs: 100, sm: 100 },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: { xs: 0, sm: 1 },
                                        mb: { xs: 1, sm: 0 },
                                        background: "linear-gradient(290deg, #b9d0e9, #e9f2fa)",
                                        minWidth: { xs: 100, sm: 100 },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: { xs: 0, sm: 1 },
                                        mb: { xs: 1, sm: 0 },
                                        background: "linear-gradient(290deg, #b9d0e9, #e9f2fa)",
                                        minWidth: { xs: 100, sm: 100 },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    }}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
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
export default QualityMst