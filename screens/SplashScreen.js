import React, { useState } from 'react';
import { ImageBackground, Text, ScrollView, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';



const Home = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <LottieView
                resizeMode='cover'
                source={require('../assets/ss.json')}
                autoPlay={true}
                loop={false}
                onAnimationFinish={()=> navigation.navigate('Home')}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },


});

export default Home;