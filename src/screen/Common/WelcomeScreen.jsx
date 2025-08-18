
import React, { useEffect, useState } from 'react';

import {
    View,
    ImageBackground,
    StyleSheet,
    Image,




} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WelcomeScreen = () => {
    const navigation = useNavigation()


   useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const storedUserID = await AsyncStorage.getItem('UserID');

      if (!storedUserID || storedUserID === 'null' || storedUserID === '') {
        navigation.replace('LoginScreen');
      } else {
        navigation.replace('CSRDashbaord');
      }
    } catch (error) {
      console.error('Error reading UserID:', error);
      navigation.replace('LoginScreen'); // fallback
    }
  };

  setTimeout(checkLoginStatus, 2000); // 2-second splash

}, []);




    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={require('../../asset/splashimg.png')} // your top background image
                style={styles.topImage}
                resizeMode="cover"
            >
                <View style={{ alignItems: 'center', marginTop: 240 }}>
                    <Image source={require('../../asset/loader.gif')} style={styles.loaderImage} />
                </View>

            </ImageBackground>


        </View>
    );
};

const styles = StyleSheet.create({
    topImage: {
        height: '100%',
        width: '100%',

    },

    loaderImage: {
        height: 200,
        width: 200,

    },


});

export default WelcomeScreen;
