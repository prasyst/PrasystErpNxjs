'use client';
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography
} from '@mui/material';

export default function ColumnVisibilityModal({ open, onClose, columns, visibleColumns, onColumnToggle }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Show/Hide Columns
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {columns.map((column) => (
            <FormControlLabel
              key={column.field}
              control={
                <Checkbox
                  checked={visibleColumns.includes(column.field)}
                  onChange={() => onColumnToggle(column.field)}
                />
              }
              label={column.headerName}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}