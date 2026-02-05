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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  InputLabel,
  FormControl,
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
  Container,
  Collapse,
  Slider,
  Drawer,
  ListItemIcon,
  ListItemText
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
  Bolt as BoltIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Description as DescriptionIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Checklist as ChecklistIcon,
  Settings as SettingsIcon,
  Build as BuildIcon,
  Factory as FactoryIcon,
  ShoppingBag as ShoppingBagIcon,
  Check as CheckIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  Tune as TuneIcon,
  ViewComfy as ViewComfyIcon,
  CalendarMonth as CalendarMonthIcon,
  TextSnippet as TextSnippetIcon,
  AttachFile as AttachFileIcon,
  NoteAdd as NoteAddIcon,
  Notes as NotesIcon,
  ReceiptLong as ReceiptLongIcon,
  ContentCut as ContentCutIcon,
  Straighten as StraightenIcon,
  ColorLens as ColorLensIcon,
  Palette as PaletteIcon,
  Brush as BrushIcon,
  Wash as WashIcon,
  DryCleaning as DryCleaningIcon,
  Checkroom as CheckroomIcon,
  Iron as IronIcon,
  Warehouse as WarehouseIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  ShowChart as ShowChartIcon,
  DonutLarge as DonutLargeIcon,
  DonutSmall as DonutSmallIcon,
  FilterAltOff as FilterAltOffIcon,
  SortByAlpha as SortByAlphaIcon,
  Numbers as NumbersIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  DashboardCustomize as DashboardCustomizeIcon,
  CompareArrows as CompareArrowsIcon,
  Addchart as AddchartIcon,
  AutoGraph as AutoGraphIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { keyframes } from '@emotion/react';
import * as XLSX from 'xlsx';

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

