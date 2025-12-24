'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdAdd, MdPerson, MdList, MdCheckCircleOutline,
  MdWarning, MdRefresh, MdAnalytics, MdSchedule
} from 'react-icons/md';
import { FaExclamationTriangle } from 'react-icons/fa';
import { TiTicket } from 'react-icons/ti';
import axiosInstance from '@/lib/axios';

import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Circle as CircleIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const EmployeeTicketDashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchMyTickets = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("TrnTkt/GetTrnTktDashBoard", {
        SearchText: ""
      });

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        const myTickets = response.data.DATA.map(tkt => ({
          id: tkt.TKTNO,
          title: tkt.REMARK || "No Title",
          description: tkt.TKTDESC || "No description",
          category: tkt.TKTSERVICENAME || "General",
          priority: tkt.TKTSVRTYNAME || "Medium",
          status: tkt.TKTSTATUS === "O" ? "open" :
            tkt.TKTSTATUS === "P" ? "in-progress" :
              tkt.TKTSTATUS === "R" ? "resolved" : "closed",
          assignee: tkt.TECHEMP_NAME || "Unassigned",
          createdAt: tkt.TKTDATE,
          dueDate: tkt.ASSIGNDT || tkt.TKTDATE
        }));

        setTickets(myTickets);
        const statsData = {
          total: myTickets.length,
          open: myTickets.filter(t => t.status === 'open').length,
          inProgress: myTickets.filter(t => t.status === 'in-progress').length,
          resolved: myTickets.filter(t => t.status === 'resolved').length,
          closed: myTickets.filter(t => t.status === 'closed').length
        };
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const quickStats = [
    {
      title: 'My Tickets',
      value: stats.total,
      icon: TiTicket,
      color: '#3b82f6',
      path: '/emp-tickets/all-tickets'
    },
    {
      title: 'Open',
      value: stats.open,
      icon: FaExclamationTriangle,
      color: '#f59e0b',
      path: '/emp-tickets/all-tickets?status=open'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: MdSchedule,
      color: '#8b5cf6',
      path: '/emp-tickets/all-tickets?status=in-progress'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: MdCheckCircleOutline,
      color: '#10b981',
      path: '/emp-tickets/all-tickets?status=resolved'
    }
  ];

  const userModules = [
    {
      title: 'Raise New Ticket',
      description: 'Create a new support ticket',
      icon: MdAdd,
      path: '/emp-tickets/create-tickets',
      color: '#10b981'
    },
    {
      title: 'My Tickets',
      description: 'View all your tickets',
      icon: MdPerson,
      path: '/emp-tickets/all-tickets',
      color: '#3b82f6'
    },
    {
      title: 'Track Ticket',
      description: 'Track ticket status',
      icon: MdList,
      path: '/emp-tickets/track-ticket',
      color: '#8b5cf6'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#ef4444';
      case 'in-progress': return '#f59e0b';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: isMobile ? 'numeric' : 'short',
      year: isMobile ? '2-digit' : 'numeric'
    });
  };

  const StatusBadge = ({ status }) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: isMobile ? 0.75 : 1,
        py: 0.25,
        borderRadius: 6,
        bgcolor: `${getStatusColor(status)}15`,
        color: getStatusColor(status),
        fontSize: isMobile ? '0.65rem' : '0.75rem',
        fontWeight: 600,
        textTransform: 'capitalize',
        minWidth: isMobile ? 60 : 80
      }}
    >
      <CircleIcon sx={{ fontSize: 8, mr: 0.5 }} />
      {status.replace('-', ' ')}
    </Box>
  );

  const PriorityBadge = ({ priority }) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: isMobile ? 0.75 : 1,
        py: 0.25,
        borderRadius: 6,
        bgcolor: `${getPriorityColor(priority)}15`,
        color: getPriorityColor(priority),
        fontSize: isMobile ? '0.65rem' : '0.75rem',
        fontWeight: 600
      }}
    >
      {priority}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: { xs: 1, sm: 2 } }}>
      {/* Header - Compact */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          bgcolor: 'white',
          p: { xs: 2, sm: 2.5 },
          mb: { xs: 1, sm: 1 }
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="bold" 
              gutterBottom={!isMobile}
            >
              My Ticket Dashboard
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Manage and track your support tickets
            </Typography>
          </Box>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={1}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              startIcon={<RefreshIcon />}
              onClick={fetchMyTickets}
              disabled={loading}
              fullWidth={isMobile}
            >
              {isMobile ? 'Refresh' : 'Refresh'}
            </Button>
            <Button
              variant="contained"
              size={isMobile ? "small" : "medium"}
              startIcon={<AddIcon />}
              onClick={() => router.push('/emp-tickets/create-tickets')}
              fullWidth={isMobile}
            >
              New Ticket
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, sm: 1 } }}>
        {/* Quick Stats - Compact Grid */}
        <Grid container spacing={1.5} mb={2}>
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Grid item xs={6} sm={3} key={index}>
                <Fade in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: 'grey.200',
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      height: '100%',
                      minHeight: 90,
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: stat.color,
                        transform: 'translateY(-1px)'
                      }
                    }}
                    onClick={() => router.push(stat.path)}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: 2 } }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        height: '100%'
                      }}>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              fontWeight: 500
                            }}
                            gutterBottom
                          >
                            {stat.title}
                          </Typography>
                          <Typography 
                            variant={isMobile ? "h6" : "h5"} 
                            fontWeight="bold"
                            lineHeight={1}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box sx={{
                          p: { xs: 0.75, sm: 1 },
                          borderRadius: '50%',
                          bgcolor: `${stat.color}15`
                        }}>
                          <IconComponent 
                            size={isMobile ? 18 : 20} 
                            style={{ color: stat.color }} 
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick Actions - Compact Cards */}
        <Box mb={2}>
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            fontWeight="bold" 
            gutterBottom
            sx={{ px: { xs: 1, sm: 0 } }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={1.5}>
            {userModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Fade in={true} timeout={500} style={{ transitionDelay: `${index * 150}ms` }}>
                    <Card
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: 'grey.200',
                        borderRadius: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        height: '100%',
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: module.color,
                          transform: 'translateY(-1px)'
                        }
                      }}
                      onClick={() => router.push(module.path)}
                    >
                      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: { xs: 36, sm: 40 },
                              height: { xs: 36, sm: 40 },
                              bgcolor: module.color,
                              color: 'white'
                            }}
                          >
                            <IconComponent size={isMobile ? 18 : 20} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant={isMobile ? "body2" : "subtitle2"} 
                              fontWeight="bold"
                              lineHeight={1.2}
                              gutterBottom={!isMobile}
                            >
                              {module.title}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                display: { xs: 'none', sm: 'block' }
                              }}
                            >
                              {module.description}
                            </Typography>
                          </Box>
                          <ArrowForwardIcon 
                            sx={{ 
                              fontSize: { xs: 16, sm: 20 },
                              color: 'action.active'
                            }} 
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Card
          elevation={0}
          sx={{
            border: 1,
            borderColor: 'grey.200',
            borderRadius: 1.5,
            mb: 3,
            overflow: 'hidden'
          }}
        >
          <Box sx={{
            p: { xs: 1.5, sm: 2 },
            borderBottom: 1,
            borderColor: 'grey.200',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'grey.50'
          }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">
              Recent Tickets
            </Typography>
            <Button
              size={isMobile ? "small" : "medium"}
              endIcon={<ArrowForwardIcon />}
              onClick={() => router.push('/emp-tickets/all-tickets')}
            >
              {isMobile ? 'View All' : 'View All'}
            </Button>
          </Box>

          {isMobile ? (
            // Mobile List View
            <Box>
              {tickets.slice(0, 5).map((ticket, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1.5,
                    borderBottom: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:last-child': { borderBottom: 0 }
                  }}
                  onClick={() => router.push(`/emp-tickets/ticket-detail/${ticket.id}`)}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="caption" 
                        fontWeight="bold" 
                        color="primary.main"
                        display="block"
                        gutterBottom
                      >
                        #{ticket.id}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {ticket.title}
                      </Typography>
                 
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </Box>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Created: {formatDate(ticket.createdAt)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            // Desktop Table View
            <TableContainer>
              <Table size={isTablet ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5 }}>
                      Ticket No
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5 }}>
                      Title
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5 }}>
                      Priority
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5 }}>
                      Created
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.slice(0, 5).map((ticket, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" fontWeight="medium" color="primary.main">
                          #{ticket.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium" gutterBottom>
                            {ticket.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {ticket.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(ticket.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/emp-tickets/ticket-detail/${ticket.id}`)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tickets.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
              <TiTicket size={isMobile ? 36 : 48} style={{ color: '#e0e0e0', marginBottom: 12 }} />
              <Typography color="text.secondary" gutterBottom>
                No tickets found
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => router.push('/emp-tickets/create-tickets')}
                sx={{ mt: 1 }}
              >
                Create your first ticket
              </Button>
            </Box>
          )}

          {loading && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress size={isMobile ? 30 : 40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Loading tickets...
              </Typography>
            </Box>
          )}
        </Card>

        {/* Status Distribution and Help - Compact Layout */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                border: 1,
                borderColor: 'grey.200',
                borderRadius: 1.5,
                height: '100%'
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom>
                  Status Distribution
                </Typography>
                <Stack spacing={1} mt={1}>
                  {[
                    { status: 'Open', count: stats.open, color: '#ef4444' },
                    { status: 'In Progress', count: stats.inProgress, color: '#f59e0b' },
                    { status: 'Resolved', count: stats.resolved, color: '#10b981' },
                    { status: 'Closed', count: stats.closed, color: '#6b7280' }
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircleIcon sx={{ fontSize: 8, color: item.color }} />
                        <Typography variant="body2" fontWeight="medium">
                          {item.status}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" fontWeight="bold">
                          {item.count}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: '0.7rem' }}
                        >
                          ({stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0}%)
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                border: 1,
                borderColor: 'primary.light',
                borderRadius: 1.5,
                bgcolor: 'primary.50',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" gutterBottom>
                  Need Help?
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  paragraph
                  sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
                >
                  Having issues with your tickets?
                </Typography>
                <Stack spacing={1} mb={2}>
                  {[
                    'Check ticket status in "My Tickets"',
                    'Raise new ticket for any issue',
                    'Contact support for urgent matters'
                  ].map((item, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                      <CircleIcon sx={{ fontSize: 6, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  variant="contained"
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  onClick={() => router.push('/emp-tickets/create-tickets')}
                  sx={{ mt: 1 }}
                >
                  Get Support
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EmployeeTicketDashboard;