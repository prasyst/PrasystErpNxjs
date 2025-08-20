'use client';
import React, { useState, useEffect } from "react";

import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  Checkbox,
  FormGroup,
  FormControlLabel,

} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getFormMode } from "../../../../lib/helpers";
import CustomAutocomplete from "../../../../GlobalFunction/CrudButton";
const FORM_MODE = getFormMode();
let pincity = [];
const StepperMst1 = ({
  index,
  mode,
  CompanyData,
  Cities,
  AllTextDisabled,
  AllButtonDisabled,
  addModeDis,
  viewModeDis,
  stepToNext,
  Status,
  setStatus,
  setMode,
  AllfieldStepperData,
  Flag,
  fetchCompanyData,
  setTableData,
  CompanyId,
}) => {
  const [form, setForm] = useState({
    COMPANY_NAME: '',
    ABBR: '',
    GSTIN: '',
    JURISDICTION: '',
    PRINT_INFO: '',
    WORK_ADDRESS: '',
    ADDRESS: '',
    PLACE: '',
    REGD_ADDRESS: '',
    PINCODE: '',
    CIN_NO: '',
    IE_CODE: '',
    TEL: '',
    EMAIL: '',
    WEBSITE: '',
    OWNER_MOBILE_NO: '',
    PAN: '',
    TAN: '',
    TDS_CIRCLE: '',
    TDS_PERSON: '',
    DESIGNATION: '',
    CST: '',
    EXCISE_CD: '',
    EXCISE_DIV: '',
    VAT_REG_OFF: '',
    EXCISE_RNG: '',
    EXCISE_COMM: '',
    MSME_NO: '',
    CO_DIVISION_ACTIVE: false,
  });


  const openNewTab = () => {
    window.open("/pincode");
  }

  const handleClickNext = () => {

  };

  const HandleNextStep = () => { };

  const handleCancel = async () => {



  };

  const handleFileChange = (event) => {
    console.log("obj", watch());
    const file = event.target.files[0];
    console.log("file", file);
    if (file) {
      const reader = new FileReader();

      const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      readFileAsBase64(file)
        .then((base64String) => {
          console.log("base64String", base64String);
          setValue("CoLogo", base64String);
          setselectedImage(base64String);
        })
        .catch((err) => {
          console.error("Error reading file:", err);
          toast.error("Error reading file. Please try again.");
        });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.8,
          marginInline: { xs: '5%', sm: '10%', md: '20%' },
          marginTop: { xs: '15px', sm: '20px', md: '0px' },
        }}
      >
        {/* Top Section: Inputs + Image */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 0,
            flexWrap: 'nowrap',
          }}
        >
          {/* Left Inputs */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.8,
              flex: 1,
            }}
          >
            {/* Row 1 */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <TextField
                label="Company"
                className="custom-textfield"
                sx={{ width: '350px' }}
                disabled={mode === FORM_MODE.read}
                onChange={(e) => setForm({ ...form, COMPANY_NAME: e.target.value })}
              />
              <TextField
                label="Abbr"
                className="custom-textfield"
                sx={{ width: '120px' }}
                disabled={mode === FORM_MODE.read}
                onChange={(e) => setForm({ ...form, ABBR: e.target.value })}
              />
              <TextField
                label="GSTIN NO."
                className="custom-textfield"
                sx={{ width: '120px' }}
                disabled={mode === FORM_MODE.read}
                onChange={(e) => setForm({ ...form, GSTIN: e.target.value })}
              />
            </Box>

            {/* Row 2 */}
            <Box sx={{ display: 'flex',flexDirection:'row', flexWrap: 'wrap', gap: 0.8 }}>

              <TextField
                label="Jurisdiction"
                className="custom-textfield"
                sx={{ width: '350px' }}
                disabled={mode === FORM_MODE.read}
                onChange={(e) => setForm({ ...form, JURISDICTION: e.target.value })}
              />
              {/* <CustomAutocomplete
                id="jurisdiction-autocomplete"
                disabled={true}
                label="Jurisdiction"
                name="JURISDICTION "
                // options={termsTypeOptions}
                value={form.JURISDICTION}
                onChange={(value) => setForm({ ...form, JURISDICTION: value })}
                sx={{ width:'150px' }}
              /> */}
              <TextField
                label="Print Name"
                className="custom-textfield"
                sx={{ width: '250px' }}
                disabled={mode === FORM_MODE.read}
                onChange={(e) => setForm({ ...form, PRINT_INFO: e.target.value })}
              />
            </Box>
          </Box>

          {/* Image Box */}
          <Box
            sx={{
              width: '150px',
              minHeight: '80px',
              border: '1px dashed #ccc',
              borderRadius: 1,
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Bottom Section: New Inputs + TDS Details */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Side New Inputs */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.8,
              flex: 1,
            }}
          >
            <TextField
              label="Work Address"
              className="custom-textfield"
              sx={{ flex: '1 1 250px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, WORK_ADDRESS: e.target.value })}
            />
            <TextField
              label="Address"
              className="custom-textfield"
              sx={{ flex: '1 1 250px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, ADDRESS: e.target.value })}
            />
            <TextField
              label="Place"
              className="custom-textfield"
              sx={{ flex: '1 1 150px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, PLACE: e.target.value })}
            />
            <TextField
              label="Regd Address"
              className="custom-textfield"
              sx={{ flex: '1 1 250px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, REGD_ADDRESS: e.target.value })}
            />

            <TextField
              label="PinCode"
              className="custom-textfield"
              sx={{ flex: '1 1 150px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, PINCODE: e.target.value })}
            />
            <TextField
              label="CIN NO."
              className="custom-textfield"
              sx={{ flex: '1 1 250px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, CIN_NO: e.target.value })}
            />
            <TextField
              label="IE Code"
              className="custom-textfield"
              sx={{ flex: '1 1 250px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, IE_CODE: e.target.value })}
            />
            <TextField
              label="Tel"
              className="custom-textfield"
              sx={{ flex: '1 1 250px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, TEL: e.target.value })}
            />
            <TextField
              label="Email"
              className="custom-textfield"
              sx={{ flex: '1 1 250px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, EMAIL: e.target.value })}
            />
            <TextField
              label="Website"
              className="custom-textfield"
              sx={{ flex: '1 1 250px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, WEBSITE: e.target.value })}
            />
            <TextField
              label="Owner Mobile No."
              className="custom-textfield"
              sx={{ flex: '1 1 250px' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, OWNER_MOBILE_NO: e.target.value })}
            />
          </Box>

          {/* Right Side TDS Details */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.8,
              width: '250px',

            }}
          >
            <Typography
              component="h3"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                paddingBottom: '0px',
              }}
            >
              TDS Details
            </Typography>

            <TextField
              label="PAN"
              className="custom-textfield"
              sx={{ width: '100%' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, PAN: e.target.value })}
            />
            <TextField
              label="TAN"
              className="custom-textfield"
              sx={{ width: '100%' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, TAN: e.target.value })}
            />
            <TextField
              label="TDS Circle"
              className="custom-textfield"
              sx={{ width: '100%' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, TDS_CIRCLE: e.target.value })}
            />
            <TextField
              label="TDS Person"
              className="custom-textfield"
              sx={{ width: '100%' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, TDS_PERSON: e.target.value })}
            />
            <TextField
              label="Designation"
              className="custom-textfield"
              sx={{ width: '100%' }}
              disabled={mode === FORM_MODE.read}
              onChange={(e) => setForm({ ...form, DESIGNATION: e.target.value })}
            />
          </Box>

        </Box>


        {/* Border below Designation field */}
        <Box
          sx={{
            borderBottom: '3px solid #ccc',
            marginX: 0,
            marginY: 0,
          }}
        />

        {/* Additional Fields Section */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.8,
            marginTop: 0,
          }}
        >
          <TextField
            label="C.S.T"
            className="custom-textfield"
            sx={{ width: '250px' }}
            disabled={mode === FORM_MODE.read}
            onChange={(e) => setForm({ ...form, CST: e.target.value })}
          />
          <TextField
            label="Excise CD"
            className="custom-textfield"
            sx={{ width: '250px' }}
            disabled={mode === FORM_MODE.read}
            onChange={(e) => setForm({ ...form, EXCISE_CD: e.target.value })}
          />
          <TextField
            label="Excise Div"
            className="custom-textfield"
            sx={{ width: '250px' }}
            disabled={mode === FORM_MODE.read}
            onChange={(e) => setForm({ ...form, EXCISE_DIV: e.target.value })}
          />
          <TextField
            label="VAT (Reg. Off)"
            className="custom-textfield"
            sx={{ width: '250px' }}
            disabled={mode === FORM_MODE.read}
            onChange={(e) => setForm({ ...form, VAT_REG_OFF: e.target.value })}
          />
          <TextField
            label="Excise Rng"
            className="custom-textfield"
            sx={{ width: '250px' }}
            disabled={mode === FORM_MODE.read}
            onChange={(e) => setForm({ ...form, EXCISE_RNG: e.target.value })}
          />
          <TextField
            label="Excise Comm"
            className="custom-textfield"
            sx={{ width: '250px' }}
            disabled={mode === FORM_MODE.read}
            onChange={(e) => setForm({ ...form, EXCISE_COMM: e.target.value })}
          />
          <TextField
            label="MSME No"
            className="custom-textfield"
            sx={{ width: '250px' }}
            disabled={mode === FORM_MODE.read}
            onChange={(e) => setForm({ ...form, MSME_NO: e.target.value })}
          />

          {/* Checkbox for Co-division Active */}
          <FormControlLabel
            control={
              <Checkbox
                checked={form.CO_DIVISION_ACTIVE || false}
                onChange={(e) =>
                  setForm({ ...form, CO_DIVISION_ACTIVE: e.target.checked })
                }
                disabled={mode === FORM_MODE.read}
              />
            }
            label="Co-division Active"
            sx={{ width: '250px', marginLeft: '8px' }}
          />
        </Box>

      </Box>

      <Grid item xs={12} className="form_button" sx={{ marginTop: '-20px', marginBottom: '10px', marginRight: '60px' }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            mr: 1,
            background: "linear-gradient(290deg, #b9d0e9, #e9f2fa)",
          }}
          onClick={handleClickNext}
          disabled={AllTextDisabled}
        >
          Next
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            mr: 1,
            background: "linear-gradient(290deg, #b9d0e9, #e9f2fa)",
          }}
          onClick={handleCancel}
          disabled={AllTextDisabled}
        >
          Cancel
        </Button>
      </Grid>


    </>
  );
};

export default StepperMst1;
