import React from 'react';
import { MdWork } from 'react-icons/md';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const TicketStatus = () => {
  const router = useRouter();
  const statusWorkflow = [
    { from: 'Open', to: 'In Progress', action: 'Start Working' },
    { from: 'In Progress', to: 'Resolved', action: 'Mark Resolved' },
    { from: 'Resolved', to: 'Closed', action: 'Close Ticket' },
    { from: 'Resolved', to: 'Reopened', action: 'Reopen Ticket' },
    { from: 'Reopened', to: 'In Progress', action: 'Resume Working' }
  ];

  return (
    <Box sx={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '1.5rem',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      <Typography
        sx={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          margin: '0 0 1.5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MdWork color="#7c3aed" />
          Status Workflow Management
        </Box>
        <IconButton onClick={() => router.push('/dashboard')}>
          <ArrowBackIcon color='secondary' />
        </IconButton>
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {statusWorkflow.map((transition, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}
          >
            <Box sx={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              borderRadius: '0.375rem',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}>
              {transition.from}
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              <span>→</span>
              <span>{transition.action}</span>
              <span>→</span>
            </Box>
            <Box sx={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              borderRadius: '0.375rem',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}>
              {transition.to}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TicketStatus;