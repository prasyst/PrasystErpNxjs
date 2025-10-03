import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Grid,
    Box,
    Typography,
    TextField,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';

export const ImagePopup = ({ open, onClose }) => {

    const [xyz, setXyz] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [imageName, setImageName] = useState('');
    const [rows, setRows] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setImageName(file.name); // ✅ Image name set from file
        }
    };

    const handleAdd = () => {
        if (xyz && image && imageName) {
            setRows(prev => [...prev, { xyz, image: preview, name: imageName }]);
            setXyz('');
            setImage(null);
            setPreview('');
            setImageName('');
        }
    };

    const handleClearInputs = () => {
        setXyz('');
        setImage(null);
        setPreview('');
        setImageName('');
    };

    const handleDeleteRow = (index) => {
        setRows(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteAll = () => {
        setRows([]);
    };

    const handleSave = () => {
        console.log('Saved entries:', rows);
        // Add your save logic here
    };

    const doubleInputSx = {
        '& .MuiInputBase-root': {
            height: 76,
            fontSize: '14px',
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            top: '-8px',
        },
        '& .MuiFilledInput-root': {
            backgroundColor: '#fafafa',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            overflow: 'hidden',
            height: 76,
            fontSize: '14px',
        },
        '& .MuiFilledInput-root:before': {
            display: 'none',
        },
        '& .MuiFilledInput-root:after': {
            display: 'none',
        },
        '& .MuiInputBase-input': {
            padding: '10px 12px !important',
            fontSize: '14px !important',
            lineHeight: '1.4',
        },
        '& .MuiFilledInput-root.Mui-disabled': {
            backgroundColor: '#fff'
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="md"
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 3,
                    p: { xs: 2, sm: 3 },
                    m: { xs: 2, sm: 4 },
                    boxShadow: 6,
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">
                Add Your Entries
            </DialogTitle>

            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Box
                        sx={{
                            maxHeight: { xs: "60vh", sm: "70vh" },
                            overflowY: "auto",
                        }}
                    >
                        {/* Labels */}
                        <Grid container spacing={2} mb={2}>
                            {["DocType", "Doc No", "Doc", "DocImg No"].map((label, idx) => (
                                <Grid key={idx} size={{ xs: 6, sm: 3 }}>
                                    <Typography sx={{ fontSize: '15px', fontWeight: 700 }}>{label}</Typography>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Upload / Inputs */}
                        <Grid container spacing={2} alignItems="flex-start">
                            {/* Image Preview */}
                            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                                <Box
                                    border="1px solid #ccc"
                                    borderRadius={2}
                                    width="100%"
                                    height={140}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    overflow="hidden"
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <Typography variant="caption">No Image</Typography>
                                    )}
                                </Box>
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="upload-button"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />
                            </Grid>

                            {/* TextField + Buttons */}
                            <Grid size={{ xs: 12, sm: 8, md: 6 }}>
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={xyz}
                                    onChange={(e) => setXyz(e.target.value)}
                                    sx={doubleInputSx}
                                    inputProps={{
                                        style: {
                                            padding: '6px 8px',
                                            fontSize: '13px'
                                        },
                                    }}
                                />

                                <Box display="flex" sx={{ mt: 2 }} gap={2} flexWrap="wrap">
                                    <label htmlFor="upload-button">
                                        <Button
                                            component="span"
                                            variant="contained"
                                            startIcon={<UploadIcon />}
                                        >
                                            Upload
                                        </Button>
                                    </label>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteForeverIcon />}
                                        onClick={handleClearInputs}
                                    >
                                        Clear
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Add Button & Counter */}
                            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={handleAdd}
                                        fullWidth
                                        sx={{
                                            width: '100px'
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <Typography fontWeight={500}>
                                        Row Count: {rows.length}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Table */}
                        <Box mt={4}>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>ImageName</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    No entries added yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            rows.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <img
                                                            src={row.image}
                                                            alt="Uploaded"
                                                            width={60}
                                                            height={60}
                                                            style={{ objectFit: "cover", borderRadius: 4 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell>{row.xyz}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleDeleteRow(index)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </DialogContentText>
            </DialogContent>

            {/* Footer Buttons */}
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={rows.length === 0}
                >
                    Save
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteAll}
                    disabled={rows.length === 0}
                >
                    Delete All
                </Button>
                <Button variant="outlined" onClick={onClose}>
                    Exit
                </Button>
            </DialogActions>
        </Dialog>
    );
};