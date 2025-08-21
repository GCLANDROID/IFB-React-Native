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




} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SalesEntry = () => {







    return (
        <SafeAreaProvider >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FF0020' }}>
                <ImageBackground
                    source={require('../../asset/form-bg.png')} // your top background image
                    style={styles.topImage}
                    resizeMode="cover"
                >
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
                                        <TouchableOpacity style={styles.inputBox}>
                                            <Text style={styles.inputValue}>Please Select</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Model *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox}>
                                            <Text style={styles.inputValue}>Please Select</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Title *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox}>
                                            <Text style={styles.inputValue}>Please Select</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            First Name *
                                        </Text>
                                        <TouchableOpacity style={[styles.inputBox]}>
                                            <TextInput placeholder='Enter First Name' style={styles.inputValue} placeholderTextColor={'#564F4F'} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Last Name *
                                        </Text>
                                        <TouchableOpacity style={[styles.inputBox]}>
                                            <TextInput placeholder='Enter Last Name' style={styles.inputValue} placeholderTextColor={'#564F4F'} />
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
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Under Exchange *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox}>
                                            <Text style={styles.inputValue}>Please Select</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Under Finance Scheme *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox}>
                                            <Text style={styles.inputValue}>Please Select</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.itemrow}>
                                        <Text style={styles.titleText}>
                                            Select Finance Scheme *
                                        </Text>
                                        <TouchableOpacity style={styles.inputBox}>
                                            <Text style={styles.inputValue}>Please Select</Text>
                                            <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={styles.submitbox}>
                                        <Text style={styles.submitText}>
                                            Submit
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
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
        backgroundColor:'#FFFFFF'


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





});

export default SalesEntry;