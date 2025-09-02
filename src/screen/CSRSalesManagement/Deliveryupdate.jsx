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
    FlatList,
    Modal,
    Alert,




} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";
import API from '../../util/API';
import { Loader } from '../../util/Loader';


const Deliveryupdate = () => {
    const [currentFY, setCurrentFY] = useState("");
    const [currentMonth, setCurrentMonth] = useState("");
    const [financialYears, setFinancialYears] = useState([]);
    const [months, setMonths] = useState([]);

    const [fyModalVisible, setfyModalVisible] = useState(false);
    const [selectedFY, setSelectedFY] = useState("Please Select");

    const [monthModalVisible, setMonthModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("Please Select");

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation()

    useEffect(() => {
        const now = dayjs();
        const month = now.month() + 1; // Jan = 0
        const year = now.year();

        // Calculate financial year (April–March)
        const fy = month <= 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
        const prevFY = month <= 3 ? `${year - 2}-${year - 1}` : `${year - 1}-${year}`;

        // Store in array
        setFinancialYears([fy, prevFY]);
        setCurrentFY(fy);

        const monthNames = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];
        setMonths(monthNames);

        // Current month text
        setCurrentMonth(now.format("MMMM")); // e.g. "August"
    }, []);


    const handleFYSelect = (item) => {
        setSelectedFY(item);

        setfyModalVisible(false);
    };

    const renderFYItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleFYSelect(item)}
        >
            <Text style={styles.modalItemText}>{item}</Text>
        </TouchableOpacity>
    );


    const handleMonthSelect = (item) => {
        setSelectedMonth(item);

        setMonthModalVisible(false);
    };

    const renderMonthItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleMonthSelect(item)}
        >
            <Text style={styles.modalItemText}>{item}</Text>
        </TouchableOpacity>
    );




    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.itemRowiconbg}>
                        <Image source={require('../../asset/date-icon.png')} style={styles.itemrowicon} />
                    </View>
                    <Text style={styles.label}>Date</Text>
                </View>

                <Text style={styles.value}>{item.date}</Text>
            </View>
            <View style={styles.row}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.itemRowiconbg}>
                        <Image source={require('../../asset/reference-icon.png')} style={styles.itemrowicon} />
                    </View>
                    <Text style={styles.label}>Reference Number</Text>
                </View>

                <Text style={styles.value}>{item.reference}</Text>
            </View>
            <View style={styles.row}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.itemRowiconbg}>
                        <Image source={require('../../asset/cutomer-icon.png')} style={styles.itemrowicon} />
                    </View>
                    <Text style={styles.label}>Customer Name</Text>
                </View>

                <Text style={styles.value}>{item.customer}</Text>
            </View>
            <View style={styles.row}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.itemRowiconbg}>
                        <Image source={require('../../asset/product-icon.png')} style={styles.itemrowicon} />
                    </View>
                    <Text style={styles.label}>Product</Text>
                </View>

                <Text style={styles.value}>{item.product}</Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.updateBtn}  onPress={() => navigation.replace("DeliveryupdateManage", { CategoryID: item.CategoryID, ReferenceNo: item.reference , CustomerPhNo: item.CustomerPhNo,FinanceScheme: item.FinanceScheme,FinancialYear:selectedFY,Month:selectedMonth,Quantity:item.Quantity,ModelCode:item.ModelCode,CustomerName:item.CustomerName,DeliveryAddress:item.DeliveryAddress,FirstName:item.FirstName,LastName:item.LastName,InvoiceValue:item.InvoiceValue,UnderExchange:item.UnderExchange,WiFiDeviceStatus:item.WiFiDeviceStatus})}>
                    <Text style={styles.updateText}>Update Delivery Address</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Cancel Sale</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const fetchDeliveries = async () => {
        if (selectedFY === "Please Select" || selectedMonth === "Please Select") {
            Alert.alert("Please select Financial Year and Month");
            return;
        }

        setLoading(true);
        try {
            const userID = await AsyncStorage.getItem('UserID');  // replace with your prefManager.getBranchId()
            const securityCode = await AsyncStorage.getItem('SecurityCode');

            const url = API.GET_DELIVERY_ITEM(
                "0",
                userID,
                selectedFY,
                selectedMonth,
                1,
                1,
                securityCode
            );
            console.log("Fetching models from URL:", url);
            const response = await fetch(
                url, {
                method: 'GET', headers: { 'Content-Type': 'application/json' }
            }
            );
            const json = await response.json();

            if (json.responseStatus && json.responseData) {
                const mapped = json.responseData.map((item, index) => ({
                    id: index.toString(),
                    date: item.SalesEntryDate || "-",
                    reference: item.ReferenceNo || "-",
                    customer: item.CustomerName || "-",
                    product: item.ModelName || "-",
                     CategoryID: item.CategoryID || "",
                     CustomerPhNo: item.CustomerPhNo || "",
                     FinanceScheme: item.FinanceScheme || "",
                     Quantity: item.Quantity || "",
                     ModelCode: item.ModelCode || "",
                     CustomerName: item.CustomerName || "",
                     DeliveryAddress: item.DeliveryAddress || "",
                     FirstName: item.FirstName || "",
                     LastName: item.LastName || "",
                     InvoiceValue: item.InvoiceValue || "",
                     UnderExchange: item.UnderExchange || "",
                     WiFiDeviceStatus: item.WiFiDeviceStatus || "",
                }));
                setDeliveries(mapped);
            } else {
                Alert.alert("No data found");
                setDeliveries([]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };




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

                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignContent: 'center', backgroundColor: '#FF0020', paddingVertical: 10, paddingHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Image source={require('../../asset/back-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                                <Text style={styles.nameText}>Delivery Update</Text>
                                <TouchableOpacity onPress={() => navigation.replace("CSRDashbaord")}>
                                    <Image source={require('../../asset/home-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ backgroundColor: '#D9D9D954', padding: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1, alignContent: 'center' }}>
                                            <Text style={styles.titleText}>
                                                Finanacial Year *
                                            </Text>
                                            <TouchableOpacity style={styles.inputBox} onPress={() => setfyModalVisible(true)}>
                                                <Text style={styles.inputValue}>{selectedFY}</Text>
                                                <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 1, alignContent: 'center', marginLeft: 10 }}>
                                            <Text style={styles.titleText}>
                                                Month *
                                            </Text>
                                            <TouchableOpacity style={styles.inputBox} onPress={() => setMonthModalVisible(true)}>
                                                <Text style={styles.inputValue}>{selectedMonth}</Text>
                                                <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.submitbox} onPress={fetchDeliveries}>
                                        <Text style={styles.submitText}>Show</Text>
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={deliveries}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItem}
                                    contentContainerStyle={{ padding: 10 }}
                                />

                            </View>


                        </View>
                    </KeyboardAvoidingView>

                    <Modal
                        visible={monthModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setMonthModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Month</Text>


                                <FlatList
                                    data={months}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderMonthItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setMonthModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        visible={fyModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setfyModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Financial Year</Text>


                                <FlatList
                                    data={financialYears}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderFYItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setfyModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ImageBackground>



            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({



    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#21212133",
    },
    topImage: {
        height: '100%',
        width: '100%',

    },
    header: {
        justifyContent: 'space-between',
        marginTop: 60,
        alignContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20
    },
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

    titleText: {
        fontSize: 12,
        color: '#564F4F',
        fontWeight: '600',


    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#D3CBCB',
        padding: 10,
        marginTop: 10,
        width: '100%',
        justifyContent: 'space-between',
        alignContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF'


    },
    inputValue: {
        fontSize: 12,
        color: '#8F8787',
        fontWeight: '300',
        width: '100%',


    },

    inputboxicon: {
        width: 20,
        height: 20,
        tintColor: '#564F4F',
        right: 10,

    },
    submitbox: {
        backgroundColor: '#000000ff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        height: 50,
        width: '100%',
    },
    submitText: {
        fontSize: 18,
        color: '#fffdfdff',
        fontWeight: '700',
        textAlign: 'center',


    },
    topImage: {
        height: '100%',
        width: '100%',

    },

    row: {
        flexDirection: "row",
        marginBottom: 8,
        alignContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
    },
    value: {
        fontSize: 14,
        fontWeight: "400",
        color: "#111",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    updateBtn: {
        flex: 1,
        backgroundColor: "#1D66A1",
        padding: 10,
        borderRadius: 4,
        marginRight: 10,
        alignItems: "center",
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: "#EA2731",
        padding: 10,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: 'center'
    },
    updateText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
        textAlign: 'center'
    },
    cancelText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
        textAlign: 'center'
    },
    itemRowiconbg: {
        height: 30,
        width: 30,
        borderRadius: 50,
        backgroundColor: '#FF002029',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    itemrowicon: {
        height: 15,
        width: 15,
        alignSelf: 'center',

    },
    modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    modalItemText: { fontSize: 14, color: '#0a0a0aff' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '70%'
    },
    modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    modalCloseButton: { marginTop: 15, padding: 10, backgroundColor: '#FF0020', borderRadius: 5 },
    modalCloseText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },





});

export default Deliveryupdate;