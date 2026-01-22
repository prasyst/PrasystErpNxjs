'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, CircularProgress, alpha,
  TableHead, TableRow, Avatar, Chip, LinearProgress, Stack, Card, CardContent, useTheme, useMediaQuery, IconButton, ToggleButtonGroup,
  Tooltip, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Select, MenuItem, ToggleButton
} from '@mui/material';
import {
  ShoppingCart, People, Refresh, CurrencyRupee, FilterAlt, Close,
  Search, PieChart as PieChartIcon, BarChart as BarChartIcon, Timeline as LineChartIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosInstance from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import { MdAnalytics, MdDonutLarge, MdPieChart, MdBarChart, MdCheckCircleOutline, MdSchedule } from 'react-icons/md';
import { FaExclamationTriangle } from 'react-icons/fa';

const Sales = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentYear = dayjs().year();
  const previousYear = currentYear - 1;

  const [dateFrom, setDateFrom] = useState(dayjs(`${previousYear}-04-01`));
  const [dateTo, setDateTo] = useState(dayjs(`${currentYear}-03-31`));
  const [cobrid] = useState(localStorage.getItem('COBR_ID') || '');
  const [fcyr] = useState(localStorage.getItem('FCYR_KEY') || '');
  const [recentTran, setRecentTran] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [billDis, setBillDis] = useState([]);
  const [saleUnbilled, setSaleUnbilled] = useState([]);
  const [stateWise, setStateWise] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState('month');

  const chartColors = {
    primary: ['#635bff', '#4caf50', '#42a5f5', '#e57373'],
    gradient: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'],
    state: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'],
  };

  const filteredRecent = useMemo(() => {
    if (!searchQuery.trim()) return recentTran;
    const q = searchQuery.toLowerCase();
    return recentTran.filter(row =>
      row.BILL_NO?.toLowerCase().includes(q) ||
      row.PARTY_NAME?.toLowerCase().includes(q) ||
      row.BRAND_NAME?.toLowerCase().includes(q) ||
      row.BROKER_NAME?.toLowerCase().includes(q) ||
      row.CITY_NAME?.toLowerCase().includes(q) ||
      row.STATE_NAME?.toLowerCase().includes(q) ||
      String(row.AMOUNT || '').includes(q)
    );
  }, [searchQuery, recentTran]);

  const filteredStateWise = useMemo(() => {
    if (!searchQuery.trim()) return stateWise;
    const q = searchQuery.toLowerCase();
    return stateWise.filter(row =>
      row.STATE_NAME?.toLowerCase().includes(q) ||
      String(row.AMOUNT || '').includes(q) ||
      String(row.BILLITMDTL_QTY || '').includes(q)
    );
  }, [searchQuery, stateWise]);

  const chartData = useMemo(() =>
    stateWise.slice(0, 8).map((state, index) => ({
      name: state.STATE_NAME,
      qty: state.BILLITMDTL_QTY,
      amount: state.AMOUNT,
      fill: chartColors.state[index % chartColors.state.length]
    })), [stateWise]);

  const topParties = useMemo(() =>
    recentTran
      .sort((a, b) => parseFloat(b.AMOUNT) - parseFloat(a.AMOUNT))
      .slice(0, 3), [recentTran]);

  const topBrokers = useMemo(() =>
    recentTran
      .sort((a, b) => parseFloat(b.AMOUNT) - parseFloat(a.AMOUNT))
      .slice(0, 4), [recentTran]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      recentTransaction(),
      fetchBillDis(),
      fetchUnbilledSales(),
      fetchStateWiseSale()
    ]);
  };

  const handleGetData = () => {
    fetchAllData();
  };

  const recentTransaction = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("OrderDash/GetBillDashBoard", {
        COBR_ID: cobrid,
        FCYR_KEY: fcyr,
        FROM_DT: dateFrom,
        To_DT: dateTo,
        Flag: "RECENT",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        Brandfilter: "",
        Partyfilter: "",
        statefilter: "",
        Brokerfilter: ""
      });
      if (response.data.STATUS === 0) {
        setRecentTran(response.data.DATA);
      } else {
        setRecentTran([]);
      }
    } catch (error) {
      toast.error("Error while fetching recent transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBillDis = async () => {
    try {
      const response = await axiosInstance.post('OrderDash/GetBillDashBoard', {
        COBR_ID: cobrid,
        FCYR_KEY: fcyr,
        FROM_DT: dateFrom,
        To_DT: dateTo,
        Flag: "BillDis",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        Brandfilter: "",
        Partyfilter: "",
        statefilter: "",
        Brokerfilter: ""
      });
      if (response.data.STATUS === 0) {
        setBillDis(response.data.DATA);
      } else {
        setBillDis([]);
      }
    } catch (error) {
      toast.error("Error while fetching the record.");
    }
  };

  const fetchUnbilledSales = async () => {
    try {
      const response = await axiosInstance.post("OrderDash/GetBillDashBoard", {
        COBR_ID: cobrid,
        FCYR_KEY: fcyr,
        FROM_DT: dateFrom,
        To_DT: dateTo,
        Flag: "BillDis",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        Brandfilter: "",
        Partyfilter: "",
        statefilter: "",
        Brokerfilter: ""
      });
      if (response.data.STATUS === 0) {
        setSaleUnbilled(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while fetching the unbilled.");
    }
  };

  const fetchStateWiseSale = async () => {
    try {
      const response = await axiosInstance.post("OrderDash/GetBillDashBoard", {
        COBR_ID: cobrid,
        FCYR_KEY: fcyr,
        FROM_DT: dateFrom,
        To_DT: dateTo,
        Flag: "StateWiseOrdSum",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        Brandfilter: "",
        Partyfilter: "",
        statefilter: "",
        Brokerfilter: ""
      });
      if (response.data.STATUS === 0) {
        setStateWise(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while fetching data.");
    }
  };

  const renderChart = () => {
    const commonProps = {
      width: '100%',
      height: '100%',
      data: chartData,
      margin: { top: 20, right: 30, left: 0, bottom: 10 }
    };

    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="qty"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ReTooltip formatter={(value) => [Number(value).toLocaleString(), 'Quantity']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={12} />
              <YAxis fontSize={12} />
              <ReTooltip formatter={(value) => [Number(value).toLocaleString(), 'Quantity']} />
              <Bar dataKey="qty" fill="#635bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={12} />
              <YAxis fontSize={12} />
              <ReTooltip formatter={(value) => [Number(value).toLocaleString(), 'Quantity']} />
              <Line type="monotone" dataKey="qty" stroke="#ff6b6b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'doughnut':
        return (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="qty"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ReTooltip formatter={(value) => [Number(value).toLocaleString(), 'Quantity']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={12} />
              <YAxis fontSize={12} />
              <ReTooltip formatter={(value) => [Number(value).toLocaleString(), 'Quantity']} />
              <Area
                type="monotone"
                dataKey="qty"
                stroke="#635bff"
                strokeWidth={3}
                fill="url(#colorGradient)"
                fillOpacity={0.6}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#635bff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Box sx={{
      bgcolor: '#f8fafc',
      minHeight: '100vh',
      py: { xs: 1, sm: 2, md: 2 }
    }}>
      <ToastContainer />
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>

        <Box sx={{
          mb: { xs: 2, sm: 2 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}>
          <Box>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              fontWeight="bold"
              sx={{
                background: "linear-gradient(45deg, #007bff, #00bcd4, #635bff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              Sales Analysis Dashboard
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
              Comprehensive overview of sales performance and analytics
            </Typography>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' }
            }}>
              <DatePicker
                label="From"
                value={dateFrom}
                onChange={setDateFrom}
                format="DD/MM/YYYY"
                views={['day', 'month', 'year']}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      width: { xs: '48%', sm: 155 },
                      '& .MuiInputBase-input': { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
                    }
                  }
                }}
              />
              <DatePicker
                label="To"
                value={dateTo}
                onChange={setDateTo}
                format="DD/MM/YYYY"
                views={['day', 'month', 'year']}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      width: { xs: '48%', sm: 155 },
                      '& .MuiInputBase-input': { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<Refresh />}
                onClick={handleGetData}
                sx={{
                  borderRadius: 2,
                  backgroundColor: '#635bff',
                  '&:hover': { backgroundColor: '#5448ff' },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: 2
                }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterAlt />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  borderRadius: 2,
                  borderColor: '#635bff',
                  color: '#635bff',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: 2
                }}
              >
                Filters
              </Button>
            </Box>
          </LocalizationProvider>

        </Box>


        <Grid container spacing={{ xs: 1, sm: 2 }} mb={{ xs: 2, sm: 3 }}>
          {[
            {
              title: "Bill With Order Dispatch",
              value: `₹${((billDis[0]?.AMOUNT || 0) / 100000).toFixed(2)}L`,
              qty: billDis[0]?.BILLITMDTL_QTY || 0,
              gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              icon: <ShoppingCart />,
              trend: 'up',
              iconBg: 'rgba(76, 175, 80, 0.15)'
            },
            {
              title: "Unbilled Sales",
              value: `₹${((saleUnbilled[0]?.AMOUNT || 0) / 1000).toFixed(1)}K`,
              qty: saleUnbilled[0]?.BILLITMDTL_QTY || 0,
              gradient: 'linear-gradient(135deg, #BA68C8 0%, #8E24AA 100%)',
              icon: <CurrencyRupee />,

              trend: 'down',
              iconBg: 'rgba(186, 104, 200, 0.15)'
            },
            {
              title: "Total Revenue",
              value: "₹92,120",
              qty: null,
              gradient: 'linear-gradient(135deg, #42A5F5 0%, #1565C0 100%)',
              icon: <CurrencyRupee />,

              trend: 'up',
              iconBg: 'rgba(66, 165, 245, 0.15)'
            },
            {
              title: "Customers",
              value: "842",
              qty: null,
              gradient: 'linear-gradient(135deg, #E57373 0%, #C62828 100%)',
              icon: <People />,
              change: '+12%',
              trend: 'up',
              iconBg: 'rgba(229, 115, 115, 0.15)'
            }
          ].map((metric, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
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
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    '& .metric-icon': {
                      transform: 'scale(1.1) rotate(5deg)'
                    }
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
                    zIndex: 0
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
                    zIndex: 0
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
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: { xs: '0.65rem', sm: '0.7rem' },
                          fontWeight: 500,
                          display: 'block',
                          mb: 0.5,
                          color: 'rgba(255, 255, 255, 0.85)',
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
                        {metric.value}
                      </Typography>
                      {metric.qty !== null && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: { xs: '0.7rem', sm: '0.85rem' },
                            color: 'rgba(255, 255, 255, 0.85)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <Box component="span" sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255, 255, 255, 0.7)'
                          }} />
                          <Box component="span" sx={{
                            fontWeight: 400,
                            opacity: 0.9
                          }}>
                            Qty:
                          </Box>
                          <Box component="span" sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                          }}>
                            {metric.qty.toLocaleString()}
                          </Box>
                        </Typography>
                      )}
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


                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    opacity: 0.1,
                    zIndex: 0
                  }}>
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


        <Grid container spacing={{ xs: 1, sm: 2 }} mb={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <CardContent sx={{
                p: { xs: 1.25, sm: 1.5 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  mb: 1.5,
                  gap: 1
                }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
                      fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75
                    }}>
                      <MdAnalytics size={isMobile ? 14 : 16} />
                      Sales Analytics
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      ml: 1.75
                    }}>
                      State-wise performance
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: { xs: 'space-between', sm: 'flex-end' }
                    }}
                  >
                    <FormControl size="small" sx={{
                      minWidth: { xs: '48%', sm: 100 },
                      '& .MuiSelect-select': {
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        py: { xs: 0.5, sm: 0.75 }
                      }
                    }}>
                      <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                      >
                        <MenuItem value="week" sx={{ fontSize: '0.7rem' }}>Last Week</MenuItem>
                        <MenuItem value="month" sx={{ fontSize: '0.7rem' }}>Last Month</MenuItem>
                        <MenuItem value="quarter" sx={{ fontSize: '0.7rem' }}>Last Quarter</MenuItem>
                      </Select>
                    </FormControl>

                    <ToggleButtonGroup
                      value={chartType}
                      exclusive
                      onChange={(e, newType) => newType && setChartType(newType)}
                      size="small"
                      sx={{
                        '& .MuiToggleButton-root': {
                          px: { xs: 0.375, sm: 0.75 },
                          py: { xs: 0.25, sm: 0.375 },
                          fontSize: { xs: '0.65rem', sm: '0.7rem' },
                          minWidth: { xs: 32, sm: 36 }
                        }
                      }}
                    >
                      <ToggleButton value="area" title="Area Chart">
                        {isSmallMobile ? 'A' : 'Area'}
                      </ToggleButton>
                      <ToggleButton value="bar" title="Bar Chart">
                        {isSmallMobile ? <BarChartIcon fontSize="small" /> : 'Bar'}
                      </ToggleButton>
                      <ToggleButton value="line" title="Line Chart">
                        {isSmallMobile ? <LineChartIcon fontSize="small" /> : 'Line'}
                      </ToggleButton>
                      <ToggleButton value="pie" title="Pie Chart">
                        {isSmallMobile ? <PieChartIcon fontSize="small" /> : 'Pie'}
                      </ToggleButton>
                      <ToggleButton value="doughnut" title="Doughnut Chart">
                        {isSmallMobile ? <MdDonutLarge size={12} /> : 'Donut'}
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Box>

                <Box sx={{
                  flex: 1,
                  height: {
                    xs: 235,
                    sm: 280,
                    md: 330
                  },
                  position: 'relative',
                  minHeight: 220
                }}>
                  {renderChart()}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={{ xs: 1, sm: 1.5 }} sx={{ height: '100%' }}>
              {/* Top Brokers - Compact */}
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'white',
                  height: '100%'
                }}
              >
                <CardContent sx={{
                  p: { xs: 1.25, sm: 1.5 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                      mb: 1.25
                    }}
                  >
                    <MdPieChart size={12} />
                    Top Brokers
                  </Typography>

                  <Stack spacing={1} sx={{ flex: 1 }}>
                    {topBrokers.map((broker, index) => {
                      const percentage = topBrokers.length > 0
                        ? Math.round((parseFloat(broker.AMOUNT) / topBrokers.reduce((sum, b) => sum + parseFloat(b.AMOUNT), 0)) * 100)
                        : 0;

                      return (
                        <Box key={index} sx={{ mb: 0.75 }}>
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.375
                          }}>
                            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flex: 1 }}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: chartColors.primary[index % chartColors.primary.length],
                                  fontSize: '0.7rem'
                                }}
                              >
                                {broker.BROKER_NAME?.charAt(0) || 'B'}
                              </Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="caption"
                                  fontWeight="medium"
                                  sx={{
                                    fontSize: '0.7rem',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {broker.BROKER_NAME}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: '0.65rem' }}
                                >
                                  {broker.BILLITMDTL_QTY} units
                                </Typography>
                              </Box>
                            </Stack>
                            <Chip
                              label={`₹${broker.AMOUNT}`}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                bgcolor: `${chartColors.primary[index % chartColors.primary.length]}20`,
                                color: chartColors.primary[index % chartColors.primary.length]
                              }}
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              bgcolor: alpha('#000', 0.05),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                bgcolor: chartColors.primary[index % chartColors.primary.length]
                              }
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>


            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                bgcolor: 'white',
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{
                p: { xs: 1, sm: 1.25 },
                '&:last-child': { pb: { xs: 1, sm: 1.25 } }
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  mb: 1.25,
                  gap: 0.75
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{
                      width: 3,
                      height: 16,
                      bgcolor: '#635bff',
                      borderRadius: 1.5
                    }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        lineHeight: 1.2
                      }}>
                        Recent Transactions
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        ml: 0.25
                      }}>
                        Latest sales overview
                      </Typography>
                    </Box>
                  </Box>

                  <TextField
                    variant="outlined"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />,
                      endAdornment: searchQuery && (
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery('')}
                          sx={{ mr: -0.5, p: 0.25 }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      ),
                      sx: {
                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        height: 30,
                        '& input': { py: 0.625 }
                      }
                    }}
                    sx={{
                      width: { xs: '100%', sm: 200 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '& fieldset': {
                          borderWidth: '1px',
                          borderColor: alpha('#000', 0.15)
                        }
                      }
                    }}
                  />
                </Box>

                {isLoading ? (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 180,
                    py: 3
                  }}>
                    <CircularProgress size={26} />
                    <Typography sx={{ mt: 1.5, color: 'text.secondary' }} variant="caption">
                      Loading transactions...
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer sx={{
                    maxHeight: { xs: 320, md: 360 },
                    mt: 0.5,
                    '&::-webkit-scrollbar': {
                      width: 4,
                      height: 4
                    },
                    '&::-webkit-scrollbar-track': {
                      bgcolor: '#f5f5f5',
                      borderRadius: 2
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: '#ccc',
                      borderRadius: 2
                    }
                  }}>
                    <Table
                      stickyHeader
                      size="small"
                      sx={{
                        '& .MuiTableCell-root': {
                          py: 0.375,
                          px: 1,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:first-of-type': { pl: 1.25 },
                          '&:last-child': { pr: 1.25 }
                        }
                      }}
                    >
                      <TableHead>
                        <TableRow sx={{
                          '& th': {
                            bgcolor: '#fafafa',
                            fontWeight: 600,
                            py: 0.75,
                            borderBottom: '2px solid',
                            borderColor: 'divider',
                            whiteSpace: 'nowrap'
                          }
                        }}>
                          <TableCell sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            width: '12%',
                            pl: 1.25
                          }}>Bill No</TableCell>
                          <TableCell sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            width: '10%'
                          }}>Date</TableCell>
                          <TableCell sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            width: '18%'
                          }}>Party</TableCell>
                          <TableCell sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            width: '12%'
                          }}>City</TableCell>
                          <TableCell sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            width: '12%'
                          }}>State</TableCell>
                          <TableCell sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            width: '15%'
                          }}>Brand</TableCell>
                          <TableCell align="right" sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            width: '10%'
                          }}>Qty</TableCell>
                          <TableCell align="right" sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            width: '11%',
                            pr: 1.25
                          }}>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRecent.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                              <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                color: 'text.secondary',
                                py: 2
                              }}>
                                <Search sx={{ fontSize: 36, mb: 1, opacity: 0.5 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                  {searchQuery ? 'No matching transactions' : 'No transactions'}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRecent.map((row, index) => (
                            <TableRow
                              key={`${row.BILL_NO}-${index}`}
                              hover
                              sx={{
                                '&:hover': { bgcolor: '#fafafa' },
                                '&:last-child td': { borderBottom: 0 },
                                cursor: 'pointer',
                                transition: 'background-color 0.15s',
                                height: 30
                              }}
                            >

                              <TableCell sx={{
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                pl: 1.25,
                                fontWeight: 500
                              }}>
                                <Typography sx={{
                                  fontSize: 'inherit',
                                  fontFamily: 'monospace',
                                  color: '#635bff'
                                }}>
                                  {row.BILL_NO}
                                </Typography>
                              </TableCell>

                              <TableCell sx={{
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                color: 'text.secondary'
                              }}>
                                {dayjs(row.BILL_DT).format('DD/MM/YY')}
                              </TableCell>
                              <TableCell sx={{
                                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                maxWidth: 0
                              }}>
                                <Tooltip title={row.PARTY_NAME} placement="top-start">
                                  <Typography sx={{
                                    fontSize: 'inherit',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 120
                                  }}>
                                    {row.PARTY_NAME}
                                  </Typography>
                                </Tooltip>
                              </TableCell>

                              <TableCell>
                                <Chip
                                  label={row.CITY_NAME}
                                  size="small"
                                  sx={{
                                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                    height: 20,
                                    bgcolor: `${chartColors.primary[0]}10`,
                                    color: chartColors.primary[0],
                                    border: `1px solid ${chartColors.primary[0]}30`,
                                    fontWeight: 500,
                                    '& .MuiChip-label': { px: 0.75 }
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <Chip
                                  label={row.STATE_NAME}
                                  size="small"
                                  sx={{
                                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                    height: 20,
                                    bgcolor: `${chartColors.primary[1]}10`,
                                    color: chartColors.primary[1],
                                    border: `1px solid ${chartColors.primary[1]}30`,
                                    fontWeight: 500,
                                    '& .MuiChip-label': { px: 0.75 }
                                  }}
                                />
                              </TableCell>

                              <TableCell sx={{
                                fontSize: { xs: '0.75rem', sm: '0.8rem' }
                              }}>
                                <Typography sx={{
                                  fontSize: 'inherit',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: 100
                                }}>
                                  {row.BRAND_NAME}
                                </Typography>
                              </TableCell>

                              <TableCell align="right">
                                <Box sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minWidth: 36,
                                  height: 20,
                                  bgcolor: '#3b82f610',
                                  borderRadius: 1,
                                  border: '1px solid #3b82f630',
                                  px: 0.75
                                }}>
                                  <Typography sx={{
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    fontWeight: 600,
                                    color: '#3b82f6'
                                  }}>
                                    {row.BILLITMDTL_QTY}
                                  </Typography>
                                </Box>
                              </TableCell>

                              <TableCell align="right" sx={{ pr: 1.25 }}>
                                <Box sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minWidth: 60,
                                  height: 22,
                                  bgcolor: '#10b98115',
                                  borderRadius: 1,
                                  border: '1px solid #10b98130',
                                  px: 0.75,
                                  gap: 0.25
                                }}>
                                  <CurrencyRupee sx={{ fontSize: 10, color: '#10b981' }} />
                                  <Typography sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                    fontWeight: 700,
                                    color: '#10b981'
                                  }}>
                                    {row.AMOUNT}
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {filteredRecent.length > 0 && (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1,
                    pt: 0.75,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      Showing {filteredRecent.length} of {recentTran.length}
                    </Typography>
                    <Button
                      size="small"
                      onClick={recentTransaction}
                      sx={{
                        fontSize: '0.65rem',
                        textTransform: 'none',
                        color: '#635bff',
                        minHeight: 24,
                        '&:hover': { bgcolor: '#635bff10' }
                      }}
                    >
                      <Refresh sx={{ fontSize: 12, mr: 0.5 }} />
                      Refresh
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={{ xs: 1, sm: 2 }} sx={{ height: '100%' }}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'white'
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      mb: 1
                    }}
                  >
                    Top 3 Parties
                  </Typography>

                  <Stack spacing={2}>
                    {topParties.map((party, index) => {
                      const maxAmount = Math.max(...topParties.map(p => parseFloat(p.AMOUNT)));
                      const percentage = maxAmount > 0 ? (parseFloat(party.AMOUNT) / maxAmount) * 100 : 0;

                      return (
                        <Box key={index}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: chartColors.primary[index],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Typography variant="caption" sx={{ color: 'white', fontSize: '0.7rem' }}>
                                  {index + 1}
                                </Typography>
                              </Box>
                              <Tooltip title={party.PARTY_NAME}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: '0.8rem',
                                    maxWidth: 120,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {party.PARTY_NAME}
                                </Typography>
                              </Tooltip>
                            </Stack>
                            <Chip
                              label={`₹${party.AMOUNT}`}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                bgcolor: `${chartColors.primary[index]}15`,
                                color: chartColors.primary[index]
                              }}
                            />
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: alpha('#000', 0.05),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                bgcolor: chartColors.primary[index]
                              }
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>

              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'white',
                  flex: 1
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 }, height: '100%' }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                  }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: '0.85rem', sm: '0.9rem' }
                      }}
                    >
                      State Wise Summary
                    </Typography>
                    <Chip
                      label={`${stateWise.length} states`}
                      size="small"
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  </Box>

                  <TableContainer sx={{
                    maxHeight: 250,
                    '&::-webkit-scrollbar': { width: 4 },
                    '&::-webkit-scrollbar-track': { bgcolor: '#f1f1f1' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#ddd', borderRadius: 2 }
                  }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ '& th': { bgcolor: '#f8fafc', py: 0.5 } }}>
                          <TableCell sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>State</TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Qty</TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredStateWise.map((row, index) => (
                          <TableRow key={index} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                            <TableCell sx={{ fontSize: '0.75rem' }}>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Box sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: chartColors.state[index % chartColors.state.length]
                                }} />
                                <Typography sx={{
                                  fontSize: '0.75rem',
                                  maxWidth: 80,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {row.STATE_NAME}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {row.BILLITMDTL_QTY}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'primary.main' }}>
                              ₹{row.AMOUNT}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Filter Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold">Advanced Filters</Typography>
          <IconButton onClick={() => setOpenDialog(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Brand Filter
              </Typography>
              <Select size="small">
                <MenuItem value="">All Brands</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Party Filter
              </Typography>
              <Select size="small">
                <MenuItem value="">All Parties</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                State Filter
              </Typography>
              <Select size="small">
                <MenuItem value="">All States</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Broker Filter
              </Typography>
              <Select size="small">
                <MenuItem value="">All Brokers</MenuItem>
                {/* Add broker options here */}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{ borderRadius: 2, bgcolor: '#635bff' }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;