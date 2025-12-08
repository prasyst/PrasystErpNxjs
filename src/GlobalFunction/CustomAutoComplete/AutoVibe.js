import React from 'react';
import { Autocomplete, TextField, InputAdornment, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const AutoVibe = React.forwardRef(
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
              endAdornment: (
                <InputAdornment position="end">

                  {!disabled && (
                    <>
                      <AddIcon
                        onClick={onAddClick}
                        style={{ cursor: 'pointer', fontSize: '18px', color: '#2196f3' }}
                      />
                      <RefreshIcon
                        onClick={onRefreshClick}
                        sx={{
                          fontSize: '18px',
                          color: '#4caf50',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease',
                          animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                          '@keyframes spin': {
                            '0%': {
                              transform: 'rotate(0deg)',
                            },
                            '100%': {
                              transform: 'rotate(360deg)',
                            },
                          },
                        }}
                      />
                    </>
                  )}

                </InputAdornment>
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
        // sx={{
        //   "& .MuiAutocomplete-root": {
        //     backgroundColor: disabled ? 'action.disabledBackground' : 'background.paper'
        //   }
        // }}
      />
      </FormControl>
    );
  }
);

AutoVibe.displayName = "AutoVibe";
export default AutoVibe;

