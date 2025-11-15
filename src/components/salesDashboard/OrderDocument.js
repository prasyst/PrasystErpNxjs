import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";

const OrderDocument = ({ orderDetails }) => {
    const today = new Date().toLocaleDateString();

    return (
        <Document>
            <Page
                size="A4"
                style={{
                    marginTop: 10,
                    padding: 0,
                    fontFamily: "Helvetica",
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                }}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 10,
                        fontSize: 14,
                    }}
                >
                    <View>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                            {orderDetails.CO_NAME}
                        </Text>
                        <Text>{orderDetails.CITY_NAME}</Text>
                        <Text>{orderDetails.STATE_NAME}</Text>
                    </View>
                    <View style={{ textAlign: "right" }}>
                        <Text>Tel: 9988776655</Text>
                        <Text>Fax:</Text>
                        <Text>Email: yourgmail@gmail.com</Text>
                    </View>
                </View>

                {/* Title */}
                <View style={{ textAlign: "center", marginBottom: 10 }}>
                    <View
                        style={{
                            display: "inline-block",
                            fontWeight: "bold",
                            fontSize: 11,
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor: "#000",
                            alignSelf: "center",
                        }}
                    >
                        <Text>Sales Order</Text>
                    </View>
                </View>

                {/* Content Wrapper */}
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        paddingHorizontal: 5,
                    }}
                >
                    {/* Main Border Box */}
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: "#000",
                            padding: 10,
                            flexDirection: "column",
                            flexGrow: 1,
                            marginBottom: 70
                        }}
                    >
                        {/* Party & Order Info */}
                        <View
                            style={{
                                flexDirection: "row",
                                borderBottomWidth: 1,
                                paddingVertical: 10,
                                borderColor: "#000",
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    paddingRight: 10,
                                    borderRightWidth: 1,
                                    borderColor: "#000",
                                }}
                            >
                                <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                                    Party: {orderDetails.PARTY_NAME}
                                </Text>
                                <Text style={{ fontSize: 12 }}>{orderDetails.CITY_NAME}</Text>
                                <Text style={{ fontSize: 12 }}>{orderDetails.STATE_NAME}</Text>
                            </View>

                            <View style={{ flex: 1, paddingLeft: 10, fontSize: 12 }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>Order No:</Text> {orderDetails.ORDBK_NO}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>Date:</Text>
                                        {new Date(orderDetails.ORDBK_DT).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>Month:</Text> {orderDetails.MONTH}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>Year:</Text> {orderDetails.YEAR}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>Quotation No:</Text> XV0015
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>Date:</Text> {today}
                                    </Text>
                                </View>
                                <Text>
                                    <Text style={{ fontWeight: "bold", fontSize: 12 }}>Transporter:</Text> ACTO
                                </Text>
                                <Text>
                                    <Text style={{ fontWeight: "bold", fontSize: 12 }}>Broker/Agent:</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Dealer Row */}
                        <View
                            style={{
                                flexDirection: "row",
                                borderBottomWidth: 1,
                                paddingVertical: 8,
                                borderColor: "#000",
                            }}
                        >
                            <Text style={{ flex: 1, fontWeight: "bold", fontSize: 14 }}>Dealer: AD Patil</Text>
                            <Text style={{ flex: 1, borderLeftWidth: 1 }}>&nbsp;</Text>
                        </View>

                        {/* Table Header */}
                        <View
                            style={{
                                flexDirection: "row",
                                marginTop: 10,
                                marginBottom: 10,
                                fontWeight: "bold",
                                fontSize: 12,
                            }}
                        >
                            <Text style={{ flex: 0.5, paddingVertical: 6, paddingHorizontal: 1 }}>Sr.</Text>
                            <Text style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 1 }}>Sty_Code</Text>
                            <Text style={{ flex: 3, paddingVertical: 6, paddingHorizontal: 1 }}>Product Description</Text>
                            <Text style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 1 }}>Shade</Text>
                            <Text style={{ flex: 2, paddingVertical: 6, paddingHorizontal: 1 }}>Size / Qty</Text>
                            <Text style={{ flex: 0.5, paddingVertical: 6, paddingHorizontal: 1 }}>Qty</Text>
                            <Text style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 1 }}>MRP</Text>
                        </View>

                        {/* Table Body */}
                        <View style={{ flexDirection: "row", fontSize: 12 }}>
                            <Text style={{ flex: 0.5, paddingVertical: 6, paddingHorizontal: 1 }}>1</Text>
                            <Text style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 1 }}>STY123</Text>
                            <Text style={{ flex: 3, paddingVertical: 6, paddingHorizontal: 1 }}>Men’s Cotton Shirt and pants</Text>
                            <Text style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 1 }}>Sky Blue</Text>
                            <View style={{ flex: 2, paddingHorizontal: 1, flexDirection: "row" }}>
                                <View style={{ flexDirection: "column", width: 20, alignItems: "center" }}>
                                    <Text>M</Text>
                                    <Text>1</Text>
                                </View>
                                <View style={{ flexDirection: "column", width: 20, alignItems: "center" }}>
                                    <Text>L</Text>
                                    <Text>2</Text>
                                </View>
                                <View style={{ flexDirection: "column", width: 20, alignItems: "center" }}>
                                    <Text>XL</Text>
                                    <Text>1</Text>
                                </View>
                            </View>
                            <Text style={{ flex: 0.5, paddingVertical: 6, paddingHorizontal: 1 }}>{orderDetails.QTY}</Text>
                            <Text style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 1 }}>{orderDetails.AMOUNT}</Text>
                        </View>
                        <View style={{ flexDirection: "row", fontSize: 12 }}>
                            <Text style={{ flex: 0.5, paddingVertical: 6, paddingHorizontal: 1 }}>2</Text>
                            <Text style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 1 }}>STY456</Text>
                            <Text style={{ flex: 3, paddingVertical: 6, paddingHorizontal: 1 }}>Women’s Kurti</Text>
                            <Text style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 1 }}>Maroon</Text>
                            <View style={{ flex: 2, paddingHorizontal: 1, flexDirection: "row" }}>
                                <View style={{ flexDirection: "column", width: 20, alignItems: "center" }}>
                                    <Text>M</Text>
                                    <Text>1</Text>
                                </View>
                                <View style={{ flexDirection: "column", width: 20, alignItems: "center" }}>
                                    <Text>L</Text>
                                    <Text>1</Text>
                                </View>
                                <View style={{ flexDirection: "column", width: 20, alignItems: "center" }}>
                                    <Text>XL</Text>
                                    <Text>2</Text>
                                </View>
                            </View>
                            <Text style={{ flex: 0.5, paddingVertical: 6, paddingHorizontal: 1 }}>{orderDetails.QTY}</Text>
                            <Text style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 1 }}>{orderDetails.AMOUNT}</Text>
                        </View>
                        {/* Footer */}
                        <View
                            style={{
                                borderColor: "#000",
                                paddingTop: 10,
                                marginTop: "auto",
                                fontSize: 14,
                            }}
                        >
                            <View style={{ flexDirection: "row", fontSize: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#000" }}>
                                <Text style={{ flex: 6.5, textAlign: "right", fontWeight: "bold", paddingVertical: 6, paddingRight: 4 }}>
                                    Total:
                                </Text>
                                <Text style={{ flex: 1, fontWeight: "bold", paddingVertical: 6 }}>
                                    Rs. {orderDetails.AMOUNT}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ flex: 1, padding: 8, fontSize: 11 }}>
                                    <Text>VAT Reg No: </Text>
                                    <Text>C.S.T. Reg No: </Text>
                                    <Text>Created By: </Text>
                                </View>

                                {/* Middle Section with Left Border */}
                                <View
                                    style={{
                                        flex: 1,
                                        padding: 8,
                                        borderLeftWidth: 0.5,
                                        borderColor: "#000",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 12 }}>Customer&apos;s Signature</Text>
                                    <Text style={{ fontSize: 12 }}>(below Rubber stamp)</Text>
                                </View>

                                {/* Right Section with Left Border */}
                                <View
                                    style={{
                                        flex: 1,
                                        padding: 8,
                                        paddingLeft: 0,
                                        borderLeftWidth: 0.5,
                                        borderColor: "#000",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <Text style={{ textAlign: 'left', paddingLeft: 3, marginLeft: 0 }}>
                                        For <Text style={{ fontWeight: "bold", fontSize: 10 }}>{orderDetails.CO_NAME}</Text>
                                    </Text>
                                    <Text style={{ marginTop: 10, textAlign: 'left', paddingLeft: 3, marginLeft: 0 }}>Authorised Signatory</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default OrderDocument;