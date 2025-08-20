'use client';
import React, { useState, useEffect, useCallback } from "react";
import { Button } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "@/lib/axios";
import ReusableHandsontable from "@/components/datatable/ReusableHandsontable";
import { useRouter } from "next/navigation";

const handsontableColumns = [
 // { field: "ROWNUM", headerName: "SrNo", width: "16%", type: "numeric" },
    { field: "TAX_KEY", headerName: "Code", width: "16%", type: "text" },
    { field: "TAXGRP_KEY", headerName: "TAXGRP_TAX", width: "25%", type: "text" },
    { field: "TAX_NAME", headerName: "Name", width: "25%", type: "text" },
    { field: "TAX_ABRV", headerName: "Abrv", width: "15%", type: "text" },
    { field: "STATUS", headerName: "Status", width: "15%", type: "numeric" }
];

export default function TaxTable() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchTableData();
    }, []);

    const fetchTableData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(`Tax/GetTaxDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ''
            });
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map((row, index) => ({
                    id: index,
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));
                setRows(formattedData);
            }
        } catch (error) {
            console.error("Error fetching tax master data:", error);
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
            TAX_KEY: row.TAX_KEY,
            mode: "view"
        }).toString();
        router.push(`/masters/taxterms/taxmaster?${params}`);
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
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/masters/taxterms/taxmaster')}
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