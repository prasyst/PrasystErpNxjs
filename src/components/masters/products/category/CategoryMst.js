'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import PrintCatDt from './PrintCatDt';
import CrudButtons from '@/GlobalFunction/CrudButtons';
import PaginationButtons from '@/GlobalFunction/PaginationButtons';

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

const CategoryMst = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const FGCAT_KEY = searchParams.get('FGCAT_KEY');

    const [currentFGCAT_KEY, setCurrentFGCAT_KEY] = useState(null);
    const [form, setForm] = useState({
        FGCAT_KEY: '',  //CODE
        FGCAT_NAME: '',  //CATEGORY NAME
        Abrv: '',
        SearchByCd: '',
        SR_CODE: '',    //CAT SERIES
        SEGMENT_KEY: '',
        FGCAT_CODE: '',  // ALT CODE
        FGCAT_LST_CODE: '',
        SERIES: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const contentRef = useRef(null);
    const FGCAT_KEYRef = useRef(null);
    const FGCAT_NAMERef = useRef(null);
    const AbrvRef = useRef(null);
    const SR_CODERef = useRef(null);
    const FGCAT_CODERef = useRef(null);
    const SERIESRef = useRef(null);
    const SEGMENT_KEYRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentFGCAT_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const [rows, setRows] = useState([]);
    const [dataForPrint, setDataForPrint] = useState({});
    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');
    const CO_ID = localStorage.getItem('CO_ID');
    const [showReportTable, setShowReportTable] = useState(false);

    const segmentOptions = [
        { Id: 0, Name: '' },
        // { Id: 1, Name: 'Wholesale' },
        // ...
    ];


    useEffect(() => {
        const getRow = async () => {
            const params = {
                SearchText: "",
            };
            try {
                const res = await axiosInstance.post('Category/GetFgCatDashBoard?currentPage=1&limit=500', params);
                const { data: { STATUS, DATA } } = res;
                if (STATUS === 0 && Array.isArray(DATA)) {

                    setRows(DATA);
                    setDataForPrint(DATA);
                } else {
                    console.error('No data found in response');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        getRow();
    }, []);

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };

    const fetchRetriveData = useCallback(async (currentFGCAT_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('Category/RetriveFgCat', {
                "FLAG": flag,
                "TBLNAME": "FGCAT",
                "FLDNAME": "FGCAT_KEY",
                "ID": currentFGCAT_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const categoryData = DATA[0];
                setForm({
                    FGCAT_KEY: categoryData.FGCAT_KEY,
                    FGCAT_NAME: categoryData.FGCAT_NAME,
                    Abrv: categoryData.FGCAT_ABRV || '',
                    SR_CODE: categoryData.SR_CODE || '',
                    SEGMENT_KEY: categoryData.SEGMENT_KEY || '',
                    FGCAT_CODE: categoryData.FGCAT_CODE || '',
                    SERIES: categoryData.SERIES || '',
                    FGCAT_LST_CODE: categoryData.FGCAT_LST_CODE || '',
                    Status: categoryData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentFGCAT_KEY(categoryData.FGCAT_KEY);
                const newParams = new URLSearchParams();
                newParams.set("FGCAT_KEY", categoryData.FGCAT_KEY);
                router.replace(`/masters/products/category?${newParams.toString()}`);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentFGCAT_KEY}`);
                    setForm({
                        FGCAT_KEY: '',
                        FGCAT_NAME: '',
                        Abrv: '',
                        SR_CODE: '',
                        SEGMENT_KEY: '',
                        FGCAT_CODE: '',
                        SERIES: '',
                        FGCAT_LST_CODE: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID, router]);

    useEffect(() => {
        if (FGCAT_KEY) {
            setCurrentFGCAT_KEY(FGCAT_KEY);
            fetchRetriveData(FGCAT_KEY);
            setMode(FORM_MODE.read);
        } else {
            setForm({
                SearchByCd: '',
                FGCAT_KEY: '',
                FGCAT_NAME: '',
                Abrv: '',
                SearchByCd: '',
                SR_CODE: '',
                SEGMENT_KEY: '',
                FGCAT_CODE: '',
                FGCAT_LST_CODE: '',
                SERIES: '',
                Status: '1',
            })
            setMode(FORM_MODE.read);
        }
        setMode(FORM_MODE.read);
    }, [FGCAT_KEY, fetchRetriveData]);


    const handleSubmit = async () => {
        const result = categoryFormSchema.safeParse(form);
        if (!result.success) {
            // console.log("Validation Errors:", result.error.format());
            return toast.info("Please fill in all required inputs correctly", {
                autoClose: 1000,
            });
        }
        const { data } = result;
        try {

            const userRole = localStorage.getItem('userRole');
            const username = localStorage.getItem('USER_NAME');
            const PARTY_KEY = localStorage.getItem('PARTY_KEY');
            const COBR_ID = localStorage.getItem('COBR_ID');
            const UserName = userRole === 'user' ? username : PARTY_KEY;

            let url;

            if (mode === FORM_MODE.edit && currentFGCAT_KEY) {
                url = `Category/UpdateFgCat?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `Category/InsertFgCat?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                FGCAT_KEY: form.FGCAT_KEY,  //CODE
                FGCAT_CODE: form.FGCAT_CODE, //ALT CODE
                FGCAT_NAME: data.FGCAT_NAME, //CATEGORY NAME
                FGCAT_ABRV: form.Abrv,
                STATUS: form.Status ? "1" : "0",
                SR_CODE: form.SR_CODE,     // CAT SERIES 
                SEGMENT_KEY: form.SEGMENT_KEY,
                CO_ID: CO_ID
            };

            let response;

            if (mode == FORM_MODE.edit && currentFGCAT_KEY) {
                payload.UPDATED_BY = 1;
                payload.UPDATED_DT = new Date().toISOString();
                response = await axiosInstance.post(url, payload);
                // console.log('Updated:', response.data);
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
                        FGCAT_KEY: '',
                        FGCAT_NAME: '',
                        Abrv: '',
                        SR_CODE: '',
                        SEGMENT_KEY: '',
                        FGCAT_CODE: '',
                        SERIES: '',
                        FGCAT_LST_CODE: '',
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
            await fetchRetriveData(currentFGCAT_KEY, "R");
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
                MODULENAME: "FGCAT",
                TBLNAME: "FGCAT",
                FLDNAME: "FGCAT_KEY",
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
                    FGCAT_KEY: id,
                    FGCAT_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`);

                setForm((prevForm) => ({
                    ...prevForm,
                    FGCAT_KEY: '',
                    FGCAT_LST_CODE: ''
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
                FGCAT_KEY: '',
                FGCAT_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    }

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentFGCAT_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            FGCAT_NAME: '',
            Abrv: '',
            SearchByCd: '',
            SR_CODE: '',
            SEGMENT_KEY: '',
            FGCAT_CODE: '',
            SR_CODE: '',
            Status: '1',
        }));

        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                MODULENAME: "FGCAT",
                TBLNAME: "FGCAT",
                FLDNAME: "FGCAT_KEY",
                NCOLLEN: 0,
                CPREFIX: "", // Initially empty
                COBR_ID: COBR_ID,
                FCYR_KEY: FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 30,
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
                MODULENAME: "FGCAT",
                TBLNAME: "FGCAT",
                FLDNAME: "FGCAT_KEY",
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
                    FGCAT_KEY: id,
                    FGCAT_LST_CODE: lastId
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
    }
    const handlePrevious = async () => {
        await fetchRetriveData(currentFGCAT_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleNext = async () => {
        if (currentFGCAT_KEY) {
            await fetchRetriveData(currentFGCAT_KEY, "N");
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
            const response = await axiosInstance.post('Category/DeleteFgCat', {
                FGCAT_KEY: form.FGCAT_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentFGCAT_KEY, 'P');
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
            const response = await axiosInstance.post(`Category/GetFgCatDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));

                // Generate the PDF blob
                const asPdf = pdf(<PrintCatDt rows={formattedData} />);
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
        router.push("/masters/products/category/cattable");
    };

    const handleExit = async () => { 

        router.push("/masterpage?activeTab=products"); 

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
        height: { xs: 40, sm: 46, md: 27 }
    };

    const textInputSx = {
        '& .MuiInputBase-root': {
            height: 36,
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
            height: 36,
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
                        Category Master
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
                            variant="filled"
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

                <Grid container spacing={0.5}>

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
                                    padding: '6px 8px',
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
                            value={form.FGCAT_LST_CODE}
                            name="FGCAT_LST_CODE"
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Code"
                            inputRef={FGCAT_KEYRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.FGCAT_KEY}
                            name="FGCAT_KEY"
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Alt Code"
                            inputRef={FGCAT_CODERef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.FGCAT_CODE}
                            name="FGCAT_CODE"
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <CustomAutocomplete
                            id="segment-key-autocomplete"
                            inputRef={SEGMENT_KEYRef}
                            disabled={true}
                            label="Segment Key"
                            name="SEGMENT_KEY"
                            //   options={segmentOptions}
                            value={form.SEGMENT_KEY}
                            onChange={(value) => setForm({ ...form, SEGMENT_KEY: value })}
                            className="custom-textfield"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label={
                                <span>
                                    Category Name<span style={{ color: "red" }}>*</span>
                                </span>
                            }
                            inputRef={FGCAT_NAMERef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.FGCAT_NAME}
                            name="FGCAT_NAME"
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            inputRef={SR_CODERef}
                            label="CatSeries"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.SR_CODE}
                            name="SR_CODE"
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Abbreviation"
                            inputRef={AbrvRef}
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.Abrv}
                            name="Abrv"
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

        </Grid >
    );
};
export default CategoryMst;