// Enhanced Mock Data with all stages
const generateMockData = () => {
  const factories = ['Factory A', 'Factory B', 'Factory C', 'Factory D', 'Factory E'];
  const merchandisers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Lee', 'Robert Chen'];
  const buyers = ['H&M', 'Zara', 'Mango', 'Uniqlo', 'Gap', 'Nike', 'Adidas', 'Puma'];

  // All stages as per your requirement
  const allStages = [
    // Order Confirmation Stage
    { name: 'Order Receive', category: 'Order Confirmation', duration: 1 },
    { name: 'Tech Pack Review', category: 'Order Confirmation', duration: 2 },
    { name: 'Costing Approval', category: 'Order Confirmation', duration: 3 },
    { name: 'Delivery Date Finalization', category: 'Order Confirmation', duration: 2 },

    // BOM Finalization
    { name: 'Fabric Details Freeze', category: 'BOM Finalization', duration: 2 },
    { name: 'Trims & Accessories List', category: 'BOM Finalization', duration: 3 },
    { name: 'Packing Material Final', category: 'BOM Finalization', duration: 1 },
    { name: 'Consumption Calculation', category: 'BOM Finalization', duration: 2 },

    // Sampling Stage
    { name: 'Proto Sample', category: 'Sampling', duration: 5 },
    { name: 'Fit Sample', category: 'Sampling', duration: 4 },
    { name: 'Size Set Sample', category: 'Sampling', duration: 6 },
    { name: 'PP Sample (Pre Production)', category: 'Sampling', duration: 5 },
    { name: 'Buyer Approval', category: 'Sampling', duration: 3 },

    // Material Procurement
    { name: 'Fabric Order Placement', category: 'Material Procurement', duration: 2 },
    { name: 'Fabric In-House', category: 'Material Procurement', duration: 10 },
    { name: 'Trims Order', category: 'Material Procurement', duration: 3 },
    { name: 'Trims In-House', category: 'Material Procurement', duration: 7 },
    { name: 'Shade Band Approval', category: 'Material Procurement', duration: 3 },

    // Production Preparation
    { name: 'Pattern Making', category: 'Production Preparation', duration: 4 },
    { name: 'Marker Making', category: 'Production Preparation', duration: 2 },
    { name: 'CAD Approval', category: 'Production Preparation', duration: 3 },
    { name: 'Fabric Inspection (4 Point System)', category: 'Production Preparation', duration: 2 },
    { name: 'Cutting Approval', category: 'Production Preparation', duration: 1 },

    // Production Stage
    { name: 'Cutting Start', category: 'Production', duration: 3 },
    { name: 'Sewing Start', category: 'Production', duration: 10 },
    { name: 'Line Feeding', category: 'Production', duration: 2 },
    { name: 'Output Monitoring', category: 'Production', duration: 15 },
    { name: 'Production Completion', category: 'Production', duration: 2 },

    // Washing/Embroidery/Printing
    { name: 'Process Start', category: 'Special Processes', duration: 3 },
    { name: 'Process End', category: 'Special Processes', duration: 5 },
    { name: 'Quality Check', category: 'Special Processes', duration: 2 },

    // Quality Control
    { name: 'Inline Inspection', category: 'Quality Control', duration: 2 },
    { name: 'Mid Inspection', category: 'Quality Control', duration: 3 },
    { name: 'Final Inspection', category: 'Quality Control', duration: 4 },
    { name: 'Buyer Final Inspection', category: 'Quality Control', duration: 2 },

    // Finishing & Packing
    { name: 'Thread Cutting', category: 'Finishing & Packing', duration: 1 },
    { name: 'Ironing', category: 'Finishing & Packing', duration: 2 },
    { name: 'Tag Attachment', category: 'Finishing & Packing', duration: 1 },
    { name: 'Folding', category: 'Finishing & Packing', duration: 2 },
    { name: 'Poly Packing', category: 'Finishing & Packing', duration: 1 },
    { name: 'Carton Packing', category: 'Finishing & Packing', duration: 1 }
  ];

  const statuses = ['On Track', 'Delayed', 'Completed', 'Pending', 'At Risk'];
  const priorities = ['High', 'Medium', 'Low'];
  const orderStatuses = ['Placed', 'Confirmed', 'In Production', 'Ready for Delivery', 'Delivered'];

  return Array.from({ length: 50 }, (_, i) => {
    const startDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + (30 + Math.floor(Math.random() * 30)) * 24 * 60 * 60 * 1000);
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Generate stages with realistic dates
    const stages = allStages.map((stage, idx) => {
      const stageStart = new Date(startDate.getTime() + (idx * totalDays / allStages.length) * 24 * 60 * 60 * 1000);
      const stageEnd = new Date(stageStart.getTime() + stage.duration * 24 * 60 * 60 * 1000);
      const isCompleted = Math.random() > 0.3;
      const isInProgress = !isCompleted && Math.random() > 0.5;

      return {
        ...stage,
        plannedStartDate: stageStart,
        plannedEndDate: stageEnd,
        actualStartDate: isCompleted ? new Date(stageStart.getTime() + (Math.random() > 0.5 ? 1 : -1) * 24 * 60 * 60 * 1000) : null,
        actualEndDate: isCompleted ? new Date(stageEnd.getTime() + (Math.random() > 0.5 ? 1 : -1) * 24 * 60 * 60 * 1000) : null,
        status: isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending',
        completion: isCompleted ? 100 : isInProgress ? Math.floor(Math.random() * 60) + 20 : 0,
        notes: Math.random() > 0.8 ? 'Some notes about this stage' : '',
        attachments: Math.random() > 0.9 ? ['file1.pdf', 'image.jpg'] : []
      };
    });

    const completedStages = stages.filter(s => s.status === 'Completed').length;
    const overallProgress = Math.round((completedStages / stages.length) * 100);
    const currentStageIndex = Math.min(completedStages, stages.length - 1);
    const currentStage = stages[currentStageIndex];

    return {
      id: `TNA-${1000 + i}`,
      orderId: `ORD-${2000 + i}`,
      style: `STYLE-${3000 + i}`,
      buyer: buyers[Math.floor(Math.random() * buyers.length)],
      factory: factories[Math.floor(Math.random() * factories.length)],
      merchandiser: merchandisers[Math.floor(Math.random() * merchandisers.length)],
      stages: stages,
      currentStage: currentStage.name,
      currentStageCategory: currentStage.category,
      overallProgress: overallProgress,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      startDate: startDate,
      endDate: endDate,
      delayDays: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
      quantity: Math.floor(Math.random() * 5000) + 1000,
      value: Math.floor(Math.random() * 50000) + 10000,
      orderStatus: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      estimatedDelivery: new Date(startDate.getTime() + totalDays * 24 * 60 * 60 * 1000),
      salesAmount: Math.floor(Math.random() * 100000) + 50000,
      profitMargin: Math.floor(Math.random() * 40) + 10,
      // Additional fields for filtering
      fabricType: ['Cotton', 'Polyester', 'Silk', 'Linen', 'Denim'][Math.floor(Math.random() * 5)],
      orderType: ['Regular', 'Urgent', 'Sample', 'Bulk'][Math.floor(Math.random() * 4)],
      season: ['Spring', 'Summer', 'Fall', 'Winter'][Math.floor(Math.random() * 4)],
      department: ['Mens', 'Womens', 'Kids', 'Unisex'][Math.floor(Math.random() * 4)],
      productCategory: ['T-Shirts', 'Jeans', 'Shirts', 'Dresses', 'Jackets'][Math.floor(Math.random() * 5)]
    };
  });
};

const TNADashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State Management
  const [tnaData, setTnaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [viewMode, setViewMode] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    factory: 'all',
    merchandiser: 'all',
    dateRange: 'all',
    buyer: 'all',
    orderType: 'all',
    fabricType: 'all',
    season: 'all',
    department: 'all',
    productCategory: 'all',
    progressRange: [0, 100],
    delayDays: [0, 30]
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
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
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    fabricType: 'Cotton',
    orderType: 'Regular',
    season: 'Spring',
    department: 'Mens',
    productCategory: 'T-Shirts'
  });

  // Advanced Filter Drawer
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Statistics State
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

  // Advanced Filter Data
  useEffect(() => {
    let filtered = [...tnaData];

    // Text Search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.factory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status Filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Priority Filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(item => item.priority === filters.priority);
    }

    // Factory Filter
    if (filters.factory !== 'all') {
      filtered = filtered.filter(item => item.factory === filters.factory);
    }

    // Merchandiser Filter
    if (filters.merchandiser !== 'all') {
      filtered = filtered.filter(item => item.merchandiser === filters.merchandiser);
    }

    // Buyer Filter
    if (filters.buyer !== 'all') {
      filtered = filtered.filter(item => item.buyer === filters.buyer);
    }

    // Order Type Filter
    if (filters.orderType !== 'all') {
      filtered = filtered.filter(item => item.orderType === filters.orderType);
    }

    // Fabric Type Filter
    if (filters.fabricType !== 'all') {
      filtered = filtered.filter(item => item.fabricType === filters.fabricType);
    }

    // Season Filter
    if (filters.season !== 'all') {
      filtered = filtered.filter(item => item.season === filters.season);
    }

    // Department Filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(item => item.department === filters.department);
    }

    // Product Category Filter
    if (filters.productCategory !== 'all') {
      filtered = filtered.filter(item => item.productCategory === filters.productCategory);
    }

    // Progress Range Filter
    filtered = filtered.filter(item =>
      item.overallProgress >= filters.progressRange[0] &&
      item.overallProgress <= filters.progressRange[1]
    );

    // Delay Days Filter
    filtered = filtered.filter(item =>
      item.delayDays >= filters.delayDays[0] &&
      item.delayDays <= filters.delayDays[1]
    );

    // Timeline Filter (Date Range Difference)
    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(item => {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case 'short': return daysDiff <= 30;
          case 'medium': return daysDiff > 30 && daysDiff <= 60;
          case 'long': return daysDiff > 60;
          case 'overdue': return endDate < now;
          default: return true;
        }
      });
    }

    setFilteredData(filtered);
    calculateEnhancedStats(filtered);
  }, [searchTerm, filters, tnaData]);

  // Get unique values for filters
  const uniqueValues = useMemo(() => {
    const buyers = [...new Set(tnaData.map(item => item.buyer))];
    const factories = [...new Set(tnaData.map(item => item.factory))];
    const merchandisers = [...new Set(tnaData.map(item => item.merchandiser))];
    const fabricTypes = [...new Set(tnaData.map(item => item.fabricType))];
    const orderTypes = [...new Set(tnaData.map(item => item.orderType))];
    const seasons = [...new Set(tnaData.map(item => item.season))];
    const departments = [...new Set(tnaData.map(item => item.department))];
    const productCategories = [...new Set(tnaData.map(item => item.productCategory))];

    return {
      buyers,
      factories,
      merchandisers,
      fabricTypes,
      orderTypes,
      seasons,
      departments,
      productCategories
    };
  }, [tnaData]);

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = selectedItems.length > 0
      ? tnaData.filter(item => selectedItems.includes(item.id))
      : filteredData;

    const exportData = dataToExport.map(item => ({
      'TNA ID': item.id,
      'Order ID': item.orderId,
      'Style': item.style,
      'Buyer': item.buyer,
      'Factory': item.factory,
      'Merchandiser': item.merchandiser,
      'Current Stage': item.currentStage,
      'Progress %': item.overallProgress,
      'Status': item.status,
      'Priority': item.priority,
      'Start Date': new Date(item.startDate).toLocaleDateString(),
      'End Date': new Date(item.endDate).toLocaleDateString(),
      'Delay Days': item.delayDays,
      'Quantity': item.quantity,
      'Order Value': `$${item.value.toLocaleString()}`,
      'Order Status': item.orderStatus,
      'Fabric Type': item.fabricType,
      'Order Type': item.orderType,
      'Season': item.season,
      'Department': item.department,
      'Product Category': item.productCategory,
      'Profit Margin': `${item.profitMargin}%`
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TNA Data");

    // Auto-size columns
    const wscols = Object.keys(exportData[0] || {}).map(() => ({ width: 20 }));
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, `TNA_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

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

  // Stage Category Icon
  const getStageCategoryIcon = (category) => {
    switch (category) {
      case 'Order Confirmation': return <AssignmentIcon />;
      case 'BOM Finalization': return <FormatListBulletedIcon />;
      case 'Sampling': return <BuildIcon />;
      case 'Material Procurement': return <WarehouseIcon />;
      case 'Production Preparation': return <ContentCutIcon />;
      case 'Production': return <FactoryIcon />;
      case 'Special Processes': return <BrushIcon />;
      case 'Quality Control': return <CheckIcon />;
      case 'Finishing & Packing': return <LocalShippingIcon />;
      default: return <AssignmentIcon />;
    }
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
      setTnaData(prev => prev.map(item =>
        item.id === newTNA.id ? newTNA : item
      ));
    } else {
      const newItem = {
        ...newTNA,
        id: `TNA-${1000 + tnaData.length}`,
        status: 'Pending',
        overallProgress: 0,
        currentStage: 'Order Receive',
        currentStageCategory: 'Order Confirmation',
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
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      fabricType: 'Cotton',
      orderType: 'Regular',
      season: 'Spring',
      department: 'Mens',
      productCategory: 'T-Shirts'
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

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      factory: 'all',
      merchandiser: 'all',
      dateRange: 'all',
      buyer: 'all',
      orderType: 'all',
      fabricType: 'all',
      season: 'all',
      department: 'all',
      productCategory: 'all',
      progressRange: [0, 100],
      delayDays: [0, 30]
    });
    setSearchTerm('');
    setFilterDrawerOpen(false);
  };

  // Enhanced Header Cards Component
  const HeaderStatsCards = () => {
    const cards = [
      {
        title: 'Total Projects',
        value: stats.totalProjects,
        icon: <AssignmentIcon sx={{ fontSize: 24 }} />,
        color: theme.palette.primary.main,
        bgColor: alpha(theme.palette.primary.main, 0.1),
        trend: '+12%',
        description: 'Active TNA Plans',
        animationDelay: '0s',
      },
      {
        title: 'Pending Orders',
        value: stats.pendingOrders,
        icon: <ShoppingCartIcon sx={{ fontSize: 24 }} />,
        color: theme.palette.warning.main,
        bgColor: alpha(theme.palette.warning.main, 0.1),
        trend: '+5%',
        description: 'Awaiting Confirmation',
        animationDelay: '0.1s'
      },
      {
        title: 'Ready for Delivery',
        value: stats.readyForDelivery,
        icon: <LocalShippingIcon sx={{ fontSize: 24 }} />,
        color: theme.palette.success.main,
        bgColor: alpha(theme.palette.success.main, 0.1),
        trend: '+8%',
        description: 'Ready to Ship',
        animationDelay: '0.2s'
      },
      {
        title: 'Orders Delivered',
        value: stats.ordersDelivered,
        icon: <AssignmentTurnedInIcon sx={{ fontSize: 24 }} />,
        color: theme.palette.info.main,
        bgColor: alpha(theme.palette.info.main, 0.1),
        trend: '+15%',
        description: 'Completed Orders',
        animationDelay: '0.3s'
      },
      {
        title: 'Total Revenue',
        value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`,
        icon: <MonetizationOnIcon sx={{ fontSize: 24 }} />,
        color: theme.palette.secondary.main,
        bgColor: alpha(theme.palette.secondary.main, 0.1),
        trend: '+18%',
        description: 'YTD Revenue',
        animationDelay: '0.4s'
      }

    ];

    return (
      <Slide direction="up" in={!loading} timeout={800}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {cards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 4, md: 2.4 }} key={index}>
              <Grow in={!loading} timeout={600 + index * 100}>
                <Card
                  sx={{
                    height: '90%',
                    borderRadius: 2,
                    width: '100%',
                    background: `linear-gradient(135deg, ${card.bgColor} 0%, ${alpha(card.bgColor, 0.5)} 100%)`,
                    border: `1px solid ${alpha(card.color, 0.2)}`,
                    boxShadow: `0 4px 12px ${alpha(card.color, 0.1)}`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${alpha(card.color, 0.2)}`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: alpha(card.color, 0.2),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1,
                        }}
                      >
                        <Box sx={{ color: card.color }}>
                          {card.icon}
                        </Box>
                      </Box>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: card.color,
                          mb: 0.5
                        }}
                      >
                        {card.value}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 0.5
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
                        icon={<ArrowUpwardIcon sx={{ fontSize: 12 }} />}
                        label={card.trend}
                        size="small"
                        sx={{
                          bgcolor: alpha(card.color, 0.1),
                          color: card.color,
                          fontWeight: 600,
                          fontSize: '0.7rem'
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
      <Grid container spacing={2} sx={{ mb: 4 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }} item xs={12} sm={6} md={3} key={index}>
            <Grow in={!loading} timeout={800 + index * 100}>
              <Card
                sx={{
                  borderRadius: 2,
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 16px ${alpha(metric.color, 0.15)}`
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        bgcolor: alpha(metric.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1.5
                      }}
                    >
                      <Box sx={{ color: metric.color, fontSize: 20 }}>
                        {metric.icon}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Progress</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {metric.trend}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={metric.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(metric.color, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
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

  // Advanced Filter Drawer Component
  const AdvancedFilterDrawer = () => (
    <Drawer
      anchor="right"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 3,
          backgroundColor: 'white'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TuneIcon /> Advanced Filters
        </Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, backgroundColor: 'white' }}>
        {/* Progress Range */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Progress Range: {filters.progressRange[0]}% - {filters.progressRange[1]}%
          </Typography>
          <Slider
            value={filters.progressRange}
            onChange={(e, newValue) => setFilters({ ...filters, progressRange: newValue })}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            sx={{ color: theme.palette.primary.main }}
          />
        </Box>

        {/* Delay Days Range */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Delay Days: {filters.delayDays[0]} - {filters.delayDays[1]} days
          </Typography>
          <Slider
            value={filters.delayDays}
            onChange={(e, newValue) => setFilters({ ...filters, delayDays: newValue })}
            valueLabelDisplay="auto"
            min={0}
            max={30}
            sx={{ color: theme.palette.error.main }}
          />
        </Box>

        {/* Timeline Duration */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Timeline Duration
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            >
              <MenuItem value="all">All Durations</MenuItem>
              <MenuItem value="short">Recent (≤ 15 days)</MenuItem>
              <MenuItem value="short">Short (≤ 30 days)</MenuItem>
              <MenuItem value="medium">Medium (31-60 days)</MenuItem>
              <MenuItem value="long">Long ( ≥ 60 days)</MenuItem>
              <MenuItem value="overdue">Overdue Projects</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Buyer Filter */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>Buyer</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.buyer}
              onChange={(e) => setFilters({ ...filters, buyer: e.target.value })}
            >
              <MenuItem value="all">All Buyers</MenuItem>
              {uniqueValues.buyers.map(buyer => (
                <MenuItem key={buyer} value={buyer}>{buyer}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Order Type Filter */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>Order Type</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.orderType}
              onChange={(e) => setFilters({ ...filters, orderType: e.target.value })}
            >
              <MenuItem value="all">All Types</MenuItem>
              {uniqueValues.orderTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Fabric Type Filter */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>Fabric Type</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.fabricType}
              onChange={(e) => setFilters({ ...filters, fabricType: e.target.value })}
            >
              <MenuItem value="all">All Fabrics</MenuItem>
              {uniqueValues.fabricTypes.map(fabric => (
                <MenuItem key={fabric} value={fabric}>{fabric}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Season Filter */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>Season</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.season}
              onChange={(e) => setFilters({ ...filters, season: e.target.value })}
            >
              <MenuItem value="all">All Seasons</MenuItem>
              {uniqueValues.seasons.map(season => (
                <MenuItem key={season} value={season}>{season}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Department Filter */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>Department</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <MenuItem value="all">All Departments</MenuItem>
              {uniqueValues.departments.map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Product Category Filter */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>Product Category</Typography>
          <FormControl fullWidth size="small">
            <Select
              value={filters.productCategory}
              onChange={(e) => setFilters({ ...filters, productCategory: e.target.value })}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {uniqueValues.productCategories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ mt: 'auto', pt: 3, display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={resetFilters}
          startIcon={<FilterAltOffIcon />}
        >
          Clear All
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => setFilterDrawerOpen(false)}
          startIcon={<CheckIcon />}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );

  // Export Menu Component
  const ExportMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <Button
          variant="contained"
          startIcon={<ExportIcon />}
          onClick={handleClick}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
            }
          }}
        >
          Export
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { exportToExcel(); handleClose(); }}>
            <ListItemIcon>
              <FileIcon style={{ color: '#217346' }} />
            </ListItemIcon>
            <ListItemText primary="Export to Excel (.xlsx)" />
          </MenuItem>
          <MenuItem onClick={() => {
            exportToExcel();
            handleClose();
          }}>
            <ListItemIcon>
              <FileIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Export to CSV" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { alert(`Selected ${selectedItems.length} rows exported!`); handleClose(); }}>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            <ListItemText primary={`Export Selected (${selectedItems.length})`} />
          </MenuItem>
        </Menu>
      </>
    );
  };

  const ProductionStagesTimeline = () => {
    const categories = [
      { name: 'Order Confirmation', icon: <AssignmentIcon />, color: theme.palette.primary.main },
      { name: 'BOM Finalization', icon: <FormatListBulletedIcon />, color: theme.palette.secondary.main },
      { name: 'Sampling', icon: <BuildIcon />, color: theme.palette.warning.main },
      { name: 'Material Procurement', icon: <WarehouseIcon />, color: theme.palette.info.main },
      { name: 'Production Preparation', icon: <ContentCutIcon />, color: theme.palette.success.main },
      { name: 'Production', icon: <FactoryIcon />, color: theme.palette.error.main },
      { name: 'Special Processes', icon: <BrushIcon />, color: theme.palette.grey[600] },
      { name: 'Quality Control', icon: <CheckIcon />, color: '#9c27b0' }, // purple color
      { name: 'Finishing & Packing', icon: <LocalShippingIcon />, color: '#ff9800' }, // orange color
    ];

    const stageCounts = categories.map(category => ({
      name: category.name,
      count: tnaData.flatMap(item => item.stages)
        .filter(stage => stage.category === category.name)
        .filter(stage => stage.status === 'Completed').length,
      total: tnaData.flatMap(item => item.stages)
        .filter(stage => stage.category === category.name).length,
      color: category.color
    }));

    return (
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimelineIcon style={{ fontSize: 20, color: theme.palette.primary.main }} />
              <Typography variant="h6">Production Stages Overview</Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={1}>
            {categories.map((category, index) => {
              const stages = tnaData.flatMap(item => item.stages)
                .filter(stage => stage.category === category.name);
              const completed = stages.filter(s => s.status === 'Completed').length;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card sx={{
                    height: '100%',
                    borderLeft: `3px solid ${category.color}`,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <Box sx={{ color: category.color, fontSize: 18 }}>
                          {category.icon}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {category.name}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Completed</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{completed}</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={stages.length ? (completed / stages.length) * 100 : 0}
                          sx={{ height: 4, borderRadius: 1 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Total: {stages.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stages.length ? Math.round((completed / stages.length) * 100) : 0}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Dashboard View
  const DashboardView = () => (
    <Grid container spacing={2}>
      {/* Statistics Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 2.4 }} >
        <Card sx={{
          height: '100%',
          borderRadius: 2,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.totalProjects}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total TNA Plans
            </Typography>
            <TrendingUpIcon sx={{ mt: 1, color: 'success.main', fontSize: 20 }} />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2.4 }} >
        <Card sx={{
          height: '100%',
          borderRadius: 2,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 16px ${alpha(theme.palette.success.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="success.main" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.onTrack}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              On Track
            </Typography>
            <CheckCircleIcon sx={{ mt: 1, color: 'success.main', fontSize: 20 }} />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2.4 }} >
        <Card sx={{
          height: '100%',
          borderRadius: 2,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 16px ${alpha(theme.palette.error.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="error.main" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.delayed}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Delayed
            </Typography>
            <ErrorIcon sx={{ mt: 1, color: 'error.main', fontSize: 20 }} />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2.4 }} >
        <Card sx={{
          height: '100%',
          borderRadius: 2,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary.main" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.completed}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Completed
            </Typography>
            <CheckCircleIcon sx={{ mt: 1, color: 'primary.main', fontSize: 20 }} />
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2.4 }} >
        <Card sx={{
          height: '100%',
          borderRadius: 2,
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 16px ${alpha(theme.palette.warning.main, 0.15)}`
          }
        }}>
          <CardContent sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="warning.main" gutterBottom sx={{ fontWeight: 800 }}>
              {stats.atRisk}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              At Risk
            </Typography>
            <WarningIcon sx={{ mt: 1, color: 'warning.main', fontSize: 20 }} />
          </CardContent>
        </Card>
      </Grid>

      {/* Production Stages Timeline */}
      <Grid size={{ xs: 12 }}>
        <ProductionStagesTimeline />
      </Grid>

      {/* Charts */}
      <Grid size={{ xs: 12, md: 8 }} >
        <Card sx={{ borderRadius: 2 }}>
          <CardHeader
            title="TNA Status Distribution"
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiCardHeader-title': {
                fontWeight: 600,
                fontSize: '1rem',
                width: '350px',
              }
            }}
          />
          <CardContent sx={{ height: 300, p: 2 }}>
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

      <Grid size={{ xs: 12, md: 4 }} >
        <Card sx={{ borderRadius: 2 }}>
          <CardHeader
            title="Top 5 Progress"
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '& .MuiCardHeader-title': {
                fontWeight: 600,
                fontSize: '1rem',
                width: '350px',
              }
            }}
          />
          <CardContent sx={{ height: 300, p: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar
                  dataKey="progress"
                  fill={theme.palette.primary.main}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent TNAs */}
      <Grid size={{ xs: 12, md: 12 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardHeader
            title="Recent Time & Action Plans"
            action={
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddTNA}
                size="small"
                sx={{
                  borderRadius: 1,
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
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
                fontWeight: 600,
                fontSize: '1rem'
              },
              p: 1.5
            }}
          />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{
                  '& th': {
                    fontWeight: 600,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    py: 1
                  }
                }}>
                  <TableCell sx={{ fontSize: '0.8rem' }}>TNA ID</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>Order ID</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>Style</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>Buyer</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>Factory</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>Current Stage</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>Progress</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>Status</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>Actions</TableCell>
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
                      }
                    }}
                  >
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {item.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{item.orderId}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{item.style}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{item.buyer}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Chip
                        label={item.factory}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 0.5, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Box>
                        <Typography variant="body2" fontSize="0.8rem">{item.currentStage}</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={item.stages.find(s => s.name === item.currentStage)?.completion || 0}
                          sx={{
                            mt: 0.5,
                            height: 3,
                            borderRadius: 1,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProgressColor(item.overallProgress)
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={item.overallProgress}
                            sx={{
                              height: 6,
                              borderRadius: 2,
                              backgroundColor: theme.palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getProgressColor(item.overallProgress)
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 30 }}>
                          <Typography variant="body2" color="textSecondary" fontSize="0.8rem">
                            {`${item.overallProgress}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Chip
                        icon={getStatusIcon(item.status)}
                        label={item.status}
                        color={getStatusColor(item.status)}
                        size="small"
                        sx={{ borderRadius: 0.5, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditTNA(item.id)}
                          sx={{
                            color: 'primary.main',
                            padding: 0.5,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
                            padding: 0.5,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
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

  // List View
  const ListView = () => (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader
        title="TNA List View"
        action={
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <ExportMenu />
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={handleAddTNA}
              size="small"
              sx={{
                borderRadius: 1,
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
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
            fontWeight: 600,
            fontSize: '1rem'
          },
          p: 1.5
        }}
      />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{
              '& th': {
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                py: 1,
                fontSize: '0.8rem'
              }
            }}>
              <TableCell padding="checkbox" sx={{ fontSize: '0.8rem' }}>
                <Checkbox
                  size="small"
                  indeterminate={selectedItems.length > 0 && selectedItems.length < filteredData.length}
                  checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>TNA ID</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Order Details</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Factory & Merchandiser</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Timeline</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Progress %</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Status</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Priority</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => {
                const startDate = new Date(item.startDate);
                const endDate = new Date(item.endDate);
                const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

                return (
                  <TableRow
                    key={item.id}
                    hover
                    selected={selectedItems.indexOf(item.id) !== -1}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      }
                    }}
                  >
                    <TableCell padding="checkbox" sx={{ fontSize: '0.8rem' }}>
                      <Checkbox
                        size="small"
                        checked={selectedItems.indexOf(item.id) !== -1}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {item.id}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.orderId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {item.style}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {item.buyer}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          <Chip label={item.productCategory} size="small" sx={{ fontSize: '0.6rem' }} />
                          <Chip label={item.fabricType} size="small" variant="outlined" sx={{ fontSize: '0.6rem' }} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Box>
                        <Chip
                          label={item.factory}
                          size="small"
                          variant="outlined"
                          sx={{ mb: 0.5, borderRadius: 0.5, fontSize: '0.7rem' }}
                        />
                        <Typography variant="caption" display="block">
                          {item.merchandiser}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Box>
                        <Typography variant="caption" display="block">
                          Start: {startDate.toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" display="block">
                          End: {endDate.toLocaleDateString()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="caption">
                            {daysDiff} days
                          </Typography>
                        </Box>
                        {item.delayDays > 0 && (
                          <Chip
                            label={`Delay: ${item.delayDays}d`}
                            size="small"
                            color="error"
                            sx={{ mt: 0.5, borderRadius: 0.5, fontSize: '0.6rem' }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={item.overallProgress}
                            sx={{
                              height: 5,
                              borderRadius: 2,
                              backgroundColor: theme.palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getProgressColor(item.overallProgress)
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontSize="0.8rem">
                          {item.overallProgress}%
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {item.currentStage}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Chip
                        icon={getStatusIcon(item.status)}
                        label={item.status}
                        color={getStatusColor(item.status)}
                        size="small"
                        sx={{ borderRadius: 0.5, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Chip
                        label={item.priority}
                        color={getPriorityColor(item.priority)}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 0.5, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            sx={{
                              padding: 0.5,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.info.main, 0.1),
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
                              padding: 0.5,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
                              padding: 0.5,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.8rem'
          }
        }}
      />
    </Card>
  );

  // Main Render
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{
        p: isMobile ? 1 : 2,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`
      }}>
        <Container maxWidth="xl">
          {/* Enhanced Header */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                mb: 1,
                gap: 2
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Zoom in={!loading} timeout={500}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    Time & Action (TNA) Plan Dashboard
                  </Typography>
                </Zoom>

                <Fade in={!loading} timeout={800}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <RocketLaunchIcon sx={{
                      color: theme.palette.primary.main,
                      fontSize: 16
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
              mb: 3,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
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
                    minHeight: 48,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&.Mui-selected': {
                      color: theme.palette.primary.main
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  }
                }}
              >
                <Tab
                  icon={<DashboardIcon />}
                  iconPosition="start"
                  label="Dashboard"
                  value="dashboard"
                />
                <Tab
                  icon={<ViewListIcon />}
                  iconPosition="start"
                  label="List View"
                  value="list"
                />
              </Tabs>
            </Box>

            {/* Search and Filters */}
            <Box sx={{
              p: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
              background: alpha(theme.palette.primary.main, 0.02)
            }}>
              <TextField
                placeholder="Search TNA, Order, Style..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  flex: 1,
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    background: 'white',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ fontSize: '0.9rem' }}>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  sx={{ borderRadius: 1, fontSize: '0.9rem' }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="On Track">On Track</MenuItem>
                  <MenuItem value="Delayed">Delayed</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="At Risk">At Risk</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ fontSize: '0.9rem' }}>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  sx={{ borderRadius: 1, fontSize: '0.9rem' }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>

              <Button
                startIcon={<FilterAltIcon />}
                variant="contained"
                size="small"
                onClick={() => setFilterDrawerOpen(true)}
                sx={{
                  borderRadius: 1,
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.info.dark}, ${theme.palette.info.main})`,
                  }
                }}
              >
                Advanced
                {Object.values(filters).filter(val => val !== 'all' && !Array.isArray(val)).length > 0 && (
                  <Badge
                    badgeContent={Object.values(filters).filter(val => val !== 'all' && !Array.isArray(val)).length}
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>

              <Button
                startIcon={<FilterAltOffIcon />}
                variant="outlined"
                size="small"
                onClick={resetFilters}
                sx={{
                  borderRadius: 1,
                  fontWeight: 600,
                }}
              >
                Clear
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
              gap: 2
            }}>
              <CircularProgress
                size={60}
                thickness={2}
                sx={{
                  color: theme.palette.primary.main,
                  animation: `${rotateAnimation} 1.5s linear infinite`
                }}
              />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Loading Dashboard Data...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Content based on view mode */}
              {viewMode === 'dashboard' && <DashboardView />}
              {viewMode === 'list' && <ListView />}
            </>
          )}

          {/* Quick Stats Footer */}
          {viewMode === 'dashboard' && (
            <Slide direction="up" in={!loading} timeout={1400}>
              <Paper sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                      📊 Performance Summary
                    </Typography>
                  </Grid>
                  {[
                    {
                      label: 'On-Time Delivery',
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
                      label: 'Profit Margin',
                      value: `${stats.averageProfitMargin}%`,
                      color: 'secondary'
                    }
                  ].map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 4, md: 2.4 }} key={index}>
                      <Fade in={!loading} timeout={800 + index * 100}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
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

          {/* Advanced Filter Drawer */}
          <AdvancedFilterDrawer />

          {/* Add/Edit TNA Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontSize: '1rem' }}>
              {newTNA.id ? 'Edit TNA Plan' : 'Add New TNA Plan'}
            </DialogTitle>
            <DialogContent dividers sx={{ p: 2 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="Order ID"
                    size="small"
                    value={newTNA.orderId}
                    onChange={(e) => setNewTNA({ ...newTNA, orderId: e.target.value })}
                    margin="dense"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="Style Number"
                    size="small"
                    value={newTNA.style}
                    onChange={(e) => setNewTNA({ ...newTNA, style: e.target.value })}
                    margin="dense"
                  />
                </Grid>
               <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="Buyer"
                    size="small"
                    value={newTNA.buyer}
                    onChange={(e) => setNewTNA({ ...newTNA, buyer: e.target.value })}
                    margin="dense"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="Factory"
                    size="small"
                    value={newTNA.factory}
                    onChange={(e) => setNewTNA({ ...newTNA, factory: e.target.value })}
                    margin="dense"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    label="Merchandiser"
                    size="small"
                    value={newTNA.merchandiser}
                    onChange={(e) => setNewTNA({ ...newTNA, merchandiser: e.target.value })}
                    margin="dense"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <FormControl fullWidth size="small" margin="dense">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={newTNA.priority}
                      label="Priority"
                      onChange={(e) => setNewTNA({ ...newTNA, priority: e.target.value })}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <FormControl fullWidth size="small" margin="dense">
                    <InputLabel>Fabric Type</InputLabel>
                    <Select
                      value={newTNA.fabricType}
                      label="Fabric Type"
                      onChange={(e) => setNewTNA({ ...newTNA, fabricType: e.target.value })}
                    >
                      <MenuItem value="Cotton">Cotton</MenuItem>
                      <MenuItem value="Polyester">Polyester</MenuItem>
                      <MenuItem value="Silk">Silk</MenuItem>
                      <MenuItem value="Linen">Linen</MenuItem>
                      <MenuItem value="Denim">Denim</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <FormControl fullWidth size="small" margin="dense">
                    <InputLabel>Order Type</InputLabel>
                    <Select
                      value={newTNA.orderType}
                      label="Order Type"
                      onChange={(e) => setNewTNA({ ...newTNA, orderType: e.target.value })}
                    >
                      <MenuItem value="Regular">Regular</MenuItem>
                      <MenuItem value="Urgent">Urgent</MenuItem>
                      <MenuItem value="Sample">Sample</MenuItem>
                      <MenuItem value="Bulk">Bulk</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <DatePicker
                    label="Start Date"
                    value={newTNA.startDate}
                    onChange={(date) => setNewTNA({ ...newTNA, startDate: date })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        margin: 'dense'
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <DatePicker
                    label="End Date"
                    value={newTNA.endDate}
                    onChange={(date) => setNewTNA({ ...newTNA, endDate: date })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        margin: 'dense'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 1 }}>
              <Button onClick={() => setOpenDialog(false)} size="small">Cancel</Button>
              <Button
                onClick={handleSaveTNA}
                variant="contained"
                size="small"
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