import React, { useState, useEffect, useContext } from 'react';
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
import { LoggedUserContext } from '../src/LoggedUserContext';

const ListTab = [
    {
        tipo: 'Avatares'
    },
    {
        tipo: 'Boosts'
    }
]

export default function Store({ navigation }) {
    const [tipo, setTipo] = useState('Avatares')
    const [modalAvatar, setModalAvatar] = useState(false);
    const [modalBooster, setModalBooster] = useState(false);
    const [modalComplete, setModalComplete] = useState(false);
    const [avatars, setAvatars] = useState(null);
    const [boosters, setBoosters] = useState(null);
    const [activeAvatar, setActiveAvatar] = useState(null);
    const [activeBooster, setActiveBooster] = useState(null);
    const { loggedUser, setLoggedUser } = useContext(LoggedUserContext);


    const setTipoFilter = tipo => {
        setTipo(tipo)
    }

    async function getAvatars() {
        const response = await axios.get('https://koink-api.onrender.com/avatars');
        if (response.status == 200) {
            setAvatars(response.data.avatars)
            console.log(response.data.avatars);
        }
    }

    async function getBoosters() {
        const response = await axios.get('https://koink-api.onrender.com/boosters');
        if (response.status == 200) {
            setBoosters(response.data.boosters)
            //console.log(response.data.avatars);
        }
    }


    async function renderModalAvatar(id) {
        const avatar = await axios.get(`https://koink-api.onrender.com/avatars/${id}`);
        //console.log(avatar.data);
        setActiveAvatar(avatar.data[0]);

        setModalAvatar(true);
    }

    async function renderModalBooster(id) {
        const booster = await axios.get(`https://koink-api.onrender.com/boosters/${id}`);
        console.log(booster);
        setActiveBooster(booster.data[0]);

        setModalBooster(true);
    }

    async function buyAvatar(avatar) {
        let token = await AsyncStorage.getItem('token');
        await axios.put(`https://koink-api.onrender.com/users/${loggedUser._id}/avatars/${avatar._id}`, {}, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        await axios.put(`https://koink-api.onrender.com/users/${loggedUser._id}`, {
            coins: loggedUser.coins - avatar.price
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        setLoggedUser((prevState) => {
            return {
                ...prevState,
                avatars: prevState.inventory.avatars.push(avatar),
                coins: loggedUser.coins - avatar.price
            }
        })
        setModalAvatar(false);
        //setModalBooster(false);
        setModalComplete(true)

    }

    async function buyBooster(booster) {
        let token = await AsyncStorage.getItem('token');
        await axios.put(`https://koink-api.onrender.com/users/${loggedUser._id}/boosters/${booster._id}`, {}, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        await axios.put(`https://koink-api.onrender.com/users/${loggedUser._id}`, {
            coins: loggedUser.coins - booster.price
        }, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        setLoggedUser((prevState) => {
            return {
                ...prevState,
                boosters: prevState.inventory.boosters.push(booster),
                coins: loggedUser.coins - booster.price
            }
        })
        //setModalAvatar(false);
        setModalBooster(false);
        setModalComplete(true)

    }

    useEffect(() => {
        getAvatars();
        getBoosters();
    }, [loggedUser]);

    return (
        <SafeAreaView>
            {loggedUser && avatars &&
                <SafeAreaView style={[styles.container, modalAvatar === true || modalBooster === true && styles.containerBlur]}>
                    <LinearGradient
                        colors={['#0075FF', '#0E41A6', '#430B89']}
                        style={styles.linearGradient}
                    ></LinearGradient>
                    <View style={styles.navbar}>
                        <Icon name="chevron-back" size={30} color="#fff" style={styles.icon} onPress={() => navigation.navigate('Main')}></Icon>
                        <View style={styles.containerMoedas}>
                            <Text style={styles.numMoedas}>{loggedUser.coins}</Text>
                            <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                        </View>
                    </View>
                    <View style={styles.containerTitle}>
                        <Text style={styles.titleTxt}>Loja</Text>
                    </View>
                    <View style={styles.tabs}>
                        {ListTab.map((tab, index) => (
                            <Pressable key={index} style={[styles.btnTab, tipo === tab.tipo && styles.btnTabActive]} onPress={() => setTipoFilter(tab.tipo)}>
                                <Text style={[styles.btnText, tipo === tab.tipo && styles.btnTextActive]}>{tab.tipo}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <ScrollView style={styles.containerLoja}>
                        {tipo == 'Avatares' &&
                            <View style={{ marginBottom: 50 }}>
                                <View style={styles.avatares}>
                                    {
                                        avatars.map((avatar) => {
                                            return (
                                                <View key={avatar._id} style={styles.avatarInfo}>
                                                    <View style={styles.avataresImage}>
                                                        <SvgUri width='80' height='80' uri={avatar.image} />
                                                    </View>
                                                    <View style={styles.avatarPreco}>
                                                        <Text style={styles.avatarPrecoTxt}>{avatar.price}</Text>
                                                        <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                                                    </View>
                                                    {loggedUser.level.number >= avatar.unlockedAt && loggedUser.coins >= avatar.price ?
                                                        <Pressable style={styles.botaoComprar} onPress={() => renderModalAvatar(avatar._id)}>
                                                            <Text style={styles.botaoComprarTxt}>Comprar</Text>
                                                        </Pressable>
                                                        :
                                                        <Pressable style={styles.botaoBloqueado}>
                                                            <Text style={styles.botaoBloqueado.text}>Bloqueado</Text>
                                                        </Pressable>
                                                    }
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        }

                        {/* Compra de Boosters */}

                        {tipo == 'Boosts' &&
                            <View style={{ marginBottom: 50 }}>
                                <View style={styles.avatares}>
                                    {
                                        boosters.map((booster) => {
                                            return (
                                                <View key={booster._id} style={styles.avatarInfo}>
                                                    <View style={styles.avataresImage}>
                                                        <SvgUri width='80' height='80' uri={booster.image} />
                                                    </View>
                                                    <View style={styles.avatarPreco}>
                                                        <Text style={styles.avatarPrecoTxt}>{booster.price}</Text>
                                                        <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                                                    </View>
                                                    {loggedUser.level.number >= booster.unlockedAt && loggedUser.coins >= booster.price ?
                                                        <Pressable style={styles.botaoComprar} onPress={() => renderModalBooster(booster._id)}>
                                                            <Text style={styles.botaoComprarTxt}>Comprar</Text>
                                                        </Pressable>
                                                        :
                                                        <Pressable style={styles.botaoBloqueado}>
                                                            <Text style={styles.botaoBloqueado.text}>Bloqueado</Text>
                                                        </Pressable>
                                                    }
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            // <View style={{ marginBottom: 50 }}>
                            //     <View style={styles.avatares}>
                            //         <View style={styles.avatarInfo}>
                            //             <View style={styles.avataresImage}>
                            //                 <SvgUri width="800" height="800" uri="https://sonaligl.sirv.com/Images/boostCoins.svg" />
                            //             </View>
                            //             <View style={styles.avatarPreco}>
                            //                 <Text style={styles.avatarPrecoTxt}>2.500</Text>
                            //                 <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                            //             </View>
                            //             <Pressable style={styles.botaoComprar}>
                            //                 <Text style={styles.botaoComprarTxt}>Comprar</Text>
                            //             </Pressable>
                            //         </View>
                            //         <View style={styles.avatarInfo}>
                            //             <View style={styles.avataresImage}>
                            //                 <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                            //             </View>
                            //             <View style={styles.avatarPreco}>
                            //                 <Text style={styles.avatarPrecoTxt}>2.500</Text>
                            //                 <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                            //             </View>
                            //             <Pressable style={styles.botaoComprar}>
                            //                 <Text style={styles.botaoComprarTxt}>Comprar</Text>
                            //             </Pressable>
                            //         </View>

                            //     </View>
                            //     <View style={styles.avatares}>
                            //         <View style={styles.avatarInfo}>
                            //             <View style={styles.avataresImage}>
                            //                 <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                            //             </View>
                            //             <View style={styles.avatarPreco}>
                            //                 <Text style={styles.avatarPrecoTxt}>2.500</Text>
                            //                 <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                            //             </View>
                            //             <Pressable style={styles.botaoComprar}>
                            //                 <Text style={styles.botaoComprarTxt}>Comprar</Text>
                            //             </Pressable>
                            //         </View>
                            //         <View style={styles.avatarInfo}>
                            //             <View style={styles.avataresImage}>
                            //                 <SvgUri width='80' height='80' uri="https://rapedolo.sirv.com/koink/KoinkIntelectual.svg" />
                            //             </View>
                            //             <View style={styles.avatarPreco}>
                            //                 <Text style={styles.avatarPrecoTxt}>2.500</Text>
                            //                 <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                            //             </View>
                            //             <Pressable style={styles.botaoComprar}>
                            //                 <Text style={styles.botaoComprarTxt}>Comprar</Text>
                            //             </Pressable>
                            //         </View>

                            //     </View>
                            // </View>
                        }
                    </ScrollView>


                    {activeAvatar && 
                        <Modal
                            animationType="slide"
                            visible={modalAvatar}
                            transparent={true}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                setModalAvatar(!modalAvatar);
                            }}
                        >
                            <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                                <View style={styles.modal}>
                                    <View style={styles.avatarCompraInfo}>
                                        <View style={styles.avataresCompraImage}>
                                            <SvgUri width='120' height='120' uri={activeAvatar.image} />
                                        </View>
                                        <Text style={styles.avatarCompraPrecoTxt}>Avatar {activeAvatar.name}</Text>
                                        <View style={styles.avatarCompraPreco}>
                                            <Text style={styles.avatarCompraPrecoTxt}>{activeAvatar.price}</Text>
                                            <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                                        </View>
                                        <Pressable style={styles.botaoCompraFinal} onPress={() => buyAvatar(activeAvatar)}>
                                            <Text style={styles.botaoCompraFinalTxt}>Comprar</Text>
                                        </Pressable>
                                        <Pressable style={styles.botaoCancelar} onPress={() => setModalAvatar(false)}>
                                            <Text style={styles.botaoCancelarTxt}>Cancelar</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </BlurView>
                        </Modal>
                    }

                    {activeBooster && 
                        <Modal
                            animationType="slide"
                            visible={modalBooster}
                            transparent={true}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                setModalBooster(!modalBooster);
                            }}
                        >
                            <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                                <View style={styles.modal}>
                                    <View style={styles.avatarCompraInfo}>
                                        <View style={styles.avataresCompraImage}>
                                            <SvgUri width='120' height='120' uri={activeBooster.image} />
                                        </View>
                                        <Text style={styles.avatarCompraPrecoTxt}>{activeBooster.name}</Text>
                                        <View style={styles.avatarCompraPreco}>
                                            <Text style={styles.avatarCompraPrecoTxt}>{activeBooster.price}</Text>
                                            <SvgUri style={{ marginRight: 10 }} width='21' height='21' uri="https://rapedolo.sirv.com/koink/coin.svg" />
                                        </View>
                                        <Pressable style={styles.botaoCompraFinal} onPress={() => buyBooster(activeBooster)}>
                                            <Text style={styles.botaoCompraFinalTxt}>Comprar</Text>
                                        </Pressable>
                                        <Pressable style={styles.botaoCancelar} onPress={() => setModalBooster(false)}>
                                            <Text style={styles.botaoCancelarTxt}>Cancelar</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </BlurView>
                        </Modal>
                    }   

                    {/* Modal sucesso de compra */}
                    <Modal
                        animationType="slide"
                        visible={modalComplete}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalComplete(!modalComplete);
                        }}
                    >
                        <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                            <View style={[styles.modal, { height: '40%' }]}>
                                <View style={{ marginVertical: 20 }}>
                                    <SvgUri width='150' height='150' uri='https://rapedolo.sirv.com/koink/koinkFestivo.svg' />
                                </View>
                                <Text style={styles.modalAvatarTxt}>Item comprado com sucesso!</Text>
                                <TouchableNativeFeedback onPress={() => setModalComplete(false)}>
                                    <View style={[styles.buttonAvatarModal]}>
                                        <Text style={[styles.buttonAvatarModalTxt, { color: '#FFFFFF' }]}>Voltar</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </BlurView>
                    </Modal>
                </SafeAreaView>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },

    containerBlur: {
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

    containerTitle: {
        marginTop: 70,
        width: '100%',
        alignItems: 'center',
    },

    titleTxt: {
        backgroundColor: '#ffffff',
        color: '#353535',
        paddingHorizontal: 70,
        paddingVertical: 15,
        fontSize: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },

    tabs: {
        flexDirection: 'row',
    },
    btnTab: {
        width: Dimensions.get("window").width / 2,
        padding: 14,
        backgroundColor: '#FFFFFF',
    },
    btnText: {
        color: '#353535',
        fontSize: 18,
        alignSelf: 'center',
    },
    btnTabActive: {
        backgroundColor: '#FF6600',
        // borderTopRightRadius: 5,
        // borderTopLeftRadius: 5,
    },
    btnTextActive: {
        color: '#FFFFFF',
    },

    containerLoja: {
        height: '100%',
        backgroundColor: '#F6F4F2',
        paddingTop: 40
    },
    avatares: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginVertical: -10,
    },

    avataresImage: {
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

    avatarInfo: {
        alignItems: 'center',
        marginVertical: 10
    },

    avatarPreco: {
        width: 100,
        marginVertical: 10,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    avatarPrecoTxt: {
        color: '#353535',
        fontSize: 18
    },
    botaoComprar: {
        backgroundColor: '#FF6600',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 12,
    },
    botaoComprarTxt: {
        color: '#ffffff',
        fontSize: 18
    },

    botaoBloqueado: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        text: {
            color: '#353535',
            fontSize: 18
        }
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
        height: '60%',
        alignItems: 'center',
    },

    avatarCompraInfo: {
        alignItems: 'center',
    },
    avataresCompraImage: {
        backgroundColor: '#FFFFFF',
        width: 150,
        height: 150,
        borderRadius: 1000,
        borderStyle: 'solid',
        borderColor: "#D8D8D8",
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    avatarCompraPreco: {
        width: 100,
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    avatarCompraPrecoTxt: {
        color: '#353535',
        fontSize: 18
    },

    botaoCompraFinal: {
        backgroundColor: '#FF6600',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 70,
        paddingVertical: 12,
        marginBottom: 10
    },
    botaoCompraFinalTxt: {
        color: '#ffffff',
        fontSize: 18
    },

    botaoCancelar: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 70,
        paddingVertical: 12,
        marginTop: 10
    },
    botaoCancelarTxt: {
        color: '#353535',
        fontSize: 18
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

    modalAvatarTxt: {
        marginHorizontal: 10,
        fontSize: 18,
        color: '#353535'
    },

})