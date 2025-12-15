'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Grid, TextField, Typography, Button, FormControlLabel, Checkbox, } from '@mui/material';
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
import { textInputSx } from '../../../../../public/styles/textInputSx';
import PrintQcGrp from './PrintQcGrp';
import ConfirmationDialog from '@/GlobalFunction/DeleteDialog/ConfirmationDialog';

const FORM_MODE = getFormMode();
const qcGrpFormSchema = z.object({
    QC_GROUP_NAME: z.string().min(1, "QC Group Name is required"),
    QC_TYPE: z.string().min(1, "QC Type is required"),
});
const columns = [
    { id: "ROWNUM", label: "SrNo.", minWidth: 40 },
    { id: "QC_GROUP_KEY", label: "Code", minWidth: 40 },
    { id: "QC_GROUP_NAME", label: "AltCode", minWidth: 40 },
    { id: "QC_TYPE", label: "CatName", minWidth: 40 },
    { id: "QC_GROUP_ABRV", label: "Segment", minWidth: 40 },
];
const QcGroup = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const USER_ID = localStorage.getItem('USER_ID');
    const USER_NAME = localStorage.getItem('USER_NAME');
    const QC_GROUP_KEY = searchParams.get('QC_GROUP_KEY');
    const [currentQC_GROUP_KEY, setCurrentQC_GROUP_KEY] = useState(null);
    const [form, setForm] = useState({
        QC_GROUP_KEY: '',
        QC_TYPE: '',
        REMARK: '',
        SearchByCd: '',
        QC_GROUP_ABRV: '',
        QC_GROUP_NAME: '',
        QC_GROUP_LST_CODE: '',
        SERIES: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const contentRef = useRef(null);
    const QC_GROUP_KEYRef = useRef(null);
    const QC_TYPERef = useRef(null);
    const REMARKRef = useRef(null);
    const QC_GROUP_NAMERef = useRef(null);
    const SERIESRef = useRef(null);
    const QC_GROUP_ABRVRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentQC_GROUP_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const [rows, setRows] = useState([]);
    const [dataForPrint, setDataForPrint] = useState({});
    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');
    const CO_ID = localStorage.getItem('CO_ID');
    const [showReportTable, setShowReportTable] = useState(false);
    useEffect(() => {
        const getRow = async () => {
            const params = {
                SearchText: "",
            };
            try {
                const res = await axiosInstance.post('QC_GROUP/GetQC_GROUPDashBoard?currentPage=1&limit=5000', params);
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
    const fetchRetriveData = useCallback(async (currentQC_GROUP_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('QC_GROUP/RetriveQC_GROUP', {
                "FLAG": flag,
                "TBLNAME": "QC_GROUP",
                "FLDNAME": "QC_GROUP_KEY",
                "ID": currentQC_GROUP_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const qcData = DATA[0];
                setForm({
                    QC_GROUP_KEY: qcData.QC_GROUP_KEY,
                    QC_TYPE: qcData.QC_TYPE,
                    REMARK: qcData.REMARK || '',
                    QC_GROUP_ABRV: qcData.QC_GROUP_ABRV || '',
                    QC_GROUP_NAME: qcData.QC_GROUP_NAME || '',
                    SERIES: qcData.SERIES || '',
                    QC_GROUP_LST_CODE: qcData.QC_GROUP_LST_CODE || '',
                    Status: qcData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentQC_GROUP_KEY(qcData.QC_GROUP_KEY);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentQC_GROUP_KEY}`);
                    setForm({
                        QC_GROUP_KEY: '',
                        QC_TYPE: '',
                        REMARK: '',
                        QC_GROUP_ABRV: '',
                        QC_GROUP_NAME: '',
                        SERIES: '',
                        QC_GROUP_LST_CODE: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID]);
    useEffect(() => {
        if (QC_GROUP_KEY) {
            setCurrentQC_GROUP_KEY(QC_GROUP_KEY);
            fetchRetriveData(QC_GROUP_KEY);
            setMode(FORM_MODE.read);
        } else {
            setForm({
                SearchByCd: '',
                QC_GROUP_KEY: '',
                QC_TYPE: '',
                REMARK: '',
                QC_GROUP_ABRV: '',
                QC_GROUP_NAME: '',
                QC_GROUP_LST_CODE: '',
                SERIES: '',
                Status: '1',
            })
            setMode(FORM_MODE.add);
        }
    }, [QC_GROUP_KEY, fetchRetriveData]);
    const handleSubmit = async () => {
        const result = qcGrpFormSchema.safeParse(form);
        if (!result.success) {
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
            if (mode === FORM_MODE.edit && currentQC_GROUP_KEY) {
                url = `QC_GROUP/UpdateQC_GROUP?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `QC_GROUP/InsertQC_GROUP?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                QC_GROUP_KEY: form.QC_GROUP_KEY,
                QC_GROUP_NAME: form.QC_GROUP_NAME,
                QC_GROUP_ABRV: form.QC_GROUP_ABRV,
                QC_TYPE: data.QC_TYPE,
                REMARK: form.REMARK,
                STATUS: form.Status ? "1" : "0",
            };
            let response;
            if (mode == FORM_MODE.edit && currentQC_GROUP_KEY) {
                payload.UPDATED_BY = USER_ID;
                response = await axiosInstance.post(url, payload);
                const { STATUS, MESSAGE } = response.data;
                if (STATUS === 0) {
                    setMode(FORM_MODE.read);
                    toast.success(MESSAGE, { autoClose: 1000 });

                } else {
                    toast.error(MESSAGE, { autoClose: 1000 });
                }
            } else {
                payload.CREATED_BY = USER_ID;
                response = await axiosInstance.post(url, payload);
                const { STATUS, MESSAGE, DATA: newKey } = response.data;
                if (STATUS === 0) {
                    if (newKey) {
                        setCurrentQC_GROUP_KEY(newKey);
                        await fetchRetriveData(newKey, "R");
                        const newParams = new URLSearchParams();
                        newParams.set("QC_GROUP_KEY", newKey);
                        router.replace(`/masters/qc/qcgrp/qcgroup?${newParams.toString()}`);
                    }
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
            await fetchRetriveData(currentQC_GROUP_KEY, "R");
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
                "MODULENAME": "QC_GROUP",
                "TBLNAME": "QC_GROUP",
                "FLDNAME": "QC_GROUP_KEY",
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
                    QC_GROUP_KEY: id,
                    QC_GROUP_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`);

                setForm((prevForm) => ({
                    ...prevForm,
                    QC_GROUP_KEY: '',
                    QC_GROUP_LST_CODE: ''
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
                QC_GROUP_KEY: '',
                QC_GROUP_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    }
    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentQC_GROUP_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            QC_TYPE: '',
            REMARK: '',
            SearchByCd: '',
            QC_GROUP_ABRV: '',
            QC_GROUP_NAME: '',
            Status: '1',
        }));
        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                MODULENAME: "QC_GROUP",
                TBLNAME: "QC_GROUP",
                FLDNAME: "QC_GROUP_KEY",
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
                MODULENAME: "QC_GROUP",
                TBLNAME: "QC_GROUP",
                FLDNAME: "QC_GROUP_KEY",
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
                    QC_GROUP_KEY: id,
                    QC_GROUP_LST_CODE: lastId
                }));
            }
        } catch (error) {
            console.error("Error fetching ID and LASTID:", error);
        }
    };
    const handlePrevious = async () => {
        await fetchRetriveData(currentQC_GROUP_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleNext = async () => {
        if (currentQC_GROUP_KEY) {
            await fetchRetriveData(currentQC_GROUP_KEY, "N");
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
            const response = await axiosInstance.post(`QC_GROUP/DeleteQC_GROUP?UserName=${(USER_NAME)}&strCobrid=${COBR_ID}`, {
                QC_GROUP_KEY: currentQC_GROUP_KEY
            });
            const { data: { STATUS, MESSAGE, DATA } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentQC_GROUP_KEY, 'P');
            } else {
                const extraMsg = DATA?.[0]?.MSG;
                toast.error(extraMsg || MESSAGE);
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
            const response = await axiosInstance.post(`QC_GROUP/GetQC_GROUPDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));
                const asPdf = pdf(<PrintQcGrp rows={formattedData} />);
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
    const handleTable = () => {
        router.push("/masters/qc/qcgrp/qcgrouptable/");
    };
    const handleExit = async () => {
        router.push("/masterpage/?activeTab=qc");
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
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
                            QC Group
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
                                disabled={mode !== FORM_MODE.read}
                                onClick={handlePrevious}
                            >
                                <KeyboardArrowLeftIcon />
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important', ml: 1 }}
                                disabled={mode !== FORM_MODE.read}
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
                                mode={mode}
                                onAdd={handleAdd}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onView={handlePrint}
                                onExit={handleExit}
                                readOnlyMode={mode === FORM_MODE.read}
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
                                value={form.QC_GROUP_LST_CODE}
                                name="QC_GROUP_LST_CODE"
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
                                inputRef={QC_GROUP_KEYRef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.QC_GROUP_KEY}
                                name="QC_GROUP_KEY"
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
                                label={
                                    <span>
                                        QC_GROUP_NAME<span style={{ color: "red" }}>*</span>
                                    </span>
                                }
                                inputRef={QC_GROUP_NAMERef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.QC_GROUP_NAME}
                                name="QC_GROUP_NAME"
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
                                label="QC_GROUP_ABRV"
                                inputRef={QC_GROUP_ABRVRef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.QC_GROUP_ABRV}
                                name="QC_GROUP_ABRV"
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
                                label="QC TYPE"
                                inputRef={QC_TYPERef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.QC_TYPE}
                                name="QC_TYPE"
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
                                label="REMARK"
                                inputRef={REMARKRef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.REMARK}
                                name="REMARK"
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
                        <Grid size={{ xs: 12, sm: 6, md: 1.5 }} display="flex" justifyContent="end">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={mode === FORM_MODE.read}
                                        checked={Status == "1"}
                                        onChange={handleChangeStatus}
                                        sx={{
                                            '&.Mui-checked': {
                                                color: '#635bff',         // color: '#39ace2',
                                            }, '& .MuiSvgIcon-root': {
                                                fontSize: 20,
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
            <ConfirmationDialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this record?"
            />
        </>
    );
};
export default QcGroup;
