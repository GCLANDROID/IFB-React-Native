
import React, { useEffect, useState } from 'react';

import {
    View,
    ImageBackground,
    StyleSheet,
    Image,




} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const WelcomeScreen = () => {
    const navigation = useNavigation()


    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('LoginScreen'); // Replace splash with home
        }, 2000); // 2 seconds = 2000 milliseconds

        return () => clearTimeout(timer); // Cleanup
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
