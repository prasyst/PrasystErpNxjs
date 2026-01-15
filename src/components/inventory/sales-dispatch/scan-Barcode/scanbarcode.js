
// 'use client';
// import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
// import {
//   Box,
//   Grid,
//   TextField,
//   Typography,
//   Button,
//   Stack,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   Alert,
//   Snackbar,
//   Card,
//   CardContent,
// } from '@mui/material';
// import { 
//   CameraAlt as CameraIcon, 
//   Close as CloseIcon, 
//   QrCodeScanner as QrCodeIcon,
//   Search as SearchIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon
// } from '@mui/icons-material';
// import dynamic from 'next/dynamic';
// import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
// import axiosInstance from '../../../../lib/axios';

// import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

// const ScanBarcode = () => {
//   const [formData, setFormData] = useState({
//     Party: '',
//     PARTY_KEY: '',
//     SHIPPING_PARTY: '',
//     SHP_PARTY_KEY: '',
//     Branch: '',
//     PARTYDTL_ID: '',
//     SHIPPING_PLACE: '',
//     SHP_PARTYDTL_ID: '',
//     Order_Type: 'Sales And Work-Order',
//     ORDBK_TYPE: '2',
//     Status: 'O'
//   });

//   const [newItemData, setNewItemData] = useState({
//     barcode: '',
//     product: '',
//     style: '',
//     type: '',
//     shade: '',
//     mrp: '',
//     rate: '',
//     qty: '',
//     discount: '',
//     sets: '',
//     convFact: '1',
//     remark: ''
//   });

//   const [sizeDetailsData, setSizeDetailsData] = useState([]);
//   const [tableData, setTableData] = useState([]);

//   // State for dropdowns
//   const [partyOptions, setPartyOptions] = useState([]);
//   const [branchOptions, setBranchOptions] = useState([]);
//   const [shippingPartyOptions, setShippingPartyOptions] = useState([]);
//   const [shippingPlaceOptions, setShippingPlaceOptions] = useState([]);

//   // State for mappings
//   const [partyMapping, setPartyMapping] = useState({});
//   const [branchMapping, setBranchMapping] = useState({});
//   const [shippingBranchMapping, setShippingBranchMapping] = useState({});

//   // Scanner state
//   const [showScanner, setShowScanner] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);
//   const [scannerError, setScannerError] = useState('');
//   const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
//   const [isClient, setIsClient] = useState(false);
  
//   // Snackbar
//   const [snackbar, setSnackbar] = useState({ 
//     open: false, 
//     message: '', 
//     severity: 'success' 
//   });

//   const scannerRef = useRef(null);
//   const qrCodeScannerRef = useRef(null);
//   const barcodeInputRef = useRef(null);

//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   // Text field styles
//   const textInputSx = {
//     '& .MuiInputBase-root': {
//       height: 40,
//       fontSize: '14px',
//     },
//     '& .MuiInputLabel-root': {
//       fontSize: '14px',
//       top: '-4px',
//     },
//     '& .MuiFilledInput-root': {
//       backgroundColor: '#fafafa',
//       border: '1px solid #e0e0e0',
//       borderRadius: '6px',
//       overflow: 'hidden',
//       height: 40,
//       fontSize: '14px',
//     },
//     '& .MuiFilledInput-root:before': {
//       display: 'none',
//     },
//     '& .MuiFilledInput-root:after': {
//       display: 'none',
//     },
//     '& .MuiInputBase-input': {
//       padding: '10px 12px !important',
//       fontSize: '14px !important',
//       lineHeight: '1.4',
//     },
//   };

//   const DropInputSx = {
//     ...textInputSx,
//     '& .MuiAutocomplete-endAdornment': {
//       top: '50%',
//       transform: 'translateY(-50%)',
//       right: '10px',
//     },
//   };

