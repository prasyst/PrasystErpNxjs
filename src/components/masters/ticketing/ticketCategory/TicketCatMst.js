'use client';

import React, { useState } from 'react';
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
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AutoVibe from '@/GlobalFunction/CustomAutoComplete/AutoVibe';

const TicketCatMst = () => {

    const textInputSx = {
        '& .MuiInputBase-root': {
            height: 42,
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
        },
        '& .MuiFilledInput-root:before': {
            display: 'none',
        },
        '& .MuiFilledInput-root:after': {
            display: 'none',
        },
        '& .MuiInputBase-input': {
            padding: '16px 12px !important',
            fontSize: '14px !important',
            lineHeight: '1.4',
        },
        '& .MuiFilledInput-root.Mui-disabled': {
            backgroundColor: '#fff'
        }
    };

    const [formData, setFormData] = useState({
        technician: null,
        name: '',
        abvr: '',
        remark: '',
    });
    const [mode, setMode] = useState('view');

    const technicianOptions = [
        { id: 1, name: 'Technician A' },
        { id: 2, name: 'Technician B' },
        { id: 3, name: 'Technician C' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAutoChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            technician: newValue,
        }));
    };

    const handlePrevious = () => {

    };

    const handleNext = () => {

    };

    const handleDelete = () => {

    };

    const handleAdd = () => {

    };

    const handleEdit = () => {

    };

    const handleExit = () => {

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 'lg', mx: 'auto', mt: 4, p: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between" mb={2}>
                <Grid item>
                    <Box display="flex" gap={1}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4) !important' }}
                            onClick={handlePrevious}
                        >
                            <KeyboardArrowLeftIcon />
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important' }}
                            onClick={handleNext}
                        >
                            <NavigateNextIcon />
                        </Button>
                    </Box>
                </Grid>

                <Grid item>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Ticket Category Master
                    </Typography>
                </Grid>

                <Grid item>
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

            <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: 4 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <AutoVibe
                            id="technician"
                            name="technician"
                            label={<span>Technician <span style={{ color: 'red' }}>*</span></span>}
                            options={technicianOptions}
                            value={formData.technician}
                            onChange={handleAutoChange}
                            getOptionLabel={(option) => option?.name || ''}
                            onAddClick={() => console.log('Add clicked')}
                            onRefreshClick={() => console.log('Refresh clicked')}
                            isRefreshing={false}
                            sx={textInputSx}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextField
                            fullWidth
                            label={
                                <span>
                                    Name <span style={{ color: 'red' }}>*</span>
                                </span>
                            }
                            variant='filled'
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            sx={textInputSx}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Abvr"
                            variant='filled'
                            name="abvr"
                            value={formData.abvr}
                            onChange={handleChange}
                            sx={textInputSx}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <TextField
                            fullWidth
                            variant='filled'
                            label="Remark"
                            name="remark"
                            value={formData.remark}
                            onChange={handleChange}
                            sx={textInputSx}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Status" />
                    </FormGroup>
                    <Button variant="contained" type="submit" color="primary">
                        Submit
                    </Button>
                    <Button variant="contained" color="error">
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default TicketCatMst;
