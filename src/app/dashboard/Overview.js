'use client';

import Cards from '@/components/dashboard/Cards';
import { Box } from '@mui/material';
import Charts from '@/components/dashboard/Charts';

const OverviewTab = () => {
  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Cards />
      <Charts />
    </Box>
  );
};

export default OverviewTab;