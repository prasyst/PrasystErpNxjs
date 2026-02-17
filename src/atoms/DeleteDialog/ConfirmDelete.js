import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';

const ConfirmDelete = ({ open, onClose, onConfirm }) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>Are You Sure you want to delete?</DialogTitle>
            <DialogContent>
                <Button color='success' onClick={handleConfirm}>Yes</Button>
                <Button color='error' onClick={handleCancel}>No</Button>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDelete;
