'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Paper,
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
} from '@mui/material';
import { 
  CameraAlt as CameraIcon, 
  Close as CloseIcon, 
  QrCodeScanner as QrCodeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';

const ScanBarcode = () => {
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
    Status: 'O'
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
    remark: ''
  });

  const [sizeDetailsData, setSizeDetailsData] = useState([]);
  const [tableData, setTableData] = useState([]);

  // State for dropdowns
  const [partyOptions, setPartyOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [shippingPartyOptions, setShippingPartyOptions] = useState([]);
  const [shippingPlaceOptions, setShippingPlaceOptions] = useState([]);

  // State for mappings
  const [partyMapping, setPartyMapping] = useState({});
  const [branchMapping, setBranchMapping] = useState({});
  const [shippingBranchMapping, setShippingBranchMapping] = useState({});

  // Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const scannerRef = useRef(null);
  const qrCodeScannerRef = useRef(null);
  const barcodeInputRef = useRef(null);

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

  // Fetch party data
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
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
      showSnackbar('Error fetching parties', 'error');
    }
  };

  // Fetch party branches
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
          
          // Auto-select first branch for shipping
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
          
          // Auto-select first branch
          if (branches.length > 0 && !formData.Branch) {
            const firstBranch = branches[0];
            const firstBranchId = mapping[firstBranch];
            
            setFormData(prev => ({
              ...prev,
              Branch: firstBranch,
              PARTYDTL_ID: firstBranchId,
              SHIPPING_PLACE: firstBranch,
              SHP_PARTYDTL_ID: firstBranchId
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching party details:", error);
      showSnackbar('Error fetching branch details', 'error');
    }
  };

  // Fetch style data by barcode - UPDATED
  const fetchStyleDataByBarcode = async (barcode) => {
    if (!barcode || barcode.trim() === '') {
      setScannerError('Please enter a barcode');
      return;
    }
    
    try {
      setIsLoadingBarcode(true);
      setScannerError('');
      
      console.log('Fetching data for barcode:', barcode);
      
      // Try multiple API endpoints or parameters
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
        const styleData = response.data.DATA[0];
        console.log('Style Data:', styleData);
        
        const barcodeValue = styleData.ALT_BARCODE || styleData.STYSTKDTL_KEY || barcode;
        const shadeValue = styleData.FGSHADE_NAME || '';
        
        // Update new item data
        setNewItemData({
          barcode: barcodeValue,
          product: styleData.FGPRD_NAME || '',
          style: styleData.FGSTYLE_CODE || styleData.FGSTYLE_NAME || '',
          type: styleData.FGTYPE_NAME || '',
          shade: shadeValue,
          mrp: styleData.MRP ? styleData.MRP.toString() : '0',
          rate: styleData.SSP ? styleData.SSP.toString() : '0',
          qty: '',
          discount: '0',
          sets: '1',
          convFact: '1',
          remark: ''
        });
        
        showSnackbar('Product found successfully!');
        
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

  // Alternative API call if main one fails
  const fetchProductByAlternativeMethod = async (barcode) => {
    try {
      // Try with different parameters
      const payloads = [
        {
          "FGSTYLE_ID": "",
          "FGPRD_KEY": "",
          "FGSTYLE_CODE": barcode,
          "ALT_BARCODE": "",
          "FLAG": ""
        },
        {
          "BARCODE": barcode,
          "FLAG": "BARCODE"
        }
      ];

      for (const payload of payloads) {
        try {
          const response = await axiosInstance.post('/FGSTYLE/GetFgstyleDrp', payload);
          if (response.data.DATA && response.data.DATA.length > 0) {
            return response.data.DATA[0];
          }
        } catch (err) {
          continue;
        }
      }
      return null;
    } catch (error) {
      console.error('Alternative fetch error:', error);
      return null;
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
        "FLAG": ""
      };

      console.log('Fetching size details with payload:', payload);

      const response = await axiosInstance.post('/STYSIZE/AddSizeDetail', payload);
      console.log('Size Details Response:', response.data);

      if (response.data.DATA && response.data.DATA.length > 0) {
        const transformedSizeDetails = response.data.DATA.map((size, index) => ({
          STYSIZE_ID: size.STYSIZE_ID || index + 1,
          STYSIZE_NAME: size.STYSIZE_NAME || `Size ${index + 1}`,
          FGSTYLE_ID: size.FGSTYLE_ID || fgstyleId,
          QTY: 0,
          ITM_AMT: 0,
          ORDER_QTY: 0,
          MRP: parseFloat(styleData.MRP) || 0,
          RATE: parseFloat(styleData.SSP) || 0,
          FGITEM_KEY: styleData.STYSTKDTL_KEY || ""
        }));

        setSizeDetailsData(transformedSizeDetails);
        showSnackbar('Size details loaded! Enter quantities.');
      } else {
        // Create default size details if API returns empty
        const defaultSizes = [
          { STYSIZE_NAME: 'Default', STYSIZE_ID: 1, QTY: 0, MRP: parseFloat(styleData.MRP) || 0, RATE: parseFloat(styleData.SSP) || 0 }
        ];
        setSizeDetailsData(defaultSizes);
        showSnackbar('Using default size. Enter quantity.', 'info');
      }
    } catch (error) {
      console.error('Error fetching size details:', error);
      // Create default size on error
      const defaultSizes = [
        { STYSIZE_NAME: 'Default', STYSIZE_ID: 1, QTY: 0, MRP: parseFloat(newItemData.mrp) || 0, RATE: parseFloat(newItemData.rate) || 0 }
      ];
      setSizeDetailsData(defaultSizes);
      showSnackbar('Could not load size details. Using default.', 'warning');
    }
  };

  // Handle party selection
  const handlePartyChange = (event, value) => {
    setFormData(prev => ({
      ...prev,
      Party: value,
      PARTY_KEY: partyMapping[value] || '',
      SHIPPING_PARTY: value,
      SHP_PARTY_KEY: partyMapping[value] || ''
    }));

    if (value && partyMapping[value]) {
      fetchPartyDetails(partyMapping[value]);
    }
  };

  // Handle shipping party selection
  const handleShippingPartyChange = (event, value) => {
    setFormData(prev => ({
      ...prev,
      SHIPPING_PARTY: value,
      SHP_PARTY_KEY: partyMapping[value] || '',
      SHIPPING_PLACE: ''
    }));

    if (value && partyMapping[value]) {
      fetchPartyDetails(partyMapping[value], true);
    }
  };

  // Handle branch selection
  const handleBranchChange = (event, value) => {
    const branchId = branchMapping[value];
    setFormData(prev => ({
      ...prev,
      Branch: value,
      PARTYDTL_ID: branchId,
      SHIPPING_PLACE: value,
      SHP_PARTYDTL_ID: branchId
    }));
  };

  // Handle shipping place selection
  const handleShippingPlaceChange = (event, value) => {
    const branchId = shippingBranchMapping[value];
    setFormData(prev => ({
      ...prev,
      SHIPPING_PLACE: value,
      SHP_PARTYDTL_ID: branchId || ''
    }));
  };

  // Handle barcode input change
  const handleBarcodeInputChange = (e) => {
    const value = e.target.value;
    setNewItemData(prev => ({ ...prev, barcode: value }));
    setScannerError('');
  };

  // Handle barcode search (manual entry)
  const handleManualBarcodeSubmit = () => {
    if (!newItemData.barcode || newItemData.barcode.trim() === '') {
      setScannerError('Please enter a barcode');
      return;
    }
    
    fetchStyleDataByBarcode(newItemData.barcode);
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

  // Handle confirm button
  const handleConfirmItem = () => {
    if (!newItemData.product || !newItemData.style) {
      showSnackbar("Please scan a valid barcode first", 'error');
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
      sizeDetails: [...sizeDetailsData],
      convFact: newItemData.convFact,
      remark: newItemData.remark
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
      remark: ''
    });
    setSizeDetailsData([]);
    setScannerError('');

    showSnackbar('Item added to order!', 'success');
  };

  // Handle delete item from table
  const handleDeleteItem = (id) => {
    setTableData(prev => prev.filter(item => item.id !== id));
    showSnackbar('Item removed from order', 'info');
  };

  // Initialize scanner
  const initScanner = () => {
    if (!qrCodeScannerRef.current && document.getElementById('qr-reader')) {
      try {
        qrCodeScannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
          },
          false
        );

        const onScanSuccess = (decodedText, decodedResult) => {
          console.log(`Scan result: ${decodedText}`, decodedResult);
          
          // Stop scanner
          if (qrCodeScannerRef.current) {
            qrCodeScannerRef.current.clear().then(() => {
              qrCodeScannerRef.current = null;
            }).catch(err => {
              console.error("Failed to clear scanner", err);
            });
          }
          
          setIsScanning(false);
          setShowScanner(false);
          
          // Update barcode field and fetch data
          setNewItemData(prev => ({ ...prev, barcode: decodedText }));
          
          // Fetch product by scanned barcode
          setTimeout(() => {
            fetchStyleDataByBarcode(decodedText);
          }, 500);
        };

        const onScanFailure = (error) => {
          // Handle scan failure gracefully
          console.warn(`Scan error: ${error}`);
        };

        qrCodeScannerRef.current.render(onScanSuccess, onScanFailure);
        setIsScanning(true);
      } catch (error) {
        console.error("Scanner initialization error:", error);
        setScannerError('Failed to initialize scanner. Please refresh and try again.');
        showSnackbar('Scanner initialization failed', 'error');
      }
    }
  };

  // Start scanner
  const startScanner = () => {
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

  // Submit complete order
  const handleSubmitOrder = () => {
    if (tableData.length === 0) {
      showSnackbar('Please add at least one item to the order', 'error');
      return;
    }

    if (!formData.Party || !formData.PARTY_KEY) {
      showSnackbar('Please select a party first', 'error');
      return;
    }

    // Prepare order data for submission
    const orderData = {
      party: formData.Party,
      partyKey: formData.PARTY_KEY,
      branch: formData.Branch,
      shippingParty: formData.SHIPPING_PARTY,
      shippingPlace: formData.SHIPPING_PLACE,
      items: tableData,
      totalQty: tableData.reduce((sum, item) => sum + item.qty, 0),
      totalAmount: tableData.reduce((sum, item) => sum + item.amount, 0),
      totalDiscount: tableData.reduce((sum, item) => sum + item.discAmt, 0),
      netAmount: tableData.reduce((sum, item) => sum + item.netAmt, 0)
    };

    console.log('Order Data:', orderData);
    
    // Here you would call your order submission API
    // For now, just show a success message
    showSnackbar(`Order submitted successfully! ${tableData.length} items added.`, 'success');
    
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
      Status: 'O'
    });
  };

  // Initialize on component mount
  useEffect(() => {
    fetchPartiesByName();
    
    // Cleanup scanner on unmount
    return () => {
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner", error);
        });
      }
    };
  }, []);

  // Initialize scanner when dialog opens
  useEffect(() => {
    if (showScanner) {
      const timer = setTimeout(() => {
        initScanner();
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
  }, [showScanner]);

  // Focus barcode input on load
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

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
      <Typography variant="h5" sx={{ 
        mb: 3, 
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: { xs: '1.3rem', sm: '1.5rem' }
      }}>
         Order Booking By Barcode Scan
      </Typography>

      {/* Main Form */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '1.1rem' }}>📋 Order Details</span>
          </Typography>
          
          <Grid container spacing={2}>
            {/* Party Selection */}
            <Grid item xs={12} md={6}>
              <AutoVibe
                id="Party"
                getOptionLabel={(option) => option || ''}
                options={partyOptions}
                label="Party *"
                name="Party"
                value={formData.Party}
                onChange={handlePartyChange}
                sx={DropInputSx}
                size="small"
              />
            </Grid>
            
            {/* Shipping Party */}
            <Grid item xs={12} md={6}>
              <AutoVibe
                id="SHIPPING_PARTY"
                getOptionLabel={(option) => option || ''}
                options={shippingPartyOptions}
                label="Shipping Party"
                name="SHIPPING_PARTY"
                value={formData.SHIPPING_PARTY}
                onChange={handleShippingPartyChange}
                sx={DropInputSx}
                size="small"
              />
            </Grid>
            
            {/* Branch */}
            <Grid item xs={12} md={6}>
              <AutoVibe
                id="Branch"
                getOptionLabel={(option) => option || ''}
                options={branchOptions}
                label="Branch"
                name="Branch"
                value={formData.Branch}
                onChange={handleBranchChange}
                sx={DropInputSx}
                size="small"
              />
            </Grid>
            
            {/* Shipping Place */}
            <Grid item xs={12} md={6}>
              <AutoVibe
                id="SHIPPING_PLACE"
                getOptionLabel={(option) => option || ''}
                options={shippingPlaceOptions}
                label="Shipping Place"
                name="SHIPPING_PLACE"
                value={formData.SHIPPING_PLACE}
                onChange={handleShippingPlaceChange}
                sx={DropInputSx}
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Barcode Scanner Section */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: '1.1rem'
          }}>
            <QrCodeIcon /> Product Scanning
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            {/* Barcode Input with Search Button */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <TextField
                label="Enter Barcode Number"
                variant="filled"
                fullWidth
                value={newItemData.barcode}
                onChange={handleBarcodeInputChange}
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
            </Box>
            
            {/* OR Divider */}
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              display: { xs: 'none', sm: 'block' }
            }}>
              OR
            </Typography>
            
            {/* Scanner Button */}
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
          </Stack>

          {scannerError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {scannerError}
            </Alert>
          )}

          {isLoadingBarcode && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Fetching product details...</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Product Details (Auto-filled after scan) */}
{(newItemData.product || isLoadingBarcode) && (
  <Card elevation={2} sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
        🏷️ Product Details {isLoadingBarcode && '(Loading...)'}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Barcode and Product */}
        <Grid item xs={12} sm={6}>
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
        
        <Grid item xs={12} sm={6}>
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
        
        {/* Style and Type */}
        <Grid item xs={12} sm={6}>
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
        
        <Grid item xs={12} sm={6}>
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
        
        {/* Shade and MRP */}
        <Grid item xs={12} sm={6}>
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
        
        <Grid item xs={12} sm={6}>
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
        
        {/* Rate and Discount */}
        <Grid item xs={12} sm={6}>
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
        
        <Grid item xs={12} sm={6}>
          <TextField
            label="Discount"
            variant="filled"
            fullWidth
            value={newItemData.discount}
            onChange={(e) => setNewItemData(prev => ({ 
              ...prev, 
              discount: e.target.value 
            }))}
            sx={textInputSx}
            size="small"
            inputProps={{ 
              type: 'number',
              step: '0.01',
              min: '0'
            }}
          />
        </Grid>
        
        {/* Sets and Remark */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Sets"
            variant="filled"
            fullWidth
            value={newItemData.sets}
            onChange={(e) => setNewItemData(prev => ({ 
              ...prev, 
              sets: e.target.value 
            }))}
            sx={textInputSx}
            size="small"
            inputProps={{ 
              type: 'number',
              step: '1',
              min: '1'
            }}
          />
        </Grid>

        {/* Remark */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Remark"
            variant="filled"
            fullWidth
            value={newItemData.remark}
            onChange={(e) => setNewItemData(prev => ({ 
              ...prev, 
              remark: e.target.value 
            }))}
            sx={textInputSx}
            size="small"
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)}

      {/* Size Details Table */}
      {sizeDetailsData.length > 0 && (
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
              📏 Size Details
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
                      padding: '10px', 
                      border: '1px solid #dee2e6', 
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>Size</th>
                    <th style={{ 
                      padding: '10px', 
                      border: '1px solid #dee2e6', 
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>Quantity</th>
                    <th style={{ 
                      padding: '10px', 
                      border: '1px solid #dee2e6', 
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>MRP</th>
                    <th style={{ 
                      padding: '10px', 
                      border: '1px solid #dee2e6', 
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>Rate</th>
                    <th style={{ 
                      padding: '10px', 
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
                        padding: '10px', 
                        border: '1px solid #dee2e6',
                        fontSize: '14px'
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
                          sx={{ width: '80px' }}
                          inputProps={{ 
                            style: { 
                              padding: '8px',
                              textAlign: 'center',
                              fontSize: '14px'
                            },
                            min: 0 
                          }}
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
                      }}>{size.RATE || 0}</td>
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #dee2e6',
                        textAlign: 'right',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        ₹{(size.QTY || 0) * (size.RATE || 0)}
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

      {/* Order Items Table */}
{tableData.length > 0 && (
  <Card elevation={2} sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem' }}>
        🛒 Order Items ({tableData.length})
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
          minWidth: '700px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ 
                padding: '10px', 
                border: '1px solid #dee2e6', 
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '600'
              }}>Barcode</th>
              <th style={{ 
                padding: '10px', 
                border: '1px solid #dee2e6', 
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '600'
              }}>Product</th>
              <th style={{ 
                padding: '10px', 
                border: '1px solid #dee2e6', 
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '600'
              }}>Style</th>
              <th style={{ 
                padding: '10px', 
                border: '1px solid #dee2e6', 
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '600'
              }}>Type</th>
              <th style={{ 
                padding: '10px', 
                border: '1px solid #dee2e6', 
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '600'
              }}>Shade</th>
              <th style={{ 
                padding: '10px', 
                border: '1px solid #dee2e6', 
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '600'
              }}>Qty</th>
              <th style={{ 
                padding: '10px', 
                border: '1px solid #dee2e6', 
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: '600'
              }}>Rate</th>
              <th style={{ 
                padding: '10px', 
                border: '1px solid #dee2e6', 
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: '600'
              }}>Amount</th>
              <th style={{ 
                padding: '10px', 
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
                backgroundColor: index % 2 === 0 ? '#ffffffff' : '#ffffffff',
                borderBottom: '1px solid #dee2e6'
              }}>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}>{item.barcode}</td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  fontSize: '14px'
                }}>{item.product}</td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  fontSize: '14px'
                }}>{item.style}</td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  fontSize: '14px'
                }}>
                  <div>{item.type}</div>
                  
                </td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  fontSize: '14px'
                }}>
                 
                  <div>{item.shade}</div>
                </td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  textAlign: 'center',
                  fontSize: '14px'
                }}>{item.qty}</td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  textAlign: 'right',
                  fontSize: '14px'
                }}>₹{item.rate}</td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  textAlign: 'right',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>₹{item.amount.toFixed(2)}</td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #dee2e6',
                  textAlign: 'center'
                }}>
                  <IconButton 
                    onClick={() => handleDeleteItem(item.id)}
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
      {tableData.length > 0 && (
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: '#e8f5e9', 
          borderRadius: 1 
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>📊 Order Summary</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">Total Items:</Typography>
              <Typography variant="h6">{tableData.length}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">Total Quantity:</Typography>
              <Typography variant="h6">{tableData.reduce((sum, item) => sum + item.qty, 0)}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">Total Amount:</Typography>
              <Typography variant="h6">₹{tableData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmitOrder}
                sx={{ 
                  backgroundColor: '#2196F3',
                  '&:hover': { backgroundColor: '#1976d2' }
                }}
              >
                Submit Order
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </CardContent>
  </Card>
)}

      {/* Barcode Scanner Dialog */}
      <Dialog
        open={showScanner}
        onClose={stopScanner}
        maxWidth="md"
        fullWidth
        fullScreen={window.innerWidth < 600}
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
            mb: 2, 
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
    </Box>
  );
};

export default ScanBarcode;