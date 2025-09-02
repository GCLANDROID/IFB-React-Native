import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import {
    View,
    ImageBackground,
    StyleSheet,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Linking,
    Modal,
    FlatList,
    Alert,




} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Loader } from '../../util/Loader';
import API from '../../util/API';
import dayjs from 'dayjs';


const SalesReportDetails = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [currentFY, setCurrentFY] = useState("");
    const [currentMonth, setCurrentMonth] = useState("");
    const route = useRoute();
    const { label } = route.params || {};
    const { subOperation } = route.params || {};
    const [salesData, setSalesData] = useState([]);








    useEffect(() => {
        const now = dayjs();
        const month = now.month() + 1; // Jan = 0
        const year = now.year();

        // Calculate financial year (April–March)
        const fy = month <= 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
        const prevFY = month <= 3 ? `${year - 2}-${year - 1}` : `${year - 1}-${year}`;

        // Store in array

        setCurrentFY(fy);
        const monthName = now.format("MMMM");



        // Current month text
        setCurrentMonth(now.format("MMMM"));
        fetchSalesData(fy, monthName);
        // e.g. "August"
    }, []);


    console.log("Current Financial Year:", currentFY);
    console.log('Suboperation', subOperation);


    const fetchSalesData = async (financialYear, month) => {
        try {
            setLoading(true);
            const userId = await AsyncStorage.getItem("UserID");
            const securityCode = await AsyncStorage.getItem("SecurityCode");

            const url = API.GET_CONSOL_REPORT(
                "0",
                userId,
                financialYear,
                month,
                "2",
                subOperation,
                securityCode
            );
            console.log("URL", url);

            const response = await axios.get(url);
            console.log("API response:", response.data);


            if (response.data.responseStatus) {
                const parsedData = response.data.responseData.map((obj, index) => ({
                    id: index.toString(),
                    salesDate: obj.SalesEntryDate,
                    referenceNumber: obj.ReferenceNo,
                    tokenNumber: obj.TokenNo || "Pending",
                    ticketNumber: obj.TicketNumber,
                    categoryName: obj.CategoryName,
                    modelName: obj.ModelName,
                    customerName: obj.CustomerName,
                    customerPhone: obj.CustomerPhNo,
                    customerEmail: obj.CustomerEmail,
                    deliveryDate: obj.Delivery_Date,
                    deliveryRemarks: obj.Delivery_Remarks,
                    invoiceURL: obj.InvoiceCopyURL,
                    isCancel: obj.IsCancel,
                    approvalStatus: obj.ApprovalStatus,
                    csdSales: obj.CSD_Sales,
                    custConfStats: obj.Cust_Conf_Stats,
                }));

                setSalesData(parsedData);
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };


    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.label}>Sales Date</Text>
                <Text style={styles.valueRed}>{item.salesDate}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Reference Number</Text>
                <Text style={styles.valueRed}>{item.referenceNumber}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Token Number</Text>
                <Text style={styles.valuePending}>{item.tokenNumber}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Ticket Number</Text>
                <Text style={styles.value}>{item.ticketNumber}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Category Name</Text>
                <Text style={styles.valueRed}>{item.categoryName}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Model</Text>
                <Text style={styles.valueRed}>{item.modelName}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Delivery Date</Text>
                <Text style={styles.valueRed}>{item.deliveryDate}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Approval Status</Text>
                <Text style={styles.valuePending}>{item.approvalStatus}</Text>
            </View>
        </View>
    );








    return (
        <SafeAreaProvider >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FF0020' }}>
                <ImageBackground
                    source={require('../../asset/form-bg.png')} // your top background image
                    style={styles.topImage}
                    resizeMode="cover"
                >
                    {loading && <Loader />}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <View style={{ flex: 1 }}>
                            {/* {loading && <Loader />} */}

                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20, alignContent: 'center', backgroundColor: '#FF0020', paddingVertical: 10, paddingHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Image source={require('../../asset/back-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                                <Text style={styles.nameText}>{label}</Text>
                                <TouchableOpacity onPress={() => navigation.replace("CSRDashbaord")}>
                                    <Image source={require('../../asset/home-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1, padding: 20 }}>
                                <FlatList
                                    data={salesData}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItem}
                                    contentContainerStyle={{ paddingBottom: 30 }}
                                    ListEmptyComponent={
                                        <Text style={{ textAlign: "center", marginTop: 20, color: "gray",fontSize:16 }}>
                                            No sales data available
                                        </Text>
                                    }
                                />

                            </View>
                        </View>
                    </KeyboardAvoidingView>



                </ImageBackground>



            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({

    headerIcon: {
        height: 30,
        width: 30,
        tintColor: '#FFFFFF'
    },
    nameText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    topImage: {
        height: '100%',
        width: '100%',
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 5,
        marginVertical: 6,
        borderRadius: 8,
        padding: 8,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 0.3,
        borderColor: "#ddd",
    },
    label: {
        color: "#333",
        fontSize: 14,
        fontWeight: "500",
    },
    value: {
        color: "#555",
        fontSize: 14,
        fontWeight: "500",
    },
    valueRed: {
        color: "red",
        fontSize: 14,
        fontWeight: "600",
    },
    valuePending: {
        color: "orange",
        fontSize: 14,
        fontWeight: "600",
    },



});

export default SalesReportDetails;