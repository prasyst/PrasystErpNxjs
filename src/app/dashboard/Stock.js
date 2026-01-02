'use client';

import React, { useState, useEffect } from 'react';
import {
    Autocomplete, Box, Button, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, TextField,
    DialogTitle, Grid, ListItemText, Paper, Stack, Typography, IconButton
} from '@mui/material';
import { AttachMoney, People, ShoppingCart, TrendingUp, ArrowBack } from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie,
    Cell, AreaChart, Area
} from 'recharts';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";
ModuleRegistry.registerModules([AllCommunityModule]);

const dataLine = [
    { name: 'Week 1', amt: 0, qty: 8400 },
    { name: 'Week 2', amt: 6000, qty: 1398 },
    { name: 'Week 3', amt: 2000, qty: 9800 },
    { name: 'Week 4', amt: 2780, qty: 2080 },
    { name: 'Week 5', amt: 8890, qty: 2800 },
    { name: 'Week 6', amt: 2390, qty: 4800 },
    { name: 'Week 7', amt: 3490, qty: 4300 },
];

const dataPie = [
    { name: 'Brand A', value: 400 },
    { name: 'Brand B', value: 300 },
    { name: 'Brand C', value: 300 },
    { name: 'Brand D', value: 200 },
    { name: 'Brand E', value: 600 },
    { name: 'Brand F', value: 500 },
    { name: 'Brand G', value: 100 },
];

const COLORS = ['#4a6eb1', '#67a968', '#ffbb33', '#ff4444', '#635bff', '#555', '#222'];

const dataArea = [
    { name: 'Week 1', amt: 4000, qty: 2400 },
    { name: 'Week 2', amt: 3000, qty: 1398 },
    { name: 'Week 3', amt: 2000, qty: 9800 },
    { name: 'Week 4', amt: 2780, qty: 3908 },
    { name: 'Week 5', amt: 1890, qty: 4800 },
    { name: 'Week 6', amt: 2390, qty: 3800 },
    { name: 'Week 7', amt: 3490, qty: 4300 },
    { name: 'Week 8', amt: 4490, qty: 5300 },
    { name: 'Week 9', amt: 3490, qty: 2300 },
    { name: 'Week 10', amt: 5490, qty: 6300 },
    { name: 'Week 11', amt: 2490, qty: 3300 },
    { name: 'Week 12', amt: 4490, qty: 5300 },
];

