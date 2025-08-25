'use client';
import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFormMode } from "../../../lib/helpers";
import CustomAutocomplete from "@/GlobalFunction/CustomAutoComplete/CustomNew";

const FORM_MODE = getFormMode();

const StepperMst1 = ({ mode }) => {
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
    SMALL_INPUT: '',
    BIG_INPUT: '',
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      readFileAsBase64(file)
        .then(() => toast.success("File loaded successfully"))
        .catch((err) => {
          console.error("Error reading file:", err);
          toast.error("Error reading file. Please try again.");
        });
    }
  };

  const renderLabelInput = (label, value, onChange, width, fullWidth) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ width: 150, fontSize: '14px' }}>{label}</Typography>
      <TextField
        value={value}
        onChange={onChange}
        size="small"
        fullWidth={fullWidth}
        sx={{
          width: width,
          '& .MuiInputBase-root': {
            height: '26px',
            fontSize: '13px',
          },
          '& input': {
            padding: '6px 8px',
            fontSize: '13px',
          },
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        marginInline: { xs: '5%', sm: '10%', md: '20%' },
        marginTop: { xs: '15px', sm: '20px', md: '0px' },
      }}
    >
      {/* First Row: Company + Image */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          gap: 1,
        }}
      >
        {/* Left side form */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 'calc(100% - 150px)',
            flexGrow: 1,
            gap: 0.5,
          }}
        >
          {/* Row 1: Company */}
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
            <Typography sx={{ width: 150 ,fontSize: '14px' }}>Company:</Typography>

            <TextField
              value={form.SMALL_INPUT}
              onChange={(e) => setForm({ ...form, SMALL_INPUT: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: 90,
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />

            <TextField
              value={form.BIG_INPUT}
              onChange={(e) => setForm({ ...form, BIG_INPUT: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: 450,
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />
          </Box>

          {/* Row 2: Abvr */}
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
            <Typography sx={{ width: 430 ,fontSize: '14px' }}>Abvr:</Typography>

            <TextField
              value={form.ABBR}
              onChange={(e) => setForm({ ...form, ABBR: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: 180,
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />
            <Typography sx={{ width: 90 ,fontSize: '14px' }}>GSTINNO:</Typography>
            <TextField
              value={form.GSTIN}
              onChange={(e) => setForm({ ...form, GSTIN: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: 190,
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />

            <Typography sx={{ width: 80,fontSize: '14px'  }}>Jurisdiction:</Typography>

            <CustomAutocomplete
              value={form.JURISDICTION}
              onChange={(value) => setForm({ ...form, JURISDICTION: value })}
              disabled={mode === FORM_MODE.read}
              sx={{ width: 200 }}
            />
          </Box>
        </Box>

        {/* Right side image box */}
        <Box
          sx={{
            width: '140px',
            height: '70px',
            border: '1px solid #ccc',
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
      </Box>
      {/* Two Column Layout */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 4,
          marginTop: 0,
        }}
      >
        {/* Left Column */}
        <Box sx={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {[
            { label: 'Print Name:', key: 'PRINT_INFO' },
            { label: 'Address:', key: 'ADDRESS' },
            { label: 'Regd Add:', key: 'REGD_ADDRESS' },
            { label: 'CIN NO.:', key: 'CIN_NO' },
            { label: 'IE Code:', key: 'IE_CODE' },
            { label: 'Tel:', key: 'TEL' },
            { label: 'Email:', key: 'EMAIL' },
            { label: 'Website:', key: 'WEBSITE' },
            { label: 'OwnerMobNo:', key: 'OWNER_MOBILE_NO' },
          ].map(({ label, key }) => (
            <Box key={key}>
              {renderLabelInput(
                label,
                form[key],
                (e) => setForm({ ...form, [key]: e.target.value }),
                300,
                true
              )}
            </Box>
          ))}
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {[
            { label: 'Work Add:', key: 'WORK_ADDRESS' },
            { label: 'Place:', key: 'PLACE' },
            { label: 'PinCode:', key: 'PINCODE' },
          ].map(({ label, key }) => (
            <Box key={key}>
              {renderLabelInput(
                label,
                form[key],
                (e) => setForm({ ...form, [key]: e.target.value }),
                300,
                true
              )}
            </Box>
          ))}

          {/* TDS Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
             
              gap: 0, // spacing between heading and each field
              marginTop: 0,
            }}
          >
            <Typography
              component="h3"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: 0,
                fontSize: '14px',
              }}
            >
              TDS Details
            </Typography>
            {[
              { label: 'PAN:', key: 'PAN' },
              { label: 'TAN:', key: 'TAN' },
              { label: 'TDS Circle:', key: 'TDS_CIRCLE' },
              { label: 'TDS Person:', key: 'TDS_PERSON' },
              { label: 'Designation:', key: 'DESIGNATION' },
            ].map(({ label, key }) => (
              <Box key={key} sx={{ marginBottom: 0.5 }}>
                {renderLabelInput(
                  label,
                  form[key],
                  (e) => setForm({ ...form, [key]: e.target.value }),
                  280,
                  true
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          borderBottom: '1px solid #ccc',
          marginY: 0,
          width: '100%',
        }}
      />
     {/* Additional Fields */}
{/* Additional Fields */}
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
  {/* First Row */}
  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
    {[
      { label: 'C.S.T', key: 'CST' },
      { label: 'Excise Cd', key: 'EXCISE_CD' },
      { label: 'Excise Div', key: 'EXCISE_DIV' },
    ].map(({ label, key }, idx) => (
      <Box key={key} sx={{ flex: idx === 0 ? 1 : 0.5 }}>
        {renderLabelInput(
          label,
          form[key],
          (e) => setForm({ ...form, [key]: e.target.value }),
          '100%', // width managed by flex
          true
        )}
      </Box>
    ))}
  </Box>

  {/* Second Row */}
  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
    {[
      { label: 'VAT(Reg.Off)', key: 'VAT_REG_OFF' },
      { label: 'Excise Rng', key: 'EXCISE_RNG' },
      { label: 'ExciseComm', key: 'EXCISE_COMM' },
    ].map(({ label, key }, idx) => (
      <Box key={key} sx={{ flex: idx === 0 ? 1 : 0.5 }}>
        {renderLabelInput(
          label,
          form[key],
          (e) => setForm({ ...form, [key]: e.target.value }),
          '100%',
          true
        )}
      </Box>
    ))}
  </Box>

  {/* Third Row */}
  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
    <Box sx={{ flex: 1 }}>
      {renderLabelInput(
        'MSME No',
        form['MSME_NO'],
        (e) => setForm({ ...form, MSME_NO: e.target.value }),
        '100%',
        true
      )}
    </Box>

    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
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
        sx={{ width: '100%', fontSize: '13px' }}
      />
    </Box>
  </Box>
</Box>

    </Box>
  );
};

export default StepperMst1;
