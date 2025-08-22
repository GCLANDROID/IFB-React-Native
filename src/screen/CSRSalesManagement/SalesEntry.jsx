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


const SalesEntry = () => {
    const [loading, setLoading] = useState(false);

    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Please Select");
    const [selectedCategoryID, setSelectedCategoryID] = useState("");


    const [titleModalVisible, setTitleModalVisible] = useState(false);
    const [titlw, setTitle] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("Please Select");
    const [selectedTitleID, setSelectedTitleID] = useState("");

    const [exchangeModalVisible, setExchangeModalVisible] = useState(false);
    const [selectedExchange, setSelectedExchange] = useState("Please Select");
    const [selectedExchangeID, setSelectedExchangeID] = useState("");


    const [financeModalVisible, setFinanceModalVisible] = useState(false);
    const [selectedFinance, setSelectedFinance] = useState("Please Select");



    const [schemeModalVisible, setSchemeModalVisible] = useState(false);
    const [scheme, setScheme] = useState([]);
    const [selectedScheme, setSchemeFinance] = useState("Please Select");
    const [selectedSchemeID, setSelectedSchemeID] = useState("0");



    const [modelModalVisible, setModelModalVisible] = useState(false);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState("Please Select");
    const [selectedModelID, setSelectedModelID] = useState("");

    const [currentDate, setCurrentDate] = useState("");


    const [monthName, setMonthName] = useState("");
    const [financialYear, setFinancialYear] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobNumber, setMobNumber] = useState("");
    const [mobile, setMobile] = useState("");
    const [invoiceValue, setInvoiceValue] = useState("");
    const [qty, setQty] = useState("");

    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState("");


    const underExchange = [
        { id: "1", value: "Yes" },
        { id: "0", value: "No" },

    ];

    useEffect(() => {
        fetchScheme();
        fetchTitle();
        fetchCategories();
        setCurrentDate(getCurrentDate());
        const { monthName, financialYear } = getMonthAndFinancialYear();
        setMonthName(monthName);
        setFinancialYear(financialYear);
    }, []);

    const fetchCategories = async () => {

        setLoading(true);
        try {
            const securityCode = await AsyncStorage.getItem('SecurityCode');
            const url = API.FETCH_CATEGORY(
                4, 0, 0, 0, 0, securityCode
            );
            const response = await axios.get(
                url
            );

            if (response.data?.responseStatus) {
                setCategories(response.data.responseData);
            }
        } catch (error) {
            console.error("Error fetching categories:", error.message);
        } finally {
            setLoading(false);
        }
    };


    const fetchTitle = async () => {

        setLoading(true);
        try {
            const securityCode = await AsyncStorage.getItem('SecurityCode');
            const url = API.FETCH_TITLE(
                42, 0, 0, 0, 0, securityCode
            );
            const response = await axios.get(
                url
            );

            if (response.data?.responseStatus) {
                setTitle(response.data.responseData);
            }
        } catch (error) {
            console.error("Error fetching categories:", error.message);
        } finally {
            setLoading(false);
        }
    };


    const fetchScheme = async () => {

        setLoading(true);
        try {
            const securityCode = await AsyncStorage.getItem('SecurityCode');
            const url = API.FETCH_FINANCIAL_SCHEME(
                35, 0, 0, 0, 0, securityCode
            );
            const response = await axios.get(
                url
            );

            if (response.data?.responseStatus) {
                setScheme(response.data.responseData);
            }
        } catch (error) {
            console.error("Error fetching categories:", error.message);
        } finally {
            setLoading(false);
        }
    };



    const fetchModels = async (categoryId) => {
        setLoading(true);
        try {
            const branchId = await AsyncStorage.getItem('BranchId');  // replace with your prefManager.getBranchId()
            const securityCode = await AsyncStorage.getItem('SecurityCode');

            const url = API.FETCH_MODEL(
                "18M",
                categoryId,
                0,
                branchId,
                0,
                securityCode
            );

            const response = await axios.get(url);

            if (response.data?.responseStatus) {
                setModels(response.data.responseData);
            }
        } catch (error) {
            console.error("Error fetching models:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentDate = () => {
        const today = new Date();

        const day = today.getDate().toString().padStart(2, '0'); // dd
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[today.getMonth()]; // MMM
        const year = today.getFullYear(); // yyyy

        return `${day}-${month}-${year}`;
    };


    const getMonthAndFinancialYear = () => {
        const today = new Date();

        // 👉 Current Month Name
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[today.getMonth()];

        // 👉 Financial Year
        let year = today.getFullYear();
        let financialYear = "";

        if (today.getMonth() + 1 <= 3) {
            // Jan, Feb, Mar → still in previous FY
            financialYear = `${year - 1}-${year}`;
        } else {
            // Apr onwards → new FY
            financialYear = `${year}-${year + 1}`;
        }

        return { monthName, financialYear };
    };


    const handleCategorySelect = (item) => {
        setSelectedCategory(item.value);
        setCategoryModalVisible(false);
        setSelectedCategoryID(item.id);

        fetchModels(item.id);
    };

    const handleTitleSelect = (item) => {
        setSelectedTitle(item.value);
        setSelectedTitleID(item.id);
        setTitleModalVisible(false);
    };

    const handleExchnageSelect = (item) => {
        setSelectedExchange(item.value);
        setSelectedExchangeID(item.id);
        setExchangeModalVisible(false);
    };
    const handleFinanceSelect = (item) => {
        setSelectedFinance(item.value);
        setFinanceModalVisible(false);
    };


    const handleSchemeSelect = (item) => {
        setSchemeFinance(item.value);
        setSelectedSchemeID(item.id);
        setSchemeModalVisible(false);
    };


    const handleModelSelect = (item) => {
        setSelectedModel(item.value);
        setSelectedModelID(item.id);
        setModelModalVisible(false);
    };

    // Separate render function
    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect(item)}
        >
            <Text style={styles.modalItemText}>{item.value}</Text>
        </TouchableOpacity>
    );

    const renderTitleItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleTitleSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.value}</Text>
        </TouchableOpacity>
    );




    const renderModelItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleModelSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.value}</Text>
        </TouchableOpacity>
    );



    const renderExchangeItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleExchnageSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.value}</Text>
        </TouchableOpacity>
    );


    const renderFinanceItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleFinanceSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.value}</Text>
        </TouchableOpacity>
    );


    const renderSchemeItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleSchemeSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.value}</Text>
        </TouchableOpacity>
    );

    const handleChange = (text) => {
        // allow only digits
        const formatted = text.replace(/[^0-9]/g, "");
        setMobile(formatted);

        if (formatted.length === 10) {
            checkMobile(formatted); // 🔥 hit API only when 10 digits entered
        }
    };

    const checkMobile = async (number) => {
        setLoading(true);
        try {
            const url = API.MOBILE_VALIDATION(
                number

            );
            const response = await axios.get(url);

            if (response.data?.responseStatus) {
                setMobNumber(number);
                setLoading(false);

                // you can also set it in state if needed
            } else {
                setLoading(false);
                Alert.alert("⚠️ Invalid", response.data?.responseText || "Invalid mobile number");

                setMobile("");// clear input if invalid
            }
        } catch (error) {
            setLoading(false);
            Alert.alert("Error", "Something went wrong. Please try again.");
            console.error(error);
        }
    };


    const handleOTPSubmit = () => {
        // 👉 Open OTP popup
        setOtpModalVisible(true);
    };

    const handleVerifyOtp = () => {
        if (otp === "123456") {
            Alert.alert("✅ Code Verified Successfully!");
            setOtpModalVisible(false);
        } else {
            Alert.alert("❌ Invalid OTP");
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
                        <ScrollView style={{ flex: 1 }}>

                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 20, alignContent: 'center', backgroundColor: '#FF0020', paddingVertical: 10, paddingHorizontal: 10 }}>
                                <TouchableOpacity >
                                    <Image source={require('../../asset/back-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                                <Text style={styles.nameText}>Sales Entry</Text>
                                <TouchableOpacity >
                                    <Image source={require('../../asset/home-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 1, padding: 20 }}>
                                <View style={{ justifyContent: 'space-between', marginBottom: 20 }}>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Category *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setCategoryModalVisible(true)}>
                                            <Text style={styles.inputValue}>{selectedCategory}</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Model *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setModelModalVisible(true)}>
                                            <Text style={styles.inputValue}>{selectedModel}</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Title *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setTitleModalVisible(true)}>
                                            <Text style={styles.inputValue}>{selectedTitle}</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            First Name *
                                        </Text>
                                        <TouchableOpacity style={[styles.inputBox]}>
                                            <TextInput
                                                placeholder='Enter First Name'
                                                style={styles.inputValue}
                                                placeholderTextColor={'#564F4F'}
                                                value={firstName}
                                                onChangeText={setFirstName} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Last Name *
                                        </Text>
                                        <TouchableOpacity style={[styles.inputBox]}>
                                            <TextInput
                                                placeholder='Enter Last Name'
                                                style={styles.inputValue}
                                                placeholderTextColor={'#564F4F'}
                                                value={lastName}
                                                onChangeText={setLastName} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            10 Digit Mobile Number *
                                        </Text>
                                        <View style={[styles.inputBox]}>
                                            <TextInput
                                                placeholder='Enter Mobile Number'
                                                style={styles.inputValue}
                                                placeholderTextColor={'#564F4F'}
                                                keyboardType="numeric"
                                                maxLength={10}
                                                value={mobile}
                                                onChangeText={handleChange}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Invoice Value *
                                        </Text>
                                        <View style={[styles.inputBox]}>
                                            <TextInput
                                                placeholder='Enter Invoice Value'
                                                style={styles.inputValue}
                                                placeholderTextColor={'#564F4F'}
                                                keyboardType="numeric"
                                                value={invoiceValue}
                                                onChangeText={(text) => {
                                                    if (text.includes(".")) {
                                                        Alert.alert("⚠️ Invalid - Decimal values are not allowed");
                                                        return;
                                                    }
                                                    setInvoiceValue(text); // ✅ only whole numbers
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Quantity *
                                        </Text>
                                        <View style={[styles.inputBox]}>
                                            <TextInput
                                                placeholder='Enter Quantity'
                                                style={styles.inputValue}
                                                placeholderTextColor={'#564F4F'}
                                                keyboardType="numeric"
                                                value={qty}
                                                onChangeText={(text) => {
                                                    const num = parseInt(text) || 0;

                                                    if (num <= 5) {
                                                        setQty(text); // valid input
                                                    } else {
                                                        Alert.alert("⚠️ Invalid - Quantity cannot be greater than 5");
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Under Exchange *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setExchangeModalVisible(true)}>
                                            <Text style={styles.inputValue}>{selectedExchange}</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Under Finance Scheme *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setFinanceModalVisible(true)}>
                                            <Text style={styles.inputValue}>{selectedFinance}</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    {selectedFinance === "Yes" && (
                                        <View style={styles.itemrow}>
                                            <Text style={styles.titleText}>
                                                Select Finance Scheme *
                                            </Text>
                                            <TouchableOpacity style={styles.inputBox} onPress={() => setSchemeModalVisible(true)}>
                                                <Text style={styles.inputValue}>{selectedScheme}}</Text>
                                                <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <TouchableOpacity style={styles.submitbox} onPress={handleOTPSubmit}>
                                        <Text style={styles.submitText}>
                                            Submit
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>


                    <Modal
                        visible={categoryModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setCategoryModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Category</Text>


                                <FlatList
                                    data={categories}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderCategoryItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setCategoryModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        visible={titleModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setTitleModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Title</Text>


                                <FlatList
                                    data={titlw}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderTitleItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setTitleModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        visible={exchangeModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setExchangeModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Under Exchange</Text>


                                <FlatList
                                    data={underExchange}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderExchangeItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setExchangeModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        visible={financeModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setFinanceModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Under Finacial Scheme</Text>


                                <FlatList
                                    data={underExchange}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderFinanceItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setFinanceModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        visible={schemeModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setSchemeModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Finacial Scheme</Text>


                                <FlatList
                                    data={scheme}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderSchemeItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setSchemeModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        visible={modelModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModelModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Model</Text>


                                <FlatList
                                    data={models}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderModelItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setModelModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    {/* OTP Modal */}
                    <Modal
                        visible={otpModalVisible}
                        animationType="slide"
                        transparent={true}
                        TouchableWithoutFeedback={() => setOtpModalVisible(false)}
                        onRequestClose={() => setOtpModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalBox}>
                                
                                <Text style={styles.subText}>Enter Code Received</Text>

                                <TextInput
                                    style={styles.otpInput}
                                    placeholder="Enter Code"
                                    maxLength={7}
                                    value={otp}
                                    onChangeText={setOtp}
                                />

                                <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOtp}>
                                    <Text style={styles.verifyText}>Verify Code</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => Alert.alert("Code Resent!")}>
                                    <Text style={styles.resendText}>Resend Code</Text>
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

    menuTextText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: 400,
        textAlign: 'center',
        marginTop: 5,

    },
    menuICon: {
        width: 75,
        height: 75
    },
    card: {
        height: 150,
        width: 150,
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10.5,
        elevation: 10,
        borderWidth: 1,
        borderColor: "#21212133",
        paddingHorizontal: 10,
        marginHorizontal: 15,
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
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
    itemrow: {
        marginBottom: 20,
        width: '100%'
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
        fontSize: 16,
        color: '#fffdfdff',
        fontWeight: '700',
        textAlign: 'center',


    },
    topImage: {
        height: '100%',
        width: '100%',

    },


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
    modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    modalItemText: { fontSize: 14, color: '#333' },
    modalCloseButton: { marginTop: 15, padding: 10, backgroundColor: '#FF0020', borderRadius: 5 },
    modalCloseText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

     modalBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        width: "85%",
        alignItems: "center",
    },
    subText: { fontSize: 14, marginBottom: 10 },
    otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: "80%",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 15,
    padding: 10,
  },
  verifyBtn: {
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: "60%",
    alignItems: "center",
  },
  verifyText: { color: "#fff", fontWeight: "bold" },
  resendText: { color: "#1976D2", marginTop: 5 },





});

export default SalesEntry;