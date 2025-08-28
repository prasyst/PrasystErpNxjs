import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

const BranchTable = ({ columns, data, selectedIndex, onRowClick }) => {
  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: "100% important",
        overflow: "hidden",
        border: "1px solid lightgray"
      }}
    >
      <TableContainer sx={{ height: 120 /* Fixed height */ }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                       minWidth: column.minWidth,
          paddingLeft: "12px",
          paddingTop: "4px",
          paddingBottom: "4px",
          backgroundColor: "#f5f5f5", // Light gray header background
          color: "#333",              // Darker text color for contrast
          fontWeight: "bold"
        }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" fontSize="0.85rem">
                    {column.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow
                hover
                key={index}
                selected={index === selectedIndex}
                sx={{ "& > td": { padding: "2px 14px" }, cursor: "pointer" }}
                onClick={() => onRowClick(index)}
              >
                {columns.map((column) => {
  const value = row[column.id] ?? "N/A";
  return (
    <TableCell
      key={column.id}
      align={column.align}
      sx={{
        maxWidth: 200,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}
      title={typeof value === "string" ? value : String(value)}
    >
      {value}
    </TableCell>
  );
})}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BranchTable;
