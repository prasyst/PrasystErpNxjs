'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  CircularProgress,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axiosInstance from '@/lib/axios';
import { format } from "date-fns";
import ReusableTable, { getCustomDateFilter } from '../../../../components/datatable/ReusableTable';

const PickOrderModal = ({ open, onClose, onConfirm, formData, companyConfig }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for dropdown options
  const [partyOptions, setPartyOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [orderTypeOptions, setOrderTypeOptions] = useState([]);
  
  // Selected values for API call
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedOrderType, setSelectedOrderType] = useState('1');
  const [editableQuantities, setEditableQuantities] = useState({});
  // State for mappings
  const [partyMapping, setPartyMapping] = useState({});
  const [branchMapping, setBranchMapping] = useState({});
  const [orderTypeMapping, setOrderTypeMapping] = useState({});

  // Column definitions for ReusableTable
  const columnDefs = useMemo(() => [
    {
      headerName: '',
      field: 'select',
      width: 50,
      maxWidth: 40,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      lockPosition: true,
      suppressMenu: true,
      sortable: false,
      filter: false,
      resizable: false,
      pinned: 'left',
    },
    {
      field: "ORDBK_NO",
      headerName: "Order No",
      width: 90,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true,
      pinned: 'left',
    },
    {
      field: "ORDBK_DT",
      headerName: "Order Date",
      width: 120,
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
        customFilter: getCustomDateFilter()
      },
      sortable: true,
      valueFormatter: (params) => {
        if (params.value) {
          return params.value;
        }
        return '';
      }
    },
   
    {
      field: "FGPRD_NAME",
      headerName: "Product",
      width: 200,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true,
      cellRenderer: (params) => {
        return params.value || '—';
      }
    },
    {
      field: "FGSTYLE_NAME",
      headerName: "Style",
      width: 150,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true,
      cellRenderer: (params) => {
        return params.value || '—';
      }
    },
    {
      field: "FGTYPE_NAME",
      headerName: "Type",
      width: 100,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "FGSHADE_NAME",
      headerName: "Shade",
      width: 100,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "BAL_QTY",
      headerName: "Bal Qty",
      width: 100,
      filter: 'agNumberColumnFilter',
      sortable: true,
      type: 'rightAligned',
      valueFormatter: (params) => {
        if (params.value != null) {
          return params.value.toFixed(2);
        }
        return '0';
      },
      cellStyle: { textAlign: 'right' }
    },
    {
      field: "READY_QTY",
      headerName: "Ready",
      width: 80,
      filter: 'agNumberColumnFilter',
      sortable: true,
      type: 'rightAligned',
      valueFormatter: (params) => {
        if (params.value != null) {
          return params.value.toFixed(2);
        }
        return '0';
      },
      cellStyle: (params) => {
        if (params.value > 0) {
          return { 
            textAlign: 'right', 
            backgroundColor: '#e8f5e9', 
            fontWeight: 'bold',
            color: '#2e7d32'
          };
        }
        return { textAlign: 'right' };
      },
      cellRenderer: (params) => {
        if (params.value > 0) {
          return (
            <span style={{ 
              backgroundColor: '#e8f5e9', 
              padding: '2px 8px', 
              borderRadius: '12px',
              fontWeight: 'bold',
              color: '#2e7d32',
              display: 'inline-block'
            }}>
              {params.value}
            </span>
          );
        }
        return params.value || 0;
      }
    },
    {
      field: "RATE",
      headerName: "Rate",
      width: 100,
      filter: 'agNumberColumnFilter',
      sortable: true,
      type: 'rightAligned',
      valueFormatter: (params) => {
        if (params.value != null) {
          return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(params.value);
        }
        return '0';
      },
      cellStyle: { textAlign: 'right' }
    },
    {
      field: "NET_AMOUNT",
      headerName: "Net Amount",
      width: 130,
      filter: 'agNumberColumnFilter',
      sortable: true,
      type: 'rightAligned',
      valueFormatter: (params) => {
        if (params.value != null) {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
          }).format(params.value);
        }
        return '₹0';
      },
      cellStyle: { textAlign: 'right' }
    },
    {
      field: "PORD_REF",
      headerName: "PORD Ref",
      width: 150,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
   
    {
      field: "SHORTAGE",
      headerName: "Shortage",
      width: 100,
      filter: 'agNumberColumnFilter',
      sortable: true,
      type: 'rightAligned',
      valueFormatter: (params) => {
        if (params.value != null) {
          return params.value.toFixed(2);
        }
        return '0';
      },
      cellStyle: (params) => {
        if (params.value < 0) {
          return { textAlign: 'right', backgroundColor: '#ffebee', color: '#c62828' };
        }
        return { textAlign: 'right' };
      }
    }
  ], []);

  // Fetch Party Data
  const fetchPartiesByName = async (name = "") => {
    try {
      const response = await axiosInstance.post("Party/GetParty_By_Name", {
        PARTY_NAME: name
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const parties = response.data.DATA.map(item => item.PARTY_NAME || '');
        setPartyOptions(parties);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.PARTY_NAME && item.PARTY_KEY) {
            mapping[item.PARTY_NAME] = item.PARTY_KEY;
          }
        });
        setPartyMapping(mapping);
      }
    } catch (error) {
      console.error("API error", error);
    }
  };

  useEffect(() => {
  const initialQty = {};
  selectedRows.forEach(row => {
    initialQty[row.id] = row.READY_QTY || 0;
  });
  setEditableQuantities(initialQty);
}, [selectedRows]);

  // Fetch Party Branches
  const fetchPartyDetails = async (partyKey) => {
    if (!partyKey) return;
    
    try {
      const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
        PARTY_KEY: partyKey
      });
      
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const branches = response.data.DATA.map(item => item.PLACE || '');
        setBranchOptions(branches);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.PLACE && item.PARTYDTL_ID) {
            mapping[item.PLACE] = item.PARTYDTL_ID;
          }
        });
        setBranchMapping(mapping);
      }
    } catch (error) {
      console.error("Error fetching party details:", error);
    }
  };

  // Fetch Order Type Data
  const fetchOrderTypeData = async () => {
    try {
      const payload = {
        "ORDBK_KEY": "",
        "FLAG": "ORDTYPE",
        "FCYR_KEY": "25",
        "COBR_ID": "02",
        "PageNumber": 1,
        "PageSize": 25,
        "SearchText": "",
        "PARTY_KEY": "",
        "PARTYDTL_ID": 0
      };
      
      const response = await axiosInstance.post('/ORDBK/GetOrdbkDrp', payload);
      
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const orderTypes = response.data.DATA.map(item => item.ORDBK_TYPE_NM || '');
        setOrderTypeOptions(orderTypes);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.ORDBK_TYPE_NM && item.ORDBK_TYPE) {
            mapping[item.ORDBK_TYPE_NM] = item.ORDBK_TYPE;
          }
        });
        setOrderTypeMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching order type data:', error);
    }
  };

  // Fetch Order Data
  const fetchOrderData = useCallback(async () => {
    if (!selectedParty || !selectedBranch) {
      setOrderData([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const partyKey = partyMapping[selectedParty] || formData.PARTY_KEY;
      const partyDtlId = branchMapping[selectedBranch] || formData.PARTYDTL_ID;
      
      const payload = {
        "FCYR_KEY": "25",
        "COBR_ID": companyConfig?.COBR_ID || "02",
        "PARTY_KEY": partyKey,
        "PARTYDTL_ID": partyDtlId,
        "ORDBK_TYPE": selectedOrderType,
        "DISTBTR_KEY": "",
        "CWHAER": ""
      };
      
      const response = await axiosInstance.post('/ORDBK/PickOrder', payload);
      
      if (response.data.DATA && response.data.DATA.length > 0) {
        // Process and format the data
        const formattedData = response.data.DATA.map((item, index) => ({
          id: index,
          ORDBK_NO: item.ORDBK_NO || '',
          ORDBK_DT: item.ORDBK_DT ? format(new Date(item.ORDBK_DT), 'dd/MM/yyyy') : '',
          DLV_DT: item.DLV_DT || '',
          FGPRD_NAME: item.FGPRD_NAME || '',
          FGSTYLE_NAME: item.FGSTYLE_NAME || '',
          FGTYPE_NAME: item.FGTYPE_NAME || '',
          FGSHADE_NAME: item.FGSHADE_NAME || '',
          FGPTN_NAME: item.FGPTN_NAME || '',
          BAL_QTY: item.BAL_QTY || 0,
          BAL_SET: item.BAL_SET || 0,
          RATE: item.RATE || 0,
          NET_AMOUNT: item.NET_AMOUNT || 0,
          SHORTAGE: item.SHORTAGE || 0,
          FGPRD_ABRV: item.FGPRD_ABRV || '',
          READY_QTY: item.READY_QTY || 0,
          PORD_REF: item.PORD_REF || '',
          FGPRD_KEY: item.FGPRD_KEY || '',
          FGSTYLE_KEY: item.FGSTYLE_KEY || '',
          FGSTYLE_ID: item.FGSTYLE_ID || 0,
          FGSHADE_KEY: item.FGSHADE_KEY || '',
          ORDBK_KEY: item.ORDBK_KEY || '',
          ORDBKSTY_ID: item.ORDBKSTY_ID || 0,
          SETQTY: item.SETQTY || 0,
          MRP_PRN: item.MRP_PRN || 0,
          ALLOW_QTY: item.ALLOW_QTY || 0,
          ALLOW_SET: item.ALLOW_SET || 0,
          CHK: item.CHK || false
        }));
        setOrderData(formattedData);
      } else {
        setOrderData([]);
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      setOrderData([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedParty, selectedBranch, selectedOrderType, partyMapping, branchMapping, formData, companyConfig]);

  // Initialize with formData values when modal opens
  useEffect(() => {
    if (open) {
      // Set default values from formData
      if (formData.Party && !selectedParty) {
        setSelectedParty(formData.Party);
        if (formData.PARTY_KEY) {
          fetchPartyDetails(formData.PARTY_KEY);
        }
      }
      if (formData.Branch && !selectedBranch) {
        setSelectedBranch(formData.Branch);
      }
      
      // Fetch dropdown data
      fetchPartiesByName();
      fetchOrderTypeData();
    }
  }, [open, formData]);

  // Fetch order data when selections change
  useEffect(() => {
    if (selectedParty && selectedBranch) {
      fetchOrderData();
    } else {
      setOrderData([]);
    }
  }, [selectedParty, selectedBranch, selectedOrderType, fetchOrderData]);

  // Handle party change
  const handlePartyChange = (event, value) => {
    setSelectedParty(value);
    setSelectedBranch(null); // Reset branch when party changes
    setSelectedRows([]); // Clear selected rows
    if (value && partyMapping[value]) {
      fetchPartyDetails(partyMapping[value]);
    }
  };

  // Handle branch change
  const handleBranchChange = (event, value) => {
    setSelectedBranch(value);
    setSelectedRows([]); // Clear selected rows
  };

  // Handle order type change
  const handleOrderTypeChange = (event) => {
    setSelectedOrderType(event.target.value);
    setSelectedRows([]); // Clear selected rows
  };

  // Handle selection changed from ReusableTable
  const handleSelectionChanged = useCallback((event) => {
    if (event && event.api) {
      const selectedNodes = event.api.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      setSelectedRows(selectedData);
    }
  }, []);

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedRows.length > 0) {
      // Transform selected rows to the format expected by Stepper2
      const transformedItems = selectedRows.map(row => ({
        // Main fields for Stepper2 table
        product: row.FGPRD_NAME || row.FGPRD_ABRV || '',
        style: row.FGSTYLE_NAME || '',
        type: row.FGTYPE_NAME || '',
        shade: row.FGSHADE_NAME || '',
        lotNo: row.FGPTN_NAME || '',
        qty: row.BAL_QTY || row.ALLOW_QTY || 0,
        balQty: row.BAL_QTY || 0,
       readyQty: editableQuantities[row.id] || row.READY_QTY || 0,
        rate: row.RATE || 0,
        amount: row.NET_AMOUNT || 0,
        netAmt: row.NET_AMOUNT || 0,
        set: row.SETQTY || 0,
        mrp: row.MRP_PRN || 0,
        orderNo: row.ORDBK_NO || '',
        orderDate: row.ORDBK_DT || '',
        
        // Original data for reference
        originalData: {
          ORDBKSTY_ID: row.ORDBKSTY_ID,
          FGITEM_KEY: '',
          PRODUCT: row.FGPRD_NAME || row.FGPRD_ABRV || '',
          STYLE: row.FGSTYLE_NAME || '',
          TYPE: row.FGTYPE_NAME || '',
          SHADE: row.FGSHADE_NAME || '',
          PATTERN: row.FGPTN_NAME || '',
          ITMQTY: row.BAL_QTY || row.ALLOW_QTY || 0,
          MRP: row.MRP_PRN || 0,
          ITMRATE: row.RATE || 0,
          ITMAMT: row.NET_AMOUNT || 0,
          DLV_VAR_PERC: 0,
          DLV_VAR_QTY: 0,
          DISC_AMT: 0,
          NET_AMT: row.NET_AMOUNT || 0,
          DISTBTR: "",
          SETQTY: row.SETQTY || 0,
          ORDBKSTYSZLIST: [],
          FGPRD_KEY: row.FGPRD_KEY || '',
          FGSTYLE_ID: row.FGSTYLE_ID || 0,
          FGSTYLE_KEY: row.FGSTYLE_KEY || '',
          FGTYPE_KEY: '',
          FGSHADE_KEY: row.FGSHADE_KEY || '',
          FGPTN_KEY: '',
          DBFLAG: 'I'
        },
        
        // Keys for mapping
        FGPRD_KEY: row.FGPRD_KEY || '',
        FGSTYLE_ID: row.FGSTYLE_ID || 0,
        FGSTYLE_KEY: row.FGSTYLE_KEY || '',
        FGSHADE_KEY: row.FGSHADE_KEY || '',
        ORDBK_KEY: row.ORDBK_KEY || '',
        ORDBKSTY_ID: row.ORDBKSTY_ID || 0,
        
        // For size details (if needed)
        sizeDetails: []
      }));
      
      onConfirm(transformedItems);
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        sx: {
          height: '95vh',
          maxHeight: '95vh',
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 1.5 }}>
        <Typography variant="h6" fontWeight="bold">Pick from Order</Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        {/* Selection Filters */}
        {/* <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Autocomplete
              id="party-autocomplete"
              options={partyOptions}
              getOptionLabel={(option) => option || ''}
              value={selectedParty}
              onChange={handlePartyChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Party *"
                  variant="outlined"
                  size="small"
                  required
                />
              )}
              sx={{ width: '100%' }}
            />
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Autocomplete
              id="branch-autocomplete"
              options={branchOptions}
              getOptionLabel={(option) => option || ''}
              value={selectedBranch}
              onChange={handleBranchChange}
              disabled={!selectedParty}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Branch *"
                  variant="outlined"
                  size="small"
                  required
                />
              )}
              sx={{ width: '100%' }}
            />
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 150 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Order Type</InputLabel>
              <Select
                value={selectedOrderType}
                onChange={handleOrderTypeChange}
                label="Order Type"
              >
                <MenuItem value="1">Sales Order</MenuItem>
                <MenuItem value="2">Work Order</MenuItem>
                <MenuItem value="0">All</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box> */}
        
        {/* Info message when no party/branch selected */}
        {(!selectedParty || !selectedBranch) && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
            <Typography variant="body2" color="warning.main">
              Please select Party and Branch to load orders
            </Typography>
          </Box>
        )}
        
        {/* Results Table using ReusableTable */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 'calc(100% - 120px)', minHeight: 500, width: '100%' }}>
            <ReusableTable
              columnDefs={columnDefs}
              rowData={orderData}
              height="100%"
              theme="ag-theme-quartz"
              isDarkMode={false}
              pagination={true}
              paginationPageSize={25}
              paginationPageSizeSelector={[25, 50, 100, 250, 500]}
              quickFilter={true}
              onSelectionChanged={handleSelectionChanged}
              enableExport={false}
              enableCheckbox={true}
              compactMode={true}
              rowHeight={20}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
                flex: 1,
                minWidth: 80
              }}
              customGridOptions={{
                suppressRowClickSelection: false,
                rowSelection: 'multiple',
                animateRows: true,
                enableCellTextSelection: true,
                ensureDomOrder: true,
                overlayNoRowsTemplate: selectedParty && selectedBranch 
                  ? 'No orders found for the selected criteria' 
                  : 'Please select Party and Branch to load orders'
              }}
              enableResetButton={false}
              enableExitBackButton={false}
            />
          </Box>
        )}
        
        {/* Summary of selected rows */}
        {selectedRows.length > 0 && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Selected Items Summary ({selectedRows.length} items):
            </Typography>
            <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#e0e0e0' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>Order No</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>Style</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Bal Qty</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Ready Qty</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Rate</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRows.map((row, idx) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '4px 8px' }}>{row.ORDBK_NO}</td>
                      <td style={{ padding: '4px 8px' }}>{row.FGSTYLE_NAME}</td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>{row.BAL_QTY}</td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>
  <TextField
    type="number"
    value={editableQuantities[row.id] || 0}
    size="small"
    onChange={(e) => {
      const newValue = parseFloat(e.target.value) || 0;
      setEditableQuantities(prev => ({
        ...prev,
        [row.id]: newValue
      }));
      // Also update the row in selectedRows
      setSelectedRows(prev => prev.map(r => 
        r.id === row.id ? { ...r, READY_QTY: newValue } : r
      ));
    }}
    sx={{ width: '80px' }}
    inputProps={{ style: { fontSize: '0.7rem', padding: '4px' }, min: 0 }}
  />
</td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>{row.RATE}</td>
                      <td style={{ padding: '4px 8px', textAlign: 'right' }}>₹{row.NET_AMOUNT?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: '#e8f5e9', fontWeight: 'bold' }}>
                    <td colSpan={2} style={{ padding: '6px 8px' }}>Total</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                      {selectedRows.reduce((sum, row) => sum + (row.BAL_QTY || 0), 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                      ₹{selectedRows.reduce((sum, row) => sum + (row.NET_AMOUNT || 0), 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="primary"
          disabled={selectedRows.length === 0}
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': { backgroundColor: '#45a049' }
          }}
        >
          Done ({selectedRows.length} items selected)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PickOrderModal;