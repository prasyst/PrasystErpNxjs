'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Container, Card, CardContent, Typography, Button, TextField, MenuItem, IconButton, Chip,
    InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme,
    Grid, Tooltip, Fab, CircularProgress, Divider, Avatar, Alert, Stack, Autocomplete
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon,
    Escalator as EscalatorIcon,
    Warning as WarningIcon,
    ArrowUpward as ArrowUpwardIcon,
    ExpandMore as ExpandMoreIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
// import TicketDetailsDialog from '../empTicketsComp/ViewTicketDetailsDialog/TicketDetailsDialog';
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';
import { toast, ToastContainer } from 'react-toastify';

const TicketEscalation = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [escalationDialogOpen, setEscalationDialogOpen] = useState(false);
    const [escalationDetails, setEscalationDetails] = useState({
        level: '',
        reason: '',
    });
    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post("TrnTkt/GetTrnTktDashBoard?currentPage=1&limit=50", {
                SearchText: ""
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const realTickets = response.data.DATA.map(tkt => ({
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
                    mobileNo: tkt.MOBILENO || "N/A",
                    tktFor: tkt.TKTFOR === "M" ? "Machine" : "Department",
                    ccnName: tkt.CCN_NAME || "",
                    machineryName: tkt.MACHINERY_NAME || "",
                    ageInHours: Math.floor(Math.random() * 72) + 1,
                    escalationLevel: Math.floor(Math.random() * 3) + 1,
                    lastEscalated: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                }));
                setTickets(realTickets);
                setFilteredTickets(realTickets);
            }
        } catch (error) {
            toast.error("Failed to load tickets");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let filtered = tickets;

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
    }, [searchTerm, statusFilter, priorityFilter, tickets]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'error';
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

    const getEscalationColor = (level) => {
        switch (level) {
            case 1: return 'success';
            case 2: return 'warning';
            case 3: return 'error';
            case 4: return 'error';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const response = await axiosInstance.post("Employee/GetEmployeeDrp", {
                FLAG: ""
            });

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const employeeList = response.data.DATA.map(emp => ({
                    EMP_KEY: emp.EMP_KEY,
                    EMP_NAME: emp.EMP_NAME
                }));
                setEmployees(employeeList);
                if (employeeList.length > 0) {
                    setEscalationDetails(prev => ({
                        ...prev,
                        level: employeeList[0].EMP_KEY
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoadingEmployees(false);
        }
    };

    const handleEscalate = () => {
        if (selectedRows.length === 0) {
            toast.warning('Please select at least one ticket to escalate');
            return;
        }
        setEscalationDialogOpen(true);
        fetchEmployees();
    };

    const handleEscalationSubmit = async () => {
        if (!escalationDetails.level) {
            toast.error('Please select an employee to escalate to');
            return;
        }

        if (selectedRows.length === 0) {
            toast.error('Please select at least one ticket');
            return;
        }

        setLoading(true);
        try {
            const payload = selectedRows.map(ticketId => ({
                TktKey: ticketId,
                FrwdEmp_Key: escalationDetails.level,
                FLAG: ""
            }));

            const response = await axiosInstance.post('/TrnTkt/MangeFrwdEmp', payload);

            if (response.data.STATUS === 0 || response.data.success) {
                toast.success(`Successfully escalated ${selectedRows.length} ticket(s)!`);
                setEscalationDialogOpen(false);
                setSelectedRows([]);
                setEscalationDetails({
                    level: '',
                    reason: ''
                });
                fetchTickets();
            } else {
                throw new Error(response.data.MESSAGE || 'Escalation failed');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to escalate tickets. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Column definitions for AG Grid
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
        },
        { 
            field: "id", 
            headerName: "Ticket No", 
            width: 110,
            minWidth: 100,
            filter: 'agSetColumnFilter',
            filterParams: {
                defaultToNothingSelected: true,
            },
            sortable: true,
            cellRenderer: (params) => (
                <Box display="flex" alignItems="center" gap={0.5}>
                    <EscalatorIcon sx={{ fontSize: '0.875rem', color: '#dc2626' }} />
                    <Typography variant="body2" fontWeight="600" color="primary" sx={{ fontSize: '0.75rem' }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        { 
            field: "title", 
            headerName: "Title", 
            width: 80,
            minWidth: 80,
            flex: 1,
            filter: 'agSetColumnFilter',
            filterParams: {
                defaultToNothingSelected: true,
            },
            sortable: true,
            cellRenderer: (params) => (
                <Typography variant="subtitle2" fontWeight="600" sx={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {params.value}
                </Typography>
            )
        },
        { 
            field: "escalationLevel", 
            headerName: "Escalation", 
            width: 120,
            minWidth: 120,
            filter: 'agSetColumnFilter',
            filterParams: {
                defaultToNothingSelected: true,
            },
            sortable: true,
            cellRenderer: (params) => (
                <Chip
                    label={`L${params.value}`}
                    size="small"
                    color={getEscalationColor(params.value)}
                    sx={{ fontSize: '0.7rem', height: '22px', minWidth: '50px' }}
                />
            )
        },
        { 
            field: "priority", 
            headerName: "Priority", 
            width: 95,
            minWidth: 90,
            filter: 'agSetColumnFilter',
            filterParams: {
                defaultToNothingSelected: true,
            },
            sortable: true,
            cellRenderer: (params) => (
                <Chip 
                    label={params.value} 
                    size="small" 
                    color={getPriorityColor(params.value)} 
                    sx={{ fontSize: '0.7rem', height: '22px', minWidth: '60px' }} 
                />
            )
        },
        { 
            field: "status", 
            headerName: "Status", 
            width: 110,
            minWidth: 110,
            filter: 'agSetColumnFilter',
            filterParams: {
                defaultToNothingSelected: true,
            },
            sortable: true,
            cellRenderer: (params) => {
                const statusMap = {
                    'open': 'Open',
                    'in-progress': 'In Progress',
                    'hold': 'Hold',
                    'resolved': 'Resolved',
                    'closed': 'Closed'
                };
                return (
                    <Chip
                        label={statusMap[params.value] || params.value}
                        size="small"
                        color={getStatusColor(params.value)}
                        variant="filled"
                        sx={{ fontSize: '0.7rem', height: '22px', minWidth: '70px' }}
                    />
                );
            }
        },
        { 
            field: "assignee", 
            headerName: "Assignee", 
            width: 140,
            minWidth: 140,
            filter: 'agSetColumnFilter',
            filterParams: {
                defaultToNothingSelected: true,
            },
            sortable: true,
            cellRenderer: (params) => (
                <Box display="flex" alignItems="center" gap={0.5}>
                    <Avatar sx={{ width: 20, height: 20, fontSize: '0.7rem', bgcolor: 'primary.main' }}>
                        {params.value?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {params.value?.split(' ')[0] || 'Unassigned'}
                    </Typography>
                </Box>
            )
        },
        { 
            field: "createdAt", 
            headerName: "Created", 
            width: 100,
            minWidth: 90,
            filter: 'agDateColumnFilter',
            filterParams: {
                browserDatePicker: true,
                filterOptions: [
                    'equals',
                    'notEqual',
                    'lessThan',
                    'greaterThan',
                    'inRange',
                    'empty',
                    'notEmpty'
                ],
                customOptionLabel: 'Custom Dates',
                customFilter: getCustomDateFilter()
            },
            sortable: true,
            valueFormatter: (params) => formatDate(params.value),
            cellRenderer: (params) => (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatDate(params.value)}
                </Typography>
            )
        },
        { 
            field: "lastEscalated", 
            headerName: "Last Escalated", 
            width: 130,
            minWidth: 120,
            filter: 'agDateColumnFilter',
            filterParams: {
                browserDatePicker: true,
                filterOptions: [
                    'equals',
                    'notEqual',
                    'lessThan',
                    'greaterThan',
                    'inRange',
                    'empty',
                    'notEmpty'
                ],
                customOptionLabel: 'Custom Dates',
                customFilter: getCustomDateFilter()
            },
            sortable: true,
            valueFormatter: (params) => formatDateTime(params.value),
            cellRenderer: (params) => (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatDateTime(params.value)}
                </Typography>
            )
        }
    ], []);

    const handleRowDoubleClick = useCallback((row) => {
        // Handle double click if needed
        console.log('Row double clicked:', row);
    }, []);

    const handleSelectionChanged = useCallback((event) => {
        const selectedNodes = event.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        setSelectedRows(selectedData.map(t => t.TKTKEY));
    }, []);

    const MobileTicketCard = ({ ticket }) => {
        const isOverdue = ticket.ageInHours > 48;
        
        return (
            <Card sx={{ mb: 1, cursor: 'pointer', borderLeft: isOverdue ? '3px solid #ef4444' : 'none' }}>
                <CardContent sx={{ p: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <EscalatorIcon sx={{ color: '#dc2626', fontSize: '1rem' }} />
                            <Typography variant="subtitle1" fontWeight="600" color="primary">
                                {ticket.id}
                            </Typography>
                        </Box>
                        <Chip
                            label={`L${ticket.escalationLevel}`}
                            size="small"
                            color={getEscalationColor(ticket.escalationLevel)}
                        />
                    </Box>

                    <Typography variant="h6" fontWeight="600" sx={{ mb: 1, fontSize: '1rem' }} noWrap>
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
                        <Chip
                            label={ticket.status.replace('-', ' ')}
                            size="small"
                            color={getStatusColor(ticket.status)}
                            variant="filled"
                        />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                {ticket.assignee.charAt(0).toUpperCase()}
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
                        <Typography variant="caption" color="text.secondary">
                            Last Esc: {formatDateTime(ticket.lastEscalated)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Age: {ticket.ageInHours}h
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{
            minHeight: '86vh',
            backgroundColor: 'grey.50',
            py: { xs: 1, md: 1 },
            px: { xs: 1, sm: 1 }
        }}>
            <ToastContainer />
            <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
                {/* Main Card with all controls */}
                <Card sx={{ mb: 0, boxShadow: 2 }}>
                    <CardContent sx={{ p: { xs: 1, sm: 1 } }}>
                        <Grid container spacing={2} alignItems="center">
                            {/* Header Section with Title and Action Buttons */}
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <EscalatorIcon sx={{ color: '#dc2626', fontSize: '1.8rem' }} />
                                        <Typography
                                            variant={isSmallMobile ? "h5" : "h5"}
                                            component="h1"
                                            fontWeight="bold"
                                            sx={{
                                                background: "linear-gradient(to right, #7e1f0aff, #054711ff)",
                                                WebkitBackgroundClip: "text",
                                                color: "transparent",
                                                display: "inline-block",
                                            }}
                                        >
                                            Ticket Escalation
                                        </Typography>
                                    </Box>
                                    
                                    <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} width={{ xs: '100%', sm: 'auto' }}>
                                        <Button
                                            startIcon={<ArrowBackIcon />}
                                            onClick={() => window.history.back()}
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
                                        
                                        <Tooltip title='Escalate Selected Tickets' arrow>
                                            <Button
                                                variant="contained"
                                                startIcon={<ArrowUpwardIcon />}
                                                onClick={handleEscalate}
                                                disabled={selectedRows.length === 0}
                                                sx={{ 
                                                    textTransform: 'none', 
                                                    borderRadius: '20px', 
                                                    backgroundColor: '#dc2626',
                                                    '&:hover': { backgroundColor: '#b91c1c' },
                                                    width: { xs: '100%', sm: 'auto' }
                                                }}
                                                fullWidth={isSmallMobile}
                                            >
                                                {isSmallMobile ? 'Escalate' : 'Escalate Selected'} ({selectedRows.length})
                                            </Button>
                                        </Tooltip>
                                    </Box>
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
                                        <Typography variant="caption" color="error" fontWeight="500" display="block">
                                            Selected: {selectedRows.length}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* AG Grid Table for Desktop */}
                {!isMobile && (
                    <div style={{ height: 'calc(93vh - 100px)', width: '100%', marginTop: '0px' }}>
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
                                rowHeight={28}
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
                                    fileName: 'Ticket_Escalation',
                                    sheetName: 'Tickets'
                                }}
                                enableLanguageSwitch={false}
                            />
                        )}
                    </div>
                )}

                {/* Mobile View */}
                {isMobile && (
                    <Box sx={{ mt: 2 }}>
                        {isLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            filteredTickets.map((ticket, index) => (
                                <MobileTicketCard key={ticket.TKTKEY || index} ticket={ticket} />
                            ))
                        )}
                        {filteredTickets.length === 0 && !isLoading && (
                            <Card sx={{ textAlign: 'center', py: 8, boxShadow: 3 }}>
                                <CardContent>
                                    <SearchIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                                    <Typography variant="h5" gutterBottom fontWeight="600">
                                        No tickets found
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                        {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                                            ? 'Try adjusting your search or filter criteria to find what you are looking for.'
                                            : 'No tickets have been created yet.'
                                        }
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                )}

                {/* Escalation Dialog */}
                <Dialog
                    open={escalationDialogOpen}
                    onClose={() => !loading && setEscalationDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <Box display="flex" alignItems="center" gap={1}>
                            <ArrowUpwardIcon color="error" />
                            <Typography variant="h6">Escalate Tickets</Typography>
                            <IconButton
                                onClick={() => setEscalationDialogOpen(false)}
                                sx={{ position: 'absolute', right: 8, top: 8 }}
                                disabled={loading}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            You are about to escalate {selectedRows.length} ticket(s) to a higher level.
                        </Alert>

                        <Stack spacing={3}>
                            <Autocomplete
                                options={employees}
                                value={employees.find(emp => emp.EMP_KEY === escalationDetails.level) || null}
                                onChange={(event, newValue) => {
                                    setEscalationDetails({
                                        ...escalationDetails,
                                        level: newValue ? newValue.EMP_KEY : ''
                                    });
                                }}
                                getOptionLabel={(option) => `${option.EMP_NAME} (${option.EMP_KEY})`}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.EMP_KEY}>
                                        <Box sx={{ width: '100%' }}>
                                            <Typography variant="body2">
                                                {option.EMP_NAME}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ID: {option.EMP_KEY}
                                            </Typography>
                                        </Box>
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search and Select Employee"
                                        size="small"
                                        fullWidth
                                        placeholder="Type to search..."
                                    />
                                )}
                                loading={loadingEmployees}
                                loadingText="Loading employees..."
                                noOptionsText="No employees found"
                                popupIcon={<ExpandMoreIcon />}
                            />
                            <Alert severity="info">
                                <Typography variant="body2">
                                    <strong>Selected Tickets:</strong> {selectedRows.length}
                                </Typography>
                            </Alert>
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button
                            onClick={() => setEscalationDialogOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<SendIcon />}
                            onClick={handleEscalationSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Escalating...' : 'Confirm Escalation'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default TicketEscalation;