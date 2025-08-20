'use client'
import React, { useEffect, useRef, useState ,useCallback} from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getFormMode } from '@/lib/helpers';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import CustomAutocomplete from '@/GlobalFunction/CustomAutoComplete/CustomAutoComplete';
import PrintWebDt from './PrintWebDt';
import { useSearchParams } from 'next/navigation';
import CrudButtons from '@/GlobalFunction/CrudButtons';
import PaginationButtons from '@/GlobalFunction/PaginationButtons';

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

                                   // ✅ Update URL
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
    },[CO_ID,router]);
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
    }, [WEBCOLLECTION_KEY,fetchRetriveData]);
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
    }
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
    const handleFirst =()=>{}
    const handleLast =async()=>{
       await fetchRetriveData(1, "L");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));  
    }
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
    }
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
        router.push('/masters/products/webcollection/webtable');
    };
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
                        justifyContent="space-between" spacing={2} sx={{ marginTop: "10px", marginInline: '20px' }}>             
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography align="center" variant="h5">
                                Web Collection Master
                            </Typography>
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
                                value={form.WEBCOLLECTION_LST_CODE}
                                onChange={(e) => setForm({ ...form, WEBCOLLECTION_LST_CODE: e.target.value })}
                            />
                            <TextField
                                label="Code"
                                inputRef={WEBCOLLECTION_KEYRef}
                                sx={{
                                    width: { xs: '100%', sm: '48%', md: '32%' }
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.WEBCOLLECTION_KEY}
                                onChange={(e) => setForm({ ...form, WEBCOLLECTION_KEY: e.target.value })}
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
                                id="webcollection-key-autocomplete"
                                disabled={true}
                                label="Category"
                                name="WEBCOLLECTIONCAT_KEY"
                                // options={termsTypeOptions}
                                value={form.WEBCOLLECTIONCAT_KEY}
                                onChange={(value) => setForm({ ...form, WEBCOLLECTIONCAT_KEY: value })}
                                sx={{ width: { xs: '100%', sm: '48%', md: '50%' } }}
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
                                inputRef={WEBCOLLECTION_NAMERef}
                                label="Name"
                                sx={{
                                    width: '100%'
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.WEBCOLLECTION_NAME}
                                onChange={(e) => setForm({ ...form, WEBCOLLECTION_NAME: e.target.value })}
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
                                label="Full Name"
                                sx={{
                                    width: '100%'
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.WEBCOLLECTION_FullNAME}
                                onChange={(e) => setForm({ ...form, WEBCOLLECTION_FullNAME: e.target.value })}
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
                                inputRef={WEBCOLLECTION_ABRVRef}
                                sx={{
                                    width: { xs: '100%', sm: '40%', md: '30%' }
                                }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.WEBCOLLECTION_ABRV}
                                onChange={(e) => setForm({ ...form, WEBCOLLECTION_ABRV: e.target.value })}
                            />
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
                        </Box>
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
                                    currentKey={currentWeb_KEY}
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
                    {/* <Grid
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
                    </Grid> */}
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
export default WebMst;
