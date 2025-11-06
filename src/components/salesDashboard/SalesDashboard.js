"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
    Box, Typography, Grid, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Button,
    styled, useTheme, TextField
} from "@mui/material";
import { LinearProgress, Chip } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    ResponsiveContainer, ComposedChart, Area, AreaChart, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart,
    Line, CartesianGrid, Legend
} from "recharts";
import axiosInstance from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { PieChart } from '@mui/x-charts/PieChart';

// Dynamic import for Gauge
const GaugeComponent = dynamic(
    async () => {
        const mod = await import("react-gauge-component");
        return mod.default ? mod.default : mod.GaugeComponent;
    },
    { ssr: false }
);

// Dynamic import for CountUp
const CountUp = dynamic(
    async () => {
        const mod = await import("react-countup");
        return mod.default ? mod.default : mod.CountUp;
    },
    { ssr: false }
);

// Dummy data for the PieChart
const desktopOS = [
    { id: 'Windows', value: 60, color: '#4caf50' },
    { id: 'macOS', value: 20, color: '#2196f3' },
    { id: 'Linux', value: 10, color: '#ff9800' },
    { id: 'Others', value: 10, color: '#f44336' },
];

const desktopOS2 = [
    { id: 'macOS', value: 20, color: '#f32160ff' },
    { id: 'Others', value: 10, color: '#36e7f4ff' },
    { id: 'Windows', value: 20, color: '#4c56afff' },
    { id: 'Linux', value: 10, color: '#d39436ff' },
    { id: 'Others', value: 10, color: '#59969bff' },
    { id: 'Windows', value: 20, color: '#2b3480ff' },
    { id: 'Linux', value: 10, color: '#c47705ff' },
];

const StyledCard = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #28357cff 0%, #706161ff 100%)',
    color: '#fff',
    gap: theme.spacing(5),
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const StyledCard2 = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: '12px',
   background: 'linear-gradient(135deg, #5d6bbbff 0%, #706161ff 100%)',
    color: '#fff',
}));

const data = [
    { month: 'Jan-25', sales: 4000, profit: 2400 },
    { month: 'Feb-25', sales: 3000, profit: 1398 },
    { month: 'Mar-25', sales: 2000, profit: 980 },
    { month: 'Apr-25', sales: 2780, profit: 3908 },
    { month: 'May-25', sales: 1890, profit: 4800 },
    { month: 'Jun-25', sales: 2390, profit: 3800 },
    { month: 'Jul-25', sales: 3490, profit: 3000 },
    { month: 'Aug-25', sales: 2490, profit: 4500 },
    { month: 'Sep-25', sales: 4490, profit: 5300 },
    { month: 'Nov-25', sales: 5490, profit: 3300 },
    { month: 'Dec-25', sales: 3490, profit: 6300 },
];

const lineChartData1 = [
    { name: 'Week 1', value: 400 },
    { name: 'Week 2', value: 300 },
    { name: 'Week 3', value: 500 },
    { name: 'Week 4', value: 200 },
];

const lineChartData2 = [
    { name: 'Jan-25', value: 900 },
    { name: 'Feb-25', value: 300 },
    { name: 'Mar-25', value: 400 },
    { name: 'Apr-25', value: 600 },
    { name: 'May-25', value: 500 },
    { name: 'Jun-25', value: 300 },
    { name: 'Jul-25', value: 700 },
    { name: 'Aug-25', value: 400 },
    { name: 'Sep-25', value: 900 },
    { name: 'Oct-25', value: 500 },
    { name: 'Nov-25', value: 800 },
    { name: 'Dec-25', value: 300 },
];

