import React from 'react';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

const Obstacles = ({
    color,
    obstaclesLeft,
    obstacleHeigth,
    obstacleWidth,
    gap,
    randomBottom
}) => {

    return (
        <>

            {/* retangulos normais, funcionam melhor do que os asteroides*/}

            {/* <View style={{
                position: 'absolute',
                backgroundColor: color,
                width: obstacleWidth,
                height: obstacleHeigth,
                left: obstaclesLeft,
                bottom: randomBottom + obstacleHeigth + gap,
            }}/>
            <View style={{
                position: 'absolute',
                backgroundColor: color,
                width: obstacleWidth,
                height: obstacleHeigth,
                left: obstaclesLeft,
                bottom: randomBottom,
            }}/> */}

             {/* asteroides */}

            <SvgUri uri="https://sonaligl.sirv.com/Images/asteroid1.svg"
                style={{
                    position: 'absolute',
                    width: obstacleWidth,
                    height: obstacleHeigth,
                    left: obstaclesLeft,
                    bottom: randomBottom + obstacleHeigth + gap,
                    
                }}
            />  
            <SvgUri uri="https://sonaligl.sirv.com/Images/asteroid1.svg"
                style={{
                    position: 'absolute',
                    width: obstacleWidth,
                    height: obstacleHeigth,
                    left: obstaclesLeft,
                    bottom: randomBottom,
                    
                }}
            />
        </>
    )
}

export default Obstacles;