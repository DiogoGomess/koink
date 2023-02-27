import React, { useState } from 'react';
import { ImageBackground, Text, ScrollView, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';



const Onboarding1 = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground resizeMode="cover" style={styles.background} source={{ uri: 'https://sonaligl.sirv.com/Images/BackgroundOnb.png' }} />
            <View style={styles.card}>
                <SvgUri style={styles.card.image} uri="https://sonaligl.sirv.com/Images/koink_pc.svg" />
                <Text style={styles.card.title}>Personaliza!</Text>
                <Text style={styles.card.desc}>Vem conhecer a nossa coleção de avatares. Podes personalizar o teu perfil e torná-lo único, à tua maneira. Estás pronto para conhecer o KoinK?</Text>
                <Pressable onPress={() => navigation.navigate('Main')} style={styles.card.next}>
                    <Text style={styles.card.next.text}>Vamos Começar!</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{
       flex:1,
       justifyContent:'center'
    },
    background:{
        position: 'absolute',
        width:'100%',
        height:'100%',
        top:0,
        left:0
    },
    card:{
        justifyContent:'center',
        alignSelf:'center',
        backgroundColor:'#FFFFFF',
        width:367,
        height:735,
        borderRadius:30,
        image:{
            alignSelf:'center',
            //marginTop:90
        },
        title:{
            alignSelf:'center',
            fontSize:30,
            color:'#FF6600',
            marginTop:50
        },
        desc:{
            width:300,
            alignSelf:'center',
            textAlign:'center',
            marginTop:16,
            fontSize:16,
            color:'#353535'
        },
        next:{
            alignSelf:'center',
            justifyContent:'center',
            marginTop:80,
            width:269,
            height:52,
            borderRadius:10,
            backgroundColor:'#FF6600',
            text:{
                alignSelf:'center',
                fontSize:18,
                color:'#FFFFFF',
            }
        },
        skip:{
            alignSelf:'center',
            justifyContent:'center',
            marginTop:20,
            text:{
                alignSelf:'center',
                fontSize:16,
                color:'#A6A6A6',
            }
        }
    }
});

export default Onboarding1;