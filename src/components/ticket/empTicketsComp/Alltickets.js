'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Container, Card, CardContent, Typography, Button, TextField, MenuItem, IconButton, Chip, 
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme, 
  Grid, Avatar, Divider, Tooltip, Fab, CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import TicketDetailsDialog from '../empTicketsComp/ViewTicketDetailsDialog/TicketDetailsDialog';
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';

const AllTicketsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [ticketData, setTicketData] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDetailsOpen, setTicketDetailsOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [empKey, setEmpKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("EMP_KEY");
    if (key) {
      setEmpKey(key);
    }
  }, []);

  useEffect(() => {
    if (empKey) {
      fetchTicketDash();
    }
  }, [empKey]);

  const fetchTicketDash = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "TrnTkt/GetTrnTktDashBoard?currentPage=1&limit=50",
        {
          SearchText: "",
          Flag: "EMPSUBCAT",
          EMP_KEY: empKey
        }
      );

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const realTickets = response.data.DATA;

        const mappedTickets = realTickets.map(tkt => ({
          TKTKEY: tkt.TKTKEY,
          id: tkt.TKTNO,
          title: tkt.REMARK || "No Title",
          description: tkt.TKTDESC || tkt.REASON || "No description",
          category: tkt.TKTSERVICENAME || "General",
          priority: tkt.TKTSVRTYNAME || "Medium",
          status: tkt.TKTSTATUS === "O" ? "open" :
            tkt.TKTSTATUS === "P" ? "in-progress" :
              tkt.TKTSTATUS === "H" ? "hold" :
                tkt.TKTSTATUS === "R" ? "resolved" : "closed",
          assignee: tkt.TECHEMP_NAME || "Unassigned",
          reporter: tkt.RAISEBYNM || "Unknown",
          createdAt: tkt.TKTDATE,
          dueDate: tkt.ASSIGNDT || tkt.TKTDATE,
          tktFor: tkt.TKTFOR === "M" ? "Machine" : "Department",
          ccnName: tkt.CCN_NAME || "",
          machineryName: tkt.MACHINERY_NAME || "",
          mobileNo: tkt.MOBILENO || "-",
        }));

        setTicketData(mappedTickets);
        setFilteredTickets(mappedTickets);
      }
    } catch (error) {
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = ticketData;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
    // Clear selected rows when filters change
    setSelectedRows([]);
  }, [searchTerm, statusFilter, priorityFilter, ticketData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'info';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      case 'hold': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicketId(ticket.TKTKEY);
    setTicketDetailsOpen(true);
  };

  const handleCloseTicketDetails = () => {
    setTicketDetailsOpen(false);
    setSelectedTicketId(null);
  };

  const handleEditTicket = (ticket) => {
    router.push(`/emp-tickets/create-tickets/?TKTKEY=${ticket.TKTKEY}`);
  };

  const handleDeleteClick = (ticket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (ticketToDelete) {
      setTicketData(prev => prev.filter(ticket => ticket.TKTKEY !== ticketToDelete.TKTKEY));
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleRowDoubleClick = (params) => {
    handleViewTicket(params.data);
  };

  const handleSelectionChanged = (selectedNodes) => {
    const selectedIds = selectedNodes.map(node => node.data.TKTKEY);
    setSelectedRows(selectedIds);
  };

  const columnDefs = useMemo(() => [
  { 
    headerName: '', 
    width: 40, 
    maxWidth: 40, 
    checkboxSelection: true,
    headerCheckboxSelection: true,
    lockPosition: true,
    suppressMenu: true,
    sortable: false,
    filter: false,
    resizable: false,
    cellClass: 'checkbox-cell',
    headerClass: 'checkbox-header'
  },
  { 
    field: "id", 
    headerName: "Ticket No", 
    width: 120,
    minWidth: 110,
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true,
    cellClass: 'ticket-number-cell',
    headerClass: 'header-primary',
    cellRenderer: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Typography 
          variant="body2" 
          fontWeight="700" 
          sx={{ 
            fontSize: '0.8rem',
            color: '#1976d2',
            letterSpacing: '0.3px',
            fontFamily: 'monospace',
            '&:hover': { textDecoration: 'underline', cursor: 'pointer' }
          }}
          onClick={() => handleViewTicket(params.data)}
        >
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: "RAISEBYNM", 
    headerName: "Raised By", 
    width: 150,
    minWidth: 140,
    flex: 1,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellClass: 'user-cell',
    headerClass: 'header-secondary',
    cellRenderer: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        
        <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.8rem' }}>
          {params.value}
        </Typography>
      </Box>
    )
  },
  { 
    field: "title", 
    headerName: "Title", 
    width: 200,
    minWidth: 180,
    flex: 1.5,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellClass: 'title-cell',
    headerClass: 'header-secondary',
    cellRenderer: (params) => (
      <Tooltip title={params.value} arrow placement="top">
        <Typography 
          variant="body2" 
          fontWeight="500" 
          sx={{ 
            fontSize: '0.8rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#1a1a1a'
          }}
        >
          {params.value}
        </Typography>
      </Tooltip>
    )
  },
  { 
    field: "TKTCATNAME", 
    headerName: "Category", 
    width: 140,
    minWidth: 130,
    flex: 1,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellClass: 'category-cell',
    headerClass: 'header-secondary',
    cellRenderer: (params) => (
      <Chip 
        label={params.value || 'N/A'} 
        size="small" 
        variant="outlined" 
        sx={{ 
          fontSize: '0.7rem', 
          height: '24px',
          borderRadius: '12px',
          borderColor: '#90caf9',
          color: '#1565c0',
          fontWeight: 500,
          '& .MuiChip-label': { px: 1 }
        }} 
      />
    )
  },
  { 
    field: "TKTSUBCATNAME", 
    headerName: "Sub Category", 
    width: 140,
    minWidth: 130,
    flex: 1,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellClass: 'subcategory-cell',
    headerClass: 'header-secondary',
    cellRenderer: (params) => (
      <Chip 
        label={params.value || 'N/A'} 
        size="small" 
        variant="filled" 
        sx={{ 
          fontSize: '0.7rem', 
          height: '24px',
          borderRadius: '12px',
          bgcolor: '#f5f5f5',
          color: '#616161',
          fontWeight: 500
        }} 
      />
    )
  },
  { 
    field: "MOBILENO", 
    headerName: "Mobile", 
    width: 120,
    minWidth: 110,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellClass: 'mobile-cell',
    headerClass: 'header-secondary',
    cellRenderer: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#666' }}>
          {params.value || '-'}
        </Typography>
      </Box>
    )
  },
  { 
    field: "priority", 
    headerName: "Priority", 
    width: 110,
    minWidth: 100,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellClass: 'priority-cell',
    headerClass: 'header-secondary',
    cellRenderer: (params) => {
      const priorityConfig = {
        'High': { color: '#d32f2f', bgcolor: '#ffebee', icon: '🔴' },
        'Medium': { color: '#ed6c02', bgcolor: '#fff4e5', icon: '🟠' },
        'Low': { color: '#2e7d32', bgcolor: '#e8f5e9', icon: '🟢' }
      };
      const config = priorityConfig[params.value] || priorityConfig['Medium'];
      return (
        <Chip 
          label={params.value} 
          size="small" 
          sx={{ 
            fontSize: '0.7rem', 
            height: '26px',
            fontWeight: 600,
            backgroundColor: config.bgcolor,
            color: config.color,
            '& .MuiChip-label': { px: 1.5 }
          }} 
        />
      );
    }
  },
  { 
    field: "status", 
    headerName: "Status", 
    width: 120,
    minWidth: 110,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellClass: 'status-cell',
    headerClass: 'header-secondary',
    cellRenderer: (params) => {
      const statusConfig = {
        'open': { label: 'Open', color: '#1976d2', bgcolor: '#e3f2fd' },
        'in-progress': { label: 'In Progress', color: '#ed6c02', bgcolor: '#fff3e0' },
        'hold': { label: 'Hold', color: '#9c27b0', bgcolor: '#f3e5f5' },
        'resolved': { label: 'Resolved', color: '#2e7d32', bgcolor: '#e8f5e9' },
        'closed': { label: 'Closed', color: '#757575', bgcolor: '#f5f5f5' }
      };
      const config = statusConfig[params.value] || statusConfig['open'];
      return (
        <Chip
          label={config.label}
          size="small"
          sx={{ 
            fontSize: '0.7rem', 
            height: '26px',
            fontWeight: 600,
            backgroundColor: config.bgcolor,
            color: config.color,
            '& .MuiChip-label': { px: 1.5 }
          }}
        />
      );
    }
  },
  { 
    field: "tktFor", 
    headerName: "Type", 
    width: 115,
    minWidth: 90,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellClass: 'type-cell',
    headerClass: 'header-secondary',
    cellRenderer: (params) => (
      <Chip
        label={params.value === 'Machine' ? '⚙️ Machine' : '🏢 Dept'}
        size="small"
        variant="outlined"
        sx={{ 
          fontSize: '0.7rem', 
          height: '24px',
          borderRadius: '12px',
          fontWeight: 500
        }}
      />
    )
  },
  { 
    field: "createdAt", 
    headerName: "Raised On", 
    width: 130,
    minWidth: 120,
    filter: 'agDateColumnFilter',
    filterParams: {
      browserDatePicker: true,
      filterOptions: ['equals', 'notEqual', 'lessThan', 'greaterThan', 'inRange'],
      customOptionLabel: 'Custom Dates',
      customFilter: getCustomDateFilter()
    },
    sortable: true,
    cellClass: 'date-cell',
    headerClass: 'header-secondary',
    valueFormatter: (params) => formatDate(params.value),
    cellRenderer: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#666' }}>
          {formatDate(params.value)}
        </Typography>
      </Box>
    )
  },
  { 
    field: "REASON", 
    headerName: "Reason", 
    width: 150,
    minWidth: 130,
    flex: 1,
    filter: 'agSetColumnFilter',
    sortable: true,
    cellClass: 'reason-cell',
    headerClass: 'header-secondary',
    cellRenderer: (params) => (
      <Tooltip title={params.value || 'No reason provided'} arrow placement="top">
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.75rem', 
            color: '#555',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.value || '-'}
        </Typography>
      </Tooltip>
    )
  },
  { 
    headerName: "Actions", 
    width: 100,
    minWidth: 90,
    sortable: false,
    filter: false,
    cellClass: 'action-cell',
    headerClass: 'header-action',
    cellRenderer: (params) => (
      <Box display="flex" alignItems="center" gap={0.75}>
        <Tooltip title="View Details" arrow>
          <IconButton 
            size="small" 
            onClick={() => handleViewTicket(params.data)}
            sx={{ 
              padding: '4px',
              bgcolor: '#e3f2fd',
              '&:hover': { bgcolor: '#bbdefb' }
            }}
          >
            <VisibilityIcon sx={{ fontSize: '1rem', color: '#1976d2' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Ticket" arrow>
          <IconButton 
            size="small" 
            onClick={() => handleEditTicket(params.data)}
            sx={{ 
              padding: '4px',
              bgcolor: '#fff3e0',
              '&:hover': { bgcolor: '#ffe0b2' }
            }}
          >
            <EditIcon sx={{ fontSize: '1rem', color: '#ed6c02' }} />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }
], []);

  const MobileTicketCard = ({ ticket }) => (
    <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleViewTicket(ticket)}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="subtitle1" fontWeight="600" color="primary">
            {ticket.id}
          </Typography>
          <Chip
            label={ticket.status.replace('-', ' ')}
            size="small"
            color={getStatusColor(ticket.status)}
          />
        </Box>

        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }} noWrap>
          {ticket.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
          {ticket.description.length > 80
            ? `${ticket.description.substring(0, 80)}...`
            : ticket.description
          }
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip
            label={ticket.priority}
            size="small"
            color={getPriorityColor(ticket.priority)}
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            {ticket.category}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
              {getInitials(ticket.assignee)}
            </Avatar>
            <Typography variant="caption">
              {ticket.assignee.split(' ')[0]}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDate(ticket.createdAt)}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewTicket(ticket);
            }}
          >
            View
          </Button>
          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleEditTicket(ticket);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(ticket);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: 'grey.50',
      py: { xs: 2, md: 2 },
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
        <Card sx={{ mb: 0, boxShadow: 2 }}>
          <CardContent sx={{ p: { xs: 1, sm: 1 } }}>
            <Grid container spacing={2} alignItems="center">
              {/* Header Section with Title and Action Buttons */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                  <Typography
                    variant={isSmallMobile ? "h5" : "h4"}
                    component="h1"
                    fontWeight="bold"
                    sx={{
                      background: "linear-gradient(to right, #7e1f0aff, #054711ff)",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      display: "inline-block",
                    }}
                  >
                    Tickets
                  </Typography>
                  
                 
                </Box>
              </Grid>

              {/* Search and Filters Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="hold">Hold</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box textAlign="center">
                  
                  {selectedRows.length > 0 && (
                    <Typography variant="caption" color="primary" fontWeight="500" display="block">
                      Selected: {selectedRows.length}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Tooltip title='Update Bulk Record' arrow>
                  <Button
                    variant="contained"
                    size={isSmallMobile ? "small" : "medium"}
                    // onClick={handleBulkUpdate}
                    sx={{ 
                      textTransform: 'none', 
                      borderRadius: '20px', 
                      backgroundColor: '#615ec9ff',
                      width: '100%'
                    }}
                  >
                    {isSmallMobile ? 'Bulk' : 'Bulk Update'}
                  </Button>
                </Tooltip>
                
              </Grid>
               <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} width={{ xs: '100%', sm: 'auto' }}>
                    <Button
                      startIcon={<ArrowBackIcon />}
                      onClick={() => router.push('/emp-tickets/ticket-dashboard')}
                      sx={{
                        fontWeight: '600',
                        color: 'primary.main',
                        textTransform: 'none',
                        borderRadius: '20px',
                        width: { xs: '100%', sm: 'auto' }
                      }}
                      variant="outlined"
                      fullWidth={isSmallMobile}
                    >
                    </Button>
                    
                    <Tooltip title='Create New Ticket' arrow>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/emp-tickets/create-tickets')}
                        size={isSmallMobile ? "small" : "medium"}
                        sx={{ 
                          textTransform: 'none', 
                          borderRadius: '20px', 
                          backgroundColor: '#615ec9ff',
                          width: { xs: '100%', sm: 'auto' }
                        }}
                        fullWidth={isSmallMobile}
                      >
                        {isSmallMobile ? 'New' : 'New Ticket'}
                      </Button>
                    </Tooltip>
                  </Box>
            </Grid>
          </CardContent>
        </Card>

        {isMobile ? (
          <Box>
            {filteredTickets.map((ticket, index) => (
              <MobileTicketCard key={ticket.TKTKEY || index} ticket={ticket} />
            ))}
            {filteredTickets.length === 0 && (
              <Card sx={{ textAlign: 'center', py: 8, boxShadow: 3 }}>
                <CardContent>
                  <SearchIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h5" gutterBottom fontWeight="600">
                    No tickets found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria to find what you are looking for.'
                      : 'No tickets have been created yet. Start by creating your first ticket!'
                    }
                  </Typography>
                  {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={() => router.push('/emp-tickets/create-tickets')}
                    >
                      Create Your First Ticket
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        ) : (
          <div style={{ height: 'calc(92vh - 100px)', width: '100%' }}>
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
                columnDefs={columnDefs}
                rowData={filteredTickets}
                height="100%"
                theme="ag-theme-quartz"
                isDarkMode={false}
                pagination={true}
                paginationPageSize={25}
                paginationPageSizeSelector={[25, 50, 100, 250, 500]}
                quickFilter={false}
                onRowDoubleClick={handleRowDoubleClick}
                onSelectionChanged={handleSelectionChanged}
                loading={isLoading}
                enableExport={false}
                exportSelectedOnly={true}
                selectedRows={selectedRows}
                enableCheckbox={true}
                compactMode={true}
                rowHeight={25}
                enableResetButton={false}
                enableExitBackButton={false}
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                  filter: true,
                  flex: 0,
                  minWidth: 80
                }}
                customGridOptions={{
                  suppressRowClickSelection: true,
                  rowSelection: 'multiple',
                  animateRows: true,
                  enableCellTextSelection: true,
                  ensureDomOrder: true
                }}
                exportParams={{
                  suppressTextAsCDATA: true,
                  fileName: 'Tickets_Details',
                  sheetName: 'Tickets'
                }}
                enableLanguageSwitch={false}
              />
            )}
          </div>
        )}

        {isMobile && filteredTickets.length > 0 && (
          <Fab
            color="primary"
            aria-label="add ticket"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={() => router.push('/emp-tickets/create-tickets')}
          >
            <AddIcon />
          </Fab>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Confirm Delete</Typography>
              <IconButton onClick={() => setDeleteDialogOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete ticket <strong>{ticketToDelete?.id}</strong>?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <TicketDetailsDialog
          open={ticketDetailsOpen}
          onClose={handleCloseTicketDetails}
          ticketId={selectedTicketId}
          fetchTicketDash={fetchTicketDash}
          onEdit={(ticket) => {
            handleCloseTicketDetails();
            handleEditTicket(ticket);
          }}
        />
      </Container>
    </Box>
  );
};

export default AllTicketsPage;










