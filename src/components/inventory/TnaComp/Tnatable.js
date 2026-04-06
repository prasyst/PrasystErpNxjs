'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Autocomplete,
  Grid,
  Paper
} from "@mui/material";
import axiosInstance from '../../../lib/axios';
import { useRouter } from 'next/navigation';

import ReusableTable, { getCustomDateFilter } from '../../datatable/ReusableTable';



const getStatusChip = (status) => {
  if (!status) return <span>-</span>;
 
  const statusColorMap = {
    'Complete': '#4caf50',    
    'Pending': '#ff9800', 
    'Partial': '#c9b90b'      
  };
  
  const backgroundColor = statusColorMap[status] || '#757575';
  const textColor = '#ffffff';

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <span style={{
        backgroundColor: backgroundColor,
        color: textColor,
        padding: '0px 12px', 
        fontSize: '12px',
        fontWeight: 500,
        display: 'inline-block',
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }}>
        {status}
      </span>
    </div>
  );
};


const columnDefs = [
    {
    field: "PARTY_NAME",
    headerName: "PARTY NAME",
    width: 200,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "ORDBK_KEY",
    headerName: "ORDBK_KEY",
    width: 130,
    maxWidth: 140,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true, 
    },
    sortable: true
  },

  {
    field: "ORDER_Date",
    headerName: "ORDER DATE",
    width: 130,
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
    headerName: "DELIVERY DT",
    width: 130,
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
    headerName: "TOTALCOUNT",
    width: 140,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true, 
    },
    sortable: true
  },
  {
    field: "BOMSOCKS_ST",
    headerName: "BOMSOCKS STATUS",
    width: 120,
    maxWidth: 130,
   filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
      cellRenderer: (params) => {
      return getStatusChip(params.value);
    }
  
  },
  {
    field: "TNA_ST",
    headerName: "TNA STATUS",
    width: 130,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
     cellRenderer: (params) => {
      return getStatusChip(params.value);
    }
  },
 
  
];

export default function Tnatable() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [partySearchResults, setPartySearchResults] = useState([]);
  const [isCustomer, setIsCustomer] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [cobrid, setCobrid] = useState('');
  const [fcyr, setFcyr] = useState('');
  const [clientId, setClientId] = useState('')
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState()
  const [form, setForm] = useState({
    PARTY_KEY: "",
    PARTYDTL_ID: "",
    PARTY_NAME: ""
  });
  const [rows, setRows] = useState([]);
  

  const [dateRange, setDateRange] = useState({
    FROM_DT: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    To_DT: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    setIsClient(true);
    setCobrid(localStorage.getItem('COBR_ID') || '');
    setFcyr(localStorage.getItem('FCYR_KEY') || '');
    setClientId(localStorage.getItem('CLIENT_ID') || '');
    setUserId(localStorage.getItem('USER_ID') || '')
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchPartiesByName();
    }
  }, [isClient]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'customer') {
      setIsCustomer(true);
      const storedPartyName = localStorage.getItem('PARTY_NAME');
      const storedPartyKey = localStorage.getItem('PARTY_KEY');
      setForm(prev => ({
        ...prev,
        PARTY_KEY: storedPartyKey || "",
        PARTYDTL_ID: "",
      }));
      setPartyName(storedPartyName || "");
    }
    fetchPartiesByName();
  }, []);

  const fetchPartiesByName = async (name = "") => {
    try {
      const response = await axiosInstance.post("Party/GetParty_By_Name", {
        PARTY_NAME: name
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setPartySearchResults(response.data.DATA);
      } else {
        setPartySearchResults([]);
      }
    } catch (error) {
      console.error("API error", error);
      setPartySearchResults([]);
    }
  };

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/TNA/GetTNADashTNAData`, {
        "FLAG": "",
        "FCYR_KEY": fcyr,
        "COBR_ID": cobrid,
        "PARTY_KEY": form.PARTY_KEY,
        "PARTYDTL_ID": 0,
        "ORDBK_KEY": "",
        "FROM_DT": dateRange.FROM_DT,
        "To_DT": dateRange.To_DT
      });

      const { data: { STATUS, DATA } } = response;
      if (STATUS === 0 && Array.isArray(DATA)) {
        const formattedData = DATA.map((row, index) => ({
          id: index,
          ...row,
          ORDER_Date: row.ORDBK_DT ? new Date(row.ORDBK_DT) : null,
          DLV_DT: row.DLV_DT ? new Date(row.DLV_DT) : null
        }));
        setRows(formattedData);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [form.PARTY_KEY, fcyr, cobrid, dateRange.FROM_DT, dateRange.To_DT]);



  const handleGetData = () => {
    fetchTableData();
  };

  const handleDateChange = (field) => (event) => {
    setDateRange(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleRowClick = useCallback((event) => {
    console.log('Row clicked:', event.data);
  }, []);

const handleRowDoubleClick = useCallback((event) => {
  const rowData = event.data;
//   if (rowData && rowData.ORDBK_KEY) {
    router.push(`/tnapage/tnadetailestable`);
//   }
}, [router]);

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
    console.log('Selected rows:', selectedData);
  }, []);

  return (
    <Grid className="p-2 w-full">
      <Grid className="w-full mx-auto" style={{ maxWidth: '100%' }}>
        <Paper elevation={2} sx={{ p: 1, mb: 1,ml:2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12 ,md:2.5}} >
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={dateRange.FROM_DT}
                onChange={handleDateChange('FROM_DT')}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 ,md:2.5}}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={dateRange.To_DT}
                onChange={handleDateChange('To_DT')}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={2} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGetData}
                disabled={isLoading}
                sx={{ height: '35px' }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Get Data'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Grid style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
          <ReusableTable
            columnDefs={columnDefs}
            rowData={rows}
            height="100%"
            theme="ag-theme-quartz"
            isDarkMode={false}
            pagination={true}
            paginationPageSize={100}
            paginationPageSizeSelector={[ 100, 250, 500, 1000]}
            quickFilter={true}
            onRowClick={handleRowClick}
            onRowDoubleClick={handleRowDoubleClick}
            onSelectionChanged={handleSelectionChanged}
            loading={isLoading}
            enableExport={true}
            exportSelectedOnly={true}
            selectedRows={selectedRows}
            enableCheckbox={true}
            compactMode={true}
            rowHeight={24}
             headerHeight={30}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              minWidth: 100
            }}
            customGridOptions={{
              suppressRowClickSelection: true,
              rowSelection: 'multiple',
              animateRows: true,
              enableCellTextSelection: true,
              ensureDomOrder: true
            }}
            exportParams={{
              suppressTextAsCDATA: true,
              fileName: 'Order_Details',
              sheetName: 'Order Details'
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}