'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, LinearProgress,
  Stack, Card, CardContent, useTheme, useMediaQuery, IconButton, Tooltip, TextField, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Autocomplete
} from '@mui/material';
import { ShoppingCart, People, Refresh } from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
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

const monthlyData = [
  { name: 'Jan', value: 10000 },
  { name: 'Feb', value: 45000 },
  { name: 'Mar', value: 38000 },
  { name: 'Apr', value: 52000 },
  { name: 'May', value: 65000 },
  { name: 'Jun', value: 70000 },
  { name: 'Jul', value: 85000 },
  { name: 'Aug', value: 92000 },
  { name: 'Sep', value: 98000 },
  { name: 'Oct', value: 105000 },
  { name: 'Nov', value: 110450 },
];

const gaugeData = [{ name: 'Goal', value: 80, fill: '#4caf50' }];

const topMarkets = [
  { country: 'URBAN THINGS', sales: 505000, growth: 40, flag: '🇮🇩' },
  { country: 'CMB', sales: 2808, growth: 23, flag: '🇩🇪' },
  { country: 'Italy', sales: 19500, growth: 10, flag: '🇮🇹' },
];

const topProducts = [
  { name: 'AeroPods Lite', sales: '12K sales', growth: 48, img: 'https://cdn.mos.cms.futurecdn.net/oWxxQ43VdwP7WN7tRynTXb.jpg' },
  { name: 'HyperDrive SSD', sales: '7K sales', growth: 82, img: 'https://m.media-amazon.com/images/I/51czwFxVq5L._AC_UF894,1000_QL80_.jpg' },
  { name: 'Laptop', sales: 'Mrp: 80K', growth: 92, img: 'https://m.media-amazon.com/images/I/513p8BwV-RL._SX679_.jpg' },
];

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
    }
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const handleSearch = debounce((query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = recentTran.filter((row) =>
      row.BILL_NO.toLowerCase().includes(lowerCaseQuery) ||
      row.PARTY_NAME.toLowerCase().includes(lowerCaseQuery) ||
      row.BRAND_NAME.toLowerCase().includes(lowerCaseQuery) ||
      row.BROKER_NAME.toLowerCase().includes(lowerCaseQuery) ||
      String(row.AMOUNT).toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filtered.length > 0 ? filtered : recentTran);
  }, 300);

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
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Bill with order dispatch</Typography>
                  <Typography variant="h6" fontWeight="bold">Value: {(billDis[0]?.AMOUNT / 100000).toFixed(2) + ' L'}</Typography>
                  <Typography variant="h6" fontWeight="bold">Qty: {billDis[0]?.BILLITMDTL_QTY}</Typography>
                </Box>
                <CurrencyRupeeIcon sx={{ fontSize: 50, color: '#8cbbddff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">UnBilled</Typography>
                  <Typography variant="h6" fontWeight="bold">Value: {saleUnbilled[0]?.AMOUNT}</Typography>
                  <Typography variant="h6" fontWeight="bold">Qty: {saleUnbilled[0]?.BILLITMDTL_QTY}</Typography>
                  {/* <Chip label="+4% from last month" color="success" size="small" sx={{ mt: 1 }} /> */}
                </Box>
                <ShoppingCart sx={{ fontSize: 50, color: '#8bd191ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Revenue(Dummy)</Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1}>92,120</Typography>
                  {/* <Chip label="+2%" color="success" size="small" sx={{ mt: 1 }} /> */}
                </Box>
                <CurrencyRupeeIcon sx={{ fontSize: 50, color: '#d3ae71ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Customers(Dummy)</Typography>
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
            <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Transactions
                </Typography>

                <TextField
                  variant="outlined"
                  label="Search"
                  placeholder='Search by Bill No, Party, Brand, Broker etc.'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{
                    width: '200px',
                    borderRadius: '5px',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#007bff' },
                      '&.Mui-focused fieldset': { borderColor: '#007bff' },
                    },
                  }}
                />
              </Box>
              <TableContainer sx={{ mt: 2, height: '60vh', overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ position: 'sticky', top: 0, backgroundColor: '#fafafa', zIndex: 1 }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>Bill No</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>Bill Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>Party</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>City</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>State</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>seller</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>Brand</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>Broker</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTran.map((row) => (
                      <TableRow key={row.BILL_NO} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, borderBottom: '1px solid #e0e0e0' }}>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.BILL_NO}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{dayjs(row.BILL_DT).format('DD/MM/YYYY')}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.PARTY_NAME}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.CITY_NAME}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.STATE_NAME}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.SALEPERSON_NAME}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.BRAND_NAME}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.BROKER_NAME}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.BILLITMDTL_QTY}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.AMOUNT}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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

          {/* <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff', height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Target Achievement</Typography>
              <Box sx={{ position: 'relative', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="50%" outerRadius="90%" data={gaugeData}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background={{ fill: '#eee' }} clockWise dataKey="value" cornerRadius={10} fill="#4caf50" />
                  </RadialBarChart>
                </ResponsiveContainer>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" color="#4caf50">80%</Typography>
                  <Typography variant="body1" color="text.secondary">of annual target</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid> */}
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
                  label="Search"
                  placeholder='Search by State, Amount etc.'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{
                    width: '200px',
                    borderRadius: '5px',
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#007bff' },
                      '&.Mui-focused fieldset': { borderColor: '#007bff' },
                    },
                  }}
                />
              </Box>
              <TableContainer sx={{ mt: 2, height: '40vh', overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ position: 'sticky', top: 0, backgroundColor: '#fafafa', zIndex: 1 }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>State</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', padding: '8px 12px', backgroundColor: '#f4f4f4' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stateWise.map((row) => (
                      <TableRow key={row.STATE_NAME} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, borderBottom: '1px solid #e0e0e0' }}>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.STATE_NAME}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.BILLITMDTL_QTY}</TableCell>
                        <TableCell sx={{ padding: '6px 12px', fontSize: '14px' }}>{row.AMOUNT}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2}>
              <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Top Brands</Typography>
                {topMarkets.map((market, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 1, borderRadius: 2 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Typography variant="h4">{market.flag}</Typography>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">{market.country}</Typography>
                          </Box>
                        </Stack>
                        <Box textAlign="right">
                          <Typography variant="body1" fontWeight="bold">{market.sales.toLocaleString()}</Typography>
                          <Chip label={`+${market.growth}%`} color="success" size="small" />
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
              <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Top Parties</Typography>
                {topProducts.map((product, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={4} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={product.img}
                            alt={product.name}
                            sx={{ width: 60, height: 60, objectFit: 'cover' }}
                          />
                          <Typography variant="body1" fontWeight="medium">{product.name}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="text.secondary">{product.sales}</Typography>
                          <Chip label={`+${product.growth}%`} color="success" size="small" />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={product.growth}
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
        <DialogTitle sx={{ padding: '8px 24px' }}>
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