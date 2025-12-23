'use client';
import React, { useState, useEffect, useCallback } from "react";
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';
import { useRouter } from 'next/navigation';
import axiosInstance from "@/lib/axios";

const columnDefs = [
  {
    field: "PARTY_NAME",
    headerName: " Party Name",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "DOC_NO",
    headerName: "DOC_NO",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
    {
    field: "DTL_NAME",
    headerName: "Item",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
    {
    field: "QC_SUBGROUP_NAME",
    headerName: "QC SubGrp_Name",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  // {
  //   field: "TEST_NAME",
  //   headerName: "Test Name",
  //   filter: 'agSetColumnFilter',
  //   filterParams: {
  //     defaultToNothingSelected: true,
  //   },
  //   sortable: true
  // },
  // {
  //   field: "VALUE_TEST",
  //   headerName: "Value Test",
  //   filter: 'agSetColumnFilter',
  //   filterParams: {
  //     defaultToNothingSelected: true,
  //   },
  //   sortable: true
  // },
  // {
  //   field: "RANGE_FROM",
  //   headerName: "Range From",
  //   filter: 'agSetColumnFilter',
  //   filterParams: {
  //     defaultToNothingSelected: true,
  //   },
  //   sortable: true
  // },
  // {
  //   field: "RANGE_TO",
  //   headerName: "Range To",
  //   filter: 'agSetColumnFilter',
  //   filterParams: {
  //     defaultToNothingSelected: true,
  //   },
  //   sortable: true
  // },
  // {
  //   field: "USER_NAME",
  //   headerName: "UserVal",
  //   filter: 'agSetColumnFilter',
  //   filterParams: {
  //     defaultToNothingSelected: true,
  //   },
  //   sortable: true
  // },
  //  {
  //   field: "RESULT",
  //   headerName: "Result",
  //   filter: 'agSetColumnFilter',
  //   filterParams: {
  //     defaultToNothingSelected: true,
  //   },
  //   sortable: true
  // },
  //    {
  //   field: "TESTREMARK",
  //   headerName: "TestRemark",
  //   filter: 'agSetColumnFilter',
  //   filterParams: {
  //     defaultToNothingSelected: true,
  //   },
  //   sortable: true
  // },
  //    {
  //   field: "FINAL_RESULT",
  //   headerName: "Final Result",
  //   filter: 'agSetColumnFilter',
  //   filterParams: {
  //     defaultToNothingSelected: true,
  //   },
  //   sortable: true
  // },
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

export default function RawMatTable() {
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
      const response = await axiosInstance.post(`/QC_TEST/GetQC_TESTDashBoard?currentPage=1&limit=5000`, {
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
      QC_TEST_ID: row.QC_TEST_ID,
      DOC_KEY: row.DOC_KEY || "", 
      PARTY_KEY: row.PARTY_KEY || "", 
      DOC_DTL_ID: row.DOC_DTL_ID || "", 
      QC_SUBGROUP_KEY: row.QC_SUBGROUP_KEY
    }).toString();
    router.push(`/masters/qc/qctest/rawmaterial/rawmaterial/?${params}`);
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