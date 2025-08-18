'use client'

import React, { useRef, useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  Checkbox,
  Paper,
  Box
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const EditableTable = ({
  data = [],
  columns = [],
  onCellChange,
  disabled,
  selectedRowIndex = [],
  onRowClick
}) => {
  const [activeRow, setActiveRow] = useState(0); // Jo row active hai, uska index
  const safeData = data.length > 0 ? data : [{}];
  const lastRowIndex = safeData.length - 1;
  const inputRefs = useRef({});

  // Row pe click hone par activeRow update karna
  const handleRowClick = (originalIndex) => {
    if (disabled) return;
    setActiveRow(originalIndex);
    onRowClick?.(originalIndex);
  };

  // Keyboard navigation aur nayi row create hone par activeRow update karna
  const handleKeyDown = (e, rowIndex, fieldIndex, field) => {
    const isLastRow = rowIndex === lastRowIndex;
    const totalCols = columns.length;

    if ((e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'Tab') && isLastRow && !disabled) {
      e.preventDefault();
      onCellChange?.(rowIndex + 1, field, '', true); // Nayi row create karna
      setActiveRow(rowIndex + 1); // Arrow nayi row pe shift karna
      setTimeout(() => {
        const newKey = `${rowIndex + 1}-${field}`;
        inputRefs.current[newKey]?.focus();
      }, 0);
      return;
    }

    // Arrow keys se navigation
    let newRowIndex = rowIndex;
    let newFieldIndex = fieldIndex;

    if (e.key === 'ArrowRight' && fieldIndex < totalCols - 1) newFieldIndex++;
    else if (e.key === 'ArrowLeft' && fieldIndex > 0) newFieldIndex--;
    else if (e.key === 'ArrowUp' && rowIndex > 0) newRowIndex--;
    else if (e.key === 'ArrowDown' && rowIndex < lastRowIndex) newRowIndex++;
    else return;

    e.preventDefault();
    const nextField = columns[newFieldIndex]?.field;
    const nextKey = `${newRowIndex}-${nextField}`;

    setActiveRow(safeData[newRowIndex].originalIndex); // Arrow naye focused row pe shift
    setTimeout(() => {
      inputRefs.current[nextKey]?.focus();
    }, 0);
  };

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        mt: 2,
        maxHeight: 130,
        borderRadius: 2,
        overflowY: 'auto',
        overflowX: 'auto',
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {/* Arrow ke liye ek extra blank header cell */}
            <TableCell sx={{ p: '6px 8px', width: 30 }} />
            {columns.map((col, index) => (
              <TableCell
                key={col.field}
                sx={{
                  p: '4px 6px',
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#333',
                  backgroundColor: '#fafafa',
                }}
              >
                {index === 0 && <span style={{ color: 'red', marginRight: 4 }}>*</span>}
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {safeData.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => handleRowClick(row.originalIndex)}
              selected={selectedRowIndex.includes(row.originalIndex)}
              sx={{
                backgroundColor: selectedRowIndex.includes(row.originalIndex)
                  ? '#c8d3ddff !important'
                  : undefined,
                cursor: disabled ? 'default' : 'pointer',
              }}
            >
              {/* Arrow ke liye cell */}
              <TableCell sx={{
                p: '2px 4px', width: 15
              }}>
                {activeRow === row.originalIndex && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <ChevronRightIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                  </Box>
                )}
              </TableCell>

              {columns.map((col, fieldIndex) => {
                const cellKey = `${rowIndex}-${col.field}`;
                return (
                  <TableCell key={col.field} sx={{ p: '4px 8px' }}>
                    {col.type === 'checkbox' ? (
                      <Checkbox
                        checked={true}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() =>
                          onCellChange?.(row.originalIndex, col.field, row[col.field], '1')
                        }
                        disabled={disabled}
                        size="small"
                        sx={{
                          p: 0.5,
                          height: '20px',
                          width: '20px',
                          color: '#1976d2',
                        }}
                      />
                    ) : (
                      <TextField
                        inputRef={(el) => {
                          inputRefs.current[cellKey] = el;
                        }}
                        type={col.type || 'text'}
                        value={row[col.field] ?? ''}
                        onChange={(e) =>
                          onCellChange?.(row.originalIndex, col.field, e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, rowIndex, fieldIndex, col.field)
                        }
                        fullWidth
                        disabled={disabled}
                        onClick={(e) => e.stopPropagation()}
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          sx: {
                            fontSize: 13,
                            height: '26px',
                            px: 1,
                            backgroundColor: '#fff',
                            borderRadius: 1,
                            border: '1px solid #ccc',
                            '&:hover': { borderColor: '#1976d2' },
                          },
                        }}
                        inputProps={{ style: { padding: '4px 6px' } }}
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EditableTable;













