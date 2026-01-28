import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GaugeContainer, GaugeValueArc, GaugeReferenceArc } from '@mui/x-charts/Gauge';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Box, Chip, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@mui/material';
import ReactSpeedometer from "react-d3-speedometer";

const Dashboard = () => {
  const [recentTable, setRecentTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fcyr, setFcyr] = useState(localStorage.getItem("FCYR_KEY"));
  const [cobrId, setCobrId] = useState(localStorage.getItem("COBR_ID"));

  const lineData = [
    { name: 'Jan', value: 5000 },
    { name: 'Feb', value: 8000 },
    { name: 'Mar', value: 6000 },
    { name: 'Apr', value: 9000 },
    { name: 'May', value: 11000 },
    { name: 'Jun', value: 12000 },
  ];

  const barData = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 190 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 220 },
    { name: 'May', value: 250 },
    { name: 'Jun', value: 280 },
  ];

  const pieData = [
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 200 },
    { name: 'Other', value: 100 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  // Order status data
  const orderData = [
    { id: '#001', name: 'John Doe', state: 'California', country: 'USA' },
    { id: '#002', name: 'Jane Smith', state: 'Texas', country: 'USA' },
    { id: '#003', name: 'Mike Johnson', state: 'New York', country: 'USA' },
    { id: '#004', name: 'Sarah Wilson', state: 'Florida', country: 'USA' },
    { id: '#005', name: 'David Brown', state: 'Nevada', country: 'USA' },
  ];

  const MuiGauge = ({ value = 75 }) => {
    return (
      <div className="gauge-wrapper">
        <GaugeContainer
          width={200}
          height={150}
          startAngle={-110}
          endAngle={110}
          value={value}
        >
          <GaugeReferenceArc />
          <GaugeValueArc />
        </GaugeContainer>
      </div>
    );
  };

  // Calculate total for percentage calculation
  const total = pieData.reduce((sum, entry) => sum + entry.value, 0);

  // Custom label function for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    fetchRecentTable();
  }, [])

  const fetchRecentTable = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("MainDashBoard/GetMainDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: "2025-04-01",
        To_DT: "2026-03-31",
        Flag: "RecentTrn",
        PageNumber: 1,
        PageSize: 10,
        SearchText: ""
      })
      if (response.data.STATUS === 0) {
        setRecentTable(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while fetching recent data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ padding: 0 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ padding: 1, background: 'white', borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Revenue Trend
              </Typography>
              <Box sx={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ fill: '#8884d8', strokeWidth: 2, r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ padding: 1, background: 'white', borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Order Volume
              </Typography>
              <Box sx={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ padding: 1, background: 'white', borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Traffic Sources
              </Typography>
              <Box sx={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ padding: 1, background: 'white', borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Performance
              </Typography>
              <Box sx={{ width: '100%', height: '200px' }}>
                <MuiGauge value={75} />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section with Circular Progress and Table */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant='body1' fontWeight='bold' marginBottom={2}>User Performances</Typography>
            <ReactSpeedometer
              value={500}
              currentValueText="Performance"
              segments={5}
              height={300}
              ringWidth={40}
              needleTransitionDuration={4000}
              needleTransition="easeElastic"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mt: 0 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' }, lineHeight: 1 }}>
                Today Activity
              </Typography>

              <TableContainer
                sx={{
                  maxHeight: { xs: 320, md: 200 },
                  mt: 1,
                  '&::-webkit-scrollbar': {
                    width: 4,
                    height: 4,
                  },
                  '&::-webkit-scrollbar-track': {
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: '#ccc',
                    borderRadius: 2,
                  },
                }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { bgcolor: '#fafafa', fontWeight: 600, py: 0.75, borderBottom: '2px solid', borderColor: 'divider', whiteSpace: 'nowrap' } }}>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, width: '18%' }}>Transaction</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, width: '12%' }}>Amount</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, width: '12%' }}>Count</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, width: '12%' }}>RowNum</TableCell>
                    </TableRow>
                  </TableHead>

                  {/* Table Body */}
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress size="3rem" sx={{ marginRight: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                              Loading data...
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : recentTable && recentTable.length > 0 ? (
                      recentTable.map((item, index) => (
                        <TableRow
                          key={item.TRJTYPE || `${item.TRJTYPE}-${index}`}
                          hover
                          sx={{
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            '&:hover': { backgroundColor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ padding: '2px 16px' }}>{item.TRJTYPE}</TableCell>
                          <TableCell sx={{ padding: '2px 16px' }}>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 60, height: 22, bgcolor: '#10b98115', borderRadius: 1, border: '1px solid #10b98130', px: 0.75, gap: 0.25 }}>
                              <CurrencyRupeeIcon sx={{ fontSize: 10, color: '#10b981' }} />
                              <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' }, fontWeight: 700, color: '#079e6c' }}>
                                {parseFloat(item.TOT_AMT || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ padding: '2px 16px' }}>
                            {parseFloat(item.TOT_COUNT || 0).toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell sx={{ padding: '2px 16px' }}>
                            {parseFloat(item.ROWNUM || 0).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No record found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </Box >
    </>
  );
};

export default Dashboard;