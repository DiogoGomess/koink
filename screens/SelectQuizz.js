import React, { useState } from 'react';
import { ImageBackground, Text, Modal, ScrollView, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput, Dimensions } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';



export default function SelectQuizz({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0075FF', '#0E41A6', '#430B89']}
                style={styles.linearGradient}
            ></LinearGradient>

            <View style={styles.navbar}>
                <Icon name="chevron-back" size={30} color="#fff" style={styles.icon} onPress={() => navigation.navigate('Minijogos')}></Icon>
            </View>
            <View style={styles.nuvemContainer}>
                <SvgUri width='170' height='170' uri="https://rapedolo.sirv.com/koink/nuvem.svg" />
                <SvgUri style={styles.koinkDinheiro} width='80' height='80' uri="https://rapedolo.sirv.com/koink/koinkDinheiro.svg" />

            </View>
            <View style={styles.imageQuizzes}>
                <SvgUri style={{ marginLeft: 30 }} width='250' height='250' uri="https://rapedolo.sirv.com/koink/koinkPensativo.svg" />
                <View style={[styles.containerPergunta, { transform: [{ rotate: '2deg' }] }]}></View>
                <View style={[styles.containerPergunta, { transform: [{ rotate: '-2deg' }] }]}></View>
                <View style={styles.containerPergunta}>
                    <Text style={styles.perguntaTxt}>Vamos testar os teus conhecimentos sobre literacia financeira?</Text>
                </View>
            </View>
            <View style={styles.containerButtons}>
                <Pressable style={styles.button} onPress={() => navigation.navigate('Quizz1')}>
                    <Text style={styles.buttonTxt}>Quizz Fácil</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigation.navigate('Quizz2')}>
                    <Text style={styles.buttonTxt}>Quizz Médio</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonTxt}>Quizz Difícl</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonTxt}>Quizz Expert</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: '100%',
    },

    linearGradient: {
        width: '100%',
        height: '100%',
        opacity: 0.72,
        position: 'absolute'
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 40,
        alignItems: 'center'
    },

    nuvemContainer: {
        alignSelf: 'flex-end',
    },
    koinkDinheiro: {
        position: 'absolute',
        top: 20,
        left: 40
    },
    imageQuizzes: {
        alignItems: 'center',
    },

    containerPergunta: {
        position: 'absolute',
        marginTop: 140,
        width: '80%',
        height: 150,
        backgroundColor: '#F6F4F2',
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: "#BEBEBE",
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    perguntaTxt: {
        color: '#353535',
        fontSize: 18,
        textAlign: 'center',
    },

    containerButtons: {
        width: '100%',
        alignItems: 'center',
        marginTop:70,
    },

    button: {
        backgroundColor: '#f6f4f2',
        width: '80%',
        marginVertical:7,
        height:40,
        borderRadius:10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTxt:{
        color: '#353535',
        fontSize: 18,
    }
})