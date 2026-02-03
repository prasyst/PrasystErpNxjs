'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Card, CardContent, Grid, styled, } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  RiBarcodeLine
} from 'react-icons/ri';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import AssistantNavigationIcon from '@mui/icons-material/AssistantNavigation';

import { useRecentPaths } from '../../app/context/RecentPathsContext';

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

export default function TnaComponentPage() {
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
      addRecentPath(path, name);
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
      setActiveTab(0);
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
      name: 'TNA',
       children: [
     { name: 'TNA', icon: AssistantNavigationIcon, path: '/tnapage/tnadash/' },
      { name: 'Update Routing', icon: RiBarcodeLine, path: '/tnapage/updaterouting/' },
      { name: 'Update Rm', icon: AltRouteIcon, path: '/tnapage/updaterm/' },
      { name: 'Update Trims', icon: ContentCutIcon, path: '/tnapage/updatetrims/' },
    ],
    },

  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isClient && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ width: '100%', pb: 1 }}>
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
              {menuData.map((tab, index) => (
                <StyledTab key={tab.id} label={tab.name} />
              ))}
            </StyledTabs>
          </Box>

          {menuData.map((tab, index) => (
            <TabPanel key={tab.id} value={activeTab} index={index}>
              <Grid container spacing={2}>
                {tab.children?.map((item, itemIndex) => {
                  if (item.isHeader) {
                    return (
                      <Grid size={{ xs: 12 }} key={`header-${itemIndex}`} sx={{ mt: 1, mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#635bff',
                            fontSize: '1.1rem',
                            display: 'block',
                            marginTop: '1px',
                            marginBottom: '10px',
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Box
                          sx={{
                            height: 2,
                            width: 15000,
                            backgroundColor: '#635bff',
                            borderRadius: 2,
                            mt: 1, mr: 5
                          }}
                        />
                      </Grid>
                    );
                  }
                  const ItemIcon = item.icon;
                  return (
                    <Grid size={{ xs: 6, sm: 3, md: 3, lg: 1.5 }} key={itemIndex}>
                      <Card
                        sx={{
                          cursor: item.path !== '#' ? 'pointer' : 'default',
                          transition: 'all 0.3s ease',
                          // width: 150,
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
                          <ItemIcon sx={{
                            fontSize: 25,
                            mb: 1,
                            color: 'inherit'
                          }} />
                          <Typography variant="body1" sx={{
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
