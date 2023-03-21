import React, { useState } from 'react';
import { Alert,ImageBackground, Text, ScrollView, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as AuthSession from 'expo-auth-session';



const Home = ({ navigation }) => {
    
    async function handleGoogleSignIn(){
        try {
            const CLIENT_ID = "640845541886-b86rbd2ge51nprepj4ce2r6orj2c6hlp.apps.googleusercontent.com";
            const REDIRECT_URI = "https://auth.expo.io/@diogogomess/koink";
            const SCOPE = encodeURI("profile email");
            const RESPONSE_TYPE = "token";

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const {type, params} =await AuthSession.startAsync({ authUrl });
            console.log(type, params);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground resizeMode="cover" style={styles.background} source={require('../assets/loginBack.png')} />
            {/* <ImageBackground  resizeMode="cover" style={styles.background} source={require('../assets/loginBack.png')} /> */}
            <View style={styles.logos}>
                <SvgUri uri="https://sonaligl.sirv.com/Images/logo.svg" />
                <SvgUri style={styles.logos.leitao} uri="https://sonaligl.sirv.com/Images/KoinkLogin1.svg" />
            </View>
            <View style={styles.social}>
                <Pressable style={styles.socialButton} onPress={handleGoogleSignIn}>
                    <SvgUri style={styles.icon} uri="https://sonaligl.sirv.com/Images/google.svg" />
                    <Text style={styles.socialButtonTxt}>Continuar com o Google</Text>
                </Pressable>
                <Pressable style={[styles.socialButton, {backgroundColor:"#3B5990"}]}>
                    <SvgUri style={styles.icon} uri="https://sonaligl.sirv.com/Images/facebook.svg" />
                    <Text style={[styles.socialButtonTxt, {color:"#ffffff"}]}>Continuar com o Facebook</Text>
                </Pressable>
                <Pressable style={[styles.socialButton,{backgroundColor:"#000000"}]}>
                    <SvgUri  style={styles.icon} uri="https://sonaligl.sirv.com/Images/apple.svg" />
                    <Text style={[styles.socialButtonTxt, {color:"#ffffff"}]}>Continuar com o Apple ID</Text>
                </Pressable>

            </View>

            {/* <View style={styles.social}>
                <Pressable style={styles.social.button}>
                    <SvgUri style={styles.icon} uri="https://sonaligl.sirv.com/Images/google.svg" />
                    <Text style={styles.social.button.text}>Continuar com o Google</Text>
                </Pressable>
                <Pressable style={styles.social.buttonFacebook}>
                    <SvgUri style={styles.icon} uri="https://sonaligl.sirv.com/Images/facebook.svg" />
                    <Text style={styles.social.buttonFacebook.text}>Continuar com o Facebook</Text>
                </Pressable>
                <Pressable style={styles.social.buttonApple}>
                    <SvgUri uri="https://sonaligl.sirv.com/Images/apple.svg" />
                    <Text style={styles.social.buttonApple.text}>Continuar com o Apple ID</Text>
                </Pressable>
            </View> */}
            <View style={styles.account}>
                <Pressable onPress={() => navigation.navigate('Login')} style={styles.account.buttonEntrar}>
                    <Text style={styles.account.buttonEntrar.text}>Entrar</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Register')} style={styles.account.buttonRegistar}>
                    <Text style={styles.account.buttonRegistar.text}>Criar Conta</Text>
                </Pressable>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around'
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    },
    logos: {
        alignItems: 'center',
        leitao: {
            marginTop: 20
        }
    },
    icon: {
        marginRight: 10,
    },

    social:{
        alignItems: 'center',
    },
    socialButton:{
        width:'70%',
        backgroundColor: '#f1f1f1',
        height:50,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:5
    },

    socialButtonTxt:{
        fontFamily:"Mulish-Regular",
        color: '#353535',
        fontSize:18,
        width:'80%'
    },
    // social: {
    //     alignItems: 'center',
    //     button: {
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         paddingHorizontal: 5,
    //         paddingLeft: 30,
    //         alignItems: 'center',
    //         marginTop: 7,
    //         width: '70%',
    //         height: 52,
    //         backgroundColor: '#FFFFFF',
    //         borderRadius: 10,
    //         text: {
    //             alignSelf: 'center',
    //             fontSize: 17,
    //             color: '#353535'
    //         }
    //     },
    //     buttonFacebook: {
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //         justifyContent: 'space-between',
    //         paddingHorizontal: 5,
    //         paddingLeft: 30,
    //         marginTop: 7,
    //         width: '70%',
    //         height: 52,
    //         backgroundColor: '#3B5998',
    //         borderRadius: 10,
    //         text: {
    //             alignSelf: 'center',
    //             fontSize: 17,
    //             color: '#FFFFFF',
                
    //         }
    //     },
    //     buttonApple: {
    //         justifyContent: 'center',
    //         marginTop: 7,
    //         width: 284,
    //         height: 52,
    //         backgroundColor: '#000000',
    //         borderRadius: 10,
    //         text: {
    //             alignSelf: 'center',
    //             fontSize: 17,
    //             color: '#FFFFFF'
    //         }
    //     }
    // },
    account: {
        //marginTop:80,
        //justifyContent: 'space-between',
        alignItems: 'center',
        buttonEntrar: {
            justifyContent: 'space-around',
            marginTop: 7,
            width: 284,
            height: 52,
            backgroundColor: '#FF1D25',
            borderRadius: 10,
            text: {
                alignSelf: 'center',
                fontSize: 17,
                color: '#FFFFFF',
                fontFamily:"Mulish-Regular",
            }
        },
        buttonRegistar: {
            justifyContent: 'center',
            marginTop: 7,
            width: 284,
            height: 52,
            backgroundColor: '#EBEBEB',
            borderRadius: 10,
            text: {
                alignSelf: 'center',
                fontSize: 17,
                color: '#353535',
                fontFamily:"Mulish-Regular",
            }
        },
    },

});

export default Home;