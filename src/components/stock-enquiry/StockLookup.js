// 'use client'
// import React, { useState, useEffect, useCallback } from "react";
// import { Box, Button, Tooltip, TextField, List, ListItem, ListItemButton, ListItemText, Paper } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from '@mui/icons-material/Search';
// import { ClickAwayListener } from "@mui/material";
// import { DataGrid } from '@mui/x-data-grid';
// import axiosInstance from '../../lib/axios';

// const columns = [
//   { field: "ORDBK_NO", headerName: "ORDER_NO", width: 150 },
//   { field: "ORDBK_DT", headerName: "ORDER_Date", width: 150 },
//   { field: "PORD_REF", headerName: "PORD_REF", width: 150 },
//   { field: "DLV_DT", headerName: "DLV_DT", width: 150 },
//   { field: "PARTY_NAME", headerName: "PARTY", width: 150 },
//   { field: "BROKER_NAME", headerName: "BROKER", width: 150 },
//   { field: "SALEPERSON_NAME", headerName: "SALEPERSON", width: 150 },
//   { field: "QTY", headerName: "Quantity", width: 150 },
//   { field: "BAL_QTY", headerName: "Balance_Qty", width: 150 },
//   { field: "AMT", headerName: "Amount", width: 150 },
// ];

// export default function StockLookup() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerms, setSearchTerms] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [partyDtls, setPartyDtls] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [partySearchResults, setPartySearchResults] = useState([]);
//   const [isCustomer, setIsCustomer] = useState(false);
//   const [partyName, setPartyName] = useState("");
//   const [form, setForm] = useState({
//     PARTY_KEY: "",
//     PARTYDTL_ID: "",
//     PARTY_NAME: ""
//   });
//   const [rows, setRows] = useState([]);
//   const [paginationModel, setPaginationModel] = useState({
//     page: 0,
//     pageSize: 15,
//   });

//   useEffect(() => {
//     const userRole = localStorage.getItem('userRole');
//     if (userRole === 'customer') {
//       setIsCustomer(true);
//       const storedPartyName = localStorage.getItem('PARTY_NAME');
//       const storedPartyKey = localStorage.getItem('PARTY_KEY');
//       setForm((prev) => ({
//         ...prev,
//         PARTY_KEY: storedPartyKey || "",
//         PARTYDTL_ID: "",
//       }));
//       setPartyName(storedPartyName || "");
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         PARTY_KEY: "",
//         PARTYDTL_ID: "",
//       }));
//       setSearchTerm("");
//       setIsCustomer(false);
//     }
//   }, []);

//   const debounce = (func, delay) => {
//     let timer;
//     return (...args) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => {
//         func(...args);
//       }, delay);
//     };
//   };

//   const fetchPartiesByName = async (name) => {
//     if (!name) {
//       setPartySearchResults([]);
//       setShowSuggestions(false);
//       return;
//     }
//     try {
//       const response = await axiosInstance.post("Party/GetParty_By_Name", {
//         PARTY_NAME: name,
//       });
//       if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
//         setPartySearchResults(response.data.DATA);
//         setShowSuggestions(true);
//       } else {
//         setPartySearchResults([]);
//         setShowSuggestions(false);
//       }
//     } catch (error) {
//       console.error("API error", error);
//       setPartySearchResults([]);
//       setShowSuggestions(false);
//     }
//   };

//   const debouncedFetch = useCallback(debounce(fetchPartiesByName, 100), []);

//   const handleClickAway = () => {
//     setShowSuggestions(false);
//   };

//   const handleSelectParty = (party) => {
//     setForm((prev) => ({
//       ...prev,
//       PARTY_KEY: party.PARTY_KEY,
//       PARTY_NAME: party.PARTY_NAME,
//     }));
//     setSearchTerm(party.PARTY_NAME);
//     setShowSuggestions(false);
//     setPartySearchResults([]);
//   };

//   useEffect(() => {
//     if (!form.PARTY_KEY) {
//       setPartyDtls([]);
//       setForm((prev) => ({
//         ...prev,
//         PARTYDTL_ID: "",
//       }));
//       return;
//     }

//     const fetchPartyDetails = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
//           PARTY_KEY: form.PARTY_KEY,
//         });
//         const { STATUS, DATA } = response.data;
//         if (STATUS === 0 && Array.isArray(DATA)) {
//           const validDetails = DATA.filter((d) => d.PARTYDTL_ID && d.PLACE);
//           setPartyDtls(validDetails);

