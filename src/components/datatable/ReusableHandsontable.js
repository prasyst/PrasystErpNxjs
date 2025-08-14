'use client';
import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { 
  registerAllModules,
  registerAllEditors,
  registerAllRenderers,
  registerAllValidators,
  registerAllCellTypes
} from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// Register all Handsontable components
registerAllModules();
registerAllEditors();
registerAllRenderers();
registerAllValidators();
registerAllCellTypes();

const ReusableHandsontable = ({
  data = [],
  columns = [],
  height = 'auto',
  width = '100%',
  readOnly = true,
  colHeaders = true,
  rowHeaders = true,
  licenseKey = "non-commercial-and-evaluation",
  className = "ht-theme-main",
  customSettings = {},
  afterChange = null,
  afterSelection = null,
  handleRowDoubleClick
}) => {
  const hotTableRef = useRef(null);
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValues, setSearchValues] = useState({});

  // Initialize data when props change
  useEffect(() => {
    setOriginalData(data);
    setFilteredData(data);
  }, [data]);

  // Generate column configuration
  const columnsConfig = columns.map(col => ({
    data: col.field,
    type: col.type || 'text',
    readOnly: col.readOnly || readOnly,
    width: col.width || 150,
    className: col.className || '',
    ...(col.customConfig || {})
  }));

  // Filter data based on search values
  const filterData = (searchTerms) => {
    if (Object.keys(searchTerms).length === 0 || Object.values(searchTerms).every(val => !val)) {
      setFilteredData(originalData);
      return;
    }

    const filtered = originalData.filter(row => {
      return Object.entries(searchTerms).every(([field, searchTerm]) => {
        if (!searchTerm) return true;
        
        const cellValue = row[field];
        if (cellValue === null || cellValue === undefined) return false;
        
        return String(cellValue).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    setFilteredData(filtered);
  };

  // Handle search input change
  const handleSearchChange = (field, value) => {
    const newSearchValues = { ...searchValues, [field]: value };
    setSearchValues(newSearchValues);
    filterData(newSearchValues);
  };

  // Generate column headers with search inputs
  const generateColumnHeaders = () => {
    return columns.map((col, index) => {
      const headerName = col.headerName || col.field || '';
      const searchInputWidth = Math.max((col.width || 150) - 30, 100);
      return `
        <div class="header-with-search">
          <div class="header-title">${headerName}</div>
          <input type="text" 
                 class="header-search-input" 
                 placeholder="Search..." 
                 data-field="${col.field}"
                 data-index="${index}"
                 value="${searchValues[col.field] || ''}"
                 style="width: ${searchInputWidth}px"/>
        </div>
      `;
    });
  };

  // Attach event listeners to search inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      const headerInputs = document.querySelectorAll('.header-search-input');
      
      const handleInputChange = (e) => {
        const field = e.target.getAttribute('data-field');
        const value = e.target.value;
        handleSearchChange(field, value);
      };

      headerInputs.forEach(input => {
        // Remove existing listeners
        input.removeEventListener('input', handleInputChange);
        input.removeEventListener('keyup', handleInputChange);
        
        // Add new listeners
        input.addEventListener('input', handleInputChange);
        input.addEventListener('keyup', handleInputChange);
        
        // Set current value
        const field = input.getAttribute('data-field');
        if (searchValues[field]) {
          input.value = searchValues[field];
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, );

  // Update table when filtered data changes
  useEffect(() => {
    if (hotTableRef.current && hotTableRef.current.hotInstance) {
      const hot = hotTableRef.current.hotInstance;
      hot.loadData(filteredData);
    }
  }, [filteredData]);

  const settings = {
    data: filteredData,
    columns: columnsConfig,
    colHeaders: colHeaders ? generateColumnHeaders() : false,
    rowHeaders,
    height: height === 'auto' ? undefined : height,
    width,
    licenseKey,
    // Enable necessary plugins
    dropdownMenu: true,
    contextMenu: true,
    manualColumnResize: true,
    manualRowResize: true,
    autoColumnSize: false,
    // Event handlers
    afterChange,
    afterSelection,
    // Additional custom settings
    ...customSettings,
afterOnCellMouseDown: (event, coords, TD) => {
  const { row } = coords;
  if (row < 0) return; // Ignore header clicks
  const clickedRow = filteredData[row];
  if (clickedRow && handleRowDoubleClick) {
    handleRowDoubleClick(clickedRow);
  }
},

  };

  return (
    <div className={className} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <style jsx>{`
        .header-with-search {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: flex-start;
          padding: 4px 2px;
          min-height: 70px;
        }
        .header-title {
          font-weight: 700 !important;
          font-size: 13px !important;
          padding: 4px 0;
          text-align: center;
          color: #2c3e50 !important;
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .header-search-input {
          margin: 2px auto;
          padding: 4px 6px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 11px;
          background: #fff;
          display: block;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .header-search-input:focus {
          outline: none;
          border-color: #4d90fe;
          background: #fff;
          box-shadow: 0 0 0 2px rgba(77, 144, 254, 0.2);
        }
        .header-search-input:hover {
          border-color: #999;
        }
        .handsontable th {
          background-color: #f8f9fa !important;
          font-weight: bold !important;
          vertical-align: top !important;
          padding: 2px !important;
        }
        .handsontable thead th {
          height: 80px !important;
          vertical-align: top !important;
        }
        .handsontable .ht_clone_top th,
        .handsontable .ht_clone_top_left_corner th {
          height: 80px !important;
        }
        /* Make column headers more prominent */
        .handsontable th .header-title {
          font-weight: 700 !important;
          color: #2c3e50 !important;
        }
        /* Ensure proper alignment */
        .handsontable th .header-with-search {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
        }
        /* Custom scrollbar */
        .handsontable .wtHolder {
          scrollbar-width: thin;
        }
        .handsontable .wtHolder::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .handsontable .wtHolder::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .handsontable .wtHolder::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .handsontable .wtHolder::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
      <HotTable 
        ref={hotTableRef}
     
        {...settings}
      />
    </div>
  );
};

export default ReusableHandsontable;