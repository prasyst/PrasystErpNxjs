'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Autocomplete,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from '../../../../lib/axios';
import ReusableTable, { getCustomDateFilter } from '../../../../components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';
import RestoreIcon from '@mui/icons-material/Restore';
import { useLocalization } from '../../../../context/LocalizationContext';

const StockLookupoffline = () => {
  const router = useRouter();
  const { t } = useLocalization();
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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 25,
    totalRecords: 0,
    totalPages: 1
  });

  // Column definitions with localization for Pack Dashboard
  const columnDefs = useMemo(() => [
    {
      headerName: t('select'),
      width: 50,
      maxWidth: 40,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      lockPosition: true,
      suppressMenu: true,
      sortable: false,
      filter: false,
      resizable: false,
      headerClass: 'checkbox-header'
    },
    {
      field: "PACK_NO",
      headerName: t('packNo') || "Pack No",
      width: 120,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "PACK_KEY",
      headerName: t('packKey') || "Pack Key",
      width: 150,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "PACK_DT",
      headerName: t('packDate') || "Pack Date",
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
      sortable: true,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString('en-IN');
        }
        return '';
      }
    },
    {
      field: "BILL_NO",
      headerName: t('billNo') || "Bill No",
      width: 120,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "LR_NO",
      headerName: t('lrNo') || "LR No",
      width: 150,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "PARTY_NAME",
      headerName: t('partyName'),
      width: 230,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "PLACE",
      headerName: t('place') || "Place",
      width: 140,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "BROKER_NAME",
      headerName: t('brokerName'),
      width: 140,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "DISTBTR_NAME",
      headerName: t('distributor') || "Distributor",
      width: 140,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    {
      field: "QTY",
      headerName: t('quantity'),
      width: 120,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => {
        if (params.value != null) {
          return params.value.toFixed(4);
        }
        return '';
      }
    },
    {
      field: "PACK_NET_AMT",
      headerName: t('netAmount') || "Net Amount",
      width: 130,
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
    {
      field: "EX_RATE",
      headerName: t('exchangeRate') || "Ex. Rate",
      width: 100,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => {
        if (params.value != null) {
          return params.value.toFixed(2);
        }
        return '';
      }
    },
    {
      field: "CURRN_NAME",
      headerName: t('currency') || "Currency",
      width: 120,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    }
  ], [t]);

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
      const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
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

  const fetchTableData = useCallback(async (page = pagination.currentPage, pageSize = pagination.pageSize) => {
    setIsLoading(true);
    try {
      const payload = {
        PACK_KEY: "",
        FLAG: "",
        FCYR_KEY: "25",
        COBR_ID: "02",
        PageNumber: page,
        PageSize: pageSize,
        SearchText: form.PARTY_KEY || searchTerm || ""
      };

      const response = await axiosInstance.post("PACK/GetPACKDashBoard?currentPage=" + page + "&limit=" + pageSize, payload);

      const { data: { STATUS, DATA, totalRecords, totalPages } } = response;
      
      if (STATUS === 0 && Array.isArray(DATA)) {
        const formattedData = DATA.map((row, index) => ({
          id: index,
          ...row,
          PACK_DT: row.PACK_DT ? new Date(row.PACK_DT) : null
        }));
        setRows(formattedData);
        
        // Update pagination info from response if available
        if (totalRecords) {
          setPagination(prev => ({
            ...prev,
            totalRecords: totalRecords,
            totalPages: totalPages || Math.ceil(totalRecords / pageSize),
            currentPage: page
          }));
        }
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching pack data:", error);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [form.PARTY_KEY, searchTerm, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const handleRowClick = useCallback((event) => {
    console.log('Row clicked:', event.data);
  }, []);

 // In your table component (where the row double-click is handled)
const handleRowDoubleClick = useCallback((rows) => {
  // Pass PACK_KEY instead of ORDBK_KEY
  const queryString = `?packKey=${encodeURIComponent(rows.PACK_KEY)}&packNo=${encodeURIComponent(rows.PACK_NO)}`;
  router.push(`/inverntory/packingslip/${queryString}`);
}, [router]);

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    fetchTableData(newPage, pagination.pageSize);
  }, [fetchTableData, pagination.pageSize]);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, currentPage: 1 }));
    fetchTableData(1, newPageSize);
  }, [fetchTableData]);

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
    setSearchTerm("");
    setForm({
      PARTY_KEY: "",
      PARTYDTL_ID: "",
      PARTY_NAME: ""
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    await fetchTableData(1, pagination.pageSize);
  };

  return (
    <Box className="p-2 w-full">
      <Box className="w-full mx-auto" style={{ maxWidth: '100%' }}>
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
                label={t('partyName')}
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
                      setSearchTerm(newValue?.PARTY_NAME || '');
                    
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
                        label={t('searchPartyByName') || "Search Party by Name"}
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
                        label={t('branch') || "Branch"}
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
              onClick={handleReset}
              sx={{
                ...addButtonStyles,
                background: "#6c757d",
                "&:hover": { background: "#5a6268" }
              }}
              startIcon={<RestoreIcon />}
            >
              {t('reset') || "Reset"}
            </Button>

          </Box>
        </Box>

        {/* AG Grid Table */}
        <Box sx={{ height: 'calc(100vh - 100px)', width: '100%' }}>
          {isLoading ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
              <CircularProgress size="3rem" />
              <Typography sx={{ marginTop: '10px' }}>{t('loading') || "Loading data..."}</Typography>
            </Box>
          ) : (
            <ReusableTable
              columnDefs={columnDefs}
              rowData={rows}
              height="100%"
              theme="ag-theme-quartz"
              isDarkMode={false}
              pagination={true}
              paginationPageSize={pagination.pageSize}
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
                fileName: 'Pack_Details',
                sheetName: 'Pack Details'
              }}
              enableLanguageSwitch={true}
              onPaginationChanged={(params) => {
                if (params.api) {
                  const currentPage = params.api.paginationGetCurrentPage() + 1;
                  if (currentPage !== pagination.currentPage) {
                    handlePageChange(currentPage);
                  }
                }
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StockLookupoffline;