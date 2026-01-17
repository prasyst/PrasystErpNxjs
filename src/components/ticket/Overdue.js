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
  Fab,
  Alert,
  Badge,
  alpha
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  Whatshot as WhatshotIcon,
  Error as ErrorIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';

const Overdue = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  useEffect(() => {
    loadOverdueTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [searchTerm, priorityFilter, tickets]);

  const loadOverdueTickets = () => {
    const mockOverdueTickets = [
      {
        id: 'TKT-001',
        title: 'Login Issue - Urgent',
        description: 'Unable to login to the system with correct credentials, affecting multiple users',
        category: 'Technical',
        priority: 'High',
        status: 'open',
        assignee: 'John Doe',
        reporter: 'Alice Smith',
        createdAt: '2024-01-10',
        dueDate: '2024-01-15',
        lastUpdated: '2024-01-16',
        overdueDays: 3,
        slaBreach: true
      },
      {
        id: 'TKT-005',
        title: 'Server Downtime - Critical',
        description: 'Production server is down affecting all services',
        category: 'Infrastructure',
        priority: 'High',
        status: 'in-progress',
        assignee: 'Mike Wilson',
        reporter: 'Admin Team',
        createdAt: '2024-01-12',
        dueDate: '2024-01-14',
        lastUpdated: '2024-01-16',
        overdueDays: 4,
        slaBreach: true
      },
      {
        id: 'TKT-008',
        title: 'Payment Gateway Failure',
        description: 'Payment processing is failing for all transactions',
        category: 'Billing',
        priority: 'High',
        status: 'open',
        assignee: 'Sarah Johnson',
        reporter: 'Finance Team',
        createdAt: '2024-01-13',
        dueDate: '2024-01-16',
        lastUpdated: '2024-01-16',
        overdueDays: 2,
        slaBreach: true
      },
      {
        id: 'TKT-012',
        title: 'Database Connection Timeout',
        description: 'Database connections are timing out frequently',
        category: 'Database',
        priority: 'Medium',
        status: 'open',
        assignee: 'David Brown',
        reporter: 'Dev Team',
        createdAt: '2024-01-14',
        dueDate: '2024-01-17',
        lastUpdated: '2024-01-16',
        overdueDays: 1,
        slaBreach: false
      },
      {
        id: 'TKT-015',
        title: 'Mobile App Performance Issues',
        description: 'App is crashing on iOS devices after latest update',
        category: 'Mobile',
        priority: 'Medium',
        status: 'in-progress',
        assignee: 'Emma Wilson',
        reporter: 'QA Team',
        createdAt: '2024-01-11',
        dueDate: '2024-01-13',
        lastUpdated: '2024-01-16',
        overdueDays: 5,
        slaBreach: true
      }
    ];
    setTickets(mockOverdueTickets);
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

  const getOverdueSeverity = (days) => {
    if (days >= 5) return { color: 'error', label: 'Critical', icon: <WhatshotIcon /> };
    if (days >= 3) return { color: 'warning', label: 'High', icon: <ErrorIcon /> };
    return { color: 'info', label: 'Medium', icon: <WarningIcon /> };
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

  const handleEscalateTicket = (ticket) => {
    console.log('Escalating ticket:', ticket.id);
    alert(`Ticket ${ticket.id} has been escalated to management!`);
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

  // Calculate overdue statistics
  const overdueStats = {
    total: filteredTickets.length,
    critical: filteredTickets.filter(t => t.overdueDays >= 5).length,
    high: filteredTickets.filter(t => t.overdueDays >= 3 && t.overdueDays < 5).length,
    medium: filteredTickets.filter(t => t.overdueDays < 3).length,
    slaBreached: filteredTickets.filter(t => t.slaBreach).length
  };

  // Enhanced Mobile Card View
  const MobileOverdueTicketCard = ({ ticket }) => {
    const overdueSeverity = getOverdueSeverity(ticket.overdueDays);

    return (
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          background: ticket.slaBreach
            ? `linear-gradient(135deg, ${theme.palette.error.main}20 0%, ${theme.palette.error.light}20 100%)`
            : `linear-gradient(135deg, ${theme.palette.warning.main}10 0%, ${theme.palette.warning.light}10 100%)`,
          border: `2px solid ${ticket.slaBreach ? theme.palette.error.main : theme.palette.warning.main}30`,
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(ticket.slaBreach ? theme.palette.error.main : theme.palette.warning.main, 0.15)}`,
            borderColor: ticket.slaBreach ? theme.palette.error.main : theme.palette.warning.main
          }
        }}
        onClick={() => handleViewTicket(ticket)}
      >
        <CardContent sx={{ p: 2.5 }}>
          {/* Header Section */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="subtitle1" fontWeight="800" color="primary" sx={{ fontSize: '1.1rem' }}>
                {ticket.id}
              </Typography>
              <Chip
                label={ticket.category}
                size="small"
                variant="filled"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
            </Box>
            <Badge
              badgeContent={ticket.overdueDays}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  height: 20,
                  minWidth: 20
                }
              }}
            >
              <Chip
                label={overdueSeverity.label}
                size="small"
                color={overdueSeverity.color}
                icon={overdueSeverity.icon}
                sx={{ fontWeight: '700', fontSize: '0.75rem' }}
              />
            </Badge>
          </Box>

          {/* Title and Description */}
          <Typography
            variant="h6"
            fontWeight="700"
            sx={{
              mb: 1.5,
              background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.3
            }}
          >
            {ticket.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {ticket.description}
          </Typography>

          {/* Priority and Status Row */}
          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            <Chip
              label={ticket.priority}
              size="small"
              color={getPriorityColor(ticket.priority)}
              variant="filled"
              sx={{ fontWeight: '600' }}
            />
            <Chip
              label={ticket.status.replace('-', ' ')}
              size="small"
              color={getStatusColor(ticket.status)}
              variant="outlined"
              sx={{ fontWeight: '600' }}
            />
          </Box>

          {/* Assignee and Due Date */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  backgroundColor: 'primary.main'
                }}
              >
                {getInitials(ticket.assignee)}
              </Avatar>
              <Typography variant="caption" fontWeight="600">
                {ticket.assignee.split(' ')[0]}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="caption" color="error.main" fontWeight="800" display="block">
                ⚠️ Due: {formatDate(ticket.dueDate)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created: {formatDate(ticket.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* SLA Breach Warning */}
          {ticket.slaBreach && (
            <Alert
              severity="error"
              sx={{
                mt: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.75rem',
                fontWeight: '600',
                '& .MuiAlert-icon': { fontSize: '1rem' }
              }}
              icon={<PriorityHighIcon />}
            >
              SLA BREACHED - IMMEDIATE ACTION REQUIRED
            </Alert>
          )}

          <Divider sx={{ my: 2, opacity: 0.5 }} />

          {/* Actions */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleViewTicket(ticket);
              }}
              sx={{
                borderRadius: 2,
                fontWeight: '600',
                textTransform: 'none'
              }}
            >
              View Details
            </Button>
            <Box display="flex" gap={0.5}>
              <Tooltip title="Escalate">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: 'warning.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'warning.dark' }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEscalateTicket(ticket);
                  }}
                >
                  <PriorityHighIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
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
                  sx={{
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'error.dark' }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(ticket);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const DesktopOverdueTableView = () => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.error.light}`,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.error.light, 0.02)} 100%)`,
        overflow: 'hidden'
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{
            background: `linear-gradient(45deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            '& th': {
              border: 0,
              fontWeight: '800',
              color: 'white',
              fontSize: '0.9rem',
              py: 1,
              letterSpacing: '0.5px'
            }
          }}>
            <TableCell>Ticket ID</TableCell>
            <TableCell>Title & Description</TableCell>
            <TableCell>Overdues</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTickets.map((ticket, index) => {
            const overdueSeverity = getOverdueSeverity(ticket.overdueDays);

            return (
              <TableRow
                key={index}
                hover
                sx={{
                  cursor: 'pointer',
                  '&:last-child td': { border: 0 },
                  backgroundColor: ticket.slaBreach
                    ? alpha(theme.palette.error.main, 0.04)
                    : 'inherit',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: ticket.slaBreach
                      ? alpha(theme.palette.error.main, 0.08)
                      : alpha(theme.palette.warning.main, 0.04),
                    transform: 'scale(1.002)'
                  }
                }}
                onClick={() => handleViewTicket(ticket)}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor: overdueSeverity.color === 'error'
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.warning.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {overdueSeverity.icon}
                    </Box>
                    <Typography variant="body2" fontWeight="800" color="primary">
                      {ticket.id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="700" noWrap sx={{ mb: 0.5 }}>
                      {ticket.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4
                    }}>
                      {ticket.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Chip
                      label={`${ticket.overdueDays} days`}
                      size="small"
                      color={overdueSeverity.color}
                      sx={{ fontWeight: '700' }}
                    />
                    {ticket.slaBreach && (
                      <Chip
                        label="SLA Breached"
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', fontWeight: '700' }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.priority}
                    size="small"
                    color={getPriorityColor(ticket.priority)}
                    sx={{ fontWeight: '700' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status.replace('-', ' ')}
                    size="small"
                    color={getStatusColor(ticket.status)}
                    sx={{ fontWeight: '700' }}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: 'primary.main'
                    }}>
                      {getInitials(ticket.assignee)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {ticket.assignee}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" color="error.main" fontWeight="800">
                      ⚠️ {formatDate(ticket.dueDate)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created: {formatDate(ticket.createdAt)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={0.5}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'primary.dark' }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTicket(ticket);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Escalate">
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: 'warning.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'warning.dark' }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEscalateTicket(ticket);
                        }}
                      >
                        <PriorityHighIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: 'secondary.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'secondary.dark' }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTicket(ticket);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const StatCard = ({ value, label, color, icon }) => (
    <Card
      sx={{
        textAlign: 'center',
        background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
        color: 'white',
        borderRadius: 3,
        p: 2,
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.3)}`
        }
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
        {icon}
        <Typography variant="h3" fontWeight="800">
          {value}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight="600" sx={{ opacity: 0.9 }}>
        {label}
      </Typography>
    </Card>
  );

  return (
    <Box sx={{
      minHeight: '100vh', py: 3,
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.error.light, 0.05)} 100%)`,
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/tickets/ticket-dashboard')}
            sx={{
              mb: 2,
              borderRadius: 2,
              fontWeight: '600',
              textTransform: 'none'
            }}
            variant="outlined"
          >
            Back to Dashboard
          </Button>

          <Box
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
              borderRadius: 3,
              p: 1,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h3"
              component="h5"
              fontWeight="800"
              gutterBottom
              sx={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontSize: { xs: '.5rem', md: '1rem' }
              }}
            >
              ⚠️ OVERDUE TICKETS
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: '500' }}>
              {filteredTickets.length} tickets require immediate attention
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6, md: 2.4 }}>
            <StatCard
              value={overdueStats.total}
              label="Total Overdue"
              color="error"
              icon={<NotificationsActiveIcon sx={{ fontSize: '2rem' }} />}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2.4 }}>
            <StatCard
              value={overdueStats.critical}
              label="Critical"
              color="error"
              icon={<WhatshotIcon sx={{ fontSize: '2rem' }} />}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2.4 }}>
            <StatCard
              value={overdueStats.high}
              label="High Priority"
              color="warning"
              icon={<ErrorIcon sx={{ fontSize: '2rem' }} />}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2.4 }}>
            <StatCard
              value={overdueStats.medium}
              label="Medium Priority"
              color="info"
              icon={<WarningIcon sx={{ fontSize: '2rem' }} />}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2.4 }}>
            <StatCard
              value={overdueStats.slaBreached}
              label="SLA Breached"
              color="secondary"
              icon={<PriorityHighIcon sx={{ fontSize: '2rem' }} />}
            />
          </Grid>
        </Grid>

        <Card
          sx={{
            mb: 2,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            p: 3
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 6, md: 6 }}>
              <TextField
                fullWidth
                placeholder="🔍 Search overdue tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontWeight: '500'
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                select
                label="Priority Filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontWeight: '500'
                  }
                }}
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<FilterListIcon />}
                size="small"
                sx={{
                  borderRadius: 2,
                  fontWeight: '700',
                  textTransform: 'none',
                  py: 1
                }}
              >
                Advanced Filters
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Tickets List Section */}
        {isMobile ? (
          <Box>
            {filteredTickets.map((ticket, index) => (
              <MobileOverdueTicketCard key={index} ticket={ticket} />
            ))}
          </Box>
        ) : (
          <DesktopOverdueTableView />
        )}

        {filteredTickets.length === 0 && (
          <Card
            sx={{
              textAlign: 'center',
              py: 8,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.success.light}10 0%, ${theme.palette.success.main}10 100%)`,
              border: `2px solid ${theme.palette.success.main}30`
            }}
          >
            <CardContent>
              <ScheduleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="800" color="success.main">
                🎉 No Overdue Tickets!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: '500' }}>
                {searchTerm || priorityFilter !== 'all'
                  ? 'No overdue tickets match your search criteria.'
                  : 'Excellent! All tickets are currently on schedule.'
                }
              </Typography>
              <Button
                variant="contained"
                color="success"
                size="large"
                sx={{
                  borderRadius: 2,
                  fontWeight: '700',
                  textTransform: 'none',
                  px: 4
                }}
                onClick={() => router.push('/tickets/all-tickets')}
              >
                View All Tickets
              </Button>
            </CardContent>
          </Card>
        )}

        {isMobile && filteredTickets.length > 0 && (
          <Fab
            color="error"
            aria-label="escalate all"
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              fontWeight: 'bold'
            }}
            onClick={() => alert('Escalating all critical tickets...')}
          >
            <PriorityHighIcon />
          </Fab>
        )}


        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ backgroundColor: 'error.main', color: 'white' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="700">
                🗑️ Confirm Delete
              </Typography>
              <IconButton onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="body1" fontWeight="500">
              Are you sure you want to delete overdue ticket <strong>{ticketToDelete?.id}</strong>?
            </Typography>
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              This action cannot be undone!
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 2, fontWeight: '600' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              sx={{ borderRadius: 2, fontWeight: '600' }}
            >
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>


      </Container>
    </Box>
  );
};

export default Overdue;