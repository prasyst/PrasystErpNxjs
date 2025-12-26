"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Box, Button, TextField, FormControl, Typography, Paper, Divider, Container,
  Grid, Stack, IconButton, Autocomplete, FormLabel, RadioGroup, FormControlLabel, Radio, Link,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as MdArrowBack,
  QrCodeScanner as MdQrCodeScanner,
  QrCode2 as MdQrCode,
  AttachFile as MdAttachFile,
  Close as MdClose,
  Send as MdSend,
} from "@mui/icons-material";
import dayjs from 'dayjs';
import axiosInstance from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";
import { inputStyle } from "../../../../public/styles/inputStyles";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomDialog from "../raiseTicket/ZoomDialog";
import ItemRequisitionDialog from "../raiseTicket/ItemRequisitiondlog";

const CreateTicketPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const TKTKEY = searchParams.get('TKTKEY');
  const [mode, setMode] = useState('add');
  const [TktKey, setTktKey] = useState("");
  const [TktNo, setTktNo] = useState("");
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
    TktImage: "",
    ImgName: "",
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
  const [category, setCategory] = useState([]);
  const [subCat, setSubCat] = useState([]);
  const [servDrp, setServDrp] = useState([]);
  const [machinGrp, setMachineGrp] = useState([]);
  const [selectedMachGrpKey, setSelectedMachGrpKey] = useState("");
  const [machineDrp, setMachineDrp] = useState([]);
  const [deptGrp, setDeptGrp] = useState([]);
  const [dept, setDept] = useState([]);
  const [ticketFor, setTicketFor] = useState("C");
  const [seriesKey, setSeriesKey] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [cobrId, setCobrId] = useState(null);
  const [fcyrKey, setFcyrKey] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rowsSecondTable, setRowsSecondTable] = useState([]);
  const fileInputRef = useRef(null);
  const [isItemRequisitionEnabled, setIsItemRequisitionEnabled] = useState(false);
  const USER_NAME = 0;
  const USER_ID = localStorage.getItem("USER_ID");
  const EMP_KEY = localStorage.getItem("EMP_KEY");
  const EMP_NAME = localStorage.getItem("EMP_NAME");
  const [selectedImage, setselectedImage] = useState("");
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomSrc, setZoomSrc] = useState('');
  const [userName,setUserName]=useState()

  useEffect(() => {
      const storedName = localStorage.getItem('EMP_NAME') || localStorage.getItem('USER_NAME');
      const storedRole = localStorage.getItem('userRole');
      if (storedName) {
        const name=storedName.length>3 ? storedName.substring(0,11) + '..' :storedName
        setUserName(name);
      }
    }, []);
  useEffect(() => {
    setIsItemRequisitionEnabled(validateForm());
  }, [formData, ticketFor]);
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
    fetchMachineGroup();
    fetchMachine();
    fetchDeptGroup();
    fetchDepart();
    getSeriesKey();
    getSeriesData();
  }, [cobrId, fcyrKey])
  const handleSaveButton = () => {
    handleSubmit();
    setOpenConfirmDialog(false);
  };
  const handleItemsSave = (selectedItemsWithQty) => {
    setRowsSecondTable(selectedItemsWithQty);
    toast.success(`${selectedItemsWithQty.length} item(s) added to ticket.`);
  };
  const fetchRetriveData = async (ticketKey) => {
    try {
      const response = await axiosInstance.post(
        'TrnTkt/RetriveTrnTkt',
        {
          FLAG: "R",
          TBLNAME: "TrnTkt",
          FLDNAME: "TktKey",
          ID: ticketKey,
          ORDERBYFLD: "",
          CWHAER: "",
          CO_ID: ""
        },
      );
      if (response.data.STATUS === 0 && response.data.DATA) {
        const ticket = response.data.DATA.trnTktDtlList[0];
        const ticketImage = ticket.TktImage || '';
        setFormData(prevState => ({
          ...prevState,
          title: ticket.TktDesc,
          description: ticket.Remark,
          category: {
            TKTCATID: ticket.TktCatId,
            TKTCATNAME: ticket.TktCatName
          },
          subCategory: {
            TKTSUBCATID: ticket.TktSubCatId,
            TKTSUBCATNAME: ticket.TktSubCatName
          },
          priority: ticket.TktSvrtyName,
          machGrp: ticket.MachineryGroup_Name || "",
          machineryKey: ticket.Machinery_Key || "",
          machine: ticket.Machinery_Name || "",
          service: {
            TKTSERVICEID: ticket.TktServiceId,
            TKTSERVICENAME: ticket.TktServiceName
          },
          depGrp: ticket.CCGrp_Name || "",
          department: ticket.CCN_Key || "",
          dueDate: dayjs(ticket.TktDate).format("YYYY-MM-DD"),
          tags: [],
          TktImage: ticketImage,
          trnTktDtlEntities: ticket.trnTktDtlEntities || []
        }));
        // Set machine group key for dropdown
        if (ticket.TktFor === "M") {
          setSelectedMachGrpKey(ticket.MachineryGroup_Key || "");
        }
        if (ticket.TktFor === "C") {
          setSelectedMachGrpKey("");
          setMachineDrp([]);
        }

        setMode('retrieve');
        setTicketFor(ticket.TktFor);
        setTktKey(ticket.TktKey);
        setTktNo(ticket.TktNo);
        setSelectedMachGrpKey(ticket.MachineryGroup_Key);
      } else {
        console.error('Failed to retrieve ticket data:', response.data.MESSAGE);
      }
    } catch (error) {
      console.error('Error fetching ticket data:', error);
    }
  };
  useEffect(() => {
    if (TKTKEY) {
      fetchRetriveData(TKTKEY);
    }
  }, [TKTKEY]);
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
  useEffect(() => {
    if (formData.category?.TKTCATID) {
      const categoryId = formData.category.TKTCATID;
      const fetchSubCategories = async () => {
        try {
          const response = await axiosInstance.post('TktsubCat/GetTktCatWiseSubCatDrp', {
            "TktCatId": categoryId,
          });
          if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
            setSubCat(response.data.DATA);
          }
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubCategories();
    }
  }, [formData.category]);
  useEffect(() => {
    if (formData.subCategory?.TKTSUBCATID) {
      const subCategoryId = formData.subCategory.TKTSUBCATID;
      const fetchServices = async () => {
        try {
          const response = await axiosInstance.post('TktService/GetSubCatWiseTktServiceDrp', {
            "TktSubCatId": subCategoryId,
          });
          if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
            setServDrp(response.data.DATA);
          } else {
            setServDrp([]);
            toast.info("No services found for the selected subcategory.");
          }
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      };
      fetchServices();
    } else {
      console.log("No subCategoryId found in formData.subCategory.");
    }
  }, [formData.subCategory]);
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
      setMachineDrp([]);
      return;
    }
    try {
      const response = await axiosInstance.post('Machinery/GetMachineryDrp', {
        MachineryGroup_Key: groupKey,
        Flag: ""
      });

      if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
        setMachineDrp(response.data.DATA);
      } else {
        setMachineDrp([]);
        toast.info("No machines found in this group.");
      }
    } catch (error) {
      console.error("Failed to load machines.");
      setMachineDrp([]);
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
      const isUpdate = !!TKTKEY;
      let generatedTktKey = "";
      if (isUpdate) {
        generatedTktKey = TktKey;
        newTktNo = TktNo;
      } else {
        if (seriesData.length > 0) {
          const last = seriesData[0];
          const numericPart = (last.ID || "0").replace(/\D/g, "");
          const lastNumber = parseInt(numericPart, 10) || 0;
          const nextNumber = lastNumber;
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
      }
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
        RaiseBy_ID: USER_ID || EMP_KEY,
        MobileNo: "",
        RaiseByNm: USER_NAME || EMP_NAME,
        TktDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        TktTime: dayjs().format("HH:mm:ss"),
        TktFor: ticketFor,
        Machinery_Key: ticketFor === "M" ? formData.machineryKey : "",
        CCN_Key: ticketFor === "C" ? formData.department : "",
        TktServiceId: formData.service?.TKTSERVICEID,
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
        TktImage: formData.TktImage,
        ImgName: formData.ImgName,
        trnTktDtlEntities: rowsSecondTable
      };
      if (isUpdate) {
        ticketData.UpdatedBy = 0;
      } else {
        ticketData.CreatedBy = 0
      }
      const apiUrl = isUpdate
        ? `TrnTkt/UpdateTrnTkt?UserName=${userName}&strCobrid=${cobrId}`
        : `TrnTkt/InsertTrnTkt?UserName=${userName}&strCobrid=${cobrId}`;
      const response = await axiosInstance.post(apiUrl, ticketData);
      if (response.data.STATUS === 0) {
        toast.success(
          isUpdate
            ? `Ticket ${newTktNo} updated successfully!`
            : `Ticket ${newTktNo} created successfully!`
        );
        setTimeout(() => {
          router.push("/emp-tickets/all-tickets");
        }, 1500);
      } else {
        toast.error(response.data.MESSAGE || "Failed to save ticket.");
      }
    } catch (error) {
      console.error("Failed to create ticket. Check console.");
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, GIF)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const fileName = file.name;

      setFormData((prev) => ({
        ...prev,
        TktImage: base64String,
        ImgName: fileName,
      }));
      setselectedImage(base64String);
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
      <ToastContainer />
      <Box sx={{ bgcolor: "white", boxShadow: 1, borderBottom: "1px solid #e5e7eb" }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center" py={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={() => router.push("/emp-tickets/ticket-dashboard/")} sx={{ color: "#6b7280" }}>
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
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper elevation={2} sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}>
          <Box component="form">
            <Box p={{ xs: 2, md: 3 }}>
              <Box display="flex" alignItems="center" sx={{
                mb: 1,
                flexDirection: { xs: 'column', md: 'row' },
              }}>
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
                  </RadioGroup>
                </FormControl>
                <Button
                  onClick={() => setOpenConfirmDialog(true)}
                  sx={{
                    fontSize: '14px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    ml: 'auto',
                    mr: 1,
                    pointerEvents: isItemRequisitionEnabled ? "auto" : "none",
                    color: isItemRequisitionEnabled ? "#fff" : "#aaa",
                    bgcolor: isItemRequisitionEnabled ? "#635bff" : "#d1d5db",
                    "&:hover": {
                      bgcolor: isItemRequisitionEnabled ? "#1d4ed8" : "#d1d5db",
                    },
                    transition: "background-color 0.3s",
                  }}>
                  Item Requisition
                </Button>
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
                          machine: "",
                          machineryKey: "",
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
                      options={machineDrp}
                      getOptionLabel={(option) => option.MACHINERY_NAME || ""}
                      value={
                        machineDrp.find(m => m.MACHINERY_KEY === formData.machineryKey) ||
                        (formData.machineryKey
                          ? { MACHINERY_KEY: formData.machineryKey, MACHINERY_NAME: formData.machine || "Unknown Machine" }
                          : null
                        )
                      }
                      onChange={(_, value) => {
                        setFormData(prev => ({
                          ...prev,
                          machine: value?.MACHINERY_NAME || "",
                          machineryKey: value?.MACHINERY_KEY || "",
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
                      onChange={(_, value) => {
                        setFormData(prev => ({ ...prev, depGrp: value?.CCGRP_NAME || "" }))
                      }}
                      renderInput={(params) => <TextField {...params} label={<><span>Cost Group</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={dept}
                      getOptionLabel={(option) => option.CCN_NAME || ""}
                      value={dept.find(m => m.CCN_KEY === formData.department) || null}
                      onChange={(_, value) => {
                        setFormData(prev => ({ ...prev, department: value?.CCN_KEY || "" }))
                      }}
                      renderInput={(params) => <TextField {...params} label={<><span>Cost Center/Dept</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />}
                    />
                  </Grid>
                </Grid>
              )}
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={category}
                    getOptionLabel={(option) => option.TKTCATNAME || ""}
                    value={category.find(c => c.TKTCATID === formData.category?.TKTCATID) || null}
                    onChange={(_, value) => {
                      setFormData(prev => ({ ...prev, category: value || {} }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={<><span>Category</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={subCat}
                    getOptionLabel={(option) => option.TKTSUBCATNAME || ""}
                    value={subCat.find(p => p.TKTSUBCATID === formData.subCategory?.TKTSUBCATID) || null}
                    onChange={(_, value) => {

                      setFormData(prev => ({
                        ...prev,
                        subCategory: value || {}
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<><span>SubCategory</span><span style={{ color: 'red' }}>*</span></>}
                        sx={inputStyle}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <Autocomplete
                    options={servDrp}
                    getOptionLabel={(option) => option.TKTSERVICENAME || ""}
                    value={servDrp.find(p => p.TKTSERVICEID === formData.service?.TKTSERVICEID) || null}
                    onChange={(_, value) => setFormData(prev => ({ ...prev, service: value || {} }))}
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
              <Grid
                container
                spacing={1}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}
              >
                <Grid item xs={12} md={6} sx={{
                  position: 'relative',
                  width: { xs: '100%', md: '50%' },
                  height: 130,
                  borderRadius: 2,
                  border: formData.TktImage ? '2px solid #635bff' : '2px dashed #635bff',
                  bgcolor: '#fafafa',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all .2s',
                  '&:hover': { borderColor: '#ccc' },
                }}>
                  {formData.TktImage ? (
                    <img
                      src={formData.TktImage}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'all .2s',
                      }}
                      onClick={() => {
                        setZoomSrc(formData.TktImage);
                        setZoomOpen(true);
                      }}
                    />
                  ) : (
                    <Box sx={{ textAlign: 'center', padding: 2 }}>
                      <MdAttachFile sx={{ fontSize: 28, color: "#9ca3af" }} />
                      <Typography fontWeight={500} color="#6b7280">
                        Click to upload or drag and drop
                      </Typography>
                    </Box>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />

                  {formData.TktImage && (
                    <Tooltip title="Remove Image" arrow>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((p) => ({ ...p, TktImage: '', ImgName: '' }));
                          setselectedImage('');
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          bgcolor: 'background.paper',
                          boxShadow: 2,
                          '&:hover': { bgcolor: 'error.light', color: '#fff' },
                        }}
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {formData.TktImage && (
                    <Tooltip title="Zoom Image" arrow>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomSrc(formData.TktImage);
                          setZoomOpen(true);
                        }}
                        sx={{
                          position: 'absolute',
                          bottom: 1,
                          right: -1,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          '&:hover': { bgcolor: 'primary.main' },
                        }}
                      >
                        <ZoomInIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>


                <Grid item xs={12} md={6} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: '8px',
                }}>
                  {formData.TktImage && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        wordBreak: 'break-word',
                        textAlign: 'left',
                        margin: 0, 
                        width: '100%', 
                      }}
                    >
                      {formData.ImgName || 'Image path not available'}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box sx={{ bgcolor: "#f9fafb", p: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="contained"
                disabled={loading}
                startIcon={<MdSend />}
                onClick={handleSubmit}
                sx={{ minWidth: 110, bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
              <Button variant="outlined" color="error" onClick={() => router.push("/emp-tickets/all-tickets/")}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <ItemRequisitionDialog
        isLoading={isLoading}
        inputStyle={inputStyle}
        seriesData={seriesData}
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onSave={handleItemsSave}
        formData={formData}
        ticketFor={ticketFor}
        selectedMachGrpKey={selectedMachGrpKey}
        cobrId={cobrId}
        fcyrKey={fcyrKey}
        tktNo={TktNo}
        userId={USER_ID}
        userName={USER_NAME}
        empKey={EMP_KEY}
        empName={EMP_NAME}
        attachments={attachments}
        rowsSecondTable={rowsSecondTable}
        trnTktDtlEntities={formData.trnTktDtlEntities}
        onTicketCreated={() => {
          router.push("/tickets/all-tickets");
        }}
        onTicketUpdated={() => {
          if (TKTKEY) {
            fetchRetriveData(TKTKEY);
          }
        }}
      />
      <ZoomDialog
        zoomOpen={zoomOpen}
        setZoomOpen={setZoomOpen}
        zoomSrc={zoomSrc}
      />
    </Box>
  );
};
export default CreateTicketPage;