import React, { Component } from 'react';
import { View, Text, AppRegistry, StyleSheet, AsyncStorage } from 'react-vr';

import Shape, { shapes } from './vr/components/Shape';

class ShapeGameEB extends Component {

    constructor() {
        super();

        this.state = {
            gameShapes: [1,1,1,1],
            score: 0,
            specialIndex: 0
        }
    }

    newGameSet() {
        console.log('New game set');

        let baseShapeId = Math.floor(Math.random() * shapes.length);

        console.log('baseShapeId', baseShapeId);

        let specialShapeId = baseShapeId;

        while(specialShapeId === baseShapeId) {
            specialShapeId = Math.floor(Math.random() * shapes.length);
        }

        console.log('specialShapeId', specialShapeId);

        let newGameShapes = [];

        for(let i=0; i<this.state.gameShapes.length; i++) {
            newGameShapes[i] = baseShapeId;
        }

        let specialIndex = Math.floor(Math.random() * newGameShapes.length);

        newGameShapes[specialIndex] = specialShapeId;

        console.log('newGameShapes', newGameShapes);

        this.setState({
            gameShapes: newGameShapes,
            specialIndex: specialIndex
        });
    }

    componentDidMount() {
        AsyncStorage.getItem('score').then(value => {
            console.log('score', value);
            this.setState({score: value});
        })

        this.newGameSet();
    }

    pickShape(shapeIndex) {
        console.log('shapeIndex', shapeIndex);

        let score = this.state.score;

        score = this.state.specialIndex === shapeIndex ? score + 1 : score - 1;

        this.setState({score});

        AsyncStorage.setItem('score', score);

        this.newGameSet();
    }

    render() {
        return(
            <View style={styles.game}>
                <Text style={styles.text}>Find the odd shape!</Text>
                <Text style={styles.text}>{this.state.score}</Text>
                {
                    this.state.gameShapes.map((shape, index) => {
                        return(
                            <View
                                key={index}
                                onEnter={() => this.pickShape(index)}
                            >
                                <Shape
                                    shapeNum={shape}
                                    colorNum={index}
                                    transform={[{translate: [(index-1.5)*1.5, 0, -5]}]}
                                />
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    game: {
        transform: [
            {translate: [-2.25, 0, 0]}
        ]
    },
    text: {
        fontSize: 0.5,
        textAlign: 'center',
        color: '#fff',
        transform: [
          {translate: [0, 2, -5]}
        ]
    }
});

AppRegistry.registerComponent('ShapeGameEB', () => ShapeGameEB);
