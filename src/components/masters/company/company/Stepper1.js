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
import CustomAutocomplete from "@/GlobalFunction/CustomAutoComplete/CustomNew";
import { getFormMode } from "@/lib/helpers";

const FORM_MODE = getFormMode();
const StepperMst1 = ({  form, setForm, mode  }) => {

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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
      <Typography sx={{ width: 110, fontSize: '14px' }}>{label}</Typography>
      <TextField
        value={value}
        onChange={onChange}
        size="small"
        disabled={mode === FORM_MODE.read} 
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
        marginInline: { xs: '5%', sm: '10%', md: '15%' },
        marginTop: { xs: '15px', sm: '20px', md: '2px' },
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
            <Typography sx={{ width: 110 ,fontSize: '14px' }}>Company:</Typography>

            <TextField
              value={form.CO_ID}
              onChange={(e) => setForm({ ...form, CO_ID: e.target.value })}
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
              value={form.CO_NAME}
              onChange={(e) => setForm({ ...form, CO_NAME: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: 640,
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />
          </Box>

          {/* Row 2: Abvr */}
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
            <Typography sx={{ width: 300 ,fontSize: '14px' }}>Abvr:</Typography>

            <TextField
              value={form.CO_ABRV}
              onChange={(e) => setForm({ ...form, CO_ABRV: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: 250,
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />
            <Typography sx={{ width: 90 ,fontSize: '14px' }}>GSTTIN_NO:</Typography>
            <TextField
              value={form.GSTTIN_NO}
              onChange={(e) => setForm({ ...form, GSTTIN_NO: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: 400,
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />

            <Typography sx={{ width: 80,fontSize: '14px',marginLeft:"10px"  }}>Jurisdiction:</Typography>

            <CustomAutocomplete
              value={form.JURISDICTION}
              onChange={(value) => setForm({ ...form, JURISDICTION: value })}
              // disabled={mode === FORM_MODE.read}
              disabled={true}
              sx={{ width: 300 }}
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
          gap: 1,
          marginTop: 0,
        }}
      >
        {/* Left Column */}
        <Box sx={{ flex: 1, minWidth: '350px', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {[
            { label: 'Print Name:', key: 'PRINT_NAME' },
            { label: 'Address:', key: 'OTH_ADD' },
            { label: 'Regd Add:', key: 'REG_ADD' },
            { label: 'CIN NO.:', key: 'CINNo' },
            { label: 'IE Code:', key: 'IE_CODE' },
            { label: 'Tel:', key: 'RTEL_NO' },
            { label: 'Email:', key: 'RE_MAIL' },
            { label: 'Website:', key: 'WEBSITE' },
            { label: 'OwnerMobNo:', key: 'OWN_MOBNO' },
          ].map(({ label, key }) => (
            <Box key={key}>
              {renderLabelInput(
                label,
                form[key],
                (e) => setForm({ ...form, [key]: e.target.value }),
                370,
                true
              )}
            </Box>
          ))}
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {[
            { label: 'Work Add:', key: 'WORK_ADD' },
            { label: 'Place:', key: 'PLACE' },
            { label: 'PinCode:', key: 'PINCODE' },
          ].map(({ label, key }) => (
            <Box key={key}>
              {renderLabelInput(
                label,
                form[key],
                (e) => setForm({ ...form, [key]: e.target.value }),
                380,
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
              { label: 'PAN:', key: 'PAN_NO' },
              { label: 'TAN:', key: 'TAN_NO' },
              { label: 'TDS Circle:', key: 'TDS_CIRCLE' },
              { label: 'TDS Person:', key: 'TDS_PERSON' },
              { label: 'Designation:', key: 'TDS_P_DESIG' },
            ].map(({ label, key }) => (
              <Box key={key} sx={{ marginBottom: 0.5 }}>
                {renderLabelInput(
                  label,
                  form[key],
                  (e) => setForm({ ...form, [key]: e.target.value }),
                  380,
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
      { label: 'Excise Cd', key: 'EXCISE_CODE' },
      { label: 'Excise Div', key: 'EXCISE_DIV' },
    ].map(({ label, key }, idx) => (
      <Box key={key} sx={{ flex: idx === 0 ? 1 : 0.5 }}>
        {renderLabelInput(
          label,
          form[key],
          (e) => setForm({ ...form, [key]: e.target.value }),
          '73%', // width managed by flex
          true
        )}
      </Box>
    ))}
  </Box>

  {/* Second Row */}
  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
    {[
      { label: 'VAT(Reg.Off)', key: 'RVAT' },
      { label: 'Excise Rng', key: 'EXCISE_RANG' },
      { label: 'ExciseComm', key: 'EXCISE_COMM' },
    ].map(({ label, key }, idx) => (
      <Box key={key} sx={{ flex: idx === 0 ? 1 : 0.5 }}>
        {renderLabelInput(
          label,
          form[key],
          (e) => setForm({ ...form, [key]: e.target.value }),
          '73%',
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
        '73%',
        true
      )}
    </Box>

    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={form.CO_DIV_KEY || false}
            onChange={(e) =>
              setForm({ ...form, CO_DIV_KEY: e.target.checked })
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
