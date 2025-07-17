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


const Dashboard = () => {
    const navigation = useNavigation()






    return (
        <SafeAreaProvider >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#c70032ff', }}>

                <View style={{ flex: 1, marginTop: 80 }}>
                    <View style={{ flex: 1, alignContent: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <Image source={require('../../asset/user.png')} style={styles.userICon}></Image>
                        <Text style={styles.nameText}>Surindar Sing Chouhan</Text>
                    </View>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.card}>
                            <Image source={require('../../asset/calendar.png')} style={styles.menuICon}></Image>
                            <Text style={styles.menuTextText}>Attendance</Text>
                        </TouchableOpacity>
                    </View>



                </View>







            </SafeAreaView>
        </SafeAreaProvider>

    );
};

const styles = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 4,
        backgroundColor: '#FFFFFF'
    },
    userICon: {
        width: 65,
        width: 65
    },
    nameText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 500,
        textAlign: 'center',
        marginTop: 20,
        marginLeft: 20
    },
    menuTextText: {
        fontSize: 18,
        color: '#a77878ff',
        fontWeight: 400,
        textAlign: 'center',
        marginTop: 20,
       
    },
    menuICon: {
        width: 70,
        width: 70
    },
    card: {
        height: 150,
        width: 150,
        backgroundColor: "#fff",
        borderRadius: 8,
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
        justifyContent:'center',
        alignItems:'center'
    },




});

export default Dashboard;