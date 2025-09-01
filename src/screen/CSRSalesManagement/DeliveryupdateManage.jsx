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
    Platform,
    DatePickerAndroid,
    DatePickerIOS,
    PermissionsAndroid,



} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";
import API from '../../util/API';
import { Loader } from '../../util/Loader';
import { useRoute } from '@react-navigation/native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
const daysInMonth = (month, year) => new Date(year, month, 0).getDate();





const DeliveryupdateManage = () => {

    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const { CategoryID } = route.params || {};
    const { ReferenceNo } = route.params || {};
    const { CustomerPhNo } = route.params || {};
    const { FinanceScheme } = route.params || {};
    const { FinancialYear } = route.params || {};
    const { Month } = route.params || {};
    const { Quantity } = route.params || {};
    const { ModelCode } = route.params || {};
    const { CustomerName } = route.params || {};
    const { DeliveryAddress } = route.params || {};
    const { FirstName } = route.params || {};
    const { LastName } = route.params || {};
    const { InvoiceValue } = route.params || {};
    const { UnderExchange } = route.params || {};
    const { WiFiDeviceStatus } = route.params || {};


    const [stateList, setStateList] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedStateID, setSelectedStateID] = useState("");
    const [pincode, setPincode] = useState("");

    const [selectedCity, setSelectedCity] = useState("");

    const [areas, setAreas] = useState([]);        // all areas from API
    const [selectedArea, setSelectedArea] = useState("");
    const [areaModalVisible, setAreaModalVisible] = useState(false);

    const [selectedCSD, setSelectedCSD] = useState("");
    const [selectedCSDID, setSelectedCSDID] = useState("");
    const [csdModalVisible, setCSDModalVisible] = useState(false);

    const [selectedDisplaySold, setSelectedDisplaySold] = useState("");
    const [selectedDisplaySoldID, setSelectedDisplaySoldID] = useState("");
    const [displaySoldModalVisible, setDisplaySoldModalVisible] = useState(false);


    const [selectedPedestal, setSelectedPedestal] = useState("");
    const [selectedPedestalID, setSelectedPedestalID] = useState("");
    const [pedestalModalVisible, setPedestalModalVisible] = useState(false);


    const [installationList, setInstallationList] = useState([]);
    const [selectedInstallation, setSelectedInstallation] = useState("");
    const [selectedInstallationID, setSelectedInstallationID] = useState("");
    const [installationModalVisible, setInstallationModalVisible] = useState(false);

    const [deliveryDate, setDeliveryDate] = useState("");
    const [saleDate, setSaleDate] = useState("");
    const [showPicker, setShowPicker] = useState(false);

    const [showPickerForSales, setShowPickerForSales] = useState(false);

    const [capturedImage, setCapturedImage] = useState(null);


    const [salesTypeList, setsalesTypeList] = useState([]);
    const [selectedSalesType, setSelectedSalesType] = useState("");
    const [selectedSalesTypeID, setSelectedSalesTypeID] = useState("");
    const [salesTypeModalVisible, setSalesTypeModalVisible] = useState(false);


    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const days = Array.from({ length: daysInMonth(month, year) }, (_, i) => i + 1);


    console.log("ReferenceNo:", ReferenceNo);
    console.log("CustomerPhNo:", CustomerPhNo);
    console.log("FinanceScheme:", FinanceScheme);
    console.log("FinancialYear:", FinancialYear);
    console.log("Month:", Month);
    console.log("Quantity:", Quantity);
    console.log("UnderExchange:", UnderExchange);


    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPincode, setCustomerPincode] = useState("");
    const [customerLandmark, setCustomerLandmark] = useState("");
    const [customerStreet, setCustomerStreet] = useState("");
    const [customerHouseNo, setCustomerHouseNo] = useState("");

    const [remarks, setRemarks] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [serialNo, setSerialNo] = useState("");
    const [odUNumber, setOdUNumber] = useState("");

    const [csrOBJ, setCsrOBJ] = useState({});
    const [rcnList, setRcnList] = useState([]);
    const navigation=useNavigation();











    const yesNoOptions = [
        { ID: 'N', Value: 'No' },
        { ID: 'Y', Value: 'Yes' }
    ];

    useEffect(() => {
        fetchSalesType();
        fetchCustomerDetails();
        fetchInstallation();
        fetchStates();
    }, []);



    const fetchStates = async () => {
        setLoading(true);
        // Example security code, replace with actual if needed
        try {
            const securityCode = await AsyncStorage.getItem('SecurityCode');
            const url = API.COMMON_DDL("2", "0", "0", "0", "0", securityCode);
            const res = await fetch(url);
            const json = await res.json();
            setLoading(false);
            console.log("States API Response:", json);

            if (json.responseStatus) {
                setStateList(json.responseData);
            }
        } catch (err) {
            setLoading(false);
            console.error("Error fetching states:", err);
        }
    };


    const fetchInstallation = async () => {
        setLoading(true);
        // Example security code, replace with actual if needed
        try {
            const securityCode = await AsyncStorage.getItem('SecurityCode');
            const salesPartyCode = await AsyncStorage.getItem('SalesPartyCode');

            const url = API.COMMON_DDL("717", salesPartyCode, "0", "0", "0", securityCode);
            const res = await fetch(url);
            const json = await res.json();
            setLoading(false);
            console.log("Installation API Response:", json);

            if (json.responseStatus) {
                setInstallationList(json.responseData);
            }
        } catch (err) {
            setLoading(false);
            console.error("Error fetching states:", err);
        }
    };

    const fetchSalesType = async () => {
        setLoading(true);
        // Example security code, replace with actual if needed
        try {
            const securityCode = await AsyncStorage.getItem('SecurityCode');

            const url = API.COMMON_DDL("SISY", "0", "0", "0", "0", securityCode);
            const res = await fetch(url);
            const json = await res.json();
            setLoading(false);
            console.log("Installation SalesType Response:", json);

            if (json.responseStatus) {
                setsalesTypeList(json.responseData);
            }
        } catch (err) {
            setLoading(false);
            console.error("Error fetching states:", err);
        }
    };


    const fetchCustomerDetails = async () => {
        setLoading(true);
        try {
            const contactNumber = CustomerPhNo; // replace with route.params.contact or from storage

            const url = `https://crmapi.ifbsupport.com/api/v1/customers/search?contact=${contactNumber}`;
            console.log("Fetching customer details:", url);

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer ZW55dXNlcjplbnl1JGVy", // add correct token if needed
                    "Content-Type": "application/json",
                },
            });

            const json = await res.json();
            console.log("Customer API Response:", json);
            setLoading(false);

            if (json && json.Data && json.Data.length > 0) {
                const jobj = json.Data[0];

                setCustomerEmail(jobj.zzemail || "");
                setCustomerPincode(jobj.zzpost_code1 || "");
                setCustomerLandmark(jobj.zzstr_suppl1 || "");
                setCustomerStreet(jobj.zzstreet || "");
                setCustomerHouseNo(jobj.House_num1 || "");
            }
        } catch (err) {
            setLoading(false);
            console.error("Error fetching customer details:", err);
        }
    };





    const handlePincodeChange = async (text) => {

        if (text.length === 6) {
            setLoading(true);
            try {
                const res = await fetch(`https://crmapi.ifbsupport.com/api/wa/find-area?PinCode=${text}`, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer V0hBVFNBUFA6d2FVU0VS",
                        "Cookie": "TS013f4d0e=0175b9c4a690ee000d09f27c739e8ddc6598c7da8e3b96ffc2c170e8d24c349a15cf26ed8188e9728e693bc57722ad375fc741c358"
                    }
                });

                const json = await res.json();
                console.log("Pincode API:", json);
                setPincode(text);
                setLoading(false);

                if (json && json.length > 0) {
                    const { State, City, Area } = json[0];

                    setSelectedArea(Area);

                    setAreas(json.map(item => item.Area));

                    // ✅ match with CommonDDL states
                    matchState(State);
                    setSelectedCity(City);
                }
            } catch (err) {
                setLoading(false);
                console.error("Error fetching area:", err);
            }
        }
    };

    const matchState = (stateNameFromPin) => {
        if (!stateList || stateList.length === 0) return;

        // find by value
        const found = stateList.find(s =>
            s.value.toLowerCase().trim() === stateNameFromPin.toLowerCase().trim()
        );

        if (found) {
            setSelectedState(found.value);
            setSelectedStateID(found.id);
            console.log("Matched State ID:", found.id);
        } else {
            console.log("State not found in dropdown list:", stateNameFromPin);
        }
    };

    const handleAreaSelect = (item) => {
        setSelectedArea(item);

        setAreaModalVisible(false);
    };

    const renderAreaItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleAreaSelect(item)}
        >
            <Text style={styles.modalItemText}>{item}</Text>
        </TouchableOpacity>
    );

    const handleCSDSelect = (item) => {
        setSelectedCSD(item.Value);
        setSelectedCSDID(item.ID);

        setCSDModalVisible(false);
    };


    const renderCSDItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCSDSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.Value}</Text>
        </TouchableOpacity>
    );


    const handleDisplaySoldSelect = (item) => {
        setSelectedDisplaySold(item.Value);
        setSelectedDisplaySoldID(item.ID);

        setDisplaySoldModalVisible(false);
    };

    const renderDisplaySoldItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleDisplaySoldSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.Value}</Text>
        </TouchableOpacity>
    );


    const handlePedestalSelect = (item) => {
        setSelectedPedestal(item.Value);
        setSelectedPedestalID(item.ID);

        setPedestalModalVisible(false);
    };

    const renderPedestalItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handlePedestalSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.Value}</Text>
        </TouchableOpacity>
    );

    const handleInstallationSelect = (item) => {
        setSelectedInstallation(item.value);
        setSelectedInstallationID(item.id);

        setInstallationModalVisible(false);
    };

    const renderInstallationItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleInstallationSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.value}</Text>
        </TouchableOpacity>
    );

    const handleSalesTypeSelect = (item) => {
        setSelectedSalesType(item.value);
        setSelectedSalesTypeID(item.id);

        setSalesTypeModalVisible(false);
    };


    const renderSalesTypeItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleSalesTypeSelect(item)}
        >
            <Text style={styles.modalItemText}>{item.value}</Text>
        </TouchableOpacity>
    );




    const onSelectDay = (day) => {
        const selected = dayjs(new Date(year, month - 1, day)).format("DD-MMMM-YYYY");
        setDeliveryDate(selected);
        setSaleDate(selected);
        setShowPicker(false);
    };

    const onSelectDayForSales = (day) => {
        const selected = dayjs(new Date(year, month - 1, day)).format("DD-MMMM-YYYY");
        setSaleDate(selected);
        setShowPickerForSales(false);
    };


    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'This app needs access to your camera to take attendance pictures.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };
    const openCamera = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
            return;
        }

        launchCamera(
            {
                mediaType: 'photo',
                cameraType: 'back',
                saveToPhotos: true,
            },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    console.log('Camera error:', response.errorMessage);
                } else {
                    const source = { uri: response.assets[0].uri };
                    setCapturedImage(source);
                }
            }
        );
    };


    const validateEmailAPI = async (email) => {
        if (!email || !email.includes("@")) return; // basic check before hitting API

        try {
            setLoading(true);
            const url = API.EMAIL_VALIDATION(
                email

            );
            console.log("Checking Email Validity:", url);

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json = await res.json();
            console.log("Email Validation Response:", json);

            setLoading(false);

            if (json.responseStatus === false) {
                Alert.alert("Invalid Email", "Please enter a valid email address.");
                setCustomerEmail(""); // clear invalid email
            }
        } catch (err) {
            setLoading(false);
            console.error("Error validating email:", err);
        }
    };


    const validateForm = () => {
        if (!deliveryDate) {
            Alert.alert("Validation", "Please select Delivery Date");
            return false;
        }
        if (!saleDate) {
            Alert.alert("Validation", "Please select Sales Date");
            return false;
        }
        if (!customerEmail || !customerEmail.includes("@")) {
            Alert.alert("Validation", "Please enter a valid Email");
            return false;
        }
        if (!pincode || pincode.length !== 6) {
            Alert.alert("Validation", "Please enter a valid 6-digit Pincode");
            return false;
        }
        if (!selectedStateID) {
            Alert.alert("Validation", "Please select State");
            return false;
        }
        if (!selectedCity) {
            Alert.alert("Validation", "Please select City");
            return false;
        }
        if (!selectedArea) {
            Alert.alert("Validation", "Please select Area");
            return false;
        }
        if (!customerHouseNo || customerHouseNo.trim() === "" || customerHouseNo.length < 3) {
            Alert.alert("Validation", "Please enter House Number");
            return false;
        }
        if (!customerStreet || customerStreet.trim() === "" || customerStreet.length < 3) {
            Alert.alert("Validation", "Please enter Street Name");
            return false;
        }
        if (!customerLandmark && customerLandmark.trim() === "" && customerLandmark.length < 3) {
            Alert.alert("Validation", "Please enter Land Mark");
            return false;
        }


        if (FinanceScheme !== "" && FinanceScheme !== "0" && !selectedSalesTypeID) {
            Alert.alert("Validation", "Please select Sales Type");
            return false;
        }
        if (!selectedCSDID) {
            Alert.alert("Validation", "Please select CSD Sale option");
            return false;
        }
        if (!selectedDisplaySoldID) {
            Alert.alert("Validation", "Please select Display Matrix Sold option");
            return false;
        }


        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const userId = await AsyncStorage.getItem("UserID");
            const branchId = await AsyncStorage.getItem("BranchId");
            const securityCode = await AsyncStorage.getItem("SecurityCode");

            const formData = new FormData();

            formData.append("TransNo", "0");
            formData.append("ReferenceNo", ReferenceNo);
            formData.append("AEMEmployeeID", userId);
            formData.append("SalesDate", saleDate);
            formData.append("FinancialYear", FinancialYear);
            formData.append("Month", Month);
            formData.append("CategoryID", CategoryID);
            formData.append("Quantity", Quantity);
            formData.append("UserID", userId);
            formData.append("BranchID", branchId);
            formData.append("ModelID", ModelCode);
            formData.append("CustomerName", CustomerName);
            formData.append("CustomerPhNo", CustomerPhNo);
            formData.append("CustomerPinCode", pincode);
            formData.append("CustomerEmail", customerEmail);
            formData.append("InvoiceNo", invoiceNumber);
            formData.append("FinanceScheme", FinanceScheme || "0");
            formData.append("DeliveryAddress", DeliveryAddress);
            formData.append("FirstName", FirstName);
            formData.append("LastName", LastName);
            formData.append("CustomerAlternateNumber", "");
            formData.append("HouseNo", customerHouseNo);
            formData.append("StreetName", customerStreet);
            formData.append("Landmark", customerLandmark);
            formData.append("Title", "0");
            formData.append("StateID", selectedStateID);
            formData.append("City", selectedCity);
            formData.append("InvoiceValue", InvoiceValue);
            formData.append("Remarks", remarks);
            formData.append("UnderExchange", UnderExchange || "0");
            formData.append("Area", selectedArea);
            formData.append("SalesEntryFlag", "1");
            formData.append("SerialNo", serialNo);
            formData.append("SerialNo1", odUNumber);
            formData.append("InstallationBy", selectedInstallationID);
            formData.append("SalesType", selectedSalesTypeID);
            formData.append("WiFiDeviceStatus", WiFiDeviceStatus);
            formData.append("Delivery_Date", deliveryDate);
            formData.append("Delivery_Remarks", remarks);
            formData.append("Operation", "3");
            formData.append("SubOperation", "4");
            formData.append("DisplayMatrix_Sold", selectedDisplaySoldID);
            formData.append("CSD_Sales", selectedCSDID);
            formData.append("PedestalSales", selectedPedestalID);
            formData.append("SecurityCode", securityCode);

            if (capturedImage && capturedImage.uri) {
                const uri = capturedImage.uri;
                const fileName = uri.split("/").pop();
                const fileType = "image/jpeg"; // or detect dynamically

                formData.append("Invoicecopy", {
                    uri: uri,
                    type: fileType,
                    name: fileName || "invoice.jpg",
                });
            }
            console.log("Submitting Form Data:", formData);

            const res = await axios.post(
                API.POST_EMPLOYEE_SALES_DELIVERY_UPDATE,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Submit Response:", res.data);

            if (res.data.responseStatus) {
                Alert.alert("Succeess", res.data.responseText);
                navigation.replace('SalesDashboard');
                
            } else {
                Alert.alert("Failed", res.data.responseText || "Something went wrong");
            }
        } catch (err) {
            console.error("Submit Error:", err);
            Alert.alert("Error", "Failed to submit data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchDummyTokenByReference = async (securityCode) => {
        const Code = await AsyncStorage.getItem("Code");
        setLoading(true);


        try {
            const res = await axios.get(API.GET_INFORMATION_TOKEN(ReferenceNo, securityCode));
            const data = res.data;

            setLoading(false);


            let tempRcnList = [];

    if (Array.isArray(data)) {
      for (let object of data) {
        await parseCSRObject(object, tempRcnList, setCsrOBJ);
      }
    } else if (data && Array.isArray(data.Data)) {
      for (let object of data.Data) {
        await parseCSRObject(object, tempRcnList, setCsrOBJ);
      }
    } else if (data && typeof data === "object") {
      await parseCSRObject(data, tempRcnList, setCsrOBJ);
    }

    setRcnList(tempRcnList);
        } catch (err) {
            setLoading(false);
            console.error("Error in fetchDummyTokenByReference:", err);
        }
    };

    const parseCSRObject = async (object, tempRcnList, setCsrOBJ) => {
        const TokenNo = object.TokenNo || "";
        const CategoryShortName = object.CategoryShortName || "";
        const SerialNo = object.SerialNo || "";
        const ModelCode = object.ModelCode || "";
        const FirstName = object.FirstName || "";
        const LastName = object.LastName || "";
        const DeliveryAddress = object.DeliveryAddress || "";
        const StreetName = object.StreetName || "";
        const CustomerPinCode = object.CustomerPinCode || "";
        const City = object.City || "";
        const StateName = object.StateName || "";
        const SerialNo2 = object.SerialNo2 || "";
        const CustomerPhNo = object.CustomerPhNo || "";
        const AlternateNumber = object.AlternateNumber || "";
        const CustomerEmail = object.CustomerEmail || "";
        const SalesDate = object.SalesDate || "";
        const ShipPartyCode = object.ShipPartyCode || "";
        const MultipleProduct = object.MultipleProduct || "";
        const installationBy = object.InstallationBy || "";
        const WiFiDeviceStatus = object.WiFiDeviceStatus || "";
        const RELIANCEFLAG = object.RELIANCEFLAG || "";

        tempRcnList.push({
            Token: TokenNo,
            SerNumber: SerialNo,
            ShortName: CategoryShortName,
        });

        const userCode = await AsyncStorage.getItem("UserCode");

        setCsrOBJ({
            MODEL: ModelCode,
            PRODUCT: CategoryShortName,
            CUSTOMERFIRSTNAME: FirstName,
            CUSTOMERLASTNAME: LastName,
            ADDRESS: DeliveryAddress,
            STREET: StreetName,
            PINCODE: CustomerPinCode,
            CITY: City,
            STATE: StateName,
            MOBILENO: CustomerPhNo,
            ALTMOBNO: AlternateNumber,
            EMAIL: CustomerEmail,
            PURCHASEDATE: SalesDate,
            DEALER: ShipPartyCode,
            TOKENNO: TokenNo,
            CREATEDBY: userCode,
            RELIANCEFRANCH: "",
            RELIANCEFLAG: RELIANCEFLAG,
            MULTIPLEQUANTITY: MultipleProduct,
            TOKENCREATED: new Date().toISOString(),
            INSTALLATIONBY: installationBy,
            IDUSERIAL: SerialNo,
            ODUSERIAL: SerialNo2,
            WIFI: WiFiDeviceStatus,
            FILECREATED: new Date().toISOString(),
        });
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
                                <TouchableOpacity >
                                    <Image source={require('../../asset/back-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                                <Text style={styles.nameText}>Delivery Update</Text>
                                <TouchableOpacity >
                                    <Image source={require('../../asset/home-icon.png')} style={styles.headerIcon} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={{ flex: 1 }}>
                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Delivery Date
                                    </Text>
                                    <TouchableOpacity style={styles.inputBox} onPress={() => setShowPicker(true)} >
                                        <Text style={styles.inputValue}>{deliveryDate || "MM/DD/YYYY"}</Text>
                                        <Image source={require('../../asset/date.png')} style={styles.inputboxicon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Sales date
                                    </Text>
                                    <TouchableOpacity style={styles.inputBox} onPress={() => setShowPickerForSales(true)}>
                                        <Text style={styles.inputValue}>{saleDate || "MM/DD/YYYY"}</Text>
                                        <Image source={require('../../asset/date.png')} style={styles.inputboxicon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Remarks
                                    </Text>
                                    <TouchableOpacity style={[styles.inputBox, { height: 60, alignItems: 'flex-start', paddingTop: 10 }]} >
                                        <TextInput
                                            value={remarks}
                                            onChangeText={(text) => setRemarks(text)}
                                            multiline
                                            numberOfLines={4}
                                            style={styles.inputValue}
                                            placeholderTextColor={'#564F4F'}
                                        />
                                    </TouchableOpacity>


                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Email
                                    </Text>
                                    <TouchableOpacity style={[styles.inputBox]} >
                                        <TextInput
                                            value={customerEmail}
                                            onChangeText={(text) => setCustomerEmail(text)}
                                            onEndEditing={() => validateEmailAPI(customerEmail)}
                                            keyboardType='email-address'
                                            style={styles.inputValue}
                                            placeholderTextColor={'#564F4F'}
                                        />
                                    </TouchableOpacity>


                                </View>


                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Delivery Pincode
                                    </Text>
                                    <View style={[styles.inputBox]} >
                                        <TextInput
                                            keyboardType='number-pad'
                                            maxLength={6}
                                            style={styles.inputValue}
                                            placeholderTextColor={'#564F4F'}

                                            onChangeText={(text) => handlePincodeChange(text)}
                                        />
                                    </View>


                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        State
                                    </Text>
                                    <TouchableOpacity style={styles.inputBox} >
                                        <Text style={styles.inputValue}>{selectedState || "Please Select"}</Text>
                                        <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        City
                                    </Text>
                                    <TouchableOpacity style={styles.inputBox} >
                                        <Text style={styles.inputValue}>{selectedCity || "Please Select"}</Text>
                                        <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Area
                                    </Text>
                                    <TouchableOpacity style={styles.inputBox} onPress={() => setAreaModalVisible(true)} >
                                        <Text style={styles.inputValue}>{selectedArea || "Please Select"}</Text>
                                        <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                    </TouchableOpacity>
                                </View>


                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        House Number
                                    </Text>
                                    <TouchableOpacity style={[styles.inputBox]} >
                                        <TextInput
                                            value={customerHouseNo}
                                            onChangeText={(text) => setCustomerHouseNo(text)}
                                            style={styles.inputValue}
                                            placeholderTextColor={'#564F4F'}
                                        />
                                    </TouchableOpacity>


                                </View>


                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Street Name
                                    </Text>
                                    <TouchableOpacity style={[styles.inputBox]} >
                                        <TextInput
                                            value={customerStreet}
                                            onChangeText={(text) => setCustomerStreet(text)}
                                            style={styles.inputValue}
                                            placeholderTextColor={'#564F4F'}
                                        />
                                    </TouchableOpacity>


                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Land Mark
                                    </Text>
                                    <TouchableOpacity style={[styles.inputBox]} >
                                        <TextInput
                                            value={customerLandmark}
                                            onChangeText={(text) => setCustomerLandmark(text)}
                                            style={styles.inputValue}
                                            placeholderTextColor={'#564F4F'}
                                        />
                                    </TouchableOpacity>


                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Invoice Number
                                    </Text>
                                    <TouchableOpacity style={[styles.inputBox]} >
                                        <TextInput
                                            value={invoiceNumber}
                                            onChangeText={(text) => setInvoiceNumber(text)}
                                            style={styles.inputValue}
                                            placeholderTextColor={'#564F4F'}
                                        />
                                    </TouchableOpacity>


                                </View>
                                {CategoryID === "IFBPC1000001" && (
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Installation Type
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setInstallationModalVisible(true)}>
                                            <Text style={styles.inputValue}>{selectedInstallation || "Please Select"}</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {CategoryID === "IFBPC1000040" && (
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            With Pedestal Sales
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setPedestalModalVisible(true)}>
                                            <Text style={styles.inputValue}>{selectedPedestal || 'Please Select'}</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <View style={styles.itemrow}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                                        <Text style={styles.titleText}>
                                            Serial / AC IDU Number
                                        </Text>


                                    </View>

                                    <TouchableOpacity style={[styles.inputBox]} >
                                        <TextInput
                                            value={serialNo}
                                            onChangeText={(text) => setSerialNo(text)}
                                            style={styles.inputValue}
                                            placeholderTextColor={'#564F4F'}
                                        />
                                    </TouchableOpacity>


                                </View>

                                {CategoryID === "IFBPC1000040" && (
                                    <View style={styles.itemrow}>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                                            <Text style={styles.titleText}>
                                                AC ODU Number
                                            </Text>


                                        </View>

                                        <TouchableOpacity style={[styles.inputBox]} >
                                            <TextInput
                                                value={odUNumber}
                                                onChangeText={(text) => setOdUNumber(text)}
                                                style={styles.inputValue}
                                                placeholderTextColor={'#564F4F'}
                                            />
                                        </TouchableOpacity>


                                    </View>
                                )}

                                <View style={styles.itemrow}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                                        <Text style={styles.titleText}>
                                            Invoice Image
                                        </Text>
                                        <TouchableOpacity onPress={openCamera}>
                                            <Image source={require('../../asset/camera-icon.png')} style={{ height: 25, width: 25, right: 20 }} />
                                        </TouchableOpacity>

                                    </View>

                                    <View style={[styles.inputBox]} >
                                        <Image source={capturedImage || require('../../asset/gallery-icon.png')} style={{ height: 50, width: 50 }} />
                                    </View>

                                </View>
                                {FinanceScheme !== "" && FinanceScheme !== "0" && (
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Sales Type
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox} onPress={() => setSalesTypeModalVisible(true)}>
                                            <Text style={styles.inputValue}>{selectedSalesType || "Please Select"}</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <View style={styles.itemrow} >
                                    <Text style={styles.titleText}>
                                        CSD Sale
                                    </Text>
                                    <TouchableOpacity style={styles.inputBox} onPress={() => setCSDModalVisible(true)}>
                                        <Text style={styles.inputValue}>{selectedCSD || "Please Select"}</Text>
                                        <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Display Matrix Sold?
                                    </Text>
                                    <TouchableOpacity style={styles.inputBox} onPress={() => setDisplaySoldModalVisible(true)}>
                                        <Text style={styles.inputValue}>{selectedDisplaySold || "Please Select"}</Text>
                                        <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={styles.submitbox} onPress={handleSubmit} >
                                    <Text style={styles.submitText}>
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                                <View style={{ height: 40 }}></View>

                            </ScrollView>



                        </View>
                    </KeyboardAvoidingView>

                    <Modal
                        visible={areaModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setAreaModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Area</Text>


                                <FlatList
                                    data={areas}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderAreaItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setAreaModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        visible={csdModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setCSDModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Option</Text>


                                <FlatList
                                    data={yesNoOptions}
                                    keyExtractor={(item) => item.ID}
                                    renderItem={renderCSDItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setCSDModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        visible={displaySoldModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setDisplaySoldModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Option</Text>


                                <FlatList
                                    data={yesNoOptions}
                                    keyExtractor={(item) => item.ID}
                                    renderItem={renderDisplaySoldItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setDisplaySoldModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        visible={pedestalModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setPedestalModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Option</Text>


                                <FlatList
                                    data={yesNoOptions}
                                    keyExtractor={(item) => item.ID}
                                    renderItem={renderPedestalItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setPedestalModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        visible={installationModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setInstallationModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Option</Text>


                                <FlatList
                                    data={installationList}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderInstallationItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setInstallationModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal
                        visible={salesTypeModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setSalesTypeModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Option</Text>


                                <FlatList
                                    data={salesTypeList}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderSalesTypeItem}
                                />


                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setSalesTypeModalVisible(false)}
                                >
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal visible={showPicker} transparent animationType="slide">
                        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                            <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
                                <Text style={{ textAlign: "center", marginBottom: 10 }}>
                                    Select Delivery Date (future disabled)
                                </Text>
                                <FlatList
                                    data={days}
                                    numColumns={7}
                                    keyExtractor={(item) => item.toString()}
                                    renderItem={({ item }) => {
                                        const isFuture = item > today.getDate();
                                        return (
                                            <TouchableOpacity
                                                disabled={isFuture}
                                                onPress={() => onSelectDay(item)}
                                                style={{
                                                    padding: 10,
                                                    margin: 3,
                                                    backgroundColor: isFuture ? "#ccc" : "#eee",
                                                    borderRadius: 5,
                                                }}
                                            >
                                                <Text style={{ color: isFuture ? "gray" : "black" }}>{item}</Text>
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                                <TouchableOpacity onPress={() => setShowPicker(false)}>
                                    <Text style={{ textAlign: "center", marginTop: 10, color: "blue" }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                    <Modal visible={showPickerForSales} transparent animationType="slide">
                        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                            <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
                                <Text style={{ textAlign: "center", marginBottom: 10 }}>
                                    Select Sales Date (future disabled)
                                </Text>
                                <FlatList
                                    data={days}
                                    numColumns={7}
                                    keyExtractor={(item) => item.toString()}
                                    renderItem={({ item }) => {
                                        const isFuture = item > today.getDate();
                                        return (
                                            <TouchableOpacity
                                                disabled={isFuture}
                                                onPress={() => onSelectDayForSales(item)}
                                                style={{
                                                    padding: 10,
                                                    margin: 3,
                                                    backgroundColor: isFuture ? "#ccc" : "#eee",
                                                    borderRadius: 5,
                                                }}
                                            >
                                                <Text style={{ color: isFuture ? "gray" : "black" }}>{item}</Text>
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                                <TouchableOpacity onPress={() => setShowPicker(false)}>
                                    <Text style={{ textAlign: "center", marginTop: 10, color: "blue" }}>Cancel</Text>
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
        color: '#615d5dff',
        fontWeight: '400',
        width: '100%',
        height: '100%'


    },


    submitbox: {
        backgroundColor: '#000000ff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        height: 50,
        width: 200,
        margin: 20
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


    itemrow: {

        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    inputboxicon: {
        width: 20,
        height: 20,
        right: 20,

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





});

export default DeliveryupdateManage;