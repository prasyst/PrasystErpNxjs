'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Stack, useTheme, useMediaQuery, Button,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  People,
  Search,
  NotificationsActive
} from '@mui/icons-material';
import InventoryIcon from '@mui/icons-material/Inventory';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosInstance from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import { BarChart } from '@mui/x-charts/BarChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { debounce } from "lodash";

const Dispatch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = dayjs().year();
  const [dateFrom, setDateFrom] = useState(dayjs(`${currentYear}-04-01`));
  const [dateTo, setDateTo] = useState(dayjs(`${currentYear + 1}-03-31`));
  const [openPack, setOpenPack] = useState([]);
  const [dispOrd, setDispOrd] = useState([]);
  const [unBilled, setUnBilled] = useState([]);
  const [disOrd, setDisOrd] = useState([]);
  const [fcyr, setFcyr] = useState(localStorage.getItem("FCYR_KEY"));
  const [cobrId, setCobrId] = useState(localStorage.getItem("COBR_ID"));
  const [partyTable, setPartyTable] = useState([]);
  const [recentPack, setRecentPack] = useState([]);
  const [filters, setFilters] = useState({
    Brandfilter: "",
    Partyfilter: "",
    statefilter: "",
    Brokerfilter: ""
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecentPack, setFilteredRecentPack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partyLoading, setPartyLoading] = useState(false);
  const [partySearchQuery, setPartySearchQuery] = useState('');
  const [filteredPartyTable, setFilteredPartyTable] = useState([]);

  const handleGetData = () => {
    fetchOpenPack();
    fetchDispOrder();
    fetchUnBilledPacking();
    fetchDisclosedOrder();
    fetchPartyWiseTable();
    fetchRecentPacking();
  };

  useEffect(() => {
    fetchOpenPack();
    fetchDispOrder();
    fetchUnBilledPacking();
    fetchDisclosedOrder();
    fetchPartyWiseTable();
    fetchRecentPacking();
  }, []);

  const fetchOpenPack = async () => {
    try {
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "OpenPack",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filters
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
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "DisOrd",
        PageNumber: 1,
        PageSize: 10,
        SerchText: "",
        ...filters
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setDispOrd(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while dispatch order.");
    }
  };

  const fetchUnBilledPacking = async () => {
    try {
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "UNBILEDPACK",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filters
      });
      if (response.data && response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setUnBilled(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while fetching unbilled.");
    }
  };

  const fetchDisclosedOrder = async () => {
    try {
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "DisWOOrd",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filters
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setDisOrd(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while getting data.");
    }
  };

  const fetchPartyWiseTable = async () => {
    setPartyLoading(true);
    try {
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "Partywise",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filters
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setPartyTable(response.data.DATA);
        setFilteredPartyTable(response.data.DATA);
      } else {
        setPartyTable([]);
      }
    } catch (error) {
      toast.error("Error while getting data.");
    } finally {
      setPartyLoading(false);
    }
  };

  const fetchRecentPacking = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "RECENT",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filters
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setRecentPack(response.data.DATA);
        setFilteredRecentPack(response.data.DATA);
      } else {
        setRecentPack([]);
      }
    } catch (error) {
      toast.error("Api response error.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handlePartySearchChange = (e) => {
    setPartySearchQuery(e.target.value);
    debouncedPartySearch(e.target.value);
  };

  const debouncedSearch = debounce((query) => {
    const filteredData = recentPack.filter((row) => {
      return (
        row.PARTY_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.PACK_NO.toLowerCase().includes(query.toLowerCase()) ||
        row.CITY_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.STATE_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.SALEPERSON_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.BROKER_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.AMOUNT.toString().toLowerCase().includes(query.toLowerCase()) ||
        row.PACKITMDTL_QTY.toString().toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredRecentPack(filteredData);
  }, 500);

  const debouncedPartySearch = debounce((query) => {
    const filteredData = partyTable.filter((row) => {
      return (
        row.PARTY_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.PACK_NO.toLowerCase().includes(query.toLowerCase()) ||
        row.CITY_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.STATE_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.SALEPERSON_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.BROKER_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.PACKITMDTL_QTY.toString().toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredPartyTable(filteredData);
  }, 500);

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

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Open - {openPack[0]?.ROWNUM || 0}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    Value: {isNaN(openPack[0]?.AMOUNT) ? "0.00 L" : ((openPack[0]?.AMOUNT / 100000).toFixed(2) + " L")}
                  </Typography>
                  <Typography variant="h6" mt={0.5}>
                    Qty: {openPack[0]?.PACKITMDTL_QTY || 0}
                  </Typography>
                </Box>
                <ImportContactsIcon sx={{ fontSize: 40, color: '#6741beff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="bold">Dispatch - {dispOrd[0]?.ROWNUM || 0}</Typography>
                  <Typography variant="h6" fontWeight="bold" mt={0.5}>
                    Value: {isNaN(dispOrd[0]?.AMOUNT) ? "0.00 L" : ((dispOrd[0]?.AMOUNT / 100000).toFixed(2) + ' L')}
                  </Typography>
                  <Typography variant="h6" mt={0.5}> Qty: {dispOrd[0]?.PACKITMDTL_QTY || 0}</Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, color: '#8bd191ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight='bold'>Unbilled - {unBilled[0]?.ROWNUM || 0}</Typography>
                  <Typography variant="h6" fontWeight="bold" mt={0.5}>Value: {isNaN(unBilled[0]?.AMOUNT) ? "0.00" : (unBilled[0]?.AMOUNT / 100000).toFixed(2) + " L"}</Typography>
                  <Typography variant="h6" mt={0.5}>Qty: {unBilled[0]?.PACKITMDTL_QTY ?? 0}</Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 40, color: '#d3ae71ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight='bold'>Disclosed - {disOrd[0]?.ROWNUM || 0}</Typography>
                  <Typography variant="h6" fontWeight="bold" mt={0.5}>Value: {isNaN(disOrd[0]?.AMOUNT) ? "0.00" : (disOrd[0]?.AMOUNT / 100000).toFixed(2) + " L"}</Typography>
                  <Typography variant="h6" mt={0.5}>Qty: {disOrd[0]?.PACKITMDTL_QTY ?? 0}</Typography>
                </Box>
                <People sx={{ fontSize: 40, color: '#d486e0ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
                  <Typography variant="h6" fontWeight="bold" mt={0.5}>Value: {(45600443 / 100000).toFixed(2) + ' L'}</Typography>
                  <Typography variant="h6" mt={0.5}>Qty: 43025</Typography>
                </Box>
                <NotificationsActive sx={{ fontSize: 40, color: '#736ebdff' }} />
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={1.5} mt={2}>
          <Paper sx={{ width: '100%', p: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, px: 2 }}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: 'transparent',
                  backgroundImage: 'linear-gradient(to right, #cc4c2cff, #2798b4ff, #d17a37ff, #635bff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  zIndex: 1
                }}
              >
                Recent Packing
              </Typography>

              <TextField
                variant="outlined"
                placeholder="Search Any..."
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  width: 200,
                  height: '37px',
                  '.MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                  input: {
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: 'action.active', fontSize: 17 }} />
                  ),
                }}
              />
            </Stack>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
                <CircularProgress size="3rem" />
                <Typography variant="body1" sx={{ mt: 2, color: '#334155', fontWeight: 500 }}>
                  Loading recent packings...
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                    <TableRow>
                      <TableCell align="left">Party</TableCell>
                      <TableCell align="left">PackNo</TableCell>
                      <TableCell align="left">PactDt</TableCell>
                      <TableCell align="left">City</TableCell>
                      <TableCell align="left">State</TableCell>
                      <TableCell align="left">Saleperson</TableCell>
                      <TableCell align="left">Broker</TableCell>
                      <TableCell align="left">Qty</TableCell>
                      <TableCell align="left">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecentPack.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ color: 'gray', fontWeight: 'bold' }}>
                          No records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecentPack.map((row) => (
                        <TableRow key={row.PACK_NO} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="left">{row.PARTY_NAME}</TableCell>
                          <TableCell align="left">{row.PACK_NO}</TableCell>
                          <TableCell align="left">{row.PACK_DT ? dayjs(row.PACK_DT).format('YYYY-MM-DD') : ''}</TableCell>
                          <TableCell align="left">{row.CITY_NAME}</TableCell>
                          <TableCell align="left">{row.STATE_NAME}</TableCell>
                          <TableCell align="left">{row.SALEPERSON_NAME}</TableCell>
                          <TableCell align="left">{row.BROKER_NAME}</TableCell>
                          <TableCell align="left">{row.PACKITMDTL_QTY}</TableCell>
                          <TableCell align="left">{row.AMOUNT}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid container spacing={1.5} mt={2}>
          <Paper sx={{ width: '100%', p: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, px: 2 }}>
              <Typography
                sx={{
                  mb: 1, fontWeight: 'bold', fontSize: '1.25rem',
                  color: 'transparent',
                  backgroundImage: 'linear-gradient(to right, #6431f1ff, #2be472ff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  zIndex: 1
                }}
              >
                Party Wise Packing
              </Typography>

              <TextField
                variant="outlined"
                placeholder="Search Any..."
                size="small"
                value={partySearchQuery}
                onChange={handlePartySearchChange}
                sx={{
                  width: 200,
                  height: '37px',
                  '.MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                  input: {
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: 'action.active', fontSize: 17 }} />
                  ),
                }}
              />
            </Stack>

            {partyLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
                <CircularProgress size="3rem" />
                <Typography variant="body1" sx={{ mt: 2, color: '#334155', fontWeight: 500 }}>
                  Loading party...
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                    <TableRow>
                      <TableCell align="left">Party</TableCell>
                      <TableCell align="left">PackNo</TableCell>
                      <TableCell align="left">PactDt</TableCell>
                      <TableCell align="left">City</TableCell>
                      <TableCell align="left">State</TableCell>
                      <TableCell align="left">Saleperson</TableCell>
                      <TableCell align="left">Broker</TableCell>
                      <TableCell align="left">Qty</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPartyTable.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align='center' sx={{ color: 'gray', fontWeight: 'bold' }}>
                          No party data found...
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPartyTable.map((row) => (
                        <TableRow key={row.PACK_NO} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="left">{row.PARTY_NAME}</TableCell>
                          <TableCell align="left">{row.PACK_NO}</TableCell>
                          <TableCell align="left">{row.PACK_DT ? dayjs(row.PACK_DT).format('YYYY-MM-DD') : ''}</TableCell>
                          <TableCell align="left">{row.CITY_NAME}</TableCell>
                          <TableCell align="left">{row.STATE_NAME}</TableCell>
                          <TableCell align="left">{row.SALEPERSON_NAME}</TableCell>
                          <TableCell align="left">{row.BROKER_NAME}</TableCell>
                          <TableCell align="left">{row.PACKITMDTL_QTY}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid container spacing={1.5} mt={2}>
          <BarChart
            xAxis={[{ data: ['Delhi', 'Mumbai', 'Noida', 'London', 'Lucknow', 'Dadar', 'Bihar', 'Gurugram'] }]}
            series={[
              { data: [4, 3, 5, 6, 8, 4, 7, 4, 8], barLabel: 'value' },
              {
                data: [1, 6, 3, 8, 3, 6, 3, 5, 7],
                barLabel: (item) => dollarFormatter.format(item.value),
              },
              { data: [2, 5, 6, 3, 4, 7, 5, 5, 8] },
            ]}
            height={350}
            margin={{ left: 0 }}
            yAxis={[{ width: 30 }]}
          />
        </Grid>
      </Container>
    </Box>
  );
};

export default Dispatch;