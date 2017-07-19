/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Button,
    Modal,
    TouchableHighlight
} from 'react-native';

import moment from 'moment';
import realm from './Realm';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { ARROWS_3, ARROWS_6 } from './constants';
import { ListView } from 'realm/react-native';
import I18n from 'react-native-i18n';
const sample = [
    {
        date: moment().format("YYYY.MM.DD HH:mm"),
        total: 234,
        distance: 70,
        points: {
            type: ARROWS_3,
            scores: [[9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10],
                [9, 9, 10]]
        }
    },
    {
        date: moment().format("YYYY.MM.DD HH:mm"),
        total: 150,
        distance: 70,
        points: {
            type: ARROWS_6,
            scores: [[9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10]]
        }
    },
    {
        date: moment().format("YYYY.MM.DD HH:mm"),
        total: 150,
        distance: 70,
        points: {
            type: ARROWS_6,
            scores: [[9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10],
                [9, 9, 10, 10, 10, 10]]
        }
    }
];

I18n.fallbacks = true;
I18n.translations = {
    en: {
        indoor:'Indoor 3 arrows x 10 rounds',
        outdoor:'Outdoor 6 arrows x 6 rounds',
        cancel:'Cancel',
        total:'Total: ',
        copy:'Copy',
        remove:'Remove',
        done:'Done',
        confirm:'Confirm removing',
        buy1: 'Remove ads',
        buy2: 'Remove ads and donate $3',
        buy3: 'Remove ads and donate $31',
        info: 'Simple app for storing archery training results.',
        thanks: 'Thank you for your purchase. You will not see ads again',
        restore: 'Restore purchases',
    },
    ru: {
        indoor:'10 серий по 3 стрелы',
        outdoor:'6 серий по 6 стрел',
        cancel:'Отмена',
        total:'Сумма: ',
        copy:'Копировать',
        remove:'Удалить',
        done:'Готово',
        confirm:'Подтвердите удаление',
        buy1: 'Убрать рекламу',
        buy2: 'Убрать рекламу и пожертвовать $3',
        buy3: 'Убрать рекламу и пожертвовать $31',
        info: 'Простое приложение для хранения результатов тренировок по стрельбе из лука.',
        thanks: 'Спасибо за покупку. Больше рекламу вы не увидите',
        restore: 'Восстановить покупки',
    }
};

export default class Main extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Archery Results',
            headerRight: <Button title="Add new" onPress={() => navigation.state.params.setModalVisible(true)}/>,
            headerLeft: <Button title="Info" onPress={() => navigation.navigate('Info')}/>
        }
    };

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });


        this.resultItems = realm.objects('Result').sorted('creationDate', true);
        // if (this.resultItems.length < 1) {
        //     realm.write(() => {
        //         realm.create('Result', {
        //             id:1,
        //             creationDate: new Date(),
        //             done: false,
        //             total: 300,
        //             points: [{value: 'X'}, {value: '10'}, {value: 'X'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}, {value: '10'}],
        //             type: ARROWS_3
        //         });
        //     });
        // }
        let lastId = 0;
        if(this.resultItems.length > 0){
            lastId = this.resultItems[0].id;
        }

        this.resultItems.addListener((collection) => {
            if(collection.length > 0) {
                lastId = collection[0].id;
            }

            this.setState({lastId, dataSource: ds.cloneWithRows(collection)});
        });

        this.state = {
            dataSource: ds.cloneWithRows(this.resultItems),
            modalVisible: false,
            lastId
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({setModalVisible: this.setModalVisible.bind(this)});
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    renderItem(item) {
        return (
            <TouchableHighlight onPress={()=>{
                this.props.navigation.navigate('Points',{ mode:item.type, itemId: item.id })
            }}>
                <View style={styles.itemContainer}>
                    <View style={item.done ? styles.totalDone : styles.totalProgress}>
                        <Text style={styles.itemText}>
                            {item.total}{item.type === ARROWS_3 ? '/300' : '/360'}
                        </Text>
                    </View>
                    <View style={styles.date}>
                        <Text style={styles.itemText}>
                            {moment(item.creationDate).format("YYYY.MM.DD HH:mm")}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    renderModal() {
        return (
            <View style={styles.modalContainer}>
                <View style={styles.rowContainer}>
                    <Button
                        title={I18n.t('outdoor')}
                        color={'#3fdb83'}
                        onPress={() => {
                            this.setModalVisible(false);
                            this.props.navigation.navigate('Points',{ mode:ARROWS_6, lastId: this.state.lastId });
                        }}
                    />
                    <Button
                        title={I18n.t('indoor')}
                        color={'#21a5d1'}
                        onPress={() => {
                            this.setModalVisible(false);
                            this.props.navigation.navigate('Points',{ mode:ARROWS_3, lastId: this.state.lastId });
                        }}
                    />
                    <Button
                        title={I18n.t('cancel')}
                        color={'#e84a4a'}
                        onPress={() => this.setModalVisible(false)}
                    />
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    supportedOrientations={['portrait']}
                    onRequestClose={() => {
                        this.setModalVisible(false);
                    }}
                >
                    {this.renderModal()}
                </Modal>

                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}
                    style={styles.list}
                    scrollbarStyle="outsideOverlay"
                    enableEmptySections
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#353d49',
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#353d49',
        width: width,
        height: height,
        alignSelf: 'center',
    },
    rowContainer: {
        margin: 10
    },
    modalText: {
        fontSize: 18,
        margin:5
    },
    itemContainer: {
        height: 50,
        width: width,
        justifyContent: 'flex-start',
        alignSelf: 'center',
        borderStyle: 'solid',
        borderBottomColor: '#353d49',
        borderBottomWidth: 2,
        flexDirection:'row',
    },
    itemText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: 'white',
        textShadowColor:'#353d49',
        textShadowRadius:5,
        textShadowOffset: {width: 1, height: 1}
    },
    list: {
        flexDirection: 'column',
        width: width,
        marginBottom: 10,
    },
    totalDone:{
        backgroundColor:'#3fdb83',
        width: width/2,
        alignSelf:'center'
    },
    totalProgress:{
        backgroundColor:'#fca80c',
        width: width/2,
        alignSelf:'center'
    },
    date:{
        width: width/2,
        backgroundColor:'#aac8ff',
        alignSelf:'center'
    }
});

