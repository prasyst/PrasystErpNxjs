'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getFormMode } from '@/lib/helpers';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CrudButton from '@/GlobalFunction/CrudButton';
import { TbListSearch } from "react-icons/tb";
import CustomAutocomplete from '@/GlobalFunction/CustomAutoComplete/CustomAutoComplete';
import PrintWebDt from './PrintWebDt';
import { useSearchParams } from 'next/navigation';
import ConfirmDelDialog from '@/GlobalFunction/ConfirmDelDialog';

const FORM_MODE = getFormMode();
const WebMst = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const WEBCOLLECTION_KEY = searchParams.get('WEBCOLLECTION_KEY');
    const [currentWeb_KEY, setCurrentWeb_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        WEBCOLLECTION_KEY: '',
        WEBCOLLECTIONCAT_KEY: '',
        WEBCOLLECTION_NAME: '',
        WEBCOLLECTION_ABRV: '',
        WEBCOLLECTION_LST_CODE: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const WEBCOLLECTION_KEYRef = useRef(null);
    const WEBCOLLECTION_NAMERef = useRef(null);
    const WEBCOLLECTION_ABRVRef = useRef(null);
    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentWeb_KEY ? FORM_MODE.read : FORM_MODE.add
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

    const fetchRetriveData = useCallback(async (currentWeb_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('WEBCOLLECTION/RetriveWEBCOLLECTION', {
                "FLAG": flag,
                "TBLNAME": "WEBCOLLECTION",
                "FLDNAME": "WEBCOLLECTION_KEY",
                "ID": currentWeb_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const webData = DATA[0];
                setForm({
                    WEBCOLLECTION_KEY: webData.WEBCOLLECTION_KEY,
                    WEBCOLLECTION_NAME: webData.WEBCOLLECTION_NAME,
                    WEBCOLLECTIONCAT_KEY: webData.WEBCOLLECTIONCAT_KEY,
                    WEBCOLLECTION_ABRV: webData.WEBCOLLECTION_ABRV || '',
                    SERIES: webData.SERIES || '',
                    WEBCOLLECTION_LST_CODE: webData.WEBCOLLECTION_LST_CODE || '',
                    Status: webData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentWeb_KEY(webData.WEBCOLLECTION_KEY);

                const newParams = new URLSearchParams();
                newParams.set("WEBCOLLECTION_KEY", categoryData.WEBCOLLECTION_KEY);
                router.replace(`/masters/products/webcollection?${newParams.toString()}`);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentWeb_KEY}`);
                    setForm({
                        WEBCOLLECTION_KEY: '',
                        WEBCOLLECTION_NAME: '',
                        WEBCOLLECTIONCAT_KEY: '',
                        WEBCOLLECTION_ABRV: '',
                        SERIES: '',
                        WEBCOLLECTION_LST_CODE: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID, router]);

    useEffect(() => {
        if (WEBCOLLECTION_KEY) {
            setCurrentWeb_KEY(WEBCOLLECTION_KEY);
            fetchRetriveData(WEBCOLLECTION_KEY);
            setMode(FORM_MODE.read);
        } else {
            setForm({
                SearchByCd: '',
                SERIES: '',
                WEBCOLLECTION_KEY: '',
                WEBCOLLECTION_NAME: '',
                WEBCOLLECTIONCAT_KEY: '',
                WEBCOLLECTION_ABRV: '',
                WEBCOLLECTION_LST_CODE: '',
                Status: "1",
            })
            setMode(FORM_MODE.read);
        }
        setMode(FORM_MODE.read);
    }, [WEBCOLLECTION_KEY, fetchRetriveData]);

    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            let url;
            if (mode === FORM_MODE.edit && currentWeb_KEY) {
                url = `WEBCOLLECTION/UpdateWEBCOLLECTION?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `WEBCOLLECTION/InsertWEBCOLLECTION?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                WEBCOLLECTION_KEY: form.WEBCOLLECTION_KEY,
                WEBCOLLECTION_NAME: form.WEBCOLLECTION_NAME,
                WEBCOLLECTION_ABRV: form.WEBCOLLECTION_ABRV,
                WEBCOLLECTIONCAT_KEY: form.WEBCOLLECTIONCAT_KEY,
                WEBCOLLECTIONCAT_KEY: form.WEBCOLLECTIONCAT_KEY || "",
                STATUS: form.Status ? "1" : "0",
            };
            let response;
            if (mode == FORM_MODE.edit && currentWeb_KEY) {
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
                        WEBCOLLECTION_KEY: '',
                        WEBCOLLECTION_NAME: '',
                        WEBCOLLECTION_ABRV: '',
                        WEBCOLLECTIONCAT_KEY: '',
                        SERIES: '',
                        WEBCOLLECTION_LST_CODE: '',
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
            await fetchRetriveData(currentWeb_KEY, "R");
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
                "MODULENAME": "WEBCOLLECTION",
                "TBLNAME": "WEBCOLLECTION",
                "FLDNAME": "WEBCOLLECTION_KEY",
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
                    WEBCOLLECTION_KEY: id,
                    WEBCOLLECTION_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    WEBCOLLECTION_KEY: '',
                    WEBCOLLECTION_LST_CODE: ''
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
                WEBCOLLECTION_KEY: '',
                WEBCOLLECTION_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    };

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentWeb_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            WEBCOLLECTION_NAME: '',
            WEBCOLLECTION_ABRV: '',
            WEBCOLLECTIONCAT_KEY: '',
            SearchByCd: '',
            Status: '1',
        }));

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "WEBCOLLECTION",
                "TBLNAME": "WEBCOLLECTION",
                "FLDNAME": "WEBCOLLECTION_KEY",
                "NCOLLEN": 0,
                "CPREFIX": "",
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 8,
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
                "MODULENAME": "WEBCOLLECTION",
                "TBLNAME": "WEBCOLLECTION",
                "FLDNAME": "WEBCOLLECTION_KEY",
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
                    WEBCOLLECTION_KEY: id,
                    WEBCOLLECTION_LST_CODE: lastId
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
        await fetchRetriveData(currentWeb_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

    const handleNext = async () => {
        if (currentWeb_KEY) {
            await fetchRetriveData(currentWeb_KEY, "N");
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
            const response = await axiosInstance.post(`WEBCOLLECTION/DeleteWEBCOLLECTION?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                WEBCOLLECTION_KEY: form.WEBCOLLECTION_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentWeb_KEY, 'P');
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
            const response = await axiosInstance.post(
                `WEBCOLLECTION/GetWEBCOLLECTIONDashBoard?currentPage=1&limit=5000`,
                { SearchText: "" }
            );

            const { data: { STATUS, DATA } } = response;

            if (STATUS === 0 && Array.isArray(DATA)) {
                PrintWebDt(DATA);
            }
        } catch (error) {
            console.error("Print Error:", error);
        }
    };

    const handleExit = () => {
        router.push('/masterpage?activeTab=products');
    };

    const handleTable = () => {
        router.push("/masters/products/webcollection/webtable");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const Buttonsx = {
        backgroundColor: '#39ace2',
        margin: { xs: '0 4px', sm: '0 6px' },
        minWidth: { xs: 40, sm: 46, md: 60 },
        height: { xs: 40, sm: 46, md: 27 },
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
            backgroundColor: '#fafafa',
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

    const DropInputSx = {
        '& .MuiInputBase-root': {
            height: 36,
            fontSize: '14px',
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            top: '-4px',
        },
        '& .MuiFilledInput-root': {
            backgroundColor: '#fafafa',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            overflow: 'hidden',
            height: 36,
            fontSize: '14px',
            paddingRight: '36px',
        },
        '& .MuiFilledInput-root:before': {
            display: 'none',
        },
        '& .MuiFilledInput-root:after': {
            display: 'none',
        },
        '& .MuiInputBase-input': {
            padding: '10px 12px',
            fontSize: '14px',
            lineHeight: '1.4',
        },
        '& .MuiAutocomplete-endAdornment': {
            top: '50%',
            transform: 'translateY(-50%)',
            right: '10px',
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
                        Web Collection Master
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
                            onAdd={handleAdd}
                            onEdit={handleEdit}
                            onView={handlePrint}
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
                            value={form.WEBCOLLECTION_LST_CODE}
                            name="WEBCOLLECTION_LST_CODE"
                            disabled={true}
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
                            inputRef={WEBCOLLECTION_KEYRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.WEBCOLLECTION_KEY}
                            name="WEBCOLLECTION_KEY"
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
                        <CustomAutocomplete
                            id="webcollection-key-autocomplete"
                            disabled={true}
                            label="Category"
                            name="WEBCOLLECTIONCAT_KEY"
                            value={form.WEBCOLLECTIONCAT_KEY}
                            onChange={(value) => setForm({ ...form, WEBCOLLECTIONCAT_KEY: value })}
                            className="custom-textfield"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Name"
                            inputRef={WEBCOLLECTION_NAMERef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.WEBCOLLECTION_NAME}
                            name="WEBCOLLECTION_NAME"
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
                            label="Full Name"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.WEBCOLLECTION_FullNAME}
                            name="WEBCOLLECTION_FullNAME"
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
                            inputRef={WEBCOLLECTION_ABRVRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.WEBCOLLECTION_ABRV}
                            name="WEBCOLLECTION_ABRV"
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

                    <Grid size={{ xs: 12, sm: 6, md: 9 }}></Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }} display="flex" justifyContent="end">
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
export default WebMst;
