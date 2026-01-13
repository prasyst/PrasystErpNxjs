'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, IconButton, Button, Chip, Grid, Avatar, Stack, CircularProgress,
    Alert, Divider, Card, CardContent, Paper,
    FormLabel,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    TextareaAutosize
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
    Phone as PhoneIcon,
    AttachFile as AttachFileIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';



const TicketDetailsDialog = ({
    open,
    onClose,
    ticketId,
    onEdit,
}) => {
    const [ticketDetails, setTicketDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [resolveRemark, setResolveRemark] = useState('');
    const [ticketSt, setTicketSt] = useState("R");
    const fileInputRef = useRef(null);

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
                    email: "",
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
            setError("Failed to load ticket details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateTicketStatus = async () => {
        if (!ticketDetails?.TKTKEY) {
            toast.error("Ticket not loaded properly");
            return;
        }

        if (!resolveRemark.trim()) {
            toast.error("Please add a remark before updating status");
            return;
        }

        setUpdating(true);

        try {
            const imageList = attachments.map((att) => {
                if (att.fileData) {
                    const base64Data = att.fileData.split(',')[1];
                    return {
                        ImgName: att.fileName,
                        RslvTktImg: base64Data
                    };
                } else {
                    throw new Error(`File data for ${att.fileName} is missing or invalid.`);
                }
            });

            const payload = {
                TktKey: ticketDetails.TKTKEY,
                TktStatus: ticketSt,
                FLAG: "",
                RslvRmrk: resolveRemark,
                UpdatedBy: 1,
                RslvTktImgList: imageList
            };

            const response = await axiosInstance.post("TrnTkt/UpdateTrnRslvTkt?UserName=PC0001&strCobrid=02", payload);

            if (response.data.STATUS === 0) {
                toast.success("Ticket updated successfully!");
                setAttachments([]);
                setResolveRemark("");
                fetchTicketDetails();
            } else {
                toast.error(response.data.MESSAGE || "Failed to update ticket");
            }
        } catch (error) {
            console.error("Error during update:", error);
            toast.error("Error updating ticket");
        } finally {
            setUpdating(false);
        }
    };

    const handleTicketChange = (event) => {
        setTicketSt(event.target.value);
    };

    const handleFileUpload = (event) => {
        const files = event.target.files;

        if (files.length === 0) {
            toast.info("No file selected. Please choose a file.");
            return;
        }

        const newAttachments = Array.from(files).map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = () => {
                    const base64File = reader.result;
                    resolve({
                        fileName: file.name,
                        fileData: base64File,
                        size: file.size,
                        type: file.type
                    });
                };

                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newAttachments)
            .then((attachmentsData) => {
                setAttachments((prev) => [...prev, ...attachmentsData]);
                toast.success(`${attachmentsData.length} file(s) added successfully`);
            })
            .catch(() => {
                toast.error("Error reading the file(s). Please try again.");
            });
    };

    const handleRemoveAttachment = (index) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
        toast.info("File removed");
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
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '90vh'
                }
            }}
        >
            <ToastContainer />
            <DialogTitle
                sx={{
                    backgroundColor: 'primary.50',
                    borderBottom: 1,
                    borderColor: 'divider',
                    py: 1.5,
                }}
            >
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
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Stack spacing={2}>
                                <Card variant="outlined" sx={{ p: 2 }}>
                                    <Box display="flex"
                                        flexDirection={{ xs: 'column', md: 'row' }}
                                        alignItems={{ xs: 'flex-start', md: 'center' }}
                                        gap={{ xs: 2, md: 3 }}>

                                        {/* Title and Description Section */}
                                        <Box flex={1} width={{ xs: '100%', md: 'auto' }}>
                                            <Typography variant="h5"
                                                fontWeight="700"
                                                gutterBottom
                                                color="primary.main"
                                                fontSize={{ xs: '1.25rem', md: '1.5rem' }}>
                                                {ticketDetails.title}
                                            </Typography>
                                            <Typography variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    lineHeight: 1.4,
                                                    mb: { xs: 2, md: 0 }
                                                }}
                                                fontSize={{ xs: '0.875rem', md: '1rem' }}>
                                                {ticketDetails.description}
                                            </Typography>
                                        </Box>

                                        {/* Chips Section - Mobile में full width, Desktop में auto width */}
                                        <Box display="flex"
                                            flexDirection={{ xs: 'row', md: 'column' }}
                                            gap={1}
                                            width={{ xs: '100%', md: 'auto' }}
                                            minWidth={{ md: '140px' }}
                                            flexWrap={{ xs: 'wrap', md: 'nowrap' }}>

                                            <Chip
                                                icon={<PriorityIcon />}
                                                label={ticketDetails.priority}
                                                color={getPriorityColor(ticketDetails.priority)}
                                                variant="filled"
                                                size="small"
                                                sx={{
                                                    justifyContent: { xs: 'center', md: 'flex-start' },
                                                    flex: { xs: 1, md: 'none' },
                                                    minWidth: { xs: '100px', md: 'auto' }
                                                }}
                                            />

                                            <Chip
                                                label={ticketDetails.status.replace('-', ' ')}
                                                color={getStatusColor(ticketDetails.status)}
                                                variant="filled"
                                                size="small"
                                                sx={{
                                                    justifyContent: { xs: 'center', md: 'flex-start' },
                                                    flex: { xs: 1, md: 'none' },
                                                    minWidth: { xs: '100px', md: 'auto' }
                                                }}
                                            />

                                            <Chip
                                                icon={<CategoryIcon />}
                                                label={ticketDetails.category}
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    justifyContent: { xs: 'center', md: 'flex-start' },
                                                    flex: { xs: 1, md: 'none' },
                                                    minWidth: { xs: '100px', md: 'auto' }
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Card>

                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="600" color="primary.main">
                                            Basic Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item size={{ xs: 12, md: 2 }}>
                                                <InfoRow
                                                    icon={<PersonIcon fontSize="small" />}
                                                    label="Ticket ID"
                                                    value={ticketDetails.id}
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 12, md: 2 }}>
                                                <InfoRow
                                                    icon={<CategoryIcon fontSize="small" />}
                                                    label="Type"
                                                    value={ticketDetails.tktType}
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 12, md: 2 }}>
                                                <InfoRow
                                                    icon={<BuildIcon fontSize="small" />}
                                                    label="Tag"
                                                    value={ticketDetails.tktTag}
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 12, md: 3 }}>
                                                <InfoRow
                                                    icon={<CalendarIcon fontSize="small" />}
                                                    label="Created Date"
                                                    value={formatDateTime(ticketDetails.createdAt)}
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 12, Md: 3 }}>
                                                <InfoRow
                                                    icon={<CalendarIcon fontSize="small" />}
                                                    label="Due Date"
                                                    value={formatDate(ticketDetails.dueDate)}
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 12, Md: 3 }}>
                                                <InfoRow
                                                    icon={<PersonIcon fontSize="small" />}
                                                    label="Reporter"
                                                    value={ticketDetails.reporter}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="600" color="primary.main">
                                            People & Location
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <InfoRow
                                                    icon={<Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                        {getInitials(ticketDetails.assignee)}
                                                    </Avatar>}
                                                    label="Assignee"
                                                    value={ticketDetails.assignee}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                {ticketDetails.mobileNo && (
                                                    <InfoRow
                                                        icon={<PhoneIcon fontSize="small" />}
                                                        label="Mobile No"
                                                        value={ticketDetails.mobileNo}
                                                    />
                                                )}
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InfoRow
                                                    icon={<LocationIcon fontSize="small" />}
                                                    label="CCN"
                                                    value={ticketDetails.ccnName}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InfoRow
                                                    icon={<BuildIcon fontSize="small" />}
                                                    label="Machinery"
                                                    value={ticketDetails.machineryName}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={1}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="600" color="primary.main">
                                            Update Ticket Status
                                        </Typography>

                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <FormLabel id="ticket-status-label" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                                                Select Status
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="ticket-status-label"
                                                name="ticket-status-group"
                                                value={ticketSt}
                                                onChange={handleTicketChange}
                                            >
                                                <FormControlLabel
                                                    value="R"
                                                    control={<Radio />}
                                                    label={
                                                        <Box display="flex" alignItems="center" gap={1}>

                                                            <Typography variant="body2">Resolve</Typography>
                                                        </Box>
                                                    }
                                                />

                                                <FormControlLabel
                                                    value="C"
                                                    control={<Radio />}
                                                    label={
                                                        <Box display="flex" alignItems="center" gap={1}>

                                                            <Typography variant="body2">Close</Typography>
                                                        </Box>
                                                    }
                                                />
                                                <FormControlLabel
                                                    value="H"
                                                    control={<Radio />}
                                                    label={
                                                        <Box display="flex" alignItems="center" gap={1}>

                                                            <Typography variant="body2">Hold</Typography>
                                                        </Box>
                                                    }
                                                />

                                            </RadioGroup>
                                        </FormControl>

                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                                                Resolution Remarks *
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={resolveRemark}
                                                onChange={(e) => setResolveRemark(e.target.value)}
                                                placeholder="Enter resolution remarks here..."
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        fontSize: '0.875rem',
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {/* Attachments Section */}
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                                                Attach Images
                                            </Typography>

                                            <Box
                                                sx={{
                                                    border: '2px dashed #d1d5db',
                                                    borderRadius: 2,
                                                    p: 3,
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    bgcolor: '#fafafa',
                                                    '&:hover': {
                                                        bgcolor: '#f1f5f9',
                                                        borderColor: '#9ca3af'
                                                    },
                                                    mb: 1
                                                }}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileUpload}
                                                />
                                                <AttachFileIcon
                                                    sx={{
                                                        fontSize: 48,
                                                        color: '#9ca3af',
                                                        mb: 1
                                                    }}
                                                />
                                                <Typography fontWeight={500} color="#6b7280" gutterBottom>
                                                    Click to upload images
                                                </Typography>
                                                <Typography variant="caption" color="#9ca3af">
                                                    Supports JPG, PNG, GIF up to 5MB
                                                </Typography>
                                            </Box>

                                            {attachments.length > 0 && (
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={500} mb={1}>
                                                        Selected Files ({attachments.length})
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        {attachments.map((file, index) => (
                                                            <Paper
                                                                key={index}
                                                                variant="outlined"
                                                                sx={{
                                                                    p: 1.5,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    bgcolor: '#f9fafb'
                                                                }}
                                                            >
                                                                <Box display="flex" alignItems="center" gap={1.5}>
                                                                    <AttachFileIcon
                                                                        fontSize="small"
                                                                        sx={{ color: '#6b7280' }}
                                                                    />
                                                                    <Box>
                                                                        <Typography variant="body2" fontWeight={500}>
                                                                            {file.fileName}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {(file.size / 1024).toFixed(2)} KB
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleRemoveAttachment(index)}
                                                                    color="error"
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Paper>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>

                                {ticketDetails.resolveRemark && (
                                    <Card variant="outlined" sx={{ bgcolor: 'success.50' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom fontWeight={600} color="success.main">
                                                Previous Resolution Remarks
                                            </Typography>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 1,
                                                    bgcolor: 'white',
                                                    borderRadius: 1
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {ticketDetails.resolveRemark}
                                                </Typography>
                                            </Paper>
                                        </CardContent>
                                    </Card>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', gap: 1 }}>
                <Button
                    onClick={updateTicketStatus}
                    variant="contained"
                    disabled={updating || !resolveRemark.trim()}
                    startIcon={updating && <CircularProgress size={16} />}
                    sx={{
                        fontSize: {
                            xs: '0.65rem',
                            sm: '0.75rem',
                            md: '0.875rem'
                        },
                    }}
                >
                    {updating ? 'Updating...' : 'Update Status'}
                </Button>
                {ticketDetails && (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{
                            fontSize: {
                                xs: '0.65rem',
                                sm: '0.75rem',
                                md: '0.875rem'
                            },
                        }}
                    >
                        Edit
                    </Button>
                )}
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        fontSize: {
                            xs: '0.65rem',
                            sm: '0.75rem',
                            md: '0.875rem'
                        },
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TicketDetailsDialog;