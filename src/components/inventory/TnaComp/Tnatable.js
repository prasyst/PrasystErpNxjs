'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import axiosInstance from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import ReusableTable, { getCustomDateFilter } from '../../datatable/ReusableTable';

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice();
  return `${day}/${month}/${year}`;
};

const DateCellRenderer = (params) => {
  return <span>{formatDate(params.value)}</span>;
};

const getStatusChip = (status) => {
  if (!status) return <span style={{ color: '#999' }}>-</span>;

  const statusColorMap = {
    'Complete': { bg: '#4caf50', text: '#ffffff' },
    'Pending': { bg: '#ff9800', text: '#ffffff' },
    'Partial': { bg: '#f44336', text: '#ffffff' },
    'In Progress': { bg: '#2196f3', text: '#ffffff' },
    'Cancelled': { bg: '#9e9e9e', text: '#ffffff' }
  };

  const colors = statusColorMap[status] || { bg: '#757575', text: '#ffffff' };

  return (
    <div style={{ display: 'flex', alignItems: 'center',justifyContent: 'center', height: '100%', }}>
      <span style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '0px 10px',
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: 600,
        display: 'inline-block',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        letterSpacing: '0.3px',
        height: '22px',
        lineHeight: '20px',
         width: '80px',
         overflow: 'hidden',
         textOverflow: 'ellipsis'
      }}>
        {status}
      </span>
    </div>
  );
};

const setFilterParams = {
  defaultToNothingSelected: true,
  selectAllOnMiniFilter: false,
  suppressSelectAll: false,
  newRowsAction: 'keep',
};

const columnDefs = [
  {
    field: "PARTY_NAME",
    headerName: "PARTY NAME",
    width: 250,
    filter: 'agSetColumnFilter',
    filterParams: setFilterParams,
    sortable: true,
    cellStyle: { fontWeight: 500 }
  },
  {
    field: "ORDBK_KEY",
    headerName: "ORDER KEY",
    width: 130,
    filter: 'agSetColumnFilter',
    filterParams: setFilterParams,
    sortable: true,
    cellStyle: { fontWeight: 500, color: '#6949e9', cursor: 'pointer' }
  },
  {
    field: "ORDBK_NO",
    headerName: "ORDER NO",
    width: 130,
    filter: 'agSetColumnFilter',
    filterParams: setFilterParams,
    sortable: true,
    cellStyle: { fontWeight: 500, color: '#1976d2', cursor: 'pointer' }
  },
  {
    field: "ORDER_Date",
    headerName: "ORDER DATE",
    width: 130,
    cellRenderer: DateCellRenderer,
    filter: 'agDateColumnFilter',
    filterParams: {
      browserDatePicker: true,
      filterOptions: [
        'equals',
        'notEqual',
        'lessThan',
        'greaterThan',
        'inRange',
        'empty',
        'notEmpty'
      ],
      customOptionLabel: 'Custom Dates',
      customFilter: getCustomDateFilter()
    },
    sortable: true
  },
  {
    field: "DLV_DT",
    headerName: "DELIVERY DATE",
    width: 140,
    cellRenderer: DateCellRenderer,
    filter: 'agDateColumnFilter',
    filterParams: {
      browserDatePicker: true,
      filterOptions: [
        'equals',
        'notEqual',
        'lessThan',
        'greaterThan',
        'inRange',
        'empty',
        'notEmpty'
      ],
      customOptionLabel: 'Custom Dates',
      customFilter: getCustomDateFilter()
    },
    sortable: true
  },
  {
    field: "TotalCount",
    headerName: "TOTAL ITEMS",
    width: 100,
    filter: 'agSetColumnFilter',
    filterParams: setFilterParams,
    sortable: true,
    cellStyle: { textAlign: 'center' },
    cellRenderer: (params) => <span style={{ fontWeight: 600, color: '#2c3e50' }}>{params.value || 0}</span>
  },
  {
    field: "TNA_ST",
    headerName: "TNA STATUS",
    width: 140,
    filter: 'agSetColumnFilter',
    filterParams: setFilterParams,
    sortable: true,
    cellRenderer: (params) => getStatusChip(params.value),
       cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    field: "BOMSOCKS_ST",
    headerName: "BOM STATUS",
    width: 140,
    filter: 'agSetColumnFilter',
    filterParams: setFilterParams,
    sortable: true,
    cellRenderer: (params) => getStatusChip(params.value),
      cellStyle: { display: 'flex', alignItems: 'center' }
  },
];

