import React, { useState, useContext } from 'react';
import { Alert, ImageBackground, Modal, Text, ScrollView, ActivityIndicator, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LoggedUserContext } from '../src/LoggedUserContext';
import { BlurView } from 'expo-blur';

const Login = ({ navigation, route }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { loggedUser, setLoggedUser } = useContext(LoggedUserContext)
    const [modalError, setModalError] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit() {
        try {
            setIsLoading(true)
            const response = await axios.post('https://koinkapi.onrender.com/users/login', {
                username: username.toLowerCase(),
                password: password
            });
            // console.log(response);
            setIsLoading(false)
            if (response.data.success) {
                await AsyncStorage.setItem('token', response.data.accessToken);
                await AsyncStorage.setItem('loggedIn', JSON.stringify(true));
                await AsyncStorage.setItem('userId', JSON.stringify(response.data.user._id));
                setLoggedUser(response.data.user);
                // console.log(response.data.user);
                navigation.navigate('Main');
            } else {
                throw new Error(response.data.msg);
            }
        } catch (error) {
            setError(error.response.data.msg)
            setIsLoading(false)
            setModalError(true)
            // console.log(error.response.data.msg);
        }

    }

    const displayContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" />
        }
        else {
            return (
                <View style={styles.account}>
                    <Pressable onPress={() => handleSubmit()} style={styles.account.buttonEntrar}>
                        <Text style={styles.account.buttonEntrar.text}>Entrar</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('Register')} style={styles.account.buttonRegistar}>
                        <Text style={styles.account.buttonRegistar.text}>Criar Conta</Text>
                    </Pressable>
                </View>
            )
        }
    }

    const handleUsernameChange = (text) => {
        setUsername(text.trim());
      };

    return (
        <SafeAreaView style={styles.container}>
            {/* <SvgUri style={styles.background} uri="https://sonaligl.sirv.com/Images/Group%2047.svg" /> */}
            <ImageBackground resizeMode="cover" style={styles.background} source={require('../assets/loginBack.png')} />
            <View style={styles.logos}>
                <SvgUri uri="https://sonaligl.sirv.com/Images/logo.svg" />
                <SvgUri style={styles.logos.leitao} uri="https://sonaligl.sirv.com/Images/KoinkLogin1.svg" />
            </View>
            <View style={styles.inputs}>
                <TextInput
                    style={styles.inputs.name}
                    onChangeText={handleUsernameChange}
                    value={username}
                    placeholder='Nome de Utilizador'
                    placeholderTextColor="black"
                />
                <TextInput
                    style={styles.inputs.pass}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                    placeholder='Password'
                    placeholderTextColor="black"
                />
            </View>
            {displayContent()}


            <Modal
                animationType="slide"
                visible={modalError}
                transparent={true}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalError(!modalError);
                }}
            >
                <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                    <View style={[styles.modal]}>
                        <View style={{ marginVertical: 20 }}>
                            <SvgUri width='150' height='150' uri='https://rapedolo.sirv.com/koink/koinkPensativo.svg' />
                        </View>
                        <Text style={styles.modalAvatarTxt}>{error}</Text>
                        <TouchableNativeFeedback onPress={() => setModalError(false)}>
                            <View style={[styles.buttonAvatarModal]}>
                                <Text style={[styles.buttonAvatarModalTxt, { color: '#FFFFFF' }]}>Voltar</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </BlurView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
    },
    logos: {
        alignItems: 'center',
        leitao: {
            marginTop: 20
        }
    },
    inputs: {
        alignItems: 'center',
        name: {
            fontFamily:"Mulish-Regular",
            color: 'black',
            width: 284,
            height: 52,
            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 10
        },
        pass: {
            fontFamily:"Mulish-Regular",
            color: 'black',
            marginTop: 10,
            width: 284,
            height: 52,
            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 10
        }
    },
    account: {
        alignItems: 'center',
        buttonEntrar: {
            justifyContent: 'space-around',
            marginTop: 7,
            width: 284,
            height: 52,
            backgroundColor: '#FF1D25',
            borderRadius: 10,
            text: {
                fontFamily:"Mulish-Regular",
                alignSelf: 'center',
                fontSize: 17,
                color: '#FFFFFF'
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
                fontFamily:"Mulish-Regular",
                alignSelf: 'center',
                fontSize: 17,
                color: '#353535'
            }
        },
    },

    modal: {
        paddingVertical: 10,
        backgroundColor: '#F6F4F2',
        borderRadius: 30,
        width: '80%',
        height: '40%',
        alignItems: 'center',
    },
    containerModal: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        blurRadius: 1
    },

    buttonAvatarModal: {
        backgroundColor: '#FF6600',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        paddingVertical: 12,
        marginTop: 10
    },
    buttonAvatarModalTxt: {
        fontFamily:"Mulish-Regular",
        color: '#353535',
        fontSize: 18
    },

    modalAvatarTxt: {
        fontFamily:"Mulish-Regular",
        marginHorizontal: 10,
        fontSize: 18,
        color: '#353535'
    },
});

export default Login;