//   // Check if window is available
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Fetch party data
//   const fetchPartiesByName = async (name = "") => {
//     try {
//       const response = await axiosInstance.post("Party/GetParty_By_Name", {
//         PARTY_NAME: name
//       });
//       if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
//         const parties = response.data.DATA.map(item => item.PARTY_NAME || '');
//         setPartyOptions(parties);
//         setShippingPartyOptions(parties);
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.PARTY_NAME && item.PARTY_KEY) {
//             mapping[item.PARTY_NAME] = item.PARTY_KEY;
//           }
//         });
//         setPartyMapping(mapping);
//       }
//     } catch (error) {
//       console.error("Error fetching parties:", error);
//       showSnackbar('Error fetching parties', 'error');
//     }
//   };

//   // Fetch party branches
//   const fetchPartyDetails = async (partyKey, isShippingParty = false) => {
//     if (!partyKey) return;
    
//     try {
//       const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
//         PARTY_KEY: partyKey
//       });
      
//       if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
//         const branches = response.data.DATA.map(item => item.PLACE || '');
        
//         const mapping = {};
//         response.data.DATA.forEach(item => {
//           if (item.PLACE && item.PARTYDTL_ID) {
//             mapping[item.PLACE] = item.PARTYDTL_ID;
//           }
//         });
        
//         if (isShippingParty) {
//           setShippingPlaceOptions(branches);
//           setShippingBranchMapping(mapping);
          
//           // Auto-select first branch for shipping
//           if (branches.length > 0 && !formData.SHIPPING_PLACE) {
//             const firstBranch = branches[0];
//             const firstBranchId = mapping[firstBranch];
            
//             setFormData(prev => ({
//               ...prev,
//               SHIPPING_PLACE: firstBranch,
//               SHP_PARTYDTL_ID: firstBranchId
//             }));
//           }
//         } else {
//           setBranchOptions(branches);
//           setBranchMapping(mapping);
          
//           // Auto-select first branch
//           if (branches.length > 0 && !formData.Branch) {
//             const firstBranch = branches[0];
//             const firstBranchId = mapping[firstBranch];
            
//             setFormData(prev => ({
//               ...prev,
//               Branch: firstBranch,
//               PARTYDTL_ID: firstBranchId,
//               SHIPPING_PLACE: firstBranch,
//               SHP_PARTYDTL_ID: firstBranchId
//             }));
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching party details:", error);
//       showSnackbar('Error fetching branch details', 'error');
//     }
//   };

//   // Fetch style data by barcode
//   const fetchStyleDataByBarcode = async (barcode) => {
//     if (!barcode || barcode.trim() === '') {
//       setScannerError('Please enter a barcode');
//       return;
//     }
    
//     try {
//       setIsLoadingBarcode(true);
//       setScannerError('');
      
//       console.log('Fetching data for barcode:', barcode);
      
//       const payload = {
//         "FGSTYLE_ID": "",
//         "FGPRD_KEY": "",
//         "FGSTYLE_CODE": "",
//         "ALT_BARCODE": barcode.trim(),
//         "FLAG": ""
//       };

//       const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);
//       console.log('API Response:', response.data);

//       if (response.data.DATA && response.data.DATA.length > 0) {
//         const styleData = response.data.DATA[0];
//         console.log('Style Data:', styleData);
        
//         const barcodeValue = styleData.ALT_BARCODE || styleData.STYSTKDTL_KEY || barcode;
//         const shadeValue = styleData.FGSHADE_NAME || '';
        
//         // Update new item data
//         setNewItemData({
//           barcode: barcodeValue,
//           product: styleData.FGPRD_NAME || '',
//           style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
//           type: styleData.FGTYPE_NAME || '',
//           shade: shadeValue,
//           mrp: styleData.MRP ? styleData.MRP.toString() : '0',
//           rate: styleData.SSP ? styleData.SSP.toString() : '0',
//           qty: '',
//           discount: '0',
//           sets: '1',
//           convFact: '1',
//           remark: ''
//         });
        
//         showSnackbar('Product found successfully!');
        
//         // Fetch size details
//         await fetchSizeDetailsForStyle(styleData);
        
//       } else {
//         setScannerError('No product found for this barcode. Please check the barcode and try again.');
//         showSnackbar('Product not found', 'warning');
//       }
//     } catch (error) {
//       console.error('Error fetching style data:', error);
//       setScannerError('Error fetching product details. Please try again.');
//       showSnackbar('Error fetching product', 'error');
//     } finally {
//       setIsLoadingBarcode(false);
//     }
//   };

//   // Fetch size details for style
//   const fetchSizeDetailsForStyle = async (styleData) => {
//     try {
//       const fgprdKey = styleData.FGPRD_KEY;
//       const fgstyleId = styleData.FGSTYLE_ID;
//       const fgtypeKey = styleData.FGTYPE_KEY || "";
//       const fgshadeKey = styleData.FGSHADE_KEY || "";
//       const fgptnKey = styleData.FGPTN_KEY || "";

//       if (!fgprdKey || !fgstyleId) {
//         console.warn('Missing required data for size details');
//         return;
//       }

//       const payload = {
//         "FGSTYLE_ID": fgstyleId,
//         "FGPRD_KEY": fgprdKey,
//         "FGTYPE_KEY": fgtypeKey,
//         "FGSHADE_KEY": fgshadeKey,
//         "FGPTN_KEY": fgptnKey,
//         "MRP": parseFloat(styleData.MRP) || 0,
//         "SSP": parseFloat(styleData.SSP) || 0,
//         "PARTY_KEY": formData.PARTY_KEY || "",
//         "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
//         "FLAG": ""
//       };

//       console.log('Fetching size details with payload:', payload);

//       const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', payload);
//       console.log('Size Details Response:', response.data);

//       if (response.data.DATA && response.data.DATA.length > 0) {
//         const transformedSizeDetails = response.data.DATA.map((size, index) => ({
//           STYSIZE_ID: size.STYSIZE_ID || index + 1,
//           STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
//           FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
//           QTY: 0,
//           ITM_AMT: 0,
//           ORDER_QTY: 0,
//           MRP: parseFloat(styleData.MRP) || 0,
//           RATE: parseFloat(styleData.SSP) || 0,
//           FGITEM_KEY: styleData.STYSTKDTL_KEY || ""
//         }));

//         setSizeDetailsData(transformedSizeDetails);
//         showSnackbar('Size details loaded! Enter quantities.');
//       } else {
//         // Create default size details if API returns empty
//         const defaultSizes = [
//           { STYSIZE_NAME: 'Default', STYSIZE_ID: 1, QTY: 0, MRP: parseFloat(styleData.MRP) || 0, RATE: parseFloat(styleData.SSP) || 0 }
//         ];
//         setSizeDetailsData(defaultSizes);
//         showSnackbar('Using default size. Enter quantity.', 'info');
//       }
//     } catch (error) {
//       console.error('Error fetching size details:', error);
//       // Create default size on error
//       const defaultSizes = [
//         { STYSIZE_NAME: 'Default', STYSIZE_ID: 1, QTY: 0, MRP: parseFloat(newItemData.mrp) || 0, RATE: parseFloat(newItemData.rate) || 0 }
//       ];
//       setSizeDetailsData(defaultSizes);
//       showSnackbar('Could not load size details. Using default.', 'warning');
//     }
//   };

//   // Handle party selection
//   const handlePartyChange = (event, value) => {
//     setFormData(prev => ({
//       ...prev,
//       Party: value,
//       PARTY_KEY: partyMapping[value] || '',
//       SHIPPING_PARTY: value,
//       SHP_PARTY_KEY: partyMapping[value] || ''
//     }));

//     if (value && partyMapping[value]) {
//       fetchPartyDetails(partyMapping[value]);
//     }
//   };

//   // Handle shipping party selection
//   const handleShippingPartyChange = (event, value) => {
//     setFormData(prev => ({
//       ...prev,
//       SHIPPING_PARTY: value,
//       SHP_PARTY_KEY: partyMapping[value] || '',
//       SHIPPING_PLACE: ''
//     }));

//     if (value && partyMapping[value]) {
//       fetchPartyDetails(partyMapping[value], true);
//     }
//   };

//   // Handle branch selection
//   const handleBranchChange = (event, value) => {
//     const branchId = branchMapping[value];
//     setFormData(prev => ({
//       ...prev,
//       Branch: value,
//       PARTYDTL_ID: branchId,
//       SHIPPING_PLACE: value,
//       SHP_PARTYDTL_ID: branchId
//     }));
//   };

//   // Handle shipping place selection
//   const handleShippingPlaceChange = (event, value) => {
//     const branchId = shippingBranchMapping[value];
//     setFormData(prev => ({
//       ...prev,
//       SHIPPING_PLACE: value,
//       SHP_PARTYDTL_ID: branchId || ''
//     }));
//   };

//   // Handle barcode input change
//   const handleBarcodeInputChange = (e) => {
//     const value = e.target.value;
//     setNewItemData(prev => ({ ...prev, barcode: value }));
//     setScannerError('');
//   };

//   // Handle barcode search (manual entry)
//   const handleManualBarcodeSubmit = () => {
//     if (!newItemData.barcode || newItemData.barcode.trim() === '') {
//       setScannerError('Please enter a barcode');
//       return;
//     }
    
//     fetchStyleDataByBarcode(newItemData.barcode);
//   };

//   // Handle Enter key press in barcode field
//   const handleBarcodeKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleManualBarcodeSubmit();
//     }
//   };

//   // Handle size quantity change
//   const handleSizeQtyChange = (index, newQty) => {
//     const updatedSizeDetails = [...sizeDetailsData];
//     const qty = parseFloat(newQty) || 0;
//     const rate = parseFloat(newItemData.rate) || 0;
//     const amount = qty * rate;
    
//     updatedSizeDetails[index] = {
//       ...updatedSizeDetails[index],
//       QTY: qty,
//       ITM_AMT: amount,
//       ORDER_QTY: qty
//     };

//     setSizeDetailsData(updatedSizeDetails);
    
//     // Update total quantity
//     const totalQty = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
//     setNewItemData(prev => ({ ...prev, qty: totalQty.toString() }));
//   };

//   // Calculate total quantity from size details
//   const calculateTotalQty = () => {
//     return sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
//   };

//   // Calculate amount
//   const calculateAmount = () => {
//     const totalQty = calculateTotalQty();
//     const rate = parseFloat(newItemData.rate) || 0;
//     const discount = parseFloat(newItemData.discount) || 0;
//     const amount = totalQty * rate;
//     return {
//       amount: amount,
//       netAmount: amount - discount
//     };
//   };

//   // Handle confirm button
//   const handleConfirmItem = () => {
//     if (!newItemData.product || !newItemData.style) {
//       showSnackbar("Please scan a valid barcode first", 'error');
//       return;
//     }

//     const totalQty = calculateTotalQty();
//     if (totalQty === 0) {
//       showSnackbar("Please enter quantity in size details", 'error');
//       return;
//     }

//     const { amount, netAmount } = calculateAmount();

//     const newItem = {
//       id: Date.now(),
//       barcode: newItemData.barcode,
//       product: newItemData.product,
//       style: newItemData.style,
//       type: newItemData.type,
//       shade: newItemData.shade,
//       qty: totalQty,
//       mrp: parseFloat(newItemData.mrp) || 0,
//       rate: parseFloat(newItemData.rate) || 0,
//       amount: amount,
//       discAmt: parseFloat(newItemData.discount) || 0,
//       netAmt: netAmount,
//       sets: parseFloat(newItemData.sets) || 0,
//       sizeDetails: [...sizeDetailsData],
//       convFact: newItemData.convFact,
//       remark: newItemData.remark
//     };

//     // Add to table
//     setTableData(prev => [...prev, newItem]);

//     // Reset form
//     setNewItemData({
//       barcode: '',
//       product: '',
//       style: '',
//       type: '',
//       shade: '',
//       mrp: '',
//       rate: '',
//       qty: '',
//       discount: '0',
//       sets: '1',
//       convFact: '1',
//       remark: ''
//     });
//     setSizeDetailsData([]);
//     setScannerError('');

//     showSnackbar('Item added to order!', 'success');
//   };

//   // Handle delete item from table
//   const handleDeleteItem = (id) => {
//     setTableData(prev => prev.filter(item => item.id !== id));
//     showSnackbar('Item removed from order', 'info');
//   };

//   // Initialize scanner (client-side only)
//   // Replace initScanner function (around line 385)
// const initScanner = () => {
//   if (typeof window === 'undefined') {
//     console.error('Scanner not available on server');
//     return;
//   }

//   // Clear any existing scanner first
//   if (qrCodeScannerRef.current) {
//     qrCodeScannerRef.current.clear().catch(err => {
//       console.error("Failed to clear existing scanner", err);
//     });
//     qrCodeScannerRef.current = null;
//   }

//   const qrReaderElement = document.getElementById('qr-reader');
//   if (!qrReaderElement) {
//     console.error('qr-reader element not found');
//     setScannerError('Scanner element not found. Please try again.');
//     return;
//   }

//   try {
//     const scanner = new Html5QrcodeScanner(
//       "qr-reader",
//       {
//         fps: 10,
//         qrbox: { width: 250, height: 250 },
//         rememberLastUsedCamera: true,
//         supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
//         showTorchButtonIfSupported: true,
//         showZoomSliderIfSupported: true
//       },
//       false
//     );

//     const onScanSuccess = (decodedText, decodedResult) => {
//       console.log(`Scan result: ${decodedText}`, decodedResult);
      
//       // Stop scanner
//       scanner.clear().then(() => {
//         qrCodeScannerRef.current = null;
//         setIsScanning(false);
//         setShowScanner(false);
        
//         // Update barcode field
//         setNewItemData(prev => ({ ...prev, barcode: decodedText }));
        
//         // Fetch product data
//         fetchStyleDataByBarcode(decodedText);
        
//         showSnackbar('Barcode scanned successfully!', 'success');
//       }).catch(err => {
//         console.error("Failed to clear scanner", err);
//       });
//     };

//     const onScanFailure = (error) => {
//       // Silently handle scan failures (they happen continuously while scanning)
//       // Only log actual errors
//       if (!error.includes('NotFoundException')) {
//         console.warn(`Scan error: ${error}`);
//       }
//     };

//     scanner.render(onScanSuccess, onScanFailure);
//     qrCodeScannerRef.current = scanner;
//     setIsScanning(true);
//     setScannerError('');
    
//   } catch (error) {
//     console.error("Scanner initialization error:", error);
//     setScannerError(`Failed to initialize scanner: ${error.message}`);
//     showSnackbar('Scanner initialization failed. Please check camera permissions.', 'error');
//     setShowScanner(false);
//   }
// };

//   // Start scanner
//   const startScanner = () => {
//     if (typeof window === 'undefined') {
//       showSnackbar('Scanner not available on server', 'error');
//       return;
//     }
//     setShowScanner(true);
//     setScannerError('');
//   };

//   // Stop scanner
//   const stopScanner = () => {
//     if (qrCodeScannerRef.current) {
//       qrCodeScannerRef.current.clear().catch(error => {
//         console.error("Failed to clear scanner", error);
//       });
//       qrCodeScannerRef.current = null;
//     }
//     setIsScanning(false);
//     setShowScanner(false);
//   };

//   // Submit complete order
//   const handleSubmitOrder = () => {
//     if (tableData.length === 0) {
//       showSnackbar('Please add at least one item to the order', 'error');
//       return;
//     }

//     if (!formData.Party || !formData.PARTY_KEY) {
//       showSnackbar('Please select a party first', 'error');
//       return;
//     }

//     // Prepare order data for submission
//     const orderData = {
//       party: formData.Party,
//       partyKey: formData.PARTY_KEY,
//       branch: formData.Branch,
//       shippingParty: formData.SHIPPING_PARTY,
//       shippingPlace: formData.SHIPPING_PLACE,
//       items: tableData,
//       totalQty: tableData.reduce((sum, item) => sum + item.qty, 0),
//       totalAmount: tableData.reduce((sum, item) => sum + item.amount, 0),
//       totalDiscount: tableData.reduce((sum, item) => sum + item.discAmt, 0),
//       netAmount: tableData.reduce((sum, item) => sum + item.netAmt, 0)
//     };

//     console.log('Order Data:', orderData);
    
//     // Here you would call your order submission API
//     // For now, just show a success message
//     showSnackbar(`Order submitted successfully! ${tableData.length} items added.`, 'success');
    
//     // Reset form
//     setTableData([]);
//     setFormData({
//       Party: '',
//       PARTY_KEY: '',
//       SHIPPING_PARTY: '',
//       SHP_PARTY_KEY: '',
//       Branch: '',
//       PARTYDTL_ID: '',
//       SHIPPING_PLACE: '',
//       SHP_PARTYDTL_ID: '',
//       Order_Type: 'Sales And Work-Order',
//       ORDBK_TYPE: '2',
//       Status: 'O'
//     });
//   };

//   // Initialize on component mount (client-side only)
//   useEffect(() => {
//     fetchPartiesByName();
    
//     // Cleanup scanner on unmount
//     return () => {
//       if (qrCodeScannerRef.current) {
//         qrCodeScannerRef.current.clear().catch(error => {
//           console.error("Failed to clear scanner", error);
//         });
//       }
//     };
//   }, []);

//  // Update useEffect for scanner (around line 565)
// useEffect(() => {
//   if (showScanner && isClient) {
//     // Wait for dialog to fully render
//     const timer = setTimeout(() => {
//       initScanner();
//     }, 500); // Increased timeout
    
//     return () => {
//       clearTimeout(timer);
//       if (qrCodeScannerRef.current) {
//         qrCodeScannerRef.current.clear().catch(err => {
//           console.error("Cleanup error", err);
//         });
//         qrCodeScannerRef.current = null;
//       }
//     };
//   }
// }, [showScanner, isClient]);

//   // Focus barcode input on load (client-side only)
//   useEffect(() => {
//     if (isClient && barcodeInputRef.current) {
//       barcodeInputRef.current.focus();
//     }
//   }, [isClient]);

//   // Get window width safely
//   const getWindowWidth = () => {
//     return isClient ? window.innerWidth : 1024; // Default desktop width
//   };

//   if (!isClient) {
//     return (
//       <Box sx={{ 
//         p: { xs: 1, sm: 2 }, 
//         maxWidth: '100%', 
//         margin: '0 auto',
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center'
//       }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ 
//       p: { xs: 1, sm: 2 }, 
//       maxWidth: '100%', 
//       margin: '0 auto',
//       minHeight: '100vh'
//     }}>
//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={4000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert 
//           onClose={() => setSnackbar({ ...snackbar, open: false })} 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       {/* Header */}
//       <Typography variant="h5" sx={{ 
//         mb: 3, 
//         textAlign: 'center', 
//         fontWeight: 'bold',
//         fontSize: { xs: '1.3rem', sm: '1.5rem' }
//       }}>
//          Order Booking By Barcode Scan
//       </Typography>

//       {/* Main Form */}
//       <Card elevation={2} sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//             <span style={{ fontSize: '1.1rem' }}>📋 Order Details</span>
//           </Typography>
          
//           <Grid container spacing={2}>
//             {/* Party Selection */}
//             <Grid item xs={12} md={6}>
//               <AutoVibe
//                 id="Party"
//                 getOptionLabel={(option) => option || ''}
//                 options={partyOptions}
//                 label="Party *"
//                 name="Party"
//                 value={formData.Party}
//                 onChange={handlePartyChange}
//                 sx={DropInputSx}
//                 size="small"
//               />
//             </Grid>
            
//             {/* Shipping Party */}
//             <Grid item xs={12} md={6}>
//               <AutoVibe
//                 id="SHIPPING_PARTY"
//                 getOptionLabel={(option) => option || ''}
//                 options={shippingPartyOptions}
//                 label="Shipping Party"
//                 name="SHIPPING_PARTY"
//                 value={formData.SHIPPING_PARTY}
//                 onChange={handleShippingPartyChange}
//                 sx={DropInputSx}
//                 size="small"
//               />
//             </Grid>
            
//             {/* Branch */}
//             <Grid item xs={12} md={6}>
//               <AutoVibe
//                 id="Branch"
//                 getOptionLabel={(option) => option || ''}
//                 options={branchOptions}
//                 label="Branch"
//                 name="Branch"
//                 value={formData.Branch}
//                 onChange={handleBranchChange}
//                 sx={DropInputSx}
//                 size="small"
//               />
//             </Grid>
            
//             {/* Shipping Place */}
//             <Grid item xs={12} md={6}>
//               <AutoVibe
//                 id="SHIPPING_PLACE"
//                 getOptionLabel={(option) => option || ''}
//                 options={shippingPlaceOptions}
//                 label="Shipping Place"
//                 name="SHIPPING_PLACE"
//                 value={formData.SHIPPING_PLACE}
//                 onChange={handleShippingPlaceChange}
//                 sx={DropInputSx}
//                 size="small"
//               />
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* Barcode Scanner Section */}
//       <Card elevation={2} sx={{ mb: 3 }}>
//         <CardContent>
//           <Typography variant="h6" sx={{ 
//             mb: 2, 
//             display: 'flex', 
//             alignItems: 'center', 
//             gap: 1,
//             fontSize: '1.1rem'
//           }}>
//             <QrCodeIcon /> Product Scanning
//           </Typography>
          
//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
//             {/* Barcode Input with Search Button */}
//             <Box sx={{ flex: 1, width: '100%' }}>
//               <TextField
//                 label="Enter Barcode Number"
//                 variant="filled"
//                 fullWidth
//                 value={newItemData.barcode}
//                 onChange={handleBarcodeInputChange}
//                 onKeyPress={handleBarcodeKeyPress}
//                 placeholder="Type barcode and press Enter"
//                 sx={textInputSx}
//                 inputRef={barcodeInputRef}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton 
//                       onClick={handleManualBarcodeSubmit}
//                       disabled={!newItemData.barcode || isLoadingBarcode}
//                       sx={{ mr: -1 }}
//                     >
//                       {isLoadingBarcode ? <CircularProgress size={20} /> : <SearchIcon />}
//                     </IconButton>
//                   )
//                 }}
//               />
//             </Box>
            
//             {/* OR Divider */}
//             <Typography variant="body2" sx={{ 
//               color: 'text.secondary',
//               display: { xs: 'none', sm: 'block' }
//             }}>
//               OR
//             </Typography>
            
//             {/* Scanner Button */}
//             <Button
//               variant="contained"
//               startIcon={<CameraIcon />}
//               onClick={startScanner}
//               sx={{ 
//                 backgroundColor: '#1976d2',
//                 color: 'white',
//                 minWidth: { xs: '100%', sm: 150 },
//                 height: 40,
//                 '&:hover': {
//                   backgroundColor: '#1565c0'
//                 }
//               }}
//             >
//               Scan Barcode
//             </Button>
//           </Stack>

//           {scannerError && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {scannerError}
//             </Alert>
//           )}

//           {isLoadingBarcode && (
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
//               <CircularProgress size={20} />
//               <Typography variant="body2">Fetching product details...</Typography>
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* Product Details (Auto-filled after scan) */}
//       {(newItemData.product || isLoadingBarcode) && (
//         <Card elevation={2} sx={{ mb: 3 }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
//               🏷️ Product Details {isLoadingBarcode && '(Loading...)'}
//             </Typography>
            
//             <Grid container spacing={2}>
//               {/* Barcode and Product */}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Barcode"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.barcode}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Product"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.product}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               {/* Style and Type */}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Style"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.style}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Type"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.type}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               {/* Shade and MRP */}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Shade"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.shade}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="MRP"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.mrp}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               {/* Rate and Discount */}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Rate"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.rate}
//                   disabled
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Discount"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.discount}
//                   onChange={(e) => setNewItemData(prev => ({ 
//                     ...prev, 
//                     discount: e.target.value 
//                   }))}
//                   sx={textInputSx}
//                   size="small"
//                   inputProps={{ 
//                     type: 'number',
//                     step: '0.01',
//                     min: '0'
//                   }}
//                 />
//               </Grid>
              
//               {/* Sets and Remark */}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Sets"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.sets}
//                   onChange={(e) => setNewItemData(prev => ({ 
//                     ...prev, 
//                     sets: e.target.value 
//                   }))}
//                   sx={textInputSx}
//                   size="small"
//                   inputProps={{ 
//                     type: 'number',
//                     step: '1',
//                     min: '1'
//                   }}
//                 />
//               </Grid>

//               {/* Remark */}
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Remark"
//                   variant="filled"
//                   fullWidth
//                   value={newItemData.remark}
//                   onChange={(e) => setNewItemData(prev => ({ 
//                     ...prev, 
//                     remark: e.target.value 
//                   }))}
//                   sx={textInputSx}
//                   size="small"
//                 />
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>
//       )}

//       {/* Size Details Table */}
//       {sizeDetailsData.length > 0 && (
//         <Card elevation={2} sx={{ mb: 3 }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
//               📏 Size Details
//             </Typography>
            
