import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    Platform,
    StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const attendanceData = [
    { date: '01', day: 'Tue', punchIn: '9.24 AM', punchOut: '6.25 PM', status: 'P' },
    { date: '02', day: 'Thu', punchIn: '9.24 AM', punchOut: '6.25 PM', status: 'P' },
    { date: '03', day: 'Fri', punchIn: '9.24 AM', punchOut: '6.25 PM', status: 'P' },
    { date: '04', day: 'Sat', punchIn: '9.24 AM', punchOut: '6.25 PM', status: 'P' },
     { date: '05', day: 'Sat', punchIn: '9.24 AM', punchOut: '6.25 PM', status: 'P' },
      { date: '06', day: 'Sat', punchIn: '9.24 AM', punchOut: '6.25 PM', status: 'P' },
      { date: '07', day: 'Sat', punchIn: '9.24 AM', punchOut: '6.25 PM', status: 'P' },
      { date: '08', day: 'Sat', punchIn: '9.24 AM', punchOut: '6.25 PM', status: 'P' },
];

const AttendanceReport = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const scrollRef = useRef();
    const navigation=useNavigation();

    useEffect(() => {
        const index = months.indexOf(selectedMonth);
        if (index !== -1 && scrollRef.current) {
            scrollRef.current.scrollTo({
                x: index * 80 - width / 2 + 40,
                animated: true,
            });
        }
    }, [selectedMonth]);

    const renderMonthTabs = () => (
        <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthTabs}
        >
            {months.map((month, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.monthButton}
                    onPress={() => setSelectedMonth(month)}
                >
                    <Text style={[styles.monthText, month === selectedMonth && styles.selectedMonthText]}>
                        {month}
                    </Text>
                    {month === selectedMonth && <View style={styles.underline} />}
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderAttendanceCard = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.dateContainer}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.day}>{item.day}</Text>
            </View>
            <View style={styles.detailsContainer}>

                <View style={styles.row}>
                    <Text style={styles.label}>Punch In</Text>
                    <Text style={styles.value}>{item.punchIn}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Punch Out</Text>
                    <Text style={styles.value}>{item.punchOut}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={[styles.value, { color: '#D63333' }]}>{item.status}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1,backgroundColor:'#FF0020'}}>
                 <View style={{ flex: 1, backgroundColor: '#FF0020', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
                     <StatusBar backgroundColor="#FF0020" barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                     <Image source={require('../../asset/back-icon.png')} style={styles.headerIcon}></Image>
                </TouchableOpacity>
                <TouchableOpacity>
                     <Image source={require('../../asset/home-icon.png')} style={styles.headerIcon}></Image>
                </TouchableOpacity>
               
            </View>
                <View style={styles.container}>
                    {renderMonthTabs()}
                    <FlatList
                        data={attendanceData}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.listContainer}
                        renderItem={renderAttendanceCard}
                    />
                </View>
            </View>
            </SafeAreaView>
           
        </SafeAreaProvider>


    );
};

export default AttendanceReport;

// =====================
// 💅 STYLES
// =====================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor:'#FF0020',
        height: 60,
    },
    headerIcon: {
        width: 24,  
        height: 24,
        tintColor:'#FFFFFF'
    },
    monthTabs: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 0,
        paddingBottom: 0,

    },
    monthButton: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    monthText: {
        fontSize: 18,
        color: '#888',
    },
    selectedMonthText: {
        color: '#D63333',
        fontWeight: '600',
    },
    underline: {
        height: 2,
        backgroundColor: '#D63333',
        width: 20,
        marginTop: 2,
        borderRadius: 1,
    },
    listContainer: {
        paddingTop: 0,
        paddingBottom: 5,
        marginTop: 0,

    },
    card: {
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        marginHorizontal: 15,
        marginVertical: 10,
        padding: 15,
        flexDirection: 'row',
        elevation: 2,
    },
    dateContainer: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 10,
        elevation: 2,
    },
    date: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    day: {
        fontSize: 12,
        color: '#D63333',
    },
    detailsContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
    },
    row: {

        justifyContent: 'space-between',
        marginVertical: 2,
    },
    label: {
        color: '#888',
        fontSize: 13,
    },
    value: {
        fontSize: 13,
        fontWeight: '500',
        color: '#000',
    },
});