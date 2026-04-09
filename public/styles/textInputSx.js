
// export const textInputSx = {
//     '& .MuiInputBase-root': {
//         height: 36,
//         fontSize: '14px',
//     },
//     '& .MuiInputLabel-root': {
//         fontSize: '14px',
//         top: '-8px',
//     },
//     '& .MuiFilledInput-root': {
//         backgroundColor: '#fafafa',
//         border: '1px solid #e0e0e0',
//         borderRadius: '6px',
//         overflow: 'hidden',
//         height: 36,
//         fontSize: '14px', pt: '12px'
//     },
//     '& .MuiFilledInput-root:before': {
//         display: 'none',
//     },
//     '& .MuiFilledInput-root:after': {
//         display: 'none',
//     },
//     '& .MuiInputBase-input': {
//         padding: '12px 12px !important',
//         fontSize: '14px !important',
//         lineHeight: '1.4',
//     },
//     '& .MuiFilledInput-root.Mui-disabled': {
//         backgroundColor: '#fff'
//     }
// };


export const textInputSx = {
    '& .MuiInputBase-root': {
        height: 38,
        fontSize: '15px',
        borderRadius: '4px',
        backgroundColor: '#fafafa',
        border: '1px solid #e0e0e0',
        padding: '6px 12px',
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
        backgroundColor: '#fafafa',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    '& .MuiFilledInput-root:before': {
        display: 'none',
    },
    '& .MuiFilledInput-root:after': {
        display: 'none',
    },
    '& .MuiInputBase-input': {
        padding: '8px 12px',
        fontSize: '15px',
        lineHeight: '1.5',
        color: '#333',
        '&::placeholder': {
            color: '#888',
        },
    },
    '& .MuiInputBase-root.Mui-focused': {
        borderColor: '#4caf50',
        boxShadow: '0 0 5px rgba(76, 175, 80, 0.2)',
    },
    '& .MuiFilledInput-root.Mui-disabled': {
        backgroundColor: '#f1f1f1',
        border: '1px solid #ddd',
    },
    '& .MuiFilledInput-root.Mui-disabled': {
        backgroundColor: '#fff'
    }
};