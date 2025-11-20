"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
    MdAdd, MdClose, MdAttachFile, MdSend, MdPerson,
    MdCategory, MdPriorityHigh, MdDescription, MdArrowBack,
    MdQrCodeScanner, MdQrCode
} from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { CloudUpload } from '@mui/icons-material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Box, Button, Typography, TextField, Grid, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import UploadIcon from '@mui/icons-material/Upload';
import AutoVibe from '@/GlobalFunction/CustomAutoComplete/AutoVibe';
import { ArrowBack } from '@mui/icons-material';

const RaiseTicketMst = () => {
    const router = useRouter();

    const [selectedRadio, setSelectedRadio] = useState('Machine');
    const [ImgName, setImgName] = useState('Machine');

    const [formData, setFormData] = useState({
     ImgName
    });

    const handleRadioChange = (event) => {
        setSelectedRadio(event.target.value);
    };

    const doubleInputSx = {
        '& .MuiInputBase-root': {
            height: 76,
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
            height: 76,
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

     const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImgName(file);
        setFormData((prev) => {
            const updatedFormData = { ...prev, ImgName: file };
            console.log("Updated formData:", updatedFormData);
            return updatedFormData;
        });
    };

    return (
        <Grid
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                boxSizing: 'border-box',
                minHeight: '100vh',
                overflowX: 'hidden',
                overflowY: 'auto',
                padding: { xs: '20px', sm: '40px' },
            }}
        >
            <ToastContainer />

            {/* --- Header Section --- */}
            <Grid
                size={{ xs: 12, sm: 12, md: 12 }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: '15px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                    padding: { xs: '20px', sm: '30px', md: '10px' },
                    width: { xs: '90%', sm: '60%', md: '60%' },
                    marginBottom: '10px',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        margin: 0,
                        color: '#1f2937',
                        fontFamily: 'Inter, sans-serif',
                        textAlign: 'center',
                    }}
                >
                    Raise Service Ticket
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: '#4b5563',
                        fontSize: '16px',
                        marginTop: '8px',
                        textAlign: 'center',
                    }}
                >
                    Please fill the details below to raise a new service request.
                </Typography>
            </Grid>

            {/* --- Form Section --- */}
            <Grid
                size={{ xs: 12, sm: 12, md: 12 }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: { xs: '90%', sm: '60%', md: '60%' },
                    backgroundColor: '#ffffff',
                    padding: { xs: '20px', sm: '30px', md: '40px' },
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
            >
                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                        <Typography variant="h6">Ticket For</Typography>
                        <RadioGroup
                            row
                            name="asc-radio"
                            value={selectedRadio}
                            onChange={handleRadioChange}
                        >
                            <FormControlLabel
                                value="Machine"
                                control={<Radio />}
                                label="Machine"
                            />
                            <FormControlLabel
                                value="Department"
                                control={<Radio />}
                                label="Department"
                            />
                        </RadioGroup>
                    </Grid>

                    <>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <AutoVibe
                                id=""
                                disabled={selectedRadio === 'Department'}
                                getOptionLabel={(option) => option || ''}
                                options={''}
                                label="Machine"
                                name=""
                                value={""}
                                onChange={''}
                                sx={DropInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 8px',
                                        fontSize: '12px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <AutoVibe
                                id=""
                                disabled={selectedRadio === 'Machine'}
                                getOptionLabel={(option) => option || ''}
                                options={''}
                                label="Department"
                                name=""
                                value={""}
                                onChange={''}
                                sx={DropInputSx}
                                inputProps={{
                                    style: {
                                        padding: '6px 8px',
                                        fontSize: '12px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}></Grid>
                    </>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutoVibe
                            id=""
                            disabled={''}
                            getOptionLabel={(option) => option || ''}
                            options={''}
                            label="Category Name"
                            name=""
                            value={""}
                            onChange={''}
                            sx={DropInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutoVibe
                            id=""
                            disabled={''}
                            getOptionLabel={(option) => option || ''}
                            options={''}
                            label="Sub Category Name"
                            name=""
                            value={""}
                            onChange={''}
                            sx={DropInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutoVibe
                            id=""
                            disabled={''}
                            getOptionLabel={(option) => option || ''}
                            options={''}
                            label="Service/Complaint"
                            name=""
                            value={""}
                            onChange={''}
                            sx={DropInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                backgroundColor: 'pink',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'pink',
                                },
                                padding: '10px 20px',
                                borderRadius: '8px',
                                // marginTop: 6,
                                textTransform: 'none',
                                boxShadow: 2,
                            }}
                            startIcon={<CloudUpload />}
                        >
                            Upload Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>

                        {/* Image Preview */}
                        <Box
                            sx={{
                                marginTop: 2,
                                width: 150,
                                height: 150,
                                border: '2px dashed',
                                borderColor: 'purple',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                backgroundColor: '#f7f7f7',
                                boxShadow: 1,
                            }}
                        >
                            {formData.ImgName ? (
                                <img
                                    // src={URL.createObjectURL(formData.ImgName)}
                                    src={
                                        typeof formData.ImgName === "string"
                                            ? formData.ImgName
                                            : URL.createObjectURL(formData.ImgName)
                                    }
                                    alt="preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    No Image
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                        <TextField
                            label="Description"
                            variant="filled"
                            fullWidth
                            onChange={''}
                            value={""}
                            name=""
                            disabled={''}
                            sx={doubleInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid
                        size={{ xs: 12, sm: 12, md: 12 }}
                        sx={{ textAlign: 'center', marginTop: '15px' }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                width: { xs: '100%', sm: '50%' },
                                padding: '14px',
                                fontSize: '16px',
                                textTransform: 'none',
                                borderRadius: '10px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            }}
                        >
                            Submit Ticket
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default RaiseTicketMst;