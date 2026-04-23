'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Slide,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';

const PWAPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
    
    // Check if app is already installed (standalone mode)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                                window.navigator.standalone === true;
    setIsStandalone(isInStandaloneMode);

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Don't show immediately, wait a bit
      setTimeout(() => {
        if (!isInStandaloneMode) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleClose = () => {
    setShowInstallPrompt(false);
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // iOS specific instructions
  if (isIOS && !isStandalone) {
    return (
      <Dialog
        open={showInstallPrompt}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 320,
            margin: 2
          }
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Install App
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={1}>
            <InstallMobileIcon sx={{ fontSize: 60, color: '#3A7BD5', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              To install this app on your iOS device:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5', textAlign: 'left' }}>
              <Typography variant="body2" gutterBottom>
                1. Tap the <strong>Share</strong> button
              </Typography>
              <Typography variant="body2" gutterBottom>
                2. Scroll down and tap <strong>Add to Home Screen</strong>
              </Typography>
              <Typography variant="body2">
                3. Tap <strong>Add</strong> in the top right corner
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="primary">
            Maybe Later
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Android/Chrome install prompt
  return (
    <Dialog
      open={showInstallPrompt}
      onClose={handleClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxWidth: 350,
          textAlign: 'center'
        }
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: 2,
              bgcolor: '#3A7BD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <GetAppIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Install PRASYST App
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Get a better experience with our app. Install it on your device for quick access.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Not Now
        </Button>
        <Button 
          onClick={handleInstallClick} 
          variant="contained" 
          color="primary"
          startIcon={<AddToHomeScreenIcon />}
        >
          Install App
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PWAPrompt;