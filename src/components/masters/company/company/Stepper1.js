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
const StepperMst1 = ({ form, setForm, mode }) => {

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
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
      alignItems: { xs: 'flex-start', sm: 'center' }, // Align left on mobile
    }}>
      <Typography sx={{ 
        width: { xs: '100%', sm: 110 }, 
        fontSize: '14px',
        mb: { xs: 0.5, sm: 0 } // Margin bottom on mobile
      }}>{label}</Typography>
      <TextField
        value={value}
        onChange={onChange}
        size="small"
        disabled={mode === FORM_MODE.read}
        fullWidth={fullWidth}
        sx={{
          width: { xs: '100%', sm: width }, // Full width on mobile
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
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
          width: '100%',
          gap: 1,
        }}
      >
        {/* Left side form */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', sm: 'calc(100% - 150px)' }, // Full width on mobile
            flexGrow: 1,
            gap: 0.5,
          }}
        >
          {/* Row 1: Company */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%', 
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
          }}>
            <Typography sx={{ 
              width: { xs: '100%', sm: 90 }, 
              fontSize: '14px',
              mb: { xs: 0.5, sm: 0 }
            }}>Company:</Typography>

            <TextField
              value={form.CO_ID}
              onChange={(e) => setForm({ ...form, CO_ID: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: { xs: '100%', sm: 80 }, // Full width on mobile
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
                 width: { xs: '100%', sm: 525, md: 600 }, // Increased width to 600px on md+
                flexGrow: { sm: 1 }, // Allow it to grow to take available space
                maxWidth: { sm: '100%' }, // Prevent overflow on smaller screens
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />
          </Box>

          {/* Row 2: Abvr */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%', 
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
          }}>
            <Typography sx={{ 
              width: { xs: '100%', sm: 270 }, 
              fontSize: '14px',
              mb: { xs: 0.5, sm: 0 }
            }}>Abvr:</Typography>

            <TextField
              value={form.CO_ABRV}
              onChange={(e) => setForm({ ...form, CO_ABRV: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: { xs: '100%', sm: 250 }, // Full width on mobile
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />
            <Typography sx={{ 
              width: { xs: '100%', sm: 90 }, 
              fontSize: '14px',
              mb: { xs: 0.5, sm: 0 },
              marginLeft: { sm: '10px' }
            }}>GSTTIN_NO:</Typography>
            <TextField
              value={form.GSTTIN_NO}
              onChange={(e) => setForm({ ...form, GSTTIN_NO: e.target.value })}
              size="small"
              disabled={mode === FORM_MODE.read}
              sx={{
                width: { xs: '100%', sm: 400 }, // Full width on mobile
                '& .MuiInputBase-root': { height: '28px', fontSize: '12px' },
                '& input': { padding: '6px 8px', fontSize: '12px' },
              }}
              inputProps={{ style: { fontSize: '13px' } }}
            />

            <Typography sx={{ 
              width: { xs: '100%', sm: 80 }, 
              fontSize: '14px',
              mb: { xs: 0.5, sm: 0 },
              marginLeft: { sm: '10px' }
            }}>Jurisdiction:</Typography>

            <CustomAutocomplete
              value={form.JURISDICTION}
              onChange={(value) => setForm({ ...form, JURISDICTION: value })}
              disabled={true}
              // sx={{ width: { xs: '100%', sm: 230 } }} 
                sx={{ 
               width: { xs: '100%', sm: 'auto', md: 280 }, // Increased width for md+
                flexGrow: { sm: 1 }, // Grow to take available space
                minWidth: { sm: 150 }, // Minimum width to prevent collapse
                maxWidth: { sm: '100%' },// Minimum width to prevent collapse
              }}
            />
          </Box>
        </Box>

        {/* Right side image box */}
        <Box
          sx={{
            width: { xs: '100%', sm: '140px' }, // Full width on mobile
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
          flexDirection: { xs: 'column', sm: 'row' }, // Stack columns on mobile
        }}
      >
        {/* Left Column */}
        <Box sx={{ 
          flex: 1, 
          width: { xs: '100%', sm: '350px' }, // Full width on mobile
          display: 'flex', 
          flexDirection: 'column', 
          gap: 0.5 ,
          marginTop: -1
        }}>
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
                { xs: '100%', sm: 370 }, // Full width on mobile
                true
              )}
            </Box>
          ))}
        </Box>

        {/* Right Column */}
        <Box sx={{ 
          flex: 1, 
          width: { xs: '100%', sm: '300px' }, // Full width on mobile
          display: 'flex', 
          flexDirection: 'column', 
          gap: 0.5 
        }}>
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
                { xs: '100%', sm: 380 }, // Full width on mobile
                true
              )}
            </Box>
          ))}

          {/* TDS Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
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
                  { xs: '100%', sm: 380 }, // Full width on mobile
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* First Row */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
          gap: 1 
        }}>
          {[
            { label: 'C.S.T', key: 'CST' },
            { label: 'Excise Cd', key: 'EXCISE_CODE' },
            { label: 'Excise Div', key: 'EXCISE_DIV' },
          ].map(({ label, key }, idx) => (
            <Box key={key} sx={{ flex: { xs: 1, sm: idx === 0 ? 1 : 0.5 } }}>
              {renderLabelInput(
                label,
                form[key],
                (e) => setForm({ ...form, [key]: e.target.value }),
                { xs: '100%', sm: '73%' }, // Full width on mobile
                true
              )}
            </Box>
          ))}
        </Box>

        {/* Second Row */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
          gap: 1 
        }}>
          {[
            { label: 'VAT(Reg.Off)', key: 'RVAT' },
            { label: 'ExciseRng', key: 'EXCISE_RANG' },
            { label: 'ExciseComm', key: 'EXCISE_COMM' },
          ].map(({ label, key }, idx) => (
            <Box key={key} sx={{ flex: { xs: 1, sm: idx === 0 ? 1 : 0.5 } }}>
              {renderLabelInput(
                label,
                form[key],
                (e) => setForm({ ...form, [key]: e.target.value }),
                { xs: '100%', sm: '73%' }, // Full width on mobile
                true
              )}
            </Box>
          ))}
        </Box>

        {/* Third Row */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
          gap: 1 
        }}>
          <Box sx={{ flex: 1 }}>
            {renderLabelInput(
              'MSME No',
              form['MSME_NO'],
              (e) => setForm({ ...form, MSME_NO: e.target.value }),
              { xs: '100%', sm: '73%' }, // Full width on mobile
              true
            )}
          </Box>

          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' } // Full width on mobile
          }}>
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