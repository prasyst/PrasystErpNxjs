'use client';

import { useState, useEffect } from 'react';
import {
    Box, Container, Card, CardContent, Typography, Button, TextField, MenuItem, IconButton, Chip, Grid, Paper, Stack,
    InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme, Checkbox, FormControlLabel,
    Alert, Divider, Avatar, Tooltip, Badge, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Tabs, Tab
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Escalator as EscalatorIcon,
    Warning as WarningIcon,
    ArrowUpward as ArrowUpwardIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    ExpandMore as ExpandMoreIcon,
    Send as SendIcon,
    History as HistoryIcon,
    Notifications as NotificationsIcon,
    PriorityHigh as PriorityHighIcon,
    AccessTime as AccessTimeIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Chat as ChatIcon,
} from '@mui/icons-material';
import axiosInstance from '@/lib/axios';

const escalationLevels = [
    { id: 1, name: 'Level 1 - Support', color: 'success', time: '24h' },
    { id: 2, name: 'Level 2 - Senior Support', color: 'warning', time: '48h' },
    { id: 3, name: 'Level 3 - Technical Lead', color: 'error', time: '72h' },
    { id: 4, name: 'Level 4 - Management', color: 'error', time: '96h' },
];

const escalationReasons = [
    'SLA Time Exceeded',
    'Technical Complexity',
    'Customer Request',
    'Multiple Follow-ups',
    'High Priority',
    'System Critical Issue',
    'Resource Unavailable',
];

