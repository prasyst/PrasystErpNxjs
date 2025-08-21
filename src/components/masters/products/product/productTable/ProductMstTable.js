'use client';
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../../../../lib/axios';
import {
  Button, Stack, Box
} from '@mui/material';
import ReusableHandsontable from '@/components/datatable/ReusableHandsontable';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";

const handsontableColumns = [
  { field: "FGPRD_NAME", headerName: "Product", width: "16%", type: "text" },
  { field: "FGPRD_ABRV", headerName: "FGPRDABRV", width: "16%", type: "text" },
  { field: "FGMDW_RATE", headerName: "FGMDWRATE", width: "15%", type: "numeric" },
  { field: "FGCAT_NAME", headerName: "Category", width: "15%", type: "text" },
  { field: "UNIT_NAME", headerName: "UNIT", width: "15%", type: "text" },
  { field: "HSN_CODE", headerName: "HSNCODE", width: "15%", type: "numeric" }
];

export default function ProductMstTable() {

  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`Product/GetFgPrdDashBoard?currentPage=1&limit=5000`, {
        "SearchText": ''
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

  const handleAfterChange = (changes, source) => {
    if (source === 'edit') {
      console.log('Data changed:', changes);
    }
  };

  const handleAfterSelection = (row, column, row2, column2) => {
    console.log('Selection changed:', { row, column, row2, column2 });
  };

  const handleRowClick = (row) => {
    const params = new URLSearchParams({
      FGPRD_KEY: row.FGPRD_KEY,
      mode: "view"
    }).toString();
    router.push(`/masters/products/product?${params}`);
  };

  const handleBack = () => {
    window.history.back();
  };

  const Exit = () => {
    router.push('/dashboard');
  };

  return (
    <div className="p-2 w-full">
      <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>
        <div className="mb-4 flex flex-wrap gap-4 items-center">

        <Box width="100%" display="flex" justifyContent="flex-end">
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
            <ReusableHandsontable
              data={rows}
              columns={handsontableColumns}
              height="auto"
              width="100%"
              colHeaders={true}
              rowHeaders={true}
              afterChange={handleAfterChange}
              handleRowDoubleClick={handleRowClick}
              afterSelection={handleAfterSelection}
              readOnly={true}
              customSettings={{
                stretchH: 'all',
                dropdownMenu: true,
                filters: {
                  indicators: true,
                  showOperators: true
                },
                contextMenu: true,
                search: true,
                filteringCaseSensitive: false,
                filteringIndicator: true,
                licenseKey: "non-commercial-and-evaluation"
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}