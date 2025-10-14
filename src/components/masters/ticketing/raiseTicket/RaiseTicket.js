'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    Grid,
    RadioGroup,
    Radio
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
import UploadIcon from '@mui/icons-material/Upload';
import AutoVibe from '@/GlobalFunction/CustomAutoComplete/AutoVibe';

const RaiseTicketMst = () => {

    const [selectedRadio, setSelectedRadio] = useState('Machine');

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

    return (
        <>
            <ToastContainer />
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{
                    marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '20%', xl: '5%' },
                    maxHeight: "100vh",
                    paddingTop: "65px",
                }}
            >
                <Grid sx={{ width: '100%' }}>
                    <Paper
                        elevation={3}
                        style={{ padding: "16px", borderRadius: "10px" }}
                    >
                        <Typography variant="h6" align="center" gutterBottom>
                            Raise Service Ticket
                        </Typography>

                        <Grid container spacing={0.5}>
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

                            {selectedRadio === 'Machine' && (
                                <>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <AutoVibe
                                            id=""
                                            disabled={''}
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
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}></Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}></Grid>
                                </>
                            )}

                            {selectedRadio === 'Department' && (
                            <>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <AutoVibe
                                        id=""
                                        disabled={''}
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
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}></Grid>
                             </>
                            )}

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

                            <Grid item xs={12} sm={6} md={4}>
                                <label htmlFor="upload-photo">
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="upload-photo"
                                        type="file"
                                        onChange={''}
                                        disabled={false}
                                    />
                                    <Button
                                        component="span"
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<UploadIcon />}
                                        sx={{
                                            fontSize: '0.8rem',
                                            py: 0.5,
                                            borderRadius: 2,
                                            borderColor: '#90caf9',
                                            color: '#1976d2',
                                        }}
                                    >
                                        Upload Image
                                    </Button>
                                </label>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 4 }}></Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}></Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 12 }}>
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

                            <Grid sx={{
                                display: "flex",
                                justifyContent: "end",
                                ml: '100.5%',
                                position: 'relative',
                                top: 10
                            }}>
                                <>
                                    <Button variant="contained"
                                        sx={{
                                            background: 'linear-gradient(290deg, #d4d4d4, #ffffff)',
                                            margin: { xs: '0 4px', sm: '0 6px' },
                                            minWidth: { xs: 40, sm: 46, md: 60 },
                                            height: { xs: 40, sm: 46, md: 30 },
                                        }}
                                        onClick={''} disabled>
                                        Back
                                    </Button>
                                    <Button variant="contained"
                                        sx={{
                                            background: 'linear-gradient(290deg, #a7c5e9, #ffffff)',
                                            margin: { xs: '0 4px', sm: '0 6px' },
                                            minWidth: { xs: 40, sm: 46, md: 60 },
                                            height: { xs: 40, sm: 46, md: 30 },
                                        }}
                                        onClick={''}
                                        disabled
                                    >
                                        Submit
                                    </Button>
                                </>

                            </Grid>

                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default RaiseTicketMst;