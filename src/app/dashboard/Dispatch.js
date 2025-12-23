'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Chip, Stack, useTheme, useMediaQuery, Button,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  AttachMoney,
  NotificationsActive
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosInstance from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';

const Dispatch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = dayjs().year();
  const [dateFrom, setDateFrom] = useState(dayjs(`${currentYear}-04-01`));
  const [dateTo, setDateTo] = useState(dayjs(`${currentYear + 1}-03-31`));
  const [openPack, setOpenPack] = useState([]);
  const [dispOrd, setDispOrd] = useState([]);

  const handleGetData = () => {
    fetchOpenPack();
    fetchDispOrder();
  };

  useEffect(() => {
    fetchOpenPack();
    fetchDispOrder();
  }, []);

  const fetchOpenPack = async () => {
    try {
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: "02",
        FCYR_KEY: "25",
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "OpenPack",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        Brandfilter: "",
        Partyfilter: "",
        statefilter: "",
        Brokerfilter: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setOpenPack(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching record.");
    }
  };

  const fetchDispOrder = async () => {
    try {
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: "02",
        FCYR_KEY: "25",
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "DisOrd",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        Brandfilter: "",
        Partyfilter: "",
        statefilter: "",
        Brokerfilter: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setDispOrd(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while dispatch order.");
    }
  };

  return (
    <Box sx={{ bgcolor: '#f0f4f8', minHeight: '100vh', py: { xs: 2, md: 2 } }}>
      <ToastContainer />
      <Container maxWidth="xl">
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
              background: "linear-gradient(45deg, #605bff, #635, #36ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              userSelect: "none",
            }}
          >
            Order Dispatched
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
                    padding: '9.5px 0',
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
                    padding: '9.5px 0',
                  },
                }}
                className="custom-datepicker"
              />
              <Button
                variant="contained"
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

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Dispatch - {openPack[0]?.ROWNUM}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    Value: {(openPack[0]?.AMOUNT / 100000).toFixed(2) + " L"}
                  </Typography>
                  <Typography variant="h6" mt={0.5}>
                    Qty: {openPack[0]?.PACKITMDTL_QTY}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 50, color: '#8cbbddff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="bold">Dispatch - {dispOrd[0]?.ROWNUM}</Typography>
                  <Typography variant="h6" fontWeight="bold" mt={0.5}>Value: {(dispOrd[0]?.AMOUNT / 100000).toFixed(2) + ' L'}</Typography>
                  <Typography variant="h6" mt={0.5}> Qty: {dispOrd[0]?.PACKITMDTL_QTY}</Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 50, color: '#8bd191ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1}>$92,120</Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 50, color: '#d3ae71ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Customers</Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1}>842</Typography>
                </Box>
                <People sx={{ fontSize: 50, color: '#d486e0ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Something</Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1}>432</Typography>
                </Box>
                <NotificationsActive sx={{ fontSize: 50, color: '#736ebdff' }} />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dispatch;