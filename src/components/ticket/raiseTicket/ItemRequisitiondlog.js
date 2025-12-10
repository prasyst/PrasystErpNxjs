import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';
import {
    Dialog,
    DialogTitle,
    Box,
    Button,
    Stack,
    Grid,
    Autocomplete,
    TextField,
} from "@mui/material";
import ItemReqTable from "@/components/datatable/ItemReqTable";
import { toast } from "react-toastify";
import { Close as MdClose } from "@mui/icons-material";
import axiosInstance from "@/lib/axios";
const ItemRequisitionDialog = ({
    isLoading, inputStyle,
    trnTktDtlEntities,
    open,
    onClose,
    formData,
    ticketFor,
    selectedMachGrpKey,
    cobrId,
    fcyrKey,
    tktNo,
    userId,
    userName,
    attachments,
    // rowsSecondTable: initialRows,
    onTicketUpdated, seriesData
}) => {
    const [rowsSecondTable, setRowsSecondTable] = useState([]);
    const router = useRouter();
    const gridRef = useRef(null);
    const [form, setForm] = useState({
        group: "",
        subGroup: "",
    });
    const [group, setGroup] = useState([]);
    const [subGroup, setSubGroup] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedSubGroup, setSelectedSubGroup] = useState("");
    const [tableRows, setTableRows] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
  
    useEffect(() => {
        if (open && trnTktDtlEntities) {
            const serverItems = trnTktDtlEntities
                .filter(item => item.ITM_KEY) 
                .map(item => ({
                    ...item,
                    ITM_QTY: item.ITM_QTY,
                }));

            setRowsSecondTable(prev => {
                const localNewItems = prev.filter(p => !p.TktDtlId);
                const serverKeys = new Set(serverItems.map(s => s.ITM_KEY));
                const filteredNew = localNewItems.filter(n => !serverKeys.has(n.ITM_KEY));
                return [...serverItems, ...filteredNew];
            });
        }
    }, [open, trnTktDtlEntities]);

    useEffect(() => {
        //  console.log('Rows second table:', rowsSecondTable);
    }, [rowsSecondTable]);
    useEffect(() => {
        if (open && !trnTktDtlEntities?.length) {
            // Avoid adding any initial rows in "add mode"
            setRowsSecondTable([]);
        }
    }, [open, trnTktDtlEntities]);

    const fetchGroup = async () => {
        try {
            const response = await axiosInstance.post("Itm/GetItmDrp", {
                FLAG: "ITMGRP",
                ITM_KEY: "",
                ITMCAT_KEY: "",
                ITMGRP_KEY: "",
                ITMSUBGRP_KEY: ""
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const groupList = response.data.DATA;
                setGroup(groupList);
                if (groupList.length > 0) {
                    const firstGroupKey = groupList[1].ITMGRP_KEY;
                    setSelectedGroup(firstGroupKey);
                    setForm((prev) => ({ ...prev, group: firstGroupKey }));
                    fetchSubGroup(firstGroupKey, true);
                }
            }
        } catch (error) {
            toast.error("Error while fetching group.");
        }
    };
    const fetchSubGroup = async (groupKey, autoSelect = false) => {
        if (!groupKey) return;
        try {
            const response = await axiosInstance.post("Itm/GetItmDrp", {
                FLAG: "ITMSUBGRP",
                ITM_KEY: "",
                ITMCAT_KEY: "",
                ITMGRP_KEY: groupKey,
                ITMSUBGRP_KEY: ""
            });
            if (response.data.STATUS === 0 && Array.isArray(response.data.DATA)) {
                const allOption = {
                    ITMSUBGRP_KEY: "1",
                    ITMSUBGRP_NAME: "All",
                    IS_ALL: true
                };
                const fullList = [allOption, ...response.data.DATA];
                setSubGroup(fullList);
                if (autoSelect && response.data.DATA.length > 0) {
                    const firstSubKey = response.data.DATA[1].ITMSUBGRP_KEY;

                    setSelectedSubGroup(firstSubKey);
                    setForm((prev) => ({ ...prev, subGroup: firstSubKey }));
                }
            }
        } catch (error) {
            toast.error("Error while loading subgroup.");
        }
    };
    useEffect(() => {
        if (open) {
            setForm({ group: "", subGroup: "" });
            setSelectedGroup("");
            setSelectedSubGroup("");
            fetchGroup();
        }
    }, [open]);
    const fetchItemData = async (grpKey, subGrpKey) => {
        setTableLoading(true);
        try {
            const response = await axiosInstance.post(`Itm/GetItmDrp`, {
                "FLAG": "ITM",
                "ITM_KEY": "",
                "ITMCAT_KEY": "",
                "ITMGRP_KEY": grpKey,
                "ITMSUBGRP_KEY": subGrpKey === "1" ? "" : subGrpKey
            });
            const { data: { STATUS, DATA } } = response;
            if (STATUS === 0 && Array.isArray(DATA)) {
                setTableRows(DATA);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setTableLoading(false);
        }
    };
    useEffect(() => {
        if (selectedGroup && selectedSubGroup) {
            fetchItemData(selectedGroup, selectedSubGroup);
        } else {
            setTableRows([]);
        }
    }, [selectedGroup, selectedSubGroup]);

    const handleGroupChange = (_, newGroup) => {
        const grpKey = newGroup?.ITMGRP_KEY || "";
        setSelectedGroup(grpKey);
        setForm((prev) => ({ ...prev, group: grpKey, subGroup: "" }));
        setSelectedSubGroup("");
        setSubGroup([]);
        fetchSubGroup(grpKey);
    };
    const handleSubGroupChange = (_, newSubGroup) => {
        const subGrpKey = newSubGroup?.ITMSUBGRP_KEY || "";
        setSelectedSubGroup(subGrpKey);
        setForm((prev) => ({ ...prev, subGroup: subGrpKey }));
        if (newSubGroup?.IS_ALL || subGrpKey === "1") {
            fetchItemData(selectedGroup, "");
        } else {
            fetchItemData(selectedGroup, subGrpKey);
        }
    };
    const handleConfirmButton = () => {
        if (!gridRef.current?.api) {
            //   console.log("Grid API not found.");
            return;
        }
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        //   console.log("Selected nodes: ", selectedNodes);
        const selectedData = selectedNodes.map(node => node.data);
        //   console.log("Selected data: ", selectedData);
        if (selectedData.length === 0) {
            toast.info("Please select at least one item.");
            return;
        }
        const existingKeys = new Set(rowsSecondTable.map(item => item.ITM_KEY));
        const newItems = selectedData
            .filter(item => !existingKeys.has(item.ITM_KEY))
            .map(item => ({
                ...item,
                ITM_QTY: 1,
            }));
        if (newItems.length === 0) {
            toast.info("No new items selected.");
            return;
        }
        //    console.log("New items to add: ", newItems);
        setRowsSecondTable(prev => [...prev, ...newItems]);
        selectedNodes.forEach(node => {
            if (newItems.some(item => item.ITM_KEY === node.data.ITM_KEY)) {
                node.setSelected(false); // Deselect node after adding
            }
        });
        toast.success(`${newItems.length} item(s) added.`);
    };
    const handleSaveButton = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const existingTktKey = urlParams.get("TKTKEY");
        const isUpdate = !!existingTktKey;
        if (rowsSecondTable.length === 0) {
            toast.error("Please add at least one item.");
            return;
        }
        try {
            let newTktNo = "TK0001";
            let generatedTktKey = `${fcyrKey}${cobrId}TK0001`;
            if (seriesData && seriesData.length > 0) {
                const last = seriesData[0];
                const numericPart = (last.ID || "0").replace(/\D/g, "");
                const lastNumber = parseInt(numericPart, 10) || 0; // Get the last ticket number
                const nextNumber = lastNumber + 1; // Increment to get the next ticket number
                const paddedNumber = String(nextNumber).padStart(4, "0"); // Pad number to 4 digits
                const prefix = (last.CPREFIX || "TK").toUpperCase(); // Use prefix from last ticket or default to "TK"
                generatedTktKey = fcyrKey + cobrId + prefix + paddedNumber;
                newTktNo = prefix + paddedNumber;
            } else {
                const prefix = "TK";
                const fallbackNum = "0001";
                generatedTktKey = fcyrKey + cobrId + prefix + fallbackNum;
                newTktNo = prefix + fallbackNum;
            }
            let attachmentData = { TktImage: "", ImgName: "" };
            if (attachments && attachments.length > 0) {
                const file = attachments[0];
                const base64String = file.fileData.split(",")[1];
                attachmentData = {
                    TktImage: base64String,
                    ImgName: file.fileName,
                };
            }
            const detailPayload = rowsSecondTable.map((item) => {
                const originalDetail = trnTktDtlEntities?.find(
                    (orig) => orig.ITM_KEY === item.ITM_KEY
                );
                if (originalDetail) {
                    return {
                        TktDtlId: originalDetail.TktDtlId || 0,
                        TktKey: originalDetail.TktKey || "",
                        ITM_KEY: item.ITM_KEY,
                        UNIT_KEY: item.TO_UNIT_KEY || originalDetail.UNIT_KEY || "",
                        ITM_QTY: parseFloat(item.ITM_QTY) || 1,
                        BARCODE: "",
                        RATE: item.RATE || 0,
                        REMARK: item.REMARK || "",
                        TktdtlImage: "",
                        ImgName: "",
                        DBFLAG: "U"
                    };
                }
                // New item
                return {
                    TktDtlId: 0,
                    TktKey: "",
                    ITM_KEY: item.ITM_KEY,
                    UNIT_KEY: item.TO_UNIT_KEY || "",
                    ITM_QTY: parseFloat(item.ITM_QTY) || 1,
                    BARCODE: "",
                    RATE: item.RATE || 0,
                    REMARK: item.REMARK || "",
                    TktdtlImage: "",
                    ImgName: "",
                    DBFLAG: "I"
                };
            });
            const payload = {
                DBFLAG: isUpdate ? "U" : "I",
                FCYR_KEY: fcyrKey,
                COBR_ID: cobrId,
                TktKey: isUpdate ? existingTktKey : generatedTktKey,
                TktNo: isUpdate ? existingTktKey.substring(4) : newTktNo,
                RaiseBy_ID: parseInt(userId),
                MobileNo: "",
                RaiseByNm: userName,
                TktDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                TktTime: dayjs().format("HH:mm"),
                TktFor: ticketFor === "M" ? "M" : "C", // M or C
                Machinery_Key: ticketFor === "M" ? formData.machineryKey : "",
                CCN_Key: ticketFor === "C" ? formData.department : "",
                TktServiceId: formData.service?.TKTSERVICEID || 0,
                TktSvrtyId: 2, // Medium
                TktTypeId: 1,
                TktTagId: 1,
                TechEmp_Key: "",
                EsclEmp_Key: "",
                FrwdEmp_Key: "",
                TktStatus: "O",
                ReqFlg: "R",
                Reason: formData.description || "",
                RejDate: dayjs().format("YYYY-MM-DD"),
                AcceptFlg: "N",
                AssignFlg: "N",
                AssignDt: dayjs().format("YYYY-MM-DD"),
                TktDesc: formData.description || "Item Requisition Ticket",
                Status: "1",
                RslvRmrk: "Created via Item Requisition",
                Remark: formData.title || "Item Requisition",
                TktImage: formData.TktImage,
                ImgName: formData.ImgName,
                ...(isUpdate
                    ? { UpdatedBy: parseInt(userId) }
                    : { CreatedBy: parseInt(userId) }
                ),
                trnTktDtlEntities: detailPayload,

            };
            //  console.log("Submitting Ticket Payload:", payload);
            const endpoint = isUpdate
                ? `TrnTkt/UpdateTrnTkt?UserName=${userName}&strCobrid=${cobrId}`
                : `TrnTkt/InsertTrnTkt?UserName=${userName}&strCobrid=${cobrId}`;

            const response = await axiosInstance.post(endpoint, payload);
            if (response.data.STATUS === 0) {
                toast.success(
                    `Ticket ${response.data.DATA} ${isUpdate ? "updated" : "created"} successfully!`,
                    {
                        autoClose: 2000,
                    }
                );
                setTimeout(() => {
                    router.push("/tickets/all-tickets");
                }, 1500);
            } else {
                console.error(response.data.MESSAGE || "Failed to create ticket.");
            }
        } catch (error) {
            console.error("Error creating ticket:", error);
        }
    };
    const handleCancel = () => {
        setRowsSecondTable([]);
        onClose();
    };
    const handleEditChange = (event, key, colName) => {
        const value = event.target.value;
        setRowsSecondTable((prevRows) =>
            prevRows.map((row) =>
                row.ITM_KEY === key ? { ...row, [colName]: value } : row
            )
        );
    };
    const handleRowDelete = async (row) => {
        const { ITM_KEY, TktDtlId } = row;

        try {
            if (TktDtlId && TktDtlId !== 0) {
                const response = await axiosInstance.post('TrnTkt/DeleteTrnTktDtl', {
                    TktDtlId,
                });
                if (response.data.STATUS === 0) {
                    toast.success("Item deleted successfully");
                    if (typeof onTicketUpdated === 'function') {
                        onTicketUpdated();
                    }
                } else {
                    toast.error(response.data.MESSAGE || "Delete failed");
                    return;
                }
            }
            setRowsSecondTable(prev => prev.filter(r => r.ITM_KEY !== ITM_KEY));

        } catch (err) {
            toast.error("Error deleting item");
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            const updatedRows = rowsSecondTable.filter((row) => row.ITM_KEY !== specificITM_KEY);
            setRowsSecondTable(updatedRows);
        }
    };
    const columnDefs = [
        { headerName: "Select", width: 50, maxWidth: 40, checkboxSelection: true, headerCheckboxSelection: true, lockPosition: true, suppressMenu: true, sortable: false, filter: false, resizable: false, headerClass: 'checkbox-header' },
        { field: "ITM_KEY", headerName: "ItemCode", filter: 'agSetColumnFilter', sortable: true },
        { field: "ITMCAT_NAME", headerName: "Category", filter: 'agSetColumnFilter', sortable: true },
        { field: "ITMGRP_NAME", headerName: "Group", filter: 'agSetColumnFilter', sortable: true },
        { field: "ITMSUBGRP_NAME", headerName: "SubGroup", filter: 'agSetColumnFilter', sortable: true },
        { field: "ITM_NAME", headerName: "Item", filter: 'agSetColumnFilter', sortable: true },
        { field: "TO_UNIT_NAME", headerName: "Unit", filter: 'agSetColumnFilter', sortable: true },
    ];
    const filteredRows = tableRows.filter((row) => {
        const searchTerm = searchText.toLowerCase();
        return row.ITM_NAME.toLowerCase().includes(searchTerm) ||
            row.ITM_KEY.toLowerCase().includes(searchTerm) ||
            row.ITMCAT_NAME.toLowerCase().includes(searchTerm) ||
            row.ITMGRP_NAME.toLowerCase().includes(searchTerm) ||
            row.TO_UNIT_NAME.toLowerCase().includes(searchTerm) ||
            row.ITMSUBGRP_NAME.toLowerCase().includes(searchTerm); // Add other fields if needed
    });
    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                "& .MuiDialog-paper": {
                    maxWidth: "100%",
                    width: { xs: "80%", sm: "600px", md: "690px", lg: "1000px", xl: "800px" },
                    height: "auto",
                    padding: { xs: "10px", sm: "15px", md: "20px", lg: "20px", xl: "20px" },
                    margin: { xs: "20px", sm: "40px", md: "20px", lg: "60px", xl: "60px" },
                    backgroundColor: "white",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">
                <Box
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        cursor: "pointer",
                        zIndex: 1000
                    }}
                    onClick={onClose}
                >
                    <MdClose style={{ fontSize: 24 }} />
                </Box>
                <Grid>
                    <div className="p-0 w-full">
                        <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>
                            <div style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
                                <>
                                    <Grid container spacing={0.5} sx={{ mb: 0 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Autocomplete
                                                options={group}
                                                getOptionLabel={(option) => option.ITMGRP_NAME || ""}
                                                value={group.find(g => g.ITMGRP_KEY === form.group) || null}
                                                onChange={handleGroupChange}
                                                renderInput={(params) => (
                                                    <TextField {...params} label={<><span>Group</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Autocomplete
                                                options={subGroup}
                                                getOptionLabel={(option) => option.ITMSUBGRP_NAME || ""}
                                                value={subGroup.find(s => s.ITMSUBGRP_KEY === form.subGroup) || null}
                                                onChange={handleSubGroupChange}
                                                renderInput={(params) => (
                                                    <TextField {...params} label={<><span>SubGroup</span><span style={{ color: 'red' }}>*</span></>} sx={inputStyle} />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4, }}>
                                            <TextField
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                label="Search Items"
                                                variant="outlined"
                                                fullWidth
                                                sx={{
                                                    height: '80%',  // Make the height 100% to match the others
                                                    '& .MuiInputBase-root': {
                                                        height: '100%',  // Ensures the input area respects the height
                                                    },
                                                    '& .MuiOutlinedInput-root': {
                                                        height: '100%',  // Ensures the border area respects the height
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    {!tableLoading && filteredRows.length > 0 && (
                                        <ItemReqTable
                                            ref={gridRef}
                                            onGridReady={(params) => {
                                                //  console.log('Grid is ready!');
                                                gridRef.current = { api: params.api, columnApi: params.columnApi };
                                            }}
                                            columnDefs={columnDefs}
                                            rowData={filteredRows}
                                            height="35%"
                                            theme="ag-theme-quartz"
                                            isDarkMode={false}
                                            pagination={false}
                                            paginationPageSize={25}
                                            paginationPageSizeSelector={[1000]}
                                            quickFilter={false}
                                            enableExport={false}
                                            exportSelectedOnly={false}
                                            enableCheckbox={true}
                                            enableLanguageSwitch={false}
                                            compactMode={true}
                                            rowHeight={24}
                                            headerHeight={30}
                                            className="custom-ag-table"
                                            defaultColDef={{
                                                resizable: true,
                                                sortable: true,
                                                filter: true,
                                                flex: 1,
                                                minWidth: 100
                                            }}
                                            cacheBlockSize={100}
                                            cacheOverflowSize={2}
                                            maxConcurrentDatasourceRequests={1}
                                            rowBuffer={20}
                                            suppressColumnVirtualisation={false}
                                            suppressRowVirtualisation={false}
                                            getRowNodeId={(data) => data.ITM_KEY}
                                            customGridOptions={{
                                                suppressRowClickSelection: true,
                                                rowSelection: 'multiple',
                                                animateRows: true,
                                                enableCellTextSelection: true,
                                                ensureDomOrder: true
                                            }} />)}
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <Box sx={{ margin: '10px 16px 0 0' }} width="100%" display="flex" justifyContent="flex-end">
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Button
                                                    onClick={handleConfirmButton}
                                                    variant="outlined"
                                                    size="small"
                                                    color="primary"
                                                    style={{ height: '29.5px' }}
                                                    sx={{ backgroundColor: '#635bff', color: '#fff', '&:hover': { backgroundColor: '#635bff' } }}
                                                >
                                                    Confirm
                                                </Button>
                                                <Button
                                                    onClick={handleCancel}
                                                    variant="outlined"
                                                    size="small"
                                                    style={{ height: '29.5px' }}
                                                    sx={{
                                                        backgroundColor: 'red',
                                                        color: '#fff',
                                                        borderColor: 'red',
                                                        '&:hover': { backgroundColor: '#cc0000', borderColor: '#cc0000' },
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </div>
                                    <div
                                        tabIndex={0}
                                        onKeyDown={handleKeyDown}
                                        style={{
                                            width: "100%", height: "30%", overflowY: "auto", marginTop: "10px", justifyContent: "center", // Center horizontally
                                            alignItems: "center", borderRadius: "8px", border: "1px solid #ddd",
                                        }} >
                                        <table className="simple-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ backgroundColor: "#f2f2f2", color: "#333" }}>
                                                    <th style={{ border: "1px solid #ddd", padding: "4px", fontSize: "13px", textAlign: "left" }}>Item Code</th>
                                                    <th style={{ border: "1px solid #ddd", padding: "4px", fontSize: "13px", textAlign: "left" }}>Category</th>
                                                    <th style={{ border: "1px solid #ddd", padding: "4px", fontSize: "13px", textAlign: "left" }}>Group</th>
                                                    <th style={{ border: "1px solid #ddd", padding: "4px", fontSize: "13px", textAlign: "left" }}>SubGroup</th>
                                                    <th style={{ border: "1px solid #ddd", padding: "4px", fontSize: "13px", textAlign: "left" }}>Item</th>
                                                    <th style={{ border: "1px solid #ddd", padding: "4px", fontSize: "13px", textAlign: "left", width: "7%" }}>Unit</th>
                                                    <th style={{ border: "1px solid #ddd", padding: "4px", fontSize: "13px", textAlign: "left", width: "7%" }}>Qty</th> {/* Reduced width */}
                                                    <th style={{ border: "1px solid #ddd", padding: "4px", fontSize: "13px", textAlign: "left", width: "6%" }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(rowsSecondTable.length > 0 ? rowsSecondTable : trnTktDtlEntities || []).map((row) => (
                                                    <tr key={row.ITM_KEY}>
                                                        <td style={{ border: "1px solid #ddd", padding: "0px 4px", fontSize: "14px" }}>{row.ITM_KEY}</td>
                                                        <td style={{ border: "1px solid #ddd", padding: "0px 4px", fontSize: "14px" }}>{row.ITMCAT_NAME}</td>
                                                        <td style={{ border: "1px solid #ddd", padding: "0px 4px", fontSize: "14px" }}>{row.ITMGRP_NAME}</td>
                                                        <td style={{ border: "1px solid #ddd", padding: "0px 4px", fontSize: "14px" }}>{row.ITMSUBGRP_NAME}</td>
                                                        <td style={{ border: "1px solid #ddd", padding: "0px 4px", fontSize: "14px" }}>{row.ITM_NAME}</td>
                                                        <td style={{ border: "1px solid #ddd", padding: "0px 4px", fontSize: "14px" }}>{row.TO_UNIT_NAME}</td>
                                                        <td style={{ border: "1px solid #ddd" }}>
                                                            <input
                                                                type="number"
                                                                value={row.ITM_QTY}
                                                                onChange={(e) => handleEditChange(e, row.ITM_KEY, "ITM_QTY")}
                                                                style={{ width: "100%", fontSize: "14px" }}
                                                            />
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                padding: "0px 2px",
                                                                textAlign: "center",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <MdClose color="red"
                                                                style={{ display: "inline-block", verticalAlign: "middle", pointerEvents: "auto", fontSize: "15px", }}
                                                                onClick={() => handleRowDelete(row)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <Box sx={{ margin: '10px 16px 0 0' }} width="100%" display="flex" justifyContent="flex-end">
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Button onClick={handleSaveButton} variant="outlined" size="small" color="primary" style={{ height: '29.5px' }}
                                                    sx={{ backgroundColor: '#635bff', color: '#fff', '&:hover': { backgroundColor: '#635bff' } }}
                                                > Save </Button>
                                                <Button onClick={handleCancel} variant="outlined" size="small" sx={{
                                                    height: 29.5, backgroundColor: 'red', color: '#fff', borderColor: 'red', '&:hover': { backgroundColor: '#cc0000', borderColor: '#cc0000' }
                                                }} >     Cancel </Button>
                                            </Stack>
                                        </Box>
                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                </Grid>
            </DialogTitle>
        </Dialog>
    );
};
export default ItemRequisitionDialog;