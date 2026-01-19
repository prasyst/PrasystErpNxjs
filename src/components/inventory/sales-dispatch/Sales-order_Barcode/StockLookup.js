

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

  // Column definitions with localization
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
      field: "ORDBK_NO", 
      headerName: t('orderNo'), 
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
      headerName: t('orderDate'), 
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
      field: "PORD_REF", 
      headerName: t('pOrderRef'), 
      width: 160,
      filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      sortable: true
    },
    { 
      field: "DLV_DT", 
      headerName: t('deliveryDate'), 
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
      headerName: t('partyName'), 
      width: 230,
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
      field: "QTY", 
      headerName: t('quantity'), 
      width: 120,
      maxWidth: 130,
      filter: 'agNumberColumnFilter',
    },
    { 
      field: "BAL_QTY", 
      headerName: t('balanceQty'), 
      width: 130,
      filter: 'agNumberColumnFilter',
    },
    { 
      field: "AMT", 
      headerName: t('amount'), 
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
    console.log("my querry string data", queryString);
    router.push(`/inverntory/inventory-barcode${queryString}`);
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

  const handleReset = async () => {
    await fetchTableData();
  };

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
                
              </>
            )}

           
            
          </Box>
        </Box>

        {/* AG Grid Table */}
        <div style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
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
              enableLanguageSwitch={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StockLookupoffline;