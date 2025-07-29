import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from '../Common/WelcomeScreen';
import LoginScreen from '../Common/LoginScreen';
import Dashboard from '../Common/Dashboard';
import AttendanceDashboard from '../Attendance/AttendanceDashboard';
import AttendanceManage from '../Attendance/AttendanceManage';
import AttendanceReport from '../Attendance/AttendanceReport';
import WebView from '../Common/WebViewScreen';
import WebViewScreen from '../Common/WebViewScreen';


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
      </Stack.Navigator>

    </SafeAreaProvider>


  );
};

export default AppNavigator;