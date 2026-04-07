import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Tnatable from '../../../components/inventory/TnaComp/Tnatable';

const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}
  >
    <CircularProgress />
  </Box>
);


export default function TnaTablePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Tnatable />
    </Suspense>
  );
}