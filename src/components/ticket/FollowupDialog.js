'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Add as AddIcon, 
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Image as ImageIcon 
} from '@mui/icons-material';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';

const FollowupDialog = ({ 
  open, 
  onClose, 
  ticket,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    FlwDt: '',
    ToDo: '',
    Remark: '',
    TktImage: '',
    ImgName: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const USER_ID = localStorage.getItem("USER_ID");
  const EMP_KEY = localStorage.getItem("EMP_KEY");

  React.useEffect(() => {
    if (ticket) {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        FlwDt: today,
        ToDo: '',
        Remark: '',
        TktImage: '',
        ImgName: ''
      });
      setSelectedFile(null);
    }
  }, [ticket]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.");
      return;
    }

    setSelectedFile(file);
    setIsUploadingImage(true);

    try {
      const base64String = await convertToBase64(file);
     
      const base64Data = base64String.split(',')[1];
      
      setFormData(prev => ({
        ...prev,
        TktImage: base64Data, 
        ImgName: file.name
      }));
      
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error converting image to base64:", error);
      toast.error("Failed to process image. Please try again.");
      setSelectedFile(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setFormData(prev => ({
      ...prev,
      TktImage: '',
      ImgName: ''
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (!ticket) return;

    if (!formData.FlwDt) {
      toast.error("Follow-up date is required");
      return;
    }

    if (!formData.ToDo.trim()) {
      toast.error("To-Do description is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        FlwDt: formData.FlwDt,
        TktKey: ticket.TKTKEY,
        ToDo: formData.ToDo,
        Remark: formData.Remark || "",
        FlwBy: USER_ID, 
        CREATED_BY: 1, 
        TktImage:  "",
        ImgName: ""
      };

      const response = await axiosInstance.post(
        "TrnTktFlw/InsertTrnTktFlw?UserName=PC0001&strCobrid=02",
        payload,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.STATUS === 0) {
        toast.success("Follow-up added successfully!");
        setFormData({
          FlwDt: new Date().toISOString().split('T')[0],
          ToDo: '',
          Remark: '',
          TktImage: '',
          ImgName: ''
        });
        setSelectedFile(null);

        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.data.MESSAGE || "Failed to add follow-up");
      }
    } catch (error) {
      console.error("Error adding follow-up:", error);
      toast.error("Failed to add follow-up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <AttachFileIcon color="primary" />
            <Typography variant="h6" fontWeight="600">
              Add Follow-up
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            size="small"
            disabled={isSubmitting}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {ticket && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Ticket: <strong>{ticket.id}</strong> • {ticket.title}
          </Typography>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ py: 0 }}>
        <Box >

          <TextField
            fullWidth
            name="ToDo"
            label="To-Do Description"
            value={formData.ToDo}
            onChange={handleInputChange}
            margin="normal"
            size="medium"
            multiline
            rows={3}
            placeholder="Describe what needs to be done..."
            disabled={isSubmitting}
            required
            InputProps={{
              sx: { borderRadius: 1.5 }
            }}
          />

          <TextField
            fullWidth
            name="Remark"
            label="Remarks"
            value={formData.Remark}
            onChange={handleInputChange}
            margin="normal"
            size="medium"
            multiline
            rows={2}
            placeholder="Additional notes or comments..."
            disabled={isSubmitting}
            InputProps={{
              sx: { borderRadius: 1.5 }
            }}
          />
          {/* <Box sx={{ mt: 1, mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="500" gutterBottom>
              Attach Image (Optional)
            </Typography>
            
            {selectedFile ? (
              <Box sx={{ 
                p: 2, 
                border: '1px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                bgcolor: 'primary.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2
              }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <ImageIcon color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight="500">
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1].toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={removeImage}
                  disabled={isSubmitting}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="followup-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                  disabled={isSubmitting || isUploadingImage}
                />
                <label htmlFor="followup-image-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    size="medium"
                    startIcon={isUploadingImage ? <CircularProgress size={20} /> : <AddIcon />}
                    disabled={isSubmitting || isUploadingImage}
                    fullWidth
                    sx={{
                      borderRadius: 1.5,
                      py: 1.5,
                      borderStyle: 'dashed',
                      '&:hover': {
                        borderStyle: 'dashed',
                      }
                    }}
                  >
                    {isUploadingImage ? 'Uploading Image...' : 'Upload Image'}
                  </Button>
                </label>
              </>
            )}
            
            {isUploadingImage && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Converting image to base64...
                </Typography>
                <CircularProgress size={16} sx={{ ml: 1 }} />
              </Box>
            )}
            
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Max file size: 5MB • Supported formats: JPG, PNG, GIF, WebP
            </Typography>
          </Box> */}

          {formData.TktImage && !isUploadingImage && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight="500" gutterBottom>
                Image Preview
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  maxHeight: 200,
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50'
                }}
              >
                <img
                  src={`data:image/${selectedFile?.type?.split('/')[1] || 'jpeg'};base64,${formData.TktImage}`}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Base64 string length: {formData.TktImage.length} characters
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
          variant="outlined"
          sx={{ 
            borderRadius: 1.5,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isSubmitting || isUploadingImage}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{ 
            borderRadius: 1.5,
            px: 3,
            '&:disabled': {
              bgcolor: 'action.disabled',
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowupDialog;