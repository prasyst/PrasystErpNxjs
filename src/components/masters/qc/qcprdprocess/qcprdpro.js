'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Grid, TextField, Typography, Button, FormControlLabel, Checkbox, FormControl, FormLabel, RadioGroup, Radio,
    Autocomplete,
} from '@mui/material';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toast, ToastContainer } from 'react-toastify'
import z from 'zod';
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import CrudButton from '@/GlobalFunction/CrudButton';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import { TbListSearch } from "react-icons/tb";
import { textInputSx } from '../../../../../public/styles/textInputSx';
import ConfirmationDialog from '@/GlobalFunction/DeleteDialog/ConfirmationDialog';
import PrintPrdPr from './printprdpr';
import { inputStyle } from '../../../../../public/styles/inputStyleDrp';
const FORM_MODE = getFormMode();
const qcSubGrpFormSchema = z.object({
    QC_SUBGROUP_KEY: z.string().min(1, "QC Sub Group Name is required"),
    FGPRD_KEY: z.string().min(1, "QC Group is required"),
    PROSTG_KEY: z.string().min(1, "Process  is required"),
    QC_REQ: z.string().min(1, "Qc Req. is required"),
});
const QcPrdPro = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const QC_ID = searchParams.get('QC_ID');
    const [currentQC_ID, setCurrentQC_ID] = useState(null);
    const [form, setForm] = useState({
        QC_SUBGROUP_KEY: '',
        FGPRD_KEY: '',
        PROSTG_KEY: '',
        QC_REQ: 'Y',
        REMARK: '',
        SearchByCd: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const REMARKRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentQC_ID ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const [products, setProducts] = useState([]);
    const [process, setProcess] = useState([]);
    const [qcSubGroups, setQcSubGroups] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.post("/Product/GetFgPrdDrp", {
                    "FLAG": ""
                });
                const { STATUS, DATA } = response.data;
                if (STATUS === 0 && Array.isArray(DATA)) {
                    const validProducts = DATA.filter((p) => p.FGPRD_KEY);
                    setProducts(validProducts);
                    if (!QC_ID && !form.FGPRD_KEY) {
                        setForm((prev) => ({
                            ...prev, FGPRD_KEY: validProducts[0]?.FGPRD_KEY || ""
                        }));
                    }
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching Products:", error);
            }
        };
        fetchProducts();
    }, []);
    useEffect(() => {
        const fetchProcess = async () => {
            try {
                const response = await axiosInstance.post("QC_PRODUCT_PROCESS/Get_PROCESSDrp", {
                    "FGPRD_KEY": "",
                    "PROSTG_KEY": "",
                    "QC_SUBGROUP_KEY": "",
                    "FLAG": ""
                });
                const { STATUS, DATA } = response.data;
                if (STATUS === 0 && Array.isArray(DATA)) {
                    const validProcess = DATA.filter(p => p.PROSTG_KEY);
                    setProcess(validProcess);
                    setForm(prev => ({
                        ...prev,
                        PROSTG_KEY: validProcess[0]?.PROSTG_KEY || ""
                    }));
                } else {
                    setProcess([]);
                }
            } catch (error) {
                console.error("Error fetching Products:", error);
            }
        };
        fetchProcess();
    }, []);
    useEffect(() => {
        const fetchQcSubGroups = async () => {
            try {
                const response = await axiosInstance.post("QC_SUBGROUP/GetQC_SUBGROUPDrp", {
                    "QC_GROUP_KEY": "", "FLAG": ""
                });
                const { STATUS, DATA } = response.data;
                if (STATUS === 0 && Array.isArray(DATA)) {
                    const validsubGroups = DATA.filter(p => p.QC_SUBGROUP_KEY)
                    setQcSubGroups(validsubGroups);
                    setForm(prev => ({
                        ...prev,
                        QC_SUBGROUP_KEY: validsubGroups[0]?.QC_SUBGROUP_KEY || ""
                    }));
                } else {
                    setQcSubGroups([]);
                }
            } catch (error) {
                console.error("Error fetching QC SubGroups:", error);
            }
        };
        fetchQcSubGroups();
    }, []);
    const updateQCIDInUrl = (qcId) => {
        const url = new URL(window.location.href);
        url.searchParams.set("QC_ID", qcId);
        window.history.replaceState({}, "", url.toString());
    };

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setForm((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };
    const fetchRetriveData = useCallback(async (currentQC_ID, flag = "R", isManualSearch = false) => {
        const CO_ID = localStorage.getItem('CO_ID');
        try {
            const response = await axiosInstance.post('QC_PRODUCT_PROCESS/RetriveQC_PRODUCT_PROCESS', {
                "FLAG": flag,
                "TBLNAME": "QC_PRODUCT_PROCESS",
                "FLDNAME": "QC_ID",
                "ID": currentQC_ID,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const qcData = DATA[0];
                setForm({
                    FGPRD_KEY: qcData.FGPRD_KEY,
                    FGPRD_NAME: qcData.FGPRD_NAME,
                    PROSTG_KEY: qcData.PROSTG_KEY,
                    PROSTG_NAME: qcData.PROSTG_NAME,
                    QC_SUBGROUP_KEY: qcData.QC_SUBGROUP_KEY,
                    QC_SUBGROUP_NAME: qcData.QC_SUBGROUP_NAME,
                    QC_REQ: qcData.QC_REQ,
                    REMARK: qcData.REMARK || '',
                    Status: qcData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentQC_ID(qcData.QC_ID);
                return qcData;
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentQC_ID}`);
                    setForm((prev) => ({
                        ...prev,
                        FGPRD_KEY: '',
                        PROSTG_KEY: '',
                        QC_SUBGROUP_KEY: '',
                        QC_REQ: 'Y',
                        REMARK: '',
                        SearchByCd: '',
                        Status: '0',
                    }));
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, []);
    useEffect(() => {
        if (QC_ID) {
            setCurrentQC_ID(QC_ID);
            fetchRetriveData(QC_ID);
            setMode(FORM_MODE.read);
        } else {
            setForm((prev) => ({
                ...prev,
                FGPRD_KEY: '',
                PROSTG_KEY: '',
                QC_SUBGROUP_KEY: '',
                QC_REQ: 'Y',
                REMARK: '',
                SearchByCd: '',
                Status: '1',
            }))
            setMode(FORM_MODE.read);
        }
        setMode(FORM_MODE.read);
    }, [QC_ID, fetchRetriveData]);
    const handleSubmit = async () => {
        const result = qcSubGrpFormSchema.safeParse(form);
        if (!result.success) {
            return toast.info("Please fill in all required inputs correctly", {
                autoClose: 1000,
            });
        }
        const USER_NAME = localStorage.getItem('USER_NAME');
        const PARTY_KEY = localStorage.getItem('PARTY_KEY');
        const UserRole = localStorage.getItem('userRole');
        const USER_ID = localStorage.getItem('USER_ID');
        const COBR_ID = localStorage.getItem('COBR_ID');
        const { data } = result;
        try {
            const UserName = UserRole === 'user' ? USER_NAME : PARTY_KEY;
            let url;
            if (mode === FORM_MODE.edit && currentQC_ID) {
                url = `QC_PRODUCT_PROCESS/UpdateQC_PRODUCT_PROCESS?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `QC_PRODUCT_PROCESS/InsertQC_PRODUCT_PROCESS?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                QC_ID: 0,
                FGPRD_KEY: data.FGPRD_KEY,
                PROSTG_KEY: data.PROSTG_KEY,
                QC_SUBGROUP_KEY: form.QC_SUBGROUP_KEY,
                QC_REQ: form.QC_REQ,
                REMARK: form.REMARK,
                STATUS: form.Status ? "1" : "0",
            };
            let response;
            if (mode == FORM_MODE.edit && currentQC_ID) {
                payload.QC_ID = currentQC_ID;
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
                        setCurrentQC_ID(newKey);
                        await fetchRetriveData(newKey, "R");
                        const newParams = new URLSearchParams();
                        newParams.set("QC_ID", newKey);
                        router.replace(`/masters/qc/qcprdprocess/qcprdpro?${newParams.toString()}`);
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
            await fetchRetriveData(currentQC_ID, "R");
        }
        setMode(FORM_MODE.read);
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentQC_ID(null);
        setForm((prevForm) => ({
            ...prevForm,
            FGPRD_KEY: '',
            PROSTG_KEY: '',
            QC_SUBGROUP_KEY: '',
            QC_REQ: 'Y',
            REMARK: '',
            SearchByCd: '',
            Status: '1',
        }));

    };
    const handlePrevious = async () => {
        if (!currentQC_ID) return;
        const data = await fetchRetriveData(currentQC_ID, "P");
        setForm((prev) => ({ ...prev, SearchByCd: '' }));
        if (data?.QC_ID) updateQCIDInUrl(data.QC_ID);
    };
    const handleNext = async () => {
        if (!currentQC_ID) return;
        const data = await fetchRetriveData(currentQC_ID, "N");
        setForm((prev) => ({ ...prev, SearchByCd: '' }));
        if (data?.QC_ID) updateQCIDInUrl(data.QC_ID);
    };
    const handleDelete = () => {
        setOpenConfirmDialog(true);
    }
    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };
    const handleConfirmDelete = async () => {
        setOpenConfirmDialog(false);
        const USER_NAME = localStorage.getItem('USER_NAME');
        const COBR_ID = localStorage.getItem('COBR_ID');
        try {
            const response = await axiosInstance.post(`QC_PRODUCT_PROCESS/DeleteQC_PRODUCT_PROCESS?UserName=${(USER_NAME)}&strCobrid=${COBR_ID}`, {
                QC_ID: currentQC_ID
            });
            const { data: { STATUS, MESSAGE, DATA } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                const prevData = await fetchRetriveData(currentQC_ID, 'P');
                if (prevData?.QC_ID) {
                    updateQCIDInUrl(prevData.QC_ID);
                }
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
    const handlePrint = async () => {
        try {
            const response = await axiosInstance.post(`/QC_PRODUCT_PROCESS/GetQC_PRODUCT_PROCESSDashBoard?currentPage=1&limit=5000`, {
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
        router.push("/masters/qc/qcprdprocess/qcprdprtable/");
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
                            QC Product Process
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
                                disableEdit={!currentQC_ID}
                                disableDelete={!currentQC_ID}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            <Autocomplete
                                id="FGPRD_KEY"
                                options={products}
                                disabled={mode === FORM_MODE.read}
                                getOptionLabel={(option) => option?.FGPRD_NAME || ""}
                                isOptionEqualToValue={(option, value) =>
                                    option.FGPRD_KEY === value.FGPRD_KEY
                                }
                                value={
                                    products.find(
                                        option => option.FGPRD_KEY === form.FGPRD_KEY
                                    ) || null
                                }
                                onChange={(e, newValue) => {

                                    setForm(prev => ({
                                        ...prev,
                                        FGPRD_KEY: newValue ? newValue.FGPRD_KEY : "",
                                        FGPRD_NAME: newValue ? newValue.FGPRD_NAME : ""
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            <span>
                                                Product <span style={{ color: "red" }}>*</span>
                                            </span>
                                        }
                                        sx={inputStyle}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            <Autocomplete
                                id="PROSTG_KEY"
                                options={process}
                                disabled={mode === FORM_MODE.read}
                                getOptionLabel={(option) => option?.PROSTG_NAME || ""}
                                isOptionEqualToValue={(option, value) =>
                                    option.PROSTG_KEY === value.PROSTG_KEY
                                }
                                value={
                                    process.find(
                                        option => option.PROSTG_KEY === form.PROSTG_KEY
                                    ) || null
                                }
                                onChange={(e, newValue) => {
                                    setForm(prev => ({
                                        ...prev,
                                        PROSTG_KEY: newValue ? newValue.PROSTG_KEY : "",
                                        PROSTG_NAME: newValue ? newValue.PROSTG_NAME : ""
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Process"
                                        sx={inputStyle}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            <Autocomplete
                                id="QC_SUBGROUP_KEY"
                                options={qcSubGroups}
                                fullWidth
                                disabled={mode === FORM_MODE.read}
                                getOptionLabel={(option) => option?.QC_SUBGROUP_NAME || ""}
                                isOptionEqualToValue={(option, value) =>
                                    option.QC_SUBGROUP_KEY === value.QC_SUBGROUP_KEY
                                }
                                value={
                                    qcSubGroups.find(
                                        option => option.QC_SUBGROUP_KEY === form.QC_SUBGROUP_KEY
                                    ) || null
                                }
                                onChange={(e, newValue) => {
                                    setForm(prev => ({
                                        ...prev,
                                        QC_SUBGROUP_KEY: newValue ? newValue.QC_SUBGROUP_KEY : "",
                                        QC_SUBGROUP_NAME: newValue ? newValue.QC_SUBGROUP_NAME : ""
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="QC SubGroup Name"
                                        sx={inputStyle}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} container sx={{ display: 'flex', flexDirection: 'row' }}>
                            <FormControl component="fieldset" disabled={mode === FORM_MODE.read} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <FormLabel required sx={{ marginRight: 2 }}>QC Required</FormLabel>
                                <RadioGroup
                                    aria-label="QC Required"
                                    name="QC_REQ"
                                    value={form.QC_REQ}
                                    onChange={(e) => setForm({ ...form, QC_REQ: e.target.value })}
                                    row
                                >
                                    <FormControlLabel value="Y" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="N" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 10 }}>
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
                                    disabled>
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
