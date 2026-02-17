'use client'
import React, { useRef, useState, useEffect, useCallback } from 'react';
import CrudButton from '@/GlobalFunction/CrudButton';
import ConfirmDelDialog from '@/GlobalFunction/ConfirmDelDialog';
import {
    Grid, Typography, Button, TextField, FormControlLabel, Checkbox,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { TbListSearch } from "react-icons/tb";
import debounce from 'lodash.debounce';
import { getFormMode } from '@/lib/helpers';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { pdf } from '@react-pdf/renderer';
import PrintShadeDt from './PrintShadeDt';

const FORM_MODE = getFormMode();

const textInputSx = {
    '& .MuiInputBase-root': { height: 40, fontSize: '14px' },
    '& .MuiInputLabel-root': { fontSize: '14px', top: '-8px' },
    '& .MuiFilledInput-root': {
        backgroundColor: '#fafafa',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        overflow: 'hidden',
        height: 40,
        fontSize: '14px',
    },
    '& .MuiFilledInput-root:before': { display: 'none' },
    '& .MuiFilledInput-root:after': { display: 'none' },
    '& .MuiInputBase-input': {
        padding: '10px 12px !important',
        fontSize: '14px !important',
        lineHeight: '1.4',
    },
    '& .MuiFilledInput-root.Mui-disabled': { backgroundColor: '#fff' },
};

const ShadeMst = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const FGSHADE_KEY = searchParams.get('FGSHADE_KEY');
    const [currentSHADE_KEY, setCurrentSHADE_KEY] = useState(null);
    const [mode, setMode] = useState(FORM_MODE.read);
    const [Status, setStatus] = useState("1");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        FGSHADE_ALT_CODE: '',
        FGSHADE_KEY: '',
        FGSHADE_NAME: '',
        FGSHADE_ABRV: '',
        FGSHADE_LST_CODE: '',
        Status: "1",
    });

    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const CO_ID = localStorage.getItem('CO_ID');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('USER_NAME');
    const PARTY_KEY = localStorage.getItem('PARTY_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');
    const FGSHADE_KEYRef = useRef(null);
    const FGSHADE_NAMERef = useRef(null);
    const FGSHADE_ABRVRef = useRef(null);
    const FGSHADE_ALT_CODERef = useRef(null);
    const SERIESRef = useRef(null);

    const fetchRetriveData = useCallback(
        async (id, flag = "R", isManualSearch = false) => {
            try {
                const res = await axiosInstance.post('Fgshade/RetriveFGSHADE', {
                    FLAG: flag,
                    TBLNAME: "FGSHADE",
                    FLDNAME: "FGSHADE_KEY",
                    ID: id,
                    ORDERBYFLD: "",
                    CWHAER: "",
                    CO_ID,
                });

                const { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } = res.data;

                if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE === 1) {
                    const d = DATA[0];
                    setForm({
                        SearchByCd: '',
                        SERIES: d.SERIES || '',
                        FGSHADE_ALT_CODE: d.FGSHADE_ALT_CODE || '',
                        FGSHADE_KEY: d.FGSHADE_KEY,
                        FGSHADE_NAME: d.FGSHADE_NAME,
                        FGSHADE_ABRV: d.FGSHADE_ABRV || '',
                        FGSHADE_LST_CODE: d.FGSHADE_LST_CODE || '',
                        Status: d.STATUS,
                    });
                    setStatus(d.STATUS);
                    setCurrentSHADE_KEY(d.FGSHADE_KEY);
                } else if (isManualSearch) {
                    toast.error(`${MESSAGE || 'Not found'} → ${id}`);
                    setForm({
                        SearchByCd: '',
                        SERIES: '',
                        FGSHADE_ALT_CODE: '',
                        FGSHADE_KEY: '',
                        FGSHADE_NAME: '',
                        FGSHADE_ABRV: '',
                        FGSHADE_LST_CODE: '',
                        Status: "0",
                    });
                }
            } catch (err) {
                console.error(err);
            }
        },
        [CO_ID]
    );

    useEffect(() => {
        if (FGSHADE_KEY) {
            setCurrentSHADE_KEY(FGSHADE_KEY);
            fetchRetriveData(FGSHADE_KEY);
            setMode(FORM_MODE.read);
        } else {
            setMode(FORM_MODE.read);
        }
    }, [FGSHADE_KEY, fetchRetriveData]);

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentSHADE_KEY(null);

        setForm((prev) => ({
            ...prev,
            FGSHADE_NAME: '',
            FGSHADE_ABRV: '',
            FGSHADE_ALT_CODE: '',
            SearchByCd: '',
            Status: '1',
        }));

        let cprefix = '';
        try {
            const res = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                MODULENAME: "FGSHADE",
                TBLNAME: "FGSHADE",
                FLDNAME: "FGSHADE_KEY",
                NCOLLEN: 0,
                CPREFIX: "",
                COBR_ID,
                FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 27,
                FLAG: "Series",
            });

            if (res.data.STATUS === 0 && res.data.DATA?.length) {
                cprefix = res.data.DATA[0].CPREFIX;
                setForm((p) => ({ ...p, SERIES: cprefix }));
            };
        } catch (err) {
            toast.error("Cannot fetch series prefix", err);
            return;
        }

        try {
            const res = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                MODULENAME: "FGSHADE",
                TBLNAME: "FGSHADE",
                FLDNAME: "FGSHADE_KEY",
                NCOLLEN: 5,
                CPREFIX: cprefix,
                COBR_ID,
                FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 0,
                FLAG: "",
            });

            if (res.data.STATUS === 0 && res.data.DATA?.length) {
                const { ID, LASTID } = res.data.DATA[0];
                setForm((p) => ({
                    ...p,
                    FGSHADE_KEY: ID,
                    FGSHADE_LST_CODE: LASTID,
                }));
            }
        } catch (err) {
            console.error("Cannot fetch next code", err);
        }
    };

    const debouncedApiCall = debounce(async (series) => {
        if (!series?.trim()) {
            setForm((p) => ({ ...p, FGSHADE_KEY: '', FGSHADE_LST_CODE: '' }));
            return;
        }

        try {
            const res = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                MODULENAME: "FGSHADE",
                TBLNAME: "FGSHADE",
                FLDNAME: "FGSHADE_KEY",
                NCOLLEN: 5,
                CPREFIX: series,
                COBR_ID,
                FCYR_KEY,
                TRNSTYPE: "M",
                SERIESID: 0,
                FLAG: "",
            });

            if (res.data.STATUS === 0 && res.data.DATA?.length) {
                const { ID, LASTID } = res.data.DATA[0];
                setForm((p) => ({ ...p, FGSHADE_KEY: ID, FGSHADE_LST_CODE: LASTID }));
            } else {
                toast.error(res.data.MESSAGE || "Cannot generate code");
                setForm((p) => ({ ...p, FGSHADE_KEY: '', FGSHADE_LST_CODE: '' }));
            }
        } catch (err) {
            console.error(err);
        }
    }, 400);

    const handleManualSeriesChange = (e) => {
        const val = e.target.value;
        setForm((p) => ({ ...p, SERIES: val }));
        debouncedApiCall(val);
    };

    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            const isEdit = mode === FORM_MODE.edit && currentSHADE_KEY;

            const url = isEdit
                ? `Fgshade/UpdateFGSHADE?UserName=${UserName}&strCobrid=${COBR_ID}`
                : `Fgshade/InsertFGSHADE?UserName=${UserName}&strCobrid=${COBR_ID}`;

            const payload = {
                FGSHADE_KEY: form.FGSHADE_KEY,
                FGSHADE_ALT_CODE: form.FGSHADE_ALT_CODE,
                FGSHADE_NAME: form.FGSHADE_NAME,
                FGSHADE_ABRV: form.FGSHADE_ABRV,
                STATUS: Status,
            };

            if (isEdit) {
                payload.UPDATED_BY = 1;
                payload.UPDATED_DT = new Date().toISOString();
            } else {
                payload.CREATED_BY = 1;
                payload.CREATED_DT = new Date().toISOString();
            }

            const res = await axiosInstance.post(url, payload);
            const { STATUS, MESSAGE } = res.data;

            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 1200 });
                setMode(FORM_MODE.read);
                if (!isEdit) {
                    await fetchRetriveData(1, "L");
                }
            } else {
                toast.error(MESSAGE);
            }
        } catch (err) {
            toast.error("Save failed");
        }
    };

    const handleCancel = async () => {
        if (mode === FORM_MODE.add) {
            await fetchRetriveData(1, "L");
        } else if (currentSHADE_KEY) {
            await fetchRetriveData(currentSHADE_KEY, "R");
        }
        setMode(FORM_MODE.read);
    };

    const handleEdit = () => setMode(FORM_MODE.edit);

    const handlePrint = async () => {
        try {
            const res = await axiosInstance.post(`Fgshade/GetFGSHADEDashBoard?currentPage=1&limit=5000`, {
                SearchText: "",
            });
            const { STATUS, DATA } = res.data;

            if (STATUS === 0 && Array.isArray(DATA)) {
                const formatted = DATA.map((row) => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive",
                }));

                const asPdf = pdf(<PrintShadeDt rows={formatted} />);
                const blob = await asPdf.toBlob();
                const url = URL.createObjectURL(blob);
                const tab = window.open(url, '_blank');
                if (tab) tab.focus();
                setTimeout(() => URL.revokeObjectURL(url), 100);
            }
        } catch (err) {
            toast.error(err);
        }
    };

    const handleExit = () => router.push("/masterpage?activeTab=products");

    const handleTable = () => {
        router.push('/masters/products/shade/shadetable');
    };

    const handleChangeStatus = (e) => {
        const val = e.target.checked ? "1" : "0";
        setStatus(val);
        setForm((p) => ({ ...p, Status: val }));
    };

    const handleConfirmDelete = async () => {
        setOpenConfirmDialog(false);
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            const response = await axiosInstance.post(
                `Fgshade/DeleteFGSHADE?UserName=${UserName}&strCobrid=${COBR_ID}`,
                { FGSHADE_KEY: form.FGSHADE_KEY }
            );
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentSHADE_KEY || 1, 'P');
            } else {
                toast.error(MESSAGE);
            }
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete record");
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
                minHeight: '90vh',
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
        >
            <ToastContainer />

            <Grid
                container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '15%', xl: '5%' },
                }}
                spacing={2}
            >
                <Grid>
                    <Typography align="center" variant="h6">
                        Shade Master
                    </Typography>
                </Grid>

                <Grid
                    container
                    justifyContent="space-between"
                    sx={{ marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '0%', xl: '0%' } }}
                    spacing={2}
                >
                    <Grid>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4) !important' }}
                            disabled={mode !== FORM_MODE.read}
                            onClick={() => fetchRetriveData(currentSHADE_KEY || 1, "P")}
                        >
                            <KeyboardArrowLeftIcon />
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important', ml: 1 }}
                            disabled={mode !== FORM_MODE.read}
                            onClick={() => fetchRetriveData(currentSHADE_KEY, "N")}
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
                        <TbListSearch
                            onClick={handleTable}
                            style={{ color: 'rgb(99, 91, 255)', width: '40px', height: '32px', cursor: 'pointer' }}
                        />
                    </Grid>

                    <Grid sx={{ display: "flex", justifyContent: "end", marginRight: '-6px' }}>
                        <CrudButton
                            moduleName=""
                            mode={mode}
                            onAdd={handleAdd}
                            onView={handlePrint}
                            onEdit={handleEdit}
                            onDelete={() => setOpenConfirmDialog(true)}
                            onExit={handleExit}
                            readOnlyMode={mode === FORM_MODE.read}
                            onPrevious={() => fetchRetriveData(currentSHADE_KEY || 1, "P")}
                            onNext={() => fetchRetriveData(currentSHADE_KEY, "N")}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    </Grid>
                </Grid>

                {/* Form Fields */}
                <Grid container spacing={1}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Series"
                            inputRef={SERIESRef}
                            variant="filled"
                            fullWidth
                            onChange={handleManualSeriesChange}
                            value={form.SERIES || ''}
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{ style: { padding: '6px 0px', marginTop: '10px', fontSize: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Last Cd"
                            variant="filled"
                            fullWidth
                            value={form.FGSHADE_LST_CODE || ''}
                            disabled
                            sx={textInputSx}
                            inputProps={{ style: { padding: '6px 0px', marginTop: '10px', fontSize: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Code"
                            inputRef={FGSHADE_KEYRef}
                            variant="filled"
                            fullWidth
                            value={form.FGSHADE_KEY || ''}
                            onChange={(e) => setForm(p => ({ ...p, FGSHADE_KEY: e.target.value }))}
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{ style: { padding: '6px 0px', marginTop: '10px', fontSize: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Alt Code"
                            inputRef={FGSHADE_ALT_CODERef}
                            variant="filled"
                            fullWidth
                            value={form.FGSHADE_ALT_CODE || ''}
                            onChange={(e) => setForm(p => ({ ...p, FGSHADE_ALT_CODE: e.target.value }))}
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{ style: { padding: '6px 0px', marginTop: '10px', fontSize: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextField
                            inputRef={FGSHADE_NAMERef}
                            label={<span>Shade Name <span style={{ color: "red" }}>*</span></span>}
                            variant="filled"
                            fullWidth
                            value={form.FGSHADE_NAME || ''}
                            onChange={(e) => setForm(p => ({ ...p, FGSHADE_NAME: e.target.value }))}
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{ style: { padding: '6px 0px', marginTop: '10px', fontSize: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Abbreviation"
                            inputRef={FGSHADE_ABRVRef}
                            variant="filled"
                            fullWidth
                            value={form.FGSHADE_ABRV || ''}
                            onChange={(e) => setForm(p => ({ ...p, FGSHADE_ABRV: e.target.value }))}
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{ style: { padding: '6px 0px', marginTop: '10px', fontSize: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={mode === FORM_MODE.read}
                                    checked={Status === '1'}
                                    onChange={handleChangeStatus}
                                    sx={{ '&.Mui-checked': { color: '#39ace2' } }}
                                />
                            }
                            label="Active"
                        />
                    </Grid>
                </Grid>

                <Grid
                    sx={{
                        display: "flex",
                        justifyContent: "end",
                        ml: '56.8%',
                        position: 'relative',
                        top: 10,
                    }}
                >
                    {mode === FORM_MODE.read && (
                        <>
                            <Button
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(290deg, #d4d4d4, #ffffff)',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                disabled
                            >
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(290deg, #a7c5e9, #ffffff)',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
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
                                    backgroundColor: '#635bff',
                                    color: '#fff',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#635bff',
                                    color: '#fff',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </Grid>
            </Grid>

            <ConfirmDelDialog
                open={openConfirmDialog}
                title="Confirm Deletion"
                description="Are you sure you want to delete this item?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenConfirmDialog(false)}
            />
        </Grid>
    );
};

export default ShadeMst;