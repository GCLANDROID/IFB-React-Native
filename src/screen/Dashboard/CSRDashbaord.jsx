import { useNavigation } from '@react-navigation/native';
import React from 'react';
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

const screenWidth = Dimensions.get("window").width;

const CSRDashbaord = () => {
    const navigation = useNavigation();

    // Pie chart data
    const chartData = [
        { name: "Target", population: 30, color: "#3b82f6", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Sold", population: 20, color: "#22c55e", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Approved", population: 10, color: "#facc15", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Pending", population: 10, color: "#f97316", legendFontColor: "#7F7F7F", legendFontSize: 12 },
        { name: "Rejected", population: 5, color: "#ef4444", legendFontColor: "#7F7F7F", legendFontSize: 12 }
    ];

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

                        <ScrollView style={{ flex: 1 }}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Image source={require('../../asset/user.png')} style={styles.userIcon} />
                                <Text style={styles.nameText}>SURINDAR SINGH CHOUHAN</Text>
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
                                        <Text style={styles.cardValue}>0</Text>
                                    </View>

                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.card]}>
                                    <Image source={require('../../asset/ticketpending-icon.png')} style={styles.iconimage} />
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
                                        <Text style={styles.cardTitle}>Ticket Generated</Text>
                                        <Text style={styles.cardValue}>20</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.card]}>
                                    <Image source={require('../../asset/delievrypending-icon.png')} style={styles.iconimage} />
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
                                        <Text style={styles.cardTitle}>Delivery Pending</Text>
                                        <Text style={styles.cardValue}>30</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.informationrow}>
                                <Text style={styles.informationtitle}>Information</Text>
                                <Text style={styles.informationvalue}>Attendance will be taken from one mobile device only</Text>
                            </View>

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
                                <TouchableOpacity style={styles.bottomBtn}>
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
        paddingVertical:10,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',
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
    gifimage:{
         width: 100,
        height: 100,
    }
});

export default CSRDashbaord;
