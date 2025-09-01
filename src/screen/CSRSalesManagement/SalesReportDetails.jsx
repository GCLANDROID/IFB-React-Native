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
    const {subOperation} =route.params || {};






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
        // e.g. "August"
    }, []);


    console.log("Current Financial Year:", currentFY);
    console.log('Suboperation',subOperation);








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



});

export default SalesReportDetails;