// import React, { useState, useEffect } from 'react';
// import {
//     Box, Grid, TextField, Button
// } from '@mui/material';
// import axiosInstance from '@/lib/axios';
// import { toast } from 'react-toastify';
// import SendIcon from '@mui/icons-material/Send';

// const SendMail = ({ ticketTitle = "", ticketNo = "", ticketDescription = "", ticketImage = "", ticketImageName = "", ticketCat = "",
//     ticketSubCat = "", ticketService = "", deptGrp = "", dept = "", onClose }) => {
//     const [toEmail, setToEmail] = useState('');
//     const [isSending, setIsSending] = useState(false);
//     const [cobrId, setCobrId] = useState(localStorage.getItem('COBR_ID'));
//     const [userId, setUserId] = useState(localStorage.getItem("USER_ID"));

//     useEffect(() => {
//         // You can add any default values here if needed
//     }, [ticketTitle, ticketDescription, ticketImage]);

//     const handleSend = async () => {
//         if (!toEmail.trim()) {
//             toast.error("Please enter a recipient email.");
//             return;
//         }

//         setIsSending(true);

//         try {
//             let docAttachments = [];

//             if (ticketImage && ticketImage.startsWith('data:image')) {
//                 const base64Data = ticketImage.split(',')[1]; // Remove data URL prefix

//                 docAttachments = [{
//                     FileName: ticketImageName || "ticket_attachment.jpg",
//                     FileData: base64Data,
//                     FileType: ticketImageName?.toLowerCase().endsWith('.png') ? "image/png" : "image/jpeg"
//                 }];
//             }

//             const response = await axiosInstance.post('Email/SendEmail', {
//                 TASK_ID: 0,
//                 COBR_ID: cobrId || "02",
//                 USER_ID: userId || 1,
//                 PARTY_KEY: "",
//                 ToEmail: [toEmail.trim()],
//                 Subject: `Ticket #${ticketNo}- Help Desk - ${ticketTitle}`,
//                 ImgFolderNm: "",
//                 Body: ticketDescription
//                     ? ticketDescription.replace(/\n/g, '<br>')
//                     : "No description provided.",
//                 DocAttachments: docAttachments
//             });

//             if (response.data.STATUS === 0) {
//                 toast.success("Email sent successfully!");
//                 if (onClose) onClose();
//             } else {
//                 toast.error(response.data.MESSAGE || "Failed to send email");
//             }
//         } catch (err) {
//             toast.error("Failed to send email. Please try again.");
//         } finally {
//             setIsSending(false);
//         }
//     };

//     const handleClear = () => {
//         setToEmail('');
//         onClose();
//     };

//     return (
//         <Box sx={{ pt: 2 }}>
//             <Grid container spacing={2}>
//                 <Grid size={{ xs: 12 }}>
//                     <TextField
//                         label={<span>To Email<span style={{ color: 'red' }}>*</span></span>}
//                         value={toEmail}
//                         onChange={(e) => setToEmail(e.target.value)}
//                         fullWidth
//                         type="email"
//                         placeholder="Enter multiple recipient email seperated by comma"
//                         autoFocus
//                     />
//                 </Grid>

//                 <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
//                         <Button
//                             size='small'
//                             variant="outlined"
//                             color="error"
//                             onClick={handleClear}
//                         >
//                             Clear
//                         </Button>
//                         <Button
//                             size='small'
//                             variant="contained"
//                             color="primary"
//                             onClick={handleSend}
//                             startIcon={<SendIcon />}
//                             disabled={isSending || !toEmail.trim()}
//                         >
//                             {isSending ? "Sending..." : "Send"}
//                         </Button>
//                     </Box>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default SendMail;


import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button } from '@mui/material';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';

const SendMail = ({
    ticketTitle = "",
    ticketNo = "",
    ticketDescription = "",
    ticketImage = "",
    ticketImageName = "",
    ticketCat = "",
    ticketSubCat = "",
    ticketService = "",
    deptGrp = "",
    dept = "",
    raiseBy = "",
    onClose
}) => {

    const [toEmail, setToEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [cobrId] = useState(localStorage.getItem('COBR_ID'));
    const [userId] = useState(localStorage.getItem("USER_ID"));
    console.log(ticketImage)

    const handleSend = async () => {
        if (!toEmail.trim()) {
            toast.error("Please enter a recipient email.");
            return;
        }

        setIsSending(true);

        try {
            let docAttachments = [];
            if (ticketImage && ticketImage.startsWith('data:image')) {
                const base64Data = ticketImage.split(',')[1];
                docAttachments = [{
                    FileName: ticketImageName || "ticket_attachment.jpg",
                    FileData: base64Data,
                    FileType: ticketImageName?.toLowerCase().endsWith('.png') ? "image/png" : "image/jpeg"
                }];
            }

            const emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #1976d2; text-align: center; border-bottom: 3px solid #1976d2; padding-bottom: 10px;">
                        Help Desk Ticket
                    </h2>
                    
                    <div style="margin: 20px 0;">
                        <strong style="color: #333;">Ticket Number:</strong> 
                        <span style="color: #d32f2f; font-size: 16px;">#${ticketNo || 'N/A'}</span><br>
                        <strong style="color: #333;">Raised By:</strong> 
                        <span style="color: #1976d2; font-size: 16px;">${raiseBy || 'N/A'}</span>
                    </div>

                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <h3 style="margin: 0 0 12px 0; color: #1976d2;">${ticketTitle || 'Untitled Ticket'}</h3>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 6px 0; width: 140px; font-weight: bold; color: #555;">Category</td><td>${ticketCat || 'N/A'}</td></tr>
                            <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Sub Category</td><td>${ticketSubCat || 'N/A'}</td></tr>
                            <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Service</td><td>${ticketService || 'N/A'}</td></tr>
                            <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Department Group</td><td>${deptGrp || 'N/A'}</td></tr>
                            <tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Department</td><td>${dept || 'N/A'}</td></tr>
                        </table>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <strong style="color: #333;">Description:</strong><br><br>
                        <div style="background: #fff; padding: 15px; border: 1px solid #eee; border-radius: 6px; line-height: 1.6;">
                            ${ticketDescription ? ticketDescription.replace(/\n/g, '<br>') : '<em>No description provided.</em>'}
                        </div>
                    </div>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                    <p style="color: #666; font-size: 13px; text-align: center;">
                        This email was sent from the Help Desk System.
                    </p>
                </div>
            `;

            const response = await axiosInstance.post('Email/SendEmail', {
                TASK_ID: 0,
                COBR_ID: cobrId || "02",
                USER_ID: userId || 1,
                PARTY_KEY: "",
                ToEmail: [toEmail.trim()],
                Subject: `Ticket #${ticketNo} - Help Desk - ${ticketTitle}`,
                ImgFolderNm: "",
                Body: emailBody,
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
        if (onClose) onClose();
    };

    return (
        <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        label={<span>To Email <span style={{ color: 'red' }}>*</span></span>}
                        value={toEmail}
                        onChange={(e) => setToEmail(e.target.value)}
                        fullWidth
                        type="email"
                        placeholder="Enter multiple recipients email separated by comma"
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