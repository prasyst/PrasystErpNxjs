'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Cards = () => {
  const theme = useTheme();
  const [fcyr, setFcyr] = useState(null);
  const [cobrId, setCobrId] = useState(null);
  const currentYear = dayjs().year();
  const [dateFrom, setDateFrom] = useState(dayjs(`${currentYear}-04-01`));
  const [dateTo, setDateTo] = useState(dayjs(`${currentYear + 1}-03-31`));
  const [totalRev, setTotalRev] = useState([]);
  const [totalColl, setTotalColl] = useState([]);

  useEffect(() => {
    const fcyrFromStorage = localStorage.getItem("FCYR_KEY");
    const cobrIdFromStorage = localStorage.getItem("COBR_ID");
    setFcyr(fcyrFromStorage);
    setCobrId(cobrIdFromStorage);
  }, []);

  useEffect(() => {
    totalRevenue();
    totalCollections();
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
      }
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
      console.log("Response collection", response)
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setTotalColl(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while fetching record.");
    }
  };

  const handleGetData = () => {
    totalRevenue();
    totalCollections();
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

      <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ padding: '1rem', borderRadius: '0.5rem', boxShadow: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h7" fontWeight="bold">
                  Total Revenue
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', margin: '0.5rem 0' }}>
                  {totalRev.length > 0 ? `₹ ${totalRev[0].TOT_AMT}` : '0.00'}
                </Typography>
              </Box>
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: `${theme.palette.primary.main}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CurrencyRupeeIcon />
              </Box>
            </Box>
            <Typography sx={{ color: 'green' }}>+12 from last month</Typography>
          </Paper>
        </Grid>

        {/* Total Collection */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ padding: '1rem', borderRadius: '0.5rem', boxShadow: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h7" fontWeight="bold">
                  Total Collections
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', margin: '0.5rem 0' }}>
                  {totalColl.length > 0 ? `₹ ${totalColl[0].TOT_AMT}` : '₹0.00'}
                </Typography>
              </Box>
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: `${theme.palette.secondary.main}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AddShoppingCartIcon />
              </Box>
            </Box>
            <Typography sx={{ color: 'green' }}> +8% from last month</Typography>
          </Paper>
        </Grid>

        {/* Total Customers Card */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ padding: '1rem', borderRadius: '0.5rem', boxShadow: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                  Total Customers
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', margin: '0.5rem 0' }}>
                  {totalColl.length > 0 ? `₹ ${totalColl[0].TOT_AMT}` : '0.00'}
                </Typography>
              </Box>
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: `${theme.palette.success.main}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PeopleIcon />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Transactions Card */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ padding: '1rem', borderRadius: '0.5rem', boxShadow: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
                  Transactions
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', margin: '0.5rem 0' }}>
                  {/* {transactions ?? 'Loading...'} */}
                </Typography>
              </Box>
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: `${theme.palette.warning.main}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCardIcon />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Cards;