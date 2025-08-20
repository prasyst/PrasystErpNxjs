import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { getFormMode } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import axiosInstance from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import { toast, ToastContainer } from 'react-toastify';
import PrintProdSrDt from './PrintProdSrDt';
import PaginationButtons from '@/GlobalFunction/PaginationButtons';
import CrudButtons from '@/GlobalFunction/CrudButtons';
import CustomAutocomplete from '@/GlobalFunction/CustomAutoComplete/CustomAutoComplete';

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

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };

    const fetchRetriveData =useCallback(  async (currentPRODSRMST_ID, flag = "R", isManualSearch = false) => {
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
                console.log("prodsrData", prodsrData)
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
    },[CO_ID]);

    // useEffect(() => {
    //     if (location.state && location.state.PRODSRMST_ID) {
    //         setCurrentPRODSRMST_ID(location.state.PRODSRMST_ID);
    //         fetchRetriveData(location.state.PRODSRMST_ID);
    //         setMode(FORM_MODE.read);
    //     } else {
    //         // Stay in read mode with blank data
    //         setForm({
    //             FGPRD_KEY: '',
    //             SERIES: '',
    //             SearchByCd: '',
    //             PRODSRMST_ID: '',
    //             MRP: '',
    //             WSP: '',
    //             Status: '1',
    //         });
    //         setMode(FORM_MODE.read);
    //     }
    // }, [location]);
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
                "PRODSRMST_ID": form.PRODSRMST_ID,
                "SERIES": form.SERIES,
                "MRP": form.MRP,
                "Wsp": form.WSP,
                "remk": form.REMK,
                "FGPRD_KEY": form.FGPRD_KEY,
                "STATUS": form.Status ? "1" : "0",
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
    const handleFirst = () => { }
    const handleLast = async () => {
        await fetchRetriveData(1, "L");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    }
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
    }
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

    // const handlePrint = async () => {
    //     try {
    //         const response = await axiosInstance.post(
    //             `PRODSRMST/GetPRODSRMSTDashBoard?currentPage=1&limit=5000`,
    //             { SearchText: "" }
    //         );

    //         const { data: { STATUS, DATA } } = response;

    //         if (STATUS === 0 && Array.isArray(DATA)) {
    //             PrintProdSrd(DATA);
    //         }
    //     } catch (error) {
    //         console.error("Print Error:", error);
    //     }
    // };
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
    const handleExit = () => { router.push("/masters/products/prodseries/prodtable") };
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
                        spacing={1} sx={{ marginTop: "10px", marginInline: '20px' }}>
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography align="center" variant="h5">
                                Catalogue/Product Series Master
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Form Fields */}
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 1.5, md: 2 },
                        marginInline: { xs: '5%', sm: '10%', md: '25%' },
                        marginTop: { xs: '15px', sm: '20px', md: '10px' },
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
                            display: 'flex', flexDirection: { xs: 'column', sm: 'row', md: 'column' },
                            justifyContent: 'space-between',
                            gap: { xs: 1, sm: 1, md: 1 },
                        }}>
                            <TextField
                                label="Name"
                                sx={{ width: { xs: '100%', sm: '100%', md: '100%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.SERIES}
                                onChange={(e) => setForm({ ...form, SERIES: e.target.value })}
                            />
                            <TextField
                                label="MRP"
                                sx={{ width: { xs: '100%', sm: '100%', md: '100%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.MRP}
                                onChange={(e) => setForm({ ...form, MRP: e.target.value })}
                            />
                            <TextField
                                label="WSP"
                                sx={{ width: { xs: '100%', sm: '100%', md: '100%' } }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.WSP}
                                onChange={(e) => setForm({ ...form, WSP: e.target.value })}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                            justifyContent: 'space-between',
                            gap: { xs: 1, sm: 1, md: 1 },
                        }}>
                            <CustomAutocomplete
                                id="product-key-autocomplete"
                                disabled={true}
                                label="Product"
                                name="FGPRD_KEY"
                                //   options={segmentOptions}
                                value={form.FGPRD_KEY}
                                onChange={(value) => setForm({ ...form, FGPRD_KEY: value })}
                                className="custom-textfield"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                            <TextField
                                label="Remark"
                                sx={{ width: '100%' }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.REMK}
                                onChange={(e) => setForm({ ...form, REMK: e.target.value })}
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
                                    currentKey={currentPRODSRMST_ID}
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
                                    onEdit={mode === FORM_MODE.read ? handleEdit : handleCancel}
                                    onView={handlePrint}
                                    onDelete={handleDelete}
                                    onExit={handleExit}
                                    readOnlyMode={mode === FORM_MODE.read}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                    {/* Submit / Cancel Buttons */}
                    {/* <Grid item xs={12} className="form_button" sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', sm: 'flex-end' },
                        gap: { xs: 1, sm: 1.5 },
                        padding: { xs: 1, sm: 2, md: 3 },
                        marginTop: '0px'
                    }}>
                        {mode === FORM_MODE.read && (
                            <>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: 1,
                                        background: "linear-gradient(290deg, #d4d4d4, #ffffff)",
                                    }}
                                    onClick={handleAdd}
                                    disabled
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: 1,
                                        background: "linear-gradient(290deg, #a7c5e9, #ffffff)",
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
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: 1,
                                        background: "linear-gradient(290deg,   #b9d0e9, #e9f2fa)",
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mr: 1,
                                        background: "linear-gradient(290deg,   #b9d0e9, #e9f2fa)",
                                    }}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Grid> */}
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
export default ProdSrMst;
