import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    IconButton,
    Button,
    Chip,
    Grid,
    Avatar,
    Stack,
    CircularProgress,
    Alert,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import {
    Close as CloseIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    PriorityHigh as PriorityIcon,
    Category as CategoryIcon,
    Build as BuildIcon,
    LocationOn as LocationIcon,
    Email as EmailIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import axiosInstance from '@/lib/axios';

const TicketDetailsDialog = ({
    open,
    onClose,
    ticketId,
    onEdit
}) => {
    const [ticketDetails, setTicketDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && ticketId) {
            fetchTicketDetails();
        } else {
            setTicketDetails(null);
            setError(null);
        }
    }, [open, ticketId]);

    const fetchTicketDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                FLAG: "R",
                TBLNAME: "TrnTkt",
                FLDNAME: "TktKey",
                ID: ticketId,
                ORDERBYFLD: "",
                CWHAER: "",
                CO_ID: ""
            };

            const response = await axiosInstance.post(
                "TrnTkt/RetriveTrnTkt",
                payload
            );

            if (response.data.STATUS === 0 && response.data.DATA?.trnTktDtlList?.[0]) {
                const ticketData = response.data.DATA.trnTktDtlList[0];

                const mappedTicket = {
                    TKTKEY: ticketData.TktKey,
                    id: ticketData.TktNo,
                    title: ticketData.Remark || "No Title",
                    description: ticketData.TktDesc || ticketData.Reason || "No description available",
                    category: ticketData.TktServiceName || "General",
                    priority: ticketData.TktSvrtyName || "Medium",
                    status: ticketData.TktStatus === "O" ? "open" :
                        ticketData.TktStatus === "P" ? "in-progress" :
                            ticketData.TktStatus === "R" ? "resolved" : "closed",
                    assignee: ticketData.TechEMP_NAME || "Unassigned",
                    reporter: ticketData.RaiseByNm || "Unknown",
                    createdAt: ticketData.TktDate,
                    dueDate: ticketData.AssignDt || ticketData.TktDate,
                    tktFor: ticketData.TktFor === "M" ? "Machine" :
                        ticketData.TktFor === "C" ? "CCN" : "Department",
                    ccnName: ticketData.CCN_Key || "",
                    machineryName: ticketData.Machinery_Name || "",
                    mobileNo: ticketData.MobileNo || "",
                    email: "", // Email field not present in response
                    location: ticketData.CCN_Key || "",
                    tktType: ticketData.TktTypeName || "",
                    tktTag: ticketData.TktTagName || "",
                    resolveRemark: ticketData.RslvRmrk || ""
                };

                setTicketDetails(mappedTicket);
            } else {
                setError("No ticket data found");
            }
        } catch (err) {
            console.error('Error fetching ticket details:', err);
            setError("Failed to load ticket details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'error';
            case 'in-progress': return 'warning';
            case 'resolved': return 'success';
            case 'closed': return 'default';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    const getInitials = (name) => {
        if (!name || name === "Unassigned") return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return "Invalid date";
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "Not set";
        try {
            return new Date(dateString).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return "Invalid date";
        }
    };

    const handleEdit = () => {
        if (ticketDetails && onEdit) {
            onEdit(ticketDetails);
        }
    };

    const InfoRow = ({ icon, label, value }) => (
        <Box display="flex" alignItems="center" gap={2} py={1}>
            <Box sx={{ color: 'text.secondary', minWidth: 24 }}>
                {icon}
            </Box>
            <Box flex={1}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {label}
                </Typography>
                <Typography variant="body1" fontWeight="500">
                    {value || "Not specified"}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{
                backgroundColor: 'primary.50',
                borderBottom: 1,
                borderColor: 'divider',
                py: 2
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="600">
                        Ticket Details
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            backgroundColor: 'action.hover',
                            '&:hover': { backgroundColor: 'action.selected' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                        <CircularProgress size={32} />
                        <Typography variant="body1" sx={{ ml: 2 }} color="text.secondary">
                            Loading ticket details...
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        action={
                            <Button color="inherit" size="small" onClick={fetchTicketDetails}>
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {ticketDetails && !loading && (
                    <Stack spacing={4}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Box display="flex" alignItems="flex-start" gap={3}>
                                <Box flex={1}>
                                    <Typography variant="h5" fontWeight="700" gutterBottom color="primary.main">
                                        {ticketDetails.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                                        {ticketDetails.description}
                                    </Typography>
                                </Box>

                                <Box display="flex" flexDirection="column" gap={1} minWidth="140px">
                                    <Chip
                                        icon={<PriorityIcon />}
                                        label={ticketDetails.priority}
                                        color={getPriorityColor(ticketDetails.priority)}
                                        variant="filled"
                                        size="small"
                                        sx={{ justifyContent: 'flex-start' }}
                                    />
                                    <Chip
                                        label={ticketDetails.status.replace('-', ' ')}
                                        color={getStatusColor(ticketDetails.status)}
                                        variant="filled"
                                        size="small"
                                        sx={{ justifyContent: 'flex-start' }}
                                    />
                                    <Chip
                                        icon={<CategoryIcon />}
                                        label={ticketDetails.category}
                                        variant="outlined"
                                        size="small"
                                        sx={{ justifyContent: 'flex-start' }}
                                    />
                                </Box>
                            </Box>
                        </Card>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="600" color="primary.main">
                                            Basic Information
                                        </Typography>
                                        <Stack spacing={1}>
                                            <InfoRow
                                                icon={<PersonIcon />}
                                                label="Ticket ID"
                                                value={ticketDetails.id}
                                            />
                                            <Divider />
                                            <InfoRow
                                                icon={<CategoryIcon />}
                                                label="Type"
                                                value={ticketDetails.tktType}
                                            />
                                            <Divider />
                                            <InfoRow
                                                icon={<BuildIcon />}
                                                label="Tag"
                                                value={ticketDetails.tktTag}
                                            />
                                            <Divider />
                                            <InfoRow
                                                icon={<CalendarIcon />}
                                                label="Created Date"
                                                value={formatDateTime(ticketDetails.createdAt)}
                                            />
                                            <Divider />
                                            <InfoRow
                                                icon={<CalendarIcon />}
                                                label="Due Date"
                                                value={formatDate(ticketDetails.dueDate)}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="600" color="primary.main">
                                            People & Location
                                        </Typography>
                                        <Stack spacing={1}>
                                            <InfoRow
                                                icon={<Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                    {getInitials(ticketDetails.assignee)}
                                                </Avatar>}
                                                label="Assignee"
                                                value={ticketDetails.assignee}
                                            />
                                            <Divider />
                                            <InfoRow
                                                icon={<PersonIcon />}
                                                label="Reporter"
                                                value={ticketDetails.reporter}
                                            />
                                            <Divider />
                                            {ticketDetails.mobileNo && (
                                                <>
                                                    <InfoRow
                                                        icon={<PhoneIcon />}
                                                        label="Mobile No"
                                                        value={ticketDetails.mobileNo}
                                                    />
                                                    <Divider />
                                                </>
                                            )}
                                            <InfoRow
                                                icon={<LocationIcon />}
                                                label="CCN"
                                                value={ticketDetails.ccnName}
                                            />
                                            <Divider />
                                            <InfoRow
                                                icon={<BuildIcon />}
                                                label="Machinery"
                                                value={ticketDetails.machineryName}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {ticketDetails.resolveRemark && (
                                <Grid item xs={12}>
                                    <Card variant="outlined" sx={{ backgroundColor: 'success.50' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom fontWeight="600" color="success.main">
                                                Resolution Remarks
                                            </Typography>
                                            <Typography variant="body1">
                                                {ticketDetails.resolveRemark}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{
                px: 3,
                py: 2,
                borderTop: 1,
                borderColor: 'divider',
                gap: 1
            }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ minWidth: 100 }}
                >
                    Close
                </Button>
                {ticketDetails && (
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{ minWidth: 120 }}
                    >
                        Edit Ticket
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default TicketDetailsDialog;