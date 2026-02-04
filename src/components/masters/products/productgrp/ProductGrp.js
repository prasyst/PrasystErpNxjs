'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Paper
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

const FORM_MODE = getFormMode();

const categoryFormSchema = z.object({
    FGCAT_NAME: z.string().min(1, "Category Name is required"),
});

const textInputSx = {
    '& .MuiInputBase-root': {
        height: 42,
        fontSize: '14px',
    },
    '& .MuiInputLabel-root': {
        fontSize: '14px',
        top: '-8px',
    },
    '& .MuiFilledInput-root': {
        backgroundColor: '#fafafa',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        overflow: 'hidden',
        height: 42,
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

const ProductGrp = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const PRODGRP_KEY = searchParams.get('PRODGRP_KEY');
    const [currentPRODGRP_KEY, setCurrentPRODGRP_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        PRODGRP_CODE: '',
        PRODGRP_KEY: '',
        PRODGRP_NAME: '',
        PRODGRP_ABRV: '',
        ProdGrp_LST_CODE: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const contentRef = useRef(null);
    const PRODGRP_KEYRef = useRef(null);
    const ProdGrp_NAMERef = useRef(null);
    const PRODGRP_ABRVRef = useRef(null);
    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentPRODGRP_KEY ? FORM_MODE.read : FORM_MODE.add
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

    const fetchRetriveData = useCallback(async (currentPRODGRP_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('ProdGrp/RetriveProdGrp', {
                FLAG: flag,
                TBLNAME: "ProdGrp",
                FLDNAME: "PRODGRP_KEY",
                ID: currentPRODGRP_KEY,
                ORDERBYFLD: "",
                CWHAER: "",
                CO_ID: CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const categoryData = DATA[0];
                setForm({
                    PRODGRP_KEY: categoryData.PRODGRP_KEY,
                    PRODGRP_NAME: categoryData.PRODGRP_NAME,
                    PRODGRP_ABRV: categoryData.PRODGRP_ABRV || '',
                    PRODGRP_CODE: categoryData.PRODGRP_CODE || '',
                    SERIES: categoryData.SERIES || '',
                    ProdGrp_LST_CODE: categoryData.ProdGrp_LST_CODE || '',
                    Status: categoryData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentPRODGRP_KEY(categoryData.PRODGRP_KEY);

                const newParams = new URLSearchParams();
                newParams.set("PRODGRP_KEY", categoryData.PRODGRP_KEY);
                router.replace(`/masters/products/productgrp?${newParams.toString()}`);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentPRODGRP_KEY}`);
                    setForm({
                        PRODGRP_KEY: '',
                        PRODGRP_NAME: '',
                        PRODGRP_ABRV: '',
                        PRODGRP_CODE: '',
                        SERIES: '',
                        ProdGrp_LST_CODE: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID, router])

    useEffect(() => {
        if (PRODGRP_KEY) {
            setCurrentPRODGRP_KEY(PRODGRP_KEY);
            fetchRetriveData(PRODGRP_KEY);
            setMode(FORM_MODE.read);
        } else {
            setForm({
                SearchByCd: '',
                SERIES: '',
                PRODGRP_CODE: '',
                PRODGRP_KEY: '',
                PRODGRP_NAME: '',
                PRODGRP_ABRV: '',
                ProdGrp_LST_CODE: '',
                Status: FORM_MODE.add ? "1" : "0",
            })
            setMode(FORM_MODE.read);
        }
        setMode(FORM_MODE.read);
    }, [PRODGRP_KEY, fetchRetriveData]);

    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;

            let url;

            if (mode === FORM_MODE.edit && currentPRODGRP_KEY) {
                url = `ProdGrp/UpdateProdGrp?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `ProdGrp/InsertProdGrp?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                PRODGRP_KEY: form.PRODGRP_KEY,
                PRODGRP_CODE: form.PRODGRP_CODE,
                PRODGRP_NAME: form.PRODGRP_NAME,
                PRODGRP_ABRV: form.PRODGRP_ABRV,
                STATUS: form.Status ? "1" : "0",
            };

            let response;
            if (mode == FORM_MODE.edit && currentPRODGRP_KEY) {
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
                        PRODGRP_KEY: '',
                        PRODGRP_NAME: '',
                        PRODGRP_ABRV: '',
                        SR_CODE: '',
                        SEGMENT_KEY: '',
                        PRODGRP_CODE: '',
                        SERIES: '',
                        ProdGrp_LST_CODE: '',
                        Status: 0,
                    });
                    setMode(FORM_MODE.read);
                    toast.success(MESSAGE, { autoClose: 1000 });
                } else {
                    toast.error(MESSAGE, { autoClose: 1000 });
                }
            }
        } catch (error) {
            toast.error("Submit Error:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = async () => {
        if (mode === FORM_MODE.add) {
            await fetchRetriveData(1, "L");
        } else {
            await fetchRetriveData(currentPRODGRP_KEY, "R");
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
                MODULENAME: "ProdGrp",
                TBLNAME: "ProdGrp",
                FLDNAME: "ProdGrp_KEY",
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
                    PRODGRP_KEY: id,
                    ProdGrp_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    PRODGRP_KEY: '',
                    ProdGrp_LST_CODE: ''
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
                PRODGRP_KEY: '',
                ProdGrp_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    };

    const handleTable = () => {
        router.push("/masters/products/productgrp/prdgrptable/");
    };

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentPRODGRP_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            PRODGRP_NAME: '',
            PRODGRP_ABRV: '',
            SearchByCd: '',
            PRODGRP_CODE: '',
            Status: '1',
        }));

        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                MODULENAME: "ProdGrp",
                TBLNAME: "ProdGrp",
                FLDNAME: "PRODGRP_KEY",
                NCOLLEN: 0,
                CPREFIX: "",
                COBR_ID: COBR_ID,
                FCYR_KEY: FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 162,
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
                "MODULENAME": "ProdGrp",
                "TBLNAME": "ProdGrp",
                "FLDNAME": "PRODGRP_KEY",
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
                    PRODGRP_KEY: id,
                    ProdGrp_LST_CODE: lastId
                }));
            }
        } catch (error) {
            console.error("Error fetching ID and LASTID:", error);
        }
    };

    const handleFirst = async () => { }
    const handleLast = async () => {
        await fetchRetriveData(1, "L");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

    const handlePrevious = async () => {
        await fetchRetriveData(currentPRODGRP_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

    const handleNext = async () => {
        if (currentPRODGRP_KEY) {
            await fetchRetriveData(currentPRODGRP_KEY, "N");
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
            const response = await axiosInstance.post(`ProdGrp/DeleteProdGrp?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                PRODGRP_KEY: form.PRODGRP_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentPRODGRP_KEY, 'P');
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
            const response = await axiosInstance.post(`/ProdGrp/GetProdGrpDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));

                const asPdf = pdf(<PrintPrdGrpDt rows={formattedData} />);
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

    const handleExit = () => { router.push("/masterpage?activeTab=products") };

    return (
        <>
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

                <Grid container spacing={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '15%', xl: '5%' },
                    }}
                >
                    <Grid>
                        <Typography align="center" variant="h6">
                            Product Group Master
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
                                moduleName="QC Group"
                                mode={mode}
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
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                                        padding: '6px 8px',
                                        fontSize: '12px',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label="Last Cd"
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.PRODGRP_KEY}
                                name="FGPRD_LST_CODE"
                                disabled={true}
                                sx={textInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 8px',
                                        fontSize: '12px',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label="Code"
                                inputRef={PRODGRP_KEYRef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.PRODGRP_CODE}
                                name="PRODGRP_KEY"
                                disabled={mode === FORM_MODE.read}
                                sx={textInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 8px',
                                        fontSize: '12px',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label={<span>Product Name<span style={{ color: "red" }}>*</span></span>}
                                inputRef={ProdGrp_NAMERef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.PRODGRP_NAME}
                                name="PRODGRP_NAME"
                                disabled={mode === FORM_MODE.read}
                                sx={textInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 8px',
                                        fontSize: '12px',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label="Abbreviation"
                                inputRef={PRODGRP_ABRVRef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.PRODGRP_ABRV}
                                name="PRODGRP_ABRV"
                                disabled={mode === FORM_MODE.read}
                                sx={textInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 8px',
                                        fontSize: '12px',
                                    },
                                }}
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
                                                color: '#39ace2',
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
                            Are you sure you want to delete this product group?
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
        </>
    );
};
export default ProductGrp;