const DateFilters = React.memo(({ dateRange, onDateChange, isLoading, onGetData, onNewOrder }) => {
  return (
    <Paper elevation={0} sx={{ p: 1, borderRadius: 2 ,ml:2}}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 2.5 }}>
          <TextField
            fullWidth
            label="From Date"
            type="date"
            value={dateRange.FROM_DT}
            onChange={(e) => onDateChange('FROM_DT', e.target.value)}
            size="small"
            sx={{ bgcolor: '#fff' }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <TextField
            fullWidth
            label="To Date"
            type="date"
            value={dateRange.To_DT}
            onChange={(e) => onDateChange('To_DT', e.target.value)}
            size="small"
            sx={{ bgcolor: '#fff' }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={onGetData}
            disabled={isLoading}
            sx={{ height: '38px', whiteSpace: 'nowrap', bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
          >
            {isLoading ? 'Loading...' : 'Get Data'}
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onNewOrder}
            startIcon={<AddIcon />}
            sx={{ height: '38px' }}
          >
            New
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
});

const Tnatable = React.memo(function Tnatable() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [recordCount, setRecordCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const hasFetchedRef = useRef(false);
  const gridApiRef = useRef(null);
  const formRef = useRef({ PARTY_KEY: "" });
  const cobridRef = useRef('');
  const fcyrRef = useRef('');

  const getDateRangeFromMonths = useCallback((months) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - months);
    return {
      FROM_DT: fromDate.toISOString().split('T')[0],
      To_DT: toDate.toISOString().split('T')[0]
    };
  }, []);

  const [dateRange, setDateRange] = useState(() => getDateRangeFromMonths(3));


  const fetchTableData = useCallback(async () => {
    if (!cobridRef.current || !fcyrRef.current) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`/TNA/GetTNADashTNAData`, {
        "FLAG": "",
        "FCYR_KEY": fcyrRef.current,
        "COBR_ID": cobridRef.current,
        "PARTY_KEY": formRef.current.PARTY_KEY,
        "PARTYDTL_ID": 0,
        "ORDBK_KEY": "",
        "FROM_DT": dateRange.FROM_DT,
        "To_DT": dateRange.To_DT
      });

      const { data: { STATUS, DATA } } = response;

      if (STATUS === 0 && Array.isArray(DATA) && DATA.length > 0) {
        const formattedData = DATA.map((row, index) => ({
          id: index,
          ...row,
          ORDER_Date: row.ORDBK_DT || null,
          DLV_DT: row.DLV_DT || null,
          ORDBK_KEY: row.ORDBK_KEY || null,
        }));
        setRows(formattedData);
        setRecordCount(formattedData.length);
      } else {
        setRows([]);
        setRecordCount(0);
      }
      setLastFetchTime(new Date());
    } catch (error) {
      console.error("Error fetching order data:", error);
      setRows([]);
      setRecordCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);


  useEffect(() => {
    const cobridValue = localStorage.getItem('COBR_ID') || '';
    const fcyrValue = localStorage.getItem('FCYR_KEY') || '';
    const userRole = localStorage.getItem('userRole');

    cobridRef.current = cobridValue;
    fcyrRef.current = fcyrValue;

    if (userRole === 'customer') {
      formRef.current.PARTY_KEY = localStorage.getItem('PARTY_KEY') || "";
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && !hasFetchedRef.current && cobridRef.current && fcyrRef.current) {
      hasFetchedRef.current = true;
      fetchTableData();
    }
  }, [isInitialized, fetchTableData]);

  const handleGetData = useCallback(() => {
    fetchTableData();
  }, [fetchTableData]);


  const handleDateChange = useCallback((field, value) => {
    setDateRange(prev => {
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  const handleRowDoubleClick = useCallback((row) => {
   const rowData = row;
  console.log("ORDBK_KEY:", rowData?.ORDBK_KEY);
    if (rowData?.ORDBK_KEY) {
       router.push(`/tnapage/tnadetailestable?ordbk_key=${rowData.ORDBK_KEY}`);
    } 
    // else {
    //   router.push(`/tnapage/tnadetailestable`);
    // }
  }, [router]);

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
  }, []);

  const handleNewOrder = useCallback(() => {
    router.push("/tnapage/tnadash");
  }, [router]);



  const NoDataMessage = useMemo(() => () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
      <Alert severity="info" sx={{ maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom>No Data Available</Typography>
        <Typography variant="body2">Please select date range and click "Get Data" to load records.</Typography>
      </Alert>
    </Box>
  ), []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100
  }), []);

  const customGridOptions = useMemo(() => ({
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
    animateRows: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    noRowsOverlayComponent: NoDataMessage,
  }), [NoDataMessage]);

  const exportParams = useMemo(() => ({
    suppressTextAsCDATA: true,
    fileName: `TNA_Data_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'TNA Dashboard Data'
  }), []);

  if (!isInitialized) {
    return null;
  }

  return (
    <Box sx={{ p: 1, bgcolor: '#f5f5f5', }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <DateFilters
            dateRange={dateRange}
            onDateChange={handleDateChange}
            isLoading={isLoading}
            onGetData={handleGetData}
            onNewOrder={handleNewOrder}
          />
        </Grid>

        <div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}>
              <CircularProgress />
            </div>
          ) : (
            <ReusableTable
              key="tna-table"
              columnDefs={columnDefs}
              rowData={rows}
              height="100%"
              theme="ag-theme-quartz"
              isDarkMode={false}
              pagination={true}
              paginationPageSize={100}
              paginationPageSizeSelector={[100, 250, 500, 1000]}
              quickFilter={true}
              quickFilterPlaceholder="Search orders..."
              onRowDoubleClick={handleRowDoubleClick}
              onSelectionChanged={handleSelectionChanged}
              loading={isLoading}
              enableExport={true}
              exportSelectedOnly={true}
              selectedRows={selectedRows}
              enableCheckbox={true}
              compactMode={true}
              rowHeight={28}
              headerHeight={36}
              defaultColDef={defaultColDef}
              customGridOptions={customGridOptions}
              exportParams={exportParams}
            />
          )}

        </div>
      </Grid>
    </Box>
  );
});

export default Tnatable;