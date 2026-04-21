// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useSelector } from 'react-redux'; // Import useSelector
// import {
//   Box, Typography, Card, CardContent, Grid, styled
// } from '@mui/material';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import {
//   Search as SearchIcon,
//   Summarize as SummarizeIcon,
//   Build as BuildIcon,
//   AttachMoney as MoneyIcon,
//   Assignment as AssignmentIcon,
//   People as PeopleIcon,
//   LocalMall as ShoppingIcon,
//   Category as CategoryIcon,
//   Inventory as InventoryIcon,
//   Receipt as ReceiptIcon,
//   Work as WorkIcon,
//   LocalShipping as ShippingIcon,
//   Construction as ConstructionIcon
// } from '@mui/icons-material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import { useRecentPaths } from '../../../app/context/RecentPathsContext';

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`inventory-tabpanel-${index}`}
//       aria-labelledby={`inventory-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// }

// export default function InventoryComponent() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [isClient, setIsClient] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { addRecentPath } = useRecentPaths();

//   // Get permissions from Redux
//   const permissions = useSelector(state => state.permission.userPermissions);

//   // Ensure that `useSearchParams` is only called on the client side
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleCardClick = (path, name) => {
//     if (path && path !== '#') {
//       // Track this path in recent paths
//       addRecentPath(path, name);
//       // Navigate to the path
//       window.location.href = path;
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     const tabId = inventoryData[newValue]?.id;
//     if (tabId) {
//       router.push(`/inventorypage?activeTab=${tabId}`, { scroll: false });
//     }
//   };

//   useEffect(() => {
//     if (!isClient) return; // Only run on the client-side

//     const tabParam = searchParams.get('activeTab') || 'inventory';
//     const index = inventoryData.findIndex(tab => tab.id === tabParam);
//     if (index !== -1 && index !== activeTab) {
//       setActiveTab(index >= 0 ? index : 0);
//     }
//   }, [searchParams, isClient, activeTab]);

//   const StyledTabs = styled(Tabs)({
//     backgroundColor: '#e1e7ef',
//     borderRadius: '10px',
//     padding: '4px',
//     marginInline: '5px',
//     minHeight: '36px',
//     '& .MuiTabs-indicator': {
//       display: 'none',
//     },
//   });

//   const StyledTab = styled(Tab)(({ theme }) => ({
//     textTransform: 'none',
//     fontWeight: 600,
//     fontSize: '13px',
//     minHeight: '32px',
//     padding: '7px 5px',
//     borderRadius: '5px',
//     color: theme.palette.text.secondary,
//     '&.Mui-selected': {
//       color: '#fff',
//       backgroundColor: '#635bff',
//     }
//   }));

//   // Helper function to check if a module has any permission
//   const hasAnyPermission = (moduleName) => {
//     if (!moduleName) return true; // If no MOD_NAME, show by default

//     const modulePermissions = permissions && permissions[moduleName];
//     if (!modulePermissions) return false;

//     return modulePermissions.ADD_PRIV === "1" ||
//       modulePermissions.EDIT_PRIV === "1" ||
//       modulePermissions.DELETE_PRIV === "1" ||
//       modulePermissions.SELECT_PRIV === "1";
//   };

//   // Check if any child in a tab has permission
//   const tabHasVisibleChildren = (tab) => {
//     if (!tab.children || tab.children.length === 0) return false;

//     // Check if tab itself has MOD_NAME and permission
//     if (tab.MOD_NAME && hasAnyPermission(tab.MOD_NAME)) {
//       return true;
//     }

//     // Check if any child has permission
//     return tab.children.some(child => {
//       if (child.MOD_NAME) {
//         return hasAnyPermission(child.MOD_NAME);
//       }
//       // If child doesn't have MOD_NAME, show it
//       return true;
//     });
//   };

//   // Filter tabs based on permissions
//   const getFilteredInventoryData = () => {
//     return inventoryData.filter(tab => {
//       // If tab has no MOD_NAME, always show it
//       if (!tab.MOD_NAME) return true;

//       // Check if tab or any of its children should be shown
//       return tabHasVisibleChildren(tab);
//     });
//   };

//   // Filter children within a tab based on permissions
//   const getFilteredChildren = (children) => {
//     if (!children || children.length === 0) return [];

//     return children.filter(child => {
//       // If child has no MOD_NAME, always show it
//       if (!child.MOD_NAME) return true;

//       // Check if child has permission
//       return hasAnyPermission(child.MOD_NAME);
//     });
//   };

//   const inventoryData = [
//     {
//       id: 'inventory-items',
//       name: 'Inventory',
//       // MOD_NAME: "mnuTransaction",
//       children: [
//         { name: 'Artical/Style Master', icon: SummarizeIcon, path: '/inverntory/style/' },
//         { name: 'Style/Parts Master', icon: SummarizeIcon, path: '#' },
//         { name: 'BarCode Printing', icon: SummarizeIcon, path: '#' },
//         { name: 'Style Shade Image upload', icon: SummarizeIcon, path: '#' },
//         { name: 'Price List Detailes', icon: SummarizeIcon, path: '#' },
//         { name: 'Stock Adjustment', icon: BuildIcon, path: '#' },
//         { name: 'Inventory Valuation', icon: MoneyIcon, path: '#' },
//       ],
//     },
//     {
//       id: 'sampling',
//       name: 'Sampling & Development',
//       children: [
//         { name: 'Stock Enquiry', icon: SearchIcon, path: '#' },
//         { name: 'Buyer Enquiry', icon: PeopleIcon, path: '#' },
//         { name: 'Enquiry Followups', icon: AssignmentIcon, path: '/inverntory/packeging-barcode/' },
//         { name: 'Pending for Acceptance', icon: AssignmentIcon, path: '/inverntory/packeging-barcode/' },
//         { name: 'Sampling Form', icon: AssignmentIcon, path: '/inverntory/packeging-barcode/' },
//         { name: 'Enquiry Status', icon: AssignmentIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'opening-stock',
//       name: 'Opening Stock',
//       children: [
//         { name: 'RM Stock', icon: SearchIcon, path: '/inverntory/packeging-barcode/' },
//         { name: 'Trims & Stores with Party', icon: InventoryIcon, path: '#' },
//         { name: 'Finished good stock', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
//         { name: 'Process stock with party', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
//         { name: 'RM stock with party', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'purchase-order',
//       name: 'Purchase Order',
//       children: [
//         { name: 'RM Purchase Order', icon: SearchIcon, path: '/inverntory/packeging-barcode/' },
//         { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
//         { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'inward-approval',
//       name: 'Inward Approval',
//       children: [
//         { name: 'Finished Goods', icon: SearchIcon, path: '#' },
//         { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
//         { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'provisinal-grn',
//       name: 'Provisional GRN',
//       children: [
//         { name: 'Finished Goods', icon: SearchIcon, path: '#' },
//         { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
//         { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'purchase-inward',
//       name: 'Purchase Inward',
//       children: [
//         { name: 'Finished Goods', icon: SearchIcon, path: '#' },
//         { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
//         { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'rm-acc-issue',
//       name: 'RM/Acc Issue',
//       children: [
//         { name: 'Finished Goods', icon: SearchIcon, path: '#' },
//         { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
//         { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'manufacturing',
//       name: 'Manufacturing',
//       children: [
//         { name: 'Finished Goods', icon: SearchIcon, path: '#' },
//         { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
//         { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'other-transactions',
//       name: 'Other Transactions',
//       children: [
//         { name: 'Finished Goods', icon: SearchIcon, path: '#' },
//         { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
//         { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'sample-packaging',
//       name: 'Sample Packing',
//       children: [
//         { name: 'Finished Goods', icon: SearchIcon, path: '#' },
//         { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
//         { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'make-to-order',
//       name: 'Make to Order',
//       children: [
//         { name: 'Finished Goods', icon: SearchIcon, path: '#' },
//         { name: 'Finished goods product order', icon: ShoppingIcon, path: '#' },
//         { name: 'Trims & Stores purchase order', icon: ShoppingIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'sales-dispatch',
//       name: 'Sales/Dispatch',
//       // MOD_NAME: "mnuTrnSales",
//       children: [

//         { name: 'Sales Order(Live Stock)', icon: ShoppingCartIcon, path: '/inverntory/saleorder-livestock' },
//         { name: 'Stock Enquiry', icon: SearchIcon, path: '/dashboard/stock-enquiry-table' },
//         {
//           name: 'Order Booking (Hide Stock/FOB/WO)',
//           // MOD_NAME: "mnuTrnSalesOrderWOStk",
//           icon: ShoppingIcon, path: '/inverntory/inventory-offline'
//         },
//         {
//           name: 'Order Booking (Only BarCode)',
//           // MOD_NAME: "mnuonlybarcode", 
//           icon: ShoppingIcon, path: '/inverntory/salesorderbarcode'
//         },
//         { name: 'Scan Barcode', icon: ShoppingIcon, path: '/inverntory/scan-Barcode' },
//          { name: 'Paking Slip', icon: ShoppingIcon, path: '/inverntory/packingslip' },
//         // { name: 'Packaging/Barcode', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
//       ],
//     },
//     {
//       id: 'sampling-production',
//       name: 'Sampling & Production',
//       children: [
//         { name: 'Buyer Enq', icon: SearchIcon, path: '#' },
//         { name: 'Sales Offline', icon: ShoppingIcon, path: '/inverntory/stock-enquiry-table' },
//         { name: 'Packaging/Barcode', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
//         // { name: 'TNA', icon: InventoryIcon, path: '/inverntory/tnadash/' },
//         // { name: 'Update Routing', icon: InventoryIcon, path: '/inverntory/updaterouting/' },
//         // { name: 'Update RM', icon: InventoryIcon, path: '/inverntory/updaterm/' },
//         // { name: 'Update Trims', icon: InventoryIcon, path: '/inverntory/updatetrims/' },
//       ],
//     }
//   ];

//   const filteredInventoryData = getFilteredInventoryData();

//   // Adjust active tab if current tab is filtered out
//   useEffect(() => {
//     if (filteredInventoryData.length > 0) {
//       const currentTabId = inventoryData[activeTab]?.id;
//       const newIndex = filteredInventoryData.findIndex(tab => tab.id === currentTabId);
//       if (newIndex === -1 && activeTab !== 0) {
//         setActiveTab(0);
//       }
//     }
//   }, [filteredInventoryData, activeTab]);

//   // Handle tab change for filtered data
//   const handleFilteredTabChange = (event, newValue) => {
//     const tabId = filteredInventoryData[newValue]?.id;
//     if (tabId) {
//       router.push(`/inventorypage?activeTab=${tabId}`, { scroll: false });
//       setActiveTab(newValue);
//     }
//   };

//   // Get the active tab index in filtered data
//   const getActiveTabIndexInFiltered = () => {
//     const currentTabId = inventoryData[activeTab]?.id;
//     return filteredInventoryData.findIndex(tab => tab.id === currentTabId);
//   };

//   const activeFilteredTabIndex = getActiveTabIndexInFiltered() >= 0 ? getActiveTabIndexInFiltered() : 0;

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Box
//         sx={{
//           width: '100%',
//           '& .MuiTabs-root': {
//             padding: '4px 3px 4px 4px !important',
//           },
//         }}
//       >
//         <StyledTabs
//           value={activeFilteredTabIndex}
//           onChange={handleFilteredTabChange}
//           variant="scrollable"
//           TabIndicatorProps={{ style: { display: 'none' } }}
//           sx={{
//             '& .MuiTabs-flexContainer': {
//               flexWrap: 'wrap',
//               gap: '4px',
//               paddingInline: '2px',
//             },
//             '& .MuiTabs-scroller': {
//               overflow: 'visible !important',
//             },
//             '@media (max-width: 600px)': {
//               '& .MuiTabs-flexContainer': {
//                 flexWrap: 'nowrap',
//               },
//               '& .MuiTabs-scroller': {
//                 overflowX: 'auto !important',
//                 display: 'flex',
//                 flexWrap: 'nowrap',
//               },
//               '& .MuiTabs-scrollButtons': {
//                 width: '25px',
//                 '&.Mui-disabled': {
//                   opacity: 0.3,
//                 },
//               },
//             },
//           }}
//         >
//           {filteredInventoryData.map((tab) => (
//             <StyledTab key={tab.id} label={tab.name} />
//           ))}
//         </StyledTabs>
//       </Box>

//       {filteredInventoryData.map((tab, index) => {
//         const filteredChildren = getFilteredChildren(tab.children);

//         return (
//           <TabPanel key={tab.id} value={activeFilteredTabIndex} index={index}>
//             {filteredChildren.length > 0 ? (
//               <Grid container spacing={2}>
//                 {filteredChildren.map((item, itemIndex) => {
//                   const ItemIcon = item.icon;
//                   return (
//                     <Grid size={{ xs: 6, sm: 3, md: 3, lg: 2 }} key={itemIndex}>
//                       <Card
//                         sx={{
//                           cursor: item.path !== '#' ? 'pointer' : 'default',
//                           transition: 'all 0.3s ease',
//                           // width: 150,
//                           height: '100%',
//                           background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
//                           border: '1px solid #e0e0e0',
//                           borderRadius: '8px',
//                           '&:hover': item.path !== '#' ? {
//                             transform: 'translateY(-2px)',
//                             boxShadow: '0 4px 12px rgba(99, 91, 255, 0.2)',
//                             background: 'linear-gradient(135deg, #635bff 0%, #8a84ff 100%)',
//                             color: 'white',
//                           } : {},
//                         }}
//                         onClick={() => item.path !== '#' && handleCardClick(item.path, item.name)}
//                       >
//                         <CardContent sx={{
//                           textAlign: 'center',
//                           p: 2,
//                           '&:last-child': { pb: 2 }
//                         }}>
//                           <ItemIcon
//                             sx={{
//                               fontSize: 25,
//                               mb: 1,
//                               color: 'inherit'
//                             }}
//                           />
//                           <Typography variant="body1" component="div" sx={{
//                             fontWeight: '500',
//                             fontSize: '0.8rem',
//                           }}>
//                             {item.name}
//                           </Typography>
//                         </CardContent>
//                       </Card>
//                     </Grid>
//                   );
//                 })}
//               </Grid>
//             ) : (
//               <Box sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '200px',
//                 flexDirection: 'column',
//                 color: '#666'
//               }}>
//                 <Typography variant="h6" gutterBottom>
//                   No items available
//                 </Typography>
//                 <Typography variant="body2">
//                   You don't have permission to access any items in this section.
//                 </Typography>
//               </Box>
//             )}
//           </TabPanel>
//         );
//       })}
//     </Box>
//   );
// }






'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Card, CardContent, Grid, styled, CircularProgress } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import axiosInstance from '@/lib/axios';
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Build as BuildIcon,
  Store as StoreIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  AddShoppingCart as AddShoppingCartIcon,
  RemoveShoppingCart as RemoveShoppingCartIcon,
  SwapHoriz as SwapHorizIcon,
  CompareArrows as CompareArrowsIcon,
  ProductionQuantityLimits as ProductionQuantityLimitsIcon,
  Factory as FactoryIcon,
  Science as ScienceIcon,
  Handshake as HandshakeIcon,
  Category as CategoryIcon,
  Article as ArticleIcon,
  Style as StyleIcon,
  QrCodeScanner as QrCodeScannerIcon,
  LocalMall as LocalMallIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Summarize as SummarizeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
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

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState(-1);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const { addRecentPath } = useRecentPaths();

  useEffect(() => {
    setIsClient(true);
    const userIdFromStorage = localStorage.getItem('USER_ID');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      console.log('User ID from localStorage:', userIdFromStorage);
    }
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const effectiveUserId = userId || "1";
      
      try {
        setLoading(true);
        console.log('Fetching inventory menus for user ID:', effectiveUserId);
        
        const response = await axiosInstance.post('/MODULE/RetriveWebUserprivs', {
          "FLAG": "UR",
          "TBLNAME": "WebUserprivs",
          "FLDNAME": "User_Id",
          "ID": effectiveUserId.toString(),
          "ORDERBYFLD": "",
          "CWHAER": "",
          "CO_ID": ""
        });

        console.log('InventoryPage API Response:', response.data);

        if (response.data && response.data.DATA) {
          const allData = response.data.DATA;
          
          // DYNAMIC: Find Inventory module by name (similar to MasterPage)
          const inventoryModule = allData.find(item => 
            item.MOD_NAME === "Inventory" ||
            item.MOD_DESC === "Inventory" ||
            (item.PARENT_ID === "0" && (item.MOD_NAME?.toLowerCase().includes('inventory') || item.MOD_DESC?.toLowerCase().includes('inventory')))
          );

          if (!inventoryModule) {
            console.warn('Inventory module not found in API response');
            setMenuData([]);
            setLoading(false);
            return;
          }
          
          const inventoryId = inventoryModule.MOD_ID.toString();
          console.log('Inventory Module ID (dynamically found):', inventoryId);
          
          // Get all top-level tabs under Inventory (similar to MasterPage)
          const topLevelTabs = allData.filter(item =>
            item.PARENT_ID === inventoryId &&
            item.MOD_NAME &&
            item.MOD_NAME.trim() !== ''
          );
          
          console.log('Top level tabs under Inventory:', topLevelTabs);
          
          const topLevelTabIds = new Set(topLevelTabs.map(tab => tab.MOD_ID.toString()));
          
          // Get all items under Inventory (including nested)
          const inventoryItems = allData.filter(item => {
            if (item.PARENT_ID === inventoryId) return true;
            if (topLevelTabIds.has(item.PARENT_ID)) return true;
            const parentItem = allData.find(p => p.MOD_ID.toString() === item.PARENT_ID);
            if (parentItem && parentItem.PARENT_ID === inventoryId) return true;
            return false;
          });
          
          console.log('All inventory items:', inventoryItems);
          
          // Build menu tree
          const menuTree = buildMenuTree(inventoryItems, allData, inventoryId);
          setMenuData(menuTree);
          console.log('Final Inventory Menu Tree:', menuTree);
        } else {
          setMenuData([]);
        }
      } catch (error) {
        console.error('Error fetching inventory menu items:', error);
        setMenuData([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMenuItems();
    } else {
      // If userId is not available yet, try after a short delay
      const timer = setTimeout(() => {
        fetchMenuItems();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const buildMenuTree = (data, allData, inventoryId) => {
    const itemMap = {};
    const rootItems = [];
    const parentChildMap = {};

    // First pass: Create all items
    data.forEach(item => {
      if (!item.MOD_ID) return;

      const hasPermission =
        item.ADD_PRIV === "1" ||
        item.EDIT_PRIV === "1" ||
        item.DELETE_PRIV === "1" ||
        item.SELECT_PRIV === "1";

      const isTopLevelTab = item.PARENT_ID === inventoryId;

      if (hasPermission || isTopLevelTab) {
        const moduleName = item.MOD_DESC || item.MOD_NAME;
        const parentId = item.PARENT_ID === "0" || !item.PARENT_ID ? null : item.PARENT_ID;

        // Ensure path starts with a forward slash if it doesn't already
        let path = item.MOD_ROUTIG || '#';
        if (path !== '#' && !path.startsWith('/')) {
          path = '/' + path;
        }

        itemMap[item.MOD_ID] = {
          id: item.MOD_ID,
          name: moduleName,
          path: path,
          parentId: parentId,
          children: [],
          permissions: {
            add: item.ADD_PRIV === "1",
            edit: item.EDIT_PRIV === "1",
            delete: item.DELETE_PRIV === "1",
            view: item.SELECT_PRIV === "1"
          }
        };

        if (parentId && parentId !== inventoryId) {
          if (!parentChildMap[parentId]) {
            parentChildMap[parentId] = [];
          }
          parentChildMap[parentId].push(item.MOD_ID);
        }
      }
    });

    // Find top-level tab IDs that need to be created as parent items
    const topLevelTabIds = new Set();

    Object.values(itemMap).forEach(item => {
      if (item.parentId && item.parentId !== inventoryId && !itemMap[item.parentId]) {
        const parentItem = allData.find(d => d.MOD_ID.toString() === item.parentId);
        if (parentItem && parentItem.PARENT_ID === inventoryId) {
          topLevelTabIds.add(item.parentId);
        }
      }
    });

    // Create parent items for top-level tabs if they don't exist
    topLevelTabIds.forEach(parentId => {
      if (!itemMap[parentId]) {
        const parentItem = allData.find(item => item.MOD_ID.toString() === parentId);
        if (parentItem) {
          // Ensure path starts with forward slash
          let path = parentItem.MOD_ROUTIG || '#';
          if (path !== '#' && !path.startsWith('/')) {
            path = '/' + path;
          }

          itemMap[parentId] = {
            id: parentItem.MOD_ID,
            name: parentItem.MOD_DESC || parentItem.MOD_NAME,
            path: path,
            parentId: inventoryId,
            children: [],
            permissions: {
              add: false,
              edit: false,
              delete: false,
              view: false
            }
          };
        }
      }
    });

    // Build hierarchy
    Object.values(itemMap).forEach(item => {
      if (item.parentId && item.parentId !== inventoryId && itemMap[item.parentId]) {
        itemMap[item.parentId].children.push(item);
      } else if (item.parentId === inventoryId) {
        rootItems.push(item);
      }
    });

    // Sort items by name
    const sortItems = (items) => {
      items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      items.forEach(item => {
        if (item.children.length > 0) {
          sortItems(item.children);
        }
      });
    };
    sortItems(rootItems);

    // Transform for display (similar to MasterPage)
    const transformed = rootItems.map(item => ({
      id: item.id,
      name: item.name,
      children: item.children
        .filter(child => {
          const hasChildPermission =
            child.permissions.add ||
            child.permissions.edit ||
            child.permissions.delete ||
            child.permissions.view;
          return hasChildPermission;
        })
        .map(child => ({
          name: child.name,
          path: child.path,
          icon: getIconForModule(child.name),
          permissions: child.permissions
        }))
    })).filter(tab => tab.children.length > 0);

    return transformed;
  };

  const getIconForModule = (moduleName) => {
    if (!moduleName) return InventoryIcon;
    
    const name = moduleName.toLowerCase();
    
    // Direct matches for specific module names
    if (name.includes('order booking')) return AddShoppingCartIcon;
    if (name.includes('sales')) return ShoppingCartIcon;
    if (name.includes('dispatch')) return LocalShippingIcon;
    if (name.includes('sampling')) return ScienceIcon;
    if (name.includes('development')) return BuildIcon;
    if (name.includes('stock enquiry')) return SearchIcon;
    if (name.includes('buyer enquiry')) return PeopleIcon;
    if (name.includes('enquiry')) return AssignmentIcon;
    if (name.includes('artical') || name.includes('style')) return ArticleIcon;
    if (name.includes('style/parts')) return StyleIcon;
    if (name.includes('barcode')) return QrCodeScannerIcon;
    if (name.includes('price list')) return LocalMallIcon;
    if (name.includes('stock adjustment')) return CompareArrowsIcon;
    if (name.includes('inventory valuation')) return MoneyIcon;
    if (name.includes('pending')) return AssignmentIcon;
    if (name.includes('packing')) return ReceiptIcon;
    if (name.includes('quality')) return CheckCircleIcon;
    if (name.includes('scan')) return QrCodeScannerIcon;
    if (name.includes('paking') || name.includes('packing slip')) return ReceiptIcon;
    
    return InventoryIcon;
  };

  const handleTabChange = (event, newValue) => {
    const tabId = menuData[newValue]?.id;
    if (tabId) {
      router.push(`/inventorypage?activeTab=${tabId}`, { scroll: false });
      setActiveTab(newValue);
    }
  };

  const handleCardClick = (path, name) => {
    if (path && path !== '#') {
      addRecentPath(path, name);
      router.push(path);
    }
  };

  useEffect(() => {
    if (!isClient || loading) return;

    const tabParam = searchParams.get('activeTab') || '';
    if (tabParam && menuData.length > 0) {
      const index = menuData.findIndex(tab => tab.id.toString() === tabParam);
      if (index !== -1 && index !== activeTab) {
        setActiveTab(index);
      } else if (index === -1 && activeTab === -1 && menuData.length > 0) {
        setActiveTab(0);
      }
    } else if (!tabParam && menuData.length > 0 && activeTab === -1) {
      setActiveTab(0);
    }
  }, [searchParams, isClient, loading, menuData, activeTab]);

  const StyledTabs = styled(Tabs)({
    backgroundColor: '#e1e7ef',
    borderRadius: '10px',
    padding: '4px',
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isClient && (
        <Box sx={{ width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : menuData.length > 0 ? (
            <>
              <Box sx={{ width: '100%' }}>
                <StyledTabs
                  value={activeTab === -1 ? 0 : activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  TabIndicatorProps={{ style: { display: 'none' } }}
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      flexWrap: 'wrap',
                      gap: '2px',
                      paddingInline: '2px'
                    },
                  }}
                >
                  {menuData.map((tab) => (
                    <StyledTab key={tab.id} label={tab.name} />
                  ))}
                </StyledTabs>
              </Box>

              {menuData.map((tab, index) => (
                <TabPanel key={tab.id} value={activeTab === -1 ? 0 : activeTab} index={index}>
                  <Grid container spacing={2}>
                    {tab.children?.map((item, itemIndex) => {
                      const ItemIcon = item.icon;
                      return (
                        <Grid size={{ xs: 6, sm: 3, md: 3, lg: 1.5 }} key={itemIndex}>
                          <Card
                            sx={{
                              cursor: item.path !== '#' ? 'pointer' : 'default',
                              transition: 'all 0.3s ease',
                              height: '100%',
                              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                              border: '1px solid #e0e0e0',
                              borderRadius: '8px',
                              '&:hover': item.path !== '#' ? {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(99, 91, 255, 0.2)',
                                background: 'linear-gradient(135deg, #635bff 0%, #5A6EFF 100%)',
                                '& .MuiTypography-root': {
                                  color: 'white',
                                },
                                '& svg': {
                                  color: 'white !important',
                                }
                              } : {},
                            }}
                            onClick={() => item.path !== '#' && handleCardClick(item.path, item.name)}
                          >
                            <CardContent sx={{
                              textAlign: 'center',
                              p: 2,
                              '&:last-child': { pb: 2 }
                            }}>
                              <ItemIcon sx={{ 
                                fontSize: 25, 
                                mb: 1,
                                color: '#635bff',
                                transition: 'color 0.3s ease',
                              }} />
                              <Typography variant="body1" sx={{ fontWeight: '500', fontSize: '0.8rem' }}>
                                {item.name}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </TabPanel>
              ))}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No inventory modules available for your account
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Please contact your administrator for access
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Suspense>
  );
}