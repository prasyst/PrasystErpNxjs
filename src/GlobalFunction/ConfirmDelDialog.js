import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

const ConfirmDelDialog = ({ open, title, description, onConfirm, onCancel, loading = false }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title || "Confirm"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {description || "Are you sure you want to proceed?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="small"
          sx={{
            backgroundColor: "#008000",
            color: "white",
            "&:hover": { backgroundColor: "#008000", color: "white" },
          }}
          onClick={onConfirm}
          disabled={loading}
        >
          Yes
        </Button>
        <Button size="small"
          sx={{
            backgroundColor: "#FF0000",
            color: "white",
            "&:hover": { backgroundColor: "#FF0000", color: "white" },
          }}
          onClick={onCancel}
          disabled={loading}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelDialog;
