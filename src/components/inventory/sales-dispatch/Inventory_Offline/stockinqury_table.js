// 'use client';
// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { 
//   Box, 
//   Button, 
//   Tooltip, 
//   TextField, 
//   CircularProgress,
//   List, 
//   ListItem, 
//   ListItemButton, 
//   ListItemText, 
//   Paper, 
//   Autocomplete, 
//   useMediaQuery,
//   useTheme, 
//   FormControl,
//   Select, 
//   MenuItem,
//   TablePagination,
//   Typography
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from '@mui/icons-material/Search';
// import { ClickAwayListener } from "@mui/material";
// import axiosInstance from "@/lib/axios";
// import ReusableTable, { getCustomDateFilter } from '../../../datatable/ReusableTable';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import ConfirmModal from './ConfirmModal';

// // AG Grid Column Definitions
// const columnDefs = [
//   { 
//     headerName: "Select", 
//     width: 50, 
//     maxWidth: 40, 
//     checkboxSelection: true,
//     headerCheckboxSelection: true,
//     lockPosition: true,
//     suppressMenu: true,
//     sortable: false,
//     filter: false,
//     resizable: false,
//     headerClass: 'checkbox-header'
//   },
//   { 
//     field: "FGCAT_NAME", 
//     headerName: "Category", 
//     width: 140,
//      filter: 'agSetColumnFilter',
//     filterParams: {
//       defaultToNothingSelected: true, 
//     },
//     sortable: true
//   },
//   { 
//     field: "FGPRD_ABRV", 
//     headerName: "Product", 
//     width: 200,
//       filter: 'agSetColumnFilter',
//     filterParams: {
//       defaultToNothingSelected: true, 
//     },
//     sortable: true
//   },
//   { 
//     field: "COLLECTION_NAME", 
//     headerName: "Series", 
//     width: 130,
//      filter: 'agSetColumnFilter',
//     filterParams: {
//       defaultToNothingSelected: true, 
//     },
//     sortable: true
//   },
//   { 
//     field: "FGSTYLE_CODE", 
//     headerName: "StyleCode", 
//     width: 130,
//       filter: 'agSetColumnFilter',
//     filterParams: {
//       defaultToNothingSelected: true, 
//     },
//     sortable: true
//   },
//   { 
//     field: "FGSTYLE_NAME", 
//     headerName: "Style", 
//     width: 130,
//      filter: 'agSetColumnFilter',
//     filterParams: {
//       defaultToNothingSelected: true, 
//     },
//     sortable: true
//   },
//   { 
//     field: "FGSHADE_NAME", 
//     headerName: "Shade", 
//     width: 130,
//       filter: 'agSetColumnFilter',
//     filterParams: {
//       defaultToNothingSelected: true, 
//     },
//     sortable: true
//   },
//   { 
//     field: "STYSIZE_NAME", 
//     headerName: "Size", 
//     width: 130,
//      filter: 'agSetColumnFilter',
//     filterParams: {
//       defaultToNothingSelected: true, 
//     },
//     sortable: true
//   },
//   { 
//     field: "PACK_QTY", 
//     headerName: "PackOf", 
//     width: 130,
//     filter: 'agNumberColumnFilter',
//     sortable: true
//   },
//   { 
//     field: "ORD_QTY", 
//     headerName: "OrdQty", 
//     width: 130,
//     filter: 'agNumberColumnFilter',
//     sortable: true,
//     editable: true,
//     cellRenderer: 'agAnimateShowChangeCellRenderer',
//     cellStyle: { backgroundColor: '#f5f5f5' }
//   },
//   { 
//     field: "WEIGHT", 
//     headerName: "PerBox", 
//     width: 130,
//     filter: 'agNumberColumnFilter',
//     sortable: true
//   },
//   { 
//     field: "MRP", 
//     headerName: "MRP", 
//     width: 130,
//     filter: 'agNumberColumnFilter',
//     sortable: true,
//     valueFormatter: (params) => {
//       if (params.value != null) {
//         return new Intl.NumberFormat('en-IN', {
//           style: 'currency',
//           currency: 'INR',
//           minimumFractionDigits: 2
//         }).format(params.value);
//       }
//       return '';
//     }
//   },
//   { 
//     field: "BARCODE", 
//     headerName: "Barcode", 
//     width: 130,
//       filter: 'agSetColumnFilter',
//     filterParams: {
//       defaultToNothingSelected: true, 
//     },
//     sortable: true
//   },
//   { 
//     field: "EAN_CODE", 
//     headerName: "EAN", 
//     width: 130,
//       filter: 'agSetColumnFilter',
//     filterParams: {
//       defaultToNothingSelected: true, 
//     },
//     sortable: true
//   },
// ];

