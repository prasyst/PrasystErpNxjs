import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';;
import { pdf } from '@react-pdf/renderer';
import PrintBrDt from './PrintBrDt'
import Image from 'next/image';
import { TbListSearch } from "react-icons/tb";
import CrudButton from '@/GlobalFunction/CrudButton';
import PaginationButtons from '@/GlobalFunction/PaginationButtons';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ConfirmDelDialog from '@/GlobalFunction/ConfirmDelDialog';

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

const FORM_MODE = getFormMode();
const BrandMst = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const BRAND_KEY = searchParams.get('BRAND_KEY');
    const [currentBRAND_KEY, setCurrentBRAND_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        BRAND_CODE: '',
        BRAND_KEY: '',
        BRAND_NAME: '',
        BRAND_ABRV: '',
        Brand_LST_CODE: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const BRAND_KEYRef = useRef(null);
    const BRAND_NAMERef = useRef(null);
    const BRAND_ABRVRef = useRef(null);
    const BRAND_CODERef = useRef(null);
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

    const fetchRetriveData = useCallback(async (currentBRAND_KEY, flag = "R", isManualSearch = false) => {
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
    }, [CO_ID]);

    useEffect(() => {
        if (BRAND_KEY) {
            setCurrentBRAND_KEY(BRAND_KEY);
            fetchRetriveData(BRAND_KEY);
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
        setMode(FORM_MODE.read);
    }, [BRAND_KEY, fetchRetriveData]);

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
    };

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

    const handleTable = () => {
        router.push('/masters/products/brand/brandtable');
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
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));

                // Generate the PDF blob
                const asPdf = pdf(<PrintBrDt rows={formattedData} />);
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
        router.push('/masterpage?activeTab=products');
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
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
                        Brand Master
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
                            value={form.Brand_LST_CODE}
                            name="BRAND_LST_CODE"
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
                            inputRef={BRAND_KEYRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.BRAND_KEY}
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
                            inputRef={BRAND_CODERef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.BRAND_CODE}
                            name="BRAND_CODE"
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
                            inputRef={BRAND_NAMERef}
                            label="Name"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.BRAND_NAME}
                            name="BRAND_NAME"
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
                            inputRef={BRAND_ABRVRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.BRAND_ABRV}
                            name="BRAND_ABRV"
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
export default BrandMst;
