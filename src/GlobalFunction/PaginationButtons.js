// import React from 'react';
// import { Button, Grid, Stack, Tooltip } from '@mui/material';
// import FirstPageIcon from '@mui/icons-material/FirstPage';
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// import LastPageIcon from '@mui/icons-material/LastPage';

// const PaginationButtons = ({
//     mode,
//     FORM_MODE,
//     currentKey,
//     onFirst,
//     onPrevious,
//     onNext,
//     onLast,
//     sx = {},
//     buttonSx = {}
// }) => {
//     const isReadMode = mode === FORM_MODE.read;
//     const isFirstDisabled = !isReadMode || !currentKey || currentKey === 1;
//     const isNavDisabled = !isReadMode || !currentKey;

//     return (
//         <Grid sx={{ width: { xs: '100%', sm: 'auto' }, ...sx }}>
//             <Stack direction="row" spacing={1}>
//                 <Tooltip title="First">
//                     <Button
//                         variant="contained"
//                         size="small"
//                         className="three-d-button-first"
//                         sx={buttonSx}
//                         onClick={onFirst}
//                         disabled={isFirstDisabled}
//                     >
//                         <FirstPageIcon />
//                     </Button>
//                 </Tooltip>
//                 <Tooltip title="Previous">
//                     <Button
//                         variant="contained"
//                         size="small"
//                         className="three-d-button-previous"
//                         sx={buttonSx}
//                         onClick={onPrevious}
//                         disabled={isFirstDisabled}
//                     >
//                         <KeyboardArrowLeftIcon />
//                     </Button>
//                 </Tooltip>
//                 <Tooltip title="Next">
//                     <Button
//                         variant="contained"
//                         size="small"
//                         className="three-d-button-next"
//                         sx={buttonSx}
//                         onClick={onNext}
//                         disabled={isNavDisabled}
//                     >
//                         <NavigateNextIcon />
//                     </Button>
//                 </Tooltip>
//                 <Tooltip title="Last">
//                     <Button
//                         variant="contained"
//                         size="small"
//                         className="three-d-button-last"
//                         sx={buttonSx}
//                         onClick={onLast}
//                         disabled={isNavDisabled}
//                     >
//                         <LastPageIcon />
//                     </Button>
//                 </Tooltip>
//             </Stack>
//         </Grid>
//     );
// };

// export default PaginationButtons;


'use client'
import React from 'react';
import { Button, Grid, Stack, Tooltip } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';

const PaginationButtons = ({
    mode,
    FORM_MODE,
    currentKey,
    onFirst,
    onPrevious,
    onNext,
    onLast,
    sx = {},
    buttonSx = {}
}) => {
    const isReadMode = mode === FORM_MODE.read || mode === "view";

    const renderButtonWithTooltip = (title, onClick, disabled, className, icon) => (
        <Tooltip title={title}>
            <span>
                <Button
                    variant="contained"
                    size="small"
                    className={className}
                    sx={buttonSx}
                    onClick={onClick}
                    disabled={disabled}
                >
                    {icon}
                </Button>
            </span>
        </Tooltip>
    );

    return (
        <Grid sx={{ width: { xs: '100%', sm: 'auto' }, ...sx }}>
            <Stack direction="row" spacing={0}>
                {renderButtonWithTooltip("First", onFirst, !isReadMode, "three-d-button-first", <FirstPageIcon />)}
                {renderButtonWithTooltip("Previous", onPrevious, !isReadMode, "three-d-button-previous", <KeyboardArrowLeftIcon />)}
                {renderButtonWithTooltip("Next", onNext, !isReadMode, "three-d-button-next", <NavigateNextIcon />)}
                {renderButtonWithTooltip("Last", onLast, !isReadMode, "three-d-button-last", <LastPageIcon />)}
            </Stack>
        </Grid>
    );
};

export default PaginationButtons;