//           if (validDetails.length > 0) {
//             setForm((prev) => ({
//               ...prev,
//               PARTYDTL_ID: validDetails[0].PARTYDTL_ID,
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

//   useEffect(() => {
//     fetchTableData();
//   }, [form.PARTY_KEY]);

//   const fetchTableData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axiosInstance.post(`StockEnqiry/GetOrderDashBoard`, {
//         "pageNumber": "1",
//         "PageSize": "1000",
//         "SearchText": form.PARTY_KEY,
//         "Flag": "",
//         "PARTY_KEY": ""
//       });
//       const { data: { STATUS, DATA } } = response;
//       if (STATUS === 0 && Array.isArray(DATA)) {
//         const formattedData = DATA.map((row, index) => ({
//           id: index,
//           ...row,
//           ORDER_Date: row.ORDBK_DT ? new Date(row.ORDBK_DT).toLocaleDateString() : "-",
//           DLV_DT: row.DLV_DT ? new Date(row.DLV_DT).toLocaleDateString() : "-",
//         }));
//         setRows(formattedData);
//       }
//     } catch (error) {
//       console.error("Error fetching productgrp data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearchInputChange = (e) => {
//     const val = e.target.value;
//     setSearchTerm(val);
//     if (!isCustomer) {
//       debouncedFetch(val);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSearchChange = (columnId, value) => {
//     setSearchTerms((prev) => ({ ...prev, [columnId]: value }));
//     setPaginationModel(prev => ({ ...prev, page: 0 }));
//   };

//   const filteredRows = React.useMemo(() => {
//     return rows.filter((row) => {
//       return Object.entries(searchTerms).every(([columnId, term]) => {
//         if (!term) return true;
//         const value = row[columnId] ?? "";
//         if (typeof value === "string") {
//           return value.toLowerCase().includes(term.toLowerCase());
//         } else if (typeof value === "number") {
//           return value.toString().includes(term);
//         }
//         return true;
//       });
//     });
//   }, [searchTerms, rows]);

//   const addButtonStyles = {
//     background: "#39ace2",
//     height: 40,
//     color: "white",
//     borderRadius: "50px",
//     padding: "5px 20px",
//     boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
//     transition: "background 0.3s ease",
//     "&:hover": {
//       background: "#2199d6",
//     },
//     "&:disabled": {
//       backgroundColor: "#39ace2",
//       color: "rgba(0, 0, 0, 0.26)",
//     },
//   };

//   return (
//      <div className="p-2 w-full">
//     <div className="w-full mx-auto" style={{ 
//       maxWidth: '100%',
//       overflow: 'hidden',
       
//     }}>
//         <div className="mb-4 flex flex-wrap gap-4 items-center">
//           {isCustomer ? (
//             <TextField
//               label="Party Name"
//               variant="outlined"
//               fullWidth
//               value={localStorage.getItem('PARTY_NAME') || ''}
//               disabled
//               sx={{
//                 borderRadius: 2,
//                 backgroundColor: '#ffffff',
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                 transition: 'box-shadow 0.3s ease',
//                 '&:hover': {
//                   boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
//                 },
//                 flex: 1,
//                 minWidth: '200px'
//               }}
//             />
//           ) : (
//             <div className="flex-1 min-w-[200px] relative">
//               <TextField
//                 label="Search Party by Name"
//                 variant="outlined"
//                 fullWidth
//                 value={searchTerm}
//                 onChange={handleSearchInputChange}
//                 size="small"
//                 onFocus={() => {
//                   if (partySearchResults.length > 0) setShowSuggestions(true);
//                 }}
//                 InputProps={{
//                   endAdornment: <SearchIcon sx={{ mr: 0 }} />,
//                   sx: {
//                     borderRadius: 2,
//                     height: 40,
//                     alignItems: 'center',
//                     backgroundColor: '#ffffff',
//                     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                     transition: 'box-shadow 0.3s ease',
//                     '&:hover': {
//                       boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
//                     }
//                   }
//                 }}
//                 autoComplete="off"
//               />
//               {showSuggestions && partySearchResults.length > 0 && (
//                 <ClickAwayListener onClickAway={handleClickAway}>
//                   <Paper
//                     sx={{
//                       position: "absolute",
//                       zIndex: 10,
//                       width: "100%",
//                       maxHeight: 250,
//                       overflowY: "auto",
//                       mt: 0.5,
//                       boxShadow: 3,
//                     }}
//                   >
//                     <List dense>
//                       {partySearchResults.map((party) => (
//                         <ListItem key={party.PARTY_KEY} disablePadding>
//                           <ListItemButton onClick={() => handleSelectParty(party)}>
//                             <ListItemText primary={party.PARTY_NAME} />
//                           </ListItemButton>
//                         </ListItem>
//                       ))}
//                     </List>
//                   </Paper>
//                 </ClickAwayListener>
//               )}
//             </div>
//           )}

