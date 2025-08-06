'use client'
import React from 'react';
import { Autocomplete, TextField, FormControl } from '@mui/material';

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
    id,
    name,
    label,
    InputProps = {},
    endAdornment,
    variant = "outlined",
    className = "custom-textfield"
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
          onChange={(event, newValue) => {
            onChange({
              target: {
                name,
                value: newValue ? newValue.Id : ''
              }
            });
          }}
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
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {endAdornment}
                    {params.InputProps.endAdornment}
                  </>
                ),
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

CustomAutocomplete.displayName = 'CustomAutocomplete';

export default CustomAutocomplete;