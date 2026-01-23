"use client"

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
  Chip,
  IconButton,
  Button,
  Autocomplete,
  Tabs,
  Tab,
  Radio,
  Tooltip,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axiosInstance from '../../../lib/axios';

const Tna = () => {
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [partyName, setPartyName] = useState([]);
  const [branchName, setBranchName] = useState([]);
  const [orderNo, setOrderNo] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
   const [cobrid, setCobrid] = useState(''); 
  const [fcyr, setFcyr] = useState(''); 
  const [clientId, setClientId] = useState('')
  const [data, setData] = useState([]);
  const [routingData,setRoutingData]=useState([])
  const [rmData,setRmData]=useState([])
  const [trimData,setTrimData]=useState([])
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [isClient, setIsClient] = useState(false); 

   useEffect(() => {
    setIsClient(true);
    setCobrid(localStorage.getItem('COBR_ID') || '');
    setFcyr(localStorage.getItem('FCYR_KEY') || '');
    setClientId(localStorage.getItem('CLIENT_ID') || '');
  }, []);

  useEffect(() => {
    if (isClient) {
      getPartyName();
    }
  }, [isClient]);
  const getPartyName = async () => {
    try {
      const payload = {
        "PARTY_NAME": ""
      }

      const response = await axiosInstance.post('/Party/GetParty_By_Name', payload);
      const result = response.data?.DATA.map((item) => ({
        PARTY_KEY: item.PARTY_KEY,
        PARTY_NAME: item.PARTY_NAME
      }))
      setPartyName(result)
      if (result.length > 0 && !selectedParty) {
        setSelectedParty(result[0]);
      }
    } catch (error) {
      console.error('Error fetching party names:', error);
      return [];
    }
  };

  const getBranchName = async (partyKey) => {
    try {
      const payload = {
        "Party_KEY": partyKey
      }

      const response = await axiosInstance.post('/Party/GetPartyDtlDrp', payload);
      const result = response.data?.DATA.map((item) => ({
        PARTYDTL_ID: item.PARTYDTL_ID,
        PLACE: item.PLACE,
        PARTY_KEY: item.PARTY_KEY
      }))
      setBranchName(result)
      if (result.length > 0) {
      setSelectedBranch(result[0]);
    } else {
      setSelectedBranch(null);
      setSelectedOrder(null);
      setOrderNo([]);
    }
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  };

  const getOrderNo = async (partyKey, PARTYDTL_ID) => {
    try {
      const payload = {
        "ORDBK_KEY": "",
        "FLAG": "TNAORD",
        "FCYR_KEY": fcyr,
        "COBR_ID": cobrid,
        "PageNumber": 1,
        "PageSize": 25,
        "SearchText": "",
        "PARTY_KEY": partyKey,
        "PARTYDTL_ID": PARTYDTL_ID
      }

      const response = await axiosInstance.post('/ORDBK/GetOrdbkDrp?currentPage=1&limit=25', payload);
      const result = response.data?.DATA.map((item) => ({
        ORDBK_NO: item.ORDBK_NO,
        ORDBK_KEY: item.ORDBK_KEY,
      }))
      setOrderNo(result)
     if (result.length > 0) {
      setSelectedOrder(result[0]);
    } else {
      setSelectedOrder(null);
    }
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  };

  useEffect(() => {
    getPartyName()
  }, [])

 useEffect(() => {
  if (selectedParty?.PARTY_KEY) {
    getBranchName(selectedParty.PARTY_KEY);
    // setData([]);
  } else {
    setSelectedBranch(null);
    setSelectedOrder(null);
    setBranchName([]);
    setOrderNo([]);
    // setData([]);
  }
}, [selectedParty])

  useEffect(() => {
    if (selectedBranch?.PARTYDTL_ID && selectedParty?.PARTY_KEY) {
      getOrderNo(selectedParty.PARTY_KEY, selectedBranch.PARTYDTL_ID);
    }
     else {
    setSelectedOrder(null);
    setOrderNo([]);
  }
  }, [selectedBranch, selectedParty])

  const handleGetData = async () => {
    try {
      const payload = {
        "PageNumber": 1,
        "PageSize": 25,
        "SearchText": "",
        "FLAG": "ORD",
        "FCYR_KEY": fcyr,
        "COBR_ID": cobrid,
        "PARTY_KEY": selectedParty.PARTY_KEY,
        "PARTYDTL_ID": selectedBranch.PARTYDTL_ID,
        "CWHAER": selectedOrder.ORDBK_KEY,
        "TNA_KEY": "",
        "ORDBKSTYSZ_ID": 0,
        "DBFLAG": "S",
        "CLIENT_ID": clientId,
        "NAME": "ORD"
      }

      const response = await axiosInstance.post('/TNA/GetTNAORD?currentPage=1&limit=25', payload);
      const result = response.data.DATA.map((item) => ({
        KNIT_DT: item.KNIT_DT,
        PLAN_DT: item.PLAN_DT,
        EST_DT: item.EST_DT,
        ACT_DT: item.ACT_DT,
        BAL_QTY: item.BAL_QTY,
        ORDBK_DT: item.ORDBK_DT,
        DLV_DT: item.DLV_DT,
        DAYS_CAL: item.DAYS_CAL,
        PORD_REF: item.PORD_REF,
        ORDBKSTY_ID:item.ORDBKSTY_ID,
        FGSTYLE_CODE:item.FGSTYLE_CODE,
        STYSIZE_NAME:item.STYSIZE_NAME,
        FGSHADE_NAME:item.FGSHADE_NAME,
        FGPTN_NAME:item.FGPTN_NAME,
        ORDBKSTYSZ_ID:item.ORDBKSTYSZ_ID
      }))
      setData(result)
      // setSelectedRowId(null);
      setTrimData([]);
      if (result.length > 0) {
      const firstRow = result[0];
      setSelectedRowId(firstRow.ORDBKSTYSZ_ID);
      await handleRadioChange(firstRow);
    } else {
      setSelectedRowId(null);
      setRoutingData([]);
      setRmData([]);
      setTrimData([]);
    }
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

const handleRadioChange = async (row) => {
  setSelectedRowId(row.ORDBKSTYSZ_ID);
   setRmData([]);
  setTrimData([]);

  setActiveTab(0);
  try {
    const payload = {
      "PageNumber": 1,
      "PageSize": 25,
      "SearchText": "",
      "FLAG": "Routing",
      "FCYR_KEY": fcyr,
      "COBR_ID": cobrid,
      "PARTY_KEY": selectedParty?.PARTY_KEY,
      "PARTYDTL_ID": selectedBranch?.PARTYDTL_ID,
      "CWHAER": selectedOrder?.ORDBK_KEY,
      "TNA_KEY": "",
      "ORDBKSTYSZ_ID": row?.ORDBKSTYSZ_ID,
      "DBFLAG": "S",
      "CLIENT_ID": clientId,
      "NAME": "Routing"
    };

    const response = await axiosInstance.post('/TNA/GetTNAProstg?currentPage=1&limit=25', payload);
    const result = response.data.DATA.map((item) => ({
      REC_DOZ: item.REC_DOZ,
      PLAN_DT: item.PLAN_DT,
      EST_DT: item.EST_DT,
      ACT_DT: item.ACT_DT,
      BAL_QTY: item.BAL_QTY,
      ORDBK_DT: item.ORDBK_DT,
      DLV_DT: item.DLV_DT,
      REC_QTY: item.REC_QTY,
      PORD_REF: item.PORD_REF,
      ORDBKSTY_ID: item.ORDBKSTY_ID,
      PROD_OUT_QTY:item.PROD_OUT_QTY,
      BAL_QTY:item.BAL_QTY,
      PROSTG_NAME:item.PROSTG_NAME,
      DAYS:item.DAYS,
      PROSTGGRP_NAME:item.PROSTGGRP_NAME
    }));

    setRoutingData(result)
    setRmData([]);
  } catch (error) {
    console.error('Error fetching routing data:', error);
  }
};
const fetchRmData = async () => {
  if (!selectedRowId) {
    setRmData([]);
    return;
  }
  try {
    const payload = {
      "PageNumber": 1,
      "PageSize": 25,
      "SearchText": "",
      "FLAG": "RM",
      "FCYR_KEY": fcyr,
      "COBR_ID": cobrid,
      "PARTY_KEY": selectedParty?.PARTY_KEY,
      "PARTYDTL_ID": selectedBranch?.PARTYDTL_ID,
      "CWHAER": '',
      "TNA_KEY": "",
      "ORDBKSTYSZ_ID": selectedRowId,
      "DBFLAG": "S",
      "CLIENT_ID": clientId,
      "NAME": "RM"
    };

    const response = await axiosInstance.post('/TNA/GetTNARM?currentPage=1&limit=25', payload);
    const result = response.data.DATA?.map((item) => ({
      FAB_NAME: item.FAB_NAME,
      DESIGN: item.DESIGN,
      QUANTITY: item.QUANTITY,
      RATE: item.RATE,
      AMOUNT: item.AMOUNT,
      REMK: item.REMK,
      BAL_QTY: item.BAL_QTY,
      PO_QTY: item.PO_QTY,
      GRN_QTY: item.GRN_QTY,
      STK_QTY: item.STK_QTY
    })) || [];
    
    setRmData(result);
  } catch (error) {
    console.error('Error fetching RM data:', error);
    setRmData([]);
  } finally {
    
  }
};
const fetchTRimData = async () => {
  if (!selectedRowId) {
    setTrimData([]);
    return;
  }
  try {
    const payload = {
      "PageNumber": 1,
      "PageSize": 25,
      "SearchText": "",
      "FLAG": "TRIM",
      "FCYR_KEY": fcyr,
      "COBR_ID": cobrid,
      "PARTY_KEY": selectedParty?.PARTY_KEY,
      "PARTYDTL_ID": selectedBranch?.PARTYDTL_ID,
      "CWHAER": '',
      "TNA_KEY": "",
      "ORDBKSTYSZ_ID": selectedRowId,
      "DBFLAG": "S",
      "CLIENT_ID":clientId,
      "NAME": "TRIM"
    };

    const response = await axiosInstance.post('/TNA/GetTNATRIM?currentPage=1&limit=25', payload);
    const result = response.data.DATA?.map((item) => ({
      ITM_DETAIL: item.ITM_DETAIL,
      ITMSUBGRP_NAME: item.ITMSUBGRP_NAME,
      QUANTITY: item.QUANTITY,
      RATE: item.RATE,
      AMOUNT: item.AMOUNT,
      REMK: item.REMK,
      BAL_QTY: item.BAL_QTY,
      PO_QTY: item.PO_QTY,
      GRN_QTY: item.GRN_QTY,
      STK_QTY: item.STK_QTY,
      ACCSHADE_NAME:item.ACCSHADE_NAME,
      ACCSIZE_NAME:item.ACCSIZE_NAME,
      STK_QTY:item.STK_QTY,
      MIN_STK:item.MIN_STK,
      PO_QTY:item.PO_QTY,
      GRN_QTY:item.GRN_QTY
    })) || [];
    
    setTrimData(result);
  } catch (error) {
    console.error('Error fetching RM data:', error);
    setTrimData([]);
  } finally {
    
  }
};

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && selectedRowId) {
    fetchRmData();
  }
  if(newValue===2 && selectedRowId){
    fetchTRimData()
  }
    setActiveTab(newValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc',  p: 1 }}>
      <Card sx={{
        mb: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 1 }}>
          <Box sx={{
            backgroundColor: '#f1f5f9',
            p: 1,
            borderRadius: 2,
            mb: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary" >
                  Party
                </Typography>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={partyName}
                  getOptionLabel={(option) => option.PARTY_NAME || ''}
                  value={selectedParty}
                  // onChange={(event, newValue) => setSelectedParty(newValue)}
                  onChange={(event, newValue) => {
                    setSelectedParty(newValue);
                    if (!newValue) {
                      setSelectedBranch(null);
                      setSelectedOrder(null);
                      setBranchName([]);
                      setOrderNo([]);
                      setData([]);
                    }
                  }}
                  isOptionEqualToValue={(option, value) => option?.PARTY_KEY === value?.PARTY_KEY}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select party"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary" >
                  Branch
                </Typography>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={branchName}
                  getOptionLabel={(option) => option.PLACE || ''}
                  value={selectedBranch}
                  onChange={(event, newValue) => setSelectedBranch(newValue)}
                  isOptionEqualToValue={(option, value) => option?.PARTYDTL_ID === value?.PARTYDTL_ID}
                  disabled={!selectedParty}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select branch"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" color="text.secondary" >
                  Order No
                </Typography>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={orderNo}
                  getOptionLabel={(option) => option.ORDBK_NO || ''}
                  value={selectedOrder}
                  onChange={(event, newValue) => setSelectedOrder(newValue)}
                  isOptionEqualToValue={(option, value) => option?.ORDBK_KEY === value?.ORDBK_KEY}
                  disabled={!selectedBranch}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select order"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          backgroundColor: 'white'
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 6, md: 1 }} justifyContent={{ xs: 'flex-end', md: 'flex-start' }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!selectedOrder}
                  onClick={handleGetData}
                  sx={{
                    marginTop: { xs: 0, sm: '20px' },
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    },
                    boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  Get Data
                </Button>
              </Grid>
              <Grid size={{ xs: 6, md: 2 }} >
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  sx={{ borderRadius: 2, marginTop: { xs: 0, sm: '20px' }, }}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TableContainer
              component={Paper}
              sx={{
                height: 200,
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(80px, 80px) repeat(12, minmax(120px, 1fr))',
                  minWidth: '100%',
                  width: '100%',
                  height:'18px',
                  fontSize:'15px',
                  // overflowX: 'auto',
                }}
              >
                <Box sx={{
                  display: 'contents',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Box sx={{
                    gridColumn: '1',
                    p: 0.8,
                    textAlign: 'center',
                    fontWeight: 600,
                    color: 'rgba(0, 0, 0, 0.87)',
                    backgroundColor: '#f1f5f9',
                    borderRight: '1px solid',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    SELECT
                  </Box>
                  {[
                    'ORDBK_DT', 'DLV_DT', 'KINT_DT', 'DAYS_CAL', 'BAL_QTY', 'PORD_REF',
                    'STYLE_CODE', 'FGTYPE_NAME', 'FGSHADE_NAME', 'FGPTN_NAME',
                    'STYSIZE_NAME', 'TNA_KEY'
                  ].map((header, idx) => (
                    <Box
                      key={header}
                      sx={{
                        gridColumn: `${idx + 2}`,
                        textAlign: 'center',
                        fontWeight: 600,
                        color: 'rgba(0, 0, 0, 0.87)',
                        backgroundColor: '#f1f5f9',
                        borderRight: idx === 11 ? 'none' : '1px solid',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {header}
                    </Box>
                  ))}
                </Box>

                {data.map((row, index) => (
                  <Box
                    key={row.ORDBK_KEY}
                    sx={{
                      display: 'contents',
                      '& > div': {
                        borderRight: '1px solid',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '30px',
                      },
                      '& > div:last-child': {
                        borderRight: 'none',
                      },
                      '&:nth-of-type(even) > div': {
                        backgroundColor: '#f8fafc',
                      },
                      '&:hover > div': {
                        backgroundColor: '#f1f5f9',
                      },
                    }}
                  >
                    <Box>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        width: '100%',
                      }}>
                        <Typography variant="caption" sx={{
                          color: '#6b7280',
                          fontWeight: 500,
                          minWidth: '20px',
                          textAlign: 'center'
                        }}>
                          {index + 1}
                        </Typography>
                        <Radio
                         checked={selectedRowId === row.ORDBKSTYSZ_ID}
                        //  onChange={() => setSelectedRowId(row.ORDBKSTY_ID)}
                         onChange={()=>handleRadioChange(row)}
                          size="small"
                          sx={{
                            color: '#3b82f6',
                            padding:'0px',
                            '&.Mui-checked': {
                              color: '#3b82f6',
                            },
                          }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ px: 1 }}>
                      {row.ORDBK_DT ? formatDate(row.ORDBK_DT) : '-'}
                    </Box>
                    <Box sx={{ px: 1 }}>
                      {row.DLV_DT ? formatDate(row.DLV_DT) : '-'}
                    </Box>
                    <Box sx={{ px: 1 }}>
                      {row.KNIT_DT ? formatDate(row.KNIT_DT) : '-'}
                    </Box>
                    <Box>
                      <Chip
                        label={row.DAYS_CAL}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: row.days_cal < 0 ? '#fef2f2' : '#f0fdf4',
                          color: row.days_cal < 0 ? '#dc2626' : '#16a34a',
                          borderColor: row.days_cal < 0 ? '#fecaca' : '#bbf7d0',
                        }}
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ px: 1 }}>
                      <Tooltip title={row.BAL_QTY} arrow>
                        <Box sx={{
                          width: '100%',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                          fontWeight: 600,
                          color: '#1e293b',
                        }}>
                          {row.BAL_QTY}
                        </Box>
                      </Tooltip>
                    </Box>
                    <Box sx={{ px: 1 }}>
                      <Tooltip title={row.PORD_REF} arrow>
                        <Box sx={{
                          width: '100%',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                        }}>
                          {typeof row.PORD_REF === 'string' && row.PORD_REF.length > 15
                            ? `${row.PORD_REF.substring(0, 15)}...`
                            : row.PORD_REF}
                        </Box>
                      </Tooltip>
                    </Box>
                    {[
                      { key: 'fgstyle_code', value: row.FGSTYLE_CODE },
                      { key: 'fgtype_name', value: row.FGPTN_NAME },
                      { key: 'fgphase_name', value: row.FGSHADE_NAME },
                      { key: 'fgptn_name', value: row.fgptn_name },
                      { key: 'stysize_name', value: row.STYSIZE_NAME },
                    ].map((item) => (
                      <Box key={item.key} sx={{ px: 1 }}>
                        <Tooltip title={item.value} arrow>
                          <Box sx={{
                            width: '100%',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                          }}>
                            {typeof item.value === 'string' && item.value.length > 15
                              ? `${item.value.substring(0, 15)}...`
                              : item.value}
                          </Box>
                        </Tooltip>
                      </Box>
                    ))}

                    <Box sx={{ px: 1 }}>
                      <Tooltip title={row.tna_key} arrow>
                        <Chip
                          label={
                            typeof row.tna_key === 'string' && row.tna_key.length > 12
                              ? `${row.tna_key.substring(0, 12)}...`
                              : row.tna_key
                          }
                          size="small"
                          sx={{
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            fontWeight: 500,
                            maxWidth: '100%',
                            '& .MuiChip-label': {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            </TableContainer>
          </Box>
          <Box>
            <Box sx={{
              backgroundColor: '#f1f5f9',
              borderRadius: '12px 12px 0 0',
              border: '1px solid',
              borderBottom: 0,
              borderColor: 'divider'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    minHeight: '36px',
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      minWidth: 'auto',
                      minHeight: '36px',
                      padding: '6px 10px',
                      '&.Mui-selected': {
                        color: '#1d4ed8'
                      }
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#1d4ed8',
                      borderRadius: '3px 3px 0 0',
                      height: '3px'
                    }
                  }}
                >
                  <Tab
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ViewWeekIcon fontSize="small" />
                        Routing
                      </Box>
                    }
                  />
                  <Tab label="RM" />
                  <Tab label="Trims" />
                </Tabs>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small">
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Paper
              sx={{
                borderRadius: '0 0 12px 12px',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
            >
              {activeTab === 0 && (
                <TableContainer
                  sx={{
                    height: 250,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',

                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>PROSTGGRP_NAME</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>PROSTG_NAME</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>DAYS</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>PLAN_DT</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>EST_DT</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>ACT_DT</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>REMK</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>PROD_OUT_QTY</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>BAL_QTY</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {routingData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:nth-of-type(even)': { backgroundColor: '#f8fafc' },
                            '&:hover': { backgroundColor: '#f1f5f9' },
                            '& td': { py: 0.5 }
                          }}
                        >
                          <TableCell>
                            <Chip
                              label={row.PROSTGGRP_NAME}
                              size="small"
                              sx={{
                                backgroundColor: '#e0f2fe',
                                color: '#0369a1',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>{row.PROSTG_NAME}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.DAYS}
                              size="small"
                              sx={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>{row.PLAN_DT ?  formatDate(row.PLAN_DT) : '-'}</TableCell>
                          <TableCell>{row.EST_DT ?  formatDate(row.EST_DT) : '-'}</TableCell>
                          <TableCell>{row.ACT_DT ?  formatDate(row.ACT_DT) : '-'}</TableCell>
                          <TableCell></TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.PROD_OUT_QTY}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.BAL_QTY}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeTab === 1 && (
               <TableContainer
                  sx={{
                    height: 250,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',

                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>FAB_NAME</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>DESIGN</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>QUENTITY</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>RATE</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>AMOUNT</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>REMK</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>BAL_QTY</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: .5 }}>PO_QTY</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: .5 }}>GRN_QTY</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: .5 }}>STK_QTY</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rmData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:nth-of-type(even)': { backgroundColor: '#f8fafc' },
                            '&:hover': { backgroundColor: '#f1f5f9' },
                            '& td': { py: 0.5 }
                          }}
                        >
                          <TableCell>
                            <Chip
                              label={row.FAB_NAME}
                              size="small"
                              sx={{
                                backgroundColor: '#e0f2fe',
                                color: '#0369a1',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>{row.DESIGN}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.QUANTITY}
                              size="small"
                              sx={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>{row.RATE}</TableCell>
                          <TableCell>{row.AMOUNT}</TableCell>
                          <TableCell>{'-'}</TableCell>
                          <TableCell>{row.BAL_QTY}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.PO_QTY}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{row.GRN_QTY}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.STK_QTY}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeTab === 2 && (
                  <TableContainer
                  sx={{
                    height: 250,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',

                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>ITM_DETAIL</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>ITM_SUBGROUP</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>QUENTITY</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>RATE</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>AMOUNT</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>ACCSHADE_NAME</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>ACCSIZE_NAME</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>REMK</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>BAL_QTY</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>PO_QTY</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>GRN_QTY</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>STK_QTY</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: .5 }}>MIN_QTY</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trimData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:nth-of-type(even)': { backgroundColor: '#f8fafc' },
                            '&:hover': { backgroundColor: '#f1f5f9' },
                            '& td': { py: 0.5 }
                          }}
                        >
                          <TableCell>
                            <Chip
                              label={row.ITM_DETAIL}
                              size="small"
                              sx={{
                                backgroundColor: '#e0f2fe',
                                color: '#0369a1',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>{row.ITMSUBGRP_NAME}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.QUANTITY}
                              size="small"
                              sx={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>{row.RATE}</TableCell>
                          <TableCell>{row.AMOUNT}</TableCell>
                          <TableCell>{row.ACT_DT ?  formatDate(row.ACT_DT) : '-'}</TableCell>
                          <TableCell></TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.REMK}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.BAL_QTY}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.PO_QTY}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.GRN_QTY}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.STK_QTY}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.BAL_QTY}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 1,
            pt: 1,
            borderTop: '1px solid',
            borderTopColor: 'divider'
          }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              sx={{
                minWidth: 120,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              sx={{
                minWidth: 120,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Tna;