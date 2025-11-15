'use client';
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Fade,
  Grow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  LinearProgress, Rating
} from '@mui/material';
import Image from 'next/image';
import {
  NotificationsActive,
  LocalShipping,
  AccessTime,
  ExpandMore,
  Star,
  People,
  Map,
  Phone,
  TrackChanges,
  CardGiftcard
} from '@mui/icons-material';

const Dispatch = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 50%, #fff8e1 100%)',
        minHeight: '100vh',
        py: { xs: 4, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Background Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(157, 192, 30, 0.12)',
          filter: 'blur(90px)',
          animation: 'float 7s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -180,
          right: -180,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(100, 181, 246, 0.1)',
          filter: 'blur(110px)',
          animation: 'float 9s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="xl">
        <Fade in timeout={1000}>
          <Box textAlign="center" mb={{ xs: 5, md: 7 }}>
            <Grow in timeout={800}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' },
                  background: 'linear-gradient(90deg, #2e7d32, #9dc01e)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  letterSpacing: { xs: '-0.5px', md: '-1.5px' },
                }}
              >
                Order Dispatch Center
              </Typography>
            </Grow>

            <Fade in timeout={1200}>
              <Typography
                variant="h5"
                sx={{
                  color: '#424242',
                  fontWeight: 500,
                  mb: 3,
                  mx: 'auto',
                  lineHeight: 1,
                  px: { xs: 2, md: 0 },
                }}
              >
                Real-time Order Tracking, Efficient Dispatch Management, and Instant Alerts — All Integrated in One Comprehensive Platform.
              </Typography>
            </Fade>

            {/* Feature Chips */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
                mb: 4,
                px: { xs: 1, md: 0 },
              }}
            >
              <Fade in timeout={1400}><Chip icon={<LocalShipping />} label="Live Tracking" color="success" variant="outlined" /></Fade>
              <Fade in timeout={1600}><Chip icon={<AccessTime />} label="Orders" color="primary" variant="outlined" /></Fade>
              <Fade in timeout={1800}><Chip icon={<NotificationsActive />} label="Push & SMS" color="warning" variant="outlined" /></Fade>
              <Fade in timeout={2000}><Chip icon={<Phone />} label="Call Driver" color="secondary" variant="outlined" /></Fade>
              <Fade in timeout={1400}><Chip icon={<LocalShipping />} label="Live Order" color="warning" variant="outlined" /></Fade>
              <Fade in timeout={1600}><Chip icon={<AccessTime />} label="Dispatch" color="info" variant="outlined" /></Fade>
              <Fade in timeout={1800}><Chip icon={<NotificationsActive />} label="Notification" color="error" variant="outlined" /></Fade>
              <Fade in timeout={2000}><Chip icon={<Phone />} label="Call Sales Person" color="secondary" variant="outlined" /></Fade>
            </Box>
          </Box>
        </Fade>

        {/* FEATURES GRID */}
        <Grid container spacing={2} justifyContent="center">
          {[
            {
              title: 'Live Dispatch Stock',
              desc: 'Track every move on an interactive real-time stock.',
              img: 'https://cdn.prod.website-files.com/667d3b0059ae51e3dbe3d9d8/67867e699e42a1fc3f72f8a4_January%20PR%20Blog%20Social%20Graphic_FB-p-800.png',
              bg: '#e8f5e9',
              icon: 'Stock',
              progress: 45,
            },
            {
              title: 'Live Order Stocks',
              desc: 'Accurate arrival predictions using traffic & weather data.',
              img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop',
              bg: '#fff3e0',
              icon: 'Order',
              progress: 88,
            },
            {
              title: 'Instant Sales',
              desc: 'SMS, email, and push notifications at every step.',
              img: 'https://blueoctopusllc.wordpress.com/wp-content/uploads/2013/01/saletag1.jpg',
              bg: '#e1f5fe',
              icon: 'Sales',
              progress: 100,
            },
            {
              title: 'Driver Contact',
              desc: 'Call or message your delivery partner directly.',
              img: 'https://www.searchenginejournal.com/wp-content/uploads/2022/08/contact-us-2-62fa2cc2edbaf-sej.png',
              bg: '#f3e5f5',
              icon: 'Dispatch',
              progress: 75,
            },
          ].map((feature, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={index}>
              <Grow in timeout={600 + index * 250}>
                <Card
                  sx={{
                    background: feature.bg,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    transition: 'all 0.4s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.14)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 3, md: 3 },
                      textAlign: 'center',
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: '3.2rem',
                        mb: 2,
                        p: 2,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.8)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        alignSelf: 'center',
                        width: 'fit-content',
                      }}
                    >
                      {feature.icon}
                    </Box>

                    <Image
                      src={feature.img}
                      alt={feature.title}
                      width={300}
                      height={160}
                      style={{
                        borderRadius: '12px',
                        objectFit: 'cover',
                        margin: '16px auto',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        maxWidth: '100%',
                        height: 'auto',
                      }}
                    />

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#1b5e20',
                        mb: 1.5,
                        fontSize: '1.25rem',
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#424242',
                        lineHeight: 1.7,
                        flexGrow: 1,
                      }}
                    >
                      {feature.desc}
                    </Typography>

                    {/* Linear Progress Bar */}
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={feature.progress}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#43a047',
                            transition: 'transform 0.8s ease-out',
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          display: 'block',
                          fontWeight: 600,
                          color: '#1b5e20',
                        }}
                      >
                        {feature.progress}% Complete
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label="Data 2026"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* STATS */}
        <Box my={5} textAlign="center">
          <Typography variant="h5" fontWeight={700} mb={5} color="#1b5e20">
            Trusted by Clients of Growing Businesses
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { icon: <People fontSize="large" />, value: '5,00+', label: 'Active Users' },
              { icon: <Star fontSize="large" />, value: '4.8', label: 'Average Rating' },
              { icon: <TrackChanges fontSize="large" />, value: '25K+', label: 'Orders Dispatched' },
              { icon: <CardGiftcard fontSize="large" />, value: '5000K+', label: 'Total Orders' },
            ].map((stat, i) => (
              <Grid size={{ xs: 12, md: 3 }} key={i}>
                <Fade in timeout={1000 + i * 300}>
                  <Box>
                    <Box sx={{ color: '#9dc01e', mb: 1 }}>{stat.icon}</Box>
                    <Typography variant="h3" fontWeight={900} color="#1b5e20">{stat.value}</Typography>
                    <Typography variant="body1" color="text.secondary">{stat.label}</Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* INTEGRATIONS */}
        <Box my={12} textAlign="center">
          <Typography variant="h5" fontWeight={700} mb={4} color="#1b5e20">
            Seamless Integrations With Top Brands
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {['Shopify', 'OrderAxe', 'Amazon', 'Flipkart', 'Custom API'].map((name, i) => (
              <Grid size={{ xs: 6, sm: 4, md: 2 }} key={i}>
                <Fade in timeout={800 + i * 100}>
                  <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', fontWeight: 600, color: '#1b5e20' }}>
                    {name}
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* TESTIMONIALS */}
        <Box my={5} bgcolor="rgba(255,255,255,0.7)" borderRadius={4} p={{ xs: 3, md: 6 }} boxShadow="0 8px 30px rgba(0,0,0,0.1)">
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={4} color="#1b5e20">
            What Users Are Saying
          </Typography>
          <Grid container spacing={4}>
            {[{
              name: 'Rajesh Kumar',
              role: 'Flipkart Seller',
              text: 'Cut delivery complaints by 70%. Customers love the live map!',
              avatar: 'R',
              rating: 4.5,
            },
            {
              name: 'Priya Singh',
              role: 'Order Maker',
              text: 'The driver chat saved us from 100+ missed deliveries.',
              avatar: 'P',
              rating: 5,
            },
            {
              name: 'Vikram Mehta',
              role: 'Head of department',
              text: 'ETA is 96% accurate — better than Google Maps!',
              avatar: 'V',
              rating: 3,
            }].map((t, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Grow in timeout={800 + i * 200}>
                  <Card sx={{ p: 3, height: '100%', bgcolor: 'white' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: '#9dc01e', mr: 2 }}>{t.avatar}</Avatar>
                      <Box>
                        <Typography fontWeight={600}>{t.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="#424242" lineHeight={1.8}>&quot;{t.text}&quot;</Typography>
                    <Box mt={2}>
                      <Rating
                        name={`rating-${i}`}
                        value={t.rating}
                        precision={0.5}
                        readOnly
                      />
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ */}
        <Box my={5}>
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={3} color="#1b5e20">
            Know Your Orders Questions?
          </Typography>
          {[
            { q: 'When will it launch?', a: 'We are targeting Q1 2026. Sign up to get early access!' },
            { q: 'Is it free?', a: 'Basic tracking is free. Premium features available on subscription.' },
            { q: 'Can I integrate with my store?', a: 'Yes! APIs for Shopify, Amazon, Flipkart and more.' },
            { q: 'Can I use at multiple computers?', a: 'Yes! you can use at many computers.' },
          ].map((faq, i) => (
            <Accordion key={i} sx={{ mb: 2, borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight={600}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* FINAL CTA */}
        <Box textAlign="center" py={4} bgcolor="rgba(157, 192, 30, 0.1)" borderRadius={4}>
          <Typography variant="h4" fontWeight={800} mb={3} color="#1b5e20">
            Ready for Smarter Dispatch?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#9dc01e',
              color: 'white',
              px: 6,
              py: 2,
              borderRadius: '50px',
              fontSize: '1.02rem',
              fontWeight: 'bold',
              boxShadow: '0 10px 30px rgba(157, 192, 30, 0.3)',
              '&:hover': { bgcolor: '#a1bd26', transform: 'translateY(-3px)' },
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Get Early Access
          </Button>
        </Box>

        {/* FOOTER */}
        <Box textAlign="center" mt={{ xs: 6, md: 8 }} pb={4}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Under Development | Expected Launch: <strong>Very Soon</strong>
          </Typography>
        </Box>
      </Container>

      {/* Animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
      `}</style>
    </Box>
  );
};

export default Dispatch;