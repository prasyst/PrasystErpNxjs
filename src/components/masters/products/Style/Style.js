'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import {
    Box,
    Grid,
    TextField,
    Typography,
    Button,
    Stack,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Checkbox, Link
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import { toast, ToastContainer } from 'react-toastify';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CrudButton from '@/GlobalFunction/CrudButton';
import AutoVibe from '@/GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '@/lib/axios';
import { getFormMode } from '@/lib/helpers';
import EditableTable from '@/atoms/EditTable';
import z from 'zod';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TbListSearch } from "react-icons/tb";

const columns = [
    { label: 'Style', field: '', type: 'text' },
    { label: 'Type', field: '', type: 'text' },
    { label: 'MRP', field: '', type: 'text' },
    { label: 'WSP', field: '', type: 'text' },
    { label: 'Pur Rt', field: '', type: 'text' },
    { label: 'Design', field: '', type: 'text' },
    { label: 'Catalogue', field: '', type: 'text' },
    { label: 'Quality', field: '', type: 'text' },
    { label: 'Brand', field: '', type: 'text' },
    { label: 'Season', field: '', type: 'text' },
    { label: 'Default', field: '', type: 'checkbox' },
    { label: 'ProductSR', field: '', type: 'text' },
    { label: 'Unit', field: '', type: 'text' },
    { label: 'W', field: '', type: 'checkbox' },
    { label: 'WebColl', field: '', type: 'text' },
    { label: 'W', field: '', type: 'checkbox' },
    { label: 'Avg', field: '', type: 'text' }
];

const Properties = [
    { label: 'Category', field: '', type: 'text' },
    { label: 'MRP', field: '', type: 'text' },
    { label: 'WSP', field: '', type: 'text' },
    { label: 'Pur Rt', field: '', type: 'text' },
    { label: 'MD', field: '', type: 'text' },
    { label: 'MD1', field: '', type: 'text' },
    { label: 'MDU', field: '', type: 'text' }
];

const Attributes = [
    { label: 'Size', field: '', type: 'text' },
    { label: 'MRPRD', field: '', type: 'text' },
    { label: 'WSP_SZ', field: '', type: 'text' },
    { label: 'SSLRD', field: '', type: 'text' }
];

