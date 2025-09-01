import { useNavigation } from '@react-navigation/native';
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


const SalesReportDashboard = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [currentFY, setCurrentFY] = useState("");
     const [currentMonth, setCurrentMonth] = useState("");

      const [reportData, setReportData] = useState({
        Total_Sales: "0",
        Delivery_update: "0",
        Delivery_Pending: "0",
        Token_Generated: "0",
        Ticket_Generated: "0",
        Ticket_Pending: "0",
        Ticket_Approved: "0",
        Ticket_Rejected: "0",
        Ticket_Approval_Pending: "0",
    });

    const fetchSalesReport = async (financialYear, month) => {
        try {
            setLoading(true);

            const userId = await AsyncStorage.getItem("UserID");
            const securityCode = await AsyncStorage.getItem("SecurityCode"); 
            const url =API.GET_CONSOL_REPORT(
                "0",
                userId,
                financialYear,
                month,
                "1",
                "3",
                securityCode
            );
               
            const response = await axios.get(url);
            console.log("API response:", response.data);

            if ( response.data.responseData.length > 0) {
                const obj = response.data.responseData[0];
                setReportData({
                    Total_Sales: obj.Total_Sales || "0",
                    Delivery_update: obj.Delivery_update || "0",
                    Delivery_Pending: obj.Delivery_Pending || "0",
                    Token_Generated: obj.Token_Generated || "0",
                    Ticket_Generated: obj.Ticket_Generated || "0",
                    Ticket_Pending: obj.Ticket_Pending || "0",
                    Ticket_Approved: obj.Ticket_Approved || "0",
                    Ticket_Rejected: obj.Ticket_Rejected || "0",
                    Ticket_Approval_Pending: obj.Ticket_Approval_Pending || "0",
                });
            }
        } catch (error) {
            console.error("API error:", error);
        } finally {
            setLoading(false);
        }
    };


    const data = [
        { label: 'Total Sales', value: reportData.Total_Sales },
        { label: 'Delivery Update', value: reportData.Delivery_update },
        { label: 'Delivery Pending', value: reportData.Delivery_Pending },
        { label: 'Token Generated', value: reportData.Token_Generated },
        { label: 'Ticket Generated', value: reportData.Ticket_Generated },
        { label: 'Ticket Pending', value: reportData.Ticket_Pending },
        { label: 'Ticket Approved', value: reportData.Ticket_Approved },
        { label: 'Ticket Rejected', value: reportData.Ticket_Rejected },
        { label: 'Ticket Approval Pending', value: reportData.Ticket_Approval_Pending },
    ];

    useEffect(() => {
            const now = dayjs();
            const month = now.month() + 1; // Jan = 0
            const year = now.year();
    
            // Calculate financial year (April–March)
            const fy = month <= 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
            const prevFY = month <= 3 ? `${year - 2}-${year - 1}` : `${year - 1}-${year}`;
    
            // Store in array
          
            setCurrentFY(fy);
    
          
    
            // Current month text
            setCurrentMonth(now.format("MMMM")); 
            fetchSalesReport(fy, currentMonth);// e.g. "August"
        }, []);

        console.log("Current Month:", currentMonth);
        console.log("Current Financial Year:", currentFY);








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
                        <ScrollView style={{ flex: 1 }}>
                              {loading && <Loader />}

                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20, alignContent: 'center', backgroundColor: '#FF0020', paddingVertical: 10, paddingHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Image source={require('../../asset/back-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                                <Text style={styles.nameText}>Sales Report</Text>
                                <TouchableOpacity onPress={() => navigation.replace("CSRDashbaord")}>
                                    <Image source={require('../../asset/home-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1, padding: 20 }}>
                                {data.map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.row}>
                                        <Text style={styles.label}>{item.label}</Text>
                                        
                                        <View style={styles.valueContainer}>
                                            <Text style={styles.value}>{item.value}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                            </View>
                        </ScrollView>
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ddd',
        borderBottomWidth: 0.8,
        paddingVertical: 10,
    },
    label: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '400'
    },
    colon: {
        marginHorizontal: 5,
        color: '#e60000',
        fontSize: 16,
    },
    valueContainer: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: '#ffffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10.5,
        elevation: 10,
         borderWidth: 1,
        borderColor: "#21212133",
    },
    value: {
        fontSize: 14,
        color: '#FF0020',
        fontWeight: '700',
    },


});

export default SalesReportDashboard;