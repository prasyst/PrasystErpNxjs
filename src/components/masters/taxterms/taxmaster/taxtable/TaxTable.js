'use client';
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../../../../lib/axios';
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
        field: "TAX_KEY",
        headerName: "Code",
        width: 130,
        maxWidth: 140,
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "TAXGRP_KEY",
        headerName: "TAXGRP_Grp Tax",
        width: 160,
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "TAX_NAME",
        headerName: "Name",
        width: 230,
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
        sortable: true
    },
    {
        field: "TAX_ABRV",
        headerName: "Abrv",
        width: 140,
        filter: 'agSetColumnFilter',
        filterParams: {
            defaultToNothingSelected: true,
        },
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

    const handleRowClick = (row) => {
        const params = new URLSearchParams({
            TAX_KEY: row.TAX_KEY,
            mode: "view"
        }).toString();
        router.push(`/masters/taxterms/taxmaster?${params}`);
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
                            paginationPageSizeSelector={[500, 1000, 2000, 5000]}
                            quickFilter={true}
                            onRowClick={(params) => {
                                console.log('Row clicked:', params);
                            }}
                            onRowDoubleClick={handleRowClick}
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