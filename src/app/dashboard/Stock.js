'use client';

import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import Image from 'next/image';

const Stock = () => {
    return (
        <div style={{ background: '#f4f6f8', padding: '32px', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Box textAlign="center" mb={4}>
                    <Typography variant="h1" sx={{ fontWeight: 700, color: '#3a3a3a', fontSize: '36px', marginBottom: 2 }}>
                        Stock Page Coming Soon...
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '18px', fontWeight: 400, color: '#666', marginBottom: 4 }}>
                        We&apos;re working hard on bringing you the latest stock updates. Stay tuned for more information!
                    </Typography>
                    <Button
                        sx={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '12px 32px',
                            borderRadius: '25px',
                            '&:hover': {
                                backgroundColor: '#218838',
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
                                    src="https://img.freepik.com/free-vector/gradient-stock-market-concept_23-2149166910.jpg?semt=ais_hybrid&w=740&q=80"
                                    alt="Stock"
                                    height={100}
                                    width={300}
                                />
                                <Typography variant="h5" color="textPrimary" gutterBottom>
                                    Coming Soon!
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    We&apos;re finalizing the stock page to bring you live updates and analysis. Check back soon for updates!
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Stock;
