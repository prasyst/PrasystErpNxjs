// 'use client';
// import { useState, useEffect, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { Box, Typography, Card, CardContent, Grid, styled, } from '@mui/material';
// import { MdGavel, MdTune, MdBuild } from 'react-icons/md';
// import { FaHandshake } from 'react-icons/fa';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import {
//   RiFileList2Line, RiFolder3Line, RiGitBranchLine,
//   RiGitMergeLine, RiArticleLine, RiBook2Line, RiUserSettingsLine,
//   RiEarthLine,
//   RiMapLine,
//   RiCommunityLine,
//   RiBuilding2Line,
//   RiPriceTag3Line,
//   RiMapPinLine,
//   RiShareForwardLine,
//   RiCheckboxCircleLine,
// } from 'react-icons/ri';
// import { FaWarehouse } from 'react-icons/fa';
// import {
//   Business as BusinessIcon,
//   LocalShipping as TruckIcon,
//   People as PeopleIcon,
//   Inventory as ProductsIcon,
//   Balance as BalanceIcon,
//   Domain as DomainIcon,
//   Map as MapIcon,
//   GroupWork as GroupWorkIcon,
//   Category as CategoryIcon,
//   Warehouse as WarehouseIcon,
//   Work as WorkIcon,
//   AccountBox as AccountBoxIcon,
//   EmojiPeople as EmojiPeopleIcon,
//   Accessibility as AccessibilityIcon,
//   Handshake as HandshakeIcon,
//   LocalShipping as ShippingIcon,
//   Person as PersonIcon,
//   Class as ClassIcon,
//   LocalOffer as OfferIcon,
//   Stars as StarsIcon,
//   RateReview as RateReviewIcon,
//   Build as BuildIcon,
//   ShoppingBag as ShoppingBagIcon,
//   CollectionsBookmark as CollectionsBookmarkIcon,
//   Straighten as StraightenIcon,
//   Receipt as ReceiptIcon,
//   Gavel as GavelIcon,
//   AttachMoney as MoneyIcon,
//   Event as EventIcon,
//   CheckCircle as CheckCircleIcon,
//   Assignment as AssignmentIcon,
//   PlaylistAddCheck as PlaylistAddCheckIcon,
//   TrendingUp as TrendingUpIcon,
//   History as HistoryIcon,
//   Close as CloseIcon
// } from '@mui/icons-material';
// import AnnouncementIcon from '@mui/icons-material/Announcement';
// import CreateIcon from '@mui/icons-material/Create';
// import LocalActivityIcon from '@mui/icons-material/LocalActivity';
// import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
// import { useRecentPaths } from '../../../app/context/RecentPathsContext';

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`master-tabpanel-${index}`}
//       aria-labelledby={`master-tab-${index}`}
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

