import React, { useState, useEffect } from 'react';
import {
  MdDashboard, MdAdd, MdList, MdViewList, MdCategory, 
  MdSettings, MdTimer, MdAnalytics, MdPerson, MdGroup, 
  MdEmail, MdTrendingUp, MdCheckCircle, MdBarChart,
  MdRefresh, MdFilterList, MdSearch, MdDownload, 
  MdNotifications, MdSupport, MdWork, MdAssignment,
  MdSchedule, MdWarning, MdCheckCircleOutline, MdClose
} from 'react-icons/md';
import { FaExclamationTriangle, FaUsers, FaChartPie } from 'react-icons/fa';
import { TiTicket } from "react-icons/ti";


import CreateTicket from './CreateTicket';
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


  useEffect(() => {
    const mockTickets = [
      {
        id: 'TKT-001',
        title: 'Login Issue',
        description: 'Unable to login to the system',
        category: 'Technical',
        priority: 'High',
        status: 'open',
        assignee: 'John Doe',
        reporter: 'Alice Smith',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        dueDate: new Date('2024-01-18'),
        tags: ['login', 'authentication'],
        comments: []
      },
      {
        id: 'TKT-002',
        title: 'Password Reset Request',
        description: 'Need to reset my password',
        category: 'Account',
        priority: 'Medium',
        status: 'in-progress',
        assignee: 'Jane Smith',
        reporter: 'Bob Johnson',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-15'),
        dueDate: new Date('2024-01-17'),
        tags: ['password'],
        comments: []
      },
      {
        id: 'TKT-003',
        title: 'Feature Request - Dark Mode',
        description: 'Add dark mode theme to the application',
        category: 'Enhancement',
        priority: 'Low',
        status: 'resolved',
        assignee: 'Mike Wilson',
        reporter: 'Sarah Davis',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
        dueDate: new Date('2024-01-20'),
        tags: ['ui', 'feature'],
        comments: []
      }
    ];

    setTickets(mockTickets);
    calculateStats(mockTickets);
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
      path: '/ticket/all-tickets',
      color: '#8b5cf6'
    },
    {
      title: 'Unassigned Tickets',
      description: 'Tickets waiting for assignment',
      icon: MdAssignment,
      // path: '/ticket/unassigned',
      color: '#f59e0b'
    },
    {
      title: 'Overdue Tickets',
      description: 'Tickets past due date',
      icon: MdWarning,
      // path: '/ticket/overdue',
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
      // path: '/ticket/priorities',
      color: '#dc2626'
    },
    {
      title: 'Status Workflow',
      description: 'Manage ticket status flow',
      icon: MdWork,
      // path: '/ticket/status',
      color: '#7c3aed'
    },
    {
      title: 'Assignment Rules',
      description: 'Auto assignment rules',
      icon: MdSettings,
      // path: '/ticket/assignment-rules',
      color: '#06b6d4'
    },
    {
      title: 'SLA Management',
      description: 'Service level agreements',
      icon: MdTimer,
      path: '/ticket/sla',
      color: '#0891b2'
    },
    {
      title: 'Reports & Analytics',
      description: 'Ticket reports and insights',
      icon: MdAnalytics,
      path: '/ticket/reports',
      color: '#ec4899'
    },
    {
      title: 'Team Management',
      description: 'Manage support team',
      icon: FaUsers,
      // path: '/ticket/team',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              padding: '1.25rem',
              transition: 'all 0.3s ease',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor: 
                        stat.color === 'green' ? '#dcfce7' :
                        stat.color === 'red' ? '#fecaca' :
                        stat.color === 'blue' ? '#dbeafe' :
                        stat.color === 'orange' ? '#fed7aa' :
                        stat.color === 'purple' ? '#e9d5ff' :
                        '#ccfbf1',
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
          
          {/* Ticket Modules */}
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
                marginBottom: '1.5rem'
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
      backgroundColor: 'white'
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
    onClick={() => handleModuleClick(module.path)} // Ye line sahi hai
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
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: '#111827',
                  margin: 0
                }}>
                  Recent Tickets
                </h2>
                <button 
                  style={{
                    color: '#2563eb',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveModule('ticket-list')}
                >
                  View All
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '0.75rem 0.5rem', 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Ticket ID
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '0.75rem 0.5rem', 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Title
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '0.75rem 0.5rem', 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Priority
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '0.75rem 0.5rem', 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Status
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '0.75rem 0.5rem', 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Assignee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.slice(0, 5).map((ticket, index) => (
                      <tr 
                        key={index} 
                        style={{ 
                          borderBottom: '1px solid #f3f4f6',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onClick={() => setSelectedTicket(ticket)}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <td style={{ 
                          padding: '1rem 0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#2563eb'
                        }}>
                          {ticket.id}
                        </td>
                        <td style={{ 
                          padding: '1rem 0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#111827'
                        }}>
                          {ticket.title}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: getPriorityColor(ticket.priority) + '20',
                            color: getPriorityColor(ticket.priority)
                          }}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: getStatusColor(ticket.status) + '20',
                            color: getStatusColor(ticket.status),
                            textTransform: 'capitalize'
                          }}>
                            {ticket.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td style={{ 
                          padding: '1rem 0.5rem',
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          {ticket.assignee}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
              Status Distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { status: 'Open', count: stats.open, color: '#ef4444' },
                { status: 'In Progress', count: stats.inProgress, color: '#f59e0b' },
                { status: 'Resolved', count: stats.resolved, color: '#10b981' },
                { status: 'Closed', count: stats.closed, color: '#6b7280' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: item.color,
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>{item.status}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {item.count} tickets
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
     
      <div style={{
        backgroundColor: 'white',
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
            padding: '1rem 0'
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
                    margin: 0
                  }}>
                    {activeModule === 'overview' ? '🎫 Ticket Management System' : 
                     activeModule === 'ticket-list' ? 'All Tickets' :
                     activeModule === 'categories' ? 'Ticket Categories' :
                     activeModule === 'priorities' ? 'Priority Management' :
                     activeModule === 'status' ? 'Status Workflow' :
                     activeModule === 'reports' ? 'Reports & Analytics' :
                     activeModule === 'team' ? 'Team Management' : 'Ticket Management System'}
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

      {/* Main Content */}
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