//          <TextField
//   select
//   label="Branch"
//   variant="outlined"
//   value={form.PARTYDTL_ID}
//   onChange={handleInputChange}
//   size="small"
//   name="PARTYDTL_ID"
//   sx={{
//     width: '200px',
//     borderRadius: 2,
//     backgroundColor: '#ffffff',
//     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//     transition: 'box-shadow 0.3s ease',
//     '&:hover': {
//       boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
//     },
//     '& .MuiInputBase-root': {
//       height: '40px' // Reduced height
//     }
//   }}
// >
//   {partyDtls.map((party) => (
//     <option key={party.PARTYDTL_ID} value={party.PARTYDTL_ID}>
//       {party.PLACE}
//     </option>
//   ))}
// </TextField>

//           <Button
//             variant="contained"
//             size="small"
//             sx={addButtonStyles}
//             startIcon={<AddIcon />}
//           >
//             New
//           </Button>
//         </div>

//       <div style={{ 
//         height: 584,
//         width: '100%',
//         maxWidth: '100%',
//         overflowX: 'hidden'
//       }}>
//   <DataGrid
//           rows={filteredRows}
//           columns={columns.map(col => ({
//             ...col,
//             flex: 1, // Make columns flexible
//             minWidth: 100 // Minimum width for each column
//           }))}
//           loading={isLoading}
//           pageSizeOptions={[15,25, 50, 100]}
//           paginationModel={paginationModel}
//           onPaginationModelChange={setPaginationModel}
//           disableRowSelectionOnClick
//           sx={{
//             width: '100%',
//             maxWidth: '100%',
//             '& .MuiDataGrid-main': {
//               width: '100% !important',
//               maxWidth: '100% !important'
//             },
//             '& .MuiDataGrid-virtualScroller': {
//               overflowX: 'hidden !important',
//               maxWidth: '100% !important'
//             },
//             '& .MuiDataGrid-columnHeaders': {
//               width: '100% !important',
//               maxWidth: '100% !important'
//             },

            
//           }}
//         />
// </div>
//       </div>
//     </div>
//   );
// }



'use client';
import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Tooltip, TextField, List, ListItem, ListItemButton, ListItemText, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from '@mui/icons-material/Search';
import { ClickAwayListener } from "@mui/material";
import axiosInstance from '../../lib/axios';
import ReusableHandsontable from '../datatable/ReusableHandsontable';

const handsontableColumns = [
  { field: "ORDBK_NO", headerName: "ORDER NO", width: 130, type: "text" },
  { field: "ORDER_Date", headerName: "ORDER DATE", width: 130, type: "text" },
  { field: "PORD_REF", headerName: "P ORDER REF", width: 140, type: "text" },
  { field: "DLV_DT", headerName: "DELIVERY DT", width: 130, type: "text" },
  { field: "PARTY_NAME", headerName: "PARTY NAME", width: 200, type: "text" },
  { field: "BROKER_NAME", headerName: "BROKER NAME", width: 160, type: "text" },
  { field: "SALEPERSON_NAME", headerName: "SALES PERSON", width: 160, type: "text" },
  { field: "QTY", headerName: "QUANTITY", width: 120, type: "numeric" },
  { field: "BAL_QTY", headerName: "BALANCE QTY", width: 130, type: "numeric" },
  { field: "AMT", headerName: "AMOUNT", width: 120, type: "numeric" },
];

