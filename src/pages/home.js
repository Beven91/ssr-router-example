import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        this.goUserCenter = this.goUserCenter.bind(this);
    }

    goUserCenter() {
        const { navigation } = this.props;
        if (navigation) {
            navigation.navigate('User');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.board}>
                    <Text style={styles.text}>Welcome to our site!</Text>
                    <Button onPress={this.goUserCenter} style={styles.button} title="跳转到用户中心" />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        marginBottom: 30,
    },
    board: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        width: 300,
    }
});