// 'use client'
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import {
//     Grid, TextField, Typography, Button, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent,
//     DialogContentText, DialogActions, MenuItem, Select, FormControl, InputLabel
// } from '@mui/material';
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import { toast, ToastContainer } from 'react-toastify'
// import { getFormMode } from '@/lib/helpers';
// import { useRouter } from 'next/navigation';
// import CrudButton from '@/GlobalFunction/CrudButton';
// import axiosInstance from '@/lib/axios';
// import { useSearchParams } from 'next/navigation';
// import { TbListSearch } from "react-icons/tb";

// const FORM_MODE = getFormMode();

// const textInputSx = {
//     '& .MuiInputBase-root': {
//         height: 42,
//         fontSize: '14px',
//     },
//     '& .MuiInputLabel-root': {
//         fontSize: '14px',
//         top: '-8px',
//     },
//     '& .MuiFilledInput-root': {
//         backgroundColor: '#fafafa',
//         border: '1px solid #e0e0e0',
//         borderRadius: '6px',
//         overflow: 'hidden',
//         height: 42,
//         fontSize: '14px',
//     },
//     '& .MuiFilledInput-root:before': {
//         display: 'none',
//     },
//     '& .MuiFilledInput-root:after': {
//         display: 'none',
//     },
//     '& .MuiInputBase-input': {
//         padding: '10px 12px !important',
//         fontSize: '14px !important',
//         lineHeight: '1.4',
//     },
//     '& .MuiFilledInput-root.Mui-disabled': {
//         backgroundColor: '#fff'
//     }
// };

// const selectSx = {
//     '& .MuiInputBase-root': {
//         height: 42,
//         fontSize: '14px',
//     },
//     '& .MuiInputLabel-root': {
//         fontSize: '14px',
//         top: '-8px',
//     },
//     '& .MuiFilledInput-root': {
//         backgroundColor: '#fafafa',
//         border: '1px solid #e0e0e0',
//         borderRadius: '6px',
//         minHeight: 42,
//     },
//     '& .MuiFilledInput-root:before': {
//         display: 'none',
//     },
//     '& .MuiFilledInput-root:after': {
//         display: 'none',
//     },
// };

// const CreateModule = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const MOD_ID = searchParams.get('MOD_ID');
//     const [currentMOD_ID, setCurrentMOD_ID] = useState(null);
//     const [parentModules, setParentModules] = useState([]);
//     const [form, setForm] = useState({
//         SearchByCd: '',
//         MOD_ID: '',
//         MOD_NAME: '',
//         MOD_DESC: '',
//         PARENT_ID: '',
//         MOD_ROUTIG: '',
//         MOD_TBLNAME: '',
//         Status: "1",
//     });
//     const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
//     const MOD_NAMERef = useRef(null);
//     const MOD_DESCRef = useRef(null);
//     const [mode, setMode] = useState(() => {
//         return MOD_ID ? FORM_MODE.read : FORM_MODE.add;
//     });
//     const [Status, setStatus] = useState("1");
//     const CO_ID = localStorage.getItem('CO_ID');
//     const userRole = localStorage.getItem('userRole');
//     const username = localStorage.getItem('USER_NAME');
//     const PARTY_KEY = localStorage.getItem('PARTY_KEY');
//     const COBR_ID = localStorage.getItem('COBR_ID');

//     // Fetch parent modules for dropdown
//     const fetchParentModules = useCallback(async () => {
//         try {
//             const response = await axiosInstance.post('Module/GetWebModulesDashBoard?currentPage=1&limit=1000', {
//                 "SearchText": ""
//             });
//             const { data: { STATUS, DATA } } = response;
//             if (STATUS === 0 && Array.isArray(DATA)) {
//                 // Filter modules where PARENT_ID is "0" (top-level modules)
//                 const topLevelModules = DATA.filter(module => module.PARENT_ID === "0");
//                 setParentModules(topLevelModules);
//             }
//         } catch (err) {
//             console.error("Error fetching parent modules:", err);
//         }
//     }, []);

//     // Fetch module data for retrieve mode
//     const fetchRetriveData = useCallback(async (id, flag = "R", isManualSearch = false) => {
//         try {
//             const response = await axiosInstance.post('Module/RetriveWebModules', {
//                 FLAG: flag,
//                 TBLNAME: "WebMODULES",
//                 FLDNAME: "Mod_ID",
//                 ID: id,
//                 ORDERBYFLD: "",
//                 CWHAER: "",
//                 CO_ID: CO_ID || ""
//             });
            
//             const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            
//             if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE === 1) {
//                 const moduleData = DATA[0];
//                 setForm({
//                     MOD_ID: moduleData.MOD_ID?.toString() || '',
//                     MOD_NAME: moduleData.MOD_NAME || '',
//                     MOD_DESC: moduleData.MOD_DESC || '',
//                     PARENT_ID: moduleData.PARENT_ID?.toString() || '',
//                     MOD_ROUTIG: moduleData.MOD_ROUTIG || '',
//                     MOD_TBLNAME: moduleData.MOD_TBLNAME || '',
//                     Status: moduleData.STATUS || "0",
//                 });
//                 setStatus(moduleData.STATUS || "0");
//                 setCurrentMOD_ID(moduleData.MOD_ID);

//                 const newParams = new URLSearchParams();
//                 newParams.set("MOD_ID", moduleData.MOD_ID);
//                 router.replace(`/createmodule?${newParams.toString()}`);
//             } else {
//                 if (isManualSearch) {
//                     toast.error(`${MESSAGE || 'No data found'} for ID: ${id}`);
//                     resetForm();
//                 }
//             }
//         } catch (err) {
//             console.error("Error fetching data:", err);
//             toast.error("Error fetching module data");
//         }
//     }, [CO_ID, router]);

//     // Reset form function
//     const resetForm = () => {
//         setForm({
//             SearchByCd: '',
//             MOD_ID: '',
//             MOD_NAME: '',
//             MOD_DESC: '',
//             PARENT_ID: '',
//             MOD_ROUTIG: '',
//             MOD_TBLNAME: '',
//             Status: "1",
//         });
//         setStatus("1");
//         setCurrentMOD_ID(null);
//     };

//     useEffect(() => {
//         fetchParentModules();
//     }, [fetchParentModules]);

//     useEffect(() => {
//         if (MOD_ID) {
//             setCurrentMOD_ID(MOD_ID);
//             fetchRetriveData(MOD_ID);
//             setMode(FORM_MODE.read);
//         } else {
//             resetForm();
//             setMode(FORM_MODE.add);
//         }
//     }, [MOD_ID, fetchRetriveData]);

//     const handleChangeStatus = (event) => {
//         const updatedStatus = event.target.checked ? "1" : "0";
//         setStatus(updatedStatus);
//         setForm((prevData) => ({
//             ...prevData,
//             Status: updatedStatus
//         }));
//     };

//     const handleSubmit = async () => {
//         // Validation
//         if (!form.MOD_NAME.trim()) {
//             toast.error("Module Name is required");
//             return;
//         }

//         try {
//             const UserName = userRole === 'user' ? username : PARTY_KEY;
//             let url, payload;

//             if (mode === FORM_MODE.edit && currentMOD_ID) {
//                 // Update API
//                 url = `Module/UpdateWebModules?UserName=${UserName}&strCobrid=${COBR_ID}`;
//                 payload = {
//                     Mod_ID: parseInt(currentMOD_ID),
//                     Mod_Name: form.MOD_NAME,
//                     Mod_Desc: form.MOD_DESC,
//                     Mod_Routig: form.MOD_ROUTIG,
//                     Mod_TblName: form.MOD_TBLNAME,
//                     Parent_ID: form.PARENT_ID || "0",
//                     Status: form.Status,
//                     CreatedBy: 1
//                 };

//                 const response = await axiosInstance.post(url, payload);
//                 const { STATUS, MESSAGE } = response.data;
                
//                 if (STATUS === 0) {
//                     setMode(FORM_MODE.read);
//                     toast.success(MESSAGE, { autoClose: 1000 });
//                     await fetchRetriveData(currentMOD_ID);
//                 } else {
//                     toast.error(MESSAGE, { autoClose: 1000 });
//                 }
//             } else {
//                 // Insert API
//                 url = `Module/InsertWebModules?UserName=${UserName}&strCobrid=${COBR_ID}`;
//                 payload = {
//                     Mod_Name: form.MOD_NAME,
//                     Mod_Desc: form.MOD_DESC,
//                     Mod_Routig: form.MOD_ROUTIG,
//                     Mod_TblName: form.MOD_TBLNAME,
//                     Parent_ID: form.PARENT_ID || "0",
//                     Status: form.Status,
//                     CreatedBy: 1
//                 };

//                 const response = await axiosInstance.post(url, payload);
//                 const { STATUS, MESSAGE, DATA } = response.data;
                
//                 if (STATUS === 0) {
//                     toast.success(MESSAGE, { autoClose: 1000 });
//                     const newParams = new URLSearchParams();
//                     newParams.set("MOD_ID", DATA);
//                     router.push(`/createmodule?${newParams.toString()}`);
//                 } else {
//                     toast.error(MESSAGE, { autoClose: 1000 });
//                 }
//             }
//         } catch (error) {
//             console.error("Submit Error:", error);
//             toast.error("Error submitting form: " + (error.response?.data?.MESSAGE || error.message));
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleCancel = async () => {
//         if (mode === FORM_MODE.add) {
//             resetForm();
//             const params = new URLSearchParams();
//             router.replace(`/createmodule?${params.toString()}`);
//         } else {
//             await fetchRetriveData(currentMOD_ID, "R");
//         }
//         setMode(FORM_MODE.read);
//         setForm((prev) => ({
//             ...prev,
//             SearchByCd: ''
//         }));
//     };

//     const handleTable = () => {
//         router.push("/createmodule/modulestable");
//     };

//     const handleAdd = () => {
//         setMode(FORM_MODE.add);
//         setCurrentMOD_ID(null);
//         resetForm();
//         setForm(prev => ({
//             ...prev,
//             Status: '1'
//         }));
//         setStatus('1');
        
//         const params = new URLSearchParams();
//         router.replace(`/createmodule?${params.toString()}`);
//     };

//     const handlePrevious = async () => {
//         if (currentMOD_ID) {
//             await fetchRetriveData(currentMOD_ID, "P");
//         }
//         setForm((prev) => ({
//             ...prev,
//             SearchByCd: ''
//         }));
//     };

//     const handleNext = async () => {
//         if (currentMOD_ID) {
//             await fetchRetriveData(currentMOD_ID, "N");
//         }
//         setForm((prev) => ({
//             ...prev,
//             SearchByCd: ''
//         }));
//     };

//     const handleDelete = () => {
//         setOpenConfirmDialog(true);
//     };

//     const handleCloseConfirmDialog = () => {
//         setOpenConfirmDialog(false);
//     };

//     const handleConfirmDelete = async () => {
//         setOpenConfirmDialog(false);
//         try {
//             const UserName = userRole === 'user' ? username : PARTY_KEY;
//             const response = await axiosInstance.post(`Module/DeleteWebModules?UserName=${UserName}&strCobrid=${COBR_ID}`, {
//                 Mod_ID: parseInt(currentMOD_ID)
//             });
            
//             const { data: { STATUS, MESSAGE } } = response;
            
//             if (STATUS === 0) {
//                 toast.success(MESSAGE, { autoClose: 500 });
//                 router.push('/createmodule');
//                 resetForm();
//                 setMode(FORM_MODE.add);
//             } else {
//                 toast.error(MESSAGE);
//             }
//         } catch (error) {
//             console.error("Delete Error:", error);
//             toast.error("Error deleting module");
//         }
//     };

//     const handleEdit = () => {
//         setMode(FORM_MODE.edit);
//     };

//     const handleExit = () => {
//         router.push("/masterpage?activeTab=modules");
//     };

//     const handleManualSearch = (e) => {
//         if (e.key === 'Enter' && form.SearchByCd) {
//             fetchRetriveData(form.SearchByCd, 'R', true);
//         }
//     };

//     return (
//         <>
//             <Grid
//                 sx={{
//                     width: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     boxSizing: 'border-box',
//                     minHeight: '91vh',
//                     overflowX: 'hidden',
//                     overflowY: 'auto',
//                     p: 2
//                 }}
//             >
//                 <ToastContainer />

//                 <Grid container spacing={2} sx={{ maxWidth: '1200px', width: '100%' }}>
//                     {/* Header */}
//                     <Grid item xs={12}>
//                         <Typography align="center" variant="h6" sx={{ mb: 2 }}>
//                             Module Master
//                         </Typography>
//                     </Grid>

//                     {/* Toolbar */}
//                     <Grid item xs={12}>
//                         <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
//                             <Grid item>
//                                 <Button
//                                     variant="contained"
//                                     size="small"
//                                     sx={{ background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4) !important', minWidth: '40px' }}
//                                     disabled={mode !== 'view'}
//                                     onClick={handlePrevious}
//                                 >
//                                     <KeyboardArrowLeftIcon />
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     size="small"
//                                     sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important', ml: 1, minWidth: '40px' }}
//                                     disabled={mode !== 'view'}
//                                     onClick={handleNext}
//                                 >
//                                     <NavigateNextIcon />
//                                 </Button>
//                             </Grid>

//                             <Grid item>
//                                 <TextField
//                                     placeholder="Search By ID"
//                                     variant="outlined"
//                                     size="small"
//                                     sx={{
//                                         backgroundColor: '#e0f7fa',
//                                         '& .MuiInputBase-input': {
//                                             py: 1,
//                                             px: 1.5,
//                                         },
//                                         width: '200px'
//                                     }}
//                                     value={form.SearchByCd}
//                                     onChange={(e) => setForm({ ...form, SearchByCd: e.target.value })}
//                                     onKeyPress={handleManualSearch}
//                                 />
//                             </Grid>

//                             <Grid item>
//                                 <TbListSearch 
//                                     onClick={handleTable} 
//                                     style={{ 
//                                         color: 'rgb(99, 91, 255)', 
//                                         width: '32px', 
//                                         height: '32px', 
//                                         cursor: 'pointer' 
//                                     }} 
//                                 />
//                             </Grid>

//                             <Grid item>
//                                 <CrudButton
//                                     moduleName="Module"
//                                     mode={mode}
//                                     onAdd={handleAdd}
//                                     onEdit={handleEdit}
//                                     onDelete={handleDelete}
//                                     onExit={handleExit}
//                                     readOnlyMode={mode === FORM_MODE.read}
//                                     onPrevious={handlePrevious}
//                                     onNext={handleNext}
//                                 />
//                             </Grid>
//                         </Grid>
//                     </Grid>

//                     {/* Form Fields */}
//                     <Grid item xs={12}>
//                         <Grid container spacing={2}>
//                             {/* Module Name Field */}
//                             <Grid item xs={12} sm={6} md={4}>
//                                 <TextField
//                                     label={<span>Module Name<span style={{ color: "red" }}>*</span></span>}
//                                     inputRef={MOD_NAMERef}
//                                     variant="filled"
//                                     fullWidth
//                                     onChange={handleInputChange}
//                                     value={form.MOD_NAME}
//                                     name="MOD_NAME"
//                                     disabled={mode === FORM_MODE.read}
//                                     sx={textInputSx}
//                                     required
//                                 />
//                             </Grid>

//                             {/* Parent Module Dropdown */}
//                             <Grid item xs={12} sm={6} md={4}>
//                                 <FormControl variant="filled" fullWidth sx={selectSx} disabled={mode === FORM_MODE.read}>
//                                     <InputLabel>Parent Module</InputLabel>
//                                     <Select
//                                         name="PARENT_ID"
//                                         value={form.PARENT_ID}
//                                         onChange={handleInputChange}
//                                     >
//                                         <MenuItem value="">None (Top Level)</MenuItem>
//                                         {parentModules.map((module) => (
//                                             <MenuItem key={module.MOD_ID} value={module.MOD_ID.toString()}>
//                                                 {module.MOD_NAME}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </Grid>

//                             {/* Menu Name */}
//                             <Grid item xs={12} sm={6} md={4}>
//                                 <TextField
//                                     label="Menu Name"
//                                     variant="filled"
//                                     fullWidth
//                                     onChange={handleInputChange}
//                                     value={form.MOD_NAME}
//                                     name="MENU_NAME"
//                                     disabled={mode === FORM_MODE.read}
//                                     sx={textInputSx}
//                                 />
//                             </Grid>

//                             {/* Module Description */}
//                             <Grid item xs={12} sm={6} md={4}>
//                                 <TextField
//                                     label="Module Description"
//                                     inputRef={MOD_DESCRef}
//                                     variant="filled"
//                                     fullWidth
//                                     onChange={handleInputChange}
//                                     value={form.MOD_DESC}
//                                     name="MOD_DESC"
//                                     disabled={mode === FORM_MODE.read}
//                                     sx={textInputSx}
//                                     multiline
//                                     rows={1}
//                                 />
//                             </Grid>

//                             {/* Module Routing */}
//                             <Grid item xs={12} sm={6} md={4}>
//                                 <TextField
//                                     label="Module Routing"
//                                     variant="filled"
//                                     fullWidth
//                                     onChange={handleInputChange}
//                                     value={form.MOD_ROUTIG}
//                                     name="MOD_ROUTIG"
//                                     disabled={mode === FORM_MODE.read}
//                                     sx={textInputSx}
//                                     placeholder="/path/to/module"
//                                 />
//                             </Grid>

//                             {/* Table Name */}
//                             <Grid item xs={12} sm={6} md={4}>
//                                 <TextField
//                                     label="Table Name"
//                                     variant="filled"
//                                     fullWidth
//                                     onChange={handleInputChange}
//                                     value={form.MOD_TBLNAME}
//                                     name="MOD_TBLNAME"
//                                     disabled={mode === FORM_MODE.read}
//                                     sx={textInputSx}
//                                 />
//                             </Grid>

//                             {/* Status Checkbox */}
//                             <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
//                                 <FormControlLabel
//                                     control={
//                                         <Checkbox
//                                             disabled={mode === FORM_MODE.read}
//                                             checked={Status === "1"}
//                                             onChange={handleChangeStatus}
//                                             sx={{
//                                                 '&.Mui-checked': {
//                                                     color: '#39ace2',
//                                                 }
//                                             }}
//                                         />
//                                     }
//                                     label="Active"
//                                 />
//                             </Grid>
//                         </Grid>
//                     </Grid>

//                     {/* Action Buttons */}
//                     <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                         {mode === FORM_MODE.read && (
//                             <>
//                                 <Button 
//                                     variant="contained" 
//                                     disabled
//                                     sx={{ mr: 1 }}
//                                 >
//                                     Submit
//                                 </Button>
//                                 <Button 
//                                     variant="contained" 
//                                     disabled
//                                 >
//                                     Cancel
//                                 </Button>
//                             </>
//                         )}
//                         {(mode === FORM_MODE.edit || mode === FORM_MODE.add) && (
//                             <>
//                                 <Button 
//                                     variant="contained" 
//                                     onClick={handleSubmit}
//                                     sx={{ 
//                                         backgroundColor: '#635bff',
//                                         color: '#fff',
//                                         mr: 1,
//                                         '&:hover': { backgroundColor: '#4f4be0' }
//                                     }}
//                                 >
//                                     Submit
//                                 </Button>
//                                 <Button 
//                                     variant="contained" 
//                                     onClick={handleCancel}
//                                     sx={{ 
//                                         backgroundColor: '#635bff',
//                                         color: '#fff',
//                                         '&:hover': { backgroundColor: '#4f4be0' }
//                                     }}
//                                 >
//                                     Cancel
//                                 </Button>
//                             </>
//                         )}
//                     </Grid>
//                 </Grid>

//                 {/* Delete Confirmation Dialog */}
//                 <Dialog
//                     open={openConfirmDialog}
//                     onClose={handleCloseConfirmDialog}
//                 >
//                     <DialogTitle>Confirm Deletion</DialogTitle>
//                     <DialogContent>
//                         <DialogContentText>
//                             Are you sure you want to delete this module?
//                         </DialogContentText>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button
//                             sx={{
//                                 backgroundColor: '#635bff',
//                                 color: 'white',
//                                 '&:hover': { backgroundColor: '#4f4be0' },
//                             }}
//                             onClick={handleConfirmDelete}
//                         >
//                             Yes
//                         </Button>
//                         <Button
//                             sx={{
//                                 backgroundColor: '#635bff',
//                                 color: 'white',
//                                 '&:hover': { backgroundColor: '#4f4be0' },
//                             }}
//                             onClick={handleCloseConfirmDialog}
//                         >
//                             No
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Grid>
//         </>
//     );
// };

// export default CreateModule;


import React from 'react'

const createmodule = () => {
  return (
    <div>createmodule</div>
  )
}

export default createmodule
