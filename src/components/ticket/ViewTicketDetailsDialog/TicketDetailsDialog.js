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
    TextField
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
import { toast, ToastContainer } from 'react-toastify';
import { MdAttachFile, MdClose } from 'react-icons/md';

const inputStyle = {
    '& .MuiInputBase-root': {
        height: 44,
        fontSize: '0.875rem',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        '&:hover': {
            backgroundColor: '#f8fafc',
        },
        '&.Mui-focused': {
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.15)',
        },
    },
    '& .MuiInputLabel-root': {
        fontSize: '0.875rem',
        color: '#4b5563',
        '&.Mui-focused': {
            color: '#2563eb',
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#d1d5db',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9ca3af',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2563eb',
        borderWidth: 2,
    },
};

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

            // Sending the request to update the ticket status
            const response = await axiosInstance.post("TrnTkt/UpdateTrnRslvTkt?UserName=PC0001&strCobrid=02", payload);

            if (response.data.STATUS === 0) {
                toast.success("Ticket resolved successfully!");
                setAttachments([]);
                setResolveRemark("");
                fetchTicketDetails();
            } else {
                toast.error(response.data.MESSAGE || "Failed to resolve ticket");
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
        const files = event.target.files;  // Multiple files selected

        if (files.length === 0) {
            toast.info("No file selected. Please choose a file.");
            return;
        }

        const newAttachments = Array.from(files).map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = () => {
                    const base64File = reader.result; // base64 encoded file data
                    resolve({ fileName: file.name, fileData: base64File });
                };

                reader.onerror = (error) => reject(error);

                reader.readAsDataURL(file);  // Convert to base64
            });
        });

        // Wait for all files to be processed and then update the state
        Promise.all(newAttachments)
            .then((attachmentsData) => {
                setAttachments((prev) => [...prev, ...attachmentsData]);
            })
            .catch(() => {
                toast.error("Error reading the file(s). Please try again.");
            });
    };

    // Handle remove attachment
    const handleRemoveAttachment = (index) => {
        const newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
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
            <ToastContainer />
            <DialogTitle
                sx={{
                    backgroundColor: 'primary.50',
                    borderBottom: 1,
                    borderColor: 'divider',
                    py: 1,
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="600">
                        Ticket Details
                    </Typography>
                    <Box display="flex" alignItems="center" >
                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ marginRight: 2, fontSize: '1rem', color: '#000' }}>
                            Ticket Status →
                        </FormLabel>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={ticketSt}
                                onChange={handleTicketChange}
                            >
                                <FormControlLabel
                                    value="R"
                                    control={<Radio size="small" />}
                                    label="Resolve"
                                />
                                <FormControlLabel
                                    value="C"
                                    control={<Radio size="small" />}
                                    label="Close"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
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
                    <Stack spacing={2} sx={{ pt: 2 }}>
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

                        <Grid container spacing={2}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom fontWeight="600" color="primary.main">
                                                Basic Information
                                            </Typography>

                                            {/* Stack to arrange InfoRows horizontally */}
                                            <Stack direction="row" spacing={4} flexWrap="wrap">
                                                <InfoRow
                                                    icon={<PersonIcon />}
                                                    label="Ticket ID"
                                                    value={ticketDetails.id}
                                                />
                                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                                <InfoRow
                                                    icon={<CategoryIcon />}
                                                    label="Type"
                                                    value={ticketDetails.tktType}
                                                />
                                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                                <InfoRow
                                                    icon={<BuildIcon />}
                                                    label="Tag"
                                                    value={ticketDetails.tktTag}
                                                />
                                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                                <InfoRow
                                                    icon={<CalendarIcon />}
                                                    label="Created Date"
                                                    value={formatDateTime(ticketDetails.createdAt)}
                                                />
                                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                                <InfoRow
                                                    icon={<CalendarIcon />}
                                                    label="Due Date"
                                                    value={formatDate(ticketDetails.dueDate)}
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={6} lg={12}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight="600" color="primary.main">
                                            People & Location
                                        </Typography>
                                        <Stack direction="row" spacing={4}>
                                            <InfoRow
                                                icon={<Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                    {getInitials(ticketDetails.assignee)}
                                                </Avatar>}
                                                label="Assignee"
                                                value={ticketDetails.assignee}
                                            />
                                            <Divider orientation="vertical" flexItem />

                                            <InfoRow
                                                icon={<PersonIcon />}
                                                label="Reporter"
                                                value={ticketDetails.reporter}
                                            />
                                            <Divider orientation="vertical" flexItem />

                                            {ticketDetails.mobileNo && (
                                                <>
                                                    <InfoRow
                                                        icon={<PhoneIcon />}
                                                        label="Mobile No"
                                                        value={ticketDetails.mobileNo}
                                                    />
                                                    <Divider orientation="vertical" flexItem />
                                                </>
                                            )}

                                            <InfoRow
                                                icon={<LocationIcon />}
                                                label="CCN"
                                                value={ticketDetails.ccnName}
                                            />
                                            <Divider orientation="vertical" flexItem />

                                            <InfoRow
                                                icon={<BuildIcon />}
                                                label="Machinery"
                                                value={ticketDetails.machineryName}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6, lg: 12 }}>
                                <TextField
                                    label="Remark"
                                    fullWidth
                                    value={resolveRemark}
                                    onChange={(e) => setResolveRemark(e.target.value)}
                                    placeholder="Write your ticket remark..."
                                    sx={{ ...inputStyle }}
                                />
                            </Grid>

                            {ticketDetails.resolveRemark && (
                                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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

                            <Grid size={{ xs: 12, md: 4, lg: 4 }}>
                                <Card variant="outlined">
                                    <CardContent sx={{ pt: 1, pb: 1 }}>
                                        <Typography variant="h6" gutterBottom fontWeight="600" color="primary.main">
                                            Attach Images
                                        </Typography>

                                        <Box
                                            sx={{
                                                border: "2px dashed #d1d5db",
                                                borderRadius: 2,
                                                p: 3,
                                                textAlign: "center",
                                                cursor: "pointer",
                                                bgcolor: "#fafafa",
                                                "&:hover": { bgcolor: "#f1f5f9" },
                                            }}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                style={{ display: "none" }}
                                                onChange={handleFileUpload}
                                            />
                                            <MdAttachFile sx={{ fontSize: 48, color: "#9ca3af" }} />
                                            <Typography fontWeight={500} color="#6b7280">
                                                Click to upload or drag and drop
                                            </Typography>
                                        </Box>

                                        {/* Attached Files */}
                                        {attachments.length > 0 && (
                                            <Box mt={3}>
                                                <Typography variant="subtitle2" fontWeight={500} mb={1}>
                                                    Attached Files:
                                                </Typography>
                                                {attachments.map((file, index) => (
                                                    <Paper
                                                        key={index}
                                                        sx={{
                                                            p: 2,
                                                            mb: 1,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            bgcolor: "#f9fafb",
                                                            border: "1px solid #e5e7eb",
                                                        }}
                                                    >
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <MdAttachFile fontSize="small" sx={{ color: "#6b7280" }} />
                                                            <Typography variant="body2">{file.fileName}</Typography>
                                                        </Stack>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleRemoveAttachment(index)}
                                                            color="error"
                                                        >
                                                            <MdClose />
                                                        </IconButton>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', gap: 1 }}>
                <Button
                    onClick={updateTicketStatus}
                    variant="contained"
                >
                    Update Status
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color='error'
                >
                    Cancel
                </Button>
                {ticketDetails && (
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                    >
                        Edit Ticket
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default TicketDetailsDialog;