'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, LinearProgress,
  Stack, Card, CardContent, useTheme, useMediaQuery, IconButton, Tooltip, TextField, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Autocomplete,
  CircularProgress
} from '@mui/material';
import { ShoppingCart, People, Refresh } from '@mui/icons-material';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
} from 'recharts';
import { format } from 'date-fns';
import axiosInstance from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Sales = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = dayjs().year();
  const previousYear = currentYear - 1;
  const [dateFrom, setDateFrom] = useState(dayjs(`${previousYear}-04-01`));
  const [dateTo, setDateTo] = useState(dayjs(`${currentYear}-03-31`));
  const [cobrid, setCobrId] = useState(localStorage.getItem('COBR_ID'));
  const [fcyr, setFcyr] = useState(localStorage.getItem('FCYR_KEY'));
  const [recentTran, setRecentTran] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [billDis, setBillDis] = useState([]);
  const [saleUnbilled, setSaleUnbilled] = useState([]);
  const [stateWise, setStateWise] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [filteredRecent, setFilteredRecent] = useState([]);
  const [filteredStateWise, setFilteredStateWise] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    recentTransaction();
    fetchBillDis();
    fetchUnbilledSales();
    fetchStateWiseSale();
  }, [])

  const handleGetData = () => {
    fetchStateWiseSale();
    fetchUnbilledSales();
    fetchBillDis();
    recentTransaction();
  };

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
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
      })
      if (response.data.STATUS === 0) {
        setRecentTran(response.data.DATA)
        setFilteredData(response.data.DATA);
      } else {
        setRecentTran([]);
      }
    } catch (error) {
      toast.error("Error while fetching recent transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFilteredRecent(recentTran);
  }, [recentTran]);

  useEffect(() => {
    setFilteredStateWise(stateWise);
  }, [stateWise]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, recentTran, stateWise]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSearch = debounce((query) => {
    const q = query.toLowerCase().trim();

    // Filter recent transactions
    if (q === '') {
      setFilteredRecent(recentTran);
    } else {
      const filtered = recentTran.filter(row =>
        row.BILL_NO?.toLowerCase().includes(q) ||
        row.PARTY_NAME?.toLowerCase().includes(q) ||
        row.BRAND_NAME?.toLowerCase().includes(q) ||
        row.BROKER_NAME?.toLowerCase().includes(q) ||
        row.CITY_NAME?.toLowerCase().includes(q) ||
        row.STATE_NAME?.toLowerCase().includes(q) ||
        String(row.AMOUNT || '').includes(q)
      );
      setFilteredRecent(filtered);
    }

    // Filter state wise
    if (q === '') {
      setFilteredStateWise(stateWise);
    } else {
      const filteredState = stateWise.filter(row =>
        row.STATE_NAME?.toLowerCase().includes(q) ||
        String(row.AMOUNT || '').includes(q) ||
        String(row.BILLITMDTL_QTY || '').includes(q)
      );
      setFilteredStateWise(filteredState);
    }
  }, 350);

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
      })
      if (response.data.STATUS === 0) {
        setBillDis(response.data.DATA);
      } else {
        setBillDis([]);
      }
    } catch (error) {
      toast.error("Erro while fetching the record.");
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

  const chartData = stateWise.map((state) => ({
    name: state.STATE_NAME,
    qty: state.BILLITMDTL_QTY,
  }));

  const topParties = filteredData.sort((a, b) => parseFloat(b.AMOUNT) - parseFloat(a.AMOUNT)).slice(0, 3);

  const topBrokers = filteredData.sort((a, b) => parseFloat(b.AMOUNT) - parseFloat(a.AMOUNT)).slice(0, 4);

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
              background: "linear-gradient(45deg, #007bff, #00bcd4, #635bff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              userSelect: "none",
            }}
          >
            Sales Dashboard
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
                startIcon={< Refresh />}
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
                startIcon={<FilterAltIcon />}
                onClick={handleOpen}
                sx={{
                  borderRadius: '20px',
                  backgroundColor: '#635bff',
                  '&:hover': {
                    backgroundColor: '#635bff'
                  },
                }}
              >
                Filter
              </Button>
            </Box>
          </LocalizationProvider>
        </Box>

        {/* Key Metrics Cards */}
        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#4caf50', color: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h7">Bill with order dispatch</Typography>
                  <Typography variant="h6" fontWeight="bold">Value: {(billDis[0]?.AMOUNT / 100000).toFixed(2) + ' L'}</Typography>
                  <Typography variant="h6" fontWeight="bold">Qty: {billDis[0]?.BILLITMDTL_QTY}</Typography>
                </Box>
                <CurrencyRupeeIcon sx={{ fontSize: 50, color: '#8cbbddff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#ba68c8', color: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h7">UnBilled</Typography>
                  <Typography variant="h6" fontWeight="bold">Value: {saleUnbilled[0]?.AMOUNT}</Typography>
                  <Typography variant="h6" fontWeight="bold">Qty: {saleUnbilled[0]?.BILLITMDTL_QTY}</Typography>
                  {/* <Chip label="+4% from last month" color="success" size="small" sx={{ mt: 1 }} /> */}
                </Box>
                <ShoppingCart sx={{ fontSize: 50, color: '#8bd191ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#42a5f5', color: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h7">Total Revenue(Dummy)</Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1}>92,120</Typography>
                  {/* <Chip label="+2%" color="success" size="small" sx={{ mt: 1 }} /> */}
                </Box>
                <CurrencyRupeeIcon sx={{ fontSize: 50, color: '#d3ae71ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#e57373', color: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h7">Customers(Dummy)</Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1}>842</Typography>
                  {/* <Chip label="+12%" color="success" size="small" sx={{ mt: 1 }} /> */}
                </Box>
                <People sx={{ fontSize: 50, color: '#d486e0ff' }} />
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 2, bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Transactions
                </Typography>

                <TextField
                  variant="outlined"
                  placeholder="Search by Bill No,Party etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{
                    width: '200px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius: '20px',
                    },
                    '& .MuiInputBase-input': {
                      padding: '4.5px 14px',
                    },
                  }}
                />
              </Box>
              {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                  <CircularProgress size='3rem' />
                  <Typography sx={{ marginTop: 2, color: '#047a2c' }} variant="body2">
                    Loading Data...
                  </Typography>
                </Box>
              ) : (
                <TableContainer sx={{ mt: 2, height: '30vh', overflowY: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ position: 'sticky', top: 0, backgroundColor: '#fafafa', zIndex: 1 }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Bill No</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Bill Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Party</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>City</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>State</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Seller</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Brand</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Broker</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Qty</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRecent.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} align="center">
                            No matching transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRecent.map((row) => (
                          <TableRow key={row.BILL_NO} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, borderBottom: '1px solid #e0e0e0' }}>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{row.BILL_NO}</TableCell>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{dayjs(row.BILL_DT).format('DD/MM/YYYY')}</TableCell>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{row.PARTY_NAME}</TableCell>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{row.CITY_NAME}</TableCell>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{row.STATE_NAME}</TableCell>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{row.SALEPERSON_NAME}</TableCell>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{row.BRAND_NAME}</TableCell>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{row.BROKER_NAME}</TableCell>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{row.BILLITMDTL_QTY}</TableCell>
                            <TableCell sx={{ padding: '2px 12px', fontSize: '14px' }}>{row.AMOUNT}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>State Wise Quantity</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ReTooltip formatter={(value) => `${Number(value).toLocaleString()}`} />
                  <Area
                    type="monotone"
                    dataKey="qty"
                    stroke="#4caf50"
                    strokeWidth={3}
                    fill="#c8e6c9"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  State Wise Sales
                </Typography>

                <TextField
                  variant="outlined"
                  placeholder='Search by State etc.'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{
                    width: '200px',
                    borderRadius: '5px',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#007bff' },
                      '&.Mui-focused fieldset': { borderColor: '#007bff' },
                      borderRadius: '20px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius: '20px',
                    },
                    '& .MuiInputBase-input': {
                      padding: '4.5px 14px',
                    },
                  }}
                />
              </Box>
              <TableContainer sx={{ mt: 2, height: '35vh', overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ position: 'sticky', top: 0, backgroundColor: '#fafafa', zIndex: 1 }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>State</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '4px 12px', backgroundColor: '#f4f4f4' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStateWise.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No matching states
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStateWise.map((row) => (
                        <TableRow key={row.STATE_NAME} hover>
                          <TableCell sx={{ padding: '2px 14px' }}>{row.STATE_NAME}</TableCell>
                          <TableCell sx={{ padding: '2px 14px' }}>{row.BILLITMDTL_QTY}</TableCell>
                          <TableCell sx={{ padding: '2px 14px' }}>{row.AMOUNT}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2}>
              <Paper elevation={4} sx={{ borderRadius: 3, px: 3, py: 2, bgcolor: '#fff' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Top Broker</Typography>
                {topBrokers.map((broker, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 1, borderRadius: 2 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Typography variant="body1" fontWeight="medium">{broker.BROKER_NAME}</Typography>
                        </Stack>
                        <Box textAlign="right">
                          {/* <Typography variant="body1" fontWeight="bold">{broker.AMOUNT}</Typography> */}
                          <Chip label={broker.AMOUNT} color="success" size="small" />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2}>
              <Paper elevation={4} sx={{ borderRadius: 3, px: 3, py: 2, bgcolor: '#fff' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Top 3 Parties
                </Typography>

                {topParties.map((party, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1" fontWeight="medium">{party.PARTY_NAME}</Typography>
                          <Typography variant="body2">{party.AMOUNT}</Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={(parseFloat(party.AMOUNT) / Math.max(...filteredData.map(item => parseFloat(item.AMOUNT)))) * 100}
                          sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0' }}
                          color="success"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle sx={{ padding: '4px 24px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Apply Filters</span>
            <IconButton onClick={handleClose} size="large">
              <CloseIcon color='error' />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <p>Are you sure you want to apply the filters?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore sunt qui aliquid cupiditate non suscipit, unde odit officiis aliquam quasi? Debitis eligendi earum dicta fugiat nisi similique et excepturi, sint maiores suscipit obcaecati sunt quaerat reprehenderit officia rerum eum expedita porro delectus, animi magnam mollitia saepe. Impedit ullam totam quo delectus quae exercitationem unde obcaecati, libero sapiente culpa blanditiis consectetur fuga architecto, ratione dolores, quis repudiandae ipsa voluptates magni officia?</p>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' size='small' onClick={handleClose} color="error">
            Clear
          </Button>
          <Button variant='contained' size='small' color="success">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;