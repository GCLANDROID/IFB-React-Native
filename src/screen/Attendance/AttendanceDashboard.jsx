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




} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const AttendanceDashboard = () => {
    const navigation = useNavigation()






    return (
        <SafeAreaProvider >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#E8151582' }}>

                <ImageBackground
                    source={require('../../asset/ifb-bg.jpg')} // your top background image
                    style={styles.topImage}
                    resizeMode="cover"
                >
                    <ScrollView style={{ flex: 1 }}>
                     
                        <View style={{ flex: 1, justifyContent: 'center', padding: 20,alignContent:'center',marginTop:110 }}>
                            <View style={{ flexDirection: 'row',alignSelf:'center' }}>
                                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AttendanceManage')}>
                                    <Image source={require('../../asset/attendance-punch.png')} style={styles.menuICon}></Image>
                                    <Text style={styles.menuTextText}> Attendance{'\n'}Manage</Text>
                                </TouchableOpacity>
                                 <TouchableOpacity style={styles.card} >
                                    <Image source={require('../../asset/attendance-report.png')} style={styles.menuICon}></Image>
                                    <Text style={styles.menuTextText}>Attendance{'\n'}Report</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row',alignSelf:'center',marginTop:20 }}>
                                <TouchableOpacity style={styles.card} >
                                    <Image source={require('../../asset/leave-enchasment.png')} style={styles.menuICon}></Image>
                                    <Text style={styles.menuTextText}>Leave{'\n'}Encashment</Text>
                                </TouchableOpacity>
                                 <TouchableOpacity style={styles.card} >
                                    <Image source={require('../../asset/leave-application.png')} style={styles.menuICon}></Image>
                                    <Text style={styles.menuTextText}>Leave{'\n'}Application</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>


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
        marginTop: 20,

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
        height: 25,
        width: 25
    }





});

export default AttendanceDashboard;