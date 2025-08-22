import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
} from "ag-grid-community";
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

// Custom date filter component
const DateFilterComponent = ({ model, onModelChange, filterParams }) => {
  const [filterType, setFilterType] = useState('equals');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');

  useEffect(() => {
    if (model) {
      setFilterType(model.type || 'equals');
      setDate1(model.date1 || '');
      setDate2(model.date2 || '');
    }
  }, [model]);

  const updateModel = (type, d1, d2) => {
    const newModel = { type, date1: d1, date2: d2 };
    onModelChange(newModel);
  };

  const onFilterTypeChange = (e) => {
    const type = e.target.value;
    setFilterType(type);
    updateModel(type, date1, date2);
  };

  const onDate1Change = (e) => {
    const d1 = e.target.value;
    setDate1(d1);
    updateModel(filterType, d1, date2);
  };

  const onDate2Change = (e) => {
    const d2 = e.target.value;
    setDate2(d2);
    updateModel(filterType, date1, d2);
  };

  // Does the filter pass?
  const isFilterActive = () => {
    return filterType && date1;
  };

  // Get the filter state for saving
  const getModel = () => {
    if (isFilterActive()) {
      return { type: filterType, date1, date2 };
    }
    return null;
  };

  return (
    <div style={{ padding: '10px', width: '250px' }}>
      <div style={{ marginBottom: '10px' }}>
        <select 
          value={filterType} 
          onChange={onFilterTypeChange}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="equals">Equals</option>
          <option value="notEqual">Not equal</option>
          <option value="lessThan">Before</option>
          <option value="greaterThan">After</option>
          <option value="inRange">Between</option>
          <option value="empty">Empty</option>
          <option value="notEmpty">Not Empty</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="nextMonth">Next Month</option>
        </select>
      </div>
      
      {(filterType !== 'empty' && filterType !== 'notEmpty' && 
        !filterType.includes('Month') && filterType !== 'today' && filterType !== 'yesterday') && (
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="date" 
            value={date1} 
            onChange={onDate1Change}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
      )}
      
      {filterType === 'inRange' && (
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="date" 
            value={date2} 
            onChange={onDate2Change}
            style={{ width: '100%', padding: '5px' }}
            placeholder="End date"
          />
        </div>
      )}
    </div>
  );
};

