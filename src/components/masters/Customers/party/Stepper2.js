'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import {
  Box,
  Button,
  Stack,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Link,
  Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, InputAdornment
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import { toast, ToastContainer } from 'react-toastify';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CrudButton from '../../../../GlobalFunction/CrudButton';
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import { getFormMode } from '../../../../lib/helpers';
import EditableTable from '@/atoms/EditTable';
import CrudButtons from "@/GlobalFunction/CrudButtons";
import PaginationButtons from '@/GlobalFunction/PaginationButtons';
import z from 'zod';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from "@mui/icons-material/Search";

const FORM_MODE = getFormMode();

const columns = [
  { id: 'ADDR', label: 'Address', minWidth: 150 },
  { id: 'PLACE', label: 'Place', minWidth: 150 },
  { id: 'CONTACT_PERSON', label: 'Cont Person', minWidth: 150 },
  { id: 'MOBILE_NO', label: 'Mobile', minWidth: 150 },
  { id: 'TEL_NO', label: 'Tel No', minWidth: 150 },
  { id: 'FAX_NO', label: 'Fax', minWidth: 150 },
  { id: 'E_MAIL', label: 'Email', minWidth: 150 },
  { id: 'WEBSITE', label: 'Website', minWidth: 150 },
  { id: 'MOBILE_NO', label: 'MOBILE', minWidth: 150 },
  { id: 'PINCODE', label: 'Pincode', minWidth: 150 },
];

