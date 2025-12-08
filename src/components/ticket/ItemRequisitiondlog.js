// components/dialogs/ItemRequisitionDialog.jsx

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import ItemReqTable from "@/components/datatable/ItemReqTable";

const ItemRequisitionDialog = ({
  open,
  onClose,
  rows,                    // all items from parent
  onSave,                  // callback to send final items back
  isLoading,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsSecondTable, setRowsSecondTable] = useState([]);

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedRows(selectedData);
  }, []);

  const handleConfirmButton = () => {
    setRowsSecondTable((prevData) => [...prevData, ...selectedRows]);
    setSelectedRows([]); // optional: clear selection after adding
  };

  const handleSaveButton = () => {
    onSave(rowsSecondTable); // send back to parent
    onClose();
  };

  const handleCancel = () => {
    setSelectedRows([]);
    setRowsSecondTable([]);
    onClose();
  };

  // Your original columnDefs (exactly as you had)
  const columnDefs = [
    {
      headerName: "Select",
      width: 50,
      maxWidth: 40,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      lockPosition: true,
      suppressMenu: true,
      sortable: false,
      filter: false,
      resizable: false,
      headerClass: 'checkbox-header'
    },
    { field: "ITM_KEY", headerName: "ItemCode", filter: 'agSetColumnFilter', sortable: true },
    { field: "ITMCAT_NAME", headerName: "Category", filter: 'agSetColumnFilter', sortable: true },
    { field: "ITMGRP_NAME", headerName: "Group", filter: 'agSetColumnFilter', sortable: true },
    { field: "ITMSUBGRP_NAME", headerName: "SubGroup", filter: 'agSetColumnFilter', sortable: true },
    { field: "ITM_NAME", headerName: "Item", filter: 'agSetColumnFilter', sortable: true },
    { field: "TO_UNIT_NAME", headerName: "Unit", filter: 'agSetColumnFilter', sortable: true },
    { field: "TO_UNIT_NAME", headerName: "Qty", filter: 'agSetColumnFilter', sortable: true },
  ];

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
          margin: { xs: "20px", sm: "40px", md: "60px", lg: "60px", xl: "60px" },
          backgroundColor: "white",
          borderRadius: "10px",
          border: "1px solid #ccc",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <Grid>
          {/* <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "transparent",
              overflow: "auto",
              maxHeight: { xs: "50vh", sm: "55vh", md: "60vh", lg: "65vh", xl: "70vh" },
              height: { xs: "50vh", sm: "50vh", md: "56vh", lg: "80vh", xl: "65vh" },
              margin: { xs: "0px 0px 0px 1px", sm: "0px 0px 0px 2.5px", md: "0px 0px 0px 2.5px" },
              padding: "0px",
              gap: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          > */}
            <div className="p-2 w-full">
              <div className="w-full mx-auto" style={{ maxWidth: '100%' }}>
                <div style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
                  {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      Loading...
                    </div>
                  ) : (
                    <>
                      <ItemReqTable
                        columnDefs={columnDefs}
                        rowData={rows}
                        height="50%"
                        theme="ag-theme-quartz"
                        isDarkMode={false}
                        pagination={false}
                        quickFilter={false}
                        onSelectionChanged={handleSelectionChanged}
                        loading={isLoading}
                        enableExport={false}
                        exportSelectedOnly={false}
                        selectedRows={false}
                        enableCheckbox={true}
                        // enableResetButton={false}
                        // enableExitBackButton={false}
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
                        customGridOptions={{
                          suppressRowClickSelection: true,
                          rowSelection: 'multiple',
                          animateRows: true,
                          enableCellTextSelection: true,
                          ensureDomOrder: true
                        }}
                      />

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

                      <ItemReqTable
                        columnDefs={[
                          ...columnDefs.filter(col => col.field !== 'Select' && col.headerName !== 'Select'),
                          {
                            field: "ITM_QTY",
                            headerName: "Order Qty",
                            editable: true,
                            cellEditor: 'agNumberCellEditor',
                            cellEditorParams: { min: 1 },
                            valueSetter: (params) => {
                              if (params.newValue !== params.oldValue) {
                                params.data.ITM_QTY = params.newValue;
                                setRowsSecondTable(prev => prev.map(r =>
                                  r.ITM_KEY === params.data.ITM_KEY ? { ...r, ITM_QTY: params.newValue } : r
                                ));
                              }
                              return true;
                            },
                          }
                        ]}
                        rowData={rowsSecondTable}
                        height="50%"
                        theme="ag-theme-quartz"
                        isDarkMode={false}
                        pagination={false}
                        quickFilter={false}
                        loading={isLoading}
                        enableExport={false}
                        enableCheckbox={false}
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
                        customGridOptions={{
                          suppressRowClickSelection: true,
                          rowSelection: 'multiple',
                          animateRows: true,
                          enableCellTextSelection: true,
                          ensureDomOrder: true
                        }}
                      />

                      <div className="flex flex-wrap gap-4 items-center">
                        <Box sx={{ margin: '10px 16px 0 0' }} width="100%" display="flex" justifyContent="flex-end">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Button
                              onClick={handleSaveButton}
                              variant="outlined"
                              size="small"
                              color="primary"
                              style={{ height: '29.5px' }}
                              sx={{ backgroundColor: '#635bff', color: '#fff', '&:hover': { backgroundColor: '#635bff' } }}
                            >
                              Save
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
                    </>
                  )}
                </div>
              </div>
            </div>
          {/* </Box> */}
        </Grid>
      </DialogTitle>
    </Dialog>
  );
};

export default ItemRequisitionDialog;