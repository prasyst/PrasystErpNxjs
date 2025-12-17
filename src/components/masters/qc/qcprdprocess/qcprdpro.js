'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Grid,
    TextField,
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
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
import { textInputSx } from '../../../../../public/styles/textInputSx';
import ConfirmationDialog from '@/GlobalFunction/DeleteDialog/ConfirmationDialog';
import AutoVibe from '@/GlobalFunction/CustomAutoComplete/AutoVibe';
import { DropInputSx } from '../../../../../public/styles/dropInputSx';
import PrintPrdPr from './printprdpr';

const FORM_MODE = getFormMode();
const qcSubGrpFormSchema = z.object({
    QC_SUBGROUP_NAME: z.string().min(1, "QC Sub Group Name is required"),
    QC_GROUP_KEY: z.string().min(1, "QC Group Key is required"),
});

const QcPrdPro = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [USER_ID, setUSER_ID] = useState(null);
    const [USER_NAME, setUSER_NAME] = useState(null);
    const [FCYR_KEY, setFCYR_KEY] = useState(null);
    const [COBR_ID, setCOBR_ID] = useState(null);
    const [CO_ID, setCO_ID] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [PARTY_KEY, setPARTY_KEY] = useState(null);
    const QC_SUBGROUP_KEY = searchParams.get('QC_SUBGROUP_KEY');
    const [currentQC_SUBGROUP_KEY, setCurrentQC_SUBGROUP_KEY] = useState(null);
    const [form, setForm] = useState({
        QC_SUBGROUP_KEY: '',
        QC_GROUP_KEY: '',
        REMARK: '',
        SearchByCd: '',
        QC_SUBGROUP_ABRV: '',
        QC_SUBGROUP_NAME: '',
        QC_SUBGROUP_LST_CODE: '',
        SERIES: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const QC_SUBGROUP_KEYRef = useRef(null);
    const QC_GROUP_KEYRef = useRef(null);
    const REMARKRef = useRef(null);
    const QC_SUBGROUP_NAMERef = useRef(null);
    const SERIESRef = useRef(null);
    const QC_SUBGROUP_ABRVRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentQC_SUBGROUP_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const [rows, setRows] = useState([]);
    const [dataForPrint, setDataForPrint] = useState({});
    const [qcGroups, setQcGroups] = useState([]);
    useEffect(() => {
        setUSER_ID(localStorage.getItem('USER_ID'));
        setUSER_NAME(localStorage.getItem('USER_NAME'));
        setFCYR_KEY(localStorage.getItem('FCYR_KEY'));
        setCOBR_ID(localStorage.getItem('COBR_ID'));
        setCO_ID(localStorage.getItem('CO_ID'));
        setUserRole(localStorage.getItem('userRole'));
        setPARTY_KEY(localStorage.getItem('PARTY_KEY'));
    }, []);
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
    useEffect(() => {
        const fetchQcGroups = async () => {
            try {
                const response = await axiosInstance.post("QC_GROUP/GetQC_GROUPDrp", {});
                const { STATUS, DATA } = response.data;
                if (STATUS === 0 && Array.isArray(DATA)) {
                    const validQcGroups = DATA.filter((cat) => cat.QC_GROUP_KEY && cat.QC_GROUP_NAME);
                    setQcGroups(validQcGroups);
                    if (validQcGroups.length > 0) {
                        setForm((prev) => ({ ...prev, CategoryId: validQcGroups[0].QC_GROUP_KEY }));
                    }
                } else {
                    setQcGroups([]);
                }
            } catch (error) {
                console.error("Error fetching qcgroups:", error);
            }
        };
        fetchQcGroups();
    }, []);
    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setForm((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };
    const fetchRetriveData = useCallback(async (currentQC_SUBGROUP_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('QC_SUBGROUP/RetriveQC_SUBGROUP', {
                "FLAG": flag,
                "TBLNAME": "QC_SUBGROUP",
                "FLDNAME": "QC_SUBGROUP_KEY",
                "ID": currentQC_SUBGROUP_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const qcData = DATA[0];
                setForm({
                    QC_SUBGROUP_KEY: qcData.QC_SUBGROUP_KEY,
                    QC_GROUP_KEY: qcData.QC_GROUP_KEY,
                    REMARK: qcData.REMARK || '',
                    QC_SUBGROUP_ABRV: qcData.QC_SUBGROUP_ABRV || '',
                    QC_SUBGROUP_NAME: qcData.QC_SUBGROUP_NAME || '',
                    SERIES: qcData.SERIES || '',
                    QC_SUBGROUP_LST_CODE: qcData.QC_SUBGROUP_LST_CODE || '',
                    Status: qcData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentQC_SUBGROUP_KEY(qcData.QC_SUBGROUP_KEY);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentQC_SUBGROUP_KEY}`);
                    setForm((prev) => ({
                        ...prev,
                        QC_SUBGROUP_KEY: '',
                        QC_GROUP_KEY: '',
                        REMARK: '',
                        QC_SUBGROUP_ABRV: '',
                        QC_SUBGROUP_NAME: '',
                        SERIES: '',
                        QC_SUBGROUP_LST_CODE: '',
                        Status: '0',
                    }));
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID]);
    useEffect(() => {
        if (QC_SUBGROUP_KEY) {
            setCurrentQC_SUBGROUP_KEY(QC_SUBGROUP_KEY);
            fetchRetriveData(QC_SUBGROUP_KEY);
            setMode(FORM_MODE.read);
        } else {
            setForm((prev) => ({
                ...prev,
                SearchByCd: '',
                QC_SUBGROUP_KEY: '',
                QC_GROUP_KEY: '',
                REMARK: '',
                QC_SUBGROUP_ABRV: '',
                QC_SUBGROUP_NAME: '',
                QC_SUBGROUP_LST_CODE: '',
                SERIES: '',
                Status: '1',
            }))
            setMode(FORM_MODE.add);
        }
    }, [QC_SUBGROUP_KEY, fetchRetriveData]);
    const handleSubmit = async () => {
        const result = qcSubGrpFormSchema.safeParse(form);
        if (!result.success) {
            return toast.info("Please fill in all required inputs correctly", {
                autoClose: 1000,
            });
        }
        const { data } = result;
        try {
            if (!USER_NAME || !COBR_ID || !userRole || !PARTY_KEY) {
                toast.error("User data not loaded yet. Please try again.");
                return;
            }
            const UserName = userRole === 'user' ? USER_NAME : PARTY_KEY;
            let url;
            if (mode === FORM_MODE.edit && currentQC_SUBGROUP_KEY) {
                url = `QC_SUBGROUP/UpdateQC_SUBGROUP?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `QC_SUBGROUP/InsertQC_SUBGROUP?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                QC_SUBGROUP_KEY: form.QC_SUBGROUP_KEY,
                QC_SUBGROUP_NAME: form.QC_SUBGROUP_NAME,
                QC_SUBGROUP_ABRV: form.QC_SUBGROUP_ABRV,
                QC_GROUP_KEY: data.QC_GROUP_KEY,
                REMARK: form.REMARK,
                STATUS: form.Status ? "1" : "0",
            };
            let response;
            if (mode == FORM_MODE.edit && currentQC_SUBGROUP_KEY) {
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
                        setCurrentQC_SUBGROUP_KEY(newKey);
                        await fetchRetriveData(newKey, "R");
                        const newParams = new URLSearchParams();
                        newParams.set("QC_SUBGROUP_KEY", newKey);
                        router.replace(`/masters/qc/qcsubgrp/qcsubgroup?${newParams.toString()}`);
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
            await fetchRetriveData(currentQC_SUBGROUP_KEY, "R");
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
                "MODULENAME": "QC_SUBGROUP",
                "TBLNAME": "QC_SUBGROUP",
                "FLDNAME": "QC_SUBGROUP_KEY",
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
                    QC_SUBGROUP_KEY: id,
                    QC_SUBGROUP_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`);

                setForm((prevForm) => ({
                    ...prevForm,
                    QC_SUBGROUP_KEY: '',
                    QC_SUBGROUP_LST_CODE: ''
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
                QC_SUBGROUP_KEY: '',
                QC_SUBGROUP_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    }
    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentQC_SUBGROUP_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            QC_GROUP_KEY: '',
            REMARK: '',
            SearchByCd: '',
            QC_SUBGROUP_ABRV: '',
            QC_SUBGROUP_NAME: '',
            Status: '1',
        }));
        // Step 1: Fetch CPREFIX value from the first API
        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                MODULENAME: "QC_SUBGROUP",
                TBLNAME: "QC_SUBGROUP",
                FLDNAME: "QC_SUBGROUP_KEY",
                NCOLLEN: 0,
                CPREFIX: "", // Initially empty
                COBR_ID: COBR_ID,
                FCYR_KEY: FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 27,
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
                MODULENAME: "QC_SUBGROUP",
                TBLNAME: "QC_SUBGROUP",
                FLDNAME: "QC_SUBGROUP_KEY",
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
                    QC_SUBGROUP_KEY: id,
                    QC_SUBGROUP_LST_CODE: lastId
                }));
            }
        } catch (error) {
            console.error("Error fetching ID and LASTID:", error);
        }
    };
    const handlePrevious = async () => {
        await fetchRetriveData(currentQC_SUBGROUP_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleNext = async () => {
        if (currentQC_SUBGROUP_KEY) {
            await fetchRetriveData(currentQC_SUBGROUP_KEY, "N");
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
            const response = await axiosInstance.post(`QC_SUBGROUP/DeleteQC_SUBGROUP?UserName=${(USER_NAME)}&strCobrid=${COBR_ID}`, {
                QC_SUBGROUP_KEY: currentQC_SUBGROUP_KEY
            });
            const { data: { STATUS, MESSAGE, DATA } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentQC_SUBGROUP_KEY, 'P');
            } else {
                if (DATA && DATA.length > 1) {
                    const firstMsg = DATA[0]?.MSG || "";
                    const remainingMsgs = DATA.slice(1).map(item => {
                        const secondMsg = item.MSG || "";
                        if (secondMsg.startsWith(firstMsg)) {
                            return secondMsg.replace(firstMsg, "").trim();
                        }
                        return secondMsg;
                    }).join(" ,");
                    const finalMessage = `${firstMsg} ,${remainingMsgs}`;
                    toast.error(finalMessage);
                } else {
                    toast.error(DATA?.[0]?.MSG || MESSAGE);
                }
            }
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };
    const handleEdit = () => {
        setMode(FORM_MODE.edit);
    };
    const handleAddClick = () => {
        const url = '/masters/qc/qcgrp/qcgroup/';
        window.open(url, '_blank');
    };
    const handlePrint = async () => {
        try {
            const response = await axiosInstance.post(`/QC_SUBGROUP/GetQC_SUBGROUPDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));
                const asPdf = pdf(<PrintPrdPr rows={formattedData} />);
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
        router.push("/masters/qc/qcsubgrp/qcsubgrptable/");
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
                            QC Sub Group
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
                                value={form.QC_SUBGROUP_LST_CODE}
                                name="QC_SUBGROUP_LST_CODE"
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
                                label={
                                    <span>
                                        Code <span style={{ color: 'red' }}>*</span>
                                    </span>
                                }
                                inputRef={QC_SUBGROUP_KEYRef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.QC_SUBGROUP_KEY}
                                name="QC_SUBGROUP_KEY"
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
                                        QC SubGroup Name<span style={{ color: "red" }}>*</span>
                                    </span>
                                }
                                inputRef={QC_SUBGROUP_NAMERef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.QC_SUBGROUP_NAME}
                                name="QC_SUBGROUP_NAME"
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
                                label="QC SubGroup Abrv"
                                inputRef={QC_SUBGROUP_ABRVRef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.QC_SUBGROUP_ABRV}
                                name="QC_SUBGROUP_ABRV"
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
                            <AutoVibe
                                id="QC_GROUP_KEY"
                                disabled={mode === FORM_MODE.read}
                                options={qcGroups}
                                getOptionLabel={(option) => option.QC_GROUP_NAME || ""}
                                label={
                                    <span>
                                        QC Group Name <span style={{ color: 'red' }}>*</span>
                                    </span>
                                }
                                name="QC_GROUP_KEY"
                                value={qcGroups.find(option => String(option.QC_GROUP_NAME) === String(form.QC_GROUP_KEY)) || null || ""}
                                onChange={(e, newValue) => {
                                    const selectedName = newValue ? newValue.QC_GROUP_NAME : '';
                                    const selectedId = newValue ? newValue.QC_GROUP_KEY : '';
                                    setForm((prevForm) => {
                                        const updatedForm = {
                                            ...prevForm,
                                            QC_GROUP_NAME: selectedName,
                                            QC_GROUP_KEY: selectedId
                                        };
                                        //   if (selectedName && prevForm.FGPRD_ABRV) {
                                        //     updatedForm.QC_GROUP_NAME = selectedName + prevForm.FGPRD_ABRV;
                                        //   }
                                        return updatedForm;
                                    });
                                }}
                                sx={DropInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 8px',
                                        fontSize: '12px',
                                    },
                                }}
                                onAddClick={handleAddClick}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                label="Remark"
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
                                                color: '#635bff',
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
                                    onClick={handleAdd} >
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
export default QcPrdPro;
