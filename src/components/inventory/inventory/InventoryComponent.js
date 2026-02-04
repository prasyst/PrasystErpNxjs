'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux'; // Import useSelector
import {
  Box, Typography, Card, CardContent, Grid, styled
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  Search as SearchIcon,
  Summarize as SummarizeIcon,
  Build as BuildIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  LocalMall as ShoppingIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Work as WorkIcon,
  LocalShipping as ShippingIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRecentPaths } from '../../../app/context/RecentPathsContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function InventoryComponent() {
  const [activeTab, setActiveTab] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addRecentPath } = useRecentPaths();

  // Get permissions from Redux
  const permissions = useSelector(state => state.permission.userPermissions);

  // Ensure that `useSearchParams` is only called on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCardClick = (path, name) => {
    if (path && path !== '#') {
      // Track this path in recent paths
      addRecentPath(path, name);
      // Navigate to the path
      window.location.href = path;
    }
  };

  const handleTabChange = (event, newValue) => {
    const tabId = inventoryData[newValue]?.id;
    if (tabId) {
      router.push(`/inventorypage?activeTab=${tabId}`, { scroll: false });
    }
  };

  useEffect(() => {
    if (!isClient) return; // Only run on the client-side

    const tabParam = searchParams.get('activeTab') || 'inventory';
    const index = inventoryData.findIndex(tab => tab.id === tabParam);
    if (index !== -1 && index !== activeTab) {
      setActiveTab(index >= 0 ? index : 0);
    }
  }, [searchParams, isClient, activeTab]);

  const StyledTabs = styled(Tabs)({
    backgroundColor: '#e1e7ef',
    borderRadius: '10px',
    padding: '4px',
    marginInline: '5px',
    minHeight: '36px',
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  });

  const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    minHeight: '32px',
    padding: '7px 5px',
    borderRadius: '5px',
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: '#fff',
      backgroundColor: '#635bff',
    }
  }));

  // Helper function to check if a module has any permission
  const hasAnyPermission = (moduleName) => {
    if (!moduleName) return true; // If no MOD_NAME, show by default

    const modulePermissions = permissions && permissions[moduleName];
    if (!modulePermissions) return false;

    return modulePermissions.ADD_PRIV === "1" ||
      modulePermissions.EDIT_PRIV === "1" ||
      modulePermissions.DELETE_PRIV === "1" ||
      modulePermissions.SELECT_PRIV === "1";
  };

  // Check if any child in a tab has permission
  const tabHasVisibleChildren = (tab) => {
    if (!tab.children || tab.children.length === 0) return false;

    // Check if tab itself has MOD_NAME and permission
    if (tab.MOD_NAME && hasAnyPermission(tab.MOD_NAME)) {
      return true;
    }

    // Check if any child has permission
    return tab.children.some(child => {
      if (child.MOD_NAME) {
        return hasAnyPermission(child.MOD_NAME);
      }
      // If child doesn't have MOD_NAME, show it
      return true;
    });
  };

  // Filter tabs based on permissions
  const getFilteredInventoryData = () => {
    return inventoryData.filter(tab => {
      // If tab has no MOD_NAME, always show it
      if (!tab.MOD_NAME) return true;

      // Check if tab or any of its children should be shown
      return tabHasVisibleChildren(tab);
    });
  };

  // Filter children within a tab based on permissions
  const getFilteredChildren = (children) => {
    if (!children || children.length === 0) return [];

    return children.filter(child => {
      // If child has no MOD_NAME, always show it
      if (!child.MOD_NAME) return true;

      // Check if child has permission
      return hasAnyPermission(child.MOD_NAME);
    });
  };

  const inventoryData = [
    {
      id: 'inventory-items',
      name: 'Inventory',
      // MOD_NAME: "mnuTransaction",
      children: [
        { name: 'Artical/Style Master', icon: SummarizeIcon, path: '/inverntory/style/' },
        { name: 'Style/Parts Master', icon: SummarizeIcon, path: '#' },
        { name: 'BarCode Printing', icon: SummarizeIcon, path: '#' },
        { name: 'Style Shade Image upload', icon: SummarizeIcon, path: '#' },
        { name: 'Price List Detailes', icon: SummarizeIcon, path: '#' },
        { name: 'Stock Adjustment', icon: BuildIcon, path: '#' },
        { name: 'Inventory Valuation', icon: MoneyIcon, path: '#' },
      ],
    },
    {
      id: 'sampling',
      name: 'Sampling & Development',
      children: [
        { name: 'Stock Enquiry', icon: SearchIcon, path: '#' },
        { name: 'Buyer Enquiry', icon: PeopleIcon, path: '#' },
        { name: 'Enquiry Followups', icon: AssignmentIcon, path: '/inverntory/packeging-barcode/' },
        { name: 'Pending for Acceptance', icon: AssignmentIcon, path: '/inverntory/packeging-barcode/' },
        { name: 'Sampling Form', icon: AssignmentIcon, path: '/inverntory/packeging-barcode/' },
        { name: 'Enquiry Status', icon: AssignmentIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'opening-stock',
      name: 'Opening Stock',
      children: [
        { name: 'RM Stock', icon: SearchIcon, path: '/inverntory/packeging-barcode/' },
        { name: 'Trims & Stores with Party', icon: InventoryIcon, path: '#' },
        { name: 'Finished good stock', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
        { name: 'Process stock with party', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
        { name: 'RM stock with party', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'purchase-order',
      name: 'Purchase Order',
      children: [
        { name: 'RM Purchase Order', icon: SearchIcon, path: '/inverntory/packeging-barcode/' },
        { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
        { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'inward-approval',
      name: 'Inward Approval',
      children: [
        { name: 'Finished Goods', icon: SearchIcon, path: '#' },
        { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
        { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'provisinal-grn',
      name: 'Provisional GRN',
      children: [
        { name: 'Finished Goods', icon: SearchIcon, path: '#' },
        { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
        { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'purchase-inward',
      name: 'Purchase Inward',
      children: [
        { name: 'Finished Goods', icon: SearchIcon, path: '#' },
        { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
        { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'rm-acc-issue',
      name: 'RM/Acc Issue',
      children: [
        { name: 'Finished Goods', icon: SearchIcon, path: '#' },
        { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
        { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      children: [
        { name: 'Finished Goods', icon: SearchIcon, path: '#' },
        { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
        { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'other-transactions',
      name: 'Other Transactions',
      children: [
        { name: 'Finished Goods', icon: SearchIcon, path: '#' },
        { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
        { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'sample-packaging',
      name: 'Sample Packing',
      children: [
        { name: 'Finished Goods', icon: SearchIcon, path: '#' },
        { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
        { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'make-to-order',
      name: 'Make to Order',
      children: [
        { name: 'Finished Goods', icon: SearchIcon, path: '#' },
        { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
        { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'sales-dispatch',
      name: 'Sales/Dispatch',
      // MOD_NAME: "mnuTrnSales",
      children: [

        { name: 'Sales Order(Live Stock)', icon: ShoppingCartIcon, path: '/inverntory/stockOrder-LiveStock' },
        { name: 'Stock Enquiry', icon: SearchIcon, path: '/dashboard/stock-enquiry-table' },
        {
          name: 'Order Booking (Hide Stock/FOB/WO)',
          // MOD_NAME: "mnuTrnSalesOrderWOStk",
          icon: ShoppingIcon, path: '/inverntory/inventory-offline'
        },
        {
          name: 'Order Booking (Only BarCode)',
          // MOD_NAME: "mnuonlybarcode", 
          icon: ShoppingIcon, path: '/inverntory/salesorderbarcode'
        },
        { name: 'Scan Barcode', icon: ShoppingIcon, path: '/inverntory/scan-Barcode' },
        // { name: 'Packaging/Barcode', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'sampling-production',
      name: 'Sampling & Production',
      children: [
        { name: 'Buyer Enq', icon: SearchIcon, path: '#' },
        { name: 'Sales Offline', icon: ShoppingIcon, path: '/inverntory/stock-enquiry-table' },
        { name: 'Packaging/Barcode', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
        // { name: 'TNA', icon: InventoryIcon, path: '/inverntory/tnadash/' },
        // { name: 'Update Routing', icon: InventoryIcon, path: '/inverntory/updaterouting/' },
        // { name: 'Update RM', icon: InventoryIcon, path: '/inverntory/updaterm/' },
        // { name: 'Update Trims', icon: InventoryIcon, path: '/inverntory/updatetrims/' },
      ],
    }
  ];

  const filteredInventoryData = getFilteredInventoryData();

  // Adjust active tab if current tab is filtered out
  useEffect(() => {
    if (filteredInventoryData.length > 0) {
      const currentTabId = inventoryData[activeTab]?.id;
      const newIndex = filteredInventoryData.findIndex(tab => tab.id === currentTabId);
      if (newIndex === -1 && activeTab !== 0) {
        setActiveTab(0);
      }
    }
  }, [filteredInventoryData, activeTab]);

  // Handle tab change for filtered data
  const handleFilteredTabChange = (event, newValue) => {
    const tabId = filteredInventoryData[newValue]?.id;
    if (tabId) {
      router.push(`/inventorypage?activeTab=${tabId}`, { scroll: false });
      setActiveTab(newValue);
    }
  };

  // Get the active tab index in filtered data
  const getActiveTabIndexInFiltered = () => {
    const currentTabId = inventoryData[activeTab]?.id;
    return filteredInventoryData.findIndex(tab => tab.id === currentTabId);
  };

  const activeFilteredTabIndex = getActiveTabIndexInFiltered() >= 0 ? getActiveTabIndexInFiltered() : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          pb: 1,
          '& .MuiTabs-root': {
            padding: '4px 3px 4px 4px !important',
          },
        }}
      >
        <StyledTabs
          value={activeFilteredTabIndex}
          onChange={handleFilteredTabChange}
          variant="scrollable"
          TabIndicatorProps={{ style: { display: 'none' } }}
          sx={{
            '& .MuiTabs-flexContainer': {
              flexWrap: 'wrap',
              gap: '4px',
              paddingInline: '2px',
            },
            '& .MuiTabs-scroller': {
              overflow: 'visible !important',
            },
            '@media (max-width: 600px)': {
              '& .MuiTabs-flexContainer': {
                flexWrap: 'nowrap',
              },
              '& .MuiTabs-scroller': {
                overflowX: 'auto !important',
                display: 'flex',
                flexWrap: 'nowrap',
              },
              '& .MuiTabs-scrollButtons': {
                width: '25px',
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
              },
            },
          }}
        >
          {filteredInventoryData.map((tab) => (
            <StyledTab key={tab.id} label={tab.name} />
          ))}
        </StyledTabs>
      </Box>

      {filteredInventoryData.map((tab, index) => {
        const filteredChildren = getFilteredChildren(tab.children);

        return (
          <TabPanel key={tab.id} value={activeFilteredTabIndex} index={index}>
            {filteredChildren.length > 0 ? (
              <Grid container spacing={2}>
                {filteredChildren.map((item, itemIndex) => {
                  const ItemIcon = item.icon;
                  return (
                    <Grid item xs={4} sm={6} md={4} lg={3} key={itemIndex}>
                      <Card
                        sx={{
                          cursor: item.path !== '#' ? 'pointer' : 'default',
                          transition: 'all 0.3s ease',
                          width: { xs: 150, sm: 180 },
                          minWidth: { xs: 150, sm: 180 },
                          maxWidth: { xs: 150, sm: 180 },
                          height: 100,
                          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          '&:hover': item.path !== '#' ? {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(99, 91, 255, 0.2)',
                            background: 'linear-gradient(135deg, #635bff 0%, #8a84ff 100%)',
                            color: 'white',
                          } : {},
                        }}
                        onClick={() => item.path !== '#' && handleCardClick(item.path, item.name)}
                      >
                        <CardContent sx={{
                          textAlign: 'center',
                          p: 2,
                          '&:last-child': { pb: 2 }
                        }}>
                          <ItemIcon
                            sx={{
                              fontSize: 25,
                              mb: 1,
                              color: 'inherit'
                            }}
                          />
                          <Typography variant="body1" component="div" sx={{
                            fontWeight: '500',
                            fontSize: '0.8rem',
                          }}>
                            {item.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                flexDirection: 'column',
                color: '#666'
              }}>
                <Typography variant="h6" gutterBottom>
                  No items available
                </Typography>
                <Typography variant="body2">
                  You don't have permission to access any items in this section.
                </Typography>
              </Box>
            )}
          </TabPanel>
        );
      })}
    </Box>
  );
}