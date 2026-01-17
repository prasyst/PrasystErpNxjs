"use client";

import React, { useEffect, useState } from 'react';
import {
  MdSearch,
  MdSort,
  MdAdd,
  MdVisibility,
  MdEdit,
  MdRefresh,
  MdArrowBack
} from 'react-icons/md';
import {
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const TicketList = ({ onViewTicket, onEditTicket, onCreateTicket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
  });

  // Static filter options (only for dropdowns)
  const statuses = [
    { id: 1, name: 'O', displayName: 'Open' },
    { id: 2, name: 'P', displayName: 'In Progress' },
    { id: 3, name: 'R', displayName: 'Resolved' },
    { id: 4, name: 'C', displayName: 'Closed' },
  ];

  const priorities = [
    { id: 1, name: 'Low' },
    { id: 2, name: 'Medium' },
    { id: 3, name: 'High' },
    { id: 4, name: 'Critical' },
  ];

  // Status & Priority colors
  const getStatusColor = (code) => {
    const map = { O: '#86940dff', P: '#f59e0b', R: '#10b981', C: '#6b7280' };
    return map[code] || '#9ca3af';
  };

  const getPriorityColor = (name) => {
    const map = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444', Critical: '#dc2626' };
    return map[name] || '#9ca3af';
  };

  // Fetch real tickets
  useEffect(() => {
    const getDashboard = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          "TrnTkt/GetTrnTktDashBoard?currentPage=1&limit=15",
          { SearchText: "" }
        );
        if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
          setTickets(response.data.DATA);
        }
      } catch (error) {
        toast.error("Error while fetching tickets.");
      } finally {
        setLoading(false);
      }
    };
    getDashboard();
  }, []);

  // Filter real tickets
  const filteredTickets = tickets.filter(ticket => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (ticket.TKTNO || '').toLowerCase().includes(search) ||
      (ticket.REASON || '').toLowerCase().includes(search) ||
      (ticket.TKTDESC || '').toLowerCase().includes(search);

    const matchesStatus = !filters.status || ticket.TKTSTATUS === filters.status;
    const matchesPriority = !filters.priority || ticket.TKTSVRTYNAME === filters.priority;
    const matchesCategory = !filters.category || ticket.TKTTYPENAME === filters.category;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const clearFilters = () => {
    setFilters({ status: '', priority: '', category: '' });
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || filters.status || filters.priority || filters.category;

  if (loading) {
    return (
      <Paper sx={{ p: 8, textAlign: 'center' }}>
        Loading tickets...
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ p: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <IconButton onClick={() => router.back()} sx={{ color: "#6b7280" }}>
            <MdArrowBack />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'transparent',
              background: 'linear-gradient(to right, #7e1f0a, #054711, #610514ff)',
              WebkitBackgroundClip: 'text',
              m: 0,
            }}
          >
            All Tickets ({filteredTickets.length})
          </Typography>

          <Button
            variant="contained"
            startIcon={<MdAdd size={16} />}
            onClick={() => router.push("/tickets/create-tickets")}
            sx={{
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' },
              borderRadius: '0.5rem',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              px: 2,
              py: 1
            }}
          >
            New Ticket
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdSearch size={20} color="#9ca3af" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 40,
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem',
                },
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>All Status</InputLabel>
              <Select
                value={filters.status}
                label="All Status"
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                sx={{ borderRadius: '0.5rem', fontSize: '0.875rem' }}
              >
                <MenuItem value="">All Status</MenuItem>
                {statuses.map(s => (
                  <MenuItem key={s.id} value={s.name}>{s.displayName}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>All Priority</InputLabel>
              <Select
                value={filters.priority}
                label="All Priority"
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                sx={{ borderRadius: '0.5rem', fontSize: '0.875rem' }}
              >
                <MenuItem value="">All Priority</MenuItem>
                {priorities.map(p => (
                  <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>All Categories</InputLabel>
              <Select
                value={filters.category}
                label="All Categories"
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                sx={{ borderRadius: '0.5rem', fontSize: '0.875rem' }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {[...new Set(tickets.map(t => t.TKTTYPENAME).filter(Boolean))].map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {hasActiveFilters && (
              <Button
                variant="outlined"
                startIcon={<MdRefresh size={16} />}
                onClick={clearFilters}
                size="small"
                sx={{
                  borderColor: '#d1d5db',
                  color: '#374151',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem'
                }}
              >
                Clear
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Table - Only Real API Data */}
      <TableContainer sx={{ overflowX: 'auto', maxHeight: 500 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#f9fafb',
                height: 36,
                '& th': {
                  p: '0.5rem 0.75rem',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#000',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1.2,
                  borderBottom: '1px solid #e5e7eb',
                  textTransform: 'none'
                }
              }}
            >
              <TableCell>Ticket No</TableCell>
              <TableCell>Ticket Key</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>CCN</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>RaisedBy</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Machine</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: '2rem', color: '#6b7280' }}>
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.TKTKEY}
                  hover
                  sx={{
                    height: 28,
                    '& td': { p: '0.2rem 0.75rem' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: '#2563eb', fontSize: '0.875rem' }}>
                    {ticket.TKTNO || '—'}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600, color: '#c50b7eff', fontSize: '0.875rem' }}>
                    {ticket.TKTKEY || '—'}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600, color: '#057928ff', fontSize: '0.875rem' }}>
                    {ticket.TKTTIME || '—'}
                  </TableCell>

                  <TableCell>
                    <Typography
                      fontWeight={600}
                      fontSize="0.875rem"
                      color="#111827"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px',
                      }}
                      title={ticket.REASON}
                    >
                      {ticket.REASON || 'No title'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600, color: '#057928ff', fontSize: '0.875rem' }}>
                    {ticket.CCN_KEY || '—'}
                  </TableCell>

                  <TableCell>
                    <Chip label={ticket.TKTTYPENAME || '—'} size="small" sx={{ fontSize: '0.75rem', height: 24 }} />
                  </TableCell>

                  <TableCell>
                    <Chip label={ticket.RAISEBYNM || '—'} size="small" sx={{ fontSize: '0.75rem', height: 24, bgcolor: 'yellow' }} />
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600, color: '#057928ff', fontSize: '0.875rem' }}>
                    {ticket.MOBILENO || '—'}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={ticket.TKTSVRTYNAME || '—'}
                      size="small"
                      sx={{
                        bgcolor: `${getPriorityColor(ticket.TKTSVRTYNAME)}20`,
                        color: getPriorityColor(ticket.TKTSVRTYNAME),
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={
                        ticket.TKTSTATUS === 'O' ? 'Open' :
                          ticket.TKTSTATUS === 'P' ? 'In Progress' :
                            ticket.TKTSTATUS === 'R' ? 'Resolved' :
                              ticket.TKTSTATUS === 'C' ? 'Closed' : 'Unknown'
                      }
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(ticket.TKTSTATUS)}20`,
                        color: getStatusColor(ticket.TKTSTATUS),
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {ticket.MACHINERY_NAME || '—'}
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); onViewTicket(ticket); }}
                        sx={{ bgcolor: '#3b82f6', color: 'white', '&:hover': { bgcolor: '#2563eb' }, width: 32, height: 32 }}>
                        <MdVisibility size={14} />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEditTicket(ticket); }}
                        sx={{ border: '1px solid #d1d5db', color: '#374151', width: 32, height: 32 }}>
                        <MdEdit size={14} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TicketList;