'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    Grid, TextField, Typography, Button, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, Box,
    DialogContentText, DialogActions, Autocomplete, CircularProgress
} from '@mui/material';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toast, ToastContainer } from 'react-toastify'
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import CrudButton from '@/GlobalFunction/CrudButton';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { TbListSearch } from "react-icons/tb";

const FORM_MODE = getFormMode();

const textInputSx = {
    '& .MuiInputBase-root': {
        height: 42,
        width: '100%',
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
        height: 42,
        fontSize: '14px',
        width: '100%',
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

const CreateModule = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const MOD_ID = searchParams.get('MOD_ID');
    const modeParam = searchParams.get('mode');
    
    // All hooks must be called in the same order every time
    const [currentMOD_ID, setCurrentMOD_ID] = useState(null);
    const [modules, setModules] = useState([]);
    const [filteredModules, setFilteredModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [Status, setStatus] = useState("1");
    
    const MOD_NAMERef = useRef(null);
    const MOD_DESCRef = useRef(null);
    
    // Get localStorage values safely (client-side only)
    const [CO_ID, setCO_ID] = useState('');
    const [userRole, setUserRole] = useState('');
    const [username, setUsername] = useState('');
    const [PARTY_KEY, setPARTY_KEY] = useState('');
    const [COBR_ID, setCOBR_ID] = useState('');
    
    const [form, setForm] = useState({
        SearchByCd: '',
        MOD_ID: '',
        MOD_NAME: '',
        MOD_DESC: '',
        PARENT_ID: '',
        PARENT_NAME: '',
        MOD_ROUTIG: '',
        MOD_TBLNAME: '',
        Status: "1",
    });

    // Initialize mode based on MOD_ID and mode parameter
    const [mode, setMode] = useState(() => {
        if (MOD_ID) {
            return modeParam === 'edit' ? FORM_MODE.edit : FORM_MODE.read;
        }
        return FORM_MODE.add;
    });

    // Initialize localStorage values after component mounts
    useEffect(() => {
        setCO_ID(localStorage.getItem('CO_ID') || '');
        setUserRole(localStorage.getItem('userRole') || '');
        setUsername(localStorage.getItem('USER_NAME') || '');
        setPARTY_KEY(localStorage.getItem('PARTY_KEY') || '');
        setCOBR_ID(localStorage.getItem('COBR_ID') || '');
    }, []);

    // Fetch all modules for dropdown
    const fetchAllModules = useCallback(async (search = '') => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('Module/GetWebModulesDashBoard?currentPage=1&limit=1000', {
                "SearchText": search
            });

            const { data: { STATUS, DATA } } = response;

            if (STATUS === 0 && Array.isArray(DATA)) {
                // Filter out the current module if in edit mode
                let filteredData = DATA;
                if (mode === FORM_MODE.edit && currentMOD_ID) {
                    filteredData = DATA.filter(module => module.MOD_ID.toString() !== currentMOD_ID.toString());
                }

                setModules(filteredData);
                setFilteredModules(filteredData);
            }
        } catch (err) {
            toast.error("Error loading modules");
        } finally {
            setLoading(false);
        }
    }, [mode, currentMOD_ID]);

    // Debounced search function
    const handleSearchChange = useCallback((event, value) => {
        setSearchText(value);

        // Filter modules based on search text
        if (value) {
            const filtered = modules.filter(module =>
                module.MOD_NAME?.toLowerCase().includes(value.toLowerCase()) ||
                module.MOD_ID?.toString().includes(value)
            );
            setFilteredModules(filtered);
        } else {
            setFilteredModules(modules);
        }
    }, [modules]);

    // Fetch module data for retrieve mode
    const fetchRetriveData = useCallback(async (id, flag = "R", isManualSearch = false) => {
        if (!id) return;
        
        try {
            const response = await axiosInstance.post('Module/RetriveWebModules', {
                FLAG: flag,
                TBLNAME: "WebMODULES",
                FLDNAME: "Mod_ID",
                ID: id,
                ORDERBYFLD: "",
                CWHAER: "",
                CO_ID: CO_ID || ""
            });

            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;

            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE === 1 && DATA.length > 0) {
                const moduleData = DATA[0];

                // Find parent module name
                let parentName = '';
                if (moduleData.PARENT_ID && moduleData.PARENT_ID !== "0") {
                    try {
                        const parentResponse = await axiosInstance.post('Module/RetriveWebModules', {
                            FLAG: "R",
                            TBLNAME: "WebMODULES",
                            FLDNAME: "Mod_ID",
                            ID: moduleData.PARENT_ID,
                            ORDERBYFLD: "",
                            CWHAER: "",
                            CO_ID: CO_ID || ""
                        });

                        if (parentResponse.data.STATUS === 0 && parentResponse.data.DATA && parentResponse.data.DATA.length > 0) {
                            parentName = parentResponse.data.DATA[0]?.MOD_NAME || '';
                        }
                    } catch (parentErr) {
                        console.error("Error fetching parent module:", parentErr);
                    }
                }

                setForm({
                    MOD_ID: moduleData.MOD_ID?.toString() || '',
                    MOD_NAME: moduleData.MOD_NAME || '',
                    MOD_DESC: moduleData.MOD_DESC || '',
                    PARENT_ID: moduleData.PARENT_ID?.toString() || '',
                    PARENT_NAME: parentName,
                    MOD_ROUTIG: moduleData.MOD_ROUTIG || '',
                    MOD_TBLNAME: moduleData.MOD_TBLNAME || '',
                    Status: moduleData.STATUS || "0",
                    SearchByCd: ''
                });
                setStatus(moduleData.STATUS || "0");
                setCurrentMOD_ID(moduleData.MOD_ID);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE || 'No data found'} for ID: ${id}`);
                    resetForm();
                }
            }
        } catch (err) {
            console.error("Error fetching module data:", err);
            toast.error("Error fetching module data");
        }
    }, [CO_ID]);

    // Reset form function
    const resetForm = useCallback(() => {
        setForm({
            SearchByCd: '',
            MOD_ID: '',
            MOD_NAME: '',
            MOD_DESC: '',
            PARENT_ID: '',
            PARENT_NAME: '',
            MOD_ROUTIG: '',
            MOD_TBLNAME: '',
            Status: "1",
        });
        setStatus("1");
        setCurrentMOD_ID(null);
        setSearchText('');
    }, []);

    // Initial load
    useEffect(() => {
        fetchAllModules();
    }, [fetchAllModules]);

    // Load data when MOD_ID changes
    useEffect(() => {
        if (MOD_ID) {
            setCurrentMOD_ID(MOD_ID);
            fetchRetriveData(MOD_ID);
            setMode(modeParam === 'edit' ? FORM_MODE.edit : FORM_MODE.read);
        } else {
            resetForm();
            setMode(FORM_MODE.add);
        }
    }, [MOD_ID, modeParam, fetchRetriveData, resetForm]);

    // Update parent name when modules are loaded and PARENT_ID exists
    useEffect(() => {
        if (form.PARENT_ID && modules.length > 0) {
            const parentModule = modules.find(m => m.MOD_ID?.toString() === form.PARENT_ID?.toString());
            if (parentModule && parentModule.MOD_NAME !== form.PARENT_NAME) {
                setForm(prev => ({
                    ...prev,
                    PARENT_NAME: parentModule.MOD_NAME
                }));
            }
        }
    }, [modules, form.PARENT_ID, form.PARENT_NAME]);

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setForm((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!form.MOD_NAME.trim()) {
            toast.error("Module Name is required");
            return;
        }

        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            let url, payload;

            if (mode === FORM_MODE.edit && currentMOD_ID) {
                // Update API
                url = `Module/UpdateWebModules?UserName=${UserName}&strCobrid=${COBR_ID}`;
                payload = {
                    Mod_ID: parseInt(currentMOD_ID),
                    Mod_Name: form.MOD_NAME,
                    Mod_Desc: form.MOD_DESC,
                    Mod_Routig: form.MOD_ROUTIG,
                    Mod_TblName: form.MOD_TBLNAME,
                    Parent_ID: form.PARENT_ID || "0",
                    Status: form.Status,
                    CreatedBy: 1
                };

                const response = await axiosInstance.post(url, payload);
                const { STATUS, MESSAGE } = response.data;

                if (STATUS === 0) {
                    setMode(FORM_MODE.read);
                    toast.success(MESSAGE, { autoClose: 1000 });
                    await fetchRetriveData(currentMOD_ID);
                } else {
                    toast.error(MESSAGE, { autoClose: 1000 });
                }
            } else {
                // Insert API
                url = `Module/InsertWebModules?UserName=${UserName}&strCobrid=${COBR_ID}`;
                payload = {
                    Mod_Name: form.MOD_NAME,
                    Mod_Desc: form.MOD_DESC,
                    Mod_Routig: form.MOD_ROUTIG,
                    Mod_TblName: form.MOD_TBLNAME,
                    Parent_ID: form.PARENT_ID || "0",
                    Status: form.Status,
                    CreatedBy: 1
                };

                const response = await axiosInstance.post(url, payload);
                const { STATUS, MESSAGE, DATA } = response.data;

                if (STATUS === 0) {
                    toast.success(MESSAGE, { autoClose: 1000 });
                    const newParams = new URLSearchParams();
                    newParams.set("MOD_ID", DATA);
                    router.push(`/createmodule?${newParams.toString()}`);
                } else {
                    toast.error(MESSAGE, { autoClose: 1000 });
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Error submitting form: " + (error.response?.data?.MESSAGE || error.message));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleParentChange = (event, newValue) => {
        if (newValue) {
            setForm(prev => ({
                ...prev,
                PARENT_ID: newValue.MOD_ID?.toString() || '',
                PARENT_NAME: newValue.MOD_NAME || ''
            }));
        } else {
            setForm(prev => ({
                ...prev,
                PARENT_ID: '',
                PARENT_NAME: ''
            }));
        }
    };

    const handleCancel = async () => {
        if (mode === FORM_MODE.add) {
            resetForm();
            const params = new URLSearchParams();
            router.replace(`/createmodule?${params.toString()}`);
        } else {
            await fetchRetriveData(currentMOD_ID, "R");
        }
        setMode(FORM_MODE.read);
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

    const handleTable = () => {
        router.push("/createmodule/modulestable");
    };

    const handleAdd = () => {
        setMode(FORM_MODE.add);
        setCurrentMOD_ID(null);
        resetForm();
        setForm(prev => ({
            ...prev,
            Status: '1'
        }));
        setStatus('1');

        const params = new URLSearchParams();
        router.replace(`/createmodule?${params.toString()}`);
    };

    const handlePrevious = async () => {
        if (currentMOD_ID) {
            await fetchRetriveData(currentMOD_ID, "P");
        }
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

    const handleNext = async () => {
        if (currentMOD_ID) {
            await fetchRetriveData(currentMOD_ID, "N");
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
            const response = await axiosInstance.post(`Module/DeleteWebModules?UserName=${UserName}&strCobrid=${COBR_ID}`, {
                Mod_ID: parseInt(currentMOD_ID)
            });

            const { data: { STATUS, MESSAGE } } = response;

            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                router.push('/createmodule');
                resetForm();
                setMode(FORM_MODE.add);
            } else {
                toast.error(MESSAGE);
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Error deleting module");
        }
    };

    const handleEdit = () => {
        setMode(FORM_MODE.edit);
        // Update URL to reflect edit mode
        const params = new URLSearchParams();
        if (currentMOD_ID) {
            params.set("MOD_ID", currentMOD_ID);
            params.set("mode", "edit");
            router.replace(`/createmodule?${params.toString()}`);
        }
    };

    const handleExit = () => {
        router.push("/masterpage?activeTab=modules");
    };

    const handleManualSearch = (e) => {
        if (e.key === 'Enter' && form.SearchByCd) {
            fetchRetriveData(form.SearchByCd, 'R', true);
        }
    };

    // Get the selected module object for Autocomplete
    const selectedModule = modules.find(m => m.MOD_ID?.toString() === form.PARENT_ID?.toString()) || null;

    return (
        <Grid
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
                minHeight: '80vh',
                overflowX: 'hidden',
                overflowY: 'auto',
                p: 2
            }}
        >
            <ToastContainer />

            <Grid container spacing={2} sx={{ maxWidth: '1200px', width: '100%' }}>
                <Grid size={{ xs: 12 }}>
                    <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                        <Grid>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4) !important', minWidth: '40px' }}
                                disabled={mode !== FORM_MODE.read}
                                onClick={handlePrevious}
                            >
                                <KeyboardArrowLeftIcon />
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important', ml: 1, minWidth: '40px' }}
                                disabled={mode !== FORM_MODE.read}
                                onClick={handleNext}
                            >
                                <NavigateNextIcon />
                            </Button>
                        </Grid>

                        <Grid>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h6" sx={{ mb: 0 }}>
                                    Module Master
                                </Typography>
                                <TbListSearch
                                    onClick={handleTable}
                                    style={{
                                        color: 'rgb(99, 91, 255)',
                                        width: '32px',
                                        height: '32px',
                                        cursor: 'pointer'
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid>
                            <CrudButton
                                moduleName="Module"
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
                </Grid>

                {/* Form Fields */}
                <Grid size={{ xs: 12 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Autocomplete
                                id="parent-module-autocomplete"
                                options={filteredModules}
                                loading={loading}
                                value={selectedModule}
                                onChange={handleParentChange}
                                onInputChange={handleSearchChange}
                                getOptionLabel={(option) => `${option.MOD_NAME} (${option.MOD_ID})`}
                                isOptionEqualToValue={(option, value) => option.MOD_ID === value?.MOD_ID}
                                disabled={mode === FORM_MODE.read}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Parent Module"
                                        variant="filled"
                                        sx={textInputSx}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                        placeholder="Type to search modules..."
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props}>
                                        <Box>
                                            <Typography variant="body1">
                                                {option.MOD_NAME}
                                            </Typography>
                                        </Box>
                                    </li>
                                )}
                                noOptionsText="No modules found"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label={<span>Module Name<span style={{ color: "red" }}>*</span></span>}
                                inputRef={MOD_NAMERef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.MOD_NAME}
                                name="MOD_NAME"
                                disabled={mode === FORM_MODE.read}
                                sx={textInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 0px',
                                        marginTop: '6px',
                                        fontSize: '12px'
                                    },
                                }}
                            />
                        </Grid>

                        {/* Menu Name */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label="Menu Name"
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.MOD_NAME}
                                name="MENU_NAME"
                                disabled={mode === FORM_MODE.read}
                                sx={textInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 0px',
                                        marginTop: '6px',
                                        fontSize: '12px'
                                    },
                                }}
                            />
                        </Grid>

                        {/* Module Description */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label="Module Description"
                                inputRef={MOD_DESCRef}
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.MOD_DESC}
                                name="MOD_DESC"
                                disabled={mode === FORM_MODE.read}
                                sx={textInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 0px',
                                        marginTop: '6px',
                                        fontSize: '12px'
                                    },
                                }}
                            />
                        </Grid>

                        {/* Module Routing */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label="Module Routing"
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.MOD_ROUTIG}
                                name="MOD_ROUTIG"
                                disabled={mode === FORM_MODE.read}
                                sx={textInputSx}
                                placeholder="/path/to/module"
                                inputProps={{
                                    style: {
                                        padding: '6px 0px',
                                        marginTop: '6px',
                                        fontSize: '12px'
                                    },
                                }}
                            />
                        </Grid>

                        {/* Table Name */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                                label="Table Name"
                                variant="filled"
                                fullWidth
                                onChange={handleInputChange}
                                value={form.MOD_TBLNAME}
                                name="MOD_TBLNAME"
                                disabled={mode === FORM_MODE.read}
                                sx={textInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 0px',
                                        marginTop: '6px',
                                        fontSize: '12px'
                                    },
                                }}
                            />
                        </Grid>

                        {/* Status Checkbox */}
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} display="flex" alignItems="center">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={mode === FORM_MODE.read}
                                        checked={Status === "1"}
                                        onChange={handleChangeStatus}
                                        sx={{
                                            '&.Mui-checked': {
                                                color: '#39ace2',
                                            }
                                        }}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    {mode === FORM_MODE.read && (
                        <>
                            <Button
                                variant="contained"
                                disabled
                                sx={{ mr: 1 }}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="contained"
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
                                onClick={handleSubmit}
                                sx={{
                                    backgroundColor: '#635bff',
                                    color: '#fff',
                                    mr: 1,
                                    '&:hover': { backgroundColor: '#4f4be0' }
                                }}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCancel}
                                sx={{
                                    backgroundColor: '#635bff',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: '#4f4be0' }
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </Grid>
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this module?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button size='small'
                        sx={{
                            backgroundColor: '#b82e2e',
                            color: 'white',
                            '&:hover': { backgroundColor: '#b82e2e' },
                        }}
                        onClick={handleConfirmDelete}
                    >
                        Yes
                    </Button>
                    <Button size='small'
                        sx={{
                            backgroundColor: '#1ea113',
                            color: 'white',
                            '&:hover': { backgroundColor: '#1ea113' },
                        }}
                        onClick={handleCloseConfirmDialog}
                    >
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default CreateModule;