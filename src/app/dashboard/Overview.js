'use client';

import { Box } from '@mui/material';
import Cards from '@/components/dashboard/Cards';
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