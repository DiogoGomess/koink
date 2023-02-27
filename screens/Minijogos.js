import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, Text, ScrollView, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoggedUserContext} from '../src/LoggedUserContext';



const Onboarding1 = ({ navigation }) => {
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext);
    // async function getLoggedUser(){
    //     const data = await AsyncStorage.getItem('loggedUser');
    //     if(data !== null){
    //         setloggedUser(JSON.parse(data));
    //         console.log(loggedUser);
    //     }
    // }

    useEffect(() => {
        // getLoggedUser();
    }, [loggedUser]);


    return (
        <SafeAreaView style={styles.container}>
            { loggedUser &&
                <SafeAreaView style={styles.container}>
                    <ImageBackground resizeMode="cover" style={styles.background} source={{ uri: 'https://sonaligl.sirv.com/Images/BackgroundOnb.png' }} />
                    <View style={styles.topContainer}>
                        <View style={styles.topContainer.back}>
                            {/* <SvgUri uri="https://sonaligl.sirv.com/Images/backArrow.svg" /> */}
                            <Icon name="chevron-back" size={30} color="#fff" style={styles.icon} onPress={() => navigation.navigate('Main')}></Icon>
                        </View>
                        <View style={styles.topContainer.coins}>
                            <Text style={styles.topContainer.coins.text}>{loggedUser.coins}</Text>
                            <SvgUri style={styles.topContainer.coins.icon} uri="https://sonaligl.sirv.com/Images/coinSimbol.svg" />
                        </View>
                    </View>
                    <Swiper loop={false}>
                    <View style={styles.card}>
                            <View style={styles.card.score}>
                                <Text style={styles.card.score.text}>Pontuação: {loggedUser.stats.highscores.rocketpig}</Text>
                            </View>
                            <SvgUri  style={styles.card.image} uri="https://sonaligl.sirv.com/Images/rocket.svg" />
                            <Text style={styles.card.title}>Rocket Pig</Text>
                            <Text style={styles.card.text}>No rocket Pig tens de ultrapassar os obstáculos que vão aparecendo. Quantos mais obstáculos conseguires ultrapassar, mais moedas ganhas!</Text>
                            <Pressable onPress={() => navigation.navigate('RocketPig')} style={styles.card.button}>
                                <Text style={styles.card.button.text}>Jogar</Text>
                            </Pressable>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.card.score}>
                                <Text style={styles.card.score.text}>Pontuação: {loggedUser.stats.highscores.pigzz}</Text>
                            </View>
                            <SvgUri  style={styles.card.image} uri="https://sonaligl.sirv.com/Images/pigzz.svg" />
                            <Text style={styles.card.title}>Pigzz</Text>
                            <Text style={styles.card.text}>Vários quizzes para demonstrares o teu conhecimento. Quantas mais perguntas acertares, mais moedas ganhas!</Text>
                            <Pressable onPress={() => navigation.navigate('SelectQuizz')} style={styles.card.button}>
                                <Text style={styles.card.button.text}>Jogar</Text>
                            </Pressable>
                        </View>
                    </Swiper>
                </SafeAreaView>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{
       flex:1,
    },
    background:{
        position: 'absolute',
        width:'100%',
        height:'100%',
        top:0,
        left:0
    },
    topContainer:{
        flex:0.12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        back:{
            //justifyContent:'center',
        },
        coins:{
            flexDirection:'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop:10,
            marginRight:15,
            width:120,
            height:39,
            borderRadius:20,
            backgroundColor:'#FFFFFF',
            text:{
                color:'#353535',
                fontSize:18
            },
            icon:{
                width:21,
                height:21
            }
        },
    },
    card:{
        //justifyContent: 'center',
        alignSelf:'center',
        width:367,
        height:660,
        borderRadius:30,
        backgroundColor:'#FFFFFF',
        score:{
            justifyContent: 'center',
            width:157,
            height:57,
            backgroundColor:'#FF6600',
            borderTopLeftRadius: 30,
            borderBottomRightRadius: 30,
            text:{
                alignSelf:'center',
                color:'#FFFFFF',
                fontSize:16,
                fontWeight:'bold',
            }
        },
        image:{
            alignSelf:'center',
            marginTop:25
        },
        title:{
            marginTop:20,
            alignSelf:'center',
            fontSize:22,
            fontWeight:'bold',
            color:'#353535',
        },
        text:{
            width:280,
            marginTop:25,
            alignSelf:'center',
            textAlign:'center',
            color:'#353535',
            fontSize:18
        },
        button:{
            marginTop:80,
            alignSelf:'center',
            justifyContent: 'center',
            alignSelf:'center',
            width:269,
            height:52,
            borderRadius:10,
            backgroundColor:'#FF6600',
            text:{
                alignSelf:'center',
                fontSize:18,
                color:'#FFFFFF'
            }
        }
    }

});

export default Onboarding1;