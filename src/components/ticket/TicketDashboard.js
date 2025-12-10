import React, { useState, useEffect } from 'react';
import {
  MdDashboard, MdAdd, MdList, MdViewList, MdCategory,
  MdSettings, MdTimer, MdAnalytics, MdPerson, MdGroup,
  MdEmail, MdTrendingUp, MdCheckCircle, MdBarChart,
  MdRefresh, MdFilterList, MdSearch, MdDownload,
  MdNotifications, MdSupport, MdWork, MdAssignment,
  MdSchedule, MdWarning, MdCheckCircleOutline, MdClose
} from 'react-icons/md';
import {
  ArrowBack as ArrowBackIcon,

} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Box,
  Grid,
  IconButton,
  Stack,
  Paper,
  LinearProgress
} from '@mui/material';
import axiosInstance from '@/lib/axios';
import { FaExclamationTriangle, FaUsers, FaChartPie } from 'react-icons/fa';
import { TiTicket } from "react-icons/ti";


import CreateTicket from './raiseTicket/CreateTicket';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import TicketCategories from './TicketCategories';
import TicketPriorities from './TicketPriorities';
import TicketStatus from './TicketStatus';
import TicketReports from './TicketReports';
import { useRouter } from 'next/navigation';

const TicketDashboard = () => {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('overview');
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    overdue: 0
  });


  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchRecentTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        SearchText: ""
      };

      const response = await axiosInstance.post(
        "TrnTkt/GetTrnTktDashBoard",
        payload
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
              tkt.TKTSTATUS === "R" ? "resolved" : "closed",
          assignee: tkt.TECHEMP_NAME || "Unassigned",
          reporter: tkt.RAISEBYNM || "Unknown",
          createdAt: tkt.TKTDATE,
          dueDate: tkt.ASSIGNDT || tkt.TKTDATE,
          tktFor: tkt.TKTFOR === "M" ? "Machine" : "Department",
          ccnName: tkt.CCN_NAME || "",
          machineryName: tkt.MACHINERY_NAME || "",
        }));

        setTickets(mappedTickets);
      }

      else {
        setError("Failed to load tickets");
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTickets();
  }, []);



  const calculateStats = (tickets) => {
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      overdue: tickets.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'closed').length
    };
    setStats(stats);
  };

  const handleModuleClick = (modulePath) => {
    console.log('Navigating to:', modulePath);
    router.push(modulePath);
  };
  console.log('tickets', tickets)
  console.log('filter', tickets.filter(ticket => ticket.TKTSTATUS === "O").length,)

  const handleCreateTicket = (newTicket) => {
    const ticket = {
      ...newTicket,
      id: `TKT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    setTickets(prev => [ticket, ...prev]);
    calculateStats([ticket, ...tickets]);
    setShowCreateTicket(false);
  };

  const handleUpdateTicket = (ticketId, updates) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
    calculateStats(tickets);
    setEditingTicket(null);
  };

  const handleAddComment = (ticketId, comment) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? {
            ...ticket,
            comments: [...(ticket.comments || []), {
              id: `CMT-${Date.now()}`,
              ...comment,
              createdAt: new Date().toISOString()
            }]
          }
          : ticket
      )
    );
  };

  const handleUpdateStatus = (ticketId, status) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
    calculateStats(tickets);
  };

  const ticketModules = [
    {
      title: 'Create New Ticket',
      description: 'Create a new support ticket',
      icon: MdAdd,
      path: '/tickets/create-tickets',
      color: '#10b981'
    },
    {
      title: 'My Tickets',
      description: 'View tickets assigned to you',
      icon: MdPerson,
      path: '/tickets/my-tickets',
      color: '#3b82f6'
    },
    {
      title: 'All Tickets',
      description: 'View all tickets in system',
      icon: MdViewList,
      path: '/tickets/all-tickets',
      color: '#8b5cf6'
    },
    {
      title: 'Unassigned Tickets',
      description: 'Tickets waiting for assignment',
      icon: MdAssignment,
      path: '/tickets/unassign-tickets',
      color: '#f59e0b'
    },
    {
      title: 'Overdue Tickets',
      description: 'Tickets past due date',
      icon: MdWarning,
      path: '/tickets/overdue-tickets',
      color: '#ef4444'
    },
    {
      title: 'Ticket Categories',
      description: 'Manage ticket categories',
      icon: MdCategory,
      path: '/tickets/ticket-category',
      color: '#f97316'
    },
    {
      title: 'Priority Management',
      description: 'Configure priority levels',
      icon: FaExclamationTriangle,
      path: '/tickets/priority-ticket',
      color: '#dc2626'
    },
    {
      title: 'Status Workflow',
      description: 'Manage ticket status flow',
      icon: MdWork,
      path: '/tickets/ticket-status',
      color: '#7c3aed'
    },
    {
      title: 'Assignment Rules',
      description: 'Auto assignment rules',
      icon: MdSettings,
      path: '/tickets/assignment-rule',
      color: '#06b6d4'
    },
    {
      title: 'SLA Management',
      description: 'Service level agreements',
      icon: MdTimer,
      path: '/tickets/sla-manage',
      color: '#0891b2'
    },
    {
      title: 'Reports & Analytics',
      description: 'Ticket reports and insights',
      icon: MdAnalytics,
      path: '/tickets/ticket-dashboard/',
      color: '#ec4899'
    },
    {
      title: 'Team Management',
      description: 'Manage support team',
      icon: FaUsers,
      path: '/tickets/team-management',
      color: '#6b7280'
    }
  ];

  const quickStats = [
    {
      title: 'Total Tickets',
      value: stats.total,
      change: '+12%',
      color: 'blue',
      icon: MdList
    },
    {
      title: 'Open Tickets',
      value: stats.open,
      change: '+5%',
      color: 'orange',
      icon: MdNotifications
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      change: '-2%',
      color: 'purple',
      icon: MdSchedule
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      change: '+8%',
      color: 'green',
      icon: MdCheckCircleOutline
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      change: '+3%',
      color: 'red',
      icon: MdWarning
    },
    {
      title: 'SLA Compliance',
      value: '92%',
      change: '+2%',
      color: 'teal',
      icon: MdCheckCircle
    }
  ];

  const recentActivities = [
    { action: 'Ticket TKT-001 created', time: '2 mins ago', user: 'John Doe', type: 'create' },
    { action: 'Ticket TKT-045 resolved', time: '15 mins ago', user: 'Jane Smith', type: 'resolve' },
    { action: 'New category "Billing" added', time: '1 hour ago', user: 'Admin', type: 'category' },
    { action: 'SLA policy updated', time: '2 hours ago', user: 'System', type: 'sla' },
    { action: 'Ticket TKT-012 assigned to Mike', time: '3 hours ago', user: 'System', type: 'assignment' }
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


  const renderActiveModule = () => {
    switch (activeModule) {
      case 'ticket-list':
        return (
          <TicketList
            tickets={tickets}
            onViewTicket={setSelectedTicket}
            onEditTicket={setEditingTicket}
            onCreateTicket={() => setShowCreateTicket(true)}
          />
        );
      case 'categories':
        return <TicketCategories />;
      case 'priorities':
        return <TicketPriorities />;
      case 'status':
        return <TicketStatus />;
      case 'reports':
        return <TicketReports tickets={tickets} />;
      case 'team':
        return (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <FaUsers size={48} style={{ color: '#6b7280', marginBottom: '1rem' }} />
            <h3>Team Management</h3>
            <p>Team management feature coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };


  const renderOverview = () => (
    <>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} style={{
              background:
                stat.color === 'green' ? 'linear-gradient(135deg, #dcfce7, #66c7a3)' :
                  stat.color === 'red' ? 'linear-gradient(135deg, #fecaca, #f79c92)' :
                    stat.color === 'blue' ? 'linear-gradient(135deg, #dbeafe, #92c9f3)' :
                      stat.color === 'orange' ? 'linear-gradient(135deg, #fed7aa, #fdbf7f)' :
                        stat.color === 'purple' ? 'linear-gradient(135deg, #e9d5ff, #d2a8f5)' :
                          'linear-gradient(135deg, #ccfbf1, #a0e0d3)',

              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              padding: '1.25rem',
              transition: 'all 0.3s ease',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor:
                        stat.color === 'green' ? '#ffffffff' :
                          stat.color === 'red' ? '#ffffffff' :
                            stat.color === 'blue' ? '#ffffffff' :
                              stat.color === 'orange' ? '#ffffffff' :
                                stat.color === 'purple' ? '#ffffffff' :
                                  '#ffffffff',
                      color:
                        stat.color === 'green' ? '#166534' :
                          stat.color === 'red' ? '#991b1b' :
                            stat.color === 'blue' ? '#1e40af' :
                              stat.color === 'orange' ? '#9a3412' :
                                stat.color === 'purple' ? '#7e22ce' :
                                  '#0f766e'
                    }}>
                      <IconComponent size={20} />
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {stat.title}
                  </p>
                  <p style={{
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    margin: '0.25rem 0 0 0'
                  }}>
                    {stat.value}
                  </p>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor:
                    stat.change.startsWith('+') ? '#dcfce7' : '#fecaca',
                  color:
                    stat.change.startsWith('+') ? '#166534' : '#991b1b'
                }}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}

      </div>


      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem'
      }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Ticket Management Modules
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.5rem',
                    color: '#6b7280',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderRadius: '0.375rem',
                    transition: 'background-color 0.2s'
                  }}>
                    <MdSearch size={20} />
                  </button>
                  <button style={{
                    padding: '0.5rem',
                    color: '#6b7280',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderRadius: '0.375rem',
                    transition: 'background-color 0.2s'
                  }}>
                    <MdFilterList size={20} />
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {ticketModules.map((module, index) => {
                  const IconComponent = module.icon;
                  return (
                    <div
                      key={index}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: `${module.color}15`
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        e.currentTarget.style.borderColor = module.color;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                      onClick={() => handleModuleClick(module.path)} hai
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{
                          padding: '0.75rem',
                          borderRadius: '0.75rem',
                          backgroundColor: module.color,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <IconComponent size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#111827',
                            margin: '0 0 0.5rem 0'
                          }}>
                            {module.title}
                          </h3>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            margin: 0,
                            lineHeight: '1.4'
                          }}>
                            {module.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#111827',
                    fontSize: '1.25rem'
                  }}
                >
                  Recent Tickets
                </Typography>
                <Button
                  onClick={() => setActiveModule('ticket-list')}
                  sx={{
                    color: '#2563eb',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    minWidth: 'auto',
                    p: 0
                  }}
                >
                  View All
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ borderBottom: '1px solid #e5e7eb' }}>
                      <TableCell sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        py: 1.5,
                        px: 1,
                        border: 'none'
                      }}>
                        Ticket No
                      </TableCell>
                      <TableCell sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        py: 1.5,
                        px: 1,
                        border: 'none'
                      }}>
                        Title
                      </TableCell>
                      <TableCell sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        py: 1.5,
                        px: 1,
                        border: 'none'
                      }}>
                        Priority
                      </TableCell>
                      <TableCell sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        py: 1.5,
                        px: 1,
                        border: 'none'
                      }}>
                        Status
                      </TableCell>
                      <TableCell sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        py: 1.5,
                        px: 1,
                        border: 'none'
                      }}>
                        Assignee
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tickets.slice(0, 3).map((ticket, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          borderBottom: '1px solid #f3f4f6',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          '&:last-child': { borderBottom: 'none' },
                          '&:hover': { backgroundColor: '#f9fafb' }
                        }}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <TableCell sx={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#2563eb',
                          py: 1,
                          px: 1,
                          border: 'none'
                        }}>
                          {ticket?.id}
                        </TableCell>
                        <TableCell sx={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#111827',
                          py: 1,
                          px: 1,
                          border: 'none'
                        }}>
                          {ticket.title}
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1, border: 'none' }}>
                          <Chip
                            label={ticket.priority}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: `${getPriorityColor(ticket.priority)}20`,
                              color: getPriorityColor(ticket.priority),
                              height: '24px'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1, px: 1, border: 'none' }}>
                          <Chip
                            label={ticket.status.replace('-', ' ')}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: `${getStatusColor(ticket.status)}20`,
                              color: getStatusColor(ticket.status),
                              height: '24px',
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          py: 1,
                          px: 1,
                          border: 'none'
                        }}>
                          {ticket.assignee}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 1rem 0'
            }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => window.location.href = '/tickets/create-tickets'}
              >
                <MdAdd size={18} />
                <span>Create New Ticket</span>
              </button>
              <button
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onClick={() => window.location.href = '/tickets/my-tickets'}
              >
                <MdPerson size={18} />
                <span>View My Tickets</span>
              </button>
              <button
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onClick={() => setActiveModule('reports')}
              >
                <MdAnalytics size={18} />
                <span>Generate Report</span>
              </button>
            </div>
          </div>


          <div style={{
            backgroundColor: '#f0f9ff',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 1rem 0'
            }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentActivities.map((activity, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#2563eb',
                    borderRadius: '50%',
                    marginTop: '0.5rem',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#111827',
                      margin: '0 0 0.25rem 0',
                      fontWeight: '500'
                    }}>
                      {activity.action}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {activity.time} by {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <Card
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(148, 211, 164, 0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: 1,
              border: '1px solid',
              borderColor: 'grey.200',
              p: 3
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2
              }}
            >
              Status Distribution
            </Typography>

            <Stack spacing={1.5}>
              {[
                {
                  status: 'Open',
                  count: tickets.filter(ticket => ticket.status == "open").length,
                  color: 'error.main'
                },
                {
                  status: 'In Progress',
                  count: tickets.filter(ticket => ticket.status == "in-progress").length,
                  color: 'warning.main'
                },
                {
                  status: 'Resolved',
                  count: tickets.filter(ticket => ticket.status == "resolved").length,
                  color: 'success.main'
                },
                {
                  status: 'Closed',
                  count: tickets.filter(ticket => ticket.status == "C").length,
                  color: 'grey.500'
                }
              ].map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: item.color,
                      borderRadius: '50%',
                      flexShrink: 0
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ flex: 1 }}
                  >
                    {item.status}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                  >
                    {item.count} tickets
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        </div>
      </div>
    </>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      <div style={{
        backgroundColor: '#dbeafe',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {activeModule !== 'overview' && (
                  <button
                    onClick={() => setActiveModule('overview')}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <MdClose size={20} />
                  </button>
                )}
                <div>
                  <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    margin: 0,
                  }}>
                    {activeModule === 'overview' ? '🎫 Ticket Management' :
                      activeModule === 'ticket-list' ? 'All Tickets' :
                        activeModule === 'categories' ? 'Ticket Categories' :
                          activeModule === 'priorities' ? 'Priority Management' :
                            activeModule === 'status' ? 'Status Workflow' :
                              activeModule === 'reports' ? 'Reports & Analytics' :
                                activeModule === 'team' ? 'Team Management' : 'Ticket Management'}
                  </h1>
                  <p style={{
                    color: '#6b7280',
                    margin: '0.25rem 0 0 0',
                    fontSize: '0.875rem'
                  }}>
                    {activeModule === 'overview'
                      ? 'Manage all support tickets and customer queries'
                      : `Manage ${activeModule.replace('-', ' ')}`}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/dashboard')}
                sx={{

                  borderRadius: 2,
                  fontWeight: '600',
                  textTransform: 'none'
                }}
                variant="outlined"
              >

              </Button>
              {activeModule === 'overview' && (
                <>
                  <button
                    style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => window.location.href = '/tickets/create-tickets'}
                  >
                    <MdAdd size={18} />
                    <span>New Ticket</span>
                  </button>
                  <button style={{
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}>
                    <MdRefresh size={18} />
                    <span>Refresh</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.5rem 1rem'
      }}>
        {renderActiveModule()}
      </div>

      {showCreateTicket && (
        <CreateTicket
          onClose={() => setShowCreateTicket(false)}
          onSuccess={handleCreateTicket}
        />
      )}

      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onEdit={setEditingTicket}
          onAddComment={handleAddComment}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {editingTicket && (
        <CreateTicket
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onSuccess={(updatedTicket) => handleUpdateTicket(editingTicket.id, updatedTicket)}
        />
      )}
    </div>
  );
};

export default TicketDashboard;