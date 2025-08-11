import React from 'react';
import { Button, Tooltip, Grid, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const CrudButton = ({
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
                <Tooltip title="Add">
                    <Button size="small" variant="contained" sx={buttonSx}
                        onClick={onAdd}
                        disabled={!readOnlyMode}
                    >
                        <AddIcon />
                    </Button>
                </Tooltip>
            )}
            {!hideEdit && (
                <Tooltip title="Edit">
                    <Button size="small" variant="contained"
                        sx={buttonSx} onClick={onEdit}
                        disabled={!readOnlyMode}
                    >
                        <EditIcon />
                    </Button>
                </Tooltip>
            )}
            {!hideDelete && (
                <Tooltip title="Delete">
                    <Button size="small" variant="contained" disabled={!readOnlyMode} sx={buttonSx} onClick={onDelete}>
                        <DeleteIcon />
                    </Button>
                </Tooltip>
            )}
            {!hideView && (
                <Tooltip title="Print">
                    <Button size="small" variant="contained" sx={buttonSx} disabled={!readOnlyMode} onClick={onView}>
                        <PrintIcon />
                    </Button>
                </Tooltip>
            )}
            {!hideExit && (
                <Tooltip title="Exit">
                    <Button size="small" variant="contained" disabled={!readOnlyMode} sx={buttonSx} onClick={onExit}>
                        <ExitToAppIcon />
                    </Button>
                </Tooltip>
            )}

        </Box>
    );
};

export default CrudButton;
