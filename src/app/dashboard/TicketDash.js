import React, { useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, LinearProgress, Button, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const TicketDash = () => {
    const ticketData = [
        { name: 'Raised', value: 400 },
        { name: 'Generated', value: 300 },
        { name: 'Assigned', value: 200 },
        { name: 'Closed', value: 150 },
    ];

    const [tickets] = useState(ticketData);

    // Colors for Pie Chart
    const COLORS = ['#64B5F6', '#81C784', '#FFB74D', '#E57373'];

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: '20px' }}>
                Ticket Dashboard (WIP)
            </Typography>

            {/* Overview Section */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Tickets Raised</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>400</Typography>
                            <LinearProgress variant="determinate" value={80} sx={{ marginTop: 2 }} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Tickets Assigned</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>200</Typography>
                            <LinearProgress variant="determinate" value={50} sx={{ marginTop: 2 }} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Tickets Generated</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>300</Typography>
                            <LinearProgress variant="determinate" value={70} sx={{ marginTop: 2 }} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Tickets Closed</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>150</Typography>
                            <LinearProgress variant="determinate" value={40} sx={{ marginTop: 2 }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Ticket Status Pie Chart */}
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Ticket Status Distribution
                </Typography>
                <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={tickets}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={120}
                            fill="#8884d8"
                            label
                        >
                            {tickets.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" />
                    </PieChart>
                </Paper>
            </Box>

            {/* Actions Section */}
            <Grid container spacing={2} sx={{ marginTop: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button variant="contained" fullWidth color="primary" startIcon={<AssignmentIcon />}>
                        View All Tickets
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button variant="outlined" fullWidth color="secondary" startIcon={<BarChartIcon />}>
                        View Graphs
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button variant="contained" fullWidth color="success" startIcon={<CheckCircleIcon />}>
                        Mark As Closed
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button variant="outlined" fullWidth color="error" startIcon={<ErrorIcon />}>
                        Report Issue
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default TicketDash;
