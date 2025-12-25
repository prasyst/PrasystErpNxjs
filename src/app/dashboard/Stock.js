'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { AttachMoney, People, ShoppingCart, TrendingUp, ArrowBack } from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Stock = () => {

    const [totalStck, setTotalStck] = useState([]);
    const currentYear = dayjs().year();
    const [dateFrom, setDateFrom] = useState(dayjs(`${currentYear}-04-01`));
    const [dateTo, setDateTo] = useState(dayjs(`${currentYear + 1}-03-31`));

    useEffect(() => {
        fetchTotalStock();
    }, []);

    const handleGetData = () => {

    };

    const fetchTotalStock = async () => {
        try {
            const response = await axiosInstance.post("OrderDash/GetStockDashBoard", {
                COBR_ID: "02",
                FCYR_KEY: "25",
                FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
                To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
                Flag: "TotalStock",
                PageNumber: 1,
                PageSize: 10,
                SearchText: "",
                Brandfilter: "",
                Catfilter: "",
                Prdfilter: "",
                Stylefilter: "",
                Typefilter: "",
                Shadefilter: "",
                Ptnfilter: ""
            })
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setTotalStck(response.data.DATA);
            }
        } catch {
            toast.error("Error while loading total");
        }
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>

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
                    </Box>
                </LocalizationProvider>
            </Box>

            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Stock Qty</Typography>
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
                                <Typography variant="h4" fontWeight="bold" mt={1}>1,660</Typography>
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
                                <Typography variant="h4" fontWeight="bold" mt={1}>$92,120</Typography>
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
                                <Typography variant="h4" fontWeight="bold" mt={1}>842</Typography>
                                <Chip label="+12%" color="success" size="small" sx={{ mt: 1 }} />
                            </Box>
                            <People sx={{ fontSize: 50, color: '#d486e0ff' }} />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Stock;