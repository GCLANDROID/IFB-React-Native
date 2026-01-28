import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';

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
    Platform,
    Alert,
    Modal,




} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import API from '../../util/API';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '../../util/Loader';
import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;


const showToast = (msg) => {
    Alert.alert('Alert', msg);
};




const LoginScreen = () => {
    const navigation = useNavigation()
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        loadData();
    }, []);



    const loadData = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('MasterID');
            const storedPassword = await AsyncStorage.getItem('Password');
            const storedSecurityCode = await AsyncStorage.getItem('SecurityCode');

            setUserName(storedUserId || '');
            setPassword(storedPassword || '');
            setSecurityCode(storedSecurityCode || '');



        } catch (error) {
            console.error('Error loading login data:', error);
        }
    };

    const showToast = (msg) => {
        Alert.alert('Alert', msg);
    };

    const handleLogin = async () => {
        if (!userName.trim()) {
            showToast('Please enter User ID');
            return;
        }

        if (!password.trim()) {
            showToast('Please enter Password');
            return;
        }

        if (!securityCode.trim()) {
            showToast('Please enter Security Code');
            return;
        }

        try {
            //  const android_id = await DeviceInfo.getUniqueId();;
            //  const refreshedToken = await DeviceInfo.getUniqueId();; // Replace with actual token retrieval logic
            const deviceID = await DeviceInfo.getUniqueId();; // Replace with actual device ID retrieval logic
            const version = Platform.OS;
            const android_id = "e45ebb02c6800641";
            const refreshedToken = "e45ebb02c6800641";


            const base64Password = Buffer.from(password, 'utf-8').toString('base64');
            setLoading(true);

            const url = API.LOGIN_GCL(userName, base64Password, android_id, securityCode, refreshedToken, version);

            const res = await axios.get(url);
            console.log('Login Response:', res);

            if (res.data.responseStatus === true) {
                setLoading(false);
                const responseData = Array.isArray(res.data.responseData)
                    ? res.data.responseData[0]
                    : res.data.responseData;
                await AsyncStorage.setItem('UserName', responseData.UserName);
                await AsyncStorage.setItem('UserID', responseData.UserID);
                await AsyncStorage.setItem('LeaveURL', responseData.LeaveURL);
                await AsyncStorage.setItem('LeaveEncahURL', responseData.LeaveEncahURL);
                await AsyncStorage.setItem('SecurityCode', securityCode);
                await AsyncStorage.setItem('Password', responseData.Password);
                await AsyncStorage.setItem('ClientID', responseData.ClientID);
                await AsyncStorage.setItem('SalesPointID', responseData.SalesPointID);
                await AsyncStorage.setItem('UserTypeId', responseData.UserTypeId);
                await AsyncStorage.setItem('Notify_Remarks', responseData.Notify_Remarks);
                await AsyncStorage.setItem('Target', responseData.Target);
                await AsyncStorage.setItem('Pending', responseData.Pending);
                await AsyncStorage.setItem('MonthlyTarget', responseData.MonthlyTarget);
                await AsyncStorage.setItem('Sold', responseData.Sold);
                await AsyncStorage.setItem('Approved', responseData.Approved);
                await AsyncStorage.setItem('Rejected', responseData.Rejected);
                await AsyncStorage.setItem('BranchId', responseData.BranchId);
                await AsyncStorage.setItem('SalesPartyCode', responseData.SalesPartyCode);
                await AsyncStorage.setItem('Code', responseData.Code);
                await AsyncStorage.setItem('MINCheckinhrs', String(responseData.MINCheckinhrs ?? ''));
                await AsyncStorage.setItem('MINCheckinmin', String(responseData.MINCheckinmin ?? ''));
                await AsyncStorage.setItem('MINCheckouthrs', String(responseData.MINCheckouthrs ?? ''));
                await AsyncStorage.setItem('MINCheckoutmin', String(responseData.MINCheckoutmin ?? ''));
                await AsyncStorage.setItem('MasterID', userName);        // entered UserID
                await AsyncStorage.setItem('Password', password);      // entered Password
                // entered Security Code


                if (responseData.UserTypeId === "IFBMM1000011") {
                    navigation.replace("CSRDashbaord");
                } else {
                    navigation.replace("AttendanceDashboard");
                }
            } else {
                setLoading(false);
                const responseData = Array.isArray(res.data.responseData)
                    ? res.data.responseData[0]
                    : res.data.responseData;
                if (responseData?.ErrorCode === '3') {

                    setShowDeviceModal(true);
                    return;
                } else {
                    showToast(responseData.Msg);
                }

            }
        } catch (error) {
            setLoading(false);
            console.error('Login Error:', error);
            showToast('Something went wrong!');
        }
    };


    const handleSendRequest = async () => {
        if (!selectedReason) {
            Alert.alert('Alert', 'Please select a reason');
            return;
        }

        if (!remarks.trim()) {
            Alert.alert('Alert', 'Please enter remarks');
            return;
        }

        try {
            setLoading(true);

            const imei = await DeviceInfo.getUniqueId();

            const formData = new FormData();
            formData.append('Code', userName);
            formData.append('IMEI', imei);
            formData.append('Reason', selectedReason);
            formData.append('Remarks', remarks);
            formData.append('SecurityCode', securityCode);

            const response = await axios.post(
                API.DEVICE_CHANGE_REQUEST,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setLoading(false);

            if (response.data?.responseStatus === true) {
                Alert.alert('Success', response.data.responseText, [
                    {
                        text: 'OK',
                        onPress: () => {
                            setShowDeviceModal(false); // close modal
                            setSelectedReason('');
                            setRemarks('');
                        },
                    },
                ]);
            } else {
                Alert.alert('Alert', response.data?.responseText || 'Request failed');
            }

        } catch (error) {
            setLoading(false);
            console.error('Send Request Error:', error);
            Alert.alert('Error', 'Something went wrong while sending request');
        }
    };





    return (
        <SafeAreaProvider >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView style={{ flex: 1, padding: 10, marginTop: 80 }}>
                        {loading && <Loader />}

                        <Text style={styles.welcomeText}>Welcome Back!</Text>
                        <Image source={require('../../asset/login-icon.png')} style={styles.loginImage} />
                        <Text style={styles.loginText}>Login to Continue</Text>
                        <View style={styles.inputTextBG}>
                            <View style={[styles.iconBG, { backgroundColor: '#09053dff' }]}>
                                <Image source={require('../../asset/id-card.png')} style={styles.icon} />
                            </View>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Enter User ID'
                                placeholderTextColor={'#665c5cff'}
                                value={userName}
                                onChangeText={setUserName}
                            ></TextInput>
                        </View>

                        <View style={styles.inputTextBG}>
                            <View style={[styles.iconBG, { backgroundColor: '#04523eff' }]}>
                                <Image source={require('../../asset/password-icon.png')} style={styles.icon} />
                            </View>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Enter Password'
                                placeholderTextColor={'#665c5cff'}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}></TextInput>
                        </View>
                        <View style={styles.inputTextBG}>
                            <View style={[styles.iconBG, { backgroundColor: '#861308ff' }]}>
                                <Image source={require('../../asset/key.png')} style={styles.icon} />
                            </View>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Enter Security Code'
                                placeholderTextColor={'#665c5cff'}
                                value={securityCode}
                                onChangeText={setSecurityCode}></TextInput>
                        </View>
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Login</Text>
                            <Image source={require('../../asset/send.png')} style={[styles.icon, { marginLeft: 10 }]}></Image>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>


                <Modal
                    visible={showDeviceModal}
                    transparent
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>

                            {/* Close button */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowDeviceModal(false)}
                            >
                                <Text style={styles.closeText}>X</Text>
                            </TouchableOpacity>

                            <Text style={styles.errorText}>
                                Access denied. Device ID does not match the registered device.
                                Please send a request to change your device.
                            </Text>

                            <Text style={styles.label}>Login ID :</Text>
                            <TextInput style={styles.modalInput} value={userName} editable={false} />

                            <Text style={styles.label}>Security Code :</Text>
                            <TextInput style={styles.modalInput} value={securityCode} editable={false} />

                            <Text style={styles.label}>Choose Reason for Change :</Text>
                            <TouchableOpacity
                                style={styles.dropdown}
                                onPress={() => setShowReasonModal(true)}
                            >
                                <Text style={{ color: selectedReason ? '#000' : '#999' }}>
                                    {selectedReason || 'Please Select'}
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.label}>Remarks :</Text>
                            <TextInput
                                style={[styles.modalInput, { height: 80 }]}
                                placeholder="Enter Remarks"
                                multiline
                                value={remarks}
                                onChangeText={setRemarks}
                            />

                            <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
                                <Text style={styles.sendButtonText}>SEND REQUEST</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showReasonModal}
                    transparent
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.reasonModal}>

                            <Text style={styles.reasonTitle}>Choose Reason</Text>

                            <TouchableOpacity
                                style={styles.reasonItem}
                                onPress={() => {
                                    setSelectedReason('My mobile phone was lost');
                                    setRemarks('My mobile phone was lost');
                                    setShowReasonModal(false);
                                }}
                            >
                                <Text>My mobile phone was lost</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.reasonItem}
                                onPress={() => {
                                    setSelectedReason('I have changed my mobile phone');
                                    setRemarks('I have changed my mobile phone');
                                    setShowReasonModal(false);
                                }}
                            >
                                <Text>I have changed my mobile phone</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.reasonItem}
                                onPress={() => {
                                    setSelectedReason('Others');
                                    setShowReasonModal(false);
                                    setRemarks('Others');
                                }}
                            >
                                <Text>Others</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setShowReasonModal(false)}
                            >
                                <Text style={{ color: 'red' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>



            </SafeAreaView>
        </SafeAreaProvider>

    );
};

const styles = StyleSheet.create({

    loginImage: {
        height: 300,
        width: 300,
        alignSelf: 'center'

    },
    icon: {
        height: 30,
        width: 30,
        alignSelf: 'center'

    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#b80505ff'
    },
    loginText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#665c5cff',
        alignSelf: 'center'
    },
    inputTextBG: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#665c5cff',
        height: 50,
        marginVertical: 10,
        flexDirection: 'row',



    },
    inputText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#000000ff',
        flex: 1

    },
    iconBG: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        height: 50,
        width: 50,
        justifyContent: 'center'



    },

    loginButton: {
        borderRadius: 4,
        backgroundColor: '#000000',
        height: 50,
        marginTop: 20,
        width: 250,
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40
    },

    loginButtonText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#FFFFFF',

    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },

    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: 'red',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    closeText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
        marginTop: 30,
    },

    label: {
        fontSize: 14,
        marginTop: 10,
    },

    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginTop: 5,
    },

    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        marginTop: 5,
    },

    sendButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },

    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    reasonModal: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },

    reasonTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },

    reasonItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    cancelBtn: {
        marginTop: 15,
        alignItems: 'center',
    },


});

export default LoginScreen;