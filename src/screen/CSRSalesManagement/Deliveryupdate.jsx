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




} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Deliveryupdate = () => {


    const deliveries = [
        {
            id: "1",
            date: "01 Aug 2025",
            reference: "IFB000089",
            customer: "Dipjyoti Das",
            product: "Air Conditioner",
        },
        {
            id: "2",
            date: "01 Aug 2025",
            reference: "IFB000090",
            customer: "John Smith",
            product: "Washing Machine",
        },
         {
            id: "3",
            date: "03 Aug 2025",
            reference: "IFB000190",
            customer: "Aeo Smith",
            product: "Washing Machine - FL",
        },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={{ flex: 1, flexDirection: 'row',alignItems:'center' }}>
                    <View style={styles.itemRowiconbg}>
                        <Image source={require('../../asset/date-icon.png')} style={styles.itemrowicon} />
                    </View>
                    <Text style={styles.label}>Date</Text>
                </View>

                <Text style={styles.value}>{item.date}</Text>
            </View>
            <View style={styles.row}>
                <View style={{ flex: 1, flexDirection: 'row',alignItems:'center' }}>
                    <View style={styles.itemRowiconbg}>
                        <Image source={require('../../asset/reference-icon.png')} style={styles.itemrowicon} />
                    </View>
                    <Text style={styles.label}>Reference Number</Text>
                </View>
                
                <Text style={styles.value}>{item.reference}</Text>
            </View>
            <View style={styles.row}>
                <View style={{ flex: 1, flexDirection: 'row',alignItems:'center' }}>
                    <View style={styles.itemRowiconbg}>
                        <Image source={require('../../asset/cutomer-icon.png')} style={styles.itemrowicon} />
                    </View>
                    <Text style={styles.label}>Customer Name</Text>
                </View>
                
                <Text style={styles.value}>{item.customer}</Text>
            </View>
            <View style={styles.row}>
                <View style={{ flex: 1, flexDirection: 'row',alignItems:'center' }}>
                    <View style={styles.itemRowiconbg}>
                        <Image source={require('../../asset/product-icon.png')} style={styles.itemrowicon} />
                    </View>
                    <Text style={styles.label}>Product</Text>
                </View>
                
                <Text style={styles.value}>{item.product}</Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.updateBtn}>
                    <Text style={styles.updateText}>Update Delivery Address</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Cancel Sale</Text>
                </TouchableOpacity>
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
                            <View style={{ flex: 1 }}>
                                <View style={{ backgroundColor: '#D9D9D954', padding: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1, alignContent: 'center' }}>
                                            <Text style={styles.titleText}>
                                                Finanacial Year *
                                            </Text>
                                            <TouchableOpacity style={styles.inputBox}>
                                                <Text style={styles.inputValue}>Please Select</Text>
                                                <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 1, alignContent: 'center', marginLeft: 10 }}>
                                            <Text style={styles.titleText}>
                                                Month *
                                            </Text>
                                            <TouchableOpacity style={styles.inputBox}>
                                                <Text style={styles.inputValue}>Please Select</Text>
                                                <Image source={require('../../asset/dropdown-icon.png')} style={styles.inputboxicon} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.submitbox}>
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
        justifyContent:'center'
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

    }





});

export default Deliveryupdate;