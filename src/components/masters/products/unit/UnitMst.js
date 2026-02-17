'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { pdf } from '@react-pdf/renderer';
import PrintUnitData from './PrintUnitData';
import { useRouter } from 'next/navigation';
import { getFormMode } from '@/lib/helpers';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import CustomAutocomplete from '@/GlobalFunction/CustomAutoComplete/CustomAutoComplete';
import { useSearchParams } from 'next/navigation';
import CrudButtons from '@/GlobalFunction/CrudButtons';
import { TbListSearch } from "react-icons/tb";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CrudButton from '@/GlobalFunction/CrudButton';
import PaginationButtons from '@/GlobalFunction/PaginationButtons';

const FORM_MODE = getFormMode();
const UnitMst = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const UNIT_KEY = searchParams.get('UNIT_KEY');
    const [currentUNIT_KEY, setCurrentUNIT_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        UNIT_ALT_CODE: '',
        UNIT_KEY: '',  //CODE
        UNIT_NAME: '',  //SHADE NAME
        UNIT_ABRV: '',
        UNIT_FOR: '',
        UNIT_LST_CODE: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const UNIT_KEYRef = useRef(null);
    const UNIT_NAMERef = useRef(null);
    const UNIT_ABRVRef = useRef(null);
    const UNIT_FORRef = useRef(null);
    const UNIT_ALT_CODERef = useRef(null);
    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentUNIT_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const CO_ID = localStorage.getItem('CO_ID');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('USER_NAME');
    const PARTY_KEY = localStorage.getItem('PARTY_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');

    const unitOptions = [
        { Id: '0', Name: 'N' },
        // { Id: '1', Name: 'L' },

    ];
    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };
    const fetchRetriveData = useCallback(async (currentUNIT_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('Unit/RetriveUnit', {
                "FLAG": flag,
                "TBLNAME": "Unit",
                "FLDNAME": "Unit_KEY",
                "ID": currentUNIT_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const categoryData = DATA[0];
                setForm({
                    UNIT_KEY: categoryData.UNIT_KEY,
                    UNIT_NAME: categoryData.UNIT_NAME,
                    UNIT_ABRV: categoryData.UNIT_ABRV || '',
                    UNIT_FOR: categoryData.UNIT_FOR || '',
                    UNIT_ALT_CODE: categoryData.UNIT_ALT_CODE || '',
                    SERIES: categoryData.SERIES || '',
                    UNIT_LST_CODE: categoryData.UNIT_LST_CODE || '',
                    Status: categoryData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentUNIT_KEY(categoryData.UNIT_KEY);
                const newParams = new URLSearchParams();
                newParams.set("UNIT_KEY", categoryData.UNIT_KEY);
                router.replace(`/masters/products/unit?${newParams.toString()}`);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentUNIT_KEY}`);
                    setForm({
                        UNIT_KEY: '',
                        UNIT_NAME: '',
                        UNIT_ABRV: '',
                        UNIT_FOR: '',
                        UNIT_ALT_CODE: '',
                        SERIES: '',
                        UNIT_LST_CODE: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID, router])

    useEffect(() => {
        if (UNIT_KEY) {
            setCurrentUNIT_KEY(UNIT_KEY);
            fetchRetriveData(UNIT_KEY);
            setMode(FORM_MODE.read);
        } else {
            setForm({
                SearchByCd: '',
                SERIES: '',
                UNIT_ALT_CODE: '',
                UNIT_KEY: '',
                UNIT_NAME: '',
                UNIT_ABRV: '',
                UNIT_FOR: '',
                UNIT_LST_CODE: '',
                Status: "1",
            })
            setMode(FORM_MODE.read);
        }
        setMode(FORM_MODE.read);
    }, [UNIT_KEY, fetchRetriveData]);

    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            let url;
            if (mode === FORM_MODE.edit && currentUNIT_KEY) {
                url = `Unit/UpdateUnit?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `Unit/InsertUnit?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                UNIT_KEY: form.UNIT_KEY,  //CODE
                UNIT_ALT_CODE: form.UNIT_ALT_CODE, //ALT CODE
                UNIT_NAME: form.UNIT_NAME, //UNIT NAME
                UNIT_ABRV: form.UNIT_ABRV,
                UNIT_FOR: form.UNIT_FOR,
                STATUS: form.Status ? "1" : "0",


                "Unit_KEY": "UN061",
                "UNIT_ALT_CODE": "API",
                "Unit_NAME": "TESTAPI",
                "Unit_ABRV": "TESTAPI",
                "UNIT_FOR": "N",
            };
            let response;
            if (mode == FORM_MODE.edit && currentUNIT_KEY) {
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
                        UNIT_KEY: '',
                        UNIT_NAME: '',
                        UNIT_ABRV: '',
                        UNIT_ALT_CODE: '',
                        SERIES: '',
                        UNIT_LST_CODE: '',
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
            await fetchRetriveData(currentUNIT_KEY, "R");
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
                "MODULENAME": "Unit",
                "TBLNAME": "Unit",
                "FLDNAME": "Unit_KEY",
                "NCOLLEN": 0,
                "CPREFIX": newSeries,
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 5,
                "FLAG": "Series"
            });
            const { STATUS, DATA, MESSAGE } = response.data;
            if (STATUS === 0 && DATA.length > 0) {
                const id = DATA[0].ID;
                const lastId = DATA[0].LASTID;
                setForm((prevForm) => ({
                    ...prevForm,
                    UNIT_KEY: id,
                    UNIT_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    UNIT_KEY: '',
                    UNIT_LST_CODE: ''
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
                UNIT_KEY: '',
                UNIT_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    };

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentUNIT_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            UNIT_NAME: '',
            UNIT_ABRV: '',
            SearchByCd: '',
            UNIT_ALT_CODE: '',
            Status: '1',
        }));

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "Unit",
                "TBLNAME": "Unit",
                "FLDNAME": "Unit_KEY",
                "NCOLLEN": 0,
                "CPREFIX": "",
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 5,
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
                "MODULENAME": "Unit",
                "TBLNAME": "Unit",
                "FLDNAME": "Unit_KEY",
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
                    UNIT_KEY: id,
                    UNIT_LST_CODE: lastId
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
        await fetchRetriveData(currentUNIT_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

    const handleNext = async () => {
        if (currentUNIT_KEY) {
            await fetchRetriveData(currentUNIT_KEY, "N");
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
            const response = await axiosInstance.post(`Unit/DeleteUnit?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                UNIT_KEY: form.UNIT_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentUNIT_KEY, 'P');
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
            const response = await axiosInstance.post(`Unit/GetUnitDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response; // Extract DATA
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));

                // Generate the PDF blob
                const asPdf = pdf(<PrintUnitData rows={formattedData} />);
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

    const handleTable = () => {
        router.push('/masters/products/unit/unittable');
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
                        Unit Master
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
                            value={form.UNIT_LST_CODE}
                            name="UNIT_LST_CODE"
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
                            inputRef={UNIT_KEYRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.UNIT_KEY}
                            name="UNIT_KEY"
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
                            inputRef={UNIT_ALT_CODERef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.UNIT_ALT_CODE}
                            name="UNIT_ALT_CODE"
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
                            inputRef={UNIT_NAMERef}
                            label="Shade"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.UNIT_NAME}
                            name="UNIT_NAME"
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
                            id="unit-key-autocomplete"
                            inputRef={UNIT_FORRef}
                            disabled={true}
                            label="Unit For"
                            name="UNIT_FOR"
                            options={unitOptions}
                            value={unitOptions.find(opt => opt.Id === form.UNIT_FOR) || null}
                            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                            className="custom-textfield"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Abbreviation"
                            inputRef={UNIT_ABRVRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.UNIT_ABRV}
                            name="UNIT_ABRV"
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

        </Grid >
    );
};
export default UnitMst;