//             <Box sx={{ 
//               overflowX: 'auto',
//               backgroundColor: '#f8f9fa',
//               borderRadius: 1,
//               p: 1
//             }}>
//               <table style={{ 
//                 width: '100%', 
//                 borderCollapse: 'collapse',
//                 minWidth: '500px'
//               }}>
//                 <thead>
//                   <tr style={{ backgroundColor: '#e9ecef' }}>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Size</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'center',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Quantity</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'right',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>MRP</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'right',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Rate</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'right',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sizeDetailsData.map((size, index) => (
//                     <tr key={index} style={{ 
//                       backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
//                       borderBottom: '1px solid #dee2e6'
//                     }}>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         fontSize: '14px'
//                       }}>{size.STYSIZE_NAME}</td>
//                       <td style={{ 
//                         padding: '5px', 
//                         border: '1px solid #dee2e6',
//                         textAlign: 'center'
//                       }}>
//                         <TextField
//                           type="number"
//                           value={size.QTY}
//                           onChange={(e) => handleSizeQtyChange(index, e.target.value)}
//                           size="small"
//                           sx={{ width: '80px' }}
//                           inputProps={{ 
//                             style: { 
//                               padding: '8px',
//                               textAlign: 'center',
//                               fontSize: '14px'
//                             },
//                             min: 0 
//                           }}
//                         />
//                       </td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         textAlign: 'right',
//                         fontSize: '14px'
//                       }}>{size.MRP || 0}</td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         textAlign: 'right',
//                         fontSize: '14px'
//                       }}>{size.RATE || 0}</td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         textAlign: 'right',
//                         fontSize: '14px',
//                         fontWeight: '500'
//                       }}>
//                         ₹{(size.QTY || 0) * (size.RATE || 0)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </Box>
            
//             <Box sx={{ 
//               mt: 2, 
//               display: 'flex', 
//               justifyContent: 'space-between', 
//               alignItems: 'center',
//               flexWrap: 'wrap',
//               gap: 2
//             }}>
//               <Box>
//                 <Typography variant="body1" sx={{ fontWeight: '500' }}>
//                   Total Quantity: <strong style={{ color: '#1976d2' }}>{calculateTotalQty()}</strong>
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                   Amount: ₹{calculateAmount().amount.toFixed(2)}
//                 </Typography>
//               </Box>
              
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleConfirmItem}
//                 disabled={calculateTotalQty() === 0}
//                 sx={{ 
//                   backgroundColor: '#4CAF50',
//                   color: 'white',
//                   '&:hover': { backgroundColor: '#45a049' },
//                   minWidth: '140px'
//                 }}
//               >
//                 Add to Order
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       )}

//       {/* Order Items Table */}
//       {tableData.length > 0 && (
//         <Card elevation={2} sx={{ mb: 3 }}>
//           <CardContent>
//             <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
//               🛒 Order Items ({tableData.length})
//             </Typography>
            
//             <Box sx={{ 
//               overflowX: 'auto',
//               backgroundColor: '#f8f9fa',
//               borderRadius: 1,
//               p: 1
//             }}>
//               <table style={{ 
//                 width: '100%', 
//                 borderCollapse: 'collapse',
//                 minWidth: '700px'
//               }}>
//                 <thead>
//                   <tr style={{ backgroundColor: '#e9ecef' }}>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Barcode</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Product</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Style</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Type</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'left',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Shade</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'center',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Qty</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'right',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Rate</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'right',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Amount</th>
//                     <th style={{ 
//                       padding: '10px', 
//                       border: '1px solid #dee2e6', 
//                       textAlign: 'center',
//                       fontSize: '14px',
//                       fontWeight: '600'
//                     }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tableData.map((item, index) => (
//                     <tr key={item.id} style={{ 
//                       backgroundColor: index % 2 === 0 ? '#ffffffff' : '#ffffffff',
//                       borderBottom: '1px solid #dee2e6'
//                     }}>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         fontSize: '14px',
//                         fontFamily: 'monospace'
//                       }}>{item.barcode}</td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         fontSize: '14px'
//                       }}>{item.product}</td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         fontSize: '14px'
//                       }}>{item.style}</td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         fontSize: '14px'
//                       }}>
//                         <div>{item.type}</div>
//                       </td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         fontSize: '14px'
//                       }}>
//                         <div>{item.shade}</div>
//                       </td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         textAlign: 'center',
//                         fontSize: '14px'
//                       }}>{item.qty}</td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         textAlign: 'right',
//                         fontSize: '14px'
//                       }}>₹{item.rate}</td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         textAlign: 'right',
//                         fontSize: '14px',
//                         fontWeight: '500'
//                       }}>₹{item.amount.toFixed(2)}</td>
//                       <td style={{ 
//                         padding: '10px', 
//                         border: '1px solid #dee2e6',
//                         textAlign: 'center'
//                       }}>
//                         <IconButton 
//                           onClick={() => handleDeleteItem(item.id)}
//                           size="small"
//                           sx={{ color: '#f44336' }}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </Box>
            
//             {/* Order Summary */}
//             {tableData.length > 0 && (
//               <Box sx={{ 
//                 mt: 3, 
//                 p: 2, 
//                 backgroundColor: '#e8f5e9', 
//                 borderRadius: 1 
//               }}>
//                 <Typography variant="h6" sx={{ mb: 2 }}>📊 Order Summary</Typography>
//                 <Grid container spacing={2} sx={{ mt: 1 }}>
//                   <Grid item xs={6} sm={3}>
//                     <Typography variant="body2">Total Items:</Typography>
//                     <Typography variant="h6">{tableData.length}</Typography>
//                   </Grid>
//                   <Grid item xs={6} sm={3}>
//                     <Typography variant="body2">Total Quantity:</Typography>
//                     <Typography variant="h6">{tableData.reduce((sum, item) => sum + item.qty, 0)}</Typography>
//                   </Grid>
//                   <Grid item xs={6} sm={3}>
//                     <Typography variant="body2">Total Amount:</Typography>
//                     <Typography variant="h6">₹{tableData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</Typography>
//                   </Grid>
//                   <Grid item xs={6} sm={3}>
//                     <Button
//                       variant="contained"
//                       fullWidth
//                       onClick={handleSubmitOrder}
//                       sx={{ 
//                         backgroundColor: '#2196F3',
//                         '&:hover': { backgroundColor: '#1976d2' }
//                       }}
//                     >
//                       Submit Order
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Box>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* Barcode Scanner Dialog */}
//       {isClient && (
//         <Dialog
//           open={showScanner}
//           onClose={stopScanner}
//           maxWidth="md"
//           fullWidth
//           fullScreen={getWindowWidth() < 600}
//           PaperProps={{
//             sx: {
//               maxWidth: { xs: '100%', sm: '80%', md: '600px' },
//               height: { xs: '100vh', sm: '600px' },
//               margin: { xs: 0, sm: 'auto' },
//               borderRadius: { xs: 0, sm: 2 }
//             }
//           }}
//         >
//           <DialogTitle sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             backgroundColor: '#1976d2',
//             color: 'white'
//           }}>
//             <Typography variant="h6">📷 Scan Barcode</Typography>
//             <IconButton onClick={stopScanner} sx={{ color: 'white' }}>
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
          
//           <DialogContent sx={{ 
//             p: 2,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             <Typography variant="body2" sx={{ 
//               mb: 2, 
//               color: 'text.secondary',
//               textAlign: 'center'
//             }}>
//               Point your camera at the barcode
//             </Typography>
            
//             <Box
//               id="qr-reader"
//               sx={{
//                 width: '100%',
//                 height: { xs: '70vh', sm: '400px' },
//                 border: '2px dashed #ccc',
//                 borderRadius: 2,
//                 overflow: 'hidden',
//                 backgroundColor: '#000'
//               }}
//             />
            
//             <Typography variant="caption" sx={{ 
//               mt: 2, 
//               display: 'block', 
//               color: 'text.secondary',
//               textAlign: 'center'
//             }}>
//               The scanner will automatically detect barcodes
//             </Typography>
//           </DialogContent>
          
//           <DialogActions sx={{ 
//             p: 2,
//             backgroundColor: '#f5f5f5'
//           }}>
//             <Button 
//               onClick={stopScanner} 
//               variant="outlined"
//               sx={{ mr: 2 }}
//             >
//               Cancel
//             </Button>
//             <Typography variant="body2" sx={{ 
//               flexGrow: 1, 
//               textAlign: 'center', 
//               color: 'text.secondary',
//               fontSize: '12px'
//             }}>
//               Camera permission required • Works best in good light
//             </Typography>
//           </DialogActions>
//         </Dialog>
//       )}
//     </Box>
//   );
// };

// export default ScanBarcode;






