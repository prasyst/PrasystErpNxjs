'use client'
import React from 'react';
import { Autocomplete, TextField, FormControl, InputAdornment } from '@mui/material';

const CustomAutocomplete = React.forwardRef(
  ({
    options,
    value,
    onChange,
    disabled,
    error,
    helperText,
    getOptionLabel,
    onKeyDown,
    sx,
    id,
    name,
    label,
    InputProps = {},
    endAdornment,
    variant = "filled",
    className = ""
  }, ref) => {
    
    const [focused, setFocused] = React.useState(false);
    const shouldShrink = !!value || focused;

    return (
      <FormControl fullWidth>
        <Autocomplete
          fullWidth
          id={id}
          options={options}
          getOptionLabel={getOptionLabel}
          value={value}
          onChange={onChange}
          sx={sx}
          clearOnBlur={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant={variant}
              className={className}
              error={!!error}
              helperText={helperText}
              inputRef={ref}
              onKeyDown={onKeyDown}
            sx={{
    '& .MuiInputBase-root': {
      height: '36px', // ↓ reduces overall height
      fontSize: '0.875rem',
    },
    '& input': {
      padding: '8px',
    },
  }}
              fullWidth
            />
          )}
          disabled={disabled}
        />
      </FormControl>
    );
  }
);
// ✅ Add display name to fix ESLint warning
CustomAutocomplete.displayName = 'CustomAutocomplete';
export default CustomAutocomplete;