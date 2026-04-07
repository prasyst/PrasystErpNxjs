'use client';
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../../../lib/axios';
import {
    Button, Stack, Box
} from '@mui/material';
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';

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
        field: "MRP",
        headerName: "MRP",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "SSP",
        headerName: "SSP",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "WEIGHT",
        headerName: "WEIGHT",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "REMARK",
        headerName: "REMARK",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    }
];

export default function StyleMstTable() {

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
            const response = await axiosInstance.post(`FGSTYLE/GetFgstyleDashBoard?currentPage=1&limit=10`, {
                "FLAG": "DASH",
                "FGSTYLE_ID": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map((row) => ({
                    ...row,
                }));
                setRows(formattedData);
            }
        } catch (error) {
            console.error("Error fetching style data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRowDoubleClick = (row) => {
        const params = new URLSearchParams({
            FGSTYLE_ID: row.FGSTYLE_ID,
            mode: "view"
        }).toString();
        router.push(`/inverntory/style?${params}`);
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