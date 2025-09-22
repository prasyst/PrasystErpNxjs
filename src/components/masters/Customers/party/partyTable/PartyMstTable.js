'use client';
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../../../../lib/axios';
import {
  Button, Stack, Box
} from '@mui/material';
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";

// Column definitions for AG Grid with Serial No and Checkbox
const columnDefs = [
  {
    headerName: "Select",
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
    field: "PARTY_KEY",
    headerName: "CODE",
    width: 130,
    maxWidth: 140,
    filter: true,
    sortable: true
  },
  {
    field: "PARTY_NAME",
    headerName: "PARTYNAME",
    width: 130,
    maxWidth: 140,
    filter: true,
    sortable: true
  },
  {
    field: "ADDR",
    headerName: "Address",
    width: 190,
    maxWidth: 200,
    filter: true,
    sortable: true
  },
  {
    field: "PLACE",
    headerName: "Place",
    width: 130,
    maxWidth: 140,
    filter: true,
    sortable: true
  },
  {
    field: "E_MAIL",
    headerName: "EMAIL",
    width: 130,
    maxWidth: 140,
    filter: true,
    sortable: true
  },
  {
    field: "CONTACT_PERSON",
    headerName: "CONTACTPERSON",
    width: 130,
    maxWidth: 140,
    filter: true,
    sortable: true
  },
  {
    field: "MOBILE_NO",
    headerName: "MOBILENO",
    width: 130,
    maxWidth: 140,
    filter: true,
    sortable: true
  },
  {
    field: "PAN_NO",
    headerName: "PANNO",
    width: 130,
    maxWidth: 140,
    filter: true,
    sortable: true
  },
  {
    field: "GSTTIN_NO",
    headerName: "GSTTINNO",
    width: 130,
    maxWidth: 140,
    filter: true,
    sortable: true
  },
];

export default function PartyMstTable() {

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
      const response = await axiosInstance.post(`Party/GetPartyDashBoard?currentPage=1&limit=25`, {
        "SearchText": "",
        "PARTY_CAT": "PC",
        "FLAG": ""
      });
      const { data: { STATUS, DATA } } = response;
      if (STATUS === 0 && Array.isArray(DATA)) {
        const formattedData = DATA.map((row) => ({
          ...row,
        }));
        setRows(formattedData);
      }
    } catch (error) {
      console.error("Error fetching productgrp data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowDoubleClick = (row) => {
    const params = new URLSearchParams({
      PARTY_KEY: row.PARTY_KEY,
      mode: "view"
    }).toString();
    router.push(`/masters/customers?${params}`);
  };

  const handleBack = () => {
    window.history.back();
  };

  const Exit = () => {
    router.push('/dashboard');
  };

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
    console.log('Selected rows:', selectedData);
  }, []);

  return (
    <div className="p-2 w-full">
      <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>
        <div className="flex flex-wrap gap-4 items-center">

          <Box width="100%" display="flex" justifyContent="flex-end"
            sx={{ 
              position: 'relative',
              top: 38
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Back Button */}
              <Button
                onClick={handleBack}
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>

              {/* Logout Button */}
              <Button
                onClick={Exit}
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
              >
                Exit
              </Button>
            </Stack>
          </Box>
        </div>

        <div style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}>
              Loading...
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
              onRowClick={(params) => {
                console.log('Row clicked:', params);
              }}
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
            />
          )}
        </div>
      </div>
    </div>
  );
}