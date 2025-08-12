'use client'
// import pdfMake from '../../../../utils/pdfmake';

export const PrintCatData = (data) => {
  const rowsPerPage = 40;
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const content = [];

  for (let i = 0; i < totalPages; i++) {
    const rows = data.slice(i * rowsPerPage, (i + 1) * rowsPerPage);

    if (i === 0) {
      content.push({
        stack: [
          { text: "YOUR COMPANY NAME", style: "title" },
          { text: "CATEGORY MASTER REPORT", style: "subtitle" },
          {
            text: `Generated on: ${currentDate} at ${currentTime}`,
            alignment: "right",
            fontSize: 9,
            margin: [0, 0, 0, 10],
          },
        ],
        alignment: "center",
        margin: [0, 0, 0, 10],
      });
    } else {

      content.push({
        stack: [
          { text: "CATEGORY MASTER REPORT", style: "subtitle" },
          {
            text: `Generated on: ${currentDate} at ${currentTime}`,
            alignment: "right",
            fontSize: 9,
            margin: [0, 0, 0, 10],
          },
        ],
        alignment: "center",
        margin: [0, 20, 0, 10],
      });
    }

    content.push({
      table: {
        headerRows: 1,
        keepWithHeaderRows: 1,
        widths: ["7%", "15%", "50%", "15%", "13%"],
        body: [
          [
            { text: "SrNo.", style: "tableHeader", alignment: "center" },
            { text: "Cat Key", style: "tableHeader" },
            { text: "Cat Name", style: "tableHeader" },
            // { text: "Segment", style: "tableHeader" },
            { text: "Abrv", style: "tableHeader" },
            { text: "Status", style: "tableHeader" },
          ],
          ...rows.map((row, index) => [
            { text: i * rowsPerPage + index + 1, alignment: "center" },
            row.FGCAT_KEY ?? "",
            row.FGCAT_NAME ?? "",
            // row.SEGMENT_KEY ?? "",
            row.FGCAT_ABRV ?? "",
            row.STATUS === "1" ? "Active" : "Inactive",
          ]),
        ],
      },
      layout: {
        fillColor: (rowIndex) => (rowIndex === 0 ? "#f5f5f5" : null),
        hLineColor: "#ddd",
        vLineColor: "#ddd",
        paddingLeft: () => 5,
        paddingRight: () => 5,
        paddingTop: () => 2,
        paddingBottom: () => 2,
      },
      margin: [0, 0, 0, 20],
      pageBreak: i === totalPages - 1 ? undefined : 'after',
    });
  }

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [30, 40, 30, 60],
    content,
    footer: (currentPage, pageCount) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: "center",
      fontSize: 9,
      margin: [0, 10, 0, 0],
    }),
    styles: {
      title: {
        fontSize: 16,
        bold: true,
        marginBottom: 5,
      },
      subtitle: {
        fontSize: 14,
        bold: true,
        marginBottom: 5,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
      },
    },
    defaultStyle: {
      fontSize: 9,
    },
  };

  // pdfMake.createPdf(docDefinition).open();
};