const Style = () => {
    const router = useRouter();

    const [isFormDisabled, setIsFormDisabled] = useState(true);
    const [mode, setMode] = useState('view');
    const [prdGrp, setprdGrp] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState([]);
    const [currentStyleId, setCurrentStyleId] = useState(null);
    const searchParams = useSearchParams();
    const FGStyle = searchParams.get('FGSTYLE_ID');
    const [formData, setFormData] = useState({

        DBFLAG: "",
        MRP: '',
        HSNCODE_KEY: ''

    });

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

    const fetchStyleData = useCallback(async (currentStyleId, flag = "R") => {

        try {
            const response = await axiosInstance.post(`FGSTYLE/RetriveFgstyle`, {
                "FGSTYLE_ID": currentStyleId,
                "FLAG": flag,
            });

            if (response.data.STATUS === 0 && response.data.RESPONSESTATUSCODE === 1) {
                const styleData = response?.data?.DATA?.FGSTYLEList[0];

                setFormData({

                    DBFLAG: mode === 'retrieve' ? 'R' : mode === 'edit' ? 'U' : '',
                    MRP: styleData?.MRP || "",
                    HSNCODE_KEY: styleData?.HSNCODE_KEY || ''

                });

                setIsFormDisabled(true);
                setCurrentStyleId(styleData?.FGSTYLE_ID);
                const newParams = new URLSearchParams();
                newParams.set("FGSTYLE_ID", styleData.FGSTYLE_ID);
                router.replace(`/inverntory/style?${newParams.toString()}`);

            } else if (response.data.STATUS === 1 && response.data.RESPONSESTATUSCODE === 2) {
                toast.info(response.data.MESSAGE);
            }
        } catch (error) {
            console.error('Error fetching style data:', error);
            toast.error('Error fetching style data. Please try again.');
        }
    }, [router]);

    useEffect(() => {
        if (FGStyle) {
            setCurrentStyleId(FGStyle);
            fetchStyleData(FGStyle);
            setMode('view');
        } else {
            setMode('view');
            setFormData({

                MRP: "",
                DBFLAG: ""

            });
            setIsFormDisabled(true);
        }
        setMode('view');
    }, [FGStyle, fetchStyleData]);

    const handleSubmit = async () => { };

    const handleExit = () => {
        router.push('/dashboard');
    };

    const handleTable = () => {
        router.push('/inverntory/style/styleTable');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeStatus = (event) => {
        const { name, checked } = event.target;
        const updatedStatus = checked ? "1" : "0";

        setFormData(prev => ({
            ...prev,
            [name]: updatedStatus
        }));
    };

    const handleAdd = async () => {
        setMode('add');
        setIsFormDisabled(false);
        setFormData({

        });
        setCurrentStyleId(null);
    };

    const handleEdit = () => {
        setMode("edit");
        setIsFormDisabled(false);
    };

    const handlePrevious = async () => {
        await fetchStyleData(currentStyleId, "P");
        setFormData((prev) => ({
            ...prev
        }));
    };

    const handleNext = async () => {
        await fetchStyleData(currentStyleId, "N");
        setFormData((prev) => ({
            ...prev
        }));
    };

    const handleCancel = async () => {
        try {
            await fetchStyleData(1, "R");
            setMode('view');
            setIsFormDisabled(true);
            setFormData((prev) => ({
                ...prev
            }));
        } catch (error) {
            toast.error('Error occurred while cancelling. Please try again.');
        }
    };

    const handleDelete = async () => { };

    const visibleData = (formData.fgSizeEntities || [])
        .map((row, originalIndex) => ({ ...row, originalIndex }))
        .filter(row => row?.DBFLAG !== 'D');

    const handleCellChange = (rowIndex, field, value) => {
        const updatedRows = [...formData.fgSizeEntities];
        updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            [field]: value,
        };

        // Add a new empty row if editing the last one and it's not completely empty
        const isLastRow = rowIndex === updatedRows.length - 1;
        const rowHasData = Object.values(updatedRows[rowIndex]).some(
            (val) => val !== '' && val !== undefined && val !== '0'
        );

        if (isLastRow && rowHasData) {
            updatedRows.push({});
        }

        setFormData((prev) => ({
            ...prev,
            fgSizeEntities: updatedRows,
        }));
    };

    const handleRowClick = (originalIndex) => {
        setSelectedRowIndex((prev) =>
            prev.includes(originalIndex) ? prev.filter((i) => i !== originalIndex) : [...prev, originalIndex]
        );
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
                    marginInline: { xs: '5%', sm: '5%', md: '2%', lg: '2%', xl: '2%' },
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
                            Article/Style Master
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
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AutoVibe
                            id=""
                            disabled={isFormDisabled}
                            getOptionLabel={(option) => option || ''}
                            options={prdGrp}
                            label="Product"
                            name=""
                            value={''}
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
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextField
                            label="Last Style"
                            variant="filled"
                            fullWidth
                            onChange={''}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3.5 }}></Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <AutoVibe
                            id=""
                            disabled={isFormDisabled}
                            getOptionLabel={(option) => option || ''}
                            options={prdGrp}
                            label="Catalogue/Product SR"
                            name=""
                            value={''}
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
                    <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography>FGStyleID</Typography>
                        <Typography>40842</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                        <TextField
                            label="Article/Style"
                            variant="filled"
                            fullWidth
                            onChange={''}
                            value={""}
                            name=""
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
                    <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Type"
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
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextField
                            label="MRP"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            name="MRP"
                            value={formData.MRP || ""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextField
                            label="WSP"
                            variant="filled"
                            fullWidth
                            onChange={''}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextField
                            label="Pur Rt"
                            variant="filled"
                            fullWidth
                            onChange={''}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Base/Quality"
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
                    <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Brand"
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
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Unit"
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

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Product Type"
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

                    <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                        <TextField
                            label="Hsncode"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            name="HSNCODE_KEY"
                            value={formData.HSNCODE_KEY || ""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                        <TextField
                            label="Design"
                            variant="filled"
                            fullWidth
                            onChange={''}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <TextField
                            label="Catalogue"
                            variant="filled"
                            fullWidth
                            onChange={''}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <TextField
                            label="Desc"
                            variant="filled"
                            fullWidth
                            onChange={''}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <TextField
                            label="Cut"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Prod. Type"
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

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Collection/Neck"
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

                    <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                        <TextField
                            label="Pur Style"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 0.75 }}>
                        <TextField
                            label="Pack of"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 0.75 }}>
                        <TextField
                            label="Pack Qty"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="AgeGrp"
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

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Gender"
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}>
                            <Button
                                component="span"
                                variant="contained"
                                sx={{
                                    minHeight: '10px',
                                    padding: '1px 4px',
                                    fontSize: '0.675rem',
                                }}
                            >
                                Parts Qty
                            </Button>
                        </Link>
                        <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer', ml: 4 }}>
                            <Button
                                component="span"
                                variant="contained"
                                sx={{
                                    minHeight: '10px',
                                    padding: '1px 4px',
                                    fontSize: '0.675rem',
                                }}
                            >
                                Ref Parts
                            </Button>
                        </Link>
                        <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer', ml: 4 }}>
                            <Button
                                component="span"
                                variant="contained"
                                sx={{
                                    minHeight: '10px',
                                    padding: '1px 4px',
                                    fontSize: '0.675rem',
                                }}
                            >
                                Parts Alloc
                            </Button>
                        </Link>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Fit"
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

                    <Grid size={{ xs: 12, sm: 6, md: 0.75 }}>
                        <TextField
                            label="Std Qty"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 0.5 }} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>per pc</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <FormControlLabel
                            control={<Checkbox name="" size="small" checked={""}
                                onChange={handleChangeStatus} />}
                            disabled={isFormDisabled}
                            label="Default Style"
                            sx={{
                                '& .MuiFormControlLabel-label': { fontSize: '12px' }
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox name="" size="small" checked={""}
                                onChange={handleChangeStatus} />}
                            disabled={isFormDisabled}
                            label="Web Sync"
                            sx={{
                                '& .MuiFormControlLabel-label': { fontSize: '12px' }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 0.75 }}>
                        <TextField
                            label="Avg"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <AutoVibe
                            id=""
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Web Collection"
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

                    <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                        <FormControlLabel
                            control={<Checkbox name="" size="small" checked={""}
                                onChange={handleChangeStatus} />}
                            disabled={isFormDisabled}
                            label="Web Discounted"
                            sx={{
                                '& .MuiFormControlLabel-label': { fontSize: '12px' }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                        <AutoVibe
                            id=""
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Season"
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

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Division/Status/Trend"
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

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label="Remark"
                            variant="filled"
                            fullWidth
                            onChange={handleInputChange}
                            name=""
                            value={""}
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}>
                            <Button
                                component="span"
                                variant="contained"
                                sx={{
                                    minHeight: '10px',
                                    padding: '1px 4px',
                                    fontSize: '0.675rem',
                                }}
                            >
                                All
                            </Button>
                        </Link>
                        <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer', ml: 4 }}>
                            <Button
                                component="span"
                                variant="contained"
                                sx={{
                                    minHeight: '10px',
                                    padding: '1px 4px',
                                    fontSize: '0.675rem',
                                }}
                            >
                                Allocated
                            </Button>
                        </Link>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                        <FormControlLabel
                            control={<Checkbox name="" size="small" checked={""}
                                onChange={handleChangeStatus} />}
                            disabled={isFormDisabled}
                            label="Status"
                            sx={{
                                '& .MuiFormControlLabel-label': { fontSize: '12px' }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon style={{ color: 'green' }} />
                        <Typography variant="body2" color="green">OK</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Pattern"
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

                    <Grid size={{ xs: 12, sm: 6, md: 9 }}>
                        <EditableTable
                            data={visibleData}
                            columns={columns}
                            onCellChange={handleCellChange}
                            disabled={isFormDisabled}
                            selectedRowIndex={selectedRowIndex}
                            onRowClick={handleRowClick}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                        <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}>
                            Shade Alloc Img
                        </Link>
                        <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Shade Alloc
                        </Typography>
                        {/* <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '8px'
                            }}
                        >
                            <Button
                                component="span"
                                variant="contained"
                                sx={{
                                    minHeight: '10px',
                                    padding: '1px 4px',
                                    fontSize: '0.675rem',
                                    width: '50px',
                                    minWidth: '10px'
                                }}
                            >
                                Single
                            </Button>
                            <Button
                                component="span"
                                variant="contained"
                                sx={{
                                    minHeight: '10px',
                                    padding: '1px 4px',
                                    fontSize: '0.675rem',
                                    width: '50px',
                                    minWidth: '10px'
                                }}
                            >
                                Multi
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '8px'
                            }}
                        >
                            <Button
                                component="span"
                                variant="contained"
                                sx={{
                                    minHeight: '10px',
                                    padding: '1px 4px',
                                    fontSize: '0.675rem',
                                    width: '50px',
                                    minWidth: '10px'
                                }}
                            >
                                Delete
                            </Button>
                            <Button
                                component="span"
                                variant="contained"
                                sx={{
                                    minHeight: '10px',
                                    padding: '1px 4px',
                                    fontSize: '0.675rem',
                                    width: '50px',
                                    minWidth: '10px'
                                }}
                            >
                                Lock
                            </Button>
                        </Box> */}
                        <Button
                            component="span"
                            variant="contained"
                            sx={{
                                paddingBlock: '4px',
                                background: '#635bff',
                                paddingInline: '0px',
                                fontSize: '10px'
                            }}
                        >
                            Product
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Fab Category"
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
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Fabric"
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

                    <Grid size={{ xs: 12, sm: 6, md: 9 }} sx={{ display: 'flex', gap: 2 }}>
                        <EditableTable
                            data={visibleData}
                            columns={Properties}
                            onCellChange={handleCellChange}
                            disabled={isFormDisabled}
                            selectedRowIndex={selectedRowIndex}
                            onRowClick={handleRowClick}
                        />

                        <EditableTable
                            data={visibleData}
                            columns={Attributes}
                            onCellChange={handleCellChange}
                            disabled={isFormDisabled}
                            selectedRowIndex={selectedRowIndex}
                            onRowClick={handleRowClick}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 1 }}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                            border="1px solid #ccc"
                            borderRadius={1}
                            width={100}
                            height={76}
                            overflow="hidden"
                            position="relative"
                            sx={{ marginTop: '16px' }}
                        >
                            {formData.PARTY_IMG ? (
                                <img
                                    src={formData.PARTY_IMG}
                                    alt="Uploaded Preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        marginTop: "4px"
                                    }}
                                />
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="#39ace2"
                                    style={{ textAlign: 'center' }}
                                >
                                    <PhotoCameraIcon />
                                </Typography>
                            )}
                        </Box>

                        <Button variant="contained"
                            onClick={''}
                            disabled={''}
                            sx={{
                                paddingBlock: '4px',
                                background: '#635bff',
                                paddingInline: '0px',
                                fontSize: '10px'
                            }}>
                            Add Size
                        </Button>
                        {/* <Button variant="contained"
                            onClick={''}
                            disabled={''}
                            sx={{
                                paddingBlock: '4px',
                                background: '#635bff',
                                paddingInline: '0px',
                                fontSize: '10px'
                            }}>
                            Delete Size
                        </Button>
                        <Button variant="contained"
                            onClick={''}
                            disabled={''}
                            sx={{
                                paddingBlock: '4px',
                                background: '#635bff',
                                paddingInline: '0px',
                                fontSize: '10px'
                            }}>
                            Del Size
                        </Button> */}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
                    >
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Fab Design ID"
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
                        <AutoVibe
                            id="FGCAT_KEY"
                            disabled={isFormDisabled}
                            options={''}
                            getOptionLabel={(option) => option || ""}
                            label="Attribute"
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

            </Grid>

        </Grid >

    )
}

export default function Wrapper() {
    return (
        <Suspense fallback={<Box>Loading...</Box>}>
            <Style />
        </Suspense>
    );
}







