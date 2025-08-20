'use client';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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


const StepperMst3 = ({ TableData, IsButtonSubmit, UserLoginId, TextDisabledFast }) => {
  const { register, watch, reset, setValue } = useForm();
  

  const [AllTextDisabled, setAllTextDisabled] = useState(false);
  const [AllButtonDisabled, setAllButtonDisabled] = useState(true);
  const [AddDisabled, setAddDisabled] = useState(false);
  const [selectedImage, setselectedImage] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const columns = [
    { id: 'CobrAbrv', label: 'Short123 Name', minWidth: 100, align: 'left' },
    { id: 'CobrName', label: 'Branch Name', minWidth: 150, align: 'left' },
    { id: 'City', label: 'City', minWidth: 100, align: 'left' },
  ];

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
    setAllButtonDisabled(false);
  };

  const handleClickAdd = () => {
    console.log("Add clicked");
    reset(); // Clear form
    setAddDisabled(true);
    setAllTextDisabled(false);
    setSelectedRowIndex(null);
  };

  const handleClickEdit = () => {
    console.log("Edit clicked for row index:", selectedRowIndex);
    if (selectedRowIndex !== null) {
      const selectedData = TableData[selectedRowIndex];
      Object.entries(selectedData).forEach(([key, value]) => setValue(key, value));
      setAllTextDisabled(false);
    }
  };

  const handleDelete = () => {
    if (selectedRowIndex !== null) {
      const selectedData = TableData[selectedRowIndex];
      console.log("Delete clicked for row:", selectedData);
      // Confirm & delete logic
    }
  };

  const handlePreviousClick = () => {
    console.log("Previous clicked");
  };

  const handleClickCancelButton = () => {
    console.log("Cancel clicked");
    reset();
    setAllTextDisabled(true);
    setAddDisabled(false);
    setSelectedRowIndex(null);
  };

  const handleSubmit = async () => {
    const formData = watch();

  };

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

  const labelWidth = 120;
  const inputWidth = 300;

  return (
    <>
      {/* Table Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 0,
          ml: 10
        }}
      >
        <Paper
          sx={{
            width: "75%",
            maxWidth: "1000px",
            overflow: "hidden",
            border: "1px solid lightgray"
          }}
        >
          <TableContainer sx={{ maxHeight: 1000 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow sx={{ "& > th": { padding: "2px 10px" } }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {column.label}
                      </Typography>
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
                    sx={{
                      "& > td": { padding: "2px 14px" },
                      cursor: "pointer"
                    }}
                    onClick={() => handleRowClick(index)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value || "N/A"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      {/* Action Buttons */}
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginTop: "10px",
          // paddingRight: "60%"
        }}
      >
        <Box sx={{ marginLeft: "17%" }}>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#635bff" }}
            onClick={handleClickAdd}
            disabled={(AllButtonDisabled && AddDisabled) || IsButtonSubmit}
          >
            <AddIcon />
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#635bff", margin: "0px 10px" }}
            onClick={handleClickEdit}
            disabled={AllButtonDisabled || IsButtonSubmit}
          >
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#635bff" }}
            onClick={handleDelete}
            disabled={AllButtonDisabled || IsButtonSubmit}
          >
            <DeleteIcon />
          </Button>
        </Box>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: "20px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[
            {
              label: "Name",
              custom: (
                <>
                  <TextField
                    size="small"
                    value={watch("SmallName") || ""}
                    onChange={(e) => setValue("SmallName", e.target.value)}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{
                      width: 40,
                      "& .MuiInputBase-root": {
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        fontSize: "0.75rem",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "4px 8px",
                      },
                    }}
                  />
                  <TextField
                    size="small"
                    value={watch("BigName") || ""}
                    onChange={(e) => setValue("BigName", e.target.value)}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{ width: 252, ...textFieldSx }}
                  />
                </>
              ),
            },
            { label: "Print Name", field: "PrintName" },
            ...[
              "Jurisdiction",
              "Address",
              "Place",
              "Fax",
              "VAT",
              "LBT",
              "WorkAddr",
              "OwnerMobile",
            ].map((field) => ({
              label: field.replace(/([A-Z])/g, " $1"),
              field,
            })),
          ].map(({ label, field, custom }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 320 }}>
              <Typography sx={{ width: labelWidth, textAlign: "right" }}>{label}:</Typography>
              {custom ||
                (field === "Address" ? (
                  <TextField
                    size="small"
                    value={watch(field) || ""}
                    multiline
                    rows={1}
                    onChange={(e) => setValue(field, e.target.value)}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{
                      width: inputWidth, ...textFieldSx, '& textarea': {
                        paddingLeft: '0px', 
                        paddingTop: '6px',  
                        paddingBottom: '6px',
                      }, '& .MuiInputBase-root': {
                        padding: 0, 
                      },
                    }}
                    InputProps={{
                      sx: {
                        paddingRight: 0,
                      },
                    }}
                  />
                ) : (
                  <TextField
                    size="small"
                    value={watch(field) || ""}
                    onChange={(e) => setValue(field, e.target.value)}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{ width: inputWidth, ...textFieldSx }}
                  />
                ))}
            </Box>
          ))}
        </Box>
        {/* Right Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[
            {
              label: "Abrv",
              custom: (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 320,
                  }}
                >
                  <TextField
                    size="small"
                    value={watch("Abrv") || ""}
                    onChange={(e) => setValue("Abrv", e.target.value)}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{ width: 150, ...textFieldSx }}
                  />
                  <Button
                    variant="text"      
                    size="small"
                    sx={{ padding: "4px 6px", border: "none", alignSelf: "flex-start" }}  
                    onClick={() => {
                      setValue("Image", "");
                    }}

                  >
                    Clear Image
                  </Button>
                </Box>
              ),
            },
            {
              label: "Image & Tel",
              custom: (
                <Box sx={{ display: "flex", flexDirection: 'row', gap: 1, alignItems: "center" }}>
                  {/* Image Box */}
                  <Box
                    sx={{
                      width: 80,
                      height: 60,
                      border: "1px solid gray",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f9f9f9",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      Image
                    </Typography>
                  </Box>
                  {/* Tel with label outside */}
                  <Box sx={{ display: "flex", flexDirection: 'column', gap: 0, paddingBlock: '0px' }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                      <Typography sx={{ width: 30, textAlign: "left" }}>Tel:</Typography>
                      <TextField
                        size="small"
                        value={watch("Tel") || ""}
                        onChange={(e) => setValue("Tel", e.target.value)}
                        disabled={AllTextDisabled || TextDisabledFast}
                        sx={{ width: 180, ...textFieldSx }}
                      />
                    </Box>
                                       <Button
                      variant="text"      
                      size="small"
                      sx={{ padding: "4px 6px", border: "none", alignSelf: "flex-start" }}  
                    >
                      Browse...
                    </Button>
                  </Box>
                </Box>
              ),
            },
            ...[
              "Email",
              "ExciseCd",
              "ExciseRng",
              "CoDivision",
              "BankDetails",
              "GSTINNo",
            ].map((field) => ({
              label: field.replace(/([A-Z])/g, " $1"),
              field,
            })),
            {
              label: "Active",
              custom: (
                <input
                  type="checkbox"
                  checked={watch("Active") || false}
                  onChange={(e) => setValue("Active", e.target.checked)}
                  disabled={AllTextDisabled || TextDisabledFast}
                />
              ),
            },
          ].map(({ label, field, custom }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 320 }}>
              <Typography sx={{ width: labelWidth, textAlign: "right" }}>{label}:</Typography>
              {custom ||
                (field === "BankDetails" ? (
                  <TextField
                    size="small"
                    value={watch(field) || ""}
                    multiline
                    rows={1}
                    onChange={(e) => setValue(field, e.target.value)}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{
                      width: inputWidth, ...textFieldSx, '& textarea': {
                        paddingLeft: '0px', 
                        paddingTop: '6px',
                        paddingBottom: '6px',
                      }, '& .MuiInputBase-root': {
                        padding: 0, 
                      },
                    }}
                    InputProps={{
                      sx: {
                        paddingRight: 0,
                      },
                    }}
                  />
                ) : (
                  <TextField
                    size="small"
                    value={watch(field) || ""}
                    onChange={(e) => setValue(field, e.target.value)}
                    disabled={AllTextDisabled || TextDisabledFast}
                    sx={{ width: inputWidth, ...textFieldSx }}
                  />
                ))}

            </Box>
          ))}
        </Box>
      </Box>
      {/* Footer Buttons */}
      <Grid
        item
        xs={2}
        className="form_button"
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBlock: "10px",
          marginLeft: "69vw",
          textAlign: "right"
        }}
      >
        {['Prev', 'Submit', 'Cancel'].map((label, index) => (
          <Button
            key={index}
            sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)', width: "60px" }}
            variant="contained"
            onClick={
              label === 'Prev'
                ? handlePreviousClick
                : label === 'Submit'
                  ? handleSubmit
                  : handleClickCancelButton
            }
            disabled={IsButtonSubmit}
          >
            {label}
          </Button>
        ))}
      </Grid>
    </>
  );
};

export default StepperMst3;
