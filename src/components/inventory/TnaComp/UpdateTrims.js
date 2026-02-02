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
  Radio, Checkbox,
  Tooltip,
  useTheme, FormControl, FormLabel, RadioGroup, FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import axiosInstance from '../../../lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmDailog from '@/components/ReusableConfirmDailog/ConfirmDailog';
import { useRouter } from 'next/navigation';

const UpdateTrims = () => {
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [partyName, setPartyName] = useState([]);
  const [branchName, setBranchName] = useState([]);
  const [orderNo, setOrderNo] = useState([]);
  const [activeTab, setActiveTab] = useState(2);
  const [cobrid, setCobrid] = useState('');
  const [fcyr, setFcyr] = useState('');
  const [clientId, setClientId] = useState('')
  const [data, setData] = useState([]);
  const [routingData, setRoutingData] = useState([])
  const [rmData, setRmData] = useState([])
  const [trimData, setTrimData] = useState([])
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState()
  const [editableRoutingData, setEditableRoutingData] = useState([]);
  const [editableRmData, setEditableRmData] = useState([]);
  const [editableTrimData, setEditableTrimData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [currentTnaKey, setCurrentTnaKey] = useState(null);
  const [currentTnaNo, setCurrentTnaNo] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoutingData, setFilteredRoutingData] = useState([]);
  const [filteredRmData, setFilteredRmData] = useState([]);
  const [filteredTrimData, setFilteredTrimData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setCobrid(localStorage.getItem('COBR_ID') || '');
    setFcyr(localStorage.getItem('FCYR_KEY') || '');
    setClientId(localStorage.getItem('CLIENT_ID') || '');
    setUserId(localStorage.getItem('USER_ID') || '')
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
      setCurrentTnaKey(null);
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

    useEffect(() => {
    if (selectedRowId) {
      fetchTRimData();
    }
  }, [selectedRowId]);

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
        ORDBKSTY_ID: item.ORDBKSTY_ID,
        ORDBKSTYSZ_ID: item.ORDBKSTYSZ_ID,
        FGSTYLE_CODE: item.FGSTYLE_CODE,
        STYSIZE_NAME: item.STYSIZE_NAME,
        FGSHADE_NAME: item.FGSHADE_NAME,
        FGPTN_NAME: item.FGPTN_NAME,
        ORDBKSTYSZ_ID: item.ORDBKSTYSZ_ID,
        FGSHADE_KEY: item.FGSHADE_KEY,
        STYSIZE_ID: item.STYSIZE_ID,
        FGSTYLE_ID: item.FGSTYLE_ID,
        ORDBK_KEY: item.ORDBK_KEY,
        TNA_KEY: item.TNA_KEY,
        FGPTN_KEY: item.FGPTN_KEY,
        FGTYPE_KEY: item.FGTYPE_KEY,
        TNA_NO: item.TNA_NO
      }))
      setData(result)
      // setSelectedRowId(null);
      if (result.length > 0) {
        const firstRow = result[0];
        if (firstRow.TNA_KEY) {
          setCurrentTnaKey(firstRow.TNA_KEY);
          setCurrentTnaNo(firstRow.TNA_NO || '');
        } else {
          setCurrentTnaKey(null);
          setCurrentTnaNo('');
        }
        setSelectedRowId(firstRow.ORDBKSTYSZ_ID);
        await handleRadioChange(firstRow,true);
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

  const handleRadioChange = async (row,fromGetData=false) => {
    setSelectedRowId(row.ORDBKSTYSZ_ID);
    setSearchQuery('');
     if (!fromGetData) {
      setActiveTab(2);
    }
    if (row.TNA_KEY) {
      setCurrentTnaKey(row.TNA_KEY);
      setCurrentTnaNo(row.TNA_NO || '');
    } else {
      setCurrentTnaKey(null);
      setCurrentTnaNo('');
    }
   await fetchTRimData();
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
        "TNA_KEY": currentTnaKey || "",
        "ORDBKSTYSZ_ID": selectedRowId,
        "DBFLAG": "S",
        "CLIENT_ID": clientId,
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
        ACCSHADE_NAME: item.ACCSHADE_NAME,
        ACCSIZE_NAME: item.ACCSIZE_NAME,
        STK_QTY: item.STK_QTY,
        MIN_STK: item.MIN_STK,
        PO_QTY: item.PO_QTY,
        GRN_QTY: item.GRN_QTY,
        ACCSIZE_KEY: item.ACCSIZE_KEY,
        ITM_KEY: item.ITM_KEY,
        ITMSUBGRP_KEY: item.ITMSUBGRP_KEY,
        ITMCAT_KEY: item.ITMCAT_KEY,
        TNATRIM_ID: item.TNATRIM_ID,
        ITM_KEY:item.ITM_KEY
      })) || [];

      setTrimData(result);
      setEditableTrimData(result);
      setFilteredTrimData(result);
    } catch (error) {
      console.error('Error fetching RM data:', error);
      setTrimData([]);
    } finally {

    }
  };

  const handleTabChange = (event, newValue) => {
  
    if (newValue === 2 && selectedRowId) {
      fetchTRimData()
    }
    setActiveTab(newValue);
    setSearchQuery('')
    
     if (newValue === 2) {
      setFilteredTrimData(trimData);
    }
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


  const handleRoutingInputChange = (index, field, value) => {
    const newData = [...editableRoutingData];
    newData[index] = {
      ...newData[index],
      [field]: value
    };

    if (field === 'EST_DT' && value) {
      for (let i = index + 1; i < newData.length; i++) {
        const prevRow = newData[i - 1];
        const currentRow = newData[i];
        const days = currentRow.DAYS || 0;

        if (prevRow.EST_DT) {
          const prevDate = new Date(prevRow.EST_DT);
          const newDate = new Date(prevDate);
          newDate.setDate(newDate.getDate() + parseInt(days));

          const formattedDate = newDate.toISOString().split('T')[0];
          newData[i] = {
            ...currentRow,
            EST_DT: formattedDate
          };
        }
      }
    }

    setEditableRoutingData(newData);
  };

  const handleRmInputChange = (index, field, value) => {
    const newData = [...editableRmData];
    newData[index] = {
      ...newData[index],
      [field]: value
    };
    setEditableRmData(newData);
  };

  const handleTrimInputChange = (index, field, value) => {
    const newData = [...editableTrimData];
    newData[index] = {
      ...newData[index],
      [field]: value
    };
    setEditableTrimData(newData);
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!selectedRowId) {
      alert('Please select an order first');
      return;
    }

    try {
      const selectedRow = data.find(row => row.ORDBKSTYSZ_ID === selectedRowId);
      if (!selectedRow) {
        throw new Error('Selected row not found');
      }

      let tnaKey = currentTnaKey;
      let tnaNo = currentTnaNo;
      let dbFlag = "I";

      if (currentTnaKey) {
        dbFlag = "U";
      } else {
        const seriesPayload = {
          "MODULENAME": "Tna",
          "TBLNAME": "Tna",
          "FLDNAME": "Tna_No",
          "NCOLLEN": 6,
          "CPREFIX": "TN",
          "COBR_ID": cobrid,
          "FCYR_KEY": fcyr,
          "TRNSTYPE": "T",
          "SERIESID": 0,
          "FLAG": ""
        };

        const seriesResponse = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', seriesPayload);
        const seriesData = seriesResponse.data;

        if (!seriesData?.DATA?.[0]?.ID) {
          throw new Error('Failed to generate TNA key');
        }

        const generatedKey = seriesData.DATA[0].ID;
        tnaNo = seriesData.DATA[0].ID;
        tnaKey = `${fcyr}${cobrid}${generatedKey}`;
      }

      const tnaPayload = {
        "DBFLAG": dbFlag,
        "FCYR_KEY": fcyr,
        "CO_ID": cobrid,
        "COBR_ID": cobrid,
        "TNA_KEY": tnaKey,
        "TNA_NO": tnaNo,
        "ORDBKSTYSZ_ID": selectedRow.ORDBKSTYSZ_ID,
        "ORDBKSTY_ID": selectedRow.ORDBKSTY_ID,
        "ORDBK_KEY": selectedRow.ORDBK_KEY,
        "ORDBK_DT": selectedRow.ORDBK_DT ? formatDateForAPI(selectedRow.ORDBK_DT) : null,
        "DLV_DT": selectedRow.DLV_DT ? formatDateForAPI(selectedRow.DLV_DT) : null,
        "KNIT_DT": selectedRow.KNIT_DT ? formatDateForAPI(selectedRow.KNIT_DT) : null,
        "DAYS_CAL": selectedRow.DAYS_CAL || 0,
        "ORDER_QTY": selectedRow.BAL_QTY || 0,
        "PARTY_KEY": selectedParty?.PARTY_KEY || "",
        "PARTYDTL_ID": selectedBranch?.PARTYDTL_ID || 0,
        "FGSTYLE_ID": selectedRow.FGSTYLE_ID || 0,
        "FGTYPE_KEY": selectedRow.FGTYPE_KEY,
        "FGSHADE_KEY": selectedRow.FGSHADE_KEY || "",
        "FGPTN_KEY": selectedRow.FGPTN_KEY,
        "STYSIZE_ID": selectedRow.STYSIZE_ID || 0,
        "PRODN_ST_DT": selectedRow.ORDBK_DT ? formatDateForAPI(selectedRow.ORDBK_DT) : null,
        "EST_DT": '2025-12-18',
        "REMK": "",
        "STATUS": "1",
        "EDIT_STATUS": "0",
        "CREATED_BY": userId || 0,
        "UPDATED_BY": userId || 0,
        "TNARoutingEntities": [],
        "TNARMEntities": [],
        "TNATRIMEntities": []
      };

      if (editableRoutingData.length > 0) {
        editableRoutingData.forEach((route, index) => {
          tnaPayload.TNARoutingEntities.push({
            "DBFLAG": "I",
            "TNADTL_ID": route.TNADTL_ID,
            "TNA_KEY": tnaKey,
            "PROSTG_KEY": route.PROSTG_KEY,
            "DAYS": route.DAYS || 0,
            "PLAN_DT": route.PLAN_DT ? formatDateForAPI(route.PLAN_DT) : null,
            "EST_DT": route.EST_DT ? formatDateForAPI(route.EST_DT) : null,
            "ACT_DT": route.ACT_DT ? formatDateForAPI(route.ACT_DT) : formatDateForAPI(new Date()),
            "PROD_OUT_QTY": route.PROD_OUT_QTY || 0,
            "BAL_QTY": route.BAL_QTY || 0,
            "REMK": route.REMK || ""
          });
        });
      }

      if (editableRmData.length > 0) {
        editableRmData.forEach((rm, index) => {
          tnaPayload.TNARMEntities.push({
            "DBFLAG": "I",
            "TNARM_ID": 0,
            "TNA_KEY": tnaKey,
            "FAB_KEY": rm.FAB_KEY || 0,
            "FABDTL_ID": rm.FABDTL_ID,
            "FABCAT_KEY": rm.FABCAT_KEY || 0,
            "QUANTITY": rm.QUANTITY || 0,
            "RATE": rm.RATE || 0,
            "AMOUNT": rm.AMOUNT || 0,
            "REMK": rm.REMK || "",
            "STKST": "N",
            "STK_QTY": rm.STK_QTY || 0
          });
        });
      }
      else if (rmData.length > 0) {
        rmData.forEach((rm, index) => {
          tnaPayload.TNARMEntities.push({
            "DBFLAG": "I",
            "TNARM_ID": 0,
            "TNA_KEY": tnaKey,
            "FAB_KEY": rm.FAB_KEY || 0,
            "FABDTL_ID": rm.FABDTL_ID,
            "FABCAT_KEY": rm.FABCAT_KEY || 0,
            "QUANTITY": rm.QUANTITY || 0,
            "RATE": rm.RATE || 0,
            "AMOUNT": rm.AMOUNT || 0,
            "REMK": rm.REMK || "",
            "STKST": "N",
            "STK_QTY": rm.STK_QTY || 0
          });
        });
      }

      if (editableTrimData.length > 0) {
        editableTrimData.forEach((trim, index) => {
          tnaPayload.TNATRIMEntities.push({
            "DBFLAG": "I",
            "TNATRIM_ID": trim.TNATRIM_ID,
            "TNA_KEY": tnaKey,
            "ITM_KEY": trim.ITM_KEY,
            "ITMSUBGRP_KEY": trim.ITMSUBGRP_KEY,
            "ITMCAT_KEY": trim.ITMCAT_KEY,
            "ACCSHADE_KEY": 0,
            "ACCSIZE_KEY": trim.ACCSIZE_KEY || '',
            "QUANTITY": trim.QUANTITY || 0,
            "RATE": trim.RATE || 0,
            "AMOUNT": trim.AMOUNT || 0,
            "REMK": trim.REMK || ""
          });
        });
      }

      else if (trimData.length > 0) {
        trimData.forEach((trim, index) => {
          tnaPayload.TNATRIMEntities.push({
            "DBFLAG": "I",
            "TNATRIM_ID": trim.TNATRIM_ID,
            "TNA_KEY": tnaKey,
            "ITM_KEY": trim.ITM_KEY,
            "ITMSUBGRP_KEY": trim.ITMSUBGRP_KEY,
            "ITMCAT_KEY": trim.ITMCAT_KEY,
            "ACCSHADE_KEY": 0,
            "ACCSIZE_KEY": trim.ACCSIZE_KEY || '',
            "QUANTITY": trim.QUANTITY || 0,
            "RATE": trim.RATE || 0,
            "AMOUNT": trim.AMOUNT || 0,
            "REMK": trim.REMK || ""
          });
        });
      }
      console.log('tnaPayload', tnaPayload)
      const submitResponse = await axiosInstance.post('/TNA/ApiMangeTNA', tnaPayload);
      if (submitResponse.data?.STATUS == 0) {
        toast.success(submitResponse.data.MESSAGE)
        await handleGetData();
      } else {
        toast.error(submitResponse.data.MESSAGE);
      }

    } catch (error) {
      console.error('Error saving TNA:', error);

    }
  };


  const handleDeleteClick = () => {
    if (!currentTnaKey) {
      toast.error('No TNA selected to delete');
      return;
    }
    setItemToDelete({
      tnaKey: currentTnaKey,
      tnaNo: currentTnaNo
    });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const payload = {
        "TNA_KEY": itemToDelete.tnaKey,
        "FLAG": ""
      };

      const deleteTna = await axiosInstance.post('/TNA/DELETE_TNA', payload);

      if (deleteTna.data?.STATUS == 0) {
        toast.success(deleteTna.data.MESSAGE);
        await handleGetData();
      } else {
        toast.error(deleteTna.data.MESSAGE || 'Failed to delete TNA');
      }
    } catch (error) {
      console.error('Error deleting TNA:', error);
      toast.error('Cannot delete TNA. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      if (activeTab === 0) {
        setFilteredRoutingData(routingData);
      } else if (activeTab === 1) {
        setFilteredRmData(rmData);
      } else if (activeTab === 2) {
        setFilteredTrimData(trimData);
      }
      return;
    }

    const lowercasedQuery = query.toLowerCase().trim();

    if (activeTab === 0) {
      const filtered = routingData.filter(item => {
        return (
          (item.PROSTG_NAME && item.PROSTG_NAME.toLowerCase().includes(lowercasedQuery)) ||
          (item.PROSTGGRP_NAME && item.PROSTGGRP_NAME.toLowerCase().includes(lowercasedQuery)) ||
          (item.REMK && item.REMK.toLowerCase().includes(lowercasedQuery)) ||
          (item.PROD_OUT_QTY && item.PROD_OUT_QTY.toString().includes(query)) ||
          (item.BAL_QTY && item.BAL_QTY.toString().includes(query)) ||
          (item.DAYS && item.DAYS.toString().includes(query))
        );
      });
      setFilteredRoutingData(filtered);
    }
    else if (activeTab === 1) {
      const filtered = rmData.filter(item => {
        return (
          (item.FAB_NAME && item.FAB_NAME.toLowerCase().includes(lowercasedQuery)) ||
          (item.DESIGN && item.DESIGN.toLowerCase().includes(lowercasedQuery)) ||
          (item.REMK && item.REMK.toLowerCase().includes(lowercasedQuery)) ||
          (item.QUANTITY && item.QUANTITY.toString().includes(query)) ||
          (item.RATE && item.RATE.toString().includes(query)) ||
          (item.AMOUNT && item.AMOUNT.toString().includes(query)) ||
          (item.BAL_QTY && item.BAL_QTY.toString().includes(query)) ||
          (item.PO_QTY && item.PO_QTY.toString().includes(query)) ||
          (item.GRN_QTY && item.GRN_QTY.toString().includes(query)) ||
          (item.STK_QTY && item.STK_QTY.toString().includes(query))
        );
      });
      setFilteredRmData(filtered);
    }
    else if (activeTab === 2) {
      const filtered = trimData.filter(item => {
        return (
          (item.ITM_DETAIL && item.ITM_DETAIL.toLowerCase().includes(lowercasedQuery)) ||
          (item.ITMSUBGRP_NAME && item.ITMSUBGRP_NAME.toLowerCase().includes(lowercasedQuery)) ||
          (item.ACCSHADE_NAME && item.ACCSHADE_NAME.toLowerCase().includes(lowercasedQuery)) ||
          (item.ACCSIZE_NAME && item.ACCSIZE_NAME.toLowerCase().includes(lowercasedQuery)) ||
          (item.REMK && item.REMK.toLowerCase().includes(lowercasedQuery)) ||
          (item.QUANTITY && item.QUANTITY.toString().includes(query)) ||
          (item.RATE && item.RATE.toString().includes(query)) ||
          (item.AMOUNT && item.AMOUNT.toString().includes(query)) ||
          (item.BAL_QTY && item.BAL_QTY.toString().includes(query)) ||
          (item.PO_QTY && item.PO_QTY.toString().includes(query)) ||
          (item.GRN_QTY && item.GRN_QTY.toString().includes(query)) ||
          (item.STK_QTY && item.STK_QTY.toString().includes(query)) ||
          (item.MIN_STK && item.MIN_STK.toString().includes(query))
        );
      });
      setFilteredTrimData(filtered);
    }
  };

  const handleBack=()=>{
    router.push('/dashboard');
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', }}>
      <ToastContainer />
      <Card sx={{
        mb: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <CardContent >
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

              <Grid size={{ xs: 12, md: 2.5 }}>
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

              <Grid size={{ xs: 12, md: 2.5 }}>
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
              <Grid size={{ xs: 12, md: 2 }}>
                <Box sx={{
                  display: 'flex',
                  gap: .5,
                  mt: { xs: 0, md: '20px' }
                }}>
                  <Button
                    variant="contained"
                    disabled={!selectedOrder}
                    onClick={handleGetData}
                    sx={{
                      flex: 1,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                      },
                      boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)',
                      py: 0.7
                    }}
                  >
                    Get Data
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    disabled={!currentTnaKey}
                    onClick={handleDeleteClick}
                    sx={{
                      flex: 1,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      py: 0.7
                    }}
                  >
                    Delete TNA
                  </Button>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap:{xs:1,md: 0.3},
                  mt: { xs: 0, md: '20px' }
                }}>

                  <FormControl>
                    <RadioGroup
                      row
                      value="size"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        "& .MuiFormControlLabel-root": {
                          margin: 0,
                          padding: 0,
                        }
                      }}
                    >
                      <FormControlLabel
                        value="item"
                        control={<Radio size="small" sx={{ p:{xs:0.5,md: 0.25} }} />}
                        label="Item"
                        sx={{
                          m: 0,
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.80rem",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="size"
                        control={<Radio size="small" sx={{ p: 0.25 }} />}
                        label="Size"
                        sx={{
                          m: 0,
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.80rem",
                        
                          },
                        }}
                      />
                    </RadioGroup>
                  </FormControl>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <Typography
                      sx={{
                        fontSize: "0.80rem",
                        whiteSpace: "nowrap",
                        minWidth: "fit-content",
                      }}
                    >
                      <span style={{ fontWeight: 650 }}>TNA No. </span>
                      {currentTnaNo ? currentTnaNo : "N/A"}
                    </Typography>
                  </Box>

                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 1 }}>
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
                  height: '15px',
                  fontSize: '15px',
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
                    p: 0.5,
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
                    key={row.ORDBKSTYSZ_ID}
                    sx={{
                      display: 'contents',
                      '& > div': {
                        borderRight: '1px solid',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '26px',
                        backgroundColor: row.TNA_KEY ? '#d7fdd7' : 'transparent',
                      },
                      '& > div:last-child': {
                        borderRight: 'none',
                      },
                      '&:nth-of-type(even) > div': {
                        backgroundColor: row.TNA_KEY ? '#d7fdd7' : '#f8fafc',
                      },
                      '&:hover > div': {
                        backgroundColor: row.TNA_KEY ? '#d7fdd7' : '#f1f5f9',
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
                          onChange={() => handleRadioChange(row)}
                          size="small"
                          sx={{
                            color: '#3b82f6',
                            padding: '0px',
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
                      <Tooltip title={row.TNA_KEY} arrow>
                        <Chip
                          label={
                            typeof row.TNA_KEY === 'string' && row.TNA_KEY.length > 12
                              ? `${row.TNA_KEY.substring(0, 12)}...`
                              : row.TNA_KEY || "N/A"
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
              borderColor: 'divider',
              marginTop: '8px'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 },
                padding: { xs: '8px', sm: '0' }
              }}>
                <Tabs
                //   value={activeTab}
                //   onChange={handleTabChange}
                  sx={{
                    minHeight: '30px',
                    width: { xs: '100%', sm: 'auto' },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      minWidth: 'auto',
                      minHeight: '28px',
                      padding: { xs: '4px 6px', sm: '4px 10px' },
                      '&.Mui-selected': {
                        color: '#1d4ed8'
                      }
                    },
                    '& .MuiTabs-flexContainer': {
                      justifyContent: { xs: 'space-between', sm: 'flex-start' },
                      gap: { xs: 0, sm: 1 }
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#1d4ed8',
                      borderRadius: '3px 3px 0 0',
                      height: '2px'
                    }
                  }}
                  variant={{ xs: 'fullWidth', sm: 'standard' }}
                >
                 
                 
                  <Tab
                    label={
                      <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        Trims
                      </Box>
                    }
                    icon={<Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Trims</Box>}
                    iconPosition="start"
                  />
                </Tabs>

                <Box sx={{
                  display: 'flex',
                  gap: 1,
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'flex-end', sm: 'flex-start' }
                }}>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{
                      width: { xs: '100%', sm: '200px' },
                      marginRight:{xs:'none',sm:'10px'},
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '32px', sm: '30px' },
                        fontSize: { xs: '0.78rem', sm: '1rem' },
                        '& input': {
                          padding: { xs: '6px 8px', sm: '4px 8px' }
                        },
                        '& fieldset': {
                          borderColor: '#3d3b3b',
                          borderWidth: {xs:'1px',sm:'2px'}
                        },
                        
                      }
                    }}

                  />
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

              {activeTab === 2 && (
                <Box >
                  <TableContainer
                    component={Paper}
                    sx={{
                      height: 220,
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
                        gridTemplateColumns: 'repeat(14, minmax(150px, 1fr))',
                        minWidth: '100%',
                        width: '100%',
                        // height: '18px',
                        fontSize: '15px',
                      }}
                    >
                      <Box sx={{
                        display: 'contents',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                      }}>
                        {['ITM_KEY','SUBGROUP','ITM_DETAIL',   'ACCSHADE_NAME', 'ACCSIZE_NAME', 'REMK', 'QTY', 'BAL_QTY', 'PO_QTY', 'GRN_QTY', 'STK_QTY', 'MIN_QTY','RATE', 'AMOUNT',].map((header, idx) => (
                          <Box
                            key={header}
                            sx={{
                              gridColumn: `${idx + 1}`,
                              p: 0.6,
                              textAlign: 'center',
                              fontWeight: 600,
                              color: 'rgba(0, 0, 0, 0.87)',
                              backgroundColor: '#f1f5f9',
                              borderRight: idx === 12 ? 'none' : '1px solid',
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

                      {filteredTrimData.map((row, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'contents',
                            '& > div': {
                              borderRight: '1px solid',
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                              display: 'flex',
                              alignItems: 'center',
                              // justifyContent: 'center',
                              minHeight: '26px',
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
                           <Box sx={{ px: 1 ,justifyContent:'center'}}>
                            <Chip
                              label={row.ITM_KEY}
                              size="small"
                              sx={{
                                backgroundColor: '#e0f2fe',
                                color: '#0369a1',
                                fontWeight: 500
                              }}
                            />
                          </Box>
                           <Box sx={{ px: 1,justifyContent:'flex-start' }}>
                            <Tooltip title={row.ITMSUBGRP_NAME} arrow>
                              <Box sx={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                {row.ITMSUBGRP_NAME}
                              </Box>
                            </Tooltip>
                          </Box>
                       
                          <Box sx={{ px: 1 ,justifyContent:'flex-start'}}>
                            <Chip
                              label={row.ITM_DETAIL}
                              size="small"
                              sx={{
                                backgroundColor: '#e0f2fe',
                                color: '#0369a1',
                                fontWeight: 500
                              }}
                            />
                          </Box>
                         
                          
                          <Box sx={{ px: 1 }}>
                            <Tooltip title={row.ACCSHADE_NAME} arrow>
                              <Box sx={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                              }}>
                                {row.ACCSHADE_NAME || '-'}
                              </Box>
                            </Tooltip>
                          </Box>
                          <Box sx={{ px: 1 }}>
                            <Tooltip title={row.ACCSIZE_NAME} arrow>
                              <Box sx={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                              }}>
                                {row.ACCSIZE_NAME || '-'}
                              </Box>
                            </Tooltip>
                          </Box>
                          <Box sx={{ px: 1 }}>
                            <TextField
                              size="small"
                              value={editableTrimData[index]?.REMK || ''}
                              onChange={(e) => handleTrimInputChange(index, 'REMK', e.target.value)}
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '4px 8px',
                                  fontSize: '0.875rem'
                                }
                              }}
                            />
                          </Box>
                             <Box sx={{justifyContent:'center'}}>
                            <Chip
                              label={row.QUANTITY}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                              }}
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
                              }}>
                                {row.BAL_QTY}
                              </Box>
                            </Tooltip>
                          </Box>
                          <Box sx={{ px: 1, fontWeight: 600 }}>
                            <Tooltip title={row.PO_QTY} arrow>
                              <Box sx={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                              }}>
                                {row.PO_QTY}
                              </Box>
                            </Tooltip>
                          </Box>
                          <Box sx={{ px: 1, fontWeight: 600 }}>
                            <Tooltip title={row.GRN_QTY} arrow>
                              <Box sx={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                              }}>
                                {row.GRN_QTY}
                              </Box>
                            </Tooltip>
                          </Box>
                          <Box sx={{ px: 1, fontWeight: 600 }}>
                            <Tooltip title={row.STK_QTY} arrow>
                              <Box sx={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                              }}>
                                {row.STK_QTY}
                              </Box>
                            </Tooltip>
                          </Box>
                          <Box sx={{ px: 1, fontWeight: 600 }}>
                            <Tooltip title={row.MIN_STK} arrow>
                              <Box sx={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                              }}>
                                {row.MIN_STK}
                              </Box>
                            </Tooltip>
                          </Box>
                          <Box sx={{ px: 1 }}>
                            <Tooltip title={row.RATE} arrow>
                              <Box sx={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                              }}>
                                {row.RATE}
                              </Box>
                            </Tooltip>
                          </Box>
                          <Box sx={{ px: 1 }}>
                            <Tooltip title={row.AMOUNT} arrow>
                              <Box sx={{
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                              }}>
                                {row.AMOUNT}
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </TableContainer>
                </Box>
              )}
            </Paper>
          </Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,

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
              onClick={handleBack}
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
              onClick={handleSave}
            >
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
      <ConfirmDailog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete TNA"
        message={`Are you sure you want to delete TNA`}
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
      />
    </Box>
  );
};

export default UpdateTrims;