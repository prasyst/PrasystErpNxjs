'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  Tooltip,
  Avatar,
  AvatarGroup,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Badge,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Zoom,
  Fade,
  Grow,
  Slide,
  Container
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  ViewWeek as ViewWeekIcon,
  ViewList as ViewListIcon,
  ViewColumn as GanttChartIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  ShoppingCart as ShoppingCartIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  MonetizationOn as MonetizationOnIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  AccessTime as AccessTimeIcon,
  ArrowForward as ArrowForwardIcon,
  RocketLaunch as RocketLaunchIcon,
  TrendingFlat as TrendingFlatIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { keyframes } from '@emotion/react';

// Animation keyframes
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Enhanced Mock Data with more metrics
const generateMockData = () => {
  const stages = [
    'Design Approval', 'Fabric Sourcing', 'Pattern Making', 'Cutting', 'Sewing',
    'Finishing', 'Quality Check', 'Packing', 'Shipping', 'Delivery'
  ];

  const statuses = ['On Track', 'Delayed', 'Completed', 'Pending', 'At Risk'];
  const priorities = ['High', 'Medium', 'Low'];
  const factories = ['Factory A', 'Factory B', 'Factory C', 'Factory D'];
  const merchandisers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Lee'];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `TNA-${1000 + i}`,
    orderId: `ORD-${2000 + i}`,
    style: `STYLE-${3000 + i}`,
    buyer: ['H&M', 'Zara', 'Mango', 'Uniqlo', 'Gap'][Math.floor(Math.random() * 5)],
    factory: factories[Math.floor(Math.random() * factories.length)],
    merchandiser: merchandisers[Math.floor(Math.random() * merchandisers.length)],
    stages: stages.map((stage, idx) => ({
      name: stage,
      plannedDate: new Date(Date.now() + idx * 2 * 24 * 60 * 60 * 1000),
      actualDate: Math.random() > 0.3 ? new Date(Date.now() + idx * 2 * 24 * 60 * 60 * 1000 + (Math.random() > 0.5 ? 1 : -1) * 24 * 60 * 60 * 1000) : null,
      status: idx === 0 ? 'Completed' : idx < 4 ? 'In Progress' : 'Pending',
      completion: idx === 0 ? 100 : idx < 4 ? Math.floor(Math.random() * 60) + 20 : 0
    })),
    currentStage: stages[Math.floor(Math.random() * 5)],
    overallProgress: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    startDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    delayDays: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
    quantity: Math.floor(Math.random() * 5000) + 1000,
    value: Math.floor(Math.random() * 50000) + 10000,
    orderStatus: ['Placed', 'Confirmed', 'In Production', 'Ready for Delivery', 'Delivered'][Math.floor(Math.random() * 5)],
    estimatedDelivery: new Date(Date.now() + Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000),
    salesAmount: Math.floor(Math.random() * 100000) + 50000,
    profitMargin: Math.floor(Math.random() * 40) + 10
  }));
};

const TNADashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State Management
  const [tnaData, setTnaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewMode, setViewMode] = useState('dashboard');
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    factory: 'all',
    merchandiser: 'all',
    dateRange: 'all'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTNA, setNewTNA] = useState({
    orderId: '',
    style: '',
    buyer: '',
    factory: '',
    merchandiser: '',
    priority: 'Medium',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  // Statistics State with enhanced metrics
  const [stats, setStats] = useState({
    totalProjects: 0,
    onTrack: 0,
    delayed: 0,
    completed: 0,
    atRisk: 0,
    pendingOrders: 0,
    readyForDelivery: 0,
    totalOrdersPlaced: 0,
    ordersDelivered: 0,
    onTimeDeliveryRate: 0,
    averageProgress: 0,
    totalRevenue: 0,
    averageProfitMargin: 0
  });

  // Initialize Data
  useEffect(() => {
    const mockData = generateMockData();
    setTnaData(mockData);
    setFilteredData(mockData);
    calculateEnhancedStats(mockData);
    
    // Simulate loading with animation
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // Calculate Enhanced Statistics
  const calculateEnhancedStats = (data) => {
    const totalProjects = data.length;
    const onTrack = data.filter(item => item.status === 'On Track').length;
    const delayed = data.filter(item => item.status === 'Delayed').length;
    const completed = data.filter(item => item.status === 'Completed').length;
    const atRisk = data.filter(item => item.status === 'At Risk').length;
    const pendingOrders = data.filter(item => item.orderStatus === 'Placed' || item.orderStatus === 'Confirmed').length;
    const readyForDelivery = data.filter(item => item.orderStatus === 'Ready for Delivery').length;
    const totalOrdersPlaced = data.length;
    const ordersDelivered = data.filter(item => item.orderStatus === 'Delivered').length;
    const onTimeDeliveryRate = Math.round((data.filter(item => item.delayDays === 0).length / totalProjects) * 100) || 0;
    const averageProgress = Math.round(data.reduce((acc, item) => acc + item.overallProgress, 0) / totalProjects) || 0;
    const totalRevenue = data.reduce((acc, item) => acc + item.salesAmount, 0);
    const averageProfitMargin = Math.round(data.reduce((acc, item) => acc + item.profitMargin, 0) / totalProjects) || 0;

    setStats({
      totalProjects,
      onTrack,
      delayed,
      completed,
      atRisk,
      pendingOrders,
      readyForDelivery,
      totalOrdersPlaced,
      ordersDelivered,
      onTimeDeliveryRate,
      averageProgress,
      totalRevenue,
      averageProfitMargin
    });
  };

  // Filter Data
  useEffect(() => {
    let filtered = [...tnaData];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.buyer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(item => item.priority === filters.priority);
    }

    if (filters.factory !== 'all') {
      filtered = filtered.filter(item => item.factory === filters.factory);
    }

    if (filters.merchandiser !== 'all') {
      filtered = filtered.filter(item => item.merchandiser === filters.merchandiser);
    }

    setFilteredData(filtered);
    calculateEnhancedStats(filtered);
  }, [searchTerm, filters, tnaData]);

  // Status Chip Color
  const getStatusColor = (status) => {
    switch (status) {
      case 'On Track': return 'success';
      case 'Delayed': return 'error';
      case 'Completed': return 'primary';
      case 'Pending': return 'warning';
      case 'At Risk': return 'secondary';
      default: return 'default';
    }
  };

  // Priority Chip Color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  // Progress Bar Color
  const getProgressColor = (progress) => {
    if (progress >= 80) return theme.palette.success.main;
    if (progress >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Handle Actions
  const handleAddTNA = () => {
    setOpenDialog(true);
  };

  const handleEditTNA = (id) => {
    const item = tnaData.find(t => t.id === id);
    setNewTNA({
      ...item,
      startDate: new Date(item.startDate),
      endDate: new Date(item.endDate)
    });
    setOpenDialog(true);
  };

  const handleDeleteTNA = (id) => {
    if (window.confirm('Are you sure you want to delete this TNA?')) {
      const updatedData = tnaData.filter(item => item.id !== id);
      setTnaData(updatedData);
    }
  };

  const handleSaveTNA = () => {
    if (newTNA.id) {
      // Update existing
      setTnaData(prev => prev.map(item => 
        item.id === newTNA.id ? newTNA : item
      ));
    } else {
      // Add new
      const newItem = {
        ...newTNA,
        id: `TNA-${1000 + tnaData.length}`,
        status: 'Pending',
        overallProgress: 0,
        currentStage: 'Design Approval',
        delayDays: 0,
        quantity: 1000,
        value: 10000,
        stages: [],
        orderStatus: 'Placed',
        estimatedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        salesAmount: 10000,
        profitMargin: 20
      };
      setTnaData(prev => [...prev, newItem]);
    }
    setOpenDialog(false);
    setNewTNA({
      orderId: '',
      style: '',
      buyer: '',
      factory: '',
      merchandiser: '',
      priority: 'Medium',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((n) => n.id);
      setSelectedItems(newSelected);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1),
      );
    }

    setSelectedItems(newSelected);
  };

  // Status Icons
  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Track': return <CheckCircleIcon color="success" />;
      case 'Delayed': return <ErrorIcon color="error" />;
      case 'Completed': return <CheckCircleIcon color="primary" />;
      case 'Pending': return <PendingIcon color="warning" />;
      case 'At Risk': return <WarningIcon color="secondary" />;
      default: return <PendingIcon />;
    }
  };

  // Enhanced Header Cards Component
  const HeaderStatsCards = () => {
    const cards = [
      {
        title: 'Total Projects',
        value: stats.totalProjects,
        icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.primary.main,
        bgColor: alpha(theme.palette.primary.main, 0.1),
        trend: '+12%',
        description: 'Active TNA Plans',  
        animationDelay: '0s',
      },
      {
        title: 'Pending Orders', 
        value: stats.pendingOrders,
        icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.warning.main,
        bgColor: alpha(theme.palette.warning.main, 0.1),
        trend: '+5%',
        description: 'Awaiting Confirmation',
        animationDelay: '0.1s'
      },
      {
        title: 'Ready for Delivery',
        value: stats.readyForDelivery,
        icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.success.main,
        bgColor: alpha(theme.palette.success.main, 0.1),
        trend: '+8%',
        description: 'Ready to Ship',
        animationDelay: '0.2s'
      },
      {
        title: 'Orders Delivered',
        value: stats.ordersDelivered,
        icon: <AssignmentTurnedInIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.info.main,
        bgColor: alpha(theme.palette.info.main, 0.1),
        trend: '+15%',
        description: 'Completed Orders',
        animationDelay: '0.3s'
      },
      {
        title: 'Total Revenue',
        value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`,
        icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.secondary.main,
        bgColor: alpha(theme.palette.secondary.main, 0.1),
        trend: '+18%',
        description: 'YTD Revenue',
        animationDelay: '0.4s'
      }
    ];

    return (
      <Slide direction="up" in={!loading} timeout={800}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Grow in={!loading} timeout={600 + index * 100}>
                <Card 
                  sx={{ 
                    height: '100%',
                      width: '215px',
                    //  height: '220px',
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${card.bgColor} 0%, ${alpha(card.bgColor, 0.5)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(card.color, 0.2)}`,
                    boxShadow: `0 8px 32px ${alpha(card.color, 0.1)}`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${alpha(card.color, 0.2)}`,
                      animation: `${floatAnimation} 2s ease-in-out infinite`
                    },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${card.color}, ${alpha(card.color, 0.5)})`,
                      animation: `${shimmerAnimation} 3s infinite linear`
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center', position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        opacity: 0.1,
                        animation: `${rotateAnimation} 20s linear infinite`
                      }}
                    >
                      {card.icon}
                    </Box>
                    
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        minHeight: 120,
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: alpha(card.color, 0.2),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          animation: `${pulseAnimation} 2s ease-in-out infinite`
                        }}
                      >
                        <Box sx={{ color: card.color }}>
                          {card.icon}
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="h3"   
                        sx={{ 
                          fontWeight: 800,
                          background: `linear-gradient(45deg, ${card.color}, ${alpha(card.color, 0.7)})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 0.5
                        }}
                      >
                        {card.value}
                      </Typography>
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 1
                        }}
                      >
                        {card.title}
                      </Typography>
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          display: 'block',
                          mb: 1
                        }}
                      >
                        {card.description}
                      </Typography>
                      
                      <Chip
                        icon={<ArrowUpwardIcon sx={{ fontSize: 14 }} />}
                        label={card.trend}
                        size="small"
                        sx={{
                          bgcolor: alpha(card.color, 0.1),
                          color: card.color,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Slide>
    );
  };

  // Performance Metrics Cards
  const PerformanceMetrics = () => (
    <Slide direction="up" in={!loading} timeout={1200}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: 'On-Time Delivery',
            value: `${stats.onTimeDeliveryRate}%`,
            icon: <SpeedIcon />,
            color: theme.palette.success.main,
            progress: stats.onTimeDeliveryRate,
            trend: '+5%',
            delay: '0s'
          },
          {
            title: 'Average Progress',
            value: `${stats.averageProgress}%`,
            icon: <TrendingUpIcon />,
            color: theme.palette.warning.main,
            progress: stats.averageProgress,
            trend: '+3%',
            delay: '0.1s'
          },
          {
            title: 'Profit Margin',
            value: `${stats.averageProfitMargin}%`,
            icon: <StarIcon />,
            color: theme.palette.secondary.main,
            progress: stats.averageProfitMargin,
            trend: '+2%',
            delay: '0.2s'
          },
          {
            title: 'Active Projects',
            value: stats.onTrack,
            icon: <BoltIcon />,
            color: theme.palette.info.main,
            progress: (stats.onTrack / stats.totalProjects) * 100,
            trend: '+7%',
            delay: '0.3s'
          }
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Grow in={!loading} timeout={800 + index * 100}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s', 
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(metric.color, 0.15)}`
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        bgcolor: alpha(metric.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Box sx={{ color: metric.color, fontSize: 24 }}>
                        {metric.icon}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.title}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Progress</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {metric.trend}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={metric.progress}
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(metric.color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${metric.color}, ${alpha(metric.color, 0.7)})`
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Slide>
  );

  // Chart Data
  const chartData = [
    { name: 'On Track', value: stats.onTrack, color: theme.palette.success.main },
    { name: 'Delayed', value: stats.delayed, color: theme.palette.error.main },
    { name: 'Completed', value: stats.completed, color: theme.palette.primary.main },
    { name: 'At Risk', value: stats.atRisk, color: theme.palette.warning.main },
    { name: 'Pending', value: stats.totalProjects - (stats.onTrack + stats.delayed + stats.completed + stats.atRisk), color: theme.palette.grey[500] }
  ];

  const timelineData = filteredData.slice(0, 5).map(item => ({
    name: item.orderId,
    progress: item.overallProgress
  }));

  // Dashboard View (Your original DashboardView with enhancements)
  const DashboardView = () => (
    <Grid container spacing={3}>
      {/* Statistics Cards - Enhanced */}
      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          height: '100%',
          borderRadius: 3,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.totalProjects}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total TNA Plans
            </Typography>
            <TrendingUpIcon sx={{ mt: 1, color: 'success.main', animation: `${floatAnimation} 2s infinite` }} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          height: '100%',
          borderRadius: 3,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 24px ${alpha(theme.palette.success.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.onTrack}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              On Track
            </Typography>
            <CheckCircleIcon sx={{ mt: 1, color: 'success.main', animation: `${pulseAnimation} 2s infinite` }} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          height: '100%',
          borderRadius: 3,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 24px ${alpha(theme.palette.error.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="error.main" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.delayed}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Delayed
            </Typography>
            <ErrorIcon sx={{ mt: 1, color: 'error.main', animation: `${pulseAnimation} 2s infinite` }} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          height: '100%',
          borderRadius: 3,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary.main" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.completed}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Completed
            </Typography>
            <CheckCircleIcon sx={{ mt: 1, color: 'primary.main', animation: `${pulseAnimation} 2s infinite` }} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={2.4}>
        <Card sx={{ 
          height: '100%',
          borderRadius: 3,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 24px ${alpha(theme.palette.warning.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.atRisk}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              At Risk
            </Typography>
            <WarningIcon sx={{ mt: 1, color: 'warning.main', animation: `${pulseAnimation} 2s infinite` }} />
          </CardContent>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={8}>
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader 
            title="TNA Status Distribution" 
            sx={{ 
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiCardHeader-title': {
                fontWeight: 600
              }
            }}
          />
          <CardContent sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader 
            title="Top 5 Progress Timeline" 
            sx={{ 
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiCardHeader-title': {
                fontWeight: 600
              }
            }}
          />
          <CardContent sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar 
                  dataKey="progress" 
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent TNAs */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader 
            title="Recent Time & Action Plans"
            action={
              <Button 
                startIcon={<AddIcon />} 
                variant="contained" 
                onClick={handleAddTNA}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                  },
                  transition: 'all 0.3s'
                }}
              >
                Add New
              </Button>
            }
            sx={{ 
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiCardHeader-title': {
                fontWeight: 600
              }
            }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  '& th': { 
                    fontWeight: 600,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}>
                  <TableCell>TNA ID</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Style</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Factory</TableCell>
                  <TableCell>Current Stage</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(0, 5).map((item) => (
                  <TableRow 
                    key={item.id} 
                    hover
                    sx={{ 
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        transform: 'scale(1.002)'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {item.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.orderId}</TableCell>
                    <TableCell>{item.style}</TableCell>
                    <TableCell>{item.buyer}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.factory} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{item.currentStage}</Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={item.stages.find(s => s.name === item.currentStage)?.completion || 0}
                          sx={{ 
                            mt: 0.5,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProgressColor(item.overallProgress)
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={item.overallProgress}
                            sx={{ 
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: theme.palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getProgressColor(item.overallProgress)
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="textSecondary">
                            {`${item.overallProgress}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={getStatusIcon(item.status)}
                        label={item.status}
                        color={getStatusColor(item.status)}
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditTNA(item.id)}
                          sx={{ 
                            color: 'primary.main',
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteTNA(item.id)}
                          sx={{ 
                            color: 'error.main',
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );

  // List View (Your original ListView with enhancements)
  const ListView = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader 
        title="TNA List View"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              startIcon={<ExportIcon />} 
              variant="outlined"
              onClick={() => alert('Export functionality to be implemented')}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderWidth: 2
                }
              }}
            >
              Export
            </Button>
            <Button 
              startIcon={<AddIcon />} 
              variant="contained" 
              onClick={handleAddTNA}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                },
                transition: 'all 0.3s'
              }}
            >
              Add TNA
            </Button>
          </Box>
        }
        sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiCardHeader-title': {
            fontWeight: 600
          }
        }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              '& th': { 
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedItems.length > 0 && selectedItems.length < filteredData.length}
                  checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>TNA ID</TableCell>
              <TableCell>Order Details</TableCell>
              <TableCell>Factory & Merchandiser</TableCell>
              <TableCell>Timeline</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow 
                  key={item.id} 
                  hover 
                  selected={selectedItems.indexOf(item.id) !== -1}
                  sx={{ 
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      transform: 'scale(1.002)'
                    }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.indexOf(item.id) !== -1}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {item.id}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {item.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {item.style}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.buyer}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip 
                        label={item.factory} 
                        size="small" 
                        variant="outlined"
                        sx={{ mb: 0.5, borderRadius: 1 }}
                      />
                      <Typography variant="caption" display="block">
                        {item.merchandiser}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="caption" display="block">
                        Start: {new Date(item.startDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" display="block">
                        End: {new Date(item.endDate).toLocaleDateString()}
                      </Typography>
                      {item.delayDays > 0 && (
                        <Chip 
                          label={`Delay: ${item.delayDays}d`}
                          size="small"
                          color="error"
                          sx={{ mt: 0.5, borderRadius: 1 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={item.overallProgress}
                          sx={{ 
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProgressColor(item.overallProgress)
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2">
                        {item.overallProgress}%
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {item.currentStage}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={getStatusIcon(item.status)}
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.priority}
                      color={getPriorityColor(item.priority)}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          sx={{ 
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.info.main, 0.1),
                              transform: 'scale(1.1)',
                              color: theme.palette.info.main
                            }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditTNA(item.id)}
                          sx={{ 
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteTNA(item.id)}
                          sx={{ 
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Card>
  );

  // Gantt View (Simplified)
  const GanttView = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader 
        title="TNA Gantt Chart View" 
        sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiCardHeader-title': {
            fontWeight: 600
          }
        }}
      />
      <CardContent>
        <Box sx={{ height: 400, overflow: 'auto' }}>
          {filteredData.slice(0, 10).map((item, index) => (
            <Box key={item.id} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ width: 150, fontWeight: 'medium' }}>
                  {item.id}
                </Typography>
                <Box sx={{ 
                  flex: 1, 
                  height: 30, 
                  bgcolor: theme.palette.grey[200],
                  borderRadius: 1,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '10%',
                      width: '60%',
                      height: '100%',
                      bgcolor: theme.palette.primary.main,
                      opacity: 0.7,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="caption" color="white">
                      {item.overallProgress}%
                    </Typography>
                  </Box>
                  {item.stages.slice(0, 5).map((stage, idx) => (
                    <Tooltip key={idx} title={`${stage.name}: ${stage.completion}%`}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: `${10 + idx * 12}%`,
                          width: '10%',
                          height: '100%',
                          bgcolor: stage.status === 'Completed' ? theme.palette.success.main :
                                  stage.status === 'In Progress' ? theme.palette.warning.main :
                                  theme.palette.grey[400],
                          borderRight: '1px solid white',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': {
                            opacity: 0.9,
                            transform: 'scaleY(1.1)'
                          }
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
                <Chip 
                  label={item.status}
                  color={getStatusColor(item.status)}
                  size="small"
                  sx={{ ml: 2, borderRadius: 1 }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  // Main Render
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        p: isMobile ? 2 : 3,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`
      }}>
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            pointerEvents: 'none'
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: 100 + i * 50,
                height: 100 + i * 50,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `${floatAnimation} ${20 + i * 5}s ease-in-out infinite`,
                animationDelay: `${i * 2}s`
              }}
            />
          ))}
        </Box>

        <Container maxWidth="xl">
          {/* Enhanced Header */}
          <Box sx={{ mb: 4 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'stretch' : 'center',
                mb: 2,
                gap: 2
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Zoom in={!loading} timeout={500}>
                  <Typography 
                    variant="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 900,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                      fontSize: { xs: '2rem', md: '2.5rem' }
                    }}
                  >
                    Time & Action (TNA) Plan Dashboard
                  </Typography>
                </Zoom>
                
                <Fade in={!loading} timeout={800}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <RocketLaunchIcon sx={{ 
                      color: theme.palette.primary.main,
                      animation: `${floatAnimation} 3s ease-in-out infinite`
                    }} />
                    Monitor and manage your production timelines efficiently
                  </Typography>
                </Fade>
              </Box>
              
              
            </Box>

           

            {/* Enhanced Stats Cards */}
            <HeaderStatsCards />
            <PerformanceMetrics />
          </Box>

          {/* View Mode Tabs */}
          <Paper 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={viewMode}
                onChange={(e, newValue) => setViewMode(newValue)}
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{ 
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    transition: 'all 0.3s',
                    '&.Mui-selected': {
                      color: theme.palette.primary.main
                    },
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateY(-2px)'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    height: 4,
                    borderRadius: '2px 2px 0 0',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  }
                }}
              >
                <Tab 
                  icon={<DashboardIcon />}
                  iconPosition="start"
                  label="Dashboard View" 
                  value="dashboard"
                />
                <Tab 
                  icon={<ViewListIcon />}
                  iconPosition="start"
                  label="List View" 
                  value="list"
                />
                <Tab 
                  icon={<GanttChartIcon />}
                  iconPosition="start"
                  label="Gantt Chart" 
                  value="gantt"
                />
              </Tabs>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ 
              p: 3, 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              alignItems: 'center',
              background: alpha(theme.palette.primary.main, 0.02)
            }}>
              <TextField
                placeholder="Search TNA, Order, Style, Buyer..."
                variant="outlined"
                size="medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  flex: 1, 
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="medium" sx={{ minWidth: 180 }}>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filters.status}
                  label="Status Filter"
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="On Track">✅ On Track</MenuItem>
                  <MenuItem value="Delayed">⏰ Delayed</MenuItem>
                  <MenuItem value="Completed">🏁 Completed</MenuItem>
                  <MenuItem value="Pending">⏳ Pending</MenuItem>
                  <MenuItem value="At Risk">⚠️ At Risk</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="medium" sx={{ minWidth: 180 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>

              <Button
                startIcon={<FilterAltIcon />}
                variant="contained"
                onClick={() => setSelectedTab(1)}
                sx={{ 
                  height: 56,
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.info.dark}, ${theme.palette.info.main})`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s'
                }}
              >
                Advanced Filters
              </Button>
            </Box>
          </Paper>

          {/* Loading State */}
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '50vh',
              gap: 3
            }}>
              <CircularProgress 
                size={80}
                thickness={2}
                sx={{
                  color: theme.palette.primary.main,
                  animation: `${rotateAnimation} 1.5s linear infinite`
                }}
              />
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Loading Dashboard Data...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                Preparing your production insights
              </Typography>
            </Box>
          ) : (
            <>
              {/* Content based on view mode */}
              {viewMode === 'dashboard' && <DashboardView />}
              {viewMode === 'list' && <ListView />}
              {viewMode === 'gantt' && <GanttView />}
            </>
          )}

          {/* Quick Stats Footer */}
          {viewMode === 'dashboard' && (
            <Slide direction="up" in={!loading} timeout={1400}>
              <Paper sx={{ 
                mt: 4, 
                p: 3, 
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 200,
                    height: 200,
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 70%)`,
                    animation: `${pulseAnimation} 4s ease-in-out infinite`
                  }}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      📊 Performance Summary
                    </Typography>
                  </Grid>
                  {[
                    {
                      label: 'On-Time Delivery Rate',
                      value: `${stats.onTimeDeliveryRate}%`,
                      color: 'primary'
                    },
                    {
                      label: 'Average Progress',
                      value: `${stats.averageProgress}%`,
                      color: 'success'
                    },
                    {
                      label: 'Delayed Projects',
                      value: filteredData.filter(item => item.delayDays > 0).length,
                      color: 'warning'
                    },
                    {
                      label: 'Total Delay Days',
                      value: filteredData.reduce((acc, item) => acc + item.delayDays, 0),
                      color: 'error'
                    },
                    {
                      label: 'Profit Margin Avg',
                      value: `${stats.averageProfitMargin}%`,
                      color: 'secondary'
                    }
                  ].map((stat, index) => (
                    <Grid item xs={12} sm={4} md={2.4} key={index}>
                      <Fade in={!loading} timeout={800 + index * 100}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 800,
                              color: `${stat.color}.main`,
                              mb: 0.5
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Slide>
          )}

          {/* Add/Edit TNA Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>
              {newTNA.id ? 'Edit TNA Plan' : 'Add New TNA Plan'}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Order ID"
                    value={newTNA.orderId}
                    onChange={(e) => setNewTNA({...newTNA, orderId: e.target.value})}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Style Number"
                    value={newTNA.style}
                    onChange={(e) => setNewTNA({...newTNA, style: e.target.value})}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Buyer"
                    value={newTNA.buyer}
                    onChange={(e) => setNewTNA({...newTNA, buyer: e.target.value})}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Factory"
                    value={newTNA.factory}
                    onChange={(e) => setNewTNA({...newTNA, factory: e.target.value})}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Merchandiser"
                    value={newTNA.merchandiser}
                    onChange={(e) => setNewTNA({...newTNA, merchandiser: e.target.value})}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={newTNA.priority}
                      label="Priority"
                      onChange={(e) => setNewTNA({...newTNA, priority: e.target.value})}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Start Date"
                    value={newTNA.startDate}
                    onChange={(date) => setNewTNA({...newTNA, startDate: date})}
                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="End Date"
                    value={newTNA.endDate}
                    onChange={(date) => setNewTNA({...newTNA, endDate: date})}
                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleSaveTNA} 
                variant="contained"
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  }
                }}
              >
                {newTNA.id ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default TNADashboard;