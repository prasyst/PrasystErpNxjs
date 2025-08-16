'use client'
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import { useRouter } from "next/navigation";
import axiosInstance from '@/lib/axios';

const CoBrModal = ({ open, onClose }) => {
    const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [error, setError] = useState('');

  // Fetch companies when modal opens
  useEffect(() => {
    if (open) {
      axiosInstance.post('COMPANY/Getdrpcofill', {
        
        params: {
          CO_ID: "",
          Flag: ""
        }
      })
        .then(res => {
          if (res.data?.STATUS === 0 && Array.isArray(res.data.DATA)) {
            const formattedCompanies = res.data.DATA.map(c => ({
              label: c.CO_NAME,
              value: c.CO_ID,
            }));
            setCompanies(formattedCompanies);
            // Set the first company as the selected company
          if (formattedCompanies.length > 0) {
            setSelectedCompany(formattedCompanies[0].value);
          }
          } else {
            setError('Failed to fetch companies.');
          }
        })
        .catch(err => {
          console.error('Error fetching companies:', err);
          setError('Error fetching companies.');
        });
    }
  }, [open]);

  // Fetch branches when company changes
  useEffect(() => {
    if (selectedCompany) {
      axiosInstance.post('COMPANY/Getdrpcobrfill', {
        COBR_ID: "",
        CO_ID: selectedCompany,
        Flag: ""
      })
        .then(res => {
          if (res.data?.STATUS === 0 && Array.isArray(res.data.DATA)) {
            const filteredBranches = res.data.DATA.filter(b => b.CO_ID === selectedCompany);
            const formattedBranches = filteredBranches.map(b => ({
              label: b.COBR_NAME,
              value: b.COBR_ID,
            }));
            setBranches(formattedBranches);
             // Set the first branch as the selected branch
             if (formattedBranches.length > 0) {
              setSelectedBranch(formattedBranches[0].value);
            }
          } else {
            console.error('Failed to fetch branches.');
          }
        })
        .catch(err => {
          console.error('Error fetching branches:', err);
         
        });
    } else {
      setBranches([]);
    }
  }, [selectedCompany]);

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setSelectedBranch('');
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleDoneClick = () => {
    if (selectedCompany && selectedBranch) {
      localStorage.setItem('CO_ID', selectedCompany);
       localStorage.setItem('COBR_ID', selectedBranch);
      onClose();
      router.push('/dashboard');
    }
  };

  const handleExitClick = () => { 
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('CO_ID');
    localStorage.removeItem('COBR_ID');
    localStorage.removeItem('PARTY_NAME');
    localStorage.removeItem('PARTY_KEY');
    localStorage.removeItem('FCYR_KEY');
    onClose();
    setSelectedCompany('');
    setSelectedBranch('');
    setError('');
  };

  const isDoneDisabled = !(selectedCompany && selectedBranch);

  return (
    <Modal
      open={open}
      onClose={handleExitClick}
      aria-labelledby="company-branch-modal-title"
      sx={{
        // backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          width: { xs: '70%', sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography id="company-branch-modal-title" variant="h6" textAlign="center">
          Select Company and Branch
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
        )}

        <TextField
          select
          label="Company"
          value={selectedCompany}
          onChange={handleCompanyChange}
          fullWidth
          size="small"
        >
          {companies.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Branch"
          value={selectedBranch}
          onChange={handleBranchChange}
          fullWidth
          size="small"
          disabled={!selectedCompany}
        >
          {branches.map((b) => (
            <MenuItem key={b.value} value={b.value}>
              {b.label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
          <Button
            variant="contained"
            onClick={handleDoneClick}
            disabled={isDoneDisabled}
            sx={{ flex: 1 }}
          >
            Done
          </Button>
          <Button
            variant="outlined"
            onClick={handleExitClick}
            sx={{ flex: 1 }}
          >
            Exit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CoBrModal;
