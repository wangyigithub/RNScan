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
    Button,
    TextInput,
    Dimensions
} from 'react-native';
import {createAppContainer, createStackNavigator,} from 'react-navigation';
import QRCodeScanner from 'react-native-qrcode-scanner';

var screenWidth = Dimensions.get('window').width;

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: '洗衣郎扫码',
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            number: 0,
        };
    }

    render() {
        const itemId=this.state.text;
        if (this.state.number === 0) {
            return (
                <View style={{flex: 1, alignItems: 'center',}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                        <Text>
                            {'请输入批次号码：'}
                        </Text>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1, marginLeft: 5, flex: 1,color: 'red'}}
                            onChangeText={(text) => this.setState({text})}
                            value={itemId}
                        />
                    </View>
                    <View style={{
                        width: screenWidth - 200,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 20,
                    }}>
                        <Button
                            title="去扫描"
                            onPress={() => {
                                this.props.navigation.navigate('Details',{
                                      callback: (backdata) => {
                                       this.setState({
                                           text:backdata,
                                       })
                                    }
                                })
                            }}
                        />
                        <Button
                            title="去查询"
                            onPress={() => {
                                if (itemId === '' || itemId === '没有批次号') return;
                                this.fechData(itemId);
                            }}
                        />
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center',}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                        <Text>
                            {'请输入批次号码：'}
                        </Text>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1, marginLeft: 5, flex: 1}}
                            onChangeText={(text) => this.setState({text})}
                            value={itemId}
                        />
                    </View>
                    <Text style={{flexDirection: 'row', alignItems: 'center'}}>
                        批次号：<Text style={{color: 'red'}}> {itemId}</Text>
                    </Text>
                    <View style={{
                        width: screenWidth - 200,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 20,
                    }}>
                        <Button
                            title="去扫描"
                            onPress={() => {
                                this.props.navigation.navigate('Details')
                            }}
                        />
                        <Button
                            title="去查询"
                            onPress={() => {
                                if (itemId === '' || itemId === null||itemId===undefined) return;
                                this.fechData(itemId);
                            }}
                        />
                    </View>
                    <Text style={{marginTop: 40, width: screenWidth,}}>杆号：<Text
                        style={{color: 'red', fontSize: 24, fontWeight: 'bold'}}> {this.state.number}</Text></Text>
                </View>
            );
        }
    }

    fechData(itemId) {
        itemId=3064001518;
        fetch('http://220.189.234.2:17234/xiyilang/stick/search_by_makeup_code?makeup_code=' + itemId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {//1
            console.log(response);
            console.log(response.data);
            console.log(response.data.stickLogList[0]);
            console.log(response.data.stickLogList[0].stickId);
            this.setState({
                number: response.data.stickLogList[0].stickId
            })
        }).catch((err) => {//2
            alert(err);
        });
    }
}


class ScannerScreen extends Component<Props> {
    static navigationOptions = {
        title: '扫描',
    };

    onSuccess(e) {
        alert(e.data);
        this.goback(e.data)
    }
    goback(itemId){
        this.props.navigation.state.params.callback(itemId);
        this.props.navigation.goBack();
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
                    bottomContent={
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                            <TouchableOpacity style={styles.buttonTouchable}
                                              onPress={() => {
                                                  this.props.navigation.goBack();
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

const RootStack = createStackNavigator({
    Home: {
        screen: HomeScreen,
    },
    Details: {
        screen: ScannerScreen,
    },
}, {
    initialRouteName: 'Home',
});

const AppContainer = createAppContainer(RootStack);


export default class App extends React.Component {
    render() {
        return <AppContainer/>;
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
