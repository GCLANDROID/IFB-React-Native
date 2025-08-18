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
    Platform,
    Alert,




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
            const android_id = 'I';
            const refreshedToken = 'ABCD1234'; // Replace with actual token retrieval logic
            const deviceID = 'device123'; // Replace with actual device ID retrieval logic
            const version = Platform.OS;

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
                   await AsyncStorage.setItem('SecurityCode',securityCode);
                   await AsyncStorage.setItem('Password', responseData.Password);
                   await AsyncStorage.setItem('ClientID', responseData.ClientID);
                navigation.replace('CSRDashbaord');
            } else {
                setLoading(false);
                showToast(res.data.responseText);
            }
        } catch (error) {
            setLoading(false);
            console.error('Login Error:', error);
            showToast('Something went wrong!');
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
        flex:1

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


});

export default LoginScreen;