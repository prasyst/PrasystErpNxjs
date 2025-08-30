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
import { toast, ToastContainer } from 'react-toastify';
import z from 'zod';
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import CrudButton from '@/GlobalFunction/CrudButton';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
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
    const handleFirst=()=>{}
    const handleLast=async()=>{
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
    const handleExit = () => { router.push("/masters/products/category/cattable") };

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
                        justifyContent="space-between" spacing={2} sx={{ marginTop: "10px", marginInline: '20px' }}>
                        {/* Center Header */}
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography align="center" variant="h5">
                                Category Master
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Form Fields */}
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 1.5, md: 2 },
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
                            display: 'flex', flexDirection: { xs: 'column', sm: 'row', md: 'row' },
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
                                value={form.FGCAT_LST_CODE}
                                onChange={(e) => setForm({ ...form, FGCAT_LST_CODE: e.target.value })}
                            />
                            <TextField
                                label="Code"
                                inputRef={FGCAT_KEYRef}
                                sx={{ width: { xs: '100%', sm: '48%', md: '25%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.FGCAT_KEY}
                                onChange={(e) => setForm({ ...form, FGCAT_KEY: e.target.value })}
                            />
                            <TextField
                                label="Alt Code"
                                inputRef={FGCAT_CODERef}
                                sx={{ width: { xs: '100%', sm: '48%', md: '25%' } }}
                                disabled={mode === FORM_MODE.read}
                                fullWidth
                                className="custom-textfield"
                                value={form.FGCAT_CODE}
                                onChange={(e) => setForm({ ...form, FGCAT_CODE: e.target.value })}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                            justifyContent: 'space-between',
                            gap: { xs: 1, sm: 1, md: 1 },
                        }}>
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
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>

                            <TextField
                                inputRef={FGCAT_NAMERef}
                                // label="Category Name"
                                label={
                                    <span>
                                        Category Name<span style={{ color: "red" }}>*</span>
                                    </span>
                                }
                                sx={{ width: '100%' }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.FGCAT_NAME}
                                onChange={(e) => setForm({ ...form, FGCAT_NAME: e.target.value })}
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
                                inputRef={SR_CODERef}
                                label="CatSeries"
                                sx={{ width: { xs: '100%', sm: '40%', md: '30%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.SR_CODE}
                                onChange={(e) => setForm({ ...form, SR_CODE: e.target.value })}
                            />
                            <TextField
                                label="Abbreviation"
                                inputRef={AbrvRef}
                                sx={{ width: { xs: '100%', sm: '40%', md: '30%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.Abrv}
                                onChange={(e) => setForm({ ...form, Abrv: e.target.value })}
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
                    <Grid container alignItems="center"
                        justifyContent="center" spacing={1} sx={{ marginTop: "10px", marginInline: '20px' }}>
                        <Grid sx={{
                            width: { xs: '100%', sm: 'auto' },
                        }}>
                            <Stack direction="row" spacing={1}>
                                <PaginationButtons
                                    mode={mode}
                                    FORM_MODE={FORM_MODE}
                                    currentKey={currentFGCAT_KEY}
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
                            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
                                <CrudButtons
                                    mode={mode}
                                    onAdd={mode === FORM_MODE.read ? handleAdd : handleSubmit}
                                    onEdit={mode === FORM_MODE.read ? handleEdit : handleCancel
                                    onView={handlePrint}
                                    onDelete={handleDelete}
                                    onExit={handleExit}
                                    readOnlyMode={mode === FORM_MODE.read}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{
                            backgroundColor: "#39ace2",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#2199d6",
                                color: "white",
                            },
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
export default CategoryMst;
