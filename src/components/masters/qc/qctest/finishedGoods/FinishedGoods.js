'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Grid, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, TextField, Autocomplete } from '@mui/material';
import { useRouter } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getFormMode } from '@/lib/helpers';
import { TbListSearch } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '@/lib/axios';
import CrudButton from '@/GlobalFunction/CrudButton';

import { textInputSx } from '../../../../../../public/styles/textInputSx';
import { inputStyle } from '../../../../../../public/styles/inputStyleDrp';
import PrintFinish from './PrintFinish';
const FORM_MODE = getFormMode();
const FinishedGoods = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        PARTY_KEY: '',
        DOC_KEY: '',
        DOC_DTL_ID: '',
        QC_SUBGROUP_KEY: '',
        SearchByCd: '',
        QC_TEST_ID: 0,
        PASS_PARTIAL_REMARK: '',
        REMARK: '',
    });
    const [partyDrp, setPartyDrp] = useState([]);
    const [docNoDrp, setDocNoDrp] = useState([]);
    const [dtlItems, setDtlItems] = useState([]);
    const [qcSubGroups, setQcSubGroups] = useState([]);
    const [editableRow, setEditableRow] = useState(null);
    const [mode, setMode] = useState(() => FORM_MODE.read);
    const [tableData, setTableData] = useState([]);
    const [decision, setDecision] = useState([]);    //PARTY DRP
    useEffect(() => {
        const fetchPartyDrp = async () => {
            try {
                const response = await axiosInstance.post("/Party/GetPartyDashBoard?currentPage=1&limit=25", {
                    "SearchText": "",
                    "PARTY_CAT": "ps,pj,pr,pa",
                    "FLAG": ""
                });
                const { STATUS, DATA } = response.data;
                if (STATUS === 0 && Array.isArray(DATA)) {
                    const validParty = DATA.filter((p) => p.PARTY_KEY);
                    setPartyDrp(validParty);
                    setForm((prev) => ({
                        ...prev, PARTY_KEY: validParty[0]?.PARTY_KEY
                    }));
                } else {
                    setPartyDrp([]);
                }
            } catch (error) { console.error("Error fetching partydrp:", error); }
        };
        fetchPartyDrp();
    }, []);
    //DOC NO DRP
    const handlePartyChange = (e, newValue) => {
        const selectedPartyKey = newValue ? newValue.PARTY_KEY : '';
        // Reset dependent fields when PARTY_KEY is cleared
        if (!selectedPartyKey) {
            setForm(prev => ({
                ...prev,
                PARTY_KEY: '',
                DOC_KEY: '',
                DOC_DTL_ID: '',
                QC_SUBGROUP_KEY: '',
            }));
            setDocNoDrp([]);
            setDtlItems([]);
            setQcSubGroups([]);
            setTableData([]);
        } else {
            // If PARTY_KEY is selected, fetch and populate the DOC_KEY, DOC_DTL_ID, and QC_SUBGROUP_KEY
            setForm(prev => ({
                ...prev,
                PARTY_KEY: selectedPartyKey,
            }));
            const fetchDocNoDrp = async () => {
                try {
                    const FCYR_KEY = localStorage.getItem('FCYR_KEY');
                    const COBR_ID = localStorage.getItem('COBR_ID');
                    const response = await axiosInstance.post("QC_TEST/GetQC_DocTypeDrp", {
                        QC_TYPE: "FG",
                        PARTY_KEY: selectedPartyKey,
                        PARTYDTL_ID: 0,
                        DOC_KEY: "",
                        DOC_DTL_ID: 0,
                        FLAG: "FG",
                        DBFLAG: "PartySelection",
                        QC_SUBGROUP_KEY: "",
                        FCYR_KEY,
                        COBR_ID
                    });
                    const { STATUS, DATA } = response.data;
                    if (STATUS === 0 && Array.isArray(DATA)) {
                        const validDocNo = DATA.filter(p => p.DOC_KEY);
                        setDocNoDrp(validDocNo);
                        setForm(prev => ({
                            ...prev,
                            DOC_KEY: validDocNo[0]?.DOC_KEY || '',
                            DOC_DTL_ID: '',
                            QC_SUBGROUP_KEY: '',
                        }));
                        setTableData([]);
                    } else {
                        setDocNoDrp([]);
                        setForm(prev => ({
                            ...prev,
                            DOC_KEY: '',
                            DOC_DTL_ID: '',
                            QC_SUBGROUP_KEY: '',
                        }));
                        setTableData([]);
                    }
                } catch (error) {
                    console.error("Error fetching DOC_NO dropdown:", error);
                }
            };
            fetchDocNoDrp();
        }
    };
    //ITM DRP
    useEffect(() => {
        const FCYR_KEY = localStorage.getItem('FCYR_KEY');
        const COBR_ID = localStorage.getItem('COBR_ID');
        if (!form.DOC_KEY) {
            setDtlItems([]);
            setForm((prev) => ({ ...prev, DOC_DTL_ID: '' }));
            return;
        }
        if (FCYR_KEY && COBR_ID && form.DOC_KEY) {
            const fetchItemDrp = async () => {
                try {
                    const response = await axiosInstance.post("QC_TEST/GetQC_DocTypeDrp", {
                        QC_TYPE: "FG",
                        PARTY_KEY: form.PARTY_KEY,
                        PARTYDTL_ID: 0,
                        DOC_KEY: form.DOC_KEY,
                        DOC_DTL_ID: 0,
                        FLAG: "FG",
                        DBFLAG: "DocKeySelection",
                        QC_SUBGROUP_KEY: "",
                        FCYR_KEY,
                        COBR_ID
                    });
                    const { STATUS, DATA } = response.data;
                    if (STATUS === 0 && Array.isArray(DATA) && DATA.length > 0) {
                        const validDtlItems = DATA.filter((p) => p.DOC_DTL_ID);
                        setDtlItems(validDtlItems);
                        setForm(prev => ({ ...prev, DOC_DTL_ID: validDtlItems[0]?.DOC_DTL_ID }));
                    } else {
                        setDtlItems([]);
                        setForm(prev => ({ ...prev, DOC_DTL_ID: '' }));
                    }
                } catch (error) {
                    console.error("Error fetching DOC_DTL_ID:", error);
                }
            };
            fetchItemDrp();
        }
    }, [form.DOC_KEY, form.PARTY_KEY]);
    //SUBGRP DRP
    useEffect(() => {
        const FCYR_KEY = localStorage.getItem('FCYR_KEY');
        const COBR_ID = localStorage.getItem('COBR_ID');
        if (!form.DOC_DTL_ID) {
            setQcSubGroups([]);
            setForm((prev) => ({ ...prev, QC_SUBGROUP_KEY: '' }));
            return;
        }
        if (FCYR_KEY && COBR_ID && form.DOC_DTL_ID) {
            const fetchQcSubGroups = async () => {
                try {
                    const response = await axiosInstance.post("QC_TEST/GetQC_DocTypeDrp", {
                        QC_TYPE: "FG",
                        PARTY_KEY: form.PARTY_KEY,
                        PARTYDTL_ID: 0,
                        DOC_KEY: form.DOC_KEY,
                        DOC_DTL_ID: form.DOC_DTL_ID,
                        // DOC_DTL_ID: "33656",
                        FLAG: "FG",
                        DBFLAG: "DocDtlIdSelection",
                        QC_SUBGROUP_KEY: "",
                        FCYR_KEY,
                        COBR_ID
                    });
                    const { STATUS, DATA } = response.data;
                    if (STATUS === 0 && Array.isArray(DATA) && DATA.length > 0) {
                        const firstValid = DATA.filter(item => item.QC_SUBGROUP_KEY);
                        setQcSubGroups(firstValid);
                        setForm(prev => ({ ...prev, QC_SUBGROUP_KEY: firstValid[0]?.QC_SUBGROUP_KEY }));
                    } else {
                        setQcSubGroups([]);
                        setForm(prev => ({ ...prev, QC_SUBGROUP_KEY: '' }));
                        setTableData([])
                    }
                } catch (error) {
                    console.error("Error fetching QC SubGroups:", error);
                    setQcSubGroups([]);
                    setForm(prev => ({ ...prev, QC_SUBGROUP_KEY: '' }));
                }
            };
            fetchQcSubGroups();
        }
    }, [form.DOC_DTL_ID, form.DOC_KEY, form.PARTY_KEY, form.QC_SUBGROUP_KEY]);
    useEffect(() => {
        const fetchDecisionDrp = async () => {
            try {
                const response = await axiosInstance.post("QC_TEST/GetQC_TESTDrp", {
                    "FLAG": "DECISION_STATUS",
                    "QC_SUBGROUP_KEY": ""
                });
                const validDecision = response.data.DATA || [];
                if (validDecision.length > 0) {
                    setDecision(validDecision);
                    const currentDocStillValid = validDecision.some(item => item.DECISION_STATUS === form.DECISION_STATUS);
                    if (!currentDocStillValid) {
                        setForm(prev => ({
                            ...prev,
                            DECISION_STATUS: validDecision[0].DECISION_STATUS,
                        }));
                    }
                } else {
                    setDocNoDrp([]);
                    setForm(prev => ({
                        ...prev,
                        DECISION_STATUS: ''
                    }));
                }
            } catch (error) {
                console.error("Error fetching decision:", error);
            }
        };
        fetchDecisionDrp();
    }, []);
    const fetchTableData = useCallback(async () => {
        const FCYR_KEY = localStorage.getItem('FCYR_KEY');
        const COBR_ID = localStorage.getItem('COBR_ID');
        if (FCYR_KEY && COBR_ID) {
            try {
                const response = await axiosInstance.post('QC_TEST/GetQC_DocTypeDrp', {
                    "QC_TYPE": "Finished Goods",
                    "PARTY_KEY": form.PARTY_KEY,
                    "PARTYDTL_ID": 0,
                    "DOC_KEY": form.DOC_KEY,
                    "DOC_DTL_ID": form.DOC_DTL_ID,
                    "FLAG": "FG",
                    "DBFLAG": "QC_SUBGROUPSelection",
                    "QC_SUBGROUP_KEY": form.QC_SUBGROUP_KEY,
                    "FCYR_KEY": FCYR_KEY,
                    "COBR_ID": COBR_ID
                });
                const { data: { STATUS, DATA, RESPONSESTATUSCODE } } = response;
                if (STATUS === 0 && RESPONSESTATUSCODE === 1) {
                    const qcData = DATA.QC_TESTList[0]; // Assuming the first item
                    // const qcSubGroupData = DATA.QC_TESTList.map((item) => ({
                    //     QC_SUBGROUP_KEY: item.QC_SUBGROUP_KEY,
                    //     QC_SUBGROUP_NAME: item.QC_SUBGROUP_NAME,
                    // }));
                    setForm((prev) => ({
                        ...prev,
                        PARTY_KEY: qcData.PARTY_KEY,
                        DOC_KEY: qcData.DOC_KEY,
                        DOC_DTL_ID: qcData.DOC_DTL_ID,
                        QC_SUBGROUP_KEY: qcData.QC_SUBGROUP_KEY,
                        QC_TEST_ID: qcData.QC_TEST_ID || 0,
                        PASS_PARTIAL_REMARK: qcData.PASS_PARTIAL_REMARK || '',
                        REMARK: qcData.REMARK || ''
                    }));
                    setTableData(qcData.QC_TESTDTLEntities.map(item => ({
                        ...item, // Retain existing data
                        USER_VALUE: item.USER_VALUE || '',
                        RESULT: item.RESULT,
                        FINAL_RESULT: item.FINAL_RESULT,
                        REMARK: item.TEST_REMARK
                    })));
                }
                else {
                    setTableData([]);
                }
            } catch (err) { console.error(err); }
        }
    }, [form.PARTY_KEY, form.DOC_KEY, form.DOC_DTL_ID, form.QC_SUBGROUP_KEY]);
    useEffect(() => {
        if (form.QC_SUBGROUP_KEY) {
            fetchTableData();
        } else {
            setTableData([]);
        }
    }, [form.QC_SUBGROUP_KEY, fetchTableData]);
    // const handlePartyChange = (e, newValue) => {
    //     const selectedPartyKey = newValue ? newValue.PARTY_KEY : '';
    //     setForm((prev) => ({
    //         ...prev,
    //         PARTY_KEY: selectedPartyKey,
    //     }));
    //     setTableData([]);
    // };
    const handleDocNoChange = (e, newValue) => {
        const selectedDocKey = newValue ? newValue.DOC_KEY : '';
        setForm((prev) => ({
            ...prev,
            DOC_KEY: selectedDocKey,
            DOC_DTL_ID: '',
            QC_SUBGROUP_KEY: '',
        }));
        setDtlItems([]);
        setQcSubGroups([]);
        setTableData([]);
    };
    const handleQcSubGroupChange = (e, newValue) => {
        selectedSubGroupKey = newValue ? newValue.QC_SUBGROUP_KEY : '';
        setForm((prev) => ({
            ...prev,
            QC_SUBGROUP_KEY: selectedSubGroupKey,
        }));
        if (!selectedSubGroupKey) {
            fetchTableData();  // Call the function to fetch table data based on the selected QC_SUBGROUP_KEY
        } else {
            setTableData([]);  // Clear table data if no subgroup is selected
        }
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
            }
            return updated;
        });
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
    const handleSubmit = async () => {
        const USER_ID = localStorage.getItem('USER_ID');
        const apiUrl = form.QC_TEST_ID === 0 ? 'QC_TEST/InsertQC_TEST' : 'QC_TEST/UpdateQC_TEST';
        const mainData = {
            QC_TEST_ID: form.QC_TEST_ID || 0, // 0 for Insert, >0 for Update
            DOC_KEY: form.DOC_KEY,
            DOC_DTL_ID: form.DOC_DTL_ID,
            QC_TYPE: 'Finished Goods',
            QC_SUBGROUP_KEY: form.QC_SUBGROUP_KEY,
            DECISION_STATUS: 'P',     // Example: Passed
            PASS_PARTIAL_REMARK: form.PASS_PARTIAL_REMARK,
            REMARK: form.REMARK,
            CHECKED_BY: 1,
            PASSED_BY: 1,
            CREATED_BY: USER_ID,
            DBFLAG: mode === FORM_MODE.add ? 'I' : 'U', // 'I' for Insert, 'U' for Update
            QC_TESTDTLEntities: tableData.map(item => ({
                QC_TEST_DTL_ID: item.QC_TEST_DTL_ID || 0,
                QC_TEST_ID: form.QC_TEST_ID || 0,
                QC_PM_ID: item.QC_PM_ID,
                USER_VALUE: item.USER_VALUE || 0,
                REMARK: item.REMARK,
                FINAL_RESULT: item.FINAL_RESULT || 'P',
                DBFLAG: item.QC_TEST_DTL_ID === 0 ? 'I' : 'U',
                RESULT: item.RESULT,
                CREATED_BY: USER_ID,
            }))
        };
        try {
            const response = await axiosInstance.post(apiUrl, mainData);
            const { data } = response;
            if (data.STATUS === 0) {
                toast.success(data.MESSAGE || 'Data saved successfully!', { autoClose: 2000 });
                fetchTableData();
            } else {
                toast.error(data.MESSAGE || 'Something went wrong!', { autoClose: 3000 });
                if (data.MESSAGE.includes('Duplicate Data')) {
                    console.log("Duplicate Error Detected:", data.MESSAGE);
                    fetchTableData();
                }
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };
    const handleCancel = () => {
        setEditableRow(null)
        setMode(FORM_MODE.read)
    };
    const handlePrevious = async () => {
        // await fetchTableData();
        setForm((prev) => ({ ...prev, SearchByCd: '' }));
    };
    const handleNext = async () => {
        setForm((prev) => ({ ...prev, SearchByCd: '' }));
    };
    const handleTable = () => {
        router.push("/masters/qc/qctest/finishedgoods/finishtable");
    };
    const handleExit = async () => {
        router.push("/masterpage/?activeTab=qc");
    };
    const handleEdit = () => {
        setMode(FORM_MODE.edit);
    };
    const handlePrint = async () => {
        try {
            const response = await axiosInstance.post(`/QC_TEST/GetQC_TESTDashBoard?currentPage=1&limit=5000`, {
                "SearchText": ""
            });
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                const formattedData = DATA.map(row => ({
                    ...row,
                    STATUS: row.STATUS === "1" ? "Active" : "Inactive"
                }));
                const asPdf = pdf(<PrintFinish rows={formattedData} />);
                const blob = await asPdf.toBlob();
                const url = URL.createObjectURL(blob);
                const newTab = window.open(url, '_blank');
                if (newTab) {
                    newTab.focus();
                }
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 100);
            }
        } catch (error) {
            console.error("Print Error:", error);
        }
    };
    const handleDeleteAll = () => { }
    const handleAdd = async () => {
        setMode(FORM_MODE.add);
        setCurrentQC_TEST_ID(null);
        setForm((prevForm) => ({
            ...prevForm,
            SearchByCd: '',
        }));
    };
    const handleEnterKeyAddRow = (e, currentRowId) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        setTableData(prev => {
            const currentRow = prev.find(r => QC_PM_ID === currentRowId);
            if (
                !currentRow ||
                !currentRow.TEST_NAME?.trim()
            ) {
                return prev;
            }
            setEditableRow(newRow.QC_PM_ID);
            return [...prev, newRow];
        });
    };
    return (
        <Grid container sx={{ bgcolor: '#f5f5f5', py: 4 }}>
            <ToastContainer />
            <Grid item xs={12} sx={{ mx: 'auto', px: { xs: 4, sm: 6, md: 6, lg: 8 }, width: '100%' }}>
                <Typography variant="h6" align="center">
                    QC Test (Finished Goods)
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
                            disableDelete
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "30%" }}>
                        <TextField
                            label="Doc Type"
                            variant="filled"
                            fullWidth
                            value="Finished Goods"
                            disabled={true}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "34%" }} >
                        <Autocomplete
                            options={partyDrp}
                            getOptionLabel={(option) => option.PARTY_NAME || ""}
                            value={partyDrp.find(c => c.PARTY_KEY === form.PARTY_KEY) || null}
                            onChange={handlePartyChange}
                            disabled={mode === FORM_MODE.read}
                            renderInput={(params) => (
                                <TextField {...params} label={<><span>Party Name</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "34%" }}>
                        <Autocomplete
                            options={docNoDrp}
                            getOptionLabel={(option) => option.DOC_NO || ""}
                            value={docNoDrp.find(c => c.DOC_KEY === form.DOC_KEY) || null}
                            onChange={handleDocNoChange}
                            disabled={mode === FORM_MODE.read}
                            renderInput={(params) => (
                                <TextField {...params} label={<><span>Doc No</span></>} sx={inputStyle} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "30%" }}>
                        <Autocomplete
                            options={qcSubGroups}
                            getOptionLabel={(option) => option.QC_SUBGROUP_NAME || ""}
                            value={qcSubGroups.find(c => c.QC_SUBGROUP_KEY === form.QC_SUBGROUP_KEY) || null}
                            onChange={handleQcSubGroupChange}
                            disabled={mode === FORM_MODE.read}
                            renderInput={(params) => (
                                <TextField {...params} label={<><span>SubGroup Name</span></>} sx={inputStyle} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "34%" }}>
                        <Autocomplete
                            options={dtlItems}
                            getOptionLabel={(option) => option.DTL_NAME || ""}
                            value={dtlItems.find(c => c.DOC_DTL_ID === form.DOC_DTL_ID) || null}
                            onChange={(e, newValue) => {
                                const selectedId = newValue ? newValue.DOC_DTL_ID : '';
                                setForm(prev => ({
                                    ...prev,
                                    DOC_DTL_ID: selectedId,
                                    QC_SUBGROUP_KEY: ''
                                }));
                            }}
                            disabled={mode === FORM_MODE.read}
                            renderInput={(params) => (
                                <TextField {...params} label="Item" sx={inputStyle} />
                            )}
                        />
                    </Grid>
                </Grid>
                <TableContainer sx={{ minHeight: 100, maxHeight: 200, overflowY: 'auto', mt: 1, width: '100%', borderRadius: 4 }}>
                    <Table stickyHeader size="medium" sx={{ width: '100%', border: '1px solid #ddd', borderRadius: 2 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '30%' }}>Test Name</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '10%' }}>Value Test</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '9%' }}>RangeFrom</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '7%' }}>RangeTo</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '8%' }}>Uservalue</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '10%' }}>Result</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '16%' }}>TestRemark</TableCell>
                                <TableCell sx={{ ...commonCellSx, fontWeight: 'bold', width: '10%' }}>FinalResult</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ textAlign: 'center', padding: '16px', border: '1px solid #ddd' }}>
                                        No data available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tableData.map((row) => {
                                    const isEditable = editableRow === row.QC_PM_ID && mode !== FORM_MODE.read;
                                    return (
                                        <TableRow
                                            key={row.QC_PM_ID}
                                            hover
                                            onClick={() => setEditableRow(row.QC_PM_ID)}
                                            sx={{
                                                cursor: mode === FORM_MODE.read ? 'default' : 'pointer',
                                                '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }
                                            }}
                                        >
                                            <TableCell sx={commonCellSx}>
                                                {row.TEST_NAME || '-'}
                                            </TableCell>
                                            <TableCell sx={commonCellSx}>
                                                {row.VALUE_TEST || '-'}
                                            </TableCell>
                                            <TableCell sx={commonCellSx}>
                                                {row.RANGE_FROM ?? '-'}
                                            </TableCell>
                                            <TableCell sx={commonCellSx}>
                                                {row.RANGE_TO ?? '-'}
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
                                                    row.USER_VALUE || '0'
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
                                                    row.RESULT || ''
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
                                                    row.REMARK || ''
                                                )}
                                            </TableCell>
                                            <TableCell sx={commonCellSx}>
                                                {isEditable ? (
                                                    <Select
                                                        value={row.FINAL_RESULT || 'P'}
                                                        onChange={(e) =>
                                                            handleCellChange(row.QC_PM_ID, 'FINAL_RESULT', e.target.value)
                                                        }
                                                        variant="standard"
                                                        fullWidth
                                                        sx={selectSx}
                                                    >
                                                        <MenuItem value="P">Pass</MenuItem>
                                                        <MenuItem value="F">Fail</MenuItem>
                                                    </Select>
                                                ) : (
                                                    row.FINAL_RESULT === 'P' ? 'Pass' : row.FINAL_RESULT === 'F' ? 'Fail' : 'Pass'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "18%" }}>
                        <Autocomplete
                            options={decision}
                            getOptionLabel={(option) => option.DECISION_STATUSNM || ""}
                            value={decision.find(c => c.DECISION_STATUS === form.DECISION_STATUS) || null}
                            onChange={(e, newValue) => {
                                const selectedId = newValue ? newValue.DECISION_STATUS : '';
                                setForm(prev => ({
                                    ...prev,
                                    DECISION_STATUS: selectedId,

                                }));
                            }}
                            disabled={mode === FORM_MODE.read}
                            renderInput={(params) => (
                                <TextField {...params} label="Decision" sx={inputStyle} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "40%" }}>
                        <TextField
                            label="Decision Remark"
                            variant="filled"
                            fullWidth
                            name="PASS_PARTIAL_REMARK"
                            value={form.PASS_PARTIAL_REMARK}
                            disabled={mode === FORM_MODE.read}
                            onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            sx={textInputSx}
                            inputProps={{
                                style: {
                                    padding: '6px 8px',
                                    fontSize: '12px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "40%" }}>
                        <TextField
                            label="Remark/Instructions"
                            variant="filled"
                            fullWidth
                            name="REMARK"
                            value={form.REMARK}
                            disabled={mode === FORM_MODE.read}
                            onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
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
                                onClick={handleSubmit}
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