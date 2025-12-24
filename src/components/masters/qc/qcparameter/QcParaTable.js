'use client';
import React, { useState, useEffect, useCallback } from "react";
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';
import axiosInstance from "@/lib/axios";

const columnDefs = [
  {
    field: "QC_SUBGROUP_KEY",
    headerName: "SubGrp Key",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 120, // set fixed width
    minWidth: 100,
  },
  {
    field: "QC_SUBGROUP_NAME",
    headerName: "QC SubGrp_Name",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 250,
    minWidth: 200,
  },
  {
    field: "TEST_NAME",
    headerName: "Test Name",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 250,
    minWidth: 200
  },
  {
    field: "VALUE_TEST",
    headerName: "ValTest",
    width: 30,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 100,
    minWidth: 100
  },
  {
    field: "RANGE_FROM",
    headerName: "Range From",
    width: 60,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 130,
    minWidth: 100
  },
  {
    field: "RANGE_TO",
    headerName: "Range To",
    width: 60,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 130,
    minWidth: 100
  },
  {
    field: "REMARK",
    headerName: "Remark",
    width: 130,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    width: 300,
    minWidth: 200
  },
  {
    field: "CREATED_DT",
    headerName: "Created Date",
    width: 130,
    filter: 'agDateColumnFilter',
    filterParams: {
      browserDatePicker: true,
      filterOptions: [
        'equals',
        'notEqual',
        'lessThan',
        'greaterThan',
        'inRange',
        'empty',
        'notEmpty'
      ],
      customOptionLabel: 'Custom Dates',
      customFilter: getCustomDateFilter()
    },
    sortable: true
  },
  // {
  //   field: "STATUS",
  //   headerName: "Status",
  //   filter: 'agSetColumnFilter',
  //   filterParams: {
  //     defaultToNothingSelected: true,
  //   },
  //   sortable: true
  // },
];

export default function QcParaTable() {
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
      const response = await axiosInstance.post(`QC_PARAM/GetQC_PARAMDashBoard?currentPage=1&limit=5000`, {
        "SearchText": ""
      });
      const { data: { STATUS, DATA } } = response;
      if (STATUS === 0 && Array.isArray(DATA)) {
        const formattedData = DATA.map((row) => ({
          ...row,
          CREATED_DT: row.CREATED_DT ? new Date(row.CREATED_DT) : null,
        }));
        setRows(formattedData);
      }
    } catch (error) {
      console.error("Error fetching ticket qc sub group data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowDoubleClick = (row) => {
    const params = new URLSearchParams({
      QC_SUBGROUP_KEY: row.QC_SUBGROUP_KEY,
      mode: "view"
    }).toString();
    router.push(`/masters/qc/qcparameter/qcparamtr/?${params}`);
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
                flex: 0,
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