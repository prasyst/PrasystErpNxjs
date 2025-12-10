// ZoomDialog.js

import React from 'react';
import { Dialog, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ZoomDialog = ({ zoomOpen, setZoomOpen, zoomSrc }) => {
  return (
    <Dialog
      open={zoomOpen}
      onClose={() => setZoomOpen(false)}
      maxWidth="md"
      fullWidth
      BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.95)' } }}
      PaperProps={{
        sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden', m: 2 },
      }}
    >
      <IconButton
        onClick={() => setZoomOpen(false)}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(255,255,255,0.9)',
          color: 'black',
          '&:hover': { bgcolor: '#fff' },
          zIndex: 10,
          boxShadow: 3,
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90vh',
          cursor: 'zoom-out',
        }}
        onClick={() => setZoomOpen(false)}
      >
        <Box
          component="img"
          src={zoomSrc}
          alt="Zoomed"
          sx={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            borderRadius: 2,
            boxShadow: 10,
            userSelect: 'none',
          }}
        />
      </Box>
      
    </Dialog>
  );
};

export default ZoomDialog;
