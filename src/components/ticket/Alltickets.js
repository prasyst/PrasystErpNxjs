'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Container, Card, CardContent, Typography, Button, TextField, MenuItem, IconButton, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme, Grid, Avatar, Divider, Tooltip, Fab, Checkbox,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import TicketDetailsDialog from './ViewTicketDetailsDialog/TicketDetailsDialog';
import FollowupDialog from './FollowupDialog'; 
import { toast } from 'react-toastify';

const AllTicketsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [ticketData, setTicketData] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDetailsOpen, setTicketDetailsOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  

  const [followupDialogOpen, setFollowupDialogOpen] = useState(false);
  const [selectedTicketForFollowup, setSelectedTicketForFollowup] = useState(null);

  useEffect(() => {
    fetchTicketDash();
  }, []);

  const fetchTicketDash = async () => {
    try {
      const response = await axiosInstance.post(
        "TrnTkt/GetTrnTktDashBoard?currentPage=1&limit=50",
        { SearchText: "" }
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
            tkt.TKTSTATUS === "I" ? "in-progress" :
              tkt.TKTSTATUS === "R" ? "resolved" : "closed",
          assignee: tkt.TECHEMP_NAME || "Unassigned",
          reporter: tkt.RAISEBYNM || "Unknown",
          createdAt: tkt.TKTDATE,
          dueDate: tkt.ASSIGNDT || tkt.TKTDATE,
          tktFor: tkt.TKTFOR === "M" ? "Machine" : "Department",
          ccnName: tkt.CCN_NAME || "",
          machineryName: tkt.MACHINERY_NAME || "",
          MOBILENO: tkt.MOBILENO || "-",
        }));

        setTicketData(mappedTickets);
        setFilteredTickets(mappedTickets);
      }
    } catch (error) {
      toast.error("Failed to load tickets");
    }
  };

  useEffect(() => {
    let filtered = ticketData;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, priorityFilter, ticketData]);

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

  const handleQuickFollowup = (ticket) => {
    setSelectedTicketForFollowup(ticket);
    setFollowupDialogOpen(true);
  };


  const handleFollowupSuccess = () => {
    fetchTicketDash();
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicketId(ticket.TKTKEY);
    setTicketDetailsOpen(true);
  };

  const handleCloseTicketDetails = () => {
    setTicketDetailsOpen(false);
    setSelectedTicketId(null);
  };

  const handleEditTicket = (ticket) => {
    router.push(`/tickets/create-tickets/?TKTKEY=${ticket.TKTKEY}`);
  };

  const handleDeleteClick = (ticket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (ticketToDelete) {
      setTicketData(prev => prev.filter(ticket => ticket.id !== ticketToDelete.id));
      setFilteredTickets(prev => prev.filter(ticket => ticket.id !== ticketToDelete.id));
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredTickets.map(t => t.TKTKEY));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (event, id) => {
    if (event.target.checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const MobileTicketCard = ({ ticket }) => (
    <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleViewTicket(ticket)}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="subtitle1" fontWeight="600" color="primary">
            {ticket.id}
          </Typography>
          <Chip
            label={ticket.status.replace('-', ' ')}
            size="small"
            color={getStatusColor(ticket.status)}
          />
        </Box>

        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }} noWrap>
          {ticket.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
          {ticket.description.length > 80
            ? `${ticket.description.substring(0, 80)}...`
            : ticket.description
          }
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip
            label={ticket.priority}
            size="small"
            color={getPriorityColor(ticket.priority)}
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            {ticket.category}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
              {getInitials(ticket.assignee)}
            </Avatar>
            <Typography variant="caption">
              {ticket.assignee.split(' ')[0]}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDate(ticket.createdAt)}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewTicket(ticket);
            }}
          >
            View
          </Button>
          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              color="info"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickFollowup(ticket);
              }}
            >
              <CommentIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleEditTicket(ticket);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(ticket);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const DesktopTableView = () => (
    <TableContainer 
      component={Paper} 
      sx={{ 
        boxShadow: 2, 
        maxHeight: 500, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '3px'
        }
      }}
    >
      <Table
        sx={{
          minWidth: 1000,
          '& .MuiTableCell-root': {
            padding: '4px 8px',
            fontSize: '0.75rem',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          '& .MuiTableCell-head': {
            padding: '6px 8px',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            backgroundColor: 'primary.main',
            color: 'white',
            fontWeight: 600,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            '&:first-of-type': {
              borderTopLeftRadius: '4px',
            },
            '&:last-of-type': {
              borderTopRightRadius: '4px',
            }
          },
          '& .MuiTableRow-root': {
            height: '42px',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-selected': {
              backgroundColor: 'primary.lighter',
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'primary.light',
            }
          },
        }}
        stickyHeader
      >
        <TableHead>
          <TableRow>
            <TableCell 
              padding="checkbox" 
              sx={{ 
                backgroundColor: 'primary.main',
                width: '40px',
                minWidth: '40px',
                maxWidth: '40px'
              }}
            >
              <Checkbox
                size="small"
                color="default"
                indeterminate={selectedRows.length > 0 && selectedRows.length < filteredTickets.length}
                checked={filteredTickets.length > 0 && selectedRows.length === filteredTickets.length}
                onChange={handleSelectAll}
                sx={{
                  color: 'white',
                  padding: '2px',
                  '&.Mui-checked': { color: 'white' },
                  '&.MuiCheckbox-indeterminate': { color: 'white' },
                }}
              />
            </TableCell>

            <TableCell sx={{ width: '100px', minWidth: '100px' }}>Ticket No</TableCell>
            <TableCell sx={{ width: '180px', minWidth: '180px' }}>Title</TableCell>
            <TableCell sx={{ width: '120px', minWidth: '120px' }}>Category</TableCell>
            <TableCell sx={{ width: '100px', minWidth: '100px' }}>Mobile No</TableCell>
            <TableCell sx={{ width: '90px', minWidth: '90px' }}>Priority</TableCell>
            <TableCell sx={{ width: '100px', minWidth: '100px' }}>Status</TableCell>
            <TableCell sx={{ width: '80px', minWidth: '80px' }}>TKTFOR</TableCell>
            <TableCell sx={{ width: '100px', minWidth: '100px' }}>Raised At</TableCell>
            <TableCell sx={{ width: '110px', minWidth: '110px', textAlign: 'center' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredTickets.map((ticket) => {
            const isSelected = selectedRows.includes(ticket.TKTKEY);
            return (
              <TableRow
                key={ticket.TKTKEY}
                hover
                selected={isSelected}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'action.selected' : 'inherit',
                  '&:last-child td': {
                    borderBottom: 0
                  }
                }}
                onClick={(e) => {
                  if (e.target.type !== 'checkbox') {
                    handleViewTicket(ticket);
                  }
                }}
              >
                {/* Row Checkbox */}
                <TableCell 
                  padding="checkbox" 
                  sx={{ 
                    width: '40px',
                    minWidth: '40px',
                    maxWidth: '40px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    size="small"
                    color="primary"
                    checked={isSelected}
                    onChange={(e) => handleRowSelect(e, ticket.TKTKEY)}
                    sx={{ 
                      padding: '2px',
                      '& .MuiSvgIcon-root': {
                        fontSize: '1rem'
                      }
                    }}
                  />
                </TableCell>

                {/* Ticket No */}
                <TableCell>
                  <Typography 
                    variant="body2" 
                    fontWeight="600" 
                    color="primary"
                    sx={{ 
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {ticket.id}
                  </Typography>
                </TableCell>

                {/* Title */}
                <TableCell sx={{ maxWidth: '180px' }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="600" 
                    sx={{ 
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {ticket.title}
                  </Typography>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Chip 
                    label={ticket.category} 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ 
                      fontSize: '0.7rem',
                      height: '22px',
                      '& .MuiChip-label': {
                        px: 1,
                        py: 0.5
                      }
                    }} 
                  />
                </TableCell>

                {/* Mobile No */}
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.75rem',
                      color: 'text.secondary'
                    }}
                  >
                    {ticket.MOBILENO || '-'}
                  </Typography>
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <Chip 
                    label={ticket.priority} 
                    size="small" 
                    color={getPriorityColor(ticket.priority)} 
                    sx={{ 
                      fontSize: '0.7rem',
                      height: '22px',
                      minWidth: '60px',
                      '& .MuiChip-label': {
                        px: 1,
                        py: 0.5
                      }
                    }} 
                  />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={
                      ticket.status === 'open' ? 'Open' :
                      ticket.status === 'in-progress' ? 'In Progress' :
                      ticket.status === 'resolved' ? 'Resolved' : 'Closed'
                    }
                    size="small"
                    color={getStatusColor(ticket.status)}
                    variant="filled"
                    sx={{ 
                      fontSize: '0.7rem',
                      height: '22px',
                      minWidth: '70px',
                      '& .MuiChip-label': {
                        px: 1,
                        py: 0.5
                      }
                    }}
                  />
                </TableCell>

                {/* TKTFOR */}
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  >
                    {ticket.tktFor}
                  </Typography>
                </TableCell>

                {/* Raised At */}
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.7rem'
                    }}
                  >
                    {formatDate(ticket.createdAt)}
                  </Typography>
                </TableCell>

                {/* Actions */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Box display="flex" justifyContent="center" gap={0.5}>
                    <Tooltip title="View" arrow>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleViewTicket(ticket)}
                        sx={{ 
                          padding: '3px',
                          '& .MuiSvgIcon-root': {
                            fontSize: '1rem'
                          }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  
                    <Tooltip title="Add Followup" arrow>
                      <IconButton 
                        size="small" 
                        color="info"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickFollowup(ticket);
                        }}
                         disabled={ticket.status !== "open"}
                        sx={{ 
                          padding: '3px',
                          '& .MuiSvgIcon-root': { fontSize: '1rem' }
                        }}
                      >
                        <CommentIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit" arrow>
                      <IconButton 
                        size="small" 
                        color="secondary" 
                        onClick={() => handleEditTicket(ticket)}
                        sx={{ 
                          padding: '3px',
                          '& .MuiSvgIcon-root': {
                            fontSize: '1rem'
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteClick(ticket)}
                        sx={{ 
                          padding: '3px',
                          '& .MuiSvgIcon-root': {
                            fontSize: '1rem'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}

          {filteredTickets.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No tickets found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: 'grey.50',
      py: { xs: 2, md: 2 },
      px: { xs: 1, sm: 2 }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <Box>
              <Tooltip title='Go to ticket dashboard' arrow>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => router.push('/tickets/ticket-dashboard')}
                  sx={{
                    fontWeight: '600',
                    color: 'primary.main',
                    textTransform: 'none',
                    borderRadius: '20px'
                  }}
                  variant="outlined"
                >
                  Dashboard
                </Button>
              </Tooltip>
            </Box>
            <Tooltip title='Create New Ticket' arrow>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/tickets/create-tickets')}
                size={isSmallMobile ? "small" : "medium"}
                sx={{ textTransform: 'none', borderRadius: '20px', backgroundColor: '#615ec9ff' }}
              >
                {isSmallMobile ? 'New' : 'New Ticket'}
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={2} alignItems="flex-end">
              <Typography
                variant={isSmallMobile ? "h5" : "h4"}
                component="h1"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(to right, #7e1f0aff, #054711ff)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  display: "inline",
                }}
              >
                Tickets
              </Typography>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  size="small"
                >
                  More Filters
                </Button>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {filteredTickets.length} tickets found
                </Typography>
              </Grid>

              <Typography>Selected Rows: {selectedRows.length}</Typography>

              <Tooltip title='Update Bulk Record' arrow>
                <Button
                  variant="contained"
                  size={isSmallMobile ? "small" : "medium"}
                  sx={{ textTransform: 'none', borderRadius: '20px', backgroundColor: '#615ec9ff' }}
                >
                  {isSmallMobile ? 'Bulk' : 'Bulk Update'}
                </Button>
              </Tooltip>
            </Grid>
          </CardContent>
        </Card>

        {isMobile ? (
          <Box>
            {filteredTickets.map((ticket, index) => (
              <MobileTicketCard key={index} ticket={ticket} />
            ))}
          </Box>
        ) : (
          <DesktopTableView />
        )}

        {filteredTickets.length === 0 && (
          <Card sx={{ textAlign: 'center', py: 8, boxShadow: 3 }}>
            <CardContent>
              <SearchIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="600">
                No tickets found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria to find what you are looking for.'
                  : 'No tickets have been created yet. Start by creating your first ticket!'
                }
              </Typography>
              {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/tickets/create-tickets')}
                >
                  Create Your First Ticket
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {isMobile && (
          <Fab
            color="primary"
            aria-label="add ticket"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={() => router.push('/tickets/create-tickets')}
          >
            <AddIcon />
          </Fab>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Confirm Delete</Typography>
              <IconButton onClick={() => setDeleteDialogOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete ticket <strong>{ticketToDelete?.id}</strong>?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <FollowupDialog
          open={followupDialogOpen}
          onClose={() => setFollowupDialogOpen(false)}
          ticket={selectedTicketForFollowup}
          onSuccess={handleFollowupSuccess}
        />

        <TicketDetailsDialog
          open={ticketDetailsOpen}
          onClose={handleCloseTicketDetails}
          ticketId={selectedTicketId}
          onEdit={(ticket) => {
            handleCloseTicketDetails();
            handleEditTicket(ticket);
          }}
        />
      </Container>
    </Box>
  );
};

export default AllTicketsPage;