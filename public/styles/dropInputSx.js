export const DropInputSx = {
  '& .MuiInputBase-root': {
    height: 38,
    fontSize: '14px',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    padding: '6px 6px',
    paddingTop: '6px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    '&:hover': {
      borderColor: '#4caf50',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '15px',
    top: '-6px',
    color: '#666',
    transition: 'color 0.3s, font-size 0.3s, top 0.3s',
  },
  '& .MuiFilledInput-root': {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    paddingRight: '36px',
    height: 38,
  },
  '& .MuiFilledInput-root:before': {
    display: 'none',
  },
  '& .MuiFilledInput-root:after': {
    display: 'none',
  },
  '& .MuiInputBase-input': {
    padding: '8px 12px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#333',
    '&::placeholder': {
      color: '#888',
    },
  },
  '& .MuiAutocomplete-endAdornment': {
    top: '50%',
    transform: 'translateY(-50%)',
    right: '12px',
  },
  '& .MuiFilledInput-root.Mui-disabled': {
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: '#4caf50',
  },
  '& .MuiAutocomplete-listbox': {
    borderRadius: '4px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  },
};