export default function StockLookup() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [partyDtls, setPartyDtls] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [partySearchResults, setPartySearchResults] = useState([]);
  const [isCustomer, setIsCustomer] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [form, setForm] = useState({
    PARTY_KEY: "",
    PARTYDTL_ID: "",
    PARTY_NAME: ""
  });
  const [rows, setRows] = useState([]);

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
  }, []);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchPartiesByName = async (name) => {
    if (!name) {
      setPartySearchResults([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await axiosInstance.post("Party/GetParty_By_Name", {
        PARTY_NAME: name,
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setPartySearchResults(response.data.DATA);
        setShowSuggestions(true);
      } else {
        setPartySearchResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("API error", error);
      setPartySearchResults([]);
      setShowSuggestions(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchPartiesByName, 300), []);

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

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

  useEffect(() => {
    if (!form.PARTY_KEY) {
      setPartyDtls([]);
      setForm(prev => ({
        ...prev,
        PARTYDTL_ID: "",
      }));
      return;
    }

    const fetchPartyDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
          PARTY_KEY: form.PARTY_KEY,
        });
        const { STATUS, DATA } = response.data;
        if (STATUS === 0 && Array.isArray(DATA)) {
          const validDetails = DATA.filter(d => d.PARTYDTL_ID && d.PLACE);
          setPartyDtls(validDetails);

          if (validDetails.length > 0) {
            setForm(prev => ({
              ...prev,
              PARTYDTL_ID: validDetails[0].PARTYDTL_ID,
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

  useEffect(() => {
    fetchTableData();
  }, [form.PARTY_KEY]);

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`StockEnqiry/GetOrderDashBoard`, {
        "pageNumber": "1",
        "PageSize": "1000",
        "SearchText": form.PARTY_KEY,
        "Flag": "",
        "PARTY_KEY": ""
      });
      const { data: { STATUS, DATA } } = response;
      if (STATUS === 0 && Array.isArray(DATA)) {
        const formattedData = DATA.map((row, index) => ({
          id: index,
          ...row,
          ORDER_Date: row.ORDBK_DT ? new Date(row.ORDBK_DT).toLocaleDateString() : "-",
          DLV_DT: row.DLV_DT ? new Date(row.DLV_DT).toLocaleDateString() : "-",
        }));
        setRows(formattedData);
      }
    } catch (error) {
      console.error("Error fetching productgrp data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (!isCustomer) {
      debouncedFetch(val);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAfterChange = (changes, source) => {
    if (source === 'edit') {
      console.log('Data changed:', changes);
    }
  };

  const handleAfterSelection = (row, column, row2, column2) => {
    console.log('Selection changed:', { row, column, row2, column2 });
  };

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

  return (
    <div className="p-2 w-full">
      <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          {isCustomer ? (
            <TextField
              label="Party Name"
              variant="outlined"
              fullWidth
              value={localStorage.getItem('PARTY_NAME') || ''}
              disabled
              sx={{
                borderRadius: 2,
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.3s ease',
                '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' },
                flex: 1,
                minWidth: '200px'
              }}
            />
          ) : (
            <div className="flex-1 min-w-[200px] relative">
              <TextField
                label="Search Party by Name"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchInputChange}
                size="small"
                onFocus={() => {
                  if (partySearchResults.length > 0) setShowSuggestions(true);
                }}
                InputProps={{
                  endAdornment: <SearchIcon sx={{ mr: 0 }} />,
                  sx: {
                    borderRadius: 2,
                    height: 40,
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }
                  }
                }}
                autoComplete="off"
              />
              {showSuggestions && partySearchResults.length > 0 && (
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Paper
                    sx={{
                      position: "absolute",
                      zIndex: 10,
                      width: "100%",
                      maxHeight: 250,
                      overflowY: "auto",
                      mt: 0.5,
                      boxShadow: 3,
                    }}
                  >
                    <List dense>
                      {partySearchResults.map(party => (
                        <ListItem key={party.PARTY_KEY} disablePadding>
                          <ListItemButton onClick={() => handleSelectParty(party)}>
                            <ListItemText primary={party.PARTY_NAME} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </ClickAwayListener>
              )}
            </div>
          )}

          <TextField
            select
            label="Branch"
            variant="outlined"
            value={form.PARTYDTL_ID}
            onChange={handleInputChange}
            size="small"
            name="PARTYDTL_ID"
            sx={{
              width: '200px',
              borderRadius: 2,
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' },
              '& .MuiInputBase-root': { height: '40px' }
            }}
          >
            {partyDtls.map(party => (
              <option key={party.PARTYDTL_ID} value={party.PARTYDTL_ID}>
                {party.PLACE}
              </option>
            ))}
          </TextField>

          <Button
            variant="contained"
            size="small"
            sx={addButtonStyles}
            startIcon={<AddIcon />}
          >
            New
          </Button>
        </div>

        <div style={{ height: 'calc(100vh - 180px)', width: '100%' }}>
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
            <ReusableHandsontable
              data={rows}
              columns={handsontableColumns}
              height="auto"
              width="100%"
              colHeaders={true}
              rowHeaders={true}
              afterChange={handleAfterChange}
              afterSelection={handleAfterSelection}
              readOnly={true}
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
                licenseKey: "non-commercial-and-evaluation"
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}