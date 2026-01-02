'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Stack, useTheme, useMediaQuery, Button, TextField, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, Checkbox, ListItemText, IconButton, Chip
} from '@mui/material';
import { ShoppingCart, People, Search } from '@mui/icons-material';
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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';

const Dispatch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = dayjs().year();
  const previousYear = currentYear - 1;
  const [dateFrom, setDateFrom] = useState(dayjs(`${previousYear}-04-01`));
  const [dateTo, setDateTo] = useState(dayjs(`${currentYear}-03-31`));
  const [openPack, setOpenPack] = useState([]);
  const [dispOrd, setDispOrd] = useState([]);
  const [unBilled, setUnBilled] = useState([]);
  const [disOrd, setDisOrd] = useState([]);
  const [fcyr, setFcyr] = useState(localStorage.getItem("FCYR_KEY"));
  const [cobrId, setCobrId] = useState(localStorage.getItem("COBR_ID"));
  const [partyTable, setPartyTable] = useState([]);
  const [recentPack, setRecentPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecentPack, setFilteredRecentPack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [partyLoading, setPartyLoading] = useState(false);
  const [stateLoading, setStateLoading] = useState([]);
  const [partySearchQuery, setPartySearchQuery] = useState('');
  const [filteredPartyTable, setFilteredPartyTable] = useState([]);
  const [stateOrd, setStateOrd] = useState([]);
  const [stateSearch, setStateSearch] = useState("");
  const [filterState, setFilterState] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [partyOption, setPartyOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [BrokerOption, setBrokerOption] = useState([]);
  const [filters, setFilters] = useState({
    Brandfilter: [],
    Partyfilter: [],
    Statefilter: [],
    Brokerfilter: [],
  });

  const handleGetData = () => {
    fetchOpenPack();
    fetchDispOrder();
    fetchUnBilledPacking();
    fetchDispWithoutOrder();
    fetchPartyWiseTable();
    fetchRecentPacking();
    fetchStateWiseOrder();
  };

  useEffect(() => {
    fetchOpenPack();
    fetchDispOrder();
    fetchUnBilledPacking();
    fetchDispWithoutOrder();
    fetchPartyWiseTable();
    fetchRecentPacking();
    fetchStateWiseOrder();
    fetchBrandDrp();
    fetchStateDrp();
    fetchBrokerDrp();
    fetchPartyDrp();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleApplyFilters = () => {
    setOpen(false);
    handleGetData();
  };

  const handleResetFilters = () => {
    setFilters({
      Partyfilter: [],
      Brandfilter: [],
      Statefilter: [],
      Brokerfilter: [],
    });
    setOpen(false);
    handleGetData();
  };

  const getFilterPayload = () => ({
    Brandfilter: filters.Brandfilter.map(item => item.BRAND_KEY).join(',') || '',
    Partyfilter: filters.Partyfilter.map(item => item.PARTY_KEY).join(',') || '',
    Statefilter: filters.Statefilter.map(item => item.STATE_KEY).join(',') || '',
    Brokerfilter: filters.Brokerfilter.map(item => item.BROKER_KEY).join(',') || '',
  });

  const fetchOpenPack = async () => {
    try {
      const filterPayload = getFilterPayload();
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "OpenPack",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filterPayload
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
      const filterPayload = getFilterPayload();
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "DisOrd",
        PageNumber: 1,
        PageSize: 10,
        SerchText: "",
        ...filterPayload
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
      const filterPayload = getFilterPayload();
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "UNBILEDPACK",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filterPayload
      });
      if (response.data && response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setUnBilled(response.data.DATA);
      } else {
        setUnBilled([]);
      }
    } catch (error) {
      toast.error("Error while fetching unbilled.");
    }
  };

  const fetchDispWithoutOrder = async () => {
    try {
      const filterPayload = getFilterPayload();
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "DisWOOrd",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filterPayload
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setDisOrd(response.data.DATA);
      } else {
        setDisOrd([]);
      }
    } catch (error) {
      toast.error("Error while getting data.");
    }
  };

  const fetchPartyWiseTable = async () => {
    setPartyLoading(true);
    try {
      const filterPayload = getFilterPayload();
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "Partywise",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filterPayload
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setPartyTable(response.data.DATA);
        setFilteredPartyTable(response.data.DATA);
      } else {
        setPartyTable([]);
        setFilteredPartyTable([]);
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
      const filterPayload = getFilterPayload();
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "RECENT",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filterPayload
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setRecentPack(response.data.DATA);
        setFilteredRecentPack(response.data.DATA);
      } else {
        setRecentPack([]);
        setFilteredRecentPack([]);
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

  const handleStateSearch = (e) => {
    setStateSearch(e.target.value);
    debouncedStateSearch(e.target.value);
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

  const debouncedStateSearch = debounce((query) => {
    const filteredData = stateOrd.filter((row) => {
      return (
        row.STATE_NAME.toLowerCase().includes(query.toLowerCase()) ||
        row.AMOUNT.toString().toLowerCase().includes(query.toLowerCase()) ||
        row.PACKITMDTL_QTY.toString().toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilterState(filteredData);
  }, 500);

  const fetchStateWiseOrder = async () => {
    setStateLoading(true);
    try {
      const filterPayload = getFilterPayload();
      const response = await axiosInstance.post("OrderDash/GetPackDashBoard", {
        COBR_ID: cobrId,
        FCYR_KEY: fcyr,
        FROM_DT: dayjs(dateFrom).format('YYYY-MM-DD'),
        To_DT: dayjs(dateTo).format('YYYY-MM-DD'),
        Flag: "StateWiseOrdSum",
        PageNumber: 1,
        PageSize: 10,
        SearchText: "",
        ...filterPayload,
      });

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setStateOrd(response.data.DATA);
        setFilterState(response.data.DATA);
      } else {
        setStateOrd([]);
        setFilterState([]);
      }
    } catch (error) {
      toast.error("Error while fetching api data.");
    } finally {
      setStateLoading(false);
    }
  };

  const fetchBrandDrp = async () => {
    try {
      const response = await axiosInstance.post('Brand/GetBrandDrp', {})
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setBrandOption(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching the brand.");
    }
  };

  const fetchPartyDrp = async () => {
    try {
      const response = await axiosInstance.post("Party/GetParty_By_Name", {
        PARTY_NAME: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setPartyOption(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching party.");
    }
  };

  const fetchBrokerDrp = async () => {
    try {
      const response = await axiosInstance.post('BROKER/GetBrokerDrp', {
        PARTY_KEY: "",
        FLAG: "Drp",
        BROKER_KEY: "",
        PageNumber: 1,
        PageSize: 10,
        SearchText: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setBrokerOption(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching the broker.");
    }
  };

  const fetchStateDrp = async () => {
    try {
      const response = await axiosInstance.post("PinCode/GetPinCodeDrp", {
        FLAG: "State",
        STATE_KEY: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setStateOption(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching the State.");
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

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #2196f3 0%, #2196f399 100%)', color: 'white', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Doc Total - {openPack[0]?.ROWNUM || 0}
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

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #4caf50 0%, #4caf5099 100%)', color: 'white', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h7" fontWeight="bold">Dispatched With Order - {dispOrd[0]?.ROWNUM || 0}</Typography>
                  <Typography variant="h6" fontWeight="bold" mt={0.5}>
                    Value: {isNaN(dispOrd[0]?.AMOUNT) ? "0.00 L" : ((dispOrd[0]?.AMOUNT / 100000).toFixed(2) + ' L')}
                  </Typography>
                  <Typography variant="h6" mt={0.5}> Qty: {dispOrd[0]?.PACKITMDTL_QTY || 0}</Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, color: '#3160c7ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #00bcd4 0%, #4caf50 100%)', color: 'white', height: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h7" fontWeight='bold'>Dispatched Without Order - {disOrd[0]?.ROWNUM || 0}</Typography>
                  <Typography variant="h6" fontWeight="bold" mt={0.5}>Value: {isNaN(disOrd[0]?.AMOUNT) ? "0.00" : (disOrd[0]?.AMOUNT / 100000).toFixed(2) + " L"}</Typography>
                  <Typography variant="h6" mt={0.5}>Qty: {disOrd[0]?.PACKITMDTL_QTY ?? 0}</Typography>
                </Box>
                <People sx={{ fontSize: 40, color: '#d486e0ff' }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 3, height: '100%', background: 'linear-gradient(135deg, #f44336 0%, #f4433699 100%)', color: 'white' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight='bold'>Unbilled Packing - {unBilled[0]?.ROWNUM || 0}</Typography>
                  <Typography variant="h6" fontWeight="bold" mt={0.5}>Value: {isNaN(unBilled[0]?.AMOUNT) ? "0.00" : (unBilled[0]?.AMOUNT / 100000).toFixed(2) + " L"}</Typography>
                  <Typography variant="h6" mt={0.5}>Qty: {unBilled[0]?.PACKITMDTL_QTY ?? 0}</Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 40, color: '#0c89afff' }} />
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={1.5} mt={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Paper sx={{ p: 1 }}>
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
                          <TableRow key={row.PACK_NO ? row.PACK_NO : `recent-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
        </Grid>

        <Grid container spacing={1.5} mt={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Paper sx={{ p: 1 }}>
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
                  Party Wise
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
                          <TableRow key={row.PACK_NO ? row.PACK_NO : `party-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell align="left">{row.PARTY_NAME}</TableCell>
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
        </Grid>

        <Grid container spacing={1.5} mt={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Paper sx={{ p: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, px: 2 }}>
                <Typography
                  sx={{
                    mb: 1, fontWeight: 'bold', fontSize: '1.25rem',
                    color: 'transparent',
                    backgroundImage: 'linear-gradient(to right, rgba(72, 102, 68, 1), rgba(221, 34, 34, 1), rgba(147, 31, 170, 1), #89d)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    zIndex: 1
                  }}
                >
                  State Wise
                </Typography>

                <TextField
                  variant="outlined"
                  placeholder="Search Any..."
                  size="small"
                  value={stateSearch}
                  onChange={handleStateSearch}
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

              {stateLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
                  <CircularProgress size="3rem" />
                  <Typography variant="body1" sx={{ mt: 2, color: '#334155', fontWeight: 500 }}>
                    Loading state...
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
                    <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                      <TableRow>
                        <TableCell align="left">State</TableCell>
                        <TableCell align="left">Amount</TableCell>
                        <TableCell align="left">Qty</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterState.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} align='center' sx={{ color: 'gray', fontWeight: 'bold' }}>
                            No data found...
                          </TableCell>
                        </TableRow>
                      ) : (
                        filterState.map((row) => (
                          <TableRow key={row.STATE_NAME || `state-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell align="left">{row.STATE_NAME}</TableCell>
                            <TableCell align="left">{row.AMOUNT}</TableCell>
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

          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Paper>
              <BarChart
                xAxis={[{
                  scaleType: 'band',
                  data: ['Delhi', 'Mumbai', 'Noida', 'London', 'Lucknow', 'Dadar', 'Bihar', 'Gurugram', 'Pune']
                }]}
                series={[
                  { data: [4, 3, 5, 6, 8, 4, 7, 4, 8] },
                  { data: [1, 6, 3, 8, 3, 6, 3, 5, 7] },
                  { data: [2, 5, 6, 3, 4, 7, 5, 5, 8] },
                ]}
                height={350}
                margin={{ left: 10 }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ padding: '8px 24px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Apply Filters</span>
              <IconButton onClick={handleClose} size="large">
                <CloseIcon color='error' />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
              <Autocomplete
                multiple
                id="party-filter"
                options={partyOption}
                getOptionLabel={(option) => option.PARTY_NAME || ''}
                isOptionEqualToValue={(option, value) => option.PARTY_KEY === value.PARTY_KEY}
                value={filters.Partyfilter || []}
                onChange={(event, newValue) => {
                  setFilters({ ...filters, Partyfilter: newValue });
                }}
                disableCloseOnSelect
                renderInput={(params) => (
                  <TextField {...params} label="Party" variant="outlined" placeholder="Select parties" />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.PARTY_KEY}>
                    <Checkbox checked={selected} size='small' color='secondary' />
                    <ListItemText primary={option.PARTY_NAME} />
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option.PARTY_KEY || index}
                      label={option.PARTY_NAME}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />

              {/* Brand Filter */}
              <Autocomplete
                multiple
                id="brand-filter"
                options={brandOption}
                getOptionLabel={(option) => option.BRAND_NAME || ''}
                isOptionEqualToValue={(option, value) => option.BRAND_KEY === value.BRAND_KEY}
                value={filters.Brandfilter || []}
                onChange={(event, newValue) => {
                  setFilters({ ...filters, Brandfilter: newValue });
                }}
                disableCloseOnSelect
                renderInput={(params) => (
                  <TextField {...params} label="Brand" variant="outlined" placeholder="Select brands" />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.BRAND_KEY}>
                    <Checkbox checked={selected} size='small' color='secondary' />
                    <ListItemText primary={option.BRAND_NAME} />
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option.BRAND_KEY || index}
                      label={option.BRAND_NAME}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
              />

              {/* State Filter */}
              <Autocomplete
                multiple
                id="state-filter"
                options={stateOption}
                getOptionLabel={(option) => option.STATE_NAME || ''}
                isOptionEqualToValue={(option, value) => option.STATE_KEY === value.STATE_KEY}
                value={filters.Statefilter || []}
                onChange={(event, newValue) => {
                  setFilters({ ...filters, Statefilter: newValue });
                }}
                disableCloseOnSelect
                renderInput={(params) => (
                  <TextField {...params} label="State" variant="outlined" placeholder="Select states" />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.STATE_KEY}>
                    <Checkbox checked={selected} size='small' color='secondary' />
                    <ListItemText primary={option.STATE_NAME} />
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option.STATE_KEY || index}
                      label={option.STATE_NAME}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
              />

              {/* Broker Filter */}
              <Autocomplete
                multiple
                id="broker-filter"
                options={BrokerOption}
                getOptionLabel={(option) => option.BROKER_NAME || ''}
                isOptionEqualToValue={(option, value) => option.BROKER_KEY === value.BROKER_KEY}
                value={filters.Brokerfilter || []}
                onChange={(event, newValue) => {
                  setFilters({ ...filters, Brokerfilter: newValue });
                }}
                disableCloseOnSelect
                renderInput={(params) => (
                  <TextField {...params} label="Broker" variant="outlined" placeholder="Select brokers" />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.BROKER_KEY}>
                    <Checkbox checked={selected} size='small' color='secondary' />
                    <ListItemText primary={option.BROKER_NAME} />
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option.BROKER_KEY || index}
                      label={option.BROKER_NAME}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleResetFilters} color="secondary" size="small" variant="outlined">
              Reset
            </Button>
            <Button onClick={handleApplyFilters} color="primary" size="small" variant="contained">
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box >
  );
};

export default Dispatch;