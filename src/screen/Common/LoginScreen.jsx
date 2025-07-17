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


const LoginScreen = () => {
    const navigation = useNavigation()






    return (
        <SafeAreaProvider >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', }}>
                <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                     <ScrollView style={{flex:1,padding:10,marginTop:80}}>
                    
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                     <Image source={require('../../asset/login-icon.png')} style={styles.loginImage} />
                     <Text style={styles.loginText}>Login to Continue</Text>
                     <View style={styles.inputTextBG}>
                        <View style={[styles.iconBG,{backgroundColor:'#09053dff'}]}>
                             <Image source={require('../../asset/id-card.png')} style={styles.icon} />
                        </View>
                        <TextInput style={styles.inputText} placeholder='Enter User ID' placeholderTextColor={'#665c5cff'}></TextInput>
                     </View>

                      <View style={styles.inputTextBG}>
                        <View style={[styles.iconBG,{backgroundColor:'#04523eff'}]}>
                             <Image source={require('../../asset/password-icon.png')} style={styles.icon} />
                        </View>
                        <TextInput style={styles.inputText} placeholder='Enter Password' placeholderTextColor={'#665c5cff'}></TextInput>
                     </View>
                      <View style={styles.inputTextBG}>
                        <View style={[styles.iconBG,{backgroundColor:'#861308ff'}]}>
                             <Image source={require('../../asset/key.png')} style={styles.icon} />
                        </View>
                        <TextInput style={styles.inputText} placeholder='Enter Security Code' placeholderTextColor={'#665c5cff'}></TextInput>
                     </View>
                     <TouchableOpacity style={styles.loginButton}  onPress={() => navigation.navigate('Dashboard')}>
                        <Text style={styles.loginButtonText}>Login</Text>
                        <Image source={require('../../asset/send.png')} style={[styles.icon,{marginLeft:10}]}></Image>
                     </TouchableOpacity>
                </ScrollView>
                </KeyboardAvoidingView>
          
               
           



        </SafeAreaView>
        </SafeAreaProvider>
        
    );
};

const styles = StyleSheet.create({
   
    loginImage: {
        height: 300,
        width: 300,
        alignSelf:'center'

    },
    icon: {
        height: 30,
        width: 30,
        alignSelf:'center'

    },
    welcomeText:{
        fontSize:22,
        fontWeight:'700',
        color:'#b80505ff'
    },
    loginText:{
        fontSize:18,
        fontWeight:'600',
        color:'#665c5cff',
        alignSelf:'center'
    },
    inputTextBG:{
        borderRadius:4,
        borderWidth:1,
        borderColor:'#665c5cff',
        height:50,
        marginVertical:10,
        flexDirection:'row',
       


    },
    inputText:{
        fontSize:16,
        fontWeight:'400',
        color:'#000000ff',
       
    },
    iconBG:{
        borderTopLeftRadius:4,
        borderBottomLeftRadius:4,
        borderWidth:1,
        height:50,
        width:50,
         justifyContent:'center'
        


    },

    loginButton:{
        borderRadius:4,
        backgroundColor:'#000000',
        height:50,
        marginTop:20,
        width:250,
        alignSelf:'center',
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:40
       },

       loginButtonText:{
        fontSize:20,
        fontWeight:'400',
        color:'#FFFFFF',
       
    },


});

export default LoginScreen;