const Stock = () => {
    const currentYear = dayjs().year();
    const previousYear = currentYear - 1;
    const [dateFrom, setDateFrom] = useState(dayjs(`${previousYear}-04-01`));
    const [dateTo, setDateTo] = useState(dayjs(`${currentYear}-03-31`));
    const [cobrId, setCobrId] = useState(localStorage.getItem("COBR_ID"));
    const [fcyr, setFcyr] = useState(localStorage.getItem("FCYR_KEY"));
    const [totalStck, setTotalStck] = useState([]);
    const [brandData, setBrandData] = useState([]);
    const [recentStock, setRecentStock] = useState([]);
    const [recentLoading, setRecentLoading] = useState(false);
    const [productType, setProductType] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [brandOption, setBrandOption] = useState([]);
    const [categoryOption, setCategoryOption] = useState([]);
    const [ProductOption, setProductOption] = useState([]);
    const [stockFilter, setStockFilter] = useState({
        Brandfilter: [],
        Catfilter: [],
        Prdfilter: [],
        Stylefilter: [],
        Typefilter: [],
        Shadefilter: [],
        Ptnfilter: [],
    });

    const categoryOptions = ['Category 1', 'Category 2', 'Category 3'];
    const productOptions = ['Product X', 'Product Y', 'Product Z'];
    const styleOptions = ['Style 1', 'Style 2', 'Style 3'];
    const typeOptions = ['Type A', 'Type B', 'Type C'];
    const shadeOptions = ['shade A', 'shade B', 'shade C'];
    const ptnOptions = ['Ptn A', 'Ptn B', 'Ptn C'];

    const handleAutocompleteChange = (event, newValue, filterName) => {
        setStockFilter((prev) => ({
            ...prev,
            [filterName]: newValue,
        }));
    };

    const applyFilters = () => {
        setOpenDialog(false);
    };

    const clearFilters = () => {
        setStockFilter({
            Brandfilter: [],
            Catfilter: [],
            Prdfilter: [],
            Stylefilter: [],
            Typefilter: [],
            Shadefilter: [],
            Ptnfilter: [],
        })
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const recentStockColumns = [
        { field: "FGCAT_NAME", headerName: "Category", width: 180 },
        { field: "FGPRD_NAME", headerName: "Product", width: 220 },
        { field: "FGSTYLE_CODE", headerName: "Code", width: 200 },
        { field: "FGSHADE_NAME", headerName: "Shade", width: 150 },
        { field: "BRAND_NAME", headerName: "Brand", width: 200 },
        { field: "QTY", headerName: "Qty", filter: "agNumberColumnFilter", width: 140 },
        { field: "RATE", headerName: "Rate", filter: "agNumberColumnFilter", width: 140 },
        { field: "AMT", headerName: "Amount", filter: "agNumberColumnFilter", width: 140 },
    ];

    const defaultColDef = {
        width: 100,
        sortable: true,
        filter: true,
        resizable: true,
    };

    useEffect(() => {
        fetchTotalStock();
        fetchBrandWiseStock();
        fetchRecentStock();
        fetchProductType();
        fetchBrandDrp();
        fetchCategory();
        fetchProduct();
    }, []);

    const handleGetData = () => {
        fetchTotalStock();
        fetchBrandWiseStock();
        fetchRecentStock();
        fetchProductType();
    };

    const filterStockPayload = () => ({
        Brandfilter: stockFilter.Brandfilter.map((item) => item.BRAND_KEY).join(',') || '',
        Catfilter: stockFilter.Catfilter.map((item) => item.CAT_KEY).join(',') || '',
        Prdfilter: stockFilter.Prdfilter.map((item) => item.Prd_KEY).join(',') || '',
        Stylefilter: stockFilter.Stylefilter.map((item) => item.STYLE_KEY).join(',') || '',
        Typefilter: stockFilter.Typefilter.map((item) => item.TYPE_KEY).join(',') || '',
        Shadefilter: stockFilter.Shadefilter.map((item) => item.SHADE_KEY).join(',') || '',
        Ptnfilter: stockFilter.Ptnfilter.map((item) => item.PTN_KEY).join(',') || ''
    });

    const fetchTotalStock = async () => {
        try {
            const getFilterPayload = filterStockPayload();
            const response = await axiosInstance.post("OrderDash/GetStockDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "TotalStock",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...getFilterPayload,
            })
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setTotalStck(response.data.DATA);
            }
        } catch {
            toast.error("Error while loading total");
        }
    };

    const fetchBrandWiseStock = async () => {
        try {
            const getFilterPayload = filterStockPayload();
            const response = await axiosInstance.post("OrderDash/GetStockDashBoard", {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: 'BrandWise',
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...getFilterPayload
            })
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const chartData = response.data.DATA.map(item => ({
                    name: item.BRAND_NAME,
                    qty: item.QTY,
                }));
                setBrandData(chartData);
            }
        } catch (error) {
            toast.error("Error from api response.");
        }
    };

    const fetchRecentStock = async () => {
        setRecentLoading(true);
        try {
            const getFilterPayload = filterStockPayload();
            const response = await axiosInstance.post('OrderDash/GetStockDashBoard', {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: 'RECENT',
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...getFilterPayload
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setRecentStock(response.data.DATA);
            }
        } catch {
            toast.error("Error from api response.");
        } finally {
            setRecentLoading(false);
        }
    };

    const fetchProductType = async () => {
        try {
            const getFilterPayload = filterStockPayload();
            const response = await axiosInstance.post('OrderDash/GetStockDashBoard', {
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: 'PRODTYPE',
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...getFilterPayload
            })
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setProductType(response.data.DATA);
            }
        } catch (error) {
            toast.error("Error while fetching product type.");
        }
    };

    // All Filter Dropdown
    const fetchBrandDrp = async () => {
        try {
            const response = await axiosInstance.post('Brand/GetBrandDrp', {})
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setBrandOption(response.data.DATA);
            }
        } catch (error) {
            toast.error('Error while fetching brand.');
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await axiosInstance.post('Category/GetFgCatDrp', {})
            if (response.data.STATUS === 0) {
                setCategoryOption(response.data.DATA);
            }
        } catch {
            toast.error("Error while fetching category.");
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await axiosInstance.post("Product/GetFgPrdDrp", {
                Flag: ""
            });
            if (response.response.STATUS === 0) {
                setProductOption(response.data.DATA);
            }
        } catch (error) {
            // toast.error("Error while fetching product.");
        }
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <ToastContainer />
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    flexWrap: "wrap",
                    gap: { xs: 2, sm: 1 },
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                        background: "linear-gradient(45deg, #236, #605bff, #864f )",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        userSelect: "none",
                    }}
                >
                    Order Stock
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                        <DatePicker
                            label="From-Date"
                            value={dateFrom}
                            onChange={(newValue) => setDateFrom(newValue)}
                            format="DD/MM/YYYY"
                            views={['day', 'month', 'year']}
                            sx={{
                                width: 150,
                                '& .MuiPickersSectionList-root': {
                                    padding: '6.5px 0',
                                },
                            }}
                        />
                        <DatePicker
                            label="To-Date"
                            value={dateTo}
                            onChange={(newValue) => setDateTo(newValue)}
                            format="DD/MM/YYYY"
                            views={['day', 'month', 'year']}
                            sx={{
                                width: 150,
                                '& .MuiPickersSectionList-root': {
                                    padding: '6.5px 0',
                                },
                            }}
                            className="custom-datepicker"
                        />
                        <Button
                            variant="contained"
                            size='small'
                            onClick={handleGetData}
                            sx={{
                                borderRadius: '20px',
                                backgroundColor: '#635bff',
                                '&:hover': {
                                    backgroundColor: '#635bff'
                                },
                            }}
                        >
                            Get Data
                        </Button>
                        <Button
                            variant="contained"
                            size='small'
                            startIcon={<FilterListIcon />}
                            onClick={handleOpenDialog}
                            sx={{
                                borderRadius: '20px',
                                backgroundColor: '#635bff',
                                '&:hover': {
                                    backgroundColor: '#635bff'
                                },
                            }}
                        >
                            Filters
                        </Button>
                    </Box>
                </LocalizationProvider>
            </Box>

            <Grid container spacing={2} mb={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Box>
                                <Typography variant="body2" fontWeight='bold'>Total Stock Qty</Typography>
                                <Typography variant="h5" fontWeight="bold" mt={1}>{totalStck[0]?.QTY || 0}</Typography>
                                <Stack direction="row" alignItems="center" mt={1}>
                                    <TrendingUp sx={{ color: '#4caf50', fontSize: 20 }} />
                                    <Typography variant="body2" color="#4caf50" ml={1}>+$10,250 this month</Typography>
                                </Stack>
                            </Box>
                            <AttachMoney sx={{ fontSize: 50, color: '#8cbbddff' }} />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                                <Typography variant="h5" fontWeight="bold" mt={1}>1,660</Typography>
                                <Chip label="+4% from last month" color="success" size="small" sx={{ mt: 1 }} />
                            </Box>
                            <ShoppingCart sx={{ fontSize: 50, color: '#8bd191ff' }} />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                                <Typography variant="h5" fontWeight="bold" mt={1}>$92,120</Typography>
                                <Chip label="+2%" color="success" size="small" sx={{ mt: 1 }} />
                            </Box>
                            <ArrowBack sx={{ fontSize: 50, color: '#d3ae71ff' }} />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Box>
                                <Typography variant="body2" color="text.secondary">Customers</Typography>
                                <Typography variant="h5" fontWeight="bold" mt={1}>842</Typography>
                                <Chip label="+12%" color="success" size="small" sx={{ mt: 1 }} />
                            </Box>
                            <People sx={{ fontSize: 50, color: '#d486e0ff' }} />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container rowSpacing={0} columnSpacing={1}>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Paper elevation={4} sx={{ px: 2, py: 1, borderRadius: 3, mb: 2 }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={1}
                            sx={{
                                background: 'linear-gradient(45deg, #ac372dff, #625, #20a84eff, #635bff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent',
                                display: 'inline-block',
                                fontSize: '1.25rem',
                            }}
                        >
                            Recent Stock
                        </Typography>

                        {recentLoading ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <CircularProgress sx={{ width: '100%', height: 4 }} />
                                <Typography mt={2}>Loading Data...</Typography>
                            </Box>
                        ) : (
                            <Box className="ag-theme-quartz" sx={{ height: 400, width: '100%' }}>
                                <AgGridReact
                                    rowData={recentStock}
                                    columnDefs={recentStockColumns}
                                    defaultColDef={defaultColDef}
                                    pagination={true}
                                    paginationPageSize={1000}
                                    paginationPageSizeSelector={[100, 500, 1000, 5000]}
                                    headerHeight={35}
                                    rowHeight={25}
                                />
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Paper elevation={4} sx={{ mb: 2, px: 2, py: 3, borderRadius: 3, backgroundColor: '#fff' }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={1}
                            sx={{
                                background: 'linear-gradient(45deg, #ac372dff, #625, #20a84eff, #635bff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent',
                                display: 'inline-block',
                                fontSize: '1.25rem',
                            }}
                        >
                            Brand Chart
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={brandData} margin={{ right: 10, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="qty" fill="#635bff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Paper elevation={4} sx={{ mb: 2, px: 2, py: 3, borderRadius: 3, backgroundColor: '#fff' }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={1}
                            sx={{
                                background: 'linear-gradient(45deg, #a3fd, #22ff, #000, rgba(141, 15, 15, 1))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent',
                                display: 'inline-block',
                                fontSize: '1.25rem',
                            }}
                        >
                            Line Chart
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataLine} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="amt" stroke="#4a6eb1" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="qty" stroke="#67a968" activeDot={{ r: 8 }} />

                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Paper elevation={4} sx={{ mb: 2, px: 2, py: 3, borderRadius: 3, backgroundColor: '#fff' }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={1}
                            sx={{
                                background: 'linear-gradient(45deg, #ac372dff, #625, #20a84eff, #635bff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent',
                                display: 'inline-block',
                                fontSize: '1.25rem',
                            }}
                        >
                            Brand A Distribution
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataPie}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                    >
                                        {dataPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Paper elevation={4} sx={{ mb: 2, px: 2, py: 3, borderRadius: 3, backgroundColor: '#fff' }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={1}
                            sx={{
                                background: 'linear-gradient(45deg, #ac372dff, #625, #20a84eff, #635bff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent',
                                display: 'inline-block',
                                fontSize: '1.25rem',
                            }}
                        >
                            Brand B Distribution
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataPie}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                    >
                                        {dataPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Paper elevation={4} sx={{ mb: 2, px: 2, py: 3, borderRadius: 3, backgroundColor: '#fff' }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={1}
                            sx={{
                                background: 'linear-gradient(45deg, #ac372dff, #625, #20a84eff, #635bff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent',
                                display: 'inline-block',
                                fontSize: '1.25rem',
                            }}
                        >
                            Brand C Distribution
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataPie}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                    >
                                        {dataPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Paper elevation={4} sx={{ mb: 2, px: 2, py: 3, borderRadius: 3, backgroundColor: '#fff' }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={1}
                            sx={{
                                background: 'linear-gradient(45deg, #ac372dff, #625, #20a84eff, #635bff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent',
                                display: 'inline-block',
                                fontSize: '1.25rem',
                            }}
                        >
                            Brand Performance
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dataArea}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="amt" stroke="#4a6eb1" fill="#4a6eb1" fillOpacity={0.3} activeDot={{ r: 8 }} />
                                    <Area type="monotone" dataKey="qty" stroke="#67a968" fill="#67a968" fillOpacity={0.3} activeDot={{ r: 8 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle sx={{ padding: '4px 24px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Apply Filters</span>
                        <IconButton onClick={handleCloseDialog} size="large">
                            <CloseIcon color='error' />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} py={1}>
                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={categoryOptions}
                                value={stockFilter.Catfilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Catfilter')}
                                renderInput={(params) => <TextField {...params} label="Category" />}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox checked={selected} size='small' />
                                        <ListItemText primary={option} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={productOptions}
                                value={stockFilter.Prdfilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Prdfilter')}
                                renderInput={(params) => <TextField {...params} label="Product" />}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox checked={selected} size='small' />
                                        <ListItemText primary={option} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={styleOptions}
                                value={stockFilter.Stylefilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Stylefilter')}
                                renderInput={(params) => <TextField {...params} label="Style" />}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox checked={selected} size='small' />
                                        <ListItemText primary={option} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={typeOptions}
                                value={stockFilter.Typefilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Typefilter')}
                                renderInput={(params) => <TextField {...params} label="Type" />}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox checked={selected} size='small' />
                                        <ListItemText primary={option} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={shadeOptions}
                                value={stockFilter.Shadefilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Shadefilter')}
                                renderInput={(params) => <TextField {...params} label="Shade" />}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox checked={selected} size='small' />
                                        <ListItemText primary={option} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={ptnOptions}
                                value={stockFilter.Ptnfilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Ptnfilter')}
                                renderInput={(params) => <TextField {...params} label="PTN" />}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox checked={selected} size='small' />
                                        <ListItemText primary={option} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={brandOption}
                                value={stockFilter.Brandfilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Brandfilter')}
                                getOptionLabel={(option) => option.BRAND_NAME}
                                isOptionEqualToValue={(option, value) => option.BRAND_KEY === value.BRAND_KEY}
                                renderInput={(params) => <TextField {...params} label="Brand" />}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option.BRAND_KEY}>
                                        <Checkbox checked={selected} size='small' />
                                        <ListItemText primary={option.BRAND_NAME} />
                                    </li>
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={clearFilters} color="error" variant='contained' size='small'>
                        Clear
                    </Button>
                    <Button onClick={applyFilters} color="primary" variant='contained' size='small'>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Stock;