'use client'
import React, { useEffect, useRef, useState } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { getFormMode } from '@/lib/helpers';
import axiosInstance from '@/lib/axios';
import debounce from 'lodash.debounce';
import CrudButton from '@/GlobalFunction/CrudButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PrintBrData from './PrintBrData';
import { pdf } from '@react-pdf/renderer';

const FORM_MODE = getFormMode();
const BrandMst = () => {
    // const location = useLocation();
    // const navigate = useNavigate();
     const router = useRouter();
    const [currentBRAND_KEY, setCurrentBRAND_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        BRAND_CODE: '',
        BRAND_KEY: '',  //CODE
        BRAND_NAME: '',  //BRAND NAME
        BRAND_ABRV: '',
        Brand_LST_CODE: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const BRAND_KEYRef = useRef(null);
    const BRAND_NAMERef = useRef(null);
    const BRAND_ABRVRef = useRef(null);
    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentBRAND_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const [brandImage, setBrandImage] = useState(null);
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
    const fetchRetriveData = async (currentBRAND_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('Brand/RetriveBrand', {
                "FLAG": flag,
                "TBLNAME": "Brand",
                "FLDNAME": "Brand_KEY",
                "ID": currentBRAND_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const categoryData = DATA[0];
                setForm({
                    BRAND_KEY: categoryData.BRAND_KEY,
                    BRAND_NAME: categoryData.BRAND_NAME,
                    BRAND_ABRV: categoryData.BRAND_ABRV || '',
                    BRAND_CODE: categoryData.BRAND_CODE || '',
                    SERIES: categoryData.SERIES || '',
                    Brand_LST_CODE: categoryData.Brand_LST_CODE || '',
                    Status: categoryData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentBRAND_KEY(categoryData.BRAND_KEY);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentBRAND_KEY}`);
                    setForm({
                        BRAND_KEY: '',
                        BRAND_NAME: '',
                        BRAND_ABRV: '',
                        BRAND_CODE: '',
                        SERIES: '',
                        Brand_LST_CODE: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (location.state && location.state.BRAND_KEY) {
            setCurrentBRAND_KEY(location.state.BRAND_KEY);
            fetchRetriveData(location.state.BRAND_KEY);
            setMode(FORM_MODE.read);
            setBrandImage(null);
        } else {
            setForm({
                SearchByCd: '',
                SERIES: '',
                BRAND_CODE: '',
                BRAND_KEY: '',  //CODE
                BRAND_NAME: '',
                BRAND_ABRV: '',
                Brand_LST_CODE: '',
                Status: "1",
            })
            setMode(FORM_MODE.read);
            setBrandImage(null);
        }
    }, [location]);
    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            let url;
            if (mode === FORM_MODE.edit && currentBRAND_KEY) {
                url = `Brand/UpdateBrand?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `Brand/InsertBrand?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                Brand_KEY: form.BRAND_KEY,  //CODE
                Brand_CODE: form.BRAND_CODE, //ALT CODE
                Brand_NAME: form.BRAND_NAME, //BRAND NAME
                Brand_ABRV: form.BRAND_ABRV,
                STATUS: form.Status ? "1" : "0",
            };
            let response;
            if (mode == FORM_MODE.edit && currentBRAND_KEY) {
                payload.UPDATED_BY = 1;
                payload.UPDATED_DT = new Date().toISOString();
                response = await axiosInstance.post(url, payload);

                const { STATUS, MESSAGE } = response.data;
                if (STATUS === 0) {
                    setMode(FORM_MODE.read);
                    setBrandImage(null);
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
                        BRAND_KEY: '',
                        BRAND_NAME: '',
                        BRAND_ABRV: '',
                        BRAND_CODE: '',
                        SERIES: '',
                        Brand_LST_CODE: '',
                        Status: 0,
                    });
                    setMode(FORM_MODE.read);
                    setBrandImage(null);
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
            await fetchRetriveData(currentBRAND_KEY, "R");
        }
        setMode(FORM_MODE.read);
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
        setBrandImage(null);
    };
    const debouncedApiCall = debounce(async (newSeries) => {
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "Brand",
                "TBLNAME": "Brand",
                "FLDNAME": "Brand_KEY",
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
                    BRAND_KEY: id,
                    Brand_LST_CODE: lastId
                }));
                setBrandImage(null);
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    BRAND_KEY: '',
                    Brand_LST_CODE: ''
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
                BRAND_KEY: '',
                Brand_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    }
    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentBRAND_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            BRAND_NAME: '',
            BRAND_ABRV: '',
            SearchByCd: '',
            BRAND_CODE: '',
            Status: '1',
        }));

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "Brand",
                "TBLNAME": "Brand",
                "FLDNAME": "Brand_KEY",
                "NCOLLEN": 0,
                "CPREFIX": "",
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 95,
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
                "MODULENAME": "Brand",
                "TBLNAME": "Brand",
                "FLDNAME": "Brand_KEY",
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
                    BRAND_KEY: id,
                    Brand_LST_CODE: lastId
                }));
            }
        } catch (error) {
            console.error("Error fetching ID and LASTID:", error);
        }
    };
    const handlePrevious = async () => {
        await fetchRetriveData(currentBRAND_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
        setBrandImage(null);
    };
    const handleNext = async () => {
        if (currentBRAND_KEY) {
            await fetchRetriveData(currentBRAND_KEY, "N");
        }
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
        setBrandImage(null);
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
            const response = await axiosInstance.post(`Brand/DeleteBrand?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                Brand_KEY: form.BRAND_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentBRAND_KEY, 'P');
            } else {
                toast.error(MESSAGE);
            }
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };
    const handleEdit = () => {
        setMode(FORM_MODE.edit);
        setBrandImage(null);
    };
   const handlePrint = async () => {
    try {
        const response = await axiosInstance.post(`/Brand/GetBrandDashBoard?currentPage=1&limit=5000`, {
            "SearchText": ""
        });
        const { data: { STATUS, DATA } } = response; // Extract DATA
        if (STATUS === 0 && Array.isArray(DATA)) {
            const formattedData = DATA.map(row => ({
                ...row,
                STATUS: row.STATUS === "1" ? "Active" : "Inactive"
            }));

            // Generate the PDF blob
            const asPdf = pdf(<PrintBrData rows={formattedData} />);
            const blob = await asPdf.toBlob();
            const url = URL.createObjectURL(blob);

            // Open the PDF in a new tab
            const newTab = window.open(url, '_blank');
            if (newTab) {
                newTab.focus();
            } 
            // else {
            //     toast.error("Please allow popups for this website");
            // }

            // Cleanup the URL after a short delay
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
        }
    } catch (error) {
        console.error("Print Error:", error);
    }
};

    const handleExit = () => {
         navigate("/masters/products/brand-mst-table")
        //  router.push('/masters/products/brand-mst-table');
         };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBrandImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
                                    sx={{
                                        backgroundColor: "#635BFF"
                                    }}
                                    onClick={handlePrevious}
                                    disabled={
                                        mode !== FORM_MODE.read || !currentBRAND_KEY || currentBRAND_KEY === 1
                                    }
                                >
                                    <KeyboardArrowLeftIcon />
                                </Button>
                                <Button variant="contained" size="small" className="three-d-button-next"
                                    sx={{
                                        backgroundColor: "#635BFF"
                                    }}
                                    onClick={handleNext}
                                    disabled={mode !== FORM_MODE.read || !currentBRAND_KEY}
                                >
                                    <NavigateNextIcon />
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography align="center" variant="h5">
                                Brand Master
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
                            gap: { xs: 1, sm: 1.5, md: 2 },
                            marginInline: { xs: '5%', sm: '10%', md: '20%' },
                            marginBlock: { xs: '15px', sm: '20px', md: '30px' },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'end',
                                marginInline: { xs: '0%', sm: '10%' },
                                marginBottom: { xs: '10px', sm: '0px' }
                            }}
                        >
                            <TextField
                                placeholder="Search By Code"
                                variant="filled"
                                sx={{
                                    width: { xs: '100%', sm: '50%', md: '40%' },
                                    backgroundColor: '#e0f7fa',
                                    '& .MuiInputBase-input': {

                                        paddingBlock: { xs: '8px', md: '4px' },
                                        paddingLeft: { xs: '10px', md: '8px' },
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                    },
                                }}
                                value={form.SearchByCd}
                                onChange={(e) => setForm({ ...form, SearchByCd: e.target.value })}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        fetchRetriveData(e.target.value, "R", true);
                                    }
                                }} />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1.5, md: 2 },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: { xs: 1, sm: 1.5 },
                                    width: { xs: '100%', sm: 'auto' },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: { xs: 1, sm: 1.5 },
                                        flexDirection: { xs: 'column', sm: 'row' },
                                    }}
                                >
                                    <TextField
                                        label="Series"
                                        inputRef={SERIESRef}
                                        sx={{
                                            width: { xs: '100%', sm: '32%' },
                                            '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } },
                                            
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
                                            width: { xs: '100%', sm: '32%' },
                                            '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } },
                                            
                                        }}
                                        disabled={true}
                                        fullWidth
                                        className="custom-textfield"
                                        value={form.Brand_LST_CODE}
                                        onChange={(e) => setForm({ ...form, Brand_LST_CODE: e.target.value })}
                                    />
                                    <TextField
                                        label="Code"
                                        inputRef={BRAND_KEYRef}
                                        sx={{
                                            width: { xs: '100%', sm: '32%' },
                                            
                                        }}
                                        disabled={mode === FORM_MODE.read}
                                        className="custom-textfield"
                                        value={form.BRAND_KEY}
                                        onChange={(e) => setForm({ ...form, BRAND_KEY: e.target.value })}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between', gap: 0
                                    }}>
                                    <TextField
                                        inputRef={BRAND_NAMERef}
                                        label={
                                            <span>
                                                Name<span style={{ color: "red" }}>*</span>
                                            </span>
                                        }
                                        sx={{
                                            width: '100%',
                                            '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } }
                                        }}
                                        disabled={mode === FORM_MODE.read}
                                        className="custom-textfield"
                                        value={form.BRAND_NAME}
                                        onChange={(e) => setForm({ ...form, BRAND_NAME: e.target.value })}
                                    />
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    gap: { xs: 1, sm: 1.5 },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'stretch', sm: 'center' },
                                }}>
                                    <TextField
                                        label="Abbreviation"
                                        inputRef={BRAND_ABRVRef}
                                        sx={{
                                            width: { xs: '100%', sm: '30%' },
                                            '& .MuiInputBase-input': { fontSize: { xs: '0.875rem', sm: '1rem' } }
                                          
                                        }}
                                        disabled={mode === FORM_MODE.read}
                                        className="custom-textfield"
                                        value={form.BRAND_ABRV}
                                        onChange={(e) => setForm({ ...form, BRAND_ABRV: e.target.value })}
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
                                                    },
                                                    transform: { xs: 'scale(0.9)', sm: 'scale(1)' },
                                                }}
                                            />
                                        }
                                        label="Active"
                                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: { xs: 0.5, sm: 1 },
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    mt: { xs: 1, sm: 0 },
                                }}
                            >
                                <Image
                                    src={brandImage || ''}
                                    // alt="Brand"
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid #ccc',
                                    }}
                                    sx={{
                                        width: { xs: 100, sm: 120, md: 150 },
                                        height: { xs: 100, sm: 120, md: 150 },
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: { xs: 0.5, sm: 1 },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            cursor: mode === FORM_MODE.read ? 'not-allowed' : 'pointer',
                                            color: mode === FORM_MODE.read ? 'grey.500' : '#1976d2',
                                            textDecoration: 'underline',
                                            mt: { xs: 0.5, sm: 1 },
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        }}
                                        onClick={() => {
                                            if (mode !== FORM_MODE.read) {
                                                document.getElementById('brand-image-input')?.click();
                                            }
                                        }}
                                    >
                                        Browse
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            cursor: mode === FORM_MODE.read ? 'not-allowed' : 'pointer',
                                            color: mode === FORM_MODE.read ? 'grey.500' : '#1976d2',
                                            textDecoration: 'underline',
                                            mt: { xs: 0.5, sm: 1 },
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        }}
                                        onClick={() => {
                                            if (mode !== FORM_MODE.read) {
                                                setBrandImage(null);
                                            }
                                        }}
                                    >
                                        Clear
                                    </Typography>
                                    <input
                                        id="brand-image-input"
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </Box>
                            </Box>
                        </Box>
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
export default BrandMst;
