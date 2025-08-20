'use client';
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../../../../lib/axios';
import {
  Button,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import ReusableHandsontable from '@/components/datatable/ReusableHandsontable';
import { useRouter } from 'next/navigation';

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

  const handleNew = () => {
    
    router.push(`/masters/products/product`);
    
  };

  const addButtonStyles = {
    background: "#39ace2",
    height: 40,
    color: "white",
    borderRadius: "50px",
    padding: "5px 20px",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
    transition: "background 0.3s ease",
    "&:hover": { background: "#2199d6" },
    "&:disabled": {
      backgroundColor: "#39ace2",
      color: "rgba(0, 0, 0, 0.26)",
    },
  };

  return (
    <div className="p-2 w-full">
      <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>
        <div className="mb-4 flex flex-wrap gap-4 items-center">

          <Button
            variant="contained"
            size="small"
            sx={addButtonStyles}
            onClick={handleNew}
            startIcon={<AddIcon />}
          >
            New
          </Button>
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