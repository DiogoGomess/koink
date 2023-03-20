import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, Text, ScrollView, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedUserContext } from '../src/LoggedUserContext';
import axios from 'axios';

const Home = ({ navigation }) => {
    const { loggedUser, setLoggedUser } = useContext(LoggedUserContext)
    const [isLogged, setIsLogged] = useState(false)
    useEffect(() => {
        const signInToken = async () => {
            const token = await AsyncStorage.getItem("token")
            const id = await AsyncStorage.getItem("userId")
            const idParse = JSON.parse(id)
            if (token) {
                try {
                    const response = await axios.get(`https://koinkapi.onrender.com/users/${idParse}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setLoggedUser(response.data.user)
                    setIsLogged(true)
                } catch (e) {
                    navigation.navigate("Login")
                    console.log(e);
                }

            } else {
                setIsLogged(false)
            }
        }
        signInToken()
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            {isLogged ? (<LottieView
                resizeMode='cover'
                source={require('../assets/ss.json')}
                autoPlay={true}
                loop={false}
                onAnimationFinish={() => navigation.navigate('Main')}
            />):(
                <LottieView
                resizeMode='cover'
                source={require('../assets/ss.json')}
                autoPlay={true}
                loop={false}
                onAnimationFinish={() => navigation.navigate('Home')}
            />
            )}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },


});

export default Home;