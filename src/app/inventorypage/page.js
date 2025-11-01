'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  styled
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
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

  const inventoryData = [
    {
      id: 'inventory',
      name: 'Inventory',
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
      id: 'provisional-grn',
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
      id: 'sample-packing',
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
      children: [
        { name: 'Stock Enquiry', icon: SearchIcon, path: '/dashboard/stock-enquiry-table' },
        { name: 'Sales Order Offline', icon: ShoppingIcon, path: '/inverntory/inventory-offline' },
        { name: 'Packaging/Barcode', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
      ],
    },
    {
      id: 'sampling-production',
      name: 'Sampling & Production',
      children: [
        { name: 'Buyer Enq', icon: SearchIcon, path: '#' },
        { name: 'Sales Offline', icon: ShoppingIcon, path: '/inverntory/stock-enquiry-table' },
        { name: 'Packaging/Barcode', icon: InventoryIcon, path: '/inverntory/packeging-barcode/' },
      ],
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h5" gutterBottom sx={{ 
        fontWeight: 'bold', 
        mb: 1,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        textAlign: 'center'
      }}>
        Inventory Menu
      </Typography>
      
      <Box
        sx={{
          width: '100%',
          pb: 1,
          '& .MuiTabs-root': {
            padding: '4px 3px 4px 4px !important',
          },
        }}
      >
        <StyledTabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {inventoryData.map((tab, index) => (
            <StyledTab key={tab.id} label={tab.name} />
          ))}
        </StyledTabs>
      </Box>

      {inventoryData.map((tab, index) => (
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
                    onClick={() => item.path !== '#' && (window.location.href = item.path)}
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
        </TabPanel>
      ))}
    </Box>
  );
}