const SalesDashboard = () => {
    const theme = useTheme();
    const [dateFrom, setDateFrom] = useState(dayjs().startOf('month'));
    const [dateTo, setDateTo] = useState(dayjs().endOf('month'));
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [summaryData, setSummaryData] = useState({
        TOT_QTY: 0,
        TOT_BALQTY: 0,
        TOT_SALQTY: 0,
        TOT_AMT: 0,
        TOT_BALAMT: 0,
        TOT_SALAMT: 0,
    });

    const totalSales = data.reduce((acc, cur) => acc + cur.sales, 0);

    const totalConversion = (
        isNaN(parseFloat(summaryData.TOT_SALQTY)) || isNaN(parseFloat(summaryData.TOT_QTY)) || parseFloat(summaryData.TOT_QTY) === 0
    )
        ? 0
        : (parseFloat(summaryData.TOT_SALQTY) / parseFloat(summaryData.TOT_QTY)) * 100;

    useEffect(() => {
        showTableData();
    }, [])

    useEffect(() => {
        showTableData();
        totalCoutData();
    }, []);

    const showTableData = async () => {
        try {
            const response = await axiosInstance.post('OrderDash/GetOrderDashBoard', {
                COBR_ID: "02",
                FCYR_KEY: "25",
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "",
                PageNumber: 1,
                PageSize: 10,
                SearchText: ""
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setTableData(response.data.DATA);
            } else {
                toast.info("No record found.");
            }
        } catch (error) {
            toast.error('Error while fetching the table data.');
        }
    };

    const totalCoutData = async () => {
        try {
            const response = await axiosInstance.post("OrderDash/GetOrderDashBoard", {
                COBR_ID: "02",
                FCYR_KEY: "25",
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "OrdTotSum",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const summary = response.data.DATA[0];
                setSummaryData({
                    TOT_QTY: summary.TOT_QTY || 0,
                    TOT_BALQTY: summary.TOT_BALQTY || 0,
                    TOT_SALQTY: summary.TOT_SALQTY || 0,
                    TOT_AMT: summary.TOT_AMT || 0,
                    TOT_BALAMT: summary.TOT_BALAMT || 0,
                    TOT_SALAMT: summary.TOT_SALAMT || 0,
                });
            } else {
                toast.info("No record found.");
            }
        } catch (error) {
            toast.error("Error from API response.");
        }
    };

    const handleFetchedData = () => {
        showTableData();
        totalCoutData();
    };

    const handleViewDocument = () => {

    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // You would filter your data based on the search term
    const filteredData = tableData.filter((item) => {
        return (
            (item.ORDBK_NO?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.PARTY_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.CITY_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.STATE_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.FGCAT_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.FGPRD_ABRV?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.BRAND_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.BROKER_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
            (item.SALEPERSON_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
        );
    });

    return (
        <Box sx={{ p: 4, pt: 1, bgcolor: "#f5f7fa", minHeight: "70vh" }}>
            <ToastContainer />
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                        background: "linear-gradient(45deg, #42a5f5, #478ed1, #7b1fa2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        userSelect: "none",
                    }}
                >
                    Order Dashboard
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <DatePicker
                            label="From-Date"
                            value={dateFrom}
                            onChange={(newValue) => setDateFrom(newValue)}
                            format="DD/MM/YYYY"
                            views={['day', 'month', 'year']}
                            sx={{ width: 150 }}
                        />
                        <DatePicker
                            label="To-Date"
                            value={dateTo}
                            onChange={(newValue) => setDateTo(newValue)}
                            format="DD/MM/YYYY"
                            views={['day', 'month', 'year']}
                            sx={{ width: 150, }}
                        />
                        <Button
                            variant='contained'
                            onClick={handleFetchedData}
                            sx={{
                                borderRadius: '20px', backgroundColor: '#635bff', '&:hover': {
                                    backgroundColor: '#635bff'
                                },
                            }}
                        >
                            Get Data
                        </Button>
                    </Box>
                </LocalizationProvider>
            </Box>

            {/* Cards Data */}
            <Grid container spacing={1} mb={2} gap={1}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <StyledCard>
                        <IconButton
                            sx={{
                                bgcolor: "#4caf5022",
                                color: "#4caf50",
                                width: 60,
                                height: 60,
                                boxShadow: "0 0 20px #4caf5066",
                                "&:hover": { bgcolor: "#4caf5044" },
                            }}
                            aria-label="Total Orders"
                        >
                            <CurrencyRupeeIcon fontSize="large" />
                        </IconButton>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                Total Orders
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" letterSpacing={1}>
                                ₹ {summaryData.TOT_AMT}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                Qty: {summaryData.TOT_QTY}
                            </Typography>
                        </Box>
                    </StyledCard>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StyledCard>
                        <IconButton
                            sx={{
                                bgcolor: "#2196f322",
                                color: "#2196f3",
                                width: 60,
                                height: 60,
                                boxShadow: "0 0 20px #2196f366",
                                "&:hover": { bgcolor: "#2196f344" },
                            }}
                            aria-label="Dispatch"
                        >
                            <ShoppingCartIcon fontSize="large" />
                        </IconButton>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                Dispatch
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" letterSpacing={1}>
                                ₹ {summaryData.TOT_SALAMT}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                Qty: {summaryData.TOT_SALQTY}
                            </Typography>
                        </Box>
                    </StyledCard>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StyledCard>
                        <IconButton
                            sx={{
                                bgcolor: "#ff980022",
                                color: "#ff9800",
                                width: 60,
                                height: 60,
                                boxShadow: "0 0 20px #ff980066",
                                "&:hover": { bgcolor: "#ff980044" },
                            }}
                            aria-label="Order Balance"
                        >
                            <PeopleIcon fontSize="large" />
                        </IconButton>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                Order Balance
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" letterSpacing={1}>
                                ₹ {summaryData.TOT_BALAMT}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                Qty: {summaryData.TOT_BALQTY}
                            </Typography>
                        </Box>
                    </StyledCard>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StyledCard>
                        <IconButton
                            sx={{
                                bgcolor: "#9c27b022",
                                color: "#9c27b0",
                                width: 60,
                                height: 60,
                                boxShadow: "0 0 20px #9c27b066",
                                "&:hover": { bgcolor: "#9c27b044" },
                            }}
                            aria-label="Conversion %"
                        >
                            <TrendingUpIcon fontSize="large" />
                        </IconButton>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                Conversion Rate
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" letterSpacing={1}>
                                {totalConversion.toFixed(2)}%
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                {totalConversion > 50 ? (
                                    <ArrowUpwardIcon sx={{ color: '#4caf50' }} fontSize="small" />
                                ) : (
                                    <ArrowDownwardIcon sx={{ color: '#f44336' }} fontSize="small" />
                                )}
                                <Typography variant="body2" color={totalConversion > 50 ? "success.main" : "error.main"} fontWeight={600}>
                                    {totalConversion.toFixed(0)}%
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={totalConversion}
                                    sx={{ height: 10, borderRadius: 5, bgcolor: '#fff3e0' }}
                                    color="success"
                                />
                            </Box>
                        </Box>
                    </StyledCard>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid size={{ xs: 12, md: 9 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 1.5,
                            borderRadius: 4,
                            bgcolor: 'white',
                            boxShadow: '0 10px 30px rgb(0 0 0 / 0.12)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Recent Orders
                            </Typography>

                            {/* Search Box */}
                            <TextField
                                label="Search Orders"
                                variant="outlined"
                                size="small"
                                sx={{
                                    width: 250,
                                    borderRadius: '9px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '9px',
                                    },
                                    '& .MuiInputLabel-root': {
                                        borderRadius: '9px',
                                    }
                                }}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search by Order No, Party, etc."
                            />
                        </Box>

                        {/* Table Container with fixed height */}
                        <TableContainer sx={{ flexGrow: 1, maxHeight: 400, overflowY: 'auto', overflowX: 'auto' }}>
                            <Table stickyHeader size="small" aria-label="recent orders">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Actions</TableCell>
                                        <TableCell>OrderNo</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Party</TableCell>
                                        <TableCell>City</TableCell>
                                        <TableCell>State</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>Broker</TableCell>
                                        <TableCell>SalesMan</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <TableRow key={item.ORDBK_NO + index} hover>
                                                <TableCell>
                                                    <VisibilityIcon
                                                        sx={{ cursor: 'pointer', color: '#1976d2' }}
                                                        onClick={() => handleViewDocument(item.ORDBK_NO)}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.ORDBK_NO}</TableCell>
                                                <TableCell>{dayjs(item.ORDBK_DT).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell>{item.PARTY_NAME}</TableCell>
                                                <TableCell>{item.CITY_NAME}</TableCell>
                                                <TableCell>{item.STATE_NAME}</TableCell>
                                                <TableCell>{item.QTY}</TableCell>
                                                <TableCell>{item.BROKER_NAME}</TableCell>
                                                <TableCell>{item.SALEPERSON_NAME}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={12} align="center">
                                                No records found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Right Column with Cards */}
                <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
                    <StyledCard2 sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <PieChart
                            series={[
                                {
                                    data: desktopOS,
                                    innerRadius: 30,
                                    outerRadius: 100,
                                    paddingAngle: 2,
                                    cornerRadius: 5,
                                },
                            ]}
                            width={250}
                            height={200}
                            legend={{
                                hidden: false,
                                position: {
                                    vertical: 'middle',
                                    horizontal: 'right',
                                },
                                padding: 10,
                            }}
                            slotProps={{
                                legend: {
                                    labelStyle: { fontSize: 12 },
                                    itemMarkWidth: 22,
                                    itemGap: 6,
                                },
                            }}
                        />
                    </StyledCard2>

                    {/* Second Card */}
                    <StyledCard2 sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <PieChart
                            series={[
                                {
                                    data: desktopOS2,
                                    innerRadius: 30,
                                    outerRadius: 100,
                                    paddingAngle: 2,
                                    cornerRadius: 5,
                                },
                            ]}
                            width={250}
                            height={200}
                            legend={{
                                hidden: false,
                                position: {
                                    vertical: 'middle',
                                    horizontal: 'right',
                                },
                                padding: 10,
                            }}
                            slotProps={{
                                legend: {
                                    labelStyle: { fontSize: 12 },
                                    itemMarkWidth: 22,
                                    itemGap: 6,
                                },
                            }}
                        />
                    </StyledCard2>
                </Grid>
            </Grid>

            <Grid container spacing={2} mt={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 2,
                            borderRadius: 4,
                            bgcolor: "white",
                            boxShadow: "0 10px 30px rgb(0 0 0 / 0.12)",
                            height: 300,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" mb={1}>
                            Weekly Order
                        </Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <LineChart data={lineChartData1} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#1976d2"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                    dot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 2,
                            borderRadius: 4,
                            bgcolor: "white",
                            boxShadow: "0 10px 30px rgb(0 0 0 / 0.12)",
                            height: 300,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" mb={1}>
                            Monthly Performance
                        </Typography>

                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={lineChartData2} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ff6f00" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#d50000" stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="value"
                                    fill="url(#colorBar)"
                                    radius={[8, 8, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} mt={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={5}
                        sx={{
                            borderRadius: 4,
                            boxShadow: "0 10px 30px rgb(0 0 0 / 0.12)",
                            height: 300,
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: 600,
                                    maxHeight: 600,
                                    '& text[style*="font-size: 36.12px"]': {
                                        fontSize: '16px !important',
                                        bottom: '15px',
                                        fill: '#031425ff !important',
                                        textShadow: 'none !important',
                                    },
                                }}
                            >
                                <GaugeComponent
                                    value={50}
                                    type="grafana"
                                    style={{ width: '100%', height: '100%' }}
                                    labels={{
                                        tickLabels: {
                                            type: "inner",
                                            ticks: [
                                                { value: 20 },
                                                { value: 40 },
                                                { value: 60 },
                                                { value: 80 },
                                                { value: 100 },
                                            ],
                                            defaultTickValueConfig: {
                                                style: {
                                                    fill: "#031425ff",
                                                    fontSize: "14px"
                                                }
                                            },
                                            defaultTickLineConfig: {
                                                color: "#FF00FF",
                                                width: 2,
                                                length: 10,
                                                distanceFromArc: 3
                                            },
                                        }
                                    }}
                                    arc={{
                                        colorArray: ['#5BE12C', '#EA4228'],
                                        subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                                        padding: 0.02,
                                        width: 0.3,
                                    }}
                                    pointer={{
                                        elastic: true,
                                        animationDelay: 0,
                                        color: "#2c2a2aff",
                                        length: 0.5,
                                        baseLineRatio: 0.3,
                                        width: 8,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={5} sx={{ p: 2, borderRadius: 2, height: 300 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Sales vs Profit
                        </Typography>
                        <Box sx={{ width: '100%', height: '100%' }}>
                            <ResponsiveContainer width="100%" height="90%">
                                <ComposedChart
                                    data={data}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="month" />
                                    <YAxis
                                        tickLine={true}
                                        axisLine={true}
                                        yAxisId="left"
                                        label={{ value: 'Sales', angle: -90, position: 'insideLeft' }}
                                    />
                                    <YAxis
                                        tickLine={true}
                                        axisLine={true}
                                        yAxisId="right"
                                        orientation="right"
                                        label={{ value: 'Profit', angle: 90, position: 'insideRight' }}
                                    />
                                    <Tooltip
                                        formatter={(value, name) =>
                                            [value.toLocaleString('en-US'), name === 'sales' ? 'Sales' : 'Profit']
                                        }
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="sales"
                                        name="Sales"
                                        barSize={40}
                                        fill="#1976d2"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="profit"
                                        name="Profit"
                                        stroke="#ff7f50"
                                        strokeWidth={3}
                                        dot={{ r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                    <Paper
                        elevation={6}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            height: 460,
                            backgroundColor: theme.palette.mode === 'dark' ? '#1f1f1f' : '#fefefe',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.08)",
                        }}
                    >
                        {/* Title and Total Sales */}
                        <Box
                            sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Monthly Sales Trend
                            </Typography>

                            {/* Animated Total Sales */}
                            <Box textAlign="right">
                                <Typography variant="h4" fontWeight="bold" color="primary">
                                    ₹ <CountUp end={totalSales} duration={20} separator="," />
                                </Typography>
                                <Typography color="text.secondary" fontSize={14}>
                                    Total Sales This Period
                                </Typography>
                            </Box>
                        </Box>

                        {/* Chart Area */}
                        <Box sx={{ width: '100%', height: '80%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#42a5f5" />
                                            <stop offset="100%" stopColor="#1e88e5" />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="4 4" stroke="#ddd" opacity={0.4} />
                                    <XAxis
                                        dataKey="month"
                                        tickMargin={12}
                                        tickLine={true}
                                        axisLine={true}
                                        style={{ fontWeight: 500 }}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                        tickLine={true}
                                        axisLine={true}
                                        style={{ fontWeight: 500 }}
                                    />
                                    <Tooltip
                                        formatter={(value) => `₹ ${value.toLocaleString('en-IN')}`}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: '1px solid #1976d2',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            backgroundColor: '#fff',
                                        }}
                                        itemStyle={{ fontWeight: 500 }}
                                        labelStyle={{ fontWeight: 'bold', color: '#1976d2' }}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        align="center"
                                        iconType="circle"
                                        wrapperStyle={{
                                            padding: 0,
                                            marginBottom: -8,
                                            fontWeight: 600,
                                            fontSize: 13,
                                            color: '#444',
                                        }}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        name="Monthly Sales"
                                        stroke="url(#lineGradient)"
                                        strokeWidth={3}
                                        fill="url(#salesGradient)"
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        name="Sales Line"
                                        stroke="url(#lineGradient)"
                                        strokeWidth={3}
                                        dot={{
                                            r: 6,
                                            stroke: '#fff',
                                            strokeWidth: 2,
                                            fill: '#1976d2',
                                        }}
                                        activeDot={{
                                            r: 8,
                                            stroke: '#fff',
                                            strokeWidth: 2,
                                            fill: '#1976d2',
                                        }}
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default SalesDashboard;
