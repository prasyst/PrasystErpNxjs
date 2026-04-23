'use client';

import { useState, useEffect } from 'react';
import { Snackbar, Button, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

const PWAUpdatePrompt = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdatePrompt(true);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShowUpdatePrompt(true);
            }
          });
        });
      });

      // Listen for controller change
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  };

  const handleClose = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) return null;

  return (
    <Snackbar
      open={showUpdatePrompt}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={null}
    >
      <Alert
        severity="info"
        variant="filled"
        sx={{ width: '100%', alignItems: 'center' }}
        action={
          <Button color="inherit" size="small" onClick={handleUpdate}>
            Update
          </Button>
        }
        onClose={handleClose}
      >
        New version available! Click Update to get latest features.
      </Alert>
    </Snackbar>
  );
};

export default PWAUpdatePrompt;