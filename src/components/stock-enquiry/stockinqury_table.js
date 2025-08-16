'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { 
  Box, 
  Button, 
  Tooltip, 
  TextField, 
  CircularProgress,
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Paper, 
  Autocomplete, 
  useMediaQuery,
  useTheme, 
  FormControl,
  Select, 
  MenuItem,
  TablePagination,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';
import { ClickAwayListener } from "@mui/material";
import axiosInstance from '../../lib/axios';
import ReusableHandsontable from '../datatable/ReusableHandsontable';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

const handsontableColumns = [
  { field: "FGCAT_NAME", headerName: "Category", width: 140, type: "text", readOnly: true },
  { field: "FGPRD_ABRV", headerName: "Product", width: 200, type: "text", readOnly: true },
  { field: "COLLECTION_NAME", headerName: "Series", width: 130, type: "text", readOnly: true },
  { field: "FGSTYLE_CODE", headerName: "StyleCode", width: 130, type: "text", readOnly: true },
  { field: "FGSTYLE_NAME", headerName: "Style", width: 130, type: "text", readOnly: true },
  { field: "FGSHADE_NAME", headerName: "Shade", width: 130, type: "text", readOnly: true },
  { field: "STYSIZE_NAME", headerName: "Size", width: 130, type: "text", readOnly: true },
  { field: "PACK_QTY", headerName: "PackOf", width: 130, type: "text", readOnly: true },
  { field: "ORD_QTY", headerName: "OrdQty", width: 130, type: "text", readOnly: false },
  { field: "WEIGHT", headerName: "PerBox", width: 130, type: "text", readOnly: true },
  { field: "MRP", headerName: "MRP", width: 130, type: "text", readOnly: true },
  { field: "BARCODE", headerName: "Barcode", width: 130, type: "text", readOnly: true },
  { field: "EAN_CODE", headerName: "EAN", width: 130, type: "text", readOnly: true },
];

const filterTypeToFlag = {
  'Product Group': 'Group',
  'Product Type': 'Type',
  'Series': 'Series',
  'Age': 'Age',
  'Gender': 'Gender',
  'Discount': 'Disc'
};

