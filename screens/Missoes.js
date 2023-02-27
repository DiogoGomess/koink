import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, Text, ScrollView, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgUri } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import {LoggedUserContext} from '../src/LoggedUserContext';

export default function Missoes({ navigation, route }) {
    //loggedUser = route.params.loggedUser
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext);
    useEffect(() => {
    }, [loggedUser]);

    return (
        <View style={styles.container}>
            {loggedUser &&
                <SafeAreaView style={styles.container}>
                    <ImageBackground resizeMode="cover" style={styles.background} source={{ uri: 'https://sonaligl.sirv.com/Images/BackgroundOnb.png' }} />
                    <View style={styles.navbar}>
                        <Icon name="chevron-back" size={30} color="#fff" style={styles.icon} onPress={() => navigation.navigate('Main')}></Icon>
                        <View style={styles.containerMoedas}>
                            <Text style={styles.numMoedas}>{loggedUser.coins}</Text>
                            <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                        </View>
                    </View>
                    <View style={styles.title.box}>
                        <Text style={styles.title.text}>Missões</Text>
                    </View>
                    <View style={styles.missoes}>
                        {
                            loggedUser.missions.map((mission, index) => (
                                <View key={index} style={styles.missao}>
                                    <Text style={styles.missaoTxt}>{mission.description}</Text>
                                    <Pressable style={styles.completeButton}>
                                        <Text style={styles.completeButtonTxt}>{mission.progress}/{mission.goal}</Text>
                                    </Pressable>
                                </View>

                            ))
                        }
                    </View>
                </SafeAreaView>
                }
            </View>    
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent:'center'
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        marginLeft: 30,
        marginRight: 30,
        marginBottom:70
    },

    containerMoedas: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 130,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 4.65,

        elevation: 6,
    },
    numMoedas: {
        marginLeft: 10,
        color: 'black',
        fontSize: 18,
    },
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        coinsBox: {
            //alignSelf:'flex-end',
            width: 129,
            height: 39,
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            text: {
                color: '#353535',
                fontSize: 18
            }
        }
    },
    title: {
        justifyContent: 'center',
        box: {
            alignSelf: 'center',
            width: 205,
            height: 60,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
        },
        text: {
            alignSelf: 'center',
            paddingTop: 17,
            fontSize: 22,
            fontWeight: 'bold',
            color: '#353535'
        }
    },
    missoes: {
        alignItems: 'center',
        height:'100%',
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingTop:30
    },

    missao:{
        backgroundColor: '#F3F3F3',
        width: '90%',
        height:60,
        alignItems: 'center',
        //paddingVertical:10,
        paddingHorizontal:15,
        borderRadius:20,
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:8
    },
    missaoTxt:{
        color: '#353535',
        fontSize:17,
        width: '50%',
        marginVertical:10,
    },
    completeButton:{
        backgroundColor: '#FFFFFF',
        width:'45%',
        height:50,
        marginVertical:8,
        borderRadius:20,
        alignItems: 'center',
        justifyContent:'center'
    },
    completeButtonTxt:{
        color: '#353535',
        fontSize:17
    }

});
