"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Technical', description: 'Technical issues and bugs', color: '#ef4444', active: true },
    { id: 2, name: 'Account', description: 'Account related issues', color: '#3b82f6', active: true },
    { id: 3, name: 'Billing', description: 'Billing and payment issues', color: '#8b5cf6', active: true },
    { id: 4, name: 'Feature Request', description: 'New feature requests', color: '#10b981', active: true },
    { id: 5, name: 'Enhancement', description: 'Improvement suggestions', color: '#f59e0b', active: true }
  ]);
  const [priorities, setPriorities] = useState([
    { id: 1, name: 'Low', color: '#10b981', responseTime: 72, resolutionTime: 168 },
    { id: 2, name: 'Medium', color: '#f59e0b', responseTime: 24, resolutionTime: 72 },
    { id: 3, name: 'High', color: '#ef4444', responseTime: 4, resolutionTime: 24 },
    { id: 4, name: 'Critical', color: '#dc2626', responseTime: 1, resolutionTime: 8 }
  ]);

  const [statuses, setStatuses] = useState([
    { id: 1, name: 'open', displayName: 'Open', color: '#ef4444', isActive: true },
    { id: 2, name: 'in-progress', displayName: 'In Progress', color: '#f59e0b', isActive: true },
    { id: 3, name: 'resolved', displayName: 'Resolved', color: '#10b981', isActive: true },
    { id: 4, name: 'closed', displayName: 'Closed', color: '#6b7280', isActive: true }
  ]);

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignee: '',
    dateRange: ''
  });

  // Load tickets from localStorage on component mount
  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // Save tickets to localStorage whenever tickets change
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Create new ticket
  const createTicket = (ticketData) => {
    const newTicket = {
      id: `TKT-${Date.now()}`,
      ...ticketData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  // Update existing ticket
  const updateTicket = (ticketId, updates) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  };

  // Delete ticket
  const deleteTicket = (ticketId) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  // Add comment to ticket
  const addComment = (ticketId, comment) => {
    const newComment = {
      id: `CMT-${Date.now()}`,
      ...comment,
      createdAt: new Date().toISOString()
    };

    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? {
            ...ticket,
            comments: [...(ticket.comments || []), newComment],
            updatedAt: new Date().toISOString()
          }
          : ticket
      )
    );
  };

  // Update ticket status
  const updateTicketStatus = (ticketId, status) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Add new category
  const addCategory = (category) => {
    const newCategory = {
      id: Date.now(),
      ...category
    };
    setCategories(prev => [...prev, newCategory]);
  };

  // Update category
  const updateCategory = (categoryId, updates) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === categoryId ? { ...category, ...updates } : category
      )
    );
  };

  // Context value
  const value = {
    // State
    tickets,
    categories,
    priorities,
    statuses,
    filters,
    // Actions
    createTicket,
    updateTicket,
    deleteTicket,
    addComment,
    updateTicketStatus,
    setFilters: updateFilters,
    addCategory,
    updateCategory
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook to use ticket context
export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};

export default TicketContext;