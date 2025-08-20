import React, { useRef, useState, useMemo, useCallback } from 'react';

import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
} from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ExcelExportModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

// Register AG Grid modules
ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  SetFilterModule,
  MultiFilterModule,
]);

const ReusableTable = ({
  columnDefs = [],
  rowData = [],
  height = "400px",
  theme = "ag-theme-quartz",
  isDarkMode = false,
  pagination = true,
  paginationPageSize = 25,
  paginationPageSizeSelector = [25, 50, 100, 250, 500],
  quickFilter = true,
  onRowClick = null,
  onRowDoubleClick = null,
  onSelectionChanged = null,
  customGridOptions = {},
  loading = false,
  enableExport = true,
  defaultColDef = {},
  autoSizeStrategy = null,
  compactMode = false,
  ...otherProps
}) => {
  const gridRef = useRef(null);
  const [quickFilterText, setQuickFilterText] = useState("");

  // Default column definition
  const defaultColDefMemo = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    ...defaultColDef
  }), [defaultColDef]);

  // Auto size strategy
  const autoSizeStrategyMemo = useMemo(() => 
    autoSizeStrategy || {
      // type: "fitGridWidth",
    }, [autoSizeStrategy]);

  // Theme class with compact mode support
  const themeClass = `${isDarkMode ? `${theme}-dark` : theme}${compactMode ? ' compact-mode' : ''}`;

  // Quick filter handler
  const onFilterTextBoxChanged = useCallback((e) => {
    setQuickFilterText(e.target.value);
  }, []);

  // Export to Excel
  const onExportExcel = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsExcel({
        fileName: `export_${new Date().toISOString().split('T')[0]}.xlsx`,
        processHeaderCallback: (params) => {
          // Make headers bold in Excel export
          return {
            style: { font: { bold: true } },
            text: params.column.getColDef().headerName || params.column.getColId()
          };
        }
      });
    }
  }, []);

  // Grid options
  const gridOptions = useMemo(() => ({
    onRowClicked: onRowClick,
    onRowDoubleClicked: onRowDoubleClick,
    onSelectionChanged: onSelectionChanged,
    suppressRowClickSelection: false,
    rowSelection: 'single',
    animateRows: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    ...customGridOptions
  }), [onRowClick, onRowDoubleClick, onSelectionChanged, customGridOptions]);

  return (
    <div style={{ 
      width: '100%', 
      height,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header with search and export */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        margin: '0 16px'
      }}>
        {/* {quickFilter && (
          <div style={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center',
            flex: 1,
            maxWidth: '300px'
          }}>
            <svg
              style={{
                position: 'absolute',
                left: '12px',
                pointerEvents: 'none',
                opacity: 0.5,
                zIndex: 1
              }}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.5014 7.00039C11.5014 7.59133 11.385 8.1765 11.1588 8.72246C10.9327 9.26843 10.6012 9.7645 10.1833 10.1824C9.76548 10.6002 9.2694 10.9317 8.72344 11.1578C8.17747 11.384 7.59231 11.5004 7.00136 11.5004C6.41041 11.5004 5.82525 11.384 5.27929 11.1578C4.73332 10.9317 4.23725 10.6002 3.81938 10.1824C3.40152 9.7645 3.07005 9.26843 2.8439 8.72246C2.61776 8.1765 2.50136 7.59133 2.50136 7.00039C2.50136 5.80691 2.97547 4.66232 3.81938 3.81841C4.6633 2.97449 5.80789 2.50039 7.00136 2.50039C8.19484 2.50039 9.33943 2.97449 10.1833 3.81841C11.0273 4.66232 11.5014 5.80691 11.5014 7.00039ZM10.6814 11.7404C9.47574 12.6764 7.95873 13.1177 6.43916 12.9745C4.91959 12.8314 3.51171 12.1145 2.50211 10.9698C1.49252 9.8251 0.957113 8.33868 1.0049 6.81314C1.05268 5.28759 1.68006 3.83759 2.75932 2.75834C3.83857 1.67908 5.28856 1.0517 6.81411 1.00392C8.33966 0.956136 9.82608 1.49154 10.9708 2.50114C12.1154 3.51073 12.8323 4.91862 12.9755 6.43819C13.1187 7.95775 12.6773 9.47476 11.7414 10.6804L14.5314 13.4704C14.605 13.539 14.6642 13.6218 14.7051 13.7138C14.7461 13.8058 14.7682 13.9052 14.77 14.0059C14.7717 14.1066 14.7532 14.2066 14.7155 14.3C14.6778 14.3934 14.6216 14.4782 14.5504 14.5494C14.4792 14.6206 14.3943 14.6768 14.301 14.7145C14.2076 14.7522 14.1075 14.7708 14.0068 14.769C13.9061 14.7672 13.8068 14.7452 13.7148 14.7042C13.6228 14.6632 13.54 14.6041 13.4714 14.5304L10.6814 11.7404Z"
                fill="currentColor"
              />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              onChange={onFilterTextBoxChanged}
              style={{
                fontSize: '14px',
                padding: '8px 12px 8px 36px',
                lineHeight: '1.4',
                borderRadius: '6px',
                border: '1px solid #d0d5dd',
                backgroundColor: '#fff',
                outline: 'none',
                width: '100%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
                ':focus': {
                  borderColor: '#3b82f6',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }
              }}
            />
          </div>
        )} */}
        
        {enableExport && (
          <button
            onClick={onExportExcel}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #d0d5dd',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#f8f9fa',
                borderColor: '#b3b9c2'
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 11H18L12 17L6 11H11V3H13V11ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z" fill="currentColor"/>
            </svg>
            Export Excel
          </button>
        )}
      </div>

      {/* AG Grid */}
      <div 
        className={themeClass} 
        style={{ 
          flex: 1,
          width: 'calc(100% - 32px)',
          margin: '0 16px',
          overflow: 'hidden'
        }}
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDefMemo}
          autoSizeStrategy={autoSizeStrategyMemo}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          quickFilterText={quickFilterText}
          {...gridOptions}
          {...otherProps}
        />
      </div>

      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div className="spinner"></div>
            <span>Loading data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableTable;