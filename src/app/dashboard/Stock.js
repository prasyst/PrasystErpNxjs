'use client';

import React, { useState, useEffect } from 'react';
import {
    Autocomplete, Box, Button, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, TextField,
    DialogTitle, Grid, ListItemText, Paper, Stack, Typography, IconButton, Card, CardContent
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie,
    Cell, AreaChart, Area
} from 'recharts';
import CloseIcon from '@mui/icons-material/Close';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import InventoryIcon from '@mui/icons-material/Inventory';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { FixedSizeList as List } from 'react-window';
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";
ModuleRegistry.registerModules([AllCommunityModule]);

const COLORS = ['#4a6eb1', '#67a968', '#ffbb33', '#ff4444', '#635bff', '#555', '#222'];

const prodColors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6', '#E74C3C'];

const Stock = () => {
    const currentYear = dayjs().year();
    const previousYear = currentYear - 1;
    const [dateFrom, setDateFrom] = useState(dayjs(`${previousYear}-04-01`));
    const [dateTo, setDateTo] = useState(dayjs(`${currentYear}-03-31`));
    const [cobrId, setCobrId] = useState(localStorage.getItem("COBR_ID"));
    const [fcyr, setFcyr] = useState(localStorage.getItem("FCYR_KEY"));
    const [totalStck, setTotalStck] = useState([]);
    const [brandData, setBrandData] = useState([]);
    const [productWise, setProductWise] = useState([]);
    const [recentStock, setRecentStock] = useState([]);
    const [recentLoading, setRecentLoading] = useState(false);
    const [productType, setProductType] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [brandOption, setBrandOption] = useState([]);
    const [categoryOption, setCategoryOption] = useState([]);
    const [ProductOption, setProductOption] = useState([]);
    const [StylesOption, setStyleOption] = useState([]);
    const [TypeOption, setTypeOption] = useState([]);
    const [ShadeOption, setShadeOption] = useState([]);
    const [PtnOption, setPtnOption] = useState([]);
    const [dataPie, setDataPie] = useState([]);
    const [categoryPie, setCategoryPie] = useState([]);
    const [productPie, setProductPie] = useState([]);
    const [stockFilter, setStockFilter] = useState({
        Brandfilter: [],
        Catfilter: [],
        Prdfilter: [],
        Stylefilter: [],
        Typefilter: [],
        Shadefilter: [],
        Ptnfilter: [],
    });

    const handleAutocompleteChange = (event, newValue, filterName) => {
        setStockFilter((prev) => ({
            ...prev,
            [filterName]: newValue,
        }));
    };

    const handleApplyFilters = () => {
        setOpenDialog(false);
        handleGetData();
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
        handleGetData();
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const recentStockColumns = [
        { field: "FGCAT_NAME", headerName: "Category", width: 180, filter: 'agSetColumnFilter' },
        { field: "FGPRD_NAME", headerName: "Product", width: 220 },
        { field: "FGSTYLE_CODE", headerName: "Code", width: 200 },
        { field: "FGTYPE_NAME", headerName: "Type", width: 150 },
        { field: "FGSHADE_NAME", headerName: "Shade", width: 150 },
        { field: "BRAND_NAME", headerName: "Brand", width: 150 },
        { field: "QTY", headerName: "Qty", filter: "agNumberColumnFilter", width: 140 },
        { field: "MRP", headerName: "Mrp", filter: "agNumberColumnFilter", width: 140 },
        { field: "WSP", headerName: "Wsp", filter: "agNumberColumnFilter", width: 140 },
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
        fetchProductWiseStock();
        fetchRecentStock();
        fetchProductType();
        fetchBrandDrp();
        fetchCategory();
        fetchProduct();
        fetchStyles();
        fetchType();
        fetchShade();
        fetchFgPtn();
    }, []);

    useEffect(() => {
        if (brandData.length > 0) {
            const sortedData = [...brandData].sort((a, b) => b.qty - a.qty);
            const top5Data = sortedData.slice(0, 5);
            setDataPie(top5Data);
        }
    }, [brandData]);

    useEffect(() => {
        if (productWise.length > 0) {
            const sortedData = [...productWise].sort((a, b) => b.prodQty - a.prodQty);
            const top5CatData = sortedData.slice(0, 5);
            setCategoryPie(top5CatData);
        }
    }, [brandData]);

    const handleGetData = () => {
        fetchTotalStock();
        fetchBrandWiseStock();
        fetchProductWiseStock();
        fetchRecentStock();
        fetchProductType();
    };

    const filterStockPayload = () => ({
        Brandfilter: stockFilter.Brandfilter.map((item) => item.BRAND_KEY).join(',') || '',
        Catfilter: stockFilter.Catfilter.map((item) => item.FGCAT_KEY).join(',') || '',
        Prdfilter: stockFilter.Prdfilter.map((item) => item.FGPRD_KEY).join(',') || '',
        Stylefilter: stockFilter.Stylefilter.map((item) => item.FGSTYLE_CODE).join(',') || '',
        Typefilter: stockFilter.Typefilter.map((item) => item.FGTYPE_KEY).join(',') || '',
        Shadefilter: stockFilter.Shadefilter.map((item) => item.FGSHADE_KEY).join(',') || '',
        Ptnfilter: stockFilter.Ptnfilter.map((item) => item.FGPTN_KEY).join(',') || ''
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
            } else {
                setTotalStck([]);
            }
        } catch {
            setTotalStck([]);
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
            } else {
                setBrandData([])
            }
        } catch (error) {
            setBrandData([]);
            toast.error("Error from api response.");
        }
    };

    const fetchProductWiseStock = async () => {
        try {
            const getFilterPayload = filterStockPayload();
            const response = await axiosInstance.post('OrderDash/GetStockDashBoard', {
                COBR_ID: cobrId,
                FCYR_KEY: fcyr,
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: 'Productwise',
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                ...getFilterPayload
            })
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                let prodChart = response.data.DATA.map(item => ({
                    name: item.FGCAT_NAME,
                    prodQty: item.QTY,
                    proData: item.FGPRD_NAME,
                }))
                setProductWise(prodChart);
            } else {
                setProductWise([]);
            }
        } catch (error) {
            toast.error("Errror while fetching product wise.");
        }
    };

    const lineChartData = brandData.map((brand, index) => ({
        name: brand.name || `Brand ${index + 1}`,
        brandQty: brand.qty || 0,
        productQty: productWise[index]?.prodQty || 0,
    }));

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
            } else {
                setRecentStock([]);
            }
        } catch {
            setRecentStock([]);
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
            } else {
                setProductType([]);
            }
        } catch (error) {
            setProductType([]);
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
            const response = await axiosInstance.post('Product/GetFgPrdDrp', {
                Flag: "",
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setProductOption(response.data.DATA);
            }
        } catch (error) {
            toast.error('Error fetching products:', error);
        }
    };

    const fetchStyles = async () => {
        try {
            const response = await axiosInstance.post("FGSTYLE/GetFgstyleDrp", {
                FGSTYLE_ID: 0,
                FGPRD_KEY: "",
                FGSTYLE_CODE: "",
                FLAG: "",
                ALT_BARCODE: ""
            })
            if (response.data.STATUS === 0) {
                setStyleOption(response.data.DATA);
            }
        } catch {
            toast.error("Error while fetching styles.");
        }
    };

    const fetchType = async () => {
        try {
            const response = await axiosInstance.post("FgType/GetFgTypeDrp", {
                FGSTYLE_ID: 0,
                FLAG: ""
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setTypeOption(response.data.DATA);
            }
        } catch (error) {
            toast.error("Error while fetching the type.");
        }
    };

    const fetchShade = async () => {
        try {
            const response = await axiosInstance.post("Fgshade/GetFgshadedrp", {
                FGSTYLE_ID: 0,
                FLAG: ""
            })
            if (response.data.STATUS === 0) {
                setShadeOption(response.data.DATA);
            }
        } catch (error) {
            toast.error("Error while fetching shade.");
        }
    };

    const fetchFgPtn = async () => {
        try {
            const response = await axiosInstance.post("Fgptn/GetFgptnDrp", {
                FGSTYLE_ID: 0,
                FLAG: ""
            })
            if (response.data.STATUS === 0) {
                setPtnOption(response.data.DATA);
            }
        } catch (error) {
            toast.error("Error while fetching shade.");
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
                    flexWrap: "wrap",
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


                <Button
                    variant="contained"
                    size="small"
                    startIcon={<FilterAltIcon />}
                    onClick={handleOpenDialog}
                    sx={{
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #635bff 30%, #a558e0 100%)',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        padding: '5px 12px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '& .MuiButton-startIcon': {
                            fontSize: '18px',
                        },
                    }}
                >
                    Filters
                </Button>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                {[
                    {
                        title: "Opening Stock",
                        value: totalStck[0]?.OP_QTY || 0,
                        gradient: 'linear-gradient(135deg, #64B5F6 0%, #1565C0 100%)',
                        icon: <ShowChartIcon />,
                        iconBg: 'rgba(33, 150, 243, 0.2)',
                        trend: 'up'
                    },
                    {
                        title: "Closing Stock",
                        value: totalStck[0]?.QTY || 0,
                        gradient: 'linear-gradient(135deg, #7BBE9F 0%, #2E7D32 100%)',
                        icon: <ShoppingCart />,
                        iconBg: 'rgba(76, 175, 80, 0.2)',
                        trend: 'up'
                    },
                    {
                        title: "Stock Value",
                        value: (totalStck[0]?.TOT_AMT / 100000).toFixed(2) + ' L' || '0.00 L',
                        gradient: 'linear-gradient(135deg, #FF8C71 0%, #D84315 100%)',
                        icon: <CurrencyRupeeIcon />,
                        iconBg: 'rgba(244, 67, 54, 0.2)',
                        trend: 'down'
                    },
                    {
                        title: "Total Stock Qty",
                        value: totalStck[0]?.QTY || 0,
                        qty: (totalStck[0]?.TOT_AMT / 100000).toFixed(2) + ' L' || '0.00 L',
                        gradient: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
                        icon: <InventoryIcon />,
                        iconBg: 'rgba(255, 193, 7, 0.2)',
                        trend: 'up'
                    }
                ].map((metric, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card
                            elevation={0}
                            sx={{
                                background: metric.gradient,
                                borderRadius: 3,
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease-in-out',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                                    '& .metric-icon': {
                                        transform: 'scale(1.1) rotate(5deg)'
                                    }
                                }
                            }}
                        >
                            <CardContent sx={{
                                p: { xs: 1.5, sm: 2 },
                                position: 'relative',
                                zIndex: 1,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize: { xs: '0.65rem', sm: '1rem' },
                                                fontWeight: 500,
                                                display: 'block',
                                                mb: 0.5,
                                                color: '#fff',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            {metric.title}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            sx={{
                                                fontSize: { xs: '1.1rem', sm: '1.5rem', md: '1.75rem' },
                                                mb: 0.5,
                                                color: 'white',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            {metric.title === "Total Stock Qty" ? (
                                                <div>
                                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                        Qty: {metric.value}
                                                    </span>
                                                    <span style={{ fontWeight: 'normal', fontSize: '1rem', marginLeft: '8px', marginRight: '8px' }}>
                                                        |
                                                    </span>
                                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                        Value: {metric.qty}
                                                    </span>
                                                </div>
                                            ) : metric.value}
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        width: { xs: 36, sm: 44 },
                                        height: { xs: 36, sm: 44 },
                                        borderRadius: '12px',
                                        background: metric.iconBg,
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        className: 'metric-icon'
                                    }}>
                                        {React.cloneElement(metric.icon, {
                                            sx: {
                                                color: 'white',
                                                fontSize: { xs: 18, sm: 22 },
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                            }
                                        })}
                                    </Box>
                                </Stack>

                                <Box sx={{ position: 'absolute', top: 8, right: 8, opacity: 0.1, zIndex: 0 }}>
                                    {metric.trend === 'up' ? '↗' : '↘'}
                                </Box>
                            </CardContent>

                            {/* Bottom shine animation */}
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                overflow: 'hidden',
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(255, 255, 255, 0.4)',
                                    animation: 'progress 2s ease-in-out infinite alternate'
                                },
                                '@keyframes progress': {
                                    '0%': { transform: 'translateX(-100%)' },
                                    '100%': { transform: 'translateX(100%)' }
                                }
                            }} />
                        </Card>
                    </Grid>
                ))}
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
                            Brand Wise Qty
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={brandData} margin={{ right: 10, left: 10 }}>
                                    <defs>
                                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#635bff" />
                                            <stop offset="20%" stopColor="#c51d1d" />
                                            <stop offset="100%" stopColor="#00bcd4" />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="qty" fill="url(#gradient1)" />
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
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Brand vs Product Quantity
                        </Typography>

                        <Box sx={{ width: '100%', height: 420 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={lineChartData}
                                    margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />

                                    <Line type="monotone" dataKey="brandQty" name="Brand Qty" stroke="#4a6eb1" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="productQty" name="Product Qty" stroke="#67a968" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
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
                            Top Brand Distributions
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataPie}
                                        dataKey="qty"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={140}
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
                            Top Category Wise
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryPie}
                                        dataKey="prodQty"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={140}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                    >
                                        {categoryPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={prodColors[index % prodColors.length]} />
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
                                <AreaChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="brandQty" stroke="#4a6eb1" fill="#4a6eb1" fillOpacity={0.3} activeDot={{ r: 8 }} />
                                    <Area type="monotone" dataKey="productQty" stroke="67a968" fill="#67a968" fillOpacity={0.3} activeDot={{ r: 8 }} />
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
                    <Grid container spacing={1} py={1}>
                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={categoryOption}
                                value={stockFilter.Catfilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Catfilter')}
                                getOptionLabel={(option) => option.FGCAT_NAME}
                                isOptionEqualToValue={(option, value) => option.FGCAT_KEY === value.FGCAT_KEY}
                                renderInput={(params) => <TextField {...params} label="Category" />}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option.FGCAT_KEY}
                                        style={{ display: 'flex', alignItems: 'center', padding: '2px 12px', margin: '0' }}
                                    >
                                        <Checkbox checked={selected} size='small' sx={{ p: 0, mr: '8px', height: '15px', width: '18px' }} />
                                        <ListItemText primary={option.FGCAT_NAME} sx={{ m: 0, p: 0 }} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={ProductOption}
                                value={stockFilter.Prdfilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Prdfilter')}
                                getOptionLabel={(option) => option.FGPRD_NAME}
                                isOptionEqualToValue={(option, value) => option.FGPRD_KEY === value.FGPRD_KEY}
                                renderInput={(params) => <TextField {...params} label="Product" />}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option.FGPRD_KEY}
                                        style={{ display: 'flex', alignItems: 'center', padding: '2px 12px', margin: '0' }}
                                    >
                                        <Checkbox checked={selected} size='small' sx={{ p: 0, mr: '8px', height: '15px', width: '18px' }} />
                                        <ListItemText primary={option.FGPRD_NAME} sx={{ m: 0, p: 0 }} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={StylesOption}
                                value={stockFilter.Stylefilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Stylefilter')}
                                getOptionLabel={(option) => option.FGSTYLE_NAME}
                                isOptionEqualToValue={(option, value) => option.FGSTYLE_CODE === value.FGSTYLE_CODE}
                                renderInput={(params) => <TextField {...params} label="Style" />}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option.FGSTYLE_CODE}
                                        style={{ display: 'flex', alignItems: 'center', padding: '2px 12px', margin: '0' }}
                                    >
                                        <Checkbox checked={selected} size='small' sx={{ p: 0, mr: '8px', height: '15px', width: '18px' }} />
                                        <ListItemText primary={option.FGSTYLE_NAME} sx={{ m: 0, p: 0 }} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={TypeOption}
                                value={stockFilter.Typefilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Typefilter')}
                                getOptionLabel={(option) => option.FGTYPE_NAME}
                                isOptionEqualToValue={(option, value) => option.FGTYPE_KEY === value.FGTYPE_KEY}
                                renderInput={(params) => <TextField {...params} label="Type" />}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option.FGTYPE_KEY}
                                        style={{ display: 'flex', alignItems: 'center', padding: '2px 12px', margin: '0' }}
                                    >
                                        <Checkbox checked={selected} size="small" sx={{ padding: 0, marginRight: '8px', height: '15px', width: '18px' }} />
                                        <ListItemText primary={option.FGTYPE_NAME} sx={{ margin: 0, padding: 0 }}
                                        />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={ShadeOption}
                                value={stockFilter.Shadefilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Shadefilter')}
                                getOptionLabel={(option) => option.FGSHADE_NAME}
                                isOptionEqualToValue={(option, value) => option.FGSHADE_KEY === value.FGSHADE_KEY}
                                renderInput={(params) => <TextField {...params} label="Shade" />}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option.FGSHADE_KEY}
                                        style={{ display: 'flex', alignItems: 'center', padding: '2px 12px', margin: '0' }}
                                    >
                                        <Checkbox checked={selected} size='small' sx={{ p: 0, mr: '8px', height: '15px', width: '18px' }} />
                                        <ListItemText primary={option.FGSHADE_NAME} sx={{ m: 0, p: 0 }} />
                                    </li>
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Autocomplete
                                multiple
                                options={PtnOption}
                                value={stockFilter.Ptnfilter}
                                onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'Ptnfilter')}
                                getOptionLabel={(option) => option.FGPTN_NAME}
                                isOptionEqualToValue={(option, value) => option.FGPTN_KEY === value.FGPTN_KEY}
                                renderInput={(params) => <TextField {...params} label="PTN" />}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option.FGPTN_KEY}
                                        style={{ display: 'flex', alignItems: 'center', padding: '2px, 12px', margin: 0 }}
                                    >
                                        <Checkbox checked={selected} size='small' sx={{ p: 0, mr: '8px', height: '15px', width: '18px' }} />
                                        <ListItemText primary={option.FGPTN_NAME} sx={{ m: 0, p: 0 }} />
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
                                    <li {...props} key={option.BRAND_KEY}
                                        style={{ display: 'flex', alignItems: 'center', padding: '2px 12px', margin: '0' }}
                                    >
                                        <Checkbox checked={selected} size='small' sx={{ p: 0, mr: '8px', height: '15px', width: '18px' }} />
                                        <ListItemText primary={option.BRAND_NAME} sx={{ m: 0, p: 0 }} />
                                    </li>
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={clearFilters} color="error" variant='contained' size='small' sx={{ borderRadius: '20px' }}>
                        Clear
                    </Button>
                    <Button onClick={handleApplyFilters} color="primary" variant='contained' size='small' sx={{ borderRadius: '20px' }}>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Stock;