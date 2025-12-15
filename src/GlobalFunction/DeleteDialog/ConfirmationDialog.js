import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{
                        backgroundColor: "#635bff",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#463df5ff",
                            color: "white",
                        },
                    }}
                    onClick={onConfirm}
                >
                    {confirmText || 'Yes'}
                </Button>
                <Button
                    sx={{
                        backgroundColor: "#635bff",
                        color: "white",
                        "&:hover": {
                            backgroundColor: "#463df5ff",
                            color: "white",
                        },
                    }}
                    onClick={onClose}
                >
                    {cancelText || 'No'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
