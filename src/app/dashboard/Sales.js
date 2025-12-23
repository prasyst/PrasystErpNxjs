'use client';

import React from 'react';
import {
  Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, LinearProgress,
  Stack, Card, CardContent, useTheme, useMediaQuery, IconButton, Tooltip,
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

const recentTransactions = [
  { id: 'TK-88421', product: 'NovaEar Pro ANC', img: 'https://i.rtings.com/assets/pages/PznfqYY1/best-airpods-alternatives-20240708-medium.jpg?format=auto', date: '19 Nov 2025, 10:32', customer: 'Ethan Clarke', price: 7900, status: 'Completed' },
  { id: 'TK-88422', product: 'TekWatch Pulse', img: 'https://cdn.thewirecutter.com/wp-content/media/2023/06/fitnesstrackers-2048px-09819-3x2-1.jpg?auto=webp&quality=75&crop=1.91:1&width=1200', date: '19 Nov 2025, 11:05', customer: 'Ava Mitchell', price: 1500, status: 'Cancelled' },
  { id: 'TK-88423', product: 'AeroPods Lite', img: 'https://www.apple.com/v/airpods/ab/images/overview/hero_startframe__f6btrn4bhpyu_large.jpg', date: '19 Nov 2025, 11:44', customer: 'Liam Parker', price: 550, status: 'Pending' },
  { id: 'TK-88424', product: 'FluxCharge 85W', img: 'https://m.media-amazon.com/images/I/61RDnbG+-3L._AC_UF894,1000_QL80_.jpg', date: '19 Nov 2025, 12:10', customer: 'Sophia Hayes', price: 2100, status: 'Completed' },
  { id: 'TK-88425', product: 'Nova Mini 8', img: 'https://cdn.shopify.com/s/files/1/0738/1499/9346/files/mini-pc-vs-aio-computer.jpg?v=1727249251', date: '19 Nov 2025, 12:40', customer: 'Noah Bennett', price: 19900, status: 'Completed' },
  { id: 'TK-88426', product: 'Nova SmartCam 2K HDR', img: 'http://www.lorex.com/cdn/shop/files/eda0f09993fc76dd0463c6b6aaefef7daae56590580edeff369b889d8fdc8ce0.png?v=1748362529', date: '19 Nov 2025, 13:15', customer: 'Chloe Turner', price: 7100, status: 'Completed' },
];

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

  return (
    <Box sx={{ bgcolor: '#f0f4f8', minHeight: '100vh', py: { xs: 2, md: 2 } }}>
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
                  <Typography variant="body2" color="text.secondary">Total Profit</Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1}>$110,450</Typography>
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
                  <Chip label="+12%" color="success" size="small" sx={{ mt: 1 }} />
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

          {/* Sales Goal Gauge */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff', height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Sales Goal Achievement</Typography>
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
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Transactions</Typography>
              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTransactions.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              variant="rounded"
                              src={row.img}
                              alt={row.product}
                              sx={{ width: 50, height: 50, objectFit: 'cover' }}
                            />
                            <Typography variant="body2">{row.product}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.customer}</TableCell>
                        <TableCell align="right">${row.price.toLocaleString()}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.status}
                            color={row.status === 'Completed' ? 'success' : row.status === 'Pending' ? 'warning' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Sidebar: Top Markets & Products */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2}>
              <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Top Markets</Typography>
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

              <Paper elevation={4} sx={{ borderRadius: 3, p: 3, bgcolor: '#fff' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Top Products</Typography>
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