'use client';
import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  Paper,
  Modal,
  Fade,
} from '@mui/material';
import { 
  CameraAlt as CameraIcon, 
  Close as CloseIcon, 
  QrCodeScanner as QrCodeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";
import { useRouter } from 'next/navigation';
import { TbListSearch } from "react-icons/tb";

const ScanBarcode = () => {
  // Main state
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [useStyleCodeMode, setUseStyleCodeMode] = useState(false);
  const [fillByRatioMode, setFillByRatioMode] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // NEW: Store current product info to track product changes
  const [currentProductInfo, setCurrentProductInfo] = useState({
    barcode: '',
    style: '',
    product: ''
  });
  
  // NEW: Store ratio data in localStorage with product key
  const [ratioData, setRatioData] = useState({
    totalQty: '',
    ratios: {}
  });
  
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    Party: '',
    PARTY_KEY: '',
    SHIPPING_PARTY: '',
    SHP_PARTY_KEY: '',
    Branch: '',
    PARTYDTL_ID: '',
    SHIPPING_PLACE: '',
    SHP_PARTYDTL_ID: '',
    Order_Type: 'Sales And Work-Order',
    ORDBK_TYPE: '2',
    Status: 'O',
    
    // New fields
    ORDER_NO: '',
    ORDER_DATE: new Date().toLocaleDateString('en-GB'),
    LAST_ORD_NO: '',
    SERIES: '',
    PARTY_ORD_NO: '',
    SEASON: '',
    ORD_REF_DT: '',
    QUOTE_NO: '',
    Broker: '',
    BROKER_KEY: '',
    SALESPERSON_1: '',
    SALEPERSON1_KEY: '',
    SALESPERSON_2: '',
    SALEPERSON2_KEY: '',
    MERCHANDISER_NAME: '',
    MERCHANDISER_ID: '',
    REMARK_STATUS: '',
    GST_APPL: 'N',
    GST_TYPE: 'STATE',
    DLV_DT: '',
    ORG_DLV_DT: '',
    MAIN_DETAILS: 'G',
    RACK_MIN: '0',
    REGISTERED_DEALER: '0',
    SHORT_CLOSE: '0',
    READY_SI: '0',
    PLANNING: '0'
  });

  const [newItemData, setNewItemData] = useState({
    barcode: '',
    product: '',
    style: '',
    type: '',
    shade: '',
    mrp: '',
    rate: '',
    qty: '',
    discount: '',
    sets: '',
    convFact: '1',
    remark: '',
    varPer: '0',
    stdQty: '',
    setNo: '',
    percent: '0',
    rQty: '',
    divDt: ''
  });

  // State for style code input
  const [styleCodeInput, setStyleCodeInput] = useState('');
  const [isLoadingStyleCode, setIsLoadingStyleCode] = useState(false);
  const styleCodeTimeoutRef = useRef(null);

  const [sizeDetailsData, setSizeDetailsData] = useState([]);
  const [tableData, setTableData] = useState([]);
  
  // Store available sizes from API response for ratio calculation
  const [availableSizes, setAvailableSizes] = useState([]);

  // State for dropdowns
  const [partyOptions, setPartyOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [shippingPartyOptions, setShippingPartyOptions] = useState([]);
  const [shippingPlaceOptions, setShippingPlaceOptions] = useState([]);
  const [brokerOptions, setBrokerOptions] = useState([]);
  const [salesperson1Options, setSalesperson1Options] = useState([]);
  const [salesperson2Options, setSalesperson2Options] = useState([]);
  const [merchandiserOptions, setMerchandiserOptions] = useState([]);
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [orderTypeOptions, setOrderTypeOptions] = useState(['Sales And Work-Order', 'Sales Order', 'Work Order']);
  const [statusOptions] = useState(['O', 'C', 'S']);

  // State for mappings
  const [partyMapping, setPartyMapping] = useState({});
  const [branchMapping, setBranchMapping] = useState({});
  const [shippingBranchMapping, setShippingBranchMapping] = useState({});
  const [brokerMapping, setBrokerMapping] = useState({});
  const [salesperson1Mapping, setSalesperson1Mapping] = useState({});
  const [salesperson2Mapping, setSalesperson2Mapping] = useState({});
  const [merchandiserMapping, setMerchandiserMapping] = useState({});
  const [seasonMapping, setSeasonMapping] = useState({});

  // Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Store style data for later use in payload
  const [currentStyleData, setCurrentStyleData] = useState(null);

 
const [companyConfig, setCompanyConfig] = useState({
  CO_ID: '',
  COBR_ID: ''
});


useEffect(() => {
  setIsClient(true);
  

  if (typeof window !== 'undefined') {
    const storedCO_ID = localStorage.getItem('CO_ID') || '';
    const storedCOBR_ID = localStorage.getItem('COBR_ID') || '';
    
    setCompanyConfig({
      CO_ID: storedCO_ID,
      COBR_ID: storedCOBR_ID
    });
    
    console.log('Loaded company config from localStorage:', {
      CO_ID: storedCO_ID,
      COBR_ID: storedCOBR_ID
    });
  }
}, []);

  const scannerRef = useRef(null);
  const qrCodeScannerRef = useRef(null);
  const barcodeInputRef = useRef(null);
  const styleCodeInputRef = useRef(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Text field styles
  const textInputSx = {
    '& .MuiInputBase-root': {
      height: 40,
      fontSize: '14px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '14px',
      top: '-4px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      overflow: 'hidden',
      height: 40,
      fontSize: '14px',
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '10px 12px !important',
      fontSize: '14px !important',
      lineHeight: '1.4',
    },
  };

  const DropInputSx = {
    ...textInputSx,
    '& .MuiAutocomplete-endAdornment': {
      top: '50%',
      transform: 'translateY(-50%)',
      right: '10px',
    },
  };

  const datePickerSx = {
    "& .MuiInputBase-root": {
      height: "40px", 
    },
    "& .MuiInputBase-input": {
      padding: "10px 12px", 
      fontSize: "14px",
    },
    "& .MuiInputLabel-root": {
      top: "-4px", 
      fontSize: "14px",
    },
  };

  // NEW: Get ratio data from localStorage for current product
  const getRatioDataFromStorage = (productKey) => {
    if (!isClient || !productKey) return { totalQty: '', ratios: {} };
    
    try {
      const storedData = localStorage.getItem(`ratioData_${productKey}`);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error reading ratio data from storage:', error);
    }
    return { totalQty: '', ratios: {} };
  };

  // NEW: Save ratio data to localStorage for current product
  const saveRatioDataToStorage = (productKey, data) => {
    if (!isClient || !productKey) return;
    
    try {
      localStorage.setItem(`ratioData_${productKey}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving ratio data to storage:', error);
    }
  };

  // NEW: Generate unique product key for localStorage
  const generateProductKey = (barcode, style, product) => {
    return `${barcode || ''}_${style || ''}_${product || ''}`.trim();
  };

  // Check if window is available
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    if (isClient) {
      fetchInitialData();
      generateOrderNumber();
    }
  }, [isClient]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (styleCodeTimeoutRef.current) {
        clearTimeout(styleCodeTimeoutRef.current);
      }
    };
  }, []);

  // Generate order number
  const generateOrderNumber = async () => {
    try {
      setIsLoadingData(true);
      
      const seriesPayload = {
        "MODULENAME": "Ordbk",
        "TBLNAME": "Ordbk",
        "FLDNAME": "Ordbk_KEY",
        "NCOLLEN": 0,
        "CPREFIX": "",
        "COBR_ID": companyConfig.COBR_ID,
        "FCYR_KEY": "25",
        "TRNSTYPE": "M",
        "SERIESID": 66,
        "FLAG": "Series"
      };

      const seriesResponse = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', seriesPayload);
      
      if (seriesResponse.data.DATA && seriesResponse.data.DATA.length > 0) {
        const prefix = seriesResponse.data.DATA[0].CPREFIX;
        
        const orderPayload = {
          "MODULENAME": "Ordbk",
          "TBLNAME": "Ordbk",
          "FLDNAME": "Ordbk_No",
          "NCOLLEN": 6,
          "CPREFIX": prefix,
          "COBR_ID": companyConfig.COBR_ID,
          "FCYR_KEY": "25",
          "TRNSTYPE": "T",
          "SERIESID": 0,
          "FLAG": ""
        };

        const orderResponse = await axiosInstance.post('/GetSeriesSettings/GetSeriesLastNewKey', orderPayload);
        
        if (orderResponse.data.DATA && orderResponse.data.DATA.length > 0) {
          const orderData = orderResponse.data.DATA[0];
          const correctOrdbkKey = `25${companyConfig.COBR_ID}${orderData.ID}`;
          
          setFormData(prev => ({
            ...prev,
            ORDER_NO: orderData.ID,
            LAST_ORD_NO: orderData.LASTID,
            SERIES: prefix,
            ORDBK_KEY: correctOrdbkKey
          }));
        }
      }
    } catch (error) {
      console.error('Error generating order number:', error);
      showSnackbar('Error generating order number', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch initial dropdown data - MODIFIED: Auto-select first party
  const fetchInitialData = async () => {
    try {
      setIsLoadingData(true);
      
      // Fetch all data in parallel
      await Promise.all([
        fetchPartiesByName(),
        fetchBrokerData(),
        fetchSalespersonData(),
        fetchMerchandiserData(),
        fetchSeasonData()
      ]);
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showSnackbar('Error loading initial data', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch party data - MODIFIED: Auto-select first party
  const fetchPartiesByName = async (name = "") => {
    try {
      const response = await axiosInstance.post("Party/GetParty_By_Name", {
        PARTY_NAME: name
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const parties = response.data.DATA.map(item => item.PARTY_NAME || '');
        setPartyOptions(parties);
        setShippingPartyOptions(parties);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.PARTY_NAME && item.PARTY_KEY) {
            mapping[item.PARTY_NAME] = item.PARTY_KEY;
          }
        });
        setPartyMapping(mapping);
        
        // NEW: Auto-select first party if no party is selected
        if (parties.length > 0 && !formData.Party) {
          const firstParty = parties[0];
          const firstPartyKey = mapping[firstParty];
          
          // Update form data with first party
          setFormData(prev => ({
            ...prev,
            Party: firstParty,
            PARTY_KEY: firstPartyKey,
            SHIPPING_PARTY: firstParty,
            SHP_PARTY_KEY: firstPartyKey
          }));
          
          // Fetch branches for the first party
          fetchPartyDetails(firstPartyKey);
        }
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
      showSnackbar('Error fetching parties', 'error');
    }
  };

  // Fetch party branches - MODIFIED: Auto-select first branch
  const fetchPartyDetails = async (partyKey, isShippingParty = false) => {
    if (!partyKey) return;
    
    try {
      const response = await axiosInstance.post("Party/GetPartyDtlDrp", {
        PARTY_KEY: partyKey
      });
      
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const branches = response.data.DATA.map(item => item.PLACE || '');
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.PLACE && item.PARTYDTL_ID) {
            mapping[item.PLACE] = item.PARTYDTL_ID;
          }
        });
        
        if (isShippingParty) {
          setShippingPlaceOptions(branches);
          setShippingBranchMapping(mapping);
          
          // Auto-select first shipping branch
          if (branches.length > 0 && !formData.SHIPPING_PLACE) {
            const firstBranch = branches[0];
            const firstBranchId = mapping[firstBranch];
            
            setFormData(prev => ({
              ...prev,
              SHIPPING_PLACE: firstBranch,
              SHP_PARTYDTL_ID: firstBranchId
            }));
          }
        } else {
          setBranchOptions(branches);
          setBranchMapping(mapping);
          
          // Auto-select first branch for main party
          if (branches.length > 0 && !formData.Branch) {
            const firstBranch = branches[0];
            const firstBranchId = mapping[firstBranch];
            
            setFormData(prev => ({
              ...prev,
              Branch: firstBranch,
              PARTYDTL_ID: firstBranchId,
              // Also set shipping place to same branch if not already set
              ...(!prev.SHIPPING_PLACE && {
                SHIPPING_PLACE: firstBranch,
                SHP_PARTYDTL_ID: firstBranchId
              })
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching party details:", error);
      showSnackbar('Error fetching branch details', 'error');
    }
  };

  // Fetch broker data
  const fetchBrokerData = async () => {
    try {
      const payload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "BROKER_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };

      const response = await axiosInstance.post('/BROKER/GetBrokerDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const brokers = response.data.DATA.map(item => item.BROKER_NAME || '');
        setBrokerOptions(brokers);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.BROKER_NAME && item.BROKER_KEY) {
            mapping[item.BROKER_NAME] = item.BROKER_KEY;
          }
        });
        setBrokerMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching broker data:', error);
    }
  };

  // Fetch salesperson data
  const fetchSalespersonData = async () => {
    try {
      const payload = {
        "PARTY_KEY": "",
        "FLAG": "Drp",
        "SALEPERSON_KEY": "",
        "PageNumber": 1,
        "PageSize": 100,
        "SearchText": ""
      };

      const response = await axiosInstance.post('/SALEPERSON/GetSALEPERSONDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const salespersons = response.data.DATA.map(item => item.SALEPERSON_NAME || '');
        setSalesperson1Options(salespersons);
        setSalesperson2Options(salespersons);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.SALEPERSON_NAME && item.SALEPERSON_KEY) {
            mapping[item.SALEPERSON_NAME] = item.SALEPERSON_KEY;
          }
        });
        setSalesperson1Mapping(mapping);
        setSalesperson2Mapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching salesperson data:', error);
    }
  };

  // Fetch merchandiser data
  const fetchMerchandiserData = async () => {
    try {
      const payload = {
        "FLAG": "MECH"
      };

      const response = await axiosInstance.post('/USERS/GetUserLoginDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const merchandisers = response.data.DATA.map(item => item.USER_NAME || '');
        setMerchandiserOptions(merchandisers);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.USER_NAME && item.USER_ID) {
            mapping[item.USER_NAME] = item.USER_ID;
          }
        });
        setMerchandiserMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching merchandiser data:', error);
    }
  };

  // Fetch season data
  const fetchSeasonData = async () => {
    try {
      const payload = {
        "FLAG": "P",
        "TBLNAME": "SEASON",
        "FLDNAME": "SEASON_KEY",
        "ID": "",
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": ""
      };

      const response = await axiosInstance.post('/SEASON/GetSEASONDrp', payload);
      if (response.data.DATA && Array.isArray(response.data.DATA)) {
        const seasons = response.data.DATA.map(item => item.SEASON_NAME || '');
        setSeasonOptions(seasons);
        
        const mapping = {};
        response.data.DATA.forEach(item => {
          if (item.SEASON_NAME && item.SEASON_KEY) {
            mapping[item.SEASON_NAME] = item.SEASON_KEY;
          }
        });
        setSeasonMapping(mapping);
      }
    } catch (error) {
      console.error('Error fetching season data:', error);
    }
  };

// Fetch style data by barcode - MODIFIED: Find exact barcode match
const fetchStyleDataByBarcode = async (barcode) => {
  if (!barcode || barcode.trim() === '') {
    setScannerError('Please enter a barcode');
    return;
  }
  
  try {
    setIsLoadingBarcode(true);
    setScannerError('');
    
    console.log('Fetching data for barcode:', barcode);
    
    const payload = {
      "FGSTYLE_ID": "",
      "FGPRD_KEY": "",
      "FGSTYLE_CODE": "",
      "ALT_BARCODE": barcode.trim(),
      "FLAG": ""
    };

    const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);
    console.log('API Response:', response.data);

    if (response.data.DATA && response.data.DATA.length > 0) {
      // Find the exact barcode match from the response array
      const exactMatch = response.data.DATA.find(item => 
        item.ALT_BARCODE && item.ALT_BARCODE.toString() === barcode.trim()
      );
      
      // If exact match not found, use the first item (fallback)
      const styleData = exactMatch || response.data.DATA[0];
      
      console.log('Selected Style Data:', styleData);
      console.log('Exact match found:', !!exactMatch);
      
      // Extract product key from response
      const productKey = styleData.FGPRD_KEY || "";
      
      // Check if product is different from current
      const isSameProduct = (
        currentProductInfo.productKey === productKey &&
        currentProductInfo.style === (styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '')
      );
      
      // Update current product info with product key
      const newProductInfo = {
        barcode: styleData.ALT_BARCODE || styleData.STYSTKDTL_KEY || barcode,
        style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
        product: styleData.FGPRD_NAME || '',
        productKey: productKey
      };
      
      setCurrentProductInfo(newProductInfo);
      
      // If product is different, show warning and clear ratio data
      if (currentProductInfo.productKey && !isSameProduct) {
        if (Object.keys(ratioData.ratios).length > 0) {
          showSnackbar('Product has changed. Please enter new ratios for this product.', 'warning');
        }
        // Clear ratio data for new product
        setRatioData({
          totalQty: '',
          ratios: {}
        });
      } else {
        // Load saved ratio data for this product
        const savedRatioData = getRatioDataFromStorage(productKey);
        if (savedRatioData.ratios && Object.keys(savedRatioData.ratios).length > 0) {
          setRatioData(savedRatioData);
          showSnackbar('Previous ratios loaded for this product', 'info');
        }
      }
      
      // Store all available sizes from API response
      // setAvailableSizes(response.data.DATA);
      setCurrentStyleData(styleData);
      
      const shadeValue = styleData.FGSHADE_NAME || '';
      const sizeValue = styleData.STYSIZE_NAME || '';
      
      setNewItemData({
        ...newItemData,
        barcode: newProductInfo.barcode,
        product: newProductInfo.product,
        style: newProductInfo.style,
        type: styleData.FGTYPE_NAME || '',
        shade: shadeValue,
        size: sizeValue,
        mrp: styleData.MRP ? styleData.MRP.toString() : '0',
        rate: styleData.SSP ? styleData.SSP.toString() : '0',
        qty: '',
        discount: '0',
        sets: '1',
        convFact: '1',
        remark: ''
      });
      
      // Fetch size details
      await fetchSizeDetailsForStyle(styleData);
      
    } else {
      setScannerError('No product found for this barcode. Please check the barcode and try again.');
      showSnackbar('Product not found', 'warning');
    }
  } catch (error) {
    console.error('Error fetching style data:', error);
    setScannerError('Error fetching product details. Please try again.');
    showSnackbar('Error fetching product', 'error');
  } finally {
    setIsLoadingBarcode(false);
  }
};

// Fetch style data by style code - MODIFIED: Find exact barcode match
const fetchStyleDataByCode = async (styleCode) => {
  if (!styleCode) return;

  try {
    setIsLoadingStyleCode(true);
    setScannerError('');
    
    console.log('Fetching data for style code:', styleCode);
    
    const payload = {
      "FGSTYLE_ID": "",
      "FGPRD_KEY": "",
      "FGSTYLE_CODE": styleCode.trim(),
      "FLAG": ""
    };

    const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);
    console.log('API Response:', response.data);

    if (response.data.DATA && response.data.DATA.length > 0) {
      // For style code search, use the first item (since all will have same style)
      const styleData = response.data.DATA[0];
      
      // But if user entered a barcode in style code mode, try to find exact match
      let selectedStyleData = styleData;
      if (styleCodeInput && styleCodeInput.trim() !== '') {
        const exactMatch = response.data.DATA.find(item => 
          item.ALT_BARCODE && item.ALT_BARCODE.toString() === styleCodeInput.trim()
        );
        if (exactMatch) {
          selectedStyleData = exactMatch;
        }
      }
      
      console.log('Selected Style Data:', selectedStyleData);
      
      // Extract product key from response
      const productKey = selectedStyleData.FGPRD_KEY || "";
      
      // Check if product is different from current
      const isSameProduct = (
        currentProductInfo.productKey === productKey &&
        currentProductInfo.style === (selectedStyleData.FGSTYLE_CODE || selectedStyleData.FGSTYLE_NAME || '')
      );
      
      // Update current product info with product key
      const newProductInfo = {
        barcode: selectedStyleData.ALT_BARCODE || selectedStyleData.STYSTKDTL_KEY || '',
        style: selectedStyleData.FGSTYLE_CODE || selectedStyleData.FGSTYLE_NAME || '',
        product: selectedStyleData.FGPRD_NAME || '',
        productKey: productKey
      };
      
      setCurrentProductInfo(newProductInfo);
      
      // If product is different, show warning and clear ratio data
      if (currentProductInfo.productKey && !isSameProduct) {
        if (Object.keys(ratioData.ratios).length > 0) {
          showSnackbar('Product has changed. Please enter new ratios for this product.', 'warning');
        }
        // Clear ratio data for new product
        setRatioData({
          totalQty: '',
          ratios: {}
        });
      } else {
        // Load saved ratio data for this product
        const savedRatioData = getRatioDataFromStorage(productKey);
        if (savedRatioData.ratios && Object.keys(savedRatioData.ratios).length > 0) {
          setRatioData(savedRatioData);
          showSnackbar('Previous ratios loaded for this product', 'info');
        }
      }
      
      // Store all available sizes from API response
      // setAvailableSizes(response.data.DATA);
      setCurrentStyleData(selectedStyleData);
      
      const shadeValue = selectedStyleData.FGSHADE_NAME || '';
      const sizeValue = selectedStyleData.STYSIZE_NAME || '';
      
      setNewItemData({
        ...newItemData,
        barcode: newProductInfo.barcode,
        product: newProductInfo.product,
        style: newProductInfo.style,
        type: selectedStyleData.FGTYPE_NAME || '',
        shade: shadeValue,
        size: sizeValue,
        mrp: selectedStyleData.MRP ? selectedStyleData.MRP.toString() : '0',
        rate: selectedStyleData.SSP ? selectedStyleData.SSP.toString() : '0',
        qty: '',
        discount: '0',
        sets: '1',
        convFact: '1',
        remark: ''
      });
      
      showSnackbar('Product found successfully by style code!');
      
      // Fetch size details
      await fetchSizeDetailsForStyle(selectedStyleData);
      
    } else {
      setScannerError('No product found for this style code. Please check the style code and try again.');
      showSnackbar('Product not found', 'warning');
    }
  } catch (error) {
    console.error('Error fetching style data by code:', error);
    setScannerError('Error fetching product details. Please try again.');
    showSnackbar('Error fetching product', 'error');
  } finally {
    setIsLoadingStyleCode(false);
  }
};

  // Handle style code input change with debounce
  const handleStyleCodeInputChange = (e) => {
    const value = e.target.value;
    setStyleCodeInput(value);
    
    if (styleCodeTimeoutRef.current) {
      clearTimeout(styleCodeTimeoutRef.current);
    }
    
    if (value && value.trim() !== '') {
      styleCodeTimeoutRef.current = setTimeout(() => {
        fetchStyleDataByCode(value.trim());
      }, 500);
    }
  };

  // Handle style code Enter key press
  const handleStyleCodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (styleCodeTimeoutRef.current) {
        clearTimeout(styleCodeTimeoutRef.current);
      }
      fetchStyleDataByCode(styleCodeInput.trim());
    }
  };

  // Fetch size details for style
const fetchSizeDetailsForStyle = async (styleData) => {
  try {
    const fgprdKey = styleData.FGPRD_KEY;
    const fgstyleId = styleData.FGSTYLE_ID;
    const fgtypeKey = styleData.FGTYPE_KEY || "";
    const fgshadeKey = styleData.FGSHADE_KEY || "";
    const fgptnKey = styleData.FGPTN_KEY || "";

    if (!fgprdKey || !fgstyleId) {
      console.warn('Missing required data for size details');
      return;
    }

    const payload = {
      "FGSTYLE_ID": fgstyleId,
      "FGPRD_KEY": fgprdKey,
      "FGTYPE_KEY": fgtypeKey,
      "FGSHADE_KEY": fgshadeKey,
      "FGPTN_KEY": fgptnKey,
      "MRP": parseFloat(styleData.MRP) || 0,
      "SSP": parseFloat(styleData.SSP) || 0,
      "PARTY_KEY": formData.PARTY_KEY || "",
      "PARTYDTL_ID": formData.PARTYDTL_ID || 0,
      "FLAG": "S"
    };

    console.log('Fetching size details with payload:', payload);

    const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', payload);
    console.log('Size Details Response:', response.data);

    if (response.data.DATA && response.data.DATA.length > 0) {
      // Extract STYSIZE_NAME from size details response
      const sizeDetailsFromAPI = response.data.DATA;
      
      // Store available sizes for ratio section
      const availableSizesForRatio = sizeDetailsFromAPI.map(size => ({
        STYSIZE_ID: size.STYSIZE_ID,
        STYSIZE_NAME: size.STYSIZE_NAME,
        MRP: size.MRP,
        WSP: size.WSP || size.RATE
      }));
      
      setAvailableSizes(availableSizesForRatio);
      
      // Create transformed size details for table
      const transformedSizeDetails = sizeDetailsFromAPI.map((size, index) => ({
        STYSIZE_ID: size.STYSIZE_ID || index + 1,
        STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
        FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
        QTY: 0,
        ITM_AMT: 0,
        ORDER_QTY: 0,
        MRP: parseFloat(size.MRP) || parseFloat(styleData.MRP) || 0,
        RATE: parseFloat(size.WSP) || parseFloat(size.RATE) || parseFloat(styleData.SSP) || 0,
        WSP: parseFloat(size.WSP) || parseFloat(size.RATE) || parseFloat(styleData.SSP) || 0,
        FGITEM_KEY: styleData.STYSTKDTL_KEY || ""
      }));

      setSizeDetailsData(transformedSizeDetails);
      showSnackbar('Size details loaded! Enter quantities.');
      
      // Clear any existing ratio data for this product
      const productKey = styleData.FGPRD_KEY || "";
      const savedRatioData = getRatioDataFromStorage(productKey);
      if (savedRatioData.ratios && Object.keys(savedRatioData.ratios).length > 0) {
        setRatioData(savedRatioData);
        showSnackbar('Previous ratios loaded for this product', 'info');
      }
    } else {
      // Use the STYSIZE_NAME from the original response
      const stysizeName = styleData.STYSIZE_NAME || 'Default';
      const stysizeId = styleData.STYSIZE_ID || 1;
      
      const defaultSizes = [
        { 
          STYSIZE_NAME: stysizeName,
          STYSIZE_ID: stysizeId, 
          QTY: 0, 
          MRP: parseFloat(styleData.MRP) || 0, 
          RATE: parseFloat(styleData.SSP) || 0,
          WSP: parseFloat(styleData.SSP) || 0
        }
      ];
      
      setAvailableSizes(defaultSizes);
      setSizeDetailsData(defaultSizes);
    }
  } catch (error) {
    console.error('Error fetching size details:', error);
    
    // FALLBACK: Extract size info from the original style data
    const stysizeName = styleData.STYSIZE_NAME || 'Default';
    const stysizeId = styleData.STYSIZE_ID || 1;
    
    const defaultSizes = [
      { 
        STYSIZE_NAME: stysizeName,
        STYSIZE_ID: stysizeId, 
        QTY: 0, 
        MRP: parseFloat(newItemData.mrp) || 0, 
        RATE: parseFloat(newItemData.rate) || 0,
        WSP: parseFloat(newItemData.rate) || 0
      }
    ];
    
    setAvailableSizes(defaultSizes);
    setSizeDetailsData(defaultSizes);
    showSnackbar(`Using size: ${stysizeName}. Enter quantity.`, 'warning');
  }
};

 const handleRatioChange = (sizeName, value) => {
  const newRatioData = {
    ...ratioData,
    ratios: {
      ...ratioData.ratios,
      [sizeName]: value
    }
  };
  
  setRatioData(newRatioData);
  
  // Save to localStorage if we have a product key
  if (currentProductInfo.productKey) {
    saveRatioDataToStorage(currentProductInfo.productKey, newRatioData);
  }
};

// Handle total quantity change for ratio calculation - MODIFIED: Save to localStorage
const handleTotalQtyChange = (value) => {
  const newRatioData = {
    ...ratioData,
    totalQty: value
  };
  
  setRatioData(newRatioData);
  
  // Save to localStorage if we have a product key
  if (currentProductInfo.productKey) {
    saveRatioDataToStorage(currentProductInfo.productKey, newRatioData);
  }
};

// Calculate and fill quantities based on ratios
const fillQuantitiesByRatio = () => {
  const totalQty = parseFloat(ratioData.totalQty);
  if (!totalQty || totalQty <= 0) {
    showSnackbar('Please enter a valid total quantity', 'error');
    return;
  }

  const ratios = ratioData.ratios;
  const sizeNames = Object.keys(ratios);
  
  // Check if all sizes have ratios
  if (sizeNames.length === 0) {
    showSnackbar('Please enter ratios for at least one size', 'error');
    return;
  }

  // Calculate total ratio sum
  const totalRatio = sizeNames.reduce((sum, sizeName) => {
    const ratio = parseFloat(ratios[sizeName]) || 0;
    return sum + ratio;
  }, 0);

  if (totalRatio === 0) {
    showSnackbar('Total ratio cannot be zero', 'error');
    return;
  }

  // Calculate quantities for each size and update sizeDetailsData
  const updatedSizeDetails = [...sizeDetailsData];
  let allocatedQty = 0;

  // First pass: allocate based on ratios
  sizeNames.forEach((sizeName, index) => {
    const ratio = parseFloat(ratios[sizeName]) || 0;
    const exactQty = (ratio / totalRatio) * totalQty;
    const roundedQty = Math.round(exactQty);
    
    // Find the size in sizeDetailsData
    const sizeIndex = updatedSizeDetails.findIndex(size => size.STYSIZE_NAME === sizeName);
    if (sizeIndex !== -1) {
      const wsp = updatedSizeDetails[sizeIndex].WSP || updatedSizeDetails[sizeIndex].RATE || 0;
      const amount = roundedQty * wsp;
      
      updatedSizeDetails[sizeIndex] = {
        ...updatedSizeDetails[sizeIndex],
        QTY: roundedQty,
        ITM_AMT: amount
      };
      allocatedQty += roundedQty;
    }
  });

  // Adjust for rounding differences
  const difference = totalQty - allocatedQty;
  if (difference !== 0 && sizeNames.length > 0) {
    // Add/remove the difference from the first size
    const firstSizeName = sizeNames[0];
    const firstSizeIndex = updatedSizeDetails.findIndex(size => size.STYSIZE_NAME === firstSizeName);
    if (firstSizeIndex !== -1) {
      const wsp = updatedSizeDetails[firstSizeIndex].WSP || updatedSizeDetails[firstSizeIndex].RATE || 0;
      const newQty = updatedSizeDetails[firstSizeIndex].QTY + difference;
      const newAmount = newQty * wsp;
      
      updatedSizeDetails[firstSizeIndex] = {
        ...updatedSizeDetails[firstSizeIndex],
        QTY: newQty,
        ITM_AMT: newAmount
      };
    }
  }

  setSizeDetailsData(updatedSizeDetails);
  
  // Update total quantity in newItemData
  const newTotalQty = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
  const totalAmount = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.ITM_AMT) || 0), 0);
  
  setNewItemData(prev => ({ 
    ...prev, 
    qty: newTotalQty.toString(),
    rate: newTotalQty > 0 ? (totalAmount / newTotalQty).toFixed(2) : prev.rate
  }));
  
  showSnackbar(`Quantities filled successfully! Total: ${newTotalQty}`, 'success');
};

// Handle confirm button for adding item to order - MODIFIED: Clear ratio data
const handleConfirmItem = () => {
  if (!newItemData.product || !newItemData.style) {
    showSnackbar("Please scan a valid barcode or enter style code first", 'error');
    return;
  }

  const totalQty = calculateTotalQty();
  if (totalQty === 0) {
    showSnackbar("Please enter quantity in size details", 'error');
    return;
  }

  const { amount, netAmount } = calculateAmount();

  const newItem = {
    id: Date.now(),
    barcode: newItemData.barcode,
    product: newItemData.product,
    style: newItemData.style,
    type: newItemData.type,
    shade: newItemData.shade,
    qty: totalQty,
    mrp: parseFloat(newItemData.mrp) || 0,
    rate: parseFloat(newItemData.rate) || 0,
    amount: amount,
    discAmt: parseFloat(newItemData.discount) || 0,
    netAmt: netAmount,
    sets: parseFloat(newItemData.sets) || 0,
    varPer: parseFloat(newItemData.varPer) || 0,
    remark: newItemData.remark,
    sizeDetails: [...sizeDetailsData],
    convFact: newItemData.convFact,
    styleData: currentStyleData
  };

  // Add to table
  setTableData(prev => [...prev, newItem]);

  // Reset form
  setNewItemData({
    barcode: '',
    product: '',
    style: '',
    type: '',
    shade: '',
    mrp: '',
    rate: '',
    qty: '',
    discount: '0',
    sets: '1',
    convFact: '1',
    remark: '',
    varPer: '0',
    stdQty: '',
    setNo: '',
    percent: '0',
    rQty: '',
    divDt: ''
  });
  
  // Reset style code input if in style code mode
  if (useStyleCodeMode) {
    setStyleCodeInput('');
  }
  
  // Clear current product info and ratio data
  setCurrentProductInfo({
    barcode: '',
    style: '',
    product: '',
    productKey: ''
  });
  setCurrentStyleData(null);
  setSizeDetailsData([]);
  setAvailableSizes([]);
  setFillByRatioMode(false);
  setRatioData({
    totalQty: '',
    ratios: {}
  });
  setScannerError('');

  showSnackbar('Item added to order! Go To Cart', 'success');
};

  // Handle form field changes - MODIFIED: Auto-select related fields
  const handleFormChange = (field, value) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    
    // Handle key mappings
    if (field === 'Party' && partyMapping[value]) {
      updatedFormData.PARTY_KEY = partyMapping[value];
      updatedFormData.SHIPPING_PARTY = value;
      updatedFormData.SHP_PARTY_KEY = partyMapping[value];
      
      // Also clear shipping place if party changes
      updatedFormData.SHIPPING_PLACE = '';
      updatedFormData.SHP_PARTYDTL_ID = '';
      
      fetchPartyDetails(partyMapping[value]);
    }
    
    if (field === 'SHIPPING_PARTY' && partyMapping[value]) {
      updatedFormData.SHP_PARTY_KEY = partyMapping[value];
      updatedFormData.SHIPPING_PLACE = '';
      fetchPartyDetails(partyMapping[value], true);
    }
    
    if (field === 'Branch' && branchMapping[value]) {
      updatedFormData.PARTYDTL_ID = branchMapping[value];
      // Auto-set shipping place to same branch if not already set
      if (!updatedFormData.SHIPPING_PLACE) {
        updatedFormData.SHIPPING_PLACE = value;
        updatedFormData.SHP_PARTYDTL_ID = branchMapping[value];
      }
    }
    
    if (field === 'SHIPPING_PLACE' && shippingBranchMapping[value]) {
      updatedFormData.SHP_PARTYDTL_ID = shippingBranchMapping[value];
    }
    
    if (field === 'Broker' && brokerMapping[value]) {
      updatedFormData.BROKER_KEY = brokerMapping[value];
    }
    
    if (field === 'SALESPERSON_1' && salesperson1Mapping[value]) {
      updatedFormData.SALEPERSON1_KEY = salesperson1Mapping[value];
    }
    
    if (field === 'SALESPERSON_2' && salesperson2Mapping[value]) {
      updatedFormData.SALEPERSON2_KEY = salesperson2Mapping[value];
    }
    
    if (field === 'MERCHANDISER_NAME' && merchandiserMapping[value]) {
      updatedFormData.MERCHANDISER_ID = merchandiserMapping[value];
    }
    
    if (field === 'SEASON' && seasonMapping[value]) {
      updatedFormData.CURR_SEASON_KEY = seasonMapping[value];
    }
    
    setFormData(updatedFormData);
  };

  // Handle new item data changes
  const handleNewItemChange = (field, value) => {
    setNewItemData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle barcode search (manual entry)
  const handleManualBarcodeSubmit = () => {
    if (!newItemData.barcode || newItemData.barcode.trim() === '') {
      setScannerError('Please enter a barcode');
      return;
    }
    
    fetchStyleDataByBarcode(newItemData.barcode);
  };

  const handleTable = () => {
    router.push('/inverntory/stock-enquiry-table');
  };

  // Handle cart icon click to open modal
  const handleCartIconClick = () => {
    if (tableData.length === 0) {
      showSnackbar('No items in the order yet', 'info');
      return;
    }
    setShowOrderModal(true);
  };

  // Handle Enter key press in barcode field
  const handleBarcodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualBarcodeSubmit();
    }
  };

  // Handle size quantity change
  const handleSizeQtyChange = (index, newQty) => {
    const updatedSizeDetails = [...sizeDetailsData];
    const qty = parseFloat(newQty) || 0;
    const rate = parseFloat(newItemData.rate) || 0;
    const amount = qty * rate;
    
    updatedSizeDetails[index] = {
      ...updatedSizeDetails[index],
      QTY: qty,
      ITM_AMT: amount,
      ORDER_QTY: qty
    };

    setSizeDetailsData(updatedSizeDetails);
    
    // Update total quantity
    const totalQty = updatedSizeDetails.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
    setNewItemData(prev => ({ ...prev, qty: totalQty.toString() }));
  };

  // Calculate total quantity from size details
  const calculateTotalQty = () => {
    return sizeDetailsData.reduce((sum, size) => sum + (parseFloat(size.QTY) || 0), 0);
  };

  // Calculate amount
  const calculateAmount = () => {
    const totalQty = calculateTotalQty();
    const rate = parseFloat(newItemData.rate) || 0;
    const discount = parseFloat(newItemData.discount) || 0;
    const amount = totalQty * rate;
    return {
      amount: amount,
      netAmount: amount - discount
    };
  };

 

  // Handle delete item from table
  const handleDeleteItem = (id) => {
    setTableData(prev => prev.filter(item => item.id !== id));
    showSnackbar('Item removed from order', 'info');
  };

  // Initialize scanner (client-side only)
  const initScanner = () => {
    if (typeof window === 'undefined') {
      console.error('Scanner not available on server');
      return;
    }

    if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current.clear().catch(err => {
        console.error("Failed to clear existing scanner", err);
      });
      qrCodeScannerRef.current = null;
    }

    const qrReaderElement = document.getElementById('qr-reader');
    if (!qrReaderElement) {
      console.error('qr-reader element not found');
      setScannerError('Scanner element not found. Please try again.');
      return;
    }

    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true
        },
        false
      );

      const onScanSuccess = (decodedText, decodedResult) => {
        console.log(`Scan result: ${decodedText}`, decodedResult);
        
        scanner.clear().then(() => {
          qrCodeScannerRef.current = null;
          setIsScanning(false);
          setShowScanner(false);
          
          setNewItemData(prev => ({ ...prev, barcode: decodedText }));
          
          fetchStyleDataByBarcode(decodedText);
          
          showSnackbar('Barcode scanned successfully!', 'success');
        }).catch(err => {
          console.error("Failed to clear scanner", err);
        });
      };

      const onScanFailure = (error) => {
        if (!error.includes('NotFoundException')) {
          console.warn(`Scan error: ${error}`);
        }
      };

      scanner.render(onScanSuccess, onScanFailure);
      qrCodeScannerRef.current = scanner;
      setIsScanning(true);
      setScannerError('');
      
    } catch (error) {
      console.error("Scanner initialization error:", error);
      setScannerError(`Failed to initialize scanner: ${error.message}`);
      showSnackbar('Scanner initialization failed. Please check camera permissions.', 'error');
      setShowScanner(false);
    }
  };

  // Start scanner
  const startScanner = () => {
    if (typeof window === 'undefined') {
      showSnackbar('Scanner not available on server', 'error');
      return;
    }
    setShowScanner(true);
    setScannerError('');
  };

  // Stop scanner
  const stopScanner = () => {
    if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
      qrCodeScannerRef.current = null;
    }
    setIsScanning(false);
    setShowScanner(false);
  };

  // Prepare submit payload with FIXED FGSTYLE_ID
 // Prepare submit payload with FIXED FGSTYLE_ID
const prepareSubmitPayload = () => {
  const dbFlag = 'I';
  const currentDate = new Date().toISOString().replace('T', ' ').split('.')[0];
  
  const userId = localStorage.getItem('USER_ID') || '1';
  const userName = localStorage.getItem('USER_NAME') || 'Admin';
  
  console.log('Company Config:', companyConfig);
  console.log('User Info:', { userId, userName });

  const getStatusValue = (status) => {
    const statusMapping = {
      'O': '1',
      'C': '0',
      'S': '5'
    };
    return statusMapping[status] || "1";
  };

  // Dynamic ORDBK_KEY generate करें
  const correctOrdbkKey = `25${companyConfig.COBR_ID}${formData.ORDER_NO}`;
  
  console.log('Using ORDBK_KEY:', correctOrdbkKey);

  const transformedOrdbkStyleList = tableData.map((item, index) => {
    const tempId = Date.now() + index;
    
    const fgstyleId = item.styleData?.FGSTYLE_ID || 0;
    const fgprdKey = item.styleData?.FGPRD_KEY || '';
    const fgtypeKey = item.styleData?.FGTYPE_KEY || '';
    const fgshadeKey = item.styleData?.FGSHADE_KEY || '';
    const fgptnKey = item.styleData?.FGPTN_KEY || '';
    
    console.log(`Item ${index} - FGSTYLE_ID: ${fgstyleId}, FGPRD_KEY: ${fgprdKey}`);

    return {
      DBFLAG: 'I',
      ORDBKSTY_ID: tempId,
      ORDBK_KEY: correctOrdbkKey,
      FGPRD_KEY: fgprdKey,
      FGSTYLE_ID: fgstyleId,
      FGSTYLE_CODE: item.style || '',
      FGTYPE_KEY: fgtypeKey,
      FGSHADE_KEY: fgshadeKey,
      FGPTN_KEY: fgptnKey,
      FGITEM_KEY: item.barcode || "",
      QTY: parseFloat(item.qty) || 0,
      STYCATRT_ID: 0,
      FGITM_KEY: item.FGITM_KEY || "",
      RATE: parseFloat(item.rate) || 0,
      AMT: parseFloat(item.amount) || 0,
      DLV_VAR_PERCENT: parseFloat(item.varPer) || 0,
      DLV_VAR_QTY: 0,
      OPEN_RATE: "",
      TERM_KEY: "",
      TERM_NAME: "",
      TERM_PERCENT: 0,
      TERM_FIX_AMT: 0,
      TERM_RATE: 0,
      TERM_PERQTY: 0,
      DISC_AMT: parseFloat(item.discAmt) || 0,
      NET_AMT: parseFloat(item.netAmt) || 0,
      INIT_DT: "1900-01-01 00:00:00.000",
      INIT_REMK: "",
      INIT_QTY: 0,
      DLV_DT: "1900-01-01 00:00:00.000",
      BAL_QTY: parseFloat(item.qty) || 0,
      STATUS: "1",
      STYLE_PRN: "",
      TYPE_PRN: "",
      MRP_PRN: parseFloat(item.mrp) || 0,
      REMK: item.remark || "",
      QUOTEDTL_ID: 0,
      SETQTY: parseFloat(item.sets) || 0,
      RQTY: 0,
      DISTBTR_KEY: "",
      LOTNO: formData.CURR_SEASON_KEY || "",
      WOBALQTY: parseFloat(item.qty) || 0,
      REFORDBKSTY_ID: 0,
      BOMSTY_ID: 0,
      ISRMREQ: "N",
      OP_QTY: 0,
      ORDBKSTYSZLIST: (item.sizeDetails || []).map((sizeItem, sizeIndex) => ({
        DBFLAG: 'I',
        ORDBKSTYSZ_ID: sizeItem.STYSIZE_ID || (tempId * 100 + sizeIndex),
        ORDBK_KEY: correctOrdbkKey,
        ORDBKSTY_ID: tempId,
        STYSIZE_ID: sizeItem.STYSIZE_ID || 0,
        STYSIZE_NAME: sizeItem.STYSIZE_NAME || "",
        QTY: parseFloat(sizeItem.QTY) || 0,
        INIT_DT: "1900-01-01 00:00:00.000",
        INIT_REMK: "",
        INIT_QTY: 0,
        BAL_QTY: parseFloat(sizeItem.QTY) || 0,
        MRP: parseFloat(item.mrp) || 0,
        WSP: parseFloat(item.rate) || 0,
        RQTY: 0,
        WOBALQTY: parseFloat(sizeItem.QTY) || 0,
        REFORDBKSTYSZ_ID: 0,
        OP_QTY: 0,
        HSNCODE_KEY: "IG001",
        GST_RATE_SLAB_ID: 39,
        ITM_AMT: parseFloat(sizeItem.ITM_AMT) || 0,
        DISC_AMT: 0,
        NET_AMT: parseFloat(sizeItem.ITM_AMT) || 0,
        SGST_AMT: 0,
        CGST_AMT: 0,
        IGST_AMT: 0,
        NET_SALE_RATE: 0,
        OTHER_AMT: 0,
        ADD_CESS_RATE: 0,
        ADD_CESS_AMT: 0
      }))
    };
  });

  // Calculate totals
  const totalQty = tableData.reduce((sum, item) => sum + (item.qty || 0), 0);
  const totalAmount = tableData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalDiscount = tableData.reduce((sum, item) => sum + (item.discAmt || 0), 0);
  const netAmount = totalAmount - totalDiscount;

  // Base payload with dynamic company IDs
  const basePayload = {
    DBFLAG: dbFlag,
    FCYR_KEY: "25",
    CO_ID: companyConfig.CO_ID,
    COBR_ID: companyConfig.COBR_ID, 
    ORDBK_NO: formData.ORDER_NO || "",
    CURR_SEASON_KEY: formData.CURR_SEASON_KEY || "",
    ORDBK_X: "",
    ORDBK_TNA_TYPE: "I",
    MERCHANDISER_ID: parseInt(formData.MERCHANDISER_ID) || 1,
    ORD_EVENT_KEY: "",
    ORG_DLV_DT: formatDateForAPI(formData.ORG_DLV_DT) || "1900-01-01T00:00:00",
    PLANNING: "0",
    STATUS: getStatusValue(formData.Status),
    ORDBK_KEY: correctOrdbkKey,
    ORDBK_DT: formatDateForAPI(formData.ORDER_DATE) || currentDate,
    PORD_REF: formData.PARTY_ORD_NO || "",
    PORD_DT: formatDateForAPI(formData.ORD_REF_DT) || "1900-01-01T00:00:00",
    QUOTE_NO: formData.QUOTE_NO || "",
    QUOTE_DT: formatDateForAPI(formData.ORDER_DATE) || currentDate,
    PARTY_KEY: formData.PARTY_KEY || "",
    PARTYDTL_ID: parseInt(formData.PARTYDTL_ID) || 0,
    BROKER_KEY: formData.BROKER_KEY || "",
    BROKER1_KEY: "",
    BROKER_COMM: 0.00,
    COMMON_DLV_DT_FLG: "0",
    STK_FLG: formData.RACK_MIN || "0",
    DLV_DT: formatDateForAPI(formData.DLV_DT) || "1900-01-01T00:00:00",
    DLV_PLACE: formData.SHIPPING_PLACE || "",
    TRSP_KEY: "",
    ORDBK_AMT: parseFloat(totalAmount) || 0,
    REMK: formData.REMARK_STATUS || "",
    CURRN_KEY: "",
    EX_RATE: 0,
    IMP_ORDBK_KEY: "",
    ORDBK_TYPE: formData.ORDBK_TYPE || "2",
    ROUND_OFF_DESC: "",
    ROUND_OFF: 0.00,
    BOMSTY_ID: 0,
    LOTWISE: formData.MAIN_DETAILS === "L" ? "Y" : "N",
    IsWO: "0",
    SuplKey: "",
    KNIT_DT: "1900-01-01 00:00:00.000",
    OrdBk_CoBr_Id: companyConfig.COBR_ID, // Dynamic COBR_ID
    GR_AMT: parseFloat(totalAmount) || 0,
    GST_APP: formData.GST_APPL || "N",
    GST_TYPE: formData.GST_TYPE === "STATE" ? "S" : "I",
    SHP_PARTY_KEY: formData.SHP_PARTY_KEY || formData.PARTY_KEY,
    SHP_PARTYDTL_ID: parseInt(formData.SHP_PARTYDTL_ID) || parseInt(formData.PARTYDTL_ID) || 0,
    STATE_CODE: "",
    ORDBK_ITM_AMT: parseFloat(totalAmount) || 0,
    ORDBK_SGST_AMT: 0,
    ORDBK_CGST_AMT: 0,
    ORDBK_IGST_AMT: 0,
    ORDBK_ADD_CESS_AMT: 0,
    ORDBK_GST_AMT: 0,
    ORDBK_EXTRA_AMT: 0,
    ORDBKSTYLIST: transformedOrdbkStyleList,
    ORDBKTERMLIST: [],
    ORDBKGSTLIST: [],
    DISTBTR_KEY: "",
    SALEPERSON1_KEY: formData.SALEPERSON1_KEY || "",
    SALEPERSON2_KEY: formData.SALEPERSON2_KEY || "",
    TRSP_KEY: "",
    PRICELIST_KEY: "",
    DESP_PORT: "",
    CREATED_BY: parseInt(userId) || 1,
    CREATED_DT: currentDate
  };

  console.log('Submit Payload:', JSON.stringify(basePayload, null, 2));
  return basePayload;
};

  // Helper function to format date for API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "1900-01-01T00:00:00";
    
    try {
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;
      }
      
      const date = new Date(dateString);
      return date.toISOString().split('T')[0] + 'T00:00:00';
    } catch (error) {
      console.error('Error formatting date for API:', error);
      return "1900-01-01T00:00:00";
    }
  };

  // Submit complete order
  const handleSubmitOrder = async () => {
    if (tableData.length === 0) {
      showSnackbar('Please add at least one item to the order', 'error');
      return;
    }

    if (!formData.Party || !formData.PARTY_KEY) {
      showSnackbar('Please select a party first', 'error');
      return;
    }

    try {
      setIsLoadingData(true);
      
      const payload = prepareSubmitPayload();
      const userName = localStorage.getItem('USER_NAME') || 'Admin';
      const strCobrid = companyConfig.COBR_ID;
      
      console.log('Submitting order with payload:', payload);
       console.log('strCobrid:', strCobrid);
      
      const response = await axiosInstance.post(
        `/ORDBK/ApiMangeOrdbk?UserName=${userName}&strCobrid=${strCobrid}`, 
        payload
      );
      
      console.log('Submit API Response:', response.data);
      
      if (response.data.RESPONSESTATUSCODE === 1) {
        showSnackbar(`Order submitted successfully! Order No: ${formData.ORDER_NO}`, 'success');
        
        // Reset form
        setTableData([]);
        setFormData({
          Party: '',
          PARTY_KEY: '',
          SHIPPING_PARTY: '',
          SHP_PARTY_KEY: '',
          Branch: '',
          PARTYDTL_ID: '',
          SHIPPING_PLACE: '',
          SHP_PARTYDTL_ID: '',
          Order_Type: 'Sales And Work-Order',
          ORDBK_TYPE: '2',
          Status: 'O',
          ORDER_NO: '',
          ORDER_DATE: new Date().toLocaleDateString('en-GB'),
          LAST_ORD_NO: '',
          SERIES: '',
          PARTY_ORD_NO: '',
          SEASON: '',
          ORD_REF_DT: '',
          QUOTE_NO: '',
          Broker: '',
          BROKER_KEY: '',
          SALESPERSON_1: '',
          SALEPERSON1_KEY: '',
          SALESPERSON_2: '',
          SALEPERSON2_KEY: '',
          MERCHANDISER_NAME: '',
          MERCHANDISER_ID: '',
          REMARK_STATUS: '',
          GST_APPL: 'N',
          GST_TYPE: 'STATE',
          DLV_DT: '',
          ORG_DLV_DT: '',
          MAIN_DETAILS: 'G',
          RACK_MIN: '0',
          REGISTERED_DEALER: '0',
          SHORT_CLOSE: '0',
          READY_SI: '0',
          PLANNING: '0'
        });
        
        setNewItemData({
          barcode: '',
          product: '',
          style: '',
          type: '',
          shade: '',
          mrp: '',
          rate: '',
          qty: '',
          discount: '',
          sets: '',
          convFact: '1',
          remark: '',
          varPer: '0',
          stdQty: '',
          setNo: '',
          percent: '0',
          rQty: '',
          divDt: ''
        });
        
        setStyleCodeInput('');
        setCurrentStyleData(null);
        setSizeDetailsData([]);
        setAvailableSizes([]);
        setFillByRatioMode(false);
        setRatioData({
          totalQty: '',
          ratios: {}
        });
        
        // Generate new order number
        await generateOrderNumber();
        
      } else {
        showSnackbar('Error submitting order: ' + (response.data.RESPONSEMESSAGE || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      showSnackbar('Error submitting order. Please try again.', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Focus on input field based on mode
  useEffect(() => {
    if (isClient) {
      if (useStyleCodeMode && styleCodeInputRef.current) {
        styleCodeInputRef.current.focus();
      } else if (!useStyleCodeMode && barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    }
  }, [isClient, useStyleCodeMode]);

  // Initialize scanner
  useEffect(() => {
    if (showScanner && isClient) {
      const timer = setTimeout(() => {
        initScanner();
      }, 500);
      
      return () => {
        clearTimeout(timer);
        if (qrCodeScannerRef.current) {
          qrCodeScannerRef.current.clear().catch(err => {
            console.error("Cleanup error", err);
          });
          qrCodeScannerRef.current = null;
        }
      };
    }
  }, [showScanner, isClient]);

  // Get window width safely
  const getWindowWidth = () => {
    return isClient ? window.innerWidth : 1024;
  };

  if (!isClient) {
    return (
      <Box sx={{ 
        p: { xs: 1, sm: 2 }, 
        maxWidth: '100%', 
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2 }, 
      maxWidth: '100%', 
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.2,
          mb: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Barcode Scan
        </Typography>

        <TbListSearch
          onClick={handleTable}
          style={{
            color: 'rgb(99, 91, 255)',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            
          }}
        />
        
        {/* Cart Icon */}
        <CartIcon
          onClick={handleCartIconClick}
          sx={{
            color: 'rgb(99, 91, 255)',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
          }}
        />
      </Box>

      {/* Advanced Fields Toggle */}
      <Card elevation={2} sx={{ mb: 0.5 }}>
        <CardContent
          sx={{
            padding: '6px 12px',
            '&:last-child': {
              paddingBottom: '6px',
            },
          }}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAdvancedFields}
                  onChange={(e) => setShowAdvancedFields(e.target.checked)}
                  size="small"
                  sx={{
                    padding: '4px',
                    color: '#1976d2',
                    '&.Mui-checked': {
                      color: '#1976d2',
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: '1.07rem',
                    fontWeight: 600,
                    color: '#1976d2',
                  }}
                >
                  {showAdvancedFields ? 'Hide Order Fields' : 'Show Order Fields'}
                </Typography>
              }
              sx={{
                margin: 0,
                gap: '6px',
              }}
            />
          </FormGroup>
        </CardContent>
      </Card>

      {showAdvancedFields && (
        <Card elevation={2} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.1rem' }}>📋 Advanced Order Details</span>
            </Typography>
            
            <Grid container spacing={1}>
              <Grid item xs={12} container spacing={1}>
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField
                    label="Series"
                    variant="filled"
                    fullWidth
                    value={formData.SERIES}
                    onChange={(e) => handleFormChange('SERIES', e.target.value)}
                    sx={textInputSx}
                    size="small"
                    InputProps={{
                      sx: { 
                        fontSize: { xs: '12px', sm: '14px' },
                        '& input': { padding: { xs: '8px 6px', sm: '10px 12px' } }
                      }
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField
                    label="Last Order No"
                    variant="filled"
                    fullWidth
                    value={formData.LAST_ORD_NO}
                    onChange={(e) => handleFormChange('LAST_ORD_NO', e.target.value)}
                    sx={textInputSx}
                    size="small"
                    InputProps={{
                      sx: { 
                        fontSize: { xs: '12px', sm: '14px' },
                        '& input': { padding: { xs: '8px 6px', sm: '10px 12px' } }
                      }
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField
                    label="Order No"
                    variant="filled"
                    fullWidth
                    value={formData.ORDER_NO}
                    onChange={(e) => handleFormChange('ORDER_NO', e.target.value)}
                    sx={textInputSx}
                    size="small"
                    required
                    InputProps={{
                      sx: { 
                        fontSize: { xs: '12px', sm: '14px' },
                        '& input': { padding: { xs: '8px 6px', sm: '10px 12px' } }
                      }
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Order Date"
                      value={formData.ORDER_DATE ? parse(formData.ORDER_DATE, 'dd/MM/yyyy', new Date()) : null}
                      onChange={(date) => handleFormChange('ORDER_DATE', date ? format(date, 'dd/MM/yyyy') : '')}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "filled",
                          sx: {
                            ...datePickerSx,
                            "& .MuiInputBase-root": {
                              height: { xs: "36px", sm: "40px" },
                            },
                            "& .MuiInputBase-input": {
                              padding: { xs: "8px 10px", sm: "10px 12px" },
                              fontSize: { xs: "12px", sm: "14px" },
                            },
                          },
                          InputProps: {
                            sx: {
                              height: { xs: "36px", sm: "40px" },
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="Party"
                    getOptionLabel={(option) => option || ''}
                    options={partyOptions}
                    label="Party *"
                    name="Party"
                    value={formData.Party}
                    onChange={(e, value) => handleFormChange('Party', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="Branch"
                    getOptionLabel={(option) => option || ''}
                    options={branchOptions}
                    label="Branch"
                    name="Branch"
                    value={formData.Branch}
                    onChange={(e, value) => handleFormChange('Branch', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="SHIPPING_PARTY"
                    getOptionLabel={(option) => option || ''}
                    options={shippingPartyOptions}
                    label="Shipping Party"
                    name="SHIPPING_PARTY"
                    value={formData.SHIPPING_PARTY}
                    onChange={(e, value) => handleFormChange('SHIPPING_PARTY', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="SHIPPING_PLACE"
                    getOptionLabel={(option) => option || ''}
                    options={shippingPlaceOptions}
                    label="Shipping Place"
                    name="SHIPPING_PLACE"
                    value={formData.SHIPPING_PLACE}
                    onChange={(e, value) => handleFormChange('SHIPPING_PLACE', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>

                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="Broker"
                    getOptionLabel={(option) => option || ''}
                    options={brokerOptions}
                    label="Broker"
                    name="Broker"
                    value={formData.Broker}
                    onChange={(e, value) => handleFormChange('Broker', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="SALESPERSON_1"
                    getOptionLabel={(option) => option || ''}
                    options={salesperson1Options}
                    label="Salesperson 1"
                    name="SALESPERSON_1"
                    value={formData.SALESPERSON_1}
                    onChange={(e, value) => handleFormChange('SALESPERSON_1', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="SALESPERSON_2"
                    getOptionLabel={(option) => option || ''}
                    options={salesperson2Options}
                    label="Salesperson 2"
                    name="SALESPERSON_2"
                    value={formData.SALESPERSON_2}
                    onChange={(e, value) => handleFormChange('SALESPERSON_2', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="MERCHANDISER_NAME"
                    getOptionLabel={(option) => option || ''}
                    options={merchandiserOptions}
                    label="Merchandiser"
                    name="MERCHANDISER_NAME"
                    value={formData.MERCHANDISER_NAME}
                    onChange={(e, value) => handleFormChange('MERCHANDISER_NAME', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="SEASON"
                    getOptionLabel={(option) => option || ''}
                    options={seasonOptions}
                    label="Season"
                    name="SEASON"
                    value={formData.SEASON}
                    onChange={(e, value) => handleFormChange('SEASON', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <AutoVibe
                    id="Order_Type"
                    getOptionLabel={(option) => option || ''}
                    options={orderTypeOptions}
                    label="Order Type"
                    name="Order_Type"
                    value={formData.Order_Type}
                    onChange={(e, value) => handleFormChange('Order_Type', value)}
                    sx={{
                      ...DropInputSx,
                      '& .MuiInputBase-root': {
                        height: { xs: '36px', sm: '40px' },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 10px', sm: '10px 12px' } + ' !important',
                        fontSize: { xs: '12px', sm: '14px' } + ' !important',
                      },
                    }}
                    size="small"
                    onAddClick={null}
                    onRefreshClick={null}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Barcode Scanner Section with Style Code Toggle */}
      <Card elevation={2} sx={{ mb: 1 }}>
        <CardContent>
          <Box sx={{ 
            mb: 1, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: '1.1rem'
            }}>
              <QrCodeIcon /> Product Scanning
            </Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useStyleCodeMode}
                    onChange={(e) => setUseStyleCodeMode(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: '500' }}>
                    Use Style Code
                  </Typography>
                }
              />
            </FormGroup>
          </Box>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Box sx={{ flex: 1, width: '100%' }}>
              {useStyleCodeMode ? (
                <TextField
                  label="Type Style Code"
                  variant="filled"
                  fullWidth
                  value={styleCodeInput}
                  onChange={handleStyleCodeInputChange}
                  onKeyPress={handleStyleCodeKeyPress}
                  placeholder="Type style code and press Enter"
                  sx={textInputSx}
                  inputRef={styleCodeInputRef}
                  InputProps={{
                    endAdornment: (
                      <IconButton 
                        onClick={() => fetchStyleDataByCode(styleCodeInput.trim())}
                        disabled={!styleCodeInput || isLoadingStyleCode}
                        sx={{ mr: -1 }}
                      >
                        {isLoadingStyleCode ? <CircularProgress size={20} /> : <SearchIcon />}
                      </IconButton>
                    )
                  }}
                />
              ) : (
                <TextField
                  label="Enter Barcode Number"
                  variant="filled"
                  fullWidth
                  value={newItemData.barcode}
                  onChange={(e) => handleNewItemChange('barcode', e.target.value)}
                  onKeyPress={handleBarcodeKeyPress}
                  placeholder="Type barcode and press Enter"
                  sx={textInputSx}
                  inputRef={barcodeInputRef}
                  InputProps={{
                    endAdornment: (
                      <IconButton 
                        onClick={handleManualBarcodeSubmit}
                        disabled={!newItemData.barcode || isLoadingBarcode}
                        sx={{ mr: -1 }}
                      >
                        {isLoadingBarcode ? <CircularProgress size={20} /> : <SearchIcon />}
                      </IconButton>
                    )
                  }}
                />
              )}
            </Box>
            
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              display: { xs: 'none', sm: 'block' }
            }}>
              OR
            </Typography>
            
            {!useStyleCodeMode && (
              <Button
                variant="contained"
                startIcon={<CameraIcon />}
                onClick={startScanner}
                sx={{ 
                  backgroundColor: '#1976d2',
                  color: 'white',
                  minWidth: { xs: '100%', sm: 150 },
                  height: 40,
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                Scan Barcode
              </Button>
            )}
          </Stack>

          {scannerError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {scannerError}
            </Alert>
          )}

          {(isLoadingBarcode || isLoadingStyleCode) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">
                {useStyleCodeMode ? 'Fetching product details by style code...' : 'Fetching product details...'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Product Details (Auto-filled after scan/style code) */}
      {(newItemData.product || isLoadingBarcode || isLoadingStyleCode) && (
        <Card elevation={2} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>
              Product Details {(isLoadingBarcode || isLoadingStyleCode) && '(Loading...)'}
            </Typography>
            
            <Grid container spacing={1}>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  label="Barcode"
                  variant="filled"
                  fullWidth
                  value={newItemData.barcode}
                  disabled
                  sx={textInputSx}
                  size="small"
                />
              </Grid>
              
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  label="Product"
                  variant="filled"
                  fullWidth
                  value={newItemData.product}
                  disabled
                  sx={textInputSx}
                  size="small"
                />
              </Grid>
              
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  label="Style"
                  variant="filled"
                  fullWidth
                  value={newItemData.style}
                  disabled
                  sx={textInputSx}
                  size="small"
                />
              </Grid>
              
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  label="Type"
                  variant="filled"
                  fullWidth
                  value={newItemData.type}
                  disabled
                  sx={textInputSx}
                  size="small"
                />
              </Grid>
              
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  label="Shade"
                  variant="filled"
                  fullWidth
                  value={newItemData.shade}
                  disabled
                  sx={textInputSx}
                  size="small"
                />
              </Grid>
              
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  label="MRP"
                  variant="filled"
                  fullWidth
                  value={newItemData.mrp}
                  disabled
                  sx={textInputSx}
                  size="small"
                />
              </Grid>
              
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  label="Rate"
                  variant="filled"
                  fullWidth
                  value={newItemData.rate}
                  disabled
                  sx={textInputSx}
                  size="small"
                />
              </Grid>
  
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  label="Remark"
                  variant="filled"
                  fullWidth
                  value={newItemData.remark}
                  onChange={(e) => handleNewItemChange('remark', e.target.value)}
                  sx={textInputSx}
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Fill by Ratio Section */}
      {availableSizes.length > 0 && (
        <Card elevation={0.5} sx={{ mb: 0 }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 0.1 
            }}>
              <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                Fill By Ratio
              </Typography>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fillByRatioMode}
                      onChange={(e) => setFillByRatioMode(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Enable Ratio Fill"
                />
              </FormGroup>
            </Box>
            
            {fillByRatioMode && (
              <Box>
                {/* Total Quantity Input */}
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Total Quantity"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={ratioData.totalQty}
                    onChange={(e) => handleTotalQtyChange(e.target.value)}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: 40,
                      },
                    }}
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Box>
                
               {/* Horizontal Ratio Table */}
<Typography variant="subtitle1" sx={{ mb: 1, fontWeight: '600' }}>
  Enter Ratios for Each Size:
</Typography>

<Box sx={{ 
  overflowX: 'auto',
  backgroundColor: '#f8f9fa',
  borderRadius: 1,
  p: 1,
  mb: 0.7
}}>
  <table style={{ 
    width: '100%', 
    borderCollapse: 'collapse',
    minWidth: `${availableSizes.length * 50}px`
  }}>
    <thead>
      <tr style={{ backgroundColor: '#e9ecef' }}>
        {/* Size Headers */}
        {availableSizes.map((size) => (
          <th key={`th-${size.STYSIZE_ID}`} style={{ 
            padding: '10px',
            border: '1px solid #dee2e6', 
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '600',
            minWidth: '40px'
          }}>
            {size.STYSIZE_NAME}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {/* Ratio Inputs */}
        {availableSizes.map((size, index) => (
          <td key={`td-${size.STYSIZE_ID}`} style={{ 
            padding: '2px', 
            border: '1px solid #dee2e6',
            textAlign: 'center',
            backgroundColor: '#fff'
          }}>
            <TextField
              type="number"
              value={ratioData.ratios[size.STYSIZE_NAME] || ''}
              onChange={(e) => handleRatioChange(size.STYSIZE_NAME, e.target.value)}
              size="small"
              sx={{
                width: '50px',
                '& .MuiInputBase-root': {
                  height: '26px',
                  fontSize: '14px'
                },
                '& input': {
                  padding: '8px',
                  textAlign: 'center'
                }
              }}
              inputProps={{ 
                min: 0, 
                step: 0.1,
                style: { textAlign: 'center' }
              }}
            />
          </td>
        ))}
      </tr>
    </tbody>
  </table>
</Box>
                
                {/* Fill Qty Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={fillQuantitiesByRatio}
                    disabled={!ratioData.totalQty || parseFloat(ratioData.totalQty) <= 0}
                    sx={{ 
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      '&:hover': { backgroundColor: '#45a049' },
                      minWidth: '80px'
                    }}
                  >
                    Fill Qty
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Size Details Table */}
      {sizeDetailsData.length > 0 && (
        <Card elevation={1} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>
              Size Details (Qty) :<strong style={{ color: '#1976d2' }}>{calculateTotalQty()}</strong>
            </Typography>
            
            <Box sx={{ 
              overflowX: 'auto',
              backgroundColor: '#f8f9fa',
              borderRadius: 1,
              p: 1
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                minWidth: '500px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#e9ecef' }}>
                    <th style={{ 
                      padding: '2px 8px',
                      border: '1px solid #dee2e6', 
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>Size</th>
                    <th style={{ 
                      padding: '2px 8px', 
                      border: '1px solid #dee2e6', 
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>Quantity</th>
                    <th style={{ 
                      padding: '2px 8px',
                      border: '1px solid #dee2e6', 
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>MRP</th>
                    <th style={{ 
                      padding: '2px 8px',
                      border: '1px solid #dee2e6', 
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>Rate</th>
                    <th style={{ 
                      padding: '2px 8px',
                      border: '1px solid #dee2e6', 
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeDetailsData.map((size, index) => (
                    <tr key={index} style={{ 
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <td style={{
                        padding: '4px 8px',
                        border: '1px solid #dee2e6',
                        fontSize: '13px',
                        lineHeight: '1.2'
                      }}>{size.STYSIZE_NAME}</td>
                      <td style={{ 
                        padding: '5px', 
                        border: '1px solid #dee2e6',
                        textAlign: 'center'
                      }}>
                        <TextField
                          type="number"
                          value={size.QTY}
                          onChange={(e) => handleSizeQtyChange(index, e.target.value)}
                          size="small"
                          sx={{
                            width: '60px',
                            '& .MuiInputBase-root': {
                              height: '20px',
                              fontSize: '13px'
                            },
                            '& input': {
                              padding: '1px',
                              textAlign: 'center'
                            }
                          }}
                          inputProps={{ min: 0 }}
                        />
                      </td>
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #dee2e6',
                        textAlign: 'right',
                        fontSize: '14px'
                      }}>{size.MRP || 0}</td>
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #dee2e6',
                        textAlign: 'right',
                        fontSize: '14px'
                      }}>{size.WSP  || 0}</td>
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #dee2e6',
                        textAlign: 'right',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        ₹{(size.QTY || 0) * (size.WSP  || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            
            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: '500' }}>
                  Total Quantity: <strong style={{ color: '#1976d2' }}>{calculateTotalQty()}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Amount: ₹{calculateAmount().amount.toFixed(2)}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleConfirmItem}
                disabled={calculateTotalQty() === 0}
                sx={{ 
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  '&:hover': { backgroundColor: '#45a049' },
                  minWidth: '140px'
                }}
              >
                Add to Order
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Order Items Modal */}
      <Modal
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        aria-labelledby="order-items-modal"
        aria-describedby="order-items-list"
      >
        <Fade in={showOrderModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <Box sx={{
              p: 0.7,
              backgroundColor: '#1976d2',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CartIcon /> Order Items ({tableData.length})
              </Typography>
              <IconButton onClick={() => setShowOrderModal(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Modal Content - Scrollable */}
            <Box sx={{ 
              p: 2,
              overflow: 'auto',
              flexGrow: 1
            }}>
              {tableData.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  color: 'text.secondary'
                }}>
                  <CartIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6">No items in order</Typography>
                  <Typography variant="body2">Scan and add products to your order</Typography>
                </Box>
              ) : (
                <>
                  {/* Order Items Table */}
                  <Box sx={{ 
                    overflowX: 'auto',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 1,
                    mb: 1
                  }}>
                    <table style={{ 
                      width: '100%', 
                      borderCollapse: 'collapse',
                      minWidth: '800px'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#e9ecef' }}>
                          <th style={{ 
                            padding: '8px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Barcode</th>
                          <th style={{ 
                            padding: '8px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Product</th>
                          <th style={{ 
                            padding: '8px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Style</th>
                          <th style={{ 
                            padding: '8px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Type</th>
                          <th style={{ 
                            padding: '8px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Shade</th>
                          <th style={{ 
                            padding: '8px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Qty</th>
                          <th style={{ 
                            padding: '8px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'right',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Rate</th>
                          <th style={{ 
                            padding: '8px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'right',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Amount</th>
                          <th style={{ 
                            padding: '8px', 
                            border: '1px solid #dee2e6', 
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((item, index) => (
                          <tr key={item.id} style={{ 
                            backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                            borderBottom: '1px solid #dee2e6'
                          }}>
                            <td style={{ 
                              padding: '8px',
                              border: '1px solid #dee2e6',
                              fontSize: '14px',
                              fontFamily: 'monospace'
                            }}>{item.barcode}</td>
                            <td style={{ 
                              padding: '8px', 
                              border: '1px solid #dee2e6',
                              fontSize: '14px'
                            }}>{item.product}</td>
                            <td style={{ 
                              padding: '8px',
                              border: '1px solid #dee2e6',
                              fontSize: '14px'
                            }}>{item.style}</td>
                            <td style={{ 
                              padding: '8px',  
                              border: '1px solid #dee2e6',
                              fontSize: '14px'
                            }}>{item.type}</td>
                            <td style={{ 
                              padding: '8px',
                              border: '1px solid #dee2e6',
                              fontSize: '14px'
                            }}>{item.shade}</td>
                            <td style={{ 
                              padding: '8px', 
                              border: '1px solid #dee2e6',
                              textAlign: 'center',
                              fontSize: '14px'
                            }}>{item.qty}</td>
                            <td style={{ 
                              padding: '8px',
                              border: '1px solid #dee2e6',
                              textAlign: 'right',
                              fontSize: '14px'
                            }}>₹{item.rate}</td>
                            <td style={{ 
                              padding: '8px',
                              border: '1px solid #dee2e6',
                              textAlign: 'right',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}>₹{item.amount.toFixed(2)}</td>
                            <td style={{ 
                              padding: '8px', 
                              border: '1px solid #dee2e6',
                              textAlign: 'center'
                            }}>
                              <IconButton 
                                onClick={() => {
                                  handleDeleteItem(item.id);
                                  if (tableData.length === 1) {
                                    setShowOrderModal(false);
                                  }
                                }}
                                size="small"
                                sx={{ color: '#f44336' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                  
                  {/* Order Summary */}
                  <Box sx={{ 
                    p: 1, 
                    backgroundColor: '#e8f5e9', 
                    borderRadius: 1 
                  }}>
                    <Typography variant="h6" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      📊 Order Summary
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Items:</Typography>
                        <Typography variant="h6" sx={{ color: '#1976d2' }}>{tableData.length}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Quantity:</Typography>
                        <Typography variant="h6" sx={{ color: '#1976d2' }}>
                          {tableData.reduce((sum, item) => sum + item.qty, 0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Amount:</Typography>
                        <Typography variant="h6" sx={{ color: '#1976d2' }}>
                          ₹{tableData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleSubmitOrder}
                          disabled={isLoadingData}
                          sx={{ 
                            backgroundColor: '#2196F3',
                            '&:hover': { backgroundColor: '#1976d2' }
                          }}
                        >
                          {isLoadingData ? <CircularProgress size={24} /> : 'Submit Order'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </Box>

            {/* Modal Footer */}
            {/* <Box sx={{ 
              p: 2, 
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {tableData.length} item{tableData.length !== 1 ? 's' : ''} in order
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => setShowOrderModal(false)}
              >
                Close
              </Button>
            </Box> */}
          </Box>
        </Fade>
      </Modal>

      {/* Barcode Scanner Dialog */}
      {isClient && !useStyleCodeMode && (
        <Dialog
          open={showScanner}
          onClose={stopScanner}
          maxWidth="md"
          fullWidth
          fullScreen={getWindowWidth() < 600}
          PaperProps={{
            sx: {
              maxWidth: { xs: '100%', sm: '80%', md: '600px' },
              height: { xs: '100vh', sm: '600px' },
              margin: { xs: 0, sm: 'auto' },
              borderRadius: { xs: 0, sm: 2 }
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: '#1976d2',
            color: 'white'
          }}>
            <Typography variant="h6">📷 Scan Barcode</Typography>
            <IconButton onClick={stopScanner} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="body2" sx={{ 
              mb: 1, 
              color: 'text.secondary',
              textAlign: 'center'
            }}>
              Point your camera at the barcode
            </Typography>
            
            <Box
              id="qr-reader"
              sx={{
                width: '100%',
                height: { xs: '70vh', sm: '400px' },
                border: '2px dashed #ccc',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#000'
              }}
            />
            
            <Typography variant="caption" sx={{ 
              mt: 2, 
              display: 'block', 
              color: 'text.secondary',
              textAlign: 'center'
            }}>
              The scanner will automatically detect barcodes
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 2,
            backgroundColor: '#f5f5f5'
          }}>
            <Button 
              onClick={stopScanner} 
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Typography variant="body2" sx={{ 
              flexGrow: 1, 
              textAlign: 'center', 
              color: 'text.secondary',
              fontSize: '12px'
            }}>
              Camera permission required • Works best in good light
            </Typography>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ScanBarcode;