const Stepper2 = ({ formData, setFormData, isFormDisabled, rows, setRows, currentPARTY_KEY }) => {
  console.log("Stepper2 full formData:", formData.PartyDtlEntities?.[0]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [isAddFormDisabled, setIsAddFormDisabled] = useState(false);
  const [isEditButtonDisabled, setIsEditButtonDisabled] = useState(false);
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
  const [mode, setMode] = useState(null);
  const [filters, setFilters] = useState(
    columns.reduce((acc, col) => {
      acc[col.id] = "";
      return acc;
    }, {})
  );

  const partyData = formData?.PartyDtlEntities?.[0];

  useEffect(() => {
    if (formData?.PartyDtlEntities?.length && rows.length === 0) {
      setRows(formData?.PartyDtlEntities);
    }
  }, [formData]);

  const textInputSx = {
    '& .MuiInputBase-root': {
      height: 36,
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
      height: 36,
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

  const DropInputSx = {
    '& .MuiInputBase-root': {
      height: 36,
      fontSize: '14px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '14px',
      top: '-4px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: '#fafafa',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      overflow: 'hidden',
      height: 36,
      fontSize: '14px',
      paddingRight: '36px',
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '10px 12px',
      fontSize: '14px',
      lineHeight: '1.4',
    },
    '& .MuiAutocomplete-endAdornment': {
      top: '50%',
      transform: 'translateY(-50%)',
      right: '10px',
    },
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: '#fff'
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     PartyDtlEntities: [{ ...prev?.PartyDtlEntities?.[0], [name]: value }]
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      PartyDtlEntities: [
        {
          ...(prev?.PartyDtlEntities?.[0] || {}),
          [name]: value,
        },
        ...(prev?.PartyDtlEntities?.slice(1) || []),
      ],
    }));
  };

  const handleAdd = () => {
    setFormData(prev => ({
      ...prev,
      PartyDtlEntities: [{
        DBFLAG: 'I',
        PARTYDTL_ID: 0,
        PARTY_KEY: currentPARTY_KEY,
        ADDR: "",
        CONT_KEY: "CN001",
        CITY_KEY: "CT004",
        TEL_NO: "",
        FAX_NO: "",
        E_MAIL: "",
        WEBSITE: "",
        CONTACT_PERSON: "",
        MOBILE_NO: "",
        SST: "",
        CST: "",
        EXCISE_CODE: "",
        REMK: "",
        STATUS: "",
        PLACE: "Place",
        VAT: "",
        MAIN_BRANCH: "",
        RD_URD: "",
        PINCODE: "",
        GSTTIN_NO: "",
        TAX_KEY: 0,
        TERM_KEY: "",
        TRSP_KEY: 0,
        TRADE_DISC: 0,
        RDOFF: "",
        CFORM_FLG: 0,
        PARTY_ALT_CODE: "",
        ORD_SYNCSTATUS: "",
        SEZ: "",
        DEFAULT_BRANCH: "",
      }],
    }));

    setMode('add');
    setIsAddButtonDisabled(true);
    setIsEditButtonDisabled(true);
    setIsDeleteButtonDisabled(true);
    setSelectedIndex(null);
  };

  const handleEdit = () => {
    if (selectedIndex === null) return;
    const selectedRow = rows[selectedIndex];
    setFormData(prev => ({
      ...prev,
      PartyDtlEntities: [{ ...selectedRow, DBFLAG: 'U' }]
    }));
    setMode('edit');
    setIsEditButtonDisabled(true);
    setIsAddButtonDisabled(true);
    setIsDeleteButtonDisabled(true);
  };

  const handleDelete = () => {
    if (selectedIndex === null) return;
    const updated = rows.filter((_, i) => i !== selectedIndex);
    setRows(updated);
    setSelectedIndex(null);
    setFormData(prev => ({
      ...prev,
      PartyDtlEntities: [{
        DBFLAG: '',
        PARTYDTL_ID: "",
        PARTY_KEY: "",
        ADDR: "",
        CONT_KEY: 0,
        CITY_KEY: 0,
        TEL_NO: "",
        FAX_NO: "",
        E_MAIL: "",
        WEBSITE: "",
        CONTACT_PERSON: "",
        MOBILE_NO: "",
        SST: "",
        CST: "",
        EXCISE_CODE: "",
        REMK: "",
        STATUS: "",
        PLACE: "",
        VAT: "",
        MAIN_BRANCH: "",
        RD_URD: "",
        PINCODE: "",
        GSTTIN_NO: "",
        TAX_KEY: 0,
        TERM_KEY: "",
        TRSP_KEY: 0,
        TRADE_DISC: 0,
        RDOFF: "",
        CFORM_FLG: 0,
        PARTY_ALT_CODE: "",
        ORD_SYNCSTATUS: "",
        SEZ: "",
        DEFAULT_BRANCH: "",
      }]
    }));
    setMode(null);
    setIsDeleteButtonDisabled(true);
    setIsAddButtonDisabled(true);
    setIsEditButtonDisabled(true);
  };

  const handleConfirm = () => {

    const currentData = formData?.PartyDtlEntities?.[0];
    if (!currentData) return;

    if (mode === "add") {
      setRows([...rows, currentData]);
    } else if (mode === "edit" && selectedIndex !== null) {
      const updated = [...rows];
      updated[selectedIndex] = currentData;
      setRows(updated);
    }

    setSelectedIndex(null);
    setMode(null);
  };

  const handleCancel = () => {
    setFormData(prev => ({
      ...prev,
      PartyDtlEntities: [{
        DBFLAG: '',
        PARTYDTL_ID: "",
        PARTY_KEY: "",
        ADDR: "",
        CONT_KEY: 0,
        CITY_KEY: 0,
        TEL_NO: "",
        FAX_NO: "",
        E_MAIL: "",
        WEBSITE: "",
        CONTACT_PERSON: "",
        MOBILE_NO: "",
        SST: "",
        CST: "",
        EXCISE_CODE: "",
        REMK: "",
        STATUS: "",
        PLACE: "",
        VAT: "",
        MAIN_BRANCH: "",
        RD_URD: "",
        PINCODE: "",
        GSTTIN_NO: "",
        TAX_KEY: 0,
        TERM_KEY: "",
        TRSP_KEY: 0,
        TRADE_DISC: 0,
        RDOFF: "",
        CFORM_FLG: 0,
        PARTY_ALT_CODE: "",
        ORD_SYNCSTATUS: "",
        SEZ: "",
        DEFAULT_BRANCH: "",
      }],
    }));
    setSelectedIndex(null);
    setMode(null);
    setIsAddButtonDisabled(false);
    setIsEditButtonDisabled(false);
    setIsDeleteButtonDisabled(false);
  };

  const handleChangeStatus = (event) => {
    const { name, checked } = event.target;
    const updatedStatus = checked ? "1" : "0";

    setFormData(prev => ({
      ...prev,
      PartyDtlEntities: [{ ...prev?.PartyDtlEntities?.[0], [name]: updatedStatus }]
    }));
  };

  const Buttonsx = {
    backgroundColor: '#39ace2',
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 30 },
  };

  const handleFilterChange = (columnId, value) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const filteredRows = rows.filter((row, index) => {

    if (index === 0) return true;

    return columns.every((col) => {
      const filterValue = filters[col.id].toLowerCase();
      const cellValue = String(row[col.id] || "").toLowerCase();
      return cellValue.includes(filterValue);
    });
  });

  return (
    <>

      <Grid container spacing={0.5}>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 10 }}>
          <Paper
            elevation={1}
            sx={{
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
            }}
          >
            <TableContainer component={Paper} sx={{ maxHeight: 160 }}>
              <Table stickyHeader size="small" sx={{ tableLayout: "fixed", width: '100%' }}>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          padding: "2px 4px",
                          borderBottom: "1px solid #ddd",
                          width: col.minWidth,
                          maxWidth: col.minWidth,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="caption" noWrap
                            sx={{
                              fontWeight: "bold",
                              fontSize: "0.75rem"
                            }}
                          >
                            {col.label}
                          </Typography>
                          <TextField
                            variant="standard"
                            value={filters[col.id]}
                            onChange={(e) => handleFilterChange(col.id, e.target.value)}
                            placeholder="Search"
                            InputProps={{
                              disableUnderline: true,
                              style: {
                                fontSize: "0.75rem",
                                marginTop: 1,
                                background: "#fff",
                              },
                            }}
                            sx={{
                              width: "100%",
                            }}
                          />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((row, index) => (

                    <TableRow
                      key={index}
                      hover={index !== 0}
                      onClick={index !== 0 ? () => {
                        setSelectedIndex(index);
                        const selectedRow = filteredRows[index];
                        setFormData(prev => ({
                          ...prev,
                          PartyDtlEntities: [{ ...selectedRow }]
                        }));
                      } : undefined}
                      selected={index !== 0 && selectedIndex === index}
                      disabled={isFormDisabled}
                      sx={{
                        backgroundColor:
                          index === 0
                            ? "#f5f5f5"
                            : selectedIndex === index
                              ? "#e3f2fd"
                              : index % 2 === 0
                                ? "#fafafa"
                                : "#fff",
                        cursor: index === 0 ? "not-allowed" : "pointer",
                        opacity: index === 0 ? 0.5 : 1
                      }}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.id}
                          sx={{
                            fontSize: "0.75rem",
                            padding: "6px 8px",
                            color: index === 0 ? "text.disabled" : "inherit",
                            width: col.minWidth,
                            maxWidth: col.minWidth,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                          {row[col.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 10 }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              disabled={isFormDisabled || isAddButtonDisabled}
              sx={{
                backgroundColor: '#007bff',
                margin: { xs: '0 4px', sm: '0 6px' },
                minWidth: { xs: 40, sm: 46, md: 60 },
                height: { xs: 40, sm: 46, md: 30 },
              }}
            >
              Add
            </Button>

            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              disabled={isFormDisabled || isEditButtonDisabled}
              sx={{
                backgroundColor: '#20c997',
                margin: { xs: '0 4px', sm: '0 6px' },
                minWidth: { xs: 40, sm: 46, md: 60 },
                height: { xs: 40, sm: 46, md: 30 },
              }}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={isFormDisabled || isDeleteButtonDisabled}
              sx={{
                backgroundColor: '#dc3545',
                margin: { xs: '0 4px', sm: '0 6px' },
                minWidth: { xs: 40, sm: 46, md: 60 },
                height: { xs: 40, sm: 46, md: 30 },
              }}
            >
              Delete
            </Button>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>


        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Address"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.ADDR}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="ADDR"
            sx={doubleInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <AutoVibe
            id="CONT_KEY"
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Country"
            name="CONT_KEY"
            value={partyData?.CONT_KEY || ""}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
          <Grid size={{ xs: 12, sm: 6, md: 12 }} sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '3px'
          }}>
            <TextField
              label="Pincode"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={partyData?.PINCODE || ""}
              disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              name="PINCODE"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px'
                },
              }}
            />
            <AutoVibe
              id=""
              disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Pincode"
              name=""
              value={""}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <AutoVibe
            id=""
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="State"
            name=""
            value={""}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
          <TextField
            label="Tel"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.TEL_NO || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="TEL_NO"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <AutoVibe
            id="CITY_KEY"
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="City/District"
            name="CITY_KEY"
            value={partyData?.CITY_KEY || ""}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
          <TextField
            label="Email"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.E_MAIL || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="E_MAIL"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Cont Person"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.CONTACT_PERSON || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="CONTACT_PERSON"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Mobile"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.MOBILE_NO || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="MOBILE_NO"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="Website"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.WEBSITE || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="WEBSITE"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <TextField
            label="Alt Cd"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            name=""
            value={""}
            disabled={true}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <TextField
            label="LBT"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            name=""
            value={""}
            disabled={true}
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <TextField
            label="Fax"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.FAX_NO || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="FAX_NO"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
          <TextField
            label="Spl Mark Down"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name=""
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <TextField
            label="Excise"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.EXCISE_CODE || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="EXCISE_CODE"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
          <AutoVibe
            id="TRADE_DISC"
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Trade Disc"
            name="TRADE_DISC"
            value={partyData?.TRADE_DISC || ""}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <TextField
            label="VAT"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.VAT || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="VAT"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
          <AutoVibe
            id="TRSP_KEY"
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Transporter"
            name="TRSP_KEY"
            value={partyData?.TRSP_KEY || 0}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <TextField
            label="CST"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.CST || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="CST"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
          <AutoVibe
            id="TAX_KEY"
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Tax Appl"
            name="TAX_KEY"
            value={partyData?.TAX_KEY || ""}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px'
        }}>
          <AutoVibe
            id="CFORM_FLG"
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            getOptionLabel={(option) => option || ''}
            options={[]}
            label="Form Type"
            name="CFORM_FLG"
            value={partyData?.CFORM_FLG || 0}
            onChange={handleInputChange}
            sx={DropInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px',
              },
            }}
          />
          <TextField
            label="GSTIN No"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.GSTTIN_NO || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="GSTTIN_NO"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label="Remark"
            variant="filled"
            fullWidth
            onChange={handleInputChange}
            value={partyData?.REMK || ""}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            name="REMK"
            sx={textInputSx}
            inputProps={{
              style: {
                padding: '6px 8px',
                fontSize: '12px'
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }} sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          left: 4
        }}>
          <RadioGroup
            row
            name="RDOFF"
            onChange={handleInputChange}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            value={partyData?.RDOFF || ""}
            sx={{
              margin: 0, padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FormControlLabel disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              value="N" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>None</Typography>} />
            <FormControlLabel disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              value="NR" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>Nearest Re</Typography>} />
            <FormControlLabel disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              value="R" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>Rs.5</Typography>} />
          </RadioGroup>

          <FormLabel
            sx={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'black',
              whiteSpace: 'nowrap',
              lineHeight: '1.5',
              position: 'relative',
              left: -8,
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              margin: 0,
            }}
            component="legend">Entity under SEZ</FormLabel>
          <RadioGroup
            row
            name="SEZ"
            onChange={handleInputChange}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            value={partyData?.SEZ || ""}
            sx={{ margin: 0, padding: 0 }}
          >
            <FormControlLabel disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              value="Y" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
            <FormControlLabel disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              value="N" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
          </RadioGroup>

          <Link sx={{ fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }}>
            <Button
              component="span"
              variant="contained"
              sx={{
                minHeight: '10px',
                padding: '1px 4px',
                fontSize: '0.675rem',
              }}
            >
              Verify GSTIN
            </Button>
          </Link>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FormLabel
            sx={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'black',
              whiteSpace: 'nowrap',
              lineHeight: '1.5',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              margin: 0,
            }}
            component="legend">RD/URD</FormLabel>
          <RadioGroup
            row
            name="RD_URD"
            onChange={handleInputChange}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            value={partyData?.RD_URD || ""}
            sx={{ margin: 0, padding: 0 }}
          >
            <FormControlLabel disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              value="R" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>RD</Typography>} />
            <FormControlLabel disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              value="U" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>URD</Typography>} />
            <FormControlLabel disabled={!isEditButtonDisabled && !isAddButtonDisabled}
              value="C" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
              label={<Typography sx={{ fontSize: '12px' }}>Composition</Typography>} />
          </RadioGroup>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 1 }}>
          <FormControlLabel
            control={<Checkbox name="STATUS" size="small" checked={partyData?.STATUS === "1"}
              onChange={handleChangeStatus} />}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            label="Active"
            sx={{
              '& .MuiFormControlLabel-label': { fontSize: '12px' }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControlLabel
            control={<Checkbox name="DEFAULT_BRANCH" size="small" checked={partyData?.DEFAULT_BRANCH === "1"}
              onChange={handleChangeStatus} />}
            disabled={!isEditButtonDisabled && !isAddButtonDisabled}
            label="Default Branch"
            sx={{
              '& .MuiFormControlLabel-label': { fontSize: '12px' }
            }}
          />
        </Grid>
        <Stack direction="row" spacing={2} sx={{ position: 'relative', left: 198 }}>
          <Button
            sx={{
              backgroundColor: '#28a745',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
            }}
            variant="contained"
            onClick={handleConfirm}
            disabled={mode === null}
          >
            Confirm
          </Button>
          <Button
            sx={{
              backgroundColor: '#6c757d',
              margin: { xs: '0 4px', sm: '0 6px' },
              minWidth: { xs: 40, sm: 46, md: 60 },
              height: { xs: 40, sm: 46, md: 30 },
            }}
            onClick={handleCancel}
            disabled={mode === null}
            variant="contained"
          >
            Cancel
          </Button>
        </Stack>
      </Grid>

    </>
  )
}

export default Stepper2;