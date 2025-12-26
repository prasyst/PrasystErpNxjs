'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
  Collapse,
  Paper
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AddTask as AddTaskIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  Receipt as ReceiptIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocalOffer as TicketIcon
} from '@mui/icons-material';
import EscalatorIcon from '@mui/icons-material/Escalator';
import { useRecentPaths } from '../../app/context/RecentPathsContext';

const EmployeeSidebar = ({ isCollapsed, setIsCollapsed, isMobile, isOpen, onClose }) => {
  const theme = useTheme();
  const sidebarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('');
  const [activeChild, setActiveChild] = useState(null);
  const [activeGrandchild, setActiveGrandchild] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const { addRecentPath } = useRecentPaths();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [userName, setUserName] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const storedName = localStorage.getItem('EMP_NAME') || localStorage.getItem('USER_NAME');
    if (storedName) {
      const shortName = storedName.length > 3 ? storedName.substring(0, 11) + '..' : storedName;
      setUserName(shortName);
    }
  }, []);

  const employeeMenuItems = [
    {
      name: 'Ticketing',
      icon: TicketIcon,
      path: '/employeepage?activeTab=ticketing',
      children: [
        { 
          name: 'Dashboard', 
          icon: ReceiptIcon, 
          path: '/emp-tickets/ticket-dashboard' 
        },
        { 
          name: 'My Tickets', 
          icon: AssignmentTurnedInIcon, 
          path: '/emp-tickets/all-tickets' 
        },
        { 
          name: 'Escalate Tickets', 
          icon: EscalatorIcon, 
          path: '/emp-tickets/ticket-esclation/' 
        },
        { 
          name: 'Raise Ticket', 
          icon: AddTaskIcon, 
          path: '/emp-tickets/create-tickets/' 
        },
      ],
    },
  ];

  const handleNavigationWithTracking = (path, name, isGrandchild = false) => {
    if (path && path !== '#') {
      if (isGrandchild) {
        addRecentPath(path, name);
      }
      
      if (isMobile && onClose) {
        onClose();
      }

      router.push(path);
    }
  };

  const toggleSection = (name) => {
    setOpenSections(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleParentClick = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setActiveItem(item.name);
    setActiveChild(null);
    setActiveGrandchild(null);
    
    if (item.children && item.children.length > 0) {
      toggleSection(item.name);
    }
    
    if (item.path && item.path !== '#') {
      handleNavigationWithTracking(item.path, item.name, false);
    }
  };

  const handleChildClick = (child, parentName, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setActiveItem(parentName);
    setActiveChild(child.name);
    setActiveGrandchild(null);
    
    if (child.children && child.children.length > 0) {
      toggleSection(child.name);
    }
    
    let targetPath = child.path;

    if (!targetPath || targetPath === '#') {
      if (parentName === 'Ticketing') {
        const ticketingMap = {
          'Dashboard': 'dashboard',
          'Raise Ticket': 'raise-ticket',
          'My Tickets': 'my-tickets',
        };
        const tab = ticketingMap[child.name] || 'ticketing';
        targetPath = `/employeepage?activeTab=${tab}`;
      }
    }
    
    if (targetPath && targetPath !== '#') {
      handleNavigationWithTracking(targetPath, child.name, false);
    }
    
    if (parentName === 'Ticketing') {
      setOpenSections(prev => ({ ...prev, [parentName]: true }));
    }
  };

  const handleGrandchildClick = (grandchild, parentName, childName, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setActiveItem(parentName);
    setActiveChild(childName);
    setActiveGrandchild(grandchild.name);
    
    setOpenSections(prev => ({
      ...prev,
      [parentName]: true,
      [childName]: true
    }));
    
    if (grandchild.path && grandchild.path !== '#') {
      handleNavigationWithTracking(grandchild.path, grandchild.name, true);
    }
  };

  useEffect(() => {
    const findActiveItems = () => {
      for (const item of employeeMenuItems) {
        if (item.path && pathname.includes(item.path.split('?')[0])) {
          setActiveItem(item.name);
          setOpenSections(prev => ({ ...prev, [item.name]: true }));
          return true;
        }

        if (item.children) {
          for (const child of item.children) {
            if (child.path && pathname.includes(child.path.split('?')[0])) {
              setActiveItem(item.name);
              setActiveChild(child.name);
              setActiveGrandchild(null);
              setOpenSections(prev => ({ ...prev, [item.name]: true }));
              return true;
            }
          }
        }
      }

      if (pathname.startsWith('/employeepage') || pathname.includes('ticket')) {
        const url = new URL(window.location.href);
        const activeTab = url.searchParams.get('activeTab');
        
        if (activeTab) {
          setActiveItem('Ticketing');
          setOpenSections(prev => ({ ...prev, Ticketing: true }));
          
          const tabToChildMap = {
            'dashboard': 'Dashboard',
            'raise-ticket': 'Raise Ticket',
            'my-tickets': 'My Tickets',
          };
          
          setActiveChild(tabToChildMap[activeTab] || null);
          setActiveGrandchild(null);
          return true;
        }

        if (pathname.includes('ticket-dashboard')) {
          setActiveItem('Ticketing');
          setActiveChild('Dashboard');
          setOpenSections(prev => ({ ...prev, Ticketing: true }));
        } else if (pathname.includes('create-tickets')) {
          setActiveItem('Ticketing');
          setActiveChild('Raise Ticket');
          setOpenSections(prev => ({ ...prev, Ticketing: true }));
        } else if (pathname.includes('all-tickets')) {
          setActiveItem('Ticketing');
          setActiveChild('My Tickets');
          setOpenSections(prev => ({ ...prev, Ticketing: true }));
        }
      }
      
      return false;
    };

    findActiveItems();
  }, [pathname]);

  useEffect(() => {
    if (isOpen && isMobile) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, isMobile]);

  const itemMatchesSearch = (item, query) => {
    if (!query.trim()) return true;
    
    const searchLower = query.toLowerCase().trim();
    const itemNameLower = item.name.toLowerCase();
    
    if (itemNameLower.includes(searchLower)) return true;
    
    if (item.children) {
      return item.children.some(child => itemMatchesSearch(child, query));
    }
    
    return false;
  };

  const filterMenuTree = (items, query) => {
    if (!query.trim()) return items.filter(item => item);
    
    return items
      .filter(item => {
        if (!item) return false;
        return itemMatchesSearch(item, query);
      })
      .map(item => {
        if (!item.children || item.children.length === 0) return item;
        
        const filteredChildren = filterMenuTree(item.children, query);
        
        if (filteredChildren.length > 0 || itemMatchesSearch(item, query)) {
          return {
            ...item,
            children: filteredChildren
          };
        }
        
        return item;
      });
  };

  const getFilteredMenuItems = () => {
    if (!searchQuery.trim()) return employeeMenuItems.filter(item => item);
    return filterMenuTree(employeeMenuItems, searchQuery);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      const filteredItems = filterMenuTree(employeeMenuItems, value);
      const sectionsToOpen = {};
      
      const collectParents = (items, parent = null) => {
        items.forEach(item => {
          if (!item) return;
          
          if (parent && itemMatchesSearch(item, value)) {
            sectionsToOpen[parent.name] = true;
          }
          
          if (item.children) {
            collectParents(item.children, item);
          }
        });
      };
      
      collectParents(filteredItems);
      setOpenSections(prev => ({ ...prev, ...sectionsToOpen }));
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setOpenSections({});
  };

  const menuItems = getFilteredMenuItems();

  const renderMenuItems = useCallback((items, level = 0) => {
    return items
      .filter(item => item)
      .map((item, index) => {
        const IconComponent = item.icon;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openSections[item.name] || (searchQuery.trim() && hasChildren);
        const isActive = activeItem === item.name;
        const isHovered = hoveredItem === `${item.name}-${level}`;

        return (
          <Box key={`${item.name}-${index}-${level}`}>
            <ListItem
              disablePadding
            >
              <ListItemButton
                onClick={(e) => {
                  if (level === 0) {
                    handleParentClick(item, e);
                  } else if (level === 1) {
                    handleChildClick(item, activeItem, e);
                  }
                }}
                onMouseEnter={() => setHoveredItem(`${item.name}-${level}`)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  borderRadius: 1,
                  backgroundColor: isActive 
                    ? theme.palette.primary.main 
                    : isHovered 
                      ? theme.palette.action.hover 
                      : 'transparent',
                  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  borderLeft: isActive 
                    ? `4px solid ${theme.palette.primary.dark}`
                    : '4px solid transparent',
                  '&:hover': {
                    backgroundColor: isActive 
                      ? theme.palette.primary.main 
                      : theme.palette.action.hover,
                  },
                  height: level === 0 ? 35 : 35,
                }}
              >
                {IconComponent && (
                  <ListItemIcon sx={{ 
                    color: isActive ? theme.palette.primary.contrastText : theme.palette.primary.main,
                  }}>
                    <IconComponent />
                  </ListItemIcon>
                )}
                
                {!isCollapsed && (
                  <>
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: level === 0 ? '0.95rem' : '0.875rem',
                        noWrap: true,
                      }}
                      sx={{
                        mr: 1,
                      }}
                    />
                    
                    {hasChildren && (
                      isOpen ? <ExpandLessIcon /> : <ChevronRightIcon />
                    )}
                  </>
                )}
                
                {isCollapsed && level === 0 && (
                  <Tooltip title={item.name} placement="right">
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <IconComponent />
                    </ListItemIcon>
                  </Tooltip>
                )}
              </ListItemButton>
            </ListItem>

            {hasChildren && isOpen && !isCollapsed && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {renderMenuItems(item.children, level + 1)}
                </List>
              </Collapse>
            )}
          </Box>
        );
      });
  }, [openSections, activeItem, hoveredItem, isCollapsed, searchQuery, theme]);

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            boxShadow: 3,
            overflowX: 'hidden',
          },
          ref: sidebarRef
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {userName}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search features..."
            value={searchQuery}
            onChange={handleSearchChange}
            inputRef={searchInputRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch} edge="end">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
        </Box>

        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          height: 'calc(100vh - 120px)',
          p: 1 
        }}>
          {searchQuery.trim() && menuItems.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              p: 4, 
              color: 'text.secondary',
              fontStyle: 'italic'
            }}>
              No features found for "{searchQuery}"
            </Box>
          ) : (
            <List disablePadding>
              {renderMenuItems(menuItems)}
            </List>
          )}
        </Box>
      </Drawer>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        width: isCollapsed ? 80 : 240,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflow: 'hidden',
        zIndex: theme.zIndex.drawer,
        borderRight: 1,
        borderColor: 'divider',
        borderRadius: 0,
      }}
      ref={sidebarRef}
    >
      {/* Header */}
      <Box sx={{ 
        p: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        {!isCollapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {userName}
          </Typography>
        )}
        <IconButton 
          onClick={() => setIsCollapsed(!isCollapsed)}
          size="small"
          sx={{ ml: isCollapsed ? 0 : 'auto' }}
        >
          {isCollapsed ? <MenuIcon /> : <CloseIcon />}
        </IconButton>
      </Box>

      {!isCollapsed && (
        <Box sx={{ p: 1, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch} edge="end">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
        </Box>
      )}

      <Divider />
  
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        height: 'calc(100vh - 120px)',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.action.hover,
          borderRadius: '3px',
        },
      }}>
        {searchQuery.trim() && menuItems.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            p: 4, 
            color: 'text.secondary',
            fontStyle: 'italic'
          }}>
            No results found
          </Box>
        ) : (
          <List disablePadding sx={{ p: 1 }}>
            {renderMenuItems(menuItems)}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default EmployeeSidebar;