export default function StockInquiryTable() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [partyDtls, setPartyDtls] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [partySearchResults, setPartySearchResults] = useState([]);
  const [isCustomer, setIsCustomer] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);
  const [selectedFilterValues, setSelectedFilterValues] = useState({
    Group: '',
    Type: '',
    Series: '',
    Age: '',
    Gender: '',
    Disc: ''
  });
  const [selectedFilter, setSelectedFilter] = useState('Product Group');
  const [form, setForm] = useState({
    PARTY_KEY: "",
    PARTYDTL_ID: "",
    PARTY_NAME: "",
    Series: "", Group: "", Type: "", Disc: "", Age: "", Gender: ""
  });
  const [allFetchedData, setAllFetchedData] = useState([]);
  const [orderQuantities, setOrderQuantities] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [totalRecords, setTotalRecords] = useState(0);
  
  const tableHeight = isMobile ? 400 : 600;
  const rowHeight = isMobile ? 40 : 48;

  // Initialize component
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'customer') {
      setIsCustomer(true);
      const storedPartyName = localStorage.getItem('PARTY_NAME');
      const storedPartyKey = localStorage.getItem('PARTY_KEY');
      setForm(prev => ({
        ...prev,
        PARTY_KEY: storedPartyKey || "",
        PARTYDTL_ID: "",
      }));
      setPartyName(storedPartyName || "");
    }
    
    // Set default filter to "Product Group"
    setSelectedFilter('Product Group');
    fetchDropdownData('Product Group');
    fetchPartiesByName();
  }, []);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Fetch dropdown data
  const fetchDropdownData = async (filterType) => {
    const flag = filterTypeToFlag[filterType];
    if (!flag) return;

    setDropdownLoading(true);
    try {
      const response = await axiosInstance.post("StockEnqiry/GetDropDownStockDashBoard", {
        PageNumber: 1,
        PageSize: 100,
        SearchText: "",
        Flag: flag
      });

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const options = response.data.DATA.map(item => ({
          id: item.ID,
          name: item.NAME
        }));

        setDropdownOptions(options);

        // Auto-select first option (index 0)
        if (options.length > 0) {
          setSelectedDropdownValue(options[0]);
          setForm(prev => ({
            ...prev,
            [flag]: options[0].name
          }));
        }
      } else {
        setDropdownOptions([]);
        setSelectedDropdownValue(null);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setDropdownOptions([]);
      setSelectedDropdownValue(null);
    } finally {
      setDropdownLoading(false);
    }
  };

  // Handle filter selection
  const handleFilterSelect = (filterType) => {
    setSelectedFilter(filterType);
    fetchDropdownData(filterType);
  };

  // Handle dropdown value selection
  const handleDropdownValueSelect = (event, newValue) => {
    setSelectedDropdownValue(newValue);
    const flag = filterTypeToFlag[selectedFilter];
    if (flag && newValue) {
      setForm(prev => ({
        ...prev,
        [flag]: newValue.name
      }));
    }
  };

  // Get filtered data
  const handleGetData = async () => {
    setIsLoading(true);
    try {
      const flag = filterTypeToFlag[selectedFilter];
      const searchText = selectedDropdownValue ?
        (selectedDropdownValue.name === "(ALL)" ? "" : selectedDropdownValue.name) : '';

      const response = await axiosInstance.post("StockEnqiry/GetFilterStockDashBoard", {
        SearchText: searchText,
        Flag: flag,
        FCYR_KEY: localStorage.getItem('financialYear') || '25',
        COBR_ID: localStorage.getItem('companyBranch') || '02'
      });

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        // Generate unique keys for each item
        const newData = response.data.DATA.map(item => {
          const uniqueKey = `${item.FGSTYLE_CODE}_${item.FGSHADE_NAME}_${item.STYSIZE_NAME}`;
          return {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            _key: uniqueKey,
            ORD_QTY: orderQuantities[uniqueKey] || 0
          };
        });

        // Update master data list - merge with existing data
        setAllFetchedData(prev => {
          const merged = [...prev];
          newData.forEach(newItem => {
            const existingIndex = merged.findIndex(item => item._key === newItem._key);
            if (existingIndex >= 0) {
              merged[existingIndex] = {
                ...merged[existingIndex],
                ...newItem,
                ORD_QTY: orderQuantities[newItem._key] || merged[existingIndex].ORD_QTY || 0
              };
            } else {
              merged.push(newItem);
            }
          });
          return merged;
        });

        setTableData(newData);
        setTotalRecords(newData.length);
        setPage(0); // Reset to first page when new data is loaded
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  // Fetch parties by name
  const fetchPartiesByName = async () => {
    try {
      const response = await axiosInstance.post("Party/GetPartyDrp", {});
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setPartySearchResults(response.data.DATA);
      } else {
        setPartySearchResults([]);
      }
    } catch (error) {
      console.error("API error", error);
      setPartySearchResults([]);
    }
  };

  // Handle party details fetch
  useEffect(() => {
    const fetchPartyDetails = async () => {
      if (!form.PARTY_KEY) {
        setPartyDtls([]);
        setForm(prev => ({
          ...prev,
          PARTYDTL_ID: ""
        }));
        return;
      }

      setIsLoading(true);
      try {
        const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
          PARTY_KEY: form.PARTY_KEY,
        });
        const { STATUS, DATA } = response.data;
        if (STATUS === 0 && Array.isArray(DATA)) {
          const validDetails = DATA.filter((d) => d.PARTYDTL_ID && d.PLACE);
          setPartyDtls(validDetails);
          if (validDetails.length > 0 && !form.PARTYDTL_ID) {
            setForm(prev => ({
              ...prev,
              PARTYDTL_ID: validDetails[0].PARTYDTL_ID
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching party details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartyDetails();
  }, [form.PARTY_KEY]);

  // Handle quantity changes in the table
  const handleAfterChange = (changes, source) => {
    if (source === 'edit') {
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (prop === 'ORD_QTY') {
          const item = tableData[row];
          if (item && item._key) {
            const value = Math.max(0, parseInt(newValue) || 0);
            setOrderQuantities(prev => ({
              ...prev,
              [item._key]: value
            }));
            
            // Update the table data
            setTableData(prev => {
              const newData = [...prev];
              newData[row] = {
                ...newData[row],
                ORD_QTY: value
              };
              return newData;
            });
            
            // Update all fetched data
            setAllFetchedData(prev => {
              return prev.map(dataItem => {
                if (dataItem._key === item._key) {
                  return {
                    ...dataItem,
                    ORD_QTY: value
                  };
                }
                return dataItem;
              });
            });
          }
        }
      });
    }
  };

  // Handle save action
  // In StockInquiryTable component, update the handleSave function:
// In the handleSave function:
const handleSave = () => {
  if (!form.PARTY_KEY || !form.PARTYDTL_ID) {
    toast.error("Please select a Party and Branch before proceeding.");
    return;
  }

  const itemsToSave = allFetchedData
    .filter(item => (orderQuantities[item._key] || 0) > 0)
    .map(item => ({
      ...item,
      ORD_QTY: orderQuantities[item._key] || 0
    }));

  if (itemsToSave.length === 0) {
    toast.error("Please enter order quantities greater than 0 before proceeding.");
    return;
  }

  const selectedBranch = partyDtls.find(detail => detail.PARTYDTL_ID === form.PARTYDTL_ID);

  setModalData({
    items: itemsToSave,
    partyKey: form.PARTY_KEY,
    partyDtlId: form.PARTYDTL_ID,
    branchName: selectedBranch?.PLACE || "",
    FCYR_KEY: localStorage.getItem('financialYear') || '25',
    COBR_ID: localStorage.getItem('companyBranch') || '02', // Add this
    CO_ID: localStorage.getItem('companyId') || '01' // Add this
  });
  setModalOpen(true);
};

  // Handle cancel action
  const handleCancel = () => {
    router.push("/dashboard/stock-enquiry-table");
  };

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (!isCustomer) {
      debounce(fetchPartiesByName, 300)(val);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle party selection
  const handleSelectParty = (party) => {
    setForm(prev => ({
      ...prev,
      PARTY_KEY: party.PARTY_KEY,
      PARTY_NAME: party.PARTY_NAME,
    }));
    setSearchTerm(party.PARTY_NAME);
    setShowSuggestions(false);
    setPartySearchResults([]);
  };

  // Button styles
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

  // Process data for the table
  const processedData = useMemo(() => {
    let result = [...tableData];

    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = result.filter(row =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return String(row[key] || "").toLowerCase().includes(value.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (['ORD_QTY', 'MRP', 'PACK_QTY', 'WEIGHT'].includes(sortConfig.key)) {
          const aValue = parseFloat(a[sortConfig.key]) || 0;
          const bValue = parseFloat(b[sortConfig.key]) || 0;
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
        const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tableData, filters, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, page, rowsPerPage]);

  return (
    <div className="p-2 w-full">
      <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>
        <Box sx={{ width: "100%", px: isMobile ? 1 : 2, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 220 }}>
              <Autocomplete
                id="party-autocomplete"
                options={partySearchResults}
                getOptionLabel={(option) => option.PARTY_NAME || ''}
                value={partySearchResults.find(party => party.PARTY_KEY === form.PARTY_KEY) || null}
                onChange={(event, newValue) => {
                  setForm(prev => ({
                    ...prev,
                    PARTY_KEY: newValue?.PARTY_KEY || ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Party by Name"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '36px',
                      },
                      '& .MuiInputLabel-outlined': {
                        transform: 'translate(14px, 9px) scale(1)',
                        '&.MuiInputLabel-shrink': {
                          transform: 'translate(14px, -6px) scale(0.75)'
                        }
                      }
                    }}
                  />
                )}
                sx={{ width: '100%', maxWidth: 220 }}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: '150px', maxWidth: '150px' }}>
              <Autocomplete
                id="branch-autocomplete"
                options={partyDtls}
                getOptionLabel={(option) => option.PLACE || ''}
                value={partyDtls.find(dtl => dtl.PARTYDTL_ID === form.PARTYDTL_ID) || null}
                onChange={(event, newValue) => {
                  setForm(prev => ({
                    ...prev,
                    PARTYDTL_ID: newValue?.PARTYDTL_ID || ""
                  }));
                }}
                disabled={!form.PARTY_KEY}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branch"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '36px',
                      },
                      '& .MuiInputLabel-outlined': {
                        transform: 'translate(14px, 9px) scale(1)',
                        '&.MuiInputLabel-shrink': {
                          transform: 'translate(14px, -6px) scale(0.75)'
                        }
                      }
                    }}
                  />
                )}
                sx={{ width: '100%', minWidth: '150px', maxWidth: '150px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={selectedFilter}
                  onChange={(e) => handleFilterSelect(e.target.value)}
                  sx={{
                    height: '36px',
                    '& .MuiSelect-select': {
                      padding: '8px 12px'
                    }
                  }}
                >
                  <MenuItem value="Product Group">Product Group</MenuItem>
                  <MenuItem value="Product Type">Product Type</MenuItem>
                  <MenuItem value="Series">Series</MenuItem>
                  <MenuItem value="Age">Age</MenuItem>
                  <MenuItem value="Gender">Gender</MenuItem>
                  <MenuItem value="Discount">Discount</MenuItem>
                </Select>
              </FormControl>

              <Autocomplete
                sx={{ width: 150 }}
                options={dropdownOptions}
                getOptionLabel={(option) => option.name || ''}
                loading={dropdownLoading}
                value={selectedDropdownValue}
                onChange={handleDropdownValueSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Select ${selectedFilter}`}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '36px',
                      },
                      '& .MuiInputLabel-outdated': {
                        transform: 'translate(14px, 9px) scale(1)',
                        '&.MuiInputLabel-shrink': {
                          transform: 'translate(14px, -6px) scale(0.75)'
                        }
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {dropdownLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, width: "100%" }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  ...addButtonStyles,
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#45a049" }
                }}
                onClick={handleGetData}
              >
                Get Data
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={addButtonStyles}
                onClick={handleSave}
              >
                Save
              </Button>
              
              <Button
                variant="contained"
                size="small"
                sx={addButtonStyles}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>

        <div style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
          {isLoading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <ReusableHandsontable
                data={paginatedData}
                columns={handsontableColumns}
                height="auto"
                width="100%"
                colHeaders={true}
                rowHeaders={true}
                afterChange={handleAfterChange}
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
                  licenseKey: "non-commercial-and-evaluation",
                  cells: (row, col, prop) => {
                    const cellProperties = {};
                    const column = handsontableColumns.find(colDef => colDef.field === prop);
                    
                    // Set readOnly based on column definition
                    if (column) {
                      cellProperties.readOnly = column.readOnly;
                    }
                    
                    if (prop === 'ORD_QTY') {
                      cellProperties.type = 'numeric';
                      cellProperties.validator = (value, callback) => {
                        if (value >= 0) {
                          callback(true);
                        } else {
                          callback(false);
                        }
                      };
                    }
                    return cellProperties;
                  }
                }}
              />
              <TablePagination
                rowsPerPageOptions={[25, 50, 100, 250, 500, 1000, 3000]}
                component="div"
                count={processedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  "& .MuiTablePagination-toolbar": {
                    minHeight: "52px",
                  },
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
     <ConfirmModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  modalData={modalData?.items || []}
  PARTY_KEY={modalData?.partyKey || ""}
  PARTYDTL_ID={modalData?.partyDtlId || ""}
  branchName={modalData?.branchName || ""}
  columns={handsontableColumns.filter(col => col.field !== "ORD_QTY")}
  FCYR_KEY={modalData?.FCYR_KEY}
  COBR_ID={modalData?.COBR_ID} // Add this
  CO_ID={modalData?.CO_ID} // Add this
/>
    </div>
  );
}