// const filterTypeToFlag = {
//   'Product Group': 'Group',
//   'Product Type': 'Type',
//   'Series': 'Series',
//   'Age': 'Age',
//   'Gender': 'Gender',
//   'Discount': 'Disc'
// };

// export default function StockInquiryTable() {
//   const theme = useTheme();
//   const router = useRouter();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
//   // State management
//   const [isLoading, setIsLoading] = useState(true);
//   const [tableData, setTableData] = useState([]);
//   const [partyDtls, setPartyDtls] = useState([]);
//   const [partySearchResults, setPartySearchResults] = useState([]);
//   const [isCustomer, setIsCustomer] = useState(false);
//   const [dropdownOptions, setDropdownOptions] = useState([]);
//   const [dropdownLoading, setDropdownLoading] = useState(false);
//   const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);
//   const [selectedFilter, setSelectedFilter] = useState('Product Group');
//   const [form, setForm] = useState({
//     PARTY_KEY: "",
//     PARTYDTL_ID: "",
//     PARTY_NAME: "",
//     Series: "", Group: "", Type: "", Disc: "", Age: "", Gender: ""
//   });
//   const [allFetchedData, setAllFetchedData] = useState([]);
//   const [orderQuantities, setOrderQuantities] = useState({});
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const gridRef = useRef(null);

//   // Initialize component
//   useEffect(() => {
//     const userRole = localStorage.getItem('userRole');
//     if (userRole === 'customer') {
//       setIsCustomer(true);
//       const storedPartyName = localStorage.getItem('PARTY_NAME');
//       const storedPartyKey = localStorage.getItem('PARTY_KEY');
//       setForm(prev => ({
//         ...prev,
//         PARTY_KEY: storedPartyKey || "",
//         PARTYDTL_ID: "",
//       }));
//     }
    
//     // Set default filter to "Product Group"
//     setSelectedFilter('Product Group');
//     fetchDropdownData('Product Group');
//     fetchPartiesByName();
//   }, []);

//   // Debounce function
//   const debounce = (func, delay) => {
//     let timer;
//     return (...args) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => {
//         func(...args);
//       }, delay);
//     };
//   };

//   // Fetch dropdown data
//   const fetchDropdownData = async (filterType) => {
//     const flag = filterTypeToFlag[filterType];
//     if (!flag) return;

//     setDropdownLoading(true);
//     try {
//       const response = await axiosInstance.post("StockEnqiry/GetDropDownStockDashBoard", {
//         PageNumber: 1,
//         PageSize: 100,
//         SearchText: "",
//         Flag: flag
//       });

//       if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
//         const options = response.data.DATA.map(item => ({
//           id: item.ID,
//           name: item.NAME
//         }));

//         setDropdownOptions(options);

//         // Auto-select first option (index 0)
//         if (options.length > 0) {
//           setSelectedDropdownValue(options[0]);
//           setForm(prev => ({
//             ...prev,
//             [flag]: options[0].name
//           }));
//         }
//       } else {
//         setDropdownOptions([]);
//         setSelectedDropdownValue(null);
//       }
//     } catch (error) {
//       console.error("Error fetching dropdown data:", error);
//       setDropdownOptions([]);
//       setSelectedDropdownValue(null);
//     } finally {
//       setDropdownLoading(false);
//     }
//   };

//   // Handle filter selection
//   const handleFilterSelect = (filterType) => {
//     setSelectedFilter(filterType);
//     fetchDropdownData(filterType);
//   };

//   // Handle dropdown value selection
//   const handleDropdownValueSelect = (event, newValue) => {
//     setSelectedDropdownValue(newValue);
//     const flag = filterTypeToFlag[selectedFilter];
//     if (flag && newValue) {
//       setForm(prev => ({
//         ...prev,
//         [flag]: newValue.name
//       }));
//     }
//   };

