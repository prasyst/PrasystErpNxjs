
'use client'
import React from 'react';
import { Button, Tooltip, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const CrudButtons = ({
    onAdd,
    onEdit,
    onDelete,
    onView,
    onExit,
    readOnlyMode,
    hideAdd = false,
    hideEdit = false,
    hideDelete = false,
    hideView = false,
    hideExit = false
}) => {
    const buttonSx = {
        backgroundColor: '#39ace2',
        margin: { xs: '0 4px', sm: '0 6px' },
        minWidth: { xs: 40, sm: 46, md: 60 },
        height: { xs: 40, sm: 46, md: 27 },
        "&:disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.12)",
            color: "rgba(0, 0, 0, 0.26)",
            boxShadow: "none",
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                overflowX: 'hidden',
                justifyContent: 'center',
                mt: 2,
                gap: 0,
            }}
        >
            {!hideAdd && (
                <Tooltip title={readOnlyMode ? "Add" : "Save"}>
                    <Button
                        size="small"
                        variant="contained"
                        sx={buttonSx}
                        onClick={onAdd}
                        disabled={!readOnlyMode && false}
                    >
                        {readOnlyMode ? <AddIcon /> : <SaveIcon />}
                    </Button>
                </Tooltip>
            )}

            {!hideEdit && (
                <Tooltip title={readOnlyMode ? "Edit" : "Cancel"}>
                    <Button
                        size="small"
                        variant="contained"
                        sx={buttonSx}
                        onClick={onEdit}
                        disabled={!readOnlyMode && false} 
                    >
                        {readOnlyMode ? <EditIcon /> : <CancelIcon />}
                    </Button>
                </Tooltip>
            )}

        
            {!hideDelete && (
                <Tooltip title="Delete">
                    <Button
                        size="small"
                        variant="contained"
                        sx={buttonSx}
                        onClick={onDelete}
                        disabled={!readOnlyMode}
                    >
                        <DeleteIcon />
                    </Button>
                </Tooltip>
            )}

            {/* Position 4: Print (always shown, disabled in edit/add mode) */}
            {!hideView && (
                <Tooltip title="Print">
                    <Button
                        size="small"
                        variant="contained"
                        sx={buttonSx}
                        onClick={onView}
                        disabled={!readOnlyMode}
                    >
                        <PrintIcon />
                    </Button>
                </Tooltip>
            )}

            {/* Position 5: Exit (always shown, disabled in edit/add mode) */}
            {!hideExit && (
                <Tooltip title="Exit">
                    <Button
                        size="small"
                        variant="contained"
                        sx={buttonSx}
                        onClick={onExit}
                        disabled={!readOnlyMode}
                    >
                        <ExitToAppIcon />
                    </Button>
                </Tooltip>
            )}
        </Box>
    );
};

export default CrudButtons;




