'use client';

import Cards from '@/components/dashboard/Cards';
import { Box } from '@mui/material';
import Charts from '@/components/dashboard/Charts';

const OverviewTab = () => {
  return (
    <Box sx={{ p: 2 }}>
      <h3>Overview Dashboard</h3>
      <Cards/>
    <Charts/>
    </Box>
  );
};

export default OverviewTab;