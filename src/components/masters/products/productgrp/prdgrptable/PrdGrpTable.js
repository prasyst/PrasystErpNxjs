'use client';
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../../../../lib/axios';
import { Box, CircularProgress } from '@mui/material';
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";

const columnDefs = [
  {
    field: "PRODGRP_KEY",
    headerName: "Code",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "PRODGRP_NAME",
    headerName: "Product Name",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "PRODGRP_ABRV",
    headerName: "Abbreviation",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "STATUS",
    headerName: "Status",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  }
];

export default function PrdGrpTable() {
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
      const response = await axiosInstance.post(`ProdGrp/GetProdGrpDashBoard?currentPage=1&limit=5000`, {
        "SearchText": ""
      });
      const { data: { STATUS, DATA } } = response;
      if (STATUS === 0 && Array.isArray(DATA)) {
        const formattedData = DATA.map((row) => ({
          ...row,
          STATUS: row.STATUS === "1" ? "Active" : "Inactive"
        }));
        setRows(formattedData);
      }
    } catch (error) {
      toast.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowDoubleClick = (row) => {
    const params = new URLSearchParams({
      PRODGRP_KEY: row.PRODGRP_KEY,
      mode: "view"
    }).toString();
    router.push(`/masters/products/productgrp?${params}`);
  };

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
  }, []);

  return (
    <Box className="p-2 w-full">
      <ToastContainer />
      <Box className="w-full mx-auto" sx={{ maxWidth: '100%' }}>
        <Box sx={{ height: 'calc(100vh - 80px)', width: '100%' }}>
          {isLoading ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column'
            }}>
              <CircularProgress size='3rem' />
              <Box sx={{ marginTop: 2 }}>Loading...</Box>
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
              rowHeight={24}
              headerHeight={30}
              className="custom-ag-table"
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
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}