const TicketEscalation = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [escalationDialogOpen, setEscalationDialogOpen] = useState(false);
    const [escalationDetails, setEscalationDetails] = useState({
        level: 2,
        reason: '',
        comment: '',
        notifyCustomer: true,
    });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        search: '',
        status: 'all',
        priority: 'all',
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axiosInstance.post(
                "TrnTkt/GetTrnTktDashBoard?currentPage=1&limit=50",
                { SearchText: "" }
            );

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
                            tkt.TKTSTATUS === "R" ? "resolved" : "closed",
                    assignee: tkt.TECHEMP_NAME || "Unassigned",
                    reporter: tkt.RAISEBYNM || "Unknown",
                    createdAt: tkt.TKTDATE,
                    dueDate: tkt.ASSIGNDT || tkt.TKTDATE,
                    mobileNo: tkt.MOBILENO || "N/A",
                    ageInHours: Math.floor(Math.random() * 72) + 1,
                    escalationLevel: Math.floor(Math.random() * 3) + 1,
                    lastEscalated: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                }));

                setTickets(realTickets);
            }
        } catch (error) {
            console.error("Failed to load tickets:", error);
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const currentPageTickets = tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
            setSelectedTickets(currentPageTickets.map(t => t.TKTKEY));
        } else {
            setSelectedTickets([]);
        }
    };

    const handleTicketSelect = (event, ticketId) => {
        if (event.target.checked) {
            setSelectedTickets(prev => [...prev, ticketId]);
        } else {
            setSelectedTickets(prev => prev.filter(id => id !== ticketId));
        }
    };

    const handleEscalate = () => {
        if (selectedTickets.length === 0) {
            alert('Please select at least one ticket to escalate');
            return;
        }
        setEscalationDialogOpen(true);
    };

    const handleEscalationSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ticketIds: selectedTickets,
                escalationLevel: escalationDetails.level,
                reason: escalationDetails.reason,
                comment: escalationDetails.comment,
                notifyCustomer: escalationDetails.notifyCustomer,
                escalatedBy: 'currentUser',
            };

            const response = await axiosInstance.post('/api/tickets/escalate', payload);

            if (response.data.success) {
                alert('Tickets escalated successfully!');
                setEscalationDialogOpen(false);
                setSelectedTickets([]);
                fetchTickets();
            }
        } catch (error) {
            console.error('Escalation failed:', error);
            alert('Failed to escalate tickets');
        } finally {
            setLoading(false);
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'error';
            case 'in-progress': return 'warning';
            case 'resolved': return 'success';
            case 'closed': return 'default';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const filteredTickets = tickets.filter(ticket => {
        if (filter.search && !ticket.id.toLowerCase().includes(filter.search.toLowerCase()) &&
            !ticket.title.toLowerCase().includes(filter.search.toLowerCase()) &&
            !ticket.description.toLowerCase().includes(filter.search.toLowerCase())) {
            return false;
        }
        if (filter.status !== 'all' && ticket.status !== filter.status) {
            return false;
        }
        if (filter.priority !== 'all' && ticket.priority !== filter.priority) {
            return false;
        }
        return true;
    });


    const paginatedTickets = filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: 'grey.50',

        }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
                <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={() => window.history.back()}
                                sx={{
                                    fontWeight: '600',
                                    color: 'primary.main',
                                    textTransform: 'none',
                                    borderRadius: '20px',
                                    minWidth: 'auto',

                                }}
                                variant="outlined"
                            >
                                Back
                            </Button>

                            <Box display="flex" alignItems="center" gap={1}>
                                <EscalatorIcon sx={{ color: 'primary.main', fontSize: '1.75rem' }} />
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{
                                        fontSize: { xs: '1rem', sm: '1.5rem', md: '1.75rem' }
                                    }}
                                >
                                    Ticket Escalation
                                </Typography>
                            </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                    fontWeight: 500
                                }}
                            >
                                Selected: {selectedTickets.length} tickets
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<ArrowUpwardIcon />}
                                onClick={handleEscalate}
                                disabled={selectedTickets.length === 0}
                                sx={{
                                    backgroundColor: '#dc2626',
                                    '&:hover': { backgroundColor: '#b91c1c' },
                                    textTransform: 'none',
                                    borderRadius: '20px',
                                    px: 3,
                                    py: 1
                                }}
                            >
                                Escalate Selected
                            </Button>
                        </Box>
                    </Box>

                    {/* Mobile view: Selected count below */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            mt: 1,
                            fontWeight: 500
                        }}
                    >
                        Selected: {selectedTickets.length} tickets
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} lg={12}>
                        <Card sx={{ boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 1, sm: 2 } }}>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                placeholder="Search tickets..."
                                                value={filter.search}
                                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
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

                                        <Grid item xs={6} md={4}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Status"
                                                value={filter.status}
                                                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                                size="small"
                                            >
                                                <MenuItem value="all">All Status</MenuItem>
                                                <MenuItem value="open">Open</MenuItem>
                                                <MenuItem value="in-progress">In Progress</MenuItem>
                                                <MenuItem value="resolved">Resolved</MenuItem>
                                                <MenuItem value="closed">Closed</MenuItem>
                                            </TextField>
                                        </Grid>

                                        <Grid item xs={6} md={4}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Priority"
                                                value={filter.priority}
                                                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                                                size="small"
                                            >
                                                <MenuItem value="all">All Priority</MenuItem>
                                                <MenuItem value="High">High</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Low">Low</MenuItem>
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                    p: 0.5,
                                    backgroundColor: 'grey.100',
                                    borderRadius: 1,
                                    flexWrap: 'wrap',
                                    gap: 1
                                }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedTickets.length === paginatedTickets.length && paginatedTickets.length > 0}
                                                    indeterminate={selectedTickets.length > 0 && selectedTickets.length < paginatedTickets.length}
                                                    onChange={handleSelectAll}
                                                    size="small"
                                                />
                                            }
                                            label="Select All on Page"
                                            sx={{ m: 0 }}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedTickets.length} of {tickets.length} selected
                                    </Typography>
                                </Box>

                                <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            flex: 1,
                                            boxShadow: 'none',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            '& .MuiTable-root': {
                                                tableLayout: 'fixed'
                                            }
                                        }}
                                    >
                                        <Table
                                            sx={{
                                                '& .MuiTableCell-root': {
                                                    padding: '8px 12px',
                                                    fontSize: '0.8125rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                },
                                                '& .MuiTableCell-head': {
                                                    backgroundColor: 'primary.main',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem',
                                                    position: 'sticky',
                                                    top: 0,
                                                    zIndex: 1,
                                                },
                                                '& .MuiTableRow-root': {
                                                    '&:hover': {
                                                        backgroundColor: 'action.hover',
                                                    },
                                                },
                                            }}
                                            stickyHeader
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        padding="checkbox"
                                                        sx={{
                                                            backgroundColor: 'primary.main',
                                                            width: '50px',
                                                            minWidth: '50px',
                                                            maxWidth: '50px'
                                                        }}
                                                    >
                                                        <Checkbox
                                                            size="small"
                                                            color="default"
                                                            indeterminate={selectedTickets.length > 0 && selectedTickets.length < paginatedTickets.length}
                                                            checked={paginatedTickets.length > 0 && selectedTickets.length === paginatedTickets.length}
                                                            onChange={handleSelectAll}
                                                            sx={{
                                                                color: 'white',
                                                                '&.Mui-checked': { color: 'white' },
                                                                padding: '4px'
                                                            }}
                                                        />
                                                    </TableCell>

                                                    <TableCell sx={{ width: '120px', minWidth: '120px' }}>Ticket No</TableCell>
                                                    <TableCell sx={{ width: '200px', minWidth: '200px' }}>Title</TableCell>
                                                    <TableCell sx={{ width: '130px', minWidth: '130px' }}>Escalation</TableCell>
                                                    <TableCell sx={{ width: '100px', minWidth: '100px' }}>Priority</TableCell>
                                                    <TableCell sx={{ width: '100px', minWidth: '100px' }}>Status</TableCell>
                                                    <TableCell sx={{ width: '120px', minWidth: '120px' }}>Assignee</TableCell>
                                                    <TableCell sx={{ width: '100px', minWidth: '100px' }}>Created</TableCell>
                                                    <TableCell sx={{ width: '120px', minWidth: '120px' }}>Last Escalated</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {paginatedTickets.length > 0 ? (
                                                    paginatedTickets.map((ticket) => {
                                                        const isSelected = selectedTickets.includes(ticket.TKTKEY);
                                                        const isOverdue = ticket.ageInHours > 48;

                                                        return (
                                                            <TableRow
                                                                key={ticket.TKTKEY}
                                                                hover
                                                                selected={isSelected}
                                                                sx={{
                                                                    cursor: 'pointer',
                                                                    backgroundColor: isSelected ? 'action.selected' : 'inherit',
                                                                    ...(isOverdue && {
                                                                        borderLeft: '4px solid #ef4444',
                                                                        backgroundColor: '#fef2f2',
                                                                    })
                                                                }}
                                                                onClick={(e) => {
                                                                    if (e.target.type !== 'checkbox') {
                                                                        handleTicketSelect({ target: { checked: !isSelected } }, ticket.TKTKEY);
                                                                    }
                                                                }}
                                                            >
                                                                <TableCell
                                                                    padding="checkbox"
                                                                    sx={{ width: '50px', minWidth: '50px', maxWidth: '50px' }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Checkbox
                                                                        size="small"
                                                                        color="primary"
                                                                        checked={isSelected}
                                                                        onChange={(e) => handleTicketSelect(e, ticket.TKTKEY)}
                                                                        sx={{ padding: '4px' }}
                                                                    />
                                                                </TableCell>

                                                                <TableCell sx={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                                                                    <Box display="flex" alignItems="center" gap={1}>
                                                                        <Badge
                                                                            badgeContent={ticket.escalationLevel}
                                                                            color={getEscalationColor(ticket.escalationLevel)}
                                                                            size="small"
                                                                            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}
                                                                        >
                                                                            <EscalatorIcon fontSize="small" />
                                                                        </Badge>
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight="600"
                                                                            color="primary"
                                                                            sx={{
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis'
                                                                            }}
                                                                        >
                                                                            {ticket.id}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell sx={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}>
                                                                    <Box>
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            fontWeight="600"
                                                                            sx={{
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap'
                                                                            }}
                                                                        >
                                                                            {ticket.title}
                                                                        </Typography>
                                                                        {/* <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {ticket.description.substring(0, 40)}...
                            </Typography> */}
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell sx={{ width: '130px', minWidth: '130px', maxWidth: '130px' }}>
                                                                    <Chip
                                                                        label={`L${ticket.escalationLevel}`}
                                                                        size="small"
                                                                        color={getEscalationColor(ticket.escalationLevel)}
                                                                        sx={{
                                                                            fontWeight: 'bold',
                                                                            maxWidth: '100%'
                                                                        }}
                                                                    />
                                                                </TableCell>

                                                                <TableCell sx={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                                                                    <Chip
                                                                        label={ticket.priority}
                                                                        size="small"
                                                                        color={getPriorityColor(ticket.priority)}
                                                                        sx={{
                                                                            maxWidth: '100%',
                                                                            '& .MuiChip-label': { px: 1 }
                                                                        }}
                                                                    />
                                                                </TableCell>

                                                                <TableCell sx={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                                                                    <Chip
                                                                        label={ticket.status.replace('-', ' ')}
                                                                        size="small"
                                                                        color={getStatusColor(ticket.status)}
                                                                        variant="filled"
                                                                        sx={{
                                                                            maxWidth: '100%',
                                                                            '& .MuiChip-label': { px: 1 }
                                                                        }}
                                                                    />
                                                                </TableCell>



                                                                <TableCell sx={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                                                                    <Box display="flex" alignItems="center" gap={1}>
                                                                        <Avatar
                                                                            sx={{
                                                                                width: 24,
                                                                                height: 24,
                                                                                fontSize: '0.75rem',
                                                                                bgcolor: 'primary.main'
                                                                            }}
                                                                        >
                                                                            {ticket.assignee.charAt(0).toUpperCase()}
                                                                        </Avatar>
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap'
                                                                            }}
                                                                        >
                                                                            {ticket.assignee.split(' ')[0]}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell sx={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}
                                                                    >
                                                                        {formatDate(ticket.createdAt)}
                                                                    </Typography>
                                                                </TableCell>

                                                                <TableCell sx={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                        sx={{
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}
                                                                    >
                                                                        {formatDateTime(ticket.lastEscalated)}
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                                            <Typography variant="body1" color="text.secondary">
                                                                No tickets found. Try adjusting your filters.
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Pagination */}
                                    {filteredTickets.length > 0 && (
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, 50]}
                                            component="div"
                                            count={filteredTickets.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            sx={{
                                                mt: 2,
                                                '& .MuiTablePagination-toolbar': {
                                                    minHeight: '52px',
                                                    padding: '0 8px'
                                                },
                                                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                                    margin: 0
                                                }
                                            }}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
             
                </Grid>
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
                        </Box>
                    </DialogTitle>

                    <DialogContent>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            You are about to escalate {selectedTickets.length} ticket(s) to a higher level.
                        </Alert>

                        <Stack spacing={3}>
                            <TextField
                                select
                                label="Escalate To Level"
                                value={escalationDetails.level}
                                onChange={(e) => setEscalationDetails({ ...escalationDetails, level: e.target.value })}
                                fullWidth
                                size="small"
                            >
                                {escalationLevels.map((level) => (
                                    <MenuItem key={level.id} value={level.id}>
                                        {level.name} (SLA: {level.time})
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                label="Reason for Escalation"
                                value={escalationDetails.reason}
                                onChange={(e) => setEscalationDetails({ ...escalationDetails, reason: e.target.value })}
                                fullWidth
                                size="small"
                            >
                                {escalationReasons.map((reason, index) => (
                                    <MenuItem key={index} value={reason}>
                                        {reason}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Additional Comments"
                                value={escalationDetails.comment}
                                onChange={(e) => setEscalationDetails({ ...escalationDetails, comment: e.target.value })}
                                multiline
                                rows={3}
                                fullWidth
                                size="small"
                                placeholder="Add any additional information or instructions..."
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={escalationDetails.notifyCustomer}
                                        onChange={(e) => setEscalationDetails({ ...escalationDetails, notifyCustomer: e.target.checked })}
                                    />
                                }
                                label="Notify customer about escalation"
                            />

                            <Alert severity="info">
                                <Typography variant="body2">
                                    <strong>Selected Tickets:</strong> {selectedTickets.length}
                                    <br />
                                    <strong>Estimated SLA:</strong> {escalationLevels.find(l => l.id === escalationDetails.level)?.time}
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
                            disabled={loading || !escalationDetails.reason}
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