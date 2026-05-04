'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    Button,
    Chip,
    Grid,
    Avatar,
    Stack,
    CircularProgress,
    Alert,
    Divider,
    TextField,
    Paper,
    Tabs,
    Tab,
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
    Phone as PhoneIcon,
    Email as EmailIcon,
    AttachFile as AttachFileIcon,
    Delete as DeleteIcon,
    Send as SendIcon,
    Chat as ChatIcon,
    Refresh as RefreshIcon,
    ArrowBack as ArrowBackIcon,
    Check as CheckIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { toast, ToastContainer } from 'react-toastify';

const TicketDetailsDialog = ({
    open,
    onClose,
    ticketId,
    onEdit,
    setTicketDetailsOpen
}) => {
    const [ticketDetails, setTicketDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [resolveRemark, setResolveRemark] = useState('');
    const [ticketSt, setTicketSt] = useState("R");
    const [activeTab, setActiveTab] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);



    useEffect(() => {
        if (ticketDetails?.status) {
            let statusValue = "";
            switch (ticketDetails.status.toLowerCase()) {
                case "open":
                    statusValue = "O";
                    break;
                case "resolved":
                    statusValue = "R";
                    break;
                case "closed":
                    statusValue = "C";
                    break;
                case "hold":
                    statusValue = "H";
                    break;
                case "in-progress":
                    statusValue = "P";
                    break;
                default:
                    statusValue = "O";
            }
            setTicketSt(statusValue);
        }
    }, [ticketDetails?.status]);

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

            const response = await axiosInstance.post("TrnTkt/RetriveTrnTkt", payload);

            if (response.data.STATUS === 0 && response.data.DATA?.trnTktDtlList?.[0]) {
                const ticketData = response.data.DATA.trnTktDtlList[0];

                const cleanImageUrl = (imgUrl) => {
                    if (!imgUrl) return null;
                    let url = String(imgUrl).trim();
                    url = url.replace(/^http:\/(?!\/)/, 'http://');
                    url = url.replace(/^http:\/\/localhost:4001\//, 'http://');
                    if (!url.startsWith('http')) {
                        const backendBase = 'http://43.230.196.22:8180';
                        url = url.startsWith('/')
                            ? `${backendBase}${url}`
                            : `${backendBase}/${url}`;
                    }
                    return url;
                };

                const mappedTicket = {
                    TKTKEY: ticketData.TktKey,
                    id: ticketData.TktNo,
                    title: ticketData.Remark || "No Title",
                    description: ticketData.TktDesc || ticketData.Reason || "No description available",
                    category: ticketData.TktServiceName || "General",
                    priority: ticketData.TktSvrtyName || "Medium",
                    status: ticketData.TktStatus === "O" ? "Open" :
                        ticketData.TktStatus === "P" ? "in-progress" :
                            ticketData.TktStatus === "R" ? "resolved" :
                                ticketData.TktStatus === "H" ? "Hold" : "closed",
                    assignee: ticketData.TechEMP_NAME || "Unassigned",
                    reporter: ticketData.RaiseByNm || "Unknown",
                    createdAt: ticketData.TktDate,
                    updatedAt: ticketData.TktDate,
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
                    resolveRemark: ticketData.RslvRmrk || "",
                    ticketImage: cleanImageUrl(ticketData.TktImage),
                    comments: []
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
                setTicketDetailsOpen(false);
            } else {
                toast.error(response.data.MESSAGE || "Failed to update ticket");
            }
        } catch (error) {
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

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        setIsSubmitting(true);
        setTimeout(() => {
            const newCommentObj = {
                id: Date.now(),
                text: newComment,
                author: 'Current User',
                type: 'comment',
                createdAt: new Date().toISOString()
            };
            setTicketDetails(prev => ({
                ...prev,
                comments: [...(prev?.comments || []), newCommentObj]
            }));
            setNewComment('');
            setIsSubmitting(false);
            toast.success("Comment added successfully");
        }, 500);
    };

    const getStatusColor = (status) => {
        const colors = {
            'open': '#ef4444',
            'in-progress': '#f59e0b',
            'resolved': '#10b981',
            'hold': '#8b5cf6',
            'closed': '#6b7280'
        };
        return colors[status?.toLowerCase()] || '#9ca3af';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'high': '#ef4444',
            'medium': '#f59e0b',
            'low': '#10b981'
        };
        return colors[priority?.toLowerCase()] || '#9ca3af';
    };

    const getCategoryColor = (category) => {
        return '#3b82f6';
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

    const statuses = [
        { id: 'open', name: 'open', displayName: 'Open', color: '#ef4444', value: 'O' },
        { id: 'in-progress', name: 'in-progress', displayName: 'In Progress', color: '#f59e0b', value: 'P' },
        { id: 'resolved', name: 'resolved', displayName: 'Resolved', color: '#10b981', value: 'R' },
        { id: 'hold', name: 'hold', displayName: 'Hold', color: '#8b5cf6', value: 'H' },
        { id: 'closed', name: 'closed', displayName: 'Closed', color: '#6b7280', value: 'C' }
    ];

    return (
        <>
            <ToastContainer />
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '0.75rem',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        m: 0,
                        p: 0
                    }
                }}
            >

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    m: 0,
                    p: '1rem 1.5rem'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <IconButton
                            onClick={onClose}
                            sx={{ p: '0.5rem', color: '#6b7280' }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h6" sx={{
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                color: '#111827',
                                mb: '0.25rem'
                            }}>
                                {loading ? 'Loading...' : ticketDetails?.title}
                            </Typography>
                            {!loading && ticketDetails && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                 
                                    <Chip
                                        label={ticketDetails.status?.replace('-', ' ')}
                                        size="medium"
                                        sx={{
                                            backgroundColor: getStatusColor(ticketDetails.status),
                                            color: 'white',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            fontSize: '0.75rem',
                                            height: '28px',
                                            '& .MuiChip-label': {
                                                px: 1.5
                                            }
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                        {ticketDetails.id} • Created {formatDateTime(ticketDetails.createdAt)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Button
                        onClick={updateTicketStatus}
                        variant="contained"
                        // disabled={updating || !resolveRemark.trim()}
                        sx={{
                            backgroundColor: '#2563eb',
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            '&:hover': {
                                backgroundColor: '#1d4ed8'
                            }
                        }}
                    >
                        {updating ? 'Updating...' : 'Update Status'}
                    </Button>
                        <Button
                            onClick={handleEdit}
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            sx={{
                                borderColor: '#d1d5db',
                                color: '#374151',
                                textTransform: 'none',
                                fontSize: '0.875rem'
                            }}
                        >
                            Edit
                        </Button>
                        <IconButton onClick={onClose} sx={{ color: '#6b7280' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    m: 0,
                    p: 0
                }}>
                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" py={6} width="100%">
                            <CircularProgress size={32} />
                            <Typography variant="body1" sx={{ ml: 2 }} color="text.secondary">
                                Loading ticket details...
                            </Typography>
                        </Box>
                    )}

                    {error && (
                        <Box p={3} width="100%">
                            <Alert
                                severity="error"
                                action={
                                    <Button color="inherit" size="small" onClick={fetchTicketDetails}>
                                        Retry
                                    </Button>
                                }
                            >
                                {error}
                            </Alert>
                        </Box>
                    )}

                    {ticketDetails && !loading && (
                        <>
                            <Box sx={{ 
                                flex: 1, 
                                overflow: 'auto',
                                m: 0,
                                p: '1.5rem'
                            }}>
                                
                                <Box sx={{ mb: '1rem' }}>
                                    <Typography sx={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#111827',
                                        mb: '1rem'
                                    }}>
                                        Description
                                    </Typography>
                                    <Paper sx={{
                                        p: '1rem',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e5e7eb',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.5,
                                        color: '#374151'
                                    }}>
                                        {ticketDetails.description}
                                    </Paper>
                                </Box>

                                {/* Tabs */}
                                <Box sx={{ mb: '1.5rem' }}>
                                    <Tabs
                                        value={activeTab}
                                        onChange={(e, newValue) => setActiveTab(newValue)}
                                        sx={{
                                            borderBottom: '1px solid #e5e7eb',
                                            mb: '1rem',
                                            '& .MuiTab-root': {
                                                textTransform: 'none',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                minHeight: 'auto',
                                                p: '0.75rem 1rem',
                                                color: '#6b7280'
                                            },
                                            '& .Mui-selected': {
                                                color: '#2563eb'
                                            },
                                            '& .MuiTabs-indicator': {
                                                backgroundColor: '#2563eb'
                                            }
                                        }}
                                    >
                                        <Tab label="Details" />
                        
                                      
                                    </Tabs>

                                    {activeTab === 0 && (
                                        <Box>
                                            <Grid container spacing={2} sx={{ mb: '2rem' }}>
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Category
                                                    </Typography>
                                                    <Chip
                                                        label={ticketDetails.category}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getCategoryColor(ticketDetails.category)}20`,
                                                            color: getCategoryColor(ticketDetails.category),
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Priority
                                                    </Typography>
                                                    <Chip
                                                        label={ticketDetails.priority}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${getPriorityColor(ticketDetails.priority)}20`,
                                                            color: getPriorityColor(ticketDetails.priority),
                                                            fontWeight: 600,
                                                            borderRadius: '9999px'
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Type
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
                                                        {ticketDetails.tktType || 'Not specified'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Assignee
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <PersonIcon fontSize="small" sx={{ color: '#6b7280' }} />
                                                        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
                                                            {ticketDetails.assignee}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Reporter
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <PersonIcon fontSize="small" sx={{ color: '#6b7280' }} />
                                                        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
                                                            {ticketDetails.reporter}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Due Date
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <ScheduleIcon fontSize="small" sx={{ color: '#6b7280' }} />
                                                        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
                                                            {formatDate(ticketDetails.dueDate)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        CCN
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
                                                        {ticketDetails.ccnName || 'Not specified'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Machinery
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
                                                        {ticketDetails.machineryName || 'Not specified'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Last Updated
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <RefreshIcon fontSize="small" sx={{ color: '#6b7280' }} />
                                                        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
                                                            {formatDateTime(ticketDetails.updatedAt || ticketDetails.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>

                                            {ticketDetails.tktTag && (
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Tag
                                                    </Typography>
                                                    <Chip
                                                        label={ticketDetails.tktTag}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#e5e7eb',
                                                            color: '#374151',
                                                            borderRadius: '0.375rem'
                                                        }}
                                                    />
                                                </Box>
                                            )}

                                            {ticketDetails.ticketImage && (
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                        Attached Image
                                                    </Typography>
                                                    <Paper sx={{
                                                        p: 1,
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        backgroundColor: '#f9fafb',
                                                        display: 'inline-block'
                                                    }}>
                                                        <img
                                                            src={ticketDetails.ticketImage}
                                                            alt="Ticket attachment"
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '200px',
                                                                objectFit: 'contain',
                                                                borderRadius: '0.375rem'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    </Paper>
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                               
                                    {activeTab === 1 && (
                                        <Box>
                                            <Box sx={{ mb: '2rem' }}>
                                                {ticketDetails.comments && ticketDetails.comments.length > 0 ? (
                                                    <Stack spacing={1}>
                                                        {ticketDetails.comments.map((comment) => (
                                                            <Paper
                                                                key={comment.id}
                                                                sx={{
                                                                    p: '1rem',
                                                                    backgroundColor: '#f9fafb',
                                                                    borderRadius: '0.5rem',
                                                                    border: '1px solid #e5e7eb'
                                                                }}
                                                            >
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '0.5rem' }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                                                                            {comment.author}
                                                                        </Typography>
                                                                        <Chip
                                                                            label={comment.type}
                                                                            size="small"
                                                                            sx={{
                                                                                fontSize: '0.75rem',
                                                                                height: '20px',
                                                                                backgroundColor: '#e5e7eb',
                                                                                color: '#6b7280'
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                                        {formatDateTime(comment.createdAt)}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography sx={{
                                                                    fontSize: '0.875rem',
                                                                    color: '#374151',
                                                                    lineHeight: 1.5
                                                                }}>
                                                                    {comment.text}
                                                                </Typography>
                                                            </Paper>
                                                        ))}
                                                    </Stack>
                                                ) : (
                                                    <Box sx={{
                                                        textAlign: 'center',
                                                        p: '2rem',
                                                        color: '#6b7280',
                                                        backgroundColor: '#f9fafb',
                                                        borderRadius: '0.5rem',
                                                        border: '1px dashed #d1d5db'
                                                    }}>
                                                        <ChatIcon sx={{ fontSize: 32, margin: '0 auto 0.5rem', display: 'block', color: '#9ca3af' }} />
                                                        <Typography>No comments yet. Start the conversation!</Typography>
                                                    </Box>
                                                )}
                                            </Box>

                                            <Box component="form" onSubmit={handleAddComment}>
                                                <Typography sx={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                    color: '#374151',
                                                    mb: '0.5rem'
                                                }}>
                                                    Add Comment
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Type your comment here..."
                                                    sx={{
                                                        mb: '1rem',
                                                        '& .MuiOutlinedInput-root': {
                                                            fontSize: '0.875rem'
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disabled={isSubmitting || !newComment.trim()}
                                                    startIcon={<SendIcon />}
                                                    sx={{
                                                        backgroundColor: '#2563eb',
                                                        textTransform: 'none',
                                                        fontSize: '0.875rem',
                                                        '&:hover': {
                                                            backgroundColor: '#1d4ed8'
                                                        }
                                                    }}
                                                >
                                                    {isSubmitting ? 'Adding...' : 'Add Comment'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Tab: Activity */}
                                    {activeTab === 2 && (
                                        <Box sx={{
                                            textAlign: 'center',
                                            p: '2rem',
                                            color: '#6b7280',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '0.5rem',
                                            border: '1px dashed #d1d5db'
                                        }}>
                                            <RefreshIcon sx={{ fontSize: 32, margin: '0 auto 0.5rem', display: 'block', color: '#9ca3af' }} />
                                            <Typography>Activity log will be displayed here</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{
                                width: { xs: '100%', md: '320px' },
                                borderLeft: { md: '1px solid #e5e7eb' },
                                borderTop: { xs: '1px solid #e5e7eb', md: 'none' },
                                backgroundColor: '#f9fafb',
                                m: 0,
                                p: '1.5rem'
                            }}>
                                <Typography sx={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#111827',
                                    mb: '1rem'
                                }}>
                                    Quick Actions
                                </Typography>

                                <Box sx={{ mb: '1rem' }}>
                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.75rem' }}>
                                        Update Status
                                    </Typography>
                                    <Stack spacing={1}>
                                        {statuses.map((status) => (
                                            <Button
                                                key={status.id}
                                                onClick={() => setTicketSt(status.value)}
                                                fullWidth
                                                sx={{
                                                    justifyContent: 'flex-start',
                                                    p: '0rem 0.75rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.375rem',
                                                    backgroundColor: ticketSt === status.value ? status.color : 'white',
                                                    color: ticketSt === status.value ? 'white' : status.color,
                                                    textTransform: 'none',
                                                    fontSize: '0.875rem',
                                                    fontWeight: ticketSt === status.value ? 700 : 500,
                                                    '&:hover': {
                                                        backgroundColor: ticketSt === status.value ? status.color : '#f3f4f6',
                                                        opacity: 0.9
                                                    }
                                                }}
                                            >
                                                {ticketSt === status.value && <CheckIcon sx={{ fontSize: 16, mr: 0.5 }} />}
                                                {status.displayName}
                                            </Button>
                                        ))}
                                    </Stack>
                                </Box>

                                <Box sx={{ mb: '1rem' }}>
                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.75rem' }}>
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
                                                backgroundColor: 'white'
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mb: '1rem' }}>
                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.75rem' }}>
                                        Attach Images for Resolution
                                    </Typography>

                                    <Box
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{
                                            border: '2px dashed #d1d5db',
                                            borderRadius: '0.5rem',
                                            p: '2rem',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: '#fafafa',
                                            '&:hover': {
                                                backgroundColor: '#f1f5f9',
                                                borderColor: '#9ca3af'
                                            },
                                            mb: '1rem'
                                        }}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleFileUpload}
                                        />
                                        <AttachFileIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
                                        <Typography sx={{ fontWeight: 500, color: '#6b7280' }}>
                                            Click to upload images
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                            Supports JPG, PNG, GIF up to 5MB
                                        </Typography>
                                    </Box>

                                    {attachments.length > 0 && (
                                        <Box>
                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', mb: '0.5rem' }}>
                                                Selected Files ({attachments.length})
                                            </Typography>
                                            <Stack spacing={1}>
                                                {attachments.map((file, index) => (
                                                    <Paper
                                                        key={index}
                                                        variant="outlined"
                                                        sx={{
                                                            p: '0.75rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            backgroundColor: '#f9fafb'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <AttachFileIcon fontSize="small" sx={{ color: '#6b7280' }} />
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                    {file.fileName}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                                    {(file.size / 1024).toFixed(2)} KB
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleRemoveAttachment(index)}
                                                            sx={{ color: '#ef4444' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Paper>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </Box>

                                {ticketDetails.resolveRemark && (
                                    <Card variant="outlined" sx={{ backgroundColor: '#f0fdf4' }}>
                                        <CardContent sx={{ p: '1rem', '&:last-child': { pb: '1rem' } }}>
                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#10b981', mb: '0.5rem' }}>
                                                Previous Resolution Remarks
                                            </Typography>
                                            <Paper sx={{ p: '0.75rem', backgroundColor: 'white' }}>
                                                <Typography variant="body2">
                                                    {ticketDetails.resolveRemark}
                                                </Typography>
                                            </Paper>
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>
                        </>
                    )}
                </Box>

                {/* <DialogActions sx={{
                    p: '1rem 1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    gap: '0.75rem',
                    m: 0
                }}>
                    <Button
                        onClick={updateTicketStatus}
                        variant="contained"
                        // disabled={updating || !resolveRemark.trim()}
                        sx={{
                            backgroundColor: '#2563eb',
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            '&:hover': {
                                backgroundColor: '#1d4ed8'
                            }
                        }}
                    >
                        {updating ? 'Updating...' : 'Update Status'}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{
                            borderColor: '#d1d5db',
                            color: '#374151',
                            textTransform: 'none',
                            fontSize: '0.875rem'
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            '&:hover': {
                                borderColor: '#dc2626',
                                backgroundColor: '#fef2f2'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions> */}
            </Dialog>
        </>
    );
};

export default TicketDetailsDialog;