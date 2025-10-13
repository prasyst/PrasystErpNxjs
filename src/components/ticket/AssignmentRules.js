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
  Switch,
  FormControlLabel,
  FormGroup,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  Groups as GroupsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Whatshot as WhatshotIcon
} from '@mui/icons-material';

const AssignmentRules = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [rules, setRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRule, setSelectedRule] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [newRuleDialogOpen, setNewRuleDialogOpen] = useState(false);


  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    conditions: [],
    actions: [],
    isActive: true,
    assignmentMethod: 'round-robin',
    assignedTeam: '',
    assignedUsers: []
  });

  const teams = [
    { id: 'team-1', name: 'Technical Support', members: ['John Doe', 'Mike Wilson'] },
    { id: 'team-2', name: 'Customer Service', members: ['Jane Smith', 'Sarah Johnson'] },
    { id: 'team-3', name: 'Billing Team', members: ['David Brown', 'Emma Wilson'] }
  ];

  const allUsers = [
    'John Doe', 'Jane Smith', 'Mike Wilson', 'Sarah Johnson', 
    'David Brown', 'Emma Wilson'
  ];

  const conditions = [
    'Ticket Priority is High',
    'Ticket Category is Technical',
    'Ticket contains specific keywords',
    'Ticket from VIP customer',
    'Business hours',
    'Weekend ticket'
  ];

  const actions = [
    'Assign to specific team',
    'Assign to specific user',
    'Send notification',
    'Change ticket priority',
    'Add internal note'
  ];

  useEffect(() => {
    loadAssignmentRules();
  }, []);

  useEffect(() => {
    filterRules();
  }, [searchTerm, statusFilter, rules]);

  const loadAssignmentRules = () => {
    const mockRules = [
      {
        id: 'RULE-001',
        name: 'High Priority Technical Issues',
        description: 'Automatically assign high priority technical tickets to technical team',
        priority: 'High',
        conditions: ['Ticket Priority is High', 'Ticket Category is Technical'],
        actions: ['Assign to specific team', 'Send notification'],
        isActive: true,
        assignmentMethod: 'round-robin',
        assignedTeam: 'team-1',
        assignedUsers: ['John Doe', 'Mike Wilson'],
        createdAt: '2024-01-10',
        lastTriggered: '2024-01-16',
        triggerCount: 45,
        successRate: 92
      },
      {
        id: 'RULE-002',
        name: 'VIP Customer Support',
        description: 'Assign tickets from VIP customers to senior support agents',
        priority: 'Medium',
        conditions: ['Ticket from VIP customer'],
        actions: ['Assign to specific user', 'Change ticket priority'],
        isActive: true,
        assignmentMethod: 'specific-user',
        assignedTeam: '',
        assignedUsers: ['Jane Smith'],
        createdAt: '2024-01-12',
        lastTriggered: '2024-01-15',
        triggerCount: 23,
        successRate: 95
      },
      {
        id: 'RULE-003',
        name: 'Billing Issues',
        description: 'Route all billing related tickets to billing team',
        priority: 'Medium',
        conditions: ['Ticket Category is Billing'],
        actions: ['Assign to specific team'],
        isActive: false,
        assignmentMethod: 'round-robin',
        assignedTeam: 'team-3',
        assignedUsers: ['David Brown', 'Emma Wilson'],
        createdAt: '2024-01-05',
        lastTriggered: '2024-01-14',
        triggerCount: 67,
        successRate: 96
      }
    ];
    setRules(mockRules);
  };

  const filterRules = () => {
    let filtered = rules;

    if (searchTerm) {
      filtered = filtered.filter(rule =>
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(rule => 
        statusFilter === 'active' ? rule.isActive : !rule.isActive
      );
    }

    setFilteredRules(filtered);
  };

  const handleToggleRule = (ruleId) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);

  };

  const handleDeleteClick = (rule) => {
    setRuleToDelete(rule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (ruleToDelete) {
      setRules(prev => prev.filter(rule => rule.id !== ruleToDelete.id));
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
    }
  };

  const handleCreateRule = () => {
    const newRuleData = {
      ...newRule,
      id: `RULE-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastTriggered: 'Never',
      triggerCount: 0,
      successRate: 0
    };
    
    setRules(prev => [newRuleData, ...prev]);
    setNewRuleDialogOpen(false);
    resetNewRuleForm();
  };

  const resetNewRuleForm = () => {
    setNewRule({
      name: '',
      description: '',
      priority: 'Medium',
      conditions: [],
      actions: [],
      isActive: true,
      assignmentMethod: 'round-robin',
      assignedTeam: '',
      assignedUsers: []
    });
  };

  const handleConditionToggle = (condition) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const handleActionToggle = (action) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions.includes(action)
        ? prev.actions.filter(a => a !== action)
        : [...prev.actions, action]
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };


  const MobileRuleCard = ({ rule }) => (
    <Card 
      sx={{ 
        mb: 2,
        border: '2px solid',
        borderColor: rule.isActive ? 'success.light' : 'error.light',
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
              {rule.id}
            </Typography>
            <Chip
              label={rule.priority}
              size="small"
              color={getPriorityColor(rule.priority)}
              sx={{ mt: 0.5 }}
            />
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={rule.isActive}
                onChange={() => handleToggleRule(rule.id)}
                color="success"
              />
            }
            label=""
          />
        </Box>
        
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {rule.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {rule.description}
        </Typography>

        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" fontWeight="600">
              Rule Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box mb={2}>
              <Typography variant="caption" fontWeight="600" display="block" mb={1}>
                CONDITIONS:
              </Typography>
              <Stack spacing={0.5}>
                {rule.conditions.map((condition, index) => (
                  <Chip
                    key={index}
                    label={condition}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="600" display="block" mb={1}>
                ACTIONS:
              </Typography>
              <Stack spacing={0.5}>
                {rule.actions.map((action, index) => (
                  <Chip
                    key={index}
                    label={action}
                    size="small"
                    color="primary"
                  />
                ))}
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip
            label={rule.assignmentMethod.replace('-', ' ')}
            size="small"
            color="primary"
            variant="filled"
          />
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary" display="block">
              Triggered: {rule.triggerCount} times
            </Typography>
            <Typography variant="caption" color="success.main" fontWeight="600">
              Success: {rule.successRate}%
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button 
            size="small" 
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleEditRule(rule)}
          >
            Edit
          </Button>
          <Box display="flex" gap={0.5}>
            <Tooltip title={rule.isActive ? "Deactivate" : "Activate"}>
              <IconButton 
                size="small" 
                color={rule.isActive ? "warning" : "success"}
                onClick={() => handleToggleRule(rule.id)}
              >
                {rule.isActive ? <StopIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton 
                size="small" 
                color="error"
                onClick={() => handleDeleteClick(rule)}
              >
                <DeleteIcon />
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
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Rule ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Rule Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Priority</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Assignment Method</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Trigger Count</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Success Rate</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRules.map((rule) => (
            <TableRow 
              key={rule.id}
              hover
              sx={{ 
                backgroundColor: rule.isActive ? alpha(theme.palette.success.main, 0.04) : 'inherit'
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="600" color="primary">
                  {rule.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    {rule.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {rule.description}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={rule.priority}
                  size="small"
                  color={getPriorityColor(rule.priority)}
                />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rule.isActive}
                        onChange={() => handleToggleRule(rule.id)}
                        color="success"
                        size="small"
                      />
                    }
                    label=""
                  />
                  <Chip
                    label={rule.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={getStatusColor(rule.isActive)}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={rule.assignmentMethod.replace('-', ' ')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Box textAlign="center">
                  <Typography variant="body2" fontWeight="600">
                    {rule.triggerCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last: {formatDate(rule.lastTriggered)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: rule.successRate >= 90 
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.warning.main, 0.1)
                  }}
                >
                  <Typography variant="body2" fontWeight="600" color={
                    rule.successRate >= 90 ? 'success.main' : 'warning.main'
                  }>
                    {rule.successRate}%
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" justifyContent="center" gap={1}>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditRule(rule)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={rule.isActive ? "Deactivate" : "Activate"}>
                    <IconButton 
                      size="small" 
                      color={rule.isActive ? "warning" : "success"}
                      onClick={() => handleToggleRule(rule.id)}
                    >
                      {rule.isActive ? <StopIcon /> : <PlayArrowIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(rule)}
                    >
                      <DeleteIcon />
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


  const stats = {
    total: rules.length,
    active: rules.filter(r => r.isActive).length,
    highPriority: rules.filter(r => r.priority === 'High').length
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50', py: 2 }}>
      <Container maxWidth="xl">
     
        <Box sx={{ mb: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/tickets/ticket-dashboard/')}
            sx={{ mb: 2 }}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
          
          <Box 
            sx={{ 
              backgroundColor: 'primary.main',
              borderRadius: 2,
              p: 1,
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" component="h5" fontWeight="bold" gutterBottom>
              🎯 Assignment Rules
            </Typography>
            <Typography variant="p">
              Automatically assign tickets based on conditions and rules
            </Typography>
          </Box>
        </Box>


        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography>Total Rules</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3" fontWeight="bold">
                  {stats.active}
                </Typography>
                <Typography>Active Rules</Typography>
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
        </Grid>

       <Card sx={{ mb: 3, p: 1.5 }}>
  <Grid container spacing={1.5} alignItems="center">
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search assignment rules..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          sx: {
            fontSize: '0.875rem',
            '& .MuiInputBase-input': {
              height: '1.5rem',
              padding: '6px 8px'
            }
          }
        }}
      />
    </Grid>
    
    <Grid item xs={12} sm={6} md={3}>
      <TextField
        fullWidth
        select
        size="small"
        label="Status Filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        InputProps={{
          sx: {
            fontSize: '0.875rem',
            '& .MuiSelect-select': {
              height: '1.5rem',
              padding: '6px 8px'
            }
          }
        }}
      >
        <MenuItem value="all" sx={{ fontSize: '0.875rem' }}>All Status</MenuItem>
        <MenuItem value="active" sx={{ fontSize: '0.875rem' }}>Active</MenuItem>
        <MenuItem value="inactive" sx={{ fontSize: '0.875rem' }}>Inactive</MenuItem>
      </TextField>
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <Button
        fullWidth
        variant="contained"
        size="small"
        startIcon={<AddIcon fontSize="small" />}
        onClick={() => setNewRuleDialogOpen(true)}
        sx={{
          fontSize: '0.875rem',
          py: 0.75,
          minHeight: '2.25rem'
        }}
      >
        Create New Rule
      </Button>
    </Grid>
  </Grid>
</Card>

        {isMobile ? (
          <Box>
            {filteredRules.map((rule) => (
              <MobileRuleCard key={rule.id} rule={rule} />
            ))}
          </Box>
        ) : (
          <DesktopTableView />
        )}

        {filteredRules.length === 0 && (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <AssignmentIcon sx={{ fontSize: 64, color: 'info.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom color="info.main">
                No Assignment Rules
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create your first assignment rule to automate ticket routing.
              </Typography>
              <Button 
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setNewRuleDialogOpen(true)}
              >
                Create First Rule
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog
          open={newRuleDialogOpen}
          onClose={() => setNewRuleDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Create New Assignment Rule
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Rule Name"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter rule name"
              />
              
              <TextField
                fullWidth
                label="Description"
                value={newRule.description}
                onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
                placeholder="Describe what this rule does"
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Priority"
                    value={newRule.priority}
                    onChange={(e) => setNewRule(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Assignment Method</InputLabel>
                    <Select
                      value={newRule.assignmentMethod}
                      onChange={(e) => setNewRule(prev => ({ ...prev, assignmentMethod: e.target.value }))}
                      label="Assignment Method"
                    >
                      <MenuItem value="round-robin">Round Robin</MenuItem>
                      <MenuItem value="load-balance">Load Balance</MenuItem>
                      <MenuItem value="specific-user">Specific User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Conditions
                </Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    {conditions.map((condition, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={newRule.conditions.includes(condition)}
                              onChange={() => handleConditionToggle(condition)}
                            />
                          }
                          label={condition}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Actions
                </Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    {actions.map((action, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={newRule.actions.includes(action)}
                              onChange={() => handleActionToggle(action)}
                            />
                          }
                          label={action}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={newRule.isActive}
                    onChange={(e) => setNewRule(prev => ({ ...prev, isActive: e.target.checked }))}
                    color="success"
                  />
                }
                label="Activate this rule immediately"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewRuleDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreateRule}>
              Create Rule
            </Button>
          </DialogActions>
        </Dialog>


        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete rule <strong>{ruleToDelete?.id}</strong>? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default AssignmentRules;