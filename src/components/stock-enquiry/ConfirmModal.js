'use client';
import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

export default function ConfirmModal({
  PARTY_KEY,
  PARTYDTL_ID,
  open,
  onClose,
  modalData = [],
  columns = [],
   FCYR_KEY,
   COBR_ID,
   CO_ID,
}) {
  const router = useRouter();
  const [localData, setLocalData] = React.useState([]);
  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: '' });
  const [filters, setFilters] = React.useState({});

  React.useEffect(() => {
    setLocalData([...modalData]);
  }, [modalData]);

  const handleSortChange = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let result = [...localData];
    
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
        if (['MRP', 'ORD_QTY', 'PACK_QTY', 'WEIGHT'].includes(sortConfig.key)) {
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
  }, [localData, filters, sortConfig]);

 const handleSubmit = async () => {
  try {
    // Use values from props or fallback to localStorage
    const financialYear = FCYR_KEY || localStorage.getItem('financialYear') || '25';
    const companyBranch = COBR_ID || localStorage.getItem('companyBranch') || '02';
    const companyId = CO_ID || localStorage.getItem('companyId') || '01';

    const payload = sortedAndFilteredData
      .filter(row => row.ORD_QTY > 0)
      .map(row => ({
        ...row,
        PARTY_KEY: PARTY_KEY,
        PARTYDTL_ID: PARTYDTL_ID,
        CO_ID: companyId,
        COBR_ID: companyBranch,
        FCYR_KEY: financialYear,
        STATUS: 1,
        CREATED_BY: 1
      }));

    if (payload.length === 0) {
      toast.error("Please enter quantities greater than 0 before submitting");
      return;
    }

    const response = await axiosInstance.post(
      'StockEnqiry/InsertStockEnquiryOrder',
      payload,
    );

    const { data: { STATUS, MESSAGE } } = response;
    if (STATUS === 0) {
      toast.success(MESSAGE);
      onClose();
      setTimeout(() => {
        router.push('/dashboard/stock-enquiry-table');
      }, 500);
    } else {
      toast.info(MESSAGE);
      onClose();
    }
  } catch (error) {
    console.error('Failed to submit data:', error);
    toast.error("Failed to submit order");
  }
};

  const mrpIndex = columns.findIndex(col => col.field === "MRP");
  const columnWidth = 40;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '95vw',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          overflow: 'auto'
      }}> 
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Confirm Order
        </Typography>
        <Box sx={{ mt: 0, mb: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="contained" color="#39ace2" sx={{mr: 1, background: "#39ace2", color: "white"}}>
            Continue Booking
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{background: "#39ace2", color: "white"}}>
            Submit
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxHeight: '70vh', mb: 2 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.slice(0, mrpIndex + 1).map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{ 
                      fontWeight: 'bold',  
                      width: `${columnWidth}px`,
                      minWidth: `${columnWidth}px`,
                      maxWidth: `${columnWidth}px`, 
                      padding: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSortChange(col.field)}
                  >
                    <Box display="flex" alignItems="center">
                      {col.headerName}
                      {sortConfig.key === col.field && (
                        <span style={{ marginLeft: 4 }}>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Box>
                    <TextField
                      value={filters[col.field] || ""}
                      onChange={(e) => handleFilterChange(col.field, e.target.value)}
                      placeholder={`Filter ${col.headerName}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                      InputProps={{
                        sx: { height: 32, fontSize: 12 },
                      }}
                    />
                  </TableCell>
                ))}

                <TableCell sx={{ 
                  fontWeight: 'bold',  
                  width: `${columnWidth}px`,
                  minWidth: `${columnWidth}px`,
                  maxWidth: `${columnWidth}px`, 
                  padding: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => handleSortChange("ORD_QTY")}
                >
                  <Box display="flex" alignItems="center">
                    OrdQty
                    {sortConfig.key === "ORD_QTY" && (
                      <span style={{ marginLeft: 4 }}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </Box>
                  <TextField
                    value={filters.ORD_QTY || ""}
                    onChange={(e) => handleFilterChange("ORD_QTY", e.target.value)}
                    placeholder="Filter Qty"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ mt: 1 }}
                    InputProps={{
                      sx: { height: 32, fontSize: 12 },
                    }}
                  />
                </TableCell>

                {columns.slice(mrpIndex + 1).map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{ 
                      fontWeight: 'bold',  
                      width: `${columnWidth}px`,
                      minWidth: `${columnWidth}px`,
                      maxWidth: `${columnWidth}px`, 
                      padding: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSortChange(col.field)}
                  >
                    <Box display="flex" alignItems="center">
                      {col.headerName}
                      {sortConfig.key === col.field && (
                        <span style={{ marginLeft: 4 }}>
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Box>
                    <TextField
                      value={filters[col.field] || ""}
                      onChange={(e) => handleFilterChange(col.field, e.target.value)}
                      placeholder={`Filter ${col.headerName}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                      InputProps={{
                        sx: { height: 32, fontSize: 12 },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedAndFilteredData.map((row, index) => (
                <TableRow key={index} sx={{ height: '30px' }}>
                  {columns.slice(0, mrpIndex + 1).map((column) => (
                    <TableCell
                      key={`${column.field}-${index}`}
                      sx={{
                        fontSize: 14,
                        width: `${columnWidth}px`,
                        minWidth: `${columnWidth}px`,
                        maxWidth: `${columnWidth}px`,
                        padding: "2px 4px",
                        textAlign: "left",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        position: "relative",
                      }}
                    >
                      {row[column.field] ?? '-'}
                    </TableCell>
                  ))}

                  <TableCell sx={{ padding: '4px', width: `20px`, minWidth: `30px`, maxWidth: `30px`}}>
                    <TextField
                      type="number"
                      value={localData[index]?.ORD_QTY ?? 0}
                      onChange={(e) => {
                        const newData = [...localData];
                        newData[index].ORD_QTY = parseInt(e.target.value) || 0;
                        setLocalData(newData);
                      }}
                      inputProps={{
                        min: 0,
                        style: {
                          textAlign: 'left',
                          padding: '4px 8px',
                          height: '24px'
                        }
                      }}
                      sx={{
                        width: '70px',
                        '& .MuiOutlinedInput-root': {
                          height: '28px',
                        },
                        '& .MuiInputBase-input': {
                          padding: '4px 8px',
                          height: '24px',
                          lineHeight: '24px'
                        }
                      }}
                    />
                  </TableCell>

                  {columns.slice(mrpIndex + 1).map((col) => (
                    <TableCell 
                      key={`${col.field}-${index}`} 
                      sx={{ 
                        fontSize: 14,
                        width: `${columnWidth}px`,
                        minWidth: `${columnWidth}px`,
                        maxWidth: `${columnWidth}px`,
                        padding: "2px 4px",
                        textAlign: "left",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        position: "relative",
                      }}
                    >
                      {row[col.field] ?? '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
}