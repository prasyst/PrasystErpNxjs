'use client';

import { useState, useEffect } from 'react';
import { useRouter} from 'next/navigation';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Grid,
  Avatar,
  Divider,
  Tooltip,
  Fab
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const AllTicketsPage = () => {
  const router = useRouter();
//   const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [searchTerm, statusFilter, priorityFilter, tickets]);

  const loadTickets = () => {
    const mockTickets = [
      {
        id: 'TKT-001',
        title: 'Login Issue',
        description: 'Unable to login to the system with correct credentials',
        category: 'Technical',
        priority: 'High',
        status: 'open',
        assignee: 'John Doe',
        reporter: 'Alice Smith',
        createdAt: '2024-01-15',
        dueDate: '2024-01-18',
        lastUpdated: '2024-01-16'
      },
      {
        id: 'TKT-002',
        title: 'Password Reset Request',
        description: 'Need to reset my password for email account',
        category: 'Account',
        priority: 'Medium',
        status: 'in-progress',
        assignee: 'Jane Smith',
        reporter: 'Bob Johnson',
        createdAt: '2024-01-14',
        dueDate: '2024-01-17',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'TKT-003',
        title: 'Mobile App Crash',
        description: 'Application crashes when opening settings page on iOS',
        category: 'Bug',
        priority: 'High',
        status: 'open',
        assignee: 'Mike Wilson',
        reporter: 'Sarah Davis',
        createdAt: '2024-01-16',
        dueDate: '2024-01-20',
        lastUpdated: '2024-01-16'
      },
      {
        id: 'TKT-004',
        title: 'Feature Request - Dark Mode',
        description: 'Add dark mode theme to the application',
        category: 'Enhancement',
        priority: 'Low',
        status: 'resolved',
        assignee: 'Tom Brown',
        reporter: 'Emma Wilson',
        createdAt: '2024-01-10',
        dueDate: '2024-01-25',
        lastUpdated: '2024-01-12'
      }
    ];
    setTickets(mockTickets);
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

 

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleEditTicket = (ticket) => {
    // router.push(`/tickets/edit-ticket?id=${ticket.id}`);
  };

  const handleDeleteClick = (ticket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (ticketToDelete) {
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketToDelete.id));
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

  const DesktopTableView = () => (
    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.light' }}>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
              Ticket ID
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
              Title & Description
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
              Category
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
              Priority
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
              Assignee
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
              Created
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem', textAlign: 'center' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTickets.map((ticket, index) => (
            <TableRow 
              key={index}
              hover
              sx={{ 
                cursor: 'pointer',
                '&:last-child td, &:last-child th': { border: 0 }
              }}
              onClick={() => handleViewTicket(ticket)}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="600" color="primary">
                  {ticket.id}
                </Typography>
              </TableCell>
              <TableCell sx={{ maxWidth: 300 }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600" noWrap>
                    {ticket.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {ticket.description}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={ticket.category}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={ticket.priority}
                  size="small"
                  color={getPriorityColor(ticket.priority)}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={ticket.status.replace('-', ' ')}
                  size="small"
                  color={getStatusColor(ticket.status)}
                  variant="filled"
                />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                    {getInitials(ticket.assignee)}
                  </Avatar>
                  <Typography variant="body2">
                    {ticket.assignee}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(ticket.createdAt)}
                </Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" justifyContent="center" gap={1}>
                  <Tooltip title="View">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewTicket(ticket);
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTicket(ticket);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
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
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'grey.50', 
      py: { xs: 2, md: 2 },
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
   
        <Box sx={{ mb: 3 }}>
          
          <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <Box>
              <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/tickets/ticket-dashboard')}
            sx={{ 
              mb: 2,
              fontWeight: '600',
              color: 'primary.main'
            }}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
              <Typography 
                variant={isSmallMobile ? "h5" : "h4"} 
                component="h1" 
                fontWeight="bold" 
                // gutterBottom
              >
                All Tickets
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage all tickets in the system
              </Typography>
            </Box>
            <Button 
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/tickets/create-tickets')}
              size={isSmallMobile ? "small" : "medium"}
            >
              {isSmallMobile ? 'New' : 'New Ticket'}
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={2} alignItems="flex-end">
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

              <Grid item xs={12} sm={4} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  size="small"
                >
                  More Filters
                </Button>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {filteredTickets.length} tickets found
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {isMobile ? (
          <Box>
            {filteredTickets.map((ticket, index) => (
              <MobileTicketCard key={index} ticket={ticket} />
            ))}
          </Box>
        ) : (
          <DesktopTableView />
        )}

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
                  onClick={() => router.push('/tickets/create-tickets')}
                >
                  Create Your First Ticket
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {isMobile && (
          <Fab
            color="primary"
            aria-label="add ticket"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={() => router.push('/tickets/create-tickets')}
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

        <Dialog
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Ticket Details</Typography>
              <IconButton onClick={() => setSelectedTicket(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedTicket && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight="600">
                    {selectedTicket.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedTicket.description}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Ticket ID
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {selectedTicket.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={selectedTicket.status.replace('-', ' ')}
                      color={getStatusColor(selectedTicket.status)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Priority
                    </Typography>
                    <Chip
                      label={selectedTicket.priority}
                      color={getPriorityColor(selectedTicket.priority)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Category
                    </Typography>
                    <Typography variant="body1">
                      {selectedTicket.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Assignee
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                        {getInitials(selectedTicket.assignee)}
                      </Avatar>
                      <Typography variant="body1">
                        {selectedTicket.assignee}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Reporter
                    </Typography>
                    <Typography variant="body1">
                      {selectedTicket.reporter}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Created Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedTicket.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Due Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedTicket.dueDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedTicket(null)}>
              Close
            </Button>
            <Button 
              variant="contained" 
              onClick={() => selectedTicket && handleEditTicket(selectedTicket)}
            >
              Edit Ticket
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AllTicketsPage;