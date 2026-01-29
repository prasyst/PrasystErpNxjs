'use client';

import React, { Activity, useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Box, Grid, Paper, Typography, Button, Card, CardContent, Stack, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PendingIcon from '@mui/icons-material/Pending';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Cards = () => {
  const theme = useTheme();
  const [fcyr, setFcyr] = useState(localStorage.getItem("FCYR_KEY"));
  const [cobrId, setCobrId] = useState(localStorage.getItem("COBR_ID"));
  const currentYear = dayjs().year();
  const previousYear = currentYear - 1;
  const [dateFrom, setDateFrom] = useState(dayjs(`${previousYear}-04-01`));
  const [dateTo, setDateTo] = useState(dayjs(`${currentYear}-03-31`));
  const [totalRev, setTotalRev] = useState([]);
  const [totalColl, setTotalColl] = useState([]);
  const [totalOut, setTotalOut] = useState([]);
  const [totalExp, setTotalExp] = useState([]);
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    totalRevenue();
    totalCollections();
    totalOutStanding();
    totalExpense();
  }, [])

  const totalRevenue = async () => {
    try {
      const response = await axiosInstance.post("MainDashBoard/GetMainDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "TotRevenue",
        PageNumber: 1,
        PageSize: 10,
        SearchText: ""
      });

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setTotalRev(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching record.");
    }
  };

  const totalCollections = async () => {
    try {
      const response = await axiosInstance.post("MainDashBoard/GetMainDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "TotCollection",
        PageNumber: 1,
        PageSize: 10,
        SearchText: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setTotalColl(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching record.");
    }
  };

  const totalOutStanding = async () => {
    try {
      const response = await axiosInstance.post("MainDashBoard/GetMainDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "TotOs",
        PageNumber: 1,
        PageSize: 10,
        SearchText: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setTotalOut(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching record");
    }
  };

  const totalExpense = async () => {
    try {
      const response = await axiosInstance.post("MainDashBoard/GetMainDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "TotPur",
        PageNumber: 1,
        PageSize: 10,
        SearchText: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setTotalExp(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching data.");
    }
  };

  const handleGetData = () => {
    totalRevenue();
    totalCollections();
    totalOutStanding();
    totalExpense();
  };

  const handleToggleSettings = () => {
    setShowComponent(prevState => !prevState);
  };

  return (
    <>
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
            background: "linear-gradient(45deg, #f54269ff, #946115ff, #3d0555ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            userSelect: "none",
          }}
        >
          Overview Dashboard
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Activity mode={showComponent ? 'visible' : 'hidden'}>
              <DatePicker
                label="From-Date"
                value={dateFrom}
                onChange={(newValue) => setDateFrom(newValue)}
                format="DD/MM/YYYY"
                views={['day', 'month', 'year']}
                sx={{ width: 150, '& .MuiPickersSectionList-root': { padding: '6.5px 0' } }}
              />
              <DatePicker
                label="To-Date"
                value={dateTo}
                onChange={(newValue) => setDateTo(newValue)}
                format="DD/MM/YYYY"
                views={['day', 'month', 'year']}
                sx={{ width: 150, '& .MuiPickersSectionList-root': { padding: '6.5px 0' } }}
              />
              <Button
                size='small'
                variant="contained"
                onClick={handleGetData}
                sx={{
                  borderRadius: '20px',
                  backgroundColor: '#635bff',
                  '&:hover': { backgroundColor: '#635bff' },
                }}
              >
                Get Data
              </Button>
            </Activity>
            <Tooltip title='Show Filters Button' arrow>
              <IconButton onClick={handleToggleSettings}>
                <FilterAltIcon color='primary' />
              </IconButton>
            </Tooltip>
          </Box>
        </LocalizationProvider>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
        {[
          {
            title: "Revenue",
            value: `₹ ${((totalRev[0]?.TOT_AMT || 0) / 100000).toFixed(2)}L`,
            gradient: 'linear-gradient(135deg, #42A5F5 0%, #1565C0 100%)',
            icon: <CurrencyRupeeIcon />,
            trend: 'up',
            iconBg: 'rgba(66, 165, 245, 0.15)',
          },
          {
            title: "Collections",
            value: `₹ ${((totalColl[0]?.TOT_AMT || 0) / 100000).toFixed(2)}L`,
            gradient: 'linear-gradient(135deg, #7BBE9F 0%, #2E7D32 100%)',
            icon: <AddShoppingCartIcon />,
            trend: 'up',
            iconBg: 'rgba(76, 175, 80, 0.15)',
          },
          {
            title: "Outstanding",
            value: `₹ ${((totalOut[0]?.TOT_AMT || 0) / 100000).toFixed(2)}L`,
            gradient: 'linear-gradient(135deg, #FF8C71 0%, #D84315 100%)',
            icon: <PendingIcon />,
            trend: 'down',
            iconBg: 'rgba(244, 67, 54, 0.15)',
          },
          {
            title: "Expense",
            value: `₹ ${((totalExp[0]?.TOT_AMT || 0) / 100000).toFixed(2)}L`,
            gradient: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
            icon: <CurrencyRupeeIcon />,
            trend: 'up',
            iconBg: 'rgba(255, 193, 7, 0.15)',
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
                  transform: 'translateY(-1px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  '& .metric-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 0,
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  zIndex: 0,
                },
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                        letterSpacing: '0.5px',
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
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {metric.value}
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
                    className: 'metric-icon',
                  }}>
                    {React.cloneElement(metric.icon, {
                      sx: {
                        color: 'white',
                        fontSize: { xs: 18, sm: 22 },
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                      }
                    })}
                  </Box>
                </Stack>

                <Box sx={{ position: 'absolute', top: 8, right: 8, opacity: 0.1, zIndex: 0 }}>
                  {metric.trend === 'up' ? '↗' : '↘'}
                </Box>
              </CardContent>

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
                  animation: 'progress 2s ease-in-out infinite alternate',
                },
                '@keyframes progress': {
                  '0%': { transform: 'translateX(-100%)' },
                  '100%': { transform: 'translateX(100%)' },
                }
              }} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Cards;