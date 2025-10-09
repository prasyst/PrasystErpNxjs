"use client"
import React, { useState } from 'react';
import { 
  MdSearch, MdFilterList, MdSort, MdEdit, 
  MdVisibility, MdRefresh, MdAdd 
} from 'react-icons/md';

const TicketList = ({ onViewTicket, onEditTicket, onCreateTicket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignee: ''
  });

  // Dummy data - context ke bina
  const tickets = [
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
    },
    {
      id: 'TKT-004',
      title: 'Payment Gateway Issue',
      description: 'Payment not processing correctly',
      category: 'Billing',
      priority: 'High',
      status: 'open',
      assignee: 'David Brown',
      reporter: 'Emma Wilson',
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
      dueDate: new Date('2024-01-16'),
      tags: ['payment', 'billing'],
      comments: []
    },
    {
      id: 'TKT-005',
      title: 'Mobile App Crash',
      description: 'App crashes on iOS when opening settings',
      category: 'Technical',
      priority: 'Critical',
      status: 'in-progress',
      assignee: 'Lisa Anderson',
      reporter: 'Tom Clark',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-14'),
      dueDate: new Date('2024-01-15'),
      tags: ['mobile', 'ios', 'crash'],
      comments: []
    }
  ];

  const categories = [
    { id: 1, name: 'Technical', color: '#ef4444' },
    { id: 2, name: 'Account', color: '#3b82f6' },
    { id: 3, name: 'Billing', color: '#8b5cf6' },
    { id: 4, name: 'Feature Request', color: '#10b981' },
    { id: 5, name: 'Enhancement', color: '#f59e0b' }
  ];

  const priorities = [
    { id: 1, name: 'Low', color: '#10b981' },
    { id: 2, name: 'Medium', color: '#f59e0b' },
    { id: 3, name: 'High', color: '#ef4444' },
    { id: 4, name: 'Critical', color: '#dc2626' }
  ];

  const statuses = [
    { id: 1, name: 'open', displayName: 'Open', color: '#ef4444' },
    { id: 2, name: 'in-progress', displayName: 'In Progress', color: '#f59e0b' },
    { id: 3, name: 'resolved', displayName: 'Resolved', color: '#10b981' },
    { id: 4, name: 'closed', displayName: 'Closed', color: '#6b7280' }
  ];

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || ticket.status === filters.status;
    const matchesPriority = !filters.priority || ticket.priority === filters.priority;
    const matchesCategory = !filters.category || ticket.category === filters.category;
    const matchesAssignee = !filters.assignee || ticket.assignee === filters.assignee;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignee;
  });

  // Sort tickets
  const sortedTickets = filteredTickets.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'dueDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.name === status);
    return statusObj ? statusObj.color : '#9ca3af';
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.name === priority);
    return priorityObj ? priorityObj.color : '#9ca3af';
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      assignee: ''
    });
    setSearchTerm('');
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
            All Tickets ({filteredTickets.length})
          </h2>
          <button
            onClick={onCreateTicket}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <MdAdd size={16} />
            New Ticket
          </button>
        </div>

        {/* Search and Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <MdSearch 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#9ca3af' 
              }} 
            />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.5rem 0.5rem 2.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                minWidth: '120px'
              }}
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status.id} value={status.name}>
                  {status.displayName}
                </option>
              ))}
            </select>

            <select
              value={filters.priority}
              onChange={(e) => updateFilters({ priority: e.target.value })}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                minWidth: '120px'
              }}
            >
              <option value="">All Priority</option>
              {priorities.map(priority => (
                <option key={priority.id} value={priority.name}>
                  {priority.name}
                </option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                minWidth: '140px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {(filters.status || filters.priority || filters.category || searchTerm) && (
              <button
                onClick={clearFilters}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <MdRefresh size={16} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <th style={{ 
                textAlign: 'left', 
                padding: '1rem 0.75rem', 
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }} onClick={() => handleSort('id')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Ticket ID
                  <MdSort size={14} />
                </div>
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '1rem 0.75rem', 
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }} onClick={() => handleSort('title')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Title
                  <MdSort size={14} />
                </div>
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '1rem 0.75rem', 
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Category
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '1rem 0.75rem', 
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }} onClick={() => handleSort('priority')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Priority
                  <MdSort size={14} />
                </div>
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '1rem 0.75rem', 
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }} onClick={() => handleSort('status')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Status
                  <MdSort size={14} />
                </div>
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '1rem 0.75rem', 
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Assignee
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '1rem 0.75rem', 
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTickets.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  No tickets found. {searchTerm || Object.values(filters).some(f => f) ? 'Try adjusting your search or filters.' : 'Create your first ticket!'}
                </td>
              </tr>
            ) : (
              sortedTickets.map((ticket) => (
                <tr 
                  key={ticket.id}
                  style={{ 
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <td style={{ 
                    padding: '1rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#2563eb'
                  }}>
                    {ticket.id}
                  </td>
                  <td style={{ 
                    padding: '1rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {ticket.title}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {ticket.description}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#374151',
                      backgroundColor: '#f3f4f6',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem'
                    }}>
                      {ticket.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
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
                  <td style={{ padding: '1rem 0.75rem' }}>
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
                    padding: '1rem 0.75rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {ticket.assignee}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewTicket(ticket);
                        }}
                        style={{
                          padding: '0.5rem',
                          border: 'none',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="View Ticket"
                      >
                        <MdVisibility size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTicket(ticket);
                        }}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          backgroundColor: 'white',
                          color: '#374151',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Edit Ticket"
                      >
                        <MdEdit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;