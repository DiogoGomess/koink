import React from 'react';
import { Text,ScrollView,View,StyleSheet,Image, Pressable} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Main from './screens/Main';
import Missoes from './screens/Missoes';
import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import Onboarding3 from './screens/Onboarding3';
import Minijogos from './screens/Minijogos';
import Perfil from './screens/Perfil';
import Store from './screens/Store';
import SelectQuizz from './screens/SelectQuizz';
import Quizz1 from './screens/Quizz1';
import Quizz2 from './screens/Quizz2';
import RocketPig from './screens/RocketPig';
import SplashScreen from './screens/SplashScreen';
import { LoggedUserProvider } from './src/LoggedUserContext';

const Stack = createNativeStackNavigator();



const App = () => {
  return (
    <LoggedUserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='SplashScreen' component={SplashScreen} />
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Register' component={Register} />
            <Stack.Screen name='Main' component={Main} />
            <Stack.Screen name='Onboarding1' component={Onboarding1} />
            <Stack.Screen name='Onboarding2' component={Onboarding2} />
            <Stack.Screen name='Onboarding3' component={Onboarding3} />
            <Stack.Screen name='Missoes' component={Missoes} />
            <Stack.Screen name='Minijogos' component={Minijogos} />
            <Stack.Screen name='Perfil' component={Perfil} />
            <Stack.Screen name='Store' component={Store} />
            <Stack.Screen name='SelectQuizz' component={SelectQuizz} />
            <Stack.Screen name='Quizz1' component={Quizz1} />
            <Stack.Screen name='Quizz2' component={Quizz2} />
            <Stack.Screen name='RocketPig' component={RocketPig} />
        </Stack.Navigator>
      </NavigationContainer>
    </LoggedUserProvider>
  );
};


export default App;
