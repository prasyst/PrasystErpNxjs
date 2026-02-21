import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box, Grid, TextField, Typography, Button, Stack, FormControlLabel, Checkbox,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Autocomplete,
} from '@mui/material';
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import CrudButton from '@/GlobalFunction/CrudButton';
import { TbListSearch } from "react-icons/tb";
import { pdf } from '@react-pdf/renderer';
import { toast, ToastContainer } from 'react-toastify';
import PrintProdSrDt from './PrintProdSrDt';
import CustomAutocomplete from '@/GlobalFunction/CustomAutoComplete/CustomAutoComplete';
import ConfirmDelDialog from '@/GlobalFunction/ConfirmDelDialog';

const FORM_MODE = getFormMode();
const ProdSrMst = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const PRODSRMST_ID = searchParams.get('PRODSRMST_ID');

    const [currentPRODSRMST_ID, setCurrentPRODSRMST_ID] = useState(null);
    const [form, setForm] = useState({
        FGPRD_KEY: '',  //CODE
        SERIES: '',
        SearchByCd: '',
        REMK: '',
        PRODSRMST_ID: '',
        MRP: '',
        WSP: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [mode, setMode] = useState(() => {
        currentPRODSRMST_ID ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');
    const CO_ID = localStorage.getItem('CO_ID');
    const [prod, setProd] = useState([]);

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };

    const fetchRetriveData = useCallback(async (currentPRODSRMST_ID, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('PRODSRMST/RetrivePRODSRMST', {
                "FLAG": flag,
                "TBLNAME": "PRODSRMST",
                "FLDNAME": "PRODSRMST_ID",
                "ID": currentPRODSRMST_ID,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const prodsrData = DATA[0];
                setForm({
                    FGPRD_KEY: prodsrData.FGPRD_KEY,
                    SERIES: prodsrData.SERIES,
                    PRODSRMST_ID: prodsrData.PRODSRMST_ID || '',
                    MRP: prodsrData.MRP || '0.00',
                    WSP: prodsrData.WSP || '0.00',
                    REMK: prodsrData.REMK || '',
                    Status: prodsrData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentPRODSRMST_ID(prodsrData.PRODSRMST_ID);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentPRODSRMST_ID}`);
                    setForm({
                        FGPRD_KEY: '',
                        SERIES: '',
                        Abrv: '',
                        PRODSRMST_ID: '',
                        MRP: '',
                        WSP: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [CO_ID]);

    useEffect(() => {
        if (PRODSRMST_ID) {
            setCurrentPRODSRMST_ID(PRODSRMST_ID);
            fetchRetriveData(PRODSRMST_ID);
            setMode(FORM_MODE.read);
        } else {
            setForm({
                SearchByCd: '',
                FGPRD_KEY: '',
                SERIES: '',
                SearchByCd: '',
                PRODSRMST_ID: '',
                MRP: '',
                WSP: '',
                Status: '1',
            })
            setMode(FORM_MODE.read);
        }
        setMode(FORM_MODE.read);
    }, [PRODSRMST_ID, fetchRetriveData]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.post('Product/GetFgPrdDrp', {
                    FLAG: ""
                })
                if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                    setProd(response.data.DATA);
                } else {
                    setProd([]);
                }
            } catch (error) {
                toast.error("Error while fetching product.");
            }
        };
        fetchProduct();
    }, []);

    const handleSubmit = async () => {
        try {
            const userRole = localStorage.getItem('userRole');
            const username = localStorage.getItem('USER_NAME');
            const PARTY_KEY = localStorage.getItem('PARTY_KEY');
            const COBR_ID = localStorage.getItem('COBR_ID');
            const UserName = userRole === 'user' ? username : PARTY_KEY;

            let url;

            if (mode === FORM_MODE.edit && currentPRODSRMST_ID) {
                url = `PRODSRMST/UpdatePRODSRMST?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `PRODSRMST/InsertPRODSRMST?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                PRODSRMST_ID: form.PRODSRMST_ID || 0,
                SERIES: form.SERIES,
                MRP: form.MRP || 0.00,
                Wsp: form.WSP || 0.00,
                remk: form.REMK,
                FGPRD_KEY: form.FGPRD_KEY,
                STATUS: form.Status ? "1" : "0",
            };

            let response;

            if (mode == FORM_MODE.edit && currentPRODSRMST_ID) {
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
                        FGPRD_KEY: '',
                        SERIES: '',
                        PRODSRMST_ID: '',
                        MRP: '',
                        WSP: '',
                        REMK: '',
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
            await fetchRetriveData(currentPRODSRMST_ID, "R");
        }
        setMode(FORM_MODE.read);
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentPRODSRMST_ID(null);
        setForm((prevForm) => ({
            ...prevForm,
            SERIES: '',
            Abrv: '',
            SearchByCd: '',
            PRODSRMST_ID: '',
            MRP: '',
            WSP: '',
            Status: '1',
        }));
    };

    const handlePrevious = async () => {
        await fetchRetriveData(currentPRODSRMST_ID, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };

    const handleNext = async () => {
        if (currentPRODSRMST_ID) {
            await fetchRetriveData(currentPRODSRMST_ID, "N");
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
            const response = await axiosInstance.post('PRODSRMST/DeletePRODSRMST', {
                PRODSRMST_ID: form.PRODSRMST_ID
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentPRODSRMST_ID, 'P');
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
            const response = await axiosInstance.post(`PRODSRMST/GetPRODSRMSTDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));

                // Generate the PDF blob
                const asPdf = pdf(<PrintProdSrDt rows={formattedData} />);
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

    const handleExit = () => { router.push("/masterpage?activeTab=products") };

    const handleTable = () => {
        router.push("/masters/products/prodseries/prodtable");
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
        height: { xs: 40, sm: 46, md: 27 },
    };

    const textInputSx = {
        '& .MuiInputBase-root': {
            height: 40,
            fontSize: '14px',
            backgroundColor: '#fff',
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            top: '-8px',
        },
        '& .MuiFilledInput-root': {
            backgroundColor: '#fffff',
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

    const DropInputSx = {
        '& .MuiInputBase-root': {
            height: 40,
            fontSize: '14px',
            backgroundColor: '#fff'
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            top: '-4px',
        },
        '& .MuiFilledInput-root': {
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            overflow: 'hidden',
            height: 40,
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

            <Grid container spacing={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '15%', xl: '5%' },
                }}
            >
                <Grid>
                    <Typography align="center" variant="h6">
                        Catalogue/Product Series Master
                    </Typography>
                </Grid>

                <Grid container spacing={2} justifyContent="space-between"
                    sx={{ marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '0%', xl: '0%' } }}
                >
                    <Grid>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4) !important' }}
                            // disabled={mode !== 'view'}
                            onClick={handlePrevious}
                        >
                            <KeyboardArrowLeftIcon />
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important', ml: 1 }}
                            // disabled={mode !== 'view'}
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
                                backgroundColor: '#f1f7f8',
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
                            onView={handlePrint}
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
                            label="Name"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
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
                            label="MRP"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.MRP}
                            name="MRP"
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
                            label="WSP"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.WSP}
                            name="WSP"
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
                        <Autocomplete
                            id="product-key-autocomplete"
                            options={prod}
                            getOptionLabel={(option) => option.FGPRD_NAME}
                            value={prod.find((item) => item.FGPRD_KEY === form.FGPRD_KEY) || null}
                            onChange={(event, value) => {
                                setForm({
                                    ...form,
                                    FGPRD_KEY: value ? value.FGPRD_KEY : '',
                                });
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Product" name="FGPRD_KEY" fullWidth />
                            )}
                            className="custom-textfield"
                            sx={DropInputSx}
                            disabled={mode === FORM_MODE.read}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Remark"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={form.REMK}
                            name="REMK"
                            disabled={mode === FORM_MODE.read}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 0px',
                                    marginTop: '12px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={mode === FORM_MODE.read}
                                    checked={Status == "1"}
                                    onChange={handleChangeStatus}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: '#635bff',
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
export default ProdSrMst;
