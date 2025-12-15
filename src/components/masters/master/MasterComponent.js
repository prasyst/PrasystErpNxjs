'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  styled,
  Chip,
  IconButton
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  RiFileList2Line, RiFolder3Line, RiGitBranchLine,
  RiGitMergeLine, RiArticleLine, RiBook2Line, RiUserSettingsLine,
  RiEarthLine,
  RiMapLine,
  RiCommunityLine,
  RiBuilding2Line,
  RiPriceTag3Line,
  RiMapPinLine,
  RiShareForwardLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri';
import { FaWarehouse } from 'react-icons/fa';
import {
  Business as BusinessIcon,
  LocalShipping as TruckIcon,
  People as PeopleIcon,
  Inventory as ProductsIcon,
  Balance as BalanceIcon,
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
  History as HistoryIcon,
  Close as CloseIcon
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
  const router = useRouter();
  const { recentPaths, addRecentPath, removeRecentPath, clearRecentPaths } = useRecentPaths(); // Use the context

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTabChange = (event, newValue) => {
    const tabId = menuData[newValue]?.id;
    if (tabId) {
      router.push(`/masterpage?activeTab=${tabId}`, { scroll: false });
    }
  };

  const handleCardClick = (path, name) => {
    if (path && path !== '#') {
      // Add to recent paths
      addRecentPath(path, name);
      // Navigate to the path
      window.location.href = path;
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const tabParam = searchParams.get('activeTab') || '';
    const index = menuData.findIndex(tab => tab.id === tabParam);
    if (tabParam && index !== -1 && index !== activeTab) {
      setActiveTab(index);
    } else if (!tabParam) {
      setActiveTab(-1);
    }
  }, [searchParams, isClient, activeTab]);

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

  const menuData = [
    {
      id: 'company',
      name: 'Company',
      children: [
        { name: 'Company', icon: DomainIcon, path: '/masters/company/company' },
        { name: 'Company Area', icon: MapIcon, path: '#' },
        { name: 'Company Division', icon: GroupWorkIcon, path: '#' },
        { name: 'Stock Type', icon: CategoryIcon, path: '#' },
        { name: 'Stock Location', icon: WarehouseIcon, path: '#' },
        { name: 'Department', icon: WorkIcon, path: '#' },
        { name: 'Designation', icon: AccountBoxIcon, path: '#' },
        { name: 'SalesPerson', icon: EmojiPeopleIcon, path: '#' },
        { name: 'Employee', icon: AccessibilityIcon, path: '#' },
      ],
    },
    {
      id: 'location',
      name: 'Location',
      children: [
        { name: 'Country Master', icon: RiEarthLine, path: '#' },
        { name: 'Region/Zone Master', icon: RiMapLine, path: '#' },
        { name: 'State Master', icon: RiCommunityLine, path: '#' },
        { name: 'District/City', icon: RiBuilding2Line, path: '#' },
        { name: 'StockType Master', icon: RiPriceTag3Line, path: '#' },
        { name: 'WareHouse Stock Location', icon: FaWarehouse, path: '#' },
        { name: 'Pincode', icon: RiMapPinLine, path: '#' },
        { name: 'Pincode Allocation', icon: RiShareForwardLine, path: '#' },
      ],
    },
    {
      id: 'vendors',
      name: 'Vendors',
      children: [
        { name: 'Broker', icon: HandshakeIcon, path: '#' },
        { name: 'Transporter', icon: ShippingIcon, path: '#' },
        { name: 'Creditors/Suppliers', icon: PersonIcon, path: '/masters/vendors' },
      ],
    },
    {
      id: 'customers',
      name: 'Customers',
      children: [
        { name: 'Debtors/Customers', icon: PeopleIcon, path: '/masters/customers' },
        { name: 'Category (For Rate)', icon: CategoryIcon, path: '#' },
        { name: 'Customer Group', icon: PeopleIcon, path: '#' },
        { name: 'Consignee', icon: PersonIcon, path: '#' },
        { name: 'Party Class Master', icon: ClassIcon, path: '#' },
        { name: 'Party Wise Rate List', icon: OfferIcon, path: '#' },
        { name: 'Party Brand Broker', icon: StarsIcon, path: '#' },
        { name: 'Party Rating Update', icon: RateReviewIcon, path: '#' },
        { name: 'Party Brand Parameter', icon: BuildIcon, path: '#' },
      ],
    },
    {
      id: 'process',
      name: 'Process',
      children: [
        { name: 'Process Master', icon: RiFileList2Line, path: '#' },
        { name: 'Process Group', icon: RiFolder3Line, path: '#' },
        { name: 'Routing Group', icon: RiGitBranchLine, path: '#' },
        { name: 'Routing Process', icon: RiGitMergeLine, path: '#' },
        { name: 'Process(Instruction)', icon: RiArticleLine, path: '#' },
        { name: 'Process Group(Instruction)', icon: RiBook2Line, path: '#' },
        { name: 'PartyWise Process', icon: RiUserSettingsLine, path: '#' },
        { name: 'Approval Stage', icon: RiCheckboxCircleLine, path: '#' },
      ],
    },
    {
      id: 'products',
      name: 'Products',
      children: [
        { name: 'Category Master', icon: CategoryIcon, path: '/masters/products/category' },
        { name: 'Product Group', icon: CategoryIcon, path: '/masters/products/productgrp' },
        { name: 'Product Master', icon: ShoppingBagIcon, path: '/masters/products/product' },
        { name: 'Style Master', icon: CollectionsBookmarkIcon, path: '#' },
        { name: 'Type Master', icon: CategoryIcon, path: '/masters/products/type' },
        { name: 'Shade Master', icon: CollectionsBookmarkIcon, path: '/masters/products/shade' },
        { name: 'Pattern Master', icon: CollectionsBookmarkIcon, path: '/masters/products/pattern' },
        { name: 'Brand Master', icon: CollectionsBookmarkIcon, path: '/masters/products/brand' },
        { name: 'Unit Master', icon: StraightenIcon, path: '/masters/products/unit' },
        { name: 'Web Collection', icon: CollectionsBookmarkIcon, path: '/masters/products/webcollection' },
        { name: 'Quality', icon: CollectionsBookmarkIcon, path: '/masters/products/quality' },
        { name: 'RackMst', icon: BuildIcon, path: '/masters/products/rack' },
        { name: 'Prod Series', icon: AssignmentIcon, path: '/masters/products/prodseries' },
      ],
    },
    {
      id: 'tax',
      name: 'Tax/Terms',
      children: [
        { name: 'Tax Group', icon: GavelIcon, path: '#' },
        { name: 'Tax Master', icon: GavelIcon, path: '/masters/taxterms/taxmaster' },
        { name: 'Term Group', icon: GavelIcon, path: '#' },
        { name: 'Terms Master', icon: AssignmentIcon, path: '/masters/taxterms/termmaster' },
        { name: 'Discount Pattern', icon: OfferIcon, path: '#' },
        { name: 'Discount Sequence', icon: AssignmentIcon, path: '#' },
        { name: 'Pattern Master', icon: CollectionsBookmarkIcon, path: '#' },
        { name: 'Cash Discount Terms', icon: MoneyIcon, path: '#' },
        { name: 'Excise Tariff Master', icon: ReceiptIcon, path: '#' },
        { name: 'Excise Tariff Group', icon: ReceiptIcon, path: '#' },
      ],
    },
    {
      id: 'season',
      name: 'Season',
      children: [
        { name: 'Season Master', icon: EventIcon, path: '/masters/season/season' },
      ],
    },
    {
      id: 'Approval',
      name: 'Approval',
      children: [
        { name: 'Location Master', icon: MapIcon, path: '#' },
      ],
    },
    {
      id: 'gst',
      name: 'GST/SAC Code',
      children: [
        { name: 'GST Codes', icon: ReceiptIcon, path: '#' },
      ],
    },
    {
      id: 'other',
      name: 'Other Misc',
      children: [
        { name: 'Broker', icon: HandshakeIcon, path: '#' },
      ],
    },
    {
      id: 'tds',
      name: 'TDS Master',
      children: [
        { name: 'TDS Master', icon: MoneyIcon, path: '#' },
      ],
    },
    {
      id: 'qc',
      name: 'QC Master',
      children: [
        { name: 'QC Group', icon: AssignmentIcon , path: '/masters/qc/qcgrp/qcgroup' },
        { name: 'QC SubGroup', icon: PlaylistAddCheckIcon , path: '/masters/qc/qcsubgrp/qcsubgroup/' },
        { name: 'QC Parameter', icon: CheckCircleIcon , path: '#' },
        { name: 'QC Product Process', icon: TrendingUpIcon , path: '#' },
        { name: 'QC Test', icon: BuildIcon, path: '#' },
      ],
    },
    {
      id: 'ticketing',
      name: 'Ticketing',
      children: [
        { name: 'Ticket Category', icon: CategoryIcon, path: '/masters/ticketing/ticketCategory' },
        { name: 'Ticket SubCategory', icon: AssignmentIcon, path: '/masters/ticketing/ticketSubCat' },
        { name: 'Service/Complaint', icon: AnnouncementIcon, path: '/masters/ticketing/serviceComplaint' },
        { name: 'Raise Ticket', icon: CreateIcon, path: '/tickets/create-tickets' },
        { name: 'Ticket Escalation', icon: ConfirmationNumberIcon, path: '/tickets/ticket-esclation' },
        { name: 'Ticket Status', icon: LocalActivityIcon, path: '/tickets/all-tickets' },
      ],
    }
  ];

  // Create a map of all paths for easy lookup
  const allPathsMap = menuData.reduce((acc, tab) => {
    tab.children.forEach(child => {
      if (child.path && child.path !== '#') {
        acc[child.path] = child;
      }
    });
    return acc;
  }, {});

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isClient && (
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
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"                  
              TabIndicatorProps={{ style: { display: 'none' } }}
              sx={{
                '& .MuiTabs-flexContainer': {
                  flexWrap: 'wrap',
                  gap: '2px',
                  paddingInline: '2px'                      
                },
                '& .MuiTabs-scroller': {
                  overflow: 'visible !important',
                },
              }}
            >
              {menuData.map((tab, index) => (
                <StyledTab key={tab.id} label={tab.name} />
              ))}
            </StyledTabs>
          </Box>

          {menuData.map((tab, index) => (
            <TabPanel key={tab.id} value={activeTab} index={index}>
              <Grid container spacing={2}>
                {tab.children?.map((item, itemIndex) => {
                  const ItemIcon = item.icon;
                  return (
                    <Grid item xs={6} sm={6} md={4} lg={3} key={itemIndex}>
                      <Card
                        sx={{
                          cursor: item.path !== '#' ? 'pointer' : 'default',
                          transition: 'all 0.3s ease',
                          width: 150,
                          height: '100%',
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
                            }} />
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
            </TabPanel>
          ))}
        </Box>
      )}
    </Suspense>
  );
}