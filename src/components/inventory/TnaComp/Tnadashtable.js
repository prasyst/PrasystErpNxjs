
'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from '../../../lib/axios';
import { useRouter,useSearchParams } from 'next/navigation';
import RestoreIcon from '@mui/icons-material/Restore';
import ReusableTable, { getCustomDateFilter } from '../../datatable/ReusableTable';




const getStatusChip = (status) => {
  if (!status) return <span style={{ color: '#999' }}>-</span>;

  const statusColorMap = {
    'Yes': { bg: '#4caf50', text: '#ffffff' },
    'Pending': { bg: '#ff9800', text: '#ffffff' },
    'No': { bg: '#f44336', text: '#ffffff' },
    'In Progress': { bg: '#2196f3', text: '#ffffff' },
    'Cancelled': { bg: '#9e9e9e', text: '#ffffff' }
  };

  const colors = statusColorMap[status] || { bg: '#757575', text: '#ffffff' };

  return (
    <div style={{ display: 'flex', alignItems: 'center',justifyContent: 'center', height: '100%', }}>
      <span style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '0px 6px',
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

const columnDefs = [
  {
    headerName: "Select",
    width: 50,
    maxWidth: 40,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    // pinned: 'left',
    lockPosition: true,
    suppressMenu: true,
    sortable: false,
    filter: false,
    resizable: false,

    headerClass: 'checkbox-header'
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
    field: "FGPRD_NAME",
    headerName: "PRODUCT NAME",
    width: 160,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "STYSIZE_NAME",
    headerName: "SIZE NAME",
    width: 160,
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
    field: "FGSTYLE_CODE",
    headerName: "STYLE CODE",
    width: 230,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  
  {
    field: "DAYS_CAL",
    headerName: "DAYS_CAL",
    width: 120,
    maxWidth: 130,
    filter: 'agNumberColumnFilter',
  },
  {
    field: "BAL_QTY",
    headerName: "BALANCE QTY",
    width: 130,
    filter: 'agNumberColumnFilter',
  },
  {
    field: "TNA_ST",
    headerName: "TNA STATUS",
    width: 130,
     filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true, 
    },
    cellRenderer: (params) => getStatusChip(params.value),
    sortable: true,
     cellStyle: { display: 'flex', alignItems: 'center' }
  },
  {
    field: "AMT",
    headerName: "AMOUNT",
    width: 120,
    maxWidth: 130,
    filter: 'agNumberColumnFilter',
    valueFormatter: (params) => {
      if (params.value != null) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2
        }).format(params.value);
      }
      return '';
    }
  },
];

export default function Tnadashtable() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [partyDtls, setPartyDtls] = useState([]);
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
  const searchParams = useSearchParams();
const ordbkKey = searchParams.get('ordbk_key');

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

  // Fetch party details/branches when party is selected
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

  const handleClick = () => {
    router.push("/tnapage/tnadash");
  };

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    try {
        const response = await axiosInstance.post(`TNA/GetTNADashBoard?currentPage=1&limit=25`, {
            "TNA_KEY": "",
            "FLAG": "",
            "FCYR_KEY": fcyr,
            "COBR_ID": cobrid,
            "PageNumber": 1,
            "PageSize": 25,
            "SearchText": "",
            "PARTY_KEY": form.PARTY_KEY,
            "PARTYDTL_ID": 0,
            "ORDBK_KEY":ordbkKey
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
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [form.PARTY_KEY,ordbkKey]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

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

  const addButtonStyles = {
    background: "#39ace2",
    height: 40,
    color: "white",
    borderRadius: "10px",
    padding: "5px 20px",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
    transition: "background 0.3s ease",
    "&:hover": { background: "#2199d6" },
    "&:disabled": {
      backgroundColor: "#39ace2",
      color: "rgba(0, 0, 0, 0.26)",
    },
  };

  const handleReset = async () => {
    await fetchTableData()
  }

  return (
    <div className="p-2 w-full">
      <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>
        <Box sx={{ width: "100%", px: 2, mb: 2 }}>
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}>
            {isCustomer ? (
              <TextField
                label="Party Name"
                variant="outlined"
                fullWidth
                value={localStorage.getItem('PARTY_NAME') || ''}
                disabled
                sx={{
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' },
                  flex: 1,
                  minWidth: '200px'
                }}
              />
            ) : (
              <>
                <Box sx={{ width: "100%", maxWidth: 220 }}>
                  <Autocomplete
                    id="party-autocomplete"
                    options={partySearchResults}
                    getOptionLabel={(option) => option.PARTY_NAME || ''}
                    value={partySearchResults.find(party => party.PARTY_KEY === form.PARTY_KEY) || null}
                    onChange={(event, newValue) => {
                      setForm(prev => ({
                        ...prev,
                        PARTY_KEY: newValue?.PARTY_KEY || '',
                        PARTY_NAME: newValue?.PARTY_NAME || '',
                        PARTYDTL_ID: ''
                      }));

                      if (newValue?.PARTY_KEY) {
                        fetchPartyDetails(newValue.PARTY_KEY);
                      } else {
                        setPartyDtls([]);
                      }
                    }}
                    onInputChange={(event, newInputValue) => {
                      setSearchTerm(newInputValue);
                      debouncedFetch(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Party by Name"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: '36px',
                          },
                          '& .MuiInputLabel-outlined': {
                            transform: 'translate(14px, 9px) scale(1)',
                            '&.MuiInputLabel-shrink': {
                              transform: 'translate(14px, -6px) scale(0.75)'
                            }
                          }
                        }}
                      />
                    )}
                    sx={{ width: '100%', maxWidth: 220 }}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: '150px', maxWidth: '150px' }}>
                  <Autocomplete
                    id="branch-autocomplete"
                    options={partyDtls}
                    getOptionLabel={(option) => option.PLACE || ''}
                    value={partyDtls.find(dtl => dtl.PARTYDTL_ID === form.PARTYDTL_ID) || null}
                    onChange={(event, newValue) => {
                      setForm(prev => ({
                        ...prev,
                        PARTYDTL_ID: newValue?.PARTYDTL_ID || ""
                      }));
                    }}
                    disabled={!form.PARTY_KEY}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Branch"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: '36px',
                          },
                          '& .MuiInputLabel-outlined': {
                            transform: 'translate(14px, 9px) scale(1)',
                            '&.MuiInputLabel-shrink': {
                              transform: 'translate(14px, -6px) scale(0.75)'
                            }
                          }
                        }}
                      />
                    )}
                    sx={{ width: '100%', minWidth: '150px', maxWidth: '150px' }}
                  />
                </Box>
              </>
            )}

            <Button
              variant="contained"
              size="small"
              onClick={handleClick}
              sx={addButtonStyles}
              startIcon={<AddIcon />}
            >
              New
            </Button>

          </Box>
        </Box>


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
              rowHeight={28}
              headerHeight={36}
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
          )}
        </div>
      </div>
    </div>
  );
}


