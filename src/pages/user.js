import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default class User extends React.PureComponent {
    constructor(props) {
        super(props);
        this.back = this.back.bind(this);
    }

    back() {
        const { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.board}>
                    <Text style={styles.text}>User Center</Text>
                    <Button onPress={this.back} style={styles.button} title="返回" />
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