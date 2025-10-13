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
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="600" color="primary">
              {ticket.id}
            </Typography>
            <Chip label="Unassigned" size="small" color="warning" sx={{ mt: 0.5 }} />
          </Box>
          <Chip
            label={ticket.waitTime}
            size="small"
            color="info"
            variant="outlined"
          />
        </Box>
        
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {ticket.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {ticket.description}
        </Typography>

        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip
            label={ticket.priority}
            size="small"
            color={getPriorityColor(ticket.priority)}
          />
          <Chip
            label={ticket.category}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem' }}>
              {getInitials(ticket.reporter)}
            </Avatar>
            <Typography variant="body2" fontWeight="500">
              {ticket.reporter}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Due: {ticket.dueDate}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button 
            size="small" 
            startIcon={<VisibilityIcon />}
            // onClick={() => handleViewTicket(ticket)}
          >
            View
          </Button>
          <Box display="flex" gap={1}>
            <Tooltip title="Assign Ticket">
              <IconButton 
                size="small" 
                color="primary"
                // onClick={() => handleAssignClick(ticket)}
              >
                <AssignmentIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Auto Assign">
              <IconButton 
                size="small" 
                color="success"
              >
                <AutoAwesomeIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const DesktopTableView = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'warning.light' }}>
            <TableCell padding="checkbox">
              <Checkbox
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
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ticket ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Priority</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Reporter</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Wait Time</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow 
              key={ticket.id}
              hover
              sx={{ cursor: 'pointer' }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedTickets.includes(ticket.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleTicketSelect(ticket.id);
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="600" color="primary">
                  {ticket.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    {ticket.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {ticket.description}
                  </Typography>
                </Box>
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
                  label={ticket.category}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                    {getInitials(ticket.reporter)}
                  </Avatar>
                  <Typography variant="body2">
                    {ticket.reporter}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={ticket.waitTime}
                  size="small"
                  color="info"
                />
              </TableCell>
              <TableCell align="center">
                <Box display="flex" justifyContent="center" gap={1}>
                  <Tooltip title="View">
                    <IconButton 
                      size="small" 
                      color="primary"
                    //   onClick={() => handleViewTicket(ticket)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Assign">
                    <IconButton 
                      size="small" 
                      color="warning"
                    //   onClick={() => handleAssignClick(ticket)}
                    >
                      <AssignmentIcon />
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

        <Box sx={{ mb: 1 }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/tickets/ticket-dashboard')}
            sx={{ mb: 2 }}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
          
          <Box 
            sx={{ 
              backgroundColor: 'warning.main',
              borderRadius: 2,
              p: 1,
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" component="h5" fontWeight="bold" gutterBottom>
              ⚠️ Unassigned Tickets
            </Typography>
            <Typography variant="p">
              {tickets.length} tickets waiting for assignment
            </Typography>
          </Box>
        </Box>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography>Total Unassigned</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: 'error.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" fontWeight="bold">
                  {stats.highPriority}
                </Typography>
                <Typography>High Priority</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" fontWeight="bold">
                  {stats.waitingOver2Hours}
                </Typography>
                <Typography>Waiting  2 Hours</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mb: 4, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
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
              >
                <MenuItem value="all">All</MenuItem>
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
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Billing">Billing</MenuItem>
                <MenuItem value="Account">Account</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box display="flex" gap={1} justifyContent="flex-end">
                {selectedTickets.length > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<AssignmentIcon />}
                  >
                    Assign Selected ({selectedTickets.length})
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<AutoAwesomeIcon />}
                >
                  Auto Assign
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {isMobile ? (
          <Box>
            {filteredTickets.map((ticket) => (
              <MobileTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </Box>
        ) : (
          <DesktopTableView />
        )}


        {filteredTickets.length === 0 && (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <AssignmentIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="success.main">
                No Unassigned Tickets!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                All tickets have been assigned to agents.
              </Typography>
              <Button 
                variant="contained"
                onClick={() => router.push('/tickets')}
              >
                View All Tickets
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog
          open={assignDialogOpen}
          onClose={() => setAssignDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Assign Ticket
          </DialogTitle>
          <DialogContent>
            {selectedTicket && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" color="primary">
                    {selectedTicket.id} - {selectedTicket.title}
                  </Typography>
                  <Chip
                    label={selectedTicket.priority}
                    color={getPriorityColor(selectedTicket.priority)}
                    sx={{ mt: 1 }}
                  />
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Assign to Agent</InputLabel>
                  <Select
                    label="Assign to Agent"
                  >
                    {availableAgents.map((agent) => (
                      <MenuItem key={agent.id} value={agent.id}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {getInitials(agent.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {agent.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {agent.role} • Load: {agent.currentLoad}
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
          <DialogActions>
            <Button onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAssignConfirm}>
              Assign Ticket
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default UnassignedTickets;