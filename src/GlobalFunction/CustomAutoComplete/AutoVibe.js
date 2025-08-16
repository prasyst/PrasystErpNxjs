// 'use client'
// import React from 'react';
// import { Autocomplete, TextField, FormControl, InputAdornment } from '@mui/material';

// const AutoVibe = React.forwardRef(
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
//     variant = "filled",
//     className = ""
//   }, ref) => {
    
//     const [focused, setFocused] = React.useState(false);
//     const shouldShrink = !!value || focused;

//     return (
//       <FormControl fullWidth>
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
//             //   InputProps={{
//             //     ...params.InputProps,
//             //     startAdornment: (
//             //       <>
//             //         {params.InputProps.startAdornment}
//             //       </>
//             //     ),
//             //     endAdornment: (
//             //       <InputAdornment position="end">
//             //         {endAdornment}
//             //         {params.InputProps.endAdornment}
//             //       </InputAdornment>
//             //     ),
//             //   }}
//               fullWidth
//             />
//           )}
//           disabled={disabled}
//         />
//       </FormControl>
//     );
//   }
// );

// export default AutoVibe;



'use client'
import React from 'react';
import { Autocomplete, TextField, FormControl } from '@mui/material';

const AutoVibe = React.forwardRef(
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
              fullWidth
            />
          )}
          disabled={disabled}
        />
      </FormControl>
    );
  }
);

AutoVibe.displayName = "AutoVibe";
export default AutoVibe;

