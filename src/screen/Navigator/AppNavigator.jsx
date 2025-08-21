import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from '../Common/WelcomeScreen';
import LoginScreen from '../Common/LoginScreen';
import AttendanceDashboard from '../Attendance/AttendanceDashboard';
import AttendanceManage from '../Attendance/AttendanceManage';
import AttendanceReport from '../Attendance/AttendanceReport';
import WebView from '../Common/WebViewScreen';
import WebViewScreen from '../Common/WebViewScreen';
import Dashboard from '../Dashboard/Dashboard';
import CSRDashbaord from '../Dashboard/CSRDashbaord';
import SalesDashboard from '../CSRSalesManagement/SalesDashboard';
import CSRAttendanceDashboard from '../Attendance/CSRAttendanceDashboard';
import SalesEntry from '../CSRSalesManagement/SalesEntry';
import Deliveryupdate from '../CSRSalesManagement/Deliveryupdate';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (
    <SafeAreaProvider >

      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="WelcomeScreen">
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="AttendanceDashboard" component={AttendanceDashboard} />
        <Stack.Screen name="AttendanceManage" component={AttendanceManage} />
        <Stack.Screen name="AttendanceReport" component={AttendanceReport} />
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
        <Stack.Screen name="CSRDashbaord" component={CSRDashbaord} />
        <Stack.Screen name="SalesDashboard" component={SalesDashboard} />
        <Stack.Screen name="CSRAttendanceDashboard" component={CSRAttendanceDashboard} />
        <Stack.Screen name="SalesEntry" component={SalesEntry} />
        <Stack.Screen name="Deliveryupdate" component={Deliveryupdate} />
      </Stack.Navigator>

    </SafeAreaProvider>


  );
};

export default AppNavigator;