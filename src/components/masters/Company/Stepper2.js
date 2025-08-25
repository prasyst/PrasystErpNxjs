'use client';
import React, { useState } from "react";
import {
  Box, TextField,
  Grid,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const initialFormState = {
  SmallName: "",
  BigName: "",
  PrintName: "",
  Jurisdiction: "",
  Address: "",
  Place: "",
  Fax: "",
  VAT: "",
  LBT: "",
  WorkAddr: "",
  OwnerMobile: "",
  Abrv: "",
  Image: "",
  Tel: "",
  Email: "",
  ExciseCd: "",
  ExciseRng: "",
  CoDivision: "",
  BankDetails: "",
  GSTINNo: "",
  Active: false
};

const StepperMst2 = ({ TableData, IsButtonSubmit, UserLoginId, TextDisabledFast }) => {
  const [form, setForm] = useState(initialFormState);
  const [AllTextDisabled, setAllTextDisabled] = useState(false);
  const [AllButtonDisabled, setAllButtonDisabled] = useState(true);
  const [AddDisabled, setAddDisabled] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const columns = [
    { id: 'CobrAbrv', label: 'Short Name', minWidth: 100, align: 'left' },
    { id: 'CobrName', label: 'Branch Name', minWidth: 150, align: 'left' },
    { id: 'City', label: 'City', minWidth: 100, align: 'left' },
  ];

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
    setAllButtonDisabled(false);
  };

  const handleClickAdd = () => {
    setForm(initialFormState);
    setAddDisabled(true);
    setAllTextDisabled(false);
    setSelectedRowIndex(null);
  };

  const handleClickEdit = () => {
    if (selectedRowIndex !== null) {
      const selectedData = TableData[selectedRowIndex];
      setForm({ ...initialFormState, ...selectedData });
      setAllTextDisabled(false);
    }
  };

  const handleDelete = () => {
    if (selectedRowIndex !== null) {
      const selectedData = TableData[selectedRowIndex];
      console.log("Delete clicked for row:", selectedData);
      // TODO: Add delete logic
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleConfirm =()=>{}
  const handleCancel=()=>{}

  const textFieldSx = {
    "& .MuiInputBase-root": {
      paddingTop: "2px",
      paddingBottom: "2px",
      fontSize: "0.75rem",
    },
    "& .MuiOutlinedInput-input": {
      padding: "4px 8px",
    },
  };

  const labelWidth = 100;
  const inputWidth = 300;

  return (
    <>    
      {/* Table Section */}
    <Box sx={{  width: "100%",
      maxWidth: 900,  
      margin: "0 auto",
      mt: 3,            
      px: 2,          
      display: "flex",
      flexDirection: "column",
      alignItems: "center",}}>

       <Paper sx={{ width: "75%", maxWidth: "800px", overflow: "hidden", border: "1px solid lightgray" }}>

          <TableContainer sx={{ maxHeight: 1000 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ "& > th": { padding: "2px 10px" } }}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                      <Typography variant="subtitle1" fontWeight="bold">{column.label}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {TableData?.map((row, index) => (
                  <TableRow
                    hover
                    key={index}
                    selected={index === selectedRowIndex}
                    sx={{ "& > td": { padding: "2px 14px" }, cursor: "pointer" }}
                    onClick={() => handleRowClick(index)}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {row[column.id] || "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Action Buttons */}
      <Grid item xs={12} sx={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
        <Box sx={{ marginLeft: "17%" }}>
          <Button variant="contained" size="small" sx={{ backgroundColor: "#39ace2" }} onClick={handleClickAdd} disabled={(AllButtonDisabled && AddDisabled) || IsButtonSubmit}><AddIcon /></Button>
          <Button variant="contained" size="small" sx={{ backgroundColor: "#39ace2", margin: "0px 10px" }} onClick={handleClickEdit} disabled={AllButtonDisabled || IsButtonSubmit}><EditIcon /></Button>
          <Button variant="contained" size="small" sx={{ backgroundColor: "#39ace2" }} onClick={handleDelete} disabled={AllButtonDisabled || IsButtonSubmit}><DeleteIcon /></Button>
        </Box>
      </Grid>

      {/* Form Section */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 6, marginTop: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Left Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[
            {
              label: "Name",
              custom: (
                <>
                  <TextField
                    size="small"
                    name="SmallName"
                    value={form.SmallName}
                    onChange={handleInputChange}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{ width: 40, ...textFieldSx }}
                  />
                  <TextField
                    size="small"
                    name="BigName"
                    value={form.BigName}
                    onChange={handleInputChange}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{ width: 252, ...textFieldSx }}
                  />
                </>
              ),
            },
            "PrintName",
            "Jurisdiction",
            "Address",
            "Place",
            "Fax",
            "VAT",
            "LBT",
            "WorkAddr",
            "OwnerMobile"
          ].map((fieldOrObj) => {
            const label = typeof fieldOrObj === 'string' ? fieldOrObj.replace(/([A-Z])/g, ' $1') : fieldOrObj.label;
            const field = typeof fieldOrObj === 'string' ? fieldOrObj : null;
            const custom = typeof fieldOrObj === 'object' ? fieldOrObj.custom : null;

            return (
              <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 320 }}>
                <Typography sx={{ width: labelWidth, textAlign: "left" }}>{label}:</Typography> {/* <-- Left aligned text here */}
                {custom || (
                  <TextField
                    size="small"
                    name={field}
                    value={form[field]}
                    onChange={handleInputChange}
                    disabled={AllTextDisabled || TextDisabledFast}
                    multiline={field === "Address"}
                    rows={field === "Address" ? 1 : undefined}
                    sx={{ width: inputWidth, ...textFieldSx }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[
            {
              label: "Abrv",
              custom: (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 320 }}>
                  <TextField
                    size="small"
                    name="Abrv"
                    value={form.Abrv}
                    onChange={handleInputChange}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{ width: 150, ...textFieldSx }}
                  />
                  <Button variant="text" size="small" onClick={() => setForm(prev => ({ ...prev, Image: "" }))}>
                    Clear Image
                  </Button>
                </Box>
              )
            },
            {
              label: "Image & Tel",
              custom: (
                <Box sx={{ display: "flex", flexDirection: 'row', gap: 1, alignItems: "center" }}>
                  <Box sx={{ width: 80, height: 60, border: "1px solid gray", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9f9f9" }}>
                    <Typography variant="caption" color="textSecondary">Image</Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: 'column', gap: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                      <Typography sx={{ width: 30 }}>Tel:</Typography>
                      <TextField
                        size="small"
                        name="Tel"
                        value={form.Tel}
                        onChange={handleInputChange}
                        disabled={AllTextDisabled || TextDisabledFast}
                        sx={{ width: 180, ...textFieldSx }}
                      />
                    </Box>
                    <Button variant="text" size="small">Browse...</Button>
                  </Box>
                </Box>
              )
            },
            "Email", "ExciseCd", "ExciseRng", "CoDivision", "BankDetails", "GSTINNo",
            {
              label: "Active",
              custom: (
                <input
                  type="checkbox"
                  name="Active"
                  checked={form.Active}
                  onChange={handleInputChange}
                  disabled={AllTextDisabled || TextDisabledFast}
                />
              )
            }
          ].map((fieldOrObj) => {
            const label = typeof fieldOrObj === 'string' ? fieldOrObj.replace(/([A-Z])/g, ' $1') : fieldOrObj.label;
            const field = typeof fieldOrObj === 'string' ? fieldOrObj : null;
            const custom = typeof fieldOrObj === 'object' ? fieldOrObj.custom : null;

            return (
              <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 320 }}>
                <Typography sx={{ width: labelWidth, textAlign: "left" }}>{label}:</Typography>
                {custom || (
                  <TextField
                    size="small"
                    name={field}
                    value={form[field]}
                    onChange={handleInputChange}
                    disabled={AllTextDisabled || TextDisabledFast}
                    multiline={field === "BankDetails"}
                    rows={field === "BankDetails" ? 1 : undefined}
                    sx={{ width: inputWidth, ...textFieldSx }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
 

      </Box>
      {/* Confirm / Cancel Buttons at bottom of form */}
{!AllTextDisabled && (
  <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 0, gap: 2 }}>
    <Button
      variant="contained"
    
      onClick={handleConfirm}
      disabled={IsButtonSubmit}
    >
      Confirm
    </Button>
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleCancel}
    >
      Cancel
    </Button>
  </Box>
)}

    </>
  );
};

export default StepperMst2;
