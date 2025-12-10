// styles/inputStyles.js
export const inputStyle = {
  '& .MuiInputBase-root': {
    height: 44,
    fontSize: '0.875rem',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    '&:hover': {
      backgroundColor: '#f8fafc',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.15)',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    color: '#4b5563',
    '&.Mui-focused': {
      color: '#2563eb',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#9ca3af',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2563eb',
    borderWidth: 2,
  },
};
