import React, { useState, useEffect, useContext } from 'react';
import { Alert, ImageBackground, Text, ScrollView, Dimensions, SafeAreaView, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {LoggedUserContext} from '../src/LoggedUserContext';
import axios from 'axios';


const Main = ({ navigation }) => {

    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext);
    const [levels, setLevels] = useState(null);
    const [percentage, setPercentage] = useState(0);
    async function getLevels() {
        const response = await axios.get('https://koink-api.onrender.com/levels');
        if (response.status == 200) {
            setLevels(response.data.levels)
        }
    }
    useEffect(() => {
        getLevels();
    }, [loggedUser]);

    useEffect(()=>{
        let actualXP = (loggedUser.level.experience);
        setPercentage((actualXP % 100) / 100)
    })

    return (
        <View style={styles.container}>
            {loggedUser && levels &&
                <SafeAreaView style={styles.container}>
                    <LinearGradient
                        colors={['#0500FF', '#007FC6', '#550088', '#17011F']}
                        style={styles.linearGradient}
                    ></LinearGradient>
                    <SvgUri style={styles.estrelas} width='100%' height='100%' uri='https://rapedolo.sirv.com/koink/Estrelas.svg' />
                    <View style={styles.levelBar}>
                        <View style={styles.levelBar.level}>
                            <Text style={styles.levelBar.level.text}>{loggedUser.level.number}</Text>
                        </View>
                        <View style={styles.barView}>
                            <ProgressBar style={styles.levelBar.bar} progress={percentage} color='#FF6600' />
                        </View>
                    </View>
                    <View style={styles.navbar}>
                        <View style={styles.vidas}>
                            <Icon name="heart" size={40} color="#ACACAC" style={[styles.icon, styles.vidaActive]}></Icon>
                            <Icon name="heart" size={40} color="#ACACAC" style={[styles.icon, styles.vidaActive]}></Icon>
                            <Icon name="heart" size={40} color="#ACACAC" style={[styles.icon, styles.vidaActive]}></Icon>
                            <Icon name="heart" size={40} color="#ACACAC" style={[styles.icon]}></Icon>
                        </View>
                        <View style={styles.containerMoedas}>
                            <Text style={styles.numMoedas}>{loggedUser.coins}</Text>
                            <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                        </View>
                    </View>
                    <View style={styles.containerInfo}>
                        <Pressable onPress={() => navigation.navigate('Onboarding1')}>
                            <Icon name="information-outline" size={40} color="#FFFFFF" style={[styles.icon]}></Icon>
                        </Pressable>    
                    </View>
                    <View style={styles.containerAsteroid}>
                        <SvgUri style={styles.koink} uri="https://rapedolo.sirv.com/koink/koinkAcenar%202.svg" />
                        <SvgUri style={styles.asteroid} width='100%' uri="https://rapedolo.sirv.com/koink/asteroid2.svg" />
                    </View>
                    <View style={styles.tabbar}>
                        <Pressable onPress={() => navigation.navigate('Minijogos')} style={styles.tabbar.minijogos}>
                            <SvgUri uri="https://sonaligl.sirv.com/Images/Tabbar/minijogos.svg" />
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Missoes', { loggedUser: loggedUser })} style={styles.tabbar.missoes}>
                            <SvgUri uri="https://sonaligl.sirv.com/Images/Tabbar/Miss%C3%B5es.svg" />
                        </Pressable>
                        <Pressable style={styles.tabbar.principal}>
                            <SvgUri uri="https://sonaligl.sirv.com/Images/Tabbar/pp.svg" />
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Store')} style={styles.tabbar.loja}>
                            <SvgUri uri="https://sonaligl.sirv.com/Images/Tabbar/Loja.svg" />
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Perfil')} style={styles.tabbar.perfil}>
                            <SvgUri uri="https://sonaligl.sirv.com/Images/Tabbar/Perfil.svg" />
                        </Pressable>
                    </View>

                </SafeAreaView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    linearGradient: {
        width: '100%',
        height: '100%',
        opacity: 0.72,
        position: 'absolute'
    },
    estrelas: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    containerAsteroid: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 150,
        //backgroundColor: 'black'
    },
    koink: {
        top:40
    },
    asteroid:{
    },

    vidas: {
        flexDirection: 'row',
    },

    vidaActive: {
        color: '#ff6600'
    },
    containerInfo:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-end',
        paddingRight: 70,
        marginTop: 15,
        marginLeft: 30,
    },

    barView: {
        position: 'absolute',
        width: '80%',
        marginHorizontal:35
    },
    levelBar: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        level: {
            zIndex: 1,
            // position: 'absolute',
            marginLeft: 35,
            justifyContent: 'center',
            width: 55,
            height: 55,
            borderRadius: 1000,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            backgroundColor: '#FF6600',
            text: {
                alignSelf: 'center',
                fontFamily: 'Mulish',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#FFFFFF',
            }
        },
        bar: {
            // width: Dimensions.get('window').width - 100,
            maxWidth: '100%',
            height: 30,
            alignSelf: 'center',
            borderWidth: 2,
            borderColor: '#FFFFFF',
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
        },
    },
    coins: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 15,
        width: 120,
        height: 39,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        text: {
            color: '#353535',
            fontSize: 18
        },
        icon: {
            width: 21,
            height: 21
        }
    },

    navbar: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingRight: 70,
        marginTop: 40,
        marginLeft: 30,
    },

    containerMoedas: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 130,
        height: 40,
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


    tabbar: {
        zIndex: 1,
        width: '100%',
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        alignItems: 'center',
        // minijogos: {
        //     marginHorizontal: -5
        // },
        // missoes: {
        //     marginHorizontal: -5
        // },
        // principal: {
        //     marginHorizontal: -5,
        //     alignItems: 'center',
        // },
        // missoes: {
        //     marginHorizontal: -5

        // },
        // perfil: {
        //     marginHorizontal: -5

        // }
    }
});

export default Main;