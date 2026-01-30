import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ImageBackground,
    StatusBar
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../util/API';
import axios from 'axios';
import { Loader } from '../../util/Loader';

const screenWidth = Dimensions.get("window").width;

const CSRDashbaord = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [notification, setNotification] = useState('');
    const [notificationTitle, setNotificationTitle] = useState('');
    const [target, setTarget] = useState(0);
    const [sold, setSold] = useState(0);
    const [approved, setApproved] = useState(0);
    const [pending, setPending] = useState(0);
    const [rejected, setRejected] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalSales, setTotalSales] = useState('');
    const [deliveryPending, setDeliveryPending] = useState('');
    const [ticketGenerated, setTicketGenerated] = useState('');
    const [shiftOverTime, setShiftOverTime] = useState('');
    const [checkTime, setCheckTime] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem('UserName');
                const storedUserID = await AsyncStorage.getItem('UserID');
                const notification = await AsyncStorage.getItem('Notify_Remarks');
                const Target = await AsyncStorage.getItem('MonthlyTarget');
                const Sold = await AsyncStorage.getItem('Sold');
                const Approved = await AsyncStorage.getItem('Approved');
                const Pending = await AsyncStorage.getItem('Pending');
                const Rejected = await AsyncStorage.getItem('Rejected');

                setUserName(storedUserName || '');
                setNotification(notification || '');
                setTarget(parseInt(Target) || 0);
                setSold(parseInt(Sold) || 0);
                setApproved(parseInt(Approved) || 0);
                setPending(parseInt(Pending) || 0);
                setRejected(parseInt(Rejected) || 0);
                // setUserID(storedUserID || '');

            } catch (error) {
                console.error('Error loading stored data:', error);
            }
        };

        loadData();
        fetchTodayAttendance();
        fetchReport();
        fetchNotification();

    }, []);

    // Pie chart data
    const chartData = [
        { name: "Target", population: target, color: "#3b82f6", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Sold", population: sold, color: "#22c55e", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Approved", population: approved, color: "#068d4aff", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Pending", population: pending, color: "#b7ff0ef8", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Rejected", population: rejected, color: "#ef4444", legendFontColor: "#7F7F7F", legendFontSize: 12 }
    ];


    const fetchNotification = async () => {

        setLoading(true);
        try {
            const storedLoginID = await AsyncStorage.getItem('UserID');
            const securityCode = await AsyncStorage.getItem('SecurityCode');


            const response = await axios.get(API.FETCH_NOTIFICATION(
                storedLoginID,
                securityCode,
                1,

            ));

            if (response.data.responseStatus === true) {
                setLoading(false);
                const responseData = Array.isArray(response.data.responseData)
                    ? response.data.responseData[0]
                    : response.data.responseData;
                const notification = responseData.Remarks || '';
                const notificationTitle = responseData.HeaderTitle || '';
                setNotification(notification);
                setNotificationTitle(notificationTitle);

            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };



    const getFinancialYear = () => {
        const today = new Date();
        const month = today.getMonth(); // 0 = Jan, 1 = Feb, ... 11 = Dec
        const year = today.getFullYear();

        if (month <= 2) {
            // Jan (0), Feb (1), Mar (2)
            return `${year - 1}-${year}`;
        } else {
            // Apr (3) onwards
            return `${year}-${year + 1}`;
        }
    };


    const fetchReport = async () => {
        const fy = getFinancialYear();
        console.log('FinancialYear', fy);
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        console.log('Currentmonth', currentMonth);
        setLoading(true);
        try {
            const storedLoginID = await AsyncStorage.getItem('UserID');
            console.log('UserID', storedLoginID);
            const securityCode = await AsyncStorage.getItem('SecurityCode');
            const url = API.FETCH_DASHBOARD_REPORT(
                0,
                storedLoginID,
                fy,
                currentMonth,
                1,
                3,
                securityCode
            );
            console.log('URL', url);

            const response = await axios.get(API.FETCH_DASHBOARD_REPORT(
                0,
                storedLoginID,
                fy,
                currentMonth,
                1,
                3,
                securityCode

            ));

            console.log('Dashboard Report Response:', response);


            if (response.data.responseStatus === true) {
                setLoading(false);
                const responseData = Array.isArray(response.data.responseData)
                    ? response.data.responseData[0]
                    : response.data.responseData;
                const Total_Sales = responseData.Total_Sales || '';
                const Delivery_Pending = responseData.Delivery_Pending || '';
                const Ticket_Generated = responseData.Ticket_Generated || '';
                setTotalSales(Total_Sales);
                setDeliveryPending(Delivery_Pending);
                setTicketGenerated(Ticket_Generated);


            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTodayAttendance = async () => {
        try {
            setLoading(true);
            const loginID = await AsyncStorage.getItem('UserID');
            const securityCode = await AsyncStorage.getItem('SecurityCode');

            const response = await axios.get(API.FETCH_LOGINTIME(
                loginID,
                securityCode

            ));
            console.log('TIME API response:', response);



            if (response.data?.responseStatus === true) {
                const data = Array.isArray(response.data.responseData)
                    ? response.data.responseData[0]
                    : response.data.responseData;

                const checkInTime = data?.Time;

                console.log('Check-in Time:', checkInTime); // debug

                if (checkInTime) {
                    setCheckTime(checkInTime);
                    const overtime = calculateShiftOverTime(checkInTime);
                    console.log('Shift Over Time:', overtime); // debug
                    setShiftOverTime(overtime);
                    await AsyncStorage.setItem('checkInTime', checkInTime);
                    await AsyncStorage.setItem('overTime', overtime);
                }else{
                    await AsyncStorage.setItem('checkInTime', "");
                    await AsyncStorage.setItem('overTime', "");
                }
            }


        } catch (err) {
            console.log('Attendance API error:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateShiftOverTime = (timeStr) => {
        try {
            if (!timeStr) return '';

            // Supports "10:15" or "10:15:00"
            const parts = timeStr.split(':');
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);

            if (isNaN(hours) || isNaN(minutes)) return '';

            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(0);

            // Add 9 hours shift
            date.setHours(date.getHours() + 9);

            // Format nicely (07:15 PM)
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch (e) {
            console.log('Time parse error:', e);
            return '';
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FF003E' }}>
                <View style={{ flex: 1, backgroundColor: '#FF0020', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
                    <StatusBar backgroundColor="#FF0020" barStyle="dark-content" />
                    <ImageBackground
                        source={require('../../asset/dashboard-bg.jpg')} // your top background image
                        style={styles.topImage}
                        resizeMode="cover"
                    >
                        {loading && <Loader />}

                        <ScrollView style={{ flex: 1 }}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Image source={require('../../asset/user.png')} style={styles.userIcon} />
                                <Text style={styles.nameText}>Hi! {userName}</Text>
                            </View>

                            {/* Pie Chart */}
                            <View style={styles.chartContainer}>
                                <PieChart
                                    data={chartData}
                                    width={screenWidth - 30}
                                    height={200}
                                    chartConfig={{
                                        backgroundColor: "#fff",
                                        backgroundGradientFrom: "#fff",
                                        backgroundGradientTo: "#fff",
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                                    }}
                                    accessor={"population"}
                                    backgroundColor={"transparent"}
                                    paddingLeft={"10"}
                                    absolute
                                />
                            </View>

                            {/* Cards Section */}
                            <View style={styles.cardsRow}>
                                <TouchableOpacity style={[styles.card]}>
                                    <Image source={require('../../asset/totalsales-icon.png')} style={styles.iconimage} />
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
                                        <Text style={styles.cardTitle}>Total Sales</Text>
                                        <Text style={styles.cardValue}>{totalSales}</Text>
                                    </View>

                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.card]}>
                                    <Image source={require('../../asset/ticketpending-icon.png')} style={styles.iconimage} />
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
                                        <Text style={styles.cardTitle}>Ticket Generated</Text>
                                        <Text style={styles.cardValue}>{ticketGenerated}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.card]}>
                                    <Image source={require('../../asset/delievrypending-icon.png')} style={styles.iconimage} />
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
                                        <Text style={styles.cardTitle}>Delivery Pending</Text>
                                        <Text style={styles.cardValue}>{deliveryPending}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.attninformationrow, { backgroundColor: '#ee8626e0' }]}>
                                <Text style={styles.attendanceTime}>Dear Team, Kindly ensure that sales are punched on the same day of sale. Any delay in punching might impact incentive eligibility. Happy Selling!</Text>

                            </View>

                            <View style={styles.informationrow}>
                                <Text style={styles.informationtitle}>{notificationTitle}</Text>
                                <Text style={styles.informationvalue}>{notification}</Text>
                            </View>
                            {checkTime ? (

                            <View style={[styles.attninformationrow, { backgroundColor: '#cbff0fe0' }]}>
                                <Text style={styles.attendanceTimeTitle}>Your stipulated shift duration is calculated as per the applicable working hours policy. Please ensure adherence to the defined shift timings in line with organisational guidelines</Text>
                                <Text style={styles.attendanceTime}>Check In time: {checkTime} | Shiftover Time: {shiftOverTime}</Text>

                            </View>
                            ) : null}

                            {/* Bottom Buttons */}
                            <View style={styles.bottomRow}>
                                <TouchableOpacity
                                    style={styles.bottomBtn}
                                    onPress={() => navigation.navigate('SalesDashboard')}>
                                    <Image source={require('../../asset/sales-enablement.gif')} style={styles.gifimage} />
                                    <Text style={styles.bottomText}>Sales Management</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.bottomBtn}
                                    onPress={() => navigation.navigate('CSRAttendanceDashboard')}>
                                    <Image source={require('../../asset/attendance.gif')} style={styles.gifimage} />
                                    <Text style={styles.bottomText}>Attendance</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.bottomRow}>
                                <TouchableOpacity style={styles.bottomBtn}  onPress={() => navigation.navigate('IFBPlanoScreen')}>
                                    <Image source={require('../../asset/qr-code.gif')} style={styles.gifimage} />
                                    <Text style={styles.bottomText}>Planogram Hygiene</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.bottomBtn}
                                >
                                    <Image source={require('../../asset/more.gif')} style={styles.gifimage} />
                                    <Text style={styles.bottomText}>View More</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.bottomRow}>
                                <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation.replace('LoginScreen')}>
                                    <Image source={require('../../asset/logout.gif')} style={styles.gifimage} />
                                    <Text style={styles.bottomText}>Logout</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{ height: 50 }} /> {/* Spacer at the bottom */}

                        </ScrollView>


                    </ImageBackground>
                </View>


            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    userIcon: {
        width: 60,
        height: 60
    },
    nameText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 15
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    cardsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    },
    card: {
        width: 110,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        elevation: 5
    },
    cardTitle: {
        fontSize: 12,
        color: '#444',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    cardValue: {
        fontSize: 16,
        marginLeft: 2,
        color: '#c70032'
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    bottomBtn: {
        width: 180,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        elevation: 5
    },
    bottomText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#c70032'
    },
    topImage: {
        height: '100%',
        width: '100%',

    },
    iconimage: {
        width: 30,
        height: 30,

    },
    informationrow: {
        backgroundColor: '#FF002021',
        alignItems: 'center',
        paddingVertical: 10,
        marginVertical: 20

    },
    informationtitle: {
        fontSize: 18,
        color: '#FF0020',
        fontWeight: '700',
        textAlign: 'center',
    },
    informationvalue: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '400',
        textAlign: 'center',
    },
    gifimage: {
        width: 100,
        height: 100,
    },
    attendanceTimeTitle: {
        fontSize: 12,
        color: '#000000',
        fontWeight: '400',
        textAlign: 'center',
    },
    attendanceTime: {
        fontSize: 14,
        color: '#0e0101',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 5
    },
    attninformationrow: {

        alignItems: 'center',
        paddingVertical: 10,
        marginVertical: 5

    },
});

export default CSRDashbaord;
