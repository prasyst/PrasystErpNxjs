'use client'
import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";

const PrintQtDt = ({ rows, currentCatData }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <Document>
      {Array.from({ length: Math.ceil(rows.length / 30) }).map((_, pageIndex) => (
        <Page key={pageIndex} size="A4" style={{ padding: 30, fontSize: 10, fontFamily: 'Helvetica', position: 'relative' }}>
          {/* Header - Repeats on each page */}
          <View style={{ position: 'absolute', top: 20, left: 30, right: 30, textAlign: 'center', marginBottom: 15 }} fixed>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>YOUR COMPANY NAME</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>Quality MASTER REPORT</Text>
          </View>

          {/* Body - Page specific content */}
          <View style={{ marginTop: 30, marginBottom: 20 }}>
           
            {/* Date and Time */}
            <Text style={{ fontSize: 9, textAlign: 'right', marginBottom: 10 }}>
              Generated on: {currentDate} at {currentTime}
            </Text>

            {/* Table with complete borders */}
            <View style={{ border: '1px solid #000', borderRadius: 3, marginBottom: 10 }}>
              {/* Table Header - Repeats on each page */}
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', borderBottomStyle: 'solid', borderTopWidth: 1, borderTopColor: '#000', borderTopStyle: 'solid', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                <Text style={{ width: '7%', borderRight: '1px solid #ddd', padding: 5, textAlign: 'center' }}>SrNo.</Text>
                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>Qlty Key</Text>
                <Text style={{ width: '50%', borderRight: '1px solid #ddd', padding: 5 }}>Qlty Name</Text>
                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>Abbrv</Text>
                <Text style={{ width: '12%', padding: 5 }}>Status</Text>
              </View>

              {/* Table Rows - Paginated */}
              {rows.slice(pageIndex * 30, (pageIndex + 1) * 30).map((row, index) => (
                <View key={row.QLTY_KEY} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', borderBottomStyle: 'solid' }}>
                  <Text style={{ width: '7%', borderRight: '1px solid #ddd', padding: 5, textAlign: 'center' }}>{pageIndex * 30 + index + 1}</Text>
                  <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.QLTY_KEY}</Text>
                  <Text style={{ width: '50%', borderRight: '1px solid #ddd', padding: 5 }}>{row.QLTY_NAME}</Text>
                  <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.QLTY_ABRV}</Text>
                  <Text style={{ width: '12%', padding: 5 }}>{row.STATUS === "1" ? "Active" : "Inactive"}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={{ position: 'absolute', fontSize: 9, bottom: 20, left: 0, right: 0, textAlign: 'center' }} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} fixed />
        </Page>
      ))}
    </Document>
  );
};

export default PrintQtDt;
