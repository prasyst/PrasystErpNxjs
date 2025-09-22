"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
    Box, Typography, Grid, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Button,
    styled, useTheme,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import { GaugeComponent } from 'react-gauge-component';
// import CountUp from 'react-countup';
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });
const CountUp = dynamic(() => import('react-countup'), { ssr: false });

import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    AreaChart,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
} from "recharts";

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

// Sample Data
const kpiData = [
    {
        title: "Total Revenue",
        value: "₹ 1,225",
        icon: <MonetizationOnIcon fontSize="large" />,
        color: "#4caf50",
        change: "5.2%",
    },
    {
        title: "Orders",
        value: "4,580",
        icon: <ShoppingCartIcon fontSize="large" />,
        color: "#2196f3",
        change: "1.8%",
    },
    {
        title: "Customers",
        value: "3,200",
        icon: <PeopleIcon fontSize="large" />,
        color: "#ff9800",
        change: "3.1%",
    },
    {
        title: "Growth Rate",
        value: "12.4%",
        icon: <TrendingUpIcon fontSize="large" />,
        color: "#9c27b0",
        change: "0.9%",
    },
];

const salesData = [
    { month: "Jan-25", sales: 4000000, profit: 2400000 },
    { month: "Feb-25", sales: 3000000, profit: 1398000 },
    { month: "Mar-25", sales: 2000000, profit: 980000 },
    { month: "Apr-25", sales: 2780000, profit: 3908000 },
    { month: "May-25", sales: 1890000, profit: 4800000 },
    { month: "Jun-25", sales: 2390000, profit: 3800000 },
    { month: "Jul-25", sales: 3490000, profit: 4300000 },
    { month: "Aug-25", sales: 2000000, profit: 980000 },
];

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

const recentOrders = [
    {
        id: "#OD1001",
        customer: "Rishabh",
        amount: "₹ 25,000",
        address: "Mumbai",
        status: "Delivered",
    },
    {
        id: "#OD1002",
        customer: "MSD",
        amount: "₹ 15,000",
        address: "Delhi",
        status: "In Transit",
    },
    {
        id: "#OD1003",
        customer: "Virat Kohli",
        amount: "₹ 30,000",
        address: "Lucknow",
        status: "Cancelled",
    },
    {
        id: "#OD1004",
        customer: "Rohit Sharma",
        amount: "₹ 22,000",
        address: "Noida",
        status: "Delivered",
    },
    {
        id: "#OD1005",
        customer: "Ranveer",
        amount: "₹ 22,000",
        address: "Noida",
        status: "Pending",
    },
];

// Helper function for dynamic status colors
const getStatusColor = (status) => {
    switch (status) {
        case "Delivered":
            return "#4caf50";
        case "In Transit":
            return "#2196f3";
        case "Cancelled":
            return "#f44336";
        case "Pending":
            return "#22f";
        default:
            return "#757575";
    }
};

const SalesDashboard = () => {
    const theme = useTheme();
    const totalSales = data.reduce((acc, cur) => acc + cur.sales, 0);

    return (
        <Box sx={{ p: 4, pt: 1, bgcolor: "#f5f7fa", minHeight: "70vh" }}>
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
                        background: 'linear-gradient(45deg, #42a5f5, #478ed1, #7b1fa2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        userSelect: 'none',
                    }}
                >
                    Sales Dashboard
                </Typography>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={1} mb={4} gap={1}>
                {kpiData.map(({ title, value, icon, color }) => (
                    <Grid size={{ xs: 12, md: 3 }} key={title}>
                        <StyledCard>
                            <IconButton
                                sx={{
                                    bgcolor: `${color}22`,
                                    color: color,
                                    width: 60,
                                    height: 60,
                                    boxShadow: `0 0 20px ${color}66`,
                                    "&:hover": { bgcolor: `${color}44` },
                                }}
                                aria-label={title}
                            >
                                {icon}
                            </IconButton>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                    {title}
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" letterSpacing={1}>
                                    {value}
                                </Typography>
                            </Box>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            {/* Sales Charts and Recent Orders */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 2,
                            borderRadius: 4,
                            bgcolor: "white",
                            boxShadow: "0 10px 30px rgb(0 0 0 / 0.12)",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" mb={1}>
                            Monthly Sales & Profit
                        </Typography>
                        <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={salesData}
                                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis
                                        tickFormatter={(val) =>
                                            val >= 1000000
                                                ? `${(val / 1000000).toFixed(1)}M`
                                                : val.toLocaleString()
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value) =>
                                            typeof value === "number"
                                                ? `₹ ${value.toLocaleString()}`
                                                : value
                                        }
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar
                                        dataKey="sales"
                                        name="Sales"
                                        fill="#1976d2"
                                        radius={[8, 8, 0, 0]}
                                        barSize={30}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        name="Profit"
                                        stroke="#388e3c"
                                        strokeWidth={3}
                                        dot={{ r: 6 }}
                                        activeDot={{ r: 8 }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
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
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" mb={1}>
                            Recent Orders
                        </Typography>

                        <TableContainer sx={{ flexGrow: 1 }}>
                            <Table stickyHeader size="small" aria-label="recent orders">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>
                                            Amount
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentOrders.map(({ id, customer, amount, address, status }) => (
                                        <TableRow key={id} hover>
                                            <TableCell>{id}</TableCell>
                                            <TableCell>{customer}</TableCell>
                                            <TableCell >{amount}</TableCell>
                                            <TableCell >{address}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.4,
                                                        borderRadius: 3,
                                                        bgcolor: getStatusColor(status),
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        maxWidth: 100,
                                                        fontSize: 13,
                                                        userSelect: "none",
                                                    }}
                                                >
                                                    {status}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box
                            sx={{
                                mt: 3,
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button variant="contained" color="primary" size="small" >
                                View All Orders
                            </Button>
                        </Box>
                    </Paper>
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
                                            }
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
