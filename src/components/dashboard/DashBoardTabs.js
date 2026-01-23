// import { useState } from 'react';
// import { Box, styled } from '@mui/material';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';

// const DashboardTabs = () => {
//   const [selectedTab, setSelectedTab] = useState(0);

//   const handleChange = (event, newValue) => {
//     setSelectedTab(newValue);
//   };

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
//     fontSize: '14px',
//     minHeight: '36px',
//     padding: '8px 16px',
//     borderRadius: '5px',
//     color: theme.palette.text.secondary,
//     '&.Mui-selected': {
//       color: '#fff',
//       backgroundColor: '#635bff',
//     }
//   }));

//   return (
//     <Box
//       sx={{
//         width: '100%',
//         pb: 1,
//         '& .MuiTabs-root': {
//           padding: '7px 4px 7px 4px !important',
//         },
//       }}
//     >
//       <StyledTabs value={selectedTab} onChange={handleChange}>
//         <StyledTab label="Overview" />
//         <StyledTab label="Reports" />
//         <StyledTab label="Users" />
//         <StyledTab label="Support" />
//         <StyledTab label="Activity" />
//       </StyledTabs>

//       <Box>
//         {selectedTab === 0}
//         {selectedTab === 1}
//         {selectedTab === 2}
//         {selectedTab === 3}
//         {selectedTab === 4}
//       </Box>
//     </Box>
//   );
// };

// export default DashboardTabs;

'use client';

import { useState, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import OverviewTab from '@/app/dashboard/Overview';
import SalesDashboard from '../salesDashboard/SalesDashboard';
import Dispatch from '@/app/dashboard/Dispatch';
import Sales from '@/app/dashboard/Sales';
import Production from '@/app/dashboard/Production';
import Stock from '@/app/dashboard/Stock';
import TicketDashboard from '../ticket/TicketDashboard';
import TNADashboard from '../time&action_plan/time_action_plan';

const DashboardTabs = () => {
  const [selectedTab, setSelectedTab] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTabIndex = localStorage.getItem('selectedTab');
      if (savedTabIndex !== null) {
        setSelectedTab(parseInt(savedTabIndex, 10));
      } else {
        setSelectedTab(0);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedTab !== null) {
      localStorage.setItem('selectedTab', selectedTab);
    }
  }, [selectedTab]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: '#e1e7ef',
    borderRadius: '10px',
    padding: '4px',
    minHeight: '36px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    '& .MuiTabs-indicator': {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      overflowX: 'auto',
    },
  }));

  const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    minHeight: '32px',
    padding: '7px 12px',
    borderRadius: '5px',
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: '#fff',
      backgroundColor: '#635bff',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      padding: '5px 10px',
    },
  }));

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <OverviewTab />;
      case 1:
        return <SalesDashboard />;
      case 2:
        return <Dispatch />;
      case 3:
        return <Sales />;
      case 4:
        return <Production />;
      case 5:
        return <Stock />;
        case 6:
        return <TicketDashboard />;
      default:
        return <TNADashboard />
    }
  };

  if (selectedTab === null) return null;

  return (
    <Box
      sx={{
        width: '100%',
        pb: 1,
        '& .MuiTabs-root': {
          padding: '7px 4px 7px 4px !important',
        },
      }}
    >
      <StyledTabs value={selectedTab} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
        <StyledTab label="Overview" />
        <StyledTab label="Order" />
        <StyledTab label="Dispatch" />
        <StyledTab label="Sales" />
        <StyledTab label="Production" />
        <StyledTab label="Stock" />
        
        <StyledTab label="Ticket" />
        <StyledTab label="TNA" />
      </StyledTabs>

      <Box sx={{ mt: 2 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default DashboardTabs;
