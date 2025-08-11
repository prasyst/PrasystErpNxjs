'use client'
import React, { useEffect, useRef, useState } from 'react';
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
// import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

// import { getFormMode } from '../../../../lib/helpers';
// import axiosInstance from '../../../../lib/axios';
// import CrudButton from '../../../../Global Function/CrudButton';
// import PrintPrdGrpData from './PrintPrdGrpData';
// import { pdf } from '@react-pdf/renderer';
import { getFormMode } from '@/lib/helpers';
import axiosInstance from '@/lib/axios';
import CrudButton from '@/GlobalFunction/CrudButton';
import debounce from 'lodash.debounce';

const FORM_MODE = getFormMode();
const ProductGrp = () => {
    // const location = useLocation();
   
    // const navigate = useNavigate();
     const router = useRouter();
    const [currentPRODGRP_KEY, setCurrentPRODGRP_KEY] = useState(null);
    const [form, setForm] = useState({
        SearchByCd: '',
        SERIES: '',
        PRODGRP_CODE: '',
        PRODGRP_KEY: '',  //CODE
        PRODGRP_NAME: '',  //CATEGORY NAME
        PRODGRP_ABRV: '',
        ProdGrp_LST_CODE: '',
        Status: FORM_MODE.add ? "1" : "0",
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const contentRef = useRef(null);
    const PRODGRP_KEYRef = useRef(null);
    const ProdGrp_NAMERef = useRef(null);
    const PRODGRP_ABRVRef = useRef(null);
    const SERIESRef = useRef(null);
    const [mode, setMode] = useState(() => {
        currentPRODGRP_KEY ? FORM_MODE.read : FORM_MODE.add
    });
    const [Status, setStatus] = useState("1");
    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
    const CO_ID = localStorage.getItem('CO_ID');
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('USER_NAME');
    const PARTY_KEY = localStorage.getItem('PARTY_KEY');
    const COBR_ID = localStorage.getItem('COBR_ID');

    const handleChangeStatus = (event) => {
        const updatedStatus = event.target.checked ? "1" : "0";
        setStatus(updatedStatus);
        setFormData((prevData) => ({
            ...prevData,
            Status: updatedStatus
        }))
    };

    const fetchRetriveData = async (currentPRODGRP_KEY, flag = "R", isManualSearch = false) => {
        try {
            const response = await axiosInstance.post('ProdGrp/RetriveProdGrp', {
                "FLAG": flag,
                "TBLNAME": "ProdGrp",
                "FLDNAME": "PRODGRP_KEY",
                "ID": currentPRODGRP_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const categoryData = DATA[0];
                setForm({
                    PRODGRP_KEY: categoryData.PRODGRP_KEY,
                    PRODGRP_NAME: categoryData.PRODGRP_NAME,
                    PRODGRP_ABRV: categoryData.PRODGRP_ABRV || '',
                    PRODGRP_CODE: categoryData.PRODGRP_CODE || '',
                    SERIES: categoryData.SERIES || '',
                    ProdGrp_LST_CODE: categoryData.ProdGrp_LST_CODE || '',
                    Status: categoryData.STATUS,
                });
                setStatus(DATA[0].STATUS);
                setCurrentPRODGRP_KEY(categoryData.PRODGRP_KEY);
            } else {
                if (isManualSearch) {
                    toast.error(`${MESSAGE} FOR ${currentPRODGRP_KEY}`);
                    setForm({
                        PRODGRP_KEY: '',
                        PRODGRP_NAME: '',
                        PRODGRP_ABRV: '',
                        PRODGRP_CODE: '',
                        SERIES: '',
                        ProdGrp_LST_CODE: '',
                        Status: 0,
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (location.state && location.state.PRODGRP_KEY) {
            setCurrentPRODGRP_KEY(location.state.PRODGRP_KEY);
            console.log("Location state:", location.state);
            console.log("PRODGRPKEY", location.state.PRODGRP_KEY);
            fetchRetriveData(location.state.PRODGRP_KEY);
            setMode(FORM_MODE.read);
        } else {
            setForm({
                SearchByCd: '',
                SERIES: '',
                PRODGRP_CODE: '',
                PRODGRP_KEY: '',  //CODE
                PRODGRP_NAME: '',  //CATEGORY NAME
                PRODGRP_ABRV: '',
                ProdGrp_LST_CODE: '',
                Status: FORM_MODE.add ? "1" : "0",
            });
            setMode(FORM_MODE.read);
        }
    }, [location]);

    const handleSubmit = async () => {
        try {
            const UserName = userRole === 'user' ? username : PARTY_KEY;

            let url;

            if (mode === FORM_MODE.edit && currentPRODGRP_KEY) {
                url = `ProdGrp/UpdateProdGrp?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            } else {
                url = `ProdGrp/InsertProdGrp?UserName=${(UserName)}&strCobrid=${COBR_ID}`;
            }
            const payload = {
                PRODGRP_KEY: form.PRODGRP_KEY,  //CODE
                PRODGRP_CODE: form.PRODGRP_CODE, //ALT CODE
                PRODGRP_NAME: form.PRODGRP_NAME, //PRODGRP NAME
                PRODGRP_ABRV: form.PRODGRP_ABRV,
                STATUS: form.Status ? "1" : "0",
            };

            let response;
            if (mode == FORM_MODE.edit && currentPRODGRP_KEY) {
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
                        PRODGRP_KEY: '',
                        PRODGRP_NAME: '',
                        PRODGRP_ABRV: '',
                        SR_CODE: '',
                        SEGMENT_KEY: '',
                        PRODGRP_CODE: '',
                        SERIES: '',
                        ProdGrp_LST_CODE: '',
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
            await fetchRetriveData(currentPRODGRP_KEY, "R");
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
                "MODULENAME": "ProdGrp",
                "TBLNAME": "ProdGrp",
                "FLDNAME": "ProdGrp_KEY",
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
                    PRODGRP_KEY: id,
                    ProdGrp_LST_CODE: lastId
                }));
            } else {
                toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

                setForm((prevForm) => ({
                    ...prevForm,
                    PRODGRP_KEY: '',
                    ProdGrp_LST_CODE: ''
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
                PRODGRP_KEY: '',
                ProdGrp_LST_CODE: ''
            }));
            return;
        };
        debouncedApiCall(newSeries);
    }
    const handleAdd = async () => {
        console.log("handleAdd called");
        setMode(FORM_MODE.add);
        setCurrentPRODGRP_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            PRODGRP_NAME: '',
            PRODGRP_ABRV: '',
            SearchByCd: '',
            PRODGRP_CODE: '',
            Status: '1',
        }));

        let cprefix = '';
        try {
            const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
                "MODULENAME": "ProdGrp",
                "TBLNAME": "ProdGrp",
                "FLDNAME": "PRODGRP_KEY",
                "NCOLLEN": 0,
                "CPREFIX": "",
                "COBR_ID": COBR_ID,
                "FCYR_KEY": FCYR_KEY,
                "TRNSTYPE": "M",
                "SERIESID": 162,
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
                "MODULENAME": "ProdGrp",
                "TBLNAME": "ProdGrp",
                "FLDNAME": "PRODGRP_KEY",
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
                    PRODGRP_KEY: id,
                    ProdGrp_LST_CODE: lastId
                }));
            }
        } catch (error) {
            console.error("Error fetching ID and LASTID:", error);
        }
    };
    const handlePrevious = async () => {
        await fetchRetriveData(currentPRODGRP_KEY, "P");
        setForm((prev) => ({
            ...prev,
            SearchByCd: ''
        }));
    };
    const handleNext = async () => {
        if (currentPRODGRP_KEY) {
            await fetchRetriveData(currentPRODGRP_KEY, "N");
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
            const UserName = userRole === 'user' ? username : PARTY_KEY;
            const response = await axiosInstance.post(`ProdGrp/DeleteProdGrp?UserName=${(UserName)}&strCobrid=${COBR_ID}`, {
                PRODGRP_KEY: form.PRODGRP_KEY
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchRetriveData(currentPRODGRP_KEY, 'P');
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
          const response = await axiosInstance.post(`/ProdGrp/GetProdGrpDashBoard?currentPage=1&limit=5000`, {
              "SearchText": ""
          });
          const { data: { STATUS, DATA } } = response; // Extract DATA
          if (STATUS === 0 && Array.isArray(DATA)) {
              const formattedData = DATA.map(row => ({
                  ...row,
                  STATUS: row.STATUS === "1" ? "Active" : "Inactive"
              }));
  
              // Generate the PDF blob
              const asPdf = pdf(<PrintPrdGrpData rows={formattedData} />);
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

    const handleExit = () => {
        //  navigate("/masters/products/product-grp-table")
        // router.push('/masters/products/product-grp-table');
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
                    <Grid container alignItems="center"
                        justifyContent="space-between" spacing={2} sx={{ marginTop: "30px", marginInline: '20px' }}>
                        <Grid sx={{ display: 'flex', justifyContent: {
                                xs: 'center',
                                sm: 'flex-start'
                            },
                            width: { xs: '100%', sm: 'auto' }, }}>
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" size="small" className="three-d-button-previous"
                                    sx={{
                                        backgroundColor: "#635BFF"
                                    }}
                                    onClick={handlePrevious}
                                    disabled={
                                        mode !== FORM_MODE.read || !currentPRODGRP_KEY || currentPRODGRP_KEY === 1
                                    }
                                >
                                    <KeyboardArrowLeftIcon />
                                </Button>
                                <Button variant="contained" size="small" className="three-d-button-next"
                                    sx={{
                                        backgroundColor: "#635BFF"
                                    }}
                                    onClick={handleNext}
                                    disabled={mode !== FORM_MODE.read || !currentPRODGRP_KEY}
                                >
                                    <NavigateNextIcon />
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography align="center" variant="h5">
                                Product Group Master
                            </Typography>
                        </Grid>
                        <Grid>
                            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} >
                                <CrudButton
                                    mode={mode}
                                    onAdd={handleAdd}
                                    onEdit={handleEdit}
                                    onView={handlePrint}
                                    onDelete={handleDelete}
                                    onExit={handleExit}
                                    readOnlyMode={mode === FORM_MODE.read}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', flexDirection: 'column',    gap: { xs: 1.5, sm: 1.5, md: 2 },
                            marginInline: { xs: '5%', sm: '10%', md: '25%' },
                            marginBlock: { xs: '15px', sm: '20px', md: '30px' }, }}>
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

                        <Box sx={{ display: 'flex',   flexDirection: { xs: 'column', sm: 'row', md: 'row' }, justifyContent: 'space-between',  gap: { xs: 1, sm: 1, md: 1 }}}>
                            <TextField
                                label="Series"
                                inputRef={SERIESRef}
                                sx={{ width: { xs: '100%', sm: '50%', md: '32%' }}}
                                disabled={mode === FORM_MODE.read}
                                fullWidth
                                className="custom-textfield"
                                value={form.SERIES}
                                onChange={(e) => handleManualSeriesChange(e.target.value)}
                            />
                            <TextField
                                label="Last Cd"
                               sx={{ width: { xs: '100%', sm: '50%', md: '32%' }}}
                                disabled={true}
                                fullWidth
                                className="custom-textfield"
                                value={form.ProdGrp_LST_CODE}
                                onChange={(e) => setForm({ ...form, ProdGrp_LST_CODE: e.target.value })}
                            />
                            <TextField
                                label="Code"
                                inputRef={PRODGRP_KEYRef}
                                sx={{ width: { xs: '100%', sm: '50%', md: '32%' }}}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.PRODGRP_KEY}
                                onChange={(e) => setForm({ ...form, PRODGRP_KEY: e.target.value })}
                            />

                        </Box>

                        <Box  sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1, md: 1 },
                            }}>

                            <TextField
                                inputRef={ProdGrp_NAMERef}
                                label=" Name"
                                // label={
                                //     <span>
                                //         Name<span style={{ color: "red" }}>*</span>
                                //     </span>
                                // }
                                sx={{ width: '100%' }}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.PRODGRP_NAME}
                                onChange={(e) => setForm({ ...form, PRODGRP_NAME: e.target.value })}
                            />
                        </Box>
                        <Box  sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'space-between',
                                gap: { xs: 1, sm: 1, md: 1 },
                            }}>

                            <TextField
                                label="Abbreviation"
                                inputRef={PRODGRP_ABRVRef}
                                 sx={{ width: { xs: '100%', sm: '40%', md: '30%' }}}
                                disabled={mode === FORM_MODE.read}
                                className="custom-textfield"
                                value={form.PRODGRP_ABRV}
                                onChange={(e) => setForm({ ...form, PRODGRP_ABRV: e.target.value })}
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
                    {/* Submit / Cancel Buttons */}
                    <Grid item xs={12} className="form_button"   sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', sm: 'flex-end' },
                            gap: { xs: 1, sm: 1.5 },
                            padding: { xs: 1, sm: 2, md: 3 },
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
export default ProductGrp;
