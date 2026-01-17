'use client';

import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import Image from 'next/image';

const Production = () => {
  return (
    <div style={{ background: '#f4f6f8', padding: '32px', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <Typography variant="h1" sx={{ fontWeight: 700, color: '#3a3a3a', fontSize: '36px', marginBottom: 2 }}>
            Production Page Coming Soon...
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px', fontWeight: 400, color: '#666', marginBottom: 4 }}>
            We&apos;re working hard on bringing you the latest stock updates. Stay tuned for more information!
          </Typography>
          <Button
            sx={{
              backgroundColor: '#1e8dc0ff',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 32px',
              borderRadius: '25px',
              '&:hover': {
                backgroundColor: '#2679bdff',
              },
            }}
            size="large"
          >
            🔔 Notify Me
          </Button>
        </Box>

        {/* Optional: Display a card for more details or as a placeholder */}
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Card sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ textAlign: 'center', padding: '32px' }}>
                <Image
                  src="https://media.istockphoto.com/id/1435491075/photo/business-logistics-technology-concept.jpg?s=612x612&w=0&k=20&c=OyPiRP_B8k7XbQMqQg-d-FkpZrU7Lj5ayPKaEETXqsM="
                  alt="Stock"
                  height={100}
                  width={200}
                />
                <Typography variant="h5" color="textPrimary" gutterBottom>
                  Coming Soon!
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  We&apos;re working hard to bring you the latest Productions updates and promotions. Stay tuned for exciting offers and new products!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Production;