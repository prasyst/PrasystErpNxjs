'use client';

import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import Image from 'next/image';

const Dispatch = () => {
  return (
    <div style={{ background: '#f4f6f8', padding: '32px', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <Typography variant="h1" sx={{ fontWeight: 700, color: '#3a3a3a', fontSize: '36px', marginBottom: 2 }}>
            Dispatch Page Coming Soon...
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px', fontWeight: 400, color: '#666', marginBottom: 4 }}>
            We&apos;re working hard on bringing you the latest stock updates. Stay tuned for more information!
          </Typography>
          <Button
            sx={{
              backgroundColor: '#9dc01eff',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 32px',
              borderRadius: '25px',
              '&:hover': {
                backgroundColor: '#a1bd26ff',
              },
            }}
            size="large"
          >
            🔔 Notify Me
          </Button>
        </Box>

        {/* Optional: Display a card for more details or as a placeholder */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ textAlign: 'center', padding: '32px' }}>
                <Image
                  src="https://cdn.prod.website-files.com/667d3b0059ae51e3dbe3d9d8/67867e699e42a1fc3f72f8a4_January%20PR%20Blog%20Social%20Graphic_FB-p-800.png"
                  alt="Stock"
                  height={100}
                  width={200}
                />
                <Typography variant="h5" color="textPrimary" gutterBottom>
                  Coming Soon!
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  We&apos;re working hard to bring you the latest dispatch information. Stay tuned for real-time updates and detailed insights!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dispatch;