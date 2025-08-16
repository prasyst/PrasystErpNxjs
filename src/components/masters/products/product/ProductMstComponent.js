'use client';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
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
import z from 'zod';

const columns = [
  { label: 'Size', field: 'FGSIZE_NAME', type: 'text' },
  { label: 'Abrv', field: 'FGSIZE_ABRV', type: 'text' },
  { label: 'SizePrint', field: '', type: 'text' },
  { label: 'MRPRD', field: 'MRPRD', type: 'text' },
  { label: 'SSPRD', field: 'SSPRD', type: 'text' },
  { label: 'Status', field: 'STATUS', type: 'checkbox' }
];

const FORM_MODE = getFormMode();
const productFormSchema = z.object({
  FGPRD_ABRV: z.string().min(1, "Name is required"),
});

const ProductMst = () => {
  const router = useRouter();

  const [options, setOptions] = useState([]);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [series, setSeries] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mode, setMode] = useState('view');
  const [prdGrp, setprdGrp] = useState([]);
  const [unit, setUnit] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState([]);
  const [Tax, setTax] = useState([]);
  const [HSNCODE, setHSNCODE] = useState([]);
  const [brand, setBrand] = useState([]);
  // const [UserLoginId, setUserLoginId] = useState(sessionStorage.getItem('UserId'));
  const [currentFGPRD_KEY, setCurrentFGPRD_KEY] = useState(null);
  const searchParams = useSearchParams();
  const FG = searchParams.get('FGPRD_KEY');
  const FCYR_KEY = localStorage.getItem('FCYR_KEY');
  const COBR_ID = localStorage.getItem('COBR_ID');
  const CO_ID = localStorage.getItem('CO_ID');

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

      if (name === "FGPRD_ABRV" && prev.FGCAT_NAME && value) {
        updatedForm.FGPRD_NAME = (prev.FGCAT_NAME || '') + value;
      }

      return updatedForm;
    });
  };

  const fetchProductData = useCallback(async (currentFGPRD_KEY, flag = "R") => {

    try {
      const response = await axiosInstance.post(`Product/RetriveFgprd`, {
        "FLAG": flag,
        "TBLNAME": "FGPRD",
        "FLDNAME": "FGPRD_KEY",
        "ID": currentFGPRD_KEY,
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": CO_ID
      });

      if (response.data.STATUS === 0 && response.data.RESPONSESTATUSCODE === 1) {
        const productData = response?.data?.DATA?.FGprdList[0];

        setForm({
          DBFLAG: mode === 'retrieve' ? 'R' : mode === 'edit' ? 'U' : '',
          // CPREFIX: productData?.CPREFIX || "",
          FGPRD_KEY: productData?.FGPRD_KEY || "",
          // ID: productData?.ID || "",
          // LASTID: productData?.LASTID || "",
          FGCAT_KEY: productData?.FGCAT_KEY || "",
          FGCAT_NAME: productData?.FGCAT_NAME || "",
          FGPRD_CODE: productData?.FGPRD_CODE || "",
          FGPRD_NAME: productData?.FGPRD_NAME || "",
          FGPRD_ABRV: productData?.FGPRD_ABRV || "",
          FGMDW_RATE: productData?.FGMDW_RATE || "",
          RDOFF: productData?.RDOFF || "",
          STATUS: productData?.STATUS || "",
          UPDATED_BY: productData?.UPDATED_BY || "",
          CREATED_BY: productData?.CREATED_BY || "",
          CREATED_DT: productData?.CREATED_DT || "",
          TAX_NAME: productData?.TAX_KEY || "",
          TERM_KEY: productData?.TERM_KEY || "",
          EFF_DT: productData?.EFF_DT ? productData.EFF_DT.split('T')[0] : '',
          UNIT_NAME: productData?.UNIT_KEY.toString() || "",
          SR_CODE: productData?.SR_CODE || "",
          FGSUBLOC_KEY: productData?.FGSUBLOC_KEY || "",
          BRAND_NAME: productData?.BRAND_KEY.toString() || "",
          FGMUP_RATE: productData?.FGMUP_RATE || "",
          GEN_UNIQUE_BARCODE: productData?.GEN_UNIQUE_BARCODE || "",
          Excise_appl: productData?.Excise_appl || "",
          Excise_Key: productData?.Excise_Key || "",
          PRODGRP_NAME: productData?.ProdGrp_Key.toString() || "",
          Is_Unique: productData?.Is_Unique || "",
          HSN_CODE: productData?.HSNCODE_KEY.toString() || "",
          // HSNCODE_KEY: productData?.HSNCODE_KEY || "",
          QC_REQ: productData?.QC_REQ || "",
          QC_SUBGROUP_KEY: productData?.QC_SUBGROUP_KEY || "",
          ISSERVICE: productData?.ISSERVICE || "",
          fgSizeEntities: productData?.fgSizeEntities?.map(item => ({
            FGSIZE_ID: item.FGSIZE_ID,
            FGPRD_KEY: item.FGPRD_KEY,
            FGSIZE_NAME: item.FGSIZE_NAME,
            FGSIZE_ABRV: item.FGSIZE_ABRV,
            STATUS: item.STATUS,
            MRPRD: item.MRPRD,
            SSPRD: item.SSPRD,
            DBFLAG: mode === 'retrieve' ? 'R' : mode === 'edit' ? 'U' : ''
          }))
        });

        setIsFormDisabled(true);
        setCurrentFGPRD_KEY(productData?.FGPRD_KEY);
        const newParams = new URLSearchParams();
        newParams.set("FGPRD_KEY", productData.FGPRD_KEY);
        router.replace(`/masters/products/product?${newParams.toString()}`);

      } else if (response.data.STATUS === 1 && response.data.RESPONSESTATUSCODE === 2) {
        toast.info(response.data.MESSAGE);
      } else {
        toast.error('Failed to fetch product data');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error('Error fetching product data. Please try again.');
    }
  }, [CO_ID, router]);

  // useEffect(() => {
  //   fetchProductData();
  // }, [fetchProductData]);

  useEffect(() => {
    if (FG) {
      setCurrentFGPRD_KEY(FG);
      fetchProductData(FG);
      setMode('view');
    } else {
      setMode('view');
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
      setIsFormDisabled(true);
    }
    setMode('view');
  }, [FG, fetchProductData]);

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

    let CPREFIX = '';

    try {
      const responseFirst = await axiosInstance.post(`GetSeriesSettings/GetSeriesLastNewKey`, {

        MODULENAME: "FGPRD",
        TBLNAME: "FGPRD",
        FLDNAME: "FGPRD_KEY",
        NCOLLEN: 0,
        CPREFIX: "",
        COBR_ID: COBR_ID,
        FCYR_KEY: FCYR_KEY,
        TRNSTYPE: "M",
        SERIESID: 31,
        FLAG: "Series"

      });
      if (
        responseFirst.data.STATUS === 0 &&
        responseFirst.data.RESPONSESTATUSCODE === 1
      ) {
        const cprefix = responseFirst.data.DATA[0]?.CPREFIX || "";

        CPREFIX = cprefix;
        setSeries(responseFirst.data.DATA);

        setForm((prev) => ({
          ...prev,
          CPREFIX: cprefix
        }));

      } else {
        toast.error("Failed to fetch Series");
      }
    } catch (error) {
      console.error("Error fetching Series", error);
      toast.error("Error fetching Series. Please try again.");
    }

    try {
      const responseSecond = await axiosInstance.post(`GetSeriesSettings/GetSeriesLastNewKey`, {

        MODULENAME: "FGPRD",
        TBLNAME: "FGPRD",
        FLDNAME: "FGPRD_KEY",
        NCOLLEN: 5,
        CPREFIX: CPREFIX,
        COBR_ID: COBR_ID,
        FCYR_KEY: FCYR_KEY,
        TRNSTYPE: "M",
        SERIESID: 0,
        FLAG: ""

      });
      if (
        responseSecond.data.STATUS === 0 &&
        responseSecond.data.RESPONSESTATUSCODE === 1
      ) {
        setSeriesData(responseSecond.data.DATA);

        setForm((prev) => ({
          ...prev,
          FGPRD_KEY: responseSecond.data.DATA[0]?.ID || "",
          LASTID: responseSecond.data.DATA[0]?.LASTID || ""
        }));


      } else {
        toast.error("Failed to fetch Series");
      }
    } catch (error) {
      console.error("Error fetching Series", error);
      toast.error("Error fetching Series. Please try again.");
    }

  };

  const debouncedApiCall = debounce(async (newSeries) => {
    try {
      const response = await axiosInstance.post('GetSeriesSettings/GetSeriesLastNewKey', {
        MODULENAME: "FGPRD",
        TBLNAME: "FGPRD",
        FLDNAME: "FGPRD_KEY",
        NCOLLEN: 5,
        CPREFIX: newSeries,
        COBR_ID: COBR_ID,
        FCYR_KEY: FCYR_KEY,
        TRNSTYPE: "M",
        SERIESID: 0,
        FLAG: ""
      });
      const { STATUS, DATA, MESSAGE } = response.data;
      if (STATUS === 0 && DATA.length > 0) {
        const id = DATA[0].ID;
        const lastId = DATA[0].LASTID;
        setForm((prev) => ({
          ...prev,
          FGPRD_KEY: id,
          LASTID: lastId
        }));
      } else {
        toast.error(`${MESSAGE} for ${newSeries}`, { autoClose: 1000 });

        setForm((prev) => ({
          ...prev,
          FGPRD_KEY: '',
          LASTID: ''
        }));
      }
    } catch (error) {
      console.error("Error fetching series data:", error);
    }
  }, 300);

  const handleManualSeriesChange = (newSeries) => {
    setForm((prev) => ({
      ...prev,
      CPREFIX: newSeries,
    }));
    if (newSeries.trim() === '') {
      setForm((prev) => ({
        ...prev,
        FGPRD_KEY: '',
        LASTID: ''
      }));
      return;
    };
    debouncedApiCall(newSeries);
  }

  const handleSubmit = async () => {

    const result = productFormSchema.safeParse(form);
    if (!result.success) {
      console.log("Validation Errors:", result.error.format());
      return toast.info("Please fill in all required inputs correctly", {
        autoClose: 1000,
      });
    }
    const { data } = result;

    let counter = 1;

    const cleanRows = (form.fgSizeEntities || []).filter(row => {

      return Object.values(row).some(value => value !== null && value !== '');
    }).map(row => ({

      FGSIZE_ID: row.FGSIZE_ID && row.FGSIZE_ID !== 0 ? row.FGSIZE_ID : counter++,
      FGPRD_KEY: row.FGPRD_KEY || "",
      FGSIZE_NAME: row.FGSIZE_NAME || "",
      FGSIZE_ABRV: row.FGSIZE_ABRV || "",
      STATUS: row.STATUS || 0,
      MRPRD: row.MRPRD || 0.00,
      SSPRD: row.SSPRD || 0.00,
      // DBFLAG: mode === 'add' ? 'I' : mode === 'edit' ? row.
      //     FGSIZE_ID
      //     ? 'U' : 'I' : '',
      DBFLAG:
        row.DBFLAG === 'D'
          ? 'D'
          : mode === 'add'
            ? 'I'
            : mode === 'edit'
              ? row.FGSIZE_ID
                ? 'U'
                : 'I'
              : '',
    }));

    const payload = [{

      FGPRD_KEY: form.FGPRD_KEY || 0,
      FGCAT_KEY: form.FGCAT_KEY || "",
      FGCAT_NAME: form.FGCAT_NAME || "",
      FGPRD_CODE: form.FGPRD_CODE || 0,
      FGPRD_NAME: form.FGPRD_NAME || 0,
      FGPRD_ABRV: data.FGPRD_ABRV || 0,
      FGMDW_RATE: form.FGMDW_RATE || 0.0,
      RDOFF: form.RDOFF || 0,
      STATUS: form.STATUS || 0,
      CREATED_DT: "2019-08-01T00:00:00",
      TAX_KEY: form.TAX_NAME || "",
      TERM_KEY: form.TERM_KEY || "",
      EFF_DT: form.EFF_DT ? `${form.EFF_DT}T00:00:00` : '' || "2019-08-01T00:00:00",
      UNIT_KEY: form.UNIT_NAME || "",
      SR_CODE: form.SR_CODE || 0,
      FGSUBLOC_KEY: form.FGSUBLOC_KEY || "",
      BRAND_KEY: form.BRAND_NAME || "",
      FGMUP_RATE: form.FGMUP_RATE || 0.0,
      GEN_UNIQUE_BARCODE: form.GEN_UNIQUE_BARCODE || 0,
      Excise_appl: form.Excise_appl || 0,
      Excise_Key: form.Excise_Key || 0,
      ProdGrp_Key: form.PRODGRP_NAME || "",
      Is_Unique: form.Is_Unique || 0,
      HSNCODE_KEY: form.HSN_CODE,
      // HSN_CODE: form.HSN_CODE || "XY003",
      QC_REQ: form.QC_REQ || "",
      QC_SUBGROUP_KEY: form.QC_SUBGROUP_KEY || "",
      ISSERVICE: form.ISSERVICE || 0,
      DBFLAG: mode === 'add' ? 'I' : mode === 'edit' ? 'U' : '',
      fgSizeEntities: cleanRows
    }]

    const userRole = localStorage.getItem('userRole'); // 'user' or 'customer'
    const username = localStorage.getItem('USER_NAME'); // For user role
    const PARTY_KEY = localStorage.getItem('PARTY_KEY'); // For customer role
    const COBR_ID = localStorage.getItem('COBR_ID');

    // Determine the UserName value based on role
    const UserName = userRole === 'user' ? username : PARTY_KEY;

    let response;
    if (mode === 'edit') {
      payload.FGPRD_KEY = currentFGPRD_KEY;
      payload.UPDATED_BY = 2;
      response = await axiosInstance.patch(`Product/ManageFgPrdSize?UserName=${(UserName)}&strCobrid=${COBR_ID}`, payload);

      console.log("payload", payload);
    } else {
      payload.CREATED_BY = 2;
      response = await axiosInstance.post(`Product/ManageFgPrdSize?UserName=${(UserName)}&strCobrid=${COBR_ID}`, payload);
    }

    if (response.data.STATUS === 0 && response.data.RESPONSESTATUSCODE === 1) {
      toast.success(response.data.MESSAGE);
      setIsFormDisabled(true);

    } else {
      toast.error(response.data.MESSAGE || 'Operation failed');
    }
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

  const handlePrevious = async () => {
    await fetchProductData(currentFGPRD_KEY, "P");
    setForm((prev) => ({
      ...prev,
      SearchByCd: ''
    }));
  };

  const handleNext = async () => {
    await fetchProductData(currentFGPRD_KEY, "N");
    setForm((prev) => ({
      ...prev,
      SearchByCd: ''
    }));
  };

  const handleCancel = async () => {
    try {
      await fetchProductData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
      setForm((prev) => ({
        ...prev,
        SearchByCd: ''
      }));
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.post('Product/DeleteFgPrd', {
        FGPRD_KEY: form.FGPRD_KEY
      });
      const { data: { STATUS, MESSAGE } } = response;
      if (STATUS === 0) {
        toast.success(MESSAGE, { autoClose: 500 });
        await fetchProductData(currentFGPRD_KEY, 'P');
      } else {
        toast.error(MESSAGE);
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: { xs: '16px', sm: '20px', md: '2px' },
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
          height: { xs: 'auto', sm: 'auto', md: '570px', lg: '570px', xl: '570px' },
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
                onClick={handlePrevious}
                disabled={mode !== 'view' || !currentFGPRD_KEY || currentFGPRD_KEY === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              <Button variant="contained" size="small"
                sx={Buttonsx}
                onClick={handleNext}
                disabled={mode !== 'view' || !currentFGPRD_KEY}
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
                onDelete={handleDelete}
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  fetchProductData(e.target.value, 'R', true);
                }
              }}
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
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                  <Button variant="contained"
                    sx={{ background: "#BFBFBF", height: '30px', fontSize: '12px' }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {(mode === 'edit' || mode === 'add') && (
                <>
                  <Button variant="contained"
                    sx={{ background: "#A8E2C5", height: '30px', fontSize: '12px' }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                  <Button variant="contained"
                    sx={{ background: "#BFBFBF", height: '30px', fontSize: '12px' }}
                    onClick={handleCancel}
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

export default function Wrapper() {
  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <ProductMst />
    </Suspense>
  );
}