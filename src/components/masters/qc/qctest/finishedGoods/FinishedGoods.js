'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getFormMode } from '@/lib/helpers';
import { TbListSearch } from "react-icons/tb";
import IconButton from '@mui/material/IconButton';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '@/lib/axios';
import { useSearchParams, usePathname } from 'next/navigation';
import AutoVibeWithoutAR from '@/GlobalFunction/CustomAutoComplete/AutoVibeWithoutAR';
import CrudButton from '@/GlobalFunction/CrudButton';
import { textInputSx } from '../../../../../../public/styles/textInputSx';
import { DropInputSx } from '../../../../../../public/styles/dropInputSx';
const FORM_MODE = getFormMode();
const FinishedGoods = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const QC_SUBGROUP_KEY = searchParams.get('QC_SUBGROUP_KEY');
    const [USER_ID, setUSER_ID] = useState(null);
    const [USER_NAME, setUSER_NAME] = useState(null);
    const [FCYR_KEY, setFCYR_KEY] = useState(null);
    const [COBR_ID, setCOBR_ID] = useState(null);
    const [CO_ID, setCO_ID] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [PARTY_KEY, setPARTY_KEY] = useState(null);
    const [form, setForm] = useState({
        QC_SUBGROUP_KEY: QC_SUBGROUP_KEY || '',
        QC_GROUP_KEY: '',
        SearchByCd: '',
    });
    const [qcGroups, setQcGroups] = useState([]);
    const [qcSubGroups, setQcSubGroups] = useState([]);
    const [editableRow, setEditableRow] = useState(null);
    const [currentQC_SUBGROUP_KEY, setCurrentQC_SUBGROUP_KEY] = useState(null)
    const [mode, setMode] = useState(() => FORM_MODE.read);
    const createBlankRow = () => {
        const id = `NEW_${Date.now()}`;
        return {
            QC_PM_ID: id,
            TEST_NAME: '',
            VALUE_TEST: '',
            RANGE_FROM: '',
            RANGE_TO: '',
            REMARK: ''
        };
    };
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        setUSER_ID(localStorage.getItem('USER_ID'));
        setUSER_NAME(localStorage.getItem('USER_NAME'));
        setFCYR_KEY(localStorage.getItem('FCYR_KEY'));
        setCOBR_ID(localStorage.getItem('COBR_ID'));
        setCO_ID(localStorage.getItem('CO_ID'));
        setUserRole(localStorage.getItem('userRole'));
        setPARTY_KEY(localStorage.getItem('PARTY_KEY'));
    }, []);
    useEffect(() => {
        const fetchQcGroups = async () => {
            try {
                const response = await axiosInstance.post("QC_GROUP/GetQC_GROUPDrp", {});
                const { STATUS, DATA } = response.data;
                if (STATUS === 0 && Array.isArray(DATA)) {
                    const validQcGroups = DATA.filter((cat) => cat.QC_GROUP_KEY && cat.QC_GROUP_NAME);
                    setQcGroups(validQcGroups);
                    if (validQcGroups.length > 0 && !form.QC_GROUP_KEY) {
                        setForm((prev) => ({ ...prev, QC_GROUP_KEY: validQcGroups[0].QC_GROUP_KEY }));
                    }
                }
            } catch (error) { console.error("Error fetching QC Groups:", error); }
        };
     //   fetchQcGroups();
    }, []);
    useEffect(() => {
        const fetchQcSubGroups = async () => {
            try {
                const response = await axiosInstance.post("QC_SUBGROUP/GetQC_SUBGROUPDrp", {
                    "QC_GROUP_KEY": form.QC_GROUP_KEY, "FLAG": ""
                });
                const { STATUS, DATA } = response.data;
                if (STATUS === 0 && Array.isArray(DATA)) {
                    setQcSubGroups(DATA);
                    console.log("QC SubGroups:", qcSubGroups);
                    console.log("Form QC_SUBGROUP_KEY:", form.QC_SUBGROUP_KEY);
                    if (DATA.length > 0 && !form.QC_SUBGROUP_KEY) {
                        setForm((prev) => ({ ...prev, QC_SUBGROUP_KEY: DATA[0].QC_SUBGROUP_KEY }));
                    }
                } else {
                    setQcSubGroups([]);
                }
            } catch (error) {
                console.error("Error fetching QC SubGroups:", error);
            }
        };
        if (form.QC_GROUP_KEY) {
           // fetchQcSubGroups();
        } else {
            setQcSubGroups([]);
        }
    }, [form.QC_GROUP_KEY]);
    const fetchRetriveData = useCallback(async (currentQC_SUBGROUP_KEY, flag = "R", isManualSearch = true) => {
        try {
            const response = await axiosInstance.post('QC_SUBGROUP/RetriveQC_SUBGROUP', {
                "FLAG": flag,
                "TBLNAME": "QC_PARAM",
                "FLDNAME": "QC_SUBGROUP_KEY",
                "ID": currentQC_SUBGROUP_KEY,
                "ORDERBYFLD": "",
                "CWHAER": "",
                "CO_ID": CO_ID
            });
            const { data: { STATUS, DATA, RESPONSESTATUSCODE, MESSAGE } } = response;
            if (STATUS === 0 && Array.isArray(DATA) && RESPONSESTATUSCODE == 1) {
                const qcData = DATA[0];
                console.log("Retrieved QC Data:", qcData);
                setForm({
                    QC_GROUP_KEY: qcData.QC_GROUP_KEY,
                    QC_GROUP_NAME: qcData.QC_GROUP_NAME || '',
                    QC_SUBGROUP_KEY: qcData.QC_SUBGROUP_KEY,
                    QC_SUBGROUP_NAME: qcData.QC_SUBGROUP_NAME || '',
                });
                setCurrentQC_SUBGROUP_KEY(qcData.QC_SUBGROUP_KEY);
            }
            else {
                setForm(prev => ({
                    ...prev,
                    QC_GROUP_KEY: '',
                    QC_GROUP_NAME: '',
                    QC_SUBGROUP_KEY: '',
                    QC_SUBGROUP_NAME: '',
                }));
                setQcSubGroups([]);
                setTableData([createBlankRow()]);
                if (isManualSearch) {
                    //  toast.info(MESSAGE || 'No record found');
                }
            }
        } catch (err) { console.error(err); }
    }, [CO_ID]);
    useEffect(() => {
        if (QC_SUBGROUP_KEY) {
            setCurrentQC_SUBGROUP_KEY(QC_SUBGROUP_KEY);
          //  fetchRetriveData(QC_SUBGROUP_KEY);
            setMode(FORM_MODE.add);
        } else {
            setForm((prev) => ({
                ...prev,
                SearchByCd: '',
            }))
            setMode(FORM_MODE.read);
        }
    }, [QC_SUBGROUP_KEY, fetchRetriveData]);
    const clearQueryParams = () => {
        router.replace(pathname, { scroll: false });
    };
    const fetchQcParams = useCallback(async () => {
        if (!form.QC_SUBGROUP_KEY) {
            setTableData([]);
            return;
        }
        try {
            const response = await axiosInstance.post('QC_PARAM/GetQC_PARAMDrp', {
                QC_SUBGROUP_KEY: form.QC_SUBGROUP_KEY,
                FLAG: ''
            });
            const { STATUS, MESSAGE, DATA } = response.data;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const transformedData = DATA.map(item => ({
                    ...item,
                    VALUE_TEST:
                        item.VALUE_TEST === 'Y'
                            ? 'Yes'
                            : item.VALUE_TEST === 'N'
                                ? 'No'
                                : item.VALUE_TEST || ''
                }));
                if (transformedData.length === 0) {
                    setTableData([createBlankRow()]);
                } else {
                    setTableData([...transformedData, createBlankRow()]);
                }
            } else {
                setTableData([createBlankRow()]);
            }
        } catch (error) {
            console.error('Error fetching QC parameters:', error);
            toast.error('Error fetching QC parameters');
            setTableData([]);
        }
    }, [form.QC_SUBGROUP_KEY]);
    useEffect(() => {
       // fetchQcParams();
    }, [fetchQcParams]);
    const handleQcGroupChange = (e, newValue) => {
        clearQueryParams();
        setForm((prev) => ({
            ...prev,
            QC_GROUP_KEY: newValue ? newValue.QC_GROUP_KEY : '',
            QC_SUBGROUP_KEY: '',
        }));
    };
    const handleQcSubGroupChange = (e, newValue) => {
        clearQueryParams();
        setForm((prev) => ({
            ...prev,
            QC_SUBGROUP_KEY: newValue ? newValue.QC_SUBGROUP_KEY : '',
        }));
    };
    const handleCellChange = (rowId, field, value) => {
        setTableData(prev => {
            let updated = prev.map(row => {
                if (row.QC_PM_ID !== rowId) return row;
                if (field === 'VALUE_TEST' && value === 'No') {
                    return {
                        ...row,
                        VALUE_TEST: value,
                        RANGE_FROM: '',
                        RANGE_TO: ''
                    };
                }
                return { ...row, [field]: value };
            });
            const lastRow = updated[updated.length - 1];
            if (lastRow.TEST_NAME?.trim() && lastRow.VALUE_TEST?.trim()) {
                updated.push(createBlankRow());
            }
            return updated;
        });
    };
    const handleDeleteRow = async (rowId) => {
        setTableData(prev => {
            const rowToDelete = prev.find(row => row.QC_PM_ID.toString() === rowId.toString());
            if (
                rowToDelete &&
                !rowToDelete.TEST_NAME?.trim() &&
                !rowToDelete.VALUE_TEST?.trim() &&
                !rowToDelete.RANGE_FROM &&
                !rowToDelete.RANGE_TO &&
                !rowToDelete.REMARK?.trim()
            ) {
                toast.info('Cannot delete blank row without data');
                return prev;
            }
            let filtered = prev.filter(row => row.QC_PM_ID.toString() !== rowId.toString());
            if (!filtered.some(row => !row.TEST_NAME?.trim() && !row.VALUE_TEST?.trim())) {
                filtered.push(createBlankRow());
            }
            return filtered;
        });
        if (editableRow?.toString() === rowId.toString()) setEditableRow(null);
        if (!rowId.toString().startsWith('NEW_')) {
            try {
                const UserName = userRole === 'user' ? USER_NAME : PARTY_KEY;
                const response = await axiosInstance.post(
                    `QC_PARAM/DeleteQC_PARAMDtl?UserName=${UserName}&strCobrid=${COBR_ID}`,
                    { QC_PM_ID: rowId }
                );
                toast.info(response.data.MESSAGE || 'Row deleted from server');
            } catch (error) {
                console.error('Error deleting row:', error);
            }
        }
    };
    const commonCellSx = {
        border: '1px solid #ddd',
        py: 0.2,
        px: 1,
        height: 30,
        verticalAlign: 'middle'
    };
    const inputSx = {
        '& .MuiInputBase-root': {
            fontSize: '0.875rem',
            height: 36,
            padding: '0 6px',
        },
        '& input': {
            padding: '0 !important',
            height: '100%',
            boxSizing: 'border-box'
        }
    };
    const selectSx = {
        height: 36,
        fontSize: '0.875rem',
        '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            padding: '0 6px'
        }
    };
    const buildPayload = (rows) => {
        return rows.map(row => ({
            QC_PM_ID: typeof row.QC_PM_ID === 'number' ? row.QC_PM_ID : "0",
            TEST_NAME: row.TEST_NAME,
            QC_SUBGROUP_KEY: form.QC_SUBGROUP_KEY,
            VALUE_TEST: row.VALUE_TEST === 'Yes' ? 'Y' : 'N',
            RANGE_FROM: row.VALUE_TEST === 'Yes' ? Number(row.RANGE_FROM || 0) : 0,
            RANGE_TO: row.VALUE_TEST === 'Yes' ? Number(row.RANGE_TO || 0) : 0,
            REMARK: row.REMARK || '',
            STATUS: '1',
            CREATED_BY: 1
        }));
    };
    const handleSubmit = async () => {
        try {
            const payloadRows = tableData.filter(
                row => row.TEST_NAME?.trim() || row.VALUE_TEST?.trim()
            );

            let response;

            if (payloadRows.length === 0) {
                response = await axiosInstance.post(
                    `QC_PARAM/InsertQC_PARAM?UserName=${USER_NAME}&strCobrid=${COBR_ID}`,
                    buildPayload(tableData)
                );
            } else {
                response = await axiosInstance.post(
                    `QC_PARAM/UpdateQC_PARAM?UserName=${USER_NAME}&strCobrid=${COBR_ID}`,
                    buildPayload(payloadRows)
                );
            }

            const { STATUS, MESSAGE } = response.data;

            // ✅ ALWAYS show API message
            if (STATUS === 0) {
                toast.success(MESSAGE || 'Operation successful');
            } else {
                toast.warning(MESSAGE || 'Operation failed');
                return; // stop further execution
            }

            setEditableRow(null);

            // 🔥 IMPORTANT: isolate refresh call
            try {
                await fetchQcParams();
            } catch (err) {
                console.error('Fetch QC Params failed:', err);
            }

        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Failed to save QC Parameters');
        }
    };

    const handleCancel = () => {
        setEditableRow(null)
        setMode(FORM_MODE.read)
    };
    const handlePrevious = async () => {
      //  await fetchRetriveData(currentQC_SUBGROUP_KEY, "P");
        setForm((prev) => ({ ...prev, SearchByCd: '' }));
    };
    const handleNext = async () => {
        // if (currentQC_SUBGROUP_KEY) {
        //     await fetchRetriveData(currentQC_SUBGROUP_KEY, "N");
        // }
        setForm((prev) => ({ ...prev, SearchByCd: '' }));
    };
    const handleTable = () => {
       // router.push("/masters/qc/qcparameter/qcparatable/");
    };
    const handleExit = async () => {
      //  router.push("/masterpage/?activeTab=qc");
    };
    const handleEdit = () => { }
    const handlePrint = async () => {
        // try {
        //     const response = await axiosInstance.post(`/QC_PARAM/GetQC_PARAMDashBoard?currentPage=1&limit=5000`, {
        //         "SearchText": ""
        //     });
        //     const { data: { STATUS, DATA } } = response;
        //     if (STATUS === 0 && Array.isArray(DATA)) {
        //         const formattedData = DATA.map(row => ({
        //             ...row,
        //             STATUS: row.STATUS === "1" ? "Active" : "Inactive"
        //         }));
        //         const asPdf = pdf(<PrintFinish rows={formattedData} />);
        //         const blob = await asPdf.toBlob();
        //         const url = URL.createObjectURL(blob);
        //         const newTab = window.open(url, '_blank');
        //         if (newTab) {
        //             newTab.focus();
        //         }
        //         setTimeout(() => {
        //             URL.revokeObjectURL(url);
        //         }, 100);
        //     }
        // } catch (error) {
        //     console.error("Print Error:", error);
        // }
    };
    const handleDeleteAll = () => { }
    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentQC_SUBGROUP_KEY(null);
        setForm((prevForm) => ({
            ...prevForm,
            SearchByCd: '',
        }));
    };
    const handleEnterKeyAddRow = (e, currentRowId) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        setTableData(prev => {
            const currentRow = prev.find(r => r.QC_PM_ID === currentRowId);
            if (
                !currentRow ||
                !currentRow.TEST_NAME?.trim()
            ) {
                return prev;
            }
            const newRow = createBlankRow();
            setEditableRow(newRow.QC_PM_ID);
            return [...prev, newRow];
        });
    };
    return (
        <Grid container sx={{ bgcolor: '#f5f5f5', py: 4 }}>
            <ToastContainer />
            <Grid item xs={12} sx={{ mx: 'auto', px: { xs: 4, sm: 6, md: 8, lg: 12 }, width: '100%' }}>
                <Typography variant="h6" align="center">
                    QC Test (Finish Goods)
                </Typography>
                <Grid container justifyContent="space-between"
                    sx={{ marginInline: { xs: '5%', sm: '5%', md: '5%', lg: '0%', xl: '0%' } }}
                    spacing={2}
                >
                    <Grid>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4) !important' }}
                            disabled={mode !== FORM_MODE.read}
                            onClick={handlePrevious}
                        >
                            <KeyboardArrowLeftIcon />
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa) !important', ml: 1 }}
                            disabled={mode !== FORM_MODE.read}
                            onClick={handleNext}
                        >
                            <NavigateNextIcon />
                        </Button>
                    </Grid>
                    <Grid sx={{ display: 'flex' }}>
                        <TextField
                            placeholder="Search By Code"
                            variant="filled"
                            sx={{
                                backgroundColor: '#e0f7fa',
                                '& .MuiInputBase-input': {
                                    paddingBlock: { xs: '8px', md: '4px' },
                                    paddingLeft: { xs: '8px', md: '8px' },
                                },
                            }}
                            value={form.SearchByCd}
                            onChange={(e) => setForm({ ...form, SearchByCd: e.target.value })}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    fetchRetriveData(e.target.value, 'R', true);
                                }
                            }}
                        />
                    </Grid>
                    <Grid sx={{ display: 'flex' }}>
                        <TbListSearch onClick={handleTable} style={{ color: 'rgb(99, 91, 255)', width: '40px', height: '32px' }} />
                    </Grid>
                    <Grid sx={{ display: "flex", justifyContent: "end", marginRight: '-6px' }}>
                        <CrudButton
                            mode={mode}
                            onAdd={handleAdd}
                            onEdit={handleEdit}
                            onDelete={handleDeleteAll}
                            onView={handlePrint}
                            onExit={handleExit}
                            readOnlyMode={mode === FORM_MODE.read}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <AutoVibeWithoutAR
                            id="QC_GROUP_KEY"
                            options={qcGroups}
                            getOptionLabel={(option) => option.QC_GROUP_NAME || ''}
                            label="Doc Type"
                            value={qcGroups.find((option) => option.QC_GROUP_KEY === form.QC_GROUP_KEY) || null}
                            onChange={handleQcGroupChange}
                            disabled={mode == FORM_MODE.read}
                            fullWidth
                            sx={{ ...DropInputSx, minWidth: 350 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AutoVibeWithoutAR
                            id="QC_SUBGROUP_KEY"
                            options={qcSubGroups}
                            getOptionLabel={(option) => option.QC_SUBGROUP_NAME || ''}
                            label="Party Name"
                            value={qcSubGroups.find((option) => option.QC_SUBGROUP_KEY === form.QC_SUBGROUP_KEY) || null}
                            onChange={handleQcSubGroupChange}
                            fullWidth
                            sx={{ ...DropInputSx, minWidth: 350 }}
                            disabled={mode == FORM_MODE.read}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AutoVibeWithoutAR
                            id="QC_SUBGROUP_KEY"
                            options={qcSubGroups}
                            getOptionLabel={(option) => option.QC_SUBGROUP_NAME || ''}
                            label="Doc No."
                            value={qcSubGroups.find((option) => option.QC_SUBGROUP_KEY === form.QC_SUBGROUP_KEY) || null}
                            onChange={handleQcSubGroupChange}
                            fullWidth
                            sx={{ ...DropInputSx, minWidth: 350 }}
                            disabled={mode == FORM_MODE.read}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <AutoVibeWithoutAR
                            id="QC_SUBGROUP_KEY"
                            options={qcSubGroups}
                            getOptionLabel={(option) => option.QC_SUBGROUP_NAME || ''}
                            label="SubGroup name"
                            value={qcSubGroups.find((option) => option.QC_SUBGROUP_KEY === form.QC_SUBGROUP_KEY) || null}
                            onChange={handleQcSubGroupChange}
                            fullWidth
                            sx={{ ...DropInputSx, minWidth: 350 }}
                            disabled={mode == FORM_MODE.read}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <AutoVibeWithoutAR
                            id="QC_SUBGROUP_KEY"
                            options={qcSubGroups}
                            getOptionLabel={(option) => option.QC_SUBGROUP_NAME || ''}
                            label="Item"
                            value={qcSubGroups.find((option) => option.QC_SUBGROUP_KEY === form.QC_SUBGROUP_KEY) || null}
                            onChange={handleQcSubGroupChange}
                            fullWidth
                            sx={{ ...DropInputSx, minWidth: 350 }}
                            disabled={mode == FORM_MODE.read}
                        />
                    </Grid>
                </Grid>
                <TableContainer sx={{ minHeight: 100, maxHeight: 200, overflowY: 'auto', mt: 1, width: '100%', borderRadius: 4 }}>
                    <Table stickyHeader size="medium" sx={{ width: '100%', border: '1px solid #ddd', borderRadius: 2 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold' }}>Test Name</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '10%' }}>Value Test</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '10%' }}>Range From</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '10%' }}>Range To</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '30%' }}>Uservalue</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '30%' }}>Result</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '30%' }}>TestRemark</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '30%' }}>Final Result</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '7%' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row) => {
                                const isEditable = editableRow === row.QC_PM_ID && mode !== FORM_MODE.read;
                                return (
                                    <TableRow
                                        key={row.QC_PM_ID}
                                        hover
                                        onClick={() => setEditableRow(row.QC_PM_ID)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }
                                        }}
                                    >
                                        <TableCell sx={commonCellSx}>
                                            {isEditable ? (
                                                <TextField
                                                    value={row.TEST_NAME || ''}
                                                    onChange={(e) =>
                                                        handleCellChange(row.QC_PM_ID, 'TEST_NAME', e.target.value)
                                                    }
                                                    onKeyDown={(e) => handleEnterKeyAddRow(e, row.QC_PM_ID)}
                                                    variant="standard"
                                                    fullWidth
                                                    sx={inputSx}
                                                />
                                            ) : (
                                                row.TEST_NAME || '-'
                                            )}
                                        </TableCell>
                                        <TableCell sx={commonCellSx}>
                                            {isEditable ? (
                                                <Select
                                                    value={row.VALUE_TEST || ''}
                                                    onChange={(e) =>
                                                        handleCellChange(row.QC_PM_ID, 'VALUE_TEST', e.target.value)
                                                    }
                                                    variant="standard"
                                                    fullWidth
                                                    sx={selectSx}
                                                >
                                                    <MenuItem value="Yes">Yes</MenuItem>
                                                    <MenuItem value="No">No</MenuItem>
                                                </Select>
                                            ) : (
                                                row.VALUE_TEST || '-'
                                            )}
                                        </TableCell>
                                        <TableCell sx={commonCellSx}>
                                            {isEditable ? (
                                                <TextField
                                                    type="number"
                                                    value={row.RANGE_FROM ?? ''}
                                                    onChange={(e) =>
                                                        handleCellChange(row.QC_PM_ID, 'RANGE_FROM', e.target.value)
                                                    }
                                                    variant="standard"
                                                    fullWidth
                                                    sx={inputSx} disabled={row.VALUE_TEST !== 'Yes'}
                                                />
                                            ) : (
                                                row.RANGE_FROM ?? '-'
                                            )}
                                        </TableCell>
                                        <TableCell sx={commonCellSx}>
                                            {isEditable ? (
                                                <TextField
                                                    type="number"
                                                    value={row.RANGE_TO ?? ''}
                                                    onChange={(e) =>
                                                        handleCellChange(row.QC_PM_ID, 'RANGE_TO', e.target.value)
                                                    }
                                                    variant="standard"
                                                    fullWidth
                                                    sx={inputSx} disabled={row.VALUE_TEST !== 'Yes'}
                                                />
                                            ) : (
                                                row.RANGE_TO ?? '-'
                                            )}
                                        </TableCell>
                                        <TableCell sx={commonCellSx}>
                                            {isEditable ? (
                                                <TextField
                                                    value={row.USER_VALUE || ''}
                                                    onChange={(e) =>
                                                        handleCellChange(row.QC_PM_ID, 'USER_VALUE', e.target.value)
                                                    }
                                                    onKeyDown={(e) => handleEnterKeyAddRow(e, row.QC_PM_ID)}
                                                    variant="standard"
                                                    fullWidth
                                                    sx={inputSx}
                                                />
                                            ) : (
                                                row.USER_VALUE || '-'
                                            )}
                                        </TableCell>
                                        <TableCell sx={commonCellSx}>
                                            {isEditable ? (
                                                <TextField
                                                    value={row.RESULT || ''}
                                                    onChange={(e) =>
                                                        handleCellChange(row.QC_PM_ID, 'RESULT', e.target.value)
                                                    }
                                                    onKeyDown={(e) => handleEnterKeyAddRow(e, row.QC_PM_ID)}
                                                    variant="standard"
                                                    fullWidth
                                                    sx={inputSx}
                                                />
                                            ) : (
                                                row.RESULT || '-'
                                            )}
                                        </TableCell>
                                        <TableCell sx={commonCellSx}>
                                            {isEditable ? (
                                                <TextField
                                                    value={row.REMARK || ''}
                                                    onChange={(e) =>
                                                        handleCellChange(row.QC_PM_ID, 'REMARK', e.target.value)
                                                    }
                                                    onKeyDown={(e) => handleEnterKeyAddRow(e, row.QC_PM_ID)}
                                                    variant="standard"
                                                    fullWidth
                                                    sx={inputSx}
                                                />
                                            ) : (
                                                row.REMARK || '-'
                                            )}
                                        </TableCell>
                                        <TableCell sx={commonCellSx}>
                                            {isEditable ? (
                                                <Select
                                                    value={row.FINAL_RESULT || ''}
                                                    onChange={(e) =>
                                                        handleCellChange(row.QC_PM_ID, 'FINAL_RESULT', e.target.value)
                                                    }
                                                    variant="standard"
                                                    fullWidth
                                                    sx={selectSx}
                                                >
                                                    <MenuItem value="Yes">Pass</MenuItem>
                                                    <MenuItem value="No">Fail</MenuItem>
                                                </Select>
                                            ) : (
                                                row.FINAL_RESULT || '-'
                                            )}
                                        </TableCell>
                                        <TableCell
                                            sx={{ ...commonCellSx, alignItems: 'center', }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <IconButton size="small"
                                                color="error"
                                                onClick={() => handleDeleteRow(row.QC_PM_ID)}
                                                sx={{ padding: '2px' }}
                                                disabled={mode === FORM_MODE.read}
                                            >
                                                <DeleteIcon sx={{ fontSize: 20, color: 'error.main' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <AutoVibeWithoutAR
                            id="QC_GROUP_KEY"
                            options={qcGroups}
                            getOptionLabel={(option) => option.QC_GROUP_NAME || ''}
                            label="Decision"
                            value={qcGroups.find((option) => option.QC_GROUP_KEY === form.QC_GROUP_KEY) || null}
                            onChange={handleQcGroupChange}
                            disabled={mode == FORM_MODE.read}
                            fullWidth
                            sx={{ ...DropInputSx, minWidth: 350 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Decision Remark"
                            variant="filled"
                            fullWidth
                            //    onChange={handleInputChange}
                            //    value={form.D}
                            //    name="QC_GROUP_LST_CODE"
                            //    disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Remark/Instructions"
                            variant="filled"
                            fullWidth
                            //    onChange={handleInputChange}
                            //    value={form.D}
                            //    name="QC_GROUP_LST_CODE"
                            //    disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>



                </Grid>

                <Grid sx={{
                    display: "flex",
                    justifyContent: "end",
                    ml: '56.8%',
                    position: 'relative',
                    top: 10
                }}>
                    {mode === FORM_MODE.read && (
                        <>
                            <Button variant="contained"
                                sx={{
                                    background: 'linear-gradient(290deg, #d4d4d4, #ffffff)',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                onClick={handleAdd} >
                                Submit
                            </Button>
                            <Button variant="contained"
                                sx={{
                                    background: 'linear-gradient(290deg, #a7c5e9, #ffffff)',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                onClick={handleEdit}
                                disabled
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                    {(mode === FORM_MODE.edit || mode === FORM_MODE.add) && (
                        <>
                            <Button variant="contained"
                                sx={{
                                    backgroundColor: '#635bff',
                                    color: '#fff',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                // onClick={handleSubmit}
                                >
                                Submit
                            </Button>
                            <Button variant="contained"
                                sx={{
                                    backgroundColor: '#635bff',
                                    color: '#fff',
                                    margin: { xs: '0 4px', sm: '0 6px' },
                                    minWidth: { xs: 40, sm: 46, md: 60 },
                                    height: { xs: 40, sm: 46, md: 30 },
                                }}
                                onClick={handleCancel}>
                                Cancel
                            </Button>
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid >
    );
};
export default FinishedGoods;