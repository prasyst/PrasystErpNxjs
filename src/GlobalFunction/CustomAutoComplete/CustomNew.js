// 'use client'
// import React from 'react';
// import { Autocomplete, TextField, FormControl, InputAdornment } from '@mui/material';

// const CustomAutocomplete = React.forwardRef(
//   ({
//     options,
//     value,
//     onChange,
//     disabled,
//     error,
//     helperText,
//     getOptionLabel,
//     onKeyDown,
//     sx,
//     id,
//     name,
//     label,
//     InputProps = {},
//     endAdornment,
//     variant = "outlined",
//     className = ""
//   }, ref) => {

//     const [focused, setFocused] = React.useState(false);
//     const shouldShrink = !!value || focused;

//     return (
//       <FormControl fullWidth
//       >
//         <Autocomplete
//           fullWidth
//           id={id}
//           options={options}
//           getOptionLabel={getOptionLabel}
//           value={value}
//           onChange={onChange}
//           sx={sx}
//           clearOnBlur={false}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label={label}
//               variant={variant}
//               className={className}
//               error={!!error}
//               helperText={helperText}
//               inputRef={ref}
//               onKeyDown={onKeyDown}
//               InputLabelProps={{
//                 sx: {
//                   fontSize: '0.85rem',
//                   top: '50%',               // ✅ Center vertically
//                   transform: 'translate(14px, -50%) scale(1)', // ✅ Adjust positioning
//                   transformOrigin: 'top left',
//                   transition: 'all 0.2s ease-out',
//                   '&.MuiInputLabel-shrink': {
//                     // ✅ When label shrinks (focused or has value)
//                     top: 0,
//                     transform: 'translate(14px, -6px) scale(0.75)',
//                   },
//                 },
//               }}
//               sx={{
//                 '& .MuiInputBase-root': {
//                   fontSize: '0.75rem',
//                   backgroundColor: 'transparent',
//                   minHeight: '28px', // ⬅️ Reduced from 34px
//                   paddingTop: '0px',
//                   paddingBottom: '0px',
//                   paddingLeft: '6px',
//                   paddingRight: '6px',
//                   height: '28px', // ⬅️ Force height
//                 },
//                 '& .MuiInputBase-input': {
//                   padding: '4px 0px',
//                   height: '18px', // ⬅️ Shrinks input area
//                   fontSize: '0.75rem',
//                 },
//                 '& .MuiFormHelperText-root': {
//                   marginTop: '2px',
//                   fontSize: '0.65rem',
//                 },
//                 ...sx,
//               }}

//               fullWidth
//             />


//           )}

//           disabled={disabled}
//         />
//       </FormControl>
//     );
//   }
// );
// // ✅ Add display name to fix ESLint warning
// CustomAutocomplete.displayName = 'CustomAutocomplete';
// export default CustomAutocomplete;

'use client';
import React from 'react';
import { Autocomplete, TextField, FormControl } from '@mui/material';

const CustomAutocomplete = React.forwardRef(
  ({
    options = [], // Default to empty array
    value,
    onChange,
    disabled,
    error,
    helperText,
    getOptionLabel,
    onKeyDown,
    sx = {}, // Default to empty object
    id,
    name,
    label,
    InputProps = {},
    endAdornment,
    variant = "outlined",
    className = ""
  }, ref) => {

    const [focused, setFocused] = React.useState(false);
    const shouldShrink = !!value || focused;

    return (
      <FormControl fullWidth sx={{ width: '100%' }}>
        <Autocomplete
          fullWidth
          id={id}
          options={options}
          getOptionLabel={getOptionLabel}
          value={value}
          onChange={(_, newValue) => onChange(newValue)} // Ensure onChange is called with new value
          sx={{ width: '100%', ...sx }} // Merge external sx with fullWidth
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
              InputLabelProps={{
                sx: {
                  fontSize: '0.85rem',
                  top: '50%',
                  transform: 'translate(14px, -50%) scale(1)',
                  transformOrigin: 'top left',
                  transition: 'all 0.2s ease-out',
                  '&.MuiInputLabel-shrink': {
                    top: 0,
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '0.75rem',
                  backgroundColor: 'transparent',
                  minHeight: '28px',
                  paddingTop: '0px',
                  paddingBottom: '0px',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  height: '28px',
                },
                '& .MuiInputBase-input': {
                  padding: '4px 0px',
                  height: '18px',
                  fontSize: '0.75rem',
                },
                '& .MuiFormHelperText-root': {
                  marginTop: '2px',
                  fontSize: '0.65rem',
                },
                width: '100%', // Ensure TextField takes full width of FormControl
                ...sx, // Allow external sx to override
              }}
              InputProps={{
                ...params.InputProps,
                ...InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {endAdornment}
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