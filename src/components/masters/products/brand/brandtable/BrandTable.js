'use client';
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../../../../lib/axios';
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";

const columnDefs = [
    {
        field: "BRAND_KEY",
        headerName: "Code",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "BRAND_KEY",
        headerName: "ALTCode",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "BRAND_NAME",
        headerName: "Name",
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "BRAND_ABRV",
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

export default function BrandTable() {
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
            const response = await axiosInstance.post(`/Brand/GetBrandDashBoard?currentPage=1&limit=5000 `, {
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
            toast.error("Error fetching brand data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRowDoubleClick = (row) => {
        const params = new URLSearchParams({
            BRAND_KEY: row.BRAND_KEY,
            mode: "view"
        }).toString();
        router.push(`/masters/products/brand?${params}`);
    };

    const handleSelectionChanged = useCallback((event) => {
        const selectedNodes = event.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        setSelectedRows(selectedData);
    }, []);

    return (
        <div className="p-2 w-full">
            <ToastContainer />
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
                            paginationPageSize={500}
                            paginationPageSizeSelector={[100, 250, 500, 1000]}
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