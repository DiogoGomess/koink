import React, { useState, useEffect, useContext } from 'react';
import { Animated, ImageBackground, Text, Modal, ScrollView, View, StyleSheet, Image, Pressable, Button, TouchableNativeFeedback, TextInput, Dimensions, Alert } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
// import { set } from 'vue/types/umd';
import {LoggedUserContext} from '../src/LoggedUserContext';



export default function Quizz2({ navigation }) {

    const [allQuestions, setallQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [correctOption, setCorrectOption] = useState(null);
    const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
    const [score, setScore] = useState(0)
    const [coinsEarned, setcoinsEarned] = useState(0)
    const [xpEarned, setxpEarned] = useState(0)
    const [showNextButton, setShowNextButton] = useState(false)
    const [showScoreModal, setShowScoreModal] = useState(false)
    const [modalPause, setModalPause] = useState(false)
    const [levels, setLevels] = useState(null);
    const { loggedUser, setLoggedUser } = useContext(LoggedUserContext);

    async function getQuestions() {
        const response = await axios.get('https://koink-api.onrender.com/quizzes/63c9b24ff4fae54f17485920');
        if (response.status == 200) {
            setallQuestions(response.data.quizz.questions)
        }
    }

    async function getLevels() {
        const response = await axios.get('https://koink-api.onrender.com/levels');
        if (response.status == 200) {
            setLevels(response.data.levels)
        }
    }


    async function updateRewards() {
        let token = await AsyncStorage.getItem('token');
        let userLevel = levels.find(level => level.number == loggedUser.level.number);
        setLoggedUser(async (prevState) => {

            let new_experience = loggedUser.level.experience + xpEarned

            if (new_experience >= userLevel.xpToNext) {
                console.log('subiu de nivel')
                let new_level = prevState.level.number++;
                setLoggedUser((prevState) => {
                    return {
                        ...prevState,
                        coins: prevState.coins + coinsEarned,
                        level: {
                            number: new_level,
                            experience: new_experience
                        }
                    }
                })
                await axios.put(`https://koink-api.onrender.com/users/${loggedUser._id}`, {
                    coins: prevState.coins + coinsEarned,
                    level: {
                        number: new_level,
                        experience: new_experience
                    }
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
            } else {
                setLoggedUser((prevState) => {
                    console.log('nao subiu de nivel')
                    return {
                        ...prevState,
                        coins: prevState.coins + coinsEarned,
                        level: {
                            number: prevState.level.number,
                            experience: new_experience
                        }
                    }
                })
        
                await axios.put(`https://koink-api.onrender.com/users/${loggedUser._id}`, {
                    coins: prevState.coins + coinsEarned,
                    level: {
                        number: prevState.level.number,
                        experience: new_experience
                    }
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
            }
        })
        
    }

    const validateAnswer = (selectedOption) => {
        let correct_option = allQuestions[currentQuestionIndex]['correct'];
        setCurrentOptionSelected(selectedOption);
        setCorrectOption(correct_option);
        setIsOptionsDisabled(true);
        if (selectedOption == correct_option) {
            // Set Score
            setScore(score + 1)
            setcoinsEarned(score * 100)
            setxpEarned(xpEarned => xpEarned + 20)
        }
        // Show Next Button
        setShowNextButton(true)
    }

    async function handleNext() {
        if (currentQuestionIndex == allQuestions.length - 1) {
            // Last Question
            // Show Score Modal
            setShowNextButton(false);
            setcoinsEarned(score * 100);
            setShowScoreModal(true);
            await updateRewards();
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            setShowNextButton(false);
        }
    }


    useEffect(() => {
        getQuestions();
        getLevels();
    },[]);

    useEffect(() => {
    }, [loggedUser]);



    return (
        <SafeAreaView>
            {loggedUser && allQuestions &&
                <SafeAreaView style={styles.container}>
                    <LinearGradient
                        colors={['#0075FF', '#0E41A6', '#430B89']}
                        style={styles.linearGradient}
                    ></LinearGradient>

                    <View style={styles.navbar}>
                        <Text style={styles.pontuacaoTxt}>Pontuação: {score}</Text>
                        <Icon name="pause-circle" size={40} color="#fff" onPress={() => setModalPause(true)}></Icon>
                    </View>
                    <View style={styles.imageQuizz}>
                        <SvgUri style={{ marginLeft: 30 }} width='250' height='250' uri="https://rapedolo.sirv.com/koink/koinkPergunta.svg" />
                        <View style={[styles.containerPergunta, { transform: [{ rotate: '2deg' }] }]}></View>
                        <View style={[styles.containerPergunta, { transform: [{ rotate: '-2deg' }] }]}></View>
                        <View style={styles.containerPergunta}>
                            <Text style={styles.perguntaTxt}>{allQuestions[currentQuestionIndex]?.question}</Text>
                        </View>
                    </View>
                    <View style={styles.numPerguntasContainer}>
                        <Text style={styles.numPerguntasTxt}>{currentQuestionIndex + 1}/4</Text>
                    </View>
                    <View style={styles.options}>
                        {
                            allQuestions[currentQuestionIndex]?.options.map(option => (
                                <Pressable
                                    onPress={() => validateAnswer(option)}
                                    disabled={isOptionsDisabled}
                                    style={[styles.options.box, {
                                        backgroundColor: option == correctOption
                                            ? '#1EC64D'
                                            : option == currentOptionSelected
                                                ? '#FA1A1A'
                                                : '#FFFFFF'
                                    }]}
                                    key={option}
                                >
                                    <Text style={[styles.options.box.text, {
                                        color: option == correctOption
                                            ? '#FFFFFF'
                                            : option == currentOptionSelected
                                                ? '#FFFFFF'
                                                : '#353535'
                                    }
                                    ]}>{option}</Text>
                                </Pressable>
                            ))
                        }
                    </View>
                    <View>
                        {showNextButton == true &&
                            <Pressable style={styles.next} onPress={handleNext}>
                                {currentQuestionIndex == allQuestions.length - 1 ?
                                    <Text style={styles.next.text}>Finalizar</Text>
                                    :
                                    <Text style={styles.next.text}>Próxima</Text>
                                }
                            </Pressable>
                        }
                    </View>
                    <Modal
                        animationType="slide"
                        visible={showScoreModal}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            //setModalVisible(!modalVisible);
                        }}
                    >
                        <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                            <View style={styles.modal}>
                                <Text style={styles.modalTitulo}>Pontuação: {score}/{allQuestions.length}</Text>
                                <Text style={styles.modalCoins}>Ganhaste <Text style={{ color: '#FF6600' }}>{coinsEarned}</Text> coins!</Text>
                                <Pressable style={styles.modalJogar} onPress={() => navigation.navigate('SelectQuizz')}>
                                    <Text style={styles.modalJogar.text}>Continuar</Text>
                                </Pressable>
                                <Pressable style={styles.modalSair} onPress={() => navigation.navigate('Main')}>
                                    <Text style={styles.modalSair.text}>Sair do Jogo</Text>
                                </Pressable>
                            </View>
                        </BlurView>
                    </Modal>


                    {/* Modal de Pausa */}
                    <Modal
                        animationType="slide"
                        visible={modalPause}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalPause(!modalPause);
                        }}
                    >
                        <BlurView intensity={100} tint='dark' style={styles.containerModal}>
                            <View style={[styles.modal, { height: 200 }]}>
                                <Text style={styles.modalPauseTxt}>Pausa</Text>
                                <View style={styles.containerIcons}>
                                    <View style={{ alignItems: 'center' }}>
                                        <IconAntDesign name="closesquareo" size={80} color="#ff6600" style={styles.icon} onPress={() => setModalPause(false)}></IconAntDesign>
                                        <Text>Voltar</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <IconMaterial name="exit-to-app" size={80} color="#ff6600" style={styles.icon} onPress={() => navigation.navigate('Minijogos')}></IconMaterial>
                                        <Text>Sair do Jogo</Text>
                                    </View>
                                </View>
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
    pontuacaoTxt: {
        color: '#f6f4f2',
        fontSize: 22,
        fontWeight: 'bold'

    },
    imageQuizz: {
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
    numPerguntasContainer: {
        alignItems: 'center',
        marginTop: 70
    },
    numPerguntasTxt: {
        color: '#F6F4f2',
        fontSize: 18
    },
    options: {
        marginTop: 8,
        justifyContent: 'center',
        box: {
            marginVertical: 8,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '80%',
            height: 51,
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            text: {
                width: '95%',
                textAlign: 'center',
                alignSelf: 'center',
                color: '#353535',
                fontSize: 17
            }
        }
    },
    next: {
        marginTop: 5,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '50%',
        height: 51,
        backgroundColor: '#FF6600',
        borderRadius: 10,
        text: {
            //textAlign: 'center',
            alignSelf: 'center',
            color: '#FFFFFF',
            fontSize: 16
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
        backgroundColor: '#F6F4F2',
        borderRadius: 30,
        width: '95%',
        height: 325,
        alignItems: 'center',
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#353535',
        marginTop: 25
    },
    modalSubTitulo: {
        fontSize: 16,
        fontWeight: 'light',
        color: '#353535',
        marginTop: 8
    },
    modalCoins: {
        fontSize: 17,
        fontWeight: 'light',
        color: '#353535',
        marginTop: 30
    },
    modalJogar: {
        justifyContent: 'center',
        marginTop: 38,
        backgroundColor: '#FF6600',
        width: 215,
        height: 41,
        borderRadius: 10,
        text: {
            alignSelf: 'center',
            color: '#ffffff',
            fontSize: 17
        }
    },
    modalSair: {
        justifyContent: 'center',
        marginTop: 15,
        backgroundColor: '#E3E3E3',
        width: 215,
        height: 41,
        borderRadius: 10,
        text: {
            alignSelf: 'center',
            color: '#353535',
            fontSize: 17
        }
    },

    modalPauseTxt: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#353535',
        marginTop: 20
    },

    containerIcons: {
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    }

})