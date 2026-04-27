import React, { useState, useEffect } from 'react';
import {
    Box, Grid, TextField, Button
} from '@mui/material';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';

const SendMail = ({ ticketTitle = "", ticketNo = "", ticketDescription = "", ticketImage = "", ticketImageName = "", onClose }) => {
    const [toEmail, setToEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [cobrId, setCobrId] = useState(localStorage.getItem('COBR_ID'));
    const [userId, setUserId] = useState(localStorage.getItem("USER_ID"));

    useEffect(() => {
        // You can add any default values here if needed
    }, [ticketTitle, ticketDescription, ticketImage]);

    const handleSend = async () => {
        if (!toEmail.trim()) {
            toast.error("Please enter a recipient email.");
            return;
        }

        setIsSending(true);

        try {
            let docAttachments = [];

            if (ticketImage && ticketImage.startsWith('data:image')) {
                const base64Data = ticketImage.split(',')[1]; // Remove data URL prefix

                docAttachments = [{
                    FileName: ticketImageName || "ticket_attachment.jpg",
                    FileData: base64Data,
                    FileType: ticketImageName?.toLowerCase().endsWith('.png') ? "image/png" : "image/jpeg"
                }];
            }

            const response = await axiosInstance.post('Email/SendEmail', {
                TASK_ID: 0,
                COBR_ID: cobrId || "02",
                USER_ID: userId || 1,
                PARTY_KEY: "",
                ToEmail: [toEmail.trim()],
                Subject: `Ticket #${ticketNo}- Help Desk - ${ticketTitle}`,
                ImgFolderNm: "",
                Body: ticketDescription
                    ? ticketDescription.replace(/\n/g, '<br>')
                    : "No description provided.",
                DocAttachments: docAttachments
            });

            if (response.data.STATUS === 0) {
                toast.success("Email sent successfully!");
                if (onClose) onClose();
            } else {
                toast.error(response.data.MESSAGE || "Failed to send email");
            }
        } catch (err) {
            toast.error("Failed to send email. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const handleClear = () => {
        setToEmail('');
        onClose();
    };

    return (
        <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        label={<span>To Email<span style={{ color: 'red' }}>*</span></span>}
                        value={toEmail}
                        onChange={(e) => setToEmail(e.target.value)}
                        fullWidth
                        type="email"
                        placeholder="Enter multiple recipient email seperated by comma"
                        autoFocus
                    />
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                            size='small'
                            variant="outlined"
                            color="error"
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                        <Button
                            size='small'
                            variant="contained"
                            color="primary"
                            onClick={handleSend}
                            startIcon={<SendIcon />}
                            disabled={isSending || !toEmail.trim()}
                        >
                            {isSending ? "Sending..." : "Send"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SendMail;