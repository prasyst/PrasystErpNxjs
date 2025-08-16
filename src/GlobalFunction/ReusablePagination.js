// 'use client';
// import React, { useState, useMemo } from 'react';
// import { TablePagination } from '@mui/material';

// const ReusablePagination = ({ 
//   data, 
//   rowsPerPageOptions = [25, 50, 100, 250, 500, 1000, 3000],
//   defaultRowsPerPage = 25,
//   onPageChange,
//   onRowsPerPageChange
// }) => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//     if (onPageChange) onPageChange(newPage);
//   };

//   const handleRowsPerPageChange = (event) => {
//     const newRowsPerPage = parseInt(event.target.value, 10);
//     setRowsPerPage(newRowsPerPage);
//     setPage(0);
//     if (onRowsPerPageChange) onRowsPerPageChange(newRowsPerPage);
//   };

//   const paginatedData = useMemo(() => {
//     const startIndex = page * rowsPerPage;
//     return data.slice(startIndex, startIndex + rowsPerPage);
//   }, [data, page, rowsPerPage]);

//   return {
//     paginatedData,
//     paginationProps: {
//       count: data.length,
//       rowsPerPage,
//       page,
//       onPageChange: handlePageChange,
//       onRowsPerPageChange: handleRowsPerPageChange,
//       rowsPerPageOptions,
//     },
//     PaginationComponent: (
//       <TablePagination
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handlePageChange}
//         onRowsPerPageChange={handleRowsPerPageChange}
//         rowsPerPageOptions={rowsPerPageOptions}
//         sx={{
//           borderTop: "1px solid #e0e0e0",
//           "& .MuiTablePagination-toolbar": {
//             minHeight: "52px",
//           },
//         }}
//       />
//     )
//   };
// };

// export default ReusablePagination;