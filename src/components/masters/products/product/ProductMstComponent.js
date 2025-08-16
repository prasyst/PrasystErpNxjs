'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CrudButton from '../../../../GlobalFunction/CrudButton';
import AutoVibe from '../../../../GlobalFunction/CustomAutoComplete/AutoVibe';
import axiosInstance from '../../../../lib/axios';
import EditableTable from '@/atoms/EditTable';

const columns = [
  { label: 'Size', field: 'FGSIZE_NAME', type: 'text' },
  { label: 'Abrv', field: 'FGSIZE_ABRV', type: 'text' },
  { label: 'SizePrint', field: '', type: 'text' },
  { label: 'MRPRD', field: 'MRPRD', type: 'text' },
  { label: 'SSPRD', field: 'SSPRD', type: 'text' },
  { label: 'Status', field: 'STATUS', type: 'checkbox' }
];

const ProductMst = () => {

  const [options, setOptions] = useState([]);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [categories, setCategories] = useState([]);
  const [mode, setMode] = useState('view');
  const [prdGrp, setprdGrp] = useState([]);
  const [unit, setUnit] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState([]);
  const [Tax, setTax] = useState([]);
  const [HSNCODE, setHSNCODE] = useState([]);
  const [brand, setBrand] = useState([]);
  const [currentFGPRD_KEY, setCurrentFGPRD_KEY] = useState(null);
  const router = useRouter();
  // const XYZ = localStorage.getItem('FGPRD_KEY');

  const initialRow = {
    FGSIZE_ID: "",
    FGPRD_KEY: "",
    FGSIZE_NAME: "",
    FGSIZE_ABRV: "",
    STATUS: "1",
    MRPRD: "0",
    SSPRD: "0",
    DBFLAG: ""
  };

  const [form, setForm] = useState([{
    SearchByCd: "",
    BRAND_NAME: "",
    PRODGRP_NAME: "",
    CPREFIX: "",
    FGPRD_KEY: "",
    ID: "",
    LASTID: "",
    FGCAT_KEY: "",
    FGCAT_NAME: "",
    FGPRD_CODE: "",
    FGPRD_NAME: "",
    FGPRD_ABRV: "",
    FGMDW_RATE: "",
    RDOFF: "",
    STATUS: "0",
    CREATED_BY: "",
    CREATED_DT: "",
    TAX_KEY: "",
    TERM_KEY: "",
    EFF_DT: "",
    UNIT_KEY: "",
    UNIT_NAME: "",
    SR_CODE: "",
    FGSUBLOC_KEY: "",
    BRAND_KEY: "",
    FGMUP_RATE: "",
    GEN_UNIQUE_BARCODE: "",
    Excise_appl: "0",
    Excise_Key: "",
    ProdGrp_Key: "",
    Is_Unique: "0",
    HSNCODE_KEY: "",
    HSN_CODE: "",
    QC_REQ: "option2",
    QC_SUBGROUP_KEY: "",
    ISSERVICE: "0",
    DBFLAG: "",
    fgSizeEntities: [initialRow]
  }]);

  // useEffect(() => {
  //   if (XYZ) {
  //     setCurrentFGPRD_KEY(XYZ);
  //     fetchFGPRD_KEYData(XYZ);
  //     setMode('view');
  //   } else {
  //     setMode('add');
  //     setIsFormDisabled(true);
  //   }
  // }, [XYZ]);

  const textInputSx = {
    '& .MuiInputBase-root': {
      height: 30,
      fontSize: '12px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '12px',
      top: '-6px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: 'transparent',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      overflow: 'hidden',
      height: 30,
      fontSize: '12px',
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '15px 12px 1px!important'
    }
  };

  const DropInputSx = {
    '& .MuiInputBase-root': {
      height: 30,
      fontSize: '12px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '12px',
      top: '-6px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: 'transparent',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      overflow: 'hidden',
      height: 30,
      fontSize: '12px',
      paddingRight: '32px', // Space for the icon
    },
    '& .MuiFilledInput-root:before': {
      display: 'none',
    },
    '& .MuiFilledInput-root:after': {
      display: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '6px 12px',
      fontSize: '12px',
      lineHeight: '1.2',
    },
    '& .MuiAutocomplete-endAdornment': {
      top: '50%',
      transform: 'translateY(-50%)',
      right: '8px', // spacing from the right
    },
  };

  const Buttonsx = {
    backgroundColor: '#39ace2',
    margin: { xs: '0 4px', sm: '0 6px' },
    minWidth: { xs: 40, sm: 46, md: 60 },
    height: { xs: 40, sm: 46, md: 27 },
    // "&:disabled": {
    //   backgroundColor: "rgba(0, 0, 0, 0.12)",
    //   color: "rgba(0, 0, 0, 0.26)",
    //   boxShadow: "none",
    // }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: value
      };

      return updatedForm;
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.post("Category/GetFgCatDrp", {});
        const { STATUS, DATA } = response.data;
        if (STATUS === 0 && Array.isArray(DATA)) {
          const validCategories = DATA.filter((cat) => cat.FGCAT_KEY && cat.FGCAT_NAME);
          setCategories(validCategories);
          if (validCategories.length > 0) {
            setForm((prev) => ({ ...prev, CategoryId: validCategories[0].FGCAT_KEY }));
          }
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();

  }, []);

  useEffect(() => {
    const fetchProductGroup = async () => {
      try {
        const response = await axiosInstance.post(`ProdGrp/GetProdGrpDrp`);
        console.log("API response:", response.data.DATA);
        if (
          response.data.STATUS === 0 &&
          response.data.RESPONSESTATUSCODE === 1
        ) {
          setprdGrp(response.data.DATA);
        } else {
          toast.error("Failed to fetch Product Group");
        }
      } catch (error) {
        console.error("Error fetching Product Group", error);
        toast.error("Error fetching Product Group. Please try again.");
      }
    };

    fetchProductGroup();
  }, []);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await axiosInstance.post(`Unit/GetUnitDrp`);
        console.log("API response:", response.data.DATA);
        if (
          response.data.STATUS === 0 &&
          response.data.RESPONSESTATUSCODE === 1
        ) {
          setUnit(response.data.DATA);
        } else {
          toast.error("Failed to fetch Brand");
        }
      } catch (error) {
        console.error("Error fetching Brand", error);
        toast.error("Error fetching Brand. Please try again.");
      }
    };

    fetchUnit();
  }, []);

  useEffect(() => {
    const fetchTax = async () => {
      try {
        const response = await axiosInstance.post(`Tax/GetTaxDrp`);
        console.log("API response:", response.data.DATA);
        if (
          response.data.STATUS === 0 &&
          response.data.RESPONSESTATUSCODE === 1
        ) {
          setTax(response.data.DATA);
        } else {
          toast.error("Failed to fetch Tax");
        }
      } catch (error) {
        console.error("Error fetching Tax", error);
        toast.error("Error fetching Tax. Please try again.");
      }
    };

    fetchTax();
  }, []);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axiosInstance.post(`Brand/GetBrandDrp`);
        console.log("API response:", response.data.DATA);
        if (
          response.data.STATUS === 0 &&
          response.data.RESPONSESTATUSCODE === 1
        ) {
          setBrand(response.data.DATA);
        } else {
          toast.error("Failed to fetch Brand");
        }
      } catch (error) {
        console.error("Error fetching Brand", error);
        toast.error("Error fetching Brand. Please try again.");
      }
    };

    fetchBrand();
  }, []);

  useEffect(() => {
    const fetchHSNCode = async () => {
      try {
        const response = await axiosInstance.post(`Hsncode/GetHSNCODEDrp`);
        console.log("API response:", response.data.DATA);
        if (
          response.data.STATUS === 0 &&
          response.data.RESPONSESTATUSCODE === 1
        ) {
          setHSNCODE(response.data.DATA);
        } else {
          toast.error("Failed to fetch HSNCODE");
        }
      } catch (error) {
        console.error("Error fetching HSNCODE", error);
        toast.error("Error fetching HSNCODE. Please try again.");
      }
    };

    fetchHSNCode();
  }, []);

  const handleAdd = async () => {

    setMode('add');
    setIsFormDisabled(false);
    setForm({
      SearchByCd: "",
      BRAND_NAME: "",
      PRODGRP_NAME: "",
      CPREFIX: "",
      FGPRD_KEY: "",
      ID: "",
      LASTID: "",
      FGCAT_KEY: "",
      FGCAT_NAME: "",
      FGPRD_CODE: "",
      FGPRD_NAME: "",
      FGPRD_ABRV: "",
      FGMDW_RATE: "",
      RDOFF: "option2",
      STATUS: "1",
      CREATED_BY: "",
      CREATED_DT: "",
      TAX_KEY: "",
      TERM_KEY: "",
      EFF_DT: "",
      UNIT_KEY: "",
      UNIT_NAME: "",
      SR_CODE: "",
      FGSUBLOC_KEY: "",
      BRAND_KEY: "",
      FGMUP_RATE: "",
      GEN_UNIQUE_BARCODE: "",
      Excise_appl: "",
      Excise_Key: "",
      ProdGrp_Key: "",
      Is_Unique: "",
      HSNCODE_KEY: "",
      HSN_CODE: "",
      QC_REQ: "option2",
      QC_SUBGROUP_KEY: "",
      ISSERVICE: "",
      DBFLAG: "",
      fgSizeEntities: [initialRow]
    });
    setCurrentFGPRD_KEY(null);

    // let CPREFIX = '';

    // try {
    //     const responseFirst = await axiosInstance.post(`GetSeriesSettings/GetSeriesLastNewKey`, {

    //         MODULENAME: "FGPRD",
    //         TBLNAME: "FGPRD",
    //         FLDNAME: "FGPRD_KEY",
    //         NCOLLEN: 0,
    //         CPREFIX: "",
    //         COBR_ID: COBR_ID,
    //         FCYR_KEY: FCYR_KEY,
    //         TRNSTYPE: "M",
    //         SERIESID: 31,
    //         FLAG: "Series"

    //     });
    //     if (
    //         responseFirst.data.STATUS === 0 &&
    //         responseFirst.data.RESPONSESTATUSCODE === 1
    //     ) {
    //         const cprefix = responseFirst.data.DATA[0]?.CPREFIX || "";

    //         CPREFIX = cprefix;
    //         setSeries(responseFirst.data.DATA);

    //         setForm((prev) => ({
    //             ...prev,
    //             CPREFIX: cprefix
    //         }));

    //     } else {
    //         toast.error("Failed to fetch Series");
    //     }
    // } catch (error) {
    //     console.error("Error fetching Series", error);
    //     toast.error("Error fetching Series. Please try again.");
    // }

    // try {
    //     const responseSecond = await axiosInstance.post(`GetSeriesSettings/GetSeriesLastNewKey`, {

    //         MODULENAME: "FGPRD",
    //         TBLNAME: "FGPRD",
    //         FLDNAME: "FGPRD_KEY",
    //         NCOLLEN: 5,
    //         CPREFIX: CPREFIX,
    //         COBR_ID: COBR_ID,
    //         FCYR_KEY: FCYR_KEY,
    //         TRNSTYPE: "M",
    //         SERIESID: 0,
    //         FLAG: ""

    //     });
    //     if (
    //         responseSecond.data.STATUS === 0 &&
    //         responseSecond.data.RESPONSESTATUSCODE === 1
    //     ) {
    //         setSeriesData(responseSecond.data.DATA);

    //         setForm((prev) => ({
    //             ...prev,
    //             FGPRD_KEY: responseSecond.data.DATA[0]?.ID || "",
    //             LASTID: responseSecond.data.DATA[0]?.LASTID || ""
    //         }));


    //     } else {
    //         toast.error("Failed to fetch Series");
    //     }
    // } catch (error) {
    //     console.error("Error fetching Series", error);
    //     toast.error("Error fetching Series. Please try again.");
    // }

  };

  const handleExit = () => {
    router.push('/masters/products/productTable');
  };

  const handleCellChange = (rowIndex, field, value) => {
    const updatedRows = [...form.fgSizeEntities];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [field]: value,
    };

    // Add a new empty row if editing the last one and it's not completely empty
    const isLastRow = rowIndex === updatedRows.length - 1;
    const rowHasData = Object.values(updatedRows[rowIndex]).some(
      (val) => val !== '' && val !== undefined && val !== '0'
    );

    if (isLastRow && rowHasData) {
      updatedRows.push({});
    }

    setForm((prev) => ({
      ...prev,
      fgSizeEntities: updatedRows,
    }));
  };

  const handleRowClick = (originalIndex) => {
    setSelectedRowIndex((prev) =>
      prev.includes(originalIndex) ? prev.filter((i) => i !== originalIndex) : [...prev, originalIndex]
    );
  };

  const handleDeleteIndex = () => {

    if (selectedRowIndex.length === 0) {
      toast.warning('No rows selected to delete');
      return;
    }

    setForm((prev) => {
      let newData = [...(prev.fgSizeEntities || [])];

      if (mode === 'edit') {
        selectedRowIndex.forEach((index) => {
          if (newData[index]) {
            newData[index] = { ...newData[index], DBFLAG: 'D' };
          }
        });
      } else {
        [...selectedRowIndex].sort((a, b) => b - a).forEach((index) => {
          newData.splice(index, 1);
        });
      }

      toast.success(`${selectedRowIndex.length} row(s) deleted successfully`);

      return { ...prev, fgSizeEntities: newData };
    });

    setSelectedRowIndex([]);
  };

  const visibleData = (form.fgSizeEntities || [])
    .map((row, originalIndex) => ({ ...row, originalIndex }))
    .filter(row => row?.DBFLAG !== 'D');

  const handleChangeStatus = (event) => {
    const { name, checked } = event.target;
    const updatedStatus = checked ? "1" : "0";

    setForm(prevForm => ({
      ...prevForm,
      [name]: updatedStatus
    }));
  };

  const handleEdit = () => {
    setMode("edit");
    setIsFormDisabled(false);
  };

  const handlePrint = () => { };

  return (
    <Box
      sx={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: { xs: '16px', sm: '20px', md: '24px' },
        boxSizing: 'border-box',
        bottom: 0,
        backgroundColor: 'rgb(236, 238, 240)',
        minHeight: '100vh',
        minWidth: '84vw',
        display: 'flex',
        overflow: 'hidden !important'
      }}

    >
      <ToastContainer />
      <Box
        sx={{
          width: { xs: '100%', sm: '100%', md: '100%', lg: '90%', xl: '90%' },
          maxWidth: { xs: '100%', sm: '90%', md: '1000px', lg: '1400px', xl: '1800px' },
          height: { xs: 'auto', sm: 'auto', md: '570px', lg: '600px', xl: '620px' },
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
          paddingBottom: '140px',
          // margin: 'auto !important',
          borderRadius: '8px',
          padding: '0px 20px 20px 20px',
          backgroundColor: '#fff'
        }}

      >
        <Grid container alignItems="center"
          justifyContent="space-between" spacing={2} sx={{
            marginTop: { xs: '10px', sm: '10px', md: '10px', lg: '10px', xl: '10px' },
            marginInline: { xs: '20px', sm: '20px', md: '20px', lg: '20px', xl: '20px' }
          }}>
          <Grid sx={{ display: 'flex' }}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" size="small"
                sx={Buttonsx}
                onClick={''}
                disabled={''}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              <Button variant="contained" size="small"
                sx={Buttonsx}
                onClick={''}
                disabled={''}
              >
                <NavigateNextIcon />
              </Button>
            </Stack>
          </Grid>
          <Grid sx={{ flexGrow: 1 }}>
            <Typography align="center" variant="h6">
              Product Master
            </Typography>
          </Grid>
          <Grid>
            <Stack direction="row" spacing={1}>
              <CrudButton
                mode={mode}
                moduleName="Product Master"
                onAdd={handleAdd}
                onEdit={handleEdit}
                onView={handlePrint}
                onDelete={''}
                onExit={handleExit}
                readOnlyMode={isFormDisabled}
              />
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1.5, sm: 1.5, md: 0.7 },
            marginInline: { xs: '5%', sm: '5%', md: '15%' },
            marginTop: { xs: '15px', sm: '20px', md: '10px' },
          }}

        >
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <TextField
              placeholder="Search By Code"
              variant="filled"
              sx={{
                width: { xs: '100%', sm: '50%', md: '30%' }, marginBottom: '1px',
                backgroundColor: '#e0f7fa',
                '& .MuiInputBase-input': {
                  padding: { xs: '8px 0px', md: '2px 0px' },
                },
                '& .css-voecp4-MuiInputBase-input-MuiFilledInput-input': {
                  fontSize: '14px',
                },
              }}
              value={form.SearchByCd}
              onChange={(e) => setForm({ ...form, SearchByCd: e.target.value })}
              onKeyPress={''}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'row' },
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 1, md: 2 },
            }}
          >
            <TextField
              label="Series"
              disabled={isFormDisabled}
              variant="filled"
              fullWidth
              value={form.CPREFIX || ""}
              onChange={(e) => handleManualSeriesChange(e.target.value)}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <TextField
              label="Last Code"
              variant="filled"
              fullWidth
              onChange={(e) => setForm({ ...form, LASTID: e.target.value })}
              name="LASTID"
              value={form.LASTID || ""}
              disabled={true}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <TextField
              label="Code"
              variant="filled"
              fullWidth
              name="FGPRD_KEY"
              value={form.FGPRD_KEY || ""}
              onChange={(e) => setForm({ ...form, FGPRD_KEY: e.target.value })}
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 2 },
          }}>
            <AutoVibe
              id="FGCAT_KEY"
              disabled={isFormDisabled}
              options={categories}
              getOptionLabel={(option) => option.FGCAT_NAME || ""}
              label="Category"
              name="FGCAT_KEY"
              value={categories.find(option => String(option.FGCAT_KEY) === String(form.FGCAT_KEY)) || null}
              onChange={(e, newValue) => {
                const selectedName = newValue ? newValue.FGCAT_NAME : '';
                const selectedId = newValue ? newValue.FGCAT_KEY : '';

                setForm((prevForm) => {
                  const updatedForm = {
                    ...prevForm,
                    FGCAT_NAME: selectedName,
                    FGCAT_KEY: selectedId
                  };

                  if (selectedName && prevForm.FGPRD_ABRV) {
                    updatedForm.FGPRD_NAME = selectedName + prevForm.FGPRD_ABRV;
                  }

                  return updatedForm;
                });
              }}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <AutoVibe
              id="PRODGRP_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option.PRODGRP_NAME || ''}
              options={prdGrp}
              label="ProductGroup"
              name="PRODGRP_KEY"
              value={prdGrp.find(option => option.PRODGRP_KEY === form.PRODGRP_NAME) || null}
              onChange={(e, newValue) => {
                setForm((prevForm) => ({
                  ...prevForm,
                  PRODGRP_NAME: newValue ? newValue.PRODGRP_KEY : '',
                }));
              }}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 2 },
            width: { xs: '100%', sm: '48%', md: '100%' },
          }}>
            <TextField
              label={
                <span>
                  Name <span style={{ color: 'red' }}>*</span>
                </span>
              }
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={form.FGPRD_ABRV || ""}
              name="FGPRD_ABRV"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '100%' },
              }}
            >
              <TextField
                label="PrdSeries"
                variant="filled"
                fullWidth
                onChange={handleInputChange}
                value={form.SR_CODE || ""}
                disabled={isFormDisabled}
                name="SR_CODE"
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
              <AutoVibe
                id="UNIT_KEY"
                disabled={isFormDisabled}
                getOptionLabel={(option) => option.UNIT_NAME || ''}
                options={unit}
                label="Unit"
                name="UNIT_KEY"
                value={unit.find(option => option.UNIT_KEY === form.UNIT_NAME) || null}
                onChange={(e, newValue) => {
                  setForm((prevForm) => ({
                    ...prevForm,
                    UNIT_NAME: newValue ? newValue.UNIT_KEY : '',
                  }));
                }}
                sx={DropInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1.5, md: 2 },
            width: { xs: '100%', sm: '48%', md: '100%' },
          }}>
            <TextField
              label="Description"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={form.FGPRD_NAME || ""}
              disabled={isFormDisabled}
              name="FGPRD_NAME"
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '100%' },
              }}
            >
              <TextField
                label="Mark UP Rt %"
                variant="filled"
                fullWidth
                onChange={handleInputChange}
                value={form.FGMUP_RATE || ""}
                disabled={isFormDisabled}
                name="FGMUP_RATE"
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
              <TextField
                label="Mark.Dn Pur%"
                variant="filled"
                fullWidth
                name=""
                value={""}
                onChange={handleInputChange}
                disabled={isFormDisabled}
                sx={textInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1.5, md: 2 },
            width: { xs: '100%', sm: '48%', md: '119.5%' }
          }}>
            <TextField
              label="Mark Down Rt %"
              variant="filled"
              fullWidth
              onChange={handleInputChange}
              value={form.FGMDW_RATE || ""}
              name="FGMDW_RATE"
              disabled={isFormDisabled}
              sx={textInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '140%' },
              }}
            >
              <FormLabel sx={{ margin: '7px 14px 0px 10px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Round Off</FormLabel>
              <RadioGroup
                row
                name="RDOFF"
                onChange={handleInputChange}
                disabled={isFormDisabled}
                value={form.RDOFF || ""}
              >
                <FormControlLabel disabled={isFormDisabled}
                  value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px' }}>None</Typography>} />
                <FormControlLabel disabled={isFormDisabled}
                  value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px' }}>Nearest Re</Typography>} />
                <FormControlLabel disabled={isFormDisabled}
                  value="option3" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px' }}>Rs. 5</Typography>} />
                <FormControlLabel disabled={isFormDisabled}
                  value="option4" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                  label={<Typography sx={{ fontSize: '12px' }}>Rs. 10</Typography>} />
              </RadioGroup>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 2 },
          }}>
            <AutoVibe
              id="TAX_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option.TAX_NAME || ""}
              options={Tax}
              label="Tax"
              name="TAX_KEY"
              value={Tax.find(option => option.TAX_KEY === form.TAX_NAME) || null}
              onChange={(e, newValue) => {
                setForm((prevForm) => ({
                  ...prevForm,
                  TAX_NAME: newValue ? newValue.TAX_KEY : '',
                }));
              }}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <AutoVibe
              id="BRAND_KEY"
              disabled={isFormDisabled}
              getOptionLabel={(option) => option.BRAND_NAME || ''}
              options={brand}
              label="Brand"
              name="BRAND_KEY"
              value={brand.find(option => option.BRAND_KEY === form.BRAND_NAME) || null}
              onChange={(e, newValue) => {
                setForm((prevForm) => ({
                  ...prevForm,
                  BRAND_NAME: newValue ? newValue.BRAND_KEY : '',
                }));
              }}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 2 },
            width: { xs: '100%', sm: '48%', md: '100%' },
          }}>
            <AutoVibe
              id=""
              disabled={isFormDisabled || form.Excise_KEY !== "1"}
              options={options || []}
              getOptionLabel={(option) => option}
              label="Excise Tariff"
              name=""
              value={''}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <AutoVibe
              id=""
              disabled={isFormDisabled || form.Excise_appl !== "1"}
              getOptionLabel={(option) => option || ''}
              options={[]}
              label="Excise"
              name=""
              value={''}
              onChange={handleInputChange}
              sx={DropInputSx}
              inputProps={{
                style: {
                  padding: '6px 8px',
                  fontSize: '12px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '209%' },
              }}
            >
              <AutoVibe
                id="HSNCODE_KEY"
                disabled={isFormDisabled}
                getOptionLabel={(option) => option.HSN_CODE || ''}
                options={HSNCODE}
                label="HSN Code"
                name="HSNCODE_KEY"
                value={HSNCODE.find(option => option.HSNCODE_KEY === form.HSN_CODE) || null}
                onChange={(e, newValue) => {
                  setForm((prevForm) => ({
                    ...prevForm,
                    HSN_CODE: newValue ? newValue.HSNCODE_KEY : '',
                  }));
                }}
                sx={DropInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1.5, md: 2 },
            width: { xs: '100%', sm: '48%', md: '100%' }
          }}>
            <FormLabel sx={{ marginTop: '7px', fontSize: '12px', fontWeight: 'bold', color: 'black' }} component="legend">Qc Req</FormLabel>
            <RadioGroup
              row
              name="QC_REQ"
              onChange={handleInputChange}
              disabled={isFormDisabled}
              value={form.QC_REQ || "N"}
              sx={{ position: 'relative', right: 110 }}
            >
              <FormControlLabel disabled={isFormDisabled}
                value="option1" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>Yes</Typography>} />
              <FormControlLabel disabled={isFormDisabled}
                value="option2" control={<Radio sx={{ transform: 'scale(0.6)', padding: '2px' }} />}
                label={<Typography sx={{ fontSize: '12px' }}>No</Typography>} />
            </RadioGroup>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                gap: 1,
                width: { xs: '100%', sm: '48%', md: '49%' },
              }}
            >
              <AutoVibe
                id=""
                disabled={isFormDisabled || form.QC_REQ === 'option2'}
                getOptionLabel={(option) => option || ''}
                options={[]}
                label="Qc SubGroup"
                name=""
                value={''}
                onChange={handleInputChange}
                sx={DropInputSx}
                inputProps={{
                  style: {
                    padding: '6px 8px',
                    fontSize: '12px',
                  },
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row', md: 'row' },
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 1, md: 1 },
              marginTop: '0px'
            }}
          >
            <EditableTable
              data={visibleData}
              columns={columns}
              onCellChange={handleCellChange}
              disabled={isFormDisabled}
              selectedRowIndex={selectedRowIndex}
              onRowClick={handleRowClick}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', md: 'column' },
                justifyContent: 'flex-start',
                marginTop: '14px',
                gap: { xs: 1, sm: 1, md: 1 },
              }}
            >
              <TextField
                type="date"
                label={
                  <span>
                    Eff Date <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                variant="filled"
                fullWidth
                onChange={handleInputChange}
                disabled={isFormDisabled}
                value={form.EFF_DT || ""}
                name="EFF_DT"
                sx={textInputSx}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button variant="contained" color="primary" sx={{
                paddingBlock: '4px', paddingInline: '0px', fontSize: '10px', whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}>Mandatory Acc In Bom</Button>
              <Button variant="contained" color="primary" sx={{ paddingBlock: '4px', paddingInline: '0px', fontSize: '10px' }}>Allocate Type</Button>
              <Button variant="contained" color="primary"
                onClick={handleDeleteIndex}
                disabled={selectedRowIndex === null || isFormDisabled}
                sx={{
                  paddingBlock: '4px',
                  paddingInline: '0px',
                  fontSize: '10px'
                }}>
                Del Size
              </Button>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', md: 'row' },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 1, md: 1 },
            // paddingBottom: '60px',
          }}>
            <Box>
              <FormControlLabel
                control={<Checkbox name="ISSERVICE" size="small" checked={form.ISSERVICE === "1"}
                  onChange={handleChangeStatus} />}
                disabled={isFormDisabled}
                label="Is Service"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '12px' }
                }}
              />
              <FormControlLabel
                control={<Checkbox name="Excise_appl" size="small" checked={form.Excise_appl === "1"}
                  onChange={handleChangeStatus} />}
                disabled={isFormDisabled}
                label="Excise Appl"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '12px' }
                }}
              />
              <FormControlLabel
                control={<Checkbox name="Is_Unique" size="small" checked={form.Is_Unique === "1"}
                  onChange={handleChangeStatus} />}
                disabled={isFormDisabled}
                label="Is Unique"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '12px' }
                }}
              />
              <FormControlLabel
                control={<Checkbox name="STATUS" size="small" checked={form.STATUS === "1"}
                  onChange={handleChangeStatus} />}
                disabled={isFormDisabled}
                label="Active"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '12px' }
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: '',
                gap: 1,
                marginTop: '10px',
                position: 'relative',
                left: 140
              }}>
              {mode === 'view' && (
                <>

                  <Button variant="contained"
                    sx={{ background: "#A8E2C5", height: '30px', fontSize: '12px' }}
                    onClick={handleInputChange}
                  >
                    Submit
                  </Button>
                  <Button variant="contained"
                    sx={{ background: "#BFBFBF", height: '30px', fontSize: '12px' }}
                    onClick={handleInputChange}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {(mode === 'edit' || mode === 'add') && (
                <>
                  <Button variant="contained"
                    sx={{ background: "#A8E2C5", height: '30px', fontSize: '12px' }}
                    onClick={handleInputChange}
                  >
                    Submit
                  </Button>
                  <Button variant="contained"
                    sx={{ background: "#BFBFBF", height: '30px', fontSize: '12px' }}
                    onClick={handleInputChange}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Box>

        </Box>

      </Box>
    </Box>
  )
}

export default ProductMst;