//   // Get filtered data
//   const handleGetData = async () => {
//     setIsLoading(true);
//     try {
//       const flag = filterTypeToFlag[selectedFilter];
//       const searchText = selectedDropdownValue ?
//         (selectedDropdownValue.name === "(ALL)" ? "" : selectedDropdownValue.name) : '';

//       const response = await axiosInstance.post("StockEnqiry/GetFilterStockDashBoard", {
//         SearchText: searchText,
//         Flag: flag,
//         FCYR_KEY: localStorage.getItem('financialYear') || '25',
//         COBR_ID: localStorage.getItem('companyBranch') || '02'
//       });

//       if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
//         // Generate unique keys for each item
//         const newData = response.data.DATA.map(item => {
//           const uniqueKey = `${item.FGSTYLE_CODE}_${item.FGSHADE_NAME}_${item.STYSIZE_NAME}`;
//           return {
//             ...item,
//             id: Math.random().toString(36).substr(2, 9),
//             _key: uniqueKey,
//             ORD_QTY: orderQuantities[uniqueKey] || 0
//           };
//         });

//         // Update master data list - merge with existing data
//         setAllFetchedData(prev => {
//           const merged = [...prev];
//           newData.forEach(newItem => {
//             const existingIndex = merged.findIndex(item => item._key === newItem._key);
//             if (existingIndex >= 0) {
//               merged[existingIndex] = {
//                 ...merged[existingIndex],
//                 ...newItem,
//                 ORD_QTY: orderQuantities[newItem._key] || merged[existingIndex].ORD_QTY || 0
//               };
//             } else {
//               merged.push(newItem);
//             }
//           });
//           return merged;
//         });

//         setTableData(newData);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to fetch data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     handleGetData();
//   }, []);

//   // Fetch parties by name
//   const fetchPartiesByName = async () => {
//     try {
//       const response = await axiosInstance.post("Party/GetPartyDrp", {});
//       if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
//         setPartySearchResults(response.data.DATA);
//       } else {
//         setPartySearchResults([]);
//       }
//     } catch (error) {
//       console.error("API error", error);
//       setPartySearchResults([]);
//     }
//   };

//   // Handle party details fetch
//   useEffect(() => {
//     const fetchPartyDetails = async () => {
//       if (!form.PARTY_KEY) {
//         setPartyDtls([]);
//         setForm(prev => ({
//           ...prev,
//           PARTYDTL_ID: ""
//         }));
//         return;
//       }

//       setIsLoading(true);
//       try {
//         const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
//           PARTY_KEY: form.PARTY_KEY,
//         });
//         const { STATUS, DATA } = response.data;
//         if (STATUS === 0 && Array.isArray(DATA)) {
//           const validDetails = DATA.filter((d) => d.PARTYDTL_ID && d.PLACE);
//           setPartyDtls(validDetails);
//           if (validDetails.length > 0 && !form.PARTYDTL_ID) {
//             setForm(prev => ({
//               ...prev,
//               PARTYDTL_ID: validDetails[0].PARTYDTL_ID
//             }));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching party details:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPartyDetails();
//   }, [form.PARTY_KEY]);

//   // Handle cell value changes in the table
//   const onCellValueChanged = useCallback((event) => {
//     if (event.colDef.field === 'ORD_QTY') {
//       const item = event.data;
//       if (item && item._key) {
//         const value = Math.max(0, parseInt(event.newValue) || 0);
//         setOrderQuantities(prev => ({
//           ...prev,
//           [item._key]: value
//         }));
        
//         // Update all fetched data
//         setAllFetchedData(prev => {
//           return prev.map(dataItem => {
//             if (dataItem._key === item._key) {
//               return {
//                 ...dataItem,
//                 ORD_QTY: value
//               };
//             }
//             return dataItem;
//           });
//         });
//       }
//     }
//   }, []);

//   // Handle save action
//   const handleSave = () => {
//     if (!form.PARTY_KEY || !form.PARTYDTL_ID) {
//       toast.error("Please select a Party and Branch before proceeding.");
//       return;
//     }

//     const itemsToSave = allFetchedData
//       .filter(item => (orderQuantities[item._key] || 0) > 0)
//       .map(item => ({
//         ...item,
//         ORD_QTY: orderQuantities[item._key] || 0
//       }));

