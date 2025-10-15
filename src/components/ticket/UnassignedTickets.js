'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  alpha
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  AutoAwesome as AutoAwesomeIcon,
  Group as GroupIcon
} from '@mui/icons-material';

const UnassignedTickets = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState([]);

  const availableAgents = [
    { id: 'agent-1', name: 'John Doe', role: 'Senior Support', currentLoad: 12 },
    { id: 'agent-2', name: 'Jane Smith', role: 'Customer Service', currentLoad: 8 },
    { id: 'agent-3', name: 'Mike Wilson', role: 'Technical Support', currentLoad: 15 }
  ];

  useEffect(() => {
    loadUnassignedTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [searchTerm, priorityFilter, categoryFilter, tickets]);

  const loadUnassignedTickets = () => {
    const mockTickets = [
      {
        id: 'TKT-101',
        title: 'Login Issue - Cannot access account',
        description: 'User cannot login to their account despite correct credentials',
        category: 'Technical',
        priority: 'High',
        reporter: 'Alice Johnson',
        createdAt: '2024-01-16T08:30:00',
        dueDate: '2024-01-18',
        waitTime: '2 hours',
        slaStatus: 'At Risk'
      },
      {
        id: 'TKT-102',
        title: 'Invoice not received',
        description: 'Customer did not receive invoice for December services',
        category: 'Billing',
        priority: 'Medium',
        reporter: 'Bob Smith',
        createdAt: '2024-01-16T09:15:00',
        dueDate: '2024-01-19',
        waitTime: '1.5 hours',
        slaStatus: 'On Track'
      },
      {
        id: 'TKT-103',
        title: 'Feature Request - Dark Mode',
        description: 'Add dark mode theme to mobile application',
        category: 'Feature Request',
        priority: 'Low',
        reporter: 'Carol Davis',
        createdAt: '2024-01-16T07:45:00',
        dueDate: '2024-01-25',
        waitTime: '3 hours',
        slaStatus: 'On Track'
      }
    ];
    setTickets(mockTickets);
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    setFilteredTickets(filtered);
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
    // setSelectedTicket(ticket);
  };

  const handleAssignClick = (ticket) => {
    setSelectedTicket(ticket);
    setAssignDialogOpen(true);
  };

  const handleAssignConfirm = () => {
    if (selectedTicket) {
      setTickets(prev => prev.filter(ticket => ticket.id !== selectedTicket.id));
      alert(`Ticket ${selectedTicket.id} assigned successfully!`);
      setAssignDialogOpen(false);
      setSelectedTicket(null);
    }
  };

  const handleTicketSelect = (ticketId) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const stats = {
    total: tickets.length,
    highPriority: tickets.filter(t => t.priority === 'High').length,
    waitingOver2Hours: tickets.filter(t => t.waitTime.includes('2')).length
  };

  const MobileTicketCard = ({ ticket }) => (
    <Card 
      sx={{ 
        mb: 2,
        border: '2px solid',
        borderColor: 'warning.light',
        backgroundColor: alpha(theme.palette.warning.light, 0.05),
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
          borderColor: 'warning.main'
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="700" color="primary.main">
              {ticket.id}
            </Typography>
            <Chip 
              label="Unassigned" 
              size="small" 
              color="warning" 
              sx={{ 
                mt: 0.5,
                fontWeight: '600',
                fontSize: '0.7rem'
              }} 
            />
          </Box>
          <Chip
            label={ticket.waitTime}
            size="small"
            color="info"
            variant="outlined"
            sx={{ fontWeight: '600' }}
          />
        </Box>
        
        <Typography variant="h6" fontWeight="700" gutterBottom color="text.primary">
          {ticket.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
          {ticket.description}
        </Typography>

        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip
            label={ticket.priority}
            size="small"
            color={getPriorityColor(ticket.priority)}
            sx={{ fontWeight: '600' }}
          />
          <Chip
            label={ticket.category}
            size="small"
            variant="outlined"
            color="primary"
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar 
              sx={{ 
                width: 28, 
                height: 28, 
                fontSize: '0.7rem',
                bgcolor: 'primary.main',
                fontWeight: '600'
              }}
            >
              {getInitials(ticket.reporter)}
            </Avatar>
            <Typography variant="body2" fontWeight="600" color="text.primary">
              {ticket.reporter}
            </Typography>
          </Box>
          <Typography variant="caption" fontWeight="600" color="text.secondary">
            Due: {ticket.dueDate}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button 
            size="small" 
            startIcon={<VisibilityIcon />}
            sx={{ 
              fontWeight: '600',
              color: 'primary.main'
            }}
          >
            View
          </Button>
          <Box display="flex" gap={1}>
            <Tooltip title="Assign Ticket">
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'warning.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'warning.dark'
                  }
                }}
              >
                <AssignmentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Auto Assign">
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'success.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'success.dark'
                  }
                }}
              >
                <AutoAwesomeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const DesktopTableView = () => (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden'
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ 
            backgroundColor: 'primary.main',
            '& th': {
              color: 'white',
              fontWeight: '700',
              fontSize: '0.95rem',
              padding: '16px 12px'
            }
          }}>
            <TableCell padding="checkbox">
              <Checkbox
                sx={{ color: 'white' }}
                indeterminate={selectedTickets.length > 0 && selectedTickets.length < filteredTickets.length}
                checked={selectedTickets.length === filteredTickets.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTickets(filteredTickets.map(t => t.id));
                  } else {
                    setSelectedTickets([]);
                  }
                }}
              />
            </TableCell>
            <TableCell>Ticket ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Reporter</TableCell>
            <TableCell>Wait Time</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow 
              key={ticket.id}
              hover
              sx={{ 
                cursor: 'pointer',
                backgroundColor: selectedTickets.includes(ticket.id) ? 
                  alpha(theme.palette.primary.light, 0.1) : 'inherit',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.light, 0.05)
                }
              }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedTickets.includes(ticket.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleTicketSelect(ticket.id);
                  }}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="700" color="primary.main">
                  {ticket.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                    {ticket.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                    {ticket.description}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={ticket.priority}
                  size="small"
                  color={getPriorityColor(ticket.priority)}
                  sx={{ fontWeight: '600', minWidth: 70 }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={ticket.category}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: '600' }}
                />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      fontSize: '0.8rem',
                      bgcolor: 'primary.main',
                      fontWeight: '600'
                    }}
                  >
                    {getInitials(ticket.reporter)}
                  </Avatar>
                  <Typography variant="body2" fontWeight="600">
                    {ticket.reporter}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={ticket.waitTime}
                  size="small"
                  color="info"
                  sx={{ fontWeight: '600' }}
                />
              </TableCell>
              <TableCell align="center">
                <Box display="flex" justifyContent="center" gap={1}>
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small" 
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Assign Ticket">
                    <IconButton 
                      size="small" 
                      sx={{ 
                        color: 'warning.main',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.warning.main, 0.1)
                        }
                      }}
                    >
                      <AssignmentIcon fontSize="small" />
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50', py: 2 }}>
      <Container maxWidth="xl">

        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
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
          
          <Card 
            sx={{ 
              borderRadius: 3,
              color: 'black',
              boxShadow: 3
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <WarningIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                Unassigned Tickets
              </Typography>
              <Typography variant="h6" fontWeight="600">
                {tickets.length} tickets waiting for assignment
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              textAlign: 'center', 
              backgroundColor: 'primary.main', 
              color: 'white',
              borderRadius: 3,
              boxShadow: 3
            }}>
              <CardContent sx={{ py: 3 }}>
                <Typography variant="h2" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  Total Unassigned
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              textAlign: 'center', 
              backgroundColor: 'error.main', 
              color: 'white',
              borderRadius: 3,
              boxShadow: 3
            }}>
              <CardContent sx={{ py: 3 }}>
                <Typography variant="h2" fontWeight="bold">
                  {stats.highPriority}
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  High Priority
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              textAlign: 'center', 
              backgroundColor: 'info.main', 
              color: 'white',
              borderRadius: 3,
              boxShadow: 3
            }}>
              <CardContent sx={{ py: 3 }}>
                <Typography variant="h2" fontWeight="bold">
                  {stats.waitingOver2Hours}
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  Waiting 2+ Hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Actions */}
        <Card sx={{ 
          mb: 4, 
          p: 3, 
          borderRadius: 3,
          boxShadow: 2
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search tickets by ID or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                select
                label="Priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                select
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Billing">Billing</MenuItem>
                <MenuItem value="Feature Request">Feature Request</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box display="flex" gap={1} justifyContent="flex-end" flexWrap="wrap">
                {selectedTickets.length > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<AssignmentIcon />}
                    sx={{
                      borderRadius: 2,
                      fontWeight: '600',
                      bgcolor: 'warning.main',
                      '&:hover': {
                        bgcolor: 'warning.dark'
                      }
                    }}
                  >
                    Assign Selected ({selectedTickets.length})
                  </Button>
                )}
                <Button
                  variant="contained"
                  startIcon={<AutoAwesomeIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: '600'
                  }}
                >
                  Auto Assign
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Tickets List */}
        {isMobile ? (
          <Box>
            {filteredTickets.map((ticket) => (
              <MobileTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </Box>
        ) : (
          <DesktopTableView />
        )}

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <Card sx={{ 
            textAlign: 'center', 
            py: 8, 
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: alpha(theme.palette.success.light, 0.1)
          }}>
            <CardContent>
              <AssignmentIcon sx={{ 
                fontSize: 64, 
                color: 'success.main', 
                mb: 2 
              }} />
              <Typography variant="h4" gutterBottom color="success.main" fontWeight="bold">
                No Unassigned Tickets!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                All tickets have been assigned to agents.
              </Typography>
              <Button 
                variant="contained"
                size="large"
                onClick={() => router.push('/tickets')}
                sx={{
                  borderRadius: 2,
                  fontWeight: '600',
                  px: 4
                }}
              >
                View All Tickets
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Assign Dialog */}
        <Dialog
          open={assignDialogOpen}
          onClose={() => setAssignDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ 
            backgroundColor: 'primary.main',
            color: 'white',
            fontWeight: 'bold'
          }}>
            Assign Ticket
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            {selectedTicket && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {selectedTicket.id} - {selectedTicket.title}
                  </Typography>
                  <Chip
                    label={selectedTicket.priority}
                    color={getPriorityColor(selectedTicket.priority)}
                    sx={{ mt: 1, fontWeight: '600' }}
                  />
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Assign to Agent</InputLabel>
                  <Select
                    label="Assign to Agent"
                    sx={{ borderRadius: 2 }}
                  >
                    {availableAgents.map((agent) => (
                      <MenuItem key={agent.id} value={agent.id}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32,
                              bgcolor: 'primary.main',
                              fontWeight: '600'
                            }}
                          >
                            {getInitials(agent.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {agent.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {agent.role} • Load: {agent.currentLoad} tickets
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setAssignDialogOpen(false)}
              sx={{ 
                fontWeight: '600',
                borderRadius: 2
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleAssignConfirm}
              sx={{ 
                fontWeight: '600',
                borderRadius: 2
              }}
            >
              Assign Ticket
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default UnassignedTickets;