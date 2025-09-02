'use client';
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFormMode } from "@/lib/helpers";
import ConfirmDelDialog from "@/GlobalFunction/ConfirmDelDialog";
import BranchTable from "./BranchTable";

const FORM_MODE = getFormMode();
const initialFormState = {
  COBR_ID: "",
  COBR_NAME: "",
  PRINT_NAME: "",
  JURISDICTION: "",
  COBR_ADD: "",
  PLACE: "",
  FAX_NO: "",
  VAT: "",
  LBT: "",
  OTH_ADD: "",
  BRANCH_OWN_MOBNO: "",
  COBR_ABRV: "",
  Image: "",
  TEL_NO: "",
  E_MAIL: "",
  EXCISE_CODE: "",
  EXCISE_RANG: "",
  CO_DIV_KEY: "",
  bank_acc: "",
  GSTTIN_NO: "",
  Active: false,
};

const StepperMst2 = ({ TableData, setTableData, IsButtonSubmit, mode, defaultFormValues }) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [AllButtonDisabled, setAllButtonDisabled] = useState(true);
  const [AddDisabled, setAddDisabled] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const columns = [
    { id: 'COBR_NAME', label: 'Branch', minWidth: 150 },
    { id: 'COBR_ID', label: 'Code', minWidth: 100 },
    { id: 'COBR_ABRV', label: 'Abvr', minWidth: 100 },
    { id: 'PLACE', label: 'Area', minWidth: 150 },
    { id: 'PRINT_NAME', label: 'Print Name', minWidth: 150 },
    { id: 'COBR_ADD', label: 'Address', minWidth: 200 },
    { id: 'JURISDICTION', label: 'Jurisdiction', minWidth: 150 },
    { id: 'FAX_NO', label: 'Fax', minWidth: 120 },
    { id: 'VAT', label: 'Vat', minWidth: 120 },
    { id: 'LBT', label: 'Lbt', minWidth: 120 },
    { id: 'OTH_ADD', label: 'Work Add', minWidth: 150 },
    { id: 'BRANCH_OWN_MOBNO', label: 'Owner Mob', minWidth: 150 },
    { id: 'Image', label: 'Image', minWidth: 100 },
    { id: 'TEL_NO', label: 'Tel', minWidth: 120 },
    { id: 'E_MAIL', label: 'Email', minWidth: 180 },
    { id: 'EXCISE_CODE', label: 'Excise Code', minWidth: 120 },
    { id: 'EXCISE_RANG', label: 'Excise Rang', minWidth: 120 },
    { id: 'CO_DIV_KEY', label: 'Co Division', minWidth: 150 },
    { id: 'bank_acc', label: 'Bank Details', minWidth: 200 },
    { id: 'GSTTIN_NO', label: 'GSTTIN NO', minWidth: 150 },
    { id: 'Active', label: 'Active', minWidth: 60, align: 'center' },
  ];

  // Map user-friendly labels to exact form keys (case-sensitive)
  const fieldNameMap = {
    "Print Name": "PRINT_NAME",
    "Jurisdiction": "JURISDICTION",
    "Address": "COBR_ADD",
    "Place": "PLACE",
    "Fax": "FAX_NO",
    "VAT": "VAT",
    "LBT": "LBT",
    "WorkAddr": "OTH_ADD",
    "OwnerMobNo": "BRANCH_OWN_MOBNO",
    "Email": "E_MAIL",
    "ExciseCd": "EXCISE_CODE",
    "ExciseRng": "EXCISE_RANG",
    "CoDivision": "CO_DIV_KEY",
    "BankDetails": "bank_acc",
    "GSTTINNO": "GSTTIN_NO",
  };

  useEffect(() => {
    if (TableData.length === 0 && defaultFormValues && defaultFormValues.TEL_NO) {
      const firstBranch = {
        ...initialFormState,
        COBR_ID: "",
        COBR_NAME: "",
        TEL_NO: defaultFormValues.TEL_NO || "",
        E_MAIL: defaultFormValues.E_MAIL || "",
        OTH_ADD: defaultFormValues.COBR_ADD || "",
        PLACE: defaultFormValues.PLACE || "",
        BRANCH_OWN_MOBNO: defaultFormValues.BRANCH_OWN_MOBNO || "",
        GSTTIN_NO: defaultFormValues.GSTTIN_NO || "",
        EXCISE_CODE: defaultFormValues.EXCISE_CODE || "",
        EXCISE_RANG: defaultFormValues.EXCISE_RANG || "",
        CO_DIV_KEY: defaultFormValues.EXCISE_DIV || "",
        bank_acc: defaultFormValues.bank_acc || "",
        PRINT_NAME: defaultFormValues.PRINT_NAME || "",
      };
      setTableData([firstBranch]);
    }
  }, [defaultFormValues, TableData.length, setTableData]);

  useEffect(() => {
    if (TableData.length > 0) {
      setForm(TableData[0]);
      setSelectedRowIndex(0);
    } else {
      setForm(initialFormState);
    }
  }, [TableData]);

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleDelCancel = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedRowIndex !== null) {
      setAllButtonDisabled(true);
      setAddDisabled(true);
      const newList = [...TableData];
      newList.splice(selectedRowIndex, 1);
      setTableData(newList);
      setForm(initialFormState);
      setSelectedRowIndex(null);
      setIsEditing(false);
      setAllButtonDisabled(true);
      setAddDisabled(false);
    }
    setOpenDialog(false);
  };

  const handleClickAdd = () => {
    setForm(initialFormState);
    setAddDisabled(true);
    setAllButtonDisabled(false);
    setSelectedRowIndex(null);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
    setAllButtonDisabled(false);
    setForm(TableData[index]);
    setIsEditing(false);
    setAddDisabled(false);
  };

  const handleClickEdit = () => {
    if (selectedRowIndex !== null) {
      setIsEditing(true);
      setAllButtonDisabled(true);
      setAddDisabled(true);
    }
  };

  const handleConfirm = () => {
    if (!form.COBR_ID || !form.COBR_NAME) {
      alert("Please fill in both COBR_ID and Name");
      return;
    }

    setAllButtonDisabled(true);
    setAddDisabled(true);

    if (selectedRowIndex !== null) {
      const updatedData = TableData.map((item, index) =>
        index === selectedRowIndex ? form : item
      );
      setTableData(updatedData);
    } else {
      setTableData([...TableData, form]);
    }

    setForm(initialFormState);
    setSelectedRowIndex(null);
    setIsEditing(false);
    setAllButtonDisabled(true);
    setAddDisabled(false);
  };

  const handleCancel = () => {
    setForm(initialFormState);
    setSelectedRowIndex(null);
    setIsEditing(false);
    setAllButtonDisabled(true);
    setAddDisabled(false);
  };

  const textFieldSx = {
    "& .MuiInputBase-root": {
      paddingTop: "0px",
      paddingBottom: "0px",
      fontSize: "0.89rem",
      minHeight: "20px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "4px 8px",
      height: "18px",
    },
  };

  const labelWidth = { xs: 100, sm: 120, md: 150 };
  const inputWidth = { xs: '100%', sm: 350 };
  const largerInputWidth = { xs: '100%', sm: 450 }; 
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 0.5, sm: 1 },
        marginInline: { xs: '2%', sm: '5%', md: '10%', lg: '15%' },
        marginTop: { xs: '10px', sm: '15px', md: '0px' },
      }}
    >
      {/* Table Section */}
      <Box
        sx={{
    width: "100%",
    maxWidth: { xs: "100%", sm: "1200px", md: "1600px" }, // Increased maxWidth
    margin: "0 auto", // Center the table
    mt: 0,
    px: { xs: 0, sm: 2 },
  }}
      >
        <BranchTable
          columns={columns}
          data={TableData}
          selectedIndex={selectedRowIndex}
          onRowClick={handleRowClick}
        />
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: { xs: "8px", sm: "10px", md: "1px" },
          width: "100%",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* Left - Buttons */}
        <Box sx={{ display: "flex", gap: { xs: "4px", sm: "8px" }, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#39ace2", minWidth: { xs: 40, sm: 48 } }}
            onClick={handleClickAdd}
            disabled={AddDisabled || IsButtonSubmit}
          >
            <AddIcon />
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#39ace2", margin: { xs: "0 4px", sm: "0 10px" }, minWidth: { xs: 40, sm: 48 } }}
            onClick={handleClickEdit}
            disabled={AllButtonDisabled || IsButtonSubmit}
          >
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#39ace2", minWidth: { xs: 40, sm: 48 } }}
            onClick={handleDelete}
            disabled={AllButtonDisabled || IsButtonSubmit}
          >
            <DeleteIcon />
          </Button>
        </Box>

        {/* Right - Bank Details Textarea */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: { xs: 0.5, sm: 1 },
            marginTop: { xs: 1, sm: 0 },
            width: { xs: '100%', sm: 460 ,md:540},
            minWidth: { xs: 'auto', sm: 300 },
          }}
        >
          <Typography sx={{ width: { xs: 100, sm: 110 ,md:140}, fontSize: { xs: "0.8rem", sm: "0.875rem" }, fontWeight: 540 }}>
            Bank Details:
          </Typography>
          <TextField
            size="small"
            name="bank_acc"
            value={form.bank_acc}
            onChange={handleInputChange}
            disabled={!isEditing}
            multiline
            rows={2}
            sx={{
              width: 400,//ncreased width
              "& .MuiOutlinedInput-root": {
                padding: { xs: 0.5, sm: 1 },
              },
              "& .MuiOutlinedInput-inputMultiline": {
                overflowY: "auto",
                padding: { xs: "6px", sm: "8px" },
              },
            }}
          />
        </Box>
      </Box>
    {/* Form Section */}
      <Box sx={{ display: "flex", justifyContent: "center", flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 4 }, marginTop: { xs: "8px", sm: "10px", md: "1px" }, alignItems: "flex-start", marginInline: { xs: '0%', sm: '10%' ,md:"0%"} }}>
        {/* Left Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 0.5, sm: 0.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 400 } }}>
          {[
            {
              label: "Name",
              custom: (
                <>
                  <TextField
                    size="small"
                    name="COBR_ID"
                    value={form.COBR_ID}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    sx={{ width: { xs: 60, sm: 45, md: 90 }, ...textFieldSx }}
                  />
                  <TextField
                    size="small"
                    name="COBR_NAME"
                    value={form.COBR_NAME}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    sx={{ width: { xs: 'calc(100% - 70px)', sm: 250 }, ...textFieldSx }}
                  />
                </>
              ),
            },
            "Print Name",
            "Jurisdiction",
            "Address",
            "Place",
            "Fax",
            "VAT",
            "LBT",
            "WorkAddr",
            "OwnerMobNo",
          ].map((fieldOrObj) => {
            const label = typeof fieldOrObj === 'string' ? fieldOrObj.replace(/([A-Z])/g, ' $1') : fieldOrObj.label;
            const field = typeof fieldOrObj === 'string' ? fieldNameMap[fieldOrObj] : null;
            const custom = typeof fieldOrObj === 'object' ? fieldOrObj.custom : null;

            return (
              <Box key={label} sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 0.5 }, minWidth: { xs: '100%', sm: 400 } }}>
                <Typography sx={{ width: labelWidth, textAlign: "left", fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{label}:</Typography>
                {custom || (
                  <TextField
                    size="small"
                    name={field}
                    value={form[field]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    multiline={field === "COBR_ADD"}
                    rows={field === "COBR_ADD" ? 1 : undefined}
                    sx={{ width: inputWidth, ...textFieldSx }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 0.5, sm: 0.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 350 ,md:540} }}>
          {[
            {
              label: "Abvr",
              custom: (
                <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 0.5 }, minWidth: { xs: '100%', sm: 320,md:400 } }}>
                  <TextField
                    size="small"
                    name="COBR_ABRV"
                    value={form.COBR_ABRV}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    sx={{ width: { xs: 'calc(100% - 100px)', sm: 170 ,md:180}, ...textFieldSx }}
                  />
                  <Button variant="text" size="small" onClick={() => setForm(prev => ({ ...prev, Image: "" }))}>
                    Clear Image
                  </Button>
                </Box>
              ),
            },
           {
  label: "Image & Tel",
  custom: (
    <Box sx={{
      display: "flex",
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      minHeight: 50,
    }}>
      {/* Image Placeholder */}
      <Box sx={{
        width: 100,
        height: 70,
        marginLeft:"-12px",
        border: "1px solid #ccc",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        color: "#666",
        backgroundColor: "#f2f2f2",
        flexShrink: 0,
      }}>
        Image
      </Box>

      {/* Tel Input & Browse */}
      <Box sx={{ display: "flex", flexDirection: 'column', gap: 0.5 }}>
        <TextField
          size="small"
          name="TEL_NO"
          value={form.TEL_NO}
          onChange={handleInputChange}
          disabled={!isEditing}
          placeholder="Tel No"
          sx={{
            width: 200,
            height: 36,
            ...textFieldSx,
          }}
        />
        <Button
          variant="text"
          size="small"
          sx={{ padding: 0, minHeight: 24, textTransform: 'none' }}
        >
          Browse...
        </Button>
      </Box>
    </Box>
  ),
},

            "Email",
            "ExciseCd",
            "ExciseRng",
            "CoDivision",
            "BankDetails",
            "GSTTINNO",
            {
              label: "Active",
              custom: (
                <input
                  type="checkbox"
                  name="Active"
                  checked={form.Active}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              ),
            },
          ].map((fieldOrObj) => {
            const label = typeof fieldOrObj === 'string' ? fieldOrObj.replace(/([A-Z])/g, ' $1') : fieldOrObj.label;
            const field = typeof fieldOrObj === 'string' ? fieldNameMap[fieldOrObj] : null;
            const custom = typeof fieldOrObj === 'object' ? fieldOrObj.custom : null;

            // Define fields that need larger width
            const largerFields = ["E_MAIL", "EXCISE_CODE", "EXCISE_RANG", "CO_DIV_KEY", "bank_acc","GSTTIN_NO"];
            const fieldWidth = largerFields.includes(field) ? largerInputWidth : inputWidth;

            return (
              <Box key={label} sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, minWidth: { xs: '100%', sm: 320 } }}>
                <Typography sx={{ width: labelWidth, textAlign: "left", fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{label}:</Typography>
                {custom || (
                  <TextField
                    size="small"
                    name={field}
                    value={form[field]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    multiline={field === "bank_acc"}
                    rows={field === "bank_acc" ? 1 : undefined}
                    sx={{ width: fieldWidth, ...textFieldSx }} // Use conditional width
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Confirm / Cancel Buttons at bottom of form */}
      {isEditing && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: { xs: 1, sm: 0 }, gap: { xs: 1, sm: 2 }, width: "100%" }}>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={IsButtonSubmit || !isEditing}
            sx={{ minWidth: { xs: 80, sm: 100 } }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ minWidth: { xs: 80, sm: 100 } }}
          >
            Cancel
          </Button>
        </Box>
      )}

      <ConfirmDelDialog
        open={openDialog}
        title="Confirm Deletion"
        description="Are you sure you want to delete this record?"
        onConfirm={handleConfirmDelete}
        onCancel={handleDelCancel}
      />
    </Box>
  );
};

export default StepperMst2;