//     if (itemsToSave.length === 0) {
//       toast.error("Please enter order quantities greater than 0 before proceeding.");
//       return;
//     }

//     const selectedBranch = partyDtls.find(detail => detail.PARTYDTL_ID === form.PARTYDTL_ID);

//     setModalData({
//       items: itemsToSave,
//       partyKey: form.PARTY_KEY,
//       partyDtlId: form.PARTYDTL_ID,
//       branchName: selectedBranch?.PLACE || "",
//       FCYR_KEY: localStorage.getItem('financialYear') || '25',
//       COBR_ID: localStorage.getItem('companyBranch') || '02',
//       CO_ID: localStorage.getItem('companyId') || '01'
//     });
//     setModalOpen(true);
//   };

//   // Handle cancel action
//   const handleCancel = () => {
//     router.push("/dashboard/stock-enquiry-table");
//   };

//   // Handle selection changes
//   const handleSelectionChanged = useCallback((event) => {
//     const selectedNodes = event.api.getSelectedNodes();
//     const selectedData = selectedNodes.map(node => node.data);
//     setSelectedRows(selectedData);
//   }, []);

//   // Button styles
//   const addButtonStyles = {
//     background: "#39ace2",
//     height: 40,
//     color: "white",
//     borderRadius: "10px !important",
//     padding: "5px 20px",
//     boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
//     transition: "background 0.3s ease",
//     "&:hover": { background: "#2199d6" },
//     "&:disabled": {
//       backgroundColor: "#39ace2",
//       color: "rgba(0, 0, 0, 0.26)",
//     },
//   };

//   return (
//     <div className="p-2 w-full">
//       <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>
//         <Box sx={{ width: "100%", px: isMobile ? 1 : 2, mb: 2 }}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               justifyContent: "flex-start",
//               alignItems: "center",
//               gap: 2,
//               mb: 2,
//             }}
//           >
//             <Box sx={{ width: "100%", maxWidth: 220 }}>
//               <Autocomplete
//                 id="party-autocomplete"
//                 options={partySearchResults}
//                 getOptionLabel={(option) => option.PARTY_NAME || ''}
//                 value={partySearchResults.find(party => party.PARTY_KEY === form.PARTY_KEY) || null}
//                 onChange={(event, newValue) => {
//                   setForm(prev => ({
//                     ...prev,
//                     PARTY_KEY: newValue?.PARTY_KEY || ''
//                   }));
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Search Party by Name"
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         height: '36px',
//                       },
//                       '& .MuiInputLabel-outlined': {
//                         transform: 'translate(14px, 9px) scale(1)',
//                         '&.MuiInputLabel-shrink': {
//                           transform: 'translate(14px, -6px) scale(0.75)'
//                         }
//                       }
//                     }}
//                   />
//                 )}
//                 sx={{ width: '100%', maxWidth: 220 }}
//               />
//             </Box>

//             <Box sx={{ flex: 1, minWidth: '150px', maxWidth: '150px' }}>
//               <Autocomplete
//                 id="branch-autocomplete"
//                 options={partyDtls}
//                 getOptionLabel={(option) => option.PLACE || ''}
//                 value={partyDtls.find(dtl => dtl.PARTYDTL_ID === form.PARTYDTL_ID) || null}
//                 onChange={(event, newValue) => {
//                   setForm(prev => ({
//                     ...prev,
//                     PARTYDTL_ID: newValue?.PARTYDTL_ID || ""
//                   }));
//                 }}
//                 disabled={!form.PARTY_KEY}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Branch"
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         height: '36px',
//                       },
//                       '& .MuiInputLabel-outlined': {
//                         transform: 'translate(14px, 9px) scale(1)',
//                         '&.MuiInputLabel-shrink': {
//                           transform: 'translate(14px, -6px) scale(0.75)'
//                         }
//                       }
//                     }}
//                   />
//                 )}
//                 sx={{ width: '100%', minWidth: '150px', maxWidth: '150px' }}
//               />
//             </Box>

