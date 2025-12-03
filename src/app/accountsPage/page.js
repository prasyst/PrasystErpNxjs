'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
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
  Domain as DomainIcon,
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
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

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState(0);
  // Inside component
  const searchParams = useSearchParams();
  const router = useRouter()

  const handleTabChange = (event, newValue) => {
    const tabId = menuData[newValue]?.id;
    if (tabId) {
      router.push(`/accountspage?activeTab=${tabId}`, { scroll: false });
    }
  };

  useEffect(() => {
    const tabParam = searchParams.get('activeTab');
    const activeTabId = tabParam || 'accountspage';
    const index = menuData.findIndex(tab => tab.id === activeTabId);
    setActiveTab(index >= 0 ? index : 0);
  }, [searchParams]);

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
      id: 'accountspage',
      name: 'Accounts',
      children: [
        { name: 'General Ledger', icon: DomainIcon, path: '/accountspage/general-ledger' },
        { name: 'Accounts Payable', icon: DomainIcon, path: '#' },
        { name: 'Accounts Receivable', icon: DomainIcon, path: '#' },
        { name: 'Financial Reports', icon: DomainIcon, path: '#' },
      ],
    },
  ];
  return (
    <>
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
          <StyledTabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
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
                      // onClick={() => item.path !== '#' && (window.location.href = item.path)}
                      onClick={() => item.path !== '#' && router.push(item.path)}
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

    </>
  );
}