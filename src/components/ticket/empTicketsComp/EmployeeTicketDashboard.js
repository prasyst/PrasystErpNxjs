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
  Fade,
  LinearProgress,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Circle as CircleIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  OpenInNew as OpenInNewIcon,
  AccessTime as AccessTimeIcon,
  ErrorOutline as ErrorOutlineIcon
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
          dueDate: tkt.ASSIGNDT || tkt.TKTDATE,
          responseTime: "2h", // Mock data
          lastUpdated: new Date().toISOString()
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
      bgColor: alpha('#3b82f6', 0.08),
      path: '/emp-tickets/all-tickets',
      trend: '+12%'
    },
    {
      title: 'Open',
      value: stats.open,
      icon: FaExclamationTriangle,
      color: '#ef4444',
      bgColor: alpha('#ef4444', 0.08),
      path: '/emp-tickets/all-tickets?status=open',
      trend: '+5%'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: MdSchedule,
      color: '#f59e0b',
      bgColor: alpha('#f59e0b', 0.08),
      path: '/emp-tickets/all-tickets?status=in-progress',
      trend: '+8%'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: MdCheckCircleOutline,
      color: '#10b981',
      bgColor: alpha('#10b981', 0.08),
      path: '/emp-tickets/all-tickets?status=resolved',
      trend: '+15%'
    }
  ];

  const userModules = [
    {
      title: 'New Ticket',
      description: 'Create a new support ticket',
      icon: MdAdd,
      path: '/emp-tickets/create-tickets',
      color: '#10b981',
      bgColor: alpha('#10b981', 0.1)
    },
    {
      title: 'My Tickets',
      description: 'View all your tickets',
      icon: MdPerson,
      path: '/emp-tickets/all-tickets',
      color: '#3b82f6',
      bgColor: alpha('#3b82f6', 0.1)
    },
    {
      title: 'Track Ticket',
      description: 'Track ticket status',
      icon: MdList,
      // path: '/emp-tickets/track-ticket',
      color: '#8b5cf6',
      bgColor: alpha('#8b5cf6', 0.1)
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
      month: isMobile ? 'short' : 'short',
      year: 'numeric'
    });
  };

  const StatusBadge = ({ status }) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.25,
        borderRadius: 20,
        bgcolor: `${getStatusColor(status)}15`,
        color: getStatusColor(status),
        fontSize: isMobile ? '0.65rem' : '0.7rem',
        fontWeight: 600,
        textTransform: 'capitalize',
        border: `1px solid ${getStatusColor(status)}30`
      }}
    >
      <CircleIcon sx={{ fontSize: 6, mr: 0.5 }} />
      {status.replace('-', ' ')}
    </Box>
  );

  const PriorityBadge = ({ priority }) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.25,
        borderRadius: 20,
        bgcolor: `${getPriorityColor(priority)}15`,
        color: getPriorityColor(priority),
        fontSize: isMobile ? '0.65rem' : '0.7rem',
        fontWeight: 600,
        border: `1px solid ${getPriorityColor(priority)}30`
      }}
    >
      <CircleIcon sx={{ fontSize: 6, mr: 0.5 }} />
      {priority}
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      p: { xs: 0, sm: 1, md: 2 },
      overflowX: 'hidden'
    }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: { xs: 0, sm: 1 },
          bgcolor: 'white',
          p: { xs: 1.5, sm: 2 },
          mb: { xs: 0.5, sm: 1 },
          borderBottom: { xs: '1px solid', xsBorderColor: 'divider', sm: 'none' }
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1.5, sm: 2 }
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="bold" 
              color="primary.main"
              gutterBottom={!isMobile}
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.5rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TiTicket size={isMobile ? 20 : 24} />
              My Ticket Dashboard
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'block',
                fontSize: { xs: '0.75rem', sm: '0.8rem' }
              }}
            >
              Manage and track your support tickets
            </Typography>
          </Box>
          
          <Stack 
            direction="row" 
            spacing={1}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'space-between', sm: 'flex-end' }
            }}
          >
            <IconButton
              size={isMobile ? "small" : "medium"}
              onClick={fetchMyTickets}
              disabled={loading}
              sx={{
                bgcolor: 'grey.100',
                '&:hover': { bgcolor: 'grey.200' }
              }}
            >
              <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <Button
              variant="contained"
              size={isMobile ? "small" : "medium"}
              startIcon={<AddIcon />}
              onClick={() => router.push('/emp-tickets/create-tickets')}
              sx={{
                minWidth: { xs: 'auto', sm: 120 },
                px: { xs: 1.5, sm: 2 },
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {isMobile ? 'New' : 'New Ticket'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1, sm: 1 } }}>
        <Grid container spacing={1} mb={2}>
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Grid item xs={6} sm={3} key={index}>
                <Fade in={true} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      height: '100%',
                      width:'140px',
                      minHeight: { xs: 80, sm: 90 },
                      bgcolor: 'white',
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: stat.color,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => router.push(stat.path)}
                  >
                    <CardContent sx={{ 
                      p: { xs: 1, sm: 1.5 }, 
                      pb: { xs: 1, sm: 1.5 } 
                    }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '100%'
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              fontWeight: 500,
                              display: 'block'
                            }}
                            gutterBottom
                          >
                            {stat.title}
                          </Typography>
                          <Typography 
                            variant={isMobile ? "h6" : "h5"} 
                            fontWeight="bold"
                            lineHeight={1}
                            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color={stat.color}
                            sx={{ 
                              fontSize: '0.6rem',
                              fontWeight: 600,
                              display: { xs: 'none', sm: 'block' }
                            }}
                          >
                            {stat.trend}
                          </Typography>
                        </Box>
                        <Box sx={{
                          p: { xs: 0.5, sm: 0.75 },
                          borderRadius: '50%',
                          bgcolor: stat.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <IconComponent 
                            size={isMobile ? 16 : 18} 
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

        <Box mb={2}>
          <Typography 
            variant={isMobile ? "subtitle2" : "subtitle1"} 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              px: { xs: 0.5, sm: 0 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              color: 'text.primary'
            }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={1}>
            {userModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <Grid item xs={12} sm={4} key={index}>
                  <Fade in={true} timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card
                      elevation={0}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        height: '100%',
                        bgcolor: 'white',
                        '&:hover': {
                          boxShadow: 3,
                          borderColor: module.color,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => router.push(module.path)}
                    >
                      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            sx={{
                              width: { xs: 32, sm: 36 },
                              height: { xs: 32, sm: 36 },
                              bgcolor: module.bgColor,
                              color: module.color
                            }}
                          >
                            <IconComponent size={isMobile ? 16 : 18} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              lineHeight={1.2}
                              sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                            >
                              {module.title}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                fontSize: '0.7rem',
                                display: { xs: 'none', sm: 'block' }
                              }}
                            >
                              {module.description}
                            </Typography>
                          </Box>
                          <ArrowForwardIcon 
                            sx={{ 
                              fontSize: { xs: 14, sm: 16 },
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
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            mb: 2,
            overflow: 'hidden',
            bgcolor: 'white'
          }}
        >
          <Box sx={{
            p: { xs: 1, sm: 1.5 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'grey.50'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TiTicket size={18} />
              <Typography variant="subtitle2" fontWeight="bold">
                Recent Tickets
              </Typography>
              <Chip 
                label={tickets.length}
                size="small"
                sx={{ height: 20, fontSize: '0.65rem' }}
              />
            </Box>
            <Button
              size="small"
              endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
              onClick={() => router.push('/emp-tickets/all-tickets')}
              sx={{ minWidth: 'auto', fontSize: '0.75rem' }}
            >
              {isMobile ? 'All' : 'View All'}
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress size={24} sx={{ mb: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Loading tickets...
              </Typography>
            </Box>
          ) : tickets.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
              <ErrorOutlineIcon sx={{ fontSize: 32, color: 'grey.400', mb: 1 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                No tickets found
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => router.push('/emp-tickets/create-tickets')}
                sx={{ mt: 0.5, fontSize: '0.75rem' }}
              >
                Create First Ticket
              </Button>
            </Box>
          ) : isMobile ? (
            <Box>
              {tickets.slice(0, 5).map((ticket, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:last-child': { borderBottom: 0 }
                  }}
                  onClick={() => router.push(`/emp-tickets/ticket-detail/${ticket.id}`)}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={0.5}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5}>
                        <Typography 
                          variant="caption" 
                          fontWeight="bold" 
                          color="primary.main"
                          sx={{ fontSize: '0.7rem' }}
                        >
                          #{ticket.id}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                          <PriorityBadge priority={ticket.priority} />
                        </Box>
                      </Stack>
                      
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        sx={{ 
                          fontSize: '0.8rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 0.5
                        }}
                      >
                        {ticket.title}
                      </Typography>
                      
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeIcon sx={{ fontSize: 10, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {formatDate(ticket.createdAt)}
                          </Typography>
                        </Stack>
                        <StatusBadge status={ticket.status} />
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', py: 0.75, width: '15%' }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', py: 0.75, width: '30%' }}>
                      Title
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', py: 0.75, width: '15%' }}>
                      Priority
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', py: 0.75, width: '15%' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', py: 0.75, width: '15%' }}>
                      Created
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', py: 0.75, width: '10%' }}>
                      Action
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
                        '&:hover': { bgcolor: 'action.hover' },
                        height: 48
                      }}
                    >
                      <TableCell sx={{ py: 0.75 }}>
                        <Typography variant="caption" fontWeight="medium" color="primary.main">
                          #{ticket.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0.75 }}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                            {ticket.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem' }}>
                            {ticket.category}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 0.75 }}>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell sx={{ py: 0.75 }}>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell sx={{ py: 0.75 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(ticket.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0.75 }}>
                        <Tooltip title="View" arrow>
                          <IconButton
                            size="small"
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   router.push(`/emp-tickets/ticket-detail/${ticket.id}`);
                            // }}
                            sx={{ p: 0.5 }}
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
        </Card>

        <Grid container spacing={1}>
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                height: '100%',
                bgcolor: 'white'
              }}
            >
              <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Status Distribution
                </Typography>
                <Stack spacing={0.75} mt={1}>
                  {[
                    { status: 'Open', count: stats.open, color: '#ef4444', icon: FaExclamationTriangle },
                    { status: 'In Progress', count: stats.inProgress, color: '#f59e0b', icon: MdSchedule },
                    { status: 'Resolved', count: stats.resolved, color: '#10b981', icon: MdCheckCircleOutline },
                    { status: 'Closed', count: stats.closed, color: '#6b7280', icon: MdCheckCircleOutline }
                  ].map((item, index) => {
                    const percentage = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                    const IconComponent = item.icon;
                    return (
                      <Box key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.5
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <IconComponent size={12} style={{ color: item.color }} />
                            <Typography variant="caption" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>
                              {item.status}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                            {item.count} ({percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: `${item.color}20`,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: item.color,
                              borderRadius: 2
                            }
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'primary.light',
                borderRadius: 1,
                bgcolor: alpha('#3b82f6', 0.03),
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha('#3b82f6', 0.1),
                  zIndex: 0
                }}
              />
              <CardContent sx={{ p: { xs: 1, sm: 1.5 }, position: 'relative', zIndex: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary.main">
                  Need Help?
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  paragraph
                  sx={{ fontSize: '0.75rem', mb: 1.5 }}
                >
                  Having issues with your tickets?
                </Typography>
                <Stack spacing={1} mb={2}>
                  {[
                    'Check ticket status in "My Tickets"',
                    'Raise new ticket for any issue',
                    'Contact support for urgent matters'
                  ].map((item, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                      <CircleIcon sx={{ fontSize: 6, color: 'primary.main', mt: 0.5 }} />
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', flex: 1 }}>
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={() => router.push('/emp-tickets/create-tickets')}
                  sx={{ 
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                    fontSize: '0.75rem',
                    py: 0.5
                  }}
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