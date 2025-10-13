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

const ServiceComplaint = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        TKTCATID: '',
        TKTSUBCATID: '',
        TKTSERVICENAME: '',
        TKTSVRTYID: '',
        TKTTYPEID: '',
        TKTTAGID: '',
        EMP_KEY: '',
        LEADTIME: '',
        DESCRIPTION: '',
        STATUS: '',
        REMARK: ''
    });
    const [isFormDisabled, setIsFormDisabled] = useState(true);
    const [mode, setMode] = useState('view');
    const [cats, setCats] = useState([]);
    const [scats, setSCats] = useState([]);
    const [sev, setSev] = useState([]);
    const [Type, setType] = useState([]);
    const [Tag, setTag] = useState([]);
    const [currentComplaintId, setCurrentComplaintId] = useState(null);
    const searchParams = useSearchParams();
    const Complaint = searchParams.get('TKTSERVICEID');
    const CO_ID = localStorage.getItem('CO_ID');

    const fetchComplaintData = useCallback(async (currentComplaintId, flag = "R") => {

        try {
            const response = await axiosInstance.post(`TktService/RetriveTktService`, {
                "FLAG": flag,
                "TBLNAME": "TktService",
                "FLDNAME": "TKTSERVICEID",
                "ID": currentComplaintId,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });

            if (response.data.STATUS === 0 && response.data.RESPONSESTATUSCODE === 1) {
                const complaintData = response?.data?.DATA[0];

                setFormData({

                    TKTCATID: complaintData?.TKTCATID.toString() || "",
                    TKTSUBCATID: complaintData?.TKTSUBCATID.toString() || "",
                    TKTSERVICENAME: complaintData?.TKTSERVICENAME || "",
                    TKTSVRTYID: complaintData?.TKTSVRTYID.toString() || "",
                    TKTTYPEID: complaintData?.TKTTYPEID.toString() || "",
                    TKTTAGID: complaintData?.TKTTAGID.toString() || "",
                    EMP_KEY: complaintData?.EMP_KEY || "",
                    LEADTIME: complaintData?.LEADTIME || "",
                    DESCRIPTION: complaintData?.DESCRIPTION || "",
                    STATUS: complaintData?.STATUS || "",
                    REMARK: complaintData?.REMARK || ""
                });

                setIsFormDisabled(true);
                setCurrentComplaintId(complaintData?.TKTSERVICEID);
                const newParams = new URLSearchParams();
                newParams.set("TKTSERVICEID", complaintData.TKTSERVICEID);
                router.replace(`/masters/ticketing/serviceComplaint?${newParams.toString()}`);

            } else if (response.data.STATUS === 1 && response.data.RESPONSESTATUSCODE === 2) {
                toast.info(response.data.MESSAGE);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching data. Please try again.');
        }
    }, [CO_ID, router]);

    useEffect(() => {
        if (Complaint) {
            setCurrentComplaintId(Complaint);
            fetchComplaintData(Complaint);
            setMode('view');
        } else {
            setMode('view');
            setFormData({
                TKTCATID: '',
                TKTSUBCATID: '',
                TKTSERVICENAME: '',
                TKTSVRTYID: '',
                TKTTYPEID: '',
                TKTTAGID: '',
                EMP_KEY: '',
                LEADTIME: '',
                DESCRIPTION: '',
                STATUS: '',
                REMARK: ''
            });
            setIsFormDisabled(true);
        }
        setMode('view');
    }, [Complaint, fetchComplaintData]);

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
                const response = await axiosInstance.post(`TktsubCat/GetTktsubCatDrp`);
                console.log("API response:", response.data.DATA);
                if (
                    response.data.STATUS === 0 &&
                    response.data.RESPONSESTATUSCODE === 1
                ) {
                    setSCats(response.data.DATA);
                } else {
                    toast.error("Failed to fetch Ticket Sub Category Name");
                }
            } catch (error) {
                console.error("Error fetching Ticket Sub Category Name", error);
                toast.error("Error fetching Ticket Sub Category Name. Please try again.");
            }
        };

        fetchSubCat();
    }, []);

    useEffect(() => {
        const fetchSeverity = async () => {
            try {
                const response = await axiosInstance.post(`TktService/GetTktSvrtyDrp`);
                console.log("API response:", response.data.DATA);
                if (
                    response.data.STATUS === 0 &&
                    response.data.RESPONSESTATUSCODE === 1
                ) {
                    setSev(response.data.DATA);
                } else {
                    toast.error("Failed to fetch Ticket Severity");
                }
            } catch (error) {
                console.error("Error fetching Ticket Severity", error);
                toast.error("Error fetching Ticket Severity. Please try again.");
            }
        };

        fetchSeverity();
    }, []);

    useEffect(() => {
        const fetchType = async () => {
            try {
                const response = await axiosInstance.post(`TktService/GetTktTypeDrp`);
                console.log("API response:", response.data.DATA);
                if (
                    response.data.STATUS === 0 &&
                    response.data.RESPONSESTATUSCODE === 1
                ) {
                    setType(response.data.DATA);
                } else {
                    toast.error("Failed to fetch Ticket Type");
                }
            } catch (error) {
                console.error("Error fetching Ticket Type", error);
                toast.error("Error fetching Ticket Type. Please try again.");
            }
        };

        fetchType();
    }, []);

    useEffect(() => {
        const fetchTag = async () => {
            try {
                const response = await axiosInstance.post(`TktService/GetTktTagDrp`);
                console.log("API response:", response.data.DATA);
                if (
                    response.data.STATUS === 0 &&
                    response.data.RESPONSESTATUSCODE === 1
                ) {
                    setTag(response.data.DATA);
                } else {
                    toast.error("Failed to fetch Ticket Tag");
                }
            } catch (error) {
                console.error("Error fetching Ticket Tag", error);
                toast.error("Error fetching Ticket Tag. Please try again.");
            }
        };

        fetchTag();
    }, []);

    const handlePrevious = async () => {
        await fetchComplaintData(currentComplaintId, "P");
        setFormData((prev) => ({
            ...prev
        }));
    };

    const handleNext = async () => {
        await fetchComplaintData(currentComplaintId, "N");
        setFormData((prev) => ({
            ...prev
        }));
    };

    const handleDelete = async () => {
        try {
            const response = await axiosInstance.post('TktService/DeleteTktService', {
                TKTSERVICEID: Complaint
            });
            const { data: { STATUS, MESSAGE } } = response;
            if (STATUS === 0) {
                toast.success(MESSAGE, { autoClose: 500 });
                await fetchComplaintData(currentComplaintId, 'P');
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
            TKTCATID: '',
            TKTSUBCATID: '',
            TKTSERVICENAME: '',
            TKTSVRTYID: '',
            TKTTYPEID: '',
            TKTTAGID: '',
            EMP_KEY: '',
            LEADTIME: '',
            DESCRIPTION: '',
            STATUS: '',
            REMARK: ''
        });
        setCurrentComplaintId(null);

    };

    const handleEdit = () => {
        setMode("edit");
        setIsFormDisabled(false);
    };

    const handleCancel = async () => {
        try {
            await fetchComplaintData(1, "L");
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
        router.push('/masters/ticketing/serviceComplaint/serviceComplaintTable');
    };

    const handleSubmit = async () => {

        const payload = {
            TKTCATID: formData?.TKTCATID || '',
            TKTSUBCATID: formData?.TKTSUBCATID || 0,
            TKTSERVICENAME: formData?.TKTSERVICENAME || '',
            TKTSVRTYID: formData?.TKTSVRTYID || '',
            TKTTYPEID: formData?.TKTTYPEID || '',
            TKTTAGID: formData?.TKTTAGID || '',
            EMP_KEY: formData?.EMP_KEY || 'EP005',
            LEADTIME: formData?.LEADTIME || '',
            DESCRIPTION: formData?.DESCRIPTION || '',
            STATUS: formData?.STATUS || 1,
            REMARK: formData?.REMARK || ''
        };

        const userName = localStorage.getItem('Ankita');
        const COBR_ID = "02";

        let response;
        if (mode === 'edit') {
            payload.TKTSERVICEID = currentComplaintId;
            payload.UPDATEDBY = 2;
            response = await axiosInstance.patch(`TktService/UpdateTktService?UserName=${(userName)}&strCobrid=${COBR_ID}`, payload);

            console.log("payload", payload);
        } else {
            payload.CREATEDBY = 2;
            response = await axiosInstance.post(`TktService/InsertTktService?UserName=${(userName)}&strCobrid=${COBR_ID}`, payload);
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
                    marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '20%', xl: '5%' },
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
                            Service/Complaint Request
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
                            label="Ticket Category Name"
                            name="TKTCATID"
                            value={cats.find(option => option.TKTCATID.toString() === formData?.TKTCATID) || ""}
                            onChange={(e, newValue) => {
                                setFormData((prevForm) => ({
                                    ...prevForm,
                                    TKTCATID: newValue ? newValue.TKTCATID.toString()  : '',
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
                        <AutoVibe
                            id="TKTSUBCATID"
                            disabled={isFormDisabled}
                            getOptionLabel={(option) => option.TKTSUBCATNAME || ''}
                            options={scats}
                            label="Ticket Sub Category Name"
                            name="TKTSUBCATID"
                            value={scats?.find(option => option.TKTSUBCATID?.toString() === formData?.TKTSUBCATID) || ""}
                            onChange={(e, newValue) => {
                                setFormData((prevForm) => ({
                                    ...prevForm,
                                    TKTSUBCATID: newValue ? newValue.TKTSUBCATID.toString() : '',
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

                    <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                        <TextField
                            label="Ticket Service Name"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={formData.TKTSERVICENAME || ""}
                            name="TKTSERVICENAME"
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AutoVibe
                            id="TKTSVRTYID"
                            disabled={isFormDisabled}
                            getOptionLabel={(option) => option.TKTSVRTYNAME || ''}
                            options={sev}
                            label="Ticket Severity"
                            name="TKTSVRTYID"
                            value={sev.find(option => option.TKTSVRTYID.toString() === formData?.TKTSVRTYID) || ""}
                            onChange={(e, newValue) => {
                                setFormData((prevForm) => ({
                                    ...prevForm,
                                    TKTSVRTYID: newValue ? newValue.TKTSVRTYID.toString() : '',
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AutoVibe
                            id="TKTTYPEID"
                            disabled={isFormDisabled}
                            getOptionLabel={(option) => option.TKTTYPENAME || ''}
                            options={Type}
                            label="Ticket Type"
                            name="TKTTYPEID"
                            value={Type.find(option => option.TKTTYPEID.toString() === formData?.TKTTYPEID) || ""}
                            onChange={(e, newValue) => {
                                setFormData((prevForm) => ({
                                    ...prevForm,
                                    TKTTYPEID: newValue ? newValue.TKTTYPEID.toString() : '',
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AutoVibe
                            id="TKTTAGID"
                            disabled={isFormDisabled}
                            getOptionLabel={(option) => option.TKTTAGNAME || ''}
                            options={Tag}
                            label="Ticket Tag"
                            name="TKTTAGID"
                            value={Tag.find(option => option.TKTTAGID.toString() === formData?.TKTTAGID ) || ""}
                            onChange={(e, newValue) => {
                                setFormData((prevForm) => ({
                                    ...prevForm,
                                    TKTTAGID: newValue ? newValue.TKTTAGID.toString() : '',
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="LeadTime"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={formData.LEADTIME || ""}
                            name="LEADTIME"
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

                    <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                        <TextField
                            label="Description"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            value={formData.DESCRIPTION || ""}
                            name="DESCRIPTION"
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

                    <Grid size={{ xs: 12, sm: 6, md: 12 }}>
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

export default ServiceComplaint;