//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <FormControl sx={{ minWidth: 150 }}>
//                 <Select
//                   value={selectedFilter}
//                   onChange={(e) => handleFilterSelect(e.target.value)}
//                   sx={{
//                     height: '36px',
//                     '& .MuiSelect-select': {
//                       padding: '8px 12px'
//                     }
//                   }}
//                 >
//                   <MenuItem value="Product Group">Product Group</MenuItem>
//                   <MenuItem value="Product Type">Product Type</MenuItem>
//                   <MenuItem value="Series">Series</MenuItem>
//                   <MenuItem value="Age">Age</MenuItem>
//                   <MenuItem value="Gender">Gender</MenuItem>
//                   <MenuItem value="Discount">Discount</MenuItem>
//                 </Select>
//               </FormControl>

//               <Autocomplete
//                 sx={{ width: 150 }}
//                 options={dropdownOptions}
//                 getOptionLabel={(option) => option.name || ''}
//                 loading={dropdownLoading}
//                 value={selectedDropdownValue}
//                 onChange={handleDropdownValueSelect}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label={`Select ${selectedFilter}`}
//                     variant="outlined"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         height: '36px',
//                       },
//                       '& .MuiInputLabel-outdated': {
//                         transform: 'translate(14px, 9px) scale(1)',
//                         '&.MuiInputLabel-shrink': {
//                           transform: 'translate(14px, -6px) scale(0.75)'
//                         }
//                       }
//                     }}
//                     InputProps={{
//                       ...params.InputProps,
//                       endAdornment: (
//                         <>
//                           {dropdownLoading ? <CircularProgress color="inherit" size={20} /> : null}
//                           {params.InputProps.endAdornment}
//                         </>
//                       ),
//                     }}
//                   />
//                 )}
//               />
//             </Box>

//             <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, width: "100%" }}>
//               <Button
//                 variant="contained"
//                 size="small"
//                 sx={{
//                   ...addButtonStyles,
//                   backgroundColor: "#4caf50",
//                   "&:hover": { backgroundColor: "#45a049" }
//                 }}
//                 onClick={handleGetData}
//               >
//                 Get Data
//               </Button>
//               <Button
//                 variant="contained"
//                 size="small"
//                 sx={addButtonStyles}
//                 onClick={handleSave}
//               >
//                 Save
//               </Button>
              
//               {/* <Button
//                 variant="contained"
//                 size="small"
//                 sx={addButtonStyles}
//                 onClick={handleCancel}
//               >
//                 Cancel
//               </Button> */}

//                <Button onClick={handleCancel} variant="outlined" sx={{  borderRadius: "10px !important", borderColor: "#f44336", color: "#f44336" }}>
//                             Cancel
//                           </Button>
//             </Box>
//           </Box>
//         </Box>

//         <div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
//           {isLoading ? (
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'center', 
//               alignItems: 'center', 
//               height: '100%' 
//             }}>
//               <CircularProgress />
//             </div>
//           ) : (
//             <ReusableTable
//               ref={gridRef}
//               columnDefs={columnDefs}
//               rowData={tableData}
//               height="100%"
//               theme="ag-theme-quartz"
//               isDarkMode={false}
//               pagination={true}
//               paginationPageSize={25}
//               paginationPageSizeSelector={[25, 50, 100, 250, 500, 1000,3000]}
//               quickFilter={true}
//               onSelectionChanged={handleSelectionChanged}
//               loading={isLoading}
//               enableExport={true}
//               exportSelectedOnly={true}
//               selectedRows={selectedRows}
//               enableCheckbox={true}
//               compactMode={true}
//               rowHeight={24}
//               defaultColDef={{
//                 resizable: true,
//                 sortable: true,
//                 filter: true,
//                 flex: 1,
//                 minWidth: 100,
//                 editable: false,
//               }}
//               customGridOptions={{
//                 suppressRowClickSelection: true,
//                 rowSelection: 'multiple',
//                 animateRows: true,
//                 enableCellTextSelection: true,
//                 ensureDomOrder: true,
//                 onCellValueChanged: onCellValueChanged
//               }}
//             />
//           )}
//         </div>
//       </div>

