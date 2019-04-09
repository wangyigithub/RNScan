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
    StyleSheet,
    Text,
    TouchableOpacity,
    Button,
    TextInput,
    Dimensions,
    ActivityIndicator
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
            isLoading:false
        };
    }

    render() {
        const itemId = this.state.text;
            return (
                <View style={{flex: 1, alignItems: 'center',}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                        <Text>
                            {'请输入批次号码：'}
                        </Text>
                        <TextInput
                            style={{
                                height: 40,
                                borderColor: 'gray',
                                borderWidth: 1,
                                marginLeft: 5,
                                flex: 1,
                                color: 'red'
                            }}
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
                                this.setState({
                                    text: '',
                                    number:'',
                                });
                                this.props.navigation.navigate('Details',{
                                    callback: (number) => {
                                        // this.setState({
                                        //     number:number,
                                        // })
                                    }
                                })
                            }}
                        />
                        <Button
                            title="去查询"
                            onPress={() => {
                                if (itemId === '' || itemId === null || itemId === undefined) return;
                                  this.fechData(itemId);
                            }}
                        />
                    </View>
                    {this.state.number === 0||this.state.number===null?null:<View style={{flex:1,marginTop:40,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{flexDirection: 'row',}}>
                            批次号：<Text style={{color: 'red'}}> {itemId}</Text>
                        </Text>
                        <Text style={{marginTop: 10, }}> 杆号：<Text
                            style={{color: 'red', fontSize: 24, fontWeight: 'bold'}}> {this.state.number}</Text></Text>
                    </View>}
                </View>
            );
    }
    fechData(itemId) {
        this.setState({
            isLoading:true
        });
        fetch('http://61.175.120.10:17234/xiyilang/stick/search_by_makeup_code?makeup_code=' + itemId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((responseData) => {//1
                this.setState({
                    isLoading:false,
                    number:responseData.data.stickLogList[0].stickId
                });
            }).catch((err) => {//2
            alert('没有查询到杆子');
            this.setState({
                isLoading:false
            });
        });
    }

}


class ScannerScreen extends Component{
    static navigationOptions = {
        title: '扫描',
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading:false
        };
    }

    fechData(itemId) {
        this.setState({
            isLoading:true
        });
        fetch('http://61.175.120.10:17234/xiyilang/stick/search_by_makeup_code?makeup_code=' + itemId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((responseData) => {//1
                this.setState({
                    isLoading:false,
                });
                alert("杆号：  "+responseData.data.stickLogList[0].stickId);
            }).catch((err) => {//2
            alert('没有查询到杆子');
            this.setState({
                isLoading:false
            });
        });
    }
    onSuccess(e) {
        if(e.data!==null&&e.data!==undefined&&e.data!==''){
            this.fechData(e.data);
        }
    }

    // goback(itemId) {
    //     this.props.navigation.state.params.callback(itemId);
    //     this.props.navigation.goBack();
    // }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" animating={this.state.isLoading}/>
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
                                <Text style={styles.buttonText}>去输入查询</Text>
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
