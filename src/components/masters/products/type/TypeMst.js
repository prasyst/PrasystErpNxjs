'use client'
import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Grid,
    TextField,
    Typography,
    Button,
    Stack,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getFormMode } from '@/lib/helpers';
import CrudButton from '@/GlobalFunction/CrudButton';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import { pdf } from '@react-pdf/renderer';
import PrintTypeData from './PrintTypeData';
const FORM_MODE = getFormMode();

const TypeMst = () => {
    const router = useRouter();
    const [currentFGTYPE_KEY, setCurrentFGTYPE_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        FGTYPE_CODE: '',
        FGTYPE_KEY: '',  
        FGTYPE_NAME: '',  
        FGTYPE_ABRV: '',
        FGTYPE_LST_CODE: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const contentRef = useRef(null);
    const FGTYPE_KEYRef = useRef(null);
    const FGTYPE_NAMERef = useRef(null);
    const FGTYPE_ABRVRef = useRef(null);
    const FGTYPE_CODERef = useRef(null);
    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentFGTYPE_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    // const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    // const CO_ID = localStorage.getItem('CO_ID');
    // const userRole = localStorage.getItem('userRole');
    // const username = localStorage.getItem('USER_NAME');
    // const PARTY_KEY = localStorage.getItem('PARTY_KEY');
    // const COBR_ID = localStorage.getItem('COBR_ID');

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };

    const fetchRetriveData = async (currentFGTYPE_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('Fgtype/RetriveFGTYPE', {
                "FLAG": flag,
                "TBLNAME": "FGTYPE",
                "FLDNAME": "FGTYPE_KEY",
                "ID": currentFGTYPE_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": ""
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const categoryData = DATA[0];
                setForm({
                    FGTYPE_KEY: categoryData.FGTYPE_KEY,
                    FGTYPE_NAME: categoryData.FGTYPE_NAME,
                    FGTYPE_ABRV: categoryData.FGTYPE_ABRV || '',
                    FGTYPE_CODE: categoryData.FGTYPE_CODE || '',
                    SERIES: categoryData.SERIES || '',
                    FGTYPE_LST_CODE: categoryData.FGTYPE_LST_CODE || '',
                    Status: categoryData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentFGTYPE_KEY(categoryData.FGTYPE_KEY);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentFGTYPE_KEY}`);
                    setForm({
                        FGTYPE_KEY: '',
                        FGTYPE_NAME: '',
                        FGTYPE_ABRV: '',
                        FGTYPE_CODE: '',
                        SERIES: '',
                        FGTYPE_LST_CODE: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };


    // useEffect(() => {
    //     if (location.state && location.state.FGTYPE_KEY) {
    //         setCurrentFGTYPE_KEY(location.state.FGTYPE_KEY);

    //         fetchRetriveData(location.state.FGTYPE_KEY);
    //         setMode(FORM_MODE.read);
    //     } else {
    //         setForm({
    //             SearchByCd: '',
    //             SERIES: '',
    //             FGTYPE_CODE: '',
    //             FGTYPE_KEY: '',  //CODE
    //             FGTYPE_NAME: '',  //CATEGORY NAME
    //             FGTYPE_ABRV: '',
    //             FGTYPE_LST_CODE: '',
    //             Status: "1",
    //         });
    //         setMode(FORM_MODE.read);
    //     }
    // }, [location]);


    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;

            let url;

            if (mode === FORM_MODE.edit && currentFGTYPE_KEY) {
                url = `Fgtype/UpdateFGTYPE?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `Fgtype/InsertFGTYPE?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                FGTYPE_KEY: form.FGTYPE_KEY,  //CODE
                FGTYPE_CODE: form.FGTYPE_CODE, //ALT CODE
                FGTYPE_NAME: form.FGTYPE_NAME, //TYPE NAME
                FGTYPE_ABRV: form.FGTYPE_ABRV,
                STATUS: form.Status ? "1" : "0",
            };

            let response;

            if (mode == FORM_MODE.edit && currentFGTYPE_KEY) {
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
                        FGTYPE_KEY: '',
                        FGTYPE_NAME: '',
                        FGTYPE_ABRV: '',
                        FGTYPE_CODE: '',
                        SERIES: '',
                        FGTYPE_LST_CODE: '',
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
            await fetchRetriveData(currentFGTYPE_KEY, "R");
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
                "MODULENAME": "FGTYPE",
                "TBLNAME": "FGTYPE",
                "FLDNAME": "FGTYPE_KEY",
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
                    FGTYPE_KEY: id,
                    FGTYPE_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    FGTYPE_KEY: '',
                    FGTYPE_LST_CODE: ''
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
                FGTYPE_KEY: '',
                FGTYPE_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    }

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentFGTYPE_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            FGTYPE_NAME: '',
            FGTYPE_ABRV: '',
            SearchByCd: '',
            FGTYPE_CODE: '',
            Status: '1',
        }));

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "FGTYPE",
                "TBLNAME": "FGTYPE",
                "FLDNAME": "FGTYPE_KEY",
                "NCOLLEN": 0,
                "CPREFIX": "",
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 28,
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
                "MODULENAME": "FGTYPE",
                "TBLNAME": "FGTYPE",
                "FLDNAME": "FGTYPE_KEY",
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
                    FGTYPE_KEY: id,
                    FGTYPE_LST_CODE: lastId
                }));
            }
        } catch (error) {
            console.error("Error fetching ID and LASTID:", error);
        }
    };
    const handlePrevious = async () => {
        await fetchRetriveData(currentFGTYPE_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleNext = async () => {
        if (currentFGTYPE_KEY) {
            await fetchRetriveData(currentFGTYPE_KEY, "N");
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
            const response = await axiosInstance.post(`Fgtype/DeleteFGTYPE?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                "FGTYPE_KEY": form.FGTYPE_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentFGTYPE_KEY, 'P');
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
            const response = await axiosInstance.post(`/Fgtype/GetFGTYPEDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response; // Extract DATA
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));
    
                // Generate the PDF blob
                const asPdf = pdf(<PrintTypeData rows={formattedData} />);
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

    const handleExit = () => { 
            router.push('/masters');
     };

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '24px',
                    boxSizing: 'border-box',
                    marginTop: { xs: "30px", sm: "0px" }
                }}
                className="form-container"
            >
                <ToastContainer />
                <Box
                    sx={{
                        maxWidth: '1000px',
                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    className="form_grid"
                >
                    {/* Header Section */}
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
                                    sx={{
                                        backgroundColor: "#635BFF"
                                    }}
                                    onClick={handlePrevious}
                                    disabled={
                                        mode !== FORM_MODE.read || !currentFGTYPE_KEY || currentFGTYPE_KEY === 1
                                    }
                                >
                                    <KeyboardArrowLeftIcon />
                                </Button>
                                <Button variant="contained" size="small" className="three-d-button-next"
                                    sx={{
                                        backgroundColor: "#635BFF"
                                    }}
                                    onClick={handleNext}
                                    disabled={mode !== FORM_MODE.read || !currentFGTYPE_KEY}
                                >
                                    <NavigateNextIcon />
                                </Button>
                            </Stack>
                        </Grid>

                        {/* Center Header */}
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography align="center" variant="h5">
                                Type Master
                            </Typography>
                        </Grid>

                        {/* Right Buttons */}
                        <Grid>
                            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
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

                    {/* Form Fields */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1.5, sm: 1.5, md: 2 },
                        marginInline: { xs: '5%', sm: '10%', md: '25%' },
                        marginBlock: { xs: '15px', sm: '20px', md: '30px' },
                    }}>
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

                                }}
                                value={form.SearchByCd}
                                onChange={(e) => setForm({ ...form, SearchByCd: e.target.value })}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        fetchRetriveData(e.target.value, "R", true);
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                            justifyContent: 'space-between',
                            gap: { xs: 1, sm: 1, md: 1 },
                        }}>
                            <TextField
                                label="Series"
                                inputRef={SERIESRef}
                                sx={{ width: { xs: '100%', sm: '48%', md: '25%' } }}
                                disabled={mode === FORM_MODE.read}
                                fullWidth
                                className="custom-textfield"
                                value={form.SERIES}
                                onChange={(e) => handleManualSeriesChange(e.target.value)}
                            />
                            <TextField
                                label="Last Cd"
                                sx={{ width: { xs: '100%', sm: '48%', md: '25%' } }}
                                disabled={true}
                                fullWidth
                                className="custom-textfield"
                                value={form.FGTYPE_LST_CODE}
                                onChange={(e) => setForm({ ...form, FGTYPE_LST_CODE: e.target.value })}
                            />
                            <TextField
                                label="Code"
                                inputRef={FGTYPE_KEYRef}
                                sx={{ width: { xs: '100%', sm: '48%', md: '25%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.FGTYPE_KEY}
                                onChange={(e) => setForm({ ...form, FGTYPE_KEY: e.target.value })}
                            />
                            <TextField
                                label="Alt Code"
                                inputRef={FGTYPE_CODERef}
                                sx={{ width: { xs: '100%', sm: '48%', md: '25%' } }}
                                disabled={mode === FORM_MODE.read}
                                fullWidth
                                className="custom-textfield"
                                value={form.FGTYPE_CODE}
                                onChange={(e) => setForm({ ...form, FGTYPE_CODE: e.target.value })}
                            />

                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                            gap: { xs: 1, sm: 1.5, md: 2 },
                            alignItems: {
                                xs: 'stretch', sm:

                                    'center', md: 'center'
                            },
                        }}>

                            <TextField
                                inputRef={FGTYPE_NAMERef}
                                label={
                                    <span>
                                        Name<span style={{ color: "red" }}>*</span>
                                    </span>
                                }
                                sx={{ width: '100%' }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.FGTYPE_NAME}
                                onChange={(e) => setForm({ ...form, FGTYPE_NAME: e.target.value })}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                            gap: { xs: 1, sm: 1.5, md: 2 },
                            alignItems: {
                                xs: 'stretch', sm:

                                    'center', md: 'center'
                            },
                        }}>

                            <TextField
                                label="Abbreviation"
                                inputRef={FGTYPE_ABRVRef}
                                sx={{ width: { xs: '100%', sm: '40%', md: '30%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.FGTYPE_ABRV}
                                onChange={(e) => setForm({ ...form, FGTYPE_ABRV: e.target.value })}
                            />

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
                        </Box>
                    </Box>
                    {/* Submit / Cancel Buttons */}
                    <Grid item xs={12} className="form_button" sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', sm: 'flex-end' },
                        gap: { xs: 1, sm: 1.5 },
                        padding: { xs: 1, sm: 2, md: 3 },
                    }} >
                        {mode === FORM_MODE.read && (
                            <>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: 1,
                                        background: "linear-gradient(290deg, #d4d4d4, #ffffff)",
                                    }}
                                    onClick={handleAdd}
                                    disabled
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: 1,
                                        background: "linear-gradient(290deg, #a7c5e9, #ffffff)",
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
                                        mr: 1,
                                        background: "linear-gradient(290deg,   #b9d0e9, #e9f2fa)",
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: 1,
                                        background: "linear-gradient(290deg,   #b9d0e9, #e9f2fa)",
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
                <DialogTitle id="alert-dialog-title"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description"
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
                            "&:hover": {
                                backgroundColor: "#2199d6",
                                color: "white",
                            },
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
export default TypeMst;
