/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    View,
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';


export default class App extends Component<Props> {

    onSuccess(e) {
        alert(e.data);

    }
    goBack(e) {
        alert(e.data);

    }

    render() {
        return (
            <View style={styles.container}>
                <QRCodeScanner
                    ref={(node) => {
                        this.scanner = node
                    }}
                    onRead={this.onSuccess.bind(this)}
                    reactivateTimeout={10}
                    cameraStyle={{marginBottom: 60}}
                    topContent={
                        <Text style={styles.centerText}>
                            扫描条码
                        </Text>
                    }
                    bottomContent={
                        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                            <TouchableOpacity style={styles.buttonTouchable}
                                              onPress={() => {
                                                  this.goBack();
                                              }}>
                                <Text style={styles.buttonText}>返回</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonTouchable}
                                              onPress={() => {
                                                  this.scanner.reactivate()
                                              }}>
                                <Text style={styles.buttonText}>重新扫描</Text>
                            </TouchableOpacity>
                        </View>

                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});
