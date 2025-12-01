"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Button, TextField, FormControl, Typography, Paper, Divider, Alert, Modal, Backdrop, Container,
  Grid, Stack, Chip, IconButton, Autocomplete, FormLabel, RadioGroup, FormControlLabel, Radio, Link,
  FormGroup, Checkbox
} from "@mui/material";

import {
  ArrowBack as MdArrowBack,
  QrCodeScanner as MdQrCodeScanner,
  QrCode2 as MdQrCode,
  AttachFile as MdAttachFile,
  Close as MdClose,
  Send as MdSend,
} from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosInstance from "@/lib/axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { toast, ToastContainer } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import ReusableTable, { getCustomDateFilter } from '@/components/datatable/ReusableTable';

const inputStyle = {
  '& .MuiInputBase-root': {
    height: 44,
    fontSize: '0.875rem',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    '&:hover': {
      backgroundColor: '#f8fafc',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.15)',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    color: '#4b5563',
    '&.Mui-focused': {
      color: '#2563eb',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#9ca3af',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2563eb',
    borderWidth: 2,
  },
};

// Column definitions for AG Grid with Serial No and Checkbox
const columnDefs = [
  {
    headerName: "Select",
    width: 50,
    maxWidth: 40,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    // pinned: 'left',
    lockPosition: true,
    suppressMenu: true,
    sortable: false,
    filter: false,
    resizable: false,

    headerClass: 'checkbox-header'
  },
  {
    field: "ITM_KEY",
    headerName: "ItemCode",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "ITMCAT_NAME",
    headerName: "Category",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "ITMGRP_NAME",
    headerName: "Group",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "ITMSUBGRP_NAME",
    headerName: "SubGroup",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "ITM_NAME",
    headerName: "Item",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "TO_UNIT_NAME",
    headerName: "Unit",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  },
  {
    field: "TO_UNIT_NAME",
    headerName: "Qty",
    filter: 'agSetColumnFilter',
    filterParams: {
      defaultToNothingSelected: true,
    },
    sortable: true
  }
];

const CreateTicketPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    priority: "Medium",
    machGrp: "",
    machine: "",
    machineryKey: "",
    service: "",
    depGrp: "",
    department: "",
    dueDate: "",
    tags: [],
    trnTktDtlEntities: [
      {
        TktDtlId: "",
        TktKey: "",
        ITM_KEY: "",
        UNIT_KEY: "",
        ITM_QTY: "",
        BARCODE: "",
        RATE: "",
        REMARK: "",
        TktdtlImage: "",
        ImgName: "",
        DBFLAG: ""
      }
    ]
  });

  const [errors, setErrors] = useState({
    category: "",
    subCategory: "",
    service: "",
    machine: "",
    department: "",
    machGrp: "",
    depGrp: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState(dayjs());
  const [category, setCategory] = useState([]);
  const [subCat, setSubCat] = useState([]);
  const [servDrp, setServDrp] = useState([]);
  const [machinGrp, setMachineGrp] = useState([]);
  const [selectedMachGrpKey, setSelectedMachGrpKey] = useState("");
  const [machine, setMachine] = useState([]);
  const [deptGrp, setDeptGrp] = useState([]);
  const [dept, setDept] = useState([]);
  const [ticketFor, setTicketFor] = useState("C");
  const [Item, setItem] = useState([]);
  const [seriesKey, setSeriesKey] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [cobrId, setCobrId] = useState(null);
  const [fcyrKey, setFcyrKey] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsSecondTable, setRowsSecondTable] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem("COBR_ID") || "01";
      const key = localStorage.getItem("FCYR_KEY") || "25";
      setCobrId(id);
      setFcyrKey(key);
    }
  }, []);

  useEffect(() => {
    fetchCategory();
    fetchSubCategory();
    fetchService();
    fetchMachineGroup();
    fetchMachine();
    fetchDeptGroup();
    fetchDepart();
    getSeriesKey();
    getSeriesData();
  }, [cobrId, fcyrKey])

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`Itm/GetItmDrp`, {
        "FLAG": "",
        "ITM_KEY": "",
        "ITMCAT_KEY": "",
        "ITMGRP_KEY": "",
        "ITMSUBGRP_KEY": ""
      });
      const { data: { STATUS, DATA } } = response;
      if (STATUS === 0 && Array.isArray(DATA)) {
        const formattedData = DATA.map((row) => ({
          ...row,

        }));
        setRows(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
    console.log('Selected rows:', selectedData);
  }, []);

  const handleConfirmButton = () => {
    // setRowsSecondTable([...rowsSecondTable, ...selectedRows]);
    setRowsSecondTable((prevData) => [...prevData, ...selectedRows]);
  };

  const handleSaveButton = () => {
    handleSubmit();
    setOpenConfirmDialog(false);
  };

  const handleCancel = () => {
    setSelectedRows([]);
    setRowsSecondTable([]);
    setFormData({
      title: "",
      description: "",
      category: "",
      subCategory: "",
      priority: "Medium",
      machGrp: "",
      machine: "",
      machineryKey: "",
      service: "",
      depGrp: "",
      department: "",
      dueDate: "",
      tags: [],
      trnTktDtlEntities: [
        {
          TktDtlId: "",
          TktKey: "",
          ITM_KEY: "",
          UNIT_KEY: "",
          ITM_QTY: "",
          BARCODE: "",
          RATE: "",
          REMARK: "",
          TktdtlImage: "",
          ImgName: "",
          DBFLAG: ""
        }
      ]
    });
  };

  const getSeriesKey = async () => {
    try {
      const response = await axiosInstance.post("GetSeriesSettings/GetSeriesLastNewKey", {
        MODULENAME: "TrnTkt",
        TBLNAME: "TrnTkt",
        FLDNAME: "TktNo",
        NCOLLEN: 0,
        CPREFIX: "",
        COBR_ID: "02",
        FCYR_KEY: "25",
        TRNSTYPE: "M",
        SERIESID: 186,
        FLAG: "Series"
      });
      if (response.data.STATUS === 0) {
        const fetchedSeriesKey = response.data.DATA[0];
        setSeriesKey(fetchedSeriesKey);
        if (fetchedSeriesKey.CPREFIX) {
          getSeriesData(fetchedSeriesKey.CPREFIX);
        }
      }
    } catch (error) {
      toast.error("Error while fetching.")
    }
  };

  const getSeriesData = async (prefix) => {
    try {
      const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
        MODULENAME: "TrnTkt",
        TBLNAME: "TrnTkt",
        FLDNAME: "TktNo",
        NCOLLEN: 8,
        CPREFIX: prefix,
        COBR_ID: "01",
        FCYR_KEY: "25",
        TRNSTYPE: "M",
        SERIESID: 0,
        FLAG: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setSeriesData(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while loading series.");
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axiosInstance.post('TktCat/GetTktCatDrp', {});
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setCategory(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while fetching category.");
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await axiosInstance.post('TktsubCat/GetTktsubCatDrp', {});
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setSubCat(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while loading subcategory.");
    }
  };

  const fetchService = async () => {
    try {
      const response = await axiosInstance.post('TktService/GetTktServiceDrp', {});
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setServDrp(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching the serverity.");
    }
  };

  const fetchMachineGroup = async () => {
    try {
      const response = await axiosInstance.post("Machinery/GetMachineryGrpDrp", {
        Flag: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setMachineGrp(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching machine group.");
    }
  };

  const fetchMachine = async (groupKey = "") => {
    if (!groupKey) {
      setMachine([]);
      return;
    }

    try {
      const response = await axiosInstance.post('Machinery/GetMachineryDrp', {
        MachineryGroup_Key: groupKey,
        Flag: ""
      });

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setMachine(response.data.DATA);
      } else {
        setMachine([]);
        toast.info("No machines found in this group.");
      }
    } catch (error) {
      toast.error("Failed to load machines.");
      setMachine([]);
    }
  };

  const fetchDeptGroup = async () => {
    try {
      const response = await axiosInstance.post("CCN/GetCCNGrpDrp", {
        Flag: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setDeptGrp(response.data.DATA);
      };
    } catch (error) {
      toast.error("Error while fetching department Group.");
    }
  };

  const fetchDepart = async () => {
    try {
      const response = await axiosInstance.post("CCN/GetCCNDrp", {
        CCGrp_Key: "",
        Flag: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setDept(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while fetching departments.");
    }
  };

  const fetchItem = async () => {
    try {
      const response = await axiosInstance.post("Itm/GetItmDrp", {
        FLAG: "",
        ITM_KEY: "",
        ITMCAT_KEY: "",
        ITMGRP_KEY: "",
        ITMSUBGRP_KEY: ""
      });
      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setItem(response.data.DATA);
      }
    } catch (error) {
      toast.error("Error while fetching Items.");
    }
  };

  const handleTicketChange = (event) => {
    setTicketFor(event.target.value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory) newErrors.subCategory = "Sub Category is required";
    if (!formData.service) newErrors.service = "Service/Complaint is required";

    if (ticketFor === "M") {
      if (!selectedMachGrpKey) newErrors.machGrp = "Machine Group is required";
      if (!formData.machineryKey) newErrors.machine = "Machine is required";
    }

    if (ticketFor === "C") {
      if (!formData.depGrp) newErrors.depGrp = "Cost Group is required";
      if (!formData.department) newErrors.department = "Cost Center/Dept is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      let newTktNo = "TK0001";
      let generatedTktKey = "";

      if (seriesData.length > 0) {
        const last = seriesData[0];

        // Extract numeric part from last.ID (e.g., "TK0123" → 123, "123" → 123)
        const numericPart = (last.ID || "0").replace(/\D/g, "");
        const lastNumber = parseInt(numericPart, 10) || 0;
        const nextNumber = lastNumber;

        // 4-digit padding only
        const paddedNumber = String(nextNumber).padStart(4, "0");

        const prefix = (last.CPREFIX || "TK").toUpperCase();
        generatedTktKey = fcyrKey + cobrId + prefix + paddedNumber;
        newTktNo = prefix + paddedNumber;
      }
      else {
        const prefix = "TK";
        const fallbackNum = "0001";
        generatedTktKey = fcyrKey + cobrId + prefix + fallbackNum;
        newTktNo = prefix + fallbackNum;
      }

      // Handle attachment
      let attachmentData = { TktImage: "", ImgName: "" };
      if (attachments.length > 0) {
        const file = attachments[0];
        const base64String = file.fileData.split(",")[1];
        attachmentData = {
          TktImage: base64String,
          ImgName: file.fileName,
        };
      }

      const ticketData = {
        FCYR_KEY: fcyrKey,
        COBR_ID: cobrId,
        TktKey: generatedTktKey,
        TktNo: newTktNo,
        RaiseBy_ID: 1,
        MobileNo: "",
        RaiseByNm: "",
        TktDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        TktTime: dayjs().format("HH:mm:ss"),
        TktFor: ticketFor,
        Machinery_Key: ticketFor === "M" ? formData.machineryKey : "",
        CCN_Key: ticketFor === "C" ? formData.department : "",
        TktServiceId: 0,
        TktSvrtyId: 1,
        TktTypeId: 1,
        TktTagId: 1,
        TechEmp_Key: "",
        EsclEmp_Key: "",
        FrwdEmp_Key: "",
        TktStatus: "O",
        ReqFlg: "R",
        Reason: formData.description,
        RejDate: dayjs().format("YYYY-MM-DD"),
        AcceptFlg: "N",
        AssignFlg: "N",
        AssignDt: dayjs().format("YYYY-MM-DD"),
        TktDesc: formData.description,
        Status: "1",
        RslvRmrk: "testing Rslv",
        Remark: formData.title,
        CreatedBy: 1,
        TktImage: attachmentData.TktImage,
        ImgName: attachmentData.ImgName,
        trnTktDtlEntities: rowsSecondTable
      };

      console.log('Data to Submit:', ticketData);

      const response = await axiosInstance.post(
        `TrnTkt/InsertTrnTkt?UserName=PC0001&strCobrid=${cobrId}`,
        ticketData
      );

      if (response.data.STATUS === 0) {
        toast.success(response.data.MESSAGE || `Ticket ${newTktNo} created successfully!`);
        setTimeout(() => {
          router.push("/tickets/all-tickets");
        }, 1800);
      } else {
        toast.error(response.data.MESSAGE || "Failed to create ticket.");
      }
    } catch (error) {
      toast.error("Failed to create ticket. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      toast.info("No file selected. Please choose a file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64File = reader.result;
      setAttachments((prev) => [...prev, { fileName: file.name, fileData: base64File }]);
    };

    reader.onerror = () => {
      toast.error("Error reading the file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleHostel = () => {
    setOpenConfirmDialog(true);
  };

  const closeConfirmation = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
      <ToastContainer />
      <Box sx={{ bgcolor: "white", boxShadow: 1, borderBottom: "1px solid #e5e7eb" }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center" py={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={() => router.back()} sx={{ color: "#6b7280" }}>
                <MdArrowBack />
              </IconButton>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#111827">
                  Raise Ticket
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              onClick={() => router.back()}
              sx={{
                bgcolor: "#c73131dc",
                "&:hover": { bgcolor: "#962205ff" },
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Back
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Main Form */}
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}>
          <Box component="form">
            <Box p={{ xs: 2, md: 3 }}>
              {/* <Grid container spacing={1}>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <TextField
                    label={<span>Series<span style={{ color: 'red' }}>*</span></span>}
                    fullWidth
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter ticket title..."
                    sx={{ mb: 2, ...inputStyle }}
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <TextField
                    label={<span>Last No<span style={{ color: 'red' }}>*</span></span>}
                    fullWidth
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter ticket title..."
                    sx={{ mb: 2, ...inputStyle }}
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <TextField
                    label={<span>Ticket No<span style={{ color: 'red' }}>*</span></span>}
                    fullWidth
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter ticket title..."
                    sx={{ mb: 2, ...inputStyle }}
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DatePicker
                      label="Date"
                      value={dateFrom}
                      onChange={(newValue) => setDateFrom(newValue)}
                      format="DD/MM/YYYY"
                      views={['day', 'month', 'year']}
                      fullWidth
                      className="custom-datepicker"
                      disabled={true}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid> */}

              <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                <FormLabel id="demo-row-radio-buttons-group-label" sx={{ marginRight: 2, fontSize: '1rem', color: '#000' }}>
                  Ticket For →
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={ticketFor}
                    onChange={handleTicketChange}
                  >
                    <FormControlLabel
                      value="M"
                      control={<Radio size="small" />}
                      label="Machine"
                    />
                    <FormControlLabel
                      value="C"
                      control={<Radio size="small" />}
                      label="Cost Center/Department"
                    />
                    {/* <FormControlLabel
                      value="S"
                      control={<Radio size="small" />}
                      label="Store Item/Asset"
                    /> */}
                  </RadioGroup>
                </FormControl>
                <Link onClick={handleHostel}
                  sx={{
                    fontSize: '14px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    ml: 'auto',
                    mr: 1
                  }}>
                  Item Recognition
                </Link>
              </Box>

              {ticketFor === "M" && (
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={machinGrp}
                      getOptionLabel={(option) => option.MACHINERYGROUP_NAME || ""}
                      value={machinGrp.find(g => g.MACHINERYGROUP_KEY === selectedMachGrpKey) || null}
                      onChange={(_, value) => {
                        const key = value?.MACHINERYGROUP_KEY || "";
                        setSelectedMachGrpKey(key);
                        setFormData(prev => ({
                          ...prev,
                          machGrp: value?.MACHINERYGROUP_NAME || "",
                          machine: ""
                        }));
                        fetchMachine(key);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<><span>Machine Group</span><span style={{ color: 'red' }}>*</span></>}
                          sx={inputStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={machine}
                      getOptionLabel={(option) => option.MACHINERY_NAME || ""}
                      value={machine.find(m => m.MACHINERY_KEY === formData.machineryKey) || null}
                      onChange={(_, value) => {
                        setFormData(prev => ({
                          ...prev,
                          machine: value?.MACHINERY_NAME || "",
                          machineryKey: value?.MACHINERY_KEY || ""
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<><span>Machine</span><span style={{ color: 'red' }}>*</span></>}
                          sx={inputStyle}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              )}

              {ticketFor === "C" && (
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={deptGrp}
                      getOptionLabel={(option) => option.CCGRP_NAME || ""}
                      value={deptGrp.find(dept => dept.CCGRP_NAME === formData.depGrp) || null}
                      onChange={(_, value) => setFormData(prev => ({ ...prev, depGrp: value?.CCGRP_NAME || "" }))}
                      renderInput={(params) => <TextField {...params} label={<><span>Cost Group</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={dept}
                      getOptionLabel={(option) => option.CCN_NAME || ""}
                      value={dept.find(m => m.CCN_NAME === formData.department) || null}
                      onChange={(_, value) => setFormData(prev => ({ ...prev, department: value?.CCN_NAME || "" }))}
                      renderInput={(params) => <TextField {...params} label={<><span>Cost Center/Dept</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />}
                    />
                  </Grid>
                </Grid>
              )}

              {/* {ticketFor === "S" && (
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                    <Autocomplete
                      options={[]}
                      getOptionLabel={(option) => option.CCGRP_NAME || ""}
                      value={deptGrp.find(dept => dept.CCGRP_NAME === formData.depGrp) || null}
                      onChange={(_, value) => setFormData(prev => ({ ...prev, depGrp: value?.CCGRP_NAME || "" }))}
                      renderInput={(params) => <TextField {...params} label={<><span>Item/Asset/Accessories</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />}
                    />
                  </Grid>
                </Grid>
              )} */}

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={category}
                    getOptionLabel={(option) => option.TKTCATNAME || ""}
                    value={category.find(c => c.TKTCATNAME === formData.category) || null}
                    onChange={(_, value) => setFormData(prev => ({ ...prev, category: value?.TKTCATNAME || "" }))}
                    renderInput={(params) => (
                      <TextField {...params} label={<><span>Category</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={subCat}
                    getOptionLabel={(option) => option.TKTSUBCATNAME || ""}
                    value={subCat.find(p => p.TKTSUBCATNAME === formData.subCategory) || null}
                    onChange={(_, value) => setFormData(prev => ({ ...prev, subCategory: value?.TKTSUBCATNAME || "" }))}
                    renderInput={(params) => (
                      <TextField {...params} label={<><span>SubCategory</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <Autocomplete
                    options={servDrp}
                    getOptionLabel={(option) => option.TKTSERVICENAME || ""}
                    value={servDrp.find(p => p.TKTSERVICENAME === formData.service) || null}
                    onChange={(_, value) => setFormData(prev => ({ ...prev, service: value?.TKTSERVICENAME || "" }))}
                    renderInput={(params) => (
                      <TextField {...params} label={<><span>Service/Complaint</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />
                    )}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Title/Remark"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter ticket remark..."
                sx={{ mb: 2, ...inputStyle }}
              />

              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue or request..."
                sx={{ mb: 2 }}
              />

              {/* Attachments */}
              <Box>
                <Typography fontWeight={500} color="#374151" mb={1}>
                  Attachments
                </Typography>
                <Box
                  sx={{
                    border: "2px dashed #d1d5db",
                    borderRadius: 2,
                    p: 6,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: "#fafafa",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  <MdAttachFile sx={{ fontSize: 48, color: "#9ca3af" }} />
                  <Typography fontWeight={500} color="#6b7280">
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="body2" color="#9ca3af">
                    Maximum file size: 10MB
                  </Typography>
                </Box>

                {attachments.length > 0 && (
                  <Box mt={3}>
                    <Typography variant="subtitle2" fontWeight={500} mb={1}>
                      Attached Files:
                    </Typography>
                    {attachments.map((file, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 2,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          bgcolor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <MdAttachFile fontSize="small" sx={{ color: "#6b7280" }} />
                          <Typography variant="body2">{file.fileName}</Typography>
                        </Stack>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveAttachment(index)}
                          color="error"
                        >
                          <MdClose />
                        </IconButton>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            <Divider />

            <Box sx={{ bgcolor: "#f9fafb", p: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" color="error" onClick={() => router.push("/tickets/ticket-dashboard/")}>
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={loading}
                startIcon={<MdSend />}
                onClick={handleSubmit}
                sx={{ minWidth: 160, bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
              >
                {loading ? "Creating Ticket..." : "Create Ticket"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Dialog
        open={openConfirmDialog}
        onClose={closeConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "100%",
            width: {
              xs: "80%",
              sm: "600px",
              md: "690px",
              lg: "1000px",
              xl: "800px",
            },
            height: "auto",
            padding: {
              xs: "10px",
              sm: "15px",
              md: "20px",
              lg: "20px",
              xl: "20px",
            },
            margin: {
              xs: "20px",
              sm: "40px",
              md: "60px",
              lg: "60px",
              xl: "60px",
            },
            backgroundColor: "white",
            borderRadius: "10px",
            border: "1px solid #ccc",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <Grid>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "transparent",
                overflow: "auto",
                maxHeight: {
                  xs: "50vh",
                  sm: "55vh",
                  md: "60vh",
                  lg: "65vh",
                  xl: "70vh",
                },
                height: {
                  xs: "50vh",
                  sm: "50vh",
                  md: "56vh",
                  lg: "80vh",
                  xl: "65vh",
                },
                margin: {
                  xs: "0px 0px 0px 1px",
                  sm: "0px 0px 0px 2.5px",
                  md: "0px 0px 0px 2.5px",
                  lg: "0px 0px 0px 2.5px",
                  xl: "0px 0px 0px 2.5px",
                },
                padding: {
                  xs: "0px",
                  sm: "0px",
                  md: "0px",
                  lg: "0px",
                  xl: "0px",
                },
                gap: 2,
                maxWidth: {
                  xs: "100%",
                  sm: "90vw",
                  md: "80vw",
                  lg: "70vw",
                  xl: "60vw",
                },
                display: 'flex',
                flexDirection: 'column', // Ensure checkboxes are displayed vertically
                justifyContent: 'space-between', // Align content correctly
              }}
            >

              <div className="p-2 w-full">
                <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>

                  <div style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
                    {isLoading ? (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                      }}>
                        Loading...
                      </div>
                    ) : (
                      <ReusableTable
                        columnDefs={columnDefs}
                        rowData={rows}
                        height="50%"
                        theme="ag-theme-quartz"
                        isDarkMode={false}
                        pagination={true}
                        paginationPageSize={25}
                        paginationPageSizeSelector={[25, 50, 100, 250, 500, 1000]}
                        quickFilter={false}
                        onRowClick={(params) => {
                          console.log('Row clicked:', params);
                        }}
                        onRowDoubleClick={''}
                        onSelectionChanged={handleSelectionChanged}
                        loading={isLoading}
                        enableExport={false}
                        exportSelectedOnly={false}
                        selectedRows={false}
                        enableCheckbox={true}
                        enableResetButton={false}
                        enableExitBackButton={false}
                        enableLanguageSwitch={false}
                        compactMode={true}
                        rowHeight={24}
                        headerHeight={30}
                        className="custom-ag-table"
                        defaultColDef={{
                          resizable: true,
                          sortable: true,
                          filter: true,
                          flex: 1,
                          minWidth: 100
                        }}
                        customGridOptions={{
                          suppressRowClickSelection: true,
                          rowSelection: 'multiple',
                          animateRows: true,
                          enableCellTextSelection: true,
                          ensureDomOrder: true
                        }}
                      />
                    )}
                    <div className="flex flex-wrap gap-4 items-center">
                      <Box sx={{ margin: '10px 16px 0 0' }} width="100%" display="flex" justifyContent="flex-end">
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Back Button */}
                          <Button
                            onClick={handleConfirmButton}
                            variant="outlined"
                            size="small"
                            color="primary"
                            style={{
                              height: '29.5px'
                            }}
                            sx={{ backgroundColor: '#635bff', color: '#fff', '&:hover': { backgroundColor: '#635bff' } }}
                          >
                            Confirm
                          </Button>

                          {/* Exit Button */}
                          <Button
                            onClick={''}
                            variant="outlined"
                            size="small"
                            style={{
                              height: '29.5px'
                            }}
                            sx={{
                              backgroundColor: 'red',
                              color: '#fff',
                              borderColor: 'red',
                              '&:hover': {
                                backgroundColor: '#cc0000',
                                borderColor: '#cc0000',
                              },
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </Box>
                    </div>

                    <ReusableTable
                      columnDefs={columnDefs}
                      rowData={rowsSecondTable}
                      height="50%"
                      theme="ag-theme-quartz"
                      isDarkMode={false}
                      pagination={true}
                      paginationPageSize={25}
                      paginationPageSizeSelector={[25, 50, 100, 250, 500, 1000]}
                      quickFilter={false}
                      onRowClick={(params) => {
                        console.log('Row clicked:', params);
                      }}
                      onRowDoubleClick={''}
                      onSelectionChanged={handleSelectionChanged}
                      loading={isLoading}
                      enableExport={false}
                      exportSelectedOnly={false}
                      selectedRows={false}
                      enableCheckbox={false}
                      enableResetButton={false}
                      enableExitBackButton={false}
                      enableLanguageSwitch={false}
                      compactMode={true}
                      rowHeight={24}
                      headerHeight={30}
                      className="custom-ag-table"
                      defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: true,
                        flex: 1,
                        minWidth: 100
                      }}
                      customGridOptions={{
                        suppressRowClickSelection: true,
                        rowSelection: 'multiple',
                        animateRows: true,
                        enableCellTextSelection: true,
                        ensureDomOrder: true
                      }}
                    />

                    <div className="flex flex-wrap gap-4 items-center">
                      <Box sx={{ margin: '10px 16px 0 0' }} width="100%" display="flex" justifyContent="flex-end">
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Back Button */}
                          <Button
                            onClick={handleSaveButton}
                            variant="outlined"
                            size="small"
                            color="primary"
                            style={{
                              height: '29.5px'
                            }}
                            sx={{ backgroundColor: '#635bff', color: '#fff', '&:hover': { backgroundColor: '#635bff' } }}
                          >
                            Save
                          </Button>

                          {/* Exit Button */}
                          <Button
                            onClick={''}
                            variant="outlined"
                            size="small"
                            style={{
                              height: '29.5px'
                            }}
                            sx={{
                              backgroundColor: 'red',
                              color: '#fff',
                              borderColor: 'red',
                              '&:hover': {
                                backgroundColor: '#cc0000',
                                borderColor: '#cc0000',
                              },
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>

            </Box>
          </Grid>
        </DialogTitle>
      </Dialog>
    </Box>
  );
};

export default CreateTicketPage;