import React from 'react';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

const Rocket = ({pigBottom, pigLeft}) => {
    const pigWidth = 143
    const pigHeigth = 151

    return (

        // retangulo normal 

        // <View style={{
        //     position: 'absolute',
        //     backgroundColor: 'blue',
        //     width: 50,
        //     height: 60,
        //     left: pigLeft - (pigWidth/2),
        //     bottom: pigBottom - (pigHeigth/2)
        // }}/>

        // koink

        <SvgUri 
            width="143" 
            height="151"
            uri="https://sonaligl.sirv.com/Images/KoinkVoador.svg"
            style={{
                position: 'absolute',
                left: pigLeft - (pigWidth/2),
                bottom: pigBottom - (pigHeigth/2),
                // backgroundColor: 'red'
            }}
        />
    )
}

export default Rocket;