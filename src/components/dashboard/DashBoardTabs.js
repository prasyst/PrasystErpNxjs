import { useState } from 'react';
import { Box, styled } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const DashboardTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
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
    fontSize: '14px',
    minHeight: '36px',
    padding: '8px 16px',
    borderRadius: '5px',
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: '#fff',
      backgroundColor: '#635bff',
    }
  }));

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
      <StyledTabs value={selectedTab} onChange={handleChange}>
        <StyledTab label="Overview" />
        <StyledTab label="Reports" />
        <StyledTab label="Users" />
        <StyledTab label="Support" />
        <StyledTab label="Activity" />
      </StyledTabs>

      <Box>
        {selectedTab === 0}
        {selectedTab === 1}
        {selectedTab === 2}
        {selectedTab === 3}
        {selectedTab === 4}
      </Box>
    </Box>
  );
};

export default DashboardTabs;
