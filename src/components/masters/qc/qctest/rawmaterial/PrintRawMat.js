'use client';
import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";

const PrintRawMat = ({ rows, currentCatData }) => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    return (
        <Document>
            {Array.from({ length: Math.ceil(rows.length / 30) }).map((_, pageIndex) => (
                <Page key={pageIndex} size="A4" style={{ padding: 30, fontSize: 10, fontFamily: 'Helvetica', position: 'relative' }}>
                    <View style={{ position: 'absolute', top: 20, left: 30, right: 30, textAlign: 'center', marginBottom: 15 }} fixed>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>QC TEST (RAW MATERIAL)</Text>
                    </View>
                    <View style={{ marginTop: 30, marginBottom: 20 }}>
                        <Text style={{ fontSize: 9, textAlign: 'right', marginBottom: 10 }}>
                            Generated on: {currentDate} at {currentTime}
                        </Text>
                        <View style={{ border: '1px solid #000', borderRadius: 3, marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', borderBottomStyle: 'solid', borderTopWidth: 1, borderTopColor: '#000', borderTopStyle: 'solid', backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                <Text style={{ width: '7%', borderRight: '1px solid #ddd', padding: 5, textAlign: 'center' }}>SrNo.</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>Party</Text>
                                <Text style={{ width: '50%', borderRight: '1px solid #ddd', padding: 5 }}>DocNo</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>Item</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>SubGrp</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>TestNm</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>ValTest</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>Rg.Fm</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>Rg.To</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>UserVal</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>Res</Text>
                                <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>FRes</Text>
                                <Text style={{ width: '12%', padding: 5 }}>Status</Text>
                            </View>
                            {rows.slice(pageIndex * 30, (pageIndex + 1) * 30).map((row, index) => (
                                <View key={row.QC_GROUP_KEY} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', borderBottomStyle: 'solid' }}>
                                    <Text style={{ width: '7%', borderRight: '1px solid #ddd', padding: 5, textAlign: 'center' }}>{pageIndex * 30 + index + 1}</Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.PARTY_NAME}</Text>
                                    <Text style={{ width: '50%', borderRight: '1px solid #ddd', padding: 5 }}>{row.DOC_NO}</Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.DTL_NAME} </Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.QC_SUBGROUP_NAME} </Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.TEST_NAME}</Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.VALUE_TEST}</Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.RANGE_FROM}</Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.RANGE_TO}</Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.RANGE_TO}</Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.RANGE_TO}</Text>
                                    <Text style={{ width: '15%', borderRight: '1px solid #ddd', padding: 5 }}>{row.RANGE_TO}</Text>
                                    <Text style={{ width: '12%', padding: 5 }}> {row.STATUS}</Text>
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
export default PrintRawMat;
