import React, { useState, useEffect, useContext } from 'react';
import { ImageBackground, Text, ScrollView, Modal, Switch, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput, Dimensions } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';
import { BlurView } from 'expo-blur';
import { color } from '@rneui/base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {LoggedUserContext} from '../src/LoggedUserContext';
let bcrypt = require('bcryptjs');
const ListTab = [
    {
        status: 'Inventário'
    },
    {
        status: 'Dados'
    }
]

const InventarioTab = [
    {
        slider: 'Avatares',
        id: 0
    },
    {
        slider: 'Boosters',
        id: 1
    }
]



const Perfil = ({ navigation, route }) => {
    const [status, setStatus] = useState('Inventário')
    const [slider, setSlider] = useState('Avatares')
    const [sliderId, setSliderId] = useState(0)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAvatarActive, setModalAvatarActive] = useState(false);
    const [modalLogout, setModalLogout] = useState(false);
    const [modalLogoutDone, setModalLogoutDone] = useState(false);
    const [modalEditData, setModalEditData] = useState(false);
    const [modalEditDataComplete, setModalEditDataComplete] = useState(false);
    const [activeAvatar, setActiveAvatar] = useState(false);
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    
    
    async function getLoggedUser() {
        setUsername(loggedUser.username)
        setEmail(loggedUser.email)
        setPassword(loggedUser.password)    // console.log(loggedUser);
    }


    async function changeUserData() {
        // setDadosAtualizados({username:loggedUser.username, email:loggedUser.email});
        let token = await AsyncStorage.getItem('token');


        await axios.put(`https://koink-api.onrender.com/users/${loggedUser._id}`, {
            username: username,
            email: email,
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        try {
            setLoggedUser((prevState) => {
                return {
                    ...prevState,
                    username: username,
                    email: email,
                }
            })
            setModalEditData(false);
            setModalEditDataComplete(true);
        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        getLoggedUser();
    }, []);

    useEffect(() => {
    }, [loggedUser]);


    async function handleLogout() {
        try {
            await AsyncStorage.removeItem('token');
            //await AsyncStorage.removeItem('loggedUser');
            setModalLogout(false);
            setModalLogoutDone(true);

            // navigation.navigate('Home');
        } catch (error) {
            console.error(error);
        }
    }

    async function renderModal(id) {
        const avatar = await axios.get(`https://koink-api.onrender.com/avatars/${id}`);

        setActiveAvatar(avatar.data[0]);

        setModalAvatarActive(true);
    }

    async function setAvatar(image) {
        let token = await AsyncStorage.getItem('token');
        await axios.put(`https://koink-api.onrender.com/users/${loggedUser._id}`, {
            curr_avatar: image
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        setLoggedUser((prevState) => {
            return {
                ...prevState,
                curr_avatar: image
            }
        })
        setModalAvatarActive(false);
    }

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const setStatusFilter = status => {
        setStatus(status)
        setSliderId(0)
    }

    function swipeIndex(id) {
        setSliderId(id)
    }
    return (
        <View style={styles.container}>
            {loggedUser &&
                <KeyboardAwareScrollView style={styles.container}>
                    <LinearGradient
                        colors={['#0500FF', '#007FC6', '#550088', '#17011F']}
                        style={styles.linearGradient}
                    ></LinearGradient>
                    <View style={styles.navbar}>
                        <Icon name="chevron-back" size={30} color="#fff" style={styles.icon} onPress={() => navigation.navigate('Main')}></Icon>
                        <Text style={styles.navbarText}>Perfil</Text>
                        <IconEntypo name="dots-three-vertical" size={25} color="#fff" style={styles.icon} onPress={() => setModalVisible(true)}></IconEntypo>
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.opacityContainer}>
                        </View>
                        <View style={styles.perfilImage}>
                            <SvgUri width='90' height='90' uri={loggedUser.curr_avatar} />
                        </View>
                        <View style={styles.nomeContainer}>
                            <Text style={styles.nome}>@{loggedUser.username}</Text>
                        </View>
                        <View style={styles.dadosUser}>
                            <View style={styles.nivelData}>
                                <Text style={styles.nivel}>Nível</Text>
                                <Text style={styles.numero}>{loggedUser.level.number}</Text>
                            </View>
                            <View style={styles.border}></View>
                            <View style={styles.classData}>
                                <Text style={styles.nivel}>Classificação</Text>
                                <Text style={styles.numero}>{loggedUser.ranking}</Text>
                            </View>
                            <View style={styles.border}></View>
                            <View style={styles.moedasData}>
                                <Text style={styles.nivel}>Moedas</Text>
                                <Text style={styles.numero}>{loggedUser.coins}</Text>
                            </View>

                        </View>
                        <View style={styles.tabs}>
                            {ListTab.map((tab, index) => (
                                <Pressable key={index} style={[styles.btnTab, status === tab.status && styles.btnTabActive]} onPress={() => setStatusFilter(tab.status)}>
                                    <Text style={[styles.btnText, status === tab.status && styles.btnTextActive]}>{tab.status}</Text>
                                </Pressable>
                            ))}
                        </View>
                        <View>
                            {status == 'Inventário' && loggedUser &&
                                <View style={styles.containerInv}>
                                    <View style={[styles.sliderName]}>
                                        {InventarioTab.map((inv, index) => (
                                            <Text key={index} style={[styles.sliderTxt, index === 0 && styles.sliderTxtBorder, index === sliderId && styles.sliderActive]} >{inv.slider}</Text>
                                        ))}
                                    </View>

                                    <Swiper
                                        index={0}
                                        loop={false}
                                        dot={
                                            <View style={{ backgroundColor: '#666666', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
                                        }
                                        activeDot={
                                            <View style={{ backgroundColor: '#666666', width: 14, height: 14, borderRadius: 100, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
                                        }
                                        onIndexChanged={(idx) => swipeIndex(idx)}
                                    >
                                        <ScrollView style={styles.containerAvatares}>
                                            <View style={styles.avatares}>
                                                {
                                                    loggedUser.inventory.avatars.map((avatar) => {
                                                        return (
                                                            // <Pressable key ={avatar._id} style={styles.avataresImage} onPress={()=> setAvatar(avatar.image)}>
                                                            <Pressable key={avatar._id} style={styles.avataresImage} onPress={() => renderModal(avatar._id)}>
                                                                <SvgUri width='80' height='80' uri={avatar.image} />
                                                            </Pressable>
                                                        )
                                                    })
                                                }
                                            </View>
                                            {/* <View style={styles.avatares}>

                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                            </View>
                                            <View style={styles.avatares}>

                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                            </View>
                                            <View style={styles.avatares}>

                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                            </View> */}
                                        </ScrollView>
                                        <ScrollView style={styles.containerAvatares}>
                                            <View style={styles.avatares}>
                                                {
                                                    loggedUser.inventory.boosters.map((booster) => {
                                                        return (
                                                            // <Pressable key ={avatar._id} style={styles.avataresImage} onPress={()=> setAvatar(avatar.image)}>
                                                            <Pressable key={booster._id} style={styles.avataresImage}>
                                                                <SvgUri width='80' height='80' uri={booster.image} />
                                                            </Pressable>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </ScrollView>    
{/* 
                                        <ScrollView style={styles.containerBoosters}>
                                            <View style={styles.boosters}>

                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                            </View>
                                            <View style={styles.boosters}>

                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                                <View style={styles.avataresImage}>
                                                    <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                                                </View>
                                            </View>
                                        </ScrollView> */}
                                    </Swiper>


                                </View>
                            }
                        </View>

                        {/* view dos dados */}
                        <View>
                            {status == 'Dados' &&
                                <View style={styles.containerInv}>
                                    <View>
                                        <View style={[styles.inputTxt, styles.inputTxt1]}>
                                            <TextInput
                                                onChangeText={setUsername} value={username} style={[{ flex: 1, color: '#000' }]}/>
                                            <IconMaterial style={[styles.imageStyle]} name="pencil-outline" size={20} color="#000"></IconMaterial>
                                        </View>
                                        <View style={styles.inputTxt}>
                                            <TextInput onChangeText={setEmail} value={email} style={[{ flex: 1, color: '#000' }]}/>
                                            <IconMaterial style={[styles.imageStyle]} name="pencil-outline" size={20} color="#000"></IconMaterial>
                                        </View>
                                        <View style={styles.inputTxt}>
                                            <TextInput secureTextEntry={true} onChangeText={setPassword} value={password} style={[{ flex: 1, color: '#000' }]}></TextInput>
                                            <IconMaterial style={[styles.imageStyle]} name="pencil-outline" size={20} color="#000"></IconMaterial>
                                        </View>
                                    </View>
                                    {/* <Pressable style={styles.editarButton} onPress={() => changeUserData()}> */}
                                    <Pressable style={styles.editarButton} onPress={() => setModalEditData(true)}>
                                        <Text style={styles.editarTxt}>Editar</Text>
                                    </Pressable>
                                </View>
                            }
                        </View>
                    </View>

                    <Modal
                        animationType="slide"
                        visible={modalVisible}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                            <View style={styles.modal}>
                                <Text style={styles.modalTitulo}>Definições</Text>
                                <View style={styles.som}>
                                    <Text style={styles.somTxt}>Som</Text>
                                    <Switch
                                        trackColor={{ false: "#A6A6A6", true: "#FF6600" }}
                                        thumbColor={isEnabled ? "#FFFFFF" : "#FFFFFF"}
                                        onValueChange={toggleSwitch}
                                        value={isEnabled}
                                        style={{ transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }], paddingHorizontal: 9 }}
                                    />
                                </View>
                                {/* <Pressable style={styles.botaoLogout} onPress={() => handleLogout()}> */}
                                <Pressable style={styles.botaoLogout} onPress={() => setModalLogout(true)}>
                                    <Text style={[styles.botaoCancelarTxt, { color: '#ffffff' }]}>Logout</Text>
                                </Pressable>
                                <Pressable style={styles.botaoCancelar} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.botaoCancelarTxt}>Voltar</Text>
                                </Pressable>

                            </View>
                        </BlurView>
                    </Modal>

                    {/* Modal de escolher o Avatar de Perfil */}
                    <Modal
                        animationType="slide"
                        visible={modalAvatarActive}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalAvatarActive(!modalAvatarActive);
                        }}
                    >
                        <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                            <View style={styles.modal}>
                                <View>
                                    <SvgUri width='120' height='120' uri={activeAvatar.image} />
                                </View>
                                <Text style={styles.modalAvatarTxt}>Pretende equipar este avatar?</Text>
                                <TouchableNativeFeedback onPress={() => setAvatar(activeAvatar.image)}>
                                    <View style={[styles.buttonAvatarModal]}>
                                        <Text style={[styles.buttonAvatarModalTxt, { color: '#FFFFFF' }]}>Sim</Text>
                                    </View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => setModalAvatarActive(false)}>
                                    <View style={[styles.buttonAvatarModal, { backgroundColor: '#E3E3E3' }]}>
                                        <Text style={[styles.buttonAvatarModalTxt]}>Não</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </BlurView>
                    </Modal>


                    {/* Modal de logout */}
                    <Modal
                        animationType="slide"
                        visible={modalLogout}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalLogout(!modalLogout);
                        }}
                    >
                        <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                            <View style={[styles.modal, { height: '50%', }]}>
                                <View style={{ marginVertical: 20 }}>
                                    <SvgUri width='150' height='150' uri='https://rapedolo.sirv.com/koink/koinkSurpreendido.svg' />
                                </View>
                                <Text style={styles.modalAvatarTxt}>Tens a certeza que queres sair do Koink?</Text>
                                <TouchableNativeFeedback onPress={() => handleLogout()}>
                                    <View style={[styles.buttonAvatarModal]}>
                                        <Text style={[styles.buttonAvatarModalTxt, { color: '#FFFFFF' }]}>Sim</Text>
                                    </View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => setModalLogout(false)}>
                                    <View style={[styles.buttonAvatarModal, { backgroundColor: '#E3E3E3' }]}>
                                        <Text style={[styles.buttonAvatarModalTxt]}>Não</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </BlurView>
                    </Modal>



                    {/* Modal de aviso após Logout */}

                    <Modal
                        animationType="slide"
                        visible={modalLogoutDone}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalLogoutDone(!modalLogoutDone);
                        }}
                    >
                        <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                            <View style={[styles.modal]}>
                                <View style={{ marginVertical: 20 }}>
                                    <SvgUri width='150' height='150' uri='https://rapedolo.sirv.com/koink/koinkTriste.svg' />
                                </View>
                                <Text style={styles.modalAvatarTxt}>A tua sessão foi terminada com sucesso!</Text>
                                <TouchableNativeFeedback onPress={() => navigation.navigate('Home')}>
                                    <View style={[styles.buttonAvatarModal]}>
                                        <Text style={[styles.buttonAvatarModalTxt, { color: '#FFFFFF' }]}>Ok</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </BlurView>
                    </Modal>



                    {/* Modal de confirmar edição dos dados */}
                    <Modal
                        animationType="slide"
                        visible={modalEditData}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalEditData(!modalEditData);
                        }}
                    >
                        <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                            <View style={[styles.modal, { height: '50%', }]}>
                                <View style={{ marginVertical: 20 }}>
                                    <SvgUri width='150' height='150' uri='https://rapedolo.sirv.com/koink/koinkEditar.svg' />
                                </View>
                                <Text style={styles.modalAvatarTxt}>Queres salvar as alterações feitas nos teus dados?</Text>
                                <TouchableNativeFeedback onPress={() => changeUserData()}>
                                    <View style={[styles.buttonAvatarModal]}>
                                        <Text style={[styles.buttonAvatarModalTxt, { color: '#FFFFFF' }]}>Sim</Text>
                                    </View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => setModalEditData(false)}>
                                    <View style={[styles.buttonAvatarModal, { backgroundColor: '#E3E3E3' }]}>
                                        <Text style={[styles.buttonAvatarModalTxt]}>Não</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </BlurView>
                    </Modal>


                    {/* Modal edição dos dados concluida */}
                    <Modal
                        animationType="slide"
                        visible={modalEditDataComplete}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalEditDataComplete(!modalEditDataComplete);
                        }}
                    >
                        <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                            <View style={[styles.modal]}>
                                <View style={{ marginVertical: 20 }}>
                                    <SvgUri width='150' height='150' uri='https://rapedolo.sirv.com/koink/koinkVitoria.svg' />
                                </View>
                                <Text style={styles.modalAvatarTxt}>Os teus dados foram atualizados com sucesso!</Text>
                                <TouchableNativeFeedback onPress={() => setModalEditDataComplete(false)}>
                                    <View style={[styles.buttonAvatarModal]}>
                                        <Text style={[styles.buttonAvatarModalTxt, { color: '#FFFFFF' }]}>Ok</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </BlurView>
                    </Modal>


                </KeyboardAwareScrollView>
            }
        </View>
    );
};

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
        marginTop: 40,
        marginLeft: 30,
        marginRight: 30,
    },
    navbarText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        opacity: 1,
    },
    perfilImage: {
        backgroundColor: '#FF6600',
        width: 110,
        height: 110,
        borderRadius: 1000,
        alignSelf: 'center',
        borderStyle: 'solid',
        borderColor: "white",
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    opacityContainer: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        opacity: 0.3,
        width: '100%',
        height: '100%',
        marginTop: 50,
        borderRadius: 30
    },
    contentContainer: {
        display: 'flex',
        marginTop: 30,
        height: '100%',
    },
    nomeContainer: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nome: {
        color: 'white',
        fontSize: 20,
    },
    dadosUser: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
    },
    nivelData: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 30,
    },
    moedasData: {
        flexDirection: 'column',
        alignItems: 'center',
        // marginLeft: 30,
    },
    classData: {
        flexDirection: 'column',
        alignItems: 'center',
        // marginRight: 15
    },
    nivel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,

    },
    numero: {
        color: 'white',
        fontWeight: 'semibold',
        fontSize: 22
    },
    border: {
        borderColor: 'white',
        borderRightWidth: 2,
        height: 80
    },

    tabs: {
        marginTop: 20,
        flexDirection: 'row',
    },
    btnTab: {
        width: Dimensions.get("window").width / 2,
        padding: 14
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'center',
    },
    btnTabActive: {
        backgroundColor: '#F6F4F2',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
    btnTextActive: {
        color: '#6B6BA3',
    },
    containerInv: {
        width: '100%',
        // height: '67%',
        backgroundColor: '#F6F4F2',

    },

    sliderContainer: {
        position: 'absolute',
        flexDirection: 'row',
        width: '100%',
    },

    sliderName: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    sliderTxt: {
        alignSelf: 'center',
        paddingHorizontal: 5,
        fontSize: 18,
        color: '#A6A6A6'
    },


    sliderActive: {
        color: "#6B6BA3"
    },
    sliderTxtBorder: {
        borderRightWidth: 1,
        borderColor: "#6B6BA3",
    },

    containerAvatares: {
        marginVertical: 15
    },
    avatares: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginVertical: 5,
        marginHorizontal: 15,
    },
    avataresImage: {
        marginVertical: 5,
        backgroundColor: '#FFFFFF',
        width: 100,
        height: 100,
        borderRadius: 1000,
        borderStyle: 'solid',
        borderColor: "#D8D8D8",
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    containerBoosters: {
        marginVertical: 15
    },

    boosters: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    },

    // parte dos dados


    inputTxt: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '86%',
        marginTop: 20,
        paddingHorizontal: 15


    },
    inputTxt1: {
        marginTop: 30,
    },

    editIcon: {
        padding: 10,
        margin: 5,
        alignItems: 'center',
    },

    editarButton: {
        backgroundColor: '#FF6600',
        borderRadius: 10,
        width: '86%',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 40,
        paddingVertical: 14
    },
    editarTxt: {

        color: '#FFFFFF',
    },


    containerModal: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        blurRadius: 1
    },
    modal: {
        paddingVertical: 10,
        backgroundColor: '#F6F4F2',
        borderRadius: 30,
        width: '80%',
        height: '40%',
        alignItems: 'center',
    },

    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#353535',
        marginTop: 8
    },

    som: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 25
    },

    somTxt: {
        fontSize: 18,
        fontWeight: 'semibold',
        color: '#353535'
    },
    botaoLogout: {
        backgroundColor: '#FF6600',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        paddingVertical: 12,
        marginTop: 10
    },
    botaoCancelar: {
        backgroundColor: '#E3E3E3',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        paddingVertical: 12,
        marginTop: 10
    },
    botaoCancelarTxt: {
        color: '#353535',
        fontSize: 18
    },

    modalAvatarTxt: {
        marginHorizontal: 10,
        fontSize: 18,
        color: '#353535'
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
        color: '#353535',
        fontSize: 18
    },

});

export default Perfil;