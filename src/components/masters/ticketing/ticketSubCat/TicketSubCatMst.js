'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    Grid
} from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CrudButton from '@/GlobalFunction/CrudButton';
import { useSearchParams, useRouter } from 'next/navigation';
import { TbListSearch } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../../../../lib/axios';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AutoVibe from '@/GlobalFunction/CustomAutoComplete/AutoVibe';

const TicketSubCatMst = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        TKTSUBCATNAME: '',
        TKTCATID: '',
        ABRV: '',
        EMP_KEY: '',
        STATUS: '',
        REMARK: ''
    });
    const [isFormDisabled, setIsFormDisabled] = useState(true);
    const [mode, setMode] = useState('view');
    const [cats, setCats] = useState([]);
    const [scats, setSCats] = useState([]);
    const [currentTicSCatId, setCurrentTicSCatId] = useState(null);
    const searchParams = useSearchParams();
    const TicketSubCat = searchParams.get('TKTSUBCATID');
    const CO_ID = localStorage.getItem('CO_ID');

    const fetchTicketSubCatData = useCallback(async (currentTicSCatId, flag = "R") => {

        try {
            const response = await axiosInstance.post(`TktsubCat/RetriveTktsubCat`, {
                "FLAG": flag,
                "TBLNAME": "TktsubCat",
                "FLDNAME": "TKTSUBCATID",
                "ID": currentTicSCatId,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });

            if (response.data.STATUS === 0 && response.data.RESPONSESTATUSCODE === 1) {
                const catSData = response?.data?.DATA[0];

                setFormData({

                    TKTCATID: catSData?.TKTCATID.toString() || "",
                    TKTSUBCATNAME: catSData?.TKTSUBCATNAME || "",
                    ABRV: catSData?.ABRV || "",
                    EMP_KEY: catSData?.EMP_KEY.toString() || "",
                    STATUS: catSData?.STATUS || "",
                    REMARK: catSData?.REMARK || ""

                });

                setIsFormDisabled(true);
                setCurrentTicSCatId(catSData?.TKTSUBCATID);
                const newParams = new URLSearchParams();
                newParams.set("TKTSUBCATID", catSData.TKTSUBCATID);
                router.replace(`/masters/ticketing/ticketSubCat?${newParams.toString()}`);

            } else if (response.data.STATUS === 1 && response.data.RESPONSESTATUSCODE === 2) {
                if (response.data.MESSAGE && response?.data?.DATA) {
                    toast.info(response.data.MESSAGE);
                }
            }
        } catch (error) {
            console.error('Error fetching ticket sub category data:', error);
            toast.error('Error fetching ticket sub category data. Please try again.');
        }
    }, [CO_ID, router]);

    useEffect(() => {
        if (TicketSubCat) {
            setCurrentTicSCatId(TicketSubCat);
            fetchTicketSubCatData(TicketSubCat);
            setMode('view');
        } else {
            setMode('view');
            setFormData({
                TKTSUBCATNAME: '',
                TKTCATID: '',
                ABRV: '',
                EMP_KEY: '',
                STATUS: '',
                REMARK: ''
            });
            setIsFormDisabled(true);
        }
        setMode('view');
    }, [TicketSubCat, fetchTicketSubCatData]);

    useEffect(() => {
        const fetchCat = async () => {
            try {
                const response = await axiosInstance.post(`TktCat/GetTktCatDrp`);
                console.log("API response:", response.data.DATA);
                if (
                    response.data.STATUS === 0 &&
                    response.data.RESPONSESTATUSCODE === 1
                ) {
                    setCats(response.data.DATA);
                } else {
                    toast.error("Failed to fetch Ticket Category Name");
                }
            } catch (error) {
                console.error("Error fetching Ticket Category Name", error);
                toast.error("Error fetching Ticket Category Name. Please try again.");
            }
        };

        fetchCat();
    }, []);

    useEffect(() => {
        const fetchSubCat = async () => {
            try {
                const response = await axiosInstance.post(`Employee/GetEmployeeDrp`,
                    {
                        "FLAG": "TN"
                    }
                );
                console.log("API response:", response.data.DATA);
                if (
                    response.data.STATUS === 0 &&
                    response.data.RESPONSESTATUSCODE === 1
                ) {
                    setSCats(response.data.DATA);
                } else {
                    toast.error("Failed to fetch Employee Name");
                }
            } catch (error) {
                console.error("Error fetching Employee Name", error);
                toast.error("Error fetching Employee Name. Please try again.");
            }
        };

        fetchSubCat();
    }, []);

    const handlePrevious = async () => {
        await fetchTicketSubCatData(currentTicSCatId, "P");
        setFormData((prev) => ({
            ...prev
        }));
    };

    const handleNext = async () => {
        await fetchTicketSubCatData(currentTicSCatId, "N");
        setFormData((prev) => ({
            ...prev
        }));
    };


    const handleDelete = async () => {
        try {
            const response = await axiosInstance.post('TktsubCat/DeleteTktsubCat', {
                TKTSUBCATID: TicketSubCat
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchTicketSubCatData(currentTicSCatId, 'P');
            } else {
                toast.error(MESSAGE);
            }
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAdd = () => {
        setMode('add');
        setIsFormDisabled(false);
        setFormData({
            TKTSUBCATNAME: '',
            TKTCATID: '',
            ABRV: '',
            EMP_KEY: '',
            STATUS: '',
            REMARK: ''
        });
        setCurrentTicSCatId(null);

    };

    const handleEdit = () => {
        setMode("edit");
        setIsFormDisabled(false);
    };

    const handleCancel = async () => {
        try {
            await fetchTicketSubCatData(1, "L");
            setMode('view');
            setIsFormDisabled(true);
            setFormData((prev) => ({
                ...prev
            }));
        } catch (error) {
            toast.error('Error occurred while cancelling. Please try again.');
        }
    };

    const handleExit = () => {
        router.push('/dashboard');
    };

    const handleTable = () => {
        router.push('/masters/ticketing/ticketSubCat/ticketSubCatTable');
    };

    const handleSubmit = async () => {

        const payload = {
            TKTCATID: formData?.TKTCATID || "",
            // TKTSUBCATID: formData?.TKTSUBCATID || 0,
            TKTSUBCATNAME: formData?.TKTSUBCATNAME || "",
            ABRV: formData?.ABRV || "",
            EMP_KEY: formData?.EMP_KEY || "",
            STATUS: formData?.STATUS || 1,
            REMARK: formData?.REMARK || ""

        };

        const UserName = localStorage.getItem('Ankita');
        const COBR_ID = "02";

        let response;
        if (mode === 'edit') {
            payload.TKTSUBCATID = currentTicSCatId;
            payload.UPDATEDBY = 2;
            response = await axiosInstance.patch(`TktsubCat/UpdateTktsubCat?UserName=${(UserName)}&strCobrid=${COBR_ID}`, payload);

            console.log("payload", payload);
        } else {
            payload.CREATEDBY = 2;
            response = await axiosInstance.post(`TktsubCat/InsertTktsubCat?UserName=${(UserName)}&strCobrid=${COBR_ID}`, payload);
        }

        if (response.data.STATUS === 0 && response.data.RESPONSESTATUSCODE === 1) {
            toast.success(response.data.MESSAGE);
            setIsFormDisabled(true);
            setMode('view');

        } else {
            toast.error(response.data.MESSAGE || 'Operation failed');
        }
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
                    marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '5%', xl: '5%' },
                }}
                spacing={2}
            >

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
                    <Grid>
                        <Typography align="center" variant="h6">
                            Ticket Sub Category Master
                        </Typography>

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
                            readOnlyMode={mode === "view"}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={0.5}>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <AutoVibe
                            id="TKTCATID"
                            disabled={isFormDisabled}
                            getOptionLabel={(option) => option.TKTCATNAME || ''}
                            options={cats}
                            label="Category Name"
                            name="TKTCATID"
                            value={cats.find(option => option.TKTCATID.toString() === formData?.TKTCATID) || ""}
                            onChange={(e, newValue) => {
                                setFormData((prevForm) => ({
                                    ...prevForm,
                                    TKTCATID: newValue ? newValue.TKTCATID.toString() : '',
                                }));
                            }}
                            sx={DropInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}></Grid> */}

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <AutoVibe
                            id="EMP_KEY"
                            disabled={isFormDisabled}
                            getOptionLabel={(option) => option.EMP_NAME || ''}
                            options={scats}
                            label="Technician"
                            name="EMP_KEY"
                            value={scats.find(option => option.EMP_KEY.toString() === formData?.EMP_KEY) || ""}
                            onChange={(e, newValue) => {
                                setFormData((prevForm) => ({
                                    ...prevForm,
                                    EMP_KEY: newValue ? newValue.EMP_KEY.toString() : '',
                                }));
                            }}
                            sx={DropInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextField
                            label="Sub Category Name"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={formData.TKTSUBCATNAME || ""}
                            name="TKTSUBCATNAME"
                            disabled={isFormDisabled}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextField
                            label="Abbr"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={formData.ABRV || ""}
                            name="ABRV"
                            disabled={isFormDisabled}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextField
                            label="Remark"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={formData.REMARK || ""}
                            name="REMARK"
                            disabled={isFormDisabled}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
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
                    {mode === 'view' && (
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
                    {(mode === 'edit' || mode === 'add') && (
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

export default TicketSubCatMst;