//       {/* Confirm Modal */}
//       <ConfirmModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         modalData={modalData?.items || []}
//         PARTY_KEY={modalData?.partyKey || ""}
//         PARTYDTL_ID={modalData?.partyDtlId || ""}
//         branchName={modalData?.branchName || ""}
//         columns={columnDefs.filter(col => col.field !== "ORD_QTY")}
//         FCYR_KEY={modalData?.FCYR_KEY}
//         COBR_ID={modalData?.COBR_ID}
//         CO_ID={modalData?.CO_ID}
//       />
//     </div>
//   );
// }





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
import axiosInstance from "@/lib/axios";
import ReusableTable, { getCustomDateFilter } from '../../../datatable/ReusableTable';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';
import { useLocalization } from '@/context/LocalizationContext';

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
  const { t, language, changeLanguage } = useLocalization();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [partyDtls, setPartyDtls] = useState([]);
  const [partySearchResults, setPartySearchResults] = useState([]);
  const [isCustomer, setIsCustomer] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);
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
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  // AG Grid Column Definitions with localization
  const columnDefs = useMemo(() => [
    { 
      headerName: t('select'), 
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
      field: "FGCAT_NAME", 
      headerName: t('category'), 
      width: 140,
       filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true, 
      },
      sortable: true
    },
    { 
      field: "FGPRD_ABRV", 
      headerName: t('product'), 
      width: 200,
        filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true, 
      },
      sortable: true
    },
    { 
      field: "COLLECTION_NAME", 
      headerName: t('series'), 
      width: 130,
       filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true, 
      },
      sortable: true
    },
    { 
      field: "FGSTYLE_CODE", 
      headerName: t('styleCode'), 
      width: 130,
        filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true, 
      },
      sortable: true
    },
    { 
      field: "FGSTYLE_NAME", 
      headerName: t('style'), 
      width: 130,
       filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true, 
      },
      sortable: true
    },
    { 
      field: "FGSHADE_NAME", 
      headerName: t('shade'), 
      width: 130,
        filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true, 
      },
      sortable: true
    },
    { 
      field: "STYSIZE_NAME", 
      headerName: t('size'), 
      width: 130,
       filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true, 
      },
      sortable: true
    },
    { 
      field: "PACK_QTY", 
      headerName: t('packOf'), 
      width: 130,
      filter: 'agNumberColumnFilter',
      sortable: true
    },
    { 
      field: "ORD_QTY", 
      headerName: t('ordQty'), 
      width: 130,
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: true,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
      cellStyle: { backgroundColor: '#f5f5f5' }
    },
    { 
      field: "WEIGHT", 
      headerName: t('perBox'), 
      width: 130,
      filter: 'agNumberColumnFilter',
      sortable: true
    },
    { 
      field: "MRP", 
      headerName: "MRP", 
      width: 130,
      filter: 'agNumberColumnFilter',
      sortable: true,
      valueFormatter: (params) => {
        if (params.value != null) {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
          }).format(params.value);
        }
        return '';
      }
    },
    { 
      field: "BARCODE", 
      headerName: t('barcode'), 
      width: 130,
        filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true, 
      },
      sortable: true
    },
    { 
      field: "EAN_CODE", 
      headerName: "EAN", 
      width: 130,
        filter: 'agSetColumnFilter',
      filterParams: {
        defaultToNothingSelected: true, 
      },
      sortable: true
    },
  ], [t]);

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
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(language === 'hi' ? "डेटा प्राप्त करने में विफल" : "Failed to fetch data");
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

  // Handle cell value changes in the table
  const onCellValueChanged = useCallback((event) => {
    if (event.colDef.field === 'ORD_QTY') {
      const item = event.data;
      if (item && item._key) {
        const value = Math.max(0, parseInt(event.newValue) || 0);
        setOrderQuantities(prev => ({
          ...prev,
          [item._key]: value
        }));
        
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
  }, []);

  // Handle save action
  const handleSave = () => {
    if (!form.PARTY_KEY || !form.PARTYDTL_ID) {
      toast.error(language === 'hi' 
        ? "कृपया आगे बढ़ने से पहले एक पार्टी और शाखा चुनें।" 
        : "Please select a Party and Branch before proceeding."
      );
      return;
    }

    const itemsToSave = allFetchedData
      .filter(item => (orderQuantities[item._key] || 0) > 0)
      .map(item => ({
        ...item,
        ORD_QTY: orderQuantities[item._key] || 0
      }));

    if (itemsToSave.length === 0) {
      toast.error(language === 'hi'
        ? "कृपया आगे बढ़ने से पहले 0 से अधिक ऑर्डर मात्रा दर्ज करें।"
        : "Please enter order quantities greater than 0 before proceeding."
      );
      return;
    }

    const selectedBranch = partyDtls.find(detail => detail.PARTYDTL_ID === form.PARTYDTL_ID);

    setModalData({
      items: itemsToSave,
      partyKey: form.PARTY_KEY,
      partyDtlId: form.PARTYDTL_ID,
      branchName: selectedBranch?.PLACE || "",
      FCYR_KEY: localStorage.getItem('financialYear') || '25',
      COBR_ID: localStorage.getItem('companyBranch') || '02',
      CO_ID: localStorage.getItem('companyId') || '01'
    });
    setModalOpen(true);
  };

  // Handle cancel action
  const handleCancel = () => {
    router.push("/dashboard/stock-enquiry-table");
  };

  // Handle selection changes
  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
  }, []);

  // Button styles
  const addButtonStyles = {
    background: "#39ace2",
    height: 40,
    color: "white",
    borderRadius: "10px !important",
    padding: "5px 20px",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
    transition: "background 0.3s ease",
    "&:hover": { background: "#2199d6" },
    "&:disabled": {
      backgroundColor: "#39ace2",
      color: "rgba(0, 0, 0, 0.26)",
    },
  };

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
                    label={language === 'hi' ? "पार्टी नाम से खोजें" : "Search Party by Name"}
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
                    label={language === 'hi' ? "शाखा" : "Branch"}
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
                  <MenuItem value="Product Group">
                    {language === 'hi' ? 'उत्पाद समूह' : 'Product Group'}
                  </MenuItem>
                  <MenuItem value="Product Type">
                    {language === 'hi' ? 'उत्पाद प्रकार' : 'Product Type'}
                  </MenuItem>
                  <MenuItem value="Series">
                    {language === 'hi' ? 'श्रृंखला' : 'Series'}
                  </MenuItem>
                  <MenuItem value="Age">
                    {language === 'hi' ? 'आयु' : 'Age'}
                  </MenuItem>
                  <MenuItem value="Gender">
                    {language === 'hi' ? 'लिंग' : 'Gender'}
                  </MenuItem>
                  <MenuItem value="Discount">
                    {language === 'hi' ? 'छूट' : 'Discount'}
                  </MenuItem>
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
                    label={language === 'hi' ? `${selectedFilter} चुनें` : `Select ${selectedFilter}`}
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
                {language === 'hi' ? 'डेटा प्राप्त करें' : 'Get Data'}
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={addButtonStyles}
                onClick={handleSave}
              >
                {language === 'hi' ? 'सेव करें' : 'Save'}
              </Button>
              
              <Button 
                onClick={handleCancel} 
                variant="outlined" 
                sx={{  
                  borderRadius: "10px !important", 
                  borderColor: "#f44336", 
                  color: "#f44336" 
                }}
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </Button>
            </Box>
          </Box>
        </Box>

        <div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
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
            <ReusableTable
              ref={gridRef}
              columnDefs={columnDefs}
              rowData={tableData}
              height="100%"
              theme="ag-theme-quartz"
              isDarkMode={false}
              pagination={true}
              paginationPageSize={25}
              paginationPageSizeSelector={[25, 50, 100, 250, 500, 1000,3000]}
              quickFilter={true}
              onSelectionChanged={handleSelectionChanged}
              loading={isLoading}
              enableExport={true}
              exportSelectedOnly={true}
              selectedRows={selectedRows}
              enableCheckbox={true}
              compactMode={true}
              rowHeight={24}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
                flex: 1,
                minWidth: 100,
                editable: false,
              }}
              customGridOptions={{
                suppressRowClickSelection: true,
                rowSelection: 'multiple',
                animateRows: true,
                enableCellTextSelection: true,
                ensureDomOrder: true,
                onCellValueChanged: onCellValueChanged
              }}
              enableLanguageSwitch={true}
            />
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
        columns={columnDefs.filter(col => col.field !== "ORD_QTY")}
        FCYR_KEY={modalData?.FCYR_KEY}
        COBR_ID={modalData?.COBR_ID}
        CO_ID={modalData?.CO_ID}
      />
    </div>
  );
}