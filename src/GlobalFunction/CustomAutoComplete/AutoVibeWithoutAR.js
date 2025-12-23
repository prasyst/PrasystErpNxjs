import React from 'react';
import { Autocomplete, TextField, InputAdornment, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FixedSizeList as List } from 'react-window';

const AutoVibeWithoutAR = React.forwardRef(
  ({
    options,
    value,
    onChange,
    disabled,
    error,
    helperText,
    onKeyDown,
    getOptionLabel,
    id,
    sx,
    name,
    label,
    InputProps = {},
    endAdornment,
    variant = "filled",
    className = "",
    onAddClick,
    onRefreshClick,
    isRefreshing
  }, ref) => {

    const [focused, setFocused] = React.useState(false);
    
    const shouldShrink = !!value || focused;
    return (
    <FormControl fullWidth>
      <Autocomplete
        id={id}
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={onChange}
        sx={sx}
        popupIcon={undefined}
        clearOnBlur={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}

        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant={variant}
            className={className}
            inputRef={ref}
            onKeyDown={onKeyDown}
            InputProps={{
              ...params.InputProps,
              sx: {
                padding: '0',
                marginLeft: '0px !important',
                paddingRight: "8px !important",
                paddingLeft: "8px !important",
                paddingBottom: "8px !important"
              },

              startAdornment: (
                <>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
            InputLabelProps={{
              shrink: shouldShrink,
              sx: {
                transformOrigin: 'top left',
                ...(!shouldShrink && {
                  transform: 'translate(14px, 18px) scale(1)',
                  fontSize: '1rem'
                })
              }
            }}
            sx={{
              '& .MuiInputLabel-filled': {
                ...(!shouldShrink && {
                  transform: 'translate(14px, 18px) scale(1)'
                })
              }
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

AutoVibeWithoutAR.displayName = "AutoVibeWithoutAR";
export default AutoVibeWithoutAR;

