'use client';
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../../../../lib/axios';
import {
    Button, Stack, Box
} from '@mui/material';
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';

const columnDefs = [
    {
        field: "FGSHADE_KEY",
        headerName: "Code",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "FGSHADE_ALT_KEY",
        headerName: "ALTCode",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "FGSHADE_NAME",
        headerName: "Name",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "FGSHADE_ABRV",
        headerName: "Abrv",
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

export default function ShadeTable() {
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
            const response = await axiosInstance.post(`Fgshade/GetFGSHADEDashBoard?currentPage=1&limit=5000`, {
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
            console.error("Error fetching shade data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRowDoubleClick = (row) => {
        const params = new URLSearchParams({
            FGSHADE_KEY: row.FGSHADE_KEY,
            mode: "view"
        }).toString();
        router.push(`/masters/products/shade?${params}`);
    };

    const handleSelectionChanged = useCallback((event) => {
        const selectedNodes = event.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        setSelectedRows(selectedData);
    }, []);

    return (
        <div className="p-2 w-full">
            <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>

                <div style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
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
                            paginationPageSize={1000}
                            paginationPageSizeSelector={[100, 200, 500, 1000, 5000]}
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
                </div>
            </div>
        </div>
    );
}