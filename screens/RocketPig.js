import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Dimensions, Modal, TouchableWithoutFeedback, Pressable } from 'react-native';
import Obstacles from '../components/Obstacles';
import Rocket from '../components/Rocket';
import LinearGradient from 'react-native-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RocketPig( {navigation} ) {
  const screenWidth = Dimensions.get("screen").width
  const screenHeight = Dimensions.get("screen").height
  const pigLeft = screenWidth / 2
  const [pigBottom, setPigBottom] = useState(screenHeight/2)
  const [obstaclesLeft, setObstaclesLeft] = useState(screenWidth)
  const [obstaclesLeftTwo, setObstaclesLeftTwo] = useState(screenWidth + screenWidth / 2 + 30)
  const [obstaclesNegHeight, setObstaclesNegHeight] = useState(0) //mudar 0 para random 
  const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo] = useState(0)  //mudar 0 para random
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [coinsEarned, setcoinsEarned] = useState(0)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [modalPause, setModalPause] = useState(false)
  const obstacleWidth = 60
  const obstacleHeigth = 300
  const gap = 200
  const gravity = 3
  let gameTimerId
  let obstaclesLeftTimerId
  let obstaclesLeftTimerIdTwo
  

  
  //pig falling 
  useEffect(() => {
    if (pigBottom > 0) {
      gameTimerId = setInterval(() => {
        setPigBottom(pigBottom => pigBottom - gravity)
      },30)

      return () => {
        clearInterval(gameTimerId)
      }
    }
  }, [pigBottom])

  const jump = () => {
    if (!isGameOver && (pigBottom < screenHeight)) {
      setPigBottom(pigBottom => pigBottom + 50)
      console.log('jumped')
    }
  }

  //pig first obstacles
  useEffect(() => {
    if (obstaclesLeft > -obstacleWidth) {
      obstaclesLeftTimerId = setInterval(() => {
        setObstaclesLeft(obstaclesLeft => obstaclesLeft - 7)
      },30)
      return () => {
        clearInterval(obstaclesLeftTimerId)
      }
    } else {
      setScore(score => score + 1)
      setObstaclesLeft(screenWidth)
      setObstaclesNegHeight( - Math.random() * 100)
    }
  }, [obstaclesLeft])

  //pig second obstacles
  useEffect(() => {
    if (obstaclesLeftTwo > - obstacleWidth) {
      obstaclesLeftTimerIdTwo = setInterval(() => {
        setObstaclesLeftTwo(obstaclesLeftTwo => obstaclesLeftTwo - 7)
      },30)
      return () => {
        clearInterval(obstaclesLeftTimerIdTwo)
      }
    } else {
      setScore(score => score + 1)
      setObstaclesLeftTwo(screenWidth)
      setObstaclesNegHeightTwo( - Math.random() * 100)
    }
  }, [obstaclesLeftTwo])

  // os primeiros obstaculos(cima e baixo) não contam as colissões porque já estão renderizados na na pagina 
  // as colissoes só dão na parte esquerda de cada obstaculo
  // de vez em quando certos obstaculos não há colissões de todo, mas no proximo objeto dá sempre

  //collisions                                              
  useEffect(() => {
    if (
    ((pigBottom  < (obstacleHeigth + obstaclesNegHeight + (-10)) ||
    pigBottom > (obstacleHeigth + obstaclesNegHeight + gap - (-10))) &&
    (obstaclesLeft > screenWidth/2 - (-10) && obstaclesLeft < screenWidth/2 + (-10)))
    ||
    ((pigBottom  < (obstacleHeigth + obstaclesNegHeightTwo + 30) ||
    pigBottom > (obstacleHeigth + obstaclesNegHeightTwo + gap - 30)) &&
    (obstaclesLeftTwo > screenWidth/2 - 30 && obstaclesLeftTwo < screenWidth/2 + 30)))
    {
      
      gameOver()
      console.log('----');
      console.log('----');
      console.log('----');
      console.log('game over')
      console.log('cima -> ' + obstaclesLeftTwo)
      console.log('baixo -> ' + obstaclesLeft)
      console.log('leitao -> ' + pigBottom)
      console.log('score -> ' + score);
    }
  })

const gameOver = () => {
  clearInterval(gameTimerId)
  clearInterval(obstaclesLeftTimerId)
  clearInterval(obstaclesLeftTimerIdTwo)
  setIsGameOver(true)
  setShowScoreModal(true)
}

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0300BC', '#00002C']}
          style={styles.linearGradient}
        ></LinearGradient>
        <View style={styles.navbar}>
          <Text style={styles.pontuacao}>Pontuação: {score}</Text>
          <Icon name="pause-circle" size={40} color="#fff" onPress={() => setModalPause(true)}></Icon>
        </View>

        {/* Modal de fim do jogo */}

        <Modal
          animationType="slide"
          visible={showScoreModal}
          transparent={true}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
          >
          <BlurView intensity={100} tint='dark' style={styles.containerModal}>
            <View style={styles.modal}>
              <Text style={styles.modalTitulo}>Pontuação: {score}</Text>
              <Text style={styles.modalCoins}>Ganhaste <Text style={{ color: '#FF6600' }}>{coinsEarned}</Text> coins!</Text>
              <Pressable style={styles.modalJogar} onPress={() => navigation.navigate('Minijogos')}>
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
            <View style={[styles.modal, {height:200}]}>
              <Text style={styles.modalPauseTxt}>Pausa</Text>
              <View style={styles.containerIcons}>
                <View style={{alignItems:'center'}}>
                  <IconAntDesign name="closesquareo" size={80} color="#ff6600" style={styles.icon} onPress={() => setModalPause(false)}></IconAntDesign>
                  <Text>Voltar</Text>
                </View>
                <View  style={{alignItems:'center'}}>
                  <IconMaterial name="exit-to-app" size={80} color="#ff6600" style={styles.icon}  onPress={() => navigation.navigate('Minijogos')}></IconMaterial>
                  <Text>Sair do Jogo</Text>
                </View>
              </View>
            </View>
          </BlurView>
        </Modal>
        <Rocket 
          pigBottom={pigBottom}
          pigLeft={pigLeft}
        />
        <Obstacles
        color={'#82543F'}
          obstaclesLeft={obstaclesLeft}
          obstacleWidth={obstacleWidth}
          randomBottom={obstaclesNegHeight}
          obstacleHeigth={obstacleHeigth}
          gap={gap}
        />
        <Obstacles
          color={'#82543F'}
          obstacleWidth={obstacleWidth}
          obstacleHeigth={obstacleHeigth}
          randomBottom={obstaclesNegHeightTwo}
          gap={gap}
          obstaclesLeft={obstaclesLeftTwo}
        />
      </View>
    </TouchableWithoutFeedback>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 40,
    alignItems: 'center',
    zIndex: 1
  },
  pontuacao: {
    color: '#f6f4f2',
    fontSize: 22,
    fontWeight: 'bold',
    zIndex: 1
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
  modalPauseTxt:{
    fontSize: 22,
    fontWeight: 'bold',
    color: '#353535',
    marginTop:20
  },
  containerIcons:{
    flexDirection:'row',
    width: '100%',
    flex:1,
    justifyContent: 'space-around',
    alignItems: 'center',
  }
})

