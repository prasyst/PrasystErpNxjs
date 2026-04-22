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
  Tooltip,
  Paper,
  IconButton,
  Stack,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TimelineIcon from "@mui/icons-material/Timeline";
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


const OperationColorCell = ({ estDate, actDate, operationName }) => {
  const delay = calculateDelay(estDate, actDate);
  

  const getBackgroundColor = () => {
    if (delay === null) return '#f5f5f5'; 
    if (delay > 0) return '#ce2406'; 
    if (delay <= 0) return '#03680b'; 
    return '#f5f5f5';
  };

  const getDelayText = () => {
    if (delay === null) return 'Not Started';
    if (delay > 0) return `Delayed by ${delay} days`;
    if (delay < 0) return `Early by ${Math.abs(delay)} days`;
    return 'On Time';
  };

  const getDelayColor = () => {
    if (delay > 0) return '#c62828';
    if (delay < 0) return '#056c0a';
    if (delay === 0) return '#82400a';
    return '#666';
  };

  const getStatusIcon = () => {
    if (delay > 0) return '🔴';
    if (delay < 0) return '🟢';
    if (delay === 0) return '🟡';
    return '⚪';
  };


  const hoverCard = (
    <Paper
      elevation={4}
      sx={{
        p: 1.5,
        minWidth: 220,
        maxWidth: 280,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 1.5,
        pb: 0.75,
        borderBottom: '2px solid',
        borderColor: getDelayColor(),
      }}>
        <Typography variant="h6" sx={{ 
          fontSize: '1rem', 
          fontWeight: 'bold',
          color: getDelayColor(),
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}>
          {getStatusIcon()} {operationName}
        </Typography>
      </Box>

      <Box sx={{ mb: 0.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
          📅 EST Date
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#333' }}>
          {formatDate(estDate)}
        </Typography>
      </Box>

      <Box sx={{ mb: 0.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
          ✅ ACT Date
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#333' }}>
          {formatDate(actDate)}
        </Typography>
      </Box>
      <Box sx={{ my: 0.75, borderTop: '1px dashed #e0e0e0' }} />

      {/* Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
          📊 Status
        </Typography>
        <Chip
          label={getDelayText()}
          size="small"
          sx={{
            backgroundColor: getDelayColor() === '#c62828' ? '#ffebee' : 
                            getDelayColor() === '#2e7d32' ? '#e8f5e9' :
                            getDelayColor() === '#ed6c02' ? '#fff3e0' : '#f5f5f5',
            color: getDelayColor(),
            fontWeight: 'bold',
            fontSize: '0.7rem',
            height: 22,
          }}
        />
      </Box>
    </Paper>
  );

  return (
    <Tooltip
      title={hoverCard}
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'transparent',
            p: 0,
            maxWidth: 320,
          }
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: getBackgroundColor(),
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 0.5,
          '&:hover': {
            opacity: 0.85,
            transform: 'scale(1.02)',
            boxShadow: 'inset 0 0 0 2px rgba(25,118,210,0.3)',
          }
        }}
      >
 
        <Box sx={{ width: '100%', height: '100%', minHeight: '28px' }} />
      </Box>
    </Tooltip>
  );
};


const createOperationColumns = () => {
  const operations = [
    { name: 'Cutting', estField: 'S-Cutting & Sewing_EST', actField: 'S-Cutting & Sewing_ACT', shortName: 'Cutting' },
    { name: 'Washing', estField: 'S-Washing_EST', actField: 'S-Washing_ACT', shortName: 'Washing' },
    { name: 'Reversing', estField: 'S-Reversing_EST', actField: 'S-Reversing_ACT', shortName: 'Reversing' },
    { name: 'Pressing', estField: 'S-Pressing_EST', actField: 'S-Pressing_ACT', shortName: 'Pressing' },
    { name: 'Pairing', estField: 'S-Pairing_EST', actField: 'S-Pairing_ACT', shortName: 'Pairing' },
    { name: 'Packing', estField: 'S-Packing_EST', actField: 'S-Packing_ACT', shortName: 'Packing' },
    { name: 'Rosso', estField: 'S-Rosso_EST', actField: 'S-Rosso_ACT', shortName: 'Rosso' },
    { name: 'Thumb Stitching', estField: 'S-Thumb Stitching_EST', actField: 'S-Thumb Stitching_ACT', shortName: 'Thumb' }
  ];

  return operations.map(op => ({
    field: `${op.name}_OPERATION_COLOR`,
    headerName: op.shortName,
    width: 100,
    minWidth: 100,
    maxWidth: 100,
    flex: 0,
    sortable: true,
    cellRenderer: (params) => {
      if (!params.data) return null;
      return React.createElement(OperationColorCell, {
        estDate: params.data[op.estField],
        actDate: params.data[op.actField],
        operationName: op.shortName
      });
    },
    comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {

      const getDelayForNode = (node) => {
        if (!node || !node.data) return null;
        const opData = operations.find(op => `${op.name}_OPERATION_COLOR` === node.colDef.field);
        if (!opData) return null;
        return calculateDelay(node.data[opData.estField], node.data[opData.actField]);
      };
      
      const delayA = getDelayForNode(nodeA);
      const delayB = getDelayForNode(nodeB);
      
      if (delayA === null && delayB === null) return 0;
      if (delayA === null) return 1;
      if (delayB === null) return -1;
      return delayA - delayB;
    },
    cellStyle: {
      padding: 0,
      textAlign: 'center'
    }
  }));
};

const columnDefs = [
 
  {
    field: "TNA_NO",
    headerName: "TNA NO",
    width: 110,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    cellStyle: {
      fontWeight: 'bold',
      backgroundColor: '#e8f5e9'
    }
  },
  {
    field: "FGSTYLE_CODE",
    headerName: "STYLE CODE",
    width: 130,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    cellStyle: {
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
    width: 130,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "FGPTN_NAME",
    headerName: "PATTERN",
    width: 130,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  ...createOperationColumns()
];

const StatCard = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.02)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 20px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ color: alpha('#000', 0.6), fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: color, lineHeight: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: alpha('#000', 0.5), mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Stack>
          <Box
            sx={{
              backgroundColor: alpha(color, 0.12),
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

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

 

  return (
    <Box sx={{ p: 2, backgroundColor: '#f8fafc', minHeight: '100vh',fontFamily: `'Poppins', 'Roboto', sans-serif`  }}>
      <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
        
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
            <Stack spacing={1}>
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                TNA Report
              </Typography>
             
            </Stack>
          </Stack>
      


        <Grid container spacing={2.5} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard
              title="Total Records"
              value={summaryStats.totalRecords.toLocaleString()}
              icon={<VisibilityIcon sx={{ color: '#1976d2', fontSize: 28 }} />}
              color="#1976d2"
              subtitle="Production lines"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard
              title="Unique Orders"
              value={summaryStats.uniqueOrders.toLocaleString()}
              icon={<TimelineIcon sx={{ color: '#0288d1', fontSize: 28 }} />}
              color="#0288d1"
              subtitle="Active orders"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard
              title="Unique Styles"
              value={summaryStats.uniqueStyles.toLocaleString()}
              icon={<CheckCircleIcon sx={{ color: '#388e3c', fontSize: 28 }} />}
              color="#388e3c"
              subtitle="Distinct styles"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard
              title="Delayed Ops"
              value={summaryStats.totalDelayedOperations.toLocaleString()}
              icon={<WarningAmberIcon sx={{ color: '#ed6c02', fontSize: 28 }} />}
              color="#ed6c02"
              subtitle="Operations delayed"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <StatCard
              title="Avg Delay"
              value={`${summaryStats.avgDelayDays}d`}
              icon={<TimelineIcon sx={{ color: '#d32f2f', fontSize: 28 }} />}
              color="#d32f2f"
              subtitle="Average delay period"
            />
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
         
          <Box sx={{ height: 'calc(100vh - 220px)', width: '100%' }}>
            {isLoading ? (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flexDirection: 'column',
                gap: 2,
              }}>
                <CircularProgress size={48} thickness={4} />
                <Typography variant="body2" color="text.secondary">
                  Loading TNA Report Data...
                </Typography>
              </Box>
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
                rowHeight={22}
                headerHeight={35}
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                  filter: true,
                  flex: 1,
                  minWidth: 100,
                  cellStyle: {
                    fontSize: '12px'
                  }
                }}
                customGridOptions={{
                  suppressRowClickSelection: true,
                  rowSelection: 'multiple',
                  animateRows: true,
                  enableCellTextSelection: true,
                  ensureDomOrder: true,
                }}
                exportParams={{
                  suppressTextAsCDATA: true,
                  fileName: 'TNA_Report',
                  sheetName: 'TNA Report',
                }}
              />
            )}
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            TNA Report | © {new Date().getFullYear()} All rights reserved
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}