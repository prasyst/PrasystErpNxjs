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
import { toast } from "react-toastify";
import CustomAutocomplete from "@/GlobalFunction/CustomAutoComplete/CustomNew";

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
  PINCODE: "",
};

const StepperMst2 = ({ TableData, setTableData, IsButtonSubmit, mode, defaultFormValues, onAddBranchAttempt, onAddInReadMode, onEditInReadMode, onDeleteInReadMode }) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [AllButtonDisabled, setAllButtonDisabled] = useState(true);
  const [AddDisabled, setAddDisabled] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setAddDisabled(TableData.length === 0);
  }, [TableData]);

  const columns = [
    { id: 'COBR_NAME', label: 'Branch', minWidth: 200 },
    { id: 'COBR_ID', label: 'Code', minWidth: 120 },
    { id: 'COBR_ABRV', label: 'Abvr', minWidth: 120 },
    { id: 'PLACE', label: 'Area', minWidth: 180 },
    { id: 'PINCODE', label: 'PinCode', minWidth: 120 },
    { id: 'PRINT_NAME', label: 'Print Name', minWidth: 200 },
    { id: 'COBR_ADD', label: 'Address', minWidth: 250 },
    { id: 'JURISDICTION', label: 'Jurisdiction', minWidth: 180 },
    { id: 'FAX_NO', label: 'Fax', minWidth: 140 },
    { id: 'VAT', label: 'Vat', minWidth: 140 },
    { id: 'LBT', label: 'Lbt', minWidth: 140 },
    { id: 'OTH_ADD', label: 'Work Add', minWidth: 180 },
    { id: 'BRANCH_OWN_MOBNO', label: 'Owner Mob', minWidth: 180 },
    { id: 'Image', label: 'Image', minWidth: 120 },
    { id: 'TEL_NO', label: 'Tel', minWidth: 140 },
    { id: 'E_MAIL', label: 'Email', minWidth: 200 },
    { id: 'EXCISE_CODE', label: 'Excise Code', minWidth: 140 },
    { id: 'EXCISE_RANG', label: 'Excise Rang', minWidth: 140 },
    { id: 'CO_DIV_KEY', label: 'Co Division', minWidth: 180 },
    { id: 'bank_acc', label: 'Bank Details', minWidth: 250 },
    { id: 'GSTTIN_NO', label: 'GSTTIN NO', minWidth: 180 },
    { id: 'Active', label: 'Active', minWidth: 80, align: 'center' },
  ];

  const fieldNameMap = {
    "Print Name": "PRINT_NAME",
    "Jurisdiction": "JURISDICTION",
    "Address": "COBR_ADD",
    "Place": "PLACE",
    "PinCode": "PINCODE",
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

  const handleDelete = () => {
    if (selectedRowIndex === 0) {
      toast.error("The first branch record cannot be deleted.");
      return;
    }
    if (mode === FORM_MODE.read) {
      if (onDeleteInReadMode) {
        onDeleteInReadMode();
      }
    }
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
    console.log('handleClickAdd - mode:', mode, 'TableData:', TableData, 'TableData.length:', TableData?.length);
    if (mode === FORM_MODE.add && (!TableData || TableData.length === 0)) {
      console.log('Triggering onAddBranchAttempt: mode is add and TableData is empty');
      if (onAddBranchAttempt) {
        onAddBranchAttempt();
      }
      return;
    }

    if (mode === FORM_MODE.read) {
      console.log('Switching to edit mode via onAddInReadMode');
      if (onAddInReadMode) {
        onAddInReadMode();
      }
    }

    console.log('Proceeding to add new branch form');
    setForm({
      ...initialFormState,
      COBR_ID: defaultFormValues.CO_ID || "",
      COBR_NAME: defaultFormValues.CO_NAME || "",
      PRINT_NAME: defaultFormValues.CO_NAME || "",
      PINCODE: defaultFormValues.PINCODE || "",
    });
    setAddDisabled(true);
    setAllButtonDisabled(false);
    setSelectedRowIndex(null);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updates = { [name]: type === "checkbox" ? checked : value };

    if (name === "COBR_NAME") {
      updates.PRINT_NAME = value;
    } else if (name === "PRINT_NAME") {
      updates.COBR_NAME = value;
    }

    if (["TEL_NO", "BRANCH_OWN_MOBNO", "PINCODE"].includes(name)) {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 15) return;
      updates[name] = numericValue;
    }

    if (name === "E_MAIL") {
      const emailRegex = /^[a-zA-Z0-9._%+-@]*$/;
      if (!emailRegex.test(value)) return;
      updates[name] = value;
    }

    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleRowClick = (index) => {
    setSelectedRowIndex(index);
    setAllButtonDisabled(index === 0);
    setForm(TableData[index]);
    setIsEditing(false);
    setAddDisabled(false);
  };

  const handleClickEdit = () => {
    if (selectedRowIndex === 0) {
      toast.error("The first branch record cannot be edited.");
      return;
    }
    if (selectedRowIndex !== null) {
      if (mode === FORM_MODE.read) {
        if (onEditInReadMode) {
          onEditInReadMode();
        }
      }
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

  const labelWidth = { xs: 100, sm: 120, md: 130 };
  const inputWidth = { xs: '100%', sm: 350 };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 0.5, sm: 1 },
        marginInline: { xs: '0%', sm: '2%', md: '5%', lg: '5%' },
        marginTop: { xs: '10px', sm: '15px', md: '0px' },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "1400px", md: "2000px" },
          margin: "0 auto",
          mt: 0,
          px: { xs: 0, sm: 0 },
        }}
      >
        <BranchTable
          columns={columns}
          data={TableData}
          selectedIndex={selectedRowIndex}
          onRowClick={handleRowClick}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: { xs: "8px", sm: "10px", md: "1px" },
          width: "100%",
          flexWrap: "nowrap",
          gap: { xs: 1, sm: 2 },
          px: 0,
        }}
      >
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: { xs: 0.5, sm: 1 },
            marginTop: { xs: 1, sm: 0 },
            width: { xs: '100%', sm: 350 },
            minWidth: { xs: 'auto', sm: 300 },
          }}
        >
          <Typography sx={{ width: { xs: 100, sm: 110, md: 140 }, fontSize: { xs: "0.8rem", sm: "0.875rem" }, fontWeight: 540 }}>
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
              width: inputWidth,
              "& .MuiOutlinedInput-root": { padding: { xs: 0.5, sm: 1 } },
              "& .MuiOutlinedInput-inputMultiline": { overflowY: "auto", padding: { xs: "6px", sm: "8px" } },
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 4 }, marginTop: { xs: "8px", sm: "10px", md: "1px" }, alignItems: "flex-start", marginInline: { xs: '0%', sm: '0%', md: "0%" }, px: 0 }}>
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
            {
              label: "Print Name",
              field: "PRINT_NAME",
            },
            {
              label: "Jurisdiction",
              field: "JURISDICTION",
            },
            {
              label: "Address",
              field: "COBR_ADD",
            },
{
  label: "Place&Pincode",
  custom: (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: { xs: 0.5, sm: 1 },
        width: inputWidth, // Match the width of other TextFields
        alignItems: "center",
        flexWrap: "nowrap",
      }}
    >
      <TextField
        size="small"
        name="PLACE"
        value={form.PLACE}
        onChange={handleInputChange}
        disabled={!isEditing}
        placeholder="Place"
        sx={{
          flex: 1, // Take available space
          minWidth: { xs: 100, sm: 150, md: 130 }, // Ensure minimum width
          ...textFieldSx, // Existing styling for consistency
        }}
      />
      <CustomAutocomplete
        value={form.PINCODE}
        onChange={(value) =>
          handleInputChange({ target: { name: "PINCODE", value } })
        }
        disabled={!isEditing}
        placeholder="Pincode"
        sx={{
          flex: 1, // Take available space
          minWidth: { xs: 100, sm: 150, md: 130 }, // Ensure minimum width
          ...textFieldSx, // Apply same styling as TextField
          "& .MuiAutocomplete-inputRoot": {
            padding: "4px 8px", // Match TextField padding
            height: "26px", // Reduced height
            minHeight: "20px",
            fontSize: "0.89rem", // Match TextField font size
          },
          "& .MuiAutocomplete-input": {
            padding: "0 !important", // Remove extra padding in input
            height: "18px", // Match TextField input height
          },
          "& .MuiAutocomplete-endAdornment": {
            top: "50%", // Center vertically
            transform: "translateY(-50%)", // Adjust for exact centering
          },
        }}
      />
    </Box>
  ),
},       {
              label: "Fax",
              field: "FAX_NO",
            },
            {
              label: "VAT",
              field: "VAT",
            },
            {
              label: "LBT",
              field: "LBT",
            },
            {
              label: "WorkAddr",
              field: "OTH_ADD",
            },
            {
              label: "OwnerMobNo",
              field: "BRANCH_OWN_MOBNO",
            },
          ].map((fieldOrObj) => {
            const label = fieldOrObj.label || (typeof fieldOrObj === 'string' ? fieldOrObj.replace(/([A-Z])/g, ' $1') : '');
            const field = fieldOrObj.field || (typeof fieldOrObj === 'string' ? fieldNameMap[fieldOrObj] : null);
            const custom = fieldOrObj.custom;

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 0.5, sm: 0.5 }, width: { xs: '100%', sm: 'auto' }, minWidth: { xs: 'auto', sm: 350, md: 540 } }}>
          {[
            {
              label: "Abvr",
              custom: (
                <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 0.5 }, minWidth: { xs: '100%', sm: 320, md: 400 } }}>
                  <TextField
                    size="small"
                    name="COBR_ABRV"
                    value={form.COBR_ABRV}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    sx={{ width: { xs: 'calc(100% - 100px)', sm: 170, md: 180 }, ...textFieldSx }}
                  />
                  <Button variant="text" size="small" onClick={() => setForm(prev => ({ ...prev, Image: "" }))}>
                    Clear Image
                  </Button>
                </Box>
              ),
            },
            {
              label: "Image",
              custom: (
                <Box sx={{
                  display: "flex",
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  minHeight: 50,
                  marginLeft:2
                }}>
                  <Box sx={{
                    width: 120,
                    height: 70,
                    marginLeft: "-12px",
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
                  <Box sx={{ display: "flex", flexDirection: 'column', gap: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                      <Typography sx={{ fontSize: '0.8rem', minWidth: 30 }}>Tel:</Typography>
                      <TextField
                        size="small"
                        name="TEL_NO"
                        value={form.TEL_NO}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Tel No"
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 15,
                        }}
                        sx={{ width: 200, height: 36, ...textFieldSx }}
                      />
                    </Box>
                    <Button variant="text" size="small" sx={{ padding: 0, minHeight: 24, textTransform: 'none' }}>
                      Browse...
                    </Button>
                  </Box>
                </Box>
              ),
            },
            {
              label: "Tel",
              field: "TEL_NO",
            },
            {
              label: "Email",
              field: "E_MAIL",
            },
            {
              label: "ExciseCd",
              field: "EXCISE_CODE",
            },
            {
              label: "ExciseRng",
              field: "EXCISE_RANG",
            },
            {
              label: "CoDivision",
              field: "CO_DIV_KEY",
            },
            {
              label: "BankDetails",
              field: "bank_acc",
            },
            {
              label: "GSTTINNO",
              field: "GSTTIN_NO",
            },
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
            const label = fieldOrObj.label || (typeof fieldOrObj === 'string' ? fieldOrObj.replace(/([A-Z])/g, ' $1') : '');
            const field = fieldOrObj.field || (typeof fieldOrObj === 'string' ? fieldNameMap[fieldOrObj] : null);
            const custom = fieldOrObj.custom;

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
                    sx={{ width: inputWidth, ...textFieldSx }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      {isEditing && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: { xs: 1, sm: 0 }, gap: { xs: 1, sm: 2 }, width: "100%", px: 0 }}>
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