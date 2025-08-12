'use client'
import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    position: 'relative'
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    marginBottom: 15
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 9,
    borderTop: '1px solid #888',
    paddingTop: 5
  },
  body: {
    marginTop: 30,
    marginBottom: 20
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  reportInfo: {
    fontSize: 9,
    marginBottom: 5
  },
  tableContainer: {
    border: '1px solid #000',
    borderRadius: 3,
    marginBottom: 10
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid'
  },
  serialNo: {
    width: '5%',
    borderRight: '1px solid #ddd',
    padding: 5,
    textAlign: 'center'
  },
  brandKey: {
    width: '12%',
    borderRight: '1px solid #ddd',
    padding: 5
  },
  brandName: {
    width: '50%',
    borderRight: '1px solid #ddd',
    padding: 5
  },
  brandAbrv: {
    width: '15%',
    borderRight: '1px solid #ddd',
    padding: 5
  },
  status: {
    width: '12%',
    padding: 5
  },
  currentBrand: {
    marginBottom: 15,
    border: '1px solid #ddd',
    padding: 10,
    borderRadius: 3
  },
  currentBrandTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 12
  },
  currentBrandRow: {
    flexDirection: 'row',
    marginBottom: 3
  },
  currentBrandLabel: {
    width: 100,
    fontWeight: 'semibold'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center'
  },
   dateTime: {
    fontSize: 9,
    textAlign: 'right',
    marginBottom: 10
  }
});

const PrintBrData = ({ rows, currentBrandData }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  return (
    <Document>
      {Array.from({ length: Math.ceil(rows.length / 30) }).map((_, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header - Repeats on each page */}
          <View style={styles.header} fixed>
            {/* <Image 
              style={{ width: 100, height: 40, marginBottom: 5 }} 
              src={currentBrandData?.brandLogo || 'https://placehold.co/200x50/black/white?text=Brand+Logo'} 
            /> */}
            <Text style={styles.companyName}>YOUR COMPANY NAME</Text>
            <Text style={styles.reportTitle}>BRAND MASTER REPORT</Text>
          </View>

          {/* Body - Page specific content */}
          <View style={styles.body}>
            {/* Current Brand Info - Only on first page */}
            {pageIndex === 0 && currentBrandData && (
              <View style={styles.currentBrand}>
                <Text style={styles.currentBrandTitle}>CURRENT BRAND DETAILS</Text>
                <View style={styles.currentBrandRow}>
                  <Text style={styles.currentBrandLabel}>Brand Key:</Text>
                  <Text>{currentBrandData.BRAND_KEY}</Text>
                </View>
                <View style={styles.currentBrandRow}>
                  <Text style={styles.currentBrandLabel}>Brand Name:</Text>
                  <Text>{currentBrandData.BRAND_NAME}</Text>
                </View>
                <View style={styles.currentBrandRow}>
                  <Text style={styles.currentBrandLabel}>Status:</Text>
                  <Text>{currentBrandData.STATUS === "1" ? "Active" : "Inactive"}</Text>
                </View>
              </View>
            )}
             {/* Date and Time */}
                    <Text style={styles.dateTime}>
                      Generated on: {currentDate} at {currentTime}
                    </Text>

            {/* Table with complete borders */}
            <View style={styles.tableContainer}>
              {/* Table Header - Repeats on each page */}
              <View style={styles.tableHeader}>
                <Text style={styles.serialNo}>#</Text>
                <Text style={styles.brandKey}>Brand Key</Text>
                <Text style={styles.brandName}>Brand Name</Text>
                <Text style={styles.brandAbrv}>Abbreviation</Text>
                <Text style={styles.status}>Status</Text>
              </View>

              {/* Table Rows - Paginated */}
              {rows.slice(pageIndex * 30, (pageIndex + 1) * 30).map((row, index) => (
                <View key={row.BRAND_KEY} style={styles.tableRow}>
                  <Text style={styles.serialNo}>{pageIndex * 30 + index + 1}</Text>
                  <Text style={styles.brandKey}>{row.BRAND_KEY}</Text>
                  <Text style={styles.brandName}>{row.BRAND_NAME}</Text>
                  <Text style={styles.brandAbrv}>{row.BRAND_ABRV}</Text>
                  <Text style={styles.status}>{row.STATUS === "1" ? "Active" : "Inactive"}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer - Repeats on each page */}
          
          {/* Page Number */}
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} fixed />
        </Page>
      ))}
    </Document>
  );
};

export default PrintBrData;
