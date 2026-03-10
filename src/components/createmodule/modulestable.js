'use client';
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../../src/lib/axios';
import { Box, CircularProgress } from '@mui/material';
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";

const columnDefs = [
  {
    field: "MOD_ID",
    headerName: "Module ID",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 100
  },
  {
    field: "MOD_NAME",
    headerName: "Module Name",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    flex: 1,
    minWidth: 150
  },
  {
    field: "MOD_DESC",
    headerName: "Description",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    flex: 1,
    minWidth: 200
  },
  {
    field: "PARENT_ID",
    headerName: "Parent ID",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 100,
    valueFormatter: (params) => {
      return params.value || "Top Level";
    }
  },
  {
    field: "MOD_ROUTIG",
    headerName: "Module Routing",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    flex: 1,
    minWidth: 150
  },
  {
    field: "MOD_TBLNAME",
    headerName: "Table Name",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    flex: 1,
    minWidth: 150
  },
  {
    field: "STATUS",
    headerName: "Status",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 100,
    cellRenderer: (params) => {
      const status = params.value;
      return (
        <span style={{ 
          color: status === "1" ? '#2e7d32' : '#d32f2f',
          fontWeight: 500,
          backgroundColor: status === "1" ? '#e8f5e8' : '#ffebee',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          {status === "1" ? 'Active' : 'Inactive'}
        </span>
      );
    }
  },
  {
    field: "CREATED_BY",
    headerName: "Created By",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 120
  },
  {
    field: "CREATED_DT",
    headerName: "Created Date",
    filter: 'agDateColumnFilter',
    filterParams: {
      comparator: getCustomDateFilter(),
    },
    sortable: true,
    width: 150,
    valueFormatter: (params) => {
      if (!params.value) return '';
      const date = new Date(params.value);
      return date.toLocaleDateString('en-GB');
    }
  }
];

export default function ModuleTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`Module/GetWebModulesDashBoard?currentPage=1&limit=5000`, {
        "SearchText": ""
      });
      
      const { data: { STATUS, DATA } } = response;
      
      if (STATUS === 0 && Array.isArray(DATA)) {
        setRows(DATA);
      } else {
        toast.error("No data found or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data: " + (error.response?.data?.MESSAGE || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowDoubleClick = async (row) => {
    try {
      setIsLoading(true);
      
      // Call the retrieve API to get the latest data for this module
      const retrieveResponse = await axiosInstance.post('Module/RetriveWebModules', {
        FLAG: "R",
        TBLNAME: "WebMODULES",
        FLDNAME: "Mod_ID",
        ID: row.MOD_ID,
        ORDERBYFLD: "",
        CWHAER: "",
        CO_ID: localStorage.getItem('CO_ID') || ""
      });

      const { data: { STATUS, DATA, RESPONSESTATUSCODE } } = retrieveResponse;

      if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE === 1) {
        const moduleData = DATA[0];
        
        // Navigate to the form with the module ID - FIXED ROUTING PATH
        const params = new URLSearchParams({
          MOD_ID: moduleData.MOD_ID.toString(),
          mode: "view"
        }).toString();
        
        // Using the correct path /createmodule/ instead of /masters/modules/createmodule/
        router.push(`/createmodule?${params}`);
      } else {
        toast.error("Failed to retrieve module data");
      }
    } catch (error) {
      console.error("Error retrieving module data:", error);
      toast.error("Error retrieving module data: " + (error.response?.data?.MESSAGE || error.message));
      
      // If retrieve fails, still try to navigate with the row data
      const params = new URLSearchParams({
        MOD_ID: row.MOD_ID.toString(),
        mode: "view"
      }).toString();
      
      router.push(`/createmodule?${params}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchTableData();
  }, []);

  return (
    <Box className="p-2 w-full">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Box className="w-full mx-auto" sx={{ maxWidth: '100%' }}>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleRefresh}
            style={{
              padding: '6px 16px',
              backgroundColor: '#635bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh Data
          </button>
        </Box>

        <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
          {isLoading ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column'
            }}>
              <CircularProgress size='3rem' sx={{ color: '#635bff' }} />
              <Box sx={{ marginTop: 2, color: '#666' }}>Loading Modules...</Box>
            </Box>
          ) : (
            <ReusableTable
              columnDefs={columnDefs}
              rowData={rows}
              height="100%"
              theme="ag-theme-quartz"
              isDarkMode={false}
              pagination={true}
              paginationPageSize={100}
              paginationPageSizeSelector={[100, 250, 500, 1000]}
              quickFilter={true}
              onRowDoubleClick={handleRowDoubleClick}
              onSelectionChanged={handleSelectionChanged}
              loading={isLoading}
              enableExport={true}
              exportSelectedOnly={true}
              selectedRows={selectedRows}
              enableCheckbox={true}
              compactMode={true}
              rowHeight={35}
              headerHeight={30}
              className="custom-ag-table"
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
                flex: 1,
                minWidth: 100,
                cellStyle: { fontSize: '13px' }
              }}
              customGridOptions={{
                suppressRowClickSelection: true,
                rowSelection: 'multiple',
                animateRows: true,
                enableCellTextSelection: true,
                ensureDomOrder: true,
                overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Loading modules...</span>',
                overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No modules found</span>'
              }}
            />
          )}
        </Box>

        {selectedRows.length > 0 && (
          <Box sx={{ 
            mt: 1, 
            p: 1, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 1,
            fontSize: '13px',
            color: '#666'
          }}>
            {selectedRows.length} row(s) selected
          </Box>
        )}
      </Box>
    </Box>
  );
}