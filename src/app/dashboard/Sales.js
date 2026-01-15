'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, LinearProgress,
  Stack, Card, CardContent, useTheme, useMediaQuery, IconButton, Tooltip,
  TextField,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  AttachMoney,
  Refresh,
  NotificationsActive,
} from '@mui/icons-material';
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
  { country: 'Indonesia', sales: 82100, growth: 40, flag: '🇮🇩' },
  { country: 'Germany', sales: 52400, growth: 23, flag: '🇩🇪' },
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
  const [cobrid, setCobrId] = useState(localStorage.getItem('COBR_ID'));
  const [fcyr, setFcyr] = useState(localStorage.getItem('FCYR_KEY'));
  const [recentTran, setRecentTran] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [billDis, setBillDis] = useState([]);
  const [saleUnbilled, setSaleUnbilled] = useState([]);

  useEffect(() => {
    recentTransaction();
    fetchBillDis();
    fetchUnbilledSales();
  }, [])

  const recentTransaction = async () => {
    try {
      const response = await axiosInstance.post("OrderDash/GetBillDashBoard", {
        COBR_ID: cobrid,
        FCYR_KEY: fcyr,
        FROM_DT: "2025-01-01",
        To_DT: "2026-01-30",
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
        FROM_DT: "2025-04-01",
        To_DT: "2026-01-30",
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
        FROM_DT: "2025-04-01",
        To_DT: "2026-01-30",
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

  return (
    <Box sx={{ bgcolor: '#f0f4f8', minHeight: '100vh', py: { xs: 2, md: 2 } }}>
      <ToastContainer />
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="bold" color="#1a1a1a">
            Sales Dashboard
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh Data" arrow>
              <IconButton color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications" arrow>
              <IconButton color="primary">
                <NotificationsActive />
              </IconButton>
            </Tooltip>
          </Stack>
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
                <AttachMoney sx={{ fontSize: 50, color: '#8cbbddff' }} />
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
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1}>$92,120</Typography>
                  {/* <Chip label="+2%" color="success" size="small" sx={{ mt: 1 }} /> */}
                </Box>
                <AttachMoney sx={{ fontSize: 50, color: '#d3ae71ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">Customers</Typography>
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
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Profit Overview (2025)</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ReTooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Area type="monotone" dataKey="value" stroke="#4caf50" strokeWidth={3} fill="#c8e6c9" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
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
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Grid container spacing={2}>
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
                      <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, borderBottom: '1px solid #e0e0e0' }}>
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

          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack spacing={2}>
              <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Top Brands</Typography>
                {topMarkets.map((market, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 1, borderRadius: 2 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="h4">{market.flag}</Typography>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">{market.country}</Typography>
                          </Box>
                        </Stack>
                        <Box textAlign="right">
                          <Typography variant="body1" fontWeight="bold">${market.sales.toLocaleString()}</Typography>
                          <Chip label={`+${market.growth}%`} color="success" size="small" />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
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
    </Box>
  );
};

export default Sales;