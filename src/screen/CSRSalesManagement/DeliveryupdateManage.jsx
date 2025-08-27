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
import { useRoute } from '@react-navigation/native';


const DeliveryupdateManage = () => {

    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const { CategoryID } = route.params || {};
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




    const yesNoOptions = [
        { ID: 'N', Value: 'No' },
        { ID: 'Y', Value: 'Yes' }
    ];

    useEffect(() => {
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
        setSelectedArea(item.Value);

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
                                    <TouchableOpacity style={styles.inputBox} >
                                        <Text style={styles.inputValue}>MM/DD/YYYY</Text>
                                        <Image source={require('../../asset/date.png')} style={styles.inputboxicon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Sales date
                                    </Text>
                                    <TouchableOpacity style={styles.inputBox} >
                                        <Text style={styles.inputValue}>MM/DD/YYYY</Text>
                                        <Image source={require('../../asset/date.png')} style={styles.inputboxicon} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.itemrow}>
                                    <Text style={styles.titleText}>
                                        Remarks
                                    </Text>
                                    <TouchableOpacity style={[styles.inputBox, { height: 100, alignItems: 'flex-start', paddingTop: 10 }]} >
                                        <TextInput
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
                                        <TouchableOpacity style={styles.inputBox} >
                                            <Text style={styles.inputValue}>Please Select</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {CategoryID === "IFBPC1000040" && (
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            With Pedestal Sales
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox} >
                                            <Text style={styles.inputValue}>Please Select</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <View style={styles.itemrow}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                                        <Text style={styles.titleText}>
                                            Serial / AC IDU Number
                                        </Text>
                                        <TouchableOpacity >
                                            <Image source={require('../../asset/scanner.png')} style={{ height: 25, width: 25, right: 20 }} />
                                        </TouchableOpacity>

                                    </View>

                                    <TouchableOpacity style={[styles.inputBox]} >
                                        <TextInput

                                            style={styles.inputValue}
                                            placeholderTextColor={'#564F4F'}
                                        />
                                    </TouchableOpacity>


                                </View>

                                <View style={styles.itemrow}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                                        <Text style={styles.titleText}>
                                            Invoice Image
                                        </Text>
                                        <TouchableOpacity >
                                            <Image source={require('../../asset/camera-icon.png')} style={{ height: 25, width: 25, right: 20 }} />
                                        </TouchableOpacity>

                                    </View>

                                    <View style={[styles.inputBox]} >
                                        <Image source={require('../../asset/gallery-icon.png')} style={{ height: 50, width: 50 }} />
                                    </View>

                                </View>
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