// export default function MasterPage() {
//   const [activeTab, setActiveTab] = useState(-1);
//   const [isClient, setIsClient] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { recentPaths, addRecentPath, removeRecentPath, clearRecentPaths } = useRecentPaths(); // Use the context

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleTabChange = (event, newValue) => {
//     const tabId = menuData[newValue]?.id;
//     if (tabId) {
//       router.push(`/masterpage?activeTab=${tabId}`, { scroll: false });
//     }
//   };

//   const handleCardClick = (path, name) => {
//     if (path && path !== '#') {
//       addRecentPath(path, name);
//       window.location.href = path;
//     }
//   };

//   useEffect(() => {
//     if (!isClient) return;

//     const tabParam = searchParams.get('activeTab') || '';
//     const index = menuData.findIndex(tab => tab.id === tabParam);
//     if (tabParam && index !== -1 && index !== activeTab) {
//       setActiveTab(index);
//     } else if (!tabParam) {
//       setActiveTab(0);
//     }
//   }, [searchParams, isClient, activeTab]);

//   const StyledTabs = styled(Tabs)({
//     backgroundColor: '#e1e7ef',
//     borderRadius: '10px',
//     padding: '4px',
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

//   const menuData = [
//     {
//       id: 'company',
//       name: 'Company',
//       children: [
//         { name: 'Company Master', icon: DomainIcon, path: '/masters/company/company' },
//         { name: 'Company Area', icon: MapIcon, path: '#' },
//         { name: 'Company Division', icon: GroupWorkIcon, path: '#' },
//         { name: 'Stock Type', icon: CategoryIcon, path: '#' },
//         { name: 'Stock Location', icon: WarehouseIcon, path: '#' },
//         { name: 'Department', icon: WorkIcon, path: '#' },
//         { name: 'Designation', icon: AccountBoxIcon, path: '#' },
//         { name: 'SalesPerson', icon: EmojiPeopleIcon, path: '#' },
//         { name: 'Employee', icon: AccessibilityIcon, path: '#' },
//       ],
//     },
//     {
//       id: 'location',
//       name: 'Location',
//       children: [
//         { name: 'Country Master', icon: RiEarthLine, path: '#' },
//         { name: 'Region/Zone Master', icon: RiMapLine, path: '#' },
//         { name: 'State Master', icon: RiCommunityLine, path: '#' },
//         { name: 'District/City', icon: RiBuilding2Line, path: '#' },
//         { name: 'StockType Master', icon: RiPriceTag3Line, path: '#' },
//         { name: 'WareHouse Stock Location', icon: FaWarehouse, path: '#' },
//         { name: 'Pincode', icon: RiMapPinLine, path: '#' },
//         { name: 'Pincode Allocation', icon: RiShareForwardLine, path: '#' },
//       ],
//     },
//     {
//       id: 'vendors',
//       name: 'Vendors',
//       children: [
//         { name: 'Broker', icon: HandshakeIcon, path: '#' },
//         { name: 'Transporter', icon: ShippingIcon, path: '#' },
//         { name: 'Creditors/Suppliers', icon: PersonIcon, path: '/masters/vendors' },
//       ],
//     },
//     {
//       id: 'customers',
//       name: 'Customers',
//       children: [
//         { name: 'Debtors/Customers', icon: PeopleIcon, path: '/masters/customers' },
//         { name: 'Category (For Rate)', icon: CategoryIcon, path: '#' },
//         { name: 'Customer Group', icon: PeopleIcon, path: '#' },
//         { name: 'Consignee', icon: PersonIcon, path: '#' },
//         { name: 'Party Class Master', icon: ClassIcon, path: '#' },
//         { name: 'Party Wise Rate List', icon: OfferIcon, path: '#' },
//         { name: 'Party Brand Broker', icon: StarsIcon, path: '#' },
//         { name: 'Party Rating Update', icon: RateReviewIcon, path: '#' },
//         { name: 'Party Brand Parameter', icon: BuildIcon, path: '#' },
//       ],
//     },
//     {
//       id: 'process',
//       name: 'Process',
//       children: [
//         { name: 'Process Master', icon: RiFileList2Line, path: '#' },
//         { name: 'Process Group', icon: RiFolder3Line, path: '#' },
//         { name: 'Routing Group', icon: RiGitBranchLine, path: '#' },
//         { name: 'Routing Process', icon: RiGitMergeLine, path: '#' },
//         { name: 'Process(Instruction)', icon: RiArticleLine, path: '#' },
//         { name: 'Process Group(Instruction)', icon: RiBook2Line, path: '#' },
//         { name: 'PartyWise Process', icon: RiUserSettingsLine, path: '#' },
//         { name: 'Approval Stage', icon: RiCheckboxCircleLine, path: '#' },
//       ],
//     },
//     {
//       id: 'products',
//       name: 'Products',
//       children: [
//         { name: 'Category Master', icon: CategoryIcon, path: '/masters/products/category' },
//         { name: 'Product Group', icon: CategoryIcon, path: '/masters/products/productgrp' },
//         { name: 'Product Master', icon: ShoppingBagIcon, path: '/masters/products/product' },
//         { name: 'Style Master', icon: CollectionsBookmarkIcon, path: '#' },
//         { name: 'Type Master', icon: CategoryIcon, path: '/masters/products/type' },
//         { name: 'Shade Master', icon: CollectionsBookmarkIcon, path: '/masters/products/shade' },
//         { name: 'Pattern Master', icon: CollectionsBookmarkIcon, path: '/masters/products/pattern' },
//         { name: 'Brand Master', icon: CollectionsBookmarkIcon, path: '/masters/products/brand' },
//         { name: 'Unit Master', icon: StraightenIcon, path: '/masters/products/unit' },
//         { name: 'Web Collection', icon: CollectionsBookmarkIcon, path: '/masters/products/webcollection' },
//         { name: 'Quality', icon: CollectionsBookmarkIcon, path: '/masters/products/quality' },
//         { name: 'RackMst', icon: BuildIcon, path: '/masters/products/rack' },
//         { name: 'Product Series', icon: AssignmentIcon, path: '/masters/products/prodseries' },
//       ],
//     },
//     {
//       id: 'tax',
//       name: 'Tax/Terms',
//       children: [
//         { name: 'Tax Group', icon: GavelIcon, path: '#' },
//         { name: 'Tax Master', icon: GavelIcon, path: '/masters/taxterms/taxmaster' },
//         { name: 'Term Group', icon: GavelIcon, path: '#' },
//         { name: 'Terms Master', icon: AssignmentIcon, path: '/masters/taxterms/termmaster' },
//         { name: 'Discount Pattern', icon: OfferIcon, path: '#' },
//         { name: 'Discount Sequence', icon: AssignmentIcon, path: '#' },
//         { name: 'Pattern Master', icon: CollectionsBookmarkIcon, path: '#' },
//         { name: 'Cash Discount Terms', icon: MoneyIcon, path: '#' },
//         { name: 'Excise Tariff Master', icon: ReceiptIcon, path: '#' },
//         { name: 'Excise Tariff Group', icon: ReceiptIcon, path: '#' },
//       ],
//     },
//     {
//       id: 'season',
//       name: 'Season',
//       children: [
//         { name: 'Season Master', icon: EventIcon, path: '/masters/season/season' },
//       ],
//     },
//     {
//       id: 'Approval',
//       name: 'Approval',
//       children: [
//         { name: 'Location Master', icon: MapIcon, path: '#' },
//       ],
//     },
//     {
//       id: 'gst',
//       name: 'GST/SAC Code',
//       children: [
//         { name: 'GST Codes', icon: ReceiptIcon, path: '#' },
//       ],
//     },
//     {
//       id: 'other',
//       name: 'Other Misc',
//       children: [
//         { name: 'Broker', icon: HandshakeIcon, path: '#' },
//       ],
//     },
//     {
//       id: 'tds',
//       name: 'TDS Master',
//       children: [
//         { name: 'TDS Master', icon: MoneyIcon, path: '#' },
//       ],
//     },
//     {
//       id: 'qc',
//       name: 'QC Master',
//       children: [
//         { name: 'QC Group', icon: AssignmentIcon, path: '/masters/qc/qcgrp/qcgroup' },
//         { name: 'QC SubGroup', icon: PlaylistAddCheckIcon, path: '/masters/qc/qcsubgrp/qcsubgroup/' },
//         { name: 'QC Parameter', icon: CheckCircleIcon, path: '/masters/qc/qcparameter/qcparamtr' },
//         { name: 'QC Product Process', icon: TrendingUpIcon, path: '/masters/qc/qcprdprocess/qcprdpro' },
//         // { name: 'QC Test',  }, here add qc test 
//         // QC Test Section Header (not clickable)
//         { name: 'QC Test', isHeader: true },

//         { name: 'Raw Material', icon: MdGavel, path: '/masters/qc/qctest/rawmaterial/rawmaterial' },
//         { name: 'Finished Goods', icon: MdTune, path: '/masters/qc/qctest/finishedgoods/finishedgoods' },
//         { name: 'Stores', icon: FaHandshake, path: '/masters/qc/qctest/stores/stores' },
//         { name: 'Semi Finished', icon: MdBuild, path: '/masters/qc/qctest/semifinished/semifinish' },

//       ],
//     },
//     {
//       id: 'ticketing',
//       name: 'Ticketing',
//       children: [
//         { name: 'Ticket Category', icon: CategoryIcon, path: '/masters/ticketing/ticketCategory' },
//         { name: 'Ticket SubCategory', icon: AssignmentIcon, path: '/masters/ticketing/ticketSubCat' },
//         { name: 'Service/Complaint', icon: AnnouncementIcon, path: '/masters/ticketing/serviceComplaint' },
//         { name: 'Raise Ticket', icon: CreateIcon, path: '/tickets/create-tickets' },
//         { name: 'Ticket Escalation', icon: ConfirmationNumberIcon, path: '/tickets/ticket-esclation' },
//         { name: 'Ticket Status', icon: LocalActivityIcon, path: '/tickets/all-tickets' },
//       ],
//     }
//   ];

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       {isClient && (
//         <Box sx={{ width: '100%' }}>
//           <Box sx={{ width: '100%' }}>
//             <StyledTabs
//               value={activeTab}
//               onChange={handleTabChange}
//               variant="scrollable"
//               TabIndicatorProps={{ style: { display: 'none' } }}
//               sx={{
//                 '& .MuiTabs-flexContainer': {
//                   flexWrap: 'wrap',
//                   gap: '2px',
//                   paddingInline: '2px'
//                 },
//                 '& .MuiTabs-scroller': {
//                   overflow: 'visible !important',
//                 },
//                 '@media (max-width: 600px)': {
//                   '& .MuiTabs-flexContainer': {
//                     flexWrap: 'nowrap',
//                   },
//                   '& .MuiTabs-scroller': {
//                     overflowX: 'auto !important',
//                     display: 'flex',
//                     flexWrap: 'nowrap',
//                   },
//                   '& .MuiTabs-scrollButtons': {
//                     width: '25px',
//                     '&.Mui-disabled': {
//                       opacity: 0.3,
//                     },
//                   },
//                 },
//               }}
//             >
//               {menuData.map((tab, index) => (
//                 <StyledTab key={tab.id} label={tab.name} />
//               ))}
//             </StyledTabs>
//           </Box>

//           {menuData.map((tab, index) => (
//             <TabPanel key={tab.id} value={activeTab} index={index}>
//               <Grid container spacing={2}>
//                 {tab.children?.map((item, itemIndex) => {
//                   // Special handling ONLY for QC Test header
//                   if (item.isHeader) {
//                     return (
//                       <Grid size={{ xs: 12 }} key={`header-${itemIndex}`} sx={{ mt: 1, mb: 2 }}>
//                         <Typography
//                           variant="h6"
//                           sx={{
//                             fontWeight: 700,
//                             color: '#635bff',
//                             fontSize: '1.1rem',
//                             display: 'block',
//                             marginTop: '1px',
//                             marginBottom: '10px',
//                           }}
//                         >
//                           {item.name}
//                         </Typography>
//                         <Box
//                           sx={{
//                             height: 2,
//                             width: 15000,
//                             backgroundColor: '#635bff',
//                             borderRadius: 2,
//                             mt: 1, mr: 5
//                           }}
//                         />
//                       </Grid>
//                     );
//                   }
//                   const ItemIcon = item.icon;
//                   return (
//                     <Grid size={{ xs: 6, sm: 3, md: 3, lg: 1.5 }} key={itemIndex}>
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
//                             background: 'linear-gradient(135deg, #5A6EFF 0%, #6A75FF 100%)',
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
//                           <ItemIcon sx={{
//                             fontSize: 25,
//                             mb: 1,
//                             color: 'inherit'
//                           }} />
//                           <Typography variant="body1" sx={{
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
//             </TabPanel>
//           ))}
//         </Box>
//       )}
//     </Suspense>
//   );
// }








'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Card, CardContent, Grid, styled, CircularProgress } from '@mui/material';
import { MdGavel, MdTune, MdBuild } from 'react-icons/md';
import { FaHandshake } from 'react-icons/fa';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import axiosInstance from '@/lib/axios';
import {
  Business as BusinessIcon,
  Domain as DomainIcon,
  Map as MapIcon,
  GroupWork as GroupWorkIcon,
  Category as CategoryIcon,
  Warehouse as WarehouseIcon,
  Work as WorkIcon,
  AccountBox as AccountBoxIcon,
  EmojiPeople as EmojiPeopleIcon,
  Accessibility as AccessibilityIcon,
  Handshake as HandshakeIcon,
  LocalShipping as ShippingIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  LocalOffer as OfferIcon,
  Stars as StarsIcon,
  RateReview as RateReviewIcon,
  Build as BuildIcon,
  ShoppingBag as ShoppingBagIcon,
  CollectionsBookmark as CollectionsBookmarkIcon,
  Straighten as StraightenIcon,
  Receipt as ReceiptIcon,
  Gavel as GavelIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import CreateIcon from '@mui/icons-material/Create';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useRecentPaths } from '../../../app/context/RecentPathsContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`master-tabpanel-${index}`}
      aria-labelledby={`master-tab-${index}`}
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

export default function MasterPage() {
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
    }
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const effectiveUserId = userId || "1";
      try {
        setLoading(true);
        const response = await axiosInstance.post('/MODULE/RetriveWebUserprivs', {
          "FLAG": "UR",
          "TBLNAME": "WebUserprivs",
          "FLDNAME": "User_Id",
          "ID": effectiveUserId.toString(),
          "ORDERBYFLD": "",
          "CWHAER": "",
          "CO_ID": ""
        });

        if (response.data && response.data.DATA) {
          const mastersModule = response.data.DATA.find(item =>
            item.MOD_NAME === "Masters" ||
            item.MOD_DESC === "Masters" ||
            (item.PARENT_ID === "0" && (item.MOD_NAME?.toLowerCase().includes('master') || item.MOD_DESC?.toLowerCase().includes('master')))
          );

          const mastersId = mastersModule ? mastersModule.MOD_ID.toString() : "2";
          const topLevelTabs = response.data.DATA.filter(item =>
            item.PARENT_ID === mastersId &&
            item.MOD_NAME &&
            item.MOD_NAME.trim() !== ''
          );
          const topLevelTabIds = new Set(topLevelTabs.map(tab => tab.MOD_ID.toString()));
          const mastersItems = response.data.DATA.filter(item => {
            if (item.PARENT_ID === mastersId) return true;
            if (topLevelTabIds.has(item.PARENT_ID)) return true;
            const parentItem = response.data.DATA.find(p => p.MOD_ID.toString() === item.PARENT_ID);
            if (parentItem && parentItem.PARENT_ID === mastersId) return true;
            return false;
          });

          const menuTree = buildMenuTree(mastersItems, response.data.DATA, mastersId);
          setMenuData(menuTree);
        } else {
          setMenuData([]);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuData([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMenuItems();
    }
  }, [userId]);

  const buildMenuTree = (data, allData, mastersId) => {
    const itemMap = {};
    const rootItems = [];
    const parentChildMap = {};

    data.forEach(item => {
      if (!item.MOD_ID) return;

      const hasPermission =
        item.ADD_PRIV === "1" ||
        item.EDIT_PRIV === "1" ||
        item.DELETE_PRIV === "1" ||
        item.SELECT_PRIV === "1";

      const isTopLevelTab = item.PARENT_ID === mastersId;

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

        if (parentId && parentId !== mastersId) {
          if (!parentChildMap[parentId]) {
            parentChildMap[parentId] = [];
          }
          parentChildMap[parentId].push(item.MOD_ID);
        }
      }
    });

    const topLevelTabIds = new Set();

    Object.values(itemMap).forEach(item => {
      if (item.parentId && item.parentId !== mastersId && !itemMap[item.parentId]) {
        const parentItem = allData.find(d => d.MOD_ID.toString() === item.parentId);
        if (parentItem && parentItem.PARENT_ID === mastersId) {
          topLevelTabIds.add(item.parentId);
        }
      }
    });

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
            parentId: mastersId,
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

    Object.values(itemMap).forEach(item => {
      if (item.parentId && item.parentId !== mastersId && itemMap[item.parentId]) {
        itemMap[item.parentId].children.push(item);
      } else if (item.parentId === mastersId) {
        rootItems.push(item);
      }
    });

    const sortItems = (items) => {
      items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      items.forEach(item => {
        if (item.children.length > 0) {
          sortItems(item.children);
        }
      });
    };
    sortItems(rootItems);

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
    const iconMap = {
      'Company Master': DomainIcon,
      'Company Area': MapIcon,
      'Company Division': GroupWorkIcon,
      'Stock Type': CategoryIcon,
      'Stock Location': WarehouseIcon,
      'Department': WorkIcon,
      'Designation': AccountBoxIcon,
      'SalesPerson': EmojiPeopleIcon,
      'Employee': AccessibilityIcon,
      'Country Master': MapIcon,
      'State Master': MapIcon,
      'District/City': MapIcon,
      'Pincode': MapIcon,
      'Broker': HandshakeIcon,
      'Transporter': ShippingIcon,
      'Creditors/Suppliers': PersonIcon,
      'Debtors/Customers': PeopleIcon,
      'Category Master': CategoryIcon,
      'Product Group': CategoryIcon,
      'Product Master': ShoppingBagIcon,
      'Style Master': CollectionsBookmarkIcon,
      'Type Master': CategoryIcon,
      'Shade Master': CollectionsBookmarkIcon,
      'Pattern Master': CollectionsBookmarkIcon,
      'Brand Master': CollectionsBookmarkIcon,
      'Unit Master': StraightenIcon,
      'Web Collection': CollectionsBookmarkIcon,
      'Quality': CollectionsBookmarkIcon,
      'RackMst': BuildIcon,
      'Product Series': AssignmentIcon,
      'Prod Series': AssignmentIcon,
      'Tax Group': GavelIcon,
      'Tax Master': GavelIcon,
      'Term Group': GavelIcon,
      'Terms Master': AssignmentIcon,
      'Discount Pattern': OfferIcon,
      'Season Master': EventIcon,
      'GST Codes': ReceiptIcon,
      'TDS Master': MoneyIcon,
      'QC Group': AssignmentIcon,
      'QC SubGroup': PlaylistAddCheckIcon,
      'QC Parameter': CheckCircleIcon,
      'QC Product Process': TrendingUpIcon,
      'Raw Material': MdGavel,
      'Finished Goods': MdTune,
      'Stores': FaHandshake,
      'Semi Finished': MdBuild,
      'Ticket Category': CategoryIcon,
      'Ticket SubCategory': AssignmentIcon,
      'Service/Complaint': AnnouncementIcon,
      'Raise Ticket': CreateIcon,
      'Ticket Escalation': ConfirmationNumberIcon,
      'Ticket Status': LocalActivityIcon,
      'Location': LocalActivityIcon,
    };
    return iconMap[moduleName] || BusinessIcon;
  };

  const handleTabChange = (event, newValue) => {
    const tabId = menuData[newValue]?.id;
    if (tabId) {
      router.push(`/masterpage?activeTab=${tabId}`, { scroll: false });
    }
  };

  const handleCardClick = (path, name) => {
    if (path && path !== '#') {
      addRecentPath(path, name);
      // Use router.push instead of window.location.href for client-side navigation
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
                                background: 'linear-gradient(135deg, #5A6EFF 0%, #6A75FF 100%)',
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
                              <ItemIcon sx={{ fontSize: 25, mb: 1 }} />
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
              <Typography>No menus available for your account</Typography>
            </Box>
          )}
        </Box>
      )}
    </Suspense>
  );
}