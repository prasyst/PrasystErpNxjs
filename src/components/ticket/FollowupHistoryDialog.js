'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Divider,
    Chip,
    Avatar,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import {
    Close as CloseIcon,
    History as HistoryIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Description as DescriptionIcon,

} from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';

const FollowupHistoryDialog = ({ open, onClose, ticket }) => {
    const [followupData, setFollowupData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && ticket?.TKTKEY) {
            fetchFollowupHistory();
        }
    }, [open, ticket]);

    const fetchFollowupHistory = async () => {
        if (!ticket?.TKTKEY) return;

        setLoading(true);
        setError(null);

        try {
            const payload = {
                PageNumber: 1,
                PageSize: 50,
                SearchText: "",
                TktKey: ticket.TKTKEY,
                Flag: "TktKeyFilter"
            };

            const response = await axiosInstance.post(
                "TrnTktFlw/GetTrnTktFlwFilterDashBoard?currentPage=1&limit=15",
                payload
            );

            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                setFollowupData(response.data.DATA);
            } else {
                setFollowupData([]);
                toast.warning("No followup history found");
            }
        } catch (error) {
            console.error("Error fetching followup history:", error);
            setError("Failed to load followup history");
            toast.error("Failed to load followup history");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            // PaperProps={{
            //     sx: {
            //         maxHeight: '90vh',
            //         borderRadius: 2,
            //         boxShadow: 24
            //     }
            // }}
        >
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                    color: '#fff',
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >

                <Box display="flex" alignItems="center" gap={1}>
                    <HistoryIcon />
                    <Typography variant="h6" fontWeight="bold">
                        Followup History
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{ color: 'white' }}
                    size="small"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {ticket && (
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-around' }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                            Ticket: {ticket.id}
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" >
                            Title: {ticket.title}
                        </Typography>
                    </Box>
                )}

                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                        <CircularProgress />
                    </Box>
                )}
                {error && !loading && (
                    <Box display="flex" flexDirection="column" alignItems="center" py={8}>
                        <Typography color="error" variant="body1" gutterBottom>
                            {error}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={fetchFollowupHistory}
                            sx={{ mt: 2 }}
                        >
                            Retry
                        </Button>
                    </Box>
                )}

                {!loading && !error && followupData.length > 0 && (
                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: 'LightGray', color: 'gray', fontWeight: 'bold' }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            🗓️
                                            Date & Time
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: 'LightGray', color: 'gray', fontWeight: 'bold' }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <PersonIcon fontSize="small" />
                                            Followed By
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: 'LightGray', color: 'gray', fontWeight: 'bold' }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <DescriptionIcon fontSize="small" />
                                            To Do
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: 'LightGray', color: 'gray', fontWeight: 'bold' }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            💬
                                            Remarks
                                        </Box>
                                    </TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {followupData.map((followup, index) => (
                                    <TableRow
                                        key={followup.FLWID || index}
                                        hover
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                                            '&:hover': { bgcolor: 'action.selected' }
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {formatDate(followup.FLWDT)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                    {getInitials(followup.FLWBY || 'Unknown')}
                                                </Avatar>
                                                <Typography variant="body2">
                                                    {followup.FLWBY || 'Unknown'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                {followup.TODO && (
                                                    <Typography variant="body2" fontWeight="medium" color="primary" gutterBottom>
                                                        {followup.TODO}
                                                    </Typography>
                                                )}

                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                {followup.REMARK && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {followup.REMARK}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {!loading && !error && followupData.length === 0 && (
                    <Box display="flex" flexDirection="column" alignItems="center" py={2}>
                        <HistoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Followup History Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            No followup records available for this ticket.
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                >
                    Close
                </Button>
                <Button
                    onClick={fetchFollowupHistory}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <HistoryIcon />}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FollowupHistoryDialog;