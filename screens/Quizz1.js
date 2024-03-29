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
import { LoggedUserContext } from '../src/LoggedUserContext';


export default function Quizz1({ navigation }) {

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
    const [currentQuestion, setCurrentQuestion] = useState([]);
    const [remainingQuestions, setRemainingQuestions] = useState([]);


    async function getQuestions() {
        const response = await axios.get('https://koinkapi.onrender.com/quizzes/6411fc9746bef7259c07aedd');
        if (response.status == 200) {
            setallQuestions(response.data.quizz.questions)
            setRemainingQuestions(response.data.quizz.questions)

            let id = Math.floor(Math.floor(Math.random() * response.data.quizz.questions.length))
            setCurrentQuestion(response.data.quizz.questions[id])
            // console.log("Loaded first question: " + id);
            // console.log("Question: " + response.data.quizz.questions[id].question);

            // setRemainingQuestions(prevQuestions => prevQuestions.filter(index => index !== id));
            // console.log(remainingQuestions);

        }

    }



    async function getLevels() {
        const response = await axios.get('https://koinkapi.onrender.com/levels');
        if (response.status == 200) {
            setLevels(response.data.levels)
        }
    }




    async function updateRewards() {
        let token = await AsyncStorage.getItem('token');
        let userLevel = levels.find(level => level.number == loggedUser.level.number);
        setLoggedUser(async (prevState) => {
            let new_experience = loggedUser.level.experience + xpEarned
            let new_coins = loggedUser.coins + coinsEarned;
            if (new_experience >= userLevel.xpToNext) {
                console.log('subiu de nivel')
                let new_level = prevState.level.number + 1;
                setLoggedUser((prevState) => {
                    return {
                        ...prevState,
                        coins: new_coins,
                        level: {
                            number: new_level,
                            experience: new_experience
                        }
                    }
                })
                await axios.put(`https://koinkapi.onrender.com/users/${loggedUser._id}`, {
                    coins: new_coins,
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
                        coins: new_coins,
                        level: {
                            number: prevState.level.number,
                            experience: new_experience
                        }
                    }
                })

                await axios.put(`https://koinkapi.onrender.com/users/${loggedUser._id}`, {
                    coins: new_coins,
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
        // let correct_option = allQuestions[currentQuestionIndex]['correct'];
        let correct_option = currentQuestion['correct'];
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
        if (currentQuestionIndex == 3) {
            // Last Question
            // Show Score Modal
            setShowNextButton(false);
            setcoinsEarned(score * 100);
            setShowScoreModal(true);
            //await updateRewards();
        } else {
            // getQuestions()
            for (let i = remainingQuestions.length - 1; i >= 0; i--) {
                const index = remainingQuestions.findIndex(q => q._id === currentQuestion._id);
                if (index > -1) {
                    setCurrentQuestionIndex(currentQuestionIndex+1)
                    remainingQuestions.splice(index, 1);
                }
            }
            let id = Math.floor(Math.random() * remainingQuestions.length);
            setCurrentQuestion(remainingQuestions[id]);
            // console.log("length: " + RQ_CLONE.length);
            // setCurrentQuestionIndex(0);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            setShowNextButton(false);
        }
    }


    useEffect(() => {
        getQuestions();
        getLevels();
    }, []);


    useEffect(() => {
    }, [loggedUser]);



    return (
        <SafeAreaView>
            {loggedUser && currentQuestion && allQuestions &&
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
                            <Text style={styles.perguntaTxt}>{currentQuestion?.question}</Text>
                            {/* <Text style={styles.perguntaTxt}>{allQuestions[currentQuestionIndex]?.question}</Text>  */}
                        </View>
                    </View>
                    <View style={styles.numPerguntasContainer}>
                        <Text style={styles.numPerguntasTxt}>{currentQuestionIndex + 1}/4</Text>
                    </View>
                    <View style={styles.options}>
                        {
                            currentQuestion.options && currentQuestion?.options.map(option => (
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
                                <Pressable style={styles.modalJogar} onPress={() => { navigation.navigate('SelectQuizz'); updateRewards() }}>
                                    <Text style={styles.modalJogar.text}>Continuar</Text>
                                </Pressable>
                                <Pressable style={styles.modalSair} onPress={() => { navigation.navigate('Main'); updateRewards() }}>
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
                                        <Text style={{ color: '#353535',fontFamily:"Mulish-Regular", }}>Voltar</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <IconMaterial name="exit-to-app" size={80} color="#ff6600" style={styles.icon} onPress={() => navigation.navigate('Minijogos')}></IconMaterial>
                                        <Text style={{ color: '#353535', fontFamily:"Mulish-Regular", }}>Sair do Jogo</Text>
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
        fontFamily:"Ubuntu-Bold",

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
        fontFamily:"Mulish-Regular",
    },
    numPerguntasContainer: {
        alignItems: 'center',
        marginTop: 70
    },
    numPerguntasTxt: {
        fontFamily:"Mulish-Regular",
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
                fontFamily:"Mulish-Regular",
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
            fontFamily:"Mulish-Regular",
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
        fontFamily:"Ubuntu-Bold",
        color: '#353535',
        marginTop: 25
    },
    modalSubTitulo: {
        fontSize: 16,
        fontFamily:"Mulish-Regular",
        color: '#353535',
        marginTop: 8
    },
    modalCoins: {
        fontSize: 17,
        fontFamily:"Mulish-Regular",
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
            fontFamily:"Mulish-Regular",
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
            fontFamily:"Mulish-Regular",
            alignSelf: 'center',
            color: '#353535',
            fontSize: 17
        }
    },

    modalPauseTxt: {
        fontFamily:"Ubuntu-Bold",
        fontSize: 22,
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