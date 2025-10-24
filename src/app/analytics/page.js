'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
 
} from '@mui/material';

import AnalyticsCom from '@/components/analytics/AnalyticsCom';



export default function AnalyticsPage() {
  return (
    <Box sx={{ width: '100%' }}>
       <AnalyticsCom />
    </Box>
  );
}