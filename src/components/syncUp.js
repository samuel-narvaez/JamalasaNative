import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from '@react-navigation/native';
import styles from "../assets/styleMenu";
import Icon from 'react-native-vector-icons/AntDesign';
import IconFont from 'react-native-vector-icons/FontAwesome';

import {
    getDBConnection,
    getCowSync,
    getEventSync,
    getCowsCalf,
    getEquipmentSync,
    deleteAllCows,
    deleteAllEvents,
    deleteAllPivot,
    deleteAllEquipment
} from '../utils/database';

import { Requests } from '../utils/databaseServer';
const petitions = new Requests()


const NotNetwork = (props) => {
    const [data, setData] = useState([]);
    const [dataEvents, setDataEvents] = useState([]);
    const [dataPivot, setDataPivot] = useState([]);
    const [dataEquipment, setDataEquipment] = useState([]);

    //DISABLES
    const [isConnected, setIsConnected] = useState(false);
    const [iscowSycn, setIsCowSync] = useState(true);
    const [isEventSycn, setIsEventSync] = useState(true);
    const [isStateEventSycn, setIsStateEventSync] = useState(true);
    const [isStateAnimalSycn, setIsStateAnimalSync] = useState(true);
    const [iscalfSycn, setIsCalfSync] = useState(true);
    const [isequipmentSycn, setIsEquipmentSync] = useState(true);

    const dispatch = useDispatch();
    const statusEvents = useSelector((state) => { return state.products.eventsStatus });
    const statuscows = useSelector((state) => { return state.products.cowStatus });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        }
    }, []);

    const focusEffect = useCallback(function () {
        async function loadDataCows() {
            try {
                const db = await getDBConnection();
                const cowsFromDatabase = await getCowSync(db);
                setData(cowsFromDatabase);
                await db.close();
            } catch (error) {
                console.log(error.message);
            }
        }
        async function lodaDataEvents() {
            try {
                const db = await getDBConnection();
                const cowsFromDatabase = await getEventSync(db);
                setDataEvents(cowsFromDatabase);
                await db.close();
            } catch (error) {
                console.log(error.message);
            }
        }
        async function lodaDataCowsCalf() {
            try {
                const db = await getDBConnection();
                const pivotFromDatabase = await getCowsCalf(db);
                setDataPivot(pivotFromDatabase);
                await db.close();
            } catch (error) {
                console.log(error.message);
            }
        }
        async function lodaDataEquipment() {
            try {
                const db = await getDBConnection();
                const FromDatabase = await getEquipmentSync(db);
                setDataEquipment(FromDatabase);
                await db.close();
            } catch (error) {
                console.log(error.message);
            }
        }
        lodaDataCowsCalf();
        loadDataCows();
        lodaDataEvents();
        lodaDataEquipment();
    }, []);

    useFocusEffect(focusEffect);

    const boolSycn = (bool) => {
        setIsCowSync(bool);
        setIsEventSync(bool)
        setIsStateEventSync(bool)
        setIsStateAnimalSync(bool);
        setIsCalfSync(bool);
        setIsEquipmentSync(bool)
    }

    const deletAllDatabases = async() => {
        const db = await getDBConnection();
        await deleteAllCows(db);
        await deleteAllEvents(db);
        await deleteAllPivot(db);
        await deleteAllEquipment(db);
        await dispatch({ type: "EVENTSTATUS_CHANGE", payload: [] })
        await dispatch({ type: "COWSTATUS_CHANGE", payload: [] })
    }

    const SycnAll = async () => {
        let values = { data, dataEvents, dataPivot, dataEquipment, statusEvents, statuscows }
        let result = await petitions.insertAllElements(values);
        console.log(result);
        if (result.status == 200) {
            console.log('sincronizado correctamente');
            boolSycn(false);
            deletAllDatabases();
        } else {
            Alert.alert('ERROR',
                'NO SE PUDO SINCRONIZAR',
                [{
                    text: 'CERRAR',
                    onPress: () => boolSycn(true)
                }])
        }
    }

    const renderCows = ({ item }) => {
        return (
            <>
                <View style={[!iscowSycn && { display: 'none' }, styles.cardSync]}>
                    <View style={[styles.titleSync, { flexDirection: 'row' }]}>
                        <Text style={styles.textTitle}>Codigo : {item.code}</Text>
                        <Text style={[styles.textTitle, { left: 200 }]}>Sexo : {item.gender}</Text>
                        <Pressable style={styles.buttonSync} onPress={() => {}}>
                            <Icon name="sync" size={23} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.icons}>
                        <Text numberOfLines={2} style={styles.detailCard}>
                            Fecha : {item.date}
                        </Text>
                    </View>
                </View>
            </>
        );
    };

    const renderEvents = ({ item }) => {
        return (
            <>
                <View style={[!isEventSycn && { display: 'none' }, styles.cardSync]}>
                    <View style={[styles.titleSync, { flexDirection: 'row' }]}>
                        <Text style={styles.textTitle}>Evento : {item.cause}</Text>
                        <Pressable style={styles.buttonSync} onPress={() => {}}>
                            <Icon name="sync" size={23} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.icons}>
                        <Text numberOfLines={2} style={styles.detailCard}>
                            Fecha : {item.date}
                        </Text>
                    </View>
                </View>
            </>
        );
    };

    const renderPivot = ({ item }) => {
        return (
            <>
                <View style={[!isStateEventSycn && { display: 'none' }, styles.cardSync]}>
                    <View style={[styles.titleSync, { flexDirection: 'row' }]}>
                        <Text style={styles.textTitle}>Vaca : {item.codeCows}</Text>
                        <Text style={[styles.textTitle, { left: 200 }]}>Ternero : {item.codeCalf}</Text>
                        <Pressable style={styles.buttonSync} onPress={() => {}}>
                            <Icon name="sync" size={23} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.icons}>
                        <Text numberOfLines={2} style={styles.detailCard}>
                            Fecha : {item.date}
                        </Text>
                    </View>
                </View>
            </>
        );
    };

    const renderEquipment = ({ item }) => {
        return (
            <>
                <View style={[!isStateAnimalSycn && { display: 'none' }, styles.cardSync]}>
                    <View style={[styles.titleSync, { flexDirection: 'row' }]}>
                        <Text style={styles.textTitle}>Equipamiento : {item.nameEquipment}</Text>
                        <Pressable style={styles.buttonSync} onPress={() => {}}>
                            <Icon name="sync" size={23} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.icons}>
                        <Text numberOfLines={2} style={styles.detailCard}>
                            Fecha : {item.date}
                        </Text>
                    </View>
                </View>
            </>
        );
    };

    const renderEventsStatus = ({ item }) => {
        return (
            <>
                <View style={[!iscalfSycn && { display: 'none' }, styles.cardSync]}>
                    <View style={[styles.titleSync, { flexDirection: 'row' }]}>
                        <Text style={styles.textTitle}>Animal : {item.code}</Text>
                        <Text style={[styles.textTitle, { left: 200 }]}>Status : {item.status}</Text>
                        <Pressable style={styles.buttonSync} onPress={() => {}}>
                            <Icon name="sync" size={23} color="black" />
                        </Pressable>
                    </View>
                </View>
            </>
        );
    }

    const renderCowsStatus = ({ item }) => {
        return (
            <>
                <View style={[!isequipmentSycn && { display: 'none' }, styles.cardSync]}>
                    <View style={[styles.titleSync, { flexDirection: 'row' }]}>
                        <Text style={styles.textTitle}>Animal : {item.code}</Text>
                        <Text style={[styles.textTitle, { left: 200 }]}>Tiempo Preñez : {item.pregnancy}</Text>
                        <Pressable style={styles.buttonSync} onPress={() => {}}>
                            <Icon name="sync" size={23} color="black" />
                        </Pressable>
                    </View>
                </View>
            </>
        );
    }

    return (
        <>
            <View style={styles.view}>
                <View>
                    <Pressable style={[styles.buttonBack]} onPress={() => props.navigation.navigate('Menu')}>
                        <IconFont name="reply-all" size={30} color="black" />
                    </Pressable>
                    <Pressable
                        disabled={!isConnected}
                        style={[
                            styles.buttonSyncAll,
                            styles.buttonSuccess,
                            { backgroundColor: isConnected ? '#90EE90' : '#D3D3D3' }
                        ]}
                        onPress={() => SycnAll()}
                    >
                        <Text style={styles.textStyle}>
                            {isConnected ? 'Online - Sincronizar Todo' : 'Internet Deshabilitado'}
                        </Text>
                    </Pressable>
                </View>
                <Text style={styles.titleChart}>Ganado</Text>
                <FlatList
                    numColumns={2}
                    style={{ backgroundColor: 'white' }}
                    keyExtractor={item => item.id}
                    renderItem={renderCows}
                    data={data}
                />
                <Text style={styles.titleChart}>trazabilidad</Text>
                <FlatList
                    numColumns={2}
                    style={{ backgroundColor: 'white' }}
                    keyExtractor={item => item.id}
                    renderItem={renderEvents}
                    data={dataEvents}
                />
                <Text style={styles.titleChart}>Estados De Eventos</Text>
                <FlatList
                    numColumns={2}
                    style={{ backgroundColor: 'white' }}
                    keyExtractor={item => item.id}
                    renderItem={renderEventsStatus}
                    data={statusEvents}
                />
                <Text style={styles.titleChart}>Estados De Animal</Text>
                <FlatList
                    numColumns={2}
                    style={{ backgroundColor: 'white' }}
                    keyExtractor={item => item.id}
                    renderItem={renderCowsStatus}
                    data={statuscows}
                />
                <Text style={styles.titleChart}>Terneros</Text>
                <FlatList
                    numColumns={2}
                    style={{ backgroundColor: 'white' }}
                    keyExtractor={item => item.id}
                    renderItem={renderPivot}
                    data={dataPivot}
                />
                <Text style={styles.titleChart}>Equipamientos</Text>
                <FlatList
                    numColumns={2}
                    style={{ backgroundColor: 'white' }}
                    keyExtractor={item => item.id}
                    renderItem={renderEquipment}
                    data={dataEquipment}
                />
            </View>
        </>
    )
}

export default NotNetwork;
