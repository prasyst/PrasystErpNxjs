'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Autocomplete,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import ReusableTable, { getCustomDateFilter } from '../../datatable/ReusableTable';

const calculateDelay = (estDate, actDate) => {
  if (!estDate || !actDate) return null;
  if (estDate === '1900-01-01T00:00:00' || actDate === '1900-01-01T00:00:00') return null;
  if (estDate === '1899-12-31T00:00:00' || actDate === '1899-12-31T00:00:00') return null;
  if (estDate === '1899-12-30T00:00:00' || actDate === '1899-12-30T00:00:00') return null;
  
  const est = new Date(estDate);
  const act = new Date(actDate);
  
  if (isNaN(est) || isNaN(act)) return null;
  
  const diffTime = act - est;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};


const formatDate = (dateValue) => {
  if (!dateValue || dateValue === '1900-01-01T00:00:00' || 
      dateValue === '1899-12-31T00:00:00' || dateValue === '1899-12-30T00:00:00') {
    return '-';
  }
  return new Date(dateValue).toLocaleDateString('en-GB');
};

const createOperationColumns = (operationName, estField, actField) => {
  let displayName = operationName;

  const nameMapping = {
    'Cutting & Sewing': 'Cutting',
    'Washing': 'Washing',
    'Reversing': 'Reversing',
    'Pressing': 'Pressing',
    'Pairing': 'Pairing',
    'Packing': 'Packing',
    'Rosso': 'Rosso',
    'Thumb Stitching': 'Thumb'
  };

  const shortName = nameMapping[operationName] || operationName;
  
  return [
    {
      field: estField,
      headerName: `${shortName} (EST)`,
      width: 150,
      minWidth: 150,  
      maxWidth: 300,  
      flex: 0, 
      filter: 'agDateColumnFilter',
      filterParams: {
        browserDatePicker: true,
        filterOptions: ['equals', 'notEqual', 'lessThan', 'greaterThan', 'inRange', 'empty', 'notEmpty'],
        customOptionLabel: 'Custom Dates',
        customFilter: getCustomDateFilter()
      },
      sortable: true,
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      field: actField,
      headerName: `${shortName} (ACT)`,
      width: 150,
      minWidth: 150,  
      maxWidth: 300, 
      flex: 0, 
      filter: 'agDateColumnFilter',
      filterParams: {
        browserDatePicker: true,
        filterOptions: ['equals', 'notEqual', 'lessThan', 'greaterThan', 'inRange', 'empty', 'notEmpty'],
        customOptionLabel: 'Custom Dates',
        customFilter: getCustomDateFilter()
      },
      sortable: true,
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      field: `${operationName}_DELAY`,
      headerName: `${shortName} (Delay)`,
      width: 140,
      minWidth: 140,  
      maxWidth: 200, 
      flex: 0, 
      filter: 'agNumberColumnFilter',
      sortable: true,
      cellStyle: (params) => {
        if (params.value > 0) {
          return { backgroundColor: '#ffebee', color: '#c62828', fontWeight: 'bold' };
        } else if (params.value < 0) {
          return { backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold' };
        } else if (params.value === 0) {
          return { backgroundColor: '#fff3e0', color: '#ed6c02', fontWeight: 'bold' };
        }
        return {};
      },
      valueFormatter: (params) => {
        if (params.value === null || params.value === undefined) return '-';
        if (params.value > 0) return `+${params.value} days`;
        if (params.value < 0) return `${params.value} days`;
        return 'On Time';
      }
    }
  ];
};

const columnDefs = [
  {
    field: "TNA_KEY",
    headerName: "TNA KEY",
    width: 120,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    pinned: 'left',
    cellStyle: {
      color: '#2e7d32',
      fontWeight: 'bold',
      backgroundColor: '#e8f5e9'
    }
  },
  {
    field: "TNA_NO",
    headerName: "TNA NO",
    width: 100,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    pinned: 'left',
    cellStyle: {
      color: '#ef8e3f',
      fontWeight: 'bold',
      backgroundColor: '#e8f5e9'
    }
    
  },
  {
    field: "ORDBK_KEY",
    headerName: "ORDER KEY",
    width: 140,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    pinned: 'left',
    cellStyle: {
      color: '#b47913',
      fontWeight: 'bold',
      backgroundColor: '#e8f5e9'
    }
  },
  {
    field: "FGSTYLE_CODE",
    headerName: "STYLE CODE",
    width: 120,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    pinned: 'left',
    cellStyle: {
      color: '#d7683d',
      fontWeight: 'bold',
      backgroundColor: '#e8f5e9'
    }
  },
  {
    field: "FGSHADE_NAME",
    headerName: "SHADE",
    width: 140,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "STYSIZE_NAME",
    headerName: "SIZE",
    width: 100,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "FGTYPE_NAME",
    headerName: "TYPE",
    width: 120,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "FGPTN_NAME",
    headerName: "PATTERN",
    width: 120,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },

  ...createOperationColumns('Cutting', 'S-Cutting & Sewing_EST', 'S-Cutting & Sewing_ACT'),
  ...createOperationColumns('Washing', 'S-Washing_EST', 'S-Washing_ACT'),
  ...createOperationColumns('Reversing', 'S-Reversing_EST', 'S-Reversing_ACT'),
  ...createOperationColumns('Pressing', 'S-Pressing_EST', 'S-Pressing_ACT'),
  ...createOperationColumns('Pairing', 'S-Pairing_EST', 'S-Pairing_ACT'),
  ...createOperationColumns('Packing', 'S-Packing_EST', 'S-Packing_ACT'),
  ...createOperationColumns('Rosso', 'S-Rosso_EST', 'S-Rosso_ACT'),
  ...createOperationColumns('Thumb', 'S-Thumb Stitching_EST', 'S-Thumb Stitching_ACT')
];

export default function TNAReport() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [cobrid, setCobrid] = useState('');
  const [fcyr, setFcyr] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [partySearchResults, setPartySearchResults] = useState([]);
  const [partyDtls, setPartyDtls] = useState([]);
  const [form, setForm] = useState({
    PARTY_KEY: "",
    PARTYDTL_ID: "",
    PARTY_NAME: ""
  });
  const [summaryStats, setSummaryStats] = useState({
    totalRecords: 0,
    uniqueOrders: 0,
    uniqueStyles: 0,
    totalDelayedOperations: 0,
    avgDelayDays: 0
  });

  useEffect(() => {
    setIsClient(true);
    setCobrid(localStorage.getItem('COBR_ID') || '');
    setFcyr(localStorage.getItem('FCYR_KEY') || '');
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchPartiesByName();
    }
  }, [isClient]);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

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

  const fetchPartyDetails = async (partyKey) => {
    try {
      const response = await axiosInstance.post("Party/GetPartyDtl_By_PartyKey", {
        PARTY_KEY: partyKey
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setPartyDtls(response.data.DATA);
      } else {
        setPartyDtls([]);
      }
    } catch (error) {
      console.error("Error fetching party details:", error);
      setPartyDtls([]);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchPartiesByName, 300), []);


  const processRowsWithDelays = useCallback((data) => {
    const operations = [
      { est: 'S-Cutting & Sewing_EST', act: 'S-Cutting & Sewing_ACT', name: 'Cutting_DELAY' },
      { est: 'S-Washing_EST', act: 'S-Washing_ACT', name: 'Washing_DELAY' },
      { est: 'S-Reversing_EST', act: 'S-Reversing_ACT', name: 'Reversing_DELAY' },
      { est: 'S-Pressing_EST', act: 'S-Pressing_ACT', name: 'Pressing_DELAY' },
      { est: 'S-Pairing_EST', act: 'S-Pairing_ACT', name: 'Pairing_DELAY' },
      { est: 'S-Packing_EST', act: 'S-Packing_ACT', name: 'Packing_DELAY' },
      { est: 'S-Rosso_EST', act: 'S-Rosso_ACT', name: 'Rosso_DELAY' },
      { est: 'S-Thumb Stitching_EST', act: 'S-Thumb Stitching_ACT', name: 'Thumb Stitching_DELAY' }
    ];

    let totalDelay = 0;
    let delayCount = 0;

    const processedData = data.map((row, index) => {
      const newRow = { id: index, ...row };
      
      operations.forEach(op => {
        const delay = calculateDelay(row[op.est], row[op.act]);
        newRow[op.name] = delay;
        
        if (delay !== null && delay > 0) {
          totalDelay += delay;
          delayCount++;
        }
      });
      
      return newRow;
    });

    return { processedData, totalDelay, delayCount };
  }, []);

  const fetchTNAReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = {
        "FLAG": "",
        "FCYR_KEY": fcyr || "25",
        "COBR_ID": cobrid || "02"
      };

      const response = await axiosInstance.post('/TNA/TNARPT', payload);

      const { STATUS, DATA, MESSAGE } = response.data;
      
      if (STATUS === 0 && DATA && DATA.TNARPT && Array.isArray(DATA.TNARPT)) {
        const { processedData, totalDelay, delayCount } = processRowsWithDelays(DATA.TNARPT);
        
        setRows(processedData);

        const uniqueOrders = new Set(processedData.map(item => item.ORDBK_KEY)).size;
        const uniqueStyles = new Set(processedData.map(item => item.FGSTYLE_CODE)).size;
        
        setSummaryStats({
          totalRecords: processedData.length,
          uniqueOrders: uniqueOrders,
          uniqueStyles: uniqueStyles,
          totalDelayedOperations: delayCount,
          avgDelayDays: delayCount > 0 ? (totalDelay / delayCount).toFixed(1) : 0
        });
      } else {
        console.error('Error fetching TNA report:', MESSAGE);
        setRows([]);
        setSummaryStats({
          totalRecords: 0,
          uniqueOrders: 0,
          uniqueStyles: 0,
          totalDelayedOperations: 0,
          avgDelayDays: 0
        });
      }
    } catch (error) {
      console.error('Error fetching TNA report:', error);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [fcyr, cobrid, processRowsWithDelays]);

  useEffect(() => {
    if (cobrid && fcyr) {
      fetchTNAReport();
    }
  }, [fetchTNAReport, cobrid, fcyr]);

  const handleRefresh = () => {
    fetchTNAReport();
  };

  const handleRowClick = useCallback((event) => {
    console.log('Row clicked:', event.data);
  }, []);

  const handleRowDoubleClick = useCallback((event) => {
    console.log('Row double clicked:', event.data);
  }, []);

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
    console.log('Selected rows:', selectedData);
  }, []);

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handlePrint = () => {
    window.print();
  };

  

  return (
    <Grid className="p-2 w-full">
      <Grid className="w-full mx-auto" style={{ maxWidth: '100%' }}>
        <Box sx={{ width: "100%", px: 2, }}>
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold', 
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap'
            }}>
              📊 TNA Report
              <Chip 
                label={`${summaryStats.totalRecords} Records`} 
                size="small" 
                sx={{ ml: 1, backgroundColor: '#e3f2fd' }}
              />
              <Chip 
                label={`${summaryStats.totalDelayedOperations} Delays`} 
                size="small" 
                sx={{ ml: 1, backgroundColor: '#ffebee', color: '#c62828' }}
              />
              <Chip 
                label={`Avg Delay: ${summaryStats.avgDelayDays} days`} 
                size="small" 
                sx={{ ml: 1, backgroundColor: '#fff3e0', color: '#ed6c02' }}
              />
            </Typography>
            
            {/* <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} sx={{ color: '#39ace2' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export">
                <IconButton onClick={handleExport} sx={{ color: '#39ace2' }}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint} sx={{ color: '#39ace2' }}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            </Box> */}
          </Box>
        </Box>

        <Grid style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
          {isLoading ? (
            <Grid style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}>
              <CircularProgress />
            </Grid>
          ) : (
            <ReusableTable
              columnDefs={columnDefs}
              rowData={rows}
              height="100%"
              theme="ag-theme-quartz"
              isDarkMode={false}
              pagination={true}
              paginationPageSize={25}
              paginationPageSizeSelector={[25, 50, 100, 250, 500, 1000]}
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
               headerHeight={34}
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
                fileName: 'TNA_Report',
                sheetName: 'TNA Report'
              }}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}