
'use client';
import React, { useState, useEffect, useCallback, useMemo,useRef } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from '../../../../lib/axios';
import ReusableTable, { getCustomDateFilter } from '../../../../components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';
import RestoreIcon from '@mui/icons-material/Restore';

// Column definitions for AG Grid with Serial No and Checkbox
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
    field: "ORDBK_NO", 
    headerName: "ORDER NO", 
    width: 130,
    maxWidth: 140,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true, // This ensures all options are initially unchecked
    },
    sortable: true
  },
  { 
    field: "ORDER_Date", 
    headerName: "ORDER DATE", 
    width: 130,
    filter: 'agDateColumnFilter',
    filterParams: {
      // Use our custom date filter
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
      // Add custom options to the filter
      customOptionLabel: 'Custom Dates',
      customFilter: getCustomDateFilter()
    },
    sortable: true
  },
  { 
    field: "PORD_REF", 
    headerName: "P ORDER REF", 
    width: 160,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true, // This ensures all options are initially unchecked
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
    field: "PARTY_NAME", 
    headerName: "PARTY NAME", 
    width: 230,
     filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true, 
    },
    sortable: true
  },
  { 
    field: "BROKER_NAME", 
    headerName: "BROKER NAME", 
    width: 140,
     filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true, // This ensures all options are initially unchecked
    },
    sortable: true
  },
  { 
    field: "QTY", 
    headerName: "QUANTITY", 
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

export default function StockLookupoffline() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [partyDtls, setPartyDtls] = useState([]);
  const [partySearchResults, setPartySearchResults] = useState([]);
  const [isCustomer, setIsCustomer] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [form, setForm] = useState({
    PARTY_KEY: "",
    PARTYDTL_ID: "",
    PARTY_NAME: ""
  });
  const [rows, setRows] = useState([]);

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
    router.push("/dashboard/stock_enqury");
  };

  const fetchTableData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`StockEnqiry/GetOrderDashBoard`, {
        pageNumber: "1",
        PageSize: "1000",
        SearchText: form.PARTY_KEY,
        Flag: "",
        PARTY_KEY: ""
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
  }, [form.PARTY_KEY]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const handleRowClick = useCallback((event) => {
    console.log('Row clicked:', event.data);
  }, []);

const handleRowDoubleClick = useCallback((rows) => {
const queryString = `?ordbkKey=${encodeURIComponent(rows.ORDBK_KEY)}`;
  console.log("my querry string data",queryString)
  router.push(`/inverntory/inventory-offline${queryString}`);
}, [router]);




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

  const handleReset=async()=>{
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

        {/* AG Grid Table */}
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
              rowHeight={24} 
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