// Custom date filter for AG Grid
const getCustomDateFilter = () => {
  return {
    doesFilterPass: (params) => {
      const cellValue = params.data[params.colDef.field];
      if (!cellValue) return false;
      
      const filterModel = params.filterInstance.getModel();
      if (!filterModel) return true;
      
      const cellDate = new Date(cellValue);
      const filterDate1 = filterModel.date1 ? new Date(filterModel.date1) : null;
      const filterDate2 = filterModel.date2 ? new Date(filterModel.date2) : null;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      
      const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      
      switch (filterModel.type) {
        case 'equals':
          return cellDate.getTime() === filterDate1.getTime();
        case 'notEqual':
          return cellDate.getTime() !== filterDate1.getTime();
        case 'lessThan':
          return cellDate < filterDate1;
        case 'greaterThan':
          return cellDate > filterDate1;
        case 'inRange':
          return cellDate >= filterDate1 && cellDate <= filterDate2;
        case 'empty':
          return !cellValue;
        case 'notEmpty':
          return !!cellValue;
        case 'today':
          return cellDate.getTime() === today.getTime();
        case 'yesterday':
          return cellDate.getTime() === yesterday.getTime();
        case 'thisMonth':
          return cellDate >= thisMonthStart && cellDate <= thisMonthEnd;
        case 'lastMonth':
          return cellDate >= lastMonthStart && cellDate <= lastMonthEnd;
        case 'nextMonth':
          return cellDate >= nextMonthStart && cellDate <= nextMonthEnd;
        default:
          return true;
      }
    },
    
    getModel: function() {
      return this.model;
    },
    
    setModel: function(model) {
      this.model = model;
    },
    
    isFilterActive: function() {
      return this.model !== null;
    },
    
    getModelAsString: function(model) {
      if (!model) return '';
      
      switch (model.type) {
        case 'equals': return `= ${model.date1}`;
        case 'notEqual': return `≠ ${model.date1}`;
        case 'lessThan': return `< ${model.date1}`;
        case 'greaterThan': return `> ${model.date1}`;
        case 'inRange': return `${model.date1} to ${model.date2}`;
        case 'empty': return 'Empty';
        case 'notEmpty': return 'Not Empty';
        case 'today': return 'Today';
        case 'yesterday': return 'Yesterday';
        case 'thisMonth': return 'This Month';
        case 'lastMonth': return 'Last Month';
        case 'nextMonth': return 'Next Month';
        default: return '';
      }
    }
  };
};

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
  exportSelectedOnly = false,
  selectedRows = [],
  enableCheckbox = false,
  defaultColDef = {},
  autoSizeStrategy = null,
  compactMode = false,
  ...otherProps
}) => {
  const gridRef = useRef(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef(null);

  // Handle outside clicks for export dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Export Current Page
  const onExportCurrentPage = useCallback(() => {
    if (gridRef.current?.api) {
      const fileName = `current_page_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Get current page displayed rows
      const displayedRows = [];
      gridRef.current.api.forEachNodeAfterFilterAndSort((node, index) => {
        const startIndex = gridRef.current.api.paginationGetCurrentPage() * gridRef.current.api.paginationGetPageSize();
        const endIndex = startIndex + gridRef.current.api.paginationGetPageSize();
        if (index >= startIndex && index < endIndex) {
          displayedRows.push(node.data);
        }
      });

      if (displayedRows.length > 0) {
        gridRef.current.api.exportDataAsExcel({
          fileName: fileName,
          onlySelected: false,
          shouldRowBeSkipped: (params) => {
            // Only export rows that are on current page
            const currentPageRows = [];
            gridRef.current.api.forEachNodeAfterFilterAndSort((node, index) => {
              const startIndex = gridRef.current.api.paginationGetCurrentPage() * gridRef.current.api.paginationGetPageSize();
              const endIndex = startIndex + gridRef.current.api.paginationGetPageSize();
              if (index >= startIndex && index < endIndex) {
                currentPageRows.push(node.data);
              }
            });
            return !currentPageRows.some(row => row === params.node.data);
          },
          processHeaderCallback: (params) => {
            if (params.column.getColDef().checkboxSelection) {
              return null;
            }
            return params.column.getColDef().headerName || params.column.getColId();
          }
        });
      }
      setShowExportDropdown(false);
    }
  }, []);

  // Export All Records
  const onExportAllRecords = useCallback(() => {
    if (gridRef.current?.api) {
      const fileName = `all_records_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      gridRef.current.api.exportDataAsExcel({
        fileName: fileName,
        onlySelected: false,
        processHeaderCallback: (params) => {
          if (params.column.getColDef().checkboxSelection) {
            return null;
          }
          return params.column.getColDef().headerName || params.column.getColId();
        }
      });
      setShowExportDropdown(false);
    }
  }, []);

  // Export Selected Rows
  const onExportSelectedRows = useCallback(() => {
    if (gridRef.current?.api) {
      const selectedNodes = gridRef.current.api.getSelectedNodes();
      
      if (selectedNodes.length === 0) {
        alert('Please select at least one row to export.');
        return;
      }

      const fileName = `selected_rows_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      gridRef.current.api.exportDataAsExcel({
        fileName: fileName,
        onlySelected: true,
        processHeaderCallback: (params) => {
          if (params.column.getColDef().checkboxSelection) {
            return null;
          }
          return params.column.getColDef().headerName || params.column.getColId();
        }
      });
      setShowExportDropdown(false);
    }
  }, []);

  // Processed column definitions based on checkbox requirement
  const processedColumnDefs = useMemo(() => {
    if (!enableCheckbox) {
      // Remove checkbox and serial number columns if checkbox is not enabled
      return columnDefs.filter(col => 
        !col.checkboxSelection && 
        col.field !== 'serialNo' && 
        col.headerName !== 'Select' && 
        col.headerName !== 'S.No'
      );
    }
    return columnDefs;
  }, [columnDefs, enableCheckbox]);

  // Grid options
  const gridOptions = useMemo(() => ({
    onRowClicked: onRowClick,
    onRowDoubleClicked: onRowDoubleClick,
    onSelectionChanged: onSelectionChanged,
    suppressRowClickSelection: enableCheckbox ? true : false,
    rowSelection: enableCheckbox ? 'multiple' : 'single',
    animateRows: true,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    ...customGridOptions
  }), [onRowClick, onRowDoubleClick, onSelectionChanged, customGridOptions, enableCheckbox]);

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
        {quickFilter && (
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
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d0d5dd';
                e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              }}
            />
          </div>
        )}
        
        {/* Show selected count if checkboxes are enabled */}
        {enableCheckbox && selectedRows.length > 0 && (
          <div style={{
            padding: '4px 12px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#0369a1',
            fontWeight: '500'
          }}>
            {selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected
          </div>
        )}
        
        {enableExport && (
          <div style={{ position: 'relative' }} ref={exportDropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #d0d5dd',
                backgroundColor: '#3CB371',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2e8b57';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3CB371';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 11H18L12 17L6 11H11V3H13V11ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z" fill="currentColor"/>
              </svg>
              Export Excel
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '4px' }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {showExportDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #d0d5dd',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: '180px'
              }}>
                <button
                  onClick={onExportCurrentPage}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer',
                    borderRadius: '6px 6px 0 0',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Export Current Page
                </button>
                <div style={{
                  height: '1px',
                  backgroundColor: '#e5e7eb',
                  margin: '0 8px'
                }}></div>
                <button
                  onClick={onExportAllRecords}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Export All Records
                </button>
                {enableCheckbox && (
                  <>
                    <div style={{
                      height: '1px',
                      backgroundColor: '#e5e7eb',
                      margin: '0 8px'
                    }}></div>
                    <button
                      onClick={onExportSelectedRows}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        fontSize: '14px',
                        color: '#374151',
                        cursor: 'pointer',
                        borderRadius: '0 0 6px 6px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Export Selected Rows
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
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
          columnDefs={processedColumnDefs}
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

export { DateFilterComponent, getCustomDateFilter };
export default ReusableTable;